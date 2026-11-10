import assert from "node:assert/strict";
import { test } from "node:test";
import helpers from "yeoman-test";
import yaml from "js-yaml";
import AppGenerator from "../generators/app/index.js";

const namespace = "com.example.app";
const appURI = "com/example/app";

async function generate(options = {}, answers = {}) {
	const prompts = [];
	const notices = [];
	const commands = [];
	const result = await helpers
		.create(AppGenerator)
		.withOptions({
			embedded: true,
			appNamespace: namespace,
			framework: "OpenUI5",
			frameworkVersion: "1.136.0",
			author: "Test Author",
			newdir: false,
			initrepo: false,
			...options
		})
		.withAnswers(answers)
		.onGenerator((generator) => {
			const prompt = generator.prompt.bind(generator);
			generator.prompt = (questions) => {
				prompts.push(...questions);
				return prompt(questions);
			};
			const log = generator.log.bind(generator);
			generator.log = (...args) => {
				notices.push(...args);
				return log(...args);
			};
			generator.spawnCommandSync = (command, args) => {
				commands.push([command, args]);
				return { status: 0 };
			};
		})
		.run();
	return {
		result,
		prompts,
		notices,
		commands,
		read: (file) => result.fs.read(result.cwd + "/" + file),
		json: (file) => result.fs.readJSON(result.cwd + "/" + file)
	};
}

function assertXmlProject({ result, read, json }) {
	result.assertFile(["webapp/view/App.view.xml", "webapp/view/Main.view.xml"]);
	result.assertNoFile(["webapp/view/App.tsx", "webapp/view/Main.tsx", ".babelrc", ".babelrc.json"]);
	const pkg = json("package.json");
	assert.equal(pkg.dependencies, undefined);
	assert.equal(pkg.devDependencies["@babel/plugin-transform-react-jsx"], undefined);
	assert.equal(pkg.devDependencies["ui5-tooling-transpile"], "^3.14.0");
	const tsconfig = json("tsconfig.json");
	assert.equal(tsconfig.compilerOptions.jsx, undefined);
	assert.equal(tsconfig.compilerOptions.jsxImportSource, undefined);
	assert.deepEqual(tsconfig.compilerOptions.types, ["@openui5/types", "@types/qunit"]);
	const manifest = json("webapp/manifest.json");
	assert.deepEqual(manifest["sap.ui5"].rootView, { viewName: namespace + ".view.App", type: "XML", id: "app" });
	assert.equal(manifest["sap.ui5"].routing.config.viewType, "XML");
	assert.equal(manifest["sap.ui5"].routing.config.path, namespace + ".view");
	assert.equal(manifest["sap.ui5"].routing.targets.main.name, "Main");
	assert.deepEqual(manifest["sap.ui5"].dependencies.libs, { "sap.ui.core": {}, "sap.m": {} });
	const config = yaml.load(read("ui5.yaml"));
	assert.equal(config.customConfiguration, undefined);
	assert.equal(config.builder.settings, undefined);
	assert.equal(config.builder.customTasks[0].configuration, undefined);
	assert.equal(config.server.customMiddleware[0].configuration, undefined);
	assert.deepEqual(yaml.load(read("ui5-coverage.yaml")).server.customMiddleware[0].configuration, { coverage: true });
	for (const file of ["README.md", "webapp/index-cdn.html", "tsconfig.json", "ui5.yaml", "ui5-coverage.yaml"]) {
		assert.doesNotMatch(read(file), /jsx|TSX|tsx|cfgTranspile/);
	}
	for (const opa of ["webapp/test/integration/pages/MainPage.ts"]) {
		assert.match(read(opa), new RegExp(`"${namespace}\.view\.Main"`), `${opa}: expected dot-notation viewName`);
		assert.doesNotMatch(read(opa), /module:/, `${opa}: unexpected module: prefix`);
	}
}

function assertTsxProject({ result, read, json, notices }, types = "@openui5/types") {
	assert.equal(
		notices.some((n) => /incubating/i.test(String(n))),
		true,
		"incubation notice was not logged"
	);
	result.assertFile(["webapp/view/App.tsx", "webapp/view/Main.tsx", "webapp/controller/App.controller.ts", "webapp/controller/Main.controller.ts"]);
	result.assertNoFile(["webapp/view/App.view.xml", "webapp/view/Main.view.xml", ".babelrc", ".babelrc.json"]);
	const pkg = json("package.json");
	assert.equal(pkg.dependencies["@ui5-community/jsx-runtime"], "^0.2.0");
	assert.equal(pkg.devDependencies["@babel/plugin-transform-react-jsx"], "^7.0.0");
	assert.equal(pkg.devDependencies["ui5-tooling-transpile"], "^3.14.0");
	assert.equal(pkg.dependencies.react, undefined);
	assert.equal(pkg.devDependencies[types], json("webapp/manifest.json")["sap.ui5"].dependencies.minUI5Version);
	const tsconfig = json("tsconfig.json");
	assert.equal(tsconfig.compilerOptions.jsx, "react-jsx");
	assert.equal(tsconfig.compilerOptions.jsxImportSource, "ui5/community/jsx/runtime");
	assert.deepEqual(tsconfig.compilerOptions.types, [types, "@types/qunit", "@ui5-community/jsx-runtime"]);
	assert.deepEqual(tsconfig.include, ["./webapp/**/*"]);
	assert.deepEqual(tsconfig.compilerOptions.paths[appURI + "/*"], ["./webapp/*"]);
	const config = yaml.load(read("ui5.yaml"));
	const transpile = config.customConfiguration["config-ui5-tooling-transpile"];
	assert.deepEqual(transpile, { transformJSX: { runtime: "automatic", importSource: "ui5/community/jsx/runtime" } });
	assert.equal(config.builder.customTasks[0].configuration, transpile);
	assert.equal(config.server.customMiddleware[0].configuration, transpile);
	assert.deepEqual(config.builder.settings.includeDependency, ["ui5.community.jsx.runtime"]);
	assert.deepEqual(config.builder.resources.excludes, ["test/e2e/**"]);
	assert.equal(config.builder.customTasks[0].afterTask, "replaceVersion");
	assert.equal(config.server.customMiddleware[0].afterMiddleware, "compression");
	assert.equal(config.server.customMiddleware[1].name, "ui5-middleware-livereload");
	const coverage = yaml.load(read("ui5-coverage.yaml"));
	assert.deepEqual(coverage.server.customMiddleware[0].configuration, { transformJSX: transpile.transformJSX, coverage: true });
	const manifest = json("webapp/manifest.json")["sap.ui5"];
	assert.equal(manifest.rootView.viewName, "module:" + appURI + "/view/App");
	assert.equal(manifest.rootView.type, undefined);
	assert.deepEqual(manifest.dependencies.libs, { "sap.ui.core": {}, "sap.m": {}, "ui5.community.jsx.runtime": {} });
	assert.equal(manifest.routing.config.async, true);
	assert.equal(manifest.routing.config.viewType, undefined);
	assert.equal(manifest.routing.config.path, undefined);
	assert.equal(manifest.routing.targets.main.name, "module:" + appURI + "/view/Main");
	const roots = read("webapp/index-cdn.html").match(/data-sap-ui-(?:resource-roots|resourceroots)='([^']+)'/)[1];
	assert.deepEqual(JSON.parse(roots), { [namespace]: "./", "ui5.community.jsx.runtime": "./resources/ui5/community/jsx/runtime/" });
	assert.match(read("webapp/view/Main.tsx"), /press="\.sayHello"/);
	assert.match(read("webapp/view/Main.tsx"), /formatter: formatter\.formatValue/);
	assert.match(read("webapp/view/Main.tsx"), /createContent\(\): Control/);
	assert.doesNotMatch(read("webapp/view/Main.tsx"), /const helloButton/);
	assert.match(read("webapp/view/App.tsx"), /id="app"/);
	for (const name of ["App", "Main"]) {
		assert.match(read(`webapp/view/${name}.tsx`), /getAutoPrefixId\(\): boolean \{\s+return true;/);
		assert.match(read(`webapp/view/${name}.tsx`), new RegExp(namespace + "\\.controller\\." + name));
	}
	for (const opa of ["webapp/test/integration/pages/MainPage.ts"]) {
		assert.match(read(opa), new RegExp(`"module:${appURI}/view/Main"`), `${opa}: expected module: viewName`);
		assert.doesNotMatch(read(opa), new RegExp(`"${namespace}\.view\.Main"`), `${opa}: unexpected dot-notation viewName`);
	}
}

test("XML is the prompt default and has no JSX configuration", async () => {
	const project = await generate();
	try {
		assertXmlProject(project);
		const prompt = project.prompts.find((question) => question.name === "viewType");
		assert.equal(prompt.default, "XML");
		assert.deepEqual(
			prompt.choices.map((c) => c.value),
			["XML", "TSX"]
		);
		assert.match(prompt.choices[1].name, /incubating/);
		assert.equal(
			project.notices.some((n) => /incubating/i.test(n)),
			false
		);
	} finally {
		project.result.cleanup();
	}
});

test("explicit XML skips the view prompt", async () => {
	const project = await generate({ viewType: "XML" });
	try {
		assertXmlProject(project);
		assert.equal(
			project.prompts.some((question) => question.name === "viewType"),
			false
		);
	} finally {
		project.result.cleanup();
	}
});

test("TSX option configures typed views and all transpilation paths", async () => {
	const project = await generate({ viewType: "tsx" });
	try {
		assertTsxProject(project);
		assert.equal(
			project.prompts.some((question) => question.name === "viewType"),
			false
		);
		assert.match(project.read("webapp/view/Main.tsx"), /IllustratedMessage/);
		assert.match(project.read("webapp/view/Main.tsx"), /enableVerticalResponsiveness=\{true\}/);
	} finally {
		project.result.cleanup();
	}
});

test("TSX prompt retains SAPUI5 types and the legacy test layout", async () => {
	const project = await generate({ framework: "SAPUI5", frameworkVersion: "1.120.0" }, { viewType: "TSX" });
	try {
		assertTsxProject(project, "@sapui5/types");
		project.result.assertFile("webapp/test/unit/unitTests.qunit.html");
		project.result.assertNoFile("webapp/test/Test.qunit.html");
	} finally {
		project.result.cleanup();
	}
});

test("TSX handles older UI5 controls, types and CDN attribute names", async () => {
	const project = await generate({ frameworkVersion: "1.90.1", viewType: "TSX" });
	try {
		assertTsxProject(project, "@openui5/ts-types-esm");
		assert.match(project.read("webapp/view/Main.tsx"), /MessagePage/);
		assert.doesNotMatch(project.read("webapp/view/Main.tsx"), /IllustratedMessage|enableVerticalResponsiveness/);
		assert.match(project.read("webapp/index-cdn.html"), /data-sap-ui-resourceroots=/);
	} finally {
		project.result.cleanup();
	}
});

test("UI5 1.98 TSX does not use the newer responsiveness property", async () => {
	const project = await generate({ frameworkVersion: "1.98.0", viewType: "TSX" });
	try {
		assertTsxProject(project, "@openui5/ts-types-esm");
		assert.match(project.read("webapp/view/Main.tsx"), /IllustratedMessage/);
		assert.doesNotMatch(project.read("webapp/view/Main.tsx"), /enableVerticalResponsiveness/);
	} finally {
		project.result.cleanup();
	}
});

test("invalid view option falls back to the view prompt", async () => {
	const project = await generate({ viewType: "React" }, { viewType: "TSX" });
	try {
		assertTsxProject(project);
		assert.equal(
			project.prompts.some((question) => question.name === "viewType"),
			true
		);
	} finally {
		project.result.cleanup();
	}
});

import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
	js.configs.recommended,
	jsdoc.configs["flat/recommended"],
	{
		languageOptions: {
			globals: {
				...globals.node
			},
			ecmaVersion: 2023,
			sourceType: "module"
		},
		rules: {
			"no-unused-vars": "warn"
		}
	},
	{
		ignores: [
			"eslint.config.js",

			// Ignore node_files
			"node_modules/",

			// Ignore templates
			"generators/*/templates/",

			// Ignore test files
			"test/"
		]
	}
];

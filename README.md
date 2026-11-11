# generator-ui5-ts-app

[![License Status][license-image]][license-url]

[Yeoman](https://yeoman.io/) generator kickstarting the development of UI5 applications using TypeScript. The generator incorporates the latest best-practices, is using the [UI5 CLI](https://ui5.github.io/cli/) and the UI5 CLI extensions provided by the [UI5 community](https://github.com/ui5-community/ui5-ecosystem-showcase/). It is maintained by the UI5 community and [OpenUI5](https://openui5.org)/[SAPUI5](https://ui5.sap.com) developers. This generator was build as a plug-in for the community project [Easy-UI5](https://github.com/SAP/generator-easy-ui5/) by [SAP](https://github.com/SAP/).

## Usage with Easy-UI5

```bash
$> npm i -g yo generator-easy-ui5
$> yo easy-ui5 ts-app

     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `
```

After the generation of your project you can use `npm start` (or `yarn start`) to start the local development server.

## Standalone usage

Note the different greeting when the generator starts:

```bash
$> npm i -g yo
$> yo ./generator-ui5-ts-app

     _-----_     ╭──────────────────────────╮
    |       |    │      Welcome to the      │
    |--(o)--|    │   generator-ui5-ts-app   │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `
```

## View syntax

Choose **XML** (the default) or **TSX** when prompted. You can also select the syntax non-interactively using `--viewType=XML` or `--viewType=TSX`.

TSX projects use [`@ui5-community/jsx-runtime`](https://github.com/ui5-community/jsx-runtime), not React. The generator creates typed UI5 views in `webapp/view/*.tsx` and configures TypeScript, build/dev/coverage transpilation, manifest dependencies, and the CDN resource root. The existing npm installation step installs the runtime and the v7 Babel JSX plugin; `ui5-tooling-transpile` already satisfies the required version (>=3.12).

XML projects do not include TSX views, the JSX runtime, or JSX-specific configuration.

## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.

## Contributing

We welcome any type of contribution (code contributions, pull requests, issues) to this generator equally.

### Development Setup

```bash
git clone https://github.com/ui5-community/generator-ui5-ts-app.git
cd generator-ui5-ts-app
npm run setup
```

`npm run setup` installs dependencies and sets up the git hooks (Husky pre-commit for formatting and linting). The project uses `ignore-scripts=true` in `.npmrc` for supply-chain security, which prevents the automatic `prepare` lifecycle script from running — `npm run setup` handles both steps in one command.

`npm run test:generator` runs the automated generator tests without installing generated application dependencies. `npm test` starts the interactive generator for manual testing.

## License

This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the LICENSE file.

[license-image]: https://img.shields.io/github/license/ui5-community/generator-ui5-ts-app.svg
[license-url]: https://github.com/ui5-community/generator-ui5-ts-app/blob/main/LICENSE

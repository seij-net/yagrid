# yagrid
Yet another grid. A tool for building dynamic tables and grids with built-in editor and type registry. Targeted to management software.

Under heavy development. Do not use yet.

# Installation

Using yarn `yarn add @seij/yagrid` or npm `npm i @seij/yagrid`.

YAGrid depends on [React](https://reactjs.org/) that shall already be installed in your project as it comes as a peer-dependency. Your React version must support hooks.

We export this component as 
* [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (located in `dist/index.es.js`)
* [CommonJS module](https://nodejs.org/docs/latest/api/modules.html) (located in `dist/index.js`)



# Structure

YAGrid is build with Typescript. Unfortunatly a bug with `@rollup/plugin-typescript` doesn't generate Typescript definition files

# Known issues

* @rollup/plugin-typescript doesn't generate Typescript definition files


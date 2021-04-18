# yagrid
Yet another grid. A tool for building dynamic tables and grids with built-in editor and type registry. Targeted to management software.

![heavy development](https://img.shields.io/badge/-under_heavy_development-darkred.svg?style=flat)
![production ready](https://img.shields.io/badge/Production_ready-not_yet-darkred.svg?style=flat)

![test and build](https://github.com/seij-net/yagrid/actions/workflows/node.js.yml/badge.svg)



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

# Build

After cloning use the classic `npm install` and `npm run build` commands to build. 
Build is taken care of by [Rollup](https://rollupjs.org/). 

To launch the Storybook interface, use `npm run storybook`.

Launch `npm run test` for unit tests.

# Datatypes

Datatypes add rendering features to types. Each grid can use a registry of data types to customize globally
the rendering of known types. 

It is possible to build a type registry outside the scope of a particular grid, and pass the 
type registry as grid properties. 

You can also have as many as registries as you want and reuse them across grids of your app.

An important point is that you CAN NOT provide column definitions with types unknown by the registry
of the displayed grid.


## Default minimalist registry

If no type registry is given, a default one will be used with the following known types: 
`string`, `boolean`, `int`, `decimal`, `percent`. All data will render `toString()`. Nullish values will render
as empty text.

## Custom registry

To create a custom registry, use the `TypesRegistryBuilder` and add your types. Each type must come with a renderer
that accepts the data and possiblty nullish values (null, undefined). It MUST return a string (even if empty)

Each type registred will be added to the default registry. If one of your types overlap with the default registry
(like `percent` in following example), your type wins.

You can combine your type registry with custom renderer for columns. If a renderer had been provided for a column, 
it _wins_ over the registry.

To be clear, when data must be displayed, we use the first found in this order : column renderer, custom type renderer,
default type renderer. 

If you ask yourself how to manage i18n issues, here we are. You get a precise control on how data is displayed. 
Up to you. An advice would be to have a "ready-to-go" registry at start of your app, immutable, and then pass
it to all your grids. This way, your collegues won't have to be bothered about formatting in your app anymore.

```typescript
 const customTypes = new TypesRegistryBuilder()
    .add("percent", data => data==null ? "" : ""+(data * 100)+"%")
    .add("monetaryAmountInt", data => ""+(data || 0))
    .add("monetaryAmountDecimal", function(data){
        return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, style: "decimal" })
            .format(data||0)
    })
    .build()

const gridProps: GridProps<S> = {
    //... other props like columns, plugins, etc.
    types: customTypes
}

 return <Grid {...gridProps} />
```

Note that in this example nullish data are handled differently depending on the type. This is useful
in many cases. For example, on one table you don't want "0" numbers to appear, on others you want them whatever.


# Provided plugins

Currently provided plugins

| Name | Description |
|------|-------------|
| item-add | ItemAdd | Provides a toolbar button to add an item. When user clicks, an editable row opens to edit the item. Provides confirm, cancel button and a temporary item to be able to cancel. |
| item-edit | ItemEdit | Provides row editing features. A button triggers row editing, then user can validate or cancel the row. Also manages a temporary item to be able to cancel. |
| item-delete | ItemDelete | Provides row button to delete item, confirm and cancel buttons. |

# Plugin development

## Naming

Internal plugins as well a third-party plugins shall expose a `Config` object and a `create(cfg:Config)` function.

The goal is to provide an unified naming for importing and instanciating plugins. 

```typescript
// Could be third party plugins
import { EditItem, DeleteItem, AddItem } from "@seij/yagrid";
// When creating the grid
const props: GridProps<ItemType> = {
    // ...
    plugins: [
        EditItem.create({ /** edit item config */ }),
        DeleteItem.create({ /** edit item config */ }),
        AddItem.create({ /** edit item config */ }),
        // ...
    ]
}
return <Grid {...props} />
```
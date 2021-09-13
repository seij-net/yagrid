# Changelog

⭐ = New feature

🐞 = Bug fix

📢 = Beaking change

## 0.1.20

* dynamic columns

## 0.1.19

* plugin item-add: onAddConfirm can return any payload
* plugin item-delete: onAddConfirm can return any payload
* plugin item-edit: onEdit can return any payload

## 0.1.18

* 🐞 removed debug stuff

## 0.1.17

* 🐞 fix build issues


## 0.1.16

* 🐞 missing other exports

## 0.1.15

* 🐞 missing LoadingState export

## 0.1.14

* ⭐ most plugin UI actions are fully configurable and can be customized
* upgrade storybook
* Deprecation warning: soon the grid will not provide default action buttons

## 0.1.13

* better error handling, separate global grid errors and per-row errors
* improved edition error handling

## 0.1.12

* plugin table-classnames : add typings for clsx styles

## 0.1.11

* plugin table-classnames : can use clsx style

## 0.1.10

* 📢 plugin table-classnames : don't send just column name, but whole column definition

## 0.1.9

* ⭐ plugin table-classnames : new class names
* 🐞 plugin table-classnames : CSS names

## 0.1.8

* ⭐ table class names plugin
* better extension points and composition
* aimed at usage for different layouts (material-ui is the target)

## 0.1.7

* 📢 footer extensions points revisited
* 📢 old actionItemHandlers are removed from plugin definition
* new simplier organization for action buttons
* usage of React context for further composition
* code refactorings to make the code more simple

## 0.1.6

* 📢 Item action buttons are now on the end of the row

## 0.1.5

* ⭐ Makes all plugin extension point optionals
* 📢 Breaking changes : Remove default css class "data"
* 📢 Removed "editable" property
* Better plugin composition

## 0.1.4

* ⭐ Table footer plugin (experimental)

## 0.1.3

* ⭐ Identifiers can be of any type

## 0.1.2

* 🐞 Remove storybook examples

## 0.1.1

* First real usage

## 0.0.1 and 0.0.2 

* Project initialization
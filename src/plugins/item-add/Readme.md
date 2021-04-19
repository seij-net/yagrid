# item-add

## Features

* "Add" button added in toolbar
* When adding, an editing row is added to the top of the grid with the same layout
  as other items
* Editing is made in a temporary item that you can discard or accept
* Provides ok / cancel buttons
* Provides a pending state while data is saved and error management

## Configuration

| name | type | description |
| ---- | ---- | ----------- |
| onAddTemplate | () => Promise&lt;T> | When user want to add an item, you must provide an empty item template with default initializations and an id. 
| onAddConfirm | (item:T) => Promise&lt;void> | Called when process of editing is done and we need to save the newly edited item.




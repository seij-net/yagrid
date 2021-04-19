# item-edit

Provides editing features to cells. 

* a button at start of item switches item in edit mode
* cancel and ok button as well as "loading" state after ok button is pressed
* can configure which cells are editabled based on current item
* item changes are put in a separate temporary item during the changes, unless
  user clicks on "ok" button. 
* when user finishes, a callback can be used to save an item with a Promise

## Configuration

| property | type | description |
|----------|------|-------|
| editable | editable?: (item: T) => boolean | tells if an item is editable
| onEdit   | onEdit: (nextItem: T) => Promise&lt;void&gt; | called when user clicked on ok button to validate the item and save it. You must throw an exception to display an error

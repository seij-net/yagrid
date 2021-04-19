# item-delete

## Features

* button to delete an item on each row
* the button provides a confirm/cancel option
* callback with promise to effectively delete the item and a special state during promise resolution


## Configuration

| name | type | description |
|------|------|-------------|
| onDelete | (item: T) => Promise&lt;void> | Provide a callback for deleting specified item from the list |
| deletable | (item: T) => boolean | Optional, tells if item can be deleted or not. Defaults to true if not specified
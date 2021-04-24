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
| labelDeleteButton? | ReactNode | When using default buttons, label or component for delete button
| labelDeleteConfirm? | ReactNode | When using default buttons, label or component for delete confirmation text
| labelDeleteConfirmButton? | ReactNode | When using default buttons, label or component for delete confirmation button
| labelDeleteCancelButton? | ReactNode | When using default buttons, label or component for delete cancel button

`labelXXX` are optional. They provide a label, as a React element or a string to default buttons when they are used.
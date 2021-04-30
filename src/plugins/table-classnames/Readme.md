# Table class names

## Features

- Display or compose class names for table layout.
- Each config property can return null, undefined, string
- properties with items CAN take the item as parameter and adjust according to item
- properties with items and column name CAN adjust based on current item and column name
- you can use conditional syntax `{ classname: boolean, ...}` like in (`clsx`)[https://github.com/lukeed/clsx] 
  or (`JedWatson/classnames`)[https://github.com/JedWatson/classnames]. Under the ground, we use `clsx`
  

## Configuration

- tableWrapper?: ClassNames,
- actionGenericToolbar?: ClassNames,
- table?: ClassNames;
- thead?: ClassNames;
- theadRow?: ClassNames;
- theadCell?: ClassNames | ((columnName: string) => ClassNames);
- theadCellActionsStart?: ClassNames,
- theadCellActionsEnd?: ClassNames,
- tbody?: ClassNames;
- tbodyRow?: ClassNames | ((item: T) => ClassNames);
- tbodyCell?: ClassNames | ((item: T, columnName: string) => ClassNames);
- tbodyRowExtra?: ClassNames | ((item: T) => ClassNames);
- tbodyCellExtra?: ClassNames | ((item: T) => ClassNames);
- tbodyCellActionsStart?: ClassNames | ((item: T) => ClassNames),
- tbodyCellActionsEnd?: ClassNames | ((item: T) => ClassNames),
- tfoot?: ClassNames;
- tfootRow?: ClassNames;

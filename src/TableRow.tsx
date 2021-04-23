import React from "react";

import { TableCell } from "./TableCell";
import { TableItemActions } from "./TableItemActions";
import { ExtraItemExtension, GridPluginList, GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { TableActionDispatch, TableActionList, GridColumnDefinitionInternal } from "./types";
import { isNil } from "lodash-es";

export interface TableRowProps<T> {
  /** indique si la ligne est en cours d'édition */
  gridState: GridState;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsStart: boolean;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsEnd: boolean;
  /** Actions d'une ligne */
  actionsItem: TableActionList;
  /** données à afficher pour cette ligne */
  item: T;
  /** définition des colonnes */
  itemDefinitions: GridColumnDefinitionInternal<T>[];
  /** quand une action est lancée. On récupère l'action, la donnée de la ligne et l'évènement source  */
  onActionItemDispatch: TableActionDispatch;
  types: TableTypesRegistry;
  /** list of plugins */
  plugins: GridPluginList<T>;
  /**
   * Extra items extension point
   */
  extraItems: ExtraItemExtension<T>[],
  columnCount: number,
  onEditItemChange: (newItem: T) => void;
}

export const TableRow: React.FC<TableRowProps<any>> = ({
  itemDefinitions,
  gridState,
  item,
  hasActionsStart,
  hasActionsEnd,
  actionsItem,
  onActionItemDispatch,
  extraItems,
  columnCount,
  onEditItemChange,
  plugins
}) => {
  const cells = itemDefinitions.map((def) => {
    
    return (
      <TableCell
        key={def.name}
        plugins={plugins}
        gridState={gridState}
        render={def.render}
        editor={def.editor}
        item={item}
        itemPropertyName={def.name}
        onEditItemChange={onEditItemChange}
      />
    );
  });

  const startActionsCell = hasActionsStart ? (
    <td key="__YAGRID_START_ACTIONS">
      <TableItemActions
        item={item}
        editingState={gridState}
        actionItemList={actionsItem.filter(it=>it.position==="start")}
        handleAction={onActionItemDispatch}
      />
    </td>
  ) : null;
  const endActionsCell = hasActionsEnd ? (
    <td key="__YAGRID_END_ACTIONS">
      <TableItemActions
        item={item}
        editingState={gridState}
        actionItemList={actionsItem.filter(it=>it.position==="end" || it.position===undefined)}
        handleAction={onActionItemDispatch}
      />
    </td>
  ) : null;
  const extraItemList = extraItems
    .map(ext=>ext(item))
    .filter(extra => !isNil(extra))
  
  const extraItemRow = extraItemList.length > 0  ? <tr key="__yagrid_item_extra"><td colSpan={columnCount}>{extraItemList}</td></tr> : null
  const regularRow = <tr key="__yagrid_item">{startActionsCell}{cells}{endActionsCell}</tr>
  

  return extraItemRow ? <>{regularRow}{extraItemRow}</> : regularRow;
};

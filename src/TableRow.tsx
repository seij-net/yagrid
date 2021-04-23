import React from "react";

import { TableCell } from "./TableCell";
import { TableItemActions } from "./TableItemActions";
import { GridPluginList, GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { TableActionDispatch, TableActionList, GridColumnDefinitionInternal } from "./types";

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
  return (
    <tr>
      {startActionsCell}
      {cells}
      {endActionsCell}
    </tr>
  );
};

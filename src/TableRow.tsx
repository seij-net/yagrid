import React from "react";

import { TableCell } from "./TableCell";
import { TableItemActions } from "./TableItemActions";
import { GridPluginList, GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { TableActionDispatch, TableActionList, GridColumnDefinitionInternal } from "./types";

export interface TableRowProps<T> {
  /** indique si la ligne est en cours d'édition */
  gridState: GridState;
  /** indique si la ligne a des boutons d'action, cad. on affiche les boutons pour éditer sur une colonne*/
  actionsItemDisplay: boolean;
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
  actionsItemDisplay,
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

  const editableActionsCell = actionsItemDisplay ? (
    <td key="__TABLE_EDITABLE__">
      <TableItemActions
        item={item}
        editingState={gridState}
        actionItemList={actionsItem}
        handleAction={onActionItemDispatch}
      />
    </td>
  ) : null;
  return (
    <tr>
      {cells}
      {editableActionsCell}
    </tr>
  );
};

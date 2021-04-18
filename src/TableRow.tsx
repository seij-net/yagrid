import React from "react";

import { TableCell } from "./TableCell";
import { TableItemActions } from "./TableItemActions";
import { GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { TableActionDispatch, TableActionList, TableColumnDefinitionInternal } from "./types";

export interface TableRowProps<T> {
  /** indique si la ligne est en cours d'édition */
  editingState: GridState;
  /** indique si la ligne a des boutons d'action, cad. on affiche les boutons pour éditer sur une colonne*/
  actionsItemDisplay: boolean;
  /** Actions d'une ligne */
  actionsItem: TableActionList;
  /** données à afficher pour cette ligne */
  item: T;
  /** définition des colonnes */
  itemDefinitions: TableColumnDefinitionInternal<T>[];
  /** quand une action est lancée. On récupère l'action, la donnée de la ligne et l'évènement source  */
  onActionItemDispatch: TableActionDispatch;
  types: TableTypesRegistry;
  onEditItemChange: (newItem: T) => void;
}

export const TableRow: React.FC<TableRowProps<any>> = ({
  itemDefinitions,
  editingState,
  item,
  actionsItemDisplay,
  actionsItem,
  onActionItemDispatch,
  onEditItemChange,
}) => {
  const cells = itemDefinitions.map((def) => {
    const editing = item[editingState.identifierProperty] === editingState.editedItemId;
    return (
      <TableCell
        key={def.name}
        editing={editing}
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
        editingState={editingState}
        actionItemList={actionsItem}
        handleAction={onActionItemDispatch}
      />
    </td>
  ) : null;
  return (
    <tr>
      {editableActionsCell}
      {cells}
    </tr>
  );
};

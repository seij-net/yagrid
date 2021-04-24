import isNil from "lodash-es/isNil";
import React, { ReactElement, ReactNode } from "react";

import { GridState } from "./types";
import { TableAction, TableActionDispatch, TableActionList } from "./types";

export interface TableItemActionsProps<T> {
  item: T;
  editingState: GridState;
  actionItemList: TableActionList;
  handleAction: TableActionDispatch;
}

/**
 * Ne doit pas s'afficher si le tableau n'est pas éditable !
 */
export const TableItemActions: React.FC<TableItemActionsProps<any>> = ({
  actionItemList,
  item,
  editingState,
  handleAction,
}) => {
  const actionsToDisplay = actionItemList.filter((action) => {
    // Si aucune condition n'existe pour l'action, on l'affiche quoi qu'il arrive
    if (isNil(action.displayed)) return true;
    const displayed = action.displayed(editingState, item);
    return displayed;
  });

  return (
    <>
      {actionsToDisplay.map((it) => (
        <span key={it.name}>
          <TableItemActionTrigger item={item} action={it} editingState={editingState} dispatch={handleAction} />
        </span>
      ))}
    </>
  );
};

export const TableItemActionTrigger: React.FC<TableItemActionTriggerProps<any>> = ({
  item,
  action,
  editingState,
  dispatch,
}) => {
  const i:ReactNode = action.renderItem ? action.renderItem(item,editingState, dispatch) : null
  return <>{i}</>
};

interface TableItemActionTriggerProps<T> {
  item: T,
  action: TableAction;
  editingState: GridState;
  dispatch: TableActionDispatch;
}

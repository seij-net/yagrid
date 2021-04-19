import isNil from "lodash-es/isNil";
import React, { ReactElement } from "react";

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
          <TableActionTrigger action={it} editingState={editingState} dispatch={handleAction} />
        </span>
      ))}
    </>
  );
};

export const TableActionTrigger: React.FC<TableActionTriggerProps> = ({
  action,
  editingState,
  dispatch,
}): ReactElement => {
  return action.render(editingState, dispatch);
};

interface TableActionTriggerProps {
  action: TableAction;
  editingState: GridState;
  dispatch: TableActionDispatch;
}

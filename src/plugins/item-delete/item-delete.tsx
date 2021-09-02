import React, { ReactNode } from "react";
import { cloneDeep } from "lodash-es";
import { Config, PLUGIN_NAME, UI_ACTION_DELETE } from "./item-delete-config";
import { actionErrorItem, actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer } from "../../types";
import { useGrid } from "../../GridContext";
import { createUIActionPropsDelete, getPluginConfig } from "./item-delete-builder";

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------


function actionDelete(prevState: GridState, item: any): GridState {
  const id = item[prevState.identifierProperty]
  const errorResetState = actionErrorItem(prevState, id, undefined)
  return {
    ...errorResetState,
    editedItemId: id,
    editedItemState: "delete_confirm",
    editedItemValue: cloneDeep(item),
  };
}

function actionDeleteCancel(prevState: GridState): GridState {
  const errorResetState = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(errorResetState);
}

function actionDeleteCommitStarted(prevState: GridState): GridState {
  const errorResetState = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionToState(errorResetState, "delete_commit_pending")
}

function actionDeleteCommitSucceded(prevState: GridState): GridState {
  const errorResetState = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(errorResetState)
}

function actionDeleteCommitFailed(prevState: GridState, error: Error): GridState {
  const errorResetState = actionErrorItem(prevState, prevState.editedItemId, error)
  return actionReset(errorResetState);
}

export const reducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "delete":
      result = actionDelete(prevState, action.item);
      break;
    case "delete_cancel":
      result = actionDeleteCancel(prevState);
      break;
    case "delete_commit_started":
      result = actionDeleteCommitStarted(prevState);
      break;
    case "delete_commit_succeded":
      result = actionDeleteCommitSucceded(prevState);
      break;
    case "delete_commit_failed":
      result = actionDeleteCommitFailed(prevState, action.error);
      break;
    default:
      result = prevState;
  }
  return result;
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const ConfirmDeleteButton: React.FC<{
  onDelete: (evt: any) => void;
  onDeleteCancel: (evt: any) => void;
  onDeleteConfirm: (evt: any) => void;
  labelDeleteButton?: ReactNode;
  labelDeleteConfirm?: ReactNode;
  labelDeleteConfirmButton?: ReactNode;
  labelDeleteCancelButton?: ReactNode;
  confirm: boolean;
  disabled: boolean;
}> = ({
  onDelete,
  onDeleteCancel,
  onDeleteConfirm,
  confirm,
  labelDeleteButton = "❌",
  labelDeleteConfirm = "Confirm ?",
  labelDeleteConfirmButton = "❌",
  labelDeleteCancelButton = "⬅️",
}) => {
    return (
      <>
        {!confirm && <button onClick={onDelete}>{labelDeleteButton}</button>}
        {confirm && labelDeleteConfirm}
        {confirm && <button onClick={onDeleteConfirm}>{labelDeleteConfirmButton}</button>}
        {confirm && <button onClick={onDeleteCancel}>{labelDeleteCancelButton}</button>}
      </>
    );
  };

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------


type ActionDeleteButtonProps<T> = Pick<
  Config<T>,
  "onDelete" | "labelDeleteButton" | "labelDeleteCancelButton" | "labelDeleteConfirm" | "labelDeleteConfirmButton"
> & { item: T };



const ActionDeleteButton: React.FC<ActionDeleteButtonProps<any>> = ({
  item,
}) => {
  const { state, dispatch } = useGrid();
  const config = getPluginConfig()
  const buttonProps = createUIActionPropsDelete(item)
  // We do not double-check that item is deletable or not, we assume the
  // grid did its job by calling displayed
  return (
    <ConfirmDeleteButton
      {...buttonProps}
      labelDeleteButton={config.labelDeleteButton}
      confirm={state.editedItemState === "delete_confirm"}
      labelDeleteConfirm={config.labelDeleteConfirm}
      labelDeleteCancelButton={config.labelDeleteCancelButton}
      labelDeleteConfirmButton={config.labelDeleteConfirmButton}
    />
  );
};

export function create<T>(config: Config<T>): GridPlugin<any> {
  return {
    name: PLUGIN_NAME,
    config: config,
    reducer: reducer,
    actionItemList: [
      {
        name: UI_ACTION_DELETE,
        displayed: (state, item) => {
          // If item can not be deleted, whatever happens, do not the display feature
          if (config.deletable && !config.deletable(item)) return false;
          return (
            state.editedItemState === undefined ||
            (state.editedItemState === "delete_confirm" && state.editedItemId === item.id)
          );
        },
        // state.editedItemId === item.id && (state.editedItemState === "edit" || state.editedItemState === "delete_confirm"),
        renderItem: (item) => <ActionDeleteButton {...config} item={item} />,
      },
    ],
  };
}

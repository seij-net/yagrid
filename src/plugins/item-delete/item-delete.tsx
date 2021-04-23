import React, { ReactNode } from "react";
import { cloneDeep } from "lodash-es";
import { TableAction } from "../..";

import { actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer } from "../../types";

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

function actionDeleteCommitFailed(prevState: GridState, error: Error): GridState {
  return { ...actionReset(prevState), error: error };
}

function actionDeleteCancel(prevState: GridState): GridState {
  return actionReset(prevState);
}

function actionDelete(prevState: GridState, item: any): GridState {
  return {
    ...prevState,
    editedItemId: item[prevState.identifierProperty],
    editedItemState: "delete_confirm",
    editedItemValue: cloneDeep(item),
  };
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
      result = actionToState(prevState, "delete_commit_pending");
      break;
    case "delete_commit_succeded":
      result = actionReset(prevState);
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

const PLUGIN_NAME = "edit_delete";

/**
 * Configuration for delete plugin
 */
export interface Config<T> {
  /**
   * Provide a callback for deleting specified item from the list
   */
  onDelete: (item: T) => Promise<void>;
  /**
   * Tells if item can be deleted or not. Defaults to true if not specified
   */
  deletable?: (item: T) => boolean;
  /**
   * When using default buttons, label or component for delete button
   */
  labelDeleteButton?: ReactNode;
  /**
   * When using default buttons, label or component for delete confirmation text
   */
  labelDeleteConfirm?: ReactNode;
  /**
   * When using default buttons, label or component for delete confirmation button
   */
  labelDeleteConfirmButton?: ReactNode;
  /**
   * When using default buttons, label or component for delete cancel button
   */
  labelDeleteCancelButton?: ReactNode;
}

export function create<T>(config: Config<T>): GridPlugin<any> {
  const ACTION_EDIT_DELETE: TableAction = {
    name: "edit_delete",
    displayed: (state, item) => {
      // If item can not be deleted, whatever happens, do not the display feature
      if (config.deletable && !config.deletable(item)) return false;
      return (
        state.editedItemState === undefined ||
        (state.editedItemState === "delete_confirm" && state.editedItemId === item.id)
      );
    },
    // state.editedItemId === item.id && (state.editedItemState === "edit" || state.editedItemState === "delete_confirm"),
    renderItem: (item, state, dispatch) => {
      // We do not double-check that item is deletable or not, we assume the
      // grid did its job by calling displayed
      return (
        <ConfirmDeleteButton
          onDelete={dispatch.listeners.onDelete}
          confirm={state.editedItemState === "delete_confirm"}
          onDeleteCancel={dispatch.listeners.onDeleteCancel}
          onDeleteConfirm={dispatch.listeners.onDeleteConfirm}
          disabled={state.editedItemState === "delete_commit_pending"}
          labelDeleteButton={config.labelDeleteButton}
          labelDeleteConfirm={config.labelDeleteConfirm}
          labelDeleteCancelButton={config.labelDeleteCancelButton}
          labelDeleteConfirmButton={config.labelDeleteConfirmButton}
        />
      );
    },
  };
  return {
    name: "edit_delete",
    reducer: reducer,
    actionGenericList: [],
    actionItemList: [ACTION_EDIT_DELETE],
    actionItemListeners: (editState, dispatch, item) => {
      return {
        onDelete: async () => {
          dispatch({ type: "delete", item: item });
        },
        onDeleteConfirm: async () => {
          try {
            dispatch({ type: "delete_commit_started" });
            await config.onDelete(editState.editedItemValue);
            dispatch({ type: "delete_commit_succeded" });
          } catch (error) {
            dispatch({ type: "delete_commit_failed", error: error });
          }
        },
        onDeleteCancel: async () => {
          dispatch({ type: "delete_cancel" });
        },
      };
    },
  };
}

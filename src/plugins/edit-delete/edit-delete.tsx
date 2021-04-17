import React from "react";
import { cloneDeep } from "lodash-es";
import { TableAction } from "../..";

import { actionReset, actionToState, TableState, TableStateReducer } from "../../TableState";
import { TablePlugin } from "../../types";

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

function actionDeleteCommitFailed(prevState: TableState, error: Error): TableState {
  return { ...prevState, itemState: "delete_confirm", error: error };
}

function actionDeleteCancel(prevState: TableState): TableState {
  return { ...prevState, itemState: "edit" };
}

function actionDelete(prevState: TableState, item: any): TableState {
  return {
    ...prevState,
    itemId: item[prevState.identifierProperty],
    itemState: "delete_confirm",
    itemValue: cloneDeep(item),
  };
}

export const reducer: TableStateReducer = (prevState, action) => {
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

export const ACTION_EDIT_DELETE: TableAction = {
  name: "edit_delete",
  displayed: (state, item) =>
    state.itemId === item.id && (state.itemState === "edit" || state.itemState === "delete_confirm"),
  render: (state, dispatch) => {
    console.log(state);
    return (
      <ConfirmDeleteButton
        onDelete={dispatch.listeners.onDelete}
        confirm={state.itemState === "delete_confirm"}
        onDeleteCancel={dispatch.listeners.onDeleteCancel}
        onDeleteConfirm={dispatch.listeners.onDeleteConfirm}
        disabled={state.itemState === "delete_commit_pending"}
      />
    );
  },
};

const ConfirmDeleteButton: React.FC<{
  onDelete: (evt: any) => void;
  onDeleteCancel: (evt: any) => void;
  onDeleteConfirm: (evt: any) => void;
  confirm: boolean;
  disabled: boolean;
}> = ({ onDelete, onDeleteCancel, onDeleteConfirm, confirm }) => {
  return (
    <>
      {!confirm && <button onClick={onDelete}>Supprimer</button>}
      {confirm && "Supprimer ? "}
      {confirm && <button onClick={onDeleteConfirm}>OK</button>}
      {confirm && <button onClick={onDeleteCancel}>Annuler</button>}
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
}

export function deletePlugin<T>(config: Config<T>): TablePlugin<any> {
  return {
    name: "edit_delete",
    reducer: reducer,
    dataListTransform: (editState, data) => data,
    actionGenericList: [],
    actionGenericListeners: (e, d) => ({}),
    actionItemList: [ACTION_EDIT_DELETE],
    actionItemListeners: (editState, dispatch, item) => {
      return {
        onDelete: async () => {
          dispatch({ type: "delete", item: item });
        },
        onDeleteConfirm: async () => {
          try {
            dispatch({ type: "delete_commit_started" });
            await config.onDelete(editState.itemValue);
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

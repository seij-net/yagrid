import { cloneDeep, isEqual, isNil } from "lodash-es";
import React, { ReactNode } from "react";

import { actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer, TableAction } from "../../types";

const PLUGIN_NAME = "edit_inline";

function actionEdit(prevState: GridState, item: any): GridState {
  return {
    ...prevState,
    editedItemId: item[prevState.identifierProperty],
    editedItemState: "edit",
    editedItemValue: cloneDeep(item),
  };
}

function actionItemChange(prevState: GridState, item: any): GridState {
  if (isEqual(item, prevState.editedItemValue)) return prevState;
  return { ...prevState, editedItemValue: item };
}

function actionEditCommitFailed(prevState: GridState, error: Error): GridState {
  return { ...prevState, editedItemState: "edit", error: error };
}

export const tableEditReducer: GridStateReducer = (prevState, action): GridState => {
  let result: GridState;
  switch (action.type) {
    case "item_change":
      result = actionItemChange(prevState, action.item);
      break;
    case "edit":
      result = actionEdit(prevState, action.item);
      break;
    case "edit_cancel":
      result = actionReset(prevState);
      break;
    case "edit_commit_started":
      result = actionToState(prevState, "edit_commit_pending");
      break;
    case "edit_commit_succeded":
      result = actionReset(prevState);
      break;
    case "edit_commit_failed":
      result = actionEditCommitFailed(prevState, action.error);
      break;
    default:
      result = prevState;
      break;
  }
  return result;
};
export interface Config<T> {
  /**
   * Called when an item is successfully edited and need to be saved
   */
  onEdit: (nextItem: T) => Promise<void>;
  /**
   * Tells if an item is editable
   */
  editable?: (item: T) => boolean;
  /**
   * Label for edit button, when using default buttons
   */
  labelEditButton?: ReactNode;
  /**
   * Label for edit confirm button, when using default buttons
   */
  labelEditButtonConfirm?: ReactNode;
  /**
   * Label for edit cancel button, when using default buttons
   */
  labelEditButtonCancel?: ReactNode;
}
export function create<T>(config: Config<T>): GridPlugin<T> {
  const {
    onEdit,
    editable,
    labelEditButton = "📝",
    labelEditButtonConfirm = "✅",
    labelEditButtonCancel = "⬅️",
  } = config;
  const editableSafe = isNil(editable) ? () => true : editable;
  const ACTION_EDIT: TableAction = {
    name: "edit",
    displayed: (state, item) => editableSafe(item) && state.editedItemState === undefined,
    render: (state, dispatch) => {
      return <button onClick={dispatch.listeners.onEditItem}>{labelEditButton}</button>;
    },
  };
  const ACTION_EDIT_OK: TableAction = {
    name: "edit_ok",
    displayed: (state, item) =>
      editableSafe(item) && state.editedItemId === item.id && state.editedItemState === "edit",
    render: (state, dispatch) => {
      return <button onClick={dispatch.listeners.onEditItemCommit}>{labelEditButtonConfirm}</button>;
    },
  };

  const ACTION_EDIT_CANCEL: TableAction = {
    name: "edit_cancel",
    displayed: (state, item) =>
      editableSafe(item) && item.id === state.editedItemId && state.editedItemState === "edit",
    render: (state, dispatch) => {
      return <button onClick={dispatch.listeners.onEditItemCancel}>{labelEditButtonCancel}</button>;
    },
  };

  return {
    name: PLUGIN_NAME,
    reducer: tableEditReducer,
    isEditing: (state, item, property) =>
      (item as any)[state.identifierProperty] === state.editedItemId &&
      (state.editedItemState === "edit" || state.editedItemState === "edit_commit_pending"),
    actionGenericList: [],
    actionItemList: [ACTION_EDIT, ACTION_EDIT_OK, ACTION_EDIT_CANCEL],
    actionGenericListeners: (editState, dispatch) => ({}),
    actionItemListeners: (editState, dispatch, item) => ({
      onEditItem: async () => {
        dispatch({ type: "edit", item: item });
      },
      onEditItemCancel: async () => {
        dispatch({ type: "edit_cancel" });
      },
      onEditItemCommit: async () => {
        try {
          dispatch({ type: "edit_commit_started" });
          await onEdit(editState.editedItemValue);
          dispatch({ type: "edit_commit_succeded" });
        } catch (error) {
          dispatch({ type: "edit_commit_failed", error: error });
        }
      },
    }),
    dataListTransform: (editState, data) => data,
  };
}

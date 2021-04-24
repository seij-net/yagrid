import { cloneDeep } from "lodash-es";
import React, { Dispatch, ReactNode } from "react";
import { LoadingState, useGrid } from "../../GridContext";

import { actionReset, actionToState } from "../../TableState";
import { Action, GridPlugin, GridState, GridStateReducer, TableAction, TableGenericAction } from "../../types";

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

function actionAdd(prevState: GridState, item: any): GridState {
  return {
    ...prevState,
    editedItemId: item[prevState.identifierProperty],
    editedItemState: "add",
    editedItemValue: cloneDeep(item),
  };
}
function actionAddCommitFailed(prevState: GridState, error: Error): GridState {
  return { ...prevState, editedItemState: "add", error: error };
}
export const reducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "add":
      result = actionAdd(prevState, action.item);
      break;
    case "add_cancel":
      result = actionReset(prevState);
      break;
    case "add_commit_started":
      result = actionToState(prevState, "edit_commit_pending");
      break;
    case "add_commit_failed":
      result = actionAddCommitFailed(prevState, action.error);
      break;
    case "add_commit_succeded":
      result = actionReset(prevState);
      break;

    default:
      result = prevState;
  }
  return result;
};
// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

const PLUGIN_NAME = "edit_add";

export interface Config<T> {
  /**
   * Called when we need to add a new item, provides an empty item template.
   */
  onAddTemplate: () => Promise<T>;
  /**
   * Called when process of editing is done and we need to save the newly
   * edited item.
   */
  onAddConfirm: (item: T) => Promise<void>;
  /**
   * Label for add button, when using default buttons
   */
  labelAddButton?: ReactNode;
  /**
   * Label for add confirm button, when using default buttons
   */
  labelAddButtonConfirm?: ReactNode;
  /**
   * Label for add cancel button, when using default buttons
   */
  labelAddButtonCancel?: ReactNode;
}

export interface TableEditorAddPlugin<T> extends GridPlugin<T> {}

export type PluginFactory<T = {}> = (config: Config<T>) => TableEditorAddPlugin<T>;

const ActionAdd: React.FC<Pick<Config<any>, "onAddTemplate" | "labelAddButton">> = ({ labelAddButton, onAddTemplate }) => {
  const { state, dispatch, loadingState } = useGrid();
  const onAddItem = async () => {
    try {
      const itemTemplate = await onAddTemplate();
      dispatch({ type: "add", item: itemTemplate });
    } catch (error) {
      console.error("Problem while creating template item", error);
    }
  }
  const disabled = loadingState !== LoadingState.loaded || state.editedItemState !== undefined
  return (
    <button disabled={disabled} onClick={onAddItem}>
      {labelAddButton}
    </button>
  );
};

export function create<T>(config: Config<T>): TableEditorAddPlugin<T> {
  const {
    onAddTemplate,
    onAddConfirm,
    labelAddButton = "➕",
    labelAddButtonConfirm = "➕",
    labelAddButtonCancel = "⬅️",
  } = config;
  const ACTION_ADD_OK: TableAction = {
    name: "add_ok",
    displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
    renderItem: (item, state, dispatch) => {
      return <button onClick={dispatch.listeners.onAddItemConfirm}>{labelAddButtonConfirm}</button>;
    },
  };
  const ACTION_ADD_CANCEL: TableAction = {
    name: "add_cancel",
    displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
    renderItem: (item, state, dispatch) => {
      return <button onClick={dispatch.listeners.onAddItemCancel}>{labelAddButtonCancel}</button>;
    },
  };
  return {
    name: PLUGIN_NAME,
    reducer: reducer,
    actionGenericList: [{
      name: "add",
      render: ()=><ActionAdd labelAddButton={labelAddButton} onAddTemplate={onAddTemplate} />
    }],
    actionItemList: [ACTION_ADD_OK, ACTION_ADD_CANCEL],
    isEditing: (state, item, itemPropertyName) =>
      (item as any)[state.identifierProperty] === state.editedItemId &&
      (state.editedItemState === "add" || state.editedItemState === "add_commit_pending"),
    actionItemListeners: (
      editState: GridState,
      dispatch: Dispatch<Action>,
      item: T
    ): { [p: string]: () => Promise<void> } => {
      return {
        onAddItemConfirm: async () => {
          try {
            dispatch({ type: "add_commit_started" });
            await onAddConfirm(editState.editedItemValue);
            dispatch({ type: "add_commit_succeded" });
          } catch (error) {
            dispatch({ type: "add_commit_failed", error: error });
          }
        },
        onAddItemCancel: async () => {
          dispatch({ type: "add_cancel" });
        },
      };
    },
    dataListTransform: (editState, data) => {
      const newList = [] as T[];
      if (editState.editedItemState === "add" || editState.editedItemState === "add_commit_pending") {
        newList.push(editState.editedItemValue);
      }
      if (data) {
        newList.push(...data);
      }
      return newList;
    },
  };
}

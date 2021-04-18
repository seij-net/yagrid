import { cloneDeep, isEqual } from "lodash";
import {  actionReset, actionToState } from "../../TableState";
import { TablePlugin, TableState, TableStateReducer } from "../../types";

const PLUGIN_NAME = "edit_inline";

function actionEdit(prevState: TableState, item: any): TableState {
  return {
    ...prevState,
    itemId: item[prevState.identifierProperty],
    itemState: "edit",
    itemValue: cloneDeep(item),
  };
}

function actionItemChange(prevState: TableState, item: any): TableState {
  if (isEqual(item, prevState.itemValue)) return prevState;
  return { ...prevState, itemValue: item };
}

function actionEditCommitFailed(prevState: TableState, error: Error): TableState {
  return { ...prevState, itemState: "edit", error: error };
}

export const tableEditReducer: TableStateReducer = (prevState, action): TableState => {
  let result: TableState;
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
  onEdit: (nextItem: T) => Promise<void>;
}
export function editInline<T>(config: Config<T>): TablePlugin<T> {
  const { onEdit } = config;
  return {
    name: PLUGIN_NAME,
    reducer: tableEditReducer,
    actionGenericList: [],
    actionItemList: [],
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
          await onEdit(editState.itemValue);
          dispatch({ type: "edit_commit_succeded" });
        } catch (error) {
          dispatch({ type: "edit_commit_failed", error: error });
        }
      },
    }),
    dataListTransform: (editState, data) => data,
  };
}

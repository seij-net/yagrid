import { cloneDeep, isEqual } from "lodash";
import {  actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer } from "../../types";

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
  onEdit: (nextItem: T) => Promise<void>;
}
export function editInline<T>(config: Config<T>): GridPlugin<T> {
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

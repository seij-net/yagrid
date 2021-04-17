import { cloneDeep } from "lodash-es";
import { TableState, TableStateReducer, actionReset, actionToState } from "./TableState";
import { TablePlugin } from "./types";
function actionDeleteCommitFailed(
  prevState: TableState,
  error: Error
): TableState {
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

export const deletePlugin = ():TablePlugin<any> => {
    return {
        name: "edit_delete",
        reducer: reducer,
        dataListTransform: (editState, data) => data,
        actionGenericList: [],
        actionGenericListeners: (e,d) =>({}),
        actionItemList: [],
        actionItemListeners: (e,d,i) =>({})
    }
}
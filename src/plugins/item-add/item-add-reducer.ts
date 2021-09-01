
// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

import { GridState, GridStateReducer } from "../../types";
import { actionErrorItem, actionReset, actionToState } from "../../TableState";
import { cloneDeep } from "lodash-es";

function actionAdd(prevState: GridState, item: any): GridState {
  const id = item[prevState.identifierProperty];
  const prevStateErrorReset = actionErrorItem(prevState, id, undefined);
  return {
    ...prevStateErrorReset,
    editedItemId: id,
    editedItemState: "add",
    editedItemValue: cloneDeep(item)
  };
}

function actionAddCommitFailed(prevState: GridState, error: Error): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, error);
  return {
    ...prevStateErrorReset,
    editedItemState: "add"
  };
}

function actionAddCancel(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined);
  return actionReset(prevStateErrorReset);
}

function actionAddCommitSucceded(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined);
  return actionReset(prevStateErrorReset);
}

function actionAddCommitStarted(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined);
  return actionToState(prevStateErrorReset, "edit_commit_pending");
}

export const reducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "add":
      result = actionAdd(prevState, action.item);
      break;
    case "add_cancel":
      result = actionAddCancel(prevState);
      break;
    case "add_commit_started":
      result = actionAddCommitStarted(prevState);
      break;
    case "add_commit_failed":
      result = actionAddCommitFailed(prevState, action.error);
      break;
    case "add_commit_succeded":
      result = actionAddCommitSucceded(prevState);
      break;

    default:
      result = prevState;
  }
  return result;
};
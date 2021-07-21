import isEqual from "lodash-es/isEqual";
import isNil from "lodash-es/isNil";
import omit from "lodash-es/omit";

import { GridEditedItemStateName, GridState, GridStateReducer } from "./types";

export const createTableEditDefaultState = (identifierProperty: string): GridState => ({
  editedItemId: undefined,
  editedItemState: undefined,
  editedItemValue: undefined,
  identifierProperty: identifierProperty,
  error: undefined,
  errorItems: {}
});

export function actionReset(prevState: GridState): GridState {
  return { ...prevState, editedItemId: undefined, editedItemState: undefined, editedItemValue: undefined };
}

export function actionToState(prevState: GridState, stateName: GridEditedItemStateName): GridState {
  return { ...prevState, editedItemState: stateName };
}

export function actionItemChange(prevState: GridState, item: any): GridState {
  if (isEqual(item, prevState.editedItemValue)) return prevState;
  return { ...prevState, editedItemValue: item };
}

export function actionError(prevState:GridState, error: Error|undefined):GridState {
  return { ...prevState, error }
}
export function actionErrorItem(prevState:GridState, identifier: any, error: Error|undefined): GridState {
  if (isNil(error)) {
    // Removes an error
    return {...prevState, errorItems: omit(prevState.errorItems, [identifier])}
  } else {
    // adds error
    return {...prevState, errorItems: {...prevState.errorItems, [identifier]:error}}
  }
}
const defaultReducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "item_change":
      result = actionItemChange(prevState, action.item);
      break;
    case "error":
      result = actionError(prevState, action.error);
      break;
    case "error_item":
      result = actionErrorItem(prevState, action.identifier, action.error);
      break;
    default:
      result = prevState;
  }
  return result;
};

export const createReducer = (pluginReducers: GridStateReducer[]): GridStateReducer => {
  const allReducers = [...pluginReducers, defaultReducer];
  const combined: GridStateReducer = (prevState, action) => {
    return allReducers.reduce((acc, plugin) => plugin(acc, action), prevState);
  };
  return combined;
};

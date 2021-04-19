import { isEqual } from "lodash-es";

import { GridEditedItemStateName, GridState, GridStateReducer } from "./types";

export const createTableEditDefaultState = (identifierProperty: string): GridState => ({
  editedItemId: undefined,
  editedItemState: undefined,
  editedItemValue: undefined,
  identifierProperty: identifierProperty,
  error: undefined,
});

export function actionReset(prevState: GridState): GridState {
  return { ...prevState, editedItemId: undefined, editedItemState: undefined, editedItemValue: undefined };
}

export function actionToState(prevState: GridState, stateName: GridEditedItemStateName): GridState {
  return { ...prevState, editedItemState: stateName };
}

function actionItemChange(prevState: GridState, item: any): GridState {
  if (isEqual(item, prevState.editedItemValue)) return prevState;
  return { ...prevState, editedItemValue: item };
}

const defaultReducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "item_change":
      result = actionItemChange(prevState, action.item);
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

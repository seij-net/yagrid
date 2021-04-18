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

export const createReducer = (pluginReducers: GridStateReducer[]): GridStateReducer => {
  const allReducers = [...pluginReducers];
  const combined: GridStateReducer = (prevState, action) => {
    return allReducers.reduce((acc, plugin) => plugin(acc, action), prevState);
  };
  return combined;
};

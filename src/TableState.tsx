import { TableEditItemStateName, TableState, TableStateReducer } from "./types";



export const createTableEditDefaultState = (identifierProperty: string): TableState => ({
  itemId: undefined,
  itemState: undefined,
  itemValue: undefined,
  identifierProperty: identifierProperty,
  error: undefined,
});


export function actionReset(prevState: TableState): TableState {
  return { ...prevState, itemId: undefined, itemState: undefined, itemValue: undefined };
}

export function actionToState(prevState: TableState, stateName: TableEditItemStateName): TableState {
  return { ...prevState, itemState: stateName };
}

export const createReducer = (pluginReducers: TableStateReducer[]): TableStateReducer => {
  const allReducers = [...pluginReducers];
  const combined: TableStateReducer = (prevState, action) => {
    return allReducers.reduce((acc, plugin) => plugin(acc, action), prevState);
  };
  return combined;
};

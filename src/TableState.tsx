export type TableEditItemStateName =
  | "edit"
  | "edit_commit_pending"
  | "delete_confirm"
  | "delete_commit_pending"
  | "add"
  | "add_commit_pending";

export interface TableState {
  /** Identifier of item under edition or undefined if not editing */
  itemId: string | undefined;
  /** State of edition */
  itemState: undefined | TableEditItemStateName;
  /** Current value. Holds a temporary item value which is a copy of original item value, pending confirmation */
  itemValue: any | undefined;
  /** Column used as identifier */
  identifierProperty: string;
  /** Error if any */
  error: Error | undefined;
}

export type TableStateReducer = (prevState: TableState, action: Action) => TableState;

export const createTableEditDefaultState = (identifierProperty: string): TableState => ({
  itemId: undefined,
  itemState: undefined,
  itemValue: undefined,
  identifierProperty: identifierProperty,
  error: undefined,
});

export type Action =
  | { type: "item_change"; item: any }
  | { type: "edit"; item: any }
  | { type: "edit_cancel" }
  | { type: "edit_commit_started" }
  | { type: "edit_commit_succeded" }
  | { type: "edit_commit_failed"; error: Error }
  | { type: "delete"; item: any }
  | { type: "delete_cancel" }
  | { type: "delete_commit_started" }
  | { type: "delete_commit_succeded" }
  | { type: "delete_commit_failed"; error: Error }
  | { type: "add"; item: any }
  | { type: "add_cancel" }
  | { type: "add_commit_started" }
  | { type: "add_commit_succeded" }
  | { type: "add_commit_failed"; error: Error };

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

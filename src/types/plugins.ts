import { Dispatch } from "react";
import { TableActionList } from "./public";
import { Action, GridState, GridStateReducer } from "./state";

export interface TablePlugin<T> {
  /** Plugin unique name */
  name: string
  reducer: GridStateReducer
  dataListTransform: (editState: GridState, data: T[]) => T[],
  actionGenericList: TableActionList,
  actionGenericListeners(editState: GridState, dispatchEditState: Dispatch<Action>): { [p: string]: () => Promise<void> };
  actionItemList: TableActionList,
  actionItemListeners(editState: GridState, dispatchEditState: Dispatch<Action>, item: T): { [p: string]: () => Promise<void> };
}

export type TablePluginList<T> = TablePlugin<T>[]


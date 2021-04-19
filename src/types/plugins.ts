import { Dispatch } from "react";
import { TableActionList } from "./public";
import { Action, GridState, GridStateReducer } from "./state";

/**
 * Grid plugin definition
 * 
 * All plugins must implement this interface.
 */
export interface GridPlugin<T> {
  /** 
   * Plugin unique name 
   **/
  name: string
  /**
   * Reducer to apply to grid state
   */
  reducer: GridStateReducer
  /**
   * Data transformer to apply before rendering already fetched data. 
   * This is a data post-processor. Note that it is very dangerous to 
   * alter data structure and that in any case YOU MUST NOT change the
   * original data, rather provide a copy. If no data transform is needed
   * return original data. 
   * For example : 
   * (data) => needAlteration ? newData : data
   */
  dataListTransform: (editState: GridState, data: T[]) => T[],
  /**
   * Returns true if the specified cell is currently being edited
   */
  isEditing?: (gridstate:GridState, item: T, itemPropertyName: string) => boolean
  /**
   * List of actions to provide to main toolbar
   */
  actionGenericList: TableActionList,
  /**
   * Shall disapear
   */
  actionGenericListeners(editState: GridState, dispatchEditState: Dispatch<Action>): { [p: string]: () => Promise<void> };
  /**
   * List of actions to provide for each item
   */
  actionItemList: TableActionList,
  /**
   * Shall disapear
   */
  actionItemListeners(editState: GridState, dispatchEditState: Dispatch<Action>, item: T): { [p: string]: () => Promise<void> };
}

/**
 * List of Grid plugins
 */
export type GridPluginList<T> = GridPlugin<T>[]


import { Dispatch, ReactNode } from "react";
import { TableActionList } from "./public";
import { Action, GridState, GridStateReducer } from "./state";

export type DataListTransformer<T> = (editState: GridState, data: T[]) => T[]

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
   * Extension point: state reducer to apply to grid state
   * 
   * Given a state and an action, resolves the next state
   * 
   * If action is unknown to this reducer you must return the original state
   */
  reducer?: GridStateReducer
  /**
   * Data transformer to apply before rendering already fetched data. 
   * This is a data post-processor. Note that it is very dangerous to 
   * alter data structure and that in any case YOU MUST NOT change the
   * original data, rather provide a copy. If no data transform is needed
   * return original data. 
   * For example : 
   * (data) => needAlteration ? newData : data
   */
  dataListTransform?: DataListTransformer<T>,
  /**
   * Returns true if the specified cell is currently being edited
   */
  isEditing?: (gridstate:GridState, item: T, itemPropertyName: string) => boolean
  /**
   * List of actions to provide to main toolbar
   */
  actionGenericList?: TableActionList,
  /**
   * Shall disapear
   */
  actionGenericListeners?: (editState: GridState, dispatchEditState: Dispatch<Action>) => { [p: string]: () => Promise<void> };
  /**
   * List of actions to provide for each item
   */
  actionItemList?: TableActionList,
  /**
   * Shall disapear
   */
  actionItemListeners?: (editState: GridState, dispatchEditState: Dispatch<Action>, item: T) => { [p: string]: () => Promise<void> };
  /**
   * Footer extension point
   */
  footer?: FooterExtensionPoint<T>
}

/**
 * Extension point for footer plugins
 */
export interface FooterExtensionPoint<T> {
  /** Element to display on full span */
  span?: (data:T[])=>ReactNode,
  /** Additional rows that the extension point may produce */
  rows?: (data:T[], columnCount: number) => ReactNode
}

/**
 * List of Grid plugins
 */
export type GridPluginList<T> = GridPlugin<T>[]

/**
 * All extension points cumulated
 */
export interface ExtensionPoints<T> {
  reducer: GridStateReducer[],
  actionGenericList: TableActionList,
  actionItemList: TableActionList,
  dataListTransform: DataListTransformer<T>[]
}
import { ReactNode } from "react";
import { TableActionList, TableGenericActionList } from "./public";
import { GridState, GridStateReducer } from "./state";

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
  isEditing?: EditingExtensionPoint<T>,
  /**
   * List of actions to provide to main toolbar
   */
  actionGenericList?: TableGenericActionList,
  /**
   * List of actions to provide for each item
   */
  actionItemList?: TableActionList,
  /**
   * Footer extension point, element to display on full span
   */
  footerSpan?: FooterSpanExtensionPoint<T>,
  /**
   * Footer rows, additional rows that the extension point may produce
   */
  footerRows?: FooterRowsExtensionPoint<T>
  /**
   * Extra row items that shall be placed in a container below each row
   * Takes item currently displayed and returns (or not) an extra item
   * that shall be displayed below the row
   */
  extraItem?: ExtraItemExtension<T>
}

/**
 * Extension point for footer plugins
 */
export type FooterSpanExtensionPoint<T> = (data: T[]) => ReactNode

export type FooterRowsExtensionPoint<T> = (data: T[], columnCount: number) => ReactNode

/**
 * Displays extra items below displayed item
 */
export type ExtraItemExtension<T> = (item: T) => ReactNode

export type EditingExtensionPoint<T> = (gridstate: GridState, item: T, itemPropertyName: string) => boolean

/**
 * List of Grid plugins
 */
export type GridPluginList<T> = GridPlugin<T>[]


/**
 * All extension points cumulated
 */
export interface ExtensionPoints<T> {
  reducer: GridStateReducer[],
  actionGenericList: TableGenericActionList,
  actionItemList: TableActionList,
  dataListTransform: DataListTransformer<T>[],
  extraItem: ExtraItemExtension<T>[],
  isEditing: EditingExtensionPoint<T>[],
  footerSpan: FooterSpanExtensionPoint<T>[],
  footerRows: FooterRowsExtensionPoint<T>[]
}
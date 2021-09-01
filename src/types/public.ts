/*
 * -----------------------------------------------------------------------------
 * Public API types. Those are re-exported for public use.
 * ----------------------------------------------------------------------------- 
 */

import { FC, ReactElement, ReactNode } from "react";
import { TableTypesRegistry } from "../TableTypesRegistry";
import { GridDataSource } from "./data";
import { GridLayoutProps } from "./layout";
import { GridPluginList } from "./plugins";
import { GridState } from "./state";


/**
 * Grid configuration properties.
 * <T> is the type of item that the grid displays.
 */
export interface GridProps<T> {
  /**
   * Name of CSS class to apply to table.
   * Can be used like usual `className` property
   */
  className?: string,

  /**
   * Types registry. If not provided we'll use a default one (quite restrictive)
   */
  types?: TableTypesRegistry,

  /**
   * Layout to use, defaults to TableLayoutHtml
   */
  layout?: (props: GridLayoutProps) => ReactElement<GridLayoutProps>,

  /**
   * Definition of data properties to display. For example the columns when
   * displayed as table.
   *
   * We don't define here all properties of the data but what's displayed and how.
   * This is named 'columns' because even if the grid is not displaying a table,
   * the concept of columns is maybe easier to understand, hence the name.
   */
  columns: GridColumnDefinition<T>[],
  /**
   * Data itself.
   *
   * In future releases, you'll get a callback that must return
   * a promise. Plugins will be able to post-process the data for their
   * usage but whatever, the original data shall never be altered so you
   * can keep full control over it.
   */
  data: GridDataSource<T>,
  /**
   * Plugins used
   */
  plugins: GridPluginList<T>
  /**
   * Name of the data property used as identifier. Defaults to 'id'. Identifier
   * property be a string. For example `{ id: "1234" }` NOT `{ id: 1234 }`.
   *
   * Each item MUST have an id, otherwise you'll get unpredictable results
   * (and in future releases an exception)
   */
  identifierProperty?: string,

  /**
   * Callback when an generic action is launched (from the toolbar for example)
   */
  onActionGeneric?: ActionGenericHandler,

  /**
   * Registers how actions are rendered
   */
  actionRenderers?: UIActionRenderer[]

}

export type TableCellEditorValueChangeHandler<T> = (previousValue: T) => T
export type TableCellEditorFactory<T> = (data: T, onValueChange: TableCellEditorValueChangeHandler<T>) => ReactElement | null | undefined

export interface GridColumnDefinition<T> {
  name: string,
  label?: ReactNode,
  type?: string,
  render?: (value: T) => ReactNode,
  editable?: (rowData: T) => boolean,
  editor?: TableCellEditorFactory<T>
}

export type TableActionList = TableAction[]
export type TableGenericActionList = TableGenericAction[]
export type ActionItemHandler<T> = (action: TableAction, rowData: T, evt: any) => void
export type ActionGenericHandler = (action: TableAction, evt: any) => void

/**
 * Defines a generic action
 */
export interface TableGenericAction {
  /**
   * Name of action to render
   **/
  name: string,
  /**
   *  Default renderer provided by the plugin
   **/
  render: () => ReactElement
}

/**
 * Defines an item action
 */
export interface TableAction {
  /**
   * Name of action
   */
  name: string,
  /**
   * Position relative to item
   */
  position?: "start" | "end"
  /**
   * Function that states if the action is available or not (whether if it's displayed or disabled
   * depends on the layout choosen)
   */
  displayed?: (state: GridState, item: any) => boolean,
  /**
   * Default renderer for this action provided by the plugin
   */
  renderItem: (item: any) => ReactNode
}

/**
 * UI Action renderer definition
 */
export interface UIActionRenderer {
  /** name of action */
  name: string
  /** renderer for generic actions */
  render?: () => ReactNode | null
  /** renderer for item action */
  renderItem?: (item: any) => ReactNode | null
}

/**
 * Une liste de action renderer en map
 */
export type UIActionRendererMap = { [key: string]: UIActionRenderer }

export type TableActionDispatch = {
  listeners: { [key: string]: TableActionHandler }
}
export type TableActionHandler = (on: any) => void

export type UIAction = FC<{action:string, item?:any}>
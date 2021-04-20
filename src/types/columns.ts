import { ReactNode } from "react";
import { TableTypeRenderer as GridTypeRenderer } from "../TableTypesRegistry";
import { TableCellEditorFactory as GridCellEditorFactory } from "./public";

/**
 * Internal definition of a column. Providing strict content as opposed to
 * public definition where most of content is optional.
 */
export interface GridColumnDefinitionInternal<T> {
  /**
   * Name of property. Shall be a variable name format.
   */
  name: string;
  /**
   * Label of property, used to be displayed.
   */
  label: ReactNode;
  /**
   * Type of property. Shall be one of the types registry.
   */
  type: string;
  /**
   * Used to render the property values
   */
  render: GridTypeRenderer<any>;
  /**
   * Returns true if the property is editable. Depends on the currently
   * displayed item.
   */
  editable: (item: T) => boolean;
  /**
   * Provides an editor to edit an item property. If no editor is present, item
   * property can not be editable.
   */
  editor?: GridCellEditorFactory<T>;
}

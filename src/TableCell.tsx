import { isNil } from "lodash";
import React from "react";

import { TableTypeRenderer } from "./TableTypesRegistry";
import { GridPluginList, GridState, TableCellEditorFactory } from "./types";

interface TableCellProps<T> {
  render: TableTypeRenderer<T>;
  editor?: TableCellEditorFactory<T>;
  /** list of plugins */
  plugins: GridPluginList<T>;
  /** state of the grid */
  gridState: GridState;
  item: T;
  itemPropertyName: string;
  onEditItemChange: (newItem: T) => void;
}

export const TableCell: React.FC<TableCellProps<any>> = ({
  render,
  editor,
  gridState,
  item,
  plugins,
  itemPropertyName,
  onEditItemChange,
}) => {
  const editing = plugins.some(plugin=>isNil(plugin.isEditing) ? false : plugin.isEditing(gridState, item, itemPropertyName))
  const Component = editing && editor ? editor(item, onEditItemChange) : render(item[itemPropertyName]);
  return <td> {Component}</td>;
};

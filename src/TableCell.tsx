import React from "react";

import { TableTypeRenderer } from "./TableTypesRegistry";
import { TableCellEditorFactory } from "./types";

interface TableCellProps<T> {
  editing: boolean;
  render: TableTypeRenderer<T>;
  editor?: TableCellEditorFactory<T>;
  item: T;
  itemPropertyName: string;
  onEditItemChange: (newItem: T) => void;
}

export const TableCell: React.FC<TableCellProps<any>> = ({
  editing,
  render,
  editor,
  item,
  itemPropertyName,
  onEditItemChange,
}) => {
  const Component = editing && editor ? editor(item, onEditItemChange) : render(item[itemPropertyName]);
  return <td> {Component}</td>;
};

import { TableTypeRenderer } from "../TableTypesRegistry";
import { TableCellEditorFactory } from "./public";

export interface TableColumnDefinitionInternal<T> {
  name: string;
  label: string;
  type: string;
  render: TableTypeRenderer<any>;
  editable: (rowData: T) => boolean;
  editor?: TableCellEditorFactory<T>;
}

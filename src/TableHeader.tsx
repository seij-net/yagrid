import React from "react";

import { TableColumnDefinitionInternal } from "./types";

export interface TableHeaderProps {
  /** indique si la table est editable */
  displayActions: boolean;
  columnDefinitions: TableColumnDefinitionInternal<any>[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columnDefinitions, displayActions }) => {
  const headers = columnDefinitions.map((it) => <th key={it.name}>{it.label}</th>);
  const editableCell = displayActions ? <th></th> : null;
  return (
    <thead>
      <tr>
        {editableCell}
        {headers}
      </tr>
    </thead>
  );
};

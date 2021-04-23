import React from "react";

import { GridColumnDefinitionInternal } from "./types";

export interface TableHeaderProps {
  /** tells if table has actions placed at beginning of item rows */
  hasActionsStart: boolean;
  /** tells if table has actions placed at end of item rows */
  hasActionsEnd: boolean;
  columnDefinitions: GridColumnDefinitionInternal<any>[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columnDefinitions, hasActionsStart, hasActionsEnd }) => {
  const headerCells = columnDefinitions.map((it) => <th key={it.name}>{it.label}</th>);
  const actionsStart = hasActionsStart ? <th key="__YAGRID_START_ACTIONS"></th> : null;
  const actionsEnd = hasActionsEnd ? <th key="__YAGRID_END_ACTIONS"></th> : null;
  return (
    <thead>
      <tr>
        {actionsStart}
        {headerCells}
        {actionsEnd}
      </tr>
    </thead>
  );
};

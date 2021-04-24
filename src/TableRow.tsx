import React from "react";

import { TableCell } from "./TableCell";

import { ExtraItemExtension, GridColumnDefinitionInternal, GridPluginList, GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { isNil } from "lodash-es";
import { useGrid } from "./GridContext";

export interface TableRowProps<T> {
  /** indique si la ligne est en cours d'édition */
  gridState: GridState;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsStart: boolean;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsEnd: boolean;
  /** données à afficher pour cette ligne */
  item: T;
  /** définition des colonnes */
  columnDefinitions: GridColumnDefinitionInternal<T>[];
  types: TableTypesRegistry;
  /** list of plugins */
  plugins: GridPluginList<T>;
  /**
   * Extra items extension point
   */
  extraItems: ExtraItemExtension<T>[];
  columnCount: number;
  onEditItemChange: (newItem: T) => void;
}

export const TableRow: React.FC<TableRowProps<any>> = (
  {
    columnDefinitions,
    gridState,
    item,
    hasActionsStart,
    hasActionsEnd,
    extraItems,
    columnCount,
    onEditItemChange,
    plugins
  }) => {
  const extraItemList = extraItems.map((ext) => ext(item)).filter((extra) => !isNil(extra));
  const { selectDisplayedItemActions } = useGrid();
  const extraItemRow =
    extraItemList.length > 0 ? (
      <tr key="__yagrid_item_extra">
        <td colSpan={columnCount}>{extraItemList}</td>
      </tr>
    ) : null;
  const regularRow = (
    <tr key="__yagrid_item">
      {hasActionsStart && (
        <td key="__YAGRID_START_ACTIONS">
          {
            selectDisplayedItemActions(item)
              .filter((it) => it.position === "start")
              .map(action => <span key={action.name}>{action.renderItem(item)}</span>)
          }
        </td>
      )}
      {columnDefinitions.map((def) => (
        <TableCell
          key={def.name}
          plugins={plugins}
          gridState={gridState}
          render={def.render}
          editor={def.editor}
          item={item}
          itemPropertyName={def.name}
          onEditItemChange={onEditItemChange}
        />
      ))}
      {hasActionsEnd && (
        <td key="__YAGRID_END_ACTIONS">
          {selectDisplayedItemActions(item)
            .filter(it => it.position === "end" || it.position === undefined)
            .map(action => <span key={action.name}>{action.renderItem(item)}</span>)}
        </td>
      )}
    </tr>
  );

  return <>{regularRow}{extraItemRow && extraItemRow}</>;
};

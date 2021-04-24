import React from "react";

import { TableCell } from "./TableCell";

import { ExtraItemExtension, GridPluginList, GridState } from "./types";
import { TableTypesRegistry } from "./TableTypesRegistry";
import { TableActionDispatch, TableActionList, GridColumnDefinitionInternal } from "./types";
import { isNil } from "lodash-es";
import { useGrid } from "./GridContext";

export interface TableRowProps<T> {
  /** indique si la ligne est en cours d'édition */
  gridState: GridState;
  dispatch: React.Dispatch<any>;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsStart: boolean;
  /** tells if item has defined actions that must be displayed at start position */
  hasActionsEnd: boolean;
  /** Actions d'une ligne */
  actionsItem: TableActionList;
  /** données à afficher pour cette ligne */
  item: T;
  /** définition des colonnes */
  itemDefinitions: GridColumnDefinitionInternal<T>[];
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

export const TableRow: React.FC<TableRowProps<any>> = ({
  itemDefinitions,
  gridState,
  item,
  dispatch,
  hasActionsStart,
  hasActionsEnd,
  actionsItem,
  extraItems,
  columnCount,
  onEditItemChange,
  plugins,
}) => {
  const cells = itemDefinitions.map((def) => {
    return (
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
    );
  });

  const startActionsCell = hasActionsStart ? (
    <td key="__YAGRID_START_ACTIONS">
      <TableItemActions
        item={item}
        actionItemList={actionsItem.filter((it) => it.position === "start")}
      />
    </td>
  ) : null;
  const endActionsCell = hasActionsEnd ? (
    <td key="__YAGRID_END_ACTIONS">
      <TableItemActions
        item={item}
        actionItemList={actionsItem.filter((it) => it.position === "end" || it.position === undefined)}
      />
    </td>
  ) : null;
  const extraItemList = extraItems.map((ext) => ext(item)).filter((extra) => !isNil(extra));

  const extraItemRow =
    extraItemList.length > 0 ? (
      <tr key="__yagrid_item_extra">
        <td colSpan={columnCount}>{extraItemList}</td>
      </tr>
    ) : null;
  const regularRow = (
    <tr key="__yagrid_item">
      {startActionsCell}
      {cells}
      {endActionsCell}
    </tr>
  );

  return extraItemRow ? (
    <>
      {regularRow}
      {extraItemRow}
    </>
  ) : (
    regularRow
  );
};


export const TableItemActions: React.FC<{
  item: any;
  actionItemList: TableActionList;
}> = ({
  actionItemList,
  item
}) => {
  const {state} = useGrid()
  const actionsToDisplay = actionItemList.filter((action) => {
    // Si aucune condition n'existe pour l'action, on l'affiche quoi qu'il arrive
    if (isNil(action.displayed)) return true;
    const displayed = action.displayed(state, item);
    return displayed;
  });

  return (
    <>
      {actionsToDisplay.map((it) => (
        <span key={it.name}>
          {it.renderItem ? it.renderItem(item) : null}
        </span>
      ))}
    </>
  );
};
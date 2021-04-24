import clsx from "clsx";
import { isFunction } from "lodash-es";
import React, { useEffect, useReducer } from "react";

import { GridProvider, useGrid } from "./GridContext";
import { TableHeader } from "./TableHeader";
import { TableActionTrigger } from "./TableItemActions";
import { TableRow } from "./TableRow";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { GridProps } from "./types";
import { createExtensionPoints } from "./utils/pluginCompose";

enum LoadingState {
  init,
  pending,
  loaded,
}

export const Grid: React.FC<GridProps<any>> = (props) => {
  return (
    <GridProvider columns={props.columns} types={props.types} data={props.data}>
      <TableLayout {...props} />
    </GridProvider>
  );
};

const TableLayout: React.FC<GridProps<any>> = ({ data, className, identifierProperty = "id", plugins = [] }) => {
  
  

  const { loadingState, columnDefinitions, types, resolvedData } = useGrid();


  const ext = createExtensionPoints(plugins);

  const reducer = createReducer(ext.reducer);
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));

  const classNames = clsx(className);

  const hasActionsStart = ext.actionItemList.some((action) => action.position === "start");
  const hasActionsEnd = ext.actionItemList.some((action) => action.position === "end" || action.position === undefined);
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1 : 0) + (hasActionsEnd ? 1 : 0);

  let actionListeners = {};
  plugins.forEach((plugin) => {
    const pluginListeners =
      plugin.actionGenericListeners && plugin.actionGenericListeners(editState, dispatchEditState);
    if (pluginListeners) {
      actionListeners = { ...actionListeners, ...pluginListeners };
    }
  });

  const actionGenericComponents = ext.actionGenericList.map((it) => {
    return (
      <TableActionTrigger
        key={it.name}
        action={it}
        editingState={editState}
        dispatch={{ listeners: actionListeners }}
      />
    );
  });

  const handleEditItemChange = (newItem: any) => dispatchEditState({ type: "item_change", item: newItem });

  const dataListTransform = ext.dataListTransform.reduce((acc, current) => current(editState, acc), resolvedData);

  const rows = dataListTransform.map((it) => {
    const id = it[identifierProperty];
    let actionListeners = {};
    plugins.forEach((plugin) => {
      const pluginListeners =
        plugin.actionItemListeners && plugin.actionItemListeners(editState, dispatchEditState, it);
      actionListeners = { ...actionListeners, ...pluginListeners };
    });

    return (
      <TableRow
        key={id}
        actionsItem={ext.actionItemList}
        hasActionsStart={hasActionsStart}
        hasActionsEnd={hasActionsEnd}
        gridState={editState}
        item={it}
        extraItems={ext.extraItem}
        columnCount={columnCount}
        onActionItemDispatch={{ listeners: actionListeners }}
        onEditItemChange={handleEditItemChange}
        itemDefinitions={columnDefinitions}
        types={types}
        plugins={plugins}
      />
    );
  });
  const footers = plugins
    .map((it) => {
      if (it.footer?.span) {
        return (
          <tr key={it.name}>
            <td colSpan={columnCount}>{it.footer.span(resolvedData)}</td>
          </tr>
        );
      }
      if (it.footer?.rows) {
        return it.footer?.rows(resolvedData, columnCount);
      }
    })
    .filter((it) => it);

  const isLoading = loadingState !== LoadingState.loaded;
  return (
    <>
      {actionGenericComponents}
      <table className={classNames}>
        <TableHeader
          hasActionsStart={hasActionsStart}
          hasActionsEnd={hasActionsEnd}
          columnDefinitions={columnDefinitions}
        />
        {isLoading && (
          <tbody>
            <tr>
              <td colSpan={columnCount}>Loading...</td>
            </tr>
          </tbody>
        )}
        {!isLoading && <tbody>{rows}</tbody>}
        {footers && <tfoot>{footers}</tfoot>}
      </table>
    </>
  );
};

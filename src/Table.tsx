import clsx from "clsx";
import React from "react";
import { GridProvider, useGrid } from "./GridContext";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { GridProps, GridState, TableGenericAction, TableActionDispatch } from "./types";

enum LoadingState {
  init,
  pending,
  loaded,
}

export const Grid: React.FC<GridProps<any>> = (props) => {
  return (
    <GridProvider
      columns={props.columns}
      types={props.types}
      data={props.data}
      plugins={props.plugins}
      identifierProperty={props.identifierProperty}
    >
      <TableLayout {...props} />
    </GridProvider>
  );
};

const TableLayout: React.FC<GridProps<any>> = ({ className, plugins = [] }) => {
  const {
    loadingState,
    columnDefinitions,
    types,
    resolvedData,
    extensions,
    identifierProperty,
    state: state,
    dispatch: dispatch,
    handleEditItemChange,
    dataListTransform,
  } = useGrid();

  const classNames = clsx(className);

  const hasActionsStart = extensions.actionItemList.some((action) => action.position === "start");
  const hasActionsEnd = extensions.actionItemList.some(
    (action) => action.position === "end" || action.position === undefined
  );
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1 : 0) + (hasActionsEnd ? 1 : 0);

  let actionListeners = {};
  plugins.forEach((plugin) => {
    const pluginListeners =
      plugin.actionGenericListeners && plugin.actionGenericListeners(state, dispatch);
    if (pluginListeners) {
      actionListeners = { ...actionListeners, ...pluginListeners };
    }
  });

  const rows = dataListTransform.map((it) => {
    const id = it[identifierProperty];
    let actionListeners = {};
    plugins.forEach((plugin) => {
      const pluginListeners =
        plugin.actionItemListeners && plugin.actionItemListeners(state, dispatch, it);
      actionListeners = { ...actionListeners, ...pluginListeners };
    });

    return (
      <TableRow
        key={id}
        actionsItem={extensions.actionItemList}
        hasActionsStart={hasActionsStart}
        hasActionsEnd={hasActionsEnd}
        gridState={state}
        item={it}
        extraItems={extensions.extraItem}
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

  return (
    <>
      {extensions.actionGenericList.map(action => (
        <TableActionTrigger
          key={action.name}
          action={action}
          state={state}
          dispatch={{ listeners: actionListeners }}
        />
      ))}
      <table className={classNames}>
        <TableHeader
          hasActionsStart={hasActionsStart}
          hasActionsEnd={hasActionsEnd}
          columnDefinitions={columnDefinitions}
        />
        {loadingState !== LoadingState.loaded && (
          <tbody>
            <tr>
              <td colSpan={columnCount}>Loading...</td>
            </tr>
          </tbody>
        )}
        {loadingState === LoadingState.loaded && <tbody>{rows}</tbody>}
        {footers && <tfoot>{footers}</tfoot>}
      </table>
    </>
  );
};

export const TableActionTrigger: React.FC<{
  action: TableGenericAction,
  state: GridState,
  dispatch: TableActionDispatch
}> = ({ action, state, dispatch }) => {
  return action.render(state, dispatch);
};

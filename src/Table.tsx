import clsx from "clsx";
import React from "react";
import { GridProvider, useGrid } from "./GridContext";
import { TableRow } from "./TableRow";
import { GridProps, GridState, TableGenericAction } from "./types";

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
    dataListTransform
  } = useGrid();

  const classNames = clsx(className);

  const hasActionsStart = extensions.actionItemList.some((action) => action.position === "start");
  const hasActionsEnd = extensions.actionItemList.some(
    (action) => action.position === "end" || action.position === undefined
  );
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1 : 0) + (hasActionsEnd ? 1 : 0);

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
      {extensions.actionGenericList.map((action) => (
        <TableActionTrigger key={action.name} action={action} state={state} dispatch={dispatch} />
      ))}
      <table className={classNames}>
        <thead>
        <tr>
          {hasActionsStart && <th key="__YAGRID_START_ACTIONS"></th>}
          {columnDefinitions.map((it) => (
            <th key={it.name}>{it.label}</th>
          ))}
          {hasActionsEnd && <th key="__YAGRID_END_ACTIONS"></th>}
        </tr>
        </thead>
        {loadingState !== LoadingState.loaded && (
          <tbody>
          <tr>
            <td colSpan={columnCount}>Loading...</td>
          </tr>
          </tbody>
        )}
        {loadingState === LoadingState.loaded && (
          <tbody>
          {dataListTransform.map((it) => (
            <TableRow
              key={it[identifierProperty]}
              actionsItem={extensions.actionItemList}
              hasActionsStart={hasActionsStart}
              hasActionsEnd={hasActionsEnd}
              gridState={state}
              item={it}
              extraItems={extensions.extraItem}
              columnCount={columnCount}
              onEditItemChange={handleEditItemChange}
              columnDefinitions={columnDefinitions}
              types={types}
              plugins={plugins}
            />
          ))}
          </tbody>
        )}
        {footers && <tfoot>{footers}</tfoot>}
      </table>
    </>
  );
};

export const TableActionTrigger: React.FC<{
  action: TableGenericAction;
  state: GridState;
  dispatch: React.Dispatch<any>;
}> = ({ action, state, dispatch }) => {
  return action.render(state, dispatch);
};

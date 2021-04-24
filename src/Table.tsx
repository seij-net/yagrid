import clsx from "clsx";
import React, { Factory } from "react";
import { GridProvider, useGrid, useGridItem, useGridItemProperty } from "./GridContext";

import { GridProps } from "./types";

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
  const gridContext = useGrid();
  const {
    loadingState,
    columnDefinitions,
    extensions,
    identifierProperty,
    state,
    handleEditItemChange,
    dataListTransform,
  } = gridContext;

  const classNames = clsx(className);

  const hasActionsStart = extensions.actionItemList.some((action) => action.position === "start");
  const hasActionsEnd = extensions.actionItemList.some(
    (action) => action.position === "end" || action.position === undefined
  );
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1 : 0) + (hasActionsEnd ? 1 : 0);
  const footerRows = extensions.footerRows.map((it) => it(dataListTransform, columnCount));
  const footerSpans = extensions.footerSpan.map((it) => it(dataListTransform));

  return (
    <>
      {extensions.actionGenericList.map((action) => (
        <action.render key={action.name} />
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
            {dataListTransform.map((item) => {
              const { selectDisplayedItemActions, selectExtraItems: extraItemList } = useGridItem(item, gridContext);
              return (
                <React.Fragment key={item[identifierProperty]}>
                  {
                    <tr key="__yagrid_item">
                      {hasActionsStart && (
                        <td key="__YAGRID_START_ACTIONS">
                          {selectDisplayedItemActions
                            .filter((it) => it.position === "start")
                            .map((action) => (
                              <span key={action.name}>{action.renderItem(item)}</span>
                            ))}
                        </td>
                      )}
                      {columnDefinitions.map((def) => {
                        const { editing } = useGridItemProperty(def.name, item, gridContext);
                        return (
                          <td key={def.name}>
                            {editing && def.editor
                              ? def.editor(state.editedItemValue, handleEditItemChange)
                              : def.render(item)}
                          </td>
                        );
                      })}
                      {hasActionsEnd && (
                        <td key="__YAGRID_END_ACTIONS">
                          {selectDisplayedItemActions
                            .filter((it) => it.position === "end" || it.position === undefined)
                            .map((action) => (
                              <span key={action.name}>{action.renderItem(item)}</span>
                            ))}
                        </td>
                      )}
                    </tr>
                  }
                  {extraItemList.length > 0 && (
                    <tr key="__yagrid_item_extra">
                      <td colSpan={columnCount}>{extraItemList}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        )}
        {footerRows.length + footerSpans.length > 0 && (
          <tfoot>
            {footerRows}
            {footerSpans.length > 0 && <tr><td colSpan={columnCount}>{footerSpans}</td></tr> }
          </tfoot>
        )}
      </table>
    </>
  );
};

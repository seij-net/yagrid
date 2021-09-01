import React from "react";

import { tableClassNamesBuilder } from "./utils/tableClassNames";
import { GridProps } from "./types";
import { useGrid, GridProvider, useGridItem, useGridItemProperty } from "./GridContext"
import { render } from "react-dom";

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
      uiActionRendererList={props.actionRenderers}
    >
      <TableLayout {...props} />
    </GridProvider>
  );
};

const TableLayout: React.FC<GridProps<any>> = ({ className }) => {
  const gridContext = useGrid();
  const {
    loadingState,
    columnDefinitions,
    extensions,
    identifierProperty,
    state,
    handleEditItemChange,
    dataListTransform,
    UIAction
  } = gridContext;

  const hasActionsStart = extensions.actionItemList.some((action) => action.position === "start");
  const hasActionsEnd = extensions.actionItemList.some(
    (action) => action.position === "end" || action.position === undefined
  );
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1 : 0) + (hasActionsEnd ? 1 : 0);
  const footerRows = extensions.footerRows.map((it) => it(dataListTransform, columnCount));
  const footerSpans = extensions.footerSpan.map((it) => it(dataListTransform));

  const tableClassNames = tableClassNamesBuilder({
    legacyTableClassName: className,
    cfg: extensions.tableClassNames,
  });
  return (
    <div className={tableClassNames.tableWrapper}>
      {extensions.actionGenericList.length > 0 && (
        <div className={tableClassNames.actionGenericToolbar}>
          {extensions.actionGenericList.map((action) => <UIAction key={action.name} action={action.name} /> )}
        </div>
      )}
      <table className={tableClassNames.table}>
        <thead className={tableClassNames.thead}>
          <tr className={tableClassNames.theadRow}>
            {hasActionsStart && (
              <th key="__YAGRID_START_ACTIONS" className={tableClassNames.theadCellActionsStart}></th>
            )}
            {columnDefinitions.map((it) => {
              return (
                <th key={it.name} className={tableClassNames.theadCell(it)}>
                  {it.label}
                </th>
              );
            })}
            {hasActionsEnd && <th key="__YAGRID_END_ACTIONS" className={tableClassNames.theadCellActionsEnd}></th>}
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
          <tbody className={tableClassNames.tbody}>
            {dataListTransform.map((item) => {
              const { selectDisplayedItemActions, selectExtraItems: extraItemList } = useGridItem(item, gridContext);
              return (
                <React.Fragment key={item[identifierProperty]}>
                  {
                    <tr key="__yagrid_item" className={tableClassNames.tbodyRow(item)}>
                      {hasActionsStart && (
                        <td key="__YAGRID_START_ACTIONS" className={tableClassNames.tbodyCellActionsStart(item)}>
                          {selectDisplayedItemActions
                            .filter((it) => it.position === "start")
                            .map((action) =>  (
                                <UIAction key={action.name} action={action.name} item={item} />
                              )
                            )}
                        </td>
                      )}
                      {columnDefinitions.map((def) => {
                        const { editing } = useGridItemProperty(def.name, item, gridContext);
                        return (
                          <td key={def.name} className={tableClassNames.tbodyCell(item, def)}>
                            {editing && def.editor
                              ? def.editor(state.editedItemValue, handleEditItemChange)
                              : def.render(item)}
                          </td>
                        );
                      })}
                      {hasActionsEnd && (
                        <td key="__YAGRID_END_ACTIONS" className={tableClassNames.tbodyCellActionsEnd(item)}>
                          {selectDisplayedItemActions
                            .filter((it) => it.position === "end" || it.position === undefined)
                            .map((action) => (
                              <UIAction key={action.name} action={action.name} item={item} />
                            ))}
                        </td>
                      )}
                    </tr>
                  }
                  {extraItemList.length > 0 && (
                    <tr key="__yagrid_item_extra" className={tableClassNames.tbodyRowExtra(item)}>
                      <td colSpan={columnCount} className={tableClassNames.tbodyCellExtra(item)}>
                        {extraItemList}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        )}
        {footerRows.length + footerSpans.length > 0 && (
          <tfoot className={tableClassNames.tfoot}>
            {footerRows}
            {footerSpans.length > 0 && (
              <tr className={tableClassNames.tfootRow}>
                <td colSpan={columnCount}>{footerSpans}</td>
              </tr>
            )}
          </tfoot>
        )}
      </table>
    </div>
  );
};

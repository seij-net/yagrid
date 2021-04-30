import clsx from "clsx"
import { isFunction } from "lodash-es";
import { TableClassNames } from "../types/table"

export function tableClassNamesBuilder<T>(props: {
  legacyTableClassName: string | undefined
  cfg: TableClassNames<T>
}) {
  const { legacyTableClassName, cfg } = props
  return {
    tableWrapper: clsx(cfg.tableWrapper),
    actionGenericToolbar: clsx(cfg.actionGenericToolbar),
    table: clsx(legacyTableClassName, cfg.table),
    thead: clsx(cfg.thead),
    theadRow: clsx(cfg.theadRow),
    theadCell: (columnName: string): string | undefined => {
      const theadCell = cfg.theadCell;
      if (!theadCell) return undefined;
      if (isFunction(theadCell)) {
        return clsx(theadCell(columnName));
      }
      return clsx(theadCell);
    },
    theadCellActionsStart: clsx(cfg.theadCellActionsStart),
    theadCellActionsEnd: clsx(cfg.theadCellActionsEnd),
    tbody: clsx(cfg.tbody),
    tbodyRow: (item: T) => {
      const tbodyRow = cfg.tbodyRow
      if (!tbodyRow) return undefined
      if (isFunction(tbodyRow)) {
        return clsx(tbodyRow(item))
      }
      return clsx(tbodyRow)
    },
    tbodyRowExtra: (item:T) => {
      const c = cfg.tbodyRowExtra
      if (!c) return undefined
      if (isFunction(c)) {
        return clsx(c(item))
      }
      return clsx(c)
    },
    tbodyCell: (item: T, columnName: string) => {
      const tbodyCell = cfg.tbodyCell
      if (!tbodyCell) return undefined
      if (isFunction(tbodyCell)) {
        return clsx(tbodyCell(item, columnName))
      }
      return clsx(tbodyCell)
    },
    tbodyCellExtra: (item:T) => {
      const c = cfg.tbodyCellExtra
      if (!c) return undefined
      if (isFunction(c)) {
        return clsx(c(item))
      }
      return clsx(c)
    },
    tbodyCellActionsStart: (item: T) => {
      const c = cfg.tbodyCellActionsStart
      if (!c) return undefined
      if (isFunction(c)) {
        return clsx(c(item))
      }
      return clsx(cfg.tbodyCellActionsStart)
    },
    tbodyCellActionsEnd: (item: T) => {
      const c = cfg.tbodyCellActionsEnd
      if (!c) return undefined
      if (isFunction(c)) {
        return clsx(c(item))
      }
      return clsx(cfg.tbodyCellActionsEnd)
    },
    tfoot: clsx(cfg.tfoot),
    tfootRow: clsx(cfg.tfootRow)
  }
}
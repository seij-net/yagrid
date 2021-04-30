/**
 * For table layout only
 */
export type ClassNames = string | undefined | null | string[]
export interface TableClassNames<T> {
  table?: ClassNames;
  thead?: ClassNames;
  theadRow?: ClassNames;
  theadCell?: ClassNames | ((columnName: string) => ClassNames);
  theadCellActionsStart?: ClassNames,
  theadCellActionsEnd?: ClassNames,
  tbody?: ClassNames;
  tbodyRow?: ClassNames | ((item: T) => ClassNames);
  tbodyCell?: ClassNames | ((item: T, columnName: string) => ClassNames);
  tbodyRowExtra?: ClassNames | ((item: T) => ClassNames);
  tbodyCellExtra?: ClassNames | ((item: T) => ClassNames);
  tbodyCellActionsStart?: ClassNames | ((item: T) => ClassNames),
  tbodyCellActionsEnd?: ClassNames | ((item: T) => ClassNames),
  tfoot?: ClassNames;
  tfootRow?: ClassNames;
}
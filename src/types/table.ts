import { GridColumnDefinition } from "..";

/**
 * For table layout only
 */
export type ClassNameSingular = string | undefined | null | {[key:string]:boolean}
export type ClassNames = ClassNameSingular | ClassNameSingular[]
export interface TableClassNames<T> {
  tableWrapper?: ClassNames,
  actionGenericToolbar?: ClassNames,
  table?: ClassNames;
  thead?: ClassNames;
  theadRow?: ClassNames;
  theadCell?: ClassNames | ((column: GridColumnDefinition<T>) => ClassNames);
  theadCellActionsStart?: ClassNames,
  theadCellActionsEnd?: ClassNames,
  tbody?: ClassNames;
  tbodyRow?: ClassNames | ((item: T) => ClassNames);
  tbodyCell?: ClassNames | ((item: T, column: GridColumnDefinition<T>) => ClassNames);
  tbodyRowExtra?: ClassNames | ((item: T) => ClassNames);
  tbodyCellExtra?: ClassNames | ((item: T) => ClassNames);
  tbodyCellActionsStart?: ClassNames | ((item: T) => ClassNames),
  tbodyCellActionsEnd?: ClassNames | ((item: T) => ClassNames),
  tfoot?: ClassNames;
  tfootRow?: ClassNames;
}
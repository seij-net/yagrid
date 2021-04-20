import React from "react";
import { ReactNode } from "react";
import { GridColumnDefinition, GridPlugin } from "../../types";

export interface Config<T> {
//  columns: GridColumnDefinition<T>[],
  //data: T[]
  rows: (data:T[], columnCount: number) => ReactNode
}
export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: "table-footer",
    reducer: (s) => s,
    dataListTransform: (state, data) => data,
    actionGenericList: [],
    actionItemList: [],
    actionGenericListeners: () => ({}),
    actionItemListeners: () => ({}),
    footer:{
      rows: config.rows
    }
  };
}

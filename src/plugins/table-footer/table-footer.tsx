import React, { ReactNode } from "react";
import { GridPlugin } from "../../types";

export interface Config<T> {
//  columns: GridColumnDefinition<T>[],
  //data: T[]
  rows: (data: T[], columnCount: number) => ReactNode
}

export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: "table-footer",
    config: config,
    reducer: (s) => s,
    footerRows:config.rows
  };
}

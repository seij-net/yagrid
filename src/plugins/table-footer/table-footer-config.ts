import { ReactNode } from "react";

export interface Config<T> {
  //  columns: GridColumnDefinition<T>[],
    //data: T[]
    rows: (data: T[], columnCount: number) => ReactNode
  }
  
  export const PLUGIN_NAME = "table-footer";
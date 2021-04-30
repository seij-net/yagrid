import React, { ReactNode } from "react";

import { GridPlugin } from "../../types";
import { TableClassNames } from "../../types/table";



export interface Config<T> extends TableClassNames<T> {
  
}

export function create<T>(config: TableClassNames<T>): GridPlugin<T> {
  return {
    name: "table-classnames",
    config: config,
    tableClassNames: config,
  };
}

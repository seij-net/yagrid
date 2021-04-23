import React from "react";
import { ReactNode } from "react";
import { GridPlugin } from "../../types";

export interface Config<T> {
  message: ReactNode;
}
export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: "empty-message",
    reducer: (s) => s,
    footer:{
      span: (data) =>  data.length === 0 && config.message
    }
  };
}

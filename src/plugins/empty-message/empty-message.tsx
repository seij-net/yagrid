import { ReactNode } from "react";
import { GridPlugin } from "../../types";
import { PLUGIN_NAME, Config } from "./empty-message-config";


export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: PLUGIN_NAME,
    config: config,
    reducer: (s) => s,
    footerSpan: (data) => data.length === 0 && config.message,
  };
}

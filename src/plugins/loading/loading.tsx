import { GridPlugin } from "../../types";
import { Config, PLUGIN_NAME } from "./loading-config";

export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: PLUGIN_NAME,
    config: config,
    reducer: (s) => s,
    footerSpan:(data) => data.length === 0 && config.message
  };
}

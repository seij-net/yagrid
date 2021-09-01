import { GridPlugin } from "../../types";
import { Config, PLUGIN_NAME } from "./table-classnames-config";





export function create<T>(config: Config<T>): GridPlugin<T> {
  return {
    name: PLUGIN_NAME,
    config: config,
    tableClassNames: config,
  };
}

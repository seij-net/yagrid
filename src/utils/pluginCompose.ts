import { isNil } from "lodash-es";

import { ExtensionPoints, GridPlugin, GridPluginList } from "../types";

/**
 * For each plugin, extract an array of value on an extension point
 * and combines those values into a list, supposing that each extension
 * point gives an array of values. Values are flatten. Nullish elements
 * are skipped.
 * @param plugins list of plugins
 * @param extract what to extract
 * @param initialValues initial values to put at start of the list
 * @returns 
 */
export function pluginComposeFlatten<T, R>(
  plugins: GridPluginList<T>,
  extract: (plugin: GridPlugin<T>) => (R[] | undefined),
  initialValues?: R[] | null
): R[] {
  const initialSafe = isNil(initialValues) ? ([] as R[]) : initialValues;
  return plugins.reduce((acc, current) => {
    const c = extract(current)
    return isNil(c) ? acc : [...acc, ...c]
  }, initialSafe);
}

/**
 * For each plugin, extracts value on an extension point and combines
 * those values into a list, skips all nullish elements.
 * @param plugins list of plugins
 * @param extract what to extract
 * @param initialValue initial value to add at start of the list
 * @returns 
 */
export function pluginCompose<T, R>(
  plugins: GridPluginList<T>,
  extract: (plugin: GridPlugin<T>) => (R | undefined),
  initialValue?: R | null
): R[] {
  const initialSafe = isNil(initialValue) ? [] as R[] : [initialValue];
  return plugins.reduce((acc, current) => {
    const c = extract(current)
    return isNil(c) ? acc : [...acc, c]
  }, initialSafe)
}

/**
 * Combines all plugins by cumulating what they provide on each extension
 * point. 
 * 
 * @param plugins list of plugin
 * @returns all extension points with their cumulative values
 */
export function createExtensionPoints<T>(
  plugins: GridPluginList<T>
): ExtensionPoints<T> {
  return {
    reducer: pluginCompose(plugins, p => p.reducer),
    actionGenericList: pluginComposeFlatten(plugins, p => p.actionGenericList),
    actionItemList: pluginComposeFlatten(plugins, p => p.actionItemList, []),
    dataListTransform: pluginCompose(plugins, p => p.dataListTransform)
  }
}

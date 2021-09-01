import { isFunction, isNil } from "lodash-es";
import React, { ReactNode, useEffect, useReducer } from "react";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { TableTypesRegistry, TableTypesRegistryDefault } from "./TableTypesRegistry";
import {
  GridColumnDefinition,
  GridColumnDefinitionInternal,
  GridContext,
  GridDataSource,
  GridPlugin,
  GridPluginList, LoadingState,
  TableAction, UIActionRenderer, UIActionRendererMap
} from "./types";
import { associateBy } from "./utils/lang";
import { createExtensionPoints } from "./utils/pluginCompose";

const NOT_EDITABLE = () => false;



const GridContextInternal = React.createContext<GridContext<any> | undefined>(undefined);

export function useGrid() {
  const context = React.useContext(GridContextInternal);
  if (context === undefined) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
}

interface GridProviderProps<T> {
  identifierProperty?: string;
  data: GridDataSource<T>;
  columns: GridColumnDefinition<T>[];
  types?: TableTypesRegistry;
  plugins: GridPluginList<T>;
  uiActionRendererList?: UIActionRenderer[]
}

export const GridProvider: React.FC<GridProviderProps<any>> = (
  {
    identifierProperty = "id",
    columns: dataProperties,
    data,
    types,
    plugins,
    children,
    uiActionRendererList,
  }) => {
  // Type system
  const typesOrDefault = types || TableTypesRegistryDefault;

  // Column definition management
  const columnDefinitionsDefault: GridColumnDefinitionInternal<any>[] = dataProperties.map((col) => ({
    name: col.name,
    label: isNil(col.label) ? col.name : col.label,
    type: col.type ?? "string",
    render: isNil(col.render)
      ? // if no render is specified, use then render from type registry and bind it automatically with column name
      (item) => typesOrDefault.find(col.type || "string").renderer(item[col.name])
      : // if a render function is specified, use it
      col.render,
    editable: col.editable || NOT_EDITABLE,
    editor: col.editor,
  }));

  const [columnDefinitions, setColumnDefinitions] = React.useState<GridColumnDefinitionInternal<any>[]>(
    columnDefinitionsDefault
  );

  // loading management
  const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.init);

  // data resolution management
  const [resolvedData, setResolvedData] = React.useState([] as any[]);

  useEffect(() => {
    const isLazyDataSource = isFunction(data);
    if (!isLazyDataSource) {
      setLoadingState(LoadingState.loaded);
      setResolvedData(data as any[]);
    } else {
      setLoadingState(LoadingState.pending);
      const p: Promise<any[]> = (data as any)({});
      p.then((v) => {
        setResolvedData(v);
        setLoadingState(LoadingState.loaded);
      }).catch((reject) => setLoadingState(LoadingState.loaded));
    }
  }, [data]);

  // Plugin registry
  const extensions = createExtensionPoints(plugins);
  const getPlugin = (name: string): GridPlugin<any> => {
    const plugin = plugins.find(it => it.name === name)
    if (!plugin) throw Error("Plugin not found")
    return plugin
  }

  // Edit state
  const reducer = createReducer(extensions.reducer);
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));
  const handleEditItemChange = (newItem: any) => dispatchEditState({ type: "item_change", item: newItem });

  // Client side data transform
  const dataListTransform = extensions.dataListTransform.reduce(
    (acc, current) => current(editState, acc),
    resolvedData
  );

  // sets global error (or remove it)
  const setError = (error: Error | null | undefined) =>
    dispatchEditState({
      type: "error",
      error: isNil(error) ? undefined : error
    })

  // sets an error on an item (or remove it)
  const setErrorItem = (identifier: any, error: Error | null | undefined) =>
    dispatchEditState({
      type: "error_item",
      identifier: identifier,
      error: isNil(error) ? undefined : error
    })

  // build action renderer map
  const uiActionGenericRenderers: UIActionRendererMap = associateBy(extensions.actionGenericList.map(it=>({name:it.name, render: it.render})), it => it.name)
  const uiActionItemRenderers: UIActionRendererMap = associateBy(extensions.actionItemList.map(it=>({name:it.name, renderItem: it.renderItem})), it => it.name)
  const uiActionConfigRenderers: UIActionRendererMap = associateBy(uiActionRendererList, it => it.name)
  const uiActionRendererMap:UIActionRendererMap = {
    ...uiActionGenericRenderers,
    ...uiActionItemRenderers,
    ...uiActionConfigRenderers,
  }


  // Build final context
  const ctx: GridContext<any> = {
    columnDefinitions,
    loadingState,
    types: typesOrDefault,
    resolvedData: resolvedData,
    extensions: extensions,
    identifierProperty: identifierProperty,
    state: editState,
    dispatch: dispatchEditState,
    handleEditItemChange,
    dataListTransform,
    getPlugin,
    setError,
    setErrorItem,
    UIAction: UIActionComponent(uiActionRendererMap)
  };

  return <GridContextInternal.Provider value={ctx}>{children}</GridContextInternal.Provider>;
};

interface UIActionProps {
  action: string 
  item?: any
}
const UIActionComponent = (uiActionRendererMap: UIActionRendererMap) => ({action, item}:UIActionProps) => {
  const actionRenderer =  uiActionRendererMap[action]
  let renderer:ReactNode | null = null;
  if (!isNil(actionRenderer.render)) renderer = actionRenderer.render()
  if (!isNil(actionRenderer.renderItem)) renderer = actionRenderer.renderItem(item)
  return <span style={{border:"1px solid red"}}>{renderer}</span>
}

export interface GridItemContext<T> {
  item: any;
  selectDisplayedItemActions: TableAction[];
  selectExtraItems: React.ReactNode[];
}
export const useGridItem = (item: any, context: GridContext<any>): GridItemContext<any> => {
  if (context === undefined) {
    throw new Error("useGridItem must be used within a GridProvider and an item");
  }
  const { extensions, state } = context;
  return {
    item: item,
    selectDisplayedItemActions: extensions.actionItemList.filter((a) =>
      a.displayed ? a.displayed(state, item) : true
    ),
    selectExtraItems: extensions.extraItem.map((ext) => ext(item)).filter((extra) => !isNil(extra)),
  };
};

export interface GridItemPropertyContext {
  editing: boolean;
}

export const useGridItemProperty = (
  itemPropertyName: string,
  item: any,
  context: GridContext<any>
): GridItemPropertyContext => {
  const editing = context.extensions.isEditing.some((plugin) => plugin(context.state, item, itemPropertyName));
  return {
    editing,
  };
};

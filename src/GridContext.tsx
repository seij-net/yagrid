import { isFunction, isNil } from "lodash-es";
import React, { ReactNode, ReactNodeArray, useEffect, useReducer } from "react";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { TableTypesRegistry, TableTypesRegistryDefault } from "./TableTypesRegistry";

import {
  ExtensionPoints,
  GridColumnDefinition,
  GridColumnDefinitionInternal,
  GridDataSource,
  GridPluginList,
  GridState,
  TableAction,
} from "./types";
import { createExtensionPoints } from "./utils/pluginCompose";
import { TableActionList } from "./index";

const NOT_EDITABLE = () => false;

export enum LoadingState {
  init,
  pending,
  loaded,
}

interface GridContext<T> {
  loadingState: LoadingState;
  columnDefinitions: GridColumnDefinitionInternal<T>[];
  types: TableTypesRegistry;

  extensions: ExtensionPoints<T>;
  identifierProperty: string;
  state: GridState;
  dispatch: React.Dispatch<any>;
  handleEditItemChange: (nextItem: T) => void;
  /** Data resolved before transform */
  resolvedData: T[];
  /** Data transformed by plugins, this is the data to display */
  dataListTransform: T[];
}

const defaultContext: GridContext<any> = {
  loadingState: LoadingState.init,
  columnDefinitions: [],
  types: TableTypesRegistryDefault,
  resolvedData: [],
  extensions: createExtensionPoints([]),
  identifierProperty: "id",
  state: createTableEditDefaultState("id"),
  dispatch: () => {},
  handleEditItemChange: () => {},
  dataListTransform: [],
};

const GridContextInternal = React.createContext<GridContext<any>>(defaultContext);

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
}

export const GridProvider: React.FC<GridProviderProps<any>> = ({
  identifierProperty = "id",
  columns: dataProperties,
  data,
  types,
  plugins,
  children,
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

  // Edit state
  const reducer = createReducer(extensions.reducer);
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));
  const handleEditItemChange = (newItem: any) => dispatchEditState({ type: "item_change", item: newItem });

  // Client side data transform
  const dataListTransform = extensions.dataListTransform.reduce(
    (acc, current) => current(editState, acc),
    resolvedData
  );

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
  };

  return <GridContextInternal.Provider value={ctx}>{children}</GridContextInternal.Provider>;
};

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

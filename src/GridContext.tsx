import { isFunction, isNil } from "lodash-es";
import React, { useEffect } from "react";
import { TableTypesRegistry, TableTypesRegistryDefault } from "./TableTypesRegistry";
import { GridColumnDefinition, GridColumnDefinitionInternal, GridDataSource } from "./types";

const NOT_EDITABLE = (rowData: any) => false;

export enum LoadingState {
  init,
  pending,
  loaded,
}

interface GridContext<T> {
  loadingState: LoadingState;
  columnDefinitions: GridColumnDefinitionInternal<T>[],
  types:TableTypesRegistry,
  resolvedData: T[]
}

const defaultContext: GridContext<any> = {
  loadingState: LoadingState.init,
  columnDefinitions: [],
  types:TableTypesRegistryDefault,
  resolvedData: []
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
  data: GridDataSource<T>,
  columns: GridColumnDefinition<T>[];
  types?: TableTypesRegistry;
}

export const GridProvider: React.FC<GridProviderProps<any>> = ({ 
  columns: dataProperties, 
  data,
  types, 
  children 
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

  // loading mamangement
  const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.init);

  // data management
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



  // Build final context
  const ctx: GridContext<any> = {
    columnDefinitions,
    loadingState,
    types: typesOrDefault,
    resolvedData:resolvedData
  };

  return <GridContextInternal.Provider value={ctx}>{children}</GridContextInternal.Provider>;
};

import isNil from "lodash-es/isNil";
import keyBy from "lodash-es/keyBy";
import React, { ReactElement } from "react";

export const renderToReactElement = (formatter: (curatedData: any) => string) => (data: any) =>
  isNil(data) ? "" : formatter(data);

const STRING_RENDERER = renderToReactElement((data: any) => "" + data);

export const DEFAULT_RENDERERS: { [key: string]: TableTypeRenderer<any> } = {
  string: STRING_RENDERER,
  int: STRING_RENDERER,
  decimal: STRING_RENDERER,
  boolean: STRING_RENDERER,
  percent: STRING_RENDERER,
};

function findDefaultRenderer(name: string): TableTypeRenderer<any> {
  const renderer = DEFAULT_RENDERERS[name];
  if (isNil(renderer)) return STRING_RENDERER;
  return renderer;
}

export type TableTypeRenderer<T> = (data: T | undefined | null) => ReactElement | string | null;

interface TableTypeManager<T> {
  /**
   * Nom du type
   */
  name: string;
  renderer: TableTypeRenderer<T>;
}

type TableTypes = { [type: string]: TableTypeManager<any> };

export class TableTypesRegistry {
  private readonly types: TableTypes;

  constructor(types: TableTypes) {
    this.types = types;
  }

  findOptional(type: string): TableTypeManager<any> | undefined {
    return this.types[type];
  }

  find(typeName: string): TableTypeManager<any> {
    let tableType = this.findOptional(typeName);
    if (isNil(tableType)) throw Error("Type inconnu " + typeName);
    return tableType;
  }
}

export class TableTypesRegistryBuilder {
  private types: TableTypeManager<any>[] = [];

  add<T>(name: string, renderer?: TableTypeRenderer<T>): TableTypesRegistryBuilder {
    const rendererFinal = isNil(renderer) ? findDefaultRenderer(name) : renderer;
    this.types.push({ name, renderer: rendererFinal });
    return this;
  }

  build(): TableTypesRegistry {
    let typeMap = keyBy(this.types, "name");
    // Ajoute les renderer par defaut s'ils n'existent pas
    for (let defaultrenderersKey in DEFAULT_RENDERERS) {
      if (!typeMap[defaultrenderersKey]) {
        typeMap[defaultrenderersKey] = { name: defaultrenderersKey, renderer: DEFAULT_RENDERERS[defaultrenderersKey] };
      }
    }
    return new TableTypesRegistry(typeMap);
  }
}

export const TableTypesRegistryDefault: TableTypesRegistry = new TableTypesRegistryBuilder().build();

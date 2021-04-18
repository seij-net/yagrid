import isNil from "lodash-es/isNil";
import keyBy from "lodash-es/keyBy";
import React, { ReactElement } from "react";

const NumberFormatInt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, style: "decimal" });
const NumberFormatDecimal = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "decimal",
});
const NumberFormatMonetaryAmountInt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  style: "currency",
  currencyDisplay: "narrowSymbol",
  currency: "EUR",
});
const NumberFormatMonetaryAmountDecimal = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "currency",
  currencyDisplay: "narrowSymbol",
  currency: "EUR",
});
const NumberFormatPercent = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "percent",
});

const renderToReactElement = (formatter: (curatedData: any) => string) => (data: any) =>
  isNil(data) ? "" : formatter(data);

const INT_RENDERER = renderToReactElement((data: any) => NumberFormatInt.format(data));
const DECIMAL_RENDERER = renderToReactElement((data: any) => NumberFormatDecimal.format(data));
const STRING_RENDERER = renderToReactElement((data: any) => "" + data);
const BOOLEAN_RENDERER = renderToReactElement((data: any) => "" + data);
const MONETARY_AMOUNT_INT_RENDERER = renderToReactElement((data: any) => NumberFormatMonetaryAmountInt.format(data));
const MONETARY_AMOUNT_DECIMAL_RENDERER = renderToReactElement((data: any) =>
  NumberFormatMonetaryAmountDecimal.format(data)
);
const PERCENT_RENDERER = renderToReactElement((data: any) => NumberFormatPercent.format(data));

export const DEFAULT_RENDERERS: { [key: string]: TableTypeRenderer<any> } = {
  string: STRING_RENDERER,
  int: INT_RENDERER,
  decimal: DECIMAL_RENDERER,
  boolean: BOOLEAN_RENDERER,
  monetaryAmountInt: MONETARY_AMOUNT_INT_RENDERER,
  monetaryAmountDecimal: MONETARY_AMOUNT_DECIMAL_RENDERER,
  percent: PERCENT_RENDERER,
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

  add<T>(name: string, renderer?: (data: T) => ReactElement): TableTypesRegistryBuilder {
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

import React from "react";
import { GridProps } from "../types";
import "tailwindcss/dist/tailwind.min.css";
import "@tailwindcss/forms/dist/forms.min.css";
import "./YAGridPlayground.css";
import { Table } from "../Table";
import { renderToReactElement, TypesRegistryBuilder } from "../TableTypesRegistry";
export const YAGridPlayground: React.FC<GridProps<any>> = ({ children, ...args }) => {
  return (
    <div>
      <h1 className="text-2xl">Playground</h1>
      <p>
        Note that YAGrid doesn't provide any CSS or style to stay style-agnostic. Here we use <code>tailwindcss</code>{" "}
        and <code>tailwindcss/forms</code> for a default styling. edit-inline, edit-add and edit-delete plugins are
        provided. <br />
        OK it's ugly, but useful for component design-time.
      </p>
      <p>&nbsp;</p>
      <Table className="table-auto yagrid-table-playground" {...args} />
    </div>
  );
};


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

const INT_RENDERER = renderToReactElement((data: any) => NumberFormatInt.format(data));
const DECIMAL_RENDERER = renderToReactElement((data: any) => NumberFormatDecimal.format(data));
const BOOLEAN_RENDERER = renderToReactElement((data: any) => data ? "✅" : "");
const MONETARY_AMOUNT_INT_RENDERER = renderToReactElement((data: any) => NumberFormatMonetaryAmountInt.format(data));
const MONETARY_AMOUNT_DECIMAL_RENDERER = renderToReactElement((data: any) =>
  NumberFormatMonetaryAmountDecimal.format(data)
);
const PERCENT_RENDERER = renderToReactElement((data: any) => NumberFormatPercent.format(data));


export const customTypes = new TypesRegistryBuilder()
  .add("monetaryAmountInt", MONETARY_AMOUNT_INT_RENDERER)
  .add("monetaryAmountDecimal", MONETARY_AMOUNT_DECIMAL_RENDERER)
  .add("boolean", BOOLEAN_RENDERER)
  .add("integer", INT_RENDERER)
  .add("decimal", DECIMAL_RENDERER)
  .add("percent", PERCENT_RENDERER)
  .build();
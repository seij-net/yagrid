import { renderToReactElement } from "./TableTypesRegistry";

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
const STRING_RENDERER = renderToReactElement((data: any) => "" + data);
const BOOLEAN_RENDERER = renderToReactElement((data: any) => "" + data);
const MONETARY_AMOUNT_INT_RENDERER = renderToReactElement((data: any) => NumberFormatMonetaryAmountInt.format(data));
const MONETARY_AMOUNT_DECIMAL_RENDERER = renderToReactElement((data: any) =>
  NumberFormatMonetaryAmountDecimal.format(data)
);
const PERCENT_RENDERER = renderToReactElement((data: any) => NumberFormatPercent.format(data));

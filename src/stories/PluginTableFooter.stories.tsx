import { Meta, Story } from "@storybook/react";
import React from "react";

import { GridProps, TableFooter } from "..";
import { SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/TableFooter",
  component: YAGridPlayground
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true
}));

export const Footer: Story<{}> = (props) => {
  const { data, sampleColumns } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      TableFooter.create({
        rows: (data, columnCount) => (
          <>
            <tr style={{ backgroundColor: "#efefaa" }}>
              <td colSpan={columnCount}>Custom Footer 1 : you have {data.length} items in your collection</td>
            </tr>
            <tr style={{ backgroundColor: "#efaaef" }}>
              <td colSpan={3} style={{ textAlign: "right" }}>
                Total €
              </td>
              <td>{data.reduce((acc, item) => acc + (item.amount || 0), 0)}</td>
              <td>{data.reduce((acc, item) => acc + (item.cb ? 1 : 0), 0)}</td>
            </tr>
          </>
        )
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

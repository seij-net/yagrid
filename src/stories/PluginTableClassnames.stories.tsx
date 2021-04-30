import { Meta, Story } from "@storybook/react";
import React from "react";

import { GridProps, ItemAdd, TableClassNames } from "..";
import { SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/TableClassnames",
  component: YAGridPlayground
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true
}));

export const All: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({onAddConfirm:handleAddConfirm, onAddTemplate:handleAddTemplate}),
      TableClassNames.create({
        table:"sample-table",
        thead: "sample-thead",
        theadRow: "sample-thead-row",
        theadCell: "sample-thead-cell",
        theadCellActionsStart: "sample-thead-actions-start",
        theadCellActionsEnd: "sample-thead-actions-end",
        tbody:"sample-tbody",
        tbodyRow: "sample-tbody-row",
        tbodyRowExtra: "sample-tbody-row-extra",
        tbodyCell: "sample-tbody-cell",
        tbodyCellActionsEnd: "sample-tbody-cell-actions-end",
        tbodyCellActionsStart: "sample-tbody-cell-actions-start",
        tbodyCellExtra: "sample-tbody-row-extra",
        tfoot: "sample-tfoot",
        tfootRow: "sample-tfoot-row"
        
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
export const AllDynamic: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({onAddConfirm:handleAddConfirm, onAddTemplate:handleAddTemplate}),
      TableClassNames.create<SampleItem>({
        table:"sample-table",
        thead: "sample-thead",
        theadRow: "sample-thead-row",
        theadCell: (column) => "sample-thead-cell-"+column.name+"--"+column.type,
        theadCellActionsStart: "sample-thead-actions-start",
        theadCellActionsEnd: "sample-thead-actions-end",
        tbody:"sample-tbody",
        tbodyRow: "sample-tbody-row",
        tbodyRowExtra: "sample-tbody-row-extra",
        tbodyCell: (item, column) => "sample-tbody-cell-"+column.name+"-"+column.type+"-"+item.id,
        tbodyCellActionsEnd: (item) => "sample-tbody-cell-actions-end-"+item.id,
        tbodyCellActionsStart: (item) => "sample-tbody-cell-actions-start-"+item.id,
        tbodyCellExtra: (item) => "sample-tbody-row-extra-"+item.id,
        tfoot: "sample-tfoot",
        tfootRow: "sample-tfoot-row"
        
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

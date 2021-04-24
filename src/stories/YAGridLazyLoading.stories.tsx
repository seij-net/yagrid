import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React from "react";

import { GridProps, ItemAdd, ItemDelete, ItemEdit } from "..";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/LazyLoading",
  component: YAGridPlayground
} as Meta;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const ComponentsInLabelsAndCells: Story<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm } = useData(sampledata);

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: sampleColumns,
    data: (query) => delay(1000).then(() => data),
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => !item.readonly
      }),
      ItemAdd.create({
        onAddTemplate: handleAddTemplate,
        onAddConfirm: handleAddConfirm
      }),
      ItemDelete.create({
        onDelete: handleDelete,
        deletable: (item) => isNil(item.deletable) ? true : item.deletable
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

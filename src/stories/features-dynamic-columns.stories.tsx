import { Meta, Story } from "@storybook/react";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { GridProps } from "../types";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";
import { ItemAdd, ItemDelete, ItemEdit } from "../index";
import { isNil } from "lodash-es";
import React from "react";

export default {
  title: "Playground/YAGridPlayground/DynamicColumns",
  component: YAGridPlayground,
  args: {
    displayColumnLabel: true,
    displayColumnDescription: true
  },
} as Meta;
export const DynamicColumns:Story<{displayColumnLabel: boolean, displayColumnDescription:boolean}> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm } = useData(sampledata);
  const columns = sampleColumns.filter(it => {
    if (it.name === "label") return props.displayColumnLabel
    if (it.name === "description") return props.displayColumnDescription
    return true
  })
  const gridProps: GridProps<SampleItem> = {
    columns: columns,
    data: data,
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
}

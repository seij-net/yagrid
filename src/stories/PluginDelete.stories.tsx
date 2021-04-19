import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React, { useState } from "react";

import { GridProps, ItemDelete, ItemEdit } from "..";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/Edit",
  component: YAGridPlayground,
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: "" + it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true,
}));

export const Empty: Story<{}> = (props) => {
  const {data, sampleColumns, handleEdit} = useData([])
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    editable: true,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true
      })
    ]
  }
  return <YAGridPlayground {...gridProps} />
}

export const NotEmpty: Story<{}> = (props) => {
  const {data, sampleColumns, handleEdit} = useData(SAMPLE_DATA)
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    editable: true,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true
      })
    ]
  }
  return <YAGridPlayground {...gridProps} />
}

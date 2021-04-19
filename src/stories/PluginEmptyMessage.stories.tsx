import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";

import { EmptyMessage, GridProps, ItemAdd } from "..";
import { SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/EmptyMessage",
  component: YAGridPlayground,
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: "" + it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true,
}));

export const EmptyString: Story<{}> = (props) => {
  const { data, sampleColumns } = useData([]);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    editable: true,
    types: customTypes,
    plugins: [
      EmptyMessage.create({
        message: "Nothing to see here",
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

export const EmptyComponent: Story<{}> = (props) => {
  const { data, sampleColumns } = useData([]);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    editable: true,
    types: customTypes,
    plugins: [
      EmptyMessage.create({
        message: <div style={{ color: "red", textAlign: "center" }}>Nothing to see here</div>,
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

export const NotEmpty: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    editable: true,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate,
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

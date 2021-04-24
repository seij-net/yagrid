import { Meta, Story } from "@storybook/react";
import React from "react";

import { GridProps, ItemEdit } from "..";
import { SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/Edit",
  component: YAGridPlayground
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true
}));

export const Empty: Story<{}> = (props) => {
  const { data, sampleColumns, handleEdit } = useData([]);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

export const NotEmpty: Story<{}> = (props) => {
  const { data, sampleColumns, handleEdit } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

export const CustomLabels: Story<{}> = (props) => {
  const { data, sampleColumns, handleEdit } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true,
        labelEditButton: "Modifier",
        labelEditButtonCancel: "Annuler",
        labelEditButtonConfirm: "OK"
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
export const CustomLabelsReact: Story<{}> = (props) => {
  const { data, sampleColumns, handleEdit } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => true,
        labelEditButton: <span style={{ backgroundColor: "yellow" }}>Modifier</span>,
        labelEditButtonCancel: <span style={{ backgroundColor: "yellow" }}>Annuler</span>,
        labelEditButtonConfirm: <span style={{ backgroundColor: "yellow" }}>OK</span>
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
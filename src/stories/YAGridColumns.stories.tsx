import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React, { FC } from "react";

import { GridProps, ItemAdd, ItemDelete, ItemEdit } from "..";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/Components",
  component: YAGridPlayground
} as Meta;

const CustomComponent: FC<{}> = ({ children }) => <span style={{ color: "green" }}>{children}</span>;

export const ComponentsInLabelsAndCells: Story<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm } = useData(sampledata);

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: [{
      name: "component",
      label: <CustomComponent>Component</CustomComponent>,
      render: (data) => (<CustomComponent>{data.id}</CustomComponent>)
    }, ...sampleColumns],
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
};

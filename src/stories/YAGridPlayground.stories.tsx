import { Meta, Story } from "@storybook/react";
import { isNil, minBy } from "lodash-es";
import React, { useState } from "react";

import { ItemDelete, ItemEdit, ItemAdd, GridProps } from "..";
import { SampleItem, useData, sampledata } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground",
  component: YAGridPlayground,
} as Meta;



const TableEditable: React.FC<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm} = useData(props.data)

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns:sampleColumns,
    data: data,
    types: customTypes,
    plugins: [
      ItemEdit.create({
        onEdit: handleEdit,
        editable: (item) => !item.readonly
      }),
      ItemAdd.create({
        onAddTemplate: handleAddTemplate,
        onAddConfirm: handleAddConfirm,
      }),
      ItemDelete.create({
        onDelete: handleDelete,
        deletable: (item) => isNil(item.deletable) ? true : item.deletable
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};


const Template: Story<GridProps<any>> = (args) => <TableEditable {...args}></TableEditable>;

export const Empty = Template.bind({});
Empty.args = {};

export const Filled = Template.bind({});
Filled.args = {
  editable: true,
  data: sampledata,
};


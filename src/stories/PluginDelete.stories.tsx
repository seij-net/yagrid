import { Meta, Story } from "@storybook/react";
import { isNil, minBy } from "lodash-es";
import React, { useState } from "react";

import { ItemDelete, ItemEdit, ItemAdd, GridProps } from "..";
import { sampledata, SampleItem } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/Delete/Complete",
  component: YAGridPlayground,
} as Meta;

const TableEditable: React.FC<GridProps<any>> = (props) => {
  const [data, setData] = useState(props.data);

  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: [{ name: "id", label: "#" }, { name: "label" }, { name: "description" }, { name: "amount" }],
    data: data,
    types: customTypes,
    plugins: [
      ItemDelete.create({
        onDelete: handleDelete,
        deletable: (item) => (isNil(item.deletable) ? true : item.deletable),
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

const Template: Story<GridProps<any>> = (args) => <TableEditable {...args}></TableEditable>;

export const Empty = Template.bind({});
Empty.args = {
  data: []
};

export const Filled = Template.bind({});
Filled.args = {
  editable: true,
  data: sampledata,
};

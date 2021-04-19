import { Meta, Story } from "@storybook/react";
import { isNil, minBy } from "lodash-es";
import React, { useState } from "react";

import { ItemDelete, ItemEdit, ItemAdd, GridProps } from "..";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground",
  component: YAGridPlayground,
} as Meta;

const nextMinId = (data:SampleItem[]):string => {
  let minIdItem = minBy(data, (it) => parseInt(it.id));
  let minId = isNil(minIdItem) ? -1 : parseInt(minIdItem.id)
  return "" + ((minId===0 || minId===1) ? -1 : minId - 1) 
}

const TableEditable: React.FC<GridProps<any>> = (props) => {
  const [data, setData] = useState(props.data);

  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));
  const handleEdit = async (item: any) =>
    setData((prevState) => prevState.map((it) => (it.id === item.id ? item : it)));
  const handleAddTemplate = async () => {
    return { id: nextMinId(data), description: "", cb: false, amount: 0, label: "New item" } as SampleItem;
  };
  const handleAddConfirm = async (item: any) => {
    setData((prevState) => {
      return [...prevState, { ...item, id: nextMinId(prevState) }];
    });
  };

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: [
      { name: "id", label: "#"},
      { name: "label" },
      
      {
        name: "description",
        editor: (data, onValueChange) => (
          <input
            type="text"
            defaultValue={data.description || ""}
            onChange={(evt) => onValueChange({ ...data, description: evt.target.value })}
          />
        ),
      },
      {
        name: "amount",
        label: "Integer amount",
        type: "monetaryAmountInt",
        editor: (data, onValueChange) => (
          <input
            type="number"
            defaultValue={data.amount || ""}
            onChange={(evt) => onValueChange({ ...data, amount: parseInt(evt.target.value) })}
          />
        ),
      },
      {
        name: "cb",
        label: "Checkbox",
        type: "boolean",
        editor: (data, onValueChange) =>
          isNil(data.cb) ? null : (
            <input type="checkbox" checked={data.cb || false} onChange={() => onValueChange({ ...data, cb: !data })} />
          ),
      },
    ],
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



interface SampleItem {
  id: string;
  label: string;
  description: string | null;
  amount: number | null;
  cb: boolean | null;
  readonly?: boolean,
  deletable?: boolean
}

const sampledata: SampleItem[] = [
  { id: "1", label: "item 1", description: "description 1", amount: 123456, cb: true },
  { id: "2", label: "item 2", description: "description 2", amount: 978654, cb: false },
  { id: "3", label: "item almost empty", description: null, amount: null, cb: null },
  { id: "4", label: "not editable but delete ok", description: null, amount: null, cb: null, readonly:true },
  { id: "5", label: "editable but can not be deleted", description: null, amount: null, cb: null, readonly:false, deletable: false },
];

const Template: Story<GridProps<any>> = (args) => <TableEditable {...args}></TableEditable>;

export const Empty = Template.bind({});
Empty.args = {};

export const Filled = Template.bind({});
Filled.args = {
  editable: true,
  data: sampledata,
};

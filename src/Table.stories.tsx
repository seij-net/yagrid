import { Meta, Story } from "@storybook/react";
import { isNil, minBy } from "lodash-es";
import React, { useState } from "react";
import "bulma/css/bulma.css"
import { deletePlugin } from "./plugins/edit-delete/edit-delete";
import { editorAdd } from "./plugins/edit-inline-add/edit-inline-add";
import { editInline } from "./plugins/edit-inline/edit-inline";
import { Table } from "./Table";
import { GridProps } from "./types";

export default {
  title: "TableComponents/Table",
  component: Table,
} as Meta;

const TableEditable: React.FC<GridProps<any>> = (props) => {
  const [data, setData] = useState(props.data);

  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));
  const handleEdit = async (item: any) =>
    setData((prevState) => prevState.map((it) => (it.id === item.id ? item : it)));
  const handleAdd = async () => {
    return { id: "___NEW___", description: "", cb: false, amount: 0, label: "New item" } as SampleItem;
  };
  const handleAddConfirm = async (item: any) => {
    setData((prevState) => {
      let minIdItem = minBy(prevState, (it) => parseInt(it.id));
      const newId = (minIdItem?.id ?? 0) - 1;
      return [...prevState, { ...item, id: newId }];
    });
  };

  const gridProps: GridProps<SampleItem> = {
    ...props,
    className:"table",
    columns: [
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
    plugins: [
      editInline({
        onEdit: handleEdit,
        editable: (item) => !item.readonly
      }),
      editorAdd({
        onAddTemplate: handleAdd,
        onAddConfirm: handleAddConfirm,
      }),
      deletePlugin({
        onDelete: handleDelete,
      }),
    ],
  };
  return <div>
    <h1 className="title">Playground</h1>
    <p>
      Note that YAGrid doesn't provide any CSS or style to stay style-agnostic. Here we use Bulma for a default styling.
      edit-inline, edit-add and edit-delete plugins are provided. 
    </p>
    <p>&nbsp;</p>
    <div><Table {...gridProps} /></div></div>;
};

const Template: Story<GridProps<any>> = (args) => <TableEditable {...args} />;

interface SampleItem {
  id: string;
  label: string;
  description: string | null;
  amount: number | null;
  cb: boolean | null;
  readonly?: boolean
}

const sampledata: SampleItem[] = [
  { id: "1", label: "item 1", description: "description 1", amount: 123456, cb: true },
  { id: "2", label: "item 2", description: "description 2", amount: 978654, cb: false },
  { id: "3", label: "item almost empty", description: null, amount: null, cb: null },
  { id: "4", label: "not editable", description: null, amount: null, cb: null, readonly:true },
];

export const Empty = Template.bind({});
Empty.args = {};

export const Filled = Template.bind({});
Filled.args = {
  editable: true,
  data: sampledata,
};

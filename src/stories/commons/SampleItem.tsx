import { isFunction, isNil, maxBy } from "lodash-es";
import React, { useState } from "react";

import { GridColumnDefinition, GridDataSource } from "../../types";

export interface SampleItem {
  id: number;
  label: string;
  description: string | null;
  amount: number | null;
  cb: boolean | null;
  readonly?: boolean;
  deletable?: boolean;
}

export const sampledata: SampleItem[] = [
  { id: 1, label: "item 1", description: "description 1", amount: 123456, cb: true },
  { id: 2, label: "item 2", description: "description 2", amount: 978654, cb: false },
  { id: 3, label: "item almost empty", description: null, amount: null, cb: null },
  { id: 4, label: "not editable but delete ok", description: null, amount: null, cb: null, readonly: true },
  {
    id: 5,
    label: "editable but can not be deleted",
    description: null,
    amount: null,
    cb: null,
    readonly: false,
    deletable: false
  }
];

export const nextId = (data: SampleItem[]): number => {
  if (data.length == 0) return 1;
  let maxIdItem = maxBy(data, (it) => it.id);
  let maxId = isNil(maxIdItem) ? 1 : maxIdItem.id;
  return maxId + 1;
};

export const useData = (initialData: GridDataSource<SampleItem> = []) => {
  if (isFunction(initialData)) throw Error("Playground only supports synchronized data");
  const [data, setData] = useState(initialData as SampleItem[]);
  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));
  const handleEdit = async (item: any) =>
    setData((prevState) => prevState.map((it) => (it.id === item.id ? item : it)));
  const handleAddTemplate = async () => {
    return { id: nextId(data), description: "", cb: false, amount: 0, label: "New item" } as SampleItem;
  };
  const handleAddConfirm = async (item: any) => {
    setData((prevState) => {
      return [...prevState, { ...item, id: nextId(prevState) }];
    });
  };
  const sampleColumns: GridColumnDefinition<SampleItem>[] = [
    { name: "id", label: "#" },
    { name: "label" },

    {
      name: "description",
      editor: (data, onValueChange) => (
        <input
          type="text"
          defaultValue={data.description || ""}
          onChange={(evt) => onValueChange({ ...data, description: evt.target.value })}
        />
      )
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
      )
    },
    {
      name: "cb",
      label: "Checkbox",
      type: "boolean",
      editor: (data, onValueChange) =>
        isNil(data.cb) ? null : (
          <input type="checkbox" checked={data.cb || false} onChange={() => onValueChange({ ...data, cb: !data.cb })} />
        )
    }
  ];
  return { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm };
};

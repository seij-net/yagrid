import { isFunction, isNil, maxBy } from "lodash-es";
import React, { useState } from "react";

import { GridColumnDefinition, GridDataSource } from "../../types";

export interface TodoListItem {
  id: number;
  label: string;
  description: string | null;
}

export const sampledata: TodoListItem[] = [
  { id: 1, label: "item 1", description: "description 1" },
  { id: 2, label: "item 2", description: "description 2" },
  { id: 3, label: "item 3 no description", description: null }
];

export const nextId = (data: TodoListItem[]): number => {
  if (data.length == 0) return 1;
  let maxIdItem = maxBy(data, (it) => it.id);
  let maxId = isNil(maxIdItem) ? 1 : maxIdItem.id;
  return maxId + 1;
};

export const useData = (initialData: GridDataSource<TodoListItem> = []) => {
  if (isFunction(initialData)) throw Error("Playground only supports synchronized data");
  const [data, setData] = useState(initialData as TodoListItem[]);
  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));
  const handleEdit = async (item: any) =>
    setData((prevState) => prevState.map((it) => (it.id === item.id ? item : it)));
  const handleAddTemplate = async () => {
    return { id: nextId(data), description: "" } as TodoListItem;
  };
  const handleAddConfirm = async (item: any) => {
    setData((prevState) => {
      return [...prevState, { ...item, id: nextId(prevState) }];
    });
  };
  const sampleColumns: GridColumnDefinition<TodoListItem>[] = [
    {
      name: "label",
      editor: (data, onValueChange) => (
        <input
          type="text"
          defaultValue={data.label || ""}
          onChange={(evt) => onValueChange({ ...data, label: evt.target.value })}
        />
      )
    },
    {
      name: "description",
      editor: (data, onValueChange) => (
        <input
          type="text"
          defaultValue={data.description || ""}
          onChange={(evt) => onValueChange({ ...data, description: evt.target.value })}
        />
      )
    }
  ];
  return { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm };
};

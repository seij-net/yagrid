import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React from "react";

import { GridProps, ItemAdd, ItemDelete, ItemEdit } from "..";
import { Grid } from "../Table";
import { sampledata, TodoListItem, useData } from "./commons/TodoListItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/CustomLayout",
  component: YAGridPlayground
} as Meta;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const TodoList: Story<GridProps<TodoListItem>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm } = useData(sampledata);

  const gridProps: GridProps<TodoListItem> = {
    ...props,
    columns: sampleColumns,
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
  return (
    <div>
      <h1 className="text-2xl">Todo List</h1>
      <p> Displays a simple todo list with a custom layout </p>
      <p>&nbsp;</p>
      <Grid className="table-auto yagrid-table-playground" {...gridProps} />
    </div>
  );
};

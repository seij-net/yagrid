import { Meta, Story } from "@storybook/react";
import React, { FC, useState } from "react";

import { GridProps, TableFooter } from "..";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/CustomPlugins",
  component: YAGridPlayground,
} as Meta;

export const ComponentsInLabelsAndCells: Story<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm } = useData(sampledata);
  const [opened, setOpened] = useState<number | null>(null);
  const handleOpenClose = (id: number) => {
    setOpened(opened === id ? null : id);
  };
  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: sampleColumns,
    data: data,
    types: customTypes,
    plugins: [
      {
        name: "my-plugin",
        extraItem: (item) =>
          opened === item.id ? <span key="extra">EXTRA item details = {JSON.stringify(item)}</span> : null,
        actionItemList: [
          {
            name: "my-action-start",
            position: "start",
            renderItem: (item) => (
              <span onClick={() => handleOpenClose(item.id)}>{opened === item.id ? "⬇️" : "➡️"}</span>
            ),
          },
          {
            name: "my-action-end",
            position: "end",
            renderItem: (item) => (
              <span onClick={() => handleOpenClose(item.id)}>{opened === item.id ? "⬇️" : "➡️"}</span>
            ),
          },
        ],
      },
      TableFooter.create({
        rows: (data, columnCount) => (
          <tr key="myfooter">
            <td colSpan={columnCount} style={{ backgroundColor: "#efefaa" }}>
              This footer shall span across all columns
            </td>
          </tr>
        ),
      }),
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

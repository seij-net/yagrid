import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React, { FC } from "react";

import { ItemDelete, ItemEdit, ItemAdd, GridProps, TableFooter } from "..";
import { SampleItem, useData, sampledata } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/CustomPlugins",
  component: YAGridPlayground,
} as Meta;

export const ComponentsInLabelsAndCells: Story<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete, handleEdit, handleAddTemplate, handleAddConfirm} = useData(sampledata)

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns:sampleColumns,
    data: data,
    types: customTypes,
    plugins: [
      {
        name: "my-plugin",
        actionItemList:[{
          name: "my-action-start",
          position: "start",
          render: (state, dispatch) => <button type="button" onClick={(evt)=>console.log("button start", evt)}>MyButton start</button>
        },{
          name: "my-action-end",
          position: "end",
          render: (state, dispatch) => <button type="button" onClick={(evt)=>console.log("button end", evt)}>MyButton end</button>
        }]
      },
      TableFooter.create({
        rows: (data, columnCount)=><tr><td colSpan={columnCount}>------</td></tr>
      })
    ],
  };
  return <YAGridPlayground {...gridProps} />;
};

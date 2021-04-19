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

const DEFAULT_COLUMNS = [{ name: "id", label: "#" }, { name: "label" }, { name: "description" }, { name: "amount" }]
const SAMPLE_DATA:SampleItem[] = [1,2,3,4,5,6].map(it=>({id: ""+it, label:"item "+it, description: "", amount: it*10, cb:true}))

const TableEditable: React.FC<GridProps<any>> = (props) => {
  const [data, setData] = useState(props.data);

  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));

  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: DEFAULT_COLUMNS,
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

export const CustomLabelsString: Story<{}> = (props) => {
  const gridProps: GridProps<SampleItem> = {
    data: SAMPLE_DATA,
    columns: DEFAULT_COLUMNS,
    editable: true,
    plugins: [
      ItemDelete.create({
        onDelete: ()=>Promise.resolve(),
        labelDeleteButton: "Supprimer",
        labelDeleteConfirm: "Confirmer : ",
        labelDeleteConfirmButton: "OK",
        labelDeleteCancelButton: "Annuler",
      }),
    ]
  }
  return <YAGridPlayground {...gridProps} />;
}
export const CustomLabelsReact: Story<{}> = (props) => {
  const gridProps: GridProps<SampleItem> = {
    data: SAMPLE_DATA,
    columns: DEFAULT_COLUMNS,
    editable: true,
    plugins: [
      ItemDelete.create({
        onDelete: ()=>Promise.resolve(),
        labelDeleteButton: <span style={{backgroundColor:'yellow'}}>Supprimer</span>,
        labelDeleteConfirm: <span style={{backgroundColor:'yellow'}}>Confirmer?</span>,
        labelDeleteConfirmButton: <span style={{backgroundColor:'yellow'}}>OK</span>,
        labelDeleteCancelButton: <span style={{backgroundColor:'yellow'}}>Annuler</span>,
      }),
    ]
  }
  return <YAGridPlayground {...gridProps} />;
}

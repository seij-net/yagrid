import { Meta, Story } from "@storybook/react";
import { isNil } from "lodash-es";
import React from "react";

import { GridProps, ItemDelete } from "..";
import { sampledata, SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/Delete",
  component: YAGridPlayground
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true
}));

const TableEditable: React.FC<GridProps<any>> = (props) => {
  const { data, sampleColumns, handleDelete } = useData(props.data);
  const gridProps: GridProps<SampleItem> = {
    ...props,
    columns: sampleColumns,
    data: data,
    types: customTypes,
    plugins: [
      ItemDelete.create({
        onDelete: handleDelete,
        deletable: (item) => (isNil(item.deletable) ? true : item.deletable)
      })
    ]
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
  data: sampledata
};

export const CustomLabelsString: Story<{}> = (props) => {
  const { data, sampleColumns, handleDelete } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemDelete.create({
        onDelete: handleDelete,
        labelDeleteButton: "Supprimer",
        labelDeleteConfirm: "Confirmer : ",
        labelDeleteConfirmButton: "OK",
        labelDeleteCancelButton: "Annuler"
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
export const CustomLabelsReact: Story<{}> = (props) => {
  const { data, sampleColumns, handleDelete } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemDelete.create({
        onDelete: handleDelete,
        labelDeleteButton: <span style={{ backgroundColor: "yellow" }}>Supprimer</span>,
        labelDeleteConfirm: <span style={{ backgroundColor: "yellow" }}>Confirmer?</span>,
        labelDeleteConfirmButton: <span style={{ backgroundColor: "yellow" }}>OK</span>,
        labelDeleteCancelButton: <span style={{ backgroundColor: "yellow" }}>Annuler</span>
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

export const CustomUIActions: Story<{}> = (props) => {
  const { data, sampleColumns, handleDelete } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemDelete.create({
        onDelete: handleDelete,
        labelDeleteButton: <span style={{ backgroundColor: "yellow" }}>Supprimer</span>,
        labelDeleteConfirm: <span style={{ backgroundColor: "yellow" }}>Confirmer?</span>,
        labelDeleteConfirmButton: <span style={{ backgroundColor: "yellow" }}>OK</span>,
        labelDeleteCancelButton: <span style={{ backgroundColor: "yellow" }}>Annuler</span>
      })
    ],
    actionRenderers: [{
      name: ItemDelete.UI_ACTION_DELETE,
      renderItem: item => {
        const uiActionProps = ItemDelete.createUIActionPropsDelete(item)
        const config = ItemDelete.getPluginConfig()
        const handleClick = async ()=> {
          await uiActionProps.onDelete()
          await uiActionProps.onDeleteConfirm()
        }
        return <button onClick={handleClick}>special delete {config.labelDeleteButton}</button>
      }
    }]
  };
  return <YAGridPlayground {...gridProps} />;
};

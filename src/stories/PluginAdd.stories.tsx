import { Meta, Story } from "@storybook/react";
import React from "react";

import { GridProps, ItemAdd, useGrid } from "..";
import { SampleItem, useData } from "./commons/SampleItem";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Plugin/Add",
  component: YAGridPlayground
} as Meta;

const SAMPLE_DATA: SampleItem[] = [1, 2, 3, 4, 5, 6].map((it) => ({
  id: it,
  label: "item " + it,
  description: "",
  amount: it * 10,
  cb: true
}));

export const Empty: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData([]);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

export const NotEmpty: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};

export const CustomLabels: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate,
        labelAddButton: "Ajouter",
        labelAddButtonCancel: "Annuler",
        labelAddButtonConfirm: "OK"
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
export const CustomLabelsReact: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate,
        labelAddButton: <span style={{ backgroundColor: "yellow" }}>Ajouter</span>,
        labelAddButtonCancel: <span style={{ backgroundColor: "yellow" }}>Annuler</span>,
        labelAddButtonConfirm: <span style={{ backgroundColor: "yellow" }}>OK</span>
      })
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
export const CustomUIActions: Story<{}> = (props) => {
  const { data, sampleColumns, handleAddConfirm, handleAddTemplate } = useData(SAMPLE_DATA);
  const gridProps: GridProps<SampleItem> = {
    data: data,
    columns: sampleColumns,
    types: customTypes,
    plugins: [
      ItemAdd.create({
        onAddConfirm: handleAddConfirm,
        onAddTemplate: handleAddTemplate,
        labelAddButton: <span style={{ backgroundColor: "yellow" }}>Ajouter</span>,
        labelAddButtonCancel: <span style={{ backgroundColor: "yellow" }}>Annuler</span>,
        labelAddButtonConfirm: <span style={{ backgroundColor: "yellow" }}>OK</span>
      })
    ],
    actionRenderers: [
      {
        name: ItemAdd.UI_ACTION_ADD, 
        render: () => {
          const { getPlugin } = useGrid()
          const pluginConfig = getPlugin(ItemAdd.PLUGIN_NAME).config as ItemAdd.Config<any>
          const buttonProps = ItemAdd.createItemAdd()
          return <button {...buttonProps.buttonProps}>customButton {pluginConfig.labelAddButton}</button>
        }
      },
      {
        name: ItemAdd.UI_ACTION_ADD_CANCEL, 
        render: () => {
          const { getPlugin } = useGrid()
          const buttonProps = ItemAdd.createItemAddCancel()
          const pluginConfig = getPlugin(ItemAdd.PLUGIN_NAME).config as ItemAdd.Config<any>
          return <button {...buttonProps.buttonProps}>customButton {pluginConfig.labelAddButtonCancel}</button>
        }
      },
      {
        name: ItemAdd.UI_ACTION_ADD_CONFIRM, 
        render: () => {
          const { getPlugin } = useGrid()
          const buttonProps = ItemAdd.createItemAddConfirm()
          const pluginConfig = getPlugin(ItemAdd.PLUGIN_NAME).config as ItemAdd.Config<any>
          return <button {...buttonProps.buttonProps}>customButton {pluginConfig.labelAddButtonConfirm}</button>
        }
      }
    ]
  };
  return <YAGridPlayground {...gridProps} />;
};
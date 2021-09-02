import React from "react";
import { createUIActionPropsAdd, createUIActionPropsAddCancel, createUIActionPropsAddConfirm, getPluginConfig } from "./item-add-builder";

export const ActionAdd = () => {
  const buttonProps = createUIActionPropsAdd()
  const config = getPluginConfig()
  return (
    <button {...buttonProps}>{config.labelAddButton}</button>
  );
};


export const ActionAddOk = () => {
  const buttonProps= createUIActionPropsAddConfirm()
  const config = getPluginConfig()
  return <button {...buttonProps}>{config.labelAddButtonConfirm}</button>;
};

export const ActionAddCancel = () => {
  const buttonProps = createUIActionPropsAddCancel()
  const config = getPluginConfig()
  return <button {...buttonProps}>{config.labelAddButtonCancel}</button>;
};


import React from "react";
import { createItemAdd, createItemAddCancel, createItemAddConfirm } from "./item-add-builder";

export const ActionAdd = () => {
  const {buttonProps, config} = createItemAdd()
  return (
    <button {...buttonProps}>{config.labelAddButton}</button>
  );
};


export const ActionAddOk = () => {
  const { buttonProps, config} = createItemAddConfirm()
  return <button {...buttonProps}>{config.labelAddButtonConfirm}</button>;
};

export const ActionAddCancel = () => {
  const { buttonProps, config} = createItemAddCancel()
  return <button {...buttonProps}>{config.labelAddButtonCancel}</button>;
};


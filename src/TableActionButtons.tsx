import React from "react";

import { TableAction } from "./types";

export const ACTION_EDIT: TableAction = {
  name: "edit",
  displayed: (state, item) => state.editedItemState === undefined,
  render: (state, dispatch) => {
    return <button onClick={dispatch.listeners.onEditItem}>Modifier</button>;
  },
};
export const ACTION_EDIT_OK: TableAction = {
  name: "edit_ok",
  displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "edit",
  render: (state, dispatch) => {
    return <button onClick={dispatch.listeners.onEditItemCommit}>OK</button>;
  },
};

export const ACTION_EDIT_CANCEL: TableAction = {
  name: "edit_cancel",
  displayed: (state, item) => item.id === state.editedItemId && state.editedItemState === "edit",
  render: (state, dispatch) => {
    return <button onClick={dispatch.listeners.onEditItemCancel}>Annuler</button>;
  },
};

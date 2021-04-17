import { TableAction } from "./types";
import React from "react";


export const ACTION_EDIT: TableAction = {
    name: "edit",
    displayed: (state, item) => state.itemState === undefined,
    render: (state, dispatch) => {
        return <button onClick={ dispatch.listeners.onEditItem }>Modifier</button>
    }
}
export const ACTION_EDIT_OK: TableAction = {
    name: "edit_ok",
    displayed: (state, item) => state.itemId === item.id && state.itemState === "edit",
    render: (state, dispatch) => {
        return <button onClick={ dispatch.listeners.onEditItemCommit }>OK</button>
    }
}

export const ACTION_EDIT_CANCEL: TableAction = {
    name: "edit_cancel",
    displayed: (state, item) => item.id === state.itemId && state.itemState === "edit",
    render: (state, dispatch) => {
        return <button onClick={dispatch.listeners.onEditItemCancel}>Annuler</button>
    }
}

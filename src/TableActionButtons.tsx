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
export const ACTION_EDIT_DELETE: TableAction = {
    name: "edit_delete",
    displayed: (state, item) => state.itemId === item.id && (state.itemState === "edit" || state.itemState === "delete_confirm"),
    render: (state, dispatch) => {
        return <ConfirmDeleteButton
            onDelete={dispatch.listeners.onDelete}
            confirm={state.itemState==="delete_confirm"}
            onDeleteCancel={dispatch.listeners.onDeleteCancel}
            onDeleteConfirm={dispatch.listeners.onDeleteConfirm}
            disabled={state.itemState==="delete_commit_pending"}
        />
    }
}
const ConfirmDeleteButton: React.FC<{
    onDelete: (evt: any) => void,
    onDeleteCancel: (evt:any) => void,
    onDeleteConfirm: (evt:any) => void,
    confirm: boolean,
    disabled: boolean
}> = ({ onDelete, onDeleteCancel, onDeleteConfirm, confirm }) => {
    return <>
        { !confirm && <button onClick={ onDeleteConfirm }>Supprimer</button> }
        { confirm && "Supprimer ? " }
        { confirm && <button onClick={ onDelete }>OK</button> }
        { confirm && <button onClick={ onDeleteCancel }>Annuler</button> }
    </>
}
export const ACTION_EDIT_CANCEL: TableAction = {
    name: "edit_cancel",
    displayed: (state, item) => item.id === state.itemId && state.itemState === "edit",
    render: (state, dispatch) => {
        return <button onClick={dispatch.listeners.onEditItemCancel}>Annuler</button>
    }
}

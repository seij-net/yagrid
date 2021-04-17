import { TableAction, TablePlugin } from "../../types";
import { Action, TableState } from "../../TableState";
import React, { Dispatch } from "react";

const PLUGIN_NAME = "editor_add"

export interface Config<T> {
    onAddTemplate: () => Promise<T>,
    onAddConfirm: (item: T) => Promise<void>,
}

export interface TableEditorAddPlugin<T> extends TablePlugin<T> {

}

export type PluginFactory<T = {}> = (config: Config<T>) => TableEditorAddPlugin<T>

export const ACTION_ADD: TableAction = {
    name: "add",
    displayed: (state, item) => true,
    render: (state, dispatch) => {
        return <button disabled={state.itemState!==undefined} onClick={dispatch.listeners.onAddItem}>Ajouter</button>
    }
}
export const ACTION_ADD_OK: TableAction = {
    name:"add_ok",
    displayed: (state, item) => state.itemId === item.id && state.itemState === "add",
    render: (state, dispatch) => {
        return <button onClick={ dispatch.listeners.onAddItemConfirm}>Ajouter</button>
    }
}
export const ACTION_ADD_CANCEL: TableAction = {
    name:"add_cancel",
    displayed: (state, item) => state.itemId === item.id && state.itemState === "add",
    render: (state, dispatch) => {
        return <button onClick={ dispatch.listeners.onAddItemCancel}>Annuler</button>
    }
}

export function editorAdd<T>(config: Config<T>): TableEditorAddPlugin<T> {
    const { onAddTemplate, onAddConfirm } = config

    return {
        name: PLUGIN_NAME,
        reducer: (s,a) => s,
        actionGenericList: [ACTION_ADD],
        actionItemList: [ACTION_ADD_OK, ACTION_ADD_CANCEL],
        actionGenericListeners: (editState: TableState, dispatch: Dispatch<Action>): { [p: string]: () => Promise<void> } => {
            return {
                onAddItem: async () => {
                    try {
                        const itemTemplate = await onAddTemplate()
                        dispatch({ type: "add", item: itemTemplate })
                    } catch (error) {
                        console.error("Problem while creating template item", error)
                    }
                },
            }
        },
        actionItemListeners: (editState: TableState, dispatch: Dispatch<Action>, item: T): { [p: string]: () => Promise<void> } => {
            return {
                onAddItemConfirm: async () => {
                    try {
                        dispatch({ type: "add_commit_started" })
                        await onAddConfirm(editState.itemValue)
                        dispatch({ type: "add_commit_succeded" })
                    } catch (error) {
                        dispatch({ type: "add_commit_failed", error: error })
                    }
                },
                onAddItemCancel: async () => {
                    dispatch({ type: "add_cancel" })
                }
            }
        },
        dataListTransform: (editState, data) => {
            const newList = [] as T[]
            if (editState.itemState === "add" || editState.itemState === "add_commit_pending") {
                newList.push(editState.itemValue)
            }
            if (data) {
                newList.push(...data)
            }
            return newList
        }
    }
}

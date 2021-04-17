import { TableActionDispatch } from "./types";
import { Action, TableState } from "./TableState";
import { Dispatch } from "react";


export function createTableActionItemDispatch<T>(
    editState: TableState,
    dispatch: Dispatch<Action>,
    item: T,
    onEdit: (nextItem: T) => Promise<void>,
    onDelete: (nextItem: T) => Promise<void>
): TableActionDispatch {
    const handleAction: TableActionDispatch = {
        listeners: {

            onEditItem: (evt) => {
                dispatch({ type: "edit", item: item })
            },
            onEditItemCancel: (evt) => {
                dispatch({ type: "edit_cancel" })
            },
            onEditItemCommit: async (evt) => {
                try {
                    dispatch({ type: "edit_commit_started" })
                    await onEdit(editState.itemValue)
                    dispatch({ type: "edit_commit_succeded" })
                } catch (error) {
                    dispatch({ type: "edit_commit_failed", error: error })
                }
            },
            
        }
    }
    return handleAction
}

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

            
            
        }
    }
    return handleAction
}

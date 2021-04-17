import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual"

export type TableEditItemStateName =
    "edit"
    | "edit_commit_pending"
    | "delete_confirm"
    | "delete_commit_pending"
    | "add"
    | "add_commit_pending"

export interface TableEditState {
    /** Identifier of item under edition or undefined if not editing */
    itemId: string | undefined,
    /** State of edition */
    itemState: undefined | TableEditItemStateName
    /** Current value. Holds a temporary item value which is a copy of original item value, pending confirmation */
    itemValue: any | undefined,
    /** Column used as identifier */
    identifierProperty: string,
    /** Error if any */
    error: Error | undefined
}

export const createTableEditDefaultState = (identifierProperty: string): TableEditState => ({
    itemId: undefined,
    itemState: undefined,
    itemValue: undefined,
    identifierProperty: identifierProperty,
    error: undefined
})

export type Action =
    | { type: "item_change", item: any }
    | { type: "edit", item: any }
    | { type: "edit_cancel" }
    | { type: "edit_commit_started" }
    | { type: "edit_commit_succeded" }
    | { type: "edit_commit_failed", error: Error }
    | { type: "delete", item: any }
    | { type: "delete_cancel" }
    | { type: "delete_commit_started" }
    | { type: "delete_commit_succeded" }
    | { type: "delete_commit_failed", error: Error }
    | { type: "add", item: any }
    | { type: "add_cancel" }
    | { type: "add_commit_started" }
    | { type: "add_commit_succeded" }
    | { type: "add_commit_failed", error:Error }

function actionAdd(prevState:TableEditState, item:any):TableEditState {
    return {
        ...prevState,
        itemId: item[prevState.identifierProperty],
        itemState: "add",
        itemValue: cloneDeep(item)
    }
}

function actionEdit(prevState: TableEditState, item: any): TableEditState {
    return {
        ...prevState,
        itemId: item[prevState.identifierProperty],
        itemState: "edit",
        itemValue: cloneDeep(item)
    }
}

function actionDelete(prevState: TableEditState, item: any): TableEditState {
    return {
        ...prevState,
        itemId: item[prevState.identifierProperty],
        itemState: "delete_confirm",
        itemValue: cloneDeep(item)
    }
}

function actionDeleteCancel(prevState: TableEditState): TableEditState {
    return { ...prevState, itemState: "edit" }
}

function actionReset(prevState: TableEditState): TableEditState {
    return { ...prevState, itemId: undefined, itemState: undefined, itemValue: undefined }
}

function actionToState(prevState: TableEditState, stateName: TableEditItemStateName): TableEditState {
    return { ...prevState, itemState: stateName }
}

function actionItemChange(prevState: TableEditState, item: any): TableEditState {
    if (isEqual(item, prevState.itemValue)) return prevState
    return { ...prevState, itemValue: item }
}

function actionEditCommitFailed(prevState:TableEditState, error:Error): TableEditState {
    return { ...prevState, itemState:"edit", error:error }
}
function actionAddCommitFailed(prevState:TableEditState, error:Error): TableEditState {
    return { ...prevState, itemState:"add", error:error }
}
function actionDeleteCommitFailed(prevState:TableEditState, error:Error): TableEditState {
    return { ...prevState, itemState:"delete_confirm", error:error }
}

export const tableEditReducer = (prevState: TableEditState, action: Action): TableEditState => {
    let result: TableEditState;
    switch (action.type) {
        case "item_change":
            result = actionItemChange(prevState, action.item)
            break;
        case "edit":
            result = actionEdit(prevState, action.item);
            break;
        case "edit_cancel":
            result = actionReset(prevState);
            break;
        case "edit_commit_started":
            result = actionToState(prevState, "edit_commit_pending")
            break;
        case "edit_commit_succeded":
            result = actionReset(prevState);
            break;
        case "edit_commit_failed":
            result = actionEditCommitFailed(prevState, action.error);
            break;
        case "delete":
            result = actionDelete(prevState, action.item)
            break;
        case "delete_cancel":
            result = actionDeleteCancel(prevState)
            break;
        case "delete_commit_started":
            result = actionToState(prevState, "delete_commit_pending")
            break;
        case "delete_commit_succeded":
            result = actionReset(prevState)
            break;
        case "delete_commit_failed":
            result = actionDeleteCommitFailed(prevState, action.error)
            break;
        case "add":
            result = actionAdd(prevState, action.item);
            break;
        case "add_cancel":
            result = actionReset(prevState);
            break;
        case "add_commit_started":
            result = actionToState(prevState, "edit_commit_pending")
            break;
        case "add_commit_failed":
            result = actionAddCommitFailed(prevState, action.error)
            break;
        case "add_commit_succeded":
            result = actionReset(prevState);
            break;
        default:
            result = prevState
            break;
    }
    console.log("action", action, "prevState", prevState, "result", result)
    return result
}

import React from "react"
import { cloneDeep } from "lodash-es";
import { TableAction } from ".";

import { actionReset, actionToState, TableState, TableStateReducer } from "./TableState";
import { TablePlugin } from "./types";

function actionDeleteCommitFailed(
  prevState: TableState,
  error: Error
): TableState {
  return { ...prevState, itemState: "delete_confirm", error: error };
}

function actionDeleteCancel(prevState: TableState): TableState {
  return { ...prevState, itemState: "edit" };
}

function actionDelete(prevState: TableState, item: any): TableState {
  return {
    ...prevState,
    itemId: item[prevState.identifierProperty],
    itemState: "delete_confirm",
    itemValue: cloneDeep(item),
  };
}

export const reducer: TableStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "delete":
      result = actionDelete(prevState, action.item);
      break;
    case "delete_cancel":
      result = actionDeleteCancel(prevState);
      break;
    case "delete_commit_started":
      result = actionToState(prevState, "delete_commit_pending");
      break;
    case "delete_commit_succeded":
      result = actionReset(prevState);
      break;
    case "delete_commit_failed":
      result = actionDeleteCommitFailed(prevState, action.error);
      break;
    default:
      result = prevState;
  }
  return result;
};

export const deletePlugin = (): TablePlugin<any> => {
  return {
    name: "edit_delete",
    reducer: reducer,
    dataListTransform: (editState, data) => data,
    actionGenericList: [],
    actionGenericListeners: (e, d) => ({}),
    actionItemList: [],
    actionItemListeners: (e, d, i) => ({}),
  };
};

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
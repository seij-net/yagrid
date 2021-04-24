import { cloneDeep, isEqual, isNil } from "lodash-es";
import React, { ReactNode } from "react";
import { useGrid } from "../../GridContext";

import { actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer, TableAction } from "../../types";

const PLUGIN_NAME = "edit_inline";

function actionEdit(prevState: GridState, item: any): GridState {
  return {
    ...prevState,
    editedItemId: item[prevState.identifierProperty],
    editedItemState: "edit",
    editedItemValue: cloneDeep(item),
  };
}

function actionEditCommitFailed(prevState: GridState, error: Error): GridState {
  return { ...prevState, editedItemState: "edit", error: error };
}

export const tableEditReducer: GridStateReducer = (prevState, action): GridState => {
  let result: GridState;
  switch (action.type) {
    case "edit":
      result = actionEdit(prevState, action.item);
      break;
    case "edit_cancel":
      result = actionReset(prevState);
      break;
    case "edit_commit_started":
      result = actionToState(prevState, "edit_commit_pending");
      break;
    case "edit_commit_succeded":
      result = actionReset(prevState);
      break;
    case "edit_commit_failed":
      result = actionEditCommitFailed(prevState, action.error);
      break;
    default:
      result = prevState;
      break;
  }
  return result;
};
export interface Config<T> {
  /**
   * Called when an item is successfully edited and need to be saved
   */
  onEdit: (nextItem: T) => Promise<void>;
  /**
   * Tells if an item is editable
   */
  editable?: (item: T) => boolean;
  /**
   * Label for edit button, when using default buttons
   */
  labelEditButton?: ReactNode;
  /**
   * Label for edit confirm button, when using default buttons
   */
  labelEditButtonConfirm?: ReactNode;
  /**
   * Label for edit cancel button, when using default buttons
   */
  labelEditButtonCancel?: ReactNode;
}

const ActionEditButton: React.FC<Pick<Config<any>, "labelEditButton"> & { item: any }> = ({
  labelEditButton,
  item,
}) => {
  const { state, dispatch } = useGrid();
  const onEditItem = async () => {
    dispatch({ type: "edit", item: item });
  };
  return <button onClick={onEditItem}>{labelEditButton}</button>;
};

const ActionEditOKButton: React.FC<Pick<Config<any>, "labelEditButtonConfirm" | "onEdit"> & { item: any }> = ({
  labelEditButtonConfirm,
  item,
  onEdit,
}) => {
  const { state, dispatch } = useGrid();
  const onEditItemCommit = async () => {
    try {
      dispatch({ type: "edit_commit_started" });
      await onEdit(state.editedItemValue);
      dispatch({ type: "edit_commit_succeded" });
    } catch (error) {
      dispatch({ type: "edit_commit_failed", error: error });
    }
  };
  return <button onClick={onEditItemCommit}>{labelEditButtonConfirm}</button>;
};

const ActionEditCancelButton: React.FC<Pick<Config<any>, "labelEditButtonCancel"> & { item: any }> = ({
  labelEditButtonCancel,
  item,
}) => {
  const { state, dispatch } = useGrid();
  const onEditItemCancel = async () => {
    dispatch({ type: "edit_cancel" });
  };
  return <button onClick={onEditItemCancel}>{labelEditButtonCancel}</button>;
};

export function create<T>(config: Config<T>): GridPlugin<T> {
  const {
    onEdit,
    editable,
    labelEditButton = "📝",
    labelEditButtonConfirm = "✅",
    labelEditButtonCancel = "⬅️",
  } = config;
  const editableSafe = isNil(editable) ? () => true : editable;

  return {
    name: PLUGIN_NAME,
    reducer: tableEditReducer,
    isEditing: (state, item, property) =>
      (item as any)[state.identifierProperty] === state.editedItemId &&
      (state.editedItemState === "edit" || state.editedItemState === "edit_commit_pending"),
    actionItemList: [
      {
        name: "edit",
        displayed: (state, item) => editableSafe(item) && state.editedItemState === undefined,
        renderItem: (item, state, dispatch) => <ActionEditButton item={item} labelEditButton={labelEditButton} />,
      },
      {
        name: "edit_ok",
        displayed: (state, item) =>
          editableSafe(item) && state.editedItemId === item.id && state.editedItemState === "edit",
        renderItem: (item, state, dispatch) => (
          <ActionEditOKButton item={item} onEdit={onEdit} labelEditButtonConfirm={labelEditButtonConfirm} />
        ),
      },
      {
        name: "edit_cancel",
        displayed: (state, item) =>
          editableSafe(item) && item.id === state.editedItemId && state.editedItemState === "edit",
        renderItem: (item, state, dispatch) => (
          <ActionEditCancelButton item={item} labelEditButtonCancel={labelEditButtonCancel} />
        ),
      },
    ],
  };
}

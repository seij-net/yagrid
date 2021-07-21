import { cloneDeep } from "lodash-es";
import React, { ReactNode } from "react";
import { LoadingState, useGrid } from "../../GridContext";

import { actionErrorItem, actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer } from "../../types";

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

function actionAdd(prevState: GridState, item: any): GridState {
  const id = item[prevState.identifierProperty]
  const prevStateErrorReset = actionErrorItem(prevState, id, undefined)
  return {
    ...prevStateErrorReset,
    editedItemId: id,
    editedItemState: "add",
    editedItemValue: cloneDeep(item),
  };
}

function actionAddCommitFailed(prevState: GridState, error: Error): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, error)
  return { 
    ...prevStateErrorReset, 
    editedItemState: "add"
  };
}

function actionAddCancel(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(prevStateErrorReset)
}

function actionAddCommitSucceded(prevState:GridState):GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(prevStateErrorReset)
}

function actionAddCommitStarted(prevState:GridState):GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionToState(prevStateErrorReset, "edit_commit_pending")
}

export const reducer: GridStateReducer = (prevState, action) => {
  let result;
  switch (action.type) {
    case "add":
      result = actionAdd(prevState, action.item);
      break;
    case "add_cancel":
      result = actionAddCancel(prevState);
      break;
    case "add_commit_started":
      result = actionAddCommitStarted(prevState);
      break;
    case "add_commit_failed":
      result = actionAddCommitFailed(prevState, action.error);
      break;
    case "add_commit_succeded":
      result = actionAddCommitSucceded(prevState);
      break;

    default:
      result = prevState;
  }
  return result;
};

// -----------------------------------------------------------------------------
// Action helpers
// -----------------------------------------------------------------------------

/**
 * 
 * @returns tools for creation an Add button
 */
export function createItemAdd() {
  const { state, dispatch, loadingState, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>
  const handleClick = async () => {
    try {
      const itemTemplate = await plugin.onAddTemplate();
      dispatch({ type: "add", item: itemTemplate });
    } catch (error) {
      console.error("Problem while creating template item", error);
    }
  };
  const disabled = loadingState !== LoadingState.loaded || state.editedItemState !== undefined;
  const buttonProps = { disabled, onClick: handleClick }
  return { buttonProps, config: plugin}
}

export function createItemAddConfirm() {
  const { state, dispatch, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>
  const handleClick = async () => {
    try {
      dispatch({ type: "add_commit_started" });
      await plugin.onAddConfirm(state.editedItemValue);
      dispatch({ type: "add_commit_succeded" });
    } catch (error) {
      dispatch({ type: "add_commit_failed", error: error });
    }
  };
  return {buttonProps: { onClick: handleClick}, config: plugin }
}

export function createItemAddCancel() {
  const { state, dispatch, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>
  const onAddItemCancel = async () => {
    dispatch({ type: "add_cancel" });
  };
  return { buttonProps: { onClick: onAddItemCancel }, config: plugin}
}

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

export const PLUGIN_NAME = "edit_add";

export interface Config<T> {
  /**
   * Called when we need to add a new item, provides an empty item template.
   */
  onAddTemplate: () => Promise<T>;
  /**
   * Called when process of editing is done and we need to save the newly
   * edited item.
   */
  onAddConfirm: (item: T) => Promise<void>;
  /**
   * Label for add button, when using default buttons
   */
  labelAddButton?: ReactNode;
  /**
   * Label for add confirm button, when using default buttons
   */
  labelAddButtonConfirm?: ReactNode;
  /**
   * Label for add cancel button, when using default buttons
   */
  labelAddButtonCancel?: ReactNode;
}

export interface TableEditorAddPlugin<T> extends GridPlugin<T> {}

export type PluginFactory<T = {}> = (config: Config<T>) => TableEditorAddPlugin<T>;

const ActionAdd: React.FC<{}> = () => {
  const {buttonProps, config} = createItemAdd()
  return (
    <button {...buttonProps}>{config.labelAddButton}</button>
  );
};

const ActionAddOk: React.FC<Pick<Config<any>, "labelAddButtonConfirm" | "onAddConfirm">> = () => {
  const { buttonProps, config} = createItemAddConfirm()
  return <button {...buttonProps}>{config.labelAddButtonConfirm}</button>;
};

const ActionAddCancel: React.FC<Pick<Config<any>, "labelAddButtonCancel">> = ({ labelAddButtonCancel }) => {
  const { buttonProps, config} = createItemAddCancel()
  return <button {...buttonProps}>{config.labelAddButtonCancel}</button>;
};

const DEFAULT_CONFIG: Partial<Config<any>> = {
    labelAddButton : "➕",
    labelAddButtonConfirm : "➕",
    labelAddButtonCancel : "⬅️",
}

export function create<T>(config: Config<T>): TableEditorAddPlugin<T> {

  const fullConfig =  {...DEFAULT_CONFIG, ...config}

  const {
    onAddConfirm,
    labelAddButtonConfirm = "➕",
    labelAddButtonCancel = "⬅️",
  } = fullConfig

  return {
    name: PLUGIN_NAME,
    config: fullConfig,
    reducer: reducer,
    actionGenericList: [
      {
        name: "add",
        render: () => <ActionAdd />,
      },
    ],
    actionItemList: [
      {
        name: "add_ok",
        displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
        renderItem: (item) => <ActionAddOk onAddConfirm={onAddConfirm} labelAddButtonConfirm={labelAddButtonConfirm} />,
      },
      {
        name: "add_cancel",
        displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
        renderItem: (item) => <ActionAddCancel labelAddButtonCancel={labelAddButtonCancel} />,
      },
    ],
    isEditing: (state, item, itemPropertyName) =>
      (item as any)[state.identifierProperty] === state.editedItemId &&
      (state.editedItemState === "add" || state.editedItemState === "add_commit_pending"),
    dataListTransform: (editState, data) => {
      const newList = [] as T[];
      if (editState.editedItemState === "add" || editState.editedItemState === "add_commit_pending") {
        newList.push(editState.editedItemValue);
      }
      if (data) {
        newList.push(...data);
      }
      return newList;
    },
  };
}

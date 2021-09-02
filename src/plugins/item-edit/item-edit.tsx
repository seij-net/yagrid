import { cloneDeep, isNil } from "lodash-es";
import React from "react";
import { useGrid } from "../../GridContext";
import { actionErrorItem, actionReset, actionToState } from "../../TableState";
import { GridPlugin, GridState, GridStateReducer } from "../../types";
import { Config, PLUGIN_NAME, UI_ACTION_EDIT, UI_ACTION_EDIT_CANCEL, UI_ACTION_EDIT_CONFIRM } from "./item-edit-config";

export function getPluginConfig<T = any>(): Config<T> {
  const { getPlugin } = useGrid()
  const plugin = getPlugin(PLUGIN_NAME);
  return plugin.config
}

function actionEdit(prevState: GridState, item: any): GridState {
  const id = item[prevState.identifierProperty]
  const prevStateErrorReset = actionErrorItem(prevState, id, undefined)
  return {
    ...prevStateErrorReset,
    editedItemId: id,
    editedItemState: "edit",
    editedItemValue: cloneDeep(item),
  };
}

function actionEditCommitFailed(prevState: GridState, error: Error): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, error)
  return {
    ...prevStateErrorReset,
    editedItemState: "edit"
  };
}

function actionEditCancel(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(prevStateErrorReset)
}

function actionEditCommitSucceded(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionReset(prevStateErrorReset)
}

function actionEditCommitStarted(prevState: GridState): GridState {
  const prevStateErrorReset = actionErrorItem(prevState, prevState.editedItemId, undefined)
  return actionToState(prevStateErrorReset, "edit_commit_pending")
}

export const tableEditReducer: GridStateReducer = (prevState, action): GridState => {
  let result: GridState;
  switch (action.type) {
    case "edit":
      result = actionEdit(prevState, action.item);
      break;
    case "edit_cancel":
      result = actionEditCancel(prevState);
      break;
    case "edit_commit_started":
      result = actionEditCommitStarted(prevState);
      break;
    case "edit_commit_succeded":
      result = actionEditCommitSucceded(prevState);
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




const ActionEditButton: React.FC<Pick<Config<any>, "labelEditButton"> & { item: any }> = ({
  item,
}) => {
  const pluginConfig = getPluginConfig();
  const buttonProps = createUIActionPropsEdit(item);
  return <button {...buttonProps}>{pluginConfig.labelEditButton}</button>;
};

const ActionEditOKButton: React.FC<Pick<Config<any>, "labelEditButtonConfirm" | "onEdit"> & { item: any }> = ({
  item,
}) => {
  const buttonProps = createUIActionPropsEditConfirm(item);
  const pluginConfig = getPluginConfig();
  return <button {...buttonProps}>{pluginConfig.labelEditButtonConfirm}</button>;
};

const ActionEditCancelButton: React.FC<Pick<Config<any>, "labelEditButtonCancel"> & { item: any }> = ({
  item,
}) => {
  const buttonProps = createUIActionPropsEditCancel(item);
  const pluginConfig = getPluginConfig();
  return <button {...buttonProps}>{pluginConfig.labelEditButtonCancel}</button>;
};

const CONFIG_DEFAULTS: Partial<Config<any>> = {
  labelEditButton: "📝",
  labelEditButtonConfirm: "✅",
  labelEditButtonCancel: "⬅️",
};


export function createUIActionPropsEditCancel<T>(item: T) {
  const { state, dispatch } = useGrid();
  const onEditItemCancel = async () => {
    dispatch({ type: "edit_cancel" });
  };
  const buttonProps = { onClick: onEditItemCancel };
  return buttonProps;
}

export function createUIActionPropsEditConfirm<T>(item: T) {
  const { state, dispatch } = useGrid();
  const config = getPluginConfig()
  const onEditItemCommit = async () => {
    try {
      dispatch({ type: "edit_commit_started" });
      await config.onEdit(state.editedItemValue);
      dispatch({ type: "edit_commit_succeded" });
    } catch (error) {
      dispatch({ type: "edit_commit_failed", error: error });
    }
  };
  const buttonProps = { onClick: onEditItemCommit };
  return buttonProps;
}

export function createUIActionPropsEdit(item: any) {
  const { state, dispatch } = useGrid();
  const onEditItem = async () => {
    dispatch({ type: "edit", item: item });
  };
  const buttonProps = { onClick: onEditItem };
  return buttonProps;
}

export function create<T>(config: Config<T>): GridPlugin<T> {
  const configWithDefaults = { ...CONFIG_DEFAULTS, ...config };
  const {
    onEdit,
    editable,
    labelEditButton = "📝",
    labelEditButtonConfirm = "✅",
    labelEditButtonCancel = "⬅️",
  } = configWithDefaults;
  const editableSafe = isNil(editable) ? () => true : editable;


  return {
    name: PLUGIN_NAME,
    config: configWithDefaults,
    reducer: tableEditReducer,
    isEditing: (state, item, property) =>
      (item as any)[state.identifierProperty] === state.editedItemId &&
      (state.editedItemState === "edit" || state.editedItemState === "edit_commit_pending"),
    actionItemList: [
      {
        name: UI_ACTION_EDIT,
        displayed: (state, item) => editableSafe(item) && state.editedItemState === undefined,
        renderItem: (item) => <ActionEditButton item={item} labelEditButton={labelEditButton} />,
      },
      {
        name: UI_ACTION_EDIT_CONFIRM,
        displayed: (state, item) =>
          editableSafe(item) && state.editedItemId === item.id && state.editedItemState === "edit",
        renderItem: (item) => (
          <ActionEditOKButton item={item} onEdit={onEdit} labelEditButtonConfirm={labelEditButtonConfirm} />
        ),
      },
      {
        name: UI_ACTION_EDIT_CANCEL,
        displayed: (state, item) =>
          editableSafe(item) && item.id === state.editedItemId && state.editedItemState === "edit",
        renderItem: (item) => <ActionEditCancelButton item={item} labelEditButtonCancel={labelEditButtonCancel} />,
      },
    ],
  };
}

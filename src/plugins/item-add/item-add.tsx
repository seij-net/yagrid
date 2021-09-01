import React from "react";
import { GridPlugin } from "../../types";
import { ActionAdd, ActionAddCancel, ActionAddOk } from "./item-add-buttons";
import { reducer } from "./item-add-reducer";
import { Config, PLUGIN_NAME, UI_ACTION_ADD, UI_ACTION_ADD_CANCEL, UI_ACTION_ADD_CONFIRM } from "./item-add-config";



export interface TableEditorAddPlugin<T> extends GridPlugin<T> {
}

export type PluginFactory<T = {}> = (config: Config<T>) => TableEditorAddPlugin<T>;


const DEFAULT_CONFIG: Partial<Config<any>> = {
  labelAddButton: "➕",
  labelAddButtonConfirm: "➕",
  labelAddButtonCancel: "⬅️"
};

export function create<T>(config: Config<T>): TableEditorAddPlugin<T> {

  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    name: PLUGIN_NAME,
    config: fullConfig,
    reducer: reducer,
    actionGenericList: [
      {
        name: UI_ACTION_ADD,
        render: ActionAdd
      }
    ],
    actionItemList: [
      {
        name: UI_ACTION_ADD_CONFIRM,
        displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
        renderItem: (item) => <ActionAddOk />
      },
      {
        name: UI_ACTION_ADD_CANCEL,
        displayed: (state, item) => state.editedItemId === item.id && state.editedItemState === "add",
        renderItem: (item) => <ActionAddCancel />
      }
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
    }
  };
}

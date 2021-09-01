import { ReactNode } from "react";

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

export const UI_ACTION_ADD = "add"
export const UI_ACTION_ADD_CONFIRM = "add_ok"
export const UI_ACTION_ADD_CANCEL = "add_cancel"
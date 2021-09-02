import { ReactNode } from "react";

export const PLUGIN_NAME = "edit_inline";


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

export const UI_ACTION_EDIT = "edit";
export const UI_ACTION_EDIT_CONFIRM = "edit_ok";
export const UI_ACTION_EDIT_CANCEL = "edit_cancel";
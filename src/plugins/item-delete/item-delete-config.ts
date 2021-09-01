import { ReactNode } from "react";

export const PLUGIN_NAME = "edit_delete";



/**
 * Configuration for delete plugin
 */
 export interface Config<T> {
  /**
   * Provide a callback for deleting specified item from the list
   */
  onDelete: (item: T) => Promise<void>;
  /**
   * Tells if item can be deleted or not. Defaults to true if not specified
   */
  deletable?: (item: T) => boolean;
  /**
   * When using default buttons, label or component for delete button
   */
  labelDeleteButton?: ReactNode;
  /**
   * When using default buttons, label or component for delete confirmation text
   */
  labelDeleteConfirm?: ReactNode;
  /**
   * When using default buttons, label or component for delete confirmation button
   */
  labelDeleteConfirmButton?: ReactNode;
  /**
   * When using default buttons, label or component for delete cancel button
   */
  labelDeleteCancelButton?: ReactNode;
}

/**
 * State types.
 *
 * Those are re-exported for plugin developers.
 */


/**
 * Built-in state names for currently active edited item.
 */
export type GridEditedItemStateName =
  | "edit"
  | "edit_commit_pending"
  | "delete_confirm"
  | "delete_commit_pending"
  | "add"
  | "add_commit_pending";


/**
 * Main state
 */
export interface GridState<T=any> {
  /** Identifier of item under edition or undefined if not editing */
  editedItemId: string | undefined;
  /** State of edition */
  editedItemState: undefined | GridEditedItemStateName;
  /** Current value. Holds a temporary item value which is a copy of original item value, pending confirmation */
  editedItemValue: T | undefined;
  /** Property used as identifier for items in data source */
  identifierProperty: string;
  /** Error if any. This error is global to all the table */
  error: Error | undefined;
  /** Items on error. This contains a list of item identifiers associated with errors */
  errorItems: Record<any,Error>
}

/**
 * Reducer to manipulate grid state
 */
export type GridStateReducer = (prevState: GridState, action: Action) => GridState;

/**
 * For the moment actions are declared here but we need to put them separated
 * in each plugin.
 *
 * Core shall provide only core actions. Each plugin shall enrich possible actions
 * and keep actions for themselves
 *
 * https://github.com/seij-net/yagrid/issues/21
 */
export type Action =
  | { type: "item_change"; item: any }
  | { type: "edit"; item: any }
  | { type: "edit_cancel" }
  | { type: "edit_commit_started" }
  | { type: "edit_commit_succeded" }
  | { type: "edit_commit_failed"; error: Error }
  | { type: "error"; error: Error | undefined }
  | { type: "error_item"; identifier: any; error: Error | undefined }
  | { type: "delete"; item: any }
  | { type: "delete_cancel" }
  | { type: "delete_commit_started" }
  | { type: "delete_commit_succeded" }
  | { type: "delete_commit_failed"; error: Error }
  | { type: "add"; item: any }
  | { type: "add_cancel" }
  | { type: "add_commit_started" }
  | { type: "add_commit_succeded" }
  | { type: "add_commit_failed"; error: Error };

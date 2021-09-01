import { ExtensionPoints, GridColumnDefinitionInternal, GridPlugin, GridState, UIAction } from ".";
import { TableTypesRegistry } from "../TableTypesRegistry";

/**
 * Main loading state
 */
export enum LoadingState {
  /** Loading state initialized but not started */
  init,
  /** Loading started, waiting  */
  pending,
  /** Loading finished, everything ok  */
  loaded,
}

/**
 * Main interface for manipulating the grid. 
 * 
 * This is what you get when you use useGrid()
 */
export interface GridContext<T> {
  /**
   * Loading state
   */
  loadingState: LoadingState;
  /**
   * Column definitions from initial configuration merged with defaults
   */
  columnDefinitions: GridColumnDefinitionInternal<T>[];
  /**
   * List of registered types
   */
  types: TableTypesRegistry;
  /**
   * List of extensions (extension points) filled by what all plugins
   * provided. 
   * 
   * For exemple, you get the list of all possibles actions registered by
   * each plugin here
   */
  extensions: ExtensionPoints<T>;
  /**
   * Function to get the plugin definition and specifics based on the plugin 
   * name. For example 
   * 
   * ```
   * const { getPlugin } = useGrid()
   * const config = getPlugin(ItemAdd.PLUGIN_NAME) as ItemAdd.Config
   * ```
   */
  getPlugin: (name: string) => GridPlugin<T>;
  /**
   * The name of the property used to get an identifier for each item of 
   * the list. 
   * For example if you have an item structured like {"code":10, "label":"My Product"} 
   * and each product is identified by "code", you can do 
   * 
   * ```
   * const { identifierProperty } = useGrid()
   * // ...
   * item[identifierProperty] == 10
   * // instead of 
   * item[code] == 10
   * 
   * ```
   * 
   */
  identifierProperty: string;
  /**
   * State of the grid
   */
  state: GridState;
  /**
   * allow sending commands directly to the grid
   */
  dispatch: React.Dispatch<any>;
  /**
   * Called when an item changed
   */
  handleEditItemChange: (nextItem: T) => void;
  /** 
   * Data resolved before plugins transform it
   **/
  resolvedData: T[];
  /** 
   * Data transformed by plugins, this is the data to display 
   **/
  dataListTransform: T[];
  /** 
   * Sets a global error on the table. This will be stored in the state as error
   * @param error error to set or null/undefined to remove it
   **/
  setError: (error: Error | null | undefined) => void,
  /** 
   * Sets an error for a specified item. This will be stored in the state in errorItems
   * @param identifier item identifier
   * @param error error to set or null/undefined to remove it from the item
   **/
  setErrorItem: (identifier: any, error: Error | null | undefined) => void
  /**
   * Returns a React node that renders action button or widget that need to be displayed for an action
   * @param actionCode
   */
  UIAction: UIAction

}

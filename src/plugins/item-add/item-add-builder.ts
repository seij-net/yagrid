
// -----------------------------------------------------------------------------
// Action helpers
// -----------------------------------------------------------------------------

import { LoadingState, useGrid } from "../../GridContext";
import { Config, PLUGIN_NAME } from "./item-add-config";

/**
 *
 * @returns tools for creation an Add button
 */
export function createItemAdd() {
  const { state, dispatch, loadingState, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>;
  const handleClick = async () => {
    try {
      const itemTemplate = await plugin.onAddTemplate();
      dispatch({ type: "add", item: itemTemplate });
    } catch (error) {
      console.error("Problem while creating template item", error);
    }
  };
  const disabled = loadingState !== LoadingState.loaded || state.editedItemState !== undefined;
  const buttonProps = { disabled, onClick: handleClick };
  return { buttonProps, config: plugin };
}

export function createItemAddConfirm() {
  const { state, dispatch, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>;
  const handleClick = async () => {
    try {
      dispatch({ type: "add_commit_started" });
      await plugin.onAddConfirm(state.editedItemValue);
      dispatch({ type: "add_commit_succeded" });
    } catch (error) {
      dispatch({ type: "add_commit_failed", error: error });
    }
  };
  return { buttonProps: { onClick: handleClick }, config: plugin };
}

export function createItemAddCancel() {
  const { state, dispatch, getPlugin } = useGrid();
  const plugin = getPlugin(PLUGIN_NAME).config as Config<any>;
  const onAddItemCancel = async () => {
    dispatch({ type: "add_cancel" });
  };
  return { buttonProps: { onClick: onAddItemCancel }, config: plugin };
}
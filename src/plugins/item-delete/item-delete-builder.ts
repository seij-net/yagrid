import { useGrid } from "../../GridContext";
import { Config, PLUGIN_NAME } from "./item-delete-config";

export function getPluginConfig<T = any>(): Config<T> {
  const { getPlugin } = useGrid()
  const plugin = getPlugin(PLUGIN_NAME);
  return plugin.config
}

export function createUIActionPropsDelete<T>(item: T) {
  const { state, dispatch } = useGrid();
  const config = getPluginConfig()
  const handleOnDelete = async () => {
    dispatch({ type: "delete", item: item });
  };
  const onDeleteConfirm = async () => {
    try {
      dispatch({ type: "delete_commit_started" });
      console.log("state=", state)
      await config.onDelete(item);
      dispatch({ type: "delete_commit_succeded" });
    } catch (error) {
      dispatch({ type: "delete_commit_failed", error: error });
    }
  };
  const onDeleteCancel = async () => {
    dispatch({ type: "delete_cancel" });
  };
  const buttonProps = {
    onDelete: handleOnDelete,
    onDeleteCancel: onDeleteCancel,
    onDeleteConfirm: onDeleteConfirm,
    disabled: state.editedItemState === "delete_commit_pending",
  }
  return buttonProps
}
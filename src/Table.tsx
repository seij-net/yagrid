import clsx from "clsx";
import isNil from "lodash-es/isNil";
import React, { useReducer } from "react";

import { TableEmptyMessage } from "./TableEmptyMessage";
import { TableHeader } from "./TableHeader";
import { TableActionTrigger } from "./TableItemActions";
import { TableRow } from "./TableRow";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { TableTypesRegistryDefault } from "./TableTypesRegistry";
import { TableActionList, GridColumnDefinitionInternal, GridPlugin, GridPluginList, GridProps } from "./types";

const NOT_EDITABLE = (rowData: any) => false;
const DEFAULT_TABLE_CLASS = "data";
const DEFAULT_EMPTY_MESSAGE = "";

export const Table: React.FC<GridProps<any>> = ({
  columns: dataProperties,
  data,
  className,
  identifierProperty = "id",
  emptyMessage,
  editable,
  plugins = [],
  types,
}) => {
  const typesOrDefault = types || TableTypesRegistryDefault;
  const columnDefinitionsDefault: GridColumnDefinitionInternal<any>[] = dataProperties.map((it) => ({
    name: it.name,
    label: isNil(it.label) ? it.name : it.label,
    type: it.type ?? "string",
    render: typesOrDefault.find(it.type || "string").renderer,
    editable: it.editable || NOT_EDITABLE,
    editor: it.editor,
  }));

  const [columnDefinitions, setColumnDefinitions] = React.useState<GridColumnDefinitionInternal<any>[]>(
    columnDefinitionsDefault
  );
  const reducer = createReducer(plugins.map((it) => it.reducer).filter((it) => !isNil(it)));
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));

  const classNames = clsx(className, DEFAULT_TABLE_CLASS);
  const emptyMessageOrDefault = emptyMessage || DEFAULT_EMPTY_MESSAGE;
  const columnCount = columnDefinitions.length + (editable ? 1 : 0);

  let actionListeners = {};
  plugins.forEach((plugin) => {
    const pluginListeners = plugin.actionGenericListeners(editState, dispatchEditState);
    if (pluginListeners) {
      actionListeners = { ...actionListeners, ...pluginListeners };
    }
  });
  const actionGenericListAll: TableActionList = pluginCompose(plugins, (plugin) => plugin.actionGenericList);
  const actionGenericComponents = actionGenericListAll.map((it) => {
    return (
      <TableActionTrigger
        key={it.name}
        action={it}
        editingState={editState}
        dispatch={{ listeners: actionListeners }}
      />
    );
  });

  const handleEditItemChange = (newItem: any) => dispatchEditState({ type: "item_change", item: newItem });

  const dataListTransform = plugins.reduce((acc, current) => current.dataListTransform(editState, acc), data);

  const rows = dataListTransform.map((it) => {
    const id = it[identifierProperty];
    let actionListeners = {};
    plugins.forEach((plugin) => {
      const pluginListeners = plugin.actionItemListeners(editState, dispatchEditState, it);
      actionListeners = { ...actionListeners, ...pluginListeners };
    });
    
    const actionItemListAll = pluginCompose(plugins, (plugin) => plugin.actionItemList, []);

    return (
      <TableRow
        key={id}
        actionsItem={actionItemListAll}
        actionsItemDisplay={editable}
        editingState={editState}
        item={it}
        onActionItemDispatch={{ listeners: actionListeners }}
        onEditItemChange={handleEditItemChange}
        itemDefinitions={columnDefinitions}
        types={typesOrDefault}
      />
    );
  });

  return (
    <>
      {actionGenericComponents}
      <table className={classNames}>
        <TableHeader displayActions={editable} columnDefinitions={columnDefinitions} />
        <tbody>{rows}</tbody>
        <TableEmptyMessage size={rows.length} columnsSize={columnCount} emptyMessage={emptyMessageOrDefault} />
      </table>
    </>
  );
};

export const TableEdixit: React.FC<GridProps<any>> = (props) => <Table {...props} className="data" />;

function pluginCompose<T, R>(
  plugins: GridPluginList<T>,
  extract: (plugin: GridPlugin<T>) => R[],
  initial?: R[] | null
): R[] {
  const initialSafe = isNil(initial) ? ([] as R[]) : initial;
  return plugins.reduce((acc, current) => [...acc, ...extract(current)], initialSafe);
}

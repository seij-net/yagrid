import clsx from "clsx";
import isNil from "lodash-es/isNil";
import React, { useReducer } from "react";

import { TableHeader } from "./TableHeader";
import { TableActionTrigger } from "./TableItemActions";
import { TableRow } from "./TableRow";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { TableTypesRegistryDefault } from "./TableTypesRegistry";
import { GridColumnDefinitionInternal, GridPlugin, GridPluginList, GridProps, TableActionList } from "./types";

const NOT_EDITABLE = (rowData: any) => false;
const DEFAULT_TABLE_CLASS = "data";
const DEFAULT_EMPTY_MESSAGE = "";

export const Grid: React.FC<GridProps<any>> = ({
  columns: dataProperties,
  data = [],
  className,
  identifierProperty = "id",
  emptyMessage,
  plugins = [],
  types,
}) => {
  const typesOrDefault = types || TableTypesRegistryDefault;
  const columnDefinitionsDefault: GridColumnDefinitionInternal<any>[] = dataProperties.map((col) => ({
    name: col.name,
    label: isNil(col.label) ? col.name : col.label,
    type: col.type ?? "string",
    render: isNil(col.render) 
      // if no render is specified, use then render from type registry and bind it automatically with column name
      ? (item)=> typesOrDefault.find(col.type || "string").renderer(item[col.name]) 
      // if a render function is specified, use it
      : col.render,
    editable: col.editable || NOT_EDITABLE,
    editor: col.editor,
  }));

  const [columnDefinitions, setColumnDefinitions] = React.useState<GridColumnDefinitionInternal<any>[]>(
    columnDefinitionsDefault
  );
  const reducer = createReducer(plugins.map((it) => it.reducer).filter((it) => !isNil(it)));
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));

  const classNames = clsx(className, DEFAULT_TABLE_CLASS);
  const emptyMessageOrDefault = emptyMessage || DEFAULT_EMPTY_MESSAGE;

  const actionGenericListAll: TableActionList = pluginCompose(plugins, (plugin) => plugin.actionGenericList);
  const actionItemListAll: TableActionList = pluginCompose(plugins, (plugin) => plugin.actionItemList, []);

  const somePluginsProvideItemAction = actionItemListAll.length > 0;
  const somePluginsProvideGenericActions = actionGenericListAll.length > 0;
  const columnCount = columnDefinitions.length + (actionItemListAll.length > 0 ? 1 : 0);

  let actionListeners = {};
  plugins.forEach((plugin) => {
    const pluginListeners = plugin.actionGenericListeners && plugin.actionGenericListeners(editState, dispatchEditState);
    if (pluginListeners) {
      actionListeners = { ...actionListeners, ...pluginListeners };
    }
  });

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
      const pluginListeners = plugin.actionItemListeners && plugin.actionItemListeners(editState, dispatchEditState, it);
      actionListeners = { ...actionListeners, ...pluginListeners };
    });

    return (
      <TableRow
        key={id}
        actionsItem={actionItemListAll}
        actionsItemDisplay={somePluginsProvideItemAction}
        gridState={editState}
        item={it}
        onActionItemDispatch={{ listeners: actionListeners }}
        onEditItemChange={handleEditItemChange}
        itemDefinitions={columnDefinitions}
        types={typesOrDefault}
        plugins={plugins}
      />
    );
  });

  const footers = plugins
    .map((it) => {
      if (it.footer?.span) {
        return (
          <tr key={it.name}>
            <td colSpan={columnCount}>{it.footer.span(data)}</td>
          </tr>
        );
      }
      if (it.footer?.rows) {
        return it.footer?.rows(data, columnCount)
      }
    })
    .filter((it) => it);

  return (
    <>
      {actionGenericComponents}
      <table className={classNames}>
        <TableHeader displayActions={somePluginsProvideItemAction} columnDefinitions={columnDefinitions} />
        <tbody>{rows}</tbody>
        {footers && <tfoot>{footers}</tfoot>}
      </table>
    </>
  );
};

export const TableEdixit: React.FC<GridProps<any>> = (props) => <Grid {...props} className="data" />;

function pluginCompose<T, R>(
  plugins: GridPluginList<T>,
  extract: (plugin: GridPlugin<T>) => (R[]|undefined),
  initial?: R[] | null
): R[] {
  const initialSafe = isNil(initial) ? ([] as R[]) : initial;
  return plugins.reduce((acc, current) =>  {
    const c = extract(current)
    return isNil(c) ? acc : [...acc, ...c]
  }, initialSafe);
}

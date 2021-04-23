import clsx from "clsx";
import { isFunction, isNil } from "lodash-es";
import React, { useEffect, useReducer } from "react";

import { TableHeader } from "./TableHeader";
import { TableActionTrigger } from "./TableItemActions";
import { TableRow } from "./TableRow";
import { createReducer, createTableEditDefaultState } from "./TableState";
import { TableTypesRegistryDefault } from "./TableTypesRegistry";
import { GridColumnDefinitionInternal, GridProps } from "./types";
import { createExtensionPoints } from "./utils/pluginCompose";

const NOT_EDITABLE = (rowData: any) => false;

export const Grid: React.FC<GridProps<any>> = ({
  columns: dataProperties,
  data,
  className,
  identifierProperty = "id",
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
  

  const [resolvedData, setResolvedData] = React.useState([] as any[])
  useEffect(()=>{
    const isLazyDataSource = isFunction(data)
    if (!isLazyDataSource) {
      setResolvedData(data as any[])
    }
    
  },[data])

  const ext = createExtensionPoints(plugins)

  const reducer = createReducer(ext.reducer);
  const [editState, dispatchEditState] = useReducer(reducer, createTableEditDefaultState(identifierProperty));

  const classNames = clsx(className);
  

  const hasActionsStart = ext.actionItemList.some(action=>action.position==="start");
  const hasActionsEnd = ext.actionItemList.some(action=>action.position==="end" || action.position === undefined);
  const columnCount = columnDefinitions.length + (hasActionsStart ? 1:0) + (hasActionsEnd ? 1:0);

  let actionListeners = {};
  plugins.forEach((plugin) => {
    const pluginListeners = plugin.actionGenericListeners && plugin.actionGenericListeners(editState, dispatchEditState);
    if (pluginListeners) {
      actionListeners = { ...actionListeners, ...pluginListeners };
    }
  });

  const actionGenericComponents = ext.actionGenericList.map((it) => {
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

  


  const dataListTransform = ext.dataListTransform.reduce((acc, current) => current(editState, acc), resolvedData);

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
        actionsItem={ext.actionItemList}
        hasActionsStart={hasActionsStart}
        hasActionsEnd={hasActionsEnd}
        gridState={editState}
        item={it}
        extraItems={ext.extraItem}
        columnCount={columnCount}
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
            <td colSpan={columnCount}>{it.footer.span(resolvedData)}</td>
          </tr>
        );
      }
      if (it.footer?.rows) {
        return it.footer?.rows(resolvedData, columnCount)
      }
    })
    .filter((it) => it);

  return (
    <>
      {actionGenericComponents}
      <table className={classNames}>
        <TableHeader hasActionsStart={hasActionsStart} hasActionsEnd={hasActionsEnd} columnDefinitions={columnDefinitions} />
        <tbody>{rows}</tbody>
        {footers && <tfoot>{footers}</tfoot>}
      </table>
    </>
  );
};



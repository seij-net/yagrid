import isNil  from "lodash-es/isNil";
import React, { useReducer } from "react";
import clsx from "clsx";
import { TableActionList, TableColumnDefinitionInternal, TablePlugin, TablePluginList, TableProps } from "./types";
import { TableTypesRegistryDefault } from "./TableTypesRegistry";
import { TableActionTrigger } from "./TableItemActions";
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";
import { TableEmptyMessage } from "./TableEmptyMessage";
import { createTableEditDefaultState, tableEditReducer } from "./TableState";
import { createTableActionItemDispatch } from "./TableItemActionListeners";


const NOT_EDITABLE = (rowData: any) => false
const DEFAULT_TABLE_CLASS = "data"
const DEFAULT_EMPTY_MESSAGE = "Aucun élément à afficher"


export const Table: React.FC<TableProps<any>> = (
    {
        dataProperties,
        data,
        className,
        identifierProperty = "id",
        emptyMessage,
        editable,
        plugins = [],
        onEdit, onDelete,
        editableItem,
        actionItemList = [],
        types
    }) => {
    const typesOrDefault = types || TableTypesRegistryDefault
    const columnDefinitionsDefault: TableColumnDefinitionInternal<any>[] = dataProperties.map(it => ({
        name: it.name,
        label: isNil(it.label) ? it.name : it.label,
        type: it.type ?? "string",
        render: typesOrDefault.find(it.type || "string").renderer,
        editable: it.editable || NOT_EDITABLE,
        editor: it.editor
    }))


    const [ columnDefinitions, setColumnDefinitions ] = React.useState<TableColumnDefinitionInternal<any>[]>(columnDefinitionsDefault)
    const [ editState, dispatchEditState ] = useReducer(tableEditReducer, createTableEditDefaultState(identifierProperty))

    const classNames = clsx(className, DEFAULT_TABLE_CLASS)
    const emptyMessageOrDefault = emptyMessage || DEFAULT_EMPTY_MESSAGE
    const columnCount = columnDefinitions.length + (editable ? 1 : 0)

    let actionListeners = {}
    plugins.forEach(plugin => {
        const pluginListeners = plugin.actionGenericListeners(editState, dispatchEditState)
        if (pluginListeners) {
            actionListeners = { ...actionListeners, ...pluginListeners }
        }
    })
    const actionGenericListAll:TableActionList = pluginCompose(plugins, plugin => plugin.actionGenericList)
    const actionGenericComponents = actionGenericListAll.map(it => {
        return <TableActionTrigger key={ it.name } action={ it } editingState={ editState }
                                   dispatch={ { listeners: actionListeners } }/>
    })


    const handleEditItemChange = (newItem: any) => dispatchEditState({ type: "item_change", item: newItem })

    const dataListTransform = plugins.reduce((acc, current) => current.dataListTransform(editState, acc), data)

    const rows = (dataListTransform).map(it => {
        const id = it[identifierProperty]
        let actionListeners = {}
        plugins.forEach(plugin => {
            const pluginListeners = plugin.actionItemListeners(editState, dispatchEditState, it)
            actionListeners = { ...actionListeners, ...pluginListeners }
        })
        const actionItemDispatch = createTableActionItemDispatch(editState, dispatchEditState, it, onEdit, onDelete)
        actionListeners = { ...actionListeners, ...actionItemDispatch.listeners }

        const actionItemListAll = pluginCompose(plugins, plugin => plugin.actionItemList, actionItemList)

        return <TableRow key={ id } actionsItem={ actionItemListAll } actionsItemDisplay={ editable }
                         editingState={ editState }
                         item={ it }
                         onActionItemDispatch={ { listeners: actionListeners } }
                         onEditItemChange={ handleEditItemChange }
                         itemDefinitions={ columnDefinitions }
                         types={ typesOrDefault }
        />
    })

    return <>
        { actionGenericComponents }
        <table className={ classNames }>
            <TableHeader displayActions={ editable } columnDefinitions={ columnDefinitions }/>
            <tbody>{ rows }</tbody>
            <TableEmptyMessage size={ rows.length } columnsSize={ columnCount } emptyMessage={ emptyMessageOrDefault }/>
        </table>
    </>
}

export const TableEdixit: React.FC<TableProps<any>> = (props) => <Table { ...props } className="data"/>

function pluginCompose<T, R>(plugins: TablePluginList<T>, extract:(plugin:TablePlugin<T>)=>R[], initial?:R[]|null):R[] {
    const initialSafe = isNil(initial) ? [] as R[] : initial
    return plugins.reduce((acc, current) => [...acc, ...extract(current)], initialSafe)
}
import {
    ActionGenericHandler,
    ActionItemHandler,
    TableAction,
    TableActionHandler,
    TableActionList,
    GridColumnDefinition,
    GridProps,
} from "./types";
import {Table} from "./Table"
export * as EditInline from "./plugins/edit-inline"
export * as EditDelete from "./plugins/edit-delete"
export * as EditInlineAdd from "./plugins/edit-inline-add"

export {
    Table,
    GridProps as TableProps,
    GridColumnDefinition as TableColumnDefinition,
    TableActionList,
    TableAction,
    ActionItemHandler,
    ActionGenericHandler,
    TableActionHandler
}

import { Meta, Story } from "@storybook/react";
import { isNil, minBy } from "lodash-es";
import { deletePlugin } from "./plugins/edit-delete/edit-delete";
import React, { useState } from "react";

import { Table } from "./Table";
import { ACTION_EDIT, ACTION_EDIT_CANCEL, ACTION_EDIT_OK } from "./TableActionButtons";
import { editorAdd } from "./plugins/edit-inline-add/edit-inline-add";
import { TableColumnDefinition, TablePlugin, TableProps } from "./types";


export default {
    title: 'TableComponents/Table',
    component: Table,
} as Meta;

const TableEditable: React.FC<TableProps<any>> = (props) => {

    const [ data, setData ] = useState(props.data)

    const COLUMN_DEFINITIONS: TableColumnDefinition<SampleItem>[] = [
        { name: "label" },
        {
            name: "description",
            editor: (data, onValueChange) =>
                <input type="text" defaultValue={ data.description || "" }
                       onChange={ (evt) => onValueChange({
                           ...data,
                           description: evt.target.value
                       }) }/>
        },
        {
            name: "amount",
            label: "Montant entier",
            type: "monetaryAmountInt",
            editor: (data, onValueChange) =>
            <input type="number" defaultValue={ data.amount || "" }
                       onChange={ (evt) => onValueChange({
                           ...data,
                           amount: parseInt(evt.target.value)
                       }) }/>
            
              
        },
        {
            name: "cb",
            label: "Checkbox",
            type: "boolean",
            editor: (data, onValueChange) =>
                (isNil(data.cb) ? null :
                    <input type="checkbox" checked={ data.cb || false }
                           onChange={ () => onValueChange({ ...data, cb: !data }) }/>)
        }
    ]

    const handleDelete =  async (item:any) =>   setData(prevState => prevState.filter(it => it.id !== item.id))
    const handleEdit = async (item:any) => setData(prevState => prevState.map(it=>it.id === item.id ? item : it))
    const handleAdd = async () => {
        return {id:"___NEW___", description:"", cb: false, amount: 0, label: "Nouveau placement"} as SampleItem
    }
    const handleAddConfirm = async (item:any) => {
        setData(prevState => {
            let minIdItem = minBy(prevState, (it)=>parseInt(it.id));
            const newId = (minIdItem?.id ?? 0) - 1
            return [...prevState, {...item, id:newId}]
        })
    }
    const plugins: TablePlugin<SampleItem>[] = [
        editorAdd({
            onAddTemplate: handleAdd,
            onAddConfirm: handleAddConfirm
        }),
        deletePlugin(handleDelete)
    ]
    return <Table { ...props }
                  dataProperties={ COLUMN_DEFINITIONS }
                  data={ data }
                  plugins={plugins}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
    />
    // return <Table {...props} />
}


const Template: Story<TableProps<any>> = (args) => <TableEditable { ...args } />;


interface SampleItem {
    id: string,
    label: string,
    description: string | null,
    amount: number | null,
    cb: boolean | null
}

const sampledata: SampleItem[] = [
    { id: "1", label: "libellé 1", description: "description 1", amount: 123456, cb: true },
    { id: "2", label: "libellé 2", description: "description 2", amount: 978654, cb: false },
    { id: "3", label: "ligne presque vide", description: null, amount: null, cb: null }
]


export const Vide = Template.bind({});
Vide.args = {};

export const RempliEditable = Template.bind({});
RempliEditable.args = {
    editable: true,
    actionItemList: [ ACTION_EDIT, ACTION_EDIT_OK, ACTION_EDIT_CANCEL],
    data: sampledata
};

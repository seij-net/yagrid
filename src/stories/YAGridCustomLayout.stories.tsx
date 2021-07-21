import { Meta, Story } from "@storybook/react";
import { isNil, maxBy } from "lodash-es";
import React, { useState } from "react";
import {
  ExtensionPoints,
  GridProps,
  GridProvider,
  ItemAdd,
  ItemDelete,
  ItemEdit,
  useGrid,
  useGridItem,
  useGridItemProperty,
} from "..";
import { GridColumnDefinitionInternal } from "../types";
import { customTypes, YAGridPlayground } from "./YAGridPlayground";

export default {
  title: "Playground/YAGridPlayground/CustomLayout",
  component: YAGridPlayground
} as Meta;

enum LoadingState { init, pending, loaded, }

interface TodoListItem extends Record<string, any> {
  id: number;
  label: string;
  description: string | null;
}

const sampledata: TodoListItem[] = [
  { id: 1, label: "item 1", description: "description 1" },
  { id: 2, label: "item 2", description: "description 2" },
  { id: 3, label: "item 3 no description", description: null }
];

const nextId = (data: TodoListItem[]): number => {
  if (data.length == 0) return 1;
  let maxIdItem = maxBy(data, (it) => it.id);
  let maxId = isNil(maxIdItem) ? 1 : maxIdItem.id;
  return maxId + 1;
};

export const TodoList: Story<GridProps<TodoListItem>> = () => {
  const initialData = sampledata;
  const [data, setData] = useState(initialData as TodoListItem[]);
  const handleDelete = async (item: any) => setData((prevState) => prevState.filter((it) => it.id !== item.id));
  const handleEdit = async (item: any) => {
    let errors = []
    if (!item.label) errors.push("Title is required.")
    if (!item.description) errors.push("Description required.")
    if (errors.length > 0) {
      const message = errors.join(" ")
      throw new Error(message)
    } else {
      return setData(prevState => prevState.map((it) => (it.id === item.id ? item : it)));
    }
  };
  const handleAddTemplate = async () => {
    return { id: nextId(data), description: "" } as TodoListItem;
  };
  const handleAddConfirm = async (item: TodoListItem) => {
    let errors = []
    if (!item.label) errors.push("Title is required")
    if (!item.description) errors.push("Description required")
    if (errors.length > 0) {
      const message = errors.join(" ")
      throw new Error(message)
    } else {
      setData((prevState) => {
        return [...prevState, { ...item, id: nextId(prevState) }];
      });
    }
  };

  const gridProps: GridProps<TodoListItem> = {
    columns: [
      {
        name: "label",
        render: (item) => <div style={{ fontWeight: "bold" }}>{item.label}</div>,
        editor: (data, onValueChange) => (
          <input
            type="text"
            placeholder="title"
            style={{ width: "100%" }}
            defaultValue={data.label || ""}
            onChange={(evt) => onValueChange({ ...data, label: evt.target.value })}
          />
        )
      },
      {
        name: "description",
        render: (item) => <div style={{ whiteSpace: "pre-wrap" }}>{item.description}</div>,
        editor: (data, onValueChange) => (
          <textarea
            rows={4}
            style={{ width: "100%" }}
            placeholder="description..."
            defaultValue={data.description || ""}
            onChange={(evt) => onValueChange({ ...data, description: evt.target.value })}
          />
        )
      }
    ],
    data: data,
    types: customTypes,

    plugins: [
      ItemEdit.create({
        labelEditButton: "Edit",
        labelEditButtonCancel: "Cancel",
        labelEditButtonConfirm: "Confirm",
        onEdit: handleEdit,
        editable: (item) => !item.readonly
      }),
      ItemAdd.create({
        labelAddButton: "Add",
        labelAddButtonCancel: "Cancel",
        labelAddButtonConfirm: "Confirm",
        onAddTemplate: handleAddTemplate,
        onAddConfirm: handleAddConfirm,
      }),
      ItemDelete.create({
        labelDeleteButton: "Delete",
        labelDeleteConfirm: "Confirm delete",
        labelDeleteConfirmButton: "Yes",
        labelDeleteCancelButton: "No",
        onDelete: handleDelete,
        deletable: (item) => isNil(item.deletable) ? true : item.deletable
      }), {
        name: "error",
        config: {},
        extraItem: (item) => {
          const { state, identifierProperty } = useGrid()
          const error = state.errorItems[item[identifierProperty]]
          if (error) {
            return <div style={{ color: "red" }}>{error.message}</div>
          } else return null
        }
      }
    ]
  };
  return (
    <div>
      <h1 className="text-2xl">Todo List</h1>
      <p>Displays a simple todo list with a custom layout. Manages custom error management.</p>
      <p>&nbsp;</p>
      <Cards className="table-auto yagrid-table-playground" {...gridProps} />
    </div>
  );
};


const Cards: React.FC<GridProps<TodoListItem>> = (props) => {
  return (
    <GridProvider
      columns={props.columns}
      types={props.types}
      data={props.data}
      plugins={props.plugins}
      identifierProperty={props.identifierProperty}
    >
      <CardsLayout {...props} />
    </GridProvider>
  );
};

const CardsLayout: React.FC<GridProps<TodoListItem>> = (props) => {
  const gridContext = useGrid();
  const {
    loadingState,
    extensions,
    identifierProperty,
    dataListTransform,
    state,
    setError
  } = gridContext;

  return (
    <div>
      <button onClick={() => setError(new Error("This is an error"))}>Create error</button><button onClick={() => setError(null)}>Reset error</button>
      {extensions.actionGenericList.length > 0 && (
        <div style={{ border: "1px solid lightgrey", backgroundColor: "lightblue" }}>
          Toolbar : {" "}
          {extensions.actionGenericList.map((action) => (
            <action.render key={action.name} />
          ))}
        </div>
      )}
      <div style={{ backgroundColor: "lightgrey" }}>
        {loadingState !== LoadingState.loaded && <div>Loading...</div>}
        {state.error && <div style={{ color: "red" }}>{state.error.message}</div>}
        {loadingState === LoadingState.loaded && dataListTransform.map((item) => <Item key={item[identifierProperty]} item={item} />)}
      </div>
    </div>
  );

}

const Actions: React.FC<{ item: TodoListItem, position: string }> = ({ item, position }) => {
  const gridContext = useGrid()
  const { selectDisplayedItemActions } = useGridItem(item, gridContext);
  return <div key="__YAGRID_ACTIONS" >
    {selectDisplayedItemActions
      .filter((it) => it.position === position || it.position === undefined)
      .map((action) => (
        <span key={action.name}>{action.renderItem(item)}</span>
      ))}
  </div>
}

const Item: React.FC<{ item: TodoListItem }> = ({ item }) => {
  const gridContext = useGrid();
  const { extensions, columnDefinitions, state, handleEditItemChange } = gridContext
  const hasActionsStart = selectHasActionsStart(extensions);
  const hasActionsEnd = selectHasActionsEnd(extensions)
  const itemError = state.errorItems[item[state.identifierProperty]]
  return (

    <div style={{ border: "1px solid black", padding: "0.5em" }}>
      <div key="__yagrid_item" >
        {hasActionsStart && <Actions item={item} position="start" />}
        {columnDefinitions.map((def) => {
          const { editing } = useGridItemProperty(def.name, item, gridContext);
          return (
            <div key={def.name}>
              {editing && def.editor
                ? def.editor(state.editedItemValue, handleEditItemChange)
                : def.render(item)}
            </div>
          );
        })}
        { itemError ? <div key="__yagrid_item_error" style={{color:"red"}}>{itemError.message}</div> : "" }
        {hasActionsEnd && <Actions item={item} position="end" />}
      </div>
    </div>

  );
}

const selectHasActionsStart = (extensions: ExtensionPoints<any>) => extensions.actionItemList.some((action) => action.position === "start");
const selectHasActionsEnd = (extensions: ExtensionPoints<any>) => extensions.actionItemList.some(
  (action) => action.position === "end" || action.position === undefined
);
const selectColumnCount = (columnDefinitions: GridColumnDefinitionInternal<any>[], extensionPoints: ExtensionPoints<any>) => columnDefinitions.length + (selectHasActionsStart(extensionPoints) ? 1 : 0) + (selectHasActionsEnd(extensionPoints) ? 1 : 0);
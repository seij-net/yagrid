import { createReducer, TableState } from "../../TableState";
import { reducer as pluginDeleteReducer } from "./edit-delete";

describe("delete", () => {

  const createSampleState = (s: Partial<TableState>): TableState => {
    return {
      itemId: "1234",
      itemState: "edit",
      itemValue: { id: "1234" },
      identifierProperty: "id",
      error: undefined,
      ...s
    }
  }

  const reducer = createReducer([pluginDeleteReducer])

  it("given edit state when action delete then new state is delete_confirm", () => {
    const s = reducer(
      createSampleState({ itemState: "edit" }),
      { type: "delete", item: { id: "1234" } }
    )
    expect(s.itemState).toBe("delete_confirm")
  })
  it("given delete_confirm state when delete cancel then new state is edit", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_confirm" }),
      { type: "delete_cancel" }
    )
    expect(s.itemState).toBe("edit")
  })
  it("given delete_confirm state when delete commit started then new state delete_commit_pending ", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_confirm" }),
      { type: "delete_commit_started" }
    )
    expect(s.itemState).toBe("delete_commit_pending")
  })
  it("given delete_commit_pending state when delete commit success then new state is reset ", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_commit_pending" }),
      { type: "edit_commit_succeded" }
    )
    expect(s.itemState).toBeUndefined()
    expect(s.itemValue).toBeUndefined()
    expect(s.itemId).toBeUndefined()
  })
  it("given delete_commit_pending state when delete commit success then new state is reset ", () => {
    const expectedError = Error("failed")
    const s = reducer(
      createSampleState({ itemState: "delete_commit_pending" }),
      { type: "edit_commit_failed", error: expectedError }
    )
    expect(s.itemState).toBe("edit")
    expect(s.itemValue).toBeDefined()
    expect(s.itemId).toBeDefined()
    expect(s.error).toBe(expectedError)
  })

})
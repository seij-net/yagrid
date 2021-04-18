import { createReducer } from "../../TableState";
import { TableState } from "../../types";
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

  it("edit -> delete -> delete_confirm", () => {
    const s = reducer(
      createSampleState({ itemState: "edit" }),
      { type: "delete", item: { id: "1234" } }
    )
    expect(s.itemState).toBe("delete_confirm")
  })
  it("delete_confirm -> delete_cancel -> edit", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_confirm" }),
      { type: "delete_cancel" }
    )
    expect(s.itemState).toBe("edit")
  })
  it("delete_confirm -> delete_commit_started -> delete_commit_pending ", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_confirm" }),
      { type: "delete_commit_started" }
    )
    expect(s.itemState).toBe("delete_commit_pending")
  })
  it("delete_commit_pending -> delete_commit_succeded -> initial", () => {
    const s = reducer(
      createSampleState({ itemState: "delete_commit_pending" }),
      { type: "delete_commit_succeded" }
    )
    expect(s.itemState).toBeUndefined()
    expect(s.itemValue).toBeUndefined()
    expect(s.itemId).toBeUndefined()
  })
  it("delete_commit_pending -> edit_commit_failed -> edit ", () => {
    const expectedError = Error("failed")
    const s = reducer(
      createSampleState({ itemState: "delete_commit_pending" }),
      { type: "delete_commit_failed", error: expectedError }
    )
    expect(s.itemState).toBe("edit")
    expect(s.itemValue).toBeDefined()
    expect(s.itemId).toBeDefined()
    expect(s.error).toBe(expectedError)
  })

})
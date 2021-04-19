import { createReducer } from "../../TableState";
import { GridState } from "../../types";
import { reducer as pluginDeleteReducer } from "./item-delete";

describe("delete", () => {

  const createSampleState = (s: Partial<GridState>): GridState => {
    return {
      editedItemId: "1234",
      editedItemState: "edit",
      editedItemValue: { id: "1234" },
      identifierProperty: "id",
      error: undefined,
      ...s
    }
  }

  const reducer = createReducer([pluginDeleteReducer])

  it("edit -> delete -> delete_confirm", () => {
    const s = reducer(
      createSampleState({ editedItemState: "edit" }),
      { type: "delete", item: { id: "1234" } }
    )
    expect(s.editedItemState).toBe("delete_confirm")
  })
  it("delete_confirm -> delete_cancel -> reset", () => {
    const s = reducer(
      createSampleState({ editedItemState: undefined }),
      { type: "delete_cancel" }
    )
    expect(s.editedItemState).toBeUndefined()
    expect(s.editedItemValue).toBeUndefined()
    expect(s.editedItemId).toBeUndefined()
  })
  it("delete_confirm -> delete_commit_started -> delete_commit_pending ", () => {
    const s = reducer(
      createSampleState({ editedItemState: "delete_confirm" }),
      { type: "delete_commit_started" }
    )
    expect(s.editedItemState).toBe("delete_commit_pending")
  })
  it("delete_commit_pending -> delete_commit_succeded -> initial", () => {
    const s = reducer(
      createSampleState({ editedItemState: "delete_commit_pending" }),
      { type: "delete_commit_succeded" }
    )
    expect(s.editedItemState).toBeUndefined()
    expect(s.editedItemValue).toBeUndefined()
    expect(s.editedItemId).toBeUndefined()
  })
  it("delete_commit_pending -> edit_commit_failed -> undefined ", () => {
    const expectedError = Error("failed")
    const s = reducer(
      createSampleState({ editedItemState: "delete_commit_pending" }),
      { type: "delete_commit_failed", error: expectedError }
    )
    expect(s.editedItemState).toBeUndefined()
    expect(s.editedItemValue).toBeUndefined()
    expect(s.editedItemId).toBeUndefined()
    expect(s.error).toBe(expectedError)
  })

})
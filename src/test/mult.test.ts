import { mult } from "./mult"
describe("mult", ()=>{
    it("multiply", ()=>{
        expect(mult(10,2)).toBe(20)
    })
})
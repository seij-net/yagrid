import { DEFAULT_RENDERERS, TableTypesRegistryDefault } from "./TableTypesRegistry";

describe("TableTypesRegistryDefault", () => {
    it("is defined", () => expect(TableTypesRegistryDefault).toBeDefined())
    it("has all defaults renderers", () => {
        for (let key in DEFAULT_RENDERERS) {
            expect(TableTypesRegistryDefault.findOptional(key)).toBeDefined()
        }
    })
    const testData = (type: string, data: any, expected: string) => ({ type, data, expected })
    const testDataSet = [
        testData("string", "mastring", "mastring"),
        testData("string", undefined, ""),
        testData("string", null, ""),
        testData("boolean", true, "true"),
        testData("boolean", undefined, ""),
        testData("boolean", null, ""),
        testData("int", 1_000_000, "1 000 000"),
        testData("int", undefined, ""),
        testData("int", null, ""),
        testData("decimal", 1_000_000, "1 000 000,00"),
        testData("decimal", 1_000_000.23456, "1 000 000,23"),
        testData("decimal", undefined, ""),
        testData("decimal", null, ""),
        testData("monetaryAmountDecimal", 1_000_000, "1 000 000,00 €"),
        testData("monetaryAmountDecimal", 1_000_000.23456, "1 000 000,23 €"),
        testData("monetaryAmountDecimal", 0.0, "0,00 €"),
        testData("monetaryAmountDecimal", 0.1, "0,10 €"),
        testData("monetaryAmountDecimal", undefined, ""),
        testData("monetaryAmountDecimal", null, ""),
        testData("monetaryAmountInt", 1_000_000, "1 000 000 €"),
        testData("monetaryAmountInt", 0, "0 €"),
        testData("monetaryAmountInt", undefined, ""),
        testData("monetaryAmountInt", null, ""),
        testData("percent", 0.25, "25,00 %"),
        testData("percent", 0.251, "25,10 %"),
        testData("percent", 0.251256, "25,13 %"),
        testData("percent", undefined, ""),
        testData("percent", null, ""),
    ]
    for (let item of testDataSet) {
        it("formats " + item.type + " " + item.data, () => expect(TableTypesRegistryDefault.find(item.type).renderer(item.data)).toBe(item.expected))
    }


})

import {
  DEFAULT_RENDERERS,
  renderToReactElement,
  TableTypesRegistryDefault,
  TypesRegistryBuilder
} from "./TableTypesRegistry";

const testData = (type: string, data: any, expected: string) => ({ type, data, expected });
describe("TableTypesRegistryDefault", () => {
  it("is defined", () => expect(TableTypesRegistryDefault).toBeDefined());
  it("has all defaults renderers", () => {
    for (let key in DEFAULT_RENDERERS) {
      expect(TableTypesRegistryDefault.findOptional(key)).toBeDefined();
    }
  });

  const testDataSet = [
    testData("string", "mastring", "mastring"),
    testData("string", undefined, ""),
    testData("string", null, ""),
    testData("boolean", true, "true"),
    testData("boolean", undefined, ""),
    testData("boolean", null, ""),
    testData("int", 1_000_000, "1000000"),
    testData("int", undefined, ""),
    testData("int", null, ""),
    testData("decimal", 1_000_000.23456, "1000000.23456"),
    testData("decimal", undefined, ""),
    testData("decimal", null, ""),
    testData("percent", 0.25, "0.25"),
    testData("percent", undefined, ""),
    testData("percent", null, "")
  ];
  for (let item of testDataSet) {
    it("formats " + item.type + " " + item.data + " -> " + item.expected, () => expect(TableTypesRegistryDefault.find(item.type).renderer(item.data)).toBe(item.expected));
  }


});

describe("TableTypesRegistryCustom", () => {

  const custom = new TypesRegistryBuilder()
    .add("monetaryAmountInt", renderToReactElement((data: any) => "" + data + "€"))
    .add("monetaryAmountDecimal", renderToReactElement((data: any) => "" + data + "€decimal"))
    .build();

  const testDataSet = [
    testData("string", "mastring", "mastring"),
    testData("boolean", true, "true"),
    testData("int", 1_000_000, "1000000"),
    testData("decimal", 1_000_000, "1000000"),
    testData("decimal", 1_000_000.23456, "1000000.23456"),
    testData("decimal", undefined, ""),
    testData("decimal", null, ""),
    testData("monetaryAmountDecimal", 1_000_000, "1000000€decimal"),
    testData("monetaryAmountDecimal", undefined, ""),
    testData("monetaryAmountDecimal", null, ""),
    testData("monetaryAmountInt", 1_000_000, "1000000€")
  ];
  for (let item of testDataSet) {
    it("formats " + item.type + " " + item.data + " -> " + item.expected, () => expect(custom.find(item.type).renderer(item.data)).toBe(item.expected));
  }

});

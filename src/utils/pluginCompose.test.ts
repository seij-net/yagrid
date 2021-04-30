import { createExtensionPoints, pluginCompose } from "./pluginCompose";

describe("plugin compose", () => {
  test("given nothing returns empty", () => {
    const ep = pluginCompose([{ name: "a", config: {} }, { name: "b", config: {} }], (p) => p.dataListTransform);
    expect(ep).toHaveLength(0);
  });
  test("given things returns not empty items", () => {
    const ep = pluginCompose([
      { name: "a", config: {}, dataListTransform: (e, d) => d },
      { name: "b", config: {} },
      { name: "c", config: {}, dataListTransform: (e, d) => d },
      { name: "d", config: {}, dataListTransform: (e, d) => d }
    ], (p) => p.dataListTransform);
    expect(ep).toHaveLength(3);
  });
});

describe("extension points", () => {
  test("cumulates reducers", () => {
    const ep = createExtensionPoints([
      { name: "a", config: {}, reducer: (s) => s },
      { name: "b", config: {}, reducer: (s) => s, dataListTransform: (s, d) => d },
      { name: "c", config: {}, dataListTransform: (s, d) => d },
      { name: "d", config: {}, dataListTransform: (s, d) => d }
    ]);
    expect(ep.reducer).toHaveLength(2);
    expect(ep.dataListTransform).toHaveLength(3);
  });
});
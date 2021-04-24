import { createExtensionPoints, pluginCompose } from "./pluginCompose";

describe("plugin compose", () => {
  test("given nothing returns empty", () => {
    const ep = pluginCompose([{ name: "a" }, { name: "b" }], (p) => p.dataListTransform);
    expect(ep).toHaveLength(0);
  });
  test("given things returns not empty items", () => {
    const ep = pluginCompose([
      { name: "a", dataListTransform: (e, d) => d },
      { name: "b" },
      { name: "c", dataListTransform: (e, d) => d },
      { name: "d", dataListTransform: (e, d) => d }
    ], (p) => p.dataListTransform);
    expect(ep).toHaveLength(3);
  });
});

describe("extension points", () => {
  test("cumulates reducers", () => {
    const ep = createExtensionPoints([
      { name: "a", reducer: (s) => s },
      { name: "b", reducer: (s) => s, dataListTransform: (s, d) => d },
      { name: "c", dataListTransform: (s, d) => d },
      { name: "d", dataListTransform: (s, d) => d }
    ]);
    expect(ep.reducer).toHaveLength(2);
    expect(ep.dataListTransform).toHaveLength(3);
  });
});
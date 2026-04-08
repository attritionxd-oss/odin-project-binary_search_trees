import removeDuplicates from "/src/utils/removeDuplicates.js";

describe("removeDuplicates", () => {
  test("module exists", () => {
    expect(removeDuplicates).toBeInstanceOf(Function);
  });

  test("erroneous arg handling", () => {
    expect(removeDuplicates()).toBeUndefined();
  });

  test("returns array with unique values", () => {
    let data = [1, 1, 2];
    expect(removeDuplicates(data)).toEqual([1, 2]);
    data = [1, 1, 3, 2, 5, 5, 2, 3, 3, 3, 1, 2, 3, 5, 4];
    expect(removeDuplicates(data)).toEqual([1, 3, 2, 5, 4]);
  });
});

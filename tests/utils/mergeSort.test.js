import mergeSort from "/src/utils/mergeSort";

describe("mergeSort", () => {
  test("function exists", () => {
    expect(typeof mergeSort).toBe("function");
  });

  test("non-array arg throws", () => {
    expect(() => mergeSort("a")).toThrow();
  });

  test("array arg does not throw", () => {
    expect(() => mergeSort([1, 2])).not.toThrow();
  });

  test("returns an array", () => {
    expect(Array.isArray(mergeSort([1, 2]))).toBe(true);
  });

  describe("known test cases", () => {
    test.each([
      [[], []],
      [[1], [1]],
      [[73], [73]],
      [
        [1, 2],
        [1, 2],
      ],
      [
        [2, 1],
        [1, 2],
      ],
      [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
      ],
      [
        [3, 2, 1, 13, 8, 5, 0, 1],
        [0, 1, 1, 2, 3, 5, 8, 13],
      ],
      [
        [105, 79, 100, 110],
        [79, 100, 105, 110],
      ],
    ])("mergeSort([%p]) === %p", (input, exp) => {
      expect(mergeSort(input)).toMatchObject(exp);
    });
  });
});

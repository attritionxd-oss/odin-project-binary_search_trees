import Node from "/src/TreeNode";
import BST from "/src/BinarySearchTree";

describe("project-required tests", () => {
  const randomIntegers = (size = 100, factor = 100, scale = 0) => {
    const data = [];
    for (let i = 0; i < size; i++) {
      data.push(Math.floor(Math.random() * factor) + scale);
    }
    return data;
  };

  const printAll = (useMockLog = true) => {
    const values = [];
    const mockPush = jest.fn((i) => values.push(i));

    const mockLog = jest.fn();
    const customLog = (logName) => {
      if (useMockLog) {
        mockLog();
        expect(mockLog).toHaveBeenCalled();
      } else {
        console.log(logName, ":", values.join(", "));
      }
    };

    test.each([
      ["levelOrder", "levelOrderForEach"],
      ["preOrder", "preOrderForEach"],
      ["postOrder", "postOrderForEach"],
      ["inOrder", "inOrderForEach"],
    ])("print tree.%s()", (testName, methodName) => {
      values.splice(0, values);
      tree[methodName](mockPush);
      customLog(testName);
    });
  };

  const tree = new BST();

  describe("1. Create a binary search tree from an array of random numbers", () => {
    test("build tree", () => {
      tree.buildBST(randomIntegers());
    });
  });

  describe("2. Confirm that the tree is balanced", () => {
    test("balance", () => {
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("3. Print out all elements in level, pre, post, and in order", () => {
    printAll();
  });

  describe("4-5. Unbalance the tree", () => {
    test("add new values", () => {
      const newEntries = randomIntegers(50, 100, 100);
      newEntries.forEach((i) => {
        tree.insert(i);
        expect(tree.isBalanced()).toBe(true);
      });
    });
  });

  describe("6-7. Balance the tree, then confirm that it is balanced", () => {
    test("test rebalance", () => {
      tree.rebalance();
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("8. Print out all elements in level, pre, post, and in order", () => {
    printAll();
  });
});

describe("tree", () => {
  test("module exists", () => {
    expect(new BST()).toBeDefined();
  });

  test("is an object", () => {
    expect(new BST()).toBeInstanceOf(Object);
  });

  describe("has methods", () => {
    const tree = new BST();
    const methods = [
      "buildBST",
      "includes",
      "insert",
      "deleteItem",
      "levelOrderForEach",
      "inOrderForEach",
      "preOrderForEach",
      "postOrderForEach",
      "height",
      "depth",
      "isBalanced",
      "rebalance",
    ];
    methods.forEach((method) => {
      test(`has method: ${method}`, () => {
        expect(tree[method]).toBeInstanceOf(Function);
      });
    });
  });

  describe("buildBST()", () => {
    const tree = new BST();
    test("erroneous arg handling", () => {
      tree.buildBST();
      expect(tree.tree).toBe(null);
    });

    test("returns a Node", () => {
      tree.buildBST([1]);
      expect(tree.tree).toBeInstanceOf(Node);
    });

    describe("unbalanced trees", () => {
      test("test tree with deep equality (unsorted)", () => {
        const mockTree = new Node();
        mockTree.value = 2;
        mockTree.left = new Node();
        mockTree.left.value = 1;
        mockTree.right = new Node();
        mockTree.right.value = 3;

        const data = [2, 1, 3];
        tree.buildBST(data, true);
        expect(tree.tree).toEqual(mockTree);
      });

      test("test tree with deep equality (sorted)", () => {
        const mockTree = new Node();
        mockTree.value = 1;
        mockTree.right = new Node();
        mockTree.right.value = 2;
        mockTree.right.right = new Node();
        mockTree.right.right.value = 3;
        mockTree.right.right.right = new Node();
        mockTree.right.right.right.value = 4;

        data = [1, 2, 3, 4];
        tree.buildBST(data, true);
        expect(tree.tree).toEqual(mockTree);
      });
    });

    test("test tree with deep equality (sorted)", () => {
      const mockTree = new Node();
      mockTree.value = 2;
      mockTree.left = new Node();
      mockTree.left.value = 1;
      mockTree.right = new Node();
      mockTree.right.value = 3;
      mockTree.right.right = new Node();
      mockTree.right.right.value = 4;

      data = [1, 2, 3, 4];
      tree.buildBST(data);
      expect(tree.tree).toEqual(mockTree);
    });

    test("test tree with deep equality (unsorted)", () => {
      const mockData = {
        left: {
          left: null,
          right: { left: null, right: null, value: 2 },
          value: 1,
        },
        right: {
          left: null,
          right: { left: null, right: null, value: 5 },
          value: 4,
        },
        value: 3,
      };
      data = [5, 2, 1, 4, 3];
      tree.buildBST(data);
      expect(tree.tree).toEqual(mockData);
    });
  });

  describe("levelOrderForEach()", () => {
    const tree = new BST();
    test("erroneous arg handling", () => {
      expect(() => tree.levelOrderForEach()).toThrow();
      expect(() => tree.levelOrderForEach("a")).toThrow();
    });

    test("traversed empty tree is null", () => {
      expect(tree.tree).toBeNull();
    });

    test("traversal invokes callback n-times", () => {
      tree.buildBST([1, 2, 3]);
      const mockCallback = jest.fn();
      tree.levelOrderForEach(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    test("traversal with expected results", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      let data = [];
      tree.levelOrderForEach((val) => data.push(`(${val})`));

      const expectedResult =
        "(F) --> (C) --> (I) --> (A) --> (D) --> (G) --> (J) --> (B) --> (E) --> (H) --> (K)";

      expect(data.join(" --> ")).toBe(expectedResult);
    });
  });

  describe("inOrderForEach()", () => {
    const tree = new BST();
    test("erroneous arg handling", () => {
      expect(() => tree.inOrderForEach()).toThrow();
      expect(() => tree.inOrderForEach("a")).toThrow();
    });

    test("traversed empty tree is null", () => {
      expect(tree.tree).toBeNull();
    });

    test("traversal invokes callback n-times", () => {
      tree.buildBST([1, 2, 3]);
      const mockCallback = jest.fn().mockImplementation(() => {});
      tree.inOrderForEach(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    test("traversal with expected results", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      let data = [];
      tree.inOrderForEach((val) => data.push(`(${val})`));

      const expectedResult =
        "(A) --> (B) --> (C) --> (D) --> (E) --> (F) --> (G) --> (H) --> (I) --> (J) --> (K)";

      expect(data.join(" --> ")).toBe(expectedResult);
    });
  });

  describe("preOrderForEach()", () => {
    const tree = new BST();
    test("erroneous arg handling", () => {
      expect(() => tree.preOrderForEach()).toThrow();
      expect(() => tree.preOrderForEach("a")).toThrow();
    });

    test("traversed empty tree is null", () => {
      expect(tree.tree).toBeNull();
    });

    test("traversal invokes callback n-times", () => {
      tree.buildBST([1, 2, 3]);
      const mockCallback = jest.fn().mockImplementation(() => {});
      tree.preOrderForEach(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    test("traversal with expected results", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      let data = [];
      tree.preOrderForEach((val) => data.push(`(${val})`));

      const expectedResult =
        "(F) --> (C) --> (A) --> (B) --> (D) --> (E) --> (I) --> (G) --> (H) --> (J) --> (K)";

      expect(data.join(" --> ")).toBe(expectedResult);
    });
  });

  describe("postOrderForEach()", () => {
    const tree = new BST();
    test("erroneous arg handling", () => {
      expect(() => tree.postOrderForEach()).toThrow();
      expect(() => tree.postOrderForEach("a")).toThrow();
    });

    test("traversed empty tree is null", () => {
      expect(tree.tree).toBeNull();
    });

    test("traversal invokes callback n-times", () => {
      tree.buildBST([1, 2, 3]);
      const mockCallback = jest.fn().mockImplementation(() => {});
      tree.postOrderForEach(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    test("traversal with expected results", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      let data = [];
      tree.postOrderForEach((val) => data.push(`(${val})`));

      const expectedResult =
        "(B) --> (A) --> (E) --> (D) --> (C) --> (H) --> (G) --> (K) --> (J) --> (I) --> (F)";

      expect(data.join(" --> ")).toBe(expectedResult);
    });
  });

  describe("includes()", () => {
    const tree = new BST();

    test("erroneous arg handling", () => {
      expect(() => tree.includes()).toThrow();
    });

    test("returns false", () => {
      expect(tree.includes("some value")).toBe(false);

      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.includes("X")).toBe(false);
    });

    test("returns true", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.includes("F")).toBe(true);
      expect(tree.includes("D")).toBe(true);
      expect(tree.includes("J")).toBe(true);
      expect(tree.includes("K")).toBe(true);

      tree.buildBST([1, 2, 9, 3]);
      expect(tree.includes(1)).toBe(true);
    });
  });

  describe("depth()", () => {
    const tree = new BST();

    test("erroneous arg handling", () => {
      expect(tree.depth()).toBeUndefined();
    });

    test("value not found", () => {
      expect(tree.depth("some value")).toBeUndefined();

      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.depth("X")).toBeUndefined();
    });

    test("value found, returns depth", () => {
      tree.buildBST([1, 2, 3, 4]);
      expect(tree.depth(1)).toBe(1);

      tree.buildBST([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(tree.depth(1)).toBe(2);

      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.depth("K")).toBe(3);
    });
  });

  describe("height()", () => {
    const tree = new BST();

    test("erroneous arg handling", () => {
      expect(tree.height()).toBeUndefined();
    });

    test("value not found", () => {
      expect(tree.height("some value")).toBeUndefined();

      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.height("X")).toBeUndefined();
    });

    test("value found, returns height", () => {
      tree.buildBST(["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"]);
      expect(tree.height("F")).toBe(3);

      tree.buildBST([1, 2, 9, 3]);
      expect(tree.height(1)).toBe(0);
    });
  });

  describe("isBalanced()", () => {
    const tree = new BST();

    test("empty tree returns undefined", () => {
      expect(tree.isBalanced()).toBeUndefined();
    });

    describe("unbalanced trees", () => {
      test.each([
        [[1, 2, 3, 4], false],
        [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], false],
        [["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"], false],
      ])("isBalanced(%p) === %s", (data, expectedResult) => {
        tree.buildBST(data, true);
        expect(tree.isBalanced()).toBe(expectedResult);
      });

      test("manually unbalanced tree returns false", () => {
        const mockTree = {
          left: null,
          right: {
            left: null,
            right: {
              left: null,
              right: {
                left: null,
                right: { left: null, right: null, value: 5 },
                value: 4,
              },
              value: 3,
            },
            value: 2,
          },
          value: 1,
        };
        expect(tree.isBalanced(mockTree)).toBe(false);
      });
    });

    test("tree crossover balance functionality", () => {
      const tree1 = new BST();
      const tree2 = new BST();
      tree1.buildBST([1, 2, 3, 4], true);
      expect(tree2.isBalanced()).toBeUndefined();
      expect(tree2.isBalanced(tree1.tree)).toBe(false);
    });

    describe("balanced trees", () => {
      test.each([
        [[1, 2, 3, 4], true],
        [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true],
        [["F", "D", "J", "B", "E", "G", "K", "A", "C", "I", "H"], true],
        [["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"], true],
      ])("isBalanced(%p) === %s", (data, expectedResult) => {
        tree.buildBST(data);
        expect(tree.isBalanced()).toBe(expectedResult);
      });
    });
  });

  describe("rebalance()", () => {
    const tree = new BST();

    test("rebalance empty tree is undefined", () => {
      expect(tree.rebalance()).toBeUndefined();
    });

    test("rebalances manually unbalanced tree", () => {
      tree.buildBST([1, 2, 3, 4]);
      expect(tree.isBalanced()).toBe(true);

      // manual insertion unbalances tree
      tree.tree.right.right.right = new Node(5);
      expect(tree.isBalanced()).toBe(false);

      tree.rebalance();
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("insert()", () => {
    const tree = new BST();

    test("erroneous arg handling", () => {
      expect(() => tree.insert()).toThrow();
    });

    test("insert failed: do nothing", () => {
      tree.buildBST([1, 2, 3, 4]);
      const currentState = tree.tree;
      tree.insert(4);
      expect(tree.tree).toEqual(currentState);
    });

    test("insert successful from empty tree", () => {
      const emptyTree = new BST();
      emptyTree.tree = null;
      emptyTree.insert("some value");
      expect(emptyTree.tree).toEqual({
        left: null,
        right: null,
        value: "some value",
      });

      emptyTree.insert("another value");
      expect(emptyTree.tree).toEqual({
        left: { left: null, right: null, value: "another value" },
        right: null,
        value: "some value",
      });
    });

    describe("insert succeded, tree is rebalanced", () => {
      test.each([
        [4, [1, 2, 3, 5, 6]],
        [5, [1, 2, 3, 4]],
        [4, [1, 2, 3, 5]],
        [4, [1, 2, 9, 3]],
        [11, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        [50, [72, 73, 42, 42, 24, 46, 54, 7, 60, 48]],
      ])("insert(%s) in %p", (newVal, data) => {
        tree.buildBST(data);
        tree.insert(newVal);
        expect(tree.isBalanced()).toBe(true);
      });
    });
  });

  describe("delete()", () => {
    const tree = new BST();

    test("erroneous arg handling", () => {
      expect(() => tree.deleteItem()).toThrow();
    });

    test("delete fails for empty tree", () => {
      tree.deleteItem("some value");
      expect(tree.tree).toBe(null);
    });

    test("delete fails: value not found", () => {
      expect(tree.deleteItem("some value")).toBe(null);
    });

    describe("delete successful: leaf nodes", () => {
      test.each([
        [6, [1, 2, 3, 5, 6]],
        [2, [1, 2, 3, 5, 6]],
        ["M", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
        ["B", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
      ])("delete(%s) from %p", (target, data) => {
        tree.buildBST(data);
        tree.deleteItem(target);
        expect(tree.includes(target)).toBe(false);
      });
    });

    describe("delete successful: single-child nodes", () => {
      test.each([
        [1, 2, [1, 2, 3, 4, 5]],
        [4, 5, [1, 2, 3, 4, 5]],
        ["C", "D", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
        ["F", "G", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
      ])("delete(%s), preserve %s from %p", (target, child, data) => {
        tree.buildBST(data);
        tree.deleteItem(target);
        expect(tree.includes(target)).toBe(false);
        expect(tree.includes(child)).toBe(true);
        // expect(tree.tree).toBe();
      });
    });

    describe("delete successful: two-child nodes", () => {
      test.each([
        [2, 1, 3, [1, 2, 3, 4, 5, 6, 7]],
        [6, 5, 7, [1, 2, 3, 4, 5, 6, 7]],
        ["B", "A", "C", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
        ["I", "F", "J", ["F", "D", "J", "B", "E", "G", "K", "A", "C", "I"]],
      ])(
        "delete(%s), preserve %s and %s from %p",
        (target, childLeft, childRight, data) => {
          tree.buildBST(data);
          tree.deleteItem(target);
          expect(tree.includes(target)).toBe(false);
          expect(tree.includes(childLeft)).toBe(true);
          expect(tree.includes(childRight)).toBe(true);
        },
      );
    });
  });
});

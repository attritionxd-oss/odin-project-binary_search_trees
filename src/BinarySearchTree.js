import Node from "./TreeNode.js";
import mergeSort from "./utils/mergeSort.js";
import removeDuplicates from "./utils/removeDuplicates.js";

export default class BST {
  constructor() {
    this.tree = null;
  }

  #insertNode(node, value) {
    if (value < node.value) {
      // try to go left
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.#insertNode(node.left, value);
      }
    } else {
      // try to go right
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.#insertNode(node.right, value);
      }
    }
  }

  #buildBalancedBST(arr, start, end) {
    if (start > end) return null;

    let mid = start + Math.floor((end - start) / 2);
    let root = new Node(arr[mid]);

    // Divide from middle element
    root.left = this.#buildBalancedBST(arr, start, mid - 1);
    root.right = this.#buildBalancedBST(arr, mid + 1, end);

    return root;
  }

  buildBST(array, unbalanced = false) {
    if (!array || array.length === 0) return;
    const cleanArray = mergeSort(removeDuplicates(array));

    if (unbalanced) {
      let root = new Node(array[0]);

      for (let i = 1; i < array.length; i++) {
        this.#insertNode(root, array[i]);
      }

      this.tree = root;
    } else {
      this.tree = this.#buildBalancedBST(cleanArray, 0, cleanArray.length - 1);
    }
  }

  #get(value, node) {
    if (!node || node.value === value) return node;

    if (node.value > value) {
      return this.#get(value, node.left);
    }
    return this.#get(value, node.right);
  }

  includes(value) {
    if (!value) throw new Error("ArgError: argument must be a valid value");

    return !!this.#get(value, this.tree);
  }

  insert(value) {
    if (!value) throw new Error("ArgError: argument must be a valid value");

    if (!this.tree) {
      this.buildBST([value]);
      return;
    }

    const node = this.#get(value, this.tree);
    if (!!node) return;

    const newTree = structuredClone(this.tree);
    this.#insertNode(newTree, value);

    this.tree = newTree;
    if (!this.isBalanced(newTree)) this.rebalance();
  }

  #getSuccessor(node) {
    node = node.right;
    while (!!node && !!node.left) node = node.left;
    return node;
  }

  deleteItem(value, root = this.tree) {
    if (!value) throw new Error("ArgError: argument must be a valid value");
    if (!root) return root; // todo

    if (root.value > value) root.left = this.deleteItem(value, root.left);
    else if (root.value < value)
      root.right = this.deleteItem(value, root.right);
    else {
      // node with 0 or 1 child
      if (!root.left) return root.right;
      if (!root.right) return root.left;

      // node with 2 children
      const successor = this.#getSuccessor(root);
      root.value = successor.value;
      root.right = this.deleteItem(successor.value, root.right);
    }
    return root;
  }

  levelOrderForEach(callback) {
    if (!callback || typeof callback !== "function")
      throw new Error("ArgError: callback must be a valid function");

    if (!this.tree) return;

    const queue = [this.tree];

    while (queue.length > 0) {
      let node = queue.shift();
      callback(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  #recursiveInOrder(node, callback) {
    if (!node) return;

    if (node.left) this.#recursiveInOrder(node.left, callback);
    callback(node.value);
    if (node.right) this.#recursiveInOrder(node.right, callback);
  }

  inOrderForEach(callback) {
    if (!callback || typeof callback !== "function")
      throw new Error("ArgError: callback must be a valid function");

    if (!this.tree) return;

    this.#recursiveInOrder(this.tree, callback);
  }

  #recursivePreOrder(node, callback) {
    if (!node) return;

    callback(node.value);
    if (node.left) this.#recursivePreOrder(node.left, callback);
    if (node.right) this.#recursivePreOrder(node.right, callback);
  }

  preOrderForEach(callback) {
    if (!callback || typeof callback !== "function")
      throw new Error("ArgError: callback must be a valid function");

    if (!this.tree) return;

    this.#recursivePreOrder(this.tree, callback);
  }

  #recursivePostOrder(node, callback) {
    if (!node) return;

    if (node.left) this.#recursivePostOrder(node.left, callback);
    if (node.right) this.#recursivePostOrder(node.right, callback);
    callback(node.value);
  }

  postOrderForEach(callback) {
    if (!callback || typeof callback !== "function")
      throw new Error("ArgError: callback must be a valid function");

    if (!this.tree) return;

    this.#recursivePostOrder(this.tree, callback);
  }

  #calculateHeight(node) {
    if (!node) return -1; // or 0, depending on your definition

    const leftHeight = this.#calculateHeight(node.left);
    const rightHeight = this.#calculateHeight(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  height(value) {
    if (!value) return;
    const node = this.#get(value, this.tree);
    if (!node) return;

    return this.#calculateHeight(node);
  }

  #calculateDepth(value, root = this.tree, currentDepth = 0) {
    if (!root) return;

    if (root.value === value) {
      return currentDepth;
    }

    if (value > root.value) {
      return this.#calculateDepth(value, root.right, currentDepth + 1);
    } else {
      return this.#calculateDepth(value, root.left, currentDepth + 1);
    }
  }

  depth(value) {
    if (!value) return;
    return this.#calculateDepth(value);
  }

  #checkBalance(node) {
    if (!node) return 0;

    const left = this.#checkBalance(node.left);
    const right = this.#checkBalance(node.right);
    const delta = Math.abs(left - right);

    if (left === -1 || right === -1 || delta > 1) return -1;
    else return Math.max(left, right) + 1;
  }

  isBalanced(tree = this.tree) {
    if (!tree) return;
    return this.#checkBalance(tree) !== -1;
  }

  rebalance() {
    const data = [];
    this.inOrderForEach((element) => data.push(element));
    this.buildBST(data);
  }
}

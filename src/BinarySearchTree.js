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
    if (!value) throw new Error("ArgError: argument must be a valid string");

    return !!this.#get(value, this.tree);
  }

  insert(value) {}

  deleteItem(value) {}

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

  height(value) {}

  depth(value) {}

  isBalanced() {}

  rebalance() {}
}

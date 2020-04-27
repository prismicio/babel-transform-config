const ArrayHelpers = require('./utils').ArrayHelpers;
const Operations = require('./operations');

class Tree {
  constructor(/* Root */ root) {
    this.root = root;
  }

  combine(/* Tree */other) {
    const mergedNodes = ArrayHelpers.flatten(other.root.nextNodes.map(otherNode => {
      const matchedNode = this.root.nextNodes.find(({ key }) => key === otherNode.key);
      if(matchedNode) return matchedNode.combine(otherNode);
      else return otherNode;
    }));

    const mergedKeys = mergedNodes.map(({ key }) => key);
    const allNodes = this.root.nextNodes
    .filter(n => !mergedKeys.includes(n.keys))
    .concat(mergedNodes);

    return new Tree(new Root(allNodes));
  }
}

class _TreeNode {
  constructor(/*Node[] */nextNodes) {
    this.nextNodes = nextNodes;
  }
}

class Root extends _TreeNode {
  constructor(/*Node[] */nextNodes) {
    super(nextNodes);
  }
}

class Node extends _TreeNode {
  constructor(/* string */key, /* any */value, /*Node[] */nextNodes, /* Operation[] */ ops) {
    super(nextNodes);
    this.key = key;
    this.value = value;
    this.ops = ops;
  }

  combine(/* Node */other) /* Node[] */ {
    if(this.key === node.key) {
      const merged = (() => {
        const combinedOps = ArrayHelpers.distinct(this.ops, other.ops, (op1, op2) => op1 === op2);
        const finalValue = (() => {
          if(combinedOps.includes(Operations.delete)) return null;
          else {
            if(this.value && other.value) {
              if(Array.isArray(this.value)) return this.value.concat(other.value);
              else return Object.assign({}, this.value, other.value);
            } else return this.value || other.value;
          }
        })();
        new Node(
          this.key,
          finalValue,
          ArrayHelpers.distinct(this.nextNodes, other.nextNodes, (node1, node2) => node1.key === node2.key),
          combinedOps
        )
      })();
      return [merged];
    } else {
      return [this, other];
    }
  }
}

const Trees = {
  empty() {
    return new Tree(new Root([]));
  }
}

module.exports = {
  Tree,
  Trees,
  Root,
  Node
};

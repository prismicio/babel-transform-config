const Operations = require('./operations');
const ArrayHelpers = require('./utils').ArrayHelpers;
const treeModule = require('./tree');

const Tree = treeModule.Tree;
const Node = treeModule.Node;
const Root = treeModule.Root;

function _formatNode(key, value) {
  return {
    key,
    value
  };
}

function _format(key, value, ops) {
  const KeySeparator = ':';
  const nodes = key.split(KeySeparator);

  const [headList, last] = ArrayHelpers.splitAtLast(nodes);
  const formattedNodes = headList
    .map(k => _formatNode(k, null))
    .concat([_formatNode(last, value)]);
  return {
    nodes: formattedNodes,
    ops
  };
}

module.exports = {
  validate(key, action, value) {
    if (!action || !action.length) {
      throw new Error(
        `Transformation with key "${key}" should possess a non-empty "action" key`
      );
    }
    if (action.indexOf(Operations.delete) === -1 && value === undefined) {
      throw new Error(
        `Transformation with key "${key}" should possess a non-empty "value" key`
      );
    }

    const ops = Operations.toList(action, value);

    return _format(key, value, ops);
  },

  convertToTree(action) {
    function toNodes(entries, ops) /* Node[] */ {
      const [head, tail] = ArrayHelpers.splitAtHead(entries);
      if (!head) return [];

      return [new Node(head.key, head.value, toNodes(tail, ops), ops)];
    }

    const headNodes = toNodes(action.nodes, action.ops);

    return new Tree(new Root(headNodes));
  }
};

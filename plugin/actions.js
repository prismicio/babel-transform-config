const Operations = require('./operations');
const ArrayHelpers = require('./utils').ArrayHelpers;

function _format(key, value, ops) {
  const KeySeparator = ':';
  const [nodes, leafKey] = ArrayHelpers.splitAtLast(key.split(KeySeparator))
  return {
    nodes,
    leaf: leafKey,
    value: value,
    ops
  }
}

module.exports = {
  validate(key, action, value) {

    if (!action || !action.length) {
      throw new Error(`Transformation with key "${key}" should possess a non-empty "action" key`)
    }
    if (action.indexOf(Operations.delete) === -1 && value === undefined) {
      throw new Error(`Transformation with key "${key}" should possess a non-empty "value" key`)
    }

    const ops = Operations.toList(action, value);

    return _format(key, value, ops);
  }
}

function buildSubjacentPaths(arr, store = [], len = 0) {
  if (len >= arr.length) {
    return store
  }
  store = [...store, arr.slice(0, len + 1)]
  return buildSubjacentPaths(arr, store, len + 1)
}

function dedupeStringLiterals(elements) {
  const set = new Set()
  return elements.filter(e => {
    if (e.type !== 'StringLiteral') {
      return true
    }
    const duplicate = set.has(e.value)
    set.add(e.value)
    return !duplicate
  })
}

/** There probably is a better way */
function testNodeValue(t, path) {
  const { type } = path.node.value
  if (type === 'ArrayExpression') {
    return !!path.node.value.elements.length
  }
  if (type === 'ObjectExpression') {
    return !!path.node.value.properties.length
  }
  if (type === 'NullLiteral') {
    return false
  }
  return true
}

const ArrayHelpers = {
  splitAtLast(array) {
    if(!array) return null;

    switch(array.length) {
      case 0: return [[], null];
      case 1: return [[], array[0]];
      default: return [array.slice(0, -1), array[array.length - 1]]
    }
  },

  combine(array1, array2, mergeFn) {
    const [main, other] = array1.length > array2.length ? [array2, array1] : [array1, array2];
    return main
    .map((value, index) => mergeFn(value, other[index]))
    .concat(other.slice(main.length, other.length).map(value => mergeFn(undefined, value)))
  }
}

module.exports = {
  buildSubjacentPaths,
  dedupeStringLiterals,
  testNodeValue,
  ArrayHelpers
}

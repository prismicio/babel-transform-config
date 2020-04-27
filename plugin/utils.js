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

const ArrayHelpers = {
  splitAtLast(array) {
    if(!array) return null;

    switch(array.length) {
      case 0: return [[], null];
      case 1: return [[], array[0]];
      default: return [array.slice(0, -1), array[array.length - 1]]
    }
  },

  splitAtHead(array) {
    if(!array) return null;

    switch(array.length) {
      case 0: return [null, []];
      case 1: return [array[0], []];
      default: return [array[0], array.slice(1)]
    }
  },

  combine(array1, array2, mergeFn) {
    const [main, other] = array1.length > array2.length ? [array2, array1] : [array1, array2];
    return main
    .map((value, index) => mergeFn(value, other[index]))
    .concat(other.slice(main.length, other.length).map(value => mergeFn(undefined, value)))
  },

  flatten(arr) {
    return arr.reduce((acc, subArr) => acc.concat(subArr), []);
  },

  distinct(arr1, arr2, predicate) {
    this.flatten(
      this.combine(arr1, arr2, (item1, item2) => predicate(item1, item2) ? [item1] : [item1, item2])
    );
  },

  diff(array1, array2) {
    return array1.filter(function(elm) {
      return array2.indexOf(elm) === -1;
    })
  }
}

module.exports = {
  dedupeStringLiterals,
  ArrayHelpers
}

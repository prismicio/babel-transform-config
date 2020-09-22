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
    // FIXME: Behaving really weirdly / not used
    const [main, other] = array1.length > array2.length ? [array2, array1] : [array1, array2];

    return main
      .map((value, index) => mergeFn(value, other[index]))
      .concat(other.slice(main.length, other.length).map(value => mergeFn(undefined, value)))
  },

  flatten(arr) {
    return arr.reduce((acc, subArr) => acc.concat(subArr), []);
  },

  distinct(arr1, arr2, predicate) {
    return arr1.concat(arr2).reduce((acc, current) => {
      for (const item of acc) {
        if (predicate(item, current)) {
          return acc;
        }
      }
      acc.push(current);
      return acc;
    }, []);
  },

  diff(array1, array2) {
    return array1.filter(function(elm) {
      return array2.indexOf(elm) === -1;
    })
  }
}

module.exports = {
  ArrayHelpers
}

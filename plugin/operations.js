const SEPARATOR = ':';
const OPERATIONS = {
  create: 'create',
  merge: 'merge',
  replace: 'replace',
  delete: 'delete'
};

module.exports = {
  ...OPERATIONS,
  toString: () => {
    return Object.entries(OPERATIONS)
      .map(([, v]) => v)
      .join(' | ');
  },
  toList: (strOperations, value) => {
    const operations = strOperations.split(SEPARATOR);

    operations.forEach(op => {
      if (!OPERATIONS[op]) {
        throw new Error(
          `Operation "${op}" does not exist.\nDefined operations: ${OPERATIONS.toString()}`
        );
      }
    });
    if (
      operations.includes(OPERATIONS.merge) &&
      operations.includes(OPERATIONS.replace)
    ) {
      throw new Error(
        'Operations "merge" and "update" cannot coexist in transform\'s "action" property'
      );
    }
    if (
      operations.includes(OPERATIONS.create) &&
      operations.includes(OPERATIONS.delete)
    ) {
      throw new Error(
        'Operations "create" and "delete" cannot coexist in transform\'s "action" property'
      );
    }
    if (operations.includes(OPERATIONS.merge) && !Array.isArray(value)) {
      throw new Error(
        'Operations "merge" expects value to be of type "Array" (tested with Array.isArray)'
      );
    }

    return operations;
  }
};

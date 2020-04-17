const SEPARATOR = ':';
const Operations = {
  create: 'create',
  merge: 'merge',
  replace: 'replace',
  delete: 'delete'
};

module.exports = {
  ...Operations,
  toString: () => {
    return Object.entries(Operations).map(([, v]) => v).join(' | ');
  },
  toList: (strOperations, value) => {
    const operations = strOperations.split(SEPARATOR);

    operations.forEach((op) => {
      if (!Operations[op]) {
        throw new Error(`Operation "${op}" does not exist.\nDefined operations: ${Operations.toString()}`)
      }
    })
    if (operations.includes(Operations.merge) && operations.includes(Operations.replace)) {
      throw new Error('Operations "merge" and "update" cannot coexist in transform\'s "action" property')
    }
    if (operations.includes(Operations.create) && operations.includes(Operations.delete)) {
      throw new Error('Operations "create" and "delete" cannot coexist in transform\'s "action" property')
    }
    if (operations.includes(Operations.merge) && !Array.isArray(value)) {
      throw new Error('Operations "merge" expects value to be of type "Array" (tested with Array.isArray)')
    }

    return operations;
  }
};

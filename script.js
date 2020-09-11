// Just to test things manually quicker than with Jest...
const transformConfig = require('./');

const config = `export default {
  delete: ['value'],
  modules: [],
  css: ['value'],
  head: {
    script: [],
    style: []
  }
};`

const transforms = {
  delete: {
    action: 'delete'
  },
  modules: {
    action: 'merge',
    value: ['merge']
  },
  'buildModules': {
    action: 'create',
    value: ['create']
  },
  css: {
    action: 'replace',
    value: ['replace']
  },
  'head:script': {
    action: 'merge',
    value: ['merge']
  },
  // 'head:style': {
  //   action: 'merge',
  //   value: ['merge']
  // }
};

// console.info(transformConfig.transform(config, transforms).code);

const config2 = `export default {
  foo: ['default'],
  bar: {
    baz: ['default']
  }
};`;
const transforms2 = {
  'test:nested': {
    action: 'create',
    value: ['created']
  },
  // 'bar:baz': {
  //   action: 'merge',
  //   value: ['merged']
  // }
};
console.info(transformConfig.transform(config2, transforms2).code)
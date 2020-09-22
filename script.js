// Just to test things manually quicker than with Jest...
const transformConfig = require('./');

const config = `export default {
  foo: ['default'],
  foo2: ['default'],
  bar: {
    baz: ['default'],
    baz2: ['default']
  }
};`;

const transforms = {
  'bar:test': {
    action: 'create',
    value: ['created']
  },
  'bar:test2': {
    action: 'create',
    value: ['created']
  },
  'bar:baz': {
    action: 'delete'
  },
  'bar:baz2': {
    action: 'delete'
  }
};

// console.info(transformConfig.transform(config, transforms).code)

const { ArrayHelpers } = require('./plugin/utils');

const ops1 = ['delete', 'create'];
const ops2 = ['update'];

// console.log(ArrayHelpers.distinct(ops1, ops2, (op1, op2) => op1 === op2));

const config2 = `export default {
  config: {},
  buildModules: [{}]
};
`

const transforms2 = {
  ignore: { action: 'create:merge', value: [ '**/*.stories.js' ] }
}

console.info(transformConfig.transform(config2, transforms2).code)
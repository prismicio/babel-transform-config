const consola = require('consola');
const Actions = require('./actions');
const ArrayHelpers = require('./utils').ArrayHelpers;

function validateTransforms(transforms) {
  return Object.entries(transforms).map(([key, transform]) => {
    return Actions.validate(key, transform.action, transform.value)
  })
}

const nodeVisitor = {
  Identifier(path, state) {
    const { nodesManifest, level } = state;
    console.log("level", level)
    console.log("nodesManifest", nodesManifest)
    console.log(nodesManifest[0] == undefined)
    if(nodesManifest[0] == undefined) return;

    const { node } = path;

    if(nodesManifest[0].leaves.indexOf(node.name) >= 0) console.log('update Value')
    state.level = state.level + 1;
    state.nodesManifest = nodesManifest.slice(1, nodesManifest.length);
  },
  ObjectExpression(path, state) {
  },
  ArrayExpression(path, state) {
  },
}

module.exports = function({ types: t }, transforms) {
  const validTransforms = validateTransforms(transforms);
  const nodesPerLevel = validTransforms
    .map(t => t.nodes)
    .reduce((acc, nodes) => {
      return ArrayHelpers.combine(acc, nodes, (val1, val2) => [val1, val2]);
    }, []);

  const levelsRange = [...Array(nodesPerLevel.length + 1).keys()];

  const leavesPerLevel = levelsRange.reduce((acc, index) => {
    const transformsForLevel = validTransforms.filter(t => t.nodes.length === index)
    return acc.concat([transformsForLevel.map(t => t.leaf)]);
  }, [])

  const nodesManifest = ArrayHelpers.combine(nodesPerLevel, leavesPerLevel, (nodes = [], leaves) => ({ nodes, leaves }))

  return {
    name: 'babel-plugin-transform-config',
    visitor: {
      ExportDefaultDeclaration(path) {
        path.traverse(nodeVisitor, { nodesManifest, level: 0 })
      }
    }
  };
}

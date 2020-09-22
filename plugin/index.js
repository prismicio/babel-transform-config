const consola = require('consola');
const Actions = require('./actions');
const Trees = require('./tree').Trees;
const ArrayHelpers = require('./utils').ArrayHelpers;
const toAst = require('./toAst');
const Operations = require('./operations');

function validateTransforms(transforms) {
  return Object.entries(transforms).map(([key, transform]) => {
    return Actions.validate(key, transform.action, transform.value)
  })
}

const nodeVisitor = {
  ObjectExpression(path, state) {
    const { nodeData: parentData, globalTypes } = state;
    const namedParent = path.parent.key && path.parent.key.name;

    const currentData = namedParent && parentData && parentData.nextNodes.find(n => n.key === namedParent);

    if(currentData) {
      // detect and create missing nodes
      const childrenKeys = path.node.properties.map(node => node.key.name);
      const missingKeys = ArrayHelpers.diff(currentData.nextNodes.map(n => n.key), childrenKeys);
      missingKeys.forEach(key => {
        const newObjectProperty = globalTypes.ObjectProperty(
          globalTypes.identifier(key),
          toAst(globalTypes, {})
        );

        path.node.properties = [
          ...path.node.properties,
          newObjectProperty
        ];
      });
      // update current node if needed
      if(currentData.ops.includes(Operations.delete) && !currentData.value && !currentData.nextNodes.length) {
        path.parentPath.remove();
      } else if(currentData.value && currentData.ops.includes(Operations.merge)) {
        if(path.node.value) {
          const { type } = path.node.value;
          switch(type) {
            case 'ArrayExpression':
              const elements = path.node.elements.concat(toAst(globalTypes, currentData.value).elements);
              const updatedArray = Object.assign({}, path.node, { elements });
              path.replaceWithMultiple([
                updatedArray
              ]);
              break;

            default:
              const properties = path.node.properties.concat(toAst(globalTypes, currentData.value).properties);
              const updatedObj = Object.assign({}, path.node, { properties });
              path.replaceWith(updatedObj);
          }
        } else {
          path.replaceWith(toAst(globalTypes, currentData.value));
        }
      } else if(currentData.value && (currentData.ops.includes(Operations.replace) || currentData.ops.includes(Operations.create))) {
        path.replaceWith(toAst(globalTypes, currentData.value));
      }

      // keep exploring with a subset of the model based on the current visited node
      path.skip();
      path.traverse(nodeVisitor, { nodeData: currentData, globalTypes });
    } else if (!namedParent && path.parent.type === 'ExportDefaultDeclaration') {
      // Create missing nodes when at root
      const childrenKeys = path.node.properties.map(node => node.key.name);
      const missingNodes = parentData.nextNodes.filter(node => childrenKeys.indexOf(node.key) === -1);

      if (missingNodes) {
        missingNodes.forEach(nodeData => {
          const newObjectProperty = globalTypes.ObjectProperty(
            globalTypes.identifier(nodeData.key),
            toAst(globalTypes, {})
          );

          path.node.properties = [
            ...path.node.properties,
            newObjectProperty
          ];
        });
      }
    }
  },
  ArrayExpression(path, state) {
    const { nodeData: parentData, globalTypes } = state;
    const namedParent = path.parent.key && path.parent.key.name;

    const currentData = namedParent && parentData && parentData.nextNodes.find(n => n.key === namedParent);

    // update current node if needed
    if(currentData) {
      if (
        currentData.ops.includes(Operations.delete)
        && !currentData.value
        && !currentData.nextNodes.length
      ) {
        path.parentPath.remove();
        return;
      } else if (currentData.value) {
        if (currentData.ops.includes(Operations.merge)) {
          const elements = path.node.elements.concat(toAst(globalTypes, currentData.value).elements);
          const updated = Object.assign({}, path.node, { elements });
          path.replaceWithMultiple([
            updated
          ]);
        } else if(
          currentData.ops.includes(Operations.replace) || currentData.ops.includes(Operations.create)
        ) {
          path.replaceWithMultiple([
            toAst(globalTypes, currentData.value)
          ]);
        }
      }

      // keep exploring with a subset of the model based on the current visited node
      path.skip();
      path.traverse(nodeVisitor, { nodeData: currentData, globalTypes });
    }
  }
}

module.exports = function({ types: globalTypes }, transforms) {
  const validActions = validateTransforms(transforms);
  const data = validActions
    .map(Actions.convertToTree)
    .reduce((accTree, actionTree) => {
      return accTree.combine(actionTree)
    }, Trees.empty());

  return {
    name: 'babel-plugin-transform-config',
    visitor: {
      ExportDefaultDeclaration(path) {
        path.traverse(nodeVisitor, { nodeData: data.root, globalTypes });
      }
    }
  };
}

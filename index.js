const consola = require('consola')
const babelTransform = require('@babel/standalone').transform

const babelTransformConfigPlugin = require('./plugin')

const nuxt = {
  css(value) {
    // arr of strings
    return ['css', {
      action: 'create:merge',
      value
    }]
  },
  script(value) {
    // arr of objects or strings
    return ['head:script', {
      action: 'create:merge',
      value
    }]
  },
  module(value) {
    return ['modules', {
      action: 'create:merge',
      value: [value]
    }]
  },
  modules(value) {
    return ['modules', {
      action: 'create:merge',
      value
    }]
  },
  transpile(value) {
    return ['build:transpile', {
      action: 'create:merge',
      value
    }]
  },
  libraries(value) {
    return ['build:transpile', {
      action: 'create:merge',
      value
    }]
  }
}
const table = { nuxt }

function createTransformArgs(framework, args, strict) {
  const frameworkTable = table[framework]
  const keysNotFound = []
  if (!frameworkTable) {
    throw new Error(`[transform-configs] ${framework} Framework not supported\nUse babel plugin directly instead`)
  }
  const transforms = Object.entries(args).reduce((acc, [k, v]) => {
    if (frameworkTable[k]) {
      const [key, value] = frameworkTable[k](v)
      return {
        ...acc,
        [key]: value
      }
    }
    keysNotFound.push(k)
    if (!strict) {
      return {
        ...acc,
        [k]: {
          action: "create:merge",
          value: v
        }
      }
    }
    return acc
  }, {})
  return {
    transforms,
    keysNotFound
  }
}

function transform(code, transforms) {
  return babelTransform(code, {
    plugins: [
      [
        babelTransformConfigPlugin,
        transforms
      ]
    ]
  }) // { code } or Throws error
}

function handleKeysNotFound(keys) {
  keys.forEach((key) => {
    consola.warn(`[transform-args] Key "${key}" not recognized.\nDefaulting to default transform`)
  })
}
function transformConfig(code, framework, args, strict = true) {
  try {
    const {
      transforms,
      keysNotFound,
    } = createTransformArgs(framework, args, strict)

    if (JSON.stringify(transforms) === "{}") {
      return consola.error("No transforms performed")
    }
    if (!strict && keysNotFound.length) {
      handleKeysNotFound(keysNotFound);
    }
    return transform(code, transforms)
  } catch(e) {
    consola.error(e.message);
  }
}

transformConfig.transform = transform
transformConfig.plugin = babelTransformConfigPlugin

module.exports = transformConfig

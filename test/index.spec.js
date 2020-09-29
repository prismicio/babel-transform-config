const transformConfig = require('../');
const consola = require('consola');

describe('transformConfig.transform', () => {
  const config = `export default {
    foo: ['default'],
    foo2: ['default'],
    bar: {
      baz: ['default'],
      baz2: ['default']
    },
    qux: [{}]
  };`;

  /**
   * Creates
   */
  it('creates array', () => {
    const transforms = {
      test: {
        action: 'create',
        value: ['created']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('creates multiple arrays', () => {
    const transforms = {
      test: {
        action: 'create',
        value: ['created']
      },
      test2: {
        action: 'create',
        value: ['created2']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('creates array in object', () => {
    const transforms = {
      'bar:nested': {
        action: 'create',
        value: ['created']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('creates multiple arrays in object', () => {
    const transforms = {
      'bar:nested': {
        action: 'create',
        value: ['created']
      },
      'bar:nested2': {
        action: 'create',
        value: ['created2']
      },
      'bar:nested3': {
        action: 'create',
        value: ['created3']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('creates nested array', () => {
    const transforms = {
      'test:nested': {
        action: 'create',
        value: ['created']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('creates nested multiple arrays', () => {
    const transforms = {
      'test:nested': {
        action: 'create',
        value: ['created']
      },
      'test:nested2': {
        action: 'create',
        value: ['created2']
      },
      'test:nested3': {
        action: 'create',
        value: ['created3']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });

  /**
   * Replaces
   */
  it('replaces array', () => {
    const transforms = {
      foo: {
        action: 'replace',
        value: ['replaced']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('replaces multiple arrays', () => {
    const transforms = {
      foo: {
        action: 'replace',
        value: ['replaced']
      },
      foo2: {
        action: 'replace',
        value: ['replaced2']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('replaces array in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'replace',
        value: ['replaced']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('replaces multiple arrays in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'replace',
        value: ['replaced']
      },
      'bar:baz2': {
        action: 'replace',
        value: ['replaced2']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });

  /**
   * Merges
   */
  it('merges array', () => {
    const transforms = {
      foo: {
        action: 'merge',
        value: ['merged']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('merges multiple arrays', () => {
    const transforms = {
      foo: {
        action: 'merge',
        value: ['merged']
      },
      foo2: {
        action: 'merge',
        value: ['merged2']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('merges array in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'merge',
        value: ['merged']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('merges multiple arrays in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'merge',
        value: ['merged']
      },
      'bar:baz2': {
        action: 'merge',
        value: ['merged2']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });

  /**
   * Deletes
   */
  it('deletes array', () => {
    const transforms = {
      foo: {
        action: 'delete'
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('deletes multiple arrays', () => {
    const transforms = {
      foo: {
        action: 'delete'
      },
      foo2: {
        action: 'delete'
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('deletes array in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'delete'
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('deletes multiple arrays in object', () => {
    const transforms = {
      'bar:baz': {
        action: 'delete'
      },
      'bar:baz2': {
        action: 'delete'
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
  it('deletes object', () => {
    const transforms = {
      bar: {
        action: 'delete'
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });

  /**
   * Creates/Replaces
   */
  it('creates/replaces array', () => {
    const transformsArray = [
      {
        foo: {
          action: 'create:replace',
          value: ['created/replaced']
        }
      },
      {
        test: {
          action: 'create:replace',
          value: ['created/replaced']
        }
      }
    ];
    const transformed = transformsArray.map(transforms =>
      transformConfig.transform(config, transforms)
    );
    expect(transformed.map(t => t.code)).toMatchSnapshot();
  });
  it('creates/replaces array in object', () => {
    const transformsArray = [
      {
        'bar:baz': {
          action: 'create:replace',
          value: ['created/replaced']
        }
      },
      {
        'bar:nested': {
          action: 'create:replace',
          value: ['created/replaced']
        }
      }
    ];
    const transformed = transformsArray.map(transforms =>
      transformConfig.transform(config, transforms)
    );
    expect(transformed.map(t => t.code)).toMatchSnapshot();
  });
  it('creates/replaces nested array', () => {
    const transforms = {
      'test:nested': {
        action: 'create:replace',
        value: ['created/replaced']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });

  /**
   * Creates/Merges
   */
  it('creates/merges array', () => {
    const transformsArray = [
      {
        foo: {
          action: 'create:merge',
          value: ['created/merged']
        }
      },
      {
        test: {
          action: 'create:merge',
          value: ['created/merged']
        }
      }
    ];
    const transformed = transformsArray.map(transforms =>
      transformConfig.transform(config, transforms)
    );
    expect(transformed.map(t => t.code)).toMatchSnapshot();
  });
  it('creates/merges array in object', () => {
    const transformsArray = [
      {
        'bar:baz': {
          action: 'create:merge',
          value: ['created/merged']
        }
      },
      {
        'bar:nested': {
          action: 'create:merge',
          value: ['created/merged']
        }
      }
    ];
    const transformed = transformsArray.map(transforms =>
      transformConfig.transform(config, transforms)
    );
    expect(transformed.map(t => t.code)).toMatchSnapshot();
  });
  it('creates/merges nested array', () => {
    const transforms = {
      'test:nested': {
        action: 'create:merge',
        value: ['created/merged']
      }
    };
    const transformed = transformConfig.transform(config, transforms);
    expect(transformed.code).toMatchSnapshot();
  });
});

describe('transformConfig', () => {
  it('should call consola.error when no transforms are made', () => {
    consola.mockTypes(typeName => typeName === 'error' && jest.fn());

    const result = transformConfig('', 'nuxt', {});

    expect(consola.error).toBeCalledWith('No transforms performed');
  });

  it('should call consola.error when no transforms are made', () => {
    consola.mockTypes(typeName => typeName === 'error' && jest.fn());
    const framework = 'foo';
    const message = `[transform-configs] ${framework} Framework not supported\nUse babel plugin directly instead`;

    const result = transformConfig('', framework, {});

    expect(consola.error).toBeCalledWith(message);
  });

  it('should call consola.error when no transforms are made', () => {
    consola.mockTypes(typeName => typeName === 'error' && jest.fn());
    const framework = '__proto__';
    const message = `[transform-configs] ${framework} Framework not supported\nUse babel plugin directly instead`;

    const result = transformConfig('', framework, {});

    expect(consola.error).toBeCalledWith(message);
  });
});

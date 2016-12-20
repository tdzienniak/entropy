const test = require('tape');
const is = require('check-types');
const ComponentStore = require('../build/ComponentStore').default;

test('should register component', (t) => {
  const cs = ComponentStore();

  const type = 'MyAwesomeComponent';

  cs.register({
    type,
  });

  t.equal(typeof cs._factories[type], 'function', 'should create factory function');
  t.equal(cs._greatestComponentId, 1, 'should assign new ID for component');
  t.deepEqual(cs._componentsIdsMap, {
    [type]: 0,
  }, 'should create map entry');

  t.end();
});

test('should create component (with default onCreate)', (t) => {
  const cs = ComponentStore();
  const type = 'MyAwesomeComponent';

  cs.register({
    type,
  });

  const c = cs.create(type, {
    foo: 'bar',
  });

  t.deepEqual(c, {
    _type: type,
    _propName: 'myAwesomeComponent',
    _id: 0,
    foo: 'bar',
  }, 'should create valid component');
  t.equal(c.getType(), type, 'should get valid type');

  t.end();
});

test('should create component (with custom onCreate)', t => {
    const cs = ComponentStore();
  const type = 'MyAwesomeComponent';

  cs.register({
    type,
    onCreate(foo, bar) {
      this.foo = foo;
      this.bar = bar;
    },
  });

  const c = cs.create(type, 'foo', 'bar');

  t.deepEqual(c, {
    _type: type,
    _propName: 'myAwesomeComponent',
    _id: 0,
    foo: 'foo',
    bar: 'bar',
  }, 'should create valid component');

  t.end();
});

test('should free and reuse component', (t) => {
  const cs = ComponentStore();
  const type = 'MyAwesomeComponent';

  cs.register({
    type,
  });

  const c = cs.create(type, {
    foo: 'bar',
  });

  t.deepEqual(c.foo, 'bar', 'should create valid component');

  cs.free(c);
  const cReused = cs.create(type, {
    foo: 'baz',
  });

  t.deepEqual(c.foo, 'baz', 'should create valid component (from pool)');
  t.equal(c, cReused, 'reused component should be strict equal to freed');

  t.end();
});
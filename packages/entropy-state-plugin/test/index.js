const test = require('tape');
const State = require('../build/index');

const delay = time => new Promise(resolve => setTimeout(resolve, time));

test('should maintain order when transitioning between states (async)', t => {
  t.plan(2);

  const m = State();
  const transitionOrder = [];

  m.define({
    name: 'Test 1',
    onInit() {
      transitionOrder.push('init 1');

      return delay(1);
    },
    onEnter() {
      transitionOrder.push('enter 1')

      return delay(1);
    },
    onExit() {
      transitionOrder.push('exit 1')

      return delay(1);
    },
    onTransitionFrom() {
      transitionOrder.push('from 1')

      return delay(1);
    }
  });

  m.define({
    name: 'Test 2',
    onInit() {
      transitionOrder.push('init 2');

      return delay(1);
    },
    onEnter() {
      transitionOrder.push('enter 2')

      return delay(1);
    },
    onExit() {
      transitionOrder.push('exit 2')

      return delay(1);
    },
    onTransitionFrom() {
      transitionOrder.push('from 2')

      return delay(1);
    }
  });

  m.change('Test 1').then(() => m.change('Test 2')).then(() => m.change('Test 1')).then(() => {
    t.equals(transitionOrder.join(), [
      'init 1',
      'from 1',
      'enter 1',
      'exit 1',
      'init 2',
      'from 2',
      'enter 2',
      'exit 2',
      'from 1',
      'enter 1',
    ].join(), 'should maintain order');

    t.equals(m._currentTransition, null, 'should clean up current transition');
  });
})

test('should maintain order when transitioning between states (sync)', t => {
  t.plan(2);

  const m = State();
  const transitionOrder = [];

  m.define({
    name: 'Test 1',
    onInit() {
      transitionOrder.push('init 1');
    },
    onEnter() {
      transitionOrder.push('enter 1')
    },
    onExit() {
      transitionOrder.push('exit 1')
    },
    onTransitionFrom() {
      transitionOrder.push('from 1')
    }
  });

  m.define({
    name: 'Test 2',
    onInit() {
      transitionOrder.push('init 2');
    },
    onEnter() {
      transitionOrder.push('enter 2')
    },
    onExit() {
      transitionOrder.push('exit 2')
    },
    onTransitionFrom() {
      transitionOrder.push('from 2')
    }
  });

  m.change('Test 1').then(() => m.change('Test 2')).then(() => m.change('Test 1')).then(() => {
    t.equals(transitionOrder.join(), [
      'init 1',
      'from 1',
      'enter 1',
      'exit 1',
      'init 2',
      'from 2',
      'enter 2',
      'exit 2',
      'from 1',
      'enter 1',
    ].join(), 'should maintain order');

    t.equals(m._currentTransition, null, 'should clean up current transition');
  });
})




import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { createPaginationMachine } from '~machine';

const notification = 200;
const machine = createPaginationMachine({}, { notification });

const { guard } = interpret(machine);

describe.concurrent('#1: itemsNotEmpty', () => {
  const [acceptance, _test] = guard('itemsNotEmpty');

  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Items is undefined => false', () => {
    _test({ expected: false, context: {} });
  });

  test.concurrent('#2: Items is empty => false', () => {
    _test({ expected: false, context: { items: {} } });
  });

  test.concurrent('#3: All items are empty => false', () => {
    _test({
      expected: false,
      context: {
        items: {
          6: undefined,
          7: undefined,
        },
      },
    });
  });

  test.concurrent('Items is not empty => true', () => {
    _test({ expected: true, context: { items: { 6: undefined, 7: {} } } });
  });
});

describe.concurrent('#2: noCurrentPage', () => {
  const [acceptance, _test] = guard('noCurrentPage');

  test.concurrent('#0:Function is defined', acceptance);

  test.concurrent('#1: CurrenPage is undefined => true', () => {
    _test({ expected: true, context: {} });
  });

  test.concurrent('#2: CurrenPage is defined => false', () => {
    _test({
      expected: false,
      context: { items: { 6: {}, 7: {} }, currentPage: 4 },
    });
  });
});

describe.concurrent('#3: queryIsStarted', () => {
  const [acceptance, _test] = guard('queryIsStarted');

  test.concurrent('#0:Function is defined', acceptance);

  test.concurrent('#1: Timer is stopped => false', () => {
    _test({ expected: false });
  });

  test.concurrent('#2: Timer is started => true', () => {
    _test({
      expected: true,
      context: { config: { queryTimer: Date.now() } },
    });
  });
});

describe.concurrent('#4: queryTakesTooLong', () => {
  const [acceptance, _test] = guard('queryTakesTooLong');

  test.concurrent('#0:Function is defined', acceptance);

  test.concurrent('#1: Timer is undefined => false', () => {
    _test({ expected: false });
  });

  test.concurrent('#2: It takes too long => false', () => {
    const queryTimer = Date.now() - notification * 5;
    _test({
      expected: true,
      context: { config: { queryTimer } },
    });
  });

  test.concurrent('#3: Right in time => true', () => {
    const queryTimer = Date.now() - notification / 2;
    _test({
      expected: false,
      context: { config: { queryTimer } },
    });
  });
});

import { interpret } from '@bemedev/x-test';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { Context, Events } from 'src/types';
import { describe, expect, test } from 'vitest';
import { createPaginationMachine } from '~machine';

//TODO : Acceptance for actions
const notification = 2000;
const machine = createPaginationMachine({}, { notification });

const { assign, sendAction, action } = interpret(machine);

/** Default context */
const context: Context = {};

describe.concurrent('setUser', () => {
  const [acceptance, _test] = assign('setUser');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Set user', () => {
    const user = { id: 'John' };
    const expected = { user };
    const event = { data: user } as any;
    _test({ expected, event, context });
  });
});

describe.concurrent('escalateUserError', () => {
  const [acceptance, _test] = sendAction('escalateUserError');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Escalate user error', () => {
    const expected = { data: 'USER_ERROR', type: 'xstate.error' };
    _test({ expected, context });
  });
});

describe.concurrent('SetConfig', () => {
  const [acceptance, _test] = action({ action: 'setConfig' });
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Set config', () => {
    _test({ expected: undefined });
  });
});

describe.concurrent('escalateConfigError', () => {
  const [acceptance, _test] = sendAction('escalateConfigError');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Escalate config error', () => {
    const expected = { data: 'CONFIG_ERROR', type: 'xstate.error' };
    _test({ expected, context });
  });
});

describe.concurrent('setName', () => {
  const [acceptance, _test] = assign('setName');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Set name', () => {
    const expected = { name: 'Paginate' };
    const event = { data: expected } as any;
    _test({ expected, event, context });
  });
});

describe.concurrent('escalateTimeError', () => {
  const [acceptance, _test] = sendAction('escalateTimeError');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Escalate time error', () => {
    const expected = { data: 'TIME_ERROR', type: 'xstate.error' };
    _test({ expected, context });
  });
});

describe.concurrent('setDefaultPageSize', () => {
  const [acceptance, _expect] = assign('setDefaultPageSize');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Delete/close the query timer', () => {
    const expected: Context = { pageSize: DEFAULT_PAGE_SIZE };
    _expect({ expected, context });
  });
});

describe.concurrent('assignItems', () => {
  const [acceptance, _expect] = assign('assignItems');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Assifn incoming items', () => {
    const items = [
      { __position__: 0 },
      { __position__: 4 },
      { __position__: 6 },
      { __position__: 7 },
      { __position__: 10 },
    ];
    const expected: Context = {
      items,
    };
    const event: Events = {
      type: 'RECEIVE',
      data: {
        items,
      },
    };

    _expect({ expected, event, context });
  });
});

describe.concurrent('assignAllTotal', () => {
  const [acceptance, _expect] = assign('assignAllTotal');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Assign incoming allTotal', () => {
    const allTotal = 60;
    const expected: Context = {
      allTotal,
    };
    const event: Events = {
      type: 'RECEIVE',
      data: {
        allTotal,
      },
    };

    _expect({ expected, event, context });
  });
});

describe.concurrent('setCurrentPage', () => {
  const [acceptance, _expect] = assign('setCurrentPage');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Assign incoming currentPage', () => {
    const currentPage = 6;
    const expected: Context = {
      currentPage,
    };
    const event: Events = {
      type: 'RECEIVE',
      data: {
        currentPage,
      },
    };

    _expect({ expected, event, context });
  });

  test.concurrent('#2: Incoming currentPage is undefined', () => {
    const expected: Context = {
      currentPage: 0,
    };
    const event: Events = {
      type: 'RECEIVE',
      data: {},
    };

    _expect({ expected, event, context });
  });
});

describe.concurrent('send/notifyTakesTooLong', () => {
  const [acceptance, _test] = sendAction('send/notifyTakesTooLong');
  test.concurrent('#0: Acceptance', acceptance);

  test.concurrent('#1: Escalate user error', () => {
    const context: Context = { name: 'PAGIN' };
    const expected = { type: `${context.name}/TAKES_TOO_LONG` };
    _test({ expected, context });
  });
});

describe.concurrent('closeQueryTimer', () => {
  const [acceptance, _expect] = assign('closeQueryTimer');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Delete/close the query timer', () => {
    const expected = { config: { queryTimer: undefined } };
    const context = { config: { queryTimer: 1 } };
    _expect({ expected, context });
  });
});

describe.concurrent('startQueryTimer', () => {
  const [acceptance, , func] = action({
    action: 'startQueryTimer',
    accessFunction: action => action?.assignment,
  });
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Start the query timer', () => {
    const now = Date.now();
    const min = now - 100;
    const max = now + 100;
    // eslint-disable-next-line @typescript-eslint/ban-types
    const expected = (func as Function)(context)?.config.queryTimer;
    expect(expected).toBeGreaterThanOrEqual(min);
    expect(expected).toBeLessThanOrEqual(max);
  });
});

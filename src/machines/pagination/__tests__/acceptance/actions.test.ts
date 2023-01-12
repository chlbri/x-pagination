import { interpret } from '@bemedev/x-test';
import { nanoid } from 'nanoid';
import { describe, expect, test } from 'vitest';
import { DEFAULT_PAGE_SIZE } from '~pagination/constants';
import { PaginationMachine } from '~pagination/machine';
import {
  Context,
  Events,
  Item,
  Items,
  ItemWithPosition,
} from '~pagination/types';

//TODO : Acceptance for actions

const { assign, sendAction, action } = interpret(PaginationMachine);

/** Default context */
const context: Context = {};

describe.concurrent('setDefaultPageSize', () => {
  const [acceptance, _test] = assign('setDefaultPageSize');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Timers are undefined', () => {
    _test({
      expected: {
        pageSize: DEFAULT_PAGE_SIZE,
      },
      context,
    });
  });
});

describe.concurrent('setName', () => {
  const [acceptance, _test] = assign('setName');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Timers are undefined', () => {
    const name = 'PAGIN';
    const expected: Context = {
      name,
    };
    const event = {
      data: { name },
    } as any;
    _test({ expected, event, context });
  });
});

describe.concurrent('assignItems', () => {
  const [acceptance, _expect] = assign('assignItems');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Assign incoming items', () => {
    const items: ItemWithPosition[] = [
      { __position__: 0, item: { id: nanoid(), name: 'zero' } },
      { __position__: 4, item: { id: nanoid(), name: 'four' } },
      { __position__: 6, item: { id: nanoid(), name: 'six' } },
      { __position__: 7, item: { id: nanoid(), name: 'seven' } },
      { __position__: 10, item: { id: nanoid(), name: 'ten' } },
    ];

    const expected: Context = {
      items: {
        0: items[0].item,
        4: items[1].item,
        6: items[2].item,
        7: items[3].item,
        10: items[4].item,
      },
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
  test.concurrent('#0: Acceptance', () => acceptance());

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
  test.concurrent('#0: Acceptance', () => acceptance());

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

describe.concurrent('setEmptyPages', () => {
  const [acceptance, _expect] = assign('setEmptyPages');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Set empty pages', () => {
    const expected: Context = {
      pages: {},
    };

    _expect({ expected, context });
  });
});

describe.concurrent('send/notifyTakesTooLong', () => {
  const [acceptance, _test] = sendAction('send/notifyTakesTooLong');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Escalate user error', () => {
    const context: Context = { name: 'PAGIN' };
    const expected = { type: `${context.name}/TAKES_TOO_LONG` };
    _test({ expected, context });
  });
});

describe.concurrent('constructPages', () => {
  const [acceptance, _expect] = assign('constructPages');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1', () => {
    const items: Items = {
      0: { name: 'zero' },
      4: { name: 'four' },
      6: { name: 'six' },
      7: { name: 'seven' },
      10: { name: 'ten' },
    };
    const pageSize = 5;
    const expected: Context = {
      pages: {
        0: [{ name: 'zero' }, { name: 'four' }],
        1: [{ name: 'six' }, { name: 'seven' }],
        2: [{ name: 'ten' }],
      },
      pageSize,
      items,
    };
    const context: Context = {
      items,
      pageSize,
    };

    _expect({ expected, context });
  });

  test.concurrent('#2', () => {
    const items: Items = {
      70: { name: 'seventy' },
      84: { name: 'eighty-four' },
      63: { name: 'sixty-three' },
      72: { name: 'seventy-two' },
    };
    const pageSize = 10;
    const expected: Context = {
      pages: {
        7: [{ name: 'seventy' }, { name: 'seventy-two' }],
        6: [{ name: 'sixty-three' }],
        8: [{ name: 'eighty-four' }],
      },
      pageSize,
      items,
    };
    const context: Context = {
      items,
      pageSize,
    };

    _expect({ expected, context });
  });
});

describe.concurrent('constructIds', () => {
  const [acceptance, _expect] = assign('constructIds');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: contruct the ids', () => {
    const pages = {
      7: [{ id: 'seventy', annny: 'any' }, { id: 'seventy-two' }],
      6: [{ id: 'sixty-three' }],
      8: [{ id: 'eighty-four' }],
    };
    const context: Context = {
      pages,
    };

    const expected: Context = {
      pages,
      ids: {
        7: ['seventy', 'seventy-two'],
        6: ['sixty-three'],
        8: ['eighty-four'],
      },
    };

    _expect({ expected, context });
  });
});

describe.concurrent('closeQueryTimer', () => {
  const [acceptance, _expect] = assign('closeQueryTimer');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Delete/close the query timer', () => {
    const expected: Context = { timers: { queryTimer: undefined } };
    const context: Context = { timers: { queryTimer: 1 } };
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
    const expected = (func as Function)(context)?.timers.queryTimer;
    expect(expected).toBeGreaterThanOrEqual(min);
    expect(expected).toBeLessThanOrEqual(max);
  });
});

describe.concurrent('setTotal', () => {
  const [acceptance, _test] = assign('setTotal');
  test.concurrent('#0: Acceptance', () => acceptance());

  const items = {
    0: { name: 'zero', id: nanoid() },
    4: { name: 'four', id: nanoid() },
    6: { name: 'six', id: nanoid() },
    7: { name: 'seven', id: nanoid() },
    10: { name: 'ten', id: nanoid() },
  };

  const context = { items };

  test.concurrent('#1: setTotal', () => {
    _test({ expected: { items, total: 5 }, context });
  });
});

describe.concurrent('setTotalPages', () => {
  const [acceptance, _test] = assign('setTotalPages');
  test.concurrent('#0: Acceptance', () => acceptance());

  const ids = {
    0: ['zero'],
    1: ['four', 'five'],
    2: ['six', 'twelve'],
    3: ['seven'],
    4: ['ten', 'eleven'],
  };

  const context = { ids };

  test.concurrent('#1: set the total pages number', () => {
    _test({ expected: { ids, totalPages: 5 }, context });
  });
});

describe.concurrent('setDefaultPage', () => {
  const [acceptance, _test] = assign('setDefaultPage');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: set page to 0', () => {
    _test({ expected: { currentPage: 0 }, context });
  });
});

describe.concurrent('setCurrentItems', () => {
  const [acceptance, _test] = assign('setCurrentItems');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Construct the current displayed items', () => {
    const pages = {
      7: [{ id: 'seventy', annny: 'any' }, { id: 'seventy-two' }],
      6: [{ id: 'sixty-three' }],
      8: [{ id: 'eighty-four' }],
    };

    const currentPage = 7;
    const context: Context = { pages, currentPage };

    const expected: Context = {
      pages,
      currentItems: [
        { id: 'seventy', annny: 'any' },
        { id: 'seventy-two' },
      ],
      currentPage,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/currentItems', () => {
  const [acceptance, _test] = sendAction('send/currentItems');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const currentItems: Item[] = [
      { id: 'seventy', annny: 'any' },
      { id: 'seventy-two' },
    ];

    const name = 'PAGIN';

    const context: Context = { currentItems, name };

    const expected = {
      type: `${name}/CURRENT_ITEMS`,
      currentItems,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/next', () => {
  const [acceptance, _test] = sendAction('send/next');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const name = 'PAGIN';

    const context: Context = { name };

    const expected = {
      type: `${name}/NEXT`,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/previous', () => {
  const [acceptance, _test] = sendAction('send/previous');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const name = 'PAGIN';

    const context: Context = { name };

    const expected = {
      type: `${name}/PREVIOUS`,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/first', () => {
  const [acceptance, _test] = sendAction('send/first');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const name = 'PAGIN';

    const context: Context = { name };

    const expected = {
      type: `${name}/FIRST`,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/last', () => {
  const [acceptance, _test] = sendAction('send/last');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const name = 'PAGIN';

    const context: Context = { name };

    const expected = {
      type: `${name}/LAST`,
    };

    _test({
      expected,
      context,
    });
  });
});

describe.concurrent('send/goto', () => {
  const [acceptance, _test] = sendAction('send/goto');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Send the current items to parent', () => {
    const name = 'PAGIN';
    const context: Context = { name };
    const data = {
      page: 8,
    };
    const event: Events = {
      type: 'SEND/GOTO',
      data,
    };

    const expected = {
      type: `${name}/GOTO`,
      data,
    };

    _test({
      expected,
      context,
      event,
    });
  });
});

describe.concurrent('setPageSize', () => {
  const [acceptance, _test] = assign('setPageSize');
  test.concurrent('#0: Acceptance', () => acceptance());

  test.concurrent('#1: Construct the current displayed items', () => {
    const pageSize = 13;

    const event: Events = {
      type: 'SET_PAGE_SIZE',
      data: { pageSize },
    };

    const expected: Context = {
      pageSize,
    };

    _test({
      expected,
      context,
      event,
    });
  });
});

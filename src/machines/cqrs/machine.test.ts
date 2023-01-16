import { ALWAYS_TIME } from '@bemedev/x-test';
import { advanceInTime, useFakeTime } from 'src/fixtures';
import { Item } from 'src/types';
import { describe, test } from 'vitest';
import {
  DEFAULT_THROTLLE_TIME,
  DEFAULT_TIME_TO_REFECTH,
} from './constants';
import {
  mockServiceCreate,
  mockServiceDelete,
  mockServiceRead,
  mockServiceUpdate,
  usePrepareCqrsMachine,
} from './fixtures';
import { Cache } from './types';

useFakeTime();

const database: Item[] = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
  { id: '3', name: 'Jack' },
  { id: '4', name: 'Jill' },
  { id: '5', name: 'Jenny' },
  { id: '6', name: 'John', age: 30 },
];

const {
  matches,
  context,
  config,
  create,
  readMore,
  read,
  refetch,
  update,
  _delete,
  rinit,
} = usePrepareCqrsMachine(
  //@ts-ignore for testing
  {
    services: {
      read: mockServiceRead(database),
      create: mockServiceCreate(database),
      update: mockServiceUpdate(database),
      delete: mockServiceDelete(database),
    },
  },
);

test('#01: The state is in "config"', () => {
  matches('config');
});

test('#02: Set the config to 3 tries', () => {
  config({
    data: {},
  });
});

test('#03: The state is in "busy"', () => {
  matches('busy');
});

test('#04: Advance by "THROTTLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#05: The state is in "idle"', () => {
  matches('idle');
});

test('#06: Send "READ" event', () => {
  readMore({ data: { query: { id: '1' }, offset: 5 } });
});

test('#07: No state changes, caches is not defined !', () => {
  matches('idle');
});

test('#08: Query is not set', () => {
  context(undefined, context => context.currentQuery);
});

test('#09: Send "READ" event', () => {
  read({ data: { query: {} } });
});

test('#10: caches is undefined', () => {
  context(undefined, context => context.caches);
});

test('#11: the currentQuery is set', () => {
  context({}, context => context.currentQuery?.query);
});

describe('#12: It try to get cache', () => {
  test('#01: Check for query', () => {
    matches('cache.query.check');
  });

  test('#02: Advance by "ALWAYS_TIME"', () => {
    advanceInTime(ALWAYS_TIME);
  });

  test('#03: No cache, call read service', () => {
    matches('busy');
  });
});

test('#13: Items are set', () => {
  context(6, context => context.items?.length);
});

test('#14: Caches are set', () => {
  const key = JSON.stringify({ query: {} });
  const ids = ['1', '2', '3', '4', '5', '6'];
  context(
    [
      {
        key,
        ids,
      },
    ],
    ({ caches }) => caches,
  );
});

test('#15: Advance by "THROTTLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#16: The state is in "idle"', () => {
  matches('idle');
});

test('#17: Send "CREATE" Event', () => {
  create({ data: { name: 'BRI Lévi' } });
});

test('#18: The state is in "busy"', () => {
  matches('busy');
});

test('#19: Items are set', () => {
  context(7, context => context.items?.length);
});

test('#20: Caches is updated by createdID', () => {
  const key = JSON.stringify({ query: {} });
  const ids = ['1', '2', '3', '4', '5', '6', '7'];
  context(
    [
      {
        key,
        ids,
      },
    ],
    ({ caches }) => caches,
  );
});

test('#21: Send "READ" all items from database', () => {
  read({ data: { query: {} } });
});

test('#22: Nothing changes', () => {
  matches('busy');
});

test('#23: Advance by "THROTTLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#24: Send "READ" all items from database', () => {
  read({ data: { query: {} } });
});

describe('#25: It try to get cache', () => {
  test('#01: Check for query', () => {
    matches('cache.query.check');
  });

  test('#02: Advance by "THROTTLE_TIME"', () => {
    advanceInTime(ALWAYS_TIME);
  });

  test('#03: Query is cached', () => {
    matches('cache.query.items');
  });

  test('#04: cachedIds are defined', () => {
    const key = JSON.stringify({ query: {} });
    const ids = ['1', '2', '3', '4', '5', '6', '7'];
    context(
      [
        {
          key,
          ids,
        },
      ],
      ({ caches }) => caches,
    );
  });

  test('#05: Advance by "ALWAYS_TIME"', () => {
    advanceInTime(ALWAYS_TIME);
  });
});

test('#26: State is in "idle"', () => {
  matches('idle');
});

test('#27: Wait to automatically refetch', () => {
  advanceInTime(DEFAULT_TIME_TO_REFECTH);
});

test('#28: State is in "busy"', () => {
  matches('busy');
});

test('#29: Caches has 2 same entries', () => {
  const key = JSON.stringify({ query: {} });
  const ids = ['1', '2', '3', '4', '5', '6', '7'];
  context(
    [
      {
        key,
        ids,
      },
      {
        key,
        ids,
      },
    ],
    ({ caches }) => caches,
  );
});

test('#30: Advance by "THROTTLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#31: State is in "idle"', () => {
  matches('idle');
});

test('#32: Send a "REFETCH"', () => {
  refetch();
});

test('#33: State is in "busy"', () => {
  matches('busy');
});

test('#34: Caches has 3 same entries', () => {
  const key = JSON.stringify({ query: {} });
  const ids = ['1', '2', '3', '4', '5', '6', '7'];
  const cache: Cache = { key, ids };

  context([cache, cache, cache], ({ caches }) => caches);
});

test('#35: Advance by "THROTTLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#36: State is in "idle"', () => {
  matches('idle');
});

test('#37: Delete last item', () => {
  _delete({ data: '7' });
});

test('#38: State is in "busy"', () => {
  matches('busy');
});

test('#39: Items are updated', () => {
  context(6, context => context.items?.length);
});

test('#40: Advance by "THROTLLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#41: State is in "idle"', () => {
  matches('idle');
});

test('#42: Update an item', () => {
  update({ data: { id: '1', update: { name: 'BRI Keren' } } });
});

test('#43: State is in "busy"', () => {
  matches('busy');
});

test('#44: Length of items remains the same', () => {
  context(6, context => context.items?.length);
});

test('#45: The item with id "1" has a different name "Bri Keren"', () => {
  context(
    { id: '1', name: 'BRI Keren' },
    ({ items }) => items?.find(item => item.item.id === '1')?.item,
  );
});

test('#46: RINIT', () => {
  rinit();
});

test('#47: The state is in "config"', () => {
  matches('config');
});

test('#48: Set the config to 3 tries', () => {
  config({
    data: {
      tries: 3,
    },
  });
});

test('#49: State is in "busy"', () => {
  matches('busy');
});

test('#50: Advance by "THROTLLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#51: State is in "idle"', () => {
  matches('idle');
});

test('#52: send "READ_MORE"', () => {
  readMore({ data: { query: { name: 'BRI Keren' } } });
});

describe('#54: Try to get cache', () => {
  test('#01: Check for query', () => {
    matches('cache.more.check');
  });

  test('#02: Advance by "ALWAYS_TIME"', () => {
    advanceInTime(ALWAYS_TIME);
  });

  test('#03: Query is cached', () => {
    matches('cache.more.items');
  });

  test('#04: Advance by "ALWAYS_TIME"', () => {
    advanceInTime(ALWAYS_TIME);
  });
});

test('#55: State is in "busy"', () => {
  matches('busy');
});

test('#56: Advance by "THROTLLE_TIME"', () => {
  advanceInTime(DEFAULT_THROTLLE_TIME);
});

test('#57: State is in "idle"', () => {
  matches('idle');
});

// TODO: Tests errors

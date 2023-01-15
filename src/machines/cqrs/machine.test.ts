import { ALWAYS_TIME } from '@bemedev/x-test';
import { advanceInTime, useFakeTime } from 'src/fixtures';
import { Item } from 'src/types';
import { describe, test } from 'vitest';
import { DEFAULT_THROTLLE_TIME } from './constants';
import { mockServiceRead, usePrepareCqrsMachine } from './fixtures';
import { Query } from './types';

useFakeTime();

const database: Item[] = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
  { id: '3', name: 'Jack' },
  { id: '4', name: 'Jill' },
  { id: '5', name: 'Jenny' },
  { id: '7', name: 'John', age: 30 },
];

describe('Workflow #1: Read', () => {
  const { matches, context, config, read } = usePrepareCqrsMachine({
    //@ts-ignore for testing
    services: {
      read: () => Promise.resolve({ items: database, offset: 0 }),
    },
  });

  test('#01: The state is in "config"', () => {
    matches('config');
  });

  test('#02: Set the config to 3 tries', () => {
    config({ data: { tries: 3 } });
  });

  test('#03: tries is set to 3', () => {
    context(3, context => context.config?.tries);
  });

  test('#04: The state is in "busy"', () => {
    matches('busy');
  });

  test('#05: Advance by "THROTTLE_TIME"', () => {
    advanceInTime(DEFAULT_THROTLLE_TIME);
  });

  test('#06: The state is in "idle"', () => {
    matches('idle');
  });

  test('#07: caches is undefined', () => {
    context(undefined, context => context.caches);
  });

  test('#08: Send "READ" event', () => {
    read({ data: { query: { id: '1' } } });
  });

  test('#09: caches is undefined', () => {
    context(undefined, context => context.caches);
  });

  test('#10: the currentQuery is set', () => {
    context({ id: '1' }, context => context.currentQuery?.query);
  });

  describe('#11: It try to get cache', () => {
    test('#01: Check for query', () => {
      matches('cache.query.check');
    });

    test('#02: Advance by "THROTTLE_TIME"', () => {
      advanceInTime(ALWAYS_TIME);
    });

    test('#03: No cache, call read service', () => {
      matches('busy');
    });
  });

  test('#12: Items are set', () => {
    context(6, context => context.items?.length);
  });

  test('#12: Advance by "THROTTLE_TIME"', () => {
    advanceInTime(DEFAULT_THROTLLE_TIME);
  });

  test('#13: The state is in "idle"', () => {
    matches('idle');
  });
});

describe('Workflow #2: Read more, no cache', () => {
  const { matches, context, config, readMore } = usePrepareCqrsMachine();

  test('#01: The state is in "config"', () => {
    matches('config');
  });

  test('#02: Set the config to 3 tries', () => {
    config({ data: {} });
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
    readMore({ data: { query: { id: '1' } } });
  });

  test('#07: No state changes, caches is not defined !', () => {
    matches('idle');
  });

  test('#08: Query is not set', () => {
    context(undefined, context => context.currentQuery);
  });
});

describe('Workflow #3: Read more, has cache, and query is cached, but not items', () => {
  const queries: Query[] = [
    {
      query: {
        name: 'John',
      },
    },
    {
      query: {
        name: 'Jane',
      },
    },
    {
      query: {
        name: 'John',
      },
      offset: 1,
    },
  ];

  const ids = ['1', '2'];
  const ids3 = ['1', '7'];
  const { matches, context, config, readMore } = usePrepareCqrsMachine(
    {
      //@ts-ignore for testing
      services: {
        read: mockServiceRead(database),
      },
    },
    {
      caches: [
        {
          key: JSON.stringify(queries[0]),
          ids,
        },
        {
          key: JSON.stringify(queries[1]),
          ids,
        },
        {
          key: JSON.stringify(queries[2]),
          ids: ids3,
        },
      ],
    },
  );

  test('#01: The state is in "config"', () => {
    matches('config');
  });

  test('#02: Set the config to 3 tries', () => {
    config({ data: {} });
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

  test('#06: Send "READ_MORE" event', () => {
    readMore({ data: queries[2] });
  });

  describe('#07: Try to get Cache', () => {
    test('#01: The state is in "cache.query.check"', () => {
      matches('cache.more.check');
    });

    test('#02: Query is set', () => {
      context(queries[2], context => context.currentQuery);
    });

    test('#03: Advance by ALWAYS_TIME', () => advanceInTime(ALWAYS_TIME));

    test('#04: cachedIds are defined', () => {
      context(ids3, context => context.cachedIds);
    });

    test('#05: The state is in "cache.more.items"', () => {
      matches('cache.more.items');
    });

    test('#06: Items are not set', () => {
      context(undefined, context => context.items?.length);
    });

    test('#07: Advance by ALWAYS_TIME', () => advanceInTime(ALWAYS_TIME));
  });

  test('#08: The state is in "busy"', () => {
    matches('busy');
  });

  test('#7: Items are set', () => {
    const expected = [
      {
        __position__: 0,
        item: {
          id: '7',
          name: 'John',
          age: 30,
        },
      },
    ];
    context(expected, context => context.items);
  });
});

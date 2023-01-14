import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { CqrsMachine } from '~cqrs/machine';
import { Context } from '~cqrs/types';
import { Item } from '~pagination/types';

const { sendAction, action, assign } = interpret(CqrsMachine);
// ^?

const context: Context = {};

describe('setItems', () => {
  const [acceptance, _expect] = assign('setItems');
  test('#0: Acceptance', () => {
    acceptance();
  });

  test('#1: It assigns data comming from database', () => {
    const items: Item[] = [
      {
        id: 'id',
        name: 'name',
      },

      {
        id: 'id2',
        name: 'name2',
      },
    ];
    const event = { data: { items } } as any;

    const expected = {
      items: [
        {
          __position__: 0,
          item: {
            id: 'id',
            name: 'name',
          },
        },
        {
          __position__: 1,
          item: {
            id: 'id2',
            name: 'name2',
          },
        },
      ],
    };

    _expect({ context, event, expected });
  });
});

describe('setCurrentQueryToPrevious', () => {
  const [acceptance, _expect] = assign('setCurrentQueryToPrevious');
  test('#0: Acceptance', () => {
    acceptance();
  });

  test('#1: It sets the current query to previous query in cache', () => {
    const previousQuery = { name: 'name1' };
    const currentQuery = { name: 'name2' };

    const caches: Context['caches'] = [
      {
        key: JSON.stringify(previousQuery),
        ids: ['id1', 'id2'],
      },
      {
        key: JSON.stringify(currentQuery),
        ids: ['id3', 'id4'],
      },
    ];

    const context = {
      caches,
      currentQuery,
    };

    const expected: Context = {
      currentQuery: previousQuery,
      caches,
    };

    _expect({ context, expected });
  });
});

describe('resetCache', () => {
  const [acceptance, _expect] = assign('resetCache');
  test('#0: Acceptance', () => {
    acceptance();
  });

  test('#1: It resets the cache', () => {
    const context = {
      caches: [
        {
          key: 'key1',
          ids: ['id1', 'id2'],
        },
        {
          key: 'key2',
          ids: ['id3', 'id4'],
        },
      ],
    };

    const expected: Context = {
      caches: undefined,
    };

    _expect({ context, expected });
  });
});

describe('addQueryToCache', () => {
  const [acceptance, _expect] = assign('addQueryToCache');
  test('#0: Acceptance', () => {
    acceptance();
  });

  test('#1: It adds the current query to empty cache', () => {
    const currentQuery = { name: 'name' };
    const items: Context['items'] = [
      {
        __position__: 0,
        item: { id: 'id', name: 'name' },
      },
    ];

    const context = {
      currentQuery,
      items,
    };

    const expected: Context = {
      currentQuery,
      items,
      caches: [
        {
          key: JSON.stringify(currentQuery),
          ids: ['id'],
        },
      ],
    };

    _expect({ context, expected });
  });

  test('#2: It adds the current query to a full cache', () => {
    const currentQuery = { name: 'name' };
    const caches = [
      {
        key: 'any',
        ids: ['id1'],
      },
      {
        key: 'any2',
        ids: ['id2'],
      },
    ];

    const items: Context['items'] = [
      {
        __position__: 0,
        item: { id: 'id3', name: 'name' },
      },
    ];

    const context = {
      currentQuery,
      caches,
      items,
    };

    const expected: Context = {
      currentQuery,
      items,
      caches: [
        ...caches,
        {
          key: JSON.stringify(currentQuery),
          ids: ['id3'],
        },
      ],
    };

    _expect({ context, expected });
  });
});

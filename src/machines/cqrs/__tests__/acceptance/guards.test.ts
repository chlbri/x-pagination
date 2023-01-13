import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { CqrsMachine } from '~cqrs/machine';
import { Context } from '~cqrs/types';

const { guard } = interpret(CqrsMachine);

describe('triesNotReached', () => {
  const [acceptance, _expect] = guard('triesNotReached');

  test('#0: acceptance', () => {
    acceptance();
  });

  test('#1: Tries > attempts => true', () => {
    const context: Context = { config: { attempts: 4, tries: 10 } };
    const expected = true;
    _expect({ context, expected });
  });

  test('#2: Tries == attempts => true', () => {
    const context: Context = { config: { attempts: 10, tries: 10 } };
    const expected = true;
    _expect({ context, expected });
  });

  test('#3: Tries < attempts => false', () => {
    const context: Context = { config: { attempts: 11, tries: 10 } };
    const expected = false;
    _expect({ context, expected });
  });
});

describe('queryIsCached', () => {
  const [acceptance, _expect] = guard('queryIsCached');

  test('#0: acceptance', () => {
    acceptance();
  });

  test('#1: query is cached => true', () => {
    const currentQuery = { id: 'id', name: 'name' };
    const context: Context = {
      caches: [{ key: JSON.stringify(currentQuery), ids: ['value'] }],
      currentQuery,
    };
    const expected = true;
    _expect({ context, expected });
  });

  test('#2: query is not cached => false', () => {
    const currentQuery = { id: 'id', name: 'name' };
    const context: Context = {
      caches: [
        { key: 'notcache1', ids: [] },
        { key: 'notcache2', ids: ['id1', 'id87'] },
      ],
      currentQuery,
    };
    const expected = false;
    _expect({ context, expected });
  });
});

describe('itemsAreCached', () => {
  const [acceptance, _expect] = guard('itemsAreCached');

  test('#0: acceptance', () => {
    acceptance();
  });

  test('#1: items are cached => true', () => {
    const cachedIds = ['id exists'];
    const items: Context['items'] = [
      {
        __position__: 0,
        item: { id: 'id exists', name: 'name' },
      },
      {
        __position__: 1,
        item: { id: 'id another', name: 'name' },
      },
    ];
    const context: Context = {
      items,
      cachedIds,
    };

    const expected = true;
    _expect({ context, expected });
  });

  test('#2: Items are not cached => false', () => {
    const cachedIds = ['id not exists'];
    const items: Context['items'] = [
      {
        __position__: 0,
        item: { id: 'id1', name: 'name1' },
      },
      {
        __position__: 1,
        item: { id: 'id2', name: 'name2' },
      },
    ];
    const context: Context = {
      cachedIds,
      items,
    };
    const expected = false;
    _expect({ context, expected });
  });
});

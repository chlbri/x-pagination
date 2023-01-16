/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createLogic, interpret } from '@bemedev/fsf';
import { Cache, Context } from '~cqrs/types';

const logic = createLogic(
  {
    schema: {
      data: {} as Cache[],
      events: {} as Pick<Context, 'caches' | 'currentQuery' | 'items'>,
      context: {} as Pick<Context, 'caches'>,
    },
    context: {},
    initial: 'definition',
    states: {
      definition: {
        always: [
          {
            target: 'creation',
            cond: 'cachesIsUndefined',
          },
          'assign',
        ],
      },
      assign: {
        always: {
          actions: 'assignCaches',
          target: 'push',
        },
      },
      creation: {
        always: {
          target: 'push',
          actions: 'createCache',
        },
      },
      push: {
        always: {
          target: 'final',
          actions: 'push',
        },
      },
      final: {
        data: 'final',
      },
    },
  },
  {
    guards: {
      cachesIsUndefined: (_, { caches }) => !caches || caches.length === 0,
    },
    actions: {
      createCache: context => {
        context.caches = [];
      },
      assignCaches: (context, { caches }) => {
        context.caches = caches;
      },
      push: (context, { currentQuery, items }) => {
        context.caches!.push({
          key: JSON.stringify(currentQuery),
          ids: items!.map(item => item.item.id),
        });
      },
    },
    datas: {
      final: context => context.caches,
    },
  },
);

export const _addQueryToCache = interpret(logic);

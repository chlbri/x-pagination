/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createMachine } from 'xstate';
import { Context } from './types';

export const CqrsMachine = createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
    },
    context: {},

    id: 'cqrs',
    initial: 'config',
    states: {
      busy: {
        after: {
          THROTTLE_TIME: {
            target: '#cqrs.idle',
            actions: [],
            internal: false,
          },
        },
      },
      idle: {
        description: 'Center of commands',
        on: {
          DELETE: {
            target: 'delete',
          },
          UPDATE: {
            target: 'update',
          },
          READ: {
            target: '#cqrs.cache.query',
            actions: 'setQuery',
          },
          CREATE: {
            target: 'create',
          },
          REMOVE: {
            target: 'remove',
          },
          READ_MORE: {
            target: '#cqrs.cache.more',
            actions: 'setQuery',
          },
        },
      },
      create: {
        exit: 'resetCache',
        invoke: {
          src: 'create',
          id: 'create',
          onDone: [
            {
              target: 'busy',
              actions: 'create',
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
      read: {
        invoke: {
          src: 'read',
          id: 'read',
          onDone: [
            {
              target: 'busy',
              actions: 'setItems',
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
      update: {
        exit: 'resetCache',
        invoke: {
          src: 'update',
          id: 'update',
          onDone: [
            {
              target: 'busy',
              actions: 'update',
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
      delete: {
        exit: 'resetCache',
        invoke: {
          src: 'delete',
          id: 'delete',
          onDone: [
            {
              target: 'busy',
              actions: 'delete',
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
      remove: {
        exit: 'resetCache',
        invoke: {
          src: 'remove',
          id: 'remove',
          onDone: [
            {
              target: 'busy',
              actions: 'remove',
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
      cache: {
        states: {
          query: {
            initial: 'check',
            states: {
              check: {
                always: [
                  {
                    target: 'items',
                    cond: 'queryIsCached',
                    actions: 'getCachedIds',
                  },
                  {
                    target: '#cqrs.read',
                  },
                ],
              },
              items: {
                always: [
                  {
                    target: '#cqrs.idle',
                    cond: 'itemsAreCached',
                    actions: 'setCurrentItems',
                  },
                  {
                    target: '#cqrs.read',
                  },
                ],
              },
            },
          },
          more: {
            exit: "'cqrs/removeLastQuery'",
            initial: 'check',
            states: {
              check: {
                exit: ['addToPreviousQuery', 'setCurrentQueryToPrevious'],
                always: [
                  {
                    target: 'items',
                    cond: 'queryIsCached',
                    actions: 'getCachedIds',
                  },
                  {
                    target: '#cqrs.read',
                  },
                ],
              },
              items: {
                always: [
                  {
                    target: '#cqrs.idle',
                    cond: 'itemsAreCached',
                    actions: 'setCurrentItems',
                  },
                  {
                    target: '#cqrs.read',
                  },
                ],
              },
            },
          },
        },
        type: 'parallel',
      },
      error: {
        entry: 'escalateError',
        always: [
          {
            target: 'busy',
            cond: 'triesNotReached',
          },
          {
            actions: 'resetAttempts',
          },
        ],
      },
      config: {
        on: {
          SET_CONFIG: {
            target: 'busy',
            actions: 'setConfig',
          },
        },
      },
    },
  },
  {
    guards: {
      triesNotReached: context => {
        const tries = context.config?.tries!;
        const attempts = context.config?.attempts!;
        return tries >= attempts;
      },

      queryIsCached: context => {
        const caches = context.caches!;
        const currentQuery = context.currentQuery!;

        return caches.some(
          cache => cache.key === JSON.stringify(currentQuery),
        );
      },

      itemsAreCached: context => {
        const ids = context.cachedIds!;
        const items = context.items!;

        return ids.every(id => items.some(({ item }) => item.id === id));
      },
    },
    actions: {},
  },
);

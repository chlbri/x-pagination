/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { assign } from '@xstate/immer';
import { createMachine } from 'xstate';
import { escalate } from 'xstate/lib/actions';
import { assignObject } from '~pagination/helpers';
import {
  DEFAULT_THROTLLE_TIME,
  DEFAULT_TIME_TO_REFECTH,
} from './constants';
import { _addQueryToCache } from './functions';
import { _setCurrentQueryToPrevious } from './functions/setCurrentQueryToPrevious';
import { Context, Events, Services } from './types';

export const CqrsMachine = createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
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
        after: {
          TIME_TO_REFETCH: {
            target: '#cqrs.read',
            actions: [],
            internal: false,
          },
        },
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
          READ_MORE: {
            target: '#cqrs.cache.more',
            cond: 'cacheIsNotEmpty',
            actions: 'setQuery',
          },
          REFETCH: {
            target: 'read',
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
              target: 'read',
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
        description: 'Query the db',
        invoke: {
          src: 'read',
          id: 'read',
          onDone: [
            {
              target: 'busy',
              actions: ['setItems', 'addQueryToCache'],
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
              target: 'read',
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
              target: 'read',
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
                  },
                  {
                    target: '#cqrs.read',
                  },
                ],
              },
            },
          },
          more: {
            initial: 'check',
            states: {
              check: {
                always: [
                  {
                    target: 'items',
                    cond: 'moreIsCached',
                    actions: 'getCachedIds',
                  },
                  {
                    target: '#cqrs.readMore',
                  },
                ],
              },
              items: {
                always: [
                  {
                    target: '#cqrs.idle',
                    cond: 'itemsAreCached',
                  },
                  {
                    target: '#cqrs.readMore',
                  },
                ],
              },
            },
          },
        },
      },
      error: {
        entry: 'incrementAttempts',
        always: [
          {
            target: 'busy',
            cond: 'triesNotReached',
          },
          {
            actions: ['resetAttempts', 'escalateError'],
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
      readMore: {
        invoke: {
          src: 'read',
          id: 'readMore',
          onDone: [
            {
              target: 'busy',
              actions: [
                'setItems',
                'addQueryToCache',
                'addCurrentToPrevious',
                'setCurrentQueryToPrevious',
                'removeLastQuery',
              ],
            },
          ],
          onError: [
            {
              target: 'error',
            },
          ],
        },
      },
    },
    on: {
      RINIT: {
        target: '.config',
      },
    },
  },
  {
    guards: {
      triesNotReached: context => {
        const tries = context.config?.tries!;
        const attempts = context.config?.attempts;
        if (!attempts) return true;
        return attempts >= tries;
      },

      queryIsCached: context => {
        const caches = context.caches;
        if (!caches) return false;
        const currentQuery = context.currentQuery!;
        const key = JSON.stringify(currentQuery);

        return caches.some(cache => cache.key === key);
      },

      itemsAreCached: context => {
        const ids = context.cachedIds!;
        const items = context.items;

        return ids.every(id => items?.some(({ item }) => item.id === id));
      },

      moreIsCached: () => true,

      cacheIsNotEmpty: context => {
        const caches = context.caches;
        return !!caches && caches.length > 0;
      },
    },
    actions: {
      setConfig: assign((context, event) => {
        const tries = event.data.tries;
        context.config = assignObject(context.config, { tries });
      }),

      getCachedIds: assign(context => {
        if (context.cachedIds) return;
        const caches = context.caches!;
        const currentQuery = context.currentQuery!;
        const key = JSON.stringify(currentQuery);
        key; //?
        const cached = caches.find(cache => cache.key === key);
        context.cachedIds = cached?.ids;
      }),

      setItems: assign((context, event) => {
        const len = context.items?.length || 0;
        const rawItems = event.data.items;
        // TODO: fsf it
        // TODO: Push items, not set all
        context.items = event.data.items.map((item, index) => ({
          __position__: index,
          item,
        }));
      }),

      setQuery: (context, { data }) => {
        context.currentQuery = data;
      },

      setCurrentQueryToPrevious: assign(context => {
        const caches = context.caches;
        if (!caches) return;
        context.currentQuery = _setCurrentQueryToPrevious([...caches]);
      }),

      addCurrentToPrevious: assign(context => {
        const caches = context.caches!;
        const lastIndex = caches.length - 1;
        const lastIds = caches[lastIndex].ids;
        const beforeLastIds = caches[lastIndex - 1]?.ids;
        const set = new Set([...lastIds, ...beforeLastIds]);
        context.caches![lastIndex - 1].ids = Array.from(set);
      }),

      resetCache: assign(context => {
        context.caches = undefined;
      }),

      removeLastQuery: assign(({ caches }) => {
        caches?.pop();
      }),

      incrementAttempts: assign(context => {
        const attempts = (context.config?.attempts || 0) + 1;
        context.config = assignObject({ ...context.config }, { attempts });
      }),

      resetAttempts: assign(context => {
        context.config = assignObject(
          { ...context.config },
          { attempts: undefined },
        );
      }),

      // TODO: change to escalateErrors
      escalateError: escalate(({ errors }) => errors),

      addQueryToCache: assign(context => {
        context.caches = _addQueryToCache({ ...context });
      }),
    },
    delays: {
      THROTTLE_TIME: context => {
        const out = context.config?.throttle || DEFAULT_THROTLLE_TIME;
        return out;
      },
      TIME_TO_REFETCH: context => {
        const out = context.config?.refetch || DEFAULT_TIME_TO_REFECTH;
        return out;
      },
    },
  },
);

export type CqrsMachineType = typeof CqrsMachine;

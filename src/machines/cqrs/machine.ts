import { createMachine } from 'xstate';
import { Context } from './types';

export const CqrsMachine = createMachine({
  predictableActionArguments: true,
  preserveActionOrder: true,
  tsTypes: {} as import('./machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
  },
  context: {},

  id: 'cqrs',
  initial: 'busy',
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
              exit: 'addToPreviousQuery',
              always: [
                {
                  target: 'items',
                  cond: 'queryIsCached',
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
      },
      type: 'parallel',
    },
    error: {
      always: {
        target: 'busy',
        cond: 'triesNotReached',
      },
    },
  },
});

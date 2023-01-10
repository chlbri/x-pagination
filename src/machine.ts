import { createMachine } from 'xstate';
import { assignServices, assignTimers } from './helpers';
import {
  Context,
  Events,
  ServiceArgs,
  Services,
  TimerArgs,
} from './types';

/**
 *
 *
 * Note: This machine is not meant to be used directly, but inside a parent.
 *
 * Note: You must provide the two services: getUser and config.
 * @param timers timers for display, error and notification
 * @returns A machine
 */
export function createPaginationMachine<
  T extends object = object,
  Config = any,
>(services?: ServiceArgs<Config>, timers?: TimerArgs) {
  const { display, error, notification } = assignTimers(timers);
  const { getUser, config } = assignServices(services);
  const machine = createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as Context<T>,
        events: {} as Events<T>,
        services: {} as Services<Config>,
      },
      context: {},

      id: 'pagination',
      initial: 'user',
      states: {
        user: {
          invoke: {
            src: 'getUser',
            id: 'getUser',
            onDone: [
              {
                target: 'config',
                actions: 'setUser',
              },
            ],
            onError: [
              {
                target: 'error',
                actions: 'escalateUserError',
              },
            ],
          },
        },
        config: {
          description: 'Enviroment & other configurations',
          invoke: {
            src: 'config',
            onDone: [
              {
                target: 'name',
                actions: 'setConfig',
              },
            ],
            onError: [
              {
                target: 'error',
                actions: 'escalateConfigError',
              },
            ],
          },
        },
        work: {
          initial: 'idle',
          states: {
            idle: {
              description: 'Commands center',
              after: {
                QUERY_ERROR: {
                  target: '#pagination.error',
                  cond: 'queryIsStarted',
                  actions: ['escalateTimeError'],
                  internal: false,
                },
              },
              on: {
                RECEIVE: {
                  target: 'transformation',
                  actions: [
                    'assignItems',
                    'assignAllTotal',
                    'setCurrentPage',
                  ],
                },
              },
            },
            transformation: {
              exit: 'closeQueryTimer',
              initial: 'config',
              states: {
                pages: {
                  always: [
                    {
                      target: 'ids',
                      cond: 'itemsNotEmpty',
                      actions: 'constructPages',
                    },
                    {
                      target: '#pagination.work.idle',
                      actions: 'setEmptyPages',
                    },
                  ],
                },
                ids: {
                  always: {
                    target: 'totals',
                    actions: 'constructIds',
                  },
                },
                totals: {
                  always: {
                    target: '#pagination.work.pagination',
                    actions: ['setTotal', 'setTotalPages'],
                  },
                },
                config: {
                  always: [
                    {
                      target: 'pages',
                      cond: 'queryTakesTooLong',
                      actions: 'send/notifyTakesTooLong',
                    },
                    {
                      target: 'pages',
                    },
                  ],
                },
              },
            },
            pagination: {
              description: 'The main part',
              entry: ['setCurrentItems', 'sendCurrentItems'],
              exit: 'startQueryTimer',
              initial: 'config',
              states: {
                busy: {
                  after: {
                    DISPLAY_TIME: {
                      target: '#pagination.work.pagination.ready',
                      actions: [],
                      internal: false,
                    },
                  },
                },
                ready: {
                  on: {
                    'SEND/GOTO': {
                      target: '#pagination.work.idle',
                      actions: 'send/goto',
                    },
                    'SEND/NEXT': {
                      target: '#pagination.work.idle',
                      actions: 'send/next',
                    },
                    'SEND/PREVIOUS': {
                      target: '#pagination.work.idle',
                      actions: 'send/previous',
                    },
                    'SEND/FIRST_PAGE': {
                      target: '#pagination.work.idle',
                      actions: 'send/first',
                    },
                    'SEND/LAST_PAGE': {
                      target: '#pagination.work.idle',
                      actions: 'send/last',
                    },
                  },
                },
                config: {
                  always: [
                    {
                      target: 'busy',
                      cond: 'noCurrentPage',
                      actions: 'setDefaultPage',
                    },
                    {
                      target: 'busy',
                    },
                  ],
                },
              },
            },
          },
        },
        error: {
          type: 'final',
        },
        name: {
          on: {
            NAME: {
              target: 'work',
              actions: 'setName',
            },
          },
        },
      },
    },
    {
      guards: {
        itemsNotEmpty: context => {
          // for (const key in context.items) {
          //   if (Object.prototype.hasOwnProperty.call(context.items, key)) {
          //     const _key = key as SN;
          //     const element = context.items[_key];
          //   }
          // }
          // return true;
          throw '//TODO : Implement by fsf';
        },
        noCurrentPage: ({ currentPage }) => !currentPage,
        queryIsStarted: context => !!context?.config?.queryTimer,
        queryTakesTooLong: context => {
          throw '//TODO : Implement by @bemedev/fsf, use currentTile and notif time';
        },
      },
      actions: {
        //TODO : Implement all, sometimes use @bemedev/fsf
      },
      delays: {
        DISPLAY_TIME: display,
        QUERY_ERROR: error,
      },
      services: {
        getUser,
        config,
      },
    },
  );
  return machine;
}

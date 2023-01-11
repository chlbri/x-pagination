import { assign } from '@xstate/immer';
import { createMachine, sendParent } from 'xstate';
import { escalate } from 'xstate/lib/actions';
import { DEFAULT_PAGE_SIZE } from './constants';
import { itemsNotEmpty, _queryTakesTooLong } from './functions';
import { assignObject, assignServices, assignTimers } from './helpers';
import {
  Context,
  Events,
  Item,
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
  T extends Item = Item,
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
          entry: 'setDefaultPageSize',
          initial: 'idle',
          states: {
            idle: {
              description: 'Commands center',
              entry: 'setDefaultPageSize',
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
          on: {
            'SEND/SET_PAGE_SIZE': {
              actions: 'setPageSize',
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
        itemsNotEmpty,
        noCurrentPage: ({ currentPage }) => !currentPage,
        queryIsStarted: context => !!context?.config?.queryTimer,
        queryTakesTooLong: context => {
          const props = { ...context, notification };
          return _queryTakesTooLong(props);
        },
      },
      actions: {
        //TODO : Implement all, sometimes use @bemedev/fsf
        setUser: assign((context, { data }) => {
          context.user = data;
        }),

        escalateUserError: escalate('USER_ERROR'),

        setConfig: () => void 0,

        escalateConfigError: escalate('CONFIG_ERROR'),

        setName: assign((context, event) => {
          context.name = event.data.name;
        }),

        escalateTimeError: escalate('TIME_ERROR'),

        setDefaultPageSize: assign(context => {
          context.pageSize = DEFAULT_PAGE_SIZE;
        }),

        assignItems: assign((context, event) => {
          const rawItems = event.data.items;
          context.items = rawItems as any;
        }),

        assignAllTotal: assign((context, event) => {
          context.allTotal = event.data.allTotal;
        }),

        setCurrentPage: assign((context, event) => {
          context.currentPage = event.data.currentPage ?? 0;
        }),

        setEmptyPages: assign(context => {
          context.pages = {};
        }),

        'send/notifyTakesTooLong': sendParent(({ name }) => ({
          type: `${name}/TAKES_TOO_LONG`,
        })),

        closeQueryTimer: assign(context => {
          context.config = assignObject(
            context.config,
            'queryTimer',
            undefined,
          );
        }),

        startQueryTimer: assign(context => {
          context.config = assignObject(
            context.config,
            'queryTimer',
            Date.now(),
          );
        }),
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

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assign } from '@xstate/immer';
import { createMachine, sendParent } from 'xstate';
import { escalate } from 'xstate/lib/actions';
import {
  DEFAULT_DISPLAY_TIME,
  DEFAULT_ERROR_TIME,
  DEFAULT_PAGE_SIZE,
} from './constants';
import {
  itemsNotEmpty,
  queryTakesTooLong,
  _constructPages,
} from './functions';
import { _constructIds } from './functions/constructIds';
import { assignObject, assignTimers } from './helpers';
import { Context, Events, SN } from './types';

/**
 *
 *
 * Note: This machine is not meant to be used directly, but inside a parent.
 *
 * Note: You must provide the two services: getUser and config.
 * @param timers timers for display, error and notification
 * @returns A machine
 */

export const PaginationMachine = createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    context: {},

    id: 'pagination',
    initial: 'config',
    states: {
      config: {
        on: {
          CONFIG: {
            target: 'work',
            actions: ['assignTimers', 'setName'],
          },
        },
      },
      work: {
        entry: 'setDefaultPageSize',
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
            entry: ['setCurrentItems', 'send/currentItems'],
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
          SET_PAGE_SIZE: {
            target: '.transformation',
            actions: 'setPageSize',
          },
        },
      },
      error: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      itemsNotEmpty,
      noCurrentPage: ({ currentPage }) => !currentPage,
      queryIsStarted: context => !!context?.timers?.queryTimer,
      queryTakesTooLong,
    },
    actions: {
      assignTimers: assign((context, { data }) => {
        context.timers = assignTimers(data);
      }),

      setName: assign((context, { data }) => {
        context.name = data.name;
      }),
      escalateTimeError: escalate('TIME_ERROR'),

      setDefaultPageSize: assign(context => {
        context.pageSize = DEFAULT_PAGE_SIZE;
      }),

      assignItems: assign((context, event) => {
        const rawItems = event.data.items;
        context.items = rawItems?.reduce((accumultator, next) => {
          const { __position__, item } = next;
          const key = `${__position__}`;
          accumultator[key] = item;
          return accumultator;
        }, {} as any);
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

      constructPages: assign(context => {
        context.pages = _constructPages({ ...context }) as any;
      }),

      constructIds: assign(context => {
        context.ids = _constructIds({ ...context });
      }),

      closeQueryTimer: assign(context => {
        context.timers = assignObject(
          context.timers,
          'queryTimer',
          undefined,
        );
      }),

      startQueryTimer: assign(context => {
        context.timers = assignObject(
          context.timers,
          'queryTimer',
          Date.now(),
        );
      }),

      setTotal: assign(context => {
        context.total = Object.values(context.items!).length;
      }),

      setTotalPages: assign(context => {
        context.totalPages = Object.values(context.ids!).length;
      }),

      setCurrentItems: assign(context => {
        const key = `${context.currentPage!}` as SN;
        context.currentItems = context.pages?.[key];
      }),

      setDefaultPage: assign(context => {
        context.currentPage = 0;
      }),

      'send/currentItems': sendParent(({ name, currentItems }) => ({
        type: `${name}/CURRENT_ITEMS`,
        currentItems,
      })),

      'send/next': sendParent(({ name }) => ({
        type: `${name}/NEXT`,
      })),

      'send/previous': sendParent(({ name }) => ({
        type: `${name}/PREVIOUS`,
      })),

      'send/first': sendParent(({ name }) => ({
        type: `${name}/FIRST`,
      })),

      'send/last': sendParent(({ name }) => ({
        type: `${name}/LAST`,
      })),

      'send/goto': sendParent(({ name }, { data }) => ({
        type: `${name}/GOTO`,
        data,
      })),

      setPageSize: assign((context, event) => {
        context.pageSize = event.data.pageSize;
      }),
    },
    delays: {
      DISPLAY_TIME: context => {
        return context?.timers?.displayTime ?? DEFAULT_DISPLAY_TIME;
      },
      QUERY_ERROR: context => {
        return context?.timers?.errorTime ?? DEFAULT_ERROR_TIME;
      },
    },
  },
);

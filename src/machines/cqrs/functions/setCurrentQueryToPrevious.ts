/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createLogic, interpret } from '@bemedev/fsf';
import { Query } from 'src/types';
import { Cache } from '~cqrs/types';

type Context = {
  index?: number;
  currentQuery?: Query;
  cache?: Cache;
  key?: string;
};

export const logic = createLogic(
  {
    schema: {
      data: {} as Query,
      events: {} as Cache[],
      context: {} as Context,
    },
    context: {},
    initial: 'index',
    states: {
      index: {
        always: {
          target: 'cache',
          actions: 'setBeforeLastIndex',
        },
      },
      cache: {
        always: {
          target: 'key',
          actions: 'setCache',
        },
      },
      key: {
        always: {
          target: 'currentQuery',
          actions: 'setKey',
        },
      },
      currentQuery: {
        always: {
          target: 'final',
          actions: 'setCurrentQuery',
        },
      },
      final: {
        data: 'final',
      },
    },
  },
  {
    actions: {
      setBeforeLastIndex: (context, caches) => {
        context.index = caches.length - 2;
      },
      setCache: (context, caches) => {
        context.cache = caches[context.index!];
      },
      setKey: context => {
        context.key = context.cache!.key;
      },
      setCurrentQuery: context => {
        context.currentQuery = JSON.parse(context.key!);
      },
    },
    datas: {
      final: context => {
        return context.currentQuery;
      },
    },
  },
);

export const _setCurrentQueryToPrevious = interpret(logic);

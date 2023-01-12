/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createLogic, interpret } from '@bemedev/fsf';
import { Context as MContext, Item, Pages, SN } from '~pagination/types';

export type Event = Pick<MContext, 'items' | 'pageSize'>;

export type Context = {
  entries?: [SN, Item][];
  pages?: Pages;
};

export const logic = createLogic(
  {
    context: {},
    initial: 'entries',
    schema: {
      data: {} as Pages,
      events: {} as Event,
      context: {} as Context,
    },
    states: {
      entries: {
        always: {
          target: 'creatingPages',
          actions: 'createEntries',
        },
      },
      creatingPages: {
        always: {
          target: 'construction',
          actions: 'createPages',
        },
      },
      construction: {
        always: {
          target: 'final',
          actions: 'constructPages',
        },
      },
      final: {
        data: 'final',
      },
    },
  },
  {
    actions: {
      createEntries: (context, { items }) => {
        context.entries = Object.entries(items!) as any;
      },
      createPages: context => {
        context.pages = {};
      },
      constructPages: (context, { pageSize }) => {
        const pages = context.pages!;
        const entries = context.entries!;

        entries.forEach(([pos, item]) => {
          const _pos = Number(pos);
          const key = Math.floor(_pos / pageSize!);
          const _key = `${key}` as SN;
          const page = pages[_key];

          if (!page) {
            pages[_key] = [];
          }

          pages[_key].push(item);
        });
      },
    },
    datas: {
      final: context => context.pages,
    },
  },
);

export const _constructPages = interpret(logic);

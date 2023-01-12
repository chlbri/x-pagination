/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createLogic, interpret } from '@bemedev/fsf';
import { Context as MContext, Ids, Item, SN } from '~pagination/types';

export type Event = Pick<MContext, 'pages'>;

export type Context = {
  entries?: [SN, Item[]][];
  ids?: Ids;
};

export const logic = createLogic(
  {
    context: {},
    initial: 'entries',
    schema: {
      data: {} as Ids,
      events: {} as Event,
      context: {} as Context,
    },
    states: {
      entries: {
        always: {
          target: 'creating',
          actions: 'createEntries',
        },
      },
      creating: {
        always: {
          target: 'construction',
          actions: 'createIds',
        },
      },
      construction: {
        always: {
          target: 'final',
          actions: 'constructIds',
        },
      },
      final: {
        data: 'final',
      },
    },
  },
  {
    actions: {
      createEntries: (context, { pages }) => {
        context.entries = Object.entries(pages!) as any;
      },
      createIds: context => {
        context.ids = {};
      },
      constructIds: context => {
        const ids = context.ids!;
        const entries = context.entries!;

        entries.forEach(([pos, item]) => {
          ids[pos] = item.map(({ id }) => id);
        });
      },
    },
    datas: {
      final: context => context.ids,
    },
  },
);

export const _constructIds = interpret(logic);

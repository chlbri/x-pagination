import { createLogic, interpret, returnTrue } from '@bemedev/fsf';
import { Context } from '~pagination/types';

const logic = createLogic(
  {
    context: {},
    initial: 'definition',
    schema: {
      data: true,
      events: {} as Pick<Context, 'items'>,
    },
    states: {
      definition: {
        always: [
          {
            cond: 'itemsIsUndefined',
            target: 'error',
          },
          'items',
        ],
      },
      items: {
        always: [
          {
            cond: 'itemsIsEmpty',
            target: 'error',
          },
          'success',
        ],
      },
      error: {
        data: 'error',
      },
      success: {
        data: 'success',
      },
    },
  },
  {
    guards: {
      itemsIsUndefined: (_, { items }) => !items,
      itemsIsEmpty: (_, { items }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const _items = items!;
        const entries = Object.entries(_items);
        const len = entries.length;
        if (len <= 0) return true;

        const out = entries.every(([, value]) => !value);
        return out;
      },
    },
    datas: {
      success: returnTrue,
      error: () => false,
    },
  },
);

export const itemsNotEmpty = interpret(logic);

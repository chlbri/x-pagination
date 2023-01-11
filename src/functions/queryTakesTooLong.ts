import { createLogic, interpret, returnTrue } from '@bemedev/fsf';
import { Context } from '../types';

export const logic = createLogic(
  {
    context: {},
    initial: 'definition',
    schema: {
      data: true,
      events: {} as Pick<Context, 'config'> & {
        notification: number;
      },
      context: {} as { now?: number; duration?: number },
    },
    states: {
      definition: {
        always: [
          {
            cond: 'timerIsUndefined',
            target: 'success',
          },
          'now',
        ],
      },
      now: {
        entry: 'getNow',
        always: { target: 'time', actions: 'setDuration' },
      },
      time: {
        always: [
          {
            cond: 'durationIsNegative',
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
      timerIsUndefined: (_, event) => !event.config?.queryTimer,
      durationIsNegative: (context, { notification }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return context.duration! > notification;
      },
    },
    actions: {
      getNow: context => {
        context.now = Date.now();
      },
      setDuration: (context, event) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        context.duration = context.now! - event.config?.queryTimer!;
      },
    },
    datas: {
      error: returnTrue,
      success: () => false,
    },
  },
);

export const _queryTakesTooLong = interpret(logic);

import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import {
  DEFAULT_DISPLAY_TIME,
  DEFAULT_ERROR_TIME,
} from '~pagination/constants';
import { PaginationMachine } from '~pagination/machine';

const { delay } = interpret(PaginationMachine);

describe.concurrent('DISPLAY_TIME', () => {
  const [acceptance, expect] = delay('DISPLAY_TIME');

  test('#0: Acceptance', acceptance);

  test('#1: not defined', () => {
    expect({ expected: DEFAULT_DISPLAY_TIME });
  });

  test('#2: defined', () => {
    const displayTime = 755;
    expect({
      expected: displayTime,
      context: {
        timers: {
          displayTime,
        },
      },
    });
  });
});

describe.concurrent('QUERY_ERROR', () => {
  const [acceptance, expect] = delay('QUERY_ERROR');

  test('#0: Acceptance', acceptance);

  test('#1: not defined', () => {
    expect({ expected: DEFAULT_ERROR_TIME });
  });

  test('#2: defined', () => {
    const errorTime = 3755;
    expect({
      expected: errorTime,
      context: {
        timers: {
          errorTime,
        },
      },
    });
  });
});

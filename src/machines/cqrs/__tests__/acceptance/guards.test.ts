import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { CqrsMachine } from '~cqrs/machine';

const { assign, sendAction, action, guard } = interpret(CqrsMachine);

describe('', () => {
  const [acceptance] = guard('triesNotReached');

  test('acceptance', () => {
    acceptance();
  });
});

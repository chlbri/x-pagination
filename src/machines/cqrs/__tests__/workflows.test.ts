import { describe, test } from 'vitest';
import { CqrsMachine } from '~cqrs/machine';
import { useFakeTime, usePrepareMachine } from '../../../fixtures';

useFakeTime();

const [useDescribe, { matches, sender, context, send }] =
  usePrepareMachine(CqrsMachine);

describe('#01', () => {
  useDescribe();

  test('#01: State is in "config"', () => {
    matches('config');
  });
});

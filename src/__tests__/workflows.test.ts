import { ALWAYS_TIME } from '@bemedev/x-test';
import { nanoid } from 'nanoid';
import { DEFAULT_DISPLAY_TIME, DEFAULT_ERROR_TIME } from 'src/constants';
import { PaginationMachine } from 'src/machine';
import { describe, test } from 'vitest';
import { advanceInTime, useFakeTime, usePrepareMachine } from './fixtures';

useFakeTime();

const [useDescribe, { matches, sender, context, send }] =
  usePrepareMachine(PaginationMachine);

const config = sender('CONFIG');
const receive = sender('RECEIVE');

describe('#1: QUERY_ERROR', () => {
  useDescribe();
  const name = 'PAGIN';
  test('#01: Config', () => {
    config({
      data: {
        name,
      },
    });
  });

  test('#02: The name is set', () => {
    context(name, ({ name }) => name);
  });

  test('#03: The timers are unset', () => {
    context(undefined, context => context.timers?.errorTime);
    context(undefined, context => context.timers?.displayTime);
  });

  test('#04: Wait for QUERY_ERROR', () => advanceInTime(ALWAYS_TIME));

  test('#05: Will be in "work" state', () => {
    matches('work.idle');
  });

  test('#06: Receive the data', () => {
    receive({
      data: {
        items: [
          { __position__: 56, item: { id: nanoid() } },
          { __position__: 57, item: { id: nanoid() } },
          { __position__: 58, item: { id: nanoid() } },
          { __position__: 59, item: { id: nanoid() } },
          { __position__: 60, item: { id: nanoid() } },
        ],
      },
    });
  });

  test('#07: state is in "transformation"', () => {
    matches('work.transformation.config');
  });

  test('#08: Advance always', () => advanceInTime(ALWAYS_TIME));

  test('#09: state is in "transformation.pages"', () => {
    matches('work.transformation.pages');
  });

  test('#10: Advance always', () => advanceInTime(ALWAYS_TIME));

  test('#11: state is in "transformation.ids"', () => {
    matches('work.transformation.ids');
  });

  test('#12: Advance always', () => advanceInTime(ALWAYS_TIME));

  test('#13: state is in "transformation.totals"', () => {
    matches('work.transformation.totals');
  });

  test('#14: Advance always', () => advanceInTime(ALWAYS_TIME));

  test('#15: state is in "pagination"', () => {
    matches('work.pagination.config');
  });

  test('#16: Advance always', () => advanceInTime(ALWAYS_TIME));

  test('#17: state is in "pagination.busy"', () => {
    matches('work.pagination.busy');
  });

  test('#18: Advance display', () => advanceInTime(DEFAULT_DISPLAY_TIME));

  test('#19: state is in "pagination"', () => {
    matches('work.pagination.ready');
  });

  test('#20: go to first page', () => {
    send('SEND/FIRST_PAGE');
  });

  test('#21:wait twice time of the error time', () =>
    advanceInTime(DEFAULT_ERROR_TIME * 2));

  test('#22: state is in "error"', () => {
    matches('error');
  });
});

// TODO:  More workflows

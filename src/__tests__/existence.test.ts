import { expect, test } from 'vitest';
import { createPaginationMachine } from '../machine';

test.concurrent('#01: ariable must exists', () => {
  expect(createPaginationMachine).toBeDefined();
});

test.concurrent('#02: variable must be a function', () => {
  expect(createPaginationMachine).toBeInstanceOf(Function);
});

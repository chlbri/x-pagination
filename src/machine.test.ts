import { interpret } from '@bemedev/x-test';
import { describe, expect, test } from 'vitest';
import { createPaginationMachine } from './machine';

interpret(createPaginationMachine());

describe('#1 Existence', () => {
  test('#01: ariable must exists', () => {
    expect(createPaginationMachine).toBeDefined();
  });

  test('#02: variable must be a function', () => {
    expect(createPaginationMachine).toBeInstanceOf(Function);
  });
});

describe('#2 Work', () => {
  describe.todo('#1: //TODO : Acceptance');

  describe('#2: //TODO : Workflows', () => {
    test.todo('Worflow #1');
  });
});

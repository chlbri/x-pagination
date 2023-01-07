import { createMachine } from 'xstate';

export const Machine = createMachine({
  predictableActionArguments: true,
  preserveActionOrder: true,
  tsTypes: {} as import('./machine.typegen').Typegen0,
  schema: {},

  id: 'pagination',
});

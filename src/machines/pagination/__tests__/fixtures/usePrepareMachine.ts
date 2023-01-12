import { interpret } from '@bemedev/x-test';
import { afterAll, beforeAll } from 'vitest';
import {
  BaseActionObject,
  EventObject,
  NoInfer,
  ResolveTypegenMeta,
  ServiceMap,
  StateMachine,
  StateValueFrom,
  TypegenDisabled,
  Typestate,
} from 'xstate';

export function usePrepareMachine<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
  TAction extends BaseActionObject = BaseActionObject,
  TServiceMap extends ServiceMap = ServiceMap,
  TResolvedTypesMeta = ResolveTypegenMeta<
    TypegenDisabled,
    NoInfer<TEvents>,
    TAction,
    TServiceMap
  >,
>(
  machine: StateMachine<
    TContext,
    any,
    TEvents,
    TTypestate,
    TAction,
    TServiceMap,
    TResolvedTypesMeta
  >,
) {
  const out = interpret(machine);

  const usePrepare = (initialState?: StateValueFrom<typeof machine>) => {
    beforeAll(() => {
      out.start(initialState as any);
    });
    afterAll(() => {
      out.stop();
    });
  };

  return [usePrepare, out] as const;
}

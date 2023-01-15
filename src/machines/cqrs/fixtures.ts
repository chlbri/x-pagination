import { usePrepareMachine } from 'src/fixtures';
import { Item } from 'src/types';
import { CqrsMachine, CqrsMachineType } from './machine';
import { Context, Query } from './types';

type Params = Partial<Parameters<CqrsMachineType['withConfig']>>;

export function usePrepareCqrsMachine(...[options, context]: Params) {
  const machine = options
    ? CqrsMachine.withConfig(options, context ?? {})
    : CqrsMachine.withContext(context ?? {});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useDescribe, { sender, send, ...rest }] = usePrepareMachine(
    machine as CqrsMachineType,
  );

  const config = sender('SET_CONFIG');
  const read = sender('READ');
  const readMore = sender('READ_MORE');
  const create = sender('CREATE');
  const update = sender('UPDATE');
  const remove = sender('REMOVE');
  const _delete = sender('DELETE');

  useDescribe();

  return {
    config,
    read,
    readMore,
    create,
    update,
    remove,
    _delete,
    ...rest,
  } as const;
}

export const filterRead = (query: Query) => {
  const out = (item: Item): boolean => {
    const queryData = query.query;
    for (const key in queryData) {
      const value = queryData[key];
      if (!value) continue;
      if (item[key] !== value) return false;
    }
    return true;
  };
  return out;
};

export const mockServiceRead = (database: Item[]) => {
  return async (context: Context) => {
    const query = context.currentQuery;
    if (!query) return { items: [], offset: 0 };
    const offset = query.offset;

    const items = database.slice(offset).filter(filterRead(query));
    return { items, offset } as const;
  };
};

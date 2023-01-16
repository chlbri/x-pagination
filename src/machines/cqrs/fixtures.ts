/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cloneDeep from 'lodash.clonedeep';
import { usePrepareMachine } from 'src/fixtures';
import { Item } from 'src/types';
import { CqrsMachine, CqrsMachineType } from './machine';
import { Context, ExtractEventCqrs } from './types';

type Params = Partial<Parameters<CqrsMachineType['withConfig']>>;

export function usePrepareCqrsMachine(...[options, context]: Params) {
  const machine = options
    ? CqrsMachine.withConfig(options, context ?? {})
    : CqrsMachine.withContext(context ?? {});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useDescribe, { sender, send, ...rest }] = usePrepareMachine(
    machine as CqrsMachineType,
  );

  // #region Functions
  const config = sender('SET_CONFIG');
  const read = sender('READ');
  const readMore = sender('READ_MORE');
  const refetch = sender('REFETCH');
  const create = sender('CREATE');
  const update = sender('UPDATE');
  const _delete = sender('DELETE');
  const rinit = sender('RINIT');

  // #endregion
  useDescribe();

  return {
    config,
    read,
    readMore,
    refetch,
    create,
    update,
    _delete,
    rinit,
    ...rest,
  } as const;
}

export const filterRead = (query: Partial<Item>) => {
  const out = (item: Item): boolean => {
    for (const key in query) {
      const value = query[key];
      if (!value) continue;
      if (item[key] !== value) return false;
    }
    return true;
  };
  return out;
};

export const mockServiceRead = (database: Item[]) => {
  return async (context: Context) => {
    const { offset, query } = context.currentQuery!;
    const items = database.slice(offset).filter(filterRead(query));
    return { items, offset } as const;
  };
};

export const mockServiceCreate = (database: Item[]) => {
  return async (_: any, event: ExtractEventCqrs<'CREATE'>) => {
    const item = { ...event.data, id: database.length + 1 + '' };
    database.push(item);
    return item.id;
  };
};

export const mockServiceUpdate = (database: Item[]) => {
  return async (_: any, event: ExtractEventCqrs<'UPDATE'>) => {
    const { id, update } = event.data;
    const index = database.findIndex(item => item.id === id);
    const item = { ...database[index], ...update };
    database[index] = item;
    return item.id;
  };
};

export const mockServiceDelete = (database: Item[]) => {
  return async (_: any, { data }: ExtractEventCqrs<'DELETE'>) => {
    const _database = cloneDeep(database).filter(item => item.id !== data);
    database.length = 0;
    database.push(..._database);
    return data;
  };
};

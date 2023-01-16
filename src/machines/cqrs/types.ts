import { NPick, Query, WithoutId } from 'src/types';
import { ExtractEvent } from 'xstate';
import { Item, ItemWithPosition } from '~pagination/types';

export type Cache = {
  key: string;
  ids: string[];
};

export type Context = {
  items?: ItemWithPosition[];
  config?: {
    tries?: number;
    attempts?: number;
    throttle?: number;
    refetch?: number;
  };
  caches?: Cache[];
  currentQuery?: Query;
  cachedIds?: string[];
};

export type CqrsEvents =
  | {
      type: 'READ';
      data: Pick<Query, 'query' | 'limit'>;
    }
  | {
      type: 'READ_MORE';
      data: Query;
    }
  | {
      type: 'CREATE';
      data: WithoutId<Item>;
    }
  | {
      type: 'UPDATE';
      data: {
        id: Item['id'];
        update: WithoutId<Item>;
      };
    }
  | {
      type: 'DELETE';
      data: Item['id'];
    }
  | {
      type: 'REFETCH' | 'RINIT';
    };

export type Events =
  | CqrsEvents
  | {
      type: 'SET_CONFIG';
      data: NPick<Context['config'], 'tries'>;
    };

export type ExtractEventCqrs<T extends Events['type']> = ExtractEvent<
  Events,
  T
>;

export type Mutation = {
  data: Item['id'];
};

export type Services = {
  read: {
    data: {
      items: Item[];
      offset?: number;
    };
  };
  create: Mutation;
  update: Mutation;
  delete: Mutation;
};

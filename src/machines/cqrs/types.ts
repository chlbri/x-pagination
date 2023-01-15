import { NPick, WithoutId } from 'src/types';
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

export type Query = { query: Partial<Item>; offset?: number };

export type CqrsEvents =
  | {
      type: 'READ';
      data: Pick<Query, 'query'>;
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
      type: 'REMOVE';
      data: Item['id'];
    }
  | {
      type: 'REFETCH';
    };

export type Events =
  | CqrsEvents
  | {
      type: 'SET_CONFIG';
      data: NPick<Context['config'], 'tries'>;
    };

export type Services = {
  read: {
    data: {
      items: Item[];
      offset?: number;
    };
  };
};

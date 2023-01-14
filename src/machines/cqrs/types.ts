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
  };
  caches?: Cache[];
  currentQuery?: Record<string, any>;
  cachedIds?: string[];
};

export type CqrsEvents =
  | {
      type: 'CREATE' | 'READ' | 'READ_MORE';
      data: Item;
    }
  | {
      type: 'UPDATE';
      data: WithoutId<Item>;
    }
  | {
      type: 'DELETE' | 'REMOVE';
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
    };
  };
};

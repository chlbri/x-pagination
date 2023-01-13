import { ItemWithPosition } from '~pagination/types';

type Cache = {
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

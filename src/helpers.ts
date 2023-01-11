import {
  DEFAULT_DISPLAY_TIME,
  DEFAULT_ERROR_TIME,
  DEFAULT_NOTIFICATION_TIME,
  TEST_ID,
} from './constants';
import { Item, Items, Page, ServiceArgs, TimerArgs } from './types';

export function assignTimers(args?: TimerArgs) {
  const display = args?.display || DEFAULT_DISPLAY_TIME;
  const error = args?.error || DEFAULT_ERROR_TIME;
  const notification = args?.notification || DEFAULT_NOTIFICATION_TIME;
  return { display, error, notification };
}

export function assignObject<T extends object, K extends keyof T>(
  obj: T | undefined,
  key: K,
  value: T[K],
): T & Record<K, T[K]>;

export function assignObject<T extends object>(
  obj: T | undefined,
  rest?: Partial<T>,
): T & Partial<T>;

export function assignObject<T extends object, K extends keyof T>(
  obj: T | undefined,
  keyOrRest?: K | Partial<T>,
  value?: T[K],
) {
  obj = {} as T;
  if (typeof keyOrRest === 'string') {
    obj = {
      ...obj,
      [keyOrRest as K]: value,
    };
  } else {
    obj = {
      ...obj,
      ...(keyOrRest as Partial<T>),
    }; //?
  }
  return obj;
}

export function chunk<T extends Item = Item>(arr: Items<T>, size: number) {
  const raw = Object.entries(arr) as [`${number}`, T][];
  const pages: Page<Item> = {};

  raw.forEach(([pos, item]) => {
    const _pos = Number(pos);
    const key = Math.floor(_pos / size);
    let page = pages[`${key}`];
    if (!page) {
      page = [];
    }
    page.push(item);
  });

  return pages;
}

export function assignServices<Config = any>(
  services?: ServiceArgs<Config>,
) {
  const emptyGetUser = async () => ({ id: TEST_ID });
  const emptyConfig = async () => ({} as Config);

  return {
    getUser: services?.getUser || emptyGetUser,
    config: services?.config || emptyConfig,
  };
}

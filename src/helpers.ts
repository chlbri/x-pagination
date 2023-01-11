import {
  DEFAULT_DISPLAY_TIME,
  DEFAULT_ERROR_TIME,
  DEFAULT_NOTIFICATION_TIME,
} from './constants';
import { TimerArgs } from './types';

export function assignTimers(args?: TimerArgs) {
  const displayTime = args?.displayTime || DEFAULT_DISPLAY_TIME;
  const errorTime = args?.errorTime || DEFAULT_ERROR_TIME;
  const notificationTime =
    args?.notificationTime || DEFAULT_NOTIFICATION_TIME;
  return { displayTime, errorTime, notificationTime };
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

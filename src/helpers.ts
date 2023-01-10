import {
  DEFAULT_DISPLAY_TIME,
  DEFAULT_ERROR_TIME,
  DEFAULT_NOTIFICATION_TIME,
  TEST_ID,
} from './constants';
import { ServiceArgs, TimerArgs } from './types';

export function assignTimers(args?: TimerArgs) {
  const display = args?.display || DEFAULT_DISPLAY_TIME;
  const error = args?.error || DEFAULT_ERROR_TIME;
  const notification = args?.notification || DEFAULT_NOTIFICATION_TIME;
  return { display, error, notification };
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

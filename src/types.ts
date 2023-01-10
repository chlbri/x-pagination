export type SN = `${number}`;

export type Items<T = any> = Record<SN, T>;

export type Page<T = any> = Record<SN, T[]>;

export type Context<T extends object = object> = {
  user?: {
    id?: string;
  };
  config?: {
    queryTimer?: number;
  };
  items?: Items<T>;
  pages?: Page<T>;
  ids?: Page<string>;
  currentPage?: number;
  currentItems?: T[];
  total?: number;
  totalPages?: number;
  allTotal?: number;
  name?: string;
};

export type SendEvents =
  | {
      type: 'SEND/GOTO';
      data: { page: number };
    }
  | {
      type:
        | 'SEND/NEXT'
        | 'SEND/PREVIOUS'
        | 'SEND/FIRST_PAGE'
        | 'SEND/LAST_PAGE';
    };

export type Events<T = any> =
  | {
      type: 'NAME';
      data: { name: string };
    }
  | SendEvents
  | {
      type: 'RECEIVE';
      data: {
        items?: Items<T>;
        allTotal?: number;
        currentPage?: number;
      };
    };

export type GetUserService = (
  context?: Context,
) => Promise<{ id: string }>;

export type ConfigService<Config = any> = (
  context?: Context,
) => Promise<Config>;

export type Services<Config = any> = {
  getUser: {
    data: Awaited<ReturnType<GetUserService>>;
  };
  config: {
    data: Config;
  };
};

export type ServiceArgs<Config = any> = {
  getUser?: GetUserService;
  config?: ConfigService<Config>;
};

export type TimerArgs = {
  display?: number;
  error?: number;
  notification?: number;
};

export type SN = `${number}`;

export type Item = {
  __position__: number;
};

export type Items<T extends Item = Item> = Record<SN, T>;

export type Page<T extends Item = Item> = Record<SN, T[]>;

export type Context<T extends Item = Item> = {
  user?: {
    id?: string;
  };
  config?: {
    queryTimer?: number;
  };
  items?: Items<T>;
  pages?: Page<T>;
  ids?: Record<string, string[]>;
  pageSize?: number;
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

export type Events<T extends Item = Item> =
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
    }
  | {
      type: 'SEND/SET_PAGE_SIZE';
      data: { size: number };
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

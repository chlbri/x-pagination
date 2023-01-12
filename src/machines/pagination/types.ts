export type SN = `${number}`;

export type Item = {
  id: string;
} & Record<string, any>;

export type ItemWithPosition = {
  __position__: number;
  item: Item;
};

export type Items = Record<SN, Item>;

type ArrayRecord<T> = Record<SN, T[]>;

export type Pages = ArrayRecord<Item>;
export type Ids = ArrayRecord<string>;

export type Context = {
  user?: {
    id?: string;
  };
  timers?: {
    queryTimer?: number;
    errorTime?: number;
    notificationTime?: number;
    displayTime?: number;
  };
  items?: Items;
  pages?: Pages;
  ids?: Record<string, string[]>;
  pageSize?: number;
  currentPage?: number;
  currentItems?: Item[];
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

export type Events =
  | {
      type: 'CONFIG';
      data: Pick<Context, 'name'> & TimerArgs;
    }
  | SendEvents
  | {
      type: 'RECEIVE';
      data: {
        items?: ItemWithPosition[];
        allTotal?: number;
        currentPage?: number;
      };
    }
  | {
      type: 'SET_PAGE_SIZE';
      data: { pageSize: number };
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

export type TimerArgs = Omit<
  Exclude<Context['timers'], undefined>,
  'queryTimer'
>;

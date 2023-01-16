export type Item = {
  id: string;
} & Record<string, any>;

export type ItemWithPosition = {
  __position__: number;
  item: Item;
};

export type Query = {
  query: Partial<Item>;
  offset?: number;
  limit?: number;
};

export type NExclude<T> = Exclude<T, undefined>;

export type NPick<
  T extends object | undefined | null,
  K extends keyof NExclude<T>,
> = Pick<NExclude<T>, K>;

export type NOmit<T, K extends keyof T> = Omit<T, K>;
export type WithoutId<T> = Omit<T, 'id'>;

export type Item = {
  id: string;
} & Record<string, any>;

export type ItemWithPosition = {
  __position__: number;
  item: Item;
};

export type NExclude<T> = Exclude<T, undefined>;

export type NPick<
  T extends object | undefined | null,
  K extends keyof NExclude<T>,
> = Pick<NExclude<T>, K>;

export type NOmit<T, K extends keyof T> = Omit<T, K>;
export type WithoutId<T> = Omit<T, 'id'>;

export class Items {
  private _items!: ItemWithPosition[];

  constructor(...items: Item[]) {
    this.initialize(...items);
  }

  initialize(...items: Item[]) {
    this._items = items.map((item, index) => ({
      __position__: index,
      item,
    }));
  }

  add(...items: ItemWithPosition[]) {
    items.forEach(item => {
      const contains = this.contains(item);
      if (!contains) {
        this._items.push(item);
      }
    });
  }

  contains(itemWithPosition: ItemWithPosition) {
    return this._items.some(({ item }) => {
      const id = itemWithPosition.item.id;
      id === item.id;
    });
  }

  reset() {
    this._items = [];
  }

  get items() {
    return this._items;
  }
}

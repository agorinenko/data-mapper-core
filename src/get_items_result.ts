export default class GetItemsResult<T> {
  public collection: Array<T> = [];

  public get itemsCount (): number {
    return this.collection.length;
  };

  public totalCount: number = 0;
}

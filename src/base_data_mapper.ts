import DataRow from "./data_row";
import GetItemsResult from "./get_items_result";

export default abstract class BaseDataMapper<T extends DataRow> {
    public abstract async getItems(filter?: any): Promise<GetItemsResult<T>>;

    public abstract async getItem(key: string): Promise<T | null>;

    public abstract async insert(payload: any): Promise<T>;

    public abstract async update(key: string, payload: any): Promise<boolean>;

    public abstract async delete(key: string): Promise<boolean>;

    public abstract get KEY_FIELD_NAME(): string;

    protected abstract get fieldMap(): Map<string, any>;

    protected convertCollection(data: Array<any>): Array<T> {
        let result = [];

        if (data && data.length) {
            for (const i in data) {
                const item = data[i];
                result.push(this.map(item));
            }
        }
        return result;
    }

    protected map(payload: any): T {
        if (payload[this.KEY_FIELD_NAME] == null) {
            throw new Error('Key field is null');
        }

        const key = payload[this.KEY_FIELD_NAME];

        const item: T = this.factory(key);
        for (const [internalKey, externalKey] of this.fieldMap.entries()) {
            let value = null;
            if (externalKey != null) {
                if (typeof externalKey === 'function') {
                    value = externalKey(payload, internalKey);
                } else {
                    value = payload[externalKey as unknown as string];
                }
            }

            Object.defineProperty(item, internalKey, {
                value: value
            });
        }
        return item;
    };

    protected abstract factory(key: string): T
}

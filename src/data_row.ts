export default abstract class DataRow {
    private readonly __key: string;

    public get key(): string {
        return this.__key;
    }

    public constructor(key: string) {
        this.__key = key;
    }
}

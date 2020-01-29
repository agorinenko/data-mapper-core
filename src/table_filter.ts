export default class TableFilter {
    public limit: number = 20;
    public offset: number = 0;

    public get page(): number {
        return 1 + this.offset / this.limit;
    }

    public next() {
        this.offset = this.offset + this.limit;
    }

    public prev() {
        this.offset = this.offset - this.limit;
    }

    public toRequestData(): { limit: number | null; offset: number | null } {
        const requestData: { limit: number | null; offset: number | null } = {
            limit: null,
            offset: null
        };

        const limit: number = this.limit;
        if (limit != null && limit > 0) {
            requestData.limit = limit;
        }

        const offset: number = this.offset;
        if (offset != null && offset >= 0) {
            requestData.offset = offset;
        }

        return requestData;
    }
}

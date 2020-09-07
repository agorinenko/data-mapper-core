import {AxiosResponse} from "axios";

export default class RemoteException extends Error {
    constructor(message?: string) {
        super(message);
    }

    private __response: AxiosResponse | null = null;

    public set response(response: AxiosResponse | null) {
        this.__response = response;
    }

    public get response(): AxiosResponse | null {
        return this.__response;
    }
}

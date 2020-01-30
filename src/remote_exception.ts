import {AxiosPromise} from "axios";

export default class RemoteException extends Error {
    private readonly error: AxiosPromise;

    constructor(error: AxiosPromise) {
        super("axios error");
        this.error = error;
    }

}

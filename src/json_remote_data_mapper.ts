import DataRow from "./data_row";
import RemoteDataMapper from "./remote_data_mapper";
import {AxiosPromise, AxiosRequestConfig} from "axios";

export default abstract class JsonRemoteDataMapper<T extends DataRow> extends RemoteDataMapper<T>{
    protected sendRequest(requestConfig: AxiosRequestConfig): AxiosPromise {
        requestConfig.headers = {
            ...requestConfig.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        return super.sendRequest(requestConfig);
    }
}

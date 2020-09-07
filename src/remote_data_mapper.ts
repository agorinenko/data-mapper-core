import axios, {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios'
import BaseDataMapper from "./base_data_mapper";
import StringUtils from "./string_utils";
import GetItemsResult from "./get_items_result";
import RemoteException from "./remote_exception";
import DataRow from "@/data_row";

export default abstract class RemoteDataMapper<T extends DataRow> extends BaseDataMapper<T> {

    protected abstract get url(): string;

    /**
     * Execute DELETE web method
     * @param key - resource key
     */
    async delete(key: string): Promise<boolean> {
        let url = this.url;
        if (!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'DELETE'
        };

        const response: AxiosResponse = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        return true;
    }

    /**
     * Execute GET web method for single resource
     * @param key - resource key
     */
    async getItem(key: string): Promise<T | null> {
        let url = this.url;
        if (!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'GET'
        };
        const response: AxiosResponse = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        const data = response.data;
        if (data != null) {
            return this.map(data)
        }

        return null;
    }

    /**
     * Execute GET web method for resources
     * @param filter - query filter
     */
    async getItems(filter?: { params?: any; }): Promise<GetItemsResult<T>> {
        const requestConfig: AxiosRequestConfig = {
            url: this.url,
            method: 'GET',
            ...filter
        };

        let response: AxiosResponse = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        const result = new GetItemsResult<T>();
        if (response) {
            const data = response.data;
            if (null != data) {
                result.collection = this.convertCollection(data.results);//TODO для разных сервисов разный формат
                result.totalCount = data.count;//TODO для разных сервисов разный формат
            }
        }

        return result;
    }

    /**
     * Execute POST web method for new resource
     * @param payload - new resource data
     */
    async insert(payload: { data: any; }): Promise<T> {
        const requestConfig: AxiosRequestConfig = {
            url: this.url,
            method: 'POST',
            ...payload
        };

        const response: AxiosResponse = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        return this.map(response.data);
    }

    /**
     * Execute PUT web method for update resource
     * @param key - resource key
     * @param payload - new resource data
     */
    async update(key: string, payload: { data: any; }): Promise<boolean> {
        let url = this.url;
        if (!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'PUT',
            ...payload
        };

        const response: AxiosResponse = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        return true;
    }

    protected raiseExceptionIfNeed(response: AxiosResponse){
        if(response.status>=400 && response.status < 500){
            const ex = new RemoteException("Client error");
            ex.response = response;

            throw ex;
        } else if(response.status>=500){
            const ex = new RemoteException("Internal server error");
            ex.response = response;

            throw ex;
        }
    }

    protected sendRequest(requestConfig: AxiosRequestConfig): AxiosPromise {
        if (null == requestConfig) {
            throw new RemoteException("Axios request config is null");
        }

        let url = requestConfig.url == undefined ? '' : requestConfig.url;
        let method = requestConfig.method == undefined ? '' : requestConfig.method;

        if (StringUtils.stringIsNullOrEmpty(url)) {
            throw new RemoteException("URL is null or empty");
        }

        if (StringUtils.stringIsNullOrEmpty(method)) {
            throw new RemoteException("HTTP method is null or empty");
        }
        method = method.toLocaleUpperCase();

        let response: AxiosPromise;
        if (method == 'GET') {
            response = axios.get(url, requestConfig)
        } else if (method == 'DELETE') {
            response = axios.delete(url, requestConfig)
        } else if (method == 'POST') {
            response = axios.post(url, requestConfig.data, requestConfig)
        } else if (method == 'PUT') {
            response = axios.put(url, requestConfig.data, requestConfig)
        } else {
            throw new Error("Not implemented error");
        }

        return response
    }
}

import axios, {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios'
import BaseDataMapper from "@/base_data_mapper";
import DataRow from "@/data_row";
import GetItemsResult from "@/get_items_result";
import StringUtils from "@/string_utils";

export default abstract class RemoteDataMapper<T extends DataRow> extends BaseDataMapper<T> {
    /**
     * Execute DELETE web method
     * @param key - resource key
     */
    async delete(key: string): Promise<boolean> {
        let url = this.url;
        if(!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'DELETE'
        };

        const response: AxiosResponse<any> = await this.sendRequest(requestConfig);

        this.raiseExceptionIfNeed(response);

        return true;
    }

    /**
     * Execute GET web method for single resource
     * @param key - resource key
     */
    async getItem(key: string): Promise<T | null> {
        let url = this.url;
        if(!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'GET'
        };
        const response: AxiosResponse<any> = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        const data = response.data;
        if (data != null) {
            return this.map(data);
        }

        return null;
    }

    /**
     * Execute GET web method for resources
     * @param filter - query filter
     */
    async getItems(filter: { params?: any; }): Promise<GetItemsResult<T>> {
        const requestConfig: AxiosRequestConfig = {
            url: this.url,
            method: 'GET',
            ...filter
        };
        const response: AxiosResponse<any> = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        const result = new GetItemsResult<T>();
        if (null != response) {
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
     * @param payload - new resource
     */
    async insert(payload: { data?: any; }): Promise<T> {
        const requestConfig: AxiosRequestConfig = {
            url: this.url,
            method: 'POST',
            ...payload
        };

        const response: AxiosResponse<any> = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        return this.map(response.data);
    }

    async update(key: string, payload: { data?: any; }): Promise<boolean> {
        let url = this.url;
        if(!StringUtils.stringIsNullOrEmpty(key)) {
            url = StringUtils.concat(this.url, '/', key);
        }

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: 'PUT',
            ...payload
        };

        const response: AxiosResponse<any> = await this.sendRequest(requestConfig);
        this.raiseExceptionIfNeed(response);

        return true;
    }

    protected abstract get url(): string;

    protected sendRequest(requestConfig: AxiosRequestConfig): AxiosPromise {
        return axios(requestConfig);
    }

    private raiseExceptionIfNeed(response: AxiosResponse<any>){
        //TODO обработка ошибок
    }
}
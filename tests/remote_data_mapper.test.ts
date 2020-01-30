import TestUserDataMapper from "./test_user_data_mapper";
import axios, {AxiosRequestConfig} from 'axios';
import {mocked} from 'ts-jest/utils';
import RemoteException from "../src/remote_exception";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TestUserDataMapper', () => {
    it('fetches successfully data from an API', async () => {
        const data = {
            results: [
                {
                    username: 'GWashington',
                    first_name: 'Washington',
                    last_name: 'George',
                },
                {
                    username: 'JAdams',
                    first_name: 'Adams',
                    last_name: 'John',
                }
            ],
            count: 2
        };

        mockedAxios.get.mockResolvedValue({
            data: data,
            status: 200,
            statusText: "",
            headers: {}
        });

        const dataMapper = new TestUserDataMapper();
        const items = await dataMapper.getItems();

        expect(mockedAxios.get).toHaveBeenCalled();
        expect(items.itemsCount).toBe(2);
        expect(items.totalCount).toBe(2);
        expect(items.collection[0].firstName).toBe('Washington');
        expect(items.collection[0].lastName).toBe('George');
        expect(items.collection[0].login).toBe('GWashington');
        expect(items.collection[0].fullName).toBe('Washington George');
    });
    // it('fetches erroneously data from an API', async () => {
    //     mockedAxios.get.mockImplementationOnce(() =>
    //         Promise.reject(new Error('Network Error')),
    //     );
    //
    //     const dataMapper = new TestUserDataMapper();
    //     // const items = await dataMapper.getItems();
    //
    //     // expect(mockedAxios.get).toHaveBeenCalled();
    //
    //     expect(await dataMapper.getItems()).rejects.toThrow('Error');
    //     // expect(mockedAxios.get).toHaveBeenCalled();
    // });
});

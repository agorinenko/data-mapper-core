import TestUserDataMapper from "./test_user_data_mapper";
import axios, {AxiosRequestConfig} from 'axios';
import TestUserInfo from "./test_user_info";
import GetItemsResult from "@/get_items_result";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe(header('Test Remote Data Mapper'), () => {
    it(title('Test GET web method for resources'), async () => {
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
        const items: GetItemsResult<TestUserInfo> = await dataMapper.getItems();

        expect(mockedAxios.get).toHaveBeenCalled();
        expect(items.itemsCount).toBe(2);
        expect(items.totalCount).toBe(2);
        expect(items.collection[0].firstName).toBe('Washington');
        expect(items.collection[0].lastName).toBe('George');
        expect(items.collection[0].login).toBe('GWashington');
        expect(items.collection[0].fullName).toBe('Washington George');
    });

    it(title('Test GET web method for single resource'), async () => {
        const data = {
            username: 'GWashington',
            first_name: 'Washington',
            last_name: 'George',
        };

        mockedAxios.get.mockResolvedValue({
            data: data,
            status: 200,
            statusText: "",
            headers: {}
        });

        const dataMapper = new TestUserDataMapper();
        const item: TestUserInfo | null = await dataMapper.getItem('GWashington');

        expect(mockedAxios.get).toHaveBeenCalled();
        expect(item).not.toBeNull();
        if (null != item) {
            expect(item.firstName).toBe('Washington');
            expect(item.lastName).toBe('George');
            expect(item.login).toBe('GWashington');
            expect(item.fullName).toBe('Washington George');
        }
    });

    it(title('Test DELETE web method'), async () => {
        mockedAxios.delete.mockResolvedValue({
            data: null,
            status: 200,
            statusText: "",
            headers: {}
        });

        const dataMapper = new TestUserDataMapper();
        const status: boolean = await dataMapper.delete('GWashington');

        expect(mockedAxios.delete).toHaveBeenCalled();
        expect(status).toEqual(true);
    });

    it(title('Test POST web method for new resource'), async () => {
        const data = {
            username: 'GWashington',
            first_name: 'Washington',
            last_name: 'George',
        };

        mockedAxios.post.mockResolvedValue({
            data: data,
            status: 201,
            statusText: "",
            headers: {}
        });

        const dataMapper = new TestUserDataMapper();
        const item: TestUserInfo = await dataMapper.insert({data: data});

        expect(mockedAxios.post).toHaveBeenCalled();
        expect(item).not.toBeNull();
        if (null != item) {
            expect(item.firstName).toBe('Washington');
            expect(item.lastName).toBe('George');
            expect(item.login).toBe('GWashington');
            expect(item.fullName).toBe('Washington George');
        }
    });

    it(title('Test PUT web method for update resource'), async () => {
        const data = {
            username: 'GWashington',
            first_name: 'Washington',
            last_name: 'George',
        };

        mockedAxios.put.mockResolvedValue({
            data: data,
            status: 200,
            statusText: "",
            headers: {}
        });

        const dataMapper = new TestUserDataMapper();
        const status: boolean = await dataMapper.update('GWashington', {data: data});

        expect(mockedAxios.put).toHaveBeenCalled();
        expect(status).toEqual(true);
    });
});

function header(name: string): string {
    return `~ ${name.toUpperCase()} ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
}

function title(name: string): string {
    const maxLem = 40;
    const nameLen = name.length;
    if (nameLen > maxLem) {
        name = name.substr(0, maxLem);
    } else {
        name = name + " ".repeat(maxLem - nameLen);
    }
    return `=> ${name} ============================`;
}

import TestUserInfo from "./test_user_info";
import JsonRemoteDataMapper from "../src/json_remote_data_mapper";

export default class TestUserDataMapper extends JsonRemoteDataMapper<TestUserInfo> {

    protected factory(key: string): TestUserInfo {
        return new TestUserInfo(key);
    }

    protected get fieldMap(): Map<string, any> {
        const map = new Map<string, any>();
        map.set('login', 'username');
        map.set('firstName', 'first_name');
        map.set('lastName', 'last_name');
        map.set('fullName', function (payload: any, internalKey: string) {
            return `${payload["first_name"]} ${payload["last_name"]}`
        });
        return map;
    }

    protected get url(): string {
        return "/users";
    }

    get KEY_FIELD_NAME(): string {
        return "username";
    }
}

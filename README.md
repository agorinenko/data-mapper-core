# What's the good of that?
A small TypeScript library with great features:
1. Placing the project's primary focus on the core domain and domain logic
1. Basing complex designs on a model of the domain
1. The interface of an object conforming to this pattern would include functions such as Create, Read, Update, and Delete, 
that operate on objects that represent domain entity types in a data store.
1. A Data Mapper is a Data Access Layer that performs bidirectional transfer of data between a persistent data store 
(often a REST API) and an in-memory data representation (the domain layer). 
The goal of the pattern is to keep the in-memory representation and the persistent data store independent of each other 
and the data mapper itself. 
1. The layer is composed of one or more mappers (or Data Access Objects), performing the data transfer. 
Mapper implementations vary in scope. Generic mappers will handle many different domain entity types, dedicated mappers will 
handle one or a few.
1. Initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model 
that addresses particular domain problems
## Install
package.json
```json
{
  "dependencies": {
    "data-mapper-core": "^1.0.0"
  }
}
```
npm
```
npm i data-mapper-core
```
## Import
```javascript
import JsonRemoteDataMapper from "data-mapper-core/dist/json_remote_data_mapper";
```
## Example
[See tests for examples.](https://github.com/agorinenko/data-mapper-core/blob/master/tests/remote_data_mapper.test.ts)

For example you have REST API endpoint

**GET /users**

Code 200

Response:
```json
{
    "results": [
        {
            "username": "GWashington",
            "first_name": "Washington",
            "last_name": "George"
        },
        {
            "username": "JAdams",
            "first_name": "Adams",
            "last_name": "John"
        }
    ],
    "count": 2
}
```
**GET /users/GWashington**

Code 200

Response:
```json
{
    "username": "GWashington",
    "first_name": "Washington",
    "last_name": "George"
}
```
**POST /users/GWashington**

Code 201

Response:
```json
{
    "username": "GWashington",
    "first_name": "Washington",
    "last_name": "George"
}
```
**PUT /users/GWashington**

Code 200

Response:
```json
{ }
```
**DELETE /users/GWashington**

Code 200

Response:
```json
{ }
```
OK! You can make a domain model for a user like this:
```typescript
import DataRow from "data-mapper-core/dist/data_row";

export default class UserInfo  extends DataRow{
    public login?: string;
    public firstName?: string;
    public lastName?: string;
    public fullName?: string;
}
```
And then you can make a data mapper class. It will help you extract data from the API into memory and abstract from the 
data store that you don't control:
```typescript
import JsonRemoteDataMapper from "data-mapper-core/dist/json_remote_data_mapper";
import UserInfo from "./user_info";

export default class UserDataMapper extends JsonRemoteDataMapper<UserInfo> {

    protected factory(key: string): UserInfo {
        return new UserInfo(key);
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
```
Test GET web method for resources
```typescript
const dataMapper = new TestUserDataMapper();
const items: GetItemsResult<TestUserInfo> = await dataMapper.getItems();
```
Test GET web method for single resource
```typescript
const dataMapper = new TestUserDataMapper();
const item: TestUserInfo | null = await dataMapper.getItem('GWashington');
```
Test DELETE web method
```typescript
const dataMapper = new TestUserDataMapper();
const status: boolean = await dataMapper.delete('GWashington');
```
Test POST web method for new resource
```typescript
const dataMapper = new TestUserDataMapper();
const item: TestUserInfo = await dataMapper.insert({data: data});
```
It's very simple! I am waiting for your feedback on the mail anton.gorinenko@gmail.com ;)

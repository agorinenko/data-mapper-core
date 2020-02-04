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

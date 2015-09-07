# Specification

## Connection
- Establish data base connection based on environment
    + SQLite for ionic
    + WEBSQL for browsers

### Migration
Apply latest migration and provide other utilities for:
- create table
- alter table
- add column
- remove column
- etc

### Data Seeding
- seed a 

## Collection
Collection of models.

## Runner
- [ ] `then`

## Collective Logical Operators
- [ ] `and / $and`
- [ ] `or / $or`
- [ ] `nor / $nor`

## Logical Value Operators
- [ ] `eq / equals / $eq`
- [ ] `neq / $ne / $neq`
- [ ] `gt / $gt`
- [ ] `gte / $gte`
- [ ] `lt / $lt`
- [ ] `lte / $lte`
- [ ] `match / $match`
- [ ] `elementMatch / $elementMatch / $elemMatch`
- [ ] `in / $in`
- [ ] `nin / $nin`
- [ ] `mod / $mod`
- [ ] `regex / $regex`
- [ ] `not / $not`

## Find
- [ ] `where`
- [ ] `sort`
- [ ] `skip`
- [ ] `limit`
- [ ] `gt`
- [ ] `gte`
- [ ] `lt`
- [ ] `lte`
- [ ] `eq` / `equals`
- [ ] `ne`
- [ ] `select`
- [ ] `distinct`
- [ ] `exists`
- [ ] `find`
- [ ] `findById`
- [ ] `findByIdAndRemove`
- [ ] `findByIdAndUpdate`
- [ ] `findOne`
- [ ] `findOneAnRemove`
- [ ] `findOneAndUpdate`
- [ ] `in`
- [ ] `nin`
- [ ] `or`
- [ ] `nor`
- [ ] `and`
- [ ] `map`
- [ ] `reduce`

## Aggregate
- [ ] `count`
- [ ] `sum`
- [ ] `average`
- [ ] `min`
- [ ] `max`
- [ ] `incr`
- [ ] `increment`
- [ ] `decr`
- [ ] `decrement`

## Create
- [ ] `create`

## Update
- [ ] `update`
- [ ] `upsert`

## Delete
- [ ] `remove`
- [ ] `delete`

### Define model collection
```js
//User collection
angular
    .module('ngPOS')
    .factory('User',function($ngDB){
        return $ngDB.model('User',{tableName:'users'});
    }); 
```

## Model
Object relational mapper

- `save():Promise`
- `remove()|del()|delete():Promise`
- `toJSON():Object`
- `toObject():Object`
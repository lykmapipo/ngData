# Specification

## Setup and Workflow
- config models

## Table naming convection
- [ ] All temporary table will have `_t` suffix
- [ ] Table will use `collection name` implicitly else `tableName` provided explicitly 

## Schema change algorithm
- [ ] create a temporary table
- [ ] copy all data to temporary table
- [ ] drop original table
- [ ] create a new table
- [ ] copy data from temporary table
- [ ] drop temporary table
- [ ] what if schema name change?

## Schema change algorithm 2
- [ ] create table if not exists
- [ ] select all data from existing table
- [ ] copy data from existing table
- [ ] drop existing table
- [ ] create new table
- [ ] insert all copied data

## Data copying algrithm
- [ ] select existing data
- [ ] obtain current properties
- [ ] adding missing values to existing data
- [ ] remove unwanted data from existing data

$collection
$model
$schema
$migrationprovider
$seedprovider
$databaseprovider
    pool(max,min)

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
- seed a table

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
    .factory('User',function(ngData){
        return ngData.model('User',{
            tableName:'users',
            properties: {
                firstName: {
                    type: String,
                    unique: true,
                    defaultsTo: defaultsTo
                },
                lastName: {
                    type: String
                },
                ssn: {
                    type: String,
                    primaryKey: true,
                    index: true
                },
                fullName:function(){}
            },
            withNoSSN: function(){}
        });
    }); 
```

## Model methods
- `save():Promise`
- `remove():Promise`
- `toJSON():Object`
- `toObject():Object`

## Usage

### Create new instance
```js
angular
    .module('ngPOS')
    .controller(function(User){
        $scope.user = User.new();

        $scope.save = function(user){
            user.save();
        };

        $scope.delete = function(user){
            user.remove();
        };

        $scope.index = function(criteria, limit, offset){
            User.find(criteria).limit(limit).offset(offset);
        };

    });
```

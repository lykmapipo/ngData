# Specification

## Initialization

### Migration

### Data Seeding

## Collection
Collection of models.

### Methods
- `create([Object|Array[Object]]):Promise`
- `update(Object,Object):Promise`
- `findById(id):Promise`
- `findOne(Object):Promise`

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
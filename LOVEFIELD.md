# lovefield Integration

## Heads Up!!
- set window.openDatabase as per evironment and let lovefield `WebSQL` to use it.

## Database

### Connection
- name = 'books'
- description = 'Books database'
- version = '1.0.0'
- size = 4 * 1024 * 1024
- store = $storeProvider.IndexDB, $storeProvider.WebSQL, $storeProvider.Memory
- onUpgrade = default upgrade && user defined fn:Promise

### Connection LifeCycle
- onConnect
- onUpgrade

## Schema

### Type ($ngDataType, $ngDataTypeProvider)
- `ARRAY_BUFFER`,
- `BOOLEAN`,
- `DATE_TIME`,
- `INTEGER`,
- `NUMBER`,
- `OBJECT`,
- `STRING`

## Migration

## Collection

## Model

## Query

## References
- [io2015-codelabs](https://github.com/googlesamples/io2015-codelabs/tree/master/lovefield)
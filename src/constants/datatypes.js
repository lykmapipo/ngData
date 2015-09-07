(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description provide common datatypes that can be used in WEBSQL and SQLITE
     *              databases. 
     */
    angular
        .module('ngData')
        .constant('DataTypes', {
            //borrowed from
            //https://github.com/AndrewJo/sails-sqlite3/blob/master/lib/utils.js#L232
            'string': 'TEXT',
            'text': 'TEXT',

            //integer data types
            'boolean': 'INTEGER',
            'int': 'INTEGER',
            'integer': 'INTEGER',

            //real data types
            'number': 'REAL',
            'float': 'REAL',
            'double': 'REAL',

            //text data types
            'date': 'TEXT',
            'datetime': 'TEXT',

            'object': 'TEXT',
            'json': 'TEXT',
            'array': 'TEXT',

            'binary': 'BLOB',
            'bytea': 'BLOB'

            //if data type is missed default to TEXT
        });
}());
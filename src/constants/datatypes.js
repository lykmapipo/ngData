(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description common datatypes that can be used in WebSQL and SQLite
     *              databases. 
     */
    angular
        .module('ngData')
        .constant('DataTypes', {
            //map for JS to SQL data types
            'string': 'TEXT',

            //integer data types
            'boolean': 'INTEGER',
            'integer': 'INTEGER',

            //real data types
            'number': 'REAL',

            //text data types
            'date': 'TEXT',
            'datetime': 'TEXT',

            'object': 'TEXT',
            'array': 'TEXT',

            'blob': 'BLOB'

            //if data type is missed default to TEXT
        });
}());
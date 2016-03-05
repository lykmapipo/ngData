(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description common data types that can be used in lovefield
     *              and their corresponding JS types.
     */
    angular
        .module('ngData')
        .constant('Types', {
            //map for JS to lovefield data types

            //string datatypes
            'String': {
                lf: lf.Type.STRING,
                js: String
            },

            //boolean data types
            'Boolean': {
                lf: lf.Type.BOOLEAN,
                js: Boolean
            },

            //number data types
            'Number': {
                lf: lf.Type.NUMBER,
                js: Number
            },

            //date data types
            'Date': {
                lf: lf.Type.DATE_TIME,
                js: Date
            },

            'Object': {
                lf: lf.Type.OBJECT,
                js: Object
            },

            'Buffer': {
                lf: lf.Type.ARRAY_BUFFER,
                js: ArrayBuffer
            }

            //if data type is missed default to STRING
        });

}());
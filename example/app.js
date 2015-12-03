(function() {
    'use strict';

    /**
     * @name webexample
     */
    angular
        .module('ngBooks', ['ngData'])
        .config(function($databaseProvider) {

            $databaseProvider.name = 'books';
            $databaseProvider.description = 'Books database';
            $databaseProvider.version = '1.0.0';
            $databaseProvider.size = 4 * 1024 * 1024;

        })
        .run(function($ngData) {
            $ngData.model('Book', {
                tableName: 'books',
                properties: {
                    id: {
                        type: String,
                        defaultsTo: '44'
                    },
                    name: String,
                    author: Object,
                    isbn: {
                        type: String,
                        required: true
                    }
                }
            });

            $ngData.initialize().then(function(results) {
                console.log(results);
            }).catch(function(error) {
                console.log(error);
            });

        });
}());
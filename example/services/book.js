'use strict';


angular
    .module('ngBooks')
    .config(function($databaseProvider) {
        $databaseProvider.model('Book', {
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
    })
    .factory('Book', function($ngData) {

        var Book = $ngData.model('Book');

        return Book;
    });
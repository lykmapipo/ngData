'use strict';


angular
    .module('webexample')
    .factory('Book', function($ngData) {
        var Book = $ngData.model('Book', {
            tableName: 'books',
            properties: {
                name: String,
                author: Object,
                isbn: {
                    type: String,
                    required: true
                }
            }
        });

        return Book;
    });
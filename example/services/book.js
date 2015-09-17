'use strict';


angular
    .module('ngBooks')
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
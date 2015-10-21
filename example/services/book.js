'use strict';


angular
    .module('ngBooks')
    .factory('Book', function($ngData) {
        
        var Book = $ngData.model('Book');

        return Book;
    });
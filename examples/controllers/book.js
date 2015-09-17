(function() {
    'use strict';

    angular
        .module('webexample')
        .controller('BookCtrl', function($scope, Book) {

            $scope.index = function(offset, limit) {
                return Book.find().limit(limit).offset(offset);
            };

            $scope.book = Book.new();

            $scope.show = function(id) {
                return Book.findById(id);
                return Book.findById(id);
            };

            $scope.create = function(book) {
                return Book.create(book);
            };

            $scope.update = function(book) {
                return book.save();
            };

            $scope.delete = function(book) {
                return book.delete();
            };


        });
}());
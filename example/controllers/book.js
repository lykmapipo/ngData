(function() {
    'use strict';

    angular
        .module('ngBooks')
        .controller('BookCtrl', function($scope, $q, Book) {

            $scope.index = function(offset, limit) {
                Book.find().limit(limit).offset(offset).then(function(books) {
                    $scope.books = books;
                });
            };

            $scope.book = Book.new();

            $scope.show = function(id) {
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

            //seeding books
            Book.create([{
                    name: 'Happy Angular',
                    author: 'Angular Developers',
                    isbn: 'ANG-135'
                }, {
                    name: 'Happy Ionic',
                    author: 'Ionic Developers',
                    isbn: 'ION-145'
                }])
                .then(function(books) {
                    console.log(books);
                })
                .catch(function(error) {
                    console.log(error.message);
                });

            //load books
            $scope.index();

        });
}());
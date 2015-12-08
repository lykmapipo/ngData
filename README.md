ngData
======
[![Build Status](https://travis-ci.org/lykmapipo/ngData.svg?branch=master)](https://travis-ci.org/lykmapipo/ngData)

Simple and minimal WebSQL and cordova SQLite ORM for [ionic](https://github.com/driftyco/ionic) and [angular](https://github.com/angular/angular)

## Istallation
```sh
$ bower install ng-data --save
```

## Testing

* Clone this repository

* Install all development dependencies
```sh
$ npm install && bower install
```

## Usage

### Configure database and define model
```js
angular
        .module('ngBooks', ['ngData'])
        .config(function($databaseProvider) {
            //configure database
            $databaseProvider.name = 'books';
            $databaseProvider.description = 'Books database';
            $databaseProvider.version = '1.0.0';
            $databaseProvider.size = 4 * 1024 * 1024;

        })
        .run(function($ngData) {
            //define model
            $ngData.model('Book', {
                tableName: 'books',
                properties: {
                    name: String,
                    author: Object,
                    isbn: {
                        type: String,
                        required: true,
                        unique: true
                    }
                },
                methods:{//instance methods
                   getCodedName: function(){
                       return [this.code, this.name].join('-');
                   }
                },
                statics:{//static methods
                   findByCode: function(code){
                       return this.findOne({code:code});
                   }
                }
            });

            //initialize 
            $ngData.initialize().then(function(results) {
                console.log(results);
            }).catch(function(error) {
                console.log(error);
            });

        });
```

### Define factories
```js
angular
    .module('ngBooks')
    .factory('Book', function($ngData) {
        
        var Book = $ngData.model('Book');

        return Book;
    });
```

### Use it
```js
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
           
            //load books
            $scope.index();

        });
```

* Then run test
```sh
$ npm test
```

## Development
`ngData` has set of useful `grunt` tasks to help you with development. By running
```sh
$ grunt
```
`ngData` will be able watch your development environment for file changes and apply `jshint` and `karma` to the project.

## Contribute
Fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## References
- [JS Data Structure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [Computer Science in Javascript](https://github.com/nzakas/computer-science-in-javascript/)
- [JSON Schema](http://json-schema.org/)
- [JSON Schema Core](http://json-schema.org/latest/json-schema-core.html)
- [JSON Schema Validation](http://json-schema.org/latest/json-schema-validation.html)

## Licence

Copyright (c) 2015 lykmapipo && Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

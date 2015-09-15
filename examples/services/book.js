'use strict';


angular
  .module('webexample')
  .factory('Book',function (Model) {
    var Book = new Model({
      tableName:'books',
      properties:{
        name:String,
        author:Object,
        isbn:{
          type:String,
          required:true
        }
      }
  });

  return Book;
});

(function(){
  'use strict';

  //@name webexample
  // example dir for testing ngData module
  angular
        .module('webexample',['ngData'])
        .config(function($databaseProvider){
          
            $databaseProvider.name = 'testDB';
            $databaseProvider.description = 'this is a test db';
            $databaseProvider.version = '1.0.0';
            $databaseProvider.size = 8 *1024 *1024;
        });
}());

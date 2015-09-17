(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.$ngData
     * @description exports object of the `$ngData` which will be used across an
     *              app
     *
     * @example <caption>registering a new model</caption>
     * angular
     * 	.module('<moduleName>')
     * 	.factory('<factoryName>', function($ngData){
     * 		//create $ngData model
     * 		var Customer = $ngData.model('User',{
     * 				tableName:'customers',
     * 				timestamp:true,
     * 				properties:{
     * 					name:{
     * 						type:String,
     * 						required:true
     * 					},
     * 					code:String
     * 					email:{
     * 						type:String,
     * 						email:true,
     * 						required:true
     * 					},
     * 					joinedAt:{
     * 						type:Date,
     * 						defaultsTo: new Date()
     * 					}
     * 				}
     * 			});
     * 			
     * 		//return created model
     * 		return Customer;
     * 	});
     * 
     * @public
     */
    angular
        .module('ngData')
        .factory('$ngData', function() {
            var $ngData = {};
            return $ngData;
        });
}());
(function(){
  'use strict';

    angular
          .module('ngData')
          .factory('Model', function(){

            function Model(){

            }

            /**
             * @description save the model instance into the database
             * @return {Promise}
             */
            Model.prototype.save = function () {

            };

            /**
             * @description remove the instance
             * @return {Promise}
             */
            Model.prototype.remove = function () {

            };

            /**
             * @description parse the object to String object
             * @return {Object} [String object representation]
             */
            Model.prototype.toObject = function () {

            };

            /**
             * @description parse the model to JSON object
             * @return {Object} [JSON object]
             */
            Model.prototype.toJSON = function () {

            };

            return Model;
          });
}());

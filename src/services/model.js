(function(){
  'use strict';

  /**
   * the documentation in this factory is borrowed from mongoose api
   */
  angular
        .module('ngData')
        .factory('Model',function(){

            /**
             * @description model
             * @param {[type]} table [description]
             */
             function Model(options){
               this.table = options.tablename;
             }

            Model.prototype.create = function () {

            };

          /**
           * @description
           *
           * @return {[type]} [description]
           */
            Model.prototype.update = function () {

            };

            Model.prototype.delete = function () {

            };

            Model.prototype.find = function () {

            };

            Model.prototype.findById = function () { //TODO if find by id will have to receive the id as param

            };

            Model.prototype.findAll = function () {

            };

            Model.prototype.where = function () { // have to implement the where function

            };

            Model.prototype.limit = function () {

            };

            Model.prototype.sort = function () {

            };


            Model.prototype.gt = function () {

            };

            Model.prototype.lt = function () {

            };

            Model.prototype.in = function () {

            };

            Model.prototype.select = function () {

            };

            /**
             * @description Specifies arguments for a $and condition.
             * @param  {[Array]} options [description]
             * @return {[type]}         [description]
             */
            Model.prototype.and = function (/*options*/) {

            };

            /**
             * @description Defines an index (most likely compound) for this schema.
             * @param  {[String]} fields  [description]
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             */
             Model.prototype.index = function (/*fields, options*/) {

            };

            /**
             * @description Specifying this query as a count query.
             * @param  {[Object]}   criteria
             * @param  {function} callback
             * @return {[query]} this
             */
            Model.prototype.count = function (/*criteria, callback*/) {

            };

            /**
             * @description Declares or executes a distict() operation.
             * @param  {[String]}   fields
             * @param  {[Object, Query]}   conditions
             * @param  {Function} callback
             * @return {[type]}
             */
            Model.prototype.distict = function (/*fields, conditions, callback*/) {

            };

            /**
             * @description Specifies the complementary comparison value for paths specified with where()
             * @param  {[Object]} val [description]
             * @return {[type]}     [description]
             */
            Model.prototype.equals = function (/*val*/) {

            };

            /**
             * @description Specifies an $exists condition
             * @param  {[String]} path [description]
             * @param  {[Number]} val  [description]
             * @return {[type]}      [description]
             */
            Model.prototype.exists = function (/*path, val*/) {
              // body...
            };




             return Model;
        });
}());

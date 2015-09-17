(function(){
  'use strict';

  angular
        .module('ngData')
        .factory('Query',function(){

          function Query () {

          }


          /**
            * @description find documents
            * @param  {Object}   conditions
            * @param  {Object}   projections [optional fields to return]
            * @param  {Object}   options     [optional]
            * @param  {Function} callback
            * @return {Qurey}
            */
           Query.prototype.find = function (/*conditions, projections, options, callback*/) {

           };

           /**
            * @description Finds a single document by its _id field.
            *              findById(id) is equivalent to findOne({ id: id }).
            * @param  {(Object|String|Number)}   id     value of `id` to query by
            * @param  {Object}   projections optional fields to return
            * @param  {Object}   options     [optional]
            * @param  {Function} callback
            * @return {Query}               [description]
            */
           Query.prototype.findById = function (/*id, projections, options, callback*/) {

           };

           /**
            * @description Issue a mongodb findAndModify remove command by a
            *               document's _id field. findByIdAndRemove(id, ...) is
            *               equivalent to findOneAndRemove({ id: id }, ...).
            * @param  {(Object|String|Number)}   id      value of `id` to query by
            * @param  {Object}   options
            * @param  {Function} callback
            * @return {type}            [description]
            */
           Query.prototype.findByIdAndDelete = function (/*id, options, callback*/) {
             // body...
           };

           /**
            * @description Issues a mongodb findAndModify update command by a
            *              document's id field. findByIdAndUpdate(id, ...) is
            *              equivalent to findOneAndUpdate({ id: id }, ...).
            * @param  {Object}   id       value of `id` to query by
            * @param  {Object}   update
            * @param  {Object}   options
            * @param  {Function} callback
            * @return {[type]}            [description]
            */
           Query.prototype.findByIdAndUpdate = function (/*id, update, options, callback*/) {

           };

           /**
            * @description Find One document
            * @param  {Object}   conditions
            * @param  {Object}   projections [ optional fields to return ]
            * @param  {Object}   options
            * @param  {Function} callback
            * @return {Query}               [this]
            */
           Query.prototype.findOne = function (/*conditions, projections, options, callback*/) {

           };

           /**
            * @description Issue a findAndModify remove command
            * @param  {Object}   conditions
            * @param  {Object}   options
            * @param  {Function} callback
            * @return {type}              [description]
            */
           Query.prototype.findOneAndRemove = function(/*conditions, options, callback*/) {

           };

           /**
            * @description Issues a mongodb findAndModify update command.
            * @param  {Object}   conditions
            * @param  {Object}   update
            * @param  {Object}   options
            * @param  {Function} callback
            * @return {Query}
            */
           Query.prototype.findOneAndUpdate = function(/*conditions, update, options, callback*/) {

           };

           /**
            * @description Creates a Query, applies the passed conditions, and
            *              returns the Query.
            * @param  {String} path
            * @param  {Object} val  [optional]
            * @return {Query}      [description]
            */
           Query.prototype.where = function (/*path, val*/) {

           };

           /**
            * @description Specifies the maximum number of records the query
            *              will return. can not be used with distinct
            * @param  {Number} val [description]
            * @return {type}     [description]
            */
           Query.prototype.limit = function (/*val*/) {

           };

           /**
            * @description Sets the sort order
            * @param  {(Object|String)} arg [description]
            * @return {Query}    [this]
            */
           Query.prototype.sort = function (/*arg*/) {

           };

           /**
            * @description Specifies a $gt query condition.
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.gt = function (/*path, val*/) {

           };

           /**
            * @description Specifies a $gte query condition.
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.gte = function (/*path, val*/) {

           };

           /**
            * @description Specifies a $lt query condition.
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.lt = function (/*path, val*/) {

           };

           /**
            * @description Specifies a $lte query condition.
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.lte = function (/*path, val*/) {

           };

           /**
            * @description Specifies a $in query condition.
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.in = function (/*path, val*/) {

           };

           /**
            * @description Specifies which document fields to include or
            *              exclude (also known as the query "projection")
            * @param  {(Object|String)} arg
            * @return {Query}     [this]
            */
           Query.prototype.select = function (/*arg*/) {

           };

           /**
            * @description Specifies arguments for an $and condition.
            * @param  {Array} options
            * @return {Query}         [this]
            */
           Query.prototype.and = function (/*options*/) {

           };

           /**
            * @description Specifies arguments for an $or condition.
            * @param  {Array} array
            * @return {Query}       [this]
            */
           Query.prototype.or = function (/*array*/) {

           };

           /**
            * @description Specifies arguments for an $nor condition.
            * @param  {Array} array
            * @return {Query}       [this]
            */
           Query.prototype.nor  = function (/*array*/) {

           };

           /**
            * @description Defines an index (most likely compound) for this schema.
            * @param  {String} fields
            * @param  {Object} options
            * @return {[type]}         [description]
            */
            Query.prototype.index = function (/*fields, options*/) {

           };

           /**
            * @description Specifying this query as a count query.
            * @param  {Object}   criteria
            * @param  {Function} callback
            * @return {Query} this
            */
           Query.prototype.count = function (/*criteria, callback*/) {

           };

           /**
            * @description Declares or executes a distinct() operation.
            * @param  {String}   fields
            * @param  {(Object|Query)}   criteria
            * @param  {Function} callback
            * @return {[type]}
            */
            Query.prototype.distinct = function (/*fields, criteria, callback*/) {

           };

           /**
            * @description Specifies the complementary comparison value for
            *               paths specified with where()
            * @param  {Object} val
            * @return {[type]}     [description]
            */
           Query.prototype.equals = function (/*val*/) {

           };

           /**
            * @description Specifies an $exists condition
            * @param  {String} path
            * @param  {Number} val
            * @return {[type]}      [description]
            */
           Query.prototype.exists = function (/*path, val*/) {
             // body...
           };

           /**
            * @description Executes this query and returns a promise
            * @return {promise}
            */
           Query.prototype.then = function () {
             // body...
           };

           /**
            * @description Specifies the number of documents to skip.
            * @param {Number} val
            */
           Query.prototype.offset =
           Query.prototype.skip = function (/*val*/) {
             // body...
           };

          return Query;
        });
}());

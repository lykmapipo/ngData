(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name validate
     * @description object validation based on validatejs
     * @see https://github.com/ansman/validate.js
     */
    angular
        .module('ngData')
        .factory('$validate', function($q) {
            //create a local copy of validatejs
            //by cloning/copying a global validate
            var $validate = _.clone(validate);

            //bind angular $q as promise
            validate.Promise = $q;

            //export sql validate
            return $validate;
        });
}());
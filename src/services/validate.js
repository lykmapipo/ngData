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

            $validate.Promise = $q;

            //available validators
            $validate.validators = [
                'date', 'datetime', 'email', 'equality',
                'exclusion', 'format', 'inclusion', 'length',
                'numericality', 'presence', 'url'
            ];

            //wrap validatejs async validation with angular
            //promises
            $validate._validate = function(attributes, constraints, options) {
                var q = $q.defer();

                $validate
                    .async(attributes, constraints, options)
                    .then(function(response) {
                        q.resolve(response);
                    }).catch(function(error) {
                        q.reject(error);
                    });

                return q.promise;

            };

            //export sql validate
            return $validate;
        });
}());
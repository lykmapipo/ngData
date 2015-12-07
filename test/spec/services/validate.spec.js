'use strict';

describe('validate', function() {
    // load the ngData module
    beforeEach(module('ngData'));

    it('should be injectable', inject(function($validate) {
        expect($validate).to.exist;
    }));

    it('should be able to validate a plain object', inject(function($rootScope, $validate) {
        /*jshint quotmark:double*/
        var constraints = {
            username: {
                presence: true,
                exclusion: {
                    within: ["nicklas"],
                    message: "'%{value}' is not allowed"
                }
            },
            password: {
                presence: true,
                length: {
                    minimum: 6,
                    message: "must be at least 6 characters"
                }
            }
        };

        $validate
            .async({
                username: "nicklas",
                password: "bettr"
            }, constraints)
            .catch(function(error) {

                expect(error.username).to.exist;
                expect(error.password).to.exist;

            });

        $rootScope.$apply();

    }));
});
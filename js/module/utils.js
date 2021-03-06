(function(){

    'use strict';

    angular
        .module('app')
        .service('Utils', function()
        {
            /**
             * Generate an UUID
             * @returns {String}
             */
            function generateUUID()
            {
                var d = new Date().getTime();

                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
                {
                    var r = (d + Math.random() * 16) % 16 | 0; // jshint ignore:line
                    d = Math.floor(d / 16); // jshint ignore:line
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
                });

                return uuid;
            }

            return {
                generateUUID: generateUUID
            };
        });

})();

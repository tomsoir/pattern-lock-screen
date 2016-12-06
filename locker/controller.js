"use strict";

(function(window, $){

    /*
     * Main Class Locker, 
     * provides main usage interface: 
     */

    function Locker(option) {

        var defaults = {
            selector : '#app',
            matrix: [3, 3],
            margin: 20,
            radius: 25,
            repeat: true,
            onSubmit: function(){},
        };

        this.option         = $.extend(defaults, (option || {}));
        this.points         = new Points(this.option);
        this.points.$el     = $(this.option.selector);
        this.points.option  = $.extend({}, defaults, (option || {}) );
        this.points.addTemplate(this.points);

        this.events = new Events();
        this.events.bind(this)
    }

    /*
     * Stay new object instance clean from the
     * non-usable methods, to provide only 
     * necessary interface items
     */
    Locker.prototype = {
        reset: function() {
            this.disable(false);
            this.points.reset();
        },
        disable: function(state) {
            return this.points.disabled = state; 
        },
        error: function(state) {
            return this.points.$el.toggleClass('locker-error', state);
        },
        success: function(state) {
            return this.points.$el.toggleClass('locker-success', state);
        },
        getPattern: function() {
            return this.points.patternAry.join('');
        },
        setPattern: function(pattern, callback) {
            callback(pattern, this);
        },
    };

    /*
     * Export class to the global scope
     * TODO: This just for quick solution 
     */
    window.Locker = Locker;

})(window, jQuery)
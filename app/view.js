"use strict";

(function(window, $){

    var View = function(options) {

        /* Set UI-text config.
         * Special incapsulate to be sure this elements 
         * are uses inside this closure. It is little
         * hard to test it but this it fully hidden
         */

        var message = {
            default : 'Please enter pattern',
            success : 'Login success',
            failed  : 'Login Failed',
            change  : 'Enter your new pattern twice',
            setuped : 'Pattern success changed',
            enter2  : 'Enter Secont time',
            enterRe : 'Incorrect second pattern. Try again',
            short   : 'Pattern is too short. Try again',
            loading : 'Hmmmmm...',
        };

        /* Set UI-elements. 
         * @TODO: Don't forget about context 
         * any of these elements
         */

        var $el = {
            state : $('.state'),
            clock : $('.clock'),
            change: $('.change'),
            lock  : $('.lock'),
            screen: $('.screen'),
            help  : $('.help-text'),
            tests : $('.tests'),
        };

        /* Share main UI methods.
         * 'onLockCB', 'onChangeCB' -> callback injection 
         * for preventing high cohesion of components
         */

        return {
            onLockCB   : (options.onLock || function(){}),
            onChangeCB : (options.onChange || function(){}),

            bindEvents : function(){
                $el.change.on('click', () =>{
                    this.changeState('change');
                    this.toggleTests(false)
                    this.onChangeCB();
                })

                $el.lock.on('click', () =>{
                    this.toggleTests(false);
                    this.toggleChange(false);
                    this.onLockCB();
                })
                return this;
            },

            update: function(stateType){
                this.updateTime();
                this.changeHelp();
                this.changeState(stateType);
                return this;
            },

            // @TODO: split and move to the externa utils file
            updateTime: function(){
                var t = (new Date),
                    h = (t.getHours()<10?'0'+t.getHours():t.getHours()),
                    m = (t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes()),
                    ad = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
                    am = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                $el.clock.html('<b>'+h+':'+m+'</b><i>'+ad[t.getDay()]+', '+am[t.getMonth()]+' '+t.getDate()+'<i>');
                return this;
            },

            toggleChange: function(state){
                $el.screen.toggleClass('show', state);
                return this;
            },

            toggleTests: function(state){
                $el.tests.toggleClass('show', state);
                return this;
            },

            changeState: function(type){
                if(type) $el.state.text(message[type]);
                return this;
            },

            changeHelp: function(){
                $el.help.text(config.pattern.split('').join(','))
                return this;
            },
        }
    };

    /*
     * Export View class to the global scope
     * @TODO: This just for quick solution 
     */
    window.View = View;

})(window, jQuery)
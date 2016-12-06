"use strict";

(function(window, $){

    var App = function() { 
        this.view      = undefined;
        this.locker    = undefined;
        this.lockState = undefined;
    }

    /*
     * Store all App methods for easy testing
     */
    App.prototype = {

        initView: function(){
            this.view = new View({
                onChange: () => {
                    this.locker.reset();
                },
                onLock: () => {
                    this.lockState = undefined;
                    this.view.update('default');
                    this.locker.reset();
                }
            })
            this.view
                .bindEvents()
                .update('default');
        },

        initLocker: function(selector) {
            this.locker = new Locker({
                matrix: [3,3],
                selector: selector,
                onSubmit: (pattern) => { 
                    this.onSubmit(pattern) 
                }
            });
        },

        checkSubmit: function(pattern){
            if(pattern.length<3)      return 'invalid pattern entered';
            if(this.editor.length==0) return 'first pattern entered';
            if(this.editor!=pattern)  return 'pattern not the same';

            return 'pattern valid'
        },

        onEdit: function(pattern){
            switch(this.checkSubmit(pattern)) {

                case 'invalid pattern entered':
                    this.editor = '';
                    this.view.changeState('short');
                    this.locker.error(true);
                    break;

                case 'first pattern entered':
                    this.editor = pattern;
                    this.view.changeState('enter2');
                    this.locker.error(false);
                    break;

                case 'pattern not the same':
                    this.editor = '';
                    this.view.changeState('enterRe');
                    this.locker.error(true);
                    break;

                case 'pattern valid':
                    this.onChange(pattern);
                    break;
            }
        },

        onEnter: function(pattern){
            this.locker.disable(true);
            this.view.changeState('loading');
            $.post('/check', {pattern:pattern}, (res) => {
                (res.success?this.onReqSuccess():this.onReqError())
                this.lockState = res.success;
                this.view.update(this.lockState?'success':'failed');
                this.editor = '';
            }, 'json');
        },

        onChange: function(pattern) {
            this.locker.disable(true);
            this.view.changeState('loading');
            $.post('/change', {pattern:pattern}, (res) => {
                this.editor = '';
                this.locker.success(true);
                this.view
                    .changeState('setuped')
                    .toggleTests(true)
                    .toggleChange(true)
                    .changeHelp();
            }, 'json');
        },

        onSubmit: function(pattern)  {
            this.lockState?
                this.onEdit(pattern):   /* On edit mode */
                this.onEnter(pattern);  /* On enter mode */
        },

        onReqSuccess: function(){
            this.locker.success(true);
            this.view
                .toggleChange(true)
                .toggleTests(true)
                .changeState('change');
        },

        onReqError: function(){
            this.view.toggleChange(false);
            this.locker.disable(false);
            this.locker.error(true);
        },
    }

    /*
     * Export App class to the global scope
     * TODO: This just for quick solution 
     */
    window.App = App;

})(window, jQuery)
/* 
 * Preset of Ajax calls for our apps
 * Easy to test and present current POC 
 * server actions.
 */
$(document).ready(function() {

    $.mockjax({
        url: '/check',
        type: 'post',
        responseTime: 1000,
        contentType: 'text/json',
        dataType: 'json',
        response: function(req){
            var patt = req.data.pattern;
            var state= (patt==config.pattern);
            this.responseText= { 
                success: state
            };
        },
    });

    $.mockjax({
        url: '/change',
        type: 'post',
        responseTime: 1000,
        contentType: 'text/json',
        dataType: 'json',
        response: function(req){
            config.pattern   = req.data.pattern;
            this.responseText= { success: true };
        },
    });

});
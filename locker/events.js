"use strict";

(function(window, $){

    /*
     * Events Utils 
     */
    var utils = {
        highlight : function(points, ctx){
            points.line.remove();
            if (points.rightPattern) {
                if(pattern==points.rightPattern)
                    return points.onSuccess();
                points.onError();
                ctx.error();
            }
            ctx.points.option.onSubmit(ctx.getPattern())
        },
        calcCoords : function(x1, x2, y1, y2) {
            var xDiff =(x2-x1), yDiff=(y2-y1);
            var length= Math.ceil(Math.sqrt(xDiff * xDiff + yDiff * yDiff));
            var angle = Math.round((Math.atan2(yDiff, xDiff) * 180) / Math.PI);
            return { length: length, angle: angle };
        },
    }


    /*
     * Locker Events Class
     */
    function Events() { 

        this.bind = function(ctx){
            ctx.points.$el.on("touchstart mousedown", function(e) {
                ctx.events.onStart.call(this, e, ctx);
            });
        };

        this.onEnd = function(e, ctx) {
            var points  = ctx.points;
            var option  = points.option;
            var pattern = points.patternAry.join('');

            points.$el.off('.locker-move')
                .removeClass('locker-hide');

            if(pattern) utils.highlight(points, ctx);

            e.preventDefault();
        };

        this.onMove = function(e, obj) {
            var points = obj.points;
            var x = e.clientX || e.originalEvent.touches[0].clientX,
                y = e.clientY || e.originalEvent.touches[0].clientY,
                option = points.option,
                li = points.item,
                patternAry = points.patternAry,
                posObj = points.getIdxFromPoint(x, y),
                idx = posObj.idx,
                pattId = idx;


            if (patternAry.length > 0) {
                var laMove = utils.calcCoords(points.lineX1, posObj.x, points.lineY1, posObj.y);
                points.line.css({
                    'width': (laMove.length + 10) + 'px',
                    'transform': 'rotate(' + laMove.angle + 'deg)'
                });
            }


            if (idx && ((option.repeat && patternAry[patternAry.length - 1] !== pattId) || patternAry.indexOf(pattId) === -1)) {
                var elm = $(li[idx - 1]);

                /*
                 * Mark all points in middle from 
                 * previous point and current.
                 */
                if (points.lastPosObj) {
                    var lastPosObj = points.lastPosObj,
                        ip = lastPosObj.i,
                        jp = lastPosObj.j,
                        xDelta = posObj.i - lastPosObj.i > 0 ? 1 : -1,
                        yDelta = posObj.j - lastPosObj.j > 0 ? 1 : -1,
                        iDiff = Math.abs(posObj.i - ip),
                        jDiff = Math.abs(posObj.j - jp);

                    while (((iDiff === 0 && jDiff > 1) || (jDiff === 0 && iDiff > 1) || (jDiff == iDiff && jDiff > 1))) {
                        ip = iDiff ? ip + xDelta : ip;
                        jp = jDiff ? jp + yDelta : jp;
                        iDiff = Math.abs(posObj.i - ip);
                        jDiff = Math.abs(posObj.j - jp);

                        var nextIdx = (jp - 1) * option.matrix[1] + ip,
                            nextPattId = nextIdx;

                        if (option.repeat || patternAry.indexOf(nextPattId) == -1) {
                            /* add path to previous point and line */
                            points.addDirectionClass({i: ip, j: jp});
                            /* highlight added point */
                            points.markPoint($(li[nextPattId - 1]), nextPattId);
                            /* create between line */
                            points.addLine({i: ip,j: jp});
                        }
                    }
                }
                /* add direction to last point and line */
                if (points.lastPosObj) points.addDirectionClass(posObj);
                /* mark the initial point added */
                points.markPoint(elm, pattId);
                /* add initial line */
                points.addLine(posObj);
                points.lastPosObj=posObj;
            }

            e.preventDefault();
        };

        this.onStart = function(e, obj) {
            var points = obj.points;

            if(points.disabled) return;

            var touchMove = e.type == "touchstart" ? "touchmove" : "mousemove";
            var touchEnd  = e.type == "touchstart" ? "touchend" : "mouseup";

            $(this).on(touchMove + '.locker-move', function(e) {
                obj.events.onMove.call(this, e, obj);
            });

            $(document).one(touchEnd, function(){
                obj.events.onEnd.call(this, e, obj);
            });

            var wrap = points.$el.find('.locker-wrap'),
                offset = wrap[0].getBoundingClientRect();
            points.wrapTop = offset.top;
            points.wrapLeft = offset.left;

            obj.reset();

            e.preventDefault();
        };
    }

    /*
     * Export class to the global scope
     * TODO: This just for quick solution 
     */
    window.Events = Events;

})(window, jQuery)
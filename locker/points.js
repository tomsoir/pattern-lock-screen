"use strict";

(function(window, $){

    var Points = function(option) {
        this.patternAry = undefined;
        this.lastPosObj = undefined;

        this.getIdxFromPoint = function(x, y) {
            var option = this.option,
                matrix = option.matrix,
                xi = x - this.wrapLeft,
                yi = y - this.wrapTop,
                idx = null,
                margin = option.margin,
                plotLn = option.radius * 2 + margin * 2,
                qsntX = Math.ceil(xi / plotLn),
                qsntY = Math.ceil(yi / plotLn),
                remX = xi % plotLn,
                remY = yi % plotLn;

            if (qsntX <= matrix[1] && qsntY <= matrix[0] && remX > margin * 2 && remY > margin * 2) {
                idx = (qsntY - 1) * matrix[1] + qsntX;
            }
            return {idx: idx, i: qsntX, j: qsntY, x: xi, y: yi };
        };

        this.markPoint = function(elm, pattId) {
            elm.addClass('selected');       //add the current element on pattern
            this.patternAry.push(pattId);   //push pattern on array
            this.lastElm = elm;
        };

        this.addLine = function(posObj) {
            var getLengthAngle = function(x1, x2, y1, y2) {
                var xDiff = x2 - x1,
                    yDiff = y2 - y1;

                return {
                    length: Math.ceil(Math.sqrt(xDiff * xDiff + yDiff * yDiff)),
                    angle: Math.round((Math.atan2(yDiff, xDiff) * 180) / Math.PI)
                };
            }

            var self = this,
                patternAry = self.patternAry,
                option = self.option;

            var margin = option.margin,
                radius = option.radius,
                newX = (posObj.i - 1) * (2 * margin + 2 * radius) + 2 * margin + radius,
                newY = (posObj.j - 1) * (2 * margin + 2 * radius) + 2 * margin + radius;

            if (patternAry.length > 1) {
                var lA = getLengthAngle(self.lineX1, newX, self.lineY1, newY);
                self.line.css({
                    'width': (lA.length + 10) + 'px',
                    'transform': 'rotate(' + lA.angle + 'deg)'
                });
            }

            var line = $('<div class="locker-line" style="top:' + (newY - 2) + 'px; left:' + (newX - 2) + 'px"></div>');
            self.line = line;
            self.lineX1 = newX;
            self.lineY1 = newY;
            self.$el.append(line);
        };
        // add direction on point and line
        this.addDirectionClass = function(curPos) {
            var point = this.lastElm,
                line = this.line,
                lastPos = this.lastPosObj;

            var direction = [];
            curPos.j - lastPos.j > 0 ? direction.push('s') : curPos.j - lastPos.j < 0 ? direction.push('n') : 0;
            curPos.i - lastPos.i > 0 ? direction.push('e') : curPos.i - lastPos.i < 0 ? direction.push('w') : 0;
            direction = direction.join('-');

            if (direction) {
                point.add(line).addClass(direction + " dir");
            }
        };
        this.addTemplate = function(points) {
            var $el = points.$el,
                option = points.option,
                matrix = option.matrix,
                margin = option.margin,
                radius = option.radius,
                html = ['<ul class="locker-wrap" style="padding:' + margin + 'px">'];
            for(var i = 0, ln = matrix[0] * matrix[1]; i < ln; i++) {
                html.push('<li class="locker-item" style="margin:' + margin + 'px; width : ' + (radius * 2) + 'px; height : ' + (radius * 2) + 'px; -webkit-border-radius: ' + radius + 'px; -moz-border-radius: ' + radius + 'px; border-radius: ' + radius + 'px; "><div class="locker-point"></div></li>');
            }
            html.push('</ul>');
            $el.html(html.join('')).css({
                'width': (matrix[1] * (radius * 2 + margin * 2) + margin * 2) + 'px',
                'height': (matrix[0] * (radius * 2 + margin * 2) + margin * 2) + 'px'
            });
            points.item = points.$el.find('.locker-item');

            if($el.css('position') == "static"){
                $el.css('position', 'relative');  
            }
        };
        this.reset = function(){
            this.patternAry = [];
            this.lastPosObj = null;
            this.$el
                .removeClass('locker-error locker-success')
                .find('.locker-line')
                .remove();
            this.item
                .removeClass([
                    'selected','dir',
                    's','n','w','e',
                    's-w','s-e','n-w','n-e'
                ].join(' '));
        }
    };

    /*
     * Export class to the global scope
     * TODO: This just for quick solution 
     */
    window.Points = Points;

})(window, jQuery)
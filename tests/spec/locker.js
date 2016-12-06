describe("Locker", function() {

    var locker;
    var selector = '#app';

    var touchEmulator = function(pattern, contxt){

        var option = contxt.points.option;
        var matrix = option.matrix;
        var margin = option.margin;
        var radius = option.radius;
        var pattern = String(pattern).split('');

        contxt.reset();
        contxt.points.wrapLeft = 0;
        contxt.points.wrapTop = 0;

        for (var i = 0; i < pattern.length; i++) {
            var idx = pattern[i] - 1,
                x = idx % matrix[1],
                y = Math.floor(idx / matrix[1]),
                clientX = x * (2 * margin + 2 * radius) + 2 * margin + radius,
                clientY = y * (2 * margin + 2 * radius) + 2 * margin + radius;

            contxt.events.onMove.call(null, {
                clientX: clientX,
                clientY: clientY,
                preventDefault: function(){}
            }, contxt);
        }
    };

    describe("Matrix instance", function() {
        var rows = 0;
        var cols = 0;
        beforeEach(function() {
            rows = Math.ceil(Math.random()*5);
            cols = Math.ceil(Math.random()*5);
            locker = new Locker({matrix: [rows,cols], selector: selector});
        });
        it("{end} Equal Randome items", function() {
            expect($('#app li').length).toEqual((rows*cols));
        });
    });

    describe("Base usage", function() {
        beforeEach(function() {
            locker = new Locker({
                matrix: [4,4],
                selector: selector
            });
        });

        it("should be init", function() {
            expect(typeof(locker)).toEqual('object');
            expect(locker.option).toBeDefined();
        });

        it("defined sub classes", function() {
            expect(locker.events).toBeDefined();
            expect(locker.points).toBeDefined();
        });
    });

    describe("Unlocking the application", function() {
        beforeEach(function() {
            locker = new Locker({
                matrix: [2,2],
                selector: selector
            });
            locker.setPattern(12, touchEmulator)
        });

        it("{end} Touch event imitation", function() {
            expect($('#app li.selected').length).toEqual(2);
        });
    });

    describe("Changing a pattern", function() {
        beforeEach(function() {
            locker = new Locker({
                matrix: [4,4],
                selector: selector
            });
            locker.setPattern(12463, touchEmulator)
            locker.setPattern(1246, touchEmulator)
        });

        it("{end} Equal of 2 entrance", function() {
            expect($('#app li.selected').length).toEqual(5);
        });
    });

    // describe("other task cases", function() { });

    // ...and so on, needs more time! :( 

});
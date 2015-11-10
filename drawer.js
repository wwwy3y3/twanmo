var Drawer= function (canvasId) {
	this.left= 20;
	this.top= 20;
	this.canvasId= canvasId;
	this.canvas = new fabric.StaticCanvas(this.canvasId);
	this.canvas.setWidth(1000);
}

Drawer.prototype.draw = function(squares, tris) {
	this.drawRects(squares);
	this.drawTris(tris);
};

Drawer.prototype.drawRects = function(num) {
	var self= this;
	var canvas= self.canvas;
	for (var i = 0; i < num; i++) {
		// create a rectangle object
		var shape = new fabric.Rect({
		  left: self.left,
		  top: self.top,
		  fill: 'blue',
		  width: 50,
		  height: 50
		});

		// "add" rectangle onto canvas
		canvas.add(shape);

		// move space for next shape
		self.left += 70;
	};
};

Drawer.prototype.drawTris = function(num) {
	var self= this;
	var canvas= self.canvas;
	for (var i = 0; i < num; i++) {
		// create a rectangle object
		var shape = new fabric.Triangle({
		  left: self.left,
		  top: self.top,
		  fill: 'blue',
		  width: 50,
		  height: 50
		});

		// "add" rectangle onto canvas
		canvas.add(shape);

		// move space for next shape
		self.left += 70;
	};
};

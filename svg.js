/**
 *	svg stuff
**/
function Svg (options) {


	this.width = 1920;
	this.height = 1200;

	
	this.svg = null;

	// The child objects for svg!
	this.defs = null;
	this.paths = null;

	this.pattern = options.pattern;
	this.pathStrings = options.pathStrings;
}


Svg.prototype.init = function () {

	this.createSvg();

	this.defs = new Defs(this);
	this.defs.init();

	// TODO! thsi entire path logic needs to be cleaned up
	this.paths = new Path(this.pathStrings);

	this.paths.init();

	this.addPaths(this.paths.paths);


	return this.append();
}

Svg.prototype.append = function () {

	document.body.appendChild(this.svg);
}

Svg.prototype.createSvg = function () {

	this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	// initial setting of dimensions.
	// this needs to be dynamic some day :)
	this.updateDimensions();

};

Svg.prototype.addPaths = function (path) {
	
	var i = path.length;

	while (i--) {
		this.svg.appendChild(path[i]);
	}
}



// update / set the dimensions of svg element.
Svg.prototype.updateDimensions = function () {

	var widthStr = (this.width) + 'px',
		heightStr = (this.height) + 'px';


	// adjusting the height and weight attributes will scale the svg.
	//
	// Problem: I want the elements to change positions relative to eachother
	// not just change the size of the presented svg.
	// 
	this.svg.setAttributeNS(null, 'width', widthStr);
	this.svg.setAttributeNS(null, 'height', heightStr);


	// Coordinate system is related to viewBox, not h/w.
	// The viewbox attribute defines the coordinate system within.
	//
	// Two first numbers represent the upper left corner, the origin if you will.
	// The latter two is the width and height.
	// changing the former to say "50 50" will remove 50 points from the axis's
	// changing the actual position of an element at "x: 50 , y: 50" to "x: 0, y: 0"
	// as 50,50 is now the new coordinate system origin.
	this.svg.setAttributeNS(null, 'viewBox', "50 50 1920 1200");
}

/** function with the goal of updating defs element of svg.
 *	
 *	Starting off by adding defs element as child. 
 *
 *	TODO! Actual updating.
**/
Svg.prototype.updateDefs = function (defs) {

	this.svg.appendChild(defs);

}
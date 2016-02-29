/**
 *	Mission Control
 *
**/
function Galla (options) {

	this.bounds = new Bounds();

	// options currently only is related to svg
	// else should probably store some values here
	this.svg = new Svg(options);
}

Galla.prototype.init = function () {

	this.bounds.init();

	this.svg.init();
}

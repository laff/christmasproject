/**
 *	Mission Control
 *
 *	Stop using "this" in constructor?
 *	Rather just put it all in an object like:
 *	Galla.prototype = { bounds: new Bounds(), svg: .....
 *	?
 *
**/

// I want this run first.
// global variable tooo
var bounds = new Bounds().init();

function Galla (options) {

	// options currently only is related to svg
	// else should probably store some values here
	this.svg = new Svg(options).init();
}
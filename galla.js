/**
 *	Mission Control
 *
 *	Stop using "this" in constructor?
 *	Rather just put it all in an object like:
 *	Galla.prototype = { bounds: new Bounds(), svg: .....
 *	?
 *
**/
function Galla (options) {

	// options currently only is related to svg
	// else should probably store some values here
	this.svg = new Svg(options).init();

	bounds.setImages(options.patterns);
}
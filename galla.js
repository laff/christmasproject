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

	this.bounds = new Bounds();

	// options currently only is related to svg
	// else should probably store some values here
	this.svg = new Svg(options);

	/**
	 *	Alternative init
	 *	TODO! decide on how to initialize everything.
	**/
	(function (galla) {

		galla.bounds.init();
		galla.svg.init();
	})(this);
}
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

	// TODO! Clean up this.
	// I seem to be storing these options all over the place.
	this.options = options;

	// setImages is a misleading name. 
	// makes so that images are categorized and numbers for frames.
	bounds.setImages(options.patterns);

	//this.svg = new Svg(options).init();

	this.svg = null;

	this.frame = null

	//this.init();
}

Galla.prototype.init = function () {


	var options = this.options,
		svg;


	// self executing function that returns a new frame.
	// the function is passed the creation & setting of the new svg as an argument.
	// this is evaluated before the function is executed.
	// making the new Svg available to the frame.
	this.frame = (function () {
		
			return new Frame();
		}
	)(this.svg = new Svg(options).init());
}
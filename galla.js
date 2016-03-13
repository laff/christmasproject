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

}

/**
 *	TODO!
 *	Clean up in the logic. Get all classes within the same namespace,
 *	gather functions that are common blablablabblablabblabla objectify
**/
Galla.prototype = {

	frames: null,

	svg: null,

	init: function () {
		var options = this.options,
			svg;


		// self executing function that returns a new frame.
		// the function is passed the creation & setting of the new svg as an argument.
		// this is evaluated before the function is executed.
		// making the new Svg available to the frame.
		this.frames = (function () {
			
				return new Frames();
			}
		)(this.svg = new Svg(options).init());
	},


	/**
	 *
	**/
	update: function () {

		this.frames.update();

		// this function is called like this since update() is called within init.....
		// sigh
		this.frames.updateFrames();

	}
}
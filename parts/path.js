/**
 *	Path creation object!
 *
 *
 *	TODO! One day there will be shapes and stuff.
 *	Now only static creation of paths!
 *
 *	Passing the fill variable made out of hte pattern chosen.
 *
 *	TODO! clean up the variables being sent to this.
**/
function Path (anchor, pathStr, fill, dimensions) { //pathStrings) {

	this.paths = [];

	// TODO this needs to be dynamic yall.
	// based on patterns!

	this.anchor = anchor;

	this.fill = fill;

	this.fillStr = "url(#" + fill.id + ")";

	//this.dimensions = dimensions;

	//this.pathStrings = pathStrings;

	this.element = this.create(pathStr);

	this.adjust(dimensions);
		
}

Path.prototype = {

	init: function () {

		// TODO this iterating stuff needs to be more sophisticated br0
		this.iterate();

		
	},

	/**
	 *	Method with the goal of upating the path coordinates AND adjust the pattern.
	**/
	update: function (anchor, pathStr, dimensions) {

		this.anchor = anchor;
		

		this.element.setAttributeNS(null, 'd', pathStr);

		this.adjust(dimensions);

	},

	/**
	 *	Method that adjusts the pattern!
	**/
	adjust: function (dimensions) {

		// console.log("_____________________" +this.fill.id+ "___________________");

		var pat = document.getElementById(this.fill.id),
			img = pat.firstChild,


		// need to adjust anchor by max angles of rows & columns
		//
		// need data related to the frame size.


			// the x & y anchor coordinates may be wrong
			// doing it statically  /testing.
			// making it so that the x/y is further up&left than any of the other frame's corners.
			ax = (this.anchor.x * .9), 
			ay = (this.anchor.y * .9),

			aw = (this.fill.width),
			ah = (this.fill.height),


			// width
			lw = (dimensions.topWidth > dimensions.bottomWidth) ?
				dimensions.topWidth : dimensions.bottomWidth,

			// finding the longest of the frame heights
			lh = (dimensions.leftHeight > dimensions.rightHeight) ?
				dimensions.leftHeight : dimensions.rightHeight;


		/**
		 *	This function finds the new width and height of the image.
		 *
		 *	The new image should always be 11,11111111111% bigger than the frame
		 *	to make up for the anchor skew?
		 *
		 *	The image dimension which is the furthest off the frame needs to be
		 *	prioritized? Does that work?
		**/
		function custom () {


			var frameWidth = lw,
				frameHeight = lh,
				imageWidth = aw,
				imageHeight = ah,

				safetyRatio = 1.11111111,

				widthRatio = (imageWidth / frameWidth),
				heightRatio = (imageHeight / frameHeight),

				ratio = (widthRatio < heightRatio) ? widthRatio : heightRatio;

				newWidth = ((imageWidth / ratio) * safetyRatio),
				newHeight = ((imageHeight / ratio) * safetyRatio);



			// console.log(widthRatio, heightRatio);

			// console.log("frame / image width: " + frameWidth + " : " + newWidth);
			// console.log("frame / image height: " + frameHeight + " : " + newHeight);

			return {width: newWidth, height: newHeight};
		}


		var customDimensions = custom();

		// if both the shortest height and the shortest width is longer than
		// the image height / width... scale down!
/*
		var ratio,
			customWidth = aw,
			customHeight = ah,
			orientation = this.fill.orientation;


		// only adjust if images are too big for frames? WTF?
		// must be more than 1.111111111111 times bigger as the anchor is skewed .9!
		if (aw > lw && ah > lh) {

			//console.log("image is bigger than frame");

			// if height is greater than width
			// find ratio between fill width and frame width
			if (ah > aw) {
				//console.log("image is taller than wide");
				ratio = (lw / aw);
				//console.log("ratio is " + ratio);


				// console.log(customHeight / customWidth);

				customWidth = (aw * ratio); //lw;

				customHeight = (ah * ratio);//((lw / aw) * ah);

				// console.log(customHeight / customWidth);

			} else {

				//console.log("image is wider than tall");
				ratio = (lw / aw);
				//console.log("ratio is " + ratio);

				//console.log(customHeight / customWidth);

				customHeight = (ah * ratio);//lh;

				customWidth = (aw * ratio);//((lh / ah) * aw);

				// console.log(customHeight / customWidth);

			}

			//customHeight *= 1.3;
			//customWidth *= 1.3;


		} else {

			// console.log("image is smaller than frame");

			if (lh > lw) {
				// console.log("frame is taller than it is wide");
				ratio = 0;
				// console.log("ratio is " + ratio);
// 
			} else {
				// console.log("frame is wider than it is tall");
				ratio = 0;
				// console.log("ratio is " + ratio);

				var r = (lw / aw);

				aw = lw;
				ah = (ah * r);

				customWidth = aw;
				customHeight = ah;

			}
		}
*/

		// pattern stuff
		pat.setAttributeNS(null, 'width', (customDimensions.width + ax));
		pat.setAttributeNS(null, 'height', (customDimensions.height + ay));
			

		// image coordinates and lengths!
		img.setAttributeNS(null, 'x', ax);
		img.setAttributeNS(null, 'y', ay);
		
		img.setAttributeNS(null, 'width', customDimensions.width);
		img.setAttributeNS(null, 'height', customDimensions.height);

		/*

		// TODO! Create functionality that adjusts the image to the
		// frames or frames created / assigned to it!
		img.setAttributeNS(null, 'x', image.x);
		img.setAttributeNS(null, 'y', image.y);
		img.setAttributeNS(null, 'width', image.width);
		img.setAttributeNS(null, 'height', image.height);
		*/

	},

	/**
	 *	Quick and stupid way of adding the static path strings.
	 *	the path elements should have ids? or should they?
	**/
	iterate: function () {

		var paths = this.pathStrings,
			i = paths.length;

		while (i--) {
			this.create(paths[i]);
		}
	},

	/**
	*	creating and adding paths to array.
	*
	*	TODO! find best way to update added paths?
	**/
	create: function (str) {

		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		path.setAttributeNS(null, 'd', str);
		path.setAttributeNS(null, 'fill', this.fillStr);

		this.element = path;

		return path;
	}
}
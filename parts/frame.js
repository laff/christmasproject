/**
 *	Class for storing information about a frame.
 *	
 *	TODO! DECIDE ONCE AND FOR ALL WHEN TO USE INIT FUNCTIONS
**/
function Frame (vertices) {

	this.vertices = vertices || [{x: 0, y: 0}];

	this.calcDimensions();

	this.createPath(this.createPathStr());

}

Frame.prototype = {

	path: null,

	dimensions: null,

	/**
	 *	Method that calculates the dimensions of the frame.
	 *
	 *	Used for adjusting image / pattern size
	**/
	calcDimensions: function () {

		// TODO! this function needs a new home. also found in frames.js
		function getDistance (point1, point2) {

			var A = (point1.x >= point2.x && point1.y >= point2.y) ? point2 : point1,
				B = (point1.x >= point2.x && point1.y >= point2.y) ? point1 : point2,
				distanceAB = Math.sqrt((Math.pow((B.x - A.x), 2)) + (Math.pow((B.y - A.y), 2)));

			return distanceAB;
		}

		var vertices = this.vertices,
			topWidth = getDistance(vertices[0], vertices[3]),
			bottomWidth = getDistance(vertices[1], vertices[2]),
			leftHeight = getDistance(vertices[0], vertices[1]),
			rightHeight = getDistance(vertices[3], vertices[2]);


		this.dimensions = {

			topWidth: topWidth,
			bottomWidth: bottomWidth,
			leftHeight: leftHeight,
			rightHeight: rightHeight
		}
	},


	/**
	 *	This method has the task of updating the frame path?
	 *	Is this really the way I want to do this? 600 function calls?
	**/
	update: function (updated) {

		this.vertices = updated;

		this.calcDimensions();

		this.path.update(this.vertices[0], this.createPathStr(), this.dimensions);
	},

	/**
	 *	Method that returns a string based on the
	 *	vertices
	**/
	createPathStr: function () {
		// first assemble the pathstring!

		var vert = this.vertices,
			len = vert.length,
			i = 1,
			org = vert[0],
			prefix,
			// anchor
			pathStr = 'M' + org.x + ',' + org.y + ' ';

		for (i; i < len; i++) {

			pathStr += 'l' + (vert[i].x - vert[i-1].x) + ',' + (vert[i].y - vert[i-1].y) + ' ';
		}

		pathStr += 'l' + (vert[len-1].x - vert[0].x) + ',' + (vert[len-1].y - vert[0].y);

		return pathStr;
	},

	/**
	 *	Method that creates and stores the path element.
	 *
	**/
	createPath: function (pathStr) {

		this.addPath(new Path(
						this.vertices[0],
						pathStr,
						galla.svg.fill.get(),
						this.dimensions
					));
	},

	/**
	 *	Method that calls the Svg.addPath() method
	 *	This is to add the newly created path element to the svg.
	**/
	addPath: function (path) {

		this.path = path;

		galla.svg.addPath(path.element);
	},

	/**
	 *	Remove the path element related to this frame.
	**/
	remove: function () {

	}
}


/*

	"M50,50 l0,393 l301,0 l0,-393 l-301,0",	// upper left
	"M50,453 l0,393 l301,0 l0,-393 l-301,0", // lower left
	"M361,453 l0,393 l301,0 l0,-393 l-301,0" // lower right
	"M361,50 l0,393 l301,0 l0,-393 l-301,0", // upper right

*/
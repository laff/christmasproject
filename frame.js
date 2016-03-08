/**
 *	Class for storing information about a frame.
**/
function Frame (vertices) {

	this.vertices = vertices || [{x: 0, y: 0}];

	this.calcDimensions();

	this.createPath();

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
	 *	Method that returns a string based on the
	 *	vertices
	**/
	createPath: function () {

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

		this.addPath(new Path(
						org,
						pathStr,
						galla.svg.fill.next(),
						this.dimensions
					));
	},

	// function that adds path to svg
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
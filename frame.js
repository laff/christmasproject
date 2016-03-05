/**
 *	Class for storing information about a frame.
**/
function Frame (vertices) {

	this.vertices = vertices;

	this.createPath();

	this.path = null;

}

Frame.prototype = {

	/**
	 *	Method that returns a string based on the
	 *	vertices
	**/
	createPath: function () {

		// first assemble the pathstring!

		var vert = this.vertices,
			len = vert.length,
			i = 0,
			prefix,
			pathStr = '';

		for (i; i < len; i++) {

			prefix = (i) ? 'l' : 'M';

			pathStr += prefix + vert[i].x + ',' + vert[i].y + ' ';

		}



		this.addPath(new Path(pathStr));
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
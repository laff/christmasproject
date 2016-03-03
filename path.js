/**
 *	Path creation object!
 *
 *
 *	TODO! One day there will be shapes and stuff.
 *	Now only static creation of paths!
 *
 *	Passing the fill variable made out of hte pattern chosen.
**/
function Path (pathStrings) {

	this.paths = [];

	// TODO this needs to be dynamic yall.
	// based on patterns!
	this.fill = "url(#carl";

	this.pathStrings = pathStrings;

	
}

Path.prototype = {

	init: function () {

		// TODO this iterating stuff needs to be more sophisticated br0
		this.iterate();
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
		path.setAttributeNS(null, 'fill', this.fill);

		this.paths.push(path);
	}
}
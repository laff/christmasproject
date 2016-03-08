/**
 *	defs (and/or pattern?) stuff
**/
function Defs (svg) {

	// storing that svg!
	this.svg = svg;

	this.patterns = svg.patterns;

	this.patternCount = this.patterns.length;

	this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

}

Defs.prototype = {

	/**
	 *	Init
	 *
	**/
	init: function () {

		// TODO! initial pattern adddddddddd?
		// should there be multiple patterns, this guy needs to evolve.
		//
		// some logic added to bounds.
		
		//this.addPattern(this.pattern);

		var patternCount = this.patterns.length;

		while (patternCount--) {
			this.addPattern(this.patterns[patternCount]);
		}


		this.updateDefs();

	},

	/**
	 *	Generator function that returns a new fill id!
	 *
	**/
	fillGen: function* () {

		var i = this.patternCount,
			id;

		while (i--) {
			yield this.patterns[i].id;
		}
	},

	/**
	 *	Function with the goal of updating the defs element of the parent svg.
	**/
	updateDefs: function () {
		this.svg.updateDefs(this.defs);
	},

	/**
	 *	defs element is created.
	 *	now creating pattern element (here or creating a new object?)
	 *	Adding the properties of object passed.
	 *
	 *	TODO! figure out if there is any need for multuple images in each
	 *	pattern? if so, restructure.
	 *
	**/
	addPattern: function (pattern) {

		// shortcut
		var defs = this.defs,
			image = pattern.image,
			// creating image element,
			pat = document.createElementNS('http://www.w3.org/2000/svg', 'pattern'),
			img = document.createElementNS('http://www.w3.org/2000/svg', 'image');

		// all the setting
		// can some of this be dynamic? like detectic image size?
		// all static for now.
		pat.setAttributeNS(null, 'id', pattern.id);
		pat.setAttributeNS(null, 'patternUnits', pattern.patternUnits);
		pat.setAttributeNS(null, 'width', pattern.width);
		pat.setAttributeNS(null, 'height', pattern.height);

		// image related settin
		// TODO! figure out what why and if not 'xlink'
		img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image.href);

		// TODO! Create functionality that adjusts the image to the
		// frames or frames created / assigned to it!
		img.setAttributeNS(null, 'x', image.x);
		img.setAttributeNS(null, 'y', image.y);
		img.setAttributeNS(null, 'width', image.width);
		img.setAttributeNS(null, 'height', image.height);

		// adding image element to pattern element.
		pat.appendChild(img);

		// adding pattern element to defs element!
		defs.appendChild(pat);

		// calling updateDefs to.. update... defs
		this.updateDefs();
	}
}
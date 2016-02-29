/**
 *	defs (and/or pattern?) stuff
**/
function Defs (svg) {

	this.patterns = [];

	// storing that svg!
	this.svg = svg;
	this.pattern = svg.pattern;

	this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

}

/**
 *	Init
 *
**/
Defs.prototype.init = function () {

	// TODO! initial pattern adddddddddd?
	// should there be multiple patterns, this guy needs to evolve.
	this.addPattern(this.pattern);

	this.updateDefs();
}


/**
 *	Function with the goal of updating the defs element of the parent svg.
**/
Defs.prototype.updateDefs = function () {

	this.svg.updateDefs(this.defs);
}

/**
 *	defs element is created.
 *	now creating pattern element (here or creating a new object?)
 *	Adding the properties of object passed.
 *
 *	TODO! figure out if there is any need for multuple images in each
 *	pattern? if so, restructure.
 *
**/
Defs.prototype.addPattern = function (pattern) {

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

/**
 *
 *	Initial thoughts /  plan for scriptyfication. aka. STEP 1
 *
 *
 * The main tag type / element.
 *	- svg. this one needs to.. adjust ot screen size?
 *	Control all the paths it contains.
 *
 *
 *	So there are two svg tag types we want to create and control.
 *
 *	- defs (more than pattern?). This is for the background, pref based on an image.
 *	image must be skewed in sync with its frame / parent path.
 *
 *	- path. shape & position.
 *
 *
**/

/**
 *	Step 2
 *
 *	- Create polygon(?) object for creating shapes out of paths.
 *	
 *	- listener to ensure that svg is synced with window size.
 *
 *	- Create structure object for adjusting spacing and positions of polygons?
 *
**/

/**
 *	STEP X!
 *	
 *	Use factory pattern for creating the different gallery styles?
 *
**/

/**
 *	Object that controls dimensions / bounds of the svg	
 *
 *	
 *
**/
function Bounds () {

	// SCREEN PROPERTIES!
	// 
	// other properties available are ones related to color/pixel depth (?)
	// And values related to which screen the current window is at.
	// availHeight is of a lower value on a screen with a startbar for example.
	//
	// Should store available height and width instead of actual screen h/w?
	//
	// orientation property stores angle and orientation type. 1920*1200 setup like my personal screens is called "lanscape-primary".
	this.sHeight = null;
	this.sWidth = null;

	// These are the window viewport values.
	// use this to responsify the created svg size!
	this.iHeight = null;
	this.iWIdth = null;


	// last time resize was responded to
	this.resizeTimer = Date.now();
	this.waiting = false;
}

/**
 *	I think I prefer adding methods & shit with prototype like this.
 *
**/
Bounds.prototype = {

	init: function () {

		this.setDisplay();

		window.onresize = this.response;
		screen.orientation.onchange = this.orient;

		console.log("Bounds initiated. onresize & orientation event handlers set");
	},

	setDisplay: function () {

		this.sHeight = screen.availHeight;
		this.sWidth = screen.availWidth;
	},

	/**
	 *	event triggered on screen orientation change.
	 *	atm only calls setDisplay to adjust to the new "screen size".
	 *
	 *	TODO! Add logic for everything to get new orientation.
	**/
	orient: function () {
		this.setDisplay();
	},

	/**
	 *	some way of postponing  / limiting viewport value updates on resize.
	**/
	response: function () {

		var setViewport = function () {

			this.iHeight = window.innerHeight;
			this.iWidth = window.innerWidth;

			this.resizeTimer = Date.now();
			this.waiting = false;
		};

		if (!this.waiting) {

			this.waiting = true;

			setTimeout(function () {

				setViewport();
			}, 500);
		}
	}
}

var bounds = new Bounds();

bounds.init();

//Bounds.prototype.resii
/*
window.onresize = function () {

	console.log("resized");

};
*/


/**
 *	Starting off with global objects, enclosed namespaces later.
 *	not using es6 right off the bat, will include at later stage.
 *	Not using classes (yet?).
**/

/**
 *	svg stuff
**/
function Svg () {


	this.width = 1920;
	this.height = 1200;

	
	this.svg = null;

	// Am i dumb calling functions like this?
	// certainly looks better than calling it after the constructor is called.
	// that way it just uglifies the "main app function stuff".
	this.createSvg();


	this.paths = null;

}

Svg.prototype.createSvg = function () {

	this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	// initial setting of dimensions.
	// this needs to be dynamic some day :)
	this.updateDimensions();

};

Svg.prototype.addPath = function (path) {
	
	var i = path.length;

	while (i--) {
		this.svg.appendChild(path[i]);
	}
}



// update / set the dimensions of svg element.
Svg.prototype.updateDimensions = function () {

	var widthStr = (this.width) + 'px',
		heightStr = (this.height) + 'px';


	// adjusting the height and weight attributes will scale the svg.
	//
	// Problem: I want the elements to change positions relative to eachother
	// not just change the size of the presented svg.
	// 
	this.svg.setAttributeNS(null, 'width', widthStr);
	this.svg.setAttributeNS(null, 'height', heightStr);


	// Coordinate system is related to viewBox, not h/w.
	// The viewbox attribute defines the coordinate system within.
	//
	// Two first numbers represent the upper left corner, the origin if you will.
	// The latter two is the width and height.
	// changing the former to say "50 50" will remove 50 points from the axis's
	// changing the actual position of an element at "x: 50 , y: 50" to "x: 0, y: 0"
	// as 50,50 is now the new coordinate system origin.
	this.svg.setAttributeNS(null, 'viewBox', "50 50 1920 1200");
}

/** function with the goal of updating defs element of svg.
 *	
 *	Starting off by adding defs element as child. 
 *
 *	TODO! Actual updating.
**/
Svg.prototype.updateDefs = function (defs) {

	this.svg.appendChild(defs);

}

/**
 *	defs (and/or pattern?) stuff
**/
function Defs (svg) {

	this.patterns = [];

	// storing that svg!
	this.svg = svg;

	this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

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

/**
 *	Path creation object!
 *
 *
 *	TODO! One day there will be shapes and stuff.
 *	Now only static creation of paths!
 *
 *	Passing the fill variable made out of hte pattern chosen.
**/
function Path (fill) {

	this.paths = [];


	this.fill = fill;
}

/**
 *	Quick and stupid way of adding the static path strings.
 *	the path elements should have ids? or should they?
**/
Path.prototype.iterate = function (paths) {

	var i = paths.length;

	while (i--) {
		this.create(paths[i]);
	}
};

/**
 *	creating and adding paths to array.
 *
 *	TODO! find best way to update added paths?
**/
Path.prototype.create = function (str) {

	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	path.setAttributeNS(null, 'd', str);
	path.setAttributeNS(null, 'fill', this.fill);

	this.paths.push(path);
}


/**
 *	cba creating vanilla domready.
 *	using what is claimed to be the smallest subset of the jQuery dom ready event listener.
 *
**/
DomReady.ready(function () {

	var svg = new Svg(),
		org = document.getElementsByTagName('svg')[0],

		// creating temporary pattern object.
		// gotta find a better place &  way for this info.
		pattern = {

			id: 'carl',
			patternUnits: 'userSpaceOnUse',
			width: '662',
			height: '846',
			image: {
				href: '../images/carl.jpg',
				x: '50',
				y: '50',
				width: '612',
				height: '796'
			}
		},
		pathStrings = [
			"M50,50 l0,393 l301,0 l0,-393 l-301,0",
             "M50,453 l0,393 l301,0 l0,-393 l-301,0",
             "M361,50 l0,393 l301,0 l0,-393 l-301,0",
             "M361,453 l0,393 l301,0 l0,-393 l-301,0"
		],
		defs = new Defs(svg),

		// TODO! so many things wrong now.
		// add dynamic fill str function
		// create object for controlling paths better.
		paths = new Path("url(#carl)");

	// adding the strings.
	paths.iterate(pathStrings);


	// stuff beneath is the action!
	//
	// sending pattern to crated defs pattern.
	defs.addPattern(pattern);

	// adding defs to svg element.
	// ugly. l2code
	defs.updateDefs(svg);


	// adding paths to svg
	// TODO! function names doesnt make sense now in relation to paths.
	// TODOOOOO
	svg.addPath(paths.paths);


	// adding the svg to our document!
	// getting late, things needs to happen quickly
	document.body.appendChild(svg.svg);
});
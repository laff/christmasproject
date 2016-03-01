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

	this.waiting = false;
}

/**
 *	I think I prefer adding methods & shit with prototype like this.
 *
**/
Bounds.prototype = {

	init: function () {

		this.setDisplay();
		this.setInner();

		window.onresize = this.response;
		screen.orientation.onchange = this.orient;

		return this;
	},

	/**
	 *	event triggered on screen orientation change.
	 *	atm only calls setDisplay to adjust to the new "screen size".
	 *
	 *	TODO! Add logic for everything to get new orientation,
	 *	like flipping images etc...
	**/
	orient: function () {
		bounds.setDisplay();
	},

	/**
	 *	some way of postponing  / limiting viewport value updates on resize.
	**/
	response: function () {

		if (!bounds.waiting) {

			bounds.waiting = true;

			setTimeout(function () {
				bounds.waiting = false;
				bounds.setInner();
			}, 500);
		}
	},

	setDisplay: function () {

		this.sHeight = screen.availHeight;
		this.sWidth = screen.availWidth;	
	},

	setInner: function () {

		this.iHeight = window.innerHeight;
		this.iWidth = window.innerWidth;

		// TODO! figure out the best way to do these things.
		// send variables to svg, not tell svg to pick them up here?
		// 
		// First time setInner is called, there is no "galla" object.
		// the initiation of the galla object calls udpateDimensions itself.
		(typeof galla == "undefined") ? null : galla.svg.updateDimensions();


		// NEW LOGIC!
		// for creating frames! When done can scrap the stuff above & imitate the logic elsewhere.
		this.frameup();
	},

	/**
	 *	Consider size of available space, create frames.
	 *	Frames should be based on options, currently going fixed.
	 *
	 *	The data created by this method will make the foundations of the path creations.
	**/
	frameup: function () {

		console.log("I am all the logic for frames");


	}
}
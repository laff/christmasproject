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

	setDisplay: function () {

		this.sHeight = screen.availHeight;
		this.sWidth = screen.availWidth;	
	},

	setInner: function () {

		this.iHeight = window.innerHeight;
		this.iWidth = window.innerWidth;

		// TODO! figure out the best way to do these things.
		// send variables to svg, not tell svg to pick them up here?
		(typeof galla == "undefined") ? null : galla.svg.updateDimensions();
		
	},

	/**
	 *	event triggered on screen orientation change.
	 *	atm only calls setDisplay to adjust to the new "screen size".
	 *
	 *	TODO! Add logic for everything to get new orientation.
	**/
	orient: function () {
		(typeof galla == "undefined") ? null : galla.setDisplay();
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
	}
}
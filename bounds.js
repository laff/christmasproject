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
	this.iWidth = null;

	this.waiting = false;



	// this is called patterns elsewhere
	// the jury is still out
	this.images = null;

	// array simulating the structure of frames.
	this.structure = null;
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
		//(typeof galla == "undefined") ? null : galla.svg.updateDimensions();


		// NEW LOGIC!
		// for creating frames! When done can scrap the stuff above & imitate the logic elsewhere.
		//(typeof galla == "undefined") ? null : this.frameup();


		// The following is logic that only serves any purpose once the Galla object is instantiated.
		if (typeof galla != "undefined") {

			galla.svg.updateDimensions();

			console.log("bounds just called updatedimensions!");

			//this.frameup();
		}
	},

	/**
	 *	Consider size of available space, create frames.
	 *	Frames should be based on options, currently going fixed.
	 *
	 *	The frames have stuff in common, they have a "top level" division
	 *	The following is a "study" based on the inspirational pictures.
	 *	
	 *
	 *	1. Top level ways of dividing the frames.
	 *		- vertical splits into 3.
	 *		- diagonal split in 2 (vertical, based on the top/bottom sides, not the corners).
	 *		- diagnoal split in 3 (same as above).
	 *
	 *	2. Second level way of dividing the divided frames!
	 *		- horisontal splits
	 *		- diagonal (horisontally directed) splits
	 *		- 1st and 3rd frames have child frames with common angles.
	 *
	 *	3. Can any window proportions display any kind of frame composition?
	 *		- TODO! Find out.
	 *
	 *
	 *	4. Should the frame composition be dynamic?
	 *		- Can be based on amount of pictures.
	 *			* amount of frames
	 *			* spacing between frames
	 *			* spacing between frames & window
	 *			* change size of images to fit.
	 *		
	 *		- As pictures differ in dimensions, some might fit better certain places.
	 *		Deciding where to put each image is probably easier pre-frameup,
	 *		but then one need to know the frame composition before hand. Right?
	 *		Meaning that the data sent to the Galla object is gonna be way bigger.
	 *
	 *
	 *	5. Should the frame composition be fixed?
	 *		- More complex API.
	 *		- If API options is ommitted, dynamic logic will be needed.
	 *		- For the API to have any future, it needs to be simple..
	 *
	 *	The data created by this method will make the foundations of the path creations.
	**
	 *
	 *	Do I want to start using function declarations instead of impressions?
	 *	This way variables and functions are divided & may be easies to read vs :

	var hi = 1,
		ho = 2,
		yo = function () {
			return "wall of text";
			},
		br0 = function () {
			console.log(yo());
			};
	 *
	 *
	 *	Am I being zzz?
	 *
	 *
	 *	TODO! add suitable values of function "frameup()" to some default value variety.
	**/
	frameup: function () {


		// The first information to consider is the dimensions available.
		//
		// What picture fits where?

		var border = 50,
			spacing = 10,
			width = (this.iWidth - border*2),
			height = (this.iHeight - border*2),
			images = this.images,
			imageCount = images.length,
			gridArr;


		/**
		 *	categorizes images based on their dimensions.
		 *	This information will be used when placing images in frames created.
		 *	types:
		 *	- 'vertical' : vertical rectangle
		 *	- 'horizontal' : horisontal rectangle
		 *	- 'square' : squareish rectangle.
		 *
		 * TODO! Decide on moving variables somewhere central (squarish and types)
		**/
		function categorize () {
			// if the width is 20% (of width) longer than the height,
			// then its a legit horisontal rectangle.
			var w,
				h,
				squareish = .2,
				l = imageCount;

			while (l--) {
				w = images[l].width;
				h = images[l].height;
				images[l].orientation = ((w - h) > (w * squareish)) ? 'horizontal' : ((h - w) > (h * squareish)) ? 'vertical' : 'square';
			}

			return grid();
		}


		/**
		 *	Decide on how many columns and rows to create.
		 *
		 *	Sample pictures / inspiration:
		 *	- 7 images, 2 columns, 3-4 rows
		 *	- 13 images, 3 columns, 2-3 rows (internal columns :S) TODO, decide on where to add internal columns.
		 *	- 9 images, 3 columns, 2-3 rows
		 *	- 9 images, 3 columns, 2-4 rows
		 *
		 *	What are the commonalities..
		 *	Never more than 2 more rows than columns. never more columns than rows.
		 *
		 *	square root of each image counts, removing decimals, give column count
		 *
		 *	for each column, sum sum sum up to image count by adding columncount + (Math.rand(2) until images = sum of rows.
		 *	
		**/
		function grid () {

			var columnCount = Math.floor(Math.sqrt(imageCount)),
				columns = [],
				cc = columnCount,
				imgC = (imageCount - (columnCount * 2)),
				tmp;


			/**
			 *	gets the current framecount
			**/
			function frameCount () {

				var i = columnCount,
					count = 0;

				while (i--) {
					count += columns[i];
				}

				return count;
			}

			/**
			 *	Adds rows to each column until there is no more images that needs frames
			 *
			**/
			function addRows () {

				var i = columnCount,
					diff;

				while (i--) {

					tmp = (imgC < 2) ? imgC : rand(0,2);
					columns[i] += tmp;
					imgC -= tmp;
				}

				if (imgC && (frameCount() < imageCount)) {
					addRows();
				}
			}

			// set row count to the minimum.
			while (cc--) {
				columns[cc] = columnCount;
			}

			addRows();

			return columns;
		}

		// sorting images
		return categorize();
	},

	// TODO! track down all the pattern related information that is doubled up.
	setImages: function (images) {

		this.images = images;

		this.structure = this.frameup();

	}
}
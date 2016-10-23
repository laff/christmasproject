


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

	this.orientation = null;

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
			}, 50);
		}
	},

	setDisplay: function () {

		this.sHeight = screen.availHeight;
		this.sWidth = screen.availWidth;	
	},

	setInner: function () {

		this.iHeight = window.innerHeight;
		this.iWidth = window.innerWidth;

		this.orientation = (Math.floor(this.iHeight / this.iWidth)) ? "vertical" : "horizontal";

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

			this.structure = this.frameup();

			// new logic related to updating the frame/path locations on resize etc.
			galla.update();
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
			gridArr,
			orientation = this.orientation;

		/**
		 *	categorizes images based on their dimensions.
		 *	This information will be used when placing images in frames created.
		 *	types:
		 *	- 'vertical' : vertical rectangle
		 *	- 'horizontal' : horisontal rectangle
		 *	- 'square' : squareish rectangle.
		 *
		 * TODO! Decide on moving variables somewhere central (squarish and types)
		 *	
		 *	NOT IN USE
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

			var columnCount, //getColumnCount(),//Math.floor(Math.sqrt(imageCount)),
				minRows, //getMinRows(),
				columns = [],
				cc,// = columnCount,
				imgC,// = (imageCount - (columnCount * 2)),
				tmp;


			var divider = Math.floor(Math.sqrt(imageCount));

			if (orientation == "horizontal") {

				minRows = divider;
				columnCount = Math.floor(imageCount / divider);

			} else {

				columnCount = divider;
				minRows = Math.floor(imageCount / divider);
				
			}

			imgC = (imageCount - (columnCount * minRows));
			cc = columnCount;

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

					tmp = (imgC < minRows) ? imgC : rand(0, minRows);
					columns[i] += tmp;
					imgC -= tmp;
				}

				if (imgC && (frameCount() < imageCount)) {
					addRows();
				}
			}

			// set row count to the minimum.
			while (cc--) {
				columns[cc] = minRows;
			}

			addRows();

			return columns;
		}

		// sorting images
		//categorize();

		return grid(); 
	},

	// TODO! track down all the pattern related information that is doubled up.
	setImages: function (images) {

		this.images = images;

		this.structure = this.frameup();

	}
}


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
			yield this.patterns[i];
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
						galla.svg.fill.next(),
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


/**
 *	Class that calculates the coordinates of the paths that needs to be created.
**/
function Frames () {

	this.init();
}

Frames.prototype = {

	// this is the canvas / coordinate system.
	viewbox: null,

	// this is for scaling the svg
	scale: null,

	// These two should be higher up the chain/ available for options.
	spacing: 10,
	border: 50,

	// TODO decide on how to control these properly.
	frameArr: [],

	tmpFrames: [],

	coordinates: {

		cols: []
	},

	lengths: [],

	init: function () {

		// TODO! create similar functionality for animation / redraw on resize.
		//
		// currently its kind of just a step by step setup
		// should probably redesign the chain
		//this.updateNumbers();

		//this.createColumns();

		//this.createRows();

		//this.checkNumbers();

		//this.createFrames();

		this.update();

		var frameArr = this.frameArr,
			tmpFrames = this.tmpFrames,
			frameLen = tmpFrames.length;

		while (frameLen--) {
			frameArr[frameLen] = new Frame(tmpFrames[frameLen]);
		}

	},

	/**
	 *	Method that is called when the frame positions must be updated.
	 *
	**/
	update: function () {

		this.updateNumbers();

		this.createColumns();

		this.createRows();

		this.createFrames();

	},

	/**
	 *	Method that is called as a result of galla.update being called on bound resize
	 *
	 *	Goal is to update the data related to the frames.
	**/
	updateFrames: function () {

		var tmp = this.tmpFrames,
			frameArr = this.frameArr,
			len = tmp.length,
			i = 0;

		for (i; i < len; i++) {

			frameArr[i].update(tmp[i]);
		}
	},


	/**
	 *	TODO! decide where to store these numbers....
	**/
	updateNumbers: function () {

		var svg = galla.svg.svg;

		// variable that needs tender care if screen orients.
		this.viewbox = svg.viewBox.baseVal;

		this.scale = {
			width: svg.width.baseVal.value,
			height: svg.height.baseVal.value
		};
	},

	/**
	 *	Method that returns an array of random lengths
	**/
	randLengths: function (data, len) {

		var i = 0,
			arr = [],
			rlen,
			basepart = 0,
			sum = 0,
			leftOverAdd = 0;

		for (i; i < len; i++) {

			if (sum >= data.length) {

				console.log("__________________________________");
				console.log("sum is now larger than total length of side!");
				console.log("____________________________________");

			} else if (i == (len - 1)) {

				arr.push(data.length - sum);

			} else {

				basepart = data.part;

				rlen = rand((data.add / 2), (data.add + leftOverAdd));

				leftOverAdd += (data.add - rlen);

				sum += (basepart + rlen);

				arr.push(basepart + rlen);

			}
		}
		return arr;
	},

	/**
	 *	This is where the coordinates for the columns are created.
	 *	
	 *	- use same logic as createRows().
	**/
	createColumns: function () {

		var spacing = this.spacing,
			border = this.border,
			cols = bounds.structure.length,
			width = this.viewbox.width - (50 * 2),
			height = this.viewbox.height - (50 * 2),
			// TODO create function. atm i just wanna see it 
			// function could create 1 and 1 imageframe (cols) from left to right.
			part,
			p1,
			p2,
			p3, 
			p4,
			min,
			max,
			frames = [];

		// NEW LOGIC
		var upperWidths = this.randLengths({
					length: width,
					part: ((width * .9) / cols),
					add: ((width * .1) / cols)
				},
				cols
			),

			lowerWidths = (function () {
				var i = upperWidths.length,
					arr = [];

				while (i--) {
					arr.push(upperWidths[i]);
				}
				return arr;
			})();

		function coordinateColumns (upper, lower) {

			var columnCoordinates = [],
				len = upper.length,
				i = 0,
				tmpSpace,
				tmpBorder,
				lastUpper,
				lastLower;

			for (i; i < len; i++) {

				tmpSpace = ((!!i) * spacing);
				tmpBorder = ((!i) * border);
				lastUpper = (i) ? columnCoordinates[i-1][3].x : 0;
				lastLower = (i) ? columnCoordinates[i-1][2].x : 0;

				columnCoordinates[i] = [

					// upper left
					{x: (tmpBorder + tmpSpace + lastUpper), y: border},

					// lower left
					{x: (tmpBorder + tmpSpace + lastLower), y: height},

					// lower right
					{x: (tmpSpace + lower[i] + lastLower), y: height},

					// upper right
					{x: (tmpSpace + upper[i] + lastUpper), y: border}
				];
			}

			return columnCoordinates;
		}

		this.coordinates.cols = coordinateColumns(upperWidths, lowerWidths);
/*
		// starting off easy, brain hurts
		if (cols == 2) {

			min = (width * .4);
			max = (width * .6);

			part = rand(min, max);

			// FIRST UPPER CORNER OF FIRST COLUMN
			// upper left corner
			p1 = {x: border, y: border};
			
			// lower left corner
			p2 = {x: border, y: height};

			// lower right corner
			p3 = {x: border + (width - part), y: height};

			// upper right corner
			p4 = {x: border + part, y: border};

			this.coordinates.cols.push([p1, p2, p3, p4]);

			// THIS SHOULD BE IN THE NEXT FUNCTION CALL but i want to see it all
			// upper left
			p1 = {x: (this.coordinates.cols[0][3].x + spacing), y: border};
			// lower left
			p2 = {x: (this.coordinates.cols[0][2].x + spacing), y: height};
			// lower right
			p3 = {x: border + width, y: height};
			// upper right
			p4 = {x: border + width, y: border};

			this.coordinates.cols.push([p1, p2, p3, p4]);

			console.log("two columns created. implement dynamic columns!");

		} else {
			console.log("I gon ran outta d");
		}

		console.log(this.coordinates.cols);
		*/
	},

	/**
	 *	Method that is in charge of creating rows within the columns.
	**/
	createRows: function () {

		var coord = this.coordinates,
			rowCount = bounds.structure,
			lengths = this.lengths,
			//height = (coord.cols[0][1].y- coord.cols[0][0].y),
			width,
			spacing = this.spacing,
			c = coord.cols.length,
			i = c,
			randLengths = this.randLengths;

		/**
		 *	Function that creates rows within a column.
		**/
		function rowsCreate (nr) {

			// TODO! this function needs a new home. also found in frame.js
			function getDistance (point1, point2) {

				var A = (point1.x >= point2.x && point1.y >= point2.y) ? point2 : point1,
					B = (point1.x >= point2.x && point1.y >= point2.y) ? point1 : point2,
					distanceAB = Math.sqrt((Math.pow((B.x - A.x), 2)) + (Math.pow((B.y - A.y), 2)));

				return distanceAB;
			}

			var rows = rowCount[nr],
				spacingNr = (rows - 1),

				leftLength = getDistance(coord.cols[nr][0], coord.cols[nr][1]),
				rightLength = getDistance(coord.cols[nr][2], coord.cols[nr][3]),
				leftNewLength = (leftLength - (spacing * spacingNr)),
				rightNewLength = (rightLength - (spacing * spacingNr)),

				
				leftPart = ((leftNewLength / rows) * .8),
				rightPart = ((rightNewLength / rows) * .8),
				leftAdd = ((leftNewLength / rows) * .2),
				rightAdd = ((rightNewLength / rows) * .2),

				leftData = {
					length: leftNewLength,
					part: leftPart,
					add: leftAdd
				},

				rightData = {
					length: rightNewLength,
					part: rightPart,
					add: rightAdd
				};



			lengths[nr] = {
				left: 
					randLengths(leftData, rows), 
				right:
					randLengths(rightData, rows)
			};
		}

		// Calling rowsCreate on each column.
		var j = 0;

		for (j; j < i; j++) {

			rowsCreate(j);

		}
	},

	/**
	 *	parses the stored info gathered and creates new Frame objects.
	 *
	 *
	 *	TODO make it so that there are identical / matching frames on every second(?) column.
	 *
	**/
	createFrames: function () {

		var cols = this.coordinates.cols,
			len = cols.length,
			lengths = this.lengths,
			tmpFrames = this.tmpFrames = [],
			spacing = this.spacing,
			i = 0;


		// for each column we have 4 coordiantes available.
		// the first coordinate will be used as an anchor
		//
		// TODO! do it properly.
		function frameColumn (column, parts) {
			/**
			 *	Linear Algebra voi voi
			**/
			function pointOnLine (distance, point1, point2) {


				if (!distance) {
					return point1;
				}

				// using vectors
				// k = (distance / distanceAB)
				// C = A - k(A - B).
				// pointX = point2 - k * ( point1 - point2 )

				var A = (point1.x >= point2.x && point1.y >= point2.y) ? point2 : point1,
					B = (point1.x >= point2.x && point1.y >= point2.y) ? point1 : point2,
					distanceAB = Math.sqrt((Math.pow((B.x - A.x), 2)) + (Math.pow((B.y - A.y), 2))),

					k = (distance / distanceAB),

					pointX = {
							x: (A.x - ((k * A.x) - (k * B.x))), 
							y: (A.y - ((k * A.y) - (k * B.y)))
						};

				return pointX;
			}


			/**
			 *	A function that creates a frame.
			 *
			 *	It takes the lower two points of the last frame crated
			 *	OR the upper two points of the column.
			 *
			 *	Using the lengths of each side provided by the lengths array.
			 *	Also takes the relevant sides of the frame.
			 *
			 *	Either way it creates four coordinates representing a frame.
			 *
			 *	

			// first point is easy FOR NOW. 
			var p1 = column[0],

				// pretty straight forward finding the lower left point.
				// parts[0 = left side][0 = first frame]
				// parts[1 = right side][0 = first frame]
				p2 = pointOnLine(parts.left[0], column[0], column[1]),

				p3 = pointOnLine(parts.right[0], column[2], column[3]);

				// finding upper right is easy.. right?
				p4 = column[3];

				frameArr.push(new Frame([p1, p2, p3, p4]));

			**/
			function frameCreate (point1, point2, left, right, nr) {

				// using pointOnLine to add spacing to next frame???

				//console.log(nr);


				var space = (nr) ? spacing : 0,
					p1 = (nr) ? pointOnLine(space, point1, column[1]) : point1, // at the first run this would be column[0]

					p2 = pointOnLine(
						left,								// distance to the point to be found
						p1,	// the point that is SPACING from p1 to column[1]
						column[1]							// column[1] is the lower left point of the column
						), //point1, column[1]),	

					// finding the upper right corner first. due to the spacings?
					p4 = (nr) ? pointOnLine(space, point2, column[2]) : point2,

					p3 = pointOnLine(
							right,				// the distance
							p4,			// lower right point of column
							column[2]				// upper right point of previous 
							);

				tmpFrames.push([p1, p2, p3, p4]);
			}

			//frameCreate(column[0], column[3], parts.left[0], parts.right[0]);

			var rowCount = parts.right.length,
				i = 0;

			// going through each of the rows
			for (i; i < rowCount; i++) {

				var lastFrame = tmpFrames[tmpFrames.length - 1],
					leftPoint = (i) ? lastFrame[1] : column[0],
					rightPoint = (i) ? lastFrame[2] : column[3];

				frameCreate(leftPoint, rightPoint, parts.left[i], parts.right[i], i);
			}
		}


		// starting off by the first (left?) column.
		for (i; i < len; i++) {

			frameColumn(cols[i], lengths[i]);

		}
	}
}

/*

	"M50,50 l0,393 l301,0 l0,-393 l-301,0",	// upper left
	"M50,453 l0,393 l301,0 l0,-393 l-301,0", // lower left
	"M361,453 l0,393 l301,0 l0,-393 l-301,0" // lower right
	"M361,50 l0,393 l301,0 l0,-393 l-301,0", // upper right

*/

/*
	checkNumbers: function () {

		// TODO! this function needs a new home. also found in frame.js
		function getDistance (point1, point2) {

			var A = (point1.x >= point2.x && point1.y >= point2.y) ? point2 : point1,
				B = (point1.x >= point2.x && point1.y >= point2.y) ? point1 : point2,
				distanceAB = Math.sqrt((Math.pow((B.x - A.x), 2)) + (Math.pow((B.y - A.y), 2)));

			return distanceAB;
		}

		var col1lengths = bounds.structure[0],
			col2lengths = bounds.structure[1],
			col1spacings = (this.spacing * (col1lengths - 1)),
			col2spacings = (this.spacing * (col2lengths - 1));

		var col1left = getDistance(this.coordinates.cols[0][0], this.coordinates.cols[0][1]),// - (col1spacings * this.spacing),
			col1right = getDistance(this.coordinates.cols[0][2], this.coordinates.cols[0][3]),// - (col1spacings * this.spacing),
			col2left = getDistance(this.coordinates.cols[1][0], this.coordinates.cols[1][1]),// - (col2spacings * this.spacing),
			col2right = getDistance(this.coordinates.cols[1][2], this.coordinates.cols[1][3]);// - (col2spacings * this.spacing);


		console.log("______________________________________________________");
		console.log("column side lengths (left, right, left, right). spacings included.");
		console.log(col1left, col1right, col2left, col2right);
		console.log("______________________________________________________");





		var	col1leftlength = col1spacings,//0,//(col1lengths * this.spacing),
			col1rightlength = col1spacings,//0,//(col1lengths * this.spacing),
			col2leftlength = col2spacings,//0,//(col2lengths * this.spacing),
			col2rightlength = col2spacings;//0;//(col2lengths * this.spacing);


		for (var i = 0; i < col1lengths; i++) {

			col1leftlength += this.lengths[0].left[i];
			col1rightlength += this.lengths[0].right[i];

		}


		for (var i = 0; i < col2lengths; i++) {

			col2leftlength += this.lengths[1].left[i];
			col2rightlength += this.lengths[1].right[i];

		}

		console.log("______________________________________________________");
		console.log("length of frame sides (left, right, left, right)");
		console.log(col1leftlength, col1rightlength, col2leftlength, col2rightlength);
		console.log("______________________________________________________");		

	},
*/


/**
 *	Mission Control
 *
 *	Stop using "this" in constructor?
 *	Rather just put it all in an object like:
 *	Galla.prototype = { bounds: new Bounds(), svg: .....
 *	?
 *
**/
function Galla (options) {

	// TODO! Clean up this.
	// I seem to be storing these options all over the place.
	this.options = options;

	// setImages is a misleading name. 
	// makes so that images are categorized and numbers for frames.
	bounds.setImages(options.patterns);

	//this.svg = new Svg(options).init();

}

/**
 *	TODO!
 *	Clean up in the logic. Get all classes within the same namespace,
 *	gather functions that are common blablablabblablabblabla objectify
**/
Galla.prototype = {

	frames: null,

	svg: null,

	init: function () {
		var options = this.options,
			svg;

		// self executing function that returns a new frame.
		// the function is passed the creation & setting of the new svg as an argument.
		// this is evaluated before the function is executed.
		// making the new Svg available to the frame.
		this.frames = (function () {
			
				return new Frames();
			}
		)(this.svg = new Svg(options).init());
	},


	/**
	 *
	**/
	update: function () {

		this.frames.update();

		// this function is called like this since update() is called within init.....
		// sigh
		this.frames.updateFrames();

	}
}


/**
 *	Path creation object!
 *
 *
 *	TODO! One day there will be shapes and stuff.
 *	Now only static creation of paths!
 *
 *	Passing the fill variable made out of hte pattern chosen.
 *
 *	TODO! clean up the variables being sent to this.
**/
function Path (anchor, pathStr, fill, dimensions) { //pathStrings) {

	this.paths = [];

	// TODO this needs to be dynamic yall.
	// based on patterns!

	this.anchor = anchor;

	this.fill = fill.value;

	this.fillStr = "url(#" + fill.value.id + ")";

	//this.dimensions = dimensions;

	//this.pathStrings = pathStrings;

	this.element = this.create(pathStr);

	this.adjust(dimensions);
		
}

Path.prototype = {

	init: function () {

		// TODO this iterating stuff needs to be more sophisticated br0
		this.iterate();

		
	},

	/**
	 *	Method with the goal of upating the path coordinates AND adjust the pattern.
	**/
	update: function (anchor, pathStr, dimensions) {

		this.anchor = anchor;
		

		this.element.setAttributeNS(null, 'd', pathStr);

		this.adjust(dimensions);

	},

	/**
	 *	Method that adjusts the pattern!
	**/
	adjust: function (dimensions) {

		// console.log("_____________________" +this.fill.id+ "___________________");

		var pat = document.getElementById(this.fill.id),
			img = pat.firstChild,


		// need to adjust anchor by max angles of rows & columns
		//
		// need data related to the frame size.


			// the x & y anchor coordinates may be wrong
			// doing it statically  /testing.
			// making it so that the x/y is further up&left than any of the other frame's corners.
			ax = (this.anchor.x * .9), 
			ay = (this.anchor.y * .9),

			aw = (this.fill.width),
			ah = (this.fill.height),


			// width
			lw = (dimensions.topWidth > dimensions.bottomWidth) ?
				dimensions.topWidth : dimensions.bottomWidth,

			// finding the longest of the frame heights
			lh = (dimensions.leftHeight > dimensions.rightHeight) ?
				dimensions.leftHeight : dimensions.rightHeight;


		/**
		 *	This function finds the new width and height of the image.
		 *
		 *	The new image should always be 11,11111111111% bigger than the frame
		 *	to make up for the anchor skew?
		 *
		 *	The image dimension which is the furthest off the frame needs to be
		 *	prioritized? Does that work?
		**/
		function custom () {


			var frameWidth = lw,
				frameHeight = lh,
				imageWidth = aw,
				imageHeight = ah,

				safetyRatio = 1.11111111,

				widthRatio = (imageWidth / frameWidth),
				heightRatio = (imageHeight / frameHeight),

				ratio = (widthRatio < heightRatio) ? widthRatio : heightRatio;

				newWidth = ((imageWidth / ratio) * safetyRatio),
				newHeight = ((imageHeight / ratio) * safetyRatio);



			// console.log(widthRatio, heightRatio);

			// console.log("frame / image width: " + frameWidth + " : " + newWidth);
			// console.log("frame / image height: " + frameHeight + " : " + newHeight);

			return {width: newWidth, height: newHeight};
		}


		var customDimensions = custom();

		// if both the shortest height and the shortest width is longer than
		// the image height / width... scale down!
/*
		var ratio,
			customWidth = aw,
			customHeight = ah,
			orientation = this.fill.orientation;


		// only adjust if images are too big for frames? WTF?
		// must be more than 1.111111111111 times bigger as the anchor is skewed .9!
		if (aw > lw && ah > lh) {

			//console.log("image is bigger than frame");

			// if height is greater than width
			// find ratio between fill width and frame width
			if (ah > aw) {
				//console.log("image is taller than wide");
				ratio = (lw / aw);
				//console.log("ratio is " + ratio);


				// console.log(customHeight / customWidth);

				customWidth = (aw * ratio); //lw;

				customHeight = (ah * ratio);//((lw / aw) * ah);

				// console.log(customHeight / customWidth);

			} else {

				//console.log("image is wider than tall");
				ratio = (lw / aw);
				//console.log("ratio is " + ratio);

				//console.log(customHeight / customWidth);

				customHeight = (ah * ratio);//lh;

				customWidth = (aw * ratio);//((lh / ah) * aw);

				// console.log(customHeight / customWidth);

			}

			//customHeight *= 1.3;
			//customWidth *= 1.3;


		} else {

			// console.log("image is smaller than frame");

			if (lh > lw) {
				// console.log("frame is taller than it is wide");
				ratio = 0;
				// console.log("ratio is " + ratio);
// 
			} else {
				// console.log("frame is wider than it is tall");
				ratio = 0;
				// console.log("ratio is " + ratio);

				var r = (lw / aw);

				aw = lw;
				ah = (ah * r);

				customWidth = aw;
				customHeight = ah;

			}
		}
*/

		// pattern stuff
		pat.setAttributeNS(null, 'width', (customDimensions.width + ax));
		pat.setAttributeNS(null, 'height', (customDimensions.height + ay));
			

		// image coordinates and lengths!
		img.setAttributeNS(null, 'x', ax);
		img.setAttributeNS(null, 'y', ay);
		
		img.setAttributeNS(null, 'width', customDimensions.width);
		img.setAttributeNS(null, 'height', customDimensions.height);

		/*

		// TODO! Create functionality that adjusts the image to the
		// frames or frames created / assigned to it!
		img.setAttributeNS(null, 'x', image.x);
		img.setAttributeNS(null, 'y', image.y);
		img.setAttributeNS(null, 'width', image.width);
		img.setAttributeNS(null, 'height', image.height);
		*/

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
		path.setAttributeNS(null, 'fill', this.fillStr);

		this.element = path;

		return path;
	}
}


/**
 *	svg stuff
**/
function Svg (options) {

	this.svg = null;

	this.svgId = options.svgId;

	// The child objects for svg!
	this.defs = null;
	this.paths = null;

	this.frame = null;

	// any reason to store this variable here?
	// apart from passing it along?
	this.patterns = options.patterns;

	this.pathStrings = options.pathStrings;
}

/**
 *	The data releated to screen size and image count is "static"
 *	and related to environmental stuff.
 *
 *	The setting and adjustment of the svg frames should be done here?
 *	(Or atleast somewhere else than Bounds.
**/
Svg.prototype = {

	init: function () {

		this.createSvg();

		this.defs = new Defs(this);
		this.defs.init();

		this.fill = this.defs.fillGen();


		// TODO! Figure out where to actually use init() functions..
		// Inside classes they're atlest a bit useful for readability.
		//this.frame = new Frame();

		// TODO! this entire path logic needs to be cleaned up
		//this.paths = new Path(this.pathStrings);

		//this.paths.init();

		// to be called when paths have been created.
		// this adds the paths to the svg.
		// preferrably one by one.
		//this.addPaths(this.paths.paths);

		this.append();

		return this;
	},

	append: function () {

		document.body.appendChild(this.svg);
	},

	/**
	 *	Creating the SVG element.
	**/
	createSvg: function () {

		var svgId = this.svgId;

		if (svgId) {
			this.svg = document.getElementById(svgId);
			var nosupport = document.getElementById("nosupport");
			try {
				this.svg.removeChild(nosupport);
			} catch (e) {
				document.body.removeChild(nosupport);
				console.log(e);
			}
		} else {
			this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		}


		// initial setting of dimensions.
		// this needs to be dynamic some day :)
		this.updateDimensions();

	}, 

	addPaths: function (path) {
	
		var i = path.length;

		while (i--) {
			this.svg.appendChild(path[i]);
		}
	},

	addPath: function (path) {

		this.svg.appendChild(path);

	},

	updateDimensions: function () {

		var width = (bounds.iWidth - 25),
			height = (bounds.iHeight - 25),
			widthStr = width + 'px',
			heightStr = height + 'px',

			// TODO! work in progress this.
			viewBoxStr = (function () {

				return "0 0 " + width + " " + height;
			})();


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
		this.svg.setAttributeNS(null, 'viewBox', viewBoxStr);
	},

	/** function with the goal of updating defs element of svg.
	 *	
	 *	Starting off by adding defs element as child. 
	 *
	 *	TODO! Actual updating.
	**/
	updateDefs: function (defs) {

		this.svg.appendChild(defs);

	}
}


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
 *	STEP Y!
 *
 *	
 *
**/

/**
 *	Starting off with global objects, enclosed namespaces later.
 *	not using es6 right off the bat, will include at later stage.
 *	Not using classes (yet?).
**/


/**
 *	function that returns random number between min and max.
 *	I want this do be in available to the entire application
**/
function rand (min, max) {

	return Math.floor(Math.random() * (max - min)) + min;
}

// I want this run first.
// global variable tooo
var bounds = new Bounds().init();
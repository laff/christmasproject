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

	frameArr: [],

	coordinates: {

		cols: []
	},

	lengths: [],

	init: function () {

		// TODO! call (all of) this on resize too
		// currently its kind of just a step by step setup
		// should probably redesign the chain
		this.updateNumbers();

		this.createColumns();

		this.createRows();

		//this.checkNumbers();

		this.createFrames();
	},

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
			p3 = {x: (width - part), y: height};

			// upper right corner
			p4 = {x: part, y: border};

			this.coordinates.cols.push([p1, p2, p3, p4]);

			// THIS SHOULD BE IN THE NEXT FUNCTION CALL but i want to see it all
			// upper left
			p1 = {x: (this.coordinates.cols[0][3].x + spacing), y: border};
			// lower left
			p2 = {x: (this.coordinates.cols[0][2].x + spacing), y: height};
			// lower right
			p3 = {x: width, y: height};
			// upper right
			p4 = {x: width, y: border};

			this.coordinates.cols.push([p1, p2, p3, p4]);

			console.log("two columns created. implement dynamic columns!");

		} else {
			console.log("I gon ran outta d");
		}
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
			i = c;

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

			/**
			 *	Function that decides all the lenghts of one side of a column.
			 *
			 *	Returns array
			**/
			function randLength (data) {


				var len = rows,
					i = 0,
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
					randLength(leftData), 
				right:
					randLength(rightData)
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
			frameArr = this.frameArr,
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

					

				frameArr.push(new Frame([p1, p2, p3, p4]));
			}

			//frameCreate(column[0], column[3], parts.left[0], parts.right[0]);

			var rowCount = parts.right.length,
				i = 0;

			// going through each of the rows
			for (i; i < rowCount; i++) {

				var lastFrame = frameArr[frameArr.length - 1],
					leftPoint = (i) ? lastFrame.vertices[1] : column[0],
					rightPoint = (i) ? lastFrame.vertices[2] : column[3];

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
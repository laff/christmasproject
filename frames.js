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

		this.createFrames();
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
			i = 0;

		/**
		 *	Function that creates rows within a column.
		**/
		function rowCreate (nr) {

			// need to calculate the height of the sides based on coordinates.
			var height = (nr) ?
					(coord.cols[nr][1].y - coord.cols[nr][0].y) : (coord.cols[nr][2].y - coord.cols[nr][3].y),

				rows = rowCount[nr],
				// the height of the svg minus the spacings
				newHeight = (height - (spacing * rows)),

				// each part height before random add.
				part = ((newHeight * .7) / rows),

				// what is left over, the maximum of adds that can be made
				diff = (newHeight * .3);

			/**
			 *	Function that decides the lenghts of one side of a column.
			 *
			 *	Returns array
			**/
			function randoLength (arr, rowNr, left, tmp) {

				var r = rand(0, left);

				if (tmp) {
					arr.push(tmp);
				}

				return (left > 0) ?
					(rowNr < (rows - 1)) ?
						randoLength(arr, (rowNr + 1), (left - r), (part + r)) :
					randoLength(arr, (rowNr + 1), 0, (part + left)) :
				arr;
			}

			lengths[nr] = [randoLength([], 0, diff), randoLength([], 0, diff)];

			return (nr < (c - 1)) ? rowCreate(nr + 1) : null;
		}

		rowCreate(0);
	},

	/**
	 *	parses the stored info gathered and creates new Frame objects.
	 *
	 *
	 *	TODO make it so that there are identical / matching frames on every second column.
	 *
	**/
	createFrames: function () {

		var cols = this.coordinates.cols,
			len = cols.length,
			lengths = this.lengths,
			frameArr = this.frameArr,
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

				// using vectors
				// k = (distance / distanceAB)
				// C = B - k(B - A).
				// pointX = point2 - k * ( point1 - point2 )

				var A = (point1.x >= point2.x && point1.y >= point2.y) ? point2 : point1,
					B = (point1.x >= point2.x && point1.y >= point2.y) ? point1 : point2,
					distanceAB = Math.sqrt((Math.pow((B.x - A.x), 2)) + (Math.pow((B.y - A.y), 2))),

					k = (distance / distanceAB),

					pointX = {x: (B.x - ((k * B.x) - (k * A.x))), y: (B.y - ((k * B.y) - (k * A.y)))};

				return pointX;
			}

			// first point is easy FOR NOW. 
			var p1 = column[0],


				// pretty straight forward finding the lower left point.
				// parts[0 = left side][0 = first frame]
				// parts[1 = right side][0 = first frame]
				p2 = pointOnLine(parts[0][0], column[0], column[1]),

				p3 = pointOnLine(parts[1][0], column[2], column[3]);

				// finding upper right is easy.. right?
				p4 = column[3];

				frameArr.push(new Frame([p1, p2, p3, p4]));
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
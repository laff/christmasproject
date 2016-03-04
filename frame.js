/**
 *	Class that calculates the coordinates of the paths that needs to be created.
**/
function Frame () {

	this.init();
}

Frame.prototype = {

	// this is the canvas / coordinate system.
	viewbox: null,

	// this is for scaling the svg
	scale: null,

	// These two should be higher up the chain/ available for options.
	spacing: 10,
	border: 50,

	coordinates: {

		cols: [],
		rows: []
	},	

	init: function () {

		// TODO! call this on resize too
		this.updateNumbers();

		this.createColumns();

		this.createRows();
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

			part = (width * .2);
			min = (part * 2);
			max = (part * 2);
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
			p1 = {x: (this.coordinates.cols[0][3] + spacing), y: border};
			// lower left
			p2 = {x: (this.coordinates.cols[0][2] + spacing), y: height};
			// lower right
			p3 = {x: width, y: height};
			// upper right
			p4 = {x: width, y: height};

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
			// height of both columns is the same
			height = (coord.cols[0][1].y- coord.cols[0][0].y),
			width,
			spacing = this.spacing,
			c = coord.cols.length,
			i = 0;

		/**
		 *	Function that creates rows within a column.
		**/
		function rowCreate (nr) {

			var rows = rowCount[nr],
				// the height of the svg minus the spacings
				newHeight = (height - (spacing * rows)),

				// each part height before random add.
				part = ((newHeight * .7) / rows),

				// what is left over, the maximum of adds that can be made
				diff = (newHeight * .3),

				// array storing lengths found
				lengths = [];

			/**
			 *	Function that decides the lenghts of each left side of the column.
			 *
			 *	Stores in lengths array.
			**/
			function randoLength (rowNr, left, tmp) {

				var r = rand(0, left);

				if (tmp) {
					lengths.push(tmp);
				}

				return (left > 0) ?
					(rowNr < (rows - 1)) ?
						randoLength((rowNr + 1), (left - r), (part + r)) :
					randoLength((rowNr + 1), 0, (part + left)) :
				null;
			}

			randoLength(0, diff);

			console.log(lengths);


			// Start off on top
			// how to divide in x rows.
			// divide in x parts same size, abstract 20%. add 0-20% each until filled.





			return (nr < (c - 1)) ? rowCreate(nr + 1) : null;
		}

		rowCreate(0);

	}
}

/*

	"M50,50 l0,393 l301,0 l0,-393 l-301,0",	// upper left
	"M50,453 l0,393 l301,0 l0,-393 l-301,0", // lower left
	"M361,453 l0,393 l301,0 l0,-393 l-301,0" // lower right
	"M361,50 l0,393 l301,0 l0,-393 l-301,0", // upper right

*/
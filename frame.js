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

	structure: null,

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

		var spacing = 10,
			border = 50,
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
			min = Math.floor((part * 2));
			max = Math.floor((part * 2));
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

	createRows: function () {

		var coord = this.coordinates,
			c = coord.cols.length,
			i = 0;

		console.log(c);

		for (i; i < c; i++) {

			
			
		}

	}
}

/*

	"M50,50 l0,393 l301,0 l0,-393 l-301,0",	// upper left
	"M50,453 l0,393 l301,0 l0,-393 l-301,0", // lower left
	"M361,453 l0,393 l301,0 l0,-393 l-301,0" // lower right
	"M361,50 l0,393 l301,0 l0,-393 l-301,0", // upper right

*/
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

/**
 * using what is claimed to be the smallest subset of the jQuery dom ready event listener.
 *
**/
DomReady.ready(function () {

	galla = new Galla({

			patterns: [{

				id: 'carl',
				patternUnits: 'userSpaceOnUse',
				width: 662,
				height: 846,
				image: {
					href: '../images/carl.jpg',
					x: 50,
					y: 50,
					width: 612,
					height: 796
				}
			}, {

				id: 'bike',
				patternUnits: 'userSpaceOnUse',
				width: '388',
				height: '630',
				image: {
					href: '../images/bike.jpg',
					x: '50',
					y: '50',
					width: '338',
					height: '580'
				}
			}, {

				id: 'chick',
				patternUnits: 'userSpaceOnUse',
				width: '536',
				height: '840',
				image: {
					href: '../images/chick.jpg',
					x: '50',
					y: '50',
					width: '486',
					height: '790'
				}
			}, {

				id: 'chopper',
				patternUnits: 'userSpaceOnUse',
				width: '922',
				height: '629',
				image: {
					href: '../images/chopper.jpg',
					x: '50',
					y: '50',
					width: '872',
					height: '579'
				}
			}, {

				id: 'crew',
				patternUnits: 'userSpaceOnUse',
				width: '680',
				height: '867',
				image: {
					href: '../images/crew.jpg',
					x: '50',
					y: '50',
					width: '630',
					height: '817'
				}
			}, {
				id: 'salvatore',
				patternUnits: 'userSpaceOnUse',
				width: '686',
				height: '757',
				image: {
					href: '../images/salvatore.jpg',
					x: '50',
					y: '50',
					width: '636',
					height: '707'
				}
			}, {

				id: 'wuzimu',
				patternUnits: 'userSpaceOnUse',
				width: '500',
				height: '804',
				image: {
					href: '../images/wuzimu.jpg',
					x: '50',
					y: '50',
					width: '450',
					height: '754'
				}
			}],

			pathStrings: [
				"M50,50 l0,393 l301,0 l0,-393 l-301,0",	// upper left
				"M50,453 l0,393 l301,0 l0,-393 l-301,0", // lower left
				"M361,50 l0,393 l301,0 l0,-393 l-301,0", // upper right
				"M361,453 l0,393 l301,0 l0,-393 l-301,0" // lower right
			],

		});

	galla.init();
});
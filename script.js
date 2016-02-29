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
 *	Starting off with global objects, enclosed namespaces later.
 *	not using es6 right off the bat, will include at later stage.
 *	Not using classes (yet?).
**/


/**
 *	cba creating vanilla domready.
 *	using what is claimed to be the smallest subset of the jQuery dom ready event listener.
 *
**/
DomReady.ready(function () {

	var galla = new Galla({

			pattern: {

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

			pathStrings: [
				"M50,50 l0,393 l301,0 l0,-393 l-301,0",
				"M50,453 l0,393 l301,0 l0,-393 l-301,0",
				"M361,50 l0,393 l301,0 l0,-393 l-301,0",
				"M361,453 l0,393 l301,0 l0,-393 l-301,0"
			],

		}).init();



});
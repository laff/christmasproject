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
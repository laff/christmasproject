(function (root, factory) {

	root.Gallamenu = factory(root);

	}(	// sends root / top domain of the environment which it is loaded from
		// as an argument.
		typeof window != 'undefined' ? window : this,

		// sends the function of which is the entire applicatino / library
		// to the self executing function as an argument.
		function (win) {

		var Gallamenu;

		function Poop () {

		}

		Poop.prototype.hello = function () {

			console.log("hi");

		}

		function Pee() {

		}

		Poop.prototype.bye = function () {

			console.log("farewell");

		}

		// returning public / global stuff?
		// if needed?
		Gallamenu = {

			Poop: Poop

		}

		return Gallamenu;

		}
	)
);
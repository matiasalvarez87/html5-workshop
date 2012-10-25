/**
 * initilize.js
 * Author: Matias Alvarez
 * Description: Responsible of application initialization (loads js dependencies, creates main objects, and so on).
 * */

var app = {}; // Global variable that contains the Application object

(function(g,b,d){var c=b.head||b.getElementsByTagName("head"),D="readyState",E="onreadystatechange",F="DOMContentLoaded",G="addEventListener",H=setTimeout;

function f() {
	
	// Loads dependencies from JSON config file
	$LAB.script('js/config-2.js').wait( function() {
	
		// Loads third party dependencies
		$LAB.script(Config.dependencies.libs).wait()
		
			// Loads application file dependencies
			.script(Config.dependencies.application).wait(function(){
				showMain();
				showPersonList();
			});
	});
}

H(function(){if("item"in c){if(!c[0]){H(arguments.callee,25);return}c=c[0]}var a=b.createElement("script"),e=false;a.onload=a[E]=function(){if((a[D]&&a[D]!=="complete"&&a[D]!=="loaded")||e){return false}a.onload=a[E]=null;e=true;f()};
a.src="js/LAB-2.0.3-min.js";
c.insertBefore(a,c.firstChild)},0);if(b[D]==null&&b[G]){b[D]="loading";b[G](F,d=function(){b.removeEventListener(F,d,false);b[D]="complete"},false)}})(this,document);

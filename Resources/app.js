! function() {
	var Apiomat = require('controls/apiomat.adapter');
	Ti.App.Apiomat = new Apiomat();
	require('ui/tabgroup').create().open();
	require('vendor/versionsreminder').start();
}();

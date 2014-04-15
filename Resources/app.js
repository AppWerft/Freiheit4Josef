! function() {
	Ti.App.Twitter = new (require('controls/twitter_adapter'))();
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))();
	require('ui/tabgroup').create().open();
	require('vendor/versionsreminder').start();
}();

! function() {
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))();
	Ti.App.Apiomat.loginUser({
		onoffline : function() {
			alert('Die App braucht das Netz.');
			ui && ui.close();
		}
	});
	Ti.App.Twitter = new (require('controls/twitter_adapter'))();
	var ui = require('ui/tabgroup').create();
	ui.open();
}();
! function() {
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))(null, {
		ononline : function() {
			Ti.App.Apiomat.loginUser(null, {
			});
			Ti.App.Twitter = new (require('controls/twitter_adapter'))();
			var ui = require('ui/tabgroup').create();
			ui.open();
		},
		onoffline : function() {
			alert('Die App braucht das Netz.');
			ui && ui.close();
		}
	});
}();

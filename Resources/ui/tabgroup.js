exports.create = function() {
	var self = Titanium.UI.createTabGroup({
		title : 'Freedom4Josef',
		fullscreen : true,
		backgroundImage : 'default.png'
	});
	var tab1 = Titanium.UI.createTab({
		title : 'Blog',
		window : require('ui/wordpress.window').create()
	});
	var tab2 = Titanium.UI.createTab({
		title : 'Soli-Karte',
		window : require('ui/map.window').create()
	});
	self.addTab(tab2);
	self.addTab(tab1);
	self.addEventListener('open', function() {
		if (!Ti.Android)
			return;
		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.actionBar.setDisplayHomeAsUp(false);
		activity.actionBar.setTitle('Freiheit für Josef!');
		activity.onCreateOptionsMenu = function(e) {
			if (Ti.Geolocation.locationServicesEnabled) {
				Ti.Geolocation.purpose = 'Hole Deinen Standort';
				Ti.Geolocation.getCurrentPosition(function(_res) {
					if (!_res.error && _res.success) {
						e.menu.add({
							title : "Aufnahme",
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
							itemId : 0,
							visible : true,
							icon : Ti.App.Android.R.drawable.ic_action_camera
						}).addEventListener("click", function() {
							require('ui/camera.widget').create();
						});
					}
				});
			} else {
				alert('Bitte schalte die Geolocation ein.');
			}

		};

	});
	return self;
};

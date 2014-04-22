exports.create = function() {
	var self = Titanium.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true,
		backgroundImage : 'default.png'
	});

	self.addTab(Ti.UI.createTab({
		title : 'Soli-Karte',
		window : require('ui/map.window').create()
	}));
	self.addTab(Ti.UI.createTab({
		title : 'Bilder',
		window : require('ui/list.window').create()
	}));
	/*self.addTab(Ti.UI.createTab({
	 title : 'Klänge',
	 window : require('ui/audiorecorder.window').create()
	 }));*/
	self.addTab(Ti.UI.createTab({
		title : 'Blog',
		window : require('ui/wordpress.window').create()
	}));
	self.addTab(Ti.UI.createTab({
		title : 'Twitter',
		window : require('ui/twitter/window').create()
	}));
	self.addEventListener('open', function() {
		if (!Ti.Android)
			return;
		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.actionBar.setDisplayHomeAsUp(false);
		activity.actionBar.setTitle('Freiheit für Josef!');
		activity.actionBar.setSubtitle('Unsre Solidarität - die könnt ihr haben.');

		activity.onCreateOptionsMenu = function(e) {
			e.menu.add({
				title : "Aufnahme",
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				itemId : 0,
				visible : true,
				icon : Ti.App.Android.R.drawable.ic_action_megafon
			}).addEventListener("click", function() {
				require('ui/audiorecorder.window').create().open();
			});
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

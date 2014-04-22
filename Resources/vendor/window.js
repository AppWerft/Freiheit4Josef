exports.create = function() {
	var options = arguments[0] || {};
	var self = Ti.UI.createWindow({
		fullscreen : true,
		barColor : '#CF6500',
	});
	if (Ti.Android) {
		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.setTitle(options.title);
				activity.actionBar.setSubtitle(options.subtitle);
				
				activity.actionBar.setLogo(options.logo);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		});
	};
	return self;
};

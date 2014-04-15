exports.create = function() {
	var wpblog = Ti.UI.createWebView({
		url : 'http://freiheit-fuer-josef.familientagebuch.de/?123',
		width : Ti.UI.FILL,
		backgroundImage : 'default.png',
		height : Ti.UI.FILL,
		disableBounce : true
	});
	var self = Titanium.UI.createWindow({
		title : 'Blog',
		backgroundColor : '#fff'
	});
	self.add(wpblog);
	return self;
};

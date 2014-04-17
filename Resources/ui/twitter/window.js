exports.create = function() {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : '#333',
		barColor : '#CF6500',
		title : 'freejosef @ twitter'
	});
	
	self.progressbar = Ti.UI.createView({
		backgroundColor : 'yellow',
		top : 0,
		height : 5,
		width : '1%'
	});
	self.add(self.progressbar);
	self.tweetlist = Ti.UI.createTableView({
		height : Ti.UI.FILL,
		backgroundColor : '#fff'
	});

	self.tweetlist.addEventListener('click', function(_e) {
		require('ui/twitter/dialog.widget').create(self, _e);
	});

	self.updateTweets = function() {
		self.removeEventListener('swipe', self.onSwipe);
		self.progressbar.width = '1%';
		self.tweetlist.top = 5;
		self.counter = 0;
		self.tweetlist.opacity = 0.7;
		self.progressbar.animate({
			width : '100%',
			duration : 10000
		}, function() {
			self.tweetlist.top = 0;
			self.progressbar.width = 1;
			self.tweetlist.opacity = 1;
			self.addEventListener('swipe', self.onSwipe);
		});
		Ti.App.Twitter.fetch('search_tweets', 'freejosef', function(_response) {
			self.tweetlist.top = 0;
			self.tweetlist.opacity = 1;
			self.progressbar.width = 1;
			self.addEventListener('swipe', self.onSwipe);
			if (!_response || !_response.statuses)
				return;
			var data = [];
			Ti.Android && Ti.UI.createNotification({
				message : _response.statuses.length + ' Tweets gefunden.'
			}).show;
			for (var i = 0; i < _response.statuses.length; i++) {
				data.push(require('ui/twitter/tweet').create(_response.statuses[i]));
			}
			self.tweetlist.setData(data);
		});
	};

	self.add(self.tweetlist);
	self.addEventListener('reload!', function() {
		updateTweets();
	});
	self.dialog = require('ui/twitter/tweetwriter.widget').create();
	self.addEventListener('write!', function() {
		Ti.App.Twitter.authorize(function(_reply) {
			if (_reply.success == true) {
				self.dialog.show();
			}
		});
	});

	self.onSwipe = function(_e) {
		var deviceheight = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor-100;
		console.log(_e.y-100); // -100= actionbar + tabs
		if (_e.direction == 'down' && _e.y-100 < deviceheight / 4) {
			self.updateTweets();
		}
	};
	self.addEventListener('swipe', self.onSwipe);
	self.updateTweets();
	return self;
};


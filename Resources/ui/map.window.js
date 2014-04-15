Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = Ti.UI.createWindow({
		fullscreen : true
	});
	self.mapview = Ti.Map.createView({
		mapType : Ti.Map.TERRAIN_TYPE,
		enableZoomControls : false,
		region : {
			latitude : 50.9270540,
			longitude : 11.5963632,
			latitudeDelta : 15,
			longitudeDelta : 15
		},
		animate : true,
		regionFit : true,
		userLocation : true
	});
	self.mapview.addEventListener('complete', function() {
	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			ready = true;
		}
		Ti.App.Apiomat.getAllPhotos(null, {
			onload : function(_data) {
				var pindata;
				var annotations = [];
				while ( pindata = _data.pop()) {
					annotations.push(require('ui/annotation.widget').create(pindata));
				}
				self.mapview.addAnnotations(annotations);

				Ti.UI.createNotification({
					message : pins.length + ' Photos'
				}).show();

			}
		});

	});
	self.addEventListener('blur', function() {
		self.mapview.removeAllAnnotations(pins);
	});
	self.mapview.addEventListener('click', function(_e) {
		if (_e.annotation && (_e.clicksource == 'rightPane' || _e.clicksource == 'title' || _e.clicksource == 'subtitle')) {
		}
	});
	return self;

};


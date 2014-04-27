Ti.Map = require('ti.map');
var ImageCache = require('vendor/imagecache');
exports.create = function(_pindata) {
	if (_pindata.thumb) {
		var leftview = Ti.UI.createImageView({
			width : 120,
			height : 120
		});
		ImageCache(_pindata.thumb, leftview);
		var self = Ti.Map.createAnnotation({
			latitude : _pindata.latitude,
			longitude : _pindata.longitude,
			leftView : leftview,
			title : _pindata.title,
			subtitle : 'Freiheit für Josef!',
			image : '/ui/mappins/' + Ti.Platform.displayCaps.density + '-pin.png'
		});
	} else {
		
		var self = Ti.Map.createAnnotation({
			latitude : _pindata.latitude,
			longitude : _pindata.longitude,
			subtitle : _pindata.title,
			rightButton : '/ui/mappins/' + Ti.Platform.displayCaps.density + '-megafon.png',
			audiourl : _pindata.audiourl,
			title : 'Freiheit für Josef!',
			image : '/ui/mappins/' + Ti.Platform.displayCaps.density + '-megafon.png'
		});
	}
	return self;
};

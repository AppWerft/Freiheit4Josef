Ti.Map = require('ti.map');
var ImageCache = require('vendor/imagecache');
exports.create = function(_pindata) {
	var leftview = Ti.UI.createImageView({
			width : 120,
			height : 120 
	});
	ImageCache(_pindata.thumb,leftview);
	var self = Ti.Map.createAnnotation({
		latitude : _pindata.latitude,
		longitude : _pindata.longitude,
		leftView : leftview,
		title : _pindata.title,
		subtitle : 'Freiheit für Josef!',
		image : '/ui/mappins/' + Ti.Platform.displayCaps.density + '-pin.png'
	});
	return self;
};

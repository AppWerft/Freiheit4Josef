Ti.Map = require('ti.map');
exports.create = function(_pindata) {
	console.log(_pindata.thumb);
	var self = Ti.Map.createAnnotation({
		latitude : _pindata.latitude,
		longitude : _pindata.longitude,
		leftView : Ti.UI.createImageView({
			width : 100,
			height : 100,
			image : _pindata.thumb
		}),
		title : _pindata.title,
		subtitle : 'Freiheit für Josef!',
		image : '/ui/mappins/' + Ti.Platform.displayCaps.density + '-pin.png'
	});
	console.log(_pindata.thumb);
	return self;
};

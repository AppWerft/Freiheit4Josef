var ImageCache = require('vendor/imagecache');
exports.create = function() {
	/*function getItem(_pindata) {
	 var item = {
	 properties : {
	 accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_NONE,
	 backgroundColor : 'white'
	 },
	 image : {
	 image : _pindata.bigimage
	 }
	 };
	 ImageCache(_pindata.image, item.image);
	 return item;
	 }*/
	function getImage(_data) {
		var w = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

		var self = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : w * 0.7,
			bottom : 10
		});
		var photo = Ti.UI.createImageView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			image : _data.bigimage + '&_=.png'
		});
		self.add(photo);
		ImageCache(_data.bigimage, photo);
		self.add(Ti.UI.createView({
			backgroundColor : 'black',
			opacity : 0.6,
			height : 50,
			bottom : 0
		}));
		self.add(Ti.UI.createLabel({
			text : _data.title,
			width : Ti.UI.FILL,
			textAlign : 'left',
			left : 10,
			color : 'white',
			font : {
				fontSize : 24,
				fontFamily : 'Libel Suit',
				fontWeight : 'bold'
			},
			bottom : 18
		}));
		return self;
	}

	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : 'white',
		layout : 'vertical'
	});
	self.container = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		contentHeight : Ti.UI.SIZE,
		backgroundColor : 'red'
	});
	self.add(self.container);
	/*	self.listview = Ti.UI.createListView({
	sections : [Ti.UI.createListSection({
	headerTitle : null,
	})],
	templates : {
	'template' : {
	properties : {
	height : Ti.UI.SIZE,
	backgroundColor : 'white'
	},
	childTemplates : [{
	type : 'Ti.UI.ImageView',
	bindId : 'image',
	properties : {
	height : Ti.UI.SIZE,
	width : Ti.UI.FILL
	}
	}]
	}
	},
	defaultItemTemplate : 'template',
	});*/
	//self.add(self.listview);
	function updateView() {
		Ti.App.Apiomat.getAllPhotos(null, {
			onload : function(_data) {
				var pindata;
				self.container.removeAllChildren();
				//var dataitems = [];
				while ( img = _data.pop()) {
					if (img && img.bigimage) {
						self.container.add(getImage(img));
					}
				}
				//self.listview.sections[0].setItems(dataitems);
			}
		});
	}


	self.addEventListener('focus', updateView);
	return self;
};


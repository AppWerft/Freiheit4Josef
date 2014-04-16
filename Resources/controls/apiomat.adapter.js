var Apiomat = require('vendor/apiomat');
var moment = require('vendor/moment');
moment.lang('de');

var myPushDeviceToken = null;

var saveCB = {
	onOk : function() {
	},
	onError : function(error) {
	}
};

///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var ApiomatAdapter = function() {
	var uid = (Ti.App.Properties.hasProperty('uid')) ? Ti.App.Properties.getString('uid') : Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress());
	Ti.App.Properties.setString('uid', uid);
	this.user = new Apiomat.Nutzer();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');
	this.loginUser();
};

ApiomatAdapter.prototype.loginUser = function() {
	var that = this;
	var loaded = false;
	//that.getAllWatchedVideos();
	this.user.loadMe({
		onOk : function() {
			that.setLocation();
			/*that.user.loadMyphotos("order by createdAt", {
			 onOk : function() {
			 if (loaded == true)
			 return;
			 loaded = true;
			 if (Ti.Android) {
			 } else {
			 }
			 },
			 onError : function(_err) {
			 console.log(_err);
			 }
			 });*/
		},
		onError : function(error) {
			that.user.save(saveCB);
		}
	});
	return this;
};

/* this function will called from camera: */
ApiomatAdapter.prototype.postPhoto = function(_args, _callbacks) {
	var that = this;
	var myNewPhoto = new Apiomat.Photo();
	myNewPhoto.setLocationLatitude(_args.latitude);
	// from getPosition
	myNewPhoto.setLocationLongitude(_args.longitude);
	myNewPhoto.setTitle(_args.title);
	myNewPhoto.postPhoto(_args.photo);
	// ti.blob from camera
	myNewPhoto.save({
		onOK : function() {
			that.user.postmyNewPhotos(myNewPhoto, {
				onOK : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo erfolgreich gespeichert.'
					}).show();
					console.log('Info: photo uploaded');
				},
				onError : function() {
				}
			});
		},
		onError : function() {
		}
	});

};


ApiomatAdapter.prototype.setLocation = function() {
	var that = this;
	Ti.Geolocation.getCurrentPosition(function(_res) {
		if (_res.error)
			return;
		that.user.setLocationLatitude(_res.coords.latitude);
		that.user.setLocationLongitude(_res.coords.longitude);
		that.user.setLocLatitude(_res.coords.latitude);
		that.user.setLocLongitude(_res.coords.longitude);
		that.user.save({
			onOK : function() {
			},
			onError : function() {
			}
		});
	});
};

ApiomatAdapter.prototype.getAllPhotos = function(_args, _callbacks) {
	Apiomat.Photo.getPhotos("order by createdAt limit 500", {
		onOk : function(_res) {
			var bar = [];
			for (var i = 0; i < _res.length; i++) {
				bar.push({
					latitude : _res[i].getLocationLatitude(),
					longitude : _res[i].getLocationLongitude(),
					title : _res[i].getTitle(),
					thumb : _res[i].getPhotoURL(100, 100, null, null, 'png'),
					bigimage : _res[i].getPhotoURL(800, 800, null, null, 'png') ,
				});
			}
			_callbacks.onload(bar);
		},
		onError : function(error) {
			//handle error
		}
	});

};

/// SETTER:

module.exports = ApiomatAdapter;

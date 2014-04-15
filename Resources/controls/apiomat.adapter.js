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
			that.user.loadMyphotos("order by createdAt", {
				onOk : function() {
					if (loaded == true)
						return;
					loaded = true;
					if (Ti.Android) {
					} else {
					}
					console.log('User getFav OK');

				},
				onError : function(_err) {
					console.log(_err);
				}
			});
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
	myNewPhoto.setLocationLatitude(_args.latitude); // from getPosition
	myNewPhoto.setLocationLongitude(_args.longitude);
	myNewPhoto.postPhoto(_args.photo);  // ti.blob from camera
	myNewPhoto.save({
		onOK : function() {
			that.user.postmyNewPhotos(myNewPhoto, {
				onOK : function() {
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

ApiomatAdapter.prototype.getAllPhotos = function(_args, _callbacks) {
	Apiomat.Photo.getPhotos("order by createdAt limit 100", {
		onOk : function(_res) {
			var bar = [];
			console.log(_res);
			for (var i = 0; i < _res.length; i++) {
				bar.push({
					latitude : _res[i].getLocationLatitude(),
					longitude : _res[i].getLocationLongitude(),
					title : _res[i].getTitle(),
					thumb : _res[i].getPhotoURL(100, 100,null,null,'png'),
					image : _res[i].getPhotoURL(800, 800,null,null,'png'),
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

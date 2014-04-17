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
	Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
		onOk : function() {
			console.log('Offline cache gestartet');
		},
		onError : function(err) {
			//Error occurred
		}
	});

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
			Ti.Android && Ti.UI.createNotification({
				message : 'Photo erhalten.'
			}).show();
			that.user.postmyNewPhotos(myNewPhoto, {
				onOk : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo erfolgreich gespeichert.'
					}).show();
					Ti.Media.vibrate();
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

ApiomatAdapter.prototype.deletePhoto = function(_id, _callbacks) {
	for (var i = 0; i < this.photos.length; i++) {
		// only own phots has an id:
		if (this.photos[i].data.id && this.photos[i].data.id == _id) {
			this.photos[i].deleteModel({
				onOk : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo in Liste gelöscht'
					}).show();
					Ti.Media.vibrate();
					_callbacks.ondeleted();
					console.log('SUCCESSFUl deleted');
				},
				onError : function(error) {
					console.log(error);
				}
			});
			break;
		}
	}
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
			onOk : function() {
			},
			onError : function() {
			}
		});
	});
};
ApiomatAdapter.prototype.resetLocation = function() {
	var that = this;
	that.user.setLocationLatitude(0);
	that.user.setLocationLongitude(0);
	that.user.setLocLatitude(0);
	that.user.setLocLongitude(0);
	that.user.save({
		onOk : function() {
		},
		onError : function() {
		}
	});

};

ApiomatAdapter.prototype.getAllPhotos = function(_args, _callbacks) {
	var that = this;
	Apiomat.Photo.getPhotos("order by createdAt limit 500", {
		onOk : function(_res) {
			that.photos = _res;
			var photolist = [];
			for (var i = 0; i < that.photos.length; i++) {
				var photo = that.photos[i];
				photolist.push({
					id : (photo.data.ownerUserName == that.user.getUserName())//
					? photo.data.id : undefined,
					latitude : photo.getLocationLatitude(),
					longitude : photo.getLocationLongitude(),
					title : photo.getTitle(),
					thumb : photo.getPhotoURL(100, 100, null, null, 'png'),
					bigimage : photo.getPhotoURL(800, 800, null, null, 'png') ,
				});
			}
			_callbacks.onload(photolist);
		},
		onError : function(error) {
			//handle error
		}
	});

};

/// SETTER:

module.exports = ApiomatAdapter;

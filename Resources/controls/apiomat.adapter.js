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

};

ApiomatAdapter.prototype.loginUser = function(_callbacks) {
	var that = this;
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
	var loaded = false;
	//that.getAllWatchedVideos();
	this.user.loadMe({
		onOk : function() {
			that.setLocation();

		},
		onError : function(error) {
			if (error.statusCode === Apiomat.Status.UNAUTHORIZED) {
				that.user.save(saveCB);
			} else
				_callbacks.onoffline();
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
			that.user.postmyPhotos(myNewPhoto, {
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

ApiomatAdapter.prototype.postAudio = function(_args, _callbacks) {
	var that = this;
	Ti.Geolocation.getCurrentPosition(function(_res) {
		if (!_res.error && _res.success) {
			var myNewAudio = new Apiomat.Audio();
			myNewAudio.setLocationLatitude(_res.coords.latitude);
			myNewAudio.setLocationLongitude(_res.coords.longitude);
			myNewAudio.setTitle(_args.title);
			myNewAudio.setRatio(_args.ratio);
			myNewAudio.postRecord(_args.blob);
			console.log(myNewAudio);
			myNewAudio.save({
				onOk : function() {
					console.log('Info: saving of sound successful');
					Ti.Media.vibrate();
					Ti.Android && Ti.UI.createNotification({
						message : 'Sound erhalten.'
					}).show();
					console.log('Info: try to link audio to user');
					that.user.postMyAudios(myNewAudio, {
						onOk : function() {
							Ti.Android && Ti.UI.createNotification({
								message : 'Audio erfolgreich gespeichert.'
							}).show();
							Ti.Media.vibrate();
							_callbacks.onOk();
							console.log('Info: audio uploaded');
						},
						onError : function() {
						}
					});
				},
				onError : function(error) {
					console.log('Error: ' + error);
				}
			});
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
					ratio: photo.getRatio() || 1.3,
					bigimage : photo.getPhotoURL(Ti.Platform.displayCaps.platformWidth, 0.6 * Ti.Platform.displayCaps.platformWidth, null, null, 'png') ,
				});
			}
			_callbacks.onload(photolist);
		},
		onError : function(error) {
			//handle error
		}
	});

};

ApiomatAdapter.prototype.getAllAudios = function(_args, _callbacks) {
	var that = this;
	Apiomat.Audio.getAudios("order by createdAt limit 500", {
		onOk : function(_res) {
			that.audios = _res;
			var audiolist = [];
			for (var i = 0; i < that.audios.length; i++) {
				var audio = that.audios[i];
				audiolist.push({
					id : (audio.data.ownerUserName == that.user.getUserName())//
					? audio.data.id : undefined,
					latitude : audio.getLocationLatitude(),
					longitude : audio.getLocationLongitude(),
					title : audio.getTitle(),
					audiourl : audio.getRecordURL() ,
				});
			}
			console.log(audiolist.length);
			_callbacks.onload(audiolist);
		},
		onError : function(error) {
			console.log(error);
		}
	});

};

/// SETTER:

module.exports = ApiomatAdapter;

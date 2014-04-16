exports.create = function(_user) {
	console.log(_user);
	var self = require('vendor/window').create({
		title : _user.name
	});
	var scroller = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		width : Ti.UI.FILL,
		contentWidth : Ti.Platform.displayCaps.platformHeight * 1.4,
	});
	self.add(scroller);
	var bg = Ti.UI.createImageView({
		width : Ti.Platform.displayCaps.platformHeight * 1.4,
		height : Ti.Platform.displayCaps.platformHeight
	});
	scroller.add(bg);
	self.add(Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		bubbleParent : true,
		touchEnabled : false,
		opacity : '0.7',
		left : '30dp',
		right : '30dp',
		top : '30dp',
		borderWidth : 1,
		zIndex : 10,
		borderRadius : '10dp',
		backgroundColor : 'white'//_user['profile_background_color']
	}));
	if (_user.name)
		self.add(Ti.UI.createLabel({
			text : _user.name,
			top : '50dp',
			left : '50dp',
			right : '50dp',
			color : 'black',
			zIndex : 20,
			font : {
				fontSize : '36dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user.location)
		self.add(Ti.UI.createLabel({
			text : _user.location,
			top : '150dp',
			left : '50dp',
			right : '50dp',
			color : 'black',
			zIndex : 20,
			font : {
				fontSize : '25dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user.description)
		self.add(Ti.UI.createLabel({
			text : _user.description,
			top : '210dp',
			left : '50dp',
			right : '50dp',
			zIndex : 99,
			color : '#00597C',
			font : {
				fontSize : '20dp',
				fontWeight : 'bold',
				fontFamily : 'PTSans-Narrow'
			}
		}));
	if (_user["profile_use_background_image"] && _user['profile_background_image_url']) {
		var xhr = Ti.Network.createHTTPClient({
			onerror : function(e) {
				console.log(this.error + e.error);
			},
			onload : function(e) {
				console.log('Info: got bg for twitter, status: ' + this.status);
				if (this.status == 200) {
					console.log('Info: ' + this.responseData.length);

					bg.setImage(this.responseData);
					bg.animate(Ti.UI.createAnimation({
						contentOffset : {
							x : '500dp',
							y : 0
						},
						duration : 10000
					}));
				}
			}
		});
		xhr.open('GET', _user['profile_background_image_url']);
		xhr.send();
	}
	return self;
};
var a = {
	"title" : {
		"location" : "Hamburg  – St. Pauli",
		"default_profile" : false,
		"profile_background_tile" : false,
		"statuses_count" : 627,
		"lang" : "de",
		"profile_link_color" : "0084B4",
		"id" : 99730267,
		"following" : null,
		"favourites_count" : 5,
		"protected" : false,
		"profile_text_color" : "333333",
		"contributors_enabled" : false,
		"verified" : false,
		"description" : "iPhone- und Androidentwicklung aus einer Hand, Titanium Certified App Developer, Titan",
		"profile_sidebar_border_color" : "C0DEED",
		"name" : "Rainer Schleevoigt",
		"profile_background_color" : "C0DEED",
		"created_at" : "Sun Dec 27 15:49:20 +0000 2009",
		"is_translation_enabled" : false,
		"default_profile_image" : false,
		"followers_count" : 104,
		"profile_image_url_https" : "https://pbs.twimg.com/profile_images/435000366095036416/qPVLH03V_normal.png",
		"geo_enabled" : true,
		"profile_background_image_url" : "http://pbs.twimg.com/profile_background_images/537143575/twitter.jpg",
		"profile_background_image_url_https" : "https://pbs.twimg.com/profile_background_images/537143575/twitter.jpg",
		"follow_request_sent" : null,
		"entities" : {
			"description" : {
				"urls" : []
			},
			"url" : {
				"urls" : [{
					"display_url" : "hamburger-appwerft.de",
					"expanded_url" : "http://hamburger-appwerft.de",
					"indices" : [0, 22],
					"url" : "http://t.co/JgEkal5xSg"
				}]
			}
		},
		"url" : "http://t.co/JgEkal5xSg",
		"utc_offset" : 7200,
		"time_zone" : "Berlin",
		"notifications" : null,
		"profile_use_background_image" : true,
		"friends_count" : 136,
		"profile_sidebar_fill_color" : "D6ABA0",
		"screen_name" : "kontaktschmied",
		"id_str" : "99730267",
		"profile_image_url" : "http://pbs.twimg.com/profile_images/435000366095036416/qPVLH03V_normal.png",
		"is_translator" : false,
		"listed_count" : 15
	}
};

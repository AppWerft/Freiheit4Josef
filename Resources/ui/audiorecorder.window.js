var AudioRecorder = require("titutorial.audiorecorder");
var DURATION = 10000;
exports.create = function() {

	function updateLevel() {
		if (AudioRecorder.isRecording()) {
			self.progress.show();
			var value = parseInt(self.progress.getValue());
			console.log(value);
			self.progress.setValue(value + 100);
			var imgTransform = Ti.UI.create2DMatrix();
			var level = Math.sqrt(AudioRecorder.getMaxAmplitude()) / 360;
			if (level > 0) {
				imgTransform = imgTransform.scale(1 + level);
				self.megafonred.animate({
					transform : imgTransform,
					duration : 40
				}, updateLevel);
			} else
				setTimeout(updateLevel, 100);
		} else {
			self.progress.hide();
			setTimeout(updateLevel, 100);
			self.megafon.transform = Ti.UI.create2DMatrix({
				scale : 1
			});
		}
	}

	var self = require('vendor/window').create({
		title : 'Freiheit für Josef!',
		subtitle : 'Audioaufnahme'
	});
	self.audioplayer = Ti.Media.createAudioPlayer();
	self.audiofile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'cache', 'file.mp4');
	self.backgroundImage = '/assets/default.png';
	self.megafon = Ti.UI.createImageView({
		image : '/assets/megafon.png',
		width : 200
	});
	self.add(self.megafon);
	self.megafonred = Ti.UI.createImageView({
		image : '/assets/megafonred.png',
		width : 200,
		visible : false
	});
	self.add(self.megafonred);
	self.progress = Ti.UI.createProgressBar({
		bottom : 10,
		width : '90%',
		height : 50,
		min : 0,
		value : 0,
		backgroundColor : 'whites',
		max : DURATION
	});
	self.add(self.progress);

	self.megafon.addEventListener('click', function() {
		//if (AudioRecorder.isRecording()) {
		self.megafonred.show();
		self.megafon.hide();
		AudioRecorder.startRecording({
			outputFormat : AudioRecorder.OutputFormat_MPEG_4,
			audioEncoder : AudioRecorder.AudioEncoder_AAC,
			directoryName : "cache",
			fileName : "file",
			maxDuration : DURATION,
			success : function(e) {
				self.megafon.show();
				self.menu.items[0].visible = true;
				self.menu.items[1].visible = true;

				self.megafonred.hide();
				Ti.API.info("response is => " + JSON.stringify(e));
				self.megafonred.transform = Ti.UI.create2DMatrix({
					scale : 1
				});
			},
			error : function(d) {
				self.megafonred.hide();
			}
		});
		setTimeout(updateLevel, 500);

	});
	self.addEventListener('focus', function() {
		Ti.Android && Ti.UI.createNotification({
			message : 'Berühre den Mann, um die Aufnahme zu starten'
		}).show();
	});
	self.addEventListener('close', function() {
		AudioRecorder.stopRecording();
	});
	self.addEventListener('open', function() {
		if (!Ti.Android)
			return;
		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.onCreateOptionsMenu = function(e) {
			self.menu = e.menu;
			e.menu.add({
				title : "Wiedergabe",
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				itemId : 0,
				visible : false,
				icon : Ti.App.Android.R.drawable.ic_action_play
			}).addEventListener("click", function() {
				self.audioplayer.url = self.audiofile.nativePath;
				self.audioplayer.play();
			});
			e.menu.add({
				title : "Speichern",
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				itemId : 0,
				visible : false,
				icon : Ti.App.Android.R.drawable.ic_action_upload
			}).addEventListener("click", function() {
				self.menu.items[0].setVisible(false);
				self.menu.items[1].setVisible(false);
				Ti.App.Apiomat.postAudio({
					blob : self.audiofile.read()
				}, {
					onload : function() {
					}
				});
			});
		};
	});
	return self;
};


var AudioRecorder = require("titutorial.audiorecorder");

exports.create = function() {
	function updateLevel() {
		if (AudioRecorder.isRecording()) {
			var imgTransform = Ti.UI.create2DMatrix();
			var level = Math.sqrt(AudioRecorder.getMaxAmplitude()) / 150;
			console.log(level);
			if (level > 0) {
				imgTransform = imgTransform.scale(level);
				self.megafon.animate({
					transform : imgTransform,
					duration : 50
				}, updateLevel);
			}
		} else {
			setTimeout(updateLevel, 100);
			//self.megafon.setImage('/assets/megafon.png');
			self.megafon.transform = Ti.UI.create2DMatrix({
				scale : 1
			});
		}
	}

	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : 'white'
	});
	self.megafon = Ti.UI.createImageView({
		image : '/assets/megafon.png',
		width : 200
	});
	self.add(self.megafon);

	self.megafon.addEventListener('click', function() {
		//if (AudioRecorder.isRecording()) {
		self.megafon.setImage('/assets/megafonred.png');
		AudioRecorder.startRecording({
			outputFormat : AudioRecorder.OutputFormat_MPEG_4,
			audioEncoder : AudioRecorder.AudioEncoder_AAC,
			directoryName : "testdir",
			fileName : "testfile",
			maxDuration : 30000,
			success : function(e) {
				self.megafon.setImage('/assets/megafon.png');
				Ti.API.info("response is => " + JSON.stringify(e));
				self.megafon.transform = Ti.UI.create2DMatrix({
					scale : 1
				});
			},
			error : function(d) {
				self.megafon.setImage('/assets/megafon.png');
				Ti.API.info("error is => " + JSON.stringify(d));
			}
		});
		updateLevel();

	});
	self.addEventListener('focus', function() {
		Ti.Android && Ti.UI.createNotification({
			message : 'Berühre den Mann, um die Aufnahme zu starten'
		}).show();
	});
	return self;
};


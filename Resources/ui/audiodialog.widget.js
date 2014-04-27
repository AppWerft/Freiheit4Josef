exports.create = function(_args, _onOk) {
	var data = _args;
	var androidview = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 50,
		backgroundColor : 'black'
	});
	/*androidview.add(Ti.Media.createVideoPlayer({
	 url : data.url,
	 top : 0,
	 autoplay : true,
	 height : 50,
	 mediaControlStyle : Ti.Media.VIDEO_CONTROL_FULLSCREEN,
	 width : Ti.UI.FILL,
	 backgroundColor : 'black'
	 }));*/
	var title = Ti.UI.createTextField({
		top : 0,
		width : Ti.UI.FILL,
		height : 50,
		backgroundColor : 'black',
		hintText : 'Kurztext zum Soundschnipsel'
	});
	androidview.add(title);
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		androidView : androidview,
		buttonNames : ['OK', 'Abbruch'],
		title : 'Audioversand'
	});

	dialog.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			data.title = title.getValue();
			_onOk(data);
		}
	});
	dialog.show();
	title.focus();
};

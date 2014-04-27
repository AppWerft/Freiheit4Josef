module.exports = function(_timeout, _callback) {
	if (!Ti.Network.online)
		_callback(false);
	else {
		var self = Ti.Network.createHTTPClient({
			timeout : _timeout || 3000,
			onload : function() {
				_callback(true);
			},
			onerror : function() {
				_callback(false);
			}
		});
		self.open('GET', 'https://www.google.com/');
		self.send();
	}
};

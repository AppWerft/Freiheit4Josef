module.exports = function(url, imageViewObject) {
	var filename = Ti.Utils.md5HexDigest(url);
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, filename);
	if(file.exists()) {
		imageViewObject.image = file.nativePath;
	} else {
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function() {
			if(xhr.status == 200) {
				file.write(xhr.responseData);
				imageViewObject.image = file.nativePath;
			};
		};
		xhr.open('GET', url);
		xhr.send();
	}
};

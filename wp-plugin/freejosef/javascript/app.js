var saveCB = {
	onOk : function() {
	},
	onError : function(error) {
	}
};

function Init() {
	/* stuff mit leafletMap: */
	function getPhotos() {
		Apiomat.Photo.getPhotos("order by createdAt limit 500", {
			onOk : function(_res) {
				var josefIcon = L.icon({
					iconUrl : '../wp-content/plugins/freejosef/images/high-pin.png',
					iconSize : [32, 32] // size of the icon

				});
				for (var i = 0; i < _res.length; i++) {
					var marker = L.marker([_res[i].getLocationLatitude(), _res[i].getLocationLongitude()], {
						icon : josefIcon
					}).addTo(map).bindPopup('<div class="leafletpopup" width="360px"><img width="300" src="' + _res[i].getPhotoURL(320, 240, null, null, 'png') + '" /></div>');
				}
				map.spin(false);
			},
			onError : function(error) {
				map.spin(false);
				alert('Keine Verbindung zum Photodepot.\n' + error);
			}
		});
	}

	if (jQuery('#josefmap').length) {
		jQuery('#josefmap').css('width', '100%').css('height', '600px').css('margin-bottom', '25px');
		jQuery('.headerimage,#secondary').remove();
		jQuery('#content,#main').css('width', '100%');
		var watercolor = new L.TileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", {
			maxZoom : 17,
			minZoom : 1,
			tms : false,
			errorTileUrl : "http://www.mapsmarker.com/wp-content/plugins/leaflet-maps-marker/inc/img/error-tile-image.png",
			attribution : "Map: Map tiles: <a href=\"http://stamen.com\" target=\"_blank\">Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\" target=\"_blank\">CC BY 3.0</a>. Data: <a href=\"http://openstreetmap.org\" target=\"_blank\">OpenStreetMap</a>, <a href=\"http://creativecommons.org/licenses/by-sa/3.0\" target=\"_blank\">CC BY SA</a>",
			continuousWorld : false,
			noWrap : false,
			detectRetina : true
		});
		var osm_mapnik = new L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution : 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
			maxZoom : 16
		});
		var map = L.map('josefmap').setView([52.6, 10], 7);
		map.addLayer(osm_mapnik);
		map.spin(true);
		jQuery("#josefmap").append('<img src="../wp-content/plugins/freejosef/images/spinner.gif" />');
		var myNutzer = new Apiomat.Nutzer();
		myNutzer.setUserName("anonymouswebuser");
		myNutzer.setPassword("secret");
		Apiomat.Datastore.configure(myNutzer);
		myNutzer.save(saveCB);
		myNutzer.loadMe({
			onOk : getPhotos,
			onError : getPhotos
		});
	}

}


jQuery(document).ready(Init);

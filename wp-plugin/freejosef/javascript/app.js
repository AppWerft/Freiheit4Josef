var saveCB = {
    onOk : function() {
        console.log("saved");
        //Now you can create objects of your class with this new user..
    },
    onError : function(error) {
        console.log("Some error occured: (" + error.statusCode + ")" + error.message);
    }
}

function Init()   {
	/* stuff mit leafletMap: */	
 	jQuery('#josefmap').css('width','100%').css('height','600px');
 	jQuery('.headerimage').hide();
 	jQuery('#secondary').remove();jQuery('#content,#main').css('width','100%');
 	var watercolor = new L.TileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", {maxZoom: 17, minZoom: 1, tms: false, errorTileUrl: "http://www.mapsmarker.com/wp-content/plugins/leaflet-maps-marker/inc/img/error-tile-image.png", attribution: "Map: Map tiles: <a href=\"http://stamen.com\" target=\"_blank\">Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\" target=\"_blank\">CC BY 3.0</a>. Data: <a href=\"http://openstreetmap.org\" target=\"_blank\">OpenStreetMap</a>, <a href=\"http://creativecommons.org/licenses/by-sa/3.0\" target=\"_blank\">CC BY SA</a>", continuousWorld: false, noWrap: false, detectRetina: true});
	var osm_mapnik = new   L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
		maxZoom: 16
	});var map = L.map('josefmap').setView([51.505, 10], 6);
	map.addLayer(osm_mapnik);
	 /* Create a new member/user of your app */
    var myNutzer = new Apiomat.Nutzer();    
    myNutzer.setUserName("webuser" + new Date().getTime());
    myNutzer.setPassword("secret");
    
    /* configure datastore with member credentials */
    Apiomat.Datastore.configure(myNutzer);
    /* and save it */
    myNutzer.save(saveCB);

    /* Later on you may want to reload myNutzer */
    myNutzer.loadMe({
        onOk : function() {
            //Now you can do sth with loaded object
        },
        onError : function(error) {
            //handle error
        }
    });var josefIcon = L.icon({
    iconUrl: '../wp-content/plugins/freejosef/images/high-pin.png',
 
    iconSize:     [32, 32] // size of the icon

});
	Apiomat.Photo.getPhotos("order by createdAt limit 500", {
		onOk : function(_res) {
			var bar = [];
			for (var i = 0; i < _res.length; i++) {
				var marker = L.marker([_res[i].getLocationLatitude(), _res[i].getLocationLongitude()],{icon: josefIcon}).addTo(map).bindPopup('<img src="'+ _res[i].getPhotoURL(320, 240, null, null, 'png') + '" />');
				bar.push({
					latitude : _res[i].getLocationLatitude(),
					longitude : _res[i].getLocationLongitude(),
					title : _res[i].getTitle(),
					thumb : _res[i].getPhotoURL(100, 100, null, null, 'png'),
					bigimage : _res[i].getPhotoURL(800, 800, null, null, 'png') ,
				});
			}
		},
		onError : function(error) {
			//handle error
		}
	});
}

jQuery(document).ready(Init);

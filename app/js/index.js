$(
	function(){
		// create a map in the "map" div, set the view to a given place and zoom
		var map = L.map('map').setView([50, 50], 3);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		getGeoObjects();

		function getGeoObjects(){
			$.ajax({
			async: false,
				type: 'GET',
				url: "http://localhost:8080/api/object",
				dataType: 'json',
				error: function(xhr, status, error) {
					alert("ERROR: "+error);
				},
				success: function(data){
					for (var i = 0; i < data.length; i++){
						console.log(data[i]);
						var e = data[i];
						addMarker(e, map);
					}
				}
			});
		}
		function addMarker(marker, map){
			var marker = L.marker([marker.lat, marker.lon]).addTo(map)
			 .bindPopup(marker.name + ': ' + marker.strength);
		}
});
		
	
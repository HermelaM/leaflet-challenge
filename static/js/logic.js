// Creating map object
var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 2
});

// Adding tile layer
var newMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY 
}).addTo(map);

// Load in geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3.json(url).then(data => {
//   console.log(data);


// Grab data with d3
d3.json(url, function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: Color(feature.properties.mag),
      color: "#000000",
      radius: Radius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // color markers
  function Color(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#e07e65";
    case magnitude > 4:
      return "#a1ed5a";
    case magnitude > 3:
      return "#70a108";
    case magnitude > 2:
      return "#a1a108";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#961c0c";
    }
  }

  // Determining the radius 
  function Radius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
   
     // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  //// Set up the legen
  var legend = L.control({
    position: "bottomright"
  });

   // legend control
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5],
          labels = [];

          
      for (var i = 0; i <  magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor( magnitudes[i] + 1) + '"></i> ' +
              magnitudes[i] + ( magnitudes[i + 1] ? '&ndash;' +  magnitudes[i + 1] + '<br>' : '+');
      }
  
    return div;
  };

// Adding legend to the map
  legend.addTo(map);
});
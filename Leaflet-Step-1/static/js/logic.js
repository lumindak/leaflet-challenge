// Function to creating base map object and layers
//Written by Luminda Kulasiri Jul. 4 , 2020
//////////////////////////////////////////////////

function createMap(locations)
{  
    // tile layer for the light-map, 
    var map1 = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    })
  
   //tile layer for satellite-map
    var map2 = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    })

    //tile layer for outdoor-map
    var map3 = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    })

    //link to the faultline data 
    var boundaryData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
   
// a new layer group object for the faultlines
 var faultlines = new  L.LayerGroup();
 d3.json(boundaryData, function(data) {
    L.geoJSON(data, {
      style: function() {
        return {color: "orange", fillOpacity: 0}
      }
    }).addTo(faultlines)
  })

     // Create a baseMaps object to hold the lightmap layer
  var basemap = {
    "Grayscale": map1,
    // "Satellite": map2,
    // "Outdoors":map3
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlaymap = {
    "Eathquakes": locations,
  //  "Faultlines": faultlines
  };

  
    // Create the map object with options
    var map = L.map("map", {
    center: [45, -95],
    zoom: 3,
    layers: [map1,locations]
  });

  // L.control.layers(basemap, overlaymap, {
  //   collapsed: false
  // }).addTo(map);

  

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var limits =["0-1","1-2","2-3","3-4","4-5","5+"];
   colors =["#CEFF33","#FCFF33","#FFD133","#FF8734","#FF6234", "#FF3434"]
    var labels = [];
   
  //could be done in a for-loop but I like the freedom for the customization of each item in this way
    labels.push('<i style="background-color:' + colors[0] +';' + 'padding-left: 20px;padding-top: 3px'+ ';">' + '</i>' +
     '&nbsp'+'&nbsp'+'&nbsp'+ limits[0]+ '<br>' + 
    '<i style="background-color:' + colors[1] + ';' + 'padding-left: 20px;padding-top: 3px' + ';">' + '</i>' + 
    '&nbsp'+'&nbsp'+'&nbsp'+limits[1]+ '<br>' + 
    '<i style="background-color:' + colors[2] +';' + 'padding-left: 20px;padding-top: 3px'+ ';">' + '</i>' + 
    '&nbsp'+'&nbsp'+'&nbsp'+limits[2]+ '<br>' +
    '<i style="background-color:' + colors[3] +';' + 'padding-left: 20px;padding-top: 3px'+ ';">' + '</i>' + 
    '&nbsp'+'&nbsp'+'&nbsp'+limits[3]+ '<br>' +
    '<i style="background-color:' + colors[4] +';' + 'padding-left: 20px;padding-top: 3px'+ ';">' + '</i>' + 
    '&nbsp'+'&nbsp'+'&nbsp'+limits[4]+ '<br>' +
    '<i style="background-color:' + colors[5] +';' + 'padding-left: 20px;padding-top: 3px'+ ';">' + '</i>' + 
    '&nbsp'+'&nbsp'+'&nbsp'+limits[5]);

    div.innerHTML = labels;
    //console.log(labels);
    return div;
    
    }
//   // Adding legend to the map
   //console.log(legend);
   legend.addTo(map);

}

function colorCode(magnitude)
{
    if (magnitude>0 & magnitude< 1) { return "#CEFF33";}
    else if (magnitude>=1 & magnitude< 2) { return "#FCFF33"; }
    else if (magnitude>=2 & magnitude< 3) { return "#FFD133"; }
    else if (magnitude>=3 & magnitude< 4) { return "#FF8734"; }
    else if (magnitude>=4 & magnitude< 5) { return "#FF6234"; }
    else { return "#FF3434" ;} 

}



// Link to all Earthquake data for the past week 
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//link to the faultline data
//var boundaryData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//d3.json(earthquakeData);
// //function to create markers

var LocationMarkers = [];
var markerClusters = L.markerClusterGroup();
var faultlineData = [];

function createLayers(response) {
    var url = response.metadata.url;
    var length = response.features.length;
    for (i= 0; i<length ; i++) {

        var longitude= response.features[i].geometry.coordinates[0];
        var latitude = response.features[i].geometry.coordinates[1];
        var mag = response.features[i].properties.mag;
        //console.log(response.features[i].properties.mag);
       var LocationMarker = L.circleMarker([latitude, longitude],
        {
            radius: (response.features[i].properties.mag)*2,
            color: colorCode(response.features[i].properties.mag),
            //color: '#000000',
            fill: true,
            weight: 1,
            fillcolor: colorCode(response.features[i].properties.mag),
            fillOpacity: 1
            
        })
        
       //var markercluster= L.markerClusterGroup([latitude, longitude])
        .bindPopup("<h3>" + 'Lat: ' + latitude + "<br>" + "Long: " + longitude + "<br>"+
        "Mag: " + mag+"</h3>");

        // Add the marker to the bikeMarkers array
        LocationMarkers.push(LocationMarker);
       
       


    }
  
    createMap(L.layerGroup(LocationMarkers));  
}

// //create a d3 object using the data
d3.json(earthquakeData, createLayers);







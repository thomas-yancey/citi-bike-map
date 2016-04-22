function MapController(applicationController) {
  this.map = null
  this.parent = applicationController
  this.markers = []
  this.infoWindows = []
  this.positionMarker = null
}

MapController.prototype = {
  init: function(){
    var mapOptions = {
            center: { lat: 40.7, lng: -74},
            zoom: 4
          };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  },

  updateLocation: function(latLon){
    this.map.setCenter(latLon);
    this.map.setZoom(15);
    this.grabMarkersFromCiti()
  },

  grabMarkersFromCiti: function(){
    $.ajax({
      url: 'maps/all_data',
      dataType: 'json',
      method: 'GET'
    }).done(function(response){
      applicationController.mapController.createBuildMarkers(response)
    }).fail(function(response){
      // do something
    })
  },

  createBuildMarkers: function(response){
    stations = response.stationBeanList;
    this.parent.buildStations(stations)
    for (i = 0; i < this.parent.stations.length; i++){
      this.addMarker(this.parent.stations[i],this.map)
    }
  },

  addMarker: function(mark) {
    // debugger
    var shade = this.colorShade(this.percentBikes(mark.availableBikes,mark.totalDocks));
    var marker = new google.maps.Marker({
      position: {lat: mark.latitude, lng: mark.longitude},
      map: this.map,
      icon: this.full_url(shade)
     });
      // icon: full_url
      debugger
    var infowindow = new google.maps.InfoWindow({
      content: "<p>" + mark.stationName + "</p><p>availableBikes: " + mark.availableBikes.toString() + "</p><p>availableDocks: " + mark.availableDocks.toString() + "</p>"
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(this.map,marker);
    });
  },

  full_url: function(shade){
    return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + shade;
  },

  percentBikes: function(bikes,total){
    return (bikes / total);
  },

  colorShade: function(val){
    if (val <= .1){
      return "FFFFFF";
    } else if (val <= .2){
      return "FFE6E6";
    } else if (val <= .3){
      return 'FFC8C8';
    } else if (val <= .4){
      return 'FFA9A9';
    } else if (val <= .5){
      return 'FF8A8A';
    } else if (val <= .6){
      return 'FF6C6C';
    } else if (val <= .7){
      return 'FF4D4D';
    } else if (val <= .7){
      return 'FF2E2E';
    } else if (val <= .9){
      return 'FF0F0F';
    } else {
      return 'C70000';
    }
  }

}
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
    this.addPersonalLocationMarker(latLon)
    this.map.setCenter(latLon);
    this.map.setZoom(15);
    this.grabMarkersFromCiti()
  },

  showAllLocations: function(){
    this.grabMarkersFromCiti();
  },

  addPersonalLocationMarker: function(latLon){
      var marker = new google.maps.Marker({
        position: latLon,
        map: this.map,
        icon: "http://i.stack.imgur.com/orZ4x.png"
      })
  },

  grabMarkersFromCiti: function(){
    $.ajax({
      url: 'maps/all_data',
      dataType: 'json',
      method: 'GET'
    }).done(function(response){
      applicationController.mapController.createBuildMarkers(response);
    }).fail(function(response){
      alert("not able to pull data from citiBike")
    })
  },

  createBuildMarkers: function(response){
    debugger
    stations = response.stationBeanList;
    this.parent.buildStations(stations)
    for (i = 0; i < this.parent.stations.length; i++){
      this.addMarker(this.parent.stations[i]);
    };
  },

  setMinBikeStations: function(min){
    currStations = this.parent.stations
    for (var i = 0; i < currStations.length; i++){
      if (currStations[i].availableBikes > min){
        console.log(currStations[i].availableBikes)
        this.addMarker(currStations[i])
      };
    };
  },

  clearMarkers: function(){
    this.setMapOnAll(null);
  },

  setMapOnAll: function(map){
    for (var i = 0; i < this.markers.length; i++){
      this.markers[i].setMap(map);
    };
  },

  addMarker: function(mark) {
    var marker = this.createMarker(mark)
    var infoWindow = this.createInfoWindow(mark);
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(this.map,marker);
    });
    this.markers.push(marker);
  },

  createMarker: function(mark){
    return new google.maps.Marker({
      position: {lat: mark.latitude, lng: mark.longitude},
      map: this.map,
      icon: mark.icon
    });
  },

  createInfoWindow: function(mark){
    return new google.maps.InfoWindow({
      content: "<p>" + mark.stationName + "</p><p>Bikes: " + mark.availableBikes.toString() + " Docks: " + mark.availableDocks.toString() + "</p>"
    });
  },

  hasMinBike: function(min){
    this.clearMarkers();
    this.markers = [];
    this.setMinBikeStations(min);
  },
}
 function MapController(applicationController) {
  this.map = null
  this.parent = applicationController
  this.markers = []
  this.infoWindows = []
  this.positionMarker = null
  this.searchType = "availableBikes"
  this.locationId = null
  this.min = 0
  this.panLocation = null
}

MapController.prototype = {
  init: function(){
    var mapOptions = {
            center: { lat: 40.7, lng: -74},
            zoom: 10
          };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.grabMarkersFromCiti();
  },

  updateLocation: function(latLon){
    this.addPersonalLocationMarker(latLon)
    this.map.setCenter(latLon);
    this.map.setZoom(15);
  },

  noLocation: function(latLon){
    this.map.setZoom(15);
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
    $('#loader').show();
    var searchParams = {
      min: this.min,
      searchType : this.searchType
    }
    $.ajax({
      url: 'maps/all_data',
      dataType: 'json',
      method: 'GET',
      data: searchParams
    }).done(function(response){
      applicationController.mapController.createBuildMarkers(response.stationBeanList);
    }).fail(function(response){
      alert("not able to pull data from citiBike")
    })
  },

  createBuildMarkers: function(response){
    stations = response
    this.parent.buildStations(stations);
    for (i = 0; i < this.parent.stations.length; i++){
      if (this.parent.stations[i][this.searchType] >= this.min){
        this.addMarker(this.parent.stations[i]);
      };
    };

    if (this.panLocation !== null){
      this.map.panTo(this.panLocation);
      this.panLocation = null;
      this.locationId = null;
    }
    $('#loader').hide();
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

    if (marker.id === this.locationId){
      infoWindow.open(this.map,marker);
      this.panLocation = marker.position;
    };

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(this.map,marker);
    });

    this.markers.push(marker);
  },

  createMarker: function(mark){
    console.log("latitude: " + mark.latitude + "| lng " + mark.longitude);
    return new google.maps.Marker({
      id: mark.id,
      position: {lat: mark.latitude, lng: mark.longitude},
      map: this.map,
      icon: mark.icon
    });
  },

  createInfoWindow: function(mark){
    return new google.maps.InfoWindow({
      content: "<p>" + mark.stationName + "</p><p>Bikes: " + mark.availableBikes.toString() + " Docks: " + mark.availableDocks.toString() + "</p><p><a href='" + mark.mapUrl + "'>Navigate to Station</a></p>"
    });
  },

  resetAndSearch: function(){
    this.clearMarkers();
    this.parent.stations = [];
    this.markers = [];
    this.grabMarkersFromCiti();
  }
}
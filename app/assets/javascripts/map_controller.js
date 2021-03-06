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
  this.personalLocation = null
  this.firstPan = true
}

MapController.prototype = {
  init: function(){
    var mapOptions = {
            center: { lat: 40.7, lng: -74},
            zoom: 15,
            disableDefaultUI: true
          };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.grabMarkersFromCiti();
  },

  updateLocation: function(latLon){
    this.clearPersonalLocationMarker();
    this.addPersonalLocationMarker(latLon);
    this.map.panTo(this.personalLocation.position);
  },

  noLocation: function(latLon){
    // alert("turn on gps for best results")
  },

  showAllLocations: function(){
    this.grabMarkersFromCiti();
  },

  clearPersonalLocationMarker: function(){
    if (this.personalLocation !== null){
      this.personalLocation.setMap(null);
      this.personalLocation = null;
    };
  },

  addPersonalLocationMarker: function(latLon){
      var marker = new google.maps.Marker({
        position: latLon,
        map: this.map,
        icon: "http://i.stack.imgur.com/orZ4x.png"
      })
      this.personalLocation = marker;
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
    $('.text-muted').html(this.currentTime());
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
  },

  currentTime: function(){
    var date = new Date();
    var ampm = "AM";
    hour = date.getHours();
    if (hour > 12){
      hour = hour - 12;
      ampm = "PM";
    } else if (hour === 12){
      ampm = "PM";
    } else if (hour === 0) {
      hour = 12;
    };
    min = date.getMinutes();
    sec = date.getSeconds();
    return "Last Update - " + hour.toString() + ":" + this.minSecFormat(min) + ":" + this.minSecFormat(sec) + " " + ampm;
  },

  minSecFormat: function(num){
    var numString = num.toString();
    while (numString.length < 2){
      numString = "0" + numString;
    }
    return numString;
  }
}
function ApplicationController(){
  this.mapController = new MapController(this)
  this.stations = []
}

ApplicationController.prototype = {
  init: function(){
    this.mapController.init()
    this.getLocation();
  },

  getLocation: function(){
    navigator.geolocation.getCurrentPosition(this.gotLocation.bind(this),this.noLocation())
  },

  gotLocation: function(pos) {
    var coords = pos.coords
    var latLon = {lat: coords.latitude, lng: coords.longitude}
    this.mapController.updateLocation(latLon)
  },

  noLocation: function() {
    // alert("turn on location services for current location");
  },

  buildStations: function(stations){
    for (var i = 0; i < stations.length; i++){
      if (stations[i].statusKey === 1){
        this.stations.push(new Station(stations[i]))
      };
    };
  },
}
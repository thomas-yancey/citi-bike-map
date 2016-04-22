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
    navigator.geolocation.getCurrentPosition(this.gotLocation.bind(this))
  },

  gotLocation: function(pos) {
    var coords = pos.coords
    var latlon = {lat: coords.latitude, lng: coords.longitude}
    this.mapController.updateLocation(latlon)
  },

  buildStations: function(stations){
    for (var i = 0; i < stations.length; i++){
      if (stations[i].statusKey === 1){
        this.stations.push(new Station(stations[i]))
      };
    };
  },
}
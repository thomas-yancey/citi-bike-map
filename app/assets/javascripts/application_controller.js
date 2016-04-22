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
    navigator.geolocation.getCurrentPosition(this.success.bind(this))
  },

  success: function(pos) {
    var coords = pos.coords
    var latlon = {lat: coords.latitude, lng: coords.longitude}
    this.mapController.updateLocation(latlon)
  },

  buildStations: function(stations){
    for (var i = 0; i < stations.length; i++){
      this.stations.push(new this.station(stations[i]))
    }
  },

  station: function(obj){
    this.availableBikes = obj.availableBikes,
    this.availableDocks = obj.availableDocks,
    this.id = obj.id,
    this.landMark = obj.landMark,
    this.lastCommunicationTime = obj.lastCommunicationTime,
    this.latitude = obj.latitude,
    this.longitude = obj.longitude,
    this.stationName = obj.stationName,
    this.statusKey = obj.statusKey,
    this.statusValue = obj.statusValue,
    this.testStation = obj.testStation,
    this.totalDocks = obj.totalDocks
  },
}
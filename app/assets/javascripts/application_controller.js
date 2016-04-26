function ApplicationController(){
  this.mapController = new MapController(this)
  this.stations = []
  this.watchID = null
  this.liveGPS = false
}

ApplicationController.prototype = {
  init: function(){
    this.mapController.init()
    this.getLocation();
  },

  toggleGPS: function(){
    if (this.liveGPS === false){
      this.liveGPS = true;
      this.followGPS();
    } else {
      this.liveGPS = false;
      this.disableGPS();
    }
  },

  followGPS: function(){
    this.watchID = navigator.geolocation.watchPosition(this.gotLocation.bind(this),this.noLocation, {
      maximumAge: 1000,
      enableHighAccuracy: true
    });
  },

  disableGPS: function(){
    navigator.geolocation.clearWatch(this.watchID);
  },

  getLocation: function(){
    navigator.geolocation.getCurrentPosition(this.gotLocation.bind(this),this.noLocation());
  },

  gotLocation: function(pos) {
    var coordinates = pos.coords;
    var latLng = {lat: coordinates.latitude, lng: coordinates.longitude};
    this.mapController.updateLocation(latLng)
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

  listStations: function(stations){
    var $builder = $("<div id=list-stations></div>");
    for (var i = 0; i <this.stations.length; i++){
      var curr = this.stations[i];
      $builder.append("<div class='station'>");
      $builder.append("<a href='" + curr.id.toString() + "'><h3>" + curr.stationName + "</h3></a>");
      $builder.append("<p>Bikes: " + curr.availableBikes + " Available Docks: " + curr.availableDocks + "</p>");
      $builder.append("</div>");
    }
    return $builder
  }
}
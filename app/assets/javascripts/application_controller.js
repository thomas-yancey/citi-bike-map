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
      this.mapController.firstPan = true;
      this.followGPS();
      $('#not-following').hide();
      $('#following').show();
    } else {
      this.liveGPS = false;
      this.disableGPS();
      $('#following').hide();
      $('#not-following').show();
    }
  },

  getClosestLocations: function(){

    var coords = this.mapController.personalLocation.position;
    var myPosition = {latitude: coords.lat(), longitude: coords.lng()};
    var distances = []

    for (var i = 0; i < this.stations.length; i++){
      var currLatLng = {latitude: this.stations[i].latitude, longitude: this.stations[i].longitude};
      // 0.00621371 is to convert to miles
      var distance = (geolib.getDistance(myPosition, currLatLng) * 0.000621371).toFixed(3);
      distances.push([distance, this.stations[i]]);
    };

    var sorted = distances.sort(function(a,b){
      return a[0] - b[0]
    });

    return sorted.slice(0,5);

  },

  followGPS: function(){
    console.log("following");
    this.watchID = navigator.geolocation.watchPosition(this.gotLocation.bind(this),this.noLocation, {
      maximumAge: 1000,
      enableHighAccuracy: true
    });
  },

  disableGPS: function(){
    console.log("not following");
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
    this.mapController.noLocation();
  },

  buildStations: function(stations){
    for (var i = 0; i < stations.length; i++){
      if (stations[i].statusKey === 1){
        this.stations.push(new Station(stations[i]))
      };
    };
  },

  listStations: function(){

    var $builder = $("<div id=list-stations></div>");
    for (var i = 0; i < this.stations.length; i++){
      var curr = this.stations[i];
      $builder.append("<div class='station'>");
      $builder.append("<a href='" + curr.id.toString() + "'><h3>" + curr.stationName + "</h3></a>");
      $builder.append("<p>Bikes: " + curr.availableBikes + " Available Docks: " + curr.availableDocks + "</p>");
      $builder.append("</div>");
    };
    return $builder;
  },

  listClosestStations: function(stations){

    var $builder = $("<div id=list-stations></div>");
    for (var i = 0; i < stations.length; i++){
      var curr = stations[i];
      $builder.append("<div class='station'>");
      $builder.append("<a href='" + curr[1].id.toString() + "'><h3>" + curr[1].stationName + "</h3></a>");
      $builder.append("<p>Bikes: " + curr[1].availableBikes + " Available Docks: " + curr[1].availableDocks + "</p>");
      $builder.append("<p>Distance: " + curr[0].toString() + " Miles</p>");
      $builder.append("</div>");
    };
    return $builder;
  }
}
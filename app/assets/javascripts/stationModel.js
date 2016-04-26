function Station(obj){
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
    this.totalDocks = obj.totalDocks,
    this.icon = this.fullIconUrl(this.totalBikes,this.totalDocks)
    this.mapUrl = this.mapsUrlBuilder(this.latitude, this.longitude)
  };

  Station.prototype = {

    fullIconUrl: function(totalBikes,totalDocks){
      var percentage = this.percentBikes(this.availableBikes, this.totalDocks);
      var shade = this.colorShade(percentage);
      return this.iconUrlBuilder(shade)
    },

    iconUrlBuilder: function(shade){
      return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + shade;
    },

    percentBikes: function(bikes,total){
      return (bikes / total);
    },

    colorShade: function(val){
      if (val === 0){
        return "FFFFFF";
      } else if (val <= .12){
        return "FFE6E6";
      } else if (val <= .24){
        return 'FFC8C8';
      } else if (val <= .36){
        return 'FFA9A9';
      } else if (val <= .48){
        return 'FF8A8A';
      } else if (val <= .6){
        return 'FF6C6C';
      } else if (val <= .72){
        return 'FF4D4D';
      } else if (val <= .84){
        return 'FF2E2E';
      } else if (val < 1){
        return 'FF0F0F';
      } else {
        return '030000';
      }
    },

    mapsUrlBuilder: function(lat, lng){
      var startUrl = "http://maps.google.com/maps?q="
      var fullUrl = startUrl + lat.toString() + "," + lng.toString();
      return fullUrl;
    }
  }
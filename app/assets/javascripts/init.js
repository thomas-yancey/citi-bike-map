$(document).ready(function(){
  $('#following').hide()
  applicationController = new ApplicationController()
  applicationController.init()
  eventHandlers();
})

var eventHandlers = function(){

  var mapController = applicationController.mapController;
  var modal = document.getElementById('myModal');
  var span = document.getElementById("spanClose");
  var $form = $("<form id='minNum' action='/maps/all_data' accept-charset='UTF-8' method='post'><input type='text' name='custom' id='custom' /><input type='submit' name='commit' value='Save changes' /></form>");

  $('#live-gps-container').on ('click', function(){
    applicationController.toggleGPS();
  })

  $('#show-all').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    $('#loader').show();
    mapController.searchType = "availableDocks";
    mapController.min = 0;
    mapController.resetAndSearch();
  });

  $('#location').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.firstPan = true;
    applicationController.getLocation();
  });

  $('#has-bikes').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.searchType = "availableBikes";
    $('#myModal #inner-content').empty();
    var $h2 = $("<h2>Minimum # of Bikes<h2>");
    $('#myModal #inner-content').append($h2);
    $('#myModal #inner-content').append($form);
    modal.style.display = 'block';
  });

  $('.navbar-brand').on ('click', function(event){
    event.preventDefault();
  });

  $('#has-docks').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.searchType = "availableDocks";
    $('#myModal #inner-content').empty();
    var $h2 = $("<h2>Minimum # of Docks<h2>");
    $('#myModal #inner-content').append($h2);
    $('#myModal #inner-content').append($form);
    modal.style.display = 'block';
  });

  $('#list-close-stations').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    $('#myModal #inner-content').empty();
    var stations = applicationController.getClosestLocations();
    $('#myModal #inner-content').append(applicationController.listClosestStations(stations));
    modal.style.display = 'block';
  });

  $('#list-stations').on ('click', function(event){
    event.preventDefault();
    $('button.navbar-toggle').click();
    $('#myModal #inner-content').empty();
    $('#myModal #inner-content').append(applicationController.listStations());
    modal.style.display = 'block';
  });

  span.onclick = function() {
      modal.style.display = "none";
  };

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      };
  };

  $('#inner-content').on ('submit', '#minNum', function(event){
    event.preventDefault();
    var min = Number($(this).find('input[name="custom"]').val());
    mapController.min = min
    modal.style.display = "none";
    mapController.resetAndSearch();
  });

  $('#inner-content').on ('click', 'a', function(event){
    event.preventDefault();
    mapController.locationId = Number($(this).attr('href'));
    mapController.searchType = "availableBikes";
    mapController.min = 0;
    modal.style.display = "none";
    mapController.resetAndSearch();
  });
}


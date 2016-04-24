$(document).ready(function(){
  applicationController = new ApplicationController()
  applicationController.init()
  eventHandlers();
})

var eventHandlers = function(){

  var mapController = applicationController.mapController;
  var modal = document.getElementById('myModal');
  var span = document.getElementById("spanClose");

  $('#show-all').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.searchType = "availableDocks";
    mapController.min = 0;
    mapController.resetAndSearch();
  });

  $('#location').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    applicationController.getLocation();
  });

  $('#has-bikes').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.searchType = "availableBikes";
    $('#myModal h2').text("Minimum # of Bikes");
    modal.style.display = 'block';
  });

  $('#has-docks').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    mapController.searchType = "availableDocks";
    $('#myModal h2').text("Minimum # of Docks");
    modal.style.display = 'block';
  });

  // When the user clicks the button, open the modal
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  $('#minNum').on ('submit', function(){
    event.preventDefault();
    var min = Number($(this).find('input[name="custom"]').val());
    mapController.min = min
    modal.style.display = "none";
    mapController.resetAndSearch();
  })
}
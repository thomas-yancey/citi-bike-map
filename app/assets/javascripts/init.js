$(document).ready(function(){
  applicationController = new ApplicationController()
  applicationController.init()

  $('#show-all').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    applicationController.mapController.hasMinBikes(0);
  });

  $('#location').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    applicationController.getLocation();
  });

  $('#has-bikes').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    applicationController.mapController.hasMinBikes(1);
  });

  $('#has-docks').on ('click', function(){
    event.preventDefault();
    $('button.navbar-toggle').click();
    applicationController.mapController.hasMinDocks(1);
  });

})
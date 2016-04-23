$(document).ready(function(){
  applicationController = new ApplicationController()
  applicationController.init()

  $('#clear-all').on ('click', function(){
    event.preventDefault();
    applicationController.mapController.hasAtLeastOneBike();
  });

  $('#show-all').on ('click', function(){
    event.preventDefault();
    applicationController.mapController.showAllLocations();
  });


})
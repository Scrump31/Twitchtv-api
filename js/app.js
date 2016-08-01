var twitchApp = angular.module('twitchApp', []);
twitchApp.controller('ChannelCtrl', function($scope, $http, $q) {
  myarray = [
  {"name": "freecodecamp"},
  {"name": "comster404"},
  {"name": "brunofin"},
  {"name": "OgamingSC2"},
  {"name": "cretetion"},
  {"name": "storbeck"},
  {"name": "habathcx"},
  {"name": "RobotCaleb"},
  {"name": "noobs2ninjas"},
  {"name": "ESL_SC2"}
  ];
  // Get API data for each myarray item
  angular.forEach(myarray, function(value, key) {
  // APIs for needed data
  var twitchChannel = $http.jsonp('https://api.twitch.tv/kraken/channels/'+value.name+'?callback=JSON_CALLBACK');
  var streamData = $http.jsonp('https://api.twitch.tv/kraken/streams/'+value.name+'?callback=JSON_CALLBACK');
  $q.all([twitchChannel, streamData])
.then(function(response) {
    //use placeholder img if no img or account present
    if(response[0].data.logo === null || response[0].data.error) {
      $scope.ChanLogo = 'http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png';
    }else{ $scope.ChanLogo = response[0].data.logo;}

    //gets channel URL
    $scope.ChanUrl = response[0].data.url;
    //console.log(response[0].data);
    // Output for non-active accounts
    if(response[0].data.error){$('#output').append('<div class="row bg-danger offline">'+
              '<div class="col-md-4"><img class="img-responsive img-circle" src="'+$scope.ChanLogo+'" alt="Account Closed Img" /></div>'+
              '<div class=" col-md-4"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
              '<div class=" col-md-4">Account Closed</div>'+
              '</div>');
    // Output for offline accounts
    }else if(response[1].data.stream === null) {
        $scope.StrGame = "Offline";
        $('#output').append('<div class="row bg-sleep offline">'+
                  '<div class="col-md-4"><img class="img-responsive img-circle" src="'+$scope.ChanLogo+'" alt="channel logo" /></div>'+
                  '<div class="col-md-4"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
                  '<div class="col-md-4">'+$scope.StrGame+'</div>'+
                  '</div>'
        );
    }else {
      // Output for currently streaming accounts
      $scope.StrGame = response[1].data.stream.game;
      $scope.StrGameStatus = response[1].data.stream.channel.status;
      $('#output').append('<div class="row bg-success online">'+
                '<div class="col-md-4"><img class="img-responsive img-circle" src="'+$scope.ChanLogo+'" alt="channel logo" /></div>'+
                '<div class="col-md-4"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
                '<div class="col-md-4">'+$scope.StrGame+ ': '+$scope.StrGameStatus+'</div>'+
                '</div>');
    }
  });// .then
  // Catches callback errors
  }, function errorCallback(response) {
           console.log(response.statusText);
  		});
});// controller

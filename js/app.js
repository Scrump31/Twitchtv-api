var twitchApp = angular.module('twitchApp', []);
//var twitchchannel = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
twitchApp.controller('ChannelCtrl', function($scope, $http, $q) {
  myarray = [
  {"name": "freecodecamp"},
  {"name": "comster404"},
  {"name": "brunofin"},
  {"name": "OgamingSC2"}
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
    if(response[0].data.error){$('#output').append('<div class="row">'+
              '<div class="col-md-3"><img class="img-responsive" src="'+$scope.ChanLogo+'" alt="Account Closed Img" /></div>'+
              '<div class="col-md-3"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
              '<div class="col-md-6">Account Closed</div>'+
              '</div>');
    // Output for offline accounts
    }else if(response[1].data.stream === null) {
        $scope.StrGame = "Offline";
        $('#output').append('<div class="row">'+
                  '<div class="col-md-3"><img class="img-responsive" src="'+$scope.ChanLogo+'" alt="channel logo" /></div>'+
                  '<div class="col-md-3"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
                  '<div class="col-md-6">'+$scope.StrGame+'</div>'+
                  '</div>'
        );
    }else {
      // Output for currently streaming accounts
      $scope.StrGame = response[1].data.stream.game;
      $scope.StrGameStatus = response[1].data.stream.channel.status;
      $('#output').append('<div class="row">'+
                '<div class="col-md-3"><img class="img-responsive" src="'+$scope.ChanLogo+'" alt="channel logo" /></div>'+
                '<div class="col-md-3"><a href="'+$scope.ChanUrl+'">'+value.name+'</a></div>'+
                '<div class="col-md-6">'+$scope.StrGame+ ': '+$scope.StrGameStatus+'</div>'+
                '</div>');
    }
  });// .then
  // Catches callback errors
  }, function errorCallback(response) {
           console.log(response.statusText);
  		});
});// controller
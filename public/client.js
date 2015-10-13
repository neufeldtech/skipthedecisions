var serverHostname = "192.168.0.2";
var app = angular.module('skipApp', []);
app.controller('skipController', function($scope, $window, $http, $timeout, $q){
  var loadingMessages = ['Did you break something?','Makin\' Bacon...','Good food takes time...','Any minute now...','Just a sec...','Asking the chef...','Almost there, mmkay?','Keep yer\' pants on...','Patience is a virtue...','Seriously...?','Again...?'];
  var messages = ['Ain\'t nobody got time for that!','Y U so lazy?','Who said choosing can\'t be easy?','It\'s your turn to spin the wheel!','It ain\'t easy bein\' cheesy.','Couches are just napkins you can sit on.'];
  $scope.message = messages[Math.floor(Math.random() * messages.length)];
  $scope.messageStatus = true;
  $scope.loading = false;
  $scope.success = false;
  $scope.eat = function() {
    $scope.messageStatus = false;
    $scope.loading = true;
    $scope.success = false;

    $scope.loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    var url = "http://"+serverHostname+":8080/restaurants/" + $scope.selectedCity ;
    $http.get(url)
      .success(function(response){
        var restaurants = response.restaurants;
        //$scope.randomRestaurant = response.restaurants[Math.floor(Math.random() * response.restaurants.length)];

        var t = 0;
        var counter = 0;
        angular.forEach(restaurants, function(r) {
          t += 15;
          $timeout(function(){
            counter += 1
            if (counter == restaurants.length ){
              console.log(counter);
              $scope.loading=false;
              $scope.success=true;
            }
            $scope.randomRestaurant = response.restaurants[Math.floor(Math.random() * response.restaurants.length)];
          }, t);
        });//end foreach


        //$scope.loadingStyle = {'color': '#000'};

      })
      .error(function(response){
        $scope.loading=false;
        $scope.success=false;
        $scope.message="Oops..Something went wrong";
        $scope.messageStatus = true;
      });
    }
    $scope.getCities = function() {
      $http.get("http://"+serverHostname+":8080/cities")
      .success(function(response){
        $scope.cities = response;
        $scope.selectedCity = $scope.cities[9];
      })
      .error(function(response){
        $scope.loading=false;
        $scope.success=false;
        $scope.message="Oops..Something went wrong";
        $scope.messageStatus = true;
      });
    }
    $scope.openUrl = function() {
      $window.open($scope.randomRestaurant.url, $scope.randomRestaurant.name);
    }
    //initializing function for getting cities
    $scope.getCities();

    // $scope.form = {type: $scope.cities[0]};
  });

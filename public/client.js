var app = angular.module('skipApp', []);
app.controller('skipController', function($scope, $window, $http){
  var loadingMessages = ['Makin\' Bacon...','Good food takes time...','Any minute now...','Just a sec...','Asking the chef...','Almost there, mmkay?','Keep yer\' pants on...','Patience is a virtue...','Seriously...?','Again...?'];
  var initMessages = ['Ain\'t nobody got time for that!','Y U so lazy?','Who said choosing can\'t be easy?','It\'s your turn to spin the wheel!','It ain\'t easy bein\' cheesy.','Couches are just napkins you can sit on.'];
  $scope.initMessage = initMessages[Math.floor(Math.random() * initMessages.length)];
  $scope.initMessageStatus = true;
  $scope.loading = false;
  $scope.success = false;
  $scope.eat = function() {
    $scope.initMessageStatus = false;
    $scope.success = false;
    $scope.loading = true;
    $scope.loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    $http.get("http://localhost:8080/restaurants/winnipeg")
      .success(function(response){
        var restaurants = response.restaurants;
        $scope.randomRestaurant = response.restaurants[Math.floor(Math.random() * response.restaurants.length)];
        $scope.loading=false;
        $scope.success=true;
      })
      .error(function(response){
        $scope.loading=false;
        $scope.success=false;
        $scope.initMessage="Oops..Something went wrong";
        $scope.initMessageStatus = true;
      });
    }
    $scope.getCities = function() {
      $http.get("http://localhost:8080/cities")
      .success(function(response){
        $scope.cities = response;
        $scope.selectedCity = $scope.cities[9];
      })
      .error(function(response){
        $scope.loading=false;
        $scope.success=false;
        $scope.initMessage="Oops..Something went wrong";
        $scope.initMessageStatus = true;
      });
    }
    $scope.openUrl = function() {
      $window.open($scope.randomRestaurant.url, $scope.randomRestaurant.name);
    }
    //initializing function for getting cities
    $scope.getCities();

    // $scope.form = {type: $scope.cities[0]};
  });

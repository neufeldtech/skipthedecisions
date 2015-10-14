var serverHostname = "192.168.0.2:8080";
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
    if (typeof localStorage === 'object') {
      try {
          localStorage.setItem("selectedCity",$scope.selectedCity);
      } catch (e) {
          console.log('LocalStorage is not fully supported.')
      }
    }

    var url = "http://"+serverHostname+"/restaurants/" + $scope.selectedCity ;
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

            $scope.randomRestaurant = response.restaurants[Math.floor(Math.random() * response.restaurants.length)];

            //if we get to the last one, execute this code:
            if (counter == restaurants.length ){
              $scope.loading=false;
              $scope.success=true;
              //lets find out our rating:
              $scope.starsArray = []
              var roundedDown = Math.floor($scope.randomRestaurant.rating);
              for (i=0;i < roundedDown;i++){
                $scope.starsArray.push(i);
              }
              //if it was a half star
              if ($scope.randomRestaurant.rating % 1 != 0) {
                $scope.halfStar = true;
              } else {
                $scope.halfStar = false;
              }

            }

          }, t);
        });//end foreach

      })
      .error(function(response){
        $scope.loading=false;
        $scope.success=false;
        $scope.message="Oops..Something went wrong";
        $scope.messageStatus = true;
      });
    }
    $scope.getCities = function() {
      $http.get("http://"+serverHostname+"/cities")
      .success(function(response){
        $scope.cities = response;


        if (typeof localStorage === 'object') {
          try {
            if (localStorage.getItem("selectedCity")){
              $scope.selectedCity = localStorage.getItem("selectedCity");
            } else {
              $scope.selectedCity = $scope.cities[0];
            }
          } catch (e) {
              console.log('LocalStorage is not fully supported.')
              $scope.selectedCity = $scope.cities[0];
          }
        }
              
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

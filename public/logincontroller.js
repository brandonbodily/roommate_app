angular.module("RoommateAngular").controller("LoginController",function ($scope, LoginService) {

	$scope.submitLoginForm = function () {
		$scope.noPassword = false;
		$scope.noHouseName = false;
		$scope.invalid = false;
		if (typeof $scope.houseName == 'undefined') {
			$scope.noHouseName = true;
		} else if (typeof $scope.password == 'undefined') {
			$scope.noPassword = true;
		} else {
			createSession();
		}
	};

	var createSession = function () {
			LoginService.postSession({
			houseName: $scope.houseName,
			password: $scope.password
		}).then(function (response) {
			// success callback
			console.log("Valid user");
			window.location.replace("http://localhost:8080/index.html");
		}, function (response) {
			// error callback
			console.error("Invalid user");
			$scope.invalid = true;
		});
	};

});
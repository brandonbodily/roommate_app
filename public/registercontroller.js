angular.module("RoommateAngular").controller("RegisterController",function ($scope, LoginService) {

	$scope.submitRegisterForm = function () {
		$scope.noNewPassword = false;
		$scope.noNewHouseName = false;
		$scope.invalidHouseName = false;
		if (typeof $scope.newHouseName == 'undefined') {
			$scope.noNewHouseName = true;
		} else if (typeof $scope.newPassword == 'undefined') {
			$scope.noNewPassword = true;
		} else {
			createUser();
		}
	};

	var createUser = function () {
			LoginService.createUser({
			email: $scope.newEmail,
			houseName: $scope.newHouseName,
			password: $scope.newPassword
		}).then(function (response) {
			// success callback
			console.log("Created user");
			createSession();
		}, function (response) {
			// error callback
			console.error("Error Creating Users");
			$scope.invalidHouseName = true;
		});
	};

	var createSession = function () {
			LoginService.postSession({
			houseName: $scope.newHouseName,
			password: $scope.newPassword
		}).then(function (response) {
			// success callback
			console.log("Valid user");
			window.location.replace("http://localhost:8080/index.html");
		}, function (response) {
			// error callback
			console.error("Invalid user");
		});
	};
});
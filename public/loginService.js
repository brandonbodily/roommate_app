angular.module("RoommateAngular").service("LoginService", function ($http, $httpParamSerializer) {
	//data: store users
	var userData = [];
	var responseOut = [];

	//AJAX: index of users
	var postSession = function (login) {
		return $http({
			method: 'POST',
			url:'http://localhost:8080/session',
			data: $httpParamSerializer(login), //string representation of the object
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		})
	};

	//AJAX: create a user
	var createUser = function (data) {
		return $http({
			method: 'POST',
			url:'http://localhost:8080/users',
			data: $httpParamSerializer(data), //string representation of the object
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		})
	};


	return {
		postSession: postSession,//dictionary key: value, value is a function
		createUser: createUser
	};

});
angular.module("RoommateAngular").service("RoommateService", function ($http, $httpParamSerializer) {
	//data: store roommates
	var roommateData = [];

//http://roommateappmean.herokuapp.com/roommates

	//AJAX: index of roommates
	var getRoommates = function () {
		$http({
			method: 'GET',
			url: 'http://localhost:8080/roommates'
		}).then(function (response) {
			//success callback
			console.log("Recieved roommates");
			console.log(roommateData);
			roommateData.splice(0, roommateData.length);
			var roommates = response.data;
			for (var i = 0; i < roommates.length; i++) {
				roommateData.push(roommates[i]);
			}
		}, function () {
			//error callback
			console.log("Error recieving roommates");
			window.location.replace("http://localhost:8080/login.html");
		});


		return roommateData;
	};

	//AJAX: create a roommate
	var createRoommate = function (data) {
		$http({
			method: 'POST',
			url:'http://localhost:8080/roommates',
			data: $httpParamSerializer(data), //string representation of the object
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		}).then(function () {
			// success callback
			console.log("Created roommate");
			getRoommates();
		}, function () {
			// error callback
			console.error("Error Creating Roommates");
		})

	};

	var updateRoommate = function (data) {
		$http({
			method: 'PUT',
			url:'http://roommateappmean.herokuapp.com/roommates/' + data.id,
			data: $httpParamSerializer(data), //string representation of the object
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		}).then(function () {
			// success callback
			console.log("Updated roommates");
			getRoommates();
		}, function () {
			// error callback
			console.error("Error Updating Roommates");
		})

	};

	var deleteRoommate = function (data) {
		console.log(data);
		$http({
			method: 'DELETE',
			url:'http://roommateappmean.herokuapp.com/roommates/' + data,
			data: $httpParamSerializer(data), //string representation of the object
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		}).then(function () {
			// success callback
			console.log("Deleted Roommate");
			getRoommates();
		}, function () {
			// error callback
			console.error("Error Deleting Roommate");
		})

	};


	return {
		getRoommates: getRoommates,//dictionary key: value, value is a function
		createRoommate: createRoommate,
		updateRoommate: updateRoommate,
		deleteRoommate: deleteRoommate
	};

});
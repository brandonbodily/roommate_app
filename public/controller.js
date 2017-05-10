angular.module("RoommateAngular").controller("MainController",function ($scope, RoommateService) {

	$scope.roommates = RoommateService.getRoommates();

	$scope.listItems = [
	{
		"name": "Bread"
	},
	{
		"name": "Milk"
	}
	];

	$scope.mostSpent = 0;
	$scope.showForm = false;
	$scope.addRoommate = function () {
		$scope.showForm = !$scope.showForm;
		console.log($scope.name);
		RoommateService.createRoommate({
			name: $scope.name,
			spent: 0,
			amountInCredit: 0,
			amountInDebt: 0,
			creditors: [],
			debtors: [],
			creditorsList: [],
			debtorsList: [],
			owesHouse: 0,
			percentCreditOwned: 0,
			percentDebtOwned: 0,
			status: ""
		});
		$scope.name = "";
		evaluate();
		update();
		if ($scope.roommates.length > 1) {
			$scope.recalculateButton = true;
		}
	};
	$scope.deleteRoommate = function (roommate) {
		RoommateService.deleteRoommate(roommate._id);
		$scope.recalculateButton = true;
		$scope.showWhoOwesWho = false;
		$scope.currentPerson = "none";
	}

	$scope.isClicked = false;

	$scope.showAddItemForm = false;
	$scope.addItem = function () {
		$scope.showAddItemForm = !$scope.showAddItemForm;
		$scope.listItems.push({name: $scope.item});
		$scope.item = "";
	};

	$scope.buyingMode = false;
	$scope.buyItem = function (item,context) {
		if ($scope.currentPerson == "none") {
			var x = document.getElementById("snackbar")
			x.className = "show";
		    // After 3 seconds, remove the show class from DIV
		    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		} else {
			context.buyingMode = true;
		}
	};

	$scope.itemBought = function (amount, item) {
		for (count= 0; count < roommates.length; count++) {
			if (roommates[count]["name"] == $scope.currentPerson)
			{
				var spent = parseInt(roommates[count]["spent"]);
				spent += amount;
				roommates[count]["spent"] = spent;
			}
		}
		$scope.deleteItem(item);
		evaluate();
		update();
		$scope.showWhoOwesWho = false;
		$scope.currentPerson = "none";
	};

	var update = function () {
		for (count= 0; count < roommates.length; count++){
			RoommateService.updateRoommate({
				id: $scope.roommates[count]["_id"],
				name: $scope.roommates[count]["name"],
				spent: $scope.roommates[count]["spent"],
				amountInCredit: $scope.roommates[count]["amountInCredit"],
				amountInDebt: $scope.roommates[count]["amountInDebt"],
				creditors: $scope.roommates[count]["creditors"],
				debtors: $scope.roommates[count]["debtors"],
				debtorsList: $scope.roommates[count]["debtorsList"],
				creditorsList: $scope.roommates[count]["creditorsList"],
				owesHouse: $scope.roommates[count]["owesHouse"],
				percentCreditOwned: $scope.roommates[count]["percentCreditOwned"],
				percentDebtOwned: $scope.roommates[count]["percentDebtOwned"],
				status: $scope.roommates[count]["status"]
			});
		}
	};

	

	//get debtors or creditors list of person selected
	$scope.showWhoOwesWho = false;
	$scope.whoOwesWhoList;
	$scope.debtor = true;
	$scope.jsonPos;
	$scope.activecss = "display: inline-block;\
	width: 100px; \
	border: 2px solid #FFF;\
	padding: 20px;\
	margin-left: 20px;\
	margin-top: 20px;\
	text-align: left;\
	border-radius: 5px;\
	background: #3cb0fd;\
	background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);\
	background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);\
	background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);\
	background-image: -o-linear-gradient(top, #3cb0fd, #3498db);\
	background-image: linear-gradient(bottom, #3cb0fd, #3498db);\
	text-decoration: none;\
	border: 4px solid #006981;"
	$scope.notActivecss = "display: inline-block;\
	width: 100px; \
	border: 2px solid #FFF;\
	padding: 20px;\
	margin-left: 20px;\
	margin-top: 20px;\
	text-align: left;\
	border-radius: 5px;\
	background: #1d88a1;\
	background-image: -webkit-linear-gradient(top, #3498db, #2980b9);\
	background-image: -moz-linear-gradient(top, #3498db, #2980b9);\
	background-image: -ms-linear-gradient(top, #3498db, #2980b9);\
	background-image: -o-linear-gradient(top, #3498db, #2980b9);\
	background-image: linear-gradient(to bottom, #3498db, #2980b9);"
	$scope.currentPerson = "none";
	$scope.personClicked = function (name) {
		$scope.currentPerson = name;
		if ($scope.recalculateButton != true) {
			$scope.showWhoOwesWho = true;
		}
		roommates = $scope.roommates;
		for (count= 0; count < roommates.length; count++)
		{
			if (roommates[count]["name"] == $scope.currentPerson)
			{	
				$scope.jsonPos = count;
				if (roommates[count]["status"] == "red") {
					$scope.debtor = true;
					var stringList = [];
					for (creditorI in roommates[$scope.jsonPos]['creditorsList']) {
						var person = JSON.parse(roommates[$scope.jsonPos]['creditorsList'][creditorI]);
						var name = person.creditorName;
						var amount = person.amount.toFixed(2);
						var string = name +": $" + amount;
						stringList.push(string);  
					}
					$scope.whoOwesWhoList = stringList;
				}
				if (roommates[count]["status"] == "green") {
					//$scope.whoOwesWhoList = roommates[count]["debtors"];
					$scope.debtor = false;
					var stringList = [];
					for (debtorI in roommates[$scope.jsonPos]['debtorsList']) {
						var person = JSON.parse(roommates[$scope.jsonPos]['debtorsList'][debtorI]);
						var name = person.debtorName;
						var amount = person.amount.toFixed(2);
						var string = name +": $" + amount;
						stringList.push(string);  
					}
					$scope.whoOwesWhoList = stringList;
				}
			} else {
				document.getElementById(roommates[count]["name"]).setAttribute(
					"style", $scope.notActivecss);
			}
		}
		document.getElementById($scope.currentPerson).setAttribute(
			"style", $scope.activecss);
	};

	var getPersonAmountInDebt = function (name) {
		for (c = 0; c < roommates.length; c++) {
			if (roommates[c]["name"] == name) {
				return roommates[c]["amountInDebt"];
			}
		}
	};

	var getPersonAmountInCredit = function (name) {
		for (c = 0; c < roommates.length; c++) {
			if (roommates[c]["name"] == name) {
				return roommates[c]["amountInCredit"];
			}
		}
	};

	$scope.deleteItem = function (item) {
		for (count= 0; count < $scope.listItems.length; count++){
			if ($scope.listItems[count] == item) {
				$scope.listItems.splice(count,1);
			}
		}
		$scope.showWhoOwesWho = false;
		$scope.currentPerson = "none";
	}

	$scope.recalculate = function () {
		evaluate();
		update();
		$scope.recalculateButton = false;
		$scope.showWhoOwesWho = false;
		$scope.currentPerson = "none";
	}

	var evaluate = function() {
		roommates = $scope.roommates;
		for (count= 0; count < roommates.length; count++) {
			roommates[count]["amountInCredit"] = 0;
			roommates[count]["amountInDebt"] = 0;
			roommates[count]["creditors"] = [];
			roommates[count]["debtors"] = [];
			roommates[count]["creditorsList"] = [];
			roommates[count]["debtorsList"] = [];
			roommates[count]["owesHouse"] = 0;
			roommates[count]["percentCreditOwned"] = 0;
			roommates[count]["percentDebtOwned"] = 0;
			roommates[count]["status"] = "";
		}


		var total = 0;
		for (count= 0; count < roommates.length; count++) {
			total += roommates[count]["spent"];
		}

		//each person owes this amount
		var each = total/count;

		console.log("Total: " + total);
		console.log("Each: " + each);

		var mostSpent = 0;
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["spent"] > mostSpent) {
				mostSpent = roommates[count]["spent"];
			}
		}

		for (count = 0; count < roommates.length; count++) {
			roommates[count]["owesHouse"] = mostSpent - roommates[count]["spent"]; 
		}

		//payments to individuals
		//amountInDebt/amountInCredit = each - spent - individualPayments

		// assign green,red,or blue status
		var green = [];
		for (count= 0; count < roommates.length; count++) {
			if (roommates[count]["spent"] > each) {
				roommates[count]["status"] = "green";
				green.push(roommates[count]["name"]);
			} else if (roommates[count]["spent"] < each) {
				roommates[count]["status"] = "red";
			} else if (roommates[count]["spent"] == each) {
				roommates[count]["status"] = "blue";
			} else {
				console.log("ERROR");
			}
		}

		//amountInDebt and amountInCredit calculated
		for (count= 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "green") {
				roommates[count]["amountInCredit"] = roommates[count]["spent"] - each;
				roommates[count]["amountInDebt"] = 0;
			} else if (roommates[count]["status"] == "red") {
				roommates[count]["amountInCredit"] = 0;
				roommates[count]["amountInDebt"] = each - roommates[count]["spent"];
			} else if (roommates[count]["status"] == "blue") {
				roommates[count]["amountInCredit"] = 0;
				roommates[count]["amountInDebt"] = 0;
			} else {
				console.log("ERROR2");
			}
		}


		// add debtors list to creditors
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "green") {
				roommates[count]["debtors"] = [];
				for (count2 = 0; count2 < roommates.length; count2++) {
					if (roommates[count2]["status"] == "red") {
						roommates[count]["debtors"].push(roommates[count2]["name"]);
					}
				}
			} else {
				roommates[count]["debtors"] = [];
			}
		}

		// add creditors list to debtors
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "red") {
				roommates[count]["creditors"] = [];
				for (count2 = 0; count2 < roommates.length; count2++) {
					if (roommates[count2]["status"] == "green") {
						roommates[count]["creditors"].push(roommates[count2]["name"]);
					}
				}
			} else {
				roommates[count]["creditors"] = [];
			}
		}
		
		var totalCredit = 0;
		var totalDebt = 0;
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "green") {
				totalCredit += roommates[count]["amountInCredit"];
			} else if (roommates[count]["status"] == "red") {
				totalDebt += roommates[count]["amountInDebt"];
			}
		}

		//percentCreditOwned, percentDebtOwned
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "green") {
				roommates[count]["percentCreditOwned"] = roommates[count]["amountInCredit"]/totalCredit;
				roommates[count]["percentDebtOwned"] = 0;
			} else if (roommates[count]["status"] == "red") {
				roommates[count]["percentDebtOwned"] = roommates[count]["amountInDebt"]/totalDebt;
				roommates[count]["percentCreditOwned"] = 0;
			} else {
				console.log(roommates[count]["name"] + " owes nothing and is owed nothing");
			}
		}

		//assign who owes who and how much
		for (count = 0; count < roommates.length; count++) {
			if (roommates[count]["status"] == "green") {
				roommates[count]["debtorsList"] = [];
				roommates[count]["creditorsList"] = [];
				//roommates[count]["debtorsList"]["bob"] = $$$
				for (count2 = 0; count2 < roommates[count]["debtors"].length; count2++) {
					var person = {debtorName: roommates[count]["debtors"][count2], amount:roommates[count]["percentCreditOwned"]*getPersonAmountInDebt(roommates[count]["debtors"][count2])};
					roommates[count]["debtorsList"].push(person);
						//[roommates[count]["debtors"][count2]] = roommates[count]["percentCreditOwned"]*getPersonAmountInDebt(roommates[count]["debtors"][count2]);
					}
				}
				if (roommates[count]["status"] == "red") {
					roommates[count]["creditorsList"] = [];
					roommates[count]["debtorsList"] = [];
					for (count2 = 0; count2 < roommates[count]["creditors"].length; count2++) {
						var person = {creditorName: roommates[count]["creditors"][count2], amount: roommates[count]["percentDebtOwned"]*getPersonAmountInCredit(roommates[count]["creditors"][count2])};
						roommates[count]["creditorsList"].push(person);
						//[roommates[count]["creditors"][count2]] = roommates[count]["percentDebtOwned"]*getPersonAmountInCredit(roommates[count]["creditors"][count2]);
					}
				}
				if (roommates[count]["status"] == "blue") {
					roommates[count]["debtorsList"] = [];
					roommates[count]["creditorsList"] = [];
				}

			}		
		};

		evaluate();


	});

//<div ng-show="showMyDiv"></div>
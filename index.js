var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var express = require('express');
var path = require('path');
var model = require("./model.js");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");


var app = express();

app.set('port', (process.env.PORT || 8080));

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Passport
passport.use(new LocalStrategy({
	usernameField: 'houseName'
}, function(houseName, password, done) {
	model.User.findOne({ houseName: houseName }, function (err, user) {
		if (err) { 
			return done(err); 
		}
		if (!user) {
			return done(null, false);
		}
		user.validPassword(password, function (valid) {
			if (valid) {
				return done(null, user);
			}
			return done(null, false);
		});
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	model.User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.post("/session", passport.authenticate('local'), function (req, res) {
	//authentication successful! run this code
	res.status(201);
	res.send(req.user);
});

app.get("/me", function (req, res) {
	if (req.user) {
		res.json(req.user);
	} else {
		res.sendStatus(401);
	}
});

app.get("/users", function (req, res) {
	if (req.user) {
		res.setHeader("Access-Control-Allow-Origin","*");	
		res.status(200);
		model.User.find(function(err, user) {	
		res.json(user);
	});
	} else {
		res.sendStatus(401);
	}
});

app.post("/users", function (req, res) {
	//THE_DATA.push(req.body);
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			res.status(500);
			console.log("Error creating hash");
			res.send(err);
		} else {
			model.User.findOne({'houseName': req.body.houseName}, function(err, user) {
				if (err) {
					res.status(500);
					res.setHeader("Access-Control-Allow-Origin","*");
					console.log("Error finding User");
					res.send(err);
				} else if (user) {
					res.status(422);
					res.setHeader("Access-Control-Allow-Origin","*");
					console.log("User already exists");
					res.send(err);
				} else {
					var newUser = new model.User({
						email: req.body.email,
						houseName: req.body.houseName,
						encryptedPassword: hash
					});
					newUser.save(function (err) {
						if (err) {
							if (err.name == 'ValidationError') {
								res.status(422);
								res.setHeader("Access-Control-Allow-Origin","*");
								res.send(err);
							} else {
								res.status(500);
								res.setHeader("Access-Control-Allow-Origin","*");
								res.send(err);
							}
						} else {
							res.status(201);
							console.log("User Created");
							res.setHeader("Access-Control-Allow-Origin","*");
							res.send("");
						}
					})

				}
			});	
		}	
	});
});

//list roommates
app.get("/roommates", function (req, res) {
	if (req.user) {
		res.setHeader("Access-Control-Allow-Origin","*");	
		res.status(200);
		model.Roommate.find(function(err, roommate) {	
		res.json(roommate);
	});
	} else {
		res.sendStatus(401);
	}
		//res.send(THE_DATA);
	//res.json([]); //return actual data from Roommate model
});

//create roommate
app.post("/roommates", function (req, res) {
	//THE_DATA.push(req.body);
	var roommate = new model.Roommate({
		name: req.body.name,
		spent: req.body.spent,
		amountInCredit: req.body.amountInCredit,
		amountInDebt: req.body.amountInDebt,
		creditors: req.body.creditors,
		debtors: req.body.debtors,
		debtorsList: req.body.debtorsList,
		creditorsList: req.body.creditorsList,
		owesHouse: req.body.owesHouse,
		percentCreditOwned: req.body.percentCreditOwned,
		percentDebtOwned: req.body.percentDebtOwned,
		status: req.body.status
	});
	roommate.save(function (err) {
		if (err) {
			if (err.name == 'ValidationError') {
				res.status(422);
				res.setHeader("Access-Control-Allow-Origin","*");
				res.send(err);
			} else {
				res.status(500);
				res.setHeader("Access-Control-Allow-Origin","*");
				res.send(err);
			}
		} else {
			res.status(201);
			console.log("Roommate Created");
			res.setHeader("Access-Control-Allow-Origin","*");
			res.send("");
		}
	})
});

app.put("/roommates/:roommate_id", function (req, res) {
	model.Roommate.findById(req.params.roommate_id, function(err, roommate) {
            if (err) {
                res.send(err);
            } else {

	            roommate.name = req.body.name;
		   		roommate.spent = req.body.spent;
				roommate.amountInCredit = req.body.amountInCredit;
				roommate.amountInDebt = req.body.amountInDebt;
				roommate.creditors = req.body.creditors;
				roommate.debtors = req.body.debtors;
				roommate.debtorsList = req.body.debtorsList;
				roommate.creditorsList = req.body.creditorsList;
				roommate.owesHouse = req.body.owesHouse;
				roommate.percentCreditOwned = req.body.percentCreditOwned;
				roommate.percentDebtOwned = req.body.percentDebtOwned;
				roommate.status = req.body.status;

			}	
            roommate.save(function(err) {
                if (err)
                {
                    if (err.name == 'ValidationError') {
						res.status(422);
						res.setHeader("Access-Control-Allow-Origin","*");
						res.send(err);
					} else {
						res.status(500);
						res.setHeader("Access-Control-Allow-Origin","*");
						res.send(err);
					}
                } else {
	                res.status(204);
	                console.log("Roommate Updated");
	                res.send("");  
                }           
            });
        });
});

app.delete("/roommates/:roommate_id", function (req, res) {
	model.Roommate.findByIdAndRemove(req.params.roommate_id, function (err) {
		if (err)
		{throw err;}

		res.status(204);
		console.log('Roommate deleted');
		res.send("");
	});
});

app.use(function (req, res) {
  res.status(404).send("404 Not Found");
});

app.listen(app.get('port'), function () {
  console.log('Server running on port ',app.get('port'));
});
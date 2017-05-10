var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


mongoose.connect('mongodb://mongodb.cs.dixie.edu/brandonbodily');
//mongodb://roommateapp:roommateapp@ds121190.mlab.com:21190/roommateapp

var Roommate = mongoose.model('Roommate', {
	name: {
        type: String,
        required: true
      },
	spent: {
        type: Number,
        required: true
      },
	amountInCredit: {
        type: Number,
        required: true
      },
	amountInDebt: {
        type: Number,
        required: true
      },
	creditors: [],
	debtors: [],
	debtorsList: [],
  	creditorsList: [],
	owesHouse: {
        type: Number,
        required: true
      },
	percentCreditOwned: {
        type: Number,
        required: true
      },
	percentDebtOwned: {
        type: Number,
        required: true
      },
	status: String
});

var userSchema = new mongoose.Schema({
  email: String,
  houseName: String,
  encryptedPassword: String
});

userSchema.methods.validPassword = function (password, callback) {
  bcrypt.compare(password, this.encryptedPassword, function (err, valid) {
    callback(valid);
  });
};

var User = mongoose.model("User", userSchema);


module.exports = {
	Roommate: Roommate,
	User: User
};

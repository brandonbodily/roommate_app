| Resources  | Attributes |
| ------------- | ------------- |
| roommates  | name, spent, amountInCredit, amountInDebt, creditors, debtors, debtorsList, creditorsList, owesHouse, percentCreditOwned, percentDebtOwned, status  |
______________________________________________________________

Mongoose Model

var Roommate = mongoose.model('Roommate', {  
	name: String,  
	spent: Number,  
	amountInCredit: Number,  
	amountInDebt: Number,  
	creditors: [],  
	debtors: [],  
	debtorsList: [],  
  	creditorsList: [],  
	owesHouse: Number,  
	percentCreditOwned: Number,  
	percentDebtOwned: Number,  
	status: String  
});
______________________________________________________________

|HTTP methods | PATH |
|-------------|-------------------------------------------|
|GET          | Retrieve: /roommates |
|POST         | Create: /roommates |
|PUT          | Update: /roommates/id |
|DELETE       | Delete: /roommates/id |


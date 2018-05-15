var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	password: '',
	database: 'bamazon_DB'
});

runApp();

function runApp() {
	console.log(`
	######                                            ### 
	#     #   ##   #    #   ##   ######  ####  #    # ### 
	#     #  #  #  ##  ##  #  #      #  #    # ##   # ### 
	######  #    # # ## # #    #    #   #    # # #  #  #  
	#     # ###### #    # ######   #    #    # #  # #     
	#     # #    # #    # #    #  #     #    # #   ## ### 
	######  #    # #    # #    # ######  ####  #    # ### 
														  
   `)
    listInventory();
}

function userPurchae(){

	inquirer.prompt([
		{
			message: "Enter the Item ID for the item you would like to purchase",
			name: "item_id"
		},
		{
			message: "How many would you like to purchase?",
			name: "amount"
		}
	]).then(function(user){
		var item = user.item_id;
		var amount = user.amount;
		
		connection.query("SELECT * FROM inventory WHERE ?", {item_id: item}, function(err,data){
			if(err) throw err;

			if (data.length === 0) {
				console.log("INVALID ITEM ID");
			}
			else {
				var productInfo = data[0];

				if (amount <= productInfo.stock_quantity) {
					console.log("Product available. Placing you order...");
					
					var updateQuery = "UPDATE inventory SET stock_quantity = " + (productInfo.stock_quantity - amount) + " WHERE item_id = " + item;

					connection.query(updateQuery, function(err,data){
						if(err) throw err;

						console.log("Order confirmed. Total Cost: $" + productInfo.price * amount);
						console.log("Thank you for your business!");
						console.log("\n----------------------------------------------------------------------");
						connection.end();
					})
				}
				else{
					console.log("Sorry, not enough of the item is in stock.");
					console.log("Please change your order");
					console.log("\n----------------------------------------------------------------------");

					listInventory();
				}
			}
		})
	})
}

function listInventory() {
	connection.query("SELECT * FROM inventory", function(err,data){
		if(err) throw err;
		
		for(var i = 0; i < data.length; i++) {
			console.log("\nItem ID: " + data[i].item_id + "  ||  " + 
			"Product: " + data[i].product_name + "  ||  " +
			"Department: " + data[i].department_name + "  ||  " +
			"Price: $" + data[i].price + "  ||  " +
			"In Stock: " + data[i].stock_quantity + "\n");
		}
		console.log("\n----------------------------------------------------------------------");

		userPurchae();
	})
}

var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	password: 'jock14',
	database: 'bamazon_DB'
});

function runApp() {
    listInventory();
}
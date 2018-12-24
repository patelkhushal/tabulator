//define some sample data
var tabledata = [
	{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
	{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
	{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
	{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
	{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
];


//Build Tabulator
//ajaxURL:"file:///Users/patelkhushal@ibm.com/webapp/index.html", //ajax URL
var table = new Tabulator("#example-table", {
	data:tabledata,
	layout:"fitDataFill",
    columns:[
		{title:"Name", field:"name", editor:"input", width:350},
		{title:"Age", field:"age", editor:"input", width:350},
		{title:"Fav Color", field:"col", editor:"input", width:250},
		{title:"DOB", field:"dob", editor:"input", width:200},
	],
	dataEdited: myFunction(data, this)
});


function myFunction(table_json, table_obj) {
	this.setData(data);
  }
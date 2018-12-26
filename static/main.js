//define some sample data
var tabledata = [
	{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
	{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
	{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
	{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
	{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
];



//Build Tabulator
var table = new Tabulator("#example-table", {
	data:tabledata,
	layout: "fitDataFill",
	history:true,
    selectable:true, //make rows selectable
    columns:[
	    {title:"Name", field:"name", width:200},
	    {title:"Progress", field:"progress", width:100, align:"right", sorter:"number"},
	    {title:"Gender", field:"gender", width:100},
	    {title:"Rating", field:"rating", align:"center", width:80},
	    {title:"Favourite Color", field:"col"},
	    {title:"Date Of Birth", field:"dob", align:"center", sorter:"date"},
	    {title:"Driver", field:"car", align:"center", width:100},
    ],
    
});

// //select row on "select" button click
// $("#select-row").click(function(){
//     table.selectRow(1);
// });

// //deselect row on "deselect" button click
// $("#deselect-row").click(function(){
//     table.deselectRow(1);
// });

// //select row on "select all" button click
// $("#select-all").click(function(){
//     table.selectRow();
// });

// //deselect row on "deselect all" button click
// $("#deselect-all").click(function(){
//     table.deselectRow();
// });
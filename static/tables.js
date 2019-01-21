var currColComp;
var currRowComp;

var table = new Tabulator("#example-table", {
    data: jsondata,
    //[{"Age": "12", "DOB": "14/05/1982", "Fav Color": "red", "Name": "Oli Bob", "id": 1}, {"Age": "1", "DOB": "14/05/1982", "Fav Color": "blue", "Name": "Mary May", "id": 2}, {"Age": "42", "DOB": "22/05/1982", "Fav Color": "green", "Name": "Christine Lobowski", "id": 3}, {"Age": "21", "DOB": "------", "Fav Color": "orange", "Name": "Kp", "id": 4}, {"Age": "12", "DOB": "01/08/1980", "Fav Color": "orange", "Name": "Brendon Philips", "id": 5}, {"Age": "16", "DOB": "31/01/1999", "Fav Color": "yellow", "Name": "Margret Marmajuke", "id": 6}]
    layout: "fitColumns",
    columns: coldata,
    //[{"editableTitle": true, "field": "id", "title": "id"}, {"editableTitle": true, "editor": "input", "field": "Name", "title": "Name"}, {"editableTitle": true, "editor": "input", "field": "Age", "title": "Age"}, {"editableTitle": true, "editor": "input", "field": "Fav Color", "title": "Fav Color"}, {"editableTitle": true, "editor": "input", "field": "DOB", "title": "DOB"}]
});


var editButton= $('<input type="button" id="edit-table" value="Edit Table"/>');
$("#example-table").append(editButton);

var deleteButton = $('<input type="button" id="delete-table" value="Delete Table"/>');
$("#example-table").append(deleteButton);

var addButton = $('<input type="button" id="add-table" value="Add Table"/>');
$("#example-table").append(addButton);


$("#edit-table").on("click", function () {
    window.location.href=editUrl;
});

$("#delete-table").on("click", function () {
    if (confirm('Are you sure you want to delete this table?')) {
        table.destroy();
    }
});

$("#add-table").on("click", function () {
    
});


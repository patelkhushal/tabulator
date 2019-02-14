// var once = true; //used to ignore render complete function in tabulator object 

$("<h5>", { id: "table-title" }).text(tableTitle).appendTo("#table-holder") //table title header
$("<div>", { id: tableTitleId, style: "height: 550px; width: 90%" }).appendTo("#table-holder"); //table object div
$("<div>", { class: "buttons", style: "width: 90%" }).appendTo("#table-holder"); //buttons div

//tabulator table object
var table = new Tabulator("#" + tableTitleId, {
    data: jsondata, //json data supplied by flask app
    layout: "fitColumns",
    columns: coldata, //column definition json data supplied by flask app
    renderComplete: function () { //runs everytime table view gets updated
        try { animateRowCount(getRowCount(), "row-count-number");  } //update row counter 
        catch (err) {} //don't do anything
    },
});

//animates from 0 to a number passed to it and adds it to the id passed
function animateRowCount(animateNum, id) {
    $({ Counter: 0 }).animate({
        Counter: animateNum
    }, {
            duration: 300,
            easing: 'swing',
            step: function () {
                $("#" + id).html(Math.ceil(this.Counter));
            }
        });
}

//returns row count of the current view table
function getRowCount() {
    if (emptyHeaderFilters()) { return table.getRows().length; }
    else { return table.getRows(true).length; }
}

//returns true if any column header filter is applied, false otherwise.
function emptyHeaderFilters() {
    if (table.getHeaderFilters().length == 0) { return true; }
    else { return false; }
}

//div to hold all the buttons
$("<div>", { class: "btn-group" }).appendTo(".buttons");

//edit, add, delete and download buttons
$('<input type="button" id="edit-table" value="Edit Table" class="btn btn-primary"/>').appendTo(".btn-group");
$('<input type="button" id="delete-table" value="Delete Table" class="btn btn-primary"/>').appendTo(".btn-group");
$('<input type="button" id="add-table" value="Add Table" class="btn btn-primary"/>').appendTo(".btn-group");
$('<input type="button" id="download-table" value="Download csv" class="btn btn-primary"/>').appendTo(".btn-group");

//row counter card
$("<div>", { class: "border border-success float-md-right card", id: "row-count" }).appendTo(".buttons").text("Total Rows");
$("<span>", { id: "row-count-number", class: "card" }).appendTo("#row-count").text(getRowCount());

//edit table button on click
$("#edit-table").on("click", function () {
    var json_array = { 'rowdata': jsondata, 'coldata': coldata, 'rowpath': rowPath, 'colpath': colPath, 'tableTitleJson': tableTitleJson, 'titlepath':titlePath };
    editUrl = editUrl.replace("somevar", JSON.stringify(json_array)); //send json_array variable to flask
    window.location.href = editUrl;
});

//delete table button on click
$("#delete-table").on("click", function () {
    if (confirm('Are you sure you want to delete this table?')) {
        table.destroy();
    }
});

//add table button on click
$("#add-table").on("click", function () {

});

//download table button on click
$("#download-table").on("click", function () {
    table.download("csv", "data.csv"); //download table data as a CSV formatted file with a file name of data.csv
});


function ajaxPostToFlask(flaskUrl, dataToPost) {
    $.ajax({
        type: "POST",
        url: flaskUrl,
        data: JSON.stringify(dataToPost),
        success: function (data) {
        }
    });
}

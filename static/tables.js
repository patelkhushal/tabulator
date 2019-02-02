var currColComp;
var currRowComp;
var once = true;


var table = new Tabulator("#example-table", {
    data: jsondata,
    //Example: [{"Age": "12", "DOB": "14/05/1982", "Fav Color": "red", "Name": "Oli Bob", "id": 1}, {"Age": "1", "DOB": "14/05/1982", "Fav Color": "blue", "Name": "Mary May", "id": 2}, {"Age": "42", "DOB": "22/05/1982", "Fav Color": "green", "Name": "Christine Lobowski", "id": 3}, {"Age": "21", "DOB": "------", "Fav Color": "orange", "Name": "Kp", "id": 4}, {"Age": "12", "DOB": "01/08/1980", "Fav Color": "orange", "Name": "Brendon Philips", "id": 5}, {"Age": "16", "DOB": "31/01/1999", "Fav Color": "yellow", "Name": "Margret Marmajuke", "id": 6}]
    layout: "fitColumns",
    columns: coldata,
    //Example: [{"editableTitle": true, "field": "id", "title": "id"}, {"editableTitle": true, "editor": "input", "field": "Name", "title": "Name"}, {"editableTitle": true, "editor": "input", "field": "Age", "title": "Age"}, {"editableTitle": true, "editor": "input", "field": "Fav Color", "title": "Fav Color"}, {"editableTitle": true, "editor": "input", "field": "DOB", "title": "DOB"}]
    renderComplete: function () {
        if (once) { once = false; }
        else { animateRowCount(); }
    },
});

function animateRowCount(){
    $({ Counter: 0 }).animate({
        Counter: getRowCount()
    }, {
            duration: 300,
            easing: 'swing',
            step: function () {
                $('#row-count-number').html(Math.ceil(this.Counter));
            }
        });
}

function getRowCount() {
    if (emptyHeaderFilters()) { return table.getRows().length; }
    else { return table.getRows(true).length; }
}

// function filteredIds() {
//     var tableRows;
//     if (emptyHeaderFilters()) { tableRows = table.getRows();}
//     else { tableRows = table.getRows(true);}

//     for (var i = 0; i < tableRows.length; i++) {
//         tableRows[i].update({ "id": (i + 1) }); //update the row data for field "id"
//     }
// }

function emptyHeaderFilters() {
    if (table.getHeaderFilters().length == 0) {
        return true;
    }
    else { return false; }
}

$("#table-title").html(tableTitle);

$("<div>", { class: "btn-group"}).appendTo(".buttons");

$('<input type="button" id="edit-table" value="Edit Table" class="btn btn-primary"/>').appendTo(".btn-group");

$('<input type="button" id="delete-table" value="Delete Table" class="btn btn-primary"/>').appendTo(".btn-group");

$('<input type="button" id="add-table" value="Add Table" class="btn btn-primary"/>').appendTo(".btn-group");

$('<input type="button" id="download-table" value="Download csv" class="btn btn-primary"/>').appendTo(".btn-group");

$("<div>", {class: "border border-success float-md-right card", id: "row-count"}).appendTo(".buttons").text("Total Rows");
$("<span>", { id: "row-count-number", class:"card" }).appendTo("#row-count").text(getRowCount());


$("#edit-table").on("click", function () {
    window.location.href = editUrl;
});

$("#delete-table").on("click", function () {
    if (confirm('Are you sure you want to delete this table?')) {
        table.destroy();
    }
});

$("#add-table").on("click", function () {

});

$("#download-table").on("click", function () {
    table.download("csv", "data.csv"); //download table data as a CSV formatted file with a file name of data.csv
});


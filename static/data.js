var currColComp; //current column (determined by the position of the cursor). Used in cellEditing attribute of tabulator object
var currRowComp; //current row (determined by the position of the cursor). Used in cellEditing attribute of tabulator objec
var once = true;

//process incoming jsondata and coldata. i.e., make them editable by changing column definition
editableColData(coldata);

//tabulator table object
var table = new Tabulator("#example-table", {
    data: jsondata,
    layout: "fitColumns",
    movableColumns: true,
    movableRows: true,
    scrollToRowIfVisible: false,
    //scrollToRowPosition: "top",
    history: true,
    columns: coldata,
    cellEditing: function (cell) {
        //cell - cell component
        currColComp = cell.getColumn();
        currRowComp = cell.getRow();
    },
    columnTitleChanged: function (column) {
        //column - column component
        column.getDefinition()["title"] = $.trim(column.getDefinition()["title"]); //trim trailing whitespaces
        if (!columnCheck()) { return; }
        changeRowData(column); //update field values for the column
    },
    rowClick: function (e, row) {
        //e - the click event object
        //row - row component
        if ($('#selectable').is(":checked")) { //only allow row select if row select checkbox is checked
            row.toggleSelect(); //toggle row selected state on row click
        }
    },
    renderComplete: function () {
        if (once) { once = false; } //ignore the first time function is entered. Need this because tabulator runs this function before data is loaded into the table
        else { animateRowCount(); } //update the "Totol Rows" of the table
    },

});

$(".table-title").html(tableTitle);
$('#table-title').val(tableTitle);


$("<div>", { class: "btn-group"}).appendTo(".buttons");

$("<div>", { class: "btn-group-vertical", id:"col1"}).appendTo(".btn-group");
$('<input type="button" id="post-data" value="Submit" class="btn btn-primary btn-sm"/>').appendTo("#col1");
$('<input type="button" id="reset-data" value="Reset" class="btn btn-primary btn-sm"/>').appendTo("#col1");

$("<div>", { class: "btn-group-vertical", id:"col2"}).appendTo(".btn-group");
$('<input type="button" id="add-row-above" value="Add Row Above" class="btn btn-primary btn-sm"/>').appendTo("#col2");
$('<input type="button" id="add-row-below" value="Add Row Below" class="btn btn-primary btn-sm"/>').appendTo("#col2");

$("<div>", { class: "btn-group-vertical", id:"col3"}).appendTo(".btn-group");
$('<input type="button" id="add-column-left" value="Add Column Left" class="btn btn-primary btn-sm"/>').appendTo("#col3");
$('<input type="button" id="add-column-right" value="Add Column Right" class="btn btn-primary btn-sm"/>').appendTo("#col3");

$("<div>", { class: "btn-group-vertical", id:"col4"}).appendTo(".btn-group");
$('<input type="button" id="delete-row" value="Delete Row(s)" class="btn btn-primary btn-sm"/>').appendTo("#col4");
$('<input type="button" id="delete-column" value="Delete Column" class="btn btn-primary btn-sm"/>').appendTo("#col4");

$("<div>", { class: "btn-group-vertical", id:"col5"}).appendTo(".btn-group");
$('<input type="button" id="select-all" value="Select All" class="btn btn-primary btn-sm"/>').appendTo("#col5");
$('<input type="button" id="deselect-all" value="Deselect All" class="btn btn-primary btn-sm"/>').appendTo("#col5");

$("<div>", {class: "float-md-right card", id: "row-count"}).appendTo(".buttons").text("Total Rows");
$("<span>", { id: "row-count-number", class:"card" }).appendTo("#row-count").text(getRowCount());

$("<div>", { class: "checkbox float-md-left card", id:"select-row-checkbox"}).appendTo(".buttons");
$('<label id="selectable-label"><input id="selectable" type="checkbox">Selectable Rows</label>').appendTo('#select-row-checkbox');


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

function emptyHeaderFilters() {
    if (table.getHeaderFilters().length == 0) {
        return true;
    }
    else { return false; }
}

function changeRowData(columnComp) {
    var oldTitle = columnComp.getDefinition()["field"];
    rowData = table.getData();
    columnComp._column.setField(columnComp.getDefinition()["title"]); //update the field. Here (field = title)
    columnComp.getDefinition()["field"] = columnComp.getDefinition()["title"]; //update field value
    for (i = 0; i < rowData.length; i++) {
        var val = rowData[i][oldTitle];
        if (val) {
            delete rowData[i][oldTitle]; //delete old title key
            rowData[i][columnComp.getDefinition()["title"]] = val; //update new title with the value of the older key (title)
        }
        else {
            rowData[i][columnComp.getDefinition()["title"]] = ""; //if no data was present, assign it to a empty string
        }
    }
    table.setData(rowData); //set the new row data
}

//submit button
$("#post-data").on("click", function () {
    if (!columnCheck()) { return; }
    else if($.trim($('#table-title').val()) == ""){
        alert("Table title cannot be empty!")
        return;
    }
    formatIds(); //properly format row ids before sending the data to flask app
    uneditableColData(table.getColumnDefinitions()); //make col defintion uneditable befor submitting

    tableTitleJson["title"] = $('#table-title').val();

    // var json_array = {'rowdata':table.getData(), 'coldata':table.getColumnDefinitions(), 'rowpath':rowPath, 'colpath':colPath, 'tableTitleJson': tableTitleJson};
    // ajaxPostToFlask("/submitRequest", json_array)
    var json_array = { 'rowdata': table.getData(), 'coldata': table.getColumnDefinitions(), 'rowpath': rowPath, 'colpath': colPath, 'tableTitleJson': tableTitleJson, 'titlepath':titlePath };
    // ajaxPostToFlask("/changeTableColumnNames", table.getColumnDefinitions()); //send changed column names to flask app
    // ajaxPostToFlask("/changeTableContent", table.getData()); //send changed table content to flask app
    // ajaxPostToFlask("/changeTableTitle", tableTitleJson);
    ajaxPostToFlask("/submitRequest", json_array)
    window.location.href = afterEditUrl; //go back to the previous view after editing the data
});

//sends ajax post request to flaskUrl with dataToPost
function ajaxPostToFlask(flaskUrl, dataToPost) {
    $.ajax({
        type: "POST",
        url: flaskUrl,
        data: JSON.stringify(dataToPost),
        success: function (data) {
        }
    });
}

//fix ids of the row. In case of addition or deletion of a row
function formatIds() {
    var tableData = table.getData();
    for (var i = 0; i < tableData.length; i++) {
        tableData[i]["id"] = (i + 1);
    }
    table.setData(tableData);
}

function columnCheck() {
    var colDef = table.getColumnDefinitions();
    var counts = [];
    for (i = 0; i < colDef.length; i++) {
        if ($.trim(colDef[i]["title"]) === "") {
            alert("Column name(s) cannot be empty!");
            return false;
        }
        if (counts[colDef[i]["title"]] === undefined) {
            counts[colDef[i]["title"]] = 1;
        }
        else {
            alert("Column names should be unique!")
            return false;
        }
    }
    return true;
}

//reset button
$("#reset-data").on("click", function () {
    window.location.reload();
});

//select all button
$("#select-all").on("click", function () {
    if ($('#selectable').is(":checked")) { //only allow row selection if row select checkbox is checked
        table.selectRow();
    }

});

//Deselect all button
$("#deselect-all").on("click", function () {
    table.deselectRow();
});

// //undo button
// $("#history-undo").on("click", function () {
//     table.undo();
// });

// //redo button
// $("#history-redo").on("click", function () {
//     table.redo();
// });

//add row above button
$("#add-row-above").on("click", function () {
    addRow(true); //true adds row above the selected row
});

//add row below button
$("#add-row-below").on("click", function () {
    addRow(false); //false adds row below the selected row
});

function addRow(above) {
    clearHeaderFilters(); //clear header filters before adding the row
    var id = 0;
    if (currRowComp) { id = currRowComp.getIndex(); }
    else {
        rowdata = table.getSelectedData();
        if (rowdata.length == 0) { id = 0; } //no selected row
        else {
            id = rowdata[rowdata.length - 1]["id"]; //last selected row
        }
    }
    table.addRow({ id: ""}, above, id).then(function (row) {
        //row - the row component for the row updated or added
        //console.log(table.getRows());
        //console.log(table.getData());
        //var tmprowComp = table.getRow(table.getRows.length - 1);
        formatIds(); //give proper id to the new row
        //after formatIds(), id = id of the new row
        //scroll to the newly added row
        if(id == 0 && above){
            table.scrollToRow(1);
        }
        else if(id == 0 && !above){
            table.scrollToRow(table.getRows().length)
        }
        else{
            table.scrollToRow(id);
        }
    })

}

function clearHeaderFilters(){
    for(var i=0; i < table.getColumnDefinitions().length; i++){
        table.setHeaderFilterValue(table.getColumnDefinitions()[i]["title"], ""); //set header filter for a column to  ""
    }
}

//delete row(s) button
$("#delete-row").on("click", function () {
    var rowdata = table.getSelectedData();
    if (rowdata.length == 0 && currRowComp) {
        table.deleteRow(currRowComp);
    }
    else {
        for (i = 0; i < rowdata.length; i++) {
            rowid = rowdata[i]["id"];
            table.deleteRow(rowid);
        }
    }
    formatIds();
});

//add column to the left of the current column button
$("#add-column-left").on("click", function () {
    addColumn(true); //true adds column to the left of the current column
});

//add column to the right of the current column button
$("#add-column-right").on("click", function () {
    addColumn(false); // false adds column to the right of the current column
});

function addColumn(left) {
    if (!columnCheck()) { return }
    if (currColComp) {
        table.addColumn({ "editableTitle": true, "editor": "textarea", "formatter": "textarea", "headerFilter": true, "headerFilterPlaceholder": "Search...", "field": " ", "title": " " }, left, currColComp);
    }
}

//delete current column button
$("#delete-column").on("click", function () {
    if (currColComp) {
        table.deleteColumn(currColComp);
    }
    rowData = table.getData();
    deletedColName = currColComp.getDefinition()["title"]
    for (i = 0; i < rowData.length; i++) { //remove the deleted column info from row data
        delete rowData[i][deletedColName];
    }
    table.setData(rowData);
});

$('#selectable').change(function () {
    if (!$(this).is(":checked")) {
        table.deselectRow();
    }
});

function editableColData(colDefinition) {
    for (i = 0; i < colDefinition.length; i++) {
        if (colDefinition[i]["field"] !== "id") { //leave id field uneditable
            colDefinition[i]["editableTitle"] = true;
            colDefinition[i]["editor"] = "textarea";
        }
    }
}

function uneditableColData(colDefinition) {
    for (i = 0; i < colDefinition.length; i++) {
        if (colDefinition[i]["field"] !== "id") { //leave id field unchanged
            delete colDefinition[i]["editableTitle"];
            delete colDefinition[i]["editor"];
            // console.log(colDefinition[i]);
        }
    }
}

// function filterFunc() {
//     var filteredRows = table.getRows(true);
//     // console.log(table.getRows(true));
//     for (var i = 0; i < filteredRows.length; i++) {
//         filteredRows[i].update({ "id": (i + 1) }); //update the row data for field "id"
//     }
// }

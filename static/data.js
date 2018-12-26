var currColComp;
var currRowComp;
var colAddCounter = 0; //track number of columns user added during a session. This helps setting up field values for new columns

var table = new Tabulator("#example-table", {
    data: jsondata,
    layout: "fitColumns",
    selectable: true,
    history: true,
    columns: coldata,
    //[{"editableTitle": true, "field": "id", "title": "id"}, {"editableTitle": true, "editor": "input", "field": "name", "title": "Name"}, {"editableTitle": true, "editor": "input", "field": "age", "title": "Age"}, {"editableTitle": true, "editor": "input", "field": "col", "title": "Fav Color"}, {"editableTitle": true, "editor": "input", "field": "dob", "title": "DOB"}],
    cellEditing: function (cell) {
        //cell - cell component
        currColComp = cell.getColumn();
        currRowComp = cell.getRow();
    },
    columnTitleChanged:function(column){
        //column - column component
        column.getDefinition()["field"] = column.getDefinition()["title"]; // set field value to the new title
        },
});

//submit button
$("#post-data").on("click", function () {
    formatIds(); //properly format row ids before sending the data to flask app
    ajaxPostToFlask("/changeTableColumnNames", table.getColumnDefinitions()) //send changed column names to flask app
    ajaxPostToFlask("/changeTableContent", table.getData()) //send changed table content to flask app
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

//reset button
$("#reset-data").on("click", function () {
    window.location.reload();
});

//select all button
$("#select-all").on("click", function () {
    table.selectRow();
});

//Deselect all button
$("#deselect-all").on("click", function () {
    table.deselectRow();
});

//undo button
$("#history-undo").on("click", function () {
    table.undo();
});

//redo button
$("#history-redo").on("click", function () {
    table.redo();
});

//add row above button
$("#add-row-above").on("click", function () {
    addRow(true); //true adds row above the selected row
});

//add row below button
$("#add-row-below").on("click", function () {
    addRow(false); //false adds row below the selected row

});

function addRow(above) {
    var rowdata = table.getSelectedData();
    if (rowdata.length == 0) { // if user has no row selected
        console.log(currRowComp.getIndex());
        table.addRow({ id: "" }, above, currRowComp.getIndex());
    }
    else {
        rowid = rowdata[rowdata.length - 1]["id"];
        table.addRow({ id: "" }, above, rowid);

    }
}

//delete row below button
$("#delete-row").on("click", function () {
    var rowdata = table.getSelectedData();
    if (rowdata.length == 0) {
        table.deleteRow(currRowComp);
    }
    else {
        for (i = 0; i < rowdata.length; i++) {
            rowid = rowdata[i]["id"];
            table.deleteRow(rowid);
        }
    }

});

//add column to the left of the current column button
$("#add-column-left").on("click", function () {
    addColumn(true); //true adds column to the left of the current column
});

//add column to the right of the current column button
$("#add-column-right").on("click", function () {
    addColumn(false); // false adds column to the right of the current column
});

function addColumn(left){
    if (currColComp) {
        var colName = "new_column_" + (colAddCounter + 1).toString();
        console.log(colName);
        table.addColumn({ "editableTitle": true, "editor": "input", "field": colName, "title": colName}, left, currColComp);
        colAddCounter++;
    }
}

//delete current column button
$("#delete-column").on("click", function () {
    if (currColComp) {
        table.deleteColumn(currColComp);
    }
});

//fix ids of the row. In case of addition or deletion of a row
function formatIds() {
    var tableData = table.getData();
    for (i = 0; i < tableData.length; i++) {
        tableData[i]["id"] = (i + 1);
    }
    table.setData(tableData);
}
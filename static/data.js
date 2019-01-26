var currColComp; //current column (determined by the position of the cursor). Used in cellEditing attribute of tabulator object
var currRowComp; //current row (determined by the position of the cursor). Used in cellEditing attribute of tabulator objec

//process incoming jsondata and coldata. i.e., make them editable by changing column definition
editableColData(coldata);

var table = new Tabulator("#example-table", {
    data: jsondata,
    //Example: [{"Age": "12", "DOB": "14/05/1982", "Fav Color": "red", "Name": "Oli Bob", "id": 1}, {"Age": "1", "DOB": "14/05/1982", "Fav Color": "blue", "Name": "Mary May", "id": 2}, {"Age": "42", "DOB": "22/05/1982", "Fav Color": "green", "Name": "Christine Lobowski", "id": 3}, {"Age": "21", "DOB": "------", "Fav Color": "orange", "Name": "Kp", "id": 4}, {"Age": "12", "DOB": "01/08/1980", "Fav Color": "orange", "Name": "Brendon Philips", "id": 5}, {"Age": "16", "DOB": "31/01/1999", "Fav Color": "yellow", "Name": "Margret Marmajuke", "id": 6}]
    layout: "fitColumns",
    history: true,
    columns: coldata,
    //Example: [{"editableTitle": true, "field": "id", "title": "id"}, {"editableTitle": true, "editor": "input", "field": "Name", "title": "Name"}, {"editableTitle": true, "editor": "input", "field": "Age", "title": "Age"}, {"editableTitle": true, "editor": "input", "field": "Fav Color", "title": "Fav Color"}, {"editableTitle": true, "editor": "input", "field": "DOB", "title": "DOB"}]
    cellEditing: function (cell) {
        //cell - cell component
        currColComp = cell.getColumn();
        currRowComp = cell.getRow();
    },
    columnTitleChanged: function (column) {
        //column - column component
        column.getDefinition()["title"] = $.trim(column.getDefinition()["title"]); //trim trailing whitespaces
        if(!columnCheck()){return;}
        changeRowData(column); //update field values for the column
    },
    rowClick: function (e, row) {
        //e - the click event object
        //row - row component
        if ($('#selectable').is(":checked")) { //only allow row select if row select checkbox is checked
            row.toggleSelect(); //toggle row selected state on row click
        }
    },
});

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
    console.log("in");
    if (!columnCheck()) { return; }
    formatIds(); //properly format row ids before sending the data to flask app
    uneditableColData(table.getColumnDefinitions()); //make col defintion uneditable befor submitting
    ajaxPostToFlask("/changeTableColumnNames", table.getColumnDefinitions()) //send changed column names to flask app
    ajaxPostToFlask("/changeTableContent", table.getData()) //send changed table content to flask app
    console.log("out");
    window.location.href=afterEditUrl; //go back to the previous view after editing the data
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
    for (i = 0; i < tableData.length; i++) {
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
    var id;
    if (currRowComp) { id = currRowComp.getIndex(); }
    else {
        rowdata = table.getSelectedData();
        if (rowdata.length == 0) { id = 0; } //no selected row
        else {
            id = rowdata[rowdata.length - 1]["id"]; //last selected row
        }
    }
    console.log("hi");
    table.addRow({ id: "" }, above, id);
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
    if (!columnCheck()){return}
    if (currColComp) {
        table.addColumn({ "editableTitle": true, "editor": "textarea", "formatter": "textarea", "headerFilter": true, "field": " ", "title": " " }, left, currColComp);
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

function editableColData(colDefinition){
    for (i=0; i < colDefinition.length; i++){
        if (colDefinition[i]["field"] !== "id"){ //leave id field uneditable
            colDefinition[i]["editableTitle"] = true;
            colDefinition[i]["editor"] = "textarea";
        }
    }
}

function uneditableColData(colDefinition){
    for (i=0; i < colDefinition.length; i++){
        if (colDefinition[i]["field"] !== "id"){ //leave id field unchanged
            delete colDefinition[i]["editableTitle"];
            delete colDefinition[i]["editor"]; 
            // console.log(colDefinition[i]);
        }
    }
}

//tableNames supplied from home.html
for (var i = 0; i < tableNames.length; i++) {
    generateTable(tableNames[i]); //generate the table with dir name tableNames
}

//create a table div to hold the table and its content and also its buttons
function generateTable(tableDir) {

    var tableId = tableDir; //this should be same as the name of the table directory 
    var tableTitle = tableDir.split("-").join(" ");

    $("<div>", { id: "table-holder-" + tableId }).appendTo("#main-table-holder");
    $("<h5>", { id: tableId + "-title" }).text(tableTitle).appendTo("#table-holder-" + tableId) //table title header
    $("<div>", { id: tableId, style: "height: 550px; width: 90%" }).appendTo("#table-holder-" + tableId); //tabulator (table) object div
    $("<div>", { id: tableId + "-buttons", style: "width: 90%" }).appendTo("#table-holder-" + tableId); //buttons div
    // $('<hr>', {style: "height:1px;border:none;color:#333;background-color:#333"}).appendTo("#" + "table-holder-" + tableId);

    //tabulator table object
    $("#" + tableId).tabulator({ //turns div into tabulator object
        layout: "fitColumns",
        renderComplete: function () { //runs everytime table view gets updated
            try { animateRowCount(getRowCount(tableId), tableId + "-row-count-number"); } //update row counter 
            catch (err) { } //don't do anything
        },
    });
    columnDataUrl = ajaxUrlCallGetData.replace("var1", tableId + "/columns.json"); //get column data from this url
    rowDataUrl = ajaxUrlCallGetData.replace("var1", tableId + "/content.json"); //get row data from this url call to back end server
    setTableData(rowDataUrl, columnDataUrl, tableId).then(function () { //execute set button only after the table has been populated by its respective content
        generateButtons(tableId);
    });


}

//sets table data (rows and columns) for the table id passed. Returns a promise after the setup
function setTableData(rowDataUrl, columnDataUrl, tableId) {
    return new Promise(function (resolve, reject) {
        getData(columnDataUrl).then(function (columns) {
            $("#" + tableId).tabulator("setColumns", JSON.parse(columns))
        }).then(function () {
            getData(rowDataUrl).then(function (rows) {
                $("#" + tableId).tabulator("setData", JSON.parse(rows))
                resolve();
            })
        }), function () {
            reject();
        }
    })
}

//returns a promise and delivers the data from the passed url
function getData(url) {
    return new Promise(function (resolve, reject) {
        $.post(url, function (data) {
            if (data)
                resolve(data)
            reject(new Error('Request to get data failed!'))
        });
    })
}

//adds buttons to the passed table
function generateButtons(tableId) {

    $("<div>", { id: tableId + "-btn-group", class: "btn-group" }).appendTo("#" + tableId + "-buttons"); //bootstrap btn group class
    //edit, add, delete and download buttons
    $('<input type="button" id="' + tableId + '-edit-table" value="Edit Table" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");
    $('<input type="button" id="' + tableId + '-delete-table" value="Delete Table" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");
    $('<input type="button" id="' + tableId + '-add-table" value="Add Table" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");
    $('<input type="button" id="' + tableId + '-download-table" value="Download csv" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");

    //row counter card
    $("<div>", { class: "border border-success float-md-right card", id: tableId + "-row-count", style: "text-align: center; width: 8%; color: aliceblue; background-color: #4CAF50;" }).appendTo("#" + tableId + "-buttons").text("Total Rows");
    $("<span>", { id: tableId + "-row-count-number", class: "card", style: "color: #4CAF50" }).appendTo("#" + tableId + "-row-count").text(getRowCount(tableId));

    // edit table button on click
    $("#" + tableId + "-edit-table").on("click", function () {
        var json_array = { 'tableDir': tableId }; //tableId is the name of the directory on back-end server
        editUrl = editUrl.replace("somevar", JSON.stringify(json_array)); //send json_array variable to flask
        window.location.href = editUrl;
    });

    //delete table button on click
    $("#" + tableId + "-delete-table").on("click", function () {
        if (confirm('Are you sure you want to delete this table?')) {
            $("#" + tableId).tabulator("destroy")
            $("#" + "table-holder-" + tableId).remove(); //remove the table holder div to remove table and its buttons
        }
    });

    //add table button on click
    $("#" + tableId + "-add-table").on("click", function () {
        window.location.href = addTableUrl;
     });

    //download table button on click
    $("#" + tableId + "-download-table").on("click", function () { $("#" + tableId).tabulator("download", "csv", "data.csv"); });

    $('<br><br><br>').appendTo("#" + "table-holder-" + tableId); //need breaks between the tables
}



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

//returns row count of the current view for the table with id tableId
function getRowCount(tableId) {
    if (emptyHeaderFilters(tableId)) { return $("#" + tableId).tabulator("getRows").length; }
    else { return $("#" + tableId).tabulator("getRows", true).length; }
}

//returns true if any column header filter is applied, false otherwise
function emptyHeaderFilters(tableId) {
    if ($("#" + tableId).tabulator("getHeaderFilters").length == 0) { return true; }
    else { return false; }
}

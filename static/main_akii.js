function getData(url) {
    return new Promise(function(resolve, reject){
        $.post(url, function (data) { 
            if(data)
                resolve(data)  
            reject(new Error('Request to get data failed!'))
        });
    })
}

function getTableData(columnDataUrl, rowDataUrl, tableId) {
    return new Promise(function(resolve, reject){
        getData(columnDataUrl).then(function(columns){
            $("#" + tableId).tabulator("setColumns", JSON.parse(columns))
        }, function(error){
            console.log(error);
        })

        getData(rowDataUrl).then(function(rows){
            $("#" + tableId).tabulator("setData", JSON.parse(rows)) 
        }, function(error){
            console.log(error);
        })
    })
}

function generateTable(i) {
    return new Promise(function(resolve, reject){

        var tableId = tableNames[i]; //this should be same as the name of the table directory 
        var tableTitle = "table" + i;

        $("<div>", { id: "table-holder-" + tableId}).appendTo("#main-table-holder");
        $("<h5>", { id: tableId + "-title" }).text(tableTitle).appendTo("#table-holder-" + tableId) //table title header
        $("<div>", { id: tableId, style: "height: 550px; width: 90%" }).appendTo("#table-holder-" + tableId); //table object div
        // $("<div>", { id: tableId + "-buttons", style: "width: 90%" }).appendTo("#table-holder"); //buttons div

        $("<div>", { id: tableId + "-buttons", style: "width: 90%" }).appendTo("#table-holder-" + tableId); //buttons div
        $("<div>", { id: tableId + "-btn-group" , class: "btn-group" }).appendTo("#" + tableId + "-buttons");
        $('<input type="button" id="' + tableId + '-edit-table" value="Edit Table" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");

        //tabulator table object
        $("#" + tableId).tabulator( {
            // data: jsondata, //json data supplied by flask app
            layout: "fitColumns",
            // columns: [], //column definition json data supplied by flask app
            // renderComplete: function () { //runs everytime table view gets updated
            //     try { animateRowCount(getRowCount(tableId), "row-count-number"); } //update row counter 
            //     catch (err) { } //don't do anything
            // },
        });

        columnDataUrl = ajaxUrlCall.replace("var1", tableId + "/columns.json")
        rowDataUrl = ajaxUrlCall.replace("var1", tableId + "/content.json")

        getTableData(columnDataUrl, rowDataUrl, tableId).then(function(){
            resolve()
        }, function(error){
            console.log(error);
            reject()
        })
        
        // $("<div>", { id: tableId + "-btn-group" , class: "btn-group" }).appendTo("#" + tableId + "-buttons");
    })
}

var promises = []

for (var i = 0; i < tableNames.length; i++) {
    promises.push(generateTable(i))
}
 
Promise.all(promises).then(function(data) {
    console.log(data);
    // plotGraph(allData);
}).catch(function(error) {
    console.log(error);
});


    // $.post(columnDataUrl, function (data) { 
    //     console.log("setting columns")
    //     console.log(JSON.parse(data)); 
    //     $("#" + tableId).tabulator("setColumns", JSON.parse(data)); 
    // });
    
    // $.post(rowDataUrl, function (data) { 
    //     console.log("setting rows")
    //     $("#" + tableId).tabulator("setData", JSON.parse(data)) 
    // });
    

    //div to hold all the buttons
    // $("<div>", { id: tableId + "-btn-group" , class: "btn-group" }).appendTo("#" + tableId + "-buttons");

    //edit, add, delete and download buttons
    // $('<input type="button" id="' + tableId + '-edit-table" ' + 'value="Edit Table" class="btn btn-primary"/>').appendTo("#" + tableId + "-btn-group");
    // $('<input type="button" id="delete-table" value="Delete Table" class="btn btn-primary"/>').appendTo(".btn-group");
    // $('<input type="button" id="add-table" value="Add Table" class="btn btn-primary"/>').appendTo(".btn-group");
    // $('<input type="button" id="download-table" value="Download csv" class="btn btn-primary"/>').appendTo(".btn-group");

    //row counter card
    // $("<div>", { class: "border border-success float-md-right card", id: "row-count" }).appendTo(".buttons").text("Total Rows");
    // $("<span>", { id: "row-count-number", class: "card" }).appendTo("#row-count").text(getRowCount());

    //edit table button on click
    // $("#edit-table").on("click", function () {
    //     var json_array = { 'rowdata': jsondata, 'coldata': coldata, 'rowpath': rowPath, 'colpath': colPath, 'tableTitleJson': tableTitleJson, 'titlepath': titlePath };
    //     editUrl = editUrl.replace("somevar", JSON.stringify(json_array)); //send json_array variable to flask
    //     window.location.href = editUrl;
    // });

    // //delete table button on click
    // $("#delete-table").on("click", function () {
    //     if (confirm('Are you sure you want to delete this table?')) {
    //         $("#" + tableId).destroy();
    //     }
    // });

    // //add table button on click
    // $("#add-table").on("click", function () {

    // });

    // //download table button on click
    // $("#download-table").on("click", function () {
    //     $("#" + tableId).download("csv", "data.csv"); //download table data as a CSV formatted file with a file name of data.csv
    // });
// }



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
    if (emptyHeaderFilters(tableId)) { return $("#" + tableId).getRows().length; }
    else { return $("#" + tableId).getRows(true).length; }
}

//returns true if any column header filter is applied, false otherwise.
function emptyHeaderFilters(tableId) {
    if ($("#" + tableId).getHeaderFilters().length == 0) { return true; }
    else { return false; }
}

function ajaxPostToFlask(flaskUrl, dataToPost) {
    $.ajax({
        type: "POST",
        url: flaskUrl,
        data: JSON.stringify(dataToPost),
        success: function (data) {
        }
    });
}
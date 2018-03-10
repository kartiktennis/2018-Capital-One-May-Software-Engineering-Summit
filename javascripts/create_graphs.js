
//Parse local sfpd csv file
function parseData(createGraph) {
    Papa.parse("sfpd_dispatch_data_subset.csv", {
        complete: function(results) {
            console.log("Finished:", results.data);
        }
    });
}

function createGraph(data) {
    //c3 code to create the graphs
}

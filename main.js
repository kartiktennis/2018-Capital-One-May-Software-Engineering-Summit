var addressHolder = {}; 
var inputTime = {};
var type = {};

function initMap() {
    var geocoder = new google.maps.Geocoder();
    document.getElementById('check-area').addEventListener('click', function() { //change the id that is used here and replace with button id for check area
    geocodeAddress(geocoder);
    });
}

function geocodeAddress(geocoder) {

    var locationData = [];

    var address = document.getElementById('address').value; //id  for address input field
    var inputTime = document.getElementById('get-time').value;


    geocoder.geocode({'address': address}, function(results, status) {

    if (status === 'OK') {

        locationData[0]=results[0].geometry.location.lat();
        locationData[1]=results[0].geometry.location.lng();

        addressHolder.latitude = locationData[0]; 
        addressHolder.longitude = locationData[1]; 

        if ( (locationData[1] > -122.36475849999999) ||
        (locationData[1] < -122.5115) || (locationData[0] < 37.706927690000001) ||
        (locationData[0] > 37.83109279) ) {

          alert("Invalid Address! Must be in San Francisco.");

         } else {   
            getClosest(addressHolder.latitude, addressHolder.longitude, inputTime);
         }

    } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function getClosest(latitude, longitude, time_data) {//array of 2 elements (lat long)

    var coordsJSON = null; 

    readTextFile("./data/identify_closest", function(text){

            coordsJSON = JSON.parse(text);

    });

    var unixJSON = null; 

    readTextFile("./data/unixTime_JSON", function(text){
            unixJSON = JSON.parse(text);
    
    });

    //converts timestamp string to unix time and stores in JSON file

    //converts inputed time to unix time
    inputTime.userInputUnixtime =  Math.round(new Date (time_data).getTime()/1000);

    var invalidTime = false; 
    
    if (isNaN(inputTime.userInputUnixtime) || time_data.length <= 10) {
        invalidTime = true; 
        document.getElementById("get-type").innerHTML = ""; 
        alert("Invalid Time, Please enter in correct format");
    }

    console.log(inputTime.userInputUnixtime); 

    //console.log(userInputUnixtime);

    var TimesWithID = []; 

    for (i = 0; i < 10000; i++) {

        //Format to follow for unix time conversion: Math.round(new Date("2013/09/05 15:34:00").getTime()/1000)        
        var unixTime = Math.round(new Date (unixJSON['received_timestamp'][i]).getTime()/1000); //place unix time in array with row id

        var timeEntry = {row_id: unixJSON['row_id'][i], unixTime: unixTime};

        TimesWithID.push(timeEntry); //time with id DONT SORT

    }



    var distanceListMap = [];
   
    //calculate closest

    var latFromJSON = []; 
    var longFromJSON = []; 
    var closestDistance = []
     for (i = 0; i <10000; i++) {


        for (i = 0; i < 10000; i++) {
            latFromJSON.push(parseFloat(coordsJSON['latitude'][i]));
            longFromJSON.push(parseFloat(coordsJSON['longitude'][i]));
        }
        // console.log(latFromJSON); 
        // console.log(longFromJSON);

        for (i =1; i<6; i++){
            var distance = Math.acos(Math.sin(addressHolder.latitude) * Math.sin(latFromJSON[i]) + Math.cos(addressHolder.latitude) * Math.cos(latFromJSON[i]) * Math.cos(addressHolder.longitude - longFromJSON[i])); //distance formula considering curvature of Earth
            //var distance = Math.pow(Math.pow((latFromJSON[i] - addressHolder.latitude),2) + Math.pow((longFromJSON[i] - addressHolder.longitude),2),.5) //distance formula calculations
            var closeEntry = {distance: distance, row_id: coordsJSON['row_id'][i]};
            closestDistance.push(closeEntry);
        }

        closestDistance.sort(sortFunction); //sorts the array based on distance

        for ( i =6; i<10000; i++){
            var NewDistance = Math.acos(Math.sin(addressHolder.latitude) * Math.sin(latFromJSON[i]) + Math.cos(addressHolder.latitude) * Math.cos(latFromJSON[i]) * Math.cos(addressHolder.longitude - longFromJSON[i])); //distance formula considering curvature of Earth
            if (NewDistance < closestDistance[closestDistance.length-1].distance){ // checking if there are other closer points
                closestDistance.splice(-1); //remove the last point
                var newEntry = {distance: NewDistance, row_id: coordsJSON['row_id'][i]};
                closestDistance.push(newEntry); //add the new point
                closestDistance.sort(sortFunction); //sort the array
            }
        }

        //console.log(closestDistance);

    }


    var finalClosestIncidents = []; 
    for (i = 0; i < 10000; i++) {
        if (TimesWithID[i].row_id === closestDistance[0].row_id || TimesWithID[i].row_id === closestDistance[1].row_id ||
            TimesWithID[i].row_id === closestDistance[2].row_id || TimesWithID[i].row_id === closestDistance[3].row_id ||
            TimesWithID[i].row_id === closestDistance[4].row_id) {
            var entry = {row_id: TimesWithID[i].row_id, time: TimesWithID[i].unixTime};
            finalClosestIncidents.push(entry);
        }
       
    }

    finalClosestIncidents.sort(sortFunctionTime); 
    // console.log(finalClosestIncidents);


    //get first one - sorted by difference with user inputed time
    // console.log(finalClosestIncidents[0].row_id); 
    //console.log(finalClosestIncidents);
    
    var finalJSON = null; 

    readTextFile("./data/finalJSON", function(text){
        finalJSON = JSON.parse(text);

    });

    console.log(typeof finalClosestIncidents[0].row_id); 

    for (i = 0; i < 10000; i++) {
        if (finalJSON['row_id'][i] === finalClosestIncidents[0].row_id) {
            type.unit = finalJSON['unit_type'][i];
            type.call = finalJSON['call_type'][i];
        }
    }

    // console.log(type.unit); 
    // console.log(type.call); 
    
    if (invalidTime != true) {
        document.getElementById("get-type").innerHTML = type.call + "(" + type.unit + ")";
    }


}

//relevant sort functions to sort listMaps by distance and time
function sortFunctionTime (a, b) {
    if (a.unixTime === inputTime.userInputUnixtime) {
        return 0;
    }
    else {
        return (Math.abs(a.unixTime - inputTime.userInputUnixtime));
    }
}
function sortFunction(a, b) {
    if (a.distance === b.distance) {
        return 0;
    }
    else {
        return (a.distance < b.distance) ? -1 : 1;
    }
}
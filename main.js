


function initMap() {
    var geocoder = new google.maps.Geocoder();
    document.getElementById('check-area').addEventListener('click', function() { //change the id that is used here and replace with button id for check area
    geocodeAddress(geocoder);
    });
}


window.locations_used = []; //declares global variable to hold lat and long coordinates of inputed address

function geocodeAddress(geocoder) {
    var location = [];
    var address = document.getElementById('address').value; //address input field id
    geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
        location[0]=results[0].geometry.location.lat();
        location[1]=results[0].geometry.location.lng();

        locations_used = location; 

        getClosest(locations_used);

    } else {
    alert('Geocode was not successful for the following reason: ' + status);
    }
    });
}

//get closests coordinates from inputed address
function getClosest(data) {
    
    console.log(data);
}
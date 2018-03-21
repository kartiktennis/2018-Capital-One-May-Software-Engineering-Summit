


var address, 
element = document.getElementById("address");
var zipcode,
element2 = document.getElementById("zipcode");

//null check for input field values
if (element != null || element2 != null) {
    address = element; 
    zipcode = element2;
}

var address_user = address.elements["user_address"]; 
//create array of valid zipcodes
console.log(address_user);

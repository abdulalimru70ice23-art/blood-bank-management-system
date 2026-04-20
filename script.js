// ==============================
// DONOR REGISTER (MongoDB)
// ==============================

document.getElementById("donorForm")?.addEventListener("submit", async function(e){

e.preventDefault();

const donor = {

name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
whatsapp: document.getElementById("whatsapp").value,
blood: document.getElementById("blood").value,
age: document.getElementById("age").value,
gender: document.getElementById("gender").value,
weight: document.getElementById("weight").value,
location: document.getElementById("location").value,
profession: document.getElementById("profession").value,
lastDonation: document.getElementById("lastDonation").value,
emergency: document.getElementById("emergency").value,
reason: document.getElementById("reason").value

};

try{

const res = await fetch("http://127.0.0.1:5000/add-donor",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(donor)

});

const data = await res.text();

alert(data);

document.getElementById("donorForm").reset();

}

catch(err){

alert("Server error. Please try again.");

}

});


// ==============================
// FIND DONOR SEARCH FILTER
// ==============================

function filterDonors(){

let blood = document.getElementById("bloodFilter").value.toLowerCase();
let location = document.getElementById("locationInput").value.toLowerCase();

let cards = document.querySelectorAll(".donor-card");

cards.forEach(card => {

let group = card.getAttribute("data-group").toLowerCase();
let donorLocation = card.getAttribute("data-location").toLowerCase();

let bloodMatch = blood === "all" || group === blood;
let locationMatch = donorLocation.includes(location);

if(bloodMatch && locationMatch){

card.style.display="block";

}else{

card.style.display="none";

}

});

}


// ==============================
// ADMIN LOGIN
// ==============================

function adminLogin(){

let username = document.getElementById("adminUser").value;
let password = document.getElementById("adminPass").value;
let code = document.getElementById("adminCode").value;

if(username === "" || password === "" || code === ""){

alert("Please fill all fields!");
return false;

}

if(username === "admin" && password === "12345" && code === "RU123"){

localStorage.setItem("adminLoggedIn","true");

window.location.href="admin-dashboard.html";

return false;

}

else{

alert("Invalid admin credentials!");
return false;

}

}


// ==============================
// ADMIN LOGOUT
// ==============================

function logout(){

localStorage.removeItem("adminLoggedIn");

window.location.href="admin-login.html";

}


document.addEventListener("DOMContentLoaded", function(){

const loggedIn = localStorage.getItem("userLoggedIn");

if(loggedIn){

document.getElementById("guestMenu").style.display="none";
document.getElementById("userMenu").style.display="inline";

}else{

document.getElementById("guestMenu").style.display="inline";
document.getElementById("userMenu").style.display="none";

}

});

function logout(){

localStorage.removeItem("userLoggedIn");

window.location.href="index.html";

}


function logout(){

localStorage.removeItem("adminLoggedIn");

window.location.href="admin-login.html";

}
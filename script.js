// =====================================================
// DONOR REGISTER (Send donor data to MongoDB backend)
// =====================================================

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


// =====================================================
// FIND DONOR FILTER
// =====================================================

function filterDonors(){

let blood = document.getElementById("bloodFilter")?.value.toLowerCase();
let location = document.getElementById("locationInput")?.value.toLowerCase();

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


// =====================================================
// ADMIN LOGIN SYSTEM
// =====================================================

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


// =====================================================
// ADMIN LOGOUT
// =====================================================

function adminLogout(){

localStorage.removeItem("adminLoggedIn");

window.location.href="admin-login.html";

}


// =====================================================
// USER LOGIN STATUS CHECK
// =====================================================

document.addEventListener("DOMContentLoaded", function(){

const loggedIn = localStorage.getItem("userLoggedIn");

if(loggedIn){

document.getElementById("guestMenu")?.style.display="none";
document.getElementById("userMenu")?.style.display="flex";

}else{

document.getElementById("guestMenu")?.style.display="flex";
document.getElementById("userMenu")?.style.display="none";

}

});




// =====================================================
// VOLUNTEER DATA LOAD
// =====================================================

async function loadVolunteers(){

const res = await fetch("http://localhost:5000/api/volunteers");

const data = await res.json();

const table = document.getElementById("volunteerTable");

if(!table) return;

table.innerHTML="";

data.forEach(v=>{

table.innerHTML += `

<tr>
<td>${v.name}</td>
<td>${v.blood}</td>
<td>${v.phone}</td>
<td>${v.area}</td>
<td>${v.status}</td>

<td>
<button onclick="deleteVolunteer('${v._id}')">Delete</button>
</td>
</tr>

`;

});

}


// =====================================================
// DELETE VOLUNTEER
// =====================================================

async function deleteVolunteer(id){

if(!confirm("Delete this volunteer?")) return;

await fetch(`http://localhost:5000/api/volunteers/${id}`,{
method:"DELETE"
});

loadVolunteers();

}

if(document.getElementById("volunteerTable")){
loadVolunteers();
}


// =====================================================
// APPROVE BLOOD REQUEST
// =====================================================

function approveRequest(id){

fetch("http://127.0.0.1:5000/approve-request/"+id,{
method:"PUT"
})
.then(res=>res.json())
.then(data=>{
alert("Request Approved");
location.reload();
})

}





// =====================================================
// USER LOGIN SUCCESS
// =====================================================

function loginSuccess(){

localStorage.setItem("userLoggedIn","true");

window.location.href = "index.html";

}


// =====================================================
// FETCH LIVE STATISTICS
// =====================================================

async function loadStats(){

try{

const donorRes = await fetch("http://127.0.0.1:5000/total-donors");
const donors = await donorRes.json();

document.getElementById("donorCount")?.innerText = donors.total + "+";


const requestRes = await fetch("http://127.0.0.1:5000/total-requests");
const requests = await requestRes.json();

document.getElementById("requestCount")?.innerText = requests.total + "+";


const volunteerRes = await fetch("http://127.0.0.1:5000/total-volunteers");
const volunteers = await volunteerRes.json();

document.getElementById("volunteerCount")?.innerText = volunteers.total + "+";


const livesRes = await fetch("http://127.0.0.1:5000/approved-requests");
const lives = await livesRes.json();

document.getElementById("livesSaved")?.innerText = lives.total + "+";

}

catch(error){

console.error("Error loading stats:", error);

}

}


// =====================================================
// LOAD STATS WHEN PAGE LOADS
// =====================================================

document.addEventListener("DOMContentLoaded", function(){

if(document.getElementById("donorCount")){
loadStats();
}

});



















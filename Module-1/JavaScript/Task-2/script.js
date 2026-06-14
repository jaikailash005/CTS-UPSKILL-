console.log("Welcome to the Community Portal");

window.onload=function(){
alert("Welcome to the Community Portal. Page loaded successfully!");

showEventInfo();
}

const eventName="Music Festival";

const eventDate="15 August 2026";

let availableSeats=50;

function showEventInfo(){
document.getElementById("eventDetails").innerHTML=
`Event Name: ${eventName}<br>
Event Date: ${eventDate}`;

document.getElementById("seatCount").innerHTML=
`Available Seats: ${availableSeats}`;
}

document.addEventListener("DOMContentLoaded",function(){
document.getElementById("registerSeatBtn").onclick=function(){
if(availableSeats>0){
availableSeats--;

document.getElementById("seatCount").innerHTML=
`Available Seats: ${availableSeats}`;

alert("Registration Successful");
}
else{
alert("No Seats Available");
}
};
});
console.log("Welcome to the Community Portal");

const eventName="Music Festival";
const eventDate="15 August 2026";

let availableSeats=50;

const events=[
{
name:"Music Festival",
date:"2026-08-15",
seats:50
},
{
name:"Food Camp",
date:"2025-01-10",
seats:20
},
{
name:"City Marathon",
date:"2026-10-01",
seats:0
},
{
name:"Dance Program",
date:"2026-09-20",
seats:30
}
];

window.onload=function(){
alert("Welcome to the Community Portal. Page loaded successfully!");

showEventInfo();

displayEvents();
}

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

document.getElementById("registerEventBtn").onclick=function(){
try{
let selectedEvent=events[0];

if(selectedEvent.seats<=0){
throw new Error("No seats available");
}

selectedEvent.seats--;

alert("User Registered Successfully");
}
catch(error){
alert(error.message);
}
};
});

function displayEvents(){
let output="";

let today=new Date();

events.forEach(function(event){
let eventDateObj=new Date(event.date);

if(eventDateObj>today && event.seats>0){
output+=`
<p>
<b>${event.name}</b>
<br>
Date: ${event.date}
<br>
Seats: ${event.seats}
</p>
<hr>
`;
}
});

document.getElementById("eventList").innerHTML=output;
}
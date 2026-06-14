console.log("Welcome to the Community Portal");

const eventName="Music Festival";
const eventDate="15 August 2026";

let availableSeats=50;

class Event{
constructor(name,date,seats,category){
this.name=name;
this.date=date;
this.seats=seats;
this.category=category;
}
}

Event.prototype.checkAvailability=function(){
return this.seats>0
?"Seats Available"
:"Fully Booked";
};

const events=[
new Event(
"Music Festival",
"2026-08-15",
50,
"Music"
),
new Event(
"Food Camp",
"2026-09-10",
20,
"Food"
),
new Event(
"Dance Program",
"2026-10-20",
30,
"Music"
)
];

window.onload=function(){
alert("Welcome to the Community Portal. Page loaded successfully!");

showEventInfo();

displayEvents();
};

function showEventInfo(){
document.getElementById("eventDetails").innerHTML=
`Event Name: ${eventName}<br>
Event Date: ${eventDate}`;

document.getElementById("seatCount").innerHTML=
`Available Seats: ${availableSeats}`;
}

function displayEvents(){
let output="";

events.forEach(function(event){
output+=`
<p>
<b>${event.name}</b>
<br>
Category: ${event.category}
<br>
Seats: ${event.seats}
</p>
`;
});

document.getElementById("eventList").innerHTML=output;
}

function addEvent(name,date,seats,category){
events.push({
name:name,
date:date,
seats:seats,
category:category
});

displayEvents();
}

function registerUser(eventName){
let event=events.find(e=>e.name===eventName);

if(event && event.seats>0){
event.seats--;

displayEvents();

return true;
}

return false;
}

function filterEventsByCategory(category,callback){
let filtered=events.filter(function(event){
return event.category===category;
});

callback(filtered);
}

function registrationCounter(){
let total=0;

return function(){
total++;

return total;
};
}

const trackRegistration=registrationCounter();

function showObjectEntries(){
let output="<h3>Object Keys and Values</h3>";

events.forEach(function(event){
output += "<hr>";

Object.entries(event).forEach(function(entry){
output += `
<p>
<b>${entry[0]}</b> : ${entry[1]}
</p>
`;
});
});

document.getElementById("managementOutput").innerHTML=output;
}

document.addEventListener("DOMContentLoaded",function(){
document.getElementById("registerSeatBtn").onclick=function(){
if(availableSeats>0){
availableSeats--;

document.getElementById("seatCount").innerHTML=
`Available Seats: ${availableSeats}`;

alert("Registration Successful");
}
};

document.getElementById("addEventBtn").onclick=function(){
addEvent(
"Sports Meet",
"2026-12-01",
40,
"Sports"
);

alert("New Event Added");
};

document.getElementById("registerUserBtn").onclick=function(){
let success=registerUser("Music Festival");

if(success){
let count=trackRegistration();

alert("User Registered. Total Registrations: "+count);
}
else{
alert("No Seats Available");
}
};

document.getElementById("filterEventBtn").onclick=function(){
filterEventsByCategory(
"Music",
function(filteredEvents){
let output="<h3>Music Events</h3>";

filteredEvents.forEach(function(event){
output+=`
<p>
${event.name}
<br>
Seats: ${event.seats}
</p>
`;
});

document.getElementById("managementOutput").innerHTML=output;
}
);
};

document.getElementById("objectEntriesBtn").onclick=function(){
showObjectEntries();
};
});
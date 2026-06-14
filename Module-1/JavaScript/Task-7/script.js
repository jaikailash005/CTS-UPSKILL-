console.log("Welcome to the Community Portal");

const eventName = "Music Festival";
const eventDate = "15 August 2026";

let availableSeats = 50;

class Event {
constructor(name, date, seats, category) {
this.name = name;
this.date = date;
this.seats = seats;
this.category = category;
this.maxSeats = seats;
}
}

Event.prototype.checkAvailability = function () {
return this.seats > 0
? "Seats Available"
: "Fully Booked";
};

const events = [
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

window.onload = function () {
alert("Welcome to the Community Portal. Page loaded successfully!");
showEventInfo();
displayEvents();
};

function showEventInfo() {
document.querySelector("#eventDetails").innerHTML =
`Event Name: ${eventName}<br>
Event Date: ${eventDate}`;

document.querySelector("#seatCount").innerHTML =
`Available Seats: ${availableSeats}`;
}

function displayEvents() {
let output = "";
events.forEach(function (event) {
output += `
<p>
<b>${event.name}</b>
<br>
Category: ${event.category}
<br>
Seats: ${event.seats}
</p>
`;
});

document.querySelector("#eventList").innerHTML = output;
}

function addEvent(name, date, seats, category) {
events.push(new Event(name, date, seats, category));
displayEvents();

if (document.querySelector("#domContainer").innerHTML !== "") {
createEventCards();
}
}

function registerUser(eventName) {
let event = events.find(e => e.name === eventName);

if(event && event.seats>0){
event.seats--;
displayEvents();
createEventCards();
return true;
}

return false;
}

function filterEventsByCategory(category, callback) {
let filtered = events.filter(function (event) {
return event.category === category;
});
callback(filtered);
}

function registrationCounter() {
let total = 0;
return function () {
total++;
return total;
};
}

const trackRegistration = registrationCounter();

function showObjectEntries() {
let output = "<h3>Object Keys and Values</h3>";
events.forEach(function (event) {
output += "<hr>";
Object.entries(event).forEach(function (entry) {
output += `
<p>
<b>${entry[0]}</b> : ${entry[1]}
</p>
`;
});
});

document.querySelector("#managementOutput").innerHTML = output;
}

function showFormattedEvents() {
let formattedEvents = events.map(function (event) {
return `Workshop on ${event.name}`;
});

let output = "<h3>Formatted Events using map()</h3>";
formattedEvents.forEach(function (item) {
output += `
<p>${item}</p>
`;
});

document.querySelector("#managementOutput").innerHTML = output;
}

function createEventCards(){
const container = document.querySelector("#domContainer");
container.innerHTML = "";
events.forEach(function(event){
const card = document.createElement("div");
card.classList.add("dynamic-card");

const heading = document.createElement("h3");
heading.textContent = event.name;

const details = document.createElement("p");
details.innerHTML = `
<strong>Date:</strong> ${event.date}<br>
<strong>Category:</strong> ${event.category}<br>
<strong>Seats:</strong> <span class="seat-badge ${event.seats > 0 ? 'available' : 'booked'}">${event.seats}</span>
`;

const availability = document.createElement("p");
availability.classList.add("availability-status");
const isAvailable = event.seats > 0;
availability.textContent = event.checkAvailability();
availability.style.color = isAvailable ? "#16a34a" : "#dc2626";
availability.style.fontWeight = "bold";

const btnGroup = document.createElement("div");
btnGroup.classList.add("card-btn-group");

const regBtn = document.createElement("button");
regBtn.textContent = "Register";
regBtn.classList.add("btn-card-register");
regBtn.onclick = function() {
    if (event.seats > 0) {
        event.seats--;
        displayEvents();
        createEventCards();
        alert(`Successfully registered for ${event.name}!`);
    } else {
        alert(`Registration failed: ${event.name} is fully booked.`);
    }
};

const cancelBtn = document.createElement("button");
cancelBtn.textContent = "Cancel";
cancelBtn.classList.add("btn-card-cancel");
cancelBtn.onclick = function() {
    if (event.seats < event.maxSeats) {
        event.seats++;
        displayEvents();
        createEventCards();
        alert(`Cancelled registration for ${event.name}.`);
    } else {
        alert(`No registrations to cancel for ${event.name}.`);
    }
};
btnGroup.appendChild(regBtn);
btnGroup.appendChild(cancelBtn);
card.appendChild(heading);
card.appendChild(details);
card.appendChild(availability);
card.appendChild(btnGroup);
container.appendChild(card);
});
}

document.addEventListener("DOMContentLoaded", function () {
document.querySelector("#registerSeatBtn").onclick = function () {
if (availableSeats > 0) {
availableSeats--;

document.querySelector("#seatCount").innerHTML =
`Available Seats: ${availableSeats}`;
alert("Registration Successful");
}
};

document.querySelector("#addEventBtn").onclick = function () {
addEvent(
"Sports Meet",
"2026-12-01",
40,
"Sports"
);
alert("New Event Added");
};

document.querySelector("#registerUserBtn").onclick = function () {
let success = registerUser("Music Festival");

if (success) {
let count = trackRegistration();
alert("User Registered. Total Registrations: " + count);
}
else {
alert("No Seats Available");
}
};

document.querySelector("#filterEventBtn").onclick = function () {
filterEventsByCategory(
"Music",
function (filteredEvents) {
let output = "<h3>Music Events</h3>";
filteredEvents.forEach(function (event) {
output += `
<p>
${event.name}
<br>
Seats: ${event.seats}
</p>
`;
});

document.querySelector("#managementOutput").innerHTML = output;
}
);
};

document.querySelector("#objectEntriesBtn").onclick = function () {
showObjectEntries();
};

document.querySelector("#mapEventBtn").onclick = function () {
showFormattedEvents();
};

document.querySelector("#domEventBtn").onclick = function () {
createEventCards();
};
});
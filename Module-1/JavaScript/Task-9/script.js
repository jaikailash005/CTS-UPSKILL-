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

function updateClock(){
let now = new Date();
let time = now.toLocaleTimeString();
const clockEl = document.querySelector("#clock");
if (clockEl) {
    clockEl.innerHTML = time;
}
}

setInterval(updateClock, 1000);

function showMessage(){
const messageEl = document.querySelector("#message");
if (messageEl) {
    messageEl.innerHTML = "Registration timer started... Wait 3 seconds.";
    setTimeout(function(){
        messageEl.innerHTML = "Event Registration Closing Soon!";
    }, 3000);
}
}

function mockFetchEvents() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const mockJSON = `[
                {"name": "Tech Seminar", "date": "2026-11-05", "seats": 100, "category": "Sports"},
                {"name": "Art Exhibition", "date": "2026-12-12", "seats": 15, "category": "Food"},
                {"name": "Charity Run", "date": "2026-10-09", "seats": 80, "category": "Sports"},
                {"name": "Music Gala", "date": "2026-11-20", "seats": 60, "category": "Music"}
            ]`;
            
            try {
                const parsedData = JSON.parse(mockJSON);
                resolve(parsedData);
            } catch (err) {
                reject(new Error("Failed to parse event JSON data"));
            }
        }, 1500); 
    });
}

function processFetchedEvents(data) {
    data.forEach(item => {
        const exists = events.some(e => e.name === item.name);
        if (!exists) {
            events.push(new Event(item.name, item.date, item.seats, item.category));
        }
    });
    displayEvents();
    if (document.querySelector("#domContainer").innerHTML !== "") {
        createEventCards();
    }
}

function displayFetchSuccess(message, data) {
    const output = document.querySelector("#asyncOutput");
    let html = `<p class="success-message">${message}</p>`;
    html += `<h3>Fetched Events:</h3>`;
    data.forEach(item => {
        html += `<p><strong>${item.name}</strong> - Category: <em>${item.category}</em> (Seats: ${item.seats})</p>`;
    });
    output.innerHTML = html;
}

function displayFetchError(errorMessage) {
    const output = document.querySelector("#asyncOutput");
    output.innerHTML = `<p class="error-message">Error fetching events: ${errorMessage}</p>`;
}

function showSpinner() {
    const spinner = document.querySelector("#asyncSpinner");
    if (spinner) {
        spinner.classList.remove("hidden");
    }
    const output = document.querySelector("#asyncOutput");
    if (output) {
        output.innerHTML = "";
    }
}

function hideSpinner() {
    const spinner = document.querySelector("#asyncSpinner");
    if (spinner) {
        spinner.classList.add("hidden");
    }
}

function fetchEventsWithPromises() {
    showSpinner();
    mockFetchEvents()
        .then(data => {
            hideSpinner();
            processFetchedEvents(data);
            displayFetchSuccess("Fetched events successfully via .then() / .catch()", data);
        })
        .catch(error => {
            hideSpinner();
            displayFetchError(error.message);
        });
}

async function fetchEventsWithAsyncAwait() {
    showSpinner();
    try {
        let data = await mockFetchEvents();
        hideSpinner();
        processFetchedEvents(data);
        displayFetchSuccess("Fetched events successfully via Async / Await", data);
    } catch (error) {
        hideSpinner();
        displayFetchError(error.message);
    }
}

window.onload = function () {
alert("Welcome to the Community Portal. Page loaded successfully!");
showEventInfo();
displayEvents();
updateClock();
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

if (document.querySelector("#domContainer").innerHTML !== "") {
createEventCards();
}

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

function createEventCards(eventsToRender = events){
const container = document.querySelector("#domContainer");
container.innerHTML = "";
eventsToRender.forEach(function(event){
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
        
        const activeCategory = document.querySelector("#categoryFilter").value;
        const activeSearch = document.querySelector("#searchEvent").value.toLowerCase();
        
        let currentRenderList = events;
        if (activeCategory !== "All") {
            currentRenderList = currentRenderList.filter(e => e.category === activeCategory);
        }
        if (activeSearch) {
            currentRenderList = currentRenderList.filter(e => e.name.toLowerCase().includes(activeSearch));
        }
        
        createEventCards(currentRenderList);
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
        
        const activeCategory = document.querySelector("#categoryFilter").value;
        const activeSearch = document.querySelector("#searchEvent").value.toLowerCase();
        
        let currentRenderList = events;
        if (activeCategory !== "All") {
            currentRenderList = currentRenderList.filter(e => e.category === activeCategory);
        }
        if (activeSearch) {
            currentRenderList = currentRenderList.filter(e => e.name.toLowerCase().includes(activeSearch));
        }
        
        createEventCards(currentRenderList);
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

function displayFilteredEvents(category){
let filteredEvents;

if(category==="All"){
filteredEvents=events;
}
else{
filteredEvents=events.filter(function(event){
return event.category===category;
});
}

let output="<h3>Filtered Events</h3>";
filteredEvents.forEach(function(event){
output+=`
<p>
${event.name}
<br>
Category: ${event.category}
</p>
`;
});

document.querySelector("#eventSearchResult").innerHTML=output;

if (document.querySelector("#domContainer").innerHTML !== "") {
    const activeSearch = document.querySelector("#searchEvent").value.toLowerCase();
    if (activeSearch) {
        filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(activeSearch));
    }
    createEventCards(filteredEvents);
}
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

document.querySelector("#categoryFilter").onchange = function(){
displayFilteredEvents(this.value);
};

document.querySelector("#searchEvent").onkeydown = function(){
setTimeout(() => {
    let keyword = this.value.toLowerCase();
    
    let result = events.filter(function(event){
        return event.name.toLowerCase().includes(keyword);
    });
    
    let output = "<h3>Search Result</h3>";
    result.forEach(function(event){
        output += `
        <p>${event.name}</p>
        `;
    });
    
    document.querySelector("#eventSearchResult").innerHTML = output;
    
    if (document.querySelector("#domContainer").innerHTML !== "") {
        const activeCategory = document.querySelector("#categoryFilter").value;
        if (activeCategory !== "All") {
            result = result.filter(e => e.category === activeCategory);
        }
        createEventCards(result);
    }
}, 0);
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

document.querySelector("#timerAlertBtn").onclick = function () {
showMessage();
};

document.querySelector("#fetchThenCatchBtn").onclick = function () {
fetchEventsWithPromises();
};

document.querySelector("#fetchAsyncAwaitBtn").onclick = function () {
fetchEventsWithAsyncAwait();
};
});
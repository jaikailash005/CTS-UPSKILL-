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
return this.seats > 0 ? "Seats Available" : "Fully Booked";
};

const events = [
new Event("Music Festival", "2026-08-15", 50, "Music"),
new Event("Food Camp", "2026-09-10", 20, "Food"),
new Event("Dance Program", "2026-10-20", 30, "Music")
];

function updateClock(){
let now = new Date();
let time = now.toLocaleTimeString();
const clockEl = document.querySelector("#clock");
if (clockEl) { clockEl.innerHTML = time; }
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
            {"name":"Tech Seminar","date":"2026-11-05","seats":100,"category":"Sports"},
            {"name":"Art Exhibition","date":"2026-12-12","seats":15,"category":"Food"},
            {"name":"Charity Run","date":"2026-10-09","seats":80,"category":"Sports"},
            {"name":"Music Gala","date":"2026-11-20","seats":60,"category":"Music"}
        ]`;
        try {
            resolve(JSON.parse(mockJSON));
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
if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
}

function displayFetchSuccess(message, data) {
const output = document.querySelector("#asyncOutput");
let html = `<p class="success-message">${message}</p><h3>Fetched Events:</h3>`;
data.forEach(item => {
    html += `<p><strong>${item.name}</strong> - Category: <em>${item.category}</em> (Seats: ${item.seats})</p>`;
});
output.innerHTML = html;
}

function displayFetchError(errorMessage) {
document.querySelector("#asyncOutput").innerHTML =
    `<p class="error-message">Error fetching events: ${errorMessage}</p>`;
}

function showSpinner() {
document.querySelector("#asyncSpinner").classList.remove("hidden");
document.querySelector("#asyncOutput").innerHTML = "";
}

function hideSpinner() {
document.querySelector("#asyncSpinner").classList.add("hidden");
}

function fetchEventsWithPromises() {
showSpinner();
mockFetchEvents()
    .then(data => { hideSpinner(); processFetchedEvents(data); displayFetchSuccess("Fetched via .then() / .catch()", data); })
    .catch(error => { hideSpinner(); displayFetchError(error.message); });
}

async function fetchEventsWithAsyncAwait() {
showSpinner();
try {
    const data = await mockFetchEvents();
    hideSpinner();
    processFetchedEvents(data);
    displayFetchSuccess("Fetched via Async / Await", data);
} catch (error) {
    hideSpinner();
    displayFetchError(error.message);
}
}

function savePreferences() {
const name = document.querySelector("#userName").value;
const preferred = document.querySelector("#preferredEvent").value;
localStorage.setItem("userName", name);
localStorage.setItem("preferredEvent", preferred);
const resultEl = document.querySelector("#preferenceResult");
resultEl.innerHTML = `Saved! Welcome, <strong>${name}</strong>. Preferred Event: <strong>${preferred}</strong>`;
}

function loadPreferences() {
const name = localStorage.getItem("userName");
const preferred = localStorage.getItem("preferredEvent");
if (name) { document.querySelector("#userName").value = name; }
if (preferred) { document.querySelector("#preferredEvent").value = preferred; }
const resultEl = document.querySelector("#preferenceResult");
if (name || preferred) {
    resultEl.innerHTML = `Welcome back, <strong>${name || "Guest"}</strong>! Saved event: <strong>${preferred || "None"}</strong>`;
} else {
    resultEl.textContent = "Stored Preferences Will Appear Here";
}
}

function clearPreferences() {
localStorage.clear();
document.querySelector("#userName").value = "";
document.querySelector("#preferredEvent").selectedIndex = 0;
document.querySelector("#preferenceResult").textContent = "Local Storage Cleared successfully.";
}

function clearErrors() {
["nameError","emailError","eventError","feedbackError"].forEach(id => {
    document.querySelector("#" + id).textContent = "";
});
document.querySelectorAll(".formField").forEach(el => el.classList.remove("field-error"));
document.querySelector("#registrationSuccess").classList.add("hidden");
}

function showError(fieldId, errorId, message) {
document.querySelector("#" + fieldId).classList.add("field-error");
document.querySelector("#" + errorId).textContent = message;
}

function validateForm(form) {
let isValid = true;

const name     = form.elements["fullname"].value.trim();
const email    = form.elements["email"].value.trim();
const eventVal = form.elements["eventType"].value;
const feedback = form.elements["feedback"].value.trim();

if (name === "") {
    showError("regName", "nameError", "Full name is required.");
    isValid = false;
} else if (name.length < 3) {
    showError("regName", "nameError", "Name must be at least 3 characters.");
    isValid = false;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
if (email === "") {
    showError("regEmail", "emailError", "Email address is required.");
    isValid = false;
} else if (!emailRegex.test(email)) {
    showError("regEmail", "emailError", "Please enter a valid email address.");
    isValid = false;
}

if (eventVal === "" || eventVal === "-- Select Event Type --") {
    showError("regEvent", "eventError", "Please select an event.");
    isValid = false;
}

if (feedback === "") {
    showError("regFeedback", "feedbackError", "Feedback / message is required.");
    isValid = false;
}

return { isValid, name, email, eventVal, feedback };
}

function handleFormSubmit(e) {
e.preventDefault();

const form = document.querySelector("#registrationForm");
clearErrors();

const { isValid, name, eventVal } = validateForm(form);

if (!isValid) { return; }

const matchedEvent = events.find(ev => ev.name === eventVal);
if (matchedEvent && matchedEvent.seats > 0) {
    matchedEvent.seats--;
    displayEvents();
    if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
}

const successDiv = document.querySelector("#registrationSuccess");
document.querySelector("#successMessage").innerHTML =
    `Thank you, <strong>${name}</strong>! You have registered for <strong>${eventVal}</strong>.`;
successDiv.classList.remove("hidden");
form.reset();
}

window.onload = function () {
alert("Welcome to the Community Portal. Page loaded successfully!");
showEventInfo();
displayEvents();
updateClock();
loadPreferences();
};

function showEventInfo() {
document.querySelector("#eventDetails").innerHTML =
    `Event Name: ${eventName}<br>Event Date: ${eventDate}`;
document.querySelector("#seatCount").innerHTML =
    `Available Seats: ${availableSeats}`;
}

function displayEvents() {
let output = "";
events.forEach(function (event) {
    output += `<p><b>${event.name}</b><br>Category: ${event.category}<br>Seats: ${event.seats}</p>`;
});
document.querySelector("#eventList").innerHTML = output;
}

function addEvent(name, date, seats = 30, category = "Music") {
events.push(new Event(name, date, seats, category));
displayEvents();
if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
}

function registerUser(eventName) {
let event = events.find(e => e.name === eventName);
if (event && event.seats > 0) {
    event.seats--;
    displayEvents();
    if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
    return true;
}
return false;
}

function filterEventsByCategory(category, callback) {
callback(events.filter(event => event.category === category));
}

function registrationCounter() {
let total = 0;
return function () { return ++total; };
}

const trackRegistration = registrationCounter();

function showObjectEntries() {
let output = "<h3>Object Keys and Values</h3>";
events.forEach(function (event) {
    output += "<hr>";
    Object.entries(event).forEach(function (entry) {
        output += `<p><b>${entry[0]}</b> : ${entry[1]}</p>`;
    });
});
document.querySelector("#managementOutput").innerHTML = output;
}

function showFormattedEvents() {
const formattedEvents = events.map(event => `Workshop on ${event.name}`);
let output = "<h3>Formatted Events using map()</h3>";
formattedEvents.forEach(item => { output += `<p>${item}</p>`; });
document.querySelector("#managementOutput").innerHTML = output;
}

function createEventCards(eventsToRender = events) {
const container = document.querySelector("#domContainer");
container.innerHTML = "";
eventsToRender.forEach(function(event) {
    const { name, date, seats, category, maxSeats } = event;

    const card = document.createElement("div");
    card.classList.add("dynamic-card");

    const heading = document.createElement("h3");
    heading.textContent = name;

    const details = document.createElement("p");
    details.innerHTML = `
        <strong>Date:</strong> ${date}<br>
        <strong>Category:</strong> ${category}<br>
        <strong>Seats:</strong> <span class="seat-badge ${seats > 0 ? 'available' : 'booked'}">${seats}</span>
    `;

    const availability = document.createElement("p");
    availability.classList.add("availability-status");
    const isAvailable = seats > 0;
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
            let list = [...events];
            if (activeCategory !== "All") { list = list.filter(e => e.category === activeCategory); }
            if (activeSearch) { list = list.filter(e => e.name.toLowerCase().includes(activeSearch)); }
            createEventCards(list);
            alert(`Successfully registered for ${name}!`);
        } else {
            alert(`${name} is fully booked.`);
        }
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("btn-card-cancel");
    cancelBtn.onclick = function() {
        if (event.seats < maxSeats) {
            event.seats++;
            displayEvents();
            const activeCategory = document.querySelector("#categoryFilter").value;
            const activeSearch = document.querySelector("#searchEvent").value.toLowerCase();
            let list = [...events];
            if (activeCategory !== "All") { list = list.filter(e => e.category === activeCategory); }
            if (activeSearch) { list = list.filter(e => e.name.toLowerCase().includes(activeSearch)); }
            createEventCards(list);
            alert(`Cancelled registration for ${name}.`);
        } else {
            alert(`No registrations to cancel for ${name}.`);
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

function displayFilteredEvents(category) {
const clonedEvents = [...events];
const filteredEvents = category === "All" ? clonedEvents : clonedEvents.filter(e => e.category === category);

let output = "<h3>Filtered Events</h3>";
filteredEvents.forEach(event => { output += `<p>${event.name}<br>Category: ${event.category}</p>`; });
document.querySelector("#eventSearchResult").innerHTML = output;

if (document.querySelector("#domContainer").innerHTML !== "") {
    const activeSearch = document.querySelector("#searchEvent").value.toLowerCase();
    const finalList = activeSearch ? filteredEvents.filter(e => e.name.toLowerCase().includes(activeSearch)) : filteredEvents;
    createEventCards(finalList);
}
}

document.addEventListener("DOMContentLoaded", function () {
document.querySelector("#registerSeatBtn").onclick = function () {
    if (availableSeats > 0) {
        availableSeats--;
        document.querySelector("#seatCount").innerHTML = `Available Seats: ${availableSeats}`;
        alert("Registration Successful");
    }
};

document.querySelector("#addEventBtn").onclick = function () {
    addEvent("Sports Meet", "2026-12-01");
    alert("New Event Added (ES6+ Default Parameters applied)");
};

document.querySelector("#registerUserBtn").onclick = function () {
    const success = registerUser("Music Festival");
    if (success) {
        alert("User Registered. Total Registrations: " + trackRegistration());
    } else {
        alert("No Seats Available");
    }
};

document.querySelector("#filterEventBtn").onclick = function () {
    filterEventsByCategory("Music", function (filteredEvents) {
        let output = "<h3>Music Events</h3>";
        filteredEvents.forEach(event => { output += `<p>${event.name}<br>Seats: ${event.seats}</p>`; });
        document.querySelector("#managementOutput").innerHTML = output;
    });
};

document.querySelector("#categoryFilter").onchange = function () { displayFilteredEvents(this.value); };

document.querySelector("#searchEvent").onkeydown = function () {
    setTimeout(() => {
        const keyword = this.value.toLowerCase();
        
        const clonedEvents = [...events];
        const result = clonedEvents.filter(event => event.name.toLowerCase().includes(keyword));
        let output = "<h3>Search Result</h3>";
        result.forEach(event => { output += `<p>${event.name}</p>`; });
        document.querySelector("#eventSearchResult").innerHTML = output;
        if (document.querySelector("#domContainer").innerHTML !== "") {
            const activeCategory = document.querySelector("#categoryFilter").value;
            const finalList = activeCategory !== "All" ? result.filter(e => e.category === activeCategory) : result;
            createEventCards(finalList);
        }
    }, 0);
};

document.querySelector("#objectEntriesBtn").onclick = showObjectEntries;
document.querySelector("#mapEventBtn").onclick = showFormattedEvents;
document.querySelector("#domEventBtn").onclick = function () { createEventCards(); };
document.querySelector("#timerAlertBtn").onclick = showMessage;
document.querySelector("#fetchThenCatchBtn").onclick = fetchEventsWithPromises;
document.querySelector("#fetchAsyncAwaitBtn").onclick = fetchEventsWithAsyncAwait;
document.querySelector("#savePrefBtn").onclick = savePreferences;
document.querySelector("#clearPrefBtn").onclick = clearPreferences;

document.querySelector("#registrationForm").addEventListener("submit", handleFormSubmit);
});
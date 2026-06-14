console.log("Task 12 – AJAX & Fetch API loaded");

const eventName = "Music Festival";
const eventDate = "15 August 2026";
let availableSeats = 50;

class Event {
    constructor(name, date, seats, category) {
        this.name     = name;
        this.date     = date;
        this.seats    = seats;
        this.category = category;
        this.maxSeats = seats;
    }
}

Event.prototype.checkAvailability = function () {
    return this.seats > 0 ? "Seats Available" : "Fully Booked";
};

const events = [
    new Event("Music Festival",  "2026-08-15", 50, "Music"),
    new Event("Food Camp",       "2026-09-10", 20, "Food"),
    new Event("Dance Program",   "2026-10-20", 30, "Music")
];

function updateClock() {
    const el = document.querySelector("#clock");
    if (el) { el.innerHTML = new Date().toLocaleTimeString(); }
}
setInterval(updateClock, 1000);

function showMessage() {
    const el = document.querySelector("#message");
    if (!el) { return; }
    el.innerHTML = "Registration timer started... Wait 3 seconds.";
    setTimeout(() => { el.innerHTML = "Event Registration Closing Soon!"; }, 3000);
}

function mockFetchEvents() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const raw = `[
                {"name":"Tech Seminar",  "date":"2026-11-05","seats":100,"category":"Sports"},
                {"name":"Art Exhibition","date":"2026-12-12","seats":15, "category":"Food"},
                {"name":"Charity Run",   "date":"2026-10-09","seats":80, "category":"Sports"},
                {"name":"Music Gala",    "date":"2026-11-20","seats":60, "category":"Music"}
            ]`;
            try   { resolve(JSON.parse(raw)); }
            catch { reject(new Error("Failed to parse mock event data")); }
        }, 1500);
    });
}

function processFetchedEvents(data) {
    data.forEach(item => {
        if (!events.some(e => e.name === item.name)) {
            events.push(new Event(item.name, item.date, item.seats, item.category));
        }
    });
    displayEvents();
    if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
}

function showSpinner()  { document.querySelector("#asyncSpinner").classList.remove("hidden"); document.querySelector("#asyncOutput").innerHTML = ""; }
function hideSpinner()  { document.querySelector("#asyncSpinner").classList.add("hidden"); }

function displayFetchSuccess(label, data) {
    let html = `<p class="success-message">${label}</p><h3>Fetched Events:</h3>`;
    data.forEach(d => { html += `<p><strong>${d.name}</strong> — ${d.category} (Seats: ${d.seats})</p>`; });
    document.querySelector("#asyncOutput").innerHTML = html;
}
function displayFetchError(msg) {
    document.querySelector("#asyncOutput").innerHTML = `<p class="error-message">Error: ${msg}</p>`;
}

function fetchEventsWithPromises() {
    showSpinner();
    mockFetchEvents()
        .then(data  => { hideSpinner(); processFetchedEvents(data); displayFetchSuccess("Fetched via .then() / .catch()", data); })
        .catch(err  => { hideSpinner(); displayFetchError(err.message); });
}

async function fetchEventsWithAsyncAwait() {
    showSpinner();
    try {
        const data = await mockFetchEvents();
        hideSpinner();
        processFetchedEvents(data);
        displayFetchSuccess("Fetched via Async / Await", data);
    } catch (err) {
        hideSpinner();
        displayFetchError(err.message);
    }
}

function mockPostRegistration(payload, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("500 Internal Server Error – Registration service is temporarily unavailable."));
            } else {
                resolve({
                    status   : 201,
                    message  : "Registration received successfully!",
                    id       : `EVT-${Math.floor(Math.random() * 90000) + 10000}`,
                    timestamp: new Date().toISOString(),
                    received : payload
                });
            }
        }, 2000); 
    });
}

function collectFormPayload() {
    const form = document.querySelector("#registrationForm");
    const { fullname, email, eventType, feedback } = form.elements;
    return {
        fullName  : fullname.value.trim()  || "Not provided",
        email     : email.value.trim()     || "Not provided",
        eventType : eventType.value        || "Not provided",
        feedback  : feedback.value.trim()  || "Not provided"
    };
}

function showPostSpinner(text = "Sending data to server...") {
    const spinner  = document.querySelector("#postSpinner");
    const spinText = document.querySelector("#postSpinnerText");
    spinText.textContent = text;
    spinner.classList.remove("hidden");
    document.querySelector("#postResult").innerHTML = "";
    document.querySelector("#ajaxPreviewWrapper").classList.add("hidden");
}

function hidePostSpinner() {
    document.querySelector("#postSpinner").classList.add("hidden");
}

function renderRequestPreview(payload) {
    document.querySelector("#requestPreview").textContent = JSON.stringify(payload, null, 2);
}

function renderResponseSuccess(response) {
    hidePostSpinner();
    
    document.querySelector("#postResult").innerHTML = `
        <div class="post-success">
            <span>&#10003; POST Successful</span>
            <p>Registration ID: <strong>${response.id}</strong></p>
            <p>Status: <strong>${response.status} Created</strong></p>
            <p>${response.message}</p>
            <p class="ts">Server timestamp: ${response.timestamp}</p>
        </div>`;
    
    const wrapper = document.querySelector("#ajaxPreviewWrapper");
    wrapper.classList.remove("hidden");
    document.querySelector("#responsePreview").textContent = JSON.stringify(response, null, 2);
}

function renderResponseError(err) {
    hidePostSpinner();
    document.querySelector("#postResult").innerHTML = `
        <div class="post-error">
            <span>&#10005; POST Failed</span>
            <p>${err.message}</p>
        </div>`;
    const wrapper = document.querySelector("#ajaxPreviewWrapper");
    wrapper.classList.remove("hidden");
    document.querySelector("#responsePreview").textContent = `Error: ${err.message}`;
}

function postRegistrationThenCatch(shouldFail = false) {
    const payload = collectFormPayload();
    showPostSpinner("Sending via .then()/.catch() — please wait...");
    renderRequestPreview(payload);
    mockPostRegistration(payload, shouldFail)
        .then(response => renderResponseSuccess(response))
        .catch(err     => renderResponseError(err));
}

async function postRegistrationAsyncAwait(shouldFail = false) {
    const payload = collectFormPayload();
    showPostSpinner("Sending via Async/Await — please wait...");
    renderRequestPreview(payload);

    try {
        const response = await mockPostRegistration(payload, shouldFail);
        renderResponseSuccess(response);
    } catch (err) {
        renderResponseError(err);
    }
}

function clearErrors() {
    ["nameError","emailError","eventError","feedbackError"].forEach(id => {
        document.querySelector("#" + id).textContent = "";
    });
    document.querySelectorAll(".formField").forEach(el => el.classList.remove("field-error"));
    document.querySelector("#registrationSuccess").classList.add("hidden");
}

function showFieldError(fieldId, errorId, msg) {
    document.querySelector("#" + fieldId).classList.add("field-error");
    document.querySelector("#" + errorId).textContent = msg;
}

function validateForm(form) {
    let isValid = true;

    const name     = form.elements["fullname"].value.trim();
    const email    = form.elements["email"].value.trim();
    const eventVal = form.elements["eventType"].value;
    const feedback = form.elements["feedback"].value.trim();

    if (!name)          { showFieldError("regName",     "nameError",     "Full name is required.");                          isValid = false; }
    else if (name.length < 3) { showFieldError("regName", "nameError",  "Name must be at least 3 characters.");             isValid = false; }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email)         { showFieldError("regEmail",    "emailError",    "Email address is required.");                      isValid = false; }
    else if (!emailRx.test(email)) { showFieldError("regEmail", "emailError", "Please enter a valid email address.");       isValid = false; }

    if (!eventVal)      { showFieldError("regEvent",    "eventError",    "Please select an event.");                         isValid = false; }

    if (!feedback)      { showFieldError("regFeedback", "feedbackError", "Feedback / message is required.");                 isValid = false; }

    return { isValid, name, email, eventVal, feedback };
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.querySelector("#registrationForm");
    clearErrors();
    const { isValid, name, eventVal } = validateForm(form);
    if (!isValid) { return; }

    const matched = events.find(ev => ev.name === eventVal);
    if (matched && matched.seats > 0) {
        matched.seats--;
        displayEvents();
        if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
    }

    const successDiv = document.querySelector("#registrationSuccess");
    document.querySelector("#successMessage").innerHTML =
        `Thank you, <strong>${name}</strong>! You registered for <strong>${eventVal}</strong>.`;
    successDiv.classList.remove("hidden");
    form.reset();
}

function savePreferences() {
    const name = document.querySelector("#userName").value;
    const pref = document.querySelector("#preferredEvent").value;
    localStorage.setItem("userName", name);
    localStorage.setItem("preferredEvent", pref);
    document.querySelector("#preferenceResult").innerHTML =
        `Saved! Welcome, <strong>${name}</strong>. Preferred Event: <strong>${pref}</strong>`;
}

function loadPreferences() {
    const name = localStorage.getItem("userName");
    const pref = localStorage.getItem("preferredEvent");
    if (name) { document.querySelector("#userName").value = name; }
    if (pref) { document.querySelector("#preferredEvent").value = pref; }
    const el = document.querySelector("#preferenceResult");
    if (name || pref) {
        el.innerHTML = `Welcome back, <strong>${name || "Guest"}</strong>! Saved event: <strong>${pref || "None"}</strong>`;
    }
}

function clearPreferences() {
    localStorage.clear();
    document.querySelector("#userName").value = "";
    document.querySelector("#preferredEvent").selectedIndex = 0;
    document.querySelector("#preferenceResult").textContent = "Local Storage Cleared successfully.";
}

function showEventInfo() {
    document.querySelector("#eventDetails").innerHTML = `Event Name: ${eventName}<br>Event Date: ${eventDate}`;
    document.querySelector("#seatCount").innerHTML    = `Available Seats: ${availableSeats}`;
}

function displayEvents() {
    let html = "";
    events.forEach(ev => {
        html += `<p><b>${ev.name}</b><br>Category: ${ev.category}<br>Seats: ${ev.seats}</p>`;
    });
    document.querySelector("#eventList").innerHTML = html;
}

function addEvent(name, date, seats = 30, category = "Music") {
    events.push(new Event(name, date, seats, category));
    displayEvents();
    if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); }
}

function registerUser(name) {
    const ev = events.find(e => e.name === name);
    if (ev && ev.seats > 0) { ev.seats--; displayEvents(); if (document.querySelector("#domContainer").innerHTML !== "") { createEventCards(); } return true; }
    return false;
}

function registrationCounter() { let total = 0; return () => ++total; }
const trackRegistration = registrationCounter();

function showObjectEntries() {
    let html = "<h3>Object Keys and Values</h3>";
    events.forEach(ev => {
        html += "<hr>";
        Object.entries(ev).forEach(([k, v]) => { html += `<p><b>${k}</b> : ${v}</p>`; });
    });
    document.querySelector("#managementOutput").innerHTML = html;
}

function showFormattedEvents() {
    const formatted = events.map(ev => `Workshop on ${ev.name}`);
    let html = "<h3>Formatted Events using map()</h3>";
    formatted.forEach(item => { html += `<p>${item}</p>`; });
    document.querySelector("#managementOutput").innerHTML = html;
}

function createEventCards(eventsToRender = events) {
    const container = document.querySelector("#domContainer");
    container.innerHTML = "";
    eventsToRender.forEach(function(event) {
        const { name, date, seats, category, maxSeats } = event;

        const card         = document.createElement("div");
        card.classList.add("dynamic-card");

        const heading      = document.createElement("h3");
        heading.textContent = name;

        const details      = document.createElement("p");
        details.innerHTML  = `
            <strong>Date:</strong> ${date}<br>
            <strong>Category:</strong> ${category}<br>
            <strong>Seats:</strong> <span class="seat-badge ${seats > 0 ? 'available' : 'booked'}">${seats}</span>`;

        const avail        = document.createElement("p");
        avail.classList.add("availability-status");
        avail.textContent  = event.checkAvailability();
        avail.style.color  = seats > 0 ? "#16a34a" : "#dc2626";
        avail.style.fontWeight = "bold";

        const btnGroup     = document.createElement("div");
        btnGroup.classList.add("card-btn-group");

        const regBtn       = document.createElement("button");
        regBtn.textContent = "Register";
        regBtn.classList.add("btn-card-register");
        regBtn.onclick     = function () {
            if (event.seats > 0) {
                event.seats--;
                displayEvents();
                refreshCards();
                alert(`Successfully registered for ${name}!`);
            } else { alert(`${name} is fully booked.`); }
        };

        const cancelBtn    = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.classList.add("btn-card-cancel");
        cancelBtn.onclick  = function () {
            if (event.seats < maxSeats) {
                event.seats++;
                displayEvents();
                refreshCards();
                alert(`Cancelled registration for ${name}.`);
            } else { alert(`No registrations to cancel for ${name}.`); }
        };
        btnGroup.appendChild(regBtn);
        btnGroup.appendChild(cancelBtn);
        card.appendChild(heading);
        card.appendChild(details);
        card.appendChild(avail);
        card.appendChild(btnGroup);
        container.appendChild(card);
    });
}

function refreshCards() {
    const cat    = document.querySelector("#categoryFilter").value;
    const search = document.querySelector("#searchEvent").value.toLowerCase();
    let   list   = [...events];
    if (cat !== "All") { list = list.filter(e => e.category === cat); }
    if (search)        { list = list.filter(e => e.name.toLowerCase().includes(search)); }
    createEventCards(list);
}

function displayFilteredEvents(category) {
    const cloned   = [...events];
    const filtered = category === "All" ? cloned : cloned.filter(e => e.category === category);
    let html = "<h3>Filtered Events</h3>";
    filtered.forEach(ev => { html += `<p>${ev.name}<br>Category: ${ev.category}</p>`; });
    document.querySelector("#eventSearchResult").innerHTML = html;
    if (document.querySelector("#domContainer").innerHTML !== "") {
        const kw = document.querySelector("#searchEvent").value.toLowerCase();
        createEventCards(kw ? filtered.filter(e => e.name.toLowerCase().includes(kw)) : filtered);
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

    document.querySelector("#addEventBtn").onclick      = () => { addEvent("Sports Meet","2026-12-01"); alert("New Event Added"); };
    document.querySelector("#registerUserBtn").onclick  = () => { if (registerUser("Music Festival")) { alert("Registered. Count: " + trackRegistration()); } else { alert("No Seats Available"); } };
    document.querySelector("#filterEventBtn").onclick   = () => {
        const filtered = events.filter(ev => ev.category === "Music");
        let html = "<h3>Music Events</h3>";
        filtered.forEach(ev => { html += `<p>${ev.name}<br>Seats: ${ev.seats}</p>`; });
        document.querySelector("#managementOutput").innerHTML = html;
    };
    document.querySelector("#objectEntriesBtn").onclick = showObjectEntries;
    document.querySelector("#mapEventBtn").onclick      = showFormattedEvents;
    document.querySelector("#domEventBtn").onclick      = () => createEventCards();
    document.querySelector("#timerAlertBtn").onclick    = showMessage;
    document.querySelector("#fetchThenCatchBtn").onclick = fetchEventsWithPromises;
    document.querySelector("#fetchAsyncAwaitBtn").onclick = fetchEventsWithAsyncAwait;
    document.querySelector("#savePrefBtn").onclick      = savePreferences;
    document.querySelector("#clearPrefBtn").onclick     = clearPreferences;

    document.querySelector("#categoryFilter").onchange  = function () { displayFilteredEvents(this.value); };
    document.querySelector("#searchEvent").onkeydown    = function () {
        setTimeout(() => {
            const kw      = this.value.toLowerCase();
            const result  = [...events].filter(ev => ev.name.toLowerCase().includes(kw));
            let html = "<h3>Search Result</h3>";
            result.forEach(ev => { html += `<p>${ev.name}</p>`; });
            document.querySelector("#eventSearchResult").innerHTML = html;
            if (document.querySelector("#domContainer").innerHTML !== "") {
                const cat = document.querySelector("#categoryFilter").value;
                createEventCards(cat !== "All" ? result.filter(e => e.category === cat) : result);
            }
        }, 0);
    };

    document.querySelector("#registrationForm").addEventListener("submit", handleFormSubmit);
    
    document.querySelector("#postThenCatchBtn").addEventListener("click", function () {
        postRegistrationThenCatch(false);
    });
    
    document.querySelector("#postAsyncAwaitBtn").addEventListener("click", function () {
        postRegistrationAsyncAwait(false);
    });
    
    document.querySelector("#postFailBtn").addEventListener("click", function () {
        postRegistrationThenCatch(true);   
    });
});

window.onload = function () {
    alert("Welcome to the Community Portal. Page loaded successfully!");
    showEventInfo();
    displayEvents();
    updateClock();
    loadPreferences();
};
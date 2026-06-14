
let logCount = 0;

function debugLog(type, ...args) {
    if      (type === "warn")  { console.warn(...args); }
    else if (type === "error") { console.error(...args); }
    else if (type === "group") { console.group(...args); }
    else if (type === "groupEnd") { console.groupEnd(); }
    else if (type === "table") { console.table(args[0]); }
    else                        { console.log(...args); }

    const panel = document.querySelector("#debugConsole");
    if (!panel) { return; }

    const placeholder = panel.querySelector(".debug-placeholder");
    if (placeholder) { placeholder.remove(); }

    const line = document.createElement("div");
    line.classList.add("debug-line", `debug-${type}`);

    const ts   = new Date().toLocaleTimeString();
    const icon = { log:"›", warn:"⚠", error:"✖", info:"ℹ", group:"▼", groupEnd:"▲", table:"▦" }[type] || "›";
    
    const text = args.map(a => {
        if (typeof a === "object" && a !== null) {
            try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        }
        return String(a);
    }).join(" ");
    line.innerHTML = `<span class="debug-ts">[${ts}]</span><span class="debug-icon">${icon}</span><span class="debug-text">${text}</span>`;
    panel.appendChild(line);
    panel.scrollTop = panel.scrollHeight;
    logCount++;
    const badge = document.querySelector("#logBadge");
    if (badge) { badge.textContent = `${logCount} log${logCount !== 1 ? "s" : ""}`; }
}

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

function mockPostRegistration(payload, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("500 Internal Server Error – Registration service unavailable."));
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
    return { fullName: fullname.value.trim() || "Not provided", email: email.value.trim() || "Not provided", eventType: eventType.value || "Not provided", feedback: feedback.value.trim() || "Not provided" };
}

function showPostSpinner(text = "Sending data to server...") {
    document.querySelector("#postSpinnerText").textContent = text;
    document.querySelector("#postSpinner").classList.remove("hidden");
    document.querySelector("#postResult").innerHTML = "";
    document.querySelector("#ajaxPreviewWrapper").classList.add("hidden");
}
function hidePostSpinner() { document.querySelector("#postSpinner").classList.add("hidden"); }

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
        .then(data => { hideSpinner(); processFetchedEvents(data); displayFetchSuccess("Fetched via .then()/.catch()", data); })
        .catch(err  => { hideSpinner(); displayFetchError(err.message); });
}

async function fetchEventsWithAsyncAwait() {
    showSpinner();
    try {
        const data = await mockFetchEvents();
        hideSpinner(); processFetchedEvents(data); displayFetchSuccess("Fetched via Async/Await", data);
    } catch (err) { hideSpinner(); displayFetchError(err.message); }
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
    document.querySelector("#postResult").innerHTML = `<div class="post-error"><span>&#10005; POST Failed</span><p>${err.message}</p></div>`;
    document.querySelector("#ajaxPreviewWrapper").classList.remove("hidden");
    document.querySelector("#responsePreview").textContent = `Error: ${err.message}`;
}

function postRegistrationThenCatch(shouldFail = false) {
    const payload = collectFormPayload();
    console.log("POST Request Payload:", payload);
    debugLog("group", "📤 fetch() POST — .then()/.catch() — Request Details");
    debugLog("log",   "Step 1: Payload collected from form.elements →", payload);
    debugLog("log",   "Step 2: Calling mockPostRegistration(payload, shouldFail=" + shouldFail + ")");
    debugLog("log",   "Step 3: setTimeout() will simulate ~2s network delay...");
    console.groupEnd();
    showPostSpinner("Sending via .then()/.catch() — please wait...");
    renderRequestPreview(payload);
    mockPostRegistration(payload, shouldFail)
        .then(response => {
            console.log("Server Response:", response);
            debugLog("log", "Step 4: .then() resolved → response received →", response);
            renderResponseSuccess(response);
        })
        .catch(err => {
            console.error("POST Error:", err);
            debugLog("error", "Step 4: .catch() triggered → Error →", err.message);
            renderResponseError(err);
        });
}

async function postRegistrationAsyncAwait(shouldFail = false) {
    const payload = collectFormPayload();
    console.log("POST Request Payload:", payload);
    debugLog("group", "📤 fetch() POST — Async/Await — Request Details");
    debugLog("log",   "Step 1: Payload →", payload);
    debugLog("log",   "Step 2: await mockPostRegistration() — pausing for response...");
    console.groupEnd();
    showPostSpinner("Sending via Async/Await — please wait...");
    renderRequestPreview(payload);

    try {
        const response = await mockPostRegistration(payload, shouldFail);
        console.log("Server Response:", response);
        debugLog("log", "Step 3: await resolved → response →", response);
        renderResponseSuccess(response);
    } catch (err) {
        console.error("POST Error:", err);
        debugLog("error", "Step 3: catch block triggered → Error →", err.message);
        renderResponseError(err);
    }
}

function logEventsTable() {
    debugLog("group", "📋 console.table(events) — All registered events:");
    debugLog("table", events.map(({ name, date, seats, category }) => ({ name, date, seats, category })));

    const panel = document.querySelector("#debugConsole");
    const tableDiv = document.createElement("div");
    tableDiv.classList.add("debug-table-wrapper");
    let html = `<table class="debug-table"><thead><tr><th>Name</th><th>Date</th><th>Category</th><th>Seats</th></tr></thead><tbody>`;
    events.forEach(ev => {
        html += `<tr><td>${ev.name}</td><td>${ev.date}</td><td>${ev.category}</td><td>${ev.seats}</td></tr>`;
    });
    html += `</tbody></table>`;
    tableDiv.innerHTML = html;
    panel.appendChild(tableDiv);
    panel.scrollTop = panel.scrollHeight;
    console.groupEnd();
}

function logEventObject() {
    const ev = events[0];
    debugLog("group", "🔍 Inspecting Event Object: " + ev.name);
    Object.entries(ev).forEach(([key, val]) => {
        debugLog("log", `  event.${key} =`, val);
    });
    debugLog("log", "  event.checkAvailability() →", ev.checkAvailability());
    console.groupEnd();
}

function logSeatCounts() {
    debugLog("group", "💺 Seat Count Check — All Events");
    events.forEach(ev => {
        if (ev.seats === 0) {
            debugLog("warn", `⚠ [${ev.name}] is FULLY BOOKED (seats = ${ev.seats})`);
        } else {
            debugLog("log", `✓ [${ev.name}] — Available seats: ${ev.seats}`);
        }
    });
    console.groupEnd();
}

function triggerWarn() {
    debugLog("warn", "⚠ Warning: User attempted to register without selecting an event. Validate inputs before submitting.");
    debugLog("warn", "⚠ Warning: Seat count is running low for Music Festival (< 5 remaining). Consider reopening registrations.");
}

function triggerError() {
    debugLog("error", "✖ Error: fetch() failed — Network unreachable. Check CORS policy or server status.");
    debugLog("error", "✖ Error: form.elements['fullname'] returned undefined — verify input name attribute is set correctly.");
}

function runBuggyRegistration() {
    debugLog("group", "🐛 BUGGY Registration — Silent Failure Demo");
    debugLog("log", "Step 1: Looking up 'Music Festival' in events array...");

    const ev = events.find(e => e.name === "Music Festival");
    debugLog("log", "Step 2: Found event →", ev);
    debugLog("warn", "Step 3: Checking ev.seat (TYPO!) →", ev.seat);
    if (ev.seat > 0) {
        ev.seat--;
        debugLog("log", "Step 4: Decremented ev.seat (never reached!)");
    } else {
        debugLog("warn", "Step 4: Condition (ev.seat > 0) is FALSE because ev.seat is UNDEFINED → seat not decremented!");
        debugLog("error", "✖ Silent Bug: Registration appeared to succeed but seats were NOT decremented. ev.seats still =", ev.seats);
    }
    console.groupEnd();
}

function runFixedRegistration() {
    debugLog("group", "✅ FIXED Registration — Correct Property Name");
    debugLog("log", "Step 1: Looking up 'Music Festival'...");

    const ev = events.find(e => e.name === "Music Festival");
    debugLog("log", "Step 2: event object →", ev);
    debugLog("log", "Step 3: Checking ev.seats (CORRECT) →", ev.seats);
    if (ev.seats > 0) {
        ev.seats--;
        displayEvents();
        refreshCards();
        debugLog("log", "Step 4: ev.seats decremented → new value =", ev.seats);
        debugLog("log", "✓ Fix confirmed: ev.seats updated correctly. No silent failure.");
    } else {
        debugLog("warn", "No seats left for Music Festival.");
    }
    console.groupEnd();
}

function logFetchPayload() {
    const payload = collectFormPayload();
    debugLog("group", "📦 Fetch Payload Inspector — What would be sent to the server:");
    debugLog("log", "  Method  : POST");
    debugLog("log", "  URL     : https://mock-api.cityportal.com/register");
    debugLog("log", "  Headers : Content-Type: application/json");
    debugLog("log", "  Body (JSON) →", payload);
    debugLog("info", "ℹ Tip: In Chrome DevTools → Network tab → click the request → Payload sub-tab to see this live.");
    console.groupEnd();
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
    debugLog("group", "📋 Form Submission — Validation Steps");
    debugLog("log", "Step 1: Capturing inputs via form.elements...");
    debugLog("log", "  fullname →", name   || "(empty)");
    debugLog("log", "  email    →", email  || "(empty)");
    debugLog("log", "  eventType→", eventVal || "(not selected)");
    debugLog("log", "  feedback →", feedback || "(empty)");

    if (!name)              { showFieldError("regName",     "nameError",     "Full name is required.");          isValid = false; }
    else if (name.length < 3) { showFieldError("regName",   "nameError",     "Min 3 characters required.");      isValid = false; }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email)             { showFieldError("regEmail",    "emailError",    "Email address is required.");      isValid = false; }
    else if (!emailRx.test(email)) { showFieldError("regEmail","emailError", "Invalid email format.");          isValid = false; }

    if (!eventVal)          { showFieldError("regEvent",    "eventError",    "Please select an event.");         isValid = false; }
    if (!feedback)          { showFieldError("regFeedback", "feedbackError", "Feedback is required.");           isValid = false; }

    debugLog("log", "Step 2: Validation result → isValid =", isValid);
    if (!isValid) { debugLog("warn", "⚠ Validation failed — form not submitted. Check highlighted fields."); }
    console.groupEnd();
    return { isValid, name, email, eventVal, feedback };
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form Submit Started");
    debugLog("log", "📝 form#registrationForm — submit event fired. e.preventDefault() called — page will NOT reload.");

    const form = document.querySelector("#registrationForm");
    clearErrors();
    const { isValid, name, email, eventVal } = validateForm(form);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Event:", eventVal);
    console.log("Validation Result:", isValid);
    if (!isValid) { return; }

    debugLog("log", "Step 3: Validation passed — proceeding with registration...");

    const matched = events.find(ev => ev.name === eventVal);
    if (matched && matched.seats > 0) {
        matched.seats--;
        debugLog("log", `Step 4: Decremented seat for '${eventVal}' → remaining seats =`, matched.seats);
        displayEvents();
        refreshCards();
    }

    const successDiv = document.querySelector("#registrationSuccess");
    document.querySelector("#successMessage").innerHTML =
        `Thank you, <strong>${name}</strong>! You registered for <strong>${eventVal}</strong>.`;
    successDiv.classList.remove("hidden");
    debugLog("log", "Step 5: ✅ Registration complete — success banner displayed.");
    form.reset();
}

function savePreferences() {
    const name = document.querySelector("#userName").value;
    const pref = document.querySelector("#preferredEvent").value;
    localStorage.setItem("userName", name);
    localStorage.setItem("preferredEvent", pref);
    document.querySelector("#preferenceResult").innerHTML = `Saved! Welcome, <strong>${name}</strong>. Preferred Event: <strong>${pref}</strong>`;
}

function loadPreferences() {
    const name = localStorage.getItem("userName");
    const pref = localStorage.getItem("preferredEvent");
    if (name) { document.querySelector("#userName").value = name; }
    if (pref) { document.querySelector("#preferredEvent").value = pref; }
    if (name || pref) {
        document.querySelector("#preferenceResult").innerHTML =
            `Welcome back, <strong>${name || "Guest"}</strong>! Saved event: <strong>${pref || "None"}</strong>`;
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
    events.forEach(ev => { html += `<p><b>${ev.name}</b><br>Category: ${ev.category}<br>Seats: ${ev.seats}</p>`; });
    document.querySelector("#eventList").innerHTML = html;
}

function addEvent(name, date, seats = 30, category = "Music") {
    events.push(new Event(name, date, seats, category));
    displayEvents();
    refreshCards();
}

function registerUser(name) {
    const ev = events.find(e => e.name === name);
    if (ev && ev.seats > 0) { ev.seats--; displayEvents(); refreshCards(); return true; }
    return false;
}

function registrationCounter() { let total = 0; return () => ++total; }
const trackRegistration = registrationCounter();

function showObjectEntries() {
    let html = "<h3>Object Keys and Values</h3>";
    events.forEach(ev => { html += "<hr>"; Object.entries(ev).forEach(([k,v]) => { html += `<p><b>${k}</b> : ${v}</p>`; }); });
    document.querySelector("#managementOutput").innerHTML = html;
}

function showFormattedEvents() {
    const formatted = events.map(ev => `Workshop on ${ev.name}`);
    let html = "<h3>Formatted Events</h3>";
    formatted.forEach(item => { html += `<p>${item}</p>`; });
    document.querySelector("#managementOutput").innerHTML = html;
}

function createEventCards(eventsToRender = events) {
    const container = $("#domContainer");
    container.empty();
    eventsToRender.forEach(function(event) {
        const { name, date, seats, category, maxSeats } = event;
        
        const card = $('<div>').addClass('dynamic-card').css('display', 'none');
        
        const heading = $('<h3>').text(name);
        const details = $('<p>').html(`<strong>Date:</strong> ${date}<br><strong>Category:</strong> ${category}<br><strong>Seats:</strong> <span class="seat-badge ${seats > 0 ? 'available' : 'booked'}">${seats}</span>`);
        
        const avail = $('<p>').addClass('availability-status').text(event.checkAvailability())
                              .css({ 'color': seats > 0 ? '#16a34a' : '#dc2626', 'font-weight': 'bold' });
        
        const btnGroup = $('<div>').addClass('card-btn-group');
        
        const regBtn = $('<button>').addClass('btn-card-register').text('Register')
            .click(function() {
                if (event.seats > 0) {
                    event.seats--;
                    displayEvents();
                    $('.dynamic-card').fadeOut(300, function() {
                        if ($(this).is(':last-child') || $('.dynamic-card').length === 1) {
                            refreshCards();
                        }
                    });
                    if ($('.dynamic-card').length === 0) { refreshCards(); }
                    
                    alert(`Registered for ${name}!`);
                } else {
                    alert(`${name} is fully booked.`);
                }
            });
        
        const cancelBtn = $('<button>').addClass('btn-card-cancel').text('Cancel')
            .click(function() {
                if (event.seats < maxSeats) {
                    event.seats++;
                    displayEvents();
                    $('.dynamic-card').fadeOut(300, function() {
                        if ($(this).is(':last-child') || $('.dynamic-card').length === 1) {
                            refreshCards();
                        }
                    });
                    if ($('.dynamic-card').length === 0) { refreshCards(); }
                    
                    alert(`Cancelled registration for ${name}.`);
                } else {
                    alert(`No registrations to cancel.`);
                }
            });
        btnGroup.append(regBtn).append(cancelBtn);
        card.append(heading).append(details).append(avail).append(btnGroup);
        container.append(card);
        card.fadeIn(500);
    });
}

function refreshCards() {
    const cat    = $('#categoryFilter').val();
    const search = $('#searchEvent').val().toLowerCase();
    let   list   = [...events];
    if (cat !== "All") { list = list.filter(e => e.category === cat); }
    if (search)        { list = list.filter(e => e.name.toLowerCase().includes(search)); }

    const currentCards = $('.dynamic-card');
    if (currentCards.length > 0) {
        currentCards.stop(true, true).fadeOut(300, function() {
            if ($(this).is(':last-child') || currentCards.length === 1) {
                createEventCards(list);
            }
        });
    } else {
        createEventCards(list);
    }
}

function displayFilteredEvents(category) {
    const filtered = category === "All" ? [...events] : [...events].filter(e => e.category === category);
    let html = "<h3>Filtered Events</h3>";
    filtered.forEach(ev => { html += `<p>${ev.name}<br>Category: ${ev.category}</p>`; });
    document.querySelector("#eventSearchResult").innerHTML = html;
    
    if (containerHasCards()) {
        const kw = document.querySelector("#searchEvent").value.toLowerCase();
        refreshCards();
    }
}

function containerHasCards() {
    return document.querySelector("#domContainer").innerHTML !== "";
}

document.addEventListener("DOMContentLoaded", function () {
    $('#registerBtn').click(function () {
        if (availableSeats > 0) {
            availableSeats--;
            $('#seatCount').html(`Available Seats: ${availableSeats}`);
            alert("Registered successfully!");
        }
    });

    document.querySelector("#addEventBtn").onclick      = () => { addEvent("Sports Meet","2026-12-01"); alert("New Event Added"); };
    document.querySelector("#registerUserBtn").onclick  = () => { if (registerUser("Music Festival")) { alert("Registered. Count: " + trackRegistration()); } else { alert("No Seats Available"); } };
    document.querySelector("#filterEventBtn").onclick   = () => { const f=events.filter(e=>e.category==="Music"); let h="<h3>Music Events</h3>"; f.forEach(e=>{h+=`<p>${e.name}<br>Seats: ${e.seats}</p>`;}); document.querySelector("#managementOutput").innerHTML=h; };
    document.querySelector("#objectEntriesBtn").onclick = showObjectEntries;
    document.querySelector("#mapEventBtn").onclick      = showFormattedEvents;
    document.querySelector("#domEventBtn").onclick      = () => createEventCards();
    document.querySelector("#timerAlertBtn").onclick    = showMessage;
    
    document.querySelector("#fetchThenCatchBtn").onclick = fetchEventsWithPromises;
    document.querySelector("#fetchAsyncAwaitBtn").onclick = fetchEventsWithAsyncAwait;
    document.querySelector("#postThenCatchBtn").onclick  = () => postRegistrationThenCatch(false);
    document.querySelector("#postAsyncAwaitBtn").onclick = () => postRegistrationAsyncAwait(false);
    document.querySelector("#postFailBtn").onclick       = () => postRegistrationThenCatch(true);
    document.querySelector("#savePrefBtn").onclick       = savePreferences;
    document.querySelector("#clearPrefBtn").onclick      = clearPreferences;
    
    document.querySelector("#categoryFilter").onchange = function () { displayFilteredEvents(this.value); };
    
    document.querySelector("#searchEvent").onkeydown   = function () {
        setTimeout(() => {
            const kw     = this.value.toLowerCase();
            const result = [...events].filter(ev => ev.name.toLowerCase().includes(kw));
            let html = "<h3>Search Result</h3>";
            result.forEach(ev => { html += `<p>${ev.name}</p>`; });
            document.querySelector("#eventSearchResult").innerHTML = html;
            if (containerHasCards()) {
                refreshCards();
            }
        }, 0);
    };

    document.querySelector("#registrationForm").addEventListener("submit", handleFormSubmit);
    
    document.querySelector("#logEventsTableBtn").addEventListener("click", logEventsTable);
    document.querySelector("#logEventObjectBtn").addEventListener("click", logEventObject);
    document.querySelector("#logSeatCountBtn").addEventListener("click",   logSeatCounts);
    document.querySelector("#triggerWarnBtn").addEventListener("click",    triggerWarn);
    document.querySelector("#triggerErrorBtn").addEventListener("click",   triggerError);
    document.querySelector("#triggerBugBtn").addEventListener("click",     runBuggyRegistration);
    document.querySelector("#fixBugBtn").addEventListener("click",         runFixedRegistration);
    document.querySelector("#logFetchPayloadBtn").addEventListener("click", logFetchPayload);
    document.querySelector("#clearDebugBtn").addEventListener("click", function () {
        const panel = document.querySelector("#debugConsole");
        panel.innerHTML = `<p class="debug-placeholder">Debug output will appear here when you click the buttons above or submit the registration form...</p>`;
        logCount = 0;
        document.querySelector("#logBadge").textContent = "0 logs";
    });
});

window.onload = function () {
    alert("Welcome to the Community Portal. Page loaded successfully!");
    showEventInfo();
    displayEvents();
    updateClock();
    loadPreferences();
    console.group("🚀 Portal Initialised — Task 14 Debug Mode");
    console.log("events array loaded →", events);
    console.log("localStorage →", { userName: localStorage.getItem("userName"), preferredEvent: localStorage.getItem("preferredEvent") });
    console.groupEnd();
};
// Registering The Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed");
        console.log(error);
    });
}


function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.display = (sidebar.style.display == "block") ? "none" : "block";

    displayFriendList();
}


/* EVENTS */

function deleteEvent(key, eventType) {
    if (confirm("Are you sure you want to delete this event?")) {
        var eventList = JSON.parse(localStorage.getItem("events"));
        eventList.splice(key, 1);
        localStorage.setItem("events", JSON.stringify(eventList));

        displayEventList(eventType);
    } 
    
}

function saveEvent() {
    if (localStorage.getItem("events") == null) {
        var eventList = [];
        localStorage.setItem("events", JSON.stringify(eventList));
    }

    var nameValue = document.getElementById("nameValue").value;
    var repeatingValue = document.getElementById("repeatingValue").checked;
    var eventType = "";
    var timeValue = document.getElementById("timeValue").value;
    var dateValue = document.getElementById("dateValue").value;
    var localDateFormat = new Date(dateValue).toLocaleDateString("en-AU"); // Converts to local date format


    // Checks if the event has happened yet
    if (new Date() < new Date(dateValue)) {
        eventType = "upcoming";
    } else {
        eventType = "finished";
    }
    if (repeatingValue == true) {
        eventType = "repeating";
    }

    // Creating an object that holds the event data
    var data = {"name" : nameValue, "date" : localDateFormat, "rawDate": dateValue, "time": timeValue, "type": eventType, "repeating": repeatingValue};
    
    // Getting the list (array techincally whatever) of events from local storage
    tempList = JSON.parse(localStorage.getItem("events"));
    

    // Ill use this for error detection later

    // for(var i=0; i < tempList.length; i++) {
    //     var eventData = JSON.parse(tempList[i]); // Parsing the stringified event OBJ to be referenced

    //     if (eventData.name == nameValue) {
    //         tempList[i] = JSON.stringify(data);

    //         // Adding event data to local storage
    //         localStorage.setItem("events", JSON.stringify(tempList));

    //         toggleEditEventPage();
    //         displayEventList(eventType);
            
    //         return;
    //     }
    // }

    tempList.push(JSON.stringify(data)); 

    // Adding event data to local storage
    localStorage.setItem("events", JSON.stringify(tempList));

    toggleEditEventPage();
    displayEventList(eventType);

    // alert("You Added An Event!");
}

function addEventPage() {
    toggleEditEventPage();

    // Switching Buttons in the event edit page
    document.getElementById("event-edit-button").innerHTML = "Add Event";
    document.getElementById("event-edit-button").onclick = function() {saveEvent()};

    document.getElementById("nameValue").value = null;
    document.getElementById("dateValue").value = null;
    document.getElementById("timeValue").value = null;
    document.getElementById("repeatingValue").checked = null;
}

function editEventPage(key) {
    toggleEditEventPage();
    
    // Switching Buttons in the event edit page
    document.getElementById("event-edit-button").innerHTML = "Edit Event";
    document.getElementById("event-edit-button").onclick = function() {editEvent(key)};
    
    var eventList = JSON.parse(localStorage.getItem("events"));
    var eventData = JSON.parse(eventList[key]);

    document.getElementById("nameValue").value = eventData.name;
    document.getElementById("dateValue").value = eventData.rawDate;
    document.getElementById("timeValue").value = eventData.time;
    document.getElementById("repeatingValue").checked = eventData.repeating;
}

function editEvent(key) {
    var nameValue = document.getElementById("nameValue").value;
    var repeatingValue = document.getElementById("repeatingValue").checked;
    var eventType = "";
    var timeValue = document.getElementById("timeValue").value;
    var dateValue = document.getElementById("dateValue").value;
    var localDateFormat = new Date(dateValue).toLocaleDateString("en-AU"); // Converts to local date format

    // Checks if the event has happened yet
    if (new Date() < new Date(dateValue)) {
        eventType = "upcoming";
    } else {
        eventType = "finished";
    }
    if (repeatingValue == true) {
        eventType = "repeating";
    }

    // Creating an object that holds the event data
    var data = {"name" : nameValue, "date" : localDateFormat, "rawDate": dateValue, "time": timeValue, "type": eventType, "repeating": repeatingValue};

    // Getting the list (array techincally whatever) of events from local storage
    tempList = JSON.parse(localStorage.getItem("events"));
    tempList.splice(key, 1, JSON.stringify(data)); // Replacing the existing data in the event list with the new values

    // Adding event data to local storage
    localStorage.setItem("events", JSON.stringify(tempList));

    toggleEditEventPage();
    displayEventList(eventType);
}


// Switches what is shown on screen
function toggleEditEventPage() {
    // Switching Pages
    var eventEditSection = document.getElementById("event-edit-section");
    var eventDisplaySection = document.getElementById("event-display-section");

    eventEditSection.style.display = (eventEditSection.style.display == "flex") ? "none" : "flex";
    eventDisplaySection.style.display = (eventDisplaySection.style.display == "none") ? "flex" : "none";

    if (eventEditSection.style.display == "flex") {
        document.getElementById("add-event").innerHTML = "Cancel"
    } else {
        document.getElementById("add-event").innerHTML = "Add Event"
        displayEventList("upcoming");
    }
}


function displayEventList(eventType) {
    if (eventType == "upcoming") {
        setEventHeaderColours("rgb(78, 78, 78)", "rgb(180, 180, 180)", "rgb(180, 180, 180)");
        setEventHeaderTextColours("rgb(212, 140, 57)", "black", "black");

    } else if (eventType == "repeating") {
        setEventHeaderColours("rgb(180, 180, 180)", "rgb(78, 78, 78)", "rgb(180, 180, 180)");
        setEventHeaderTextColours("black", "rgb(212, 140, 57)", "black");

    } else {
        setEventHeaderColours("rgb(180, 180, 180)", "rgb(180, 180, 180)", "rgb(78, 78, 78)");
        setEventHeaderTextColours("black", "black", "rgb(212, 140, 57)");
    }

    if (localStorage.getItem("events") != null) {
        // Clears the event-list element in the html
        document.getElementById("event-list").innerHTML = "";

        var eventList = JSON.parse(localStorage.getItem("events"));
    
        for(var i = 0; i < eventList.length; i++) {
            var outStr = "";
            var eventData = JSON.parse(eventList[i]);
            
            if (eventData.type == eventType) {
                outStr += "<li><div>";
                outStr += "<p class=\"event-name\">" + eventData.name + "</p>";
                outStr += "<button class=\"event-edit-button\" onclick=\"editEventPage('" + i + "')\">Edit</button>";
                outStr += "<button class=\"event-delete-button\" onclick=\"deleteEvent('" + i + "','" + eventData.type + "')\">Delete</button>";
                outStr += "</div><span class=\"Hdivider\"></span><div>";
                outStr += "<p class=\"event-date\">" + eventData.date + "</p>";
                outStr += "<p class=\"event-time\">" + eventData.time + "</p>";
                outStr += "</div></li>";
                
                document.getElementById("event-list").innerHTML += outStr;
            }
        }
    }
}


function setEventHeaderColours(upcoming, repeating, finished) {
    document.getElementById("upcoming").style.backgroundColor = upcoming;
    document.getElementById("repeating").style.backgroundColor = repeating;
    document.getElementById("finished").style.backgroundColor = finished;
}
function setEventHeaderTextColours(upcoming, repeating, finished) {
    document.getElementById("upcoming").style.color = upcoming;
    document.getElementById("repeating").style.color = repeating;
    document.getElementById("finished").style.color = finished;
}





/* FRIENDS */

function deleteFriend(key) {
    if (confirm("Are you sure you want to delete this friend?")) {
        var friendList = JSON.parse(localStorage.getItem("friends"));
        friendList.splice(key, 1);
        localStorage.setItem("friends", JSON.stringify(friendList));

        displayFriendList();
    }
}

function saveFriend() {
    if (localStorage.getItem("friends") == null) {
        var friendList = [];
        localStorage.setItem("friends", JSON.stringify(friendList));
    }

    var nameValue = document.getElementById("friendNameValue").value;
    var addressValue = document.getElementById("friendAddressValue").value;
    var emailValue = document.getElementById("friendEmailValue").value;

    // Creating an object that holds the event data
    var data = {"name" : nameValue, "address" : addressValue, "email": emailValue};
    
    tempList = JSON.parse(localStorage.getItem("friends"));
    tempList.push(JSON.stringify(data));

    // Adding friend data to local storage
    localStorage.setItem("friends", JSON.stringify(tempList));

    toggleEditFriendPage();
}

function addFriendPage() {
    toggleEditFriendPage();

    // Switching Buttons in the friend edit page
    document.getElementById("friend-edit-button").innerHTML = "Add Friend";
    document.getElementById("friend-edit-button").onclick = function() {saveFriend()};

    document.getElementById("friendNameValue").value = null;
    document.getElementById("friendAddressValue").value = null;
    document.getElementById("friendEmailValue").value = null;
}

function editFriendPage(key) {
    toggleEditFriendPage();

    // Switching Buttons in the friend edit page
    document.getElementById("friend-edit-button").innerHTML = "Edit Friend";
    document.getElementById("friend-edit-button").onclick = function() {editFriend(key)};
    
    var friendList = JSON.parse(localStorage.getItem("friends"));
    var friendData = JSON.parse(friendList[key]);

    document.getElementById("friendNameValue").value = friendData.name;
    document.getElementById("friendAddressValue").value = friendData.address;
    document.getElementById("friendEmailValue").value = friendData.email;
}

function editFriend(key) {
    var nameValue = document.getElementById("friendNameValue").value;
    var addressValue = document.getElementById("friendAddressValue").value;
    var emailValue = document.getElementById("friendEmailValue").value;

    // Creating an object that holds the event data
    var data = {"name" : nameValue, "address" : addressValue, "email": emailValue};
    tempList = JSON.parse(localStorage.getItem("friends"));
    tempList.splice(key, 1, JSON.stringify(data)); // Replacing the existing data in the friend list with the new values

    // Adding friend data to local storage
    localStorage.setItem("friends", JSON.stringify(tempList));

    toggleEditFriendPage();
}

// Switches what is shown on screen
function toggleEditFriendPage() {
    var friendEditSection = document.getElementById("friend-edit-section");
    var friendDisplaySection = document.getElementById("friend-display-section");

    friendEditSection.style.display = (friendEditSection.style.display == "flex") ? "none" : "flex";
    friendDisplaySection.style.display = (friendDisplaySection.style.display == "none") ? "block" : "none";

    if (friendEditSection.style.display == "none") {
        displayFriendList();
    }
}


function displayFriendList() {
    if (localStorage.getItem("friends") != null) {
        // Clears the friend-list element in the html
        document.getElementById("friend-list").innerHTML = "";

        var friendList = JSON.parse(localStorage.getItem("friends"));
    
        for(var i = 0; i < friendList.length; i++) {
            var outStr = "";
            var friendData = JSON.parse(friendList[i]);
            
            outStr += "<li><div>";
            outStr += "<p class=\"friend-name\">" + friendData.name + "</p>";
            outStr += "</div><span>";
            outStr += "<button class=\"friend-edit-button\" onclick=\"editFriendPage('" + i + "')\">Edit</button>";
            outStr += "<button class=\"friend-delete-button\" onclick=\"deleteFriend('" + i + "')\">Delete</button>";
            outStr += "</span></li>";
            
            document.getElementById("friend-list").innerHTML += outStr;
        }
    }
}
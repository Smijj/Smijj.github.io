// Registering The Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered");
        // console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed");
        console.log(error);
    });
}


function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.style.display = (sidebar.style.display == "block") ? "none" : "block";

    loadFriendList();
}


/* EVENTS */

// Data Manipulation Functions

function deleteEvent(key, eventType) {
    if (confirm("Are you sure you want to delete this event?")) {
        var eventList = JSON.parse(localStorage.getItem("events"));
        eventList.splice(key, 1);
        localStorage.setItem("events", JSON.stringify(eventList));

        loadEventList(eventType);
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
    

    // Ill use this for error detection later (maybe(if i have time(i probbaly wont(nope i didnt))))

    // for(var i=0; i < tempList.length; i++) {
    //     var eventData = JSON.parse(tempList[i]); // Parsing the stringified event OBJ to be referenced

    //     if (eventData.name == nameValue) {
    //         tempList[i] = JSON.stringify(data);

    //         // Adding event data to local storage
    //         localStorage.setItem("events", JSON.stringify(tempList));
    //    
    //         loadEventListPage();
    //         loadEventList(eventType);
    //         return;
    //     }
    // }

    tempList.push(JSON.stringify(data)); 

    // Adding event data to local storage
    localStorage.setItem("events", JSON.stringify(tempList));

    loadEventListPage();
    loadEventList(eventType);
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

    loadEventListPage();
    loadEventList(eventType);
}


// Data Displaying Functions

function addEventPage() {
    loadEventEditPage();

    document.getElementById("edit-event-header").innerHTML = "Add Event";
    document.getElementById("edit-event-header").style.display = "block";

    // Switching Buttons in the event edit page
    document.getElementById("event-edit-button").innerHTML = "Add Event";
    document.getElementById("event-edit-button").onclick = function() {saveEvent()};

    document.getElementById("nameValue").value = null;
    document.getElementById("dateValue").value = null;
    document.getElementById("timeValue").value = null;
    document.getElementById("repeatingValue").checked = null;
}

function editEventPage(key) {
    loadEventEditPage();

    document.getElementById("edit-event-header").innerHTML = "Edit Event";
    document.getElementById("edit-event-header").style.display = "block";
    
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

function viewEventPage(key) {
    loadEventViewPage();
    
    // Setting the onclick functions for event view buttons
    document.getElementById("event-view-edit-button").onclick = function() {editEventPage(key)};
    document.getElementById("event-view-delete-button").onclick = function() {deleteEvent(key)};
    
    var eventList = JSON.parse(localStorage.getItem("events"));
    var eventData = JSON.parse(eventList[key]);

    document.getElementById("event-view-name").innerHTML = eventData.name;
    document.getElementById("event-view-date").innerHTML = eventData.date;
    document.getElementById("event-view-time").innerHTML = eventData.time;
    document.getElementById("event-view-repeating").innerHTML = eventData.repeating;
}


// Page Loading

function loadEventViewPage() {
    ChooseEventPage("flex", "none", "none")
}
function loadEventEditPage() {
    ChooseEventPage("none", "flex", "none")

    // Hiding Header Elements
    document.getElementById("add-event").style.display = "none";
    document.getElementById("event-search-bar").style.display = "none";
    document.getElementById("search-icon").style.display = "none";
}
function loadEventListPage() {
    ChooseEventPage("none", "none", "flex")

    // Showing Header Elements
    document.getElementById("add-event").style.display = "block";
    document.getElementById("event-search-bar").style.display = "block";
    document.getElementById("search-icon").style.display = "block";
}

function ChooseEventPage(view, edit, list) {
    // Switching Pages
    var eventViewSection = document.getElementById("event-view-section");
    var eventEditSection = document.getElementById("event-edit-section");
    var eventListSection = document.getElementById("event-list-section");

    document.getElementById("edit-event-header").style.display = "none";

    eventViewSection.style.display = view;
    eventEditSection.style.display = edit;
    eventListSection.style.display = list;
}

function loadEventList(eventType) {
    if (eventType == "upcoming") {
        setEventHeaderColours("rgb(78, 78, 78)", "rgb(180, 180, 180)", "rgb(180, 180, 180)");
        setEventHeaderTextColours("white", "black", "black");

    } else if (eventType == "repeating") {
        setEventHeaderColours("rgb(180, 180, 180)", "rgb(78, 78, 78)", "rgb(180, 180, 180)");
        setEventHeaderTextColours("black", "white", "black");

    } else {
        setEventHeaderColours("rgb(180, 180, 180)", "rgb(180, 180, 180)", "rgb(78, 78, 78)");
        setEventHeaderTextColours("black", "black", "white");
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
                outStr += "<p class=\"event-name\" onclick=\"viewEventPage('" + i + "')\">" + eventData.name + "</p>";
                outStr += "<button class=\"event-edit-button\" onclick=\"editEventPage('" + i + "')\">Edit</button>";
                outStr += "<button class=\"event-delete-button\" onclick=\"deleteEvent('" + i + "','" + eventData.type + "')\">Delete</button>";
                outStr += "</div><span class=\"Hdivider\"></span><div onclick=\"viewEventPage('" + i + "')\">";
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


function searchEvents() {
    alert("This Function is not implemented yet.")
}




/* FRIENDS */

// Data Manipulation Functions

function deleteFriend(key) {
    if (confirm("Are you sure you want to delete this friend?")) {
        var friendList = JSON.parse(localStorage.getItem("friends"));
        friendList.splice(key, 1);
        localStorage.setItem("friends", JSON.stringify(friendList));

        loadFriendList();
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

    loadFriendListPage();
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

    loadFriendListPage();
}


// Data Displaying Functions

function addFriendPage() {
    loadFriendEditPage();

    // Switching Buttons in the friend edit page
    document.getElementById("friend-edit-button").innerHTML = "Add Friend";
    document.getElementById("friend-edit-button").onclick = function() {saveFriend()};

    document.getElementById("friendNameValue").value = null;
    document.getElementById("friendAddressValue").value = null;
    document.getElementById("friendEmailValue").value = null;
}

function editFriendPage(key) {
    loadFriendEditPage();

    // Switching Buttons in the friend edit page
    document.getElementById("friend-edit-button").innerHTML = "Edit Friend";
    document.getElementById("friend-edit-button").onclick = function() {editFriend(key)};
    
    var friendList = JSON.parse(localStorage.getItem("friends"));
    var friendData = JSON.parse(friendList[key]);

    document.getElementById("friendNameValue").value = friendData.name;
    document.getElementById("friendAddressValue").value = friendData.address;
    document.getElementById("friendEmailValue").value = friendData.email;
}

function viewFriendPage(key) {
    loadFriendViewPage();
    
    // Setting the onclick functions for friend view buttons
    document.getElementById("friend-view-edit-button").onclick = function() {editFriendPage(key)};
    document.getElementById("friend-view-delete-button").onclick = function() {deleteFriend(key)};
    
    var friendList = JSON.parse(localStorage.getItem("friends"));
    var friendData = JSON.parse(friendList[key]);

    document.getElementById("friend-view-name").innerHTML = friendData.name;
    document.getElementById("friend-view-address").innerHTML = friendData.address;
    document.getElementById("friend-view-email").innerHTML = friendData.email;
}


// Page Loading

function loadFriendViewPage() {
    ChooseFriendPage("flex", "none", "none")
}
function loadFriendEditPage() {
    ChooseFriendPage("none", "flex", "none")
}
function loadFriendListPage() {
    ChooseFriendPage("none", "none", "block")
    loadFriendList();
}

function ChooseFriendPage(view, edit, list) {
    // Switching Pages
    var friendViewSection = document.getElementById("friend-view-section");
    var friendEditSection = document.getElementById("friend-edit-section");
    var friendListSection = document.getElementById("friend-list-section");

    friendViewSection.style.display = view;
    friendEditSection.style.display = edit;
    friendListSection.style.display = list;
}

function loadFriendList() {
    if (localStorage.getItem("friends") != null) {
        // Clears the friend-list element in the html
        document.getElementById("friend-list").innerHTML = "";

        var friendList = JSON.parse(localStorage.getItem("friends"));
    
        for(var i = 0; i < friendList.length; i++) {
            var outStr = "";
            var friendData = JSON.parse(friendList[i]);
            
            outStr += "<li><div onclick=\"viewFriendPage('" + i + "')\">";
            outStr += "<p class=\"friend-name\">" + friendData.name + "</p>";
            outStr += "</div><span>";
            outStr += "<button class=\"friend-edit-button\" onclick=\"editFriendPage('" + i + "')\">Edit</button>";
            outStr += "<button class=\"friend-delete-button\" onclick=\"deleteFriend('" + i + "')\">Delete</button>";
            outStr += "</span></li>";
            
            document.getElementById("friend-list").innerHTML += outStr;
        }
    }
}

function searchFriends() {
    alert("This Function is not implemented yet.")
}
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


function onLoad(eventType) {
    loadEventList('upcoming');
    resetFriendGoingStatus();
    localStorage.removeItem('temp_list'); // Removing the temp_list from local storage
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

        loadEventListPage();
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
    var friendsGoing = JSON.parse(localStorage.getItem('temp_list')); // gets a list of stringified dictionaries

    // If repeating what days are the event to repeat on?
    var mondayValue = document.getElementById("mondayValue").checked;
    var tuesdayValue = document.getElementById("tuesdayValue").checked;
    var wednesdayValue = document.getElementById("wednesdayValue").checked;
    var thursdayValue = document.getElementById("thursdayValue").checked;
    var fridayValue = document.getElementById("fridayValue").checked;
    var saturdayValue = document.getElementById("saturdayValue").checked;
    var sundayValue = document.getElementById("sundayValue").checked;
    var repeatingDays = {
        "monday": mondayValue, 
        "tuesday": tuesdayValue, 
        "wednesday": wednesdayValue, 
        "thursday": thursdayValue, 
        "friday": fridayValue, 
        "saturday": saturdayValue, 
        "sunday": sundayValue
    };

    // Checks if the event has happened yet
    if (new Date() < new Date(dateValue)) {
        eventType = "upcoming";
    } else {
        eventType = "finished";
    }
    if (repeatingValue == true) {
        eventType = "repeating";
    }

    // VALIDATION
    if (nameValue == null || nameValue == "") {
        return alert("Please Enter an Event Name...")
    }
    if (timeValue == null || timeValue == "") {
        return alert("Please Enter an Event Time...")
    }
    if (repeatingValue == false) {
        if (dateValue == null || dateValue == "") {
            return alert("Please Enter an Event Date...")
        }
    }
   

    // Creating an object that holds the event data
    var data = {
        "name" : nameValue, 
        "date" : localDateFormat, 
        "rawDate": dateValue, 
        "time": timeValue, 
        "type": eventType, 
        "repeating": repeatingValue, 
        "repeatingDays": repeatingDays, 
        "friendsGoing": friendsGoing
    };
    // Getting the list (array techincally whatever) of events from local storage
    var eventList = JSON.parse(localStorage.getItem("events"));
    eventList.push(JSON.stringify(data)); 

    // Adding event data to local storage
    localStorage.setItem("events", JSON.stringify(eventList));

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
    var friendsGoing = JSON.parse(localStorage.getItem('temp_list')); // gets a list of stringified dictionaries

    // If repeating what days are the event to repeat on?
    var mondayValue = document.getElementById("mondayValue").checked;
    var tuesdayValue = document.getElementById("tuesdayValue").checked;
    var wednesdayValue = document.getElementById("wednesdayValue").checked;
    var thursdayValue = document.getElementById("thursdayValue").checked;
    var fridayValue = document.getElementById("fridayValue").checked;
    var saturdayValue = document.getElementById("saturdayValue").checked;
    var sundayValue = document.getElementById("sundayValue").checked;
    var repeatingDays = {
        "monday": mondayValue, 
        "tuesday": tuesdayValue, 
        "wednesday": wednesdayValue, 
        "thursday": thursdayValue, 
        "friday": fridayValue, 
        "saturday": saturdayValue, 
        "sunday": sundayValue
    };

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
    var data = {
        "name" : nameValue, 
        "date" : localDateFormat, 
        "rawDate": dateValue, 
        "time": timeValue, 
        "type": eventType, 
        "repeating": repeatingValue, 
        "repeatingDays": repeatingDays, 
        "friendsGoing": friendsGoing};
    
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

    document.getElementById("nameValue").value = null;
    document.getElementById("dateValue").value = null;
    document.getElementById("timeValue").value = null;
    document.getElementById("repeatingValue").checked = null;

    // Switching Buttons in the event edit page
    document.getElementById("event-edit-button").innerHTML = "Add Event";
    document.getElementById("event-edit-button").onclick = function() {saveEvent()};
}

function editEventPage(key) {
    loadEventEditPage();

    var eventList = JSON.parse(localStorage.getItem("events"));
    var eventData = JSON.parse(eventList[key]);

    // Changes the title of the page to reflect the fact that it is the edit page.
    document.getElementById("edit-event-header").innerHTML = "Edit Event";
    document.getElementById("edit-event-header").style.display = "block";
    
    // Switching Buttons in the event edit page
    document.getElementById("event-edit-button").innerHTML = "Save Event";
    document.getElementById("event-edit-button").onclick = function() {editEvent(key)};

    // correctly loads the repeating days if the event is repeating
    if (eventData.repeating) {
        document.getElementById("repeating-event-toggle-date").style.display = "none";
        document.getElementById("repeating-event-toggle-weekdays").style.display = "flex";
    }

    document.getElementById("nameValue").value = eventData.name;
    document.getElementById("dateValue").value = eventData.rawDate;
    document.getElementById("timeValue").value = eventData.time;
    document.getElementById("repeatingValue").checked = eventData.repeating;
    // repeating days
    document.getElementById("mondayValue").checked = eventData.repeatingDays.monday;
    document.getElementById("tuesdayValue").checked = eventData.repeatingDays.tuesday;
    document.getElementById("wednesdayValue").checked = eventData.repeatingDays.wednesday;
    document.getElementById("thursdayValue").checked = eventData.repeatingDays.thursday;
    document.getElementById("fridayValue").checked = eventData.repeatingDays.friday;
    document.getElementById("saturdayValue").checked = eventData.repeatingDays.saturday;
    document.getElementById("sundayValue").checked = eventData.repeatingDays.sunday;

    localStorage.setItem("temp_list", JSON.stringify(eventData.friendsGoing));

    if (localStorage.getItem("temp_list") != null && localStorage.getItem("temp_list") != undefined) {
        // Getting the list of dictionaries containing the users friends info
        var friendList = JSON.parse(localStorage.getItem('friends'));
        for (var i = 0; i < eventData.friendsGoing.length; i++) {
            setGoingStatus(JSON.parse(eventData.friendsGoing[i]).friendKey, true, friendList);  
        }
    }

    loadFriendsGoingSection();
}


function viewEventPage(key) {
    loadEventViewPage();

    var eventList = JSON.parse(localStorage.getItem("events"));
    var eventData = JSON.parse(eventList[key]);
    var repeatingDaysString = "";
    if (eventData.repeatingDays.monday) {
        repeatingDaysString += "Mon  "
    }
    if (eventData.repeatingDays.tuesday) {
        repeatingDaysString += "Tue  "
    }
    if (eventData.repeatingDays.wednesday) {
        repeatingDaysString += "Wed  "
    }
    if (eventData.repeatingDays.thursday) {
        repeatingDaysString += "Thu  "
    }
    if (eventData.repeatingDays.friday) {
        repeatingDaysString += "Fri  "
    }
    if (eventData.repeatingDays.saturday) {
        repeatingDaysString += "Sat  "
    }
    if (eventData.repeatingDays.sunday) {
        repeatingDaysString += "Sun  "
    }
    
    // Setting the onclick functions for event view buttons
    document.getElementById("event-view-edit-button").onclick = function() {editEventPage(key)};
    document.getElementById("event-view-delete-button").onclick = function() {deleteEvent(key, eventData.type)};
    document.getElementById("event-view-name").innerHTML = eventData.name;
    if (eventData.repeating) {
        document.getElementById("event-view-repeatingdays").innerHTML = repeatingDaysString;
        document.getElementById("view-date").style.display = "none";
        document.getElementById("view-repeating-days").style.display = "flex";
    } else {
        document.getElementById("event-view-date").innerHTML = eventData.date;
        document.getElementById("view-date").style.display = "flex";
        document.getElementById("view-repeating-days").style.display = "none";
    }
    document.getElementById("event-view-time").innerHTML = eventData.time;
    document.getElementById("event-view-repeating").innerHTML = eventData.repeating;

    document.getElementById("view-friends-going").innerHTML = "";
    for (var i = 0; i < eventData.friendsGoing.length; i++) {
        var outStr = "";
        var friendData = JSON.parse(eventData.friendsGoing[i]);
        
        outStr += "<li>" + friendData.name + "</li>";
        
        document.getElementById("view-friends-going").innerHTML += outStr;
    }
}

// Repeating Events Stuff
function repeatingEventToggle(){
    var repeatingValue = document.getElementById("repeatingValue").checked;
    if (repeatingValue) {
        document.getElementById("repeating-event-toggle-date").style.display = "none";
        document.getElementById("repeating-event-toggle-weekdays").style.display = "flex";
    } else {
        document.getElementById("repeating-event-toggle-date").style.display = "flex";
        document.getElementById("repeating-event-toggle-weekdays").style.display = "none";
    }
}
function resetRepeatingToggle(){
    document.getElementById("repeating-event-toggle-date").style.display = "block";
    document.getElementById("repeating-event-toggle-weekdays").style.display = "none";
    document.getElementById("mondayValue").checked = false;
    document.getElementById("tuesdayValue").checked = false;
    document.getElementById("wednesdayValue").checked = false;
    document.getElementById("thursdayValue").checked = false;
    document.getElementById("fridayValue").checked = false;
    document.getElementById("saturdayValue").checked = false;
    document.getElementById("sundayValue").checked = false;
}






// Page Loading

function loadEventViewPage() {
    ChooseEventPage("flex", "none", "none")
}

function loadEventEditPage() {
    ChooseEventPage("none", "flex", "none")

    loadFriendsGoingSection();

    // Hiding Header Elements
    document.getElementById("add-event").style.display = "none";
    document.getElementById("event-search").style.display = "none";
}

function loadEventListPage() {
    ChooseEventPage("none", "none", "flex");

    resetRepeatingToggle(); // Reseting the repeading days in the add event section
    resetFriendGoingStatus(); // Reseting the 'going' variable in the friends dictionary to false
    localStorage.removeItem('temp_list'); // Removing the temp_list from local storage

    // Showing Header Elements
    document.getElementById("add-event").style.display = "block";
    document.getElementById("event-search").style.display = "block";
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
    var buttonBase = "#86BBD8";
    var buttonHighlight = "#d46b32";
    var buttonTextBase = "black";
    var buttonTextHighlight = "white";

    // Checks the value of the event search input
    var searchQuery = document.getElementById("event-search").value;
    // reloads the list on every keyup while typing in the search box
    document.getElementById("event-search").onkeyup = function() {loadEventList(eventType)};

    if (eventType == "upcoming") {
        setEventHeaderColours(buttonHighlight, buttonBase, buttonBase);
        setEventHeaderTextColours(buttonTextHighlight, buttonTextBase, buttonTextBase);

    } else if (eventType == "repeating") {
        setEventHeaderColours(buttonBase, buttonHighlight, buttonBase);
        setEventHeaderTextColours(buttonTextBase, buttonTextHighlight, buttonTextBase);

    } else {
        setEventHeaderColours(buttonBase, buttonBase, buttonHighlight);
        setEventHeaderTextColours(buttonTextBase, buttonTextBase, buttonTextHighlight);
    }

    if (localStorage.getItem("events") != null) {
        // Clears the event-list element in the html
        document.getElementById("event-list").innerHTML = "";

        var eventList = JSON.parse(localStorage.getItem("events"));
    
        for(var i = 0; i < eventList.length; i++) {
            var outStr = "";
            var eventData = JSON.parse(eventList[i]);

            // Checks if the event has happened yet
            if (new Date() > new Date(eventData.rawDate)) {
                if (eventData.type != "repeating"){
                    eventData.type = "finished";
                    eventList.splice(i, 1, JSON.stringify(eventData)); // Replacing the entry in the list
                    localStorage.setItem("events", JSON.stringify(eventList));
                } 
            }
 
            if (eventData.type == eventType) {
                // if the searchbar has nothing in it show lists like normal
                if (searchQuery == null || searchQuery == "") {
                    outStr += "<li><div>";
                    outStr += "<p class=\"event-name\" onclick=\"viewEventPage('" + i + "')\">" + eventData.name + "</p>";
                    outStr += "<button class=\"event-edit-button\" onclick=\"editEventPage('" + i + "')\">Edit</button>";
                    outStr += "<button class=\"event-delete-button\" onclick=\"deleteEvent('" + i + "','" + eventData.type + "')\">Delete</button>";
                    outStr += "</div><span class=\"Hdivider\"></span><div onclick=\"viewEventPage('" + i + "')\">";
                    if (eventData.repeating){
                        outStr += "<p class=\"event-date\">Repeating Event</p>";
                    } else {
                        outStr += "<p class=\"event-date\">" + eventData.date + "</p>";
                    }
                    outStr += "<p class=\"event-time\">" + eventData.time + "</p>";
                    outStr += "</div></li>";
                } else { // If the searchbar does have something in it, see if that something matches any event names and show them if it does.
                    if (searchQuery == eventData.name) {
                        outStr += "<li><div>";
                        outStr += "<p class=\"event-name\" onclick=\"viewEventPage('" + i + "')\">" + eventData.name + "</p>";
                        outStr += "<button class=\"event-edit-button\" onclick=\"editEventPage('" + i + "')\">Edit</button>";
                        outStr += "<button class=\"event-delete-button\" onclick=\"deleteEvent('" + i + "','" + eventData.type + "')\">Delete</button>";
                        outStr += "</div><span class=\"Hdivider\"></span><div onclick=\"viewEventPage('" + i + "')\">";
                        if (eventData.repeating){
                            outStr += "<p class=\"event-date\">Repeating Event</p>";
                        } else {
                            outStr += "<p class=\"event-date\">" + eventData.date + "</p>";
                        }
                        outStr += "<p class=\"event-time\">" + eventData.time + "</p>";
                        outStr += "</div></li>";
                    } 
                }
                // Adds the final out string to the inner html of the event list section
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










// Functions related to adding friends from the friends list to an event

function setGoingStatus(friendKey, status, friendList) {
    if (localStorage.getItem("friends") != null) {
        var friendData = JSON.parse(friendList[friendKey]);
        
        // Reseting the friend 'going' variable to false so it shows back up in the friend pool
        friendData.going = status;
        friendList.splice(friendKey, 1, JSON.stringify(friendData)); // Replacing the entry in the list
        localStorage.setItem("friends", JSON.stringify(friendList)); // uploading the updated list
    }
}

function resetFriendGoingStatus() {
    if (localStorage.getItem("friends") != null) {
        // Getting the list of dictionaries containing the users friends info
        var friendList = JSON.parse(localStorage.getItem('friends'));
        for (var i = 0; i < friendList.length; i++) {
            setGoingStatus(i, false, friendList);  
        }
    }
}

function removeFromFriendsGoing(tempListKey) {
    // Getting the list of dictionaries containing the users friends info
    var friendList = JSON.parse(localStorage.getItem('friends'));
    var tempList = JSON.parse(localStorage.getItem('temp_list'));
    
    setGoingStatus(JSON.parse(tempList[tempListKey]).friendKey, false, friendList);
    
    // Remove a friend item from temp storage
    tempList.splice(tempListKey, 1); 
    localStorage.setItem("temp_list", JSON.stringify(tempList));

    loadFriendsGoingSection();
}

function addToFriendsGoing(key) {
    if (localStorage.getItem("temp_list") == null || localStorage.getItem("temp_list") == undefined) {
        var temp_list = [];
        localStorage.setItem("temp_list", JSON.stringify(temp_list));
    }

    // Getting the list of dictionaries containing the users friends info
    var friendList = JSON.parse(localStorage.getItem('friends'));
    setGoingStatus(key, true, friendList);

    data = {"friendKey": key, "name": JSON.parse(friendList[key]).name}
    var tempList = JSON.parse(localStorage.getItem('temp_list'));
    tempList.push(JSON.stringify(data)); 
    localStorage.setItem("temp_list", JSON.stringify(tempList));

    loadFriendsGoingSection();
}

function loadFriendsGoingSection() {
    if (localStorage.getItem("friends") != null) {
        // Clears the list element in the html
        document.getElementById("add-event-friends-list").innerHTML = "";

        var friendList = JSON.parse(localStorage.getItem('friends'));
        for (var i = 0; i < friendList.length; i++) {
            var outStr = "";
            var friendData = JSON.parse(friendList[i]);
            
            if (!friendData.going) {
                outStr += "<li onclick=\"addToFriendsGoing(" + i + ")\">" + friendData.name + "</li>";
            }
            
            document.getElementById("add-event-friends-list").innerHTML += outStr;
        }
    }

    if (localStorage.getItem("temp_list") != null) {
        // Clears the list element in the html
        document.getElementById("add-event-friends-going").innerHTML = "";

        var tempList = JSON.parse(localStorage.getItem('temp_list'));
        for (var i = 0; i < tempList.length; i++) {
            var outStr = "";
            var friendData = JSON.parse(tempList[i]);
            
            var outStr = "<li onclick=\"removeFromFriendsGoing(" + i + ")\">" + friendData.name + "</li>"

            document.getElementById("add-event-friends-going").innerHTML += outStr;
        }
    } else {
        document.getElementById("add-event-friends-going").innerHTML = "";
    }
}






















/* FRIENDS */

// Data Manipulation Functions

function deleteFriend(key) {
    if (confirm("Are you sure you want to delete this friend?")) {
        var friendList = JSON.parse(localStorage.getItem("friends"));
        friendList.splice(key, 1);
        localStorage.setItem("friends", JSON.stringify(friendList));

        loadFriendListPage();
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

    // VALIDATION
    if (nameValue == null || nameValue == "") {
        return alert("Please Enter a Name...")
    }
    if (addressValue == null || addressValue == "") {
        addressValue = "N/A";
    }
    if (emailValue == null || emailValue == "") {
        emailValue = "N/A";
    }

    // Creating an object that holds the event data
    var data = {"name" : nameValue, "address" : addressValue, "email": emailValue, "going": false};
    
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
    document.getElementById("friend-edit-button").innerHTML = "Save Friend";
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

        var searchQuery = document.getElementById("friend-search").value;
        document.getElementById("friend-search").onkeyup = function() {loadFriendList()};    

        var friendList = JSON.parse(localStorage.getItem("friends"));
    
        for(var i = 0; i < friendList.length; i++) {
            var outStr = "";
            var friendData = JSON.parse(friendList[i]);

            if (searchQuery == null || searchQuery == "") {
                outStr += "<li><div onclick=\"viewFriendPage('" + i + "')\">";
                outStr += "<p class=\"friend-name\">" + friendData.name + "</p>";
                outStr += "</div><span>";
                outStr += "<button class=\"friend-edit-button\" onclick=\"editFriendPage('" + i + "')\">Edit</button>";
                outStr += "<button class=\"friend-delete-button\" onclick=\"deleteFriend('" + i + "')\">Delete</button>";
                outStr += "</span></li>";
            } else {
                if (searchQuery == friendData.name) {
                    outStr += "<li><div onclick=\"viewFriendPage('" + i + "')\">";
                    outStr += "<p class=\"friend-name\">" + friendData.name + "</p>";
                    outStr += "</div><span>";
                    outStr += "<button class=\"friend-edit-button\" onclick=\"editFriendPage('" + i + "')\">Edit</button>";
                    outStr += "<button class=\"friend-delete-button\" onclick=\"deleteFriend('" + i + "')\">Delete</button>";
                    outStr += "</span></li>";
                }
            }
            document.getElementById("friend-list").innerHTML += outStr;
        }
    }
}
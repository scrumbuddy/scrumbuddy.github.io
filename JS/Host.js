// JavaScript File
var startVote;
var myDatabase;
var roomID;
var continueSession;

$(document).ready(function() {
    startVote = false;
    myDatabase = firebase.database();
    continueSession = false;

    var hasSession = localStorage.getItem("session");
    if (hasSession == null || hasSession == "false")
    {
        // no session, redirect
        window.location.href = "../index.html";
    }

    // add this new room to the server DB
    var currentdate = new Date();
    
    if (currentdate.getMinutes() < 10)
    {
        var datetime = currentdate.getHours() + ":0" + currentdate.getMinutes();
    }
    else
    {
        var datetime = currentdate.getHours() + ":" + currentdate.getMinutes();
    }
    
    var roomsRef = myDatabase.ref("rooms");
    
    var newRoomData = {
        createdtime: datetime,
        host: localStorage.getItem("name"),
        users: { 
            name: "nullVal"
        }
    };

    var newRoom = roomsRef.push();
    
    localStorage.setItem("currentHostRoomID", newRoom.key);
    roomID = newRoom.key;
    newRoom.set(newRoomData);

    window.onbeforeunload = function(e) {
        // remove room if the user closes window
        // do NOT remove if window close is due to starting vote
        if (!startVote)
        {
            var roomRef = myDatabase.ref("rooms/" + roomID);
            roomRef.remove();
        }
        
        // end session if navigating away from ScrumBuddy
        if (!continueSession)
        {
            localStorage.setItem("session", "false");
        }
    };
    
    $(document).on("click", "#vote", function(data)
    {
        continueSession = true;
        StartVote();
    });
});

$(function() {
    var usersRef = myDatabase.ref('rooms/' + roomID + '/users');
    console.log("Current room: " + roomID);
    loadUsers(usersRef, roomID);
});

function StartVote() {
    // user is leaving page with the intention of voting
    startVote = true;
    window.location.href = "Result.html";
}

function appendUserRow(userList, userName) {
    var newRow = $("<div></div>");
    newRow.addClass("row");
             
    // add the row for the user
    var nameColumn = $("<h5></h5>");
    nameColumn.html(userName);

    userList.append(newRow);  
    newRow.append(nameColumn);
}

function loadUsers(usersRef) {
    var onlineUser = $("#user-list");
    var counter = 1;

    usersRef.on('value', function(snapshot) {
        
        onlineUser.html("");
            
        snapshot.forEach(function(data) {
            var userName = data.val().name;

            // add user name
            if (data.key != "name") {
                appendUserRow(onlineUser, userName);
                counter++;
            }
        })
    });
}

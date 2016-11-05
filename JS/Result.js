// JavaScript File
var myDatabase = firebase.database();
var roomID = localStorage.getItem("currentHostRoomID");
var usersRef = myDatabase.ref('rooms/' + roomID + '/users');
var myChart;

$(function() {
    var hasSession = localStorage.getItem("session");
    if (hasSession == null || hasSession == "false")
    {
         // no session, redirect
         window.location.href = "../index.html";
    }
    
   setTimeout(function() { 
       showUserVotes(usersRef) 
    }, 5000);
});

window.onbeforeunload = function(e) {
    var roomRef = myDatabase.ref("rooms/" + roomID);
    roomRef.remove();
    
    // end session
    localStorage.setItem("session", "false");
};

function endSession(){
    var roomRef = myDatabase.ref("rooms/" + roomID);

    roomRef.remove();
};

function displayVoteTable(mode, minPointNum, maxPointNum, minVoters, maxVoters, counter, missVoter) {
    var modePoint = $("#mode-point-row");
    var minPointRow = $("#least-point-row");
    var maxPointRow = $("#most-point-row");
    var minNameRow = $("#least-point-people-row");
    var maxNameRow = $("#most-point-people-row");
    var totalCountRow = $("#total-votes-row");
	var missNameRow = $("#miss-point-people-row");
	var modeString = "";

    for (i = 0; i < mode.length; i++) {
        if (i > 0) {
            modeString += ", ";
        }
        modeString += mode[i];
    }
        
    modePoint.text(modeString);
    minPointRow.text(minPointNum);
    maxPointRow.text(maxPointNum);
    minNameRow.text(minVoters);
    maxNameRow.text(maxVoters);
    totalCountRow.text(counter);
	missNameRow.text(missVoter);
};

function getPointFromIndex(index) {
    switch (index) {
        case 0:
            return 0.5;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return 5;
        case 5:
            return 8;
        case 6:
            return 13;
        case 7:
            return 20;
    }
};

function showUserVotes(usersRef) {

    usersRef.once('value', function(snapshot) {
        var counter = 0;
        var minPoint = 0;
        var maxPoint = 0;
        var pointNum = 0;
        var minVoter = "";
        var maxVoter = "";
		var missVoter = "Missed vote: ";
        var missCount = 0;
        var countArray = [0, 0, 0, 0, 0, 0, 0, 0];
        var modeArray = [];
        var mode = 0;

        $("#total-votes-row").html("");
        $("#mode-point-row").html("");
        $("#least-point-row").html("");
        $("#most-point-row").html("");
        $("#least-point-people-row").html("");
        $("#most-point-people-row").html("");
		$("#miss-point-people-row").html("");

        snapshot.forEach(function(data) {
            var userName = data.val().name;

            // Get point info from users.
            if (data.key != "name") {

                counter++;
                pointNum = Number.parseFloat(data.val().point);
				
				if (pointNum > 0){
					if (pointNum > minPoint) {
						if (pointNum > maxPoint) {
							if (minPoint == 0){
								minPoint = maxPoint;
								minVoter = maxVoter;  
							}
							maxPoint = data.val().point;
							maxVoter = userName;
						} else if (pointNum == maxPoint) {
							maxVoter += ", " + userName;
						} else if (minPoint == 0) {
							minPoint = pointNum;
							minVoter = userName;
						}
					} else if (pointNum == minPoint) {
						minVoter += ", " + userName;
					} else {
						minPoint = pointNum;
						minVoter = userName;
					}
				}else {
                    missCount++;
					
                    if (missCount > 1){
                        missVoter += ', ';
                    }    
                    missVoter += userName;
                }
				
                switch (pointNum) {
                    case 0.5:
                        countArray[0] += 1;
                        break;
                    case 1:
                        countArray[1] += 1;
                        break;
                    case 2:
                        countArray[2] += 1;
                        break;
                    case 3:
                        countArray[3] += 1;
                        break;
                    case 5:
                        countArray[4] += 1;
                        break;
                    case 8:
                        countArray[5] += 1;
                        break;
                    case 13:
                        countArray[6] += 1;
                        break;
                    case 20:
                        countArray[7] += 1;
                        break;
                }
            }
        });
        
        var maxCount = 0;
        for (i = 0; i < countArray.length; i++) {
            if (maxCount < countArray[i]) {
                maxCount = countArray[i];
            }
        }
        var modeIndex = 0;
        for (i = 0; i < countArray.length; i++) {
            if (maxCount == countArray[i] && countArray[i] > 0) {
                modeArray[modeIndex] = getPointFromIndex(i);
                modeIndex++;
            }
        }

        displayVoteTable(modeArray, minPoint, maxPoint, minVoter, maxVoter, counter - missCount, missVoter);

        // update page with user votes
        var canvas = document.getElementById("myChart");
        ctx = canvas.getContext("2d");
      
        //ctx.clearRect(0, 0, 500, 500);
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["1/2", "1", "2", "3", "5", "8", "13", "20"],
                datasets: [{
                    label: '# of Votes',
                    data: countArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fixedStepSize: 2
                        }
                    }]
                }
            }
        });
    });
};

$(document).on("click", "#endsession", function(data) {
    var roomRef = myDatabase.ref("rooms/" + roomID);

    roomRef.remove();  
});
function resetPoint(){
    var updates = {};
    var usersRef = myDatabase.ref("rooms/" + roomID +'/users');
    
    usersRef.once('value', function(snapshot) {
        snapshot.forEach(function(data) {
            if ( data.key != 'name') {
              updates['rooms/' + roomID +'/users/'+ data.key] = {name: data.val().name,
																 point: 0};
              firebase.database().ref().update(updates);
            }
        })
    });
};
$(document).on("click", "#revote", function(data) {
    resetPoint();
	setTimeout(function() { 
        var countDownTime = 5;
        var countDown = window.setInterval(function() {
            if (countDownTime === 0) {
                clearInterval(countDown);
                $("#revote").text("Revote");
                myChart.destroy();
                showUserVotes(usersRef);
            } else {
                $("#revote").text(countDownTime);
                countDownTime--;
            }
        }, 1000);
    }, 0);
});

// Programmed by Luis Suarez withoud moment.js
// code like a man and avoid dependencies!!!

var config = {
  apiKey: "AIzaSyCMZUFGTi5fg3qB0x-uDAPvruRRbMyixG0",
  authDomain: "ut-codingcamp-45ac0.firebaseapp.com",
  databaseURL: "https://ut-codingcamp-45ac0.firebaseio.com",
  projectId: "ut-codingcamp-45ac0",
  storageBucket: "",
  messagingSenderId: "955060422974"
};

// Initialize firebase app
firebase.initializeApp(config);

// Declare global variables 
var database = firebase.database();
var trainsRef = database.ref("/TrainSchedule/Trains");
var timeRef = database.ref("/TrainSchedule/Timer");
var timer;
var name;
var destination;
var firstTrain;
var frequency;
var newTrain = {
  name: "",
  destination: "",
  firstTrain: "",
  frequency: "",
  train: true
};

// Start timer
startTimer();

//Listen for click on submit button, validate fields and push 
//new train to database
$("#submit").on("click", function(event) {
  name = $("#nameInput").val();
  destination = $("#destinationInput").val();
  firstTrain = $("#firstTrainInput").val();
  frequency = $("#frequencyInput").val();
  newTrain = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };
  if (name != "" && destination != "" && firstTrain != "" && frequency != "") {
    trainsRef.push(newTrain);
    $("td").css("display", "none");
  }
});



// Function to update the list of trains on screen
function updateTrains() {
  trainsRef.on("child_added", function(snap, key) {
    $(".delete").off("click");

    $("#table").append(
      "<tr class='row' id='" +
        snap.key +
        "'><td class='name'>" +
        snap.val().name +
        "</td><td>" +
        snap.val().destination +
        "</td><td>" +
        snap.val().frequency +
        "</td><td>" +
        nextArrival(snap.val().firstTrain, parseInt(snap.val().frequency)) +
        "</td><td class='time'>" +
        minutesAway(snap.val().firstTrain, parseInt(snap.val().frequency)) +
        "</td><td class='delete' id='" +
        snap.key +
        "'>x</td></tr>"
    );

    $(".delete").on("click", function(e) {
      var child = $(this).attr("id");
      console.log(child);
      trainsRef.child(child).remove();
      $("#" + child).remove();
    });
  });
}

// Listen for click on clear all button and remove all trains
$(".clear").on("click", function() {
  trainsRef.remove();
});

// Funtion to start timer
function startTimer() {
  timer = setInterval(function() {
    $(".row").remove();

    updateTrains();
  }, 1000);
}

//function to stop timer
function stopTimer() {
  clearInterval(timer);
}

// Function to calculate the next train cycle after the current
// time, the argument first is the first ocurrence and is format is
// "00:00" in military time, the argument frequency is an integer
// value of minutes. returns the next ocurrence in a string "00:00 AM"
function nextArrival(first, frequency) {
  first = first.split(":");
  var pm = false;
  var now = new Date();
  var next = new Date();
  var nextArrival;
  now = now.getTime();
  next.setHours(parseInt(first[0]));
  next.setMinutes(parseInt(first[1]));
  next.setSeconds(0);
  var hours;
  var minutes;
  while (next < now) {
    next.setMinutes(next.getMinutes() + parseInt(frequency));
  }
  hours = next.getHours();
  minutes = next.getMinutes();
  if (hours > 12) {
    hours = hours - 12;
    pm = true;
  }
  if (hours > 9) {
    hours = "" + hours;
  } else {
    hours = "0" + hours;
  }
  if (minutes > 9) {
    minutes = "" + minutes;
  } else {
    minutes = "0" + minutes;
  }
  nextArrival = hours + ":" + minutes;
  if (pm == true) {
    nextArrival = nextArrival + " PM";
  } else {
    nextArrival = nextArrival + " AM";
  }
  return nextArrival;
}

// Function to calculate the time until next train cycle from the current
// time, the argument first is the first ocurrence and is format is
// "00:00" in military time, the argument frequency is an integer
// value of minutes. returns the time until the next ocurrence as an
// integer
function minutesAway(first, frequency) {
  first = first.split(":");
  var pm = false;
  var now = new Date();
  var next = new Date();
  var nextArrival;
  now.setSeconds(0);
  now = now.getTime();
  next.setHours(parseInt(first[0]));
  next.setMinutes(parseInt(first[1]));
  next.setSeconds(0);

  while (next < now) {
    next.setMinutes(next.getMinutes() + parseInt(frequency));
  }
  var seconds = 60 - new Date().getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var minutes = (next - now) / 1000 / 60 - 1;
  while (minutes > 60) {
    minutes = minutes - 60;
  }
  if (minutes < 0) {
    minutes = 0;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var hours = Math.floor((next - now) / 1000 / 60 / 60);

  return hours + ":" + minutes + ":" + seconds;
}

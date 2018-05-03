var config = {
  apiKey: "AIzaSyCMZUFGTi5fg3qB0x-uDAPvruRRbMyixG0",
  authDomain: "ut-codingcamp-45ac0.firebaseapp.com",
  databaseURL: "https://ut-codingcamp-45ac0.firebaseio.com",
  projectId: "ut-codingcamp-45ac0",
  storageBucket: "",
  messagingSenderId: "955060422974"
};
firebase.initializeApp(config);
var database = firebase.database();
var trainsRef = database.ref("/TrainSchedule");
var timeRef = database.ref("/TrainSchedule/Timer");
var name;
var destination;
var firstTrain;
var frequency;
var newTrain = {
  name: "",
  destination: "",
  firstTrain: "",
  frequency: ""
};

$("#submit").on("click", function(event) {
  event.preventDefault();
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
  trainsRef.push(newTrain);

  
});

trainsRef.on("child_added", function(snap, key) {
  $("#table").append(
    "<tr class='row' id='" +
      key +
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
      "</td><td class='delete' id='"+key+"'>x</td></tr>"
    
  );
  $("#" + key).on("click", function(){
    //trainsRef.remove(key);
    $("#" + key).remove()
  })
});

$(".clear").on("click", function(){
  trainsRef.remove();
  $(".row").remove();
  
})


// to update every second:
/* var timer = setInterval(function(){
  timeRef.set({
    name: "",
    destination: "",
    firstTrain: "",
    frequency: ""
  })
  timeRef.remove();
}, 1000 )

timeRef.on("value", function(){
  a = $(".time").val();
  console.log(a)
} ) */

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
function minutesAway(first, frequency){
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
  return Math.ceil((next - now)/1000/60)
}


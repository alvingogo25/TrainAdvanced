// Initialize Firebase
var config = {
  apiKey: "AIzaSyBJDIyayXs2Y5dMvmKo9LpG9Tnd0GIFAiI",
  authDomain: "advanced-train.firebaseapp.com",
  databaseURL: "https://advanced-train.firebaseio.com",
  projectId: "advanced-train",
  storageBucket: "",
  messagingSenderId: "722899966472"
};
firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var dest = "";
var frqncy = 0;
var firstTime = "";
var minsAway = "";
var nextArrivalTime = "";

$(document).ready(function() {
  loadTrains();
  $('#currentTime').text("Current Time: " + moment(moment()).format("hh:mm"));
  setInterval(function() {
    $('#currentTime').text("Current Time: " + moment(moment()).format("hh:mm"));
    database.ref().on("child_added", function(childSnapshot){
      getTimes(childSnapshot.val().firstTime, childSnapshot.val().frqncy)

      database.ref().update({
        nextArrivalTime: nextArrivalTime,
        minsAway: minsAway
      })
      loadTrains();
    });
  }, 1000 * 60);
});


$("#submit").on("click", function(event) {
  event.preventDefault();

  name = $("#name").val().trim();
  dest = $("#destination").val().trim();
  frqncy = $("#freq").val().trim();
  console.log(name, dest, frqncy);

  firstTime = $('#first-time').val().trim();
  getTimes(firstTime, frqncy);


  // push data to firebase
  database.ref().push({
    name: name,
    dest: dest,
    frqncy: frqncy,
    nextArrivalTime: nextArrivalTime,
    minsAway: minsAway,
    firstTime: firstTime
  });

  loadTrains();

});

// loads train data from firebase
function loadTrains (){
  $('#schedule').empty();
  database.ref().on("child_added", function(childSnapshot){
    $("#schedule").append("<tr><td>" + childSnapshot.val().name + "</td>" +
    "<td>" + childSnapshot.val().dest + "</td>" +
    "<td>" + childSnapshot.val().frqncy + "</td>" +
    "<td>" + childSnapshot.val().nextArrivalTime + "</td>" +
    "<td>" + childSnapshot.val().minsAway + "</td>");
    $('td').attr('scope', 'col');
  });
}

function getTimes (startTime, frequent) {
  var firstTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");

  var difference = moment().diff(moment(firstTimeConverted), "minutes");

  var tRemainder = difference % frequent;

  minsAway = frequent - tRemainder;

  var nextArrival = moment().add(minsAway, "minutes");
  nextArrivalTime = moment(nextArrival).format("hh:mm");
}

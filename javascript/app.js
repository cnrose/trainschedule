var config = {
    apiKey: "AIzaSyDWPfuCVQZe27m5REdX8KikrqZ_Pm7xFZI",
    authDomain: "train-schedule-d9462.firebaseapp.com",
    databaseURL: "https://train-schedule-d9462.firebaseio.com",
    projectId: "train-schedule-d9462",
    storageBucket: "train-schedule-d9462.appspot.com",
    messagingSenderId: "272530219640"
  };
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function(){

	//initial values
	var trainName = "";
	var destination = "";
	var firstTrain = "";
	var frequency = 0;

	//Show and Hide Form Button
	$("#formButton").on("click", function() {
		$("#addTrainForm").slideToggle();
		if($("#formButton").text().startsWith("Hide")) {
			$("#formButton").text("Show Form");
		}
		else {
			$("#formButton").text("Hide Form");
		};
	});

	//Form Submit Button Clicked
	$("#addTrain").on("click", function(event){
		event.preventDefault();

		trainName = $("#trainName").val().trim();
		destination = $("#destination").val().trim();
		firstTrain = $("#firstTrainTime").val().trim();
		frequency = $("#frequency").val().trim();

		//temporary object for a New Train
		var newTrain = {
			trainName : trainName,
			destination : destination,
			firstTrain : firstTrain,
			frequency : frequency
		};

		//push newTrain object to Firebase Database
		database.ref().push(newTrain);

		//log out input values
		console.log(trainName);
		console.log(destination);
		console.log(firstTrain);
		console.log(frequency);

		//alert that a new train has been added
		alert(trainName + " has been added successfully.");

		//clear form
		$("#trainName").val("");
		$("#destination").val("");
		$("#firstTrainTime").val("");
		$("#frequency").val("");
	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
		console.log(childSnapshot.val());

		//variables for object properties
		var trainName = childSnapshot.val().trainName;
		var destination = childSnapshot.val().destination;
		var firstTrain = childSnapshot.val().firstTrain;
		var frequency = childSnapshot.val().frequency;

		//log out returned train information from childSnapshot
		console.log(trainName);
		console.log(destination);
		console.log(firstTrain);
		console.log(frequency);

		//calculate next train time and minutes remaining with moment.js
		var newTime = moment(firstTrain, "HH:mm").subtract(1, "years");
		console.log(newTime);

		var currentTime = moment();
		console.log("current time: " + moment(currentTime).format("HH:mm"));

		var diffTime = moment().diff(moment(newTime), "minutes");
		console.log("Difference in Time: " + diffTime);

		var remainingTime = diffTime % frequency;
		console.log(remainingTime);

		var minutesAway = frequency - remainingTime;
		console.log("minutes away: " + minutesAway);

		var nextTrain = moment().add(minutesAway, "minutes");
		console.log("train arriving: " + moment(nextTrain).format("HH:mm"));

		//Create new table row and add new train info to it
		$("#trainTable > tbody").prepend("<tr> <td>" + trainName + "</td> <td>" + destination + "</td> <td>" + frequency + "</td> <td>" + nextTrain.format("HH:mm") + "</td> <td>" + minutesAway + "</td> </tr>");

	});
});
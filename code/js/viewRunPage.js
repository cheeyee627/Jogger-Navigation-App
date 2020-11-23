/*
* Purpose: This file contains JavaScript code to display the view run page to retrieve data from local storage
* Team 164
* Author: Alexander, Alvin, Chee Yee
* Last Modified: 21 May 2017
*/


// Code for the View Run page.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.
var runLocalIndex = localStorage.getItem(APP_PREFIX + "runToView"); 
var runNameArray = JSON.parse(localStorage.getItem(APP_PREFIX + "Run Names"))

if (runLocalIndex !== null)
{
    // If a run index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the run being displayed.
    document.getElementById("headerBarTitle").textContent = runNameArray[runLocalIndex];
}

var runDataRetrievedPDO = JSON.parse(localStorage.getItem(APP_PREFIX + runNameArray[runLocalIndex]));
var runDataRetrieved = new Run();

//Initialise the map, such that the run could be displayed on the map
function initMap()
{
    runDataRetrieved.initialiseFromRunPDO(runDataRetrievedPDO);
	console.log(runDataRetrieved)
	
    //Initialise Google Map Lat Lng and Data()
	document.getElementById("distanceTravelledViewRun").innerHTML = "Distance Travelled :" + runDataRetrieved.calculateDistance().toFixed(2) +"m."
    document.getElementById("timeTakenViewRun").innerHTML = "Time Taken :" + runDataRetrieved.calculateDuration().toFixed(2)+"s."
    document.getElementById("averageSpeedViewRun").innerHTML = "Average Speed :" +runDataRetrieved.calculateAverageSpeed().toFixed(2)+"m/s."
	timeTaken = runDataRetrieved.calculateDuration()
    document.getElementById("caloriesBurnt").innerHTML = "Total Calories Burnt: " + timeTaken/60 * 85
	document.getElementById("treasureCounter").innerHTML = "Treasure Collected:" + runDataRetrieved._randomTreasureCounter
    
	 map = new google.maps.Map(document.getElementById("map"), {
          center: runDataRetrieved.pathArray[0],
          zoom: 17}); 
	
    var startIcon = {
            url: "https://image.ibb.co/cKxBQk/green_flag.png",
            scaledSize: new google.maps.Size(50,50),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(4,50)
        };
    
    var startMarker = new google.maps.Marker({
        position: runDataRetrieved.pathArray[0],
        map: map,
        icon: startIcon
    });
    
    var destinationIcon = {
        url: "https://image.ibb.co/kEx9d5/blackflag.png",
        scaledSize: new google.maps.Size(50,50),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(4,50)
    };
    
    var destinationMarker = new google.maps.Marker({
        position: runDataRetrieved.pathArray[runDataRetrieved.pathArray.length-1],
        map: map,
        icon: destinationIcon
    });
    
     var runPath = new google.maps.Polyline({
          path: runDataRetrieved.pathArray,
          geodesic: true,
          strokeColor: '#7AFFE3',
          strokeOpacity: 1.5,
          strokeWeight: 1.5,
         map: map
        });
}

function reattemptRun()
{
    var reattempt = true;
    var reattemptJSON = JSON.stringify(reattempt);
    localStorage.setItem(APP_PREFIX + "reattempt", reattemptJSON)
    location.href = 'newRun.html';
}

function deleteRun()
{
     var deleteRunBoolean = confirm("This run will be deleted! Are you sure?")
     if (deleteRunBoolean)
        {
            localStorage.removeItem(APP_PREFIX + runNameArray[runLocalIndex])
            runNameArray.splice(runLocalIndex,1);
            localStorage.setItem(APP_PREFIX + "Run Names", JSON.stringify(runNameArray))
            location.href = 'index.html';
        }
     else
         {
             displayMessage("Run is not deleted.");
         }
}


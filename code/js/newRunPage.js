/*
* Purpose: This file contains JavaScript code to display the new run page with multiple functions and map viewing
* Team 164
* Author: Alexander, Alvin, Chee Yee
* Last Modified: 21 May 2017
*/


//Variables for saving values
var pos = "";
var map = "";
var marker = null;
var trackMarker = null;
var circle = null;
var trackCircle = null;
var labels = 'DESTINATION';
var destinationMarker = ""
var randomMarker = ""
var destinationArrayLat = []
var destinationArrayLng = []
var trackLatArray = []
var trackLngArray = []
var trackCoordinatesArray = []
var pathArray = []
var myLatitude, myLongitude, myCoordinates, infoWindow, finalCoordinates, finalLat, finalLng, pathCoordinates
var trackCoordinates, trackLat, trackLng, randomCoordinates, totalTime , totalDistance
var startRun = false
var linePath = null
var polylinePath = null
var distanceFromStart, initialCoordinates, runInstance, initialAccuracy, distanceLeft, trackAccuracy, endDate, startDate
var startLocation
var mainPageTimer = document.getElementById("timer")
var destinationCoordinates
var randomTreasure
var randomTreasureCounter = 0
var randomTreasureMarker = ""
var counter = 0

// image array for saving the different URLs for different images
var imageArray = ["http://jeffpelletier.com/wp-content/uploads/2014/02/tumblr_mvtfykkR8e1scqyuco1_1280.jpg","https://s-media-cache-ak0.pinimg.com/736x/9b/2b/d5/9b2bd58362670b4cd7b6fe00f621c286.jpg",'http://running.competitor.com/files/2014/12/HardisGreat.jpg','https://s-media-cache-ak0.pinimg.com/originals/cb/fc/4b/cbfc4b46a90310416c4ae8d02717e994.jpg','http://angryjogger.com/wp-content/uploads/2016/02/Screen-Shot-2015-06-03-at-10.19.52-AM.png','https://static1.squarespace.com/static/5330664de4b0c8441aea50d8/t/54e75cfbe4b02e8e022e11e0/1424448764506/Dont+quit','http://www.therunnerbeans.com/wp-content/uploads/2016/04/0ff1b11494eacb0cbb38f5d89827b560.jpg']

// To determine whether this page has been just opened
// or its linked from reattempt run
// If its reattemptRun, the variable would contain the key and details for the run to be reattempt
var reattemptRun = JSON.parse(localStorage.getItem(APP_PREFIX + "reattempt"));
localStorage.removeItem(APP_PREFIX + "reattempt");

// Initially disabling the Begin Run and Save Run button
document.getElementById("beginRun").disabled = true;
document.getElementById("saveRun").disabled = true;

// var to mark the begin run
var startRun = false;
alert("If you would like to select your own destination just click anywhere on the map and save it as your destination")

//Map geolocation function
function initMap()
{
	var positionOptions = 
	{
	//Enable high accuracy tracking and keeps on refreshing for infinite times, without hitting the max Age
       enableHighAccuracy: true,
       timeout: Infinity, 
       maximumAge: 0
    };
	// Map Initializing, Marker Set-up and Location Tracking..	
	navigator.geolocation.getCurrentPosition(initialize,fail,positionOptions); // initialize location of map and tracker through callback function initialize();
   	navigator.geolocation.watchPosition(successful,fail,positionOptions); //getting real-time coordinates through callback function successful();
	
	function successful(position)
    {
        // Obtain coordinates from watchPosition() API
        trackLat = position.coords.latitude;
        trackLng = position.coords.longitude;
        trackAccuracy = position.coords.accuracy;
        trackCoordinates = new google.maps.LatLng({lat:trackLat, lng:trackLng});
		pathArray.push(new google.maps.LatLng({lat:trackLat, lng:trackLng}));
        
		// Move the marker position as coordinate changes.
        marker.setPosition(trackCoordinates); 
			
		// Move the circle and update accuracy 
		circle.setCenter(trackCoordinates);
		circle.setRadius(trackAccuracy);
		// Checking accuracy
		displayMessage(trackAccuracy,500);
		
		document.getElementById("trackAccuracy").innerHTML = "Accuracy of Position:" + trackAccuracy + "m"
		
		console.log(pathArray)
        
        if (startRun === true)
        {
			//To plot the line continously
			polylinePath = linePath.getPath();
            polylinePath.push(trackCoordinates);
            
            var distanceTravelled = google.maps.geometry.spherical.computeDistanceBetween(startLocation,trackCoordinates);
			finalLat = destinationArrayLat[destinationArrayLat.length-1]
			finalLng = destinationArrayLng[destinationArrayLng.length-1]
			finalCoordinates = new google.maps.LatLng({lat:finalLat, lng:finalLng})
			
			//To link the relevant variables to the HTML file for display
			distanceLeft = google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,finalCoordinates);
			document.getElementById("distanceLeft").innerHTML=("Estimated Distance left to Destination:" + distanceLeft +"m");
			
			distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,initialCoordinates)
			document.getElementById("distanceFromStart").innerHTML=("Estimated Distance from Starting Location:" + distanceFromStart +"m");
			
			averageSpeed = distanceFromStart/(Date.now() - startDate)
			document.getElementById("averageSpeed").innerHTML = ("Average Speed:" + averageSpeed + "m/s")
			
			if (google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,finalCoordinates)<10)
			// when the user is within 10m of the Destination the code below will trigger
            {
				//the save run button would be enabled for users to save their Run
				document.getElementById("saveRun").disabled = false
            	polylinePath.push(randomCoordinates);
                pathArray.push(randomCoordinatess);
                lineCoordinatesPath.setOptions({strokeColor : "#00FF00"});
                endDate = new Date();
                runInstance = new Run(pathArray,startDate,endDate);
                displayMessage("Run has been completed.\nDuration used: " + (runInstance.calculateDuration()).toFixed(2) +"seconds\nDistance travelled: " + (runInstance.calculateDistance()).toFixed(2)+"m")
                document.getElementById("saveRun").disabled = false;
                startRun = false;
                navigator.geolocation.clearWatch(watchId)
				//to completely end the run, save the run under a new instance, and clear the watchID for google geolocation
				
            }
			
			//To determine whether the treasure has been collected while the run is going on.
			if(google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,randomTreasureCoordinates)<30)
			{
				displayMessage("Treasure has been Collected")
				console.log("Treasure has been Collected")
				randomTreasureCounter += 1
			}	
        }
		
		//Code for reattempt Run, determined by the boolean variable for the variable reattemptRun
		if(reattemptRun === true)
		{
			alert("For reattempting run, just run towards the flag marked as Destination")
			var runLocalIndex = localStorage.getItem(APP_PREFIX + "runToView"); 
			var runNameArray = JSON.parse(localStorage.getItem(APP_PREFIX + "Run Names"))
			var runDataRetrievedPDOReattempt = JSON.parse(localStorage.getItem(APP_PREFIX + runNameArray[runLocalIndex]));
			var runDataRetrievedReattempt = new Run();
			runDataRetrievedReattempt.initialiseFromRunPDO(runDataRetrievedPDOReattempt)
			addChosenMarker(runDataRetrievedReattempt.pathArray[(runDataRetrievedReattempt.pathArray.length)-1],map)
			//To put a marker at the targeted destination of the previous run
			//Users only have to run towards the run
			
			//Only if the user is within 10m of the starting location of the previous run
			//Then the button to begin Run would be acrtivated, allowing user to begin run
			if (trackAccuracy<=20 && google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,runDataRetrievedReattempt.pathArray[0])<10)
            {
                document.getElementById("beginRun").disabled = false;
            }
		}
	}

	function initialize(position)
	{
	// Obtaining my current latitude and longitude
        var myLatitude = position.coords.latitude;
        var myLongitude = position.coords.longitude;
        var accuracy = position.coords.accuracy;
		// Passing my latitude and longitude to google map string
        myCoordinates = new google.maps.LatLng({lat:myLatitude, lng:myLongitude});
		startLocation = new google.maps.LatLng({lat:myLatitude, lng:myLongitude})
		initialAccuracy = position.coords.accuracy
		
		// Setting up for google map
		var mapDetails = 
		{
                center: myCoordinates,
                zoom: 20
		}
		map = new google.maps.Map(document.getElementById('map'), mapDetails);
		
		//Customizing the Icon
		var youAreHereIcon = {
		url: "https://d30y9cdsu7xlg0.cloudfront.net/png/429319-200.png",
    	scaledSize: new google.maps.Size(40, 40), // scaled size
    	origin: new google.maps.Point(0,0), // origin
    	anchor: new google.maps.Point(20,40) // anchor
		};

		// Putting a marker at current position
        markerOptions = 
        {
        	map: map,
            position: myCoordinates,
            opacity: 0.7,
            icon: youAreHereIcon
            
        }
        marker = new google.maps.Marker(markerOptions) 
		
		
		// Setting up of an event to allow users to click to select their destination
		event = google.maps.event.addListener(map, 'click', function(event) 
		{
			addChosenMarker(event.latLng, map)
			document.getElementById("beginRun").disabled = false
			
        });
		
		// Setting up circle to display the accuracy of the GPS.
		var circleOptions = 
        {
			map:map,
			center: myCoordinates,
			radius: accuracy,
			strokeColor: "black",
            strokeOpacity: 0.7,
          	strokeWeight: 2,
            fillColor: "grey",
            fillOpacity: 0.35,
        }
		circle = new google.maps.Circle(circleOptions);	
		
    }
	
    // If no location is detected
    function fail()
	{
       alert("Location not found!")
	}
    infoWindow = new google.maps.InfoWindow()	
}

//Checking if geolocation is supported by the device or not
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
};

//Function to add marker to the user's own selected Destination
function addChosenMarker(location, map) 
{
	if(destinationMarker)
	{
		destinationMarker.setPosition(location)
		
	}
	else
	{
        // Add the marker at the clicked location
		var destinationIcon = {
            url: "https://cdn3.iconfinder.com/data/icons/travel-places-travel-starter/48/v-09-512.png", // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(20,40) // anchor
        };
		
		destinationMarker = new google.maps.Marker({
         position: location,
         label: "Destination",
         map: map,
		 icon: destinationIcon
		
        });
		
		//Function to toggle bounce for the marker
		marker.addListener('click', toggleBounce);
		
		function toggleBounce() 
		{
        	if (marker.getAnimation() !== null) 
			{
          		marker.setAnimation(null);
       		} 
			else 
			{
          		marker.setAnimation(google.maps.Animation.BOUNCE);
        	}
		}
		
		destinationMarker.getPosition()
		var lat = destinationMarker.getPosition().lat();
		var lng = destinationMarker.getPosition().lng();	
	}
}

// Function to add Random Marker
function addRandomMarker(location, map) 
{
    if (randomMarker)
	{
		randomMarker.setPosition(location)
	}
	else
	{
	// Add the marker at the clicked location
		var destinationIcon = {
            url: "https://cdn3.iconfinder.com/data/icons/travel-places-travel-starter/48/v-09-512.png", // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(20,40) // anchor
        };
		randomMarker = new google.maps.Marker({
          position: location,
          label: "Destination",
          map: map,
			icon: destinationIcon
        });
		marker.addListener('click', toggleBounce)
		function toggleBounce() 
		{
        	if (marker.getAnimation() !== null) 
			{
          		marker.setAnimation(null);
        	}
			else 
			{
          		marker.setAnimation(google.maps.Animation.BOUNCE);
        	}
		}
	
		randomMarker.getPosition()
		var randomLat = randomMarker.getPosition().lat();
		var randomLng = randomMarker.getPosition().lng();			
	}
}

function randomDestination()
{
	document.getElementById("beginRun").disabled = false;
	//Math.round(Math.random()) * 2 - 1
	// to get 0 or 1
	var randomLatitude = trackLat + (Math.random()/1000)*(Math.round(Math.random()) * 2 - 1);
    var randomLongitude = trackLng - (Math.random()/1000)*(Math.round(Math.random()) * 2 - 1);
        	
	// Passing my latitude and longitude to google map string
    randomCoordinates = new google.maps.LatLng({lat:randomLatitude, lng:randomLongitude});
	destinationCoordinates = new google.maps.LatLng({lat:randomLatitude, lng:randomLongitude});
	randomDistance = google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,randomCoordinates)
	
	if (randomDistance < 60| randomDistance > 150)
	{
		randomDestination()	
	}
    else
    {
    addRandomMarker(randomCoordinates,map);
	destinationArrayLat.push(randomMarker.getPosition().lat())
	destinationArrayLng.push(randomMarker.getPosition().lng())
    console.log(destinationArrayLat)
	console.log(destinationArrayLng)
	randomTreasure()
	}	
}

function randomTreasure()
{
	//Math.round(Math.random()) * 2 - 1
	// to get 0 or 1
	var randomTreasureLatitude = trackLat + (Math.random()/1000)*(Math.round(Math.random()) * 2 - 1);
    var randomTreasureLongitude = trackLng - (Math.random()/1000)*(Math.round(Math.random()) * 2 - 1);
        	
	// Passing my latitude and longitude to google map string
    randomTreasureCoordinates = new google.maps.LatLng({lat:randomTreasureLatitude, lng:randomTreasureLongitude});
	console.log(trackLat)
	console.log(trackLng)
	console.log(randomTreasureLatitude + "randomTreasureLatitude")
	console.log(randomTreasureLongitude)
	if (counter == 0)
	{
    	addTreasureMarker(randomTreasureCoordinates,map);
		counter += 1
		// counter to ensure that only 1 Treasure is added per Run.
	}    
}


function addTreasureMarker(location, map) 
{
	// Add the marker at the clicked location
	var treasureIcon = {
            url: "https://thumb1.shutterstock.com/display_pic_with_logo/892819/141372238/stock-vector-opened-treasure-chest-with-treasures-photo-realistic-vector-141372238.jpg", // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(20,40) // anchor
    };
	randomTreasureMarker = new google.maps.Marker({
          position: location,
          label: "Treasure! Come get it!",
          map: map,
			icon: treasureIcon
    });
	marker.addListener('click', toggleBounce)
		
	function toggleBounce() 
	{
        if (marker.getAnimation() !== null) 
		{
          marker.setAnimation(null);
        } 
		else 
		{
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
	}			
}

function beginRun()
{
    document.getElementById("randomDestination").disabled = true;
    document.getElementById("beginRun").disabled = true;
    timer();
	startRun = true;
	startDate = new Date()

	var startIcon = {
            url: "https://image.ibb.co/cKxBQk/green_flag.png",
            scaledSize: new google.maps.Size(40,40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(4,50)
    };
	
    startMarker = new google.maps.Marker({
        position: trackCoordinates,
        map: map,
        icon: startIcon
    });

    initialCoordinates = trackCoordinates;
	
	//Obtaining the final coordinates
	finalDestinationLat = destinationArrayLat[destinationArrayLat.length - 1];
	finalDestinationLng = destinationArrayLng[destinationArrayLng.length - 1];
	finalCoordinates = new google.maps.LatLng({lat:finalDestinationLat, lng:finalDestinationLng});
	
	
	distanceLeft = google.maps.geometry.spherical.computeDistanceBetween(finalCoordinates,trackCoordinates)
	document.getElementById("distanceLeft").innerHTML=("Estimated Distance left to Destination:" + distanceLeft +"m");
	
	distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,initialCoordinates)
	document.getElementById("distanceFromStart").innerHTML=("Estimated Distance from Starting Location:" + distanceFromStart +"m");
	
	averageSpeed = distanceFromStart/(Date.now() - startDate)
	document.getElementById("averageSpeed").innerHTML = ("Average Speed:" + averageSpeed + "m/s")
	
	//To determine whether the Treasure has been collected ever since the function Begin Run has been activated.
	if(google.maps.geometry.spherical.computeDistanceBetween(trackCoordinates,randomTreasureCoordinates)<30)
	{
		displayMessage("Treasure has been Collected")
		randomTreasureCounter += 1
	}
	//set path using polyline
	// this method however only works if the user only opens the app when he wants to start the run
	
	linePath = new google.maps.Polyline({
        path: pathArray,
        strokeColor: "#7AFFE3",
        geodesic: true,
        strokeOpacity: 1.5,
        strokeWeight: 1.5
    });
    linePath.setMap(map)
}

function timer()
{
    var now = Date.now();
    var interval = setInterval(function() {
    var elapsedTime = Date.now() - now;
    document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(3) + "seconds";
    });
	console.log("timer starts")	
}

//Function to save the selected Destination
function selectDestination()
{
	destinationArrayLat.push(destinationMarker.getPosition().lat())
	destinationArrayLng.push(destinationMarker.getPosition().lng())
	destinationCoordinates = new google.maps.LatLng({lat:destinationMarker.getPosition().lat(), lng:destinationMarker.getPosition().lng()});
	randomTreasure()
	
}

function saveRun()
{
	endDate = new Date();
	pathArray.push(finalCoordinates)
	console.log(pathArray)
    runInstance = new Run(startDate,endDate,pathArray,randomTreasureCounter);
    displayMessage("Run has been completed.\nDuration used: " + (runInstance.calculateDuration()).toFixed(2) +"seconds\nDistance travelled: " + (runInstance.calculateDistance()).toFixed(2)+"m" + "Treasure Collected:" +randomTreasureCounter)
	
	//Referenced from Yew Wei Sheng
	var saveRunNameArray = [],temp;
    var runGivenName = prompt("Please give a name to this this run");
    
    while (runGivenName === null)
        {
            var discardTrue = confirm("This run will be discarded. Are you sure?")
            if (discardTrue === false)
                {
                    runGivenName = prompt("Name this run");   
                }
            else
                {
                    break
                }
        }

    if (runGivenName !== null)
        {
            if (runGivenName ==="")
                 {
                     runGivenName = runInstance.startDate.getDate()
					 // saving the run using the startDate
                 }

            runInstance.name = runGivenName;
            storeRun(runGivenName);

            if (localStorage.getItem(APP_PREFIX + "Run Names"))
                {
                    saveRunNameArray = JSON.parse(localStorage.getItem(APP_PREFIX + "Run Names"));
                    saveRunNameArray.push(runGivenName);
                    temp = JSON.stringify(saveRunNameArray);
                    localStorage.setItem(APP_PREFIX+"Run Names",temp);
                }
            else 
                {
                    saveRunNameArray.push(runGivenName);
                    temp = JSON.stringify(saveRunNameArray);
                    localStorage.setItem(APP_PREFIX+"Run Names",temp);
                }
            displayMessage("Good Job. Run saved.")
        }
	setTimeout(function(){document.location.href = "index.html"},1000)
	// reference the document to the page index.html file
}

function storeRun(runName)
{
	if (typeof(Storage !== undefined))
        {
            var runJSON = JSON.stringify(runInstance);
            localStorage.setItem(APP_PREFIX + runName,runJSON);
        }
    else
        {
            alert("Local storage is not supported by web browser")
        }
}

function iGiveUp()
{
	var limit = 6
	var ans = Math.floor(Math.random() * (limit+1))
    modal.style.display = "block";
    modalImg.src = imageArray[ans] 
}
		
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}


//Code for the displaying of images
var modal = document.getElementById('myModal');
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");






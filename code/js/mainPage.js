/*
* Purpose: To save, obtain and view the runs in a short format, displayed as a list in index.html
* Team 164
* Author: Alexander, Alvin, Chee Yee
* Last Modified: 21 May 2017
*/

// Code for the main app page (Past Runs list).

function initMap()
{
    var output ="";
    var runNameArray = JSON.parse(localStorage.getItem(APP_PREFIX + "Run Names"));
	console.log(runNameArray)
    for( var i=0 ; i<runNameArray.length; i++)
        {
            var runDataRetrievedPDO = JSON.parse(localStorage.getItem(APP_PREFIX + runNameArray[i]));
            var runDataRetrieved = new Run();
            runDataRetrieved.initialiseFromRunPDO(runDataRetrievedPDO);
            output +='<li class="mdl-list__item mdl-list__item--two-line" onclick="viewRun('+i+');"><span class="mdl-list__item-primary-content"><span>'+ runDataRetrieved.name + '</span><span class="mdl-list__item-sub-title">'+ runDataRetrieved.startDate.toLocaleDateString() + '<br>'+ runDataRetrieved.endDate.toLocaleTimeString() +'</span></span></li>'
            document.getElementById("runsList").innerHTML = output;
        }
}

function viewRun(runIndex)
{
    // Save the desired run to local storage so it can be accessed from View Run page.
    localStorage.setItem(APP_PREFIX + "runToView", runIndex);
    // ... and load the View Run page.
    location.href = 'viewRun.html';
}


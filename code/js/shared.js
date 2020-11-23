/*
* Purpose: This file contains JavaScript code shared among all other three pages
* Team 164
* Author: Alexander, Alvin, Chee Yee
* Last Modified: 21 May 2017
*/

// Shared code needed by all three pages.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.runChallengeApp";

// Array of saved Run objects.
var savedRunsArray = [];

class Run
{
    constructor(startDate,endDate,pathArray,randomTreasureCounter)
    {
        //Private Attributes
        this._startDate = startDate;
		this._endDate = endDate;
        this._name;
        this._pathArray = pathArray
		this._randomTreasureCounter = randomTreasureCounter
    }
	   
    //methods to get and set the values for different elements of the run
	get pathArray()
	{
		return this._pathArray
	}
	
	set pathArray(path)
	{
		this._pathArray = path
	}
	
	get name()
	{
		return this._name
	}
	
	set name(name)
	{
		this._name = name
	}
	
	get startDate()
	{
		return this._startDate
	}
	
	set startDate(date)
	{
		this._startDate = date
	}
	
	get endDate()
	{
		return this._endDate
	}
	
	set endDate(date)
	{
		this._endDate = date
	}
	
	get treasureCounter()
	{
		return this._treasureCounter
	}
	
	set treasureCounter(value)
	{
		this._treasureCounter = value
	}
	
	getStartCoordinates()
    {
    	return this._pathArray[0];
    }

	getEndCoordinates()
	{
		return this._pathArray[(this._pathArray.length-1)]
	}
	
	treasureCounterValue()
	{
		var value = this._randomTreasureCounter
		return value
	}
	
	calculateDuration()
    {
       var duration = (this._endDate.getTime()-this._startDate.getTime())/1000 ;
       return duration
    }
	
	calculateDistance()
	{
		var distance = 0;
            for (var i=0; i<(this._pathArray.length -1);i++)
                {
                    distance += google.maps.geometry.spherical.computeDistanceBetween(this._pathArray[i],this._pathArray[(i+1)])
                }
            return distance
	}
	
	calculateAverageSpeed()
    {
            var duration = (this._endDate.getTime()-this._startDate.getTime())/1000 ;
            var distance = 0;
            for (var i=0; i<(this._pathArray.length -1);i++)
                {
                    distance += google.maps.geometry.spherical.computeDistanceBetween(this._pathArray[i],this._pathArray[(i+1)])
                }
            return (distance/duration);
    }
	
	//To reintialise a run from local storage, allowing us to take and manipulate the data stored
	initialiseFromRunPDO(runObject)
    {
		var pathTemporaryArray = [];
		for (var i=0 ; i<runObject._pathArray.length ; i++)
                {
                    pathTemporaryArray.push(new google.maps.LatLng(runObject._pathArray[i]));
                }
        
        this._pathArray = pathTemporaryArray;
        this._startDate = new Date(runObject._startDate);
        this._endDate = new Date(runObject._endDate);
        this._name = runObject._name;
		this._randomTreasureCounter = runObject._randomTreasureCounter
    }   
}
    






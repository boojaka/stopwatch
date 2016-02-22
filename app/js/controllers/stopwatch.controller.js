
"use strict";

angular
.module('stopwatch-app')
.controller('StopWatchController', StopwatchController);

// set up minification safe injections
StopwatchController.$inject = ['$scope','$window','$interval','$timeout'];
function StopwatchController($scope, $window, $interval, $timeout){
	var self = this;
	
	self.tickFrom = null; // this holds timestamp of time when "play" button was pressed, "null" means it's paused/stopped
	self.time = 0; // this displays in GUI
	self.savedTime = 0; // after user hits on "pause" button, difference between current time and time when "play" button was pressed is stored here
	
	loadState();
	
	$scope.windowLocalStorage = $window.localStorage;
	
	self.toggleTick = toggleTick;
	
	self.addRecord = addRecord;
	
	self.removeRecord = removeRecord;
	
	self.reset = reset;
	
	$scope.$watch('records', onRecordsUpdate, true);
	
	$scope.$watch('windowLocalStorage.stopwatchUpdate', onExternalUpdate);
	
	var updateTimer = $interval(onUpdate, 1000/20);
	
	$scope.$on('$destroy', onDestroy);
	
	function toggleTick(){
		if(self.tickFrom){
			self.savedTime += Date.now() - self.tickFrom;
			self.tickFrom = null;
		}
		else self.tickFrom = Date.now();
		
		saveState();
	}
	
	function onRecordsUpdate(records){
		$window.localStorage.stopwatchRecordKeys = JSON.stringify(
			self.records.map(function(x){
				return {time: x.time, desc: x.desc};
			})
		);
		$window.localStorage.stopwatchUpdate = Date.now()+'';
	}
	
	function onExternalUpdate(){
		loadState();
	}
	
	function onDestroy(){
		$interval.cancel(updateTimer);
	}
	
	function onUpdate(){
		self.time = (self.tickFrom != null ? Date.now() - self.tickFrom : 0) + self.savedTime; // compute time to display it properly in GUI
	}
	
	function reset(){
		self.records.length = 0;
		self.tickFrom = null;
		self.savedTime = 0;
		saveState();
	}
	
	// "save lap" button hit handler
	function addRecord(){
		if(self.tickFrom){
			self.savedTime += Date.now() - self.tickFrom;
			self.tickFrom = Date.now();
		}
		
		var record = {
			time: self.savedTime,
			desc: ''
		};
		
		self.records.splice(0, 0, record);
		
		//self.savedTime = 0; // uncomment this if "save lap" should reset the timer
		saveState();
	}
	
	function removeRecord(i){
		self.records.splice(i, 1)[0];
	}
	
	// Load data from localStorage
	function loadState(){ 
		var savedState = JSON.parse($window.localStorage.stopwatchState || 'null');
		if(savedState){
			self.tickFrom = savedState.tickFrom;
			self.savedTime = savedState.savedTime;
		}
		
		self.records = $scope.records = JSON.parse($window.localStorage.stopwatchRecordKeys || 'null') || [];
	}
	
	// Save state into localStorage
	function saveState(){ 
		$window.localStorage.stopwatchState = JSON.stringify({tickFrom: self.tickFrom, savedTime: self.savedTime});
		$window.localStorage.stopwatchUpdate = Date.now()+'';
	}
}

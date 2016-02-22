
"use strict";

angular
.module("stopwatch-app")
.filter('stopwatchExtractFromTime', StopwatchExtractFromTimeFilter);
// angular filter to extract parts of time number to display in lcd
function StopwatchExtractFromTimeFilter(){
	var types = {
		milliseconds: function(val){
			return ('0'+((val/10|0)%100)).slice(-2);
		},
		seconds: function(val){
			return ('0'+((val/1000|0)%60)).slice(-2);
		},
		minutes: function(val){
			return ('0'+((val/60000|0)%100)).slice(-2); // if minutes get bigger than 99 they visually rotated to 0 but in localStorage it's saving as is.
		}
	};
	
	return Filter;
	
	function Filter(input, type){
		if(types.hasOwnProperty(type) == false) return '';
		return types[type](input);
	}
}

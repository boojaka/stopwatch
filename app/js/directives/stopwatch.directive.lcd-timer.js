
"use strict";

angular
.module("stopwatch-app")
.directive('stopwatchLcdTimer', StopwatchLcdTimerDirective);

function StopwatchLcdTimerDirective(){
	return {
		restrict: "E",
		template: '<div class="lcd-timer">{{value | stopwatchExtractFromTime:"minutes"}}{{displaySeparators ? ":" : " "}}{{value | stopwatchExtractFromTime:"seconds"}}{{displaySeparators ? "." : " "}}{{value | stopwatchExtractFromTime:"milliseconds"}}</div>',
		link: function(scope, element, attrs){
			
			// set defaults
			scope.displaySeparators = true;
			scope.value = 0;
			scope.animate = false;
			
			scope.$watch(attrs.value, onTimeValueChange);
			
			scope.$watch(attrs.animate, onAnimateStateChange);
			
			function updateSeparators(){
				scope.displaySeparators = !scope.animate || (scope.value/500|0)&1 == 1;
				// "animate" does not work if value isn't updating
				// currently, separators are changing its state 2 times per second, if you want to change this, do it by simple formula: 1000 / x, where x - "how many times it should change the state", and write it into (scope.value/yyyy|0) place
			}
			
			function onAnimateStateChange(bool){
				scope.animate = !!bool;
				updateSeparators();
			}
			
			function onTimeValueChange(val){
				scope.value = val;
				updateSeparators();
			}
		}
	};
}

require("./button_right.css")

angular.module("rightButton", [])
	.directive('rightButton', () => {
        return {
            template: require("./button_right.html"),
            replace: true,
            restrict: "E",
            scope: {},
            controller:["$scope", function($scope) {
            	$scope.isShowRightImg = true;
		    	$scope.showRightImg = function(){
		    		$scope.isShowRightImg = !$scope.isShowRightImg;
		    	}
		    }]
        }
    });
    
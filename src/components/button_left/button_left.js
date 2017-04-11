require("./button_left.css")

angular.module("leftButton", [])
	.directive('leftButton', () => {
        return {
            template: require("./button_left.html"),
            replace: true,
            restrict: "E",
            scope: {},
		    controller:["$scope", function($scope) {
		    	$scope.isShowLeftImg = true;
		    	$scope.showLeftImg = function(){
		    		$scope.isShowLeftImg = !$scope.isShowLeftImg;
		    		console.log("1");
		    	}
		    }]
        }
    });
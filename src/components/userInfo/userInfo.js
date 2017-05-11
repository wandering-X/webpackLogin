require("./userInfo.css");

angular.module("userInfo", [])
    .directive('userInfo', () => {
        return {
            template: require("./userInfo.html"),
            replace: false,
            restrict: "E",
            scope: {}
        }
    })
    .controller("userInfoCtrl", ["$scope", "$state", "constant",
        ($scope, $state, constant) => {

        }
    ])
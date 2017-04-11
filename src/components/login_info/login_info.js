require("./login_info.css");

angular.module("loginInfo", [])
    .directive('loginInfo', () => {
        return {
            template: require("./login_info.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .controller("loginInfoCtrl",["$scope","$http","$state","$stateParams","$httpParamSerializerJQLike", ($scope,$http,$state,$stateParams) => {
        $scope.mobile = '';
        $scope.userInfo = null;
        if ($stateParams.value != '') {
        $scope.userInfo = angular.fromJson($stateParams.value);
    }
        $http({
            method: "GET",
            url: "http://192.168.150.181/hswy-basic-web/basic/account/information",
            params:{
                'accountId':$scope.userInfo.accountId,
                'token':$scope.userInfo.accessToken
            }

        }).then(function successCallback(response) {
            if (response.data.head.code == '00000000') {
                $scope.mobile = response.data.body.mobile;
            }
        }, function errorCallback(response) {
            console.log(response.data.head.msg);
        });

        $scope.userQuit = () => {
            $scope.mobile = '';
            $state.go("frame.login",{
                        reload: false   
                    });
        }
    }])
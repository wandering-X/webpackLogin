require("./css/login.css")

angular.module("login", [])
    .directive('login', () => {
        return {
            template: require("./login.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .controller("loginCtrl",["$scope","$http","$state","$httpParamSerializerJQLike", ($scope,$http,$state) => {
        $scope.loginname = '';
        $scope.loginpsd = '';
        $scope.errorMsg = '';
        $scope.accountId = '';
        $scope.accessToken = '';
        $scope.userLogin = () => {
            $http({
                method: "POST",
                url: "http://192.168.150.181/hswy-basic-web/basic/oauth2/clientLogin",
                head:{
                    "Content-Type":"application/x-www-form-urlencoded; charset=utf-8"
                },
                params:{
                    'loginName':$scope.loginname,
                    'password':$scope.loginpsd,
                    'appId':'09250100010000'
                }
            }).then(function successCallback(response) {
                    $scope.errorMsg = response.data.head.msg;
                if (response.data.head.code == '00000000') {
                    $scope.accountId = response.data.body.accountInfo.accountId;
                    $scope.accessToken = response.data.body.accessToken;
                    
                    $scope.accountData = angular.toJson({
                        accountId:$scope.accountId,
                        accessToken:$scope.accessToken
                    });
                    $state.go("frame.loginInfo",{
                        value: $scope.accountData
                    },{
                        reload: false   
                    });
                }
            }, function errorCallback(response) {
                console.log(response.data.head.msg);
            });
        }

    }])
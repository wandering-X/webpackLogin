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
    .controller("userInfoCtrl", ["$scope", "$state", "constant", "$http", "$timeout",
        ($scope, $state, constant, $http, $timeout) => {
            //确定按钮是否可用
            function testDisabled() {
                if ($('.userName').val() && $('.password').val() && $('.newPassword').val() && $('.confirmNewPassword').val()) {
                    $scope.disabled = false;
                } else {
                    $scope.disabled = true;
                }
            }
            testDisabled();

            $scope.isDisabled = () => {
                testDisabled();
            }
            $scope.userName = constant.userInfo.loginName();
            //请求服务端前，先进行表单验证
            $scope.userChange = () => {
                if (!constant.validType.password.test($('.password').val())) {
                    $scope.errorMsg = '原' + constant.validMsg.password;
                } else if (!constant.validType.password.test($('.newPassword').val())) {
                    $scope.errorMsg = '新' + constant.validMsg.password;
                } else if ($('.newPassword').val() == $('.password').val()) {
                    $scope.errorMsg = '新密码不能与原密码一样！';
                } else if ($('.newPassword').val() != $('.confirmNewPassword').val()) {
                    $scope.errorMsg = '新' + constant.validMsg.newPassword;
                } else {
                    $scope.showSpinner = true;
                    changeHttp();
                }
            }

            function changeHttp() {
                $http({
                    method: "POST",
                    url: '/api4/editAccount.php',
                    params: {
                        'userName': $('.userName').val(),
                        'password': $('.password').val(),
                        'newPassword': $('.newPassword').val()
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    if (response.data.code == 401) {
                        $scope.errorMsg = '用户名或原密码错误！';
                    }

                    if (response.data.code == 200) {
                        $scope.errorMsg = '修改成功！';
                    }
                }, function errorCallback(response) {
                    console.log(response.data.status);
                });
            }

            getCollectImg();
            //显示、隐藏收藏和下载图标
            function showIcon() {
                $('.cover-white').hover(function () {
                    $(this).parent().find('.collect-small').show();
                    $(this).parent().find('.download-small').show();
                }, function () {
                    $(this).parent().find('.collect-small').hide();
                    $(this).parent().find('.download-small').hide();
                });
                $('.download-small').hover(function () {
                    $(this).find('i').css('background-position', '-106px -1px');
                }, function () {
                    $(this).find('i').css('background-position', '-71px -1px');
                });
                $('.collect-small').mousemove(function () {
                    $(this).parent().find('.download-small').show();
                    $(this).show();
                });
                $('.download-small').mousemove(function () {
                    $(this).find('i').css('background-position', '-106px -1px');
                    $(this).parent().find('.collect-small').show();
                    $(this).show();
                });

                //取消收藏功能
                $scope.cancelCollect = function (imgUrl) {
                    cancelCollectImg(imgUrl);
                };
            }

            $scope.checkRepeat = function ($last) {
                if ($last) {
                    showIcon();
                }
            }

            function cancelCollectImg(imgUrl) {
                $http({
                    method: "POST",
                    url: '/api4/cancelCollectImg.php',
                    params: {
                        'userName': constant.userInfo.loginName(),
                        'url': imgUrl
                    }
                }).then(function successCallback(response) {
                    if (response.data.code == 200) {
                        $scope.imgTips = '取消收藏成功！';
                        $('.img-tips').css('margin-left', '-75px');
                        $scope.isShowTips = true;
                        $timeout(function () {
                            $scope.isShowTips = false;
                            getCollectImg();
                        }, 2000);
                    }
                });
            }

            function getCollectImg() {
                $http({
                    method: "POST",
                    url: '/api4/getCollectImgList.php',
                    params: {
                        'userName': constant.userInfo.loginName()
                    }
                }).then(function successCallback(response) {
                    if (response.data.code == 200) {
                        $scope.imgInfo = response.data.imgUrls;
                        showIcon();
                    }
                });
            }
        }
    ])
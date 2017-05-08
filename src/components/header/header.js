require("./header.css");

angular.module("header", [])
    .directive('header', () => {
        return {
            template: require("./header.html"),
            replace: false,
            restrict: "E",
            scope: {}
        }
    })
    .controller("headerCtrl", ["$scope", "$location", "$anchorScroll", "$http", "$state", "constant",
        ($scope, $location, $anchorScroll, $http, $state, constant) => {
            //回到顶部
            $('#elevator').hide();
            $scope.gotoTop = function () {
                $(document).scrollTop('0');
            };

            $(document).scroll(function () {
                if ($('body').scrollTop() <= '100') {
                    $('#elevator').hide();
                } else {
                    $('#elevator').show();
                }
            });

            //打开、关闭注册、登录弹框
            $scope.showInfo = function () {
                $scope.isShowInfo = true;
            }

            $scope.hideInfo = function () {
                $scope.isShowInfo = false;
            }

            $scope.openLogin = function () {
                $scope.isShowLoginIframe = true;
                $scope.isShowLogin = true;
            }

            $scope.openRegister = function () {
                $scope.isShowLoginIframe = true;
                $scope.isShowLogin = false;
            }

            $scope.closeLogin = function () {
                $scope.isShowLoginIframe = false;
            }

            var li = $('.header-left>ul>li');

            //进入主题专栏
            li.click(function () {
                li.removeClass('active');
                $(this).addClass('active');
                item = li.children().text();
                $state.go("frame.apiImg", {
                    reload: true
                });
            });

            $scope.isLogin = false;
            $scope.loginName = 'wandering';
        }
    ])
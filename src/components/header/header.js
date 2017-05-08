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
    .controller("headerCtrl", ["$scope", "$state", "constant",
        ($scope, $state, constant) => {
            var items;
            var li = $('.header-left>ul>li');

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

            //刷新页面时，保持当前主题专栏tab的高亮状态
            var location = window.location.href.split('=');
            console.log(encodeURI(location[1]));
            if (location[1] != undefined) {
                li.each(function () {
                    $(this).removeClass('active');
                    if (encodeURI($(this).children().text()) == location[1]) {
                        $(this).addClass('active');
                    }
                });
            }

            //点击进入相应的主题专栏
            li.click(function () {
                li.removeClass('active');
                $(this).addClass('active');
                items = $(this).children().text();
                $state.go('frame.apiImg', {
                    value: items
                }, {
                    reload: false
                });
            });

            $scope.isLogin = false;
            $scope.loginName = 'wandering';
        }
    ])
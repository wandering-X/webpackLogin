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
    .config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setTheme('white', {
            radius: 6,
            width: 2,
            length: 5,
            color: '#fff',
            position: 'absolute',
            top: '47px',
            left: '225px'
        });
    }])
    .controller("headerCtrl", ["$scope", "$state", "constant", "$http", "usSpinnerService", "$timeout",
        ($scope, $state, constant, $http, usSpinnerService, $timeout) => {
            var items;
            var li = $('.header-left>ul>li');
            $scope.isLogin = constant.isLogin();
            $scope.loginName = constant.userInfo.loginName();
            $scope.showSpinner = false; //loading加载
            $scope.showSpinner1 = false;
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
                //登录按钮是否可用
                function testDisabled() {
                    if ($('.userName').val() && $('.userPsd').val()) {
                        $scope.disabled = false;
                    } else {
                        $scope.disabled = true;
                    }
                }
                testDisabled();

                $scope.isDisabled = () => {
                    testDisabled();
                }

                //请求服务端前，先进行表单验证
                $scope.userLogin = () => {
                    if (!constant.validType.password.test($('.userPsd').val())) {
                        $scope.errorMsg = constant.validMsg.password;
                    } else {
                        $scope.showSpinner = true;
                        loginHttp();
                    }
                }

                function loginHttp() {
                    $http({
                        method: "POST",
                        url: '/api4/login.php',
                        params: {
                            'userName': $('.userName').val(),
                            'password': $('.userPsd').val()
                        }
                    }).then(function successCallback(response) {
                        $scope.showSpinner = false;
                        if (response.data.code == 401) {
                            $scope.errorMsg = '用户名或密码错误！';
                        }
                        console.log(response);
                        if (response.data.code == 200) {
                            $scope.errorMsg = '登陆成功！';
                            constant.setLogin(true);
                            $scope.isLogin = constant.isLogin();
                            constant.userInfo.setLoginName(response.data.userName);
                            $scope.loginName = constant.userInfo.loginName();
                            $timeout(function () {
                                $scope.isShowLoginIframe = false;
                                $scope.errorMsg = '';
                            }, 2000);
                        }
                    }, function errorCallback(response) {
                        console.log(response.data.status);
                    });
                }
            }

            $scope.openRegister = function () {
                $scope.isShowLoginIframe = true;
                $scope.isShowLogin = false;
                //注册按钮是否可用
                function testDisabled() {
                    if ($('.userName1').val() && $('.userPsd1').val() && $('.confirmUserPsd').val()) {
                        $scope.disabled1 = false;
                    } else {
                        $scope.disabled1 = true;
                    }
                }
                testDisabled();

                $scope.isDisabled1 = () => {
                    testDisabled();
                }

                //请求服务端前，先进行表单验证
                $scope.userRegister = () => {
                    if (!constant.validType.password.test($('.userPsd1').val())) {
                        $scope.codeErrorMsg = constant.validMsg.password;
                    } else if (!constant.validType.password.test($('.confirmUserPsd').val())) {
                        $scope.codeErrorMsg = constant.validMsg.password;
                    } else if ($('.confirmUserPsd').val() != $('.userPsd1').val()) {
                        $scope.codeErrorMsg = constant.validMsg.newPassword;
                    } else {
                        $scope.showSpinner1 = true;
                        registerHttp();
                    }
                }

                function registerHttp() {
                    $http({
                        method: "POST",
                        url: '/api4/register.php',
                        params: {
                            'userName': $('.userName1').val(),
                            'password': $('.userPsd1').val()
                        }
                    }).then(function successCallback(response) {
                        $scope.showSpinner1 = false;
                        if (response.data.code == 401) {
                            $scope.codeErrorMsg = '该用户名已被注册！';
                        }

                        if (response.data.code == 200) {
                            $scope.codeErrorMsg = '注册成功！';
                            $timeout(function () {
                                $scope.isShowLogin = true;
                                $scope.codeErrorMsg = '';
                            }, 2000);
                        }
                    }, function errorCallback(response) {
                        console.log(response.data.status);
                    });
                }
            }

            $scope.closeLogin = function () {
                $scope.isShowLoginIframe = false;
                $scope.showSpinner = false;
                $scope.showSpinner1 = false;
                $scope.errorMsg = '';
                $scope.codeErrorMsg = '';
            }

            $scope.openPersonal = function () {
                $state.go('frame.userInfo.personal', {
                    reload: false
                });
            }

            $scope.openAccount = function () {
                $state.go('frame.userInfo.account', {
                    reload: false
                });
            }

            $scope.quit = function () {
                constant.setLogin(false);
                $scope.isLogin = constant.isLogin();
                constant.userInfo.setLoginName('');
                $scope.loginName = constant.userInfo.loginName();
            }

            //刷新页面时，保持当前主题专栏tab的高亮状态
            var location = window.location.href.split('=');
            if (window.location.href.split('=')[0].split('?')[1] == 'item') {
                li.each(function () {
                    $(this).removeClass('active');
                    if (encodeURI($(this).children().text()) == window.location.href.split('=')[1].split('&')[0]) {
                        $(this).addClass('active');
                    }
                });
            }

            //点击进入相应的主题专栏
            li.click(function () {
                li.removeClass('active');
                $(this).addClass('active');
                items = $(this).children().text();
                if (items != '首页') {
                    $state.go('frame.apiImg', {
                        item: items
                    }, {
                        reload: false
                    });
                } else {
                    $state.go('frame.home', {
                        reload: false
                    });
                }
            });

            //搜索功能
            $scope.searchImg = function () {
                if ($scope.search == undefined) {
                    alert('搜索内容不能为空！');
                } else {
                    if (window.location.href.split('=')[0].split('?')[1] != 'search') {
                        window.location.href = window.location.href.split('=')[0].split('?')[0];
                    }
                    li.each(function () {
                        $(this).removeClass('active');
                    });
                    if (window.location.href != location[0].split('?')[0]) {
                        $state.go('frame.apiImg', {
                            search: $scope.search
                        }, {
                            reload: false
                        });
                    } else {
                        window.location.href = window.location.href + '?search=' + $scope.search;
                    }
                }
            }
        }
    ])
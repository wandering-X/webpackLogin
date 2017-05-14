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
            getPersonalInfo();

            function getPersonalInfo() {
                var $box,
                    imgObjNum = 0,
                    boxsLen = 0,
                    minColH = 0,
                    minHIndex = 0,
                    maxColH = 0,
                    maxHIndex = 0,
                    $boxs = [],
                    imgW = 251,
                    imgColNum = 3,
                    imgLeft = [],
                    imgColH = new Array(imgColNum);
                $scope.imgInfo = [];

                getCollectImg();

                for (var y = 0; y < imgColNum; y++) {
                    imgLeft[y] = imgW * y;
                }

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
                        $scope.checkRepeat = function ($last) {
                            if ($last) {
                                $('#loading').hide();
                                $boxs = $('.waterfall-img');
                                boxsLen = $boxs.length;
                                setPosition();
                                showIcon();
                                openBigImg();
                            }
                        }
                    };
                }

                function openBigImg() {
                    $scope.openImg = function (url, height) {
                        $scope.bigUrl = url;
                        if (height < 400) {
                            $scope.isShowBigImg2 = true;
                            $scope.isShowBigImg1 = false;
                        } else {
                            $scope.isShowBigImg1 = true;
                            $scope.isShowBigImg2 = false;
                        }
                    }
                    $scope.closeImg = function () {
                        $scope.isShowBigImg1 = false;
                        $scope.isShowBigImg2 = false;
                    }
                }

                $scope.checkRepeat = function ($last) {
                    if ($last) {
                        $('#loading').hide();
                        $boxs = $('.waterfall-img');
                        boxsLen = $boxs.length;
                        setPosition();
                        showIcon();
                        openBigImg();
                    }
                }

                function setPosition() {
                    for (var j = 0; j < boxsLen; j++) {
                        $box = $boxs.eq(j);
                        var $img = $box.find('img');
                        $scope.imgInfo[j].height = (imgW - 15) / $scope.imgInfo[j].width * $scope.imgInfo[j].height;
                        $img.css('height', $scope.imgInfo[j].height + 'px');
                        $('.cover-white').eq(j).css('height', $scope.imgInfo[j].height + 'px');
                        if (j < imgColNum) {
                            $box.css({
                                'left': (imgLeft[j % imgColNum] + 'px'),
                                'top': '0px'
                            });
                            imgColH[j] = $box.height();
                        } else {
                            minColH = Math.min.apply(null, imgColH);
                            minHIndex = $.inArray(minColH, imgColH);
                            $box.css({
                                'left': (imgLeft[minHIndex % imgColNum] + 'px'),
                                'top': (minColH + 15) + 'px'
                            });
                            imgColH[minHIndex] = $box.height() + $box.position().top;
                            console.log(imgColH);
                        }
                    }
                    maxColH = Math.max.apply(null, imgColH);
                    console.log(imgColH);
                    $('.waterfall').css('height', maxColH + 'px');
                    $('.personal-container').css('height', maxColH + 90 + 'px');
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
                            }, 2000);
                            var $box,
                                imgObjNum = 0,
                                boxsLen = 0,
                                minColH = 0,
                                minHIndex = 0,
                                maxColH = 0,
                                maxHIndex = 0,
                                $boxs = [],
                                imgW = 251,
                                imgColNum = 3,
                                imgLeft = [],
                                imgColH = new Array(imgColNum);
                            $scope.imgInfo = [];

                            getCollectImg();

                            for (var y = 0; y < imgColNum; y++) {
                                imgLeft[y] = imgW * y;
                            }
                        }
                    });
                }

                function getCollectImg() {
                    $('#loading').show();
                    $http({
                        method: "POST",
                        url: '/api4/getCollectImgList.php',
                        params: {
                            'userName': constant.userInfo.loginName()
                        }
                    }).then(function successCallback(response) {
                        if (response.data.code == 200) {
                            boxsLen = response.data.size;
                            for (var a = 0; a < boxsLen; a++) {
                                $scope.imgInfo.push({
                                    'largeUrl': response.data.imgUrls[a].largeUrl,
                                    'url': response.data.imgUrls[a].url,
                                    'height': response.data.imgUrls[a].height,
                                    'width': response.data.imgUrls[a].width
                                });
                            }
                        }
                    });
                }
            }

            $scope.getPersonal = function () {
                getPersonalInfo();
            }
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



        }
    ])
require("./apiImg.css");

angular.module("apiImg", [])
    .directive('apiImg', () => {
        return {
            template: require("./apiImg.html"),
            replace: false,
            restrict: "E",
            scope: {}
        }
    })
    .controller("apiImgCtrl", ["$scope", "$http", "$state", "constant", "$stateParams", "$timeout",
        ($scope, $http, $state, constant, $stateParams, $timeout) => {
            var imgId,
                time,
                $box,
                url,
                start = 0,
                imgObjNum = 0,
                boxsLen = 0,
                minColH = 0,
                minHIndex = 0,
                lastIndex = 0,
                imgKey = [],
                $boxs = [],
                imgW = 251,
                imgColNum = 5,
                imgLeft = [],
                imgColH = new Array(imgColNum);
            $scope.imgInfo = [];
            $(document).scrollTop('0');
            $('#loading').css({
                'position': 'absolute',
                'top': '50%',
                'left': '0'
            });
            var Item = $stateParams.item,
                search = $stateParams.search;

            for (var y = 0; y < imgColNum; y++) {
                imgLeft[y] = imgW * y;
            }

            if (Item == '首页') {
                $state.go('frame.home', {
                    reload: false
                });
            } else if (Item == '发现') {
                url = '/api1/favorite/quotes';
            } else if (Item == '壁纸') {
                url = '/api2';
            } else if (Item == '明星') {
                url = '/api1/favorite/people';
            } else if (Item == '摄影') {
                url = '/api1/favorite/photography';
            } else if (Item == '搞笑') {
                url = '/api1/favorite/funny';
            } else if (Item == '家居') {
                url = '/api1/favorite/home';
            } else if (Item == '漫画') {
                url = '/api1/favorite/anime';
            } else if (Item == 'UI设计') {
                url = '/api1/favorite/web_app_icon';
            } else if (Item == '旅行') {
                url = '/api1/favorite/travel_places';
            } else if (Item == '造型') {
                url = '/api1/favorite/modeling_hair';
            } else if (Item == '美食') {
                url = '/api1/favorite/food_drink';
            } else {
                url = '/api3';
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
                $('.collect-small').hover(function () {
                    $(this).find('i').css('background-position', '-208px -1px');
                }, function () {
                    $(this).find('i').css('background-position', '-175px -1px');
                });
                $('.download-small').hover(function () {
                    $(this).find('i').css('background-position', '-106px -1px');
                }, function () {
                    $(this).find('i').css('background-position', '-71px -1px');
                });
                $('.collect-small').mousemove(function () {
                    $(this).find('i').css('background-position', '-208px -1px');
                    $(this).parent().find('.download-small').show();
                    $(this).show();
                });
                $('.download-small').mousemove(function () {
                    $(this).find('i').css('background-position', '-106px -1px');
                    $(this).parent().find('.collect-small').show();
                    $(this).show();
                });

                //收藏功能
                $scope.collect = function (url) {
                    if (!constant.isLogin()) {
                        $scope.imgTips = '请先登录，开启收藏功能！';
                        $('#img-tips').css('margin-left', '-166px');
                        $scope.isShowTips = true;
                        $timeout(function () {
                            $scope.isShowTips = false;
                        }, 3000);
                    } else {

                    }
                };
            }

            //查看大图
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

            //进行滚动加载
            window.onscroll = function () {
                if (checkScroll()) {
                    imgApiHttp(lastIndex, Item);
                    $scope.checkRepeat;
                }
            }

            //监测页面滚动，判断是否可以加载更多图片
            function checkScroll() {
                var scrollTop = $(document).scrollTop(),
                    documentH = $(document).height(),
                    windowH = $(window).height();
                return (documentH - windowH - scrollTop == 0) ? true : false;
            }

            imgApiHttp(lastIndex, Item);
            //检测ng-repeat是否已经渲染完毕，如果是再设置瀑布流图片的位置，
            //否则获取图片位置时会出错，因为ng-repeat还没渲染完
            $scope.checkRepeat = function ($last) {
                if ($last) {
                    $boxs = $('.waterfall-img');
                    boxsLen = $boxs.length;
                    $('#loading').css('position', '');
                    setPosition(lastIndex);
                    showIcon();
                    openBigImg();
                }
            }

            //设置瀑布流图片的位置
            function setPosition(Index) {
                for (var j = Index; j < boxsLen; j++) {
                    $box = $boxs.eq(j);
                    var $img = $box.find('img');
                    $box.attr('index', j);
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
                    }
                }
                $('.waterfall').css('height', minColH + 'px');
                lastIndex = j;
            }

            //发送请求，获取图片
            function imgApiHttp(Index, item) {
                //请求失败处理
                function errorCallback() {
                    $('#loading').text('图片加载失败！');
                }

                if (item == '发现' || item == 'UI设计' || item == '明星' || item == '搞笑' || item == '摄影' || item == '家居' || item == '漫画' || item == '旅行' || item == '造型' || item == '美食') {
                    $http({
                        method: "get",
                        url: url,
                        params: {
                            'limit': constant.imgNum,
                            'max': (imgId == undefined) ? '' : imgId

                        }
                    }).then(function successCallback(response) {
                        imgId = response.data.pins[constant.imgNum - 1].pin_id; //获取不同图片的标志
                        for (var a = 0; a < constant.imgNum; a++) {
                            //向$scope.imgInfo依次添加对象和属性
                            var bigUrl = '//img.hb.aicdn.com/' + response.data.pins[a].file.key,
                                smallUrl = bigUrl + '_fw320';
                            if (item == '搞笑') {
                                if (response.data.pins[a].file.height < 450) {
                                    smallUrl = bigUrl;
                                }
                            }
                            $scope.imgInfo.push({
                                'bigUrl': bigUrl,
                                'smallUrl': smallUrl,
                                'title': response.data.pins[a].board.title,
                                'height': response.data.pins[a].file.height,
                                'width': response.data.pins[a].file.width
                            });
                        }
                    }, errorCallback);
                } else if (item == '壁纸') {
                    $http({
                        method: "get",
                        url: url,
                        params: {
                            'page_size': constant.imgNum,
                            'time': (time == undefined) ? '0' : time
                        }
                    }).then(function successCallback(response) {
                        time = Date.parse(new Date(response.data.data.images[constant.imgNum - 1].pub_time)) / 1000; //获取不同图片的标志
                        for (var a = 0; a < constant.imgNum; a++) {
                            //向$scope.imgInfo依次添加对象和属性
                            $scope.imgInfo.push({
                                'bigUrl': '//wpstatic.zuimeia.com/' + response.data.data.images[a].image_url,
                                'smallUrl': '//wpstatic.zuimeia.com/' + response.data.data.images[a].image_url,
                                'title': response.data.data.images[a].description,
                                'height': response.data.data.images[a].height,
                                'width': response.data.data.images[a].width
                            });
                        }
                    }, errorCallback);
                } else {
                    $http({
                        method: "get",
                        url: url,
                        params: {
                            'start': start,
                            'reqType': 'ajax',
                            'reqFrom': 'result',
                            'query': search
                        }
                    }).then(function successCallback(response) {
                        start = start + constant.imgNum;
                        for (var a = 0; a < constant.imgNum; a++) {
                            //向$scope.imgInfo依次添加对象和属性
                            $scope.imgInfo.push({
                                'bigUrl': response.data.items[a].thumbUrl,
                                'smallUrl': response.data.items[a].thumbUrl,
                                'title': response.data.items[a].title,
                                'height': response.data.items[a].height,
                                'width': response.data.items[a].width
                            });
                        }
                    }, errorCallback);
                }


            }
        }
    ])
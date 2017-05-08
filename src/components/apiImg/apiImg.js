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
    .controller("apiImgCtrl", ["$scope", "$http", "$state", "constant", "$stateParams",
        ($scope, $http, $state, constant, $stateParams) => {
            var imgId,
                $box,
                imgObjNum = 0,
                boxsLen = 0,
                minColH,
                minHIndex,
                lastIndex = 0,
                imgKey = [],
                $boxs = [],
                imgW = 251,
                imgColNum = 5,
                imgLeft = [],
                imgColH = new Array(imgColNum);
            $scope.imgInfo = [];
            $('#loading').css({'position':'absolute','top':'50%','left':'0'});
            var item = $stateParams.value;
            
            
            // // console.log(window.location.href);
            // if (location[1] == undefined ) {
            //     window.location.href = window.location.href + '?item=' + item;
            // }

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
            }

            //进行滚动加载
            window.onscroll = function () {
                if (checkScroll()) {
                    imgApiHttp(lastIndex, item);
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

            imgApiHttp(lastIndex, item);
            //检测ng-repeat是否已经渲染完毕，如果是再设置瀑布流图片的位置，
            //否则获取图片位置时会出错，因为ng-repeat还没渲染完
            $scope.checkRepeat = function ($last) {
                if ($last) {
                    $boxs = $('.waterfall-img');
                    boxsLen = $boxs.length;
                    $('#loading').css('position','');
                    setPosition(lastIndex);
                    showIcon();
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
            function imgApiHttp(Index, Item) {
                $http({
                    method: "get",
                    url: '/api1/all',
                    params: {
                        'limit': constant.imgNum,
                        'max': (imgId == undefined) ? '' : imgId
                    }
                }).then(function successCallback(response) {
                    imgId = response.data.pins[constant.imgNum - 1].pin_id; //获取不同图片的标志
                    for (var a = 0; a < constant.imgNum; a++) {
                        //向$scope.imgInfo依次添加对象和属性
                        $scope.imgInfo.push({
                            'url': '//img.hb.aicdn.com/' + response.data.pins[a].file.key,
                            'smallUrl': '//img.hb.aicdn.com/' + response.data.pins[a].file.key + '_fw320',
                            'title': response.data.pins[a].board.title,
                            'height': response.data.pins[a].file.height,
                            'width': response.data.pins[a].file.width
                        });
                    }
                }, function errorCallback() {
                    $('#loading').text('图片加载失败！');
                });
            }
        }
    ])
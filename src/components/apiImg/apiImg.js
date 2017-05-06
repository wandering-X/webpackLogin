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
    .controller("apiImgCtrl", ["$scope", "$location", "$anchorScroll", "$http", "$interval", "$state", "constant",
        ($scope, $location, $anchorScroll, $http, $interval, $state, constant) => {
            var imgId,
                item,
                $box,
                minColH,
                minHIndex,
                lastIndex = 0,
                imgKey = [],
                $boxs = [],
                imgIndex = [],
                imgW = 251,
                imgColNum = 5,
                imgLeft = [],
                imgColH = new Array(imgColNum);

            for (var y = 0; y < imgColNum; y++) {
                imgLeft[y] = imgW * y;
            }

            waterfall();
            window.onscroll = function () {
                if (checkScroll()) {
                    var $loading = $("#loading");
                    var $oBox = $("<div class='waterfall-img'' index=1 ng-repeat='img in imgInfo' ng-init='checkRepeat($last)'>").before($loading);
                    var $oA = $("<a ng-click='openImg(img.url)'>").appendTo($oBox);
                    var $oDiv = $("<div class='cover-white'></div>").appendTo($oA);
                    $("<img ng-src='{{img.smallUrl}}'>").after($oDiv);
                    $("<span>{{img.title}}</span>").after($oA);
                    waterfall();
                };
            }

            function checkScroll() {
                var scrollBottomH = minColH - 100;
                var scrollTop = $(window).scrollTop();
                var documentH = $(document).height();
                return (scrollBottomH < scrollTop + documentH) ? true : false;
            }

            function waterfall() {
                imgApiHttp(lastIndex);
                $scope.checkRepeat = function ($last) {
                    if ($last) {
                        $scope.isLoading = false;
                        $boxs = $('.waterfall-img');
                        boxsLen = $boxs.length;
                        setPosition(lastIndex);
                    }
                }

                function setPosition(Index) {
                    for (var j = Index; j < boxsLen; j++) {
                        $box = $boxs.eq(j);
                        $box.attr('index', j + 1);
                        var $img = $box.find('a>img');
                        $scope.imgInfo[j].height = (imgW - 15) / $scope.imgInfo[j].file.width * $scope.imgInfo[j].file.height;
                        $img.css('height', $scope.imgInfo[j].height + 'px');

                        if (j < imgColNum) {
                            $box.css({
                                'left': (imgLeft[j % imgColNum] + 'px'),
                                'top': '0px'
                            });
                            imgColH[j] = $box.height();
                            console.log(j);
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
                    lastIndex = j;
                    console.log(lastIndex);
                }

                function imgApiHttp(Index) {
                    $scope.isLoading = true;
                    $http({
                        method: "get",
                        url: '/api1/all',
                        params: {
                            'limit': constant.imgNum,
                            'max': (imgId == undefined) ? '' : imgId
                        }
                    }).then(function successCallback(response) {
                        $scope.imgInfo = response.data.pins;
                        imgId = response.data.pins[constant.imgNum - 1].pin_id;
                        for (var i = Index; i < constant.imgNum; i++) {
                            $scope.imgInfo[i].url = '//img.hb.aicdn.com/' + response.data.pins[i].file.key;
                            $scope.imgInfo[i].smallUrl = $scope.imgInfo[i].url +  '_fw320';
                            $scope.imgInfo[i].title = response.data.pins[i].board.title;
                        }
                    }, function errorCallback() {
                        console.log('图片加载失败！');
                    });
                }
            }
        }
    ])
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
    .controller("apiImgCtrl", ["$scope", "$location", "$anchorScroll", "$http", "$state", "constant",
        ($scope, $location, $anchorScroll, $http, $state, constant) => {
            var imgId, item;
            var imgKey = [];
            var $boxs,imgIndex = [];
            imgApiHttp();

            $scope.checkRepeat = function ($last) {
                if ($last) {
                     getIndex();
                    
                }
            }

            function getIndex() {
                var lastIndex;
                $boxs = $('.waterfall-img');
                $boxs.each(function (index) {
                    $(this).attr('index', index + 1);
                    lastIndex = ( index + 1 );
                });
                console.log(lastIndex);
            }

            function getTop() {
                $boxs.each(function(index){
                    if(index <= 5){
                        $(this).css('top','0');
                    }else{
                        imgIndex[index] = $(this).attr('index');
                        // lastIndex[index] = 
                        $(this).css('top',getLastTop()+'px');
                    }
                });
            }

            function imgApiHttp() {
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
                    for (var i = 0; i < constant.imgNum; i++) {
                        $scope.imgInfo[i].url = '//img.hb.aicdn.com/' + response.data.pins[i].file.key;
                        $scope.imgInfo[i].title = response.data.pins[i].board.title;
                    }
                }, function errorCallback() {
                    console.log('图片加载失败！');
                });
            }
        }
    ])
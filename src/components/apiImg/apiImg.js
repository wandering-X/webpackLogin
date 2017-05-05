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
            var $boxs;
            imgApiHttp();
            getIndex();

            function getIndex() {
                $boxs = $('.waterfall-img');
                $boxs.each(function(index) {
                    $(this).attr('index', index);
                    alert($(this).attr('index'));
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
                    getIndex();
                }, function errorCallback() {
                    console.log('图片加载失败！');
                });
            }
        }
    ])
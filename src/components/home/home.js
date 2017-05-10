require("./home.css");
require('../commonStyle/css/swiper-3.4.2.min.css')

require('../commonJs/swiper-3.4.2.jquery.min.js');

angular.module("home", [])
    .directive('home', () => {
        return {
            template: require("./home.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .controller("homeCtrl", ["$scope", "$state", "constant", "$http",
        ($scope, $state, constant, $http) => {
            $(document).scrollTop('0');
            //轮播图
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: 5000,
                speed: 1000,
                loop: true,
                effect: 'fade',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                lazyLoadingInPrevNextAmount: 2,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            })

            $http({
                method: 'get',
                url: '/api4' + 'getHotSearchList.php'
            }).then(function successCallback(response) {
                $scope.recommends = response.data.data;

            });

            $scope.checkRepeat = function ($last) {
                if ($last) {
                    $('.img-box').click(function () {
                        console.log('1');
                        var search = $(this).find('a>.item').text();
                        console.log(search);
                        var url = $state.href('frame.apiImg', {
                            search: search
                        }, {
                            reload: true
                        });
                        window.open(url, '_blank');
                    });
                }
            }

        }
    ])
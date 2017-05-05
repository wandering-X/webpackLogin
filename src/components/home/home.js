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
    .controller("homeCtrl", ["$scope", "$http", "$state", "constant",
        ($scope, $http, $state, constant) => {
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
        }
    ])
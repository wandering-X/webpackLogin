angular.module("app", [
        "ui.router",
        "angularSpinner",
        "constant",
        "home",
        "header",
        "apiImg",
        "userInfo"
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/frame/frame.home");

        $stateProvider
            .state("frame", {
                url: "/frame",
                template: require("../frame/frame.html")
            })
            .state("frame.home", {
                url: "/frame.home",
                template: require("../home/home.html")
            })
            .state("frame.apiImg", {
                url: "/frame.apiImg?:item:search",
                template: require("../apiImg/apiImg.html")
            })
            .state("frame.userInfo", {
                url: "/frame.userInfo",
                template: require("../userInfo/userInfo.html")
            })
            .state("frame.userInfo.personal", {
                url: "/frame.userInfo.personal",
                template: require("../userInfo/personal/personal.html")
            })
            .state("frame.userInfo.account", {
                url: "/frame.userInfo.account",
                template: require("../userInfo/account/account.html")
            })
    });
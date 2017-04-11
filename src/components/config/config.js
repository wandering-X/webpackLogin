angular.module("app",["ui.router","leftButton","rightButton","login","loginInfo"])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/frame/frame.login");

        $stateProvider
            .state("frame", {
                url: "/frame",
                template: require("../frame/frame.html")
            })
            .state("frame.login", {
                url: "/frame.login",
                template: require("../login/login.html")
                })
            .state("frame.loginInfo", {
                url: "/frame.loginInfo/:value",
                template: require("../login_info/login_info.html")
                })
    });
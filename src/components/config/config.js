angular.module("app",[
    "ui.router",
    "angularSpinner",
    "constant",
    "login",
    // "loginInfo",
    // "loginFind",
    // "register",
    // "reset",
    "home",
    "header",
    "apiImg"
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
                url: "/frame.apiImg?:value",
                template: require("../apiImg/apiImg.html")
            })
            // .state("frame.login", {
            //     url: "/frame.login",
            //     template:require("../login/login.html")                          
            // })
            // .state("frame.loginFind", {
            //     url: "/frame.loginFind",
            //     template: require("../login_find/login_find.html")
            // })
            // .state("frame.loginInfo", {
            //     url: "/frame.loginInfo",
            //     template: require("../login_info/login_info.html")
            // })
            // .state("frame.register", {
            //     url: "/frame.register",
            //     template: require("../register/register.html")
            // })
            // .state("frame.reset", {
            //     url: "/frame.reset",
            //     template: require("../reset/reset.html")
            // })
    });
angular.module("constant", [])
    .factory("constant", [function ($scope) {
        //本地存储用户师傅铺登录
        if (localStorage.islogin) {
            localStorage.islogin = getLogin();
        } else {
            localStorage.islogin = false;
        }

        function setLogin(login) {
            localStorage.islogin = login;
        }

        function getLogin() {
            var islogin = (localStorage.islogin === 'true') ? true :
                false;
            return islogin;
        }

        //本地存储用户名
        if (localStorage.loginName) {
            localStorage.loginName = getLoginName();
        } else {
            localStorage.loginName = "";
        }

        function setLoginName(loginName) {
            localStorage.loginName = loginName;
        }

        function getLoginName() {
            return localStorage.loginName;
        }

        return {
            setLogin: setLogin,
            isLogin: getLogin,
            imgNum: 40,
            userInfo: {
                setLoginName: setLoginName,
                loginName: getLoginName,
                password: ""
            },
            imgCollect: [{
                isCollect: false,
                imgUrl: '',
                width: 0,
                height: 0
            }],
            validMsg: {
                mobile: "手机号不正确！",
                password: "密码不能少于6位！",
                newPassword: "密码输入不一致！"
            },
            validType: {
                password: new RegExp("^\\S{6,20}$")
            },
        }
    }])
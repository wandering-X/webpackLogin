angular.module("constant", [])
    .factory("constant", [function ($scope) {
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

        return {
            setLogin: setLogin,
            isLogin: getLogin,
            imgNum: 40,
            userInfo: {
                loginName: '',
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
                mobile: new RegExp("^1[34578]\\d{9}$"),
                password: new RegExp("^\\S{6,20}$")
            },
        }
    }])

var mainBusinessServices = angular.module('mainBusinessServices', ['ngCookies']);

mainBusinessServices.factory('setCreds', ['$cookies', function($cookies) {
    return function(un, em, uid, token) {
        $cookies.put('token', token);
        $cookies.put('userId', uid);
        $cookies.put('username', un);
        $cookies.put('email', em);
    }
}]);

mainBusinessServices.factory('checkCreds', ['$cookies', function($cookies) {
    return function() {
        var returnVal = false;
        var token = $cookies.get('token');
        if (token !== undefined && token !== "") {
            returnVal = true;
        }
        // console.log(returnVal);
        return returnVal;
    }
}]);

mainBusinessServices.factory('deleteCreds', ['$cookies', function($cookies) {
    return function() {
        // $cookies.blogCreds = "";
        // $cookies.blogUsername = "";
        $cookies.remove('username')
        $cookies.remove('email')
        $cookies.remove('token')
        $cookies.remove('userId')
    }
}]);

mainBusinessServices.factory('getToken', ['$cookies', function($cookies) {
    return function () {
        var returnVal = "";
        var token = $cookies.get('token');
        if (token !== undefined || token !== "") {
            returnVal = token;
        }
        return returnVal;
    }
}]);

mainBusinessServices.factory('getUsername', ['$cookies', function($cookies) {
    return function() {
        var returnVal = "";
        var username = $cookies.get('username');
        if (username !== undefined && username !== "") {
            returnVal = username;
        }
        return returnVal;
    }
}]);

mainBusinessServices.factory('getUserId', ['$cookies', function($cookies) {
    return function() {
        var returnVal = "";
        var username = $cookies.get('userId');
        if (username !== undefined && username !== "") {
            returnVal = username;
        }
        return returnVal;
    }
}]);

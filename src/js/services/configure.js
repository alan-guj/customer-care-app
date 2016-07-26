
angular.module("configure",[])
    .constant("web_servers",JSON.parse(window.sessionStorage.web_servers||"{}"))
    .constant("services",JSON.parse(window.sessionStorage.services||"{}"))
    .constant("sys_params",JSON.parse(window.sessionStorage.sys_params||"{}"))
    .constant('oauth_params',JSON.parse(window.sessionStorage.oauth_params||"{}"));






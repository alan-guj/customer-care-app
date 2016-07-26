// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app=angular.module('customer_care_web_server', ['ionic','angular-popups', 'ionic-datepicker','CustomerCareService','configure','ionic-citypicker','ngCookies','angular-oauth2'])

.run(function($rootScope,$window,OAuth,OAuthToken,sessionStorage,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  OAuthToken.getToken = function() {
      return sessionStorage.getObject('token');
  }
  OAuthToken.setToken = function(data) {
      sessionStorage.setObject('token',data);
  }


  $rootScope.$on('oauth:error', function(event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
          return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('invalid_token' === rejection.data.error) {
          return OAuth.getRefreshToken();
      }

      // Redirect to `/login` with the `error_reason`.
      return $window.location.href = '/login?error_reason=' + rejection.data.error;
  });

})


    /***************************************************************
     * 设置时间时间格式
     ****************************************************************/
.directive('dateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function formatter(value) {
                console.log(value);
                return dateFilter(value, 'mediumDate'); //format
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);

        }
    };
}])


.config(function($stateProvider, $urlRouterProvider,$httpProvider,$compileProvider,OAuthTokenProvider, OAuthProvider, oauth_params,ionicDatePickerProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|wxlocalresource|weixin):/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|sms):/);



    //OAuthTokenProvider.configure({
        //name:'token',
        //options:{
            //secure:true
        //}
    //});
    OAuthProvider.configure(oauth_params);


    //OAuthToken.getToken = function(data) {
        //localConfig.getObject('token');
    //}
    //OAuthToken.setToken = function(data) {
        //localConfig.getObject('token',data);
    //}


    /*********************************************************
     * 初始化拦截器
     * ******************************************************/

    //$httpProvider.interceptors.push(['$q',  '$window' , 'OAuthToken',function($q, $window,OAuthToken) {
        //console.log(OAuthToken.getAccessToken());
        //return {
            //'request': function (config) {
                //config.headers = config.headers || {};
                //if (OAuthToken.getAccessToken()) {
                    //config.headers.Authorization = 'Bearer ' + OAuthToken.getAccessToken();
                //}
                //return config;
            //},
            //'responseError': function(response) {
                //console.log('responseError');
                //console.log(response);
                //if(response.status === 401 || response.status === 403) {
                    //console.log('reidrect...........');
                    //$window.location.href="/"
                //}
                //return $q.reject(response);
            //}

        //}
    //}]);



    /**********************************************************
     * 初始化UI-Router
     * *******************************************************/

    $stateProvider
        .state('login',{
            url:'/login',
            templateUrl:'templates/login.html',
            controller:'login_ctrl'
        })
        .state('customer_list', {
            cache: true,
            url: '/customer_list',
            templateUrl: 'templates/customer_list.html',
            controller: 'customer_list_ctrl'
        })
        .state('customer_detail', {
            cache: false,
            url: '/customers/:customer_id',
            templateUrl: 'templates/customer_detail.html',
            controller: 'customer_detail_ctrl'
        })
        .state('schedule_list', {
            cache: true,
            url: '/schedule_list',
            templateUrl: 'templates/schedule_list.html',
            controller: 'schedule_list_ctrl'
        })
        .state('schedule_detail', {
            cache: false,
            url: '/schedules/:schedule_id',
            templateUrl: 'templates/schedule_item_detail.html',
            controller: 'schedule_item_detail_ctrl'
        })
        .state('group_homepage', {
            cache: false,
            url: '/group_homepage',
            templateUrl: 'templates/group_homepage.html',
            controller: 'group_homepage_ctrl'
        })
        .state('personal_homepage', {
            cache: false,
            url: '/personal_homepage',
            templateUrl: 'templates/personal_homepage.html',
            controller: 'personal_homepage_ctrl',
            onEnter: function($window,$state,current_user){
                var isManager = false;
                if(current_user.hasOwnProperty("enpinfo") && current_user.enpinfo && current_user.enpinfo.hasOwnProperty("isManager")){
                    isManager = current_user.enpinfo.isManager;
                }
                var tmpDate = (new Date()).Format("yyyy-MM-dd");
                if($window.localStorage.hasOwnProperty("global_visit_time") && $window.localStorage.hasOwnProperty("global_visit_num")){
                    if($window.localStorage["global_visit_time"]!=tmpDate ||
                        $window.localStorage["global_visit_num"]==0
                       ){
                        $window.localStorage["global_visit_num"]=1;
                        $window.localStorage["global_visit_time"] = tmpDate;
                        if(isManager){
                            if($window.localStorage["global_visit_panel"]=="group"){
                                $state.go('group_homepage');
                            }else{
                                $window.localStorage["global_visit_panel"] = "personal";
                            }
                        }
                    }else{
                        $state.go('schedule_list');
                    }
                }else{
                    $window.localStorage["global_visit_num"]=1;
                    $window.localStorage["global_visit_time"] = tmpDate;
                    if(isManager){
                        $window.localStorage["global_visit_panel"] = "group";
                        $state.go('group_homepage');
                    }else{
                        $window.localStorage["global_visit_panel"] = "personal";
                    }
                }
            }
        })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/personal_homepage');



    /*********************************************************
     * 初始化Datepicker
     ********************************************************/
    var datePickerObj = {
        inputDate: new Date(),
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '关闭',
        mondayFirst: false,
        weeksList: ["日","一", "二", "三", "四", "五", "六" ],
        monthsList: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        templateType: 'modal',
        from: new Date(2013, 1, 1),
        to: new Date(2020, 12, 31),
        showTodayButton: true,
        dateFormat: 'yyyy年MM月dd日',
        closeOnSelect: false,
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

});

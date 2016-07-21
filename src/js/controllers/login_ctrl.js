app.controller('login_ctrl',
        ['$scope','$http','$state','OAuth','OAuthToken','oauth_params','current_user','localConfig',
function( $scope,  $http,  $state,  OAuth,  OAuthToken,  oauth_params,  current_user,  localConfig){
    $scope.userinfo={};
    $scope.ready = false;



    $scope.login = function(){
        OAuth.getAccessToken($scope.userinfo)
            .then(function(resp){
                console.log('oauth_params:',oauth_params);
                console.log('login:',resp);
                $http.get(oauth_params.baseUrl+oauth_params.userPath).then(function(resp){
                    console.log('current_user:',resp.data.user);
                    current_user.login(resp.data.user);
                    $state.go('schedule_list');
                })
            });
    }
}])

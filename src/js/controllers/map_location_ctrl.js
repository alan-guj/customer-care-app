app.controller('map_location_ctrl', [ 'services','$scope', '$ionicModal','$sce',function(services,$scope, $ionicModal,$sce) {



   //var marker = 'coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院';
   //$scope.mapurl = services.jssdk_location.replace(":marker",marker);


   //返回主页面
   $scope.backMainPage = function(){
       $scope.map_location_modal.hide();
   }


   $scope.$on('show_map_location',function(event,locInfo){
       var marker = 'coord:'+locInfo.latlng.lat+','+locInfo.latlng.lng+';'
       marker += 'addr:'+locInfo.poiaddress;
       $scope.mapurl = services.jssdk_location.replace(":marker",marker);
       $scope.jssdk_location = function(src) {
           return $sce.trustAsResourceUrl(src);
       }
   })
} ])

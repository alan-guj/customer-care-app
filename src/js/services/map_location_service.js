app.service('map_location',  [ '$rootScope', '$filter', '$ionicModal','$sce','services','locationPoimaker', function(  $rootScope, $filter, $ionicModal,$sce,services,locationPoimaker) {

    var $scope = $rootScope.$new();
    var callbacks = {};
    var map = null;
    var marketInfo = null;
    $scope.isHaveLocationData = false;
    $scope.isSingleLocation = true;

    var map_location = {
        getLocation: function(success, fail){//添加位置
           callbacks = {
                success:success,
                fail:fail,
            }
            showAddLocationModal();
        },
        showSingleLocation: function(locInfo,success, fail){//单个地点浏览
           $scope.isSingleLocation = true;
           var data = new Array({locInfo:locInfo});
           showLocationPoimakerModal(data);
        },
        showMultiLocation:function(param,success, fail){//用户位置
          $scope.isSingleLocation = false;
          if(param.scope.value == "my"){
              locationPoimaker.getUserLocations({user_id:param.userId,date:param.date.toISOString(),range:param.time_range.value},function(data){
                 showLocationPoimakerModal(data.logs);
              });
          }else if( param.scope.value == "group"){
              locationPoimaker.getGrpLocations({grp_id:param.grpId,date:param.date.toISOString(),range:param.time_range.value},function(data){
                showLocationPoimakerModal(data.logs);
              });
          }
        }
    };


    /**********************************************************
     * 获取定位信息的位置
     * *******************************************************/
     function showAddLocationModal(data){
        $ionicModal.fromTemplateUrl('templates/add_location.html',{
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.add_location_modal = modal;
            $scope.add_location_modal.show();
        });
      }

      var locInfo =null;

    /************************************************************************
     * 监听选择的地图位置
     * *********************************************************************/
     window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            locInfo = loc;
        }
      }, false);

      /************************************************************************
       * 取消位置
       * *********************************************************************/
      $scope.cancelSend = function(){
        $scope.add_location_modal.remove();
      };

       /************************************************************************
         * 发送位置
         * *********************************************************************/
      $scope.submitSend = function(){
          if(!locInfo){
              Popup.notice('请选择位置',2000);
          }
          else {
              callbacks.success && callbacks.success(locInfo);
              $scope.add_location_modal.remove();
          }
      };


    /**********************************************************
     * 查看定位信息的位置
     * *******************************************************/
     function showLocationPoimakerModal(data){
      $ionicModal.fromTemplateUrl('templates/map_location.html',{
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal){
          $scope.locaiton_poimaker_modal = modal;
          $scope.locaiton_poimaker_modal.show();
          showMulitPoiMaker(data);
      });
    }


    /**********************************************************
     * 地图标记
     * *******************************************************/
    function showMulitPoiMaker(data){
       $scope.mapItemLst = data;
        var makers = new Array();
        for (var i=0;i<data.length;i++){
          var locInfo = data[i].locInfo;
          makers.push({showinfo:locInfo.poiaddress,position:new qq.maps.LatLng(locInfo.latlng.lat,locInfo.latlng.lng)})
        }

        var center = new qq.maps.LatLng(32.03951245042539, 118.78486633300781);
        //默认选取第一个点为中心
        if(makers.length > 0){
          center =  new qq.maps.LatLng(data[0].locInfo.latlng.lat,data[0].locInfo.latlng.lng);
        }
        //创建地图
        map = new qq.maps.Map(document.getElementById("container"), {
            center: center,
            zoom:13
        });


            //添加到提示窗
        marketInfo = new qq.maps.InfoWindow({
            map: map
        });

        //如果没有数据，将地图的中心初始化到当前所在城市
        if(makers.length == 0){
            //获取城市列表接口设置中心点
            citylocation = new qq.maps.CityService({
                complete : function(result){
                    map.setCenter(result.detail.latLng);
                }
            });
            //调用searchLocalCity();方法    根据用户IP查询城市信息。
            citylocation.searchLocalCity();
        }else{
            for (var i=0;i<makers.length;i++){
               (function(n){
                var maker = new qq.maps.Marker({
                   position:makers[n].position,
                   map:map
                 });

                //获取标记的点击事件
                qq.maps.event.addListener(maker, 'click', function() {
                    marketInfo.open();
                    marketInfo.setContent('<div style="font-size:12px;text-align:left;white-space:wrap;margin:5px;">' + makers[n].showinfo +'</div>');
                    marketInfo.setPosition(makers[n].position);
                  });
                })(i);
            }

            //默认展开第一个点
            $scope.selectAPosition(data[0]);
        }
    }


     /**********************************************************
     * 地图页面，切到列表页
     * *******************************************************/
   $scope.backMainPage = function(){
       $scope.locaiton_poimaker_modal.remove();
   }


    /**********************************************************
     * 地图页面，切到列表页
     * *******************************************************/
   $scope.listPage = function(){
        $ionicModal.fromTemplateUrl('templates/map_location_list.html',{
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.locaiton_poimaker_list_modal = modal;
            $scope.locaiton_poimaker_list_modal.show();
        });
      }


    /**********************************************************
     * 列表页，切回地图页面
     * *******************************************************/
   $scope.backMapPage = function(){
      $scope.locaiton_poimaker_list_modal.remove();
   }


    /**********************************************************
     * 列表页，选择位置
     * 选择位置后，地图中心切换到改点，并显示该位置的信息
     * *******************************************************/
   $scope.selectAPosition = function(item){
      if(map){
         var address = item.address?item.address:item.locInfo.poiaddress;
         var pos = new qq.maps.LatLng(item.locInfo.latlng.lat,item.locInfo.latlng.lng);
         map.setCenter(pos);
         map.setZoom(13);
         marketInfo.open();
         marketInfo.setContent('<div style="font-size:12px;text-align:left;white-space:wrap;margin:5px;">' + address +'</div>');
         marketInfo.setPosition(pos);
         if($scope.locaiton_poimaker_list_modal){
            $scope.locaiton_poimaker_list_modal.remove();
         }

      }
   }

   Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
   }

    return map_location;
} ])

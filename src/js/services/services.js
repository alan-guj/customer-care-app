angular.module('CustomerCareService', [ 'configure', 'ngResource' ])
.factory('ScheduleStorage', function($resource, services) {
    return $resource(services.schedule_uri, {id:'@id'}, {
      update:{
            method:"PUT",
        }

    });
})
.factory('ScheduleLogStorage', function($resource, services) {
    return $resource(services.schedule_log_uri, {}, {
      update:{
            method:"PUT",
            params:{},
        },
    });
})
.factory('Customer', function($resource, services) {
    return $resource(services.customer_uri, {id:'@id'}, {
        update:{
            method:"PUT",
            params:{}
        }
    });
})
.factory('CustomerOwner', function($resource, services) {
    return $resource(services.customer_owner_uri, {}, {
      update:{
            method:"PUT",
            params:{}
        }

    });
})
.factory('User', function($resource, services) {
    return $resource(services.user_info_uri, {}, {
      update:{
            method:"PUT",
            params:{}
        }

    });
})
.factory('EnporgUser', function($resource, services) {
    return $resource(services.enporguser_uri, {}, {
      update:{
            method:"PUT",
            params:{}
        }

    });
})
.factory('Period', function($resource, services) {
    return $resource(services.customer_period, {}, {
        update:{
           method:"PUT",
            params:{}
          }
        });
})
.factory('audio', function($document) {
  var audio = $document[0].createElement('audio');
  //var audio = document.getElementById('player');
  console.log('create audio:',audio);
  return audio;
})

.factory('player', function(audio, $rootScope) {
  var player = {

    current: null,
    progress: 0,
    playing: false,
    ready: false,

    play: function(log) {
      if (player.playing)
        player.stop();

      var url = log.oss_urls[0];
      player.current = log;
      audio.src = url;
      audio.play();
      player.playing = true;
    },
    stop: function() {
      if (player.playing) {
        audio.pause();
        player.playing = false;
        player.current = null;
      }
    },
    currentTime: function() {
      return audio.currentTime;
    },
    currentDuration: function() {
      return audio.duration;
    }
  };
  audio.addEventListener('canplay', function(evt) {
    $rootScope.$apply(function() {
      player.ready = true;
    });
  });
  audio.addEventListener('timeupdate', function(evt) {
    $rootScope.$apply(function() {
      player.progress = player.currentTime();
      player.progress_percent = player.progress / player.currentDuration();
    });
  });
  audio.addEventListener('ended', function() {
    $rootScope.$apply(player.stop());
  });
  return player;
})

.factory('JSSDK',function($resource, services) {
    return $resource(services.jssdk_signature, {}, {
        getJssdkSignature : {
            method : 'GET',
            params : {}
        }
    });
})

.factory('wx_jssdk', function($rootScope,JSSDK) {

    var wx_jssdk = {
        ready:false,
    };

    JSSDK.getJssdkSignature({},function(data){
        var jssdkinfo = data.jssdkinfo[0];
        jssdk_appId = jssdkinfo.appId;
        jssdk_timestamp = jssdkinfo.timestamp;
        jssdk_nonceStr = jssdkinfo.nonceStr;
        jssdk_signature = jssdkinfo.signature;
        wx.config({
            debug: false,
            appId: jssdkinfo.appId,
            timestamp:jssdkinfo.timestamp,
            nonceStr: jssdkinfo.nonceStr,
            signature: jssdkinfo.signature,
            jsApiList: [
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'uploadImage',
                'previewImage',
                'translateVoice',
            ]
        });

        wx.checkJsApi({
            jsApiList: ['onVoiceRecordEnd'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
    },function(error){
        console.log(error);
    });

    wx.ready(function() {
        console.log('wx.ready');
        wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function (res) {
                voice.localId = res.localId;
                saveRecord(res);
            }
        });
        wx_jssdk.ready=true;
        $rootScope.$broadcast('wx.ready');
    });


    return wx_jssdk;
})


.factory('phone',function($window) {
    var phone = {
        call:function(mobile) {
            $window.location.href='tel:'+mobile;
        },
        sms:function(mobile) {
            $window.location.href='sms:'+mobile;
        },

    };
    return phone;
})

.factory('sessionStorage',function($window){
    return{        //存储单个属性
        set: function(key,value){
            $window.sessionStorage[key]=value;
        },        //读取单个属性
        get: function(key,defaultValue){
            return  $window.sessionStorage[key] || defaultValue;

        },        //存储对象，以JSON格式存储
        setObject: function(key,value){
            $window.sessionStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key, defaultObject) {
            return JSON.parse($window.sessionStorage[key]||JSON.stringify(defaultObject)||'{}');
        }

    }
})

.factory('localStorage',function($window){
    return{        //存储单个属性
        set: function(key,value){
            $window.localStorage[key]=value;
        },        //读取单个属性
        get: function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;

        },        //存储对象，以JSON格式存储
        setObject: function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key, defaultObject) {
            return JSON.parse($window.localStorage[key]||JSON.stringify(defaultObject)||'{}');
        }

    }
})


.factory('localConfig',function($window){
    return{        //存储单个属性
        set: function(key,value){
            $window.localStorage[key]=value;
        },        //读取单个属性
        get: function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;

        },        //存储对象，以JSON格式存储
        setObject: function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key, defaultObject) {
            return JSON.parse($window.localStorage[key]||JSON.stringify(defaultObject)||'{}');
        }

    }
})

.factory('locationPoimaker', function($resource, services) {
   return $resource(services.mylocation_show_uri,{},{
        getUserLocations:{
            url:services.mylocation_show_uri,
            method:'GET',
            params:{},
        },
        getGrpLocations:{
            url:services.myGrpLocation_show_uri,
            method:'GET',
            params:{},
        }
    })
})
.factory('Hospital', function($resource, services) {
    return $resource(services.hospital_uri, {}, {
        update:{
           method:"PUT",
            params:{}
          }
        });
})
.factory('Personal', function($resource, services) {
    return $resource(services.personal_uri, {}, {
        update:{
           method:"PUT",
            params:{}
          }
        });
})

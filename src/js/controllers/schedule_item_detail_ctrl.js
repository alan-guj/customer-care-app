app
.controller('visit_history_ctrl',
        ['$scope','$ionicModal','$filter','$interval','$ionicScrollDelegate','ionicDatePicker','ScheduleService','Customer','Popup',
function( $scope,  $ionicModal,  $filter,  $interval,  $ionicScrollDelegate,  ionicDatePicker,  ScheduleService,  Customer,  Popup ){

    $scope.is_show_visit_history = false;
    var index=0;
    var total = 0;
    var count;
    $scope.visit_histories = [];
    var all_visit_histories = [];
    $scope.more_history = false;

    $scope.$on('init_visit_history',function(event){
        $scope.visit_histories = [];
        all_visit_histories = [];
        $scope.is_show_visit_history = false;
    });




    $scope.show_visit_history = function(customer) {
        $scope.is_show_visit_history =!$scope.is_show_visit_history;
        if($scope.is_show_visit_history){
            console.log('send: show_visit_history');
            all_visit_histories = [];
            $scope.visit_histories = ScheduleService.getCustomerSchedules(customer.id);
        }
    }

    $scope.loadMore = function(){
        $scope.visit_histories.loadMore(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })
        //$scope.more_history=index<total;
        //count = 2;
        //console.log('loadMore:',$scope.more_history);
        //console.log('index:',index);
        //console.log('total:',total);
        //if($scope.more_history)
            //load_logs(all_visit_histories[index]);
    }

   //function load_logs(schedule) {
       //if(cur_schedule && schedule.id == cur_schedule.id){
           //index++;
           //if(count>0 && index<total) load_logs(all_visit_histories[index]);
            //else $scope.$broadcast('scroll.infiniteScrollComplete');

       //}else {
            //ScheduleLogStorage.get({schedule_id:schedule.id},function(res){
                //console.log('logs:',res);
                //schedule.logs=res.logs;
                //$scope.visit_histories.push(schedule);
                //count--;
                //index++;
                //if(count>0 && index<total) load_logs(all_visit_histories[index]);
                //else $scope.$broadcast('scroll.infiniteScrollComplete');
            //});
        //}
    //}
}])
.controller('schedule_item_detail_ctrl',
            ['$scope','$state','$ionicActionSheet','$ionicPopup','$ionicListDelegate','$ionicViewSwitcher','$stateParams','$ionicModal','$filter','$interval','$ionicScrollDelegate','ionicDatePicker','ScheduleService','Popup','phone','wx_jssdk','schedule_item','map_location','current_user',
function(     $scope,  $state,  $ionicActionSheet,  $ionicPopup,  $ionicListDelegate,  $ionicViewSwitcher,  $stateParams,  $ionicModal,  $filter,  $interval,  $ionicScrollDelegate,  ionicDatePicker,  ScheduleService,  Popup,  phone,  wx_jssdk,  schedule_item,map_location,current_user){

    console.log('$stateParams:',$stateParams);

    $scope.schedule= ScheduleService.getSchedule($stateParams.schedule_id);

    $scope.current_user = current_user;

    $scope.show_customer = function(customer) {
        $ionicViewSwitcher.nextDirection('enter');
        $state.go('customer_detail',{customer_id:customer.id});
    }
    //$scope.$on('show_schedule_item_detail',function(event,item){
        //$scope.item = item;
        //$scope.$broadcast('init_visit_history');
        //ScheduleLogStorage.get({schedule_id:item.id},function(res){
            //$scope.schedule.logs = res.logs;
        //})
    //});

    $scope.display_basic_info = function() {
        $scope.schedule.show_basic_info=true;
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.hide_basic_info = function() {
        console.log('hide_basic_info');
        $scope.schedule.show_basic_info=false;
    }
    $scope.close_schedule_item_detail = function(i) {
        //$scope.$emit('close_schedule_item_detail');
        $ionicViewSwitcher.nextDirection('exit');
        $state.go('schedule_list');
    }


    /*****************************************************
     * 给客户打电话
     * **************************************************/
    $scope.call_customer= function(item) {
        $ionicListDelegate.closeOptionButtons();
        phone.call(item.customer.mobile);
    };
    /*****************************************************
     * 给客户发短信
     * **************************************************/
    $scope.sms_customer= function(item) {
        $ionicListDelegate.closeOptionButtons();
        phone.sms(item.customer.mobile);
    };


    /*****************************************************
     * 关闭拜访
     * **************************************************/
    $scope.close_schedule = function(item) {
        console.log('close_schedule');
        // Show the action sheet
        var closeSheet= $ionicActionSheet.show({
            buttons: item.buttons,
            titleText: '选择关闭原因',
            cancelText: '取消',
            buttonClicked: function(index) {
                if(item.buttons[index].text == '已拜访') {
                    $scope.chat_duration= {start:new Date(),end:new Date()};
                    var chat_duration_popup = $ionicPopup.show({
                        template:'<div class="list">\
                        <label class="item item-input">\
                        <span class="input-label">开始:</span>\
                        <input type="time"  ng-model=chat_duration.start>\
                        </label>\
                        <label class="item item-input">\
                        <span class="input-label">结束:</span>\
                        <input type="time"  ng-model=chat_duration.end>\
                        </label>\
                        </div>',
                        title:'请输入会谈时间',
                        scope:$scope,
                        buttons:[
                            {text:'取消'},
                            {
                                text:'<b>确定</b>',
                                type:'button-positive',
                                onTap:function(e){
                                    if($scope.chat_duration.end<=$scope.chat_duration.start){
                                        e.preventDefault();
                                    }else {
                                        return $scope.chat_duration;
                                    }
                                }
                            }
                        ]
                    });

                    chat_duration_popup.then(function(res){
                        if(res){
                            item.addLog({
                                type:'chat_duration',
                                time:new Date(),
                                start:res.start,
                                end:res.end,
                                duration: res.end.getTime()-res.start.getTime(),
                            })
                            item.close(item.buttons[index].text);
                        }
                    });
                }else{
                    item.close(item.buttons[index].text);
                }
                return true;
            }
        });
        $ionicListDelegate.closeOptionButtons();
    };




    /**************************************
     * 初始化修改日程项模块框
     * ***********************************/
    $scope.edit_schedule = function() {
        schedule_item.edit($scope.schedule,function(resp){
            $scope.schedule= resp.schedule;
        });
        console.log('edit');
    }

    /**************************************
     * JSSKD录音
     * ***********************************/

    /*******************************************************
     * 底部菜单——录入语音
     * ****************************************************/
    var voice_input_step = 'init'
    $scope.voice_input_ready = wx_jssdk.ready;
    voice_input_step = $scope.voice_input_ready && 'ready';
    $scope.voice_input_hint = {'init':'正在准备，请稍后','ready':'开始录音'}[voice_input_step];
    $scope.$on('wx.ready',function(){
        $scope.$apply(function(){
            $scope.voice_input_ready = wx_jssdk.ready;
            voice_input_step = $scope.voice_input_ready && 'ready';
            $scope.voice_input_hint = {'init':'正在准备，请稍后','ready':'开始录音'}[voice_input_step];
        })
    });
    var voice_record= {};
    var voice = {
        localId:'',
        serverId:'',
        text:'',
    }
    var prepare_timer = null;
    var record_timer = null;

    function prepareRecord() {
        voice_input_step = 'prepare';
        var second =2;
        prepare_timer = $interval(function() {
            if(second <= 0) {
                $interval.cancel(prepare_timer);
                prepare_timer = null;
                startRecord();
            }else{
                $scope.voice_input_hint = second+'秒后开始录音，点击取消';
                second--;
            }
        },1000,100);
    }

    function cancelPrepare() {
        if(prepare_timer != null) {
            $interval.cancel(prepare_timer);
            prepare_timer = null;
        }
        if(record_timer != null) {
            $interval.cancel(record_timer);
            record_timer = null;
        }
        voice_input_step = 'ready';
        $scope.voice_input_hint = '开始录音';
    }

    function startRecord() {
        voice_input_step = 'recording';
        voice_record.count_down= 59;
        wx.startRecord();
        record_timer = $interval(function(){
            if(voice_record.count_down> 0) {
                $scope.voice_input_hint = '剩余'+voice_record.count_down+'秒，点击结束,长按取消';
                voice_record.count_down--;
            }else{
                $interval.cancel(record_timer);
                record_timer = null;
                stopRecord();
            }
        },1000,100)
    }

    function cancelRecord() {
        if(record_timer != null) {
            $interval.cancel(record_timer);
            record_timer = null;
        }
        wx.stopRecord({
            success : function(res) {
            },
            fail : function(res) {
            }
        });

        voice_input_step = 'ready';
        $scope.voice_input_hint = '开始录音';
    }

    function stopRecord() {
        if(record_timer != null) {
            $interval.cancel(record_timer);
            record_timer = null;
        }
        wx.stopRecord({
            success : function(res) {
                uploadRecord(res);
            },
            fail : function(res) {
                $scope.$apply(function(){
                    $scope.voice_input_hint = "录音失败，重新录音";
                });
                voice_input_step = 'ready';
            }
        });

    }

    function uploadRecord(res) {
        voice_input_step = 'saving';
        $scope.$apply(function(){
            $scope.voice_input_hint = "正在保存";
        });
        if(record_timer != null) {
            $interval.cancel(record_timer);
            record_timer = null;
        }
        voice.localId = res.localId;
        //wx.playVoice({
            //localId: voice.localId, // 需要播放的音频的本地ID，由stopRecord接口获得
        //});
        wx.uploadVoice({
            localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                voice.serverId = res.serverId; // 返回音频的服务器端ID

                wx.translateVoice({
                    localId: voice.localId, // 需要识别的音频的本地Id，由录音相关接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        voice.text = res.translateResult;
                    },
                    complete: function(res) {
                        saveRecord();
                    },
                });
            },
            fail: function (res) {
                voice.serverId = res.serverId; // 返回音频的服务器端ID
                $scope.$apply(function(){
                    $scope.voice_input_hint = "保存失败，重新录音";
                });
                voice_input_step = 'ready';
            }

        });
    }
    function saveRecord() {
        $scope.$apply(function(){
            $scope.voice_display = voice;
            $scope.voice_input_hint = "保存成功，开始新录音";
            voice_input_step = 'ready';
            var new_log = $scope.schedule.addLog({
                type:'voice',
                time: new Date().toISOString(),
                mediaType:'audio',
                weixin_url:voice.serverId,
                text:voice.text,
                period: 60-voice_record.count_down,
            },function(res){
            });
            new_log.playing = false;
            //var new_log = ScheduleLogStorage.save({schedule_id:$scope.schedule.id},{
                //type:'voice',
                //time: new Date().toISOString(),
                //mediaType:'audio',
                //weixin_url:voice.serverId,
                //text:voice.text,
                //period: 60-voice_record.count_down,
            //},function(res){
                 //new_log.playing = false;
            //});
            //$scope.schedule.logs.push(new_log);
        });
        $ionicScrollDelegate.$getByHandle('logs-content').scrollBottom();
    }

    var record_actions = {
        'ready':{
            'click':prepareRecord,
        },
        'prepare':{
            'click':cancelPrepare,
        },
        'recording':{
            'click':stopRecord,
            'hold':cancelRecord,
        },
        'saving':{},

    };

    $scope.click_record_button = function() {
        var action = record_actions[voice_input_step]['click'];
        if(action != null){
            console.log(action);
            action();
        }
    }
    $scope.hold_record_button = function() {
        var action = record_actions[voice_input_step]['hold'];
        if(action != null){
            console.log(action);
            action();
        }
    }



    /**********************************************************
     * 底部菜单——录入工作日志
     * *******************************************************/

    $ionicModal.fromTemplateUrl('templates/add_worklog.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.add_work_log_modal = modal;
    });

    $scope.add_work_log = function() {
        $scope.add_work_log_modal.show();
    };

    $scope.$on('add_worklog_confirm',function(event,worklog){
        console.log('add_worklog:',worklog);
        $scope.add_work_log_modal.hide();
        //$scope.schedule.logs.push(ScheduleLogStorage.save({schedule_id:$scope.schedule.id},worklog));
        $scope.schedule.addLog(worklog);
    });
    $scope.$on('worklog_cancel',function(event,worklog){
        $scope.add_work_log_modal.hide();
    });


    /**********************************************************
     * 底部菜单——录入当前位置
     * *******************************************************/

    $scope.add_location= function() {
         map_location.getLocation(function(locInfo){
             var new_log = $scope.schedule.addLog({
                type: 'location',
                time: new Date().toISOString(),
                address: locInfo.poiaddress,
                locInfo: locInfo,
             });

            $ionicScrollDelegate.$getByHandle('logs-content').scrollBottom();
        });
    };

    /**********************************************************
     * 底部菜单——添加短日志
     * *******************************************************/

    $scope.short_log={};
    $scope.add_short_log = function() {
        console.log($scope.short_log.text);
        if($scope.short_log.text && $scope.short_log.text.trim()!='') {
            var new_log = $scope.schedule.addLog({
                type:'short',
                time:new Date().toISOString(),
                text:$scope.short_log.text.trim(),
            });
            //var new_log = ScheduleLogStorage.save({schedule_id:$scope.schedule.id},{
                //type:'short',
                //time:new Date().toISOString(),
                //text:$scope.short_log.text.trim(),
            //});
            //$scope.schedule.logs.push(new_log);
            $scope.short_log.text = '';
            $ionicScrollDelegate.$getByHandle('logs-content').scrollBottom();
        }
    }

    /**********************************************************
     * 底部菜单——上传图片
     * *******************************************************/
    var images = {
        localId: [],
        serverId: []
    };

    function chooseImage() {
        wx.chooseImage({
            success: function (res) {
                images.localId = res.localIds;
                //alert('已选择 ' + res.localIds.length + ' 张图片');
                uploadImage();
            }
        });
    };


    function uploadImage() {
        if (images.localId.length == 0) {
            alert('请先选择图片');
            return;
        }
        var i = 0, length = images.localId.length;
        images.serverId = [];


        var new_log = $scope.schedule.addLog({
            type:'photos',
            time:new Date().toISOString(),
            mediaType:'image',
            weixin_urls:[],
        },function(log){
            upload();
        });

        //var new_log=ScheduleLogStorage.save({schedule_id:$scope.schedule.id},{
            //type:'photos',
            //time:new Date().toISOString(),
            //mediaType:'image',
            //weixin_urls:[],
        //},function(log){
            //new_log = log;
            //$scope.schedule.logs.push(new_log);
            //upload();
        //});

        function upload() {
            wx.uploadImage({
                localId: images.localId[i],
                success: function (res) {
                    i++;
                    //alert('已上传：' + i + '/' + lengt-1h);
                    $scope.schedule.addLogUrl(
                        new_log,{weixin_url:res.serverId,mediaType:'image'});
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        }

    };

    $scope.add_photos = chooseImage;


    /*****************************************************
     * 预约下次拜访
     * **************************************************/



    $scope.add_next_visit = function(){
        console.log('show add_schedule_item_modal');
        schedule_item.add($scope.schedule.customer,function(resp){
            $scope.$emit('add_schedule_item',resp.schedule);
        });
    }
}])

.controller('show_schedule_log_ctrl',['$scope','$ionicModal','$filter','ScheduleLogStorage','player','map_location','current_user',
                            function(  $scope,  $ionicModal,  $filter,  ScheduleLogStorage, player,map_location,   current_user){
    var cur_worklog = {};
    var cur_schedule = {};

    /*********************************************************
     * 展示日志记录
     * ****************************************************/

    var show_log_function = {
        'voice': playVoice,
        'location': showLocation,
        'worklog': showWorklog,
        'photos': showPhotos,
    };

    $scope.show_log = function(log,schedule){
        cur_worklog = log;
        cur_schedule = schedule;
        if(show_log_function[cur_worklog.type]){
             show_log_function[cur_worklog.type]();
        }
    };
    /***************************************************
     *展现图片
     **************************************************/

    function showPhotos() {
        console.log('showPhotos:',cur_worklog);
        wx.previewImage({
            current: cur_worklog.oss_urls[0], // 当前显示图片的http链接
            urls: cur_worklog.oss_urls // 需要预览的图片http链接列表
        });
    };


    /***************************************************
     *播放语音记录
     **************************************************/

    $scope.player = player;
    function playVoice() {
        if(!cur_worklog.playing){
            player.play(cur_worklog);
            cur_worklog.playing=true;
        }
        else{
            player.stop();
            cur_worklog.playing=false;
        }
    };

    /**********************************************************
     * 查看定位信息的位置
     * *******************************************************/
    /*$ionicModal.fromTemplateUrl('templates/map_location.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.map_location_modal = modal;
    });*/

    function showLocation() {
        var tmpLocation = cur_worklog.locInfo;
         map_location.showSingleLocation(tmpLocation);
    };


    /***********************************************************
     * 显示工作日志
     * *********************************************************/
       $ionicModal.fromTemplateUrl('templates/add_worklog.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.edit_work_log_modal = modal;
    });

    $scope.$on('edit_worklog_confirm',function(event,worklog){
        console.log('edit_worklog:',worklog);
        console.log('cur_worklog:',cur_worklog);
        $scope.edit_work_log_modal.hide();
        worklog.time = new Date().toISOString();
        ScheduleLogStorage.update({schedule_id:cur_schedule.id,log_id:worklog.id},
                           worklog,function(res){
                               cur_worklog.content= res.content;
                               cur_worklog.time = res.time;
                           });
    });

    $scope.$on('worklog_cancel',function(event,worklog){
        $scope.edit_work_log_modal.hide();
    });

    function showWorklog() {
        $scope.edit_work_log_modal.show();
        $scope.$broadcast('edit_worklog',cur_worklog,current_user.data.id==cur_schedule.userId);
    }
}]);



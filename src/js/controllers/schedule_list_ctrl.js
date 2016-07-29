app.controller('schedule_list_ctrl',
               ['$window','$scope','$state','$ionicViewSwitcher','$ionicPopup','$ionicModal','$filter','$ionicScrollDelegate','$ionicListDelegate','$ionicActionSheet','$ionicLoading','ionicDatePicker','current_user','phone','localConfig','schedule_item','map_location','ScheduleService',
function(        $window,$scope,  $state,  $ionicViewSwitcher,  $ionicPopup,  $ionicModal,  $filter,  $ionicScrollDelegate,   $ionicListDelegate, $ionicActionSheet,  $ionicLoading,  ionicDatePicker,  current_user,  phone,  localConfig,  schedule_item,map_location,    ScheduleService){

    $scope.current_user = current_user;

    $scope.ScheduleService = ScheduleService;
   
    $scope.filter_options = {
        time_range:[
            {title:'当日',value:'day'},
            {title:'当周',value:'week'},
            {title:'当月',value:'month'}
        ],
        scope:[
            {title:'我的',value:'my'},
        ]
    };

    $scope.screens={'role':'不限','provinces':'','userids':'','userNames':''};

    if(current_user.data.enterprise_id && current_user.enpinfo.isManager)
        $scope.filter_options.scope.push({title:'小组',value:'group'});

    $scope.filter_param = localConfig.getObject(
        'schedule_filter_param',
        {
            time_range:$scope.filter_options.time_range[0],
            scope:$scope.filter_options.scope[0],
        });

    $scope.screens = localConfig.getObject(
        'schedule_screens_param',
        {           
            role:'不限',
            userids:'',
            userNames:'',
            provinces:''
        });

    function set_filter_screens(){
        if($scope.filter_param.scope.value == 'my'){
            $scope.schedule_list.setFilter({
                date:$scope.select_date_value.toISOString(),
                range:$scope.filter_param.time_range.value,
                scope:$scope.filter_param.scope.value,
                role:$scope.screens.role,
                provinces:$scope.screens.provinces
            });
        }else{
            $scope.schedule_list.setFilter({
                date:$scope.select_date_value.toISOString(),
                range:$scope.filter_param.time_range.value,
                scope:$scope.filter_param.scope.value,
                role:$scope.screens.role,
                provinces:$scope.screens.provinces,
                userids:$scope.screens.userids
            });
        }
        
    }

    $scope.set_filter= function(type,option) {
        $scope.filter_param[type]= option;
        $scope.select_date = $filter('date')($scope.select_date_value,'mediumDate')+'('+
            $scope.filter_param.scope.title+$scope.filter_param.time_range.title+'计划)';
        localConfig.setObject('schedule_filter_param',$scope.filter_param);
        
        set_filter_screens();
        $scope.remain = true;
        $ionicScrollDelegate.scrollTop();
    };


    $scope.show_customer = function(customer){
        $ionicViewSwitcher.nextDirection('enter');
        $state.go('customer_detail',{customer_id:customer.id});
    }


    /*****************************************************
     * 显示日期控件
     * ***************************************************/
    $scope.select_date_value = new Date();
    $scope.select_date = $filter('date')($scope.select_date_value,'mediumDate')+'('+
        $scope.filter_param.scope.title+$scope.filter_param.time_range.title+'计划)';
    var datepicker= {
        callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.select_date_value.setTime(val);
            $scope.select_date = $filter('date')($scope.select_date_value,'mediumDate')+'('+
                $scope.filter_param.scope.title+$scope.filter_param.time_range.title+'计划)';
            
            set_filter_screens();
            $scope.remain = true;
        },
        templateType:'modal',
    };

    $scope.pick_date = function() {
        datepicker.inputDate = $scope.select_date_value;
        ionicDatePicker.openDatePicker(datepicker);
    };


    /*************************************************************
     * 排序
     * ***********************************************************/

    $scope.schedule_order = function(item) {
        //console.log(item);
        var date = Math.floor((Date.parse(item.date)+8*3600000)/86400000);
        var status_prior = item.getPrior();
        //console.log(item.customer.name,item.date,date,status_prior);
        return date*10-status_prior;
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


    /************************************************************
     * 日程筛选条件模态框
     * *********************************************************/

    $ionicModal.fromTemplateUrl('templates/schedule_screen.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.schedule_screen_modal = modal;
    });

    $scope.$on('schedule_screens_confirm',function(event,screens){
        $scope.screens = screens;
        localConfig.setObject('schedule_screens_param',$scope.screens);
        console.log('$scope.screens',$scope.screens);
        set_filter_screens();
    });

    $scope.set_screens = function(){
        $scope.$broadcast('schedule_screens_set',$scope.filter_param.scope.value,$scope.screens);
        $scope.schedule_screen_modal.show();
    }

    $scope.show_schedule_detail = function(i) {
        console.log('goto:',i);
        $ionicViewSwitcher.nextDirection('enter');
        $state.go('schedule_detail',{schedule_id:i.id});
    }


    /**************************************
     * 增加新日程
     * ***********************************/

    $scope.add_schedule_item = function(){
        console.log('show add_schedule_item_modal');
        //$scope.add_schedule_item_modal.show();
        schedule_item.add(null,function(resp){
            $scope.schedule_items.schedules.unshift(resp.schedule);
        });
    };


    /************************************************************************
     * 显示我的足迹
     * *********************************************************************/
    $scope.showMyLocations = function(){
        var searchParam = $scope.filter_param;
        searchParam.date = $scope.select_date_value;
        searchParam.userId = current_user.data.id;
        searchParam.grpId = current_user.data.enterprise_id;
        map_location.showMultiLocation(searchParam);
    }

    /************************************************************************
     * 初始化日程项
     * *********************************************************************/
    $scope.$on('$stateChangeSuccess', function() {
        //refreshScheduleList();
        //
    });


    $scope.schedule_list= ScheduleService.getScheduleList({
        date:$scope.select_date_value.toISOString(),
        range:$scope.filter_param.time_range.value,
        scope:$scope.filter_param.scope.value
    });

    $scope.loadMore = function() {
        $scope.schedule_list.loadMore(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.showPersonal = function(){
        $window.localStorage["global_visit_num"]=0;
        // localConfig.set("global_visit_bool",false);
        $state.go("personal_homepage");
    }
}])



app.controller('schedule_screens_ctrl',[
    '$scope','current_user','select_enpuser','select_provinces',
    function($scope,current_user,select_enpuser,select_provinces){
    var selecBool = true;
    var groupId = current_user.data.enterprise_id;
    $scope.filterScope = 'my';
    $scope.provincesArray = new Array();
    $scope.isFManager = (current_user.enpinfo.hasOwnProperty("isManager")?current_user.enpinfo.isManager:false); 
    var tpIdArray = new Array();
    var tpNameArray = new Array();
    var visitPersons = new Array();

    function callback(data,type){
        //console.log("00000000000data=====",data,type);
        if(type=="add"){
            tpIdArray.push(data.id);
            tpNameArray.push(data.name);
            visitPersons.push(data);
        }else{
            for(i=0;i< tpIdArray.length;i++){
                if (parseInt(tpIdArray[i]) == data.id){ 
                    tpIdArray.splice(i, 1);
                    tpNameArray.splice(i, 1);
                    visitPersons.splice(i, 1);
                    break;
                }
            }
        }
        $scope.screenObj.userids = tpIdArray.join(',') ;
        $scope.screenObj.userNames = tpNameArray.join(',') ;
    }

    function initScreen(){

        if($scope.screenObj.userids !=""){
            tpIdArray = $scope.screenObj.userids.split(",");
            tpNameArray = $scope.screenObj.userNames.split(",");
            visitPersons = [];
            for(i=0;i< tpIdArray.length;i++){
                var tpObj = new Object();
                tpObj.id = parseInt(tpIdArray[i]);
                tpObj.name = tpNameArray[i];

                visitPersons[i] = tpObj;
            }
        }
        //console.log('initScreen',visitPersons);   
        select_enpuser.init(true,groupId,selecBool,visitPersons,callback);
        select_provinces.init($scope.screenObj,true);
    }
    
       
    $scope.$on('schedule_screens_set',function(event,scope,screens){
        $scope.filterScope = scope;
        $scope.screenObj = screens;
        console.log('$scope.filterScope',$scope.screenObj);
        initScreen();
    });

    $scope.close_p_panel = function(isConfirm){
        if(isConfirm){
            $scope.$emit('schedule_screens_confirm',$scope.screenObj);
        }

        select_enpuser.destory();
        select_provinces.destory();
        $scope.schedule_screen_modal.hide();
    };

    $scope.rowClickFun = function(){     
        select_enpuser.show();  
    }

    $scope.chooseProvinces = function(){
        select_provinces.show();
    }

}])
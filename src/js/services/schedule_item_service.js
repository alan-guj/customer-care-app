app.service('schedule_item',
        [ '$rootScope', '$filter', '$ionicModal','ScheduleService','ionicDatePicker','select_customer',
function(  $rootScope,   $filter,   $ionicModal,  ScheduleService,  ionicDatePicker,  select_customer) {


    var $scope = $rootScope.$new();
    $scope.scheduleInfo={};

    var schedule_item_detail = {
        add: function(customer, success, fail){
            var date = new Date();
            $scope.scheduleInfo.action='add';
            $scope.scheduleInfo.preset_customer = customer;
            $scope.scheduleInfo.schedule=ScheduleService.newSchedule({customer:customer,date:date});
            $scope.scheduleInfo.schedule.customer_id = (customer && customer.id) || null;
            $scope.scheduleInfo.callback= {success: success, fail:fail};
            $scope.scheduleInfo.dateShow=$filter('date')(date,'mediumDate');
            showScheduleItemModal();
        },
        edit: function(item,success,fail){
            $scope.scheduleInfo.action='edit';
            $scope.scheduleInfo.schedule = item;
            $scope.scheduleInfo.success = success;
            $scope.scheduleInfo.preset_customer = item.customer;
            $scope.scheduleInfo.fail = fail;
            $scope.scheduleInfo.dateShow=$filter('date')(item.date,'mediumDate');
            showScheduleItemModal();
        }
    };


    /**************************************
     * 初始化修改日程项模块框
     * ***********************************/
    function showScheduleItemModal(){
        $ionicModal.fromTemplateUrl('templates/schedule_item.html',{
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.schedule_item_modal = modal;
            $scope.schedule_item_modal.show();
        });
    }

    $scope.$on('$destroy', function () {
        $scope.schedule_item_modal.remove();
    });

    $scope.careWayGrp = [ '当面拜访', '电话拜访', '科室会','学术培训' ];

    /** *********取消日程新增或者编辑************ */
    $scope.cancelAdd = function() {
        $scope.scheduleInfo.action == 'edit' && $scope.scheduleInfo.schedule.reset();
        $scope.schedule_item_modal.remove();
    }

    /** *********日程新增，更新*********** */
    $scope.submitAdd = function() {
        //如果日程ID不是0或者 -1，则处于编辑状态，提交为编辑
        if($scope.scheduleInfo.action=='edit'){
            $scope.scheduleInfo.schedule.save();
            //ScheduleStorage.update({id:$scope.scheduleInfo.schedule.id}, $scope.scheduleInfo.schedule, function(resp) {
                //$scope.scheduleInfo.success && $scope.scheduleInfo.success(resp);
            //}, function(err) {
                //console.log(err)
                //$scope.scheduleInfo.fail && $scope.scheduleInfo.fail(err);
            //});
        }else{
            if($scope.scheduleInfo.preset_customer && angular.isFunction($scope.scheduleInfo.preset_customer.addSchedule))
                $scope.scheduleInfo.preset_customer.addSchedule($scope.scheduleInfo.schedule);
            else
                ScheduleService.addSchedule($scope.scheduleInfo.schedule);

            //ScheduleStorage.save({}, $scope.scheduleInfo.schedule, function(resp) {
                //$scope.scheduleInfo.success && $scope.scheduleInfo.success(resp);
            //}, function(err) {
                //$scope.scheduleInfo.fail && $scope.scheduleInfo.fail(err);
            //});
        }
        $scope.schedule_item_modal.remove();
    }


    /*****************************************************
     * 显示日期控件
     * ***************************************************/
    var datepicker= {

        //from: new Date(new Date().getTime() - 30*24*60*60*1000), //前30天
        callback: function (val) {
            var date_value = new Date(val);
            $scope.scheduleInfo.schedule.date = date_value.toISOString();
            $scope.scheduleInfo.dateShow = $filter('date')(date_value,'mediumDate');
        },
        templateType: 'popup',

    };
    /**************************************************
     * 选择时间
     **************************************************/
    $scope.pick_schedule_date = function() {
        if($scope.scheduleInfo.action=='edit') return false;
        datepicker.inputDate = new Date($scope.scheduleInfo.schedule.date);
        ionicDatePicker.openDatePicker(datepicker);
    }

    /**************************************************
     * 选择客户模态框
     **************************************************/
    $scope.showCustomerLst = function() {

        if($scope.scheduleInfo.preset_customer) return false;
        select_customer.select(function(resp){
             $scope.scheduleInfo.schedule.customer_id=resp.id;
             $scope.scheduleInfo.schedule.customer = resp;
        });
    };
    return schedule_item_detail;
} ])

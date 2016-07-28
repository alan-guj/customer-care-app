app.controller('customer_detail_ctrl',['$scope','$ionicModal','CustomerOwner','current_user','CustomerService','$ionicViewSwitcher','$state',
  'ScheduleStorage','$filter','phone','schedule_item','Customer','care_period','$stateParams','customer_info','$ionicViewSwitcher',
	function($scope,$ionicModal,CustomerOwner,current_user,CustomerService,$ionicViewSwitcher,$state,
    ScheduleStorage,$filter,phone,schedule_item,Customer,care_period,$stateParams,customer_info,$ionicViewSwitcher){

  $scope.cItem ={'index':0,'cUser':''};
  $scope.customer= CustomerService.getCustomer($stateParams.customer_id);
  console.log('customer:',$scope.customer);
  
  if(typeof($scope.customer.index) !="undefined"){
     $scope.cItem.index = $scope.customer.index + 1;
     $scope.customers= CustomerService.getCustomerList();
     console.log('customers:',$scope.customers);
  }else{//only one customer

     $scope.cItem.index = 1;
     $scope.customers={list: [$scope.customer]};
  }



  $scope.showBirthday = function(){
      if($scope.customer && $scope.customer.birthday){
          var birthday = new Date($scope.customer.birthday).Format("MM-dd");
          var today = new Date().Format("MM-dd");
          //console.log(birthday,today);
          return (birthday == today ? true : false);
      }else{
        return false;
      }
  }

 $scope.setShowHistoryText = function(){
    var nextVisitInfo = {name:'',time:'',intervalDays:''};

    if(!$scope.customer.nextScheduleDate){

      return "无";
    }
    else{

        var today = new Date().Format("yyyy-MM-dd");
        var tp = new Date($scope.customer.nextScheduleDate).Format("yyyy-MM-dd");
        var  days=daysBetween(tp,today);

        nextVisitInfo.time = tp;
        nextVisitInfo.name = $scope.customer.nextVisitName || '';
        switch (true){
            case days>0:
                nextVisitInfo.intervalDays = "（"+days+"天后）";
                break;
            case days==0:
                nextVisitInfo.intervalDays = "（今日）";
                break;
            default:
                nextVisitInfo.intervalDays = "（已过期"+abs(days)+"天）";
        }

        return nextVisitInfo.name +' '+ nextVisitInfo.time + nextVisitInfo.intervalDays;
    }

}


 $scope.$broadcast('init_visit_history');

    /*****************************************************
     * 给客户打电话
     * **************************************************/
    $scope.detail_call_customer= function(mobile) {
        console.log(mobile);
        phone.call(mobile);
    };
    /*****************************************************
     * 给客户发短信
     * **************************************************/
    $scope.detail_sms_customer= function(mobile) {
        console.log(mobile);
        phone.sms(mobile);
    };

  	// Create the  modal that we will use later
    /**************************************
         * 关注人设置
         * ***********************************/
    $ionicModal.fromTemplateUrl('templates/focus_people_setting.html', {
    scope: $scope
    }).then(function(modal) {
      $scope.focusPeopleSettingModal = modal;
    });

    $scope.focusPeopleSetting = function () {
        var ids = { currentindex:$scope.cItem.index,
                    customerId:$scope.customer.id,
                      groupId:$scope.customer.groupId};
        $scope.focusPeopleSettingModal.show();
        $scope.$broadcast('focus_people_setting',ids);
    }

     /**************************************
         * 修改客户信息
         * ***********************************/

    $scope.modifyCustomerInfo = function () {

       customer_info.edit($scope.customer);

    }

     /**************************************
      * 调用添加日程服务
     * ***********************************/
    $scope.cDetail_add_schedule_item = function($event){

        $event.stopPropagation();

        schedule_item.add($scope.customer,function(resp){

        })
    }


	$scope.currentIndexModify = function(op){

      if($scope.customers.list.length == 1) return;

    	if (op == 1){
      		if ( $scope.cItem.index <  $scope.customers.list.length) {
            $scope.cItem.index += op;
            $scope.customer = $scope.customers.list[$scope.cItem.index -1];
            $scope.$broadcast('init_visit_history');
          }
    	}else{
      		if ( $scope.cItem.index > 1) {
            $scope.cItem.index += op;
            $scope.customer = $scope.customers.list[$scope.cItem.index -1];
            $scope.$broadcast('init_visit_history');
          }
    	}    
	}


}])

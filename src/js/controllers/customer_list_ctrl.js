app.controller('customer_list_ctrl', ['$scope', 
    'current_user',
    'phone',
    '$ionicListDelegate',
    'wx_jssdk',
    '$ionicScrollDelegate',
    'localConfig',
    'schedule_item',
    'care_period',
    'CustomerService',
    '$state',
    '$ionicViewSwitcher',
    'customer_info',
    function ($scope,current_user,phone,$ionicListDelegate,wx_jssdk,$ionicScrollDelegate,localConfig,schedule_item,
        care_period,CustomerService,$state,$ionicViewSwitcher,customer_info) {

        //console.log('current_user',current_user);
        $scope.currentItem = {'index': 0,'today':new Date().Format("yyyy-MM-dd")};
        $scope.currentUser = {'fiveStars': [30, 20, 15, 10, 5]};//T关注周期(天)

        $scope.choice = {orderby: "next_visit", customType: "all", customScope: "my",searchText:""};
        $scope.choiceTimeList = [
            {text: "按计划拜访时间排序", value: "next_visit"},
            {text: "按上次拜访时间排序", value: "last_visit"},
        ];

        $scope.choiceCustomTypeList = [
            {text: "显示全部客户", value: "all"},
            {text: "显示无拜访计划的客户", value: "noplan"},
            {text: "显示有拜访计划的客户", value: "plan"},
        ];

        $scope.choiceCustomScopeList = [
            {text: "显示我的客户", value: "my"},
        ];

        $scope.customerListfilter_param = localConfig.getObject(
            'customerList_filter_param',
            {
                orderby:$scope.choice.orderby,
                customType:$scope.choice.customType,
                customScope: $scope.choice.customScope,
            });

        $scope.choice.orderby = $scope.customerListfilter_param.orderby;
        $scope.choice.customType = $scope.customerListfilter_param.customType;

        //console.log('current_user',current_user);
        if(current_user.enpinfo && current_user.enpinfo.isManager){           
            $scope.choiceCustomScopeList.push({text: "显示本组客户", value: "group"});
            $scope.choice.customScope = $scope.customerListfilter_param.customScope;            
        }        

    /************************************************************************
     * 初始化客户列表
     * *********************************************************************/    
    $scope.customers= CustomerService.getCustomerList($scope.choice);
    
        
    $scope.loadMore = function() {
        $scope.customers.loadMore(function(increase){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log('increase',increase);
        });
    }

    /************************************** * **********************************/
    $scope.computeBgcolor= function(customer) {
         var elaspedDay = 0;
         var ratio;
        if(customer && ($scope.choice.customScope == "my")){               
      
            if( (!customer.myCustomer.star) || (customer.myCustomer.star<=0) || (!customer.myCustomer.lastVisitDate))  return '';
            elaspedDay=daysBetween($scope.currentItem.today,new Date(customer.myCustomer.lastVisitDate).Format("yyyy-MM-dd"));
            ratio = elaspedDay/customer.myCustomer.cycleDay;
            return (ratio<=1/3 && 'greenBg') || (ratio<=2/3&&ratio>1/3 && 'yellowBg') || (ratio>2/3 && 'redBg');
        }
        return '';
    }

    $scope.computeBgWidth= function(customer) {
         var elaspedDay = 0;
         var ratio;
      
        if(customer && ($scope.choice.customScope == "my")){
        
            if((!customer.myCustomer.star) || (customer.myCustomer.star<=0) || (!customer.myCustomer.lastVisitDate)) return {width:'0px'};
            elaspedDay=daysBetween($scope.currentItem.today,new Date(customer.myCustomer.lastVisitDate).Format("yyyy-MM-dd"));
            ratio = elaspedDay/customer.myCustomer.cycleDay;
            //console.log({'width':(ratio>1 && '10px') || 100*(1-ratio)+'%'});
            return {'width':(ratio>1 && '10px') || 100*(1-ratio)+'%'};
        }
        return {width:'0px'};
    }

       $scope.showEvent =function(item){
            var showStr ='';
            var days = 0;
            if($scope.choice.customScope == "my"){
                if(item.myCustomer && item.myCustomer.nextScheduleDate){
                  
                    days=daysBetween(new Date(item.myCustomer.nextScheduleDate).Format("yyyy-MM-dd"),$scope.currentItem.today);
                    //console.log('days = ',days);
                    if(days == 0){
                        showStr = "计划今日拜访";
                    }else{
                        showStr = "距下次拜访还有"+days+"天";
                    };
                }else{
                    if(item.myCustomer && item.myCustomer.lastVisitDate){                   
                        days=daysBetween($scope.currentItem.today,new Date(item.myCustomer.lastVisitDate).Format("yyyy-MM-dd"));
                        showStr = "距上次拜访已有"+days+"天";                    
                    }else{
                        showStr = "无下次拜访计划与记录";   
                    };
                }         
         
            }else{
                if(item.nextScheduleDate){
                    days=daysBetween(new Date(item.nextScheduleDate).Format("yyyy-MM-dd"),$scope.currentItem.today);
                    if(days == 0){
                        showStr = "计划今日拜访";
                    }else{
                        showStr = "距下次拜访还有"+days+"天";
                    }
                }else{
                    if(item.lastVisitDate){                   
                        days=daysBetween($scope.currentItem.today,new Date(item.lastVisitDate).Format("yyyy-MM-dd"));
                        showStr = "距上次拜访已有"+days+"天";                    
                    }else{
                        showStr = "无下次拜访计划与记录";   
                    } 
                }     
                    
            }

            return showStr;
        }

         $scope.set_clfilter = function(type,option) {
            if(type){
                $scope.customerListfilter_param[type]= option; 
                //console.log('$scope.customerListfilter_param', $scope.customerListfilter_param);
                localConfig.setObject('customerList_filter_param',$scope.customerListfilter_param);
            }
            console.log('--------$scope.set_clfilter',$scope.choice);
            $scope.customers.setFilter($scope.choice);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
        };

       /* $scope.touch = function (i) {
            $("#search").blur();
        }*/

    /*****************************************************
     * 给客户打电话
     * **************************************************/
    $scope.call_customer= function(mobile) {       
        $ionicListDelegate.closeOptionButtons();
        console.log(mobile);
        phone.call(mobile);
    };
    /*****************************************************
     * 给客户发短信
     * **************************************************/
    $scope.sms_customer= function(mobile) {
        $ionicListDelegate.closeOptionButtons();
        console.log(mobile);
        phone.sms(mobile);
    };

         // Create the  modals that we will use later
        /**************************************
         * 调用周期设置服务 care_period
         * ***********************************/

        $scope.carePeriodSetting = function () { 
            
            care_period.set(function(resp){
            console.log('refresh',resp);
            $scope.customers.refresh();
                
            });
            
        }

        /**************************************
         * 添加新客户
         * ***********************************/
        $scope.addCustom = function () { 
            customer_info.add(function(){
                console.log('$scope.addCustomer');
                $scope.customers.page.total +=1;
            });
        }

        /**************************************
         * 客户详情
         * ***********************************/     
        $scope.customerDetail = function (index) {
            $scope.currentItem.index = index + 1;
            console.log('goto:',index);
            $ionicViewSwitcher.nextDirection('enter');
            $state.go('customer_detail',{customer_id:$scope.customers.list[index].id});

        }

        /**************************************
         * 调用添加日程服务
         * ***********************************/
        $scope.add_schedule_item = function(index,tpObj,$event){
            $event.stopPropagation();
            $scope.currentItem.index = index + 1;
            $ionicListDelegate.closeOptionButtons();
        
            schedule_item.add(tpObj,function(resp){
              
                
            });
        }

}])

app.controller('select_customer_ctrl', [
		'$scope',
		'$ionicModal',
		'$ionicLoading',
		'filterFilter',
		'$filter',
		'CustomerService',
		function($scope, $ionicModal, $ionicLoading, filterFilter, $filter,
				CustomerService) {

            $scope.$on('load_customer_list', function(event) {
                $scope.customList=CustomerService.getMyCustomers();
            });

            $scope.loadMore = function(){
                $scope.customList.loadMore(function(){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }

			$scope.currentItem = {'index': 0,'today':new Date().Format("yyyy-MM-dd")};
            $scope.currentUser = {
            		'fiveStars': [30, 20, 15, 10, 5],//T关注周期(天)
            		'isTeamLeader':true,
             }

             $scope.touch = function (i) {
                 $("#search").blur();
             }

             $scope.selectCustomer = function(customer){
            	 $scope.scheduleInfo.schedule.customer = customer;
            	 $scope.select_customer_modal.hide();
             }

            $scope.choice = {orderby: "next_visit", customType: "plan", customScope: "my",searchText:""};

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
                        showStr = "无拜访计划与记录";   
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
                        showStr = "无拜访计划与记录";   
                    } 
                }     
                    
            }

            return showStr;
        }

           //+---------------------------------------------------
             //| 求两个时间的天数差 日期格式为 YYYY-MM-dd
             //+---------------------------------------------------
             function daysBetween(DateOne,DateTwo)
             {
                 var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
                 var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
                 var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

                 var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
                 var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
                 var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

                 var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
                 return Math.abs(cha);
             }
		} ])

app.service('select_customer',
        [ '$rootScope', '$filter', '$ionicModal','$ionicScrollDelegate','CustomerService',
function(  $rootScope, $filter, $ionicModal,      $ionicScrollDelegate, CustomerService) {

    var $scope = $rootScope.$new();
    var callbacks = {};
    var select_customer = {
        select: function(success, fail){
            callbacks = {
                success:success,
                fail:fail,
            }
            $scope.customList=CustomerService.getMyCustomers($scope.choice);
            showSelectCustomerModal();
        }
    };

    $scope.choiceChange = function(){
        $scope.customList.setFilter($scope.choice);
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    }

    $scope.loadMore = function(){
        $scope.customList.loadMore(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    }

     //单击选择客户操作
     $scope.selectCustomer = function(customer){
         callbacks.success && callbacks.success(customer);
         $scope.select_customer_modal.remove();
     }

     //单击取消操作
     $scope.cancelSelect = function(){
         $scope.select_customer_modal.remove();
     }

    /**************************************************
     * 选择客户模态框
     **************************************************/
     function showSelectCustomerModal(){
        $ionicModal.fromTemplateUrl('templates/select_customer.html',{
            scope : $scope,
            animation : 'slide-in-up'
        }).then(function(modal) {
            $scope.select_customer_modal = modal;
            $scope.select_customer_modal.show();
        });
    }

    $scope.currentItem = {'index': 0,'today':new Date().Format("yyyy-MM-dd")};

    $scope.currentUser = {
            'fiveStars': [30, 20, 15, 10, 5],//T关注周期(天)
            'isTeamLeader':true,
     }

     $scope.touch = function (i) {
         $("#search").blur();
     }


    $scope.choice = {orderby: "next_visit", customType: "all", customScope: "my",searchText:""};

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
      /**************************************************
     * 求两个时间的天数差 日期格式为 YYYY-MM-dd
     **************************************************/
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

    return select_customer;
} ])

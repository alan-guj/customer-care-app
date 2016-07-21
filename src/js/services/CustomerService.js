app.service('CustomerService',
        ['$q','Customer','$ionicLoading','ScheduleService',
function( $q, Customer,  $ionicLoading,  ScheduleService){

    /******************************************
    /*客户列表迭代器
     * *****************************************/
    var CustomerIteratorObj = {
        createObj: function(filter,pageSize,success,fail) {
            if(angular.isFunction(pageSize)) {
                fail = success;
                success = pageSize;
                pageSize = null;
            }
            var iterator= {
                list:[],
                todayPlanNum:0
            };

            /*私有属性*/
            var cur_filter ={};
            var timestamp = new Date();

            shallowClearAndCopy(filter,cur_filter);

            /*列表的公开属性*/
            iterator.page = {
                pageSize :pageSize || 20,
                pageNum : 0,
                pages : 1,
                total : 0,
            }

            /*刷新列表*/
            iterator.refresh=function(success,fail){

                $ionicLoading.show();
                iterator.page.pageNum = 0;
                iterator.page.pages = 1;
                iterator.page.total = 0;
                iterator.todayPlanNum =0;
                iterator.list = [];
                return iterator.loadMore(function(){

                    $ionicLoading.hide();
                })
            };

            iterator.hasMore = function() {
                return iterator.page.pageNum < iterator.page.pages;
            }

            /*列表的公开方法*/
            iterator.loadMore = function(success,fail) {
                if(iterator.page.pageNum>=iterator.page.pages) return null;
                var increase = [];
                iterator.page.pageNum++;
                var params = {};
                shallowCopy(cur_filter,params);
                shallowCopy(iterator.page,params);
                console.log('params',params);
                iterator.$promise = Customer.get(params,function(resp){
                    iterator.page.pageNum = resp.pageNum;
                    iterator.page.pages = resp.pages;
                    iterator.page.total = resp.total;
                    iterator.todayPlanNum = resp.todayPlanNum;
                    angular.forEach(resp.customers,function(item,index){
                        var obj = CustomerObj.createObj(item);
                        obj.$promise=iterator.$promise;
                        iterator.list.push(obj);
                        increase.push(obj);
                    });
                    console.log(iterator);
                    angular.isFunction(success) && success(increase);
                },function(err){
                    $ionicLoading.show({
                        template:'加载失败,'+err,
                        duration:1000,
                    });
                    angular.isFunction(fail) && fail(err);
                }).$promise;
                return iterator.$promise;
            }

            iterator.setFilter= function(filter,success,fail) {
                if(isNeedRefresh(filter)) {
                    shallowClearAndCopy(filter,cur_filter);
                    iterator.refresh(success,fail);
                }
            }

            function isNeedRefresh(filter){
                return JSON.stringify(cur_filter) != JSON.stringify(filter);
            }

            iterator.refresh(success,fail);
            return iterator;
        }
    }

    /************************************************
    /*客户对象
     * **********************************************/

    var CustomerObj = {

        /*初始化一个Customer对象
         * params:
         *  data:初始化数据
         */
        createObj:function(data) {
            var customer = data || {};

            /*私有属性*/
            /*客户的拜访记录的迭代器*/
            var scheduleIterator = null;

            /*私有方法*/


            /*公开属性*/


            /*公开方法*/
            /*获取拜访记录*/
            customer.getSchedules = function(filter) {
                if(scheduleIterator) return scheduleIterator;
                if(!scheduleIterator && !customer.id) {
                    scheduleIterator = {};
                    return scheduleIterator;
                };
                scheduleIterator = ScheduleService.getCustomerSchedules(customer.id,filter);
                return scheduleIterator;
            }

            customer.addSchedule = function(schedule) {
                var schedule = ScheduleService.addSchedule(schedule);
                schedule.$promise.then(function(){
                    customer.reset();
                });
            }

            customer.save = function(){
                if(customer.id) {
                    customer.$promise = Customer.update({},customer,function(resp){
                        shallowCopy(resp.customer,customer);
                        $ionicLoading.show({
                            template:'保存成功',
                            duration: 1000,
                        });
                    },function(resp){
                        $ionicLoading.show({
                            template:'保存失败',
                            duration:1000,
                        });
                    }).$promise;
                }else {
                    customer.$promise = Customer.save({},customer,function(resp){
                        shallowCopy(resp.customer,customer);
                        $ionicLoading.show({
                            template:'添加成功',
                            duration:1000,
                        });
                    },function(res){
                        $ionicLoading.show({
                            template:'添加失败',
                            duration:1000,
                        });
                    }).$promise;
                }

            }

            customer.reset = function() {
                if(customer.id) {
                    return Customer.get({id:customer.id},function(resp){
                        shallowCopy(resp.customer,customer);
                    }).$promise;
                }
            }
            return customer;
        }
    }


    /***************************************************
     * 服务方法接口
     * ************************************************

    /*生成一个新客户对象的服务接口*/
    this.newCustomer = function(data) {
         return CustomerObj.createObj(data);
    }

    /*添加新客户的服务接口*/
    this.addCustomer = function(data) {

        if(data.id) {
            var customer = data;
            customer.$promise = Customer.update({},data,function(resp){
                shallowCopy(resp.customer,customer);
                $ionicLoading.show({
                    template:'保存成功',
                    duration: 1000,
                });
            },function(resp){
                $ionicLoading.show({
                    template:'保存失败',
                    duration:1000,
                });
            }).$promise;
        }else {
            var customer = CustomerObj.createObj(data);
            customer.isNew = true;
            customer.$promise = Customer.save({},data,function(resp){
                shallowCopy(resp.customer,customer);
                iterator.list.unshift(customer);
                $ionicLoading.show({
                    template:'添加成功',
                    duration:1000,
                });
            },function(res){
                console.log(res);
                $ionicLoading.show({
                    template:'添加失败,'+res.data.message,
                    duration:1000,
                });
            }).$promise;
        }
    }


    /*获取客户的服务接口*/
    this.getCustomer = function(customer_id) {
        var customer = null;
        for(var i=0; iterator && i<iterator.list.length;i++){
            if(iterator.list[i].id == customer_id){
                iterator.list[i].index = i;
                customer = iterator.list[i];
            }
        }

        customer = customer || CustomerObj.createObj();
        customer.$promise = Customer.get({id:customer_id},function(resp){
            shallowCopy(resp.customer,customer);
        }).$promise;
        return customer;
    }


    /*获取全局客户列表的服务接口*/
    var iterator = null;
    this.getCustomerList = function(filter,success,fail){
        if(iterator) {
             if(filter) iterator.setFilter(filter);
             return iterator;
        }
        iterator = CustomerIteratorObj.createObj(filter,20,success,fail);
        return iterator;
    }


    /*TODO:获取本组客户的所有信息*/
    this.getGroupCustomers = function(success,fail) {
        var groupCustomersIterator = CustomerIteratorObj.createObj({scope:'group'},2000,success,fail);
        return groupCustomersIterator;
    }
    this.getMyCustomers = function(filter,success,fail) {
        console.log('getMyCustomers');
        var myCustomersIterator = CustomerIteratorObj.createObj(filter,20,success,fail);
        return myCustomersIterator;
    }
}])

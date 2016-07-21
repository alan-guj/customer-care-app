app.service('ScheduleService',
        ['ScheduleStorage','ScheduleLogStorage','$ionicLoading',
function( ScheduleStorage,  ScheduleLogStorage,  $ionicLoading){


    var ScheduleIteratorObj = {
        createObj: function(filter,pageSize,success,fail) {
            if(angular.isFunction(pageSize)) {
                fail = success;
                success = pageSize;
                pageSize = null;
            }
            var iterator = {
                list:[],
            };

            var loading_list = false;
            var cur_filter = filter;


            iterator.page = {
                pageSize :pageSize || 20,
                pageNum : 0,
                pages : 1,
                total : 0,
            }

            var timestamp = new Date();
            iterator.refresh=function(success,fail){
                $ionicLoading.show();
                iterator.page.pageNum = 0;
                iterator.page.pages = 1;
                iterator.page.total = 0;
                iterator.list = [];
                iterator.loadMore(function(){
                    $ionicLoading.hide();
                })
            };

            iterator.hasMore = function() {
                return iterator.page.pageNum<iterator.page.pages;
            }
            iterator.loadMore = function(success,fail) {

                if(iterator.page.pageNum>=iterator.page.pages) return null;

                var increase = [];
                iterator.page.pageNum++;
                var params = {};
                //shallowCopy(cur_filter,params);
                //shallowCopy(iterator.page,params);
                angular.extend(params,cur_filter,iterator.page);

                ScheduleStorage.get(params,function(resp){
                    iterator.page.pageNum = resp.pageNum;
                    iterator.page.pages = resp.pages;
                    iterator.page.total = resp.total;
                    iterator.page.pageSize = resp.pageSize;
                    angular.forEach(resp.schedules,function(item,index){
                        var obj = ScheduleObj.createObj(item);
                        iterator.list.push(obj);
                        increase.push(obj);
                    });
                    //console.log(iterator);
                    angular.isFunction(success) && success(increase);
                },function(err){
                    $ionicLoading.show({
                        template:'加载失败,'+err,
                        duration:1000,
                    });
                    angular.isFunction(fail) && fail(err);
                });

            }

            iterator.setFilter= function(filter,success,fail) {
                if(isNeedRefresh(filter)) {
                    cur_filter=filter;
                    iterator.refresh(success,fail);
                }
                angular.isFunction(success) && success();
            }

            function isNeedRefresh(filter){
                return JSON.stringify(cur_filter) != JSON.stringify(filter);
            }

            console.log(iterator);
            iterator.refresh();

            return iterator;

        }
    }

    var ScheduleObj = {
        createObj:function(data) {
            var schedule = data || {};


            schedule.buttons =[
                {text:'已拜访'},
                {text:'已取消'},
                {text:'延期'},
            ];
            var color = {
                '未拜访':'assertive',
                '已拜访':'balanced',
                '已取消':'energized',
                '延期':'stable',
            };
            var prior= {
                '未拜访':4,
                '已拜访':1,
                '已取消':2,
                '延期':3,
            };


            schedule.isToday = function(){
                if(!schedule) return false;
                var schedule_date = new Date(schedule.date);
                var today = new Date();
                return schedule_date.getFullYear() == today.getFullYear() &&
                    schedule_date.getMonth() == today.getMonth() &&
                        schedule_date.getDate() == today.getDate();
            }

            schedule.getButtons = function() {
                console.log('getButtons:',buttons);
                return buttons;
            }

            schedule.getColor = function() {
                return color[schedule.status];
            }

            schedule.getPrior = function() {
                return prior[schedule.status];
            }

            schedule.close = function(status) {
                schedule.status = status;
                if(schedule.id) {
                    ScheduleStorage.update({},schedule,function(resp){
                        shallowCopy(resp.schedule,schedule);
                        schedule.logs && schedule.logs.push(ScheduleLogStorage.save({schedule_id:schedule.id},{
                            type:'result',
                            time:new Date().toISOString(),
                            result:schedule.status
                        },function(resp){
                            $ionicLoading.show({
                                template:'关闭成功,'+schedule.status,
                                duration: 1000,
                            });
                        }));
                    },function(resp){
                        $ionicLoading.show({
                            template:'关闭失败',
                            duration:1000,
                        });
                    });
                }
            }
            schedule.reset = function() {
                ScheduleStorage.get({id:schedule.id},function(resp){
                    console.log('getlogs');
                    shallowCopy(resp.schedule,schedule);
                    schedule.getLogs();
                });

            }
            schedule.addLog = function(log,success,fail) {
                var new_log=ScheduleLogStorage.save({schedule_id:schedule.id},log,function(log){
                    new_log = log;
                    schedule.logs && schedule.logs.push(new_log);
                    angular.isFunction(success) && success(new_log);
                },function(error){
                    angular.isFunction(fail) && fail(error);
                    $ionicLoading.show({
                        template:'添加失败,'+error,
                        duration:1000,
                    });
                })
                return new_log;
            }

            schedule.addLogUrl = function(log,wx_url,success,fail){
                ScheduleLogStorage.save(
                    {schedule_id:schedule.id,log_id:log.id},
                    wx_url,
                    function(oss_url){
                        log.oss_urls = log.oss_urls || [];
                        log.oss_urls.push(oss_url.oss_url);
                    })
            }


            schedule.save = function(){
                if(schedule.id) {
                    ScheduleStorage.update({},schedule,function(resp){
                        shallowCopy(resp.schedule,schedule);
                        $ionicLoading.show({
                            template:'保存成功',
                            duration: 1000,
                        });
                    },function(resp){
                        $ionicLoading.show({
                            template:'保存失败',
                            duration:1000,
                        });
                    });
                }
            }

            schedule.logs = null;
            //schedule.loadLogs = function(){
                //if(schedule.id){
                    //ScheduleLogStorage.get({schedule_id:schedule.id},function(res){
                        //schedule.logs = res.logs;
                    //});
                //}
                //return schedule.logs
            //}

            schedule.getLogs = function() {
                 if(schedule.logs) return schedule.logs;
                 schedule.logs = [];
                 if(schedule.id){
                     ScheduleLogStorage.get({schedule_id:schedule.id},function(res){
                         schedule.logs = res.logs;
                     });
                 }
                 return schedule.logs
            }
            return schedule;
        }
    };

    this.newSchedule = function(data){
        return ScheduleObj.createObj(data);
    }

    this.addSchedule = function(data) {
        if(data.id) {
            var schedule = data;
            schedule.$promise = ScheduleStorage.update({},data,function(resp){
                shallowCopy(resp.schedule,schedule);
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
        } else {
            var schedule = ScheduleObj.createObj(data);
            schedule.isNew = true;
            schedule.$promise = ScheduleStorage.save({},data,function(resp){
                shallowCopy(resp.schedule,schedule);
                iterator && iterator.list.unshift(schedule);
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
        return schedule;
    }

    this.getSchedule = function(schedule_id) {
        console.log('getSchedule:',schedule_id);

        var schedule = null;
        for(var i=0; iterator && i<iterator.list.length; i++){
            if(iterator.list[i].id == schedule_id) {
                iterator.list[i].getLogs();
                return iterator.list[i];
            }
        }

        schedule = ScheduleObj.createObj();
        ScheduleStorage.get({id:schedule_id},function(resp){
            shallowCopy(resp.schedule,schedule);
            schedule.getLogs();
        });

        return schedule;
    };


    /*初始化全局日程列表*/
    var iterator = null;
    this.getScheduleList = function(filter,pageSize, success,fail){
        if(iterator) {
            iterator.setFilter(filter);
            return iterator;
        }
        iterator = ScheduleIteratorObj.createObj(filter,success,fail);
        return iterator;
    }


    this.getCustomerSchedules = function(customerId,filter,success,fail) {
        var filter = filter || {};
        filter.customerId = customerId;
        filter.status = 'neq:未拜访';
        return customerSchedules = ScheduleIteratorObj.createObj(filter,5,success,fail);
    }
}])

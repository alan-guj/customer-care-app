/**
 * Created by songsf on 2016/6/30.
 */

app.service('care_period',
    ['$rootScope',
        '$ionicModal',
        'Period',
        '$cacheFactory', 'current_user', 'sys_params','$ionicLoading',
        function ($rootScope, $ionicModal, Period, $cacheFactory, current_user, sys_params,$ionicLoading) {

            var periodCache = $cacheFactory("period-cache");
            var $scope = $rootScope.$new();
            init();
            var periodArr = new Array;
            $scope.period = {};
            $scope.rangeMax = sys_params.range_max;
            $scope.currentUserId = current_user.data.id;
            var callbacks = {};
            var care_period = {
                set: function (success, fail) {
                    callbacks = {
                        success: success,
                        fail: fail
                    };
                    showCarePeriodSetting();
                },
                get: function (success, fail) {
                    callbacks = {
                        success: success,
                        fail: fail
                    };
                    back();

                },
            };

            function init() {
                Period.get({}, {}, function (data) {
                    periodCache.put("period", data.careperiod);
                    var periodObj = periodCache.get("period");
                    periodArr = obj2arr(periodObj);
                    $scope.period = {
                        'fiveLevel': periodArr[4],
                        'fourLevel': periodArr[3],
                        'threeLevel': periodArr[2],
                        'twoLevel': periodArr[1],
                        'oneLevel': periodArr[0]
                    };
                });

            }

            /**
             *
             */
            function back() {
                callbacks.success(periodArr);
            };
            /**
             *控制客户关怀周期设置页面显示
             */
            function showCarePeriodSetting() {
                $scope.period = {
                    'fiveLevel': periodArr[4],
                    'fourLevel': periodArr[3],
                    'threeLevel': periodArr[2],
                    'twoLevel': periodArr[1],
                    'oneLevel': periodArr[0]
                };
                $ionicModal.fromTemplateUrl('templates/care_period_setting.html', {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.carePeriodSettingModal = modal;
                    $scope.carePeriodSettingModal.show();
                });
            }

            /**
             * 修改客户关怀周期，并修改本地缓存
             * @param carePeriod
             * @param currentUserId
             */
            $scope.update = function (carePeriod, currentUserId) {
                Period.update({id: currentUserId}, {
                    fiveLevel: carePeriod.fiveLevel,
                    fourLevel: carePeriod.fourLevel,
                    threeLevel: carePeriod.threeLevel,
                    twoLevel: carePeriod.twoLevel,
                    oneLevel: carePeriod.oneLevel
                }, function (data) {

                    $scope.period = data.careperiod;
                    periodCache.put("period", data.careperiod);
                    periodArr = obj2arr(data.careperiod);
                    $ionicLoading.hide();
                    $scope.carePeriodSettingModal.remove();
                    callbacks.success(periodArr);

                }, function (err) {
                    console.log(err);
                });
            };

            /**
             * 确认操作：将数据发往后台，返回上级页面，并将周期传到上级页面
             */
            $scope.doConfirm = function () {
                $ionicLoading.show();
                $scope.update($scope.period, $scope.currentUserId);

            };
            var periodCheck = function (data, range_max) {

                if (data > 0 && data < range_max) {
                    return true;
                } else {
                    return false;
                }
            };
            /**
             * 减少一天函数
             * @param num
             */
            $scope.addOne = function (num) {

                switch (num) {
                    case 5:
                        $scope.period.fiveLevel = parseInt($scope.period.fiveLevel);
                        periodCheck($scope.period.fiveLevel, $scope.rangeMax.five_max) ? $scope.period.fiveLevel += 1 : null;
                        break;
                    case 4:
                        $scope.period.fourLevel = parseInt($scope.period.fourLevel);
                        periodCheck($scope.period.fourLevel, $scope.rangeMax.four_max) ? $scope.period.fourLevel += 1 : null;
                        break;
                    case 3:
                        $scope.period.threeLevel = parseInt($scope.period.threeLevel);
                        periodCheck($scope.period.threeLevel, $scope.rangeMax.three_max) ? $scope.period.threeLevel += 1 : null;
                        break;
                    case 2:
                        $scope.period.twoLevel = parseInt($scope.period.twoLevel);
                        periodCheck($scope.period.twoLevel, $scope.rangeMax.two_max) ? $scope.period.twoLevel += 1 : null;
                        break;
                    case 1:
                        $scope.period.oneLevel = parseInt($scope.period.oneLevel);
                        periodCheck($scope.period.oneLevel, $scope.rangeMax.one_max) ? $scope.period.oneLevel += 1 : null;
                        break;
                }
                ;
            };
            /**
             * 减少一天函数
             * @param num
             */
            $scope.descOne = function (num) {
                switch (num) {
                    case 5:
                        $scope.period.fiveLevel = parseInt($scope.period.fiveLevel);
                        periodCheck($scope.period.fiveLevel, $scope.rangeMax.five_max) ? $scope.period.fiveLevel -= 1 : null;
                        break;
                    case 4:
                        $scope.period.fourLevel = parseInt($scope.period.fourLevel);
                        periodCheck($scope.period.fourLevel, $scope.rangeMax.four_max) ? $scope.period.fourLevel -= 1 : null;
                        break;
                    case 3:
                        $scope.period.threeLevel = parseInt($scope.period.threeLevel);
                        periodCheck($scope.period.threeLevel, $scope.rangeMax.three_max) ? $scope.period.threeLevel -= 1 : null;
                        break;
                    case 2:
                        $scope.period.twoLevel = parseInt($scope.period.twoLevel);
                        periodCheck($scope.period.twoLevel, $scope.rangeMax.two_max) ? $scope.period.twoLevel -= 1 : null;
                        break;
                    case 1:
                        $scope.period.oneLevel = parseInt($scope.period.oneLevel);
                        periodCheck($scope.period.oneLevel, $scope.rangeMax.one_max) ? $scope.period.oneLevel -= 1 : null;
                        break;
                }
            };
            /**
             * 复位操作：将周期设置初始化为系统配置周期
             */
            $scope.reSet = function () {
                $scope.period = {
                    'fiveLevel': sys_params.sys_period.five_star,
                    'fourLevel': sys_params.sys_period.four_star,
                    'threeLevel': sys_params.sys_period.three_star,
                    'twoLevel': sys_params.sys_period.two_star,
                    'oneLevel': sys_params.sys_period.one_star,
                };
            };
            /**
             *
             * @param carePeriod
             */
            var obj2arr = function (carePeriod) {
                return [carePeriod.oneLevel, carePeriod.twoLevel, carePeriod.threeLevel, carePeriod.fourLevel, carePeriod.fiveLevel];

            };
            return care_period;

        }]);

/**
 * Created by songsf on 2016/6/18.
 */
app.controller('care_period_setting_ctrl', ['$scope', '$ionicModal', 'ionicDatePicker', 'Period', 'current_user', 'sys_params', 'care_period',
    function ($scope, $ionicModal, ionicDatePicker, Period, current_user, sys_params, care_period) {
        console.log("current_user", current_user);
        care_period.init();
        $scope.$on('care_period_setting', function (event, cUser) {
            $scope.currentUserId = current_user.data.id;
            console.log("care_period_setting******",care_period.get());
            var period=care_period.get();
            $scope.period = {
                'fiveLevel': period[4],
                'fourLevel': period[3],
                'threeLevel': period[2],
                'twoLevel': period[1],
                'oneLevel': period[0],
            };
            console.log("获取周期为", $scope.period);

        });

        $scope.rangeMax = sys_params.range_max;


        /**
         * 确认操作：将数据发往后台，返回上级页面，并将周期传到上级页面
         */
        $scope.doConfirm = function () {
            $scope.periodChange = {};
            $scope.careperiod = {
                fiveLevel: parseInt($scope.period.fiveLevel),
                fourLevel: parseInt($scope.period.fourLevel),
                threeLevel: parseInt($scope.period.threeLevel),
                twoLevel: parseInt($scope.period.twoLevel),
                oneLevel: parseInt($scope.period.oneLevel)
            };
            care_period.update($scope.careperiod, $scope.currentUserId);
            $scope.carePeriodSettingModal.hide();
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
                    periodCheck($scope.period.fiveLevel, $scope.rangeMax.five_max) ? $scope.period.fiveLevel += 1 : null;
                    break;
                case 4:
                    periodCheck($scope.period.fourLevel, $scope.rangeMax.four_max) ? $scope.period.fourLevel += 1 : null;
                    break;
                case 3:
                    periodCheck($scope.period.threeLevel, $scope.rangeMax.three_max) ? $scope.period.threeLevel += 1 : null;
                    break;
                case 2:
                    periodCheck($scope.period.twoLevel, $scope.rangeMax.two_max) ? $scope.period.twoLevel += 1 : null;
                    break;
                case 1:
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
                    periodCheck($scope.period.fiveLevel, $scope.rangeMax.five_max) ? $scope.period.fiveLevel -= 1 : null;
                    break;
                case 4:
                    periodCheck($scope.period.fourLevel, $scope.rangeMax.four_max) ? $scope.period.fourLevel -= 1 : null;
                    break;
                case 3:
                    periodCheck($scope.period.threeLevel, $scope.rangeMax.three_max) ? $scope.period.threeLevel -= 1 : null;
                    break;
                case 2:
                    periodCheck($scope.period.twoLevel, $scope.rangeMax.two_max) ? $scope.period.twoLevel -= 1 : null;
                    break;
                case 1:
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
            console.log("^^^^^^^^^^^^^^^^^", care_period.get())

        }
    }]);
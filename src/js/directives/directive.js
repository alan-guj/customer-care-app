app.directive('input', ['dateFilter', function(dateFilter) {
            return {
                restrict: 'E',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    if (
                           'undefined' !== typeof attrs.type
                        && 'time' === attrs.type
                        && ngModel
                    ) {
                        ngModel.$formatters=[(function(modelValue) {
                            console.log(modelValue);
                            return dateFilter(modelValue, 'HH:mm');
                            //return '18:23';
                        })];

                        ngModel.$parsers.push(function(viewValue) {
                            var time=new Date();
                            time.setHours(viewValue.getHours());
                            time.setMinutes(viewValue.getMinutes());
                            //console.log('time:',time);
                            return time;
                        });
                    }
                }
            }
}])

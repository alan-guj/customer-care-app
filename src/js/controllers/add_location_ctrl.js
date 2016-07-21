app.controller('add_location_ctrl', [ '$scope','$ionicModal','Popup', function($scope, $ionicModal, Popup) {

	var locInfo =null;

	 /************************************************************************
     * 监听选择的地图位置
     * *********************************************************************/
    window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            locInfo = loc;
        }
    	}, false);

	    /************************************************************************
	     * 取消位置
	     * *********************************************************************/
    	$scope.cancelSend = function(){
    		$scope.$emit('cancel_add_location_log');
    	};

    	 /************************************************************************
         * 发送位置
         * *********************************************************************/
        $scope.submitSend = function(){
            if(!locInfo){
                console.log(locInfo,'null');
                Popup.notice('请选择位置',2000);
            }
            else {
                $scope.$emit('confirm_add_location_log',locInfo);
                $scope.add_location_modal.hide();
            }
        };

}])

app.controller('add_schedule_item_ctrl', [ '$scope', '$ionicModal','Schedule','ionicDatePicker','$filter',
		function($scope, $ionicModal,Schedule,ionicDatePicker,$filter) {
			var date_value = new Date();
			$scope.careWayGrp = [ '当面拜访', '电话拜访', '科室会','学术培训' ];
			initStartData();
			
			/** *********取消日程新增或者编辑************ */
			$scope.cancelAdd = function() {
				initStartData();
				if($scope.edit_schedule_item_modal){
					$scope.edit_schedule_item_modal.hide();
				}

				if($scope.add_schedule_item_modal){
					$scope.add_schedule_item_modal.hide();
				}
				$scope.$emit('customList_add_schedule_item_confirm',"");
			}

			/** *********日程新增，更新*********** */
			$scope.submitAdd = function() {
				console.log($scope.scheduleInfo);
				//如果日程ID不是0或者 -1，则处于编辑状态，提交为编辑
				if($scope.scheduleInfo.schedule_id > 0){
					Schedule.update({id:$scope.scheduleInfo.schedule_id}, $scope.scheduleInfo, function(resp) {
						//通知父页面更新
						$scope.$emit('add_schedule_item_confirm',resp.schedule);
					}, function(err) {
						console.log(err)
					});
				}else{
						Schedule.save({}, $scope.scheduleInfo, function(resp) {
						//通知主页面更新
						$scope.$emit('add_schedule_item_confirm',resp.schedule);

						//通知客户列表页面更新
						$scope.$emit('customList_add_schedule_item_confirm',resp.schedule);

					}, function(err) { 	
						console.log(err)
					});
				}

				//清理数据
				initStartData();
			}

			/** 客户列表页面通知新增日程*********** */
			$scope.$on('customList_add_schedule_item', function(event, id , name) {
					initStartData();
					//来自客户列表页的修改，客户不能再修改，更改schedule_id确保名称不能再被修改
					$scope.scheduleInfo.schedule_id=-1;					
					$scope.scheduleInfo.customer_id=id;
					$scope.scheduleInfo.customer_name=name;
			})


			/** *********主页面通知日程编辑*********** */
			$scope.$on('edit_schedule_item',function(event,item){
				var date = new Date(item.date);
				$scope.scheduleInfo = {
					schedule_id:item.id,
					customer_id:item.customer.id,
					customer_name:item.customer.name,
					date:item.date,
					dateShow:$filter('date')(date,'mediumDate'),
					description:item.description,
					purpose:item.purpose,
					type:item.type
				}
		    })


			//初始化数据
			function initStartData(){
				$scope.scheduleInfo = {schedule_id:0,customer_id:0,customer_name:"",description:"",purpose:"",type:$scope.careWayGrp[0]};
		    	$scope.scheduleInfo.date = date_value.toISOString();
		    	$scope.scheduleInfo.dateShow = $filter('date')(date_value,'mediumDate');
			}

			/*****************************************************
		     * 显示日期控件
		     * ***************************************************/
		    var datepicker= {
		    	from: new Date(),
		        callback: function (val) {
		            date_value.setTime(val);
		            $scope.scheduleInfo.date = date_value.toISOString();
		            $scope.scheduleInfo.dateShow = $filter('date')(date_value,'mediumDate');
		        }
		       
		    };

		    /**************************************************
		     * 选择时间
		     **************************************************/
			 $scope.pick_schedule_date = function() {
			 	if($scope.scheduleInfo.date){
					date_value = new Date($scope.scheduleInfo.date);
			 	}
		        datepicker.inputDate = date_value;
		        ionicDatePicker.openDatePicker(datepicker);
		    }

		    /**************************************************
		     * 选择客户模态框
		     **************************************************/
			$ionicModal.fromTemplateUrl('templates/select_customer.html',
			{
				scope : $scope,
				animation : 'slide-in-up'
			}).then(function(modal) {
				$scope.select_customer_modal = modal;
			});

			//
			$scope.showCustomerLst = function() {
				if($scope.scheduleInfo.schedule_id != 0 ) return false;
				$scope.$broadcast('load_customer_list');
				$scope.select_customer_modal.show();
			};
		} ])

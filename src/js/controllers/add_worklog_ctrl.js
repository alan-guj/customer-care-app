app.controller('add_worklog_ctrl', [ '$scope', '$ionicModal',
		function($scope, $ionicModal) {

			// 初始化工作日志对象
			initStartData();


			/** *********取消工作日志新增************ */
			$scope.cancelAdd = function() {
				initStartData();
				$scope.$emit('worklog_cancel');
			}

			/** *********工作日志新增************ */
			$scope.submitAdd = function() {
				var timest = new Date();
				var log_json = {
					id : $scope.worklog.id,
					type : 'worklog',
					time : timest.toISOString(),
					content : {
						'成功之处' : $scope.worklog.successDesc,
						'待改进' : $scope.worklog.improveDesc,
						'下一步计划' : $scope.worklog.plan
					}
				}

				if($scope.worklog.isEdit){//通知父页面，更新日程日志
					$scope.$emit('edit_worklog_confirm',log_json);
				}else{//通知父页面，新增日程日志
					$scope.$emit('add_worklog_confirm',log_json);
				}
			}

			/** *********日程工作日志编辑*********** */
			$scope.$on('edit_worklog',function(event,worklog,editable){
				$scope.isEditable = editable;
				console.log(editable)
				$scope.worklog = {
					isEdit:true,
					id:worklog.id,
					successDesc : worklog.content.成功之处,
					improveDesc : worklog.content.待改进,
					plan : worklog.content.下一步计划
				};
		    })


		    function initStartData(){
		    	$scope.isEditable = true;
		    	$scope.worklog = {
					isEdit:false,
					id:0,
					successDesc : "",
					improveDesc : "",
					plan : ""
				};
		    }
		} ])

app.service('select_enpuser',
        [ '$rootScope', '$filter', '$ionicModal','EnporgUser',
function(  $rootScope, $filter, $ionicModal,EnporgUser) {
	var $scope = $rootScope.$new();
    function createModal(bool){
        $ionicModal.fromTemplateUrl('templates/select_enpuser.html',{
            scope : $scope,
            animation : 'slide-in-right'
        }).then(function(modal) {
            $scope.select_enpuser_modal = modal;
            if(bool){
                $scope.select_enpuser_modal.show();
            }
        });
    }
    $scope.iObj = {"inputNameModel":""};
    var callbacks = {};var isFirstTime = true;
    $scope.multiSelect = false;
    $scope.enpuserObj = {} ;$scope.selectedObj = {};
    var select_enpuser = {
    	setSelect:function(arr){
    		 for(var o in $scope.selectedObj){
    		 	$scope.enpuserObj[o] = $scope.selectedObj[o];
    		 }
    		 $scope.selectedObj = {};
    		 for(var x=0;x<arr.length;x++){
    		 	delete $scope.enpuserObj[arr[x].id];
		 		$scope.selectedObj[arr[x].id] = arr[x];
		 		$scope.selectedObj[arr[x].id].show = true;
    		 }

    		 for(var k in $scope.enpuserObj){
    		 	$scope.enpuserObj[k].show = true;
    		 }

    	// 	 for(var x=0;x<arr.length;x++){
    	// 	 	delete $scope.enpuserObj[arr[x].id];
    	// 	 }
		 	 // for(var o in $scope.selectedObj){
		 		// $scope.enpuserObj[o] = $scope.selectedObj[o];
		 		// $scope.enpuserObj[o].show = true;
		 	 // }
    	// 	 $scope.selectedObj = {};
    	// 	 for(var x=0;x<arr.length;x++){
    	// 	 	$scope.selectedObj[arr[x].id] = arr[x];
    	// 	 	$scope.selectedObj[arr[x].id].show = true;
    	// 	 	delete $scope.enpuserObj[arr[x].id];
    	// 	 }
    	// 	 for(var k in $scope.enpuserObj){
    	// 	 	$scope.enpuserObj[k].show = true;
    	// 	 }
    		 console.log("$scope.enpuserObj",$scope.enpuserObj);
    		  console.log("$scope.selectedObj",$scope.selectedObj);
    	},
    	multiSelect:function(bool){
    		 $scope.multiSelect = bool;
    	},
        destory:function(){
            isFirstTime = true;
            $scope.select_enpuser_modal.remove();
        },
        createModal:function(){
            createModal(true);
        },
    	show:function(){
    		$scope.iObj.inputNameModel = "";
    		$scope.select_enpuser_modal.show();
    	},
    	hide:function(){
    		$scope.select_enpuser_modal.hide();
    	},
        init: function(bools,orgid,multiSelect,selectedArr,success, fail){
            if(bools){createModal(false);}
            callbacks = {
                success:success,
                fail:fail,
            };
            $scope.multiSelect = multiSelect;
            $scope.enpuserObj = {} ;$scope.selectedObj = {};
            for(var k=0;k<selectedArr.length;k++){
            	$scope.selectedObj[selectedArr[k].id] = selectedArr[k];
            	$scope.selectedObj[selectedArr[k].id].show = true;
            }
            EnporgUser.get({orgid:orgid},function(resp){
                 var tmpArr = new Array();
                 for(var x=0;x<resp.enpuser.length;x++){
                 	if(resp.enpuser[x].userId>0){
                 		var isExist = false;
                 		for(var y=0;y<selectedArr.length;y++){
                 			if(resp.enpuser[x].userId==selectedArr.id){
                 				isExist = true;
                 			}
                 		}
                 		if(isExist) continue;
                 		$scope.enpuserObj[resp.enpuser[x].userId] = ({id:resp.enpuser[x].userId,name:resp.enpuser[x].name,checked:isExist,show:true});
                 	}
                 }
            },function(err){
                console.log(err);
                callback.fail && callbacks.fail(err);
            });
            // $scope.select_enpuser_modal.show();
        }
    };
    $scope.nameInputChange = function(name){
    	for(var o in $scope.enpuserObj){
    		if($scope.enpuserObj[o].name.indexOf(name)>-1){
    			$scope.enpuserObj[o].show = true;
    		}else{
    			$scope.enpuserObj[o].show = false;
    		}
    	}
    	for(var p in $scope.selectedObj){
    		if($scope.selectedObj[p].name.indexOf(name)>-1){
    			$scope.selectedObj[p].show = true;
    		}else{
    			$scope.selectedObj[p].show = false;
    		}
    	}
    }
    $scope.pInputClick = function(item,bool){
    	if(bool){//zegnjia
    		if(!$scope.multiSelect){//danxuan
    			for(var o in $scope.selectedObj){
    				$scope.enpuserObj[o] = {};
    				$scope.enpuserObj[o]["id"] = $scope.selectedObj[o].id;
    				$scope.enpuserObj[o]["name"] = $scope.selectedObj[o].name;
    				$scope.enpuserObj[o]["star"] = $scope.selectedObj[o].star;
    				$scope.enpuserObj[o]["show"] = true;
    				delete $scope.selectedObj[o];
    			}
    			$scope.selectedObj = {};
    		}
			delete $scope.enpuserObj[item.id] ;
			$scope.selectedObj[item.id] = item;
			$scope.selectedObj[item.id].show = true;
    	}else{
    		$scope.enpuserObj[item.id] = item;
    		$scope.enpuserObj[item.id].show = true;
    		delete  $scope.selectedObj[item.id];
    	}
    	var type="";
    	if(bool){
    		type = "add";
    	}else{
    		type = "delete";
    	}
    	if(!$scope.multiSelect){
    		type = "add";
    	}
    	callbacks.success && callbacks.success({id:item.id,name:item.name},type);
    }
    return select_enpuser;
}])

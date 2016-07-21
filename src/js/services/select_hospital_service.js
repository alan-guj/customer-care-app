app.service('hospital_service',
        [ '$rootScope', '$filter', '$ionicModal','Hospital','$ionicScrollDelegate',
function(  $rootScope, $filter, $ionicModal,Hospital,$ionicScrollDelegate) {
	var $scope = $rootScope.$new();
    var page = { pageSize :20,pageNum : 1,pages : 0,total : 0}
    function createModal(){
        $ionicModal.fromTemplateUrl('templates/select_hospital.html',{
            scope : $scope,
            animation : 'slide-in-right'
        }).then(function(modal) {
            $scope.select_hospital_modal = modal;
        });
    }
    function resetPage(){
        page = {pageSize :20,pageNum : 1,pages : 0,total : 0};
    }
    $scope.loadMoreData = function(){
        // console.log("=======更多========");
        getHospital(false);
    }
    $scope.hasMoreData = function(){
         // console.log("=======>>>>>========",page.pageNum , page.pages);
        return page.pageNum < page.pages;
    }
    $scope.iObj = {"inputNameModel":""};
    var callbacks = {};
    $scope.multiSelect = false;
    $scope.hospitalObj = {} ;$scope.selectedObj = {};
    var select_hospital = {
    	multiSelect:function(bool){
    		 $scope.multiSelect = bool;
    	},
        destory:function(){
            resetPage();
            $scope.select_hospital_modal.remove();
        },
        createModal:function(){
            createModal(true);
        },
    	show:function(arr){
    		 $scope.iObj.inputNameModel = "";
             $scope.selectedObj = {};
             for(var x=0;x<arr.length;x++){
                $scope.selectedObj[arr[x].id] = arr[x];
             }
             $scope.hospitalObj = new Object();
             resetPage();
             getHospital(true);
    		 $scope.select_hospital_modal.show();
    	},
    	hide:function(){
    		$scope.select_hospital_modal.hide();
    	},
        init: function(multiSelect,success, fail){
            createModal();
            callbacks = {success:success, fail:fail};
            $scope.multiSelect = multiSelect;
            $scope.hospitalObj = {} ;$scope.selectedObj = {};
            getHospital(true);
        }
    };
    function getHospital(bool){
        var obj = new Object();
        obj.count = bool;
        obj.pageNum = page.pageNum;
        obj.pageSize = page.pageSize;
        obj.hospitalName = $scope.iObj.inputNameModel;
        Hospital.get(obj,{},function(param){
            if(bool){
                page.pages = param.pages;
                $scope.hospitalObj = new Object();
            }else{
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            if(page.pages>page.pageNum){
                page.pageNum++;
            }
            var resp = param.resultList;
            var tmpArr = new Array();
            for(var x=0;x<resp.length;x++){
                if($scope.selectedObj.hasOwnProperty(resp[x].hospitalId)){
                    continue;
                }
                $scope.hospitalObj[resp[x].hospitalId] = ({id:resp[x].hospitalId,name:resp[x].hospitalName,show:true});
            }
        });
    }
    $scope.nameInputChange = function(){
        $ionicScrollDelegate.scrollTop();
        resetPage();
        getHospital(true);
    }
    $scope.pInputClick = function(item,bool){
    	if(bool){//zegnjia
    		if(!$scope.multiSelect){//danxuan
    			for(var o in $scope.selectedObj){
    				$scope.hospitalObj[o] = {};
    				$scope.hospitalObj[o]["id"] = $scope.selectedObj[o].id;
    				$scope.hospitalObj[o]["name"] = $scope.selectedObj[o].name;
    				delete $scope.selectedObj[o];
    			}
    			$scope.selectedObj = {};
    		}
			delete $scope.hospitalObj[item.id] ;
			$scope.selectedObj[item.id] = item;
    	}else{
    		$scope.hospitalObj[item.id] = item;
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
    	callbacks.success && callbacks.success({id:item.id,name:item.name,select:bool},type);
    }
    return select_hospital;
}])

app.service('select_provinces',
        [ '$rootScope', '$filter', '$ionicModal',
function(  $rootScope, $filter, $ionicModal) {
	var $scope = $rootScope.$new();
    $scope.unSelectedArray = 
    ['北京','广东','上海','天津','重庆','辽宁','江苏','湖北','四川','陕西',
     '河北','山西','河南','吉林','黑龙江','内蒙古','山东','安徽','浙江','福建',
     '湖南','广西','江西','贵州','云南','西藏','海南','甘肃','宁夏','青海',
     '新疆','香港','澳门','台湾','海外'
    ];
    $scope.selectedArray = [];
    $scope.multiSelect = false;
    $scope.searchText='';

    function createModal(bool){
        $ionicModal.fromTemplateUrl('templates/select_provinces.html',{
            scope : $scope,
            animation : 'slide-in-right'
        }).then(function(modal) {
            $scope.select_provinces_modal = modal;  
            if(bool) {$scope.select_provinces_modal.show();}
            
        });
    }
    
   $scope.selectItem = function(bool,p){
       if (bool){
        $scope.unSelectedArray.remove(p);
        $scope.selectedArray.unshift(p);
        $scope.passSelectVal.provinces = $scope.selectedArray.join(',');
       }else{
        $scope.selectedArray.remove(p);
        $scope.unSelectedArray.unshift(p);
        $scope.passSelectVal.provinces = $scope.selectedArray.join(',');
       }
   }
    
    var select_item = {    	
    	
        destory:function(){
            $scope.select_provinces_modal.remove();
        },
    	show:function(){
    		$scope.select_provinces_modal.show();
    	},
    	hide:function(){
    		$scope.select_provinces_modal.hide();
    	},
        init: function(obj,multiSelect){
            createModal(false);
            $scope.multiSelect = multiSelect;

            if(obj.provinces !=""){
                $scope.selectedArray = obj.provinces.split(",");
            }
            $scope.passSelectVal = obj;
            for(var k=0;k<$scope.selectedArray.length;k++){
            	$scope.unSelectedArray.remove($scope.selectedArray[k]);
            }
        }
    };
    
    
    return select_item;
}])
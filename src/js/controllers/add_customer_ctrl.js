app.controller('add_customer_ctrl',['$scope','$ionicModal','ionicDatePicker','$filter',function($scope,$ionicModal,ionicDatePicker,$filter){




	$scope.$watch('$viewContentLoaded', function() {  
	           
	});  
	$scope.hospitalarr = [{id:1,name:"1医院"},{id:2,name:"2医院"},{id:3,name:"3医院"},{id:4,name:"4医院"},{id:5,name:"5医院"}];
	$scope.cunsomerarr = [{id:1,name:"人员1 "},{id:2,name:"人员2"},{id:3,name:"人员3"},{id:4,name:"人员5"},{id:5,name:"人员5"}];
	$scope.star = [0,1,2,3,4];
	$scope.starIndex = 0;

	/*****************************************************
     * 显示日期控件
     * ***************************************************/

    var select_date_value = new Date();
    $scope.select_date = $filter('date')(select_date_value,'mediumDate');
    var datepicker= {
        callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            select_date_value.setTime(val);
            $scope.select_date = $filter('date')(select_date_value,'mediumDate');
        },
    };

    $scope.pick_date = function() {
        datepicker.inputDate = select_date_value;
        ionicDatePicker.openDatePicker(datepicker);
    };



	/**
	 *星星点击事件
	 */
	$scope.starClick = function(index,e){
		// console.log($scope.starIndex+"-----"+index);
		$scope.starIndex = index+1;
		if($(e.currentTarget).hasClass("active")){
			$scope.starIndex--;
		}

		// var tmp = index+1
		// if($(e.currentTarget).hasClass("active")){
		// 	if(index<($scope.starIndex-1)){
		// 		$scope.starIndex = index+1;
		// 	}else{
		// 		$scope.starIndex --;
		// 	}
		// }else{
		// 	$scope.starIndex = index+1;
		// }
	};
	$scope.chechPhoneNum = function(e){
		if(!(/^1[3|4|5|7|8]\d{9}$/.test($(e.currentTarget).val()))){ 
       		 $(e.currentTarget).css({"border":"1px solid red"}); 
    	}else{
    		$(e.currentTarget).css({"border":"0px"}); 
    	}
	}
	/**
	 *输入框聚焦
	 */
	$scope.inputFocus = function(){

	};
	/**
	 *添加医院
	 */
	$scope.addHospital = function(){
		if($("#hospital-input").val()!=""){
			$scope.hospitalarr.push({id:7,name:$("#hospital-input").val()});	
			$("#hospital-input").val("");
		}
		
	};
	/**
	 *取消医院
	 */
	$scope.cancelHosp = function(id){//alert(id);
		for(var x=0;x<$scope.hospitalarr.length;x++ ){
			if($scope.hospitalarr[x].id==id){
				$scope.hospitalarr.splice(x,1);
				break;
			}
		}
		
	};

	
	/**
	 *添加成员
	 */
	$scope.addCustomer = function(id){//alert(id);
		if($("#cunsomer-input").val()!=""){
			$scope.cunsomerarr.push({id:7,name:$("#hospital-input").val()});	
			$("#cunsomer-input").val("");
		}
		
	};
	/**
	 *取消人员
	 */
	$scope.cancelCustom = function(id){//alert(id);
		for(var x=0;x<$scope.cunsomerarr.length;x++ ){
			if($scope.cunsomerarr[x].id==id){
				$scope.cunsomerarr.splice(x,1);
				break;
			}
		}
		
	};
	/**
	 *取消添加人员
	 */
	$scope.calcelFun = function(){//alert(id);
		$scope.addCustomerModal.hide();
	};


}])
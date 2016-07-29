app.service('customer_info',
        [ '$rootScope', '$filter','current_user', '$ionicModal','CustomerService','ionicDatePicker','hospital_service',
function(  $rootScope, $filter,current_user, $ionicModal,CustomerService,ionicDatePicker,hospital_service) {
	  var $scope = $rootScope.$new();var re = /^1[3|4|5|7|8]\d{9}$/;var isEdit = false; var select_date_value = new Date();
    var images = {localId: [],serverId: []}; 
    $scope.repreArr = [
        {name:"医生"},
        {name:"医院代理商"}, 
        {name:"地市代理商"},
        {name:"省级代理商"},
        {name:"业务代表"},
        {name:"科室主任"},
        {name:"省代招商经理"},
        {name:"省代学术经理"},
        {name:"未知"}
    ];
    function initPrarm(){
      images = {localId: [],serverId: []};
      $scope.select_data_show = "";
    	select_date_value = new Date();
    	$scope.stars = [30, 20, 15, 10, 5];$scope.relationObj = {users:[]};
		  $scope.phoneNumCheck=false;$scope.hospitalCheck=false;
	   	$scope.eyeObj = {};$scope.eyeObj.show =false;isEdit = false;
		  $scope.starObj = {};$scope.starObj.num =0;
	    $scope.userTips={tips:""};
	    $scope.userObject = {customers:[],
    							mobile: "",
    							tipsList :"",
					        name: "",
					        address: "",
					        type: "未知",
					        birthday: "",
					        hospitalList: "",
					        province :"",
					        sex:"未知",
					        headUrl: "",
                  hospitals:[],
					        myCustomer: {star: 0,type: ""}
		      };
      hospital_service.init(true,function(param){
          console.log("----------",param);
          if(param.select){//选中
              $scope.userObject.hospitals.push({id:param.id,name:param.name});
          }else{
              $scope.cancelHospM(param.id);
          }
        });
    }
  var callbacks = {};
	var customer_info = {
		add:function(callbackfun){
            callbacks.function = callbackfun;
      			initPrarm();
      			showUserInfoModal();
      			initProvince([]);
      			$scope.userObject.myCustomer.type = "primaryOwner";
            if($scope.select_data_show==""){
                $scope.userObject.birthday="";
            }else{
                $scope.userObject.birthday=select_date_value;
            }
      			var groupCustomerIterator = CustomerService.getGroupCustomers();
            var groupCustomer = groupCustomerIterator.list;
            groupCustomerIterator.$promise.then(function(){
                for (var i = 0; i < groupCustomer.length; i++) {
                    $scope.relationObj.users.push({id: groupCustomer[i].id, name: groupCustomer[i].name});
                }
            });
		},
		edit:function(paramCustomer){ ;
      			initPrarm();
      			showUserInfoModal();
      			isEdit = true;
            $scope.userObject = paramCustomer;//CustomerService.getCustomer(customer_id);
            $scope.userObject.$promise.then(function(){
        				$scope.select_data_show = $filter('date')( $scope.userObject.birthday, 'mediumDate');
        				$scope.starObj.num = $scope.userObject.myCustomer.star;
        				if(current_user.enpinfo.hasOwnProperty("isManager") && current_user.enpinfo.isManager){
    					     $scope.eyeObj.show =true;
        					if($scope.userObject.myCustomer.type==""){
        						$scope.starObj.num =0
        					}
    				    }
        				if(!$scope.userObject.hasOwnProperty("customers")){
        					$scope.userObject.customers = [];
        				}
        				if($scope.userObject.hasOwnProperty("province")){
        					initProvince($scope.userObject.province.split("-"));
        				}else{
        					initProvince([]);
        				}
            }).then(function(){
                var groupCustomerIterator = CustomerService.getGroupCustomers();
                var groupCustomer = groupCustomerIterator.list;
                groupCustomerIterator.$promise.then(function(){
                    for (var i = 0; i < groupCustomer.length; i++) {
                        var isNotE = true;
                        for(var x=0;$scope.userObject.customers && x<$scope.userObject.customers.length;x++){
                            if(groupCustomer[i].id==$scope.userObject.customers[x].id){
                                isNotE = false;break;
                            }
                        }
                        if(isNotE){
                            $scope.relationObj.users.push({id: groupCustomer[i].id, name: groupCustomer[i].name});
                        }
                    }
                });
            });
		}
	};
	$scope.cancelFunction = function(){
    hospital_service.destory();
		if(isEdit){
			$scope.userObject.reset();
		}
		$scope.user_info_modal.remove();
	}
	$scope.submitFunction = function () {
    hospital_service.destory();
		if(images.serverId.length != 0 ){
			$scope.userObject.headUrl = images.serverId[0];
		}else{
			$scope.userObject.headUrl="";
		}
		var arr = [];

		for(var x=0;x<$scope.userObject.customers.length;x++){
			arr.push($scope.userObject.customers[x].id);
		}
		$scope.userObject.customerRelList = arr.join(",");
		$scope.userObject.myCustomer.star = $scope.starObj.num;
		if(isEdit){
			$scope.userObject.save();
		}else{
			// $scope.userObject.star = $scope.starObj.num;
			CustomerService.addCustomer($scope.userObject);
		}
    // $scope.$emit('add_customer_result', 'confirm');
		$scope.user_info_modal.remove();
		callbacks.function();
		
	}
	$scope.addCustomerM = function(obj){
		var bool = true;var data = $scope.$eval(obj);
		for(var x=0;x<$scope.userObject.customers.length;x++){
			if($scope.userObject.customers[x].id==data.id){
				bool = false;break;
			}
		}
		if(bool){
			$scope.userObject.customers.push({id:data.id,name:data.name});
			for(var x=0;x<$scope.relationObj.users.length;x++){
				if($scope.relationObj.users[x].id==data.id){
					$scope.relationObj.users.splice(x,1);break;
				}
			}
		}
	}
	$scope.cancelCustomM = function(data){
		for(var x=0;x<$scope.userObject.customers.length;x++){
				if($scope.userObject.customers[x].id==data.id){
					$scope.userObject.customers.splice(x,1);break;
				}
		}
		$scope.relationObj.users.push({id:data.id,name:data.name});
	}
	$scope.changeEyeFun = function(){
		if($scope.userObject.myCustomer.type==""){
			$scope.userObject.myCustomer.type="otherOwner";
			$scope.starObj.num = $scope.userObject.myCustomer.star;
		}else{
			$scope.userObject.myCustomer.type="";
			$scope.starObj.num = 0;
		}
	}
	$scope.modifyStars =  function (index, e) {
			if($scope.eyeObj.show && $scope.userObject.myCustomer.type==""){
				return false;
			}
            $scope.starObj.num = index + 1;
            if ($(e.currentTarget).hasClass("active")) {
                $scope.starObj.num--;
            }
     };

	function showUserInfoModal(){
		$ionicModal.fromTemplateUrl('templates/add_modify_customer.html',{
            scope : $scope,
            animation : 'slide-in-right'
        }).then(function(modal) {
            $scope.user_info_modal = modal;
            $scope.user_info_modal.show();
        });
	}
   $scope.numCheck=function () {
	    $scope.phoneNumCheck=!re.test($scope.userObject.mobile);
   };
   $scope.addTipsFun = function(){
	   	if(!$scope.userObject.hasOwnProperty("tipsList")){
	   		$scope.userObject.tipsList="";
	   	}
   		if($scope.userTips.tips!=""){
   			var tmp =  $scope.userObject.tipsList+",";
   			if( tmp.indexOf($scope.userTips.tips+",")==-1){
   				if($scope.userObject.tipsList.length>0){
   					$scope.userObject.tipsList+=","+$scope.userTips.tips;
	   			}else{
	   				$scope.userObject.tipsList+=$scope.userTips.tips;
	   			}
	   			$scope.userTips.tips="";
	   		}
   		}
   }
   $scope.addHospitalM = function(){
        hospital_service.show($scope.userObject.hospitals);
   }
   $scope.cancelHospM = function(param){
        for(var x=0;x< $scope.userObject.hospitals.length;x++){
            if($scope.userObject.hospitals[x].id==param){
              $scope.userObject.hospitals.splice(x,1);
              break;
            }
        }
   }
   $scope.cancelTips = function(param){
   		$scope.userObject.tipsList+=",";
   			$scope.userObject.tipsList = $scope.userObject.tipsList.replace((param+","),"");
   			if($scope.userObject.tipsList!="" && $scope.userObject.tipsList.lastIndexOf(",")==$scope.userObject.tipsList.length-1){
   				$scope.userObject.tipsList = $scope.userObject.tipsList.substring(0,$scope.userObject.tipsList.length-1);
   		}
   }

	/*****************************************************
         * 显示日期控件
         * ***************************************************/
    // if(isEdit){
    // 	select_date_value = $scope.userObject.birthday;
    // }else{
    // 	 $scope.userObject.birthday=select_date_value;
    // }
    // $scope.select_data_show = $filter('date')(select_date_value, 'mediumDate');
    var datepicker = {
		templateType: 'popup',
    	from: new Date(1916, 1, 1),
        to: new Date(2020, 12, 31),
        callback: function (val) {  //Mandatory
            select_date_value.setTime(val);
            $scope.select_data_show = $filter('date')(select_date_value, 'mediumDate');
            $scope.userObject.birthday=val;

        },
    };
    $scope.pick_date = function () {
        datepicker.inputDate = select_date_value;
        ionicDatePicker.openDatePicker(datepicker);
    };
	/*****************************************************
         * 显示省份控件
         * ***************************************************/
    $scope.vm={};
	$scope.vm.cb = function () {
		$scope.userObject.province = $scope.vm.CityPickData.areaData.join("-");
		console.log("$scope.userObject.province",$scope.userObject.province);
	};
    function initProvince(arr){
		$scope.vm.CityPickData = {
	    	areaData: (arr.length==0?['请选择城市']:arr),
	    	title: '',
	    	buttonClicked: function () {
	      		 $scope.vm.cb();
	    	},
	   		hardwareBackButtonClose: false
		};
    }
    initProvince([]);
	/*****************************************************
         *头像上传
         * ***************************************************/
    $scope.chooseImage = function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                images.localId = res.localIds;
                $scope.$apply(function(){
                	$scope.userObject.headUrl=res.localIds[0];
                });
                $scope.uploadImage();
            }
        });
    };
    $scope.uploadImage = function () {
        if (images.localId.length == 0) {
            alert('请先选择图片');
            return;
        }
        var i = 0;
        images.serverId = [];
        wx.uploadImage({
            localId: images.localId[i],
            success: function (res) {
                images.serverId = new Array();
                // alert(res.serverId);
                images.serverId.push(res.serverId);
            },
            fail: function () {
                alert("头像上传失败，请检查网络！");
            }
        });


    };
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
	return customer_info;
}]);

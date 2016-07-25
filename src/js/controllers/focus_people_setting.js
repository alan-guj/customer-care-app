app.controller('focus_people_ctrl',[
	'$scope','$ionicSideMenuDelegate','CustomerOwner','current_user','select_enpuser',
	function($scope,$ionicSideMenuDelegate,CustomerOwner,current_user,select_enpuser){
	$scope.originalUser  = [];$scope.mainRespon = {};$scope.selecBool = false;
	$scope.star = [0,1,2,3,4];$scope.isFMain = false;var globalObj = {};
	$scope.$on('focus_people_setting', function(event,obj) {
		globalObj = {};
		globalObj =obj;
		$scope.originalUser  = [];
		$scope.isFManager = (current_user.enpinfo.hasOwnProperty("isManager")?current_user.enpinfo.isManager:false);
		// $scope.normal_respon = new Array();
		// $scope.originalUser = new Array();
		// $scope.mainRespon ={id:-1,name:'--',star:0};
		$scope.currentIndexo = obj.currentindex;
		$scope.currentCustomerID = obj.customerId;
		// $scope.currentGroupID = obj.groupId;
		init([],!isRmove);
		CustomerOwner.get({customer_id:$scope.currentCustomerID},function(data){
			console.log("=====data.owners",data.owners);
			for(var x=0;x<data.owners.length;x++){
				if(data.owners[x].primaryOwner){
					$scope.mainRespon.id=data.owners[x].userId;
					$scope.mainRespon.name=data.owners[x].visitorInfo.name;
					$scope.mainRespon.star=data.owners[x].star;
					if(data.owners[x].userId == current_user.data.id){
						isFMain = true;
					}else{
						isFMain = false;
					}
				}else{
					$scope.originalUser.push({id:data.owners[x].userId,name:data.owners[x].visitorInfo.name,star:data.owners[x].star});
				}
			}
		});
	});

	function init(paramArr,bools){
		select_enpuser.init(bools,globalObj.groupId,$scope.selecBool,paramArr,function(data,type){
			console.log("00000000000data=====",data,type);
			var isUserExist = false;var innerStar = 0;
			for(var x=0;x<$scope.originalUser.length;x++){
				if($scope.originalUser[x].id==data.id){
					isUserExist = true;
					innerStar = $scope.originalUser[x].star;
					console.log("=====$scope.originalUser[x].star",$scope.originalUser[x].star);
					break;
				}
			}
			if($scope.mainRespon.id && $scope.mainRespon.id==data.id){isUserExist = true;innerStar = $scope.mainRespon.star;}
			if(type=="add"){
				if($scope.selecBool){//duoxuan
					if(isUserExist){
						CustomerOwner.update({customer_id:$scope.currentCustomerID,user_id:data.id},
							{
							 "primaryOwner":false,
							 "star":innerStar
							},
							function(data){
								console.log("=====update0",data);
								if($scope.mainRespon.id || $scope.mainRespon.id==data.owner.visitorInfo.id){
									$scope.mainRespon = {}
								}
								$scope.originalUser.push({id:data.owner.visitorInfo.id,name:data.owner.visitorInfo.name,star:data.owner.star});
							});
					}else{
						CustomerOwner.save({customer_id:$scope.currentCustomerID},
							{"customerId":$scope.currentCustomerID,"userId":data.id,"primaryOwner":false
							},
							function(data){console.log("=====多选添加",data);
							if($scope.mainRespon.id==data.owner.userId){
								$scope.mainRespon = {}
							}
							$scope.originalUser.push({id:data.owner.userId,name:data.owner.visitorInfo.name,star:data.owner.star});
						});
					}
					
				}else{//danxuan
					if($scope.mainRespon.id){
						CustomerOwner.delete({customer_id:$scope.currentCustomerID,user_id:$scope.mainRespon.id},
						function(datas){
							if(isUserExist){
								CustomerOwner.update({customer_id:$scope.currentCustomerID,user_id:data.id},
								{
								 "primaryOwner":true,
								 "star":innerStar
								},
								function(data){
									console.log("=====update1",data);
									for(var x=0;x<$scope.originalUser.length;x++){
										if($scope.originalUser[x].id==data.owner.visitorInfo.id){
											$scope.originalUser.splice(x,1);
											break;
										}
									}
									$scope.mainRespon.id=data.owner.visitorInfo.id;
									$scope.mainRespon.name=data.owner.visitorInfo.name;
									$scope.mainRespon.star=data.owner.star;
								});
							}else{
								CustomerOwner.save({customer_id:$scope.currentCustomerID},
								{"customerId":$scope.currentCustomerID,"userId":data.id,"primaryOwner":true
								},
									function(data){
										console.log("=====单选添加1",data);
										$scope.mainRespon.id=data.owner.userId;
										$scope.mainRespon.name=data.owner.visitorInfo.name;
										$scope.mainRespon.star=data.owner.star;
										for(var k=0;k<$scope.originalUser.length;k++){
											if($scope.originalUser[k]==data.owner.userId){
												$scope.originalUser.splice(k,1);
												break;
											}
										}
								});
							}
							
						});
					}else{
						if(isUserExist){
							CustomerOwner.update({customer_id:$scope.currentCustomerID,user_id:data.id},
							{
							 "primaryOwner":true,
							 "star":innerStar
							},
							function(data){
								console.log("=====update2",data);
								for(var x=0;x<$scope.originalUser.length;x++){
									if($scope.originalUser[x].id==data.owner.visitorInfo.id){
										$scope.originalUser.splice(x,1);
										break;
									}
								}
								$scope.mainRespon.id=data.owner.visitorInfo.id;
								$scope.mainRespon.name=data.owner.visitorInfo.name;
								$scope.mainRespon.star=data.owner.star;
							});
						}else{
								CustomerOwner.save({customer_id:$scope.currentCustomerID},
								{"customerId":$scope.currentCustomerID,"userId":data.id,"primaryOwner":true
								},
								function(data){
									console.log("=====单选添加2",data);
									$scope.mainRespon.id=data.owner.userId;
									$scope.mainRespon.name=data.owner.visitorInfo.name;
									$scope.mainRespon.star=data.owner.star;
								    for(var k=0;k<$scope.originalUser.length;k++){
										if($scope.originalUser[k]==data.owner.userId){
											$scope.originalUser.splice(k,1);
											break;
										}
									}
							});
						}
					}
				}
			}else{
				CustomerOwner.delete({customer_id:$scope.currentCustomerID,user_id:data.id},
				function(datas){
					for(var x=0;x<$scope.originalUser.length;x++){
						if($scope.originalUser[x].id==data.id){
							$scope.originalUser.splice(x,1);
						}
					}
				});
			}
		});
		
	}
	var isRmove = false;
	$scope.close_p_panel = function(){
		$scope.$emit('focus_people_setting_confirm',$scope.currentIndexo,$scope.currentCustomerID );
		isRmove = true;
		select_enpuser.destory();
		$scope.focusPeopleSettingModal.hide();
	};
	$scope.rowClickFun = function(bool){
		if(bool){//duoxuan
			if(!($scope.isFMain || $scope.isFManager)){
				return false;
			}
		}else{//danxuan
			if(!$scope.isFManager){
				return false;
			}
		}
		$scope.selecBool = bool;
		select_enpuser.multiSelect(bool);
		var arr = new Array();
		if($scope.mainRespon.id){
			arr.push($scope.mainRespon);
		}
		select_enpuser.setSelect(bool?$scope.originalUser:arr);
		if(isRmove){
			select_enpuser.createModal();
			isRmove = false;
		}else{
			select_enpuser.show();
		}
		
		
	}











}])
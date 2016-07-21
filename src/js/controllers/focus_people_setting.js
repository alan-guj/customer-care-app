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












	// $scope.starIndex = 0;

	// $scope.normal_respon = [];
	// $scope.candidate_respon = [];
	// $scope.globalPersion = [];
	// $scope.mainRespon ={id:-1,name:'--',star:0};
	// $scope.checkType = {'singleBool':false};
	// $scope.defaultStar = 3;
	// $scope.isFManager = false;
	// $scope.isFLeader = false;
	// // $scope.responStarClick = function(bool,id,e){
	// // 	if(id!=current_user.data.id){return false;}
	// // 	var cIndex = 0;
	// // 	for(var x=0;x<$scope.normal_respon.length;x++){
	// // 		if(id==$scope.normal_respon[x].id){
	// // 			cIndex = x;break;
	// // 		}
	// // 	}
	// // 	if(bool){
	// // 		$scope.mainRespon.star = $(e.currentTarget).index()+1;
	// // 	}
	// // 	$scope.normal_respon[cIndex].star = $(e.currentTarget).index()+1;
	// // 	if($(e.currentTarget).hasClass("active")){
	// // 		$scope.normal_respon[cIndex].star--;
	// // 		if(bool){
	// // 			$scope.mainRespon.star--;
	// // 		}
	// // 	}
	// // }

	// $scope.pInputClick = function(id,e){
	// 	for(var x=0;x<$scope.normal_respon.length;x++){
	// 		if($scope.checkType.singleBool){//主
	// 			for(var k=0;k<$scope.normal_respon.length;k++){
	// 				if($scope.normal_respon[k].responsible==2){
	// 					$scope.normal_respon[k].responsible=0;
	// 					break;
	// 				}
	// 			}
	// 			if($scope.normal_respon[x].id==id){
	// 				$scope.normal_respon[x].responsible=2;
	// 				$scope.mainRespon = new Object();
	// 				$scope.mainRespon.id= $scope.normal_respon[x].id;
	// 				$scope.mainRespon.star = $scope.normal_respon[x].star;
	// 	 			$scope.mainRespon.name= $scope.normal_respon[x].name;
	// 				break;
	// 			}
	// 		}else{
	// 			if($scope.normal_respon[x].id==id){
	// 				if(e.currentTarget.checked){
	// 					if($scope.normal_respon[x].responsible==2){
	// 						$scope.mainRespon = new Object();
	// 						$scope.mainRespon.id= -1;
	// 	 					$scope.mainRespon.name= '--';
	// 	 					$scope.mainRespon.star = 0;
	// 					}
	// 					$scope.normal_respon[x].responsible=1;
	// 				}else{
	// 					$scope.normal_respon[x].responsible=0;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	// // $scope.inputNameChange = function(val){
	// // 	var tmp = [];
	// // 	for(var x=0;x<$scope.globalPersion.length;x++){
	// // 		if(($scope.globalPersion[x].name).indexOf(val)>-1){
	// // 			tmp.push($scope.globalPersion[x]);
	// // 		}
	// // 	}
	// // 	$scope.candidate_respon = tmp;
	// // }
	// $scope.close_p_panel = function(){
	// 	// console.log("=====current_user",current_user);
	// 	// console.log($scope.normal_respon);
	// 	// console.log($scope.originalUser);
	// 	var orArr = $scope.originalUser;
	// 	var tmArr = $scope.normal_respon;
	// 	var addArr = [];var delArr = [];var updArr = [];
	// 	var sendOwners = [];
	// 	for(var x=0;x<tmArr.length;x++){//最终的
	// 		if(tmArr[x].responsible==0){continue;}
	// 		sendOwners.push({
	// 			 "customerId": $scope.currentCustomerID,
 //            	 "userId": tmArr[x].id,
 //            	 "star": tmArr[x].star,
 //            	 "primaryOwner": (tmArr[x].responsible==1?false:true)
	// 		});
	// 		var isExist = false;
	// 		for(var y=0;y<orArr.length;y++){//最初的
	// 			if(tmArr[x].id==orArr[y].userId){
	// 				isExist = true;
	// 				if(tmArr[x].star!=orArr[y].star || (tmArr[x].responsible==1?false:true)!=orArr[y].primaryOwner){
	// 					orArr[y].primaryOwner = (tmArr[x].responsible==1?false:true);
	// 					orArr[y].star = tmArr[x].star;
	// 					updArr.push(orArr[y]);
	// 				}
	// 				orArr.splice(y,1);
	// 				break;
	// 			}
				
	// 		}
	// 		if(!isExist){
	// 			addArr.push(tmArr[x]);
	// 		}
	// 	}
	// 	delArr = orArr;
	// 	var pID = null;
	// 	for(var n=0;n<delArr.length;n++){
	// 		if(delArr[n].primaryOwner){
	// 			pID = delArr[n].userId;
	// 			delArr.splice(n,1);
	// 		}
	// 	}
	// 	if(pID!=null){
	// 		CustomerOwner.delete({customer_id:$scope.currentCustomerID,user_id:pID},function(data){
	// 						//删除-----
	// 				for(var o=0;o<delArr.length;o++){
	// 					CustomerOwner.delete({customer_id:$scope.currentCustomerID,user_id:delArr[o].userId},function(data){
	// 						// console.log("=====delete>>>>",data);
	// 					});
	// 				}
	// 				//增加-----
	// 				for(var v=0;v<addArr.length;v++){//id:addArr[v].id
	// 					CustomerOwner.save({customer_id:$scope.currentCustomerID},
	// 						{"customerId":$scope.currentCustomerID,
	// 						 "userId":addArr[v].id,
	// 						 "primaryOwner":(addArr[v].responsible==1?false:true),
	// 						 "star":addArr[v].star
	// 						},
	// 						function(data){
	// 							// console.log("=====addcuntomer",data);
	// 					});
	// 				}
	// 				//更新
	// 				for(var a=0;a<updArr.length;a++){
	// 					CustomerOwner.update({customer_id:$scope.currentCustomerID,user_id:updArr[a].userId},
	// 						{
	// 						 "primaryOwner":updArr[a].primaryOwner,
	// 						 "star":updArr[a].star
	// 						},
	// 						function(data){
	// 							// console.log("=====update",data);
	// 					});
	// 				}
	// 		});
	// 	}else{
	// 		//删除-----
	// 		for(var o=0;o<delArr.length;o++){
	// 			CustomerOwner.delete({customer_id:$scope.currentCustomerID,user_id:delArr[o].userId},function(data){
	// 				// console.log("=====delete>>>>",data);
	// 			});
	// 		}
	// 		//增加-----
	// 		for(var v=0;v<addArr.length;v++){//id:addArr[v].id
	// 			CustomerOwner.save({customer_id:$scope.currentCustomerID},
	// 				{"customerId":$scope.currentCustomerID,
	// 				 "userId":addArr[v].id,
	// 				 "primaryOwner":(addArr[v].responsible==1?false:true),
	// 				 "star":addArr[v].star
	// 				},
	// 				function(data){
	// 					// console.log("=====addcuntomer",data);
	// 			});
	// 		}
	// 		//更新
	// 		for(var a=0;a<updArr.length;a++){
	// 			CustomerOwner.update({customer_id:$scope.currentCustomerID,user_id:updArr[a].userId},
	// 				{
	// 				 "primaryOwner":updArr[a].primaryOwner,
	// 				 "star":updArr[a].star
	// 				},
	// 				function(data){
	// 					// console.log("=====update",data);
	// 			});
	// 		}
	// 	}
	// 	$scope.$emit('focus_people_setting_confirm',$scope.currentIndexo,$scope.currentCustomerID ,sendOwners);
	// 	$scope.focusPeopleSettingModal.hide();
	// }
	// $scope.originalUser = [];$scope.currentCustomerID =-1;
	// $scope.currentGroupID = -1;$scope.currentIndexo = -1;
	

	// /**
	// * 显示边侧栏
	// */
	// $scope.showPeopleList = function(bool,e,isMain){
	// 	if(isMain){
	// 		if(!$scope.isFManager){
	// 			return false;
	// 		}
	// 	}else{
	// 		if(!($scope.isFManager || $scope.isFLeader)){
	// 			return false;
	// 		}
	// 	}
	// 	 e.stopPropagation();
	// 	 $scope.checkType.singleBool = bool;
	// 	 // $scope.candidate_respon = new Array();
	// 	 // $scope.candidate_respon = [];
	// 	 var tmpArr = [];
	// 	 for(var x=0;x<$scope.normal_respon.length;x++){
	// 	 	if(bool){
	// 	 		if($scope.normal_respon[x].responsible==2){
	// 	 			$scope.candidate_respon.push($scope.normal_respon[x]);
	// 	 		}else{
	// 	 			tmpArr.push($scope.normal_respon[x]);
	// 	 		}
	// 	 	}else{
	// 	 		if($scope.normal_respon[x].responsible==1){
	// 	 			$scope.candidate_respon.push($scope.normal_respon[x]);
	// 	 		}else{
	// 	 			tmpArr.push($scope.normal_respon[x]);
	// 	 		}
	// 	 	}
	// 	 }
	// 	 $scope.candidate_respon = $scope.candidate_respon.concat(tmpArr);  
	// 	 $scope.globalPersion =  $scope.candidate_respon;
	// }
}])
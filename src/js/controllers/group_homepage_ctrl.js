app.controller('group_homepage_ctrl',['$window','$scope','$state','$ionicModal','PersonalGroup','current_user',
	function( $window,$scope,$state,$ionicModal,PersonalGroup,current_user ){
	var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var goldImg = {0:"img/first.png",1:"img/second.png",2:"img/third.png"};
	var piename = {
		unfinished:{name:"未处理",color:"#e42112"},
		over:{name:"已拜访",color:"#28a54c"},
		cancle:{name:"已取消",color:"#e6b500"},
		lazy:{name:"已延期",color:"#b2b2b2"}
	};
	$scope.isManagerView = false;
	$scope.topNNumner = 10;
	$scope.hasData = true;
	$scope.piedata = {pie1data:[],pie0data:""};
	$scope.weekdata={xAxis:[],data:[]};
	$scope.topndata={data:[]};
	$scope.todayArr = [];$scope.topN ={topNArray: []};
	$scope.selfdata = {};
	var DEFAULT_PHOTO="img/man.jpg";
	if(current_user.hasOwnProperty("enpinfo") && current_user.enpinfo &&  current_user.enpinfo.hasOwnProperty("isManager")){
		$scope.isManagerView = current_user.enpinfo.isManager;
	}
	PersonalGroup.get({group_id:current_user.data.enterprise_id},function(param){
		createResult(param);
	});
	$scope.gotoPersonalView = function(){
		$window.localStorage["global_visit_panel"] = "personal";
		$window.localStorage["global_visit_num"]=0;
		$state.go('personal_homepage');
	}
	function createResult(data){
		var myDate = new Date(data.time);
		$scope.titleTime = myDate.Format("yyyy年MM月dd日")+" "+weekDay[myDate.getDay()];
		$scope.piedata.pie1data = [];var doneArr = [];var totalNum = 0;
		var isAllZero =true;
		for(var o in data.yesterday){
			if(data.yesterday[o]!=0){
				isAllZero = false;
			}
		}
		for(var o in data.yesterday){
			if(data.yesterday[o]==0 && !isAllZero){continue;}
			if(o=="over"){
				doneArr.push({value:data.yesterday[o], name:(piename[o].name+"\n("+data.yesterday[o]+"人次)"),itemStyle :{normal:{color:piename[o].color}}});
			}else{
				$scope.piedata.pie1data.push(
					 {value:data.yesterday[o], name:(piename[o].name+"\n("+data.yesterday[o]+"人次)"),itemStyle :{normal:{color:piename[o].color}}}
				);
			}
			totalNum+=data.yesterday[o];
		}
		$scope.piedata.pie1data = doneArr.concat($scope.piedata.pie1data);
		var tmpNumber = 0;
		if($scope.piedata.pie1data.length>0){
			tmpNumber = $scope.piedata.pie1data[0].value;
		}
		$scope.piedata.pie0data = (totalNum==0?'0%':(Math.round(tmpNumber*100/totalNum)+"%"));
		if(data.ranking.hasOwnProperty("grouyRank") && data.ranking.grouyRank.length>0){
			$scope.hasData = true;
			var tmpTopArr = [];$scope.topNNumner = 0;
			for(var x = 0;x<data.ranking.grouyRank.length;x++){
				var obj = {};$scope.topNNumner++;
				obj.id=data.ranking.grouyRank[x].user.id;
				obj.img = (x>2?goldImg[2]:goldImg[x]);
				obj.name=data.ranking.grouyRank[x].user.name;
				obj.customers=data.ranking.grouyRank[x].number;
				if(data.ranking.grouyRank[x].user.hasOwnProperty("portrait_uri")){
					obj.photo = data.ranking.grouyRank[x].user.portrait_uri;
				}else{
					obj.photo = DEFAULT_PHOTO;
				}
				$scope.topN.topNArray.push(obj);
				tmpTopArr.push(data.ranking.grouyRank[x].number);
			}
			for(var x=tmpTopArr.length-1;x>=0;x--){
				$scope.topndata.data.push(tmpTopArr[x]);
			}
		}
		for(var x=data.week.date.length-1;x>=0;x--){
			var tmpDate = new Date(data.week.date[x]);
			$scope.weekdata.xAxis.push((tmpDate.getMonth()+1)+"."+tmpDate.getDate());
			if(data.week.hasOwnProperty("data")){
				var num = 0;
				for(var y=0;y<data.week.data.length;y++){
					if(data.week.data[y].time==data.week.date[x]){
						num = data.week.data[y].number;
						break;
					}
				}
				if(x==0){
					$scope.weekdata.data.push({value:num,itemStyle :{normal:{color:"#28a54c"}}});
				}else{
					$scope.weekdata.data.push(num);
				}
			}else{
				$scope.weekdata.data.push(0);
			}
		}
	}
}]);

app.controller('personal_homepage_ctrl',['$window','$scope','$state','$ionicModal','Personal','current_user',
	function( $window,$scope,$state, $ionicModal,Personal,current_user ){
	var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var goldImg = {0:"img/first.png",1:"img/second.png",2:"img/third.png"};
	var piename = {
		unfinished:{name:"未处理",color:"#e42112"},
		over:{name:"已拜访",color:"#28a54c"},
		cancle:{name:"已取消",color:"#e6b500"},
		lazy:{name:"已延期",color:"#b2b2b2"}
	};
	// $scope.isManagerView = false;
	$scope.topNNumner = 3;
	$scope.piedata = {pie1data:[],pie0data:""};
	$scope.weekdata={xAxis:[],data:[]};
	$scope.topndata={data:[]};
	$scope.todayArr = [];$scope.topN ={topNArray: []};
	$scope.selfdata = {};$scope.finishNum = 0;$scope.medal={
        "bronze": 0,
        "gold": 0,
        "silver": 0
    };
	var DEFAULT_PHOTO="img/man.jpg";
	// if(current_user.hasOwnProperty("enpinfo") && current_user.enpinfo && current_user.enpinfo.hasOwnProperty("isManager")){
	// 	$scope.isManagerView = current_user.enpinfo.isManager;
	// }
	Personal.get({user_id:current_user.data.id},function(param){
		createResult(param);
	});
	$scope.gotoGroupView = function(){
		$window.localStorage["global_visit_panel"] = "group";
		$window.localStorage["global_visit_num"]=0;
		$state.go('group_homepage');
	}
	function createResult(data){
		$scope.medal = data.medal;
		// console.log("data.finishNum",data.finishNum);
		$scope.finishNum = (data.finishNum==null?0:data.finishNum);
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
		if(data.ranking.hasOwnProperty("my") && data.ranking.my){
			data.ranking.my.rank = "第"+data.ranking.my.rank;
			$scope.selfdata = data.ranking.my;
			$scope.topndata.data.push(data.ranking.my.number);
		}else{
			$scope.selfdata = {rank:"无排",number:0};
			$scope.topndata.data.push(0);
		}
		$scope.piedata.pie0data = (totalNum==0?'0%':(Math.round(tmpNumber*100/totalNum)+"%"));
		if(data.ranking.hasOwnProperty("grouyRank")){
				var tmpTopArr = [];
				for(var x = 0;x<data.ranking.grouyRank.length;x++){
					var obj = {};
					obj.id=data.ranking.grouyRank[x].user.id;
					obj.img = goldImg[data.ranking.grouyRank[x].rank-1];
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
				if(data.ranking.grouyRank.length<$scope.topNNumner){
					var  num = $scope.topNNumner-data.ranking.grouyRank.length;
					for(var x=0;x<num;x++){
						$scope.topN.topNArray.push({
						img:goldImg[data.ranking.grouyRank.length+x],photo:DEFAULT_PHOTO,
						name:"--",
						customers:0
						});
						tmpTopArr.push(0);
					}
				}
				// for(var x=tmpTopArr.length-1;x>=0;x--){
				// 	$scope.topndata.data.push(tmpTopArr[x]);
				// }
				for(var x=0;x<tmpTopArr.length;x++){
					$scope.topndata.data.push(tmpTopArr[x]);
				}
		}else{
			$scope.topndata.data.push(0);
			for(var x=0;x<$scope.topNNumner;x++){
				$scope.topN.topNArray.push({
				img:goldImg[data.ranking.grouyRank.length+x],photo:DEFAULT_PHOTO,
				name:"--",customers:0});
			}
		}
		// if(data.ranking.hasOwnProperty("my") && data.ranking.my){
		// 	data.ranking.my.rank = "第"+data.ranking.my.rank;
		// 	$scope.selfdata = data.ranking.my;
		// 	$scope.topndata.data.push(data.ranking.my.number);
		// }else{
		// 	$scope.selfdata = {rank:"无排",number:0};
		// 	$scope.topndata.data.push(0);
		// }
		// console.log("$scope.topndata.data",$scope.topndata.data);
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
		if(data.hasOwnProperty("today")){
			$scope.todayArr =data.today;
		}else{
			$scope.todayArr =[];
		}
		$scope.topNNumner++;
		// setTimeout(createImg,1000);
		createImg();
	}
	var newImg = null;
	$scope.shareImgFunction = function(){
		
        // var evObj = document.createEvent('MouseEvents');
        // evObj.initMouseEvent( 'click', false, false);
        // document.getElementById("asdasd").dispatchEvent(evObj);
         
         var evt = document.createEvent( 'HTMLEvents' );
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent("hold", false, false);
        newImg.dispatchEvent(evt);

	}
	function createImg(){
		html2canvas($("#personalPanel"), 
			{
				allowTaint : false,
    			taintTest : false,
    			height:(document.getElementsByClassName("scroll"))[0].clientHeight+50,
	            onrendered: function(canvas) {
	            	 var dataUrl = canvas.toDataURL();
	            	 // console.log("dataUrldataUrldataUrl",dataUrl);
	                // document.body.appendChild(canvas);
			        newImg = document.createElement("img");
			        newImg.src =  dataUrl;
			    }
	        });
	}
}]);


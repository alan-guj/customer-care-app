app.controller('personal_homepage_ctrl',['$scope','$ionicModal','Personal','current_user',
	function( $scope,  $ionicModal,Personal,current_user ){
	// $state.go('schedule_list');
	var timeStr="2016-02-23T12:23:23.000Z";
	var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var goldImg = {0:"img/first.png",1:"img/second.png",2:"img/third.png"};
	var piename = {
		unfinished:{name:"未处理",color:"#e42112"},
		over:{name:"已拜访",color:"#28a54c"},
		cancle:{name:"已取消",color:"#e6b500"},
		lazy:{name:"已延期",color:"#b2b2b2"}
	};
	$scope.piedata = {pie1data:[],pie0data:""};
	$scope.weekdata={xAxis:[],data:[]};
	$scope.yestardaydata={yAxis:[],data:[]};
	$scope.todayArr = [];$scope.top3 ={top3Array: []};
	$scope.selfdata = {};
	var DEFAULT_PHOTO="img/man.jpg";
	Personal.get({user_id:current_user.data.id},function(data){
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
				doneArr.push({value:data.yesterday[o], name:piename[o].name,itemStyle :{normal:{color:piename[o].color}}});
			}else{
				$scope.piedata.pie1data.push(
					 {value:data.yesterday[o], name:piename[o].name,itemStyle :{normal:{color:piename[o].color}}}
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
		if(data.ranking.hasOwnProperty("grouyRank")){
				var tmpTopArr = [];var photoArr = [];var medialists = [];
				for(var x = 0;x<data.ranking.grouyRank.length;x++){
					var obj = {};
					obj.id=data.ranking.grouyRank[x].user.id;
					obj.img = goldImg[x];
					obj.name=data.ranking.grouyRank[x].user.name;
					obj.customers=data.ranking.grouyRank[x].number;
					if(data.ranking.grouyRank[x].user.hasOwnProperty("portrait_uri")){
						obj.photo = data.ranking.grouyRank[x].user.portrait_uri;
					}else{
						obj.photo = DEFAULT_PHOTO;
					}

					$scope.top3.top3Array.push(obj);
					tmpTopArr.push(data.ranking.grouyRank[x].number);
				}
				if(data.ranking.grouyRank.length<3){
					var  num = 3-data.ranking.grouyRank.length;
					for(var x=0;x<num;x++){
						$scope.top3.top3Array.push({
						img:goldImg[data.ranking.grouyRank.length+x],photo:DEFAULT_PHOTO,
						name:"--",
						customers:0
						});
						tmpTopArr.push(0);
					}
				}
				for(var x=tmpTopArr.length-1;x>=0;x--){
					$scope.yestardaydata.data.push(tmpTopArr[x]);
				}
		}else{
			$scope.yestardaydata.data.push(0);
			for(var x=0;x<3;x++){
				$scope.top3.top3Array.push({
				img:goldImg[data.ranking.grouyRank.length+x],photo:DEFAULT_PHOTO,
				name:"--",customers:0});
			}
		}
		if(data.ranking.hasOwnProperty("my") && data.ranking.my){
			data.ranking.my.rank = "第"+data.ranking.my.rank;
			$scope.selfdata = data.ranking.my;
			$scope.yestardaydata.data.push(data.ranking.my.number);
		}else{
			$scope.selfdata = {rank:"无排",number:0};
			$scope.yestardaydata.data.push(0);
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
		if(data.hasOwnProperty("today")){
			$scope.todayArr =data.today;
		}else{
			$scope.todayArr =[];
		}

	});
}]);




app.directive('top3bar', function() {
return {
        restrict: 'E',
        template: '<div id="top3bar" style="height:192px;width:100%"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
			var option = {
				color: ['#28a54c'],
			    tooltip : {
			    	show:false,
			        trigger: 'axis',
			        axisPointer : {
			            type : 'shadow'
			        }
			    },
			    grid: {
			        left: '0',
			        right: '0',
			        top: '0',
			        bottom:'0',
			        containLabel: false
			    },
			    calculable : true,
			    xAxis : [
			        {
			        	show:false,
			            type : 'value',
			            splitLine:{
			            	show:false
			            }
			        }
			    ],
			    yAxis : [
			        {
			        	show:false,
			            type : 'category',
			            splitLine:{
			            	show:false
			            },
			            data :[]//['馒头','大饼','饺子','您']
			        }
			    ],
			    series : [
			        {
			            name:'',
			            type:'bar',
			            barWidth :20,
			            data:[]//[9, 15, 20, 5]//组装数据得是反的
			        }
			    ]
			};
            var barChart = echarts.init(document.getElementById("top3bar"),'macarons');
            barChart.setOption(option);
            // barChart.dispatchAction({type: 'showTip', seriesIndex: 0,dataIndex:6});
            scope.$watch('yestardaydata', function(newValue,oldValue, scope) {
					option.series[0].data =newValue.data;
					barChart.setOption(option,false,true);
            },true);
        }
    };
});



app.directive('personalbar', function() {
return {
        restrict: 'E',
        template: '<div id="commonBar" style="height:150px;width:100%"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
			var option = {
			    color: ['#3398DB'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {
			            type : 'shadow'
			        }
			    },
			    grid: {
			        left: '4%',
			        right: '4%',
			        top: '5%',
			        bottom:'1%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : [],
			            axisTick: {
			                alignWithLabel: true
			            },
			            axisLine:{
			            	lineStyle:{
			            		color:'#FFF',
			            	}
			            }

			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            splitNumber:4,
			            splitLine:{
			            	show:false
			            },
			            axisLine:{
			            	lineStyle:{
			            		color:'#FFF',
			            	}
			            }
			        }
			    ],
			    series : [
			        {
			            name:'拜访人数',
			            type:'bar',
			            barWidth: '60%',
			            data:[]
			        }
			    ]
			};
			var currentIndexNum = 0;
            var barChart = echarts.init(document.getElementById("commonBar"),'macarons');
            barChart.setOption(option);
            // barChart.dispatchAction({type: 'showTip', seriesIndex: 0,dataIndex:6});
            scope.$watch('weekdata', function(newValue,oldValue, scope) {
                	option.xAxis[0].data = newValue.xAxis;
					option.series[0].data =newValue.data;
					barChart.setOption(option,false,true);
            },true);
        }
    };






});
app.directive('personalpie', function() {
    return {
        restrict: 'E',
        template: '<div id="nestPie" style="height:150px;width:100%"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
        		var option = {
				series: [
				    	{
				    		type:'pie',
				    		silent :true,
				    		radius: [0, '40%'],
				    		labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				        	itemStyle :{
				            	normal:{
				            		  color:"#444444"
				            	}
				            },
				            label: {
				                normal: {
				                    position: 'center',
				                    textStyle :{
				                    	color:"#28a54c",
				                    	fontSize:20,
				                    	fontWeight:'bold'
				                    }
				                }
				            },
				    		data:[
				                {value:1, name:"", selected:false}
				            ]

				    	},
				        {
				            name:'访问来源',
				            type:'pie',
				            radius: ['40%', '58%'],
				            avoidLabelOverlap: true,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'outside'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                        // fontSize: '20',
				                        // fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: true,
				                    // length:20
				                }
				            },
				            data:[]
				        }
				    ]
				};
				var currentIndexNum = 0;
		        var pieChart = echarts.init(document.getElementById("nestPie"),'macarons');
		        pieChart.setOption(option);
		        pieChart.on('click', function (params) {
					option.series[0].label.normal.textStyle.color = params.color;
					pieChart.dispatchAction({type: 'downplay',seriesIndex: 1,dataIndex: currentIndexNum});
					currentIndexNum = params.dataIndex;
					(((option.series[0]).data)[0]).name=Math.round(params.percent)+"%";
					pieChart.setOption(option,false,true);
					pieChart.dispatchAction({type: 'highlight', seriesIndex: 1,dataIndex: currentIndexNum});
				});
		        scope.$watch('piedata', function(newValue,oldValue, scope) {
		        	var color = "";
		        	if(newValue.pie1data.length>0){
		        		var arr = newValue.pie1data;
			        	var iszero = true;
			        	for(var k=0;k<arr.length;k++){
			        		if(arr[k].value!=0){
			        			iszero = false;
			        			color = arr[k].itemStyle.normal.color;
			        			break;
			        		}
			        	}
			        	if(iszero){color = arr[0].itemStyle.normal.color;}
		        	}
		        	option.series[0].label.normal.textStyle.color = color;
                	option.series[0].data[0].name = newValue.pie0data;
					option.series[1].data =newValue.pie1data;
					pieChart.setOption(option,false,true);
					pieChart.dispatchAction({type: 'highlight', seriesIndex: 1,dataIndex:currentIndexNum});
            	},true);

        }
    };
});



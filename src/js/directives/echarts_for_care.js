app.directive('topnbar', function() {
return {  
        restrict: 'E',  
		template: '<div style="{{attrs.style}}"></div>',
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

            // barChart.dispatchAction({type: 'showTip', seriesIndex: 0,dataIndex:6});
            scope.$watch('topndata', function(newValue,oldValue, scope) {
            	element[0].style.height=scope.topNNumner*48+'px';
				var barChart = echarts.init(element[0],'macarons');  
				option.series[0].data =newValue.data;
				barChart.setOption(option,false,true);  
            },true);
        }  
    };
});  



app.directive('personalbar', function() {
return {  
        restrict: 'E',  
        template: '<div style="{{attrs.style}}"></div>',  
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
            scope.$watch('weekdata', function(newValue,oldValue, scope) {
        	    var barChart = echarts.init(element[0],'macarons');  
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
        template: '<div style="{{attrs.style}}"></div>',  
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
		        var pieChart = echarts.init(element[0],'macarons'); 
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

    
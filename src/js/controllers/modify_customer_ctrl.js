/**
 * Created by songsf on 2016/6/18.
 */
app.controller('modify_customer_ctrl', ['$scope', '$filter', '$ionicModal', 'ionicDatePicker', 'Customer', 'CustomerOwner', 'current_user',
    function ($scope, $filter, $ionicModal, ionicDatePicker, Customer, CustomerOwner, current_user) {
        /********************************************
         * 初始化所有数据
         ********************************************/
        $scope.hospitalCtrl={hospitalInput:""};
        $scope.selectCtrl={selected:""};
        initData();
        /**********************************************
         * 头像处理相关
         **********************************************/

       var images = {
            localId: [],
            serverId: []
        };

        $scope.chooseImage = function () {
            wx.chooseImage({
                count: 1,
                success: function (res) {
                    images.localId = res.localIds;
                    $scope.userInfo.cHeadPic=res.localIds[0];
                    $scope.$apply();
                    $scope.uploadImage();
                }
            });
        };
        $scope.uploadImage = function () {
            //alert("go into uploadImage")
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
                    images.serverId.push(res.serverId);
                },
                fail: function () {
                    alert("头像上传失败，请检查网络！");
                }
            });


        };
        /************************************************************
         * 初始化函数
         ***********************************************************/

        function initData() {
            $scope.userInfo = {
                userId: 0,
                phoneNum: "",
                address: "",
                name: "",
                stars: [30, 20, 15, 10, 5],
                isTeamLeader: true,
                birthDay: new Date(),
                cRole: "",
                cHeadPic: "img/man.jpg",
                cStar: 3,
                groupMember: [],
                hospitalArr: [],
                rel_customer: [],
                user_action: 0     //0标示新增用户操作,1表示修改用户详情操作
            };
            $scope.selectCtrl={selected:""};
            $scope.phoneNumCheck=false;
            $scope.hospitalCheck=false;
            $scope.showCareEye = false;
            $scope.eyeObj={"currentEyeType":""};
            images = {
                localId: [],
                serverId: []
            };
            $scope.hospitalCtrl.hospitalInput="";
        }

       $scope.showCareEye = false; $scope.isAddBool = true;
        $scope.$on('add_custom_show', function (event, customInfo) {
            select_date_value=new Date();
            $scope.select_data_show = $filter('date')(select_date_value, 'mediumDate');
            $scope.showCareEye = false;$scope.isAddBool = true;
            initData();
            $scope.userInfo.cHeadPic="img/man.jpg";

            console.log("初始化用户信息为",$scope.userInfo,images);
            $("#headImage").attr("src","img/man.jpg");
            Customer.get({}, {}, function (data) {
                for (var i = 0; i < data.customers.length; i++) {
                    var group_memeber = {id: data.customers[i].id, name: data.customers[i].name};
                    $scope.userInfo.groupMember.push(group_memeber);
                }
            })
        });
       /**************/
      $scope.judgeShowFocus = function(){
            return($scope.choiceCustomScopeStr == "" ? true : false);
      }
      function toggleFocus(){
          if($scope.eyeObj.currentEyeType !=''){
            CustomerOwner.save({customer_id:$scope.customerInfoOld.id},
                {"customerId":$scope.customerInfoOld.id,
                 "userId":current_user.data.id,
                 "primaryOwner":false,
                 "star":$scope.customerInfoOld.myCustomer.star
                },
                function(data){
                  console.log("=====addcuntomer",data);
                  $scope.customerInfoOld.myCustomer.type ='otherOwner';
            });
          }else{
                CustomerOwner.delete({customer_id:$scope.customerInfoOld.id,user_id:current_user.data.id},function(data){
                  console.log("=====delete>>>>",data);
                 $scope.customerInfoOld.myCustomer.type ='';
                });
          }

      }
      $scope.eyeObj={"currentEyeType":""};
      $scope.changeEyeFun = function(){
        if($scope.eyeObj.currentEyeType==""){
            $scope.eyeObj.currentEyeType = "otherOwner";
            $scope.userInfo.cStar = 3;
        }else{
             $scope.userInfo.cStar = 0;
             $scope.eyeObj.currentEyeType = "";
        }
      }
      $scope.choiceCustomScopeStr = "";
       /**************/
        $scope.$on('modify_custom_info', function (event, customInfo,choiceCustomScope) {
            $scope.choiceCustomScopeStr = choiceCustomScope;
            initData();
            $scope.userInfo.cHeadPic="img/man.jpg";
            $scope.isAddBool = false;
            $("#headImage").attr("src","img/man.jpg");
            if(choiceCustomScope!=""){
                $scope.showCareEye = false;
            }else{
                $scope.showCareEye =true;
            }
            $scope.userInfo.user_action = 1;
            $scope.customerInfoOld = customInfo;
            $scope.tempUserId = customInfo.id;
            $scope.eyeObj.currentEyeType = customInfo.myCustomer.type;
            $scope.userInfo.groupMember = [];
            Customer.get({}, {}, function (data) {


                for (var i = 0; i < data.customers.length; i++) {
                    var group_memeber = {id: data.customers[i].id, name: data.customers[i].name};
                    $scope.userInfo.groupMember.push(group_memeber);
                    for (var j = 0; j < $scope.userInfo.rel_customer.length; j++) {
                        if (group_memeber.id == $scope.userInfo.rel_customer[j].id) {
                            $scope.userInfo.groupMember.remove(group_memeber)

                            break;
                        }
                    }
                }

            });

            Customer.get({id: $scope.tempUserId}, {}, function (data) {

                console.log("收到的消息",data);
                var customerInfoGet = data.customer;
                $scope.userInfo.name = customerInfoGet.name;
                $scope.userInfo.id = 3;
                $scope.userInfo.phoneNum = customerInfoGet.mobile;
                $scope.userInfo.address = customerInfoGet.address;
                $scope.userInfo.birthDay = customerInfoGet.birthday;
                $scope.userInfo.cRole = customerInfoGet.type;
                $scope.userInfo.cHeadPic = customerInfoGet.headUrl;


                if(!customerInfoGet.hasOwnProperty("owners")){
                    $scope.userInfo.cStar = 0;
                }else{
                    var isFound = false;
                    for (var ii=0;ii <customerInfoGet.owners.length;ii++){
                        if (customerInfoGet.owners[ii].userId == current_user.data.id){
                            $scope.userInfo.cStar=customerInfoGet.owners[ii].star;
                            isFound = true;
                            break;
                        }

                    }
                    if(!isFound){
                        $scope.userInfo.cStar = 0;
                    }

                }

                try {
                    $scope.userInfo.hospitalArr = [];
                    if(customerInfoGet.hospitalList.length!=0){
                        $scope.userInfo.hospitalArr = customerInfoGet.hospitalList.split(",");
                    }

                } catch (e) {
                }
                $scope.select_date = new Date($scope.userInfo.birthDay);
                $scope.select_data_show = new Date($scope.userInfo.birthDay).Format("yyyy-MM-dd");

                $scope.userInfo.rel_customer = [];
                for (var i = 0; i < customerInfoGet.customers.length; i++) {
                    var rel_customer = {id: customerInfoGet.customers[i].id, name: customerInfoGet.customers[i].name};
                    $scope.userInfo.rel_customer.push(rel_customer);
                }
            })
        })

        /*****************************************************
         * 显示日期控件
         * ***************************************************/
        var select_date_value = new Date();
        $scope.select_data_show = $filter('date')(select_date_value, 'mediumDate');

        $scope.userInfo.birthDay=select_date_value;
        var datepicker = {
            callback: function (val) {  //Mandatory
                select_date_value.setTime(val);
                $scope.select_data_show = $filter('date')(select_date_value, 'mediumDate');
                $scope.userInfo.birthDay=val;

            },
        };

        $scope.pick_date = function () {
            datepicker.inputDate = select_date_value;
            ionicDatePicker.openDatePicker(datepicker);
        };

        /***
         * 日期格式化
         */
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        /**
         *星星点击事件
         */
        $scope.modifyStars = function (index, e) {
			if($scope.eyeObj.currentEyeType=="" && !$scope.isAddBool){return false;}
            $scope.userInfo.cStar = index + 1;
            if ($(e.currentTarget).hasClass("active")) {
                $scope.userInfo.cStar--;
            }
            //console.log("修改后的用户星星数为 = " + $scope.userInfo.cStar)
        };
        $scope.phoneNumCheck=false;
        $scope.hospitalCheck=false;
        /**
         *号码检查
         */
        var re = /^1[3|4|5|7|8]\d{9}$/;
        $scope.numCheck=function () {
            $scope.phoneNumCheck=!re.test($scope.userInfo.phoneNum);
        };

        /**
         *添加医院
         */
        var checkHospital=function (str) {
            for (var i=0;i<$scope.userInfo.hospitalArr.length;i++){
                if (str==$scope.userInfo.hospitalArr[i]){
                    return false;
                }else {
                    return true;
                }
            }
            return true;
        };

        $scope.hospitalCtrl={hospitalInput:""};


        $scope.addHospitalM = function () {

            $scope.hospitalCheck=!checkHospital($scope.hospitalCtrl.hospitalInput);
            if ($scope.hospitalCtrl.hospitalInput != 0 && checkHospital($scope.hospitalCtrl.hospitalInput)){

                $scope.userInfo.hospitalArr.push($scope.hospitalCtrl.hospitalInput);
                $scope.hospitalCtrl.hospitalInput="";

            }else {
                console.log("没有输入医院名字")
            }
        };
        /**
         *取消医院
         */
        $scope.cancelHospM = function (name) {//alert(id);
            for (var x = 0; x < $scope.userInfo.hospitalArr.length; x++) {
                if ($scope.userInfo.hospitalArr[x] == name) {
                    $scope.userInfo.hospitalArr.splice(x, 1);
                    break;
                }
            }

        };

        /**
         *添加成员
         */
        $scope.addCustomerM = function () {//alert(id);

            var obj = $scope.$eval($scope.selectCtrl.selected);
            if (obj != null) {
                $scope.userInfo.rel_customer.push(obj);
                $scope.userInfo.groupMember.remove(obj);
                for (var x = 0; x < $scope.userInfo.groupMember.length; x++) {
                    if ($scope.userInfo.groupMember[x].id == obj.id) {
                        $scope.userInfo.groupMember.splice(x, 1);
                        break;
                    }
                }
            }
        }

        /**
         *取消人员
         */
        $scope.cancelCustomM = function (id) {
            for (var x = 0; x < $scope.userInfo.rel_customer.length; x++) {
                if ($scope.userInfo.rel_customer[x].id == id) {
                    $scope.userInfo.groupMember.push($scope.userInfo.rel_customer[x]);//将取消的人员放回到下拉列表
                    $scope.userInfo.rel_customer.splice(x, 1);
                    break;
                }
            }
        };


        /**
         * 确认按钮
         * (1)将修改的数据发往上级页面
         * */
        $scope.modifyConfirm = function () {

            var rel_customerArr = [];
            for (var j = 0; j < $scope.userInfo.rel_customer.length; j++) {
                rel_customerArr.push($scope.userInfo.rel_customer[j].id)
            }
            var relCustomer = rel_customerArr.join(",");

            //0标示新增用户操作,1表示修改用户详情操作
            if (re.test($scope.userInfo.phoneNum)){
                if ($scope.userInfo.user_action == 1) {
                    if($scope.showCareEye){
                        toggleFocus();
                    }

                    Customer.update({id: $scope.tempUserId},
                        {
                            //"id": $scope.tempUserId,


                            "primaryOwner":($scope.eyeObj.currentEyeType=="primaryOwner"?true:false),
                            "mobile": $scope.userInfo.phoneNum,
                            "hospitalList": $scope.userInfo.hospitalArr.join(","),
                            "name": $scope.userInfo.name,
                            "type": $scope.userInfo.cRole,
                            "address": $scope.userInfo.address,
                            "star": $scope.userInfo.cStar,
                            "birthday": $scope.userInfo.birthDay,
                            "customerRelList": relCustomer,
                            "headUrl": (images.serverId.length == 0 ? "" : images.serverId[0] )
                        }, function (data) {
                            console.log("********&&&&&&&&*****",data);
                            $scope.modifyCustomerInfoModal.hide();
                            $scope.customerInfoOld.name = $scope.userInfo.name;
                            $scope.customerInfoOld.myCustomer.star = $scope.userInfo.cStar;
                            $scope.customerInfoOld.type = $scope.userInfo.cRole;
                            $scope.customerInfoOld.address = $scope.userInfo.address;
                            $scope.userInfo.cHeadPic=data.customer.headUrl;
                            $scope.customerInfoOld.headUrl = data.customer.headUrl;
                            $scope.customerInfoOld.mobile = $scope.userInfo.phoneNum;
                            $scope.customerInfoOld.birthday=data.customer.birthday;
                            if(data.customer.myCustomer && data.customer.myCustomer.cycleDay){
                                $scope.customerInfoOld.myCustomer.cycleDay=data.customer.myCustomer.cycleDay;
                            }else {
                                $scope.customerInfoOld.myCustomer.cycleDay=0;
                            }
                            console.log("信息",$scope.customerInfoOld);
                            if($scope.showCareEye){
                                $scope.customerInfoOld.myCustomer.type=$scope.eyeObj.currentEyeType;
                                if($scope.eyeObj.currentEyeType=="primaryOwner"){
                                    $scope.customerInfoOld.star = $scope.userInfo.cStar;
                                }
                            }
                            $scope.$emit('modify_custom_info_confirm', data.customer);
                        });

                } else {
                    Customer.save({},
                        {
                            "mobile": $scope.userInfo.phoneNum,
                            "hospitalList": $scope.userInfo.hospitalArr.join(","),
                            "name": $scope.userInfo.name,
                            "type": $scope.userInfo.cRole,
                            "address": $scope.userInfo.address,
                            "star": $scope.userInfo.cStar,
                            "birthday": $scope.userInfo.birthDay,
                            "customerRelList": relCustomer,
                            "headUrl": (images.serverId.length == 0 ? "" : images.serverId[0] )
                        },
                        function (data) {
                            initData();
                            $scope.$emit('add_custom_confirm', data.customer);
                            $scope.userInfo.cHeadPic=data.headUrl;
                            $scope.addCustomerModal.hide();
                            $scope.userInfo.cHeadPic="img/man.jpg";
                        }
                    )
                }
            }else {
                alert("手机号码输入有误，请仔细检查")
            }

            //将修改后的用户信息返回上级页面

        }
        /**
         * 取消按钮
         * 不做任何修改，返回上级页面
         */
        $scope.modifyCancel = function () {

            if ($scope.userInfo.user_action == 0) {
                $scope.addCustomerModal.hide();
            } else {
                $scope.modifyCustomerInfoModal.hide();
            }
            // if($scope.showCareEye && !$scope.isAddBool){
            //     $scope.eyeObj.currentEyeType = $scope.originalType;
            // }
            initData();
            $scope.userInfo.cHeadPic="img/man.jpg";

        }

    }])

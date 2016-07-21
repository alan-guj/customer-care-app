/***************************************************************************
 * Utils
 * Gujie
 * ************************************************************************/
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

Date.prototype.UTCFormat = function (fmt) { //author: meizz
    var o = {
        "M+": this.getUTCMonth() + 1, //月份
        "d+": this.getUTCDate(), //日
        "h+": this.getUTCHours(), //小时
        "m+": this.getUTCMinutes(), //分
        "s+": this.getUTCSeconds(), //秒
        "q+": Math.floor((this.getUTCMonth() + 3) / 3), //季度
        "S": this.getUTCMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.getWeek = function() {
    var firstDay = new Date(this.getFullYear(),0,1);
    return Math.floor((this.getTime()-firstDay.getTime()+firstDay.getDay()*86400000)/86400000/7)+1
}

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};


Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

String.prototype.trim=function(){
　　return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
　　return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
　　return this.replace(/(\s*$)/g,"");
}

//+---------------------------------------------------
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd
//+---------------------------------------------------
function daysBetween(DateOne,DateTwo)
{
    var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
    var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
    var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

    var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
    var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
    //return Math.abs(cha);
    return cha;
}

/**
 * Create a shallow copy of an object
 */
function shallowCopy(src, dst) {
  dst = dst || {};

  for (var key in src) {
    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
      dst[key] = src[key];
    }
  }

  return dst;
}
/**
 * Create a shallow copy of an object and clear other fields from the destination
 */
function shallowClearAndCopy(src, dst) {
  dst = dst || {};

  angular.forEach(dst, function(value, key) {
    delete dst[key];
  });

  for (var key in src) {
    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
      dst[key] = src[key];
    }
  }

  return dst;
}

app.filter('showDate',function(){
    return function(input,relative) {
        var output = '';
        if(!input) return output;
        var date = new Date(input);
        var now = new Date();
        //if(date.getFullYear()!=now.getFullYear()) {
            //var diffYear = date.getFullYear() - now.getFullYear();
            //output = Math.abs(diffYear)+'年'+(diffYear>0?'后':'前');
            //return output;
        //}
        //if(date.getMonth()!=now.getMonth()) {
            //var diffMonth= date.getMonth() - now.getMonth();
            //output = Math.abs(diffMonth)+'个月'+(diffMonth>0?'后':'前');
            //return output;
        //}
        //if(date.getDate()!=now.getDate()) {
            //var diffDate= date.getDate() - now.getDate();
            //output = Math.abs(diffDate)+'天'+(diffDate>0?'后':'前');
            //return output;
        //}

        var diffDate = Math.floor(
            (date.getTime()-date.getTimezoneOffset()*60000)/86400000)
            -Math.floor((now.getTime()-date.getTimezoneOffset()*60000)/86400000);

        return (diffDate == 0 && '今天') ||
            (diffDate == -1 && '昨天') ||
            (diffDate == 1 && '明天') ||
            (diffDate < -1 && Math.abs(diffDate)+'天前') ||
            (diffDate > 1 && Math.abs(diffDate)+'天后');

    }
})

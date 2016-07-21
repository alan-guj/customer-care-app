web_servers = {
}

other_services = {
        'hospital_uri':'http://120.27.157.28:7008/api/v1.0/hospital/list',
        'jssdk_signature':'http://114.55.3.224:5000/api/v1.0/weixin/jssdk/signature?pageurl=http://cc-dev.jyx365.top/customer_care',
        'jssdk_location':'http://apis.map.qq.com/tools/poimarker?type=0&marker=:marker&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&streetview=0&tonav=0',
        'enporguser_uri':'http://114.55.3.224:6001/api/v1/enporguser/enpe/:orgid'
}

customer_care_service_api_list = {
        'personal_uri':'/api/v1.0/users/:user_id/stat/yesterday',
        'customer_uri':'/api/v1.0/customers/:id',
        'customer_owner_uri':'/api/v1.0/customers/:customer_id/owners/:user_id',
        'schedule_uri':'/api/v1.0/schedules/:id',
        'schedule_log_uri':'/api/v1.0/schedules/:schedule_id/logs/:log_id',
        'customer_period':'/api/v1.0/care/careperiod/:id',
        'mylocation_show_uri':'/api/v1.0/users/:user_id/logs?type=location&date=:date&range=:range',
        'myGrpLocation_show_uri':'/api/v1.0/group/:grp_id/logs?type=location&date=:date&range=:range'
}

sys_params = {
        'range_max':{
            'five_max':100,
            'four_max':100,
            'three_max':100,
            'two_max':100,
            'one_max':100
        },
        'sys_period':{
            'five_star':5,
            'four_star':10,
            'three_star':15,
            'two_star':20,
            'one_star':30
        }
}

oauth_params = {
    baseUrl: 'https://dev.jyx365.top',
    clientId: 'customer_care_web_server_guj',
    clientSecret: '654322',
    grantPath: '/oauth/access_token',
    revokePath: '/oauth/revoke',
    userPath: '/api/v1.0/users/current'
}






angular.module("configure",[])
    .constant('web_servers',web_servers)
    .constant('services',angular.extend({},other_services,customer_care_service_api_list))
    .constant('sys_params',sys_params)
    .constant('oauth_params',oauth_params)




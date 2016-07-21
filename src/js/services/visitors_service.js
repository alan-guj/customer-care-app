
visitors_service= angular.module('VisitorsService',['configure', 'ngResource']).
    factory('Visitors',function($resource,services){
        return $resource(
            services.visitors_uri,
            {},
            {
                get_visitors:{
                    method:'GET',
                    params:{},
                },
                delete_visitors:{
                    url:services.visitors_uri+"/:id",
                    method:'DELETE',
                    params:{},
                },
                add_visitors:{
                    method:'POST',
                    params:{},
                }
            }
        );
    });

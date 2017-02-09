var tabControllers = angular.module('tabControllers', []);

tabControllers.controller('ListController', ['$scope', '$http', function($scope, $http) {
    // initialize faceted search object
    $scope.search = {
        "SearchText" : "",
        "subject": {},
        "SearchType": {}
    };
    $scope.filter = {};
//	$http.get('api/FrontPageCleaned.json').success(function(data) {
//        console.log('Success!');
//		$scope.searches = data;
//        $scope.filter.SearchTool = filterizeMulti(data,"SearchTool");
//        $scope.filter.SearchType = filterizeMulti(data,"SearchType");
//	}).error(function(error) {
//        console.log('Error');
//    });
    $http.get('api/solarspell.json').success(function(data) {
        console.log('Success!');
        console.log(data);
        $scope.searches = data;
        $scope.filter.subject = filterize(data,"subject");
        console.log( filterize(data,"subject") );
    }).error(function(error) {
        console.log('Error');
    });

}]);

myApp.filter('searchFilter', function() {

    return function( list, searchobj ) {

        if (list != undefined) {

            return list.filter( function( item ) {

                // Check for filters set
                var any_filter_set = false;
                if ( searchobj.hasOwnProperty('SearchText') && searchobj.SearchText != "" ) {
                    any_filter_set = true;
                }
                for ( subject in searchobj.subject) {
                    any_filter_set = any_filter_set || searchobj.subject[ subject ];
                }
                for ( SearchTool in searchobj.SearchTool) {
                    any_filter_set = any_filter_set || searchobj.SearchTool[ SearchTool ];
                }
                for ( SearchType in searchobj.SearchType) {
                    any_filter_set = any_filter_set || searchobj.SearchType[ SearchType ];
                }
                // If any_filter_set is still false, just pass everything through
                if ( !any_filter_set ) { return !any_filter_set; }

                // Still here? Do the filters pass?
                var any_value_set = false;
                var passes_filters = false;

                // Search Text
                if ( searchobj.SearchText != "" && item.SearchText[0].indexOf(searchobj.SearchText) === -1 ) {
                    return false;
                }

                // Search Subject
                for ( subject in searchobj.subject ) {
                    any_value_set = any_value_set || searchobj.subject[ subject ];
                    passes_filters = passes_filters || (searchobj.subject[ subject ] && item.subject == subject);
                }
                if( any_value_set && !passes_filters ) {
                    return false;
                }

                // Search Type
                for ( SearchType in searchobj.SearchType ) {
                    any_value_set = any_value_set || searchobj.SearchType[SearchType];
                    passes_filters = passes_filters || (searchobj.SearchType[ SearchType ] && item.SearchType == SearchType);
                }
                if( any_value_set && !passes_filters ) {
                    return false;
                }

                return true;
            } );
        }
    };
});


/* ############################################################################
####
#### Custom functions
*/

var filterize = function(obj,key) {
    var testArray = [];
    testArray = obj.reduce(function(prev,curr,index,array) {
        if(testArray.indexOf(curr[key]) === -1) {
            testArray.push(curr[key]);
        }
        return testArray;

    });
    return testArray.sort();
}

function filterizeMulti(object, key) {
    var temparray = [];
    temparray = object.reduce(function(prev, curr, index, array) {
        var tempMulti = curr[key];
        var tempMultiLength = tempMulti.length;
        for (var i = 0; i < tempMultiLength; i++ ) {
            if(temparray.indexOf(tempMulti[i]) === -1) {
                temparray.push(tempMulti[i])
            }
        }
        return temparray;
    });
    return temparray.sort();
}
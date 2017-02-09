var tabControllers = angular.module('tabControllers', []);

tabControllers.controller('ListController', ['$scope', '$http', function($scope, $http) {
    // initialize faceted search object
    $scope.search = {
        "SearchText" : "",
        "subject": {},
        "format": {}
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
        $scope.searches = data;
        $scope.filter.subject = filterize(data,"subject");
        $scope.filter.format = filterize(data,"format");
    }).error(function(error) {
        console.log('Error');
    });

}]);

myApp.filter('searchFilter', function() {

    // This compares the content of the elements in the list array with the content of the search object.
    // list      - array of objects that are being filtered
    // searchobj - object containing properties on which to filter
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
                for ( format in searchobj.format) {
                    any_filter_set = any_filter_set || searchobj.format[ format ];
                }
                // If any_filter_set is still false, just pass everything through
                if ( !any_filter_set ) { return !any_filter_set; }

                // Initialize for title text filter
                var any_value_set = false;
                var passes_filters = false;

                // Search Text
                if ( searchobj.SearchText != "" && item.SearchText[0].indexOf(searchobj.SearchText) === -1 ) {
                    return false;
                }

                // Initialize for subject category filter
                var any_value_set = false;
                var passes_filters = false;

                // Subject filter
                for ( subject in searchobj.subject ) {
                    any_value_set = any_value_set || searchobj.subject[ subject ];
                    passes_filters = passes_filters || (searchobj.subject[ subject ] && item.subject == subject);
                }
                if( any_value_set && !passes_filters ) {
                    return false;
                }

                // Initialize for format category filter
                var any_value_set = false;
                var passes_filters = false;

                // Format filter
                for ( format in searchobj.format ) {
                    any_value_set = any_value_set || searchobj.format[ format ];
                    passes_filters = passes_filters || (searchobj.format[ format ] && item.format == format);
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
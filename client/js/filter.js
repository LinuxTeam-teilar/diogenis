'use strict';

/* Filters */

diogenisApp.filter('gt', function () {
    return function ( items, value ) {
        var filteredItems = []
        angular.forEach(items, function ( item ) {
            if ( item > value ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
})

var demoApp = angular.module('demo', []);
demoApp.controller('MainController', ['$scope', 'todoWebService', function($scope, todoWebService) {

    // Setup a view model
    var vm = {};

    vm.list = [];

    todoWebService.getItems().then(function(response) {
        vm.list = response.data.items;
    })

    vm.addItem = function() {
        var item = {
           details: vm.newItemDetails
        };
        vm.newItemDetails = '';

        todoWebService.addItem(item).then(function(response) {
            vm.list.push({
               _id: response.data.itemId,
                details: item.details
            });
        });
    };

    vm.removeItem = function(itemToRemove) {
            vm.list = vm.list.filter(function(item) { return (item._id !== itemToRemove._id); });
            todoWebService.removeItem(itemToRemove);
    };

    vm.newItemDetails = '';
    $scope.vm = vm;
}]);

demoApp.service('todoWebService', ['$http', function($http) {
    var root = '/todo';
    return {
        getItems: function() {
            return $http.get(root);
        },
        addItem: function(item) {
            console.log("Newly added item details ==> " + item.details);
            return $http.post(root, item);
        },
        removeItem: function(item) {
            console.log(root + '/' + item._id);
            return $http.delete(root + '/' + item._id);
        }
    }
}]);

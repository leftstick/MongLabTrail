
var mongo = angular.module('mongo', []);

mongo.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/', {templateUrl: 'partials/main.html', controller: 'mainController'}).
    when('/add', {templateUrl: 'partials/add.html', controller: 'addController'}).
    when('/update/:name', {templateUrl: 'partials/update.html', controller: 'updateController'}).
    otherwise({redirectTo: '/'});
}]);

mongo.controller('mainController', ['$scope', 'data' , function($scope, data){
	data.fetchAll(function(users){
		$scope.users = users;
	});

	$scope.delete = function(name){
        data.fetchUserByName(name, function(user){
            data.deleteUser(user);
        });		
	};

}]);

mongo.controller('addController', ['$scope', '$location', 'data', function($scope, $location, data){
    $scope.add = function(){
        data.addUsers([{"name": $scope.name, "age": $scope.age}], function(){
            $location.path('/');
        });
        $scope.name = "";
        $scope.age = "";
    };
}]);

mongo.controller('updateController', ['$scope', '$routeParams', '$location', 'data', function($scope, $routeParams, $location, data){
    data.fetchUserByName($routeParams.name, function(user){
        $scope.name = user.name;
        $scope.age = user.age;
    });

    $scope.update = function(){
        data.updateUser({"name": $scope.name, "age": $scope.age}, function(){
            $location.path('/');
        });
    };
}]);

mongo.factory('data', ['$http', function($http){
    var factory = {};
    var users;


    factory.fetchAll = function(success){
    	if(!users){
	        $http.get('https://api.mongolab.com/api/1/databases/infoholder/collections/userinfo?apiKey=y8OsVXFLBIRN4Z7vYpluCweHNvUI9Xde').success(function(data){
	        	users = data;
	            success(users);
	        });
        }else{
        	success(users);
        }
    };

    factory.fetchUserByName = function(name, success){
    	this.fetchAll(function(us){
            for(var i in us){
            	if(us[i].name === name){
                    success(us[i]);
                    return;
            	}
            }
            success();
    	});
    };

    factory.addUser = function(user, success){
        $http.post('https://api.mongolab.com/api/1/databases/infoholder/collections/userinfo?apiKey=y8OsVXFLBIRN4Z7vYpluCweHNvUI9Xde', user).success(function(){
        	users = undefined;
            if(success){
                success();
            }
        });
    };

    factory.addUsers = function(us, success){
        $http.post('https://api.mongolab.com/api/1/databases/infoholder/collections/userinfo?apiKey=y8OsVXFLBIRN4Z7vYpluCweHNvUI9Xde', us).success(function(){
        	users = undefined;
            if(success){
                success();
            }
        });
    };

    factory.updateUser = function(user, success){
    	var criteria = '&q={"name":"'+user.name+'"}';
    	var update = user ;
        $http.put('https://api.mongolab.com/api/1/databases/infoholder/collections/userinfo?apiKey=y8OsVXFLBIRN4Z7vYpluCweHNvUI9Xde'+criteria, update).success(function(){
        	users = undefined;
            if(success){
                success();
            }
        });
    };

    factory.deleteUser = function(user, success){
        $http.delete('https://api.mongolab.com/api/1/databases/infoholder/collections/userinfo/'+user._id.$oid+'?apiKey=y8OsVXFLBIRN4Z7vYpluCweHNvUI9Xde').success(function(){
        	for(var i in users){
                if(users[i].name === user.name){
                	users.splice(i,1);
                }
        	}
        	if(success){
        	    success();	
        	}
        });
    };

    return factory;
}]);
// angular.bootstrap(document, ['mongo']);

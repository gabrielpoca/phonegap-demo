(function() {
  var app;

  app = angular.module('triplit', ['ui.router', 'ngAnimate', 'pouchdb', 'angular-gestures']);

  app.controller('TripsController', function($scope, Trip) {
    return $scope.trips = Trip;
  });

  app.controller('NewTripController', function($scope, $state, Trip) {
    $scope.trip = {};
    return $scope.submit = function() {
      return Trip.post({
        name: $scope.trip.name
      });
    };
  });

  app.controller('ShowTripController', function($scope, $stateParams, Trip) {
    $scope.startedDescription = 'Trip started';
    return Trip.get($stateParams.id, function(err, trip) {
      $scope.total = _.reduce(trip.expenses, function(memo, expense) {
        return memo + expense.value;
      }, 0);
      $scope.trip = trip;
      return $scope.$apply();
    });
  });

  app.controller('NewExpenseController', function($scope, $rootScope, $stateParams, $state, Trip) {
    return Trip.get($stateParams.id, function(err, trip) {
      $rootScope.back();
      $scope.expense = {};
      return $scope.submit = (function(_this) {
        return function() {
          if (!trip.expenses) {
            trip.expenses = [];
          }
          trip.expenses.push($scope.expense);
          Trip.put(trip);
          return $state.go('trips.show');
        };
      })(this);
    });
  });

  app.run(function($rootScope, $window) {
    $rootScope.slide = '';
    return $rootScope.$on('$stateChangeStart', function() {
      $rootScope.back = function() {
        return $rootScope.slide = 'slide-right';
      };
      return $rootScope.next = function() {
        return $rootScope.slide = 'slide-left';
      };
    });
  });

}).call(this);

(function() {
  angular.module('triplit').service('Trip', function(pouchdb) {
    return pouchdb.create('trips');
  });

}).call(this);

(function() {
  angular.module('triplit').service('Expense', function(DatabaseBase) {
    var User;
    return User = (function() {
      angular.extend(User, DatabaseBase);

      angular.extend(User.prototype, DatabaseBase.prototype);

      User.id = 1;

      User.list = [];

      function User(options) {
        angular.extend(this, options);
        User.save(this);
      }

      return User;

    })();
  });

}).call(this);

(function() {
  angular.module('triplit').directive("linked", function() {
    return {
      link: function(scope, element, attrs) {
        var id;
        id = attrs["linked"];
        return element.on("click", function() {
          return document.getElementById(id).click();
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('triplit').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/trips');
    return $stateProvider.state('trips', {
      url: '/trips',
      abstract: true,
      templateUrl: 'partials/layout.html'
    }).state('trips.index', {
      url: '',
      views: {
        'content@trips': {
          templateUrl: 'partials/trips/index.html'
        },
        'nav@trips': {
          templateUrl: 'partials/trips/index_nav.html',
          controller: function($scope, $state, $rootScope) {
            return $scope.next = function() {
              $rootScope.next();
              return $state.go('trips.new');
            };
          }
        }
      }
    }).state('trips.new', {
      url: '/new',
      views: {
        'content@trips': {
          templateUrl: 'partials/new_trip/new.html'
        },
        'nav@trips': {
          templateUrl: 'partials/new_trip/new_nav.html'
        }
      }
    }).state('trips.show', {
      url: '/:id',
      views: {
        'content@trips': {
          templateUrl: 'partials/show_trip/show.html'
        },
        'nav@trips': {
          templateUrl: 'partials/show_trip/show_nav.html'
        }
      }
    }).state('trips.show.expenses', {
      url: '/expenses'
    }).state('trips.show.expenses.new', {
      url: '/new',
      views: {
        'content@trips': {
          templateUrl: 'partials/new_expense/new_expense.html'
        },
        'nav@trips': {
          templateUrl: 'partials/new_expense/new_expense_nav.html'
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module('triplit').directive('box', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/box/box.html',
      scope: {
        description: '=name'
      }
    };
  });

  angular.module('triplit').directive('boxImage', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/box/box_image.html',
      scope: {
        description: '=name'
      }
    };
  });

  angular.module('triplit').directive('boxImageExtra', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/box/box_image_extra.html',
      scope: {
        description: '=name',
        value: '=value'
      }
    };
  });

}).call(this);

(function() {
  angular.module('triplit').directive('headingAlpha', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'components/heading/heading_alpha.html',
      scope: {
        value: '@value'
      }
    };
  });

}).call(this);

(function() {
  angular.module('triplit').directive('navigation', function() {
    return {
      restrict: 'EA',
      compile: function(element, attributes) {
        return element.addClass('Navigation');
      }
    };
  });

  angular.module('triplit').directive('navigationBack', function() {
    return {
      restrict: 'A',
      template: '<span class="IconBack"></span>'
    };
  });

  angular.module('triplit').directive('navigationAdd', function() {
    return {
      restrict: 'A',
      template: '<span class="IconAdd"></span>'
    };
  });

}).call(this);

(function() {
  angular.module('triplit').directive('page', function() {
    return {
      restrict: 'EA',
      compile: function(element, attributes) {
        return element.addClass('Page');
      }
    };
  });

  angular.module('triplit').directive('pageWithHeader', function() {
    return {
      restrict: 'EA',
      compile: function(element, attributes) {
        return element.addClass('Page Page--withHeader');
      }
    };
  });

}).call(this);

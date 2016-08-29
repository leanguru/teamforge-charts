describe('cfdCtrl:', function () {
    var $httpBackend, $rootScope, $scope, $location, cfdCtrl, $location;

    beforeEach(module('teamforgeChartsApp'));

    beforeEach(
        inject(function ($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');

            // Get hold of a scope (i.e. the root scope)
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            // Mock location
            $location = $injector.get('$location');


            // The $controller service is used to create instances of controllers
            var $controller = $injector.get('$controller');

            cfdCtrl = $controller('cfdCtrl', {'$scope': $scope });
        })
    );

    describe('init():', function () {
        beforeEach(function () {
            // Set system time to 15/10/2013
            var baseTime = new Date(2013, 9, 15);
            jasmine.clock().mockDate(baseTime);

        });

        it('date_from and date_until should be +/- 14 days of current time no HTTP GET parameters are provided', function () {

            spyOn($location, 'search').and.returnValue({});
            $scope.init();
            expect($scope.date_from).toEqual(new Date(Date.UTC(2013, 9, 1, 12, 0, 0)));
            expect($scope.date_until).toEqual(new Date(Date.UTC(2013, 9, 29, 12, 0, 0)));
        });

        it('date_from should be 10/10/2015 if HTTP GET parameter date_from=10/10/2015', function () {
            var baseTime = new Date(2013, 9, 15);
            jasmine.clock().mockDate(baseTime);

            spyOn($location, 'search').and.returnValue({'tracker': 'tracker12345', 'date_from': '2015-10-10'});
            $scope.init();
            expect($scope.date_from).toEqual(new Date(Date.UTC(2015, 9, 10, 12, 0, 0)));
        });

        it('date_until should be 10/10/2015 if HTTP GET parameter date_until=10/10/2015', function () {
            var baseTime = new Date(2013, 9, 15);
            jasmine.clock().mockDate(baseTime);

            spyOn($location, 'search').and.returnValue({'tracker': 'tracker12345', 'date_until': '2015-10-10'});
            $scope.init();
            expect($scope.date_until).toEqual(new Date(Date.UTC(2015, 9, 10, 12, 0, 0)));
        });

        it('error_message should be set if date_until < date_from', function () {
            var baseTime = new Date(2013, 9, 15);
            jasmine.clock().mockDate(baseTime);

            spyOn($location, 'search').and.returnValue({'tracker': 'tracker12345', 'date_until': '2015-10-10', 'date_from': '2015-10-11'});
            $scope.init();
            expect($scope.error_message.length).toBeGreaterThan(0);
        });
    })

});
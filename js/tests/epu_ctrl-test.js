describe('epuCtrl:', function () {
    var $httpBackend, $rootScope, $scope, $location, epuCtrl;

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

            epuCtrl = $controller('epuCtrl', {'$scope': $scope });
        })
    );

    describe('init():', function () {
        beforeEach(function () {
            // Set system time to 15/10/2013
            var baseTime = new Date(2013, 9, 15);
            jasmine.clock().mockDate(baseTime);
        });

        it('date_from and date_until should be set according to the config file', function () {
            var config = {
                date_from: '2013-10-10',
                date_until: '2013-10-14',
                trackers: "tracker01,tracker02",
                planned_date_fields: "field01,field02"
            };

            spyOn($location, 'search').and.returnValue({});
            $scope.init(config);
            expect($scope.date.from).toEqual(new Date(Date.UTC(2013, 9, 10, 12, 0, 0)));
            expect($scope.date.until).toEqual(new Date(Date.UTC(2013, 9, 14, 12, 0, 0)));
        });

        it('date_from and date_until should be overwritten by the get parameters', function () {
            var config = {
                date_from: '2013-10-10',
                date_until: '2013-10-14',
                trackers: "tracker01,tracker02",
                planned_date_fields: "field01,field02"
            };

            spyOn($location, 'search').and.returnValue({date_from: '2013-01-01', date_until: '2013-02-02'});
            $scope.init(config);
            expect($scope.date.from).toEqual(new Date(Date.UTC(2013, 0, 1, 12, 0, 0)));
            expect($scope.date.until).toEqual(new Date(Date.UTC(2013, 1, 2, 12, 0, 0)));
        });

    });

    describe('drawGraph:', function () {
        var config;

        beforeEach(function () {
            // Set return values for Ajax requests
            $httpBackend.expectGET("http://test:8080/test/tracker01/_aggrs/latest_import_timestamp").respond(200, '{ "_size" : 1 , "_total_pages" : 1 , "_returned" : 1 , "_embedded" : { "rh:result" :[{"_id": {"$oid": "580e9c998e138aff5c812220"},"importTimestamp": "2011-12-13T01:02:03"}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker02/_aggrs/latest_import_timestamp").respond(200, '{ "_size" : 1 , "_total_pages" : 1 , "_returned" : 1 , "_embedded" : { "rh:result" :[{"_id": {"$oid": "580e9c998e138aff5c812220"},"importTimestamp": "2012-13-14T02:03:04"}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker01/_aggrs/current_effort_per_user?pagesize=1000&avars={'import_timestamp':'2011-12-13T01:02:03','planned_date_field':'$field01','datetime_from':'2013-10-10T00:00:00','datetime_until':'2013-10-14T23:59:59'}").respond(200, '{ "_size" : 4 , "_total_pages" : 1 , "_returned" : 4 , "_embedded" : { "rh:result" :[{ "_id": "abc","estimatedEffort": 12,"actualEffort": 5,"remainingEffort": 9,"assignedTo": "abc"},{ "_id": "hij","estimatedEffort": 26,"actualEffort": 42,"remainingEffort": 33,"assignedTo": "hij"},{ "_id": "uvw","estimatedEffort": 45,"actualEffort": 32,"remainingEffort": 31,"assignedTo": "uvw"},{ "_id": "xyz","estimatedEffort": 34,"actualEffort": 43,"remainingEffort": 43,"assignedTo": "xyz"}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker02/_aggrs/current_effort_per_user?pagesize=1000&avars={'import_timestamp':'2012-13-14T02:03:04','planned_date_field':'$field02','datetime_from':'2013-10-10T00:00:00','datetime_until':'2013-10-14T23:59:59'}").respond(200, '{ "_size" : 3 , "_total_pages" : 1 , "_returned" : 3 , "_embedded" : { "rh:result" :[{ "_id": "abc","estimatedEffort": 34,"actualEffort": 23,"remainingEffort": 52,"assignedTo": "abc"},{ "_id": "efg","estimatedEffort": 43,"actualEffort": 23,"remainingEffort": 3,"assignedTo": "efg"},{ "_id": "uvw","estimatedEffort": 65,"actualEffort": 43,"remainingEffort": 85,"assignedTo": "uvw"}]}}');

            // Set values for config file
            config = {
                date_from: '2013-10-10',
                date_until: '2013-10-14',
                trackers: "tracker01,tracker02",
                planned_date_fields: "field01,field02"
            };
        });

        it('A simple request should set the accumulated quantities for the union set of all users', function () {

            $scope.init(config);
            $httpBackend.flush();

            expect($scope.error_message).toEqual('');
            expect($scope.labels).toEqual(['abc','efg','hij','uvw','xyz'])
            // Test Actual Effort
            expect($scope.data[0]).toEqual([28,23,42,75,43])
            // Test Remaining Effor
            expect($scope.data[1]).toEqual([61,3,33,116,43])

        });
    });

});
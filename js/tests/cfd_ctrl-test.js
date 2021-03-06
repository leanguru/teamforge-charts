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
    });

    describe('integration test:', function () {
        it('a full test with values from our tracker88228 without any parameters:', function () {
            // Set system time so that automatic time window calculation works properly for that test
            var baseTime = new Date(2016, 8, 5);
            jasmine.clock().mockDate(baseTime);

            // Set the return parameters
            restheart_config.base_url = 'http://test:8080/test/';
            spyOn($location, 'search').and.returnValue({tracker: 'tracker88228'});

            $httpBackend.expectGET("http://test:8080/test/tracker88228_planning_folders/_aggrs/list?pagesize=1000&avars={'planningFolderDepth':3}").respond(200, '{ "_size" : 33 , "_total_pages" : 1 , "_returned" : 33 , "_embedded" : { "rh:result" : [ { "_id" : "APPS" , "id" : "plan20468" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "APPS>ALERGS" , "id" : "plan21059" , "parentFolderId" : "plan20468" , "status" : ""} , { "_id" : "APPS>ANEEL" , "id" : "plan22911" , "parentFolderId" : "plan20468" , "status" : ""} , { "_id" : "APPS>BNB" , "id" : "plan16708" , "parentFolderId" : "plan20468" , "status" : ""} , { "_id" : "APPS>HCPA" , "id" : "plan17224" , "parentFolderId" : "plan20468" , "status" : "Not Started"} , { "_id" : "APPS>OI SAP" , "id" : "plan20663" , "parentFolderId" : "plan20468" , "status" : "Not Started"} , { "_id" : "APPS>SAP SHARED" , "id" : "plan19909" , "parentFolderId" : "plan20468" , "status" : "In progress"} , { "_id" : "APPS>SERASA" , "id" : "plan23782" , "parentFolderId" : "plan20468" , "status" : ""} , { "_id" : "BRADESCO" , "id" : "plan20469" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "BRADESCO>APPS - ONDA 1" , "id" : "plan20760" , "parentFolderId" : "plan20469" , "status" : ""} , { "_id" : "BRADESCO>APPS - ONDA 2" , "id" : "plan25029" , "parentFolderId" : "plan20469" , "status" : ""} , { "_id" : "BRADESCO>PEGA" , "id" : "plan16154" , "parentFolderId" : "plan20469" , "status" : ""} , { "_id" : "BRADESCO>PIS INTEGRACAO" , "id" : "plan26784" , "parentFolderId" : "plan20469" , "status" : ""} , { "_id" : "CAIXA" , "id" : "plan20467" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "CAIXA>CEPTI-BR" , "id" : "plan16150" , "parentFolderId" : "plan20467" , "status" : ""} , { "_id" : "CAIXA>CETAD" , "id" : "plan19341" , "parentFolderId" : "plan20467" , "status" : "Not Started"} , { "_id" : "CAIXA>CRIM" , "id" : "plan22906" , "parentFolderId" : "plan20467" , "status" : ""} , { "_id" : "CAIXA>ERP" , "id" : "plan16155" , "parentFolderId" : "plan20467" , "status" : ""} , { "_id" : "CAIXA>INTERNET BANKING" , "id" : "plan16152" , "parentFolderId" : "plan20467" , "status" : ""} , { "_id" : "CAIXA>MOBILIDADE" , "id" : "plan20848" , "parentFolderId" : "plan20467" , "status" : "In progress"} , { "_id" : "CAIXA>PPS" , "id" : "plan16151" , "parentFolderId" : "plan20467" , "status" : ""} , { "_id" : "CENTRAL TEAM" , "id" : "plan20471" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "CENTRAL TEAM>PROGRAM MANAGEMENT" , "id" : "plan16149" , "parentFolderId" : "plan20471" , "status" : "In progress"} , { "_id" : "CENTRAL TEAM>TEST A" , "id" : "plan24169" , "parentFolderId" : "plan20471" , "status" : "In progress"} , { "_id" : "CENTRAL TEAM>TOOLS SUPPORT" , "id" : "plan18271" , "parentFolderId" : "plan20471" , "status" : "In progress"} , { "_id" : "IOS" , "id" : "plan19686" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "IOS>BVM&F Bovespa" , "id" : "plan19688" , "parentFolderId" : "plan19686" , "status" : ""} , { "_id" : "IOS>INSPER" , "id" : "plan19687" , "parentFolderId" : "plan19686" , "status" : ""} , { "_id" : "IOS>MP/RJ" , "id" : "plan26553" , "parentFolderId" : "plan19686" , "status" : ""} , { "_id" : "IOS>Renner" , "id" : "plan22499" , "parentFolderId" : "plan19686" , "status" : ""} , { "_id" : "ITEC" , "id" : "plan20470" , "parentFolderId" : "PlanningApp14122" , "status" : ""} , { "_id" : "ITEC>INFRATEC" , "id" : "plan16153" , "parentFolderId" : "plan20470" , "status" : ""} , { "_id" : "ITEC>ITEC - RJ" , "id" : "plan22912" , "parentFolderId" : "plan20470" , "status" : ""}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker88228_workflows/_aggrs/list").respond(200, '{ "_size" : 7 , "_total_pages" : 1 , "_returned" : 7 , "_embedded" : { "rh:result" : [ { "_id" : "Backlog" , "pos" : 0.0} , { "_id" : "Assigned" , "pos" : 0.14285714285714296} , { "_id" : "WIP" , "pos" : 0.2857142857142859} , { "_id" : "Revision" , "pos" : 0.4285714285714281} , { "_id" : "Blocked" , "pos" : 0.5714285714285718} , { "_id" : "Canceled" , "pos" : 0.7357142857142862} , { "_id" : "Done" , "pos" : 0.8357142857142849}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker88228/_aggrs/status_quantities?pagesize=1000&avars={'aggregation_field': 1,'planned_date_field': '$plannedDate','planning_folder':'PlanningApp14122','datetime_from':'2016-08-22T00:00:00','datetime_until':'2016-09-19T23:59:59'}").respond(200, '{ "_size" : 7 , "_total_pages" : 1 , "_returned" : 7 , "_embedded" : { "rh:result" : [ { "_id" : "Blocked" , "quantities" : [ { "importTimestamp" : "2016-08-24" , "qty" : 86} , { "importTimestamp" : "2016-08-23" , "qty" : 87} , { "importTimestamp" : "2016-08-22" , "qty" : 90} , { "importTimestamp" : "2016-08-26" , "qty" : 90} , { "importTimestamp" : "2016-08-27" , "qty" : 90} , { "importTimestamp" : "2016-08-25" , "qty" : 89}]} , { "_id" : "Backlog" , "quantities" : [ { "importTimestamp" : "2016-08-22" , "qty" : 629} , { "importTimestamp" : "2016-08-23" , "qty" : 626} , { "importTimestamp" : "2016-08-26" , "qty" : 601} , { "importTimestamp" : "2016-08-27" , "qty" : 601} , { "importTimestamp" : "2016-08-25" , "qty" : 602} , { "importTimestamp" : "2016-08-24" , "qty" : 604}]} , { "_id" : "Done" , "quantities" : [ { "importTimestamp" : "2016-08-27" , "qty" : 1951} , { "importTimestamp" : "2016-08-26" , "qty" : 1951} , { "importTimestamp" : "2016-08-25" , "qty" : 1946} , { "importTimestamp" : "2016-08-24" , "qty" : 1922} , { "importTimestamp" : "2016-08-22" , "qty" : 1894} , { "importTimestamp" : "2016-08-23" , "qty" : 1921}]} , { "_id" : "Assigned" , "quantities" : [ { "importTimestamp" : "2016-08-27" , "qty" : 88} , { "importTimestamp" : "2016-08-26" , "qty" : 88} , { "importTimestamp" : "2016-08-22" , "qty" : 110} , { "importTimestamp" : "2016-08-24" , "qty" : 82} , { "importTimestamp" : "2016-08-25" , "qty" : 88} , { "importTimestamp" : "2016-08-23" , "qty" : 97}]} , { "_id" : "Revision" , "quantities" : [ { "importTimestamp" : "2016-08-27" , "qty" : 20} , { "importTimestamp" : "2016-08-24" , "qty" : 39} , { "importTimestamp" : "2016-08-25" , "qty" : 19} , { "importTimestamp" : "2016-08-26" , "qty" : 20} , { "importTimestamp" : "2016-08-22" , "qty" : 40} , { "importTimestamp" : "2016-08-23" , "qty" : 40}]} , { "_id" : "Canceled" , "quantities" : [ { "importTimestamp" : "2016-08-26" , "qty" : 67} , { "importTimestamp" : "2016-08-27" , "qty" : 67} , { "importTimestamp" : "2016-08-23" , "qty" : 66} , { "importTimestamp" : "2016-08-22" , "qty" : 63} , { "importTimestamp" : "2016-08-24" , "qty" : 66} , { "importTimestamp" : "2016-08-25" , "qty" : 67}]} , { "_id" : "WIP" , "quantities" : [ { "importTimestamp" : "2016-08-25" , "qty" : 166} , { "importTimestamp" : "2016-08-27" , "qty" : 161} , { "importTimestamp" : "2016-08-23" , "qty" : 130} , { "importTimestamp" : "2016-08-22" , "qty" : 138} , { "importTimestamp" : "2016-08-24" , "qty" : 169} , { "importTimestamp" : "2016-08-26" , "qty" : 161}]}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker88228/_aggrs/target_quantities?pagesize=1000&avars={'aggregation_field': 1,'planned_date_field': '$plannedDate','planning_folder':'PlanningApp14122','datetime_from':'2016-08-22T00:00:00','datetime_until':'2016-09-19T23:59:59'}").respond(200, '{ "_size" : 6 , "_total_pages" : 1 , "_returned" : 0 , "_embedded" : { "rh:result" : [ { "qty" : 2510 , "importTimestamp" : "2016-08-22"} , { "qty" : 2513 , "importTimestamp" : "2016-08-23"} , { "qty" : 2514 , "importTimestamp" : "2016-08-24"} , { "qty" : 2578 , "importTimestamp" : "2016-08-25"} , { "qty" : 2617 , "importTimestamp" : "2016-08-26"} , { "qty" : 2620 , "importTimestamp" : "2016-08-27"}]}}');
            $httpBackend.expectGET("http://test:8080/test/tracker88228/_aggrs/planned_quantities?pagesize=1000&avars={'aggregation_field': 1,'planned_date_field': '$plannedDate','planning_folder':'PlanningApp14122','datetime_from':'2016-08-22T00:00:00','datetime_until':'2016-09-19T23:59:59'}").respond(200, '{ "_size" : 243 , "_total_pages" : 1 , "_returned" : 0 , "_embedded" : { "rh:result" : [ { "importTimestamp" : "" , "qty" : 112} , { "importTimestamp" : "2015-02-02" , "qty" : 1} , { "importTimestamp" : "2015-04-11" , "qty" : 1} , { "importTimestamp" : "2015-11-05" , "qty" : 5} , { "importTimestamp" : "2015-11-06" , "qty" : 1} , { "importTimestamp" : "2015-11-08" , "qty" : 1} , { "importTimestamp" : "2015-11-09" , "qty" : 1} , { "importTimestamp" : "2015-11-10" , "qty" : 2} , { "importTimestamp" : "2015-11-11" , "qty" : 2} , { "importTimestamp" : "2015-11-12" , "qty" : 6} , { "importTimestamp" : "2015-11-17" , "qty" : 3} , { "importTimestamp" : "2015-11-18" , "qty" : 3} , { "importTimestamp" : "2015-11-19" , "qty" : 12} , { "importTimestamp" : "2015-11-24" , "qty" : 2} , { "importTimestamp" : "2015-11-25" , "qty" : 1} , { "importTimestamp" : "2015-11-26" , "qty" : 12} , { "importTimestamp" : "2015-11-27" , "qty" : 2} , { "importTimestamp" : "2015-11-29" , "qty" : 1} , { "importTimestamp" : "2015-11-30" , "qty" : 3} , { "importTimestamp" : "2015-12-01" , "qty" : 1} , { "importTimestamp" : "2015-12-02" , "qty" : 1} , { "importTimestamp" : "2015-12-03" , "qty" : 8} , { "importTimestamp" : "2015-12-04" , "qty" : 3} , { "importTimestamp" : "2015-12-06" , "qty" : 1} , { "importTimestamp" : "2015-12-07" , "qty" : 1} , { "importTimestamp" : "2015-12-08" , "qty" : 3} , { "importTimestamp" : "2015-12-09" , "qty" : 1} , { "importTimestamp" : "2015-12-10" , "qty" : 16} , { "importTimestamp" : "2015-12-11" , "qty" : 1} , { "importTimestamp" : "2015-12-13" , "qty" : 1} , { "importTimestamp" : "2015-12-14" , "qty" : 2} , { "importTimestamp" : "2015-12-15" , "qty" : 3} , { "importTimestamp" : "2015-12-17" , "qty" : 14} , { "importTimestamp" : "2015-12-18" , "qty" : 3} , { "importTimestamp" : "2015-12-20" , "qty" : 2} , { "importTimestamp" : "2015-12-22" , "qty" : 4} , { "importTimestamp" : "2015-12-23" , "qty" : 2} , { "importTimestamp" : "2015-12-28" , "qty" : 1} , { "importTimestamp" : "2015-12-30" , "qty" : 2} , { "importTimestamp" : "2016-01-04" , "qty" : 2} , { "importTimestamp" : "2016-01-05" , "qty" : 1} , { "importTimestamp" : "2016-01-06" , "qty" : 2} , { "importTimestamp" : "2016-01-07" , "qty" : 20} , { "importTimestamp" : "2016-01-08" , "qty" : 2} , { "importTimestamp" : "2016-01-11" , "qty" : 1} , { "importTimestamp" : "2016-01-12" , "qty" : 7} , { "importTimestamp" : "2016-01-13" , "qty" : 8} , { "importTimestamp" : "2016-01-14" , "qty" : 28} , { "importTimestamp" : "2016-01-15" , "qty" : 8} , { "importTimestamp" : "2016-01-17" , "qty" : 5} , { "importTimestamp" : "2016-01-19" , "qty" : 1} , { "importTimestamp" : "2016-01-20" , "qty" : 13} , { "importTimestamp" : "2016-01-21" , "qty" : 10} , { "importTimestamp" : "2016-01-22" , "qty" : 35} , { "importTimestamp" : "2016-01-24" , "qty" : 1} , { "importTimestamp" : "2016-01-25" , "qty" : 5} , { "importTimestamp" : "2016-01-26" , "qty" : 1} , { "importTimestamp" : "2016-01-27" , "qty" : 5} , { "importTimestamp" : "2016-01-28" , "qty" : 10} , { "importTimestamp" : "2016-01-29" , "qty" : 18} , { "importTimestamp" : "2016-01-30" , "qty" : 8} , { "importTimestamp" : "2016-02-01" , "qty" : 3} , { "importTimestamp" : "2016-02-03" , "qty" : 2} , { "importTimestamp" : "2016-02-04" , "qty" : 20} , { "importTimestamp" : "2016-02-05" , "qty" : 13} , { "importTimestamp" : "2016-02-11" , "qty" : 8} , { "importTimestamp" : "2016-02-12" , "qty" : 11} , { "importTimestamp" : "2016-02-15" , "qty" : 18} , { "importTimestamp" : "2016-02-17" , "qty" : 2} , { "importTimestamp" : "2016-02-18" , "qty" : 7} , { "importTimestamp" : "2016-02-19" , "qty" : 8} , { "importTimestamp" : "2016-02-21" , "qty" : 2} , { "importTimestamp" : "2016-02-22" , "qty" : 11} , { "importTimestamp" : "2016-02-23" , "qty" : 5} , { "importTimestamp" : "2016-02-24" , "qty" : 3} , { "importTimestamp" : "2016-02-25" , "qty" : 18} , { "importTimestamp" : "2016-02-26" , "qty" : 9} , { "importTimestamp" : "2016-02-28" , "qty" : 7} , { "importTimestamp" : "2016-02-29" , "qty" : 1} , { "importTimestamp" : "2016-03-02" , "qty" : 3} , { "importTimestamp" : "2016-03-03" , "qty" : 28} , { "importTimestamp" : "2016-03-04" , "qty" : 4} , { "importTimestamp" : "2016-03-06" , "qty" : 1} , { "importTimestamp" : "2016-03-07" , "qty" : 2} , { "importTimestamp" : "2016-03-08" , "qty" : 2} , { "importTimestamp" : "2016-03-09" , "qty" : 5} , { "importTimestamp" : "2016-03-10" , "qty" : 50} , { "importTimestamp" : "2016-03-11" , "qty" : 12} , { "importTimestamp" : "2016-03-13" , "qty" : 6} , { "importTimestamp" : "2016-03-14" , "qty" : 2} , { "importTimestamp" : "2016-03-15" , "qty" : 6} , { "importTimestamp" : "2016-03-17" , "qty" : 49} , { "importTimestamp" : "2016-03-18" , "qty" : 14} , { "importTimestamp" : "2016-03-20" , "qty" : 1} , { "importTimestamp" : "2016-03-21" , "qty" : 1} , { "importTimestamp" : "2016-03-23" , "qty" : 16} , { "importTimestamp" : "2016-03-24" , "qty" : 23} , { "importTimestamp" : "2016-03-25" , "qty" : 17} , { "importTimestamp" : "2016-03-27" , "qty" : 1} , { "importTimestamp" : "2016-03-28" , "qty" : 1} , { "importTimestamp" : "2016-03-29" , "qty" : 2} , { "importTimestamp" : "2016-03-30" , "qty" : 6} , { "importTimestamp" : "2016-03-31" , "qty" : 71} , { "importTimestamp" : "2016-04-01" , "qty" : 11} , { "importTimestamp" : "2016-04-03" , "qty" : 6} , { "importTimestamp" : "2016-04-04" , "qty" : 1} , { "importTimestamp" : "2016-04-05" , "qty" : 2} , { "importTimestamp" : "2016-04-06" , "qty" : 4} , { "importTimestamp" : "2016-04-07" , "qty" : 91} , { "importTimestamp" : "2016-04-08" , "qty" : 11} , { "importTimestamp" : "2016-04-10" , "qty" : 2} , { "importTimestamp" : "2016-04-11" , "qty" : 3} , { "importTimestamp" : "2016-04-12" , "qty" : 2} , { "importTimestamp" : "2016-04-13" , "qty" : 4} , { "importTimestamp" : "2016-04-14" , "qty" : 71} , { "importTimestamp" : "2016-04-15" , "qty" : 35} , { "importTimestamp" : "2016-04-17" , "qty" : 3} , { "importTimestamp" : "2016-04-19" , "qty" : 3} , { "importTimestamp" : "2016-04-20" , "qty" : 1} , { "importTimestamp" : "2016-04-21" , "qty" : 41} , { "importTimestamp" : "2016-04-22" , "qty" : 15} , { "importTimestamp" : "2016-04-25" , "qty" : 4} , { "importTimestamp" : "2016-04-26" , "qty" : 3} , { "importTimestamp" : "2016-04-27" , "qty" : 3} , { "importTimestamp" : "2016-04-28" , "qty" : 69} , { "importTimestamp" : "2016-04-29" , "qty" : 19} , { "importTimestamp" : "2016-04-30" , "qty" : 1} , { "importTimestamp" : "2016-05-01" , "qty" : 6} , { "importTimestamp" : "2016-05-02" , "qty" : 2} , { "importTimestamp" : "2016-05-04" , "qty" : 1} , { "importTimestamp" : "2016-05-05" , "qty" : 33} , { "importTimestamp" : "2016-05-06" , "qty" : 4} , { "importTimestamp" : "2016-05-08" , "qty" : 7} , { "importTimestamp" : "2016-05-12" , "qty" : 44} , { "importTimestamp" : "2016-05-13" , "qty" : 3} , { "importTimestamp" : "2016-05-16" , "qty" : 3} , { "importTimestamp" : "2016-05-17" , "qty" : 1} , { "importTimestamp" : "2016-05-18" , "qty" : 1} , { "importTimestamp" : "2016-05-19" , "qty" : 18} , { "importTimestamp" : "2016-05-22" , "qty" : 1} , { "importTimestamp" : "2016-05-23" , "qty" : 3} , { "importTimestamp" : "2016-05-24" , "qty" : 1} , { "importTimestamp" : "2016-05-25" , "qty" : 1} , { "importTimestamp" : "2016-05-26" , "qty" : 21} , { "importTimestamp" : "2016-05-29" , "qty" : 10} , { "importTimestamp" : "2016-05-30" , "qty" : 14} , { "importTimestamp" : "2016-05-31" , "qty" : 1} , { "importTimestamp" : "2016-06-02" , "qty" : 24} , { "importTimestamp" : "2016-06-03" , "qty" : 5} , { "importTimestamp" : "2016-06-05" , "qty" : 2} , { "importTimestamp" : "2016-06-06" , "qty" : 2} , { "importTimestamp" : "2016-06-07" , "qty" : 2} , { "importTimestamp" : "2016-06-08" , "qty" : 2} , { "importTimestamp" : "2016-06-09" , "qty" : 95} , { "importTimestamp" : "2016-06-10" , "qty" : 9} , { "importTimestamp" : "2016-06-12" , "qty" : 4} , { "importTimestamp" : "2016-06-13" , "qty" : 3} , { "importTimestamp" : "2016-06-14" , "qty" : 6} , { "importTimestamp" : "2016-06-15" , "qty" : 4} , { "importTimestamp" : "2016-06-16" , "qty" : 73} , { "importTimestamp" : "2016-06-17" , "qty" : 4} , { "importTimestamp" : "2016-06-18" , "qty" : 3} , { "importTimestamp" : "2016-06-19" , "qty" : 4} , { "importTimestamp" : "2016-06-21" , "qty" : 1} , { "importTimestamp" : "2016-06-22" , "qty" : 7} , { "importTimestamp" : "2016-06-23" , "qty" : 69} , { "importTimestamp" : "2016-06-24" , "qty" : 2} , { "importTimestamp" : "2016-06-26" , "qty" : 14} , { "importTimestamp" : "2016-06-29" , "qty" : 11} , { "importTimestamp" : "2016-06-30" , "qty" : 92} , { "importTimestamp" : "2016-07-01" , "qty" : 11} , { "importTimestamp" : "2016-07-03" , "qty" : 7} , { "importTimestamp" : "2016-07-05" , "qty" : 3} , { "importTimestamp" : "2016-07-06" , "qty" : 2} , { "importTimestamp" : "2016-07-07" , "qty" : 34} , { "importTimestamp" : "2016-07-08" , "qty" : 1} , { "importTimestamp" : "2016-07-10" , "qty" : 12} , { "importTimestamp" : "2016-07-13" , "qty" : 2} , { "importTimestamp" : "2016-07-14" , "qty" : 46} , { "importTimestamp" : "2016-07-15" , "qty" : 1} , { "importTimestamp" : "2016-07-17" , "qty" : 9} , { "importTimestamp" : "2016-07-18" , "qty" : 1} , { "importTimestamp" : "2016-07-19" , "qty" : 4} , { "importTimestamp" : "2016-07-21" , "qty" : 36} , { "importTimestamp" : "2016-07-22" , "qty" : 43} , { "importTimestamp" : "2016-07-24" , "qty" : 17} , { "importTimestamp" : "2016-07-25" , "qty" : 2} , { "importTimestamp" : "2016-07-26" , "qty" : 1} , { "importTimestamp" : "2016-07-27" , "qty" : 1} , { "importTimestamp" : "2016-07-28" , "qty" : 15} , { "importTimestamp" : "2016-07-29" , "qty" : 32} , { "importTimestamp" : "2016-07-30" , "qty" : 3} , { "importTimestamp" : "2016-07-31" , "qty" : 11} , { "importTimestamp" : "2016-08-01" , "qty" : 3} , { "importTimestamp" : "2016-08-02" , "qty" : 3} , { "importTimestamp" : "2016-08-04" , "qty" : 16} , { "importTimestamp" : "2016-08-05" , "qty" : 21} , { "importTimestamp" : "2016-08-06" , "qty" : 1} , { "importTimestamp" : "2016-08-07" , "qty" : 4} , { "importTimestamp" : "2016-08-09" , "qty" : 1} , { "importTimestamp" : "2016-08-10" , "qty" : 1} , { "importTimestamp" : "2016-08-11" , "qty" : 18} , { "importTimestamp" : "2016-08-12" , "qty" : 35} , { "importTimestamp" : "2016-08-14" , "qty" : 1} , { "importTimestamp" : "2016-08-15" , "qty" : 2} , { "importTimestamp" : "2016-08-16" , "qty" : 1} , { "importTimestamp" : "2016-08-17" , "qty" : 2} , { "importTimestamp" : "2016-08-18" , "qty" : 90} , { "importTimestamp" : "2016-08-19" , "qty" : 82} , { "importTimestamp" : "2016-08-20" , "qty" : 1} , { "importTimestamp" : "2016-08-21" , "qty" : 4} , { "importTimestamp" : "2016-08-22" , "qty" : 2} , { "importTimestamp" : "2016-08-24" , "qty" : 2} , { "importTimestamp" : "2016-08-25" , "qty" : 74} , { "importTimestamp" : "2016-08-26" , "qty" : 41} , { "importTimestamp" : "2016-08-27" , "qty" : 3} , { "importTimestamp" : "2016-08-29" , "qty" : 13} , { "importTimestamp" : "2016-08-30" , "qty" : 45} , { "importTimestamp" : "2016-08-31" , "qty" : 21} , { "importTimestamp" : "2016-09-01" , "qty" : 61} , { "importTimestamp" : "2016-09-04" , "qty" : 5} , { "importTimestamp" : "2016-09-05" , "qty" : 37} , { "importTimestamp" : "2016-09-06" , "qty" : 1} , { "importTimestamp" : "2016-09-07" , "qty" : 10} , { "importTimestamp" : "2016-09-08" , "qty" : 16} , { "importTimestamp" : "2016-09-09" , "qty" : 10} , { "importTimestamp" : "2016-09-14" , "qty" : 7} , { "importTimestamp" : "2016-09-15" , "qty" : 21} , { "importTimestamp" : "2016-09-16" , "qty" : 8} , { "importTimestamp" : "2016-09-20" , "qty" : 5} , { "importTimestamp" : "2016-09-21" , "qty" : 3} , { "importTimestamp" : "2016-09-22" , "qty" : 17} , { "importTimestamp" : "2016-09-23" , "qty" : 7} , { "importTimestamp" : "2016-09-28" , "qty" : 16} , { "importTimestamp" : "2016-09-29" , "qty" : 16} , { "importTimestamp" : "2016-10-02" , "qty" : 1} , { "importTimestamp" : "2016-10-05" , "qty" : 11} , { "importTimestamp" : "2016-10-06" , "qty" : 3} , { "importTimestamp" : "2016-10-13" , "qty" : 10} , { "importTimestamp" : "2016-10-20" , "qty" : 7} , { "importTimestamp" : "2016-10-30" , "qty" : 2} , { "importTimestamp" : "2017-04-14" , "qty" : 1} , { "importTimestamp" : "2017-04-15" , "qty" : 1}]}}');

            $scope.init();
            $httpBackend.flush();

            expect($scope.series).toEqual(["Planned", "Done", "Canceled", "Blocked", "Revision", "WIP", "Assigned", "Backlog"]);
            expect($scope.data.length).toEqual(8);
            expect($scope.data[0].length).toEqual(29);
            expect($scope.data[0]).toEqual([2510, 2513, 2514, 2578, 2617, 2620, 2620, 2620, 2620, 2620, 2620, 2620, 2620, 2620, 2620, 2806, 2816, 2832, 2842, 2842, 2842, 2842, 2842, 2849, 2870, 2878, 2878, 2878, 2878])
            expect($scope.data[1].length).toEqual(29);
            expect($scope.data[1]).toEqual([1894, 1921, 1922, 1946, 1951, 1951, 1951, 1951, 1951, 1951, 1951, 1951, 1951, 1951, 1951, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[2].length).toEqual(29);
            expect($scope.data[2]).toEqual([1957, 1987, 1988, 2013, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[3].length).toEqual(29);
            expect($scope.data[3]).toEqual([2047, 2074, 2074, 2102, 2108, 2108, 2108, 2108, 2108, 2108, 2108, 2108, 2108, 2108, 2108, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[4].length).toEqual(29);
            expect($scope.data[4]).toEqual([2087, 2114, 2113, 2121, 2128, 2128, 2128, 2128, 2128, 2128, 2128, 2128, 2128, 2128, 2128, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[5].length).toEqual(29);
            expect($scope.data[5]).toEqual([2225, 2244, 2282, 2287, 2289, 2289, 2289, 2289, 2289, 2289, 2289, 2289, 2289, 2289, 2289, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[6].length).toEqual(29);
            expect($scope.data[6]).toEqual([2335, 2341, 2364, 2375, 2377, 2377, 2377, 2377, 2377, 2377, 2377, 2377, 2377, 2377, 2377, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            expect($scope.data[7].length).toEqual(29);
            expect($scope.data[7]).toEqual([2964, 2967, 2968, 2977, 2978, 2978, 2978, 2978, 2978, 2978, 2978, 2978, 2978, 2978, 2978, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
        });
    });

    describe('drawGraph:', function () {
        var workflowService;
        beforeEach(
            inject(function ($injector) {
                // Set up the mock http service responses
                workflowService = $injector.get('workflow');
                workflowService.get = function () {
                    return ['Backlog'];
                }

                // Set the current date to 2016-08-10
                var baseTime = new Date(2016, 7, 10, 12, 0, 0);
                jasmine.clock().mockDate(baseTime);
            })
        );

        it('If there is no value for the first day in status_quantities, the Status Quantities must be set to null until date of first data set', function () {
            var target_quantities = [];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": [
                        { "importTimestamp": "2016-08-08", "qty": 5},
                        { "importTimestamp": "2016-08-09", "qty": 10}
                    ]
                }
            ];

            $scope.date_from = '2016-08-07';
            $scope.date_until = '2016-08-09';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [0, 0, 0],
                [null, 5, 10]
            ]);
        });

        it('If there is a gap in the status_quantities series, it must be filled with the previous value', function () {
            var target_quantities = [];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": [
                        { "importTimestamp": "2016-08-07", "qty": 5},
                        { "importTimestamp": "2016-08-09", "qty": 10}
                    ]
                }
            ];

            $scope.date_from = '2016-08-07';
            $scope.date_until = '2016-08-09';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [0, 0, 0],
                [5, 5, 10]
            ]);
        });

        it('The Status Quantities must have a null value after the current date, even if there is a data set in status_quantities for the future (> 10/08/2016)', function () {
            var target_quantities = [];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": [
                        { "importTimestamp": "2016-08-08", "qty": 5},
                        { "importTimestamp": "2016-08-09", "qty": 10},
                        { "importTimestamp": "2016-08-10", "qty": 10},
                        { "importTimestamp": "2016-08-11", "qty": 10}
                    ]
                }
            ];

            $scope.date_from = '2016-08-08';
            $scope.date_until = '2016-08-11';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [0, 0, 0, 0],
                [5, 10, 10, null]
            ]);
        });

        it('The Status Quantities must continue with the previous value until the current date (=10/08/2016), even if there is no data set in status_quantities for the current date', function () {
            var target_quantities = [];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": [
                        { "importTimestamp": "2016-08-08", "qty": 5},
                        { "importTimestamp": "2016-08-09", "qty": 10}
                    ]
                }
            ];

            $scope.date_from = '2016-08-08';
            $scope.date_until = '2016-08-11';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [0, 0, 0, 0],
                [5, 10, 10, null]
            ]);
        });

        it('If there is no value for the first day in target_quantities, the Planned Quantities must be set to null until date of first data set', function () {
            var target_quantities = [
                { "importTimestamp": "2016-08-08", "qty": 5},
                { "importTimestamp": "2016-08-09", "qty": 10}
            ];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": []
                }
            ];

            $scope.date_from = '2016-08-07';
            $scope.date_until = '2016-08-09';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [0, 5, 10],
                [null, null, null]
            ]);
        });

        it('If there is a gap in the target_quantities series, it must be filled with the previous value', function () {
            var target_quantities = [
                { "importTimestamp": "2016-08-07", "qty": 5},
                { "importTimestamp": "2016-08-09", "qty": 10}
            ];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": []
                }
            ];

            $scope.date_from = '2016-08-07';
            $scope.date_until = '2016-08-09';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [5, 5, 10],
                [null, null, null]
            ]);
        });

        it('The Planned Quantities must continue with the previous value until the current date (=10/08/2016), even if there is no data set in target_quantities for the current date (=today)', function () {
            var target_quantities = [
                { "importTimestamp": "2016-08-09", "qty": 5}
            ];
            var planned_quantities = [];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": []
                }
            ];

            $scope.date_from = '2016-08-09';
            $scope.date_until = '2016-08-10';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [5, 5],
                [null, null]
            ]);
        });

        it('The Planned Quantities must continue with previous value of planned_quantities until end of graph if there are no further data sets', function () {
            var target_quantities = [
            ];
            var planned_quantities = [
                { "importTimestamp": "2016-08-11", "qty": 10}
            ];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": []
                }
            ];

            $scope.date_from = '2016-08-11';
            $scope.date_until = '2016-08-12';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [10, 10],
                [null, null]
            ]);
        });

        it('The Planned Quantities should fall to Zero, if the series of planned_quantities start only after current date (=10/08/2016)', function () {
            var target_quantities = [
                { "importTimestamp": "2016-08-10", "qty": 10}
            ];
            var planned_quantities = [
                { "importTimestamp": "2016-08-12", "qty": 10},
                { "importTimestamp": "2016-08-13", "qty": 5}
            ];
            var status_quantities = [
                { "_id": "Backlog",
                    "quantities": []
                }
            ];

            $scope.date_from = '2016-08-10';
            $scope.date_until = '2016-08-13';

            $scope.drawGraph(status_quantities, target_quantities, planned_quantities);

            expect($scope.series).toEqual(["Planned", "Backlog"]);
            expect($scope.data).toEqual([
                [10, 0, 10,15],
                [null, null, null, null]
            ]);
        });
    });
});
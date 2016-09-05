describe('workflow:', function () {
    var $httpBackend, workflow;

    beforeEach(module('teamforgeChartsApp'));

    beforeEach(
        inject(function ($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');

            // The $controller service is used to create instances of controllers
            workflow = $injector.get('workflow');
        })
    );

    it('workflow should be provided as a plain array and in the same order as provided by MongoDB', function () {
        restheart_config.base_url = 'http://test:8080/test/';
        workflow.setTracker('tracker12345');

        $httpBackend.expectGET("http://test:8080/test/tracker12345_workflows/_aggrs/list").respond(200, '{ "_size" : 4 , "_total_pages" : 1 , "_returned" : 4 , "_embedded" : { "rh:result" : [ { "_id" : "Backlog" , "pos" : 0.0} , { "_id" : "WIP" , "pos" : 0.33} , { "_id" : "Blocked" , "pos" : 0.67} , { "_id" : "Done" , "pos" : 1.0}]}}');

        workflow.fetch();

        $httpBackend.flush();

        expect(workflow.get().length).toEqual(4);
        expect(workflow.get()[0]).toEqual('Backlog');
        expect(workflow.get()[1]).toEqual('WIP');
        expect(workflow.get()[2]).toEqual('Blocked');
        expect(workflow.get()[3]).toEqual('Done');
    });


    it('workflow should be provided in the same order as provided by MongoDB, even if "pos" parameter says otherwise', function () {
        restheart_config.base_url = 'http://test:8080/test/';
        workflow.setTracker('tracker12345');

        $httpBackend.expectGET("http://test:8080/test/tracker12345_workflows/_aggrs/list").respond(200, '{ "_size" : 4 , "_total_pages" : 1 , "_returned" : 4 , "_embedded" : { "rh:result" : [ { "_id" : "Backlog" , "pos" : 1.0} , { "_id" : "WIP" , "pos" : 0.5} , { "_id" : "Blocked" , "pos" : 0.0} , { "_id" : "Done" , "pos" : 0.1}]}}');

        workflow.fetch();

        $httpBackend.flush();

        expect(workflow.get().length).toEqual(4);
        expect(workflow.get()[0]).toEqual('Backlog');
        expect(workflow.get()[1]).toEqual('WIP');
        expect(workflow.get()[2]).toEqual('Blocked');
        expect(workflow.get()[3]).toEqual('Done');
    });});
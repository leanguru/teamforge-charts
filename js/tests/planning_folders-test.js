describe('cfdCtrl:', function () {
    var $httpBackend, planning_folders;

    beforeEach(module('teamforgeChartsApp'));

    beforeEach(
        inject(function ($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');

            // The $controller service is used to create instances of controllers
            planning_folders = $injector.get('planning_folders');
        })
    );

    it('planning_folder should be set to root folder if no planning_folder parameter has been provided', function () {
        restheart_config.base_url = 'http://test:8080/test/';
        planning_folders.setTracker('tracker12345');

        $httpBackend.expectGET("http://test:8080/test/tracker12345_planning_folders/_aggrs/list?pagesize=1000&avars={'planningFolderDepth':3}").respond(200, '{ "_size" : 4 , "_total_pages" : 1 , "_returned" : 4 , "_embedded" : { "rh:result" : [ { "_id" : "A" , "id" : "plan11111" , "parentFolderId" : "PlanningApp10101" , "status" : ""} , { "_id" : "A>B" , "id" : "plan2222" , "parentFolderId" : "plan11111" , "status" : ""} , { "_id" : "C>D" , "id" : "plan44444" , "parentFolderId" : "plan33333" , "status" : ""} , { "_id" : "C" , "id" : "plan33333" , "parentFolderId" : "PlanningApp10101" , "status" : ""}]}}');

        planning_folders.fetch();

        $httpBackend.flush();

        expect(planning_folders.getList()[0]._id).toEqual('[root folder]');
        expect(planning_folders.getList()[0].id).toEqual('PlanningApp10101');
    });
});
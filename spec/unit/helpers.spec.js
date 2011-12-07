QUnit.specify("infuser.js", function(){
    describe("helpers", function(){
        describe("when calling getTemplatePath", function(){
            var result;
            before(function(){
                result = helpers.getTemplatePath("SomeTemplate", {  templateUrl:    infuser.defaults.templateUrl,
                                                                    templateSuffix: infuser.defaults.templateSuffix,
                                                                    templatePrefix: infuser.defaults.templatePrefix });
            });
            it("should return the correct template path", function(){
                assert(result).equals("SomeTemplate.html");
            });
        });
    });
});
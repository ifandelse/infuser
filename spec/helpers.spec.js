QUnit.specify("infuser.js", function(){
    describe("helpers", function(){
        describe("when calling getTemplatePath", function(){
            var result;
            before(function(){
                result = helpers.getTemplatePath("SomeTemplate", infuser.config.templateUrl, infuser.config.templateSuffix, infuser.config.templatePrefix);
            });
            it("should return the correct template path", function(){
                assert(result).equals("SomeTemplate.html");
            });
        });
    });
});
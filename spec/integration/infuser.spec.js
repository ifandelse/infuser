QUnit.specify("infuser.js", function(){
    describe("library", function(){
        before(function(){
            infuser.config.templatePrefix = "tmpl";
            infuser.config.templateUrl = "./templates";
        });
        describe("When retrieving a template synchronously", function(){
            before(function(){
                infuser.getSync("Silly");
            });
            it("Should retrieve a template", function(){
                assert(infuser.store.templates.Silly).isNotNull();
            });
        });
        after(function(){
            infuser.get("Stupid", asyncTest)
        });
    });
});

var asyncTest = function(template){
    var tmpl = template;
    QUnit.specify("infuser.js", function(){
        describe("library", function(){
            describe("When retrieving a template asynchronously", function(){
                it("Should retrieve a template", function(){
                    assert(infuser.store.templates.Stupid).isNotNull();
                });
            });
        });
    });
};
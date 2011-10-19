QUnit.specify("fetcher.js", function(){
    describe("library", function(){
        before(function(){
            fetcher.config.templatePrefix = "tmpl";
            fetcher.config.templateUrl = "./templates";
        });
        describe("When retrieving a template synchronously", function(){
            before(function(){
                fetcher.fetchSync("Silly");
            });
            it("Should retrieve a template", function(){
                assert(fetcher.store.templates.Silly).isNotNull();
            });
        });
        after(function(){
            fetcher.fetch("Stupid", asyncTest)
        });
    });
});

var asyncTest = function(template){
    var tmpl = template;
    QUnit.specify("fetcher.js", function(){
        describe("library", function(){
            describe("When retrieving a template asynchronously", function(){
                it("Should retrieve a template", function(){
                    assert(fetcher.store.templates.Stupid).isNotNull();
                });
            });
        });
    });
};
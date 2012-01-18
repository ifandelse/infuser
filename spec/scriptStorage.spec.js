QUnit.specify("infuser.js", function(){
    describe("scriptStorage", function(){
        describe("when calling storeTemplate", function(){
            before(function(){
                scriptStorage.storeTemplate("SomeTemplate", "<div>This is a silly template...</div>");
            });
            it("should add the template", function(){
                assert(document.getElementById("SomeTemplate")).isNotNull();
            });
            it("should set the template content", function(){
                assert(document.getElementById("SomeTemplate").text).equals("<div>This is a silly template...</div>");
            });
        });
        describe("when calling getTemplate", function(){
            var tmpl;
            before(function(){
                scriptStorage.storeTemplate("AnotherTemplate", "<div>This is another silly template...</div>");
                tmpl = scriptStorage.getTemplate("AnotherTemplate").text;
            });
            it("should get the correct template (text)", function(){
                assert(tmpl).equals("<div>This is another silly template...</div>");
            });
        });
        describe("when calling purge", function(){
            var tmpl, purged = false;
            before(function(){
                if(!purged) {
                    scriptStorage.purge();
                    purged = true;
                }
            });
            it("should purge templates from the DOM", function(){
                assert(document.getElementById("SomeTemplate")).isNull();
                assert(document.getElementById("AnotherTemplate")).isNull();
            });
            it("should clear templateIds array", function(){
                assert(scriptStorage.templateIds.length).equals(0);
            });
        });
    });
});
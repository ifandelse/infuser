QUnit.specify("infuser.js", function(){
    describe("hashStorage", function(){
        describe("when calling storeTemplate", function(){
            before(function(){
                hashStorage.purge();
                hashStorage.storeTemplate("SomeTemplate", "<div>This is a silly template...</div>");
            });
            it("should add the template", function(){
                assert(hashStorage.templates["SomeTemplate"]).isNotNull();
            });
            it("should set the template content", function(){
                assert(hashStorage.templates["SomeTemplate"]).equals("<div>This is a silly template...</div>");
            });
        });
        describe("when calling getTemplate", function(){
            var tmpl;
            before(function(){
                hashStorage.purge();
                hashStorage.storeTemplate("SomeTemplate", "<div>This is a silly template...</div>");
                hashStorage.storeTemplate("AnotherTemplate", "<div>This is another silly template...</div>");
                tmpl = hashStorage.getTemplate("SomeTemplate");
            });
            it("should get the correct template", function(){
                assert(tmpl).equals("<div>This is a silly template...</div>");
            });
        });
        describe("when calling purge", function(){
            var tmpl;
            before(function(){
                hashStorage.purge();
                hashStorage.storeTemplate("SomeTemplate", "<div>This is a silly template...</div>");
                hashStorage.storeTemplate("AnotherTemplate", "<div>This is another silly template...</div>");
                hashStorage.purge();
            });
            it("should purge the templates", function(){
                assert(hashStorage.templates).isSameAs({});
            });
        });
    });
});
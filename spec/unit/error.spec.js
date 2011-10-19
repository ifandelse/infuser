QUnit.specify("fetcher.js", function(){
    describe("error", function(){
        describe("when calling returnErrorTemplate", function(){
            var result,
                expected;
            before(function(){
                expected = "<div style='font-style: italic;'>The template <a href='/templates/SomeTemplate.html'>SomeTemplate</a> could not be loaded. TESTING123</div>";
                result = returnErrorTemplate("TESTING123", "SomeTemplate", "/templates/SomeTemplate.html");
            });
            it("should return valid result", function(){
                assert(expected).equals(result);
            });
        });
    });
});
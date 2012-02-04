/*
// Mockjax isn't support synchronous testing, so commenting it out for now until I determin if I'm keeping "getSync()"
$.mockjax({
    url: './templates/tmplSilly.html',
    dataType: 'html',
    responseText: '<H1>This is just silly</H1>'
});

$.mockjax({
    url: './templates/tmplStupid.html',
    dataType: 'html',
    responseText: '<div><em>And this is just stupid....</em></div>'
});

$.mockjax({
    url: './templates/tmplUnderscore.html',
    dataType: 'html',
    responseText: '<div>The bacon says <%= bacon %></div>'
});*/

module('infuser.js');

test("When retrieving a template synchronously - passing only template ID", function() {
    infuser.store.purge();
    infuser.defaults.templatePrefix = "tmpl";
    infuser.defaults.templateUrl = "./templates";
    infuser.getSync("Silly");
    equal(infuser.store.templates["./templates/tmplSilly.html"],"<H1>This is just silly</H1>", "Template Text Matched Expected");
});

test("When retrieving a template synchronously - passing an options object", function() {
    infuser.store.purge();
    infuser.getSync({
        templateId: "Silly",
        templatePrefix: "tmpl",
        templateUrl: "./templates"
    });
    equal(infuser.store.templates["./templates/tmplSilly.html"],"<H1>This is just silly</H1>", "Template Text Matched Expected");
});

asyncTest("When retrieving a template asynchronously - passing only template ID", function(){
    infuser.store.purge();
    infuser.defaults.templatePrefix = "tmpl";
    infuser.defaults.templateUrl = "./templates";
    infuser.get("Stupid", function(template){
        start();
        equals(infuser.store.templates["./templates/tmplStupid.html"], "<div><em>And this is just stupid....</em></div>", "Stored Template Text Matched Expected");
        equals(template, "<div><em>And this is just stupid....</em></div>", "Param Template Text Matched Expected");
    });
});

asyncTest("When retrieving a template asynchronously - passing an options object", function(){
    infuser.store.purge();
    infuser.get({
        templateId: "Stupid",
        templatePrefix: "tmpl",
        templateUrl: "./templates"
    }, function(template){
        start();
        equals(infuser.store.templates["./templates/tmplStupid.html"], "<div><em>And this is just stupid....</em></div>", "Stored Template Text Matched Expected");
        equals(template, "<div><em>And this is just stupid....</em></div>", "Param Template Text Matched Expected");
    });
});

asyncTest("When calling infuse on static template", function(){
    var loadingTmplTransInTarget,
        loadingTmplTransOutTarget,
        loadingTmplContent,
        bindingModelArg,
        bindingTemplateArg,
        preRenderTargetArg,
        preRenderTmplArg,
        renderTargetArg,
        renderTemplateArg,
        postRenderTargetArg;
    infuser.store.purge();
    infuser.defaults.templatePrefix = "tmpl";
    infuser.defaults.templateUrl = "./templates";
    infuser.infuse("Silly", {
        target: "#nonExistent",
        model: { bacon: "sizzle" },loadingTemplate:    {
            content:        '<div class="infuser-loading">Loading...</div>',
            transitionIn:   function(target) {
                loadingTmplContent = this.content;
                loadingTmplTransInTarget = target;
            },
            transitionOut:  function(target) {
                loadingTmplTransOutTarget = target;
            }
        },
        bindingInstruction:  function(template, model) {
            bindingModelArg = model;
            bindingTemplateArg = template;
            return template;
        },
        preRender: function(target, template) {
            preRenderTargetArg = target;
            preRenderTmplArg = template;
        },
        render:    function(target, template) {
            renderTargetArg = target;
            renderTemplateArg = template;
        },
        postRender: function(target) {
            postRenderTargetArg = target;
            start();
            equals(loadingTmplTransInTarget, "#nonExistent", "Loading Template Transition-In Target Matches Expected");
            equals(loadingTmplTransOutTarget, "#nonExistent", "Loading Template Transition-Out Target Matches Expected");
            equals(loadingTmplContent, '<div class="infuser-loading">Loading...</div>', "Loading Template Content Matches Expected");
            deepEqual(bindingModelArg, { bacon: "sizzle" }, "Model Passed to Binding Instruction Matches Expected");
            equals(bindingTemplateArg, "<H1>This is just silly</H1>", "Template Passed to Binding Instruction Matches Expected");
            equals(preRenderTargetArg, "#nonExistent", "Pre-Render Target Arg Matches Expected");
            equals(preRenderTmplArg, "<H1>This is just silly</H1>", "preRender Template Arg Matches Expected");
            equals(renderTargetArg, "#nonExistent", "render Target Arg Matches Expected");
            equals(renderTemplateArg, "<H1>This is just silly</H1>", "render Template Arg Matches Expected");
            equals(postRenderTargetArg, "#nonExistent", "postRender Target Arg Matches Expected");
        }
    });
});

asyncTest("When calling infuse on an underscore template", function(){
    var loadingTmplTransInTarget,
        loadingTmplTransOutTarget,
        loadingTmplContent,
        bindingModelArg,
        bindingTemplateArg,
        preRenderTargetArg,
        preRenderTmplArg,
        renderTargetArg,
        renderTemplateArg,
        postRenderTargetArg;
    infuser.store.purge();
    infuser.defaults.templatePrefix = "tmpl";
    infuser.defaults.templateUrl = "./templates";
    infuser.infuse("Underscore", {
        target: "#nonExistent",
        model: { bacon: "sizzle" },loadingTemplate:    {
            content:        '<div class="infuser-loading">Loading...</div>',
            transitionIn:   function(target) {
                loadingTmplContent = this.content;
                loadingTmplTransInTarget = target;
            },
            transitionOut:  function(target) {
                loadingTmplTransOutTarget = target;
            }
        },
        bindingInstruction:  function(template, model) {
            bindingModelArg = model;
            bindingTemplateArg = template;
            return _.template(template, model);
        },
        preRender: function(target, template) {
            preRenderTargetArg = target;
            preRenderTmplArg = template;
        },
        render:    function(target, template) {
            renderTargetArg = target;
            renderTemplateArg = template;
        },
        postRender: function(target) {
            postRenderTargetArg = target;
            start();
            equals(loadingTmplTransInTarget, "#nonExistent", "Loading Template Transition-In Target Matches Expected");
            equals(loadingTmplTransOutTarget, "#nonExistent", "Loading Template Transition-Out Target Matches Expected");
            equals(loadingTmplContent, '<div class="infuser-loading">Loading...</div>', "Loading Template Content Matches Expected");
            deepEqual(bindingModelArg, { bacon: "sizzle" }, "Model Passed to Binding Instruction Matches Expected");
            equals(bindingTemplateArg, "<div>The bacon says <%= bacon %></div>", "Template Passed to Binding Instruction Matches Expected");
            equals(preRenderTargetArg, "#nonExistent", "Pre-Render Target Arg Matches Expected");
            equals(preRenderTmplArg, "<div>The bacon says <%= bacon %></div>", "preRender Template Arg Matches Expected");
            equals(renderTargetArg, "#nonExistent", "render Target Arg Matches Expected");
            equals(renderTemplateArg, "<div>The bacon says sizzle</div>", "render Template Arg Matches Expected");
            equals(postRenderTargetArg, "#nonExistent", "postRender Target Arg Matches Expected");
        }
    });
});

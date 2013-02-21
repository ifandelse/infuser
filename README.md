# Infuser

## What is it?
Infuser is a JavaScript library you can use to retrieve templates (or other files) asynchronously (or synchronously, if you must).

## Why would I use it?
* It provides a consistent way to access external view data from the client.
* Choose your own local caching mechanism:
    * Store your templates locally in an in-memory cache
    * Store your templates (if your templating framework requires it) in Script elements in the DOM
    * Or - write your own storage provider
* Keep your templates tidy - If you're using a templating framework like jquery-tmpl or underscore templates, you don't have to keep all of your template/partial content in the same file.  Separate your concerns, and simply pull them on an as-needed basis.
* Have static content you want to request as partials?  Just like templates, just pull them as-needed and attach to the element of your choice.

## How do I use it?
Check out the examples folder in this repository for more details.

JavaScript:

    // Pulling static content
    // When the DOM is ready...
    $(function(){
        infuser.defaults.templateUrl= "./templates",// look for templates in a "templates" directory (relative to this page)
        infuser.defaults.templateSuffix= ".html"    // look for templates with an ".html" suffix (this is a default value, just showing as an example)
        infuser.defaults.templatePrefix = "tmpl_";  // look for templates with a "tmpl_" prefix
        // Now - wire up a click event handler that asynchronously fetches a static html file and appends it to an element
        $('#btnTemplate').click(function(){
            infuser.get("HelloWorld", function(template){
                var tgt = $("#target");
                target.hide().children().remove();
                tgt.append($(template)).fadeIn();
            })
        });
    });
    
    // Pulling a jquery-tmpl
    var model = { names: ["Ronald", "George", "William", "Richard"] };
    $(function(){
        $('#btnTemplate').click(function(){
            infuser.defaults.templateUrl= "./templates",
            infuser.get("Example", function(template){
                var tgt = $("#target");
                target.hide().children().remove();
                var div = $("<div />");
                $.tmpl(template, model).appendTo(div);
                tgt.append(div).fadeIn();
            })
        });
    });

    // Tell infuser how to produce a rendered template with the template engine of your choice
    infuser.defaults.bindingInstruction = function(template, model) {
        return $.tmpl(template, model); //jquery-tmpl
    };

    // The 'infuse' method lets you retrieve, render and attach to the DOM in one call
    // It takes a template name and an options object which can contain:
    // preRender          - called before the template is 'rendered/attached' to the DOM
    // render             - can be used to override the default rendering behavior for infuser
    // postRender         - called after the template is rendered/attached to the DOM
    // model              - option javascript object to be used to bind to a data-driven template
    // useLoadingTemplate - true/false option to display a loading template (defined below)
    // loadingTemplate    - object defining a template that can be displayed while the requested template is retrieved
    //                      "loadingTemplate.content" - html content of the loading template
    //                      "loadingTemplate.transitionIn(target)"  - enables hooks into rendering the loading template
    //                      "loadingTemplate.transitionOut(target)" - enables hooks into how to remove loading template
    // targetSelector     - CSS selector which resolves the target element to be used when rendering the template
    //                      If you don't provide a targetSelector, infuser will try to find a target using the behavior
    //                      defined in infuser.defaults.domTargetResolver (default behavior is finding a DOM element
    //                      with an id matching template name)
    // you can also just pass in the options object and include "templateId" as one of the members
    $('#btnPlain').click(function(){
        infuser.infuse("HelloWorld", { postRender: togglePlain, targetSelector: "#targetPlain" });
    });

    $('#btnFancy').click(function(){
        infuser
            .infuse(
                "Example",
                {
                    targetSelector: "#targetFancy",
                    model: model,
                    preRender: function(target, template) { $(target).children().remove().end().fadeOut().hide(); },
                    render:    function(target, template) { $(target).append(template).slideDown('slow'); },
                    postRender: toggleFancy
                }
        );
    });

## What about dependencies?
Infuser takes a dependency on jQuery (1.5.2 or greater) and Traffic Cop (see https://github.com/ifandelse/trafficcop).

In order to run the samples under the example folder, you need to:

* Install Node.js, and then "npm install".  Then browse to http://localhost/spec/runner.html
* If you're on windows, you could set up a virtual directory under IIS at the top level of this repository (top level, or the script refs will break!)

Test dependencies (pick one & then browse to the spec/runner.html):

* Node.js 
* IIS (set up virtual directory at *root* of repository)
* Other web server (just be sure and configure the hosting from the root of repo)

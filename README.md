# Infuser

## What is it?
Infuser is a JavaScript library you can use to retrieve templates (or other files) asynchronously (or synchronously, if you prefer).

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
        infuser.config.templateUrl= "./templates",// look for templates in a "templates" directory (relative to this page)
        infuser.config.templateSuffix= ".html"    // look for templates with an ".html" suffix (this is a default value, just showing as an example)
        infuser.config.templatePrefix = "tmpl_";  // look for templates with a "tmpl_" prefix
        // Now - wire up a click event handler that asynchronously fetches a static html file and appends it to an element
        $('#btnTemplate').click(function(){
            infuser.get("HelloWorld", function(template){
                $("#target").hide();
                $("#target").children().remove().end();
                $("#target").append($(template)).fadeIn();
            })
        });
    });
    
    // Pulling a jquery-tmpl
    var model = { names: ["Ronald", "George", "William", "Richard"] };
    $(function(){
        $('#btnTemplate').click(function(){
            infuser.config.templateUrl= "./templates",
            infuser.get("Example", function(template){
                $("#target").hide();
                $("#target").children().remove().end();
                var div = $("<div />");
                $.tmpl(template, model).appendTo(div);
                $("#target").append(div).fadeIn();
            })
        });
    });

## What about dependencies?
Infuser takes a dependency on jQuery (1.4 or greater).

In order to run the samples under the example folder, you need to:

* Install Node.js, and then "npm install express".  Then browse to http://localhost:1581
* If you're on windows, you could set up a virtual directory under IIS at the top level of this repository (top level, or the script refs will break!)

Test dependencies (pick one & then browse to the spec/integration/runner.html or spec/unit/runner.html):

* Node.js - run the nodetesthost.js file at root of repository
* IIS (set up virtual directory at *root* of repository)
* Other web server (just be sure and configure the hosting from the root of repo)

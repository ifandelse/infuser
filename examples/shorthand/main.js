var toggled = false,
    toggle = function(target) {
        if(!toggled) {
            $(target).text("The next click will use the locally cached template");
        }
    },
    togglePlain = function() { toggle("#msgPlain"); },
    toggleFancy = function() { toggle("#msgFancy"); },
    model = {
        title: "Dessert Options",
        desserts: [
            "Cheesecake",
            "Cannoli",
            "Milkshake",
            "Brownie",
            "Apple Pie"
        ]
    };

$(function(){
    infuser.config.templateUrl= "./templates",

    $('#btnPlain').click(function(){
        // Shorthand syntax allows you to retrieve the template, and attach to target DOM element all in one call
        infuser.infuse("HelloWorld", $("#targetPlain"), { postRender: togglePlain });
    });

    $('#btnFancy').click(function(){
        // Shorthand syntax also allows you to specify preRender and postRender callbacks, as well as a render override
        infuser.infuse(
            "Example",
            $("#targetFancy"),
            {
                preRender: function(target) { $(target).children().remove().end().fadeOut().hide(); },
                render:    function(target, template) { $(target).append($.tmpl(template, model)).slideDown('slow'); },
                postRender: toggleFancy
            }
        );
    });
});


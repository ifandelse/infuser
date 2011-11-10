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
    infuser.config.templateUrl= "./templates";
    infuser.defaults.useLoadingTemplate = false;
    infuser.defaults.renderInstruction = function(template, model) {
        return $.tmpl(template, model);
    };

    $('#btnPlain').click(function(){
        // Shorthand syntax allows you to retrieve the template, and attach to target DOM element all in one call
        infuser.infuse("HelloWorld", { postRender: togglePlain, targetSelector: "#targetPlain" });
    });

    $('#btnFancy').click(function(){
        // Shorthand syntax also allows you to specify preRender and postRender callbacks, as well as a render override
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
});


var toggled = false,
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
    // pre-loading image for our custom "loading template"
    var loadingImg = $('<img />').attr('src', './images/ajax-loader.gif'),
        origRender = infuser.defaults.render;

    $('#btnTemplate').click(function(){
        infuser.config.templateUrl= "./templates";
        infuser.defaults.loadingTemplate.content = "<div class='infuser-loading'><img src='./images/ajax-loader.gif'>Loading...</div>"
        infuser.defaults.loadingTemplate.transitionOut = function() {};
        infuser.defaults.renderInstruction = function(template, model) {
            return $.tmpl(template, model);
        };
        infuser.infuse("Example", {
            targetSelector: "#target",
            render: function(target, template) {
                // really ugly way to simulate long running template retrieval
                setTimeout(function() { origRender(target, template); }, 4000);
            },
            postRender: function(target) {
                if(!toggled) {
                    $("#msg").text("The next click will use the locally cached template");
                }
            },
            model: model
        });
    });
});

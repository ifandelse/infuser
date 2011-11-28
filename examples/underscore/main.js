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
    $('#btnTemplate').click(function(){
        infuser.config.templateUrl= "./templates";
        // the "infuser.defaults" assignments below could also be passed in
        // to the "infuse" method as part of the options hash (2nd argument)
        // but we're setting the defaults here to show how they could be applied
        // to every template being rendered on the page, with the option of
        // overriding in the options hash passed into "infuse"
        infuser.defaults.bindingInstruction = function(template, model) {
            return _.template(template, model);
        };
        infuser.defaults.preRender = function(target, template) {
            $(target).hide();
            $(target).children().remove().end();
        };
        infuser.defaults.render = function(target, template) {
            $(target).append($(template)).fadeIn();
        };
        infuser.infuse("Example", {
            model: model,
            targetSelector: "#target",
            postRender: function(target) {
                if(!toggled) {
                    $("#msg").text("The next click will use the locally cached template");
                }
            }
        });
    });
});

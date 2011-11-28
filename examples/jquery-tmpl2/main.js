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
    infuser.config.templateUrl= "./templates";
    infuser.defaults = $.extend({}, infuser.defaults, {
        bindingInstruction: function(template, model) {
            return $.tmpl(template, model);
        },
        preRender: function(target, template) {
            $(target).hide().children().remove();
        },
        render: function(target, template) {
            $(target).append(template).fadeIn();
        }
    });

    $('#btnTemplate').click(function(){
        infuser.infuse("Example", {
            model: model,
            render: function(target, template) {
                $(target).append(template).slideDown('slow');
            }
        });
    });
});



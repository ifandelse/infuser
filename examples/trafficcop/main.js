var toggled = false,
    doStuff = function(modelNum) {
        infuser.infuse(
            "Example",
            $("#target"),
            {
                model: menus[modelNum],
                render: function(target, template) {
                    $(target).append(template).slideDown('slow');
                }
            }
        );
    };

$(function(){
    infuser.config.templateUrl= "./templates",
    infuser.config.renderInstruction = function(template, model) {
        return $.tmpl(template, model);
    };

    $('#btnTemplate').click(function(){
        $("#target").children().remove().end().fadeOut().hide();
        for(var i = 0; i < 5; i++) {
            (function(idx) {
                setTimeout(function() {
                    doStuff(idx);
                }, 0);
            })(i);
        }
    });
});

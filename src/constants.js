var NO_OP = function() { },
    defaultRenderOptions = {
        preRender: NO_OP,
        render: function(target, template) {
            if($(target).children().length === 0) {
                $(target).append($(template));
            }
            else {
                $(target).children().replaceWith($(template));
            }
        },
        postRender: NO_OP
    };
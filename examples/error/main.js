var toggled = false;

$(function(){
    $('#btnTemplate').click(function(){
        infuser.config.templateUrl= "./templates",
        infuser.get("HelloWorld", function(template){
            var tgt = $("#target");
            tgt.hide().children().remove();
            tgt.append($(template)).fadeIn();
            if(!toggled) {
                $("#msg").text("The next click will request the template again since the last call failed");
            }
        })
    });
});
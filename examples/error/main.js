var toggled = false;

$(function(){
    $('#btnTemplate').click(function(){
        infuser.config.templateUrl= "./templates",
        infuser.get("HelloWorld", function(template){
            $("#target").hide();
            $("#target").children().remove().end();
            $("#target").append($(template)).fadeIn();
            if(!toggled) {
                $("#msg").text("The next click will request the template again since the last call failed");
            }
        })
    });
});
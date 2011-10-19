var toggled = false;

$(function(){
    $('#btnTemplate').click(function(){
        infuser.config.templateUrl= "./templates",
        infuser.fetch("HelloWorld", function(template){
            $("#target").hide();
            $("#target").children().remove().end();
            $("#target").append($(template)).fadeIn();
            if(!toggled) {
                $("#msg").text("The next click will use the locally cached template");
            }
        })
    });
});
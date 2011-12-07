var toggled = false;

// Note - using "get" is perfectly reasonable, but a more complete approach can be
// seen under the "shorthand" and "trafficcop" examples
$(function(){
    $('#btnTemplate').click(function(){
        infuser.defaults.templateUrl= "./templates",
        infuser.get("HelloWorld", function(template){
            var target = $("#target");
            target.hide().children().remove();
            target.append($(template)).fadeIn();
            if(!toggled) {
                $("#msg").text("The next click will use the locally cached template");
            }
        })
    });
});
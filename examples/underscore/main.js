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
        infuser.config.templateUrl= "./templates",
        infuser.get("Example", function(template){
            $("#target").hide();
            $("#target").children().remove().end();
            _.template(template, model);
            $("#target").append($(_.template(template, model))).fadeIn();
            if(!toggled) {
                $("#msg").text("The next click will use the locally cached template");
            }
        })
    });
});
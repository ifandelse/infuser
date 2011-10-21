var trafficCop = {

    inProgress: {},

    direct: function(reqOptions) {
        var key = reqOptions.type + "_" + reqOptions.dataType + "_" + reqOptions.url,
            self = this;
        if(!self.inProgress[key]) {
            var remove = function() {
                    delete self.inProgress[key];
                },
                traffic = {
                    successCallbacks: [reqOptions.success],
                    errorCallbacks: [reqOptions.error],
                    success: function(response) {
                        $.each($(self.inProgress[key].successCallbacks), function(idx,item){ item(response); });
                        remove();
                    },
                    error: function(exception) {
                        $.each($(self.inProgress[key].errorCallbacks), function(idx,item){ item(exception); });
                        remove();
                    }
                };
            self.inProgress[key] = $.extend({}, reqOptions, traffic);
            $.ajax(self.inProgress[key]);
        }
        else {
            self.inProgress[key].successCallbacks.push(reqOptions.success);
            self.inProgress[key].errorCallbacks.push(reqOptions.error);
        }
    }
};
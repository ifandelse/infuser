var helpers = {
    getTemplatePath: function(templateOptions) {
        var templateFile = templateOptions.templatePrefix + templateOptions.templateId + templateOptions.templateSuffix;
        return templateOptions.templateUrl === undefined || templateOptions.templateUrl === "" ?
                templateFile : templateOptions.templateUrl + "/" + templateFile;
    },
    templateGetSuccess: function(templateId, callback) {
        return function(response) {
            infuser.store.storeTemplate(templateId, response);
            callback(infuser.store.getTemplate(templateId));
        };
    },
    templateGetError: function(templateId, templatePath, callback) {
        return function(exception) {
            if($.inArray(templateId, errors) === -1) {
                errors.push(templateId);
            }
            var templateHtml = returnErrorTemplate("HTTP Status code: " + exception.status, templateId, templatePath);
            infuser.store.storeTemplate(templateId, templateHtml);
            callback(infuser.store.getTemplate(templateId));
        };
    }
};
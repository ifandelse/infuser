var infuser = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    config: {
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: "",
        renderInstruction: function(template, model) { return template; } // NO_OP
    },

    get: function(templateId, callback) {
        var template = this.store.getTemplate(templateId),
            templatePath,
            options;
        if(!template || $.inArray(templateId, errors) !== -1) {
            templatePath = helpers.getTemplatePath(templateId);
            options = {
                        "async": true,
                        "url":templatePath,
                        "dataType": "html",
                        "type": "GET",
                        "success": helpers.templateGetSuccess(templateId, callback),
                        "error"  : helpers.templateGetError(templateId, templatePath, callback)
                      };
            trafficCop.direct(options);
        }
        else {
            callback(template);
        }
    },

    getSync: function(templateId) {
        var template = this.store.getTemplate(templateId),
            templatePath,
            templateHtml,
            options;
        if(!template || $.inArray(templateId, errors) !== -1) {
            templatePath = helpers.getTemplatePath(templateId);
            templateHtml = null;
            options = {
                        "async": false,
                        "url":templatePath,
                        "dataType": "html",
                        "type": "GET",
                        "success": function(response) { templateHtml = response;},
                        "error": function(exception) {
                            if($.inArray(templateId) === -1) {
                                errors.push(templateId);
                            }
                            templateHtml = returnErrorTemplate("HTTP Status code: exception.status", templateId, templatePath);
                        }
                      };
            $.ajax(options);
            if(templateHtml === null) {
                templateHtml = returnErrorTemplate("An unknown error occurred.", templateId, templatePath);
            }
            else {
                this.store.storeTemplate(templateId, templateHtml);
                template = this.store.getTemplate(templateId);
            }
        }
        return template;
    },

    infuse: function(templateId, targetDomElement, renderOptions) {
        var options = $.extend({}, defaultRenderOptions, renderOptions),
            self = this;
        self.get(templateId, function(template) {
            var _template = template;
            options.preRender(targetDomElement, _template);
            _template = self.config.renderInstruction(_template, options.model);
            options.render(targetDomElement, _template);
            options.postRender(targetDomElement);
        });
    }
};
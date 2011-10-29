(function(global, undefined) {
/*
    infuser.js
    Author: Jim Cowart
    License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
    Version 0.1.0
*/
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
var hashStorage = {
    templates: {},

    storeTemplate: function(templateId, templateContent) {
        this.templates[templateId] = templateContent;
    },

    getTemplate: function(templateId) {
        return this.templates[templateId];
    },

    purge: function() {
        this.templates = {};
    }
};
var scriptStorage = {
    templateIds: [],
    storeTemplate: function(templateId, templateContent) {
        var node = document.getElementById(templateId);
        if(node === null) {
            this.templateIds.push(templateId);
            node = document.createElement("script");
            node.type = "text/html";
            node.id = templateId;
            document.body.appendChild(node);
        }
        node.text = templateContent;
    },

    getTemplate: function(templateId) {
        return document.getElementById(templateId);
    },

    purge: function() {
        for(var i = 0; i < this.templateIds.length; i++) {
            document.body.removeChild(document.getElementById(this.templateIds[i]));
        }
        this.templateIds = [];
    }
};
var errorHtml = "<div class='infuser-error'>The template <a href='{TEMPLATEURL}'>{TEMPLATEID}</a> could not be loaded. {STATUS}</div>",
    returnErrorTemplate = function(status, templateId, templatePath) {
        return errorHtml.replace('{STATUS}', status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
    },
    errors = [];
var helpers = {
    getTemplatePath: function(templateId) {
        var templateFile = infuser.config.templatePrefix + templateId + infuser.config.templateSuffix;
        return infuser.config.templateUrl === undefined || infuser.config.templateUrl === "" ?
                templateFile : infuser.config.templateUrl + "/" + templateFile;
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
        renderInstruction: function(template, model) { return template; }, // NO_OP
        domTargetResolver: function(templateId) { return "#" + templateId } // DEFAULT MAPPING
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

    infuse: function(templateId, renderOptions) {
        var options = $.extend({}, defaultRenderOptions, renderOptions),
            self = this,
            targetElement = options.targetSelector || self.config.domTargetResolver(templateId);
        self.get(templateId, function(template) {
            var _template = template;
            options.preRender(targetElement, _template);
            _template = self.config.renderInstruction(_template, options.model);
            options.render(targetElement, _template);
            options.postRender(targetElement);
        });
    }
};
global.infuser = infuser; })(window);
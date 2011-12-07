(function($, global, undefined) {
/*
    infuser.js
    Author: Jim Cowart
    License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
    Version 0.1.0
*/
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
    getTemplatePath: function(templateId, templateOptions) {
        var templateFile = templateOptions.templatePrefix + templateId + templateOptions.templateSuffix;
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
var infuser = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    defaults: {
        bindingInstruction:  function(template, model) { return template; }, // NO_OP effectively by default
        loadingTemplate:    {
            content:        '<div class="infuser-loading">Loading...</div>',
            transitionIn:   function(target) {
                var self = this,
                tgt = $(target);
                tgt.hide();
                tgt.html(self.content);
                tgt.fadeIn();
            },
            transitionOut:  function(target) {
                $(target).html("");
            }
        },
        postRender: function(targetElement) { }, // NO_OP effectively by default
        preRender: function(targetElement, template) { }, // NO_OP effectively by default
        render: function(target, template) {
            var tgt = $(target);
            if(tgt.children().length === 0) {
                tgt.append($(template));
            }
            else {
                tgt.children().replaceWith($(template));
            }
        },
        target:  function(templateId) { return "#" + templateId }, // DEFAULT MAPPING
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: "",
        useLoadingTemplate: true // true/false
    },

    get: function(templateId, callback, tmplOptions) {
        var self = this,
            templateOptions,
            template = this.store.getTemplate(templateId),
            templatePath,
            options;
        if(!template || $.inArray(templateId, errors) !== -1) {
            templateOptions = $.extend({}, { templateUrl: self.defaults.templateUrl, templateSuffix: self.defaults.templateSuffix, templatePrefix: self.defaults.templatePrefix }, tmplOptions);
            templatePath = helpers.getTemplatePath(templateId, templateOptions);
            options = {
                        "async": true,
                        "url":templatePath,
                        "dataType": "html",
                        "type": "GET",
                        "success": helpers.templateGetSuccess(templateId, callback),
                        "error"  : helpers.templateGetError(templateId, templatePath, callback)
                      };
            $.trafficCop(options);
        }
        else {
            callback(template);
        }
    },

    getSync: function(templateId, tmplOptions) {
        var self = this,
            templateOptions,
            template = this.store.getTemplate(templateId),
            templatePath,
            templateHtml,
            options;
        if(!template || $.inArray(templateId, errors) !== -1) {
            templateOptions = $.extend({}, { templateUrl: self.defaults.templateUrl, templateSuffix: self.defaults.templateSuffix, templatePrefix: self.defaults.templatePrefix }, tmplOptions);
            templatePath = helpers.getTemplatePath(templateId, templateOptions);
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
        var self = this,
            options = $.extend({}, self.defaults, renderOptions),
            targetElement = typeof options.target === 'function' ? options.target(templateId) : options.target;
        if(options.useLoadingTemplate) {
            options.loadingTemplate.transitionIn(targetElement);
        }
        self.get(templateId, function(template) {
            var _template = template;
            options.preRender(targetElement, _template);
            _template = options.bindingInstruction(_template, options.model);
            if(options.useLoadingTemplate) {
                options.loadingTemplate.transitionOut(targetElement);
            }
            options.render(targetElement, _template);
            options.postRender(targetElement);
        }, { templateUrl: options.templateUrl, templateSuffix: options.templateSuffix, templatePrefix: options.templatePrefix });
    }
};
global.infuser = infuser; })(jQuery, window);
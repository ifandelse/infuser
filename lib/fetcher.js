(function(global, undefined) {
/*
    fetcher.js
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
var errorHtml = "<div class='fetcher-error'>The template <a href='{TEMPLATEURL}'>{TEMPLATEID}</a> could not be loaded. {STATUS}</div>",
    returnErrorTemplate = function(status, templateId, templatePath) {
        return errorHtml.replace('{STATUS}', status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
    },
    errors = [];
var helpers = {
    getTemplatePath: function(templateId) {
        var templateFile = fetcher.config.templatePrefix + templateId + fetcher.config.templateSuffix;
        return fetcher.config.templateUrl === undefined || fetcher.config.templateUrl === "" ?
                templateFile : fetcher.config.templateUrl + "/" + templateFile;
    },
    templateGetSuccess: function(templateId, callback) {
        return function(response) {
            fetcher.store.storeTemplate(templateId, response);
            callback(fetcher.store.getTemplate(templateId));
        };
    },
    templateGetError: function(templateId, templatePath, callback) {
        return function(exception) {
            if($.inArray(templateId, errors) === -1) {
                errors.push(templateId);
            }
            var templateHtml = returnErrorTemplate("HTTP Status code: " + exception.status, templateId, templatePath);
            fetcher.store.storeTemplate(templateId, templateHtml);
            callback(fetcher.store.getTemplate(templateId));
        };
    }
};
var fetcher = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    config: {
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: ""
    },

    fetch: function(templateId, callback) {
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
            $.ajax(options);
        }
        else {
            callback(template);
        }
    },

    fetchSync: function(templateId) {
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
    }
};
global.fetcher = fetcher; })(window);
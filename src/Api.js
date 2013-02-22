var infuser = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    defaults: {
        // Template name conventions
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: "",
	    templatePreProcessor: function(x) { return x },
        // AJAX Options
        ajax: {
            "async": true,
            "dataType": "html",
            "type": "GET"
        },
        // infuse() specific options - NOT used for "get" or "getSync"
        target:  function(templateId) { return "#" + templateId }, // DEFAULT MAPPING
        loadingTemplate:    {
                                content:        '<div class="infuser-loading">Loading...</div>',
                                transitionIn:   function(target, content) {
                                                    var tgt = $(target);
                                                    tgt.hide();
                                                    tgt.html(content);
                                                    tgt.fadeIn();
                                                },
                                transitionOut:  function(target) {
                                                    $(target).html("");
                                                }
                            },
        postRender:         function(targetElement) { }, // NO_OP effectively by default
        preRender:          function(targetElement, template) { }, // NO_OP effectively by default
        render:             function(target, template) {
                                var tgt = $(target);
                                if(tgt.children().length === 0) {
                                    tgt.append($(template));
                                }
                                else {
                                    tgt.children().replaceWith($(template));
                                }
                            },
        bindingInstruction:  function(template, model) { return template; }, // NO_OP effectively by default
        useLoadingTemplate: true // true/false
    },

    get: function(options, callback) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options })),
            template; 
        templateOptions.ajax.url = helpers.getTemplatePath(templateOptions);
        template = infuser.store.getTemplate(templateOptions.ajax.url);
        if(!template || $.inArray(templateOptions.ajax.url, errors) !== -1) {
            templateOptions.ajax.success = helpers.templateGetSuccess(templateOptions.ajax.url, callback);
            templateOptions.ajax.error = helpers.templateGetError(templateOptions.templateId, templateOptions.ajax.url, callback);
            trafficCop(templateOptions.ajax);
        }
        else {
            callback(template);
        }
    },

    getSync: function(options) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options }), { ajax: { async: false } }),
            template,
            templateHtml;
        templateOptions.ajax.url = helpers.getTemplatePath(templateOptions);
        template = infuser.store.getTemplate(templateOptions.ajax.url);
        if(!template || $.inArray(templateOptions.ajax.url, errors) !== -1) {
            templateHtml = null;
            templateOptions.ajax.success = function(response) { templateHtml = response; };
            templateOptions.ajax.error = function(exception) {
                if($.inArray(templateOptions.ajax.url) === -1) {
                    errors.push(templateOptions.ajax.url);
                }
                templateHtml = returnErrorTemplate("HTTP Status code: exception.status", templateOptions.templateId, templateOptions.ajax.url);
            };
            $.ajax(templateOptions.ajax);
            if(templateHtml === null) {
                templateHtml = returnErrorTemplate("An unknown error occurred.", templateOptions.templateId, templateOptions.ajax.url);
            }
            else {
                infuser.store.storeTemplate(templateOptions.ajax.url, templateHtml);
                template = infuser.store.getTemplate(templateOptions.ajax.url);
            }
        }
        return template;
    },

    infuse: function(templateId, renderOptions) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof templateId === "object" ? templateId : renderOptions), (typeof templateId === "string" ? { templateId: templateId } : undefined )),
            targetElement = typeof templateOptions.target === 'function' ? templateOptions.target(templateId) : templateOptions.target;
        if(templateOptions.useLoadingTemplate) {
            templateOptions.loadingTemplate.transitionIn(targetElement, templateOptions.loadingTemplate.content);
        }
        infuser.get(templateOptions, function(template) {
            var _template = template;
            templateOptions.preRender(targetElement, _template);
            _template = templateOptions.bindingInstruction(_template, templateOptions.model);
            if(templateOptions.useLoadingTemplate) {
                templateOptions.loadingTemplate.transitionOut(targetElement);
            }
            templateOptions.render(targetElement, _template);
            templateOptions.postRender(targetElement);
        });
    }
};

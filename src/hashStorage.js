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
directory.PlayerView = Backbone.View.extend({

    initialize: function () {
        console.log("PlayerView loaded");
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }

});
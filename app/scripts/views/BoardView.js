/* global App */

(function() {
    'use strict';

    App.BoardView = Backbone.View.extend({
        tagName: 'table',

        className: 'board',

        collection: null,

        edge: 0,

        cpu: null,

        cellViews: null,

        initialize: function(options) {
            var edge = this.edge = options.edge;
            this.collection = new App.CellCollection(false, {
                edge: edge
            });
            this.collection.setInitialReversi();
            this.cpu = new App.CPUModel({
                collection: this.collection
            });
            this.listenTo(App.mediator, 'board:render', this.renderBoard);
        },

        render: function() {
            App.mediator.trigger('board:render');
            App.mediator.trigger('cell:render');
            return this;
        },

        renderBoard: function() {
            this.$el.empty();

            var edge = this.edge;
            var rows = [];

            for (var i = 0; i < edge; i++) {
                var $tr = $('<tr>');
                var cells = [];
                for (var j = 0; j < edge; j++) {
                    var view = this.getCellView(i, j);
                    cells.push(view.render().$el);
                }
                rows.push($tr.append(cells));
            }

            this.$el.append(rows);
        },

        getCellView: function(i, j) {
            var cellViews = this.getCellViews();
            return cellViews[i][j];
        },

        getCellViews: function() {
            if (this.cellViews) {
                return this.cellViews;
            }
            var cellViews = [];
            var edge = this.edge;

            for (var i = 0; i < edge; i++) {
                cellViews[i] = [];
                for (var j = 0; j < edge; j++) {
                    cellViews[i][j] = new App.CellView({
                        model: this.collection.search(j, i),
                        cpu: this.cpu
                    });
                }
            }
            this.cellViews = cellViews;
            return cellViews;
        }
    });
})();

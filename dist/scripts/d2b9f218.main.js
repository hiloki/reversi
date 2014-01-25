!function(){"use strict";_.mixin({selectAtRandom:function(a){return _.isArray(a)?a.length?a[_.random(a.length-1)]:null:null}})}();var App={};App.mediator=_.extend({},Backbone.Events),function(){"use strict";App.CPUStrategy={};var a=Backbone.Model.extend({cells:null,color:null,collection:null,initialize:function(a){this.cells=a.cells,this.color=a.color,this.collection=a.collection},select:function(a){if(!this.cells.length)return null;var b=this.cells;if(_.isArray(a))for(var c=0,d=a.length;d>c;c++){var e=a[c];e=_.bind(e,{cells:b,color:this.color,collection:this.collection})();var f=e.cells;if(!f.length)break;b=f}return _.selectAtRandom(b)},notEdge:function(){return this.cells=_.filter(this.cells,function(a){return!a.isEdge()}),this},edge:function(){return this.cells=_.filter(this.cells,function(a){return a.isEdge()}),this},corner:function(){return this.cells=_.filter(this.cells,function(a){return a.isCorner()}),this},aroundCorner:function(){return this.cells=_.filter(this.cells,function(a){return a.isAroundCorner()}),this},_createReversiMap:function(){var a=this.color,b={};return _.each(this.cells,function(c){var d=c.countReverse(a);b[d]||(b[d]=[]),b[d].push(c)}),b},mostReversable:function(){var a=this._createReversiMap(),b=_.max(_.keys(a));return this.cells=a[b],this},leastReversable:function(){var a=this._createReversiMap(),b=_.max(_.keys(a));return this.cells=a[b],this},starPosition:function(){return this.cells=_.filter(this.cells,function(a){return a.isStarPosition()}),this}});App.CPUStrategy.StrategyModel=Backbone.Model.extend({initialize:function(a){this.collection=a.collection},selectCell:function(){throw"Not implements selectCell"},putReversi:function(a){var b=this.collection.getCandidates(a);if(!b.length)return!1;var c=this.selectCell(a,b);return c?c.putReversi(a):!1},strategy:function(b,c){return new a({collection:this.collection,cells:c,color:b})}})}(),function(){"use strict";App.CPUStrategy.EasyStrategyModel=App.CPUStrategy.StrategyModel.extend({selectCell:function(a,b){var c=this.collection,d=c.edge,e=this.strategy(a,b);return c.countReversies()<d*d/4?e.mostReversable():e.leastReversable(),e.select([e.starPosition,e.aroundCorner,e.notEdge])}})}(),function(){"use strict";App.CPUStrategy.HardStrategyModel=App.CPUStrategy.StrategyModel.extend({putReversi:function(){}})}(),function(){"use strict";App.CPUStrategy.NormalStrategyModel=App.CPUStrategy.StrategyModel.extend({selectCell:function(a,b){var c={};_.each(b,function(b){var d=b.countReverse(a);c[d]||(c[d]=[]),c[d].push(b)});var d;d=collection.countReversies()<edge*edge/2?_.min(_.keys(c)):_.max(_.keys(c));var b=c[d],e=_.max(_.keys(c)),f=c[e];return _.selectAtRandom(f)}})}(),function(){"use strict";var a=App.CPUStrategy,b={easy:"easy",normal:"normal",hard:"hard"};App.CPUModel=Backbone.Model.extend({strategies:null,strategy:null,defaults:function(){return{level:b.easy}},validate:function(a){return _.indexOf(b,a.level)?"Invalid level: "+a.level:void 0},initialize:function(c){var d=c.collection,e=b;this.strategies=[],this.strategies[e.easy]=new a.EasyStrategyModel({collection:d}),this.strategies[e.normal]=new a.NormalStrategyModel({collection:d}),this.strategies[e.hard]=new a.HardStrategyModel({collection:d}),this.setLevel(c.level)},putReversi:function(a){return this.getStrategy().putReversi(a)},setLevel:function(a){this.set("level",a,{validate:!0}),this.strategy=this.strategies[a]},getStrategy:function(){return this.strategy||this.setLevel(this.get("level")),this.strategy}},{levels:b})}(),function(){"use strict";var a="black",b="white",c="none";App.ReversiModel=Backbone.Model.extend({cell:null,initialize:function(a){this.set("color",c,{slient:!0}),this.cell=a.cell},getColor:function(){return this.get("color")},setColor:function(a){return a===this.get("color")?!0:App.ReversiModel.validColor(a)?(this.set("color",a),!0):!1},hasColor:function(a){return a?this.get("color")===a:this.get("color")!==c},toggle:function(){return this.getColor()===a?this.setColor(b):this.getColor()===b?this.setColor(a):void 0},hasDifferentColor:function(c){return c===b?this.get("color")===a:c===a?this.get("color")===b:!1}},{colorCode:{black:a,white:b,none:c},validColor:function(a){return _.indexOf(_.values(this.colorCode),a)>-1}})}(),function(){"use strict";App.CellModel=Backbone.Model.extend({row:0,col:0,reversi:null,initialize:function(a){a=_.extend({row:0,col:0},a),this.row=a.row,this.col=a.col,this.reversi=new App.ReversiModel({cell:this})},putReversi:function(a,b){return b=_.extend({validation:!0,reverse:!0},b),console.log("Set reversi (row, col) = ("+this.row+","+this.col+") color:"+a),b.validation&&this.hasReversi()?!1:b.reverse&&!this.reverse(a)&&b.validation?!1:this.reversi.setColor(a)},putBlackReversi:function(){return this.reversi.setColor(App.ReversiModel.colorCode.black)},putWhiteReversi:function(){return this.reversi.setColor(App.ReversiModel.colorCode.white)},hasReversi:function(){return this.reversi.hasColor()},getPoint:function(a){return a?{row:this.row,col:this.col}:[this.row,this.col]},getColor:function(){return this.reversi.getColor()},reverse:function(a){for(var b=[{row:-1,col:-1},{row:-1,col:0},{row:-1,col:1},{row:0,col:-1},{row:0,col:1},{row:1,col:-1},{row:1,col:0},{row:1,col:1}],c=0,d=0,e=b.length;e>d;d++){var f=b[d];this.countReverseToVector(f,a)>0&&(c+=this.toggleRecursively(f,a))}return c>0},countReverse:function(a){for(var b=[{row:-1,col:-1},{row:-1,col:0},{row:-1,col:1},{row:0,col:-1},{row:0,col:1},{row:1,col:-1},{row:1,col:0},{row:1,col:1}],c=0,d=0,e=b.length;e>d;d++){var f=b[d];c+=this.countReverseToVector(f,a)}return c},canPutReversi:function(a){return!this.hasReversi()&&this.countReverse(a)>0},countReverseToVector:function(a,b){var c=!0,d=_.bind(function(a,b,e){var f=a.row+b.row,g=a.col+b.col,a=this.collection.search(f,g);return a?a.hasReversi()?a.reversi.hasDifferentColor(e)?1+d(a,b,e):0:(c=!1,0):(c=!1,0)},this),e=d(this,a,b);return c?e:!1},toggleRecursively:function(a,b){var c=_.bind(function(a,b,d){var e=a.row+b.row,f=a.col+b.col,a=this.collection.search(e,f);return a&&a.hasReversi()&&a.reversi.hasDifferentColor(d)?(a.reversi.toggle(),1+c(a,b,d)):0},this);return c(this,a,b)},isCandidate:function(a){var b=this.collection.getCandidates(a);return _.indexOf(b,this)>-1},isEdge:function(){var a=this.collection.edge-1;return 0===this.row||this.row===a||0===this.col||this.col===a},isCorner:function(){var a=this.collection.edge-1;return 0===this.row&&0===this.col||0===this.row&&this.col===a||this.row===a&&0===this.col||this.row===a&&this.col===a},isAroundCorner:function(){var a=this.collection.edge-1;return this.isStarPosition()||0===this.row&&1===this.col||1===this.row&&0===this.col||this.row===a-1&&0===this.col||this.row===a&&1===this.col||0===this.row&&this.col===a-1||1===this.row&&this.col===a||this.row===a-1&&this.col===a||this.row===a&&this.col===a-1},isStarPosition:function(){var a=this.collection.edge-1;return 1===this.row&&1===this.col||1===this.row&&this.col===a-1||this.row===a-1&&1===this.col||this.row===a-1&&this.col===a-1},toString:function(){return"(row, col) = ("+this.row+","+this.col+")"}})}(),function(){"use strict";var a=App.ReversiModel.colorCode;App.CellCollection=Backbone.Collection.extend({model:App.CellModel,edge:0,initialize:function(a,b){var c=this.edge=b.edge;a=[];for(var d=0;c>d;d++)for(var e=0;c>e;e++)a.push(new App.CellModel({row:d,col:e}));this.reset(a,_.extend({silent:!0},b)),this.setInitialReversi()},setInitialReversi:function(){var b=this.edge;this.addReversi(b/2-1,b/2-1,a.black),this.addReversi(b/2-1,b/2,a.white),this.addReversi(b/2,b/2-1,a.white),this.addReversi(b/2,b/2,a.black)},addReversi:function(a,b,c){var d=this.search(a,b);return d?d.putReversi(c,{validation:!1,reverse:!1}):!1},isFullReversi:function(){return this.countReversies()===this.edge*this.edge},isOnlyColor:function(){return this.isOnly(a.black)||this.isOnly(a.white)},isOnly:function(a){return this.countReversies(a)===this.countReversies()},putReversi:function(a,b){var c=this.search(a,b);return c?c.putReversi(color):!1},search:function(a,b){var c=this.filter(function(c){return c.row===a&&c.col===b});return c.length?c[0]:null},getCellsPuttingReversi:function(){return this.filter(function(a){return a.hasReversi()})},getReversies:function(a){var b=this.getCellsPuttingReversi(),c=_.map(b,function(a){return a.reversi});return a?_.filter(c,function(b){return b.getColor()===a}):c},countReversies:function(a){return this.getReversies(a).length},getCandidates:function(a){return this.filter(function(b){return b.canPutReversi(a)})},countCandidates:function(a){return this.getCandidates(a).length}})}(),function(){"use strict";App.ReversiView=Backbone.View.extend({tagName:"div",className:"reversi",model:null,render:function(){if(this.$el.removeClass(),this.model.hasColor()){var a=this.model.getColor();this.$el.addClass(a)}return this.$el.addClass(this.className),this},renderCandidate:function(){this.model.cell.isCandidate(playerColor)&&this.$el.append('<div class="candidate"></div>')}})}(),function(){"use strict";var a=App.ReversiModel.colorCode,b=a.black,c=a.white;App.CellView=Backbone.View.extend({tagName:"td",className:"cell",isGameEnd:!1,model:null,cpu:null,reversiView:null,events:{click:"onClick"},initialize:function(a){a=_.extend({cpu:null},a),this.reversiView=new App.ReversiView({model:this.model.reversi}),this.cpu=a.cpu,this.listenTo(App.mediator,"cell:render",this.render)},onClick:function(a){a.stopPropagation(),this.checkGameEnd()||(this.putReversi(),App.mediator.trigger("cell:render"))},putReversi:function(){this.model.putReversi(b)&&(this.checkGameEnd()||this.putReversiByCPU())},putReversiByCPU:function(){return this.checkGameEnd()?!1:this.cpu.putReversi(c)?(this.checkGameEnd()||0===this.model.collection.countCandidates(b)&&(this.cannotPutPlayerReversi(),this.putReversiByCPU()),void 0):(this.cannotPutCPUReversi(),void 0)},checkGameEnd:function(){var a=this.model.collection;return this.isGameEnd?!0:a.isFullReversi()||a.isOnlyColor()?(this.finishGame(),this.isGameEnd=!0,!0):!1},finishGame:function(){var a=this.model.collection,d=a.countReversies(b),e=a.countReversies(c),f=d>e?"あなたの勝ちです。":e>d?"CPUの勝ちです。":"引き分けです。",g="ゲームが終了しました。\nあなた: "+d+"\nCPU:    "+e+"\n"+f;alert(g)},cannotContinueGame:function(){var a=function(a){var b="オセロが一色のみになったのでゲームを終了します。\n"+a;return alert(b),!0};return collection.isOnly(c)?(a("あなたの勝ちです。"),!0):collection.isOnly(b)?(a("あなたの負けです。"),!0):!1},cannotPutPlayerReversi:function(){this.isGameEnd||alert("あなたの番ですがオセロが置けません。CPUの番です。")},cannotPutCPUReversi:function(){this.isGameEnd||alert("CPUのオセロが置けません。あなたの番です。")},render:function(){return this.$el.empty(),this.$el.append(this.reversiView.render().el),this.model.isCandidate(b)&&this.$el.append('<div class="candidate"></div>'),this}})}(),function(){"use strict";App.BoardView=Backbone.View.extend({tagName:"table",className:"board",collection:null,edge:0,cpu:null,initialize:function(a){var b=this.edge=a.edge;this.collection=new App.CellCollection(!1,{edge:b}),this.cpu=new App.CPUModel({collection:this.collection}),this.listenTo(App.mediator,"board:render",this.renderBoard)},render:function(){return App.mediator.trigger("board:render"),App.mediator.trigger("cell:render"),this},renderBoard:function(){this.$el.empty();for(var a=this.edge,b=[],c=0;a>c;c++){for(var d=$("<tr>"),e=[],f=0;a>f;f++){var g=new App.CellView({model:this.collection.search(f,c),cpu:this.cpu});e.push(g.render().$el)}b.push(d.append(e))}this.$el.append(b)}})}(),function(){"use strict";App.SettingView=Backbone.View.extend({el:"#settings",cpu:null,initialize:function(a){this.cpu=new App.CPUModel({collection:a.collection}),_.bindAll(this,"changeLevel")},events:{"click #setting input[name=level]":"changeLevel"},changeLevel:function(a){var b=this.$(a.target).val();this.cpu.setLevel(b)}})}(),function(){"use strict";App.AppView=Backbone.View.extend({el:"#main",render:function(){this.boardView=new App.BoardView({edge:8}),this.$("#board").append(this.boardView.render().$el),this.settingView=new App.SettingView({collection:this.boardView.collection})}})}(),function(){"use strict";App.exports={};var a=new App.AppView;a.render(),App.exports.view=a}();
/*
game

* start
prepare questions map, { tris: num, squares: num, gauge: [num1, num2] }
create array of stages
*/

var Game= function (opts) {
	this.opts= opts || {};
	this.prepareQues();
}

Game.prototype.prepareQues = function() {
	var self= this;
	var questions= [];
	for (var i = 0; i < self.opts.TOTAL_QUES; i++) {
		questions.push({
			tris: getRandomIntInclusive(self.opts.TRI_RANGE[0], self.opts.TRI_RANGE[1]),
			squares: getRandomIntInclusive(self.opts.SQ_RANGE[0], self.opts.SQ_RANGE[1]),
			gauge: [getRandomIntInclusive(1,7), getRandomIntInclusive(1,7)]
		})
	};
	self.questions= questions;
};


/*
## start the game
* control all stages

## stages
* [init] show questions, tris,sqs,two panels
* one sec -> trigger [ask]
* [ask] show form to ask
* click fin -> trigger [done]
* [done] collect the answers -> trigger [next]
*/
Game.prototype.start = function() {
	var self= this;
	self.setupStages();

	// start first stage
	self.stages[0].init();
};

Game.prototype.setupStages = function() {
	var self= this;
	var stages= [];
	for (var i = 0; i < self.questions.length; i++) {
		var stage= new Stage({ 
			question: self.questions[i], 
			index: i, 
			delay: self.opts.TIME_TO_STAY,
			game: self
		});
		stages.push(stage);
	};

	// set next
	for (var i = 0; i < stages.length; i++) {
		// if last element
		if(i==stages.length-1){
			stages[i].setFin();
		}else{
			stages[i].setNextStage(stages[i+1]);
		}
	};
	self.stages= stages;
};


Game.prototype.getStats = function() {
	var tris= 0;
	var squares= 0;
	var gauge= [0,0];
	this.stages.forEach(function (stage) {
		var corr= stage.getCorrects();
		tris += corr.tris;
		squares += corr.squares;
		for (var i = 0; i < gauge.length; i++) {
			gauge[i] += corr.gauge[i];
		};
	})
	return {
		tris: tris,
		squares: squares,
		gauge: gauge
	}
};

Game.prototype.finish = function(game) {
	// game is finish
	// show some stat
	var self= game;
	var $main= $("#main");
	// setup
	$main.empty();
	var source= $("#stat-template").html();
	var template= Handlebars.compile(source);
	var stats= self.getStats();
	for(key in stats){
		if(key=='tris')
			var html= template({ title: "三角形", num: stats[key], all: self.opts.TOTAL_QUES });
		else if(key=='squares')
			var html= template({ title: "正方形", num: stats[key], all: self.opts.TOTAL_QUES });
		else if(key=='gauge'){
			var html= "<section>";
			stats[key].forEach(function (gauge, i) {
				html += template({ title: "儀錶"+(i+1), num: gauge, all: self.opts.TOTAL_QUES })
			})
			html += "</section>"
		}
		$main.append(html)
	}
};


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
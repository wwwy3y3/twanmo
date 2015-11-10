/*
## stage have different phase
questions map, { tris: num, squares: num, gauge: [num1, num2] }

* init
remove #main
add canvas, draw shapes
add panels

* finish
clear, panel display none, show question form on html, 

## flows
* [init] show questions, tris,sqs,two panels
* one sec -> trigger [ask]
* [ask] show form to ask
* click fin -> trigger [done]
* [done] collect the answers -> trigger [next]
*/

var Stage= function (opts) {
	// stage
	this.opts= opts || {};
	this.game= this.opts.game;
	this.answers= { tris: 0, squares: 0, gauge: [0,0] }
	this.delay= this.opts.delay;
	this.index= this.opts.index;
	this.question= this.opts.question;
	this.canvasId= "stage-"+this.index+"-canvas";
	this.gaugeOneId= "gauge-one-"+this.index;
	this.gaugeTwoId= "gauge-two-"+this.index;
}

Stage.prototype.init = function() {
	var self= this;
	var $main= $("#main");

	// setup
	$main.empty();
	var source= $("#stage-template").html();
	var template= Handlebars.compile(source);
	$main.html(template({
		index: self.index
	}))

	// add canvas
	// draw
	self.draw(self.question.squares, self.question.tris);

	// setup gauges
	self.setGauge(self.gaugeOneId, self.question.gauge[0]);
	self.setGauge(self.gaugeTwoId, self.question.gauge[1]);

	// delay for one sec
	return Promise.delay(self.delay)

	// show ask
	.then(function () {
		return self.ask();
	})
};

Stage.prototype.draw = function(squares, tris) {
	var drawer= new Drawer(this.canvasId);
	drawer.draw(squares, tris);
};

Stage.prototype.setGauge = function(gaugeDiv, number) {
	var chart = AmCharts.makeChart( gaugeDiv, {
	  "type": "gauge",
	  "theme": "light",
	  "startDuration": 0,
	  "marginTop": 20,
	  "marginBottom": 50,
	  "axes": [ {
	    "axisAlpha": 0.3,
	    "endAngle": 360,
	    "startValue": -1,
	    "endValue": 7,
	    "minorTickInterval": 0.2,
	    "showFirstLabel": false,
	    "startAngle": 0,
	    "axisThickness": 1,
	    "valueInterval": 1
	  } ],
	  "arrows": [ {
	    "radius": "50%",
	    "innerRadius": 0,
	    "nailRadius": 10,
	    "nailAlpha": 1,
	    "value": number
	  }],
	  "export": {
	    "enabled": true
	  }
	} );
};

/*
[ask] show form to ask
submit
collect answers
*/
Stage.prototype.ask = function() {
	var self= this;
	var ans= self.answers;
	var $main= $("#main");

	// setup
	$main.empty();
	var source= $("#ask-template").html();
	var template= Handlebars.compile(source);
	$main.html(template({
		index: self.index
	}))

	$('#ask-form').submit(function (e) {
		e.preventDefault();
		ans.squares= parseInt($("#rect-input").val());
		ans.tris= parseInt($("#tris-input").val());
		ans.gauge[0]= parseInt($("#gauge-1-input").val());
		ans.gauge[1]= parseInt($("#gauge-2-input").val());

		// go to next
		self.next();
	})
};

// return tris, squares, gauge array
// nums of correct ans
Stage.prototype.getCorrects = function() {
	var self= this;
	var ret= {tris: 0, squares: 0, gauge: [0,0]};
	if(self.question.tris==self.answers.tris)
		ret.tris= 1;

	if(self.question.squares==self.answers.squares)
		ret.squares= 1;

	for(var i=0; i<ret.gauge.length; i++)
		if(self.question.gauge[i]==self.answers.gauge[i])
			ret.gauge[i]= 1;

	return ret;
};

Stage.prototype.setNextStage = function(stage) {
	this.nextStage= stage;
};

Stage.prototype.setFin = function() {
	this.fin= this.game.finish;
};

Stage.prototype.next = function() {
	if(this.nextStage)
		this.nextStage.init();
	else
		this.fin(this.game);
};

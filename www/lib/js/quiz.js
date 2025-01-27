function Clock(params) {
	/** @preserve * Clock: Copyright (c) 2013 Carlos Cabañero (c.cabanerochaparro@gmail.com) and contributors. Modified by ian.duff@essemble.co.uk **/
    this.initValue;
    this.data;
    this.time;
    this.showText;
    this.textColor;
    this.bodyColor;
    this.borderColor;
    this.bodyWidth;
    this.borderWidth;
    this.bodySeparation;
    this.fontFace;
    this.endCallback;
    this.dateStart;
    this.freq;
    this.netRadius;
    this.autoDraw;
    this.diff;
    this.ctx;
    this.x;
    this.y;
    this.radius;
    this.clockInterval;
    this.drawInterval;
    this.params = params;
}

Clock.prototype = {
	//Clock methods
	init:function(){
        this.setInitialClock();
    },

    setInitialClock:function(){
        this.initValue = 0;
        this.data = 0;
        this.time = parseInt((this.params.time) ? (this.params.time) : 60);
        this.showText = (this.params.showText != null) ? (this.params.showText) : true;
        this.textColor = (this.showText) ? (this.params.textColor || 'white') : null;
        this.bodyColor = (this.params.bodyColor) ? this.params.bodyColor : '#FF0000';
        this.borderColor = (this.params.borderColor) ? this.params.borderColor : 'transparent';
        this.bodyWidth = this.params.bodyWidth || 10;
       	this.borderWidth = this.params.borderWidth || this.bodyWidth;
        this.bodySeparation = (this.params.bodySeparation) ? (this.params.bodySeparation) : 0;
        this.fontFace = (this.params.fontFace) ? this.params.fontFace : "'Roboto Condensed', sans-serif";
        this.endCallback = this.params.endCallBack || function() {};
        this.dateStart = new Date();
        this.freq = (this.params.freq != null) ? this.params.freq : 10;
        this.netRadius = Math.max(this.bodyWidth, this.borderWidth);
        this.autoDraw = (this.params.autoDraw != null) ? this.params.autoDraw : true;
        this.diff = 0;
        this.ctx = this.params.context;
        this.x = this.params.x || 100,
        this.y = this.params.y || 100,
        this.radius = this.params.radius || 100;
    },

    doStep:function() {
        if (this.data >= 2) {
            clearInterval(this.clockInterval);
            clearInterval(this.drawInterval); 
            this.data = 2;
            this.endCallback();
            return;
        }
        var now = new Date();
        this.diff = ((now.getTime() - this.dateStart.getTime()) / 1000);
        this.data = this.diff * 2 / this.time;
    },

    doDraw:function() {
        this.eraseZone();
        this.drawBorder();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.getBodyColour();
        this.ctx.lineWidth = this.getBodyWidth();
        var quart = Math.PI / 2;
        this.ctx.arc(this.x, this.y, this.radius, this.initValue * Math.PI - quart, this.data * Math.PI - quart, false);
        this.ctx.stroke();
        this.drawText();
    },

    drawBorder:function() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.getBorderColour();
        this.ctx.lineWidth = this.getBorderWidth();
        this.ctx.arc(this.x, this.y, this.radius + this.bodySeparation, 0 * Math.PI, 2 * Math.PI, false);
        this.ctx.stroke();
    },

    drawText:function() {
        if (!this.showText) {
            return;
        }
        this.ctx.fillStyle = this.getTextColour();
        this.ctx.font = "bold " + (this.radius / 1.2) + "px " + this.fontFace;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.ceil(this.time - this.diff), this.x, this.y + (this.radius / 4));
        this.ctx.restore();
    },

    getTextColour:function(){
    	return this.textColor;
    },

    getBodyColour:function(){
    	return this.bodyColor;
    },

    getBodyWidth:function(){
    	return this.bodyWidth;
    },

    getBorderColour:function(){
    	return this.borderColor;
    },

    getBorderWidth:function(){
    	return this.borderWidth;
    },

    eraseZone:function() {
        this.ctx.clearRect(this.x - this.radius - this.netRadius, this.y - this.radius - this.netRadius, this.radius * 2 + this.netRadius * 2, this.radius * 2 + this.netRadius * 2);
    },

    step:function() {
        this.clockInterval = setInterval( this.doStep.bind(this), this.freq );

        if (this.autoDraw) {
            this.drawInterval = setInterval( this.draw.bind(this), this.freq );
        }
    },

    draw:function() {
        this.ctx.save();
        this.doDraw();
        this.ctx.restore();
    },

    setEndCallBack:function(newCallBack) {
        this.endCallback = newCallBack;
    },

    stopEndCallBack:function(){
        clearInterval(this.clockInterval);
        clearInterval(this.drawInterval);
    },

    reset:function(){
    	this.setInitialClock()
        this.doDraw();
    },

    getGameTime:function() {
	    return Math.ceil(this.diff);
	}
} //end Clock prototype

/*
 @preserve
 QUIZ
 VERSION: 2.5
 JS
 AUTHOR: Ian Duff
 EMAIL: ian.duff@essemble.co.uk
 COPYRIGHT: Essemble Ltd
 All code © 2019 Essemble Ltd. All rights reserved.
 This code is the property of Essemble Ltd and cannot be copied, reused or modified without prior permission from the author
*/

function Quiz (vars) {
	//constructor
	//this._screen = vars.element._screen;
	//this._element = vars.element;
	//this._container = vars.element._container;
	//this._questionContainer;

	MCQ.call(this,vars); //inherit the MCQ object
	this._timeoutContainer;
	this._scoreContainer;
	this._timer = false;
	this._masteryscore = $(this._xml).find("score").attr("masteryscore") || 80;
	this._resultfb = null;

	//timeout container
	this._timeoutContainer = create({ type: "div", className: "timeoutContainer" }); //timeout container
	$(this._timeoutContainer).hide();  
	this._screen._container.appendChild(this._timeoutContainer);

	var timeoutXML = $(this._xml).find("timeout");
	this._oTimeout = {};
	this._oTimeout._event = xmlAttrStr(timeoutXML,"event");
	var collectionId = this._element._id + "_timeout";
	this._oTimeout._collection = collectionId; 

	var scope = this;
	$(timeoutXML).children().each(function(){
		var el = scope._screen.createElement({xml:this, load:false, collection:collectionId});
		if(el) el._target = scope._timeoutContainer;
	});
	
	//final score container
	this._scoreContainer = create({ type: "div", className: "scoreContainer" }); //score container
	$(this._scoreContainer).hide(); 
	this._screen._container.appendChild(this._scoreContainer);
	
	var scoreXML = $(this._xml).find("score");
	this._oScorePass = {};
	this._oScoreFail= {};
	this._oScorePass._event = xmlAttrStr(scoreXML.find("pass"),"event");
	this._oScoreFail._event = xmlAttrStr(scoreXML.find("fail"),"event");
	var passCollectionId = this._element._id + "_pass";
	this._oScorePass._collection = passCollectionId;
	var failCollectionId = this._element._id + "_fail";
	this._oScoreFail._collection = failCollectionId; 

	$(scoreXML).find('pass').children().each(function () {
		var el = scope._screen.createElement({xml:this, load:false, collection:passCollectionId});
		if(el) el._target = scope._scoreContainer;
	});
	$(scoreXML).find('fail').children().each(function () {
		var el = scope._screen.createElement({xml:this, load:false, collection:failCollectionId});
		if(el) el._target = scope._scoreContainer;
	});

	var settings = $(this._xml).find("settings");
	if(xmlAttrStr(settings,"timer")) { this._timer = Boolean(xmlAttrStr(settings,"timer").toLowerCase() === "true"); }

	if(this._timer){
		//the timer css can be changed in the #timer style 
		var clockCanvas = create({ type: "canvas", id: "timer", className:"timer"});
		$(clockCanvas).css("position","absolute");
		$(clockCanvas).css("left",0);
		$(clockCanvas).css("top",0);
		$(clockCanvas).attr("width",250);
		$(clockCanvas).attr("height",250);
		this._clockCanvas = clockCanvas;

		var cont = clockCanvas.getContext("2d");
		var scope = this;
		this._timer = new Clock({ 
			context 	: cont, 
		  	type 		: Clock.TYPE_CLOCKWISE_INCREMENT,
		  	time 		: scope.curQ()._time,
		  	showText 	: true,
		  	textColor 	: '#fff',
		  	bodyColor   : '#f1ab43',
		  	borderColor : '#fff',
		  	radius 	    : 100,
		  	bodyWidth   : 20,
		  	borderWidth : 50,
		  	autoDraw:true,
		  	x:125,
		  	y:125,
		  	endCallBack : scope.timeout.bind(scope)
		});
	}
}

Quiz.prototype = {
	//Quiz methods
	
	init:function(){
		//override mcq init function
		//the first question is loaded by begin()
		if(this._timer){
			var timerContainer = get("timerContainer");
			if(timerContainer){
				timerContainer.appendChild(this._clockCanvas);
			} else {
				this._screen._container.appendChild(this._clockCanvas);
			}
		}
	},
	
	begin:function(element){
		this._iCurQ = 0;
		this.loadQuestion(this._iCurQ);
	},

	loadQuestionById:function(id){
		var index = null;
		for(var i=0;i<this._arQs.length;i++){
			if(this._arQs[i]._id == id){
				index = i;
				break;
			}
		}
		index ? this.loadQuestion(index) : alert("Question " + id + " not found");
	},
	
	loadQuestion:function(id){
		//override mcq loadQuestion function
		this._iCurQ = id;
		var q = this.curQ();
		this.clearQuestionContainer();
		this.updateProgressBar();
		if(this._radioBtn){
			var existing = $(q._arOptions[0]._element._container).find(".radioBtn");
			if(existing.length == 0) {
				for (var i=0;i<q._arOptions.length;i++){
					var rb = create({type:"div", className:"radioBtn"})
					$(rb).css("position","absolute");
					$(rb).css("left",getUnit(this._radioBtnX));
					$(rb).css("top",getUnit(this._radioBtnY));
					$(q._arOptions[i]._element.container()).prepend(rb);
				}
			}
		}
		
		$(this._questionContainer).show();
    
    	if(this._timer) {
			$(this._clockCanvas).show();
		}

		var array = q._elements;
		var loader = new ElementLoader({screen:this._screen, elements:array, onLoadComplete:"questionLoadComplete", onAnimsComplete:"questionAnimsComplete", onCompleteScope:this});
		loader.load();

		//fire any events tied to the question
		if(q._event) this._screen.doClickEventsFromStr(q._event,null);

		if(this._cheatMode) this.showAllCorrectAnswers();

		if(this._iCurQ > 0) this.scrollToTop();
	},

	loadNextQuestion:function(element){
		this.clearQuestionContainer();
		if(this._timer) this._timer.reset();
		
		if(this._iCurQ < this._arQs.length-1) {
			this._iCurQ++; 
			this.loadQuestion(this._iCurQ);
		} else {
			this.updateProgressBar();
			this.updateFooterBar();
			this.showScore();
		}
	},

	loadPreviousQuestion:function(element){
		this.clearQuestionContainer();
		
		if(this._iCurQ != 0) {
			this._iCurQ--; 
			this.loadQuestion(this._iCurQ);
		}
	},

	submit:function(element){
		//override mcq submit function
		var q = this._arQs[this._iCurQ];
		q._passed = false;
		var optionCorrectCount = 0;
		var userCorrectCount = 0;
		var allCorrect = false;
		var selectedOptionPos = null; //remember the (last) selected option in case of specific feedback
		var count = 0;
		var bPartial = false;

		//stop & hide the timer
		if(this._timer){ 
			this.stopTimer(); 
		}

		//disable confirm, enable reset
		var confirmBtn = q.getElementById("submitBtn");
		if(confirmBtn) confirmBtn.disableBtn();
		
		var resetBtn = q.getElementById("resetBtn");
		if(resetBtn) resetBtn.enableBtn();
		
		//disable options and work out which ones answered correctly
		for (var i=0;i<q._arOptions.length;i++) {
			q._arOptions[i]._element.disable();
			if(q._arOptions[i]._correct) { optionCorrectCount++; };
			if(q._arOptions[i]._selected && q._arOptions[i]._correct) { userCorrectCount++; bPartial = true; };
			if(q._arOptions[i]._selected && !q._arOptions[i]._correct) { userCorrectCount-- ; }
			if(q._arOptions[i]._selected) {
				selectedOptionPos = (count+1);
			}
			count++;
		}
		
		//does the selected option have specific feedback? (returns null if not)
		var spFb = q.getFeedbackById(selectedOptionPos);
		var oFb;

		if(userCorrectCount == optionCorrectCount){
			//all correct
			q._passed = true;	//flag question as passed
			spFb ? oFb = spFb : oFb = q.getFeedbackById("pass");
		} else if (bPartial){
			//some correct
			spFb ? oFb = spFb : oFb = q.getFeedbackById("partial");
		} else {
			//none correct
			spFb ? oFb = spFb : oFb = q.getFeedbackById("fail");
		}

		q._numAttempts++;
		
		//enable sca if appropriate
		if(userCorrectCount != optionCorrectCount){
			var scaBtn = q.getElementById("scaBtn");
			if(scaBtn){ 
				if(this._maxAttempts){						
					if(q._numAttempts >= this._maxAttempts){
						scaBtn.enableBtn(); 
					}
				} 
			}
		}

		this.loadFeedback(oFb);
		this.showCorrectAnswers();
		this.updateFooterBar();
	},
	
	timeout:function(){
		this.clearQuestionContainer();
		
		if(this._timer){ 
			this.stopTimer();
			$(this._clockCanvas).hide();
		}

		var array = this._screen.getElementsByCollection(this._oTimeout._collection);
		this._resultfb = array;
		$(this._timeoutContainer).show();
		var elementLoader = new ElementLoader({screen:this._screen, elements:array, onLoadComplete:"updateMathJax", onCompleteScope:this});
		elementLoader.load();

		if(this._oTimeout._event){
			this._screen.doClickEventsFromStr(this._oTimeout._event,null);
		}
	},
	
	showScore:function(){
		this.clearQuestionContainer();
		this.scrollToTop();

		if(this._timer){
			this.stopTimer();
			$(this._clockCanvas).hide();
		}
		
		var userPercentage = this.getScore(true);
		if(userPercentage >= this._masteryscore) {
			this.pass(userPercentage);
		} else {
			this.fail(userPercentage);
		}
	},

	pass:function(score){
		var array = this._screen.getElementsByCollection(this._oScorePass._collection);
		this._resultfb = array;
		for(var i=0;i<array.length;i++){
			if(array[i]._type == "text"){
				array[i]._text.replace("[passed]",this.getScore(false));
				array[i]._text.replace("[total]",this._arQs.length);
				array[i]._text.replace("[score]",score);
			}
		};
		$(this._scoreContainer).show();
		var loader = new ElementLoader({screen:this._screen, elements:array, onLoadComplete:"updateMathJax", onCompleteScope:this});
		loader.load();

		if(this._oScorePass._event) {
			this._screen.doClickEventsFromStr(this._oScorePass._event,null);
		}
	},
	
	fail:function(score){
		var array = this._screen.getElementsByCollection(this._oScoreFail._collection);
		this._resultfb = array;
		for(var i=0;i<array.length;i++){
			if(array[i]._type == "text"){
				array[i]._text.replace("[passed]",this.getScore(false));
				array[i]._text.replace("[total]",this._arQs.length);
				array[i]._text.replace("[score]",score);
			}
		};
		$(this._scoreContainer).show();
		var loader = new ElementLoader({screen:this._screen, elements:array, onLoadComplete:"updateMathJax", onCompleteScope:this});
		loader.load();
		
		if(this._oScoreFail._event) {
			this._screen.doClickEventsFromStr(this._oScoreFail._event,null);
		}
	},

	getScore:function(asPercentage){
		var score = 0;
		for(var i=0;i<this._arQs.length;i++){
			if(this._arQs[i]._passed) score++;
		}
		var perc = Math.round((score/this._arQs.length) *100);
		if(asPercentage){
			return perc;
		} else {
			return score;
		}
	},

	questionLoadComplete:function(){
		this.updateFooterBar();
		this.updateMathJax();
	},
	
	questionAnimsComplete:function(){
		if(this._timer){
			$(this._clockCanvas).show();
			this._timer.init();
			var qTime = this._arQs[this._iCurQ]._time;
			this._timer.time = qTime;
			this._timer.step();//start the timer
		}
	},
	
	stopTimer:function(){
		if(this._timer){
			this._timer.stopEndCallBack();
			//$(this._clockCanvas).hide();
		}
	},

	clearResultFeedback:function(){
		if(this._resultfb){
			for (var i=0;i<this._resultfb.length;i++){
				$(this._resultfb[i]._container).remove();
			}
		}
		$(this._scoreContainer).hide();
		$(this._timeoutContainer).hide();
	},

	clearQuestionContainer:function(){
		//reset all the option elements, remove any ticks and feedback, clear the container
		var q = this._arQs[this._iCurQ];
		for (var i=0;i<q._arOptions.length;i++) {
		 	$(q._arOptions[i]._element._container).off();
		 	this.optionOut(q._arOptions[i]._element);
			var correct = $(q._arOptions[i]._element._container).find(".tick");
			if(correct.length > 0) $(correct).remove();
		}
		this.removeFeedback();
		this._questionContainer.innerHTML = "";
	},

	updateProgressBar:function(){
		var outer = get("quiz_progress_outer");
		var inner = get("quiz_progress_inner");
		if(inner){
			var perc = Math.round((this._iCurQ+1) / this._arQs.length * 100) +"%";
			$(inner).animate({ 
			   width: perc}, 
			   1000, 
			   ""
			);
		}
	},

	updateFooterBar:function(){
		var footer = this._screen.getElementById("quiz_footer");
		if(footer){
			var score = this._screen.getElementById("footer_score");
			var page = this._screen.getElementById("footer_page");
			if(score){
				$(score._container).html("<p style='float:left'>Score: " + this.getScore(false) + "/" + this._arQs.length + "</p>");
			}
			if(page){
				$(page._container).html("<p>Question: " + (this._iCurQ+1) + "/" + this._arQs.length + "</p>");
			}
			footer._anim = "show";
			footer.animate();
		}
	},

	restart:function(element){
		this.clearResultFeedback();
		this.clearQuestionContainer();
		this._iCurQ = 0;
		
		//reset all questions, question options and feedback elements
		for(var i=0;i<this._arQs.length;i++){
			this._arQs[i]._passed = false;
			this._arQs[i]._numAttempts = 0;
			var els = this._arQs[i]._elements;
			for(j=0;j<els.length;j++){
				if(els[j]._type == "box" || els[j]._type == "div") els[j]._container.innerHTML = "";
				els[j].reset();
			}

			var fbs = this._arQs[i]._arFbs;//feedbacks
			for(k=0;k<fbs.length;k++){
				var collectionId = fbs[k]._collection;//feedback els
				var els = this._screen.getElementsByCollection(collectionId);
				for(l=0;l<els.length;l++){
					if(els[l]._type == "box" || els[l]._type == "div") els[l]._container.innerHTML = "";
					els[l].reset();
				}
			}
			
			var options = this._arQs[i]._arOptions;
			for(l=0;l<options.length;l++){
				options[l]._selected = false;
			}
		}

		//final score screen text (reserved words) likely to have been modified, so reset that
		var scoreFailEls = this._screen.getElementsByCollection(this._oScoreFail._collection);
		var array = scoreFailEls.concat(this._screen.getElementsByCollection(this._oScorePass._collection));
		for(var i=0;i<array.length;i++){
			if(array[i]._type == "text") array[i]._text.reset();
		}

		this.loadQuestion(this._iCurQ);
	},

	//results functions
	getResultFullJSON:function(){
        //returns result in a JSON format
        var userPercentage = this.getScore(true);
        var passed = "false";
        if(userPercentage >= this._masteryscore) { passed = "true"; }

        var jsonStr = '{"score":"' + this.getScore(true) + '","masteryscore":"' + this._masteryscore + '","passed":"' + passed + '","questions":[';

        for (var i=0;i<this._arQs.length;i++){
            var q = this._arQs[i];
            if(q._numAttempts != 0){
                var qEl = q.getElementById("question");//question stem
                var qText = "";
                if(qEl) qText += qEl._xml.text().replace(/<[^>]*>/g, '');
                
                var options = q._arOptions;
                
                jsonStr += '{"id":"' + q._id + '","text":"' + qText + '","passed":"' + q._passed + '","options":[';
                
                for (var j=0;j<options.length;j++){
                    var option = options[j];
                    var optionVal;
                    if(option._element._type == "image"){
                    	optionVal = option._element._xml.attr("src");
                    } else {
                    	optionVal = option._element._xml.text().replace(/<[^>]*>/g, '');
                    }
                    jsonStr += '{"value":"' + optionVal +'","selected":"' + option._selected + '","correct":"' + option._correct + '"';
                    j<options.length-1 ? jsonStr += '},' : jsonStr += '}]';
                }

                if(this.notLastAttemptedQuestion(i+1)){
                    jsonStr += '},'
                } else {
                    jsonStr += '}]';
                }
            }
        }
        jsonStr += '}';
        
        return jsonStr;
    },

    getSelectionsJSON:function(){
        //returns result in a JSON format (for just the selected options)
        var userPercentage = this.getScore(true);
        var passed = "false";
        if(userPercentage >= this._masteryscore) { passed = "true"; }

        var jsonStr = '{"score":"' + this.getScore(true) + '","masteryscore":"' + this._masteryscore + '","passed":"' + passed + '","questions":[';

        for (var i=0;i<this._arQs.length;i++){
            var q = this._arQs[i];
            if(q._numAttempts != 0){
                var qEl = q.getElementById("question");//question stem
                var qText = "";
                if(qEl) qText += qEl._xml.text().replace(/<[^>]*>/g, '');
                
                var options = q._arOptions;
                
                jsonStr += '{"id":"' + q._id + '","text":"' + qText + '","options":[';
                
                for (var j=0;j<options.length;j++){
                    var option = options[j];
                    if(option._selected){
                        var optionVal;
	                    if(option._element._type == "image"){
	                    	optionVal = option._element._xml.attr("src");
	                    } else {
	                    	optionVal = option._element._xml.text().replace(/<[^>]*>/g, '');
	                    }
                        jsonStr += '{"value":"' + optionVal +'","selected":"' + option._selected + '"';
                        if(this.notLastSelectedOption(options,j+1)){
                            jsonStr += '},';
                        } else {
                            jsonStr += '}]';
                        }
                    }
                }

                if(this.notLastAttemptedQuestion(i+1)){
                    jsonStr += '},'
                } else {
                    jsonStr += '}]';
                }
            }
        }
        jsonStr += '}';
        
        return jsonStr;
    },

    getResultsPlainText:function(){
        //returns result in a plain text format
        var userPercentage = this.getScore(true);
        var passed = "false";
        if(userPercentage >= this._masteryscore) { passed = "true"; }


        var str = "Score: " + userPercentage + "% | Mastery score: " + this._masteryscore + "% | Passed: " + passed + "<br/>";

        for (var i=0;i<this._arQs.length;i++){
            var q = this._arQs[i];
            if(q._numAttempts != 0){
                
                var options = q._arOptions;
                
                str += "Question " + q._id + ": ";
                str += "passed: " + q._passed + "<br/>";
                str += "Correct response: ";
                
                for (var j=0;j<options.length;j++){
                    var option = options[j];
                    option._correct ? str += "1" : str += "0"
                    if(j < options.length -1){
                        str += ',';
                    }
                }

                str += " | User response: ";
                for (var j=0;j<options.length;j++){
                    var option = options[j];
                    option._selected ? str += "1" : str += "0"
                    if(j < options.length -1){
                        str += ',';
                    } 
                }

                if(this.notLastAttemptedQuestion(i+1)){
                    str += "<br/>"
                } 
            }
        }
        
        return str;
    },

    notLastSelectedOption:function(options,index){
        var ret = false;
        for(var i=index;i<options.length;i++){
            if(options[i]._selected){
                ret = true;
                break;
            }
        }
        return ret;
    },

    notLastAttemptedQuestion:function(index){
        var ret = false;
        for(var i=index;i<this._arQs.length;i++){
            if(this._arQs[i]._numAttempts != 0){
                ret = true;
                break;
            }
        }
        return ret;
    },

    sendResultPlain:function(){
        //example ajax call to serverside script for further processing
        var plain = this.getResultsPlainText();
        var data = {result:plain}
        $(this._questionContainer).append("<br/><br/><p style='color:#ccc'>RESULTS SHOWN FOR DEMO PURPOSES:<br/>");//for demo viewing purposes only
        $(this._questionContainer).append("RESULTS PLAIN TEXT:<br/>" + plain);//for demo viewing purposes only
        $.ajax({
          type: "POST",
          url: "results.php",
          data: data,
          success: this.successFunc,
          dataType: ""
        });
    },

    sendResultJSON:function(){
        //example ajax call to serverside script for further processing
        var plain = this.getResultsPlainText();
        var selections_json = this.getSelectionsJSON();
        var full_json = this.getResultFullJSON();

        var data = {result:selections_json}
     //   $(this._questionContainer).append("<br/><br/><p style='color:#ccc'>RESULTS SHOWN FOR DEMO PURPOSES:<br/>");//for demo viewing purposes only
     //   $(this._questionContainer).append("RESULTS PLAIN TEXT:<br/>" + plain);//for demo viewing purposes only
     //   $(this._questionContainer).append("<br/><br/>");//for demo viewing purposes only
     //   $(this._questionContainer).append("SELECTED OPTIONS JSON:<br/>" + selections_json);//for demo viewing purposes only
     //   $(this._questionContainer).append("<br/><br/>");//for demo viewing purposes only
        $(this._questionContainer).append("JSON results for database?:<br/>" + full_json);//for demo viewing purposes only
        $.ajax({
          type: "POST",
          url: "results.php",
          data: data,
          success: this.successFunc,
          dataType: ""
        });
    },

    successFunc:function(response){
        //wehay
        //alert("success callback");
    }
    //end results functions
} //end prototype object

extend(MCQ, Quiz); //inherit the MCQ object and its prototype methods	

ElementLoader.prototype.attachPreloader = function(){
    if (!get("preloader")) {
    	var midX = ($(this._screen._container).innerWidth() - 34) / 2,
            midY = ($(this._screen._container).innerHeight() - 34) / 2;

        this._preloader = create({type: "div",id: "preloader"});
        $(this._preloader).css("position", "absolute");
        $(this._preloader).css("z-index", 999);
        $(this._preloader).css("left",midX);
        $(this._preloader).css("top",midY);
        $(this._preloader).addClass("preloader");
        $(this._preloader).hide();
        this._screen._container.appendChild(this._preloader);
        this.showPreloader();
    }
}

ElementLoader.prototype.removePreloader = function(){
	try{
		this._screen._container.removeChild(this._preloader); 
		this._preloader = null;
	} catch(e){}
}

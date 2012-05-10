var feedbackReloaded = {};

(function ($) {

"use strict";

/**
 * Attach startFeedback to Feedback button
 */
Drupal.behaviors.feedback_reloaded = {
  attach: function (context, settings) {
    $('#feedback_button', context).click(feedbackReloaded.startFeedback);
  }
};

//feedbackReloaded Variables and fuctions declaration
feedbackReloaded.initx=false,
feedbackReloaded.inity=false,
feedbackReloaded.posx=0,
feedbackReloaded.posy=0;
feedbackReloaded.highlighted = [];
feedbackReloaded.rect = function(left, top, width, height) {
  this.active = 1;
  this.left   = left;
  this.top    = top;
  this.width  = width;
  this.height = height;
};

feedbackReloaded.getMouse = function(obj,ev) {
  var left, top, width, height;
  ev.preventDefault();
  
  if (ev.clientX) {
    feedbackReloaded.posx = ev.clientX;
	feedbackReloaded.posy = ev.clientY;
  }
  else {
    return false
  }
  
  if (ev.type == 'mousedown') {
    feedbackReloaded.initx = feedbackReloaded.posx,
	feedbackReloaded.inity = feedbackReloaded.posy;
	var id = feedbackReloaded.highlighted.length;
	$('<div id="highlight_'+id+'" class="highlighted_region" style="left:'+feedbackReloaded.initx+'px; top:'+feedbackReloaded.inity+'px; z-index: 10000'+id+';"><iframe frameborder="0"></iframe></div>')
	.hover(function() {
	  $(this)
	    .css('background-color',' #69F')
		.css('z-index','10000000000')
		.fadeTo(0, 0.10);
	  $('#cross_'+id+'')
		.css('display','block')
		.css('z-index','10000000001');
	  },
      function() {
	    $('#cross_'+id+'')
		  .css('display','none')
		  .css('z-index','10000'+id+'');
		$(this)
		  .css('background-color','transparent')
		  .css('z-index','10000'+id+'')
		  .fadeTo(0, 1);
	  }
	)
	.appendTo($('body'));
	$('div[id*="highlight_"]').css("z-index", "1000");
}
  
  if (ev.type == 'mouseup') {
    left = feedbackReloaded.posx - feedbackReloaded.initx < 0 ? feedbackReloaded.posx  : feedbackReloaded.initx;
	top = feedbackReloaded.posy - feedbackReloaded.inity < 0 ? feedbackReloaded.posy : feedbackReloaded.inity;
	width = Math.abs (feedbackReloaded.posx - feedbackReloaded.initx);
	height = Math.abs (feedbackReloaded.posy - feedbackReloaded.inity);
	  if ( width == 0 || height == 0 ) {
	    $('#highlight_'+feedbackReloaded.highlighted.length+'').remove();
	    var i = 0;
		$('div[id*="highlight_"]').each(function(index) {
		  $(this).css('z-index', '10000'+i+'');
		  i++;
		});
		feedbackReloaded.initx=false;
		feedbackReloaded.inity=false;
		return false;
	  }
	
    if( feedbackReloaded.initx != false && feedbackReloaded.inity != false ) {
      $("#highlight_"+feedbackReloaded.highlighted.length+"")
	    .css("width", ""+width+"px")
	    .css("height", ""+height+"px")
	    .css("left", ""+left+"px")
	    .css("top", ""+top+"px")
	    .children()
	    .css("width", ""+width+"px")
	    .css("height", ""+height+"px");
	  
	  feedbackReloaded.highlight(left,top,width,height);
	  var temp = new feedbackReloaded.rect(left,top,width,height);
	  feedbackReloaded.highlighted.push(temp);
	
	  left = left + width - 15;
	  top = top - 15;
	  width = height = 30;
	  var id = feedbackReloaded.highlighted.length-1;
	  var zindex = "10000"+id;
	  $('<div id="cross_'+id+'" class="cross_highlight" style="left:'+left+'px; top:'+top+'px; width:'+width+'px; height:'+height+'px; z-index: '+zindex+'; display:none;" onClick="feedbackReloaded.closeHighlight('+id+');"></div>')
        .hover(function(e) {
	      $(this)
		    .css('display','block')
		    .css('z-index','10000000001')
		  $('#highlight_'+id+'')
		    .css('background-color','#69F')
		    .css('z-index','10000000000')
		    .fadeTo(0, 0.10);
		},
		function(e) {
		  $(this)
		    .css('z-index','10000'+id+'')
			.css('display','none');
		  $('#highlight_'+id+'')
		    .css('background-color','transparent')
			.css('z-index','10000'+id+'')
			.fadeTo(0, 1);
		})
	    .css('cursor','pointer')
	    .appendTo($('body'));
	  var i = 0;
	  $('div[id*="highlight_"]').each(function(index) {
	    $(this).css('z-index', '10000'+i+'');
	    i++;
	  });
    }
	feedbackReloaded.initx=false;
	feedbackReloaded.inity=false;
  }
  
  if (feedbackReloaded.initx || feedbackReloaded.inity) {
    left = feedbackReloaded.posx - feedbackReloaded.initx < 0 ? feedbackReloaded.posx  : feedbackReloaded.initx;
	top = feedbackReloaded.posy - feedbackReloaded.inity < 0 ? feedbackReloaded.posy : feedbackReloaded.inity;
	width = Math.abs (feedbackReloaded.posx - feedbackReloaded.initx);
	height = Math.abs (feedbackReloaded.posy - feedbackReloaded.inity);
	$("#highlight_"+feedbackReloaded.highlighted.length+"")
	  .css("width", ""+width+"px")
	  .css("height", ""+height+"px")
	  .css("left", ""+left+"px")
	  .css("top", ""+top+"px");
	feedbackReloaded.highlight(left,top,width,height);
  }
};

feedbackReloaded.highlight = function(x, y, width, height) {
  if(width == 0 || height == 0) {
    return false;
  }
  var feedbackCanvas = document.getElementById("feedback_canvas"),
  context = feedbackCanvas.getContext('2d');
  //Drawing a dimmer on whole page
  context.globalAlpha = 0.4;
  context.fillStyle = 'black';
  context.clearRect(0,0,1366,667);
  context.fillRect(0,0,1366,667);
  context.globalAlpha = 1;
  context.strokeStyle = 'black';
  context.lineWidth   = 1;
  
  //Drawing borders for already highlighted regions. 0.5 is used for crisp line see http://diveintohtml5.info/canvas.html#paths
  for( var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
    if(feedbackReloaded.highlighted[i].active == 1) {
	  context.strokeRect(feedbackReloaded.highlighted[i].left-0.5, feedbackReloaded.highlighted[i].top-0.5, feedbackReloaded.highlighted[i].width+1, feedbackReloaded.highlighted[i].height+1);
	}
  }
	
  //Drawing border for this current rectangle.
  context.strokeRect(x-0.5,y-0.5,width+1,height+1);
  
  //Clearing the regions as in highlighted array.
  for(var i=feedbackReloaded.highlighted.length-1;i>=0;--i) {
    if(feedbackReloaded.highlighted[i].active == 1) {
	  context.clearRect(feedbackReloaded.highlighted[i].left, feedbackReloaded.highlighted[i].top, feedbackReloaded.highlighted[i].width, feedbackReloaded.highlighted[i].height);
	}
  }
  context.clearRect(x, y, width, height);
};

feedbackReloaded.closeHighlight = function(id) {
  feedbackReloaded.highlighted[id].active = 0;
  $('#cross_'+id+'').remove();
  $('#highlight_'+id+'').remove();
  feedbackReloaded.reRender();
};

feedbackReloaded.reRender = function() {
  var feedbackCanvas = document.getElementById("feedback_canvas"),
  context = feedbackCanvas.getContext('2d');
  context.globalAlpha = 0.4;
  context.fillStyle = 'black';
  context.clearRect(0,0,1366,667);
  context.fillRect(0,0,1366,667);
  context.globalAlpha = 1
  context.strokeStyle = 'black'
  context.lineWidth   = 1;
  for( var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
    if(feedbackReloaded.highlighted[i].active == 1) {
	  context.strokeRect(feedbackReloaded.highlighted[i].left-0.5, feedbackReloaded.highlighted[i].top-0.5, feedbackReloaded.highlighted[i].width+1, feedbackReloaded.highlighted[i].height+1);
	}
  }
  for(var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
    if(feedbackReloaded.highlighted[i].active == 1) {
	  context.clearRect(feedbackReloaded.highlighted[i].left, feedbackReloaded.highlighted[i].top, feedbackReloaded.highlighted[i].width, feedbackReloaded.highlighted[i].height);
	}
  }
};

feedbackReloaded.startFeedback = function() {
  $('body').css('overflow','hidden');
  $('<canvas id="feedback_canvas" width=1366 height=667 class="feedback_canvas" onMouseUp="feedbackReloaded.getMouse(this,event);" onMouseDown="feedbackReloaded.getMouse(this,event);" onMouseMove="feedbackReloaded.getMouse(this,event);" ondblclick="return false;" > Your browser does not support canvas element</canvas>')
    .prependTo($('body')); 
  var feedbackCanvas =  document.getElementById("feedback_canvas"),
  context = feedbackCanvas.getContext('2d');
  context.globalAlpha = 0.4;
  context.fillStyle = 'black';
  context.fillRect(0,0,1366,667);
};
}(jQuery));
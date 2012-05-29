var feedbackReloaded = {};
		
(function ($) {
		
		"use strict";
		
		$(document).ready(function () {
				$('<div id="feedback_button" class="feedback_button">Feedback</div>')
				.click(feedbackReloaded.startWizard)
				.appendTo($('body'));
		});
		
		//feedbackReloaded Variables and fuctions declaration
		feedbackReloaded.currentAction = "highlight";
		feedbackReloaded.initx         = false,
		feedbackReloaded.inity         = false,
		feedbackReloaded.posx          = 0,
		feedbackReloaded.posy          = 0;
		feedbackReloaded.highlighted   = [];
		feedbackReloaded.blackedout    = 0;
		feedbackReloaded.notes         = 0;
		feedbackReloaded.canvasIndex   = 99999;
		feedbackReloaded.screenshotBase64 = "empty";
		feedbackReloaded.rect = function(left, top, width, height) {
				this.active = 1;
				this.left   = left;
				this.top    = top;
				this.width  = width;
				this.height = height;
		};
		
		feedbackReloaded.getMouse = function(obj,ev) {
				var left, top, width, height, id, zindex;
				ev.preventDefault();
				
				if (ev.clientX) {
						feedbackReloaded.posx = ev.clientX;
			feedbackReloaded.posy = ev.clientY;
				}
				else {
						return false
				}
				
				if ( feedbackReloaded.currentAction == "addnote" ) {
						if (ev.type == 'mouseup' && obj == document.getElementById("feedback_canvas")) {
								id = feedbackReloaded.notes;
								feedbackReloaded.initx = feedbackReloaded.posx,
								feedbackReloaded.inity = feedbackReloaded.posy;
								left = feedbackReloaded.initx;
								top = feedbackReloaded.inity;
								$('<div id="note_'+id+'" class="notes" style="left:'+left+'px; top:'+top+'px;" onMouseMove="feedbackReloaded.getMouse(this,event);" onMouseUp="feedbackReloaded.getMouse(this,event);"><textarea id="note_textarea" rows="6" cols="18"></textarea></div>')
								.bind('keydown', function(e) {
										if( e.keyCode !== 8 && $('#note_textarea').val().length == 108) { return false; }
								})
								.hover(function() {
										$('#cross_notes_'+id+'')
												.css('display','block');
							},
										function() {
												$('#cross_notes_'+id+'')
														.css('display','none');
										}
								)
								.appendTo($('body'));
		
								//Appending the cross
								left = left + 150 - 15;
								top = top - 15;
								$('<div id="cross_notes_'+id+'" class="cross" style="left:'+left+'px; top:'+top+'px;" ></div>')
								.click( function() { $(this).remove(); $('#note_'+id+'').remove(); feedbackReloaded.notes--; })
								.hover(function() {
										$(this)
												.css('display','block');
							},
										function() {
												$(this)
														.css('display','none');
										}
								)
								.appendTo($('body'));
		
								$('#button_highlight', $('#feedback_form')).click();
								feedbackReloaded.notes++;
			}
						feedbackReloaded.initx=false;
						feedbackReloaded.inity=false;
						return false;
				}
		
				if (ev.type == 'mousedown') {
						feedbackReloaded.initx = feedbackReloaded.posx,
						feedbackReloaded.inity = feedbackReloaded.posy;
						
						
						if( feedbackReloaded.currentAction == "blackout" ) {
								id = feedbackReloaded.blackedout;
								$('<div id="blackout_'+id+'" class="blackout_region" style="left:'+feedbackReloaded.initx+'px; top:'+feedbackReloaded.inity+'px;"><iframe frameborder="0" style="width:0px; height:0px;"></iframe></div>')
								.hover(function() {
										$(this)
												.css('z-index','100000000000')
												.fadeTo(0, 0.5);
							$('#cross_blckout_'+id+'')
												.css('display','block')
												.css('z-index','100000000001');
							},
										function() {
												$('#cross_blckout_'+id+'')
														.css('display','none')
														.css('z-index','100000000'+id+'');
												$(this)
														.css('z-index','100000000'+id+'')
														.fadeTo(0, 1);
										}
								)
								.fadeTo(0, 0.5)
					.appendTo($('body'));
								
						}
						else {
								id = feedbackReloaded.highlighted.length;
								$('<div id="highlight_'+id+'" class="highlighted_region" style="left:'+feedbackReloaded.initx+'px; top:'+feedbackReloaded.inity+'px;"><iframe frameborder="0" style="width:0px; height:0px;"></iframe></div>')
								.hover(function() {
										$(this)
												.css('background-color',' #69F')
												.css('z-index','10000000')
												.fadeTo(0, 0.15);
							$('#cross_'+id+'')
												.css('display','block')
												.css('z-index','10000001');
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
						}
		
						// Reducing the z-index of elements so that current div can cover them
						$('div[id*="blackout_"]').css('z-index','99998');
						$('div[id*="highlight_"]').css('z-index','99997');
				}
				
				if (ev.type == 'mouseup') {
						left   = feedbackReloaded.posx - feedbackReloaded.initx < 0 ? feedbackReloaded.posx  : feedbackReloaded.initx;
			top    = feedbackReloaded.posy - feedbackReloaded.inity < 0 ? feedbackReloaded.posy : feedbackReloaded.inity;
			width  = Math.abs (feedbackReloaded.posx - feedbackReloaded.initx);
			height = Math.abs (feedbackReloaded.posy - feedbackReloaded.inity);
					
								
			if ( width == 0 || height == 0 ) {
		
						// @TODO Increase the z-index so that canvas < highlight < blackouts
								if( feedbackReloaded.currentAction == "blackout" ) {
										$("#blackout_"+feedbackReloaded.blackedout+"").remove();
										feedbackReloaded.initx=false;
										feedbackReloaded.inity=false;
										return false;
					}
								else {		
										$('#highlight_'+feedbackReloaded.highlighted.length+'').remove();
										feedbackReloaded.initx=false;
										feedbackReloaded.inity=false;
										return false;
								}
						}
			
						if( feedbackReloaded.initx != false && feedbackReloaded.inity != false ) {
								if( feedbackReloaded.currentAction == "blackout" ) {
										$("#blackout_"+feedbackReloaded.blackedout+"")
												.css("width", ""+width+"px")
												.css("height", ""+height+"px")
												.css("left", ""+left+"px")
												.css("top", ""+top+"px")
												.children()
														.css("width", ""+width+"px")
														.css("height", ""+height+"px");
										
				left = left + width - 15;
										top = top - 15;
										width = height = 30;
				id = feedbackReloaded.blackedout;
				var zindex = "1000000000"+id;
										$('<div id="cross_blckout_'+id+'" class="cross" style="left:'+left+'px; top:'+top+'px; width:'+width+'px; height:'+height+'px; z-index: '+zindex+'; display:none;""></div>')
												.hover(function() {
														$(this)
							.css('display','block')
																.css('z-index','100000000001');
											$('#blackout_'+id+'')
																.fadeTo(0, 0.5)
																.css('z-index','100000000000');
									},
												function() {
														$(this)
																.css('display','none')
							.css('z-index','1000000000'+id+'');
														$('#blackout_'+id+'')
																.fadeTo(0, 1)
																.css('z-index','1000000000'+id+'');
														}
												)
												.click(function() {
														$('#blackout_'+id+'').remove();
					$(this).remove();
														feedbackReloaded.blackedout--;
												})
									.css('cursor','pointer')
												.appendTo($('body'));
										$('#blackout_'+id+'').fadeTo(0, 1);
										feedbackReloaded.blackedout++;
										feedbackReloaded.initx=false;
										feedbackReloaded.inity=false;
					}
								else {
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
										id = feedbackReloaded.highlighted.length-1;
										var zindex = "10000"+id;
										$('<div id="cross_'+id+'" class="cross" style="left:'+left+'px; top:'+top+'px; width:'+width+'px; height:'+height+'px; z-index: '+zindex+'; display:none;" onClick="feedbackReloaded.closeHighlight('+id+');"></div>')
												.hover(function(e) {
														$(this)
																.css('display','block')
										.css('z-index','10000001')
								$('#highlight_'+id+'')
										.css('background-color','#69F')
										.css('z-index','10000000')
										.fadeTo(0, 0.15);
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
		
										feedbackReloaded.initx=false;
										feedbackReloaded.inity=false;
								}
						}
		
				// Increasing the z-index so that canvas < highligh < blackout
				var i = 0;
						$('div[id*="highlight_"]').each(function(index) {
								$(this).css('z-index', '10000'+i+'');
								i++;
						});
				i = 0;
						$('div[id*="blackout"]').each(function(index) {
								$(this).css('z-index', '1000000000'+i+'');
								i++;
						});
				}
				
				// This block executes if user is currently dragging mouse to draw a region
				if (feedbackReloaded.initx || feedbackReloaded.inity) {
						left   = feedbackReloaded.posx - feedbackReloaded.initx < 0 ? feedbackReloaded.posx  : feedbackReloaded.initx;
						top    = feedbackReloaded.posy - feedbackReloaded.inity < 0 ? feedbackReloaded.posy : feedbackReloaded.inity;
						width  = Math.abs (feedbackReloaded.posx - feedbackReloaded.initx);
						height = Math.abs (feedbackReloaded.posy - feedbackReloaded.inity);
			if( feedbackReloaded.currentAction == "blackout" ) {
								$("#blackout_"+feedbackReloaded.blackedout+"")
								.css("width", ""+width+"px")
								.css("height", ""+height+"px")
								.css("left", ""+left+"px")
								.css("top", ""+top+"px");
			}
			else {	
						$("#highlight_"+feedbackReloaded.highlighted.length+"")
								.css("width", ""+width+"px")
								.css("height", ""+height+"px")
								.css("left", ""+left+"px")
								.css("top", ""+top+"px");
						feedbackReloaded.highlight(left,top,width,height);
			}
				}
		};
		
		feedbackReloaded.highlight = function(x, y, width, height) {
				if(width == 0 || height == 0) {
						return false;
				}
				var feedbackCanvas = document.getElementById("feedback_canvas"),
				context = feedbackCanvas.getContext('2d');
				//Drawing a dimmer on whole page
				context.globalAlpha = 0.3;
				context.fillStyle   = 'black';
				context.clearRect(0,0,1366,677);
				context.fillRect(0,0,1366,677);
				context.globalAlpha = 1;
				context.strokeStyle = 'black';
				context.lineWidth   = 1;
				
				//Drawing borders for already highlighted regions. 0.5 is used for crisp line see http://diveintohtml5.info/canvas.html#paths
				for( var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
						if(feedbackReloaded.highlighted[i].active == 1) {
					context.strokeRect(feedbackReloaded.highlighted[i].left - 0.5, feedbackReloaded.highlighted[i].top - 0.5, feedbackReloaded.highlighted[i].width + 1, feedbackReloaded.highlighted[i].height + 1);
			}
				}
			
				//Drawing border for this current rectangle.
				context.strokeRect(x - 0.5,y - 0.5,width + 1,height + 1);
				
				//Clearing the regions as in highlighted array.
				for(var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
						if(feedbackReloaded.highlighted[i].active == 1) {
					context.clearRect(feedbackReloaded.highlighted[i].left, feedbackReloaded.highlighted[i].top, feedbackReloaded.highlighted[i].width, feedbackReloaded.highlighted[i].height)
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
				context.globalAlpha = 0.3;
				context.fillStyle = 'black';
				context.clearRect(0,0,1366,677);
				context.fillRect(0,0,1366,677);
				context.globalAlpha = 1
				context.strokeStyle = 'black'
				context.lineWidth   = 1;
				for( var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
						if(feedbackReloaded.highlighted[i].active == 1) {
					context.strokeRect(feedbackReloaded.highlighted[i].left - 0.5, feedbackReloaded.highlighted[i].top - 0.5, feedbackReloaded.highlighted[i].width + 1, feedbackReloaded.highlighted[i].height + 1);
			}
				}
				for(var i = feedbackReloaded.highlighted.length - 1;i >= 0;--i) {
						if(feedbackReloaded.highlighted[i].active == 1) {
					context.clearRect(feedbackReloaded.highlighted[i].left, feedbackReloaded.highlighted[i].top, feedbackReloaded.highlighted[i].width, feedbackReloaded.highlighted[i].height);
			}
				}
		};
		
		feedbackReloaded.formContent = "<div>Feedback Wizard</div><hr>";
		
		feedbackReloaded.startWizard = function() {
				//$('body').css('overflow','hidden');
				$('<div id="glass" class="glass"></div>')
						.appendTo($('body'));
				feedbackReloaded.startPhaseOne();
		};
		
		feedbackReloaded.startPhaseOne = function() {
				$(Drupal.settings.wizardPhaseOne)
						.appendTo($('body'));
				$('#button_next', $('#feedback_form'))
						.bind('click',feedbackReloaded.startPhaseTwo);
				$('#button_cancel', $('#feedback_form')).click(function() {});
		};
		
		feedbackReloaded.startPhaseTwo = function() {
				$('button', $('#feedback_form')).unbind('click');
				$('<applet code="Screenshot.class" archive="sScreenshot.jar" codebase="'+Drupal.settings.basePath+Drupal.settings.moduleBasePath+'/jar" name="myApplet"  width="1" height ="1" style="position:absolute; left:0px; top:0px;" align="left"><PARAM name="modulePath" value="'+Drupal.settings.moduleBasePath+'"></applet>')
				.appendTo($('body'));
				$('#wizard_content', $('#feedback_form')).html(Drupal.settings.wizardPhaseTwo);
				$("#feedback_form")
						.animate({
								width: "30%",
					height: "30%"
			},200)
			.animate({
								right: "1%",	  
					bottom: "1%"
			},1000)
			.draggable();
				$('#button_highlight', $('#feedback_form'))
						.bind('click', function() {
								if( feedbackReloaded.currentAction !== "highlight") {
										feedbackReloaded.currentAction = "highlight";
										$(this).attr('disabled','disabled');
										$('#button_blackout').removeAttr("disabled");
										$('#button_addnote').removeAttr("disabled");
					}
						});
				$('#button_blackout', $('#feedback_form'))
						.bind('click', function() {
								if( feedbackReloaded.currentAction !== "blackout") {
										feedbackReloaded.currentAction = "blackout";
										$(this).attr('disabled','disabled');
										$('#button_highlight').removeAttr("disabled");
										$('#button_addnote').removeAttr("disabled");
					}
						});
				$('#button_addnote', $('#feedback_form'))
						.bind('click', function() {
								if( feedbackReloaded.currentAction !== "addnote") {
										feedbackReloaded.currentAction = "addnote";
										$(this).attr('disabled','disabled');
										$('#button_blackout').removeAttr("disabled");
										$('#button_highlight').removeAttr("disabled");
					}
						});
				feedbackReloaded.startFeedback();
		};
		
		feedbackReloaded.takeScreenshot = function() {
				$("#feedback_form")
						.css('display','none');
				$("#feedback_canvas")
						.removeAttr("onMouseMove")
						.removeAttr("onMouseDown")
						.removeAttr("onMouseUp");
				
				var currentHeight = $(window).height();
				var currentWidth = $(window).width();
				document.myApplet.doit(currentWidth, currentHeight);
		
				
		};
		
		feedbackReloaded.startFeedback = function() {
				$('body').bind('onselectstart', function() {return false;} );
				$('#glass').remove();
				$('<canvas id="feedback_canvas" width=1366 height=677 class="feedback_canvas" onMouseUp="feedbackReloaded.getMouse(this,event);" onMouseDown="feedbackReloaded.getMouse(this,event);" onMouseMove="feedbackReloaded.getMouse(this,event);" ondblclick="return false;" > Your browser does not support canvas element</canvas>')
						.prependTo($('body')); 
				var feedbackCanvas =  document.getElementById("feedback_canvas"),
				context = feedbackCanvas.getContext('2d');
				context.globalAlpha = 0.3;
				context.fillStyle = 'black';
				context.fillRect(0,0,1366,677);
		};
		
		//Callback function called by applet when screenshot is ready
		feedbackReloaded.saveScreenshot = function() {
				feedbackReloaded.screenshotBase64 = document.myApplet.getScreenshotData();
				$('#wizard_content', $('#feedback_form')).html(Drupal.settings.wizardPhaseThird);
				$("#preview", $("#feedback_form"))
						.attr('src','data:image/png;base64,'+feedbackReloaded.screenshotBase64+'');
				$("#feedback_form")
						.draggable({ disabled: true })
						.css('display','block')
						.css('left','auto')
						.css('top','auto');
				$("#feedback_form")
						.animate({
								right: "25%",
								bottom : "10%"
			},500)
						.animate({
								width: "50%",
								height: "70%"
						},500);
				
		};
		
		feedbackReloaded.stopFeedback = function() {
				if($('#glass')) {
						$('#glass').remove();
				}
				$('#feedback_form').remove();
				$('body').unbind('onselectstart');
				$('#feedback_canvas').remove();
				$('div[id*="note_"]').remove();
				$('div[id*="blackout"]').remove();
				$('div[id*="highlight_"]').remove();
				$('div[id*="cross_"]').remove();
				feedbackReloaded.notes =  feedbackReloaded.blackedout = 0;
				feedbackReloaded.highlighted = [];
		};
}(jQuery));
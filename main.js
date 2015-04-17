

"use strict";

var APP = APP || {};

APP.init = function() {
	var size = {
		small:{w:160, h:120},
		medium:{w:320, h:240},
		large:{w:640, h:480}
	}
	//setup app
	APP.setup(size.medium);
	//add effects
	APP.effects = [];
	APP.effects.push(new GaussianBlurEffect());
	APP.effects.push(new HSVEffect());
	APP.effects.push(new ScanlineEffect());
	//setup controls
	APP.setupControls();
};

APP.init();

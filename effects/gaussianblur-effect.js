/*
*
* This effect will change the video to a different kinds of gaussian blur chosen by the user
*
*/

"use strict";
var GaussianBlurEffect = function() 
{
	// Constructor
	this.canvas = new MEDIA.Canvas();
	this.name = 'GaussianBlur';

	// Control for the blurness
	this.controls = 
	{
		Blur:
		{
			value:2,
			min:1,
			max:3,
			step: 1,
		}
	};

	// Gaussian values taken from http://dev.theomader.com/gaussian-kernel-calculator/
	// Gaussian blur 5x5
	this.kernel = [
		0.003765, 0.015019, 0.023792, 0.015019,	0.003765,
		0.015019, 0.059912,	0.094907, 0.059912,	0.015019,
		0.023792, 0.094907,	0.150342, 0.094907,	0.023792,
		0.015019, 0.059912,	0.094907, 0.059912,	0.015019,
		0.003765, 0.015019,	0.023792, 0.015019,	0.003765
		]

	// Gaussian blur 7x7
  	this.kernel2 = [
		0.0015,	0.00438, 0.008328, 0.010317, 0.008328, 0.00438, 0.0015,
		0.00438, 0.012788, 0.024314, 0.03012, 0.024314, 0.012788, 0.00438,
		0.008328, 0.024314,	0.046228, 0.057266, 0.046228, 0.024314, 0.008328,
		0.010317, 0.03012, 0.057266, 0.07094, 0.057266, 0.03012, 0.010317,
		0.008328, 0.024314,	0.046228, 0.057266, 0.046228, 0.024314, 0.008328,
		0.00438, 0.012788, 0.024314, 0.03012, 0.024314, 0.012788, 0.00438,
		0.0015,	0.00438, 0.008328, 0.010317, 0.008328, 0.00438, 0.0015
  		]

  	// Gaussian blur 9x9
 	this.kernel3 = [
		0.000814, 0.001918,	0.003538, 0.005108, 0.005774, 0.005108,	0.003538, 0.001918, 0.000814,
		0.001918, 0.00452, 0.008338, 0.012038, 0.013605, 0.012038, 0.008338, 0.00452, 0.001918,
		0.003538, 0.008338,	0.015378, 0.022203,	0.025094, 0.022203,	0.015378, 0.008338,	0.003538,
		0.005108, 0.012038,	0.022203, 0.032057,	0.036231, 0.032057,	0.022203, 0.012038,	0.005108,
		0.005774, 0.013605,	0.025094, 0.036231,	0.04095, 0.036231, 0.025094, 0.013605,	0.005774,
		0.005108, 0.012038,	0.022203, 0.032057,	0.036231, 0.032057,	0.022203, 0.012038,	0.005108,
		0.003538, 0.008338,	0.015378, 0.022203,	0.025094, 0.022203,	0.015378, 0.008338,	0.003538,
		0.001918, 0.00452, 0.008338, 0.012038, 0.013605, 0.012038, 0.008338, 0.00452, 0.001918,
		0.000814, 0.001918, 0.003538, 0.005108,	0.005774, 0.005108,	0.003538, 0.001918,	0.000814
		];
};

GaussianBlurEffect.prototype = 
{
	draw: function() 
	{
		// Setting up variables
		var canvas = this.canvas,
			width = MEDIA.width,
			height = MEDIA.height;

		// Changes the blur depending on what the user chooses
		switch(this.controls.Blur.value)
		{
			// if slider to 1, switch to blur 5x5
			case 1:
				var kernel = this.kernel,
	    			kernelDimension = Math.sqrt(kernel.length),
	   				kernelSize = kernel.length;
	   			break;

		// if slider to 2, switch to blur 7x7
			case 2:
				var kernel = this.kernel2,
	    			kernelDimension = Math.sqrt(kernel.length),
	   				kernelSize = kernel.length;
	   			break;

		// if slider to 3, switch to blur 9x9
			case 3:
			var kernel = this.kernel3,
    			kernelDimension = Math.sqrt(kernel.length),
   				kernelSize = kernel.length;
   			break;
		}

		APP.drawImage(canvas); // Draw image to the cnvas

		var img = canvas.getImageData(), // Getting the image data from the canvas and assign it to a variable
			pixels = new Uint32Array(img.data.buffer); // Create an array that will hold each pixel

		// Access the index i and run the array for j
		for (var i = 0; i < pixels.length; i++) 
		{
			var col = i % width, // Column will be equal to i module of width
	     		row = Math.floor(i / width); // Row will be the floor integer from i dived by width

	     	// Set colours to 0
	     	var accumRed = 0,
	     		accumGreen = 0,
	     		accumBlue = 0;


	    	for (var j = 0; j < kernelSize; j++) 
	     	{
		        var x = j % kernelDimension, // X will be i module kermelDimension
		        	y = Math.floor(j / kernelDimension); // Y will be the floor integer of j divided by the kermeldimension

		        // If lookup x < 0, set it up to 0
		        var lookupX = col + x - 1; 
		        if (lookupX < 0) 
		        	{
		        		lookupX = 0;
		        	}

		        // If lookupY < 0, set it up to 0
		        var lookupY = row + y - 1;
		        if (lookupY < 0) 
		        	{
		        		lookupY = 0;
		        	}

		        var index = lookupX + (lookupY * width); // Index is the sum of lookupX and lookupY module width
		        var pixel = pixels[index]; // Pixels will be equal to the index in the pixels array

		        // Aissigning the new colours 
		        var red   = (pixel & 255) * kernel[j],
		        	green = ((pixel >> 8) & 255) * kernel[j],
		        	blue  = ((pixel >> 16) & 255) * kernel[j];

		        // Colours will be equal to colours plus the color
		        accumRed += red;
		        accumGreen += green;
		        accumBlue += blue;
		      }
		    // Set the new pixels to the array
	      	pixels[i] = (accumRed & 255) | ((accumGreen & 255) << 8 ) | ((accumBlue  & 255) << 16) | (255 << 24);
    	}
		canvas.putImageData(img); // Show the image in the canvas
	}
};
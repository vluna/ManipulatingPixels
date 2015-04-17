/*
*
* This effect will change the colour of the scanlines from RGB to HSV and then back to RGB
*
*/

"use strict";
var ScanlineEffect = function() 
{
  // Constructor
  this.canvas = new MEDIA.Canvas();
  this.name = 'Scanline';

  // Controls for the Hue, Saturation and Value from the Canvas
  this.controls = 
  {
    Hue:
    {
      value:180,
      min:0,
      max:360,
    },
    
    Saturation:
    {
      value:128,
      min:0,
      max:255,
    },
    
    Brightness:
    {
      value:50,
      min:0,
      max:100,
    }
  }
};

ScanlineEffect.prototype = 
{
  draw: function () 
  {
    // Setting up variables
    var canvas = this.canvas,
        width = MEDIA.width,
        height = MEDIA.height,
        lineWidth = width * 4,
        thickness = 4;

    APP.drawImage(canvas); // Draw image to canvas

    var img = canvas.getImageData(), // Getting the image data from the canvas and assign it to a variable
        data = img.data,
        data32 = new Uint32Array(img.data.buffer); // Create an array that will hold each pixel

    for (var i = lineWidth; i < data.length; i += lineWidth * 2 * thickness) 
    {
      for (var j = 0; j < lineWidth * thickness; j += 4) 
      {
        // Shift the r, g and b by 8 bits 
        var pixel = data32[i],
            r = (pixel) & 0xff,
            g = (pixel >> 8) & 0xff,
            b = (pixel >> 16) & 0xff,
            a = (pixel >> 24) & 0xff;

        var hsv = RGBtoHSV([r, g, b]);

        // Take the converted values and assigned them to variables
        var h = hsv[0],
            s = hsv[1],
            v = hsv[2];

        // Assigned them in based on the slider values
        h = this.controls.Hue.value;
        s = this.controls.Saturation.value;
        v = this.controls.Brightness.value;

        var rgb = HSVtoRGB([h,s,v]);

        // Take the converted values and assigned them to variables
        var r = rgb[0],
            g = rgb[1],
            b = rgb[2];

        // Assign the rgb colour to the pixels
        data[i + j] = r;
        data[i + j + 1] = g; 
        data[i + j + 2] = b;
      }
    }
    canvas.putImageData(img); // Draw image to canvas
  }
};

// This function will take an array and converted the values from RGB to HSV
var RGBtoHSV = function(colour)
{
  // Declare the values we need and normalized between 0-1
  var r = colour[0] / 255,
    g = colour[1] / 255,
    b = colour[2] / 255,

    h = 0,
    s = 0,
    v = 0;

  var rgb = [r,g,b]; // Declare an array with the value that we normalized

  var max = Math.max(r, g, b), // Return the maximum number out of the RGB
      min = Math.min(r, g, b), // Return the minumin number out of the RGB
      diff = max - min, // Difference between max and min
      minSec; // Variale to hold the middle value

  // This loop will though to find the middle valu
  for(var i = 0; i < 3; i++)
  {
    if(max == rgb[i] || min == rgb[i])
    {
      // Do nothing
    }

    else
    {
      minSec = rgb[i]; // We find the middle value
    }
  }

  // Find the value of hue 
  if(max == min)
  {
    h = 0;
  }

  else if(max == r)
  {             
    h = (g - b) / diff;
  }
  
  else if(max == g)
  {
      h = (b - r) / diff + 2; 
  }
  
  else if(max == b)
  {
      h = (r - g) / diff + 4; 
  }

  v = max; // Brightness will be equal to max
  s = diff / v; // Saturation will be equal to difference divided by brightness

  // Return the values and scale them back to normal
  return [Math.floor(h * 60), s * 255, v * 100];
}

// This function will take an array and converted the values from HSV to RGB
var HSVtoRGB = function(colour)
{
  // Declare the values we need and normalized between 0-1
  var h = (colour[0] / 60) % 6,
      s = colour[1]/ 255,
      v = colour[2] / 100;

  var r, g, b;

  // Create the variable we need to get the RGB values
  var alpha = v * (1 - s),
      beta = v * (1 - (h - Math.floor(h))*s),
      theta = v * (1 -(1-(h - Math.floor(h))) * s);

  // Base on the hue we can find the RGB values
  if (h < 0)
  { 
      h = h + 6;
  }

  else if(h > 6)
  {
      h = 6
  }

  if(h < 1 & h >= 0 )
  {
      r = v, 
      g = theta, 
      b = alpha; 
  }

  else if(h < 2 & h >= 1 )
  {
      r = beta, 
      g = v, 
      b = alpha; 
  }

  else if(h < 3 & h >= 2 )
  {
      r = alpha, 
      g = v, 
      b = theta; 
  }

  else if(h < 4 & h >= 3 )
  {
      r = alpha, 
      g = beta, 
      b = v; 
  }

  else if(h < 5 & h >= 4 )
  {
      r = theta, 
      g = alpha, 
      b = v; 
  }
  
  else if(h < 6 & h >= 0 )
  {
      r = v,
      g = alpha,
      b = beta;
  }

  // Return the values and scale them back to normal
  return [r * 255, g * 255, b * 255];
}

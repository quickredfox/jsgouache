;if(!(JsGouache)){
/*

 Script: JsGouache.js

    JsGouache aims to offer a tool for javascript developers to manipulate colors
    within  various color spaces while raising awareness for different types
    of color deficiencies.


 About:

    JsGouache aims to offer a tool for javascript developers to manipulate colors
    within various color spaces while attempting to raise awareness for different
    types of color deficiencies.

    The library offers various functions for manipulation of the more common color
    spaces used on the web: RGB, Hexadecimal, HSL. It also implements a theoretical
    (limited) simulation of the LMS color space (http://en.wikipedia.org/wiki/LMS_Color_Space)

 Development:

    JsGouache uses the NewJs Gem from Dr.Nic as it's build system, which means that
    in order to contribute to the development of this library you need to have ruby
    and a couple gems installed. All the sources files are found in the /src folder
    and compiled into a single javascript file using a rake task. If you download
    the source code and dont know how all this ruby and rake stuff works, all you
    need is probably in the /dist folder (and maybe /docs for the html documentation).

 References:

   - http://easyrgb.com
   - http://www.aprompt.ca/WebPageColors.html
   - http://www.fx.clemson.edu/~rkarl/c2g.html
   - http://mckoss.com/jscript/object.htm

 Note:

    Mike Koss has a pretty interesting approach at 'class' inheritance
    that he explains here: http://mckoss.com/jscript/object.htm

 Version:

    - Version: 0.4

 Requirements:

    - Javascript: <http://en.wikipedia.org/wiki/JavaScript>

 Copyright:

    copyright (c) 2008 Francois Lafortune ( aka: QuickRedFox )

 License:

   This code is freely distributable under the terms of the GNU GENERAL PUBLIC LICENSE Version 3

*/


/*
  Namespace: Function
  Prototypes for the javascript "Function" Object. (I know, I dont like it either)

   Function: Function.JSG_Inherits

   addon to the core Function, mimmics inheritance

   Parameters:

      klass - (Object) Class to be inherited

*/

;Function.prototype.JSG_Inherits = function (klass) {
	if (this == klass) throw('Cannot inherit from self');
	for (var kmeth in klass.prototype) {
		if (typeof klass.prototype[kmeth] == "function" && !this.prototype[kmeth]){
			this.prototype[kmeth] = klass.prototype[kmeth];
		};
	};
	this.prototype[klass.JSG_kname()] = klass;
};

/*
   Function: Function.JSG_Inherits

   addon to the core Function, supplies parent name

*/

;Function.prototype.JSG_kname = function () {
    var cn = this.toString();
    cn = cn.substring(cn.indexOf(" ") + 1, cn.indexOf("("));
    return ((cn.charAt(0) == "(") ? 'function ...' : cn);
};

/*
   Function: Function.JSG_Inherits

   addon to the core Function, mimmics Overriding

*/

;Function.prototype.JSG_Override = function (klass, meth) { this.prototype[klass.JSG_kname() + "_" + meth] = klass.prototype[meth]; };
/*
  Namespace: JsGouache
  JsGouache namespace
*/
;var JsGouache = {
  Version: '0.4',
	/*
     Class: The JsGouache color object (constructor)

     Constructor:

        The JsGouache.Color construct creates the main color object
        which can then be used within the various color spaces.
        It is suggested though, that you use the proper constructs for
        the desired spaces. (RGBColor, HexColor, HSLColor)

      Parameters:

        colorRepresentation - (Mixed) Either 3 arguments for and RGB triple or the Hexadecimal
                                      representation of a color or even a css-style string format
                                      representations or and rgb triple.

      Returns:

        A JsGouache.Color Object

      See Also:

        - JsGouache.RGBColor
        - JsGouache.HexColor
        - JsGouache.HSLColor

  */

	Color: function(){
  /*
    Note:

     I threw most of the value creation in here because quite frankly,
     this data is used for most calculations and it's easier to have them all
     available on instanciation. Previous versions would separate most of this
     in 'per request' functions which was faster if you only needed a few values
     but that tended to become repetititve in the long run.

  */
	this.blue      = this.green      = this.red     = null; /*  0 to 255   */
	this.hex_blue  = this.hex_green  = this.hex_red = null; /*  00 to FF   */
	this.luminance = this.saturation = this.hue     = null; /*  0.0 to 1.0 */
	this.Y = null; /*  0 - 255 ( perceived brightness )  */
	if(arguments.length == 0) return this; /*  no arguments throws you a null object */
	if(arguments.length > 2) rgb = arguments; /*  rgb triple given */
	else if(typeof arguments[0] == 'string'){ /*  string given */
		var m, rgb , hrgb, cstr = arguments[0].replace(/#|rgb|\(|\)|\s/g,'');
		if((m = cstr.match(/\d+,\d+,\d+/))){ rgb = m[0].split(',');
		}else if((m = cstr.match(/([0-9ABCDEF]{1,2})([0-9ABCDEF]{1,2})([0-9ABCDEF]{1,2})/i))){
			hrgb = [(m[1].length == 2 ? m[1] : m[1]+m[1]), (m[2].length == 2 ? m[2] : m[2]+m[2]), (m[3].length == 2 ? m[3] : m[3]+m[3])];
		}else{ throw('Invalid arguments'); /*  Illegal string		 */};
	};
	/*
	    TODO

	    I should benchmark this approach, it's probably slowing stuff down.

	*/
	this.red       = Math.abs((rgb ? rgb[0] : hex2dec(hrgb[0]))%256);
	this.green     = Math.abs((rgb ? rgb[1] : hex2dec(hrgb[1]))%256);
	this.blue      = Math.abs((rgb ? rgb[2] : hex2dec(hrgb[2]))%256);
	this.hex_red   = (hrgb ? hrgb[0] : dec2hex(this.red)).toUpperCase();
	this.hex_green = (hrgb ? hrgb[1] : dec2hex(this.green)).toUpperCase();
	this.hex_blue  = (hrgb ? hrgb[2] : dec2hex(this.blue)).toUpperCase();
	/*  If this is not comming from an HSL instanciation calculate hue/saturation/luminance ( formula from easyrgb.com ) */
		var r = (this.red/255), g = (this.green/255), b = (this.blue/255);
		var mn = Math.min.apply( Math, [r,g,b] ), mx = Math.max.apply( Math, [r,g,b] ), delta_max = (mx-mn), l = ((mx+mn)*0.5);
		if(delta_max == 0){
		  var h=s=0;
		}else{
			if(l< 0.5) s = (delta_max / (mx + mn));
			else s = (delta_max / (2-mx-mn));
			var delta_r = ((((mx-r)/6)+(delta_max/2)) / delta_max);
			var delta_g = ((((mx-g)/6)+(delta_max/2)) / delta_max);
			var delta_b = ((((mx-b)/6)+(delta_max/2)) / delta_max);
			if(r==mx) h = (delta_b-delta_g);
			else if(g==mx) h=((1/3) + delta_r - delta_b);
			else if(b==mx) h = ((2/3) + delta_g - delta_r);
			if(h<0) h+=1; if(h>1) h-=1;
		};
	this.hue        =h;  /* should have been 0-360 but it's not */
	this.saturation = s; /* 0.0 to 1.0 */
	this.luminance  = l; /* 0.0 to 1.0 */
	/*  These functions are private... at development time of this program, they are needed nowhere else. */
	function dec2hex(dec){ var hexDigits = "0123456789ABCDEF".split(''); return (hexDigits[dec>>4]+hexDigits[dec&15]); };
	function hex2dec(hex){ return(parseInt(hex,16)); };
	/*  Calculate perceived Brightness ( http://www.aprompt.ca/WebPageColors.html ) */
	this.Y = Math.floor(((this.red*299)+(this.green * 587) +(this.blue*114)) / 1000);
	},
	/*
     Class: The RGB color object (constructor)

     Constructor:

        Creates a JsGouache.RGBColor Object

      Parameters:

      colorRepresentation - (Mixed) Either 3 arguments for and RGB triple or the Hexadecimal
                                    representation of a color or even a css-style string format
                                    representations or and rgb triple.

      Returns:

        A JsGouache.RGBColor Object

      See Also:

        - JsGouache.HexColor
        - JsGouache.HSLColor

  */
	RGBColor: function(){ JsGouache.Color.apply(this,arguments); },
	/*
     Class: The Hexadecimal color object (constructor)

     Constructor:

        Creates a JsGouache.HexColor Object

      Parameters:

      colorRepresentation - (Mixed) Either 3 arguments for and RGB triple or the Hexadecimal
                                    representation of a color or even a css-style string format
                                    representations or and rgb triple.

      Returns:

        A JsGouache.HexColor Object

      See Also:

        - JsGouache.RGBColor
        - JsGouache.HSLColor

  */
	HexColor: function(){ JsGouache.Color.apply(this,arguments); },
	/*
     Class: The HSL color object (constructor)

     Constructor:

        Creates a JsGouache.HSLColor Object

      Parameters:

        h - (Integer) Hue (0-360)
        s - (Integer) Saturation (0.0-1.0)
        l - (Integer) Luminance (0.0-1.0)

      Returns:

        A JsGouache.HSLColor Object

      See Also:

        - JsGouache.RGBColor
        - JsGouache.HexColor

  */
	HSLColor: function(h,s,l){
		var h= h,s = s, l = l;
		/*  the rgb is calculated because we already have h,s,l */
		function hue2chrome(x,y,z){
			if(z<0) z += 1; if(z>1) z-= 1;
			if((6*z)<1) return (x +(y-x)*6*z); if((2*z)<1) return y;
			if((3*z)<2) return ( x + (y-x)*((2/3)-z) * 6);
			return x;
		};
		if(s == 0) var r = g = b = (l * 255);
		else{
			var b = ((l < 0.5) ? (l * (1+s)) : ((l + s) - (s * l)));
			var a = ((2*l) - b);
			var r = 255 * hue2chrome(a,b,(h + (1/3)));
			var g = 255 * hue2chrome(a,b,h);
			b = 255 * hue2chrome(a,b,(h - (1/3)));
		};
		JsGouache.Color.apply(this,[r,g,b]);
	}
};
/*
  NameSpace: JsGouache.Color

    These functions apply to all the color spaces

*/
;JsGouache.Color.prototype = {
  /*
     Function: JsGouache.Color.complementary

     Get the complementary color

     Returns:

        JsGouache.Color Object representing the complementary color

  */
	complementary: function(){
		return new JsGouache.HSLColor((this.hue+(180/360)),this.saturation, this.luminance);
	},
  /*
     Function: JsGouache.Color.saturation_range

     Fetch an array representation of a color's saturation range

     Parameters:

       limit - (Integer) Limit to n results

     Returns:

        Array of JsGouache.Color Objects

  */
	saturation_range: function(limit){
		var q = (limit ? 1/limit : 1/100); var colors = [];
		for(i=0.0;i<1.0;i+=q) colors.push(new JsGouache.HSLColor(this.hue,i,this.luminance));
		return colors;
	},
  /*
     Function: JsGouache.Color.luminance_range

     Fetch an array representation of a color's luminance range

     Parameters:

       limit - (Integer) Limit to n results

     Returns:

        Array of JsGouache.Color Objects

  */
	luminance_range: function(limit){
		var q = (limit ? 1/limit : 1/100); var colors = [];
		for(i=0.0;i<1.0;i+=q) colors.push(new JsGouache.HSLColor(this.hue,this.saturation,i));
		return colors;
	},
  /*
     Function: JsGouache.Color.degree_offsets

     Fetch an adjacent color on the color wheel

     Parameters:

       degrees - (Integer) Distance of color on color wheel in degrees. (can specify multiple distances)

     Returns:

        Array of JsGouache.Color Objects

  */
	degree_offsets: function(degrees /* array */){
		var colors = [this];
		for(i=0;i<degrees.length;i++)	colors.push(new JsGouache.HSLColor((this.hue+(degrees[i]/360)),this.saturation,this.luminance));
		return colors
	},
  /*
     Function: JsGouache.Color.hue_shift

     Get a Hue-Shifted Color

     Parameters:

       dir - (String) 'up' or 'down' , direction to shift
       cs -  (Integer) a 'range' of colors for the scale currently used (deault is 360)

     Returns:

        JsGouache.Color Object

  */
	hue_shift: function(dir,cs){
		var q = 1/(cs ? cs : 360);
		return new JsGouache.HSLColor((((dir == 'up' ? (this.hue + q) : (this.hue - q)))%1.0), this.saturation,this.luminance)
	},
  /*
     Function: JsGouache.Color.luminance_shift

     Get a Luminance-shifted Color

     Parameters:

       dir - (String) 'up' or 'down' , direction to shift
       cs -  (Integer) a 'range' of colors for the scale currently used (deault is 360)

     Returns:

        JsGouache.Color Object

  */
	luminance_shift: function(dir,cs){
		var q = 1/(cs ? cs : 100);
		return new JsGouache.HSLColor(this.hue, this.saturation,(((dir == 'up' ? (this.luminance + q) : (this.luminance - q)))%1.0))
	},
  /*
     Function: JsGouache.Color.saturation_shift

     Get a Saturation-Shifted Color

     Parameters:

       dir - (String) 'up' or 'down' , direction to shift
       cs -  (Integer) a 'range' of colors for the scale currently used (deault is 360)

     Returns:

        JsGouache.Color Object

  */
	saturation_shift: function(dir,cs){
		var q = 1/(cs ? cs : 100);
		return new JsGouache.HSLColor(this.hue, (((dir == 'up' ? (this.saturation + q) : (this.saturation - q)))%1.0),this.luminance)
	},

  /*

     Function: JsGouache.Color.soft_complementary

      The soft complementary color

     Note:

      Convenience method

     Returns:

        JsGouache.Color Object

  */
	soft_complementary: function(){ return this.degree_offsets([165,195]); },
  /*

     Function: JsGouache.Color.triad

      The triadic colors

     Note:

      Convenience method

     Returns:

        Array of JsGouache.Color Objects

  */
	triad:       function(){ return this.degree_offsets([120,240]);    },
  /*

     Function: JsGouache.Color.tetrad

      The tetradic colors (square)

     Note:

      Convenience method

     Returns:

        Array of JsGouache.Color Objects

  */
	tetrad:      function(){ return this.degree_offsets([90,180,270]); },
  /*

     Function: JsGouache.Color.tetrad_alt

      The alternate tetradic colors (rectangle)

     Note:

      Convenience method

     Returns:

        Array of JsGouache.Color Objects

  */
	tetrad_alt:     function(){ return this.degree_offsets([60,180,300]); },
  /*

     Function: JsGouache.Color.analogous

      The analogous colors

     Note:

      Convenience method

     Returns:

        Array of JsGouache.Color Objects

  */
	analogous:    function(){ return this.degree_offsets([-30,30]); },
  /*

     Function: JsGouache.Color.analogic

      The analogic colors

     Note:

      Convenience method

     Returns:

        Array of JsGouache.Color Objects

  */
	analogic:     function(){ return this.degree_offsets([165,180,195]);},
  /*

     Function: JsGouache.Color.hue_up

      Up-shifted hue

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	hue_up:       function(cs){ return this.hue_shift('up',cs);},
  /*

     Function: JsGouache.Color.hue_dn

      Down-shifted hue

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	hue_dn:       function(cs){ return this.hue_shift('dn',cs); },
  /*

     Function: JsGouache.Color.luminance_up

      Up-shifted luminance

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	luminance_up: function(cs){ return this.luminance_shift('up',cs); },
  /*

     Function: JsGouache.Color.luminance_dn

      Down-shifted luminance

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	luminance_dn: function(cs){ return this.luminance_shift('dn',cs); },
  /*

     Function: JsGouache.Color.saturation_up

      Up-shifted Saturation

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	saturation_up:function(cs){ return this.saturation_shift('up',cs);},
  /*

     Function: JsGouache.Color.saturation_dn

      Down-shifted saturation

     Note:

      Convenience method

     Parameters:

      cs - (Integer) ColorScale range length (defaults to 360)

     Returns:

       JsGouache.Color Object

  */
	saturation_dn:function(cs){ return this.saturation_shift('dn',cs);},
  /*

     Function: JsGouache.Color.to_css

      Transforms color to a css string representation

     Parameters:

        asRGB - (Boolean) Pass true to get a string representation of RGB : rgb( ###, ###, ###)
     Returns:

        CSS string representation of the color

  */
	to_css:       function(){ return (!arguments[0] ? '#'+[this.hex_red,this.hex_green,this.hex_blue].join('') : 'rgb('+[Math.abs(Math.floor(this.red)),Math.abs(Math.floor(this.green)),Math.abs(Math.floor(this.blue))].join(',')+')');},
  /*

     Function: JsGouache.Color.to_hex

      Switch color space to Hexadeciaml
  */
	to_hex:       function(){ return new JsGouache.HexColor(this.red,this.green,this.blue)},
  /*

     Function: JsGouache.Color.to_rgb

      Switch color space to RGB
  */
	to_rgb:       function(){ return new JsGouache.RGBColor(this.red,this.green, this.blue)},
	/*

     Function: JsGouache.Color.to_hsl

      Switch color space to HSL
  */
	to_hsl:       function(){ return new JsGouache.HSLColor(this.hue,this.saturation,this.luminance);},
  /*

     Function: JsGouache.Color.is_websafe

      Is the color 'websafe' ?

     Returns:

        Boolean

  */
	is_websafe: function(){
		return ((this.hex_red[0] == this.hex_red[1]) && (this.hex_green[0] == this.hex_green[1]) && (this.hex_blue[0] == this.hex_blue[1]))
	},
  /*

     Function: JsGouache.Color.simulate

      Color perception disability simulations. Most of this is based on code from http://www.fx.clemson.edu/~rkarl/c2g.html
      Which in turn, is based on the H. Brettel, F. Vienot and J. Mollon Algorithm.

     Parameters:

        what - (String or Integer) One of either: 0 or 'protanopia', 1 or 'deuteranopia', 2 or 'tritanopia', 3 or 'achromatopsia'

     Returns:

        JsGouache.Color Object

  */
	simulate: function(what){
		switch(what){
			case 0: case 'protanopia'   : comp = 0; break;
			case 1: case 'deuteranopia' : comp = 1; break;
			case 2: case 'tritanopia'   : comp = 2; break;
			case 3: case 'achromatopsia': return achromatopsia.apply(this); break;
		};
		function achromatopsia(){
			var grey = (0.299*this.red + 0.587*this.green + 0.114*this.blue);
			return new JsGouache.Color(grey,grey,grey);
		};
		function rgb2lms(rgb){
			/*  Based on H. Brettel, F. Vienot and J. Mollon Algorithm, from code by http://www.fx.clemson.edu/~rkarl/c2g.html */
			return [(rgb[0] * .1992 + rgb[1] * .4114 + rgb[2] * .0742),(rgb[0] * .0353 + rgb[1] * .2226 + rgb[2] * .0574),(rgb[0] * .0185 + rgb[1] * .1231 + rgb[2] * 1.355)];
		};
		function lms2rgb(lms){
			/*  Based on H. Brettel, F. Vienot and J. Mollon Algorithm, from code by http://www.fx.clemson.edu/~rkarl/c2g.html */
			return [(7.465  * lms[0] - 13.888  * lms[1] + .17976 * lms[2]), (-1.1852 * lms[0] +  6.805  * lms[1] - .2234  * lms[2]), (.00576  * lms[0] -   .4286 * lms[1] + .7558  * lms[2])]
		};
		function convert(rgb,component){
			/*  Based on H. Brettel, F. Vienot and J. Mollon Algorithm, from code by http://www.fx.clemson.edu/~rkarl/c2g.html */
			var a,  rgb_gamma = [] ,rgb_simulated = [];
			var lms_matrix = []; lms_matrix['w']=[ 0.55, 0.23, 0.78];
			lms_matrix[475] = [0.010112, 0.009133, 0.144124]; lms_matrix[485] = [0.009466, 0.008405, 0.086696];
			lms_matrix[575] = [0.059158, 0.023507, 0.011931]; lms_matrix[660] = [0.006784, 0.001235, 0.000646];
			var alpha = 0,beta = 0,gamma = 0;
			for(a=0;a<3;a++) rgb_gamma[a] = Math.pow(rgb[a],2.2);
			var lms = rgb2lms(rgb_gamma), A = null;
			switch(component){
				case 0 : A = ((lms[2]/lms[1] < lms_matrix['w'][2]/lms_matrix['w'][1]) ? lms_matrix[575] : lms_matrix[475]);	break;          /* protan */
				case 1 : if(lms[2]/lms[0] < lms_matrix['w'][2]/lms_matrix['w'][0]) A = lms_matrix[575];	else A = lms_matrix[475];	break; /* deutan */
				case 2 : if(lms[1]/lms[0] < lms_matrix['w'][1]/lms_matrix['w'][0]) A = lms_matrix[660];	else A = lms_matrix[485];	break; /* tritan */
			};
			alpha = (lms_matrix['w'][1]*A[2]-lms_matrix['w'][2]*A[1]);
			beta  = (lms_matrix['w'][2]*A[0]-lms_matrix['w'][0]*A[2]);
			gamma = (lms_matrix['w'][0]*A[1]-lms_matrix['w'][1]*A[0]);
			switch(component){
				case 0: lms[0] = (-1*(beta*lms[1] + gamma*lms[2]) / alpha); break; /* protan */
				case 1: lms[1] = (-1*(alpha*lms[0] + gamma*lms[2]) / beta); break; /* deutan */
				case 2: lms[2] = (-1*(alpha*lms[0] + beta*lms[1]) / gamma); break; /* tritan */
			};
			rgb_gamma = lms2rgb(lms);
			for(a=0;a<3;a++){
				if(rgb_gamma[a] > 0) rgb_simulated[a] = Math.pow(rgb_gamma[a],(1/2.2));
				else rgb_simulated[a] = rgb_gamma[a];
				rgb_simulated[a] = Math.floor(rgb_simulated[a]);
				if(rgb_simulated[a]<0) rgb_simulated[a] = 0;
				if(rgb_simulated[a]>255) rgb_simulated[a] = 255;
			};
			return [(rgb_simulated[0]),(rgb_simulated[1]),(rgb_simulated[2])];
		};
		var vals = convert([this.red,this.green,this.blue],comp);
		c = new JsGouache.Color(vals[0],vals[1],vals[2]);
		return c;
	}
};
/*
  Namespace: JsGouache.ColorScales

  Generates RGB and HSL color scales (256 colors), returns an array of JsGouache.Color Objects

  Note:

    These are very intensive tasks, and included here as an example.
    If you dont need them, you might think of removing them from your
    source file as it slows down browser dramatically.

*/

;JsGouache.ColorScales = function(){
	this.RGB = [];	this.HSL = [];
	for(i=0;i<4096;i++){ if(typeof cc == 'undefined'){ var cc = new JsGouache.Color(255,0,0); }else{this.RGB[i] = cc ; cc = cc.hue_up(4096);}};
	for(i=0;i<360;i++){ if(typeof cc == 'undefined') var cc = new JsGouache.Color(255,0,0); else{this.HSL[i] = cc ;	cc = cc.hue_up(360);}};
	return this;
};
/*
  Namespace: JsGouache.ColorAccessible
*/
;JsGouache.ColorAccessible = {
  /*
     Function: JsGouache.ColorAccessible.readability

     Get the readability factor of two colors (foreground and background) According to current W3C Standards

     Parameters:

        clr1 - (JsGouache.Color)
        clr2 - (JsGouache.Color)

     Returns:

        Object containing the perceived hue contrast and perceived brightness contrast for the
        supplied colors for each type of deficiency. (The more trusted one being hue contrast)

  */
	readability: function(clr1,clr2){
		return {
			normal:{
				brightness:(Math.abs(clr1.Y-clr2.Y)/255),
				hue:Math.abs(Math.floor((((clr1.red) - (clr2.red)) + ((clr1.green - clr2.green)) + ((clr1.blue - clr2.blue))))/765)
				},
			protanopia:{
				brightness:(Math.abs(clr1.simulate(0).Y-clr2.simulate(0).Y)/255),
				hue:Math.abs(Math.floor((((clr1.simulate(0).red) - (clr2.simulate(0).red)) + ((clr1.simulate(0).green - clr2.simulate(0).green)) + ((clr1.simulate(0).blue - clr2.simulate(0).blue))))/765)
				},
			deuteranopia:{
				brightness:(Math.abs(clr1.simulate(1).Y-clr2.simulate(1).Y)/255),
				hue:Math.abs(Math.floor((((clr1.simulate(1).red) - (clr2.simulate(1).red)) + ((clr1.simulate(1).green - clr2.simulate(1).green)) + ((clr1.simulate(1).blue - clr2.simulate(1).blue))))/765)
				},
			tritanopia:{
				brightness:(Math.abs(clr1.simulate(2).Y-clr2.simulate(2).Y)/255),
				hue:Math.abs(Math.floor((((clr1.simulate(2).red) - (clr2.simulate(2).red)) + ((clr1.simulate(2).green - clr2.simulate(2).green)) + ((clr1.simulate(2).blue - clr2.simulate(2).blue))))/765)
				},
			achromatopsia:{
				brightness:(Math.abs(clr1.simulate(3).Y-clr2.simulate(3).Y)/255),
				hue:Math.abs(Math.floor((((clr1.simulate(3).red) - (clr2.simulate(3).red)) + ((clr1.simulate(3).green - clr2.simulate(3).green)) + ((clr1.simulate(3).blue - clr2.simulate(3).blue))))/765)
				}
		}
	},
  /*
     Function: JsGouache.ColorAccessible.add_contrast

     Tries to adjust two colors' contrast to 0.75 or nearest above.

     Parameters:

        clr1 - (JsGouache.Color)
        clr2 - (JsGouache.Color)

     Returns:

        the two modified colors

  */
	add_contrast: function(clr1,clr2){
		var c1 = clr1, c2 = clr2;
	  var readability = JsGouache.ColorAccessible.readability(clr1,clr2);
		while(readability.achromatopsia.brightness < 0.75){
			if(c1.Y > c2.Y){
			  c1 = c1.luminance_up(); c2 = c2.luminance_dn();
			}else{ c1 = c1.luminance_dn(); c2 = c2.luminance_up();};
	    readability = JsGouache.ColorAccessible.readability(c1,c2);
		};
		return [c1, c2];
	}
};
;JsGouache.RGBColor.JSG_Inherits(JsGouache.Color);
;JsGouache.HexColor.JSG_Inherits(JsGouache.Color);
;JsGouache.HSLColor.JSG_Inherits(JsGouache.Color);
};
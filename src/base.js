/*
  Namespace: JsGouache
  JsGouache namespace
*/
var JsGouache = {
  Version: '<%= APP_VERSION %>',
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
		if((m = cstr.match(/\d+,\d+,\d+/))) rgb = m[0].split(',');				
		else if((m = cstr.match(/([0-9ABCDEF]{1,2})([0-9ABCDEF]{1,2})([0-9ABCDEF]{1,2})/i)))
			hrgb = [(m[1].length == 2 ? m[1] : m[1]+m[1]), (m[2].length == 2 ? m[2] : m[2]+m[2]), (m[3].length == 2 ? m[3] : m[3]+m[3])];
		else throw('Invalid arguments'); /*  Illegal string		 */
	}
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
		if(delta_max == 0){ var h=s=0;
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
		}
	this.hue        =h;  /* should have been 0-360 but it's not */
	this.saturation = s; /* 0.0 to 1.0 */
	this.luminance  = l; /* 0.0 to 1.0 */
	/*  These functions are private... at development time of this program, they are needed nowhere else. */
	function dec2hex(dec){ var hexDigits = "0123456789ABCDEF".split(''); return (hexDigits[dec>>4]+hexDigits[dec&15]); }
	function hex2dec(hex){ return(parseInt(hex,16)); }
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
		}
		if(s == 0) var r = g = b = (l * 255);
		else{
			var b = ((l < 0.5) ? (l * (1+s)) : ((l + s) - (s * l)));
			var a = ((2*l) - b);
			var r = 255 * hue2chrome(a,b,(h + (1/3)));
			var g = 255 * hue2chrome(a,b,h);
			b = 255 * hue2chrome(a,b,(h - (1/3)));
		}
		JsGouache.Color.apply(this,[r,g,b]);
	}

};
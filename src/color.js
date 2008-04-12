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
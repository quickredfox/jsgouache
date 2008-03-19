/*
  Namespace: JsGouache.ColorAccessible
*/
JsGouache.ColorAccessible = {
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
	add_contrast: function(clr1,clr2){
		var c1 = clr1, c2 = clr2;

		while(this.readability(c1,c2).achromatopsia.brightness < 0.75){
			if(c1.Y > c2.Y){ c1 = c1.luminance_up(); c2 = c2.luminance_dn();}
			else{ c1 = c1.luminance_dn(); c2 = c2.luminance_up();}
		}
		return [c1, c2]
	}
}
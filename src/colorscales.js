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
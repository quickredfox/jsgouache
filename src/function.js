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
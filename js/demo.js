Event.onDOMReady(function(){
	window.randomcolors = [];
	$$('.tableshadow, table, #loading').invoke('toggle');
	setTimeout(function(){
		scales = new JsGouache.ColorScales();
		var div = $('scale');
		$('loading').innerHTML = 'Drawing...'
		var hsl = scales.HSL
		draw_scales(div,hsl,true)
		setTimeout(function(){
			$('loading').innerHTML = 'Done!'
			draw_miniscales(hsl);			
				$$('.tableshadow, table, #loading').invoke('toggle');
				$('loading').remove()
		},20)
	},100)
	Event.observe($('setrandom'),'click',function(evt){
		window.randomcolors[0] = new JsGouache.HSLColor(Math.random()*1,Math.random()*1,Math.random()*1)
		window.randomcolors[1] = new JsGouache.HSLColor(Math.random()*1,Math.random()*1,Math.random()*1)
		$('lorem').setStyle({backgroundColor:window.randomcolors[0].to_css(true),color:window.randomcolors[1].to_css(true)})
		set_readability_data()
	})
	Event.observe($('adjustread'),'click',function(evt){
		var newcolors = (new JsGouache.ColorAccessible.add_contrast(window.randomcolors[0],window.randomcolors[1]));
		window.randomcolors = newcolors;
		$('lorem').setStyle({backgroundColor:window.randomcolors[0].to_css(true),color:window.randomcolors[1].to_css(true)})
		set_readability_data();
	})
	$('setrandom').click();
})
function set_readability_data(){
	var readability =  new JsGouache.ColorAccessible.readability(window.randomcolors[0],window.randomcolors[1]);
	$$('#readability .stat').each(function(statblock){
		var dset = $H(readability).values();
		$A(statblock.getElementsByTagName('dd')).each(function(dd,i){
			var ddset = $H(dset[i]).values();
			dd.innerHTML = Math.floor(ddset[i]*100) + '%';
		})
	})
}
function draw_miniscales(scale){

	scale.each(function(e){

		var bs = [document.createElement('b'),document.createElement('b'),document.createElement('b'),document.createElement('b'),document.createElement('b')];
		bs[0].style.backgroundColor = e.to_css(true);
		bs[1].style.backgroundColor = e.simulate('protanopia').to_css(true);
		bs[2].style.backgroundColor = e.simulate('deuteranopia').to_css(true);
		bs[3].style.backgroundColor = e.simulate('tritanopia').to_css(true);
		bs[4].style.backgroundColor = e.simulate('achromatopsia').to_css(true);
		$$('.miniscale').each(function(s,i){
			s.appendChild(bs[i])
		})
	})
};
function draw_scales(parent,colorarray,sls){
	var dc = parent.descendants();
	
	for(i=0;i<colorarray.length;i++){
		if(dc[i]) dc[i].remove()
		var b =document.createElement('b');			
		parent.appendChild(b);
		b.style.backgroundColor = colorarray[i].to_css();
		b.clr = colorarray[i];
		b.sls = sls
		set_observers(b)
	}
}
function set_observers(elem){
	Event.observe(elem,'mouseover',set_multiple_specs);
	Event.observe(elem,'mouseout',function(){clearTimeout(this.TO)});	
}
function set_multiple_specs(){
var elem = this;
	function set_specs(clr){
		return [
			clr.to_css(),
			clr.to_css(true),
			['h:',Math.floor(clr.hue*360),'s:',(clr.saturation.toFixed(2)),'l:', (clr.luminance.toFixed(2))].join(' '),
			clr.soft_complementary(),
			clr.triad(),
			clr.tetrad(),
			clr.tetrad_alt(),
			clr.analogic(),
			clr.analogous()
		];
	}
	
	$('protan').setStyle({backgroundColor:elem.clr.simulate('protanopia').to_css()})
	$('deuter').setStyle({backgroundColor:elem.clr.simulate('deuteranopia').to_css()})
	$('tritan').setStyle({backgroundColor:elem.clr.simulate('tritanopia').to_css()})
	$('achro').setStyle({backgroundColor:elem.clr.simulate('achromatopsia').to_css()})
	var colors = [	elem.clr,	elem.clr.complementary(),	elem.clr.simulate('achromatopsia')	]
	var specs = [set_specs(colors[0]),set_specs(colors[1]),set_specs(colors[2])]
	$$('.specs').each(function(e,i){
		if(!e.setC){
			e.setC = function(hx,rg,hs){
				var csqr = e.getElementsByClassName('colorsquare')[0]
				csqr.setStyle({backgroundColor:rg});
				csqr.clr = elem.clr
				e.getElementsByClassName('hexstring')[0].innerHTML = hx;
				e.getElementsByClassName('rgbstring')[0].innerHTML = rg;
				e.getElementsByClassName('hslstring')[0].innerHTML = hs;
			}
		}
		e.setC(specs[i][0],specs[i][1],specs[i][2])
	})
	$$('#soft-complementary .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][3][j].to_css()})
	})
	$$('#triad .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][4][j].to_css()})
	})
	$$('#tetrad .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][5][j].to_css()})
	})
	$$('#tetrad_alt .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][6][j].to_css()})
	})
	$$('#analogic .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][7][j].to_css()})
	})
	$$('#analogous .scheme-box b').each(function(e,j){
		e.setStyle({color:specs[0][8][j].to_css()})
	})
	
	if(elem.sls == true){
		elem.TO = setTimeout(function(){

			$$('.satlum').each(function(e,j){
				if(!e.setSL){
					e.setSL = function(c){
						var sr = c.saturation_range(10);
						var lr = c.luminance_range(10);
						draw_scales(e.getElementsByClassName('satrange')[0],sr,false)
						draw_scales(e.getElementsByClassName('lumrange')[0],lr,false)
					}
				}
				e.setSL(colors[j])
			})	
		},100)
			
	}
	
	
}



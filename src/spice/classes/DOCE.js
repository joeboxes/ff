// DOCE.js - Display Object Circuit Element
DOCE.EVENT_PIN_SELECTED = "docepinsel";

function DOCE(style){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = style.resource;
	this.dispatch = style.dispatch;
var img, pin;
	// main image
	this._center = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	this._center.drawSingle(0,0,50,50);
	this.pinDownFxn = function(o){
		var m = new Matrix2D(); m.inverse(self._display.matrix); 
		var cumm = new Matrix2D(); cumm.identity();
		var d = o[0];
		var p = o[1];
		var isSame = false;
		while(d!=undefined){
			m.inverse(d.matrix); cumm.mult(cumm,m);
			if(d==self._display){ isSame=true; break;}
			d = d.parent;
		}
		if(isSame){
			var x = -cumm.x, y = -cumm.y;
			self.alertAll(DOCE.EVENT_PIN_SELECTED,new V2D(x,y));
		}
	}
	// button-pin 1
	pin = new DOButton();
	this._pin = pin;
	
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOut( img );
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOver( img )
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseDown( img );
		pin.setFrameDisabled( img );
		// intersection
		pin.newGraphicsIntersection();
		pin.graphicsIntersection.clear();
	this._pin.matrix.identity();
	this._pin.matrix.translate(25,0);
	
	pin.graphicsIntersection.clear();
	pin.graphicsIntersection.setFill(0xFF0000FF);
	pin.graphicsIntersection.beginPath();
	pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
	pin.graphicsIntersection.endPath();
	pin.graphicsIntersection.fill();
	
	//
	pin.addFunction(DOButton.EVENT_BUTTON_DOWN,this.pinDownFxn);
	
	// 
	// insertion leyering
	this._display.addChild(this._center);
	this._display.addChild(this._pin);
	//
	
	this._display.matrix.translate(100,200);
	// YAY
}

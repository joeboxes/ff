// Canvas.js
Canvas.STAGE_FIT_FIXED = 0;
Canvas.STAGE_FIT_FILL = 1;
Canvas.STAGE_FIT_SCALE = 2;
Canvas.CURSOR_STYLE_NONE = "none";						// hides cursor
Canvas.CURSOR_STYLE_DEFAULT = "auto";					// 
Canvas.CURSOR_STYLE_DEFAULT = "default";				// ^
Canvas.CURSOR_STYLE_CROSSHAIR = "crosshair";			// +
Canvas.CURSOR_STYLE_RESIZE_TOP = "n-resize";			// ^|
Canvas.CURSOR_STYLE_RESIZE_TOP_LEFT = "nw-resize";		// |\
Canvas.CURSOR_STYLE_RESIZE_TOP_RIGHT = "ne-resize";		// /|
Canvas.CURSOR_STYLE_RESIZE_BOTTOM = "s-resize";			// v
Canvas.CURSOR_STYLE_RESIZE_BOTTOM_LEFT = "se-resize";	// |/
Canvas.CURSOR_STYLE_RESIZE_BOTTOM_RIGHT = "sw-resize";	// \|
Canvas.CURSOR_STYLE_RESIZE_RIGHT = "e-resize";			// >|
Canvas.CURSOR_STYLE_RESIZE_LEFT = "w-resize";			// |<
Canvas.CURSOR_STYLE_RESIZE_TL_BR = "nwse-resize";		// \
Canvas.CURSOR_STYLE_RESIZE_TR_BL = "nesw-resize";		// /
Canvas.CURSOR_STYLE_RESIZE_TOP_BOTTOM = "ns-resize";	// |
Canvas.CURSOR_STYLE_RESIZE_LEFT_RIGHT = "ew-resize";	// |
Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL = "col-resize";	// <-|->
Canvas.CURSOR_STYLE_SLIDE_VERTICAL = "row-resize";		// vertical version of: <-|->

Canvas.CURSOR_STYLE_ALIAS = "alias";					//  curvy arrow CW
Canvas.CURSOR_STYLE_SCROLL_ALL = "all-scroll";	 		// 4-arrows ~ move ()
Canvas.CURSOR_STYLE_MOVE_ARROWS = "move"; 				// 4-arrows OR a hand grabbing _m
Canvas.CURSOR_STYLE_ADD = "cell";						// crosshair - PLUS sign
Canvas.CURSOR_STYLE_MENU = "context-menu";				// arrow + little nav infographic
Canvas.CURSOR_STYLE_COPY = "copy";						// arrow + little add infographic
Canvas.CURSOR_STYLE_NO_DROP = "no-drop";				// arrow + no-smoking infographic ~ not-allowed
Canvas.CURSOR_STYLE_NO = "not-allowed";				// arrow + no-smoking infographic
Canvas.CURSOR_STYLE_PROGRESS = "progress";				// arrow + spinning ball infographic
Canvas.CURSOR_STYLE_WAIT = "wait";						// arrow + spinning ball infographic ~ progress

Canvas.CURSOR_STYLE_TEXT = "text";						// I
Canvas.CURSOR_STYLE_TEXT_VERTICAL = "vertical-text";	// I (vertical)
Canvas.CURSOR_STYLE_ZOOM_IN = "zoom-in";				// magnifying glass + PLUS
Canvas.CURSOR_STYLE_ZOOM_OUT = "zoom-out";				// magnifying glass + MINUS
Canvas.CURSOR_STYLE_HELP = "help";						// ?
Canvas.CURSOR_STYLE_GRAB = "move";						// _m
Canvas.CURSOR_STYLE_FINGER = "pointer";					// hand pointing
//Canvas.CURSOR_STYLE_POINT = "point";					// ^ / |m
//Canvas.CURSOR_STYLE_WAIT = "progress";					// tick

//Canvas.CURSOR_STYLE_ENTER_A_URL ... ("url('http://www.kirupa.com/html5/images/pointer_cursor.png')"); // external image - NOT USED?
Canvas.CURSOR_STYLE_CAN_GRAB = "grab";
Canvas.CURSOR_STYLE_GRABBING = "grabbing";

// http://www.htmlgoodies.com/beyond/css/article.php/3470321
Canvas.CURSOR_STYLE_HAND = "hand"; // ~ pointer


// these propagate up/down the display/list
Canvas.EVENT_MOUSE_DOWN = "canevtmoudwn";
Canvas.EVENT_MOUSE_UP = "canevtmouup";
Canvas.EVENT_MOUSE_CLICK = "canevtmouclk";
Canvas.EVENT_MOUSE_MOVE = "canevtmoumov";
Canvas.EVENT_MOUSE_WHEEL = "canevtmouwhl";
Canvas.EVENT_MOUSE_EXIT = "canevtmouext";
Canvas.EVENT_TOUCH_START = "canevttousta";
Canvas.EVENT_TOUCH_MOVE = "canevttoumov";
Canvas.EVENT_TOUCH_END = "canevttouend";
// these are only sent to DOs who have registered listeners
Canvas.EVENT_MOUSE_DOWN_OUTSIDE = "canevtmoudwnout";
Canvas.EVENT_MOUSE_UP_OUTSIDE = "canevtmouupout";
Canvas.EVENT_MOUSE_CLICK_OUTSIDE = "canevtmouclkout";
Canvas.EVENT_MOUSE_MOVE_OUTSIDE = "canevtmoumovout";

Canvas.BUTTON_UNKNOWN = 0;
Canvas.BUTTON_LEFT = 1;
Canvas.BUTTON_MIDDLE = 2;
Canvas.BUTTON_RIGHT = 3;

Canvas.MOUSE_EVENT_KEY_LOCATION = "location";
Canvas.MOUSE_EVENT_KEY_SCROLL = "scroll";
Canvas.MOUSE_EVENT_KEY_BUTTON = "button";

// 
Canvas.EVENT_WINDOW_RESIZE = 'canwinrez';
Canvas.IMAGE_TYPE_PNG = "png";
Canvas.IMAGE_TYPE_JPG = "jpg";
Canvas._ID = 0;
// 3D
Canvas.WEBGL_SHADER_TYPE_VERTEX = "vertex";
Canvas.WEBGL_SHADER_TYPE_FRAGMENT = "fragment";
function Canvas(canHTML,canWid,canHei,fitStyle,hidden,is3D){ // input is canvas HTML object
	Canvas._.constructor.call(this);
	this._jsDispatch = new Dispatch();
	this._mouseDown = false;
	this._mousePosition = new V2D();
	this._matrix = new Matrix2D();
	this._alphaStack = [];
	this._alphaComposite = 1.0;
	if(canHTML){
		this._canvas = canHTML;
	}else{
		this._canvas = document.createElement("canvas");
		this._canvas.style.position="absolute";
		this._canvas.style.left="0px";
		this._canvas.style.top="0px";
		if(!hidden){
			document.body.appendChild(this._canvas);
		}
	}
// this._cover = document.createElement("div");
// document.body.appendChild(this._cover);
	this._stageFit = Canvas.STAGE_FIT_FIXED;
	if(canWid&&canHei){
		this._canvas.width = canWid; this._canvas.height = canHei;
	}else{
		this._stageFit = Canvas.STAGE_FIT_FILL;
	}
	if(fitStyle){
		this._stageFit = fitStyle;
	}
	if(is3D){
		try{
			this._program = null;
			var options = {preserveDrawingBuffer: true};
			this._context = this._canvas.getContext("webgl");
			if(!this._context){
				this._context = this._canvas.getContext("experimental-webgl", options);
			}
		}catch(e){
			console.log("could not initialize webGL");
		}
	}else{
		this._context = this._canvas.getContext("2d");
	}
	if(!this._context){
		console.log("unable to get any context");
	}
	this.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	this.id(Canvas._ID++);
	this._listening = false;
	this._handleWindowResizedFxn();
}
Code.inheritClass(Canvas, JSDispatchable);
// ------------------------------------------------------------------------------------------------------------------------ CANVAS 3D - WEB GL
Canvas.prototype.createShaderFromString = function(str, type){
	if(type==Canvas.WEBGL_SHADER_TYPE_FRAGMENT){
		return this._context.createShader(this._context.FRAGMENT_SHADER)
	}else if(type==Canvas.WEBGL_SHADER_TYPE_VERTEX){
		return this._context.createShader(this._context.VERTEX_SHADER)
	}
	return null;
}
Canvas.prototype.compileAndAttachShaderFromString = function(program, str,type){
	var shader = this.createShaderFromString(str,type);
	this._context.shaderSource(shader, str);
	this._context.compileShader(shader);
	this._context.attachShader(program, shader);
	if(!this._context.getShaderParameter(shader, this._context.COMPILE_STATUS)){
		console.log("could not compile shader: "+this._context.getShaderInfoLog(shader));
		return null;
	}
}
Canvas.prototype.setVertexShader = function(program, list){
	this.compileAndAttachShaderFromString(program, list,Canvas.WEBGL_SHADER_TYPE_VERTEX);
}
Canvas.prototype.setFragmentShader = function(program, list){
	this.compileAndAttachShaderFromString(program, list,Canvas.WEBGL_SHADER_TYPE_FRAGMENT);
}
Canvas.prototype.program = function(program){
	if(program!==undefined){
		this._program = program;
		this._context.useProgram(this._program);
	}
	return this._program;
}
Canvas.prototype.newProgram = function(vertexShader, fragmentShader){
	var program = this.startProgram();
	this.setVertexShader(program, vertexShader);
    this.setFragmentShader(program, fragmentShader);
    this.linkProgram(program);
    return program;
}
Canvas.prototype.startProgram = function(){
	return this._context.createProgram();
}
Canvas.prototype.linkProgram = function(program){
	this._context.linkProgram(program);
	if(!this._context.getProgramParameter(program, this._context.LINK_STATUS)){
		console.log("could not initialize shaders");
		return null;
	}
	this._context.useProgram(program);
	program.projectionMatrixUniform = this._context.getUniformLocation(program, "uPMatrix");
	program.modelViewMatrixUniform = this._context.getUniformLocation(program, "uMVMatrix");
	return program;
}
Canvas.prototype.enableVertexAttribute = function(attribName){
	var attr = this._context.getAttribLocation(this._program, attribName);
	this._context.enableVertexAttribArray(attr);
	this._program[attribName] = attr;
	return attr;
}
Canvas.prototype.uniformMatrices = function(pMatrix, mvMatrix){
	this._context.uniformMatrix4fv(this._program.projectionMatrixUniform, false, pMatrix);
	this._context.uniformMatrix4fv(this._program.modelViewMatrixUniform, false, mvMatrix);
}
Canvas.prototype.setBackgroundColor = function (r,g,b,a){
	this._context.clearColor(r,g,b,a);
}
Canvas.prototype.enableDepthTest = function(){
	this._context.enable(this._context.DEPTH_TEST);
// put these in seperate method:
	//this._context.depthFunc(this._context.LESS);
	this._context.depthFunc(this._context.LEQUAL);
	//this._context.depthFunc(this._context.MORE);
	//this._context.blendFunc(this._context.SRC_ALPHA, this._context.ONE);
	this._context.blendFunc(this._context.SRC_ALPHA, this._context.ONE_MINUS_SRC_ALPHA);
	//this._context.blendFuncSeparate(this._context.SRC_ALPHA, this._context.ONE_MINUS_SRC_ALPHA, this._context.ONE, this._context.ONE_MINUS_SRC_ALPHA);
	this._context.enable(this._context.BLEND);
	//this._context.enable(this._context.DEPTH_TEST); // disable?
	//this._context.colorMask(true,true,true,false);
}
Canvas.prototype.enableCulling = function(){
	return this._context.enable(this._context.CULL_FACE);
}
Canvas.prototype.disableCulling = function(){
	return this._context.disable(this._context.CULL_FACE);
}
Canvas.prototype.getBufferFloat32Array = function(list, lengthOfIndividual){
	var buffer = this._context.createBuffer();
	this._context.bindBuffer(this._context.ARRAY_BUFFER, buffer, lengthOfIndividual);
	this._context.bufferData(this._context.ARRAY_BUFFER, new Float32Array(list), this._context.STATIC_DRAW);
	return buffer;
}
Canvas.prototype.getBufferUint16ArrayElement = function(list, lengthOfIndividual){
	var buffer = this._context.createBuffer();
	this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, buffer, lengthOfIndividual);
	this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, new Uint16Array(list), this._context.STATIC_DRAW);
	return buffer;
}
Canvas.prototype.setViewport = function(xPos,yPos,wid,hei){
	return this._context.viewport(xPos,yPos,wid,hei);
}
Canvas.prototype.clearViewport = function(){
	this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);
	this._context.clearDepth(1.0);
}
Canvas.prototype.bindArrayFloatBuffer = function(attr, buffer, lengthOfIndividual){
	this._context.bindBuffer(this._context.ARRAY_BUFFER, buffer);
	this._context.vertexAttribPointer(attr, lengthOfIndividual, this._context.FLOAT, false, 0,0);
}
Canvas.prototype.bindElementArrayBuffer = function(buffer, lengthOfIndividual){
	this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, buffer);
}
Canvas.prototype.drawElementArrayUint16Buffer = function(buffer, lengthOfTotal){
	this._context.drawElements(this._context.TRIANGLES, lengthOfTotal, this._context.UNSIGNED_SHORT, 0);
}
Canvas.prototype.setLineWidth = function(width){
	this._context.lineWidth(width);
}
Canvas.prototype.drawPoints = function(count, offset){
	offset = offset===undefined? 0 : offset;
	this._context.drawArrays(this._context.POINTS, offset, count);
}
Canvas.prototype.drawLines = function(count, offset){
	offset = offset===undefined? 0 : offset;
	this._context.drawArrays(this._context.LINES, offset, count);
}
Canvas.prototype.drawLineList = function(count, offset){
	offset = offset===undefined? 0 : offset;
	this._context.drawArrays(this._context.LINESTRIP, offset, count);
}
Canvas.prototype.drawTriangles = function(count, offset){
	offset = offset===undefined? 0 : offset;
	this._context.drawArrays(this._context.TRIANGLES, offset, count);
}
Canvas.prototype.drawTriangleList = function(count, offset){
	offset = offset===undefined? 0 : offset;
	this._context.drawArrays(this._context.TRIANGLE_STRIP, offset, count);
}

Canvas.prototype.bindTextureImageRGBA = function(image){
	var texture = this._context.createTexture(image);
	this._context.bindTexture(this._context.TEXTURE_2D,texture);
	this._context.pixelStorei(this._context.UNPACK_FLIP_Y_WEBGL, true);
	this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._context.RGBA, this._context.UNSIGNED_BYTE, image);
	this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MAG_FILTER, this._context.NEAREST);
	this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MIN_FILTER, this._context.NEAREST);
	this._context.bindTexture(this._context.TEXTURE_2D,null);
	return texture;
}

// ------------------------------------------------------------------------------------------------------------------------ ------------------
// ------------------------------------------------------------------------------------------------------------------------ GET/SET PROPERTIES
Canvas.prototype.id = function(id){
	if(id!==undefined){ this._id = id; }
	return this._id;
}
Canvas.prototype.mousePosition = function(){
	return this._mousePosition;
}
Canvas.prototype.canvas = function(){
	return this._canvas;
}
Canvas.prototype.context = function(){
	return this._context;
}
Canvas.prototype.contextIdentity = function(){
	this._context.setTransform(1,0,0,1,0,0);
}
Canvas.prototype.contextTransform = function(matrix){
	var a = matrix.get();
	this._context.transform(a[0],a[2],a[1],a[3],a[4],a[5]);
}
Canvas.prototype.size = function(wid,hei){
	this._canvas.width = wid;
	this._canvas.height = hei;
}
Canvas.prototype.width = function(wid){
	if(arguments.length>0){
		this._canvas.width = wid;
	}
	return this._canvas.width;
}
Canvas.prototype.height = function(hei){
	if(arguments.length>0){
		this._canvas.height = hei;
	}
	return this._canvas.height;
}
//  ------------------------------------------------------------------------------------------------------------------------ CANVAS OPERATIONS
Canvas.prototype.pushComposite = function(c){
	/*
	DESTINATION = current canvas
	SOURCE = to-be-drawled
	"none" =?= DNE?
	"copy" = only shows source ?
	"destination-atop" = if(alpha=1): dest over source  :else: source over dest
	"destination-in" = only shows portion of dest that intersects source
	"destination-out" = only shows portion of dest that doesnt intersect source
	"destination-over" = source is layered behind dest
	"source-atop" = shows destination and part of source that intersects destination
	"source-in" = only shows portion of source that intersects dest
	"source-out" = only shows portion of source that doesnt intersect dest
	"source-over" = source is layerd in-front-of dest [default]
	"darker" = source-dest (sub) REMOVED FROM SPEC
	"lighter" = source+dest (add)
	"xor" = 
	*/
	this._context.globalCompositeOperation = "source-over";
}
Canvas.prototype.popComposite = function(){
	//
}
Canvas.prototype.pushAlpha = function(a){
	this._alphaStack.push(this._alphaComposite); // SAVE
	this._alphaComposite *= a;
	this._context.globalAlpha = this._alphaComposite;
	//console.log(this._alphaComposite);
	return a;
}
Canvas.prototype.popAlpha = function(){
	this._alphaComposite = this._alphaStack.pop(); // RESTORE
	this._context.globalAlpha = this._alphaComposite;
	return this._alphaComposite;
}
Canvas.prototype.getColorArrayARGB = function(a,b,c,d){
	var imgData = this._context.getImageData(a,b,c,d).data;
	var i, j, w=c, h=d, index, jw, jw4;
	var colList = new Array(w*h);
	for(j=0;j<h;++j){
		jw = j*w; jw4 = jw*4;
		for(i=0;i<w;++i){
			index = i*4 + jw4;
			colList[i + jw] = Code.getColARGB(imgData[index+3],imgData[index],imgData[index+1],imgData[index+2]);
		}
	}
	return colList;
}
Canvas.prototype.setColorArrayARGB = function(data, x,y, w,h){
	var i, j, index, col;
	var img = this._context.createImageData(w,h);
	for(j=0;j<h;++j){
		jw = j*w; jw4 = jw*4;
		for(i=0;i<w;++i){
			index = i*4 + jw4;
			col = data[i + jw];
			img.data[index  ] = Code.getRedARGB(col);
			img.data[index+1] = Code.getGrnARGB(col);
			img.data[index+2] = Code.getBluARGB(col);
			img.data[index+3] = Code.getAlpARGB(col);
		}
	}
	this._context.putImageData(img,x,y);
}
//  ------------------------------------------------------------------------------------------------------------------------ IMAGE
Canvas.prototype.getImageData = function(a,b,c,d){ // pixel copying
	var imgData = this._context.getImageData(a,b,c,d);
	return imgData;
}
Canvas.prototype.setImageData = function(imgData,c,d){ // pixel setting
	console.log(imgData,c,d);
	this._context.putImageData(imgData,c,d);
}
Canvas.prototype.toDataURL = function(){
	return this._canvas.toDataURL.call(this._canvas,arguments);
}
Canvas.prototype.getAsImage = function(x,y,w,h){
// what about webGL context durrrrr
	var image = new Image();
	// copy canvas image data to temp canvas
	image.src = this._canvas.toDataURL.call(this._canvas,arguments);
	return image;
}
//  ------------------------------------------------------------------------------------------------------------------------ STYLES
Canvas.prototype.setClass = function(name){
	Code.setProperty(this._canvas,name);
}
Canvas.prototype.setCursorStyle = function(style){
	Code.setStyleCursor(this._canvas,style);
}
// ------------------------------------------------------------------------------------------------------------------------ context drawing passthrough functions
Canvas.prototype.drawImage0 = function(img){
	this._context.drawImage(img);
}
Canvas.prototype.drawImage2 = function(img,px,py){
	this._context.drawImage(img,px,py);
}
Canvas.prototype.drawImage4 = function(img,pX,pY,wX,hY){
	this._context.drawImage(img,pX,pY,wX,hY);
}
Canvas.prototype.drawImage8 = function(img,sx,sy,swid,shei,x,y,wid,hei){
	this._context.drawImage(img,sx,sy,swid,shei,x,y,wid,hei);
}
Canvas.prototype.setLine = function(wid,col){
	this._context.lineWidth = wid;
	this._context.strokeStyle = col;
	this._context.lineJoin = 'bevel';
	this._context.lineCap = 'round';
}
Canvas.prototype.setLineJoinCap = function(j,c){
	this._context.lineJoin = j; // bevel|round|miter
	this._context.lineCap = c; // butt|round|square
}
Canvas.prototype.setLinearFill = function(){
	this._context.fillStyle = this.createLinearGradient.apply(this,arguments);
}
Canvas.prototype.setRadialFill = function(){
	this._context.fillStyle = this.createRadialGradient.apply(this,arguments);
}
Canvas.prototype.setFill = function(col){
	this._context.fillStyle = col;
}
Canvas.prototype.beginPath = function(){
	this._context.beginPath();
}
Canvas.prototype.moveTo = function(pX,pY){
	this._context.moveTo(pX,pY);
}
Canvas.prototype.lineTo = function(pX,pY){
	this._context.lineTo(pX,pY);
}
Canvas.prototype.quadraticCurveTo = function(a,b,c,d){
	this._context.quadraticCurveTo(a,b,c,d)
}
Canvas.prototype.bezierCurveTo = function(a,b,c,d,e,f){
	this._context.bezierCurveTo(a,b,c,d,e,f)
}
Canvas.prototype.strokeLine = function(){
	this._context.stroke();
}
Canvas.prototype.arc = function(pX,pY, rad, sA,eA, cw){
	this._context.arc(pX,pY, rad, sA,eA, cw);
}
Canvas.prototype.fill = function(){
	this._context.fill();
}
Canvas.prototype.endPath = function(){
	this._context.closePath();
}
Canvas.prototype.drawRect = function(sX,sY,wX,hY){
	//this._context.fillRect(sX,sY,wX,hY);
	this._context.rect(sX,sY,wX,hY);
}
// Canvas.prototype.strokeRect = function(sX,sY,wX,hY){
// 	this._context.strokeRect(sX,sY,wX,hY);
// }
// ------------------------------------------------------------------------------------------------------------------------ 
Canvas.prototype.clear = function(){
	var wid = this._canvas.width; var hei = this._canvas.height; this._canvas.width = 0; this._canvas.height = 0; this._canvas.width = wid; this._canvas.height = hei;
}
Canvas.prototype.createLinearGradient = function(sX,sY,eX,eY, percentsAndColors){
	var gra = this._context.createLinearGradient(sX,sY,eX,eY);
	for(var i=4; i<arguments.length; i+=2){
		pct = arguments[i];
		col = arguments[i+1];
		gra.addColorStop(pct,Code.getJSColorFromARGB(col));
	}
	return gra;
}
Canvas.prototype.createRadialGradient = function(sX,sY,sR, eX,eY,eR, percentsAndColors){
	var gra = this._context.createRadialGradient(sX,sY,sR, eX,eY,eR);
	for(var i=6; i<arguments.length; i+=2){
		pct = arguments[i];
		col = arguments[i+1];
		gra.addColorStop(pct,Code.getJSColorFromARGB(col));
	}
	return gra;
}
//  ------------------------------------------------------------------------------------------------------------------------ TEXT
Canvas.prototype.drawText = function(txt,siz,fnt,xP,yP,align){
	if(siz==undefined || siz==null){ siz = 12; }
	if(xP==undefined || xP==null){ xP=0; }
	if(yP==undefined || yP==null){ yP=0; }
	if(align==undefined || align==null){ align="left"; } // left, center, right
	this._context.font = siz+"px "+fnt;
	this._context.textAlign=align;
	this._context.fillText(txt,xP,yP);
}
Canvas.prototype.measureText = function(str){
	return this._context.measureText(str);
}
//  ------------------------------------------------------------------------------------------------------------------------ LISTENERS
Canvas.prototype.addListeners = function(){
	if(!this._listening){
		this.addJSEventListener(window, Code.JS_EVENT_RESIZE, this._handleWindowResizedFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_CLICK, this._canvasClickFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_DOWN, this._canvasMouseDownFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_UP, this._canvasMouseUpFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_MOVE, this._canvasMouseMoveFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_OUT, this._canvasMouseOutFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_WHEEL, this._canvasMouseWheelFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_START, this._canvasTouchStartFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_MOVE, this._canvasTouchMoveFxn);
		this.addJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_END, this._canvasTouchEndFxn);
			this._handleWindowResizedFxn(); // expect a recheck, rather than trigger externally
		this._listening = true;
	}
}
Canvas.prototype.removeListeners = function(){
	if(this._listening){
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_CLICK, this._canvasClickFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_DOWN, this._canvasMouseDownFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_UP, this._canvasMouseUpFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_MOVE, this._canvasMouseMoveFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_OUT, this._canvasMouseOutFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_MOUSE_WHEEL, this._canvasMouseWheelFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_START, this._canvasTouchStartFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_MOVE, this._canvasTouchMoveFxn);
		this.removeJSEventListener(this._canvas, Code.JS_EVENT_TOUCH_END, this._canvasTouchEndFxn);
		this._listening = false;
	}
}
//  ------------------------------------------------------------------------------------------------------------------------ MOUSE POSITIONING
Canvas.prototype.getMouseDelta = function(e){
	e = Code.getJSEvent(e);
	if(e.wheelDelta) {
	// console.log(e)
	// console.log(e.deltaX,e.deltaY,e.deltaZ, e.wheelDelta, e.wheelDeltaX, e.wheelDeltaY);
		//var delta = e.wheelDelta/120.0;//e.deltaY/(e.wheelDelta?(e.wheelDelta):(120.0));
		return e.wheelDelta/120.0;
	}
	return 0;
}
Canvas.prototype.getMousePosition = function(e){
	e = Code.getJSEvent(e);
	var pos = new V2D(0,0);
	var ele = this._canvas;
	while(ele != null){
		pos.x += ele.offsetLeft;
		pos.y += ele.offsetTop;
		ele = ele.offsetParent;
	}
	pos.x = e.pageX - pos.x;
	pos.y = e.pageY - pos.y;
	return pos;
}
Canvas.prototype.getMouseButton = function(e){
	e = Code.getJSEvent(e);
	var button = e.which;
	var but = Canvas.BUTTON_UNKNOWN;
	if(button==1){
		but = Canvas.BUTTON_LEFT;
	}else if(button==2){
		but = Canvas.BUTTON_MIDDLE;
	}else if(button==3){
		but = Canvas.BUTTON_RIGHT;
	}
	return but;
}
Canvas.prototype.getMouseObjectFromEvent = function(e){
	var pos = this.getMousePosition(e);
	var delta = this.getMouseDelta(e);
	pos = new V3D(pos.x,pos.y,delta );
	var but = this.getMouseButton(e);
	var obj = {};
	obj[Canvas.MOUSE_EVENT_KEY_LOCATION] = pos;
	obj[Canvas.MOUSE_EVENT_KEY_BUTTON] = but;
	obj[Canvas.MOUSE_EVENT_KEY_SCROLL] = delta;
	return obj;
}
Canvas.prototype._canvasClickFxn = function(e){
	e.preventDefault();
	var obj = this.getMouseObjectFromEvent(e);
	this.alertAll(Canvas.EVENT_MOUSE_CLICK,obj);
}
Canvas.prototype._canvasMouseWheelFxn = function(e){
	e.preventDefault();
	var obj = this.getMouseObjectFromEvent(e);
	this.alertAll(Canvas.EVENT_MOUSE_WHEEL,obj);
}
Canvas.prototype._canvasMouseDownFxn = function(e){
	e.preventDefault();
	this._mouseDown = true;
	var obj = this.getMouseObjectFromEvent(e);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN,obj);
}
Canvas.prototype._canvasMouseUpFxn = function(e){
	e.preventDefault();
	this._mouseDown = false;
	var obj = this.getMouseObjectFromEvent(e);
	this.alertAll(Canvas.EVENT_MOUSE_UP,obj);
}
Canvas.prototype._canvasMouseMoveFxn = function(e){
	e.preventDefault();
	var obj = this.getMouseObjectFromEvent(e);
	var pos = obj.location;
	this._mousePosition.x = pos.x; this._mousePosition.y = pos.y;
	this.alertAll(Canvas.EVENT_MOUSE_MOVE,obj);
}
Canvas.prototype._canvasMouseOutFxn = function(e){
	e.preventDefault();
	var obj = this.getMouseObjectFromEvent(e);
	var pos = obj.location;
	this._mousePosition.x = pos.x; this._mousePosition.y = pos.y;
	//this.alertAll(Canvas.EVENT_MOUSE_MOVE,pos); // moving outside ...might be odd...
	//this.alertAll(Canvas.EVENT_MOUSE_UP,pos);
	this.alertAll(Canvas.EVENT_MOUSE_EXIT,obj);
	this._mouseDown = false; // UNKNOWN
}
Canvas.prototype.isMouseDown = function(){
	return this._mouseDown;
}
//  ------------------------------------------------------------------------------------------------------------------------ TOUCH POSITIONING
// https://developer.mozilla.org/en-US/docs/DOM/TouchEvent
Canvas.prototype.getTouchPosition = function(e){
	return this.getMousePosition(e);
}
Canvas.prototype._canvasTouchStartFxn = function(e){ // e.target.touchdata[]
	console.log( "TOUCH START" );
	e.preventDefault();
	pos = this.getTouchPosition(e);
	this.alertAll(Canvas.EVENT_TOUCH_START,pos);
	pos = null;
}
Canvas.prototype._canvasTouchMoveFxn = function(e){
	console.log( "TOUCH MOVE" );
	e.preventDefault();
	pos = this.getTouchPosition(e);
	this.alertAll(Canvas.EVENT_TOUCH_MOVE,pos);
}
Canvas.prototype._canvasTouchEndFxn = function(e){
	console.log( "TOUCH END" );
	e.preventDefault();
	pos = this.getTouchPosition(e);
	//this.alertAll(Canvas.EVENT_MOUSE_UP,pos);
	this.alertAll(Canvas.EVENT_TOUCH_END,pos);
}

// ------------------------------------------------------------------------------------------------------------------------ SCREEN OPERATIONS
Canvas.prototype._handleWindowResizedFxn = function(e){
	var p = new V2D(window.innerWidth,window.innerHeight);
	if(this._stageFit==Canvas.STAGE_FIT_FILL){
		this.width(p.x); this.height(p.y);
	}else if(this._stageFit==Canvas.STAGE_FIT_SCALE){
		Code.preserveAspectRatio2D(p,this.width(),this.height(),p.x,p.y);
		this.width( Math.floor(p.x) ); this.height( Math.floor(p.y) );
	} // Canvas.STAGE_FIT_FIXED
	this.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
}

Canvas.prototype.kill = function(e){
	// ...
	Canvas._.kill.call(this);
}

/*var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		*/
		//var fill = '#FF0000';
		//var fill = 'rgba(255,0,0,0.10)';


	/*
	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}
	*/

// Canvas.prototype.createFragmentShader = function(insides){
// 	var scriptDOM = Code.newScript();
// 	scriptDOM.type = "x-shader/x-fragment";
// 	scriptDOM.text = ""+insides;
// 	document.head.appendChild(scriptDOM);
// 	return scriptDOM;
// }
// Canvas.prototype.createVertexShader = function(insides){
// 	var scriptDOM = Code.newScript();
// 	scriptDOM.type = "x-shader/x-vertex";
// 	scriptDOM.text = ""+insides;
// 	document.head.appendChild(scriptDOM);
// 	return scriptDOM;
// }
// Canvas.prototype.getShaderFromDOM = function(dom){
// 	var str = "";
// 	var k = dom.firstChild;
// 	while(k){
// 		if(k.nodeType==3){
// 			str += k.textContent;
// 		}
// 		k = k.nextSibling;
// 	}
// 	return str;
// }
// Canvas.prototype.createShaderFromDOM = function(dom){
// 	if(dom.type=="x-shader/x-fragment"){
// 		return this._context.createShader(this._context.FRAGMENT_SHADER)
// 	}else if(dom.type=="x-shader/x-vertex"){
// 		return this._context.createShader(this._context.VERTEX_SHADER)
// 	}
// 	return null;
// }
// Canvas.prototype.compileAndAttachShaderFromDOM = function(dom){
// 	var str = this.getShaderFromDOM(dom);
// 	var shader = this.createShaderFromDOM(dom);
// 	this._context.shaderSource(shader, str);
// 	this._context.compileShader(shader);
// 	this._context.attachShader(this._program, shader);
// 	if(!this._context.getShaderParameter(shader, this._context.COMPILE_STATUS)){
// 		console.log("could not compile shader: "+this._context.getShaderInfoLog(shader));
// 		return null;
// 	}
// }

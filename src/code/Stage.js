// Stage.js
Stage.EVENT_ON_ENTER_FRAME="staentfrm";
Stage.EVENT_ON_EXIT_FRAME="staextfrm";
Stage.tempMatrix = new Matrix2D();

function Stage(can, fr){
	Stage._.constructor.call(this);
	this.canvas(can);
	this._timer = new Ticker(fr);
	this._time = 0;
	this._tempCanvas = new Canvas(null,100,100,Canvas.STAGE_FIT_FIXED,true);
	this._renderCanvas = new Canvas(null,100,100,Canvas.STAGE_FIT_FIXED,true);
	this._eventList = {};//new Object(); // hash
	// var evts = [Canvas.EVENT_MOUSE_UP,Canvas.EVENT_MOUSE_DOWN,Canvas.EVENT_MOUSE_CLICK,Canvas.EVENT_MOUSE_MOVE, Canvas.EVENT_MOUSE_EXIT,
	// 		Canvas.EVENT_MOUSE_UP_OUTSIDE,Canvas.EVENT_MOUSE_DOWN_OUTSIDE,Canvas.EVENT_MOUSE_CLICK_OUTSIDE,Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
	// for(var e in evts){
	// 	this._eventList[evts[e]] = new Array();
	// }
	this._root = new DO();
	DO.addToStageRecursive(this._root,this);
	this._root.graphics().clear();
}
Code.inheritClass(Stage,Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ STATIC
Stage._instance = null;
Stage.instance = function(r){ // this
	if(!Stage._instance){
		var canvas = new Canvas(null,0,0, null, true);
		var stage = new Stage(canvas);
		Stage._instance = stage;
	}
	return Stage._instance;
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET PROPERTIES
Stage.prototype.root = function(r){
	if(r!==undefined){
		this._root = r;
	}
	return this._root;
}
Stage.prototype.canvas = function(canvas){ // TODO: should this be the RENDER CANVAS ?
	if(canvas!==undefined){
		this._canvas = canvas;
	}
	return this._canvas;
}
Stage.prototype.frameRate = function(fr){
	if(fr!==undefined){
		var wasRunning = this._timer.isRunning();
		if(wasRunning){
			this._timer.stop();
		}
		this._timer.frameSpeed(fr);
		if(wasRunning){
			this._timer.start();
		}
	}
	return this._timer.frameSpeed();
}
Stage.prototype.time = function(){
	return this._time;
}
Stage.prototype.setCursorStyle = function(style){
	this._canvas.setCursorStyle(style);
}
// ------------------------------------------------------------------------------------------------------------------------
Stage.prototype.alertAll = function(str,obj){
	//console.log(Stage._.alertAll)
	Stage._.alertAll.call(this,str,obj);
//	this.alertFunctionDisplay(str,obj);
}
// Stage.prototype.alertFunctionDisplay = function(str){
// 	var list = this._eventList[str];
// 	if(list!=null && list.length>0){
// 		for(var i=0; i<list.length; ++i){
// 			var item = list[i];
// 			var obj = item[0];
// 			var fxn = item[1];
// 			var ctx = item[2];
// 			if(fxn && ctx && obj){
// 				fxn.call(ctx,obj);
// 			}
// 		}
// 	}
// }
Stage.prototype.functionListFor = function(str){
	var list = this._eventList[str];
	if(list){
		return list;
	}
	return null;

// 	var evt = eventData;
// 	// var pos = event["location"];
// 	//arr = new Array( intersection, pos );
// 	path = new Array();
// 	// OUTSIDE
// 	var list = null;
// 	if(evt==Canvas.EVENT_MOUSE_UP){ // || evt==Canvas.EVENT_MOUSE_EXIT){
// 		var list = this._eventList[Canvas.EVENT_MOUSE_UP_OUTSIDE];
// 	}else if(evt==Canvas.EVENT_MOUSE_DOWN){
// 		var list = this._eventList[Canvas.EVENT_MOUSE_DOWN_OUTSIDE];
// // ???
// 		var list = this._eventList[Canvas.EVENT_MOUSE_DOWN];
// 	}else if(evt==Canvas.EVENT_MOUSE_CLICK){
// 		var list = this._eventList[Canvas.EVENT_MOUSE_CLICK_OUTSIDE];
// 	}else if(evt==Canvas.EVENT_MOUSE_MOVE){
// 		var list = this._eventList[Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
// /// var list = this._eventList[str];
// //var list = this._eventList[Canvas.EVENT_MOUSE_MOVE];
// 		this._performFxnOnDisplay(this._root, function(d){ if(d._mouseOver){d._mouseWasOver=true;} d._mouseOver=false; } );
// 		/*
// 		go thru entire stack and:
// 			if ch._mouseOver==true
// 				ch._mouseWasOver = true
// 			ch._mouseOver = false
// 		if intersection: go over hierarchy and:
// 			ch._mouseOver = true
// 			if ch._mouseWasOver == false
// 				:::ALERT MOUSE ENTER
// 		go thru entire stack and:
// 			if ch._mouseWasOver == true
// 				:::ALERT MOUSE EXIT
// 			ch._mouseWasOver = false
// 		*/
// 	}
}
Stage.prototype.addFunctionDisplay = function(obj,str,fxn,ctx){
//	console.log("addFunctionDisplay: "+str);
	if(this._eventList[str]==null){
		this._eventList[str] = [];
	}
	this._eventList[str].push([obj,fxn,ctx,obj]);
return;

	// if(this._eventList[str]!=null){
	// 	this._eventList[str].push([obj,fxn,ctx]);
	// }else{
	// 	// alert event does not exist
	// 	console.log("NOT EXIST ");
	// }
}
Stage.prototype.removeFunctionDisplay = function(obj,str,fxn,ctx){
	var i, j, item, arr = this._eventList[str];
	if(arr){
		for(i=0;i<arr.length;++i){
			item = arr[i];
			if(item[0]==obj && item[1]==fxn){
				if(arr.length>i){
					arr[i] = arr[arr.length-1];
				}
				arr.pop();
				break; // assume single
			}
		}
	}
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
Stage.prototype.getImageAsFloatGray = function(originalImage){
	var data = this.getImageAsFloatRGB(originalImage);
	var gray = ImageMat.grayFromRGBFloat(data.red, data.grn, data.blu);
	return {width:data.width, height:data.height, gray:gray}
}
Stage.prototype.getImageAsFloatRGB = function(originalImage, expand){
	//console.log("getImageAsFloatRGB scales with the canvas");
	var i, j, dat, img, wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this.getDOAsARGB(doImage, wid,hei);
	img = new ImageMat(wid,hei);
	img.fromArrayARGB(dat);
	var red = img.getRedFloat();
	var grn = img.getGrnFloat();
	var blu = img.getBluFloat();
	if(expand){
		red = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( red ) );
		grn = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( grn ) );
		blu = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( blu ) );
	}
	img.unset();
	return {width:wid, height:hei, red:red, grn:grn, blu:blu};
}
Stage.prototype.getImageAsIntRGBA = function(originalImage){
	var i, j, dat, img, wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this.getDOAsARGB(doImage, wid,hei);
	return dat;
}
Stage.prototype.getImageAsImageMat = function(originalImage, expand){ // this is done somewhere else
	var info = this.getImageAsFloatRGB(originalImage, expand);
	var matrix = new ImageMat(info["width"], info["height"]);
		matrix.red(info["red"]);
		matrix.grn(info["grn"]);
		matrix.blu(info["blu"]);
	return matrix;
}


Stage.prototype.getImageAsFloatRGBA = function(originalImage, expand){
	var i, j, dat, img, wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this.getDOAsARGB(doImage, wid,hei);
	img = new ImageMat(wid,hei);
	img.fromArrayARGB(dat);
	var red = img.getRedFloat();
	var grn = img.getGrnFloat();
	var blu = img.getBluFloat();
//	var alp = img.getAlpFloat();
var alp = null; // DNE
	if(expand){
		red = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( red ) );
		grn = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( grn ) );
		blu = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( blu ) );
//		alp = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat( alp ) );
	}
	img.unset();
	return {width:wid, height:hei, red:red, grn:grn, blu:blu, alp:alp};
}
Stage.prototype.getFloatARGBAsImage = function(a,r,g,b, wid,hei, matrix, type, onloadFxn){
	var argb = ImageMat.ARGBFromARGBFloats(a,r,g,b);
	return this.getARGBAsImage(argb, wid,hei,matrix,type, onloadFxn);
}
Stage.prototype.getFloatRGBAsImage = function(r,g,b, wid,hei, matrix, type, onloadFxn){
	var argb = ImageMat.ARGBFromFloats(r,g,b);
	return this.getARGBAsImage(argb, wid,hei,matrix,type, onloadFxn);
}
Stage.prototype.getImageMatAsImage = function(img){
	return this.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
}
Stage.prototype.getFloatGrayAsImage = function(gray, wid,hei, matrix, type, onloadFxn){
	var argb = ImageMat.ARGBFromFloat(gray);
	return this.getARGBAsImage(argb, wid,hei,matrix,type, onloadFxn);
}
Stage.prototype.getARGBAsImage = function(argb, wid,hei, matrix, type, onloadFxn){//Stage.prototype.getRGBAAsImage = function(argb, wid,hei, matrix, type){
	this._setupRenderCanvas(wid,hei, matrix);
	this._renderCanvas.setColorArrayARGB(argb, 0,0, wid,hei);
	return this._toImage(wid,hei, type, onloadFxn);
}

Stage.prototype.textureBase2FromImage = function(texture, onLoadFxn){
	var obj = new DOImage(texture);
	this.root().addChild(obj);
	var wid = texture.width;
	var hei = texture.height;
	var origWid = wid;
	var origHei = hei;
	wid = Math.pow(2.0, Math.ceil(Math.log(wid)/Math.log(2.0)) );
	hei = Math.pow(2.0, Math.ceil(Math.log(hei)/Math.log(2.0)) );
	wid = Math.max(wid,hei);
	hei = wid;
	var origWid = origWid/wid;
	var origHei = origHei/hei;
	texture = this.renderImage(wid,hei,obj, null, null, onLoadFxn);
	obj.removeParent();
	var vert = 1-origHei;
	var horz = origWid;
	return {"texture":texture,"width":horz,"height":vert};
}

Stage.prototype.renderImage = function(wid,hei,obj, matrix, type, onloadFxn){ // get a base-64(src) image from OBJ
	this._setupRenderCanvas(wid,hei, matrix);
	obj.render(this._renderCanvas);
	return this._toImage(wid,hei, type, onloadFxn);
}
Stage.prototype._setupRenderCanvas = function(wid,hei,matrix){
	var presScale = this._canvas.presentationScale();;
	this._renderCanvas.clear();
	this._renderCanvas.width(wid/presScale);
	this._renderCanvas.height(hei/presScale);
	this._renderCanvas.size(wid/presScale,hei/presScale);
	this._renderCanvas.contextIdentity();
	var upScale = 1.0;//this._canvas.presentationScale();
	var upMatrix = new Matrix2D();
		upMatrix.identity();
		//upMatrix.scale(upScale);
	if(matrix){
		upMatrix.mult(upMatrix,matrix); // AFTER?
	}
	this._renderCanvas.contextTransform(upMatrix);
}
Stage.prototype._toImage = function(wid,hei, type, onloadFxn){
	var image = new Image();
	image.width = wid;
	image.height = hei;
	if(type==null){
		type = Canvas.IMAGE_TYPE_PNG;
	}
	var url = this._toDataURL(type);
	image.onload = function(e){
		if(onloadFxn){
			onloadFxn(e);
		}
	}
	image.src = url;
	return image;
}
Stage.prototype._toDataURL = function(type){
	if(type==null||type==undefined||type==Canvas.IMAGE_TYPE_PNG){
		return this._renderCanvas.toDataURL();
	}
	return this._renderCanvas.toDataURL('image/jpeg');
}
Stage.prototype.getDOAsARGB = function(obj, wid,hei, matrix){
	this._setupRenderCanvas(wid,hei,matrix);
	obj.render(this._renderCanvas);
	return this._renderCanvas.getColorArrayARGB(0,0,wid,hei);
}

Stage.prototype.getDOAsImage = function(obj, wid,hei, matrix){
	var type = Canvas.IMAGE_TYPE_PNG;
	var argb = this.getDOAsARGB(obj, wid,hei, matrix);
	var img = this.getARGBAsImage(argb, wid,hei, matrix, type);
	return img;
}
Stage.prototype.render = function(){
	this._canvas.clear();
	this.alertAll(Stage.EVENT_ON_ENTER_FRAME,this._time);
	this._root.render(this._canvas);
	this.alertAll(Stage.EVENT_ON_EXIT_FRAME,this._time);
}
Stage.prototype._enterFrame = function(e){
	++this._time;
	this.render();
}
Stage.prototype.start = function(){
	this._timer.start();
}
Stage.prototype.stop = function(){
	this._timer.stop();
}
Stage.prototype.addListeners = function(){
	this._timer.addFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.addListeners();
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_EXIT,this._canvasMouseExit,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this._canvasTouchStart,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this._canvasTouchMove,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this._canvasTouchEnd,this);
}
Stage.prototype.removeListeners = function(){
	this._timer.removeFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.removeListeners();
	this._canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_EXIT,this._canvasMouseExit,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_START,this._canvasTouchStart,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_MOVE,this._canvasTouchMove,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_END,this._canvasTouchEnd,this);
}
// ------------------------------------------------------------------------------------------------------------------------ DISPLAY LIST
Stage.prototype.addChild = function(ch){
	this._root.addChild(ch);
}
Stage.prototype.removeChild = function(ch){
	this._root.removeChild(ch);
}
Stage.prototype.removeAllChildren = function(ch){
	this._root.removeAllChildren(ch);
}
Stage.prototype.getCurrentMousePosition = function(){
	return this._canvas.mousePosition();
}
Stage.prototype.globalPointToLocalPoint = function(obj, pos){
	var mat = Stage.tempMatrix;
	var newPos = new V2D();
	var arr = new Array();
	while(obj){
		arr.push(obj);
		obj = obj.parent;
	}
	mat.identity();
	var i;
	for(i = arr.length-1;i>=0;--i){ // for(i=0;i<arr.length;++i){
		mat.mult(mat,arr[i].matrix); // mat.mult(arr[i].matrix,mat);
	}
	mat.multV2D(newPos,pos);
	return newPos;
}
// ------------------------------------------------------------------------------------------------------------------------ EVENTS
Stage.prototype.getIntersection = function(pos){
	var context = this._tempCanvas.context();
	var newPos = new V2D(0,0);
	this._tempCanvas.clear();
	context.setTransform(1,0,0,1,-pos.x,-pos.y);
	//this._root.render(this._tempCanvas);
	return this._root.getIntersection(newPos,this._tempCanvas);
}
Stage.prototype._stageResized = function(o){
	this._root.width = o.x; this._root.height = o.y;
}
Stage.prototype._performFxnOnDisplay = function(d,fxn){
	fxn(d); // fxn.call(d);
	var ch, i, len=d._children.length;
	for(i=0; i<len; ++i){
		this._performFxnOnDisplay(d._children[i],fxn);
	}
}
Stage.prototype.canvasMouseEventPropagate = function(eventName,eventData){ // POS IS THE GLOBAL POSITION INTERSECTION LOCATION
	var list = this.functionListFor(eventName);
	var pos = eventData["location"];

	var path, arr, obj, fxn, ctx, evtObj, item;
	var cum = new Matrix2D();
	var intersection = this.getIntersection(pos,this._tempCanvas);
// console.log("intersection:");
// console.log(intersection);
// console.log(" hierarchy: \n");
// this._root.print();
// console.log(" \n");

	if(list){ // OUTSIDE ALERTING
		for(var i=0;i<list.length;++i){
			item = list[i];
			obj = item[0];
			if(true){ // if(intersection!=obj){ // is not object of intersection
				fxn = item[1];
				ctx = item[2];
				cum.identity();
				while(obj != null){
					cum.mult(obj.matrix(),cum);
					obj = obj.parent();
				}
				evtObj = Stage._objectFrom(intersection, cum, pos, eventData);

				if(fxn && ctx){
					fxn.call(ctx, evtObj);
				}else{
					fxn(evtObj);
				}
			}
		}
	}
	if(intersection){ // ANCESTOR INSIDE ALERT
		obj = intersection;
		path = [];
		while(obj){ // } && obj.parent()){ // top parent = root ; and assuming root has identity
			path.push(obj);
			obj = obj.parent();
		}
		cum.identity();
		while(path.length>0){ // run path
			obj = path.pop();
			cum.mult(cum,obj.matrix());
			evtObj = Stage._objectFrom(intersection, cum, pos, eventData);
			// obj._mouseOver = true;
			// if(!obj._mouseWasOver){
			// 	// console.log("MOUSE ENTERED");
			// 	obj.alertAll(DO.EVENT_MOUSE_IN,{"target":obj}); // TARGET IS ACTUALLY INTERSECTION
			// }
			obj.alertAll(eventName, evtObj );
		}
	}
	// if(evt==Canvas.EVENT_MOUSE_MOVE){
	// 	//evtObj = {"target":intersection,"local":DO.getPointFromTransform(new V2D(),cum,pos),"global":(new V2D().copy(pos))}
	// 	// TARGET IS ACTUALLY THE LOWEST SINGLE CHILD
	// 	this._performFxnOnDisplay(this._root, function(d){ if(d._mouseWasOver && !d._mouseOver){ d.alertAll(DO.EVENT_MOUSE_OUT,{"target":d}); } d._mouseWasOver=false; } );
	// }

}
Stage._objectFrom = function(target, cum, pos, dat){
	var glob = pos.copy();
	var local = DO.getPointFromTransform(new V2D(),cum,pos);
	var obj = {};
		obj["target"] = target;
		obj["local"] = local;
		obj["global"] = glob;
		obj["data"] = dat;
	return obj;
}
Stage.prototype._canvasMouseDown = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,e);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN,e);
}
Stage.prototype._canvasMouseUp = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP,e);
	this.alertAll(Canvas.EVENT_MOUSE_UP,e);
}
Stage.prototype._canvasMouseClick = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK,e);
	this.alertAll(Canvas.EVENT_MOUSE_CLICK,e);
}
Stage.prototype._canvasMouseMove = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_MOVE,e);
	this.alertAll(Canvas.EVENT_MOUSE_MOVE,e);
}
Stage.prototype._canvasMouseExit = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_EXIT,e); // ...
	this.alertAll(Canvas.EVENT_MOUSE_EXIT,e);
}
Stage.prototype._canvasTouchStart = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,e);
	this.alertAll(Canvas.EVENT_MOUSE_START,e);
}
Stage.prototype._canvasTouchMove = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_MOVE,e);
	this.alertAll(Canvas.EVENT_TOUCH_MOVE,e);
}
Stage.prototype._canvasTouchEnd = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP,e);
	this.alertAll(Canvas.EVENT_TOUCH_END,e);
}
Stage.prototype.kill = function(){
	Stage._.kill.call(this);
}
/*
this.canvasMouseDownOutside = function(pos){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
};
this.canvasMouseUpOutside = function(e){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
};
this.canvasMouseClickOutside = function(pos){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
};
this.canvasMouseMoveOutside = function(pos){
	//this.root.transformEvent(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,new V2D(pos.x,pos.y));
	this.alertAll(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,pos);
};
*/

this._mouseOver = false;

// var can = this._renderCanvas.getCanvas();
// document.body.appendChild(can);
// this.renderCanvas.canvas.style.position="absolute"; this.renderCanvas.canvas.style.left="0px"; this.renderCanvas.canvas.style.top="100px";
// var can = this._tempCanvas.getCanvas();
// document.body.appendChild(can);
// can.style.position="absolute"; can.style.left="0px"; can.style.top="300px";

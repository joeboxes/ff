// Crop.js

function Crop(){
	console.log("create");
	// this.timer = new Ticker(100);
	// this.resource = new Resource();
	// this.resource.context(this);
	// this.resource.completeFxn(this.constructed);
	// this.resource.load();
	this.handleLoaded();
}
Crop.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	// internal
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._stage.start();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	//
}
Crop.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this._imageLoader = new ImageLoader();
	//this.canvas.checkResize();
	console.log("loaded");
	this.addListeners();
	//
	this.loadImageFromSource("src");
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Crop.prototype.handleCanvasResizeFxn = function(e){
	console.log(e);
}
Crop.prototype.handleStageEnterFrameFxn = function(e){
	//console.log(e);
}
Crop.prototype.handleKeyUpFxn = function(e){
	console.log(e);
}
Crop.prototype.handleKeyDownFxn = function(e){
	console.log(e);
}
Crop.prototype.handleKeyDown2Fxn = function(e){
	console.log(e);
}
Crop.prototype.handle = function(e){
	console.log(e);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Crop.prototype.loadImageFromSource = function(src){
	//src = "http://a.dilcdn.com/bl/wp-content/uploads/sites/2/2014/08/10500323_10152575001630742_1989013401463860381_n-250x188.jpg";
	//src = "http://localhost/images/crossorigin.php?source="+escape(src);
	//console.log(src);
	src = "../images/pattern.jpg";

	this._imageLoader.setLoadList("",[src], this,this.handleImageLoadedFromSource);
	this._imageLoader.load();
}
Crop.prototype.handleImageLoadedFromSource = function(e){
	var d;
	var image = e.images[0];
	document.body.appendChild(image);
	image.setAttribute("id","trash");
	image.setAttribute("crossorigin","localhost");
	//image.crossOrigin = 'anonymous';
	image.crossOrigin = 'Anonymous';
	image = document.getElementById("trash");

	image.style.display = "none";
	
	d = new DOImage(image);
	this._root.addChild(d);
	d.addFunction(Canvas.EVENT_MOUSE_DOWN,this._imageStartDrag,this);
}


Crop.prototype._imageStartDrag = function(e){
	console.log(e)
}
/*
click - select
mosuedown+hold - start drag
	- mouseup - stop drag

*/

/*
	var body = document.body;
	Code.addEventListener(body,Code.JS_EVENT_DRAG_START,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_OVER,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_ENTER,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_DROP,dragDrop);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_END,dragCancel);



function dragCancel(e){
	e = Code.getJSEvent(e);
	Code.eventPreventDefault(e);
	//console.log("drag "+e);
}
function dragDrop(e){
	var i, len, dataTransfer, files, fileList, fileReader;
	e = Code.getJSEvent(e);
	Code.eventPreventDefault(e);
	dataTransfer = e.dataTransfer;
	fileList = dataTransfer.files;
	//console.log(e);
	//console.log(dataTransfer);
	//console.log(fileList);
	len = fileList.length;
	for(i=0;i<len;++i){
		file = fileList[i];
		//console.log(file);
		console.log(file.name+" : "+file.size+" Bytes ["+file.type+"]");
		fileReader = new FileReader();
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_START,handleFileStartLoad);
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_PROGRESS,handleFileProgress);
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_END,handleFileLoaded);
		fileReader.readAsDataURL(file);
	}
}
function handleFileStartLoad(e){
	console.log(e);
}
function handleFileProgress(e){
	console.log(e);
	console.log(e.lengthComputable+" | "+e.loaded+"/"+e.total);
}
function handleFileLoaded(e){
	var fileReader = this;
	//console.log(fileReader);
	//console.log(file);
	var binary = fileReader.result;
	//console.log(e);
	var imgDOM = new Image();
	imgDOM.src = binary;
	Code.addChild(document.body,imgDOM);
}
function dragFxn1(e){
	console.log("drag1 "+e);
}
function ku(e){
	console.log("key up "+e);
}
function kd(e){
	console.log("key down "+e);
}
function ks(e){
	console.log("key still down "+e);
}
*/
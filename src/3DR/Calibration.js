// Calibration.js

function Calibration(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	//var imageList = ["calibrate_0.png","calibrate_2.png","calibrate_4.png","calibrate_5.png"];
	//var imageList = ["calibrate_1.png"];
	var imageList = ["calibrate_5.png"];
	// 0 is good
	// 1 has glare - x 
	// 2 is good
	// 3 is ok - x => NOT ENOUGH CORNERS
	// 4 is good
	// 5 is small - x => CORNERS NOT CLOSE ENOUGH | MERGE?
	var imageLoader = new ImageLoader("./images/calibration/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Calibration.prototype.handleMouseClickFxn = function(e){
	var p = e.location;
	if(p.x>400){
		p.x -= 400;
	}
	console.log(p+"")
}
Calibration.prototype.handleImagesLoaded = function(imageInfo){
GLOBALSTAGE = this._stage;
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(0.10);
		d.matrix().translate(x,y);
		x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
	}
	// get checkerboard points
	var pointList2D = [];
	var pointList3D = [];
	for(i=0; i<imageMatrixList.length; ++i){
		var imageMatrix = imageMatrixList[i];
		var pointMatches = R3D.detectCheckerboard(imageMatrix);
		var points2D = pointMatches["points2D"];
		var points3D = pointMatches["points3D"];
		pointList2D.push(points2D);
		pointList3D.push(points3D);
	}
	return;
	// console.log(pointList2D+"");
	// console.log(pointList3D+"");
	var result = R3D.calibrateCameraK(pointList3D,pointList2D);
}



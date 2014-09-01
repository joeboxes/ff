// DLT2D.js

function DLT2D(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	var imageLoader = new ImageLoader("../matching/images/medium/",["BL.png","BLB.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
	//this.handleLoaded();
}
DLT2D.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
DLT2D.prototype.handleImageLoaded = function(e){
	console.log("dlt: "+e.images.length);
	var i, j, a, b, c, d, p, q, x, y, H, img, arr;
	var widths = [];
	var heights = [];
	var images = [];
	// display images
	x = 0;
	for(i=0;i<e.images.length;++i){
		img = e.images[i];
		d = new DOImage(img);
		d.matrix().identity();
		d.matrix().translate(x,0);
		this._root.addChild(d);
		images.push(d);
		x += img.width;
		widths.push(img.width);
		heights.push(img.height);
	}
	// 
	var points = [];
	points.push([new V2D(234,9), new V2D(199,293)]);
	points.push([new V2D(342,42), new V2D(82,249)]);
	points.push([new V2D(321,285), new V2D(42,17)]);
	points.push([new V2D(208,296), new V2D(181,35)]);
	points.push([new V2D(249,65), new V2D(175,249)]);
	points.push([new V2D(307,202), new V2D(83,115)]);
	//points.push([new V2D(,), new V2D(,)]);
		// ...
	// show points on screen;
	for(i=0;i<points.length;++i){
		arr = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0x33FF0000);
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		x = 0;
		for(j=0;j<arr.length;++j){
			p = arr[j];
			d.graphics().drawCircle(p.x+x,p.y,3.0);
			x += widths[j];
		}
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		this._root.addChild(d);
	}
	// convert to sepearte arrays:
	var pointsFr = [];
	var pointsTo = [];
	for(i=0;i<points.length;++i){
		arr = points[i];
		pointsFr.push(arr[0]);
		pointsTo.push(arr[1]);
	}
	// console.log(pointsFr);
	// console.log(pointsTo);
	//H = Code.projectiveDLT(pointsFr,pointsTo);
	// precondition
	var pointsToNormalized = [];
	var transformTo = Code.normalizePoints2D(pointsTo,pointsToNormalized,null);
	var pointsFrNormalized = [];
	var transformFr = Code.normalizePoints2D(pointsFr,pointsFrNormalized,null);

	//H = Code.projectiveDLT(pointsTo,pointsFr);
	H = Code.projectiveDLT(pointsToNormalized,pointsFrNormalized);

	transformToInverse = new Matrix2D();
		transformToInverse.inverse(transformTo);
	transformFrInverse = new Matrix2D();
		transformFrInverse.inverse(transformFr);

	console.log(transformTo.toString())
	console.log(transformToInverse.toString())
	
	transformTo = new Matrix(3,3).setFromArray(transformTo.toArray());
	transformFr = new Matrix(3,3).setFromArray(transformFr.toArray());
	transformToInverse = new Matrix(3,3).setFromArray(transformToInverse.toArray());
	transformFrInverse = new Matrix(3,3).setFromArray(transformFrInverse.toArray());

	H = Matrix.mult(H,transformTo);
	H = Matrix.mult(transformFrInverse,H);
	

	console.log(H.toString())
	// 
	
	// test with 2D points
	// test with 3D points

	// show altered image:
	var homography = H;
	var i = 0;
	img = images[i];
	wid = widths[i];
	hei = heights[i];
	var imageARGB = this._stage.getDOAsARGB(img, wid,hei);
	var imageMat = new ImageMat(wid,hei);
	imageMat.setFromArrayARGB(imageARGB);
	var planeWidth = 400;
	var planeHeight = 300;
	var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,wid,hei, planeWidth,planeHeight, homography);
	var imagePlaneARGB = ImageMat.ARGBFromFloats(imagePlaneMat.red(),imagePlaneMat.grn(),imagePlaneMat.blu());
	var imagePlane = this._stage.getARGBAsImage(imagePlaneARGB, planeWidth,planeHeight);
	d = new DOImage(imagePlane);
	d.matrix().identity();
	d.matrix().translate(800,000);
	this._root.addChild(d);
	console.log(".........");
}
DLT2D.prototype.handleEnterFrame = function(e){
	//console.log(e);
}





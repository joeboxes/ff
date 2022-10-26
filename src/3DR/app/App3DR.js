// App3DR.js

function App3DR(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false, true);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);

	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._handleMouseDownFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._handleMouseUpFxn,this);

		this._canvas.addFunction(Canvas.EVENT_MOUSE_EXIT,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this._handleMouseUpFxn,this);
//Canvas.EVENT_MOUSE_CLICK_OUTSIDE = "canevtmouclkout";
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMoveFxn,this);

	//this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this._handleMouseDownFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this._handleMouseUpFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this._handleMouseMoveFxn,this);

	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);
	this._keyboard = new Keyboard();


	this._longPressTime = 500;
	this._longPressTicker = new Ticker(this._longPressTime);
	this._longPressTicker.addFunction(Ticker.EVENT_TICK, this._longPressTrigger, this);


	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
//	this.generate();

GLOBALSTAGE = this._stage;

	var self = this;
	var readyFxn = function(){
		self.continueStartup();
	}
	this._projectManager = new App3DR.ProjectManager("/projects/0", this._stage, readyFxn);

}


App3DR.prototype.continueStartup = function(){

	var projectManager = this._projectManager;

	var fxn = function(){
		console.log("resources loaded");
	}
	var resource = new App3DR.Resource(fxn);
	resource.load();

	this._resource = resource;

	// this._projectManager
	// this._activeView = this._projectManager.views()[0];
	// console.log(this._activeView);

// var modeImageEdit = true;
var modeImageEdit = false;

// var modeImageUpload = true; //  uploadImageTypeCamera
var modeImageUpload = false;
	// var modeImageUploadCamera = true;
	var modeImageUploadCamera = false;

// var modeImageCompare = true;
var modeImageCompare = false;


var modeModelReconstruction = false;
//var modeModelReconstruction = true;



	var url = Code.getURL();
	console.log(url);
	var datum = Code.parseURL(url);
	console.log(datum);
	var params = datum["parameters"];

	var mode = params["mode"];

	if(mode!==undefined && mode!==null){
		if(mode=="model"){
			console.log("display model");
			modeModelReconstruction = true;
		}else if(mode=="image"){
			console.log("upload view image");
			modeImageUpload = true;
			modeImageUploadCamera = false;
		}else if(mode=="camera"){
			console.log("upload camera image");
			modeImageUpload = true;
			modeImageUploadCamera = true;
		}else if(mode=="compare"){
			console.log("compare pair image");
			modeImageCompare = true;
		}

	}




if(modeImageEdit){
	var app = new App3DR.App.ImageEditor(this._resource);
	this.setupAppActive(app);
	app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupImageEditorProjectManager();
}

if(modeImageUpload){
	var app = new App3DR.App.ImageUploader(this._resource, this._projectManager);
	this.setupAppActive(app);
	this._uploadAdapter = new App3DR.App.UploadAdapterToPictures(this._projectManager, this._stage);
this._uploadAdapter.uploadImageTypeCamera = modeImageUploadCamera;
	app.addFunction(App3DR.App.ImageUploader.EVENT_FILE_ADDED, this._handleImageUploaderFileReady, this);
	this._setupImageUploaderProjectManager();
}

//modeImageCompare = false;
if(modeImageCompare){
	var app = new App3DR.App.MatchCompare(this._resource);
	this.setupAppActive(app);
	// app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupMatchCompareProjectManager();
}
if(modeModelReconstruction){
	var app = new App3DR.App.Model3D(this._resource);
	this.setupAppActive(app);
	//app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupModel3DProjectManager(this._projectManager);
}







	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();


	if(!Code.isa(this._activeApp, App3DR.App.Model3D)){
		this._projectManager.startBackgroundTasks();
	}else{
		console.log("no BG tasks during modeling");
	}



//this.testCams();




/*
var d = new DO();
this._root.addChild(d);
	var gr = d.graphics();
	gr.clear();
	gr.setFill(0x55FF0077);
	gr.setLine(2.0, 0xCCCC0000);
	gr.beginPath();
	gr.drawRect(50,50, 50,60);
	gr.endPath();
	gr.fill();
	gr.strokeLine();
*/


return;


	this._displayBG = new DO();
	this._displayMenu = new DO();
	this._root.addChild(this._displayBG);
	this._root.addChild(this._displayMenu);
	//GLOBALSTAGE = this._stage;

	var grid = new HexSystem(this._displayMenu);
	this._grid = grid;

	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();

	// var imageLoader = new ImageLoader("./images/",["background.png"], this,this._handleBackgroundImagesLoaded,null);
	// imageLoader.load();

	// mouse stuff
	this._mouseDown = false;
}




App3DR.prototype.testCams = function(){

// camera points in -z direction
// cam AtoB = camB * inv(camA)
// original p3d = inv(camA) * estimated-p3d(in AtoB)
// 	cameras are 'opposite' of their function, are forward of point translation

	var points3D = [];
	// make a cube
	points3D.push(new V3D(-1,-1,-1));
	points3D.push(new V3D( 1,-1,-1));
	points3D.push(new V3D(-1, 1,-1));
	points3D.push(new V3D( 1, 1,-1));
	points3D.push(new V3D(-1,-1, 1));
	points3D.push(new V3D( 1,-1, 1));
	points3D.push(new V3D(-1, 1, 1));
	points3D.push(new V3D( 1, 1, 1));

	points3D.push(new V3D(0,0,0));

	points3D.push(new V3D(0,1,0));
	points3D.push(new V3D(0,2,0));
	points3D.push(new V3D(0,3,0));
	points3D.push(new V3D(0,4,0));

	points3D.push(new V3D(1,0,0));
	points3D.push(new V3D(2,0,0));
	points3D.push(new V3D(3,0,0));
	points3D.push(new V3D(4,0,0));

	// + z
	points3D.push(new V3D(0,0,1));
	points3D.push(new V3D(0,0,2));
	points3D.push(new V3D(0,0,3));
	points3D.push(new V3D(0,0,4));
	points3D.push(new V3D(0,0,5));
	points3D.push(new V3D(0,0,6));

	// circle XY
	var circleCount = 100;
	var circleMag = 1.5;
	for(var i=0; i<circleCount; ++i){
		var p = i/(circleCount);
		var x = circleMag * Math.cos(p*2*Math.PI);
		var y = circleMag * Math.sin(p*2*Math.PI);
		var point = new V3D(x,y,0);
		points3D.push(point);
	}

	// circle xz
	var circleCount = 100;
	var circleMag = 1.5;
	for(var i=0; i<circleCount; ++i){
		var p = i/(circleCount);
		var x = circleMag * Math.cos(p*2*Math.PI);
		var y = circleMag * Math.sin(p*2*Math.PI);
		var point = new V3D(x,0,y);
		points3D.push(point);
	}

	// make a camera - intrinsic
	var imageWidth = 300;
	var imageHeight = 200;
	var fx = 100;
	var fy = 100;
	var cx = imageWidth*0.5;
	var cy = imageHeight*0.5;
	var  s = 0;
	var K = new Matrix(3,3);
	K.identity();
	K.set(0,0, fx);
	K.set(1,1, fy);
	K.set(0,2, cx);
	K.set(1,2, cy);
	K.set(0,1,  s);
	var Kinv = Matrix.inverse(K);
	//console.log("K: \n"+K);

	// position camera - extrinsic
	var camIdentity = new Matrix(4,4);
	camIdentity.identity();

	var camA = new Matrix(4,4);
	camA.identity();
		camA = Matrix.transform3DRotateY(camA, Code.radians(45));
		//camA = Matrix.transform3DRotateY(camA, Code.radians(0));
		//camA = Matrix.transform3DRotateX(camA, Code.radians(-10));
		camA = Matrix.transform3DTranslate(camA, 0,1,3);
	var camB = new Matrix(4,4);
	camB.identity();
		camB = Matrix.transform3DRotateY(camB, Code.radians(15));
		camB = Matrix.transform3DRotateX(camB, Code.radians(15));
		camB = Matrix.transform3DTranslate(camB, -1,0,2);
	// var camInvA = R3D.inverseCameraMatrix(camA);
	// var camInvB = R3D.inverseCameraMatrix(camB);
	var camInvA = Matrix.inverse(camA);
	var camInvB = Matrix.inverse(camB);


	var camAtoB = Matrix.mult(camB,camInvA); // YES



// 	var o = new V3D(0,0,0);
// 	var x = new V3D(1,0,0);
// 	var o2 = camAtoB.multV3DtoV3D(new V3D(), o);
// 	var x2 = camAtoB.multV3DtoV3D(new V3D(), x);
// 	console.log(o2+"");
// 	console.log(x2+"");
// 	var dx = V3D.sub(x2,o2);
// 	console.log(dx+" = "+dx.length());
// return;

	// ...

	var camAtoBInv = R3D.inverseCameraMatrix(camAtoB);

	console.log("A: \n"+camA+"");
	console.log("B: \n"+camB+"");
	console.log("I: \n"+camIdentity+"");
	console.log("AB: \n"+camAtoB+"");

	// project points to screen
	var projected2DA = [];
	var projected2DB = [];
	var errored2DA = [];
	var errored2DB = [];
	var errorPixels = 1.0; //1; //1.0;
	//var errorPixels = 0.1;
	var min = -0.5 * errorPixels;
	var max =  0.5 * errorPixels;
	var keep3D = [];
	for(var i=0; i<points3D.length; ++i){
		var p3D = points3D[i];
		// YES
		var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camA, K, null, true);
		var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camB, K, null, true);

		// var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camIdentity, K, null, true);
		// var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camAtoB, K, null, true);
		//console.log(p3D+" & "+p2DA+" | "+p2DB);
		if(!p2DA || !p2DB){
			continue;
		}
		var insideA = 0<p2DA.x && p2DA.x<imageWidth && 0<p2DA.y && p2DA.y<imageHeight;
		var insideB = 0<p2DB.x && p2DB.x<imageWidth && 0<p2DB.y && p2DB.y<imageHeight;
		if(!insideA || !insideB){
			continue;
		}
		keep3D.push(p3D);
		projected2DA.push(p2DA);
		projected2DB.push(p2DB);
		var e2DA = p2DA.copy();
		var e2DB = p2DB.copy();
		e2DA.add(new V2D( Code.randomFloat(min,max) ));
		e2DB.add(new V2D( Code.randomFloat(min,max) ));
		errored2DA.push(e2DA);
		errored2DB.push(e2DB);
	}
	points3D = keep3D;

	// get an F
	var F = null;
	F = R3D.fundamentalFromUnnormalized(errored2DA,errored2DB);
	// F = R3D.fundamentalFromUnnormalized(errored2DB,errored2DA);
	console.log("F:\n"+F);
	// F = R3D.fundamentalMatrixNonlinear(F,errored2DA,errored2DB);
	// console.log("F:\n"+F);

	// get a P
	// console.log(errored2DA);
	// console.log(errored2DB);
	var P = null;
	var force = true;
	//var force = false;
	// REVERSED: ?
	//P = R3D.transformFromFundamental(errored2DB, errored2DA, F, K, K, null, force);
	P = R3D.transformFromFundamental2(errored2DA, errored2DB, F, K, K, null, force);
	// P = R3D.inverseCameraMatrix(P);
	console.log("P:\n"+P);
//throw "?";
camAtoB = P;
		var P0 = new Matrix(4,4).identity();
		for(var i=0; i<1; ++i){
			var p3D = R3D.triangulationDLT(errored2DA,errored2DB, P0,P, K, K);
			P = R3D.cameraExtrinsicMatrixFromInitial(errored2DA, errored2DB, p3D, P, F, K, K);
		}
	//console.log("P:\n"+P);



// TEST
// var scaleToNormal = 1.0/0.6443050094821295;
// camAtoB = Matrix.transform3DScale(camAtoB, scaleToNormal);
console.log("camAtoB:\n"+camAtoB);
	// estimate 3D points from errored pixels:
	// var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
	var estimated3D = [];
	var reprojected2DA = [];
	var reprojected2DB = [];
	for(var i=0; i<projected2DA.length; ++i){
		// actual
		var pA2D = projected2DA[i];
		var pB2D = projected2DB[i];
		// estimated
			pA2D = errored2DA[i];
			pB2D = errored2DB[i];
		// var p3D = R3D.triangulatePointDLT(pA2D,pB2D, camA,camB, Kinv, Kinv); // OK

		var p3D = R3D.triangulatePointDLT(pA2D,pB2D, camIdentity,camAtoB, Kinv, Kinv); // A TO B 1

//		console.log("triangulated: "+p3D);
		estimated3D.push(p3D);

		// reprojection
		var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camIdentity, K, null, true);
		var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camAtoB, K, null, true); // A TO B !
		reprojected2DA.push(pA2D);
		reprojected2DB.push(pB2D);
	}
	// REPROJECTION ERROR
	var errorsA = [];
	var errorsB = [];
	var errors = [];
	for(var i=0; i<reprojected2DA.length; ++i){
		var p2DA1 = projected2DA[i];
		var p2DB1 = projected2DB[i];
		var p2DA2 = reprojected2DA[i];
		var p2DB2 = reprojected2DB[i];
		var errorA = V2D.distanceSquare(p2DA1,p2DA2);
		var errorB = V2D.distanceSquare(p2DB1,p2DB2);
		var error = errorA + errorB;
		//console.log(errorA+" | "+errorB+" | "+error+" | ");

		var p3D = estimated3D[i];
		var info = R3D.reprojectionError(p3D, p2DA2,p2DB2, camIdentity, camAtoB, K, K);
		info = info ? info["error"] : null;
		//console.log(info);
	}



	var error = R3D.reprojectionErrorList(estimated3D, reprojected2DA, reprojected2DB, camIdentity,camAtoB, K,K);
	console.log("REPROJECTION TOTAL ERROR");
	console.log(error);



// console.log(" 0- 1: "+V3D.distance(estimated3D[0],estimated3D[1]));
// console.log("13-14: "+V3D.distance(estimated3D[13],estimated3D[14]));
	var ratios = [];
	for(var i=0; i<estimated3D.length-1; ++i){
		var p3D1 = points3D[i];
		var e3D1 = estimated3D[i];
		for(var j=i+1; j<estimated3D.length-1; ++j){
			var p3D2 = points3D[j];
			var e3D2 = estimated3D[j];
			var dp = V3D.distance(p3D1,p3D2);
			var de = V3D.distance(e3D1,e3D2);
			if(dp>0){
				var ratio = de/dp;
				// console.log(ratio);
				ratios.push(ratio);
			}
		}
	}
	var rMean = Code.mean(ratios);
	var rSigma = Code.stdDev(ratios, rMean);
	console.log("ratio error: "+rMean+" +/- "+rSigma);

// var scaleToNormal = 1.0/V3D.distance(estimated3D[13],estimated3D[14]);
// camAtoB = Matrix.transform3DScale(camAtoB,scaleToNormal);
// 0.6443050094821295
//Matrix.transform3DScale(a,sX,sY,sZ)
//console.log(V3D.sub(estimated3D[10],estimated3D[11]).length());
	//console.log(estimated3D);

	for(var i=0; i<estimated3D.length; ++i){
		var p3D = points3D[i];
		var e3D = estimated3D[i];
		//console.log(p3D+"");
		//
		var o3D = camInvA.multV3DtoV3D(new V3D(), e3D); // identity & AtoB
		//var o3D = camA.multV3DtoV3D(new V3D(), e3D);
		//var o3D = camInvB.multV3DtoV3D(new V3D(), e3D);
		//var o3D = camB.multV3DtoV3D(new V3D(), e3D);
		//
		//var o3D = e3D; // camA & camB
		//
//		console.log(i+": "+p3D+" => "+o3D);
	}
	// F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	// F = R3D.fundamentalMatrixNonlinear(F,bestPointsA,bestPointsB);
	// P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka, Kb, null, force);

	// display projections
	var image = new DO();
	this._root.addChild(image);
	// image.graphics().clear();

	var d = image;
	// camera:
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo(imageWidth,0);
	d.graphics().lineTo(imageWidth,imageHeight);
	d.graphics().lineTo(0,imageHeight);
	d.graphics().endPath();
	d.graphics().strokeLine();

	// projections
	for(var i=0; i<projected2DA.length; ++i){
		var p2DA = projected2DA[i];
		var p2DB = projected2DB[i];
		p2DA = p2DB;
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p2DA.x,imageHeight-p2DA.y, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	d.matrix().identity();
	d.matrix().translate(100,100);


// save fake bundle adjustment data for visualization

var yaml = new YAML();
var timestampNow = Code.getTimeStamp();
yaml.writeComment("BA test");
yaml.writeComment("created: "+timestampNow);
yaml.writeBlank();

yaml.writeArrayStart("cameras");
	yaml.writeObjectStart();
		yaml.writeString("id","0");
		yaml.writeObjectStart("K");
			K.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
yaml.writeArrayEnd();


yaml.writeArrayStart("views");
	yaml.writeObjectStart();
		yaml.writeString("id","R04ZYF8K");
		yaml.writeString("camera","0");
		yaml.writeObjectStart("transform");
			camIdentity.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
	yaml.writeObjectStart();
		yaml.writeString("id","UB2GL8EB");
		yaml.writeString("camera","0");
		yaml.writeObjectStart("transform");
			camAtoB.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
yaml.writeArrayEnd();


yaml.writeArrayStart("points");
for(i=0; i<estimated3D.length; ++i){
	var e3D = estimated3D[i];
	yaml.writeObjectStart();
	yaml.writeNumber("X",e3D.x);
	yaml.writeNumber("Y",e3D.y);
	yaml.writeNumber("Z",e3D.z);
	yaml.writeObjectEnd();
}
yaml.writeArrayEnd();

yaml.writeDocument();
var str = yaml.toString();

var fxnZ = function(){
	console.log("saved ....");
}
var pm = this._projectManager;
pm.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
pm.saveBundleAdjust(str, fxnZ, this);
//this.saveProjectFile();


return;


}



// ------------------------------------------------------------------------------------------------------------
App3DR.Resource = function(complete, context){
	App3DR.Resource._.constructor.call(this, complete, context);
	console.log("new")
	var imageBase = "./images/";
	var icons = "icons/"
	var img = [];
		img[App3DR.Resource.TEX_BG_MAIN] = "background.png";
		img[App3DR.Resource.TEX_BG_CHECKERBOARD] = "bg_checkerboard_repeat.png";
		img[App3DR.Resource.TEX_CASE_STUDY_EXAMPLE] = "../../images/caseStudy1-9.jpg";
		img[App3DR.Resource.TEX_BUTTON_HEX_ACTIVE] = "button_base_active.png";
		img[App3DR.Resource.TEX_BUTTON_HEX_INACTIVE] = "button_base_inactive.png";
		img[App3DR.Resource.TEX_BUTTON_HEX_SELECTED] = "button_base_selected.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_LINK] = icons+"icon_button_link.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_PLUS] = icons+"icon_button_plus.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_MINUS] = icons+"icon_button_minus.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_UNDO] = icons+"icon_button_undo.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_GRID] = icons+"icon_button_grid.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_FEATURE] = icons+"icon_button_feature.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_DROP] = icons+"icon_button_drop.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN] = icons+"icon_button_arrow_down_full.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_MOVE] = icons+"icon_button_move.png";
	this._imgLoader.setLoadItems(imageBase,img);
	// this._imgLoader.addLoadItem(imageBase, "background.png");
	// this._imgLoader.addLoadItem(imageBase, "bg_checkerboard_repeat.png");
}
Code.inheritClass(App3DR.Resource,Resource);
App3DR.Resource.TEX_BG_MAIN = 0;
App3DR.Resource.TEX_BG_CHECKERBOARD = 1;
App3DR.Resource.TEX_CASE_STUDY_EXAMPLE = 2;
App3DR.Resource.TEX_BUTTON_HEX_ACTIVE = 3;
App3DR.Resource.TEX_BUTTON_HEX_INACTIVE = 4;
App3DR.Resource.TEX_BUTTON_HEX_SELECTED = 5;
App3DR.Resource.TEX_BUTTON_ICON_LINK = 6;
App3DR.Resource.TEX_BUTTON_ICON_PLUS = 7;
App3DR.Resource.TEX_BUTTON_ICON_MINUS = 8;
App3DR.Resource.TEX_BUTTON_ICON_UNDO = 9;
App3DR.Resource.TEX_BUTTON_ICON_GRID = 10;
App3DR.Resource.TEX_BUTTON_ICON_FEATURE = 11;
App3DR.Resource.TEX_BUTTON_ICON_DROP = 12;
App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN = 13;
App3DR.Resource.TEX_BUTTON_ICON_MOVE = 14;

// ------------------------------------------------------------------------------------------------------------

App3DR.App = function(resource, manager){
	App3DR.App._.constructor.call(this, resource, manager);
	this._projectManager = manager;
	this._resource = resource;
	this._root = new DO();
	this._canvas = null;
	this._stage = null;
}
Code.inheritClass(App3DR.App, Dispatchable);

App3DR.App.prototype.size = function(){
	return V2D.sub(this._max,this._min);
}
App3DR.App.prototype.setActive = function(canvas,stage,parent, min,max){
	console.log(canvas,stage,parent);
	this._canvas = canvas;
	this._stage = stage;
	this._min = min;
	this._max = max;
	parent.addChild(this._root);
	this._root.matrix().identity();
	this._root.matrix().translate(min.x,min.y);
	console.log("active");

}
App3DR.App.prototype.handleEnterFrame = function(e){
}
App3DR.App.prototype.handleMouseDown = function(e){
}
App3DR.App.prototype.handleMouseMove = function(e){
}
App3DR.App.prototype.handleMouseUp = function(e){
}
App3DR.App.prototype.handleKeyDown = function(e){
}
App3DR.App.prototype.handleKeyUp = function(e){
}
App3DR.App.prototype.updateSize = function(min,max){
	this._min = min;
	this._max = max;
}
App3DR.prototype._setupMatchCompareProjectManager = function(readyFxn){
	console.log("_setupMatchCompareProjectManager");
	// console.log(readyFxn);
	// throw "?"
compareIndex = 0;
// compareIndex = 1;
// compareIndex = 2;
// compareIndex = 12;
	var manager = this._projectManager;
	var app = this._activeApp;
	if(manager.isLoaded()){
		var views = manager.views();
		var pairs = manager.pairs();
		var triples = manager.triples();
// console.log(pairs)
		if(pairs.length>0){
			var pair1 = pairs[0];
			var pair2 = pairs[1];
			var pair3 = pairs[2];
pair1 = pairs[compareIndex];
			//var pair = pairs[pairs.length-1];
			var viewA = pair1.viewA();
			var viewB = pair1.viewB();
//			var viewC = pair2 ? pair2.viewB() : null;
//			var triple = triples[0];
var pair2 = null;
var pair3 = null;
var viewC = null;
var triple = null;
			var yamlBinary = null;
			var matchCount = null;
var showTriple = false;
			if(viewA && viewB){ // load: imageA | imageB | matching |
				var app = this._activeApp;
				var self = this;
				var imageA, imageB, imageC;
				var matchAB, matchAC, matchBC;
				var fxnA = function(){
					viewA.loadFeaturesImage(fxnB, self);
				}
				var fxnB = function(){
					viewB.loadFeaturesImage(fxnC, self);
				}
				var fxnC = function(){
					pair1.loadMatchingData(fxnD, self);
				}
				var fxnD = function(){
					if(viewC){
						viewC.loadFeaturesImage(fxnE, self);
					}else{
						fxnX();
					}
				}
				var fxnE = function(){
					pair2.loadMatchingData(fxnF, self);
				}
				var fxnF = function(){
					pair3.loadMatchingData(fxnG, self);
				}
				var fxnG = function(){
					console.log(triple);
					triple.loadMatchingData(fxnX, self);
				}
				var fxnH = function(what){
					//
				}
				var fxnX = function(){
					console.log("fxnX")
					var data = triple ? triple._matchingData : null;
					var matches = triple ? data["matches"] : [];
					var tripleA = [];
					var tripleB = [];
					var tripleC = [];
					for(var i=0; i<matches.length; ++i){
						var match = matches[i];
						var A = match["A"];
						var B = match["B"];
						var C = match["C"];
						tripleA.push( new V2D(A["x"],A["y"]) );
						tripleB.push( new V2D(B["x"],B["y"]) );
						tripleC.push( new V2D(C["x"],C["y"]) );
					}

					imageA = viewA.featuresImage();
					imageB = viewB.featuresImage();
					matchAB = pair1.matchingData();

					/*
					// trim bad matches:
					console.log(matchAB);
					var matches = matchAB["matches"];
					var maxMatch = Math.min(matches.length, 200);
					matchAB["matches"] = Code.copyArray(matches, 0,maxMatch-1);
					console.log(matchAB["matches"])
					*/

					if(pair2){
						matchAC = pair2.matchingData();
						imageC = viewC.featuresImage();
					}
					if(pair3){
						matchBC = pair3.matchingData();
					}

					var stage = self._stage;
					var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
					var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
					var imageMatrixC = R3D.imageMatrixFromImage(imageC, stage);
					console.log("ALLLLLL LOADED")
					//
					// app.setDisplay([imageA,imageB], [2], [[imageA,imageB,matchAB]]);
					// app.setDisplay([imageA,imageB,imageC], [1,2], [[imageA,imageB,matchAB],[imageA,imageC,matchAC]]);
					//app.setDisplay([imageA,imageB,imageC], [1,2], [[imageA,imageB,matchAB],[imageA,imageC,matchAC],[imageB,imageC,matchBC]]);
					if(showTriple){
						app.setDisplay([imageA,imageB,imageC], [1,2], [], [[tripleA,imageA, tripleB,imageB, tripleC,imageC]]);
					}else{
						// console.log("set: ");
						// console.log(imageA,imageB);
						app.setDisplay([imageA,imageB], [2], [[imageA,imageB,matchAB]]);
					}
				}
				fxnA();
			}
		}
		if(readyFxn && Code.isFunction(readyFxn)){
			console.log(readyFxn)
			readyFxn();
		}
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupMatchCompareProjectManager, this);
	}
}
App3DR.prototype._setupImageUploaderProjectManager = function(){
	console.log("_setupImageUploaderProjectManager");
	var manager = this._projectManager;
	if(manager.isLoaded()){
		console.log("is loaded: ");
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupImageUploaderProjectManager, this);
	}
}
App3DR.prototype._setupImageEditorProjectManager = function(){
	var manager = this._projectManager;
	if(manager.isLoaded()){

		var views = manager.views();
		console.log(views.length)
		console.log("is loaded: "+views.length);
		if(views.length>0){
			//var view = views[0];
			//var view = views[1];
			var view = views[views.length-1];
			this._activeView = view;
			console.lo
			var app = this._activeApp;
			var self = this;

			var fxnA = function(){
				view.loadFeaturesImage(fxnB, self);
			}
			var fxnB = function(){
				app.setActiveImage(view.featuresImage());
				view.loadMaskImage(fxnC, self);
			}
			var fxnC = function(){
				app.setActiveMask(view.maskImage(), true);
				view.loadFeatureData(fxnD, self);
			}
			var fxnD = function(){
				var features = view.features();
				var expanded = [];
				var img = view.featuresImage();
				var width = img.width;
				var height = img.height;
				// for(var i=0; i<features.length; ++i){
				// 	var f = features[i];
				// 	var p = new V3D();
				// 	p.x = f.x * width;
				// 	p.y = f.y * height;
				// 	p.z = f.z * width;
				// 	expanded.push(p);
				// }
				console.log("FEATURE SIZE: "+width+"x"+height);
				var expanded = R3D.denormalizeSIFTObjects(features, width, height);
				app.setActiveFeatures(expanded);
			}
			fxnA();
		}
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupImageEditorProjectManager, this);
	}
}
App3DR.prototype._handleImageEditorMaskUpdate = function(editor){
	console.log("_handleImageEditorMaskUpdate");
	var image = editor.maskSource();
	var view = this._activeView;
	if(view && image){
		view.saveMaskPicture(image);
	}
}
App3DR.prototype._handleImageUploaderFileReady = function(package){
	console.log(package);
	var file = package["file"];
	var uploader = this._activeApp;
	var adapter = this._uploadAdapter;
	adapter._addFileToQueue(file);
}




// --------------------------------------------------------------------------------------------------------------------
App3DR.prototype._setupModel3DProjectManager = function(projectManager){
	console.log("_setupModel3DProjectManager");

	var self = this;
	var manager = projectManager;
	var expectedFeatureImages = 0;
	var currentFeaturesImages = 0;
		var fxnStart = function(){
			console.log("fxnStart");
			var views = manager.views();
			expectedFeatureImages = views.length;
			for(var i=0; i<views.length; ++i){
				var view = views[i];
				//view.loadDenseHiImage(fxnImageLoaded, self);
				// view.loadFeaturesImage(fxnImageLoaded, self); // only needs to be good enough to get some distinction in color
				view.loadIconImage(fxnImageLoaded, self);
				// view.loadPreviewImage(fxnImageLoaded, self);
			}
		}
		var fxnImageLoaded = function(){
			console.log("fxnImageLoaded")
			currentFeaturesImages++;
			checkDone();
		}
		var checkDone = function(){
			if(currentFeaturesImages<expectedFeatureImages){
				return;
			}
			fxnDone();
		}
		var fxnDone = function(){
			console.log("fxnDone");
			self._projectBALoad(projectManager);
		}

	if(projectManager.isLoaded()){
		fxnStart();
	}else{
		projectManager.addFunction(App3DR.ProjectManager.EVENT_LOADED, fxnStart, this);
	}

}
App3DR.prototype._projectBALoad = function(projectManager){
	console.log("_projectBALoad");
	// projectManager.loadBundleAdjust(this._projectBALoaded,this, null);
	var app = this;
	var fxn = function(data){
		console.log(data);
		console.log("fxn")
		app._projectBALoaded(data);
	}
	// var filename = "bundle/"+projectManager._testFilename;
	var filename = projectManager._testFilename;
	if(filename){
		projectManager.loadDataFromFile(filename, fxn, app);
	}else{
		console.log("no test filename");
	}
}
App3DR.prototype._projectBALoaded = function(object){
	console.log("_projectBALoaded")
	// console.log(object,data)
	// console.log(data);
	// console.log(object);
	// var str = Code.binaryToString(data);
	// console.log(str);

	// var object = YAML.parse(str);
	// if(Code.isArray(object)){
	// 	object = object[0];
	// }

	var cameras = object["cameras"];
	var views = object["views"];
	var points = object["points"];

	var textures = object["textures"];
	var vertexes = object["vertexes"];
	var triangles = object["triangles"];


	var cameraLookup = {};
	var cameraLookupIndex = {};
	if(cameras){
		for(var i=0; i<cameras.length; ++i){
			var c = cameras[i];
			var id = c["id"];
			cameraLookup[id] = c; // TODO: this should be id
			cameraLookupIndex[id] = i;
		}
	}
var min3D = null;
var max3D = new V3D();
	var points3D = [];
	var normals3D = [];
	var points2D = Code.newArrayArrays(views.length);
	console.log(views);

	var viewsLookupIndex = {};
	for(var i=0; i<views.length; ++i){
		var v = views[i];
		var id = v["id"];
		viewsLookupIndex[id] = c; // TODO: this should be id
		console.log(id+" = "+i)
		viewsLookupIndex[id] = i;
	}

if(points){
	for(var i=0; i<points.length; ++i){
		var v = points[i];
		var point3D = new V3D(v["X"],v["Y"],v["Z"]);
		points3D.push(point3D);
		if(v["x"] !== undefined){
			var normal3D = new V3D(v["x"],v["y"],v["z"]);
			// var normal3D = new V3D(1.0,0.0,0.0);
			// console.log(normal3D.length());
			normal3D.norm();
			normals3D.push(normal3D);
		}
		if(!min3D){
			min3D = new V3D(point3D.x,point3D.y,point3D.z);
			max3D = new V3D(point3D.x,point3D.y,point3D.z);
		}
		var viewList = v["views"];
		if(!viewList){
			viewList = v["v"];
		}
		
		if(viewList){
			for(var j=0; j<viewList.length; ++j){
				var v = viewList[j];
				var indexIn = v["view"];
				if(indexIn===undefined){
					indexIn = v["v"]; 
				}
				if(indexIn===undefined){
					indexIn = v["i"]; 
				}
				// console.log(indexIn);
				var index = viewsLookupIndex[indexIn];
				// console.log(index);
				var p = {"x":v["x"], "y":v["y"], "3D":point3D}; // new V2D(v["x"],v["y"]);

				// var v = views[index];
				// console.log(p);
				if(index===undefined){
					console.log(" .............. ");
					// 	// index = views[0]["id"]; // for fake data
					console.log(v);
					console.log(indexIn);
					console.log(viewsLookupIndex);
					throw "no index: "+index;
				}else{
					points2D[index].push(p);
				}
			}
		}
		V3D.min(min3D,min3D,point3D);
		V3D.max(max3D,max3D,point3D);
		
//console.log("TODO: SCALE ENTIRE SCENE ????? OR INCREASE FRUSTRUM");
//point3D.scale(0.001);
	}
}else if(vertexes){
	for(var i=0; i<vertexes.length; ++i){
		var v = vertexes[i];
		var point3D = new V3D(v["X"],v["Y"],v["Z"]);
		if(!min3D){
			min3D = new V3D(point3D.x,point3D.y,point3D.z);
			max3D = new V3D(point3D.x,point3D.y,point3D.z);
		}
		V3D.min(min3D,min3D,point3D);
		V3D.max(max3D,max3D,point3D);
	}
}

this._modelMax3D = max3D;
this._modelMin3D = min3D;
var manager = this._projectManager;
console.log(manager);
// throw "?HHHHHH"
var projectViews = manager.views();
	var views3D = [];
	for(var i=0; i<views.length; ++i){
		var v = views[i];
// console.log(v)
		var transform = v["transform"];
		if(!transform){
			transform = v["R"];
		}
			transform = new Matrix().loadFromObject(transform);
 // extrinsic to camera matrix
var inverse = Matrix.inverse(transform);
transform = inverse;

var o1 = new V3D(0,0,0);
var z1 = new V3D(0,0,1);
// var z1 = new V3D(0,0,-1);
var o2 = transform.multV3DtoV3D(o1);
var z2 = transform.multV3DtoV3D(z1);
z2.sub(o2);

var dot = V3D.dot(z1,z2);
var angle = V3D.angle(z1,z2);

console.log(" -> "+o1+" / "+o2);
console.log(" possible: "+i+" = "+dot+" @ "+Code.degrees(angle)+" : "+o1+"/"+o2);

		var camID = v["camera"]
		var camera = cameraLookup[camID];
		var K = null;
		var distortion = null;
		if(camera){
			K = camera["K"];
			if(!K){ // on object
				K = camera;
			}
			if(K["fx"]){
				var fx = K["fx"];
				var fy = K["fy"];
				var s = K["s"];
				var cx = K["cx"];
				var cy = K["cy"];
				var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			}else{
				K = new Matrix().loadFromObject(K);
			}
			distortion = camera["distortion"];
		}else{
			K = new Matrix(3,3).fromArray(1,0,0, 0,1,0, 0,0,1);
		}
		var image = null;
		for(var j=0; j<projectViews.length; ++j){
			var pv = projectViews[j];
			if(pv.id()==v["id"]){
			//if(i==j){ // TODO: FIX ID
				//image = pv.featuresImage();
				//image = pv.denseHiImage(); // REPLACE 1
				// image = pv.bundleAdjustImage(); // REPLACE 1
				// console.log("bundleAdjustImage");
				// console.log(image);
				// console.log(pv.denseHiImage());
				// image = pv.denseHiImage();
				// image = pv.feature();
				image = pv.anyLoadedImage();
				// console.log(image);
				break;
			}
		}
		var view = {"transform":transform, "K":K, "distortion":distortion, "image":image, "id":v["id"]};
		views3D.push(view);
	}

	if(textures){
		var loadedTextureCount = 0;
		var expectedTextureCount = textures.length;
		var loadedTextureImages = Code.newArrayNulls(expectedTextureCount);
		var fxnLoadedImage = function(i,data){
			manager.dataToImage(data, function(image){
				loadedTextureImages[i] = image;
				loadedTextureCount += 1;
				console.log("LOADED IMAGES: "+loadedTextureCount);
				if(loadedTextureCount==expectedTextureCount){
					console.log("create triangles");
					app.setTextures(loadedTextureImages, triangles, vertexes);
				}
			});
		}
		// console.log(textures);
		for(var i=0; i<textures.length; ++i){
			var texture = textures[i];
			var file = texture["file"];
			// App3DR.ProjectManager.prototype.loadTriangleTextureFromFilename = function(filename, callback, context, object){
			manager.loadTriangleTextureFromFilename(file, fxnLoadedImage, manager, i);
throw "triangle texture"
		}
		// throw "LOAD TEXTURES";
	}

	var app = this._activeApp;
	app._originalPoints = points;
console.log("this._originalPoints");
console.log(app._originalPoints);
console.log(points2D);
	if(points3D.length>0){
		app.setPoints(points3D, points2D, null, normals3D);
	}
	app.setViews(views3D);
	if(!max3D || !min3D){
		max3D = new V3D(1,1,1);
		min3D = new V3D(-1,-1,-1);
	}
console.log(min3D,max3D);
	var range = V3D.sub(max3D,min3D);
	var maxDistance = max3D.length();
	maxDistance = maxDistance * 2;
	maxDistance = Math.max(maxDistance,10);
	app._distanceRange = maxDistance * 0.5;
	console.log("maxDistance: "+maxDistance);
	app._stage3D.frustrumAngle(45);
	app._stage3D.distanceNear(0.01);
	app._stage3D.distanceFar(maxDistance);


console.log("DONE");
}




App3DR.App.MatchCompare = function(resource, manager){
	App3DR.App.MatchCompare._.constructor.call(this, resource);
	console.log("MatchCompare");
	this._displayData = null;
	this._display = new DO();
	this._root.addChild(this._display);
//this._displayPairDO.alpha(0.5);
//this._root.graphics().alpha(0.1);
	this._matchingPair = null;
}
Code.inheritClass(App3DR.App.MatchCompare, App3DR.App);

App3DR.App.MatchCompare.prototype.setDisplay = function(imageList,rowList,matchList, tripleList){
	var i, j, k;
	var countTotal = imageList.length;
	var countCurrent = 0;
	var maxWidth = 0;
	var colHeight = 0;

	var largestWidth = 0;
	var largestHeight = 0;
	var imageInfoList = [];
	var matchInfoList = [];
	var tripleInfoList = [];
	var image;
	for(i=0; i<imageList.length; ++i){
		image = imageList[i];
		largestWidth = Math.max(largestWidth,image.width);
		largestHeight = Math.max(largestHeight,image.height);
		imageInfoList[i] = {"image":image};
	}
	var maximumRows = rowList.length;
	var maximumCols = 0;
	for(i=0; i<rowList.length; ++i){
		maximumCols = Math.max(maximumCols, rowList[i]);
	}
//	console.log("maximumRows: "+maximumRows);
//	console.log("maximumCols: "+maximumCols);
	// MATCHES:
	for(i=0; i<matchList.length; ++i){
		var imageA = matchList[i][0];
		var imageB = matchList[i][1];
		var matching = matchList[i][2];
		var match = {};
		match["match"] = matching;
		for(j=0; j<imageInfoList.length; ++j){
			var info = imageInfoList[j];
			if(info["image"]==imageA){
				match["A"] = info;
			}else if(info["image"]==imageB){
				match["B"] = info;
			}
		}
		matchInfoList.push(match);
	}
	this._matchList = matchInfoList;
	// TRIPLES:
	if(tripleList){
		for(i=0; i<tripleList.length; ++i){
			var triple = tripleList[i];
			var pointsA = triple[0];
			var imageA = triple[1];
			var pointsB = triple[2];
			var imageB = triple[3];
			var pointsC = triple[4];
			var imageC = triple[5];
			var trip = {};
				trip["pointsA"] = pointsA;
				trip["pointsB"] = pointsB;
				trip["pointsC"] = pointsC;
			for(j=0; j<imageInfoList.length; ++j){
				var info = imageInfoList[j];
				if(info["image"]==imageA){
					trip["imageA"] = info;
				}else if(info["image"]==imageB){
					trip["imageB"] = info;
				}else if(info["image"]==imageC){
					trip["imageC"] = info;
				}
			}
			tripleInfoList.push(trip);
		}
	}

	var grid = new V2D(maximumCols,maximumRows);
	var objectSize = new V2D(largestWidth,largestHeight);
console.log("objectSize: "+objectSize);
	var fullSize = new V2D(largestWidth*maximumCols,largestHeight*maximumRows);
	// setup display locations:

	for(i=0; i<rowList.length; ++i){
		var rowCount = rowList[i];

		for(j=0; j<rowCount; ++j){
			var info = imageInfoList[countCurrent+j];
			info["column"] = (j + (maximumCols-rowCount)*0.5 );
			info["row"] = i;
			/*
			rowWidth += image.width;
			maxRowHeight = Math.max(maxRowHeight, image.height);
			var match = null;
			// for(k=0; k<matchList.length; ++k){
			// 	if(matchList[k][0]==image){
			// 		match = ;
			// 	}
			// }
			var info = {"image":image, "row":row, "match":match};
			imageInfo.push(info);
			*/
		}
		// row = {"width":rowWidth, "height":maxRowHeight}
		// rowInfo[i] = row;
		// colHeight += maxRowHeight;
		// maxWidth = Math.max(maxWidth, rowWidth);
		countCurrent += rowCount;
	}

	this._displayData = {"images":imageInfoList, "objectSize":objectSize, "fullSize":fullSize, "grid":grid, "matches":matchInfoList, "triples":tripleInfoList};
	console.log(this._displayData);
	this._render();

	// SAVE THE LOCATIONS / SIZES FOR HIT - TESTING
}
App3DR.App.MatchCompare.prototype.handleMouseDown = function(e){
	var display = this._displayData;
	var location = e["location"];
	// console.log(display);
	if(!this._displayPairDO){
		this._displayPairDO = new DO();
		this._root.addChild(this._displayPairDO);
	}
	if(display){
		var imageInfo = display["images"];
		for(var i=0; i<imageInfo.length; ++i){
			var image = imageInfo[i];
			var off = image["offset"];
			var size = image["size"];
			//var rect = new Rect(off.x,off.y,size.x,size.y);
			var a = new V2D().add(off).add(0,0);
			var b = new V2D().add(off).add(size.x,0);
			var c = new V2D().add(off).add(size.x,size.y);
			var d = new V2D().add(off).add(0,size.y);
			var isInside = Code.isPointInsideRect2D(location, a,b,c,d);
			//console.log(isInside);
			if(isInside){
//				console.log(image);
				var local = V2D.sub(location,off);
				var percent = local.copy().scale(1.0/size.x,1.0/size.y);
				var img = image["image"];
				var matrix = image["matrix"];
				if(!matrix){
					matrix = this._stage.getImageAsFloatRGB(img);
					matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
					image["matrix"] = matrix;
				}
				// show a rect:

				///console.log(matrix);
				var total = new V2D(matrix.width(),matrix.height());
				total.scale(percent.x,percent.y);

console.log("RANGE PROFILING:");
R3D.rangeProfileImagePoint(matrix, total);

				var compareSize = 21;
				var scale = 1.0;
				var square = matrix.extractRectFromFloatImage(total.x,total.y,scale,null,compareSize,compareSize, null);

					var img = square;
					img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
					var d = new DOImage(img);
					d.matrix().scale(4.0);
					d.matrix().translate(600 + i*100, 10);
					this._displayPairDO.addChild(d);

				var pair = this._matchingPair;
				if(!pair){
					pair = {};
					this._matchingPair = pair;
				}
				pair[""+i] = {"location":total, "image": image};

				//this.checkMatchPairs();
			}
		}
	}
// 	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
// 	if(move){
// 		var data = e["data"];
// 		var location = data["location"];
// 		this._explorer.mouseUp(location);
// 		this.moveAreaCancel();
// 		this._render();
// 	}
// }
}
App3DR.App.MatchCompare.prototype.handleKeyDown = function(e){
	var keyCode = e.keyCode;
	if(keyCode == Keyboard.KEY_ENTER){
		this.checkMatchPairs();
	}else if(keyCode == Keyboard.KEY_SPACE){
		if(this._displayPairDO){
			this._displayPairDO.removeAllChildren();
		}
	}else if(keyCode == Keyboard.KEY_LET_F){
		this.calculateF();
	}else if(keyCode == Keyboard.KEY_LET_M){
		this.findMatchF();
	}
}
App3DR.App.MatchCompare.prototype.findMatchF = function(){
	console.log("findMatchF");
	var pair = this._matchingPair;
	if(pair){
		var keys = Code.keys(pair);
		// console.log(keys);
		// console.log(pair);
		if(keys.length==2){
			var imageA = pair[keys[0]];
			var imageB = pair[keys[1]];
			pair = null;
			var locationA = imageA["location"];
			var locationB = imageB["location"];
			var dataA = imageA["image"];
			var dataB = imageB["image"];
			var matrixA = dataA["matrix"];
			var matrixB = dataB["matrix"];
			var F = this.calculateF(false);
			var Finv = R3D.fundamentalInverse(F);
			console.log(F);
			R3D.findMatchingPointF(matrixA,matrixB,F,Finv, locationA);

		}
	}
	console.log("out");

}
App3DR.App.MatchCompare.prototype.calculateF = function(log){
	log = log!==undefined ? log : true;
	// console.log("calculateF");
	var index = 0;
	var matchList = this._matchList[index]["match"];
	// console.log(matchList);
	var sizeFr = matchList["fromSize"];
	var sizeTo = matchList["toSize"];
	var matches = matchList["matches"];
	// console.log(matches);
	// R3D.fundamentalFromUnnormalized = function(pointsA,pointsB, skipNonlinear){
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// console.log(match);
		var fr = match["fr"];
		var to = match["to"];
		var pointA = new V2D(fr.x*sizeFr.x,fr.y*sizeFr.y);
		var pointB = new V2D(to.x*sizeTo.x,to.y*sizeTo.y);
		pointsA.push(pointA);
		pointsB.push(pointB);
	}
	var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	var widA = sizeFr.x;
	var heiA = sizeFr.y;
	var widB = sizeTo.x;
	var heiB = sizeTo.y;
	var Fnorm = R3D.fundamentalNormalizeImageSizes(F, widA,heiA, widB,heiB);
	// var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB));
	var yaml = new YAML();
	yaml.writeObjectStart("F");
		Fnorm.toYAML(yaml);
	yaml.writeObjectEnd();
	var str = yaml.toString();
	var Finv = R3D.fundamentalInverse(F);
	var info = R3D.fErrorList(F, Finv, pointsA, pointsB);
	if(log){
		console.log(F);
		console.log("\n"+str+"\n");
		console.log(info);
	}
	return F;
}
App3DR.App.MatchCompare.prototype.checkMatchPairs = function(){
	var pair = this._matchingPair;
	if(pair){
		var keys = Code.keys(pair);
		if(keys.length==2){
			var imageA = pair[keys[0]];
			var imageB = pair[keys[1]];
			pair = null;
			var locationA = imageA["location"];
			var locationB = imageB["location"];
			var dataA = imageA["image"];
			var dataB = imageB["image"];
			var matrixA = dataA["matrix"];
			var matrixB = dataB["matrix"];
			//var checkScale = 2.0;
			var checkScale = 1.0;
			var result = R3D.bestPairMatchExhaustivePoint(matrixA,locationA, matrixB,locationB, checkScale);

			var bestScale = result["scale"];
			var bestAngle = result["angle"];
			var bestOffset = result["offset"];
			console.log("MATCH: "+locationA+" => "+locationB+" @ scale: "+bestScale+", angle: "+bestAngle+", + "+bestOffset);
			//console.log(result);
bestScale = 1.0;
bestAngle = 0.0;
bestOffset = new V2D();

locationB.add(bestOffset);
var lA = locationA.copy().scale(1.0/matrixA.width(),1.0/matrixA.height());
var lB = locationB.copy().scale(1.0/matrixB.width(),1.0/matrixB.height());
		var str = "\n\n\t-\n\t\tfr:\n\t\t\ti: 0\n\t\t\tx: "+lA.x+"\n\t\t\ty: "+lA.y+"\n\t\t\ts: 1.0\n\t\t\ta: 0.0\n\t\tto:\n\t\t\ti: 0\n\t\t\tx: "+lB.x+"\n\t\t\ty: "+lB.y+"\n\t\t\ts: "+bestScale+"\n\t\t\ta: "+bestAngle+"\n\n";
		console.log(str);




// SHOW SAD SCORE:
//var compareSize = 31;
var compareSize = 21;
//var compareSize = 11;
var matrix = new Matrix(3,3).identity();
var needle = matrixA.extractRectFromFloatImage(locationA.x,locationA.y,1.0,null,compareSize,compareSize, matrix);
//
var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,bestScale);
	matrix = Matrix.transform2DRotate(matrix,bestAngle);
var haystack = matrixB.extractRectFromFloatImage(locationB.x,locationB.y,1.0,null,compareSize,compareSize, matrix);
//R3D.searchNeedleHaystackImageFlatSADBin
var result = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
var score = result["value"];
console.log("SCORE: "+score);



//var seedTestAngles = Code.lineSpace(-15,15, 15);
var testAngles = Code.lineSpace(-10,10, 10);
var testScales = Code.lineSpace(-.1,.1, .1);
var baseScale = bestScale;
var baseAngle = bestAngle;
var searchSize = null;

var info = R3D.Dense.optimumTransform(matrixA,locationA, matrixB,locationB, compareSize,baseScale,baseAngle, testScales,testAngles, searchSize);
console.log(info);
var scale = info["scale"];
var angle = info["angle"];
var score = info["score"];
var info = R3D.Dense.rankForTransform(matrixA,null,locationA, matrixB,null,locationB, scale,angle,score, compareSize);
if(info){
var rank = info["rank"];
var uniq = info["uniqueness"];
console.log("SCORE: "+score);
console.log("RANK: "+rank);
console.log("UNIQ: "+uniq);



// investigate more

// HERE
// var data = R3D.Dense.comparePathTransforms(imageA,pointA1,pointA2, imageB,pointB1,pointB2, sizeCompare,scaAB, subShow);
// NEED START/END POINT PAIRS




// HERE



}


/*

// interpolationData

var pairs = [];
	// 9:
	// pairs.push([new V2D(1.0,1.0), new V2D( 0.0,1.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,1.0), new V2D( 7.0,1.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,1.0), new V2D(12.0,1.0), 2.0, 2.0]);
	// pairs.push([new V2D(1.0,5.0), new V2D( 1.0,5.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,5.0), new V2D( 6.0,5.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,6.0), new V2D(10.0,5.0), 2.0, 2.0]);
	// pairs.push([new V2D(1.0,9.0), new V2D( 3.0,7.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,9.0), new V2D( 4.0,8.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,9.0), new V2D( 7.0,9.0), 2.0, 2.0]);

	pairs.push([new V2D(1.0,1.0), new V2D( 0.0,1.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,1.0), new V2D( 6.0,1.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,1.0), new V2D(12.0,0.0), 2.0, 3.0]);
	pairs.push([new V2D(1.0,5.0), new V2D( 1.0,5.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,5.0), new V2D( 5.0,5.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,5.0), new V2D( 9.0,5.0), 2.0, 2.0]);
	pairs.push([new V2D(1.0,9.0), new V2D( 3.0,7.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,9.0), new V2D( 5.0,9.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,9.0), new V2D( 8.0,9.0), 2.0, 2.0]);

	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(2.0,3.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(3.0,2.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D( 0.0, 0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D( 2.0, 2.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D( 8.0, 1.5), 2.0, 2.0]);
	//pairs.push([new V2D(5.0,5.0), new V2D(10.0, 8.0), 2.0, 2.0]);
	//pairs.push([new V2D(2.0,6.0), new V2D(4.0,12.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(2.0,2.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(10.0,1.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(1.0,1.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(5.0,0.5), 2.0, 2.0]);
var world = new R3D.BA.World();
var viewA = world.addView();
var viewB = world.addView();
viewA.image(matrixA);
viewB.image(matrixB);
viewA.size(new V2D(matrixA.width(), matrixA.height()));
viewB.size(new V2D(matrixB.width(), matrixB.height()));
// console.log(viewA,viewB)
var transform = world.transformFromViews(viewA,viewB);
// console.log("PAIRS:"+pairs.length);
for(var p=0; p<pairs.length; ++p){
	var pair = pairs[p];
	var pA = pair[0];
	var pB = pair[1];
	var scaleAB = pair[2];
	var angleAB = pair[3];
	//console.log(pA,pB,scaleAB, angleAB);
	var match = world.addMatchForViews(viewA,pA, viewB,pB, scaleAB,angleAB);

	var point3D = match.point3D();
		point3D.disconnect(world);
	var pointA = match.pointA();
	var pointB = match.pointB();
		pointA.isPutative(false);
		pointB.isPutative(false);
	world.insertNewPoint3D(point3D);
}


//console.log("SIZEA: "+viewA.pointSpace().toArray().length);
var pointA = new V2D(5,5);
var points2D = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB, true);
var data = R3D.BA.interpolationData(pointA, points2D, viewA,viewB);
console.log(data["point"]+"");


var OFFX = 1600;
var OFFY = 450;
var ss = 40.0;
for(x=0; x<=10; x+=.5){
	for(y=0; y<=10; y+=.5){
		//var pointA = new V2D(0,0);
		var pointA = new V2D(x,y);
		var points2D = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB, true);
		// console.log(points2D);
		var data = R3D.BA.interpolationData(pointA, points2D, viewA,viewB);
		// console.log(data);
		var pt = data["point"];
		var ang = data["angle"];
		var sca = data["scale"];
		// console.log("point:"+pt);
		// console.log("angle:"+ang);
		// console.log("scale:"+sca);
		var base = 5.0;
		var d = new DO();
		d.graphics().clear();
		//d.graphics().setFill(0xFF00FF00);
		d.graphics().setLine(1.0, 0xCCCC0000);
		d.graphics().beginPath();
		//d.graphics().drawCircle(0,0,base*sca);
		d.graphics().drawCircle(0,0,base*sca);
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(base*sca,0);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().rotate(ang);
		//d.matrix().translate(x*ss,y*ss);
		d.matrix().translate(pt.x*ss,-pt.y*ss);
		d.matrix().translate(OFFX,OFFY);
		GLOBALSTAGE.addChild(d);
	}
}

*/




			var compareSize = 21;

			var scale = 1.0;
			var angle = 0.0;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,scale);
				matrix = Matrix.transform2DRotate(matrix,angle);
			var squareA = matrixA.extractRectFromFloatImage(locationA.x,locationA.y,1.0,null,compareSize,compareSize, matrix);

			var scale = bestScale;
			var angle = bestAngle;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,bestScale);
				matrix = Matrix.transform2DRotate(matrix,bestAngle);
			var squareB = matrixB.extractRectFromFloatImage(locationB.x,locationB.y,1.0,null,compareSize,compareSize, matrix);

			// display
			this._displayPairDO.removeAllChildren();
			var i = 0;
			var sca = 4.0;
			var img = squareA;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(800 + i*100, 10);
			this._displayPairDO.addChild(d);

			var i = 1;
			var sca = 4.0;
			var img = squareB;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(800 + i*100, 10);
			this._displayPairDO.addChild(d);

		}
		this._matchingPair = null;

	}
}
/*
App3DR.App.prototype.handleEnterFrame = function(e){
}
App3DR.App.prototype.handleMouseDown = function(e){
}
App3DR.App.prototype.handleMouseMove = function(e){
}
App3DR.App.prototype.handleMouseUp = function(e){
}

App3DR.App.prototype.handleKeyUp = function(e){
}
*/
App3DR.App.MatchCompare.prototype._render = function(){
	// ...
	console.log("RENDER");
	this._display.removeAllChildren();
	if(this._displayData){
		var grid = this._displayData["grid"];
		var fullSize = this._displayData["fullSize"];
		var objectSize = this._displayData["objectSize"];
		var imageInfo = this._displayData["images"];
		var matchInfo = this._displayData["matches"];
		var tripleInfo = this._displayData["triples"];
		var containerSize = this.size();

		var fitSize = Code.sizeToFitInside(containerSize.x,containerSize.y, fullSize.x,fullSize.y);
		//console.log(objectSize+"  ... "+fitSize);
		var scale = fitSize.x/fullSize.x;
		//console.log(scale);
		//this._displayData = {"images":imageInfo, "size":objectSize}
		//var diff = V2D.sub(containerSize,fitSize);
		var i, j, k;
		for(i=0; i<imageInfo.length; ++i){
			var info = imageInfo[i];
			var image = info["image"];
			var col = info["column"];
			var row = info["row"];
			var size = objectSize.copy().scale(scale);
			var off = size.copy().scale(col,row);
			var d = new DOImage(image);
			info["offset"] = off;
			info["size"] = size;
			d.size(size.x,size.y);
			this._display.addChild(d);
			d.matrix().identity();
			d.matrix().translate(off.x,off.y);
		}
		// matches after images
		for(i=0; i<matchInfo.length; ++i){
			console.log("matchInfo: "+i);
			var match = matchInfo[i];
			console.log(match)
			var imageA = match["A"];
			var imageB = match["B"];
			var matches = match["match"];
// F IS NOT CURRENTLY PASSED
// var F = matches["F"];
// 	F = new Matrix().loadFromObject(F);
//console.log(F+"");
// console.log("A: "+imageA["offset"]);
// console.log("B: "+imageB["offset"]);
			var matchingList = matches["matches"];
			if(matchingList){
				var d = new DO();
				this._display.addChild(d);
				console.log(matchingList.length+" .... match length" );
				//d.graphics().setLine(1.0,0x99FF0000);
				for(j=0; j<matchingList.length; ++j){
					var m = matchingList[j];
					var to = m["to"];
					var fr = m["fr"];
						var t = new V2D(to["x"],to["y"]);
						var f = new V2D(fr["x"],fr["y"]);
					var f = f.copy().scale(imageA["size"].x,imageA["size"].y);
					f.add(imageA["offset"]);
					var t = t.copy().scale(imageB["size"].x,imageB["size"].y);
					t.add(imageB["offset"]);
					// console.log(f+" => "+t);
					var colors = [];
					var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
					colors.push(color);
					color = Code.inverseColorARGB(color);
					//colors.push(color);
					for(k=0; k<colors.length; ++k){ // fat to skinny
						//d.graphics().setLine(1.0+(colors.length-1-k)*6,color);
						d.graphics().setLine(1.0,color);
						d.graphics().beginPath();
						d.graphics().moveTo(f.x,f.y+k);
						d.graphics().lineTo(t.x,t.y+k);
						d.graphics().endPath();
						d.graphics().strokeLine();
					}
					// if(j>50){
					// 	break;
					// }
				}
			}
			// var imA = imageA["image"];
			// var imB = imageB["image"];

		}

		// triples
		for(i=0; i<tripleInfo.length; ++i){
			console.log("tripleInfo: "+i);
			var triple = tripleInfo[i];
			console.log(triple);
			var imageA = triple["imageA"];
			var imageB = triple["imageB"];
			var imageC = triple["imageC"];
			var pointsA = triple["pointsA"];
			var pointsB = triple["pointsB"];
			var pointsC = triple["pointsC"];
			// 
			var d = new DO();
			this._display.addChild(d);

			for(j=0; j<pointsA.length; ++j){
				var a = pointsA[j];
				var b = pointsB[j];
				var c = pointsC[j];

				a = a.copy().scale(imageA["size"].x,imageA["size"].y);
				a.add(imageA["offset"]);
				b = b.copy().scale(imageB["size"].x,imageB["size"].y);
				b.add(imageB["offset"]);
				c = c.copy().scale(imageC["size"].x,imageC["size"].y);
				c.add(imageC["offset"]);
				var color = 0xFFFF0000;
				//var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
				var connections = [[a,b],[b,c],[a,c]];
				for(k=0; k<connections.length; ++k){
					var f = connections[k][0];
					var t = connections[k][1];
					d.graphics().setLine(1.0,color);
					d.graphics().beginPath();
					d.graphics().moveTo(f.x,f.y);
					d.graphics().lineTo(t.x,t.y);
					d.graphics().endPath();
					d.graphics().strokeLine();
				}
				if(j>50){
					break;
				}
			}
		}

/*


		// var toSizeA = new V2D(imA.width,imA.height);
		// var toSizeB = new V2D(imB.width,imB.height);


		var toSizeA = new V2D(imA.width,imA.height).scale(scale);
		var toSizeB = new V2D(imB.width,imB.height).scale(scale);

		var scaleA = scale;
		var scaleB = scale;
		// F for visualizing
		var Floc = F.copy();
			Floc = Matrix.mult( Floc, Matrix.transform2DScale(new Matrix(3,3).identity(), 1.0/scaleA, 1.0/scaleA) );
			Floc = Matrix.mult( Matrix.transform2DScale(new Matrix(3,3).identity(), 1.0/scaleB, 1.0/scaleB), Floc );

		this.showF(d, Floc, matchingList, imageA["offset"],imageA["size"], imageB["offset"],imageB["size"]);


			var pointsA = [];
			var pointsB = [];
			var matches = match["match"];
			var matchingList = matches["matches"];
			for(i=0; i<matchingList.length; ++i){
				var m = matchingList[i];
				var to = m["to"];
				var fr = m["fr"];
					var t = new V2D(to["x"],to["y"]);
					var f = new V2D(fr["x"],fr["y"]);
					f.scale(imA.width,imA.height);
					t.scale(imB.width,imB.height);
				pointsA[i] = new V3D(f.x,f.y,1.0);
				pointsB[i] = new V3D(t.x,t.y,1.0);
			}
		// var error = R3D._gdFun([pointsA,pointsB], F.toArray(), false);
		// var averageError = error/pointsA.length;
		var error = R3D.fundamentalMatrixError(F, pointsA,pointsB);
		console.log("F AVG ERROR: "+error+" == "+(error/pointsA.length));
*/


	}


}

App3DR.App.MatchCompare.prototype.showF = function(display, matrixFfwd, matches, offsetA,sizeA, offsetB,sizeB){
	console.log(matches)

	matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	var colors = [0xFFFF0000, 0xFFFF9900, 0xFFFF6699, 0xFFFF00FF, 0xFF9966FF, 0xFF0000FF,  0xFF00FF00 ]; // R O M P B P G
	// var imageWidth = imageMatrixA ? imageMatrixA.width() : 400;
		// var imageHeight = imageMatrixA ? imageMatrixA.height() : 300;
		// var scale = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight); // imageWidth + imageHeight;
	var scale = 0.25 * Math.max(sizeA.length(),sizeB.length());

	// SHOW F LINES ON EACH
	for(var k=0; k<matches.length; ++k){
		var percent = k / (matches.length-1);
		var match = matches[k];
		var to = match["to"];
		var fr = match["fr"];
		var pointA = new V2D(fr["x"],fr["y"]);
		var pointB = new V2D(to["x"],to["y"]);
			pointA.scale(sizeA.x,sizeA.y);
			pointB.scale(sizeB.x,sizeB.y);
		pointA = new V3D(pointA.x,pointA.y,1.0);
		pointB = new V3D(pointB.x,pointB.y,1.0);
		var lineA = new V3D();
		var lineB = new V3D();

		matrixFfwd.multV3DtoV3D(lineA, pointA);
		matrixFrev.multV3DtoV3D(lineB, pointB);

		var d, v;
		var dir = new V2D();
		var org = new V2D();

		var rad = 4.0;
		//var color = Code.interpolateColorGradientARGB(percent, colors);
		var color = colors[k%colors.length];
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	var closest = Code.closestPointLine2D(org,dir, pointB);
	var dist = V2D.distance(closest,pointA);
//console.log("DIFF 1: "+dist);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(offsetB.x + closest.x-dir.x, offsetB.y + closest.y-dir.y);
		d.graphics().lineTo(offsetB.x + closest.x+dir.x, offsetB.y + closest.y+dir.y);
		d.graphics().drawCircle(offsetB.x + pointB.x, offsetB.y + pointB.y, rad);
		// d.graphics().drawCircle(offsetB.x + closest.x, offsetB.y + closest.y, rad*0.5);
		d.graphics().moveTo(offsetB.x + pointB.x, offsetB.y + pointB.y);
		d.graphics().lineTo(offsetB.x + closest.x, offsetB.y + closest.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	var closest = Code.closestPointLine2D(org,dir, pointA);
	var dist = V2D.distance(closest,pointA);
//console.log("DIFF 2: "+dist);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(offsetA.x + closest.x-dir.x, offsetA.y + closest.y-dir.y);
		d.graphics().lineTo(offsetA.x + closest.x+dir.x, offsetA.y + closest.y+dir.y);
		d.graphics().drawCircle(offsetA.x + pointA.x, offsetA.y + pointA.y, rad);
		// d.graphics().drawCircle(offsetA.x + closest.x, offsetA.y + closest.y, rad*0.5);
		d.graphics().moveTo(offsetA.x + pointA.x, offsetA.y + pointA.y);
		d.graphics().lineTo(offsetA.x + closest.x, offsetA.y + closest.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);

	}
}


// --------------------------------------------------------------------------------------------------------------------



App3DR.App.ImageUploader = function(resource){
	App3DR.App.ImageUploader._.constructor.call(this, resource);
	// var client = new ClientFile();
	// this._clientFile = client;
	this._displayDropArea = new DO();
	this._root.addChild(this._displayDropArea);

	var d;
	var domUploadDiv = Code.newDiv();
		Code.setStylePosition(domUploadDiv, "absolute");
		Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x9900FF00));
		//Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x00000000));
	this._domUploadDiv = domUploadDiv;
	var body = Code.getBody();
		//Code.addChild(domUploadDiv, body);
		Code.addChild(body, domUploadDiv);

		// LISTEinfo["position"] = null;NERS
	this._jsDispatch = new JSDispatch();
	// UPLOAD
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_OVER, this._handleDragOverUploadFxn, this);
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_DROP, this._handleDragDropUploadFxn, this);
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_LEAVE, this._handleDragOutUploadFxn, this);
}
Code.inheritClass(App3DR.App.ImageUploader, App3DR.App);

App3DR.App.ImageUploader.prototype.setActive = function(canvas,stage,parent, min,max){
	App3DR.App.ImageUploader._.setActive.call(this, canvas,stage,parent, min,max);
	this._dropAreaSize = new V2D(200,200);
	this._updateDisplayNormal();
}
App3DR.App.ImageUploader.prototype._updatePosition = function(){
	var canvas = this._canvas;
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	var containerSize = V2D.sub(this._max,this._min);
	var offset = V2D.sub(containerSize,size).scale(0.5);
	d.matrix().identity();
	d.matrix().translate(offset.x,offset.y);
}
App3DR.App.ImageUploader.prototype._updateDisplayOver = function(){
	this._updatePosition();
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	d.graphics().clear();
	d.graphics().setFill(0xFF00FF00);
	d.graphics().setLine(5.0,0xFF990000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	this._render();
}
App3DR.App.ImageUploader.prototype._updateDisplayNormal = function(){
	this._updatePosition();
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	d.graphics().clear();
	d.graphics().setFill(0xFF999999);
	d.graphics().setLine(5.0,0xFF990000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	this._render();
}
App3DR.App.ImageUploader.prototype._render = function(){
	var canvas = this._canvas;

	var d;
	var size = this._dropAreaSize;

	var upScale = canvas.presentationScale();
	var downScale = 1.0/upScale;

	var topLeftMe = new V2D();
	var topLeftRoot = new V2D();
	DO.pointLocalUp(topLeftRoot,topLeftMe,this._displayDropArea,null);//this._root);

	var topLeft = topLeftRoot.copy().scale(-1).scale(downScale);
	var divSize = size.copy().scale(downScale);

	d = this._domUploadDiv;
	Code.setStylePadding(d, "0px");
	Code.setStyleMargin(d, "0px");
	Code.setStyleLeft(d, topLeft.x+"px");
	Code.setStyleTop(d, topLeft.y+"px");
	Code.setStyleWidth(d, divSize.x+"px");
	Code.setStyleHeight(d, divSize.y+"px");
}
App3DR.App.ImageUploader.prototype._fileTypeAcceptable = function(type){
	return true;
}
App3DR.App.ImageUploader.prototype._handleDragOutUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayNormal();
}
App3DR.App.ImageUploader.prototype._handleDragOverUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayOver();
}
App3DR.App.ImageUploader.prototype._handleDragDropUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayNormal();

	var fileList = e.dataTransfer.files;
	var i, len = fileList.length;
	for(i=0; i<len; ++i){
		var file = fileList[i];
		var filename = file.name;
		var filetype = file.type;
		console.log(filename+" "+filetype);



		if(this._fileTypeAcceptable(filetype)){
			var package = {"file":file, "filename":filename, "filetype":filetype};
			this.alertAll(App3DR.App.ImageUploader.EVENT_FILE_ADDED, package);

		}


	}
}










App3DR.App.UploadAdapterToPictures = function(manager, stage){
	this._projectManager = manager;
	this._stage = stage;
	this._fileQueue = [];
	this._processingFile = null;
}
App3DR.App.UploadAdapterToPictures.prototype.isBusy = function(){
	var val = this._processingFile; // || this._processingPicture || this._processingView;
	return val!=null;
}
App3DR.App.UploadAdapterToPictures.prototype._addFileToQueue = function(file){
	this._fileQueue.push(file);
	this._checkFileQueue();
}
App3DR.App.UploadAdapterToPictures.prototype._checkFileQueue = function(){
	if(this.isBusy()){
		return;
	}
	if(this._fileQueue.length==0){
		return;
	}
	this._processingFile = this._fileQueue.shift();
	this._processCurrentFile();
}
App3DR.App.UploadAdapterToPictures.prototype._processCurrentFile = function(){
	var file = this._processingFile;
	var filename = file.name;
	var extension = Code.fileExtensionFromName(filename);
	var filetype = file.type;
	var reader = new FileReader();
	var canvas = this._canvas;
	var stage = this._stage;
	var root = this._root;
	var self = this;

	reader.onload = function(progressEvent){
		var binary = reader.result;
		if(binary){
			var base64 = Code.arrayBufferToBase64(binary);
			var imageSrc = Code.appendHeaderBase64(base64, filetype);
			var image = new Image();
			image.onload = function(e){
				var originalWidth = image.width;
				var originalHeight = image.height;
				// var minimumPixelCount = 100*100 // 10000 | 126x95 = 11970
				var minimumPixelCount = 25*25; // 625
				var sizes = [];
				var i;
				var scale = 1.0;
				var width, height, pixelCount;
				for(i=0; i<10; ++i){
					width = Math.round(scale*originalWidth);
					height = Math.round(scale*originalHeight);
					pixelCount = width*height;
					console.log(width+"x"+height+" = "+pixelCount);
					if(pixelCount<minimumPixelCount){
						break;
					}
					sizes.push( new V3D(width,height, scale) );
					scale = scale*0.5; // all halves
				}
				if(sizes.length==0){ // push original image as default
					sizes.push( new V3D(originalWidth,originalHeight, 1.0) );
				}
// 
// JPEG.EXIF(domImage, function(data){
// 					// console.log("data");
// 					console.log(data);
// 					var orientation = data.metadata()["Orientation"];
// 					console.log("orientation: "+orientation);
// 				});
// var mime = Code.mimeTypeFromBinaryData(data);
var base64Data = image.src;
var binaryData = Code.base64StringToBinary(base64Data);
console.log(binaryData);
console.log("PROCESS PICTURE");
var mime = Code.mimeTypeFromBinaryData(binaryData);
console.log(mime);
console.log(mime==Code.MIMETYPE_JPG);
if(mime==Code.MIMETYPE_JPG){
	console.log("IS JPG");
	JPEG.EXIF(binaryData, function(data){
		console.log(data);
		var orientation = data.metadata()[JPEG.EXIF_TAG_ORIENTATION];
		console.log(orientation);
		var angle = 0;
		if(orientation==JPEG.EXIF_ORIENTATION_TOP_UP){
			console.log("UP");
			angle = 0;
		}else if(orientation==JPEG.EXIF_ORIENTATION_TOP_LEFT){
			console.log("LEFT");
			angle = 270;
		}else if(orientation==JPEG.EXIF_ORIENTATION_TOP_RIGHT){
			console.log("RIGHT");
			angle = 90;
		}else if(orientation==JPEG.EXIF_ORIENTATION_TOP_DOWN){
			console.log("DOWN");
			angle = 180;
		}
		self._processPictures(image, extension, sizes, angle);
	});
}else{
	throw "unknown MIME TYPE";
}
// console.log(image);
// console.log(extension);
// console.log(sizes);
				// self._processPictures(image, extension, sizes);
			}
			image.src = imageSrc;
		}
	}
	reader.readAsArrayBuffer(file);
}
App3DR.App.UploadAdapterToPictures.prototype._processPicturesLoaded = function(i){
	console.log("_processPicturesLoaded: "+i);
}
App3DR.App.UploadAdapterToPictures.prototype._processPictures = function(image, extension, sizes, angle){
//var uploadImageTypeCamera = true;
//var uploadImageTypeCamera = false;
var uploadImageTypeCamera = this.uploadImageTypeCamera;
	var stage = this._stage;
	console.log("_processPictures");
	var self = this;


	var cameraReady = function(camera){
		var calibration = camera.newCalibrationImage();
		viewReady(calibration);
	}
	var viewReady = function(view){
		var i;
		var pictureList = [];
		var mat = R3D.imageMatrixFromImage(image, stage);
		console.log(view);
console.log("angle: "+angle);
// console.log(mat.size());
var flipSizes = false;
if(angle==90){
	mat = mat.rotate90();
	flipSizes = true;
}else if(angle==180){
	mat = mat.rotate180();
}else if(angle==270){
	mat = mat.rotate270();
	flipSizes = true;
}
if(flipSizes){
	for(var i=0; i<sizes.length; ++i){
		var x = sizes[i].x;
		var y = sizes[i].y;
		sizes[i].x = y;
		sizes[i].y = x;
	}
}
// console.log(mat.size());
// throw "?"
		// if(uploadImageTypeCamera){
		// 	view.camera()
		// }else{
			view.aspectRatio(mat.width()/mat.height());
		// }
		var countTotal = sizes.length;
		for(i=0; i<sizes.length; ++i){
			size = sizes[i];
			var width = size.x;
			var height = size.y;
			var scale = size.z;
			var matBlurred;
			if(scale<1.0){
				//var sigma = Math.sqrt(0.25 / scale);
				//matBlurred = mat.getBlurredImage(sigma); // picking right sigma is hard
				matBlurred = mat.getScaledImageInteger(scale);
			}else{
				matBlurred = mat;
			}

			var completeFxn = function(s){
				var self = this;
				this.fxn = function(){
					var size = self.size;
					// console.log(size+"");
					var pictureList = self.pictureList;
					var app = self.app;
					var scaledImage = self.scaledImage;
					var width = size.x;
					var height = size.y;
					var scale = size.z;
						var d = new DOImage(scaledImage);
						// d.graphics().setLine(4.0,0xFFFF0000);
						// d.graphics().setFill(0x55FF00FF);
						// d.graphics().drawRect(0,0,width,height);
						// d.graphics().strokeLine();
						// d.graphics().fill();
						var doScale = false;
						// if(size.x<200){ // debug test
						// 	GLOBALSTAGE.addChild(d);
						// }
						//var doScale = true;
						d.matrix().identity();
						if(doScale){
							d.matrix().scale(scale);
						}
					var renderedImage = stage.renderImage(width,height,d, null);
					var imageBase64 = renderedImage.src;
					var imageBinary = Code.base64StringToBinary(imageBase64);
					var w = renderedImage.width;
					var h = renderedImage.height;
					var filename = (scale*100)+""+"."+extension; // Math.round
					var object = {};
						object["filename"] = filename;
						object["size"] = size;
						object["binary"] = imageBinary;
						object["scale"] = scale;
						object["view"] = view;
					pictureList.push(object);
					console.log(pictureList.length+" / "+countTotal);
// throw "before upload .."
					if(pictureList.length==countTotal){
						//if(uploadImageTypeCamera){
						app._uploadedViewPicture(view, pictureList);
					}
				}
			}
			var temp = new completeFxn();
			temp.size = size;
			temp.pictureList = pictureList;
			temp.app = self;
			var scaledImage = R3D.imageFromImageMatrix(matBlurred, stage, temp.fxn);
			temp.scaledImage = scaledImage;
		}
	}
	if(uploadImageTypeCamera){
		var cameras = this._projectManager.cameras();
		if(cameras.length==0){ // new cam
			this._projectManager.addCamera(cameraReady, this);
		}else{
			cameraReady(cameras[0]);
		}
	}else{
		this._projectManager.addView(viewReady, this);
	}
}
App3DR.App.UploadAdapterToPictures.prototype._uploadedViewPicture = function(view, pictureList){
	if(pictureList.length>0){
		var top = pictureList.shift();
			var size = top["size"];
			var binary = top["binary"];
			var size = top["size"];
			var scale = top["scale"];
		view.addPicture(size, scale, binary, this._uploadedViewPicture, this, pictureList);
	}else{
		console.log("uploaded picture complete");
		// SHOULD ALSO SAVE PROJECT FILE TO DISK
		this._projectManager.saveProjectFile(); // TODO: INTERNALIZE THIS TO PROJECT MANAGER
		this._processingFile = null;
		this._checkFileQueue();
	}
}







// --------------------------------------------------------------------------------------------------------------------




App3DR.App.ImageEditor = function(resource){
	App3DR.App.ImageEditor._.constructor.call(this, resource);
	this._explorer = new App3DR.Explorer2D();
	this._testImageSource = null;
	this._testImageMatrix = null;
	this._imageMaskSource = null;
	this._testImageMaskMatrix = null;
	this._featuresSource = null;
}
Code.inheritClass(App3DR.App.ImageEditor, App3DR.App);

App3DR.App.ImageEditor.EVENT_MASK_UPDATE = "img.update";

App3DR.App.ImageEditor.prototype._handleResourceLoaded = function(){
	var resource = this._resource;
	this._imageCheckerboard = resource.tex(App3DR.Resource.TEX_BG_CHECKERBOARD);


//	console.log(this._imageCheckerboard);
//	this._testImageSource = resource.tex(App3DR.Resource.TEX_CASE_STUDY_EXAMPLE);
/*
}
App3DR.App.ImageEditor.prototype._handleTestImageLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	this._testImageSource = imageList[0];
	*/

	this._displayBackground.image(this._imageCheckerboard);
	this._displayImageAlpha = 0.75;
	this._maskColor = 0x6600FF00;

	this._testButton();

	this._render();
}
App3DR.App.ImageEditor.prototype.maskSource = function(){
	return this._imageMaskSource;
}
App3DR.App.ImageEditor.prototype.setActiveImage = function(imageSource){
	console.log("setActiveImage");
	this._testImageSource = imageSource;
	this._testImageMatrix = R3D.imageMatrixFromImage(imageSource, this._stage);

	if(this._testImageSource){
		var img = this._testImageSource;
		var sourceWidth = img.width;
		var sourceHeight = img.height;
		var canvas = this._canvas;
		var size = canvas.size();
		// siz = Math.min(size.x,size.y);
		// size.set(siz,siz);
		size = this.size();
		this._explorer.setSizes(size, new V2D(sourceWidth,sourceHeight) );
	}
	//this._render();
}
App3DR.App.ImageEditor.prototype.setActiveMask = function(imageSource, force){
	this._imageMaskSource = imageSource;
	this._testImageMaskMatrix = R3D.imageMatrixFromImage(imageSource, this._stage);
	// change from colored to gray:
	if(this._testImageMaskMatrix){
		console.log(this._testImageMaskMatrix)
		var m = this._testImageMaskMatrix;
		var r = m.red();
		var g = m.grn();
		var b = m.blu();
		var l = r.length;
		for(var i=0; i<l; ++i){
			var rr = r[i];
			var gg = g[i];
			var bb = b[i];
			// force all to 1.0;
			if(rr>0 || gg>0 || bb>0){
				r[i] = g[i] = b[i] = 1.0;
			}
		}
	}
	if(!imageSource && force && this._testImageMatrix){
		var mat = this._testImageMatrix;
		this._testImageMaskMatrix = new ImageMat(mat.width(), mat.height());
		this.updateMaskImageFromMatrix(false);
	}
	this._render();
}
App3DR.App.ImageEditor.prototype.setActiveFeatures = function(features){
	var maxCount = 2000;
	if(features.length>maxCount){
		features = Code.copyArray(features, 0,maxCount-1);
	}
	console.log(features)
	this._featuresSource = features;
	this._render();
}
App3DR.App.ImageEditor.prototype.updateMaskImageFromMatrix = function(send){
	console.log("updateMaskImageFromMatrix");
	send = send!==undefined ? send : true;
	var matrix = this._testImageMaskMatrix;
	var stage = this._stage;

	var color = this._maskColor;//0x00FF00;
	var width = matrix.width();
	var height = matrix.height();
	var alp = Code.copyArray(matrix.red()); // any of 3
	var a = Code.getFloatAlpARGB(color);
	var r = Code.getFloatRedARGB(color);
	var g = Code.getFloatGrnARGB(color);
	var b = Code.getFloatBluARGB(color);
	var count = width*height;
	var red = new Array(count);
	var grn = new Array(count);
	var blu = new Array(count);
	var i;
	for(i=0; i<count; ++i){
		var c = alp[i] * a;
		red[i] = r;
		grn[i] = g;
		blu[i] = b;
		alp[i] = c;
	}
	var image = stage.getFloatARGBAsImage(alp,red,grn,blu, width, height);
	//
	this._imageMaskSource = image;
	if(send){
		this._maskUpdate();
	}
}
App3DR.App.ImageEditor.prototype._maskUpdate = function(){
	this.alertAll(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this);
}
App3DR.App.ImageEditor.prototype.setActive = function(canvas,stage,parent, min,max){
	App3DR.App.ImageEditor._.setActive.call(this, canvas,stage,parent, min,max);

	//this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_DRAW;

	// setup screen
	this._displayBackground = new DOImage();
	this._displayPixels = new DO();
	this._displayFeatures = new DO();

	this._displayMaskImage = new DOImage();
	this._displayImage = new DOImage();
	this._root.addChild(this._displayBackground);
		this._root.addChild(this._displayImage);
		this._root.addChild(this._displayMaskImage);
	this._root.addChild(this._displayPixels);
	this._root.addChild(this._displayFeatures);


	this._areaInterfaceMove = new DO();
	this._areaInterfaceRotate = new DO();
	this._root.addChild(this._areaInterfaceMove);
	this._root.addChild(this._areaInterfaceRotate);

this._rotationAngle = null;

	this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_UP, this.moveAreaHandleMouseUp, this);
	this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_DOWN, this.moveAreaHandleMouseDown, this);

	this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_DOWN, this.rotateAreaHandleMouseDown, this);

	this._imageMaskSource = null;


	console.log(this._resource);
	if(!this._resource.loaded()){
		this._resource.addFunction(Resource.EVENT_LOADED, this._handleResourceLoaded, this);
	}else{
		this._handleResourceLoaded();
	}

	console.log("setup screen");
/*
	// UI
	this._displayUI = new DO();
	this._displayScale = new DO();
	this._root.addChild(this._displayUI);
		this._displayUI.addChild(this._displayScale);

	this._gizmoScale = new GizmoSlider(this._displayScale);
	this._render();
*/

//this.testDO();
	/*
	this._gizmoRotate = new GizmoRotate();

	this._gizmoBrush = new GizmoSlider();

	this._gizmoToggle = new GizmoToggle();

	this._gizmoUndo = new GizmoToggle();

	*/
/*
	* slider draw-size
	* undo
	* toggle write/rease/move.   (add/delete)
			image focus ?
	* slider zoom/scale
	* rotate starting point
	* toggle feature pts
	* exit button
	* toggle pixel lines button
	* choose mask color
	* choose image transparancy
*/
}
App3DR.App.generateButtonToggle = function(resource, parent, iconImages){

	var button = new DOButtonToggle();
	parent.addChild(button);
	var pressed = [];
	var unpressed = [];
	var hit = null;
	var inactive = null;
	var i;
	for(i=0; i<iconImages.length; ++i){
		var icon = iconImages[i];
//console.log(icon);
		var displays = App3DR.App.generateButtons(resource, parent, icon);
		pressed.push(displays["active"]);
		unpressed.push(displays["pressed"]);
		if(i==0){
			inactive = displays["inactive"];
			hit = displays["hit"];
		}
	}
//console.log(unpressed,pressed);
	button.setDOHitArea(hit);
	button.setDOInactive(inactive);
	button.setToggleItems(unpressed,pressed);
	return button;
}
App3DR.App.generateButton = function(resource, parent, iconImage){
	var displays = App3DR.App.generateButtons(resource, parent, iconImage);

	var d;

	var hit = displays["hit"];
	var active = displays["active"];
	var notactive = displays["inactive"];
	var pressed = displays["pressed"];

	var button = new DOButton();
	parent.addChild(button);
	button.setDOHitArea(hit);
	button.setDOUnpressed(active);
	button.setDOPressed(pressed);
	button.setDOInactive(notactive);

	button.addFunction(DOButton.EVENT_SHORT_PRESS, function(d){
		console.log("short press");
	});
	button.addFunction(DOButton.EVENT_LONG_PRESS, function(d){
		console.log("long press");
	});
	button.addFunction(DOButton.EVENT_PRESS_START, function(d){
		console.log("do press");
	});
	button.addFunction(DOButton.EVENT_PRESS_END, function(d){
		console.log("un press");
	});
	button.addFunction(DOButton.EVENT_PRESS_CANCEL, function(d){
		console.log("cancel");
	});

	// button.isActive(false);
	// button.isActive(true);

	return button;
}
App3DR.App.generateButtons = function(resource, parent, iconImage){
	var imageActive = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_ACTIVE);
	var imageInactive = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_INACTIVE);
	var imageSelected = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_SELECTED);

	var displays = {};

	var d = new DO();
	var size = new V2D(100,100);
	var gr = d.newGraphicsIntersection();
	//var gr = d.graphics();
	gr.clear();
	gr.setFill(0xFF009900);
	gr.beginPath();
	gr.drawRect(0,0, size.x,size.y);
	gr.endPath();
	gr.fill();
	displays["hit"] = d;


	var active = new DO();
		d = new DOImage();
		d.image(imageActive);
		d.size(size.x,size.y);
		active.addChild(d);
		d = new DOImage();
		d.image(iconImage);
		d.size(size.x,size.y);
		active.addChild(d);
	displays["active"] = active;

	var upscale = 1.2;
	var pressed = new DO();
		d = new DOImage();
		d.image(imageSelected);
		d.size(size.x,size.y);
		pressed.addChild(d);
		d = new DOImage();
		d.image(iconImage);
		d.size(size.x,size.y);
		pressed.addChild(d);
		d.matrix().identity();
		d.matrix().translate(-size.x*0.5,-size.y*0.5);
		d.matrix().scale(upscale);
		d.matrix().translate(size.x*0.5,size.y*0.5);
	displays["pressed"] = pressed;

	var notactive = new DO();
		d = new DOImage();
		d.image(imageInactive);
		d.size(size.x,size.y);
		notactive.addChild(d);
	displays["inactive"] = notactive;

	return displays;
}

App3DR.App.ImageEditor.prototype._testButton = function(){
	var resource = this._resource;
	var imageIconLink = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_LINK);
	var imageIconUndo = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_UNDO);
	var imageIconPlus = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_PLUS);
	var imageIconMinus = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_MINUS);
	var imageIconUndo = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_UNDO);
	var imageIconGrid = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_GRID);
	var imageIconFeature = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_FEATURE);
	var imageIconDrop = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_DROP);
	var imageIconArrow = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN);
	var imageIconMove = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_MOVE);
	//console.log(imageIconArrow)
	/*
	var button;
	var buttons = [];
	button = App3DR.App.generateButton(resource, this._root, imageIconLink);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconUndo);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconPlus);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconMinus);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconDrop);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconArrow);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconFeature);
	buttons.push(button);
	var i;
	for(i=0; i<buttons.length; ++i){
		var y = 0;
		var x = i * 100;
		button = buttons[i];
		if(i>=5){
			y = 400;
			x = (i-5)*100;
		}
		button.matrix().translate(x,y);
	}
	*/

	var button = App3DR.App.generateButtonToggle(resource, this._root, [imageIconPlus, imageIconMinus, imageIconMove]);


	button.addFunction(DOButtonToggle.EVENT_TOGGLE_CHANGE, function(d){
		//console.log("toggled: "+d.toggleIndex());
		this.saveImage();
	}, this);

	button.matrix().translate(0,0);
}

// App3DR.App.ImageEditor.prototype._loadActiveViewPictureComplete = function(view){
// 	console.log("_loadActiveViewPictureComplete");
// 	console.log(view);
// 	var image = this._activeView.featuresImage();
// 	console.log(image);

// 	// set local variables
// 		var stage = this._stage;
// 		var imageSource = this._testImageSource;
// 		var imageFloat = stage.getImageAsFloatRGB(imageSource);
// 		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
// 	this._testImageMatrix = imageMatrix;
// 	this._testImageMaskMatrix = new ImageMat(imageMatrix.width(),imageMatrix.height());

// 	console.log("set");

// 	var img = this._testImageSource;
// 	var sourceWidth = img.width;
// 	var sourceHeight = img.height;
// 	var canvas = this._canvas;
// 	var size = canvas.size();
// 	siz = Math.min(size.x,size.y);
// 	size.set(siz,siz);
// 	this._explorer.setSizes(size, new V2D(sourceWidth,sourceHeight) );

// 	this._render();
// }

App3DR.App.ImageEditor.prototype.saveImage = function(){

return;

	var image = this._stage.renderImage(500,101,this._root, this._root.matrix().copy().inverse());
	//var image = this._stage.renderImage(100,100,this._root.parent());
	//var image = this._stage.renderImage(500,100,this._root);
	//var image = this._stage.renderImage(500,100,this._root);
	//var image = this._stage.renderImage(500,100,d.parent());
	//var image = this._stage.renderImage(500,100,this._displayBackground.parent());
	//var image = this._stage.renderImage(600,100,d.parent().parent());
	//var image = this._stage.renderImage(100,100,this._root, this._root.matrix());
//	console.log(image);
/*
	Code.addChild( Code.getBody(), image);
	Code.setStyleWidth( image, "200px");
*/
	var src = image.src;
//	console.log(src);
	//var string = src.replace("data:image/png;base64,","");
	///data:(.*);base64,/"
	var string = src.replace(/data:(.*);base64,/,"");
	console.log(string);
	var data = Code.base64StringToBinary(string);
	console.log(data);
	data = [data];
	// return;
	// console.log(data);

	var type = "image/png";
	//var type = 'application/octet-stream';
	var blob = new Blob(data,{"type":type});
	console.log(blob);

	var url = window.URL.createObjectURL(blob);
	var view = window;
	view.open(url, "newwindow",'width=300,height=300');



// 	next
// App3DR.js:509 toggled: 1
// App3DR.js:518 <img width=​"100" height=​"100" src=​"data:​image/​png;​base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIklEQVR4Xu3VsRHAMAzEsHj/​pTOBXbB9pFchyLycz0eAwFXgsCFA4C4gEK+DwENAIJ4HAYF4AwSagD9IczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhH4AStUAMmSuOW2AAAAAElFTkSuQmCC">​
// Dispatch.js:37 CAUGHT ERROR FOR EVENT:  dobt.evttgl
// Dispatch.js:38 TypeError: Failed to construct 'Blob': Iterator getter is not callable.
//     at App3DR.App.ImageEditor.saveImage (App3DR.js:520)
//     at App3DR.App.ImageEditor.<anonymous> (App3DR.js:510)
//     at Dispatch.alertAll (Dispatch.js:34)
//     at DOButtonToggle.Dispatchable.alertAll (Dispatchable.js:59)
//     at DOButtonToggle.DO.alertAll (DO.js:229)
//     at DOButtonToggle.toggleIndex (DOButton.js:283)
//     at DOButtonToggle._toggleComplete (DOButton.js:276)
//     at Dispatch.alertAll (Dispatch.js:34)
//     at DOButtonToggle.Dispatchable.alertAll (Dispatchable.js:59)
//     at DOButtonToggle.

	// getARGBAsImage
	/*
	var data = ["teting data blob"];
	var type = "text/plain";

	var blob = new Blob(data,{"type":type});

	console.log(blob);


	var url = window.URL.createObjectURL(blob);
	var view = window;
	//view.open(url, "_blank");

	view.open(url, "newwindow",'width=300,height=300');
	return;
	//view.location.href = url;
	*/
}

App3DR.App.ImageEditor.prototype.testDO = function(){
	console.log("testDO");
	var d = new DO();
		this._root.addChild(d);
	var fxn = function(e){
		//console.log("e");
		console.log(e["target"]==d);
		console.log(e);
	}
	//d.addFunction(DO.EVENT_MOUSE_DOWN, fxn, this);
	//d.addFunction(Canvas.EVENT_MOUSE_DOWN, fxn, this);
	//d.addFunction(Canvas.EVENT_MOUSE_MOVE, fxn, this);
	d.addFunction(Canvas.EVENT_MOUSE_UP, fxn, this,  true);
	//Canvas.EVENT_MOUSE_MOVE


	var size = new V2D(500,500);
	//var gr = d.newGraphicsIntersection();
	var gr = d.graphics();
	gr.clear();
	gr.setFill(0xFF00FF00);
	gr.setLine(2.0, 0xCCCC0000);
	gr.beginPath();
	gr.drawRect(0,0, size.x,size.y);
	gr.endPath();
	gr.fill();
	gr.strokeLine();



}
GizmoToggle = function(root, size){
	// list of option / buttons
	// on tap go to next option / image
	// alert on change
}
GizmoRotate = function(root, size){
	// inverted-circular hit area
	// on start drag: record angle from center
	// on end drag: record final location angle delta
	// alert on changes
}
GizmoSlider = function(root, size){
	// rectangular hit area -- events: down, move, out in local coords
	// only care about up/down
	// round to some percentage of active height
	// display visuals behind hit area:
	//	small at top
	// large at bottom
	// gradient between
	// alert on changes
	this._root = root;
	this._size = size;
	var slider = new DO();
	root.addChild(slider);
	/*
	var fxn = function(){
		console.log("drag start");
	}
	slider.addListener(DO.EVENT_DRAG_BEGIN, fxn, this);

	var size = new V2D(50,50);
	var d = slider;
	d.graphics().clear();
	d.graphics().setFill(0xFF00FF00);
	d.graphics().setLine(2.0, 0xCCCC0000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	//d.graphics().drawPolygon(poly,true);
	//d.graphics().drawCircle(location.x,location.y,2.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();

	//
	slider.enableDragging();
	*/
}
App3DR.App.ImageEditor.prototype._render = function(){
	var canvas = this._canvas;
	var size = this.size();

	var d;
	// var d = new DO();
	// 	d.graphics().clear();
	// 	d.graphics().setFill(0x9900FF00);
	// 	d.graphics().setLine(2.0, 0xCCCC0000);
	// 	d.graphics().beginPath();
	// 	d.graphics().drawRect(0,0, size.x,size.y);
	// 	//d.graphics().drawPolygon(poly,true);
	// 	//d.graphics().drawCircle(location.x,location.y,2.0);
	// 	d.graphics().endPath();
	// 	d.graphics().fill();
	// 	d.graphics().strokeLine();
	// this._root.addChild(d);

	var percentHeader = 0.15;
	var percentFooter = 0.15;
	var percentRotate = 0.1;
	var percentMove = 1.0 - percentHeader - percentRotate - percentFooter;

	var moveYStart = percentHeader;
	var moveYEnd = moveYStart+percentMove;
	var rotYStart = moveYEnd;
	var rotYEnd = rotYStart+percentRotate;

	// TODO:

	d = this._areaInterfaceMove;
d.newGraphicsIntersection();
var g = d.graphicsIntersection();
	g.clear();
	g.beginPath();
	g.drawPolygon([
		new V2D(0,size.y*moveYStart),
		new V2D(size.x,size.y*moveYStart),
		new V2D(size.x,size.y*moveYEnd),
		new V2D(0,size.y*moveYEnd)
		]);
	g.endPath();
	g.setFill(0x77FF0000);
	g.fill();

	d = this._areaInterfaceRotate;
d.newGraphicsIntersection();
var g = d.graphicsIntersection();
	g.clear();
	g.beginPath();
	g.drawPolygon([
		new V2D(0,size.y*rotYStart),
		new V2D(size.x,size.y*rotYStart),
		new V2D(size.x,size.y*rotYEnd),
		new V2D(0,size.y*rotYEnd)
		]);
	g.endPath();
	g.setFill(0x7700FF00);
	g.fill();


	var containerSize = this.size();
	var containerClipPoly = [new V2D(0,0),new V2D(size.x,0),new V2D(size.x,size.y),new V2D(0,size.y)];
	//
	d = this._root;
//	this._root.mask(true);

	d.graphics().clear();
	// d.graphics().setFill(0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().drawPolygon(containerClipPoly);
	d.graphics().endPath();
//	d.graphics().fill();

	var d = this._displayBackground;
	d.drawTilePattern(0,0, size.x,size.y);
/*
		d.graphics().clear();
		d.graphics().setFill(0xFF666666);
		d.graphics().setLine(2.0, 0xCCCC0000);
		d.graphics().beginPath();
		d.graphics().drawRect(0,0, containerSize.x,containerSize.y);
		//d.graphics().drawPolygon(poly,true);
		//d.graphics().drawCircle(location.x,location.y,2.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
*/
	var img = this._testImageSource;
	if(img){
		var sourceWidth = img.width;
		var sourceHeight = img.height;

		var zoom = this._explorer.scale();
		var d = this._displayPixels;
			d.removeAllChildren();

		var bounds = this._explorer.bounds();
		var axes = this._explorer.axes();
		var axesX = axes["x"];
		var axesY = axes["y"];
		var axesO = axes["o"];
//console.log("bounds: "+bounds)
			// image
			//var polyA = [new V2D(o.x,o.y),new V2D(o.x+sourceWidth,0.0),new V2D(o.x+sourceWidth,o.y+sourceHeight),new V2D(0.0,o.y+sourceHeight)];
			//var polyA = [new V2D(o.x,o.y),new V2D(o.x+s.x,o.y),new V2D(o.x+s.x,o.y+s.y),new V2D(o.x,o.y+s.y)];
			var polyA = bounds;
			// container
			var polyB = containerClipPoly;//[new V2D(0,0),new V2D(size.x,0),new V2D(size.x,size.y),new V2D(0,size.y)];
			var inside = true;
			for(var i=0; i<polyA.length; ++i){
				var p = polyA[i];
				var isIn = Code.isPointInsidePolygon2D(p, polyB);
				if(!isIn){
					inside = false;
					break;
				}
			}
			//console.log("all points inside: "+inside);
			// result
			var polyC = Code.polygonIntersection2D(polyB,polyA);
			if(polyC.length>0){
				polyC = polyC[0];
			}
			// for each intersection point
			var minCoordinate = null;
			var maxCoordinate = null;
			for(var i=0; i<polyC.length; ++i){
				var scnP = polyC[i];
				var imgP = this._explorer.toLocalPoint(scnP);
				if(!minCoordinate){
					minCoordinate = imgP.copy();
					maxCoordinate = imgP.copy();
				}else{
					minCoordinate.min(imgP);
					maxCoordinate.max(imgP);
				}
			}
if(minCoordinate){
//var focusPoint = this._explorer.focusPoint();
			var minX = Math.floor(minCoordinate.x);
			var minY = Math.floor(minCoordinate.y);
			var maxX = Math.ceil(maxCoordinate.x);
			var maxY = Math.ceil(maxCoordinate.y);
			var countX = maxX-minX;
			var countY = maxY-minY;
			var count = countX * countY;
			//console.log(minCoordinate+" - "+maxCoordinate+" = "+count);
			var doSelfPixels = count<=5000 && zoom>=8;

			// do image
			var d;
			var angle = this._explorer.rotation();
			var scale = this._explorer.scale();
			var offset = this._explorer.offset();
			//var size = this._explorer.size();

			var sizeX = scale*countX;
			var sizeY = scale*countY;

// this._imageMaskSource

			// only draw image for zoomed out
			//d.graphics().alpha(0.1);
			if(!doSelfPixels){
				d = this._displayImage;
				d.matrix().identity();
				d.matrix().translate( (minX - sourceWidth*0.5)*scale, (minY - sourceHeight*0.5)*scale);
				// already scaled
				d.matrix().rotate(angle);
				d.matrix().translate(offset.x, offset.y);// center of box
				d.matrix().translate(containerSize.x*0.5, containerSize.y*0.5);
				d = this._displayImage;
				d.image(img);
				d.drawClippedImage(minX,minY,countX,countY, 0,0,sizeX,sizeY);
				d.graphics().alpha(this._displayImageAlpha);

				// MASK
				var e;
				e = this._displayMaskImage;
				if(this._imageMaskSource){
					e.image(this._imageMaskSource);
					e.drawClippedImage(minX,minY,countX,countY, 0,0,sizeX,sizeY);
					e.matrix().copy( d.matrix() );
				}
			}else{
				d = this._displayImage;
				d.matrix().identity();
				d.graphics().clear();
				d = this._displayMaskImage;
				d.matrix().identity();
				d.graphics().clear();
			}
//			d.graphics().alpha(0.1);

			// PIXELS
			d = this._displayPixels;

			d.graphics().clear();

			var dirX = axesX.copy().norm();
			var dirY = axesY.copy().norm();
			var TL = axesO.copy();
			TL.add( axesX.copy().scale(minX/sourceWidth) );
			TL.add( axesY.copy().scale(minY/sourceHeight) );
			var vectorI = dirX.copy().scale(countX*scale);
			var vectorJ = dirY.copy().scale(countY*scale);

			// do pixel colors
			if(this._testImageMatrix && doSelfPixels){ // 9604, 2500
				var imageMatrix = this._testImageMatrix;
				var maskMatrix = this._testImageMaskMatrix;
				d.graphics().setLine(0.0, 0x0);
				for(i=0; i<countX; ++i){
					var pI1 = (i/countX);
					var pI2 = ((i+1)/countX);
					for(j=0; j<countY; ++j){
						var pJ1 = (j/countY);
						var pJ2 = ((j+1)/countY);
						var a = new V2D(pI1*vectorI.x + pJ1*vectorJ.x, pI1*vectorI.y + pJ1*vectorJ.y).add(TL);
						var b = new V2D(pI2*vectorI.x + pJ1*vectorJ.x, pI2*vectorI.y + pJ1*vectorJ.y).add(TL);
						var c = new V2D(pI2*vectorI.x + pJ2*vectorJ.x, pI2*vectorI.y + pJ2*vectorJ.y).add(TL);
						var e = new V2D(pI1*vectorI.x + pJ2*vectorJ.x, pI1*vectorI.y + pJ2*vectorJ.y).add(TL);
						/*
						var isInA = Code.isPointInsidePolygon2D(a, polyB);
						var isInB = Code.isPointInsidePolygon2D(b, polyB);
						var isInC = Code.isPointInsidePolygon2D(c, polyB);
						var isInE = Code.isPointInsidePolygon2D(e, polyB);
						var isIn = isInA || isInB || isInC || isInE;
						if(!isIn){ // save some processing
							continue; // not correct if only an edge is inside -- expand the rect by a pixel length
						}
						*/
						var indI = i+minX;
						var indJ = j+minY;
						var color = imageMatrix.getHex(indI,indJ);
							color = Code.setAlpFloatARGB(color, this._displayImageAlpha);
						var col = new V2D();
						if(maskMatrix){
							maskMatrix.getPoint(col, indI,indJ);
						}
						if(col.x>0){
							col = this._maskColor;
						}else{
							col = 0x00000000;
						}
						var colors = [color,col];
						for(k=0; k<colors.length; ++k){
							var cc = colors[k];
							d.graphics().beginPath();
							d.graphics().setFill(cc);
							d.graphics().moveTo(a.x,a.y);
							d.graphics().lineTo(b.x,b.y);
							d.graphics().lineTo(c.x,c.y);
							d.graphics().lineTo(e.x,e.y);
							d.graphics().endPath();
							d.graphics().fill();
						}
						// var img = this._testImageMaskMatrix;
						var textHei = 12;
						if(zoom>=textHei*3){ // hex
							var text = Code.getHex(color&0x00FFFFFF, true).toUpperCase();
							//var inv = Code.inverseColorARGB(color); // TODO: GRAY
							var brightness = Code.brightnessFromARGB(color);
							var gray = (brightness + 0.5)%1.0;
							var col = Code.getColARGBFromFloat(1.0,gray,gray,gray);
							//var inv = Code.inverseColorARGB(color); // TODO: GRAY
							var t = new DOText(text,textHei,DOText.FONT_ARIAL,col,DOText.ALIGN_CENTER);
							t.matrix().identity();
							t.matrix().translate((a.x+c.x)*0.5 + 0, (a.y+c.y)*0.5 + textHei*0.5);
							d.addChild(t);
							// function DOText(textIN,sizeIN,fontIN,colIN,alignIN,parentDO)
						}
					}
				}
			}

		if(zoom>=4){
			var color;
			var minScale = 4;
			var maxScale = 32;
			var ranScale = (maxScale-minScale);
			var pct = (zoom-minScale)/ranScale;
			pct = Math.pow(pct,.5);//Math.log(1+pct)/Math.log(2);
			var alpha = Math.min(Math.max(pct,0),1);
			color = Code.getColARGBFromFloat(alpha,0,0,0);
			// if(zoom<=4){
			// 	color = 0x66000000;
			// }else if(color<16){
			// 	color = 0x99000000;
			// }else if(color<23){
			// 	color = 0xCC000000;
			// }else{
			// 	color = 0xFF000000;
			// }
			d.graphics().beginPath();
			d.graphics().setLine(1.0, color);
			for(i=0; i<=countX; ++i){
				var pI = (i/countX);
				var a = new V2D(pI*vectorI.x + 0.0*vectorJ.x, pI*vectorI.y + 0.0*vectorJ.y).add(TL);
				var b = new V2D(pI*vectorI.x + 1.0*vectorJ.x, pI*vectorI.y + 1.0*vectorJ.y).add(TL);
				d.graphics().moveTo(a.x,a.y);
				d.graphics().lineTo(b.x,b.y);
			}

			for(j=0; j<=countY; ++j){
				var pJ = (j/countY);
				var a = new V2D(0.0*vectorI.x + pJ*vectorJ.x, 0.0*vectorI.y + pJ*vectorJ.y).add(TL);
				var b = new V2D(1.0*vectorI.x + pJ*vectorJ.x, 1.0*vectorI.y + pJ*vectorJ.y).add(TL);
				d.graphics().moveTo(a.x,a.y);
				d.graphics().lineTo(b.x,b.y);
			}
			d.graphics().endPath();
			d.graphics().strokeLine();
		}
	}

	if(this._featuresSource){
		var scaling = this._explorer.scale();
		var line = 1.0;
		if(scaling>=2.0){
			line = Math.round(Math.sqrt(scaling));
		}
		var d = this._displayFeatures;
		d.graphics().clear();
			d.graphics().setLine(line,0xCCFF00FF);
			d.graphics().setFill(0x22FF00FF);
		d.matrix().identity();
		d.matrix().translate(0,0);

		// TODO: GET FEATURES ONLY INSIDE LOCAL WINDOW:
			// origin +
		var features = this._featuresSource;
		var f = new V2D();
		for(i=0; i<features.length; ++i){
			var feature = features[i];
			var point = feature["point"];
			var size = feature["size"];
size = size * 0.25;
			var angle = feature["angle"];
			f.set(point.x+0.5, point.y+0.5);
				var siz = size * scaling;
				var p = this._explorer.toScreenPoint(f);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, siz);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				d.graphics().moveTo(p.x,p.y);
				d.graphics().lineTo(p.x+siz*Math.cos(angle), p.y+siz*Math.sin(angle));
				d.graphics().strokeLine();
			// x,y position
			// z size
			// t score [color ?]
		}
	}
}
}
App3DR.App.ImageEditor.prototype._colorMaskImage = function(location, fill, diameter){
	console.log("_colorMaskImage");
	diameter = diameter!==undefined ? diameter : 1.0;
	if(!this._testImageMaskMatrix){
		return;
	}
	var img = this._testImageMaskMatrix;
	var locationX = Math.floor(location.x);
	var locationY = Math.floor(location.y);

	var changed = false;
	// TODO: skip if rect is outside
	var i, j;
	var radius = diameter*0.5;
	var radiusFloor = Math.floor(radius);
	var radiusSquare = radius * radius;
	var startI = locationX - radiusFloor;
	var endI = locationX + radiusFloor;
	var startJ = locationY - radiusFloor;
	var endJ = locationY + radiusFloor;
	for(i=startI; i<=endI; ++i){
		for(j=startJ; j<=endJ; ++j){
			var inside = Math.pow(locationX-i,2) + Math.pow(locationY-j,2) <= radiusSquare;
			if( inside && 0<=i && i<img.width() && 0<=j && j<img.height() ){
				var val = new V3D(0,0,0);
				if(fill){
					val = new V3D(1,1,1);
				}
				img.setPoint(i,j, val);
				changed = true;
			}
		}
	}
	if(changed){
		this.updateMaskImageFromMatrix(); // TODO: only when necessary at zoom-display level
	}
	return changed;
}
App3DR.App.ImageEditor.prototype._zoomIn = function(){
	this._explorer.updateScale( this._explorer.scale()*2.0 );
	this._render();
}
App3DR.App.ImageEditor.prototype._zoomOut = function(){
	this._explorer.updateScale( this._explorer.scale()*0.5 );
	this._render();
}
App3DR.App.ImageEditor.prototype._rotate = function(angle){
	this._explorer.updateRotation( this._explorer.rotation() + angle );
	this._render();
}
App3DR.App.ImageEditor.prototype._move = function(dir){
	this._explorer.updateOffset( this._explorer.offset().copy().add(dir) );
	this._render();
}
App3DR.App.ImageEditor.prototype.handleKeyDown = function(e){
	App3DR.App.ImageEditor._.handleKeyDown.call(this, e);
	var moveSize = 10;
	if(e.keyCode == Keyboard.KEY_LET_Q){
		this._zoomIn();
	}else if(e.keyCode == Keyboard.KEY_LET_W){
		this._zoomOut();
	}else if(e.keyCode == Keyboard.KEY_LET_A){
		this._rotate( Code.radians(10.0) );
	}else if(e.keyCode == Keyboard.KEY_LET_S){
		this._rotate( -Code.radians(10.0) );
	}else if(e.keyCode == Keyboard.KEY_LEFT){
		this._move( new V2D(-moveSize,0) );
	}else if(e.keyCode == Keyboard.KEY_RIGHT){
		this._move( new V2D(moveSize,0) );
	}else if(e.keyCode == Keyboard.KEY_UP){
		this._move( new V2D(0,-moveSize) );
	}else if(e.keyCode == Keyboard.KEY_DOWN){
		this._move( new V2D(0,moveSize) );

// edit mode

	}else if(e.keyCode == Keyboard.KEY_LET_Z){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_ERASE;
	}else if(e.keyCode == Keyboard.KEY_LET_X){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_DRAW;
	}else if(e.keyCode == Keyboard.KEY_LET_C){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	}else if(e.keyCode == Keyboard.KEY_LET_P){
		var alpha = this._displayBackground.graphics().alpha();
		if(alpha<0.5){
			this._displayBackground.graphics().alpha(1.0);
		}else{
			this._displayBackground.graphics().alpha(0.1);
		}
	}
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseUp = function(e){
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	if(move){
		var data = e["data"];
		var location = data["location"];
		this._explorer.mouseUp(location);
		this.moveAreaCancel();
		this._render();
	}
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseDown = function(e){
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	var data = e["data"];
	var location = data["location"];
	//var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	var add = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_DRAW;
	var remove = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_ERASE;
	var edit = add || remove;
	if(move){

		this._explorer.mouseDown(location);
		this._render();
		this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
	}else if(edit){
		var target = this._areaInterfaceMove;//e["target"];
		var sourcePoint = location.copy();
		var sourceElement = target;
		var destinationElement = this._stage.root(); //this._root;//this._stage.root(); // this._root; // this._areaInterfaceRotate;
		var destinationPoint = new V2D();
		var local = DO.pointLocalUp(destinationPoint,sourcePoint,sourceElement,destinationElement);
		var imageLocation = this._explorer.toLocalPoint(local);
	//var diameter = 3;
	//var diameter = 4;
	//var diameter = 5;
	//var diameter = 6;
	var diameter = 7; // TODO: MULT BY SCALE & round
		var colored = this._colorMaskImage(imageLocation, add?true:false, diameter);
		if(colored){
			this._render();
		}
	}
}
App3DR.App.ImageEditor.prototype.moveAreaCancel = function(){
	this._areaInterfaceMove.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseMove = function(e){
	Code.eventPreventDefault(e);
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	if(move){
		var data = e["data"];
		var location = data["location"];
		var target = e["target"];
		if(target==this._areaInterfaceMove){
			this._explorer.mouseMove(location);
		}else{ // move out = donw
			this._explorer.mouseUp(location);
			this.moveAreaCancel();
		}
		this._render();
	}
}


App3DR.App.ImageEditor.prototype._toRotationAngle = function(location){
	var destinationPoint = new V2D();
	var sourcePoint = location.copy();
	//var sourceElement = target;
	var sourceElement = this._areaInterfaceRotate;
	var destinationElement = null; // this._root; // this._areaInterfaceRotate;
	DO.pointLocalUp(destinationPoint,sourcePoint,sourceElement,destinationElement);
	var point = destinationPoint;

	var size = this._explorer.containerSize();
	var center = size.copy().scale(0.5);
	var oToP = V2D.sub(point,center);
	var angle = V2D.angleDirection(V2D.DIRX,oToP);
	return angle;
}
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseDown = function(e){
	var rotate = true;
	console.log("rotateAreaHandleMouseDown");
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		var angleA = this._explorer.rotation();
		this._rotationAngle = angle;
		this._rotationAngleStart = angleA;
		this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_MOVE, this.rotateAreaHandleMouseMove, this, true);
		this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_UP, this.rotateAreaHandleMouseUp, this, true);
	}
}
// App3DR.App.ImageEditor.prototype.moveAreaCancel = function(){
// 	this._areaInterfaceMove.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
// }
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseMove = function(e){
	Code.eventPreventDefault(e);
	var rotate = this._rotationAngleStart!=null;
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		this._updateRotationAngle(angle);
	}
}
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseUp = function(e){
	var rotate = this._rotationAngleStart!=null;
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		this._updateRotationAngle(angle);
		this._rotationAngleStart = null;
		this._areaInterfaceRotate.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.rotateAreaHandleMouseMove, this, true);
		this._areaInterfaceRotate.removeFunction(Canvas.EVENT_MOUSE_UP, this.rotateAreaHandleMouseUp, this, true);

	}
}
App3DR.App.ImageEditor.prototype._updateRotationAngle = function(angle){
	var angleA = this._rotationAngle;
	var angleB = angle;
	//var diff = Code.minAngle(angleA,angleB);
	var diff = angleB-angleA;
	var fin = this._rotationAngleStart + diff;
	var rounding = Code.radians(15.0);
	var rounded = Math.round(fin/rounding)*rounding;
	fin = rounded;
	this._explorer.updateRotation(fin);
	this._render();
}



App3DR.App.ImageEditor.EDIT_MODE_UNKNOWN = 0;
App3DR.App.ImageEditor.EDIT_MODE_MOVE = 1;
App3DR.App.ImageEditor.EDIT_MODE_ERASE = 2;
App3DR.App.ImageEditor.EDIT_MODE_DRAW = 3;
App3DR.App.ImageEditor.prototype.handleMouseUp = function(e){
	App3DR.App.ImageEditor._.handleMouseUp.call(this, e);
}
App3DR.App.ImageEditor.prototype.handleMouseMove = function(e){
	App3DR.App.ImageEditor._.handleMouseMove.call(this, e);
}
App3DR.App.ImageEditor.prototype.handleMouseDown = function(e){
	App3DR.App.ImageEditor._.handleMouseDown.call(this, e);
}





// ------------------------------------------------------------------


App3DR.App.Model3D = function(resource, manager){
	App3DR.App.Model3D._.constructor.call(this, resource);
	console.log("Model3D");
console.log("TODO: UNDO");
//return; // TODO: REMOVE
	this._displayData = null;
	this._display = new DO();
	this._root.addChild(this._display);

	//this._camera = new App3DR.App.Model3D.Camera();
	this._camera = new Cam3D();
	console.log(this._camera);


	// interaction
	this._sphereMatrix = new Matrix3D();
	this._sphereMatrix.identity();

	this._userInteractionMatrix = new Matrix3D();
	this._userInteractionMatrix.identity();

	// this._siDirection = new V3D(1,0,0);
	// this._upDirection = new V3D(0,1,0);
	// this._inDirection = new V3D(0,0,1);

	//this._camera = new App3DR.App.Model3D.Camera();


	var frameRate = 1000.0/20.0;
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
    this._stage3D = new StageGL(this._canvas3D, frameRate, this.getVertexShaders(), this.getFragmentShaders());
    this._canvas3D.addListeners();
  	// this._stage3D.setBackgroundColor(0xFF000000);
	this._stage3D.setBackgroundColor(0xFFFFFFFF);
  	this._stage3D.frustrumAngle(35);
	this._stage3D.enableDepthTest();
	this._stage3D.setViewport(0,0,this._canvas3D.width(),this._canvas3D.height());
	this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this._eff, this);
	this._stage3D.start();


	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_EXIT, this.onMouseExitFxn3D, this);

	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.onKeyboardDown,this);
	this._keyboard.addListeners();


	this._time = 0;
}
Code.inheritClass(App3DR.App.Model3D, App3DR.App);


App3DR.App.Model3D.prototype._loadedViewTexture = function(input){
	var i;
	++this._loadedTextures;
	// console.log("_loadedViewTexture: "+this._loadedTextures+"=="+this._expectedTextures);
	// console.log(this._loadedTextures==this._expectedTexture);

	if(this._loadedTextures!=this._expectedTextures){
		return;
	}
	this._bindAfterTexturesLoaded();
}
App3DR.App.Model3D.prototype._bindAfterTexturesLoaded = function(){
	console.log("_bindAfterTexturesLoaded");
	this._textures = [];
	var nextIndex = 0;

	this._renderTextureUVList = [];
	this._renderTexturePointList = [];
	this._textureUVPoints = [];
	this._textureVertexPoints = [];

	var lines = [];

	var views = this._views;
	for(i=0; i<views.length; ++i){
console.log("              "+i+"....................................................................");
		var view = views[i];
		var transform = view["transform"];
		var tx = transform.get(0,3);
		var ty = transform.get(1,3);
		var tz = transform.get(2,3);
		var o = new V3D(0,0,0);
		var x = new V3D(1,0,0);
		var y = new V3D(0,1,0);
		var z = new V3D(0,0,1);
		// var z = new V3D(0,0,-1);
		o = transform.multV3DtoV3D(o);
		x = transform.multV3DtoV3D(x);
		y = transform.multV3DtoV3D(y);
		z = transform.multV3DtoV3D(z);
		var dirX = V3D.sub(x,o);
		var dirY = V3D.sub(y,o);
		var dirZ = V3D.sub(z,o);
		lines.push(o,x);
		lines.push(o,y);
		lines.push(o,z);
//		console.log("VIEW ORIGIN : "+o);


		var K = view["K"];
console.log(K);
// console.log(K);
// 		if(!K || K.cols()==0){
// 			K = new Matrix(3,3).fromArray([1,0,0, 0,1,0, 0,0,1]);
// 		}
// console.log(K);
		var image = view["image"];
		var obj = this._viewImages[i];
console.log(obj)
//console.log(image.width,image.height)
//Code.addChild(Code.getBody(), image);
		if(obj){
			var texture = obj["texture"];


if(texture){ // if is an image source => to image byte array

}
// texture = GLOBALSTAGE.getImageAsFloatRGBA(texture);
// texture = GLOBALSTAGE.getImageAsIntRGBA(texture);
			var original = obj["original"];
//console.log(texture);
console.log(texture.complete+" ? ");
console.log(texture.width,texture.height);
			var horz = obj["width"];
			var vert = obj["height"];
			var bind = this._canvas3D.bindTextureImageRGBA(texture);
console.log("RICHIE - bind")
console.log(bind)
			obj["bind"] = bind;
			this._textures.push(bind);

// TODO: PROJECT TL/TR/BR/BL TO RAY & INTERSECT WITH PLANE+NORM*delta
// console.log(K);
// throw ".."
			var wid = image.width;
			var hei = image.height;

			var fx = K.get(0,0);
			var fy = K.get(1,1);
			var cx = K.get(0,2);
			var cy = K.get(1,2);
			var s = K.get(0,1);
			var camWid = 1.0;
// camWid = 0.20;


// model camera size
camWid = 0.10;
// camWid = 0.01;

			var camHei = camWid*(hei/wid);
			var fyOfx = fy/fx;
//console.log("CAM WID: "+camWid+" x "+camHei);
//console.log("fyOfx: "+fyOfx);
//s = 0.25;
			var CX = camWid * cx;
			var CY = camHei * cy;
			var SX = camHei * cy * s; // top left offset
			var FX = camHei * s; // full offset

//console.log(dirX.length(),dirY.length(),dirZ.length());


			var off = dirZ.copy().scale(camWid * fx);
			var pBL = o.copy().add( dirX.copy().scale(-CX) ) .add( dirY.copy().scale(CY) )  .add( dirX.copy().scale(SX) );
			pBL.add( off );
			var pBR = pBL.copy().add( dirX.copy().scale(camWid) );
			var pTR = pBL.copy().add( dirX.copy().scale(camWid) ).add( dirY.copy().scale(-camHei) ) .add( dirX.copy().scale(FX) );
			var pTL = pBL.copy().add( dirY.copy().scale(-camHei) ) .add( dirX.copy().scale(FX) );

			var uvList = [0,vert, horz,vert, horz,1,  horz,1, 0,1, 0,vert];
			var vertList = [pBL.x,pBL.y,pBL.z, pBR.x,pBR.y,pBR.z, pTR.x,pTR.y,pTR.z,   pTR.x,pTR.y,pTR.z, pTL.x,pTL.y,pTL.z, pBL.x,pBL.y,pBL.z];

			console.log("SRZ: "+horz+" x "+vert);
		// if(i==0){
		// if(i==1){
		if(false){ // none
		//if(true){ // overlapping
			console.log("CREATE TEXTURES HERE");
			var triangleInfo = this._triangulateSurface(i);
			//console.log(triangleInfo);
			var triangles = triangleInfo["triangles"];
			for(var t=0; t<triangles.length; ++t){
				var tri = triangles[t];
				var p2Ds = tri["2D"];
				var p3Ds = tri["3D"];
				for(var k=0; k<3; ++k){
					var x = p2Ds[k].x;
					var y = p2Ds[k].y;
					x = x / original.width;
					y = y / original.height;
					x = x * horz;

					// y flipped
					// y = y * (1.0 - vert);
					// y = 1 - y;

					// single line
					y = 1 + y*vert - y;

					uvList.push(x,y);
					vertList.push(p3Ds[k].x,p3Ds[k].y,p3Ds[k].z);
				}
			}
			console.log(uvList);
			console.log(vertList);
		}

			this._renderTextureUVList[nextIndex] = uvList;
			this._renderTexturePointList[nextIndex] = vertList;
			++nextIndex;

			// // add lines:
			// var points = this._points3D;
			// if(points){
			// 	for(var j=0; j<points.length; ++j){
			// 		var v = points[j];
			// 		lines.push(o,v);
			// 	}
			// }
		}
	}

	// set textures:
	//console.log(this._textures)

	this._stage3D.selectProgram(1);
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");

	var len = this._textures.length;
	for(i=0; i<len; ++i){
		var texturePoints = this._renderTextureUVList[i];
		var vertexPoints = this._renderTexturePointList[i];
		this._textureUVPoints[i] = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._textureVertexPoints[i] = this._stage3D.getBufferFloat32Array(vertexPoints, 3);
	}

console.log("GOT STUFF ?");
	// set lines
	// this.setLines(lines);

	// reset points with colors now avail:
	this.setPoints(this._points3D, this._points2D, this._originalPoints, this._normals3D);

}

App3DR.App.Model3D.prototype.setViews = function(input){
	console.log("setViews");
	var i;
	this._viewImages = [];
	this._expectedTextures = input.length;
	this._loadedTextures = 0;

	this._views = input;
	for(i=0; i<input.length; ++i){
		var view = input[i];
		console.log(view);
		var image = view["image"];
		var imageMatrix = R3D.imageMatrixFromImage(image, this._stage);
		view["matrix"] = imageMatrix;
		var obj = null;
		if(image){
			var self = this;
			var obj = this._stage.textureBase2FromImage(image, function(e){
				self._loadedViewTexture();
			});
			obj["original"] = image;
		}else{
			++this._loadedTextures;
		}
		this._viewImages[i] = obj;
	}

}
App3DR.App.Model3D.prototype.setTextures = function(images, triangles, vertexes){
	// this only currently works because of delatyed loading of large model images
	// console.log(triangles);
	// console.log(vertexes);
	var currentLength = this._textures.length;
	console.log("current texture length: "+currentLength);
	// image texture binding
	var bindedTextures = [];
	var textureCount = images.length;
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var bind = this._canvas3D.bindTextureImageRGBA(image);
		bindedTextures.push(bind);
	}
	// vertex (3D) & uv (2D) binding
	var texturePointList = Code.newArrayArrays(textureCount);
	var vertexPointList = Code.newArrayArrays(textureCount);
var triangleCount = triangles.length;
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var t = tri["t"];
		var tex = images[t];
		var texturePoints = texturePointList[t];
		var vertexPoints = vertexPointList[t];
		var A = tri["A"];
		var B = tri["B"];
		var C = tri["C"];
		A = A["i"];
		B = B["i"];
		C = C["i"];
		A = vertexes[A];
		B = vertexes[B];
		C = vertexes[C];
		vertexPoints.push(A["X"],A["Y"],A["Z"]);
		vertexPoints.push(B["X"],B["Y"],B["Z"]);
		vertexPoints.push(C["X"],C["Y"],C["Z"]);
		// UV
		var a = tri["a"];
		var b = tri["b"];
		var c = tri["c"];
		var ax = a["x"]/tex.width;
		var ay = a["y"]/tex.height;
		var bx = b["x"]/tex.width;
		var by = b["y"]/tex.height;
		var cx = c["x"]/tex.width;
		var cy = c["y"]/tex.height;
		ay = 1.0 - ay;
		by = 1.0 - by;
		cy = 1.0 - cy;
		texturePoints.push(ax,ay,bx,by,cx,cy);
	}
	this._stage3D.selectProgram(1);
	// this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	// this._triangletextureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");
	var len = images.length;
	for(i=0; i<len; ++i){
		var j = i + currentLength;
		// push:
		this._textures[j] = bindedTextures[i];
		this._renderTextureUVList[j] = texturePointList[i];
		this._renderTexturePointList[j] = vertexPointList[i];
		// set
		var texturePoints = this._renderTextureUVList[j];
		var vertexPoints = this._renderTexturePointList[j];
		console.log(texturePoints.length,vertexPoints.length);
		this._textureUVPoints[j] = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._textureVertexPoints[j] = this._stage3D.getBufferFloat32Array(vertexPoints, 3);
	}
	console.log("added triangle model: "+triangleCount);

	console.log(this._stage3D);
	var gl = this._stage3D.canvas().context();
	console.log(gl);
	var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	console.log(maxTextures);


// ..



}
App3DR.App.Model3D.prototype.setLines = function(input){
	// CREATE LINES:

	console.log("setLines ........................")
	var points = [];
	var colors = [];
	for(var i=0; i<input.length; ++i){
// break;
		var v = input[i];
		points.push(v.x,v.y,v.z);
// NEGATIVE Z:
// points.push(v.x,v.y,-v.z);

// colors.push(0.0,0.0,1.0,0.25); // blue

colors.push(0.50,0.0,0.50,0.50); //magenta


		// colors.push(1.0,1.0,1.0,0.05);
		// colors.push(0.1,0.1,0.1,0.02);
		// colors.push(0.1,0.1,0.1,0.005);
	}

	console.log(input);
	console.log(colors);
	console.log("points:");
	console.log(points);
	// create objects
	this._stage3D.selectProgram(2);
	this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._programLinePoints = this._stage3D.getBufferFloat32Array(points, 3);
	this._programLineColors = this._stage3D.getBufferFloat32Array(colors, 4);
}
App3DR.App.Model3D.prototype.setPoints = function(input3D, input2D, hasImages, normals3D){
	var viewTable = {};
	if(this._views) {
		for(var i=0; i<this._views.length; ++i){
			var view = this._views[i];
			var index = view["id"];
			viewTable[index] = view; // id lookup
			viewTable[i] = view; // index lookup
		}
	}
	// CREATE POINTS:
	this._points3D = input3D;
	this._points2D = input2D;
	this._normals3D = normals3D;
	console.log("setPoints ---");
	console.log(input3D);
	console.log(input2D);

	var colors = [];
// ONLY WORKS FOR PAIR OF IMAGES
var useErrors = false;
// var useErrors = true;
// var errorType = 0; // F
var errorType = 1; // R
// var errorType = 2; // NCC
// var errorType = 3; // DEPTH
// var errorType = 0;
	useErrors = useErrors && hasImages;
	if(useErrors){
		var views = this._views;
		var viewA = views[0];
		var viewB = views[1];
		// ...
		var pointsA = input2D[0];
		var pointsB = input2D[1];
		var points3D = input3D;
		
		// var fError = R3D.fErrorList(F, Finv, pointsA, pointsB);
		var extrinsicA = viewA["transform"];
		var extrinsicB = viewB["transform"];
		// var extrinsicA = R3D.extrinsicMatrixFromCameraMatrix(cameraA);
		// var extrinsicB = R3D.extrinsicMatrixFromCameraMatrix(cameraB);

		var imageA = viewA["matrix"];
		var imageB = viewB["matrix"];
		var imageSizeA = imageA.size().copy();
		var imageSizeB = imageB.size().copy();
		var featureSizeA = imageSizeA.length()*0.01; // 1% of image
		var featureSizeB = imageSizeB.length()*0.01; // 1% of image

// imageSizeA = new V2D(2016,1512);
// imageSizeB = new V2D(2016,1512);

		var imageScalesA = new ImageMatScaled(imageA);
		var imageScalesB = new ImageMatScaled(imageB);
		var compareSize = 7; // 11
		// var needleSize = featureSizeA; // feature/scale size
		// var haystackRelativeSize = needleSize;
		var matrix2D = new Matrix2D();
			matrix2D.identity();




var psA = [];
var psB = [];
for(var i=0; i<pointsA.length; ++i){
	var pointA = pointsA[i];
	var pointB = pointsB[i];
		pointA = new V2D(pointA.x,pointA.y);
		pointB = new V2D(pointB.x,pointB.y);
		pointA = pointA.copy().scale(imageSizeA.x,imageSizeA.y);
		pointB = pointB.copy().scale(imageSizeB.x,imageSizeB.y);
	psA[i] = pointA;
	psB[i] = pointB;
}

var F = R3D.fundamentalFromLargeDataset(psA,psB,1000);
var Finv = R3D.fundamentalInverse(F);


		var cameraCenterA = extrinsicA.multV3DtoV3D(new V3D(0,0,0));
		var cameraCenterB = extrinsicB.multV3DtoV3D(new V3D(0,0,0));
		var cameraNormalA = extrinsicA.multV3DtoV3D(new V3D(0,0,1));
			cameraNormalA.sub(cameraCenterA);
		var cameraNormalB = extrinsicB.multV3DtoV3D(new V3D(0,0,1));
			cameraNormalB.sub(cameraCenterB);
		var cameraRightA = extrinsicA.multV3DtoV3D(new V3D(1,0,0));
			cameraRightA.sub(cameraCenterA);
		var cameraRightB = extrinsicB.multV3DtoV3D(new V3D(1,0,0));
			cameraRightB.sub(cameraCenterB);

		var cameraUpA = extrinsicA.multV3DtoV3D(new V3D(0,1,0));
			cameraUpA.sub(cameraCenterA);
		var cameraUpB = extrinsicB.multV3DtoV3D(new V3D(0,1,0));
			cameraUpB.sub(cameraCenterB);

		var points2D = [pointsA, pointsB];
		var cameraCentersList = [cameraCenterA,cameraCenterB];
		var cameraNormalsList = [cameraNormalA,cameraNormalB];
		var cameraRightsList = [cameraRightA,cameraRightB];
		var cameraSizesList = [featureSizeA,featureSizeB];


		var absoluteA = Matrix.inverse(extrinsicA);
		var absoluteB = Matrix.inverse(extrinsicB);

		var Ka = viewA["K"];
		var Kb = viewB["K"];

			Ka = R3D.cameraFromScaledImageSize(Ka, imageSizeA);
			Kb = R3D.cameraFromScaledImageSize(Kb, imageSizeB);

			var KaInv = Matrix.inverse(Ka);
			var KbInv = Matrix.inverse(Kb);

		var affineReuse = new Matrix2D();
		var errors = [];
		for(var i=0; i<pointsA.length; ++i){
			var pointA = psA[i];
			var pointB = psB[i];
			var point3D = points3D[i];

			
			if(errorType==0){
				var error = R3D.fError(F, Finv, pointA, pointB);
					error = error["error"];
// console.log("ERROR IN PIXELS: "+error+" / "+imageSizeA.x+" = "+(error/imageSizeA.x))
// throw "?"
				// error = error/point3D.z;
				errors.push(error);
				// errors.push(error["error"]);
			}else if(errorType==1){
				// var error = R3D.reprojectionError(point3D, pointA,pointB, extrinsicA, extrinsicB, Ka, Kb);
				var error = R3D.reprojectionError(point3D, pointA,pointB, absoluteA, absoluteB, Ka, Kb); // these are wrong from somewhere
					error = error["error"];
// console.log("ERROR IN PIXELS: "+error+" / "+imageSizeA.x+" = "+(error/imageSizeA.x))
// console.log(point3D);
// error = error/point3D.z;
// console.log(error);
// throw "here";
				errors.push(error);
			}else if(errorType==2){


				// var ncc = new ImageMatScaled(this._image);
				// matrix2D ... i have a patch ...

				
				// console.log(pointA);
				// console.log(pointB);
				// console.log(point3D);
				// console.log(cameraA);
				// console.log(cameraB);
				// console.log(Ka);
				// console.log(Kb);


// console.log(points2D);
// console.log(cameraCentersList);
// console.log(cameraNormalsList);
// console.log(cameraRightsList);
// console.log(cameraSizesList);

				// var patch3D = R3D.patch3DFromPoint3DCameras(point3D, cameraCentersList, cameraNormalsList, cameraRightsList, cameraSizesList, points2D);
				// var normal3D = patch3D["normal"];
				// var up3D = patch3D["up"];
				// var right3D = patch3D["right"];
				// var size3D = patch3D["size"];
				// matrix2D = R3D.patchAffine2DFromPatch3D(point3D,normal3D,up3D,right3D,size3D, cameraA,Ka, cameraB,Kb, pointA,pointB, matrix2D);
				// console.log(": "+matrix2D);


				var points2D = [pointA,pointB];
				var extrinsics = [extrinsicA,extrinsicB];
				var absolutes = [absoluteA,absoluteB];
				var Ks = [Ka,Kb];
				var Kinvs = [KaInv,KbInv];
				var centers = [cameraCenterA,cameraCenterB];
				var normals = [cameraNormalA,cameraNormalB];
				var rights = [cameraRightA,cameraRightB];
				var ups = [cameraUpA,cameraUpB];
				var sizes = [1,1];
				var reuse = affineReuse;

				var result = R3D.patch3DFromInfo(points2D,   extrinsics,absolutes,Ks,Kinvs, centers,normals,rights,ups,  sizes,  reuse);
				var matrix2D = result["affine"];


// console.log(pointA,pointB, imageScalesA,imageScalesB, compareSize, needleSize,haystackRelativeSize, matrix2D)
																 // pointA,pointB, imageScalesA,imageScalesB, featureSize,needleSize,haystackSize, affine, reuseNeedle, reuseHaystack){
				var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScalesA,imageScalesB, featureSizeA, compareSize,compareSize, matrix2D);
// console.log(result);
				// var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScaleA,imageScaleB, featureSize, needleSize,haystackSize, affineAB);
				// var result = R3D.optimumNeedleHaystackAtLocation(imageScalesA,pointA, imageScalesB,pointB, needleSize,haystackRelativeSize, matrix2D, compareSize);
				var error = result["score"];

				// error = Math.pow(error,0.5);

				errors.push(error);

// throw "?"




				// throw "calc ncc error";

				if(i%100 == 0){
					console.log(i+"/"+pointsA.length);
				}
			}else if(errorType==3){
					error = point3D.z;
					errors.push(error);
			}else{
				throw "unknown error type "+errorType;
			}
		}
		// Code.printMatlabArray(errors,"errors");
		// console.log(errors);
		ImageMat.normalFloat01(errors);
		// exaggerate
		// ImageMat.pow(errors, 2); // fewer red
		ImageMat.pow(errors, 0.5); // more red
		var colorList = [0xFF0000FF, 0xFFFF0000];
		var locationList = [0.0,1.0];
		for(var i=0; i<errors.length; ++i){
			var err = errors[i];
			var col = Code.interpolateColorGradientARGB(err, colorList,locationList);
				col = Code.getFloatARGB(col);
			colors.push(col[1],col[2],col[3],col[0]);
			// colors.push(0,0,0,1); // black points
		}
	}
	console.log("COLORED");


var showNormals = true;
// var showNormals = false;
var lines = [];
if(showNormals && normals3D){
	console.log(normals3D);
	console.log(input3D);
	// throw "showNormals"

	
	// var normalSize = 0.1; // scale by scene size
	// var normalSize = 0.01;
	var normalSize = 0.05;
	var s = normalSize;
	for(var i=0; i<normals3D.length; ++i){
		var p = input3D[i];
		var n = normals3D[i];
		lines.push(new V3D(p.x,p.y,p.z));
		lines.push(new V3D(p.x+s*n.x,p.y+s*n.y,p.z+s*n.z));
	}

	
}
this.setLines(lines);


	// TRIM SO ONLY POINTS IN 0 & 1 are displayed:

	var points = [];
	if(input3D){
	for(var i=0; i<input3D.length; ++i){
		var v = input3D[i];
		points.push(v.x,v.y,v.z);

	// NEGATIVE Z:
	if(useErrors){
	}else{
	//		points.push(v.x,v.y,-v.z);
			var imageSuccess = false;
			if(hasImages){
				// get color from images
				var vList = hasImages[i]["views"];
				if(!vList){
					vList = hasImages[i]["v"];
				}
				if(vList){
					var item = vList[0]; // just grab 1
					var vIndex = item["view"];
					if(vIndex==undefined){
						vIndex = item["i"];
					}
					var view = viewTable[vIndex];
					var image = view["matrix"];
					var pnt = new V2D(item["x"],item["y"]);
					var wid = image.width();
					var hei = image.height();
					pnt.scale(wid, hei);
					var x = Math.min(Math.max(Math.round(pnt.x),0),wid-1);
					var y = Math.min(Math.max(Math.round(pnt.y),0),hei-1);
					var index = y*wid + x;
					var red = image.red()[index];
					var grn = image.grn()[index];
					var blu = image.blu()[index];
					colors.push(red,grn,blu,1.0);
					// single color
					// colors.push(0.9,0.9,0.9,1.0);
					imageSuccess = true;
				}else{
					// console.log(hasImages);
					// console.log(hasImages[i]);
					// throw "?";
				}
			}
			if(!imageSuccess){
				colors.push(0.5,0.5,0.5,0.5);
			}
	}
		}
	}



// show as points file:
console.log("PTS FILE:");


if(false && this._points3D && this._normals3D){
		var pts3D = [];
		var nms3D = [];
		for(var i=0; i<this._points3D.length; ++i){
			var p = this._points3D[i];
			var n = this._normals3D[i];
			pts3D.push(p);
			nms3D.push(n);
		}
		console.log(pts3D);
		console.log(nms3D);
		var str = Code.pointsToPtsFileString(pts3D,nms3D);
		console.log(str);
}

	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");

	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);
}

App3DR.App.Model3D.prototype._triangulateSurface = function(surfaceUse){
	var views = this._views;
	if(views) {
		console.log("TRIANGULATE SURFACE");
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var index = view["id"];
			//viewTable[index] = view;
		}
		//
		// var surfaceUse = 0;
		var view = views[surfaceUse];
		var points2D = this._points2D[surfaceUse];
		var points3D = this._points3D;
		console.log(points2D);

		var images = this._viewImages;
		var image = images[surfaceUse];
		var original = image["original"];
		var texture = image["texture"];
		var bind = image["bind"];
		var width = original.width;
		var height = original.height;
		console.log("scale to: "+width+"x"+height);

		// create:
		var triangulator = new Triangulator();
		for(i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var point3D = point2D["3D"];
			var p = new V2D(point2D["x"],point2D["y"]);
			//p.scale(width);
			p.scale(width,height);
			triangulator.addPoint(p,{"data":point2D, "2D":p, "3D":point3D});
			// if(i>=1000){
			// 	break;
			// }
		}

		var tris = triangulator.triangles();
		var datas = triangulator.datas();
		var points = triangulator.points();
		console.log(tris);
		console.log(datas);
		console.log(points);
		var output = [];
		for(var i=0; i<tris.length; ++i){
			var t = tris[i];
			var pA = datas[t[0]];
			var pB = datas[t[1]];
			var pC = datas[t[2]];
			output.push({"2D":[pA["2D"],pB["2D"],pC["2D"]], "3D":[pA["3D"],pB["3D"],pC["3D"]]});
		}
		return {"triangles":output, "texture":bind};
	}
	return null;
	/*
	// create textures
	var pointsA = this._cameraPointsA;
	var pointsB = this._cameraPointsB;
	var points3D = this._cameraPoints3D;

	// create delauny triangulation from one of the images
	var triangulator = new Triangulator();
	for(i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];

		var pointB = pointsB[i];

		var point3 = points3D[i];
		var pointUse = pointB;
		triangulator.addPoint(pointUse,{"A":pointA,"B":pointB,"3":point3});
	}
	var tris = triangulator.triangles();
	var datas = triangulator.datas();
	var points = triangulator.points();
	console.log(tris);
	console.log(datas);
	//
	var triA, triB, tri3D;
	var renderTris = [];
	var mappings = [];
	var textureMap = new TextureMap();
	for(i=0; i<tris.length; ++i){
		var tri = tris[i];
		var a = tri[0];
		var b = tri[1];
		var c = tri[2];
		// a = points[a];
		// b = points[b];
		// c = points[c];
		var aA = datas[a]["A"];
		var aB = datas[b]["A"];
		var aC = datas[c]["A"];
		var bA = datas[a]["B"];
		var bB = datas[b]["B"];
		var bC = datas[c]["B"];
		var cA = datas[a]["3"];
		var cB = datas[b]["3"];
		var cC = datas[c]["3"];
//		console.log(aA+" ? "+bA);
		//
		triA = new Tri2D(aA,aB,aC);
		triB = new Tri2D(bA,bB,bC);
		tri3D = new Tri3D(cA,cB,cC);
		var mapping = textureMap.addTriangle(tri3D, [triA,triB], [imageMatrixA,imageMatrixB]);
		//var mapping = textureMap.addTriangle(tri3D, [triA], [imageMatrixA]);
		//var mapping = textureMap.addTriangle(tri3D, [triB], [imageMatrixB]);
		mappings.push(mapping);
//if(i>100){
//if(i>1000){ // start to slow
//if(i>2000){
//if(i>3000){
if(i>5000){ // arbitrarily large
	break;
}
	}
	console.log(mappings.length);

	textureMap.pack();
	console.log(" packed ");

	for(i=0; i<mappings.length; ++i){
		var mapping = mappings[i];
		var textureMatrix = mapping.image();
		var triOrigin = mapping.triImage();
		var tri3D = mapping.tri3D();
		var img = mapping.imageDOM();
		//console.log(triOrigin)
		//var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
		//Code.addChild(Code.getBody(), img);
		var renderTri = null;//new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
		var tri = new DOTri(img, renderTri, triOrigin);
		renderTris.push([tri,tri3D]);
	}
console.log("mappings "+mappings.length);
	this._renderTris = renderTris;




	????
	*/
}

App3DR.App.Model3D.prototype.onMouseDownFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseUpFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseMoveFxn3D = function(e){
	Code.eventPreventDefault(e);
}
App3DR.App.Model3D.prototype.onMouseWheelFxn3D = function(e){

Code.eventPreventDefault(e);

// console.log("onMouseWheelFxn3D");

if(this._keyboard.isKeyDown(Keyboard.KEY_LET_O)){ // left/right
	if(!this._XXX){
		this._XXX = true;
		this._bindAfterTexturesLoaded();
	}
}

	var scroll = e["scroll"];
	var orientation = this._camera.orientation();

// console.log(orientation);

	var x = orientation["x"];
	var y = orientation["y"];
	var z = orientation["z"];
	var o = orientation["o"];

	//console.log(this._distanceRange);

	var scaleSize = this._distanceRange * 0.00001;
	//var scaleSize = this._distanceRange * 0.000001; // with a LOT OF ERROR this is better
	var scaleAngle = 0.001;

	if(this._keyboard.isKeyDown(Keyboard.KEY_SHIFT)){
		// scaleSize *= 0.1;
		// scaleAngle *= 0.25;

		scaleSize *= 0.01;
		scaleAngle *= 0.01;
	}

// console.log(this._distanceRange);

// ROTATIONS
	if(this._keyboard.isKeyDown(Keyboard.KEY_LET_Z)){ // left/right
// console.log("LEFT / RIGHT ...");
y = new V3D(0,1,0);
		// var dirY = y.copy().scale(scroll.x);
		var dirY = y.copy().scale(scroll.y);
		var rot = dirY.copy().norm();
		var mag = dirY.length() * scaleAngle;
		this._camera.rotate(rot, mag);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_X)){ // up/down
x = new V3D(1,0,0);
		var dirX = x.copy().scale(scroll.y);
		var rot = dirX.copy().norm();
		var mag = dirX.length() * scaleAngle;
		this._camera.rotate(rot, mag);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_C)){ // around
z = new V3D(0,0,1);
		var dirZ = z.copy().scale(scroll.y);
		var rot = dirZ.copy().norm();
		var mag = dirZ.length() * scaleAngle;
		this._camera.rotate(rot, mag);
// TRANSLATIONS
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_S)){ // up/down
y = new V3D(0,1,0);
		var dirY = y.copy().scale(-scroll.y * scaleSize);
		this._camera.translate(dirY);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_A)){ // left/right
x = new V3D(1,0,0);
		//var dirX = x.copy().scale(scroll.x * scaleSize);
		var dirX = x.copy().scale(scroll.y * scaleSize); // does not exist on all mouse
// console.log("LEFT / RIGHT ... "+dirX);
		this._camera.translate(dirX);
	}else{ // in/out
z = new V3D(0,0,1);
		var dirZ = z.copy().scale(scroll.y * scaleSize);
		this._camera.translate(dirZ);
	}

}
App3DR.App.Model3D.prototype.onMouseClickFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseExitFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onKeyboardDown = function(e){
	// console.log(e);
	var key = Code.getKeyCodeFromKeyboardEvent(e);
	// console.log(key);
	if(key==Keyboard.KEY_LET_P){
		this._modelRenderCameraViews = !Code.valueOrDefault(this._modelRenderCameraViews, true);
		console.log("TOGGLE CAMERA VIEWS: "+this._modelRenderCameraViews);
	}
	if(key==Keyboard.KEY_LET_O){
		this._modelRenderPoints = !Code.valueOrDefault(this._modelRenderPoints, true);
		console.log("TOGGLE POINTS: "+this._modelRenderPoints);
	}
	if(key==Keyboard.KEY_LET_I){
		this._modelRenderNormals = !Code.valueOrDefault(this._modelRenderNormals, true);
		console.log("TOGGLE NORMALS: "+this._modelRenderNormals);
	}
}
App3DR.App.Model3D.prototype._eff = function(){
	++this._time;

	this.rotateScene();

// console.log("_eff")


var renderCameraViews = Code.valueOrDefault(this._modelRenderCameraViews, true);
var renderPoints = Code.valueOrDefault(this._modelRenderPoints, true);
var renderNormals = Code.valueOrDefault(this._modelRenderNormals, true);

	// RENDERING:
	this._stage3D.clear();

	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);

	// RENDER TEXTURES
	if(renderCameraViews && this._textureUVPoints && this._textureUVPoints.length>0){
// console.log(this._textures.length, this._textureUVPoints);
		// console.log("this._textureUVPoints: "+this._textureUVPoints.length);
		this._stage3D.selectProgram(1);
		this._stage3D.disableCulling();
		this._stage3D.matrixReset();
		//console.log(this._textureUVPoints.length)
// console.log(this._textures);



		for(var i=0; i<this._textureUVPoints.length; ++i){
			this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._textureUVPoints[i]);
			this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._textureVertexPoints[i]);
			this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
			// console.log( this._canvas3D._context.TEXTURE0 )
			this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._textures[i]);
			// this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._textures[0]);
			this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); //


    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    // gl.generateMipmap(gl.TEXTURE_2D);


			this._stage3D.drawTriangles(this._vertexPositionAttrib, this._textureVertexPoints[i]);
		}
	}
	// RENDER POINTS

	if(renderPoints && this._pointPointBuffer && this._pointPointBuffer.length>0){
	// if(false){
		this._stage3D.selectProgram(3);
		this._stage3D.disableCulling();
		this._stage3D.matrixReset();
		this._stage3D.bindArrayFloatBuffer(this._pointVertexPositionAttrib, this._pointPointBuffer);
		this._stage3D.bindArrayFloatBuffer(this._pointVertexColorAttrib, this._pointColorBuffer);
		this._stage3D.drawPoints(this._pointVertexPositionAttrib, this._pointPointBuffer);
	}

	// RENDER LINES
	if(renderNormals && this._programLinePoints && this._programLinePoints.length>0){
		// console.log("lines")
		this._stage3D.selectProgram(2);
		this._stage3D.matrixReset();
		this._stage3D.disableCulling();
		this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
		this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
		this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);
	}


	/*


	gl.vertexAttribPointer(shaderTexCoordAttribute, obj.texCoordSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        gl.uniform1i(shaderSamplerUniform, 0);



 gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareTitleVertexPositionBuffer.numItems);




		gl.bindBuffer(gl.ARRAY_BUFFER, squareTextVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareTextVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareTextVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareTextVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
	*/
}
App3DR.App.Model3D.prototype.rotateScene = function(){




	var e = this._time;


	this._sphereMatrix.identity();
//	this._sphereMatrix.rotateVector( (new V3D(0,1,0)).norm(), Code.radians(e) );


	var matrix = this._camera.matrix();


	var transform = new Matrix3D();
	transform.identity();
	transform.mult(transform, this._sphereMatrix);
	//transform.mult(transform, this._userInteractionMatrix);

	transform.mult(transform, matrix);


	this._stage3D.matrixSetFromMatrix3D(transform);
}
App3DR.App.Model3D.prototype.what = function(location){
	// POINTS
	this._stage3D.selectProgram(3);
	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);

/*

load imageA, imageB
load data: camera centers, 2D points, 3D points, ...



show 3D point dots
show camera center
show camera/image screens [textured rects]
show lines from camera center to dots

show surface triangulation
show surface textures

*/
}
App3DR.App.Model3D.Camera = function(){
	// this._pos = new V3D();
	// this._rot = new V3D();
}

// App3DR.App.Model3D.Camera.prototype.identity = function(){
// 	this._pos.set(0,0,0);
// 	this._rot.set(1,0,0);
// }



App3DR.App.Model3D.prototype.getVertexShaders = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    	", // ^ colored triangles
    	"\
    	attribute vec3 aVertexPosition; \
		attribute vec2 aTextureCoord; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		varying vec2 vTextureCoord; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vTextureCoord = aTextureCoord; \
		} \
		", // ^ textured triangles
		" \
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 2.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
		", // ^ lines
		" \
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 4.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
		"]; // ^ points
}
App3DR.App.Model3D.prototype.getFragmentShaders = function(){
    return ["\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		", //
		"\
		precision mediump float; \
		varying vec2 vTextureCoord; \
		uniform sampler2D uSampler; \
		void main(void){ \
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \
		} \
    	", //
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		", //
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    	"]; //
}

// ------------------------------------------------------------------





App3DR.Explorer2D = function(){
	this._containerSize = new V2D();
	this._subjectSize = new V2D();
	this._subjectCenter = new V2D();
	this._subjectScale = 1.0;
	this._subjectRotation = 0.0;
	//
	this._scaleRangeMin = Math.pow(2,-5); //0.1; 1/32
	this._scaleRangeMax = Math.pow(2,7); //10.0;   64
	this._rotateRangeMin = null;
	this._rotateRangeMax = null;
//	this._focus = new V2D();
}
App3DR.Explorer2D.prototype.containerSize = function(){
	return this._containerSize;
}
App3DR.Explorer2D.prototype.offset = function(){
	return this._subjectCenter;
}
App3DR.Explorer2D.prototype.scale = function(){
	return this._subjectScale;
}
App3DR.Explorer2D.prototype.rotation = function(){
	return this._subjectRotation;
}
App3DR.Explorer2D.prototype.center = function(){
	var center = this._containerSize.copy().scale(0.5);
	center.add(this._subjectCenter);
	return center;
}
App3DR.Explorer2D.prototype.size = function(){
	var size = this._subjectSize.copy().scale(this._subjectScale);
	return size;
}
//App3DR.Explorer2D.prototype.boundingBox = function(){
App3DR.Explorer2D.prototype.axes = function(){
	var bounds = this.bounds();
	var o = bounds[0];
	var x = V2D.sub(bounds[1],bounds[0]);
	var y = V2D.sub(bounds[3],bounds[0]);
	return {"x":x, "y":y, "o":o};
}
App3DR.Explorer2D.prototype.toScreenPoint = function(p){
	var matrix = this._matrix();
	var q = matrix.multV2D(p);
	return q;
}
App3DR.Explorer2D.prototype.toLocalPoint = function(p){
	var matrix = this._matrix();
	var inverse = matrix.copy().inverse();
	var q = inverse.multV2D(p);
	return q;
}
App3DR.Explorer2D.prototype._matrix = function(){
	var container = this._containerSize;
	var subject = this._subjectSize;
	var offset = this._subjectCenter;
	var matrix = new Matrix2D();
		matrix.translate(-subject.x*0.5, -subject.y*0.5); // center to origin
		matrix.scale(this._subjectScale);
		matrix.rotate(this._subjectRotation);
		matrix.translate(container.x*0.5, container.y*0.5); // to center
		matrix.translate(offset.x, offset.y); // to offset
	return matrix;
}
App3DR.Explorer2D.prototype.bounds = function(){
	//var size = this.size();
	var container = this._containerSize;
	var subject = this._subjectSize;
	var offset = this._subjectCenter;
	var matrix = this._matrix();
	var a = new V2D(0,0);
	var b = new V2D(subject.x,0);
	var c = new V2D(subject.x,subject.y);
	var d = new V2D(0,subject.y);
	var array = [a,b,c,d];
	for(var i=0; i<array.length; ++i){
		array[i] = matrix.multV2D(array[i]);
	}
	return array;
}
App3DR.Explorer2D.prototype.setSizes = function(container, subject){
	this._containerSize.copy(container);
	this._subjectSize.copy(subject);
}
App3DR.Explorer2D.prototype.updateScale = function(desired){
	var focus = this.focusPoint();
	var scale = desired;
	if(this._scaleRangeMin){

		// MOVE OFFSET TO ACCOUNT FOR CHANGE IN SCALE ABOUT
		this._focus;
		scale = Code.clamp(scale, this._scaleRangeMin, this._scaleRangeMax);
	}
	this._subjectScale = scale;
	this.toFocusPoint(focus);
	return scale;
}
App3DR.Explorer2D.prototype.updateRotation = function(desired){
	var focus = this.focusPoint();
	var angle = desired;
	if(this._rotateRangeMin){
		this._focus;
		angle = Code.clamp(angle, this._rotateRangeMin, this._rotateRangeMax);
	}
	this._subjectRotation = angle;
	this.toFocusPoint(focus);
	return angle;
}
App3DR.Explorer2D.prototype.updateOffset = function(desired){
	var offset = this._subjectCenter;
	offset.copy(desired);

	// ...
	return offset;
}
App3DR.Explorer2D.prototype.toFocusPoint = function(p){ // focus on pixel
	var center = this._containerSize.copy().scale(0.5);
	var screen = this.toScreenPoint(p);
	var centerToPoint = V2D.sub(screen,center);
	var scaled = centerToPoint.copy().scale(-1);
	this._subjectCenter.add(scaled);
}
App3DR.Explorer2D.prototype.focusPoint = function(p){ // currently focused pixel
	var center = this._containerSize.copy().scale(0.5);
	var f = this.toLocalPoint( center );
	return f;
}
App3DR.Explorer2D.prototype.mouseDown = function(location){
	if(!this._isDragging){
		this._isDragging = true;
		this._dragOrigin = location.copy();
	}
}
App3DR.Explorer2D.prototype.mouseMove = function(location){
	if(this._isDragging){
		this._dragOffset = location.copy();
		var diff = V2D.sub(this._dragOffset,this._dragOrigin)
		this._dragOrigin = this._dragOffset;
		this._subjectCenter.add(diff);
	}
}
App3DR.Explorer2D.prototype.mouseUp = function(location){
	if(this._isDragging){
		this._isDragging = false;
		this._dragOffset = location.copy();
		var diff = V2D.sub(this._dragOffset,this._dragOrigin);
		this._subjectCenter.add(diff);
	}
}







App3DR.prototype.setupAppActive = function(app){
	this._activeApp = app;
	var size = this._canvas.size();
	var siz = Math.min(size.x,size.y);
	var sizX = size.x;
	var sizY = size.y;
	var cen = new V2D(size.x*0.5,size.y*0.5);
	var min = new V2D(cen.x-sizX*0.5,cen.y-sizY*0.5);
	var max = new V2D(min.x+sizX,min.y+sizY);
	// Code.sizeToFitInside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	app.setActive(this._canvas, this._stage, this._root, min,max);
}


App3DR.prototype._handleCanvasResizeFxn = function(r){
	if(this._activeApp){
		return;
	}

	this._updateBackground();

	var screenSize = new V2D( this._canvas.width(), this._canvas.height() );
	// console.log("screenSize: "+screenSize);
	var screenCenter = screenSize.copy().scale(0.5);

	var grid = this._grid;
if(grid){
	var cellCount = 4.0;
	//var canvasScale = this._canvas.presentationScale();
	var screenMin = Math.min(screenSize.x,screenSize.y);


	//console.log(this._canvas)
	//var screenSize = this._canvas.size();
	// var iconSize = 0.10 * screenMin//Math.min(screenSize.x,screenSize.y);
	// 	iconSize = Math.round(iconSize);

	var iconSize = screenMin/2.0;//(10 * cellCount);////Math.min(screenSize.x,screenSize.y);
		iconSize = Math.round(iconSize);
	console.log(iconSize);
	grid._iconSize = iconSize;


	grid.viewScale(screenMin/cellCount);
	grid.cellBuffer(Math.ceil( (screenSize.x/screenMin) * (cellCount+2)) , Math.ceil( (screenSize.y/screenMin) * (cellCount*2) ));
	grid.render();
	this._displayMenu.matrix().identity();
	this._displayMenu.matrix().translate(screenCenter.x,screenCenter.y);
}
}
App3DR.prototype._handleKeyboardUp = function(e){
	if(this._activeApp){
		this._activeApp.handleKeyUp(e);
		return;
	}
}
App3DR.prototype._handleKeyboardDown = function(e){
	if(this._activeApp){
		this._activeApp.handleKeyDown(e);
		return;
	}
}
App3DR.prototype._handleEnterFrameFxn = function(t){
	//this.renderMenu(t);
}
App3DR.prototype._handleMouseDownFxn = function(e){
	if(this._activeApp){
		this._activeApp.handleMouseDown(e);
		return;
	}
	if(!this._grid){
		return;
	}
	var location = e["location"];
	this._grid.dragStart(location);
	this._mouseDown = location;

	this._mouseHasMoved = false;
	this._mouseHasPressed = false;
	this.gridUpdate(location, 0);
	this._longPressTicker.start();
	//this._longPressTicker.addFunction(Ticker.EVENT_TICK, this._longPressTrigger, this);
}
App3DR.prototype._longPressTrigger = function(e){
	this._longPressTicker.stop();
	this._mouseHasPressed = true;
	var location = this._mouseDown;
	this.gridUpdate(location, 2);
	this._stopDragging(location);
}
App3DR.prototype.gridUpdate = function(location, type){
	if(type==0){
		// initial down
	}else if(type==1){
		// select over
	}else if(type==2){
		// long press
	}
	if(this._mouseHasMoved){
		return;
	}

	var screenSize = new V2D( this._canvas.width(), this._canvas.height() );
	var screenCenter = screenSize.copy().scale(0.5);
	var offset = screenCenter.copy().scale(-1);
	this._grid.mouseDown(location, offset, type);
}
App3DR.prototype._handleMouseUpFxn = function(e){
	if(this._activeApp){
		this._activeApp.handleMouseUp(e);
		return;
	}



	this._longPressTicker.stop();
	var location = e["location"];
	if(this._mouseDown){ // if already dragging
		this._stopDragging(location);

		if(!this._mouseHasPressed){
			this.gridUpdate(location, 1);
		}
	}
}
App3DR.prototype._handleMouseMoveFxn = function(e){
	Code.eventPreventDefault(e);
	if(this._activeApp){
		this._activeApp.handleMouseMove(e);
		return;
	}



	var location = e["location"];
	if(this._mouseDown){
		this._longPressTicker.stop();
		this._grid.dragContinue(location);
		this._mouseDown = location;
		this._mouseHasMoved = true;
	}
}
App3DR.prototype._stopDragging = function(location){
	this._mouseDown = location;
	this._grid.dragStop(location);
	this._mouseDown = null;
}
App3DR.prototype._handleMouseClickFxn = function(e){
	if(this._activeApp){
		return;
	}



	var location = e["location"];
	//console.log(location);



	/*
	var d = new DO();
	d.graphics().clear();
	d.graphics().setFill(0x9900FF00);
	//d.graphics().setLine(1.0, 0xCCCC0000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawCircle(location.x,location.y,2.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	*/
}

App3DR.prototype._handleBackgroundImagesLoaded = function(imageInfo){
	if(this._activeApp){
		return;
	}



	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	this._imageBackground = imageList[0];
	this._updateBackground();
}
App3DR.prototype._updateBackground = function(r){
	var size = new V2D(this._canvas.width(), this._canvas.height());
	var bg = this._displayBG;
	if(!bg){
		return;
	}
	bg.graphics().clear();
	// draw image
	var image = this._imageBackground;
	if(image){
		//console.log(image)
		bg.removeAllChildren();
		//var d = new DOImage(image);
		var d = new DO();
		d.graphics().clear();
		//console.log(image.width,image.height)
		var outside = Code.sizeToFitOutside(size.x,size.y, image.width,image.height);
		//var outside = Code.sizeToFitInside(size.x,size.y, image.width,image.height);
		// console.log(size.x,size.y)
		// console.log(outside.x,outside.y)
		var pX = (size.x-outside.x)*0.5;
		var pY = (size.y-outside.y)*0.5;
		d.graphics().drawImage(image, pX,pY,outside.x,outside.y);
		bg.addChild(d);
	}
	// draw cover
	var d = new DO();
	d.graphics().setFill(0xAA000000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawRect(-1,-1, size.x+2,size.y+2);
	d.graphics().endPath();
	d.graphics().fill();
	bg.addChild(d);
}


// App3DR.prototype.renderMenu = function(t){
// 	...
// }




function HexGrid(){
	this._cellSizeWidth = 5;
	this._cellSizeHeight = 5;
	this._scale = 1.0;
	this._sphereRadius = 10.0;
}
HexGrid.prototype.cellCountX = function(c){
	if(c!==undefined){
		this._cellSizeWidth = c;
	}
	return this._cellSizeWidth;
}
HexGrid.prototype.cellCountY = function(c){
	if(c!==undefined){
		this._cellSizeHeight = c;
	}
	return this._cellSizeHeight;
}
HexGrid.prototype.scale = function(s){
	if(s!==undefined){
		this._scale = s;
	}
	return this._scale;
}
HexGrid.prototype.radius = function(r){
	if(r!==undefined){
		this._sphereRadius = r;
	}
	return this._sphereRadius;
}
HexGrid.prototype.cellsAt = function(offsetX,offsetY){
	var i, j;
	var countI = this._cellSizeWidth;
	var countJ = this._cellSizeHeight;
	var halfSizeX = Math.ceil(countI*0.5);
	var halfSizeY = Math.ceil(countJ*0.5);
	var cells = [];
	var centerX = Math.round(offsetX/HexGrid._HEX_SCALE_X);
	var centerY = Math.round(offsetY);
	///console.log(countI,countJ,halfSizeX,halfSizeY)
	for(j=0; j<countJ; ++j){
		for(i=0; i<countI; ++i){
			var cell = new V2D(i+centerX-halfSizeX,j+centerY-halfSizeY);
			cells.push(cell);
		}
	}
	return cells;
}
HexGrid.prototype.pointInCell = function(offsetX,offsetY, cellX,cellY,cellZ, pX,pY){ // pX&pY in [-0.5, 0.5]
	var point = new V2D();
	var cellPosX = (cellX+pX)*HexGrid._HEX_SCALE_X;
	// point.add(cellX*HexGrid._HEX_SCALE_X,cellY);
	var cellPosY = (cellY+pY);
	if(Math.abs(cellX)%2==1){
		cellPosY += HexGrid._HEX_SHIFT_Y;
	}
	this._pointLocation(point, offsetX,offsetY, cellPosX,cellPosY,cellZ);
	return point;
}
HexGrid.prototype.cellLocation = function(offsetX,offsetY, cellX,cellY,cellZ){
	return this.pointInCell(offsetX,offsetY, cellX,cellY,cellZ,0.0,0.0);
}
HexGrid._HEX_POLYGON_DIAMOND = [];
HexGrid._HEX_POLYGON_RECT = []; // containing
HexGrid._HEX_POLYGON_SQUARE_INNER = []; // inner-square
HexGrid._HEX_POLYGON_SQUARE_OUTER = []; // outer-square
HexGrid._HEX_POLYGON_HEX = [];
HexGrid._HEX_RADIUS = 1.0/Math.sqrt(3);
HexGrid._HEX_SHIFT_Y = -0.5;
HexGrid._HEX_SCALE_X = Math.cos(Math.PI/6.0);

for(var i=0; i<6; ++i){
	var r = HexGrid._HEX_RADIUS;
	var a = i*Code.radians(60.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_HEX[i] = new V2D(x,y);
}
for(var i=0; i<4; ++i){
	var r = HexGrid._HEX_RADIUS * 0.5;
	r = r * 1.0/Math.sin(Code.radians(60.0));
	var a = Code.radians(45.0) + i*Code.radians(90.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_SQUARE_INNER[i] = new V2D(x,y);
}
for(var i=0; i<4; ++i){
	var r = HexGrid._HEX_RADIUS;
	//r = r * Math.SQRT2*Math.sin(Code.radians(60.0));
	r = r * 1.0/Math.sin(Code.radians(60.0));
	var a = Code.radians(45.0) + i*Code.radians(90.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_SQUARE_OUTER[i] = new V2D(x,y);
	//HexGrid._HEX_POLYGON_RECT[i] = new V2D(x,y);
}



HexGrid.prototype.cellPolygon = function(offsetX,offsetY, cellX,cellY,cellZ, scaleIn, poly){
	scaleIn = (scaleIn!==undefined && scaleIn!==null) ? scaleIn : 1.0;
//	var polygon = HexGrid._HEX_POLYGON_HEX;
	//var polygon = HexGrid._HEX_POLYGON_RECT;
	// HexGrid._HEX_POLYGON_SQUARE_INNER;
	var polygon = poly!==undefined ? poly : HexGrid._HEX_POLYGON_HEX;
	var points = [];
	for(var i=0; i<polygon.length; ++i){
		var point = V2D.copy(polygon[i]);
		point.scale(scaleIn);
		point.add(cellX*HexGrid._HEX_SCALE_X,cellY);
		if(Math.abs(cellX)%2==1){
			point.add(0.0, HexGrid._HEX_SHIFT_Y);
		}
		this._pointLocation(point, offsetX,offsetY, point.x,point.y,cellZ);
		points.push(point);
	}
	return points;
}
HexGrid.prototype._pointLocation = function(result, offsetX,offsetY, locX,locY,locZ){
	locZ = locZ!==undefined ? locZ : 0.0;
	var diffX = locX - offsetX;
	var diffY = locY - offsetY;
	var radius = Math.sqrt(diffX*diffX + diffY*diffY);
	var pointScale = this._rbf(radius, locZ, this._scale);
	var resultX = pointScale * diffX;
	var resultY = pointScale * diffY;
	result.x = resultX;
	result.y = resultY;
}
HexGrid.prototype._rbf = function(radius,depth, scale){
	var sphereRadius = this._sphereRadius + depth;
	var limit = 1E6;
	if(radius>=sphereRadius){
		return limit;
	}
	var r = radius/sphereRadius;
	//var rbf = (1.0 - r);
	var rbf = Math.cos( r*Math.PI*0.5 );
		// rbf = rbf * rbf;
	var val = scale * (1.0/rbf);
	if(val>limit){
		return limit;
	}
	return val;

	//return 50.0;
}
/*
HexGrid._rbf2 = function(radius,depth, scale){
	var minLim = 1E-1;
	if(radius<=minLim){
		radius = minLim;
	}
	scale = scale!==undefined ? scale : 1.0;
	depth = depth!==undefined ? depth : 0.0;
	if(depth<0){
		depth = 1.0/depth;
	}
	var depthScale = 1.0;
	var depthCurve = 1.0;
	var depthSize = 1.0;
	//var depthScale = 1.0/(1.0 + depth*0.1);
	//var depthCurve = 1.0/(1.0 + depth*0.10);
	//var depthSize = 1.0 + depth*0.01;

	//var depthScale = 1.0/(1.0 + depth*0.01);
	var depthScale = (1.0 + depth*0.10);
	var depthCurve = 1.0/(1.0 + depth*1.0);
	//var depthCurve = (1.0 + depth*0.10);
	var depthSize = (1.0 + depth*0.10);
	//var depthSize = 1.0/(1.0 + depth*0.05);

	var curviness = 0.10;
	var siziness = 1.0;
	var val = radius + depthCurve*curviness*Math.exp(radius*siziness*depthSize);

	if(val<0){
		val = 0;
	}
	var limit = 1E8;
	if(val>limit){
		val = limit;
	}
	return depthScale * scale * val / (0.1 + radius); // /rad ~ 0 = problematic
}
*/

function HexSystem(parent){
	HexSystem._.constructor.call(this);
	this._display = new DO();
		parent.addChild(this._display);
		this._buttonDisplay = new DO();
		this._display.addChild(this._buttonDisplay);
	this._grid = new HexGrid();
	this._pos = new V2D();
	this._rotation = 0.0;
	this._zoom = 1.0;
	this._isAnimating = false;
	this._scrollDirection = null;
	this._isDragging = false;
	this._dragStart = null;
	this._dragStop = null;
	this._dragTimestamp = null;
	this._offset = new V2D();
	this._scale = 1;
	this._dragScale = 1.0;
	this._momentumTicker = new Ticker(1000/30);
	this._momentumTicker.addFunction(Ticker.EVENT_TICK, this._handleDecayTickerFxn, this);
	this._momentumDecay = 0.8;
	this._momentumVelocity = null;


var fxnHighlight = function(){
	console.log("highlight");
}
var fxnSelect = function(){
	console.log("select");
}
var fxnHold = function(){
	console.log("hold");
}

	var menu = new HexSystem.Menu();
		menu.addItem( new HexSystem.Menu.Item(0,1, fxnHighlight, fxnSelect, fxnHold) );
		menu.addItem( new HexSystem.Menu.Item(1,0, fxnHighlight, fxnSelect, fxnHold) );
		menu.addItem( new HexSystem.Menu.Item(-1,0, fxnHighlight, fxnSelect, fxnHold) );
		// menu.addItem( new HexSystem.Menu.Item(1,0, fxnHighlight, fxnSelect, fxnHold) );
		// menu.addItem( new HexSystem.Menu.Item(2,0, fxnHighlight, fxnSelect, fxnHold) );
		//menu.addItem( new HexSystem.Menu.Item(1,1) );
		//menu.addItem( new HexSystem.Menu.Item(-2,-1) );
	this._menu = menu;
	this._toCenter();
	this._render();
	this._loadResources();
}
Code.inheritClass(HexSystem,Dispatchable);

HexSystem.EVENT_VIEW_UPDATE = "EVENT_VIEW_UPDATE";
HexSystem.EVENT_ANIMATION_START = "EVENT_ANIMATION_START";
HexSystem.EVENT_ANIMATION_END = "EVENT_ANIMATION_END";

HexSystem.prototype._handleDecayTickerFxn = function(){
//	console.log("ticker + "+this._momentumVelocity);
	this._momentumVelocity.scale(this._momentumDecay);
	var len = this._momentumVelocity.length();
	this._offset.add(this._momentumVelocity);
	this._render();
	if(len<0.001){
		this._momentumVelocity = null;
	}
	if(!this._momentumVelocity){
		this._momentumTicker.stop();
	}
}
HexSystem.prototype._loadResources = function(){
	var fxn = function(imageInfo){
		this._resource_image_link = imageInfo.images[0];
	// 	var imageList = imageInfo.images;
	// var fileList = imageInfo.files;
	// this._imageBackground = imageList[0];
	// this._updateBackground();
		this._render();
	}
	var imageLoader = new ImageLoader("./images/icons/",["icon_button_link.png"], this,fxn,null);
	imageLoader.load();
}

HexSystem.prototype.cellBuffer = function(w,h){
	//console.log("cellBuffer: "+w+" "+h);
	this._grid.cellCountX(w);
	this._grid.cellCountY(h);
}
HexSystem.prototype._toCenter = function(){
	var menu = this._menu;
	var max = menu.max();
	var min = menu.min();
	var cen = V2D.avg(min,max);
	this._offset.set(cen);
}
HexSystem.prototype.render = function(){
	this._render(null);
}
HexSystem.prototype._render = function(delta){
	//t = t!==undefined ? t : 0;
	var t = 0;
	var display = this._display;
	display.removeAllChildren();

	var iconSize = this._iconSize;

	var grid = this._grid;
	var offset = this._offset;
	if(delta){
		offset = V2D.add(offset,delta);
	}
	var menu = this._menu;
	if(menu){
		var toleranceX = 0.5;
		var toleranceY = 0.5;
		offset.x = Code.clamp(offset.x, menu.min().x-toleranceX,menu.max().x+toleranceX);
		offset.y = Code.clamp(offset.y, menu.min().y-toleranceY,menu.max().y+toleranceY);
	}

	var cells = grid.cellsAt(offset.x,offset.y);

	var imageIcon = this._resource_image_link;

	var i, j;

	for(i=0; i<cells.length; ++i){
		var cell = cells[i];
		var center = grid.cellLocation(offset.x,offset.y, cell.x,cell.y);
		var centerDisplay = center.copy().scale(1.0,-1.0);

		//var isActive = (Math.abs(cell.x)%2==0 || Math.abs(cell.x)%5==1) && (Math.abs(cell.y)%2==0);

		var isActive = false;
		var items = menu.items();
		var activeItem = null;
		for(j=0; j<items.length; ++j){
			var item = items[j];
			var c = item.cell();
			if(c.x==cell.x && c.y==cell.y){
				isActive = true;
				activeItem = item;
				break;
			}
		}
		//console.log(center+"")
/*
		var d = new DO();
			d.graphics().clear();
			d.graphics().setFill(0x99330000);
			d.graphics().setLine(1.0, 0xCCCC0000);
			d.graphics().beginPath();
			//d.graphics().drawPolygon(poly,true);
			d.graphics().drawCircle(centerDisplay.x,-centerDisplay.y,1.0);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			display.addChild(d);
*/


		var colorDark = 0x66110000;
		var colorRed = 0xFFFF2211;
		var colorInside = [0.1,0x99FF0000, 0.9,0x66DD0000];
		//var scaleIn = 0.9;

		var colorDarkInactive = 0x33000000;
		var colorRedInactive = 0x66FF2211;
		var colorInsideInactive = [0.1,0x33FF0000, 0.9,0x22DD0000];
		var area = new DO();
		area.graphics().clear();
		display.addChild(area);
		//d.matrix().translate(screenCenter.x,screenCenter.y);
//		for(j=0; j<2; ++j){

			//var colorInside = 0x0;
			//scaleIn = 0.9;
			// if(j==1){
			// 	color = 0xFFFFFFFF;
			// 	scaleIn = 0.5;
			// }
			// var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, scaleIn);
			// for(var k=0; k<poly.length; ++k){
			// 	poly[k].y = -poly[k].y;
			// }
			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.93);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyExterrior = poly;

			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.80);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyOutline = poly;

			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.70);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyInline = poly;

			var closestCorner = null;
			var closestDistance = null;
			for(var k=0; k<polyInline.length; ++k){
				var corner = polyInline[k];
				var distance = V2D.distance(centerDisplay,corner);
				if(closestCorner==null || distance>closestDistance){
					closestCorner = corner;
					closestDistance = distance;
				}
			}

			var minRad = 0;//0.1 * closestDistance;
			var maxRad = closestDistance;//1.0 * closestDistance;

			if(imageIcon && isActive){
				// HexGrid.prototype.cellPolygon = function(offsetX,offsetY, cellX,cellY,cellZ, scaleIn, poly
				var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.25, 1.0,  HexGrid._HEX_POLYGON_SQUARE_OUTER);
				var poly2 = [];
				for(var k=0; k<poly.length; ++k){
					poly2[k] = poly[k].copy().scale(1,-1);
				}
				activeItem.hitPolygon(poly2);

				for(var k=0; k<poly.length; ++k){
					poly[k].y = -poly[k].y;
				}
				/*
				var d = new DO();
					d.graphics().setFill(0x66FF00FF);
					d.graphics().beginPath();
					d.graphics().drawPolygon(poly,true);
					d.graphics().endPath();
					d.graphics().fill();
					display.addChild(d);
				*/



//function DOTri(img, triDisplay, triImage, parentDO){
				var a = poly[0];
				var b = poly[1];
				var c = poly[2];
				var d = poly[3];
				// top left:
				var triDisplay = new Tri2D(new V2D(b.x,b.y), new V2D(c.x,c.y), new V2D(d.x,d.y));
				var triImage = new Tri2D(new V2D(0,0), new V2D(0,imageIcon.height), new V2D(imageIcon.width,imageIcon.height));
				var icon = new DOTri(imageIcon, triDisplay, triImage);
				display.addChild(icon);

				// top right:
				var triDisplay = new Tri2D(new V2D(d.x,d.y), new V2D(a.x,a.y), new V2D(b.x,b.y));
				var triImage = new Tri2D(new V2D(imageIcon.width,imageIcon.height), new V2D(imageIcon.width,0.0), new V2D(0,0));
				var icon = new DOTri(imageIcon, triDisplay, triImage);
				display.addChild(icon);
				//icon.matrix().translate(centerDisplay.x,centerDisplay.y);

				// var icon = new DOImage(imageIcon);
				// icon.size(iconSize,iconSize);
				// //icon.matrix().translate(-imageIcon.width*0.5,-imageIcon.height*0.5);
				// icon.matrix().translate(-iconSize*0.5,-iconSize*0.5);
				// icon.matrix().translate(centerDisplay.x,centerDisplay.y);
				// display.addChild(icon);

			}
			var d = area;
			//var polyEnd = Code.arrayPushArray(Code.copyArray(polyInline), Code.copyArray(polyOutline));
			//d.graphics().drawPolygon(polyEnd,true);

			// behind

				color = isActive ? colorDark : colorDarkInactive;
				d.graphics().setFill(color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyExterrior,true);
				d.graphics().endPath();
				d.graphics().fill();
			// outline
				//var cellReal = cell.copy().scale(1.0,1.0);
				var dist = 1.0 + centerDisplay.length()* 0.002;//Math.sqrt(1.0 + V2D.distance(centerDisplay,offset));
				var alph = Code.clampRound0255(0x99/dist);
				colorRedInactiveFade = Code.setAlpARGB(colorRedInactive, alph);

				color = isActive ? colorRed : colorRedInactiveFade;
				d.graphics().setFill(color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyInline,true);
				d.graphics().drawPolygon(polyOutline,true);
				d.graphics().endPath();
				d.graphics().fillEvenOdd();
			// interrior
				color = isActive ? colorInside : colorInsideInactive;
				//d.graphics().setFill(color);
				d.graphics().setRadialFill(centerDisplay.x,centerDisplay.y,minRad, centerDisplay.x,centerDisplay.y,maxRad, color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyInline,true);
				d.graphics().endPath();
				d.graphics().fill();

				// d.graphics().setLine(1.0, 0x0);
				// d.graphics().strokeLine();

//		}
	}
}
HexSystem.Menu = function(){
	this._items = [];
	this._min = null;
	this._max = null;
	this._poly = null;
}
HexSystem.Menu.prototype.items = function(items){
	return this._items;
}
HexSystem.Menu.prototype.addItem = function(item){
	this._items.push(item);
	if(!this._min){
		this._min = item.cell().copy();
		this._max = this._min.copy();
	}else{
		this._min.min(item.cell());
		this._max.max(item.cell());
	}
}
HexSystem.Menu.prototype.min = function(){
	return this._min;
}
HexSystem.Menu.prototype.max = function(){
	return this._max;
}
HexSystem.Menu.Item = function(x,y, foc,sel,det){
	this._cell = new V2D(x,y);
	this._focusFxn = null;
	this._selectFxn = null;
	this._detailFxn = null;
	this.focusFxn(foc);
	this.selectFxn(sel);
	this.detailFxn(det);
}
HexSystem.Menu.Item.prototype.cell = function(){
	return this._cell;
}
HexSystem.Menu.Item.prototype.hitPolygon = function(poly){
	if(poly!==undefined){
		this._poly = poly;
	}
	return this._poly;
}
HexSystem.Menu.Item.prototype.focusFxn = function(f){
	if(f!==undefined){
		this._focusFxn = f;
	}
	return this._focusFxn;
}
HexSystem.Menu.Item.prototype.detailFxn = function(f){
	if(f!==undefined){
		this._detailFxn = f;
	}
	return this._detailFxn;
}
HexSystem.Menu.Item.prototype.selectFxn = function(f){
	if(f!==undefined){
		this._selectFxn = f;
	}
	return this._selectFxn;
}
HexSystem.Menu.Item.prototype.eventFocus = function(){
	if(this._focusFxn){
		this._focusFxn(this);
	}
}
HexSystem.Menu.Item.prototype.eventSelect = function(){
	if(this._selectFxn){
		this._selectFxn(this);
	}
}
HexSystem.Menu.Item.prototype.eventDetail = function(){
	if(this._detailFxn){
		this._detailFxn(this);
	}
}


HexSystem.prototype.viewScale = function(s){
	if(s!==undefined){
		this._scale = s;
		this._grid.scale(s);
	}
	return this._scale;
}
HexSystem.prototype.goToCell = function(cellX,cellY){
	//
	return false;
}
HexSystem.prototype.goToCell = function(cellX,cellY){
	//
	return false;
}
HexSystem.prototype.goToLocation = function(locationX,locationY){
	//
	return false;
}
HexSystem.prototype.animateToCell = function(cellX,cellY, duration){
	//
	return false;
}
HexSystem.prototype.animateToLocation = function(locationX,locationY, duration){
	//
	return false;
}
HexSystem.prototype.restrictScrollDirection = function(dirX,dirY){
	//
	return false;
}
HexSystem.prototype.restrictDragDirection = function(dirX,dirY){
	return false;
	if(dirX===null){
		this._scrollDirection = null;
		return;
	}
	var dir = new V2D(dirX,dirY);
	dir.norm();
	this._scrollDirection = dir;
}
HexSystem.prototype.mouseDown = function(point, offset, type){
	var point2D = V2D.copy(point);
	if(offset){
		point2D.add(offset);
	}
//	console.log("mouse down "+point2D);
	var menu = this._menu;
	var items = menu.items();
	for(var i=0; i<items.length; ++i){
		var item = items[i];
		var poly = item.hitPolygon();
		if(poly){
			var isInside = Code.isPointInsidePolygon2D(point2D, poly);
			if(isInside){
				if(type==0){
					item.eventFocus();
				}else if(type==1){
					item.eventSelect();
				}else if(type==2){
					item.eventDetail();
				}
			}
		}
	}
}
HexSystem.prototype.dragStart = function(point){
	this._dragStart = point;
	this._momentumTicker.stop();
	this._momentumVelocity = null;
	return false;
}
HexSystem.prototype.dragContinue = function(point){
	this._dragStop = point;
	this._dragTimestamp = Code.getTimeMilliseconds();
	this._dragDelta();
	return false;
}
HexSystem.prototype.dragStop = function(point){
	this._dragStop = point;
	var delta = this._dragDelta();
	this._offset.add(delta);
	this._dragStart = null;
	this._dragStop = null;
	var timestamp = Code.getTimeMilliseconds();
	if(this._dragTimestamp){
		var time = timestamp - this._dragTimestamp;
		if(time<100){
			if(time<1){
				time = 1;
			}
			delta.scale(1.0/time);
			if(delta.length()>0.1){
				this._momentumVelocity = delta;
				this._momentumTicker.start();
			}
		}
		this._dragTimestamp = null;
	}
	return false;
}
HexSystem.prototype._dragDelta = function(){
	var delta = V2D.sub(this._dragStop,this._dragStart);
	delta.scale(-1.0,1.0);
	delta.scale( this._dragScale * 1.0/this._scale);
	this._render(delta);
	return delta;
}
HexSystem.prototype.x = function(){
	//
}
HexSystem.prototype._currentCells = function(){
	var cells = cellsAt(this._pos.x,this._pos.y);
	return cells;
}
// passthrough
HexSystem.prototype.cellPolygon = function(cellX,cellY,cellZ){
	return this._grid.cellPolygon(this._pos.x,this._pos.y, cellX,cellY,cellZ);
}


// ------------------------------------------------------------------------------------------------------------


function HexMenu(){
	HexSystem._.constructor.call(this);
	this._grid = new HexSystem();
}
Code.inheritClass(HexSystem,Dispatchable);
HexMenu.EVENT_GET_ICON = "EVENT_GET_ICON";
HexMenu.prototype.gotoCell = function(){
	//
}
HexMenu.prototype.x = function(){
	//
}



// ------------------------------------------------------------------------------------------------------------
	/*
projects/
	0/
		info.yaml
			title: "New Project 11/9/18 9:12AM"
			created: "2018-11-09 09:12:31.9000"
			modified: "2019-03-03 16:59:33.2690"
			cameras:
				-
					directory: "LA8ADU8H"
					title: "New Camera LA8ADU8H"
					calculatedCount: 10					# number of images used to calculate K parameters (if not matching images.length -> needs processing)
					K:
						fx: 0.8565143769157422
						fy: 1.1625998022448123
						s: -0.012439315192795274
						cx: 0.4781381185245835
						cy: 0.4746370298801608
					distortion:
						k1: -0.012203124117497414
						k2: 0.0007660455391699547
						k3: 0.0005320068206907417
						p1: 0.017459785333744926
						p2: 0.014415011981151046
					images:
						-
							directory: "L9THUQ4M"
							matches: 81
							aspectRatio: 1.3333333333333333
							pictures:
								-
									file: "100.png"
									width: 1008
									height: 756
									scale: 1
								...
						...
			views:
				-
					title: "New View 7Z85UKMI"
					directory: "7Z85UKMI"
					camera: null
					aspectRatio: 1.3333333333333333
					mask: null # image file name of mask -- mask.png
					pictures:
						-
							file: "100.png"
							width: 504
							height: 378
							scale: 1
						...
					features:
						file: "features.yaml"	# found features (location / affine) for image
					summary:
						file: "summary.yaml"	# color histogram, individual feature details list [flat, grad, hist]
		views/
			VIEW-ID/
				features.yaml 			all possible feature points w/ score
					# ?
				pictures/
					100.png
					50.png
					25.png
					12.5.png

		cameras/
			CAMERA-ID/
				info.yaml 				computed intrinsic properties (K & distortion)
							K: 0,1,2, 3,4,5, 6,7,8
								fx
								fy
								s
								cx
								cy
							p: 1 2 3
								p1
								p2
								p3
							t: 1 2 3
								t1
								t2
							images:
								id: .
								file: .
								width: .
								height: .
								scale: .
								points: bla.yaml
							bla.yaml:
								matches:
									x: .
									y: .
									X: .
									Y: .
									Z: .
				pictures/
					0.png
					1.png
					...
				matches/
					matchA.yaml
							matches:
								2D:
									x
									y
								3D:
									x
									y
									z
		sparse.yaml
			...
			pairs:
				-
					directory: "KF398BC7"
					viewA: "2DWWPMNZ"
					viewB: "914UQJ51"
					featureCount: 42		# 2D match count
					relativeCount: 29683	# 3D match count
					F: # MATRIX
					R: # MATRIX
					errorFMean: #
					errorFSigma: #
					errorRMean: #
					errorRSigma: #
				...
			triples:
				-
					directory: "KF398BC7"
					viewA: "2DWWPMNZ"
					viewB: "914UQJ51"
					viewC: "CCCCCCCC"
					relativeCount: 29683	# 3D match count
					T: # MATRIX
					errorTMean: #
					errorTSigma: #

					gauge: # - relative scalings between separate pairs -- coordinate system gauge
						AB: 1.0		# ABS SCALE
						AC: 2.2		# ABS SCALE
						BC: 1.1		# ABS SCALE
					# ?
						F-DATA HERE
						R-DATA HERE
				...

		sparse/
			pairs/
				0/
					matches.yaml 			x,y,z,t[,u,v] <=> ; F [initial feature matching]
					relative.yaml 			relative orientation of camera views w/ matches / triangulated points -- medium/high density
						P: (4x4 matrix)
						cellSizeA: 5 		 [start at whatever size ~ 20x20 cells (odd) => 3 pixels]
						cellSizeB: 7
						points:
							a: x,y
							b: x,y
							3D: X,Y,Z
					tracks.yaml 				optimum seed track points [best points]
						views:
							-
								id: "A"
							...
						tracks:
							-
								p:
									v: INDEX-OF-VIEW
									x: [0-1]
									y: [0-1]
							...

			triples/tuples
				0/
					info.yaml 			x,y <=> pixel matches among 3 views
						cameras:
							... # camera data used
						views:
							-
								id: # CAMERA ID
								camera: "0" # INDEX TO CAMERAS
								imageSize:	# SIZE OF IMAGE USED
									x: 504
									y: 378
								cellSize: 3 # SIZE OF CELLS USED
								transform: ABS TRANSFORM

						transforms: # data on view transforms (1:1 parallel array to views) -- SAME AS PAIR
							-
								matches: 21857
								errorRMean: 0.00000103378302308721
								errorRSigma: 0.3029725132265945
								errorFMean: 0.0000018490823274523024
								errorFSigma: 0.24309154400461266
								errorNCCMean: 0.002385297852253665
								errorNCCSigma: 0.1671777117177186
								errorSADMean: 0.004033203176232317
								errorSADSigma: 0.06777955317617489
						points:
							-
								SAME AS PAIR


		bundle/
A			graph.yaml - view graph of scene - result of global (quasi-local) bundle adjustment iterations on TRACK POINTS -- initialized using PAIR TRANSFORMS & TRIPLE SCALES
				- views
					-
						id: view ID
						T: MATRIX ABSOLUTE TRANSFORM
				- graph
					-
						A: INDEX-OF-VIEW
						B: INDEX-OF-VIEW
				- skeleton --- basic/compressed/critical/backbone/skeletal/central graph
					-
						A: INDEX-OF-VIEW
						B: INDEX-OF-VIEW
				- points:
					v:
						-
							i: INDEX-OF-VIEW
							x: [0,1]
							y: [0,1]
												# THE POINTS ARE BUILD UP VIA 3-WAY ADDITION INITIAL .. MIGHT NOT NEED THSE
						X: # position
						Y:
						Z:
						x: # normal
						y:
						z:
						s: # size
# IS THIS NEEDED? .. just keep tracks in graph ...
B			tracks.yaml - accumulated global track points across images: grows till all pair-seeds are merged
				tracks:
					-
						v:
							-
								i: INDEX-OF-VIEW
								x: [0,1]
								y: [0,1]

C			sparse.yaml -
				global 3D point list - sparse TRACK Data
				sparse point reconstruction info

				cameras:
					-
						id: ID
						fx:
						fy:
						s:
						cx:
						cy:
				views:
					-
						id: ID
						camera: K index
						transform: ABS TRANSFORM
						points: count of all 3D points that project to this view == 2D point count
						errorR: avg reprojection error [over all P3D that project to view]
						deltaErrorR: null / change since last
						updated: timestamp for last update
					...
				pairs:
					-
						A: index
						B: index
						- total/change in 3-way points?
						errorF: avg f error
						errorP: avg 3D reprojection error (for both 2-way 3D matched points)
						deltaErrorF: null / change since last
						deltaErrorP: null / change since last
						updated: timestamp for last update
					... [MIGHT NEED TO ADD NEW PAIRS ON THE FLY?]
				points:
					-
						X: position
						Y
						Z
						x: normal
						y
						z
						s: size (patch - world scale)
						v:
							-
								i: VIEW INDEX
								x: [0-1]
								y: [0-1]
					...

D			dense.yaml - global 3D point list -- SPARSE COPY WITH CURRENT TRACKS KEPT
				cameras:
					...
				views:
					...
				points:			SPARSE POINTS
					...

D			dense/PAIR/dense.yaml - pair optimized dense points with patches
				points:
					...



E			points.yaml - dense point reconstruction info
				?cameras:
					...
				?views:
					...
				points:
					...
				ACCUMULATED DENSE POINTS



			bundle.yaml
						-- same but 'saved state'
			
			views.yaml
				- just final views
			surface.yaml
				- just final points + normals [no view data]


E			triangles.yaml - triangle reconstruction - triangle soup of approximated surface & texture mapping
				views:
					- ...
				vertexes:
					-
						X: ...
						Y: ...
						Z: ...
				uvs:
					-
						x:
						y:
				triangles:
					-
						A:
							i: # vertex index
							u: # uv index
							v: # view index
						B:
							i:
							u:
							v:
						C:
							i:
							u:
							v:
						t: # texture atlas index
					...
				textures:
					-
						id: "0"
						file: tex0.png
						width: 512
						height: 512

				packing:
					views: # list of views yet to load - pop off when done
						- index in list to load



		scene/
			0/
				info.yaml 														# scene info [cameras, background, model(if altered)]
					cameras:													# copied
						-
							id: ID
							K: fx,fy,s,cx,cy
						...
					views: 														# copied - actual real-world picture image source
						-
							camera: camera index / ID
							transform: ABS TRANS
							preview: image0.png									# preview sized image for visualizing ~ 178x100
						...
					vantages: 													# user-created scene views
						-
							K: fx,fy,s,cx,cy
							transform: ABS TRANS
						...
					snapshots: 													# user-created photos of scene
						-
							id: ID
							name: My Screenshot
							file: snapshot0.png
						...
				surface.yaml													# initially a copy of triangles.yaml
				textures.yaml													# initially a copy of textures.yaml
				textures/
					tex0.png
				snapshots/
					snapshot0.png
				views/
					view0.png





			- format of triangle / texture files

			textures
				-
					- id: "0123"
					- file: "tex_0123.png"
					- width: 1024
					- height: 1024
				- ...

			triangles:
				-
					- t:
					- A
						- i # vertex index
						- x # [0-1]
						- y # [0-1]
					- B
						- ...
					- C
						- ...





	*/
App3DR.ProjectManager = function(relativePath, operatingStage, readyFxn){ // very async heavy
	App3DR.ProjectManager._.constructor.call(this);
	// this._operation = App3DR.ProjectManager.OPERATION_UNKNOWN;
	this._operationQueue = [];
	var timestampNow = Code.getTimeStampFromMilliseconds();
	this._titleName = "New Project "+Code.getHumanReadableDateString(timestampNow);
	this._createdTimestamp = timestampNow;
	this._modifiedTimestamp = timestampNow;
	this._workingPath = relativePath;
	this._clientFile = new ClientFile();
	this._clientFile.addFunction(ClientFile.EVENT_GET_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_SET_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_DEL_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_MOV_COMPLETE, this._handleFileClientComplete, this);
	this._views = [];
	// this._pairs = [];
	// this._triples = [];
	this._viewSimilarity = [];
	this._pairPutative = [];

	this._densePutative = [];

	this._cameras = [];
	this._scenes = [];
	
	// reconstruction related:
	this._graphFilename = null;
		this._graphData = null;
	this._tracksFilename = null;
		this._tracksData = null;
	this._trackCount = null;

	this._sparseFilename = null;
		this._sparseData = null;
	this._sparseCount = null;

	this._denseFilename = null;
	this._denseCount = null;

	// this._pointsFilename = null;
	// this._pointsCount = null;
	// this._pointData = null;

	// this._bundledFilename = null;
	// this._bundledCount = null;
	// this._bundledData = null;

	// this is a debugging parameter:
	this._bundleFilename = null;
	this._bundleData = null;
	this._bundleCount = null;

	this._surfaceFilename = null;
	this._surfaceData = null;
	this._surfaceCount = null;

	// this._textureCount = null;
	// this._triangleData = null;



	this._scenes = [];
	this._currentSceneID = null;


	// this._sparseInfo = null;
	// this._sparsePoints = null;
	// this._denseInfo = null;
	// this._densePoints = null;

	// this._packing = null;
	// this._packingCount = null;
	// this._textures = null;
	// this._textureCount = null;
	// this._packing = null;


	// operations related
	this._loading = true;
	this._stage = operatingStage;
	this._ticker = new Ticker();
	this._isBackgroundTasks = false;
	this.loadProjectFile(readyFxn);
}
Code.inheritClass(App3DR.ProjectManager,Dispatchable);

App3DR.ProjectManager.EVENT_LOADED = "pm.loaded";


App3DR.ProjectManager.INFO_FILE_NAME = "info.yaml";
App3DR.ProjectManager.FEATURES_FILE_NAME = "features.yaml";
App3DR.ProjectManager.VIEWS_DIRECTORY = "views";
App3DR.ProjectManager.PICTURES_DIRECTORY = "pictures";
App3DR.ProjectManager.PICTURE_MASK_FILE_NAME = "mask.png";
App3DR.ProjectManager.CAMERAS_DIRECTORY = "cameras";
	App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME = "matches.yaml";
App3DR.ProjectManager.PAIRS_DIRECTORY = "pairs";
	App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME = "matches.yaml"; // points
	App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME = "relative.yaml";
	App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME = "tracks.yaml";
App3DR.ProjectManager.TRIPLES_DIRECTORY = "triples";
	// App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME = "matches.yaml"; // points
	App3DR.ProjectManager.TRIPLE_RELATIVE_FILE_NAME = "relative.yaml"; // 3D


App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY = "bundle";
	App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME = "info.yaml"; // TBD

// TODO:
App3DR.ProjectManager.RECONSTRUCT_DIRECTORY = "reconstruct";
App3DR.ProjectManager.RECONSTRUCT_TRACKS_FILE_NAME = "tracks.yaml";
App3DR.ProjectManager.RECONSTRUCT_GRAPH_FILE_NAME = "graph.yaml";
App3DR.ProjectManager.RECONSTRUCT_TEXTURES_DIRECTORY = "textures";
// App3DR.ProjectManager.BUNDLE_SPARSE_POINTS_FILE_NAME = "points_sparse.yaml";
// App3DR.ProjectManager.BUNDLE_SPARSE_INFO_FILE_NAME = "info_sparse.yaml";
// App3DR.ProjectManager.BUNDLE_DENSE_POINTS_FILE_NAME = "points_dense.yaml";
App3DR.ProjectManager.BUNDLE_SPARSE_DIRECTORY = "sparse";
App3DR.ProjectManager.BUNDLE_SPARSE_FILE_NAME = "sparse.yaml";

App3DR.ProjectManager.BUNDLE_DENSE_DIRECTORY = "dense";
App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME = "dense.yaml";


// App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME = "dense.yaml";
App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY = "dense";
App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME = "dense.yaml";
App3DR.ProjectManager.RECONSTRUCT_POINTS_FILE_NAME = "points.yaml"; // result of compiled points.yaml
// App3DR.ProjectManager.RECONSTRUCT_BUNDLE_FILE_NAME = "bundled.yaml";
// DEBUG FILE:
App3DR.ProjectManager.RECONSTRUCT_BUNDLE_FILE_NAME = "bundle.yaml"; // cams, views & P3D+NRM absolutes
// App3DR.ProjectManager.RECONSTRUCT_ABSOLUTE_FILE_NAME = "absolute.yaml"; //
App3DR.ProjectManager.RECONSTRUCT_TRIANGLES_FILE_NAME = "triangles.yaml";

// App3DR.ProjectManager.BUNDLE_DENSE_INFO_FILE_NAME = "info_dense.yaml";
// App3DR.ProjectManager.SPARSE_MATCHES_FILE_NAME = "sparse.yaml"; // sparse points + transform
// App3DR.ProjectManager.MEDIUM_MATCHES_FILE_NAME = "medium.yaml";
// App3DR.ProjectManager.DENSE_MATCHES_FILE_NAME = "dense.yaml";
App3DR.ProjectManager.TRIPLES_DIRECTORY = "triples";

App3DR.ProjectManager.prototype.isLoaded = function(){
	return !this._loading;
}
App3DR.ProjectManager.prototype.views = function(){
	return this._views;
}
// App3DR.ProjectManager.prototype.pairs = function(){
// 	return this._pairs;
// }
// App3DR.ProjectManager.prototype.allPairsWithViewID = function(viewID){
// 	var matching = [];
// 	var pairs = this._pairs;
// 	for(var i=0; i<pairs.length; ++i){
// 		var pair = pairs[i];
// 		var viewA = pair.viewA();
// 		var viewB = pair.viewB();
// 		var idA = viewA.id();
// 		var idB = viewB.id();
// 		if(idA==viewID || idB==viewID){
// 			matching.push(pair);
// 		}
// 	}
// 	return matching;
// }
// App3DR.ProjectManager.prototype.pairFromViewIDs = function(viewAID,viewBID){
// 	var pairs = this._pairs;
// 	for(var i=0; i<pairs.length; ++i){
// 		var pair = pairs[i];
// 		var viewA = pair.viewA();
// 		var viewB = pair.viewB();
// 		var idA = viewA.id();
// 		var idB = viewB.id();
// 		if( (idA==viewAID && idB==viewBID) || (idA==viewBID && idB==viewAID) ){
// 			return pair;
// 		}
// 	}
// 	return null;
// }
// App3DR.ProjectManager.prototype.triples = function(){
// 	return this._triples;
// }
App3DR.ProjectManager.prototype.cameras = function(){
	throw "dont use these"
	return this._cameras;
}
// App3DR.ProjectManager.prototype.hasGraph = function(){
// 	return this._graphFilename != null;
// }
// App3DR.ProjectManager.prototype.graphFilename = function(){
// 	return this._graphFilename;
// }
// App3DR.ProjectManager.prototype.setGraphFilename = function(graph){
// 	this._graphFilename = graph;
// }
// App3DR.ProjectManager.prototype.graphData = function(){
// 	return this._graphData;
// }
// App3DR.ProjectManager.prototype.tracksDone = function(){
// 	return this._trackCount != null;
// }
// App3DR.ProjectManager.prototype.tracksFilename = function(){
// 	return this._tracksFilename;
// }
// App3DR.ProjectManager.prototype.setTracksFilename = function(track){
// 	this._tracksFilename = track;
// }
// App3DR.ProjectManager.prototype.tracksData = function(){
// 	return this._tracksData;
// }
// App3DR.ProjectManager.prototype.setTrackCount = function(count){
// 	this._trackCount = count;
// }

App3DR.ProjectManager.prototype.sparseFilename = function(){
	return this._sparseFilename;
}
App3DR.ProjectManager.prototype.setSparseFilename = function(sparse){
	this._sparseFilename = sparse;
}
App3DR.ProjectManager.prototype.sparseData = function(){
	return this._sparseData;
}
App3DR.ProjectManager.prototype.setSparseCount = function(count){
	this._sparseCount = count;
}
App3DR.ProjectManager.prototype.sparseCount = function(count){
	return this._sparseCount;
}
App3DR.ProjectManager.prototype.sparseDone = function(){
	return this._sparseCount != null;
}

App3DR.ProjectManager.prototype.denseFilename = function(){
	return this._denseFilename;
}
App3DR.ProjectManager.prototype.setDenseFilename = function(dense){
	this._denseFilename = dense;
}
App3DR.ProjectManager.prototype.denseData = function(){
	return this._denseData;
}
App3DR.ProjectManager.prototype.setDenseCount = function(count){
	this._denseCount = count;
}
App3DR.ProjectManager.prototype.denseCount = function(count){
	return this._denseCount;
}
App3DR.ProjectManager.prototype.denseDone = function(){
	return this._denseCount != null;
}

App3DR.ProjectManager.prototype.bundleData = function(){
	return this._bundleData;
}
App3DR.ProjectManager.prototype.setBundleCount = function(count){
	this._bundleCount = count;
}
App3DR.ProjectManager.prototype.bundleCount = function(count){
	return this._bundleCount;
}
App3DR.ProjectManager.prototype.bundleDone = function(){
	return this._bundleCount != null;
}




App3DR.ProjectManager.prototype.pointsFilename = function(){
	return this._pointsFilename;
}
App3DR.ProjectManager.prototype.setPointsFilename = function(points){
	this._pointsFilename = points;
}
App3DR.ProjectManager.prototype.pointsData = function(){
	return this._pointsData;
}
App3DR.ProjectManager.prototype.setPointsCount = function(count){
	this._pointsCount = count;
}
App3DR.ProjectManager.prototype.pointsDone = function(){
	return this._pointsCount != null;
}


App3DR.ProjectManager.prototype.bundledFilename = function(){
	return this._bundledFilename;
}
App3DR.ProjectManager.prototype.setBundledFilename = function(bundled){
	this._bundledFilename = bundled;
}
App3DR.ProjectManager.prototype.bundledData = function(){
	return this._bundledData;
}
App3DR.ProjectManager.prototype.setBundledCount = function(count){
	this._bundledCount = count;
}
App3DR.ProjectManager.prototype.bundledDone = function(){
	return this._bundledCount != null;
}



App3DR.ProjectManager.prototype.triangulationDone = function(){
	return this._triangleCount != null;
}
App3DR.ProjectManager.prototype.setTriangleCount = function(count){
	this._triangleCount = count;
}
App3DR.ProjectManager.prototype.triangleCount = function(count){
	return this._triangleCount;
}
App3DR.ProjectManager.prototype.triangleFilename = function(){
	return this._triangleFilename;
}
App3DR.ProjectManager.prototype.setTriangleFilename = function(tris){
	this._triangleFilename = tris;
}



App3DR.ProjectManager.prototype.texturingDone = function(){
	return this._textureCount != null;
}
App3DR.ProjectManager.prototype.texturingPackingDone = function(){
	return this._textureCount != null && this._textureCount >= 0;
}
App3DR.ProjectManager.prototype.setTextureCount = function(count){
	this._textureCount = count;
}
App3DR.ProjectManager.prototype.textureCount = function(count){
	return this._textureCount;
}

App3DR.ProjectManager.prototype.currentSceneID = function(){
	return this._currentSceneID;
}
App3DR.ProjectManager.prototype.setCurrentSceneID = function(scene){
	this._currentSceneID = scene;
}
App3DR.ProjectManager.prototype.setScenes = function(scenes){
	this._scenes = scenes;
}
App3DR.ProjectManager.prototype.sceneFromID = function(sceneID){
	if(sceneID){
		var scenes = this._scenes;
		for(var i=0; i<scenes.length; ++i){
			var scene = scene[i];
			if(scene.id()==sceneID){
				return scene;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.testFilename = function(file){
	if(file!==undefined){
		this._testFilename = file;
	}
	return this._testFilename;
}
App3DR.ProjectManager.prototype.bundleFilename = function(file){
	if(file!==undefined){
		this._bundleFilename = file;
	}
	return this._bundleFilename;
}
App3DR.ProjectManager.prototype.infoPath = function(){
	var infoPath = Code.appendToPath(this._workingPath,App3DR.ProjectManager.INFO_FILE_NAME);
	console.log("infoPath: '"+infoPath+"'");
	return infoPath;
}

App3DR.ProjectManager.prototype.addOperation = function(operation, param, callback, context, object){
	var operation = {"operation":operation, "param":param, "callback":callback, "context":context, "object":object};
	this._operationQueue.push(operation);
	this.checkOperations();
}
App3DR.ProjectManager.prototype._handleFileClientComplete = function(data){
	// console.log("_handleFileClientComplete");
	// console.log(data);
	var operation = this._operation;
	this._operation = null;
	// console.log(operation);
	if(operation){
		var object = operation["object"];
		var callback = operation["callback"];
		var context = operation["context"];
		callback.call(context, object, data);
	}
	this.checkOperations();
}
App3DR.ProjectManager.prototype.checkOperations = function(){
	if(this._operation){
		return;
	}
	if(this._operationQueue.length==0){
		return;
	}
	var operation = this._operationQueue.shift();
	var op = operation["operation"];
	var param = operation["param"];
		var path = param["path"];
		var data = param["data"];
// console.log(" "+path+" ... ");
	if(op=="GET"){
		this._clientFile.get(path);
	}else if(op=="SET"){
		this._clientFile.set(path,data);
	}else if(op=="DEL"){
		this._clientFile.del(path);
	}else{
		console.log("not implemented");
	}
	this._operation = operation;
}

App3DR.ProjectManager.prototype._loadProjectCallback = function(object, data){
	if(data){
		var str = Code.binaryToString(data);
		var yaml = YAML.parse(str);
		this.setFromYAML(yaml);
		var callback = object["callback"];
		if(callback){
			callback();
		}
	}else{
		console.log("no data, save file");
		this.saveProjectFile();
	}
	this._loading = false;
	this.alertAll(App3DR.ProjectManager.EVENT_LOADED, this);
}
App3DR.ProjectManager.prototype._saveProjectCallback = function(object, data){
	console.log(object);
	if(object){
		var callback = object["callback"];
		if(callback){
			callback(this);
		}
	}
	console.log(data);
	console.log("saved");
}

App3DR.ProjectManager.prototype.setFromYAML = function(object){
	var i, len;
	console.log("from yaml: ");
	console.log(object);
	if(Code.isArray(object)){
		object = object[0];
		console.log(object);
	}
	var title = object["title"];
	var created = object["created"];
	var modified = object["modified"];
	var views = object["views"];
	// var pairs = object["pairs"];
	// var triples = object["triples"];

	var similars = object["viewSimilarity"];
	var putatives = object["pairPutative"];


	var cameras = object["cameras"];
	var test = object["test"];


	// UPDATE:

	var graph = object["graph"];
	var tracks = object["tracks"];
	var trackCount = object["trackCount"];
	var sparse = object["sparse"];
	var sparseCount = object["sparseCount"];
	var dense = object["dense"];
	var denseCount = object["denseCount"];
	var bundleCount = object["bundleCount"];
	var bundle = object["bundle"];
	var surfaceCount = object["surfaceCount"];
	var surface = object["surface"];
	// var pointsCount = object["pointsCount"];
	// var points = object["points"];


	// var textureCount = object["textureCount"];
	// var triangleCount = object["triangleCount"];
	// var triangles = object["triangles"];
	var scenes = object["scenes"];
	// var currentSceneID = object["currentSceneID"];

	var timestamp = Code.getTimeStampFromMilliseconds();

	this._titleName = Code.valueOrDefault(title,"title");
	this._createdTimestamp = Code.valueOrDefault(created,timestamp);
	this._modifiedTimestamp = Code.valueOrDefault(modified,timestamp);
	this._views = [];
	if(views){
		len = views.length;
		for(i=0; i<len; ++i){
			var v = views[i];
			var view = new App3DR.ProjectManager.View(this);
			view.readFromObject(v);
			this._views.push(view);
		}
	}
	// this._pairs = [];
	// if(pairs){
	// 	len = pairs.length;
	// 	for(i=0; i<len; ++i){
	// 		var p = pairs[i];
	// 		var pair = new App3DR.ProjectManager.Pair(this);
	// 		pair.readFromObject(p);
	// 		this._pairs.push(pair);
	// 	}
	// }
	// this._triples = [];
	// if(triples){
	// 	len = triples.length;
	// 	for(i=0; i<len; ++i){
	// 		var t = triples[i];
	// 		var triple = new App3DR.ProjectManager.Triple(this);
	// 		triple.readFromObject(t);
	// 		this._triples.push(triple);
	// 	}
	// }
	this._viewSimilarity = similars;
	this._pairPutative = putatives;
	// this._pairPutative = putatives;

	this._cameras = [];
	if(cameras){
		len = cameras.length;
		for(i=0; i<len; ++i){
			var c = cameras[i];
			var camera = new App3DR.ProjectManager.Camera(this);
			camera.readFromObject(c);
			this._cameras.push(camera);
		}
	}
	this._testFilename = test ? test : null;
	// this._graphFilename = Code.valueOrDefault(graph, null);
	// this._tracksFilename = Code.valueOrDefault(tracks, null);
	
	
	// this._trackCount = Code.valueOrDefault(trackCount, null);
	this._sparseFilename = Code.valueOrDefault(sparse, null);
	this._sparseCount = Code.valueOrDefault(sparseCount, null);

	this._denseFilename = Code.valueOrDefault(dense, null);
	this._denseCount = Code.valueOrDefault(denseCount, null);

	this._bundleFilename = Code.valueOrDefault(bundle, null);
	this._bundleCount = Code.valueOrDefault(bundleCount, null);

	this._surfaceFilename = Code.valueOrDefault(surface, null);
	this._surfaceCount = Code.valueOrDefault(surfaceCount, null);


	// this._pointsFilename = Code.valueOrDefault(points, null);
	// this._pointsCount = Code.valueOrDefault(pointsCount, null);

	

	// this._triangleFilename = Code.valueOrDefault(triangles, null);
	// this._triangleCount = Code.valueOrDefault(triangleCount, null);
	// this._textureCount = Code.valueOrDefault(textureCount, null);
	// this._currentSceneID = Code.valueOrDefault(currentSceneID, null);
	this._scenes = [];
	if(scenes){
		len = scenes.length;
		for(i=0; i<len; ++i){
			throw "READ SCENE";
			var s = scenes[i];
			var scene = new App3DR.ProjectManager.Scene(this);
			scenes.readFromObject(c);
			this._scenes.push(scene);
		}
	}
}
App3DR.ProjectManager.prototype.toYAML = function(){
	var modified = Code.getTimeStampFromMilliseconds();
	this._modifiedTimestamp = modified;
	var i, len;
	var yaml = new YAML();
	yaml.writeComment("3DR Project File 0");
	yaml.writeBlank();
	yaml.writeString("title", this._titleName);
	yaml.writeString("created", this._createdTimestamp);
	yaml.writeString("modified", this._modifiedTimestamp);
	yaml.writeBlank();
	// views
	len = this._views ? this._views.length : 0;
	if(len>0){
		yaml.writeArrayStart("views");
		for(i=0; i<len; ++i){
			var view = this._views[i];
			yaml.writeObjectStart();
				view.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
		yaml.writeBlank();
	}
	
	// // pairs
	// len = this._pairs ? this._pairs.length : 0;
	// if(len>0){
	// 	yaml.writeArrayStart("pairs");
	// 	for(i=0; i<len; ++i){
	// 		var pair = this._pairs[i];
	// 		yaml.writeObjectStart();
	// 			pair.toYAML(yaml);
	// 		yaml.writeObjectEnd();
	// 	}
	// 	yaml.writeArrayEnd();
	// }
	// yaml.writeBlank();
	// // triples
	// len = this._triples ? this._triples.length : 0;
	// if(len>0){
	// 	yaml.writeArrayStart("triples");
	// 	for(i=0; i<len; ++i){
	// 		var triple = this._triples[i];
	// 		yaml.writeObjectStart();
	// 			triple.toYAML(yaml);
	// 		yaml.writeObjectEnd();
	// 	}
	// 	yaml.writeArrayEnd();
	// }
	// yaml.writeBlank();
	

	var similars = this._viewSimilarity; //  object[""];
	len = similars ? similars.length : 0;
	if(len>0){
		// yaml.writeObjectLiteral("viewSimilarity", similars);
		yaml.writeArrayLiteral("viewSimilarity", similars);
		yaml.writeBlank();
	}

	var putatives = this._pairPutative;
	len = putatives ? putatives.length : 0;
	if(len>0){
		yaml.writeArrayLiteral("pairPutative", putatives);
		yaml.writeBlank();
	}
	
	// cameras
	len = this._cameras ? this._cameras.length : 0;
	if(len>0){
		yaml.writeArrayStart("cameras");
		for(i=0; i<len; ++i){
			var camera = this._cameras[i];
			console.log(camera);
			yaml.writeObjectStart();
				camera.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
		yaml.writeBlank();
	}
	

	// sparse
	yaml.writeString("sparse",this._sparseFilename);
	yaml.writeNumber("sparseCount",this._sparseCount);
	yaml.writeBlank();

	// dense
	yaml.writeString("dense",this._denseFilename);
	yaml.writeNumber("denseCount",this._denseCount);
	yaml.writeBlank();

	yaml.writeString("bundle",this._bundleFilename);
	yaml.writeNumber("bundleCount",this._bundleCount);
	yaml.writeBlank();

	yaml.writeString("surface",this._surfaceFilename);
	yaml.writeNumber("surfaceCount",this._surfaceCount);
	yaml.writeBlank();

/*
	// dense
	yaml.writeString("dense",this._denseFilename);
	yaml.writeNumber("denseCount",this._denseCount);
	yaml.writeBlank();
	// points
	yaml.writeString("points",this._pointsFilename);
	yaml.writeNumber("pointsCount",this._pointsCount);
	yaml.writeBlank();
	// bundled
	yaml.writeString("bundled",this._bundledFilename);
	yaml.writeNumber("bundledCount",this._bundledCount);
	yaml.writeBlank();
	// triangles
	yaml.writeString("triangles",this._triangleFilename);
	yaml.writeNumber("triangleCount",this._triangleCount);
	yaml.writeNumber("textureCount",this._textureCount);
	yaml.writeBlank();

	// scene
	yaml.writeString("currentSceneID",this._currentSceneID);
	len = this._scenes ? this._scenes.length : 0;
	if(len>0){
		yaml.writeArrayStart("scenes");
		for(i=0; i<len; ++i){
			var scene = this._scenes[i];
			yaml.writeString("SCENE","?");
		}
		yaml.writeArrayEnd();
	}

	// legacy - testing
	yaml.writeString("bundle",this._bundleFilename);
	yaml.writeBlank();
	
	*/
	yaml.writeString("test",this._testFilename);
	
	yaml.writeBlank();

	var str = yaml.toString();
	return str;
}

App3DR.ProjectManager.prototype.loadDataFromFile = function(filename, callbackFxn, callbackCxt, callbackObj){
	var path = Code.appendToPath(this._workingPath, filename);
	this.addOperation("GET", {"path":path}, this._loadDataFromFileCallback, this, {"fxn":callbackFxn,"cxt":callbackCxt,"obj":callbackObj});
}
App3DR.ProjectManager.prototype._loadDataFromFileCallback = function(object, data){
	var callbackFxn = null;
	var callbackCxt = null;
	var callbackObj = null;
	callbackFxn = object["fxn"];
	callbackCxt = object["cxt"];
	callbackObj = object["obj"];
	if(data){
		var str = Code.binaryToString(data);
		var yaml = YAML.parse(str);
		if(Code.isArray(yaml)){
			yaml = yaml[0];
		}
	}
	if(callbackFxn){
			callbackFxn.call(callbackCxt, yaml, callbackObj);
		}
}


App3DR.ProjectManager.prototype.loadBinaryFromFile = function(filename, callbackFxn, callbackCxt, callbackObj){
	var path = Code.appendToPath(this._workingPath, filename);
	this.addOperation("GET", {"path":path}, this._loadBinaryFromFileCallback, this, {"fxn":callbackFxn,"cxt":callbackCxt,"obj":callbackObj});
}
App3DR.ProjectManager.prototype._loadBinaryFromFileCallback = function(object, data){
	if(data){
		var callbackFxn = object["fxn"];
		var callbackCxt = object["cxt"];
		var callbackObj = object["obj"];
		// var str = Code.binaryToString(data);
		// console.log(str);
		if(callbackFxn){
			callbackFxn.call(callbackCxt, data, callbackObj);
		}
	}
}



App3DR.ProjectManager.prototype.loadProjectFile = function(readyFxn){
	console.log("loadProjectFile");
	this._loading = true;
	this._operation = App3DR.ProjectManager.OPERATION_LOAD_PROJECT;
	this.addOperation("GET", {"path":this.infoPath(),"data":null}, this._loadProjectCallback, this, {"callback":readyFxn} );
}
App3DR.ProjectManager.prototype.saveProjectFile = function(callbackFxn){
	console.log("saveProjectFile");
	this._operation = App3DR.ProjectManager.OPERATION_SAVE_PROJECT;
	var str = this.toYAML();
	var binary = Code.stringToBinary(str);
	this.addOperation("SET", {"path":this.infoPath(),"data":binary}, this._saveProjectCallback, this, {"callback":callbackFxn});
}


App3DR.ProjectManager.ID_LENGTH = 8;
App3DR.ProjectManager._randomID = function(){
	return Code.randomID(App3DR.ProjectManager.ID_LENGTH);
}
App3DR.ProjectManager.prototype._uniqueViewID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._views, function(v){ return v.id(); } );
}
App3DR.ProjectManager.prototype._uniquePairID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._pairs, function(p){ return p.id(); } );
}
App3DR.ProjectManager.prototype._uniqueTripleID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._triples, function(p){ return p.id(); } );
}
App3DR.ProjectManager.prototype._uniqueCameraID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._cameras, function(c){ return c.id(); } );
}
App3DR.ProjectManager._uniqueArrayItemID = function(array, fxn){
	var i, len = array.length;
	var duplicate = true;
	while(duplicate){
		var randomID = App3DR.ProjectManager._randomID();
		duplicate = false;
		for(i=0; i<len; ++i){
			var itemID = fxn(array[i]);
			if(itemID==randomID){
				duplicate = true;
				break;
			}
		}
	}
	return randomID;
}
App3DR.ProjectManager.prototype.addView = function(callback, context){
	console.log("addView");
	console.log(this._views);
	var nextIndex = this._views.length;
	var viewID = this._uniqueViewID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, viewID);
	var view = new App3DR.ProjectManager.View(this, "New View "+viewID, viewID);
	this._views.push(view);
	this.addOperation("SET", {"path":path}, callback, context, view);
}
App3DR.ProjectManager.prototype.removeView = function(view, callback, context){
	var i, v, len = this._views.length;
	var foundView = -1;
	for(i=0; i<len; i++){
		v = this._views[i];
		if(v==view){
			foundView = i;
			break;
		}
	}
	if(foundView>=0){
		console.log("removeView ... ");
		Code.removeElementAt(this._views,foundView);
		view.unload();
		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.id());
		var object = {"view":view, };
		this.addOperation("DEL", {"path":path}, callback, context, object);
		this.saveProjectFile();
		return true;
	}
	return false;
}
App3DR.ProjectManager.prototype.addPictureForView = function(view, filename, size, scale, binary, callback, context, object){
	console.log("doing");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.saveFeaturesForView = function(view, features, filename, callback, context, object){
	console.log("saveFeaturesForView");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.id(), filename);
	console.log(path);
	if(features){
		var str = this._featuresToYAML(features);
		var binary = Code.stringToBinary(str);
		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
	}else{
		this.addOperation("DEL", {"path":path}, callback, context, object);
	}
}
App3DR.ProjectManager.prototype.loadFeaturesForView = function(view, filename, callback, context, object){
	console.log("loadFeaturesForView");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.id(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}

// App3DR.ProjectManager.prototype.hasBundleInit = function(){
// 	throw "?";
// 	return this._bundleFilename !== null;
// }
// App3DR.ProjectManager.prototype.loadBundleAdjust = function(callback, context, object){
// 	throw "?";
// 	var filename = this._bundleFilename;
// 	// filename = "info.yaml";
// 	console.log("loadBundleAdjust: "+filename);
// 	if(filename){
// 		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, filename);
// 		console.log(path);
// 		this.addOperation("GET", {"path":path}, callback, context, object);
// 	}
// }
// App3DR.ProjectManager.prototype.saveBundleAdjust = function(string, callback, context, object){
// 	console.log("saveBundleAdjust");
// 	throw "?";
// 	var filename = this._bundleFilename;

// 	if(filename){
// 		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, filename);
// 		console.log(path);
// 		var binary = Code.stringToBinary(string);
// 		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
// 	}
// }

App3DR.ProjectManager.prototype.savePairRelative = function(pair, string, callback, context, object){
	console.log("savePairRelative: "+pair.id());
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME);
	console.log(path+" ... ");
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, pair);
}

App3DR.ProjectManager.prototype.savePairTracks = function(pair, string, callback, context, object){
	console.log("savePairTracks: "+pair.id());
	console.log(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME)
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, pair);
}
App3DR.ProjectManager.prototype.pair = function(idA,idB){
	var pairs = this._pairs;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		if(pair.isPair(idA,idB)){
			return pair;
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.triple = function(idA,idB,idC){
	var triples = this._triples;
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		if(triple.isTriple(idA,idB,idC)){
			return triple;
		}
	}
	return null;
}

App3DR.ProjectManager.prototype.addPair = function(viewA, viewB, callback, context){
	console.log("addPair");
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var directory = this._uniquePairID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, directory);
	var pair = new App3DR.ProjectManager.Pair(this, directory, viewAID, viewBID);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["pair"] = pair;
	this.addOperation("SET", {"path":path}, this._addPairComplete, this, object);
	return pair;
}
App3DR.ProjectManager.prototype._addPairComplete = function(object, data){
	console.log("_addPairComplete");
	var callback = object["callback"];
	var context = object["context"];
	var pair = object["pair"];
	this._pairs.push(pair);
	this.saveProjectFile();
	callback.call(context, pair);
}

App3DR.ProjectManager.prototype.loadMatchingDataForPair = function(pair, filename, callback, context, object){
	console.log("loadMatchingDataForPair");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadRelativeDataForPair = function(pair, filename, callback, context, object){
	console.log("loadRelativeDataForPair");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}

App3DR.ProjectManager.prototype.loadDenseDataForPairID = function(pairID, callback, context, object){
	console.log("loadRelativeDataForPair");
	var path = this.densePairPathFromID(pairID);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadMatchingDataForTriple = function(triple, filename, callback, context, object){
	console.log("loadMatchingDataForTriple");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}



App3DR.ProjectManager.prototype.addTriple = function(viewA, viewB, viewC, callback, context){
	console.log("addTriple");
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var viewCID = viewC.id();
	var directory = this._uniqueTripleID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, directory);
	var triple = new App3DR.ProjectManager.Triple(this, directory, viewAID, viewBID, viewCID);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["triple"] = triple;
	this.addOperation("SET", {"path":path}, this._addTripleComplete, this, object);
	return triple;
}
App3DR.ProjectManager.prototype._addTripleComplete = function(object, data){
	var callback = object["callback"];
	var context = object["context"];
	var triple = object["triple"];
	this._triples.push(triple);
	this.saveProjectFile();
	callback.call(context, triple);
}
App3DR.ProjectManager.prototype.saveTripleRelative = function(triple, string, callback, context, object){
	console.log("saveTripleRelative: "+triple.id());
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), App3DR.ProjectManager.TRIPLE_RELATIVE_FILE_NAME);
	console.log(path+" ... ");
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, triple);
}


App3DR.ProjectManager.prototype.addCamera = function(callback, context){
	console.log("addCamera");
	var directory = this._uniqueCameraID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, directory);
	var camera = new App3DR.ProjectManager.Camera(this, "New Camera "+directory, directory);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["camera"] = camera;
	this.addOperation("SET", {"path":path}, this._addCameraComplete, this, object);
}
App3DR.ProjectManager.prototype._addCameraComplete = function(object, data){
	console.log("_addCameraComplete");

	var callback = object["callback"];
	var context = object["context"];
	var camera = object["camera"];
	this._cameras.push(camera);
	this.saveProjectFile();
	callback.call(context, camera);
}

App3DR.ProjectManager.prototype.addPictureForCamera = function(camera, filename, size, scale, binary, callback, context, object){
	console.log("doing");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.addMatchesForCamera = function(camera, filename, binary, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadCalibrationDataForCamera = function(camera, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}




App3DR.ProjectManager.prototype.saveGraph = function(string, filename, callback, context, object){
	console.log("saveGraph: ");
	throw "?"
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadGraph = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.graphFilename());
	console.log("loadGraph: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadGraphComplete, this, object);
}
App3DR.ProjectManager.prototype._loadGraphComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._graphData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}



App3DR.ProjectManager.prototype.saveTracks = function(string, filename, callback, context, object){
	console.log("saveTracks: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadTracks = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.tracksFilename());
	console.log("loadTracks: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadTracksComplete, this, object);
}
App3DR.ProjectManager.prototype._loadTracksComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._tracksData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}






App3DR.ProjectManager.prototype.saveSparse = function(string, filename, callback, context, object){
	console.log("saveSparse: ");
	//var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var path = Code.appendToPath(this._workingPath, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadSparse = function(callback, context, object){
	// var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.sparseFilename());
	var path = Code.appendToPath(this._workingPath, this.sparseFilename());
	console.log("loadSparse: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadSparseComplete, this, object);
}
App3DR.ProjectManager.prototype._loadSparseComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._sparseData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.saveDense = function(string, filename, callback, context, object){
	console.log("saveDense: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadDense = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, this.denseFilename());
	console.log("loadDense: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadDenseComplete, this, object);
}
App3DR.ProjectManager.prototype._loadDenseComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._denseData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}



App3DR.ProjectManager.prototype.savePoints = function(string, filename, callback, context, object){
	console.log("savePoints: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadPoints = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.pointsFilename());
	console.log("loadPoints: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadPointsComplete, this, object);
}
App3DR.ProjectManager.prototype._loadPointsComplete = function(object, data){
	console.log("_loadPointsComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._pointsData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.saveBundled = function(string, filename, callback, context, object){
	console.log("saveBundled: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadBundled = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.bundledFilename());
	console.log("loadBundled: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadBundledComplete, this, object);
}
App3DR.ProjectManager.prototype._loadBundledComplete = function(object, data){
	console.log("_loadBundledComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._bundledData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}










// debug:

App3DR.ProjectManager.prototype.saveBundle = function(string, filename, callback, context, object){
	console.log("saveBundle: ");
	throw "?";
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadBundle = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.bundleFilename());
	console.log("loadBundle: "+path);
	throw "?";
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadBundleComplete, this, object);
}
App3DR.ProjectManager.prototype._loadBundleComplete = function(object, data){
	console.log("_loadBundleComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._bundleData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.saveTrianglesFromData = function(triangleData, fxn, ctx){
	console.log(triangleData);
	var yaml = new YAML();
	var object = triangleData;
	var timestampNow = Code.getTimeStampFromMilliseconds();
		triangleData["modified"] = timestampNow;
	yaml.writeComment("Triangles");
	yaml.writeObjectLiteral(triangleData);
	var triangleString = yaml.toString();
	var fxnSavedTriangles = function(){
		console.log("fxnSavedTriangles");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveTriangles(triangleString, this.triangleFilename(), fxnSavedTriangles, this);
}

App3DR.ProjectManager.prototype.saveTriangles = function(string, filename, callback, context, object){
	console.log("saveTriangles: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadTriangles = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.triangleFilename());
	console.log("loadTriangles: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadTrianglesComplete, this, object);
}
App3DR.ProjectManager.prototype._loadTrianglesComplete = function(object, data){
	console.log("_loadTrianglesComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._triangleData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.dataToObject = function(data){
	var str = Code.binaryToString(data);
	var object = YAML.parse(str);
	if(Code.isArray(object)){
		object = object[0];
	}
	return object;
}


App3DR.ProjectManager.prototype.viewCount = function(){
	return 0;
}
// App3DR.ProjectManager.prototype.createDirectoryForView = function(view, callback){
// 	var path = Code.appendToPath(this._workingPath, directory);
// 	console.log(path);
// 	this._viewDirectoryCallback = callback;
// 	this._clientFile.set(path);
// }
App3DR.ProjectManager.prototype.setMatching = function(indexA,indexB, matches){

}
App3DR.ProjectManager.prototype.pairCount = function(){
	return 0;
}
App3DR.ProjectManager.prototype.setReconstruction = function(points){

}
App3DR.ProjectManager.prototype.setModel = function(stuff){
	// cameras
	// textures
	// background
	//
}
// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.prototype.startBackgroundTasks = function(){
	this._isBackgroundTasks = true;
	this._ticker.addFunction(Ticker.EVENT_TICK, this._backgroundTaskTick, this);
	this._ticker.start();
}
App3DR.ProjectManager.prototype.stopBackgroundTasks = function(){
	this._isBackgroundTasks = false;
	this._ticker.removeFunction(Ticker.EVENT_TICK, this._backgroundTaskTick, this);
	this._ticker.stop();
}
App3DR.ProjectManager.prototype.pauseBackgroundTasks = function(){
	this._ticker.stop();
}
App3DR.ProjectManager.prototype._backgroundTaskTick = function(){
	this.checkPerformNextTask();
}
App3DR.ProjectManager.prototype.checkPerformNextTask = function(){
this.pauseBackgroundTasks();
console.log("checkPerformNextTask");
	this._taskBusy = true;
	var i, j, k, len;
	console.log("next task?");
// R3D._testOptimizeGeometryEuclidean();

// R3D._testOptimizeGeometryProjection2D();
// R3D._testOptimizeGeometryProjection3D();
R3D._testMatchViewGeometry3D();

// Matrix.testQR();
throw "..."
// Code.testPointMatches();
// Code.testLM();

	// throw "........."
	var views = this._views;
	var project = this;
	// assumed all views already have entry & images
// throw "stop";
// throw "view summaries";
// console.log("summaries");
	len = views.length;
	for(i=0; i<len; ++i){
		var view = views[i];
		var hasFeatures = view.hasFeatures();
		if(!hasFeatures){
			this.calculateFeatures(view);
			return;
		}
	}
// console.log("words");
// throw "task pair bag of words";
	if(views.length>0 && !this.hasViewSimilarity()){
		this.calculateViewSimilarities();
		return;
	}

// console.log("cams");
// throw "calculate cameras";
	// cameras:
	var cameras = this._cameras;
	// console.log(cameras);
	len = cameras.length;
	if(cameras.length==0){
		console.log("no cameras");
		this.createDefaultCamera();
		return;
	}
	for(i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var camID = camera.id();
		// console.log("CAMERA: "+camID);
		if(camera.needsDetection()){
			this.calculateCameraCheckerboard(camera, null);
			return;
		}
		if(camera.needsCalculation()){
			console.log("needsCalculation");
			this.calculateCameraParameters(camera, null);
			return;
		}
	}
	if(views.length<2){
		console.log("not enough views to proceed: "+views.length);
		return;
	}

// throw "task default assign views camera";
	// make sure every view has a camera:
	len = views.length;
	var wasCameraAdded = false;
	var defaultCamera = cameras[0];
	var defaultCameraID = defaultCamera.id();
	for(i=0; i<len; ++i){
		var view = views[i];
		var hasCamera = view.hasCamera();
		if(!hasCamera){
			view.setCameraID(defaultCameraID);
			wasCameraAdded = true;
		}
	}
	if(wasCameraAdded){
		// throw "BEFORE CAMERA DEFAULT SAVE"
		this.saveProjectFile(function(a){
			project.checkPerformNextTask();
		});
		return;
	}

// throw "task pair feature match";
	// does a feature-match pair exist (even a bad match) between every (putative) view pair?
	if(!project.checkHasSparseStarted()){
		project.calculatePairPutatives();
		return;
	}
	// throw "..."
// throw "iterate sparse";
	if(!project.checkHasSparseEnded()){
		project.iterateSparseProcess();
		return;
	}

// throw "start dense";
	if(!project.checkHasDenseStarted()){
		project.calculateDensePairPutatives();
		return;
	}
// throw "iterate dense";
	if(!project.checkHasDenseEnded()){
		project.iterateDenseProcess();
		return;
	}
throw ">start bundle";
	if(!project.checkHasBundleStarted()){
		project.initializeBundleGroupsFromDense();
		return;
	}
// throw "> continue bundle";
	if(!project.checkHasBundleEnded()){
		project.iterateBundleProcess(); // sets up dense groups
		return;
	}
// throw ">start surface"; // copy point files & create surface.yaml
	if(!project.checkHasSurfaceStarted()){
		project.initializeSurfaceFromBundle();
		return;
	}
// throw ">iterate surface"; // create triangles & textures
	if(!project.checkHasSurfaceEnded()){
		project.iterateSurfaceProcess();
	}



throw ">copy surface to a scene/ID/ directory"; 


var sceneID = this.currentSceneID();
console.log(sceneID);
var scene = this.sceneFromID(sceneID);
console.log(scene);


this.sceneToDAE();
this.sceneToOBJ();


	// does each (good) pair have a high-q dense depth match?
	console.log("NO TASKS TO PERFORM");
	this._taskBusy = false;
}


App3DR.ProjectManager.prototype.checkHasSparseStarted = function(){
	var filename = this._sparseFilename;
	return filename != null && filename != undefined;
}
App3DR.ProjectManager.prototype.checkHasSparseEnded = function(){
	var count = this._sparseCount;
	return count != null && count != undefined;
}

App3DR.ProjectManager.prototype.checkHasDenseStarted = function(){
	var filename = this._denseFilename;
	return filename != null && filename != undefined;
}
App3DR.ProjectManager.prototype.checkHasDenseEnded = function(){
	var count = this._denseCount;
	return count != null && count != undefined;
}


App3DR.ProjectManager.prototype.checkHasBundleStarted = function(){
	var filename = this._bundleFilename;
	return filename != null && filename != undefined;
}
App3DR.ProjectManager.prototype.checkHasBundleEnded = function(){
	var count = this._bundleCount;
	return count != null && count != undefined;
}

App3DR.ProjectManager.prototype.checkHasSurfaceStarted = function(){
	var filename = this._surfaceFilename;
	return filename != null && filename != undefined;
}
App3DR.ProjectManager.prototype.checkHasSurfaceEnded = function(){
	var count = this._surfaceCount;
	return count != null && count != undefined;
}
App3DR.ProjectManager.prototype.surfaceFilename = function(file){
	if(file!==undefined){
		this._surfaceFilename = file;
	}
	return this._surfaceFilename;
}



App3DR.ProjectManager.prototype.iterateSparseProcess = function(){
	var project = this;
	var sparseConfiguration = {};
	var filename = this.sparseFilename();
	var fxn = function(){
		project._iterateSparseDenseLoaded(filename, project.sparseData(), sparseConfiguration);
	}
	project.loadSparse(fxn, project);
}

App3DR.ProjectManager.prototype.testDEL = function(){
	var url = "http://localhost/web/ff/3DR/app/x.yaml";
	var project = this;
	var loaded = function(str){
		console.log(str);
		var yaml = YAML.parse(str);
		console.log(yaml);
		yaml = yaml[0];

		var views = yaml["views"];
		var transforms = [];
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var transform = view["transform"];
				transform = Matrix.fromObject(transform);
			transforms.push(transform);
		}
		var listPairs = [];
		project.displayViewGraph(transforms,listPairs, 100);
	}
	Ajax.load(url, loaded);
}
App3DR.ProjectManager.prototype.iterateDenseProcess = function(){
	var project = this;
	var denseConfiguration = {"isDense":true};
	var filename = this.denseFilename();
	var fxn = function(){
		project._iterateSparseDenseLoaded(filename, project.denseData(), denseConfiguration);
	}
	project.loadDense(fxn, project);
}

App3DR.ProjectManager.prototype._iterateSparseDenseLoaded = function(inputFilename, inputData, configuration){
	var project = this;
	console.log("_iterateSparseDenseLoaded");

	configuration = Code.valueOrDefault(configuration, {});
	var isDense = Code.valueOrDefault(configuration["isDense"], false);

	var pairs = inputData["pairs"];
	var basePath = Code.pathRemoveLastComponent(inputFilename);
	console.log(basePath);

	if(!pairs){
		console.log(inputData);
		throw "input data not have pairs";
	}

	var currentPair = null;
	var completePairFxn = function(data){
		console.log("completePairFxn");
		var idA = currentPair["A"];
		var idB = currentPair["B"];
		var uniqueStrings = [idA,idB];
			uniqueStrings.sort();
		var pairID = uniqueStrings.join("-");
		currentPair["id"] = pairID;
		console.log(data);
		var matchCount = 0;
		var relativeCount = 0;
		var trackCount = 0;
		// SAVE MATCHES
		var matches = data["matches"];
		var saveCameras = null;

		if(matches){
			console.log("matches");
			console.log(matches);
			matches["A"] = data["A"];
			matches["B"] = data["B"];
			matchCount = matches["points"].length;
			console.log("GOT : matchCount: "+matchCount);
		}
		// SAVE RELATIVE
		var relative = data["relative"];
		if(relative){
			console.log("relative");
			console.log(relative);
			relative["A"] = data["A"]; // ? this is a no-op assigning to same value?
			relative["B"] = data["B"];
			var relativePoints = relative["points"];
			relativeCount = relativePoints ? relativePoints.length : 0;
			var transforms = relative["transforms"];
			if(relativeCount>0 && transforms){
				var transform = transforms[0];
				var relativeError = transform["errorRMean"] + transform["errorRSigma"];
				if(relativeError)
					var relativeTransform = transform["transform"];
					var viewA = transform["A"];
					var viewB = transform["B"];
					if(viewA!=idA){
						relativeTransform = R3D.inverseCameraMatrix(relativeTransform);
					}
				currentPair["relativeError"] = relativeError;
				currentPair["relativeTransform"] = relativeTransform;
			}
			saveCameras = relative["cameras"];
			// console.log(saveCameras);
// throw "saveCameras";
console.log("GOT : relative: "+relativeCount);
		}
		// SAVE TRACKS
		var tracks = data["tracks"];
		if(tracks){
			console.log("tracks");
			console.log(tracks);
			tracks["A"] = data["A"];
			tracks["B"] = data["B"];
			var trackPoints = tracks["points"];
			trackCount = trackPoints ? trackPoints.length : 0;
			// this may have 'better' transform?
			console.log("GOT : tracks: "+trackCount);
		}
		// SAVE SUMMARY
		currentPair["matches"] = matchCount;
		currentPair["relative"] = relativeCount;
		currentPair["tracks"] = trackCount;
		currentPair["metricNeighborsToWorld"] = data["metricNeighborsToWorld"];
		currentPair["cameras"] = saveCameras;
		console.log("data");
		console.log(data);
		console.log("currentPair");
		console.log(currentPair);

		var pairBase = Code.appendToPath(basePath, App3DR.ProjectManager.PAIRS_DIRECTORY, pairID);
		var matchesFilename = Code.appendToPath(pairBase, App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME);
		var relativeFilename = Code.appendToPath(pairBase, App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME);
		var tracksFilename = Code.appendToPath(pairBase, App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME)

		var saveFileOrAlternateFxn = function(data,filename,fxn,cxt){
			if(data){
				console.log("saving ... ");
				project.saveFileFromData(data,filename, fxn,cxt);
			}else{
				console.log("no data ... ");
				fxn.call(cxt);
			}
		}
		var saveMatchesFxn = function(){
			console.log("saveMatchesFxn");
			saveFileOrAlternateFxn(matches,matchesFilename, saveRelativeFxn,project);
		}
		var saveRelativeFxn = function(){
			console.log("saveRelativeFxn");
			saveFileOrAlternateFxn(relative,relativeFilename, saveTrackFxn,project);
		}
		var saveTrackFxn = function(){
			console.log("saveTrackFxn");
			saveFileOrAlternateFxn(tracks,tracksFilename, saveSparseFxn,project);
		}
		var saveSparseFxn = function(){
			console.log("saveSparseFxn");

// throw "BEFORE SAVE SPARSE FXN (OR DENSE)";
			// project.saveSparseFromData(inputData, saveProjectFxn,project);
			console.log(inputData);
			project.saveFileFromData(inputData,inputFilename, saveProjectFxn,project);
		}
		var saveProjectFxn = function(){
			console.log("saveProjectFxn");
			project._taskDoneCheckReloadURL();
		}
		// SAVE SEQUENCE
		saveMatchesFxn();
	}

	console.log(inputData);

	var views = inputData["views"];
	var cameras = inputData["cameras"];
	if(!cameras || !views){
		console.log("inputData");
		console.log(inputData);
		throw "data needs cameras & views in file";
	}
	var viewIDsToObject = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		viewIDsToObject[view["id"]] = view;
	}
	var cameraIDsToObject = {};
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		cameraIDsToObject[camera["id"]] = camera;
	}

	// good | ok | poor | bad
	console.log("pair count: "+pairs.length+" ............");
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var matches = pair["matches"];

		var camAID = viewIDsToObject[idA]["camera"];
		var camBID = viewIDsToObject[idB]["camera"];


		if(!Code.isSet(matches)){
			console.log("need to try pair: "+idA+" & "+idB);
			currentPair = pair;
			console.log(pair);
			var relativeAB = pair["relativeTransform"];

			console.log(relativeAB);

			if(!relativeAB && isDense){
				console.log("make extrinsic on the fly");
				var viewA = viewIDsToObject[idA];
				var viewB = viewIDsToObject[idB];
				console.log(viewA);
				console.log(viewB);
				var extA = viewA["transform"];
				var extB = viewB["transform"];
				if(extA && extB){
					extA = Matrix.fromObject(extA);
					extB = Matrix.fromObject(extB);
					var absA = Matrix.inverse(extA);
					var absB = Matrix.inverse(extB);
					var relAB = Matrix.relativeReference(absA,absB);
					var extAB = Matrix.inverse(relAB);
					console.log(extAB);
					relativeAB = extAB.toObject();
				}
			}

			if(relativeAB){ // dense
				// console.logx(camAID,camBID,cameras);
				// throw "this is for dense"
				console.log(relativeAB);
				configuration = {};
				project.calculatePairMatchWithRFromViewIDs(idA,idB, relativeAB, camAID,camBID,cameras, completePairFxn,project, configuration);
				return;
			} // else: sparse = w/o known R
			// throw "this is for sparse"
			var cameras = inputData["cameras"];
			project.calculatePairMatchFromViewIDs(idA,idB, camAID,camBID,cameras, completePairFxn,project);
			return;
		}
	}

// throw "before more ... sparse / dense ?"

	var saveProjectFxn = function(){
		console.log("saveProjectFxn");
		project._taskDoneCheckReloadURL();
	}

	console.log("pairs: ");
	console.log(pairs);

// throw ">triples";

	var triples = inputData["triples"];
// var triples = null;
	if(!triples){
// filter pairs & generate triples from remaining pairs
var originalPairs = pairs;
var info = project.findConsistentLowErrorPairs(pairs, isDense);
console.log(info);
var remainingPairs = info["pairs"];
console.log("remainingPairs:");
console.log(remainingPairs);
		var info = project.triplesFromBestPairs(views, remainingPairs, isDense);
		var triples = info["triples"];
console.log(triples);
inputData["triples"] = triples;
inputData["pairsRaw"] = originalPairs;
inputData["pairs"] = remainingPairs;
//console.log(inputData);

	var pairLookup = {};
	for(var i=0; i<remainingPairs.length; ++i){
		var pair = remainingPairs[i];
		var pairID = pair["id"];
		pairLookup[pairID] = pair;
	}
var tripleRemoved = 0;
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var triplePairs = triple["pairs"];
		// console.log(triple);
		for(var j=0; j<triplePairs.length; ++j){
			var pairID = triplePairs[j];
			if(pairLookup[pairID] && pairLookup[pairID]["tracks"]>0){
				// keep
			}else{
				console.log("missing pair / tracks "+pairID);
				Code.removeElementAt(triplePairs,j);
				--j;
			}
		}
		if(triplePairs.length<2){
			Code.removeElementAt(triples,i);
			++tripleRemoved;
			--i;
		}
	}
console.log("tripleRemoved: "+tripleRemoved);
// console.log(inputData);
// console.log(triples.length);
// throw "does each triple have 2+ pairs?"


// throw "BEFORE TRIPLES DONE"
		
		project.saveFileFromData(inputData,inputFilename, saveProjectFxn,project);

		
	}


// throw "BEFORE AFTER TRIPLES"

	//
	console.log(triples);
	console.log("TRIPLE COUNT: "+inputData["triples"].length);
	// 
	// LOAD EACH POSSIBLE TRIPLE
// throw ">triples";
	var completeTripleFxn = function(metrics){
		console.log("completeTripleFxn");
		console.log(metrics);
		console.log(currentTriple);
		var sAB = metrics["AB"];
		var sAC = metrics["AC"];
		var sBC = metrics["BC"];
		var eABAC = metrics["AB-AC"];
		var eACBC = metrics["AC-BC"];
		var eABBC = metrics["AB-BC"];
		currentTriple["gauge"] = {"AB":sAB, "AC":sAC, "BC":sBC, "AB-AC":eABAC, "AC-BC":eACBC, "AB-BC":eABBC};
console.log("inputFilename: "+inputFilename);
// throw "before save triple";
		project.saveFileFromData(inputData,inputFilename, saveProjectFxn,project);
	}
	var currentTriple = null;
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var idA = triple["A"];
		var idB = triple["B"];
		var idC = triple["C"];
		var gauge = triple["gauge"];
		var triplePairs = triple["pairs"];
		if(!gauge){
			console.log(idA,idB,idC);
			currentTriple = triple;
// throw "before triple ..."
			project.calculateTripleMatchFromViewIDs(inputData,inputFilename, idA,idB,idC, triplePairs, completeTripleFxn,project);
			return;
		}
	}
	console.log("triples count: "+triples.length+" ............");

// throw "before start graph?"

console.log(inputData);
console.log(triples);

// this._visualizeTriples(triples);
// throw "visualize triples"



// throw ">graph";
	// CREATE GRAPH FROM PAIRWISE & TRIPLE SCALE
	var graph = inputData["graph"];
// force redo:
// graph = null;
// console.log(inputData);
// throw "..."
	if(!graph){
		var inputViews = inputData["views"];
		var graphViews = [];
		var graphPairs = [];
		var graphTriples = triples;
		var graphCameras = []
		for(var i=0; i<inputViews.length; ++i){
			var inputView = inputViews[i];
			var v = {};
				v["id"] = inputView["id"];
				v["camera"] = inputView["camera"];
			graphViews.push(v);
		}
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			if(pair["tracks"]>0){
				var p = {};
				p["id"] = pair["id"];
				p["A"] = pair["A"];
				p["B"] = pair["B"];
				p["relativeError"] = pair["relativeError"];
				p["relative"] = pair["relative"];
				p["R"] = Matrix.fromObject(pair["relativeTransform"]);
				p["cameras"] = pair["cameras"];
				graphPairs.push(p);
			}
		}
		console.log(graphViews);
		console.log(graphPairs);
		console.log(graphTriples);

		// throw "Do poor edge pruning / outlier detection / removal ? ";

		console.log("_absoluteViewsFromDatas");
		var graph = project._absoluteViewsFromDatas(graphViews, graphPairs, graphTriples);
		console.log(graph);
		// throw "after abs"

		var viewIndextoViewID = [];
		for(var v=0; v<graphViews.length; ++v){
			viewIndextoViewID[v] = graphViews[v]["id"];
		}

		// ONLY CARE ABOUT SKELETON GROUP FOR OPTIMIZING:
		var graphGroups = [graph["skeleton"]];
		var graphGroupPairs = [graph["skeletonEdges"]];
		var graphCameras = graph["cameras"];
		// if(false){
		// 	var graphGroups = graph["groups"];
		// 		graphGroups.unshift(graph["skeleton"]);
		// 	var graphGroupPairs = graph["groupEdges"]
		// 		graphGroupPairs.unshift(graph["skeletonEdges"]);
		// }
		var basePath = Code.pathRemoveLastComponent(inputFilename);
		// console.log(basePath);
		var graphFilename = Code.appendToPath(basePath, App3DR.ProjectManager.RECONSTRUCT_GRAPH_FILE_NAME);
		var dataViews = [];
		var dataEdges = [];
		var dataGroups = [];
		var data = {};
		data["views"] = dataViews;
		data["pairs"] = dataEdges;
		data["groups"] = dataGroups;
		data["cameras"] = graphCameras;
		data["skeletonIndex"] = 0;
		data["loadGroupIndex"] = -1;
		data["loadPairIndex"] = -1;


		// delete empty views
		var dataViews = data["views"];
		var dataPairs = data["pairs"];

		// console.log(dataPairs);
		// throw "?"

		// 
		var vs = graph["views"];
		var vt = graph["transforms"];
		for(var i=0; i<vs.length; ++i){
			var d = {};
				d["id"] = vs[i]["id"];
				d["transform"] = vt[i];
console.log(i+" = ",vs[i]);
			dataViews.push(d);
		}
		// TODO: find edge outliers -- eg: node voting
		for(var i=0; i<graphPairs.length; ++i){
			var pair = graphPairs[i];
			var d = {};
				d["id"] = pair["id"];
				d["A"] = pair["A"];
				d["B"] = pair["B"];
				d["error"] = pair["relativeError"];
				d["count"] = pair["relative"];
			dataEdges.push(d);
		}
		for(var i=0; i<graphGroups.length; ++i){
			var group = graphGroups[i];
// 
console.log(group);
// throw "?"
			var g = {};
			var gViews = [];
			var gEdges = [];
				g["views"] = gViews;
				g["edges"] = gEdges;
			for(var j=0; j<group.length; ++j){
				var vid = group[j];
					vid = viewIndextoViewID[vid];
				gViews.push(vid);
			}
			var pairs = graphGroupPairs[i];
			for(var j=0; j<pairs.length; ++j){
				var pair = pairs[j];
				var a = pair[0];
					a = viewIndextoViewID[a];
				var b = pair[1];
					b = viewIndextoViewID[b];
				gEdges.push({"A":a,"B":b});
			}
			dataGroups.push(g);
		}

		// pass along camera
		var inputViewIDToView = {};
		var inputViews = inputData["views"];
		for(var i=0; i<inputViews.length; ++i){
			var view = inputViews[i];
			console.log(view);
			var viewID = view["id"];
			inputViewIDToView[viewID] = view;
		}


		// delete nonexistant pairs now with empty views
		var removedViews = {};
		var removedViewCount = 0;
		var validViewIDs = {};
		for(var i=0; i<dataViews.length; ++i){
			var view = dataViews[i];
			var viewID = view["id"];
			if(!view["transform"]){
				console.log("null transform: "+viewID);
				Code.removeElementAt(dataViews,i);
				--i;
				removedViews[viewID] = true;
				++removedViewCount;
			}else{
				validViewIDs[viewID] = true;
				// console.log(inputViewIDToView);
				// console.log(viewID);
				var inputView = inputViewIDToView[viewID];
				// console.log(inputView);
				view["camera"] = inputView["camera"];
			}
		}
		for(var i=0; i<dataPairs.length; ++i){
			var pair = dataPairs[i];
			var viewIDA = pair["A"];
			var viewIDB = pair["B"];
			if(removedViews[viewIDA] || removedViews[viewIDB]){
				console.log("null pair: "+viewIDA+" | "+viewIDB);
				Code.removeElementAt(dataPairs,i);
				--i;
			}
		}

		// throw out any pairs / groups that include an invalid view
		// TODO: THIS MAY MESS UP NON-SKELETON VERSION
		for(var i=0; i<dataGroups.length; ++i){
			var group = dataGroups[i];
			var groupViews = group["views"];
			var groupPairs = group["edges"];
			if(!groupViews || groupViews.length==0){
				Code.removeElementAt(dataGroups,i);
				--i;
				continue;
			}

			for(var j=0; j<groupViews.length; ++j){
				var viewID = groupViews[j];
				if(!validViewIDs[viewID]){
					console.log("remove null group view: "+viewID);
					Code.removeElementAt(groupViews,j);
					--j;
				}
			}
			for(var j=0; j<groupPairs.length; ++j){
				var pair = groupPairs[j];
				var viewIDA = pair["A"];
				var viewIDB = pair["B"];
				if(!validViewIDs[viewIDA] || !validViewIDs[viewIDB]){
					console.log("remove null group pair: "+viewIDA+" | "+viewIDB);
					Code.removeElementAt(groupPairs,j);
					--j;
				}
			}
		}
		// console.log(inputData["cameras"]);
		console.log("GRAPH DATA TO SAVE:");
		console.log(data);

// throw "BEFORE SAVE GRAPH";

		// save graph & reference it
		inputData["graph"] = graphFilename;
		var saveSparseFxn = function(){
			console.log("saveSparseFxn");
			project.saveFileFromData(inputData,inputFilename, saveProjectFxn,project);
		}
		console.log(inputData);
		// save graph itself
		project.saveFileFromData(data, graphFilename, saveSparseFxn,project);
		return;
	} // end greated graph
// throw ">aggregate ?";
console.log("aggregate ...")
	// AGGREGATE TRACKS INTO POINT FILE
	var trackCount = inputData["trackCount"]; // number of loaded tracks
	if(trackCount===null || trackCount===undefined){
		console.log("no trackCount ---> load tracks into track_GROUP.yaml & full (tracks or dense points) into tracks_all.yaml");
		this._iterateSparseTracks(inputData, inputFilename, isDense);
		return;
	}

}

App3DR.ProjectManager.prototype._visualizeTriples = function(triples){
	var pairs = {};
	var project = this;
	
	var views = project.views();
	var viewIDToIndex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		viewIDToIndex[viewID] = i;
		for(var j=i+1; j<views.length; ++j){
			var viewIDB = views[j].id();
			var pairID = Code.sortedStringID([viewID,viewIDB]);
			pairs[pairID] = pairID;
		}
	}

	pairs = Code.objectToArray(pairs);
	console.log(pairs);

	var squareSize = Math.ceil(Math.sqrt(pairs.length));
	console.log(squareSize);



	// for every triple:
	var matchedPairs = [];
	var matchedPairLookup = {};
	var addEdgeVisit = function(lookup, key){
		var value = lookup[key];
		if(value){
			lookup[key] = value + 1;
		}else{
			lookup[key] = 1;
		}
	}

throw "where to get errors ?"

	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var gauge = triple["gauge"];
		var AB = gauge["AB"];
		var AC = gauge["AC"];
		var BC = gauge["BC"];
		var idA = triple["A"];
		var idB = triple["B"];
		var idC = triple["C"];
		var pairIDA;
		if(AB>0 && AC>0){
			pairIDA = Code.sortedStringID([idA,idB]);
			pairIDB = Code.sortedStringID([idA,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			addEdgeVisit(matchedPairLookup,pairIDA);
			addEdgeVisit(matchedPairLookup,pairIDB);
			// matchedPairLookup[pairIDA] = true;
			// matchedPairLookup[pairIDB] = true;
		}
		if(AB>0 && BC>0){
			pairIDA = Code.sortedStringID([idA,idB]);
			pairIDB = Code.sortedStringID([idB,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			// matchedPairLookup[pairIDA] = true;
			// matchedPairLookup[pairIDB] = true;
			addEdgeVisit(matchedPairLookup,pairIDA);
			addEdgeVisit(matchedPairLookup,pairIDB);
		}
		if(AC>0 && BC>0){
			pairIDA = Code.sortedStringID([idA,idC]);
			pairIDB = Code.sortedStringID([idB,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			// matchedPairLookup[pairIDA] = true;
			// matchedPairLookup[pairIDB] = true;
			addEdgeVisit(matchedPairLookup,pairIDA);
			addEdgeVisit(matchedPairLookup,pairIDB);
		}
	}
	// console.log(matchedPairLookup);
	// throw "?"
	// for each gauge AB AC BC
	// if gauge pair ratio is nonzero
	// add gauge 

var pairSizeX = 90.0;
var pairSizeY = 46.0;
	// put pairs in circle?
	// square: ceil(sqrt(pair count))
	var pairLocations = [];
	var index = 0;

	var pairIDToLocation = {};

	for(var j=0; j<squareSize; ++j){
		for(var i=0; i<squareSize; ++i){
			if(index>=pairs.length){
				break;
			}
			var pairID = pairs[index];
			// var pairID = pairID.replace("-","\n");
			var location = new V2D(10 + (i+0.5)*pairSizeX, 10 + (j+0.5)*pairSizeY);
			pairIDToLocation[pairID] = location;

			var viewIDs = pairID.split("-");
			var idA = viewIDs[0];
			var idB = viewIDs[1];
			// pairID = index+"";
			// pairID = "a\nb";

			
			
/*
			var text;
			var color = 0xFF660066;
			if(matchedPairLookup[pairID]>0){
				color = 0xFF33CC66;
			}			
			text = new DOText(""+idA, 12, DOText.FONT_ARIAL, color, DOText.ALIGN_CENTER);
			text.matrix().translate(0,-8);
			text.matrix().translate(location.x, location.y);
			GLOBALSTAGE.addChild(text);

			text = new DOText(""+idB, 12, DOText.FONT_ARIAL, color, DOText.ALIGN_CENTER);
			text.matrix().translate(0,8);
			text.matrix().translate(location.x, location.y);
			GLOBALSTAGE.addChild(text);
*/
			++index;
		}
		if(index>=pairs.length){
			break;
		}
	}
	// add in circles
	for(var i=0; i<matchedPairs.length; ++i){
		var match = matchedPairs[i];
		var pairIDA = match[0];
		var pairIDB = match[1];
		var pointA = pairIDToLocation[pairIDA];
		var pointB = pairIDToLocation[pairIDB];
		/*
		var d = new DO();
		d.graphics().setLine(1.0,0xFFCC0000);
		d.graphics().beginPath();
		d.graphics().moveTo(pointA.x,pointA.y);
		d.graphics().lineTo(pointB.x,pointB.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);
		*/
	}
















// pair graph:

	var graph = new Graph();
	// for(var i=0; i<pairs.length; ++i){

	var keys = Code.keys(matchedPairLookup);
console.log(views.length);
console.log(keys.length);
	var pairIDToVertex = {};
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var ids = key.split("-");
		var idA = ids[0];
		var idB = ids[1];
		var data = {};
			data["id"] = key;
			data["A"] = idA;
			data["B"] = idB;
		var vertex = graph.addVertex();
			vertex.data(data);
		pairIDToVertex[key] = vertex;
	}

	var addPairGraphEdge = function(graph, pairIDA,pairIDB){
		var a = pairIDToVertex[pairIDA];
		var b = pairIDToVertex[pairIDB];
		// console.log(a,b);
		if(a && b){
			graph.addEdgeDuplex(a,b,1.0);
		}
	}

	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var gauge = triple["gauge"];
		var AB = gauge["AB"];
		var AC = gauge["AC"];
		var BC = gauge["BC"];
		var idA = triple["A"];
		var idB = triple["B"];
		var idC = triple["C"];
		var pairIDA;
// AB = 1;
// AC = 1;
// BC = 1;
		if(AB>0 && AC>0){
			pairIDA = Code.sortedStringID([idA,idB]);
			pairIDB = Code.sortedStringID([idA,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			addPairGraphEdge(graph, pairIDA,pairIDB);
		}
		if(AB>0 && BC>0){
			pairIDA = Code.sortedStringID([idA,idB]);
			pairIDB = Code.sortedStringID([idB,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			addPairGraphEdge(graph, pairIDA,pairIDB);
		}
		if(AC>0 && BC>0){
			pairIDA = Code.sortedStringID([idA,idC]);
			pairIDB = Code.sortedStringID([idB,idC]);
			matchedPairs.push([pairIDA,pairIDB]);
			addPairGraphEdge(graph, pairIDA,pairIDB);
		}
	}




















	// add in views
console.log(matchedPairLookup);
	// var edgesEasy = {};
	// var edgesHard = {};
	// var edgesVisited = {};


	var circleRadius = 500;
	var totalOffX = 100;
	var totalOffY = 50;
	var circleCenter = new V2D(totalOffX + circleRadius, totalOffY + circleRadius);
	// var imageSize = Math.round(circleRadius*1.5*Math.PI/views.length);
	var size = new V2D(0,0);

	var viewLocations = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();


		


		// var d = new DOImage(image);
		
		var angle = Math.PI * 2 * i/views.length;
		var offsetX = circleCenter.x + size.x*0.5 + circleRadius*Math.cos(angle);
		var offsetY = circleCenter.y + size.y*0.5 + circleRadius*Math.sin(angle);
		var location = new V2D(offsetX,offsetY);
			viewLocations[viewID] = location;

		var color = 0xFF990033;
		var text = new DOText(""+viewID, 16, DOText.FONT_ARIAL, color, DOText.ALIGN_CENTER);
		// text.matrix().translate(0,8);
		text.matrix().translate(location.x, location.y);
		GLOBALSTAGE.addChild(text);

	}




console.log(graph);

var sets = graph.disjointSets();

sets.sort(function(a,b){
	return a.length>b.length ? -1 : 1;
})

console.log(sets)

var best = sets[0];

var colors = [0xFFFF0000,0xFF00FF00,0xFF0000FF];
var sizes = [13,15,19,23,27];


console.log(viewLocations);
for(var s=0; s<sets.length; ++s){
	var best = sets[s];

	var size = sizes[s%sizes.length];
	var color = colors[s%colors.length];

var viewCounts = {};
for(var i=0; i<best.length; ++i){
	var vertex = best[i];
	var data = vertex.data();
	var idA = data["A"];
	var idB = data["B"];
	viewCounts[idA] = 1;
	viewCounts[idB] = 1;

console.log(idA,idB)
	var points = [viewLocations[idA],viewLocations[idB]];
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		console.log(p,point)
		var d = new DO();
		d.graphics().setLine(2.0,color);
		d.graphics().beginPath();
		d.graphics().drawCircle(point.x,point.y, size);
		d.graphics().strokeLine();
		d.graphics().endPath();
		GLOBALSTAGE.addChild(d);
	}
	/*
	var d = new DO();
	d.graphics().setLine(1.0,color);
	d.graphics().beginPath();
	d.graphics().moveTo(points[0].x,points[0].y);
	d.graphics().lineTo(points[1].x,points[1].y);
	d.graphics().strokeLine();
	d.graphics().endPath();
	GLOBALSTAGE.addChild(d);
	*/
}
viewCounts = Code.objectToArray(viewCounts);
console.log(viewCounts.length);
}


throw "."




/*
	// any triple that has a pair => add a simple edge
	// and triples that have a pair in common => add a hard edge

	// hyper graph to maximum number of related edges
	var keys = Code.keys(matchedPairLookup);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var ids = key.split("-");
		var val = matchedPairLookup[key];
		var idA = ids[0];
		var idB = ids[1];
		if(val>1){
			// console.log("hard");
			var pointA = viewLocations[idA];
			var pointB = viewLocations[idB];

				var d = new DO();
				d.graphics().setLine(3.0,0xFF330033);
				d.graphics().beginPath();
				d.graphics().moveTo(pointA.x,pointA.y);
				d.graphics().lineTo(pointB.x,pointB.y);
				d.graphics().endPath();
				d.graphics().strokeLine();
				GLOBALSTAGE.addChild(d);

		}else{
			// console.log("soft");
		}
	}

	// ..
*/


	throw "_visualizeTriples";
}

App3DR.ProjectManager.prototype.findConsistentLowErrorPairs = function(pairs, isDense){ // A) remove inconsistent edges & B) remove worst loop-error causing edges
	var project = this;
	console.log(pairs);

	var views = project.views();
	var viewIDToIndex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		viewIDToIndex[viewID] = i;
	}



var removeList = {};

// removeList[""] = 1;

// removeList["0QXBI80R-R0HIACB5"] = 1;
// removeList["0QXBI80R-NYD98Y62"] = 1;
// removeList["0QXBI80R-TD6NYI6O"] = 1;
// removeList["0QXBI80R-DWV0FA8T"] = 1;


// INSERT TEST DATA HERE:

/*
	
	var transforms = [];
	for(var i=0; i<views.length; ++i){
		var m = new Matrix(4,4).identity();
			// m = Matrix.transform3DTranslate(m, 0,0,-10);
			m = Matrix.transform3DRotateY(m, Code.radians(-10*i));
			// m = Matrix.transform3DTranslate(m, 1,2,3);
			// m = Matrix.inverse(); // if want extrinsic
		transforms[i] = m;
	}
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var indexA = viewIDToIndex[idA];
		var indexB = viewIDToIndex[idB];
		var matrixA = transforms[indexA];
		var matrixB = transforms[indexB];
		// 
		var relAB = Matrix.relativeReference(matrixA,matrixB);
		// error
			var s = 0.0;
			// var s = 0.50;

			var a = Code.radians(0.0);
			// var a = Code.radians(10.0);


// BAD EDGE:
// if(i==4){ // less critical?
// if(i==6){
// if(i==10){ // less critical?
// if(i==14){
	console.log(pair);
	s = 1;
	a = Code.radians(45.0);
	relAB = Matrix.transform3DRotateX(relAB, Code.radians(20));
	relAB = Matrix.transform3DRotateY(relAB, Code.radians(10));
	relAB = Matrix.transform3DRotateZ(relAB, Code.radians(-20));
	pair["INFO"] = "TEST";
}else{
			// relAB = Matrix.transform3DTranslate(relAB, (Math.random()-0.5)*s,(Math.random()-0.5)*s,(Math.random()-0.5)*s);
			// relAB = Matrix.transform3DRotateX(relAB, (Math.random()-0.5)*a);
			// relAB = Matrix.transform3DRotateY(relAB, (Math.random()-0.5)*a);
			// relAB = Matrix.transform3DRotateZ(relAB, (Math.random()-0.5)*a);
}

			// console.log("R: "+pair["A"]+"->"+pair["B"]+"\n"+relAB)

			var R = Matrix.inverse(relAB); // extrinsic

			pair["relativeTransform"] = R.toObject();
	}


*/




	console.log("INFERENCE");
	// extract viable pairs & rotation matrixes
	var viewIDs = {};
	var viewPairs = [];
	var viewPairsIDToPair = {};
	for(var i=0; i<pairs.length; ++i){
		console.log(pairs[i]);
		var pair = pairs[i];
			viewPairsIDToPair[pair["id"]] = pair;
		var relativeCount = pair["relative"];
		var relativeError = pair["relativeError"];
		var R = pair["relativeTransform"]; // extrinsic
		if(pair["relative"]>0 && !removeList[pair["id"]] && R){
			var reprojectionError = relativeError/relativeCount;
				R = Matrix.fromObject(R);
				R.set(0,3, 0);
				R.set(1,3, 0);
				R.set(2,3, 0);
				// console.log(R);
				var forward = Matrix.inverse(R);
				var reverse = Matrix.inverse(forward);
			var idA = pair["A"];
			var idB = pair["B"];
			var viewPair = {};
				viewPair["A"] = idA;
				viewPair["B"] = idB;
				viewPair["id"] = pair["id"];
				viewPair["reprojectionError"] = reprojectionError;
				// viewPair["reprojectionError"] = relativeError;
				viewPair["forward"] = forward;
				viewPair["reverse"] = reverse;
				viewPair["INFO"] = pair["INFO"];
				viewPair["errors"] = [];
			viewPairs.push(viewPair);
			// keep list
			viewIDs[idA] = idA;
			viewIDs[idB] = idB;
		}
	}
	viewIDs = Code.objectToArray(viewIDs);


	// filter by dropping worst relative error pairs
	var errors = [];
	for(var i=0; i<viewPairs.length; ++i){
		var viewPair = viewPairs[i];
		var error = viewPair["reprojectionError"];
		errors.push(error);
	}

	console.log("viewPairs START: "+viewPairs.length);

	// exponential distribution:
	//var dropPercent = 0.95; // 0.95 - 0.99  --- OR DO REPEATED DROPPING @ 0.99-0.999
	var dropPercent = 0.99; // very worst
	var min = Code.min(errors);
	var mean = Code.mean(errors);
	console.log(" min: "+min);
	console.log("mean: "+mean);
	var lambda = 1.0/mean;
	console.log("lambda: "+lambda);
	var errorPairLimit = -Math.log(1.0 - dropPercent)/lambda;
	console.log("errorPairLimit: "+errorPairLimit);
console.log("viewPairs before: "+viewPairs.length);
Code.printMatlabArray(errors,"rError");

// drop very worst edges

// if(false){
if(true){
	console.log("drop before: "+viewPairs.length);
	var min = Code.min(errors);
	var sigma = Code.stdDev(errors,min);
	var limit = min + sigma*2.0;
	console.log("drop values: "+min+" + "+sigma+" = "+limit+" ? "+errorPairLimit+" : "+(limit-errorPairLimit));
	for(var i=0; i<viewPairs.length; ++i){
		var viewPair = viewPairs[i];
		var error = viewPair["reprojectionError"];
		// console.log("  error: "+error);
		// if(false){
		if(error>errorPairLimit){
			console.log("drop error pair: "+viewPair["id"]);
			Code.removeElementAt(viewPairs,i);
			--i;
		}
	}
	console.log("drop after: "+viewPairs.length);
	//
	Code.printMatlabArray(errors,"rError");

}


	// console.log(viewPairs);
	// console.log(viewIDs);
	// create graph with  pairs
	var viewGraph = new Graph();
	var viewIDToVertex = {};
	for(var i=0; i<viewIDs.length; ++i){
		var viewID = viewIDs[i];
		var vertex = viewGraph.addVertex();
			vertex.data({"view":viewID});
		viewIDToVertex[viewID] = vertex;
	}
	for(var i=0; i<viewPairs.length; ++i){
		var viewPair = viewPairs[i];
		var idA = viewPair["A"];
		var idB = viewPair["B"];
		var vertexA = viewIDToVertex[idA];
		var vertexB = viewIDToVertex[idB];
		var edge = viewGraph.addEdgeDuplex(vertexA,vertexB);
		viewPair["loops"] = [];
		edge.data(viewPair);
	}
	console.log(viewGraph);

	var groups = viewGraph.subgraphVertexes();
	groups.sort(function(a,b){
		return a.length>b.length ? -1 : 1;
	});
	console.log(groups);
	if(groups.length>0){
		// remove all vertexes & edges from smaller groups:
		var keepGroup = groups.shift();
		console.log("more than 1 group, keeping: "+keepGroup.length);
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			console.log(" >> remove: "+group.length);
			for(var v=0; v<group.length; ++v){
				var vertex = group[v];
				// vertex.removeEdge
				viewGraph.removeVertex(vertex);
			}
		}
	}

	// var groups = viewGraph.subgraphVertexes();
	// console.log(groups);


	// throw "???"
	// find all loops in graph
	// var root = viewGraph.vertexes()[0];
	// var result = viewGraph.loopsForVertex(root, 3);
	// var result = viewGraph.allLoops(4);
	var result = viewGraph.allLoops(5);
	// var result = viewGraph.allLoops(6);
	// console.log(result);
	// 3 = 15
	// 4 = 38
	// 5 = 69
	// 6 = 135
	var loops = result["loops"];
	for(var i=0; i<loops.length; ++i){
		var edges = loops[i];
		var loop = {"edges":edges};
		for(var j=0; j<edges.length; ++j){
			var edge = edges[j];
			var data = edge.data();
			data["loops"].push(loop);
		}
		loops[i] = loop;
	}
	// console.log(viewGraph.edges());
	console.log(loops);

	// calculate all loops round-trip error (does forward / backward matter ?)


var relAngleFxn = function(matrix){
	var x = rotation.multV3DtoV3D(new V3D(1,0,0));
	var y = rotation.multV3DtoV3D(new V3D(0,1,0));
	var z = rotation.multV3DtoV3D(new V3D(0,0,1));
	// var dx = V3D.distanceSquare(V3D.DIRX,x);
	// var dy = V3D.distanceSquare(V3D.DIRY,y);
	// var dz = V3D.distanceSquare(V3D.DIRZ,z);
	var angle = 0;
	angle += V3D.angle(V3D.DIRZ,z);
	angle += V3D.angle(V3D.DIRY,y);
	angle += V3D.angle(V3D.DIRX,x);
	angle /= 3;
	return angle;
}

	var dropIterations = 10;
	// var dropIterations = 1;
	// var dropIterations = 2;
	// var dropIterations = 3;
	// var dropIterations = 5;
	// 
	// TODO: find better way to keep minimally triple-connected graph (+ individual = 2 triples)
	if(isDense){ // need to keep the few edges have already
		dropIterations = 0;
	}
	for(var iterations=0; iterations<dropIterations; ++iterations){

		var errors = [];

		// clear all errors:
		var allEdges = viewGraph.edges();
		for(var j=0; j<allEdges.length; ++j){
			var edge = allEdges[j];
			var data = edge.data();
			data["errors"] = [];
		}
		
		for(var i=0; i<loops.length; ++i){
			var loop = loops[i];
			var edges = loop["edges"];

			// A needs to be the common value between:
			var a0 = edges[0].A();
			var b0 = edges[0].B();
			var a1 = edges[1].A();
			var b1 = edges[1].B();
			var vertex = null;
			if(a0==a1 || a0==b1){
				vertex = b0;
			}else{
				vertex = a0;
			}
			var rotation = new Matrix(4,4).identity();
			var str = "";
			var relError = 0;
			for(var j=0; j<edges.length; ++j){
				var edge = edges[j];
				var data = edge.data();
				var next = edge.opposite(vertex);
				var transform = null;
				if(vertex==edge.A()){ // forward
					transform = data["forward"];
					// transform = data["reverse"];
				}else{ //reverse
					transform = data["reverse"];
					// transform = data["forward"];
				}
				relError += relAngleFxn(transform);
				// rotation = Matrix.mult(transform, rotation);
				rotation = Matrix.mult(rotation,transform);

				str = str + "" + (vertex.data()["view"]+" -> "+next.data()["view"]+"("+data["INFO"]+")"+"   ");
				
				vertex = next;
			}

			// console.log(rotation+"");
			// console.log(rotation);
			// calculate error
			var x = rotation.multV3DtoV3D(new V3D(1,0,0));
			var y = rotation.multV3DtoV3D(new V3D(0,1,0));
			var z = rotation.multV3DtoV3D(new V3D(0,0,1));
			var dx = V3D.distanceSquare(V3D.DIRX,x);
			var dy = V3D.distanceSquare(V3D.DIRY,y);
			var dz = V3D.distanceSquare(V3D.DIRZ,z);
			
			// AXIS - DISTANCE - ERROR - SQARED
			var error = dx + dy + dz;
				// error = Math.sqrt(error);
			// console.log(error);

			// add angles x & y & z ?
			
			// error = Code.degrees(V3D.angle(V3D.DIRZ,z));
	// console.log(relError);
		
			// ANGLE ERROR
			// error = 0;
			// error += V3D.angle(V3D.DIRZ,z);
			// error += V3D.angle(V3D.DIRY,y);
			// error += V3D.angle(V3D.DIRX,x);
			// error /= 3;

			// console.log( Code.degrees(error) );
			// error /= relError;

			// error = error/edges.length;

	// error = Code.degrees(error);

			// console.log( Code.degrees(error) );

			loop["error"] = error;
			errors.push(error);

			// send error to edges:
			for(var j=0; j<edges.length; ++j){
				var edge = edges[j];
				var data = edge.data();
				data["errors"].push(error);
			}
			// console.log(str+" = "+error);
			// console.log("....................");
		}
		// console.log(errors);
		Code.printMatlabArray(errors,"errors");

		// average each edge's errors:
		var graphEdges = viewGraph.edges();
		for(var i=0; i<graphEdges.length; ++i){
			var edge = graphEdges[i];
			var data = edge.data();
			var edgeErrors = data["errors"];
			var mean = Code.averageNumbers(edgeErrors);
			data["error"] = mean;
		}

		// calculate outlier dropping:
		var info = Code.exponentialDistribution(errors);
		console.log(info);
		if(info==null){
			console.log(info);
			console.log("not enough samples to drop any");
			break;
			// throw "not enough samples?"
		}else{

			var limitA = Code.exponentialDistributionValueForPercent(info["min"],info["lambda"], 0.99);
			console.log("limitA: "+limitA);


		// limitA = 999999;

			var count = 0;
			var next = [];
			var missed = [];
			for(var i=0; i<errors.length; ++i){
				var error = errors[i];
				if(error<=limitA){
					next.push(error);
				}else{
					missed.push(error);
				}
			}
			// console.log(next);
			// console.log(missed);


			var info = Code.exponentialDistribution(next);
			console.log(info);

			var limitB = Code.exponentialDistributionValueForPercent(info["min"],info["lambda"], 0.999);
			// var limitB = Code.exponentialDistributionValueForPercent(info["min"],info["lambda"], 0.99);
			console.log("limitB: "+limitB);


			// mark bad edges
			var dropEdges = [];
			for(var i=0; i<loops.length; ++i){
				var loop = loops[i];
				var loopError = loop["error"];
				// if(loopError>limit90){ //
				if(loopError>limitA && loopError>limitB){ // drop worst inconsistently views
				// if(false){
					// console.log("bad loop: "+loopError);
					var edges = loop["edges"];
					var worstEdge = null;
					var worstError = null;
					for(var e=0; e<edges.length; ++e){
						var edge = edges[e];
						var data = edge.data();
						var edgeError = data["error"];
						if(worstEdge===null || worstError<edgeError){
							worstEdge = edge;
							worstError = edgeError;
						}
					}
					dropEdges[worstEdge.id()] = worstEdge;
				}
				// console.log();
			}
			var dropEdgesList = Code.objectToArray(dropEdges);
			if(dropEdgesList.length==0){
				console.log("dropEdgesList none");
				break;
			}else{
				console.log("dropEdgesList : "+dropEdgesList.length);
			}
			// console.log(dropEdgesList);
			// remove all loops containing bad edges
			var dropLoops = [];
			for(var i=0; i<loops.length; ++i){
				var loop = loops[i];
				var drop = false;
				var edges = loop["edges"];
				for(var j=0; j<edges.length; ++j){
					var edge = edges[j];
					// console.log(edge);
					if(dropEdges[edge.id()]){
						drop = true;
						break;
					}
				}
				if(drop){
					Code.removeElementAt(loops,i);
					--i;
				}
			}

			// remove worst edges from graph
			for(var i=0; i<dropEdgesList.length; ++i){
				var edge = dropEdgesList[i];
				var data = edge.data();
				console.log("DROPPING EDGE "+data["id"]);
				viewGraph.removeEdge(edge);
			}
			// Code.printMatlabArray(next,"next");
		} // check distribution 

	}

	console.log("viewGraph final edge count: "+viewGraph.edges().length);


/*


TODO: FIND ORIENTATION OUTLIERS USING LOOPS + BELIEF PROPAGATION

*/





	var list = viewPairs;

	// REMAINING PAIRS:
	var edges = viewGraph.edges();
	list = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		list.push(edge.data());
	}

	// viewPairs = list;



	var keepPairs = [];
	for(var i=0; i<list.length; ++i){
		var edge = list[i];
		var id = edge["id"];
		// console.log(id);
		var pair = viewPairsIDToPair[id];
		// console.log(index);
		// var pair = pairs[index];
		// console.log(pair);
		keepPairs.push(pair);
	}
	viewPairs = keepPairs;
	// console.log(viewPairs);
	// throw "?";






	// console.log(views);
	var showPairs = function(){
		console.log("showPairs");
// return;
		var circleRadius = 500;
		var totalOffX = 50;
		var totalOffY = 50;
		var circleCenter = new V2D(totalOffX + circleRadius,totalOffY + circleRadius);
		var imageSize = Math.round(circleRadius*1.5*Math.PI/views.length);


		var images = [];
		var matrixes = [];
		var viewIDs = [];
		var viewIDToIndex = {};
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var viewID = view.id();
			var image = view.anyLoadedImage();
			viewIDToIndex[viewID] = i;
			viewIDs[i] = viewID;
			var matrix = R3D.imageMatrixFromImage(image, project._stage);
			matrixes.push(matrix);
			images.push(image);
		}
		// put images in circle
		
		var centers = [];
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = matrixes[i];
			var size = Code.sizeToFitInside(imageSize,imageSize, matrix.width(),matrix.height());
			var imageScale = (size.x/matrix.width() + size.y/matrix.height())*0.5;

			var d = new DOImage(image);
			var angle = Math.PI * 2 * i/images.length;
			var offsetX = circleCenter.x + size.x*0.5 + circleRadius*Math.cos(angle);
			var offsetY = circleCenter.y + size.y*0.5 + circleRadius*Math.sin(angle);
			d.matrix().scale(imageScale);
			d.matrix().translate(offsetX - size.x*0.5, offsetY - size.y*0.5);
			GLOBALSTAGE.addChild(d);

			centers.push(new V2D(offsetX,offsetY));
		}
		// convert to list:



		// var list = pairs;
		// var list = viewPairs;



		var floats = [];
		var min = null;
		var max = null;
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var rError = pair["relativeError"];
			var rCount = pair["relative"];
			// console.log("rCount: "+rCount);
			// var similarity = similarities[i];
			// sims2.push( {"A":similarity["A"],"B":similarity["B"],"s":similarity["s"]} );
			var error = 0;
			if(rCount>0){
				error = rError/rCount;
				floats.push(error);
				if(min===null || min>error){
					min = error;
				}
				if(max===null || max<error){
					max = error;
				}
			}else{
				floats.push(-1);
			}
		}
		var ran = max-min;
		// ImageMat.normalFloat01(floats);
		console.log(floats);
		for(var i=0; i<floats.length; ++i){
			var float = floats[i];
			if(float>=0){
				float = (float-min)/ran;
				floats[i] = float;
			}
		}
		// show lines
		// var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFF9999];
		var colors = [0xFF0000FF, 0xFF990099, 0xFFFF0000];


		var list = viewPairs;
		// var list = pairs;
		var floats = [];
		for(var i=0; i<list.length; ++i){
			var pair = list[i];
			// var error = pair["error"];
			// var error = pair["errors"];
			var error = pair["relativeError"];
			// console.log(pair);
			// console.log(error);
			// error = Code.averageNumbers(error);
			floats.push(error);
		}
		ImageMat.normalFloat01(floats);

// var list = pairs;

var list = viewPairs;

// // REMAINING PAIRS:
// var edges = viewGraph.edges();
// list = [];
// for(var i=0; i<edges.length; ++i){
// 	var edge = edges[i];
// 	list.push(edge.data());
// }

// throw "?";

		for(var i=0; i<list.length; ++i){
			var pair = list[i];
			var idA = pair["A"];
			var idB = pair["B"];
			var error = floats[i];

			// var error = pair["error"];
			var indexA = viewIDToIndex[idA];
			var indexB = viewIDToIndex[idB];
			var start = centers[indexA];
			var ending = centers[indexB];
			var color = null;
			if(error<0){
				color = 0xFFCCCCCC;
			}else{
				color = Code.interpolateColorGradientARGB(error, colors);
				// color = 0xFF000033;
			}
			//
			// color = 0xFF000033;
			//
// var line = 0.5 + error*10.0;
// var line = 0.5 + error*10.0;
// var line = 1.0;
var line = 2.0;
			var d = new DO();
			// d.graphics().setLine(3.0,color);
			d.graphics().setLine(line,color);
			d.graphics().beginPath();
			d.graphics().moveTo(start.x,start.y);
			d.graphics().lineTo(ending.x,ending.y);
			d.graphics().endPath();
			d.graphics().strokeLine();
			GLOBALSTAGE.addChild(d);

		}
		// 
		// titles over:
		var textSize = 26;
		for(var i=0; i<centers.length; ++i){
			var center = centers[i];
			var title = ""+viewIDs[i];
			var textA = new DOText(title, textSize, DOText.FONT_ARIAL, 0xFF3366FF, DOText.ALIGN_CENTER);
			var textB = new DOText(title, textSize, DOText.FONT_ARIAL, 0xFF000033, DOText.ALIGN_CENTER);

				textA.matrix().translate(-1,-1);
				textB.matrix().translate(1,1);
			var textContainer = new DO();
				textContainer.addChild(textB);
				textContainer.addChild(textA);
				
			d.addChild(textContainer);
			var dir = V2D.sub(center,circleCenter);
			dir.length(textSize);
			textContainer.matrix().translate(center.x + dir.x, center.y + dir.y);
		}
		


	}

	// start

	var checkImagesLoaded = function(thing){
		++loadedImagesCount;
		if(expectedImagesCount==loadedImagesCount){
			showPairs();
		}
	}
	var expectedImagesCount = views.length;
	var loadedImagesCount = 0;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.loadIconImage(checkImagesLoaded, project);
	}

	// keep remainingEdges
	// var remainingEdges = [];
	// for(){

	// }

	return {"pairs":viewPairs};

}
App3DR.ProjectManager.connectedSets = function(views, pairs){

	// add all views + pairs to a graph
	var graph = new Graph();
	var viewIDToVertex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view["id"];
		var vertex = graph.addVertex();
		vertex.data(view);
		viewIDToVertex[viewID] = vertex;
	}

	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var pairsID = pair["id"];
		var vertexA = viewIDToVertex[pair["A"]];
		var vertexB = viewIDToVertex[pair["B"]];
		var edge = graph.addEdgeDuplex(vertexA,vertexB, 1.0);
		// var vertex = graph.addVertex();
		edge.data(pair);
	}

	var sets = graph.disjointSets();
	// console.log(sets);
	var setList = [];
	for(var i=0; i<sets.length; ++i){
		var set = sets[i];
		var setViews = [];
		var setPairs = {};
		for(var j=0; j<set.length; ++j){
			var vertex = set[j];
			var view = vertex.data();
			setViews.push(view);
			var edges = vertex.edges();
			for(var k=0; k<edges.length; ++k){
				var edge = edges[k];
				var pair = edge.data();
				setPairs[pair["id"]] = pair;
			}
		} // Graph.reachableEdges = function(graph,source);
		setPairs = Code.objectToArray(setPairs);
		var setObject = {"views":setViews, "pairs":setPairs};
		setList.push(setObject);
	}
	// console.log(setList);
	return {"sets":setList};
}
App3DR.ProjectManager.prototype.triplesFromBestPairs = function(views, pairs, isDense){ // finds sets of triples: A) connected if possible B) only top-choices (not exhaustive)
	var graphTopChoiceMinimumCount = 3; // 2-4
	var graphDesiredMinimumTripleCount = 3; // 2-4
	if(isDense){
		// throw "maybe need fewer?";
		var graphTopChoiceMinimumCount = 2;
		var graphDesiredMinimumTripleCount = 2;
	}

	// testing
	// var graphTopChoiceMinimumCount = 1;
	// var graphDesiredMinimumTripleCount = 2;

	console.log(views);
	console.log(pairs);
	console.log(isDense);

	var indexError = "relativeError";
	var indexCount = "relative";
	var indexTransform = "relativeTransform";

	var relAngleFxn = function(matrix){
		var x = rotation.multV3DtoV3D(new V3D(1,0,0));
		var y = rotation.multV3DtoV3D(new V3D(0,1,0));
		var z = rotation.multV3DtoV3D(new V3D(0,0,1));
		// var dx = V3D.distanceSquare(V3D.DIRX,x);
		// var dy = V3D.distanceSquare(V3D.DIRY,y);
		// var dz = V3D.distanceSquare(V3D.DIRZ,z);
		var angle = 0;
		angle += V3D.angle(V3D.DIRZ,z);
		angle += V3D.angle(V3D.DIRY,y);
		angle += V3D.angle(V3D.DIRX,x);
		angle /= 3;
		return angle;
	}

	var sortRelativeError = function(a,b){
		return a["relativeError"] < b["relativeError"] ? -1 : 1;
	}

	// var sortRelativeError = function(a,b){
	// 	return a["relativeError"] < b["relativeError"] ? -1 : 1;
	// }


	var pairRotations = {};
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var pairID = pair["id"];
		var transform = pair[indexTransform];
		var R = Matrix.fromObject(transform);
			R.set(0,3, 0);
			R.set(1,3, 0);
			R.set(2,3, 0);
		var forward = Matrix.inverse(R);
		var reverse = Matrix.inverse(forward);
		pairRotations[pairID] = {"forward":forward, "reverse":reverse};
	}

	// separate graph into connected sets
	var connectivity = App3DR.ProjectManager.connectedSets(views, pairs);
	// console.log(connectivity);
	var sets = connectivity["sets"];

	var cummulativeTripleList = [];
	// for each set: views + pairs:
	for(var i=0; i<sets.length; ++i){
		var set = sets[i];
		// console.log(set);
		var setViews = set["views"];
		var setPairs = set["pairs"];
		console.log(setViews);
		console.log(setPairs);
		var pairIDToSetPair = {};
		for(var j=0; j<setPairs.length; ++j){
			var pair = setPairs[j];
			var pairID = pair["id"];
			pairIDToSetPair[pairID] = pair;
		}
		console.log(pairIDToSetPair);
		// get list of all possible triples formable (triples with at least two edges)
		var possibleTriples = {};
		for(var a=0; a<setPairs.length; ++a){
			var pairA = setPairs[a];
			var idAA = pairA["A"];
			var idAB = pairA["B"];
			for(var b=a+1; b<setPairs.length; ++b){
				var pairB = setPairs[b];
				var idBA = pairB["A"];
				var idBB = pairB["B"];
				// any overlap:
				if(idAA==idBA || idAA==idBB || idAB==idBA || idAB==idBB){
					var uniqueStrings = Code.uniqueStrings([idAA,idAB,idBA,idBB]);
					uniqueStrings.sort();
					var idA = uniqueStrings[0];
					var idB = uniqueStrings[1];
					var idC = uniqueStrings[2];
					var tripleID = idA+"-"+idB+"-"+idC;
					if(possibleTriples[tripleID]){
						continue;
					}
					var pairAB = idA+"-"+idB;
					var pairAC = idA+"-"+idC;
					var pairBC = idB+"-"+idC;
						pairAB = pairIDToSetPair[pairAB];
						pairAC = pairIDToSetPair[pairAC];
						pairBC = pairIDToSetPair[pairBC];
					var ps = [];
					if(pairAB){
						ps.push(pairAB);
					}
					if(pairAC){
						ps.push(pairAC);
					}
					if(pairBC){
						ps.push(pairBC);
					}
					// doesn't yet exit
					var triple = {};
					triple["id"] = tripleID;
					triple["A"] = idA;
					triple["B"] = idB;
					triple["C"] = idC;
					triple["pairs"] = ps;
					possibleTriples[tripleID] = triple;
				}
			}
		}

		console.log(possibleTriples);
		var tripleIndexes = Code.keys(possibleTriples);
		// get list of triples with only single edge missing
		var pseudoTriples = [];
		for(var k=0; k<tripleIndexes.length; ++k){
			var key = tripleIndexes[k];
			var triple = possibleTriples[key];
			var ps = triple["pairs"];
			if(ps.length==2){  // 1 of the 3 edges doesn't exist
				pseudoTriples.push(triple);
			}
		}
		console.log(pseudoTriples);
		// create list of 'pseudo' edges from possible triples:
		var pseudoEdges = {};
		var allPseudoEdges = [];
		for(var k=0; k<pseudoTriples.length; ++k){
			var triple = pseudoTriples[k];
			var idA = triple["A"];
			var idB = triple["B"];
			var idC = triple["C"];
			var pairAB = idA+"-"+idB;
			var pairAC = idA+"-"+idC;
			var pairBC = idB+"-"+idC;
			var edgeID = null;
			if(!pairIDToSetPair[pairAB]){
				edgeID = pairAB;
			}else if(!pairIDToSetPair[pairAC]){
				edgeID = pairAC;
			}else if(!pairIDToSetPair[pairBC]){
				edgeID = pairBC;
			}
			var edge = {};
				edge["id"] = edgeID;
				edge["triple"] = triple;
				
			if(!pseudoEdges[edgeID]){
				var pseudoEdge = {};
				var ps = edgeID.split("-");
					pseudoEdge["id"] = edgeID;
					pseudoEdge["A"] = ps[0];
					pseudoEdge["B"] = ps[1];
					pseudoEdge["errorWeight"] = 0;
					pseudoEdge["errorAngle"] = 0;
					pseudoEdge["edges"] = [];
				pseudoEdges[edgeID] = pseudoEdge;
			}
			pseudoEdges[edgeID]["edges"].push(edge);
			allPseudoEdges.push(edge);
		}
		console.log(pseudoEdges);
console.log("allPseudoEdges");
		
		for(var k=0; k<allPseudoEdges.length; ++k){ // record error = sum of 2 edge error & rotational error: predicted angle from A->B->C
			var edge = allPseudoEdges[k];
			var edgeID = edge["id"];
			var triple = edge["triple"];
			var idA = triple["A"];
			var idB = triple["B"];
			var idC = triple["C"];
			var pairIDAB = idA+"-"+idB;
			var pairIDAC = idA+"-"+idC;
			var pairIDBC = idB+"-"+idC;
				pairAB = pairIDToSetPair[pairIDAB];
				pairAC = pairIDToSetPair[pairIDAC];
				pairBC = pairIDToSetPair[pairIDBC];
			var error = null;
			var transform = null;
			var pairA = null;
			var pairB = null;
			var transformA = null;
			var transformB = null;
			if(pairAB && pairBC){ // A->B->C
				pairA = pairAB;
				pairB = pairBC;
				transformA = pairRotations[pairIDAB]["forward"];
				transformB = pairRotations[pairIDBC]["forward"];
			}else if(pairAC && pairBC){ // B->C->A
				pairA = pairBC;
				pairB = pairAC;
				transformA = pairRotations[pairIDBC]["forward"];
				transformB = pairRotations[pairIDAC]["reverse"];
			}else if(pairAC && pairAB){ // C->A->B
				pairA = pairAC;
				pairB = pairAB;
				transformA = pairRotations[pairIDAC]["reverse"];
				transformB = pairRotations[pairIDAB]["forward"];
			}
			var errorA = pairA[indexError]/pairA[indexCount];
			var errorB = pairB[indexError]/pairB[indexCount];
			error = errorA + errorB;
			// console.log(pairA[indexError],pairB[indexError]);
			// console.log(error);
			// 
			var rotation = new Matrix(4,4);
				rotation.identity();
				rotation = Matrix.mult(rotation,transformA);
				rotation = Matrix.mult(rotation,transformB);
			var rotationError = relAngleFxn(rotation);
			// console.log(transformA,transformB);
			// console.log(rotationError);
			
			pseudoEdges[edgeID]["errorWeight"] += error;
			pseudoEdges[edgeID]["errorAngle"] += rotationError;

		}
		// average all errors & angles
		pseudoEdgeIndexes = Code.keys(pseudoEdges);
		var pseudoEdgeList = [];
		for(var k=0; k<pseudoEdgeIndexes.length; ++k){
			var key = pseudoEdgeIndexes[k];
			var pseudoEdge = pseudoEdges[key];
			var count = pseudoEdge["edges"].length;
			// total score = error * angle^P  P = 1 - 1/2
			var errorEdges = (pseudoEdge["errorWeight"]/count);
			var errorAngles = Math.pow(pseudoEdge["errorAngle"]/count, 1); // 1.0 -> 0.5
			// pseudoEdge["error"] = errorEdges * errorAngles;
			pseudoEdge["error"] = errorEdges;
			pseudoEdgeList.push(pseudoEdge);
		}
		pseudoEdgeList.sort(function(a,b){
			return a["error"] < b["error"] ? -1 : 1;
		});
		console.log(pseudoEdgeList);
		

		// vertex index list for set
		var setViewIndexFromViewID = {};
		var setViewIDFromIndex = {};
		for(var j=0; j<setViews.length; ++j){
			var view = setViews[j];
			var viewID = view["id"];
			setViewIndexFromViewID[viewID] = j;
			setViewIDFromIndex[j] = viewID;
		}
		// find each views top priority pairs
		// var setViews = set["views"];
		// var setPairs = set["pairs"];
		var viewPairsList = Code.newArrayArrays(setViews.length);
		for(var j=0; j<setPairs.length; ++j){
			var pair = setPairs[j];
			var idA = pair["A"];
			var idB = pair["B"];
			// add pair to view's list
			var indexA = setViewIndexFromViewID[idA];
			var indexB = setViewIndexFromViewID[idB];
			viewPairsList[indexA].push(pair);
			viewPairsList[indexB].push(pair);
		}
		console.log(viewPairsList);

		// sort each view list by id
		for(var j=0; j<viewPairsList.length; ++j){
			viewPairsList[j].sort(sortRelativeError);
		}
		

		var pairInitialList = [];
		var pairAddedLookup = {};

		for(var j=0; j<setViews.length; ++j){
			var list = viewPairsList[j];
			var maxCount = Math.min(list.length,graphTopChoiceMinimumCount);
			for(var k=0; k<maxCount; ++k){
				var pair = list[k];
				var pairID = pair["id"];
				if(pairAddedLookup[pairID]){
					continue;
				}
				pairAddedLookup[pairID] = true;
				pairInitialList.push(pair);
			}
		}
		console.log(pairInitialList);

		// find remaining edges
		var pairRemainingList = [];
		for(var j=0; j<setPairs.length; ++j){
			var pair = setPairs[j];
			var pairID = pair["id"];
			if(pairAddedLookup[pairID]){
				continue;
			}
			pairAddedLookup[pairID] = true;
			pairRemainingList.push(pair);
		}
		console.log(pairRemainingList);

		console.log("PSEUDO LIST");
		// for each pseudo triple - sort triples by computed error
		console.log(pseudoEdgeList);
		for(var j=0; j<pseudoEdgeList.length; ++j){
			var pseudoEdge = pseudoEdgeList[j];
			pairRemainingList.push(pseudoEdge);
		}

		console.log("STARTING: ");
		// console.log();
		console.log(pairInitialList);
		console.log(pairRemainingList);

		var pairLists = [pairInitialList,pairRemainingList];
		for(var j=0; j<pairLists.length; ++j){
			var pairList = pairLists[j];
			for(var k=0; k<pairList.length; ++k){
				var entry = pairList[k];
				// console.log(entry);
				// convert to index pair:
				var idA = entry["A"];
				var idB = entry["B"];
				var indexA = setViewIndexFromViewID[idA];
				var indexB = setViewIndexFromViewID[idB];
				// create edge entry
				// var pair = [indexA,indexB];
				var pair = {"A":indexA, "B":indexB, "value":entry};
				pairList[k] = pair;
			}
		}
		console.log(pairInitialList);
		console.log(pairRemainingList);

		// create graph
		var hyperGraph = new ViewHyperGraph();
// console.log("A");
			hyperGraph.setViewCount(setViews.length);
// console.log("B");
			hyperGraph.setInitialPairs(pairInitialList);
// console.log("C");
			hyperGraph.satisfyViewGraphParameters(pairRemainingList, graphDesiredMinimumTripleCount);
// console.log("D");
			// create match list from garph
		var hyperPairs = hyperGraph.generateMatchList();
		console.log(hyperPairs);
		
		// convert back to set pairs
		var keepPairs = [];
		for(var j=0; j<hyperPairs.length; ++j){
			var hyperPair = hyperPairs[j];
			var indexA = hyperPair["A"];
			var indexB = hyperPair["B"];
			var idA = setViewIDFromIndex[indexA];
			var idB = setViewIDFromIndex[indexB];
			// var min = idA < idB ? idA : idB;
			// var max = idA > idB ? idA : idB;
			// var pairID = min+"-"+max;
			var pair = {"A":idA, "B":idB};//, "id":pairID}
			keepPairs.push(pair);
		}
		console.log(keepPairs);

		// create final keep triples - every edge permutation, as long as all 3 edges exist AND 2 edges are non-pseudo
		var finalTriples = {};
		for(var a=0; a<keepPairs.length; ++a){
			var pairA = keepPairs[a];
			// var pairIDA = pairA["id"];
			var idAA = pairA["A"];
			var idAB = pairA["B"];
			for(var b=a+1; b<keepPairs.length; ++b){
				var pairB = keepPairs[b];
				// var pairIDB = pairB["id"];
				var idBA = pairB["A"];
				var idBB = pairB["B"];
				//
				// any overlap:
				if(idAA==idBA || idAA==idBB || idAB==idBA || idAB==idBB){
					var uniqueStrings = Code.uniqueStrings([idAA,idAB,idBA,idBB]);
					uniqueStrings.sort();
					var idA = uniqueStrings[0];
					var idB = uniqueStrings[1];
					var idC = uniqueStrings[2];
					var tripleID = idA+"-"+idB+"-"+idC;
					if(finalTriples[tripleID]){
						continue;
					}
					var pairAB = idA+"-"+idB;
					var pairAC = idA+"-"+idC;
					var pairBC = idB+"-"+idC;
					var pairABObject = pairIDToSetPair[pairAB];
					var pairACObject = pairIDToSetPair[pairAC];
					var pairBCObject = pairIDToSetPair[pairBC];
					var ps = [];
					if(pairABObject){
						ps.push(pairAB);
					}
					if(pairACObject){
						ps.push(pairAC);
					}
					if(pairBCObject){
						ps.push(pairBC);
					}
					if(ps.length>=2){ // at least 2 pairs have to exist in input set
						var triple = {};
						triple["id"] = tripleID;
						triple["A"] = idA;
						triple["B"] = idB;
						triple["C"] = idC;
						triple["gauge"] = null;
						triple["pairs"] = ps;
						finalTriples[tripleID] = triple;
					}
				}
			}
		}

		console.log(finalTriples);
		finalTriples = Code.objectToArray(finalTriples);
		for(var j=0; j<finalTriples.length; ++j){
			var triple = finalTriples[j];
			cummulativeTripleList.push(triple);
		}
	} // end sets

	// combine all edges from each set into final list of sets
	console.log(cummulativeTripleList);

	// throw "?";

	return {"triples":cummulativeTripleList};



	// OLD CODE:






	var minimumRelativeCount = 100; // tracks:  poor-avg-good  |  sparse =  100-200-500   |  dense = 1000-10k
	// var maximumIndividualPairCount = 4; // 3 - 6 [at least 2 others to guarantee relative-ness, at least 4 for error]
	if(isDense){
		minimumRelativeCount = 200; // 
		// maximumIndividualPairCount = 3; // 2 - 4
	}


	maximumIndividualPairCount = 10; // 223 v
	// maximumIndividualPairCount = 4; // 185 ^


	// TODO: ANY REDUCTION IN TRIPLES NEEDS TO MAKE SURE THAT ALL VIEWS ARE REACHABLE IN A PAIRGRAPH

	console.log(pairs);
	// throw "???"
	// bookkeeping
	var viewLookup = {};
	var pairLookup = {};
	var sortByScore = function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	}
	var addViewLookupPair = function(viewIDA,viewIDB,score){
		var list = viewLookup[viewIDA];
		if(!list){
			list = [];
			viewLookup[viewIDA] = list;
		}
		list.push({"opposite":viewIDB, "score":score});
	}
	// get each view's possible pairs:
	var keepCount = 0;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeCount = pair["tracks"];
		// console.log("relativeCount: "+relativeCount);
		if(!(relativeCount && relativeCount>minimumRelativeCount)){
			console.log("SKIP: "+relativeCount);
			continue;
		}
		++keepCount;
		var errorR = pair["relativeError"];
		addViewLookupPair(pair["A"],pair["B"],errorR);
		addViewLookupPair(pair["B"],pair["A"],errorR);
	}
console.log("keepCount: "+keepCount);
	console.log(viewLookup);
	// get each view's top pairs, limit to max count
	var viewIDs = Code.keys(viewLookup);
	for(var i=0; i<viewIDs.length; ++i){
		var viewID = viewIDs[i];
		var list = viewLookup[viewID];
		list.sort(sortByScore);
		// TODO: should use sigma or something else to limit really poor matches?
		Code.truncateArray(list,maximumIndividualPairCount);
		// add pair to possible pair list:
		for(var j=0; j<list.length; ++j){
			var entry = list[j];
			var viewOpp = entry["opposite"];
			var isLess = viewID < viewOpp;
			var viewAID = isLess ? viewID : viewOpp;
			var viewBID = isLess ? viewOpp : viewID;
			var pairID = viewAID+"-"+viewBID;
			pairLookup[pairID] = {"id":pairID,"A":viewAID,"B":viewBID};
		}
	}
	console.log(pairLookup);
	var pairArray = Code.objectToArray(pairLookup);

	// console.log(pairArray);
	// throw "?"
	
	// create triples from truncated pair array
	triples = {};
	var haveTriples = 0;
	for(var i=0; i<pairArray.length; ++i){
		var pairA = pairArray[i];
		var idAA = pairA["A"];
		var idAB = pairA["B"];
		for(var j=i+1; j<pairArray.length; ++j){
			var pairB = pairArray[j];
			var idBA = pairB["A"];
			var idBB = pairB["B"];
			// any overlap:
			if(idAA==idBA || idAA==idBB || idAB==idBA || idAB==idBB){
				var uniqueStrings = Code.uniqueStrings([idAA,idAB,idBA,idBB]);
					uniqueStrings.sort();
if(uniqueStrings.length!=3){
	console.log(uniqueStrings);
	throw "?"
}
				var idA = uniqueStrings[0];
				var idB = uniqueStrings[1];
				var idC = uniqueStrings[2];
				var tripleID = idA+"-"+idB+"-"+idC;
				// console.log(tripleID);
				if(triples[tripleID]){
					// console.log(triples[tripleID]);
					// console.log("triple already exists: "+tripleID);
					// throw "triple already exists?";
					continue;
				}
				var triple = {};
					triple["id"] = tripleID;
					triple["A"] = idA;
					triple["B"] = idB;
					triple["C"] = idC;
				triples[tripleID] = triple;
			}
		}
	}
	// console.log(triples);
	triples = Code.objectToArray(triples);
	// console.log(triples);
	// throw "?";
	return triples;
}


App3DR.ProjectManager.prototype.densePutativePairsFromPointList = function(views, points, viewMaximumTopPairCount, viewMinimumTripleCount){
	viewMaximumTopPairCount = Code.valueOrDefault(viewMaximumTopPairCount, 3); // 2-3
	viewMinimumTripleCount = Code.valueOrDefault(viewMinimumTripleCount, 3); // 2-3
	// inheritly contains original pair info based on point counts from points originally shared in tracks
	// inheritly contains geometric info based on how many points collided and are therefore (likely) visible 
	var project = this;
	console.log("densePutativePairsFromPointList");
	console.log(points);
	var pairIDFromViewIDs = function(a,b){
		return a<b ? a+"-"+b : b+"-"+a;
	}

	var viewIDs = [];
	var viewIDToIndex = {};
	var viewIndexToID = {};
	var viewAddedCounts = {};//Code.newArrayZeros(views.length);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		console.log(view);
		var viewID = view["id"];
		viewIDs.push(viewID);
		viewIDToIndex[viewID] = i;
		viewIndexToID[i] = viewID;
		viewAddedCounts[viewID] = 0;
	}
	var pairListing = {};

	
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var vs = point["v"];
		// console.log(vs.length);
		for(var j=0; j<vs.length; ++j){
			var a = vs[j];
			var idA = a["i"];
			for(var k=j+1; k<vs.length; ++k){
				var b = vs[k];
				var idB = b["i"];
				var pairID = pairIDFromViewIDs(idA,idB);
				var pairInfo = pairListing[pairID];
				if(!pairInfo){
					pairInfo = {};
						pairInfo["id"] = pairID;
						pairInfo["count"] = 0;
						pairInfo["A"] = idA < idB ? idA : idB;
						pairInfo["B"] = idA > idB ? idA : idB;
					pairListing[pairID] = pairInfo;
				}
				pairInfo["count"] += 1;
			}
		}
	}
	console.log(pairListing);
	pairListing = Code.objectToArray(pairListing);
	pairListing.sort(function(a,b){
		return a["count"] > b["count"] ? -1 : 1;
	});
	console.log(pairListing);

	// TODO: MAY NEED TO CHECK FOR FULL GRAPH CONNECTIVITY - SEPARATE INTO SETS
	console.log("TODO: CHECK FULL GRAPH CONNECTIVITY");

	// each view gets to pick top favorite edges
	usedPairs = {};
	var initialPairs = [];
	var remainingPairs = [];
	for(var i=0; i<pairListing.length; ++i){
		var pair = pairListing[i];
		var pairID = pair["id"];
		var vs = [pair["A"],pair["B"]];
		for(var j=0; j<vs.length; ++j){
			var viewID = vs[j];
			var viewCount = viewAddedCounts[viewID];
			if(viewCount<viewMaximumTopPairCount){
				viewAddedCounts[viewID] = viewCount + 1;
				if(!usedPairs[pairID]){
					usedPairs[pairID] = true;
					initialPairs.push(pair);
				}
			}
		}
		if(!usedPairs[pairID]){
			usedPairs[pairID] = true;
			remainingPairs.push(pair);
		}
	}
	console.log(initialPairs);
	console.log(remainingPairs);

	// convert to hypergraph input
	var lists = [initialPairs,remainingPairs];
	for(var i=0; i<lists.length; ++i){
		var list = lists[i];
		for(var j=0; j<list.length; ++j){
			var pair = list[j];
			var indexA = viewIDToIndex[pair["A"]];
			var indexB = viewIDToIndex[pair["B"]];
			var entry = {"A":indexA, "B":indexB, "value":pair};
			list[j] = entry;
		}
	}
	// console.log(initialPairs);
	// console.log(remainingPairs);

	// throw "?"


	// 
// var pair = {"A":indexA, "B":indexB, "value":entry};


		// create graph
		var hyperGraph = new ViewHyperGraph();
			hyperGraph.setViewCount(views.length);
			hyperGraph.setInitialPairs(initialPairs);
			hyperGraph.satisfyViewGraphParameters(remainingPairs, viewMinimumTripleCount);
			// create match list from graph
		var hyperPairs = hyperGraph.generateMatchList();
		console.log(hyperPairs);
		// console.log("viewMinimumTripleCount: "+viewMinimumTripleCount);
	// convert hyper pairs to pairs:
	var minimalPairs = [];
	for(var i=0; i<hyperPairs.length; ++i){
		var pair = hyperPairs[i];
		var info = pair["value"];
		var idA = info["A"];
		var idB = info["B"];
		var count = info["count"];
		var entry = {"A":idA, "B":idB, "s":count};
		minimalPairs.push(entry);
	}

// DISPLAY:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	// MINIMAL GRAPH
	var compareScores = [];
	for(var i=0; i<hyperPairs.length; ++i){
		var pair = hyperPairs[i];
		var indexA = pair["A"];
		var indexB = pair["B"];
		var info = pair["value"];
		var value = info["count"];
			value = Math.pow(value,0.5);
		var entry = {"A":indexA, "B":indexB, "value":value};
		compareScores.push(entry);
	}


	// ORIGINAL
	// var compareScores = [];
	// for(var i=0; i<pairListing.length; ++i){
	// 	var listing = pairListing[i];
	// 	var indexA = viewIDToIndex[listing["A"]];
	// 	var indexB = viewIDToIndex[listing["B"]];
	// 	var value = listing["count"];
	// 		value = Math.pow(value,0.5);
	// 	var entry = {"A":indexA, "B":indexB, "value":value};
	// 	compareScores.push(entry);
	// }

// throw "here: showViewSimilarities?"
	project.showViewSimilarities(compareScores, viewIDs, 700);

	return {"pairs":minimalPairs};
}
App3DR.ProjectManager.bestImagesToLoadForViewPair = function(viewIDA, viewIDB, allPairs, includePairs, maxCount, percentLimit){
	console.log(viewIDA);
	console.log(viewIDB);
	console.log(allPairs);
	console.log(includePairs);
	console.log(maxCount);
	console.log(percentLimit);

	maxCount = Code.valueOrDefault(maxCount,6);
	percentLimit = Code.valueOrDefault(percentLimit,0.50); // 10 %
	
	var allViewIDs = {};
	for(var i=0; i<allPairs.length; ++i){
		var pair = allPairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		if( idA!==viewIDA && idA!==viewIDB && idB!==viewIDB && idB!==viewIDB ){
			// console.log("not contain any of the pair "+idA+"-"+idB);
			continue;
		}
		var list;
		var count = pair["count"];
		if(viewIDA==idA){
			if(viewIDB==idB){
				// skip
			}else{
				list = allViewIDs[idB];
				if(!list){
					list = [];
					allViewIDs[idB] = list;
				}
				list.push(count);
			}
		}else if(viewIDA==idB){
			if(viewIDB==idA){
				// skip
			}else{
				list = allViewIDs[idA];
				if(!list){
					list = [];
					allViewIDs[idA] = list;
				}
				list.push(count);
			}
		}else if(viewIDB==idA){
			if(viewIDA==idB){
				// skip
			}else{
				list = allViewIDs[idB];
				if(!list){
					list = [];
					allViewIDs[idB] = list;
				}
				list.push(count);
			}
		}else if(viewIDB==idB){
			if(viewIDA==idA){
				// skip
			}else{
				list = allViewIDs[idA];
				if(!list){
					list = [];
					allViewIDs[idA] = list;
				}
				list.push(count);
			}
		}
	}
	console.log(allViewIDs);
	var keys = Code.keys(allViewIDs);
	var allViewsShared = [];
	for(var i=0; i<keys.length; ++i){
		var viewID = keys[i];
		var array = allViewIDs[viewID];
		var avg = Code.averageNumbers(array);
		// allViewIDs[viewID] = Code.averageNumbers(array);
		allViewsShared.push([viewID, avg]);
	}
	allViewsShared.sort(function(a,b){
		return a[1] > b[1] ? -1 : 1;
	});
	console.log(allViewsShared);
	
	// include 
	var includeViewIDs = [];
	// always include the 2 main pars
	includeViewIDs.push(viewIDA);
	includeViewIDs.push(viewIDB);
	for(var i=0; i<allViewsShared.length; ++i){
		if(includeViewIDs.length>=maxCount){
			break;
		}
		var entry = allViewsShared[i];
		includeViewIDs.push(entry[0]);
	}
	console.log(includeViewIDs);

	// throw " bestImagesToLoadForViewPair ?"
	return includeViewIDs;




return []; // dont load any images

	// minCount = Code.valueOrDefault(minCount,2);
	
console.log("maxCount: "+maxCount);
	// console.log(viewIDA);
	// console.log(viewIDB);
	// console.log(allPairs);
	// console.log(includePairs);
	// console.log("out");
	
	
	// form a graph with included pairs

	// find distance to a given view as the maximum of: A or B distance:

	// 

	//


return allViews;


	throw "based on graph distance ..."


	
	// console.log(allViewIDs);

	// filter usable pairs 
	var availablePairs = [];
	for(var i=0; i<allPairs.length; ++i){
		var pair = allPairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		if(idA==viewIDA || idA==viewIDB || idB==viewIDA || idB==viewIDB){ // one is part of pair
			if(allViewIDs[idA] || allViewIDs[idB]){ // both are in include list
				availablePairs.push(pair);
			}
		}
	}
	// order by frequency
	availablePairs.sort(function(a,b){
		return a["count"] > b["count"] ? -1 : 1;
	});
	console.log(availablePairs);
	// throw "..."
	// find maximum for A & B
	var maximumCount = {};
		maximumCount[viewIDA] = 0;
		maximumCount[viewIDB] = 0;
	for(var i=0; i<availablePairs.length; ++i){
		var pair = availablePairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var count = pair["count"];
		// console.log(count);
		if(idA==viewIDA || idB==viewIDA){
			var current = maximumCount[viewIDA];
			maximumCount[viewIDA] = Math.max(current,count);
		}
		if(idA==viewIDB || idB==viewIDB){
			var current = maximumCount[viewIDB];
			maximumCount[viewIDB] = Math.max(current,count);
		}
	}
	// console.log(maximumCount);
	var maximumCountA = maximumCount[viewIDA];
	var maximumCountB = maximumCount[viewIDB];
	// include first 2 images
	var bestImageIDs = {};
	bestImageIDs[viewIDA] = viewIDA;
	bestImageIDs[viewIDB] = viewIDB;
	var includeCount = 2;
	// keep including next until limit
	var quit = false;
	for(var i=0; i<availablePairs.length; ++i){
		if(includeCount==maxCount){
			quit = true;
			break;
		}
		if(quit){
			break;
		}
		var pair = availablePairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var count = pair["count"];
		var list = [idA,idB];
		var cnts = [maximumCountA,maximumCountB];
		for(var j=0; j<list.length; ++j){
			var id = list[j];
			var exists = bestImageIDs[id];
			if(!exists){
				var percent = count/cnts[j];
				if(percent>percentLimit){
					console.log(" keep "+id+" = "+percent);
					bestImageIDs[id] = id;
					++includeCount;
					if(includeCount==maxCount){
						quit = true;
						break;
					}
				}
			}
		}
	}
	// console.log(bestImageIDs);
	bestImageIDs = Code.objectToArray(bestImageIDs);
	// console.log(bestImageIDs);
	return bestImageIDs;
}
App3DR.ProjectManager.prototype._iterateSparseTracks = function(sourceData, sourceFilename, isDense){
	var project = this;
	isDense = Code.valueOrDefault(isDense, false);

	var maximumImagesLoad = 4; // 3 ~ 6 // ----- currently not used, approximating with geometry
	// ...
	var cellCount = 40; // ???? from somewhere
	// AVG CHANGE IN PIXEL ERROR : 0.001 = 1 pixel
	var minimumGroupPixelDeltaErrorPerUnity = 0.00001; // 1/100 pixel
	var minimumBundlePixelDeltaErrorPerUnity = 0.00001; // 1E-5
	if(isDense){
		cellCount = 60; // 60-80
		minimumGroupPixelDeltaErrorPerUnity = 0.0000001; // 1/10000 pixel
		minimumBundlePixelDeltaErrorPerUnity = 0.0000001; // 1E-7
		//                                     0.0000003.673654286540467e-7
	}


// throw "_iterateSparseTracks";

// make higher rates of intersection:
// cellCount = 20;

	console.log(sourceData);
	var graphFile = sourceData["graph"];
	console.log(graphFile);
	var basePath = Code.pathRemoveLastComponent(sourceFilename);
	console.log(basePath);

	var sortBestPairCount = function(a,b){
		return a[1] > b[1] ? -1 : 1;
	}
	var sortBestPairError = function(a,b){
		return a[1] < b[1] ? -1 : 1;
	}
	/*
	var bestNextViewsForViews = function(viewsIn, pairsIn, paramKey){
		console.log("bestNextViewsForViews");
		console.log(viewsIn);
		console.log(pairsIn);
		console.log(paramKey);
		var bests = [];
		for(var i=0; i<viewsIn.length; ++i){
			var viewIDA = viewsIn[i];
			console.log("viewIDA: "+viewIDA);
			bests[i] = [];
			for(var j=0; j<pairsIn.length; ++j){
				var pair = pairsIn[j];
				console.log(pair);
				var viewIDB = null;
				if(pair["A"]==viewIDA){
					viewIDB = pair["B"];
				}else if(pair["B"]==viewIDA){
					viewIDB = pair["A"];
				}else{
					continue;
				}
				var count = 1;
				if(paramKey){
					count = pair[paramKey];
				}
				if(count!==undefined && count!==null){
					bests[i].push([viewIDB, count]);
				}
			}
			// bests[i].sort(sortBestPairCount);
			bests[i].sort(sortBestPairError);
			for(var j=0; j<bests[i].length; ++j){
				bests[i][j] = bests[i][j][0];
			}
		}
		console.log(viewsIn);
		console.log(bests);
		return bests;
	}
	*/
	console.log("load graph file");

	var fxnGraphLoaded = function(graphData){
		console.log("fxnGraphLoaded");
		console.log(graphData);
		var graphGroups = graphData["groups"];
		var graphPairs = graphData["pairs"];
		var loadGroupIndex = graphData["loadGroupIndex"];
			loadGroupIndex = Code.valueOrDefault(loadGroupIndex, -1);
			loadGroupIndex = Math.max(loadGroupIndex,0);
		var loadPairIndex = graphData["loadPairIndex"];
			loadPairIndex = Code.valueOrDefault(loadPairIndex, -1);
			loadPairIndex = Math.max(loadPairIndex,0);
		var bundleGroupIndex = graphData["bundleGroupIndex"];
			bundleGroupIndex = Code.valueOrDefault(bundleGroupIndex, -1);
			bundleGroupIndex = Math.max(bundleGroupIndex,0);
		var bundleFullFile = graphData["bundleFullFile"];
			Code.valueOrDefault(bundleFullFile, null);
		var bundleFullIndex = graphData["bundleFullIndex"];
			bundleFullIndex = Code.valueOrDefault(bundleFullIndex, -1);
			bundleFullIndex = Math.max(bundleFullIndex,0);
		// var bundleFullError = graphData["bundleFullError"];
		// 	bundleFullError = Code.valueOrDefault(bundleFullError, null);

	var bundleSequentialFile = sourceData["bundleSequentialFile"];
		bundleSequentialFile = Code.valueOrDefault(bundleSequentialFile, null);
	var bundleSequentialError = sourceData["bundleSequentialError"];
		bundleSequentialError = Code.valueOrDefault(bundleSequentialError, null);

	console.log("bundleSequentialFile: "+bundleSequentialFile);
	console.log("bundleSequentialError: "+bundleSequentialError);

console.log("isDense: "+isDense);

if(isDense){
//throw "here ... LAST STEP IS NOW sequential";
//}

		console.log(loadPairIndex,loadGroupIndex,bundleGroupIndex,bundleFullIndex);


		// ...
		if(bundleSequentialError!==null){
			throw "bundleSequentialError - new dense is done -> project start surfaces"
		}
//???
		if(bundleSequentialFile!==null){
			// throw "bundleSequentialFile - iterate on sequential file"
			var filename = "" + (isDense ? "dense" : "sparse") + "/" + bundleSequentialFile;
			project._iterateGraphSequential(sourceData, sourceFilename, filename);
			return;
		}
}
		// if(bundleFullError!==null){
		// 	throw "bundleFullError set -> create/init the sequential file"
		// 	// throw "already done .. should have putatives saved into main info.yaml"
		// }
// throw "bundle things?"
		if(bundleFullIndex>=graphPairs.length){ // done loading all pairs into track full file
			console.log("bundle adjust full file ...");
			// - bundle-adjust
			var fullBundlePath = Code.appendToPath(basePath,"tracks",bundleFullFile);
			var fullData = null;

			var checkReadyRunWorld = function(){
				// console.log("checkReadyRunWorld");
				if(!fullData){
					return;
				}
				// throw "checkReadyRunWorld";
				var allViews = fullData["views"];
				var allCameras = fullData["cameras"];
				var allPoints = Code.valueOrDefault(fullData["points"], []);
				// if(bundleFullIndex==0){ // force new set
				// 	allPoints = [];
				// }
				console.log(allPoints);
				var baOptimizations = App3DR.ProjectManager._BAPairsDefaultOrSorted(allViews, fullData);
				var nextViewBA = baOptimizations[0];
				console.log(nextViewBA);
// throw "want to be here ?"
				var baIterations = fullData["iteration"];
					baIterations = Code.valueOrDefault(baIterations, 0);
				var maxIterationsBA = 2*allViews.length; // MED
				if(isDense){
					maxIterationsBA = 3*allViews.length;
				}
// STOP early for testing
maxIterationsBA = allViews.length;

maxIterationsBA = 1;

				// if the next error is very low, or max iterations reached => done
				var isDone = false;
				var deltaErrorR = nextViewBA["deltaErrorR"];
console.log("minimum deltaErrorR: "+deltaErrorR);
				if(deltaErrorR!==null && deltaErrorR!==undefined){
					if(deltaErrorR<minimumBundlePixelDeltaErrorPerUnity){
						console.log("min error reached");
						// isDone = true;
					}
				}
console.log("ITERATION NUMBER: "+baIterations+" / "+maxIterationsBA);
				if(baIterations>maxIterationsBA){
					console.log("max iterations reached");
					isDone = true;
				}
// throw "???????????? : "+baIterations;
				// isDone = true;
				if(isDone){ // BA is done -> find best putatives for dense

					var allTransforms = fullData["transforms"];


console.log("isDone - FULL DONE");
// throw "BEFORE HANDLE DONE TRACK FULL BA "

// show the graph:
var orderedAbsoluteTransforms = [];
var groupIDs = [];
var viewIDToIndex = {};
for(var v=0; v<allViews.length; ++v){
	var view = allViews[v];
	var viewID = view["id"];
	var trans = view["transform"];
		trans = Matrix.fromObject(trans);
	var abs = Matrix.inverse(trans);
	orderedAbsoluteTransforms.push(abs);
	groupIDs.push(viewID);
	viewIDToIndex[viewID] = v;
}

var groupPairsPass = [];
for(var v=0; v<allTransforms.length; ++v){
	var view = allTransforms[v];
	var viewIDA = view["A"];
	var viewIDB = view["B"];
	var viewIndexA = viewIDToIndex[viewIDA];
	var viewIndexB = viewIDToIndex[viewIDB];
	groupPairsPass.push( [viewIndexA,viewIndexB] );
}
console.log(allTransforms);
console.log(groupPairsPass);

// project.displayViewGraph(orderedAbsoluteTransforms,groupPairsPass, 0, groupIDs);

// throw "done full BA"
					
					// get best putative pairs
					
					console.log(fullData);

var allPoints = fullData["points"];
// var info = project.densePutativePairsFromPointList(allViews,allPoints);
var maxPair = 6;
var maxTriple = 3;
var info = project.densePutativePairsFromPointList(allViews,allPoints, maxPair, maxTriple);
console.log(info);

					console.log(allViews,allTransforms);
					//var info = project._putativePairsFromViewsAndTransforms(allViews,allTransforms);
					// console.log(info); // 22 V 30


// throw "putative here ..."

					// var pairs = info["lookup"];
					var pairs = info["pairs"];
					// var pairs = info["lookup"];
					// for(var p=0; p<pairs.length; ++p){
					// 	var pair = pairs[p];
					// 	var viewIDA = pair["A"];
					// 	var viewIDB = pair["B"];
					// }
					var putativeViews = [];
					var putativePairs = pairs;
					var solutionPairCount = pairs.length;
					var putatives = {};
						putatives["pairs"] = putativePairs;
						putatives["views"] = putativeViews;
					for(var i=0; i<allViews.length; ++i){
						var view = allViews[i];
						var v = {};
							v["id"] = view["id"];
							v["R"] = view["transform"];
						putativeViews.push(v);
					}
					sourceData["putativePairs"] = putatives;

					// for(var i=0; i<putatives.length; ++i){
					// 	var putative = putatives[i];
					// 	console.log(putative);
					// }
					// console.log(sourceData);
					
					// save these putatives to sparse.yaml / dense.yaml -- as starting point


					var allCameras = fullData["cameras"];
					sourceData["cameras"] = fullData["cameras"];
					console.log(sourceData["cameras"]);
					// throw "is this correct camera ^";


					// save the putative / pairs to dense.yaml
					// var currentSparseCount = project.sparseCount();
					// console.log( "currentSparseCount: "+currentSparseCount );
					// set sparseCount to info.yaml
					console.log("SET solutionPairCount: "+solutionPairCount);
					// if(currentSparseCount===null){

					// throw "DENSE IS 'DONE"


/*
SEQUENTIAL:
	- graph
		- cameras [all cameras]
		- points [all CURRENTLY COMPLETED 3D points]
		- views [all CURRENTLY COMPLETED VIEWS]
	- putative - [initial view graph]
		- views: absolute view matrixes
		- transforms: pairwise matrixes [need: count, errorR, errorF, idA, idB]
	- sequence [sequence of views to load]
		- views:
			- id [id of view to load]
			- images/adjacent: [array of all view IDs to load - including self]
			- 

*/
				

/*

// 				throw "was initGraphSequential"

				var sequentialData = project._initGraphSequential(allViews,allPoints, allTransforms, allCameras); // info


				console.log(sequentialData);

				var sequentialFile = "sequential.yaml";
				

				var savedDataComplete = function(){
					console.log("saved data (sparse/dense)");
					project.saveProjectFile(savedProjectComplete, project);
				}

				var savedSubjectDataComplete = function(){
					console.log("saved data (sparse/dense)");
					// project.saveProjectFile(savedProjectComplete, project);
					// project.saveFileFromData(sourceData, sourceFilename, savedDataComplete, project);
				}

				var savedSequentialDataComplete = function(){
					console.log("saved sequential data (sparse/dense)");
					// project.saveProjectFile(savedSubjectDataComplete, project);
					project.saveFileFromData(sourceData, sourceFilename, savedDataComplete, project);
				}

				sourceData["bundleSequentialFile"] = sequentialFile;

				// abs location:
				if(isDense){
					sequentialFile = "dense/"+sequentialFile;
				}else{
					sequentialFile = "sparse/"+sequentialFile;
				}
				project.saveFileFromData(sequentialData, sequentialFile, savedSequentialDataComplete, project);

				




					throw "start sequential sequence???"

*/



// if done after bundle:

					if(!isDense){
						project.setSparseCount(solutionPairCount);
					}else{
						project.setDenseCount(solutionPairCount);
					}

					// save project
					var savedDataComplete = function(){
						console.log("saved data (sparse/dense)");
						project.saveProjectFile(savedProjectComplete, project);
					}
					var savedProjectComplete = function(){
						console.log("saved project");
						project._taskDoneCheckReloadURL();
					}

					console.log(sourceData);

					// throw "before saving putatives";
					console.log("sourceFilename: "+sourceFilename);

					project.saveFileFromData(sourceData, sourceFilename, savedDataComplete, project);
					return;
				} // else: not done:






// throw "not done"
console.log(allViews);
// console.log("TODO: REMOVE")
// // force image sizes that seems coherient:
// for(var i=0; i<allViews.length; ++i){
// 	var view = allViews[i];
// 	view["imageSize"] = {"x": 2016, "y":1512};
// }

// throw "before world full track full solve"
				var info = project.fillInWorldAll(allViews, null, allCameras); // cellsize, cameras
				console.log(info);
				//
				var WORLDCAMS = info["cameras"];
				var WORLDVIEWS = info["views"];
				var WORLDVIEWSLOOKUP = info["lookup"];
				var world = info["world"];
				// world.setResolutionProcessingModeNonVisual();
				// world.setResolutionProcessingModeBest();
				// world.copyRelativeTransformsFromAbsolute();
console.log(allPoints);
// throw "...allPoints"
				var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, allPoints, WORLDVIEWSLOOKUP);
				world.embedPoints3DNoValidation(points3DExisting);

// for(var i=0; i<points3DExisting.length; ++i){
// 	var p3D = points3DExisting[];
// 	var p2Ds = p3D.toPointArray();
// 	for(var j=0; j<p2Ds.length; ++j){
// 		var p2D = p2Ds[j];
// 		var p = p.point2D();
// 		p.x *= 2016;
// 		p.y *= 1512;
// 	}
// }


// throw "iterate - init patches ... only 2D data is assumed correct after graph/view updates"
				// exiting patches have already been calculated
				// world.initAffineFromP3DPatches(points3DExisting);
				// world.initAllP3DPatches(points3DExisting);
				// world.relativeFFromSamples();
				// world.estimate3DErrors(true);
				// world.printPoint3DTrackCount();

				var nextViewID = nextViewBA["id"];
				console.log("nextViewID: "+nextViewID);
				var worldView = world.viewFromData(nextViewID);
				console.log("optimize with view:");
				console.log(worldView);
// console.log("before solveOptimizeSingleView - TRACK FULL");
// throw "before solveOptimizeSingleView - TRACK FULL";
				// optimize view orientation
				var doWorldViewSolve = isDense;
				// var doWorldViewSolve = true;


console.log("sourceData");
console.log(sourceData);

// throw "before solveOptimizeSingleView????"
				// var info = world.solveOptimizeSingleViewWhat(worldView);


				var pairInfo = sourceData["pairs"];
// console.log(fullData);
// console.log(pairInfo);
// console.log("...");
// throw "pairInfo";


				// var info = world.solveOptimizeSingleViewReprojection(worldView, pairInfo);
				// console.log(info);



var info = world.solveOptimizeSequential(pairInfo);
console.log(info);

// throw "..."
/*
				// var maxIts = 3;
				var maxIts = 1;
				for(var its=0; its<maxIts; ++its){

					var views = world.toViewArray();
					for(var v=0; v<views.length; ++v){
						console.log(" ...................................................................................................... "+v)
						var view = views[v];
						// var info = world.solveOptimizeSingleViewReprojection(view, pairInfo);
						var info = world.solveOptimizeSingleViewReprojection(view, pairInfo);
						console.log(info);
// break;
					}
// break;
				}

*/

				
var str = world.toYAMLString();
console.log(str);
throw "before save optimizing full track full ..............";

/*
				console.log(info);
				nextViewBA["deltaErrorR"] = Math.abs(info["deltaR"]); // expected always negative
				nextViewBA["errorR"] = info["errorR"];
				nextViewBA["count"] = worldView.pointCount();
				nextViewBA["updated"] = Code.getTimeMilliseconds();
*/
				// update views:
				var worldObject = world.toObject();
				fullData["points"] = worldObject["points"];
				fullData["views"] = worldObject["views"];
				fullData["transforms"] = worldObject["transforms"]; // want for final relative counts & errors
				fullData["iteration"] = baIterations + 1;
				console.log("fullBundlePath: "+fullBundlePath);
				console.log(fullData);

				// SAVE TO FILE
				var savedBundleComplete = function(){
					console.log("saved bundle track");
					project._taskDoneCheckReloadURL();
				}
				project.saveFileFromData(fullData, fullBundlePath, savedBundleComplete, project);
				return;
			} // end checkReadyRunWorld

			var loadBundleComplete = function(data){
				console.log("loaded bundle");
				console.log(data);
				fullData = data;
				checkReadyRunWorld();
			}
			project.loadDataFromFile(fullBundlePath, loadBundleComplete);
			return;
		}
		// throw "B";
		if(bundleFullFile){ // load current file:
			var fullBundlePath = Code.appendToPath(basePath,"tracks",bundleFullFile);
			var fullData = null;
			var pairData = null;
			var loadedImages = 0;
			var expectedImages = 0;
console.log("fullBundlePath: "+fullBundlePath);
// throw "load full"
			var checkReadyRunWorld = function(){
				if(!(fullData && pairData)){
					return;
				}
				if(loadedImages<expectedImages){
					return;
				}
				console.log("checkReadyRunWorld: "+loadedImages+" / "+expectedImages);

				// throw "checkReadyRunWorld ?";
				var allViews = fullData["views"];
				var allCameras = fullData["cameras"];
				var fullPoints = Code.valueOrDefault(fullData["points"], []);
				if(bundleFullIndex==0){ // force new set
					fullPoints = [];
				}
				// console.log(allViews);
console.log(fullData);
console.log(allViews);
console.log(allCameras);
// console.log(pairData);
				var pairPoints = pairData["points"];
				var info = project.fillInWorldAll(allViews, null, allCameras); // cellsize, cameras
				// console.log(info);
				//
				var WORLDCAMS = info["cameras"];
				var WORLDVIEWS = info["views"];
				var WORLDVIEWSLOOKUP = info["lookup"];
				var world = info["world"];
// console.log(world);
// console.log(WORLDVIEWS);
// for(var v=0; v<WORLDVIEWS.length; ++v){
// 	console.log(WORLDVIEWS[v].image());
// }
// throw "before add track - world - track_full bundle";







				// world.setResolutionProcessingModeNonVisual();
				// throw "what ?"
				// world.setResolutionProcessingModeBest();
				// world.copyRelativeTransformsFromAbsolute();
				
				// existing
				var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, fullPoints, WORLDVIEWSLOOKUP);
				console.log(points3DExisting);
				// console.log("old");
				// existing patches 
				// world.initAffineFromP3DPatches(points3DExisting);
				// world.initAllP3DPatches(points3DExisting);
				world.embedPoints3DNoValidation(points3DExisting);

				// new
				var points3DAdditional = App3DR.ProjectManager._worldPointFromSaves(world, pairPoints, WORLDVIEWSLOOKUP);
				console.log(points3DAdditional);
				// world.patchInitBasicSphere(true,points3DAdditional);
				// world.initAffineFromP3DPatches(points3DAdditional);
				// world.initAllP3DPatches(points3DAdditional);

				// 
				// world.setResolutionProcessingModeFromOnly2D();
				// world.initAllP3DPatches(points3DAdditional);
				// world.initAffineFromP3DPatches(points3DAdditional);

				// add new points w/ good intersecting
				// world.setResolutionProcessingModeBest();
				// console.log("new: "+points3DAdditional.length);
				// 
				// IF WANT INTERSECT:
				// world.embedPoints3D(points3DAdditional);
				// IF WANT NO INTERSECTIONS:
				world.createAllPoints3DPatches(points3DAdditional);
				world.embedPoints3DNoValidation(points3DAdditional);

// throw "before done tracks - full";


				// get info ...
				// world.relativeFFromSamples();
				// world.estimate3DErrors(true);
				world.printPoint3DTrackCount();

				// object
				var worldObject = world.toObject();
				// console.log(worldObject);

				fullData["cameras"] = worldObject["cameras"]; // don't need ...
				fullData["views"] = worldObject["views"];
				fullData["points"] = worldObject["points"];

				console.log(fullData);
				
				// INCREMENT
				graphData["bundleFullIndex"] = bundleFullIndex + 1;

				console.log(graphData);

// throw "x before save graph"
// console.log(" save graph ");
				// SAVE
				var savedGraphComplete = function(){
					console.log("savedGraphComplete: "+graphFile);
					project._taskDoneCheckReloadURL();
				}
				var savedFullComplete = function(){
					console.log("savedFullComplete: "+fullBundlePath);
					project.saveFileFromData(graphData, graphFile, savedGraphComplete);
				}
				
				project.saveFileFromData(fullData, fullBundlePath, savedFullComplete);
				return;
			} // end fxn

			var loadedImageComplete = function(a,b){
				console.log("loadedImageComplete "+loadedImages+" / "+expectedImages);
				// console.log(a,b);
				++loadedImages;
				checkReadyRunWorld();
			}
			
			var loadTrackComplete = function(data){
				console.log("loaded track");
				console.log(data);
				fullData = data;
				checkReadyRunWorld();
			}
			project.loadDataFromFile(fullBundlePath, loadTrackComplete);

			// load pair
			var pair = graphPairs[bundleFullIndex];
			var viewIDA = pair["A"];
			var viewIDB = pair["B"];



			console.log(graphData);
			graphGroupEdges = graphPairs;
			// console.log(bundleGroupIndex);
			// var bundleGroupIndex = ;
			// var loadPairIndex = graphData[];

			// var graphGroup = graphGroups[loadGroupIndex];

			// var graphData = graphData[""];
			console.log(viewIDA,viewIDB, graphPairs, graphGroupEdges);
			

			var maxIncludeImageCount = 2;
			// var maxIncludeImageCount = 6;
			loadViews = App3DR.ProjectManager.bestImagesToLoadForViewPair(viewIDA,viewIDB, graphPairs, graphGroupEdges,  maxIncludeImageCount, 0.25);
			console.log("loadViews:");
			console.log(loadViews);
// throw "bestImagesToLoadForViewPair:"

			
			
			loadedImages = 0;

			// don't load images
			expectedImages = 0;

			/*
			expectedImages = loadViews.length;
			// console.log("load images");
			for(var i=0; i<loadViews.length; ++i){
				var viewID = loadViews[i];
				var view = project.viewFromID(viewID);
				view.loadTrackImage(loadedImageComplete, project);
				// view.loadDenseLoImage(loadedImageComplete, project);
			}
			*/
			// throw "loadViews";


			// load pair
			var pairID = App3DR.ProjectManager.pairIDFromViewIDs(viewIDA,viewIDB);
			var pairPath = Code.appendToPath(basePath,"pairs",pairID,"tracks.yaml");
			var loadedPairTracksComplete = function(data){
				console.log("loaded pair track");
				console.log(data);
				pairData = data;
				checkReadyRunWorld();
			}
			project.loadDataFromFile(pairPath, loadedPairTracksComplete, project);

			return;
		}

		if(graphGroups.length==bundleGroupIndex){ // combine groups to single graph using skeleton view's offset as origin

			// helper
			var pairIDFromViewIDs = function(a,b){
				return a<b ? a+"-"+b : b+"-"+a;
			}

			// get original graph:
			var allViews = graphData["views"];
			var allPairs = graphData["pairs"];
			// GROUPED - SKELETON
			var groupSkeleton = graphGroups[0];
			var skeletonViews = groupSkeleton["views"];
			var skeletonPairs = groupSkeleton["pairs"];
			var skeletonTransforms = groupSkeleton["transforms"];

console.log(graphData);
console.log(graphGroups);
console.log(groupSkeleton);
console.log(skeletonTransforms);

// throw "????????"
			if(!skeletonPairs || !skeletonTransforms){
				skeletonPairs = [];
				skeletonTransforms = [];
			}

			// PREVIOUS TRANSFORMS
var originalTransforms = [];
			var viewIDToTransformOriginal = {};
			for(var i=0; i<allViews.length; ++i){
				var view = allViews[i];
				var viewID = view["id"];
				var viewExtrinsic = view["transform"];
					viewExtrinsic = Matrix.fromObject(viewExtrinsic);
				var absolute = Matrix.inverse(viewExtrinsic);
				viewIDToTransformOriginal[viewID] = absolute;
originalTransforms[i] = absolute;
			}
			var pairIDToPairOriginal = {};
			for(var i=0; i<allPairs.length; ++i){
				var pair = allPairs[i];
				var pairID = pair["id"];
				pairIDToPairOriginal[pairID] = pair;
			}
			
			// NEW TRANSFORMS
			var viewIDToTransformSkeleton = {};
			var skeletonLookup = {};
console.log(skeletonViews)
console.log(skeletonTransforms)

		for(var i=0; i<skeletonViews.length; ++i){
			var viewID = skeletonViews[i];
			var viewExtrinsic = skeletonTransforms[i];
			if(viewExtrinsic){
				viewExtrinsic = Matrix.fromObject(viewExtrinsic);
			}else{ // if(skeletonViews.length==0){
				// just set to identity
console.log("just set to identity?")
				viewExtrinsic = new Matrix(4,4).identity();
			}
				
			var absolute = Matrix.inverse(viewExtrinsic);
			viewIDToTransformSkeleton[viewID] = absolute;
			skeletonLookup[viewID] = 1;
		}
			// skeleton pair lookup
			var pairIDToPairSkeleton = {};
			for(var i=0; i<skeletonPairs.length; ++i){
				var pair = skeletonPairs[i];
				var viewIDA = pair["A"];
				var viewIDB = pair["B"];
				var pairID = pairIDFromViewIDs(viewIDA,viewIDB);
				pairIDToPairSkeleton[pairID] = pair;
			}
			// find all leave views = non-skeleton views
			var leafViews = [];
			var leafLookup = {};
			var leafAdjacentSkeletonEdges = {};
			for(var i=0; i<allViews.length; ++i){
				var view = allViews[i];
				var viewID = view["id"];
				if(!viewIDToTransformSkeleton[viewID]){
					leafViews.push(viewID);
					leafLookup[viewID] = 1;
					leafAdjacentSkeletonEdges[viewID] = [];
				}
			}

			// edges between skeleton & leaves
			for(var i=0; i<allPairs.length; ++i){
				var pair = allPairs[i];
				var viewIDA = pair["A"];
				var viewIDB = pair["B"];
				if(leafLookup[viewIDA] && skeletonLookup[viewIDB]){
					leafAdjacentSkeletonEdges[viewIDA].push(pair);
				}else if(leafLookup[viewIDB] && skeletonLookup[viewIDA]){
					leafAdjacentSkeletonEdges[viewIDB].push(pair);
				}
			}

			var addToScaleTable = function(table,index,ratio){
				var info = table[index];
				if(!info){
					var info = {"sum":0, "count":0};
					table[index] = info;
				}
				info["count"] += 1;
				info["sum"] += Math.log(ratio);
			}
			// get each skeleton average scale difference
			var skeletonIDToScale = {};
			// EACH EDGE HAS A SCALE
			var edgeInfos = {};
			for(var i=0; i<skeletonViews.length; ++i){
				var viewIDA = skeletonViews[i];
				for(var j=i+1; j<skeletonViews.length; ++j){
					var viewIDB = skeletonViews[j];
					var pairID = pairIDFromViewIDs(viewIDA,viewIDB);
					var viewPairOriginal = pairIDToPairOriginal[pairID];
					var viewPairSkeleton = pairIDToPairSkeleton[pairID];
					// edge needs to exist in both to be useable
					if(viewPairOriginal && viewPairSkeleton){
						var transformA = viewIDToTransformOriginal[viewIDA];
						var transformB = viewIDToTransformOriginal[viewIDB];
						var relativeExtrinsicOriginal = Matrix.relativeReference(transformA,transformB);
						var distanceO = relativeExtrinsicOriginal.multV3DtoV3D(new V3D(0,0,0));
							distanceO = distanceO.length();
						// NEW
						var transformA = viewIDToTransformSkeleton[viewIDA];
						var transformB = viewIDToTransformSkeleton[viewIDB];
						var relativeExtrinsicSkeleton = Matrix.relativeReference(transformA,transformB);
						var distanceS = relativeExtrinsicSkeleton.multV3DtoV3D(new V3D(0,0,0));
							distanceS = distanceS.length();
						var ratio = distanceS/distanceO;
						console.log(ratio);
						edgeInfos[pairID] = {"ratio":ratio};
						// add to each skeleton view list
						addToScaleTable(skeletonIDToScale,viewIDA,ratio);
						addToScaleTable(skeletonIDToScale,viewIDB,ratio);
					}else{
						console.log("no pair for both: "+viewIDA+" & "+viewIDB);
					}
					
				}
			}
// console.log(skeletonViews);
			// throw "???"
			// get average scale:
			var keys = Code.keys(skeletonIDToScale);
			for(var i=0; i<keys.length; ++i){
				var key = keys[i];
				var info = skeletonIDToScale[key];
				if(info["count"]==0){
					throw "no edges ?";
				}
				var value = info["sum"]/info["count"];
					value = Math.exp(value);
				skeletonIDToScale[key] = value;
			}

			// find predicted leaf new locations - averaging skeleton-leaf edges
			// var leafTransforms = []; // NOT USED
			var viewIDToTransformLeaf = {};
			for(var i=0; i<leafViews.length; ++i){
				var leafID = leafViews[i];
				// find all edges in original that include leaf ID & a skeleton
				var transforms = [];
				var errors = [];
				var edgePairs = leafAdjacentSkeletonEdges[leafID];
				for(var j=0; j<edgePairs.length; ++j){
					var pair = edgePairs[j];
					var skeletonID = null;
					var error = pair["error"];

					// TODO: PAIR ERROR /= COUNT ?

					// console.log(pair);
					// throw "NOTE: error over count = average error";


					if(pair["A"]==leafID){
						skeletonID = pair["B"];
					}else if(pair["B"]==leafID){
						skeletonID = pair["A"];
					}else{
						throw "wrong"
					}
					// FROM ORIGINAL
					var leafAbsolute = viewIDToTransformOriginal[leafID];
					var skelAbsolute = viewIDToTransformOriginal[skeletonID];
					var relativeOriginal = Matrix.relativeReference(skelAbsolute,leafAbsolute);
					var skeletonScale = skeletonIDToScale[skeletonID];
						relativeOriginal = Matrix.transform3DScaleMatrix(relativeOriginal, skeletonScale);
					// TO NEW
					var skelNewAbsolute = viewIDToTransformSkeleton[skeletonID];
					var transform = Matrix.mult(skelNewAbsolute,relativeOriginal); // B = A' * (A^-1*B) =  skelAbsNew * (skelAbsOld^-1 * leafAbsOld) = leafAbsNew
					transforms.push(transform);
					errors.push(error);
				}
				var percents = Code.errorsToPercents(errors);
					percents = percents["percents"];
				var average = Code.averageMatrices3D(transforms, percents);
				viewIDToTransformLeaf[leafID] = average;
			}
			// to list of all final transforms:
			var allTransforms = [];
			var viewIDToIndex = {};
			var groupIDs = [];
			for(var i=0; i<allViews.length; ++i){
				var view = allViews[i];
				var viewID = view["id"];
				var absolute = viewIDToTransformSkeleton[viewID];
				var isSkeleton = true;
				if(!absolute){
					absolute = viewIDToTransformLeaf[viewID];
					isSkeleton = false;
				}
				// console.log(absolute);
				allTransforms[i] = absolute;
				viewIDToIndex[viewID] = i;
				groupIDs[i] = viewID + (isSkeleton ? "-s" : "-l");
			}
			var pairsIndexes = [];
			for(var i=0; i<allPairs.length; ++i){
				var pair = allPairs[i];
				var pairID = pair["id"];
				// pairIDToPairOriginal[pairID] = pair;
				var viewIDA = pair["A"];
				var viewIDB = pair["B"];
				var indexA = viewIDToIndex[viewIDA];
				var indexB = viewIDToIndex[viewIDB];
				pairsIndexes.push([indexA,indexB]);
			}
			// var allTransforms = Code.arrayPushArrays([],skeletonTransforms,leafTransforms);
// allTransforms = originalTransforms;
			// console.log(allTransforms);
			// console.log(pairsIndexes);
			// console.log(groupIDs);
			project.displayViewGraph(allTransforms,pairsIndexes, 100, groupIDs);
				
			// console.log(allTransforms);
			// console.log(allViews);
			
// throw "?"
			// to extrinsic
			var allExtrinsics = [];
			var transformLookup = {};
			for(var i=0; i<allTransforms.length; ++i){
				var absolute = allTransforms[i];
				var extrinsic = Matrix.inverse(absolute);
				allExtrinsics[i] = extrinsic;
				// to lookup:
				var view = allViews[i];
				var viewID = view["id"];
				// var cameraID = view["camera"]; // DNE
					var internal = project.viewFromID(viewID); // TODO: this should be from somewhere else?
					// console.log(internal);
					var cameraID = internal.cameraID();
					// console.log("cameraID: "+cameraID);
					// throw "????"
				var object = {"id":viewID, "R":extrinsic, "camera":cameraID};
				transformLookup[viewID] = object;
			}
// console.log(transformLookup);
// throw ".."




/*
			// orientation drift/registration: move non-skeleton groups into skeleton placement
			console.log(graphGroups);
			var transformLookup = {};
			for(var i=0; i<graphGroups.length; ++i){
				var group = graphGroups[i];
console.log(i+" ? ..................................................................");
				console.log(group);
				var views = group["views"];
				var transforms = group["transforms"];
				var referenceGroupIndex = null;
				var referenceSkeleton = null;
				for(var j=0; j<views.length; ++j){
					var viewID = views[j];
					var ref = transformLookup[viewID];
					if(ref){
						console.log("found ref: "+ref+" @ "+j);
						referenceSkeleton = ref;
						referenceGroupIndex = j;
						break; // should only be 1 anyway
					}
				}
				var oldOriginR = null;
				var newOriginR = null;
				var newOriginID = null;
				if(referenceSkeleton){
					oldOriginR = transforms[referenceGroupIndex];
						oldOriginR = Matrix.fromObject(oldOriginR);
						// oldOriginR = Matrix.inverse(oldOriginR); // ext -> abs
					newOriginID = referenceSkeleton["id"];
					newOriginR = referenceSkeleton["R"];
						// newOriginR = Matrix.inverse(newOriginR); // ext -> abs
				}else{
					oldOriginR = new Matrix(4,4).identity();
					newOriginR = new Matrix(4,4).identity();
				}

				for(var j=0; j<views.length; ++j){
					var viewID = views[j];
					// skeletons pass because newOriginID=null; groups non-references pass because they are not reference
					if(newOriginID!=viewID){ // don't override reference
						var extA, absA;
						var extB, absB;
						// remove current offset => only relative orientation


						var transform = transforms[j];
							transform = Matrix.fromObject(transform);

							absA = Matrix.inverse(oldOriginR);
							absB = Matrix.inverse(transform);
							relAB = Matrix.relativeReference(absA,absB);


							absA = Matrix.inverse(newOriginR);
							absB = Matrix.mult(relAB, absA);
							extB = Matrix.inverse(absB);
							
							transform = extB;


						
						// var transform = transforms[j];
						// 	extA = oldOriginR;
						// 	extB = newOriginR;
						// 	absA = Matrix.inverse(extA);
						// 	absB = Matrix.inverse(extB);
						// 	var relativeAB = Matrix.relativeWorld(absA,absB);

						// 	extC = Matrix.fromObject(transform);
						// 	absC = Matrix.inverse(extC);

						// 	var newC = Matrix.mult(relativeAB, absC);
						// 		extC = Matrix.inverse(newC);

						// 	transform = extC;


						// if(newOriginID!=null){
						// 	console.log(" ........... ");
						// 	// console.log(transform+" ");
						// 	// console.log(relativeAB+" ");
						// 	console.log(Matrix.fromObject(transforms[j])+" ");
						// 	console.log( Matrix.inverse( Matrix.mult(Matrix.inverse(relativeAB), Matrix.inverse(transform)) )  +" ");
						// }else{
						// 	// console.log(" ........... ");
						// 	// console.log(transform+" ");
						// 	// console.log(relativeAB+" ");
						// }

						


// var original = extB;
// 							// absB = Matrix.inverse(extB); // ext -> abs
// 							// absA = oldOriginR;
// 						// var relativeAB = R3D.relativeTransformMatrix2(absA,absB);
// 						// var relativeAB = R3D.relativeTransformMatrix2(absB, absA);
// 						// var extrinsicAB = R3D.relativeTransformMatrix2(extA,extB);
						
// 						var extrinsicAB = Matrix.relativeWorld(extA,extB);
// 						// var extrinsicAB = Matrix.relativeReference(extA,extB);
// 						var relativeAB = Matrix.inverse(extrinsicAB);

// // throw "should this be relativeReference ? "
// 						// console.log("RELATIVE: "+relativeAB);
// 						// absA = newOriginR;
// 						extA = newOriginR;
// 						absA = Matrix.inverse(extA);
// 						absB = Matrix.mult(relativeAB, absA); // prepend new origin
// 						// absB = Matrix.mult(absA,relativeAB);
// 						extB = Matrix.inverse(absB); // abs -> ext
// 						transform = extB;
// var final = transform;
// if(newOriginID==null){
// 	// console.log("SKELETON: ");
// 	// console.log("\n"+original);
// 	// console.log("\n"+oldOriginR);
// 	// console.log("\n"+relativeAB);
// 	// console.log("\n"+final);
// 	// console.log("\n");
// }else{
// 	console.log("OTHER: ");
// 	console.log("\n"+original);
// 	console.log("\n"+final);
// 	console.log("\n");
// }

						// set
						transformLookup[viewID] = {"id":viewID, "R":transform};
					}
				}
			}
*/




/*

// TODO
throw "nonlinear Code.graphAbsoluteUpdateFromRelativeTransforms"




// TODO
throw "get list of pairs including only top 3 view pairs -- from original graph pairs"


*/


console.log("GOT TO HERE")


console.log(transformLookup);
			// to array
			var viewList = [];
			var keys = Code.keys(transformLookup);
			for(var i=0; i<keys.length; ++i){
				var key = keys[i];
				var view = transformLookup[key];
				var viewID = view["id"];
				var R = view["R"];
				var cameraID = view["camera"];
console.log(cameraID);
				viewList.push({"id":viewID, "transform":R, "camera":cameraID});
			}
			console.log(viewList);
			var bundleData = {};
			bundleData["views"] = viewList;
			var bundleFilename = "track_full.yaml";
			graphData["bundleFullFile"] = bundleFilename;
			var fullBundlePath = Code.appendToPath(basePath,"tracks",bundleFilename);
console.log(bundleData);
bundleData["cameras"] = graphData["cameras"];
// throw "?"
var str = YAML.parse(bundleData);
console.log(str);
//
			var savedGraphComplete = function(){
				console.log("savedGraphComplete: "+graphFile);
				project._taskDoneCheckReloadURL();
			}
			var savedBundleComplete = function(){
				console.log("savedBundleComplete: "+fullBundlePath);
				project.saveFileFromData(graphData, graphFile, savedGraphComplete);
			}
console.log(fullBundlePath);
// throw "before saving initial bundle full";
			project.saveFileFromData(bundleData, fullBundlePath, savedBundleComplete);
			console.log("all group BA complete -- generate initial viewgraph from skeleton + groups");
			return;// load all tracks from pairs into full track file
		}

		// special case for full yaml: views & pairs are from graph

// throw "tracks - 0 ?"
// console.log(graphGroups.length,loadGroupIndex)
// throw "here ?"
		if(graphGroups.length==loadGroupIndex){
console.log("special case? - should save view transforms to track full yaml");
			console.log(bundleGroupIndex);
			var graphGroup = graphGroups[bundleGroupIndex];
			console.log("graphGroup A");
			console.log(graphGroup);
			var trackFilename = graphGroup["filename"];
			console.log("trackFilename: "+trackFilename);
			var fullTrackPath = Code.appendToPath(basePath,"tracks",trackFilename);

			// load the track
			var baTrackFileLoadComplete = function(data){
				console.log("baTrackFileLoadComplete");
				console.log(data);

				// var points = data["points"];
				// var lookup = {};
				// for(var i=0; i<points.length; ++i){
				// 	var point = points[i];
				// 	var views = point["v"];
				// 	// console.log(views.length);
				// 	var was = lookup[views.length];
				// 	if(!was){
				// 		was = 1;
				// 	}else{
				// 		was = was + 1;
				// 	}
				// 	lookup[views.length] = was;
				// }
				// // var k = Code.keys(lookup);
				// console.log(lookup);

				console.log(data);
				var baTransforms = data["transforms"];
				var baViews = data["views"];
				var baPoints = data["points"];
// this was made for skeleton with a single view
if(baViews.length<=1){
// if(false && !baTransforms){
	baTransforms = [];
	baViews = [];
	baPoints = [];
	deltaErrorR = 0;
	console.log("single vertex skeleton?")
	// throw "single vertex skeleton?"
}
				// var baOptimizations = data["ba"];
				var baIterations = data["iteration"];
					baIterations = Code.valueOrDefault(baIterations, 0);
				var baOptimizations = App3DR.ProjectManager._BAPairsDefaultOrSorted(baViews, data);
				var minimumPixelErrorBA = minimumGroupPixelDeltaErrorPerUnity;
				// var maxIterationsBA = 10*baViews.length; // HIGH
				var maxIterationsBA = 2*baViews.length; // LOW
				if(isDense){
					maxIterationsBA = 3*baViews.length;
				}


// override baIterations max
var maxIterationsBA = 1*baViews.length;


// DEBUGGING:
maxIterationsBA = 1;

				
				
				console.log(baOptimizations);
				var nextViewBA = baOptimizations.length>0 ? baOptimizations[0] : null; // pre-sorted on nulls
				console.log(nextViewBA);

				// if the next error is very low, or max iterations reached => done
				var isDone = false;
				// var deltaErrorR = nextViewBA ? nextViewBA["deltaErrorR"] : 0;
				if(nextViewBA){
					var deltaErrorR = nextViewBA["deltaErrorR"];
					if(deltaErrorR!==null && deltaErrorR!==undefined){
						if(deltaErrorR<minimumPixelErrorBA){
							console.log("min error reached: "+deltaErrorR+" < "+minimumPixelErrorBA);
							isDone = true;
						}
					}
				}

				if(baIterations>maxIterationsBA){
					console.log("max iterations reached");
					isDone = true;
				}

				if(baPoints==null || baViews==null || baViews.length==1){
					console.log("can't BA no points / pairs");
					isDone = true;
				}

				if(isDone){
					console.log("track group isDone");
// throw "before handle done tracks - skeleton - track_0";
					graphData["bundleGroupIndex"] = bundleGroupIndex + 1;
					// VIEWS
					var graphTransforms = [];
					var graphViews = graphGroup["views"];
					for(var i=0; i<graphViews.length; ++i){
						var viewID = graphViews[i];
						for(var j=0; j<baViews.length; ++j){
							var view = baViews[j];
							if(view["id"]==viewID){
								graphTransforms[i] = view["transform"];
								break;
							}
						}
					}

console.log(baTransforms);
					// PAIRS
					var graphPairs = [];
					for(var i=0; i<baTransforms.length; ++i){
						var baTransform = baTransforms[i];
						var pair = {};
							pair["A"] = baTransform["A"];
							pair["B"] = baTransform["B"];
							pair["count"] = baTransform["matches"];
							pair["error"] = baTransform["errorRMean"]; + baTransform["errorRSigma"]
						graphPairs.push(pair);
					}
					// save final (extrinsic) transforms to graph summary data
					graphGroup["transforms"] = graphTransforms;
					graphGroup["pairs"] = graphPairs;
console.log(graphGroup);
// throw "are there pairs & transforms?"
					var savedGraphComplete = function(){
						console.log("savedGraphComplete: "+graphFile);
						project._taskDoneCheckReloadURL();
					}
// throw "before save track graph end summary"
					project.saveFileFromData(graphData, graphFile, savedGraphComplete);
					return;
				} // optimizing a single track file:
				console.log("not isDone");
// GOAL: move views in direction that minimizes  error

				// var cameras = project.cameras(); // should this come from the graph ?
				var cameras = graphData["cameras"];
				// console.log(graphData);
				// throw "cameras from graph? x"


				// var info = project.fillInWorldViews(world, cameras, graphGroupViews, graphDataViews);
				var info = project.fillInWorldViews(cameras, baViews);
				var views = info["views"];
				var images = info["images"];
				var cellSizes = info["cellSizes"];
				var transforms = info["transforms"];

				// create world
// console.log(views, images, cellSizes, transforms);
// throw "///"
				var world = new Stereopsis.World();
				var WORLDCAMS = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
				console.log(WORLDCAMS);
				var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes, transforms);
				console.log(WORLDVIEWS);
				var WORLDVIEWSLOOKUP = project.createWorldViewLookup(world);
				console.log(WORLDVIEWSLOOKUP);

// throw "here B";
				// world.setResolutionProcessingModeNonVisual();
				// world.setResolutionProcessingModeBest();
				// world.copyRelativeTransformsFromAbsolute();
				// world.resolveIntersectionByPatchGeometry();
				// add points
				console.log(baPoints);
				var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, baPoints, WORLDVIEWSLOOKUP);
				console.log(points3DExisting);
// throw "here C";
				// set points from existing P3D data - already loaded & calculated before
				// world.initAffineFromP3DPatches(points3DExisting);
				// world.initAllP3DPatches(points3DExisting);
				world.embedPoints3DNoValidation(points3DExisting);
				// world.embedPoints3D(additionalPoints);

				// world.relativeFFromSamples();
				// world.estimate3DErrors(true);
				// world.printPoint3DTrackCount();

				// pick view to optimize:
				if(nextViewBA){
					var nextViewID = nextViewBA["id"];
					var worldView = world.viewFromData(nextViewID);

					console.log("optimize with view:");
					console.log(worldView);

					// optimize view orientation
	// throw "BEFORE OPTIMIZE SINGLE VIEW - group 0"


	console.log(graphData);


	var pairInfo = graphData["pairs"];

	// throw "before solveOptimizeSingleViewReprojection"

				// var maxIts = 1;
				// var maxIts = 5;
				var maxIts = 3;
				for(var its=0; its<maxIts; ++its){

					var views = world.toViewArray();
					for(var v=0; v<views.length; ++v){
						console.log(" ...................................................................................................... "+v)
						var view = views[v];
						world.solveOptimizeSingleViewReprojection(view, pairInfo);
					}
				}



				// var info = world.solveOptimizeSingleViewReprojection(worldView, pairInfo);

var str = world.toYAMLString();
console.log(str);

	throw "AFTER OPTIMIZE"
					nextViewBA["deltaErrorR"] = Math.abs(info["deltaR"]); // expected always negative
					nextViewBA["errorR"] = info["errorR"];
					nextViewBA["updated"] = Code.getTimeMilliseconds();//Code.getTimeStampFromMilliseconds();
					nextViewBA["count"] = worldView.pointCount();

					// update views:
					var worldObject = world.toObject();
					console.log(worldObject);
					data["cameras"] = worldObject["cameras"];
					data["views"] = worldObject["views"];
					data["transforms"] = worldObject["transforms"];
					data["points"] = worldObject["points"];
					// data["iteration"] = baIterations + 1;
				}else{
					// none to do
				}
				data["iteration"] = baIterations + 1;

				console.log("fullTrackPath: "+fullTrackPath);
				console.log(data);
				// SAVE TO FILE
				var savedTrackComplete = function(){
					console.log("saved track --- done bundle iteration:  "+baIterations);
					project._taskDoneCheckReloadURL();
				}
// throw "before saving track ITER";
				project.saveFileFromData(data, fullTrackPath, savedTrackComplete, project);
			}
			console.log("fullTrackPath: "+fullTrackPath)
			project.loadDataFromFile(fullTrackPath, baTrackFileLoadComplete);
			throw "do BA for each group";
			return;
		}else if(loadGroupIndex>graphGroups.length){
			throw " more than ?"
		}
// 
		// console.log("here for what reason?")
// throw "..."
		var graphGroup = graphGroups[loadGroupIndex];
		console.log("graphGroup");
		console.log(graphGroup);
		var graphGroupEdges = graphGroup["edges"];
console.log(graphGroupEdges);
		// Code.valueOrDefault(
		if(!graphGroupEdges){ // NaN
			graphGroupEdges = [];
			graphGroup["edges"] = null;
			graphGroup["transforms"] = null;
			graphGroup["pairs"] = null;
		}
// console.log(graphGroupEdges);
// console.log(loadGroupIndex);
// throw "?"
		var trackFilename = graphGroup["filename"];
		var trackData = null;
		if(!trackFilename){
			trackFilename = "track_"+loadGroupIndex+".yaml";
			graphGroup["filename"] = trackFilename;
			trackData = App3DR.ProjectManager.defaultTrackFile();
		}
		var fullTrackPath = Code.appendToPath(basePath,"tracks",trackFilename);
		console.log(fullTrackPath);
		console.log(trackData);

// throw "before tracks?: "+trackFilename;

		var fxnGroupTrackLoaded = function(){ // 
			console.log("fxnGroupTrackLoaded");
			var pending = trackData["pending"];
			var loadViews = [];
			var loadPairs = [];
			if(pending && pending.length>0){ // this will only exist if image-collisions are used
				throw "do pending group";
				//    load 'previous' pair images
				//    load missed pair images
			}else{
				// if(graphGroupEdges.length==0){
				// 	throw "no graph edges .. need to save an empty track file anyway ?"
				// }
				/*
				if(graphGroupEdges.length!==0 && loadPairIndex>=graphGroupEdges.length){ // all pairs loaded into track for this group
					console.log("done all pairs for group: "+loadGroupIndex);
					graphData["loadPairIndex"] = -1;
					graphData["loadGroupIndex"] = loadGroupIndex + 1;
					console.log(graphData);
					var savedGraphComplete = function(){
						console.log("savedGraphComplete: "+graphFile);
						project._taskDoneCheckReloadURL();
					}
					console.log("GRAPH");
					project.saveFileFromData(graphData, graphFile, savedGraphComplete);
					// save 
					return;
				} // else there are more tracks pairs to load
				console.log("graphGroupEdges");
				console.log(graphGroupEdges);
throw "graphGroupEdges?"
				if(graphGroupEdges.length==0){
					console.log("no edges -- skeleton w/o edges?");
					loadViews = [];
					loadPairs = [];
					// throw "why?";
					loadPairIndex = -1;
					loadGroupIndex = loadGroupIndex + 1;
				}else{
// console.log(graphGroupEdges);
// throw "else?";
					var edge = graphGroupEdges[loadPairIndex];
					var viewAID = edge["A"];
					var viewBID = edge["B"];

					loadPairs.push([viewAID,viewBID]);
					// graphGroupEdges
					var bestNextViews = bestNextViewsForViews([viewAID,viewBID], graphGroupEdges, null);
console.log("RICHIE - bestNextViews: "+bestNextViews.length);
						loadViews = {};
						loadViews[viewAID] = 1;
						loadViews[viewBID] = 1;
					var loadCount = 2;
					var index = 0;
					var maxIterations = 100; // 
					for(var iter=0; iter<maxIterations; ++iter){
						var checked = false;
						for(var i=0; i<bestNextViews.length; ++i){
							var list = bestNextViews[i];
							if(list.length>index){
								checked = true;
								var v = list[index];
								if(!loadViews[v]){
									loadViews[v] = 1;
									// added = true;
									++loadCount;
								}
							}
							if(loadCount>=maximumImagesLoad){
								break;
							}
						}
						index++;
						if(!checked || loadCount>=maximumImagesLoad){
							break;
						}
					}
					loadViews = Code.keys(loadViews);
					console.log(loadViews);
				}
					*/

				// var bestNextViews = bestNextViewsForViews([viewAID,viewBID], graphGroupEdges, null);
				if(graphGroupEdges.length!==0 && loadPairIndex>=graphGroupEdges.length){ // all pairs loaded into track for this group
					console.log("done all pairs for group: "+loadGroupIndex);
					graphData["loadPairIndex"] = -1;
					graphData["loadGroupIndex"] = loadGroupIndex + 1;
					console.log(graphData);
					var savedGraphComplete = function(){
						console.log("savedGraphComplete: "+graphFile);
						project._taskDoneCheckReloadURL();
					}
					console.log("GRAPH - TRACKS GATHERED");
					project.saveFileFromData(graphData, graphFile, savedGraphComplete);
					return;
				}
				var graphEdge = graphGroupEdges[loadPairIndex];
				var viewAID = graphEdge["A"];
				var viewBID = graphEdge["B"];
				var graphPairs = graphData["pairs"];
				// console.log(graphPairs);
				var maxIncludeImageCount = 2;
				// var maxIncludeImageCount = 6;
				loadViews = App3DR.ProjectManager.bestImagesToLoadForViewPair(viewAID,viewBID, graphPairs, graphGroupEdges,  maxIncludeImageCount, 0.25);

				// only load a single pair at a time
				loadPairs.push([viewAID,viewBID]);
				// throw "list of view images to load"
			}
			console.log(graphGroupEdges.length);
// throw "... loading?";
			// don't care about images for the moment:
			// loadViews = [];
			console.log("loadViews:");
			console.log(loadViews);
			// start async loading
			// var expectedImages = loadViews.length; // TODO: VIEW'S AREN'T USED
			var expectedImages = 0;
			var expectedTracks = loadPairs.length;
			var loadedImages = 0;
			var loadedTracks = 0;
			// handlers
			var loadedReadyCheck = function(){
				console.log("loadedReadyCheck: "+loadedImages+"/"+expectedImages+" && "+loadedTracks+"/"+expectedTracks);
				if(loadedImages==expectedImages && loadedTracks==expectedTracks){
					console.log("combine the point tracks: "+loadedImages+"/"+expectedImages+" && "+loadedTracks+"/"+expectedTracks);
					doWorldTrackAdd();
				}
			}
			var loadedImageComplete = function(a,b){
				console.log("loadedImageComplete");
				console.log(a,b);
				++loadedImages;
				loadedReadyCheck();
			}
			var loadedPairTracksComplete = function(data){
				console.log("loadedPairTracksComplete");
				console.log(data);
				var a = data["A"];
				var b = data["B"];
				for(var i=0; i<loadPairs.length; ++i){
					var pair = loadPairs[i];
					var viewIDA = pair[0];
					var viewIDB = pair[1];
					if((viewIDA==a && viewIDB==b) || (viewIDA==b && viewIDB==a)){
						loadPairs[i] = data;
						break;
					}
				}
				++loadedTracks;
				// console.log(loadPairs);
				loadedReadyCheck();
			}
			
			// load images
			/*
			console.log("load images");
			for(var i=0; i<loadViews.length; ++i){
				var viewID = loadViews[i];
				var view = project.viewFromID(viewID);
				view.loadTrackImage(loadedImageComplete, project);
				// view.loadDenseLoImage(loadedImageComplete, project);
			}
			*/

			// insert original track points
			console.log(loadPairs);


			console.log("load merging tracks: pair");
			for(var i=0; i<loadPairs.length; ++i){
				var pair = loadPairs[i];

				var viewIDA = pair[0];
				var viewIDB = pair[1];
				var pairID = App3DR.ProjectManager.pairIDFromViewIDs(viewIDA,viewIDB);
				var pairPath = Code.appendToPath(basePath,"pairs",pairID,"tracks.yaml");
				console.log("pairPath: "+pairPath);
				project.loadDataFromFile(pairPath, loadedPairTracksComplete, project);
			}
			
			var doWorldTrackAdd = function(){
				console.log("doWorldTrackAdd START");
				console.log(sourceData);
// throw ".... doWorldTrackAdd before"
				var graphDataViews = graphData["views"];
				var graphViewIDToTransform = {};
				for(var i=0; i<graphDataViews.length; ++i){
					var view = graphDataViews[i];
					var viewID = view["id"];
					var transform = view["transform"];
					graphViewIDToTransform[viewID] = transform ? Matrix.fromObject(transform) : null;
				}

				// var cameras = project.cameras();
				var graphGroupViews = graphGroup["views"];
				var graphCameras = graphData["cameras"];

// filter out unused views:
console.log(graphGroupViews.length);
graphGroupViews = Code.copyArray(graphGroupViews);
// var didRemove = false;
for(var i=0; i<graphGroupViews.length; ++i){
	var viewID = graphGroupViews[i];
	var transform = graphViewIDToTransform[viewID];
	if(!transform){
		console.log("no transform for: "+viewID);
		throw "yup";
		Code.removeElementAt(graphGroupViews,i);
		--i;
	}
}
// console.log(graphGroupViews.length);
// console.log(graphGroupViews);
// throw "..."
				var views = [];
				var images = [];
				var cellSizes = [];
				var transforms = [];
				for(var i=0; i<graphGroupViews.length; ++i){
					var viewID = graphGroupViews[i];
					var transform = graphViewIDToTransform[viewID];
					// if(!transform){
					// 	console.log("no transform for: "+viewID);
					// 	throw "..."
					// 	// continue;
					// }
					transforms.push(transform);
					view = project.viewFromID(viewID);
					views[i] = view;
					var image = view.anyLoadedImage();
					// console.log("anyLoadedImage")
					// console.log(image)
					var wid, hei;
					if(image){
						console.log(" + found image for: "+viewID);
						var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
							matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
						images[i] = matrix;
						wid = matrix.width();
						hei = matrix.height()
					}else{
						console.log(" - no image for: "+viewID);
						var ratio = view.aspectRatio(); // w to h
						var size = new V2D(ratio,1.0);
						images[i] = size; // is size ~ 1.0 ok?
						wid = size.x;
						hei = size.y;
					}
					var cellCount = 40;
					cellSizes.push(R3D.cellSizingRoundWithDimensions(wid,hei,cellCount, false));
				}
// console.log(graphCameras);
// throw "make world"
				// fill world in
				var world = new Stereopsis.World();
				// var WORLDCAMS = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
				var WORLDCAMS = App3DR.ProjectManager.addCamerasToWorld(world, graphCameras);
				
				console.log(WORLDCAMS);
				//var WORLDVIEWS = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms, cellSizes);
				console.log("createWorldViewsForViews");
				var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes, transforms);
				console.log(WORLDVIEWS);

				console.log("createWorldViewLookup");
				var worldViewLookup = project.createWorldViewLookup(world);

				console.log("copyRelativeTransformsFromAbsolute");
				world.copyRelativeTransformsFromAbsolute();

				// insert current points
				console.log(trackData);
				var existingPoints = Code.valueOrDefault(trackData["points"], []);
				console.log(existingPoints);
				console.log(loadPairs);
				console.log("embed points ?");



// throw "EMBED TRACK POINTS ? 0 is this for FULL TRACK ?"
// world.setResolutionProcessingModeNonVisual();


// defaults to geometry & uses images where possible
// world.resolveIntersectionByDefault();

				// 


				//project._embedTrackPoints(world, existingPoints, worldViewLookup);
				var additionalPoints = [];
				for(var i=0; i<loadPairs.length; ++i){
					var loadPair = loadPairs[i];
					var points = loadPair["points"];
					console.log(points);
					var points3DAdditional = App3DR.ProjectManager._worldPointFromSaves(world, points, worldViewLookup);
					// INIT PATCHES - currently in terms of 
					console.log(points3DAdditional);
					Code.arrayPushArray(additionalPoints, points3DAdditional);
				}

				// ADDITIONAL POINTS NEED ALL 3D VARS RECALCULATED
console.log("add additional points");
console.log(additionalPoints);
				

				world.createAllPoints3DPatches(additionalPoints);
				// world.embedPoints3D(additionalPoints); // TODO: COMBINED TRACKS -- should have images loaded?
				world.embedPoints3DNoValidation(additionalPoints); // TODO: ONLY PAIRWISE TRACKS
				// add original points no intersection:
				var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, existingPoints, worldViewLookup);
				// EXISTING POINTS HAVE ALREADY BEEN CALCULATED
				console.log(points3DExisting);

				
				
				// include for aggregation
				world.embedPoints3DNoValidation(points3DExisting);


				var worldObject = world.toObject();
				trackData["points"] = worldObject["points"];
				trackData["views"] = worldObject["views"];

				// move to next track
				console.log("save graph file");
				graphData["loadPairIndex"] = loadPairIndex + 1;
if(graphGroupEdges.length==0){
console.log("no edges -- skeleton w/o edges? => force to next");
graphData["loadGroupIndex"] = graphData["loadGroupIndex"] + 1;
graphData["loadPairIndex"] = -1;
}
				console.log(graphData);

				var fullGraphPath = graphFile;

				console.log("save to track file: "+trackFilename);
				console.log(worldObject);
				console.log(trackData);
				console.log(fullTrackPath);
				console.log(fullGraphPath);
// throw "before save track group: "+trackFilename;
				var savedFiles = 0;
				var savedTrackComplete = function(){
					console.log("savedTrackComplete: "+trackFilename);
					++savedFiles;
					savedBothComplete();
				}
				var savedGraphComplete = function(){
					console.log("savedGraphComplete: "+fullGraphPath);
					++savedFiles;
					savedBothComplete();
				}

				var savedBothComplete = function(){
					if(savedFiles==2){
						console.log("savedBothComplete ");
						project._taskDoneCheckReloadURL();
					}
				}
				console.log("GRAPH");
				project.saveFileFromData(graphData, fullGraphPath, savedGraphComplete);
				console.log("TRACK");
				project.saveFileFromData(trackData, fullTrackPath, savedTrackComplete);

				console.log(" end  doWorldTrackAdd END");
				return;
			}



			if(loadViews.length==0 && loadPairs.length==0){
				// skip to next too
				// loadPairIndex = ???
				loadedReadyCheck();
			}

			return; // end loading pairs/views for tracks
		} // done setting INITIAL track data object
console.log("load the track file: "+fullTrackPath);
// throw "?";
		var currentTrackFileLoadComplete = function(d){
			console.log("currentTrackFileLoadComplete");
			console.log(d);
			trackData = d;
			fxnGroupTrackLoaded();
		}
		if(!trackData){
			// console.log(trackData);
			// throw "no trackData";
			project.loadDataFromFile(fullTrackPath, currentTrackFileLoadComplete);
			// throw "need to load trackData";
		}else{
			// throw "anyway ?fxnGroupTrackLoaded";
			fxnGroupTrackLoaded();
		}
		return;
	}
	
	project.loadDataFromFile(graphFile, fxnGraphLoaded, project);
	// 

	// NEED TRACK FILE FOR EACH GROUP [critical pairs]
	// + FOR FULL GROUP [all possible pairs]
	// combine from closeness only
	// TODO: TRACK COLLISION RESOLUTION?
}



App3DR.ProjectManager.prototype._putativePairsFromViewsAndTransforms = function(views, transforms){
	var project = this;
// throw ".. _putativePairsFromViewsAndTransforms"
	var viewCount = views.length;
	var graph = new Graph();
	var minMatchesForEdge = 16;
	// create nodes & tables
	var viewIDToVertex = {};
	var viewIDToIndex = {};
	var viewIndexToViewID = {};
	var vertexes = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view["id"];
		var vertex = graph.addVertex();
var data = Code.copyObject(view);
// console.log(transform);
var extrinsic = Matrix.fromObject(view["transform"]);
// console.log(extrinsic);
var absolute = Matrix.inverse(extrinsic);
data["absolute"] = absolute;
		vertex.data(data);
		viewIDToIndex[viewID] = i;
		viewIDToVertex[viewID] = vertex;
		viewIndexToViewID[i] = viewID;
		vertexes.push(vertex);
	}

	// create edges
	// var transformLookupPairID = {};
console.log(transforms);
var pairIDToError = {};
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matchCount = transform["matches"];
		if(matchCount<minMatchesForEdge){
			continue;
		}
		var viewIDA = transform["A"];
		var viewIDB = transform["B"];
		var errorR = transform["errorRMean"] + transform["errorRSigma"];
		var vertexA = viewIDToVertex[viewIDA];
		var vertexB = viewIDToVertex[viewIDB];
		var data = {};
			data["error"] = errorR;
			data["transform"] = transform;
		var edge = graph.addEdgeDuplex(vertexA,vertexB, errorR);
		edge.data(data);
		// used later:
		var list = [viewIDA,viewIDB];
			list.sort();
		var idA = list[0];
		var idB = list[1];
		var pairID = idA+"-"+idB;
		pairIDToError[pairID] = data["error"];
	}
	var averageConnectivity = graph.averageConnectivity();
	console.log("averageGraphConnectivity: "+averageConnectivity);
	var maxNodes = 20;
	var maxAdjacency = Math.pow(maxNodes, 1.0/averageConnectivity);
	console.log("maxAdjacency: "+maxAdjacency);

	var sort0Fxn = function(a,b){
		return a[0] < b[0] ? -1 : 1;
	}
	var sortABFxn = function(a,b){
		return a < b ? -1 : 1;
	}
	var pairIDFxn = function(a,b){
		if(sortABFxn(a,b)<0){
			return a+"-"+b;
		}else{
			return b+"-"+a;
		}
	}
	// 
	console.log("A) BASE = GET SKELETON PAIRS");
	console.log(graph);
	var maxErrorMultiple = 4.0;
	var info = graph.skeletalEdges(maxErrorMultiple);
	console.log(info);
	var requiredEdges = info["edges"];
	console.log(requiredEdges);
	// 
	// 
	// 
	// final list of putative pairs:
	var pairLookup = {};

	// add required edges as base layer:
	for(var i=0; i<requiredEdges.length; ++i){
		var edge = requiredEdges[i];
		var data = edge.data();
		var a = edge.A();
		var b = edge.B();
		a = a.data();
		b = b.data();
		a = a["id"];
		b = b["id"];
		var pairID = pairIDFxn(a,b);
		var score = data["error"];
		pairLookup[pairID] = {"A":a,"B":b,"s":score};
	}
	
	console.log("B) GET LOWEST-ERROR ADDITIONAL PAIRS");
	// find bests:
	var minimumPairMatches = 3; // assuming @ 50% error -- backup pair to create triple [sparse->dense] 2-4
	var maximumPairMatches = 10; // don't want too many matches
// maximumPairMatches = 3; // 40
maximumPairMatches = 4; // 51
// maximumPairMatches = 5; // 62
// maximumPairMatches = 6; // 77
// maximumPairMatches = 7; // 87
	var maximumViewPairAngle = Code.radians(60.0); // 45-90 | 45+error = 60
	var maximumViewDistanceMultiple = 4.0; // depends on a neighborhood size ... point targets ...  --- NOT USED YET
console.log("TODO: get average point location after reconstruction & sigma -- spherical");
// 4  - 3
// 9  - 4
// 16 - 5
// 25 - 6
// 36 - 7
// 49 - 8
// 64 - 9
		maximumPairMatches = Math.min( Math.round(2 + Math.sqrt(viewCount)), maximumPairMatches);
	console.log("pair limits: [ "+minimumPairMatches+" - "+maximumPairMatches+" ]");
		maximumPairMatches = Math.max(minimumPairMatches,maximumPairMatches);
	var maximumNeighborhoodAdjacency = 4; // direct=0, +1,+2,+3] -- don't want to try too far away -- 2-3 -- TODO: THIS IS HIGH
	var maximumPropagatedErrorRatio = 8; // don't want high-error guesses -- 2-4 -- TODO: THIS IS HIGH
	var pairLookup = {};
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var paths = graph.minPaths(vertex);
		var neighborhoodLookup = [];
		for(var j=0; j<paths.length; ++j){
			var path = paths[j];
			var p = path["path"];
			var count = p.length;
			if(count>0){
				var list = neighborhoodLookup[count];
				if(!list){
					list = [];
					neighborhoodLookup[count] = list;
				}
				list.push(path);
			}
		}
		var foundPairsList = [];
		for(var d=0; d<=maximumNeighborhoodAdjacency; ++d){
			var paths = neighborhoodLookup[d];
			if(paths){
				for(var p=0; p<paths.length; ++p){
					var path = paths[p];
					var es = path["edges"];
					var v = path["vertex"];
					var costD = path["cost"];
					var cost0 = es[0].weight();
					var costMax = cost0*maximumPropagatedErrorRatio;
					// check for visual consistency:
					var absoluteA = vertex.data()["absolute"];
					var absoluteB = v.data()["absolute"];
					var oA = absoluteA.multV3DtoV3D(new V3D(0,0,0));
					var oB = absoluteB.multV3DtoV3D(new V3D(0,0,0));
					var nA = absoluteA.multV3DtoV3D(new V3D(0,0,1));
						nA.sub(oA);
					var nB = absoluteB.multV3DtoV3D(new V3D(0,0,1));
						nB.sub(oB);
					// 
					var angle = V3D.angle(nA,nB);
// maximumViewPairAngle = 999;
					// console.log("ANGLE: "+Code.degrees(angle));
					// TODO: distance from subject points
					if(angle<maximumViewPairAngle){
						if(costD<costMax){

							// var pairCost = costD*Math.pow(d+1,2); // further away graphically is bad too
							var pairCost = costD;
							foundPairsList.push([pairCost,v]);
						}else{
							// console.log("pair cost too high: "+costD+" of "+costMax);
						}
					}else{
						// console.log("angle too large: "+Code.degrees(angle));
					}
				}
			}
		}
		foundPairsList.sort(sort0Fxn);
		console.log("foundPairsList: "+foundPairsList.length);
		// console.log(foundPairsList);
		Code.truncateArray(foundPairsList,maximumPairMatches);
		var viewID = vertex.data()["id"];
		for(var j=0; j<foundPairsList.length; ++j){
			var p = foundPairsList[j];
			var score = p[0];
			var pID = p[1].data()["id"];
			var idA = viewID < pID ? viewID : pID;
			var idB = viewID < pID ? pID : viewID;
			var pairID = idA+"-"+idB;
			pairLookup[pairID] = {"A":idA,"B":idB,"s":score};
		} // App3DR.ProjectManager.pairIDFromViewIDs
	}
	
	var pairs = Code.objectToArray(pairLookup);

console.log("PAIRS: "+pairs.length);
// throw "..."
	console.log(pairs);
	console.log(pairLookup);
	console.log(views);

console.log("SHOW THIS GRAPH");
// show the graph:
var orderedAbsoluteTransforms = [];
var groupIDs = [];
var viewIDToIndex = {};
for(var v=0; v<views.length; ++v){
	var view = views[v];
	// console.log(view);
	var viewID = view["id"];
	var trans = view["transform"];
		trans = Matrix.fromObject(trans);
	var abs = Matrix.inverse(trans); // absolute
	orderedAbsoluteTransforms.push(abs);
	groupIDs.push(viewID);
	viewIDToIndex[viewID] = v;
}
var groupPairsPass = [];
for(var v=0; v<pairs.length; ++v){
	var pair = pairs[v];
	// console.log(pair);
	var viewIDA = pair["A"];
	var viewIDB = pair["B"];
	var viewIndexA = viewIDToIndex[viewIDA];
	var viewIndexB = viewIDToIndex[viewIDB];
	groupPairsPass.push( [viewIndexA,viewIndexB] );
}
project.displayViewGraph(orderedAbsoluteTransforms,groupPairsPass, 0, groupIDs, 0xFFCC0000, 2.0);




// throw "before leave putative pairs";
	return {"pairs":pairs, "lookup":pairLookup};
}

App3DR.ProjectManager._BAPairsDefaultOrSorted = function(baViews, data){
	// console.log(baViews,data);
	// throw "_BAPairsDefaultOrSorted"
	baOptimizations = data["ba"];
	if(!baOptimizations){
		baOptimizations = [];
		for(var i=0; i<baViews.length; ++i){
			var view = baViews[i];
			var opt = {};
			opt["id"] = view["id"];
			opt["deltaErrorR"] = null;
			// opt["deltaErrorF"] = null;
			opt["errorR"] = null;
			// opt["errorF"] = null;
			opt["updated"] = null;
			opt["count"] = null;
			baOptimizations[i] = opt;
		}
		data["ba"] = baOptimizations;
	}
	var sortErrorRFxn = function(a,b){
		a = a["deltaErrorR"];
		b = b["deltaErrorR"];
		// do null first
		if(a===null && b===null){
			return -1;
		}
		if(a===null && b!==null){
			return -1;
		}
		if(b===null && a!==null){
			return 1;
		}
		return a > b ? -1 : 1; // do highest-reduction-error first
	}
	baOptimizations.sort(sortErrorRFxn);
	return baOptimizations;
}


App3DR.ProjectManager.prototype.fillInWorldAll = function(inViews, cellSize,  inCameras){
	var project = this;
	var world = new Stereopsis.World();
	// var cameras = project.cameras(); // should come from input 
	var cameras = inCameras;
	if(!cameras){
		throw "need cameras";
		cameras = inCameras;
	}
	var info = project.fillInWorldViews(cameras, inViews, null, cellSize);
	var views = info["views"];
	var images = info["images"];
	var cellSizes = info["cellSizes"];
	var transforms = info["transforms"];

	// create world
	
	var WORLDCAMS = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	console.log(WORLDCAMS);
	var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes, transforms);
	console.log(WORLDVIEWS);
	var WORLDVIEWSLOOKUP = project.createWorldViewLookup(world);
	console.log(WORLDVIEWSLOOKUP);

	// world.copyRelativeTransformsFromAbsolute();
	// world.resolveIntersectionByPatchGeometry();

	var info = {"world":world, "views":WORLDVIEWS, "cameras":WORLDCAMS, "lookup":WORLDVIEWSLOOKUP};
	return info;
}


App3DR.ProjectManager.pairIDFromViewIDs = function(idA,idB){
	return idA < idB ? (idA+"-"+idB) : (idB+"-"+idA);
}
App3DR.ProjectManager.prototype._absoluteViewsFromDatas = function(views, pairs, triples){
	if(triples.length<0){
		throw "no triples, can't continue";
	}
/*
console.log(triples.length+" < BEFORE");
for(var i=0; i<triples.length; ++i){
	var triple = triples[i];
	var gauge = triple["gauge"];
	var AB = gauge["AB"];
	var AC = gauge["AC"];
	var BC = gauge["BC"];
	if(AB==0 || AC==0 || BC==0){
		// Code.removeElementAt(triples,i);
		// --i;
	}else{
		Code.removeElementAt(triples,i);
		--i;
	}
}
console.log(triples.length+" < AFTER");
*/


/*


// TESTING:
	console.log(views);
	console.log(pairs);
	console.log(triples);

	var newViews = [];
	var newViewLookup = {};
	for(var i=0; i<views.length; ++i){
		var m = new Matrix(4,4).identity();
			m = Matrix.transform3DTranslate(m, 0,0,-10);
			m = Matrix.transform3DRotateY(m, Code.radians(-10*i));
			m = Matrix.transform3DTranslate(m, 1,2,3);
			// m = Matrix.inverse(); // if want extrinsic
		var view = views[i];
		var viewID = view["id"];
		var newView = {"id":viewID, "absolute":m};
		newViewLookup[viewID] = newView;
		newViews[i] = newView;
	}

// var s = 0.0;
// var s = 0.10;
// var s = 0.50;
var s = 1.00;

// var a = Code.radians(0.0);
// var a = Code.radians(10.0);
// var a = Code.radians(30.0);
var a = Code.radians(45.0);

// var g = 0.0;
// var g = 0.1;
// var g = 0.5;
var g = 1.0; // 0.5 - 2.0

	var newPairs = [];
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var indexA = pair["A"];
		var indexB = pair["B"];
		var matrixAB = pair["R"];
		var entryA = newViewLookup[indexA];
		var entryB = newViewLookup[indexB];
		var matrixA = entryA["absolute"];
		var matrixB = entryB["absolute"];
		var relAB = Matrix.relativeReference(matrixA,matrixB);
		// ERROR:
		relAB = Matrix.transform3DTranslate(relAB, (Math.random()-0.5)*s,(Math.random()-0.5)*s,(Math.random()-0.5)*s);
		relAB = Matrix.transform3DRotateX(relAB, (Math.random()-0.5)*a);
		relAB = Matrix.transform3DRotateY(relAB, (Math.random()-0.5)*a);
		relAB = Matrix.transform3DRotateZ(relAB, (Math.random()-0.5)*a);

		var extAB = Matrix.inverse(relAB);
		newPair = {};
		newPair["id"] = pair["id"];
		newPair["A"] = pair["A"]
		newPair["B"] = pair["B"];
		newPair["relative"] = pair["relative"];
		newPair["relativeError"] = pair["relativeError"];
		// newPair["R"] = relAB;
		
		newPair["R"] = extAB;
		
		newPairs[i] = newPair;
	}

	var newTriples = [];
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var newTriple = {};
			newTriple["id"] = triple["id"];
			newTriple["A"] = triple["A"];
			newTriple["B"] = triple["B"];
			newTriple["C"] = triple["C"];
			var gauge = triple["gauge"];
			var newGauge = {"AB": 0.0, "AC": 0.0, "BC": 0.0};
			if(gauge["AB"]>0){
				newGauge["AB"] = 1.0 * Math.exp((Math.random()-0.5)*g);
			}
			if(gauge["AC"]>0){
				newGauge["AC"] = 1.0 * Math.exp((Math.random()-0.5)*g);
			}
			if(gauge["BC"]>0){
				newGauge["BC"] = 1.0 * Math.exp((Math.random()-0.5)*g);
			}
			newTriple["gauge"] = newGauge;
		newTriples[i] = newTriple;
	}

views = newViews;
pairs = newPairs;
triples = newTriples;

console.log(newViews);
console.log(newPairs);
console.log(newTriples);

*/


	var viewToID = function(view){
		return view["id"];
	};
	var viewToCameraID = function(view){
		return view["camera"];
	};
	var pairToIDs = function(pair){
		return [pair["A"],pair["B"]];
	};
	var pairToError = function(pair){
		// return 1;
		// return pair["relativeError"];
		return pair["relativeError"]/pair["relative"];
	};
	var pairToCameras = function(pair){
		return pair["cameras"];
	};
	var cameraToID = function(camera){
		return camera["id"];
	};
	var cameraToK = function(camera){
		var K = camera["K"];
		K = Matrix.fromObject(K);
		return K;
	};
	var pairToTransform = function(pair, idA,idB){
		var R = pair["R"]; // extrinsic
		R = Matrix.inverse(R); // absolute
		return R;
	};
	var tripleToIDs = function(triple){
		return [triple["A"],triple["B"],triple["C"]];
	};
	var tripleToScales = function(triple){
		var gauge = triple["gauge"];
		console.log(gauge);
		var scales = [gauge["AB"],gauge["AC"],gauge["BC"]];
		var errors = [gauge["AB-AC"],gauge["AB-BC"],gauge["AC-BC"]];
		for(var i=0; i<errors.length; ++i){
			errors[i] = Math.exp(errors[i]); // from log to scale
		}
		return {"scales":scales, "errors":errors};
		// var list = [gauge["AB"],gauge["AC"],gauge["BC"]];
		// return list;
	};
	// var cameraToK = function(camera){
	// 	console.log(camera);
	// 	throw "... cameraToK"
	// 	return camera["K"];
	// };

// this.displayOriginalViewGraph(views, pairs, triples, viewToID,pairToIDs,tripleToIDs, pairToError,pairToTransform,tripleToScales);
console.log(pairs);
console.log("pairs");

console.log(triples);
console.log("triples");

console.log(views);
console.log("views");


// throw "AVERAGE CAMERAS USING ERROR"

// throw "?"
	var result = Code.graphAbsoluteFromObjectLookup3D(views, pairs, triples, viewToID,pairToIDs,tripleToIDs, pairToError,pairToTransform, tripleToScales,  null, viewToCameraID,pairToCameras,cameraToID,cameraToK);
console.log(result);
// console.log("result");
// throw "does this have gauge errors?"
	var groups = result["groups"];
	if(groups.length==0){
		throw "no groups, can't continue";
	}
	var first = groups[0];
	var groupTransforms = first["transforms"];
	var groupPairs = first["pairs"];
	var groupViews = first["views"];
	var allCameras = result["cameras"];
console.log(groupPairs);
console.log(allCameras);

// throw "?............"


var minimumStringFirst = function(a,b){
	return a < b ? (a+"-"+b) : (b+"-"+a);
}
var pairLookup = {};
for(var i=0; i<pairs.length; ++i){
	var pair = pairs[i];
	var viewIDs = pairToIDs(pair);
	var pairID = minimumStringFirst(viewIDs[0],viewIDs[1]);
	pairLookup[pairID] = pair;
}
var groupPairsPass = [];
for(var i=0; i<groupPairs.length; ++i){
	var groupPair = groupPairs[i];
	var a = viewToID(views[groupPair[0]]);
	var b = viewToID(views[groupPair[1]]);
	var pairID = minimumStringFirst(a,b);
	var pair = pairLookup[pairID];
	var AtoB = pairToTransform(pair);
	var viewIDs = pairToIDs(pair);
	if(viewIDs[0]!=a){
		AtoB = Marix.inverse(AtoB);
	}
	var p2 = [groupPair[0],groupPair[1],AtoB,groupPair[2]];
	groupPairsPass[i] = p2;
}

	var orderedTransforms = Code.newArrayNulls(views.length);
	for(var i=0; i<groupViews.length; ++i){
		var viewIndex = groupViews[i];
		var transform = groupTransforms[i];
		orderedTransforms[viewIndex] = transform;
	}
// var viewIndextoViewID = graph["views"];
// for(var v=0; v<viewIndextoViewID.length; ++v){
// 	var index = viewIndextoViewID[v];
// 	viewIndextoViewID[v] = graphViews[index]["id"];
// }
// throw "the transforms are implied in order in views ... should order .... "

// REORDER VIEWS TO BE USIN THE CORRECT INDEXES

// still problem with edges ?

var groupIDs = [];
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var viewID = viewToID(view);
	groupIDs[i] = viewID;
}


console.log(orderedTransforms);
console.log(groupPairs);
console.log(groupPairsPass);
console.log(groupIDs);

// throw "..."

// HERE
	this.displayViewGraph(orderedTransforms,groupPairsPass, 100, groupIDs);

	// absolute to extrinsic
	for(var i=0; i<orderedTransforms.length; ++i){
		if(orderedTransforms[i]){
			orderedTransforms[i] = Matrix.inverse(orderedTransforms[i]);
		}
	}



// remove unreachable views from largest group:


// need to reduce IDs to new set:

// throw "... reduced set:";


// var doSkeleton = false;
var doSkeleton = true;

	var skeleton; // SKELETON EDGES & VERTEXES
	var backbone; // VERTEXES [VIEWS]
	var groups; // GROUP VERTEXES

	if(doSkeleton){
		skeleton = R3D.skeletalViewGraph(groupPairs);
// console.log(skeleton);
// throw "have skeleton"
		backbone = skeleton["skeletonVertexes"];
		groups = skeleton["groupVertexes"];
	}else{ // just include everything as skeleton
		var allEdges = groupPairs;
		var allVertexes = groupViews;
		skeleton = {};
		skeleton["skeletonEdges"] = allEdges;
		skeleton["groupEdges"] = [];
		groups = [];
		backbone = allVertexes;
	}

console.log(backbone);

// throw "????????? _absoluteViewsFromDatas"

	return {"transforms":orderedTransforms, "cameras":allCameras, "views":views, "skeleton":backbone, "groups":groups, "skeletonEdges":skeleton["skeletonEdges"], "groupEdges":skeleton["groupEdges"]};
}

App3DR.ProjectManager.prototype.calculatePairMatchWithRFromViewIDs = function(viewAID, viewBID, relativeAB, camAID, camBID, cameras, completeFxn, completeCxt, settings){ // R => better initial matches
	var project = this;
	if(!settings){
		settings = {};
		// settings["relativeAB"] = null;
		// settings["cellCount"] = 80;
		// settings["maximumMatchFeatures"] = 1100;
		// settings["minimumMatchPoints"] = 16;
		// settings["maximumErrorTracksF"] = 0.002; // 0.002 @ 500 = 1
	}
	var SETTING_INC_RES = "incrementResolution";
	var SETTING_MAX_ERR_R = "maximumErrorTracksR";
	var SETTING_CEL_SIZ = "cellSize";
	settings[SETTING_INC_RES] = Code.valueOrDefault(settings[SETTING_INC_RES], 0);
	settings[SETTING_MAX_ERR_R] = Code.valueOrDefault(settings[SETTING_MAX_ERR_R], 0.002);
	settings[SETTING_CEL_SIZ] = Code.valueOrDefault(settings[SETTING_CEL_SIZ], 40);









/*
var readFile = "dense/pairs/PPJ1TEVI-VHGZSV82/relative_bad.yaml"

var saveFile = "dense/pairs/PPJ1TEVI-VHGZSV82/relative.yaml";

var loadedFile = function(a){
	console.log("loadedFile");
	// console.log(a);
	// var y = YAML.parse(a); // object -> string
	// console.log(y);
	//var data = y;
	// saveFileFromData
	var data = a;
	project.saveFileFromData(data,saveFile, savedFile,project);
	// project.saveFileFromData(data,saveFile, savedFile,project);
}

var savedFile = function(a,b,c){
	console.log(a);
	console.log(b);
	console.log(c);
};
var cxt = project;

project.loadDataFromFile(readFile, loadedFile);

throw "reading"
*/



/*
var data = "1234567890\n";
for(var i=0; i<18; ++i){
	data = data+""+data;
}
console.log("string size: "+data.length);
// var filename = "dense/pairs/BGXIJVBF-PPJ1TEVI/relative.yaml";
var filename = "dense/pairs/PPJ1TEVI-VHGZSV82/relative.yaml";
var fxn = function(a,b,c){
	console.log(a);
	console.log(b);
	console.log(c);
};
var cxt = project;
project.saveFileFromData(data,filename, fxn,cxt);

throw "no more";

*/

	var errorSearchRMaximumPercent = 0.005; // 0.001 - 0.010 // 5 on 1025


	// var maxErrorRDensePercent = 0.004; // 4 on 1024
	// var maxErrorFDensePercent = 0.004 * 1.5;
	// var maxErrorRTrackPercent = 0.001; // 1 on 1024
	// var maxErrorFTrackPercent = 0.001 * 1.5;


	var maxErrorRDensePercent = 0.004; // 4 @ 1024
	var maxErrorFDensePercent = 0.0075; // 7 @ 1024
	var maxErrorRTrackPercent = 0.002; // 2 @ 1024
	var maxErrorFTrackPercent = 0.003; // 3 @ 1024

	// dense needs more strict standards - maybe half ?

	console.log("calculatePairMatchWithRFromViewIDs");

console.log(relativeAB);

	// create 2 fake views:
	var origin = new Matrix(4,4).identity().toObject();
	var vA = {"id":viewAID, "transform":origin, "camera":camAID};
	var vB = {"id":viewBID, "transform":relativeAB, "camera":camBID};
	var allViews = [vA,vB];

	// get only cameras needed:
	var allCameras = {};
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		console.log(camera);
		allCameras[camera["id"]] = camera;
	}
	var useCameras = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var cameraID = view["camera"];
		useCameras[cameraID] = allCameras[cameraID];
	}

	allCameras = Code.objectToArray(useCameras);
	// console.log(allCameras);
	// console.log(allViews);
// throw "...";
	// var allCameras = [];

	// var cellSize = 80;
	// var cellSize = 60; // beween sparse and dense
	// var cellSize = 40;

	var cellSize = settings[SETTING_CEL_SIZ];
	console.log("cellSize: "+cellSize);

	// load view dense-resolution images
	var expectedImages = allViews.length;
	var loadedImages = 0;

	
	var checkLoadedAllImages = function(){
		console.log("checkLoadedAllImages");
		++loadedImages;
		if(expectedImages>loadedImages){
			return;
		}
		console.log("loadedImages");
		solveWorld();
		// doDisplay();
	}

	// var doDisplay = function(){
	// 	console.log("doDisplay");
	// 	console.log(allViews);
	// }

	var solveWorld = function(){
		// build world
console.log("fillInWorldAll");
console.log(allCameras);
console.log(allViews);
console.log(cellSize);
console.log(" ^^^^^^^^^^^^^ IS CELL SIZE UNDEFINED?");
		var info = project.fillInWorldAll(allViews, cellSize, allCameras);
		var WORLDCAMS = info["cameras"];
		var WORLDVIEWS = info["views"];
		var WORLDVIEWSLOOKUP = info["lookup"];
		var world = info["world"];


console.log(world);

		console.log("seed points");
		// var Ka = view0.camera().K();
		var viewA = WORLDVIEWS[0];
		var viewB = WORLDVIEWS[1];
		var KimageA = viewA.K();//view0.camera().K();//R3D.cameraFromScaledImageSize(K, imageScalesA.size());
		var KimageB = viewB.K();//view1.camera().K();//R3D.cameraFromScaledImageSize(K, imageScalesA.size());
		var imageScalesA = viewA.imageScales();
		var imageScalesB = viewB.imageScales();

		console.log("calculate pixel error limits ");
		console.log(imageScalesA);
		console.log(imageScalesB);
		var hypA = imageScalesA.size().length();
		var hypB = imageScalesB.size().length()
		var hyp = (hypA+hypB)*0.5;
		maxErrorRDensePixels = hyp*maxErrorRDensePercent;
		maxErrorFDensePixels = hyp*maxErrorFDensePercent;
		maxErrorRTrackPixels = hyp*maxErrorRTrackPercent;
		maxErrorFTrackPixels = hyp*maxErrorFTrackPercent;
		console.log(" maxErrorRDensePixels: "+maxErrorRDensePixels);
		console.log(" maxErrorFDensePixels: "+maxErrorFDensePixels);
		console.log(" maxErrorRTrackPixels: "+maxErrorRTrackPixels);
		console.log(" maxErrorFTrackPixels: "+maxErrorFTrackPixels);
// throw "HERE";

		console.log(KimageA);
		console.log(KimageB);
		console.log(relativeAB);
		var P = viewB.absoluteTransform();
		console.log(P);
GLOBALSTAGE.root().matrix().scale(0.50); // dense
// GLOBALSTAGE.root().matrix().scale(0.25); // BA
		var doRelocation = true;
		var result = R3D.searchMatchPointsPair3D(imageScalesA,imageScalesB, P, KimageA,KimageB, errorSearchRMaximumPercent, doRelocation); // forward
		console.log(result);
		var pointsA = result["A"];
		var pointsB = result["B"];
		var affinesAB = result["affines"];
		console.log("GOT: R3D.searchMatchPointsPair3D : "+pointsA.length);
		
		// var error = R3D.reprojectionErrorList(estimated3D, reprojected2DA, reprojected2DB, camIdentity,camAtoB, K,K);





	// var pointsA = [];
	// var pointsB = [];
	// var affinesAB = [];
	// var rError = R3D.reprojectionError(???);
	// GLOBALSTAGE.root().matrix().scale(0.5);
	var imageA = imageScalesA.images()[0];
	var imageB = imageScalesB.images()[0];
	var cellSize = imageA.size().length() * 0.02;
	console.log("cellSize: "+cellSize);


		var needleRefineSize = 41;
		var haystackRefineSize = needleRefineSize + (needleRefineSize*0.5 | 0) + 2;
		var needleRefine = new ImageMat(needleRefineSize,needleRefineSize);
		var haystackRefine = new ImageMat(haystackRefineSize,haystackRefineSize);
		var compareSize = imageA.size().length() * 0.02;
		var doBlur = false;
		// var doBlur = true;
		// var halfCompareSize = compareSize;
		

// show matches & closest point:
	var distances = [];
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var affineAB = affinesAB[i];
		var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScalesA,imageScalesB, compareSize, needleRefineSize,haystackRefineSize, affineAB, needleRefine,haystackRefine, doBlur);
		var best = result["point"];
		var dist = V2D.distance(best,pointB);
		distances.push(dist);
		if(dist>cellSize){
			Code.removeElementAt(pointsA,i);
			Code.removeElementAt(pointsB,i);
			Code.removeElementAt(affinesAB,i);
			// set to best point
			pointB.x = best.x;
			pointB.y = best.y;
		}
	}
	console.log("distances: ");
	Code.printMatlabArray(distances);


/*
// if(DEBUG_SHOW){
	// var alp = 1.0;
	// var alp = 0.75;
	var alp = 0.50;
	// var alp = 0.25;
	var img = imageA;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	var img = imageB;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(imageA.width(),0);
	GLOBALSTAGE.addChild(d);
// }
		
		R3D.showForwardBackwardCells(pointsA, pointsB, affinesAB, imageA,imageB, GLOBALSTAGE, cellSize);

*/
// throw "AFTER searchMatchPointsPair3D"

		// new points
		var points3DAdd = [];
		var errorsR = [];
		for(var j=0; j<pointsA.length; ++j){
			var p2DA = pointsA[j];
			var p2DB = pointsB[j];
			var affineAB = affinesAB[j];
			var newMatch = world.newMatchFromInfo(viewA,p2DA.copy(),viewB,p2DB.copy(),affineAB);
			points3DAdd.push(newMatch.point3D());
		}
		console.log("points3DAdd:");
		console.log(points3DAdd);

/*

		// create seed points:
		// world.setResolutionProcessingModeFromCountP3D([]); // currently 0
		world.setResolutionProcessingModeBest();
		world.shouldValidateMatchRange(true);
		world.copyRelativeTransformsFromAbsolute();

		// add
		world.initPoints3DLocation(points3DAdd);
		world.initAllP3DPatches(points3DAdd);
		world.initAffineFromP3DPatches(points3DAdd);
		world.embedPoints3D(points3DAdd);

		// update the points
		world.updatePatchesPoints3DFromNeighborhood(points3DAdd);



		// world._resolutionProcessingModePatchInit = world.initP3DPatchFromVisual;
		// world._resolutionProcessingModePatchUpdate = world.updateP3DPatchFromVisual;
		// world._resolutionProcessingModeAffineSet = world._resolutionProcessingModeAffineFromPatch3D;

		world._resolutionProcessingModePatchInit = world.initP3DPatchFromNeighborhoodVisual;
		// world._resolutionProcessingModePatchUpdate = world.updateP3DPatchFromVisual;
		world._resolutionProcessingModePatchUpdate = world.initP3DPatchFromNeighborhoodVisual; // full redo
		world._resolutionProcessingModeAffineSet = world._resolutionProcessingModeAffineFromPatch3D;

*/
		console.log("solveDensePair");
		world.solveDensePair(points3DAdd);
// console.log(info);
// throw "before solveDensePair"
		// //
// console.log("LOOK AT SEED PATCHES FIRST")
		// world.solveDensePairNew();
		// //
		// GLOBALSTAGE.root().matrix().scale(0.25);
		// world.showForwardBackwardPair();
		// //
		// //
		// //
		var str = world.toYAMLString();
		console.log(str);
		// world.showProjectedPatches();
// throw "before save solveDensePairNew"
		// //
		var goodEnoughMatches = true;
		// //
		var pairData = App3DR.ProjectManager.defaultPairFile(viewAID,viewBID);
		// //
		// throw "AFTER DENSE - NEW PAIR DONE"
		// //
		var transform = world.toTransformArray()[0];
		var errorR = (transform.rSigma() + transform.rMean()) * 0.5;
		var errorF = (transform.fSigma() + transform.fMean()) * 0.5;
		console.log("transform error R: "+transform.rMean()+" +/- "+transform.rSigma());
		console.log("transform error F: "+transform.fMean()+" +/- "+transform.fSigma());
		console.log("transform error R: "+errorR+" of "+maxErrorRDensePixels);
		console.log("transform error F: "+errorF+" of "+maxErrorFDensePixels);

		if(errorR>maxErrorRDensePixels || errorF>maxErrorFDensePixels){
			console.log(" ERROR FOUND TOO HIGH - DENSE REGULAR");
			goodEnoughMatches = false;
		}

	

		if(goodEnoughMatches){
			pairData["relative"] = world.toObject();

			// var str = world.toYAMLString();
			// console.log(str);
			// throw "before tracks";

			console.log("do tracks");
			world.solveForTracks();

			// var errorR = (transform.rSigma() + transform.rMean());
			// var errorF = (transform.fSigma() + transform.fMean());
			var errorR = (transform.rSigma() + transform.rMean()) * 0.5;
			var errorF = (transform.fSigma() + transform.fMean()) * 0.5;

			console.log("transform error R: "+transform.rMean()+" +/- "+transform.rSigma());
			console.log("transform error F: "+transform.fMean()+" +/- "+transform.fSigma());
			console.log("transform error R: "+errorR+" of "+maxErrorRTrackPixels);
			console.log("transform error F: "+errorF+" of "+maxErrorFTrackPixels);

			if(errorR>maxErrorRTrackPixels || errorF>maxErrorFTrackPixels){
				console.log(" ERROR FOUND TOO HIGH - DENSE TRACKS");
				goodEnoughMatches = false;
			}

			if(goodEnoughMatches){
				pairData["tracks"] = world.toObject();
			}
		}


var str = world.toYAMLString();
console.log(str);

// throw "after solve - before save dense pair iteration"

		// if good enough, record matches

		// if good enougn, record relative
		// 	var viewAverageWidth = (imageAWidth+imageBWidth)*0.5;
		// 	var matchData = {};
		// 		matchData["F"] = fNorm;
		// 		matchData["errorFMean"] = fMean/viewAverageWidth;
		// 		matchData["errorFSigma"] = fSigma/viewAverageWidth;
		// 		matchData["points"] = matchesAB;
		// 		matchData["count"] = matchesAB.length;
		// 	pairData["matches"] = matchData;
		// if(errorR<maximumRErrorTracks && errorF<maximumFErrorTracks){
		// 	pairData["metricNeighborsToWorld"] = reconstructionMetric;
		// }

		console.log(pairData);

		// throw "before done with dense pair ?"
		completeFxn.call(completeCxt, pairData);
	}


	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var viewID = view["id"];
		view = project.viewFromID(viewID);
		view.loadDenseHiImage(checkLoadedAllImages, project);
		// view.loadBundleAdjustImage(checkLoadedAllImages, project); // not shown to be much better (5%)
	}
}

App3DR.ProjectManager.prototype.calculatePairMatchFromViewIDs = function(viewAID, viewBID, camAID, camBID, cameras, completeFxn, completeCxt, settings){ // matches, F, R, tracks - SPARSE

	// console.log(viewAID, viewBID, camAID, camBID, cameras, completeFxn, completeCxt, settings);
// console.log("calculatePairMatchFromViewIDs")
// throw "..."
	if(!settings){
		settings = {};
		// settings["relativeAB"] = null;
		settings["cellCount"] = 40;
		settings["maximumMatchFeatures"] = 1200;
		settings["minimumMatchPoints"] = 16;
		settings["incrementResolution"] = 0;
		settings["minimumCountFInit"] = 20; // fwd-bak matches -- 25-50-100
		settings["maximumErrorFInit"] = 0.04; // 0.02 @ 500 = 10 -- initial F estimate [~100 features]
		settings["maximumErrorFDense"] = 0.02; // 0.01 @ 500 = 5 -- dense F estimate [~500 features]
		settings["maximumErrorRDense"] = 0.015; // ?
		settings["maximumErrorTracksF"] = 0.005; // 0.01 @ 500 = 5 -- final stereopsis estimate F
		settings["maximumErrorTracksR"] = 0.005; // 0.01 @ 500 = 5 -- final stereopsis estimate R
		settings["minimumCountTrackFinal"] = 50; // 1k-10k REGULAR => 100-1k track

		// settings["minimumCountFInit"] = 20; // fwd-bak matches -- 25-50-100
		// settings["maximumErrorFInit"] = 0.01; // 0.02 @ 500 = 10 -- initial F estimate [~100 features]
		// settings["maximumErrorFDense"] = 0.005; // 0.01 @ 500 = 5 -- dense F estimate [~500 features]
		// settings["maximumErrorTracksF"] = 0.004; // 0.01 @ 500 = 5 -- final stereopsis estimate F
		// settings["maximumErrorTracksR"] = 0.002; // 0.01 @ 500 = 5 -- final stereopsis estimate R
	}
	console.log("calculatePairMatchFromViewIDs: "+viewAID+" & "+viewBID);

// // listed in percents:
// var maxErrorFInitPixels = 0.10; // 10-20%
// var maxErrorFDensePixels = 0.05; // 5-10%
// var maxErrorFTrackPixels = 0.025; // 1-5%
// var maxErrorRTrackPixels = 0.02; // 1-5%
// maxErrorFInitPixels = maxErrorFInitPixels * hyp;
// maxErrorFDensePixels = maxErrorFDensePixels * hyp;
// maxErrorFTrackPixels = maxErrorFTrackPixels * hyp;
// maxErrorRTrackPixels = maxErrorRTrackPixels * hyp;


	var project = this;
	var featureDataA = null;
	var featureDataB = null;
	var imageA = null;
	var imageB = null;
	var stage = this._stage;
	var self = this;
	var matchCount = null;
	var viewA = this.viewFromID(viewAID);
	var viewB = this.viewFromID(viewBID);
	console.log(viewA,viewB);
	var fxnA = function(){ // load features A
		viewA.loadFeatureData(function(){
			console.log("A");
			featureDataA = viewA.featureData();
			fxnReadyCheck();
		}, self);
	}
	var fxnB = function(v){ // load features B
		viewB.loadFeatureData(function(){
			console.log("B");
			featureDataB = viewB.featureData();
			fxnReadyCheck();
		}, self);
	}
	var fxnC = function(){ // load matching Image A
		// viewA.loadMatchingImage(function(){
		viewA.loadDenseLoImage(function(){
		// viewA.loadDenseHiImage(function(){
			// imageA = viewA.matchingImage();
			imageA = viewA.anyLoadedImage();
			fxnReadyCheck();
		}, self);
	}
	var fxnD = function(){// load matching Image B
		// viewB.loadMatchingImage(function(){
		viewB.loadDenseLoImage(function(){
		// viewB.loadDenseHiImage(function(){
			// imageB = viewB.matchingImage();
			imageB = viewB.anyLoadedImage();
			fxnReadyCheck();
		}, self);
	}

	var sortFeaturesCornerness = function(a,b){
		return a<b ? -1 : 1;
	};
	
	var pairData = App3DR.ProjectManager.defaultPairFile(viewAID,viewBID);

	var fxnReadyCheck = function(){
		if(!(featureDataA && featureDataB && imageA && imageB)){
			return;
		}
// throw "READY CHECK";
GLOBALDISPLAY = GLOBALSTAGE;
// var DEBUG_SHOW = false;
var DEBUG_SHOW = true;
		var pairDoneSaveFxn = function(){
			// SAVE DATA & SAVE SUMMARY & SAVE PROJECT ?
			console.log(pairData);
			console.log("pairDoneSaveFxn");
			completeFxn.call(completeCxt, pairData);
		}
		var maxFeatures = settings["maximumMatchFeatures"];
		var minimumMatchPoints = settings["minimumMatchPoints"];
		var maximumRErrorTracks = settings["maximumErrorTracksR"];
		var maximumFErrorTracks = settings["maximumErrorTracksF"];
		var maxErrorFInitialPercent = settings["maximumErrorFInit"];
		var maxErrorFDensePercent = settings["maximumErrorFDense"];
		var maxErrorRDensePercent = settings["maximumErrorRDense"];
		var minimumCountFInit = settings["minimumCountFInit"];
		var minimumCountTrackFinal = settings["minimumCountTrackFinal"];

		var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
		var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
		var imageAWidth = imageMatrixA.width();
		var imageAHeight = imageMatrixA.height();
		var imageBWidth = imageMatrixB.width();
		var imageBHeight = imageMatrixB.height();
		var featuresA = featureDataA["features"];
		var featuresB = featureDataB["features"];
		var hypA = Math.sqrt(imageAWidth*imageAWidth + imageAHeight*imageAHeight);
		var hypB = Math.sqrt(imageBWidth*imageBWidth + imageBHeight*imageBHeight);
		var hyp = Math.max(hypA,hypB);
		// relative to absolute measurements
		var maxErrorFInitPixels = hyp*maxErrorFInitialPercent;
		var maxErrorFDensePixels = hyp*maxErrorFDensePercent;
		var maxErrorRDensePixels = hyp*maxErrorRDensePercent;
		var maxErrorFTrackPixels = hyp*maximumFErrorTracks;
		var maxErrorRTrackPixels = hyp*maximumRErrorTracks;
		console.log(" maxErrorFInitPixels: "+maxErrorFInitPixels);
		console.log(" maxErrorFDensePixels: "+maxErrorFDensePixels);
		console.log(" maxErrorRDensePixels: "+maxErrorRDensePixels);
		console.log(" maxErrorFTrackPixels: "+maxErrorFTrackPixels);
		console.log(" maxErrorRTrackPixels: "+maxErrorRTrackPixels);
		console.log(" minimumCountFInit: "+minimumCountFInit);
		console.log(" minimumCountTrackFinal: "+minimumCountTrackFinal);
		


// SHOULD THESE BE PER-POINT ?
// throw "HERE ^ LIMITS"
		
		/*
		// drop features prioritized on cornerness score
		Code.truncateArray(featuresA, maxFeatures);
		Code.truncateArray(featuresB, maxFeatures);
		console.log("A: "+featuresA.length+" | "+featuresB.length);
		featuresA = R3D.denormalizeSIFTObjects(featuresA, imageAWidth, imageAHeight);
		featuresB = R3D.denormalizeSIFTObjects(featuresB, imageBWidth, imageBHeight);
// featuresA = R3D.differentialCornersForImage(imageMatrixA);
// featuresB = R3D.differentialCornersForImage(imageMatrixB);
console.log(featuresA);
console.log(featuresB);
		// TO SIFT OBJECTS
		var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);
		var objectsB = R3D.generateProgressiveSIFTObjects(featuresB, imageMatrixB);
		console.log(objectsA);
		console.log(objectsB);
		*/

		var goodEnoughMatches = true;
		var F;
		var Finv;
		var Ferror;
		var pointsA;
		var pointsB;
		var matchesAB;
		var initialMatchesAB = [];


		featuresA = R3D.denormalizeSIFTObjects(featuresA, imageAWidth, imageAHeight);
		featuresB = R3D.denormalizeSIFTObjects(featuresB, imageBWidth, imageBHeight);

		console.log(featuresA);
		console.log(featuresB);
// throw "???"

		var imageScalesA = new ImageMatScaled(imageMatrixA);
		var imageScalesB = new ImageMatScaled(imageMatrixB);
		var features = [featuresA,featuresB];
		var imageScales = [imageScalesA,imageScalesB];
		var objectList = [];

		console.log("STARTING FEATURES: "+featuresA.length+" & "+featuresB.length);

/*
for(var i=0; i<features.length; ++i){
	var sizes = [];
	var featureList = features[i];
	for(var j=0; j<featureList.length; ++j){
		var feature = featureList[j];
		var size = feature["size"];
		size = size/imageScalesA.size().length();
		sizes.push(size);
	}
	Code.printMatlabArray(sizes);
}
*/


		for(var i=0; i<features.length; ++i){
			var objects = R3D.generateProgressiveRIFTObjects(features[i], imageScales[i]);
			objectList.push(objects);
		}

		var objectsA = objectList[0];
		var objectsB = objectList[1];
		console.log(objectsA);
		console.log(objectsB);

		console.log("STARTING RIFT OBJECTS: "+objectsA.length+" & "+objectsB.length);
// throw "????????????????????"
		// console.log(imageScales);

		// get initial matches
		var result = R3D.compareProgressiveRIFTObjectsFull(objectsA, objectsB);
		console.log(result);
		matchesAB = result["matches"];
		console.log("after full RIFT match: "+matchesAB.length);
		
		// generate affine matrixes for each match based on neighborhood
		matchesAB = R3D.relativeRIFTFromFeatureMatches(matchesAB);
		console.log("after relative RIFT match: "+matchesAB.length);

		var info = R3D.repeatFilterExtendMatches(matchesAB, imageScales[0],imageScales[1]);
		console.log(info);

		matchesAB = info["matches"];

// throw "HERE"
		



		// REPLACED
		// var info = R3D.dropOutliersSparseMatches(matchesAB, imageScales[0],imageScales[1]);
		// matchesAB = info["matches"];
		// console.log("after outlier sparse drop: "+matchesAB.length);
		// console.log(matchesAB);

// var originalMatchCount;
// originalMatchCount = matchesAB.length * 2;
// var maxIter = 10; // 5-10 @ 100-200 pts
// for(var iter=0; iter<maxIter; ++iter){
// 	var originalMatchCount = matchesAB.length;
// 	matchesAB = R3D.filterMatchesOnLocalAffineDifference(matchesAB);
// 		matchesAB = matchesAB["matches"];
// 	console.log("after affine difference drop: "+matchesAB.length+" / "+originalMatchCount);
// 	if(originalMatchCount==matchesAB.length){ // no change
// 		console.log("unchanged break");
// 		break;
// 	}
// }

		// matches = matchesAB;

		// throw "neighborhood";


		// throw "re score compare";


		// throw "expand neighborhood?";


		// throw "re filter: score, F-error";
		

	// 	// convert to A, B, affine
	// 	var matchesAB = [];
	// 	var v = new V2D();
	// 	for(var i=0; i<matches.length; ++i){
	// 		var match = matches[i];
	// 		var A = match["A"];
	// 		var B = match["B"];
	// 		var scale = B["size"]/A["size"];
	// 			v.set(1,0);
	// 			v.rotate(-A["angle"]);
	// 			v.rotate(B["angle"]);
	// 		var angle = V2D.angleDirection(V2D.DIRX,v);
	// 		var affine = new Matrix2D();
	// 			affine.scale(scale);
	// 			affine.rotate(angle);
	// 		var matchAB = {};
	// 			matchAB["A"] = A["point"];
	// 			matchAB["B"] = B["point"];
	// 			matchAB["affine"] = affine;
	// 		matchesAB.push(matchAB);
	// 	}
	// 	matches = matchesAB;
	// // console.log(matches);
		console.log("INITIAL F MATCHES: "+matchesAB.length+" / "+minimumCountFInit);

// GLOBALSTAGE.root().matrix().scale(0.250);
// GLOBALSTAGE.root().matrix().scale(0.333);
GLOBALSTAGE.root().matrix().scale(0.50);

		var img = GLOBALSTAGE.getFloatRGBAsImage(imageMatrixA.red(),imageMatrixA.grn(),imageMatrixA.blu(), imageMatrixA.width(),imageMatrixA.height());
		var d = new DOImage(img);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);
		var img = GLOBALSTAGE.getFloatRGBAsImage(imageMatrixB.red(),imageMatrixB.grn(),imageMatrixB.blu(), imageMatrixB.width(),imageMatrixB.height());
		var d = new DOImage(img);
		d.matrix().translate(imageMatrixA.width(),0);
		GLOBALSTAGE.addChild(d);
		// DEBUG SHOW:
		var info = R3D.separateMatchesIntoPieces(matchesAB);
		pointsA = info["A"];
		pointsB = info["B"];
		affinesAB = info["affines"];
		var cellSizeShow = imageMatrixA.size().length()*0.01;
		var showAngles = true;
		// console.log(pointsA.length);
		console.log(matchesAB.length);
		R3D.showForwardBackwardPointsColor(pointsA, pointsB, affinesAB, imageMatrixA,imageMatrixB, GLOBALSTAGE, cellSizeShow);//, showAngles, matchesAB,"sigma");

// throw "HEREX";

		if(matchesAB.length<minimumCountFInit){
			goodEnoughMatches = false;
			console.log("not enough initial matches");
		}
// UPGRADE INITIAL MATCHES COUNT & ERROR
		if(goodEnoughMatches){
			console.log(matchesAB);
/*
			// keep best neighborhoods
			var result = R3D.keepExtendedMatchNeighborhoods(imageScalesA,imageScalesB, matches);
			// console.log(result);
			var matches = result["matches"];

			// change B locations to be optimally image-wize
			var result = R3D.optimizeMatchLocations(imageScalesA,imageScalesB, matches);
			// console.log(result);
			var matches = result["matches"];


console.log("DOES THIS WORK RIGHT?:")


			// get best maching points near initial points - 2-4 times point count
			var result = R3D.findLocalSupportingCornerMatchNeighborhoods(imageScalesA,imageScalesB, matches);
			// console.log(result);
			var matches = result["matches"];
			initialMatchesAB = matches;
*/

			// var objects = R3D.generateProgressiveRIFTObjects(features, imageScales);
			// var result = R3D.compareProgressiveRIFTObjectsFull(objectsA, objectsB);
			// console.log(result);

			// initialMatchesAB = matchesAB;


// console.log(matchesAB);


// throw "here ????????? - repackage as A/B/C"

GLOBALSTAGE.root().matrix().scale(1.0);
// GLOBALSTAGE.root().matrix().scale(0.50);
// GLOBALSTAGE.root().matrix().scale(0.250);


	var cellSizePercent = 0.04;
	var imgA = imageScalesA.images()[0];
	var imgB = imageScalesB.images()[0];
	var cellSize = imgA.size().length()*cellSizePercent;
	console.log("cellSize: "+cellSize);

	var info = R3D.separateMatchesIntoPieces(matchesAB);
		pointsA = info["A"];
		pointsB = info["B"];
		affinesAB = info["affines"];


		// if(DEBUG_SHOW){
		// 	var cellSizeShow = imageMatrixA.size().length()*0.01;
		// 	// R3D.showForwardBackwardCells(pointsA, pointsB, affinesAB, imageMatrixA,imageMatrixB, GLOBALSTAGE, cellSize);
		// 	R3D.showForwardBackwardPointsColor(pointsA, pointsB, affinesAB, imageMatrixA,imageMatrixB, GLOBALSTAGE, cellSizeShow);
		// }


console.log("GET INITIAL F: "+matchesAB.length);


			// console.log(pointsA);
			// console.log(pointsB);
			// console.log("SIZE: "+imageMatrixA.size()); // 504x378
			var errorPixels = imageScalesA.size().length() * 0.01; // 5%=31.5px | 1%=6px  0.005=3px  TODO: GET THIS VALUE FROM ELSEWHERE
			// console.log("errorPixels: "+errorPixels);
			var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, errorPixels, null, 0.50, 0.99);
			// console.log(result);
			var F = result["F"];
			var best = result["matches"];
			var bestA = best[0];
			var bestB = best[1];
			// console.log(bestA,bestB);
			console.log("BEST F POINTS: "+bestA.length);
			var maxPointsNonlinear = 200;
			var info = R3D.fundamentalFromUnnormalizedMaxCheck(bestA,bestB, maxPointsNonlinear);
			var F = info["F"];
			// console.log(F);
			if(F){
				Finv = R3D.fundamentalInverse(F);
				var info = R3D.fundamentalError(F,Finv,bestA,bestB);
					var fMean = info["mean"];
					var fSigma = info["sigma"];
					var fError = fMean + fSigma;
				console.log("F ERROR: "+fMean+" +/- "+fSigma);
				Ferror = fSigma;
			}


// throw "HERE"

			//R3D.showRansac(pointsA,pointsB, F,Finv, null, imageMatrixA,imageMatrixB);
			// R3D.showRansac(bestA,bestB, F,Finv, null, imageScalesA,imageScalesB);

	console.log("maxErrorFInitPixels: "+maxErrorFInitPixels+" vs "+Ferror);
	console.log("minimumCountFInit: "+minimumCountFInit+" vs "+pointsA.length);

			if(!F || Ferror>maxErrorFInitPixels || pointsA.length<minimumCountFInit){
				goodEnoughMatches = false;
			}
		}

		
		//
		initialMatchesAB = [];
		for(var i=0; i<matchesAB.length; ++i){
			var m = matchesAB[i];
			var match = {};
				match["A"] = m["A"];
				match["B"] = m["B"];
				match["affine"] = m["affine"];
			initialMatchesAB.push(match);
		}

		var world = null;
		var view0 = null;
		var view1 = null;
		// F - DENSE - WORLD
		if(goodEnoughMatches){
			console.log("START WORLD TO FIND DENSE F");
			// var info = R3D.average2DTranformForIndividualPoints(pointsA,pointsB, imageMatrixA,imageMatrixB, true);
			// console.log(info);
			// var transforms = info["transforms"];

			// keep original
			

			// throw "WORLD";
			var cellCount = 40; // 40-80
			world = new Stereopsis.World();
			// views
			var projectViews = [viewA,viewB];
			var images = [imageMatrixA,imageMatrixB];
			var views = [];
			for(var i=0; i<images.length; ++i){
				var image = images[i];
				var projectView = projectViews[i];
				console.log();
				var view = world.addView(image,null,projectView.id());
				views.push(view);
			}
			world.setViewCellCounts(cellCount);
			console.log(views);
			view0 = views[0];
			view1 = views[1];
			// points
			console.log(pointsA,pointsB);
			

			// world.resolveIntersectionByDefault();



world.debugCheckPairPointMatchCounts();
			for(var i=0; i<pointsA.length; ++i){
				var pointA = pointsA[i];
				var pointB = pointsB[i];
				var affine = affinesAB[i];
				var vs = [view0,view1];
				var ps = [pointA,pointB];
				var as = [affine];
				var point3D = world.newPoint3DFromPieces(vs,ps,as, false);
				// var matches = point3D.toMatchArray();
				// for(var m=0; m<matches.length; ++m){
				// 	var match = matches[m];
				// }
				// console.log("insert: "+i);
				world.recursiveEmbedPoint3D(point3D);
world.debugCheckPairPointMatchCounts();
			}
world.debugCheckPairPointMatchCounts();

			console.log("SOLVE PAIR F");
// throw "before pair solve world"
			var result = world.solvePairF();
			console.log(result);

// world.showForwardBackwardPair();
// throw "BEFORE NEXT F -> R"

			var transform0 = world.transformFromViews(view0,view1);
			var fErrorSigma = transform0.fSigma();
			var fErrorMean = transform0.fMean();
			var fErrorLimit = fErrorMean + fErrorSigma;
			console.log("F PAIR RESULT ERROR MEAN: "+fErrorMean+" & SIGMA: "+fErrorSigma+" / "+maxErrorFDensePixels);

			if(fErrorLimit>maxErrorFDensePixels){
				console.log("F ERROR TOO HIGH1 : "+fErrorLimit+" - "+" > "+maxErrorFDensePixels);
				goodEnoughMatches = false;
			}
		}

		// throw "next: solve R"

// R - DENSE - WORLD
		if(goodEnoughMatches){
			console.log("START WORLD TO FIND DENSE R");
			// add K for finding R
			var worldCams = [];
			for(var i=0; i<cameras.length; ++i){
				var camera = cameras[i];
				var camID = camera["id"];
				var K = camera["K"];
					K = Matrix.fromObject(K);
				// var cam = world.addCamera(K, null, projectCamera.id());
				var cam = world.addCamera(K, null, camID);
				worldCams.push(cam);
			}
			for(var i=0; i<projectViews.length; ++i){
				var projectView = projectViews[i];
				var projectCamera = project.cameraFromID(projectView.cameraID());
				var view = world.viewFromData(projectView.id());
				var cam = world.cameraFromData(projectCamera.id());
				view.camera(cam);
			}
			// 
			world.dropWorstParametersF();
			console.log("SOLVE INITIAL R");
			// RESET CELL SIZE:

			// var cellCount = 40;
			// world.setViewCellCounts(cellCount);
			// KEEP PREVIOUS CELL SIZING
// throw "before pair solve solvePair"
			var result = world.solvePairR(function(world){
				console.log("async");
			}, this);

			var str = world.toYAMLString();
			console.log(str);

// console.log(result);
world.showForwardBackwardPair();
// throw "BEFORE NEXT R -> T"


			var transform0 = world.transformFromViews(view0,view1);
			var fErrorSigma = transform0.fSigma();
			var fErrorMean = transform0.fMean();
			var fErrorLimit = fErrorMean + fErrorSigma;
			console.log("F PAIR RESULT ERROR MEAN: "+fErrorMean+" & SIGMA: "+fErrorSigma+" / "+maxErrorFDensePixels);
			var rErrorSigma = transform0.rSigma();
			var rErrorMean = transform0.rMean();
			var rErrorLimit = rErrorMean + rErrorSigma;
			if(Code.isNaN(rErrorSigma)){
				rErrorSigma = 0;
				rErrorMean = 0;
				rErrorLimit = maxErrorRDensePixels+1;
			}
			console.log("R PAIR RESULT ERROR MEAN: "+rErrorMean+" & SIGMA: "+rErrorSigma+" / "+maxErrorRDensePixels);

			// goodEnoughMatches = true; // already the case
			if(fErrorSigma>maxErrorFDensePixels || rErrorSigma>maxErrorRDensePixels){
				console.log("F ERROR TOO HIGH 2: "+fErrorLimit+" > "+maxErrorFDensePixels);
				console.log("R ERROR TOO HIGH 2: "+rErrorLimit+" > "+maxErrorRDensePixels);
				goodEnoughMatches = false;
			}
		}

		// R - TRACKS - WORLD
		if(goodEnoughMatches){
			console.log("START WORLD TO FIND TRACKS R");
			var transform = world.transformFromViews(view0,view1);
				var count = transform.matches().length; // doesn't count if P has 0 matches
				var matches = transform.matches();
				var errorRMean = transform.rMean();
				var errorRSigma = transform.rSigma();
			var fNorm = R3D.fundamentalNormalizeImageSizes(F, imageAWidth,imageAHeight, imageBWidth,imageBHeight);
			var viewAverageWidth = (imageAWidth+imageBWidth)*0.5;

			var info = R3D.fundamentalError(F,Finv,pointsA,pointsB);
				var fMean = info["mean"];
				var fSigma = info["sigma"];
			
			// original match data
			var matchData = {};
				matchData["F"] = fNorm;
				matchData["errorFMean"] = fMean/viewAverageWidth;
				matchData["errorFSigma"] = fSigma/viewAverageWidth;
				matchData["points"] = initialMatchesAB;
				matchData["count"] = initialMatchesAB.length;
			pairData["matches"] = matchData;

			var relative = world.toObject();
			pairData["relative"] = relative;

			var reconstructionMetric = world.reconstructionRelativeMetrics();
			console.log(reconstructionMetric);

			if(errorRMean>1.0){
				console.log("errorRMean way too big, at most 1.0 px => likely wrong ordering in Z-depth");
			}
			var errorR = (transform.rSigma() + transform.rMean());
			var errorF = (transform.fSigma() + transform.fMean());
			console.log("REGULAR transform error R: "+errorR+" of "+maxErrorRTrackPixels);
			console.log("REGULAR transform error F: "+errorF+" of "+maxErrorFTrackPixels);

			// get only best track points ~ 25% of original points
			// if(goodEnoughMatches){
			console.log("do tracks");
			world.solveForTracks();


			var errorR = (transform.rSigma() + transform.rMean());
			var errorF = (transform.fSigma() + transform.fMean());
			console.log("TRACK transform error R: "+errorR+" of "+maxErrorRTrackPixels);
			console.log("TRACK transform error F: "+errorF+" of "+maxErrorFTrackPixels);

			var trackMatchCount = transform.matches().length;
			console.log("SAME?:");
			console.log(transform.matchCount());
			console.log(world.toPointArray());
			console.log("R: "+world.globalErrorRMean()+" +/- "+world.globalErrorRSigma());
			console.log("F: "+world.globalErrorFMean()+" +/- "+world.globalErrorFSigma());
			console.log("N: "+world.globalErrorNMean()+" +/- "+world.globalErrorNSigma());
			console.log("S: "+world.globalErrorSMean()+" +/- "+world.globalErrorSSigma());
			console.log(" MIN TRACK COUNT: "+trackMatchCount+" / "+minimumCountTrackFinal);

			if(errorR>maxErrorRTrackPixels || errorF>maxErrorFTrackPixels || trackMatchCount<minimumCountTrackFinal){
				goodEnoughMatches = false;
			}

			if(goodEnoughMatches){
				pairData["tracks"] = world.toObject();
				pairData["metricNeighborsToWorld"] = reconstructionMetric;
			}
			
			// pairDoneSaveFxn();
		}else{
			console.log("no track finding");
		}

		// var worldCams = world.toCameraArray();
		// console.log(worldCams);
		// var worldCamIDToWorldCam = {};
		// for(var c=0; c<worldCams.length; ++c){
		// 	var worldCam = worldCams[c];
		// 	console.log(worldCam);
		// 	worldCamIDToWorldCam[worldCam.id()] = worldCam;
		// }
		// console.log(worldCamIDToWorldCam);

		// console.log(pairData);
		// var pairCams = pairData["cameras"];
		// for(var c=0; c<pairCams.length; ++c){
		// 	var pairCam = pairCams[c];
		// 	console.log(pairCam);
		// }
// throw "get cameras from world (may have been updated in process)"
		// throw "before save pair - world iterate - sparse";

		console.log(pairData);
		console.log("goodEnoughMatches?: "+goodEnoughMatches);

// world.showForwardBackwardPair();
// throw "before find tracks OUT"
		if(!goodEnoughMatches){
			console.log("END PAIR SEQUENCE POINT SEARCHING");
			console.log("save not good enough matches");
			pairDoneSaveFxn();
		}else{
			console.log("good enough matches - save");
			pairDoneSaveFxn();
		}

		// throw "out bottom";
	}
	// load images & features
	fxnA();
	fxnB();
	fxnC();
	fxnD();
}


App3DR.ProjectManager.prototype.calculateTripleMatchFromViewIDs = function(inputData,inputFilename, viewAID, viewBID, viewCID, pairsIDsToLoad, completeFxn, completeCxt, settings){
	console.log("calculateTripleMatchFromViewIDs: "+viewAID+"+"+viewBID+"+"+viewCID);

	console.log(inputData,inputFilename);
	console.log("pairsIDsToLoad: "+pairsIDsToLoad.length);
	// throw "?"
	// throw "this references sparse data ?"
	var project = this;
	if(!settings){
		settings = {};
		settings["cellCount"] = 40;
		// settings["maximumMatchFeatures"] = 1100;
		// settings["minimumMatchPoints"] = 16;
		// settings["incrementResolution"] = 0;
		// settings["maximumErrorTracksF"] = 0.02; // 0.02 @ 500 = 10
		// settings["maximumErrorTracksR"] = 0.01; // 0.01 @ 500 = 5
	}
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var viewIDsToPairID = function(iA,iB){
		return minimumStringFirst(iA,iB);
	}
	// get internals
	// var sparseData = this.sparseData();
	// console.log(sparseData);
	// var sparseFilename = project.sparseFilename();
		var basePath = Code.pathRemoveLastComponent(inputFilename);
	var viewA = project.viewFromID(viewAID);
	var viewB = project.viewFromID(viewBID);
	var viewC = project.viewFromID(viewCID);
	var mapping = {};
		mapping[viewAID] = 1;
		mapping[viewBID] = 1;
		mapping[viewCID] = 1;
	var includedViews = [viewA,viewB,viewC];
	
	// find expected pairs
	var allPairs = inputData["pairs"];
	var pairLookup = {};
	for(var i=0; i<allPairs.length; ++i){
		var pair = allPairs[i];
		var pairID = pair["id"];
		pairLookup[pairID] = pair;
	}
	var includedPairs = [];
	for(var i=0; i<pairsIDsToLoad.length; ++i){
		var pairID = pairsIDsToLoad[i];
		var pair = pairLookup[pairID];
		// var ids = pairID.split("-");
		var idA = pair["A"];
		var idB = pair["B"];
		if(mapping[idA] && mapping[idB]){ // triple contains this pair
			var trackCount = pair["tracks"];
			if(trackCount>0){// has to have some tracks to be work considering
				includedPairs.push(pair);
			}
		}
	}
	console.log("includedPairs: "+viewAID+" | "+viewBID+" | "+viewCID);
	console.log(includedPairs);

	if(includedPairs.length<2){
		throw "need at least 2 pairs: "+includedPairs.length;
	}
	var expectedPairs = includedPairs.length;
	var expectedImages = 3;
	var loadedPairs = 0;
	var loadedImages = 0;
	var pairData = {};
		// load images for each view
	var fxnRelativeDataComplete = function(data,obj){
		console.log("fxnRelativeDataComplete ... ")
		console.log(data);
		// pairData.push(data);
		var idA = data["A"];
		var idB = data["B"];
if(idA===undefined || idB===undefined){
	console.log(idA);
	console.log(idB);
	console.log(data);
	throw "bad data for triples";
}
		pairData[viewIDsToPairID(idA,idB)] = data;
		++loadedPairs;
		fxnReadyCheck();
	}
	var fxnImageLoadedComplete = function(what){
		console.log("fxnImageLoadedComplete ... ")
		console.log(what);
		++loadedImages;
		fxnReadyCheck();
	}
	var fxnReadyCheck = function(){
		if(loadedImages!=expectedImages || loadedPairs!=expectedPairs){
			return;
		}
		console.log("SOLVE TRIPLE");
// throw "before solve triple"

		// get all of camera's values & average:
		var foundCameras = {};
		var pairDataKeys = Code.keys(pairData);
		var summarPairData = inputData["pairs"];
		for(var i=0; i<pairDataKeys.length; ++i){
			var pairID = pairDataKeys[i];
			var info = pairData[pairID];
			var cams = info["cameras"];
			var errorI = null;
			for(var j=0; j<summarPairData.length; ++j){
				if(summarPairData[j]["id"]==pairID){
					errorI = summarPairData[i]["relativeError"];
					break;
				}
			}
			for(var j=0; j<cams.length; ++j){
				var cam = cams[j];
				var camID = cam["id"];
				var camK = cam["K"];
				var list = foundCameras[camID];
					camK = Matrix.fromObject(camK);
				if(!list){
					list = {"K":[],"error":[]};
					foundCameras[camID] = list;
				}
				list["K"].push(camK);
				list["error"].push(errorI);
			}
		}

// console.log(pairData);
// console.log(foundCameras);

		var cameraKeys = Code.keys(foundCameras);
		var camerasAveraged = {};
		for(var i=0; i<cameraKeys.length; ++i){
			var key = cameraKeys[i];
			var entry = foundCameras[key];
			var Ks = entry["K"];
			var errors = entry["error"];
			for(var j=0; j<Ks.length; ++j){
				console.log(Ks[j].toArray());
			}
			// console.log(errors);
			var percents = Code.errorsToPercents(errors);
				percents = percents["percents"];
			console.log(percents);
			var K = Code.averageCameraKMatrixes(Ks,percents);
			console.log("++++++++++++++++++++++++++++");
			console.log(K.toArray());
			camerasAveraged[key] = K;
		}
	
		// var camerasAveraged = ;

	// calculateTripleInfo
	// var percents = Code.errorsToPercents(errors);
	// Code.averageNumbers = function(values, percents){
	// Code.averageNumbers();
// console.log(inputData);

// throw "..."
		var matchAB = pairData[viewIDsToPairID(viewAID,viewBID)];
		var matchAC = pairData[viewIDsToPairID(viewAID,viewCID)];
		var matchBC = pairData[viewIDsToPairID(viewBID,viewCID)];
		console.log(matchAB,matchAC,matchBC);
		var imageA = R3D.imageMatrixFromImage(viewA.featuresImage(), project._stage);
		var imageB = R3D.imageMatrixFromImage(viewB.featuresImage(), project._stage);
		var imageC = R3D.imageMatrixFromImage(viewC.featuresImage(), project._stage);
		var result = project.calculateTripleInfo(
			imageA, imageB, imageC,
			viewA, viewB, viewC,
			matchAB, matchAC, matchBC,
			camerasAveraged,
			settings["cellCount"],
			fxnTripleComplete
			);
	}
	var fxnTripleComplete = function(scales){
		// throw "now ... fxnTripleComplete"
		completeFxn.call(completeCxt,scales);
	}
	// load each view's image
	for(var i=0; i<includedViews.length; ++i){
		var view = includedViews[i];
		console.log(view);
		view.loadFeaturesImage(fxnImageLoadedComplete, project);
	}
	// load each pair's relative data
	for(var i=0; i<includedPairs.length; ++i){
		var pair = includedPairs[i];
		var pairID = pair["id"];
		var pairBase = Code.appendToPath(basePath, App3DR.ProjectManager.PAIRS_DIRECTORY, pairID);
		var relativeFilename = Code.appendToPath(pairBase, App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME);
		console.log("PAIR FILE "+i+" : "+relativeFilename);
		project.loadDataFromFile(relativeFilename, fxnRelativeDataComplete, project);
	}

}

App3DR.ProjectManager.prototype.calculateTripleInfo = function(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC, camerasLookup, cellCount, inputCompleteFxn){
	console.log(matchAB,matchAC,matchBC);
	

	// console.log(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC);
	var project = this;
	var world = new Stereopsis.World();
	var imageSizeA = imageMatrixA.size();

	var views = [viewA,viewB,viewC];
	var images = [imageMatrixA,imageMatrixB,imageMatrixC];
	var cellSizes = [];
	var cellSizes = [	R3D.cellSizingRoundWithDimensions(imageMatrixA.width(),imageMatrixA.height(),cellCount),
						R3D.cellSizingRoundWithDimensions(imageMatrixB.width(),imageMatrixB.height(),cellCount),
						R3D.cellSizingRoundWithDimensions(imageMatrixC.width(),imageMatrixC.height(),cellCount) ];
	var WORLDCAMS = project.createWorldCamerasForViews(world, views, camerasLookup);
	var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes);


	// throw "calculateTripleInfo";

console.log(camerasLookup);

	console.log(WORLDCAMS);
	console.log(WORLDVIEWS);

// throw "..."
	// quick world-view lookup
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
	    var v = WORLDVIEWS[i];
	    WORLDVIEWSLOOKUP[v.data()] = v;
	}
	// points for match AB
	var matches = [];
	if(matchAB){
		matches.push(matchAB["points"]);
	}
	if(matchAC){
		matches.push(matchAC["points"]);
	}
	if(matchBC){
		matches.push(matchBC["points"]);
	}

	world.checkForIntersections(false);
	var pairs = [matchAB,matchAC,matchBC];
	console.log(pairs);
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		if(!pair){
			continue;
		}
		var idA = pair["A"];
		var idB = pair["B"];
		var points = pair["points"];


		// console.log("POINTS: "+points.length);
		// console.log(points);


		var worldViewLookupPair = {};
		var viewA = WORLDVIEWSLOOKUP[idA];
		var viewB = WORLDVIEWSLOOKUP[idB];
		worldViewLookupPair[0] = viewA;
		worldViewLookupPair[1] = viewB;
// console.log(points);
		var points3D = App3DR.ProjectManager._worldPointFromSaves(world, points, WORLDVIEWSLOOKUP, true);


		var pairViews = pair["views"];
		var transformA = null;
		var transformB = null;
		for(var v=0; v<pairViews.length; ++v){
			var pairView = pairViews[v];
			var pID = pairView["id"];
			var t = pairView["transform"];
			var m = new Matrix().fromObject(t);
			if(pID==idA){
				transformA = m;
			}else{
				transformB = m;
			}
		}
		// console.log(transformA);
		// console.log(transformB);

		


		

		// throw "recalculate points location using new averaged camera data"
		world.embedPoints3DNoValidation(points3D);


// embedPoints3DNoValidation
console.log("ADDED ....")


		console.log(" "+i+" = "+points3D.length);
// console.log(points3D);
// throw ".???"
		var R = pair["R"];
		if(!R){
			var t = pair["transforms"];
			t = t[0];
			var tA = t["A"];
			var tB = t["B"];
			R = new Matrix().fromObject(t["transform"]);
			if(idA!=tA){ // opposite
				R = R3D.inverseCameraMatrix(R);
			}
		}
		console.log(R);
		App3DR.ProjectManager.addTransformToWorld(world, R, idA, idB);

		viewA.absoluteTransform(transformA);
		viewB.absoluteTransform(transformB);

		console.log("NOW UPDATE / SET PATCHES ????");
		// world.createAllPoints3DPatches();



		// throw "recalculated"
		viewA.absoluteTransform(null);
		viewB.absoluteTransform(null);
	}

	world.printPoint3DTrackCount();

// throw "triple include relative scaling error"

console.log("before ?");
	var worldTripleCompleted = function(payload){
		console.log("worldTripleCompleted");
		console.log(payload);
		var metrics = payload["metrics"]
		console.log(metrics);
		// var errors = payload["errors"]
		// console.log(errors);
		// var sAB = scales["AB"];
		// var sAC = scales["AC"];
		// var sBC = scales["BC"];
		// var eAB = errors["AB"];
		// var eAC = errors["AC"];
		// var eBC = errors["BC"];
// throw "HEREEEEEE SCALES SCALE";
		inputCompleteFxn(metrics);
	}
// throw "before saveE";
	world.solveTriple(worldTripleCompleted, project, null);
}

App3DR.ProjectManager.prototype.createWorldCamerasForViews = function(world, views, cameraLookup){

	if(!cameraLookup){
		throw "need cameras cameraLookup ... createWorldCamerasForViews"
	}
	var project = this;
	// var cameraList = {};
	// for(var i=0; i<views.length; ++i){
	// 	cameraList[views[i].cameraID()] = 1;
	// }
	// var cameraIDs = Code.keys(cameraList);
	var cameraIDs = Code.keys(cameraLookup);
	// console.log(cameraIDs);
	var BACAMS = [];
	for(var i=0; i<cameraIDs.length; ++i){
		var cameraID = cameraIDs[i];
		// var camera = project.cameraFromID(cameraID);
		var camera = cameraLookup[cameraID];
		console.log(camera);
		// console.log(cameraID);
		// console.log(camera);
		// throw "got camera";
		// var K = camera.K();
		// var distortion = camera.distortion();
		var K = camera;
		var distortion = {"k0":0,"k1":0,"k2":0,"p0":0,"p1":0};

		// console.log(K);

		// throw "..."
		if(K && distortion){
			var k0 = distortion["k0"];
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var p0 = distortion["p0"];
			var p1 = distortion["p1"];
			if(!Code.isa(K,Matrix)){
				var fx = K["fx"];
				var fy = K["fy"];
				var s = K["s"];
				var cx = K["cx"];
				var cy = K["cy"];
				K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			}
			var c = world.addCamera(K, distortion);
			c.data(cameraID);
			BACAMS.push(c);
		}
	}
	return BACAMS;
}


App3DR.ProjectManager.prototype.fillInWorldViews = function(cameras, graphGroupViews, graphDataViews, cellCount){
	var project = this;
	cellCount = cellCount!==null && cellCount!==undefined ? cellCount : 40;

	var graphViewIDToTransform = {};
	if(graphDataViews){
		for(var i=0; i<graphDataViews.length; ++i){
			var view = graphDataViews[i];
			var viewID = view["id"];
			var transform = view["transform"];
			graphViewIDToTransform[viewID] = Matrix.fromObject(transform);
		}
	}else{
		for(var i=0; i<graphGroupViews.length; ++i){
			var view = graphGroupViews[i];
			var viewID = view["id"];
			var transform = view["transform"];
			graphViewIDToTransform[viewID] = Matrix.fromObject(transform);
		}
	}

	var views = [];
	var images = [];
	var cellSizes = [];
	var transforms = [];
	for(var i=0; i<graphGroupViews.length; ++i){
		var viewID = graphGroupViews[i];
// console.log(viewID);
		if(Code.isObject(viewID)){
			viewID = viewID["id"];
		}

		var transform = graphViewIDToTransform[viewID];
		transforms.push(transform);
		view = project.viewFromID(viewID);
// console.log(view);
		views[i] = view;
		var image = view.anyLoadedImage();
		// console.log("anyLoadedImage")
		// console.log(image)
		var wid, hei;
		if(image){
			var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			images[i] = matrix;
			wid = matrix.width();
			hei = matrix.height()
		}else{
			var imageSize = graphGroupViews[i]["imageSize"];
			if(imageSize){
				console.log(imageSize);
				var size = new V2D(imageSize["x"],imageSize["y"]);
				images[i] = size;
				wid = size.x;
				hei = size.y;
			}else{
				// console.log(graphGroupViews);
				// console.log(graphDataViews);
				console.log(viewID+" - no size");
				// throw "no size";
				var ratio = view.aspectRatio(); // w to h
				var size = new V2D(ratio,1.0);
				images[i] = size; // is size ~ 1.0 ok?
				wid = size.x;
				hei = size.y;
			}
		}
		cellSizes.push(R3D.cellSizingRoundWithDimensions(wid,hei,cellCount, false));
	}

	return {"views":views, "transforms":transforms, "images":images, "cellSizes":cellSizes};
}

App3DR.ProjectManager.prototype.createWorldViewLookup = function(world, views, images, cells, transforms){
	var WORLDVIEWSLOOKUP = {};
	var worldViews = world.toViewArray();
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		WORLDVIEWSLOOKUP[worldViews[i].data()] = worldViews[i];
	}
	return WORLDVIEWSLOOKUP;
}

App3DR.ProjectManager.prototype.createWorldViewsForViews = function(world, views, images, cells, transforms){
	var BAVIEWS = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		console.log(view);
		var img = images[i];
		var cellSize = cells[i];
		var cam = world.cameraFromData(view.cameraID());
		var v = world.addView(img, cam);
		if(transforms){
			var transform = transforms[i];
			v.absoluteTransform(transform);
		}
		v.cellSize(cellSize);
		v.data(view.id());
		BAVIEWS.push(v);
	}
	console.log(BAVIEWS);
	return BAVIEWS;
}
App3DR.ProjectManager.prototype.loadDenseGroupsStereopsis = function(){
	console.log("loadDenseGroupsStereopsis");
	var project = this;
	var worldFilename = "dense/tracks/track_full.yaml";
	var dataLoadedFxn = function(data){
		console.log("track world loaded");
		project._doDenseGroupsStereopsis(data);
	}
	project.loadDataFromFile(worldFilename, dataLoadedFxn, project, {});
}
App3DR.ProjectManager.prototype._doDenseGroupsStereopsis = function(infoData, completeFxn, context){
	var project = this;

	var groupViews = infoData["views"];
	var groupCameras = infoData["cameras"];
	var groupPoints = infoData["points"];
	
	console.log(groupCameras);
	console.log(groupViews);
	console.log(groupPoints);

	var groupCameraFromID = {};
	for(var i=0; i<groupCameras.length; ++i){
		var groupCamera = groupCameras[i];
		var cameraID = groupCamera["id"];
			groupCamera["K"] = Matrix.fromObject(groupCamera["K"]);
		groupCameraFromID[cameraID] = groupCamera;
	}

	var groupViewFromID = {};
	for(var i=0; i<groupViews.length; ++i){
		var groupView = groupViews[i];
		var viewID = groupView["id"];
			// groupView["R"] = Matrix.fromObject(groupView["transform"]);
			groupView["R"] = Matrix.fromObject(groupView["R"]);
		groupViewFromID[viewID] = groupView;
	}

	var stage = GLOBALSTAGE;

	// on done
	var solveDenseGroupComplete = function(world){
		console.log("solveDenseGroupComplete");
		var str = world.toYAMLString();
		console.log(str);
		completeFxn(world.toObject());
	}


	throw "_doDenseGroupsStereopsis ???"


	console.log("create world");
	var cameras = groupCameras;
	var views = groupViews;
	// var images = groupImages;
	var world = new Stereopsis.World();
	var info = project._addGraphViews(world, groupViewFromID, stage, views);
	// console.log(info);
	var images = info["images"];
	var transforms = info["transforms"];
	// console.log("transforms");
	// console.log(transforms);
	var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	// console.log(worldCams);	
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
	// console.log(worldViews);

	// trigger world views creation of imagescales
	console.log("trigger image scales");
	for(var i=0; i<worldViews.length; ++i){
		var view = worldViews[i];
		view.imageScales();
	}

	console.log(world);

	var WORLDVIEWSLOOKUP = project.createWorldViewLookup(world);
	console.log("WORLDVIEWSLOOKUP");
	console.log(WORLDVIEWSLOOKUP);

		// // pairs to create 
		// var comparePairs = [];
		// for(var i=0; i<groupPairs.length; ++i){
		// 	var groupPair = groupPairs[i];
		// 	var viewAID = groupPair["A"];
		// 	var viewBID = groupPair["B"];
		// 	var viewA = world.viewFromData(viewAID);
		// 	var viewB = world.viewFromData(viewBID);
		// 	comparePairs.push([viewA,viewB]);
		// }

// throw "HERE START"

		// set view cell density
console.log("SET CELLS");
		// var cellCount = 40; // too sparse
		// var cellCount = 60;
		var cellCount = 80; // too dense ?
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var size = view.size();
			var wid = size.x;
			var hei = size.y;
			var size = R3D.cellSizingRoundWithDimensions(wid,hei,cellCount, false);
			view.cellSize(size);
		}
		// ADD POINTS
console.log("INIT POINTS ...");
		// world.setResolutionProcessingModeNonVisual();
// world.resolutionProcessingModeLow(); // does this have a visual component?

		world.copyRelativeTransformsFromAbsolute();

		var points3DNew = App3DR.ProjectManager._worldPointFromSaves(world, groupPoints, WORLDVIEWSLOOKUP, true);

console.log(points3DNew);
var timeA = Code.getTimeMilliseconds();


world.setResolutionProcessingModeFromOnly2D();
// world.initPoints3DLocation(points3DNew);
world.initAllP3DPatches(points3DNew);
world.initAffineFromP3DPatches(points3DNew);
// throw "WHAT - todo this point addition again"
// console.log("...");
// world.initAffineFromP3DPatches(points3DNew);
			// world.initAllP3DPatches(points3DNew);
// world.initAffineFromP3DPatches(points3DNew);
var timeB = Code.getTimeMilliseconds();
console.log("DELTA INIT: "+((timeB-timeA)/1000)); // 4-5 seconds

// TODO: THIS NEEDS TO BE ASYNC @ 1-10k iterations
		// console.log(points3DNew);
		// world.checkForIntersections(false);

		var timeA = null;
		var timeB = null;


		world.setResolutionProcessingModeBest(); // MERGING USING VISUAL
		
		var loadPoints = function(what){
			console.log(what);
			var counterPerIteration = 10E3; // 10k-50k
			console.log("LOAD POINTS: "+points3DNew.length+' - ');
			if(points3DNew.length>0){
				var nextSet = [];
				var maxCount = Math.min(points3DNew.length,counterPerIteration);
				for(var c=0; c<maxCount; ++c){
					var p = points3DNew.shift(); // drop 1
					nextSet.push(p);
				}

				

				//updatePoints3DNullLocations
				world.updatePoints3DErrors(nextSet);
				// updateErrorForMatch
				world.embedPoints3D(nextSet);

				Code.functionAfterDelay(loadPoints,project, 1);
			}else{
				loadPointsComplete();
			}
		}
		var loadPointsComplete = function(){
			console.log("loadPointsComplete")
			timeB = Code.getTimeMilliseconds();
			console.log("DELTA EMBED: "+((timeB-timeA)/1000)); // NO IMAGE LOOKUP: 2135.247 / 60 = 35 minutes?    vs:  WITH IMAGE LOOKUP: ? ---- try with async

			// 316.144 / 60 = 6 minutes


			//  [0, 0, 54388, 36003, 17729, 4251]

			world.relativeFFromSamples();
			world.estimate3DErrors(true);
			world.printPoint3DTrackCount();

					console.log(world);
					console.log("solve dense group world");



			// SHOW ERROR PER GROUP:
			
			// world.checkForIntersections(true);
			// world.resolveIntersectionByDefault();
			// world.resolveIntersectionByPatchVisuals();

// throw "_doDenseGroupsStereopsis -- before solveDenseGroup";
			world.solveDenseGroup(solveDenseGroupComplete);
			console.log("?????????????????????????????");



			// TESTING
			var str = world.toYAMLString();
			console.log(str);
			// throw "solveDenseGroup end"

			var errorCount = worldViews.length + 1;
			var errorCounts = Code.newArrayArrays(errorCount);
			var points3D = world.toPointArray();
			for(var i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var viewCount = point3D.viewCount();
			var reprojectionError = point3D.totalReprojectionError();
			errorCounts[viewCount].push(reprojectionError);
			}
			for(var i=0; i<errorCounts.length; ++i){
				var errors3D = errorCounts[i];
				errors3D.sort();
				Code.printMatlabArray(errors3D,"e_"+i);
			}

			completeFxn(world);
		}

		timeA = Code.getTimeMilliseconds();
		Code.functionAfterDelay(loadPoints,project, 1);
	
	/*

	


	var loadWorld = function() {
		// add track points to world
		var existingPoints = data["points"];
		// console.log(existingPoints);
		var worldViewLookup = {};
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var viewID = view.data();
			worldViewLookup[viewID] = view;
		}
		// console.log(worldViewLookup);
		console.log("embedding points");
		// init P3D 
		world.checkForIntersections(false);
		var points3D = App3DR.ProjectManager._worldPointFromSaves(world, existingPoints, worldViewLookup);
		console.log(points3D);
		console.log("add points with patches");
		world.embedPoints3DNoValidation(points3D);
		// world.embedPoints3D(points3D);


		// extract points & re-add



		world.checkForIntersections(true);
		// world.resolveIntersectionByGeometry();
		world.resolveIntersectionByDefault();
		// _resolveIntersectionPatch
		// world.resolveIntersectionByPatchVisuals();

		world.solveGroup();

		throw "done ?"
	}

	// load all images
	var loadedImages = 0;
	var expectedImages = groupViews.length;
	var checkAllViewImagesLoaded = function(){
		++loadedImages;
		console.log(" status: "+loadedImages+"/"+expectedImages);
		if(loadedImages==expectedImages){
			console.log("done");
			calculatePairSeedsFxn();
		}
	}

	// load all view images [at some point will be groups]
	for(var i=0; i<groupViews.length; ++i){
		var groupView = groupViews[i];
		var viewID = groupView["id"];
		console.log(viewID);
		var view = project.viewFromID(viewID);
		console.log(view);
		view.loadDenseHiImage(checkAllViewImagesLoaded, project); // 1008 x 768
		// view.loadBundleAdjustImage(checkAllViewImagesLoaded, project); // 2016 x 1512
	}
	*/
}

App3DR.ProjectManager.prototype._initializeAbsoluteViewsFromGroups = function(viewsInitial, groups){ // aggregate groups


	console.log(viewsInitial);

	console.log(groups);

	var pairIDFromViewIDs = App3DR.ProjectManager.pairIDFromViewIDs;

	// make lookup from view ID to indev
	var viewIDToViewIndex = {};
	var viewIndexToViewID = {};
	var initialP = [];
	for(var i=0; i<viewsInitial.length; ++i){
		var view = viewsInitial[i];
		var viewID = view["id"];
		viewIDToViewIndex[viewID] = i;
		viewIndexToViewID[i] = viewID;
		var extrinsicAB = Matrix.fromObject(view["transform"]);
		console.log(extrinsicAB);
		var absoluteAB = Matrix.inverse(extrinsicAB);
		// var absoluteAB = Matrix.relativeWorld(extrinsicAB);
		initialP[i] = absoluteAB;
	}

	var edgeList = []; // [viewA, viewB, transform, error]
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var transforms = group["transforms"];
		for(var j=0; j<transforms.length; ++j){
			var transform = transforms[j];
			var viewAID = transform["A"];
			var viewBID = transform["B"];
			var pairRMean = transform["errorRMean"];
			var pairRSigma = transform["errorRSigma"];
			var pairMatches = transform["matches"];
			var transformAB = transform["transform"];
				transformAB = Matrix.fromObject(transformAB);
				var absoluteAB = Matrix.inverse(transformAB);
			// var absoluteAB = Matrix.relativeReference(transformAB);
			var viewAIndex = viewIDToViewIndex[viewAID];
			var viewBIndex = viewIDToViewIndex[viewBID];
			var edgeError = (pairRMean+pairRSigma)/pairMatches;
			var edge = [viewAIndex,viewBIndex,absoluteAB,edgeError];
			edgeList.push(edge);
		}
	}
	console.log(edgeList);

	// only keep track of top pair edges from each group:
	/*
		A) each view marks 2-3 top pairs to keep
		B) globally mark views to keep:
			- get match counts (or error counts)
			- weight on match count size

				Code.stdDevWeights(locations,magnitudes,mean);

				sigma = Code.stdDevWeights(x,y,Code.max(x));

			threshold = max - sigma * 1

			if pair match count is above threshold:
				- mark to keep
		C) keep only pairs marked

		matches:
		x = [
		51,
		85,
		126,
		151,
		207,
		230,
		239,
		386,
		...  AVG = 436
		527,
		590,
		.... COM = 744
		789,
		1101,
		1187,
		];
		y = Code.countsToPercents(x);
		z = Code.arrayVectorMul(x,y);
		a = Code.sum(z);


		Code.stdDevWeights(x,y,a);
		Code.stdDevWeights(x,y,Code.max(x));

		pair error = errorRMean / matches

	*/



	/*
	var pairLookup = {};
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var transforms = group["transforms"];

		var pairToTransform = {};
		for(var j=0; j<transforms.length; ++j){
			var transform = transforms[j];
			var viewAID = transforms["A"];
			var viewBID = transforms["B"];
			var pairID = pairIDFromViewIDs(viewAID,viewBID);
			pairToTransform[pairID] = transform;
		}

		var views = group["views"];
		for(var j=0; j<views.length; ++j){
			var viewA = views[j];
			var viewAID = viewA["id"];
			for(var k=j+1; j<views.length; ++j){
				var viewB = views[j];
				var viewBID = viewB["id"];
				var pairID = pairIDFromViewIDs(viewAID,viewBID);
				var pair = pairLookup[pairID];
				if(!pair){
					pair = {"groups":[]};
					pairLookup[pairID] = pair;
				}
				var transform = pairToTransform[pairID];
				var baseline = transform["?"];

				var pairGroups = pair["groups"];
				pairGroups.push( [j, baseline] );
			}
		}
	}
	console.log(pairGroups);
	*/

	this.displayViewGraph(initialP,edgeList, 100);

	var result = Code.graphAbsoluteUpdateFromRelativeTransforms(initialP, edgeList, 1000); 
	console.log(result);
	var finalP = result["values"];

	this.displayViewGraph(finalP,edgeList, 600);

	// to extrinsic:
	for(var i=0; i<finalP.length; ++i){
		var final = finalP[i];
		finalP[i] = Matrix.inverse(final);
	}
/*
	// to output
	var viewsFinal = [];
	for(var i=0; i<viewsInitial.length; ++i){
		var view = viewsInitial[i];
		var viewFinal = {};
		var viewKeys = Code.keys(view);
		for(var j=0; j<viewKeys.length; ++j){
			var key = viewKeys[j];
			viewFinal[key] = view[key];
		}
		viewFinal["transform"] = finalP[i].toObject();
		viewsFinal.push(viewFinal);
	}
*/
	console.log("just keep initial views ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	viewsFinal = viewsInitial;
throw "? is this used ?"
	return {"views":viewsFinal};
}
/*
App3DR.ProjectManager.prototype._doDenseGroupsStereopsisOLD = function(data){
	console.log(data);
	var project = this;

	var allViews = data["views"];
	var allCameras = data["cameras"];
	var allPoints = data["points"];
	
	var loadedImages = 0;
	var expectedImages = allViews.length;
	var checkAllViewImagesLoaded = function(){
		++loadedImages;
		console.log(" status: "+loadedImages+"/"+expectedImages);
		if(loadedImages==expectedImages){
			console.log("done");
			loadWorld();
		}
	}

	var loadWorld = function() {
		var projectViews = project.views();
		var viewIDToView = {};
		for(var i=0; i<allViews.length; ++i){
			var view = allViews[i];
			var viewID = view["id"];
console.log(i+": "+viewID);
			var projectView = project.viewFromID(viewID);
			viewIDToView[viewID] = view;
		}
		// add views
		var cameras = allCameras;
		var views = allViews;
		var stage = GLOBALSTAGE;
		var world = new Stereopsis.World();
		var info = project._addGraphViews(world, viewIDToView, stage, views);
		var images = info["images"];
		var transforms = info["transforms"];
// console.log(transforms);
// for(var i=0; i<transforms.length; ++i){
// var transform = transforms[i];
// var view = allViews[i];
// var viewID = view["id"];
// console.log(i+" "+viewID+" \n "+transform+"\n...\n");
// }
// throw "?"
		var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);

		// set view cell density
		// var cellCount = 40; // too sparse
		var cellCount = 60;
		// var cellCount = 80; // too dense ?
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var size = view.size();
			var wid = size.x;
			var hei = size.y;
			var size = R3D.cellSizingRoundWithDimensions(wid,hei,cellCount, false);
			view.cellSize(size);
		}
		world.copyRelativeTransformsFromAbsolute();

		// add track points to world
		var existingPoints = data["points"];
		// console.log(existingPoints);
		var worldViewLookup = {};
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var viewID = view.data();
			worldViewLookup[viewID] = view;
		}
		// console.log(worldViewLookup);
		console.log("embedding points");
		// init P3D 
		world.checkForIntersections(false);
		var points3D = App3DR.ProjectManager._worldPointFromSaves(world, existingPoints, worldViewLookup);
		console.log(points3D);
		console.log("add points with patches");
		world.embedPoints3DNoValidation(points3D);
		// world.embedPoints3D(points3D);


		// extract points & re-add



		world.checkForIntersections(true);
		// world.resolveIntersectionByGeometry();
		world.resolveIntersectionByDefault();
		// _resolveIntersectionPatch
		// world.resolveIntersectionByPatchVisuals();

		world.solveGroup();



		//


		// save to a group file & iterate

		throw "done ?"
	}

	// load all view images [at some point will be groups]
	for(var i=0; i<allViews.length; ++i){
		var allView = allViews[i];
		var viewID = allView["id"];
		console.log(viewID);
		var view = project.viewFromID(viewID);
		console.log(view);
		// view.loadDenseHiImage(checkAllViewImagesLoaded, project); // 1008 x 768
		view.loadBundleAdjustImage(checkAllViewImagesLoaded, project); // 2016 x 1512
	}
}
*/

App3DR.ProjectManager.prototype.initializeBundleGroupsFromDense = function(){
	var project = this;
	var bundleBaseDirectory = "bundle";
	var bundleDataFilename = "bundle.yaml";
	var fullBundleDataPath = Code.appendToPath(bundleBaseDirectory,bundleDataFilename);
	// load dense data -> graph -> track full
	var denseFilename = project.denseFilename();
	var denseDirectory = Code.pathRemoveLastComponent(denseFilename);
	// console.log(denseFilename);
	var denseData = null;
	var graphData = null;
	// var trackData = null;

	var loadedDenseDataFxn = function(data){
		denseData = data;
		console.log(denseData);

// sourceData["putativePairs"] = putatives;
		var densePutative = denseData["putativePairs"];
		var denseCameras = denseData["cameras"];

// console.log(denseData);
// throw "bundle groups from dense?";

		// var denseViews = denseData["views"];
		var denseViews = densePutative["views"];
		var denseOriginalPairs = denseData["pairs"];
		var denseOriginalViews = denseData["views"];
		// TODO: pairs may possibly be bad - drop obviously bad pairs ?

		var viewOriginalIDToObject = {};
		for(var i=0; i<denseOriginalViews.length; ++i){
			var view = denseOriginalViews[i];
			var viewID = view["id"];
			// console.log(denseViews);
			viewOriginalIDToObject[viewID] = view;
		}
// throw "copy cameras"
		
		var viewIDToIndex = {};
		for(var i=0; i<denseViews.length; ++i){
			var view = denseViews[i];
			var viewID = view["id"];
			// console.log(denseViews);
			viewIDToIndex[viewID] = i;

			var original = viewOriginalIDToObject[viewID];
			view["camera"] = original["camera"];
		}

		var listPairs = [];
		for(var i=0; i<denseOriginalPairs.length; ++i){
			var pair = denseOriginalPairs[i];
			var viewIDA = pair["A"];
			var viewIDB = pair["B"];
			var indexA = viewIDToIndex[viewIDA];
			var indexB = viewIDToIndex[viewIDB];
			listPairs.push([indexA, indexB]);
		}

		var groupSize = 5; // 5
		var groupTolerance = 1; // 4-6
		var overlapDesired = 2; // up to 7

		console.log(listPairs);
		var result = Graph.groupsFromEdges(listPairs, groupSize, groupTolerance, overlapDesired)
		console.log(result);
		var groups = result["groups"];

		// display:
		var transforms = [];
		for(var i=0; i<denseViews.length; ++i){
			var view = denseViews[i];
			var R = view["R"];
				R = Matrix.fromObject(R);
				R = Matrix.inverse(R);
			transforms[i] = R;
		}

		var info = project.displayViewGraph(transforms,listPairs);
		var centers = info["points"];
		var displayOffset = info["offset"];
		var colors = [0xFFFF0000,0xFF009900,0xFF0000FF,0xFFCCCC00,0xFFCC00CC,0xFF00CCCC,0xFFCCCCCC];
		var sizes = [11,15,19,23,27];
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			for(var j=0; j<group.length; ++j){
				var vertexID = group[j];
				var p = centers[vertexID];
				var d = new DO();
				var color = colors[i%colors.length];
				var size = sizes[i%sizes.length]
				d.graphics().setLine(3.0,color);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, size);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(displayOffset.x, displayOffset.y);
				GLOBALSTAGE.addChild(d);
			}
		}
		groups.sort(function(a,b){
			return a.length < b.length ? -1 : 1;
		});
		console.log(groups);



		initBundleGroupsFxn(denseViews, groups, denseCameras, denseOriginalPairs);


		// OLD:


		// var graphFilename = denseData["graph"];
		// console.log(graphFilename+" ???");
		// project.loadDataFromFile(graphFilename, loadedGraphDataFxn);
	}

	// var loadedGraphDataFxn = function(data){
	// 	graphData = data;
	// 	var bundleFilename = graphData["bundleFullFile"];
	// 	bundleFilename = Code.appendToPath(denseDirectory, "tracks", bundleFilename);
	// 	// console.log(bundleFilename);
	// 	project.loadDataFromFile(bundleFilename, loadedTrackDataFxn);
	// }
	// var loadedTrackDataFxn = function(data){
	// 	trackData = data;
	// 	calculateGraphFxn();
	// }
	var calculateGraphFxn = function(){
		var denseViews = trackData["views"];
		var densePairs = trackData["transforms"];
		var densePoints = trackData["points"];
		var denseCameras = trackData["cameras"];
		console.log(denseViews);
		console.log(densePairs);
		console.log(densePoints);
throw "calculateGraphFxn?"
		// make graph edges with full pair data
		var graph = new Graph();
		var viewIDToVertex = {};
		var viewIDToViewIndex = {};
		var viewIndexToViewID = {};
		var transforms = [];
		var vertexEdgeList = [];
		for(var i=0; i<denseViews.length; ++i){
			var view = denseViews[i];
			var viewID = view["id"];
			// var vertex = graph.addVertex();
			// viewIDToVertex[viewID] = vertex;
			// vertex.data(view);
			viewIDToViewIndex[viewID] = i;
			viewIndexToViewID[i] = viewID;
			// viewIDToView[i] = viewID;
			transforms[i] = Matrix.fromObject(view["transform"]);
				transforms[i] = Matrix.inverse(transforms[i]);
			vertexEdgeList[i] = [];
		}
		var listPairs = [];
		// 
		for(var i=0; i<densePairs.length; ++i){
			var pair = densePairs[i];
				var idA = pair["A"];
				var idB = pair["B"];
			var extrinsicAtoB = pair["transform"]
			var relativeAtoB = Matrix.inverse(extrinsicAtoB);
			// var vertexA = viewIDToVertex[idA];
			// var vertexB = viewIDToVertex[idB];
			// // vertex.data(denseViews[i]);
			// // var weight = (pair["errorRMean"]+pair["errorRsigma"])/pair["matches"];
			// var weight = (pair["errorRMean"])/pair["matches"];
			// // console.log(weight);
			// var edge = graph.addEdgeDuplex(vertexA,vertexB, weight);
			// 	edge.data(pair);
			var matchCount = pair["matches"]
			var matchError = pair["errorRMean"];
			var edge = null;
			if(matchCount>8){ // some minimum
				var errorAB = matchError/matchCount;
				var indexA = viewIDToViewIndex[idA];
				var indexB = viewIDToViewIndex[idB];
				edge = [indexA,indexB,errorAB];
				vertexEdgeList[indexA].push(i);
				vertexEdgeList[indexB].push(i);
			}
			listPairs.push(edge);
		}

		// pick edges from list of best pairs:
		// var bestPairsMaxCount = 3;
		var bestPairsMaxCount = 5;
		// var bestPairsMaxCount = 10;

		var sortEdge = function(a,b){ // lower error first
			return listPairs[a][2] < listPairs[b][2] ? -1 : 1;
		}
		var listBestPairs = {};
		for(var i=0; i<vertexEdgeList.length; ++i){
			var list = vertexEdgeList[i];
				list.sort(sortEdge);
			var maxJ = Math.min(list.length, bestPairsMaxCount);
			for(var j=0; j<maxJ; ++j){
				var edgeIndex = list[j];
				listBestPairs[edgeIndex] = listPairs[edgeIndex];
			}
		}
		listBestPairs = Code.objectToArray(listBestPairs);
	console.log("PAIR REDUCTION ("+bestPairsMaxCount+")"+listBestPairs.length+" / "+listPairs.length);
// 		var result = R3D.skeletalViewGraph(listBestPairs);
// console.log(result);
// throw "?????????"
		// NOT USED
		var listPairsIDs = [];
		for(var i=0; i<listBestPairs.length; ++i){
			var pair = listBestPairs[i];
			console.log(pair)
			var viewIDA = viewIndexToViewID[pair[0]];
			var viewIDB = viewIndexToViewID[pair[1]];
			listPairsIDs[i] = {"A":viewIDA, "B":viewIDB};
		}

		// TEST
		// var groupSize = 3;
		// var groupTolerance = 1;
		// var overlapDesired = 1;

		// small
		var groupSize = 5; // 4
		var groupTolerance = 1; // 3-5
		var overlapDesired = 2; // up to 7

		// single group
		// var groupSize = 100;
		// var groupTolerance = 0;
		// var overlapDesired = 0;

		// med
		// var groupSize = 6;
		// var groupTolerance = 1; // 5-7
		// var overlapDesired = 3; // up to 10 | avg 6-1+3 = 8

		var result = Graph.groupsFromEdges(listBestPairs, groupSize, groupTolerance, overlapDesired)
		console.log(result);
		var groups = result["groups"];
// throw "USE GROUPS ..."
		// display this monstrosity

		var info = project.displayViewGraph(transforms,listBestPairs);
		var centers = info["points"];
		var displayOffset = info["offset"];
		var colors = [0xFFFF0000,0xFF009900,0xFF0000FF,0xFFCCCC00,0xFFCC00CC,0xFF00CCCC,0xFFCCCCCC];
		var sizes = [11,15,19,23,27];
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			for(var j=0; j<group.length; ++j){
				var vertexID = group[j];
				var p = centers[vertexID];
				var d = new DO();
				var color = colors[i%colors.length];
				var size = sizes[i%sizes.length]
				d.graphics().setLine(3.0,color);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, size);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(displayOffset.x, displayOffset.y);
				GLOBALSTAGE.addChild(d);
			}
		}
		groups.sort(function(a,b){
			return a.length < b.length ? -1 : 1;
		});
		console.log(groups);
// throw "? calculateBundleGroupsFxn"

// ???		

		calculateBundleGroupsFxn(denseViews, groups, densePoints, denseCameras, listBestPairs); // load & keep only relevant tracks 
		// loadAllGroupPairs(denseViews, groups, densePoints, denseCameras); // load points from pairs (relative / track)
		// calculateBundleGroupsBasicFxn(denseViews, groups, densePoints, denseCameras); // do nothing
	}

	var bundleData = null;

	var sortListError = function(a,b){
		return a["error"] < b["error"] ? -1 : 1;
	}


	var initBundleGroupsFxn = function(views, groups, cameras, pairs){
		console.log("initBundleGroupsFxn");
		console.log(views, groups, cameras, pairs);

		var bundleGroupList = [];
		bundleData = {};
			bundleData["cameras"] = cameras;
			bundleData["views"] = views;
			bundleData["groupCount"] = groups.length;
			bundleData["groups"] = bundleGroupList;
			bundleData["points"] = null;
			bundleData["aggregateIndex"] = -1;
			bundleData["surface"] = null;

		// var groupDataList = [];
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			console.log("GROUP "+i+": "+group.length);
			// get list of IDs in group
			var groupIDLookup = {};
			var groupDataViews = [];
			for(var j=0; j<group.length; ++j){
				var viewIndex = group[j];
				var view = views[viewIndex];
				var viewID = view["id"];
				groupDataViews.push(viewID);
				groupIDLookup[viewID] = 1;
			}
			var groupDataPairs = [];
			for(var j=0; j<pairs.length; ++j){
				var pair = pairs[j];
				var idA = pair["A"];
				var idB = pair["B"];
				if(groupIDLookup[idA] && groupIDLookup[idB]){
					var groupPair = {};
						groupPair["id"] = pair["id"];
						groupPair["A"] = pair["A"];
						groupPair["B"] = pair["B"];
					groupDataPairs.push(groupPair);
				}
			}
			//
			var groupFilename = "groups/group_"+i+".yaml";
			bundleGroupData = {};
				bundleGroupData["filename"] = groupFilename;
				bundleGroupData["views"] = groupDataViews;
				bundleGroupData["pairs"] = groupDataPairs;
				bundleGroupData["points"] = null;
			bundleGroupList.push(bundleGroupData);
			// var groupData = {};
			// 	groupData["views"] = groupDataViews;
			// 	groupData["pairs"] = groupDataPairs;
			// 	groupData["points"] = null;
			// groupDataList.push(groupData);
		}


		
		console.log(bundleData);
		console.log(fullBundleDataPath);
		// throw "BEFORE SAVE BUNDLE";
		project.saveFileFromData(bundleData, fullBundleDataPath, saveBundleFileFxn, project);
	}
/*
	var calculateBundleGroupsBasicFxn = function(views, groups, points, cameras){
		var densePairs = denseData["pairs"];

		var bundleGroupList = [];
		bundleData = {};
			bundleData["groupCount"] = groups.length;
			bundleData["groups"] = bundleGroupList;
			bundleData["cameras"] = cameras;
			bundleData["views"] = views;
			bundleData["points"] = null;
			bundleData["aggregateIndex"] = -1;
			bundleData["surface"] = null;
		// make groups
		expectedGroupCount = groups.length;
		completedGroupCount = 0;
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			console.log("GROUP "+i+": "+group.length);
			// get list of IDs in group
			var groupIDLookup = {};
			var groupDataCameras = cameras;
			var groupDataViews = [];
			for(var j=0; j<group.length; ++j){
				var viewIndex = group[j];
				var view = views[viewIndex];
				var viewID = view["id"];
				groupIDLookup[viewID] = 1;
				groupDataViews.push(view);
			}

			var possiblePairs = {};
			for(var j=0; j<groupDataViews.length; ++j){
				var view = groupDataViews[j];
				possiblePairs[view["id"]] = [];
			}

			var possiblePairsTotal = 0;
			for(var j=0; j<densePairs.length; ++j){
				var dp = densePairs[j];
				var a = dp["A"];
				var b = dp["B"];
				if(groupIDLookup[a] && groupIDLookup[b]){
					var pairID = dp["id"];
					var pairCount = dp["relative"];
					var pairError = dp["relativeError"];
					if(pairCount<16){ // some minimum
						continue;
					}
					++possiblePairsTotal;
					var pair = {};
						pair["A"] = a;
						pair["B"] = b;
						pair["id"] = pairID;
						pair["error"] = pairError/pairCount;
					possiblePairs[a].push(pair);
					possiblePairs[b].push(pair);
				}
			}
			// console.log(possiblePairs);

			// pick up to max best pairs:
			var maximumPairsKeep = 3;
			groupPairList = {};
			for(var j=0; j<groupDataViews.length; ++j){
				var view = groupDataViews[j];
				var viewID = view["id"];
				var list = possiblePairs[viewID];
				list.sort(sortListError);
				var maxK = Math.min(list.length, maximumPairsKeep);
				for(var k=0; k<maxK; ++k){
					var pair = list[k];
					groupPairList[pair["id"]] = pair;
				}
			}
			groupPairList = Code.objectToArray(groupPairList);
			console.log(groupPairList,possiblePairsTotal);

			var groupData = {};
				groupData["cameras"] = groupDataCameras;
				groupData["views"] = groupDataViews;
				groupData["pairs"] = groupPairList;
			console.log(groupData);

			var groupFilename = "groups/group_"+i+".yaml";
			bundleGroupData = {};
				bundleGroupData["filename"] = groupFilename;
				bundleGroupData["viewCount"] = groupDataViews.length;
				bundleGroupData["pairCount"] = groupPairList.length;
				bundleGroupData["transforms"] = null;
			bundleGroupList.push(bundleGroupData);
			// SAVE GROUP TO FILE:
throw "before save basic";
			var fullGroupPath = Code.appendToPath(bundleBaseDirectory, groupFilename);
			project.saveFileFromData(groupData, fullGroupPath, saveGroupFileFxn, project);
		}
	}
*/

/*
	var calculateBundleGroupsFxn = function(views, groups, points, cameras, bestPairs){
		console.log(bestPairs);
		console.log(groups);
// throw "calculateBundleGroupsFxn ... here";
		var bundleGroupList = [];
		bundleData = {};
			bundleData["groupCount"] = groups.length;
			bundleData["groups"] = bundleGroupList;
			bundleData["cameras"] = cameras;
			bundleData["views"] = views;
			bundleData["points"] = null;
			bundleData["aggregateIndex"] = -1;
			bundleData["surface"] = null;
		// make groups
		expectedGroupCount = groups.length;
		completedGroupCount = 0;
		console.log("source points: "+points.length);
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			// console.log("GROUP "+i+": "+group.length);
			// get list of IDs in group
			var groupIDLookup = {};
			var groupDataCameras = cameras;
			var groupDataViews = [];
			for(var j=0; j<group.length; ++j){
				var viewIndex = group[j];
				var view = views[viewIndex];
				var viewID = view["id"];
				groupIDLookup[viewID] = 1;
				groupDataViews.push(view);
			}
			var groupDataPairs = [];
			for(var j=0; j<bestPairs.length; ++j){
				var pair = bestPairs[j];
				var indexA = pair[0];
				var indexB = pair[1];
				var viewA = views[indexA];
				var viewB = views[indexB];
				var viewIDA = viewA["id"];
				var viewIDB = viewB["id"];
				if(groupIDLookup[viewIDA] && groupIDLookup[viewIDB]){
					groupDataPairs.push({"A":viewIDA, "B":viewIDB});
				}
			}
			// get list of points for group:
			var groupPointList = [];
			for(var p=0; p<points.length; ++p){
				var point = points[p];
				var pointViews = point["v"];
				var groupViews = [];
				for(var v=0; v<pointViews.length; ++v){
					var pointView = pointViews[v];
					var pointViewID = pointView["i"];
					if(groupIDLookup[pointViewID]===1){
						groupViews.push(pointView);
					}
				}
				if(groupViews.length>1){ // 2+
					var groupPoint = {};
					groupPoint["v"] = groupViews;
					groupPoint["X"] = point["X"];
					groupPoint["Y"] = point["Y"];
					groupPoint["Z"] = point["Z"];
					groupPoint["x"] = point["x"];
					groupPoint["y"] = point["y"];
					groupPoint["z"] = point["z"];
					groupPoint["s"] = point["s"];
					groupPointList.push(groupPoint);
				}
				// break;
			}
			// console.log(groupPointList);
			var groupData = {};
				groupData["cameras"] = groupDataCameras;
				groupData["views"] = groupDataViews;
				groupData["points"] = groupPointList;
				groupData["pairs"] = groupDataPairs;
			console.log(groupData);

			var groupFilename = "groups/group_"+i+".yaml";
			bundleGroupData = {};
				bundleGroupData["filename"] = groupFilename;
				bundleGroupData["viewCount"] = groupDataViews.length;
				bundleGroupData["pointCount"] = groupPointList.length;
				bundleGroupData["transforms"] = null;
				// bundleGroupData["pairs"] = null; // TODO: PAIR FOR GROUP ?
			bundleGroupList.push(bundleGroupData);
			// SAVE GROUP TO FILE:
			// console.log(groupData);
			// console.log(bundleGroupList);
			// throw "before save group calculateBundleGroupsFxn";
			var fullGroupPath = Code.appendToPath(bundleBaseDirectory, groupFilename);
			project.saveFileFromData(groupData, fullGroupPath, saveGroupFileFxn, project);
		}
	}
*/



/*

	var expectedGroupCount = null;
	var completedGroupCount = null;

	var loadAllGroupPairs = function(views, groups, points, cameras){
		var bundleGroupList = [];
		bundleData = {};
			bundleData["groupCount"] = groups.length;
			bundleData["groups"] = bundleGroupList;
			bundleData["cameras"] = cameras;
			bundleData["views"] = views;
			bundleData["points"] = null;
			bundleData["aggregateIndex"] = -1;
			bundleData["surface"] = null;

		var densePairs = denseData["pairs"];

		console.log(densePairs);
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			console.log("GROUP "+i+": "+group.length);
			// get list of IDs in group
			var groupIDLookup = {};
			var groupDataCameras = cameras;
			var groupDataViews = [];
			for(var j=0; j<group.length; ++j){
				var viewIndex = group[j];
				var view = views[viewIndex];
				var viewID = view["id"];
				groupIDLookup[viewID] = 1;
				groupDataViews.push(view);
			}
			// get list of points for group:
			var filesList = [];
			for(var j=0; j<densePairs.length; ++j){
				var dp = densePairs[j];
				var a = dp["A"];
				var b = dp["B"];
				if(groupIDLookup[a] && groupIDLookup[b]){
					var pairID = dp["id"];
					var pairFile = Code.appendToPath("dense","pairs",pairID,"relative.yaml");
					// console.log("load pair: "+pairFile);
					filesList.push(pairFile);
					// break;
				}
			}
			// single group load points
			loadedFileCount = 0;
			expectedFileCount = filesList.length;
			singleGroupData = {};
				singleGroupData["cameras"] = cameras;
				singleGroupData["views"] = groupDataViews;
				singleGroupData["points"] = [];
			for(var j=0; j<filesList.length; ++j){
				var file = filesList[j];
				console.log("load pair: "+j+" = "+file);
				project.loadDataFromFile(file, handleGroupDensePairLoaded);
			}

			break;
		}
		// 
	}

	var totalPointCount = 0;
	var expectedFileCount = 0;
	var loadedFileCount = 0;

	var handleGroupDensePairLoaded = function(data){
		// console.log("handleGroupDensePairLoaded");
		++loadedFileCount;
		var points = data["points"];
		var pointCount = points.length;
		totalPointCount += pointCount;
		console.log(pointCount,totalPointCount);
		Code.arrayPushArray(singleGroupData["points"],points);
		if(loadedFileCount==expectedFileCount){
			console.log(singleGroupData["points"].length);
			var str = YAML.parse(singleGroupData);
			console.log(str);
		} 
	}
*/





	var saveGroupFileFxn = function(){
		++completedGroupCount;
		console.log("saveGroupFileFxn: "+completedGroupCount+" / "+expectedGroupCount);
		if(completedGroupCount==expectedGroupCount){
			throw "saved all groups"
			project.saveFileFromData(bundleData, fullBundleDataPath, saveBundleFileFxn, project);
			console.log(bundleData);
		}
	}

	var saveBundleFileFxn = function(){
		console.log("saved bundle");
		project.bundleFilename(fullBundleDataPath);
		project.saveProjectFile(savedProjectComplete, project);
	}

	var savedProjectComplete = function(){
		console.log("saved project");
		project._taskDoneCheckReloadURL();
	}

	project.loadDataFromFile(denseFilename, loadedDenseDataFxn);

}

App3DR.ProjectManager.prototype.iterateBundleProcess = function(){
	var project = this;
	console.log("iterateBundleProcess...");
	var bundleData = null;
	var selectedGroup = null;
	var groupData = null;
	var groupDataPath = null;
	
	var bundleFilename = project.bundleFilename();
	var bundlePathBase = Code.pathRemoveLastComponent(bundleFilename);
	console.log(bundleFilename);
	console.log(bundlePathBase);
	var densePathBase = "dense";//Code.appendToPath(Code.pathRemoveLastComponent(bundlePathBase), "dense");
// console.log("densePathBase: '"+densePathBase+"'")
// throw "densePathBase"
	var expectedImagesCount = 0;
	var loadedImagesCount = 0;
	var expectedPairsCount = 0;
	var loadedPairsCount = 0;
	var groupsInfo = null;

	var loadedBundleDataFxn = function(data){
		console.log(data);
		bundleData = data;
// throw "bundleData";
		// get next group to stereopsis
		var groups = bundleData["groups"];
		for(var i=0; i<groups.length; ++i){ // load all group points & views into world & solve group dense
			var group = groups[i];
			if(!group["points"]){
				console.log(group);
				var allCameras = bundleData["cameras"];
				var allViews = bundleData["views"];
				var allViewsLookup = {};
				for(var j=0; j<allViews.length; ++j){
					var allView = allViews[j];
					var viewID = allView["id"];
					allViewsLookup[viewID] = allView;
				}
				var groupViews = group["views"];
				var worldViews = [];
				for(var j=0; j<groupViews.length; ++j){
					var groupViewID = groupViews[j];
					var view = allViewsLookup[groupViewID];
					worldViews.push(view);
				}
				var groupPairs = group["pairs"];
				// PASSING DATA:
				selectedGroup = i;
				// groupData = group; // ?
				groupsInfo = {};
					groupsInfo["cameras"] = allCameras;
					groupsInfo["views"] = worldViews;
					groupsInfo["pairs"] = groupPairs;
					groupsInfo["points"] = [];
				console.log("start loading");
				// load points
				expectedPairsCount = groupPairs.length;
				for(var j=0; j<groupPairs.length; ++j){
					var groupPair = groupPairs[j];
					var groupID = groupPair["id"];
					var groupPairFilename = Code.appendToPath(densePathBase, "pairs", groupID, "relative.yaml");
					project.loadDataFromFile(groupPairFilename, completeLoadGroupPair, project);
				}
				// load images:
				expectedImagesCount = worldViews.length;
				for(var j=0; j<worldViews.length; ++j){
					var worldView = worldViews[j];
					var viewID = worldView["id"];
					var view = project.viewFromID(viewID);
					// view.loadBundleAdjustImage(completeLoadGroupViewImage, project); // 4032 x 3024
					view.loadDenseHiImage(completeLoadGroupViewImage, project); // ... 
					// view.loadIconImage(completeLoadGroupViewImage, project);
				}
				return;
			}
		}

		// aggregate views
		var viewsFileName = bundleData["viewsFile"];
		if(!viewsFileName){
			// throw "aggregate views";
			var views = bundleData["views"];
			var viewsData = {};
				viewsData["views"] = views;
				viewsData["cameras"] = bundleData["cameras"];

			viewsFileName = "views.yaml";
			bundleData["viewsFile"] = viewsFileName;
			bundleData["viewsCount"] = views.length;

			var savedViewsCompleteFxn = function(s){
				console.log("savedViewsCompleteFxn");
				project.saveFileFromData(bundleData, bundleFilename, savedBundleCompleteFxn, project);
			}
			var savedBundleCompleteFxn = function(s){
				console.log("savedBundleCompleteFxn");
				project._taskDoneCheckReloadURL();
			}
			console.log(bundlePathBase,viewsFileName);
			var viewsDataPath = Code.appendToPath(bundlePathBase,viewsFileName);
			console.log("viewsDataPath: "+viewsDataPath);
			
			project.saveFileFromData(viewsData, viewsDataPath, savedViewsCompleteFxn, project);
			return;
		}

		var pointsFileName = bundleData["pointsFile"];
		if(!pointsFileName){
			// throw "aggregate points";
			var pointsFileName = "points.yaml";
			bundleData["pointsFile"] = pointsFileName;
			pointsDataPath = Code.appendToPath(bundlePathBase,pointsFileName);
			var viewData = null;
			var fileSourceList = [];
			for(var i=0; i<groups.length; ++i){
				var group = groups[i];
				var filename = group["filename"];
				filename = Code.appendToPath(bundlePathBase,filename);
				fileSourceList.push(filename);
			}
			console.log(pointsDataPath);
			console.log(fileSourceList);
			var pointsSavedFxn = function(pointCount){
				console.log("pointsSavedFxn: "+pointCount);
				project.setBundleCount(pointCount);
				project.saveFileFromData(bundleData, bundleFilename, bundleSavedFxn, project);
			}

			var bundleSavedFxn = function(){
				console.log("bundleSavedFxn");
				project.saveProjectFile(projectSavedFxn);
			}

			var projectSavedFxn = function(){
				console.log("projectSavedFxn");
				project._taskDoneCheckReloadURL();
			}
// throw "before aggregate points";
			// project.loadDataFromFile(viewsDataPath, loadedViewDataFxn);
			project.aggregateGroupPointsToSingleFile(fileSourceList, pointsDataPath, pointsSavedFxn, project);

			return;
		}
		throw "should be done?"
	}


	var completeLoadGroupViewImage = function(data){
		++loadedImagesCount;
		checkCompletePairsAndViews();
	}

	var completeLoadGroupPair = function(data){
		var points = data["points"];
		var allPoints = groupsInfo["points"];
		Code.arrayPushArray(allPoints, points);
		++loadedPairsCount;
		checkCompletePairsAndViews();
	}

	var checkCompletePairsAndViews = function(){
		console.log(expectedImagesCount+" / "+loadedImagesCount+" && "+expectedPairsCount+" / "+loadedPairsCount);
		if(expectedImagesCount==loadedImagesCount && expectedPairsCount == loadedPairsCount){
			console.log("checkCompletePairsAndViews");
			console.log(groupsInfo);
			project._doDenseGroupsStereopsis(groupsInfo, completedDenseGroupsStereopsis, project);
		}
	}

	var completedDenseGroupsStereopsis = function(world){
		console.log("completedDenseGroupsStereopsis");
console.log(world);
var worldData = world.toObject();
console.log(worldData);
var group = bundleData["groups"][selectedGroup];
console.log(group);
		var worldViews = worldData["views"];
		var worldTransforms = worldData["transforms"];
		var worldPoints = worldData["points"];
		var worldCameras = worldData["cameras"];

			group["points"] = worldPoints.length;

		var groupData = {};
			groupData["cameras"] = worldCameras;
			groupData["views"] = worldViews;
			groupData["transforms"] = worldTransforms;
			groupData["points"] = worldPoints;
console.log(group);
console.log(groupData);
var groupDataPath = Code.appendToPath(bundlePathBase,group["filename"]);
console.log(groupDataPath);
// throw "before save dense group?";
		project.saveFileFromData(groupData, groupDataPath, completedSaveGroupFxn, project);
	}

	var completedSaveGroupFxn = function(){
		console.log("completedSaveGroupFxn");
		project.saveFileFromData(bundleData, bundleFilename, completedSaveBundleFxn, project);
	}

	var completedSaveBundleFxn = function(){
		console.log("completedSaveBundleFxn");
		project._taskDoneCheckReloadURL();
	}

	project.loadDataFromFile(bundleFilename, loadedBundleDataFxn);
}
App3DR.ProjectManager.prototype.aggregateGroupPointsToSingleFile = function(sourceFileList, pointsFileName, completeFxn, completeCxt){
	var project = this;

	var pointsAll = [];
	var currentSourceIndex = 0;
	var loadedGroupPointFile = function(data){
		var points = data["points"];
		console.log("append points: "+points.length);
		Code.arrayPushArray(pointsAll,points);
		// next group
		++currentSourceIndex;
		Code.functionAfterDelay(loadNextGroupPointFile, 1);
	}

	var savedPointFileComplete = function(data){
		console.log("savedPointFileComplete");
		var pointCount = pointsAll.length;
		if(completeCxt){
			completeFxn.call(completeCxt, pointCount);
		}else{
			completeFxn(pointCount);
		}
	}

	var savePointFileStart = function(){
		console.log("savePointFileStart");
		var pointsData = {};
		pointsData["points"] = pointsAll;
		console.log(pointsData);
		project.saveFileFromData(pointsData, pointsFileName, savedPointFileComplete, project);
	}

	var loadNextGroupPointFile = function(){
		console.log("loadNextGroupPointFile");
		if(currentSourceIndex>=sourceFileList.length){
			savePointFileStart();
		}else{
			var filename = sourceFileList[currentSourceIndex]; 
			project.loadDataFromFile(filename, loadedGroupPointFile);
		}
	}
	
	loadNextGroupPointFile();
}
App3DR.ProjectManager.prototype.aggregateGroupPointsToSingleFileOLD = function(groups,views,cameras,pointsFileName, filePrefix, completeFxn){
	var project = this;
	// TODO: this should load & append, not keep all points in memory

	var camIDToCam = {};
	for(var i=0; i<cameras.length; ++i){
		var cam = cameras[i];
			cam["K"] = Matrix.fromObject(cam["K"]);
			cam["Kinv"] = Matrix.inverse(cam["K"]);
		var camID = cam["id"];
		camIDToCam[camID] = cam;
	}

	var viewIDToView = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
			view["transform"] = Matrix.fromObject(view["transform"]);
		var camID = view["camera"];
		var cam = camIDToCam[camID];
		// var size = view["imageSize"]
			view["K"] = cam["K"];
			view["Kinv"] = cam["Kinv"];
			view["origin"] = view["transform"].multV3DtoV3D(new V3D(0,0,0));
			view["normal"] = view["transform"].multV3DtoV3D(new V3D(0,0,1));
				view["normal"].sub(view["origin"]);
				view["normal"].norm();
		var viewID = view["id"];
		viewIDToView[viewID] = view;
	}

	var allPoints = [];
	var totalPointCount;
	var pointsSavedFxn = function(){
		completeFxn(totalPointCount);
	}

	var groupIndex = 0;
	var checkLoadNextGroup = function(){
		console.log("checkLoadNextGroup");
		if(groupIndex>=groups.length){
			totalPointCount = allPoints.length;
			// SAVE FILE
			var pointsData = {};
				pointsData["points"] = allPoints;
			console.log(allPoints);
			console.log(pointsFileName);
			project.saveFileFromData(pointsData, pointsFileName, pointsSavedFxn, project);
			return;
		}
		var group = groups[groupIndex];
		console.log(group);
		var groupFilename = group["filename"];
		var groupDataPath = Code.appendToPath(filePrefix,groupFilename);
		console.log(groupDataPath);
		project.loadDataFromFile(groupDataPath, loadedGroupCompleteFxn);
	}
	var loadedGroupCompleteFxn = function(data){
		console.log("loadedGroupCompleteFxn");
		console.log(data);
		var groupPoints = data["points"];
		for(var i=0; i<groupPoints.length; ++i){
			var point = groupPoints[i];
			// console.log(point);
			var vList = point["v"];
			var p2Ds = [];
			var extrinsics = [];
			var Kinvs = [];
			var Ks = [];
			for(var j=0; j<vList.length; ++j){
				var view = vList[j];
				var viewID = view["i"];
				var p2D = new V2D(view["x"],view["y"]);
					view = viewIDToView[viewID];
				var ext = view["transform"];
				var Kinv = view["Kinv"];
				var K = view["K"];
				var org = view["origin"];
				p2Ds.push(p2D);
				extrinsics.push(ext);
				Kinvs.push(Kinv);
				Ks.push(K);
			}
			// console.log(p2Ds, extrinsics, Kinvs);
			var p3D = R3D.triangulatePointDLTList(p2Ds, extrinsics, Kinvs);
			// console.log(p3D);
			var keep = true;
			for(var j=0; j<p2Ds.length; ++j){
				var p2D = p2Ds[j];
				var extrinsic = extrinsics[j];
				var K = Ks[j];
				var error = R3D.reprojectionErrorSingle(p3D, p2D, extrinsic, K);
				// console.log(error);
				if(false){
					throw "drop if poor reprojection error";
					keep = false;
					break;
				}
			}
			// if(!keep){
			// 	continue;
			// }
			// R3D.reprojectionErrorSingle = function(p3D, p2D, extrinsic, K);
			// var error = R3D.reprojectionErrorList(estimated3D, reprojected2DA, reprojected2DB, camIdentity,camAtoB, K,K);

			
			// normal
			// var Math.PI
			var pointToCenters = [];
			for(var j=0; j<vList.length; ++j){
				var view = vList[j];
				var viewID = view["i"];
					view = viewIDToView[viewID];
				var org = view["origin"];
				var nrm = view["normal"];
				pToC = V3D.sub(org,p3D);
				pToC.norm();
				pointToCenters.push(pToC);
				// console.log(V3D.dot(nrm,pToC),Code.degrees(V3D.angle(nrm,pToC)));
				// if(V3D.angle(nrm,pToC) < degrees90){
				if(V3D.dot(nrm,pToC)>0){ // behind
					keep = false;
					break;
				}
			}
			if(!keep){
				console.log("SKIPPED");
				continue;
			}
// throw "????"
			var n3D = Code.averageAngleVector3D(pointToCenters);
			// console.log(n3D);
			var point3D = {};
				point3D["v"] = vList; // is this used ?
				point3D["X"] = p3D.x;
				point3D["Y"] = p3D.y;
				point3D["Z"] = p3D.z;
				point3D["x"] = n3D.x;
				point3D["y"] = n3D.y;
				point3D["z"] = n3D.z;
			allPoints.push(point3D);
			
		}
		++groupIndex;
		checkLoadNextGroup();
	}

	console.log(groups,views,pointsFileName);
	checkLoadNextGroup();
}

App3DR.ProjectManager.prototype.initializeSurfaceFromBundle = function(){ // create surface.yaml
	var project = this;
	var parentDirectory = "bundle";
	var viewsFilename = "views.yaml";
	var pointsFilename = "points.yaml";
	viewsFilename = Code.appendToPath(parentDirectory,viewsFilename);
	pointsFilename = Code.appendToPath(parentDirectory,pointsFilename);
	// var viewData = null;
	// var pointsData = null;
	var parentDirectory = "surface";
	var surfaceFilename = "surface.yaml";
	var surfaceViewsFilename = "views.yaml";
	var pointsViewsFilename = "points.yaml";
	var surfaceFilenameFull = Code.appendToPath(parentDirectory,surfaceFilename);
	var surfaceViewsFilenameFull = Code.appendToPath(parentDirectory,surfaceViewsFilename);
	var surfacePointsFilenameFull = Code.appendToPath(parentDirectory,pointsViewsFilename);
	var savedCount = 0;
	var viewCount = null;
	var pointCount = null;
	var loadedViewsFxn = function(data){
		var views = data["views"];
		var cameras = data["cameras"];
		viewCount = views.length;
		var viewData = {};
		viewData["cameras"] = cameras;
		viewData["views"] = views;
		project.saveFileFromData(viewData, surfaceViewsFilenameFull, checkDone, project);
	}
	var loadedPointsFxn = function(data){
		var points = data["points"];
		pointCount = points.length;
		var pointsData = {};
		pointsData["points"] = points;
		project.saveFileFromData(pointsData, surfacePointsFilenameFull, checkDone, project);
	}
	var checkDone = function(){
		++savedCount;
		if(savedCount!==2){
			return;
		}
		console.log("checkDone");
		var data = {};
		data["views"] = surfaceViewsFilename;
		data["viewCount"] = viewCount;
		data["points"] = pointsViewsFilename;
		data["pointCount"] = pointCount;
		data["triangles"] = null;
		data["triangleCount"] = null;
		data["textures"] = null;
		data["textureCount"] = null;
		console.log(data);
		project.saveFileFromData(data, surfaceFilenameFull, savedSurfaceCompleteFxn, project);
	}
	var savedSurfaceCompleteFxn = function(){
		console.log("savedSurfaceCompleteFxn");
		project.surfaceFilename(surfaceFilenameFull);
		project.saveProjectFile(savedProjectCompleteFxn);
	}
	var savedProjectCompleteFxn = function(){
		console.log("savedProjectCompleteFxn");
		project._taskDoneCheckReloadURL();
	}
	project.loadDataFromFile(viewsFilename, loadedViewsFxn);
	project.loadDataFromFile(pointsFilename, loadedPointsFxn);
}

App3DR.ProjectManager.prototype.iterateSurfaceProcess = function(){
	var project = this;
	var surfaceFilename = project.surfaceFilename();
	console.log(surfaceFilename);
	var surfaceDirectory = Code.pathRemoveLastComponent(surfaceFilename);
	console.log(surfaceDirectory);
	var surfaceData = null;
	var fileNameTriangles = "triangles.yaml";
	var fileNameTextures = "textures.yaml";
	var textureDirectory = "textures";
	// var fileName??? = "??.yaml";
	var loadedSurfaceFxn = function(data){
		console.log("loadedSurfaceFxn");
		console.log(data);
		surfaceData = data;
		var views = data["views"];
		var points = data["points"];
		var triangles = data["triangles"];
		var triangleCount = data["triangleCount"];
		var textures = data["textures"];
		var textureCount = data["textureCount"];

		var viewsFilename = Code.appendToPath(surfaceDirectory, views);
		var pointsFilename = Code.appendToPath(surfaceDirectory, points);

		if(!triangles){ // create triangulation from points
			project.loadDataFromFile(viewsFilename, loadedViewsFxnForTris);
			project.loadDataFromFile(pointsFilename, loadedPointsFxnForTris);
			return;
		}
		if(!textures){ // load triangles & map out textures
			var trianglesFilename = Code.appendToPath(surfaceDirectory, triangles);
			var triangleData = null;
			var viewData = null;
			var checkLoadedAll = function(){
				if(triangleData && viewData){
					loadedTrianglesFxn(viewData,triangleData);
				}
			}
			var loadedViewsFxn = function(data){
				viewData = data;
				checkLoadedAll();
			}
			var loadedTrisFxn = function(data){
				triangleData = data;
				checkLoadedAll();
			}
			project.loadDataFromFile(trianglesFilename, loadedTrisFxn);
			project.loadDataFromFile(viewsFilename, loadedViewsFxn);
			return;
		}
		if(!textureCount){ // oad textures & continue iterating texture creation
			var texturesFilename = Code.appendToPath(surfaceDirectory, textures);
			project.loadDataFromFile(texturesFilename, loadedTexturesFxn);
			return;
		}



		
		var texturesFilename = Code.appendToPath(surfaceDirectory, textures);
		project.loadDataFromFile(texturesFilename, loadedSceneFxn);
		
		throw "done - copy triangles & textures to scene file & save surfaceCount to main project file"
	}
	var loadedSceneFxn = function(data){
		console.log(data);
		App3DR.ProjectManager.sceneDataToDAE(data);
	}

	var viewData = null;
	var pointData = null;
	var loadedViewsFxnForTris = function(data){
		viewData = data;
		console.log("loadedViewsFxn");
		continueLoadingPointsFxn(pointData,viewData);
	}
	var loadedPointsFxnForTris = function(data){
		pointData = data;
		console.log("loadedPointsFxn");
		continueLoadingPointsFxn(pointData,viewData);
	}
	var continueLoadingPointsFxn = function(pointData,viewData){
		console.log("continueLoadingPointsFxn");
		console.log(pointData);
		console.log(viewData);
		if(!pointData || !viewData){
			return;
		}
		var camerasAll = viewData["cameras"];
		var viewsAll = viewData["views"];
		var pointsAll = pointData["points"];
		var points = [];
		var normals = [];
		for(var i=0; i<pointsAll.length; ++i){
			var source = pointsAll[i];
			var point = new V3D(source["X"],source["Y"],source["Z"]);
			var normal = new V3D(source["y"],source["y"],source["z"]);
			normals.push(normal);
			points.push(point);
		}
		console.log(normals);
		console.log(points);

console.log(viewsAll);



// var triangles = [];
// var bgTriangles = project.generateBackgroundSphere(viewsAll,camerasAll, triangles);
// console.log(bgTriangles);
var bgTriangles = [];

// throw "NEED TO DO BG-SPHERE"
		var mesh = new Mesh3D(points,normals);
		var triangles = mesh.generateSurfaces();
console.log("triangles");
console.log(triangles);
		// Code.arrayPushArray(triangles, bgTriangles);
// throw "HERE"
		var triangleCount = triangles.length;
		var pointList = Tri3D.arrayToUniquePointList(triangles);
		console.log(pointList);
		// TODO: drop triangles that don't face toward any of the views ?
		var triangleData = {};
		triangleData["points"] = pointList["points"];
		triangleData["triangles"] = pointList["triangles"];
		var triangleFullPath = Code.appendToPath(surfaceDirectory,fileNameTriangles);
		surfaceData["triangles"] = fileNameTriangles;
		surfaceData["triangleCount"] = triangleCount;
		var fxnSaveSurfaceComplete = function(){
			console.log("saved surfaceData");
			project._taskDoneCheckReloadURL();
		}
		var fxnSaveTrianglesComplete = function(){
			console.log("saved triangleData");
			project.saveFileFromData(surfaceData, surfaceFilename, fxnSaveSurfaceComplete, project);
		}
		project.saveFileFromData(triangleData, triangleFullPath, fxnSaveTrianglesComplete, project);
	}

	// create triangle-view best-vertex mapping
	var loadedTrianglesFxn = function(viewData,triangleData){
		// var textureDimension = 4096;
		var textureDimension = 2048;
		// var textureDimension = 1024;
		// var textureDimension = 512;
		// var resolutionScale = 0.50; // of maximum possible source input
		// var resolutionScale = 0.25;
// var resolutionScale = 1.0/8.0; // basic geometry test
var resolutionScale = 1.0/4.0; // debuging scene texture quality
// var resolutionScale = 1.0/2.0; // VR OK density
// var resolutionScale = 1.0; // release quality

		console.log("loadedTrianglesFxn");
		console.log(viewData,triangleData);
		// output texture size
		var textureSize = new V2D(textureDimension,textureDimension);
		// camera lookup
		var cameras = viewData["cameras"];
		var cameraFromID = {};
		for(var i=0; i<cameras.length; ++i){
			var cam = cameras[i];
			var K = cam["K"];
				K = Matrix.fromObject(K);
			cameraFromID[cam["id"]] = K;
		}

		// views to transforms & resolutions
		var views = viewData["views"];
		var resolutions = [];
		var transforms = [];
		var cameras = [];
		for(var i=0; i<views.length; ++i){
			var tv = views[i];
			var viewID = tv["id"]
			var camID = tv["camera"];
			var K = cameraFromID[camID];
if(!K){
	console.log(tv);
	throw "missing camera for view";
}
			var viewTransform = tv["transform"];
			if(!viewTransform){
				viewTransform = tv["R"]; 
			}
			var transform = Matrix.fromObject(viewTransform); // extrinsic
			var view = project.viewFromID(viewID);
			var size = view.maximumImageSize();
			resolutions.push(size);
			transforms.push(transform);
			cameras.push(K);
		}

		// console.log(resolutions);
		// console.log(cameras);
		// throw "??";

		// points+lists to triangles
		var points = triangleData["points"];
		var triangles = triangleData["triangles"];
		var triangles3D = Tri3D.uniquePointListToTriangles(points,triangles); 
// console.log(transforms,cameras,resolutions,triangles3D,textureSize,resolutionScale);
// throw "?"
		// source image assignment
		var info = R3D.optimumTriangleTextureImageAssignment(transforms,cameras,resolutions,triangles3D,textureSize,resolutionScale);
		var vertexes3D = info["vertexes3D"];
		var triangles3D = info["triangles3D"];
		var triangles2D = info["triangles2D"];
		var sources2D = info["sources2D"];
		var views2D = info["views2D"];
		var included2D = info["views"];
console.log(info);
// throw "optimumTriangleTextureImageAssignment results";
		// texture packing
		var info = R3D.optimumTriangleTexturePacking(textureSize,triangles2D);
		console.log(info);
		var pagesCount = info["pageCount"];
		var texture2D = info["mapped2D"];
		var pages2D = info["pages"];

		// save in format
		var newTriangles = [];
		var newVertexes = [];
		for(var i=0; i<vertexes3D.length; ++i){
			var v = vertexes3D[i];
			newVertexes.push({"X":v.x,"Y":v.y,"Z":v.z});
		}
		// 
		for(var i=0; i<triangles3D.length; ++i){
			var tri2D = texture2D[i];
			var triangle3D = triangles3D[i];
			var page = pages2D[i];
			var assignedView = included2D[i];
			var sourceViews = views2D[i];
			var sourcePoints = sources2D[i];
			var sourceList = [];
			for(var j=0; j<sourceViews.length; ++j){
				var v = sourceViews[j];
				var p = sourcePoints[j];
				try{
					sourceList.push({"v":v,"a":{"x":p[0].x,"y":p[0].y},"b":{"x":p[1].x,"y":p[1].y},"c":{"x":p[2].x,"y":p[2].y}});
				}catch(e){
					console.log(sourceViews);
					console.log(sourcePoints);
					console.log(i+":");
					console.log(j+":");
					console.log(v);
					console.log(p);
					console.log("?");
					throw "?"
				}
			}
			var newTri = {};
				newTri["A"] = {"i":triangle3D[0],"v":assignedView[0]};
				newTri["B"] = {"i":triangle3D[1],"v":assignedView[1]};
				newTri["C"] = {"i":triangle3D[2],"v":assignedView[2]};
				newTri["a"] = {"x":tri2D[0].x,"y":tri2D[0].y};
				newTri["b"] = {"x":tri2D[1].x,"y":tri2D[1].y};
				newTri["c"] = {"x":tri2D[2].x,"y":tri2D[2].y};
				newTri["t"] = page;
				newTri["v"] = sourceList; // i, x,y,z
			newTriangles.push(newTri);
		}
		// console.log("newTriangles:");
		// console.log(newTriangles);
		
		// packing init:
		var packing = [];
		for(var i=0; i<views.length; ++i){
			var viewID = views[i]["id"];
			packing.push({"v":i, "id":viewID});
		}
		// texture init:
		var textures = [];
		for(var i=0; i<pagesCount; ++i){
			var tex = {};
			tex["id"] = ""+i;
			tex["file"] = "tex"+i+".png";
			tex["width"] = textureSize.x;
			tex["height"] = textureSize.y;
			textures.push(tex);
		}
		// save updated version:
		var textureData = {};
		textureData["vertexes"] = newVertexes;
		textureData["triangles"] = newTriangles;
		textureData["packing"] = packing;
		textureData["textures"] = textures;
		var textureTriCount = newTriangles.length;
		var texturePageCount = pagesCount;
		// console.log(textureTriCount,texturePageCount);
		console.log(textureData);
		var fxnSaveSurfaceComplete = function(){ // initial copy / setup done
			console.log("saved surfaceData");
			project._taskDoneCheckReloadURL();
		}
		var fxnSaveTexturesComplete = function(){
			console.log("saved textureData");
			project.saveFileFromData(surfaceData, surfaceFilename, fxnSaveSurfaceComplete, project);
		}
		surfaceData["textures"] = fileNameTextures;
		var textureFullPath = Code.appendToPath(surfaceDirectory, fileNameTextures);
		project.saveFileFromData(textureData, textureFullPath, fxnSaveTexturesComplete, project);
	}


	// var updatedImage = R3D.imageFromImageMatrix(textureImage, GLOBALSTAGE,function(){
	// 	var imageBinary = Code.base64StringToBinary(updatedImage.src);
	// 	project.saveTriangleTextureFromFilename(filename, imageBinary, saveTextureComplete, project, null);
	// });
	// iterate thru triangle generation
	var loadedTexturesFxn = function(data){
// throw "not this again"
		var textureData = data;
		var infoTextures = textureData["textures"];
		var infoVertexes = textureData["vertexes"];
		var infoTriangles = textureData["triangles"];
		var infoPackingViews = textureData["packing"];
		// save a blank - black file for each of the textures
		var imageMatrix = null;
		var colorBlank = new V3D(0.0,0.0,0.0);
		var expectedTextureCount = infoTextures.length;
		var currentTextureCount = 0;

		// for each view: calculate each of the textures that need updating
		var viewTextureHash = {};
		for(var i=0; i<infoPackingViews.length; ++i){
			var view = infoPackingViews[i];
			var index = view["v"];
				index = index+"";
			viewTextureHash[index] = {};
		}

		var vertexProperties = ["A","B","C"];
		for(var i=0; i<infoTriangles.length; ++i){
			var triangle = infoTriangles[i];
			var text = triangle["t"];
			for(var j=0; j<vertexProperties.length; ++j){
				var prop = vertexProperties[j];
				var vert = triangle[prop];
				var view = vert["v"];
					viewTextureHash[view+""][text+""] = text;
			}
		}
		var keys = Code.keys(viewTextureHash);
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var list = viewTextureHash[key];
				list = Code.objectToArray(list);
				list.sort(); // by texture index
			viewTextureHash[key] = list;
		}


		// maximumImageSize
		var stage = GLOBALSTAGE;
		var currentViewIndex = 0;
		var totalViewCount = infoPackingViews.length;
		var currentTextureIndex = null;
		var totalTextureCount = null;
		var texturesToLoad = null;
		var packViewFxn = function(){
			console.log("packViewFxn: "+currentViewIndex+" / "+totalViewCount);
			if(currentViewIndex>=totalViewCount){
				console.log("done with all views");
				var fxnSaveSurfaceComplete = function(){
					console.log("saved surfaceData");
					project._taskDoneCheckReloadURL();
				}
				surfaceData["textureCount"] = infoTextures.length;
				project.saveFileFromData(surfaceData, surfaceFilename, fxnSaveSurfaceComplete, project);
				return;
			}
			var viewIndex = currentViewIndex;
			// load image
			var packingView = infoPackingViews[viewIndex];
			var viewID = packingView["id"];
			var viewReference = packingView["v"];
				texturesToLoad = viewTextureHash[viewReference];
				currentTextureIndex = 0;
				totalTextureCount = texturesToLoad.length;
		// TODO: if totalTextureCount == 0 -> skip
			if(totalTextureCount==0){

				// throw "move to next image";
				console.log("move to next image");
				++currentViewIndex;
				packViewFxn();
				return;
			}
			var view = project.viewFromID(viewID);
			view.loadMaximumImage(function(){
				// console.log("loaded view image: ");
				var image = view.maxImage();
				var imageMatrix  = R3D.imageMatrixFromImage(image, stage);
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(imageMatrix.red(),imageMatrix.grn(),imageMatrix.blu(), imageMatrix.width(),imageMatrix.height());
var d = new DOImage(img);
d.matrix().scale(0.25);
d.matrix().translate(0,0);
GLOBALSTAGE.addChild(d);
*/
				// console.log(imageMatrix)
				applyTextureFxn(packingView, imageMatrix);
			});
		}
		var applyTextureFxn = function(packingView, imageMatrix){
			console.log(currentTextureIndex+" / "+totalTextureCount);
			if(currentTextureIndex>=totalTextureCount){
				// throw "done with textures -> next view"
				++currentViewIndex;
				packViewFxn();
				return;
			}
			var textureIndex = texturesToLoad[currentTextureIndex];
			var infoTexture = infoTextures[textureIndex];
			// console.log(texture);
			var textureFile = infoTexture["file"];
			var path = Code.appendToPath(textureDirectory, textureFile);
			var fullPath = Code.appendToPath(surfaceDirectory, path);
			console.log(fullPath);
			var completeFxn = function(data){
				console.log("loaded source image texture");
				project.dataToImage(data, function(image){
					var textureMatrix = R3D.imageMatrixFromImage(image, stage);
					fillTextureInFxn(packingView, imageMatrix, textureMatrix, infoTexture);
				}, project);
			}
			project.loadBinaryFromFile(fullPath, completeFxn, project);
		}

		var fillTextureInFxn = function(packingView, imageMatrixView, imageMatrixTexture, infoTexture){
			var viewIndex = parseInt(packingView["v"]);
			var currentTexture = parseInt(infoTexture["id"]);
			// console.log(viewIndex,currentTexture);
			var ext = 0;
			for(var i=0; i<infoTriangles.length; ++i){
				var tri = infoTriangles[i];
				var tex = tri["t"];
				if(tex==currentTexture){
					var vs = tri["v"]; // view source list
					for(var j=0; j<vs.length; ++j){
						if(vs[j]["v"]===viewIndex){
							var sourcing = [ (tri["A"]["v"]==viewIndex), (tri["B"]["v"]==viewIndex), (tri["C"]["v"]==viewIndex) ];
							var A = tri["a"];
							var B = tri["b"];
							var C = tri["c"];
							var a = vs[j]["a"];
							var b = vs[j]["b"];
							var c = vs[j]["c"];
							A = new V2D(A["x"],A["y"]);
							B = new V2D(B["x"],B["y"]);
							C = new V2D(C["x"],C["y"]);
							a = new V2D(a["x"],a["y"]);
							b = new V2D(b["x"],b["y"]);
							c = new V2D(c["x"],c["y"]);
							var destinationTri2D = [A,B,C];
							var sourceTri2D = [a,b,c];
							R3D.textureAddSourceTriangles(imageMatrixTexture, destinationTri2D, imageMatrixView, sourceTri2D, sourcing);
							++ext;
						}
					}
				}
			}
			console.log("extract: "+ext);
			var textureFile = infoTexture["file"];
			var path = Code.appendToPath(textureDirectory, textureFile);
			var fullPath = Code.appendToPath(surfaceDirectory, path);
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(imageMatrixTexture.red(),imageMatrixTexture.grn(),imageMatrixTexture.blu(), imageMatrixTexture.width(),imageMatrixTexture.height());
var d = new DOImage(img);
// d.matrix().scale(0.50);
d.matrix().scale(1.0);
d.matrix().translate(0,0);
GLOBALSTAGE.addChild(d);
throw "before save updated texture";
*/
			var completedFxn = function(){
				console.log("saved updated texture to file: "+currentTextureIndex);
				++currentTextureIndex;
				applyTextureFxn(packingView, imageMatrixView);
			}
			var updatedImage = R3D.imageFromImageMatrix(imageMatrixTexture, stage, function(){
				// console.log(updatedImage);
				var imageBinary = Code.base64StringToBinary(updatedImage.src);
				// project.saveTriangleTextureFromFilename(filename, imageBinary, saveTextureComplete, project, null);
				project.saveFileFromBinary(imageBinary, fullPath, completedFxn, project);
			});
		}

		var initTexturesBlank = true;
		// var initTexturesBlank = false;
		if(initTexturesBlank){
			for(var i=0; i<infoTextures.length; ++i){
				var texture = infoTextures[i];
				var textureFile = texture["file"];
				var width = texture["width"];
				var height = texture["height"];
				var path = Code.appendToPath(textureDirectory, textureFile);
				var fullPath = Code.appendToPath(surfaceDirectory, path);
				// console.log(fullPath);
				if(!imageMatrix || imageMatrix.width()!=width || imageMatrix.height()!=height){
					imageMatrix = new ImageMat(width,height);
					imageMatrix.fill(colorBlank);
				}
				// SAVE IN PARALLEL
				var operation = function(imgMat, file){
					console.log("operation: "+file);
					var completedFxn = function(){
						++currentTextureCount;
						console.log("saved: "+currentTextureCount+" / "+expectedTextureCount);
						if(currentTextureCount==expectedTextureCount){
							packViewFxn();
						}
					};
					var image = R3D.imageFromImageMatrix(imgMat, GLOBALSTAGE, function(){
						// console.log(image);
						var imageBinary = Code.base64StringToBinary(image.src);
						project.saveFileFromBinary(imageBinary, file, completedFxn, project);
					});
				};
				operation(imageMatrix, fullPath);
			}
		}else{
			packViewFxn();
		}
		return;
	}

	project.loadDataFromFile(surfaceFilename, loadedSurfaceFxn);
}

App3DR.ProjectManager.prototype.generateBackgroundSphere = function(views,cameras, triangles){
	// console.log(views);
	// console.log(cameras);
	// console.log(triangles);
	// to useable
	var absolutes = [];
	var viewCenters = [];
	var viewNormals = [];
	for(var i=0; i<views.length; ++i){
		var transform = views[i]["R"];
		var extrinsic = Matrix.fromObject(transform);
		var absolute = Matrix.inverse(extrinsic);
		var center = absolute.multV3DtoV3D(new V3D(0,0,0));
		var normal = absolute.multV3DtoV3D(new V3D(0,0,1));
		normal.sub(center);
		absolutes[i] = absolute;
		viewCenters[i] = center;
		viewNormals[i] = normal;
		
	}
	var info = V3D.infoFromArray(viewCenters);
	console.log(info);

	var bgCenter = info["center"];
	var bgSize = info["size"];
	var bgRadius = Math.max(bgSize.x,bgSize.y,bgSize.z);
	console.log(bgRadius);
	bgRadius *= 1E9; // very far away

	if(!triangles){
		triangles = [];
	}

	// find center / extent of geometry
	var triSpace = new OctSpace(OctSpace.triToCuboid);
		triSpace.initWithObjects(triangles);
	console.log(triSpace);

	/*
		- find center / extent of geometry
		- create sphere centered at ideal location

		- for each sphere vertex:
			- find all views with point visible
				- direction
				- geometry intersect
		
		- for each vertex:
			- if no views visible: remove any contained triangles

	*/
	var radius = bgRadius;
	var subdivisions = 12;
	var offset = bgCenter;
	// var radius = 1;
	// var subdivisions = 5;
	// var offset = new V3D(0,0,0);
	var invertNormals = true;
	var sphere = Tri3D.generateTetrahedraSphere(radius, subdivisions, offset, invertNormals);
	console.log(sphere);

	return sphere["triangles"];
	// throw "generateBackgroundSphere";
}

App3DR.ProjectManager.sceneDataToDAE = function(triangleData){
	console.log("sceneDataToDAE");
	var triangles = triangleData["triangles"];
	var vertexes = triangleData["vertexes"];
	var textures = triangleData["textures"];
	var vertex3D = [];
	for(var i=0; i<vertexes.length; ++i){
		var v = vertexes[i];
		var p = new V3D(v["X"],v["Y"],v["Z"]);
		vertex3D.push(p);
	}
	var world = Formats3D.daeWorldNew();

	var images = [];
	var effects = [];
	var materials = [];
	var sizes = [];
	for(var i=0; i<textures.length; ++i){
		var tex = textures[i];
		var file = tex["file"];
		var width = tex["width"];
		var height = tex["height"];
		var size = new V2D(width,height);
		sizes.push(size);
		var image = Formats3D.daeWorldAddImage(world, file);
		images.push(image);
		var effect = Formats3D.daeWorldAddMaterialFromImage(world, image);
		effects.push(effect);
		var material = Formats3D.daeWorldAddInstanceFromMaterial(world, effect);
		materials.push(material);
	}
	var tris3D = Code.newArrayArrays(images.length);
	var tris2D = Code.newArrayArrays(images.length);
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = tri["A"]["i"];
		var B = tri["B"]["i"];
		var C = tri["C"]["i"];
		var a = tri["a"];
		var b = tri["b"];
		var c = tri["c"];
		var index = tri["t"];
			A = vertex3D[A];
			B = vertex3D[B];
			C = vertex3D[C];
			a = new V2D(a["x"],a["y"]);
			b = new V2D(b["x"],b["y"]);
			c = new V2D(c["x"],c["y"]);
		var size = sizes[index];
		a.x = a.x/size.x; a.y = 1 - (a.y/size.y);
		b.x = b.x/size.x; b.y = 1 - (b.y/size.y)
		c.x = c.x/size.x; c.y = 1 - (c.y/size.y)

		var t3D = new Tri3D(A,B,C);
		var t2D = new Tri2D(a,b,c);
		var tri3D = tris3D[index];
		var tri2D = tris2D[index];
		tri3D.push(t3D);
		tri2D.push(t2D);
	}

	var mesh = Formats3D.daeWorldAddMesh(world, tris3D, tris2D, materials);
	var object = Formats3D.daeWorldAddInstanceFromMesh(world, mesh, new Matrix3D().identity());
	var scene = Formats3D.daeWorldAddScene(world);
	Formats3D.daeWorldAddInstanceMeshToScene(world, scene, object);

	var xml = Formats3D.worldToDAE(world);
	console.log(xml);

}




App3DR.ProjectManager.prototype.setViewSimilarity = function(similarity){
	this._viewSimilarity = similarity;
}

App3DR.ProjectManager.prototype.hasViewSimilarity = function(){
	var viewCount = this._views.length;
	var expectedCount = (viewCount)*(viewCount-1)/2; // 0 = 0 | 1 = 0 | 2 = 1 | 3 = 3
		expectedCount = Math.max(expectedCount,0);
	var viewSimilarity = this._viewSimilarity;

	console.log(viewSimilarity,expectedCount);
	return viewSimilarity && viewSimilarity.length>viewCount;

	// console.log(viewSimilarity.length+" =?= "+expectedCount);
	return viewSimilarity && viewSimilarity.length === expectedCount;
}
// App3DR.ProjectManager.prototype.setPairPutative = function(putative){
// 	this._pairPutative = putative;
// }
// App3DR.ProjectManager.prototype.pairPutative = function(){
// 	return this._pairPutative;
// }
// App3DR.ProjectManager.prototype.hasPairPutative = function(){
// 	var hasViewSimilarity = this.hasViewSimilarity();
// 	if(!hasViewSimilarity){
// 		return false;
// 	}
// 	var pairPutative = this._pairPutative;
// 	if(!pairPutative){
// 		return false;
// 	}
// 	var viewSimilarity = this._viewSimilarity;
// 	if(viewSimilarity.length==0){
// 		return true;
// 	}
// 	return pairPutative.length >= 1;
// }
App3DR.ProjectManager.prototype.calculateFeatures = function(view){
	console.log("calculateFeatures");
	view.loadFeaturesImage(this._calculateFeaturesLoaded, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesLoaded = function(view){
	var image = view.featuresImage();
	var imageMatrix = R3D.imageMatrixFromImage(image, this._stage);
	var imageScales = new ImageMatScaled(imageMatrix);

	var nonMaximalPercent = 0.010; // 0.001
	var nonRepeatPercent = 0.005;
	var corners = R3D.optimalCountFeaturesFromImageScales(imageScales, nonMaximalPercent, nonRepeatPercent);
	console.log(corners);
	var features = R3D.colorGradientFeaturesFromPoints(corners,imageScales);
	console.log(features);


	var result = R3D.sequentialImageMatchingLexigramGenerate([imageScales]);
		var histograms = result["histograms"];
		var words = result["features"];
	var word = words[0];
	var histogram = histograms[0];

	// var normalizedWords = R3D.normalizeSIFTObjects(word, imageMatrix.width(), imageMatrix.height());
	// var normalizedWords = word;
	var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height()); // this drops contents
	


	var normalizedWords = R3D.normalizePointSizeObjects(word, imageMatrix.width(), imageMatrix.height()); 
	// normalizedWords = word;
	// var oW = 1.0/imageMatrix.width();
	// var oH = 1.0/imageMatrix.height();
	// for(var i=0; i<normalizedWords.length; ++i){
	// 	var w = normalizedWords[i];
	// 	var p = w["point"];
	// 	p.scale(oW, oH);
	// 	w["size"] = w["size"]*oW;
	// }

// these are the same now
console.log(word);
console.log(normalizedWords);
// throw "???";

console.log(features);
console.log(normalizedFeatures);

	var data = {};
		data["features"] = normalizedFeatures;
		data["flatHistogram"] = histogram;
		data["lexicon"] = normalizedWords;
	console.log(data);

var showDebug = true;

if(showDebug){
	console.log("SHOW FEATURES");
	var OFFX = 0;
	var OFFY = 0;
	var displaySize = new V2D(600,400);
	var maxScale = 10;
	var displayInfo = imageScales.getImageSize(displaySize, maxScale);
	var displayScale = displayInfo["scale"];
	var displayImage = displayInfo["image"];

	var image = displayImage
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
	var scaleRatioX = displayImage.width();
	var scaleRatioY = displayImage.height();
	for(var i=0; i<normalizedFeatures.length; ++i){
		var feature = normalizedFeatures[i];
		// console.log(feature);
			var p = feature["point"];
			var angle = feature["angle"];
			p = p.copy();
			p.x *= scaleRatioX;
			p.y *= scaleRatioY;
			var circleSize = feature["size"]*scaleRatioX;
				circleSize = Math.sqrt(circleSize);
			var d = new DO();
			d.graphics().setLine(2.0,0xFFFF00FF);
			d.graphics().beginPath();
			d.graphics().moveTo(0,0);
			d.graphics().lineTo(Math.cos(angle)*circleSize,Math.sin(angle)*circleSize);
			d.graphics().drawCircle(0,0, circleSize);
			d.graphics().endPath();
			// d.graphics().strokeLine();
			// d.graphics().setFill(0xFFFF00FF);
			// d.graphics().fill();
			d.graphics().strokeLine();
			d.matrix().translate(p.x, p.y);
			GLOBALSTAGE.addChild(d);
	}

	
	for(var i=0; i<normalizedWords.length; ++i){
		var feature = normalizedWords[i];
		// console.log(feature);
		var p = feature["point"];
			p = p.copy();
			p.x *= scaleRatioX;
			p.y *= scaleRatioY;
		// var angle = feature["angle"];
		var circleSize = feature["size"]*scaleRatioX;
			// circleSize = Math.sqrt(circleSize);
			var d = new DO();
			d.graphics().setLine(3.0,0xFF0000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(0,0, circleSize);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.graphics().setLine(1.0,0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(0,0, circleSize);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.matrix().translate(p.x, p.y);
			GLOBALSTAGE.addChild(d);
	}
}


// throw "SHOW FEATURES & LEXIGRAM:"
/*
	var sizes = [];
for(var i=0; i<features.length; ++i){
	var feature = features[i];
	var size = feature["size"];
	size = size/imageMatrix.size().length();
	sizes.push(size);
}
Code.printMatlabArray(sizes);
*/

	// throw "here"
	// var str = YAML.parse(data);
	// console.log(str);
// throw "here --- features"
	
/*
	var features = R3D.differentialCornersForImage(imageScales, new V2D(600,400));
	var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());
	console.log("FEATURES: "+normalizedFeatures.length);
	// 120x90 ~ 60  |  150x100 ~ 80-90  |  200x150 ~ 130-150
	// | 150x112 = 
	// var wordsMax = 150; // ~ 100
	// var words = R3D.differentialCornersForImage(imageScales, new V2D(120,90)); // 

	//

	// var idealSizeWords = new V2D(150,100);
	var idealSizeWords = new V2D(200,150);

	// 


var wordsMax = 999; // ~ 100
var words = R3D.differentialCornersForImage(imageScales, idealSizeWords); // 100x50 ~ 30   |   120x90 ~ 60 |  150x112 = 

	var normalizedWords = R3D.normalizeSIFTObjects(words, imageMatrix.width(), imageMatrix.height());
	console.log("WORDS: "+normalizedWords.length);

	// var histogramSamples = 10000; /// 1000 min .... 100x100 image = 10000
	// var info = R3D.imageHistogramSamples(imageMatrix, histogramSamples);


	var sampleDimension = 100; // ~ 100x100 = 1E4
	var samplePixelCount = sampleDimension*sampleDimension;
	var imagePixelCount = imageScales.width()*imageScales.height();
	var sampleImageScale = Math.sqrt(samplePixelCount/imagePixelCount);
console.log("sampleImageScale: "+sampleImageScale);
	var sampleMatrix = imageScales.getScaledImage(sampleImageScale,true);
console.log(sampleMatrix);
// throw "..."
	// 10x10x10 = MAXIMUM of 1000 entries -- more like 10-100
	var info = R3D.imageHistogramSamples(sampleMatrix);
	var normalizedHistogram = info["histogram"];
	console.log(normalizedHistogram);
// throw "???,,,,,,,,"
	var data = {};
	data["features"] = normalizedFeatures;
	data["words"] = normalizedWords;
	data["flatHistogram"] = normalizedHistogram;

	// extract actual objects to compare
	// var wordSize = 5; // 21 / 25
	// var wordSize = 7; // 37 / 49 - OK
	var wordSize = 9; // 69 / 81
	var wordColor = true;
	var normalizedLexicon = R3D.lexiconFromImageFeatures(normalizedWords, imageScales, wordSize, wordColor);
	console.log(normalizedLexicon);
	data["lexicon"] = normalizedLexicon; // words, vocabulary, glossary, lexicon
	console.log(data);

	// var str = YAML.parse(data);
	// console.log(str);
	// throw "this is the feature data:";

	console.log(features.length+" | "+normalizedWords.length+" | "+Code.keys(normalizedHistogram).length);
	R3D.showFeaturesForImage(imageMatrix, features);
	// throw "features - now save ...";
	*/

// 
// console.log(data);
//throw "is size & scale & rot ... saved too ?" -- these are SIFT BLOBS = no angle

	view.setFeatureData(data, this._calculateFeaturesComplete, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesComplete = function(view){
	console.log("_calculateFeaturesComplete");
	console.log(view);
	// this._taskBusy = false;
	// this.checkPerformNextTask();
	var project = this;
	project._taskDoneCheckReloadURL();
}
App3DR.ProjectManager.prototype.loadImageForView = function(view, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadImageForCamera = function(camera, filename, callback, context, object){
	console.log(camera);
console.log(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename)
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.id(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}


App3DR.ProjectManager.prototype.loadTriangleTextureFromFilename = function(filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_TEXTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.saveTriangleTextureFromFilename = function(filename, binary, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_TEXTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("SET", {"path":path, "data":binary}, callback, context, object);
}

App3DR.ProjectManager.prototype.removeAllTextures = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_TEXTURES_DIRECTORY);
	console.log("TEXTURE PATH: "+path);
	this.addOperation("DEL", {"path":path}, callback, context, object);
}





App3DR.ProjectManager.prototype.calculateViewSimilarities = function(){
	var project = this;
	var views = this._views;
	var expectedCount = views.length;
	var loadedCount = 0;
	var features = {};
	var histograms = {};
	var viewLookup = {};
	// go thru & load each view's features -- only keep histograms
	var fxnViewFeatureDataLoaded = function(v){
		var featureData = v.featureData();
		var histogram = featureData["flatHistogram"];
		var lexicon = featureData["lexicon"];
		// remove references to featureData to clear memory
		var viewID = v.id();
		v.featureData(null); // don't save
		features[viewID] = lexicon;
		histograms[viewID] = histogram;
		++loadedCount;
		if(loadedCount==expectedCount){
			console.log("completed loading ...");

			console.log(histograms);
			console.log(features);

			var viewIDs = Code.keys(histograms);
			var histogramArray = [];
			var featureArray = [];
			// var viewIDToIndex = {};
			// var viewIndexToID = {};
			for(var i=0; i<viewIDs.length; ++i){
				var viewID = viewIDs[i];
				histogramArray.push(histograms[viewID]);
				featureArray.push(features[viewID]);
				// viewIDToIndex[viewID] = i;
			}

			console.log(histogramArray);
			console.log(featureArray);
			var result = R3D.sequentialImageMatchingLexigramEvaluate(histogramArray, featureArray);
			console.log(result);
			var compareScores = result["matches"];

			// convert to score list
			var existsList = {};
			var scores = [];
			for(var i=0; i<compareScores.length; ++i){
				var item = compareScores[i];
				var indexA = item["A"];
				var indexB = item["B"];
				var value = item["value"];
				var idA = viewIDs[indexA];
				var idB = viewIDs[indexB];
				pairID = App3DR.ProjectManager.pairIDFromViewIDs(idA,idB);
				if(existsList[pairID]){
					console.log("already have pair: "+pairID);
					continue;
				}
				existsList[pairID] = true;
				// var score = Math.abs(i-index);
				obj = {};
				obj["A"] = idA;
				obj["B"] = idB;
				obj["s"] = value;
				obj["id"] = pairID;
				scores.push(obj);
			}
			scores.sort(function(a,b){
				return a["s"]<b["s"] ? -1 : 1; // smaller better
			});
			console.log(scores);

			project.showViewSimilarities(compareScores, viewIDs, 700);

throw "BEFORE SAVE SIMILARITIES - now go save similarities";
			project.setViewSimilarity(scores);
			project.setSparseFilename(null);
			//project.setPairPutative(null); // unset to recalculate
			project.saveProjectFile(fxnSavedProject, this);
		}
	}
	var fxnSavedProject = function(){
		console.log("fxnSavedProject - view similarities");
		project._taskDoneCheckReloadURL();
	}
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var id = view.id();
		viewLookup[id] = view;
		view.loadFeatureData(fxnViewFeatureDataLoaded, project);
	}
}
App3DR.ProjectManager.prototype.showViewSimilarities = function(similarities, viewIDList, displayRadius){
	var project = this;
	// load lower-res versions of all views
	var views = project._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	// var self = pr;
	var fxnViewImageLoaded = function(){
		++loadedViews;
		if(loadedViews==expectedViews){
			fxnShowSimilarity();
		}
	}
	for(var i=0; i<views.length; ++i){
		view = views[i];
		view.loadIconImage(fxnViewImageLoaded, project);
	}
	var fxnShowSimilarity = function(){
		var viewIDToIndex = {};
		for(var i=0; i<views.length; ++i){
			viewIDToIndex[viewIDList[i]] = i;
		}
		var imageScalesList = Code.newArrayNulls();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var viewID = view.id();
			var image = view.anyLoadedImage();
			var imageMatrix = R3D.imageMatrixFromImage(image, project._stage);
			var imageScales = new ImageMatScaled(imageMatrix);
			var index = viewIDToIndex[viewID];
			imageScalesList[index] = imageScales;
		}
		// var imageSize = Math.round(circleRadius*1.5*Math.PI/views.length);
		// var circleRadius = 50*views.length;
		
		console.log(imageScalesList);
		console.log(similarities);


		R3D.debugDisplaySimilarities(imageScalesList,similarities, displayRadius);
	}
}
App3DR.ProjectManager.prototype.showViewSimilaritiesOld = function(similarities){
	var project = this;
	// load lower-res versions of all views
	var views = project._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	// var self = pr;
	var fxnViewImageLoaded = function(){
		++loadedViews;
		if(loadedViews==expectedViews){
			fxnShowSimilarity(similarities);
		}
	}
	for(var i=0; i<views.length; ++i){
		view = views[i];
		view.loadIconImage(fxnViewImageLoaded, project);
	}
	var fxnShowSimilarity = function(similarities){
		var circleRadius = 700; // ~20
		// var circleRadius = 400; // ~10
		// var imageSize = 150;
		var images = [];
		var matrixes = [];
		var viewIDs = [];
		var viewIDToIndex = {};
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var viewID = view.id();
			var image = view.anyLoadedImage();
			viewIDToIndex[viewID] = i;
			viewIDs[i] = viewID;
			var matrix = R3D.imageMatrixFromImage(image, project._stage);
			// console.log(matrix);
			matrixes.push(matrix);
			images.push(image);
		}
		var imageSize = Math.round(circleRadius*1.5*Math.PI/views.length);
		
		// put images in circle
		var totalOffX = 100;
		var totalOffY = 50;
		var circleCenter = new V2D(totalOffX + circleRadius,totalOffY + circleRadius);
		var centers = [];
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = matrixes[i];

			var size = Code.sizeToFitInside(imageSize,imageSize, matrix.width(),matrix.height());
			var imageScale = (size.x/matrix.width() + size.y/matrix.height())*0.5;
			// console.log(imageScale);

			// var d = new DOImage(image);
			// var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
			var d = new DOImage(image);
			var angle = Math.PI * 2 * i/images.length;
			var offsetX = circleCenter.x + size.x*0.5 + circleRadius*Math.cos(angle);
			var offsetY = circleCenter.y + size.y*0.5 + circleRadius*Math.sin(angle);
			d.matrix().scale(imageScale);
			d.matrix().translate(offsetX - size.x*0.5, offsetY - size.y*0.5);
			GLOBALSTAGE.addChild(d);

			// var text = new DOText(""+viewIDs[i], 32, DOText.FONT_ARIAL, 0xFFCC0099, DOText.ALIGN_CENTER);
			// d.addChild(text);
			// text.matrix().translate(0,-10);
			// text.matrix().translate(p2D.x, p2D.y-20.0);
			// display.addChild(text);

			centers.push(new V2D(offsetX,offsetY));
		}
		// convert to list:
// console.log(similarities);

// similarities = Code.copyObject(similarities);


// pick top 10 similarities ...
var bestList = {};
// var cacheCount = 3;
// var cacheCount = 5;
var cacheCount = 10; // too many
for(var i=0; i<similarities.length; ++i){
	var similarity = similarities[i];
	var idA = similarity["A"];
	var idB = similarity["B"];
	var listA = bestList[idA];
	var listB = bestList[idB];
	if(!listA){
		listA = [];
		bestList[idA] = listA;
	}
	if(!listB){
		listB = [];
		bestList[idB] = listB;
	}
	var score = similarity["s"];
	listA.push(score);
	listB.push(score);
}

// var largerIsBetter = true;
var largerIsBetter = false;

var sortFxn = null;

if(largerIsBetter){// larger is better
	sortFxn = function(a,b){
		return a>b ? -1 : 1;
	}
}else{ // smaller is better
	sortFxn = function(a,b){
		return a<b ? -1 : 1;
	}
}
var keys = Code.keys(bestList);
for(var i=0; i<keys.length; ++i){
	var key = keys[i];
	// console.log(key);
	var list = bestList[key];
	list.sort(sortFxn);
	Code.truncateArray(list, cacheCount);
console.log(list);
	bestList[key] = list;
}

for(var i=0; i<similarities.length; ++i){
	var similarity = similarities[i];
	var idA = similarity["A"];
	var idB = similarity["B"];
	var listA = bestList[idA];
	var listB = bestList[idB];
	var valA = listA[listA.length-1];
	var valB = listB[listB.length-1];
	var max = Math.max(valA,valB);
	var min = Math.min(valA,valB);
	var score = similarity["s"];
	// console.log(score,max);
	if(largerIsBetter){
		if(score<min){
			Code.removeElementAt(similarities,i);
			--i;
		}
	}else{
		if(score>max){
			console.log(score+" > "+max);
			Code.removeElementAt(similarities,i);
			--i;
		}
	}
}

console.log(similarities);

		var sims2 = [];
		// var sims1 = Code.objectToArray(similarities);
		var floats = [];
		for(var i=0; i<similarities.length; ++i){
			var similarity = similarities[i];
			sims2.push( {"A":similarity["A"],"B":similarity["B"],"s":similarity["s"]} );
			floats.push(similarity["s"]);
		}
		// 
		ImageMat.normalFloat01(floats);
		// console.log(floats.length);
		// for(var i=0; i<similarities.length; ++i){
		// 	var similarity = similarities[i];
		// 	// sims2.push( {"A":similarity["A"],"B":similarity["B"],"s":similarity["s"]} );
		// 	// floats.push(similarity["s"]);
		// }
		// console.log("floats");
		// console.log(floats.length);
		// console.log(similarities.length);
		// console.log(floats);
		for(var i=0; i<sims2.length; ++i){
			var similarity = sims2[i];
			similarity["s"] = floats[i];
		}

		// show lines
		var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFF9999];
		for(var i=0; i<sims2.length; ++i){
			var similarity = sims2[i];
			var idA = similarity["A"];
			var idB = similarity["B"];
			var score = similarity["s"];
			// console.log(similarity);
			var indexA = viewIDToIndex[idA];
			var indexB = viewIDToIndex[idB];
			var start = centers[indexA];
			var ending = centers[indexB];
			var color = Code.interpolateColorGradientARGB(score, colors);
				var d = new DO();
				d.graphics().setLine(2.0,color);
				d.graphics().beginPath();
				d.graphics().moveTo(start.x,start.y);
				d.graphics().lineTo(ending.x,ending.y);
				d.graphics().endPath();
				d.graphics().strokeLine();
				GLOBALSTAGE.addChild(d);

		}

		// titles over:
		var textSize = 26;
		for(var i=0; i<centers.length; ++i){
			var center = centers[i];
			var title = ""+viewIDs[i];
			var textA = new DOText(title, textSize, DOText.FONT_ARIAL, 0xFF3366FF, DOText.ALIGN_CENTER);
			var textB = new DOText(title, textSize, DOText.FONT_ARIAL, 0xFF000033, DOText.ALIGN_CENTER);

				textA.matrix().translate(-1,-1);
				textB.matrix().translate(1,1);
			var textContainer = new DO();
				textContainer.addChild(textB);
				textContainer.addChild(textA);
				
			d.addChild(textContainer);
			var dir = V2D.sub(center,circleCenter);
			dir.length(textSize);
			textContainer.matrix().translate(center.x + dir.x, center.y + dir.y);
		}
	}
}
App3DR.ProjectManager.prototype.calculateDensePairPutatives = function(){
	console.log("calculateDensePairPutatives");
	var project = this;

	var sparseFilename = project.sparseFilename();
	console.log("sparseFilename: "+sparseFilename);
	var denseFilename = Code.appendToPath(App3DR.ProjectManager.BUNDLE_DENSE_DIRECTORY, App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME);
	console.log("denseFilename: "+denseFilename);
		project.setDenseFilename(denseFilename);



	var fxnLoadSparseComplete = function(data){
		console.log("fxnLoadSparseComplete");
		console.log(data);
		var sparseData = data;

		// get view cameras from sparse
		var sparseViews = sparseData["views"];
		var sparseViewIDToCameraID = {};
		for(var i=0; i<sparseViews.length; ++i){
			var view = sparseViews[i];
			var viewID = view["id"];
			var camID = view["camera"];
			sparseViewIDToCameraID[viewID] = camID;
		}

		var putativePairs = sparseData["putativePairs"];
		if(!putativePairs){
			throw "no sparse putativePairs";
		}
		var pairs = putativePairs["pairs"];
// console.log(pairs);
// throw "putativePairs"
		var views = putativePairs["views"];
		// convert views to lookup + transforms
		var cameras = sparseData["cameras"];
			cameras = cameras ? cameras : null;
		var camerasList = cameras;
		var viewLookup = {};
		var viewsList = [];
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var viewID = view["id"];
			var viewR = view["R"];
			var viewCamera = view["camera"];
			if(!viewCamera){
				viewCamera = sparseViewIDToCameraID[viewID];
			}
			if(!viewCamera){
				throw "missing camera";
			}
			var transform = Matrix.fromObject(viewR);
			var viewData = {"id":viewID, "transform":transform, "camera":viewCamera};
			viewLookup[viewID] = viewData;
			viewsList.push(viewData);
		}
		// convert to pair listing:
		var denseData = {};
		var densePairs = [];
		denseData["pairs"] = densePairs;
		denseData["views"] = viewsList;
		denseData["cameras"] = camerasList;
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var viewIDA = pair["A"];
			var viewIDB = pair["B"]
			// var pairError = pair["relativeError"];
			var extA = viewLookup[viewIDA]["transform"];
			var extB = viewLookup[viewIDB]["transform"];
			// var extrinsicAB = R3D.relativeTransformMatrix2(extA,extB);
			var extrinsicAB = Matrix.relativeWorld(extA,extB);
			// var relativeAB = Matrix.inverse(extrinsicAB);
			var pairID = App3DR.ProjectManager.pairIDFromViewIDs(viewIDA,viewIDB);
			var densePair = {};
				densePair["A"] = viewIDA;
				densePair["B"] = viewIDB;
				densePair["id"] = pairID;
				// densePair["errorR"] = pairError;
				densePair["relativeError"] = null;
				densePair["relativeTransform"] = extrinsicAB;
				densePair["matches"] = null;
				densePair["relative"] = null;
				densePair["tracks"] = null;
			densePairs.push(densePair);
		}
		console.log(denseData);
		// throw "before save dense start";
		project.saveFileFromData(denseData, denseFilename, fxnSaveDenseComplete, project);
	}
	var fxnSaveDenseComplete = function(data){
		console.log("fxnSaveDenseComplete");
		project.saveProjectFile(fxnSaveProjectComplete, project);
	}
	var fxnSaveProjectComplete = function(data){
		console.log("fxnSaveProjectComplete");
		project._taskDoneCheckReloadURL();
	}
	
	project.loadDataFromFile(sparseFilename, fxnLoadSparseComplete, project);
}

App3DR.ProjectManager.prototype.calculatePairPutatives = function(){
	console.log("calculatePairPutatives");
	var project = this;
	var views = this._views;
	var cameras = this._cameras;
	var viewCount = views.length;
	var similarity = this._viewSimilarity;

	
	var cappedMinimumPairCount = 3; // need at least 2 + 1 other views to try + error (~2) 3->4 -- for very similar scenes
	var cappedMaximumPairCount = 10; // 3 + 100^0.5 => 10
	// keep all, already found in similarity extimation
	cappedMinimumPairCount = 999;
	cappedMaximumPairCount = 999;


	var minimumPairCount = cappedMinimumPairCount;
	// 4  -> 4
	// 9  -> 5
	// 16 -> 6
	// 25 -> 7
	// 36 -> 8
	// 49 -> 9
	// 64 -> 10
	var maximumPairCount = 2 + Math.ceil(Math.sqrt(viewCount));
		maximumPairCount = Math.min(Math.max(maximumPairCount, cappedMinimumPairCount), cappedMaximumPairCount);
	console.log("VIEWS: "+viewCount+" | RANGE: "+minimumPairCount+" : "+maximumPairCount);
	var sortScoresFxn = function(a,b){
		a = a["s"];
		b = b["s"];
		// return a<b ? 1 : -1; // NCC - larger better
		return a<b ? -1 : 1; // SAD - smaller better
	}
	var pairIDFxn = function(a,b){
		if(a<b){
			return a+"-"+b;
		}
		return b+"-"+a;
	}
	

	var putative = [];
	// create list for each view
	var viewListLookup = {};
	var viewLookup = {};
	for(var i=0; i<viewCount; ++i){
		var view = views[i];
		var vid = view.id();
		viewListLookup[vid] = [];
		viewLookup[vid] = view;
	}
	// add entries to each view's array
	for(var i=0; i<similarity.length; ++i){
		var entry = similarity[i];
		var idA = entry["A"];
		var idB = entry["B"];
		viewListLookup[idA].push(entry);
		viewListLookup[idB].push(entry);
	}
	// console.log(viewListLookup);
// throw "?"
	// sort entries & find highest derivatives & add entries
// var str = "";
	var keepPairs = {};
	var minCheckIndex = 1;
	for(var i=0; i<viewCount; ++i){
		var view = views[i];
		var vid = view.id();
		var list = viewListLookup[vid];
		list.sort(sortScoresFxn);
		var ds = [];
		var maxIndex = 0;
		var maxDiff = null;
		var prev = null;
// var arr = [];
		for(var j=0; j<list.length; ++j){
			var entry = list[j];
			var next = entry["s"];
// arr.push(next);
			if(j>=minCheckIndex){
				var diff = prev-next;
				// console.log(diff+" : "+prev+"-"+next);
				// diff = Math.abs(diff);
				if(maxDiff===null || diff>=maxDiff){
					maxDiff = diff;
					maxIndex = j;
				}
			}
			prev = next;
		}
// str += Code.printMatlabArray(arr,"x"+i,true)+"\n";
		maxIndex = Math.min(Math.max(maxIndex,minimumPairCount-1),maximumPairCount-1);
		maxIndex = Math.min(maxIndex,list.length-1);
		console.log("KEEP: "+maxIndex);
		for(var j=0; j<=maxIndex; ++j){
			var entry = list[j];
			var idA = entry["A"];
			var idB = entry["B"];
			var pairID = pairIDFxn(idA,idB);
// console.log(j+" = "+pairID+" / "+list.length);
			keepPairs[pairID] = entry;
		}
	}
	// console.log("\n"+str+"\n");
	// convert keep pairs to list of pairs

	var keepViewIDTable = {};
	var keys = Code.keys(keepPairs);
console.log("keep: "+keys.length);
	for(var k=0; k<keys.length; ++k){
		var key = keys[k];
		var entry = keepPairs[key];
		var idA = entry["A"];
		var idB = entry["B"];
		putative.push({"A":idA, "B":idB});
		keepViewIDTable[idA] = true;
		keepViewIDTable[idB] = true;
	}
	console.log(putative);
	
	var filename = Code.appendToPath(App3DR.ProjectManager.BUNDLE_SPARSE_DIRECTORY, App3DR.ProjectManager.BUNDLE_SPARSE_FILE_NAME);
	console.log("filename: "+filename);
	project.setSparseFilename(filename);

	// only keep relevant views:
	var sparseViews = [];
	var keepCameraIDTable = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		// console.log(view);
		var viewID = view.id();
		if(keepViewIDTable[viewID]){
			var camID = view.cameraID();
			// console.log(camID);
			var v = {"id":viewID,"camera":camID};
			sparseViews.push(v);			
			keepCameraIDTable[camID] = true;
		}
	}

	var sparseCameras = [];
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var cameraID = camera.id();
		if(keepCameraIDTable[cameraID]){
			var K = camera.K();
			var distortion = camera.distortion();
			if(K["fx"]){
				var fx = K["fx"];
				var fy = K["fy"];
				var s = K["s"];
				var cx = K["cx"];
				var cy = K["cy"];
				K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
				K = K.toObject();
			}
			var cam = {"id":cameraID, "K":K, "distortion":distortion};
			sparseCameras.push(cam);
		}
	}
	
	// var sparseFile = project.sparseFilename();
	var sparseData = App3DR.ProjectManager.defaultSparseFile();
		sparseData["pairs"] = putative;
		sparseData["cameras"] = sparseCameras;
		sparseData["views"] = sparseViews;

	var fxnSavedProject = function(){
		console.log("fxnSavedProject - pair putatives");
		project._taskDoneCheckReloadURL();
	}
	var fxnSavedSparse = function(){
		console.log("fxnSavedSparse");
// throw "BEFORE SAVE PROJECT BEST PAIRS";
		project.saveProjectFile(fxnSavedProject, project);
	}
console.log(sparseData);
throw "BEFORE SAVE SPARSE"
	project.saveSparseFromData(sparseData, fxnSavedSparse, project);
	
}
// App3DR.ProjectManager.defaultPairSummary = function(A,B){
// 	var sparse = {};
// 		sparse["A"] = A;
// 		sparse["B"] = B;
// 		sparse["matches"] = null;
// 		sparse["F"] = null;
// 		sparse["R"] = null;		
// 	return sparse;
// }
App3DR.ProjectManager.defaultPairFile = function(A,B){ // 
	var sparse = {};
		sparse["A"] = A;
		sparse["B"] = B;
		sparse["matches"] = null;
		// sparse["F"] = null;
		// sparse["errorFMean"] = null;
		// sparse["errorFSigma"] = null;
		sparse["relative"] = null;
		// sparse["R"] = null;
		// sparse["errorRMean"] = null;
		// sparse["errorRSigma"] = null;
		sparse["tracks"] = null;
	return sparse;
}
App3DR.ProjectManager.defaultSparseFile = function(){ // summary
	var sparse = {};
		sparse["pairs"] = null;
		sparse["triples"] = null;
		sparse["graph"] = null;
		sparse["tracks"] = null;
		sparse["trackCount"] = null;
		sparse["bundle"] = null;
	return sparse;
}
App3DR.ProjectManager.defaultTrackFile = function(){ // summary
	var tracks = {};
		tracks["views"] = null; // to be filled with absolute orientations
		tracks["pairs"] = null; // necessary?
		tracks["points"] = null;
	return tracks;
}
/*

pairs:
	- 
		A: "IDA"
		B: "IDB"
		matchCount: 123
		------ 
		relativeCount: 12345
		errorFMean: ...
		errorFSigma: ...
		errorRMean: ...
		errorRSigma: ...
		F:
			literal
		R:
			literal

triples:
	- 
		A: ...
		B: ...
		C: ...
		gauge:
			AB: 1
			AC: 2.2926041185045607
			BC: 1.4194364449299415
		errorTMean: 0.0036644097133031435
		errorTSigma: 491454705.3110066
		T:
			literal
graph:
	skeleton:
		- 
			A: 
			B:
			R:
			errorR: 
	groups:
		?

tracks: tracks.yaml
trackCount: 123456

bundle:
	-
		id:
		R:

points : pointfile.yaml



	does a sparse file exist? [sparseFile != null]
	no > init it with a putative set

does sparse file have all pairs? [triple exists]
	no > iterate putative list
		- get a F
		- errorF
		- f count
		- get a R
		- errorR
		- r count
		- track count

does sparse file have graph? [sparse graph exists]
	no > generate graph from tripes

does sparse file have track BA file [?]
	no > assemble points into sparse . bundle

is BA groups / final done? [?]
	no > iterate on BA

*/

App3DR.ProjectManager.prototype.calculatePairMatch = function(viewA, viewB, pair, callback, context, object){
	console.log("calculatePairMatch");
	// ...
	var featuresA = null;
	var featuresB = null;
	var imageA = null;
	var imageB = null;
	var stage = this._stage;
	var self = this;
	var matchCount = null;
	var fxnA = function(){ // load features A
		viewA.loadFeatures(function(){
			featuresA = viewA.features();
			fxnReadyCheck();
		}, self);
	}
	var fxnB = function(v){ // load features B
		viewB.loadFeatures(function(){
			featuresB = viewB.features();
			fxnReadyCheck();
		}, self);
	}
	var fxnC = function(){ // load matching Image A
		viewA.loadMatchingImage(function(){
			imageA = viewA.matchingImage();
			fxnReadyCheck();
		}, self);
	}
	var fxnD = function(){// load matching Image B
		viewB.loadMatchingImage(function(){
			imageB = viewB.matchingImage();
			fxnReadyCheck();
		}, self);
	}

	var fxnReadyCheck = function(){
		if(!(featuresA && featuresB && imageA && imageB)){
			return;
		}
		console.log("GO");
		var imageAWidth = imageA.width;
		var imageAHeight = imageA.height;
		var imageBWidth = imageB.width;
		var imageBHeight = imageB.height;
		console.log("A: "+featuresA.length+" | "+featuresB.length)
		featuresA = R3D.denormalizeSIFTObjects(featuresA, imageAWidth, imageAHeight);
		featuresB = R3D.denormalizeSIFTObjects(featuresB, imageBWidth, imageBHeight);
		console.log(featuresA);
		console.log(featuresB);
GLOBALDISPLAY = GLOBALSTAGE;
		var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
		var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
		// TO SIFT OBJECTS
		var maxFeatures = 2000;
		var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);
		var objectsB = R3D.generateProgressiveSIFTObjects(featuresB, imageMatrixB);
		var maxFeaturesCompare = 2000;
		// MEDIUM
		var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
		var pointsA = result["A"];
		var pointsB = result["B"];
		var F = result["F"];
		var Finv = result["Finv"];
		// DENSE:
		console.log("SKIPPING DENSE ...");




throw "HERE";
/*
		var result = R3D.arbitraryAffineMatches(imageMatrixA,imageMatrixB, F,Finv, pointsA,pointsB);
		console.log(result);
			F = result["F"];
			Finv = result["Finv"];
			pointsA = result["A"];
			pointsB = result["B"];
*/
		if(!F || !pointsA || pointsA.length==0){
			matches = [];
			F = null;
			sigma = 0;
		}else{
			var fSampleCount = 200;
			var result = Code.randomSampleRepeatsParallelArrays([pointsA,pointsB], fSampleCount);
			var ptsA = result[0];
			var ptsB = result[1];
			var info = R3D.fErrorList(F, Finv, ptsA, ptsB);
			console.log(info);
			var F = info["F"];
			var mean = info["mean"];
			var sigma = info["sigma"];
			sigma = mean + sigma*1.0;
			console.log("sigma: "+sigma);
			// add affine info:
			// R3D.stereoMatchAverageAffine(imageMatrixA,imageMatrixB,matches);
			// convert to R3D formats
			console.log(pointsA);
			console.log(pointsB);
			var matches = R3D.separatePointArraysToMatchArray(pointsA,pointsB);
			console.log(matches);
			matches = R3D.stereoToMatchPairArray(imageMatrixA,imageMatrixB,matches);
		}
		console.log(matches);
		matchCount = matches.length;
		var str = self._matchesToYAML(matches, F, viewA, viewB, imageMatrixA, imageMatrixB);
		var binary = Code.stringToBinary(str);
		yamlBinary = binary;
		console.log("HAVE PAIR? "+(pair!==null));
// throw "here ..."
		if(pair){
			fxnG(pair);
		}else{
			self.addPair(viewA, viewB, fxnG, self);
		}

	}
	var yamlBinary = null;
	console.log("saving matches");
	var fxnG = function(pair){
		var path = Code.appendToPath(self._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME);
		pair.setMatchFeatureCount(matchCount);
		self.addOperation("SET", {"path":path, "data":yamlBinary}, fxnH, self, pair);
	}
	var fxnH = function(object, data){
throw "before save";
		console.log("saving matches to project");
		self.saveProjectFile(); // TODO: add completion here
		return;
		// return to checking
		// self.startBackgroundTasks();
		// this.checkPerformNextTask();
	}
	fxnA();
	fxnB();
	fxnC();
	fxnD();
}

App3DR.ProjectManager.prototype.calculateTripleMatch = function(viewA, viewB, viewC, triple, callback, context, object){
	console.log("calculateTripleMatch");
	if(viewA && viewB && viewC){
		var imageA = null;
		var imageB = null;
		var imageC = null;
		var stage = this._stage;
		var self = this;
		var views = self.views();
		var pair1 = self.pair(viewA.id(),viewB.id());
		var pair2 = self.pair(viewA.id(),viewC.id());
		var pair3 = self.pair(viewB.id(),viewC.id());
		if(pair1 && pair2 && pair3){
			var yamlBinary = null;
			var matchCount = null;
			var matchAB, matchAC, matchBC;
			var fxnA = function(){
				viewA.loadFeaturesImage(fxnB, self);
			}
			var fxnB = function(){
				viewB.loadFeaturesImage(fxnC, self);
			}
			var fxnC = function(){
				viewC.loadFeaturesImage(fxnD, self);
			}
			var fxnD = function(){
				// pair1.loadMatchingData(fxnD, self);
				pair1.loadRelativeData(fxnE, self);
			}
			var fxnE = function(){
				// pair2.loadMatchingData(fxnF, self);
				pair2.loadRelativeData(fxnF, self);
			}
			var fxnF = function(){
				// pair3.loadMatchingData(fxnX, self);
				pair3.loadRelativeData(fxnX, self);
				// fxnX();
			}
			var fxnX = function(){
				// TODO: if it turns out views down have enough (or any) overlap -- skip ?
				console.log("LOADED ALL DATA");
				var imageA = viewA.featuresImage();
				var imageB = viewB.featuresImage();
				var imageC = viewC.featuresImage();

				var stage = self._stage;
				var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
				var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
				var imageMatrixC = R3D.imageMatrixFromImage(imageC, stage);

				var matchAB = pair1.relativeData();
				var matchAC = pair2.relativeData();
				var matchBC = pair3.relativeData();
				console.log(matchAB);

				// console.log(viewA.id()+" - "+viewB.id()+" - "+viewC.id());


				var result = App3DR.tripleInfo(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC);
				// viewA.id(),viewB.id(),viewC.id()
				console.log(result);

				/*
					need 3D points w 2d location

				*/



				/*
				var tripleInfo = R3D.triplePointMatches(matchAB,matchAC,matchBC, imageMatrixA,imageMatrixB,imageMatrixC);
				console.log(tripleInfo);
				// TODO: trifocal tensor from best point matches
				// 6 point alg
				// ransac
				// final inliers
				var scores = tripleInfo["scores"];
				matchCount = scores.length;

				var str = self._tripleMatchesToYAML(tripleInfo, viewA, viewB, viewC, imageMatrixA, imageMatrixB, imageMatrixC);
				var binary = Code.stringToBinary(str);
				yamlBinary = binary;
				var triple = null;

				if(triple){
					fxnY(triple);
				}else{
					self.addTriple(viewA,viewB,viewC, fxnY, this);
				}
				*/
			}
			/*
			var fxnY = function(triple){
				console.log("save triple data");
				return;
				var path = Code.appendToPath(self._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME);
				console.log("path: "+path+"");
				triple.setMatchFeatureCount(matchCount);
				self.addOperation("SET", {"path":path, "data":yamlBinary}, fxnZ, self, triple);
			}
			var fxnZ = function(triple){
				console.log("saved triple");
				manager.saveProjectFile();
				this.checkPerformNextTask();
			}
			*/
			fxnA();
		}
	}
}
App3DR.tripleInfo = function(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC){
	var world = new Stereopsis.World();
	world.checkForIntersections(false);
	// console.log(viewA);
	// console.log(matchAB);
	var imageSizeA = imageMatrixA.size();


	var WORLDCAMS = [];
	var WORLDVIEWS = [];

	var camera = matchAB["cameras"][0];
	console.log(camera);
	var K = camera["K"];
		K = Matrix.loadFromObject(K);
		// K = R3D.cameraFromScaledImageSize(K, imageSizeA);
	console.log(K);
	var distortion = null;
	var c = world.addCamera(K, distortion);
	console.log(c);
	// c.data(camera.id()+"");
	// camera.temp(c);
	WORLDCAMS.push(c);

	var views = [viewA,viewB,viewC];
	var images = [imageMatrixA,imageMatrixB,imageMatrixC];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var matrix = images[i];
		var cam = WORLDCAMS[0];

		var K = cam.K();
		var distortion = cam.distortion();
		var v = world.addView(matrix, cam);
		// v.absoluteTransform(transform);
		view.temp(v);
		v.data(view.id());
		WORLDVIEWS.push(v);
	}

	var vA = WORLDVIEWS[0];
	var vB = WORLDVIEWS[1];
	var vC = WORLDVIEWS[2];

	// quick world-view lookup
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
	    var v = WORLDVIEWS[i];
	    WORLDVIEWSLOOKUP[v.data()] = v;
	}


	// TEMPS
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();

	// points for match AB
	var matches = [];

		// matches.push([vA,vB, matchAB["points"]]);
		// matches.push([vA,vC, matchAC["points"]]);

		// matches.push([vA,vB, matchAB["points"]]);
		// matches.push([vB,vC, matchBC["points"]]);

		matches.push([vA,vC, matchAC["points"]]);
		matches.push([vB,vC, matchBC["points"]]);

	var pointCountAdded = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// var vA = match[0];
		// var vB = match[1];
		var points = match[2];
		for(var p=0; p<points.length; ++p){
			var point = points[p];
			var point3D = new V3D(point["X"],point["Y"],point["Z"]);
			var pointViews = point["views"];

			for(var j=0; j<pointViews.length; ++j){
				var viewJ = pointViews[j];
				var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
				for(var k=j+1; k<pointViews.length; ++k){
					var viewK = pointViews[k];
					var vK = WORLDVIEWSLOOKUP[viewK["view"]];
					var fr = new V2D(viewJ["x"],viewJ["y"]);
					var to = new V2D(viewK["x"],viewK["y"]);
					x1.set(viewJ["Xx"],viewJ["Xy"]);
					y1.set(viewJ["Yx"],viewJ["Yy"]);
					x2.set(viewK["Xx"],viewK["Xy"]);
					y2.set(viewK["Yx"],viewK["Yy"]);
					// to image plane
					var sizeFr = vJ.size();
					var sizeTo = vK.size();
					fr.scale(sizeFr.x,sizeFr.y);
					to.scale(sizeTo.x,sizeTo.y);
					var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
					// add
					world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
					pointCountAdded++;
				}
			}
// if(pointCountAdded>1000){
// 	break;
// }
		}
	}
	console.log("pointCountAdded: "+pointCountAdded);

	world.printPoint3DTrackCount();


	var completeFxn = function(){
		console.log("completeFxn");
	}
	world.solveTriple(completeFxn, null);

	var result = {};
	return result;
}

App3DR.ProjectManager.prototype.createDefaultCamera = function(){
	var project = this;
	var camID = App3DR.ProjectManager._randomID();
	var camera = new App3DR.ProjectManager.Camera(project, "Default Camera", camID);
		// var K = new Matrix(3,3).fromArray([1.0, 0.0, 0.5,  0.0, 1.0, 0.5,  0.0, 0.0, 1.0]);
	// camera.K(K);
	camera.setK(1.0,1.0, 0.0, 0.5,0.5); //setK
	camera.setDistortion(0,0,0, 0,0);
	camera.setCalculatedCount(-1);
	this._cameras.push(camera);
	project.saveProjectFile(function(){
		console.log("SAVED PROJECT FILE");
	});
	// self.saveProjectFile(fxnSavedProjectComplete, project);
}

App3DR.ProjectManager.prototype.calculateCameraCheckerboard = function(camera, callback, context, object){
	console.log("calculateCameraCheckerboard");
	var image = camera.needsDetectionImage();
	console.log(image);
console.log("needsDetectionImage");
	var self = this;
	var fxnA = function(img){
		console.log("LOADED IMAGE");
		var img = image.calibrationImage();
		var stage = self._stage;
		var imageMatrix = R3D.imageMatrixFromImage(img, stage);
		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();
// console.log(imageWidth,imageHeight);		
// console.log("CALIB IMAGE");
// throw "..."
		var pointMatches = R3D.detectCheckerboard(imageMatrix, 10,10, true);
console.log(pointMatches);
// return;
		var points2D = [];
		var points3D = [];
var totalCount = 81;
		if(pointMatches){
			console.log(pointMatches);
			points2D = pointMatches["points2D"];
			points3D = pointMatches["points3D"];
		}
if(points2D.length!=totalCount){
	throw "wrong count: "+points2D.length+"!="+totalCount;
}
		for(var i=0; i<points2D.length; ++i){
			points2D[i].scale(1.0/imageWidth, 1.0/imageHeight);
		}
// throw "skipped save";
		image.setCheckerboardMatches(points2D,points3D, fxnB, self);
	}
	var fxnB = function(){
		console.log("SAVED TO FILE");
		self.saveProjectFile();
	}
	image.loadCalibrationImage(fxnA, this);
}
App3DR.ProjectManager.prototype.calculateCameraParameters = function(camera, callback, context, object){
	console.log("calculateCameraParameters");
	var i;
	var expectedCount = 0;
	var callbackCount = 0;
	var calibrationImages = camera.images();
	var self = this;
	var project = this;
	var fxnA = function(){
		++callbackCount;
		if(callbackCount==expectedCount){
			var pointList2D = [];
			var pointList3D = [];
			for(var i=0; i<calibrationImages.length; ++i){
				var calibrationImage = calibrationImages[i];
				//console.log(calibrationImage);
				var aspect = calibrationImage.aspectRatio();
				var width = 1.0;
				var height = width/aspect;
				console.log(width+"x"+height)
				var calibrationData = calibrationImage.calibrationData();
				if(Code.isArray(calibrationData)){
					calibrationData = calibrationData[0];
				}
				var matches = calibrationData["matches"];
				var points2D = [];
				var points3D = [];
				for(var j=0; j<matches.length; ++j){
					var match = matches[j];
					var point2D = new V2D(match["x"],match["y"]);
					var point3D = new V3D(match["X"],match["Y"],match["Z"]);
					points2D.push(point2D);
					points3D.push(point3D);
					if(j==0){
						console.log(point2D+"");
						console.log(point3D+"");
					}
				}
				pointList2D.push(points2D); // in [0,1], [0,h/w]
				pointList3D.push(points3D);
			}
			console.log(pointList2D)
			console.log(pointList3D)
			// pointList2D are aspect-ratioed points to fill [0,0]->[wid,h2w], eg: [0,0]->[1,0.75]
			var result = R3D.calibrateCameraK(pointList3D,pointList2D);
			console.log(result);
			var distortion = result["distortion"];
			var K = result["K"];
			var fx = K.get(0,0);
			var s = K.get(0,1);
			var cx = K.get(0,2);
			var fy = K.get(1,1);
			var cy = K.get(1,2);
			var k0 = distortion["k0"];
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var p0 = distortion["p0"];
			var p1 = distortion["p1"];
			camera.setK(fx,fy,s,cx,cy);
			camera.setDistortion(k0,k1,k2,p0,p1);
			camera.setCalculatedCount(calibrationImages.length);
// throw "NOW SAVE AFTER CALIBRATE";
			self.saveProjectFile(fxnSavedProjectComplete, project);
		}
	}
	var fxnSavedProjectComplete = function(){
		// this.checkPerformNextTask();
	}
	for(i=0; i<calibrationImages.length; ++i){
		var calibrationImage = calibrationImages[i];
		console.log(calibrationImage);
		++expectedCount;
	}
	// do loading
	for(i=0; i<calibrationImages.length; ++i){
		var calibrationImage = calibrationImages[i];
		calibrationImage.loadCalibratationData(fxnA, this);
	}

}


App3DR.ProjectManager.prototype.calculateGlobalOrientationInit = function(callback, context, object){
	console.log("calculateGlobalOrientationInit");



	throw "TO USE: optimumTransform3DFromObjectLookup";

	// helpers
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var viewIDsToPairID = function(iA,iB){
		return minimumStringFirst(iA,iB);
	}
	var setOrFlip = function(table,iA,iB,scale, error){
		var key = viewIDsToPairID(iA,iB);
		var edge = table[key];
		if(edge["A"]==iA && edge["B"]==iB){
			edge["list"].push([scale,error]);
		}else if(edge["A"]==iB && edge["B"]==iA){
			edge["list"].push([1.0/scale,error]);
		}else{
			throw "?";
		}
	}
	// EDGE: A: PAIR ID | B: PAIR ID | LIST: ERROR LIST
		//
	// ...

	// ...

	// ...


	// locals
	var views = this._views;
	var pairs = this._pairs;
	var triples = this._triples;
	var viewCount = views.length;
	var edgesTranslate = [];
	var edgesRotate = [];
	// A-B pair lists (transforms and errors): each is of length i-1
	var tableViewIDToIndex = {};
	var tableViewIndexToID = {};
	for(var i=0; i<viewCount; ++i){
		var view = views[i];
		tableViewIDToIndex[view.id()+""] = i;
		tableViewIndexToID[i+""] = view.id();
console.log(view.id()+" = "+i);
	}
	//
	var edges = [];
	var tableViewPairToEdge = {};
	var tableViewPairToPair = {};
	var tablePairIDToIndex = {};
	var tablePairIndexToID = {};
	for(var i=0; i<pairs.length; ++i){
		var pairA = pairs[i];
		var idA = pairA.viewA().id();
		var idB = pairA.viewB().id();
		var nodeA = viewIDsToPairID(idA,idB);
		tablePairIDToIndex[nodeA] = i;
		tablePairIndexToID[i+""] = nodeA;
		tableViewPairToPair[nodeA] = pairA;
		for(var j=i+1; j<pairs.length; ++j){
			var pairB = pairs[j];
			var idC = pairB.viewA().id();
			var idD = pairB.viewB().id();
			var nodeB = viewIDsToPairID(idC,idD);
			var index = viewIDsToPairID(nodeA,nodeB);
			// console.log(" INDEX ... "+index);
			var edge = {"A":nodeA, "B":nodeB, "list":[], "pairA":pairA,"pairB":pairB};
			edges.push(edge); // directional
			tableViewPairToEdge[index] = edge;
		}
// console.log(nodeA+" = "+i);
	}

	// go thru all triples and get all possible edges for each pair
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var viewA = triple.viewA();
		var viewB = triple.viewB();
		var viewC = triple.viewC();
		var idA = viewA.id();
		var idB = viewB.id();
		var idC = viewC.id();
		var relativeCount = triple.relativeCount();
		// console.log(triple.relativeScales())
		if(relativeCount && relativeCount>0){
			var pairAB = this.pairFromViewIDs(idA,idB);
			var pairAC = this.pairFromViewIDs(idA,idC);
			var pairBC = this.pairFromViewIDs(idB,idC);
			var scales = triple.relativeScales();
			var idAB = viewIDsToPairID(idA,idB);
			var idAC = viewIDsToPairID(idA,idC);
			var idBC = viewIDsToPairID(idB,idC);
			var errorAB = pairAB.errorRMean() + pairAB.errorRSigma();
			var errorAC = pairAC.errorRMean() + pairAC.errorRSigma();
			var errorBC = pairBC.errorRMean() + pairBC.errorRSigma();

			var scaleAB = scales["AB"];
			var scaleAC = scales["AC"];
			var scaleBC = scales["BC"];

			// console.log(" "+i+" : "+scaleAB+" | "+scaleAC+" | "+scaleBC+" | "+" - "+idAB+" - "+idAC+" - "+idBC);
			if(scaleAB>0 && scaleAC>0){
				var scaleABtoAC = scaleAC/scaleAB;
				setOrFlip(tableViewPairToEdge,idAB,idAC,scaleABtoAC,errorAB+errorAC);
			}
			if(scaleAC>0 && scaleBC>0){
				var scaleACtoBC = scaleBC/scaleAC;
				setOrFlip(tableViewPairToEdge,idAC,idBC,scaleACtoBC,errorAC+errorBC);
			}
			if(scaleAB>0 && scaleBC>0){
				var scaleBCtoAB = scaleAB/scaleBC;
				setOrFlip(tableViewPairToEdge,idBC,idAB,scaleBCtoAB,errorBC+errorAB);
			}
		}
	}
	// combine every conflicting edge into single edge using error ratios
// shouldn't ever be conflicting edges ?
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var list = edge["list"];
		var values = [];
		var errors = [];
		if(list.length>0){
			if(list.length>1){
				throw "ONLY EVER AT MOST 1 EDGE BETWEEN VIEW-PAIRS"
			}
			for(var j=0; j<list.length; ++j){
				var e = list[j];
				values.push(e[0]);
				errors.push(e[1]);
			}
			var percents = Code.errorsToPercents(errors);
			var error = percents["error"];
				percents = percents["percents"];
			var value = Code.averageNumbers(values, percents);
			edge["value"] = value;
			edge["error"] = error;
		}
	}

	var subgraphEdges = [];
	var subgraphEdgeLookup = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var idA = edge["A"];
		var idB = edge["B"];
		var list = edge["list"]
		if(list && list.length>0){
			idA = tablePairIDToIndex[idA];
			idB = tablePairIDToIndex[idB];
			subgraphEdges.push([idA,idB]);
			subgraphEdgeLookup.push(i);
		}
	}
	// find largest subgraph of connected pairs
	var viewCount = views.length;
	console.log(subgraphEdges);
	console.log(viewCount);
	var result = R3D.bestConnectedViewSubgraph(subgraphEdges, viewCount);
	var bestPairs = result["pairs"];
	var bestViews = result["views"];
	var bestEdges = result["edges"];
console.log("SUBGRAPH:");
console.log(bestPairs);
console.log(bestViews);
console.log(bestEdges);
	var includedPairs = [];
	var includedViews = [];
	var includedPairEdges = [];
	// grab all edges that are included pairs
	for(var i=0; i<bestEdges.length; ++i){
		var edgeIndex = bestEdges[i];
		var allEdgeIndex = subgraphEdgeLookup[edgeIndex];
		edge = edges[allEdgeIndex];
		includedPairEdges.push(edge);
		// pair
		var pairsX = subgraphEdges[edgeIndex];
		var indexA = pairsX[0];
		var indexB = pairsX[1];
			indexA = tablePairIndexToID[indexA+""];
			indexB = tablePairIndexToID[indexB+""];
			// console.log(indexA+" => "+indexB);
		var pairA = tableViewPairToPair[indexA];
		var pairB = tableViewPairToPair[indexB];
		Code.addUnique(includedPairs, pairA);
		Code.addUnique(includedPairs, pairB);
		// views
		var viewA = pairA.viewA();
		var viewB = pairA.viewB();
		var viewC = pairB.viewA();
		var viewD = pairB.viewB();
		Code.addUnique(includedViews, viewA);
		Code.addUnique(includedViews, viewB);
		Code.addUnique(includedViews, viewC);
		Code.addUnique(includedViews, viewD);
	}
	// throw away duplicate (close) views
	// TODO: ALSO NEED A CONSISTENCY CHECK - throw out bad matches : SCALE & TRANSFORM
	console.log("includedViews");
	console.log(includedViews);
	console.log(includedPairs);
	console.log(includedPairEdges);
	// map visited pair-vertexes
	var mappingIndexToExistPairs = {};
	var mappingExistToIndexPairs = {};
	for(var i=0; i<includedPairs.length; ++i){
		var j = bestPairs[i];
		mappingExistToIndexPairs[j+""] = i;
		mappingIndexToExistPairs[i+""] = j;
	}
	// map visited view-vertexes
	var mappingIndexToExistViews = {};
	var mappingExistToIndexViews = {};
	for(var i=0; i<includedViews.length; ++i){
		var j = bestViews[i];
		mappingExistToIndexViews[j+""] = i;
		mappingIndexToExistViews[i+""] = j;
	}
	// grab all edges that are included pairs
	var graphEdges = [];
	for(var i=0; i<includedPairEdges.length; ++i){
		var edge = includedPairEdges[i];
		var value = edge["value"];
		var error = edge["error"];
		var indexA = edge["A"];
		var indexB = edge["B"];
			indexA = tablePairIDToIndex[indexA];
			indexB = tablePairIDToIndex[indexB];
			indexA = mappingExistToIndexPairs[indexA+""];
			indexB = mappingExistToIndexPairs[indexB+""];
		graphEdges.push([indexA,indexB, value,error]);
	}
	// optimum scale
	var vertexesUseScale = bestPairs;
	var results = R3D.optimumScaling1D(graphEdges);
	console.log(results);
	var absoluteScales = results["absolute"];
	var scales = [];
	for(var i=0; i<includedPairs.length; ++i){
		var j = mappingIndexToExistPairs[i+""];
		scales[j+""] = absoluteScales[i];
	}
	absoluteScales = scales;
	// get relative transform+error
	var listPairs = [];
	for(var i=0; i<pairs.length; ++i){
		var scaler = absoluteScales[i+""]; // some may not be included
		// console.log(scaler)
		if(!scaler){
			continue;
		}
		var pair = pairs[i];
		var viewA = pair.viewA();
		var viewB = pair.viewB();
		var idA = viewA.id();
		var idB = viewB.id();
		var pairID = viewIDsToPairID(idA,idB);
		var extrinsicAtoB = pair.R();
		// INVERT FROM EXT TO CAM
		var relativeAtoB = Matrix.inverse(extrinsicAtoB);
		var transformRMean = pair.errorRMean();
		var transformRSigma = pair.errorRSigma();
		var transformMatches = pair.relativeCount();
		var indexPair = tablePairIDToIndex[pairID];
		// scale 'pair' local scale to match universe scale
// TODO: IS THIS THE CORRECT WAY TO SCALE A 3D MATRIX TRANSFORM?
		relativeAtoB.set(0,3, relativeAtoB.get(0,3)*scaler);
		relativeAtoB.set(1,3, relativeAtoB.get(1,3)*scaler);
		relativeAtoB.set(2,3, relativeAtoB.get(2,3)*scaler);
		// var center = relativeAtoB.multV3DtoV3D(new V3D(0,0,0));
		// console.log("     RELATIVE CENTER : "+center+" -> "+center.length());
		// ERROR
		var errorAB = (transformRMean + 1.0*transformRSigma)/transformMatches;
		// set
		var indexA = tableViewIDToIndex[viewA.id()+""];
		var indexB = tableViewIDToIndex[viewB.id()+""];
			indexA = mappingExistToIndexViews[indexA+""];
			indexB = mappingExistToIndexViews[indexB+""];
		listPairs.push([indexA,indexB,relativeAtoB,errorAB]);
	}
	// nonlinear estimate transforms
	var result = R3D.optimumTransform3DFromRelativePairTransforms(listPairs);
	console.log(result);
	var transforms = result["absolute"];
	// from camera to extrinsic
	var trans = [];
	for(var i=0; i<transforms.length; ++i){
	   var transform = transforms[i];
	   var matrix = transform;
	   var j = mappingIndexToExistViews[i+""];
	   trans[j] = Matrix.inverse(matrix);
	}
	transforms = trans;
	// fill in empty with identity
	for(var i=0; i<viewCount; ++i){
		if(!transforms[i]){
			transforms[i] = new Matrix(4,4).identity();
		}
	}
	// calculate skeletal graph
	console.log(listPairs);

	var result = R3D.skeletalViewGraph(listPairs);
console.log("skeleton");
console.log(result);

this.displayViewGraph(transforms,listPairs);



/*
	// save just views to view scene
console.log("PRINT OUT SCENE WITH JUST VIEWS FOR VISUALIZING");
var world = new Stereopsis.World();
var cam = this.cameras()[0];
var K = cam.K();
if(K["fx"]){
	var fx = K["fx"];
	var fy = K["fy"];
	var s = K["s"];
	var cx = K["cx"];
	var cy = K["cy"];
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
}
var distortion = cam.distortion();
var camera = world.addCamera(K, distortion);
for(var i=0; i<transforms.length; ++i){
var v = views[i];
	var transform = transforms[i];
	var view = world.addView(null, camera);
	view.data(v.id());
	view.size(new V2D(1008,756));
	view.cellSize(9);
	view.absoluteTransform(transform);
}
world.copyRelativeTransformsFromAbsolute();
var str = world.toYAMLString();
console.log(str);
*/




	// create graph.yaml
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var yaml = new YAML();
	yaml.writeComment("Graph");
	yaml.writeString("created", timestampNow);
	yaml.writeBlank();
	// views
	yaml.writeArrayStart("views");
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var transform = transforms[i];
		yaml.writeObjectStart();
			yaml.writeString("id",view.id());
			yaml.writeObjectStart("R");
				transform.toYAML(yaml);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	// full graph
	yaml.writeArrayStart("graph");
	for(var i=0; i<listPairs.length; ++i){
		var pair = listPairs[i];
		var fr = pair[0];
		var to = pair[1];
		yaml.writeObjectStart();
			yaml.writeNumber("A", fr);
			yaml.writeNumber("B", to);
			yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	// skeletal
	yaml.writeString("skeleton", null);
	yaml.writeBlank();
	// tracks
	yaml.writeString("points", null);
	yaml.writeBlank();


var graphString = yaml.toString();
// console.log(graphString);

this.setGraphFilename(App3DR.ProjectManager.RECONSTRUCT_GRAPH_FILE_NAME);

	// create tracks.yaml
	var yaml = new YAML();
	yaml.writeComment("Tracks");
	yaml.writeString("created", timestampNow);
	yaml.writeBlank();
	// views
	yaml.writeString("views", null);
	yaml.writeBlank();
	// pairs
	yaml.writeString("pairs", null);
	yaml.writeBlank();
	// tracks
	yaml.writeString("points", null);
	yaml.writeBlank();

var tracksString = yaml.toString();
// console.log(tracksString);

this.setTracksFilename(App3DR.ProjectManager.RECONSTRUCT_TRACKS_FILE_NAME);

	var fxnSavedProject = function(){
		console.log("fxnSavedProject -- complete graph start");
	}

	var fxnSavedTracks = function(){
		console.log("fxnSavedTracks");
		this.saveProjectFile(fxnSavedProject, this);
	}

	var fxnSavedGraph = function(){
		console.log("fxnSavedGraph");
		this.saveTracks(tracksString, this.tracksFilename(), fxnSavedTracks, this);
	}


	// throw "here ..."


	// SAVE
	this.saveGraph(graphString, this.graphFilename(), fxnSavedGraph, this);

}

App3DR.ProjectManager.prototype.displayOriginalViewGraph = function(views, pairs, triples, viewToID,pairToIDs,tripleToIDs, pairToError,pairToTransform,tripleToScales,  originalTransforms){
	// ..
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var viewIDsToPairID = function(iA,iB){
		return minimumStringFirst(iA,iB);
	}
	var setOrFlip = function(table,iA,iB,scale, error){
		var key = viewIDsToPairID(iA,iB);
		var edge = table[key];
		if(edge["A"]==iA && edge["B"]==iB){
			edge["list"].push([scale,error]);
		}else if(edge["A"]==iB && edge["B"]==iA){
			edge["list"].push([1.0/scale,error]);
		}else{
			throw "?";
		}
	}


	console.log(views, pairs, triples);
	// make graph based on relative pair scales
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		console.log(pair);
		// if(i==7-1){
		// 	pair["relativeError"] = 1;
		// }
		// if(i==9-1){
		// 	pair["relativeError"] = 1;
		// }
		// if(i==6-1){
		// 	pair["relativeError"] = 1;
		// }
	}
	
	// init scale edges
	var edges = [];
	var tableViewPairToEdge = {};
	var tableViewPairToPair = {};
	// var tablePairIDToIndex = {};
	// var tablePairIndexToID = {};
	for(var i=0; i<pairs.length; ++i){
		var pairA = pairs[i];
		var pairIDs = pairToIDs(pairA);
		var idA = pairIDs[0];
		var idB = pairIDs[1];
		var nodeA = viewIDsToPairID(idA,idB);
		// tablePairIDToIndex[nodeA] = i;
		// tablePairIndexToID[i+""] = nodeA;
		tableViewPairToPair[nodeA] = pairA;
		for(var j=i+1; j<pairs.length; ++j){
			var pairB = pairs[j];
			var pairIDs = pairToIDs(pairB);
			var idC = pairIDs[0];
			var idD = pairIDs[1];
			var nodeB = viewIDsToPairID(idC,idD);
			var index = viewIDsToPairID(nodeA,nodeB);
			// console.log(" INDEX ... "+index);
			var edge = {"A":nodeA, "B":nodeB, "list":[], "pairA":pairA,"pairB":pairB};
			edges.push(edge); // directional
			tableViewPairToEdge[index] = edge;
		}
	}




	// record edges for relative scales:
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var tripleIDs = tripleToIDs(triple);
		// views
		var idA = tripleIDs[0];
		var idB = tripleIDs[1];
		var idC = tripleIDs[2];
		// pairs
		var idAB = viewIDsToPairID(idA,idB);
		var idAC = viewIDsToPairID(idA,idC);
		var idBC = viewIDsToPairID(idB,idC);
console.log(i+" : "+idAB+" "+idAC+" "+idBC);
		var pairAB = tableViewPairToPair[idAB];
		var pairAC = tableViewPairToPair[idAC];
		var pairBC = tableViewPairToPair[idBC];
		// errors
		var errorAB = 0;
		var errorAC = 0;
		var errorBC = 0;
		if(pairAB){
			errorAB = pairToError(pairAB);
		}
		if(pairAC){
			errorAC = pairToError(pairAC);
		}
		if(pairBC){
			errorBC = pairToError(pairBC);
		}
		// scales
		var scales = tripleToScales(triple);
		// console.log(scales);
		var scaleAB = scales["AB"];
		var scaleAC = scales["AC"];
		var scaleBC = scales["BC"];
		// record edge
		if(scaleAB>0 && scaleAC>0){
			var scaleABtoAC = scaleAC/scaleAB;
			setOrFlip(tableViewPairToEdge,idAB,idAC,scaleABtoAC,errorAB+errorAC);
		}
		if(scaleAC>0 && scaleBC>0){
			var scaleACtoBC = scaleBC/scaleAC;
			setOrFlip(tableViewPairToEdge,idAC,idBC,scaleACtoBC,errorAC+errorBC);
		}
		if(scaleAB>0 && scaleBC>0){
			var scaleBCtoAB = scaleAB/scaleBC;
			setOrFlip(tableViewPairToEdge,idBC,idAB,scaleBCtoAB,errorBC+errorAB);
		}
	}

	// console.log(tableViewPairToEdge);
	// combine multi-edges into single edge based on error
	var keys = Code.keys(tableViewPairToEdge);
	var graphEdges = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var edge = tableViewPairToEdge[key];
		var list = edge["list"];
var idA = pairToIDs(edge["pairA"]);
var idB = pairToIDs(edge["pairB"]);
console.log(" "+i+" = "+viewIDsToPairID(idA[0],idA[1])+" & "+viewIDsToPairID(idB[0],idB[1]))
console.log(list);
// if(list.length>1){
// throw "what is the deal? - multiple ratios for same pairs, get outta here"
// }
		if(list.length>0){
			var values = [];
			var errors = [];
			// console.log(".  "+key+",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
			for(var j=0; j<list.length; ++j){
				// console.log(list[j][0]+" - "+list[j][1]);
				var e = list[j];
				values.push(e[0]);
				errors.push(e[1]);
			}
			var info = Code.errorsToPercents(errors);
			var error = info["error"];
			var percents = info["percents"];
			var value = Code.averageNumbers(values, percents);
			edge["value"] = value;
			edge["error"] = error;
			// console.log("=  "+value+" - "+error);
			graphEdges.push(edge);
		}
	}

// throw "yup"
	// create graph from edges
	// console.log(graphEdges)
	var graph = new Graph();

	// create vertexes:
	var pairIDToVertex = [];
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var pairIDs = pairToIDs(pair);
		var idA = pairIDs[0];
		var idB = pairIDs[1];
		var pairID = viewIDsToPairID(idA,idB);
		var vertex = graph.addVertex();
		vertex.data({"pair":pair});
		vertex.temp(i);
		pairIDToVertex[pairID] = vertex;
	}

	// create edges:
	for(var i=0; i<graphEdges.length; ++i){
		var infoEdge = graphEdges[i];
		var error = infoEdge["error"];
		var value = infoEdge["value"];
		var idA = infoEdge["A"];
		var idB = infoEdge["B"];
		var vertexA = pairIDToVertex[idA];
		var vertexB = pairIDToVertex[idB];
		var edge = graph.addEdgeDuplex(vertexA,vertexB, error);
		edge.data({"error":error, "value":value});
		// vertex.data({"pair":pair});
	}


	// 
var vertexes = graph.vertexes();
// console.log(vertexes);
// throw "?"



/*
// INSERT TEST DATA HERE
vertexes[0].data()["value"] = 1.0;
vertexes[1].data()["value"] = 2.0;
vertexes[2].data()["value"] = 3.0;
vertexes[3].data()["value"] = 4.0;
vertexes[4].data()["value"] = 5.0;
vertexes[5].data()["value"] = 10.0;
vertexes[6].data()["value"] = 1.75;
vertexes[7].data()["value"] = 1.0;
// vertexes[8].data()["value"] = 1.50;
for(var i=0; i<vertexes.length; ++i){
	var vertex = vertexes[i];
	var data = vertex.data();
	data["original"] = data["value"];
}
// fill in values
	var edges = graph.edges();
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		// console.log(edge);
		var a = edge.A();
		var b = edge.B();
		// make up an error
		// var mag = 0.01;
		var mag = 0.10;
		// var mag = 0.50;
		// var mag = 1.0;
		// var mag = 0.1;
		// var mag = 0;
		var error = Math.random()*mag;
		var relative = b.data()["value"]/a.data()["value"];
		// console.log("relative: "+relative);


		relative = Math.exp( Math.log(relative) + (error - mag*0.5) );

		edge.weight(error);
		edge.data()["error"] = error;
		edge.data()["value"] = relative;
	}

*/

// TEST CODE VERSION
var edges = graph.edges();
var pairEdges = [];
for(var i=0; i<edges.length; ++i){
	var edge = edges[i];
	console.log(edge);
	var idA = edge.A().temp();
	var idB = edge.B().temp();
	var weight = edge.data()["error"];
	var value = edge.data()["value"];
		value = Math.log(value);
	pairEdges.push([idA,idB,value,weight]);
}

console.log(pairEdges);
// 

var result = Code.graphAbsoluteFromRelative1D(pairEdges);
console.log(result);

var values = result["values"];
console.log("TEST TEST TEST TEST TEST TEST ");
for(var i=0; i<values.length; ++i){
	var value = values[i];
		value = Math.exp(value);
	console.log(" "+i+" : "+value);
	values[i] = value;
}
var testedScales = values;
// throw "???"













	// find best root vertex:
	var bestVertex = null;
	var bestCost = null;
	var bestPaths = null;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var paths = graph.minPaths(vertex);
		var costTotal = 0;
		var costCount = 0;
		for(var p=0; p<paths.length; ++p){
			var path = paths[p];
			var cost = path["cost"];
			if(cost!==null && cost>0){
				costCount += 1;
				costTotal += cost;
			}
		}
		if(path["vertex"]!=vertex){
			var avg = costTotal/costCount;
			if(bestVertex==null || avg<bestCost){
				bestVertex = vertex;
				bestCost = avg;
				bestPaths = paths;
			}
		}
	}
	// console.log(bestVertex);

	bestVertex.data()["size"] = 1.0;

	// initialize absolute sizes based on start vertex:
	for(var i=0; i<bestPaths.length; ++i){
		var path = bestPaths[i];
		var edges = path["edges"];
		var currentVertex = bestVertex;
		var currentSize = bestVertex.data()["size"];
		for(var e=0; e<edges.length; ++e){
			var edge = edges[e];
			var scale = edge.data()["value"];
			if(edge.A()!=currentVertex){
				scale = 1.0/scale;
			}
			currentSize *= scale;
			currentVertex = edge.opposite(currentVertex);
		}
		var vertex = path["vertex"];
		vertex.data()["size"] = currentSize;
		vertex.data()["size"] = 1.0;
	}


	// ITERITIVLEY AVERAGE LOCATIONS
	var maxIterations = 1000;
	var maxAccuracy = 1.0 + 0.001;
	// todo: also acceleration
	for(var iteration=0; iteration<maxIterations; ++iteration){
var debug = iteration == maxIterations-1;
// console.log("+++++++++++++++++++++++++++++++++++ "+iteration);
		// init accumulators
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			vertex.data()["list"] = [];
		}
		// each starting vertex
		for(var i=0; i<vertexes.length; ++i){
			// find path to all other vertexes + error
			var vertex = vertexes[i];
			var paths = graph.minPaths(vertex); // TODO: THIS IS CONSTANT
			for(var p=0; p<paths.length; ++p){
				var path = paths[p];
				var cost = path["cost"];
				// var cost = 1.0;
				var vert = path["vertex"];
				if(vert==vertex){
					continue;
				}
				var size = vertex.data()["size"];
				var edges = path["edges"];
				// LIMIT PATHS BY ONY DIRECT EGES
				if(edges.length!==1){
					continue;
				}
				var currentVertex = vertex;
				for(var e=0; e<edges.length; ++e){
					var edge = edges[e];
					var data = edge.data();
					var scale = data["value"];
						// cost /= data["error"];
					if(edge.A()!=currentVertex){
						scale = 1.0/scale;
					}
					size *= scale;
					currentVertex = edge.opposite();
				}
				vert.data()["list"].push([size, cost]);
			}
		}
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var list = vertex.data()["list"];
			var errors = [];
			var values = [];
			for(var l=0; l<list.length; ++l){
				var li = list[l];
				values.push(li[0]);
				errors.push(li[1]);
			}
			var info = Code.errorsToPercents(errors);
			var error = info["error"];
			var percents = info["percents"];
			var value = Code.averageNumbers(values, percents);
			vertex.data()["value"] = value;
		}

		// each vertex averages it's initial position based on error-average sum
		// console.log(vertexes);

		var smallest = null;
		var largestRatio = null;
		var prevLargestRatio = null;
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var data = vertex.data();

			var ratio = data["size"]/data["value"];
			if(ratio<1){
				ratio = 1/ratio;
			}
			if(largestRatio===null || ratio>largestRatio){
				largestRatio = ratio;
			}
if(debug){
console.log(i+": "+data["size"]+" => "+data["value"]+" ("+ratio+")");
}
			var value = data["value"];
			data["size"] = value;
			if(smallest===null || value<smallest){
				smallest = value;
			}
		}
		// console.log("largestRatio: "+largestRatio);
		// .
		// normalize around 1
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var data = vertex.data();
			data["size"] = data["size"]/smallest;
		}


		// if(largestRatio<maxAccuracy){
		// 	console.log("break early "+iteration);
		// 	break;
		// }
		
	}

// DISPLAY SCALES
	// display all pairs optimum scales:
	var displaySpacing = 20;
	var displaySize = 50;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var pair = data["pair"];
		var size = data["size"];
		var c = new V2D(10 + displaySpacing*i + displaySize*i + displaySize*0.5, 10 + displaySize*0.5);
		// go thru all paths to find out what neighbors thing of size
		var paths = graph.minPaths(vertex); // TODO: THIS IS CONSTANT
		for(var p=0; p<paths.length; ++p){
			var path = paths[p];
			var cost = path["cost"];
			// var cost = 1.0;
			var vert = path["vertex"];
			if(vert==vertex){
				continue;
			}
			var scaleForward = 1.0;
			var scaleReverse = 1.0;
			var edges = path["edges"];
			// LIMIT PATHS BY ONY DIRECT EGES
			if(edges.length!==1){
				continue;
			}
			var currentVertex = vertex;
			for(var e=0; e<edges.length; ++e){
				var edge = edges[e];
				var data = edge.data();
				var scale = data["value"];
					// cost /= data["error"];
				if(edge.A()!=currentVertex){
					scale = 1.0/scale;
				}
				scaleForward *= scale;
				scaleReverse /= scale;
				currentVertex = edge.opposite();
			}
			//
			var expected = vert.data()["size"] / vertex.data()["size"];
			// scaleAccumulator = 1.0/scaleAccumulator;
			//console.log("scaleAccumulator: "+scaleAccumulator+" - "+path["cost"]);
			// console.log(".   vs: "+scaleForward+" - "+scaleReverse+" ~ "+(1.0/scaleReverse)+" =?= "+expected+" : COST: "+cost);

			var scaleAccumulator = path["vertex"].data()["size"] * scaleReverse;


			var circleSize = scaleAccumulator*displaySize*0.25;
			var d = new DO();
			// d.graphics().setLine(2.0,0xCC0000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(0,0, circleSize);
			d.graphics().endPath();
			// d.graphics().strokeLine();
			d.graphics().setFill(0x110000FF);
			d.graphics().fill();
			d.matrix().translate(c.x, c.y);
			GLOBALSTAGE.addChild(d);
		}

		var circleSize = size*displaySize*0.25;
		var d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, circleSize);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(c.x, c.y);
		GLOBALSTAGE.addChild(d);
	}


	

	console.log("nonlinear update");
	var x = [];
	var args = [];
	var iterations = 1000;
	var fxn = function(args, x, isUpdate){
		var totalError = 0;
		for(var i=0; i<args.length; ++i){
			var edge = args[i];
			var indexA = edge[0];
			var indexB = edge[1];
			var valueAB = edge[2];
			var errorAB = edge[3];
			var actualA = x[indexA];
			var actualB = x[indexB];
			var actualAB = actualB/actualA;
			// console.log(valueAB+" vs "+actualAB);
			var error = Math.abs( Math.log(valueAB) - Math.log(actualAB) );
			if(errorAB>0){
				error /= errorAB;
			}
			totalError += error;
		}
		// if(isUpdate){
		// 	console.log("error: "+totalError);
		// }
		if(isUpdate){
			// normalize smallest to 1.0
			var minValue = Code.min(x);
			for(var i=0; i<x.length; ++i){
				x[i] /= minValue;
			}
			return;
		}

		return totalError;
	}



	// absolutes
	var vertexes = graph.vertexes();
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var size = data["size"];
		vertex.temp(i);
		x[i] = size;
	}
for(var i=0; i<x.length; ++i){
	console.log(i+" : "+x[i]);
}
	// relatives
	var edges = graph.edges();
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var data = edge.data();
		var value = data["value"];
		var error = data["error"];
		var a = edge.A();
		var b = edge.B();
		args.push([a.temp(),b.temp(), value,error]);
	}
	console.log(args);
	var result = Code.gradientDescent(fxn, args, x, null, iterations, 1E-16);
	console.log(result);
	var x = result["x"];
for(var i=0; i<x.length; ++i){
	console.log(i+" : "+x[i]);
}


console.log(x);
x = testedScales;
console.log(testedScales);
// throw "?"

	// put back in:
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
			data["value"] = x[i];
	}

	// update transforms by INVERSING SCALES
	var pairIDToRLookup = {};
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var value = data["value"];
		var pair = data["pair"];
		var R = pairToTransform(pair);
		// TO ABS:
			// R = Matrix.inverse(R);
			R = Matrix3D.fromMatrix(R);
			R.scaleTranslation(1.0/value);
			// R.scaleTranslation(value);
			R = R.toMatrix();
		// data["R"] = R;
		var pairIDs = pairToIDs(pair);
		var idA = pairIDs[0];
		var idB = pairIDs[1];
		var pairID = viewIDsToPairID(idA,idB);
		pairIDToRLookup[pairID] = R;
	}









	// NEW GRAPH:
	var viewGraph = new Graph();
	var viewIDToVertex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		viewID = viewToID(view);
		var vertex = viewGraph.addVertex();
		vertex.data({"view":view, "i":i});
		viewIDToVertex[viewID] = vertex;
	}
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var vertexA = viewIDToVertex[idA];
		var vertexB = viewIDToVertex[idB];
		var error = pairToError(pair);
		var edge = viewGraph.addEdgeDuplex(vertexA,vertexB, error);
		
		// GET UPDATED PAIR R
		var pairIDs = pairToIDs(pair);
		var idA = pairIDs[0];
		var idB = pairIDs[1];
		var pairID = viewIDsToPairID(idA,idB);
		var R = pairIDToRLookup[pairID];
// TO ABS ?
R = R3D.inverseCameraMatrix(R);

		// 
		var data = {};
			data["pair"] = pair;
			data["error"] = pairToError(pair);
			data["forward"] = R;
			data["reverse"] = Matrix.inverse(R);
			// data["reverse"] = 
		edge.data(data);
	}





/*

// INSERT FAKE DATA HERE
var vertexes = viewGraph.vertexes();
var edges = viewGraph.edges();
var R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 1,0,0);
vertexes[0].data()["value"] = R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 2,1,0);
vertexes[1].data()["value"] = R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 2,2,0);
vertexes[2].data()["value"] = R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 3,2,0);
vertexes[3].data()["value"] = R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 3,1,0);
vertexes[4].data()["value"] = R;
R = new Matrix(4,4); R.identity(); R = Matrix.transform3DTranslate(R, 4,3,0);
vertexes[5].data()["value"] = R;
// vertexes[6].data()["value"] = R;
// vertexes[7].data()["value"] = R;
// vertexes[8].data()["value"] = R;
for(var i=0; i<vertexes.length; ++i){
	var vertex = vertexes[i];
	var data = vertex.data();
	var R = data["value"];
		R = Matrix.inverse(R);
	data["value"] = R;
	data["original"] = R;
}
// fill in values
for(var i=0; i<edges.length; ++i){
	var edge = edges[i];
	var a = edge.A();
	var b = edge.B();
	var data = edge.data();
	// make up an error
	// var mag = 0.1;
	var mag = 1.0;
	// var mag = 0.50;
	// var mag = 0.1;
	// var mag = 0;
	var error = Math.random()*mag;
	// var relative = b.data()["value"]/a.data()["value"];
	// relative = Math.exp( Math.log(relative) + (error - mag*0.5) );
	var R = R3D.relativeTransformMatrix2(a.data()["value"], b.data()["value"]);
	edge.weight(error);
	data["error"] = error;
	data["forward"] = R;
	data["reverse"] = Matrix.inverse(R);
	// console.log("fwd: \n "+data["forward"]+" & \n"+data["reverse"]);
}

// console.log(edges);
// throw "?"


*/





	// initialize view locations to origin
	var vertexes = viewGraph.vertexes();
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var R = new Matrix(4,4);
			R.identity();
		data["value"] = R;		
	}

	var edges = viewGraph.edges();
	// linear / iteritive estimate transform absolute locations from relative
	var maxIterations = 100;
	var maxAccuracy = 1.0 + 0.001;
	// todo: also acceleration
	for(var iteration=0; iteration<maxIterations; ++iteration){
// var debug = iteration == maxIterations-1;
// console.log("+++++++++++++++++++++++++++++++++++ "+iteration);
		// init accumulators
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			vertex.data()["list"] = [];
		}

		// get all edges and add
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var origin = vertex.data()["value"];
			var edges = vertex.edges();
// console.log(edges);
			for(var e=0; e<edges.length; ++e){
				var edge = edges[e];
				var data = edge.data();
				var transform = data["forward"];
				if(edge.A()!=vertex){
					transform = data["reverse"];
				}

// transform = Matrix.inverse(transform);

				var cost = data["error"];
				var R = Matrix.mult(transform, origin);
// console.log(""+origin);
// console.log(""+transform);
// console.log(""+R);
// console.log("+++++++++++++++++");
				// var R = Matrix.mult(origin, transform);
				vertex.data()["list"].push([R, cost]);
			}
		}
		// average each new position
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var list = vertex.data()["list"];
			var errors = [];
			var values = [];
			for(var l=0; l<list.length; ++l){
				var li = list[l];
				values.push(li[0]);
				errors.push(li[1]);
			}
			var info = Code.errorsToPercents(errors);
			var error = info["error"];
			var percents = info["percents"];
			var value = Code.averageTransforms3D(values, percents);
// console.log(""+values);
// console.log("=================");
// console.log(""+value);
// throw "?"
			vertex.data()["next"] = value;
		}

		// check update deltas
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var data = vertex.data();
			var value = data["value"];
			var next = data["next"];
				var p = value.transform3DLocation();
				var n = next.transform3DLocation();
			var delta = V3D.distance(p,n);
// console.log(i+" = "+delta);//+ "  "+p);
			data["value"] = next;

			// var avg = Code.averageTransforms3D([value,next], [0.5,0.5]);
			// data["value"] = avg;
			// console.log("NEXT: \n "+next);
		}
		// move COM to origin ?
		// throw "end"
	}

	// nonlinear update absolute transforms from




	console.log("nonlinear update");
	var x = [];
	var args = [];
	var iterations = 1000;
	var fxn = function(args, x, isUpdate){ // position error only
		var totalError = 0;
		for(var i=0; i<args.length; ++i){
			var edge = args[i];
			var indexA = edge[0];
			var indexB = edge[1];
			var valueAB = edge[2];
			var errorAB = edge[3];
			var actualAx = x[indexA*3+0];
			var actualAy = x[indexA*3+1];
			var actualAz = x[indexA*3+2];
			var actualBx = x[indexB*3+0];
			var actualBy = x[indexB*3+1];
			var actualBz = x[indexB*3+2];

			var actualAB = new V3D(actualBx-actualAx, actualBy-actualAy, actualBz-actualAz);
			// var actualAB = actualB/actualA;
			// console.log(valueAB+" vs "+actualAB);
			var error = V3D.distanceSquare( actualAB, valueAB );
			if(errorAB>0){
				error /= errorAB;
			}
			totalError += error;
		}
		// if(isUpdate){
		// 	console.log("error: "+totalError);
		// }
		if(isUpdate){
			// normalize smallest to origin?
			// console.log(totalError);	
			return;
		}

		return totalError;
	}



	// absolutes
	var vertexes = viewGraph.vertexes();
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var R = data["value"];
			vertex.temp(i);
			console.log(data);
			console.log(R);
		var t = R.transform3DLocation();
		x[i*3 + 0] = t.x;
		x[i*3 + 1] = t.y;
		x[i*3 + 2] = t.z;
	}
	// relatives
	var edges = viewGraph.edges();
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var data = edge.data();
		var R = data["forward"];
		var error = data["error"];
		var a = edge.A();
		var b = edge.B();
		var value = R.transform3DLocation();
		args.push([a.temp(),b.temp(), value,error]);
	}
	console.log(args);
	var result = Code.gradientDescent(fxn, args, x, null, iterations, 1E-16);
	console.log(result);
	var x = result["x"];

	// put back in:
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var p = new V3D(x[i*3+0], x[i*3+1], x[i*3+2]);

		var R = new Matrix(4,4);
			R.identity();
			R = Matrix.transform3DTranslate(R, p.x,p.y,p.z);
			data["value"] = R;
	}

	// // update transforms by INVERSING SCALES
	// var pairIDToRLookup = {};
	// for(var i=0; i<vertexes.length; ++i){
	// 	var vertex = vertexes[i];
	// 	var data = vertex.data();
	// 	var value = data["value"];
	// 	var pair = data["pair"];

		// var R = new Matrix(4,4);
		// 	R.identity();
		// 	Matrix.transform3DTranslate();
		// data["value"] = ;

	// 	// var R = pairToTransform(pair);
	// 	// TO ABS:
	// 		// R = Matrix.inverse(R);
	// 		// R = Matrix3D.fromMatrix(R);
	// 		// R.scaleTranslation(1.0/value);
	// 		// // R.scaleTranslation(value);
	// 		// R = R.toMatrix();
	// 	// data["R"] = R;
	// 	// var pairIDs = pairToIDs(pair);
	// 	// var idA = pairIDs[0];
	// 	// var idB = pairIDs[1];
	// 	// var pairID = viewIDsToPairID(idA,idB);
	// 	// pairIDToRLookup[pairID] = R;
	// }






































	// plot orthogonal plane ???
	var edges = viewGraph.edges();
	var listPairs = [];
	var transforms = [];
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var R = vertex.data()["value"];
		console.log(i+" : \n "+R);
		transforms.push(R);
	}
	for(var i=0; i<edges; ++i){
		var edge = edges[i];
		var a = edge.A();
		var b = edge.B();
		var error = edge.data()["error"];
		var fwd = R3D.relativeTransformMatrix2(a.data()["value"], b.data()["value"]);
		// var absoluteAtoB = R3D.relativeTransformMatrix2(vA.absoluteTransformInverse(),vB.absoluteTransformInverse());
		// var extrinsicAtoB = Matrix.inverse(absoluteAtoB);
		// transform.R(vA,vB,extrinsicAtoB);
		listPairs.push([a.data()["i"], b.data()["i"], fwd, error ]);
	}
	this.displayViewGraph(transforms,listPairs, 100);



	throw "..."
/*


*/


/*
	var graph = new Graph();
	// create vertexes:
	// var vertexes = [];
	var viewIDToVertex = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var vertex = graph.addVertex();
			vertex.data(view);
		// vertexes.push(vertex);
		viewIDToVertex[viewToID(view)] = vertex;
	}

	// create edges:
	// var edges = [];
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		console.log(pair);
		var idA = pair["A"];
		var idB = pair["B"];
		var vertexA = viewIDToVertex[idA];
		var vertexB = viewIDToVertex[idB];
		// var vertexA = ?;
		// var vertexB = ?;
		var error = pairToError(pair);
		var edge = graph.addEdgeDuplex(vertexA,vertexB, error);
		// edges.push(edge);
	}
	console.log(graph);
*/

	// optimum scale:



	// consolidate each multi-edge into single edge by doing percent averaging

	// create graph with edges

	// pick lowest - error node as root, set scale to 1
		// lowest-error ?

	// follow minimum path from each edge  / just use direct edges ? (direct?) 

	// ...




	throw "?"
}

App3DR.ProjectManager.prototype.displayViewGraph = function(transforms, pairs, offsetX, groupIDs,  colorLine, thicknessLine){
	offsetX = offsetX!==undefined ? offsetX : 0.0;


/*

	for(var i=0; i<transforms.length; ++i){
		var m = new Matrix(4,4).identity();
			m = Matrix.transform3DTranslate(m, 0,0,-10);
			m = Matrix.transform3DRotateY(m, Code.radians(-10*i));
			m = Matrix.transform3DTranslate(m, 1,2,3);
			// m = Matrix.inverse(); // if want extrinsic
		transforms[i] = m;
	}
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var indexA = pair[0];
		var indexB = pair[1];
		var matrixA = transforms[indexA];
		var matrixB = transforms[indexB];
			// 
			var relAB = Matrix.relativeReference(matrixA,matrixB);
			
			// var s = 0.0;
			var s = 0.50;

			// var a = Code.radians(0.0);
			var a = Code.radians(10.0);
			
			relAB = Matrix.transform3DTranslate(relAB, (Math.random()-0.5)*s,(Math.random()-0.5)*s,(Math.random()-0.5)*s);
			relAB = Matrix.transform3DRotateX(relAB, (Math.random()-0.5)*a);
			relAB = Matrix.transform3DRotateY(relAB, (Math.random()-0.5)*a);
			relAB = Matrix.transform3DRotateZ(relAB, (Math.random()-0.5)*a);
			pair[2] = relAB;
			// pair[2] = Matrix.relativeWorld(matrixA,matrixB);
	}


*/



// test data
/*

	var abs0 = new Matrix(4,4).identity();
		abs0 = Matrix.transform3DRotateY(abs0, Code.radians(20));
		abs0 = Matrix.transform3DTranslate(abs0, 0,0,0);
	var abs1 = new Matrix(4,4).identity();
		abs1 = Matrix.transform3DRotateY(abs1, Code.radians(-30));
		abs1 = Matrix.transform3DTranslate(abs1, 1,0,0);
	var abs2 = new Matrix(4,4).identity();
		abs2 = Matrix.transform3DRotateY(abs2, Code.radians(40));
		abs2 = Matrix.transform3DTranslate(abs2, 0,0,1);

	var rel01 = R3D.relativeTransformMatrix2(abs0,abs1);
	var rel02 = R3D.relativeTransformMatrix2(abs0,abs2);
	var rel12 = R3D.relativeTransformMatrix2(abs1,abs2);

	// add some error
		rel01 = Matrix.transform3DRotateY(rel01, Code.radians(1));
		rel01 = Matrix.transform3DTranslate(rel01, 0.01,0,0.01);

		rel02 = Matrix.transform3DRotateY(rel02, Code.radians(2));
		rel02 = Matrix.transform3DTranslate(rel02, 0.01,0,0.01);

		rel12 = Matrix.transform3DRotateY(rel12, Code.radians(3));
		rel12 = Matrix.transform3DTranslate(rel12, 0.005,0,0.005);


		rel01 = Matrix.inverse(rel01);
		rel02 = Matrix.inverse(rel02);
		rel12 = Matrix.inverse(rel12);

	transforms = [abs0,abs1,abs2];
	pairs = [];
		pairs.push([0,1, rel01, 1.0]);
		pairs.push([0,2, rel02, 1.0]);
		pairs.push([1,2, rel12, 1.0]);
*/
	
	console.log("displayViewGraph");
	console.log(pairs);
	console.log(transforms);

	var displaySize = 1200;
	var displayPadding = 20;
	var displayWidth = displaySize - displayPadding*2.0;
	var displayHeight = displaySize - displayPadding*2.0;
	var offset2D = new V2D(displaySize*0.5,displaySize*0.5);
	// new V2D(displayPadding + displayWidth*0.5, displayPadding + displayHeight*0.5);
	// console.log("offset2D: "+offset2D);

	var centers = [];
	var normals = [];
	var forwards = [];
	var plus = new V3D(0,0,1);
	var zero = new V3D(0,0,0);
	var validCenters = [];
	var validForwards = [];
	var validIndexes = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(!transform){
			// transform = new Matrix(4,4).identity();
			var str = ""+i;
			if(groupIDs){
				str = "["+i+"] "+groupIDs[i];
			}
			console.log("MISSING TRANSFORM FOR: "+str);
		}
		var o, z, normal;
		if(!transform){
			o = null;
			z = null;
			normal = null;
		}else{
			o = transform.multV3DtoV3D(zero);
			z = transform.multV3DtoV3D(plus);
			normal = V3D.sub(z,o);
		}
		if(o){
			validCenters.push(o);
			validForwards.push(z);
			validIndexes.push(i);
		}
		centers.push(o);
		normals.push(normal);
		forwards.push(z);
	}
	var plane = Code.planeFromPoints3D(validCenters);
	var planeCenter = plane["point"];
	var planeNormal = plane["normal"];
if(false){
// if(true){ // flip for visual consistency -- in 3D
	planeNormal.scale(-1);
}
	var centers2D = Code.projectPointsTo2DPlane(validCenters,planeCenter,planeNormal);
	var forwards2D = Code.projectPointsTo2DPlane(validForwards,planeCenter,planeNormal);
	var normals2D = [];
	for(var i=0; i<centers2D.length; ++i){
		var c2D = centers2D[i];
		var f2D = forwards2D[i];
		var n2D = V2D.sub(f2D,c2D);
		normals2D[i] = n2D;
	}

	var info2D = V2D.infoArray(centers2D);
	var size2D = info2D["size"];
	var origin2D = info2D["center"];
	var scaleToDisplay = Math.min(displayWidth/size2D.x, displayHeight/size2D.y);

	var transformTo2D = new Matrix2D();
		transformTo2D.identity();
		transformTo2D.translate(-origin2D.x,-origin2D.y);
		transformTo2D.scale(scaleToDisplay);
if(false){
// if(true){ // flip for visual consistency -- in 2D
	transformTo2D.scale(1,-1);
}
		transformTo2D.translate(offset2D.x,offset2D.y);

// insert nulls at invalid locations:
for(var i=0; i<transforms.length; ++i){
	var transform = transforms[i];
	if(!transform){
		Code.arrayInsert(centers2D,i, null);
		Code.arrayInsert(forwards2D,i, null);
		Code.arrayInsert(normals2D,i, null);
	}
}


	// bounding:
	var display = new DO();
	// display.graphics().setLine(2.0,0xFF000000);
	// display.graphics().beginPath();
	// display.graphics().drawRect(0,0,displaySize,displaySize);
	// display.graphics().endPath();
	// display.graphics().strokeLine();

	var normalSize = 25.0;
	// var normalSize = 1.0;
	// var cameraSize = 5.0;
	var cameraSize = 2.0;
	var centersDisplay2D = [];
	for(var i=0; i<centers2D.length; ++i){
		var center2D = centers2D[i];
		if(!center2D){
			centersDisplay2D.push(null);
			continue;
		}
		// var p2D = center2D.copy().sub(origin2D).scale(scaleToDisplay).add(offset2D);
		var p2D = transformTo2D.multV2DtoV2D(center2D);
		centersDisplay2D.push(p2D);
		// center:
		display.graphics().setLine(1.0,0xFF000000);
		display.graphics().setFill(0xFFFF0000);
		display.graphics().beginPath();
		display.graphics().drawCircle(p2D.x,p2D.y, cameraSize);
		display.graphics().endPath();
		display.graphics().fill();
		display.graphics().strokeLine();
		// normal:
		var n2D = normals2D[i];
		n2D.norm().scale(normalSize);
		// var n2D = V3D.perpendicularComponent(base,normal2D);
		display.graphics().setLine(1.0,0xFF000000);
		display.graphics().beginPath();
		display.graphics().moveTo(p2D.x,p2D.y);
		display.graphics().lineTo(p2D.x+n2D.x,p2D.y+n2D.y);
		display.graphics().endPath();
		display.graphics().strokeLine();
		var show = i+"";
		if(groupIDs){
			show = groupIDs[i]+"";
		}
		var text = new DOText(show, 16, DOText.FONT_ARIAL, 0xFF990099, DOText.ALIGN_CENTER);
		// text.matrix().scale(1,-1);
		text.matrix().translate(p2D.x, p2D.y-20.0);
		display.addChild(text);

	}
colorLine = Code.valueOrDefault(colorLine, 0x990000CC);
thicknessLine = Code.valueOrDefault(thicknessLine, 2.0);
	// min & max errors:
	var errors = [];
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		errors.push(pair[ pairs.length-1 ]);
	}
	var info = Code.infoArray(errors);
	var minError = info["min"];
	// console.log(info);
	for(var i=0; i<pairs.length; ++i){ // this is only useful with scales not so 
// break;
		var pair = pairs[i];
		var a = pair[0];
		var b = pair[1];
		//
		var fwd = pair[2];
		var error = pair[3];






		var p2DA = centersDisplay2D[a];
		var p2DB = centersDisplay2D[b];
		if(!p2DA || !p2DB){
			continue;
		}
		display.graphics().setLine(thicknessLine, colorLine);
		display.graphics().beginPath();
		display.graphics().moveTo(p2DA.x,p2DA.y);
		display.graphics().lineTo(p2DB.x,p2DB.y);
		display.graphics().endPath();
		display.graphics().strokeLine();

		var c2D = V2D.avg(p2DA,p2DB);
		if(!fwd || !err){
			continue;
		}





		var bak = Matrix.inverse(fwd); // i
		var err = error/minError;

		// show would-be points:
		var ta = transforms[a];
		var tb = transforms[b];
		// depends on if relative or if extrinsic
		// var nb = Matrix.mult(fwd,ta);
		// var na = Matrix.mult(bak,tb);
		// var nb = Matrix.mult(bak,ta);
		// var na = Matrix.mult(fwd,tb);


		// var ia = Matrix.inverse(ta);
		// var ib = Matrix.inverse(tb);

		// var nb = Matrix.mult(fwd,ta); // NO
		// var na = Matrix.mult(bak,tb);

		// var nb = Matrix.mult(fwd,ia); // NO
		// var na = Matrix.mult(bak,ib);

		// fwd = Matrix.mult(ia,fwd);
		// bak = Matrix.mult(ib,bak);
		// fwd = Matrix.mult(fwd,ia);
		// bak = Matrix.mult(bak,ib);
		var nb = Matrix.mult(fwd,ta);
		var na = Matrix.mult(bak,tb);
		// var nb = Matrix.mult(ta,fwd);
		// var na = Matrix.mult(tb,bak);

							// absA = Matrix.inverse(newOriginR);
							// absB = Matrix.mult(relAB, absA);
							// extB = Matrix.inverse(absB);

		// var ns = [na,nb];
		// var ts = [ta,tb];
		var ts = [na,nb];
		var as = [ta,tb];

// console.log(fwd);
// console.log(bak);
// console.log(ta);
// console.log(tb);
// throw "?"
// console.log(na,nb,ta,tb);

		for(var j=0; j<ts.length; ++j){
break;
			var c3D = ts[j].multV3DtoV3D(new V3D(0,0,0));
			var p2D = Code.projectTo2DPlane(c3D.copy(),planeCenter,planeNormal);
			p2D = transformTo2D.multV2DtoV2D(p2D);
			// center:
			display.graphics().setLine(1.0,0xFF999999);
			display.graphics().setFill(0x66CCCCCC);
			display.graphics().beginPath();
			// display.graphics().drawCircle(p2D.x,p2D.y, cameraSize*err);
			display.graphics().drawCircle(p2D.x,p2D.y, 10.0);
			display.graphics().endPath();
			display.graphics().fill();
			display.graphics().strokeLine();


var c3D = as[j].multV3DtoV3D(new V3D(0,0,0));
var o2D = Code.projectTo2DPlane(c3D.copy(),planeCenter,planeNormal);
	o2D = transformTo2D.multV2DtoV2D(o2D);

			display.graphics().setLine(1.0,0xCC990000);
			display.graphics().beginPath();
			display.graphics().moveTo(o2D.x,o2D.y);
			display.graphics().lineTo(p2D.x,p2D.y);
			display.graphics().endPath();
			display.graphics().fill();
			display.graphics().strokeLine();

		}
		





		// var text = new DOText(Code.fixed(""+err,5), 16, DOText.FONT_ARIAL, 0xFF990099, DOText.ALIGN_CENTER);
		// // text.matrix().scale(1,-1);
		// text.matrix().translate(c2D.x, c2D.y);
		// display.addChild(text);
	}
	
	
	// display.matrix().scale(1,-1);
	// display.matrix().translate(0,displaySize);
	var off = new V2D(300+offsetX, 100);
	GLOBALSTAGE.addChild(display);
	// display.matrix().translate(300,100);
	display.matrix().translate(off.x,off.y);

	return {"points":centersDisplay2D, "offset":off};
}

App3DR.ProjectManager.prototype.iterateGraphTracks = function(){ // aggregate / accumulate tracks
	console.log("iterateGraphTracks");
	var project = this;
	// load tracks file
	var fxnGraphLoaded = function(){
		console.log("fxnGraphLoaded");
		project._iterateGraphTracksStart();
	}
	// load graph file
	project.loadGraph(fxnGraphLoaded, project);
}
App3DR.ProjectManager.prototype._initGraphSequential = function(allViews,allPoints, allTransforms, allCameras){
	console.log("_initGraphSequential");
	// console.log(allViews);
	// console.log(allPoints);
	// console.log(allTransforms);
	// console.log(allCameras);
	// throw "out"
	// console.log(info);

	// create graph
	var graph = new Graph();
	console.log(graph);

	var viewIDToVertex = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var viewID = view["id"];
		// console.log(view);
		var vertex = graph.addVertex();
		vertex.data(view);
		viewIDToVertex[viewID] = vertex;
	}
	var vertexes = graph.vertexes();
	console.log(vertexes);


	for(var i=0; i<allTransforms.length; ++i){
		var transform = allTransforms[i];
		// console.log(transform);
		var idA = transform["A"];
		var idB = transform["B"];
		var matchCount = transform["matches"];
		var matchError = transform["errorRMean"];
		var edgeWeight = matchCount/matchError;
		// console.log(matchCount,matchError,edgeWeight);
		var vertexA = viewIDToVertex[idA];
		var vertexB = viewIDToVertex[idB];
		// console.log(vertexA,vertexB);
		var edge = graph.addEdgeDuplex(vertexA,vertexB,edgeWeight); ///, Graph.Edge.DIRECTION_DUPLEX);
		edge.data(transform);
	}
	var edges = graph.edges();
	console.log(edges);


	// VISUALIZE ?:

	//

	var infoHash = {};
	var insideHash = {};
	var outsideHash = {};
	var sortFxn = function(a,b){
		var scoreA = a.data()["score"];
		var scoreB = b.data()["score"];
		//console.log(scoreA,scoreB);
		// SOME METRIC OF TOTAL CONNECTIVITY
		// throw "return vertex with higher connectivity to inside set"
		if(a==b){
			return 0;
		}
		return scoreA > scoreB ? -1 : 1;
	}
	
	var vertexQueue = new PriorityQueue(sortFxn);

	// first view = highest connected vertex
	var updateScoresFxn = function(onlyCrossInside){

		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var data = vertex.data();
			var edgeList = vertex.edges();

			if(onlyCrossInside){
				if(!data["inside"]){
					var sum = 0;
					for(var j=0; j<edgeList.length; ++j){
						var edge = edgeList[j];
						// only include weights of vertexes on inside
						// console.log(vertex,edge.opposite(vertex),edge);
						// console.log(edge.opposite(vertex).data()["id"])//Y9FK4HBT
						if(edge.opposite(vertex).data()["inside"]){
							// console.log("found opposite inside: ",edge.opposite(vertex));
							var weight = edge.weight();
							sum += weight;
						}
					}
					// console.log(sum);
					data["score"] = sum;
					vertexQueue.push(vertex);
				}
			}else{
				// console.log(edgeList);
				// sum of all edges = best?
				var sum = 0;
				for(var j=0; j<edgeList.length; ++j){
					var edge = edgeList[j];
					var weight = edge.weight();
					sum += weight;
					// console.log(edge.weight());
				}
				// console.log(sum);
				data["score"] = sum;
				data["inside"] = false;
				vertexQueue.push(vertex);
			}
			
		}
	}
	updateScoresFxn(false);
	// start with most connected view inside 

	// var array
	// onlyInside


	var bestVertex = vertexQueue.pop();
	// console.log(bestVertex);
	console.log("bestVertex: "+bestVertex.data()["id"]);
	vertexQueue.clear();

	bestVertex.data()["inside"] = true;
	// insideHash[bestVertex.data()["id"]] = bestVertex;

	
	var sortAdjFxn = function(a,b){
		return a["score"] > b["score"] ? -1 : 1;
	};
	// initial step as default
	var steps = [];
		var step = {};
		step["view"] = bestVertex.data()["id"];
		step["pairs"] = null;
		steps.push(step);

	// iteritive joining of vertexes
	for(var i=0; i<999; ++i){
		updateScoresFxn(true);
		// console.log(" ....................... "+i+" = "+vertexQueue.length());
		var bestVertex = vertexQueue.pop();
		if(!bestVertex){ // empty
			break;
		}
		vertexQueue.clear();
		// console.log(bestVertex);
		var score = bestVertex.data()["score"];
		if(score==0){
			console.log(bestVertex);
			throw "0 score";
		}

		var step = {};
		var pairs = [];
		step["view"] = bestVertex.data()["id"];
		step["pairs"] = pairs;
		steps.push(step);
		// get top scores of adjacent interrior 
		var edgeList = bestVertex.edges();
		for(var j=0; j<edgeList.length; ++j){
			var edge = edgeList[j];
			var oppo = edge.opposite(bestVertex).data();
			if(oppo["inside"]){
				var weight = edge.weight();
				pairs.push( { "id":oppo["id"], "score":weight });
			}
		}
		pairs.sort(sortAdjFxn);


		bestVertex.data()["inside"] = true;
		insideHash[bestVertex.data()["id"]] = bestVertex;

		// remove all / resort ?
		// throw "..."
	}

// console.log(steps);


	var sequentialData = {};
	sequentialData["initial"] = {
		"views": allViews, // absolute
		"pairs": allTransforms, // relative w/ error info
	};
	sequentialData["graph"] = {
		"cameras":allCameras, // cameras
		"views":null, // id,R,...
		"points":null, // points or point filenames ?
	};
	sequentialData["sequence"] = steps;

	return sequentialData;

/*
	- graph
		- cameras [all cameras]
		- points [all CURRENTLY COMPLETED 3D points]
		- views [all CURRENTLY COMPLETED VIEWS]
	- putative - [initial view graph]
		- views: absolute view matrixes
		- transforms: pairwise matrixes [need: count, errorR, errorF, idA, idB]
*/

	// 
	// 
/*

	iteritively add next-best connected view to join set

	pick which pairs (other views) to include as part of process
		- already inside


	PROCESS:

	- pick out next step in list:
		- single view to focus transform on
		- adjacent views 
			- load images from
			- transforms to relate
		- 


	- adjust for scale changes
		- current baseline distance / original baseline distance
		-> average where possible
	- adjust for drift?
		- only consider relative transforms between view pairs
	
	- points saved in separate files - STEP files [stage in process]
		- no 'tracks' accumulating outside of the individual step

	- focused view
	- established views
	- initial view pair transforms
	- current view pair transforms


	INITIAL VIEW ('most connected') of the best connected pair ?

*/
	
	//

	// come up with step by step list of views to load in order for sequence
	// 

	// does iterating process start from scratch each time?

	//


	throw "_initGraphSequential";
	// var info = {};
	// return info;
/*
	
*/
}
App3DR.ProjectManager.prototype._iterateGraphSequential = function(sourceData,sourceFilename,sequenceFilename){
	console.log("_iterateGraphSequential");
	console.log(sourceData);
	console.log(sourceFilename);
	console.log(sequenceFilename);
	var project = this;
	var sequenceData = null;
throw "_iterateGraphSequential"
	// var maximumPairImages = 6; // [3, 10] ~ 6
	var maximumPairImages = 4; // current JS memory/processing problems

	//

	var fxnSequenceLoaded = function(data){
		console.log("fxnSequenceLoaded");
		console.log(data);
		sequenceData = data;
		var steps = sequenceData["sequence"];
		var initialGraph = sequenceData["initial"];
		var currentGraph = sequenceData["graph"];
		var currentStep = sequenceData["sequenceIndex"];
		if(currentStep==null || currentStep==undefined){
			currentStep = 0;
		}
		if(currentStep>=steps.length){ // done
			// ...
			throw "past last step of sequential";
		}
		// for next time
		sequenceData["sequenceIndex"] = currentStep+1;

		var step = steps[currentStep];
		console.log(step);
		var stepViewID = step["view"];
		var stepPairs = step["pairs"];

		var graphViews = currentGraph["views"];
		var graphPoints = currentGraph["points"];
		var graphCameras = currentGraph["cameras"];

		// initial info
		var stepViewInitial = null;
		var initialGraphViews = initialGraph["views"];
		var initialGraphViewLookup = {};
		for(var i=0; i<initialGraphViews.length; ++i){
			var view = initialGraphViews[i];
			var viewID = view["id"];
			initialGraphViewLookup[viewID] = view;
		}
		stepViewInitial = initialGraphViewLookup[stepViewID];

		// current info
		var currentGraphViewLookup = {};
		for(var i=0; i<graphViews.length; ++i){
			var view = graphViews[i];
			var viewID = view["id"];
			currentGraphViewLookup[viewID] = view;
		}

		// estimate view initial location
		if(stepPairs==null){
			if(currentStep!==0){
				throw "null pairs on non-first step"
			}
			var transformIdentity = new Matrix(4,4).identity();
			// console.log(transformIdentity);

			graphViews = [];
			graphPoints = [];
			currentGraph["views"] = graphViews;
			currentGraph["points"] = graphPoints;

			var view = {};
			view["id"] = stepViewID;
			view["transform"] = transformIdentity;
			view["imageSize"] = stepViewInitial["imageSize"];
			view["cellSize"] = stepViewInitial["cellSize"];

			graphViews.push(view);
			// 
			// save sequence

			console.log(sequenceData);

			var saveSequenceFxn = function(a){
				console.log("saveSequenceFxn");
				project._taskDoneCheckReloadURL();
			}

			project.saveFileFromData(sequenceData,sequenceFilename, saveSequenceFxn,project);

			throw "first step stuff"
		}else{

			graphPoints = currentGraph["points"];
			if(!graphPoints){
				graphPoints = [];
				currentGraph["points"] = graphPoints;
			}
			

			// second view ==== initial relative transform + (normalized baseline length set to 1 ?)

			// third (n) view === 

			//

/*

}
				var groupViews = group["views"];
				var worldViews = [];
				for(var j=0; j<groupViews.length; ++j){
					var groupViewID = groupViews[j];
					var view = allViewsLookup[groupViewID];
					worldViews.push(view);
				}
				var groupPairs = group["pairs"];
				// PASSING DATA:
				selectedGroup = i;
				// groupData = group; // ?
				groupsInfo = {};
					groupsInfo["cameras"] = allCameras;
					groupsInfo["views"] = worldViews;
					groupsInfo["pairs"] = groupPairs;
					groupsInfo["points"] = [];
				console.log("start loading");
				// load points
				expectedPairsCount = groupPairs.length;
				for(var j=0; j<groupPairs.length; ++j){
					var groupPair = groupPairs[j];
					var groupID = groupPair["id"];
					var groupPairFilename = Code.appendToPath(densePathBase, "pairs", groupID, "relative.yaml");
					project.loadDataFromFile(groupPairFilename, completeLoadGroupPair, project);
				}
				// load images:
				expectedImagesCount = worldViews.length;
				for(var j=0; j<worldViews.length; ++j){
					var worldView = worldViews[j];
					var viewID = worldView["id"];
					var view = project.viewFromID(viewID);
					// view.loadBundleAdjustImage(completeLoadGroupViewImage, project); // 4032 x 3024
					view.loadDenseHiImage(completeLoadGroupViewImage, project); // ... 
					// view.loadIconImage(completeLoadGroupViewImage, project);
				}

*/

			// get current transforms

			var currentStepPoints = [];
			var doPointLoading = function(a){
				console.log("doPointLoading @ "+currentStep);
// throw "???"
				if(currentStep<=1){ // N/A
					console.log("don't load any points");
					pointsDidLoad(null);
				}else{
					var parentDirectory = Code.pathRemoveLastComponent(sequenceFilename);
					var previousStep = currentStep - 1;
					var previousPointsFileName = "points_"+previousStep+".yaml";
					// var previousPointsFileName = "points_1.yaml";
					var previousPointsPath = Code.appendToPath(parentDirectory,"sequence",previousPointsFileName);
					console.log("prev path: "+previousPointsPath);
					project.loadDataFromFile(previousPointsPath, pointsDidLoad, project);
				}
			}

			var pointsDidLoad = function(points){
				console.log(points);
				console.log("pointsDidLoad @ "+currentStep);
				if(points && points["points"]){
					currentStepPoints = points["points"];
				}
				doWorldViewSolve();
			}

			var doWorldViewSolve = function(a){
					// do blind-ish World solving
					// relative scales

				// get initial transforms


				// for(var i=0; i<stepPairs.length; ++i){
				// 	var pairInfo = stepPairs[i];
				// 	var oppositeID = pairInfo["id"];
				// 	console.log(pairInfo);

				// 	var oppositeInitialInfo = initialGraphViewLookup[oppositeID];
				// 	console.log(oppositeInitialInfo);

				// 	var oppositeCurrentInfo = currentGraphViewLookup[oppositeID];
				// 	console.log(oppositeCurrentInfo);
				// }
				// 
				var scaleInitialToCurrent = 1.0;
				//
				var transformInitial = null;


				// scale = average of: all PAIRS_i-PAIRS_j (weighted by score?): current distance / initial distance
				console.log(stepPairs);
				var scaleAmounts = [];
				var scalePercents = [];
				for(var i=0; i<stepPairs.length; ++i){
					var pairInfoA = stepPairs[i];
					var oppositeIDA = pairInfoA["id"];
					for(var j=i+1; j<stepPairs.length; ++j){
						var pairInfoB = stepPairs[j];
						var oppositeIDB = pairInfoB["id"];
						// console.log(pairInfoA);
						// console.log(pairInfoB);
						console.log("get scale for "+oppositeIDA+"-"+oppositeIDB);

						var initA = initialGraphViewLookup[oppositeIDA]["transform"];
						var initB = initialGraphViewLookup[oppositeIDB]["transform"];
							initA = Matrix.fromObject(initA);
							initB = Matrix.fromObject(initB);
							// abs
							initA = Matrix.inverse(initA);
							initB = Matrix.inverse(initB);
						var initAB = Matrix.relativeReference(initA,initB);

						// console.log(initA);
						// console.log(initB);
						// console.log(initAB);

						var currA = currentGraphViewLookup[oppositeIDA]["transform"];
						var currB = currentGraphViewLookup[oppositeIDB]["transform"];
							currA = Matrix.fromObject(currA);
							currB = Matrix.fromObject(currB);
							// abs
							currA = Matrix.inverse(currA);
							currB = Matrix.inverse(currB);
						var currAB = Matrix.relativeReference(currA,currB);

						// console.log(currA);
						// console.log(currB);
						// console.log(currAB);

						var baselineA = initAB.transform3DLocation();
						var baselineB = currAB.transform3DLocation();
						// console.log(baselineA.length());
						// console.log(baselineB.length());
						var ratioOldToNew = baselineB.length()/baselineA.length();
						console.log("ratioOldToNew: "+ratioOldToNew);

						var value = pairInfoA["score"] + pairInfoB["score"];
						// console.log(value);
						scalePercents.push(value);
						scaleAmounts.push(ratioOldToNew);
						// throw "...";
					}
				}
				if(scaleAmounts.length>0){
					scalePercents = Code.countsToPercents(scalePercents);
					console.log(scaleAmounts);
					console.log(scalePercents);
					scaleInitialToCurrent = Code.averageNumbersLog(scaleAmounts, scalePercents);
					// console.log(result);
					

					// console.log("scaleInitialToCurrent: "+scaleInitialToCurrent);

					// Code.optimumScaling1D();

					// throw "do scale averaging";
				}


				console.log("scaleInitialToCurrent: "+scaleInitialToCurrent);

				// transform = (relative of all PAIRS-VIEW) * 1/scale
				var transformAbsolutes = [];
				var transformPercents = [];
				var stepTransformInitial = stepViewInitial["transform"];
				// var extA = new Matrix(4,4);
				// var extB = new Matrix(4,4);
				// var absA = new Matrix(4,4);
				// var absB = new Matrix(4,4);
				var relAB = new Matrix(4,4);
				for(var i=0; i<stepPairs.length; ++i){
					var pairInfo = stepPairs[i];
					var oppositeID = pairInfo["id"];
					var oppositeTransformInitial = initialGraphViewLookup[oppositeID]["transform"];
					var oppositeTransformCurrent = currentGraphViewLookup[oppositeID]["transform"];
					// console.log(oppositeTransformInitial);
					// console.log(stepTransformInitial);
					// console.log(oppositeTransformCurrent);
					// ...
					var extA = new Matrix(4,4);
					var extB = new Matrix(4,4);
					// 
					extA.fromObject(oppositeTransformInitial);
					extB.fromObject(stepTransformInitial);
	console.log("extA:");
	console.log(extA+"");
	console.log("extB:");
	console.log(extB+"");
					// console.log(extB);
					absA = Matrix.inverse(extA);
					absB = Matrix.inverse(extB);
					// console.log(absA);
					// console.log(absB);
					// relAB = Matrix.relativeWorld(absA,absB); // ?
					relAB = Matrix.relativeReference(absA,absB); // ?

					// scale from old size to new size
					relAB = Matrix.transform3DScaleMatrix(relAB, scaleInitialToCurrent);

					// throw "scale ?"
					//

					// console.log(relAB+"");
					// APPEND NOW:
					extA.fromObject(oppositeTransformCurrent);
					absA = Matrix.inverse(extA);

					var absNew = Matrix.mult(relAB,absA);
					console.log(absNew+"");
	// throw "here"
					// transformAbsolutes.push(relAB);
					transformAbsolutes.push(absNew);
					// transformAbsolutes.push(relAB);
					transformPercents.push(pairInfo["score"]);
					// throw "..."
				}

				if(transformAbsolutes.length==0){
					throw "cant do transfrorm averaging";
				}
				transformPercents = Code.countsToPercents(transformPercents);
				console.log(transformAbsolutes);
				console.log(transformPercents);

				var averageTransform = Code.averageTransforms3D(transformAbsolutes, transformPercents);
				// console.log(averageTransform);

				console.log("averageTransform: ");
				console.log(averageTransform);

				// TO EXTRINSIG:
				var averageExtrinsic = Matrix.inverse(averageTransform);
				console.log("averageExtrinsic: ");
				console.log(averageExtrinsic);

	// throw "..."

				// create world
				console.log(graphViews);
				var currentViews = [];
				for(var i=0; i<graphViews.length; ++i){
					var gv = graphViews[i];
					// var v = {};
					// v["id"] = gv["id"];
					// v["cellSize"] = gv["id"];
					// v["imageSize"] = gv["id"];
					// v["transform"] = gv["id"];
					// 
					currentViews.push(gv);
				}
				var thisView = {};
					thisView["id"] = stepViewID;
					// thisView["cellSize"] = ;
					thisView["cellSize"] = stepViewInitial["cellSize"];
					thisView["imageSize"] = stepViewInitial["imageSize"];
					thisView["transform"] = averageExtrinsic.toObject(); // needs to be objet for fill-in-world-views
				currentViews.push(thisView);
	console.log("graphCameras");
	console.log(graphCameras);
	console.log("currentViews");
	console.log(currentViews);
				var info = project.fillInWorldViews(graphCameras, currentViews);
				var views = info["views"];
				var images = info["images"];
				var cellSizes = info["cellSizes"];
				var transforms = info["transforms"];
				var cameras = graphCameras;

	console.log("info:");
	console.log(info);
	// throw "....";
					// create world
	console.log(views, images, cellSizes, transforms);
	// throw "///"
					var world = new Stereopsis.World();
					var WORLDCAMS = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
					console.log("WORLDCAMS");
					console.log(WORLDCAMS);
					var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes, transforms);
					console.log("WORLDVIEWS");
					console.log(WORLDVIEWS);
					var WORLDVIEWSLOOKUP = project.createWorldViewLookup(world);
					console.log("WORLDVIEWSLOOKUP");
					console.log(WORLDVIEWSLOOKUP);

console.log("stepViewID: "+stepViewID);
				var worldViewLast = WORLDVIEWSLOOKUP[stepViewID];//views[views.length-1];
				var worldViewsAdjacent = []; // all image-connected views
				for(var i=0; i<WORLDVIEWS.length; ++i){
					var v = WORLDVIEWS[i];
					if(v!=worldViewLast){
						if(v.image()){
							// console.log("v:");
							// console.log(v);
							// console.log("last:");
							// console.log(worldViewLast);
							worldViewsAdjacent.push(v);
						}
					}/*else{
						console.log("found same");
					}*/
				}

				console.log("world solve");
				console.log(worldViewLast);
				console.log(worldViewsAdjacent);
				console.log(WORLDVIEWSLOOKUP);
				
				

	// console.log(world.toYAMLString());
			var worldCompletedFxn = function(){
				console.log("worldCompletedFxn");
				var worldData = world.toObject();
				var worldPoints = worldData["points"];
				var worldViews = worldData["views"];
				console.log(worldData);

				console.log(world.toYAMLString());

	// throw "after solveSequentialView"

				// throw "naow";

				// yaml.writeObjectLiteral(world.toObject());




				// SAVE THE POINTS TO A FILE

				var parentDirectory = Code.pathRemoveLastComponent(sequenceFilename);

				var pointsFilename = "points_"+currentStep+".yaml";
					pointsFilename = Code.appendToPath(parentDirectory,"sequence",pointsFilename);
				graphPoints.push(pointsFilename);


					// var yaml = new YAML();
						// var timestampNow = Code.getTimeStamp();
						// yaml.writeComment("BA model");
						// yaml.writeComment("created: "+timestampNow);
						// yaml.writeBlank();
						// yaml.writeObjectLiteral({"points":worldPoints});
						// throw "here";
						// yaml.writeDocument();
						// var str = yaml.toString();
				// var pointsYAML = yaml.toString();
				var pointsData = {"points":worldPoints};
				console.log(pointsData);
				console.log(sequenceData);
				console.log(sequenceFilename);
				console.log(pointsFilename);

				currentGraph["views"] = worldViews;

				// var yaml = new YAML();
					// yaml.writeObjectLiteral(graphData);
				// var graphYAML = yaml.toString();
				// currentGraph
				// var graphYAML = yaml.toString();

				var saveSequenceGraphFxn = function(){
					console.log("saveSequenceGraphFxn");
					project._taskDoneCheckReloadURL();
				}

				var saveSequencePointsFxn = function(){
					console.log("saveSequencePointsFxn");
					project.saveFileFromData(sequenceData,sequenceFilename, saveSequenceGraphFxn,project);
				}
	// throw "before saving point data"
				project.saveFileFromData(pointsData,pointsFilename, saveSequencePointsFxn,project);

			}
			console.log(worldViewsAdjacent);
			throw "solveSequentialView ---- load pair points ... dont need images"
			world.solveSequentialView(worldViewLast, worldViewsAdjacent, currentStepPoints,  worldCompletedFxn);


				// console.log(graphYAML);
				// console.log(pointsData);
				// console.log(sequenceData);

				// UPDATE THE GRAPH VIEWS

				// SAVE THE UPDATED SEQUENTIAL DATA

				// RECHECK

				// throw "...END doWorldViewSolve"


				
				// 
				// save points to a point file:
				// 
				// sequential/points_0.yaml
				// 
			} // END doWorldViewSolve

			// pick view images to load
			console.log(stepPairs);
			var pairLimitCount = Math.min(stepPairs.length,maximumPairImages);
			var viewsToLoadImages = [];
			viewsToLoadImages.push(stepViewID);
			for(var i=0; i<pairLimitCount; ++i){
				var pairInfo = stepPairs[i];
				var oppositeID = pairInfo["id"];
				viewsToLoadImages.push(oppositeID);
			}
			console.log(viewsToLoadImages);
			for(var i=0; i<viewsToLoadImages.length; ++i){
				var viewID = viewsToLoadImages[i];
				var view = project.viewFromID(viewID);
				viewsToLoadImages[i] = view;
			}
			console.log(viewsToLoadImages);

			// load pair images
			var expectedImageCount = viewsToLoadImages.length;
			var loadedImageCount = 0;

			// ...
			var imagesLoadedFxn = function(a){
				++loadedImageCount;
				console.log(loadedImageCount+" / "+expectedImageCount)
				// throw  "doPointLoading"
				if(loadedImageCount == expectedImageCount){
					// doWorldViewSolve();
					doPointLoading();
				}
			}
			// ...
			console.log("load pair images");
			for(i=0; i<viewsToLoadImages.length; ++i){
				view = viewsToLoadImages[i];
				view.loadDenseHiImage(imagesLoadedFxn, this);
			}
			
			// throw "do step non-first"
		}

		// throw "do step stuff"
	}

	// original absolute view locations

	// view load sequence

	// top images to load for each view

	// points list = []

	// currentViewIndex = 0

	//

	project.loadDataFromFile(sequenceFilename, fxnSequenceLoaded, project);
}
App3DR.ProjectManager.prototype._iterateGraphTracksStart = function(){
	console.log("_iterateGraphTracksStart");
	// helpers:
	var project = this;
	var sortLargerArray0 = function(a,b){
		return a[0] > b[0] ? -1 : 1;
	}
	var sortSmaller = function(a,b){
		return a < b ? -1 : 1;
	}
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var tripleHash = function(a,b,c){
		var arr = [a,b,c];
		arr.sort(sortSmaller);
		var hash = arr[0]+"-"+arr[1]+"-"+arr[2];
		return hash;
	}

	var pairs = this.pairs();
	var views = this.views();

	// view lookup
	var viewLookup = {};
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}
	var pairLookup = {};
	// var pairLookupIndex = {};
	for(var i=0; i<pairs.length; ++i){
		var idA = pairs[i].viewA().id();
		var idB = pairs[i].viewB().id();
		var idP = minimumStringFirst(idA,idB);
		pairLookup[idP] = pairs[i];
	}
	console.log(viewLookup);
	console.log(pairLookup);

	var graphData = this.graphData();
	console.log(graphData);
	var graphViews = graphData["views"];
	var graphPoints = Code.valueOrDefault(graphData["points"], []);
	console.log("graphPoints: "+graphPoints.length);

	var viewGraphLookupIndex = {};
	var viewGraphLookup = {};
	for(var i=0; i<graphViews.length; ++i){
		viewGraphLookup[graphViews[i]["id"]] = viewLookup[graphViews[i]["id"]];
		viewGraphLookupIndex[graphViews[i]["id"]] = i;
	}
	console.log("viewGraphLookup")
	console.log(viewGraphLookup)

	var previousPair = Code.valueOrDefault(graphData["previousPair"], null);
	var startIndexI = 0;
	var startIndexJ = 0;
	if(previousPair===null){ // if no tracks => use the first pair
		console.log("no previous pair");
	}else{
		startIndexI = previousPair["A"];
		startIndexJ = previousPair["B"];
		// goto next
		if(startIndexJ==graphViews.length-1){
			startIndexI += 1;
			startIndexJ = startIndexI+1;
		}else{
			startIndexJ += 1;
		}
	}
	startIndexJ = Math.max(startIndexJ,startIndexI+1);
console.log("START AT: "+startIndexI+" | "+startIndexJ);
	var foundPair = null;
	var newPreviousPair = null;
	for(var i=startIndexI; i<graphViews.length; ++i){
		var viewI = graphViews[i];
		var idI = viewI["id"];
		var vI = viewLookup[idI];
		for(var j=startIndexJ; j<graphViews.length; ++j){
			var viewJ = graphViews[j];
			var idJ = viewJ["id"];
			var vJ = viewLookup[idJ];
			console.log("check out views: "+i+"-"+j);
			// console.log(vI,vJ)
			var pair = pairLookup[ minimumStringFirst(idI,idJ) ];
			if(pair.hasRelative()){
				foundPair = pair;
				newPreviousPair = [i,j];
				break;
			}
		}
		if(foundPair){
			break;
		}
		startIndexJ = i+2;
	}
	viewPointCounts = [];
	for(var i=0; i<graphViews.length; ++i){
		viewPointCounts[i] = Code.newArrayZeros(graphViews.length);
	}
	if(foundPair){
		var pair = foundPair;

		var viewA = pair.viewA();
		var viewB = pair.viewB();

		graphData["previousPair"] = {"A":newPreviousPair[0], "B":newPreviousPair[1]};

		var trackCount = pair.trackCount();
		if(trackCount==0){ // noop
			console.log("no track data ...");
throw "save ?"
			this.saveGraphFromData(graphData);
		}else{
			//
			var indexA = viewGraphLookupIndex[viewA.id()];
			var indexB = viewGraphLookupIndex[viewB.id()];
			console.log(indexA,indexB)
			console.log(graphData)
			var loadViews = this.auxilaryViewsToLoadForSet([indexA,indexB],graphData, 4); // 4-6
			for(var i=0; i<loadViews.length; ++i){
				loadViews[i] = viewLookup[graphViews[loadViews[i]]["id"]];
			}
			// load the view images
			var fxnViewsLoaded = function(){
				console.log("loaded images");
				console.log(loadViews);
				// also want to add ALL views
				project._iterateGraphTracksTick(pair,loadViews);
			}
			// load the track data for this pair
			var fxnPairLoaded = function(){
				console.log("loaded pair");
				console.log(pair.trackData());
				App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
			}
			App3DR.ProjectManager.loadPairsTrackData([pair], fxnPairLoaded, project);
		}
	}else{ // propagate tracks
		var groups = graphData["propagateGroups"]; // triples for
		console.log(groups);
		if(groups){
			// convert to
			propagateIndex = graphData["propagateIndex"];
			var nextGroup = propagateIndex+1;
			if(nextGroup<groups.length){//if(edges.length>0){
				var triple = groups[nextGroup];
				// // make copy of original groups
				triple = Code.copyArray(triple);
				console.log(triple);
				// get auxilary views
				var loadViews = this.auxilaryViewsToLoadForSet(triple,graphData, 6);
				var views = this.views();
				// view lookup
				var viewLookup = {};
				for(var i=0; i<views.length; ++i){
					viewLookup[views[i].id()] = views[i];
				}
				for(var i=0; i<triple.length; ++i){
					triple[i] = viewLookup[graphViews[triple[i]]["id"]];
				}
				for(var i=0; i<loadViews.length; ++i){
					loadViews[i] = viewLookup[graphViews[loadViews[i]]["id"]];
				}
				// load images and proceed
				var fxnViewsLoaded = function(){
					console.log("loaded images");
					console.log(loadViews);
					project._iterateGraphTracksPropagateTick(triple,loadViews);
				}
				// load the track data for this pair
				App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
			}else{ // done propagating
				console.log("done loading/propagating tracks");
				var sparseCameras = [];
				var sparseViews = [];
				var sparsePoints = [];
				var sparseCameraLookup = {};
				var cameraLookupIndex = {};
				var sparseViewLookup = {};
				var sparseViewLookupIndex = {};
				var viewLookup = {};
				var graphViews = graphData["views"];
				var graphPoints = graphData["points"];
				// var cameras = this.cameras();

				console.log(graphData);
				throw "cameras from graph?"

				var views = this.views();
				for(var i=0; i<views.length; ++i){
					var v = views[i];
					viewLookup[v.id()] = v;
				}
				for(var i=0; i<cameras.length; ++i){
					var camera = cameras[i];
					console.log(camera);
					var K = camera.K();
					var d = camera.distortion();
					var c = {
						"id":camera.id(),
						"fx":K["fx"],
						"fy":K["fy"],
						"s":K["s"],
						"cx":K["cx"],
						"cy":K["cy"],
						"k0":d["k0"],
						"k1":d["k1"],
						"k2":d["k2"],
						"p0":d["p0"],
						"p1":d["p1"],
					};
					var cid = c["id"];
					sparseCameras.push(c);
					sparseCameraLookup[cid] = c;
					cameraLookupIndex[cid] = i;
				}
				for(var i=0; i<graphViews.length; ++i){
					var view = graphViews[i];
					var v = viewLookup[view["id"]];
					var cid = v.cameraID();
					var cindex = cameraLookupIndex[cid];
					var v = {
						"id":view["id"],
						"size":view["size"],
						"camera":cindex,
						"R":view["R"],
						"updated":"",
					};
					sparseViews.push(v);
					sparseViewLookup[v["id"]] = v;
				}
				for(var i=0; i<graphPoints.length; ++i){
					var p3D = graphPoints[i];
					// var p3D = point.point();
					var vs = p3D["v"];
					var vList = [];
					for(var j=0; j<vs.length; ++j){
						var v = vs[j];
						v = {
							"i":v["i"],
							"x":v["x"],
							"y":v["y"],
						}
						vList.push(v);
					}
					var p = {
						"X":p3D["X"],
						"Y":p3D["Y"],
						"Z":p3D["Z"],
						"x":p3D["x"],
						"y":p3D["y"],
						"z":p3D["z"],
						"s":p3D["s"],
						"v":vList,
					};
					sparsePoints.push(p);
				}
				// console.log(sparsePoints);
				var sparsePairs = this._pairEdgesFromPoints(sparsePoints);
					sparsePairs = this._consolidatePairEdges([],sparsePairs);
				var sparseData = {
					"cameras":sparseCameras,
					"views":sparseViews,
					"pairs":sparsePairs,
					"points":sparsePoints,
					"iterations": 0,
				}
				console.log(sparseData);

				// SAVE PROJECT FILE
				var fxnSavedProject = function(){
					console.log("fxnSavedProject");
				}
				var fxnSavedSparse = function(){
					console.log("fxnSavedSparse");
					this.saveProjectFile(fxnSavedProject, this);
				}
				// SAVE
				console.log(graphPoints.length)
// throw "save ?";
				this.setTrackCount(graphPoints.length);
				this.setSparseFilename(App3DR.ProjectManager.BUNDLE_SPARSE_FILE_NAME);
				this.saveSparseFromData(sparseData, fxnSavedSparse, this);

			}
		}else{ // create edge counts
			console.log("create triple groups to propagate tracks");
			var edgeCount = {};
			var edgeIDs = {};
			for(var i=0; i<graphViews.length; ++i){
				for(var j=i+1; j<graphViews.length; ++j){
					var index = minimumStringFirst(i,j);
					edgeCount[index] = 0;
					edgeIDs[index] = [i,j];
				}
			}
			// sum edge counts
			for(var i=0; i<graphPoints.length; ++i){
				var point = graphPoints[i];
				var vs = point["v"];
				for(var j=0; j<vs.length; ++j){
					var v = vs[j]["i"];
					for(var k=j+1; k<vs.length; ++k){
						var u = vs[k]["i"];
						var index = minimumStringFirst(v,u);
						edgeCount[index] += 1;
					}
				}
			}
			console.log(edgeCount);
			// get list of all existing edges
			var edgeList = [];
			var idList = Code.keys(edgeCount);
			for(var i=0; i<idList.length; ++i){
				var index = idList[i];
				var count = edgeCount[index];
				var ids = edgeIDs[index];
				edgeList.push([count, ids]);
			}
			console.log(edgeList);
			var edgeCount = edgeList.length;
			edgeList.sort(function(a,b){
				return a[0] > b[0] ? -1 : 1;
			});
			// create it
			var usedList = Code.newArrayZeros(edgeCount);
			var triples = [];
			var tripleLookup = {};
			var currentIndex = 0;
			// add triples w/o repeats
			while(currentIndex<edgeCount){
				console.log("                    "+currentIndex);
				if(usedList[currentIndex]==1){
					++currentIndex;
					continue;
				}
				usedList[currentIndex] = 1;
				var edge = edgeList[currentIndex];
				var a = edge[1][0];
				var b = edge[1][1];
				var index = minimumStringFirst(a,b);
				// go thru list to find next shared pattern
				var found = null;
				for(var i=1; i<edgeCount; ++i){
					var ind = (currentIndex+i)%edgeCount;
					var e = edgeList[ind];
					var c = e[1][0];
					var d = e[1][1];
					if(c==a || c==b || d==a || d==b){
						if(c==a || c==b){
							found = d;
						}else if(d==a || d==b){
							found = c;
						}
						usedList[ind] = 1;
						break;
					}
				}
				if(found!==null){
					index = tripleHash(a,b,found);
					var exists = tripleLookup[index];
					if(!exists){
						var arr = [a,b,found];
						triples.push(arr);
						tripleLookup[index] = arr;
					}
				} // else could not find a triple ... ignore - this should have been weeded out in graph init?
				++currentIndex;
			}
			console.log("triples");
			console.log(triples);
			graphData["propagateGroups"] = triples;
			graphData["propagateIndex"] = -1;
			// throw "create list of propagating triples"
			console.log(graphData);
// throw "save initial propagation groups"
			// save
			this.saveGraphFromData(graphData);
		}
	}
}
App3DR.ProjectManager.prototype._pairEdgesFromPoints = function(sparsePoints){
	var sortSmaller = function(a,b){
		return a < b ? -1 : 1;
	}
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var edges = {};
	for(var i=0; i<sparsePoints.length; ++i){
		var point = sparsePoints[i];
		var vs = point["v"];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j];
			var vi = v["i"];
			for(var k=j+1; k<vs.length; ++k){
				var u = vs[k];
				var ui = u["i"];
				var index = minimumStringFirst(ui,vi);
				var edge = edges[index];
				if(!edge){ // first time
					var minI = Math.min(ui,vi);
					var maxI = Math.max(ui,vi);
					edge = {"count":0, "A":minI, "B":maxI};
					edges[index] = edge;
				}
				edge["count"] += 1;
			}
		}
	}
	return edges;
}
App3DR.ProjectManager.prototype._consolidatePairEdges = function(existing,edges){ // create if not exist, update if exists, remove if not exist
	// helpers:
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	// make lookups:
	var lookupExisting = {};
	for(var i=0; i<existing.length; ++i){
		var exist = existing[i];
		var indexA = exist["A"];
		var indexB = exist["B"];
		var index = minimumStringFirst(indexA,indexB);
		lookupExisting[index] = exist;
	}
	var lookupEdges = edges;
		edges = Code.objectToArray(edges);
	// for(var i=0; i<edges.length; ++i){
	// 	var edge = edges[i];
	// 	var indexA = edge["A"];
	// 	var indexB = edge["B"];
	// 	var index = minimumStringFirst(indexA,indexB);
	// 	lookupEdges[index] = exist;
	// }
	// remove nonexistant
	// for(var i=0; i<existing.length; ++i){
	// 	var exist = existing[i];
	// 	var indexA = exist["A"];
	// 	var indexB = exist["B"];
	// 	var index = minimumStringFirst(indexA,indexB);
	// 	var edge = lookupEdges[index];
	// 	if(!edge){ // remove
	// 		throw "DNE";
	// 	}
	// }
	var total = [];
	// add existing
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var indexA = edge["A"];
		var indexB = edge["B"];
		var index = minimumStringFirst(indexA,indexB);
		var exist = lookupExisting[index];
		if(!exist){ // make new
			exist = {};
			exist["A"] = indexA;
			exist["B"] = indexB;
			exist["errorF"] = null;
			exist["errorR"] = null;
			exist["deltaErrorF"] = null;
			exist["deltaErrorR"] = null;
			exist["updated"] = null;
			lookupExisting[index] = exist;
		} // update
		exist["count"] = edge["count"];
		total.push(exist);
	}
	return total;
}
App3DR.ProjectManager.prototype.auxilaryViewsToLoadForSet = function(loadViews,graphData,maximumViews){ // load UP TO limit total views for SET group
	maximumViews = maximumViews!==undefined ? maximumViews : 5;
	var sortLargerArray0 = function(a,b){
		return a[0] > b[0] ? -1 : 1;
	}
	var graphPoints = Code.valueOrDefault(graphData["points"], []);
	var graphViews = graphData["views"];
	viewPointCounts = [];
	for(var i=0; i<graphViews.length; ++i){
		viewPointCounts[i] = Code.newArrayZeros(graphViews.length);
	}
	// find which other views should be loaded
	for(var i=0; i<graphPoints.length; ++i){
		var point3D = graphPoints[i];
		var vs = point3D["v"];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j]["i"];
			for(var k=j+1; k<vs.length; ++k){
				var u = vs[k]["i"];
				viewPointCounts[v][u]++;
				viewPointCounts[u][v]++;
			}
		}
	}
	// get highest counted pair for relevant views
	var selectArrays = [];
	for(var j=0; j<loadViews.length; ++j){
		var index = loadViews[j];
		var points = viewPointCounts[index];
		selectArrays[j] = points;
		for(var i=0; i<graphViews.length; ++i){
			points[i] = [points[i], i];
		}
		points.sort(sortLargerArray0);
	}
	loadViews = Code.copyArray(loadViews);
	var i = 0;
	// console.log("selectArrays");
	// console.log(selectArrays);
	while(loadViews.length<maximumViews && selectArrays.length>0){
		if(i>=selectArrays.length){
			i = 0;
		}
		var currentSelect = selectArrays[i];
		if(currentSelect.length==0){
			Code.removeElementAt(selectArrays,i);
			continue;
		}
		var item = currentSelect.shift();
		var count = item[0];
		var view = item[1];
		if(count==0){ // no more valid edges
			Code.removeElementAt(selectArrays,i);
			continue;
		} // else found valid edge
		Code.addUnique(loadViews, view); // view
		++i; // to next
	}
	console.log(loadViews);
	return loadViews;
}

App3DR.ProjectManager.prototype._iterateGraphTracksPropagateTick = function(triple,viewsLoad){
	console.log("_iterateGraphTracksPropagateTick");
	// throw "_iterateGraphTracksPropagateTick"
	var stage = GLOBALSTAGE;
	// var cameras = this.cameras();
	console.log(graphData);
throw "cameras from graph?"

	var views = this.views();
	var graphData = this.graphData();
	// console.log(graphData);
	var graphViews = graphData["views"];
	var stage = GLOBALSTAGE;
	//
	var graphViewLookup = {};
	var graphViewLookupIndex = {};
	var graphViewLookupID = {};
	for(var i=0; i<graphViews.length; ++i){
		var vid = graphViews[i]["id"];
		graphViewLookup[vid] = graphViews[i];
		graphViewLookupIndex[vid] = i;
		graphViewLookupID[i] = vid;
	}
	var viewLookup = {};
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}
	console.log("world");
	// create world
	var world = new Stereopsis.World();
	var info = this._addGraphViews(world, graphViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];
	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		worldViewLookup[worldViews[i].data()] = worldViews[i];
	}
	// to world triple
	var worldTriple = [];
	for(var i=0; i<triple.length; ++i){
		var view = world.viewFromData(triple[i].id());
		worldTriple.push(view);
	}

	// load existingPoints
	console.log("embed");
	this._embedTrackPoints(world, graphData, graphViewLookupID);//, graphViewLookup);
	var points = world.toPointArray();
	console.log(points);

	// world fxns to:
	world.printPoint3DTrackCount();
	// approx patches
	console.log("patches");
	// world.patchInitBasicSphere(true);
		// propagate tracks
		console.log("errors initial");
		world.copyRelativeTransformsFromAbsolute();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		console.log("TODO: ONLY IF ERRORS ARE LOW ENOUGH? OR REMOVE ENTIRELY - probe3D");

// throw "HERE???"
var maxIterations = 0;
var lowestCount = Math.round(0.005*world.point3DCount()); // .1%-1%
console.log(lowestCount);
for(var t=0; t<maxIterations; ++t){
console.log("--------------------------------------------------------------------------------------------------------------------------------------------- "+t+" / "+maxIterations);

	// CANT PROBE TILL ERRORS ARE DOWN ...
/*
		var count = world.probe3D();
		var averageAdd = count/3;
		// end early if no longer propagating
		if(averageAdd<lowestCount){
			maxIterations = Math.min(maxIterations,t+1);
		}
		world.printPoint3DTrackCount();
*/
		world.averagePoints3DFromMatches(true);
		world.relativeFFromSamples();
		world.estimate3DErrors(true);

		world.refineSelectCameraAbsoluteOrientation(worldTriple, null, 100);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();

		world.patchInitBasicSphere(true);

		// drop poor tracks
		world.dropNegative3D();
		world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		world.filterSphere3D(2.0);

}
	world.printPoint3DTrackCount();
	world.estimate3DErrors(true);


// throw "don't want to do triple propagation ...";

	// save points
	var graphPoints = this._getGraphPointsFromWorld(world, graphViewLookupIndex);
	var graphViews = this._updateGraphViewsFromWorld(world, graphData["views"],graphData["cameras"]);
	graphData["views"] = graphViews;
	graphData["points"] = graphPoints;
	graphData["propagateIndex"] += 1;
	console.log(graphData);
	// save
	this.saveGraphFromData(graphData);
}

App3DR.ProjectManager.prototype.iteratePointsFullBA = function(){
	console.log("iteratePointsFullBA");
	var project = this;
	var fxnPointsLoaded = function(){
		console.log("fxnPointsLoaded");
		project._iteratePointsFullBAStart();
	}
	// load points
	// project.loadPoints(fxnPointsLoaded, project);
	project.loadBundled(fxnPointsLoaded, project);
}
App3DR.ProjectManager.prototype._iteratePointsFullBAStart = function(object, data){ // check loaded
	var project = this;
	console.log("_iteratePointsFullBAStart");
	// create world
	// var data = this.pointsData();
	var data = this.bundledData();
	console.log(data);
	var denseViews = data["views"];
	// PREP
	var stage = GLOBALSTAGE;
var denseViewLookup = {};
var denseViewLookupIndex = {};
for(var i=0; i<denseViews.length; ++i){
var v = denseViews[i];
var vid = v["id"];
denseViewLookup[vid] = v;
denseViewLookupIndex[vid] = i;

}
	// WORLD
	var world = new Stereopsis.World();
	// var cameras = project.cameras();
	console.log(graphData);
	throw "cameras from graph?"


	var views = project.views();
	var info = project._addGraphViews(world, denseViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];
	var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
console.log(worldViews);
console.log(views);

	var lookupViewFromID = {};
	var lookupIndexFromID = {};
	var lookupViewFromIndex = {};
	for(var i=0; i<worldViews.length; ++i){
		var v = worldViews[i];
		var vid = v.data();
		// console.log(vid);
		// var view = views[vid];
		// console.log(view);
		// var viewID = view.id();
		// console.log(viewID);
		lookupViewFromID[vid] = v;
		lookupIndexFromID[vid] = i;
		lookupViewFromIndex[i] = v;
	}

	var dataPoints = data["points"];
	console.log(dataPoints);
	console.log(lookupViewFromIndex);
	project._embedTrackPoints(world, dataPoints, lookupViewFromIndex); // TODO: THIS DOES NOT NEED INTERSECTION CHECKING
	// project._embedTrackPoints(world, dataPoints, lookupViewFromID);

	console.log("setup");
	world.copyRelativeTransformsFromAbsolute(); // transforms avail
	world.printPoint3DTrackCount();
	world.relativeFFromSamples();
	world.estimate3DErrors(true, true);


	throw "... double check all these";


	maxIterations = 3;
	// maxIterations = 7;
	var views = world.toViewArray();
	for(var iterations=0; iterations<maxIterations; ++iterations){ // LINEAR until P3D is stable enough to do nonlinear
		// world.estimate3DErrors(true);
		console.log("refine views");
		world.refineCameraAbsoluteOrientation(null,100); // 100-200
/*
		// single camera
		for(var i=0; i<views.length; ++i){
			view = views[i];
			world.refineSelectCameraAbsoluteOrientation([view], null, 50); // 10-100
		}
*/

		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// clean
		console.log("clean");
		world.filterGlobalMatches(null,null, 3.0);

		world.printPoint3DTrackCount();
		world.relativeFFromSamples();
		world.estimate3DErrors(true, true);
	}


	world.patchInitBasicSphere(true);
	world.relativeFFromSamples();



	// NONLINEAR POINTS3D
	console.log("NONLINEAR POINTS");
	maxIterations = 5;
	for(var iterations=0; iterations<maxIterations; ++iterations){

		world.printPoint3DTrackCount();


		// reesimate points
		world.refinePoint3DAbsoluteLocation(null,10);
		world.copyPoint3DToMatchEstimates();

		world.relativeFFromSamples();

		world.estimate3DErrors(true, true);


		world.estimate3DErrors(true);

		world.filterPatch3D();

		// filter pairwise
		// world.filterGlobalMatches(null,null, 3.0,3.0,null,null, false); // 2 = many | 3 = no dropping
		// filter bad points
		// world.filterGlobalPoints(4.0); // 3 medium
		// world.filterPatch3D(4.0); // 3 medium

		// local
		// world.filterLocal3D(4.0); // 3 medium
		//world.filterLocal2D(); 2D neighbor voting: F / R / ...

		// reestimate cameras
			/*
			// single camera
			for(var i=0; i<views.length; ++i){
				view = views[i];
				world.refineSelectCameraAbsoluteOrientation([view], null, 50); // 10-100
			}
			*/
		world.dropNegative3D();
		world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);

		world.refineCameraAbsoluteOrientation(null,100);

		//
		world.printPoint3DTrackCount();
	}

// throw "...";


	// BA loop
	// view nonlinear
	// point nonlinear

	// patch drop inconsistencies
	// point drop MATCH-BASED R ERROR
	// point drop WORLD-BASED R ERROR


	// var worldPoints = world.toPointArray();
	// console.log(worldPoints);



		// KEEP THE VIEW INFO
		// KEEP THE CAMERA INFO

		// GET POINT3D ABSOLUTE LOCATIONS & NORMALS


		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_BUNDLE_FILE_NAME);

		console.log("SAVE TO BUNDLE FILE");


throw "... save auto.yaml"


	var str = world.toYAMLString();
	// console.log(str);
	var binary = Code.stringToBinary(str);
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, "auto.yaml");
	var callback = function(){
		console.log("saved");
	};
	var context = project;
	var object = {};
	console.log("save auto");
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}

App3DR.ProjectManager.prototype.iterateDenseTracks = function(){
	console.log("iterateDenseTracks");
	var project = this;
	// do operations
	var fxnTracksLoaded = function(){
		console.log("fxnTracksLoaded");
		project._iterateDenseTracksStart();
	}
	// load dense file
	project.loadDense(fxnTracksLoaded, project);
}
/*
App3DR.ProjectManager.prototype._iterateDenseTracksEnd_UNUSED = function(object, data){ // all pair's dense points are loaded
console.log("_iterateDenseTracksEnd");
throw "?";
	var project = this;
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	if(Code.isArray(yaml)){
		yaml = yaml[0];
	}
	object["datas"].push(yaml);
	object["loadedCount"] += 1;
	if(object["loadedCount"] == object["expectedCount"]){
		console.log("continue");
		var denseData = this.denseData();
		var denseCameras = denseData["cameras"];
		var denseViews = denseData["views"];
		var densePairs = denseData["pairs"];
		var densePoints = denseData["points"];
		var currentPair = denseData["currentPair"];
		var datas = object["datas"];
		// PREP
		var stage = GLOBALSTAGE;
var denseViewLookup = {};
var denseViewLookupIndex = {};
for(var i=0; i<denseViews.length; ++i){
	var v = denseViews[i];
	var vid = v["id"];
	denseViewLookup[vid] = v;
	denseViewLookupIndex[vid] = i;

}
		// WORLD
		var world = new Stereopsis.World();
		var cameras = project.cameras();
		var views = project.views();
		var info = project._addGraphViews(world, denseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];
		var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);

var lookupViewFromID = {};
var lookupIndexFromID = {};
var lookupViewFromIndex = {};
for(var i=0; i<worldViews.length; ++i){
	var v = worldViews[i];
	var vid = v.data();
	lookupViewFromID[vid] = v;
	lookupIndexFromID[vid] = i;
	lookupViewFromIndex[i] = v;
}

		world.copyRelativeTransformsFromAbsolute(); // transforms avail
console.log("COMBINING ALL TRACK POINTS");
world.printPoint3DTrackCount();
		for(var i=0; i<datas.length; ++i){
			var data = datas[i];
			var dataPoints = data["points"];
			console.log(dataPoints.length);
			project._embedTrackPoints(world, dataPoints, lookupViewFromIndex);
world.printPoint3DTrackCount();
		}
		console.log(densePoints.length);
		project._embedTrackPoints(world, densePoints, lookupViewFromIndex);
world.printPoint3DTrackCount();


var worldPoints = world.toPointArray();
console.log("total points: "+worldPoints.length);

		var pointPoints = project._getGraphPointsFromWorld(world, lookupIndexFromID, false);
		console.log(pointPoints);
		var pointData = {};
			pointData["cameras"] = denseCameras;
			pointData["views"] = denseViews;
			pointData["points"] = pointPoints;

		var fxnSavedProject = function(){
			console.log("PROJECT SAVED")
		}
		var fxnSavedPoints = function(){
			console.log("POINT FILE SAVED")
			project.saveProjectFile(fxnSavedProject, project);
		}

		project.setDenseCount(worldPoints.length);
		project.setPointsFilename(App3DR.ProjectManager.RECONSTRUCT_POINTS_FILE_NAME);
		// SAVE
		project.savePointsFromData(pointData, fxnSavedPoints, project);
	}
}
*/
App3DR.ProjectManager.prototype._iterateDenseTracksStart = function(){
	var project = this;
	console.log("Dense");
	console.log(this.denseData());
	var denseData = this.denseData();
	var denseCameras = denseData["cameras"];
	var denseViews = denseData["views"];
	var densePoints = denseData["points"];
	var densePointCount = denseData["pointCount"];
	var densePairs = denseData["pairs"];
	var currentPair = denseData["currentPair"];
	var denseTriples = denseData["triples"];
	var currentTriple = denseData["currentTriple"];

	var sortAlphabet = function(a,b){
		return a<b ? -1 : 1;
	}

	currentPair++;
	if(currentPair>=densePairs.length){ // load all dense pairs at same time


	if(denseTriples == null){
		
		// go thru all pairs ...
		var triples = {};
		for(var i=0; i<densePairs.length; ++i){
			var pairA = densePairs[i];
			var idA1 = pairA["A"];
			var idA2 = pairA["B"];
			// console.log(pairA);
			for(var j=i+1; j<densePairs.length; ++j){
				var pairB = densePairs[j];
				var idB1 = pairB["A"];
				var idB2 = pairB["B"];
				// console.log(pairB);
				overlap = idA1==idB1 || idA1==idB2 || idA2==idB1 || idA2==idB2;
				if(overlap){
					var unique = {};
						unique[idA1] = 1;
						unique[idA2] = 1;
						unique[idB1] = 1;
						unique[idB2] = 1;
					var keys = Code.keys(unique);
					keys.sort(sortAlphabet);
					var index = keys[0]+"-"+keys[1]+"-"+keys[2];
					if(!triples[index]){
						var triple = {};
						triple["A"] = keys[0];
						triple["B"] = keys[1];
						triple["C"] = keys[2];
						triples[index] = triple;
					}
				}
			}
		}

		triples = Code.objectToArray(triples);
		console.log(triples);

throw "before save triples";

		denseTriples = triples;
		denseData["triples"] = denseTriples;
		currentTriple = -1;
		console.log("START TRIPLES");
	} // else triples exist
	console.log(currentTriple);
	++currentTriple;
	if(currentTriple>=denseTriples.length){ // done with triples

		// DO ABSOLUTE TRANSFORMS ....


		this._denseAbsoluteOrientation(denseData);

		throw "done with triples";
	} // continue triples
	var triple = denseTriples[currentTriple];
	//
	var densePairsLookup = {};
	for(var i=0; i<densePairs.length; ++i){
		var pair = densePairs[i];
		var list = [pair["A"],pair["B"]];
		list.sort(sortAlphabet);
		var idA = list[0];
		var idB = list[1];
		var index = idA+"-"+idB;
		densePairsLookup[index] = pair;
	}
	console.log(densePairsLookup);
	var idA = triple["A"];
	var idB = triple["B"];
	var idC = triple["C"];
	// up to 3 
	var idAB = idA+"-"+idB;
	var idAC = idA+"-"+idC;
	var idBC = idB+"-"+idC;
	var pairAB = densePairsLookup[idAB];
	var pairAC = densePairsLookup[idAC];
	var pairBC = densePairsLookup[idBC];
	var putative = [pairAB,pairAC,pairBC];
	var loadPairs = [];
	for(var i=0; i<putative.length; ++i){
		var pair = putative[i];
		if(pair){
			loadPairs.push(pair);
		}
	}
	console.log(loadPairs);


	var expectedPairs = loadPairs.length;
	var loadedPairs = 0;
	var loadedPairData = [];
	var self = this;

	var handleLoadedPair = function(a,o){
		console.log("handleLoadedPair"+loadedPairs);
		var string = Code.binaryToString(o);
		var object = YAML.parse(string);
		if(Code.isArray(object)){
			object = object[0];
		}
		loadedPairData.push(object);
		++loadedPairs;
		if(loadedPairs==expectedPairs){
			console.log(loadedPairData)
			var info = this._tripleInfoFromPairList(loadedPairData, denseViews, denseCameras, handleScaleInfoCompleted);
		}
	}

		var handleScaleInfoCompleted = function(info){
			console.log(info);
			throw "is error in this?"
			var scales = info;
			var sAB = scales["AB"];
			var sAC = scales["AC"];
			var sBC = scales["BC"];
			var eAB = error["AB"];
			var eAC = error["AC"];
			var eBC = error["BC"];
			triple["gauge"] = {"AB":sAB, "AC":sAC, "BC":sBC};
			triple["error"] = {"AB":eAB, "AC":eAC, "BC":eBC};
			denseData["currentTriple"] = currentTriple;
			console.log(denseData);
			project.saveDenseFromData(denseData, fxnSavedDense, this);
		}

		var fxnSavedDense = function(){
			console.log("fxnSavedDense");
			// project.saveProjectFile(fxnSavedProject, project);
		}

		for(var i=0; i<loadPairs.length; ++i){
			var pair = loadPairs[i];
			var pairID = pair["id"];
			// handleLoadedPair();
			var path = this.densePairPathFromID(pairID);
			console.log("dense pair: "+pairID+" = "+path);
			this.addOperation("GET", {"path":path}, handleLoadedPair, this, null);
		}
		console.log("load triples");
		return;
	} // else copy dense pair using updated transforms
	var densePair = densePairs[currentPair];

	var denseViewLookup = {};
	var denseViewLookupIndex = {};
	for(var i=0; i<denseViews.length; ++i){
		var v = denseViews[i];
		var vid = v["id"];
		denseViewLookup[vid] = v;
		denseViewLookupIndex[vid] = i;

	}
	console.log(densePair);
	var densePairID = densePair["id"];
	var densePairErrorF = densePair["errorF"];
	var densePairErrorR = densePair["errorR"];
	// console.log("densePairError: "+densePairErrorR);

	// this pair not exist
	var pair = this.pairFromID(densePairID);
	if(!pair){
		throw "this pair only exists as a dense pair, not an initial sparse pair";
	}
	var viewA = pair.viewA();
	var viewB = pair.viewB();
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var viewAIndex = denseViewLookupIndex[viewA.id()];
	var viewBIndex = denseViewLookupIndex[viewB.id()];
	var loadViews = project.auxilaryViewsToLoadForSet([viewAIndex,viewBIndex],denseData, 6);
	console.log(loadViews);
	for(var i=0; i<loadViews.length; ++i){
		loadViews[i] = project.viewFromID(denseViews[loadViews[i]]["id"]);
	}
	// console.log(viewA,viewB);
	var fxnViewsLoaded = function(){
		console.log("fxnViewsLoaded");
		console.log(project.views());
		// fxnPairLoaded();
		// don't actually care about old existing points ... want to start from scratch
		// App3DR.ProjectManager.loadPairsRelativeData([pair], fxnPairLoaded, project, null);
	// }
	// var fxnPairLoaded = function(){
		// console.log("fxnPairLoaded");
		// var relativeData = pair.relativeData();
		// console.log(viewA.bundleAdjustImage());
		// console.log(viewB.bundleAdjustImage());
		// utils
		var stage = GLOBALSTAGE;
		// create world
		var world = new Stereopsis.World();
		// var cameras = project.cameras();

		console.log(denseData);
		throw "cameras from graph / dense?"

		var views = project.views();
		// ?
		var info = project._addGraphViews(world, denseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];
		// ?
		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		// only want this pair in:
		var pairViews = [];
		var pairImages = [];
		var pairTransforms = [];
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			if(view==viewA || view==viewB){
				pairViews.push(view);
				pairImages.push(images[i]);
				pairTransforms.push(transforms[i]);
			}
		}
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, pairViews, pairImages, pairTransforms);
		var denseViewLookupViewFromID = {};
		var denseViewLookupViewFromIndex = {};
		var denseViewLookupIndexFromID = {};
		//
		for(var i=0; i<worldViews.length; ++i){
			var v = worldViews[i];
			denseViewLookupViewFromID[v.data()] = v;
			denseViewLookupViewFromIndex[i] = v;
			denseViewLookupIndexFromID[v.data()] = i;
		}
		// find best points from stereopsis
		var worldViewA = world.viewFromData(viewAID);

throw "is this solve dense pair used"
		var worldViewB = world.viewFromData(viewBID);
		world.solveDensePair();
		console.log(worldViewA,worldViewB);
		var transformAB = world.transformFromViews(worldViewA,worldViewB);
		console.log(transformAB);
		transformAB.rMean(0);
		transformAB.rSigma(densePairErrorR);
		console.log(transformAB.rMean(),transformAB.rSigma());
		var errorF = transformAB.fMean() + transformAB.fSigma();
		var errorR = transformAB.rMean() + transformAB.rSigma();
		var transformR = transformAB.R(worldViewA,worldViewB);
		var transformF = transformAB.F(worldViewA,worldViewB);
		console.log(transformF);
		console.log(transformR);
		var pointCount = transformAB.matchCount();

// throw "dense iteration end";

		// var denseViewLookupViewIndexFromID = {};
		// for(var i=0; i<worldViews.length; ++i){
		// 	var view = worldViews[i];
		// 	denseViewLookupViewIndexFromID[view.id()] = i;
		// 	// denseViewLookupViewIndexFromID[i] = i;
		// }
		// console.log(denseViewLookupViewIndexFromID);


		// var str = world.toYAMLString();
		// console.log(str);

		// save dense file : dense/pair/dense.yaml
		var justPoints = project._getGraphPointsFromWorld(world, denseViewLookupIndexFromID, false);
		// console.log(justPoints);
		var justData = [];
		justData["id"] = densePairID;
		justData["A"] = viewAID;
		justData["B"] = viewBID;
		justData["points"] = justPoints;
		justData["R"] = transformR;
		justData["errorR"] = errorR;
		console.log(justData);

		// var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY, densePairID, App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME);
		var path = this.densePairPathFromID(densePairID);
		console.log("dense pair: "+densePairID+" = "+path);


		var callback = function(){
			console.log("saved dense data");
		}
		var context = this;
		var object = {};
		var yaml = new YAML();
		yaml.writeComment("Dense");
		yaml.writeObjectLiteral(justData);
		var str = yaml.toString();
		var binary = Code.stringToBinary(str);

// throw "dense iteration end";
		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);

		// save working file
		densePair["errorF"] = errorF;
		densePair["errorR"] = errorR;
		densePair["R"] = transformR;
		densePair["F"] = transformF;
		densePair["pointCount"] = pointCount;
		denseData["currentPair"] += 1;
		this.saveDenseFromData(denseData);
	}
	App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
}


App3DR.ProjectManager.prototype._tripleInfoFromPairList = function(pairs, views, cameras, completeFxn){
	console.log("_tripleInfoFromPairList");
	var project = this;
	// var viewIDs = {};
	// for(var i=0; i<pairs.length; ++i){
	// 	var pair = pairs[i];
	// 	console.log(pair)
	// 	var idA = pair["A"];
	// 	var idB = pair["B"];
	// 	viewIDs[idA] = "";
	// 	viewIDs[idB] = "";
	// }
	// viewIDs = Code.keys(viewIDs);// Code.objectToArray(viewIDs);
	// console.log(viewIDs);
	// var views = [];
	// for(var i=0; i<viewIDs.length; ++i){
	// 	var viewID = viewIDs[i];
	// 	var view = project.viewFromID(viewID);
	// 	views.push(view);
	// }

	// sizes
	var images = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		images.push( new V2D().fromObject(view["size"]) );
	}	



	// fill world in
	world = new Stereopsis.World();
	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	App3DR.ProjectManager.addViewsToWorld(world, views, images);
	var worldViews = world.toViewArray();
	
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		worldViewLookup[worldViews[i].data()] = worldViews[i];
	}
	console.log("add matching points");
	var pointsList = [];
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var idA = pair["A"];
		var idB = pair["B"];
		var points = pair["points"];
		// console.log(points);
		// App3DR.ProjectManager.addPointsToWorld(world, points);
		
		var worldViewLookupPair = {};
		worldViewLookupPair[0] = worldViewLookup[idA];
		worldViewLookupPair[1] = worldViewLookup[idB];

		// var points3D = this._embedMatchPoints(world, points, worldViewLookup);
		var points3D = App3DR.ProjectManager._worldPointFromSaves(world, points, worldViewLookupPair);
		// console.log(points3D);
		// world.patchInitBasicSphere(true);
		// var points3D = world.toPointArray();
		// world.disconnectPoints3D(points3D);
		pointsList.push(points3D);
		console.log(" "+i+" = "+points3D.length);
		var R = pair["R"];
			R = new Matrix().fromObject(R);
		App3DR.ProjectManager.addTransformToWorld(world, R, idA, idB);
	}
	console.log(world);
	console.log(pointsList);
	// add points in
	console.log("add points with patches");
	for(var i=0; i<pointsList.length; ++i){
		var points3D = pointsList[i];
		// world.embedPoints3D(points3D);
		world.embedPoints3DNoValidation(points3D);
		// world.printPoint3DTrackCount();
	}
	// solve for relative scalings & whatnot
	console.log("solveTriple");
	var worldTripleCompleted = function(payload){
		console.log("worldTripleCompleted");
		console.log(payload);
		var scales = payload["scales"]
		// var TFT = payload["T"];
		// var meanTFT = payload["errorTMean"];
		// var sigmaTFT = payload["errorTSigma"];
		console.log(scales);
		var sAB = scales["AB"];
		var sAC = scales["AC"];
		var sBC = scales["BC"];

throw "HEEEEerere "
		// var vA = scales["A"];
		// var vB = scales["B"];
		// var vC = scales["C"];
		// var lookup = {};
		// 	lookup[viewA.data()+"-"+viewB.data()] = sAB;
		// 	lookup[viewB.data()+"-"+viewA.data()] = sAB;
		// 	lookup[viewA.data()+"-"+viewC.data()] = sAC;
		// 	lookup[viewC.data()+"-"+viewA.data()] = sAC;
		// 	lookup[viewB.data()+"-"+viewC.data()] = sBC;
		// 	lookup[viewC.data()+"-"+viewB.data()] = sBC;
		// var scaleAB = lookup[idA+"-"+idB];
		// var scaleAC = lookup[idA+"-"+idC];
		// var scaleBC = lookup[idB+"-"+idC];

		// console.log(scaleAB,scaleAC,scaleBC);
		// ...
		// triple.setRelativeScales(scaleAB,scaleAC,scaleBC);
		completeFxn(scales);
		// return scales;

	}
	world.solveTriple(worldTripleCompleted, project, null);
}

App3DR.ProjectManager.prototype._denseAbsoluteOrientation = function(data){
	var project = this;
	console.log(data);
	var views = data["views"];
	var cameras = data["cameras"];
	var pairs = data["pairs"];
	var triples = data["triples"];
	var result = this._absoluteViewsFromDensePairs(views, pairs, triples);
	console.log(result);

	var transforms = result["transforms"];

	var viewFromID = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view["id"];
		viewFromID[viewID] = view;
	}
	var viewIDs = result["views"];
	var pointData = {};
	var pointViews = [];

	for(var i=0; i<viewIDs.length; ++i){
		var viewID = viewIDs[i];
		var sourceView = viewFromID[viewID];
		// console.log(sourceView);
		var camID = sourceView["camera"];
		var size = sourceView["size"];
		var absolute = transforms[i];
			var extrinsic = Matrix.inverse(absolute);
			// var extrinsic = transform;
		view = {"id":viewID, "R":extrinsic, "camera":camID, "size":size};
		pointViews.push(view);
	}
	var pointPairs = [];
	var totalCount = 0;
	for(var i=0; i<pairs.length; ++i){
		var sourcePair = pairs[i];
		var pointCount = sourcePair["pointCount"];
		var pair = {};
			pair["id"] = sourcePair["id"];
			pair["A"] = sourcePair["A"];
			pair["B"] = sourcePair["B"];
			pair["pointCount"] = pointCount;
			pair["need"] = null;
			totalCount += pointCount;
			// pair["errorR"] = sourcePair["errorR"];
		pointPairs.push(pair);
	}
	var timestampNow = Code.getTimeStampFromMilliseconds();
	pointData["cameras"] = cameras;
	pointData["views"] = pointViews;
	pointData["skeleton"] = null;
	pointData["pending"] = pointPairs;
	pointData["pendingIndex"] = -1;
	pointData["points"] = null;
	pointData["stash"] = null;
	pointData["created"] = timestampNow;
	console.log(pointData);

throw "abs locations are bad";
		var fxnSavedProject = function(){
			console.log("PROJECT SAVED");
		}
		var fxnSavedPoints = function(){
			console.log("POINT FILE SAVED");
			project.saveProjectFile(fxnSavedProject, project);
		}

		project.setDenseCount(totalCount);
		project.setPointsFilename(App3DR.ProjectManager.RECONSTRUCT_POINTS_FILE_NAME);
		// SAVE
		project.savePointsFromData(pointData, fxnSavedPoints, project);
}

App3DR.ProjectManager.prototype.densePairPathFromID = function(densePairID){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY, densePairID, App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME);
	// console.log("dense pair: "+densePairID+" = "+path);
	return path;
}
App3DR.ProjectManager.prototype.iterateSparseTracks = function(){
	console.log("iterateSparseTracks");
	var project = this;
	// backwards:
	var fxnTracksLoaded = function(){
		console.log("fxnTracksLoaded");
		project._iterateSparseTracksStart();
	}
	// load sparse file
	project.loadSparse(fxnTracksLoaded, project);
}


App3DR.ProjectManager.prototype._absoluteViewsFromDensePairs = function(views, pairs, triples){
	console.log("_absoluteViewsFromDensePairs");
throw "is this used ?"
	var viewToID = function(view){
		return view["id"];
	};
	var pairToIDs = function(pair){
		return [pair["A"],pair["B"]];
	};
	var pairToError = function(pair){
		// ...
		// return 1/pair["errorR"];
		// return 1.0;
		return pair["errorR"];
		// return pair["errorR"]/pair["pointCount"];
	};
	var pairToTransform = function(pair, idA,idB){
		var A = pair["A"];
		var B = pair["B"];
console.log("PAIR TO  TRANS ???");
		// console.log(A,idA,B,idB);
		var R = pair["R"];
			R = new Matrix().fromObject(R);
		// R = Matrix.inverse(R);
		return R;
	};
	var tripleToIDs = function(triple){
		return [triple["A"],triple["B"],triple["C"]];
	};
	var tripleToScales = function(triple){
		var gauge = triple["gauge"];
		return gauge;
	};


	var originalTransforms = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var R = view["R"];
			R = new Matrix().fromObject(R);
		originalTransforms[i] = R;
	}

	var info = R3D.optimumTransform3DFromObjectLookup(views, pairs, triples, viewToID,pairToIDs,tripleToIDs, pairToError,pairToTransform,tripleToScales,  originalTransforms);
	var transforms = info["transforms"];
	var listPairs = info["listPairs"];
	var viewIDs = info["views"];

	console.log(info);





	
/*
// TESTING KEEPING ORIGINAL:

	// viewIDs
	var tableViewIDToIndex = {};
	var tableViewIndexToID = {};
	var tableViewIDToView = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = viewToID(view);
		tableViewIDToView[viewID] = view;
		tableViewIDToIndex[viewID] = i;
		tableViewIndexToID[i+""] = viewID;
	}

	for(var i=0; i<viewIDs.length; ++i){
		var viewID = viewIDs[i];
		var view = tableViewIDToView[viewID];
		var R = view["R"];
			R = new Matrix().fromObject(R);
		transforms[i] = R;
	}
*/

	this.displayViewGraph(transforms,listPairs, 100);

	return info;
	// {"transforms":transforms, "views":viewIDs, "skeleton":result};
}

App3DR.ProjectManager.prototype.iterateDenseLoading = function(){
	console.log("iterateDenseLoading");
	var project = this;
	// do operations
	var fxnTracksLoaded = function(){
		console.log("fxnTracksLoaded");
		project._iterateDenseLoadingStart();
	}
	// load points file
	project.loadPoints(fxnTracksLoaded, project);
}

App3DR.ProjectManager._worldPointFromSaves = function(world, points, viewLookup, skipUp){
	skipUp = Code.valueOrDefault(skipUp, false);
	var points3D = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p3D = new V3D(point["X"],point["Y"],point["Z"]);
		var n3D = new V3D(point["x"],point["y"],point["z"]);
		var s3D = point["s"];
		var entries = point["v"];
		if(!entries){
			entries = point["views"];
		}
		var vs = [];
		var ps = [];
		for(var j=0; j<entries.length; ++j){
			var entry = entries[j];
			var v = entry["i"];
			if(!v){
				v = entry["view"];
			}
			var p2D = new V2D(entry["x"],entry["y"]);
			// console.log(p2D);
			v = viewLookup[v];
			vs.push(v);
			ps.push(p2D);
		}
		var point3D = world.newPoint3DFromPieces(vs,ps,null);
		point3D.point(p3D);
		point3D.normal(n3D);
		point3D.size(s3D);
		// up
		if(!skipUp){
			world.setP3DPatchUpFromViews(point3D);
		}
		points3D.push(point3D);
	}
	return points3D;
}
App3DR.ProjectManager.prototype._iterateDenseLoadingStart = function(){
	// var cellPercentSize = 0.02; // 1% = dense
	var cellPercentSize = 0.01;
	var project = this;
	var pointsData = project.pointsData();
	console.log("_iterateDenseLoadingStart");
	console.log(pointsData);

	var pendingList = pointsData["pending"];
	var pendingIndex = pointsData["pendingIndex"];
	var stash = pointsData["stash"];
	var cameras = pointsData["cameras"];
	var views = pointsData["views"];
	var existingPoints = Code.valueOrDefault(pointsData["points"], []);
	// console.log(cameras);
	// console.log(views);
	// prep
	var tableViewFromID = {};
	var lookupIndexFromID = {};
	var images = [];
	var sizes = [];
	var transforms = [];
// console.log(views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var vid = view["id"];
		lookupIndexFromID[vid] = i;
		tableViewFromID[vid] = views[i];
		images[i] = null;
		var R = view["R"];
			R = Matrix.fromObject(R);
		transforms[i] = R;
		var size = view["size"];
			size = V2D.fromObject(size);
		sizes[i] = size;
	}

	///
	var stage = GLOBALSTAGE;
	// world:
	var world = new Stereopsis.World();
	var info = project._addGraphViews(world, tableViewFromID, stage);
	// var images = info["images"];
	var transforms = info["transforms"];
	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, sizes, transforms);
	// console.log(worldViews);
	// console.log(world);
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		var view = worldViews[i];
		var viewID = view.data();
			// worldViewLookup[viewID] = view;
			worldViewLookup[i] = view;
		var size = view.sizeFromPercent(cellPercentSize);
		console.log(size);
		view.cellSize(size);
		console.log("SIZES: "+view.cellSize()+" | "+view.compareSize());
	}
	// set view abs locations
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	var viewID = view["id"];
	// 	console.log(view);
	// 	var v = world.viewFromData(viewID);
	// 	console.log(v);
	// }

	// get relative from abs
	// var transforms = world.toTransformArray();
	// for(var i=0; i<transforms.length; ++i){
	// 	var transform = transforms[i];
	// 	transform.copyRelativeFromAbsolute();
	// }
	console.log("COPY ...")
	world.copyRelativeTransformsFromAbsolute();
	// world.copyRelativeTransformsFromAbsolute();


	// add existing points

	console.log("EXISTING");
	console.log(worldViewLookup);
	console.log("creating world points");
	// var trackData = {"points":existingPoints};
	console.log(existingPoints);
	var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, existingPoints, worldViewLookup);
	console.log(points3DExisting);
	console.log("embedding points");
	world.checkForIntersections(false);
	var timeA = Code.getTimeMilliseconds();
	world.embedPoints3D(points3DExisting);
	var timeB = Code.getTimeMilliseconds();
	console.log("DELTA: "+(timeB-timeA));
	console.log("embedded points");

console.log("pendingIndex: "+pendingIndex);

	// add next pair's dense points
	pendingIndex++;
	if(pendingIndex>=pendingList.length){ // all points loaded, save to BA
		var pointsCount = existingPoints.length;
		console.log(pointsCount);
		// get a BA object:
		world.estimate3DErrors(true);
		world.patchInitBasicSphere(true);
		// world.estimate3DErrors(true);
		world.solveFullDenseIterate();
		// check it out
		var str = world.toYAMLString();
		console.log(str);
		// var obj = ;
		console.log("... POINTS");
		// SAVE TO BUNDLE ADJUST FILE
		var saveBACompleteFxn = function(){
			console.log("saveBAFxnComplete");
			project.saveProjectFile(saveProjectCompleteFxn, project);
		}

		var saveProjectCompleteFxn = function(){
			console.log("saveProjectCompleteFxn");
		}

		//
		var filename = App3DR.ProjectManager.RECONSTRUCT_BUNDLE_FILE_NAME;
		console.log(filename);
		this.setBundledFilename(filename);
		this.setPointsCount(pointsCount);
		

		// App3DR.ProjectManager.prototype.saveBundled = function(string, filename, callback, context, object)
		this.saveBundled(str, filename, saveBACompleteFxn, project, null);

		return;
	}

	var densePair = pendingList[pendingIndex];
	var densePairID = densePair["id"];
	// var densePairData = null;
	var densePairPoints = null;
	var densePairReadyFxn = function(object,data){
		var densePairData = this.dataToObject(data);
		console.log(densePairData);
		var viewAID = densePair["A"];
		var viewBID = densePair["B"];
		densePairPoints = densePairData["points"];
		// add existing points
		var worldViewLookupPair = {};
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var viewID = view.data();
			if(viewID==viewAID){
				worldViewLookupPair[0] = view;
			}else if(viewID==viewBID){
				worldViewLookupPair[1] = view;
			}
		}
		console.log(worldViewLookupPair);
		console.log("embedding points 2");
		
		// init P3D 
		var points3DNew = App3DR.ProjectManager._worldPointFromSaves(world, densePairPoints, worldViewLookupPair);

		console.log(points3DNew);
		world.checkForIntersections(false);
		var timeA = Code.getTimeMilliseconds();
		world.embedPoints3D(points3DNew);
		var timeB = Code.getTimeMilliseconds();
		console.log("DELTA: "+(timeB-timeA));
		// 
		// init peach p3d info
		// estimate patches

		// estimate R error
		console.log("err");
		world.estimate3DErrors(true);
		console.log("pat");
		// TODO: ONLY DO AFFINE -- ALREADY HAVE PATCH SIZE & NORMAL ???
		world.patchInitBasicSphere(true); // only the actually merged points need this calculated -- can delay until need
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		console.log("remove");
		// remove new points:
		world.disconnectPoints3D(points3DNew);
		// 
		// 
		console.log("add with intersection");
		// throw "?"
		// amerge
		world.checkForIntersections(true);
		world.resolveIntersectionByGeometry();
		var timeA = Code.getTimeMilliseconds();
		world.embedPoints3D(points3DNew);
		var timeB = Code.getTimeMilliseconds();
		console.log("DELTA: "+(timeB-timeA));
		console.log("embedded points 2");
		console.log(world);
		world.printPoint3DTrackCount();
		// var allPoints = world.toPointArray();
		var pointPoints = project._getGraphPointsFromWorld(world, lookupIndexFromID, false);
		// 
		// save as update
		pointsData["pendingIndex"] = pendingIndex;
		pointsData["points"] = pointPoints;
		var pointCount = pointPoints.length;
		project.setPointsCount(pointCount);
		// 
		console.log(pointsData);
		console.log(pointPoints);
		console.log(pointCount);
		// 
// throw "to save - points iteration";
		// project.savePointsFromData(pointsData, fxnSavedPoints, project);
		project.savePointsFromData(pointsData, fxnSavedPointsNA, project);
	}

	var fxnSavedProject = function(){
		console.log("PROJECT SAVED")
	}
	var fxnSavedPointsNA = function(){
		console.log("POINT FILE SAVED");
	}
	var fxnSavedPoints = function(){
		console.log("POINT FILE SAVED");
		// project.saveProjectFile(fxnSavedProject, project);
	}

	var densePairPointsReadyFxn = function(){
		console.log(densePairPoints);
		throw "densePairPointsReadyFxn";
	}
	if(stash){
		throw "TODO - merge points here first";
		densePairPointsReadyFxn(stash);
	}else{
		// var path = this.densePairPathFromID(densePairID);
		this.loadDenseDataForPairID(densePairID, densePairReadyFxn, project, null);
		// pairID, callback, context, object
	}

	/*
	increment index
	set current pending
	if stash not empty -- set this as points to merge
	else -- set pair as need to load
	images to load:
		- A & B [2]
		at least 4 :
		- stash?
			- use NEED list to prioritize first N
		- most common pairs
			- lookup pairs with most common numbers first
		append image list until max number found
	- load images
	
	- setup world
		- insert views
		- set images for loaded views
		- insert tracks without intersection
		- insert points with intersection
		=> event trigger for any point merge that doesn't have a view loaded for both intersection points
			- project record point,
			- world 'drop' point on floor
	- re-grab ALL points from world & set as 
	
	- if trigger list / stash is not empty, set as new "NEED" list
	- else increment index
	
	SAVE





.....


	*/
	throw "here";

}

App3DR.ProjectManager.prototype._iterateSparseTracksStart = function(){ // keep going until delta errors are all below some amount
	var project = this;
	var minimumDeltaError = 0.01; // change in pixels
	var sparseData = this.sparseData();
	var sparseEdgeSort = function(a,b){
		var aErrorDelta = a["deltaErrorR"];
		var bErrorDelta = b["deltaErrorR"];
		var aHasDelta = aErrorDelta != null;
		var bHasDelta = bErrorDelta != null;
		if(!aHasDelta && !bHasDelta){
			var aCount = a["count"];
			var bCount = b["count"];
			return aCount > bCount ? -1 : 1;
		}else if (aHasDelta && !bHasDelta){
			return 1; // B
		}else if (!aHasDelta && bHasDelta){
			return -1; // A
		}
		return aErrorDelta > bErrorDelta ? -1 : 1;
	}
	var sparsePoints = sparseData["points"];
	var sparseViews = sparseData["views"];
	var sparseCameras = sparseData["cameras"];
	var sparsePairs = sparseData["pairs"];
	var sparseIterations = sparseData["iterations"];
	var orderedPairs = Code.copyArray(sparsePairs);
	orderedPairs.sort(sparseEdgeSort);
	// console.log(sparsePairs);
	console.log(orderedPairs);
	// pick edge to load
	var topPair = orderedPairs[0];
	var isDone = false;
// TODO: ADD BACK LIMITS:
	
	var topError = topPair["deltaErrorR"];
	if(topError!==null){
		isDone = topError < minimumDeltaError;
	}
	var maxSparseIterations = sparseViews.length*10; // ? pairs count ?
	if(sparseIterations>maxSparseIterations){
		isDone = true;
	}
	
// isDone = true;

console.log("isDone: "+isDone);



	var viewAIndex = topPair["A"];
	var viewBIndex = topPair["B"];
	var sparseViewA = sparseViews[viewAIndex];
	var sparseViewB = sparseViews[viewBIndex];
	// pick additional views to load

var loadViews = [];
if(!isDone){

	var loadViews = this.auxilaryViewsToLoadForSet([viewAIndex,viewBIndex],sparseData, 6);
	for(var i=0; i<loadViews.length; ++i){
		loadViews[i] = this.viewFromID(sparseViews[loadViews[i]]["id"]);
	}
}

	// console.log(viewA,viewB);
	var fxnViewsLoaded = function(){
		console.log("fxnViewsLoaded");
		console.log(sparseData);
		// need to re-get these ...
		var sparsePoints = sparseData["points"];
		var sparseViews = sparseData["views"];
		var sparseCameras = sparseData["cameras"];
		var sparsePairs = sparseData["pairs"];
		var sparseIterations = sparseData["iterations"];


		var sparseViewLookup = {};
		for(var i=0; i<sparseViews.length; ++i){
			var vid = sparseViews[i]["id"];
			sparseViewLookup[vid] = sparseViews[i];
		}
		var stage = GLOBALSTAGE;
		// create world
		var world = new Stereopsis.World();
		// var cameras = project.cameras();

		console.log(sparseData);
		throw "cameras from graph / sparse?"

		var views = project.views();

		var info = project._addGraphViews(world, sparseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];

		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
		console.log(worldViews);

		// set cell sizes to medium ?
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			// var size = view.sizeFromPercent(0.01); // fine
			// var size = view.sizeFromPercent(0.02); // med?
			// var size = view.sizeFromPercent(0.05); // coarse
			// var size = view.sizeFromPercent(0.10); // too big
			// view.cellSize(size);
			console.log("SIZES: "+view.cellSize()+" | "+view.compareSize());
		}

		var sparseViewLookupIndex = [];
		var sparseViewLookupIndexIndex = [];
		var sparseViewLookupIndexToID = {};
		var sparseViewLookupIDToIndex = {};
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var index = i;
			var viewID = view.data();
			sparseViewLookupIndex[index] = view;
			sparseViewLookupIndexToID[index] = viewID;
			sparseViewLookupIndexIndex[index] = index;
			sparseViewLookupIDToIndex[viewID] = index;
			view.data(i);
		}
		// var points3D = this._embedMatchPoints(world, sparseData, sparseViewLookupIndex);
		this._embedTrackPoints(world, sparseData, sparseViewLookupIndex);
		var points3D = world.toPointArray();
console.log("optimizing for views: "+viewAIndex+" & "+viewBIndex);
		var viewA = world.viewFromData(viewAIndex);
		var viewB = world.viewFromData(viewBIndex);
		var pairWorldViews = [viewA,viewB];


		if(isDone){ // no more
			// need error numbers:
			world.copyRelativeTransformsFromAbsolute();
			world.relativeFFromSamples();
			world.estimate3DErrors(true);
			console.log("done sparse");
			console.log(sparseData);
			var pointCount = sparsePoints.length;
			// save sparse data over to dense data & start loading dense points
			console.log("FINAL POINTS: "+pointCount);
			console.log(world);
			// get all pairs that should be attempted for dense pairing
			var transforms = world.transformsWithOverlap();
			var pairs = [];
			for(var i=0; i<transforms.length; ++i){
				var transform = transforms[i];
				var viewA = transform.viewA();
				var viewB = transform.viewB();
				var pair = {};
					var indexA = viewA.data();
					var indexB = viewB.data();
					var idA = sparseViewLookupIndexToID[indexA+""];
					var idB = sparseViewLookupIndexToID[indexB+""];
					var p = project.pairFromViewIDs(idA,idB);
					pair["id"] = p.id();
					pair["A"] = idA;
					pair["B"] = idB;
					pair["errorF"] = transform.fSigma();
					pair["errorR"] = transform.rSigma();
				pairs.push(pair);
			}
			// save
			var denseData = {};
			denseData["cameras"] = sparseData["cameras"];
			denseData["views"] = sparseViews;
			denseData["pairs"] = pairs;
			denseData["currentPair"] = -1;
			denseData["triples"] = null;
			denseData["currentTriple"] = -1;
			console.log(denseData);
// throw "about to save done";
			// SAVE PROJECT FILE
			var fxnSavedProject = function(){
				console.log("fxnSavedProject");
			}
			var fxnSavedDense = function(){
				console.log("fxnSavedDense");
				project.saveProjectFile(fxnSavedProject, project);
			}
			// SAVE
			project.setSparseCount(pointCount);
			project.setDenseFilename(App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME);
			project.saveDenseFromData(denseData, fxnSavedDense, this);
			return;
		} // else - not done


		// do refinement
		console.log("refine");
		world.copyRelativeTransformsFromAbsolute();
		world.printPoint3DTrackCount();
		world.relativeFFromSamples();
		world.estimate3DErrors(true);
		world.printErrorsDebugMatchCount();

		// RECORD INITIAL ERROR BETWEEN 2 VIEWS
		var transform = world.transformFromViews(viewA,viewB);
		var errorRStart = transform.rMean() + transform.rSigma();
		var errorFStart = transform.fMean() + transform.fSigma();

		// TODO: MAKE ASYNC
		world.solveSparseTracks(pairWorldViews, null, null);

		// update points
		var sparsePoints = project._getGraphPointsFromWorld(world, sparseViewLookupIndexIndex, false);
		sparseData["points"] = sparsePoints;

		// replace is with data:
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var data = sparseViewLookupIndexToID[i];
			view.data(data);
		}
// check it out
// var str = world.toYAMLString();
// console.log(str);
	
		// update views
		sparseViews = project._updateGraphViewsFromWorld(world, sparseViews, sparseCameras);
		sparseData["views"] = sparseViews;
		sparseData["iterations"] += 1;

		// update selected pair
		var transform = world.transformFromViews(viewA,viewB);
		var errorREnd = transform.rMean() + transform.rSigma();
		var errorFEnd = transform.fMean() + transform.fSigma();

		var deltaR = errorRStart - errorREnd;
		var deltaF = errorFStart - errorFEnd;
		console.log("deltaR / deltaF",deltaR,deltaF);
		console.log(topPair);
		topPair["errorR"] = errorREnd;
		topPair["errorF"] = errorFEnd;
		topPair["deltaErrorR"] = deltaR;
		topPair["deltaErrorF"] = deltaF;
		topPair["count"] = transform.matchCount();
		topPair["updated"] = Code.getTimeMilliseconds();
// if R error goes up ... ????
if(deltaR<0){
	console.log("ERROR WENT UP");
	// throw "?";
}

		// save
		console.log(sparseData);

		// check to see if should keep entries:
		var transforms = world.toTransformArray();
		var matchCounts = [];
		for(var i=0; i<transforms.length; ++i){
			var transform = transforms[i];
			matchCounts.push(transform.matchCount());
		}
		var max = Code.max(matchCounts);
		var sigma = Code.stdDev(matchCounts,max);
		var minKeepMatches = max - sigma*2.0;
			// minKeepMatches = Math.max(minKeepMatches,16);
		console.log(" TRANSFORM MATCH COUNTS: "+max+" +/- "+sigma+" : "+minKeepMatches);
		//
		var pairObjectsOld = sparseData["pairs"];
		var pairObjectsNew = [];
		for(var i=0; i<transforms.length; ++i){
			var transform = transforms[i];
			var matchCount = transform.matchCount();
			if(matchCount>=minKeepMatches){
				var viewA = transform.viewA();
				var viewB = transform.viewB();
				var indexA = sparseViewLookupIDToIndex[viewA.data()];
				var indexB = sparseViewLookupIDToIndex[viewB.data()];
				if(indexA>indexB){
					var temp = indexA;
					indexA = indexB;
					indexB = temp;
				}
				var exists = null;
				for(var j=0; j<pairObjectsOld.length; ++j){
					var p = pairObjectsOld[j];
					if( (p["A"]==indexA && p["B"]==indexB) || (p["B"]==indexA && p["A"]==indexB) ){
						exists = p;
						break;
					}
				}
				if(!exists){ // create new
					console.log("new pair passed minimum point requirement: "+matchCount+" / "+minKeepMatches);
					exists = {};
					exists["A"] = indexA;
					exists["B"] = indexB;
					// exists["count"] = matchCount; // TODO: SHOULD THIS ALWAYS BE UP TO DATE ?
					exists["errorR"] = null;
					exists["errorF"] = null;
					exists["deltaErrorR"] = null;
					exists["deltaErrorF"] = null;
					exists["updated"] = Code.getTimeMilliseconds();
				}
				exists["count"] = matchCount; // TODO: SHOULD THIS ALWAYS BE UP TO DATE ?
				pairObjectsNew.push(exists);
			} // else drop
		}
		pairObjectsNew.sort(function(a,b){
			return a["A"]<b["A"] ? -1 : 1;
		});
		sparseData["pairs"] = pairObjectsNew;

throw "NO SAVE"

		// var doneFxn = function(){
		// 	console.log("saved sparse data");
		// 	var url = Code.getURL();
		// 	var iterations = Code.getURLParameter(url,"iterations");
		// 	// console.log(iterations);
		// 	if(iterations!==null && iterations!==undefined && iterations!==0){
		// 		iterations -= 1;
		// 		// console.log(iterations);
		// 		if(iterations>0){
		// 			var url = Code.setURLParameter(url,"iterations",iterations);
		// 			// console.log(url);
		// 			setTimeout(function() {
		// 				console.log("LOAD URL: "+url);
		// 				Code.setURL(url);
		// 			}, 100);
		// 		}
		// 	}
		// }
		project._taskDoneCheckReloadURL();

		this.saveSparseFromData(sparseData, doneFxn);
	}

	App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
}

App3DR.ProjectManager.prototype._taskDoneCheckReloadURL = function(){
	console.log("_taskDoneCheckReloadURL");
	var url = Code.getURL();
	var iterations = Code.getURLParameter(url,"iterations");
	console.log(iterations);
	console.log(iterations!==null);
	console.log(iterations!==undefined);
	console.log(iterations!==0);
	// throw "?"
	if(iterations!==null && iterations!==undefined && iterations!==0){
		iterations -= 1;
		console.log("NEW ITERATION "+iterations);
		var url = Code.setURLParameter(url,"iterations",iterations);
		console.log("NEW URL "+url);
		if(iterations>0){
		// if(false){
			// console.log(url);
			setTimeout(function() {
				console.log("LOAD URL: "+url);
				Code.setURL(url);
			}, 100);
		}
	}
}

App3DR.ProjectManager.prototype._addGraphViews = function(world, graphViewLookup, stage, alternateViews){
	var internalViews = this.views();
	var views = internalViews;
	if(alternateViews){
		views = alternateViews;
	}
	var images = [];
	var transforms = [];
	var transformLookup = {};
	var imageLookup = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = null;
		if(alternateViews){
			viewID = view["id"];
			view = this.viewFromID(viewID);
		}else{
			viewID = view.id();
		}
		var gv = graphViewLookup[viewID];
		var image = view.bundleAdjustImage();
		if(!image){
			image = view.anyLoadedImage();
		}
		var matrix = null;
		if(image){ // try image
			matrix = R3D.imageMatrixFromImage(image, stage);
		}else{ // try size
		 	matrix = gv["size"];
			if(matrix){
				matrix = new V2D(matrix["x"],matrix["y"]);
			}
		}
		var transform = gv["R"];
		if(!transform){
			transform = gv["transform"];
		}
		if(!Code.isa(transform,Matrix)){
			transform = Matrix.fromObject(transform);
		}
		transforms.push(transform);
		images.push(matrix);
		transformLookup[""]
	}
	return {"transforms":transforms, "images":images};//, "imageLookup":imageLookup};
}

App3DR.ProjectManager.prototype._embedMatchPoints = function(world, trackData, worldViewLookup){
	// from model objects to JS instances
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	//
	var pointCountAdded = 0;
	console.log(trackData);
	var points3D = null;
	if(Code.isArray(trackData)){
		points3D = trackData;
	}else{
		points3D = Code.valueOrDefault(trackData["points"], []);
	}
	var created3D = [];
	console.log("points3D: "+points3D.length);
	for(var i=0; i<points3D.length; ++i){
		var worldP3D = null;
		var p3D = points3D[i];
		var point3D = new V3D(p3D["X"],p3D["Y"],p3D["Z"]);
		var vs = p3D["views"];
		if(!vs){
			vs = p3D["v"];
		}
		var p2Ds = [];
		for(var j=0; j<vs.length; ++j){
			var viewJ = vs[j];
			var viewJID = viewJ["view"];
			if(!viewJID){
				viewJID = viewJ["i"];
			}
			var vJ = worldViewLookup[viewJID];
			if(!viewJ["Xx"]){
				throw "tested?";
				if(!worldP3D){
					var pnt = point3D;
					var nrm = new V3D(p3D["x"],p3D["y"],p3D["z"]);
					var siz = p3D["s"];
					worldP3D = new Stereopsis.P3D(pnt,nrm,siz);
					created3D.push(worldP3D);
				}
				// console.log(worldP3D);
				// console.log(viewJ);
				// console.log(vJ);
				var pJ = new V2D(viewJ["x"],viewJ["y"]);
				var sJ = vJ.size();
				pJ.scale(sJ.x,sJ.y);
				var p2D = new Stereopsis.P2D(vJ,pJ,p3D);
				worldP3D.addPoint2D(p2D);
				p2Ds.push(p2D);
				++pointCountAdded;
// throw "?";
			}else{
				for(var k=j+1; k<vs.length; ++k){
					var viewK = vs[k];
					var viewKID = viewK["view"];
					if(!viewKID){
						viewKID = viewK["i"];
					}
					var vK = worldViewLookup[viewKID];
					// if(viewJ["Xx"]){
						var fr = new V2D(viewJ["x"],viewJ["y"]);
						var to = new V2D(viewK["x"],viewK["y"]);
						// to image plane
						var sizeFr = vJ.size();
						var sizeTo = vK.size();
						fr.scale(sizeFr.x,sizeFr.y);
						to.scale(sizeTo.x,sizeTo.y);
						var affineAB = null;
						x1.set(viewJ["Xx"],viewJ["Xy"]);
						y1.set(viewJ["Yx"],viewJ["Yy"]);
						x2.set(viewK["Xx"],viewK["Xy"]);
						y2.set(viewK["Yx"],viewK["Yy"]);
						// console.log(fr+" "+to);
						affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
						world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
					// }else{
					// 	// no match data ...
					// }
					pointCountAdded++;
				}
			}
		}
		if(worldP3D && p2Ds.length>0){ // make a P3D at once
			console.log(worldP3D);
			console.log(p2Ds);
			// make matches for each?
			// for(var i=0; i<p2Ds.length; ++i){
			// 	var match = 
			// }
			// ???
			throw "HERE ... _embedMatchPoints"
		}
	}
	console.log("pointCountAdded: "+pointCountAdded);
	if(created3D && created3D.length>0){
		return created3D;
	}
	return points3D;
}

App3DR.ProjectManager.prototype._embedTrackPoints = function(world,graphData, graphViewLookupID){
	console.log("_embedTrackPoints");
	// add existing tracks
	var existingPoints = null;
	if(Code.isArray(graphData)){
		existingPoints = graphData;
	}else{
		existingPoints = Code.valueOrDefault(graphData["points"],[]);
	}
	var dirXJ = new V2D();
	var dirYJ = new V2D();
	var dirXK = new V2D();
	var dirYK = new V2D();
	var dirO = new V2D(0,0);
	for(var i=0; i<existingPoints.length; ++i){
		var existing = existingPoints[i];
		var pnt = new V3D(existing["X"],existing["Y"],existing["Z"]);
		var nrm = new V3D(existing["x"],existing["y"],existing["z"]);
		var siz = existing["s"];
		var vs = existing["v"];
		if(!vs){
			vs = existing["views"];
		}
		var ps = [];
		var ms = [];
		var p3D = new Stereopsis.P3D(pnt,nrm,siz);
		p3D.up(V3D.orthogonal(nrm));
		// create P2Ds
		var p2Ds = [];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j];
			var p2 = new V2D(v["x"],v["y"]);
			var s = v["s"];
			var vI = v["i"];
			var vOR = vI;
// console.log(vI);
			// if(vI===null || vI===undefined){
			// 	vI = v["view"];
			// }
// console.log(vI);
				vI = graphViewLookupID[vI];
// console.log(vI);
			if(!Code.ofa(vI, Stereopsis.View)){
				vI = world.viewFromData(vI);
			}
			if(!vI){
				console.log(vOR);
				console.log(graphViewLookupID[vOR]);
				console.log(v);
				console.log(vs);
				throw "?";
			}
// console.log(vI);
			// scale
			var siz = vI.size();
			s *= siz.x;
			p2.scale(siz.x,siz.y);
			s = null;
			var p2D = new Stereopsis.P2D(vI,p2,p3D,s);
			p3D.addPoint2D(p2D);
			p2Ds.push(p2D);
		}
		// match points
		for(var j=0; j<vs.length; ++j){
			var p2DJ = p2Ds[j];
			var v = vs[j];
			var vI = v["i"];
				vI = graphViewLookupID[vI];
			if(!Code.ofa(vI, Stereopsis.View)){
				vI = world.viewFromData(vI);
			}
			if(v["Xx"]){
				dirXJ.set(v["Xx"],v["Xy"]);
				dirYJ.set(v["Yx"],v["Yy"]);
			}
			for(var k=j+1; k<vs.length; ++k){
				var p2DK = p2Ds[k];
				var u = vs[k];
				var uI = u["i"];
					uI = graphViewLookupID[uI];
					uI = world.viewFromData(uI);
					if(!Code.ofa(uI, Stereopsis.View)){
						uI = world.viewFromData(uI);
					}
				if(u["Xx"]){
					dirXK.set(u["Xx"],u["Xy"]);
					dirYK.set(u["Yx"],u["Yy"]);
				}
				// var aff = R3D.affineMatrixExact([dirO,dirXJ,dirYJ],[dirO,dirXK,dirYK]);
				var aff = null;
	// ...........
	var m = new Stereopsis.Match2D(p2DJ,p2DK,p3D, aff); // , ncc, sad);
		m.transform(world.transformFromViews(p2DJ.view(),p2DK.view()));
	p2DJ.addMatch(m);
	p2DK.addMatch(m);
	p3D.addMatch(m);
			}
		}
	if(!p3D.up()){
	throw "no up"
	}
	// console.log(p3D.toPointArray().length);
	// console.log(p3D);
	// console.log(p3D.toPointArray());
	world.generateMatchAffineFromPatches(p3D);
		// newPoints.push(p3D);
		world.embedPoint3D(p3D, false);
		// TODO: allow for no pre-processing : just trust input data is right -- speed up
		// world.connectPoint3D(point3D); // no questions asked
	}

}

App3DR.ProjectManager.prototype._iterateGraphTracksTick = function(pair,viewsLoad){ // progressively add pair tracks
	console.log("_iterateGraphTracksTick");
	var stage = GLOBALSTAGE;
	var graphData = this.graphData();
	console.log(graphData);
	var graphViews = graphData["views"];
	// lookup tables
	var graphViewLookup = {};
	var graphViewLookupIndex = {};
	var graphViewLookupID = {};
	for(var i=0; i<graphViews.length; ++i){
		var vid = graphViews[i]["id"];
		graphViewLookup[vid] = graphViews[i];
		graphViewLookupIndex[vid] = i;
		graphViewLookupID[i] = vid;
	}
	// project view lookup
	var viewLookup = {};
	var views = this.views();
	console.log(views)
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}

	var trackData = pair.trackData();
	console.log("trackData");
	console.log(trackData);

	// create world
	var world = new Stereopsis.World();
	// var cameras = this.cameras();

	console.log(graphData);
	throw "cameras from graph?"

	var views = this.views();

	var info = this._addGraphViews(world, graphViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];

	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
	console.log(views);
// console.log(worldViews);
// console.log("need cell size");
// throw "do these all have pic /size ?"

	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		worldViewLookup[worldViews[i].data()] = worldViews[i];
	}
console.log("embedding points");
	var points3D = this._embedMatchPoints(world, trackData, worldViewLookup);
console.log("embedded points");
	// initialize world
	world.copyRelativeTransformsFromAbsolute();
	world.relativeFFromSamples();
	world.averagePoints3DFromMatches(true);
	world.estimate3DErrors(true);

	// initialize point patches
	console.log("init the patches");
	world.patchInitBasicSphere(true);

	var newPoints = world.toPointArray();
	// remove new points
	world.disconnectPoints3D(newPoints);
	//
	this._embedTrackPoints(world, graphData, graphViewLookupID);
	console.log("EMBED NEW POINTS ...: ");
	world.printPoint3DTrackCount();
	// add back new points
	for(var i=0; i<newPoints.length; ++i){
		var point3D = newPoints[i];
		world.embedPoint3D(point3D, false);
		// world.embedPoint3D(point3D); // these points SHOULD have been validated beforehand
	}
	world.printPoint3DTrackCount();

// if(true){
if(false){
	// SHOW IMAGES - & 2D track points
	for(var i=0; i<worldViews.length; ++i){
		var view = worldViews[i];
		var image = view.image();
		var points2D = view.toPointArray();
		console.log(points2D);
		if(!image){
			continue;
		}
	var OFFX = 10 + i*image.width();
	var OFFY = 10;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p = point2D.point2D();
			var d = new DO();
			d.graphics().setFill(0xFFFF0066);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y,2.0);
			d.graphics().endPath();
			d.graphics().fill();
			d.matrix().translate(OFFX, OFFY);
			GLOBALSTAGE.addChild(d);
		}
	}
}

	var graphPoints = this._getGraphPointsFromWorld(world, graphViewLookupIndex);
	graphData["points"] = graphPoints;
	// graphData["previousPair"] // already updated
	console.log("save / update graph data");
	// . update view transforms:
	console.log(graphViews);
	var graphViews = this._updateGraphViewsFromWorld(world, graphData["views"],graphData["cameras"]);
	graphData["views"] = graphViews;
	world.printPoint3DTrackCount();
	// .
	console.log(graphData);
// throw "TO SAVE ...";
	this.saveGraphFromData(graphData);
}
App3DR.ProjectManager.prototype._getGraphPointsFromWorld = function(world, graphViewLookupIndex, includeAffine){
	includeAffine = includeAffine!==undefined && includeAffine!==null ? includeAffine : true;
	var allPoints = world.toPointArray();
	// console.log("allPoints: "+allPoints.length);
	// console.log(allPoints);

	// update points on graph:
	var points3D = allPoints;
	var graphPoints = [];
	var dirX = new V2D();
	var dirY = new V2D();
	var dirO = new V2D();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var loc = point3D.point();
		var nor = point3D.normal();
		var siz = point3D.size();
		var v = [];
		var points2D = point3D.toPointArray();
		var vA = null;
		var vB = null;
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p = point2D.point2D();
			var s = point2D.size();
			var pv = point2D.view();
			var ps = pv.size();
			dirX.set(1,0);
			dirY.set(0,1);
			if(j==0){
				vA = pv;
			}else{
				vB = pv;
				var match = point3D.matchForViews(vA,vB);
				var affine = match.affineForViews(vA,vB);
				affine.multV2DtoV2D(dirO,dirO);
				affine.multV2DtoV2D(dirX,dirX);
				affine.multV2DtoV2D(dirY,dirY);
				dirX.sub(dirO);
				dirY.sub(dirO);
			}
			var wid = ps.x;
			var hei = ps.y;
			var vID = pv.data();
			var vIndex = graphViewLookupIndex[vID];
			var o = {"i":vIndex,"x":(p.x/wid), "y":(p.y/hei)};
			if(includeAffine){
				o["s"] = (s/wid);
				o["Xx"] = dirX.x;
				o["Xy"] = dirX.y;
				o["Yx"] = dirY.x;
				o["Yy"] = dirY.y;
			}
			v.push(o);
		}
		// console.log(loc,nor,siz);
		if(!nor){
			console.log(point3D);
			throw "nrm";
		}
		var object = {"X":loc.x, "Y":loc.y, "Z":loc.z, "x":nor.x, "y":nor.y, "z":nor.z, "s":siz, "v":v};
		graphPoints.push(object);
	}
	return graphPoints;
}

App3DR.ProjectManager.prototype._updateGraphViewsFromWorld = function(world, graphViews, graphCameras){
	var updatedViews = [];
	for(var i=0; i<graphViews.length; ++i){
		var gv = graphViews[i];
		var gid = gv["id"];
		var view = world.viewFromData(gid);
		var cam = view.camera();
		var camID = "0";
		var cD = cam.data();
		if(cD){
			var camID = cD;
		}
		// if(graphCameras){
		// 	for(var j=0;j<graphCameras.length){
		// 		if(graphCameras[j]["id"]==camID){
		// 			// console.log(cam);
		// 			// console.log();
		// 			// console.log(cam.id());
		// 			camID = ;
		// 		}
		// 	}
		// }else{
		// 	camID = "0";
		// }
// GET CAMERA FROM CAM.DATA => GET CAM ID
		//cam.id();
		var R = view.absoluteTransform();
		var size = view.size();
		updatedViews[i] = {
			"id": gid,
			"camera": camID,
			"R": R.copy(),
			"size": size,
		};
	}
	return updatedViews;
}
App3DR.ProjectManager.prototype.saveFileFromData = function(data, relativePath, fxn, ctx){ // data is json object
	// console.log(data);
	var yaml = new YAML();
		yaml.writeObjectLiteral(data);
	var string = yaml.toString();
	this.saveFileFromString(string, relativePath, fxn, ctx);
}
App3DR.ProjectManager.prototype.saveFileFromString = function(string, relativePath, callback, context){
	var yamlBinary = Code.stringToBinary(string);
	this.saveFileFromBinary(yamlBinary, relativePath, callback, context);
}
App3DR.ProjectManager.prototype.saveFileFromBinary = function(binary, relativePath, callback, context){
	var path = Code.appendToPath(this._workingPath, relativePath);
	this.addOperation("SET", {"path":path, "data":binary}, callback, context);
}



App3DR.ProjectManager.prototype.saveGraphFromData = function(graphData, fxn, ctx){
	console.log(graphData);
	var yaml = new YAML();
	var object = graphData;
	var timestampNow = Code.getTimeStampFromMilliseconds();
		graphData["modified"] = timestampNow;
	yaml.writeComment("Graph");
	yaml.writeObjectLiteral(graphData);
	var graphString = yaml.toString();
	var fxnSavedGraph = function(){
		console.log("fxnSavedGraph");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveGraph(graphString, this.graphFilename(), fxnSavedGraph, this);
}

App3DR.ProjectManager.prototype.saveSparseFromData = function(sparseData, fxn, ctx){
	console.log(sparseData);
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();
		sparseData["modified"] = timestampNow;
	yaml.writeComment("Sparse");
	yaml.writeObjectLiteral(sparseData);
	var sparseString = yaml.toString();
	var fxnSavedSparse = function(){
		console.log("fxnSavedSparse");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveSparse(sparseString, this.sparseFilename(), fxnSavedSparse, this);
}

App3DR.ProjectManager.prototype.saveDenseFromData = function(denseData, fxn, ctx){
	console.log(denseData);
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();
		denseData["modified"] = timestampNow;
	yaml.writeComment("Dense Data");
	yaml.writeObjectLiteral(denseData);
	var denseString = yaml.toString();
	var fxnSavedDense = function(){
		console.log("fxnSavedDense");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveDense(denseString, this.denseFilename(), fxnSavedDense, this);
}


App3DR.ProjectManager.prototype.savePointsFromData = function(pointsData, fxn, ctx){
	console.log(pointsData);
	var yaml = new YAML();
	var object = pointsData;
	var timestampNow = Code.getTimeStampFromMilliseconds();
		pointsData["modified"] = timestampNow;
	yaml.writeComment("Points");
	yaml.writeObjectLiteral(pointsData);
	var pointsString = yaml.toString();
	var fxnSavedPoints = function(){
		console.log("fxnSavedPoints");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.savePoints(pointsString, this.pointsFilename(), fxnSavedPoints, this);
}



App3DR.ProjectManager.prototype.surfaceTriangulate = function(){ // triangles from points
	console.log("surfaceTriangulate");
	var project = this;
	// do operations
	var fxnPointsLoaded = function(){
		console.log("fxnPointsLoaded");
		var bundleData = project.bundledData();
		console.log(bundleData);
		var dataCameras = bundleData["cameras"];
		var dataViews = bundleData["views"];
		var allPoints = bundleData["points"];
		// extract points & normals
		var pnts = [];
		var nrms = [];
		for(var i=0; i<allPoints.length; ++i){
			var p = allPoints[i];
			var pnt = new V3D(p["X"],p["Y"],p["Z"]);
			var nrm = new V3D(p["x"],p["y"],p["z"]);
			pnts.push(pnt);
			nrms.push(nrm);
		}
		console.log(pnts);
		console.log(nrms);

console.log("CREATE MESH");
// throw "?"
// var str = Code.pointsToPtsFileString(pnts,nrms);
// console.log(str);
// throw "export to POINT FILE ..."
		var mesh = new Mesh3D(pnts,nrms);
		console.log(mesh);
		var triangles = mesh.generateSurfaces();
		console.log(triangles);
		var info = Tri3D.arrayToUniquePointList(triangles);
		console.log(info);
//
console.log("ASSEMBLE");
		var vertexes = info["points"];
		var triangles = info["triangles"];
		// convert triangles objects to expected index format
		for(var i=0; i<triangles.length; ++i){
			var triangle = triangles[i];
			var a = triangle["A"];
			var b = triangle["B"];
			var c = triangle["C"];
			var tri = {};
			tri["A"] = {"i":a, "u":null, "v":null};
			tri["B"] = {"i":b, "u":null, "v":null};
			tri["C"] = {"i":c, "u":null, "v":null};
			tri["t"] = null;
			triangles[i] = tri;
		}

		var data = {};
		data["cameras"] = dataCameras;
		data["views"] = dataViews;
		data["vertexes"] = vertexes;
		data["triangles"] = triangles;
		data["uvs"] = null;
		data["textures"] = null;
		data["packing"] = null; //{"views":null};

		console.log(data);
		
		// throw "SAVE TO TRIANGLE ???";

		project.setTriangleFilename(App3DR.ProjectManager.RECONSTRUCT_TRIANGLES_FILE_NAME);
		project.setTriangleCount(triangles.length);
		// 
		var saveTrianglesCompleteFxn = function(){
			console.log("saveTrianglesCompleteFxn");
			project.saveProjectFile(saveProjectCompleteFxn, project);
		}

		var saveProjectCompleteFxn = function(){
			console.log("saveProjectCompleteFxn");
		}
		console.log("saveTrianglesFromData ??? ");
		project.saveTrianglesFromData(data, saveTrianglesCompleteFxn, project);

	}
	// load final points file
	project.loadBundled(fxnPointsLoaded, project);
}




App3DR.ProjectManager.prototype.trianglesTexturize = function(){ // find uv source coords from images
	console.log("trianglesTexturize");
	var project = this;
	// do operations
	var fxnTrianglesLoaded = function(){
		console.log("fxnTrianglesLoaded");

		var triangleData = this._triangleData;
		console.log(triangleData);
		var triangleCameras = triangleData["cameras"];
		var triangleViews = triangleData["views"];
		var triangles = triangleData["triangles"];
		var vertexes = triangleData["vertexes"];

		var cameraFromID = {};
		// var Ks = [];
		for(var i=0; i<triangleCameras.length; ++i){
			var cam = triangleCameras[i];
			var K = cam["K"];
				K = Matrix.fromObject(K); // TODO: or if fx,fy,s,cx,cy
			cameraFromID[cam["id"]] = K;
		}
		var views = project.views();
		// get view resolutions
		// var textureSize = new V2D(512,512);
		// var textureSize = new V2D(1024,1024);
		// var textureSize = new V2D(2048,2048);
		var textureSize = new V2D(4096,4096);
throw "is this reached?"
		// var resolutionScale = 1.0;
		// var resolutionScale = 0.5;
		var resolutionScale = 0.25;
		// var resolutionScale = 0.15;
		// var resolutionScale = 0.125;
		var resolutions = [];
		var transforms = [];
		var cameras = [];
		for(var i=0; i<triangleViews.length; ++i){
			var tv = triangleViews[i];
			var viewID = tv["id"]
			var camID = tv["camera"];
			var K = cameraFromID[camID];
			var viewTransform = tv["transform"];
			var transform = Matrix.fromObject(viewTransform); // extrinsic
				// absolute ???
			var view = this.viewFromID(viewID);
			var size = view.maximumImageSize();
			resolutions.push(size);
			transforms.push(transform);
			cameras.push(K);
		}
		// get view orientations
		//
		// convert to common format:
		// vertexes = Code.copyArray(vertexes);
		// triangles = Code.copyArray(triangles);
		// for(var i=0; i<vertexes.length; ++i){
		// 	var vertex = vertexes[i];
		// 	var x = vertex["X"];
		// 	var y = vertex["Y"];
		// 	var z = vertex["Z"];
		// 	if(x===undefined){
		// 		x = vertex["x"];
		// 		y = vertex["y"];
		// 		z = vertex["z"];
		// 	}
		// 	vertexes[i] = new V3D(x,y,z);
		// }
		// for(var i=0; i<triangles.length; ++i){
		// 	var triangle = triangles[i];
		// 	var a = triangle["A"];
		// 	var b = triangle["B"];
		// 	var c = triangle["C"];
		// 		a = a["i"];
		// 		b = b["i"];
		// 		c = c["i"];
		// 	triangles[i] = [a,b,c];
		// }
		// // // 
		// // load from triangle file
		// console.log(triangles);
		// console.log(vertexes);

		// var triangles3D = [];
		// for(var i=0; i<triangles.length; ++i){
		// 	var triangle = triangles[i];
		// 	var a = triangle[0];
		// 	var b = triangle[1];
		// 	var c = triangle[2];
		// 	a = vertexes[a];
		// 	b = vertexes[b];
		// 	c = vertexes[c];
		// 	var t = new Tri3D(a.copy(),b.copy(),c.copy());
		// 	triangles3D.push(t);
		// }
		// console.log("TRIANGLES START: "+triangles3D.length);
		var triangles3D = Tri3D.uniquePointListToTriangles(vertexes,triangles);
		console.log("updated not checked");
// throw "?";
		// 3D-2D texture sourcing
		var info = R3D.optimumTriangleTextureImageAssignment(transforms,cameras,resolutions,triangles3D,textureSize,resolutionScale);
		console.log(info);
		var triangles3D = info["triangles3D"];
		var vertexes3D = info["vertexes3D"];
		var sources2D = info["sources2D"]; // 2D locations for each view image
		var views2D = info["views2D"]; // views for source locations
		var included2D = info["views"]; // assigned views per 3 vertexes

		var triangles2D = info["destinations2D"];
		console.log(triangles2D);
		console.log("TRIANGLES END: "+triangles3D.length);
		var totalArea = 0;
		for(var i=0; i<triangles2D.length; ++i){
			var tri = triangles2D[i];
			var a = tri[0];
			var b = tri[1];
			var c = tri[2];
			var area = V2D.areaTri(a,b,c);
			totalArea += area;
		}
		console.log("totalArea: "+totalArea);
		console.log("textureSize: "+textureSize+" = "+textureSize.area());
		console.log("EST PAGES:"+(totalArea/textureSize.area()));

		var maxSize = null;
		// 2D texture packing
		var info = R3D.optimumTriangleTexturePacking(textureSize,triangles2D,resolutionScale,maxSize);
		console.log(info);

		var pagesCount = info["pageCount"];
		var texture2D = info["mapped2D"];
		var pages2D = info["pages"];

		var newTriangles = [];
		var newVertexes = [];
		for(var i=0; i<vertexes3D.length; ++i){
			var v = vertexes3D[i];
			newVertexes.push({"X":v.x,"Y":v.y,"Z":v.z});
		}
		for(var i=0; i<triangles.length; ++i){
			var tri2D = texture2D[i];
			if(!tri2D){ // 0-areas .. or otherwise ...
				continue;
			}
			var triangle3D = triangles3D[i];
			var page = pages2D[i];
			var assignedView = included2D[i];
			var sourceViews = views2D[i];
			var sourcePoints = sources2D[i];
			var sourceList = [];
			for(var j=0; j<sourceViews.length; ++j){
				var v = sourceViews[j];
				var p = sourcePoints[j];
				try{
					sourceList.push({"v":v,"a":{"x":p[0].x,"y":p[0].y},"b":{"x":p[1].x,"y":p[1].y},"c":{"x":p[2].x,"y":p[2].y}});
				}catch(e){

					console.log(sourceViews);
					console.log(sourcePoints);
					console.log(i+":");
					console.log(j+":");
					console.log(v);
					console.log(p);
					console.log("?");
					throw "?"
				}
			}
			var newTri = {};
				newTri["A"] = {"i":triangle3D[0],"v":assignedView[0]};
				newTri["B"] = {"i":triangle3D[1],"v":assignedView[1]};
				newTri["C"] = {"i":triangle3D[2],"v":assignedView[2]};
				newTri["a"] = {"x":tri2D[0].x,"y":tri2D[0].y};
				newTri["b"] = {"x":tri2D[1].x,"y":tri2D[1].y};
				newTri["c"] = {"x":tri2D[2].x,"y":tri2D[2].y};
				newTri["t"] = page;
				newTri["v"] = sourceList; // i, x,y,z
			newTriangles.push(newTri);
		}
		console.log(newTriangles);
// throw "SOMETHING WRONG WITH RESOLUTION?"
		// packing init:
		var packing = [];
		for(var i=0; i<triangleViews.length; ++i){
			packing.push({"v":i});
		}
		// texture init:
		var textures = [];
		for(var i=0; i<pagesCount; ++i){
			var tex = {};
			tex["id"] = ""+i;
			tex["file"] = "tex"+i+".png";
			tex["width"] = textureSize.x;
			tex["height"] = textureSize.y;
			textures.push(tex);
		}
		// save updated version:
		triangleData["triangles"] = newTriangles;
		triangleData["vertexes"] = newVertexes;
		triangleData["packing"] = packing;
		triangleData["textures"] = textures;
		var triangleCount = newTriangles.length;

		var completeTexturesDeleteFxn = function(){
			console.log("SAVING TRIANGLE COUNT");
			project.setTriangleCount(triangleCount);
			// project.setTextureCount(null); // should alreay be the case
				project.setTextureCount(-1); // start PACKING
			project.setCurrentSceneID(null);
			project.setScenes(null);
			project.saveProjectFile();
		}
		var completeTriangleSaveFxn = function(){
			console.log("DELETING PREVIOUS TEXTURES");
			project.removeAllTextures(completeTexturesDeleteFxn, project, null);
		}
		console.log("SAVING TRIANGLES WITH INIT TEXTURE PACKING");
		project.saveTrianglesFromData(triangleData, completeTriangleSaveFxn, project);
	}
	// load final points file
	project.loadTriangles(fxnTrianglesLoaded, project);
}
App3DR.ProjectManager.prototype.sceneToDAE = function(){
	console.log("sceneToDAE");
	var project = this;
	var fxnTrianglesLoaded = function(){
		console.log("fxnTrianglesLoaded");
		var triangleData = this._triangleData;
		console.log(triangleData);

		//

		var triangles = triangleData["triangles"];
		var vertexes = triangleData["vertexes"];
		var textures = triangleData["textures"];
		var vertex3D = [];
		for(var i=0; i<vertexes.length; ++i){
			var v = vertexes[i];
			var p = new V3D(v["X"],v["Y"],v["Z"]);
			vertex3D.push(p);
		}
		var world = Formats3D.daeWorldNew();

		var images = [];
		var effects = [];
		var materials = [];
		var sizes = [];
		for(var i=0; i<textures.length; ++i){
			var tex = textures[i];
			var file = tex["file"];
			var width = tex["width"];
			var height = tex["height"];
			var size = new V2D(width,height);
			sizes.push(size);
			var image = Formats3D.daeWorldAddImage(world, file);
			images.push(image);
			var effect = Formats3D.daeWorldAddMaterialFromImage(world, image);
			effects.push(effect);
			var material = Formats3D.daeWorldAddInstanceFromMaterial(world, effect);
			materials.push(material);
		}
		var tris3D = Code.newArrayArrays(images.length);
		var tris2D = Code.newArrayArrays(images.length);
		for(var i=0; i<triangles.length; ++i){
			var tri = triangles[i];
			var A = tri["A"]["i"];
			var B = tri["B"]["i"];
			var C = tri["C"]["i"];
			var a = tri["a"];
			var b = tri["b"];
			var c = tri["c"];
			var index = tri["t"];
				A = vertex3D[A];
				B = vertex3D[B];
				C = vertex3D[C];
				a = new V2D(a["x"],a["y"]);
				b = new V2D(b["x"],b["y"]);
				c = new V2D(c["x"],c["y"]);
			var size = sizes[index];
			a.x = a.x/size.x; a.y = 1 - (a.y/size.y);
			b.x = b.x/size.x; b.y = 1 - (b.y/size.y)
			c.x = c.x/size.x; c.y = 1 - (c.y/size.y)

			var t3D = new Tri3D(A,B,C);
			var t2D = new Tri2D(a,b,c);
			var tri3D = tris3D[index];
			var tri2D = tris2D[index];
			tri3D.push(t3D);
			tri2D.push(t2D);
		}

		var mesh = Formats3D.daeWorldAddMesh(world, tris3D, tris2D, materials);
		var object = Formats3D.daeWorldAddInstanceFromMesh(world, mesh, new Matrix3D().identity());
		var scene = Formats3D.daeWorldAddScene(world);
		Formats3D.daeWorldAddInstanceMeshToScene(world, scene, object);

		var xml = Formats3D.worldToDAE(world);
		console.log(xml);

	}
	project.loadTriangles(fxnTrianglesLoaded, project);
}

App3DR.ProjectManager.prototype.trianglesPacking = function(){
	console.log("trianglesPacking");
	var project = this;
	var fxnTrianglesLoaded = function(){
		console.log("fxnTrianglesLoaded");

		var triangleData = this._triangleData;
		console.log(triangleData);
		var textures = triangleData["textures"];
		var packing = triangleData["packing"];
		if(!packing || packing.length==0){
			var textureCount = textures.length;
			console.log("done packing");
			// save only pertenent info to scene file
			project.setTextureCount(textureCount);
			project.saveProjectFile();
			return;
		}
		// keep packing
		var triangleViews = triangleData["views"];
		var triangleTris = triangleData["triangles"];
		var view = packing.shift();
		var viewIndex = view["v"];
			view = triangleViews[viewIndex];

		var viewID = view["id"];
		var projectView = project.viewFromID(viewID);
		var imageSource = null;

		// TODO get list of all textures view is included in
		var currentTexture = -1;

		var savedUpdatedTexture = function(a,o){
			console.log(a);
			console.log(o);
			console.log("savedUpdatedTexture");
		}

		var fillNextTexture = function(textureImage){
			console.log("FILL : "+currentTexture);
			var texture = textures[currentTexture];
			var filename = texture["file"];
			// console.log(imageSource);
			// console.log(textureImage);
			// go thru all trianges with texture i
console.log("viewIndex: "+viewIndex);
			var ext = 0;
			for(var i=0; i<triangleTris.length; ++i){
				var tri = triangleTris[i];
				var tex = tri["t"];
				if(tex==currentTexture){
					var vs = tri["v"]; // view source list
					for(var j=0; j<vs.length; ++j){
						if(vs[j]["v"]===viewIndex){
							var sourcing = [ (tri["A"]["v"]==viewIndex), (tri["B"]["v"]==viewIndex), (tri["C"]["v"]==viewIndex) ];
							var A = tri["a"];
							var B = tri["b"];
							var C = tri["c"];
							var a = vs[j]["a"];
							var b = vs[j]["b"];
							var c = vs[j]["c"];
							A = new V2D(A["x"],A["y"]);
							B = new V2D(B["x"],B["y"]);
							C = new V2D(C["x"],C["y"]);
							a = new V2D(a["x"],a["y"]);
							b = new V2D(b["x"],b["y"]);
							c = new V2D(c["x"],c["y"]);
							var destinationTri2D = [A,B,C];
							var sourceTri2D = [a,b,c];
							R3D.textureAddSourceTriangles(textureImage, destinationTri2D, imageSource, sourceTri2D, sourcing);
							++ext;
						}
					}
				}
			}
			console.log("extract: "+ext);
// throw "TESTING"
			// dISPLAY:
			/*
			var image = R3D.imageFromImageMatrix(textureImage, GLOBALSTAGE,function(){
				var d = new DOImage(image);
				GLOBALSTAGE.addChild(d);
			});
			throw "..."
			*/
			// save updated texture
			var saveTextureComplete = function(){
				console.log("saveTextureComplete");
				loadNextTexture();
			}
			// send image
			var updatedImage = R3D.imageFromImageMatrix(textureImage, GLOBALSTAGE,function(){
				var imageBinary = Code.base64StringToBinary(updatedImage.src);
				project.saveTriangleTextureFromFilename(filename, imageBinary, saveTextureComplete, project, null);
			});
		}

		var loadNextTextureComplete = function(object,data){
			if(data){
				project.dataToImage(data, function(image){
					// console.log(image);
					var imageMatrix = R3D.imageMatrixFromImage(image, GLOBALSTAGE);
					// console.log(imageMatrix);
					fillNextTexture(imageMatrix);
				}, project);
			}else{ // need to init data
				var texture = textures[currentTexture];
				var width = texture["width"];
				var height = texture["height"];
				// console.log("INIT IMAGE");
				var imageMatrix = new ImageMat(width,height);
				fillNextTexture(imageMatrix);
			}
		}

		var completedImageSourcing = function(){
			console.log("completedImageSourcing for "+viewID);
		}

		var loadNextTexture = function(){
			++currentTexture;
			console.log("loadNextTexture: "+currentTexture);
			if(currentTexture>=textures.length){
				console.log("done loading textures ... drop packing");
				// packing.shift(); // ALREADY SHIFTED
				if(packing.length==0){
					triangleData["packing"] = null;
				}
				project.saveTrianglesFromData(triangleData, completedImageSourcing, project);
				return;
			}
			var texture = textures[currentTexture];
			console.log(texture);
			var filename = texture["file"];
			project.loadTriangleTextureFromFilename(filename, loadNextTextureComplete, project, null);
		}

		var loadImageTextureComplete = function(a,o){
			imageSource = projectView.textureImage();
			imageSource = R3D.imageMatrixFromImage(imageSource, GLOBALSTAGE);
			console.log(imageSource);
			loadNextTexture();
		}

		var loadImageTexture = function(){
			console.log(projectView);
			projectView.loadTextureImage(loadImageTextureComplete, project);
		}
		loadImageTexture();
	}
	project.loadTriangles(fxnTrianglesLoaded, project);
}



App3DR.ProjectManager.prototype.calculateGlobalOrientationNonlinear = function(str){
	// LOAD ALL BA IMAGES
	var views = this._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	var self = this;
	var fxnViewImageLoaded = function(){
		++loadedViews;
		if(loadedViews==expectedViews){
			self._calculateGlobalOrientationNonlinearB(str);
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(fxnViewImageLoaded, this);
	}
}


App3DR.ProjectManager.prototype._calculateGlobalOrientationNonlinearB = function(str){
console.log("_calculateGlobalOrientationNonlinearB");
	var yaml = YAML.parse(str);
	yaml = yaml[0];
	console.log(yaml);

	var views = this._views;
	var pairs = this._pairs;
	var cameras = this._cameras;

	// world
	var world = new Stereopsis.World();

	// cameras
	WORLDCAMS = [];
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var K = camera.K();
		var distortion = camera.distortion();
		if(K && distortion){
			var fx = K["fx"];
			var fy = K["fy"];
			var s = K["s"];
			var cx = K["cx"];
			var cy = K["cy"];
			var k0 = distortion["k0"];
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var p0 = distortion["p0"];
			var p1 = distortion["p1"];
			var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			var c = world.addCamera(K, distortion);
			c.data(camera.id()+"");
			camera.temp(c);
			WORLDCAMS.push(c);
		}
	}

	// views
	var WORLDVIEWS = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		//var img = view.featuresImage();
		//var img = view.denseHiImage(); // REPLACE 1
		var img = view.bundleAdjustImage();
		if(!img){
			throw "image not loaded: "+view.id();
		}
		var cam = null;
		var camID = view.cameraID();
		for(var j=0; j<WORLDCAMS.length; ++j){
			var c = WORLDCAMS[j];
			// console.log(c);
			if(c.data()==camID){
				cam = null;
				break;
			}
		}
		if(!cam){
			console.log("not able to find camera, assigning 0th");
			cam = WORLDCAMS[0];
		}
		var K = cam.K();
		var distortion = cam.distortion();
		var matrix = R3D.imageMatrixFromImage(img, this._stage);

		// transform
		var transform = null;
		var yamlViews = yaml["views"];
		for(var j=0; j<yamlViews.length; ++j){
			yamlView = yamlViews[j];
			viewID = yamlView["id"];
			if(viewID==view.id()){
				transform = Matrix.fromObject(yamlView["transform"]);
				break;
			}
		}
		var v = world.addView(matrix, cam);
		v.absoluteTransform(transform);
		view.temp(v);
		v.data(view.id());
		WORLDVIEWS.push(v);
	}

	// quick world-view lookup
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
		var v = WORLDVIEWS[i];
		WORLDVIEWSLOOKUP[v.data()] = v;
	}

	// matches
	//for(var i=0; i<pairs.length; ++i){
	var points = yaml["points"];
	console.log("adding points from yaml: "+points.length);
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		if(i%1000==0){
			console.log(i+" of "+points.length);
		}
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
		var pointViews = point["views"];
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				// console.log(viewJ);
				// console.log(viewK);
				var vK = WORLDVIEWSLOOKUP[viewK["view"]];
				// console.log(vJ,vK);
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				// console.log(fr+" "+to);
				var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
				// world.addMatchForViews(vA,fr, vB,to, affineAB);

				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
				//throw "?"
				pointCountAdded++;
			}
		}
	}
	console.log("... added points: "+pointCountAdded);

	var fxnZ = function(){
		console.log("saved BA");
	}

	var completeFxn = function(){
		console.log("completeFxn");
		var str = world.toYAMLString();
		this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
		this.saveBundleAdjust(str, fxnZ, this);
	}

	world.solveGlobalAbsoluteTransform(completeFxn, this, false);
}
App3DR.ProjectManager.prototype.calculateGlobalOrientationHierarchyLoad = function(){
	console.log("load all necessary BA stuff ...");

	var self = this;
	var views = this._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	var yamlBA = null;

	var checkDone = function(){
		if(loadedViews==expectedViews && yamlBA){
			handleDone();
		}
	}

	var BAImageLoaded = function(){
		++loadedViews;
		checkDone();
	}

	var views = this._views;
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(BAImageLoaded, this);
	}

	var BALoaded = function(object, data){
		var str = Code.binaryToString(data);
		var object = YAML.parse(str);
		if(Code.isArray(object)){
			object = object[0];
		}
		yamlBA = object;
		checkDone();
	}
var world = null;
	var handleDone = function(){
		var object = yamlBA;
		var info = App3DR.bundleAdjustObjectToWorld(object, self);
		//var world = info["world"];
		world = info["world"];
		var canRun = App3DR.bundleAdjustWorldCanDoubleResolution(world);
		console.log(world);
		console.log(canRun);
		if(canRun){
			world.solveGlobalAbsoluteTransform(completeFxn, self, 3);
		}
	}

	var fxnZ = function(){
		console.log("yep");
	}

	var completeFxn = function(){
		console.log("completeFxn");
		var str = world.toYAMLString();
		self.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
		self.saveBundleAdjust(str, fxnZ, self);
	}



	this.loadBundleAdjust(BALoaded,this, null);
}
App3DR.bundleAdjustWorldCanDoubleResolution = function(world){
	var views = world.toViewArray();
	var canDouble = true;
	// var lookup = [];
	console.log(views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var nextSize = Math.floor(cellSize/2);
		if(nextSize%2==0){
			nextSize += 1;
		}
		console.log(cellSize+" | "+nextSize)
		// if(nextSize<=3 || nextSize>=cellSize){
		if(nextSize<3 || nextSize>=cellSize){
			canDouble = canDouble & false;
		}else{
// halve cell size = double resolution
			// view.cellSize(nextSize);
		}
	}
	return canDouble;
}
App3DR.bundleAdjustObjectToWorld = function(object, project){
	console.log(object);
	var world = new Stereopsis.World();
	// locals
	var BACAMS = App3DR.bundleAdjustObjectToCameras(world,object["cameras"], project.cameras());
	var BAVIEWS = App3DR.bundleAdjustObjectToViews(world,object["views"], project.views(), project._stage);
	App3DR.bundleAdjustObjectToPoints(world,object["points"]);
	// cameras
	// console.log(cameras);
	return {"world":world, "cameras":BACAMS, "views":BAVIEWS};
}

App3DR.bundleAdjustObjectToCameras = function(world, cameras, source){
	var BACAMS = [];
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		// TODO: K is sometimes matrix & sometimes components
		var K = camera["K"];
		var distortion = camera["distortion"];
		var camID = camera["id"];
			if(K && distortion){
				if(K["fx"]){
				var fx = K["fx"];
				var fy = K["fy"];
				var s = K["s"];
				var cx = K["cx"];
				var cy = K["cy"];
				var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			}else{
				K = Matrix.fromObject(K);
			}
			var k0 = distortion["k0"];
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var p0 = distortion["p0"];
			var p1 = distortion["p1"];
			
			// console.log(K+"");
			var c = world.addCamera(K, distortion);
			c.data(camID);
			BACAMS.push(c);
		}
	}
	return BACAMS;
}
App3DR.bundleAdjustObjectToViews = function(world, views, source, stage){
	var BAVIEWS = [];
	var cameras = world.toCameraArray();
	console.log(cameras);
	// views
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view["id"]
		var match = null;
		for(var j=0; j<source.length; ++j){
			var v = source[j];
			if(viewID==v.id()){
				match = v;
			}
			// console.log(v);
		}
		if(match){
			var img = match.bundleAdjustImage();
			var matrix = R3D.imageMatrixFromImage(img, stage);
			var cam = null;
			for(var j=0; j<cameras.length; ++j){
				var c = cameras[j]
				if(c.data()==view["camera"]){
					cam = c;
				}
			}
			// var imageSize = view["imageSize"];
			var cellSize = view["cellSize"];
			// TODO: CELL SIZE HAS SOMETHING TO DO WITH THE IMAGE SIZE RATIOS OF SOURCE AND ACTUAL
			var v = world.addView(matrix, cam);
				match.temp(v);
				v.data(match.id());
			v.cellSize(cellSize);

			// transform
			var transform = Matrix.fromObject(view["transform"]);
			v.absoluteTransform(transform);

			BAVIEWS.push(v);
		}
	}
	return BAVIEWS;
}


App3DR.bundleAdjustObjectToPoints = function(world, points){
	var WORLDVIEWS = world.toViewArray();
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
		var v = WORLDVIEWS[i];
		WORLDVIEWSLOOKUP[v.data()] = v;
	}

	var worldViews = world.toViewArray();
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		// console.log(point);
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
// console.log(point3D+"")
		var pointViews = point["views"];
		pointCountAdded++;
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				// console.log(viewJ);
				// console.log(viewK);
				var vK = WORLDVIEWSLOOKUP[viewK["view"]];
				// console.log(vJ,vK);
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				// create
				var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
// console.log(affineAB);
				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
				// pointCountAdded++;
			}
		}
	}
	console.log("... added points: "+pointCountAdded);
}

App3DR.ProjectManager.prototype.calculateGlobalOrientationHierarchy = function(str){ // increase resolution of current YAML BA file
	// increase resolution for each view if possible

	// run iterations

	// save new BA file
}
// App3DR.ProjectManager.prototype.calculateBundleAdjustGlobal = function(callback, context, object){
// 	throw "calculateBundleAdjustGlobal";
// }

App3DR.ProjectManager.prototype.calculateBundleAdjustTriple = function(viewAIn,viewBIn,viewCIn, callback, context, object){
	console.log("calculateBundleAdjustTriple");
	var views = [viewAIn,viewBIn,viewCIn];
	var pairAB = this.pairFromViewIDs(viewAIn.id(),viewBIn.id());
	var pairAC = this.pairFromViewIDs(viewAIn.id(),viewCIn.id());
	var pairBC = this.pairFromViewIDs(viewBIn.id(),viewCIn.id());
	var pairs = [pairAB,pairAC,pairBC];
	// var cameras = this.cameras();

	console.log(graphData);
	throw "cameras from graph?"

	var project = this;
	var world = null;

	// save project file
	var saveTripleCompleted = function(a){
		console.log("saveTripleCompleted");
// throw "..."
		project.saveProjectFile();
	}

	// save to track file
	var worldTripleCompleted = function(payload){
		console.log("worldTripleCompleted");
		var scales = payload["scales"]
		var TFT = payload["T"];
		var meanTFT = payload["errorTMean"];
		var sigmaTFT = payload["errorTSigma"];
		// TODO: TFT NEEDS TO BE SCALED TO UNITY BEFORE STORAGE

		var idA = viewAIn.id();
		var idB = viewBIn.id();
		var idC = viewCIn.id();
		var viewA = world.viewFromData(idA);
		var viewB = world.viewFromData(idB);
		var viewC = world.viewFromData(idC);

		console.log(TFT);
		console.log(scales);
		var sAB = scales["AB"];
		var sAC = scales["AC"];
		var sBC = scales["BC"];
		var vA = scales["A"];
		var vB = scales["B"];
		var vC = scales["C"];

		var lookup = {};
			lookup[viewA.data()+"-"+viewB.data()] = sAB;
			lookup[viewB.data()+"-"+viewA.data()] = sAB;
			lookup[viewA.data()+"-"+viewC.data()] = sAC;
			lookup[viewC.data()+"-"+viewA.data()] = sAC;
			lookup[viewB.data()+"-"+viewC.data()] = sBC;
			lookup[viewC.data()+"-"+viewB.data()] = sBC;
		var scaleAB = lookup[idA+"-"+idB];
		var scaleAC = lookup[idA+"-"+idC];
		var scaleBC = lookup[idB+"-"+idC];

		console.log(scaleAB,scaleAC,scaleBC);
		var pointCount = world.point3DCount();

		console.log(viewA,viewB,viewC);

		var triple = project.triple(idA,idB,idC);
		console.log(triple);
		triple.setRelativeScales(scaleAB,scaleAC,scaleBC);
		triple.setTFT(TFT);
		triple.setTFTInfo(meanTFT,sigmaTFT);
		triple.setRelativeCount(pointCount);
		// get all relative transforms:
		var relatives = [];
		var vs = [viewA,viewB,viewC];
		for(var i=0; i<vs.length; ++i){
			var vA = vs[i];
			for(var j=i+1; j<vs.length; ++j){
				var vB = vs[j];
				var transform = world.transformFromViews(vA,vB);
				var errorRSigma = transform.rSigma();
				var errorRMean = transform.rMean();
				var errorFSigma = transform.fSigma();
				var errorFMean = transform.fMean();
				var matchCount = transform.matchCount();
				var F = transform.F(vA,vB);
				var R = transform.R(vA,vB);
				var r = {
					"A": vA.data(),
					"B": vB.data(),
					"relativeCount": matchCount,
					"errorFMean": errorFMean,
					"errorFSigma": errorFSigma,
					"errorRMean": errorRMean,
					"errorRSigma": errorRSigma,
					"R": R,
					"F": F,
				};
				relatives.push(r);
			}
		}
		// throw "..."
		triple.setRelativeTransforms(relatives);
		// relative file
		var str = world.toYAMLString();
		project.saveTripleRelative(triple, str, saveTripleCompleted, project);
	}

	var worldTripleNull = function(){
console.log("worldTripleNull");
		var idA = viewAIn.id();
		var idB = viewBIn.id();
		var idC = viewCIn.id();

		var triple = project.triple(idA,idB,idC);
		console.log(triple);
throw "?"
		triple.setRelativeScales(0,0,0);
		triple.setTFT(null);
		triple.setTFTInfo(0,0);
		triple.setRelativeCount(0);
		var rAB = {
			"A": idA,
			"B": idB,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var rAC = {
			"A": idA,
			"B": idC,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var rBC = {
			"A": idB,
			"B": idC,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var relatives = [rAB,rAC,rBC];
		triple.setRelativeTransforms(relatives);
		// relative file
		var str = "";
		project.saveTripleRelative(triple, str, saveTripleCompleted, project);
	}

	// convert to WORLD objects & find tracks
	var createWorld = function(a){
		console.log("create world ..."+pairs.length);
		// make images:
		var images = [];
		for(var i=0; i<views.length; ++i){
			var image = views[i].bundleAdjustImage();
			images.push(image);
		}
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			images[i] = matrix;
		}
		// fill world in
		world = new Stereopsis.World();
		// cameras
		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		// views
		App3DR.ProjectManager.addViewsToWorld(world, views, images);
		// matching points
console.log(world);
		console.log("add matching points");
		var pointsList = [];
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var relativeData = pair.relativeData();
			App3DR.ProjectManager.addPointsToWorld(world, relativeData["points"]);
			world.patchInitBasicSphere(true);
			var points3D = world.toPointArray();
			world.disconnectPoints3D(points3D);
			pointsList.push(points3D);
			console.log(" "+i+" = "+points3D.length);

			var idA = relativeData["views"][0]["id"];
			var idB = relativeData["views"][1]["id"];
			var transformA = relativeData["views"][0]["transform"];
			var transformB = relativeData["views"][1]["transform"];
				transformA = new Matrix().fromObject(transformA);
				transformB = new Matrix().fromObject(transformB);
			var transformAB = R3D.relativeTransformMatrix2(transformA,transformB);
			App3DR.ProjectManager.addTransformToWorld(world, transformAB, idA, idB);
		}
		// add points in
		console.log("add points with patches");
		for(var i=0; i<pointsList.length; ++i){
			var points3D = pointsList[i];
			// world.embedPoints3D(points3D);
			world.embedPoints3DNoValidation(points3D);
			// world.printPoint3DTrackCount();
		}
		// solve for relative scalings & whatnot
		console.log("solveTriple");
		world.solveTriple(worldTripleCompleted, project, null);

	}

	// done loading
	var fxnPairsLoaded = function(a){
		// viewAIn.id()
		// console.log(pairAB);
		// console.log(pairAC);
		// console.log(pairBC);
		var pairsA = this.allPairsWithViewID(viewAIn.id());
		var pairsB = this.allPairsWithViewID(viewBIn.id());
		var pairsC = this.allPairsWithViewID(viewCIn.id());
		pairsA = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsA);
		pairsB = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsB);
		pairsC = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsC);
		// console.log(pairsA);
		// console.log(pairsB);
		// console.log(pairsC);
		pairs = [];
		var checks = [[pairsA,pairsB],[pairsA,pairsC],[pairsB,pairsC]];
		var potentials = [pairAB,pairAC,pairBC];
		for(var i=0; i<potentials.length; ++i){
			var chk = checks[i];
			var inA = chk[0];
			var inB = chk[1];
			var pot = potentials[i];
			if(Code.elementExists(inA,pot) && Code.elementExists(inB,pot)){
				pairs.push(pot);
			}
		}
		if(pairs.length>=2){ // need all 3 transforms ? if only have 2 transforms then can only get AB->BC scale ....
			createWorld();
		}else{
			worldTripleNull();
		}
	}

	// load pair data
	var fxnImagesLoaded = function(a){
		console.log("load pairs ...");
		App3DR.ProjectManager.loadPairsRelativeData(pairs, fxnPairsLoaded, this, null);
	};

	// load all view images
	console.log("load images ...");
	App3DR.ProjectManager.loadViewsImages(views, fxnImagesLoaded, this, null);
}
App3DR.ProjectManager.prototype.calculatePairTracks = function(viewAIn,viewBIn, callback, context, object){
	var pair = this.pairFromViewIDs(viewAIn.id(),viewBIn.id());
	var world = null;
	var project = this;
	// backwards order:

	// save project file
	var savePairCompleted = function(a){
		console.log("savePairCompleted");
		project.saveProjectFile();
	}

	// save to track file
	var worldTracksCompleted = function(a){
		console.log("worldTracksCompleted");
// throw "..."
		var viewA = world.viewFromData(viewAIn.id());
		var viewB = world.viewFromData(viewBIn.id());
		console.log(viewA,viewB);
		var transform = world.transformFromViews(viewA,viewB);
		var count = transform.matches().length;
		var str = world.toYAMLString();
		var pair = project.pair(viewAIn.id(),viewBIn.id());
		pair.setTrackCount(count);
		console.log("pair track: "+pair.trackCount())
		project.savePairTracks(pair, str, savePairCompleted, project);
	}

	// convert to WORLD objects & find tracks
	var createWorld = function(a){
		// make images:
		var images = [viewAIn.bundleAdjustImage(),viewBIn.bundleAdjustImage()];
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			images[i] = matrix;
		}
		// fill world in
		world = new Stereopsis.World();
		var relativeData = pair.relativeData();
		App3DR.ProjectManager.addCamerasToWorld(world, relativeData["cameras"]);
		App3DR.ProjectManager.addViewsToWorld(world, relativeData["views"], images);
		App3DR.ProjectManager.addPointsToWorld(world, relativeData["points"]);
		// solve for tracks




/*
// TESTING:
// save as point list:
var str = world.toPointFile(true);
console.log(str);
throw "HERE";
*/

/*
// increase resolution:
	// set cell size:
	var BAVIEWS = world.toViewArray();
	for(var i=0; i<BAVIEWS.length; ++i){
		var view = BAVIEWS[i];
		// var size = view.sizeFromPercent(0.03); // 1% = 5 | 2% = 9 | 3% = 13
		// var size = view.sizeFromPercent(0.01); // 9
		// var size = view.sizeFromPercent(0.005); // 5
		var size = view.sizeFromPercent(0.002); // ?
		size = Math.round(size);
		if(size%2==0){ // make odd
			size += 1;
		}
		view.cellSize(size);
		console.log("view cell size: "+size)
	}



var completeFxn = function(){
console.log("completeFxn");
var str = world.toYAMLString();
console.log(str);
}
		world.solve(completeFxn,this);

*/
// throw "not tracks ..."

		world.solveForTracks(worldTracksCompleted, project, null);
	}

	// done loading
	var fxnPairsLoaded = function(a){
		console.log("loaded pairs");
		createWorld();
	}

	// load pair data
	var fxnImagesLoaded = function(a){
		console.log("loaded images");
		App3DR.ProjectManager.loadPairsRelativeData([pair], fxnPairsLoaded, this, null);
	};

	// load all view images
	App3DR.ProjectManager.loadViewsImages([viewAIn,viewBIn], fxnImagesLoaded, this, null);
}
App3DR.ProjectManager.addCamerasToWorld = function(world, cameras){
	var WORLDCAMS = [];
	console.log(cameras);
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var K = null;
		var distortion = null;
		var camID = null;
console.log(camera);
		if(Code.ofa(camera, App3DR.ProjectManager.Camera)){
			camID = camera.id();
			K = camera.K();
			distortion = camera.distortion();
		}else{ // object
			camID = camera["camera"]; // ...
			if(!camID){
				camID = camera["id"];
			}
			K = camera["K"];
			distortion = camera["distortion"];
// console.log(camID);
// console.log(K);
// console.log(distortion);
// throw "???"
		}
		if(!camID){
			camID = camera["id"];
			K = camera;
			distortion = camera;
		}
// console.log(K);
		if(K["fx"]!==undefined){
			K = new Matrix(3,3).fromArray([K["fx"],K["s"],K["cx"], 0,K["fy"],K["cy"], 0,0,1]);
		}else{
			if(!Code.isa(K,Matrix)){
				K = Matrix.loadFromObject(K);
			}
		}
// console.log(K);
console.log(world);
console.log(K);

		var c = world.addCamera(K, distortion);
		c.data(camID);
		// camera.temp(c);
		WORLDCAMS.push(c);
	}
console.log("done addCamerasToWorld");
	return WORLDCAMS;
}
App3DR.ProjectManager.addViewsToWorld = function(world, views, images, transforms){
console.log("addViewsToWorld");
	var WORLDVIEWS = [];
	var cameras = world.toCameraArray();
	var cameraLookup = {};
	for(var i=0; i<cameras.length; ++i){
		var c = cameras[i];
		var temp = c.data(); // id
		cameraLookup[temp] = c;
	}
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = images[i];
		var viewID = null;
		var camID = null;
		var transform = null;
		if(Code.ofa(view, App3DR.ProjectManager.View)){
			viewID = view.id();
			camID = view.cameraID();
			transform = new Matrix(4,4).identity();
		}else{
			viewID = view["id"];
			camID = view["camera"];
			transform = view["transform"];
			if(transform){
				transform = new Matrix(4,4).fromObject(transform);
			}
		}
		if(transforms){
			transform = transforms[i];
		}
		var cam = cameraLookup[camID];
		if(!cam){
			cam = cameras[0];
		}
		var v = world.addView(null,cam);
		v.absoluteTransform(transform);
		if(image){
			console.log(" ... image "+i);
			if(Code.isa(image, V2D)){
				v.size(image);
			}else{
				v.image(image);
			}
		}
		v.data(viewID);
// todo
// v.cellSize();
		WORLDVIEWS.push(v);
	}
	return WORLDVIEWS;
}
App3DR.ProjectManager.addTransformToWorld = function(world, matrix, viewAID, viewBID){
	var viewA = world.viewFromData(viewAID);
	var viewB = world.viewFromData(viewBID);
	var transform = world.transformFromViews(viewA,viewB);
	transform.R(viewA,viewB,matrix);
}
App3DR.ProjectManager.addPointsToWorld = function(world, points){
	var viewLookup = {};
	var views = world.toViewArray();
	for(var i=0; i<views.length; ++i){
	    var view = views[i];
	    viewLookup[view.data()] = view;
	}
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var arr1 = [o,x1,y1];
	var arr2 = [o,x2,y2];
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
		var pointViews = point["views"];
		// connect to view
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = viewLookup[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				var vK = viewLookup[viewK["view"]];
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				var affineAB = R3D.affineMatrixExact(arr1,arr2);
				// add
				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D, false, true);
				pointCountAdded++;
			}
		}
		// if(pointCountAdded>1000){
		// 	break;
		// }
	}
	console.log("ADDED POINTS: "+pointCountAdded);
}
App3DR.ProjectManager.loadPairsRelativeData = function(pairs, callback, context, object){
	var expectedPairs = pairs.length;
	var pair;
	var loadedPairs = 0;
	var fxnPairLoaded = function(pair){
		++loadedPairs;
		checkLoadedAllPairs();
	}
	var checkLoadedAllPairs = function(){
		if(loadedPairs==expectedPairs){
			callback.call(context, object);
		}
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadRelativeData(fxnPairLoaded, this);
	}
}
App3DR.ProjectManager.loadPairsTrackData = function(pairs, callback, context, object){
	var expectedPairs = pairs.length;
	var pair;
	var loadedPairs = 0;
	var fxnPairLoaded = function(pair){
		++loadedPairs;
		checkLoadedAllPairs();
	}
	var checkLoadedAllPairs = function(){
		if(loadedPairs==expectedPairs){
			callback.call(context, object);
		}
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadTrackData(fxnPairLoaded, this);
	}
}
App3DR.ProjectManager.loadViewsImages = function(views, callback, context, object){
	var view;
	var expectedViews = views.length;
	var loadedFeatureImages = 0;
	var expectedFeatureImages = views.length;

	var fxnFeatureImageLoaded = function(view){
		++loadedFeatureImages;
		checkLoadedAllImages.call(this);
	}
	var checkLoadedAllImages = function(){
		if(loadedFeatureImages==expectedFeatureImages){
			callback.call(context, object);
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(fxnFeatureImageLoaded, this);
	}
	if(views.length==0){
		checkLoadedAllImages();
	}
}


App3DR.ProjectManager.prototype.calculateBundleAdjustPair = function(viewAIn,viewBIn, callback, context, object){
	var i, j, k;
	var view, pair, camera;
	var views = [viewAIn,viewBIn];
	var pairs = [this.pair(viewAIn.id(),viewBIn.id())];
	var expectedViews = views.length;
	var expectedPairs = pairs.length;

	var cameras = [];
	for(i=0; i<views.length; ++i){
		view = views[i];
		var cameraID = view.cameraID();
		if(cameraID){
			camera = this.cameraFromID(cameraID);
			if(camera){
				Code.addUnique(cameras, camera);
			}
		}
	}
	cameras = this._cameras;// TODO: hook cameras up
	var expectedCameras = cameras.length;
	var loadedViews = 0;
	var loadedPairs = 0;
	var loadedCameras = 0;
	var loadedFeatureImages = 0;
	var expectedFeatureImages = views.length;
	var fxnA = function(view){
		++loadedViews;
		fxnD.call(this);
	}
	var fxnB = function(pair){
		++loadedPairs;
		fxnD.call(this);
	}
	var fxnC = function(view){
		++loadedFeatureImages;
		fxnD.call(this);
	}
	var fxnZ = function(eh){
		console.log("saved relative BA file");
		this.saveProjectFile();
	}
	var fxnD = function(){
		if(loadedViews==expectedViews && loadedPairs==expectedPairs && loadedFeatureImages==expectedFeatureImages){
			var i, j, k;
//var SHOULD_CORRECT_DISTOTION = true;
var SHOULD_CORRECT_DISTOTION = false;

if(false){
//if(true){
console.log("SHOW UNDISTORTED IMAGE:");

//
//console.log(cameras[0].distortion());

var distortion = cameras[0].distortion();
// distortion["k1"] = 0.0;
// distortion["k2"] = 0.0;
// distortion["k3"] = 0.0;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// RADIAL RESULT
// distortion["k1"] = -0.2;
// distortion["k2"] = 0.1;
// distortion["k3"] = -0.1;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// PINCUSHIN
// distortion["k1"] = 0.3;
// distortion["k2"] = 0.2;
// distortion["k3"] = 0.1;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// crazy
// distortion["k1"] = 0.3;
// distortion["k2"] = -0.2;
// distortion["k3"] = 0.3;
// distortion["p1"] = 0.3;
// distortion["p2"] = -0.2;

// distortion["k1"] = -0.1;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
var K = cameras[0].K();
	K = new Matrix(3,3).fromArray([K["fx"],K["s"],K["cx"], 0,K["fy"],K["cy"], 0,0,1]);
// distortion["k1"] = 0;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
// distortion["k1"] = 0;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
	//var img = views[0].featuresImage();
	var img = views[0].bundleAdjustImage();
	var matrix = R3D.imageMatrixFromImage(img, this._stage);
var source = matrix;
var distortionFwd = distortion;


var randomPoints = [];
for(var i=0; i<=10; ++i){
	//var point = new V2D(Math.random()*source.width(),Math.random()*source.height());
	for(var j=0; j<=10; ++j){
		//var point = new V2D(Math.random()*source.width(),Math.random()*source.height());
		var point = new V2D((i/10)*source.width(),(j/10)*source.height());
		randomPoints.push(point);
	}
}

//var distortionRev = R3D.getInvertedDistortion(distortion, K);
//var distortionRev = distortionFwd;
var distortionRev = null;
var what = R3D.invertImageDistortion(source, K, distortionFwd, true);
console.log(what);
var center = what["center"];
var mini = what["min"];
var deltaCenter = mini.copy().scale(-1);
console.log("center: "+center);
console.log("K: "+K);
var cx = K.get(0,2);
var cy = K.get(1,2);


var image = source;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(10, 10);
d.graphics().alpha(0.5);
GLOBALSTAGE.addChild(d);
	d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);

	d.graphics().beginPath();
	d.graphics().moveTo(-10,0);
	d.graphics().lineTo(10,0);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().moveTo(0,-10);
	d.graphics().lineTo(0,10);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().translate(10+cx*image.width(), 10+cy*image.height());
	GLOBALSTAGE.addChild(d);

	for(var i=0; i<randomPoints.length; ++i){
		var point = randomPoints[i];
		d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(10+point.x, 10+point.y);
		GLOBALSTAGE.addChild(d);
	}




var image = what["image"];
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(610, 10);
d.graphics().alpha(0.5);
GLOBALSTAGE.addChild(d);

var cx = center.x;
var cy = center.y;

	d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);

	d.graphics().beginPath();
	d.graphics().moveTo(-10,0);
	d.graphics().lineTo(10,0);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().moveTo(0,-10);
	d.graphics().lineTo(0,10);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().translate(610+cx*image.width(), 10+cy*image.height());
	GLOBALSTAGE.addChild(d);

	var sourceWidth = source.width();
	var sourceHeight = source.height();
	for(var i=0; i<randomPoints.length; ++i){
		var point = randomPoints[i];
		var p1 = point.copy();
		//
		p1.scale(1.0/sourceWidth,1.0/sourceHeight);
		var p2 = R3D.applyDistortionParameters(new V2D(), p1, K, distortionFwd);
		p2.scale(sourceWidth,sourceHeight);
		p2.add(deltaCenter);
		//
		point = p2;
		d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(610+point.x, 10+point.y);
		GLOBALSTAGE.addChild(d);
	}


K.set(0,2, center.x);
K.set(1,2, center.y);

} // if false




/*
var maxScale = 1.0;
	var destWidth = sourceWidth * maxScale;
	var destHeight = sourceHeight * maxScale;
	var offX = (destWidth-sourceWidth)*0.5;
	var offY = (sourceHeight-sourceHeight)*0.5;
	var destination = new ImageMat(destWidth,destHeight);
	var min = null;
	var max = null;
	var d = new V2D();
isUnit = true;
var widthToHeightRatio = sourceWidth/sourceHeight;
console.log(sourceWidth+"x"+sourceHeight);
console.log(offX+","+offY);
	for(var j=0; j<destHeight; ++j){
		for(var i=0; i<destWidth; ++i){
			//index = j*destWidth + i;
			undistorted.set(i-offX,j-offY);
			distorted.set(0,0);
			if(isUnit){
				undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight)/widthToHeightRatio);
				//undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight));
			}
			R3D.applyDistortionParameters(distorted, undistorted, K, distortions);
*/



// undistort image sources
// -> this moves K center



if(SHOULD_CORRECT_DISTOTION){
	/// ....
}


throw "no"

// START STEREOPSIS
console.log(" > CREATE WORLD");
// world
var world = new Stereopsis.World();

// locals
var BACAMS = [];
var BAVIEWS = [];
// cameras
console.log(cameras)
var correctedCameras = [];
for(var i=0; i<cameras.length; ++i){
	correctedCameras[i] = false;
	var camera = cameras[i];
	var K = camera.K();
	var distortion = camera.distortion();
	if(K && distortion){
		var fx = K["fx"];
		var fy = K["fy"];
		var s = K["s"];
		var cx = K["cx"];
		var cy = K["cy"];
		var k1 = distortion["k1"];
		var k2 = distortion["k2"];
		var k3 = distortion["k3"];
		var p1 = distortion["p1"];
		var p2 = distortion["p2"];
		var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
		var c = world.addCamera(K, distortion);
		console.log(c);
		// c.K(K);
		// c.distortion(distortion);
		// var inverted = R3D.getInvertedDistortion(K,distortion);
		// c.distortionInverted(inverted);
	}
	BACAMS.push(c);
}


if(BACAMS.length<1){
	throw "need a camera to do BA Pair";
}


var cam = BACAMS[0];
// views
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var img = view.bundleAdjustImage();
	var K = cam.K();
	var distortion = cam.distortion();
		var matrix = R3D.imageMatrixFromImage(img, this._stage);
// correct distortion
// var info = R3D.invertImageDistortion(matrix, K, distortion,true);
// var center = info["center"];
// matrix = info["image"];

	// SIZING ?
	//v.image(matrix);
		// v.images().push(matrix);
	//var imageSize = new V2D(1.0, 1.0/view.aspectRatio());
	// var imageWidth = v.image().width();
	// var imageHeight = v.image().height();
	// var imageSize = new V2D(imageWidth, imageHeight);

	var v = world.addView(matrix, cam, view);

	//v.index(view.id());
	// v.size(imageSize);
	// var corners = R3D.cornerScaleOptimum(matrix.gry(), matrix.width(), matrix.height());
	// v.corners(corners);
	// v.camera(cam);
		view.temp(v);
		v.data(view.id());
//		v.mapping(view.id());
//console.log("MAPPING: "+v.mapping());
	BAVIEWS.push(v);
}

console.log(" > READ/FILTER MATCHES");
// matches
for(var i=0; i<pairs.length; ++i){
	var pair = pairs[i];
	var matchData = pair.matchingData();
	var matches = matchData["matches"];
	var fromSize = matchData["fromSize"];
	var toSize = matchData["toSize"];
	var matches = matchData["matches"];
	var fromViewID = matchData["from"];
	var toViewID = matchData["to"];
	//
	var viewA = this.viewFromID(fromViewID);
	var viewB = this.viewFromID(toViewID);
	var vA = viewA.temp();
	var vB = viewB.temp();
	var imageWidthA = vA.image().width();
	var imageHeightA = vA.image().height();
	var imageWidthB = vB.image().width();
	var imageHeightB = vB.image().height();
		var aspectA = viewA.aspectRatio();
		var aspectB = viewB.aspectRatio();
		var fromImageSize = new V2D(imageWidthA,imageHeightA);
		var toImageSize = new V2D(imageWidthB,imageHeightB);


	// save local copy
	var filteredMatches = [];
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		var fr = match["fr"];
		var to = match["to"];
		var relScale = (to["s"]*imageWidthB)/(fr["s"]*imageWidthA);
		var relAngle = V2D.angleDifference(to["a"],fr["a"]);//to["a"] - fr["a"];

		fr = new V2D(fr.x,fr.y);
		//fr = R3D.undistortPointCamera(fr, K, distortion);
		fr.scale(fromImageSize.x,fromImageSize.y);

		to = new V2D(to.x,to.y);
		//to = R3D.undistortPointCamera(to, K, distortion);
		to.scale(toImageSize.x,toImageSize.y);
		filteredMatches.push([fr,to,relAngle,relScale]);
	}
	//console.log("MATCHES AFTER: "+filteredMatches.length);
	console.log("MATCHES FOR PAIR "+vA.id()+"+"+vB.id()+" == "+filteredMatches.length);


world.resolveIntersectionByMatchScore();
console.log(matches);
// var skip = true; // SKIP AFFINE SEQUENCE - OK FOR ~1000 not for ~10,000+
var skip = false;
	// copy over
	for(var j=0; j<filteredMatches.length; ++j){
	if(j%1000==0){
		console.log(" "+j+"/"+filteredMatches.length);
	}
// if(j>2000){
// 	break;
// }
		var match = filteredMatches[j];
		var fr = match[0];
		var to = match[1];
		var angleAB = match[2];
		var scaleAB = match[3]; // THIS DEPENDS ON ABSOLUTE SIZE ...
		var m = world.addMatchForViews(vA,fr, vB,to, scaleAB,angleAB, skip);

// j += 10; // 1/10th
	}
	console.log(world._points3DNull.length);
	// initially get 2-sigma points & only add those from match list
}
world.resolveIntersectionByDefault();



// check
// world.consistencyCheck();

var completeFxn = function(){
	console.log("completeFxn");
// throw "remove this";
	var viewA = BAVIEWS[0];
	var viewB = BAVIEWS[1];
	var transform = world.transformFromViews(viewA,viewB);
	var count = transform.matches().length; // doesn't count if P has 0 matches
	var str = world.toYAMLString();
	var pair = this.pair(viewAIn.id(),viewBIn.id());
	// update summary
	pair.setRelativeCount(count);
	pair.setF(transform.F(viewA,viewB));
	pair.setFInfo(transform.fMean(),transform.fSigma());
	pair.setR(transform.R(viewA,viewB));
	pair.setRInfo(transform.rMean(),transform.rSigma());
	this.saveProjectFile();

	// create/update pair file
	this.savePairRelative(pair, str, fxnZ, this);

	/*
	this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
	this.saveBundleAdjust(str, fxnZ, this);
	*/
}
console.log(world);


// set cell size:
for(var i=0; i<BAVIEWS.length; ++i){
	var view = BAVIEWS[i];
	// var size = view.sizeFromPercent(0.03); // 1% = 5 | 2% = 9 | 3% = 13
	// var size = view.sizeFromPercent(0.01);
	size = Math.round(size);
	if(size%2==0){ // make odd
		size += 1;
	}
	// size = 5;
	size = 11;
	view.cellSize(size);
	console.log("view cell size: "+size)
}




world.solvePair(completeFxn, this);
return;
throw "USE NEW BUNDLE ADJUST: R3D.BA";


			var BA = new R3D.BundleAdjust();
			var baViews = [];
			var baCameras = [];
// view = Code.copyArray(views);
// pairs = Code.copyArray(pairs);
// views = [views[0],views[1]];
// pairs = [pairs[0]];
			for(i=0; i<cameras.length; ++i){
				var camera = cameras[i];
				console.log(camera);
				var c = BA.addCamera();
					var K = camera.K();
					var distortion = camera.distortion();
					if(K && distortion){
						var fx = K["fx"];
						var fy = K["fy"];
						var s = K["s"];
						var cx = K["cx"];
						var cy = K["cy"];
						var k1 = distortion["k1"];
						var k2 = distortion["k2"];
						var k3 = distortion["k3"];
						var p1 = distortion["p1"];
						var p2 = distortion["p2"];
						c.index(camera.id());
						c.set(fx,fy,s,cx,cy, k1,k2,k3, p1,p2);
					}
				baCameras.push(c);
			}
			var cam = baCameras[0]; // TODO: connect camera to views
			// console.log("VIEWS");
			for(i=0; i<views.length; ++i){
				var view = views[i];
				var imageSize = new V2D(1.0, 1.0/view.aspectRatio());
				var v = BA.addView(imageSize);
					//var img = view.featuresImage();
					var img = view.denseHiImage();
					var matrix = R3D.imageMatrixFromImage(img, this._stage);
					v.images().push(matrix);
				v.index(view.id());
				v.size(imageSize);
				baViews.push(v);
					v.camera(cam);
					view._temp = v;
				// add all feature points
				var features = view.features();
				features.sort(function(a,b){ return a["score"]<b["score"] ? -1 : 1; });
				var beforeCount = features.length;
				//console.log("FEATURES BEFORE: "+features.length);
				//console.log(features);
				var filteredFeatures = [];
				// save local copy -- assumed orderd by score increasing
				for(j=0; j<features.length; ++j){
					var feature = features[j];
					var pos = feature["point"];
					var size = feature["size"];
					var angle = feature["angle"];
					pos = pos.copy().scale(imageSize.x,imageSize.y);
					size = size * imageSize.x;
					var feature = new V4D(pos.x,pos.y,angle,size);
					filteredFeatures.push(feature);
				}
				// remove duplicate features:
				var eps = 1E-10;
				for(j=0; j<filteredFeatures.length; ++j){
					var featureA = filteredFeatures[j];
					for(k=j+1; k<filteredFeatures.length; ++k){
						var featureB = filteredFeatures[k];
						if( Math.abs(featureA.x-featureB.x)<eps &&  Math.abs(featureA.y-featureB.y)<eps){
							filteredFeatures.splice(j,1);
							--j; // retry
							break;
						}
					}
				}
				//console.log("FEATURES AFTER: "+filteredFeatures.length);
				// copy over
console.log("FEATURES FOR VIEW "+i+" == "+filteredFeatures.length+" / "+beforeCount);
				for(j=0; j<filteredFeatures.length; ++j){
					var pos = filteredFeatures[j];
					var point = v.addPoint2D(pos.x,pos.y,pos.z,pos.t);
				}
			}
			var matchesCount = 0;
			// console.log("PAIRS");
			for(i=0; i<pairs.length; ++i){
				var pair = pairs[i];
				var matchData = pair.matchingData();
				var matches = matchData["matches"];
				var fromSize = matchData["fromSize"];
				var toSize = matchData["toSize"];
				var matches = matchData["matches"];
				var fromViewID = matchData["from"];
				var toViewID = matchData["to"];
				//
				var viewA = this.viewFromID(fromViewID);
				var viewB = this.viewFromID(toViewID);
					var aspectA = viewA.aspectRatio();
					var aspectB = viewB.aspectRatio();
					var fromImageSize = new V2D(1.0,1.0/aspectA);
					var toImageSize = new V2D(1.0,1.0/aspectB);
				var vA = viewA._temp;
				var vB = viewB._temp;
				//console.log("MATCHES BEFORE: "+matches.length);
var beforeCount = matches.length;
				// save local copy
				var filteredMatches = [];
				for(j=0; j<matches.length; ++j){
					var match = matches[j];
					var fr = match["fr"];
					var to = match["to"];
					fr = new V2D(fr.x,fr.y);
					fr.scale(fromImageSize.x,fromImageSize.y);
					to = new V2D(to.x,to.y);
					to.scale(toImageSize.x,toImageSize.y);
					filteredMatches.push([fr,to]);
				}
				// remove duplicates
				// TODO: keep best dups
				var eps = 1E-10;
				for(j=0; j<filteredMatches.length; ++j){
					var matchA = filteredMatches[j];
					for(k=j+1; k<filteredMatches.length; ++k){
						var matchB = filteredMatches[k];
						if( (Math.abs(matchA[0].x-matchB[0].x)<eps && Math.abs(matchA[0].y-matchB[0].y)<eps) ||
						    (Math.abs(matchA[1].x-matchB[1].x)<eps && Math.abs(matchA[1].y-matchB[1].y)<eps) ){
							filteredMatches.splice(j,1);
							--j; // retry
							break;
						}
					}
				}
				//console.log("MATCHES AFTER: "+filteredMatches.length);
				console.log("MATCHES FOR PAIR "+vA.id()+"+"+vB.id()+" == "+filteredMatches.length+" / "+beforeCount);
				// copy over
				for(j=0; j<filteredMatches.length; ++j){
					var match = filteredMatches[j];
					var fr = match[0];
					var to = match[1];
					var pointA = vA.closestPoint2D(fr.x,fr.y);
					var pointB = vB.closestPoint2D(to.x,to.y);
					if(pointA && pointB){
						BA.matchPoints2D(pointA, pointB);
						++matchesCount;
					}
				}
				// initially get 2-sigma points & only add those from match list
			}
			console.log("matchesCount: "+matchesCount);
			BA.process();
			var str = BA.toYAMLString();
//			console.log(str);
			this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
			this.saveBundleAdjust(str, fxnZ, this);
			this.saveProjectFile();
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadFeatures(fxnA, this);
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadMatchingData(fxnB, this);
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		//view.loadFeaturesImage(fxnC, this);
		//view.loadDenseHiImage(fxnC, this); // REPLACE 1
		view.loadBundleAdjustImage(fxnC, this); // REPLACE 1
	}
	for(i=0; i<cameras.length; ++i){
		// camera K is in default camera data
	}
// */
//
// }
// }
}


App3DR.ProjectManager.prototype._matchesToYAML = function(matches, F, viewA, viewB, imageMatrixA, imageMatrixB){
	// imageMatrixA, imageMatrixB, F, matches, additionalParams
	// var parameters = {};
	// 	parameters[""] = null;
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();

	yaml.writeComment("3DR Features File 0");
	yaml.writeBlank();
	yaml.writeString("title", "features");
	yaml.writeString("created", timestampNow);
	yaml.writeString("from", viewA.id());
	yaml.writeString("to", viewB.id());

	return R3D.outputMatchPoints(imageMatrixA, imageMatrixB, F, matches, yaml);
}

// App3DR.ProjectManager.prototype._matchesToYAML = function(matches, F, viewA, viewB, imageMatrixA, imageMatrixB){
// 	var timestampNow = Code.getTimeStampFromMilliseconds();
// 	var widA = imageMatrixA.width();
// 	var heiA = imageMatrixA.height();
// 	var widB = imageMatrixB.width();
// 	var heiB = imageMatrixB.height();

// 	var yaml = new YAML();
// 	yaml.writeComment("3DR Features File 0");
// 	yaml.writeBlank();
// 	yaml.writeString("title", "features");
// 	yaml.writeString("created", timestampNow);

// 	yaml.writeString("from", viewA.id());
// 	yaml.writeString("to", viewB.id());

// 	yaml.writeObjectStart("fromSize");
// 		yaml.writeNumber("x",widA);
// 		yaml.writeNumber("y",heiA);
// 	yaml.writeObjectEnd();
// 	yaml.writeObjectStart("toSize");
// 		yaml.writeNumber("x",widB);
// 		yaml.writeNumber("y",heiB);
// 	yaml.writeObjectEnd();

// 	yaml.writeObjectStart("F");
// 		var Fnorm = F.copy();
// 			Fnorm = Matrix.mult(Fnorm, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA));
// 			Fnorm = Matrix.mult(Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB), Fnorm);
// 		Fnorm.toYAML(yaml);
// 	yaml.writeObjectEnd();
// 	yaml.writeNumber("count", matches.length);
// 	yaml.writeArrayStart("matches");
// 	var i, len=matches.length;
// 	for(i=0; i<len; ++i){
// 		var match = matches[i];
// 		var score = match["score"];
// 		var fr = match["from"];
// 		var to = match["to"];
// 		yaml.writeObjectStart();
// 			yaml.writeObjectStart("fr");
// 				yaml.writeNumber("i", match["A"]);
// 				yaml.writeNumber("x", fr["point"].x/widA);
// 				yaml.writeNumber("y", fr["point"].y/heiA);
// 				yaml.writeNumber("s", fr["size"]/widA);
// 				yaml.writeNumber("a", fr["angle"]);
// 			yaml.writeObjectEnd();
// 			yaml.writeObjectStart("to");
// 				yaml.writeNumber("i", match["B"]);
// 				yaml.writeNumber("x", to["point"].x/widB);
// 				yaml.writeNumber("y", to["point"].y/heiB);
// 				yaml.writeNumber("s", to["size"]/widB);
// 				yaml.writeNumber("a", to["angle"]);
// 			yaml.writeObjectEnd();
// 		yaml.writeObjectEnd();
// 	}
// 	yaml.writeArrayEnd();
// 	yaml.writeBlank();
// 	return yaml.toString();
// }

App3DR.ProjectManager.prototype._tripleMatchesToYAML = function(tripleInfo, viewA, viewB, viewC, imageMatrixA, imageMatrixB, imageMatrixC){
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var widA = imageMatrixA.width();
	var heiA = imageMatrixA.height();
	var widB = imageMatrixB.width();
	var heiB = imageMatrixB.height();
	var widC = imageMatrixC.width();
	var heiC = imageMatrixC.height();

	var yaml = new YAML();
	yaml.writeComment("3DR Triple Matches File 0");
	yaml.writeBlank();
	yaml.writeString("title", "triple matches");
	yaml.writeString("created", timestampNow);

	yaml.writeString("viewA", viewA.id());
	yaml.writeString("viewB", viewB.id());
	yaml.writeString("viewC", viewC.id());

	yaml.writeObjectStart("ASize");
		yaml.writeNumber("x",widA);
		yaml.writeNumber("y",heiA);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("BSize");
		yaml.writeNumber("x",widB);
		yaml.writeNumber("y",heiB);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("CSize");
		yaml.writeNumber("x",widC);
		yaml.writeNumber("y",heiC);
	yaml.writeObjectEnd();


	var tripleA = tripleInfo["A"];
	var tripleB = tripleInfo["B"];
	var tripleC = tripleInfo["C"];
	var scores = tripleInfo["scores"];


	yaml.writeObjectStart("T");
		// TODO: TRIFOCAL TENSOR
		yaml.writeString("dunno",null);
	yaml.writeObjectEnd();

	yaml.writeNumber("count", scores.length);

	yaml.writeArrayStart("matches");
	var i, len=scores.length;
	for(i=0; i<len; ++i){
		var A = tripleA[i];
		var B = tripleB[i];
		var C = tripleC[i];
		var score = scores[i];
			var pointA = A["point"];
			var pointB = B["point"];
			var pointC = C["point"];
			var sizeA = A["size"];
			var sizeB = B["size"];
			var sizeC = C["size"];
			var angleA = A["angle"];
			var angleB = B["angle"];
			var angleC = C["angle"];
		yaml.writeObjectStart();
			yaml.writeObjectStart("A");
				yaml.writeNumber("x", pointA.x);
				yaml.writeNumber("y", pointA.y);
				yaml.writeNumber("s", sizeA);
				yaml.writeNumber("a", angleA);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("B");
				yaml.writeNumber("x", pointB.x);
				yaml.writeNumber("y", pointB.y);
				yaml.writeNumber("s", sizeB);
				yaml.writeNumber("a", angleB);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("C");
				yaml.writeNumber("x", pointC.x);
				yaml.writeNumber("y", pointC.y);
				yaml.writeNumber("s", sizeC);
				yaml.writeNumber("a", angleC);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	var str = yaml.toString();
	return str;
}

App3DR.ProjectManager.prototype._featuresToYAML = function(features){
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var i;
	var yaml = new YAML();
	
	yaml.writeComment("3DR Features File 0");
	yaml.writeBlank();
	yaml.writeString("title", "features");
	yaml.writeString("created", timestampNow);

	// var count = 0;
	// if(features){
	// 	count = features["features"].length;
	// }
	// yaml.writeNumber("count", count);

	yaml.writeObjectLiteral(features);

	yaml.writeDocument();

	return yaml.toString();
}

App3DR.ProjectManager.prototype._featuresFromObject = function(object){
	var title = object["title"];
	var created = object["created"];
	var count = object["count"];
	var features = object["features"];
	var list = [];
	if(features && features.length>0){
		var i, len = features.length;
		for(i=0; i<len; ++i){
			var feature = features[i];
				var object = {};
				var pointX = feature["x"];
				var pointY = feature["y"];
				object["point"] = new V2D(pointX,pointY);
				object["size"] = feature["size"];
				object["angle"] = feature["angle"];
				object["affine"] = feature["affine"];
//				object["vector"] = feature["vector"];
			list.push(object);
		}
	}
	return list;
}
App3DR.ProjectManager.prototype.viewFromID = function(viewID){
	if(viewID){
		var views = this._views;
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			if(view.id()==viewID){
				return view;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.cameraFromID = function(cameraID){
	if(cameraID){
		var cameras = this._cameras;
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			if(camera.id()==cameraID){
				return camera;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.pairFromID = function(pairID){
	if(pairID){
		var pairs = this._pairs;
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			if(pair.id()==pairID){
				return pair;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.x = function(){

}

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.View = function(manager, name, viewID){
	this._manager = manager;
	this._title = name ? name : "unknown name";
	this._id = viewID ? viewID : "no_id";
	this._pictureInfo = []; //
	this._widthToHeightRatio = null;
	// this._pictures = null; // actual data when loaded --- maybe only specific sizes ? [icon, denseLo, features, denseHi, texture, original]
	this._maskInfo = null; // info
	this._mask = null; // actual data when loaded
	this._featureCount = null;
	this._featureData = null; // actual data when loaded
	// this._viewSimilarities = null;
	// this._pairInfo = null;
	this._cameraID = null;
	this._pictureSourceMask = null;
	this._pictureSourceIcon = null;
	this._pictureSourceDenseLo = null;
	this._pictureSourceFeatures = null;
	this._pictureSourceDenseHi = null;
	this._pictureSourceTexture = null;
	this._pictureSourceMax = null;
	this._temp = null;
}
App3DR.ProjectManager.View.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
App3DR.ProjectManager.View.prototype.hasCamera = function(){
	return this._cameraID !== null;
}
App3DR.ProjectManager.View.prototype.setCameraID = function(id){
	this._cameraID = id;
}
App3DR.ProjectManager.View.prototype.hasFeatures = function(){
	return this._featureCount !== null;
}
App3DR.ProjectManager.View.prototype.featureData = function(f){
	if(f!==undefined){
		this._featureData = f;
	}
	return this._featureData;
}
// App3DR.ProjectManager.View.prototype.hasViewSimilarity = function(){
// 	return this._viewSimilarities !== null;
// }

App3DR.ProjectManager.View.prototype.toYAML = function(yaml){
	var i, len;
	yaml.writeString("title", this._title);
	yaml.writeString("id", this._id);
	yaml.writeString("camera", this._cameraID);
	yaml.writeNumber("aspectRatio", this._widthToHeightRatio);
	// mask
	if(this._maskInfo){
		var mask = this._maskInfo;
		yaml.writeObjectStart("mask");
			yaml.writeString("file",mask["file"]);
		yaml.writeObjectEnd();
	}else{
		yaml.writeString("mask", null);
	}
	// summary / features
	yaml.writeNumber("features",this._featureCount);
	// view compares
	// yaml.writeArray("similarity",this._viewSimilarities);
	// pictures
	len = this._pictureInfo ? this._pictureInfo.length : 0;
	yaml.writeArrayStart("pictures");
	for(i=0; i<len; ++i){
		var picture = this._pictureInfo[i];
		yaml.writeObjectStart();
			yaml.writeString("file", picture["file"]);
			yaml.writeNumber("width", picture["width"]);
			yaml.writeNumber("height", picture["height"]);
			yaml.writeNumber("scale", picture["scale"]);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// other?
}
App3DR.ProjectManager.View.prototype.readFromObject = function(obj){
	this._mask = null;
	this._pictureSourceIcon = null;
	this._pictureSourceDenseLo = null;
	this._pictureSourceFeatures = null;
	this._pictureSourceDenseHi = null;
	this._pictureSourceTexture = null;
	this._pictureSourceMax = null;
	this._features = null;
	var title = obj["title"];
	var id = obj["id"];
	var mask = obj["mask"];
	var pictures = obj["pictures"];
	var features = obj["features"];
	// var similarity = obj["similarity"];
	var pairs = obj["pairs"];
	var camera = obj["camera"];
	var aspect = obj["aspectRatio"]
	this._title = title;
	this._id = id;
	this._pictureInfo = [];
	this._cameraID = camera;
	this._widthToHeightRatio = aspect;
	// mask
	if(mask){
		var m = {};
			m["file"] = mask["file"];
		this._mask = m;
	}else{
		this._maskInfo = null;
	}
	// pictures
	if(pictures){
		for(var i=0; i<pictures.length; ++i){
			var o = pictures[i];
			var picture = {};
				picture["file"] = o["file"];
				picture["width"] = o["width"];
				picture["height"] = o["height"];
				picture["scale"] = o["scale"];
			this._pictureInfo.push(picture);
		}
	}
	// features
	if(features){
		this._featureCount = features;
	}
	// if(similarity){
	// 	this._viewSimilarities = similarity;
	// }
	if(camera){
		this._cameraID = camera;
	}else{
		this._cameraID = null;
	}
}
App3DR.ProjectManager.View.prototype.saveMaskPicture = function(image){
	console.log("saveMaskPicture");
	var filename = App3DR.ProjectManager.PICTURE_MASK_FILE_NAME;
	var size = null;
	var scale = null;
		var imageBase64 = image.src;
		var imageBinary = Code.base64StringToBinary(imageBase64);
	var binary = imageBinary;
	var object = {};
	var info = this._manager.addPictureForView(this, filename, size, scale, binary, this._saveMaskPictureComplete, this, object);
}
App3DR.ProjectManager.View.prototype._saveMaskPictureComplete = function(object, data){
	console.log("_saveMaskPictureComplete");
}
App3DR.ProjectManager.View.prototype.addPicture = function(size, scale, binary,  callback, context, returnObject){
	var filename = (scale*100.0)+"."+"png";
	var object = {};
		object["size"] = size;
		object["scale"] = scale;
		object["binary"] = binary;
		object["filename"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	var info = this._manager.addPictureForView(this, filename, size, scale, binary, this._callbackAddPicture, this, object);
	// view, filename, size, scale, binary, callback, context, object
}

App3DR.ProjectManager.View.prototype._callbackAddPicture = function(object, data){
	console.log("add picture callback");
	console.log(object);
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var size = object["size"];
	var scale = object["scale"];
	var filename = object["filename"];
		var picture = {};
		picture["file"] = filename;
		picture["scale"] = scale;
		picture["width"] = size.x;
		picture["height"] = size.y;
	this._pictureInfo.push(picture);
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.id = function(){
	return this._id;
}
App3DR.ProjectManager.View.prototype.cameraID = function(){
	return this._cameraID;
}
// App3DR.ProjectManager.View.prototype.directory = function(){
// 	return this._directory;
// }
App3DR.ProjectManager.View.prototype.maximumImageSize = function(){
	var list = this._pictureInfo;
	if(list){
		var maxSize = null;
		var maxScale = null;
		for(var i=0; i<list.length; ++i){
			var item = list[i];
			var scale = item["scale"];
			if(maxScale==null || scale>maxScale){
				maxScale = scale;
				maxSize = item;
			}
		}
		var width = maxSize["width"];
		var height = maxSize["height"];
		maxSize = new V2D(width,height);
		return maxSize;
	}
	return null;
}
App3DR.ProjectManager.View.prototype.aspectRatio = function(r){
	if(r!==undefined){
		this._widthToHeightRatio = r;
	}
	return this._widthToHeightRatio;
}
App3DR.ProjectManager.View.prototype.removePicture = function(index){
	//
}
App3DR.ProjectManager.View.prototype.setFeatureData = function(featureData, callback, context, returnObject){
	console.log("setFeatures");
	this._featureData = featureData;
	var filename = App3DR.ProjectManager.FEATURES_FILE_NAME;
	var object = {};
		object["featureData"] = featureData;
		object["file"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	this._manager.saveFeaturesForView(this, this._featureData, filename, this._setFeatureDataComplete, this, object);
}
App3DR.ProjectManager.View.prototype._setFeatureDataComplete = function(object, data){
	console.log("_setFeaturesComplete");

	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var featureData = object["featureData"];
	var filename = object["file"];
	// this._featureData = null;
	console.log(featureData);
	if(featureData){
		var features = Code.valueOrDefault(featureData["features"],[]);
		this._featureCount = features.length;
	}else{
		this._featureCount = null;
	}
	this._manager.saveProjectFile();
	returnObject = this;
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.featureData = function(){
	return this._featureData;
}
App3DR.ProjectManager.View.prototype.loadFeatureData = function(callback, context, returnObject){
	console.log("loadFeatureData");
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	this._manager.loadFeaturesForView(this, App3DR.ProjectManager.FEATURES_FILE_NAME, this._loadFeatureDataComplete, this, object);
}
App3DR.ProjectManager.View.prototype._loadFeatureDataComplete = function(object, data){
	// console.log("_loadFeaturesComplete");
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var yamlObject = data ? Code.binaryToYAMLObject(data) : null;
	if(yamlObject){
		// var featureData = this._manager._featuresFromObject(yamlObject);
		var featureData = (yamlObject);
		this._featureData = featureData;
	}
	returnObject = this;
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.setMask = function(index){
	//
}
App3DR.ProjectManager.View.prototype.getMask = function(index){
	//
}
App3DR.ProjectManager.View.prototype.load = function(){
	// load from disk
}
App3DR.ProjectManager.View.prototype.unload = function(){
	// free space
}
// image loading
App3DR.ProjectManager.View.prototype.maskImage = function(){
	return this._pictureSourceMask;
}
App3DR.ProjectManager.View.prototype.iconImage = function(){
	return this._pictureSourceIcon;
}
App3DR.ProjectManager.View.prototype.denseLomage = function(){
	return this._pictureSourceDenseLo;
}
App3DR.ProjectManager.View.prototype.featuresImage = function(){
	return this._pictureSourceFeatures;
}
App3DR.ProjectManager.View.prototype.denseHiImage = function(){
	return this._pictureSourceDenseHi;
}
App3DR.ProjectManager.View.prototype.bundleAdjustImage = function(){
	return this._pictureSourceBundleAdjust;
}
App3DR.ProjectManager.View.prototype.textureImage = function(){
	return this._pictureSourceTexture;
}
App3DR.ProjectManager.View.prototype.maxImage = function(){
	return this._pictureSourceMax;
}
App3DR.ProjectManager.View.prototype.loadIconImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON, callback, context);
}
App3DR.ProjectManager.View.prototype.loadPreviewImage = function(callback, context){ // for model
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES, callback, context);
	// this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO, callback, context);
}
App3DR.ProjectManager.View.prototype.loadDenseLoImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO, callback, context);
}
App3DR.ProjectManager.View.prototype.loadFeaturesImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES, callback, context);
}
// App3DR.ProjectManager.View.prototype.loadSparseImage = function(callback, context){
// 	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO, callback, context);
// }
App3DR.ProjectManager.View.prototype.loadDenseHiImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI, callback, context);
}
App3DR.ProjectManager.View.prototype.loadTrackImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI, callback, context);
}
App3DR.ProjectManager.View.prototype.loadBundleAdjustImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST, callback, context);
}
App3DR.ProjectManager.View.prototype.loadTextureImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE, callback, context);
}
App3DR.ProjectManager.View.prototype.loadMaximumImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MAX, callback, context);
}
App3DR.ProjectManager.View.prototype.loadMaskImage = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["type"] = App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK;
	this._manager.loadImageForView(this, App3DR.ProjectManager.PICTURE_MASK_FILE_NAME, this._loadImageComplete, this, object);
}
// synonyms:
App3DR.ProjectManager.View.prototype.matchingImage = function(){
	return this.featuresImage();
}
App3DR.ProjectManager.View.prototype.loadMatchingImage = function(callback, context){
	return this.loadFeaturesImage(callback, context);
}


App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON = 0;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES = 1;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO = 2;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI = 3;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST = 4;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE = 5;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MAX = 6;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK = 100;
App3DR.ProjectManager.View.prototype._loadImage = function(type, callback, context){
	// average : size of / space between : feature
	var cellSize = 11; // 11-21
	var cellCountSparse = 75; // 40 -> 75
	var cellCountDenseLo = 100; // 60 -> 110
	var cellCountDenseHi = 140; // 80 -> 140
	var cellCountDetails = 200; // 120 -> 210
	var pixelCountSparseLinear = cellSize*cellCountSparse;
	var pixelCountDenseLoLinear = cellSize*cellCountDenseLo;
	var pixelCountDenseHiLinear = cellSize*cellCountDenseHi;
	var pixelCountDetailLinear = cellSize*cellCountDetails;
	// console.log("sparse size: "+pixelCountSparseLinear);
	// console.log("dense size: "+pixelCountDenseLinear);
	// console.log("detail size: "+pixelCountDetailLinear);
	var pixelCountSparse = pixelCountSparseLinear*pixelCountSparseLinear;
	var pixelCountDenseLo = pixelCountDenseLoLinear*pixelCountDenseLoLinear;
	var pixelCountDenseHi = pixelCountDenseHiLinear*pixelCountDenseHiLinear;
	var pixelCountDetail = pixelCountDetailLinear*pixelCountDetailLinear;
	// var maxRatio = 1.5;
	var maxRatio = 2.0;
	// LOAD
	var pictures = this._pictureInfo.sort(App3DR.ProjectManager.View.sortSizeIncreasing);
	// default
	var desiredPixelCount = 500*400;
	var maximumPixelCount = 700*600;
	if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON){
		desiredPixelCount = 300*200;
		maximumPixelCount = 400*550;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES){ // FEATURES ~ SPARSE
		desiredPixelCount = pixelCountSparse;
		maximumPixelCount = pixelCountSparse*maxRatio;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO){ // SPARSE TRACKS
		desiredPixelCount = pixelCountDenseLo;
		maximumPixelCount = pixelCountDenseLo*maxRatio;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI){ // DENSE TRACKS
		desiredPixelCount = pixelCountDenseHi;
		maximumPixelCount = pixelCountDenseHi*maxRatio;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST){ // DENSE BA
		desiredPixelCount = pixelCountDetail;
		maximumPixelCount = pixelCountDetail*maxRatio;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE){ // DENSE ?
		desiredPixelCount = 2000*2500;
		maximumPixelCount = 2500*3000;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MAX){ // LARGEST POSSIBLE
		desiredPixelCount = 1E99;
		maximumPixelCount = 1E99;
	}
	console.log(desiredPixelCount+" -> "+maximumPixelCount);
	var closestPicture = -1;
	var currentPixels = 0;
	for(var i=0; i<pictures.length; ++i){
		var picture = pictures[i];
		var width = picture["width"];
		var height = picture["height"];
		var pixels = width*height;
		// console.log(i+": "+pixels+" of: ["+maximumPixelCount+"]");
		if(pixels<=maximumPixelCount && pixels>currentPixels){
			closestPicture = i;
			currentPixels = pixels;
		}
	}
	if(closestPicture==null){
		closestPicture = 0;
	}
	var picture = pictures[closestPicture];
console.log("loading picture: "+closestPicture);
// console.log(picture)
// throw "?"
	var file = null;
	if(picture){
		file = picture["file"];
	}
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["type"] = type;
	this._manager.loadImageForView(this, file, this._loadImageComplete, this, object);
}
App3DR.ProjectManager.prototype.dataToImage = function(data, callback, context){
	var binary = data;
	var filetype = "png";
	var base64 = Code.arrayBufferToBase64(binary);
	var imageSrc = Code.appendHeaderBase64(base64, filetype);
	var image = new Image();
	image.onload = function(e){
		callback.call(context, image);
	}
	image.src = imageSrc;
}
App3DR.ProjectManager.View.prototype._loadImageComplete = function(object, data){
	// console.log("_loadImageComplete");
	// console.log(object);
	// console.log(data);
	var callback = object["callback"];
	var context = object["context"];
	var loadType = object["type"];
	var self = this;

	if(!data){
		throw "NO DATA ?"
		callback.call(context, self);
		return;
	}

	var binary = data;
	var filetype = "png";
	var base64 = Code.arrayBufferToBase64(binary);
	var imageSrc = Code.appendHeaderBase64(base64, filetype);
	var image = new Image();

	image.onload = function(e){
		if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON){
			self._pictureSourceIcon = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES){
			self._pictureSourceFeatures = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO){
			self._pictureSourceDenseLo = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI){
			self._pictureSourceDenseHi = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE){
			self._pictureSourceTexture = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST){
			self._pictureSourceBundleAdjust = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MAX){
			self._pictureSourceMax = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK){
			self._pictureSourceMask = image;
		}else{
			console.log("UNKNOWN LOAD TYPE: "+loadType);
		}
		callback.call(context, self);
	}
	image.src = imageSrc;
}
/*
	this._pictureSourceIcon = null;
		this._pictureSourceDenseLo = null;
		this._pictureSourceFeatures = null;
		this._pictureSourceDenseHi = null;
		this._pictureSourceTexture = null;
*/
App3DR.ProjectManager.View.prototype.loadLowDenseImage = function(callback, context){
	var desiredPixelCount = 400*300;
	var maximumPixelCount = 800*600;
	throw "?";
}
App3DR.ProjectManager.View.prototype.loadTexturingImage = function(callback, context){
	var desiredPixelCount = 1600*1200;
	var maximumPixelCount = 1920*1080;
	throw "?";
}
App3DR.ProjectManager.View.sortSizeIncreasing = function(a,b){
	var aWidth = a["width"];
	var aHeight = a["height"];
	var bWidth = b["width"];
	var bHeight = b["height"];
	var aSize = aWidth*aHeight;
	var bSize = bWidth*bHeight;
	return aSize < bSize ? -1 : 1;
}
App3DR.ProjectManager.View.prototype.toString = function(){
	return "[View: "+this.id()+"]";
}
App3DR.ProjectManager.View.prototype.anyLoadedImage = function(){
	var images = [
		this._pictureSourceIcon,
		this._pictureSourceDenseLo,
		this._pictureSourceFeatures,
		this._pictureSourceDenseHi,
		this._pictureSourceBundleAdjust,
		this._pictureSourceTexture,
		this._pictureSourceMax,
	];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		if(image){
			return image;
		}
	}
	return null;
}

// ------------------------------------------------------------------------------------------------------------
/*
App3DR.ProjectManager.Pair = function(manager, directory, viewA, viewB){
	this._manager = manager;
	this._directory = directory;
	this._viewAID = viewA;
	this._viewBID = viewB;
	// MATCHES 2D
	// this._matchFeatureCount = null; // total matched features [above minimum]
	this._matchFeatureCount = null; // total matched features [above minimum]
	this._relativeCount = null;
	// MATCHES - 3D
	this._matchingData = null;
	this._relativeData = null;
	// TRACKS - 3D
	this._trackCount = null;
	this._trackData = null;
	// INFO
	this._F = null;
	this._R = null;
	this._FerrorMean = null;
	this._FerrorSigma = null;
	this._RerrorMean = null;
	this._RerrorSigma = null;
}


App3DR.ProjectManager.Pair.prototype.toString = function(){
	return "[Pair: "+this._viewAID+" : "+this._viewBID+"]";
}
App3DR.ProjectManager.Pair.prototype.viewA = function(){
	return this._manager.viewFromID(this._viewAID);
}
App3DR.ProjectManager.Pair.prototype.viewB = function(){
	return this._manager.viewFromID(this._viewBID);
}
App3DR.ProjectManager.Pair.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Pair.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Pair.prototype.matchingData = function(){
	return this._matchingData;
}
App3DR.ProjectManager.Pair.prototype.relativeData = function(){
	return this._relativeData;
}
App3DR.ProjectManager.Pair.prototype.setMatchFeatureCount = function(count){
	this._matchFeatureCount = count;
}
App3DR.ProjectManager.Pair.prototype.matchFeatureCount = function(count){
	return this._matchFeatureCount;
}
App3DR.ProjectManager.Pair.prototype.setRelativeCount = function(count){
	this._relativeCount = count;
}
App3DR.ProjectManager.Pair.prototype.relativeCount = function(){
	return this._relativeCount;
}
App3DR.ProjectManager.Pair.prototype.setTrackCount = function(count){
	this._trackCount = count;
}
App3DR.ProjectManager.Pair.prototype.trackCount = function(){
	return this._trackCount;
}
App3DR.ProjectManager.Pair.prototype.trackData = function(){
	return this._trackData;
}
App3DR.ProjectManager.Pair.prototype.setF = function(F){
	if(F){
		this._F = F.copy();
	}else{
		this._F = null;
	}
}
App3DR.ProjectManager.Pair.prototype.setR = function(R){
	if(R){
		this._R = R.copy();
	}else{
		this._R = null;
	}
}
App3DR.ProjectManager.Pair.prototype.setFInfo = function(mean,sigma){
	this._FerrorMean = mean;
	this._FerrorSigma = sigma;
}
App3DR.ProjectManager.Pair.prototype.setRInfo = function(mean,sigma){
	this._RerrorMean = mean;
	this._RerrorSigma = sigma;
}
App3DR.ProjectManager.Pair.prototype.errorRMean = function(){
	return this._RerrorMean;
}
App3DR.ProjectManager.Pair.prototype.errorRSigma = function(){
	return this._RerrorSigma;
}
App3DR.ProjectManager.Pair.prototype.errorFMean = function(){
	return this._FerrorMean;
}
App3DR.ProjectManager.Pair.prototype.errorFSigma = function(){
	return this._FerrorSigma;
}
App3DR.ProjectManager.Pair.prototype.R = function(){
	return this._R;
}
App3DR.ProjectManager.Pair.prototype.F = function(){
	return this._F;
}
App3DR.ProjectManager.Pair.prototype.isPair = function(idA,idB){
	if(idA && idB && this._viewAID && this._viewBID){
		if( (idA==this._viewAID && idB==this._viewBID) || (idB==this._viewAID && idA==this._viewBID) ){
			return true;
		}
	}
	return false;
}
App3DR.ProjectManager.Pair.prototype.hasMatch = function(){
	return this._matchFeatureCount !== null && this._matchFeatureCount !== undefined && this._matchFeatureCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.hasRelative = function(){
	return this._relativeCount !== null && this._relativeCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.hasTracks = function(){
	return this._trackCount !== null && this._trackCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.toYAML = function(yaml){
	yaml.writeString("directory", this._directory);
	yaml.writeString("viewA", this._viewAID);
	yaml.writeString("viewB", this._viewBID);
	yaml.writeNumber("featureCount", this._matchFeatureCount);
	yaml.writeNumber("relativeCount", this._relativeCount);
	yaml.writeNumber("trackCount", this._trackCount);
	yaml.writeNumber("errorFMean", this._FerrorMean);
	yaml.writeNumber("errorFSigma", this._FerrorSigma);
	yaml.writeNumber("errorRMean", this._RerrorMean);
	yaml.writeNumber("errorRSigma", this._RerrorSigma);
	var F = this._F;
	if(F){
		yaml.writeObjectStart("F");
			F.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("F", null);
	}
	var R = this._R;
	if(R){
		yaml.writeObjectStart("R");
			R.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("R", null);
	}
}
App3DR.ProjectManager.Pair.prototype.readFromObject = function(object){
	this._directory = object["directory"];
	this._viewAID = object["viewA"];
	this._viewBID = object["viewB"];
	this._matchFeatureCount = object["featureCount"];
	this._relativeCount = Code.valueOrDefault(object["relativeCount"], null);
	this._trackCount = Code.valueOrDefault(object["trackCount"], null);
	this._FerrorMean = Code.valueOrDefault(object["errorFMean"], null);
	this._FerrorSigma = Code.valueOrDefault(object["errorFSigma"], null);
	this._RerrorMean = Code.valueOrDefault(object["errorRMean"], null);
	this._RerrorSigma = Code.valueOrDefault(object["errorRSigma"], null);
	var F = object["F"];
	if(F){
		this._F = Matrix.fromObject(F);
	}else{
		this._F = null;
	}
	var R = object["R"];
	if(R){
		this._R = Matrix.fromObject(R);
	}else{
		this._R = null;
	}
}
App3DR.ProjectManager.Pair.prototype.loadMatchingData = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		// ...
	this._manager.loadMatchingDataForPair(this, App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME, this._loadMatchingDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadMatchingDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._matchingData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
App3DR.ProjectManager.Pair.prototype.loadRelativeData = function(callback, context, returnObject){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this._manager.loadRelativeDataForPair(this, App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME, this._loadRelativeDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadRelativeDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._relativeData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
App3DR.ProjectManager.Pair.prototype.loadTrackData = function(callback, context, returnObject){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this._manager.loadRelativeDataForPair(this, App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME, this._loadTrackDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadTrackDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._trackData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}


App3DR.ProjectManager.Pair.pairsPassingErrorR = function(pairs,sig){
	sig = sig!==undefined ? sig : 2.0; // 2-3
	var maximumErrorR = 5.0;
	var minimumRelativeCount = 16; // actually more like 10% of image ?
	var minimumFeatureCount = 0;
	var population = [];
	var keep = [];
	var count = 0;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeCount = pair.relativeCount();
		var featureCount = pair.matchFeatureCount();
		console.log(featureCount,relativeCount, pair.errorRSigma());
		var errorR = pair.errorRSigma();
		if(relativeCount>minimumRelativeCount && featureCount>minimumFeatureCount && errorR<maximumErrorR){
			var averageR = errorR/relativeCount;
			population.push(averageR);
			++count;
			keep.push(pair);
		}
	}
	// TODO: POPULATION AGAIN ?
	throw "REDO THIS?"
	var min = Code.min(population);
	var sigma = Code.stdDev(population,min);
	var limit = sigma*sig;
	console.log("LIMIT: "+limit);
	for(var i=0; i<keep.length; ++i){
		var pair = keep[i];
		var pop = population[i];
		if(pop>limit){
			Code.removeElementAt(keep,i);
			Code.removeElementAt(population,i);
			--i;
		}
	}
	return keep;
}
*/
// ------------------------------------------------------------------------------------------------------------
/*
App3DR.ProjectManager.Triple = function(manager, directory, viewA, viewB, viewC){
	this._manager = manager;
	this._directory = directory;
	this._viewAID = viewA;
	this._viewBID = viewB;
	this._viewCID = viewC;
	this._relativeScales = null;
	// MATCHING - 2D -- not used
	// RELATIVE - 3D
	this._relativeCount = null;
	this._relativeData = null;
	this._TFT = null;
	this._TFTerrorMean = null;
	this._TFTerrorSigma = null;
	// // TRACKS - 3D
	// this._trackCount = null;
	// this._trackData = null;
}
App3DR.ProjectManager.Triple.prototype.toString = function(){
	return "[Triple: "+this._viewAID+" : "+this._viewBID+" : "+this._viewCID+"]";
}
App3DR.ProjectManager.Triple.prototype.viewA = function(){
	return this._manager.viewFromID(this._viewAID);
}
App3DR.ProjectManager.Triple.prototype.viewB = function(){
	return this._manager.viewFromID(this._viewBID);
}
App3DR.ProjectManager.Triple.prototype.viewC = function(){
	return this._manager.viewFromID(this._viewCID);
}
App3DR.ProjectManager.Triple.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Triple.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Triple.prototype.setRelativeCount = function(count){
	this._relativeCount = count;
}
App3DR.ProjectManager.Triple.prototype.relativeCount = function(count){
	return this._relativeCount;
}
App3DR.ProjectManager.Triple.prototype.setRelativeScales = function(scaleAB,scaleAC,scaleBC){
	this._relativeScales = {"AB":scaleAB, "AC":scaleAC, "BC":scaleBC};
}
App3DR.ProjectManager.Triple.prototype.relativeScales = function(){
	return this._relativeScales;
}
App3DR.ProjectManager.Triple.prototype.setTFT = function(TFT){
	if(TFT){
		this._TFT = TFT.copy();
	}else{
		this._TFT = null;
	}
}
App3DR.ProjectManager.Triple.prototype.setTFTInfo = function(mean,sigma){
	this._TFTerrorMean = mean;
	this._TFTerrorSigma = sigma;
}
App3DR.ProjectManager.Triple.prototype.setRelativeTransforms = function(transforms){
	this._relativeTransforms = transforms;
}
App3DR.ProjectManager.Triple.prototype.isTriple = function(idA,idB,idC){
	if(idA && idB && idC && this._viewAID && this._viewBID && this._viewCID){
		if( (idA==this._viewAID && idB==this._viewBID && idC==this._viewCID) ||
			(idB==this._viewAID && idA==this._viewBID && idC==this._viewCID) ||
			(idA==this._viewAID && idC==this._viewBID && idB==this._viewCID) ||
			(idC==this._viewAID && idA==this._viewBID && idB==this._viewCID) ||
			(idB==this._viewAID && idC==this._viewBID && idA==this._viewCID) ||
			(idC==this._viewAID && idB==this._viewBID && idA==this._viewCID)
			){
			return true;
		}
	}
	return false;
}
App3DR.ProjectManager.Triple.prototype.hasMatch = function(){
	return this._matchFeatureCount != null || this._matchFeatureCount >= 0;
}
App3DR.ProjectManager.Triple.prototype.hasRelative = function(){
	return this._relativeCount !== null && this._relativeCount >= 0;
}
App3DR.ProjectManager.Triple.prototype.toYAML = function(yaml){
	yaml.writeString("directory", this._directory);
	yaml.writeString("viewA", this._viewAID);
	yaml.writeString("viewB", this._viewBID);
	yaml.writeString("viewC", this._viewCID);
	// yaml.writeNumber("featureCount", this._matchFeatureCount);
	yaml.writeNumber("relativeCount", this._relativeCount);
	var gauge = this._relativeScales;
	if(gauge){
		yaml.writeObjectStart("gauge");
			yaml.writeNumber("AB", gauge["AB"]);
			yaml.writeNumber("AC", gauge["AC"]);
			yaml.writeNumber("BC", gauge["BC"]);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("gauge", null);
	}
	yaml.writeNumber("errorTMean", this._TFTerrorMean);
	yaml.writeNumber("errorTSigma", this._TFTerrorSigma);
	var T = this._TFT;
	if(T){
		yaml.writeObjectStart("T");
			T.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("T", null);
	}
	// yaml.writeBlank();
	var trans = this._relativeTransforms
	if(trans){
		yaml.writeArrayLiteral("relative", trans);
	}else{
		yaml.writeNull("relative", null);
	}
}
App3DR.ProjectManager.Triple.prototype.readFromObject = function(object){
	this._directory = object["directory"];
	this._viewAID = object["viewA"];
	this._viewBID = object["viewB"];
	this._viewCID = object["viewC"];
	// this._matchFeatureCount = object["featureCount"];
	this._relativeCount = object["relativeCount"];
	this._relativeScales = object["gauge"];
	this._TFTerrorMean = object["errorTMean"];
	this._TFTerrorSigma = object["errorTSigma"];
	var T = object["T"];
	if(T){
		this._TFT = Tensor.fromObject(T);
	}else{
		this._TFT = null;
	}
	var relative = Code.valueOrDefault(object["relative"], []);;
	this._relativeTransforms = relative;
	for(var i=0; i<relative.length; ++i){
		var F = relative[i]["F"];
		if(F){
			relative[i]["F"] = new Matrix().fromObject(F);
		}
		var R = relative[i]["R"];
		if(R){
			relative[i]["R"] = new Matrix().fromObject(R);
		}
	}
}
App3DR.ProjectManager.Triple.prototype.loadMatchingData = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		// ...
	this._manager.loadMatchingDataForTriple(this, App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME, this._loadMatchingDataComplete, this, object);
}
App3DR.ProjectManager.Triple.prototype._loadMatchingDataComplete = function(object, data){
	if(data){
		var yamlObject = Code.binaryToYAMLObject(data);
		console.log(yamlObject);
		this._matchingData = yamlObject;
	}
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
*/
// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Camera = function(manager, name, camID){
	this._manager = manager;
	this._id = camID;
	this._title = name;
	this._K = null; // calculated camera matrix
	this._calculatedCount = 0; // number of images used to calculate
	this._distortion = null; // calculated distortions
	this._images = []; // calibration images
	this._pointsData = null; // calculated image checkerboard points 2D/3D match
	this._temp = null;
}
// App3DR.ProjectManager.Camera.prototype.directory = function(){
// 	return this._directory;
// }
App3DR.ProjectManager.Camera.prototype.id = function(){
	return this._id;
}
App3DR.ProjectManager.Camera.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
App3DR.ProjectManager.Camera.prototype.images = function(){
	return this._images;
}
App3DR.ProjectManager.Camera.prototype.needsDetectionImage = function(){
	var i;
	for(i=0; i<this._images.length; ++i){
		var image = this._images[i];
		var hasMatches = image.hasMatches();
		if(!hasMatches){
			return image;
		}
	}
	return null;
}
App3DR.ProjectManager.Camera.prototype.needsDetection = function(){
	var image = this.needsDetectionImage();
	return image!==null;
}
App3DR.ProjectManager.Camera.prototype.needsCalculation = function(){
	var imageCount = this.imageCount();
	var calculated = this._calculatedCount;
	if(imageCount>=3 && calculated!=imageCount){ // at least 3 images, and not calculated with same count
		return true;
	}
	return false;
}
App3DR.ProjectManager.Camera.prototype.imageCount = function(){
	return this._images.length;
}
App3DR.ProjectManager.Camera.prototype._uniqueImageID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._images, function(c){ return c.id(); } );
}
App3DR.ProjectManager.Camera.prototype.newCalibrationImage = function(){
	var directory = this._uniqueImageID();
	var image = new App3DR.ProjectManager.Camera.CalibrationImage(this, directory);
	this._images.push(image);
	return image;
}
App3DR.ProjectManager.Camera.prototype.setCalculatedCount = function(count){
	this._calculatedCount = count;
}
App3DR.ProjectManager.Camera.prototype.setDistortion = function(k0,k1,k2,p0,p1){
	distortion = {};
	distortion["k0"] = k0;
	distortion["k1"] = k1;
	distortion["k2"] = k2;
	distortion["p0"] = p0;
	distortion["p1"] = p1;
	this._distortion = distortion;
	console.log("SET CAMERA DISTORTION");
	console.log(distortion);
	return this._distortion;
}
App3DR.ProjectManager.Camera.prototype.distortion = function(){
	var distortion = null;
	if(this._K){
		distortion = {};
		distortion["k0"] = this._distortion["k0"];
		distortion["k1"] = this._distortion["k1"];
		distortion["k2"] = this._distortion["k2"];
		distortion["p0"] = this._distortion["p0"];
		distortion["p1"] = this._distortion["p1"];
	}
	return distortion;
}
App3DR.ProjectManager.Camera.prototype.setK = function(fx,fy,s,cx,cy){
	K = {};
	K["fx"] = fx;
	K["fy"] = fy;
	K["s"] = s;
	K["cx"] = cx;
	K["cy"] = cy;
	this._K = K;
	return this._K;
}
App3DR.ProjectManager.Camera.prototype.K = function(){
	var K = null;
	if(this._K){
		K = {};
		K["fx"] = this._K["fx"];
		K["fy"] = this._K["fy"];
		K["s"] = this._K["s"];
		K["cx"] = this._K["cx"];
		K["cy"] = this._K["cy"];
	}
	return K;
}

App3DR.ProjectManager.Camera.prototype.toYAML = function(yaml){
	var i, j, len;
	yaml.writeString("id", this._id);
	yaml.writeString("title", this._title);
	yaml.writeNumber("calculatedCount", this._calculatedCount);
	// K
	if(this._K){
		var K = this._K;
		yaml.writeObjectStart("K");
			yaml.writeNumber("fx", K["fx"]);
			yaml.writeNumber("fy", K["fy"]);
			yaml.writeNumber("s",  K["s"]);
			yaml.writeNumber("cx", K["cx"]);
			yaml.writeNumber("cy", K["cy"]);
		yaml.writeObjectEnd();
	}
	// distortions
	if(this._distortion){
		var d = this._distortion;
console.log("SAVE CAMERA DISTORTION");
console.log(d);
		yaml.writeObjectStart("distortion");
			yaml.writeNumber("k0", d["k0"]);
			yaml.writeNumber("k1", d["k1"]);
			yaml.writeNumber("k2", d["k2"]);
			yaml.writeNumber("p0", d["p0"]);
			yaml.writeNumber("p1", d["p1"]);
		yaml.writeObjectEnd();
	}
	// images
	len = this._images ? this._images.length : 0;
	yaml.writeArrayStart("images");
	for(i=0; i<len; ++i){
		var image = this._images[i];
		yaml.writeObjectStart();
			image.toYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
}
App3DR.ProjectManager.Camera.prototype.readFromObject = function(object){
	console.log("READ CAMERA FROM OBJECT");
	var id = object["id"];
	var title = object["title"];
	var images = object["images"];
	var K = object["K"];
	var distortion = object["distortion"];
	this._id = id;
	this._title = title;
	this._calculatedCount = object["calculatedCount"];
	if(!this._calculatedCount){
		this._calculatedCount = 0;
	}
	// images
	this._images = [];
	if(images){
		for(var i=0; i<images.length; ++i){
			var o = images[i];
			var image = new App3DR.ProjectManager.Camera.CalibrationImage(this);
			image.readFromObject(o);
			this._images.push(image);
		}
	}
	//
	this._K = null;
	if(K){
		var fx = K["fx"];
		var fy = K["fy"];
		var s = K["s"];
		var cx = K["cx"];
		var cy = K["cy"];
		this._K = {"fx":fx, "fy":fy, "s":s, "cx":cx, "cy":cy};
	}
	this._distortions = null;
	if(distortion){
		var k0 = distortion["k0"];
		var k1 = distortion["k1"];
		var k2 = distortion["k2"];
		var p0 = distortion["p0"];
		var p1 = distortion["p1"];
		this._distortion = {"k0":k0, "k1":k1, "k2":k2, "p0":p0, "p1":p1};
	}
}

App3DR.ProjectManager.Camera.CalibrationImage = function(camera, directory){
	this._camera = camera;
	this._directory = directory;
	this._pictureInfo = [];
	this._widthToHeightRatio = null;
	this._matchesCount = null;
	this._calibrationData = null;
	this._calibrationImage = null; // SELF ?
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.id = function(){
	return this.directory();
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype.aspectRatio = function(r){
	if(r!==undefined){
		this._widthToHeightRatio = r;
	}
	return this._widthToHeightRatio;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.manager = function(){
	return this._camera._manager;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.hasMatches = function(){
	return this._matchesCount!==null && this._matchesCount > 0;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.calibrationImage = function(){
	return this._calibrationImage;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.calibrationData = function(){
	return this._calibrationData;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.readFromObject = function(object){
	var pictures = object["pictures"];
	var directory = object["directory"];
	var matches = object["matches"];
	var aspectRatio = object["aspectRatio"];
	this._directory = directory;
	this._widthToHeightRatio = aspectRatio;
	this._matchesCount = (matches!==undefined && matches!==null) ? matches : null;
	this._pictureInfo = [];
	// pictures
	if(pictures){
		for(var i=0; i<pictures.length; ++i){
			var o = pictures[i];
			var picture = {};
				picture["file"] = o["file"];
				picture["width"] = o["width"];
				picture["height"] = o["height"];
				picture["scale"] = o["scale"];
			this._pictureInfo.push(picture);
		}
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.toObject = function(){
	throw "todo";
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.toYAML = function(yaml){
	var i, len;
	yaml.writeString("directory", this._directory);
	yaml.writeNumber("matches", this._matchesCount);
	yaml.writeNumber("aspectRatio", this._widthToHeightRatio);
	// pictures
	len = this._pictureInfo ? this._pictureInfo.length : 0;
	yaml.writeArrayStart("pictures");
	for(i=0; i<len; ++i){
		var picture = this._pictureInfo[i];
		yaml.writeObjectStart();
			yaml.writeString("file", picture["file"]);
			yaml.writeNumber("width", picture["width"]);
			yaml.writeNumber("height", picture["height"]);
			yaml.writeNumber("scale", picture["scale"]);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.addPicture = function(size, scale, binary,  callback, context, returnObject){
	var filename = (scale*100.0)+"."+"png";
	var object = {};
		object["size"] = size;
		object["scale"] = scale;
		object["binary"] = binary;
		object["filename"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	var path = Code.appendToPath(this.directory(), filename);
	var info = this.manager().addPictureForCamera(this._camera, path, size, scale, binary, this._callbackAddPicture, this, object);
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._callbackAddPicture = function(object, data){
	console.log("add picture callback");
	console.log(object);
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var size = object["size"];
	var scale = object["scale"];
	var filename = object["filename"];
		var picture = {};
		picture["file"] = filename;
		picture["scale"] = scale;
		picture["width"] = size.x;
		picture["height"] = size.y;
	this._pictureInfo.push(picture);
	callback.call(context, this, returnObject);
}


App3DR.ProjectManager.Camera.CalibrationImage.prototype.setCheckerboardMatches = function(points2D, points3D,  callback, context){
	var count = points2D.length;
	this._matchesCount = count;
	console.log("NEW COUNT: "+count);
	var modified = Code.getTimeStampFromMilliseconds();
	var yaml = new YAML();
	yaml.writeComment("3DR Calibration File 0");
	yaml.writeBlank();
	yaml.writeString("camera", this._camera.id());
	yaml.writeString("image", this.id());
	yaml.writeString("created", modified);
	yaml.writeString("modified", modified);
	yaml.writeBlank();
	yaml.writeNumber("count", count);
	if(count>0){
		yaml.writeArrayStart("matches");
		for(var i=0; i<count; ++i){
			var point2D = points2D[i];
			var point3D = points3D[i];
			yaml.writeObjectStart();
				yaml.writeNumber("x", point2D.x);
				yaml.writeNumber("y", point2D.y);
				yaml.writeNumber("X", point3D.x);
				yaml.writeNumber("Y", point3D.y);
				yaml.writeNumber("Z", point3D.z);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();

	var str = yaml.toString();
	var binary = Code.stringToBinary(str);
	yamlBinary = binary;

	var path = Code.appendToPath(this.directory(), App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME);

	var object = {};
	object["context"] = context;
	object["callback"] = callback;

	this.manager().addMatchesForCamera(this._camera, path, yamlBinary, this._setCheckerboardMatchesComplete, this, object);
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._setCheckerboardMatchesComplete = function(object, data){
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, self);
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.loadCalibrationImage = function(callback, context){
	// full res: 
	// var desiredPixelCount = 4000*3000;
	// var maximumPixelCount = 9999*9999;
	// hi res:
	var desiredPixelCount = 2016*1512;
	var maximumPixelCount = 3000*2000;
	// med res:
	// var desiredPixelCount = 1600*1200;
	// var maximumPixelCount = 1920*1080;
	// low res:
	// var desiredPixelCount = 800*600;
	// var maximumPixelCount = 1024*800;
	var closest = App3DR.ProjectManager._closestPictureSize(this._pictureInfo, desiredPixelCount, maximumPixelCount);
	if(closest){
		var filename = closest["file"];
console.log("CAMERA FILE: "+filename);
		var object = {};
		//object["size"] = size;
		//object["filename"] = filename;
		object["context"] = context;
		object["callback"] = callback;
		var path = Code.appendToPath(this.directory(), filename);
		this.manager().loadImageForCamera(this._camera, path, this._loadCalibrationImageComplete, this, object);
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._loadCalibrationImageComplete = function(object, data){
	console.log("_loadCalibrationImageComplete");
	var callback = object["callback"];
	var context = object["context"];
	var binary = data;
	var filetype = "png";
	var base64 = Code.arrayBufferToBase64(binary);
	var imageSrc = Code.appendHeaderBase64(base64, filetype);
	var image = new Image();

	var self = this;
	image.onload = function(e){
		self._calibrationImage = image;
		if(callback && context){
			callback.call(context, self);
		}
	}
	image.src = imageSrc;
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype.loadCalibratationData = function(callback, context){
	var object = {};
		object["context"] = context;
		object["callback"] = callback;
	var path = Code.appendToPath(this.directory(), App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME);
	this.manager().loadCalibrationDataForCamera(this._camera, path, this._loadCalibratationDataComplete, this, object);
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype._loadCalibratationDataComplete = function(object, data){
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	this._calibrationData = yaml;
	if(object){
		var callback = object["callback"];
		var context = object["context"];
		if(callback && context){
			callback.call(context, self);
		}
	}
}

// sparse approximation | estimate | combine | merge
App3DR.ProjectManager.BundleAdjustment = function(directory){
	this._x;
}

// 3D-triangle-model | textures |
App3DR.ProjectManager.Reconstruction = function(directory){
	this._x;
}

// camera | background | filtered-textures |
App3DR.ProjectManager.Scene = function(name, directory){
	this._x;
}


App3DR.ProjectManager._closestPictureSize = function(pictures, desiredPixelCount, maximumPixelCount){
	var closestPicture = -1;
	var currentPixels = 0;
	for(i=0; i<pictures.length; ++i){
		var picture = pictures[i];
		var width = picture["width"];
		var height = picture["height"];
		var pixels = width*height;
		if(pixels<=maximumPixelCount && pixels>currentPixels){
			closestPicture = i;
			currentPixels = pixels;
		}
	}
	if(closestPicture<0){
		closestPicture = 0;
	}
	return pictures[closestPicture];
}





App3DR.ProjectManager.prototype.testData = function(world){//, completeFxn, completeContext){
	console.log("testData");
	var points3D = [];
	// var siz = new V3D(8,8,0.0);
	// var off = new V3D(-0.5,-0.5,-0.5 - 10);
	// for(var i=0; i<200; ++i){
	// 	var point = new V3D(Math.random()*siz.x+off.x, Math.random()*siz.y+off.y, Math.random()*siz.z+off.z);
	// 	points3D.push(point);
	// }
	// var count = 10;
	// var sca = 0.25;
	// for(var i=0; i<=count; ++i){
	// 	for(var j=0; j<=count; ++j){
	// 		var point = new V3D((i - count*0.5)*sca, (j - count*0.5)*sca, -20 + Math.random()*5);
	// 		points3D.push(point);
	// 	}
	// }
	var tris3D = Code.generateTri3DHemisphere(0,0,-25, 5, 8,8, Math.PI);
	// console.log(tris3D);
	for(var i=0; i<tris3D.length; ++i){
		var tri = tris3D[i];
		// console.log(tri);
		var point = tri.center();
		points3D.push(point);
	}
	console.log(points3D);


	points3D.push(new V3D(0,10, -20));
	points3D.push(new V3D(5,5, -20));
	points3D.push(new V3D(-5,-5, -20));
	points3D.push(new V3D(2,6, -19));
	points3D.push(new V3D(-1,-6, -18));
	points3D.push(new V3D(8,8, -24));
	// throw "?";
	// points3D = Code.generatePoints3DHemisphere(0,0,-20, 5);


	var fx = 1.0;
	var fy = 1.0;
	var s = 0;
	var cx = 0.5;
	var cy = 0.5;
	var distortion = null;
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	var Kinv = Matrix.inverse(K);
	var camera = world.addCamera(K, distortion);
	// var views = [];
var v = ["R04ZYF8K","UB2GL8EB","9I774XQV"];
// R04ZYF8K
// UB2GL8EB
// 9I774XQV
	var imageSize = new V2D(400,300);
	for(var i=0; i<4; ++i){
	// for(var i=0; i<3; ++i){
	// for(var i=0; i<2; ++i){
		var matrix = new ImageMat(imageSize.x,imageSize.y);
		var view = world.addView(matrix, camera, v[i%v.length]);
		// views.push(view);
		if(i==0){
			var mat = new Matrix(4,4).identity();
			view.absoluteTransform(mat);
		}else if(i==1){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, 1,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(10.0));
			view.absoluteTransform(mat);
		}else if(i==2){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, -1,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(-10.0));
			view.absoluteTransform(mat);
		}else if(i==3){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, -2,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(20.0));
			view.absoluteTransform(mat);
		}
	}

	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransform();
		var absB = viewB.absoluteTransform();
		var Kab = viewA.K();
		var KabInv = viewA.Kinv();
		// console.log("A:\n"+absA);
		// console.log("B:\n"+absB);
		// YES
		// var invA = Matrix.inverse(absA);
		// var transAB = Matrix.mult(absB,invA);
		//transform.R(viewA,viewB,transAB);

		var invB = Matrix.inverse(absB);
		var transBA = Matrix.mult(absA,invB);
		transform.R(viewA,viewB,transBA);
		// var transBA = Matrix.inverse(transAB);
		// var transBA = R3D.inverseCameraMatrix(transAB);
		//transform.R(viewA,viewB,transAB);


		var Fab = R3D.fundamentalFromCamera(transBA, Kab, KabInv);
		transform.F(viewA,viewB,Fab);

// var Fab = R3D.fundamentalFromCamera(transAB, Kab, KabInv);
// Fab = R3D.fundamentalInverse(Fab);
// transform.F(viewA,viewB,Fab);

	}
	var views = world.toViewArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		for(var j=0; j<views.length; ++j){
			var viewA = views[j];
			var absA = viewA.absoluteTransform();
			var invA = Matrix.inverse(absA);
			var Ka = viewA.K();
			var KaInv = viewA.Kinv();
			for(var k=j+1; k<views.length; ++k){
				var viewB = views[k];
				var absB = viewB.absoluteTransform();
				var invB = Matrix.inverse(absB);
				var Kb = viewB.K();
				var KbInv = viewB.Kinv();
				// var transform = world.transformFromViews(viewA,viewB);
				// var R = transform.R(viewA,viewB);
				// inv_i(p_abs) = p_i
				// var estimated3D = absA.multV3DtoV3D(point3D); // in view A
				// console.log("estimated3D: "+estimated3D);
				// console.log(R+"");
				// var point2DA = viewA.projectPoint3D(point3D);
				// var point2DB = viewB.projectPoint3D(point3D);

				// var cameraA = absA;
				// var cameraB = absB;
				// var cameraA = invA;
				// var cameraB = invB;

				// var point2DA = R3D.projectPoint3DToCamera2DForward(point3D, absA, Ka, null);
				// var point2DB = R3D.projectPoint3DToCamera2DForward(point3D, absB, Kb, null);
				var point2DA = R3D.projectPoint3DToCamera2DForward(point3D, invA, Ka, null);
				var point2DB = R3D.projectPoint3DToCamera2DForward(point3D, invB, Kb, null);

	// 			var K = this._K;
	// var distortions = null;
	// var absoluteTransform = this._absoluteTransform;
	// var projected2D = R3D.projectPoint3DToCamera2DForward(estimated3D, absoluteTransform, K, distortions);
	// return projected2D;

				// var fr = new V2D();
				// var to = new V2D();
				var fr = point2DA;
				var to = point2DB;
				// console.log(point2DA+" & "+point2DB);
				var scaleAB = 1.0;
				var angleAB = 0.0;
				var match = world.addMatchForViews(viewA,fr, viewB,to, scaleAB,angleAB, true);

				//
				// var cameraA = viewA.absoluteTransform();
				// var cameraB = viewB.absoluteTransform();
				// var cameraA = new Matrix(4,4).identity();
				// var cameraB = R;

				var pA = fr;
				var pB = to;
				//var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
				// var estimated3D = R3D.triangulatePointDLT(pA,pB, invA,invB, KaInv, KbInv);
				var estimated3D = null;
				// console.log("          ..."+estimated3D+" =?= "+point3D);
				var midpoint3D = R3D.triangulatePointMidpoint(pA,pB, absA,absB, KaInv, KbInv);
				if(!estimated3D){
					estimated3D = midpoint3D;
				}
// var error = R3D.reprojectionError(estimated3D, pA,pB, invA, invB, Ka, Kb);
// console.log(". error"+error["error"]);
// fr,to, cameraAInv,cameraBInv, KaInv, KbInv

				//R3D.projectPoint2DToCamera3DRay(in2D, extrinsic, Kinv, distortions){
					// var cameraBInv = R3D.inverseCameraMatrix(cameraB);

					var rayA = R3D.projectPoint2DToCamera3DRay(pA, absA, KaInv, null);
					var rayB = R3D.projectPoint2DToCamera3DRay(pB, absB, KbInv, null);
					// var rayA = R3D.projectPoint2DToCamera3DRay(point2DA, invA, KaInv, null);
					// var rayB = R3D.projectPoint2DToCamera3DRay(point2DB, invB, KbInv, null);

					// var rayB = R3D.projectPoint2DToCamera3DRay(pB, cameraBInv, KbInv, null);
					//console.log(rayA,rayB);
					var closest = Code.closestPointsLines3D(rayA["o"],rayA["d"], rayB["o"],rayB["d"]);
					var avg = V3D.avg(closest[0],closest[1]);
					// console.log(avg+"");
					// console.log(avg.x/point3D.x,avg.y/point3D.y,avg.z/point3D.z);

var distance3D = V3D.distance(estimated3D,point3D);
if(distance3D>1.0){
	console.log(closest)
	console.log(" point2DA: "+point2DA);
	console.log(" point2DB: "+point2DB);
	console.log(" point3D: "+point3D);
	console.log(" midpoint3D: "+midpoint3D);
	console.log(" estimated3D: "+estimated3D);

	// console.log(" 2: "+R3D.triangulatePointDLT(pA,pB, cameraA,cameraBInv, KaInv, KbInv));
	// throw "not match";
}
// triangulatePointDLT
				// console.log(match);
				// match.estimated3D(estimated3D);
			}
		}
	}
	/*
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		console.log(matches);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];

		}
	}
	console.log("....");
	world.averagePoints3DFromMatches();
	*/

	console.log("....");
	// world.estimate3DErrors(true);
	world.estimate3DErrors();
	// world.estimate3DViews();
	world.averagePoints3DFromMatches();


	// world.filterGlobal();
	world.bundleAdjust();

// throw "??";
	// this.estimate3DErrors();
	// this.estimate3DViews();
	// this.averagePoints3DFromMatches();
	//Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB){
	//

	// WHEN DONE
	// var completeFxn = function(){
	var str = world.toYAMLString();
	this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
	this.saveBundleAdjust(str, null, this);
	this.saveProjectFile();
	// }

	//world.solve(completeFxn, this);
	// completeFxn.call(this);

}

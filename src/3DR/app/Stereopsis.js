// Stereopsis.js

function Stereopsis(){
	// library
}

Stereopsis._point3DToPoint = function(p3d){
	return p3d.point();
}
Stereopsis._point2DToPoint = function(p2d){
	return p2d.point2D();
}
Stereopsis._indexSort = function(a,b){
	return a < b ? -1 : 1;
}
Stereopsis._indexFromIDs = function(list){
	list.sort(Stereopsis._indexSort);
	var index = "";
	var div = "-";
	for(var i=0; i<list.length; ++i){
		index = index + list[i];
		if(i<list.length-1){
			index = index + div;
		}
	}
	return index;
}
Stereopsis.indexFromObjectIDs = function(a,b){
	return Stereopsis._indexFromIDs([a.id(),b.id()]);
}
Stereopsis.indexFromObjectID = function(a){
	return a.id()+"";
}
Stereopsis._aggregateMatches = function(matches,fxn){
	if(matches.length==0){
		return null;
	}
	var aggregate = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			var value = fxn(match);
			if(value===null){
				return null;
			}
			aggregate += value;
		}
	}
	return aggregate/matches.length;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World = function(){
	this._cameras = [];
	this._views = {};
	this._viewCount = 0;
	this._transforms = {};
	// this._points3DNull = []; // TODO: this could just be a lookup hash
		this._points3DNull = {};
	this._pointSpace = new OctTree(Stereopsis._point3DToPoint);
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT;
	// this.resolveIntersection = this.resolveIntersectionDefault;
	this.resolveIntersectionByDefault();

		this._pointCountOperationCategory = null;
		this.pointCountOperationCategory(Stereopsis.World.POINT_COUNT_CATEGORY_LO);

		this._pointCountReferenceList = null;
		// this.pointCountReferenceList([5000,25000]);
	// this.shouldValidateMatchRange(true);
	this._checkInt2D = true;

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addListeners();

	var stage = GLOBALSTAGE;
	var canvas = stage.canvas();
	this._stage = stage;
	this._canvas = canvas;
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_WHEEL,this._handleMouseWheelFxn,this); // TODO: UNCOMMENT FOR SEEING DOTS HERE
	// console.log("init resolutionProcessingMode");
	// this.resolutionProcessingModeLow();
}
// Stereopsis.World.RESOLUTION_PROCESSING_MODE_LO = 1;
// Stereopsis.World.RESOLUTION_PROCESSING_MODE_ME = 2;
// Stereopsis.World.RESOLUTION_PROCESSING_MODE_HI = 3;
// Stereopsis.World.RESOLUTION_PROCESSING_MODE_SU = 4;
// Stereopsis.World.prototype.resolutionProcessingModeLow = function(){
// 	return this.resolutionProcessingMode(Stereopsis.World.RESOLUTION_PROCESSING_MODE_LO);
// }
// Stereopsis.World.prototype.resolutionProcessingModeMedium = function(){
// 	return this.resolutionProcessingMode(Stereopsis.World.RESOLUTION_PROCESSING_MODE_ME);
// }
// Stereopsis.World.prototype.resolutionProcessingModeHigh = function(){
// 	return this.resolutionProcessingMode(Stereopsis.World.RESOLUTION_PROCESSING_MODE_HI);
// }
// Stereopsis.World.prototype.resolutionProcessingModeSuper = function(){
// 	return this.resolutionProcessingMode(Stereopsis.World.RESOLUTION_PROCESSING_MODE_SU);
// }
// Stereopsis.World.prototype.setResolutionProcessingModeF = function(){
// 	console.log("setResolutionProcessingModeF");
// 	this._resolutionProcessingMode = Stereopsis.World.RESOLUTION_PROCESSING_MODE_LO;
// 	//
// 	this._resolutionProcessingModePatchInit = null;
// 	this._resolutionProcessingModePatchUpdate = null;
// 	this._resolutionProcessingModeAffineSet = null;
// 	// 
// 	this._resolutionProcessingModePatchInit = this.initP3DPatchFromMatchAffine;
// 	this._resolutionProcessingModePatchUpdate = this.initP3DPatchFromMatchAffine;
// 	this._resolutionProcessingModeAffineSet = this._resolutionProcessingModeAffineFromVisual2D;
// 	// 
// 	// ...
// }
// Stereopsis.World.prototype.setResolutionProcessingModeFromOnly2D = function(){
// 	this._resolutionProcessingModePatchInit = this.initP3DPatchFromOnly2D;
// 	this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromNone;
// 	this._resolutionProcessingModeAffineSet = null;
// }
// Stereopsis.World.prototype.setResolutionProcessingModeNonVisual = function(){
// 	console.log("setResolutionProcessingModeNonVisual");
// 	this._resolutionProcessingModePatchInit = this.initP3DPatchFromGeometry3D;
// 	this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromNone;
// 	this._resolutionProcessingModeAffineSet = null; // this.resolutionProcessingModeAffineFromBestNeighbor2D; affineP2DFromMode
// 	// 
// 	// console.log("setResolutionProcessingModeF");
// 	// this.resolutionProcessingModeSuper();
// 	// this._resolutionProcessingMode = Stereopsis.World.RESOLUTION_PROCESSING_MODE_SU;
// 	// this._resolutionProcessingModePatchInit = this.initP3DPatchFromBestNeighbor;
// 	// this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromNone;
// 	// this._resolutionProcessingModeAffineSet = this.resolutionProcessingModeAffineFromBestNeighbor2D;
// }
// Stereopsis.World.prototype.setResolutionProcessingModeFromCountP3D = function(limits){
// 	console.log("setResolutionProcessingModeFromCountP3D");
// 	var world = this;
// 	// low, med, high, super
// 	// 1k-5k, 5k-10k, 10k-50k, +
// 	if(!limits){
// 		limits = [2E3,5E3,10E3]; // med?
// 	}

// 	// var limits [5E3,10E3,20E3]; // high?
// 	// var limits = []; // TEST LOW
// 	// var limits = [0]; // TEST MED
// 	// var limits = [1E3, 2E3, 3E3]; // TEST ALL
// 	// var limits = [1000, 2000]; // TEST HI
// 	// var limits = [1000]; // TEST LOW + MED

// 	var fxns = [
// 		world.resolutionProcessingModeLow,
// 		world.resolutionProcessingModeMedium,
// 		world.resolutionProcessingModeHigh,
// 		world.resolutionProcessingModeSuper // 
// 	];
// 	var pointCount = world.point3DCount();
// 	var fxnIndex = 0;
// 	for(var i=0; i<limits.length; ++i){
// 		if(pointCount<=limits[i]){
// 			break;
// 		}
// 		fxnIndex++;
// 	}
// 	var fxn = fxns[fxnIndex];
// 	fxn.call(world);
// }
// Stereopsis.World.prototype.setResolutionProcessingModeBest = function(){
// 	this.setResolutionProcessingModeFromCountP3D([]);
// }
// Stereopsis.World.prototype.resolutionProcessingMode = function(m){
// 	var world = this;
// 	if(m!==undefined){
// 		this._resolutionProcessingModePatchInit = null;
// 		this._resolutionProcessingModePatchUpdate = null;
// 		this._resolutionProcessingModeAffineSet = null;
// 		this._resolutionProcessingMode = m;
// 		if(m==Stereopsis.World.RESOLUTION_PROCESSING_MODE_LO){
// 			this._resolutionProcessingModePatchInit = this.initP3DPatchFromVisual;
// 			this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromVisual;
// 			this._resolutionProcessingModeAffineSet = this._resolutionProcessingModeAffineFromPatch3D;
// 		}else if(m==Stereopsis.World.RESOLUTION_PROCESSING_MODE_ME){
// 			this._resolutionProcessingModePatchInit = this.initP3DPatchFromMatchAffine;
// 			this._resolutionProcessingModePatchUpdate = this.initP3DPatchFromMatchAffine; // no real way to 'update' from affine plane triangulation
// 			this._resolutionProcessingModeAffineSet = this._resolutionProcessingModeAffineFromVisual2D;
// 		}else if(m==Stereopsis.World.RESOLUTION_PROCESSING_MODE_HI){
// 			this._resolutionProcessingModePatchInit = this.initP3DPatchFromNeighbors;
// 			this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromViewDeltas;
// 			this._resolutionProcessingModeAffineSet = this.resolutionProcessingModeAffineFromNeighbors2D;
// 		}else if(m==Stereopsis.World.RESOLUTION_PROCESSING_MODE_SU){
// 			this._resolutionProcessingModePatchInit = this.initP3DPatchFromBestNeighbor;
// 			this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromNone;
// 			this._resolutionProcessingModeAffineSet = this.resolutionProcessingModeAffineFromBestNeighbor2D;
// 		}else{
// 			throw "mode ?"
// 		}
// 	}
// 	return this._resolutionProcessingMode;
// }

Stereopsis.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
// Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT = 0;
// Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE = 1;
// Stereopsis.World._INTERSECTION_RESOLVE_OTHER = 2;
Stereopsis.World.prototype.resolveIntersectionByDefault = function(){
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT;
	this.resolveIntersection = this._resolveIntersectionDefault;
}
Stereopsis.World.prototype.resolveIntersectionByPatchGeometry = function(){
	throw "no";
	this.resolveIntersection = this._resolveIntersectionPatchGeometry;
}
Stereopsis.World.prototype.resolveIntersectionByPatchVisuals = function(nonexistCallback){ // use existing affine relations
	throw "no";
	this.resolveIntersection = this._resolveIntersectionPatchVisuals;
	this._resolvePatchVisualsCallback = nonexistCallback;
}
Stereopsis.World.prototype.resolveIntersectionByMatchScore = function(){
	throw "no";
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE;
	this.resolveIntersection = this._resolveIntersectionMatchScore;
}
Stereopsis.World.prototype.resolveIntersectionByGeometry = function(){
	throw "no";
	this.resolveIntersection = this._resolveIntersectionGeometry;
}
Stereopsis.World.prototype.checkForIntersections = function(v){
	if(v!==undefined){
		this._checkInt2D = v;
	}
	return this._checkInt2D;
}
Stereopsis.World.prototype._handleKeyboardDown = function(e){
	// console.log("_handleKeyboardDown");
	if(e.keyCode==Keyboard.KEY_SPACE){
		//
	}else if(e.keyCode==Keyboard.KEY_ENTER){
		this.debug();
	}else if(e.keyCode==Keyboard.KEY_LET_P){
		//
	}else if(e.keyCode==Keyboard.KEY_LET_Q){
		GLOBALSTAGE.removeAllChildren();
	}else if(e.keyCode==Keyboard.KEY_LET_B){
		// lattice.calcInfo();
	}else if(e.keyCode==Keyboard.KEY_LET_R){
// DON'T
		// this.render3D();
	}
}
Stereopsis.World.prototype._handleMouseWheelFxn = function(e){
	// console.log(e);
	var scroll = e["scroll"];
	this._camRotX += scroll.y * 0.001;
	this._camRotY += scroll.x * 0.001;
	// DON'T
	// this.render3D();
}
Stereopsis.World.prototype.addCamera = function(K, distortion, data){
	var camera = new Stereopsis.Camera(K,distortion,data);
	this._cameras[camera.id()+""] = camera;
	return camera;
}
Stereopsis.World.prototype.addView = function(image, cam, data){
	var viewB = new Stereopsis.View(image,cam,data);
	// create transforms for each view pair
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var viewA = this._views[key];
		var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
		this._transforms[index] = new Stereopsis.Transform3D(viewA,viewB, this);
	}
	this._viewCount += 1;
	this._views[viewB.id()+""] = viewB;
	return viewB;
}
Stereopsis.World.prototype.transformsWithView = function(view){
	var transforms = Code.objectToArray(this._transforms);
	var included = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(transform.viewA()==view || transform.viewB()==view){
			included.push(transform);
		}
	}
	return included;
}
Stereopsis.World.prototype.transformFromViews = function(viewA,viewB){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	return this._transforms[index];
}
Stereopsis.World.prototype.neighborsFromView = function(viewA,minMatchCount){ // TODO: faster lookup
	minMatchCount = Code.valueOrDefault(minMatchCount,16);
	var views = this.toViewArray();
	var neighbors = [];
	for(var i=0; i<views.length; ++i){
		var viewB = views[i];
		if(viewA!=viewB){
			var transform = this.transformFromViews(viewA,viewB);
			if(transform.matchCount()>minMatchCount){
				neighbors.push(viewB);
			}
		}
	}
	return neighbors;
}

Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB, skip){
	validate = true;
	// if(skip){
	// 	validate = false;
	// }
	var vA = this._views[viewA.id()];
	var vB = this._views[viewB.id()];
	if(vA==viewA && vB==viewB){
		var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA,viewB,pointB);
		// create 2D match
		var imageA = viewA.image();
		var imageB = viewB.image();
		var affine = null;
		if(skip){
			affine = new Matrix2D().identity();
		}else{
			affine = Stereopsis.optimumAffineMatchFromPoints(imageA,imageB,pointA,pointB,scaleAtoB,angleAtoB, compareSize);
		}
		if(affine){
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
			var result = this.embedPoint3D(match.point3D(), validate);
			return result;
		}
	}
	return null;
}
Stereopsis.World.prototype.addMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, location3D, skipEmbed, skipIntersection){
	skipEmbed = skipEmbed!==undefined ? skipEmbed : false;
	var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
	if(location3D){
		point3D = match.point3D();
		// console.log("addMatchFromInfo: "+location3D);
		this.updatePoint3DLocation(point3D, location3D);
	}
	if(!skipEmbed){
		var p3D = match.point3D();
		if(skipIntersection){
			this.connectPoint3D(p3D);
		}else{
			this.embedPoint3D(p3D);
		}
	}
	return match;
}
Stereopsis.setMatchInfoFromParamerers = function(match, viewA,pointA,viewB,pointB,affine){
	// var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA, viewB,pointB);
	var compareSize = 9; // 7-11
	var imageA = viewA.imageScales();
	var imageB = viewB.imageScales();
	if(imageA && imageB){
		var info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,affine,compareSize);
		var ncc = info["ncc"];
		var sad = info["sad"];
		var range = info["range"]; // range per pixel

		// ncc & sad per range
		var den = Math.max(Math.sqrt(range),1E-12);
		// var den = Math.max(range,1E-12);

		// MAYBE USE AVERAGE PIXEL ERROR?:
		var pixelCount = compareSize*compareSize;
		ncc = ncc/pixelCount;
		sad = sad/pixelCount;
		range = range/pixelCount;

		// MAYBE NOT RANGE BASED ?????????
		// ncc = ncc/den;
		// sad = sad/den;

		// ncc = Math.min(ncc/range, 1E9);
		// sad = Math.min(sad/range, 1E9);


		// console.log("get info ... "+ncc+","+sad+","+range);
		// return {"ncc":ncc, "sad":sad, "range":range};
		// console.log(ncc,sad,range);
		match.errorNCC(ncc);
		match.errorSAD(sad);
		match.range(range);
	} // else can't set the range / NCC / SAD
	return match;
}
Stereopsis.World.prototype.newPoint3DFromPieces = function(views,point2DNs,affines, normalized){ // unconnected
	normalized = normalized!==undefined ? normalized : true;
	var world = this;
	var points2D = [];
	var point3D = new Stereopsis.P3D();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var point2DN = point2DNs[i];
			point2DN = point2DN.copy();
		if(normalized){
			var s = view.size();
			point2DN.x *= s.x;
			point2DN.y *= s.y;
		}
		point2D = new Stereopsis.P2D(view,point2DN,point3D);
		points2D.push(point2D);
		point3D.addPoint2D(point2D);
	}
	var a=0;
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var point2DA = points2D[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var point2DB = points2D[j];
			var affine = null;
			if(affines){
				affine = affines[a];
				++a;
			}
			var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine);
			match.transform(world.transformFromViews(viewA,viewB));
			if(!match.transform()){
				console.log(match);
				throw "?"
			}
			point3D.addMatch(match);
			point2DA.addMatch(match);
			point2DB.addMatch(match);
		}
	}
	return point3D;
}
Stereopsis.World.prototype.newMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, noConnect){
	noConnect = noConnect!==undefined ? noConnect : false;
	var connect = !noConnect;
	var point3D = null;
	var point2DA = null;
	var point2DB = null;
	if(connect){
		point3D = new Stereopsis.P3D();
		point2DA = new Stereopsis.P2D(viewA,pointA,point3D);
		point2DB = new Stereopsis.P2D(viewB,pointB,point3D);
	}
	// match
	var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine);
	match.transform(this.transformFromViews(viewA,viewB));
	// Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine); // REMOVED
	if(connect){
		// point3D
		point3D.addMatch(match);
		point3D.addPoint2D(point2DA);
		point3D.addPoint2D(point2DB);
		// point2D
		point2DA.addMatch(match);
		point2DB.addMatch(match);
	}
	// match
	return match;
}
/*
Stereopsis.World.prototype.updateMatchInfo = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	var affine = match.affine();
	Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);
	return match;
}
*/
Stereopsis.COMPARE_MATCH_AFFINE_NEEDLE_SIZE = 11;
Stereopsis._temp_matrix2D = new Matrix2D();
Stereopsis.infoFromMatrix2D = function(imageA,pointA,imageB,pointB,matrix,featureSize){ // needleSize ?
	if(!Code.isa(imageA,ImageMatScaled)){
		throw "expecting image scale";
	}
	// GET CORNERNESS TOO ?
	// var needleSize = 11;
	// needleSize = needleSize!==undefined ? needleSize : 11;
	var needleSize = Stereopsis.COMPARE_MATCH_AFFINE_NEEDLE_SIZE;

	var zoom = needleSize/featureSize;

	var needle = Stereopsis.infoFromMatrix2D_NEEDLE;
	if(!needle){
		needle = new ImageMat(needleSize,needleSize);
		Stereopsis.infoFromMatrix2D_NEEDLE = needle;
	}

	var haystack = Stereopsis.infoFromMatrix2D_HAYSTACK;
	if(!haystack){
		haystack = new ImageMat(needleSize,needleSize);
		Stereopsis.infoFromMatrix2D_HAYSTACK = haystack;
	}

	var halfCenter = (needleSize-1)*0.5;
	var iScale = 1.0/zoom;

	matrix = Stereopsis._temp_matrix2D.copy(matrix);

		matrix.inverse();
		matrix.scale(iScale);
	var scale = matrix.averageScale();
		ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, pointA.x,pointA.y);
		imageA.extractRectFast(needle, scale, matrix);
		
		matrix.identity();
		matrix.scale(iScale);
	var scale = matrix.averageScale();
		ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, pointB.x,pointB.y);
		imageB.extractRectFast(haystack, scale, matrix);

	var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];
		
	return {"ncc":scoreNCC, "sad":scoreSAD, "range":range};
}
Stereopsis.World.prototype.insertPoint3D = function(point3D){
	// console.log("...insertPoint3D: "+point3D.point());
	try{
		this.removePoint3D(point3D);// might already exist ?
	if(!point3D.point()){
		// this._points3DNull.push(point3D);
		var index = point3D.id();
		if(index===null){
			throw "null index";
		}
		this._points3DNull[index] = point3D;
	}else{
		this._pointSpace.insertObject(point3D);
	}
	}catch(e){
		console.log(point3D);
		console.log(this._pointSpace);
		console.log(e);
		throw "got error";
	}
}
Stereopsis.World.prototype.removeNullPoints3D = function(point3D){
	throw "removeNullPoints3D - where is this used?"
	var points3D = this._points3DNull_THIS_IS_NOW_A_HASH;
	console.log("REMOVING NULL POINTS3D: "+points3D.length);
	while(points3D.length>0){
		var point3D = points3D.pop();
		this.disconnectPoint3D(point3D); // calls removePoint3D
		this.killPoint3D(point3D);
		// this.removePoint3D(point3D);

	}
}
Stereopsis.World.prototype.removePoint3D = function(point3D){
	if(point3D.point()==null){
		var index = point3D.id();
		if(index===null){
			console.log("null index - no lookup");
			return;
		}
		// if(false){
		// 	var value = this._points3DNull[index];
		// 	console.log("CHECK RESULT: "+index+" = "+value);
		// 	if(value!==point3D){
		// 		console.log("point was not in null list")
		// 		// throw "could not find point for removal"
		// 	}
		// 	point3D._was = index;
		// }
		delete this._points3DNull[index];

		// if(false){
		// 	console.log(this._points3DNull[index]);
		// }
		// Code.removeElement(this._points3DNull,point3D);
		// console.log("REMOVE FROM NULL "+result);
	}else{
		var result = this._pointSpace.removeObject(point3D);
		// if(false){
		// 	console.log("CHECK RESULT: "+result);
		// 	if(!result){
		// 		console.log(this._pointSpace);
		// 		console.log(point3D);
		// 		throw "could not remove point from point space";
		// 	}
		// }


		// var before = this._pointSpace.count();
		// var result1 = this._pointSpace.removeObject(point3D);
		// var after = this._pointSpace.count();

		// // console.log("REMOVE FROM ACTIVE "+result+" @ "+before+" - "+after);
		// var result2 = this._pointSpace.removeObject(point3D);
		// var again = this._pointSpace.count();
		// // console.log("REMOVE FROM ACTIVE "+result1+" & "+result2+" @ "+before+" - "+after+" - "+again);
		// // throw "?"
	}
}
Stereopsis.World.prototype.toCameraArray = function(){
	return Code.arrayFromHash(this._cameras);
}
Stereopsis.World.prototype.toViewArray = function(){
	return Code.arrayFromHash(this._views);
}
Stereopsis.World.prototype.viewCount = function(){
	this._viewCount;
}

Stereopsis.World.prototype.viewFromID = function(viewID){
	var view = this._views[viewID+""];
	if(view.id()===viewID){
		return view;
	}
	// var views = Code.arrayFromHash(this._views);
	// console.log("viewFromID",viewID);
	// console.log(views);
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	console.log(view.id(),viewID);
	// 	if(view.id()===viewID){
	// 		return view;
	// 	}
	// }
	return null;
}
Stereopsis.World.prototype.viewFromData = function(data){ // TODO: INDEX ON DATA, IF DATA != NULL
	var views = Code.arrayFromHash(this._views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view.data()==data){
			return view;
		}
	}
	return null;
}
Stereopsis.World.prototype.cameraFromData = function(data){
	var cameras = Code.arrayFromHash(this._cameras);
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		if(camera.data()==data){
			return camera;
		}
	}
	return null;
}

Stereopsis.World.prototype.transformsFromView = function(view){
	var transforms = this.toTransformArray();
	var included = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(transform.hasView(view)){
			included.push(transform);
		}
	}
	return included;
}

Stereopsis.World.prototype.transformsWithOverlap = function(sigma){ // pick the pairs that are primarily involved in reconstruction
	throw "where is this used"
	sigma = sigma!==undefined ? sigma : 2.0;
	var minimumMatchCount = 16;
	var world = this;
	var views = world.toViewArray();
	var filterMinimumFxn = function(a){
		// return a>100;
		return a>=minimumMatchCount;
	}
	var markedTransformIDs = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewTransforms = world.transformsFromView(view);
		var counts = [];
		for(var j=0; j<viewTransforms.length; ++j){
			var transform = viewTransforms[j];
			var matchCount = transform.matchCount();
			counts.push(matchCount);
		}
		counts.filter(filterMinimumFxn);
		var max = Code.max(counts);
		var sig = Code.stdDev(counts,max);
		var limit = max - sig*sigma;
		for(var j=0; j<viewTransforms.length; ++j){
			var transform = viewTransforms[j];
			var matchCount = transform.matchCount();
			if(matchCount>limit){
				markedTransformIDs[transform.id()+""] = 1;
			}
		}
	}
	// console.log( Code.keys(markedTransformIDs).length ,"of", world.toTransformArray().length );
	var markedTransforms = [];
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(markedTransformIDs[transform.id()+""]===1){
			markedTransforms.push(transform);
		}
	}
	return markedTransforms;
}



Stereopsis.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
Stereopsis.World.prototype.toPointArray = function(){
	var array = this._pointSpace.toArray();
	var nullArray = Code.objectToArray(this._points3DNull);
	Code.arrayPushArray(array, nullArray);
	return array;
}
Stereopsis.World.prototype.toPointArrayFromViews = function(views){ // TODO: SPEED UP WITH  LOOKUP
	console.log(views);
	var points3D = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pts = view.toPointArray();
		for(var j=0; j<pts.length; ++j){
			var p2D = pts[j];
			var p3D = p2D.point3D();
			Code.addUnique(points3D,p3D);
		}
	}
	return points3D;
}
Stereopsis.World.prototype.toPointArrayLocated = function(){
	return this._pointSpace.toArray();
}
Stereopsis.World.prototype.point3DCount = function(){
	return this._pointSpace.count() + this._points3DNull.length;
}
Stereopsis.World.prototype.setViewCellCounts = function(cellCount){
	var world = this;
	var views = world.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var size = view.size();
		var cellSize = R3D.cellSizingRoundWithDimensions(size.x,size.y,cellCount);
		view.cellSize(cellSize);
	}
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.ViewCell = function(i){
	this._objects = []; // lookup is faster
	this._neighbors = [];
	this._markedF = null;
	this._markedR = null;
	this._center = null;
	this._id = null;
	this._temp = null;
	// this.center(center);
	this.id(i);
}
Stereopsis.ViewCell.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Stereopsis.ViewCell.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Stereopsis.ViewCell.prototype.objects = function(o){
	return this._objects;
}
Stereopsis.ViewCell.prototype.neighbors = function(n){
	if(n!==undefined){
		this._neighbors = n;
	}
	return this._neighbors;
}
Stereopsis.ViewCell.prototype.length = function(o){
	return this._objects.length;
}
Stereopsis.ViewCell.prototype.removeObject = function(o){
	Code.removeElement(this._objects, o);
}
Stereopsis.ViewCell.prototype.addObject = function(o){
	this._objects.push(o);
}
Stereopsis.ViewCell.prototype.center = function(c){
	if(c!==undefined){
		this._center = c;
	}
	return this._center;
}
Stereopsis.ViewCell.prototype.markedF = function(f){
	if(f!==undefined){
		this._markedF = f;
	}
	return this._markedF;
}
Stereopsis.ViewCell.prototype.markedR = function(r){
	if(r!==undefined){
		this._markedR = r;
	}
	return this._markedR;
}
Stereopsis.ViewCell.prototype.objects = function(){
	return this._objects;
}
Stereopsis.ViewCell.prototype.kill = function(r){
	if(this._objects){
		Code.emptyArray(this._objects);
	}
	if(this._neighbors){
		Code.emptyArray(this._neighbors);
	}
	this._objects = null;
	this._neighbors = null;
	this._center = null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.View = function(image, camera, data){
	this._id = Stereopsis.View.ID++;
	this._data = null;
	this._temp = null;
	this._camera = null;
	this._K = null;
	this._Kinv = null;
	this._image = null;
	this._corners = null;
	// this._sizeFinder = null;
		this._compareSize = null;
		this._compareSizeFinder = null;
	this._pointSpace = new QuadTree(Stereopsis._point2DToPoint);
	this._cells = [];
	this._absoluteTransform = null;
	this._absoluteTransformInverse = null;
	this._errorMMean = null;
	this._errorRMean = null;
	this._errorFMean = null;
	this._errorMSigma = null;
	this._errorRSigma = null;
	this._errorFSigma = null;
	// faster access items:
	this._center = null;
	this._normal = null;
	this._right = null;
	this._up = null;
	this._size = null;
	// init:
	// console.log("NEW VIEW",image,camera,data);
	if(Code.isa(image, V2D)){
		this.size(image);
	}else{
		this.image(image);
	}
	this.camera(camera);
	this.data(data);
}
Stereopsis.View.prototype._resetCacheItems = function(){
	this._center = null;
	this._normal = null;
	this._right = null;
	this._up = null;
	this._focalLength = null;
}
Stereopsis.View.ID = 0;
Stereopsis.View.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.View.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
Stereopsis.View.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.View.prototype.pointSpace = function(){
	return this._pointSpace;
}
Stereopsis.View.prototype.sizeFromPercent = function(percent){
	var size = this.size();
	if(size){
		var width = size.x;
		var height = size.y;
		var length = Math.sqrt(width*height); // square perimeter
		// var length = Math.sqrt(width*width + height*height); // hypotenuse -- bigger
		return length*percent;
	}
	return null;
}
Stereopsis.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		this._cornersFromImage();
		this._updateInternalParams();
		if(image){
			this.defaultCells();
		}
		this._imageScales = null; // need to repro for next time
		// this.imageScales(); // auto load
		if(Code.isa(image, ImageMatScaled)){
			this._imageScales = image;
			this._image = this._imageScales.images()[0];
		}
		
	}
	return this._image;
}
Stereopsis.View.prototype.imageScales = function(){
	// console.log("do imageScales");
	if(!this._imageScales){
		if(this._image){
			this._imageScales = new ImageMatScaled(this._image);
		}
	}
	return this._imageScales;
}
Stereopsis.View.prototype.defaultCells = function(){
	console.log("size?: "+this.size());
	// var size = Math.round( this.sizeFromPercent(0.01) );
	var size = this.sizeFromPercent(0.01);
	console.log("defaultCells: "+size)
	// if(size%2==0){
	// 	size -= 1;
	// }
	// size = Math.max(size,3);
	// cellSize = 21;
	// cellSize = 11;
	// cellSize = 7;
	// cellSize = 5;
	// cellSize = 3;
	this.cellSize(size);
}
Stereopsis.View.prototype.oppositeViews = function(){ // list of all views referenced by any point - adjacent views
	// TODO: speed up by using hash every time a point is added / subtracted: increment count
	var points = this._pointSpace.toArray();
	var len = points.length;
	if(len==0){
		return [];
	}
	var hash = {};
	var thisID = this.id();
	for(var i=0; i<len; ++i){
		var point = points[i];
		var point3D = point.point3D();
		var viewList = point3D.toViewArray();
		for(var j=0; j<viewList.length; ++j){
			var view = viewList[j];
			var viewID = view.id();
			if(!hash[viewID]){
				hash[viewID] = view;
			}
		}
	}
	delete hash[thisID];
	hash = Code.objectToArray(hash);
	return hash;
}

Stereopsis.View.prototype.emptyNeighborCellsForView = function(viewB){
	var cells = this._cells;
	// marked each cell as filled or not
	var filled = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var objects = cell.objects();
		var found = false;
		for(var j=0; j<objects.length; ++j){
			var point2D = objects[j];
			var point3D = point2D.point3D();
			if(point3D.hasView(viewB)){
				found = true;
				break;
			}
		}
		if(found){
			cell.temp(true);
			filled.push(cell);
		}else{
			cell.temp(false);
		}
	}
	// for all filled cells:
	var hash = {};
	for(var i=0; i<filled.length; ++i){
		var cell = filled[i];
		// add each non-filled neighbor to hash
		var neighbors = cell.neighbors();
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			if(!neighbor.temp()){
				hash[neighbor.id()] = neighbor;
			}
		}
	}
	// clear work
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		cell.temp(null);
	}
	// hash to array
	var empties = Code.objectToArray(hash);
	return empties;
}
Stereopsis.View.prototype.emptyNeighborCellsForViewOld = function(otherView){

	// ???
// TODO: otherView should be passed for NON-PAIR VERSIONS OF THIS ALGORITHM TO RETURN ONLT CELLS w/ pair-view matching
	var cells = this._cells;
	// go thru all cells and +1 to neighbor if have a point with view
	var empties = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		if(cell.length()==0){
			var neighbors = cell.neighbors();
			var found = false;
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				if(neighbor.length()>0){
					found = true;
					break;
				}
			}
			if(found){
				empties.push(cell);
			}
		}
	}
	return empties;
}
Stereopsis.View.prototype._initCompareSizes = function(oldSize){ // match up to cell size 
	console.log("_initCompareSizes");
	var corners = this.corners();
	if(!corners){
		console.log("no corner data - default compare size")
		this._compareSize = Math.round(this._cellSize*1.5);
		this._compareSizeFinder = null;
	}else{
		var image = this.image();
		var wid = image.width();
		var hei = image.height();
		var max = Math.min(wid,hei);
		var scale = max/this._cellSize;
		var divisionsByTwo = Math.ceil( Math.log2(scale) );
		console.log("divisionsByTwo: "+divisionsByTwo+" -> "+(this._cellSize/max)+" & "+(Math.pow(2,-divisionsByTwo)));
		if(!this._compareSizeFinder){
			console.log("create new finder");
			var finder = new R3D.ResolutionCompareSizeFinder(image, corners, divisionsByTwo);
			console.log(finder);
			this._compareSizeFinder = finder;
		}else{
			console.log("keep existing finder");
			this._compareSizeFinder.doDivisions(divisionsByTwo);
		}
		this._compareSize = null;
	}
}
Stereopsis.View.prototype._initCells = function(oldSize){
	var size = this.size();
	if(!size){
		throw "no size";
	}
	var oldCells = this._cells; // keep for resetting
	var cells = [];
	this._cells = cells;
	var cellSize = this.cellSize();
if(cellSize==0){
	throw "no cell size of zero";
}
	var countX = Math.ceil(size.x/cellSize);
	var countY = Math.ceil(size.y/cellSize);
	var count = countX*countY;
	if(count>1E9){
		throw "too many cells?: "+count;
	}
	for(var i=0; i<count; ++i){
		cells.push(new Stereopsis.ViewCell(i));
	}
	// neighbors & centers
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var index = j*countX + i;
			var cell = cells[index];
			var center = new V2D((i+0.5)*cellSize,(j+0.5)*cellSize);
			cell.center(center);
			var neighbors = [];
			for(var jj=-1; jj<=1; ++jj){
				for(var ii=-1; ii<=1; ++ii){
					var j2 = j+jj;
					var i2 = i+ii;
					if(0<=j2 && j2<countY && 0<=i2 && i2<countX){
						var ind = j2*countX + i2;
						if(ind!==index){
							var c = cells[ind];
							neighbors.push(c);
						}
					}
				}
			}
			cell.neighbors(neighbors);
		}
	}
	// add in
	var points = this._pointSpace.toArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.point2D();
		var cell = this.cellForPoint(p);
		cell.addObject(point);
	}
// TODO: only add back cells that are empty &  have 1+ filled neighbors
	this._resetQueues();

// add back cells with overlap:

	if(oldCells){
		cells = oldCells;
		for(var i=0; i<cells.length; ++i){
			cells[i].kill();
		}
		Code.emptyArray(cells);
	}

	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var point3D = point2D.point3D();
		var points2D = point3D.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var p2DA = points2D[j];
			var vA = p2DA.view();
			for(var k=j+1; k<points2D.length; ++k){
				var p2DB = points2D[k];
				var vB = p2DB.view();
				vA.addViewProbePoint(p2DA.point2D(),vB);
				vB.addViewProbePoint(p2DB.point2D(),vA);
			}
		}
	}

}
Stereopsis.View.prototype.cellCount = function(){
	return this._cells.length;
}

// Stereopsis.View.prototype._initProbe2DImage = function(){
// 	// console.log("_initProbe2DImage");
// 	var compareWindow = this.compareSize();
// 	var compareSize = 11;
// 	var scale = compareWindow/compareSize;
// 	// console.log(scale);
// 	// ... create an image such that the needle sizes are scaled the same as the haystack image -- this might be origin-image resolution dependent
// }
Stereopsis.View.prototype.cellForPoint = function(p){
	if(p==null){
		console.log(p);
		throw "null p";
	}
	return this.cellForXY(p.x,p.y);
}
Stereopsis.View.prototype.cellForXY = function(xIn,yIn){
	// console.log(xIn,yIn);
	var cellSize = this.cellSize();
	var x = Math.floor(xIn/cellSize);
	var y = Math.floor(yIn/cellSize);
	var size = this.size();
	var countX = Math.ceil(size.x/cellSize);
	var i = y*countX + x;
	return this._cells[i];
}
Stereopsis.View.prototype.corners = function(){
	if(!this._corners){
		var image = this._image;
		if(image){
			var gry = image.gry();
			var width = image.width();
			var height = image.height();
			// var corners = R3D.cornerScaleScores(gry, width, height, true);
			// console.log(corners)
			// corners = corners["value"];
			var corners = R3D.harrisCornerDetection(gry, width, height);
// for(var i=0; i<corners.length; ++i){
// 	var c = corners[i];
// 	if(Code.isNaN(c)){
// 		throw "found NaN in corners";
// 	}
// }
			this._corners = corners;
		}
	}
	return this._corners;
}
Stereopsis.View.prototype.size = function(size){
	var image = this._image;
	if(size){
		this._size = size;
		this._updateInternalParams();
		this.defaultCells();
	}
	if(image){
		return new V2D(image.width(),image.height());
	}
	return this._size; // backup for when images not loaded
}
Stereopsis.View.prototype.camera = function(camera){
	if(camera!==undefined){
		this._camera = camera;
		this._updateInternalParams();
	}
	return this._camera;
}

Stereopsis.View.prototype._cornersFromImage = function(){
	var image = this._image;
	if(image){
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		// var corners = R3D.cornerScaleScores(gry, width, height, true);
		var corners = R3D.harrisCornerDetection(gry, width, height);
		this._corners = corners;
		/*
		ImageMat.normalFloat01(corners);
		// ImageMat.add(corners,1.0);
		ImageMat.pow(corners,0.1); // more linear shapes
		// ImageMat.pow(corners,0.25);
		// ImageMat.log(corners);
		// ImageMat.add(corners,1.0);
		// ImageMat.log(corners);
		// ImageMat.add(corners,-1.0);

		tmp = Code.copyArray(corners);
		tmp.sort(function(a,b){
			return a < b ? -1 : 1;
		});
		// Code.printMatlabArray(tmp);

		this._minimumCornerness = tmp[Math.round(tmp.length*0.10)]; // too little
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.25)];
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.333)];
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.50)]; // too much
		console.log(this._minimumCornerness);
		this._corners = corners;
		*/

// ImageMat.invertFloat01(corners);
// console.log(corners)
// var img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, width,height);
// var d = new DOImage(img);
// d.matrix().scale(1.0);
// d.matrix().translate(10,10);
// GLOBALSTAGE.addChild(d);
// throw "...";

/*
// console.log("CORNERS");
var corners = viewA.corners();
var size = viewA.size();
var heat = ImageMat.heatImage(corners, size.x, size.y, true);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), size.x, size.y);
var d = new DOImage(img);
	// d.graphics().alpha(0.5);
	d.matrix().scale(1.0);
	// d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);
throw "?";
*/
		// var finder = new R3D.CompareSizeFinder(image, 0.50); // 0.5-0.75
		// this._sizeFinder = finder;
	}else{
		this._corners = null;
		this._sizeFinder = null;
	}
}
Stereopsis.View.prototype.cornerForPoint = function(point){
	var image = this.image();
	var corners = this.corners();
	var index = Math.round(point.y)*image.width() + Math.round(point.x);
	return corners[index];
}
Stereopsis.View.prototype.minimumCornerness = function(){
	return this._minimumCornerness;
}
Stereopsis.View._cellOrdering = function(a,b){
	if(a.y<b.y){
		return -1;
	}else if(a.y>b.y){
		return 1;
	}else if(a.x<b.x){
		return -1;
	}else if(a.x>b.x){
		return 1;
	}
	return 0; // a.x==b.x && a.y==b.y
}

// TODO: are these probe point queues used anymore?
Stereopsis.View.prototype._resetQueues = function(){
	// TODO: clear?
	this._probe2DQueue = null;
}
Stereopsis.View.prototype._probe2DQueues = function(index, value){
	var probe2DQueues = this._probe2DQueue;
	if(!probe2DQueues){
		probe2DQueues = {};
		this._probe2DQueue = probe2DQueues;
	}
	var queues = probe2DQueues[index];
	if(!queues){
		// var addQueue = new PriorityQueue(Stereopsis.View._cellOrdering);
		// var addQueue = {};
		queues = {"add":{}};
		probe2DQueues[index] = queues;
	}
	if(value!==undefined){
		queues["add"] = value;
	}
	return queues;
}
Stereopsis.View.prototype.addQueue = function(oppositeView, value){
	return;
	var queues = this._probe2DQueues(oppositeView.id()+"", value);
	var addQueue = queues["add"];
	return addQueue;
}
Stereopsis.View.prototype.removeViewProbePoint = function(myPoint, oppositeView){ // keep track of removed points too ?
	throw "?"
}
Stereopsis.View.prototype.addViewProbePoint = function(myPoint, oppositeView){
	return;
	var addQueue = this.addQueue(oppositeView);
	var cell = this.cellForPoint(myPoint);
	if(!cell){
		console.log("no cell");
		console.log(cell);
		console.log(this.size());
		console.log(myPoint);
		throw "???";
	}
	// console.log(addQueue);
	// console.log(cell);
	addQueue[cell.id()+""] = cell;
}
Stereopsis.View.prototype.popAddQueue = function(oppositeView){
	var addQueue = this.addQueue(oppositeView);
	var list = Code.objectToArray(addQueue);
	this.addQueue(oppositeView,{});
	return list;
}


Stereopsis.View.prototype._updateInternalParams = function(){
	var size = this.size();
	var camera = this._camera;
	if(camera && size){
		var K = camera.K();
		this._K = R3D.cameraFromScaledImageSize(K, size);
		this._Kinv = Matrix.inverse(this._K);
	}else{
		this._K = null;
		this._Kinv = null;
	}
	this._resetCacheItems();
}
Stereopsis.View.prototype.K = function(){
	return this._K;
}
Stereopsis.View.prototype.Kinv = function(){
	return this._Kinv;
}
Stereopsis.View.prototype.focalLength = function(){
	if(!this._focalLength){
		var fx = this._K.get(0,0);
		var fy = this._K.get(1,1);
		this._focalLength = (fx+fy)*0.5;
	}
	return this._focalLength;
}
Stereopsis.View.prototype.normal = function(){
	var normal = this._normal;
	if(!normal){
		// var trans = this._absoluteTransform; // extrinsic
		var trans = this._absoluteTransformInverse; // absolute
		if(trans){
			var org = new V3D(0,0,0);
			var normal = new V3D(0,0,1);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(normal,normal);
			normal.sub(org);
			normal.norm();
			this._normal = normal;
		}
	}
	return this._normal;
}
Stereopsis.View.prototype.right = function(){
	var right = this._right;
	if(!right){
		// var trans = this._absoluteTransform; // extrinsic
		var trans = this._absoluteTransformInverse;
		if(trans){
			var org = new V3D(0,0,0);
			var right = new V3D(1,0,0);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(right,right);
			right.sub(org);
			right.norm();
			this._right = right;
		}
	}
	return this._right;
}
Stereopsis.View.prototype.up = function(){
	var up = this._up;
	if(!up){
		// var trans = this._absoluteTransform; // extrinsic
		var trans = this._absoluteTransformInverse;
		if(trans){
			var org = new V3D(0,0,0);
			up = new V3D(0,1,0);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(up,up);
			up.sub(org);
			up.norm();
			this._up = up;
		}
	}
	return this._up;
}
Stereopsis.View.prototype.center = function(){
	var center = this._center;
	if(!center){
		// var trans = this._absoluteTransform; // extrinsic
		var trans = this._absoluteTransformInverse; // absolute
		if(trans){
			center = new V3D(0,0,0);
			trans.multV3DtoV3D(center,center);
			this._center = center;
		}
	}
	return this._center;
}
Stereopsis.View.prototype.projectPoint3D = function(point2D,point3D){
	if(point3D===undefined){
		point3D = point2D;
		point2D = new V2D();
	}
	var K = this._K;
	var distortion = null;
	// var projected2D = R3D.projectPoint3DToCamera2DForward(point3D, this.absoluteTransform(), K, distortions, false, point2D);
	var projected2D = R3D.projectPoint3DCamera2DDistortion(point3D, this.absoluteTransform(), K, distortion, point2D, false);
	return projected2D;
}
// Stereopsis.View.prototype.compareSize = function(compareSize){
// 	if(compareSize!==undefined){
// 		this._compareSize = compareSize;
// 	}
// 	return this._compareSize;
// }
/*
Stereopsis.View.prototype.patchSize = function(){
	return this.cellSize();
	// var idealPercent = 0.01; // 1% - 5% of image : @ 500x400&0.01 = 6.4 pixels
	// var hypotenuse = this.size().length();
	// var patchSize = hypotenuse*idealPercent;
	// return patchSize;
}
*/
Stereopsis.View.prototype.compareSizeForPoint = function(point){ // this is the cell size, HALF OF THIS is the radius
	var finder = this._compareSizeFinder;
	if(finder){
		var size = finder.sizeForPoint(point);
		return size;
	}
	return this._compareSize;
}
Stereopsis.View.prototype.cellsForView = function(view){
	var index = view.id()+"";
	var cells = this._cells[index];
	if(!cells){
		cells = {};
		this._cells[index] = cells;
	}
	return cells;
}
Stereopsis.View.prototype.cellSize = function(cellSize){
	if(cellSize!==undefined){
		cellSize = Math.max(cellSize,3); // never too small
		var oldCell = this._cellSize;
		if(cellSize!==oldCell){
			this._cellSize = cellSize;
			this._initCompareSizes();
			this._initCells();
			// this._initProbe2DImage();
		}
	}
	return this._cellSize;
}
Stereopsis.View.prototype.mergeDistance = function(){
	var view = this;
	var cellSize = view.cellSize();
	//var minDistance = Math.max(cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY,Stereopsis.World.MIN_DISTANCE_EQUALITY_MIN);
	var minDistance = cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY;
	return minDistance
}
Stereopsis.View.prototype.nccMin = function(min){
	if(min!==undefined){
		this._errorNCCMin = min;
	}
	return this._errorNCCMin;
}
Stereopsis.View.prototype.nccMean = function(mean){
	if(mean!==undefined){
		this._errorNCCMean = mean;
	}
	return this._errorNCCMean
}
Stereopsis.View.prototype.nccSigma = function(sigma){
	if(sigma!==undefined){
		this._errorNCCSigma = sigma;
	}
	return this._errorNCCSigma;
}
Stereopsis.View.prototype.sadMin = function(min){
	if(min!==undefined){
		this._errorSADMin = min;
	}
	return this._errorSADMin;
}
Stereopsis.View.prototype.sadMean = function(mean){
	if(mean!==undefined){
		this._errorSADMean = mean;
	}
	return this._errorSADMean
}
Stereopsis.View.prototype.sadSigma = function(sigma){
	if(sigma!==undefined){
		this._errorSADSigma = sigma;
	}
	return this._errorSADSigma;
}
Stereopsis.View.prototype.fMin = function(min){
	if(min!==undefined){
		this._errorFMin = min;
	}
	return this._errorFMin;
}
Stereopsis.View.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
Stereopsis.View.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
Stereopsis.View.prototype.rMin = function(min){
	if(min!==undefined){
		this._errorRMin = min;
	}
	return this._errorRMin;
}
Stereopsis.View.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
Stereopsis.View.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
Stereopsis.View.prototype.averageReprojectionError = function(){
	var view = this;
	var points2D = view.toPointArray();
	// var errorN = [];
	// var errorS = [];
	// var errorF = [];
	// var errorR = [];
	var mean = 0;
	var pointCount = points2D.length;
	for(var j=0; j<pointCount; ++j){
		var point2D = points2D[j];
		// point2D = point2D.point3D();
		// console.log(point2D);
		// throw "?"
		// var n = point2D.averageNCCError();
		// var s = point2D.averageSADError();
		// var f = point2D.averageFError();
		// var r = point2D.averageRError();

		var point3D = point2D.point3D();
		var r = point3D.totalReprojectionError();
		mean += r;
		// errorN.push(n);
		// errorS.push(s);
		// errorF.push(f);
		//errorR.push(r);
	}
	if(pointCount>0){
		mean /= pointCount;
	}
	//var mean = Code.mean(errorR);
	return mean;
}

Stereopsis.View.prototype.track3AverageError = function(only3){
	var view = this;
	var points2D = view.toPointArray();
	var mean = 0;
	var pointCount = points2D.length;
	var includedCount = 0;
// console.log(points2D)
	for(var j=0; j<pointCount; ++j){
		var point2D = points2D[j];
		var point3D = point2D.point3D();
// console.log(point3D.point2DCount());
		if(point3D.point2DCount()<3){ // 3+ views
			continue;
		}
		includedCount += 1;
		var info = point3D.estimated3D(true);
		mean += info["error"];
	}
// console.log("includedCount: "+includedCount);
	if(includedCount>0){
		// console.log("est: "+includedCount+" @ "+mean);
		mean /= includedCount;
	}
// throw "is this correct usage of track3AverageError?"
	return mean;
}
Stereopsis.View.prototype.toPointArray = function(){
	return this._pointSpace.toArray();
}
Stereopsis.View.prototype.insertPoint2D = function(point2D){
	var p = point2D.point2D();
	var s = this.size();
	if( !(0<=p.x && p.x<s.x && 0<=p.y && p.y<s.y) ){
		return;
		// console.log(point2D)
		// throw "p is outside ";
	}
	this.removePoint2D(point2D);
	this.cellForPoint(point2D.point2D()).addObject(point2D);
	return this._pointSpace.insertObject(point2D);
}
Stereopsis.View.prototype.removePoint2D = function(point2D){
	var p = point2D.point2D();
	var s = this.size();
	if( !(0<=p.x && p.x<s.x && 0<=p.y && p.y<s.y) ){
		// console.log(point2D)
		// throw "p is outside ";
		return;
	}
	if(!this.cellForPoint(point2D.point2D())){
		console.log(this);
		console.log(s);
		console.log(point2D);
		console.log(point2D.point2D());
		throw "... no cell"
	}
	this.cellForPoint(point2D.point2D()).removeObject(point2D);
	return this._pointSpace.removeObject(point2D);
}
Stereopsis.View.prototype.isPointInside = function(point){
	var size = this.size();
	var width = size.x;
	var height = size.y;
	// if(0<point.x && point.x<width-1 && 0<point.y && point.y<height-1){
	if(0<point.x && point.x<width && 0<point.y && point.y<height){
		return true;
	}
	return false;
}
Stereopsis.View.prototype.pointCount = function(){
	return this._pointSpace.count();
}
Stereopsis.View.prototype.kNN = function(point, count, evalFxn){
	var list = this._pointSpace.kNN(point, count, evalFxn);
	return list;
}
Stereopsis.View.prototype.pointsInCircle = function(point, radius){
	var list = this._pointSpace.objectsInsideCircle(point, radius);
	return list;
}
Stereopsis.View.prototype.closestPoint2D = function(point2D){
	var point = point2D.point2D();
	var list = this._pointSpace.kNN(point, 2);
	if(list.length==0){
		return null;
	}
	if(list.length>=1 && list[0]!=point2D){
		return list[0];
	}
	if(list.length>=2 && list[1]!=point2D){
		return list[1];
	}
	return null;
}
Stereopsis.View.prototype.absoluteTransform = function(camera){ // extrinsic
	if(camera){
		this._absoluteTransform = camera.copy();
		this._absoluteTransformInverse = Matrix.inverse(camera);
		this._resetCacheItems();
	}
	return this._absoluteTransform;
}
Stereopsis.View.prototype.absoluteTransformInverse = function(){ // absolute
	return this._absoluteTransformInverse;
}
// Stereopsis.View.prototype.extrinsicTransform = function(extrinsic){
// 	if(extrinsic){
// 		this._absoluteTransformInverse = extrinsic.copy();
// 		this._absoluteTransform = Matrix.inverse(extrinsic); // R3D.extrinsicMatrixFromCameraMatrix
// 		this._resetCacheItems();
// 	}
// 	return this._absoluteTransformInverse;
// }
// Stereopsis.View.prototype.extrinsicTransformInverse = function(){
// 	return this._absoluteTransform;
// }


Stereopsis.View.prototype.pointsInsideCellPoint = function(point){
	var cellSize = this.cellSize();
	var cellX = Math.floor(point.x/cellSize);
	var cellY = Math.floor(point.y/cellSize);
	return pointsInsideCell(cellX,cellY);
}
Stereopsis.View.prototype.pointsInsideCell = function(cellX,cellY){
	var cellSize = this.cellSize();
	var min = new V2D(cellX*cellSize,cellY*cellSize);
	var max = new V2D((cellX+1)*cellSize,(cellY+1)*cellSize);
	return this.pointsInsideRect(min, max);
}
Stereopsis.View.prototype.pointsInsideRect = function(min,max){
	var points2D = this._pointSpace.objectsInsideRect(min, max);
	return points2D;
}
Stereopsis.View.prototype.cellCenter = function(cellX,cellY){
	var cellSize = this.cellSize();
	return new V2D( (cellX+0.5)*cellSize, (cellY+0.5)*cellSize );
}
Stereopsis.View.prototype.bestCorner = function(cellX,cellY){
	var size = this.size();
	var wid = size.x;
	var hei = size.y;
	var cellSize = this.cellSize();
	var corners = this.corners();
	var startI = Math.max(0, cellSize*cellX);
	var lastI = Math.min(wid-1, (cellSize+1)*cellX);
	var startJ = Math.max(0, cellSize*cellY);
	var lastJ = Math.min(hei-1, (cellSize+1)*cellY);
	var maxIndex = -1;
	var bestX = 0;
	var bestY = 0;
	var bestValue = 0;
	for(var j=startJ; j<=lastJ; ++j){
		for(var i=startI; i<=lastI; ++i){
			var index = j*wid + i;
			var value = corners[index];
			if(maxIndex<0 || value>bestValue){
				bestValue = value;
				maxIndex = index;
				bestX = i;
				bestY = j;
			}
		}
	}
	var point = new V2D(bestX,bestY);
	return point;
}
Stereopsis.View.prototype.neighborCells = function(cellX,cellY){
	// 8:
	var cellSize = this.cellSize();
	var size = this.size();
	var maxX = (size.x/cellSize) | 0;
	var maxY = (size.y/cellSize) | 0;
	neighbors = [];
	for(var j=-1; j<=1; ++j){
		for(var i=-1; i<=1; ++i){
			if(i==0 && j==0){
				continue;
			}
			var x = cellX + i;
			var y = cellY + j;
			if(0<=x && x<=maxX && 0<=y && y<=maxY){
				var c = new V2D(x,y);
				neighbors.push(c);
			}
		}
	}
	return neighbors;
}

Stereopsis.View.prototype.includePointsForViews = function(includedViews){
	// console.log(includedViews);
	// var lookup = {};
	// for(var i=0; i<includedViews.length; ++i){
	// 	var view = includedViews[i];
	// 	var viewID = includedViews.id();
	// 	lookup[viewID] = view;
	// }
	var points = this._pointSpace.toArray();
	var includedPoints = [];
	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var point3D = point2D.point3D();
		for(var j=0; j<includedViews.length; ++j){
			var view = includedViews[j];
			if(point3D.hasView(view)){
				includedPoints.push(point2D);
				break;
			}
		}
	}
	// console.log(includedPoints);
	// throw "includedViews"
	return includedPoints;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Camera = function(K, distortion, data){
	this._id = Stereopsis.Camera.ID++;
	this._data = null;
	this._temp = null;
	this._K = null;
	this._Kinv = null;
	this._distortion = null;
	this.K(K);
	this.distortion(distortion);
	this.data(data);
}
Stereopsis.Camera.ID = 0;
Stereopsis.Camera.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.Camera.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
Stereopsis.Camera.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.Camera.prototype.K = function(K){
	if(K!==undefined){
		this._K = K;
		this._Kinv = Matrix.inverse(K);
	}
	return this._K;
}
Stereopsis.Camera.prototype.Kinv = function(){
	return this._Kinv;
}
Stereopsis.Camera.prototype.distortion = function(distortion){
	if(distortion!==undefined){
		this._distortion = distortion;
	}
	return this._distortion;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Transform3D = function(viewA,viewB,world){
	this._id = Stereopsis.Transform3D.ID++;
	this._viewA = null;
	this._viewB = null;
	this._Ffwd = null;
	this._Frev = null;
	this._Rfwd = null;
	this._Rrev = null;
	this._errorNCCMean = null;
	this._errorNCCSigma = null;
	this._errorSADMean = null;
	this._errorSADSigma = null;
	this._errorFMean = null;
	this._errorFSigma = null;
	this._errorRMean = null;
	this._errorRSigma = null;
	this._matches = {};
	this._matchCount = 0;
	// this._matches = [];
	this._world = null;
	this._searchCorners = null;
	// delta errors
	this._errorRStart = null;
	this._errorREnd = null;
	this._errorRDelta = null;
	this._errorFStart = null;
	this._errorFEnd = null;
	this._errorFDelta = null;
	// init
	this.viewA(viewA);
	this.viewB(viewB);
	this.world(world);
}
Stereopsis.Transform3D.ID = 0;
Stereopsis.Transform3D.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.Transform3D.prototype.errorStart = function(){
	this._errorRStart = this._errorRMean + this._errorRSigma;
	this._errorFStart = this._errorFMean + this._errorFSigma;
}
Stereopsis.Transform3D.prototype.errorEnd = function(){
	this._errorREnd = this._errorRMean + this._errorRSigma;
	this._errorFEnd = this._errorFMean + this._errorFSigma;
	this._errorRDelta = this._errorREnd - this._errorRStart;
	this._errorFDelta = this._errorFEnd - this._errorFStart;
}
Stereopsis.Transform3D.prototype.errorRDelta = function(){
	return this._errorRDelta;
}
Stereopsis.Transform3D.prototype.errorFDelta = function(){
	return this._errorFDelta;
}
Stereopsis.Transform3D.prototype.hasView = function(view){
	return this._viewA == view || this._viewB == view;
}
Stereopsis.Transform3D.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
Stereopsis.Transform3D.prototype.viewB = function(viewB){
	if(viewB!==undefined){
		this._viewB = viewB;
	}
	return this._viewB;
}
Stereopsis.Transform3D.prototype.oppositeView = function(view){
	if(view==this.viewA()){
		return this.viewB();
	}else if(view==this.viewB()){
		return this.viewA();
	}
	return null;
}
Stereopsis.Transform3D.prototype.world = function(world){
	if(world!==undefined){
		this._world = world;
	}
	return this._world;
}
Stereopsis.Transform3D.prototype.matches = function(){
	return Code.objectToArray(this._matches);
	// return this._matches;
}
Stereopsis.Transform3D.prototype.matchCount = function(){
	return this._matchCount;
}
Stereopsis.Transform3D.prototype.graphWeight = function(){
	return 1.0;
	// return 1.0/this._errorRMean;
}
Stereopsis.Transform3D.prototype.F = function(viewA,viewB, F){
	if(viewA==this._viewA && viewB==this._viewB){
		if(F!==undefined){
			this._Ffwd = F;
			this._Frev = R3D.fundamentalInverse(F);
		}
		return this._Ffwd;
	}else if(viewB==this._viewA && viewA==this._viewB){
		if(F!==undefined){
			this._Ffwd = R3D.fundamentalInverse(F);
			this._Frev = F;
		}
		return this._Frev;
	}
	return null;
}
Stereopsis.Transform3D.prototype.scaleR = function(scale){
	var R = this._Rfwd;
	if(R){
		var t = new V3D(R.get(0,3),R.get(1,3),R.get(2,3));
		t.scale(scale);
		R.set(0,3, t.x);
		R.set(1,3, t.y);
		R.set(2,3, t.z);
		this.R(R);
	}
}

Stereopsis.Transform3D.prototype.R = function(viewA,viewB, R){
	if(arguments.length==0){
		return this._Rfwd;
	}
	if(viewA==this._viewA && viewB==this._viewB){
		if(R!==undefined){
			this._Rfwd = R;
			this._Rrev = R3D.inverseCameraMatrix(R);
		}
		return this._Rfwd;
	}else if(viewB==this._viewA && viewA==this._viewB){
		if(R!==undefined){
			this._Rfwd = R3D.inverseCameraMatrix(R);
			this._Rrev = R;
		}
		return this._Rrev;
	}
	return null;
}
Stereopsis.Transform3D.prototype.sadMean = function(mean){
	if(mean!==undefined){
		this._errorSADMean = mean;
	}
	return this._errorSADMean
}
Stereopsis.Transform3D.prototype.sadSigma = function(sigma){
	if(sigma!==undefined){
		this._errorSADSigma = sigma;
	}
	return this._errorSADSigma;
}
Stereopsis.Transform3D.prototype.nccMean = function(mean){
	if(mean!==undefined){
		this._errorNCCMean = mean;
	}
	return this._errorNCCMean;
}
Stereopsis.Transform3D.prototype.nccSigma = function(sigma){
	if(sigma!==undefined){
		this._errorNCCSigma = sigma;
	}
	return this._errorNCCSigma;
}
Stereopsis.Transform3D.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean;
}
Stereopsis.Transform3D.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
Stereopsis.Transform3D.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean;
}
Stereopsis.Transform3D.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
Stereopsis.Transform3D.prototype.rAverage = function(mean){
	if(mean!==undefined){
		this._errorRAverage = mean;
	}
	return this._errorRAverage;
}
Stereopsis.Transform3D.prototype.insertMatch = function(match){
	var index = match.id();
	if(this._matches[index]){
		if(this._matches[index]!==match){
			throw "?";
		}
		console.log("entry already exists at: "+index);
		// return;
	}
	// if(this._matches[index]==match){
	// 	console.log("match already exists");
	// }
	this._matches[index] = match;
	this._matchCount += 1;
	// console.log(this._matches);
	// this.removeMatch(match);
	// this._matches.push(match);
	match.transform(this); // maybe shouldn't be here ...
}
Stereopsis.Transform3D.prototype.removeMatch = function(match){
	var index = match.id();
	if(this._matches[index]){
		if(this._matches[index]!==match){
			throw "?";
		}
		this._matchCount -= 1;
		delete this._matches[index];
	}
}

Stereopsis.Transform3D.prototype.copyRelativeFromAbsolute = function(){
	var transform = this;
	var vA = transform.viewA();
	var vB = transform.viewB();
	var absA = vA.absoluteTransform();
	var absB = vB.absoluteTransform();
	if(absA && absB){
		// WAS: 
		// var absoluteAtoB = Matrix.relativeWorld(vA.absoluteTransformInverse(),vB.absoluteTransformInverse());
		// var extrinsicAtoB = Matrix.inverse(absoluteAtoB);
		// transform.R(vA,vB,extrinsicAtoB);
		// CORRECT ?
		var relativeAB = Matrix.relativeWorld(absA,absB);
		// WRONG ...
		// var relativeAB = Matrix.relativeReference(absA,absB);
		transform.R(vA,vB,relativeAB);
	}
}


Stereopsis.Transform3D.prototype.searchCorners = function(){
	return this._searchCorners;
}
Stereopsis.Transform3D.prototype.relativeEstimatePoints3D = function(){ // calc match 3D location from local transform
console.log("relativeEstimatePoints3D - triangulate points");
	var viewA = this.viewA();
	var viewB = this.viewB();
	// var extrinsicA = new Matrix(4,4).identity();
	// var extrinsicB = this.R(viewA,viewB);
	var cameraA = new Matrix(4,4).identity();
	var cameraB = this.R(viewA,viewB);
	var matches = this.matches();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var p3D = match.point3D();
		//var point3D = R3D.triangulatePointDLT(pA,pB, extrinsicA,extrinsicB, KaInv, KbInv);
		var point3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);

		// ??

		match.estimated3D(point3D); // relative
	}
}
Stereopsis.Transform3D.prototype.toPointArray = function(){
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	var points3D = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point2D());
		pointsB.push(pointB.point2D());
		points3D.push(point3D);
	}
	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D};
}
Stereopsis.Transform3D.prototype.toBestPointArray = function(percentR, percentF, percentN, percentS, percentC){ // R & F may be noncalculated
	var matches = this.matches();
	var matchCount = matches.length;
	// want 100-1000
	// var minimumMatchCount = 16;
	// var minimumMatchCount = 32;
	var minimumMatchCount = 100;
	var percentKeep = 0.50; // 0.5 - 0.75 |   0.5^4=>0.0625   0.75^4=>0.316
	percentR = Code.valueOrDefault(percentR, percentKeep);
	percentF = Code.valueOrDefault(percentF, percentKeep);
	percentN = Code.valueOrDefault(percentN, percentKeep);
	percentS = Code.valueOrDefault(percentS, percentKeep);
	// C

	var viewA = this.viewA();
	var viewB = this.viewB();
	
	var expectedMatches = Math.round(matchCount*percentR*percentF*percentN*percentS);
console.log(matchCount+" -> "+expectedMatches);
	if(expectedMatches<minimumMatchCount){
		return this.toPointArray();
	}
	// calculate limits
	var listR = [];
	var listF = [];
	var listN = [];
	var listS = [];
	for(var i=0; i<matchCount; ++i){
		var match = matches[i];
		listR.push( match.errorR() );
		listF.push( match.errorF() );
		listN.push( match.errorNCC() );
		listS.push( match.errorSAD() );
	}
	listR.sort();
	listF.sort();
	listN.sort();
	listS.sort();
// Code.printMatlabArray(listR,"R");
// Code.printMatlabArray(listF,"F");
// Code.printMatlabArray(listN,"N");
// Code.printMatlabArray(listS,"S");
	var limitR = listR[0]===null ? 0 : Code.percentile(listR, percentR);
	var limitF = listF[0]===null ? 0 : Code.percentile(listF, percentF);
	var limitN = Code.percentile(listN, percentN);
	var limitS = Code.percentile(listS, percentS);
	console.log("R "+limitR+" : "+listR[0]+" - "+listR[listR.length-1]);
	console.log("F "+limitF+" : "+listF[0]+" - "+listF[listF.length-1]);
	console.log("N "+limitN+" : "+listN[0]+" - "+listN[listN.length-1]);
	console.log("S "+limitS+" : "+listS[0]+" - "+listS[listS.length-1]);

	// if match satisfies limits, keep
	var pointsA = [];
	var pointsB = [];
	var points3D = [];
	for(var i=0; i<matchCount; ++i){
		var match = matches[i];
		var r = match.errorR();
		var f = match.errorF();
		var n = match.errorNCC();
		var s = match.errorSAD();
		var passR = limitR>0 ? r<limitR : true;
		var passF = limitF>0 ? f<limitF : true;
		var passN = limitN>0 ? n<limitN : true;
		var passS = limitS>0 ? s<limitS : true;
		if( passR && passF && passN && passS){
			var point3D = match.point3D();
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			pointsA.push(pointA.point2D());
			pointsB.push(pointB.point2D());
			points3D.push(point3D);
		}
	}
	console.log(" BestPointArray: "+points3D.length);
	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D};
}


Stereopsis.Transform3D.prototype.calculateErrorM = function(){
	var transform = this;
	var matches = transform.matches();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var nccScores = [];
	var sadScores = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var scoreN = match.errorNCC();
		var scoreS = match.errorSAD();
		if(scoreN!==null && scoreS!==null){
			nccScores.push(scoreN);
			sadScores.push(scoreS);
		}
	}
	if(nccScores.length>0){
		// var sortFxn = function(a,b){
		// 	return a[0] < b[0] ? -1 : 1;
		// }
		// nccScores.sort(sortFxn);
		// sadScores.sort(sortFxn);
		var nMin = Code.min(nccScores);
		var nSigma = Code.stdDev(nccScores, nMin);
		// var nHalf = Code.median(nccScores);
			// nSigma = Math.min(nSigma,nHalf);
		// this._errorNCCMean = nMean;
		this._errorNCCMean = nMin;
		this._errorNCCSigma = nSigma;
		var sMin = Code.min(sadScores);
		var sSigma = Code.stdDev(sadScores, sMin);
		// this._errorSADMean = sMean;
		this._errorSADMean = sMin;
		this._errorSADSigma = sSigma;
console.log("transform found error: nMean: "+nMin+" nSigma: "+nSigma+" ...	 "+nccScores.length);
	}else{
		this._errorNCCMean = null;
		this._errorNCCSigma = null;
		this._errorSADMean = null;
		this._errorSADSigma = null;
	}
	// return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
Stereopsis.Transform3D.prototype.calculateErrorF = function(F){
	throw "use the world once"
	var FFwd = this._Ffwd;
	var FRev = this._Frev;
	if(F){
		FFwd = F;
		throw "FRev = invert F";
	}
	if(!FFwd){
		this._errorFMean = null;
		this._errorFSigma = null;
		return;
	}
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var fDistances = [];
	var orderedPoints = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
if(!pointA){
	console.log(match);

	throw "no pointA ?"
}
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var error = R3D.fError(FFwd, FRev, pA, pB);
		var distance = error["error"];
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		orderedPoints.push([distance, pA, pB]);
		match.errorF(distance);
	}
// use random subset or don't use at all
	// orderedPoints.sort(function(a,b){
	// 	return a[0] < b[0] ? -1 : 1;
	// });
	for(var i=0; i<orderedPoints.length; ++i){
		fDistances.push(orderedPoints[i][0]);
	}
	var fMin = Code.min(fDistances);
	var fSigma = Code.stdDev(fDistances, fMin);
	this._errorFMean = fMin;
	this._errorFSigma = fSigma;
}
Stereopsis.Transform3D.prototype.calculateErrorR = function(R){
	if(!R){
		R = this._Rfwd;
	}
	if(!R){
		this._errorRMean = null;
		this._errorRSigma = null;
		return;
	}
	// reproject all 3d points from OWN predicted location [relative]
	var viewA = this.viewA();
	var viewB = this.viewB();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var extrinsicA = new Matrix(4,4).identity();
	var extrinsicB = R;
	var matches = this.matches();
	var orderedPoints = [];
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var estimated3D = match.estimated3D(); // relative
		if(!estimated3D){
			console.log("match not have estimate");
			continue;
		}
		var error = R3D.reprojectionError(estimated3D, pA,pB, extrinsicA, extrinsicB, Ka, Kb);
		if(!error){			
			// console.log(matches);
			// console.log(pA);
			// console.log(pB);
			// console.log(extrinsicA);
			// console.log(extrinsicB);
			// console.log(estimated3D);
			// console.log(Ka);
			// console.log(Kb);
			// console.log(error);
			// throw "no error?"
			console.log("match should be removed");
			match.errorR(9E99);
		}else{
			var distanceA = error["distanceA"];
			var distanceB = error["distanceB"];
			var distance = error["error"];
				orderedPoints.push([distance, pA, pB, estimated3D]);
				match.errorR(distance);
		}
	}
	// use random subset or don't use at all
	// orderedPoints.sort(function(a,b){
	// 	return a[0] < b[0] ? -1 : 1;
	// });
	var rDistances = [];
	for(var i=0; i<orderedPoints.length; ++i){
		rDistances.push(orderedPoints[i][0]);
	}
	var rMin = Code.min(rDistances);
	var rMean = Code.mean(rDistances);
	var rSigma = Code.stdDev(rDistances, rMin);
	// var rHalf = Code.median(rDistances);
		// rSigma = Math.min(rSigma,rHalf);
	this._errorRAverage = rMean;
	this._errorRMean = rMin;
	this._errorRSigma = rSigma;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P3D = function(point,normal,size){
	this._data = null;
	this._point = null;
	this._normal = null;
	this._up = null;
	this._size = null;
	this._points2D = {};
	this._matches = {};
	this._temp = null;
	// this._hysteresis = null;
	this._ancestor = null; // point this propagated from, or somehow merged from
	this.point(point);
	this.normal(normal);
	this.size(size);
	this._id = ++Stereopsis.P3D._ID;
}
Stereopsis.P3D._ID = 0;
Stereopsis.P3D.prototype.id = function(){
	return this._id;
}
Stereopsis.P3D.prototype.propagateViewList = function(h){
	if(h!==undefined){
		this._hysteresis = h;
	}
	return this._hysteresis;
}
Stereopsis.P3D.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
// Stereopsis.P3D.prototype.ancestor = function(point3D){
// 	if(point3D!==undefined){
// 		this._ancestor = point3D;
// 	}
// 	return this._ancestor;
// }
Stereopsis.P3D.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
Stereopsis.P3D.prototype.normal = function(normal){
	if(normal!==undefined){
		this._normal = normal;
	}
	return this._normal;
}
Stereopsis.P3D.prototype.up = function(up){
	if(up!==undefined){
		this._up = up;
	}
	return this._up;
}
Stereopsis.P3D.prototype.right = function(){
	if(this._normal){ // TODO: MAKE CACHE
		return V3D.cross(this._normal,this._up);
	}
	return null;
}
Stereopsis.P3D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.P3D.prototype.size = function(size){
	if(size!==undefined){
		this._size = size;
	}
	return this._size;
}
Stereopsis.P3D.prototype.nonLinearPatch = function(value){
	if(value){
		this._nonLinearPatch = value;
	}
	return this._nonLinearPatch === true;
}
Stereopsis.P3D.prototype.hasPatch = function(){
	return this._normal!=null; // && this._up!=null
}
Stereopsis.P3D.prototype.isValid = function(){ // hasbeenkilledyet
	// return this._id >== 0;
	return this._id !== null;
}
Stereopsis.P3D.prototype.hasPatchResolvedAffine = function(){
	return false;
}

Stereopsis.P3D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
Stereopsis.P3D.prototype.toPointArray = function(){
	return Code.arrayFromHash(this._points2D);
}
Stereopsis.P3D.prototype.point2DCount = function(){
	return this.toPointArray().length;
}
Stereopsis.P3D.prototype.viewCount = function(){
	return this.toPointArray().length;
}
Stereopsis.P3D.prototype.matchCount = function(){
	return this.toMatchArray().length;
}
Stereopsis.P3D.prototype.toViewArray = function(){
	var points = this._points2D;
	var views = [];
	Code.forEach(points, function(point,i){
		var point = points[i];
		views.push(point.view());
	});
	return views;
}
Stereopsis.P3D.prototype.point2DCount = function(){
	return Code.keys(this._points2D).length;
}
Stereopsis.P3D.prototype.addPoint2D = function(point2D){
	if(point2D!==undefined){
		var m = this.point2DForView(point2D.view(),point2D);
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.removePoint2D = function(point2D){
	var m = this.point2DForView(point2D.view(), null);
}
Stereopsis.P3D.prototype.hasView = function(view){
	var index = Stereopsis.indexFromObjectID(view);
	var point = this._points2D[index];
	if(point){
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.point2DForView = function(view,point2D){
	var index = Stereopsis.indexFromObjectID(view);
	if(point2D!==undefined){
		this._points2D[index] = point2D;
		if(point2D==null){
			delete this._points2D[index];
		}
	}
	point2D = this._points2D[index];
	if(point2D){
		return point2D;
	}
	return null;
}

Stereopsis.P3D.prototype.addMatch = function(match){
	if(match!==undefined){
		var m = this.matchForViews(match.viewA(),match.viewB(),match);
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.removeMatch = function(match){
	var m = this.matchForViews(match.viewA(),match.viewB(), null);
}
Stereopsis.P3D.prototype.matchForViews = function(viewA,viewB, match){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	if(match!==undefined){
		this._matches[index] = match;
		if(match==null){
			delete this._matches[index];
		}
	}
	match = this._matches[index];
	if(match){
		return match;
	}
	return null;
}

Stereopsis.P3D.prototype.checkOverlapPoints2D = function(){ // intersection, collision, crossing, overlap
	var points2D = this.toPointArray();
	var intersectionP2D = null;
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var minDistance = view.mergeDistance();
		var closest = view.closestPoint2D(point2D);
		if(closest){
			var dist = V2D.distance(point2D.point2D(), closest.point2D());
			if(dist<minDistance){
				intersectionP2D = closest;
				break;
			}
		}
	}
	return intersectionP2D;
}
/*
Stereopsis.P3D.prototype.calculateAbsoluteLocation = function(world, dontInsert){ // transformIn ?
	throw "don't use this -- use calculateAbsoluteLocationDLT"
	dontInsert = dontInsert!==undefined ? dontInsert : false;
	var point3D = this;
	var matches = point3D.toMatchArray();
	var locations = [];
	var errors = [];
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		var transform = match.transform();
		var error = 0;
		var rMean = transform.rMean();
		var rSigma = transform.rSigma();
		if(transform.matchCount()==0 || !rMean || !rSigma){
			error = 1.0; // TODO: PICK SOME NUMBER ?
		}else{
			error = rMean + 1.0*rSigma;
		}
		var location3D = match.estimated3D(); // relative
		if(!location3D){ // if a transform can't get a good R
			// console.log("no location3D");
			continue;
		}
		var viewA = transform.viewA();

		var invA = viewA.absoluteTransformInverse(); // actual absolute location
		location3D = invA.multV3DtoV3D(location3D); // 'undo' A to get to world coordinates

		// var absA = viewA.absoluteTransform();
		// location3D = absA.multV3DtoV3D(location3D);

		locations.push(location3D);
		errors.push(error);
	}
	var percents = Code.errorsToPercents(errors);
	percents = percents["percents"];
	var location = new V3D();
	for(var j=0; j<locations.length; ++j){
		var p = percents[j];
		var l = locations[j];
		location.add(l.x*p,l.y*p,l.z*p);
	}
	if(locations.length==0){
		location = null;
	}
// // console.log(matches.length);
// // deltas:
// if(locations.length>1){ // only care about 3+ views
// for(var j=0; j<locations.length; ++j){
// var loc = locations[j];
// var delta = V3D.distance(location,loc);
// console.log("delta: "+delta);
// }
// }


	if(!dontInsert){ // disconnected points shouldn't necessarily be added
		if(location && Code.isNaN(location.x) ){
			console.log(errors);
			console.log(percents);
			console.log(locations);
			console.log(matches);
			console.log("dontInsert "+location);
			throw "NANNN";
		}
		world.updatePoint3DLocation(point3D,location);
	}else{
		return location;
	}
}
*/
/*
Stereopsis.P3D.prototype.calculateAbsoluteLocationDLT = function(world, dontInsert){
	throw "phase out"
	dontInsert = dontInsert!==undefined ? dontInsert : false;
	var point3D = this;
	var location = point3D.estimated3D();
	if(!dontInsert){ // disconnected points shouldn't necessarily be added
		if(location && Code.isNaN(location.x) ){
			console.log(errors);
			console.log(percents);
			console.log(locations);
			console.log(matches);
			console.log("dontInsert "+location);
			throw "NANNN";
		}
		// if(location===null){
		// 	console.log("calculateAbsoluteLocationDLT => "+null);
		// }
		world.updatePoint3DLocation(point3D,location);
	}else{
		return location;
	}
}
Stereopsis.P3D.prototype.copyAbsoluteLocationToMatches = function(){
	var point3D = this;
	var matches = point3D.toMatchArray();
	var location = point3D.point();
	// if(location){
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			match.estimated3D(location.copy());
		}
	// }
	return this;
}
*/
Stereopsis.P3D.prototype.averageNCCError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorNCC();
	});
}
Stereopsis.P3D.prototype.averageSADError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorSAD();
	});
}
Stereopsis.P3D.prototype.averageFError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorF();
	});
}
// Stereopsis.P3D.prototype.averageRError = function(){
// 	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
// 		return match.errorR();
// 	});
// }
Stereopsis.P3D.prototype.pointForView = function(view){

	var point = this._points2D[view.id()+""];
	if(point){
		return point;
	}
	return null;
}
/*
Stereopsis.P3D.prototype.totalReprojectionError = function(){
	throw "use globalPoint3DReprojectionError"
	var p3D = this.point();
	var p2Ds = this.toPointArray();
	var error = 0;

// add error:
// var sss = 0.10;
// var sss = 1.0;
// var old = p3D;
// p3D = V3D.add(p3D, new V3D((Math.random()-0.5)*sss,(Math.random()-0.5)*sss,(Math.random()-0.5)*sss) );
// console.log(p3D+" ... ");
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
		p2D = p2D.point2D();
// console.log(p2D+" ... ");
		var K = view.K();
		var extrinsic = view.absoluteTransform();
		var distanceSquare = R3D.reprojectionErrorSingle(p3D,p2D,extrinsic,K);
		error += distanceSquare;
	}

// console.log(old+" -> "+p3D+" = "+error);

	// throw "... totalReprojectionError"
	return error/p2Ds.length;
}
*/
Stereopsis.P3D.prototype.globalPoint3DReprojectionError = function(location3D){
	if(!location3D){
		location3D = this.point();
		if(!location3D){
			return null;
		}
	}
	var p2Ds = this.toPointArray();
	var extrinsics = [];
	var points2D = [];
	var invsK = [];
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
			p2D = p2D.point2D();
		var extrinsic = view.absoluteTransform();
		var invK = view.Kinv();
		if(!invK){ // no K (F process?)
			return null;
		}
		points2D.push(p2D);
		extrinsics.push(extrinsic);
		invsK.push(invK);
	}
	var totalError = 0;
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
		p2D = p2D.point2D();
		var K = view.K();
		var extrinsic = view.absoluteTransform();
		var distanceSquare = R3D.reprojectionErrorSingle(location3D,p2D,extrinsic,K);
		totalError += distanceSquare;
	}
	totalError /= p2Ds.length; // more points will have more error
	return totalError;
}
Stereopsis.P3D.prototype.globalErrorR = function(error){
	if(error!==undefined){
		this._globalErrorR = error;
	}
	return this._globalErrorR;
}
Stereopsis.P3D.prototype.globalPoint3DLinear = function(){ // get DLT triangulation
	var p2Ds = this.toPointArray();
	var extrinsics = [];
	var points2D = [];
	var invsK = [];
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
			p2D = p2D.point2D();
		var extrinsic = view.absoluteTransform();
		var invK = view.Kinv();
		if(!invK){ // no K (F process?)
			return null;
		}
		points2D.push(p2D);
		extrinsics.push(extrinsic);
		invsK.push(invK);
	}
	var location3D = R3D.triangulatePointDLTList(points2D, extrinsics, invsK);
	return location3D;
}
Stereopsis.P3D.prototype.globalPoint3DUpdateNonlinearGeometry = function(location3D){
	if(!location3D){
		location3D = this.point();
	}
	throw "using geometric projection?"
}
Stereopsis.P3D.prototype.globalPatch3DUpdateNonlinearImage = function(){
	throw "using image projection?"	
}
/*
Stereopsis.P3D.prototype.estimated3D = function(calculateError){
	throw "phase this out - use globalPoint3DLinear"
	var p2Ds = this.toPointArray();
	// get DLT triangulation
	var extrinsics = [];
	var points2D = [];
	var invsK = [];
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
			p2D = p2D.point2D();
		var extrinsic = view.absoluteTransform();
		var invK = view.Kinv();
		if(!invK){ // no K (F process?)
			return null;
		}
		points2D.push(p2D);
		extrinsics.push(extrinsic);
		invsK.push(invK);
	}
	// console.log(this);
	// console.log(p2Ds);
	// console.log(p2Ds,points2D, extrinsics, invsK);
	try{
		var location3D = R3D.triangulatePointDLTList(points2D, extrinsics, invsK);
		if(!location3D){
			return null;
		}
	}catch(e){
		console.log(this);
		console.log(points2D);
		console.log(extrinsics);
		console.log(invsK);
		throw e;
	}
	
	// TODO: nonlinear step ?
	// UPDATE: location3D

	// error
	if(calculateError){
		var totalError = 0;
		for(var i=0; i<p2Ds.length; ++i){
			var p2D = p2Ds[i];
			var view = p2D.view();
			p2D = p2D.point2D();
			var K = view.K();
			var extrinsic = view.absoluteTransform();
			var distanceSquare = R3D.reprojectionErrorSingle(location3D,p2D,extrinsic,K);
			totalError += distanceSquare;
		}
		return {"point":location3D, "error":totalError};
	}
	return location3D;
}
*/

Stereopsis.P3D.prototype.tempPatchPriority = function(){
	/*
	// OK
	var worstScore = null;
	var points2D = this.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var score = point2D.view().cornerForPoint(point2D.point2D());
		if(worstScore==null || score>worstScore){
			worstScore = score;
		}
	}
	*/

	var worstScore = null;
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match.errorNCC(); // OK
		// var score = match.errorSAD(); // BAD
		if(worstScore==null || score>worstScore){
			worstScore = score;
		}
	}

	this.temp(worstScore);
}
Stereopsis.P3D.prototype.toString = function(){
	var views = this.toViewArray();
	var str = "[P3D: ";
	for(var i=0; i<views.length; ++i){
		str += views[i].id()+(i<views.length-1 ? "," : "");
	}
	str = str + " p:" + this.hasPatch() + "]";
	str = str + "]";
	return str;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P2D = function(view,point2D,point3D, size){
	this._data = null;
	this._temp = null;
	this._point2D = null;
	this._view = null;
	this._point3D = null;
	this._size = null;
	// this._size = null;
	this._matches = {};
this._votes = [];
	this.view(view);
	this.point2D(point2D);
	this.point3D(point3D);
	this.size(size);
}
Stereopsis.P2D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.P2D.prototype.vote = function(value){
	this._votes.push(value);
}
Stereopsis.P2D.prototype.votePercent = function(){
	var len = this._votes.length;
	if(len>0){
		var sum = Code.sum(this._votes);
		var percent = sum/len;
		return percent;
	}
	return 0;
}
Stereopsis.P2D.prototype.voteClear = function(){
	this._votes = [];
}
this._votes = [];
Stereopsis.P2D.prototype.kill = function(){
	this._id = null;
	this._view = null;
	this._point2D = null;
	this._point3D = null;
	this._matches = null;
}
Stereopsis.P2D.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
Stereopsis.P2D.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
Stereopsis.P2D.prototype.point2D = function(point2D){
	if(point2D!==undefined){
		this._point2D = point2D;
	}
	return this._point2D;
}
Stereopsis.P2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
Stereopsis.P2D.prototype.size = function(size){
	if(size!==undefined){
		this._size = size;
	}
	return this._size;
}
Stereopsis.P2D.prototype.addMatch = function(match){
	if(match!==undefined){
		this._matches[match.index()] = match;
		return null;
	}
	return false;
}
Stereopsis.P2D.prototype.removeMatch = function(match){
	if(match!==undefined){
		if(match.viewA()==this._view || match.viewB()==this._view){
			var index = Stereopsis.indexFromObjectIDs(match.viewA(),match.viewB());
			this._matches[index] = null;
			delete this._matches[index];
			return true;
		}
	}
	return false;
}
Stereopsis.P2D.prototype.matchForView = function(view){
	var index = Stereopsis.indexFromObjectIDs(this._view,view);
	if(view==this._view){
		throw "don't supply known view, supply opposite view";
	}
	// console.log("index: "+index);
	var match = this._matches[index];
	if(match){
		return match;
	}
	return null;
}
Stereopsis.P2D.prototype.oppositePointForView = function(view){
	var match = this.matchForView(view);
	if(match){
		return match.oppositePoint(this);
	}
	return null;
}
Stereopsis.P2D.prototype.hasMatchView = function(view){
	var finalMatch = null;
	Code.forEach(this._matches, function(match, index){
		if(match.hasView(view)){
			finalMatch = match;
			return true;
		}
		return false;
	});
	return finalMatch;
}
Stereopsis.P2D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
Stereopsis.P2D.prototype.averageNCCError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorNCC();
	});
}
Stereopsis.P2D.prototype.averageSADError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorSAD();
	});
}
Stereopsis.P2D.prototype.averageFError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorF();
	});
}
Stereopsis.P2D.prototype.averageRError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorR();
	});
}
Stereopsis.P2D.prototype.neighborhood3DSize = function(info){
	var p3D = this._point3D.point();
	if(!p3D){
		throw "no valid p3d point"
	}
	var p2D = this._point2D;
	var view = this._view;
	var size3D = Stereopsis.World.neighborhood3DSize(view,p2D,p3D, info);
	return size3D;
}
Stereopsis.P2D.prototype.resetVotes = function(){
	this._votes = {};
	this._metrics = {};
}
Stereopsis.P2D.prototype.addVote = function(index,value){
	var votes = this._votes[index];
	if(!votes){
		votes = [];
		this._votes[index] = votes;
	}
	votes.push(value);
}
Stereopsis.P2D.prototype.metricsForViews = function(viewA,viewB){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	var metrics = this._metrics[index];
	if(!metrics){
		metrics = {"SAD":[],"NCC":[],"R":[],"F":[],"affine":[],"translate":[],"neighbors":[]};
		this._metrics[index] = metrics;
	}
	return metrics;
}
Stereopsis.P2D.prototype.voteForNeighbors = function(){
	// var mSAD = 2.0;
	// var mNCC = 2.0;
	// var mF = 2.0;
	// var mR = 2.0;
	// var mAff = 2.0;//1.5;
	// var mTra = 2.0;//1.5;
	var mSAD = 3.0;
	var mNCC = 3.0;
	var mF = 3.0;
	var mR = 3.0;
	var mAff = 3.0;//1.5;
	var mTra = 3.0;//1.5;
	var point3D = this._point3D;
	Code.forEach(this._metrics, function(value,index){
		var neighbors = value["neighbors"];
		var listSAD = value["SAD"];
		var listNCC = value["NCC"];
		var listR = value["R"];
		var listF = value["F"];
		var listAff = value["affine"];
		var listTra = value["translate"];
		// SAD
		var minSAD = Code.min(listSAD);
		var sigSAD = Code.stdDev(listSAD, minSAD);
		var limSAD = minSAD + sigSAD*mSAD;
		// NCC
		var minNCC = Code.min(listNCC);
		var sigNCC = Code.stdDev(listNCC, minNCC);
		var limNCC = minNCC + sigNCC*mNCC;
		// NCC
		var minR = Code.min(listR);
		var sigR = Code.stdDev(listR, minNCC);
		var limR = minNCC + sigR*mR;
		// NCC
		var minF = Code.min(listF);
		var sigF = Code.stdDev(listF, minF);
		var limF = minF + sigF*mF;
		// NCC
		var minAff = Code.min(listAff);
		var sigAff = Code.stdDev(listAff, minAff);
		var limAff = minAff + sigAff*mAff;
		// TRA
		var minTra = Code.min(listTra);
		var sigTra = Code.stdDev(listTra, minTra);
		var limTra = minTra + sigTra*mTra;
		// console.log("    SAD: "+minSAD+" +/- "+sigSAD);
		// console.log("    NCC: "+minNCC+" +/- "+sigNCC);
		// console.log("      F: "+minSAD+" +/- "+sigSAD);
		// console.log("      R: "+minNCC+" +/- "+sigNCC);
		// console.log("    AFF: "+minSAD+" +/- "+sigSAD);
		// console.log("    TRA: "+minNCC+" +/- "+sigNCC);
		// console.log(value.length);
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var nSAD = listSAD[i];
			var nNCC = listNCC[i];
			var nR = listR[i];
			var nF = listF[i];
			var nAff = listAff[i];
			var nTra = listTra[i];
			var vote = 1;
			if(nSAD>limSAD || nNCC>limNCC || nR>limR || nF>limF || nAff>limAff || nTra>limTra){
				vote = 0;
			}
			neighbor.addVote(index, vote);
		}
	});
}
Stereopsis.P2D.prototype.voteDrop = function(){
	var point3D = this._point3D;
	var anyDrop = false;
	Code.forEach(this._votes, function(value,index){
		var sum = Code.sum(value);
		var tot = value.length;
		if(tot>0){
			var p = sum/tot;
			if( (tot>=8 && p<0.75) || // 0.125
				(tot>=6 && p<0.60) || // 0.166
				(tot>=4 && p<0.50) || // 0.250
				(tot>=3 && p<0.34)    // 0.333
				){
				anyDrop = true;
				return true; // break
			}
		}
	});
	return anyDrop;
}

Stereopsis.P2D.prototype.neighbors3DCone = function(world, padding, limitDistanceNear, limitDistanceFar){
	padding = Code.valueOrDefault(padding, 1.0);
	limitDistanceNear = Code.valueOrDefault(limitDistanceNear, 0.25); // .1 - 0.5
	limitDistanceFar = Code.valueOrDefault(limitDistanceFar, 4.0); // 10 - 2
	// var isSameView = function(a){
	// 	return a.view()==view;
	// }
	var point2D = this;
	var point3D = point2D._point3D;
	var pointCenter3D = point3D.point();
	// var pointCenter2D = this.point2D();
	if(!pointCenter3D){
		return null;
	}

	var view = point2D._view;
	var space3D = world.pointSpace();
	var viewCenter = view.center();
	// seach a cone @ radius = 2 x sizeA
	var dirViewToPoint = V3D.sub(pointCenter3D,viewCenter);
	var distanceViewToPoint = dirViewToPoint.length();

	var size3D = point2D.neighborhood3DSize();
	var coneRadius = size3D*0.5*padding;
	var coneDirection = dirViewToPoint.copy()
	var coneLength = coneDirection.length();
		coneDirection.scale(limitDistanceFar);
	var coneRatio = coneRadius/coneLength;
	var coneCenter = viewCenter;
	var neighbors3D = space3D.objectsInsideCone(coneCenter,coneDirection,coneRatio);

	// TODO: limit neighbors by near distance limit - limitDistanceNear
	// console.log(neighbors3D);
	
	return neighbors3D;
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Match2D = function(pointA,pointB, point3D, affine, ncc, sad, others){
	this._id = Stereopsis.Match2D._ID++;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	this._inverse = null;
	this._ncc = null;
	this._sad = null;
	this._temp = null;
	// this._scaleAB = null;
	// this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._estimated3D = null;
	this._transform = null;
	this.point2DA(pointA);
	this.point2DB(pointB);
	this.point3D(point3D);
	this.affine(affine);
	this.errorNCC(ncc);
	this.errorSAD(sad);
}
Stereopsis.Match2D._ID = 0;
Stereopsis.Match2D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.Match2D.prototype.id = function(){
	return this._id;
}
Stereopsis.Match2D.prototype.kill = function(){
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	this._inverse = null;
	this._ncc = null;
	this._sad = null;
	this._estimated3D = null;
	this._transform = null;
	this._errorFAB = null;
	// this._errorFBA = null;
	this._errorRBA = null;
	// this._errorRAB = null;
}
Stereopsis.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
Stereopsis.Match2D.prototype.point2DA = function(point2DA){
	if(point2DA!==undefined){
		this._point2DA = point2DA;
	}
	return this._point2DA;
}
Stereopsis.Match2D.prototype.point2DB = function(point2DB){
	if(point2DB!==undefined){
		this._point2DB = point2DB;
	}
	return this._point2DB;
}
Stereopsis.Match2D.prototype.affine = function(affine){
	if(affine!==undefined){
		this._affine = affine;
		if(affine){
			if(!Code.isa(affine,Matrix2D)){
				this._affine = Matrix2D.fromMatrix(affine);
			}
			this._inverse = this._affine.copy().inverse();
			if(this._affine.a===undefined  || Code.isNaN(this._affine.a) || this._inverse.a===undefined  || Code.isNaN(this._inverse.a) ){
				console.log(this._affine);
				console.log(this._inverse);
				console.log(this);
				throw "bad affine";
			}
		}
	}
	return this._affine;
}
Stereopsis.Match2D.prototype.affineReverse = function(){
	return this._inverse;
}
Stereopsis.Match2D.prototype.affineForViews = function(viewA,viewB, affine){
	if(viewA==this.viewA() && viewB==this.viewB()){
		if(affine){
			this.affine(affine);
		}
		return this._affine;
	}else if(viewB==this.viewA() && viewA==this.viewB()){
		if(affine){ // is actually inverse
			affine = affine.copy().inverse()
			this.affine(affine);
		}
		return this._inverse;
	}
	return null;
}
Stereopsis.Match2D.prototype.transform = function(transform){
	if(transform!==undefined){
		this._transform = transform;
	}
	return this._transform;
}
Stereopsis.Match2D.prototype.viewA = function(){
	if(this._point2DA){
		return this._point2DA.view();
	}
	return null;
}
Stereopsis.Match2D.prototype.viewB = function(){
	if(this._point2DB){
		return this._point2DB.view();
	}
	return null;
}
Stereopsis.Match2D.prototype.oppositePoint = function(point2D){
	if(point2D==this._point2DA){
		return this._point2DB;
	}else if(point2D==this._point2DB){
		return this._point2DA;
	}
	return null;
}
Stereopsis.Match2D.prototype.oppositeView = function(view){
	if(view==this.viewA()){
		return this.viewB();
	}else if(view==this.viewB()){
		return this.viewA();
	}
	return null;
}
// Stereopsis.Match2D.prototype.estimated3D = function(estimated3D){
// 	if(estimated3D!==undefined){
// 		this._estimated3D = estimated3D;
// 	}
// 	return this._estimated3D;
// }
Stereopsis.Match2D.prototype.errorF = function(errorF){
	if(errorF!==undefined){
		this._errorFAB = errorF;
	}
	return this._errorFAB;
}
// Stereopsis.Match2D.prototype.errorR = function(errorR){
// 	if(errorR!==undefined){
// 		this._errorRAB = errorR;
// 	}
// 	return this._errorRAB;
// }
Stereopsis.Match2D.prototype.errorNCC = function(ncc){
	if(ncc!==undefined){
		this._ncc = ncc;
	}
	return this._ncc;
}
Stereopsis.Match2D.prototype.errorSAD = function(sad){
	if(sad!==undefined){
		this._sad = sad;
	}
	return this._sad;
}
Stereopsis.Match2D.prototype.range = function(range){
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
}
Stereopsis.Match2D.prototype.index = function(){
	return Stereopsis.indexFromObjectIDs(this._point2DA.view(),this._point2DB.view());
}
Stereopsis.Match2D.prototype.pointForView = function(view){ // get only
	if(view){
		if(this._point2DA && this._point2DA.view()==view){
			return this._point2DA;
		}
		if(this._point2DB && this._point2DB.view()==view){
			return this._point2DB;
		}
	}
	return null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.X = function(){
	//
}
Stereopsis.Y = function(){
	//
}
Stereopsis.Z = function(){
	//
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveGlobalAbsoluteTransform = function(completeFxn, completeContext, iterations){
	if(this._CALCULATE_PATCHES===undefined){
		this._CALCULATE_PATCHES = true;
	}
	if(this._CALCULATE_TRANSFORMS_FROM_MATCHES===undefined){
		this._CALCULATE_TRANSFORMS_FROM_MATCHES = false;
	}
// var views = this.toViewArray();
// for(var i=0; i<views.length; ++i){
// 	var view = views[i];
// 	console.log(view.image());
// }
	this._maxIterations = 2;
	iterations = iterations!==undefined ? iterations : 5;
// iterations = 9;
// iterations = 7;
// iterations = 5;
iterations = 3;
// iterations = 2;
// iterations = 1;
	this._completeFxn = completeFxn;
	this._completeContext = completeContext;
	this._maxIterations = iterations;
	this._currentIteration = 0;
	this._ticker = new Ticker(1);
	this._ticker.addFunction(Ticker.EVENT_TICK,this._tickSolveAbs,this);
	this._ticker.start();
}
Stereopsis.World.prototype._tickSolveAbs = function(){
	this._ticker.stop();
	this._iterationSolveAbs(this._currentIteration,this._maxIterations);
	this._currentIteration += 1;
	if(this._currentIteration==this._maxIterations){
// throw "don't save";
		if(this._completeFxn){
			this._completeFxn.call(this._completeContext);
		}
		this._ticker.stop();
	}else{
		this._ticker.start();
	}
}
Stereopsis.World.prototype.printPoint3DTrackCount = function(){
	var views = this.toViewArray();
	var totalViewCount = views.length;
	// var totalArrayCount = R3D.maxiumMatchesFromViewCount(totalViewCount) + 2;  // MATCH COUNT
	var totalArrayCount = totalViewCount + 1;
	var countList = Code.newArrayZeros(totalArrayCount);
	var points3D = this.toPointArray();
	var errors = Code.newArrayArrays(totalArrayCount);
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var pointCount = point3D.toPointArray().length;
		countList[pointCount]++;
		var error = point3D.globalErrorR();
		if(error!==undefined && error!==NaN){
			errors[pointCount].push(error);
		}
	}
	console.log(countList);
	for(var i=0; i<errors.length; ++i){
		var list = errors[i];
		if(list.length>0){
			var min = Code.min(list);
			var std = Code.stdDev(list,min);
			console.log("error "+i+" : "+min+" +/- "+std+"   ("+list.length+")");
		}
	}
}
Stereopsis.World.prototype.printErrorsDebugMatchCount = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorsLookup = {};
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			//var matchCount = point3D.matchCount();
			var viewCount = point3D.viewCount();
			var index = ""+viewCount;
			var errors = errorsLookup[index];
			if(!errors){
				errors = {"count":0, "errorF":0, "errorR":0, "errorN":0, "errorS":0, "match":viewCount};
				errorsLookup[index] = errors;
			}
			errors["count"] += 1;
			errors["errorR"] += match.errorR();
			errors["errorF"] += match.errorF();
			errors["errorN"] += match.errorNCC();
			errors["errorS"] += match.errorSAD();
		}
		console.log("   transform "+i+" ... "+transform.viewA().id()+" - "+transform.viewB().id());
		var keys = Code.keys(errorsLookup);
		for(var k=0; k<keys.length; ++k){
			var key = keys[k];
			var val = errorsLookup[key];
			var count = val["count"];
			var errorF = val["errorF"];
			var errorR = val["errorR"];
			var errorN = val["errorN"];
			var errorS = val["errorS"];
				errorF /= count;
				errorR /= count;
				errorN /= count;
				errorS /= count;
			console.log("  : "+key+"  R: "+errorR+" F: "+errorF+" N: "+errorN+" S: "+errorS+"  @ "+count);
		}
	}
}
/*
Stereopsis.World.prototype.testingIteration = function(){
	console.log("testingIteration");
	var view = this._views["0"];
	var space = view._pointSpace;
	var loc = new V2D(200,130);
	// var loc = new V2D(300,230);
	// var loc = new V2D(430,220);
	var rad = 40;
	// console.log(loc,rad);
	var objs = space.objectsInsideCircle(loc,rad);
	console.log(objs);
	//var image = view.image();
	var compareSize = 15;
	for(var i=0; i<objs.length; ++i){
		var p2d = objs[i];
		var p3d = p2d.point3D();
		var p2ds = p3d.toPointArray();
		var p0 = null;
		for(var j=0; j<p2ds.length; ++j){
			var p2 = p2ds[j];
			var p = p2.point2D();
			var v = p2.view();
			var image = v.image();
			// extract from affine
			var matrix = new Matrix(3,3).identity();
			if(j==0){
				p0 = p2;
			}else{ // display in-context transform
				var match = p3d.matchForViews(p0.view(),p2.view());
				var affine = match.affineForViews(p0.view(),p2.view());
				matrix = affine;
			}
			var needle = image.extractRectFromFloatImage(p.x,p.y,1.0,null,compareSize,compareSize, matrix);
			// var needle = image.extractRectFromFloatImage(cen2D.x,cen2D.y,2.0,null,compareSize,compareSize, matrix);
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(3.0);
			d.matrix().translate(60*i + 10, 80*j + 10);
			GLOBALSTAGE.addChild(d);
		}
		if(i>30){
			break;
		}
	}
}
*/


Stereopsis.World.prototype._testShowInitialImages = function(){
	var maxCount = 30;
	var points3D = this.toPointArray();
	// for(var k=0; k<points3D.length; ++k){
var cc = 0;
	for(var k=600; k<points3D.length; k+=25){
		var point3D = points3D[k];
		var views = point3D.toViewArray();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
console.log(k+" "+view.id()+" .. ");
			var image = view.image();
			var point2D = point3D.pointForView(view);
			//
//
			//
			if(!point2D){
				console.log(point3D);
				throw "what?"
			}
			//
//
			//
			var point = point2D.point2D();
			var compareSize = 49;
			var cellScale = 2;
			var needle = image.extractRectFromFloatImage(point.x,point.y,cellScale,null,compareSize,compareSize, null);
			//
//
			//
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(2.0);
			d.matrix().translate(10 + 100*cc, 0 + 100*i);
			GLOBALSTAGE.addChild(d);
			//
//
			//
		}
		++cc;

		--maxCount;
		if(maxCount==0){
			break;
		}
	}



	//
	//
	//
	// // var views = this.toViewArray();
	// // var viewA = vies[0]
	// var OFFX = 10;
	// var OFFY = 10;
	// var sca = 1.5;
	// var transforms = this.toTransformArray();
	// for(var i=0; i<transforms.length; ++i){
	// 	var transform = transforms[i];
	// 	console.log(transform);
	// 	var viewA = transform.viewA();
	// 	var viewB = transform.viewB();
	// 	var imageA = viewA.image();
	// 	var imageB = viewB.image();
	// 	var matches = transform.matches();
	// /*
	// var iii = imageA;
	// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// var d = new DOImage(img);
	// // d.matrix().scale(sca);
	// d.matrix().translate(OFFX + imageA.width()*i, OFFY + 0);
	// GLOBALSTAGE.addChild(d);
	//
	// var doA = d;
	//
	// var iii = imageB;
	// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// var d = new DOImage(img);
	// // d.matrix().scale(sca);
	// d.matrix().translate(OFFX + imageA.width()*i, OFFY + imageA.height());
	// GLOBALSTAGE.addChild(d);
	//
	// var doB = d;
	//
	// */
	// var maxCount = 25;
	// // var maxCount = 100;
	// var jj = 0;
	//
	// console.log(matches.length);
	// 	for(var j=0; j<matches.length; j+=25){
	// 		var match = matches[j];
	// 		// console.log(match);
	//
	// 		// var viewA = match.viewA();
	// 		// var viewB = match.viewB();
	// 		// var imageA = viewA.image();
	// 		// var imageB = viewB.image();
	//
	// 		var point2DA = match.point2DA();
	// 		var point2DB = match.point2DB();
	// 		var pA = point2DA.point2D();
	// 		var pB = point2DB.point2D();
	// /*
	// 		var d = new DO();
	//
	// 		d.graphics().setLine(1.0,0xCCFF0000);
	// 		d.graphics().beginPath();
	// 		d.graphics().drawCircle(pA.x,pA.y, 5);
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	//
	// 		d.graphics().setLine(1.0,0xCC0000FF);
	// 		d.graphics().beginPath();
	// 		d.graphics().drawCircle(pB.x,pB.y + imageA.height(), 5);
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	// 		d.graphics().setLine(1.0,0xCC00FF00);
	// 		d.graphics().beginPath();
	// 		d.graphics().moveTo(pA.x,pA.y);
	// 		d.graphics().lineTo(pB.x,pB.y + imageA.height());
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	// 		d.matrix().translate(OFFX + imageA.width()*i, OFFY);
	// 		GLOBALSTAGE.addChild(d);
	// */
	// // show matches on images
	//
	//
	// 		var zoom = 1.0;
	// 		var compareSize = 49;
	// 		var needleA = imageA.extractRectFromFloatImage(pA.x,pA.y,zoom,null,compareSize,compareSize, null);
	// 		var needleB = imageB.extractRectFromFloatImage(pB.x,pB.y,zoom,null,compareSize,compareSize, null);
	//
	// 		var iii = needleA;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(OFFX + 100*jj, OFFY + 200*i);
	// 		GLOBALSTAGE.addChild(d);
	//
	// 		var iii = needleB;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(OFFX + 100*jj, OFFY + 200*i + compareSize*sca);
	// 		GLOBALSTAGE.addChild(d);
	//
	// 		++jj;
	// 		--maxCount;
	// 		if(maxCount<0){
	// 			break;
	// 		}
	//
	// 	}
	// }
	//
	//
	// throw "... YEPPERS";

}

Stereopsis.World.prototype.probe2DF = function(){
	// TODO ...
	/*
		use pairs of transforms & F to find point  in other images ????

	*/
}

Stereopsis.World.prototype.patchResolveAffine = function(){
	var points3D = this.toPointArray();
	var withPatch = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch() && !point3D.hasPatchResolvedAffine()){
			withPatch.push(point3D);
		}
	}
	var dropList = [];
	for(var i=0; i<withPatch.length; ++i){
		var point3D = withPatch[i];
		point3D.hasPatchResolvedAffine(true);
		if(!this.patchResolveAffineSinglePoint3D(point3D)){
			dropList.push(point3D);
		}
	}
	console.log("patchResolveAffine - dropList: "+dropList.length+" / "+points3D.length);
	// for(var i=0; i<dropList.length; ++i){
	// 	var point3D = dropList[i];
	// 	this.disconnectPoint3D(point3D); // calls removePoint3D
	// 	this.killPoint3D(point3D);
	// }
}
Stereopsis.affinesFromPatch = function(point3D){
	// 3D locations:
	var pointCenter = point3D.point();
	if(!pointCenter){
		return null;
	}
	var pointSize = point3D.size();
	var pointUp = point3D.up();
	var pointRight = point3D.right();
		var dirRight = pointRight.copy().scale(pointSize);
		var dirUp = pointUp.copy().scale(pointSize);
	var center3D = pointCenter;
	var right3D = pointCenter.copy().add(dirRight);
	var up3D = pointCenter.copy().add(dirUp);
	var left3D = pointCenter.copy().sub(dirRight);
	var down3D = pointCenter.copy().sub(dirUp);
	// points
	var points2D = point3D.toPointArray();
	var projections2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		// project into all views
			var center2D = view.projectPoint3D(center3D);
			var right2D = view.projectPoint3D(right3D);
			var up2D = view.projectPoint3D(up3D);
			var left2D = view.projectPoint3D(left3D);
			var down2D = view.projectPoint3D(down3D);
			pList = [center2D,right2D,up2D,left2D,down2D];
		projections2D.push(pList);
	}
	var affines = [];
	// get affine for each pair
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
		var projA = projections2D[i];
		for(var j=i+1; j<points2D.length; ++j){
			var point2DB = points2D[j];
			var viewB = point2DB.view();
			var projB = projections2D[j];
			var affine = R3D.affineMatrixLinear(projA,projB);
			// remove translation:
			affine.set(0,2, 0);
			affine.set(1,2, 0);
			// add obejct
			affines.push({"viewA":viewA,"viewB":viewB, "affine":affine});
		}
	}
	return {"affines":affines};
}
Stereopsis.compareSizeForViews2D = function(viewA,pointA, viewB,pointB, log){
	throw "??? compareSizeForViews2D - how is this uzed "
	var minimumCompare = 5; // absolute minimum
	var featureSize = Math.max(viewA.compareSizeForPoint(pointA),viewB.compareSizeForPoint(pointB)); // cornerness
	var compare = Math.max(minimumCompare,featureSize);
	return compare;
}
Stereopsis.World.prototype.patchResolveAffineSinglePoint3D = function(P3D){
	var resolveByAverage = false;
	// get affines from patchs
	var info = Stereopsis.affinesFromPatch(P3D);
	if(!info){
		return;
	}
	var affines = info["affines"];
	var matches = [];
	// compare affine & existing
	var nccA, nccB, sadA, sadB, info;
	var invA, invB, tot;
	for(var i=0; i<affines.length; ++i){
		var affine = affines[i];
		var viewA = affine["viewA"];
		var viewB = affine["viewB"];
		var predicted = affine["affine"];
		var match = P3D.matchForViews(viewA,viewB);
		var existing = match.affineForViews(viewA,viewB);
		var isSimilar = Stereopsis.affineSimilar(existing,predicted);
		if(!isSimilar){
			return false;
		}
		matches.push(match);
	}
	// average affine from NCC scores & optimize
	for(var i=0; i<affines.length; ++i){
		var affine = affines[i];
		var match = matches[i];
		var viewA = affine["viewA"];
		var viewB = affine["viewB"];
		var pointA2D = match.pointForView(viewA);
		var pointB2D = match.pointForView(viewB);
		var pointA = pointA2D.point2D();
		var pointB = pointB2D.point2D();
		var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA, viewB,pointB);
		// var imageA = viewA.image();
		// var imageB = viewB.image();
		var imageA = viewA.imageScales();
		var imageB = viewB.imageScales();
		// get NCC scores
		info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,existing,compareSize);
		nccA = info["ncc"];
		sadA = info["sad"];
		// info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,predicted,compareSize);
		// nccB = info["ncc"];
		// sadB = info["sad"];
		if(resolveByAverage){
			invA = 1.0/nccA;
			invB = 1.0/nccB;
			tot = invA + invB;
			var percentA = invA/tot;
			var percentB = 1.0 - percentA;
			// initial average starting point
			var average = Code.averageAffineMatrices([existing,predicted],[percentA,percentB]);
			// nonlinear step
			// var optimum = Stereopsis.bestAffine2DFromLocation(average,viewA,pointA,viewB,pointB);
			var optimum = R3D.optimumAffineCornerTransform(imageA,pointA, imageB,pointB, affine, compareSize, 10);
			pointB.x += optimum.get(0,2);
			pointB.y += optimum.get(1,2);
			optimum.set(0,2, 0);
			optimum.set(1,2, 0);
			// SAVE:
			info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,optimum,compareSize);
			match.errorNCC(info["ncc"]);
			match.errorSAD(info["sad"]);
			match.affineForViews(viewA,viewB, average);
			console.log("COMPARE: "+nccA+" - "+nccB+" - "+info["ncc"]+" && "+( nccA>info["ncc"] && nccB>info["ncc"]));
		}else{ // choose better one
			if(nccA<nccB){ // existing - don't need to do - already set
				match.errorNCC(nccA);
				match.errorSAD(sadA);
				match.affineForViews(viewA,viewB, existing);
			}else{
				match.errorNCC(nccB);
				match.errorSAD(sadB);
				match.affineForViews(viewA,viewB, predicted);
			}
		}
	}
	return true;

}
Stereopsis.affineSimilar = function(affineA,affineB){ // ignores origin offsets
	// var maxScale = 1.5;
	// var maxRotation = Code.radians(30.0);
	// var maxInterrior = Code.radians(30.0);
	var maxScale = 2.0;
	var maxRotation = Code.radians(45.0);
	var maxInterrior = Code.radians(45.0);
	var o = new V2D(0,0);
	var x = new V2D(1,0);
	var y = new V2D(0,1);
	var oA = affineA.multV2DtoV2D(o);
	var xA = affineA.multV2DtoV2D(x);
	var yA = affineA.multV2DtoV2D(y);
	xA.sub(oA);
	yA.sub(oA);
	var oB = affineB.multV2DtoV2D(o);
	var xB = affineB.multV2DtoV2D(x);
	var yB = affineB.multV2DtoV2D(y);
	xB.sub(oB);
	yB.sub(oB);
	var lenXA = xA.length();
	var lenYA = yA.length();
	var lenXB = xB.length();
	var lenYB = yB.length();
	var scaleX = lenXA/lenXB;
	var scaleY = lenYA/lenYB;
	var scale = (lenXA+lenYA)/(lenXA+lenYA);
	scaleX = scaleX>=1.0 ? scaleX : 1.0/scaleX;
	scaleY = scaleY>=1.0 ? scaleY : 1.0/scaleY;
	scale = scale>=1.0 ? scale : 1.0/scale;
	//
	var angleXYA = V2D.angleDirection(xA,yA);
	var dirA = Code.averageAngleVector2D([xA.copy().norm(),yA.copy().norm()]);
	var angleXYB = V2D.angleDirection(xB,yB);
	var dirB = Code.averageAngleVector2D([xB.copy().norm(),yB.copy().norm()]);
	var rotation = V2D.angleDirection(dirA,dirB);
	var interrior = Math.abs(angleXYA-angleXYB);
	// console.log("COMP: "+Code.degrees(angleXYA)+" - "+Code.degrees(angleXYB))
	// compare
	if(scaleX>maxScale || scaleY>maxScale || scale>maxScale){
		// console.log("scale: "+scaleX+" | "+scaleY+" | "+scale+" | ");
		return false;
	}
	if(Math.abs(rotation)>maxRotation){
		// console.log("rotation: "+Code.degrees(rotation));
		return false;
	}
	if(interrior>maxInterrior){
		// console.log("interrior: "+Code.degrees(interrior));
		return false;
	}
	return true;
}
Stereopsis.World.prototype.testAffineTransforms = function(){
console.log("testAffineTransforms");
	var points3D = this.toPointArray();
	var withPatch = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			withPatch.push(point3D);
		}
	}
	console.log(withPatch.length);
	var withPatch = Code.randomSubsetFromArray([], 15, withPatch);
	console.log(withPatch);
	var maxCount = Math.min(50, withPatch.length);
	// var index = 0;
	for(var index=0; index<maxCount; ++index){
		var point3D = withPatch[index];
		// 3D locations:
			var pointCenter = point3D.point();
			var pointSize = point3D.size();
			var pointUp = point3D.up();
			var pointRight = point3D.right();
				var dirRight = pointRight.copy().scale(pointSize);
				var dirUp = pointUp.copy().scale(pointSize);
			var center3D = pointCenter;
			var right3D = pointCenter.copy().add(dirRight);
			var up3D = pointCenter.copy().add(dirUp);
			var left3D = pointCenter.copy().sub(dirRight);
			var down3D = pointCenter.copy().sub(dirUp);

		// points
		var points2D = point3D.toPointArray();
		// console.log(points2D);
		var projections2D = [];
		var count = 0;
		for(var i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var view = point2D.view();

			// project into all views
				var center2D = view.projectPoint3D(center3D);
				var right2D = view.projectPoint3D(right3D);
				var up2D = view.projectPoint3D(up3D);
				var left2D = view.projectPoint3D(left3D);
				var down2D = view.projectPoint3D(down3D);
				pList = [center2D,right2D,up2D,left2D,down2D];
			projections2D.push(pList);
		}
		console.log("=> "+index+"");
		// transforms
		for(var i=0; i<points2D.length; ++i){
			var point2DA = points2D[i];
			var viewA = point2DA.view();
			var projA = projections2D[i];
			// get affine for each
			for(var j=i+1; j<points2D.length; ++j){
				var point2DB = points2D[j];
				var viewB = point2DB.view();
				var projB = projections2D[j];
				var affine = R3D.affineMatrixLinear(projA,projB);
				// remove translation:
				affine.set(0,2, 0);
				affine.set(1,2, 0);
				//
				var match = point3D.matchForViews(viewA,viewB);
				var existing = match.affineForViews(viewA,viewB);
				console.log(" : "+i+"-"+j+": = "+match.errorNCC());
				var average = Code.averageAffineMatrices([existing,affine]);
				var s = 25;
				var square = [];
					square.push(new V2D(-s,-s));
					square.push(new V2D( s,-s));
					square.push(new V2D( s, s));
					square.push(new V2D(-s, s));

				var identity = new Matrix(3,3).identity();
				var trans = [identity,existing,affine,average];
				var colors = [0xFF000000,0x99FF0000,0x990000FF, 0xFF339933];
				var OFFY = 100 + (i + j-1)*100;
				var OFFX = 100 + 200*index;
				for(var t=0; t<trans.length; ++t){
					var mat = trans[t];
					// console.log(mat+"");
					var col = colors[t];
					// draw
					var d = new DO();
					d.graphics().setLine(1.0,col);
					d.graphics().beginPath();

					for(var k=0; k<square.length; ++k){
						var squ = square[k];
						var p = mat.multV2DtoV2D(squ);
						if(k==0){
							d.graphics().moveTo(p.x,p.y);
						}else{
							d.graphics().lineTo(p.x,p.y);
						}
					}
					d.graphics().endPath();
					d.graphics().strokeLine();
					d.matrix().translate(OFFX,OFFY);
					GLOBALSTAGE.addChild(d);
				}
				// TODO: SHOW ACTUAL IMAGES TO SEE HOW ACCURATE IT IS:
				var imageA = viewA.image();
				var imageB = viewB.image();
				var compareSize = 41;
				var pntA = point2DA.point2D();
				var pntB = point2DB.point2D();

				var optSize = Stereopsis.compareSizeForViews2D(viewA,pntA,viewB,pntB, true);
				var zoom = optSize/compareSize;
				// zoom = 1.0/zoom;
				// console.log(optSize+" : "+zoom+" / "+viewA.compareSize());
				// var zoom = 1.0;


				var needleA = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, existing);
				var needleC = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, affine);
				var needleZ = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, average);
				var needleB = imageB.extractRectFromFloatImage(pntB.x,pntB.y,zoom,null,compareSize,compareSize, null);

				needleA.to01();
				needleB.to01();
				needleC.to01();
				needleZ.to01();


				var sca = 1.0;
					var iii = needleB;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 50, OFFY);
					GLOBALSTAGE.addChild(d);

					var iii = needleA;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 100, OFFY + 0);
					GLOBALSTAGE.addChild(d);

					var iii = needleC;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 100, OFFY + 50);
					GLOBALSTAGE.addChild(d);

					var iii = needleZ;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 150, OFFY + 0);
					GLOBALSTAGE.addChild(d);
			var similar = Stereopsis.affineSimilar(existing,affine);
			// console.log(similar)
			}
		}
	}
	throw "..."
}
Stereopsis.World.prototype.testDisplayMatches = function(){
	var points3D = this.toPointArray();
	console.log("testDisplayMatches: "+points3D.length); // 1453
	var index = 1100;
	// bad: 30 100 110 800 900
	// por: 90
	// god: 500
	var point3D = points3D[index];
	var points2D = point3D.toPointArray();
	console.log(points2D);
	var count = 0;
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
		var imageA = viewA.image();
		var matches = point2DA.toMatchArray();
		var sca = 2.0;
		var squ = 50;
		var spa = 10.0;
		var matrix = null;

		var p2DA = point2DA.point2D();

		// SHOW POINT BY ITSELF
		var img = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,1.0,null,squ,squ, null);
		console.log(img.range());
		var iii = img;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + (sca*squ + spa)*i, 10);
		GLOBALSTAGE.addChild(d);



		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var viewB = match.oppositeView(viewA);
			var imageB = viewB.image();
			var point2DB = match.pointForView(viewB);
			var p2DB = point2DB.point2D();

			var siz = 21;

			// show matching:
			var img = imageB.extractRectFromFloatImage(p2DB.x,p2DB.y,1.0,null,squ,squ, null);
			// console.log(img.range());
			var iii = img;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(10 + (sca*squ + spa)*i, 10 + (sca*squ + spa)*(j*2+1));
			GLOBALSTAGE.addChild(d);


			// show in context
			matrix = match.affineForViews(viewA,viewB);
			var img = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,1.0,null,squ,squ, matrix);
			// console.log(img.range());
			var iii = img;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(10 + (sca*squ + spa)*i, 10 + (sca*squ + spa)*(j*2+1+1));
			GLOBALSTAGE.addChild(d);

			++count;
		}
	}
	throw "...";
}
Stereopsis.World.prototype.copyPoint3DToMatchEstimates = function(points){
	points = point!==undefined ? points : this.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		point.copyAbsoluteLocationToMatches();
	}
}
Stereopsis.World.prototype.updatePoints3DErrors = function(points3D){ // set match errors to allow P3D aggregation of average error
	var world = this;
	points3D = points3D!==undefined ? points3D : world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			Stereopsis.updateErrorForMatch(match);
		}
		point3D.calculateAbsoluteLocationDLT(world);
	}
}
Stereopsis.World.prototype.updatePoints3DNullLocations = function(points3D){
	var world = this;
	points3D = points3D!==undefined ? points3D : world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.point()){
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				Stereopsis.updateErrorForMatch(match);
			}
			// point3D.calculateAbsoluteLocation(this);
			point3D.calculateAbsoluteLocationDLT(world);
		}
	}
}
Stereopsis.World.prototype.dropPoint3DNull = function(){
	var points3D = this.toPointArray();
	var count = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.point()){
			count++;
		}
	}
	console.log("dropPoint3DNull: "+count+" / "+points3D.length);
}
Stereopsis.World.prototype.checkTransformMatches = function(){
	var world = this;
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();

		// var sigmaR = transform.rSigma();
		// var meanR = transform.rMean();
		// if(sigmaR===undefined || meanR===undefined){
		// 	console.log(transform);
		// 	console.log(sigmaR);
		// 	console.log(meanR);
		// 	throw "undefined";
		// }

		var fDistances = [];
		var orderedPoints = [];
		// var include = true;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var point3D = match.point3D();
			if(!pointA || !pointB || !point3D){
				console.log(transform);
				console.log(match);
				console.log(viewA);
				console.log(viewB);
				throw "no point";
			}
		}
	}
}
/*
Stereopsis.World.prototype.relativeTransformsFromAbsoluteTransforms = function(){
	// console.log("SAME? AS: copyRelativeTransformsFromAbsolute")
	this.copyRelativeTransformsFromAbsolute();
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relative = Stereopsis.relativeTransformFromViews(viewA,viewB);
		transform.R(viewA,viewB,relative);
	}
}
*/
Stereopsis.World.prototype.relativeFFromSamples = function(transform){
	var transforms = [];
	if(transform){
		transforms.push(transform);
	}else{
		transforms = this.toTransformArray();
	}
	for(var i=0; i<transforms.length; ++i){
		console.log("relativeFFromSamples : "+i+" / "+transforms.length);
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var info = Stereopsis.ransacTransformF(transform,null,true, true);
		var F = info["F"];
		if(F){
			transform.F(viewA,viewB,F);
			// transform.calculateErrorF();
		}
	}
}
Stereopsis.World.prototype.relativeFfromR = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var matches = transform.matches();
		var R = transform.R(viewA,viewB);
		var Ka = viewA.K();
		var Kb = viewB.K();
		var F = R3D.fundamentalFromCamera(R, Ka, Kb);
		transform.F(viewA,viewB,F);
	}
}
Stereopsis.relativeTransformFromViews = function(viewA,viewB){
	return R3D.relativeTransformMatrix2(viewA.absoluteTransform(),viewB.absoluteTransform());
	// return R3D.relativeTransformMatrixInvAAbsB(viewA.absoluteTransformInverse(),viewB.absoluteTransform());
}
Stereopsis.World.prototype.refinePoint3DAbsoluteLocation = function(points, maxIterations){ // nonlinear P3D location optimization
	console.log("refinePoint3DAbsoluteLocation");
	var world = this;
	if(!points){
		points = world.toPointArray();
 	}
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		world.bundleAdjustPoint(point, maxIterations);
		if(i>0 && i%10000==0){
			console.log(i+"/"+points.length);
		}
	}
}
Stereopsis.World.prototype.bundleAdjustPoint = function(point, maxIterations){
	var world = this;
throw "what is this"
	maxIterations = maxIterations!==null && maxIterations!==undefined ? maxIterations : 10;
	var point3D = point.point();
	if(point3D){
		var points2D = [];
		var intrinsics = [];
		var inverses = [];
		var extrinsics = [];
		var p2Ds = point.toPointArray();
		for(var i=0; i<p2Ds.length; ++i){
			var p2D = p2Ds[i];
			var view = p2D.view();
			points2D.push(p2D.point2D());
			intrinsics.push(view.K());
			inverses.push(view.Kinv());
			extrinsics.push(view.absoluteTransform());
		}
		var result = R3D.BundleAdjustPoint3D(point3D, points2D, intrinsics, inverses, extrinsics, maxIterations);
		var location = result["point"];
		world.updatePoint3DLocation(point,location);
	}
}
Stereopsis.World.prototype.refineCameraAbsoluteOrientationSubset = function(minimumPoints, maxIterations){
	throw "pick lowest error subset of points (also of highest connectivity degree) to do calculations on"
}
Stereopsis.World.prototype.refineSelectCameraAbsoluteOrientation = function(viewsChange, minimumPoints, maxIterations){
	var views = this.toViewArray();
	Code.removeDuplicates(views,viewsChange);
	this._refineCameraAbs(viewsChange, views, minimumPoints, maxIterations);
}


Stereopsis.World.prototype.recordViewAbsoluteOrientationStart = function(){
	// each view 3D record where it was
	var world = this;
	var views = world.toViewArray();
	var viewTransforms = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		viewTransforms[view.id()] = view.absoluteTransform().copy();
	}
	world._viewOrientations = viewTransforms;
}
Stereopsis.World.prototype.updateP3DPatchesFromAbsoluteOrientationChange = function(){ // each P3D update patch based on average view change
	var world = this;
	var viewTransforms = world._viewOrientations;
	var views = world.toViewArray();
	var transformInfo = {};
	// transformInfo
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var isExtrinsic = view.absoluteTransform();
		var isAbsolute = view.absoluteTransformInverse();
		var wasExtrinsic = viewTransforms[viewID];
		var wasAbsolute = Matrix.inverse(wasExtrinsic);
		var delta = Matrix.relativeWorld(wasAbsolute,isAbsolute);
		var info = {};
			info["prev"] = {"extrinsic":wasExtrinsic, "absolute":wasAbsolute};
			info["next"] = {"extrinsic":isExtrinsic,  "absolute":isAbsolute};
			info["delta"] = delta;
		transformInfo[viewID] = info;
	}
	world._viewOrientations = null;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var location3D = point3D.estimated3D();
		var wasLocation = point3D.point();
		world.updatePoint3DLocation(point3D,location3D);
		if(point3D.hasPatch()){
			world.updateP3DPatchFromMode(point3D, wasLocation, transformInfo);
		}else{
			console.log("no patch")
		}
	}
}


Stereopsis.World.prototype.refineCameraPairRelativeToAbsolute = function(transform, iterations, behindIsBad){
	iterations = Code.valueOrDefault(iterations, 500);
	behindIsBad = Code.valueOrDefault(behindIsBad, false);
	console.log("refineCameraPairRelativeToAbsolute");
	var I = new Matrix(4,4).identity();
	var B = transform.R();
	var pointsA = [];
	var pointsB = [];
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var matches = transform.matches();
	var Ka = viewA.K();
	var KaInv = viewA.Kinv();
	var Kb = viewB.K();
	var KbInv = viewB.Kinv();
	// pick random subset:
	var maximumPointCount = 400; // 100 - 1000
	if(matches.length>maximumPointCount){
		matches = Code.randomSampleRepeatsMaximum(matches,maximumPointCount,maximumPointCount);
	}
	// TODO: could pick best subset? -- lowest match R error sigma < 1.0
	console.log("matches: "+matches.length);
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var p2DA = match.pointForView(viewA);
		var p2DB = match.pointForView(viewB);
		var pA = p2DA.point2D();
		var pB = p2DB.point2D();
		pointsA.push(pA);
		pointsB.push(pB);
	}
	var result = R3D.transformCameraExtrinsicNonlinear(B, pointsA, pointsB, Ka,KaInv, Kb,KbInv,  iterations, behindIsBad);
	console.log(result);
	var P = result["P"];
	// set relative and absolute
	transform.R(P);

	// ... how to combine with groups ?
	viewA.absoluteTransform(I);
	viewB.absoluteTransform(P);
}


Stereopsis.World.prototype.refineCameraAbsoluteOrientation = function(minimumPoints, maxIterations, higherOrderPoints){
	var views = this.toViewArray();
	this._refineCameraAbs(views, [], minimumPoints, maxIterations, higherOrderPoints);
}
Stereopsis.World.prototype._refineCameraAbs = function(viewsChange, viewsConstant, minimumPoints, maxIterations, higherOrderPoints){ // get updated camera positions with less error
	var result = this.bundleAdjustViews(viewsChange, viewsConstant, minimumPoints, maxIterations, null, higherOrderPoints);
	var extrinsics = result["extrinsics"];
	for(var i=0; i<viewsChange.length; ++i){
		var view = viewsChange[i];
		var ext = extrinsics[i];
		view.absoluteTransform(ext);
	}
	// this.copyRelativeTransformsFromAbsolute();
}

Stereopsis.World.prototype.absoluteOrientationGraphSolve = function(){
	console.log("absoluteOrientationGraphSolve");

	var edges = [];
	var minMatches = 16;

	var lookupView = {};
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		lookupView[view.id()+""] = view;
	}
	// get useful edges -- ASSUMING FULLY CONNECTED SET ...
	var transforms = this.toTransformArray();
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		var matchCount = matches.length;
		if(matchCount>=minMatches){
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var indexA = viewA.id();
			var indexB = viewB.id();
			var error = (transform.rMean() + transform.rSigma())/matchCount;
// error = 1.0;
			// var extrinsicAtoB = transform.R();
			var extrinsicAtoB = transform.R(viewA,viewB);
			var relativeAtoB = Matrix.inverse(extrinsicAtoB);
// var relativeAtoB = extrinsicAtoB;
			edges.push([indexA,indexB,relativeAtoB,error]);
		}
	}
	console.log(edges);
	// find solution
	var result = R3D.optimumTransform3DFromRelativePairTransforms(edges, 50);
	var absolutes = result["absolute"];
	// from camera to extrinsic
	var extrinsics = [];
	for(var i=0; i<absolutes.length; ++i){
		var absolute = absolutes[i];
		var extrinsic = Matrix.inverse(absolute);
		var view = lookupView[i+""];
		// var centerA = view.center();
		// view.absoluteTransform(extrinsic);
		// var centerB = view.center();
		// console.log(" view: "+i+" : "+V3D.distance(centerB,centerA));
	}
}

Stereopsis.World.prototype.copyRelativeTransformsFromAbsolute = function(){
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			transform.copyRelativeFromAbsolute();
		}
	}
}
Stereopsis.averageMatrixEstimates = function(matrixes, errors){ // average location offset, twist, orientation of matrices
	if(matrixes.length>0){
		var percents = Code.errorsToPercents(errors);
		percents = percents["percents"];
		return Code.averageMatrices3D(matrixes, percents);
	}
	return null;
}
// Stereopsis.World.prototype.bundleAdjustViewPair = function(viewA,viewB){ // where viewB should be using viewA + relative tansform points
// throw "is this used?"
// 	var result = this.bundleAdjustViews([viewA,viewB]);
// 	var error = result["error"];
// 	var extrinsics = result["extrinsics"];
// 	var absA = extrinsics[0];
// 	var absB = extrinsics[1];
//
// 	var relAtoB = R3D.relativeTransformMatrix2(absA,absB);
// 	// var relAtoB = R3D.relativeTransformMatrix(absA,absB);
// 	return {"relative":relAtoB, "error":error};
// }
Stereopsis.World.prototype.setNegativeZErrors = function(shouldBe){
	if(shouldBe){
		this._countNegativeZErrors = 1E9;
	}else{
		this._countNegativeZErrors = 0;
	}
}
Stereopsis.World.prototype.bundleAdjustViews = function(viewsChange, viewsConstant, minimumPoints, maxIterations, maximumPoints3D, higherOrderPoints){
var countNegativeZErrors = Code.valueOrDefault(this._countNegativeZErrors,0);
	console.log("bundleAdjustViews start ...................................................................");
	maximumPoints3D = maximumPoints3D!==undefined && maximumPoints3D!==null ? maximumPoints3D : 1000;
	maxIterations = maxIterations!==undefined && maxIterations!==null ? maxIterations : 50;
	var allViews = Code.copyArray(viewsChange);
	Code.arrayPushArray(allViews,viewsConstant);
	var viewCount = allViews.length;
	var changeCount = viewsChange.length;
	var Ps = [];
	var Ks = [];
	var Is = [];
	var P2s = [];
	var K2s = [];
	var I2s = [];
	var pairPoints2D = [];
	var pairPoints3D = [];
	var totalPointsReferenced = 0;
	for(var i=0; i<viewCount; ++i){
		var viewA = allViews[i];
		var Ka = viewA.K();
		var KaInv = viewA.Kinv();
		var Pa = viewA.absoluteTransform();
		if(i<changeCount){
			Ps.push(Pa);
			Ks.push(Ka);
			Is.push(KaInv);
		}else{
			P2s.push(Pa);
			K2s.push(Ka);
			I2s.push(KaInv);
		}
		if(!Pa){
			throw "this probably needs to be set";
			continue;
		}
		for(var j=i+1; j<viewCount; ++j){
			var viewB = allViews[j];
			var transform = this.transformFromViews(viewA,viewB);
			var matches = transform.matches();
			var points2DA = [];
			var points2DB = [];
			var points3D = [];
			var points2D = [points2DA,points2DB];
			pairPoints2D.push(points2D);
			pairPoints3D.push(points3D);
			for(var k=0; k<matches.length; ++k){
				var match = matches[k];
				var point2DA = match.pointForView(viewA);
				var point2DB = match.pointForView(viewB);
				var point3D = match.point3D(); // absolute position
				var v3D = point3D.point();
				if(v3D){
					var usePoint = true;
					if(higherOrderPoints){
						// console.log(point3D.point2DCount());
						// throw "???";
						if(point3D.point2DCount()>2){
							usePoint = true;
						}else{
							usePoint = false;
						}
					}
					if(usePoint){
						points2DA.push(point2DA.point2D());
						points2DB.push(point2DB.point2D());
						points3D.push(v3D);
					}
				}else{
					throw "no point3D";
				}
			}
			// if(points3D.length!=matches.length){
			// 	throw "unequal: "+points3D.length+" & "+matches.length;
			// }
			if(points3D.length>maximumPoints3D){ // maximum points > subsampling
				// console.log("SUB INDEX POP: "+points3D.length+"/"+maximumPoints3D);
				// sort by reprojection error => keep best ?
				// console.log(points3D.length);
				Code.randomPopParallelArrays([points3D,points2DA,points2DB],maximumPoints3D);
				// console.log(points3D.length);
				// throw "SA?ME?"
			}
			totalPointsReferenced += points3D.length;
		}
	}
	// console.log(Ps,P2s);
	// console.log(pairPoints2D,pairPoints3D);
	if(totalPointsReferenced==0){
		console.log(totalPointsReferenced);
		console.log(Ks,Is,Ps, pairPoints2D, pairPoints3D, maxIterations, K2s,I2s,P2s);
		console.log(higherOrderPoints);
		throw "? totalPointsReferenced";
	}
	console.log("bundleAdjustViews end ................................................................... "+totalPointsReferenced);

	var result = R3D.BundleAdjustCameraExtrinsic(Ks,Is,Ps, pairPoints2D, pairPoints3D, maxIterations, K2s,I2s,P2s,  countNegativeZErrors);
	return result;
}
/*
Stereopsis.World.prototype.averagePoints3DFromMatches = function(onlyNull){ // average match locations into final averaged location
	// throw "use - averagePoints3DFromMatches | estimate3DPoints for calculateAbsoluteLocation" // ...
	throw "don't use this"
	onlyNull = onlyNull!==undefined ? onlyNull : false;
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(onlyNull && point3D.point()){
			continue;
		}
		point3D.calculateAbsoluteLocationDLT(world);
	}
}

Stereopsis.World.prototype.updateAbsoluteLocationsPoint3D = function(){ // 
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// if(onlyNull && point3D.point()){
		// 	continue;
		// }
		point3D.calculateAbsoluteLocationDLT(world);
	}
}

Stereopsis.World.prototype.points3DFromDLT = function(onlyNull){
	onlyNull = onlyNull!==undefined ? onlyNull : false;
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(onlyNull && point3D.point()){
			continue;
		}
		point3D.calculateAbsoluteLocationDLT(world);
	}
}
Stereopsis.World.prototype.initPoints3DLocation = function(points3D){
	var world = this;
	if(!points3D){
		points3D = world.toPointArray();
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var location3D = point3D.calculateAbsoluteLocationDLT(world, true);
		point3D.point(location3D);
	}
}
*/

Stereopsis.World.prototype.patchInitOrUpdate = function(limit, init, update){
console.log("patchInitOrUpdate");
	init = init!==undefined ? init : true;
	update = update!==undefined ? update : true;
	var points3D = this.toPointArrayLocated();
	// best corners / NCC / SAD / ... first
	console.log("SORT CORNER SCORES ...");
	for(var i=0; i<points3D.length; ++i){
		points3D[i].tempPatchPriority();
	}
	// points3D.sort(function(a,b){
	// 	return a.temp() < b.temp() ? 1 : -1;
	// });
	points3D.sort(function(a,b){
		return a.temp() < b.temp() ? -1 : 1;
	});
	// reset TEMP values
	for(var i=0; i<points3D.length; ++i){
		points3D[i].temp(null);
	}
	// thru list
	var pointCount = points3D.length;
	var count = pointCount;
	if(limit){
		count = Math.min(limit,count);
	}
	for(var i=0; i<pointCount; ++i){
		if(i%100==0){
			console.log(i+" / "+count+" / "+points3D.length);
		}
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			if(update){
				this.updateP3DPatch(point3D);
				--count;
			}
		}else{
			if(init){
				this.initialEstimatePatch(point3D);
				--count;
			}
		}
		if(count<=0){
			break;
		}
	}
}
Stereopsis.World.prototype.patchInitOnly = function(limit){
	this.patchInitOrUpdate(limit, true, false);
}
Stereopsis.World.prototype.patchUpdateOnly = function(limit){
	this.patchInitOrUpdate(limit, false, true);
}


Stereopsis.World.prototype.searchCornerSeeds = function(){ // create feature seeds only knowing R
	var world = this;
	var transforms = world.toTransformArray();
	var transforms = this.toTransformArray();
	console.log("searchCornerSeeds: "+transforms.length);
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		// var views = world.toViewArray();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// get list of corner candidates, spaced out 1 per cell size for each view [1000-10000 pts]
		// extract each corner @ cell size for comparrision
		//		zoomed out 2*cell w/ mild blur
		// 		get cell's average center color
		//		get cell color histogram
		//		get projected backwards 3D ray
		// for each viewA
		// 		for each corner
		//			get projected line in viewB
		//			search for points along line +/- sigma ([1-5] pixels)	[1% ~ 10-100 pts]
		//				any way to further limit candidates?	[5-50 pts] -- just pick top 10?
		//					- average color distance?
		//					- color histogram?
		//			for each candidate
		//				get midpoint of projected 3D rays
		//				get normal, up, size of patch
		//				get affine transform between views
		//				extract candidate bug
		//				get SAD / NCC / SIFT score, keep top 1~10 ?
		//
		// keep matches where top candidates match
		//
		// RUNTIME: [1000-10000]*[2]*[5-50] = 10000 - 1000000 extractions
		// AVERAGE % of candidates per image: [2*r*R]/[pi*R*R] = r*0.6/R | EG: [1px-5px]/500px = [0.002-0.01] | @10000 = [20-100]
		// histogram comparrison -- bucket [9x9=81 | 11x11=121] into [255/10] = 10~25 buckets  [3x5x17] ... 15,17 buckets
		// 	 paper on better pixel comparrisons .... ?
		// 		1D NCC or SAD
	}

	return {"pointsA":pointsA,"pointsB":pointsB};
}


Stereopsis.World.prototype.searchPoints2DBestMatch = function(){ // find better 2d matches using affines
// return;

var count = 0;
	var points3D = this.toPointArray();
	console.log("searchPoints2DBestMatch UPDATED: "+points3D.length);
var dists = [];
var dropList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var best2D = [];
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var viewA = point2DA.view();
			var p2DA = point2DA.point2D();
			best2D.push(p2DA);
			for(var k=j+1; k<points2D.length; ++k){
				var point2DB = points2D[k];
				var p2DB = point2DB.point2D();
				var viewB = point2DB.view();
				var match = point3D.matchForViews(viewA,viewB);
				var affine = match.affineForViews(viewA,viewB);
				// var affine = match.affineForViews(viewB,viewA);
				var result = this.bestAffine2DFromLocation(affine,p2DA,p2DB, p2DA, viewA,viewB, false, true);
				var bestB = result["B"];
				// var optimum = result["affine"];
				// match.affine(optimum);
				var dist = V2D.distance(bestB,p2DB);
				dists.push(dist);
				best2D.push(bestB);
				var compareSize = Stereopsis.compareSizeForViews2D(viewA,p2DA,viewB,p2DB);
				var maxDistance = compareSize * 0.5;
				maxDistance = 1.0;
if(dist>maxDistance){ // what to use ?
	best2D = null;
	break;
}
/*
				// var bestB = p2DB;
				// dists.push(0);
				// best2D.push(bestB);
// if(dist<1){
if(true){
	var pointA = p2DA;
	var pointB = p2DB;
	var sizeCompare = 21;
	var scale = 0.50;
	var sss = 3.0;
	var imgA = viewA.image().extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, affine);
	var imgB = viewB.image().extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);



	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + sss*sizeCompare*count, 10);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare);
	GLOBALSTAGE.addChild(d);

	var n = match.errorNCC();
	var s = match.errorSAD();

	var t = Code.scientificNotation(n,3,false)
	var d = new DOText(""+t, 10, DOText.FONT_ARIAL, 0xFFCC0033, DOText.ALIGN_LEFT);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare*3);
	GLOBALSTAGE.addChild(d);

	var t = Code.scientificNotation(s,3,false)
	var d = new DOText(""+t, 10, DOText.FONT_ARIAL, 0xFF000099, DOText.ALIGN_LEFT);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare*4);
	GLOBALSTAGE.addChild(d);

	++count;

	if(count>50){
		i = points3D.length; // break
	}
}
*/
			}
			break;
		}
		if(best2D){
			for(var j=0; j<points2D.length; ++j){
				var point2D = points2D[j];
				var view = point2D.view();
				var best = best2D[j];
				// remove - change - readd
				view.removePoint2D(point2D);
				point2D.point2D(best);
				view.insertPoint2D(point2D);
			}
		}else{
			// this.removePoint3D();
			this.disconnectPoint3D(point3D);
			this.killPoint3D(point3D);
		}
	}
// TODO: SHOW THESE?
dists.sort(function(a,b){
	return a < b ? -1 : 1;
});
// console.log(dists);
Code.printMatlabArray(dists);
// 	throw "sup";

	var points3D = this.toPointArray();
	console.log(points3D.length);
}
// Stereopsis.World._TEMP_PATCH_VS = [new V2D(),new V2D(),new V2D(),new V2D(),new V2D(), new V3D()];
// Stereopsis.World.prototype.patchInitBasicSphere = function(doMatches, points3D, updateOnly){ // estimate patch using only geometry [no images]
// 	points3D = points3D!==undefined && points3D!==null ? points3D : this.toPointArrayLocated();
// 	// estimate normal & up - from view anti-normal
// 	var temp = Stereopsis.World._TEMP_PATCH_VS;
// 	var center2D = temp[0];
// 	var up2D = temp[1];
// 	var dn2D = temp[2];
// 	var lf2D = temp[3];
// 	var ri2D = temp[4];
// 	var temp3D = temp[5];
// 	for(var i=0; i<points3D.length; ++i){
// 		var point3D = points3D[i];
// 		if(updateOnly && point3D.hasPatch()){
// 			continue;
// 		}
// 		var p3D = point3D.point();
// 		var info = Stereopsis.estimateP3DNormalFromViews(point3D);
// 		if(!info){
// 			console.log("bad point");
// 			console.log(point3D);
// 			continue;
// 		}
// 		var normal = info["normal"];
// 		var up = info["up"];
// 		point3D.normal(normal);
// 		point3D.up(up);
// 		var points2D = point3D.toPointArray();
// 		var distances = [];
// 		var pts = [];
// 		var sizes = [];
// 		for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
// 			var point2D = points2D[j];
// 			var pnt2D = point2D.point2D();
// 			var view = point2D.view();
// 			var viewNormal = view.normal();
// 			var maxPatchSize = view.cellSize();
// 			throw "use compare size";
// /*
// 			// BASE PATCH SIZE ON NEIGHBORHOOD -- if cell size: then unintended collisions
// 				var neighborhoodCount = 3 + 1;
// 				var space = view.pointSpace(pnt2D,neighborhoodCount);
// 				var neighbors = space.kNN(pnt2D, neighborhoodCount);
// 				patchSize = 0;
// 				var patchCount = 0;
// 				for(var n=0; n<neighbors.length; ++n){
// 					var neighbor = neighbors[n];
// 					if(neighbor!=point2D){
// 						++patchCount;
// 						patchSize += V2D.distance(pnt2D,neighbor.point2D()); // half sizes
// 					}
// 				}
// if(debug){
// 	console.log("patchCount: "+patchCount);
// }
// 				if(patchCount==0){
// 					patchCount = 1;
// 					patchSize = maxPatchSize;
// 				}else{
// 					patchSize /= patchCount;
// 				}
// */	
// 			// if there are no neighbors, then this doesn't work...
// 			var patchCount = 1;
// 			var patchSize = maxPatchSize*0.5;



// 				// patchSize = Math.min(patchSize,maxPatchSize*0.5);
// 			// project (parallel) unit up to view plane
// 			view.projectPoint3D(center2D, p3D);
// 			var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
// 			var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
// 			// parallelUp;
// 			var up3D = V3D.add(p3D,parallelUp);
// 			var dn3D = V3D.sub(p3D,parallelUp);
// 			var lf3D = V3D.sub(p3D,parallelRi);
// 			var ri3D = V3D.add(p3D,parallelRi);
// 			view.projectPoint3D(up2D, up3D);
// 			view.projectPoint3D(dn2D, dn3D);
// 			view.projectPoint3D(lf2D, lf3D);
// 			view.projectPoint3D(ri2D, ri3D);
// 				up2D.sub(center2D);
// 				dn2D.sub(center2D);
// 				lf2D.sub(center2D);
// 				ri2D.sub(center2D);
// 			var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
// 			var s = 0.5*patchSize/avg; // scale from projected size to patch size for full patch size
// // if(debug){
// // 	console.log("avg: "+avg+" | "+patchSize);
// // }
// 			if(s==Infinity){
// 				throw "infinite size";
// 			}
// if( Code.isNaN(up2D.x) ){
// 	console.log(point3D);
// 	console.log(p3D);
// 	console.log(points2D);
// 	console.log([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
// 	console.log(parallelUp);
// 	console.log(parallelRi);
// 	console.log(center2D);
// 	throw "NAN pts";
// }
// 			sizes.push(s);
// 			pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
// 			// 3D distance
// 			V3D.sub(temp3D, view.center(),p3D);
// 			var distance = temp3D.length();
// 			distances.push(distance);
// 		}
// // if(debug){
// // 	console.log(sizes);
// // }
// 		// size = 1 pixel
// 		var size = Code.averageNumbers(sizes);
// 		point3D.size(size);
// 		if(doMatches){ // set match affine transform
// 			// this.patchAffineFromMatches(point3D);//,points2D,distances);
// 			for(var j=0; j<points2D.length; ++j){
// 				var point2DA = points2D[j];
// 				var distA = distances[j];
// 				var ptsA = pts[j];
// 				var viewA = point2DA.view();
// 				for(var k=j+1; k<points2D.length; ++k){
// 					var point2DB = points2D[k];
// 					var distB = distances[k];
// 					var ptsB = pts[k];
// 					var viewB = point2DB.view();
// 					// affine directly: more accurate for actual projections
// 					// if(false){
// 					if(true){
// 						try{
// 						var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
// 						var match = point3D.matchForViews(viewA,viewB);
// 							match.affineForViews(viewA,viewB, affine);
// 						}catch(e){
// 							console.log("affineCornerMatrixLinear - convergence error?");
// 							console.log(ptsA,ptsB);
// 							throw e;
// 							// match.affineForViews(viewB,viewA, affine);
// 						}
// 					// affine from summary stats:
// 					}else{
// 						var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
// 						var angles = [];
// 						for(var p=0; p<ptsA.length; ++p){
// 							var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
// 							angles.push(angle);
// 						}
// 						var angle = Code.averageAngles(angles);
// 						var match = point3D.matchForViews(viewA,viewB);
// 						var affine = new Matrix2D();
// 							affine.identity();
// 							affine.scale(scale);
// 							affine.rotate(angle);
// 						match.affineForViews(viewA,viewB, affine); // A to B
// 					}
// 				}
// 			}
// 		}
// 	}
// }
Stereopsis.World.prototype.patchAffineFromMatchesList = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.patchAffineFromMatches(point3D);
	}
}
Stereopsis.World.prototype.patchAffineFromMatches = function(point3D){

	throw "...";
		var points2D = point3D.toPointArray();
		var p3D = point3D.point();
		var normal = point3D.normal();
		var up = point3D.up();
		if(!up){
			up = null;
			point3D.up(up);
			throw "make up for point3d"
		}

		var distances = [];
		var pts = [];
		var sizes = [];

		var temp = Stereopsis.World._TEMP_PATCH_VS;
		var center2D = temp[0];
		var up2D = temp[1];
		var dn2D = temp[2];
		var lf2D = temp[3];
		var ri2D = temp[4];
		var temp3D = temp[5];

		for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
			var point2D = points2D[j];
			var pnt2D = point2D.point2D();
			var view = point2D.view();
			var viewNormal = view.normal();
			var maxPatchSize = view.cellSize();
			var patchCount = 1;
			var patchSize = maxPatchSize*0.5;
			// project (parallel) unit up to view plane
			view.projectPoint3D(center2D, p3D);
			var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
			var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
			// parallelUp;
			var up3D = V3D.add(p3D,parallelUp);
			var dn3D = V3D.sub(p3D,parallelUp);
			var lf3D = V3D.sub(p3D,parallelRi);
			var ri3D = V3D.add(p3D,parallelRi);
			view.projectPoint3D(up2D, up3D);
			view.projectPoint3D(dn2D, dn3D);
			view.projectPoint3D(lf2D, lf3D);
			view.projectPoint3D(ri2D, ri3D);
				up2D.sub(center2D);
				dn2D.sub(center2D);
				lf2D.sub(center2D);
				ri2D.sub(center2D);
			var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
			var s = 0.5*patchSize/avg; // scale from projected size to patch size for full patch siz
			if(s==Infinity){
				throw "infinite size";
			}
			sizes.push(s);
			pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
			// 3D distance
			V3D.sub(temp3D, view.center(),p3D);
			var distance = temp3D.length();
			distances.push(distance);
		}

		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var distA = distances[j];
			var ptsA = pts[j];
			var viewA = point2DA.view();
			for(var k=j+1; k<points2D.length; ++k){
				var point2DB = points2D[k];
				var distB = distances[k];
				var ptsB = pts[k];
				var viewB = point2DB.view();
				// affine directly: more accurate for actual projections
				// if(false){
				if(true){
					var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
					var match = point3D.matchForViews(viewA,viewB);
						match.affineForViews(viewA,viewB, affine);
				// affine from summary stats:
				}else{
					var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
					var angles = [];
					for(var p=0; p<ptsA.length; ++p){
						var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
						angles.push(angle);
					}
					var angle = Code.averageAngles(angles);
					var match = point3D.matchForViews(viewA,viewB);
					var affine = new Matrix2D();
						affine.identity();
						affine.scale(scale);
						affine.rotate(angle);
					match.affineForViews(viewA,viewB, affine); // A to B
				}
			}
		}
}
Stereopsis.World.prototype.patchUpdateSphere = function(updateOnly){ // update normal direction for patches
	points3D = this.toPointArrayLocated();
	var world = this;
	console.log("patchUpdateSphere: "+points3D.length);
// var showIndexMin = 666610;
// var showIndexMax = showIndexMin + 10;
var doLogging = false;
	for(var i=0; i<points3D.length; ++i){
// var doLogging = (showIndexMin<=i && i<=showIndexMax);
		var point3D = points3D[i];
		if(updateOnly && point3D.nonLinearPatch()){
			continue;
		}
		point3D.nonLinearPatch(true);
		// only optimize over loaded views
		var visibleViews = point3D.toViewArray();
		for(var j=0; j<visibleViews.length; ++j){
			if(!visibleViews[j].image()){
				Code.removeElementAt(visibleViews, j);
				--j;
			}
		}
		if(visibleViews.length<2){
			console.log("VISIBLE VIEWS: "+visibleViews.length);
			continue;
		}
		// point statistics
		var center = point3D.point();
		var size = point3D.size();
		var normal = point3D.normal();
		var up = point3D.up();
		var right = point3D.right();
		// nonlinear optimize normal only
		var patch = {"point":center, "normal":normal, "up":up, "right":right, "size":size};
		var result = world._nonlinearPatchUpdateNormal(patch,point3D,visibleViews    ,doLogging);
		var newNormal = result["normal"];
		console.log(i+" : "+normal+" -> "+newNormal+" : "+V3D.distance(normal,newNormal));
		point3D.normal(newNormal);


if(i>=showIndexMax){
	throw "END EARLY: ";
}
	}
}
Stereopsis.World.prototype._nonlinearPatchUpdateNormal = function(patch,point3D,views,   doLogging){
	var center = patch["point"];
	var normal = patch["normal"];
	var up = patch["up"];
	var right = patch["right"];
	var size = patch["size"];
	var maxIterations = 3; // 3-5
	var fxn = Stereopsis._gdPatchUpdateNormal;
	var args = [center,normal,up,right,size,views,point3D, doLogging];
	var xVals = [0,0]; // up | right
	result = Code.gradientDescent(fxn, args, xVals, null, maxIterations, 1E-6,  1E-10);
if(doLogging){
DO_LOGGING_COUNT = 0;
++DO_LOGGING_COUNT_Y;
}
	x = result["x"];
	var newNormal = new V3D();
	newNormal.copy(normal).rotate(up, x[0]).rotate(right, x[1]);
	return {"normal":newNormal};
}
DO_LOGGING_COUNT = 0;
DO_LOGGING_COUNT_Y = 0;
Stereopsis._gdPatchUpdateNormal = function(args, x, isUpdate, descriptive){
	if(isUpdate){
		return;
	}
	var startCenter = args[0];
	var startNormal = args[1];
	var startUp = args[2];
	var startRight = args[3];
	var size = args[4];
	var views = args[5];
	var p3D = args[6];
var doLogging = args[7];
	var angleU = x[0];
	var angleR = x[1];
	var halfSize = size*0.5;
	// rotations
	if(!Stereopsis._gdPatchUpdateNormal_V3D_0){
		Stereopsis._gdPatchUpdateNormal_V3D_0 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_1 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_2 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_3 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_4 = new V3D();
		Stereopsis._gdPatchUpdateNormal_SIZE = 7;
		Stereopsis._gdPatchUpdateNormal_MASK = ImageMat.circleMask(Stereopsis._gdPatchUpdateNormal_SIZE);
	}
	var normal = Stereopsis._gdPatchUpdateNormal_V3D_0;
	var up = Stereopsis._gdPatchUpdateNormal_V3D_1;
	var down = Stereopsis._gdPatchUpdateNormal_V3D_2;
	var right = Stereopsis._gdPatchUpdateNormal_V3D_3;
	var left = Stereopsis._gdPatchUpdateNormal_V3D_4;
	normal.copy(startNormal).rotate(startUp, angleU).rotate(startRight, angleR);
	up.copy(startUp).rotate(startUp, angleU).rotate(startRight, angleR);
	right.copy(startRight).rotate(startUp, angleU).rotate(startRight, angleR);
	left.copy(right).scale(-1);
	down.copy(right).scale(-1);
	// to absolute
	up.scale(halfSize).add(startCenter);
	down.scale(halfSize).add(startCenter);
	right.scale(halfSize).add(startCenter);
	left.scale(halfSize).add(startCenter);
	// don't allow reverse of normal direction
	var dot = V3D.dot(normal,startNormal);
	if(dot<=0){ // TODO: is this a problem?
		return 1E9;
	}
	// affines
	var compareSize = Stereopsis._gdPatchUpdateNormal_SIZE;
	var compareHalf = compareSize*0.5;
	var needleMask = Stereopsis._gdPatchUpdateNormal_MASK;
	var org = V2D.ZERO;
	var xLoc = new V2D(compareHalf,0);
	var yLoc = new V2D(0,compareHalf);
	var nxLoc = new V2D(-compareHalf,0);
	var nyLoc = new V2D(0,-compareHalf);
	var cen2D = new V2D();
	var lft2D = new V2D();
	var rig2D = new V2D();
	var cen2D = new V2D();
	var top2D = new V2D();
	var dwn2D = new V2D();
	var affine = new Matrix2D();
	var scales = [];
	var affines = [];
	var centers = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		// project: center, up, right
		view.projectPoint3D(cen2D, startCenter);
		view.projectPoint3D(rig2D, right);
		view.projectPoint3D(top2D, up);
		view.projectPoint3D(lft2D, left);
		view.projectPoint3D(dwn2D, down);
		// local coords
		rig2D.sub(cen2D);
		top2D.sub(cen2D);
		lft2D.sub(cen2D);
		dwn2D.sub(cen2D);
		// record scales: from expected compare size to actual projected size
// if(doLogging){
// 	console.log("half lengths: ",[rig2D.length(),top2D.length(),lft2D.length(),dwn2D.length()])
// }
		scales.push( 2.0*Code.averageNumbers([rig2D.length(),top2D.length(),lft2D.length(),dwn2D.length()])/view.compareSize() );
		// use P2D center, not projected center
		var p2D = p3D.point2DForView(view);
		var c2D = p2D.point2D();
		// create affine
		var pointsA = [rig2D,top2D,lft2D,dwn2D];
		var pointsB = [xLoc,yLoc,nxLoc,nyLoc];
		R3D.affineCornerMatrixLinear(pointsA,pointsB, affine);
		affines.push(affine.copy());
		centers.push(c2D);
	}
	var minimumScale = Code.min(scales);
	// patches extract from affine
	var patches = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var imageScales = view.imageScales();
		var c2D = centers[i];
		var affine = affines[i];
		// separate out scales
			var info = R3D.infoFromAffine2D(affine);
			var applyScale = info["scale"];
			affine.scale(1.0/applyScale);
			applyScale = applyScale*minimumScale; // additional scale for including entirety of cell-compare size
			// best size scaling
			info = imageScales.infoForScale(applyScale);
		    var image = info["image"];
		    var effScale = info["effectiveScale"];
		    var actScale = info["actualScale"];
		var needle = image.extractRectFromFloatImage(c2D.x*actScale,c2D.y*actScale,1.0/effScale,null,compareSize,compareSize, affine);
// if(doLogging){
// 	var totalSize = 19;
// 	var d = new DO();
// 		d.graphics().setLine(1.0,0xFFFF0000);
// 		d.graphics().beginPath();
// 		d.graphics().drawCircle(c2D.x,c2D.y, totalSize*0.5);
// 		d.graphics().strokeLine();
// 		d.graphics().endPath();
// 		d.matrix().translate(10 + 0, 10 + 0);
// 		if(i==1){
// 			d.matrix().translate(view.image().width()*1, 0);
// 		}
// 	GLOBALSTAGE.addChild(d);
// }
		patches.push(needle);
	}
	// cost
	var totalCost = 0;
	var compares = 0;
	for(var i=0; i<patches.length; ++i){
		var patchI = patches[i];
		for(var j=i+1; j<patches.length; ++j){
			var patchJ = patches[j];
			var scores = R3D.searchNeedleHaystackSADColor(patchI,patchJ,needleMask);
			// var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB,mask, spacing,spacing);
			var score = scores["value"][0];
			totalCost += score;
			++compares;
		}
	}
	totalCost /= compares;
	// if(doLogging && isUpdate){ // (isUpdate || (angleU==0 && angleU==0) ) ){
	// 	var sca = 5.0;
	// 	for(var i=0; i<patches.length; ++i){
	// 		var patch = patches[i];
	// 		var iii = patch;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(10 + DO_LOGGING_COUNT*50, 10 + i*50 + (DO_LOGGING_COUNT_Y*2)*50);
	// 		GLOBALSTAGE.addChild(d);
	// 	}
	// 	++DO_LOGGING_COUNT;
	// }
	return totalCost;
}

Stereopsis.World.prototype.filterMatchGroups = function(){
	var world = this;
	var sigmaDrop = 2.0; // 1.5 = too low | 2.0 = too high
	var points3D = this.toPointArray();
	var checked = 0;
	var removed = 0;
	// var vals = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		if(matches.length>=3){
			++checked;
			var points2D = point3D.toPointArray();
			for(var j=0; j<points2D.length; ++j){
				points2D[j].temp(0);
			}
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				var ncc = match.errorNCC();
				var pA = match.point2DA();
				var pB = match.point2DB();
				pA.temp(pA.temp()+ncc);
				pB.temp(pB.temp()+ncc);
			}
			var list = [];
			for(var j=0; j<points2D.length; ++j){
				list.push(points2D[j].temp());
			}
			var min = Code.min(list);
			var max = Code.max(list);
			var mean = Code.mean(list);
			var sigma = Code.stdDev(list,min);
			var maxToMin = min>0 ? max/min : 0;
// vals.push(maxToMin);
// vals.push([min,sigma,list]);
			var limit = min + sigmaDrop*sigma;
			var removeP2D = null;
			var maxIndex = Code.maxIndex(list);
			var maxValue = list[maxIndex];
			if(maxValue>=limit){
				removeP2D = points2D[maxIndex];
			}
			// reset
			for(var j=0; j<points2D.length; ++j){
				points2D[j].temp(null);
			}
			if(removeP2D){
				world.removePoint2DAndMatchesFromPoint3D(removeP2D);
				++removed;
			}
		}
	}
	console.log(" FILTER MATCH GROUPS: checked: "+checked+" / "+removed);
	// console.log(vals);
}
Stereopsis.World.prototype.filterSphere3D = function(sigmaCount, linearly){
	return this.filterSphere3D_WORLD(sigmaCount, linearly);
	var minimumCount = 16; // don't bother elsewise
	/*
	for each transform: get all shared P3Ds
		- use relative pair transform
		- use estimated3d location
	or projection if easier ...

	do intersection tests

	keep track of match/p3d intersections

	this.removeMatchFromPoint3D(match);



	*/
	throw "only clip pairwise";

}

Stereopsis.World.prototype.filterPairwiseSphere3D = function(sigmaCount, linearly){ // treat each point as a sphere - conflicting collisions of spheres resolved by removing most prevaling offenders
	throw "switch this to global filterGlobalPatchSphere3D"
	// size of patch/sphere predetermined
	sigmaCount = sigmaCount!==undefined ? sigmaCount : 2.0;
	linearly = linearly!==undefined ? linearly : false;
// sigmaCount = 4.0;
// linearly = false;
	var minMatchCount = 16;
	var minimumDropLimit = 2; // 1-2 intersections == indistinguishable
	var toPointFxn = function(o){
		return o.point3D().point();
	}
	var space = new OctTree(toPointFxn);
	var transforms = this.toTransformArray();
	console.log("filterPairwiseSphere3D: "+transforms.length);
// var averagePercent = 0;
// var averageCount = 0;
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length>minMatchCount){
			var intersectionsFound = 0;
			var viewA = transform.viewA();
			var viewB = transform.viewB();
throw "shouldn't the view centers use the inverse absolute transform ???"
			var cameraA = viewA.absoluteTransform();
			var cameraB = viewB.absoluteTransform();
			var centerA = cameraA.multV3DtoV3D(new V3D(0,0,0));
			var centerB = cameraB.multV3DtoV3D(new V3D(0,0,0));
			var keepMatches = [];
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				var point3D = match.point3D();
				if(point3D.hasPatch()){
					match.temp({"behind":[],"front":[]});
					keepMatches.push(match);
				}
			}
			// reset for new set of points
			space.initWithObjects(keepMatches);
			var size = space.size();
			var sizeInfinite = size.length(); // nothing larger than diagonal
			// tally intersections
			for(var m=0; m<keepMatches.length; ++m){
				var matchA = keepMatches[m];
				var point3DA = matchA.point3D();
				var pointSizeA = point3DA.size();
				var pointCenterA = point3DA.point();
				var centers = [centerA,centerB];
				for(var j=0; j<centers.length;++j){ // project point to both views A & B in transform world
					var viewCenter = centers[j];
					var pointDirViewA = V3D.sub(viewCenter,pointCenterA); // point to view
					// search cone: potentially many fewer points in search list
					var paddedRadius = pointSizeA*2.0;
					var dirLen = pointDirViewA.length();
					// var theta = Math.atan2(pointSizeA,dirLen);
					var theta = Math.atan(pointSizeA/dirLen);
					var totalConeLength = paddedRadius/Math.tan(theta);
					var dirPadding = pointDirViewA.copy();
						dirPadding.length(totalConeLength-dirLen);
					var coneCenter = viewCenter.copy().add(dirPadding);
					var coneDirection = dirPadding;
						coneDirection.flip();
						// coneDirection.length(totalConeLength);
						coneDirection.length(sizeInfinite); // WANT CONE LENGTH TO BE INFINITE .... get behind and in front
					var coneRatio = paddedRadius/totalConeLength;
					var distanceA = V3D.distance(viewCenter,pointCenterA); // === pointDirViewA.length()
					var searchPoints = space.objectsInsideCone(coneCenter,coneDirection,coneRatio);
					for(var k=0; k<searchPoints.length;++k){
						var matchB = searchPoints[k];
						if(matchA==matchB){ // no self intersect
							continue;
						}
						var point3DB = matchB.point3D();
						var pointCenterB = point3DB.point();
						var pointSizeB = point3DB.size();
						// ignore points that start off very close to eachother to begin with:
						var distAB = V3D.distance(pointCenterA,pointCenterB);
						var combinedRadius = (pointSizeA+pointSizeB);
						if(distAB<=combinedRadius){
							continue;
						}
							// TODO: POINTS MUST BE IN FRONT OF CAMERA  --- this should always be the case?
						// find closest point of sphere2 along ray from sphere1-viewcenter
						var closestB = Code.closestPointLine3D(pointCenterA,pointDirViewA, pointCenterB);
						// find expected radius along cone
						var distanceB = V3D.distance(viewCenter,closestB);
						var localSizeB = (distanceB/distanceA)*pointSizeA; // similar triangles
						// if distance between center & line point < rad1 + rad2 == intersection
						var distance = V3D.distance(closestB, pointCenterB);
						combinedRadius = (localSizeB+pointSizeB);
							// combinedRadius *= 0.5; // lenient
						if(distance < combinedRadius){  // possibly also add padding
							// double counting -- except that small errors may not cancel out => record both
							if(distanceB>distanceA){ // pointB is behind pointA
								matchB.temp()["behind"].push(matchA);
								matchA.temp()["front"].push(matchB);
							}else{ // pointB is in front of pointA
								matchB.temp()["front"].push(matchA);
								matchA.temp()["behind"].push(matchB);
							}
							// if(distanceB>distanceA){
							// 	matchA.temp()["front"].push(matchB);
							// }else{
							// 	matchA.temp()["behind"].push(matchB);
							// }
							++intersectionsFound;
						}
					}
				} // viewA & viewB centers
			} // keep matches A+B
			space.clear();
			console.log(t+" | intersectionsFound: "+intersectionsFound);
			// get population count
			var behinds = [];
			var fronts = [];
			var pointsFront = [];
			var pointsBehind = [];
			for(var m=0; m<keepMatches.length; ++m){
				var match = keepMatches[m];
				var temp = match.temp();
				behinds.push(temp["behind"].length);
				fronts.push(temp["front"].length);
				pointsFront.push(match);
				pointsBehind.push(match);
			}
			pointsFront.sort(function(a,b){
				return a.temp()["front"] > b.temp()["front"] ? -1 : 1;
			});
			pointsBehind.sort(function(a,b){
				return a.temp()["behind"] > b.temp()["behind"] ? -1 : 1;
			});
			var maxSampleSize = 500;
			fronts = Code.randomSampleRepeatsMaximum(fronts,maxSampleSize,maxSampleSize);
			behinds = Code.randomSampleRepeatsMaximum(behinds,maxSampleSize,maxSampleSize);
			fronts.sort(function(a,b){
				return a > b ? -1 : 1;
			});
			behinds.sort(function(a,b){
				return a > b ? -1 : 1;
			});
			// in-front
			var minF = Code.min(fronts);
			var avgF = Code.mean(fronts);
			var sigF = Code.stdDev(fronts,avgF);
			// behind
			var minB = Code.min(behinds);
			var avgB = Code.mean(behinds);
			var sigB = Code.stdDev(behinds,avgB);
			// limits
			var limF = Math.round(avgF + sigF*sigmaCount);
			var limB = Math.round(avgB + sigB*sigmaCount);
			// var limF = Math.round(minF + sigF*sigmaCount);
			// var limB = Math.round(minB + sigB*sigmaCount);
			limF = Math.max(limF,minimumDropLimit);
			limB = Math.max(limB,minimumDropLimit);
			console.log("F: "+minF+" : "+avgF+" +/- "+sigF+" --- "+limF);
			console.log("B: "+minB+" : "+avgB+" +/- "+sigB+" --- "+limB);
			// get worst
			var dropList = [];
			for(var i=0; i<pointsFront.length; ++i){
				var match = pointsFront[i];
				if(match.temp()["front"].length>limF){
					Code.addUnique(dropList,match);
				}else{
					break;
				}
			}
			for(var i=0; i<pointsBehind.length; ++i){
				var match = pointsBehind[i];
				if(match.temp()["behind"].length>limB){
					Code.addUnique(dropList,match);
				}else{
					break;
				}
			}
			// deinitialize counting
			for(var m=0; m<keepMatches.length; ++m){
				var match = keepMatches[m];
				match.temp(null);
			}
			// drop worst
			console.log("sphere patch pair dropping: "+dropList.length+" / "+matches.length);
			// console.log(dropList);
			for(var i=0; i<dropList.length; ++i){
				var match = dropList[i];
				if(!match.point3D()){
					console.log(i);
					console.log(match);
					throw "?";
				}
				this.removeMatchFromPoint3D(match);
			}
		} // minimum match check
	} // transforms

	// averagePercent /= averageCount;
	// console.log("averagePercent: "+averagePercent);

	space.kill();
}

Stereopsis.World.prototype.filterGlobalPatchSphere3D = function(sigmaCount){
console.log("filterGlobalPatchSphere3D @ "+sigmaCount);
	var world = this;
	sigmaCount = sigmaCount!==undefined ? sigmaCount : 2.0;
	var inearly = false;
	var limitAngleNormalsMax = Code.radians(90.0); // if facing more than this away -> ignore
	var points3D = world.toPointArray();
	// initialize counting
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			point3D.temp({"behind":0,"front":0,"ncc":0,"sad":0});
		}
	}
	// find ray intersections for all patches
	var space = world.pointSpace();
	var size = space.size();
	var scaleConeSize = size.length()*2.0; // distance to infinity
	var intersectionsFound = 0;
	var scaleConeSearchSize = 2.0;
	for(var i=0; i<points3D.length; ++i){
		var point3DA = points3D[i];
		if(i%1000==0){
			console.log(" "+i+" / "+points3D.length);
		}
		if(point3DA.hasPatch()){
			var pointSizeA = point3DA.size();
			var pointCenterA = point3DA.point();
			var pointNormalA = point3DA.normal();
			var views = point3DA.toViewArray();
			for(var j=0; j<views.length; ++j){
				var view = views[j];
				var viewCenter = view.center();
				// seach a cone @ radius = 2 x sizeA
				var dirViewToPoint = V3D.sub(pointCenterA,viewCenter);
				var distanceA = dirViewToPoint.length();
				// var coneCenter = viewCenter.copy().sub(dirViewToPoint); // 2 x pointSizeA
					var coneCenter = viewCenter;
				var coneRatio = scaleConeSearchSize*pointSizeA/distanceA;
				var coneDirection = dirViewToPoint;
					coneDirection.length(scaleConeSize);
				var searchPoints = space.objectsInsideCone(coneCenter,coneDirection,coneRatio);
				for(var k=0; k<searchPoints.length;++k){
					var point3DB = searchPoints[k];
					if(point3DA==point3DB){
						continue;
					}
					if(point3DB.hasPatch()){
						var pointNormalB = point3DB.normal();
						// only care about patches pointing toward eachother
						var angleAB = V3D.angle(pointNormalA,pointNormalB);
						if(angleAB<limitAngleNormalsMax){
							var pointCenterB = point3DB.point();
							var pointSizeB = point3DB.size();
							// ignore points that start off very close to eachother to begin with:
							var distAB = V3D.distance(pointCenterA,pointCenterB);
							var combinedRadius = (pointSizeA+pointSizeB); // should there be padding ?
							if(distAB<=combinedRadius){
								continue;
							}
							var closestB = Code.closestPointLine3D(viewCenter,coneDirection, pointCenterB);
							// find expected radius along cone
							var distanceB = V3D.distance(viewCenter,closestB);
							var localSizeB = (distanceB/distanceA)*pointSizeA; // similar triangles
							// if distance between center & line point < rad1 + rad2 == intersection
							var distance = V3D.distance(closestB, pointCenterB);
							combinedRadius = (localSizeB+pointSizeB);
							// combinedRadius *= 0.5; // lenient - conservative
							if(distance < combinedRadius){  // possibly also add padding
								if(distanceB>distanceA){ // pointB is behind pointA
									point3DB.temp()["behind"] += 1;
									point3DA.temp()["front"] += 1;
								}else{ // pointB is in front of pointA
									point3DB.temp()["front"] += 1;
									point3DA.temp()["behind"] += 1;
								}
								// SHOULD POINTS WITH MORE TRACKS HAVE HIGHER PRIORITY?
								// var trackCountA = point3DA.point2DCount();
								// var trackCountB = point3DB.point2DCount();
								var nccA = point3DA.averageNCCError();
								var nccB = point3DB.averageNCCError();
								if(nccA!==null & nccB!==null){
									// RATIO, DIFFERENCE, COUNT
									if(nccA<nccB){
										// var diff = nccB-nccA;
										var diff = 1;
										point3DB.temp()["ncc"] += diff;
									}else{
										// var diff = nccA-nccB;
										var diff = 1;
										point3DA.temp()["ncc"] += diff;
									}
								} // else: do R / F ?
								var sadA = point3DA.averageNCCError();
								var sadB = point3DB.averageNCCError();
								if(sadA!==null & sadB!==null){
									// RATIO, DIFFERENCE, COUNT
									if(sadA<sadB){
										// var diff = sadB-sadA;
										var diff = 1;
										point3DB.temp()["sad"] += diff;
									}else{
										// var diff = sadA-sadB;
										var diff = 1;
										point3DA.temp()["sad"] += diff;
									}
								}
								++intersectionsFound;
							} // end intersection
						} // end angle check
					} // end patch
				} // end possibles
			} // end views
		} // end patch
	} // end points
console.log("intersectionsFound: "+intersectionsFound);
	// counting
	var behinds = [];
	var fronts = [];

var scoreNCCs = [];
var pointNCCs = [];
var scoreSADs = [];
var pointSADs = [];

	var pointsFront = [];
	var pointsBehind = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var temp = point3D.temp();
			behinds.push(temp["behind"]);
			fronts.push(temp["front"]);
			pointsFront.push(point3D);
			pointsBehind.push(point3D);
pointNCCs.push(point3D);
scoreNCCs.push(temp["ncc"]);
pointSADs.push(point3D);
scoreSADs.push(temp["sad"]);
		}
	}
	pointsFront.sort(function(a,b){
		return a.temp()["front"] > b.temp()["front"] ? -1 : 1;
	});
	pointsBehind.sort(function(a,b){
		return a.temp()["behind"] > b.temp()["behind"] ? -1 : 1;
	});
pointNCCs.sort(function(a,b){
	return a.temp()["ncc"] > b.temp()["ncc"] ? -1 : 1;
});
pointSADs.sort(function(a,b){
	return a.temp()["sad"] > b.temp()["sad"] ? -1 : 1;
});
	var maxSampleSize = 1000;
	fronts = Code.randomSampleRepeatsMaximum(fronts,maxSampleSize,maxSampleSize);
	behinds = Code.randomSampleRepeatsMaximum(behinds,maxSampleSize,maxSampleSize);
	fronts.sort(function(a,b){
		return a > b ? -1 : 1;
	});
	behinds.sort(function(a,b){
		return a > b ? -1 : 1;
	});
scoreNCCs = Code.randomSampleRepeatsMaximum(scoreNCCs,maxSampleSize,maxSampleSize);
scoreNCCs.sort(function(a,b){
	return a > b ? -1 : 1;
});
scoreSADs = Code.randomSampleRepeatsMaximum(scoreSADs,maxSampleSize,maxSampleSize);
scoreSADs.sort(function(a,b){
	return a > b ? -1 : 1;
});
	// Code.printMatlabArray(fronts,"f");
	// Code.printMatlabArray(behinds,"b");
Code.printMatlabArray(scoreNCCs,"n");
Code.printMatlabArray(scoreSADs,"s");
	// front
	var minF = Code.min(fronts);
	var avgF = Code.mean(fronts);
	var sigF = Code.stdDev(fronts,minF);
	// behind
	var minB = Code.min(behinds);
	var avgB = Code.mean(behinds);
	var sigB = Code.stdDev(behinds,minB);
	// limits
	var limF = Math.round(avgF + sigF*sigmaCount);
	var limB = Math.round(avgB + sigB*sigmaCount);
var sigmaForVisuals = sigmaCount;
// var sigmaForVisuals = 3.0;
// var sigmaForVisuals = 2.0;
// NCC
var minN = Code.min(scoreNCCs);
var avgN = Code.mean(scoreNCCs);
var sigN = Code.stdDev(scoreNCCs,minN);
var limN = minN + sigN*sigmaForVisuals;
// SAD
var minS = Code.min(scoreSADs);
var avgS = Code.mean(scoreSADs);
var sigS = Code.stdDev(scoreSADs,minS);
var limS = minS + sigS*sigmaForVisuals;

// limS = Math.max(limS,1);
// limN = Math.max(limN,1);

	// console.log("O F: "+minF+" : "+avgF+" +/- "+sigF+" --- "+limF);
	// console.log("O B: "+minB+" : "+avgB+" +/- "+sigB+" --- "+limB);
console.log("O N: "+minN+" : "+avgN+" +/- "+sigN+" --- "+limN);
console.log("O S: "+minS+" : "+avgS+" +/- "+sigS+" --- "+limS);

	// linearly:
	// var linearF = Math.ceil(Code.percentile(fronts,0.5)*2);
	// var linearB = Math.ceil(Code.percentile(behinds,0.5)*2);
	// limF = Math.min(limF,linearF);
	// limB = Math.min(limB,linearB);

	// limF = Math.max(limF,2);
	// limB = Math.max(limB,2);
	limF = Math.max(limF,1);
	limB = Math.max(limB,1);
	// console.log("F: "+minF+" : "+avgF+" +/- "+sigF+" --- "+limF);
	// console.log("B: "+minB+" : "+avgB+" +/- "+sigB+" --- "+limB);

	// mark worst front
	var dropList = [];

/*
	for(var i=0; i<pointsFront.length; ++i){
		var point3D = pointsFront[i];
		if(point3D.temp()["front"]>limF){
			// Code.addUnique(dropList,point3D);
			dropList.push(point3D);
		}else{
			break;
		}
	}
	// mark worst behind
	for(var i=0; i<pointsBehind.length; ++i){
		var point3D = pointsBehind[i];
		if(point3D.temp()["behind"]>limB){
			// Code.addUnique(dropList,point3D);
			dropList.push(point3D);
		}else{
			break;
		}
	}
*/

// mark worst behind
for(var i=0; i<pointNCCs.length; ++i){
	var point3D = pointNCCs[i];
	if(point3D.temp()["ncc"]>limN){
		dropList.push(point3D);
	}else{
		break;
	}
}
for(var i=0; i<pointSADs.length; ++i){
	var point3D = pointSADs[i];
	if(point3D.temp()["sad"]>limS){
		dropList.push(point3D);
	}else{
		break;
	}
}

	// deinitialize counting
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			point3D.temp(null);
		}
	}
	// drop worst
	console.log("patch dropping: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		var point3D = dropList[i];
		if(point3D.hasPatch()){ // to make sure a point isn't double-deleted
			world.disconnectPoint3D(point3D); // calls removePoint3D
			world.killPoint3D(point3D);
		}
	}
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveDropWorstViewNeighbors = function(){ // move view to a more optimal position
	console.log("solveDropWorstViewNeighbors");
	var world = this;
	var minimumMatches = 12;
	var views = world.toViewArray();
	var sortLowestError = function(a,b){
		return a[0] < b[0] ? -1 : 1;
	}
	var scoreMapFxn = function(a){
		return a[0];
	}

	// votes to empty
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.temp([]);
	}

	for(var i=0; i<views.length; ++i){
		console.log("............................ "+i);
		var view = views[i];
		var transforms = world.transformsWithView(view);
		var keep = [];
		// console.log(" +"+transforms.length);
		for(var j=0; j<transforms.length; ++j){
			var transform = transforms[j];
			var matchCount = transform.matchCount();
			// console.log(matchCount+" >?> "+minimumMatches);
			if(matchCount>=minimumMatches){
				var error = transform.rMean() + transform.rSigma();
				// error /= matchCount;
				var error2 = transform.rAverage();
				// OR MAYBE BOTH ?
				// keep.push([error2, transform]);
				keep.push([error, transform]);
				// console.log(error+" | "+error2);
			}
		}
		keep.sort(sortLowestError);
		scores = Code.copyArray(keep);
		Code.arrayMap(scores, scoreMapFxn);
		// console.log(scores);
		var vote = null;
		var maxIndex = null;
		if(keep.length>=2){
			// get deltas:
			var deltas = [];
			for(var d=1; d<keep.length; ++d){
				var a = scores[d];
				var b = scores[d-1];
				deltas.push(a-b);
			}
			maxIndex = Code.maxIndex(deltas);
			// console.log(maxIndex);
			// TODO - try looking at 'sigma' - error spread before and after
			var averageA = Code.mean(scores,null,maxIndex+1);
			var averageB = Code.mean(scores); // all
			var averageR = averageB/averageA;
			console.log("3",averageA,averageB,averageR);
			if(averageR>2.0){
				vote = 1;
			}else{
				vote = 0;
			}
		}else{
			console.log("no");
		}
		if(vote!==null){
			for(var t=0; t<keep.length; ++t){
				var transform = keep[t][1];
				var oppositeView = transform.oppositeView(view);
				var v = 0;
				if(t>maxIndex){
					v = vote;
				}
				oppositeView.temp().push(v);
			}
		}
		

// world.dropNegative3D();
// world.dropFurthest();

		// compare best half and full and see if sigma / error > max


		// console.log(deltas+"")
		// throw "???"
	}
	var viewsToRemove = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var votes = view.temp();
		
		var totalVotes = votes.length;
		var maximumVotesToRemove = Math.floor(totalVotes*0.5) + (totalVotes%2==1 ? 1 : 0);
			maximumVotesToRemove = totalVotes; // TODO ... maybe high bar?
		var totalRemoveVotes = Code.sum(votes);
		console.log(view.data(),votes,totalRemoveVotes+"/"+totalVotes+" >= "+maximumVotesToRemove);
		if(totalRemoveVotes>=maximumVotesToRemove){
			viewsToRemove.push(view);
		}
		view.temp(null);
	}
	console.log(viewsToRemove);
	// remove all points/matches for 'bad' views
	for(var i=0; i<viewsToRemove.length; ++i){
		var view = viewsToRemove[i];
		var space = view.pointSpace();
		var points = space.toArray();
		for(var p=0; p<points.length; ++p){
			var point2D = points[p];
			world.removePoint2DAndMatchesFromPoint3D(point2D);
			// console.log(point2D);
			// view.removePoint2D(point2D);
			// Stereopsis.World.prototype.removePoint2DAndMatchesFromPoint3D = function(point2D){
		}
		// space.clear();
	}

	return {"removed":viewsToRemove};
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveOptimizeSequential = function(pairInfo){
	var world = this;
	console.log(world);


	// var str = world.toYAMLString();
	// console.log(str);
	// throw "before";

	console.log("pairInfo");
	console.log(pairInfo);


	var sequenceData = this.initGraphOptimizeSequential(pairInfo);
	console.log(sequenceData);



	var views = world.toViewArray();

	// save initial:
	var viewDataToID = {};
	var viewIDToIndex = {};
	var initialTransforms = [];
	var viewFromData = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var viewData = view.data();
		viewFromData[viewData] = view;
		var ext = view.absoluteTransform();
		initialTransforms[i] = ext.copy();
		viewIDToIndex[viewID] = i;
		viewDataToID[viewData] = viewID;
	}
	var steps = sequenceData["sequence"];

console.log(steps);

var outerLoopIterationsMax = 5;
	for(var outer=0; outer<outerLoopIterationsMax; ++outer){
		console.log(" ...................................................... + . + . + . + . + . + . + . + . + . + . + . + . + . + . + . + . OUTER LOOP: "+outer);
		for(var i=0; i<steps.length; ++i){
			console.log(" ................................................................... step: "+i);
			var step = steps[i];
			var viewID = step["view"];
			var stepPairs = step["pairs"];
			// console.log(step);
			var view = viewFromData[viewID];



			/// toption A:

			// if(stepPairs){
			// 	var includedViews = [];
			// 	for(var j=0; j<stepPairs.length; ++j){
			// 		var stepPair = stepPairs[j];
			// 		var stepPairID = stepPair["id"];
			// 		var stepPairScore = stepPair["score"];
			// 		var viewID = viewDataToID[stepPairID];
			// 		var pairView = world.viewFromID(viewID);
			// 		includedViews.push(pairView);
			// 	}
			// 	console.log("includedViews: "+includedViews.length);

			// 	var includedPoints = view.includePointsForViews(includedViews);
			// 	console.log(includedPoints);

			// 	// optimize single view for reprojection error:

			// 	var maxIterations = 100;
			// 	var onlyLongTracks = false;
			// 	world.refineSelectCameraMultiViewTriangulation(view, maxIterations, onlyLongTracks, includedPoints);
			// 	world.copyRelativeTransformsFromAbsolute(); // ?


			// 	var doInsert = true;
			// 	for(var p=0; p<includedPoints.length; ++p){
			// 		var point2D = includedPoints[p];
			// 		var point3D = point2D.point3D();
			// 		// this.initNewPointPatch3D(newPoint3D, false);
			// 		var location3D = point3D.globalPoint3DLinear();
			// 		if(doInsert){
			// 			world.updatePoint3DLocation(point3D,location3D);
			// 		}else{
			// 			point3D.point(location3D);
			// 		}
			// 	}
			// }


			// A
			var maxIterations = 100;
			var onlyLongTracks = false;
			world.refineSelectCameraMultiViewTriangulation(view, maxIterations, onlyLongTracks);
			world.copyRelativeTransformsFromAbsolute(); // ?


			// B
			// TODO ?
			// var maxIterations = 100;
			// var onlyLongTracks = false;
			// world.refineSelectCameraMultiViewTriangulation(view, maxIterations, onlyLongTracks);
			// world.copyRelativeTransformsFromAbsolute(); // ?



		}

		// if(outer>2){
		// 	world.dropNegativePoints3D();
		// }

	}

	// return;

		// var str = world.toYAMLString();
		// console.log(str);
		// console.log(world);

		// throw "after loop outside"



	var outerLoopIterationsMax = 2;
// outerLoopIterationsMax = 1;
// outerLoopIterationsMax = 2;
outerLoopIterationsMax = 5;
	for(var outer=0; outer<outerLoopIterationsMax; ++outer){
		console.log(" ...................................................... + . + . + . + . + . + . + . + . + . + . + . + . + . + . + . + . OUTER LOOP: "+outer);
		var viewsResolved = {};

		for(var i=0; i<steps.length; ++i){
			console.log(" ................................................................... step: "+i);
			var step = steps[i];
			var viewID = step["view"];
			var stepPairs = step["pairs"];
			// console.log(step);
			var view = viewFromData[viewID];
			// console.log(view);
			if(i==0){ // set view to identity:
				console.log(view);
				view.absoluteTransform( new Matrix(4,4).identity() );
			}else{
				// calculate scales for all current views:
				var includedViews = Code.objectToArray(viewsResolved);

				

				// calculate current best guess orientation from original offsets
				var oldTs = [];
				var newTs = [];
				var percents = []; // scores = larger = better
				var stepViews = [];
				for(var j=0; j<stepPairs.length; ++j){
					var stepPair = stepPairs[j];
					var stepPairID = stepPair["id"];
					var stepPairScore = stepPair["score"];
					var viewID = viewDataToID[stepPairID];
					var viewOldT = initialTransforms[viewID];
						viewOldT = Matrix.inverse(viewOldT); // to abs
					var pairView = world.viewFromID(viewID);
					var viewNewT = pairView.absoluteTransform();
						viewNewT = Matrix.inverse(viewNewT); // to abs
					// console.log(viewOldT);
					// console.log(viewNewT);
					
					stepViews.push(pairView);
					if( !viewsResolved[pairView.id()] ){
						console.log(pairView);
						console.log(includedViews);
						console.log(viewsResolved);
						// includedViews
						throw "view is not evaluated yet"
					}
					
					oldTs.push(viewOldT);
					newTs.push(viewNewT);
					percents.push(stepPairScore);


					// the SCALE of T = relative distance of OLD edges / relative distance of NEW edges

				}
	console.log(oldTs);
				var viewScales = Stereopsis.useOldTransformsToEstimateNewScales(stepViews,oldTs,newTs,  pairInfo);
				console.log("viewScales:");
				console.log(viewScales);
	// throw ".............. view scales"

				percents = Code.countsToPercents(percents);
				console.log(percents);
				console.log("percents");
				var oldRef = initialTransforms[view.id()];
					oldRef = Matrix.inverse(oldRef); // to abs

				var transform = Stereopsis.useOldTransformsToEstimateNewTransforms(oldTs,oldRef,newTs,viewScales,percents);
				var extrinsic = Matrix.inverse(transform);
				// var extrinsic = transform;
				// console.log("WAS: \n"+oldRef);
				// console.log(transform);
				// console.log("IS: \n"+extrinsic);


				// console.log(  oldRef.multV3DtoV3D(new V3D(0,0,0)) );
				// console.log(  extrinsic.multV3DtoV3D(new V3D(0,0,0)) );
				view.absoluteTransform(extrinsic);
// view.absoluteTransform(oldRef);
				world.copyRelativeTransformsFromAbsolute(); // ?


				console.log(view);

				var includedPoints = view.includePointsForViews(includedViews);
				console.log(includedPoints);

				// optimize single view for reprojection error:

				// A
				// var maxIterations = 100;
				// var onlyLongTracks = false;
				// world.refineSelectCameraMultiViewTriangulation(view, maxIterations, onlyLongTracks, includedPoints);

				// B
				var iterationsUpdateViewSingle = 100;
				world.refineSelectCameraByLocalGeometryMatching3D(view, iterationsUpdateViewSingle, includedPoints);




				world.copyRelativeTransformsFromAbsolute(); // ?



				var doInsert = true;
				for(var p=0; p<includedPoints.length; ++p){
					var point2D = includedPoints[p];
					var point3D = point2D.point3D();
					// this.initNewPointPatch3D(newPoint3D, false);
					var location3D = point3D.globalPoint3DLinear();
					if(doInsert){
						world.updatePoint3DLocation(point3D,location3D);
					}else{
						point3D.point(location3D);
					}
				}
				
	// 			throw "after optimize"
			}



			var viewID = view.id();
			viewsResolved[viewID] = view;
			if(i==2){
				break;
			}
		}

		// initialTransforms update
		// var initialTransforms = [];
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var ext = view.absoluteTransform();
			initialTransforms[i] = ext.copy();
		}

	} // outer loop
		// TODO: update 
		
	var str = world.toYAMLString();
	console.log(str);
	console.log(world);

	throw "after loop outside"

	// ??



// initGraphSequential

	throw "solveOptimizeSequential";
}



Stereopsis.useOldTransformsToEstimateNewScales = function(views, oldTransforms, newTransforms, pairs){ // assuming absolute transforms
// console.log("useOldTransformsToEstimateNewScales: "+views.length);
// console.log(views, oldTransforms, newTransforms, pairs);
	var pairIDFromViewIDs = function(a,b){
		return a<b ? a+"-"+b : b+"-"+a;
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
	var viewIDToScale = {};
	var viewIDToIndex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		viewIDToIndex[viewID] = i;
	}

	var pairLookup = {};
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var viewIDA = pair["A"];
		var viewIDB = pair["B"];
		var pairID = pairIDFromViewIDs(viewIDA,viewIDB);
		pairLookup[pairID] = pair;
	}

	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var viewIDA = viewA.id();
		var viewDataA = viewA.data();
		var viewIndexA = viewIDToIndex[viewIDA];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var viewIDB = viewB.id();
			var viewDataB = viewB.data();
			var viewIndexB = viewIDToIndex[viewIDB];
			var pairID = pairIDFromViewIDs(viewDataA,viewDataB);
// console.log(pairID);
			var pair = pairLookup[pairID];
			if(pair){
console.log(pairID+" = "+viewIDA+" & "+viewIDB+" = "+viewIndexA+" & "+viewIndexB+" OF "+oldTransforms.length);
				var transformA = oldTransforms[viewIndexA];
				var transformB = oldTransforms[viewIndexB];

				var relativeExtrinsicOriginal = Matrix.relativeReference(transformA,transformB);
				var distanceO = relativeExtrinsicOriginal.multV3DtoV3D(new V3D(0,0,0));
					distanceO = distanceO.length();
				// NEW
				var transformA = newTransforms[viewIndexA];
				var transformB = newTransforms[viewIndexB];
				var relativeExtrinsicSkeleton = Matrix.relativeReference(transformA,transformB);
				var distanceS = relativeExtrinsicSkeleton.multV3DtoV3D(new V3D(0,0,0));
					distanceS = distanceS.length();
				var ratio = distanceS/distanceO;
				console.log("ratio: "+ratio);
				// edgeInfos[pairID] = {"ratio":ratio};
				// add to each skeleton view list
				addToScaleTable(viewIDToScale,viewIDA,ratio);
				addToScaleTable(viewIDToScale,viewIDB,ratio);
			}else{
				// console.log("no pair for both: "+viewIDA+" & "+viewIDB);
			}
			
		}
	}
	// console.log(viewIDToScale);

	var viewScales = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var entry = viewIDToScale[viewID];
		console.log(entry);
		if(entry){
			// throw "entry";
			var value = entry["sum"]/entry["count"];
				value = Math.exp(value);
console.log("new scale: "+value);
			viewScales[i] = value;
		}else{
			viewScales[i] = 1.0;
		}
	}

	// if(views.length>1){
	// 	throw "now have more to test"
	// }


	return viewScales;

	throw "useOldTransformsToEstimateNewScales"
}
Stereopsis.useOldTransformsToEstimateNewTransforms = function(oldTransforms,oldReference,newTransforms,newScales,percents){ // assuming absolute transforms
	console.log(oldTransforms,oldReference,newTransforms,newScales,percents);
	var transforms = [];
	for(var i=0; i<oldTransforms.length; ++i){
		
		// FROM ORIGINAL
		var leafAbsolute = oldReference;//viewIDToTransformOriginal[leafID];
		var skelAbsolute = oldTransforms[i];//viewIDToTransformOriginal[skeletonID];
		var relativeOriginal = Matrix.relativeReference(skelAbsolute,leafAbsolute);

console.log("SKEL A:\n"+skelAbsolute);
		// ???
		var skeletonScale = newScales[i];
		console.log("SCALE: "+skeletonScale);
			relativeOriginal = Matrix.transform3DScaleMatrix(relativeOriginal, skeletonScale);
		// TO NEW
		var skelNewAbsolute = newTransforms[i];
		var transform = Matrix.mult(skelNewAbsolute,relativeOriginal); // B = A' * (A^-1*B) =  skelAbsNew * (skelAbsOld^-1 * leafAbsOld) = leafAbsNew
		transforms.push(transform);
	}
	// console.log(percents);
	var average = Code.averageMatrices3D(transforms, percents);
	// console.log(average);
	// throw "..."
	return average;
}

Stereopsis.World.prototype.initGraphOptimizeSequential = function(pairInfo){
	var world = this;
	var allViews = world.toViewArray();
	var allPoints = world.toPointArray();
	var allTransforms = world.toTransformArray();
	var allCameras = world.toCameraArray();


	console.log("_initGraphSequential");
	console.log(allViews);
	console.log(allPoints);
	console.log(allTransforms);
	console.log(allCameras);
	// throw "out"
	// console.log(info);

	// create graph
	var graph = new Graph();
	console.log(graph);

	var viewIDToVertex = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		// var viewID = view["id"];
		var viewID = view.data(); // TODO ...
		// console.log(view);/
		var vertex = graph.addVertex();
		var data = {};
		data["view"] = view;
		data["id"] = viewID;
		// data["view"] = view;
		// data["view"] = view;
		vertex.data(data);
		viewIDToVertex[viewID] = vertex;
	}
	var vertexes = graph.vertexes();
console.log("vertexes");
	console.log(vertexes);

/*
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
*/

// console.log(viewIDToVertex);
for(var i=0; i<pairInfo.length; ++i){
	var info = pairInfo[i];
	// console.log(info);
	var idA = info["A"];
	var idB = info["B"];
	// var matchCount = info["matches"];
	var matchCount = info["tracks"];
	if(matchCount==0){
		continue;
	}
	var matchError = info["relativeError"];
	var edgeWeight = matchCount/matchError;
	var vertexA = viewIDToVertex[idA];
	var vertexB = viewIDToVertex[idB];
	// console.log(vertexA,vertexB);
	var edge = graph.addEdgeDuplex(vertexA,vertexB,edgeWeight); ///, Graph.Edge.DIRECTION_DUPLEX);
	edge.data(info);
}

	var edges = graph.edges();
console.log("edges");
	console.log(edges);
// throw "..."

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
						// only include weights of vertexes on inside=
						if(edge.opposite(vertex).data()["inside"]){
							// console.log("found opposite inside: ",edge.opposite(vertex));
							// var weight = edge.weight();
							var weight = 1;
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
	console.log(bestVertex);
	// throw "...."
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
	for(var i=0; i<9999; ++i){
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

	console.log(steps);

	return sequentialData;


	// throw "sequentialData";
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.sequentiallyViewsOrder = function(){
	// TODO: get views order based on high connectivity & low error
	var views = Code.objectToArray(this._views);
	//var connectivity = {};
	var transforms = this._transforms;
	console.log(transforms);
	var keys = Code.keys(transforms);
	// create graph:
	var vertexLookup = {};
	var graph = new Graph();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var vertex = graph.addVertex();
		vertex.data([view]);
		vertexLookup[view.id()+""] = vertex;
	}
	
	for(var k=0; k<keys.length; ++k){
		var key = keys[k];
		var transform = transforms[key];
		//console.log(transform);
		var connectivityWeight = transform.matchCount();
		var errorR = transform.rMean();
		if(errorR){
			connectivityWeight = connectivityWeight / errorR;
		}
		if(connectivityWeight==0){
			continue;
		}
		var viewAID = transform.viewA().id();
		var viewBID = transform.viewB().id();
		var vertexA = vertexLookup[viewAID+""];
		var vertexB = vertexLookup[viewBID+""];
		graph.addEdgeDuplex(vertexA,vertexB,connectivityWeight);
		/*
		
		if(!connectivity[viewAID]){
			connectivity[viewAID] = 0;
		}
		if(!connectivity[viewBID]){
			connectivity[viewBID] = 0;
		}
		connectivity[viewAID] += connectivityWeight;
		connectivity[viewBID] += connectivityWeight;
		*/
	}
	console.log(graph);
	

var printGraph = function(graph, offset){

	var info = graph.display2D(false);
	console.log(info);

	var info = graph.display2D();

	var positions = info["positions"];
	var vertexes = info["vertexes"];
	var edges = info["edges"];

	var vertexIDtoIndex = {};
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		vertexIDtoIndex[vertex.id()] = i;
	}


	var worldScale = 400.0;
	var rad = 0.01;
	var worldOffset = new V2D(300 + offset,300);
	for(var i=0; i<positions.length; ++i){
		var vertex = vertexes[i];
		var position = positions[i];
		var isLeaf = vertex.data()["leaf"];
		// CIRCLES
			var p = new V2D(position.x*worldScale,position.y*worldScale);
			var d = new DO();

			if(isLeaf){
				d.graphics().setLine(2.0,0xFFFF0000);
			}else{
				d.graphics().setLine(2.0,0xFF0000FF);
			}
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y,rad*worldScale);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.matrix().translate(worldOffset.x, worldOffset.y);
			GLOBALSTAGE.addChild(d);
		// LABEL:
		// var label = indexToLetter[vertex.id()]["n"];

// console.log(vertex.data()[0].id())

		//var label = vertex.id();
var label = "";
var vs = vertex.data();
console.log(vs);
for(var s=0; s<vs.length;++s){
	label = label+"-"+vs[s].id();
}

		var d = new DOText(""+label, 14, DOText.FONT_ARIAL, 0xFF009900, DOText.ALIGN_CENTER);
			d.matrix().translate(worldOffset.x - 0 + p.x, worldOffset.y - 10 + p.y);
			GLOBALSTAGE.addChild(d);
	}

	// edges
	var d = new DO();
	
	GLOBALSTAGE.addChild(d);
	for(var i=0; i<edges.length; ++i){
		
		var edge = edges[i];
		var vA = edge.A();
		var vB = edge.B();
		var idA = vA.id();
		var idB = vB.id();
			idA = vertexIDtoIndex[idA];
			idB = vertexIDtoIndex[idB];
		var positionA = positions[idA];
		var positionB = positions[idB];

		d.graphics().setLine(1.0,0xFF006600);

		positionA = positionA.copy();
		positionA.scale(worldScale);
		positionB = positionB.copy();
		positionB.scale(worldScale);

		d.graphics().beginPath();
		d.graphics().moveTo(positionA.x,positionA.y);
		d.graphics().lineTo(positionB.x,positionB.y);
		d.graphics().endPath();
		d.graphics().strokeLine();

		// var label = edge.weight();
		//var label = edge.data()[0].id();
		var label = "";
		/*
		var t = new DOText(""+label, 14, DOText.FONT_ARIAL, 0xFF000099, DOText.ALIGN_CENTER);
		var p = V2D.avg(positionA,positionB);
			t.matrix().translate(worldOffset.x - 0 + p.x, worldOffset.y - 0 + p.y);
			GLOBALSTAGE.addChild(t);
			*/
	}
	
	d.matrix().translate(worldOffset.x, worldOffset.y);
}








	var vertexes = Code.objectToArray(vertexLookup);
	var maxVertex = null;
	var maxCount = 0;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var edges = vertex.edges();
		var count = 0;
		for(var j=0; j<edges.length; ++j){
			var edge = edges[j];
			var weight = edge.weight();
			count += weight;
		}
		if(maxVertex==null || count>maxCount){
			maxVertex = vertex;
			maxCount = count;
		}
	}
	console.log(maxVertex);
	var currentVertex = maxVertex;


	console.log("BEST VERTEX:  "+currentVertex.data()[0].id());

	var mergeVertexFxn = function(next, a,b){
		var dataA = a.data();
		var dataB = b.data();
		var dataC = Code.arrayPushArray(dataA,dataB);
		console.log(dataC);
		next.data( dataC );
	}




var ccc = 0;
	while(ccc<10){

	printGraph(graph, 400 * ccc);
console.log(graph.vertexes().length);
		var edges = currentVertex.edges();
		console.log(edges)
		if(edges.length==0){
			console.log("no more edges");
			break;
		}
		var bestEdge = null;
		var bestWeight = 0;
		for(var i=0; i<edges.length; ++i){
			var edge = edges[i];
			var weight = edge.weight();
			if(bestEdge==null || weight>bestWeight){
				bestEdge = edge;
				bestWeight = weight;
			}
		}
		console.log(bestWeight);
		var nextVertex = bestEdge.opposite(currentVertex);
		console.log(nextVertex);
		console.log("CURRENT VERTEX:  "+currentVertex.data()[0].id());
		console.log("NEXT VERTEX:  "+nextVertex.data()[0].id());
console.log("MERGE VERTEXES ........................................................ "+ccc+" @ ");
		var mergedVertex = graph.mergeVertexes(currentVertex, nextVertex, mergeVertexFxn);
		currentVertex = mergedVertex;
++ccc;
	}


//console.log("VERTEXES:");
//console.log(graph.vertexes());
	printGraph(graph, 400 * ccc);


	var viewList = currentVertex.data();
	console.log(viewList);

	return viewList;
}
Stereopsis.World.prototype.sequentiallyOptimizeViews = function(something){
	var workOrderedViews = this.show???();
	console.log(workOrderedViews);
	// store original view absolute transforms
	var originalAbsoluteViewTransforms = {};
	for(var i=0; i<workOrderedViews.length; ++i){
		var view = workOrderedViews[i];
		var viewID = view.id();
		originalAbsoluteViewTransforms[viewID+""] = view.absoluteTransform().copy();
	}

	console.log(originalAbsoluteViewTransforms);
// set first 2 default views [highest connectivity / lowest average sigma error (R,...)]



// optimize first 2 views using reprojection error
	var viewA = workOrderedViews[0];
	var viewB = workOrderedViews[1];

	var pointSpaceA = viewA.pointSpace();
	var points2DA = pointSpaceA.toArray();
	console.log(points2DA);
	var points3DAB = [];
	for(var i=0; i<points2DA.length; ++i){
		var point2DA = points2DA[i];
		var point3D = point2DA.point3D();
		var point2DB = point3D.point2DForView(viewB);
		if(point2DB != null){
			points3DAB.push(point3D);
		}
	}
	//var points3DA = viewA.points3D();

	console.log(points3DAB);
	/*
	get all 3D points that the 2 views have in common
	iterate:
		- estimate 3D point positions using pairwise view R
		- iterate: [keep at least 100 points, stop when R error difference goes below threshold, stop when iteration count > 10]
			- throw out worst 3D points based on:
				- R 2 sigma
				- F 2 sigma
			- nonlinear optimize points using R error
	=> have a good R between pairs
	*/

// add a new view to list & optimize addition
	/*
		estimate new view absolute transform based on original transforms:
			- for each prev/existing view:
				- calculate OLD relative transform
				- estimate relative scale change of prev view OLD relative & new relative 
				- scale the translation part of relative transform based on new/old scale
				- append relative transform to new absolute location
			- average N absolute views (TODO: use a relative error percentage)
				- can do independently/separately: scale, translation, rotation
				- can do all together?
			- set new absolute view transform
		optimize new view orientation:
			iterate:
				- 
	*/


// TODO: TRY add third view & optimize first 3 views randomly using location metrics ???

// 

	throw "get this working with reprojection error first"

/*
- for each new view:
	- set new location based on original offsets + new relative changes
		- get overall new scale difference [survey baseline distances of all SET views]
		- get expected position location from each view
		- get expected rotation location from each view
		=> average everything
		=> set value
	- optimize via: reprojection error
	- optimize via: 3D (surface) distance error
	- optimize via: 3D (local) rotation angle error

	- for each optimization:
		- find & throw (or ignore) outliers (new OR? existing points?)
		- try different variations of the metrics
			- squared v sqrt
			- neighborhood averaging
			- other averaging
			...
*/

	/*
	- 2D surface distance
		- maybe averaging a few 3D points ?
	- 3D normal 1D angle distance
	- 3D rotation 3D axis distance
	*/


/*

- are points completely separate?
	=> YES
- need original graph info as views can drift
	- the new position is some offset of old position & new adjacent view locations
- need ordered list of views to optimize on





*/

throw "sequentiallyOptimizeViews";
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveOptimizeSingleViewReprojection = function(viewSolve, pairInfo, loopIterations){

	throw "is this known to work? - solveOptimizeSingleViewReprojection"
	loopIterations = Code.valueOrDefault(loopIterations, 10);

	var world = this;

	console.log(pairInfo);

	console.log(viewSolve);

	console.log(world);

	// init patches
	world.createAllPoints3DPatches();
	world.relativeFFromSamples();
	world.estimateGlobalErrors();
	
	var maxIterations = 4;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("LOOP: "+iteration+" / "+maxIterations+" ......... - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - . - ");


		// filter worst
/*
		var sigmaDropping = 5.0;
		
		world.filterPairwiseErrors(sigmaDropping);
		world.filterGlobalErrors(sigmaDropping);
		// world.filterNeighborConsistency2D3D();
		// world.filterNeighborConsistency2DViews();
		// world.filterGlobalNegativeDepth();
		var sigmaDroppingPatches = 3.0;
		world.filterGlobalPatchVisibilityConsistency(sigmaDroppingPatches);
		world.filterLocalError2D(sigmaDropping);
		world.filterLocalError3D(sigmaDropping);
*/

		// optimize reprojection error
		// var iterationsUpdateViewSingle = 100;
		// world.refineSelectCameraMultiViewTriangulation(viewSolve, iterationsUpdateViewSingle);


		// optimize structure difference
		var iterationsUpdateViewSingle = 100;
		world.refineSelectCameraByLocalGeometryMatching3D(viewSolve, iterationsUpdateViewSingle);



		world.copyRelativeTransformsFromAbsolute();

		// reset point patches
		world.createAllPoints3DPatches();


		world.estimateGlobalErrors();

		

	}

	
}
Stereopsis.World.prototype.solveOptimizeSingleViewStructure = function(viewSolve, loopIterations){
	loopIterations = Code.valueOrDefault(loopIterations, 10);

	throw "solveOptimizeSingleViewStructure"
}



Stereopsis.World.prototype.solveOptimizeSingleView = function(viewSolve, loopIterations, doWorldOptimization){ // move view to a more optimal position - no point3D updates
	console.log("solveOptimizeSingleView");
	doWorldOptimization = Code.valueOrDefault(doWorldOptimization, true);
	// assume all views set up in absolute positions
	var world = this;
	var minimumMatchNeighborCount = 16;
	var iterationsMain = 500; // 100 - 1000
	var iterationsNeighbors = 100; // 10 - 100
	var iterationsAll = 10; // 10 - 20

	iterationsMain = 500;
	iterationsNeighbors = 50;
	iterationsAll = 10;

	var neighborViews = world.neighborsFromView(viewSolve, minimumMatchNeighborCount);
	console.log("neighborViews: ");
	console.log(neighborViews);

	// make sure done already
	world.copyRelativeTransformsFromAbsolute();
	world.estimate3DErrors(true);


// console.log(world);
// console.log(world.toPointArray());

// throw "IS THIS REALLY THE ERROR ??????????"
	// var startingErrorR = viewSolve.averageReprojectionError();
	var startingErrorR = viewSolve.track3AverageError();
	console.log("startingErrorR: "+startingErrorR);

// throw "HERE";
	world.printPoint3DTrackCount();
	var maxIterations = Code.valueOrDefault(loopIterations, 3);
	var prevErrorR = startingErrorR;
	var nextErrorR = startingErrorR;
console.log("RICHIE - maxIterations: "+maxIterations+" @ world: "+doWorldOptimization);
	for(var i=0; i<maxIterations; ++i){
if(doWorldOptimization){
	console.log("SKIP - doWorldOptimization")
break; // don't do single
}
		console.log(" iteration: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: "+i+"/"+maxIterations+" ("+viewSolve.id()+") ");
		
		// self
		var result = world.refineSelectCameraMultiViewTriangulation(viewSolve, iterationsMain);
		// world.copyRelativeTransformsFromAbsolute();
		// neighbors
		for(var v=0; v<neighborViews.length; ++v){
			var view = neighborViews[v];
			world.refineSelectCameraMultiViewTriangulation(view, iterationsNeighbors);
			// world.copyRelativeTransformsFromAbsolute();
		}
		// worldwide
		// if(doWorldOptimization){
		// 	var result = world.refineAllCameraMultiViewTriangulation(iterationsAll, false);
		// }

		// copy absolutes back to transforms:
		world.copyRelativeTransformsFromAbsolute();

		// if a view is in front of all its points (50%?) => move camera to COM of points ?


		// UPDATE POINT LOCATIONS:
		world.updatePoint3DLocations();

		// PATCHES - don't care
		// world.initAllP3DPatches();
		// world.patchInitBasicSphere(true);
			
		// nextErrorR = viewSolve.averageReprojectionError();
		nextErrorR = viewSolve.track3AverageError();
		var delta = nextErrorR - prevErrorR;
		prevErrorR = nextErrorR;
		var ratio = startingErrorR!=0 ? Math.abs(delta/startingErrorR) : 0;
		console.log("DELTA: "+delta+" @ "+ratio);
// throw "HERE 2";
		// if(ratio<0.00001){ // static
		// 	console.log("break early");
		// 	break;
		// }
	}

	// worldwide - only once, outside interrior loop





console.log("doWorldOptimization: "+doWorldOptimization);

	if(doWorldOptimization){
		world.setResolutionProcessingModeFromOnly2D();


// iterationsAll = 100;
// iterationsAll = 10;
// iterationsAll = 25;
iterationsReprojectionAll = 5;
		
		// var worldIterations = 20;
		// var worldIterations = 15;
		// var worldIterations = 10;
		var worldIterations = 5;
		// var worldIterations = 3;
		// var worldIterations = 2;
		// var worldIterations = 1;
		for(var i=0; i<worldIterations; ++i){
			

// if(i==0){ // just on first round?

			console.log("use relative point transforms to move cameras toward average location");

			world.optimizePairTransformsFromMappingP3D();


			// world.estimate3DErrors(true);


			// RE-INITIALIZE POINT ABSOLUTE LOCATIONS:
			world.setResolutionProcessingModeFromOnly2D();
			world.initAllP3DPatches();
			world.initAffineFromP3DPatches();

			world.estimate3DErrors(true);

			// world.dropNegativePoints3D();
			// world.dropNegativeMatches3D();
			world.filterGlobalMatches(false, 0, 3.0,5.0,9.0,9.0, false);

			console.log("STEP A:");
			world.printPoint3DTrackCount();



			// 

			// var allViews = world.toViewArray();
			// var viewA = allViews[3];
			// var viewB = allViews[6];
			// console.log(viewA,viewB);
			// world.optimizeCamerasFromSurfaceDistanceMapping3D([viewA,viewB]);
			world.optimizeCamerasFromSurfaceDistanceMapping3D();
			

			world.setResolutionProcessingModeFromOnly2D();
			world.initAllP3DPatches();
			world.initAffineFromP3DPatches();

			world.estimate3DErrors(true);

			// world.dropNegativePoints3D();
			// world.dropNegativeMatches3D();
			world.filterGlobalMatches(false, 0, 3.0,5.0,9.0,9.0, false);

			console.log("STEP A-2:");
			world.printPoint3DTrackCount();

// break;
			// continue;

// }



// return {"deltaR":0, "errorR":0};
// break; // just do this one thing
// throw "..."


			// var transform = Code.transform3DFromPointMatches(pointsA, pointsB);

			// calculate half of transform
			// calculate half of transform inverse
			// see if points meet up in middle


			// // perturb cameras somewhat to get them moving around to allow gradient descent to help
			// if(i==0){
			// 	// simulated annealing - to keep away from local minima => & reach global minima
			// 	console.log("simulated annealing");
			// 	world.agitateViewCamerasFromError();
			// 	// after cameras change absolute/relative location, patches change too:
			// 	world.initAllP3DPatches();
			// }



			var result = world.refineAllCameraMultiViewTriangulationGD(iterationsReprojectionAll, false);

			// world.copyRelativeTransformsFromAbsolute();

			world.setResolutionProcessingModeFromOnly2D();
			world.initAllP3DPatches();
			world.initAffineFromP3DPatches();
			world.estimate3DErrors(true);


			// var iterationsLM = 10;
			// var result = world.refineAllCameraMultiViewTriangulationLM(iterationsLM, false);
			// world.setResolutionProcessingModeFromOnly2D();
			// world.initAllP3DPatches();
			// world.initAffineFromP3DPatches();
			// world.estimate3DErrors(true);



			// world.dropNegativeMatches3D();
			// world.dropNegativePoints3D();
			world.filterGlobalMatches(false, 0, 3.0,5.0,9.0,9.0, false);



			// world.estimate3DErrors(true);

			console.log("STEP B:");
			world.printPoint3DTrackCount();
			

		}
		// do patches need to be updated ?
	}

	world.filterGlobalMatches(false, 0, 3.0,5.0,9.0,9.0, false);

	world.printPoint3DTrackCount();

	// world.refinePoint3DAbsoluteLocation(null, 50);

	world.estimate3DErrors(true);
	world.printPoint3DTrackCount();


nextErrorR = viewSolve.track3AverageError();

	

	// puts points at calculated locations
	// world.estimate3DErrors(true);
	// world.averagePoints3DFromMatches();

	var endingErrorR = nextErrorR;
	var differenceErrorR = endingErrorR - startingErrorR;
	console.log("starting: "+startingErrorR);
	console.log("  ending: "+endingErrorR);
	console.log("  delta: "+differenceErrorR);
	// throw "before exit solveOptimizeSingleView"
	
	return {"deltaR":differenceErrorR, "errorR":endingErrorR};
}

Stereopsis.World.prototype.agitateViewCamerasFromError = function(views){
	var world = this;
	if(!views){
		views = world.toViewArray();
	}

	var cameraErrors = [];
	// for each camera
	var newExtrinsics = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var absolute = view.absoluteTransformInverse();
		var errorR = view.averageReprojectionError();
		var Kinv = view.Kinv();
		// console.log("errorR: "+errorR);
		cameraErrors[i] = errorR;
		var pointSpace = view.pointSpace();
		// get all P3Ds
		var points2D = pointSpace.toArray();
		// find average COM of P3Ds
		// console.log(points2D);
		var p3Ds = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p3D = point2D.point3D();
			p3D = p3D.point();
			p3Ds.push(p3D);
		}
		// get ray to P3D
		// console.log(p3Ds);
		var com3D = V3D.average(p3Ds);
		// console.log("com3D: "+com3D);
		// project to P2D
		var com2D = view.projectPoint3D(com3D);
		// console.log("com2D "+com2D);
		// add error offset @ +x,+y
		var errorX = errorR*1.0;
		var errorY = errorR*1.0;
		// console.log("error "+errorX+","+errorY);
		var error2D = com2D.copy().add(errorX,errorY);
		// get ray to P3D
		var ray3D = R3D.projectPoint2DToCamera3DRay(com2D, absolute, Kinv, null);
		var dir3DCOM = ray3D["d"];
		ray3D = R3D.projectPoint2DToCamera3DRay(error2D, absolute, Kinv, null);
		var dir3DERR = ray3D["d"];
// console.log(error2D+" - "+com2D);
		var angle3D = V3D.angle(dir3DCOM,dir3DERR);
		console.log("errorR: "+errorR+" - ANGLE 3D: "+Code.degrees(angle3D));
		// var intersection = Code.intersectRayPlane(o3D,d3D, newLocation3D,newNormal3D); // PLANAR INTERSECTION -- requires normals first
		// var distance = V3D.distance(intersection,newLocation3D);
		// project ray

		// get ray angle
// var ray3D = R3D.projectPoint2DToCamera3DRay(dir2D, absolute, Kinv, null);
// var o3D = ray3D["o"];
// var d3D = ray3D["d"];
// var intersection = Code.intersectRayPlane(o3D,d3D, newLocation3D,newNormal3D); // PLANAR INTERSECTION -- requires normals first
// var distance = V3D.distance(intersection,newLocation3D);
		// get X,Y,Z random angles & updata extrinsic with rotation offset

		// ...

		// angle3D *= 0.5;
		angle3D *= 0.25;

		var rotateAngle = 0;
		var matrixRandomRotation = new Matrix(4,4).identity();
			// X
			rotateAngle = (Math.random()-0.5)*angle3D;
			matrixRandomRotation = Matrix.transform3DRotateX(matrixRandomRotation,rotateAngle);
			// Y
			rotateAngle = (Math.random()-0.5)*angle3D;
			matrixRandomRotation = Matrix.transform3DRotateY(matrixRandomRotation,rotateAngle);
			// Z
			rotateAngle = (Math.random()-0.5)*angle3D;
			matrixRandomRotation = Matrix.transform3DRotateZ(matrixRandomRotation,rotateAngle);

// 			Matrix.transform3DRotateX = function(a,angle){
// 	var c = Math.cos(angle), s = Math.sin(angle);
// 	var b = Matrix._transformTemp3D.fromArray([1.0,0.0,0.0,0.0, 0.0,c,-s,0.0, 0.0,s,c,0.0, 0.0,0.0,0.0,1.0]);
// 	return Matrix.mult(b,a);
// }
// Matrix.transform3DRotateY = function(a,angle){
// 	var c = Math.cos(angle), s = Math.sin(angle);
// 	var b = Matrix._transformTemp3D.fromArray([c,0.0,s,0.0, 0.0,1.0,0.0,0.0, -s,0.0,c,0.0, 0.0,0.0,0.0,1.0]);
// 	return Matrix.mult(b,a);
// }
// Matrix.transform3DRotateZ = function(a,angle){
		var newAbsolute = Matrix.mult(matrixRandomRotation,absolute);
		// console.log(newAbsolute+"");
		var newExtrinsic = Matrix.inverse(newAbsolute);
		newExtrinsics.push(newExtrinsic);

		// HOW TO DO TRANSLATION?
	}

	// set now with changes all at once
	for(var i=0; i<views.length; ++i){
		var newExtrinsic = newExtrinsics[i];
		var view = views[i];
		view.absoluteTransform(newExtrinsic);
	}

	world.copyRelativeTransformsFromAbsolute();
	// world.updateP3DPatchesFromAbsoluteOrientationChange();

	// get cammera error

	// for each camera

	// rotate some random angle (X,Y,Z) based on average error
		// average P3D location ?
		// ray thru center
		// ray thru + pixel error
		// get angle
	// move some random direction (X,Y,Z) based on average error
		//
		// limit = half-planes

	// throw "agitateViewCamerasFromError";
}


Stereopsis.World.prototype.resolveNegativeTransforms = function(){
	var world = this;
	var transforms = world.toTransformArray();
	// var matchCounts = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var countBehind = 0;
		var countTotal = 0;
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransformInverse();
		var absB = viewB.absoluteTransformInverse();
		var centerA = viewA.center();
		var centerB = viewB.center();
		var normalA = viewA.normal();
		var normalB = viewB.normal();
		// console.log(matches);
		// var matrixA = new Matrix(4,4).identity();
		// var matrixB = transform.R();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			var location3D = point3D.point();
			var pA = V3D.sub(location3D,centerA);
			var pB = V3D.sub(location3D,centerB);
			var dotA = V3D.dot(pA,normalA);
			var dotB = V3D.dot(pA,normalB);
			if(dotA<=0 || dotB<=0){
				++countBehind;
			}
			++countTotal;
		}
		var percentBehind = countBehind/countTotal;
		console.log("TRANSFORM: "+i+" = "+percentBehind+" ("+countBehind+") ");
	}
}


Stereopsis.World.prototype.refineAllCameraKMatrixes = function(maxIterations, onlyLongTracks, maximumPoints3D){
	var world = this;
	console.log("refineAllCameraKMatrixes .......................... ");
	var views = world.toViewArray();
	var cameras = world.toCameraArray();
	var points3D = world.toPointArray();

	// get all cameras K
	var normalizedKs = [];
	var cameraIDToIndex = {};
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		normalizedKs.push(camera.K());
		cameraIDToIndex[camera.id()] = i;
	}

	// get all view info
	var viewCameraIndexes = [];
	var viewExtrinsics = [];
	var viewImageSizes = [];
	var viewIDToIndex = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		viewCameraIndexes.push( cameraIDToIndex[view.camera().id()] );
		viewExtrinsics.push( view.absoluteTransform() );
		viewImageSizes.push( view.size() );
		viewIDToIndex[view.id()] = i;
	}

	// get subset of all points3D
	var desiredP3DCount = Math.max(250,cameras.length*100); // 100 - 1000 points
	if(points3D.length>desiredP3DCount){
		var minSizeForRepeat = desiredP3DCount*10; // 10% repeats
		if(points3D.length>minSizeForRepeat){
			points3D = Code.randomSampleRepeats(points3D, desiredP3DCount);
		}else{
			Code.randomPopArray(points3D, desiredP3DCount);
		}
	}
	console.log("points3D count: "+points3D.length);

	var pointGroups2D = [];
	var pointGroupsViewIndexes = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var pointList = [];
		var indexList = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var view = point2D.view();
			var viewIndex = viewIDToIndex[view.id()];
			pointList.push(point2D.point2D());
			indexList.push(viewIndex);
		}
		pointGroups2D.push(pointList);
		pointGroupsViewIndexes.push(indexList);
	}
console.log(pointGroups2D);
	// construct data structures
	// console.log(normalizedKs, viewCameraIndexes, viewExtrinsics, viewImageSizes, pointGroups2D, pointGroupsViewIndexes, maxIterations)

	// pass to R3D algorithm
	var result = R3D.optimizeCameraKIntrinsicNonlinear(normalizedKs, viewCameraIndexes, viewExtrinsics, viewImageSizes, pointGroups2D, pointGroupsViewIndexes, maxIterations);
	var output = result["K"];
	console.log(result);
	console.log(cameras[0].K().toArray());
	console.log(output[0].toArray());
	
	// throw "refineAllCameraKMatrixes";
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		camera.K( output[i] );
	}
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.camera( view.camera() ); // update internal params
	}
}


Stereopsis.World.prototype.refineAllCameraMultiViewTriangulationLM = function(maxIterations, onlyLongTracks, maximumPoints3D){
	onlyLongTracks = Code.valueOrDefault(onlyLongTracks, false);
	var onlyZError = false;
	var world = this;

	var views = world.toViewArray();
	var points3D = world.toPointArray();

	var multiplierView = Math.sqrt(views.length);
	maximumPoints3D = Code.valueOrDefault(maximumPoints3D, Math.round(100 * multiplierView) ); // 100-1000 per view

	var listViewExts = [];
	var listViewKs = [];
	var listViewKinvs = [];
	var listViewCenters3D = [];
	
// maximumPoints3D = 200;
maximumPoints3D = 100;

	if(!maxIterations){
		maxIterations = 100*views.length;
		maxIterations = Math.min(maxIterations, 100);
	}

	console.log("refineAllCameraMultiViewTriangulation: "+maxIterations+" MAX POINTS: "+maximumPoints3D+" / "+points3D.length);

	// populate view related arrays
	var viewIDToIndexHash = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var P = view.absoluteTransform();
		var K = view.K();
		var Kinv = view.Kinv();
		var center = view.center();
		listViewExts.push(P);
		listViewKs.push(K);
		listViewKinvs.push(Kinv);
		listViewCenters3D.push(center);
		viewIDToIndexHash[view.id()] = i;
	}

	// get camera volume:
	var center3D = V3D.average(listViewCenters3D);
	var distances3D = [];
	for(var i=0; i<listViewCenters3D.length; ++i){
		var center = listViewCenters3D[i];
		distances3D[i] = V3D.distance(center3D,listViewCenters3D[i]);
	}
	var volumeSigma = Code.averageNumbers(distances3D);
	console.log("volumeSigma: "+volumeSigma);
	var positionAccuracy = volumeSigma*1E-10;
	var rotationAccuracy = Code.radians(1.0)*1E-4;
	console.log("accuracy: "+positionAccuracy+" & "+rotationAccuracy);
	// 
	// console.log(" points total : "+points3D.length+" / "+maximumPoints3D);
	// // trim out non-long tracks
	// if(onlyLongTracks){
	// 	for(var i=0; i<points3D.length; ++i){
	// 		var point3D = points3D[i];
	// 		var points2D = point3D.toPointArray();
	// 		if(points2D.length<=2){ // want more than 1 match (2 views)
	// 			Code.removeElementAt(points3D,i);
	// 			--i; // redo
	// 		}
	// 	}
	// 	console.log(" tracks total : "+points3D.length+" / "+maximumPoints3D);
	// }
	// trim down sample
	if(points3D.length>maximumPoints3D){
		console.log("SUBSAMPLE "+points3D.length+" -> "+maximumPoints3D);
		Code.randomPopArray(points3D,maximumPoints3D);
	}
	
	// populate P3D entries - including P2Ds
	var listPoints3D = [];
	
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var entryP3D = [];
		for(var j=0; j<points2D.length; ++j){
			var p2D = points2D[j];
			var view = p2D.view();
			var viewID = view.id();
			var viewIndex = viewIDToIndexHash[viewID];
			var entryP2D = [p2D.point2D(),viewIndex];
			entryP3D.push(entryP2D);
		}
		listPoints3D.push(entryP3D);
	}

/*

list of P2D [known quantities]
list of index: mapping P2D to view P matrix
list of index: mapping P2D to P3D
list of view P matrixes [calculated from params]
list of P3D points [temp: calculated from P]
list of indexes: mapping P3D to N P2Ds

constructing error estimates:
	restimate P3Ds based on camera params:
		for each P3D
			get P2D indexes
			for each P2D
			put into array
			triangulate P3D
	estimate error:
		for each P2D
			get P3D
			get view index
			project to view
			error = x-x,y-y or distance

*/



	// reusable structures for LM iteration:
	var listM = [];
	for(var i=0; i<listViewExts.length; ++i){
		var P = listViewExts[i];
		listM[i] = P.copy();
	}
	console.log("listM:");
	console.log(listM);
	// console.log("onlyErrorZ: "+onlyErrorZ);
	// var args = [listM, listK, listKinv, listPoints2D, negativeIsBad, onlyErrorZ, new V3D(), new V3D()];
	// var x = [];
	// var planarEpsilon = [];
	// var singleEpsilon = [positionAccuracy,positionAccuracy,positionAccuracy,rotationAccuracy,rotationAccuracy,rotationAccuracy];
	var initialParameters = [];
	for(var i=0; i<listM.length; ++i){
		var M = listM[i];
		var y = R3D.transformMatrixToComponentArray(M);
		Code.arrayPushArray(initialParameters,y);
	}
	console.log("initialParameters:");
	console.log(initialParameters);


/*
		// SPEEDUP - REUSE MATRIX
		var cols = 4;
		var rows = 2*points2D.length;
		var reuseA = R3D._transformCameraAllExtrinsicDLTNonlinearGD_TEMP_A;
		if(!reuseA || reuseA.rows()!=rows || reuseA.cols()!=cols){
			reuseA = new Matrix(rows,cols);
			R3D._transformCameraAllExtrinsicDLTNonlinearGD_TEMP_A = reuseA;
		}

*/

	var errorFxn = function(parameters,errors, args, changeParameterIndex){
		var viewCount = listM.length;
		var points3DCount = listPoints3D.length;
		var reusePoint3DTriangulate = new V3D();
		var tempPoint3D = new V3D();
		var reuseMatrix = null;
		// console.log("VIEWS: "+viewCount);
		// setup camera matrixes from parameters
		for(var i=0; i<viewCount; ++i){
			R3D.transform3DFromComponentArray(listM[i], parameters, i*6);
		}
		// estimate P3D & project to P2D at same time:
		var errorIndex = 0;
		for(var i=0; i<points3DCount; ++i){
			var entryP3D = listPoints3D[i];
			// console.log(entryP3D);
			// triangulate
			var points2D = [];
			var extrinsics = [];
			var invKs = [];
			var extrinsics = [];
			for(var j=0; j<entryP3D.length; ++j){
				var entry = entryP3D[j];
					points2D[j] = entry[0];
				var indexView = entry[1];
				extrinsics[j] = listViewExts[indexView];
				invKs[j] = listViewKinvs[indexView];
			}

			var point3D = R3D.triangulatePointDLTList(points2D, extrinsics, invKs, reusePoint3DTriangulate, reuseMatrix);
			// console.log(point3D);

			// project
			for(var j=0; j<entryP3D.length; ++j){
				var entry = entryP3D[j];
				var point2D = entry[0];
				var indexView = entry[1];
				var P = listM[indexView];
				var K = listViewKs[indexView];
				//
				P.multV3DtoV3D(tempPoint3D,point3D);
				K.multV3DtoV3D(tempPoint3D,tempPoint3D);
				// isBehind |= (tempPoint3D.z<=0 || tempPoint3D.z<=0);
				// isBehind |= (tempPoint3D.z<=0);
				tempPoint3D.homo();
				// var errorDistance = V2D.distance(tempPoint3D, point2D);
				var errorX = tempPoint3D.x - point2D.x;
				var errorY = tempPoint3D.y - point2D.y;

				errors[errorIndex+0] = errorX;
				errors[errorIndex+1] = errorY;
				errorIndex += 2;
				
				// errors[errorIndex] = ...;
				// errorIndex += 1;
			}


// throw "..."

			// errors[errorIndex] = ...;
		}
		// project P3D to view
		// error = d(data, predicted)
		// console.log(errors);
		// console.log(errors.length);
		// throw "errorFxn"
		return errors;
	};

	// 1 or 2 x 2D points
	var errorCount = 0;
	for(var i=0; i<listPoints3D.length; ++i){
		var entries = listPoints3D[i];
		errorCount += entries.length;
	}
	// console.log("errorCount [per point]: "+errorCount);

	// x2 for X & Y
	errorCount *= 2;
	console.log("errorCount: "+errorCount);


	// var observedValues = null;
	var epsilonParameters = null;
	// var initialLambda = null;
	// var maxIterations = 3;
	var jacobianFxn = null;


	console.log("start LM");

	
	var result = Code.levenbergMarquardt(errorFxn, errorCount, initialParameters, epsilonParameters, jacobianFxn, maxIterations);
	console.log(result);
	var finalParameters = result["parameters"];
	var cost = result["cost"];

	console.log("finalParameters:");
	console.log(finalParameters);

	for(var i=0; i<listM.length; ++i){
		var M = listM[i];
		R3D.transform3DFromComponentArray(M, finalParameters, i*6);
	}
	

	for(var i=0; i<views.length; ++i){
		var P = listM[i];
		var view = views[i];
		view.absoluteTransform(P);
	}

	world.copyRelativeTransformsFromAbsolute();




	return {"matrixes":listM, "error":cost};


	// Code.levenbergMarquardt = function(errorFxn, errorVector, initialParameters, epsilonParameters, jacobianFxn, initialLambda){

}





Stereopsis.World.prototype.refineAllCameraMultiViewTriangulation = function(maxIterations, onlyLongTracks, maximumPoints3D){
	// TODO: REPLACE ALL USAGES OF THIS FXN NAME W/O "GD"
	return this.refineAllCameraMultiViewTriangulationGD(maxIterations, onlyLongTracks, maximumPoints3D);
}




Stereopsis.World.prototype.refineAllCameraMultiViewTriangulationGD = function(maxIterations, onlyLongTracks, maximumPoints3D){
// onlyLongTracks = true;

	// TODO: PRIORITIZE LONGER TRACKS REGARDLESS
	onlyLongTracks = Code.valueOrDefault(onlyLongTracks, false);
	// onlyZError = Code.valueOrDefault(onlyZError, false);
	var onlyZError = false;
	var world = this;
	var listExts = [];
	var listKs = [];
	var listKinvs = [];
	
	var views = world.toViewArray();

	// var multiplierView = Math.ceil(Math.sqrt(views.length));
	var multiplierView = Math.sqrt(views.length);

	// multiplierView = multiplierView * 2;
	//   2 = 2    2k    = 1000 / v
	//   5 = 3    3k    =  600 / v
	//  10 = 4    4k    =  400 / v
	//  20 = 5    5k    =  250 / v
	//  50 = 8    8k    =  160 / v
	// 100 = 10   10k   =  100 / v
	//1000 = 32   32k   =   32 / v

	// 200 - 500
	maximumPoints3D = Code.valueOrDefault(maximumPoints3D, Math.round(500 * multiplierView) ); // 100-1000 per view

	// maximumPoints3D = 1000;
	// maximumPoints3D = 20000;

	var points3D = world.toPointArray();

	if(!maxIterations){
		maxIterations = 100*views.length;
		maxIterations = Math.min(maxIterations, 100);
	}
	console.log("refineAllCameraMultiViewTriangulation: "+maxIterations+" MAX POINTS: "+maximumPoints3D+" / "+points3D.length);

	var viewIDToIndexHash = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var P = view.absoluteTransform();
		var K = view.K();
		var Kinv = view.Kinv();
		listExts.push(P);
		listKs.push(K);
		listKinvs.push(Kinv);
		viewIDToIndexHash[view.id()] = i;
	}
	var listPoints2D = [];

	// get camera volume:
	var centers3D = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var center = view.center();
		centers3D.push(center);
	}
	var center3D = V3D.average(centers3D);
	for(var i=0; i<centers3D.length; ++i){
		var center = centers3D[i];
		centers3D[i] = V3D.distance(center3D,centers3D[i]);
	}
	var volumeSigma = Code.averageNumbers(centers3D);

	console.log("volumeSigma: "+volumeSigma);

	var positionAccuracy = volumeSigma*1E-10;
	var rotationAccuracy = Code.radians(1.0)*1E-4;
	console.log("accuracy: "+positionAccuracy+" & "+rotationAccuracy);
	
	console.log(" points total : "+points3D.length+" / "+maximumPoints3D);
	// trim out non-long tracks
	if(onlyLongTracks){
		for(var i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var points2D = point3D.toPointArray();
			if(points2D.length<=2){ // want more than 1 match (2 views)
				Code.removeElementAt(points3D,i);
				--i; // redo
			}
		}
		console.log(" tracks total : "+points3D.length+" / "+maximumPoints3D);
	}
	// trim down sample
	if(points3D.length>maximumPoints3D){
		console.log("SUBSAMPLE "+points3D.length+" -> "+maximumPoints3D);
		Code.randomPopArray(points3D,maximumPoints3D);
	}
	// do
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var entryP3D = [];
		for(var j=0; j<points2D.length; ++j){
			var p2D = points2D[j];
			var view = p2D.view();
			var viewID = view.id();
			var viewIndex = viewIDToIndexHash[viewID];
			var entryP2D = [p2D.point2D(),viewIndex];
			entryP3D.push(entryP2D);
		}
		listPoints2D.push(entryP3D);
	}



var timeA = Code.getTimeMilliseconds();
	// var negativeIsBad = true;
	var negativeIsBad = false;
	var result = R3D.optimizeAllCameraExtrinsicDLTNonlinear(listExts, listKs, listKinvs, listPoints2D, maxIterations, negativeIsBad, onlyZError,  positionAccuracy, rotationAccuracy); // negative bad?
var timeB = Code.getTimeMilliseconds();
console.log("TIME optimizeAllCameraExtrinsicDLTNonlinear: " + (timeB-timeA) );


	var listP = result["matrixes"];
	for(var i=0; i<views.length; ++i){
		var P = listP[i];
		var view = views[i];
		view.absoluteTransform(P);
	}

	world.copyRelativeTransformsFromAbsolute();
}

Stereopsis.World.prototype.refineSelectCameraMultiViewTriangulation = function(selectView, maxIterations, onlyLongTracks, points2D){ 
	console.log("refineSelectCameraMultiViewTriangulation");
	onlyLongTracks = false;

	var minimumMatchCountTransform = 16;
	var maximumMatchTotal = 500;
	maxIterations = Code.valueOrDefault(maxIterations,1000);

	var selectViewID = selectView.id();

	// get all P2D in P3D with more than 1 match
	var viewPointHash = {};
	var pointKeepList = [];
	if(!points2D){
		points2D = selectView.toPointArray();
	}
console.log(selectView.data()+" : "+points2D.length);
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var point3D = point2D.point3D();
		var pointsP3DP2D = point3D.toPointArray();
		if( (!onlyLongTracks) || (onlyLongTracks && pointsP3DP2D.length>2) ){ // more than 1 match -- TODO: IS THIS NEEDED FOR TRACKS OPTIMIZING ?
		// if(true){ // ... any number of matches
			for(var j=0; j<pointsP3DP2D.length; ++j){
				var pt2D = pointsP3DP2D[j];
				var view = pt2D.view();
				var viewID = view.id();
				var count = viewPointHash[viewID];
				if(!count){
					count = 0;
				}
				viewPointHash[viewID] = count + 1;
			}
			pointKeepList.push(point2D);
		}
	}
	// get count list not including self & above minimum
	var viewMatchCounts = [];
	var viewKeys = Code.keys(viewPointHash);
	for(var i=0; i<viewKeys.length; ++i){
		var key = viewKeys[i];
		// if(key!=selectViewID){
			var val = viewPointHash[key];
			if(val>minimumMatchCountTransform){
				viewMatchCounts.push(val);
			}
		// }
	}
	// get statistical information
	var countMax = Code.max(viewMatchCounts);
	var countSig = Code.stdDev(viewMatchCounts, countMax);
	var countLimit = Math.max(countMax - countSig*2.0, minimumMatchCountTransform);
	console.log("stats: "+countMax+" +/- "+countSig+" =?= "+countLimit);

	// keep list of views to include in P
	var passingViewHash = {};
	for(var i=0; i<viewKeys.length; ++i){
		var key = viewKeys[i];
		var val = viewPointHash[key];
// console.log(key+":"+val)
		if(val>=countLimit){
			passingViewHash[key] = 0;
		}
	}

	// recount with included views
	var points3DKeep = [];
	var viewsKeepHash = {};
	for(var i=0; i<pointKeepList.length; ++i){
		var point2D = pointKeepList[i];
		var point3D = point2D.point3D();
		var pointsP3DP2D = point3D.toPointArray();
		var totalIncludedViews = 0;
		for(var j=0; j<pointsP3DP2D.length; ++j){
			var pt2D = pointsP3DP2D[j];
			var view = pt2D.view();
			var viewID = view.id();
			var exists = passingViewHash[viewID]!==undefined;
			if(exists){
				totalIncludedViews += 1;
			}
		}
		// add entries if enough matches still exist
		if(onlyLongTracks && totalIncludedViews<=2){
			continue;
		} else if(totalIncludedViews<=1){ // at least 1 view ...
			continue;
		}
		for(var j=0; j<pointsP3DP2D.length; ++j){
			var pt2D = pointsP3DP2D[j];
			var view = pt2D.view();
			var viewID = view.id();
			var exists = passingViewHash[viewID]!==undefined;
			if(exists){
				passingViewHash[viewID] += 1;
				if(!viewsKeepHash[viewID]){
					viewsKeepHash[viewID] = view;
				}
			}
		}
		points3DKeep.push(point3D);
	}
	// sample included lists if over max
	if(points3DKeep.length>maximumMatchTotal){
		Code.randomPopArray(points3DKeep,maximumMatchTotal);
	}
	
	// create index lookup & values:
	var listExts = [];
	var listKs = [];
	var listKinvs = [];

	var selectViewIndex = null;
	var viewIDToIndexHash = {};
	var viewsKeep = Code.objectToArray(viewsKeepHash);
	for(var i=0; i<viewsKeep.length; ++i){
		var view = viewsKeep[i];
		if(view==selectView){
			selectViewIndex = i;
		}
		viewIDToIndexHash[view.id()] = i;
		listExts[i] = view.absoluteTransform();
		listKs[i] = view.K();
		listKinvs[i] = view.Kinv();
	}

	// create entries
	var listPoints2D = [];
	for(var i=0; i<points3DKeep.length; ++i){
		var point3D = points3DKeep[i];
		var pointsP3DP2D = point3D.toPointArray();
		var entryP3D = [];
		for(var j=0; j<pointsP3DP2D.length; ++j){
			var pt2D = pointsP3DP2D[j];
			var view = pt2D.view();
			var viewID = view.id();
			var viewIndex = viewIDToIndexHash[viewID];
			if(viewIndex!==undefined){
				var entryP2D = [pt2D.point2D(),viewIndex];
				entryP3D.push(entryP2D);
			}
		}
		listPoints2D.push(entryP3D);
	}
	if(listPoints2D.length<minimumMatchCountTransform){
		console.log("below: "+listPoints2D.length+" / "+minimumMatchCountTransform);
		console.log(viewsKeep);
		console.log("...");
		console.log(points3DKeep);
		console.log("...");
		console.log(listPoints2D);
		throw "??????????????"
		return false;
	}
	// var result = R3D.optimizeMultipleCameraExtrinsicDLTNonlinear(listExts, listKs, listKinvs, selectViewIndex, listPoints2D, maxIterations);
	// console.log("? optimizeMultipleCameraExtrinsicDLTNonlinear ?");
	var negativeIsBad = true;
	var result = R3D.optimizeMultipleCameraExtrinsicDLTNonlinear(listExts, listKs, listKinvs, selectViewIndex, listPoints2D, maxIterations, negativeIsBad);
	var P = result["P"];
	selectView.absoluteTransform(P);
	// throw "?"
	return true;
}


Stereopsis.World.prototype.refineSelectCameraAbsoluteOrientationTriangulate = function(selectView, maxIterations){ 
	throw "no refineSelectCameraAbsoluteOrientationTriangulate"
	var world = this;
	var minMatches = 16;
		maxIterations = Code.valueOrDefault(maxIterations,1000);
	var maximumMatchesTotal = 1000;
	
	var listP = [];
	var listK = [];
	var listKinv = [];
	var pointsAB2DList = [];
	var views = world.toViewArray();
	var matchCountTotal = 0;

	var transformsKeep = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view==selectView){
			continue;
		}
		var transform = world.transformFromViews(selectView,view);
		var matchCount = transform.matchCount();
		if(matchCount>minMatches){
			transformsKeep.push(transform);
			matchCountTotal += matchCount;
		}
	}

	 // todo: some kind of sigma to limit to only most influential views (5-10)

	for(var i=0; i<transformsKeep.length; ++i){
		var transform = transformsKeep[i];
		var view = transform.oppositeView(selectView);
		// add
		var currentViewIndex = listP.length;
		var extrinsic = view.absoluteTransform();
		listP.push(extrinsic);
		listK.push(view.K());
		listKinv.push(view.Kinv());
		// fill in points:
		var matches = transform.matches();
		if(matchCountTotal>maximumMatchesTotal){ // sample proportionatley from transforms 
			var matchesForTransform = Math.round(maximumMatchesTotal*matches.length/matchCountTotal);
			matches = Code.randomSampleRepeats(matches, matchesForTransform);
		}
		var pointsA = [];
		var pointsB = [];
		var list = [currentViewIndex, -1, pointsA,pointsB];
		pointsAB2DList.push(list);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var pointA = match.point2DA();
			var pointB = match.point2DB();
			pointsA.push(pointA.point2D());
			pointsB.push(pointB.point2D());
		}
	}

	// append select view:
	if(listP.length==0){
		throw "no op";
	}
	var view = selectView;
	var extrinsic = view.absoluteTransform();
	listP.push(extrinsic);
	listK.push(view.K());
	listKinv.push(view.Kinv());

	// optimize
	throw "?????? optimizeMultipleCameraExtrinsicNonlinear"
	var result = R3D.optimizeMultipleCameraExtrinsicNonlinear(listP, listK, listKinv, pointsAB2DList, maxIterations);
	var P = result["P"];
	view.absoluteTransform(P);

}
// globalBundleAdjust



Stereopsis.World.prototype.optimizeCamerasFromSurfaceDistanceMapping3D = function(updateViews){
	var world = this;
	var allViews = world.toViewArray();
	if(!updateViews){
		updateViews = allViews;
	}
	var searchCellDistance = 0.25; // 0.1 - 0.5
	var minimumTransformMatchCount = 16; // minimum overlap for view triple
	var maximumMappingPoints3D = 1000; // 100 - 1000 - per view triple
	var point2DToPoint = function(p){
		return p.point2D();
	}
	var pointSpace = new QuadTree(point2DToPoint);
	var identity = new Matrix(4,4).identity();
	// init all views temp to empty array:
	var viewIDToIndex = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var viewID = view.id();
		viewIDToIndex[viewID] = i;
	}
	var allPointGroupEntries = [];

	for(var i=0; i<updateViews.length; ++i){
		var view = updateViews[i];
		var viewSize = view.size();
		var cellSize = view.cellSize();
		var radiusSearchLimit = cellSize*searchCellDistance;
		// find all views worth contemplating
		var transforms = world.transformsWithOverlapForView(view);
		pointSpace.clear();
		pointSpace.initWithMinMax(V2D.ZERO, viewSize);
		var viewIDB = view.id();
		for(var j=0; j<transforms.length; ++j){ // viewA+viewB - viewB+viewC
			var transformAB = transforms[j];
			var viewA = transformAB.viewA();
			var viewB = view;
			if(viewA==view){
				viewA = transformAB.viewB();
			}
			var viewIDA = viewA.id();
			pointSpace.clear();
			var matchesAB = transformAB.matches();
			// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE
			for(var k=0; k<matchesAB.length; ++k){
				var matchAB = matchesAB[k];
				var point2DB = matchAB.pointForView(viewB);
				pointSpace.insertObject(point2DB);
			}
			for(var k=j+1; k<transforms.length; ++k){
				var transformBC = transforms[k];
				var viewC = transformBC.viewA();
				if(viewC==view){
					viewC = transformBC.viewB();
				}
				var viewIDC = viewC.id();
				var matchesBC = transformBC.matches();
				// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE ?
				// console.log("MATCH VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id());
				var pairedPointsAB = [];
					var pairedPointsAB_A = [];
					var pairedPointsAB_B = [];
				var pairedPointsBC = [];
					var pairedPointsBC_B = [];
					var pairedPointsBC_C = [];
				var pairedPointError = [];
				for(var m=0; m<matchesBC.length; ++m){
					var matchBC = matchesBC[m];
					var point2DB = matchBC.pointForView(viewB);
					var p2DB = point2DB.point2D()
					var closest = pointSpace.closestObject(p2DB); // CLOSEST is MATCH-AB
					var closest2D = closest.point2D();
					var distance = V2D.distance(closest2D, p2DB);
					if(distance<radiusSearchLimit){
						var matchAB = closest.point3D().matchForViews(viewA,viewB);
						pairedPointsAB.push(closest.point3D().point());
							pairedPointsAB_A.push(matchAB.pointForView(viewA).point2D());
							pairedPointsAB_B.push(closest2D);
						pairedPointsBC.push(point2DB.point3D().point());
							pairedPointsBC_B.push(p2DB);
							pairedPointsBC_C.push(matchBC.pointForView(viewC).point2D());
						var error = closest.averageRError() + point2DB.averageRError();
						pairedPointError.push(error);
					}
				}
				if(pairedPointsAB.length<minimumTransformMatchCount){
					continue;
				}
				// remove high pair errors:
				var errorMin = Code.min(pairedPointError);
				var errorSigma = Code.stdDev(pairedPointError,errorMin);
				var errorLimit = errorMin+2.0*errorSigma;
				for(var e=0; e<pairedPointError.length; ++e){
					var error = pairedPointError[e];
					if(error>errorLimit){
						Code.removeElementAt(pairedPointsAB,e);
						Code.removeElementAt(pairedPointsBC,e);
						Code.removeElementAt(pairedPointsAB_A,e);
						Code.removeElementAt(pairedPointsAB_B,e);
						Code.removeElementAt(pairedPointsBC_B,e);
						Code.removeElementAt(pairedPointsBC_C,e);
						Code.removeElementAt(pairedPointError,e);
						--e;
					}
				}
				// console.log("MATCHING VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id()+" - matches: "+origLen+" -> "+pairedPointsAB.length);
				if(pairedPointsAB.length<minimumTransformMatchCount){
					continue;
				}

				if(pairedPointsAB.length>maximumMappingPoints3D){
					// TODO: FILTER ON SUMMED R-ERROR TO LIMIT TOTAL MATCHES TO USE
					console.log("filter on lowest summed reprojection error");
					// already error metric -> sort & truncate
					Code.randomPopParallelArrays([pairedPointsAB,pairedPointsBC, pairedPointsAB_A,pairedPointsAB_B, pairedPointsBC_B,pairedPointsBC_C, pairedPointError], maximumMappingPoints3D);
				}
				// TODO: is there an error worth filtering on?

				var viewIndexA = viewIDToIndex[viewIDA];
				var viewIndexB = viewIDToIndex[viewIDB];
				var viewIndexC = viewIDToIndex[viewIDC];

				for(t=0; t<pairedPointsAB.length; ++t){
					// var error = errors[t];
					// if(error>errorLimit){
					// 	continue;
					// }
					// var pA = pairedPointsAB[t];
					// var pC = pairedPointsBC[t];

					var pointAB2DA = pairedPointsAB_A[t];
					var pointAB2DB = pairedPointsAB_B[t];
					var pointBC2DB = pairedPointsBC_B[t];
					var pointBC2DC = pairedPointsBC_C[t];
// var viewIndexA = group[0];
// var viewIndexB = group[1];
// var viewIndexC = group[2];
// var pointAB2DA = group[3];
// var pointAB2DB = group[4];
// var pointBC2DB = group[5];
// var pointBC2DC = group[6];
					var entry = [viewIndexA,viewIndexB,viewIndexC, pointAB2DA,pointAB2DB, pointBC2DB,pointBC2DC];
					allPointGroupEntries.push(entry);
				}
				
			}
		}
	}


var maximumGroupEntriesCount = 200*updateViews.length;
// 100-1000
console.log("allPointGroupEntries: "+allPointGroupEntries.length);
if(allPointGroupEntries.length>maximumGroupEntriesCount){
	Code.randomPopArray(allPointGroupEntries,maximumGroupEntriesCount);
}
console.log(allPointGroupEntries);
	// create index lookup & values:
	var viewUpdateList = {};
	for(var i=0; i<updateViews.length; ++i){
		var view = updateViews[i];
		viewUpdateList[view.id()] = true;
	}
	var listExts = [];
	var listKs = [];
	var listKinvs = [];
	var listOptimize = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var viewID = view.id();
		listExts[i] = view.absoluteTransform();
		listKs[i] = view.K();
		listKinvs[i] = view.Kinv();
		listOptimize[i] = viewUpdateList[viewID] == true ? true : false;
	}

// console.log(listExts, listKs, listKinvs, allPointGroupEntries, maxIterations);
// console.log(listOptimize);
	// throw "separate single view to optimze on from ALL views that need to be present"

	// var maxIterations = 100;
	var maxIterations = 10; // 10-100
	var result = R3D.optimizeAllCameraExtrinsicSurfaceDistances3D(listExts, listKs, listKinvs, listOptimize, allPointGroupEntries, maxIterations);
	console.log(result);
	var listP = result["matrixes"];
	for(var i=0; i<updateViews.length; ++i){
			var P = listP[i];
			var view = updateViews[i];
			view.absoluteTransform(P);
	}
	
	world.copyRelativeTransformsFromAbsolute();

	// throw "optimizeCamerasFromSurfaceDistanceMapping3D"
}


Stereopsis.World.prototype.optimizePairTransformsFromMappingP3D = function(views){
	var world = this;
	if(!views){
		views = world.toViewArray();
	}
	var minimumTransformMatchCount = 20; // 20 - 100
	var maximumMappingPoints3D = 1000; // 100 - 1000
	var point2DToPoint = function(p){
		return p.point2D();
	}
	var pointSpace = new QuadTree(point2DToPoint);
	var identity = new Matrix(4,4).identity();

	// init all views temp to empty array:
	var viewToPointList = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		viewToPointList[viewID] = [];
	}

	// accumulate potential new locations
	// var recordedTriples = {};
	// var viewsToTripleID = function(viewA,viewB,viewC){
	// 	var ids = [viewA.id(),viewB.id(),viewC.id()];
	// 	ids.sort();
	// 	return ids.join("-");
	// }
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewSize = view.size();
		var cellSize = view.cellSize();
		var radiusSearchLimit = cellSize*0.25; // 0.1 - 0.5 -- 0.25
		// find all views worth contemplating
		var transforms = world.transformsWithOverlapForView(view);
		// console.log(view);
		pointSpace.clear();
		pointSpace.initWithMinMax(V2D.ZERO, viewSize);
		for(var j=0; j<transforms.length; ++j){ // viewA+viewB - viewB+viewC
			var transformAB = transforms[j];
			var viewA = transformAB.viewA();
			var viewB = view;
			if(viewA==view){
				viewA = transformAB.viewB();
			}
			pointSpace.clear();
			var matchesAB = transformAB.matches();
			// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE
			for(var k=0; k<matchesAB.length; ++k){
				var matchAB = matchesAB[k];
				var point2DB = matchAB.pointForView(viewB);
				pointSpace.insertObject(point2DB);
			}
			// console.log(pointSpace.count());
			for(var k=j+1; k<transforms.length; ++k){
				var transformBC = transforms[k];
				var viewC = transformBC.viewA();
				if(viewC==view){
					viewC = transformBC.viewB();
				}
				var matchesBC = transformBC.matches();
				// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE ?
				// console.log("MATCH VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id());
				var pairedPointsAB = [];
					var pairedPointsAB_A = [];
					var pairedPointsAB_B = [];
				var pairedPointsBC = [];
					var pairedPointsBC_B = [];
					var pairedPointsBC_C = [];
				var pairedPointError = [];
				for(var m=0; m<matchesBC.length; ++m){
					var matchBC = matchesBC[m];
					var point2DB = matchBC.pointForView(viewB);
					var p2DB = point2DB.point2D()
					var closest = pointSpace.closestObject(p2DB); // CLOSEST is MATCH-AB
					var closest2D = closest.point2D();
					var distance = V2D.distance(closest2D, p2DB);
					if(distance<radiusSearchLimit){
						var matchAB = closest.point3D().matchForViews(viewA,viewB);
						pairedPointsAB.push(closest.point3D().point());
							pairedPointsAB_A.push(matchAB.pointForView(viewA).point2D());
							pairedPointsAB_B.push(closest2D);
						pairedPointsBC.push(point2DB.point3D().point());
							pairedPointsBC_B.push(p2DB);
							pairedPointsBC_C.push(matchBC.pointForView(viewC).point2D());
						var error = closest.averageRError() + point2DB.averageRError();
						pairedPointError.push(error);
					}
				}
				if(pairedPointsAB.length<minimumTransformMatchCount){
					continue;
				}
				
				var origLen = pairedPointsAB.length;
// Code.printMatlabArray(pairedPointError,"errors");
var errorMin = Code.min(pairedPointError);
var errorSigma = Code.stdDev(pairedPointError,errorMin);
var errorLimit = errorMin+2.0*errorSigma;

for(var e=0; e<pairedPointError.length; ++e){
	var error = pairedPointError[e];
	if(error>errorLimit){
		Code.removeElementAt(pairedPointsAB,e);
		Code.removeElementAt(pairedPointsBC,e);
		Code.removeElementAt(pairedPointsAB_A,e);
		Code.removeElementAt(pairedPointsAB_B,e);
		Code.removeElementAt(pairedPointsBC_B,e);
		Code.removeElementAt(pairedPointsBC_C,e);
		Code.removeElementAt(pairedPointError,e);
		--e;
	}
}
				// console.log("MATCHING VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id()+" - matches: "+origLen+" -> "+pairedPointsAB.length);
				if(pairedPointsAB.length<minimumTransformMatchCount){
					continue;
				}

				if(pairedPointsAB.length>maximumMappingPoints3D){
					// TODO: FILTER ON SUMMED R-ERROR TO LIMIT TOTAL MATCHES TO USE
console.log("filter on lowest summed reprojection error");
// already error metric -> sort & truncate
					Code.randomPopParallelArrays([pairedPointsAB,pairedPointsBC, pairedPointsAB_A,pairedPointsAB_B, pairedPointsBC_B,pairedPointsBC_C, pairedPointError], maximumMappingPoints3D);
				}
				// find median point-surface
				// var info = Code.transform3DFromPointMatches(pairedPointsAB, pairedPointsBC, false); // skipping nonlinear - doesn't seem to help
				// var transformMappingAB = info["transform"];
				// var halfFwd = Code.linearInterpolateTransformsDecomposed3D(identity, transformMappingAB, 0.5);
				// var halfBak = Matrix.relativeWorld(transformMappingAB, halfFwd);

				// TODO: MAY BE OUTLIERS ? transformed points with very high error -> drop
				// RE-ESTIMATE WITHOUT OUTLIERS AS WELL


				var viewIDA = viewA.id();
				var viewIDB = viewB.id();
				var viewIDC = viewC.id();

				var entriesA = viewToPointList[viewIDA];
				var entriesB = viewToPointList[viewIDB];
				var entriesC = viewToPointList[viewIDC];

				// var distancesAC = 0;
				// prep points for algorithm
				// var errors = [];
				var directionAC = new V3D();
				for(t=0; t<pairedPointsAB.length; ++t){
					var pA = pairedPointsAB[t];
					var pC = pairedPointsBC[t];
// 					var pAHalf = halfFwd.multV3DtoV3D(pA);
// 					var pCHalf = halfBak.multV3DtoV3D(pC);
// 					var dAC = V3D.distance(pAHalf,pCHalf);
// 					distancesAC += dAC;
					directionAC.add( pC.x-pA.x , pC.y-pA.y , pC.z-pA.z );
					// errors.push(dAC);
				}
				// var errorMin = Code.min(errors);
				// var errorSigma = Code.stdDev(errors,errorMin);
				// var errorLimit = errorMin+2.0*errorSigma;

				directionAC.scale(1.0/pairedPointsAB.length);
				var errorDir = [];
				for(t=0; t<pairedPointsAB.length; ++t){
					var pA = pairedPointsAB[t];
					var pC = pairedPointsBC[t];
					var angle = V3D.angle(directionAC, V3D.sub(pC,pA) );
					errorDir.push(angle);
				}
				var errorDirMin = Code.min(errorDir);
				var errorDirSigma = Code.stdDev(errorDir,errorDirMin);
				var errorDirLimit = errorDirMin+2.0*errorDirSigma;


// DIRECTION - ANGLE ERRORS:
// Code.printMatlabArray(errorDir,"errors");


// error based on distance away A & C?


				for(t=0; t<pairedPointsAB.length; ++t){
					var error = errorDir[t];
					if(error>errorDirLimit){
						continue;
					}

					// var error = errors[t];
					// if(error>errorLimit){
					// 	continue;
					// }

					var pA = pairedPointsAB[t];
					var pC = pairedPointsBC[t];

					// BAD
					// var pAHalf = halfFwd.multV3DtoV3D(pA);
					// var pCHalf = halfBak.multV3DtoV3D(pC);

					// half alg + half midpoint ?
					// var midpoint = V3D.midpoint(pAHalf,pCHalf);
					// var pAHalf = midpoint;
					// var pCHalf = midpoint;

					// ^ this is very not good ???


					// maybe better for nonlinear ... ?
					var midpoint = V3D.midpoint(pA,pC);
					var pAHalf = midpoint;
					var pCHalf = midpoint;


					entriesA.push([pAHalf, pairedPointsAB_A[t]]);
		// entriesB.push([pAHalf, pairedPointsAB_B[t]]); // these don't seem to help or hinder the results?
		// entriesB.push([pCHalf, pairedPointsBC_B[t]]); // 
					entriesC.push([pCHalf, pairedPointsBC_C[t]]);
				}
				
			}
		}
	}
	// create data structures
	var maxEntriesPerView = 1000; // 500 - 10k
var maxEntriesPerView = 10000;
	var listP = [];
	var listK = [];
	var listKinv = [];
	var listPoints2D = [];
	var listPoints3D = [];
	var maxIterations = 100; // 100 - 1000 ?
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var entries = viewToPointList[viewID];
		var ext = view.absoluteTransform();
		var K = view.K();
		var Kinv = view.Kinv();
		var list2D = [];
		var list3D = [];
		// console.log("VIEW "+i+" : ENTRIES+ "+entries.length);
		if(entries.length>maxEntriesPerView){
			Code.randomPopArray(entries,maxEntriesPerView);
		}

		for(var j=0; j<entries.length; ++j){
			var entry = entries[j];
			var p3D = entry[0];
			var p2D = entry[1];
			list3D.push(p3D);
			list2D.push(p2D);
		}

		listP.push( ext );
		listK.push( K );
		listKinv.push( Kinv );
		listPoints2D.push( list2D );
		listPoints3D.push( list3D );
	}
var maxLinearStepPoints = 100;
var minCountLinearPointMatches = 10; // 10-20
	// should DLT be attempted to init the camera parameters, or is from existing good enough?
	for(var i=0; i<listP.length; ++i){
		var P = listP[i];
		var K = listK[i];
		var Kinv = listKinv[i];
		var points2D = listPoints2D[i];
		var points3D = listPoints3D[i];
		console.log(" updating P_"+i+" ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, "+points2D.length);
		if(points2D.length<minCountLinearPointMatches){
			continue;
		}
continue;
// console.log(points2D.length+" / "+maxLinearStepPoints);
		var originalP2D = points2D;
		var originalP3D = points3D;

		// smaller set for linear step
		if(points2D.length>maxLinearStepPoints){
			points2D = Code.copyArray(points2D);
			points3D = Code.copyArray(points3D);
			Code.randomPopParallelArrays([points2D,points3D],maxLinearStepPoints);
		}


		var result = R3D.optimizeCameraExtrinsicDLTKnown3D(P, K, Kinv, points2D, points3D);
		// console.log(result);
		var newP = result["matrix"];
		listP[i] = newP;

		throw "THIS LINEAR STEP ISNT WORKING - DLT / QR / K / ..."

		// console.log("newP 1: \n"+newP);
		// NONLINEAR STEP - use full set of points
		// P = newP;
		// result = R3D.optimizeAllCameraExtrinsicDLTNonlinearKnown3D([P], [K], [Kinv], [originalP2D], [originalP3D]);
		// newP = result["matrixes"][0];
		// // console.log("newP 2: \n"+newP);
		// listP[i] = newP;
	}
	// setup nonlinear update for ALL CAMERAS:
	var result = R3D.optimizeAllCameraExtrinsicDLTNonlinearKnown3D(listP, listK, listKinv, listPoints2D, listPoints3D, maxIterations);
	// update locally
	var listP = result["matrixes"];
	for(var i=0; i<views.length; ++i){
		var P = listP[i];
		var view = views[i];
		view.absoluteTransform(P);
	}
	// with new absolutes, relatives need updating
	world.copyRelativeTransformsFromAbsolute();
	// throw "... out optimizePairTransformsFromMappingP3D"
}

Stereopsis.World.prototype.optimizePairTransformsFromMappingP3DB = function(views){ // move view cameras toward better location based on two-pair (triple) 3D-point mapping
	var world = this;
	if(!views){
		views = world.toViewArray();
	}
	// console.log(views);
	var minimumTransformMatchCount = 50; // 16 - 100
	var maximumMappingPoints3D = 200; // 100 - 1000
	var point2DToPoint = function(p){
		return p.point2D();
	}
	var pointSpace = new QuadTree(point2DToPoint);
	var identity = new Matrix(4,4).identity();

	// init all views temp to empty array:
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.temp([]);
	}
	// accumulate potential new locations
	for(var i=0; i<views.length; ++i){
// i = 4;
		var view = views[i];
		var viewSize = view.size();
		var cellSize = view.cellSize();
		var radiusSearchLimit = cellSize*0.25; // 0.1 - 0.5
		// find all views worth contemplating
		var transforms = world.transformsWithOverlapForView(view);
		// console.log(view);
		pointSpace.initWithMinMax(V2D.ZERO, viewSize);
		for(var j=0; j<transforms.length; ++j){ // viewA+viewB - viewB+viewC
			var transformAB = transforms[j];
			var viewA = transformAB.viewA();
			var viewB = transformAB.viewB();
			if(viewA==view){
				viewA = viewB
				viewB = view;
			}
			pointSpace.clear();
			var matchesAB = transformAB.matches();
			// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE
			for(var k=0; k<matchesAB.length; ++k){
				var matchAB = matchesAB[k];
				var point2DB = matchAB.pointForView(viewB);
				pointSpace.insertObject(point2DB);
			}
			// console.log(pointSpace.count());
			for(var k=j+1; k<transforms.length; ++k){
				var transformBC = transforms[k];
				var viewC = transformBC.viewA();
				if(viewC==view){
					viewC = transformBC.viewB();
				}
				var matchesBC = transformBC.matches();
				// TODO: FILTER ON R-ERROR TO LIMIT TOTAL MATCHES TO USE
				// console.log("MATCH VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id());
				var pairedPointsAB = [];
				var pairedPointsBC = [];
				for(var m=0; m<matchesBC.length; ++m){
					var matchBC = matchesBC[m];
					var point2DB = matchBC.pointForView(viewB);
					var p2DB = point2DB.point2D()
					var closest = pointSpace.closestObject(p2DB);
					var distance = V2D.distance(closest.point2D(), p2DB);
					if(distance<radiusSearchLimit){
						pairedPointsAB.push(closest.point3D().point());
						pairedPointsBC.push(point2DB.point3D().point());
					}
				}
				// TODO: FILTER ON SUMMED R-ERROR TO LIMIT TOTAL MATCHES TO USE
				// console.log("FOUND OVERLAP: "+pairedPointsAB.length);
				
				if(pairedPointsAB.length<minimumTransformMatchCount){
					// console.log(" -> not enough matches: "+pairedPointsAB.length);
					continue;
				}
				
				console.log("MATCHING VIEWS: "+viewA.id()+"-"+viewB.id()+" & "+viewB.id()+"-"+viewC.id()+" - matches: "+pairedPointsAB.length);

				if(pairedPointsAB.length>maximumMappingPoints3D){
					Code.randomPopParallelArrays([pairedPointsAB,pairedPointsBC], maximumMappingPoints3D);
				}
				
				
				// console.log(pairedPointsAB);
				// console.log(pairedPointsBC);
				var info = Code.transform3DFromPointMatches(pairedPointsAB, pairedPointsBC, false); // skipping nonlinear - doesn't seem to help
				var transformMappingAB = info["transform"];

				// TODO: MAY BE OUTLIERS ? transformed points with very high error -> drop

				
// console.log(pairedPointsAB);
// console.log(pairedPointsBC);

				var halfFwd = Code.linearInterpolateTransformsDecomposed3D(identity, transformMappingAB, 0.5);
				var halfBak = Matrix.relativeWorld(transformMappingAB, halfFwd);

// console.log("halfFwd:\n"+halfFwd);
// console.log("halfBak:\n"+halfBak);
				var absA = viewA.absoluteTransformInverse();
				var absC = viewC.absoluteTransformInverse();

				var absB = viewB.absoluteTransformInverse();

// console.log("absA:\n"+absA);
// console.log("absC:\n"+absC);

// A:
				// NO?
				// var newAbsA = Matrix.mult(absA,halfFwd);
				// var newAbsC = Matrix.mult(absC,halfBak);
// A-2
				// MAYBE?
				var newAbsA = Matrix.mult(halfFwd,absA);
				var newAbsC = Matrix.mult(halfBak,absC);


				var newAbsB = Matrix.mult(halfFwd,absB);
					newAbsB = Matrix.mult(halfBak,newAbsB);

// B:
				// NO?
				// var relA = Matrix.relativeWorld(absA, halfFwd);
				// var relC = Matrix.relativeWorld(absC, halfBak);
				// var newAbsA = Matrix.mult(absA,relA);
				// var newAbsC = Matrix.mult(absC,relC);
// B-2:
				// ???
				// var relA = Matrix.relativeWorld(absA, halfFwd);
				// var relC = Matrix.relativeWorld(absC, halfBak);
				// var newAbsA = Matrix.mult(relA,absA);
				// var newAbsC = Matrix.mult(relC,absC);

// C:
				// NO?
				// var relA = Matrix.relativeReference(absA,halfFwd);
				// var relC = Matrix.relativeReference(absC,halfBak);
				// var newAbsA = Matrix.mult(absA,relA);
				// var newAbsC = Matrix.mult(absC,relC);


				// var newAbsA = Matrix.mult(absA,halfFwd);
				// var newAbsC = Matrix.mult(absC,halfBak);

// console.log("newAbsA:\n"+newAbsA);
// console.log("newAbsC:\n"+newAbsC);


// TEST DISTANCES:
	var distancesAC = 0;
	var distancesAOld = 0;
	// var distancesANew = 0;

	var distancesCOld = 0;
	// var distancesCNew = 0;

	var orgAOld = new V3D(absA.get(0,3),absA.get(1,3),absA.get(2,3));
	var orgANew = new V3D(newAbsA.get(0,3),newAbsA.get(1,3),newAbsA.get(2,3));

	var orgCOld = new V3D(absC.get(0,3),absC.get(1,3),absC.get(2,3));
	var orgCNew = new V3D(newAbsC.get(0,3),newAbsC.get(1,3),newAbsC.get(2,3));

// console.log(orgAOld,orgANew);
// console.log(orgCOld,orgCNew);

	for(t=0; t<pairedPointsAB.length; ++t){
		var pA = pairedPointsAB[t];
		var pC = pairedPointsBC[t];
		var pAHalf = halfFwd.multV3DtoV3D(pA);
		var pCHalf = halfBak.multV3DtoV3D(pC);
		var dAC = V3D.distance(pAHalf,pCHalf);
		distancesAC += dAC;

		// 
		var dAO = V3D.distance(orgAOld, pA);
		var dAN = V3D.distance(orgANew, pAHalf);
		var dA = Math.abs(dAO-dAN);
		// console.log(dA);
		distancesAOld += dA;

		// 
		var dCO = V3D.distance(orgCOld, pC);
		var dCN = V3D.distance(orgCNew, pCHalf);
		var dC = Math.abs(dCO-dCN);
		// console.log(dC);
		distancesCOld += dC;
	}
	var accuracyError = (distancesAC/pairedPointsAB.length);
	// console.log("distancesAC: "+(distancesAC/pairedPointsAB.length)); // should be low
	// console.log(" delta A: "+(distancesAOld/pairedPointsAB.length));
	// console.log(" delta C: "+(distancesCOld/pairedPointsAB.length));
	// console.log(distancesA1/pairedPointsAB.length);



// throw "??"


				// var halfBA = Matrix.relativeWorld(matrixAB, halfAB);


				viewA.temp().push([newAbsA,accuracyError]);
				viewC.temp().push([newAbsC,accuracyError]);



				// does this need to be done?
				viewB.temp().push([newAbsB,accuracyError]);


				// throw "?????????";


			}
		}
// break;
	}


// init all views temp to empty array:
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var absList = view.temp();
		view.temp(null);
		if(absList&&absList.length>0){
// console.log(absList);
			// console.log("absList.length: "+absList.length+" ................................. "+i);
			// if(absList.length==1){
			// 	// console.log("just use the 1 ?");
			// }
			var matrixes = [];
			var errors = [];
			for(var j=0; j<absList.length; ++j){
				var entry = absList[j];
				var matrix = entry[0];
				var error = entry[1];
				matrixes.push(matrix);
				errors.push(error);
			}
			var percents = Code.errorsToPercents(errors);
				percents = percents["percents"];
			var newAbsView = Code.averageTransforms3D(matrixes, percents);
// console.log(newAbsView);
			var newExtView = Matrix.inverse(newAbsView);
console.log("NEW: "+i+": \n"+newExtView);
			view.absoluteTransform(newExtView);
		}
	}
	// with new absolutes, relatives need updating
	world.copyRelativeTransformsFromAbsolute();
}
Stereopsis.World.prototype.transformsWithOverlapForView = function(view, pointSigma, pointMinima){ // get a list of overlapping points 
	var world = this;
	pointSigma = Code.valueOrDefault(pointSigma, 3); // 2-3
	pointMinima = Code.valueOrDefault(pointSigma, 16);
	var transforms = world.transformsWithView(view);
	var counts = [];
	for(var j=0; j<transforms.length; ++j){
		var transform = transforms[j];
		var matchCount = transform.matchCount();
		if(matchCount>0){
			counts.push(matchCount);
		}
	}
	if(counts.length==0){
		return [];
	}
	var maxCount = Code.max(counts);
	// console.log("maxCount: "+maxCount);
	var sigCount = Code.stdDev(counts,maxCount);
	// console.log("sigCount: "+sigCount);
	var minCount = Math.max(pointMinima, Math.ceil(maxCount - pointSigma*sigCount) ) ;
	// console.log("minCount: "+minCount);
	for(var j=0; j<transforms.length; ++j){
		var transform = transforms[j];
		var matchCount = transform.matchCount();
		// console.log("matchCount: "+matchCount);
		if(matchCount<minCount){
			Code.removeElementAt(transforms, j);
			--j;
		}
	}

	return transforms;
}
Stereopsis.World.prototype.findOverlappingP2DsFromTransforms = function(transformAB, transformBC){ // get a list of overlapping points 


}


// ALL POSSIBLE WAYS TO UPDATE:
Stereopsis.World.POINT_COUNT_CATEGORY_LO = 0;
Stereopsis.World.POINT_COUNT_CATEGORY_ME = 1;
Stereopsis.World.POINT_COUNT_CATEGORY_HI = 2;
// Stereopsis.World.POINT_COUNT_CATEGORY_SU = 3; // super -> dont do anything ever if possible?
Stereopsis.World.prototype.setOperationCategoryFromPointCount = function(pointCount){
	var reference = this._pointCountReferenceList;
	if(reference && reference.length>0){
		var value0 = reference[0];
		if(pointCount>=value0){
			if(reference.length>=2){
				var value1 = reference[1];
				if(pointCount>=value1){
					this.pointCountReferenceList(Stereopsis.World.POINT_COUNT_CATEGORY_HI);
				}
			}
			this.pointCountReferenceList(Stereopsis.World.POINT_COUNT_CATEGORY_ME);
		}
	}
	this.pointCountReferenceList(Stereopsis.World.POINT_COUNT_CATEGORY_LO);
}

Stereopsis.World.prototype.pointCountReferenceList = function(arrayList){ // [up to this count is lo, up to this count is med] anything else is high
	if(value!==undefined){
		this._pointCountReferenceList = value;
	}
	return this._pointCountReferenceList;
}
Stereopsis.World.prototype.pointCountOperationCategory = function(value){
	if(value!==undefined){
		this._pointCountOperationCategory = value;
	}
	return this._pointCountOperationCategory;
}
Stereopsis.World.prototype.createAllPoints3DPatches = function(points3D){
	if(!points3D){
		points3D = this.toPointArray();
	}
	console.log("createAllPoints3DPatches for "+points3D.length);
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.updatePoint3DFromExistingMatches(point3D);
	}
}
Stereopsis.World.prototype.updatePoint3DFromExistingMatches = function(point3D){ // give it a patch
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		this.initNewPointPatch3D(point3D);
		return;
	}
	throw "updatePoint3DFromExistingMatches";
}

Stereopsis.World.prototype.updatePoint3DFromProbe2D = function(newPoint3D,sourceMatch){ // after a point was created from a probe 2D
	// USED
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		var newMatch = newPoint3D.matchForViews(sourceMatch.viewA(),sourceMatch.viewB());
		var sourceP3D = sourceMatch.point3D();
		// console.log("updatePoint3DFromProbe2D ... "+sourceP3D.hasPatch());
		if(sourceP3D.hasPatch()){ // TODO: WHO NEEDS TO HAVE THE PATCH?
			this.initNewPointPatch3D(newPoint3D, false); // POINT IS NOT YET IN WORLD
			Stereopsis.setErrorForMatch(newMatch);
			return;
		}else{ // just F
			// console.log("set from F");
			// console.log(newPoint3D);
			// console.log(sourceMatch);
			// set affine from neighborhood ?
			// setMatchAffineFromNeighborhood

			// set affine from single match (already done)
			
			this._resolutionProcessingModeAffineFromVisual2D(newMatch);
			Stereopsis.setErrorForMatch(newMatch);
			return;
		}
	}

	console.log(newPoint3D);
	console.log(sourceMatch);
	
	throw "updatePoint3DFromProbe2D";
}
Stereopsis.World.prototype.updatePoint3DFromProbe3D = function(newPoint3D,sourcePoint3D){ // after a point was created from a probe 3D
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		// ...
	}
	throw "updatePoint3DFromProbe3D";
}
Stereopsis.World.prototype.updatePoint3DFromMerge = function(newPoint3D,sourcePoint3DA,sourcePoint3DB){ // after a point was created by a merge
	throw "updatePoint3DFromMerge";
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		
		var hasPatch = sourcePoint3DA.hasPatch() && sourcePoint3DB.hasPatch();
		if(hasPatch){
			world.initNewPointPatch3D(point3DC);
			// return;
		}

		console.log(newPoint3D);
		var matches = newPoint3D.toMatchArray();
		console.log(matches);
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			Stereopsis.setErrorForMatch(match);
		}
		// return;
	}
	throw "updatePoint3DFromMerge";
}
Stereopsis.World.prototype.updatePoint3DFromSubdivision = function(point3D){ // after a point was possibly relocated in 2D
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		var hasPatch = point3D.hasPatch();
		if(hasPatch){
			this.initNewPointPatch3D(point3D);
			// return;
		}

		// console.log(point3D);
		var matches = point3D.toMatchArray();
		// console.log(matches);
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			Stereopsis.setErrorForMatch(match);
		}
		return;
	}
	throw "updatePoint3DFromViewOrientationChangeLarge";
}

Stereopsis.World.prototype.updatePoint3DFromViewOrientationChangeLarge = function(point3D){ // after a point's view was possibly changed by a large view absolute matrix update
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		// ...
	}
	throw "updatePoint3DFromViewOrientationChangeLarge";
}
Stereopsis.World.prototype.updatePoint3DFromViewOrientationChangeSmall = function(point3D){ // after a point's view was possibly changed by a small view absolute matrix update
	if(this._pointCountOperationCategory==Stereopsis.World.POINT_COUNT_CATEGORY_LO){
		// ...
	}
	throw "updatePoint3DFromViewOrientationChangeSmall";
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solvePairF = function(completeFxn, completeContext){ // F-based algorithms first
	console.log("solvePairF");
	var world = this;
	var views = world.toViewArray();
	// points should already have been injected via optimizing local affine area
	// world.setResolutionProcessingModeF();


	world.estimatePairwiseErrors();


world.debugCheckPairPointMatchCounts();

	// var subdivisionScaleSize = 0.50; // 40 -> 80
	// var subdivisionScaleSize = 0.75; // 40 -> 60
	var subdivisionMultiplier = 0.75;

var timeA = Code.getTimeMilliseconds();
var timeB = Code.getTimeMilliseconds();
	// 5 - 8
	var maxIterations = 4;
	for(var iteration=0; iteration<maxIterations; ++iteration){
// break;
		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ iteration "+iteration+" / "+maxIterations);
		// estimate current error


timeA = Code.getTimeMilliseconds();
		
		world.relativeFFromSamples();
		world.estimateGlobalErrors();


timeB = Code.getTimeMilliseconds();
console.log("DELTA A: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();


// TODO: REMOVE DEBUG:
world.checkValidateMatches();



world.debugCheckPairPointMatchCounts();

		// expand
			var sigmaMaximumSelect = 2.0;
			var sigmaMaximumKeep = 1.0;
			world.probe2DCellsExpandR(sigmaMaximumSelect, sigmaMaximumKeep);
					
		// filter
			world.filterPairwiseErrors(2.0);
			// world.filterGlobalErrors(2.0); // this is only R
			// world.filterNeighborConsistency2D3D();
			world.filterNeighborConsistency2DViews();
			// world.filterGlobalNegativeDepth();
			// world.filterGlobalPatchVisibilityConsistency();
			world.filterLocalError2D();
			// world.filterLocalError3D();
			// throw "after filter"


world.debugCheckPairPointMatchCounts();
world.checkValidateMatches();


timeB = Code.getTimeMilliseconds();
console.log("DELTA B: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();


		// subdivide
		var subdivide = iteration==(maxIterations*0.5 | 0);
		if(subdivide){

			console.log("SUBDIVIDING - PAIR-F")

			world.subdivideViewGridsR(subdivisionMultiplier);
			world.subDivideUpdateMatchLocation();
		}


timeB = Code.getTimeMilliseconds();
console.log("DELTA C: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();

	}


world.debugCheckPairPointMatchCounts();

}


// SHOW:
Stereopsis.World.prototype.showForwardBackwardPair = function(){ // ..
	console.log("showForwardBackwardPair");
	var world = this;

	var transforms = world.toTransformArray();
	var transform = transforms[0];
// console.log(transform);
	// 
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var F = transform.F(viewA,viewB);
	// ????
	// console.log(transform);
	console.log(F);
	var Finv = R3D.fundamentalInverse(F);
	var imageMatrixA = viewA.image();
	var imageMatrixB = viewB.image();

	var matches = transform.matches();
	var samplesA = [];
	var samplesB = [];
	var affines = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA).point2D();
		var pointB = match.pointForView(viewB).point2D();
		var affine = match.affineForViews(viewA,viewB)
		samplesA.push(pointA);
		samplesB.push(pointB);
		affines.push(affine);
	}
	// ...

	// cover for obviousness:
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setFill(0x99FFFFFF);
	d.graphics().drawRect(0,0, imageMatrixA.width()+imageMatrixB.width(), Math.max(imageMatrixB.height(),imageMatrixA.height()));
	d.graphics().endPath();
	d.graphics().fill();
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	console.log(samplesA, samplesB);

	R3D.showFundamental(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);

	var cellSize = viewA.cellSize();

	R3D.showForwardBackwardCells(samplesA, samplesB, affines, imageMatrixA,imageMatrixB, GLOBALSTAGE, cellSize);
		

}
Stereopsis.World.prototype.dropWorstParametersF = function(sigma){ // ..
	sigma = Code.valueOrDefault(sigma, 2.0);
	console.log("dropWorstParametersF");
	var world = this;

	world.estimateGlobalErrors();

// 	sigma = Code.valueOrDefault(sigma, 2.0);
// console.log("estimate3DErrors ............")
// 	world.estimate3DErrors(true);
// 	world.estimate3DErrors(true); // why twice

	// estimate3DErrors
	var transforms = world.toTransformArray();
	var points3D = world.toPointArray();
	var views = world.toViewArray();
	var sigmaKeepF = sigma;
	var sigmaKeepN = sigma;
	var sigmaKeepS = sigma;
	// var sigmaKeepC = 1.0;
	var percentKeepC = 0.90; // 075 - 0.90
	// clear each match's temp
	// for(var i=0; i<points3D.length; ++i){
	// 	var point3D = points3D[i];
	// 	var matches = point3D.toMatchArray();
	// 	for(var j=0; j<matches.length; ++j){
	// 		var match = matches[j];
	// 		match.temp(true);
	// 	}
	// }
	// get corner scores for P2Ds
	var dropC = 0;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var corners = view.corners();
		var image = view.image();
		var width = image.width();
		var height = image.height();
		var points2D = view.toPointArray();
		var cellSize = view.cellSize();
		var halfSize = cellSize*0.5 | 0;
		var values = [];
		var wm1 = width - 1;
		var hm1 = height - 1;
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point = point2D.point2D();
			var value = 0;
			var x = Math.round(point.x);
			var y = Math.round(point.y);
			var minX = Math.max(0, x-halfSize);
			var minY = Math.max(0, y-halfSize);
			var maxX = Math.min(wm1,x+halfSize);
			var maxY = Math.min(hm1,y+halfSize);
			var count = 0;
			for(var y=minY; y<=maxY; ++y){
				for(var x=minX; x<=maxX; ++x){
					var index = y*width + x;
					// value = Math.max(value, corners[index]);
					++count;
					value += corners[index];
				}
			}
			if(Code.isNaN(value)){
				console.log(value);
				console.log(count);
				console.log(point2D);
				console.log(corners);
				throw "value is NaN";
			}
			// if(Code.isNaN(value)){
			// 	value = 0;
			// }else{
			value /= count;
			// }
			point2D.temp(value);
			values.push(value);
		}

		// values.sort();

		values = values.sort(function(a,b){
			return a < b ? -1 : 1;
		});

		// var range = Code.range corners;
		// var info = Code.infoArray(corners);
		// var min = info["min"];
		// var max = info["max"];
		// var range = info["range"];
		// 
		// console.log(values);
		// var min = Code.min(values);
		// var sigma = Code.stdDev(values,min);
		// var limitC = min + sigma*sigmaKeepC;
		// var limitPercent = Code.percentile(scores,limitPercent);
		var p = 1.0-percentKeepC;
		// console.log("percent KEEP: "+percentKeepC);
		// console.log("percent REMOVE: "+p);
		var limitC = Code.percentile(values,p);
		// console.log(limitC);
		Code.printMatlabArray(values);
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(point2D.temp() >= limitC){ // keep big
				point2D.temp(true);
			}else{
				++dropC;
				point2D.temp(false);
			}
		}
	}
	console.log("dropC: "+dropC);
	// mark each MATCH as satisfying 
	var dropF = 0;
	// var dropR = 0;
	var dropN = 0;
	var dropS = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		// var meanR = transform.rMean();
		// var sigmaR = transform.rSigma();
var errorListN = [];
		var meanF = transform.fMean();
		var sigmaF = transform.fSigma();
		var meanN = transform.nccMean();
		var sigmaN = transform.nccSigma();
		var meanS = transform.sadMean();
		var sigmaS = transform.sadSigma();
		var limitF = meanF + sigmaF*sigmaKeepF;
		var limitN = meanN + sigmaN*sigmaKeepN;
		var limitS = meanS + sigmaS*sigmaKeepS;
		console.log(limitF,limitN,limitS);
		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorF = match.errorF();
			var errorN = match.errorNCC()
			var errorS = match.errorSAD();
errorListN.push(errorN);
			var passF = errorF<limitF;
			var passN = errorN<limitN;
			var passS = errorS<limitS;
			var passC = match.point2DA().temp() && match.point2DB().temp();
			dropF += passF ? 0 : 1;
			dropS += passS ? 0 : 1;
			dropN += passN ? 0 : 1;
			if(passF && passN && passS && passC){
				// console.log();
				match.temp(true);
			}else{
				match.temp(false);
			}
		}
	}
	console.log("dropF: "+dropF);
	console.log("dropN: "+dropN);
	console.log("dropS: "+dropS);
	// Code.printMatlabArray(errorListN,"n");
	// only keep P3Ds with ALL matches satisfying
	var dropP3D = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		var keep = true;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			if(!match.temp()){
				keep = false;
				break;
			}
		}
		if(!keep){
			dropP3D.push(point3D);
		}
	}
	var percent = dropP3D.length/points3D.length;
	if(percent>0.5){
		console.log(dropP3D);
		console.log(points3D);
		console.log(dropP3D.length/points3D.length);
		// .
		// .
		// ???
		// .
		// .
		throw "removing too many" // 0.90 * 0.95 * 0.95 * 0.95 = 0.75
	}
	console.log(">> DROP COUNT: "+dropP3D.length+" = "+percent);
	for(var i=0; i<dropP3D.length; ++i){
		var point3D = dropP3D[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "not yet"
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solvePairR = function(completeFxn, completeContext){ // pairwise
	var world = this;
	console.log("SOLVEPAIRR");

	world._completeFxn = completeFxn;
	world._completeContext = completeContext;

	var data = {};
	data["errors"] = [];
	data["splits"] = [5,15,25];
	data["previousError"] = -1;

var maxIterations = 4;
data["splits"] = [1];

world.printPoint3DTrackCount();

world.debugCheckPairPointMatchCounts();


world._retryCount = 0;
world._maxIterationsR = maxIterations;

	for(var i=0; i<maxIterations; ++i){
		var shouldQuit = world.iterationR(i, maxIterations, data);
		if(shouldQuit){
			break;
		}
	}


world.printPoint3DTrackCount();

	// console.log(world);
	// var str = world.toYAMLString();
	// console.log(str);
	// throw "..."

// Code.printMatlabArray(data["errors"]);
	if(world._completeFxn){
		world._completeFxn.call(world._completeContext);
	}
}
Stereopsis.World.prototype.iterationR = function(iterationIndex, maxIterations, data){
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
	console.log(data);
	var world = this;
	var transforms = world.toTransformArray();
	var views = world.toViewArray();


var maxRetriesP = 2;

	var viewA = views[0];
	var viewB = views[1];
	var transAB = world.transformFromViews(viewA,viewB);
		viewA = transAB.viewA();
		viewB = transAB.viewB();

	var viewSize = viewA.size();
	var pixelMinimum = viewSize.length() * 0.001; // 0.01 = 25.2, 0.001 = 2.5

	if(transAB.matchCount()<8){
		return;
	}
	// var existingError = transAB.rMean() + transAB.rSigma();
	var errorRMean = world.globalErrorRMean();
	var errorRSigma = world.globalErrorRMean();
	var errorDNE = errorRMean===null || errorRMean===0;
	var existingError = !errorDNE ? (errorRMean + errorRSigma) : 0;
	var highEnoughError = errorDNE || (existingError > pixelMinimum);

	console.log("pixelMinimum: "+existingError+" >?> "+pixelMinimum+" ("+highEnoughError+") ...");



	if(isFirst || highEnoughError){ // SET INITIAL VIEW CAMERA EXTRINSICS

console.log("FIRST TIME - CHECK");
		// world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
console.log("BEFORE A")
// TODO: will existing R errors throw things off if this is not the first time ?

		world.relativeFFromSamples(); // calculate F
		world.estimateGlobalErrors();





		// var viewA = views[0];
		// var viewB = views[1];
		// var transAB = world.transformFromViews(viewA,viewB);
		var hasResult = world.estimateRForTransform(transAB);
		console.log("estimateRForTransform:");
		console.log(hasResult);
		if(!hasResult){
			console.log( "no R ... -----------------------------------------------------------------------------------------------");
			if(world._retryCount<maxRetriesP){
				++world._maxIterationsR;
				++world._retryCount;
			}
			viewA.absoluteTransform(new Matrix(4,4).identity());
			viewB.absoluteTransform(new Matrix(4,4).identity());

		}else{
			console.log("SETTING 2 VIEW TRANSFORMS AS RELATIVE");
			var R =  transAB.R(viewA,viewB);
			viewA.absoluteTransform( new Matrix(4,4).identity() );
			viewB.absoluteTransform( R );


			var points3D = world.toPointArray();
			for(var i=0; i<points3D.length; ++i){
				var point3D = points3D[i];
				var isValid = point3D.isValid();
				if(!isValid){
					console.log(points3D)
					console.log(i)
					console.log(point3D)
					throw "invalid point3D Q";
				}
			}



			world.createAllPoints3DPatches();

			// now have R errors
			world.estimateGlobalErrors();
		}


	}else{
console.log("BEFORE B")
		// throw "R is good enough -> go forward"
		world.relativeFFromSamples();
		world.estimateGlobalErrors();

	}



var hasR = true;

var points3D = world.toPointArray();
var countHasPatch = 0;
for(var i=0; i<points3D.length; ++i){
	var point3D = points3D[i];
	var isValid = point3D.isValid();
	if(!isValid){
		console.log(points3D)
		console.log(i)
		console.log(point3D)
		world.isValidPoint3DAndPatch3D(point3D, true);
		throw "invalid point3D B";
	}
	if(point3D.hasPatch()){
		++countHasPatch;
	}
}
if( !(countHasPatch==points3D.length || countHasPatch==0) ){
	console.log(points3D)
	// console.log();
	console.log(countHasPatch)
	throw "different patch counts:"
}
if(countHasPatch==0){
	hasR = false;
}


console.log("hasR: "+hasR);


	// absolute-relative consistency
	world.copyRelativeTransformsFromAbsolute();



world.debugCheckPairPointMatchCounts();

// var points3D = world.toPointArray();
// for(var i=0; i<points3D.length; ++i){
// 	var point3D = points3D[i];
// 	var isValid = point3D.isValid();
// 	if(!isValid){
// 		console.log(points3D)
// 		console.log(i)
// 		console.log(point3D)
// 		world.isValidPoint3DAndPatch3D(point3D);
// 		throw "invalid point3D A";
// 	}
// 	if(!point3D.hasPatch()){
// 		console.log(points3D);
// 		console.log(i);
// 		console.log(point3D);
// 		throw "point not have patch A";
// 	}
// }




// var str = world.toYAMLString();
// console.log(str);
// throw "AFTER P";


	if(!viewA.absoluteTransform() || !viewB.absoluteTransform()){
		throw "missing transform";
	}


world.debugCheckPairPointMatchCounts();
	// expand
		var sigmaMaximumSelect = 2.0;
		var sigmaMaximumKeep = 1.0;
		world.probe2DCellsExpandR(sigmaMaximumSelect, sigmaMaximumKeep);
world.debugCheckPairPointMatchCounts();

// var points3D = world.toPointArray();
// for(var i=0; i<points3D.length; ++i){
// 	var point3D = points3D[i];
// 	var isValid = point3D.isValid();
// 	if(!isValid){
// 		console.log(points3D)
// 		console.log(i)
// 		console.log(point3D)
// 		world.isValidPoint3DAndPatch3D(point3D, true);
// 		throw "invalid point3D B";
// 	}
// 	if(!point3D.hasPatch()){
// 		console.log(points3D);
// 		console.log(i);
// 		console.log(point3D);
// 		throw "point not have patch B";
// 	}
// }	
console.log("after expand");
		// filter
// world.debugCheckPairPointMatchCounts();
// 			world.filterPairwiseErrors(2.0);
// var points3D = world.toPointArray();
// for(var i=0; i<points3D.length; ++i){
// 	var point3D = points3D[i];
// 	var isValid = point3D.isValid();
// 	if(!isValid){
// 		console.log(points3D)
// 		console.log(i)
// 		console.log(point3D)
// 		throw "invalid point3D B1";
// 	}
// 	if(!point3D.hasPatch()){
// 		console.log(points3D);
// 		console.log(i);
// 		console.log(point3D);
// 		console.log( world.isValidPoint3DAndPatch3D(point3D) );
		
// 		throw "point not have patch B1";
// 	}
// }
			world.filterGlobalErrors(2.0);
			world.filterNeighborConsistency2D3D();
			world.filterNeighborConsistency2DViews();
			world.filterGlobalNegativeDepth();
			world.filterGlobalPatchVisibilityConsistency();
			world.filterLocalError2D();
			world.filterLocalError3D();
			// throw "after filter"
			
			if(iterationIndex==1){
				console.log("SUBDIVIDING PAIR-R");
				// subdivide
				var subdivisionMultiplier = 0.75;
				world.subdivideViewGridsR(subdivisionMultiplier);
				world.subDivideUpdateMatchLocation();
			}


// world.debugCheckPairPointMatchCounts();

// var points3D = world.toPointArray();
// for(var i=0; i<points3D.length; ++i){
// 	var point3D = points3D[i];
// 	var isValid = point3D.isValid();
// 	if(!isValid){
// 		console.log(points3D)
// 		console.log(i)
// 		console.log(point3D)
// 		throw "invalid point3D";
// 	}
// 	if(!point3D.hasPatch()){
// 		console.log(points3D);
// 		console.log(i);
// 		console.log(point3D);
// 		throw "point not have patch E";
// 	}
// }

		// refine camera location:

			// var iterationsUpdateViewSingle = 50;
			// world.refineSelectCameraMultiViewTriangulation(viewFocus, iterationsUpdateViewSingle);
			// world.copyRelativeTransformsFromAbsolute();
			// world.reInitPoint3DLocationPatches();



}




Stereopsis.World.prototype.debugInvestigationA = function(){
	var world = this;
	var distanceRatio = 0;
	var distancCount = 0;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var locationA = point3D.point();
		if(locationA){
			var views = point3D.toViewArray();
			var points2D = [];
			var extrinsics = [];
			var invsK = [];
			for(var j=0; j<views.length; ++j){
				var view = views[j];
				var point2D = point3D.pointForView(view);
				var p2D = point2D.point2D();
				var ext = view.absoluteTransform();
				var inv = view.Kinv();
				if(j==0){
					p2D = p2D.copy();
					p2D.x += 1;
				}
				points2D.push(p2D);
				extrinsics.push(ext);
				invsK.push(inv);
			}
			var locationB = R3D.triangulatePointDLTList(points2D, extrinsics, invsK);
			if(locationB){
				for(var j=0; j<views.length; ++j){
					var view = views[j];
					var center = view.center();
					var distanceA = V3D.distance(center,locationA);
					var distanceB = V3D.distance(center,locationB);
					var diff = V3D.distance(locationA,locationB);
					if(distanceA>0){
						var ratio = diff/distanceA;
						distanceRatio += ratio;
						distancCount++;
					}
				}
			}
		}
	}
	if(distancCount>0){
		distanceRatio /= distancCount;
	}
	console.log("debugInvestigationA - average distance with 1px change in 1 P2D: "+distanceRatio+" ("+distancCount+")");
}
Stereopsis.World.prototype.initAllP3DPatches = function(points3D){
	var world = this;
	if(!points3D){
		points3D = world.toPointArray();
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		world.initP3DPatchFromMode(point3D);
	}
}

Stereopsis.World.prototype.initNullP3DPatches = function(points3D){
	throw "initNullP3DPatches...";
	var world = this;
	if(!points3D){
		points3D = world.toPointArray();
	}
	var count = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.hasPatch()){
			world.initP3DPatchFromMode(point3D);
			++count;
		}
	}
	console.log("initNullP3DPatches : "+count);
}

Stereopsis.World.prototype.initP3DPatchFromMode = function(point3D){
	return this._resolutionProcessingModePatchInit(point3D);
}

Stereopsis.World.prototype.updateP3DPatchFromMode = function(point3D, previousLocation3D, transformInfo){
	return this._resolutionProcessingModePatchUpdate(point3D, previousLocation3D, transformInfo);
}

Stereopsis.World.prototype.affineP2DFromMode = function(newMatch){ // TODO: should this be a point (possibly multiple matches) or a single match
	return this._resolutionProcessingModeAffineSet(newMatch);
}

Stereopsis.World.prototype._resolutionProcessingModeAffineFromVisual2D = function(newMatch){ // for affineP2DFromMode
	// TODO: Add reuse images & mask


	var viewA = newMatch.viewA();
	var viewB = newMatch.viewB();
	var pointA = newMatch.point2DA().point2D();
	var pointB = newMatch.point2DB().point2D();
	var featureSizeA = viewA.compareSizeForPoint(pointA); //(viewA.compareSize()+viewB.compareSize())*0.5;
	var affineSize = featureSizeA * 2.0; // bigger area is more stable .... ?
	var compareSize = Math.min(Math.max(affineSize,3),7); // 5 - 9
	var affine = newMatch.affine();
	if(affine){
		if( Code.isNaN( affine.get(0,0) ) ){
			console.log(newMatch);
			console.log(newMatch.point2DA().point2D());
			console.log(newMatch.point2DB().point2D());
			console.log(viewA.imageScales());
			console.log(viewB.imageScales());
			throw "found NaN in match affine";
		}
	}

	var maxIterations = 3;
	var rangeScale = 1.25;
	var rangeAngle = Code.radians(15); // TODO: this depends on the division percent : feature size to source size
	var result = R3D.experimentAffineRefineSingle(pointA,pointB,affine, viewA.imageScales(),viewB.imageScales(),affineSize, rangeAngle,rangeScale,maxIterations);
	var affine = result["affine"];
// console.log("here  ................ affine");
	// var result = R3D.optimizeSADAffineCorner(newMatch.point2DA().point2D(),newMatch.point2DB().point2D(),
	// 	viewA.imageScales(),viewB.imageScales(),
	// 	featureSize, compareSize, affine, maxIterations);
	// var affine = result["affine"];

	newMatch.affine(affine);
}

Stereopsis.World.prototype._resolutionProcessingModeAffineFromPatch3D = function(newMatch){ // set affines for each match from P3D projection
	// console.log("_resolutionProcessingModeAffineFromPatch3D");
	var point3D = newMatch.point3D();
	var location3D = point3D.point();
	var normal3D = point3D.normal();
	var size3D = point3D.size();
	var up3D = point3D.up();
	var points2D = point3D.toPointArray();
	var extrinsics = [];
	var Ks = [];
	// var views = [];
	for(i=0; i<points2D.length; ++i){
		var view = points2D[i].view();
		var K = view.K();
		var extrinsic = view.absoluteTransform();
		extrinsics.push(extrinsic);
		Ks.push(K);
	}
	// console.log(location3D, size3D, normal3D, up3D, extrinsics, Ks);
	var affines = null;
	try{
		var result = R3D.projectivePatch3DToAffineList(location3D, size3D, normal3D, up3D, extrinsics, Ks);
		if(result){
			affines = result["affines"];
		}else{ // throw "bad result"
			console.log("projectivePatch3DToAffineList - null result");
		}
	}catch(e){
			console.log(location3D, size3D, normal3D, up3D, extrinsics, Ks);
		console.log(result);
		console.log(affines);
		console.log(e);
		throw "bad again A";
	}
	// console.log(result);
try{
	
	var index = 0;
	for(i=0; i<points2D.length; ++i){
		var viewA = points2D[i].view();
		for(j=i+1; j<points2D.length; ++j){
			var viewB = points2D[j].view();
			var match = point3D.matchForViews(viewA,viewB);
			var affine = null;
			if(affines){
				affine = affines[index];
			}else{
				affine = new Matrix2D().identity();
			}
			match.affineForViews(viewA,viewB, affine);
			++index;
		}
	}
}catch(e){
	console.log(location3D, size3D, normal3D, up3D, extrinsics, Ks);
	console.log(result);
	console.log(affines);
	console.log(e);
	throw "bad again B";
}
}

Stereopsis.World.prototype.resolutionProcessingModeAffineFromNeighbors2D = function(newMatch){ // average 2D neighbors to get affine average
	var neighbor2DCount = 6; // 3-6 + 1
	var world = this;
	var point3D = newMatch.point3D();
	var point2DA = newMatch.point2DA();
	var point2DB = newMatch.point2DB();
	var pointA = point2DA.point2D();
	var pointB = point2DA.point2D();
	var points2D = [point2DA,point2DB];
	var viewA = newMatch.viewA();
	var viewB = newMatch.viewB();

	var evalFxn = function(p){
		var p3D = p.point3D();
		if(p3D==point3D){
			return false;
		}
		if(p3D.hasView(viewA) && p3D.hasView(viewB)){
			return true;
		}
		return false;
	}
	var points3D = {};
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var point = point2D.point2D();
		var view = point2D.view();
		var space = view.pointSpace();
		var neighbors2D = space.kNN(point,neighbor2DCount, evalFxn);
		for(var j=0; j<neighbors2D.length; ++j){
			var neighbor2D = neighbors2D[j];
			var p3D = neighbor2D.point3D();
			points3D[p3D.id()] = p3D;
		}
	}
// console.log(points3D);
	var matches = Code.objectToArray(points3D);
// console.log(matches);
	if(matches.length==0){ // only need 1
		throw "no matches";
	}
	var affines = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i].matchForViews(viewA,viewB);
if(!match){
	console.log(".................................................");
	var pnt = matches[i];
	console.log(matches);
	console.log(pnt);
	console.log(pnt.hasView(viewA));
	console.log(pnt.hasView(viewB));
	console.log(viewA);
	console.log(viewB);
	console.log(points3D);
	throw "why no match?";
}
		matches[i] = match;
		affines[i] = match.affineForViews(viewA,viewB);
	}
// console.log(matches);
// console.log(affines);
	// weight by sigma of 3D distance
	var distances = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var p2DA = match.pointForView(viewA);
		var p2DB = match.pointForView(viewB);
		var dA = V2D.distance(p2DA.point2D(),pointA);
		var dB = V2D.distance(p2DB.point2D(),pointB);
		var distance = (dA + dB)*0.5;
		distances.push(distance);
	}
// console.log(distances);
	// to normal percents
	var percents = [];
	var minD = Code.min(distances);
	var sigD = Code.stdDev(distances, minD);
	var den = 2*sigD*sigD;
	var totalPercent = 0;
	for(var i=0; i<distances.length; ++i){
		var distance = distances[i];
		var percent = Math.exp( Math.pow(distance-minD,2)/den );
		percents.push(percent);
		totalPercent += percent;
	}
	totalPercent = 1.0/totalPercent;
	for(var i=0; i<percents.length; ++i){
		percents[i] = percents[i]*totalPercent;
	}
// console.log(percents);
	var affine = Code.averageAffineMatrices(affines, percents, new Matrix2D());
// console.log(affine);
	newMatch.affineForViews(viewA,viewB,affine);
	// Code.averageAffineMatrices = function(affines, percents, result){
	// throw "resolutionProcessingModeAffineFromNeighbors2D"
}

Stereopsis.World.prototype.resolutionProcessingModeAffineFromBestNeighbor2D = function(newMatch){
	// no op - new match already set from best neighbor
}

Stereopsis.World.prototype.initP3DPatchFromMatchAffine = function(point3D){
	var p3D = point3D.point();
	var points2D = point3D.toPointArray();
	if(points2D.length<2){
		console.log("no points 2D");
		return;
	}
	var p2Ds = [];
	var sizes = [];
	var exts = [];
	var Ks = [];
	var Kinvs = [];
	var centers = [];
	var rights = [];
	var a2Ds = [];
	for(var i=0; i<points2D.length; ++i){
		var p2D = points2D[i];
		var view = p2D.view();
		p2Ds[i] = p2D.point2D();
		sizes[i] = view.cellSize();
		exts[i] = view.absoluteTransform();
		Ks[i] = view.K();
		Kinvs[i] = view.Kinv();
		centers[i] = view.center();
		rights[i] = view.right();
		if(i>0){
			var p0 = points2D[0];
			var v0 = p0.view();
			var match = p0.matchForView(view);
			var affine = match.affineForViews(v0,view);
			a2Ds.push(affine);
		}
	}
	try{
		var info = R3D.projectivePatch3DInitFromAffineList(p3D, p2Ds, a2Ds, sizes, exts, Ks, Kinvs, centers, rights);
		point3D.normal(info["normal"]);
		point3D.up(info["up"]);
		point3D.size(info["radius"]);
	}catch(e){
		console.log(point3D);
		console.log(p3D, p2Ds, a2Ds, sizes, exts, Ks, Kinvs, centers, rights);
		console.log(e);
		throw "why?";
	}
}
Stereopsis.World.prototype.initP3DPatchFromOnly2D = function(point3D){ // only assumes 2D locations & views are set - estimage 3D params
	var world = this;
	var views = point3D.toViewArray();

	// P3D
	var newLocation3D = point3D.estimated3D();
	if(!newLocation3D){
		world.updatePoint3DLocation(point3D,null);
		return;
	}
	// console.log(newLocation3D);

	// N3D = average of point-to-view directions
	var normals = [];
	var ups = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pToC = V3D.sub(view.center(),newLocation3D);
			pToC.norm();
		var up = view.up();
		if(ups.length>0){
			var up0 = ups[0];
			if(V3D.dot(up0,up)<1){
				up = up.copy();
				up.flip();
			}
		}
		normals.push(pToC);
		ups.push(up);
	}
	// up-3D
	// console.log(normals);
	// console.log(ups);
	var newNormal3D = Code.averageAngleVector3D(normals);
	var newUp3D = Code.averageAngleVector3D(ups);
	var right3D = V3D.cross(newNormal3D,newUp3D);
		newUp3D = V3D.cross(right3D,newNormal3D);
		newUp3D.norm();
	// console.log(newNormal3D,newUp3D.length());
	// console.log(newUp3D,newUp3D.length());
	// size-3D
	var currentSize = 0; // initial estimate = project N points onto plane
	var twoPi = 2*Math.PI;
	var pointsPerView = 4;
	var dir2D = new V2D();
	var loc3D = new V3D();
	var sizeCount = views.length*pointsPerView;
	for(var i=0; i<views.length; ++i){
		// project point backwards
		var view = views[i];
		var Kinv = view.Kinv();
		var cellSize = view.cellSize();
		var absolute = view.absoluteTransformInverse();
		var center3D = view.center();
		var point2D = point3D.pointForView(view);
		var p2D = point2D.point2D();
		for(var j=0; j<pointsPerView; ++j){
			dir2D.set(0.5*cellSize,0);
			dir2D.rotate(twoPi*j/pointsPerView);
			dir2D.add(p2D);
			var ray3D = R3D.projectPoint2DToCamera3DRay(dir2D, absolute, Kinv, null);
				var o3D = ray3D["o"];
				var d3D = ray3D["d"];
			var intersection = Code.intersectRayPlane(o3D,d3D, newLocation3D,newNormal3D); // PLANAR INTERSECTION -- requires normals first
			var distance = V3D.distance(intersection,newLocation3D);
			// console.log(distance);
			currentSize += distance;
		}
	}
	currentSize /= sizeCount;
	// console.log(" => "+currentSize);
	// iterate to find optimal size
	world.updatePoint3DLocation(point3D,newLocation3D);
	point3D.normal(newNormal3D);
	point3D.up(newUp3D);
	currentSize = world.iteratePoint3DSizeFromInitial(point3D,currentSize);
	// console.log(" x> "+currentSize);
	point3D.size(currentSize);
}
Stereopsis.World.prototype.initP3DPatchFromGeometry3D = function(point3D){ // assumes affine already exists
	var world = this;
	var points2D = point3D.toPointArray();
	var location3D = point3D.point();
	// project 2D points via affine
	var twoPi = 2*Math.PI;
	var pointsPerView = 4;
	// console.log(points2D);
	var pointsA = [];
	var pointsB = [];
	var p = new V2D();
	var q = new V2D();
	var p3D = new V3D();
	var p2Din3DList = [];
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var p2DA = point2DA.point2D();
		var viewA = point2DA.view();
		var featureSizeA = viewA.compareSizeForPoint(p2DA);
		var cameraA = viewA.absoluteTransform();
		var KaInv = viewA.Kinv();
		for(var j=i+1; j<points2D.length; ++j){
			var point2DB = points2D[j];
			var p2DB = point2DB.point2D();
			var viewB = point2DB.view();
			var featureSizeB = viewB.compareSizeForPoint(p2DB);
			var cameraB = viewB.absoluteTransform();
			var KbInv = viewB.Kinv();
			var match = point3D.matchForViews(viewA,viewB);
			var affineAB = match.affineForViews(viewA,viewB);
			var affineBA = match.affineForViews(viewB,viewA);
if(!affineAB || !affineBA){
	console.log(match);
	console.log(point2DA);
	console.log(point2DB);
	console.log(KaInv);
	console.log(KbInv);
	throw "???";
}
			for(var k=0; k<pointsPerView; ++k){
				p.set(0.5*featureSizeA,0);
				p.rotate( (k/pointsPerView)*twoPi );
				affineAB.multV2DtoV2D(q,p);
				p.add(p2DA);
				q.add(p2DB);
				R3D.triangulatePointDLT(p,q, cameraA,cameraB, KaInv, KbInv,  p3D);
				p2Din3DList.push(p3D.copy());
			}
		}
	}

	// HERE: is points2D length zero ?

if(p2Din3DList.length<=3){
	return;
}
	// console.log(p2Din3DList);
	// var plane = Code.planeFromPoints3D(location3D, p2Din3DList);
	var plane = Code.planeFromPoints3D(p2Din3DList);
	// console.log(plane);
	var normal3D = plane["normal"];
	var center3D = plane["point"];
	// console.log(center3D+" v "+location3D+" = "+V3D.distance(location3D,center3D));
	point3D.normal(normal3D);
if(!normal3D){
	console.log(point3D);
	console.log(plane);
	console.log(normal3D);
	console.log(center3D);
	throw "no normal3D";
}
	var radii = [];
	for(var i=0; i<p2Din3DList.length; ++i){
		var p = p2Din3DList[i];
		p = p.copy().sub(center3D);
		var d = V3D.perpendicularComponent(normal3D,p);
		var r = d.length();
		radii.push(r);
	}
	var radius3D = Code.averageNumbers(radii);
	// console.log(radii);
	// console.log("radii: "+radius3D);

	// get up = average view ups:
	var ups = [];
	var nms = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var up = view.up().copy();
		var nm = view.normal().copy();
		if( i>0 && V3D.dot(up,ups[0])<0 ){
			up.scale(-1);
		}
		if( i>0 && V3D.dot(nm,nms[0])<0 ){
			nm.scale(-1);
		}
		ups.push(up);
		nms.push(nm);
	}
	var up3D = Code.averageAngleVector3D(ups);
	var nm3D = Code.averageAngleVector3D(nms);
if(!nm3D || !up3D){
	console.log(point3D);
	console.log(radius3D);
	console.log(plane);
	console.log(p2Din3DList);
	console.log(nm3D);
	console.log(up3D);
	console.log("...");
	throw "no value";
}
	if(V3D.dot(nm3D,normal3D)>0){
		normal3D.flip();
	}
	var patchUp = Code.projectPointToPlane3D(up3D, V3D.ZERO,normal3D);
	patchUp.norm();
	// console.log("patchUp: "+patchUp+"");
point3D.up(patchUp);
	// get size = projected minimum error
	// var maxIterations = 10;
	
	var size3D = world.iteratePoint3DSizeFromInitial(point3D,radius3D);
	point3D.size(size3D);
}
Stereopsis.World.prototype.iteratePoint3DSizeFromInitial = function(point3D, radius3D){
	var points2D = point3D.toPointArray();
	var location3D = point3D.point();
	var normal3D = point3D.normal();
	var patchUp = point3D.up();

	var twoPi = 2*Math.PI;
	var pointsPerView = 4;

	var maxIterations = 5;
	var size3D = radius3D;
	var pointsPerView = 4;
	var center2D = new V2D();
	var limitMin = null;
	var limitMax = null;
	for(var i=0; i<maxIterations; ++i){
		// console.log(" size3D: "+size3D+"        @@@@@@@@@@@@@@@@@@@@@@@@ "+i+" .............. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		var distanceError = 0; // sum of percentage
		var totalCount = 0;
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p2D = point2D.point2D();
			var view = point2D.view();
			var compareSize = view.compareSizeForPoint(p2D);
			var radSize = 0.5*compareSizeForPoint;
			// project into each view
			view.projectPoint3D(center2D, location3D); // get actual center point reprojection
			for(var k=0; k<pointsPerView; ++k){
				var v = patchUp.copy();
				v.scale(size3D);
				v.rotate(normal3D, (k/pointsPerView)*twoPi );
				// var v = new V3D();
				v.add(location3D);
				// get error
				var p = view.projectPoint3D(v);
				var d = V2D.distance(center2D,p);
					d = d/radSize;
				distanceError += d;
				++totalCount;
			}
		}
		distanceError/=totalCount;
// console.log("distanceError: "+distanceError);
		// update size:
		var nextSize = size3D / distanceError;
		// 
		if(distanceError>1.0){
			if(limitMax==null){
				limitMax = size3D;
			}else{
				limitMax = Math.min(limitMax,size3D);
			}
			nextSize = Math.min(nextSize,limitMax);
		}else{
			if(limitMin==null){
				limitMin = size3D;
			}else{
				limitMin = Math.max(limitMin,nextSize);
			}
			nextSize = Math.max(nextSize,limitMin);
		}
		// console.log("LIMITS: "+limitMin+" - "+limitMax);
		if(limitMin!==null && limitMax!==null){
			var maybe = limitMin + (limitMax-limitMin)*0.5;
			// console.log("try : "+maybe);
		}
		// this is faster ?
		// size3D = nextSize;
		//
		var ratio = nextSize>size3D ? nextSize/size3D : size3D/nextSize;
		size3D = nextSize;
		// console.log("   NEXT size3D: "+size3D);
		// if(ratio<1.00000000000001){
		if(ratio<1.00001){ /// 1/10k
			// console.log("   out early ");
			break;
		}
	}
	return size3D;
}

Stereopsis.World.prototype.initP3DPatchFromGeometry3DAveraging = function(point3D){
	// init patch using :
	var location3D = point3D.point();
	if(!location3D){
		console.log("initP3DPatchFromGeometry3D - null location3D");
		return;
	}
	var points2D = point3D.toPointArray();
	// var fr = points2D[0].point2D();
	// var to = points2D[1].point2D();
	// var absA = points2D[0].view().absoluteTransformInverse();
	// var absB = points2D[1].view().absoluteTransformInverse();
	// var KaInv = points2D[0].view().Kinv();
	// var KbInv = points2D[1].view().Kinv();
	// var midpoint3D = R3D.triangulatePointMidpoint(fr,to, absA,absB, KaInv, KbInv);
	// console.log("LOCATION: "+location3D);
	// console.log("MIDPOINT: "+midpoint3D);
	// console.log("       D: "+V3D.distance(location3D,midpoint3D));
if(points2D.length==0){
	console.log("nothing in array points2D");
	return;
}
	// NORMAL & RIGHT:
	var normals = [];
	var rights = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var center3D = view.center();
		var pToV = V3D.sub(center3D,location3D);
		pToV.norm();
		normals.push(pToV);
		var right = view.right().copy().scale(-1);
		// var c = view.center();
		// var n = view.normal().copy().scale(-1);
		// var pc = V3D.sub(c,isLocation);
		// pc.norm();
		// normals.push(pc);
		if( i>0 && V3D.dot(right,rights[0])<0 ){ // should use closest DOT PRODUCT: left or right
			right.scale(-1);
		}
		rights.push(right);
	}

// console.log(point3D);
// console.log(points2D);
// console.log(normals);
// console.log(rights);
// console.log(normal3D);
// console.log(right3D);
	var normal3D = Code.averageAngleVector3D(normals);
	var right3D = Code.averageAngleVector3D(rights);
	if(!normal3D || !right3D){

		console.log(normals);
		console.log(rights);
		throw "no normal or right?"
	}
	var up3D = V3D.cross(normal3D,right3D); // or opposite
	// SIZE : METHOD A - similar triangles: less accurate further away from primary point (can possibly get angle ?) (~10% diff) -- FASTER
	/*
	var radii = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var focalLength = view.focalLength();
		var cellSize = view.cellSize();
		var halfSize = cellSize*0.5;
		var center = view.center();
		var distance = V3D.distance(location3D,center);
		// similar triangles: r/d = s/f
		var radius = distance * halfSize/focalLength; // 
		radii.push(radius);
	}
	var radius = Code.averageNumbers(radii);
	console.log("guessed radius: "+radius);
	*/
	// SIZE : METHOD B - cast rays (sphere / plane) -- ACCURATE
	// project points to find closest
	var projectCount = 4; // 3-6
	var radii = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var center2D = point2D.point2D();
		var view = point2D.view();
		var cellSize = view.cellSize();
		var halfSize = cellSize*0.5;
		var Kinv = view.Kinv();
		var center3D = view.center();
		var absolute = view.absoluteTransformInverse();
		var radius = 0;
// console.log(halfSize+" , "+center2D+" TO VIEW: "+view.id()+" = "+V3D.distance(location3D,center3D));
		for(var j=0; j<projectCount; ++j){
			var p2D = new V2D(halfSize,0);
			p2D.rotate(2.0*Math.PI*j/projectCount);
			p2D.add(center2D);
			var ray3D = R3D.projectPoint2DToCamera3DRay(p2D, absolute, Kinv, null);
				var o3D = ray3D["o"];
				var d3D = ray3D["d"];
			// var closest3D = Code.closestPointLine3D(o3D,d3D,location3D); // CLOSEST POINT -- sphere = slightly smaller guess (~1% diff)
			// var distance = V3D.distance(closest3D,location3D);
// console.log("d1: "+distance);
			var intersection = Code.intersectRayPlane(o3D,d3D, location3D,normal3D); // PLANAR INTERSECTION -- requires normals first
			var distance = V3D.distance(intersection,location3D);
// console.log("d2: "+distance);
			radius += distance;
		}
		radius /= projectCount;
		radii.push(radius);
	}
	var radius = Code.averageNumbers(radii);
	point3D.normal(normal3D);
	point3D.up(up3D);
	point3D.size(radius);
}
Stereopsis.World.prototype.setP3DPatchUpFromViews = function(point3D){
	var views = point3D.toViewArray();
	var ups = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var up = view.up();
		if(ups.length>0){ // keep ups in same direction
			if(V3D.dot(up,ups[0])<0){
				up = up.copy().scale(-1);
			}
		}
		ups.push(up);
	}
	var up = Code.averageAngleVector3D(ups);
	var normal = point3D.normal();
	var right = V3D.cross(normal,up);
		up = V3D.cross(right,normal);
	point3D.up(up);
}
Stereopsis.World.prototype.updateP3DPatchFromViewDeltas = function(point3D,prevLocation3D,viewInfo){ // use difference in angle and distance to change normal & size
// console.log(viewInfo);
	if(!viewInfo){
		// throw "don't care about cases without view orientation change"
		return;
	}
	var world = this;
// console.log(point3D);
	var location3D = point3D.point();
	var normal = point3D.normal();
	var up = point3D.up();
	var size = point3D.size();
	var views = point3D.toViewArray();
	// update
	var sizes = [];
	var normals = [];
	var ups = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var entry = viewInfo[viewID];
// console.log(entry);
		var prev = entry["prev"];
		var next = entry["next"];
		var prevCenter = prev["absolute"].multV3DtoV3D(V3D.ZERO);
		var nextCenter = next["absolute"].multV3DtoV3D(V3D.ZERO);
// console.log(prevCenter,nextCenter);
		var delta = entry["delta"];
		var newOrigin = delta.multV3DtoV3D(V3D.ZERO);
		var newNormal = delta.multV3DtoV3D(normal);
		var newUp = delta.multV3DtoV3D(up);
			newNormal.sub(newOrigin);
			newUp.sub(newOrigin);
			newNormal.norm();
			newUp.norm();
		normals.push(newNormal);
		ups.push(newUp);
		var dA = V3D.distance(prevLocation3D,prevCenter);
		var dB = V3D.distance(location3D,nextCenter);
		// console.log(dA,dB);
		newSize = dB*(size/dA);
		sizes.push(newSize);
	}
// console.log(sizes);
// console.log(normals);
// console.log(ups);
	// average away new expected sizes
	var normal = Code.averageAngleVector3D(normals);
	var up = Code.averageAngleVector3D(ups);
	var size = Code.averageNumbers(sizes);
// console.log(size);
// console.log(normal);
// console.log(up);
	// var up = point3D.up(); // use existing 
	var right = V3D.cross(normal,up);
		up = V3D.cross(right,normal);
	point3D.size(size);
	point3D.normal(normal);
	point3D.up(up);
	// throw "..."
}

Stereopsis.World.prototype.updateP3DPatchFromNone = function(point3D){
	// do nothing, assume views / patches changes are negligible
}

Stereopsis.World.prototype.initP3DPatchFromVisual = function(point3D){
	this.initP3DPatchFromGeometry3D(point3D);
	this.updateP3DPatchFromVisual(point3D);
}

Stereopsis.World.prototype.initP3DPatchFromNeighborhoodVisual = function(point3D){ // init toward camera, update based on neighborhood, update based on images
	this.initP3DPatchFromGeometry3D(point3D); // view geometry
	this.updatePatchesPoint3DFromNeighborhood(point3D); // neighborhood normal + images
}

Stereopsis.World.prototype.updateP3DPatchFromVisual = function(point3D){

	throw "when?";

	var world = this;
	var points2D = point3D.toPointArray();
	var sizes2D = [];
	var imageScales = [];
	var extrinsics = [];
	var Ks = [];
	var ps2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var size = view.cellSize();
		var imageScale = view.imageScales();
		if(!imageScale){
			// console.log("no image - updateP3DPatchFromVisual");
			return;
		}
		var K = view.K();
		var extrinsic = view.absoluteTransform();
		sizes2D.push(size);
		imageScales.push(imageScale);
		extrinsics.push(extrinsic);
		Ks.push(K);
		ps2D.push(point2D.point2D());
	}

	// get more accurate size - iteritive (from initial size)
	var location3D = point3D.point();
	var size3D = point3D.size();
	var normal3D = point3D.normal();
	var up3D = point3D.up();
	if(!location3D || !size3D || !normal3D || !up3D){
		// console.log(location3D,size3D,normal3D,up3D, ps2D,sizes2D, extrinsics,Ks);
		// var new3D = point3D.calculateAbsoluteLocationDLT(this, true);
		// console.log(new3D);console.log(this._pointSpace.toArray());
		// console.log(this._points3DNull);
		// console.log(this.toPointArray());
		// throw "bad location"
		console.log("null location - updateP3DPatchFromVisual");
		return;
	}
// console.log(location3D,size3D,normal3D,up3D, ps2D,sizes2D, extrinsics,Ks);
/*
	// TODO: IS THIS NEEDED?
	var result = R3D.optimizePatchSizeProjected(location3D,size3D,normal3D,up3D, ps2D,sizes2D, extrinsics,Ks);
	// throw "why this again?"



	// console.log(result);
	size3D = result["size"];
	if(Code.isNaN(size3D) || size3D<=0){
		console.log("optimizePatchSizeProjected - > NaN point3D")
		point3D.size(null);
		point3D.normal(null);
		point3D.up(null);
		return;
	}
*/


	// point3D.size(size3D);
	// point3D.normal(normal3D);
	// point3D.up(up3D);
	// return;
	// get normal more accurate
var updateSize3D = size3D * 2.0; // affine more expanded
	
	var result = R3D.optimizePatchSizeProjected(location3D,size3D,normal3D,up3D, ps2D,sizes2D, extrinsics,Ks);
	var normal = result["normal"];
	var up = result["up"];
	point3D.size(size3D);
	point3D.normal(normal);
	point3D.up(up);
	
// 	var result = world.patchFromNeighborhood(point3D);
// // console.log(result);
// // throw "?"
// 	if(result){ // can update
// 		throw "..."
// 	}



	// 


	// var result = R3D.optimizePatchNonlinearImages(location3D,updateSize3D,normal3D,up3D, ps2D,imageScales, extrinsics,Ks);

	console.log(result);

	throw "result";

// console.log(result);
// throw "optimizePatchNonlinearImages"
	
	


// TODO: remove
// throw "remove this - updateP3DPatchFromVisual";
// return;
}
Stereopsis.World.prototype.updatePatchesPoints3DFromNeighborhood = function(points3D){ // update normal by average plane in point neighborhood
	var world = this;
	if(!points3D){
		points3D = world.toPointArray();
	}
	for(var j=0; j<points3D.length; ++j){
		var point3D = points3D[j];
		world.updatePatchesPoint3DFromNeighborhood(point3D);
	}

}
Stereopsis.World.prototype.updatePatchesPoint3DFromNeighborhood = function(point3D){
	var world = this;
	var result = world.patchFromNeighborhood(point3D);
	if(result){
		var normal = result["normal"];
		// set
		point3D.normal(normal);
		world.directionNormalPoint3DToViewsOpposite(point3D);
		var up = V3D.perpendicularComponent(normal,point3D.up()).norm();
		point3D.up(up);
		// refine visually
		world.updateP3DPatchFromVisual(point3D);
	}
}
Stereopsis.World.prototype.directionNormalPoint3DToViewsOpposite = function(point3D){
	var dotExtrinsics = 0;
	var views = point3D.toViewArray();
	var normal = point3D.normal();
	for(var i=0; i<views.length; ++i){
		// var ext = views[i].absoluteTransform();
		var fwd = views[i].normal();
		var dot = V3D.dot(fwd,normal);
		if(dot>=0){
			dotExtrinsics += 1;
		}else{
			dotExtrinsics -= 1;
		}
	}
	if(dotExtrinsics>0){ // pointing in same direction
		normal.flip();
	}
}
Stereopsis.World.prototype.patchFromNeighborhood = function(point3D){
	var world = this;
	// var location3D = point3D.point();
	var neighborhood = world.neighborhood2D3DForPoint3D(point3D, 6);
	if(!neighborhood){
		return null;
	}
	// find local plane
	// console.log(neighborhood);
	for(var i=0; i<neighborhood.length; ++i){
		neighborhood[i] = neighborhood[i].point();
	}
	// console.log(neighborhood);
	var plane = Code.planeFromPoints3D(neighborhood);
	// console.log(plane);
// throw "..."
	var result = {};
		result["normal"] = plane["normal"];
		// result["up"] = null;
	return result;
}

Stereopsis.World.prototype.neighborhood2D3DForPoint3D = function(point3D, minimumNeighborhoodCount){
	var world = this;
	minimumNeighborhoodCount = minimumNeighborhoodCount!==undefined ? minimumNeighborhoodCount : 4;
	// var minimumNeighborhoodCount = 4; // 2D OR 3D should be at least this dense [3x3 grid would have 9] : 4-8 + 1
	var neighborhoodSizeScale = 2.0; // 1.0-2.0
	var neighbors3D = world.neighborhoodFor3DPointPatch(point3D,neighborhoodSizeScale);
	// console.log(point3D);
// console.log(neighbors3D);
// throw "why zero"
	if(neighbors3D.length<minimumNeighborhoodCount){
		return null;
	}
	var hash3D = {};
	var value3D = {};
	for(var j=0; j<neighbors3D.length; ++j){
		var p3D = neighbors3D[j];
		var index = p3D.id();
		hash3D[index] = 0;
		value3D[index] = p3D;
	}
	// get 2D list
	var points2D = point3D.toPointArray();
	var point2DCount = points2D.length;
	for(var j=0; j<point2DCount; ++j){
		var point2D = points2D[j];
		var neighbors2D = world.neighborhoodFor2DPoint(point2D,neighborhoodSizeScale);
		if(neighbors2D.length<minimumNeighborhoodCount){
			return null;
		}
		for(var k=0; k<neighbors2D.length; ++k){
			var p3D = neighbors2D[k].point3D();
			var index = p3D.id();
			var value = hash3D[index];
			if(value!==undefined){
				hash3D[index] = value + 1;
			}
		}
	}
	// TODO: desired gaussian window falloff?
	// collect all 
	var neighborhood = [];
	var keys = Code.keys(hash3D);
	for(var j=0; j<keys.length; ++j){
		var key = keys[j];
		if(hash3D[key] == point2DCount){
			neighborhood.push(value3D[key]);
		}
	}
	// console.log(hash3D);
	// console.log(neighborhood);
	if(neighborhood.length<minimumNeighborhoodCount){
		return null;
	}
	return neighborhood;
}

Stereopsis.World.prototype.showProjectedPatches = function(){
	var world = this;
	var points3D = world.toPointArray();

	var views = world.toViewArray();


	// var displaySize = new V2D(800,600);
	var displaySize = new V2D(1000,800);
	var displayImages = [];
	var offsetsX = [];
	var scales = [];

	var offX = 0;
	for(var i=0; i<views.length; ++i){
		offsetsX[i] = offX;
		var view = views[i];
		var imageScales = view.imageScales();
		var info = imageScales.getImageSize(displaySize);
		var image = info["image"];
		var scale = info["scale"];
		scales[i] = 1.0/scale;
console.log(imageScales);
console.log(image);
console.log(scale);
		displayImages.push(image);

		// ImageMatScaled.prototype.getImageSize = function(idealSize, maxScale, minScale){
		

		img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
		var d = new DOImage(img);
		// d.matrix().scale(sca);
		// d.graphics().alpha(0.5);
		d.matrix().translate(0 + offX, 0 + 0);
		GLOBALSTAGE.addChild(d);
		offX += image.width();
	}


	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// var points2D = point3D.toPointArray();
		var location3D = point3D.point();
		var normal3D = point3D.normal();
		var up3D = point3D.up();
		var size3D = point3D.size();
var color = Code.getColARGBFromFloat(1.0, Math.random(),Math.random(),Math.random());
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var displayScale = scales[j];//displayImages[j].width()/view.imageScales().width()
			var point2D = point3D.point2DForView(view);
			if(point2D){
				// var cellSize = view.cellSize();
				// var halfSize = cellSize*0.5;
				// 
				// var projectCount = 4;
				var projectCount = 8;
				var pi2 = Math.PI*2.0;



var d = new DO();
d.graphics().setLine(2.0,color);
d.graphics().beginPath();
				for(var k=0; k<projectCount; ++k){
					var p = up3D.copy();
						p.scale(size3D);
						p.rotate(normal3D, pi2*k/projectCount);
						p.add(location3D);
					var p2D = view.projectPoint3D(p);
					p2D.scale(displayScale);
					if(k==0){
						d.graphics().moveTo(p2D.x,p2D.y);
					}else{
						d.graphics().lineTo(p2D.x,p2D.y);
					}
				}
d.graphics().endPath();
d.graphics().strokeLine();
d.matrix().translate(0 + offsetsX[j], 0);
GLOBALSTAGE.addChild(d);
			}
		}
	}

	throw "showProjectedPatches";
}
Stereopsis.World.prototype.initP3DPatchFromNeighbors = function(point3D){ // set patch based on neighborhood average
	var neighborCount2D = 6; // (3 - 6) + 1
	var points2D = point3D.toPointArray();
	var location3D = point3D.point();
	var neighbors3D = {};
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var space = view.pointSpace();
		var point = point2D.point2D();
		var neighbors2D = space.kNN(point,neighborCount2D);
		for(var j=0; j<neighbors2D.length; ++j){
			var  neighbor2D = neighbors2D[j];
			if(neighbor2D!=point2D){
				var neighbor3D = neighbor2D.point3D();
				if(neighbor3D.hasPatch()){
					var pID = neighbor3D.id();
					neighbors3D[pID] = neighbor3D;
				}
			}
		}
	}
	neighbors3D = Code.objectToArray(neighbors3D);
	// console.log(neighbors3D);
	var sizes = [];
	var normals = [];
	var ups = [];
	if(neighbors3D.length==0){
		console.log(point3D);
		console.log("no neighbors 3D");
		throw ".... likely no points have had their patches initted yet"
		return;
	}
	// weight by sigma of 3D distance
	var distances = [];
	for(var i=0; i<neighbors3D.length; ++i){
		var neighbor3D = neighbors3D[i];
		normals.push(neighbor3D.normal());
		sizes.push(neighbor3D.size());
		ups.push(neighbor3D.up());
		var distance = V3D.distance(neighbor3D.point(),location3D);
		distances.push(distance);
	}
// console.log(distances);
	var percents = [];
	var minD = Code.min(distances);
	var sigD = Code.stdDev(distances, minD);
	var den = 2*sigD*sigD;
	var totalPercent = 0;
	for(var i=0; i<distances.length; ++i){
		var distance = distances[i];
		var percent = Math.exp( Math.pow(distance-minD,2)/den );
		percents.push(percent);
		totalPercent += percent;
	}
	totalPercent = 1.0/totalPercent;
	for(var i=0; i<percents.length; ++i){
		percents[i] = percents[i]*totalPercent;
	}
// console.log(percents);
	// average
	var normal = Code.averageAngleVector3D(normals, percents);
	var up = Code.averageAngleVector3D(ups, percents);
	var size = Code.averageNumbers(sizes, percents);
	var right = V3D.cross(normal,up);
	V3D.cross(up, right,normal);
	up.norm();
	point3D.size(size);
	point3D.normal(normal);
	point3D.up(up);
// console.log(point3D);
	// throw "..."
}
Stereopsis.World.prototype.initP3DPatchFromBestNeighbor = function(point3D){ //set patch based on closest 3D neighbors with at least 1 view in common
	var world = this;
	var location3D = point3D.point();
	var space = world.pointSpace();
	// neighbor must have a view in common
	var evalFxn = function(p){
		if(p==point3D){
			return false;
		}
		var views = p.toViewArray();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			if(p.hasView(view)){
				return true;
			}
		}
		return false;
	}
	var closest3D = space.kNN(location3D,1, evalFxn);
// console.log(closest3D);
	if(closest3D.length==0){
		throw "no nearest neighbor";
	}
	closest3D = closest3D[0];
	point3D.normal(closest3D.normal());
	point3D.up(closest3D.up());
	point3D.size(closest3D.size());
// console.log(point3D);
	// throw "initP3DPatchFromBestNeighbor";
}






// Stereopsis.World.prototype.initAffineFromP3DPatches = function(points3D){
// 	var world = this;
// 	if(!points3D){
// 		points3D = world.toPointArray();
// 	}
// 	// console.log(points3D);
// 	var temp = Stereopsis.World._TEMP_PATCH_VS;
// 	var center2D = temp[0];
// 	var up2D = temp[1];
// 	var dn2D = temp[2];
// 	var lf2D = temp[3];
// 	var ri2D = temp[4];
// 	var temp3D = temp[5];

// 	for(var i=0; i<points3D.length; ++i){
// 		var point3D = points3D[i];
		
// 		var p3D = point3D.point();
// 		if(!p3D){
// 			continue;
// 		}
// 		var size = point3D.size();
// 		var normal = point3D.normal();
// 		var up = point3D.up(up);

// 		var points2D = point3D.toPointArray();

// 		var distances = [];
// 		var pts = [];
// 		var sizes = [];
// 		var quit = false;
// 		for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
// 			var point2D = points2D[j];
// 			var pnt2D = point2D.point2D();
// 			var view = point2D.view();
// 			var viewNormal = view.normal();
// 			var maxPatchSize = view.cellSize();
// 			var patchCount = 1;
// 			var patchSize = maxPatchSize*0.5;

// 			throw "use compare size"
// 			view.projectPoint3D(center2D, p3D);
// 			var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
// 			var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
// 			// parallelUp;
// 			var up3D = V3D.add(p3D,parallelUp);
// 			var dn3D = V3D.sub(p3D,parallelUp);
// 			var lf3D = V3D.sub(p3D,parallelRi);
// 			var ri3D = V3D.add(p3D,parallelRi);
// 			view.projectPoint3D(up2D, up3D);
// 			view.projectPoint3D(dn2D, dn3D);
// 			view.projectPoint3D(lf2D, lf3D);
// 			view.projectPoint3D(ri2D, ri3D);
// 				up2D.sub(center2D);
// 				dn2D.sub(center2D);
// 				lf2D.sub(center2D);
// 				ri2D.sub(center2D);
// 			var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
// 			if(avg==0){
// 				quit = true;
// 				break;
// 			}
// 			var s = 0.5*patchSize/avg; // scale from projected size to patch size for full patch size
// 			if(s==Infinity){
// 				throw "infinite size";
// 			}
// 			sizes.push(s);
// 			pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
// 			// 3D distance
// 			V3D.sub(temp3D, view.center(),p3D);
// 			var distance = temp3D.length();
// 			distances.push(distance);
// 		}
// 		// if(quit){
// 		// 	continue;
// 		// }

// 		for(var j=0; j<points2D.length; ++j){
// 			var point2DA = points2D[j];
// 			var distA = distances[j];
// 			var ptsA = pts[j];
// 			var viewA = point2DA.view();
// 			for(var k=j+1; k<points2D.length; ++k){
// 				var point2DB = points2D[k];
// 				var distB = distances[k];
// 				var ptsB = pts[k];
// 				var viewB = point2DB.view();

// 				var match = point3D.matchForViews(viewA,viewB);
// 				if(quit){
// 					match.affineForViews(viewA,viewB, null);
// 					continue;
// 				}

// 				// affine directly: more accurate for actual projections
// 				// if(false){
// 				if(true){
// 					try{
// 						var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
// 						match.affineForViews(viewA,viewB, affine);
// 					}catch(e){
// 						console.log("affineCornerMatrixLinear - convergence error?");
// 						console.log(ptsA,ptsB);
// 						throw e;
// 						// match.affineForViews(viewB,viewA, affine);
// 					}
// 				// affine from summary stats:
// 				}else{
// 					var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
// 					var angles = [];
// 					for(var p=0; p<ptsA.length; ++p){
// 						var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
// 						angles.push(angle);
// 					}
// 					var angle = Code.averageAngles(angles);
// 					var match = point3D.matchForViews(viewA,viewB);
// 					var affine = new Matrix2D();
// 						affine.identity();
// 						affine.scale(scale);
// 						affine.rotate(angle);
// 					match.affineForViews(viewA,viewB, affine); // A to B
// 				}
// 			}
// 		}
// 	}
// }

Stereopsis.World.prototype.subdivideViewGridsR = function(scaleRatio, minCellSize){
	return this.subdivideViewGrids(scaleRatio, minCellSize, true);
}

Stereopsis.World.prototype.subdivideViewGridsF = function(scaleRatio, minCellSize){
	return this.subdivideViewGrids(scaleRatio, minCellSize);
}

Stereopsis.World.prototype.subdivideViewGrids = function(scaleRatio, minCellSize){//, isR){
	// throw "how to use isR?????"
	scaleRatio = Code.valueOrDefault(scaleRatio, 0.5);
	minCellSize = Code.valueOrDefault(minCellSize, 5);
	var world = this;
	var views = world.toViewArray();

	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var size = view.cellSize();
		// if(isR){
		// 	view.temp(size);
		// }
		var newSize = size*scaleRatio | 0;
		if(newSize%2==0){
			newSize += 1;
		}
		// newSize = Math.max(newSize,3);
		console.log("CHANGE CELL SIZE: "+size+" -> "+newSize);
		if(size!=newSize){
			view.cellSize(newSize);
		}
	}
	/*
	// if(isR){
		// world.updatePatchSizeFromViewCellSizeChange();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			view.temp(null);
		}
	// }
	*/
}
Stereopsis.World.prototype.updatePatchSizeFromViewCellSizeChange = function(){

	throw "updatePatchSizeFromViewCellSizeChange";
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var views = point3D.toViewArray();
			var ratios = [];
			for(var j=0; j<views.length; ++j){
				var view = views[j];
				ratio = view.cellSize()/view.temp();
				ratios.push(ratio);
			}
			var ratio = Code.mean(ratios); // these will be the same unless images have different densities
			var size = point3D.size();
			size *= ratio;
			point3D.size(size);
		}
	}
}
Stereopsis.World.prototype.iteration_solvePairOld = function(iterationIndex, maxIterations, data){
	// throw "re evaluate stufffff"

	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
	var world = this;
	// SUBDIVIDE:
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	var transform0 = transforms[0];
	// increase cover toward end
	var view0 = views[0];
	var maxErrorRPercent = 0.01; // 5-10 pixels
		maxErrorRPercent = 0.005;
		// maxErrorRPercent = 0.0025; // ?
	var maxErrorRPixels = maxErrorRPercent*view0.size().length();
	console.log("maxErrorRPixels: "+maxErrorRPixels);

	var splitIndex = Code.valueOrDefault(data["splits"][0], -1);
	var error = Code.valueOrDefault(transform0.rMean()+transform0.rSigma(), 0);
	var prevError = data["previousError"];
	data["errors"].push(error);

	// if(false){
	if(iterationIndex==splitIndex){
		data["splits"].pop();
	// if(iterationIndex==10 || iterationIndex==15){
	// if(iterationIndex==10){
	// if(iterationIndex==5){
	// if(iterationIndex==3){
		// var views = this.toViewArray();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var size = view.cellSize();
			size = size*0.5 | 0;
			if(size%2==0){
				size += 1;
			}
			console.log("CHANGE CELL SIZE: "+view.cellSize()+" -> "+size);
			view.cellSize(size);
		}
	}
// TODO: IF R ERROR > 2~5 => don't reuse old estimate
	var shouldRetryInit = false;
	var shouldPropagate = false;

	var errorT0 = transform0.rMean() + transform0.rSigma();
	if(iterationIndex==0){
		shouldRetryInit = true;
	}else if(errorT0>maxErrorRPixels){ // transform.rMean()+" +/- "+transform.rSigma()
		shouldRetryInit = true;
	}else{
		shouldPropagate = true;
	}
	shouldPropagate = true;

console.log("START");
	if(shouldRetryInit){ // subsequent approximations are always worse than the refined estimates
		console.log("RETRY INIT: "+maxErrorRPixels+" px ");
		world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		// console.log("A");
// don't need to do this if only 2 views ?
		// this.estimate3DViews(); // find absolute view locations

		var viewA = views[0];
		var viewB = views[1];
		var transAB = world.transformFromViews(viewA,viewB);
		var R = transAB.R();
		if(transAB.viewA()!=viewA){
			viewA = transAB.viewA();
			viewB = transAB.viewB();
		}
		console.log("SETTING 2 VIEW TRANSFORMS AS RELATIVE");
		viewA.absoluteTransform(new Matrix(4,4).identity());
		viewB.absoluteTransform(R);
		// this.copyRelativeTransformsFromAbsolute(); // relative R from absolutes
		world.relativeFFromSamples();

		world.averagePoints3DFromMatches(); // find absolute point locations
		// console.log("C");
	}else{
		world.relativeFFromSamples(); // update F
		world.estimate3DErrors(true, false); // update errors using absolute-relative transforms
	}


	console.log("continue ...");
	this.recordTransformErrorStart();
console.log("continue ...");
	// this.patchInitOnly();
	if(iterationIndex==0){
		// this.generateMatchAffineFromPatches();
		// this.searchPoints2DBestMatch();
		// this.estimate3DErrors(true);
	}else{
		// this.patchInitBasicSphere(true);
		// refine points 3D
		// this.refinePoint3DAbsoluteLocation();
		// this.estimate3DErrors(true);
	}

// var doRelaxed = true;
var doRelaxed = iterationIndex%2==0;

doRelaxed = false;

// if(transform0.rSigma()>maxErrorRPixels){
// 	console.log("BAD R");
// 	this.recalculateMatchVisualErrors();
// 	doRelaxed = true;
// }

	// TODO: ONLY BREAK IF ERROR IS VERY LOW OR IF ERROR CHANGE IS TINY


	// try to distribute the error between depths
	
	// this.refineCameraAbsoluteOrientation(100); // refine initial absolute camera locations
	// this.copyRelativeTransformsFromAbsolute();


	// RE-TRIANGULATE POINTS ALONG WITH MOVING VIEWB:
		console.log("REFINE");
	world.refineCameraPairRelativeToAbsolute(transform0, 100, true);
	world.copyRelativeTransformsFromAbsolute();
	world.relativeFFromSamples();

	// this.averagePoints3DFromMatches(); // camera orientions have changed => points have new locations
	// this.refinePoint3DAbsoluteLocation();

	// SPHERE - PATCHES
	this.patchInitBasicSphere(true);
console.log("AFTER PATCH SPHERE");
	// EXPAND
	if(shouldPropagate){
		// var propagationPercent = 0;
		// if(doRelaxed){
		// 	propagationPercent = this.probe2DNNAffine(3.0);
		// }else{
		// 	propagationPercent = this.probe2DNNAffine(2.0);
		// }
		world.probe2DCells(999);
		// console.log("propagationPercent: "+propagationPercent);
		// if(propagationPercent<0.05){
		// 	console.log("can split");
		// }
	}
world.printPoint3DTrackCount();
console.log("AFTER PROP");
	// reassess
	this.estimate3DErrors(true);




	// drop worst
	// world.dropNegativePoints3D();

// IF THIS DROPS -> WRONG 



world.printPoint3DTrackCount();
console.log("AFTER DROP NEG");

	this.dropFurthest();
world.printPoint3DTrackCount();
console.log("AFTER DROP FAR");

if(doRelaxed){
	// this.filterGlobalMatches(false, 0, 4.0,4.0,4.0,4.0, false);
	this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
}else{
	// this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
	this.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
}
	

	// world.filterPairwiseSphere3D(1.0); // 2-3
	world.filterGlobalPatchSphere3D(1.0, false);
world.printPoint3DTrackCount();
console.log("AFTER FILTER GLOBAL");



	// console.log("after drop");
	// this.estimate3DErrors(true);

	// FILTER 2D F / R / M errpr

	// this.filterLocal2D(); // ....... DOES THIS MAKE MUCH OF A DIFFERENCE ? --- NEEEED THIS FOR SINGLE PAIR

	// should wait till point density is very high
//	this.filterLocal3Dto2DSize();

	// this.filterLocal3Dto2DProjection();

	world.filterNeighborConsistency();

	this.recordTransformErrorEnd();

	var deltas = this.averageTransformDeltaError();
	console.log(deltas);
	var errorF = deltas["F"];
	var errorR = deltas["R"];
	if(Math.abs(errorR)<0.0001){
		console.log("tiny R");
	}

	this.printInfo();
// }
	if(isLast){
		// this.refinePoint3DAbsoluteLocation();
		// this.estimate3DErrors(true);
	}


	// early quitting criteria:
	// error isn't going down
	// number of matches isn't going up


	return false;
}
Stereopsis.World.prototype.recalculateMatchVisualErrors = function(){ // increase visual cell size tfor all views to discard ones that look ok zoomed in
	console.log("recalculateMatchVisualErrors");
	// recalculateMatchVisualErrors
}

Stereopsis.World.prototype.reconstructionRelativeMetrics = function(){ // makes assumptions that only a single pair is present -- average distance between points RELATIVE to point volume
	var world = this;
	var transforms = world.toTransformArray();
	var metricList = [];

	var neighborhoodCount = 8;
	var viewReference = null;
	var evalFxn = function(p){
		var m = p.matchForView(viewReference);
		return m!==null;
	};
	




	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var relativeAB = transform.R();
		if(!relativeAB){
			continue;
		}
			var locationA = new V3D(0,0,0);
			var locationB = relativeAB.multV3DtoV3D(locationA);
		var baselineDistance = V3D.distance(locationA,locationB);
		var matches = transform.matches();
		var dropPoints = [];
		var averageDistance = 0;
		var countedMatches = 0;
		var pointList3D = [];
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var views = [viewA,viewB];
			var oppos = [viewB,viewA];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var distance = 0;
			var point3D = match.point3D();
			var location3D = point3D.point();
// if(point3D.hasPatch()){
// 	console.log("no patch - skip reconstructionRelativeMetrics - ")
// }
			if(!location3D){
				console.log(match);
				console.log(point3D);
				console.log(location3D);
				throw "handle a null location";
			}
			pointList3D.push(location3D);
			for(var v=0; v<views.length; ++v){ // get neighborhood in 2D -- knn vs cell radius ?
				var viewCurrent = views[v];
					viewReference = oppos[v];
				var pointCurrent = match.pointForView(viewReference);
				var point = pointCurrent.point2D();
				var neighborhood = viewCurrent.kNN(point,neighborhoodCount,evalFxn);
				if(neighborhood.length<=1){
					console.log("no neighbors")
					continue;
				}
				// get distances in 3D
				for(var n=0; n<neighborhood.length; ++n){
					var neighbor = neighborhood[n];
					if(neighbor==pointCurrent){
						continue;
					}
					distance += V2D.distance(point, neighbor.point2D());
				}
				distance /= (neighborhood.length-1);
				// console.log(".  "+j+" = "+distance);
				countedMatches++;
				averageDistance += distance;
			}
		}
		averageDistance = averageDistance/countedMatches;
		// console.log("averageDistance: "+averageDistance);
		// console.log("baselineDistance: "+baselineDistance);
		// var distanceRatio = averageDistance/baselineDistance;
		// console.log("distanceRatio: "+distanceRatio);
		console.log(pointList3D);
		if(pointList3D.length>=3){
			var cov = Code.covariance3DInfo(pointList3D);
			console.log(cov);
			var sigmaX = cov["sigmaX"];
			var sigmaY = cov["sigmaY"];
			var sigmaZ = cov["sigmaZ"];
			var sigma = (sigmaX + sigmaY + sigmaZ)/3.0;
			console.log("sigma: "+sigma);
			var distanceRatio = averageDistance/sigma;
			console.log("distanceRatio: "+distanceRatio);
			metricList.push(distanceRatio);
		}
	}
	/*
	var points3D = world.toPointArray();
	var pointList3D = [];
	for(var i=0; i<points3D.length; ++i){
		var location3D = point3D.point();
		if(location3D){
			points3D.push(point3D);
		}
	}
	if(pointList3D.length>=3){
		var cov = Code.covariance3DInfo(pointList3D);
		console.log(cov);
		var sigmaX = cov["sigmaX"];
		var sigmaY = cov["sigmaY"];
		var sigmaZ = cov["sigmaZ"];
		var sigma = (sigmaX + sigmaY + sigmaZ)/3.0;
		console.log("sigma: "+sigma);
		var distanceRatio = averageDistance/sigma;
		console.log("distanceRatio: "+distanceRatio);
		metricList.push(distanceRatio);
	}
	*/
	return {"list":metricList};
}
/*
GOOD:


Stereopsis.js:8854       matches: 9075           :  0 - 1
Stereopsis.js:8855  T 0 0->1  N : 0.005024164694019617 +/- 0.20031656757470825
Stereopsis.js:8857  T 0 0->1  F : 0.000017991303805421803 +/- 1.814663182885398
Stereopsis.js:8858  T 0 0->1  R : 0.00039979365646096427 +/- 0.7779453339122067
Stereopsis.js:8917 .       points: 9075       0 BTLZWLLY 
Stereopsis.js:8918  V M : 0.17610232502530337 +/- 0.20031656757470778
Stereopsis.js:8919  V F : 1.1967418165250805 +/- 1.8146631828853972
Stereopsis.js:8920  V R : 0.9660335692156375 : 0.00039979365646096427 +/- 1.2400191656004513
Stereopsis.js:8917 .       points: 9075       1 081TMCFX 
Stereopsis.js:8918  V M : 0.17610232502530318 +/- 0.20031656757470792
Stereopsis.js:8919  V F : 1.1967418165250803 +/- 1.8146631828853974
Stereopsis.js:8920  V R : 0.9660335692156383 : 0.00039979365646096427 +/- 1.2400191656004504

sigma: 5504.138098063205
distanceRatio: 0.001888170997284722

sigma: 8181.484119528519
distanceRatio: 0.0012646173173034084

sigma: 4411.348906849993
distanceRatio: 0.0023463957273532374


GOOD-OK:
sigma: 1597.3088384001665
distanceRatio: 0.00656039105059871

sigma: 327.41801720616894
distanceRatio: 0.038232647076990305

OK:


Stereopsis.js:8872       matches: 3293           :  0 - 1
Stereopsis.js:8873  T 0 0->1  N : 0.009624925962485653 +/- 0.16326833365568105
Stereopsis.js:8875  T 0 0->1  F : 0.005561265240199545 +/- 17.588928064825083
Stereopsis.js:8876  T 0 0->1  R : 26.46892369342944 +/- 10.369464678407315
Stereopsis.js:8935 .       points: 3293       0 BTLZWLLY 
Stereopsis.js:8936  V M : 0.2681304745340904 +/- 0.2823780662619929
Stereopsis.js:8937  V F : 13.42209290129691 +/- 17.58892806482508
Stereopsis.js:8938  V R : 60.40324513889493 : 26.46892369342944 +/- 35.483291415550994
Stereopsis.js:8935 .       points: 3293       1 4Y5BJC44 
Stereopsis.js:8936  V M : 0.2681304745340904 +/- 0.28237806626199274
Stereopsis.js:8937  V F : 13.422092901296919 +/- 17.588928064825083
Stereopsis.js:8938  V R : 60.403245138895 : 26.46892369342944 +/- 35.483291415551015




OK-POOR
sigma: 1117.1488422651646
distanceRatio: 0.01746356550385961



POOR:

????: ?????
sigma: 18581.970882172343
distanceRatio: 0.0017620663267356913



BAD:


*/

Stereopsis.World.prototype.testOutFinding = function(viewA,viewB, transformAB){

	console.log(transformAB);

	console.log("testOutFinding")

// 5SNAS7PP & QE8XO2VA

	// var pointA = new V2D(230,462);
	// var pointB = new V2D(220,460);

	// var pointA = new V2D(500,462);
	// var pointB = new V2D(520,460);

	// var pointA = new V2D(720,502);
	// var pointB = new V2D(760,500);


	// var pointA = new V2D(270,220);
	// var pointB = new V2D(370,220);

	// var pointA = new V2D(310,190);
	// var pointB = new V2D(400,190);

	// var pointA = new V2D(330,150);
	// var pointB = new V2D(420,130);

	// var pointA = new V2D(520,210);
	// var pointB = new V2D(610,210);

	// var pointA = new V2D(570,260);
	// var pointB = new V2D(700,220);

	// var pointA = new V2D(370,360);
	// var pointB = new V2D(300,360);

	var pointA = new V2D(690,500);
	var pointB = new V2D(700,500);

	var needleSize = 31;
	var haystackSize = needleSize*7;
	var affineAB = null;

	var result = R3D.optimumNeedleHaystackAtLocation(viewA.imageScales(),pointA, viewB.imageScales(),pointB, needleSize,haystackSize, affineAB, 11, true);

	console.log(result);


	pointB = result["point"];

	console.log("point: "+pointB);



// on original:
var offY = 400;
var sca = 0.75;
var image = viewA.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(sca);
// d.graphics().alpha(0.5);
d.matrix().translate(10 + 0, 10 + offY);
GLOBALSTAGE.addChild(d);

var image = viewB.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(sca);
// d.graphics().alpha(0.5);
d.matrix().translate(10 + viewA.image().size().x*sca, 10 + offY);
GLOBALSTAGE.addChild(d);

var s = 7;
var d = new DO();
d.graphics().setLine(2.0,0xFFFF0066);
d.graphics().beginPath();
d.graphics().drawCircle(0,0, s);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + pointA.x*sca + 0, 10 + pointA.y*sca + offY);
GLOBALSTAGE.addChild(d);

var d = new DO();
d.graphics().setLine(2.0,0xFFFF0066);
d.graphics().beginPath();
d.graphics().drawCircle(0,0, s);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + pointB.x*sca + viewA.image().size().x*sca, 10 + pointB.y*sca + offY);
GLOBALSTAGE.addChild(d);





	var cellScale = 0.250;
	var needleSize = 51;
	var haystackSize = 51;
	var imageA = viewA.imageScales()._images[0];
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,needleSize,needleSize, null);

	var imageB = viewB.imageScales()._images[0];
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);



	var sca = 1.0;
	var image = needle;
	console.log(image)
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	// d.matrix().scale(sca);
	// d.matrix().translate(10 + 0, 300);
	GLOBALSTAGE.addChild(d);

	var sca = 1.0;
	var image = haystack;
	console.log(image)
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	// d.matrix().scale(sca);
	// d.matrix().translate(10 + 200, 300);
	GLOBALSTAGE.addChild(d);




	throw "testing out fxn";
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/*
sequential ideas: GLOBAL FOCUS

	- initial 2-view-pair points - can use the pairwise R to get just the 2D locations first
		- set location from initial absolute R locations
		- set patch from absolute view Rs

	- iteration:

		VIEW R UPDATE:
		- optimize single view absolute R by minimizing reprojection error
		- optimize single view absolute R by moving close surfaces (3D points) toward each other


		POINT 3D UPDATE:
		- optimize point locations via geometry reprojection error
		- optimize point locations & patches by reprojecting to images & minimizing SAD error

		SUBDIVIDE / POINT 2D UPDATE:
		- view cell sizes *= percent
		- optimize point 2D locations keeping 3D stats the same

		EXPAND POINT 3D TRACK SUPPORT
		- reproject from absolute 3D location to other views
		- init new point with estimated location & patch with same values as existing

		- EXPAND POINT 3D NEIGHBORS IN 2D
		- for each view pair point3D has: search expected neighbor location (empty cell) for potential new match
		
		POINT 3D FILTER - DROP NEGATIVE
		- points estimated behind any of containing views removed

		POINT 3D FILTER - PATCH VISIBILITY CONSISTENCY
		- points in-front / behind others (and normals in same direction and not too close-patch-size) get vote if N/S error is worse
		- points with highest count are dropped


		POINT 3D FILTER - R
		- drop based on error = SUM(Rerror)/P2D-count

		POINT 3D FILTER - SAD
		- drop based on error = SUM(Serror)/P2D-count

		POINT 3D FILTER - NCC
		- drop based on error = SUM(Nerror)/P2D-count
	
		F FILTER?
		- ?


		POINT 3D FILTER - REGULARIZATION 2D->3D [filterCriteria2DN3DNregularization]
		- get separately: 2DN & 3DN -> if overlapping amount is low -> then 3D point is likely wrong
		
		
		
		POINT 3D FILTER - INCONSISTENT 2D SCORES [filterCriteria2DNnot3DN]
		- get separately: 2DN & 3DN -> if P2D not in 3DN -> inconsistent
		- if inconsistent neighbors' S|N values are significantly better -> 2D points are likely wrong

		POINT 3D FILTER - 3D NEIGHBORHOOD R-ERROR [filterLocal3DR]
		- get 3DN -> get R-error -> if Rerror >> neighborhood -> likely different

		POINT 3D FILTER - 2D NEIGHBORHOOD R-ERROR [filterLocal2DR]
		- get 2DN -> get R-error -> if Rerror >> neighborhood -> likely different



NOTES:
	- image features' ranges need to have some minimum for updating [maximum is average of reprojection]
		-> always use patch's size? 





			



*/


Stereopsis.World.prototype.putativePairsForViews = function(viewFocus, viewsAdjacent, onCompleteFxn, onCompleteCxt){ // optimum single view to all other views
	var world = this;
	var errorSearchRMaximumPercent = 0.001; // ? too little?
	var putativePointsList = [];

	var currentViewAdjacentIndex = 0;

	function doOperation(){
	// do R-guessing for each view pair - seed points
	// var errorSearchRMaximumPercent = 0.01; // ?
	// var errorSearchRMaximumPercent = 0.005; // ?
	
	// for(var i=0; i<viewsAdjacent.length; ++i){
		var viewA = viewFocus;
		var viewB = viewsAdjacent[currentViewAdjacentIndex];
		var transform = world.transformFromViews(viewA, viewB);
		console.log(transform);
		var R = transform.R();
		if(transform.viewA()==viewB){
			console.log("flip R for view");
			R = Matrix.inverse(R);
		}
console.log("RELATIVE R: \n"+R+"");
		// TO ABS  ?????
		// R = Matrix.inverse(R);

		// ... putativePoints.push();
		var imageScalesA = viewA.imageScales();
		var imageScalesB = viewB.imageScales();
		var Ka = viewA.K();
		var Kb = viewB.K();
		var doRelocation = false;
console.log("before searchMatchPointsPair3D");
		var result = R3D.searchMatchPointsPair3D(imageScalesA,imageScalesB, R, Ka,Kb, errorSearchRMaximumPercent, doRelocation); // forward
		console.log(result);
		var pointsA = result["A"];
		var pointsB = result["B"];
		var affinesAB = result["affines"];
		
		
		var needleRefineSize = 41; // .... BIG ?
		var haystackRefineSize = needleRefineSize + (needleRefineSize*0.5 | 0) + 2;
		var needleRefine = new ImageMat(needleRefineSize,needleRefineSize);
		var haystackRefine = new ImageMat(haystackRefineSize,haystackRefineSize);
		// var compareSize = imageScalesA.size().length() * 0.02;
		var compareSize = imageScalesA.size().length() * 0.01; // low error
		var doBlur = false;
		// var doBlur = true;
		// var halfCompareSize = compareSize;

		// var distanceMatchLimit = imageScalesA.size().length() * 0.01; // 0.01 - 0.02 // TODO: what if different image sizes ?
		var distanceMatchLimit = imageScalesA.size().length() * 0.001;

		// FURTHER DROP:
		// show matches & closest point:
		// var distances = [];
		for(var j=0; j<pointsA.length; ++j){
			var pointA = pointsA[j];
			var pointB = pointsB[j];
			var affineAB = affinesAB[j];
			var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScalesA,imageScalesB, compareSize, needleRefineSize,haystackRefineSize, affineAB, needleRefine,haystackRefine, doBlur);
			var best = result["point"];
			var dist = V2D.distance(best,pointB);
			// distances.push(dist);
			if(dist>distanceMatchLimit){
				Code.removeElementAt(pointsA,j);
				Code.removeElementAt(pointsB,j);
				Code.removeElementAt(affinesAB,j);
				// set to best point
				pointB.x = best.x;
				pointB.y = best.y;
			}
		}
		// console.log("distances: ");
		// Code.printMatlabArray(distances);

		console.log("FINAL COUNT: "+pointsA.length);


		// DISPLAY
		console.log("DISPLAY INITIAL MATCHES")
		var cellSize = viewFocus.cellSize();
		var showAngles = false;
		// console.log(GLOBALSTAGE);
		// GLOBALSTAGE.root().matrix().scale(0.25);
/*
if(false){
		var image = imageScalesA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
			d.graphics().alpha(0.2);
			d.matrix().translate(0,0);
			GLOBALSTAGE.addChild(d);
		var image = imageScalesB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
			d.graphics().alpha(0.2);
			d.matrix().translate(imageScalesA.width(),0);
			GLOBALSTAGE.addChild(d);

		R3D.showForwardBackwardPointsColor(pointsA, pointsB, affinesAB, imageScalesA,imageScalesB, GLOBALSTAGE, cellSize, showAngles);//, matchesAB,parameterUse){
}
*/

		var putativePoints = [];
		for(var j=0; j<pointsA.length; ++j){
			var pointA = pointsA[j];
			var pointB = pointsB[j];
			var point3D = world.newPoint3DFromPieces([viewA,viewB],[pointA,pointB],null,false);
			var location3D = point3D.globalPoint3DLinear();
			world.updatePoint3DLocation(point3D,location3D);
			putativePoints.push(point3D);
			world.disconnectPoint3D(point3D);
		}
		putativePointsList.push(putativePoints);


		++currentViewAdjacentIndex
		if(currentViewAdjacentIndex>=viewsAdjacent.length){
			console.log("FINISHED:");
			console.log(putativePointsList);
			var args = [[putativePointsList]];
			Code.functionAfterDelay(onCompleteFxn, onCompleteCxt, args, 1);
		}else{
			console.log("CONTINUE "+currentViewAdjacentIndex);
			Code.functionAfterDelay(doOperation, world, 1);
		}
	}

	Code.functionAfterDelay(doOperation, world, 1);
	// Code.functionAfterDelay = function(fxn,cxt, args, delay){
	// return putativePointsList;
}

Stereopsis.World._TEMP_PATCH_VS = [new V2D(),new V2D(),new V2D(),new V2D(),new V2D(), new V3D()];
Stereopsis.World.prototype.initPoint3DPatchSphere = function(point3D){ // coarse approximation of a patch
	// estimate normal & up - from view anti-normal
	var temp = Stereopsis.World._TEMP_PATCH_VS;
	var center2D = temp[0];
	var up2D = temp[1];
	var dn2D = temp[2];
	var lf2D = temp[3];
	var ri2D = temp[4];
	var temp3D = temp[5];
	// 
	var p3D = point3D.point();
	var info = Stereopsis.estimateP3DNormalFromViews(point3D);
	if(!info){
		console.log(point3D);
		throw "bad point";
	}
	var normal = info["normal"];
	var up = info["up"];
	point3D.normal(normal);
	point3D.up(up);
	var right = V3D.cross(normal,up).norm();
	// project thru views:
	var points2D = point3D.toPointArray();
	var sizes = [];
	for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
		var point2D = points2D[j];
		var pnt2D = point2D.point2D();
		var view = point2D.view();
		var viewNormal = view.normal();
		var targetPatchSize = view.compareSizeForPoint(pnt2D);
		// project (parallel) unit up to view plane
		view.projectPoint3D(center2D, p3D);
		var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
		var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
		var up3D = V3D.add(p3D,parallelUp);
		var dn3D = V3D.sub(p3D,parallelUp);
		var lf3D = V3D.sub(p3D,parallelRi);
		var ri3D = V3D.add(p3D,parallelRi);
		view.projectPoint3D(up2D, up3D);
		view.projectPoint3D(dn2D, dn3D);
		view.projectPoint3D(lf2D, lf3D);
		view.projectPoint3D(ri2D, ri3D);
			up2D.sub(center2D);
			dn2D.sub(center2D);
			lf2D.sub(center2D);
			ri2D.sub(center2D);
		var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
		if(avg<=0){
			console.log(up2D);
			throw "infinite size";
		}
		var s = 0.5*targetPatchSize/avg; // scale from projected size to patch full patch size
		sizes.push(s);
	}
	var size = Code.averageNumbers(sizes);
	point3D.size(size);

	// nonlinear update size
	var doNonlinearUpdate = true;
	if(doNonlinearUpdate){ // iterate to optimum
		var rangeMin = null;
		var rangeMax = null;
		var currentSize = size;
		var oSqrt2 = 1.0/Math.sqrt(2); //  0.70710678118
		// var up2D
		for(var k=0; k<10; ++k){
			// console.log("currentSize: "+currentSize+" ................................................. "+k);
			// project onto each view
			var center3D = p3D.copy();
			var u = up.copy().scale(currentSize);
			var r = right.copy().scale(currentSize);
			// left/right are reversed from view
			var TL3D = center3D.copy().add( u ).add( r );
			var TR3D = center3D.copy().add( u ).sub( r );
			var BR3D = center3D.copy().sub( u ).sub( r );
			var BL3D = center3D.copy().sub( u ).add( r );
			var totalSizeError = 0;
			for(var i=0; i<points2D.length; ++i){
				var point2D = points2D[i];
				var pnt2D = point2D.point2D();
				var view = point2D.view();
				var targetPatchRadius = view.compareSizeForPoint(pnt2D) * 0.5;
				var center2D = view.projectPoint3D(center3D);
				var TL2D = view.projectPoint3D(TL3D);
				var TR2D = view.projectPoint3D(TR3D);
				var BR2D = view.projectPoint3D(BR3D);
				var BL2D = view.projectPoint3D(BL3D);
				var list = [TL2D,TR2D,BL2D,BR2D];
				var distance = 0;
				for(var j=0; j<list.length; ++j){
					var p2D = list[j];
					var d = V2D.distance(p2D,center2D);
					distance += d;
				}
				distance /= list.length;
				distance *= oSqrt2; // hypotenuses
				// var error = (targetPatchSize - distance);
				var error = (distance - targetPatchRadius); // if smaller -> negative | if bigger -> positive
				// console.log("error: "+targetPatchRadius+" -> "+distance+" = "+error);
				// totalSizeError += Math.pow(distance-targetPatchSize);
				totalSizeError += error;
			}
			// console.log("totalSizeError: "+totalSizeError);
			// update range limits
			if(totalSizeError>0){
				if(rangeMax){
					rangeMax = Math.min(rangeMax,currentSize);
				}else{
					rangeMax = currentSize;
				}
			}else{
				if(rangeMin){
					rangeMin = Math.max(rangeMin,currentSize);
				}else{
					rangeMin = currentSize;
				}
			}
			// decided next parameter to use
			var previousSize = currentSize;
			if(rangeMin && rangeMax){
				currentSize = rangeMin + (rangeMax-rangeMin)*0.5;
			}else if(totalSizeError>0){ // too big
				currentSize /= 2;
			}else{ // too small
				currentSize *= 2;
			}
			var percent = Math.abs(previousSize-currentSize)/currentSize;
			// console.log("  percent: "+percent+" @ "+currentSize+" ------- - - - "+k);
			if(percent<0.001){
				break;
			}
		}
		point3D.size(currentSize);
	}
}









	// points3D = points3D!==undefined && points3D!==null ? points3D : this.toPointArrayLocated();




	// for(var i=0; i<points3D.length; ++i){

Stereopsis.World.prototype.initPoint3DAffineFromPatch = function(point3D){
	var temp = Stereopsis.World._TEMP_PATCH_VS;
	var center2D = temp[0];
	var up2D = temp[1];
	var dn2D = temp[2];
	var lf2D = temp[3];
	var ri2D = temp[4];
	var temp3D = temp[5];
	// 
	var p3D = point3D.point();
	if(!p3D){
		throw "no point";
	}
	var size = point3D.size();
	var normal = point3D.normal();
	var up = point3D.up(up);
	var points2D = point3D.toPointArray();
	// 
	var distances = [];
	var pts = [];
	var sizes = [];
	for(var j=0; j<points2D.length; ++j){
		var point2D = points2D[j];
		var pnt2D = point2D.point2D();
		var view = point2D.view();
		var viewNormal = view.normal();
		var targetPatchRadius = view.compareSizeForPoint(pnt2D) * 0.5;
		view.projectPoint3D(center2D, p3D);
		var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
		var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
		var up3D = V3D.add(p3D,parallelUp);
		var dn3D = V3D.sub(p3D,parallelUp);
		var lf3D = V3D.sub(p3D,parallelRi);
		var ri3D = V3D.add(p3D,parallelRi);
		view.projectPoint3D(up2D, up3D);
		view.projectPoint3D(dn2D, dn3D);
		view.projectPoint3D(lf2D, lf3D);
		view.projectPoint3D(ri2D, ri3D);
			up2D.sub(center2D);
			dn2D.sub(center2D);
			lf2D.sub(center2D);
			ri2D.sub(center2D);
		var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
		if(avg==0){
			console.log(point3D);
			throw "zero point";
		}
		var s = targetPatchRadius/avg; // scale from projected size to patch size for full patch size
		sizes.push(s);
		pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
		// 3D distance
		V3D.sub(temp3D, view.center(),p3D);
		var distance = temp3D.length();
		distances.push(distance);
	}

	for(var j=0; j<points2D.length; ++j){
		var point2DA = points2D[j];
		var distA = distances[j];
		var ptsA = pts[j];
		var viewA = point2DA.view();
		for(var k=j+1; k<points2D.length; ++k){
			var point2DB = points2D[k];
			var distB = distances[k];
			var ptsB = pts[k];
			var viewB = point2DB.view();
			var match = point3D.matchForViews(viewA,viewB);

			// affine directly: more accurate for actual projections
			if(true){
				try{
					var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
					match.affineForViews(viewA,viewB, affine);
				}catch(e){
					console.log("affineCornerMatrixLinear - convergence error?");
					console.log(ptsA,ptsB);
					throw e;
					// match.affineForViews(viewB,viewA, affine);
				}
			// affine from summary stats:
			}else{
				var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
				var angles = [];
				for(var p=0; p<ptsA.length; ++p){
					var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
					angles.push(angle);
				}
				var angle = Code.averageAngles(angles);
				var match = point3D.matchForViews(viewA,viewB);
				var affine = new Matrix2D();
					affine.identity();
					affine.scale(scale);
					affine.rotate(angle);
				match.affineForViews(viewA,viewB, affine); // A to B
			}
		}
	}
}

Stereopsis.World.prototype.updatePoint3DPatchNormalFromImages = function(point3D){


	var points2D = point3D.toPointArray();



var doDisplay = false;
// var doDisplay = true;
if(doDisplay){


	var point2DA = points2D[0];
	var point2DB = points2D[1];
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var imageA = viewA.image();
	var imageB = viewB.image();

	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();

	var match = point3D.matchForViews(viewA,viewB);
	var affineAB = match.affineForViews(viewA,viewB);




	var needleSize = 21;
	var haystackSize = needleSize*2+1;
	// extract the view images & compare

	// display A

	var needle = new ImageMat(needleSize,needleSize);
	var haystack = new ImageMat(haystackSize,haystackSize);

	var HASCOUNT = 0;
	var OFFX = 0;


	// ORIGINAL POINTS AS IS
	// var scale = 0.5;
	var scale = 1.0;
	//var sizeCompare = 61;

	var sizeCompare = viewA.cellSize();
	var imgA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, null);
	var sizeCompare = viewB.cellSize();
	var imgB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);

	var sca = 4.0;

	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + 0, 10 + 0);
	// d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 300);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + 0, 10 + 250);
	// d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 400);
	GLOBALSTAGE.addChild(d);




	var scale = 2.0;
	var sizeCompare = 41;

	var imgA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, affineAB);
	var imgB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);

	var sca = 4.0;

	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + 0, 10 + 600);
	// d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 300);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + 0, 10 + 900);
	// d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 400);
	GLOBALSTAGE.addChild(d);
}

	/// 
	var location3D = point3D.point();
	var size3D = point3D.size();
	var normal3D = point3D.normal();
	var up3D = point3D.up();
	var points2D = point3D.toPointArray();
	// .
	var imageScales = [];
	var extrinsics = [];
	var Ks = [];
	var pts2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var pt2D = point2D.point2D();
		var view = point2D.view();
		var ext = view.absoluteTransform();
		var K = view.K();
		var imageScale = view.imageScales();
		if(!imageScale){
			continue;
		}
		imageScales.push(imageScale);
		extrinsics.push(ext);
		pts2D.push(pt2D);
		Ks.push(K);
	}
	if(imageScales.length<2){
		// console.log("cant optimize patch using images");
		return;
	}
	
	// console.log(location3D,size3D,normal3D,up3D, pts2D,imageScales, extrinsics,Ks)
	// (point3D,size3D,normal3D,up3D, points2D,imageScales,extrinsics,Ks, compareSize,  startAngle)
	var result = R3D.optimizePatchNormalImages(location3D,size3D,normal3D,up3D, pts2D,imageScales, extrinsics,Ks);
	// console.log(result);
	var newNormal = result["normal"];
	var newUp = result["up"];

	var normal3D = point3D.normal(newNormal);
	var up3D = point3D.up(newUp);
}
Stereopsis.World.prototype.isValidPoint3DAndPatch3D = function(point3D){//, log){
	var p3D = point3D.point();
	var points2D = point3D.toPointArray();
	var hasPatch = point3D.hasPatch();
	for(var j=0; j<points2D.length; ++j){
		var point2D = points2D[j];
		// POINTS BEHIND CAMERA
		var view = point2D.view();
		if(hasPatch){
			var viewNormal = view.normal();
			var viewCenter = view.center();
			var viewToPoint = V3D.sub(p3D,viewCenter);
			var dot = V3D.dot(viewToPoint,viewNormal);
			if(dot<0){
				// console.log("behind ?");
				// if(log){
				// 	console.log("is behind");
				// }
				return false;
			}
		}
		// POINTS INSIDE IMAGES
		var pnt2D = point2D.point2D();
		var size = view.size();
		if(pnt2D.x<0 || pnt2D.x>=size.x || pnt2D.y<0 || pnt2D.y>=size.y){
			// if(log){
			// 	console.log("is outside image");
			// }
			// console.log("outside ?");
			return false;
		}
	}

	return true;

	// 
	// other oddities?
}

Stereopsis.World.prototype.point3DFromData = function(data){ 
	var world = this;
	var X = data["X"];
	var Y = data["Y"];
	var Z = data["Z"];
	var x = data["x"];
	var y = data["y"];
	var z = data["z"];
	var s = data["s"];
	var v = data["v"];
	var pViews = [];
	var pP2Ds = [];
	for(var i=0; i<v.length; ++i){
		var vi = v[i];
		var viewID = vi["i"];
		var viewX = vi["x"];
		var viewY = vi["y"];
		var view = world.viewFromData(viewID);
		pP2Ds.push(new V2D(viewX,viewY));
		pViews.push(view);
	}
	var normalized = true;
	var affines = null;
	var point3D = world.newPoint3DFromPieces(pViews,pP2Ds,affines, normalized);
	if(X!==undefined && Y!==undefined && Z!==undefined){
		point3D.point( new V3D(X,Y,Z) );
	}
	if(x!==undefined && y!==undefined && z!==undefined && s!==undefined){
		var normal = new V3D(x,y,z);
		point3D.normal(normal);
		point3D.size(s);
		var ups = [];
		for(var i=0; i<pViews.length; ++i){
			var view = pViews[i];
			var u = view.up();
			if(ups.length>0){
				var dot = V3D.dot(ups[0],u);
				if(dot<0){
					u = u.copy().scale(-1);
				}
			}
			ups.push(u);
		}
		// console.log(ups);
		var averageUp = Code.averageAngleVector3D(ups);
		// console.log(averageUp+"");
		var right = V3D.cross(normal,averageUp).norm();
		var up = V3D.cross(right,normal).norm();
		// console.log("=> "+up);
		point3D.up(up);
	}

	return point3D;
}

Stereopsis.World.prototype.solveSequentialView = function(viewFocus, viewsAdjacent, existingPoints, onCompleteFxn){ // optimum single view to all other views
GLOBALSTAGE.root().matrix().scale(0.5);
	var world = this;
// ORIGINAL POINTS SHOULD HAVE ALREADY BEEN ADDED TO WORLD ?

throw "try again"
	console.log("solveSequentialView");
	console.log(viewFocus,viewsAdjacent);
	console.log(existingPoints);
	if(!existingPoints){
		existingPoints = [];
	}
var context = {};
world._contetSequential = context;
context["viewFocus"] = viewFocus;
context["viewsAdjacent"] = viewsAdjacent;
context["existingPoints"] = existingPoints;
context["onCompleteFxn"] = onCompleteFxn;

	// turn existing points into points
	if(existingPoints.length>0){

		for(var i=0; i<existingPoints.length; ++i){
			var existingPoint = existingPoints[i];
			var point3D = world.point3DFromData(existingPoint);
			world.initPoint3DAffineFromPatch(point3D);
			existingPoints[i] = point3D;
		}
	}
	console.log("turned existing points into actual points &")
	// all adjacent views need parallel quadtrees for point lookup
	var viewsAdjacentLookup = {};
	for(var i=0; i<viewsAdjacent.length; ++i){
		var view = viewsAdjacent[i];
		var viewID = view.id();
		viewsAdjacentLookup[viewID] = view;
	}

	var parallelViewPoint2DSpaces = {};
	for(var i=0; i<viewsAdjacent.length; ++i){
		var view = viewsAdjacent[i];
		var viewID = view.id();
		var image = view.image();
		var min = new V2D(0,0);
		var max = new V2D(image.width(),image.height());
		var pointSpace = new QuadTree(Stereopsis._point2DToPoint, min, max);
		parallelViewPoint2DSpaces[viewID] = pointSpace;
	}
	for(var i=0; i<existingPoints.length; ++i){
		var point3D = existingPoints[i];
		var views = point3D.toViewArray();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var viewID = view.id();
			var exists = viewsAdjacentLookup[viewID];
			if(exists){
				var pointSpace = parallelViewPoint2DSpaces[viewID];
				var point2D = point3D.pointForView(view);
				pointSpace.insertObject(point2D);
			}
		}
	}
	console.log("parallelViewPoint2DSpaces");
	console.log(parallelViewPoint2DSpaces);
context["parallelViewPoint2DSpaces"] = parallelViewPoint2DSpaces;
	
	// defaults
	var viewCellCountLow = 40; // 1600
	var viewCellCountMedium = 60; // 3600
	var viewCellCountHigh = 80; // 6400
	var viewCellCountDense = 120; // 14400
	// prep pairwise
	world.copyRelativeTransformsFromAbsolute();
	world.setViewCellCounts(viewCellCountMedium);
	// PAIRWISE PUTATIVE POINTS ---------------------------------------------------------------------------------------------
	console.log("phase 1 - acquire putative pairs & refine into medium dense high confidence set");
	var originalViewFocusExtrinsic = viewFocus.absoluteTransform();
	// console.log(putatives);
context["originalViewFocusExtrinsic"] = originalViewFocusExtrinsic;

	world.putativePairsForViews(viewFocus,viewsAdjacent,   world._solveSequentialView2, world);



}
Stereopsis.World.prototype._solveSequentialView2 = function(inputArgs){
	var putatives = inputArgs[0];
	console.log("_solveSequentialView2");
	console.log(putatives);
var world = this;

var minimumPointPairCount = 24;
var viewCellCountLow = 40; // 1600
var viewCellCountMedium = 60; // 3600
var viewCellCountHigh = 80; // 6400
var viewCellCountDense = 120; // 14400

// get back context
var context = world._contetSequential;
var viewFocus = context["viewFocus"];
var viewsAdjacent = context["viewsAdjacent"];
var existingPoints = context["existingPoints"];
var onCompleteFxn = context["onCompleteFxn"];
var originalViewFocusExtrinsic = context["originalViewFocusExtrinsic"];
var views = world.toViewArray();

	console.log("solveSequentialView 2");
	console.log(viewFocus,viewsAdjacent);
	console.log(existingPoints);

var parallelViewPoint2DSpaces = context["parallelViewPoint2DSpaces"];








	// PAIRWISE POINT ACCURACY & DENSITY ---------------------------------------------------------------------------------------------
	// itertate on putatives to good medium dense pairwise matches

	var initialAdjacentPoints3D = [];

	for(var i=0; i<viewsAdjacent.length; ++i){
		console.log("ADJ VIEW: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+i+" / "+viewsAdjacent.length);

		viewFocus.absoluteTransform(originalViewFocusExtrinsic);
		world.copyRelativeTransformsFromAbsolute();

		var viewA = viewFocus;
		var viewB = viewsAdjacent[i];
		var transformAB = world.transformFromViews(viewA,viewB);
		var pairPointPutatives = putatives[i];

		console.log("pairPointPutatives B");
		console.log(pairPointPutatives);

		if(pairPointPutatives.length<minimumPointPairCount){
			console.log("not enough putative points to do much: ["+i+"] @ "+viewA.data()+" - "+viewB.data());
			// proceeed to next piece
		}else{

			// give the points patches:
			for(var j=0; j<pairPointPutatives.length; ++j){
				var point3D = pairPointPutatives[j];
				world.initNewPointPatch3D(point3D);
				var isValid = world.isValidPoint3DAndPatch3D(point3D);
				if(isValid){
					if(!point3D.hasPatch()){
						console.log(point3D);
						throw "INIT NEW PATCH DID NOT WORK";
					}
					world.recursiveEmbedPoint3D(point3D);
				}else{
					world.disconnectPoint3D(point3D);
					world.killPoint3D(point3D);
				}
			}
	console.log("0");
	world.checkVerifyPatches();
			// TODO: control how embedding works
			//	- cell sizing
			// 	- on/off collision checking
			


			var maxIterations = 4;
			for(var iteration=0; iteration<maxIterations; ++iteration){
	console.log("PHASE 1 ITERATION: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+iteration+" / "+maxIterations);
	console.log("A");
	world.checkVerifyPatches();

				

				// set F for error filtering
				world.relativeFFromSamples(transformAB); // TODO: decouple calcuation & error | use local affine to validate ?

	// throw "after relativeFFromSamples"
				// get current error
				// world.estimatePairwiseErrors(transformAB); // estimate3DErrors

				world.estimateGlobalErrors();


	//throw "after estimateGlobalErrors"
	console.log("C");
	world.checkVerifyPatches();

				// expand
					// compareSize = ?;
					var sigmaMaximumSelect = 2.0;
					var sigmaMaximumKeep = 1.0;
					// world.probe2DCellsR(sigmaMaximumSelect, sigmaMaximumKeep);
					world.probe2DCellsExpandR(sigmaMaximumSelect, sigmaMaximumKeep);
					

				// throw "after expand"
	console.log("D");
	world.checkVerifyPatches();

				// filter
					world.filterPairwiseErrors(2.0);
					world.filterGlobalErrors(2.0);
					world.filterNeighborConsistency2D3D();
					world.filterNeighborConsistency2DViews();
					world.filterGlobalNegativeDepth();
					world.filterGlobalPatchVisibilityConsistency();
					world.filterLocalError2D();
					world.filterLocalError3D();
					// throw "after filter"
	console.log("E");
	world.checkVerifyPatches();

				// refine - camera position
				var iterationsUpdateViewSingle = 50;
				world.refineSelectCameraMultiViewTriangulation(viewFocus, iterationsUpdateViewSingle);

				world.copyRelativeTransformsFromAbsolute();

				world.reInitPoint3DLocationPatches();
	console.log("F");
	world.checkVerifyPatches();
				if(iteration==1){
					console.log("SUBDIVIDING");
	break;
					// subdivide
					var subdivisionMultiplier = 0.5;
					world.subdivideViewGridsR(subdivisionMultiplier);
					world.subDivideUpdateMatchLocation();
					// world.reInitPoint3DLocationPatches(); // done as part of subDivideUpdateMatchLocation
				}
	console.log("G");
	world.checkVerifyPatches();
			}
		} // end if few/no points

		console.log("TODO: restore original viewA extrinsic/absolute")

// var str = world.toYAMLString();
// console.log(str);

		// remove points from world
		points3D = world.toPointArray();
console.log("POINTS FOR: "+i+" = "+points3D.length);
		initialAdjacentPoints3D.push(points3D);

		for(var p=0; p<points3D.length; ++p){
			var point3D = points3D[p];
			world.disconnectPoint3D(point3D);
		}
	}
console.log("initialAdjacentPoints3D");
console.log(initialAdjacentPoints3D);
console.log("viewsAdjacent");
console.log(viewsAdjacent);

	console.log("phase 2 - move new view to existing model location");

// throw "..."
	// if this is not the 'first' view pair, then there should be some existing overlap?
	// existingPoints

	var initialAbsoluteMatrixValues = [];
	var initialAbsoluteMatrixErrors = [];


	var allViews = world.toViewArray();
	
	if(allViews.length>2){
		console.log("averaging start: "+allViews.length);
		
		// LINEAR INITIALIZATION STEP
		var maxPointLinearCount = 100;
		// NONLINEAR ADJUSTMENT STEP
		var maxPointNonLinearCount = 500;
		

		world.setViewCellCounts(viewCellCountHigh);
		
		for(var i=0; i<viewsAdjacent.length; ++i){
			var viewAdjacent = viewsAdjacent[i];
			var viewID = viewAdjacent.id();
			// var imageScales = view.imageScales();
			var newPoints3D = initialAdjacentPoints3D[i];
			// if(newPoints3D.length)
			// TODO: use some smaller maximum newPoints3D size
			var oldPointSpace = parallelViewPoint2DSpaces[viewID];
			if(oldPointSpace.count()==0){
				continue;
			}

			
			console.log(i);
			console.log(initialAdjacentPoints3D);
			console.log(oldPointSpace);
			console.log(viewsAdjacent);
			console.log(newPoints3D);

			var info = world.getApproximate3DLocationFrom2DLocationMapping(newPoints3D, oldPointSpace, viewAdjacent);
			console.log(info);
			var knownPoints2D = info["2D"];
			var knownPoints3D = info["3D"];
			var knownViewIDs = info["views"];


			if(knownPoints3D.length<6){ // what is the min?
				console.log("unknown");
				continue;
			}
console.log("CALCULATORIUM ................... "+knownPoints2D.length);
			console.log(knownPoints2D);
			console.log(knownPoints3D);
			if(knownPoints2D.length<6){
				throw "not enough points"
			}

			// var known2DLinear = knownPoints2D;
			// var known3DLinear = knownPoints3D;
			var knownViewsNonLinear = knownViewIDs;
			var known2DNonlinear = knownPoints2D;
			var known3DNonlinear = knownPoints3D;

			// if(known2DLinear.length>maxPointLinearCount){
			// 	known2DLinear = Code.copyArray(known2DLinear);
			// 	known3DLinear = Code.copyArray(known3DLinear);
			// 	Code.randomPopParallelArrays([known2DLinear,known3DLinear],maxPointLinearCount);
			// }
			
			if(known2DNonlinear.length>maxPointNonLinearCount){
				knownViewsNonLinear = Code.copyArray(knownViewsNonLinear);
				known3DNonlinear = Code.copyArray(known3DNonlinear);
				known3DNonlinear = Code.copyArray(known3DNonlinear);
				Code.randomPopParallelArrays([knownViewsNonLinear,known2DNonlinear,known3DNonlinear],maxPointNonLinearCount);
			}

			// var K = viewFocus.K();
			// var Kinv = viewFocus.Kinv();
			// var P = viewFocus.absoluteTransform(); // est
/*			
console.log("R3D.optimizeCameraExtrinsicDLTKnown3DK");
// THIS ONE IS HORRRRIBLE
			var info = R3D.optimizeCameraExtrinsicDLTKnown3DK(K, Kinv, known2DLinear, known3DLinear);
			console.log(info);
			var error = info["error"];
			var extrinsic = info["matrix"];
*/
			// nonlinear step :
console.log("R3D.optimizeCameraExtrinsicNonlinearKnown3D");

			var extrinsic = originalViewFocusExtrinsic;

			// var maxIterations = 100;
			// var info = R3D.optimizeCameraExtrinsicNonlinearKnown3D(extrinsic, K, Kinv, known2DNonlinear, known3DNonlinear, maxIterations);
			// console.log(info);
			// var newP = info["matrix"];
			// var newError = info["error"];




			// transform
			console.log(viewFocus, viewsAdjacent, knownViewsNonLinear,known2DNonlinear,known3DNonlinear);
			var info = world.mapCurrentViewsToOptimizationLocationGeometry(viewFocus, viewsAdjacent, knownViewsNonLinear,known2DNonlinear,known3DNonlinear);
			console.log(info);
			var listP = info["listP"];
			var listK = info["listK"];
			var listKinv = info["listKinv"];
			var listUpdate = info["listUpdate"];
			var listPoints3DInfo = info["listP2D"];
			var points3DStatic = info["listP3D"];

			var maxIterations = 100;
			console.log(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
			var info = R3D.optimizeCameraExtrinsicByGeometryMatching3D(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
			console.log(info);
			var newExtrinsics = info["matrixes"];
			var newError = info["error"];
			var newP = newExtrinsics[0];
			console.log(newP);
			// throw "here";
			initialAbsoluteMatrixValues.push(newP);
			// error is average reprojection error of 
			initialAbsoluteMatrixErrors.push(newError);
		}
	} // first time check


	if(initialAbsoluteMatrixValues.length>0){
			console.log(initialAbsoluteMatrixValues);
			console.log(initialAbsoluteMatrixErrors);
			console.log("average N separate 3D matrixes to get initial value");

			var averageExtrinsic = Stereopsis.averageMatrixEstimates(initialAbsoluteMatrixValues,initialAbsoluteMatrixErrors);
			viewFocus.absoluteTransform(averageExtrinsic);

console.log("averageExtrinsic:\n"+averageExtrinsic);

// viewFocus.absoluteTransform(originalViewFocusExtrinsic);
world.copyRelativeTransformsFromAbsolute();


			// nonlinear -> optimize tracks & move camera
			world.setViewCellCounts(viewCellCountHigh);

			for(var i=0; i<initialAdjacentPoints3D.length; ++i){
				var points3D = initialAdjacentPoints3D[i];
				world.recursiveEmbedPoints3D(points3D);
			}

			world.reInitPoint3DLocationPatches();

			
			// throw "nonlinear optimize view location using mapped geometry"
			var transforms = world.toTransformArray();

			var countPointsNonlinearLocationMapping = 500;
			var maxPhaseTwoIterations = 4;
			// var maxIterations = 2;
			for(var iteration=0; iteration<maxPhaseTwoIterations; ++iteration){
				console.log("PHASE 2 ITERATION: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+iteration);

console.log(world.toYAMLString());

				for(var i=0; i<transforms.length; ++i){
					var transform = transforms[i];
					world.relativeFFromSamples(transform);
				}
				world.estimateGlobalErrors();


				// filter lightly
				world.filterPairwiseErrors(3.0);
				world.filterGlobalErrors(3.0);

// get a bunch of points that have at least one adjacent view
// only need to do up to 


				var points3D = world.toPointArray();
				var includedPoints3D = [];
				var includedPoints2D = [];
				var includedViews = [];
				var maximumAppendIterations = countPointsNonlinearLocationMapping*5;
				for(var i=0; i<maximumAppendIterations; ++i){
					var point3D = Code.randomPop(points3D);
					var points2D = point3D.toPointArray();
					var viewAdjacent = null;
					var viewID = null;
					var oldPointSpace = null;
					for(var p=0; p<points2D.length; ++p){
						var point2D = points2D[p];
						viewAdjacent = point2D.view();
						viewID = viewAdjacent.id(); //
						oldPointSpace = parallelViewPoint2DSpaces[viewID];
						if(oldPointSpace){
							break;
						}
					}
					if(!oldPointSpace){
						continue;
					}

					var show = true;
					var info = world.getApproximate3DLocationFrom2DLocationMapping([point3D], oldPointSpace, viewAdjacent, includedViews, includedPoints2D,includedPoints3D, show);
					if(includedPoints3D.length>=countPointsNonlinearLocationMapping){
						break;
					}
				}
				console.log(includedPoints3D);
				console.log(includedPoints2D);
				console.log(includedViews);
				
				// throw "here 2";
				/*
				var maxNonlinearIterations = 100;
				var extrinsic = viewFocus.absoluteTransform();
				var K = viewFocus.K();
				var Kinv = viewFocus.Kinv();
				var info = R3D.optimizeCameraExtrinsicNonlinearKnown3D(extrinsic, K, Kinv, includedPoints2D, includedPoints3D, maxNonlinearIterations);
				console.log(info);
				var newExtrinsic = info["matrix"];
				viewFocus.absoluteTransform(newExtrinsic);
				*/


			console.log(viewFocus, viewsAdjacent, includedViews,includedPoints2D,includedPoints3D);
			var info = world.mapCurrentViewsToOptimizationLocationGeometry(viewFocus, viewsAdjacent, includedViews,includedPoints2D,includedPoints3D);
			console.log(info);
			var listP = info["listP"];
			var listK = info["listK"];
			var listKinv = info["listKinv"];
			var listUpdate = info["listUpdate"];
			var listPoints3DInfo = info["listP2D"];
			var points3DStatic = info["listP3D"];

			var maxIterations = 100;
			console.log(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
			var info = R3D.optimizeCameraExtrinsicByGeometryMatching3D(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
			console.log(info);
			var newExtrinsics = info["matrixes"];
			var newError = info["error"];
			var newP = newExtrinsics[0];
			console.log(newP);
			viewFocus.absoluteTransform(newP);
			// throw "here";

				world.copyRelativeTransformsFromAbsolute();
				world.reInitPoint3DLocationPatches();


				// throw "set points to existing geometry"
			}



			world.copyRelativeTransformsFromAbsolute();
			world.reInitPoint3DLocationPatches();
			console.log(world.toYAMLString());


	}else{ // end initial averaging & nonlinear optimizing
		console.log("use original extrinsic matrix")
		throw "re-check this"
		console.log(originalViewFocusExtrinsic);
		viewFocus.absoluteTransform(originalViewFocusExtrinsic);

		// 'combined' points is just first set:
		for(var i=0; i<viewsAdjacent.length; ++i){
			var viewAdjacent = viewsAdjacent[i];
			var listPoints3D = initialAdjacentPoints3D[i];
			for(var j=0; j<listPoints3D.length; ++j){
				var point3D = listPoints3D[j];
				world.initNewPointPatch3D(point3D);
				var isValid = world.isValidPoint3DAndPatch3D(point3D);
				if(isValid){
					world.recursiveEmbedPoint3D(point3D);
				}else{
					world.disconnectPoint3D(point3D);
					world.killPoint3D(point3D);
				}
			}
		}

	}


	

	// throw "phase 3 - combine OLD + NEW points & optimize nonlinearly"

	console.log("COMBINE NEW AND EXISTING POINTS:");

	world.setViewCellCounts(viewCellCountDense);

	world.recursiveEmbedPoints3D(existingPoints);
	world.reInitPoint3DLocationPatches();
	
	// var maxIterations = 4;
	var maxIterations = 2;
	for(var iteration=0; iteration<maxIterations; ++iteration){
console.log("PHASE 3 ITERATION: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+iteration);
		// set F for error filtering
		world.relativeFFromSamples(transformAB); // TODO: decouple calcuation & error | use local affine to validate ?
		world.estimateGlobalErrors();

		// expand
		var sigmaMaximumSelect = 2.0;
		var sigmaMaximumKeep = 1.0;
		world.probe2DCellsExpandR(sigmaMaximumSelect, sigmaMaximumKeep);
		world.probe3DTrackExpandR(sigmaMaximumSelect, sigmaMaximumKeep);

		// filter
		world.filterPairwiseErrors(2.0);
		world.filterGlobalErrors(2.0);
		world.filterNeighborConsistency2D3D();
		world.filterNeighborConsistency2DViews();
		world.filterGlobalNegativeDepth();
		world.filterGlobalPatchVisibilityConsistency();
		world.filterLocalError2D();
		world.filterLocalError3D();
		
		// refine - camera position
		var iterationsUpdateViewSingle = 100;
		world.refineSelectCameraMultiViewTriangulation(viewFocus, iterationsUpdateViewSingle);
		world.copyRelativeTransformsFromAbsolute();
		world.reInitPoint3DLocationPatches();


		// TODO:
		// ANOTHER GOAL HERE SHOULD BE LINING UP GEOMETRY

		// TODO: not checked/validated:
		world.refineSelectCameraByLocalGeometryMatching3D(viewFocus, iterationsUpdateViewSingle);
		world.copyRelativeTransformsFromAbsolute();
		world.reInitPoint3DLocationPatches();
		

		// optimizeCameraExtrinsicByGeometryMatching3D
		// R3D.optimizeAllCameraExtrinsicSurfaceDistances3D
		//world.copyRelativeTransformsFromAbsolute();


		


		// no subdivision, BUT MAYBE SOME POINT LOCATION OPTIMIZING ?
		// 
// 			if(iteration==1){
// 				console.log("SUBDIVIDING");
// break;
// 				// subdivide
// 				var subdivisionMultiplier = 0.5;
// 				world.subdivideViewGridsR(subdivisionMultiplier);
// 				world.subDivideUpdateMatchLocation();
// 				// world.reInitPoint3DLocationPatches(); // done as part of subDivideUpdateMatchLocation
// 			}
		// 
	}

	world.estimateGlobalErrors();

	console.log(world.toYAMLString());

	// throw "end solveSequentialView";
console.log("end solveSequentialView");
	if(onCompleteFxn){
		onCompleteFxn();
	}
}

Stereopsis.World.prototype.checkVerifyPatches = function(){
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.hasPatch()){
			console.log(points3D);
			console.log(i);
			console.log(point3D);
			throw "missing patch";
		}
	}
}


Stereopsis.World.prototype.reInitPoint3DLocationPatches = function(){
// SAME AS : initNewPointPatch3D - llooop
	var world = this;
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// var location3D = point3D.globalPoint3DLinear(); ////////////////////////
		// world.updatePoint3DLocation(point3D,location3D); /////////////
		world.initNewPointPatch3D(point3D);
	}
}



Stereopsis.World.prototype.initNewPointPatch3D = function(point3D,doInsert){ // totally new, calculate all from scratch
	doInsert = Code.valueOrDefault(doInsert, true);
	var world = this;
	var location3D = point3D.globalPoint3DLinear();
	if(doInsert){
		world.updatePoint3DLocation(point3D,location3D);
	}else{
		point3D.point(location3D);
	}
	var errorR = point3D.globalPoint3DReprojectionError();
	point3D.globalErrorR(errorR);
		// world.updatePoint3DLocation(point3D,location3D);
	world.initPoint3DPatchSphere(point3D);
	world.initPoint3DAffineFromPatch(point3D);
	world.updatePoint3DPatchNormalFromImages(point3D);
	world.initPoint3DAffineFromPatch(point3D);
}


Stereopsis.World.prototype.mapCurrentViewsToOptimizationLocationGeometry = function(viewFocus, viewsAdjacent, knownViewIDs,knownPoints2D,knownPoints3D){
	var mappingViewIDToIndex = {};
	var currentViews = [viewFocus];
	var listUpdate = [true];
	for(var v=0; v<viewsAdjacent.length; ++v){
		listUpdate.push(false);
		currentViews.push(viewsAdjacent[v]);
	}
	var listP = [];
	var listK = [];
	var listKinv = [];
	for(var v=0; v<currentViews.length; ++v){
		var view = currentViews[v];
		var viewID = view.id();
		mappingViewIDToIndex[viewID] = v;
		listP[v] = view.absoluteTransform().copy();
		listK[v] = view.K().copy();
		listKinv[v] = view.Kinv().copy();
	}
	var listPoints3DInfo = [];
	var points3DStatic = [];
	for(var p=0; p<knownPoints2D.length; ++p){
		var points2D = knownPoints2D[p];
		var point3D = knownPoints3D[p];
		var viewIDs = knownViewIDs[p];
		for(var v=0; v<viewIDs.length; ++v){
			var viewID = viewIDs[v];
			var index = mappingViewIDToIndex[viewID];
			if(index===undefined){
				console.log(mappingViewIDToIndex);
				console.log(viewID);
				console.log(index);
				throw "view not in list"
			}
			viewIDs[v] = index;
		}
		listPoints3DInfo.push([viewIDs,points2D]);
		points3DStatic.push(point3D);
	}
	return {"listUpdate":listUpdate,"listP":listP,"listK":listK,"listKinv":listKinv,"listP2D":listPoints3DInfo,"listP3D":points3DStatic};
}
			


Stereopsis.World.prototype.getApproximate3DLocationFrom2DLocationMapping = function(newPoints3D, oldPointSpace, viewAdjacent, knownViewsReuse, knownPoints2DReuse,knownPoints3DReuse, show){
	// var percentNew = 1.0;
	// var percentOld = 1.0 - percentNew;

	// 3-6 ?
	// 2-4 ?
	// LOW:
	// var minNeighborCount = 2;
	// var maxNeighborCount = 4;

	// MED
	// var minNeighborCount = 3; // 3-6 ?
	// var maxNeighborCount = 6;

	// HIGH
	var minNeighborCount = 5;
	var maxNeighborCount = 15;

	// var searchScale = 2.0; // 1-2
	// var searchScale = 1.5;
	var searchScale = 1.0;

	var listViewGroups = knownViewsReuse!==undefined ? knownViewsReuse : [];
	var listPoint2DGroups = knownPoints2DReuse!==undefined ? knownPoints2DReuse : [];
	var listPoint3DStatic = knownPoints3DReuse!==undefined ? knownPoints3DReuse : [];


	var sortDistanceFxn = function(a,b){
		return a[1]<b[1] ? -1 : 1;
	}

	for(var n=0; n<newPoints3D.length; ++n){
		var point3D = newPoints3D[n];
		var point2D = point3D.pointForView(viewAdjacent);
		if(!point2D){
			// console.log(point3D);
			// console.log(viewAdjacent);
			// console.log(point2D);
			// throw "point should exist";
			console.log("point does not exist for adjacent view")
			continue; //maybe there weren't any matches early on
		}
		var p2D = point2D.point2D();
		var size2D = viewAdjacent.compareSizeForPoint(p2D);
		var searchRadius = size2D*searchScale;
		var neighbors = oldPointSpace.objectsInsideCircle(p2D, searchRadius);
		// console.log("neighbors: "+neighbors.length);
		if(neighbors.length<minNeighborCount){
			continue;
		}
		// console.log(neighbors);
		for(var k=0; k<neighbors.length; ++k){
			var neighbor = neighbors[k];
			var d = V2D.distanceSquare(p2D, neighbor.point2D());
				// console.log(k+"    distance2D: "+Math.sqrt(d));
			neighbors[k] = [neighbor,d];
		}
		neighbors.sort(sortDistanceFxn);
		Code.truncateArray(neighbors,maxNeighborCount);
		var locations3D = [];
		for(var k=0; k<neighbors.length; ++k){
			var neighbor = neighbors[k][0];
			var p3d = neighbor.point3D().point();
			locations3D.push(p3d);
		}
		// var newP3D = point3D.point();
		var center3D = V3D.average(locations3D);
			// var dist = V3D.distance(center3D,newP3D);
			// console.log("   ---------> center3D: "+center3D+" v "+dist);
		// var p3D = V3D.average([center3D, newP3D], [percentNew,percentOld]);
		
		// knownPoints2D.push(p2D);
		// knownPoints3D.push(p3D);

		var points2D = point3D.toPointArray();
		var list2Ds = [];
		var listViews = [];
		for(var k=0; k<points2D.length; ++k){
			var point2D = points2D[k];
			list2Ds.push(point2D.point2D());
			listViews.push(point2D.view().id());
		}
		listPoint2DGroups.push( list2Ds );
		listViewGroups.push( listViews );
		listPoint3DStatic.push( center3D );

		// if(show){
		// 	var e1 = R3D.reprojectionErrorSingle(center3D, p2D, viewAdjacent.absoluteTransform(), viewAdjacent.K());
		// 	var e2 = R3D.reprojectionErrorSingle(point3D.point(), p2D, viewAdjacent.absoluteTransform(), viewAdjacent.K());
		// 	console.log( "show: "+e1+" | "+e2 );
		// }

	}
	// return {"2D":knownPoints2D, "3D":knownPoints3D};
	return {"2D":listPoint2DGroups, "3D":listPoint3DStatic, "views":listViewGroups};
}


Stereopsis.World.prototype.refineSelectCameraByLocalGeometryMatching3D = function(viewFocus, maxIterations, includedPoints){ 
	console.log("refineSelectCameraByLocalGeometryMatching3D");

	var sortDistances = function(a,b){
		return a[1]<b[1] ? -1 : 1;
	};
	var minimumNeighborhoodCount = 3;
	var maximumNeighborhoodCount = 10;

	var maximumPointSamples = 500;
	var miniumPointSamples = 100;
	var searchScale = 1.5; // 1 - 2


	// if(includedPoints){
		// throw "includedPoints";
	// }else{

		var maximumPointAttempts = maximumPointSamples*5;
		var pointSpaceFocus = viewFocus.pointSpace();
		var points2DFocus = null;
		if(includedPoints){
			points2DFocus = includedPoints;
console.log("GOT INCLUDED POINTS: includedPoints: "+includedPoints.length);
		}else{
			points2DFocus = pointSpaceFocus.toArray();
		}
		// console.log("points2DFocus:");
		// console.log(points2DFocus);
		var points3DStatic = [];
		var listPoints3DInfo = [];
	var dSigs = [];
	var dSigs2 = [];
		for(var i=0; i<maximumPointAttempts; ++i){
			if(points2DFocus.length==0){
				break;
			}
			var point2DFocus = Code.randomPop(points2DFocus);
			var p2DF = point2DFocus.point2D();
			var point3DF = point2DFocus.point3D();
			var p3DF = point3DF.point();
			var featureSize = viewFocus.compareSizeForPoint(p2DF);
			var searchRadius = searchScale*featureSize;
			var neighbors = pointSpaceFocus.objectsInsideCircle(p2DF,searchRadius);
			if(neighbors.length<minimumNeighborhoodCount){
				continue;
			}
			if(neighbors.length>maximumNeighborhoodCount){
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var p2D = neighbor.point2D();
					var d = V2D.distanceSquare(p2D,p2DF);
					neighbors[n] = [neighbor,d];
				}
				neighbors.sort(sortDistances);
				Code.truncateArray(neighbors,maximumNeighborhoodCount);
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					neighbors[n] = neighbor[0];
				}
			}
			// var point3DF = point2DFocus.point3D();
			// var center3DF = point3DF.point();
			var points = [];
			var distances = [];
var entries = [];
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			var point3D = neighbor.point3D();
			var center3D = point3D.point();
			points.push(center3D);

			var d = V3D.distance(p3DF,center3D);
			distances.push(d);
entries.push([d, center3D]);
		}

// TODO: check stddev & throw if discrepancy
var dMin = 0;
var dSig = Code.stdDev(distances,dMin);
// console.log(dSig);
dSigs.push(dSig);


var toValueFxn = function(a){
	// console.log(a[0]);
	return a[0];
};
var toLimitFxn = function(values){
	var std = Code.stdDev(values, 0);
	var lim = std*2.0;
	return lim;
};
var minCount = 3;
var maxIterations = 3;
var updateFxn = function(list){
	//
}
var list = Code.repeatedDropOutliers(entries, toValueFxn, toLimitFxn, minCount, maxIterations, updateFxn);
// console.log(list.length,entries.length);

var list0 = Code.copyArray(list);
var list1 = Code.copyArray(list);
Code.arrayMap(list0, function(item){
	return item[0];
});
Code.arrayMap(list1, function(item){
	return item[1];
});
var dSig2 = Code.stdDev(list0,0);
// console.log(dSig);
dSigs2.push(dSig2);





			// var center3D = V3D.average(points);

			var center3D = V3D.average(list1);
	// console.log("center3D: "+center3D);

			//
			points3DStatic.push(center3D);
			listPoints3DInfo.push(point2DFocus);

			if(points3DStatic.length>=maximumPointSamples){
				break;
			}
		}


	if(points3DStatic.length<miniumPointSamples){
		console.log(points3DStatic);
		console.log("not enough points");
		return;
	}
// dSigs.sort();
// Code.printMatlabArray(dSigs,"distances");
// dSigs2.sort();
// Code.printMatlabArray(dSigs2,"distances2");
// throw "before point static do thing"


	// transform data into dneded
	console.log(points3DStatic);
	var touchedViews = {};
	for(var i=0; i<listPoints3DInfo.length; ++i){
		var point2D = listPoints3DInfo[i];
		var point3D = point2D.point3D();
		var points2D = point3D.toPointArray();
		var views2D = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var view = point2D.view();
			var viewID = view.id();
			touchedViews[viewID] = view;
			views2D[j] = view;
			points2D[j] = point2D.point2D();
		}
		listPoints3DInfo[i] = [ views2D, points2D ];
	}
	console.log(listPoints3DInfo);

	var listViews = Code.objectToArray(touchedViews);
	console.log(listViews);
	var listP = [];
	var listK = [];
	var listKinv = [];
	var listUpdate = [];
	for(var i=0; i<listViews.length; ++i){
		var view = listViews[i];
		listP.push(view.absoluteTransform());
		listK.push(view.K());
		listKinv.push(view.Kinv());
		var viewID = view.id();
		touchedViews[viewID] = i;
		if(view==viewFocus){
			listUpdate.push(true);
		}else{
			listUpdate.push(false);
		}
	}
	// points again
	for(var i=0; i<listPoints3DInfo.length; ++i){
		var info = listPoints3DInfo[i];
		var views = info[0];
		for(var v=0; v<views.length; ++v){
			var view = views[v];
			var viewID = view.id();
			var viewIndex = touchedViews[viewID];
			views[v] = viewIndex;
		}
	}
	
	
	console.log("before refineSelectCameraByLocalGeometryMatching3D");
	console.log(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
	var info = R3D.optimizeCameraExtrinsicByGeometryMatching3D(listP, listK, listKinv, listUpdate, listPoints3DInfo, points3DStatic, maxIterations);
	console.log("after refineSelectCameraByLocalGeometryMatching3D");
	console.log(info);
	var newP = info["matrixes"][0];
	viewFocus.absoluteTransform(newP);
	// world.copyRelativeTransformsFromAbsolute();

}

Stereopsis.World.prototype.solveSequentialViewOld = function(viewFocus, viewsAdjacent){ // optimum single view to all other views
	var world = this;
	var views = world.toViewArray();


	throw "old";
	// setup
	world.copyRelativeTransformsFromAbsolute();
	world.setResolutionProcessingModeBest();

	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	view.
	// }

	// set cell sizes
	var divisions = 60;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var size = view.size();
		// console.log(size)
		var cell = size.x/divisions;
		cell = Math.floor(cell);
		// console.log("CELL SIZE: "+cell);
		view.cellSize(cell);
	}

GLOBALSTAGE.root().matrix().scale(0.5);

	// do R-guessing for each view pair - seed points
	// var errorSearchRMaximumPercent = 0.01; // ?
	// var errorSearchRMaximumPercent = 0.005; // ?
	var errorSearchRMaximumPercent = 0.001; // ? too little
	var putativePoints = [];
	for(var i=0; i<viewsAdjacent.length; ++i){
		var viewA = viewFocus;
		var viewB = viewsAdjacent[i];
		var transform = world.transformFromViews(viewA, viewB);
		console.log(transform);
		var R = transform.R();
		if(transform.viewA()==viewB){
			console.log("flip R for view");
			R = Matrix.inverse(R);
		}
console.log("RELATIVE R: \n"+R+"")
		// TO ABS  ?????
		// R = Matrix.inverse(R);

		// ... putativePoints.push();
		var imageScalesA = viewA.imageScales();
		var imageScalesB = viewB.imageScales();
		var Ka = viewA.K();
		var Kb = viewB.K();
		console.log(imageScalesA);
		console.log(imageScalesB);
		console.log(Ka);
		console.log(Kb);
		console.log(R);
		console.log(errorSearchRMaximumPercent);
		var doRelocation = false;
		var result = R3D.searchMatchPointsPair3D(imageScalesA,imageScalesB, R, Ka,Kb, errorSearchRMaximumPercent, doRelocation); // forward
		console.log(result);
		var pointsA = result["A"];
		var pointsB = result["B"];
		var affinesAB = result["affines"];
		
		
		var needleRefineSize = 41; // .... BIG ?
		var haystackRefineSize = needleRefineSize + (needleRefineSize*0.5 | 0) + 2;
		var needleRefine = new ImageMat(needleRefineSize,needleRefineSize);
		var haystackRefine = new ImageMat(haystackRefineSize,haystackRefineSize);
		// var compareSize = imageScalesA.size().length() * 0.02;
		var compareSize = imageScalesA.size().length() * 0.01; // low error
		var doBlur = false;
		// var doBlur = true;
		// var halfCompareSize = compareSize;

		// var distanceMatchLimit = imageScalesA.size().length() * 0.01; // 0.01 - 0.02 // TODO: what if different image sizes ?
		var distanceMatchLimit = imageScalesA.size().length() * 0.001;

		// FURTHER DROP:
		// show matches & closest point:
		// var distances = [];
		for(var j=0; j<pointsA.length; ++j){
			var pointA = pointsA[j];
			var pointB = pointsB[j];
			var affineAB = affinesAB[j];
			var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScalesA,imageScalesB, compareSize, needleRefineSize,haystackRefineSize, affineAB, needleRefine,haystackRefine, doBlur);
			var best = result["point"];
			var dist = V2D.distance(best,pointB);
			// distances.push(dist);
			if(dist>distanceMatchLimit){
				Code.removeElementAt(pointsA,j);
				Code.removeElementAt(pointsB,j);
				Code.removeElementAt(affinesAB,j);
				// set to best point
				pointB.x = best.x;
				pointB.y = best.y;
			}
		}
		// console.log("distances: ");
		// Code.printMatlabArray(distances);

		console.log("FINAL COUNT: "+pointsA.length);


		// DISPLAY
		console.log("DISPLAY INITIAL MATCHES")
		var cellSize = viewFocus.cellSize();
		var showAngles = false;
		// console.log(GLOBALSTAGE);
		// GLOBALSTAGE.root().matrix().scale(0.25);

		var image = imageScalesA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
			d.graphics().alpha(0.2);
			d.matrix().translate(0,0);
			GLOBALSTAGE.addChild(d);
		var image = imageScalesB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
		var d = new DOImage(img);
			d.graphics().alpha(0.2);
			d.matrix().translate(imageScalesA.width(),0);
			GLOBALSTAGE.addChild(d);

		R3D.showForwardBackwardPointsColor(pointsA, pointsB, affinesAB, imageScalesA,imageScalesB, GLOBALSTAGE, cellSize, showAngles);//, matchesAB,parameterUse){



		// var P3D = Stereopsis.World.prototype.newPoint3DFromPieces = function(views,point2DNs,affines, normalized){
		for(var j=0; j<pointsA.length; ++j){
			var pointA = pointsA[j];
			var pointB = pointsB[j];
			var point3D = world.newPoint3DFromPieces([viewA,viewB],[pointA,pointB],null,false);
			// setup individual matches
			world.updatePoints3DNullLocations([point3D]);
			// setup point location
			point3D.calculateAbsoluteLocationDLT(world);
			// setup point patch
			world.patchInitBasicSphere(true,[point3D]);
			putativePoints.push(point3D);
		}


		// throw "do thing";



		// world.relativeFFromSamples(); --- from Rs


	}

	// add new points
	console.log("ADD NEW PUTATIVE P3D: "+putativePoints.length);
	// for(var i=0; i<putativePoints.length; ++i){
	// 	var point3D = putativePoints[i];
	// 	world.insertPoint3D(point3D);
	// }
	world.initAffineFromP3DPatches(putativePoints);
	world.initAllP3DPatches(putativePoints);
	world.embedPoints3D(putativePoints);
	
	// prep
	// world.relativeFFromSamples(); // R ?
	// world.estimate3DErrors(true);
	// world.printPoint3DTrackCount();
	// world.shouldValidateMatchRange(false);
	world.shouldValidateMatchRange(true);

	console.log("STARTING PROGRESS LOOP .........  .........  .........  .........  .........  .........  .........  ......... ");

	// expand/retract looping

	// TEST - MINIMAL
	// var expandCount = 1;
	// var subdivideIndexes = [];

	var expandCount = 5; // 3-5
	var subdivideIndexes = [2];

	// var expandCount = 8;
	// var subdivideIndexes = [2,5];

	// var expandCount = 10;
	// var subdivideIndexes = [2,5,7];


/*
	- a point's patch size can only be so small before it doesn't have enough feature (color range ?)
		- a 3D patch point's size has to account for ideal size for each image


	- initialize all pairwise putative points
		- 3d location
			- linear estimate via geometry
			- nonlinear update via IMAGES ?
		- 3d patch size
		- 3d patch orientation
			- simple geometry estimate
			- nonlinear via images

	- move single camera into updated location
		- nonlinear via ~100 points projecting into 

	- update point patches nonlinearly

	- expand via best 2D point neighbors
	- expand via best 3D point projecting

	- filtering
		- global 3D reprojection error
		- pairwise N / S error




*/

throw "????????????????";

	var subdivideIndex = 0;
	for(var i=0; i<expandCount; ++i){
		console.log("all: ========================================================================================= "+i+" / "+expandCount);
// break;
		// INFO

		if(i>=5){
			world.shouldValidateMatchRange(false);
		}
console.log("SEQ BEFORE relativeFFromSamples");
		world.relativeFFromSamples();
		// world.relativeFfromR();

		world.estimate3DErrors(true);
console.log("SEQ BEFORE estimate3DErrors");
		world.printPoint3DTrackCount();
		
		world.copyRelativeTransformsFromAbsolute();
console.log("SEQ BEFORE initNullP3DPatches");
		world.initNullP3DPatches();
		// console.log("after init loop");
		// world.printPoint3DTrackCount();
throw "?";
		// SUBDIVIDE
			if(subdivideIndexes.length>0 && subdivideIndexes[subdivideIndex]==i){
console.log("SEQ subdivide");
				// var subdivisionMultiplier = 0.75;
				var subdivisionMultiplier = 0.5;
				console.log("subdivision: "+subdivideIndex);
				world.subdivideViewGridsR(subdivisionMultiplier);
				console.log("subDivideUpdateMatchLocation");
				world.subDivideUpdateMatchLocation();
				++subdivideIndex;
			}
			// 
world.checkTransformMatches();

		// EXPANSION
console.log("SEQ BEFORE probe3DR");
			// expand from local 2D
			var sigmaMaximumUse3DR = 1.0;
			var sigmaProbe3DR = 2.0;
			world.probe3DR(sigmaMaximumUse3DR,sigmaProbe3DR);
// console.log("after probe 3D");
// world.printPoint3DTrackCount();
world.checkTransformMatches();
		// expand 2D
		// var compareSize = 5;
console.log("SEQ BEFORE probe2DCellsR")
		var compareSize = 7;
		// world.probe2DCellsR(3.0,2.0, compareSize); // 9=>81 7=>49 5=>25
		world.probe2DCellsR(2.0,1.0, compareSize);
// console.log("after probe 2D");
// world.printPoint3DTrackCount();

world.checkTransformMatches();

				// 
console.log("SEQ BEFORE probe3DGlobal")
			// expand from 3D projection to other views
				world.probe3DGlobal(1.0, 2.0);
			// ...
				// 

		// optimize points
			world.refinePoint3DAbsoluteLocation();


		// RETRACT/FILTER
			// R/F/N/S error globally
			// local errors
			// local neighborhood matches
			// local 2D regularization mismatch
			// 
			// negative points
			

			// var sigmaFilter3DR = 3.0;
			// var sigmaFilter3DR = 2.5;
			var sigmaFilter3DR = 2.0;
			world.filterGlobal3DR(sigmaFilter3DR);
			// world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
			world.filterLocal2DR();
			world.filterLocal3DR();

			world.filterCriteria2DNnot3DN();
			world.filterCriteria2DNnotDepth();
			world.filterCriteria2DN3DNregularization();
			
			world.dropNegativeMatches3D();
			world.dropNegativePoints3D();

			world.filterGlobalPatchSphere3D();

			// world.smoothP3DPatchesNeighborhood();

		// OPTIMIZING VIEW TRANSFORM
			// optimize only single view location
			var iterationsUpdateViewSingle = 50;
				world.recordViewAbsoluteOrientationStart();
			world.refineSelectCameraMultiViewTriangulation(viewFocus, iterationsUpdateViewSingle);
				world.copyRelativeTransformsFromAbsolute();
				world.updateP3DPatchesFromAbsoluteOrientationChange();

			// if(iteration!==1 && iteration%iterations==1){
			// 	console.log("RICHIE SOLVE BORDER DISPUTE: "+iteration);
			// 	world.resolveBorderDisputes();
			// }
		
// throw "end of loop"
		// world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);

	}

	// world.smoothP3DPatchesNeighborhood();


	world.filterGlobal3DR(2.0); // some lower threshold
	world.refinePoint3DAbsoluteLocation();


	// console.log(world.toYAMLString());
	
	// throw "solveSequentialView";
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveDenseGroup = function(completeSolveFxn){ // multiple (3+)
	var world = this;

// throw "solveDenseGroup";
// console.log("START STRING:");
// console.log(world.toYAMLString());

// world.setResolutionProcessingModeFromCountP3D([]); // currently 0
// world.shouldValidateMatchRange(true);
world.shouldValidateMatchRange(false); // ALLOW LOW CONTRAST AREAS

var timeStart = Code.getTimeMilliseconds();
	var subdivisionMultiplier = 0.75;
	var subdivisions = 1; // 0-1
	var iterations = 3; // 2-3
subdivisions = 0;
// subdivisions = 1; // ~ 50k
// subdivisions = 2; // 100-200k
// subdivisions = 3;
// iterations = 2;
iterations = 3;
	var maxIterations = (subdivisions+1)*iterations;
	var subdivision = 0;
	// world.setResolutionProcessingModeFromCountP3D([0,0,0]); // to highest
	world.setResolutionProcessingModeBest();
	// world.setResolutionProcessingModeFromCountP3D([0,0]); // neighbor avg

	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);

		world.estimate3DErrors(true);

		world.printPoint3DTrackCount();
		
		world.copyRelativeTransformsFromAbsolute();

		world.initNullP3DPatches();
console.log("after init loop");
world.printPoint3DTrackCount();
		// subdivisions
		if(iteration!==0 && iteration%iterations==0){
			++subdivision;
			console.log("subdivision: "+subdivision);
			world.subdivideViewGridsR(subdivisionMultiplier);
			console.log("RICHIE R-densegroup - subDivideUpdateMatchLocation");
			world.subDivideUpdateMatchLocation();
			// if(subdivision>1){ // -0, -1, +2
			// 	world.shouldValidateMatchRange(false);
			// }
		}
		// expand - speedup
		var compareSize = 9;
		// var compareSize = 7;
		var sigmaProbe3DR = 2.0;
		var sigmaProbe2DR = 2.0;
		var sigmaFilter3DR = 2.0;
		var sigmaFilterPatch3D = 2.0;
		if(subdivision>0){
			// compareSize = 7;
			// compareSize = 5;
			// sigmaProbe3DR = 1.0;
			// sigmaProbe2DR = 1.0;
			// sigmaProbe3DR = 1.5;
			// sigmaProbe2DR = 1.5;
			// sigmaFilter3DR = 1.5; // 
			// sigmaFilterPatch3D = 1.0; // not a big diff
		}

		// expand 3D
		world.probe3DR(3.0,sigmaProbe3DR);
console.log("after probe 3D");
// world.printPoint3DTrackCount();
		// expand 2D
		// var compareSize = 5;
		world.probe2DCellsR(3.0,2.0, compareSize); // 9=>81 7=>49 5=>25
console.log("after probe 2D");
world.printPoint3DTrackCount();
// world.checkTransformMatches();
	
		// optimize points
		// world.refinePoint3DAbsoluteLocation();

		// retract
		world.filterGlobal3DR(sigmaFilter3DR); // 2 - 3
console.log("after global 3D filter");
world.printPoint3DTrackCount();
// world.checkTransformMatches();







// world.filterLocal2Dto3DSize();

// world.filterNeighborConsistency();

// world.filterLocal3Dto2DSize();

// world.filterLocal3Dto2DProjection();




// NEW:
world.filterCriteria2DNnot3DN();
world.filterCriteria2DNnotDepth();
world.filterCriteria2DN3DNregularization();
/*
world.filterCriteria2DNnot3DN();

world.filterCriteria2DNnotDepth();

world.filterCriteria2DN3DNregularization();
*/




/*
world.filterLocal2Dto3DSize();

world.filterLocal3Dto2DSize();

world.filterLocal3Dto2DProjection();

world.filterNeighborConsistency();
*/

		// world.filterLocal2DR();
console.log("after local 2D filter");
world.printPoint3DTrackCount();
// world.checkTransformMatches();







		// world.filterLocal3DR(3.0); // sphere: 1-2
world.filterGlobalPatchSphere3D(sigmaFilterPatch3D);
console.log("after patch 3D filter");
world.printPoint3DTrackCount();
// world.checkTransformMatches();




		// refine cameras --- no : camara position is assumed fixed
		// world.recordViewAbsoluteOrientationStart();
		// world.refineAllCameraMultiViewTriangulation(100);
		// world.copyRelativeTransformsFromAbsolute();
		// world.updateP3DPatchesFromAbsoluteOrientationChange();

		// world.recordViewAbsoluteOrientationStart();
		// world.refineAllCameraMultiViewTriangulation(50); // 100 is high for ~10 views
		// world.copyRelativeTransformsFromAbsolute();
		// world.updateP3DPatchesFromAbsoluteOrientationChange();



		// retract 2
		world.dropNegativeMatches3D();
		world.dropNegativePoints3D();

console.log("end loop")
world.printPoint3DTrackCount();
// console.log("LOOP STRING:");
// console.log(world.toYAMLString());
// throw "end loop";
	}

	
	// optimize points
	// world.refinePoint3DAbsoluteLocation(100);


	//refinePoint3DAbsoluteLocation
	// final output:
	world.estimate3DErrors(true);

var timeStop = Code.getTimeMilliseconds();
console.log(timeStart,timeStop);
console.log("seconds: "+((timeStop-timeStart)/1000));
console.log("mins: "+((timeStop-timeStart)/1000/60)); // ~ 20 mins

console.log("  END STRING:");
console.log(world.toYAMLString());


// throw "end solveDenseGroup";

}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveDensePairOld = function(subdivisionScaleSize, subDivisionCounts){ // pairwise, start with R
	// use R abs positions to get good initial points + iterate on expanding confident points
// throw "set solveDensePair values"
	console.log("solveDensePair");
	var world = this;

	// subdivisionScaleSize = Code.valueOrDefault(subdivisionScaleSize, 0.5); // 40 -> 80 -> 160
	// subDivisionCounts = Code.valueOrDefault(subDivisionCounts, 2);
	// iterationCounts = 3;
	// 2 x 3 = 6
	// 

	// subdivisionScaleSize = Code.valueOrDefault(subdivisionScaleSize, 0.75); // 40 -> 53 -> 71 -> 94
	// subDivisionCounts = Code.valueOrDefault(subDivisionCounts, 3);
	// iterationCounts = 2;
	// iterationCounts = 3;
	// 3 x 2 = 6


	subdivisionScaleSize = Code.valueOrDefault(subdivisionScaleSize, 0.666666666); // 40 -> 60 -> 90
	subDivisionCounts = Code.valueOrDefault(subDivisionCounts, 2);
	iterationCounts = 3;

var timeStart = Code.getTimeMilliseconds();
	
	var errorPercentage = 0.002; // 1% error + no wiggle room   --- 0.001 - 0.005  |  0.001=2.5px 0.005=12.5px
	var cellFeatureScale = 1.0; // 1-2
	var views = world.toViewArray();
	var view0 = views[0];
	var transforms = world.toTransformArray();
	var transform0 = transforms[0];

	// create seed points:
	var limitsR = [];
	var limitsF = [];

	world.setResolutionProcessingModeFromCountP3D([]); // currently 0
	world.shouldValidateMatchRange(true);
	
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.copyRelativeFromAbsolute();
		// world.copyRelativeTransformsFromAbsolute();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relativeAB = transform.R(viewA,viewB);
		var errorR = transform.rMean() + transform.rSigma();
		var views = [viewA,viewB];
		var imageScales = [];
		var sizes = [];
		var Ks = [];
		var imageHypotenuse = 0;
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var K = view.K();
			// var image = view.image();
			var imageScale = view.imageScales();
				var hyp = Math.sqrt(Math.pow(imageScale.width(),2) + Math.pow(imageScale.height(),2));
				// imageHypotenuse = Math.min(hyp);
				imageHypotenuse = hyp;
			///var gridSize = view.sizeFromPercent(viewGridSizePercent);
			var gridSize = view.cellSize();
			console.log("gridSize: "+gridSize);
			sizes.push(gridSize*cellFeatureScale);
			imageScales.push(imageScale);
			Ks.push(K);
		}
		// imageHypotenuse /= views.length;
		var errorR = errorPercentage*imageHypotenuse;
		console.log("GET MATCHES FROM 3D: "+errorR);
		
		// get corners
		// keep only peak corners within grid size distance
		// console.log(transform);
		var errorPixels = Math.max(errorR,1.0);
		console.log("ALLOWABLE DENSE ERROR: "+errorR+" | "+errorPixels);

console.log(imageScales, sizes, relativeAB, Ks, errorPixels);

		var result = R3D.searchMatchPoints3D(imageScales, sizes, relativeAB, Ks, errorPixels);
		console.log(result);
		var P = result["P"];
		var matches = result["matches"];
		console.log(matches);

console.log("P: \n "+P+"\n");
console.log("P: \n "+P.toArray()+"\n");
throw "before dense"

// P = Matrix.inverse(P);

// SET P NOW ?
// or just keep what it was previously?
viewA.absoluteTransform(new Matrix(4,4).identity());
viewB.absoluteTransform(P);
world.copyRelativeTransformsFromAbsolute();

		// insert matching points:
		// var matchesAddList = [];
		var points3DAdd = [];
		var errorsR = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var p2DA = match["pointA"];
			var p2DB = match["pointB"];
			var point3D = match["point3D"];
			var affineAB = match["affine"];
			var errR = match["error"];
			// world match object
			var newMatch = world.newMatchFromInfo(viewA,p2DA.copy(),viewB,p2DB.copy(),affineAB);
throw "check";
				// Stereopsis.updateErrorForMatch(newMatch); // estimated3D
			// var m3D = newMatch.point3D();
				// m3D.point( m3D.calculateAbsoluteLocation(world,true) ); // point3D
				// world.patchInitBasicSphere(false,[m3D]); // patch3D
			// matchesAddList.push(newMatch);
				// errorsR.push(newMatch.errorR());
			points3DAdd.push(newMatch.point3D());
		}
		console.log(points3DAdd);
		
		world.initPoints3DLocation(points3DAdd);
		world.initAllP3DPatches(points3DAdd);
		world.initAffineFromP3DPatches(points3DAdd);
		world.embedPoints3D(points3DAdd);

		world.relativeFFromSamples();
		// world.estimate3DErrors(false);
		world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	} // should only be 1 transform


	// throw "???? BEFORE LOOP"

	// var subdivisions = 0; // ~1k
	// var subdivisions = 1; // 5-10k
	var subdivisions = subDivisionCounts; // ~40k  --- select - about 
	// var subdivisions = 3; // ~100k
	// var iterations = 3; // per grid size - 2-4
	var iterations = iterationCounts;
	// var iterations = 5;
	// var iterations = 1;
	var maxIterations = (subdivisions+1)*iterations;

	var subdivision = 0;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		// 
		// world.setResolutionProcessingModeFromCountP3D([5E3,10E3,20E3]); // 5 , 10 , 20

		// world.setResolutionProcessingModeFromCountP3D([5E3,10E3]); // very hairy

		world.estimate3DErrors(true);
		
		world.printPoint3DTrackCount();
		
		world.copyRelativeTransformsFromAbsolute();

		world.initNullP3DPatches();


		// subdivisions
		if(iteration!==0 && iteration%iterations==0){
			++subdivision;
			console.log("subdivision: "+subdivision);
			world.subdivideViewGridsR(subdivisionScaleSize);
			world.subDivideUpdateMatchLocation();
			if(subdivision>1){ // -0, -1, +2
				world.shouldValidateMatchRange(false);
			}
		}
		// expand - speedup
		var compareSize = 9;
		if(subdivision==1){
			compareSize = 7;
		}else if(subdivision==2){
			compareSize = 5;
		}
		// world.probe2DCellsR(3.0,3.0);
		world.probe2DCellsR(3.0,3.0, compareSize); // 9=>81 7=>49 5=>25

		// optimize ?
		world.refinePoint3DAbsoluteLocation();

		// retract
		world.filterGlobal3DR(3.0);
		world.filterLocal2DR();
		world.filterLocal3DR();

		// refine
		world.recordViewAbsoluteOrientationStart();
		world.refineAllCameraMultiViewTriangulation(100);
		world.copyRelativeTransformsFromAbsolute();
		// 
		world.updateP3DPatchesFromAbsoluteOrientationChange();

		// retract 2
		world.dropNegativeMatches3D();
		world.dropNegativePoints3D();
	}

	// final output:
	world.estimate3DErrors(true);

	var timeStop = Code.getTimeMilliseconds();

console.log(timeStart,timeStop);
console.log((timeStop-timeStart)/1000);
console.log((timeStop-timeStart)/1000/60); // ~ 20 mins
	
	// check it out
	var str = world.toYAMLString();
	console.log(str);


throw "set solveDensePair values out"

	return;
}




Stereopsis.World.prototype.solveDensePair = function(seedPoints3D){ // pairwise, start with R
	console.log("solveDensePair");
	var world = this;


	// defaults
	var viewCellCountLow = 40; // 1600
	var viewCellCountMedium = 60; // 3600
	var viewCellCountHigh = 80; // 6400
	var viewCellCountDense = 120; // 14400
	world.setViewCellCounts(viewCellCountMedium);

console.log("adding in putative seed matches: "+seedPoints3D.length);
	// insert putative seed points
	var addedCount = 0;
	for(var j=0; j<seedPoints3D.length; ++j){
		var point3D = seedPoints3D[j];
		world.initNewPointPatch3D(point3D);
		// var isValid = world.isValidPoint3DAndPatch3D(point3D);
		var isValid = true; // just accept in case of bad points
		if(isValid){
			if(!point3D.hasPatch()){
				console.log(point3D);
				throw "INIT NEW PATCH DID NOT WORK";
			}
			addedCount++;
			world.recursiveEmbedPoint3D(point3D);
		}else{
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}

console.log("added initial points: "+addedCount);
console.log("total points: "+world.toPointArray().length);


	var views = world.toViewArray();
	// var viewA = views[0];
	// var viewB = views[1];
	var transforms = world.toTransformArray();
	var transform0 = transforms[0];
	var viewA = transform0.viewA();
	var viewB = transform0.viewB();


console.log(viewA.absoluteTransform()+"");
console.log(viewB.absoluteTransform()+"");


/*
// need an F
world.relativeFFromSamples();

var transAB = transform0;
var hasResult = world.estimateRForTransform(transAB);
console.log(hasResult);

if(hasResult){
	var R =  transAB.R(viewA,viewB);
	viewA.absoluteTransform( new Matrix(4,4).identity() );
	viewB.absoluteTransform( R );
	world.copyRelativeTransformsFromAbsolute();
}else{
	throw "NO R";
}

*/
// throw ""
	// prep
	

	var subdivisions = 1; // ~40k  --- select - about 

	// var iterations = 2;
	// iterations = 3;
	iterations = 4;
	// var iterations = 5;


	var maxIterations = (subdivisions+1)*iterations;


	var subdivision = 0;
// timeA = Code.getTimeMilliseconds();
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		world.printPoint3DTrackCount();

		world.relativeFFromSamples();
		world.estimateGlobalErrors();
		world.copyRelativeTransformsFromAbsolute();

// if(iteration!==1 && iteration%iterations==1){
// 	console.log("RICHIE SOLVE BORDER DISPUTE: "+iteration);
// 	world.resolveBorderDisputes();
// }

console.log("EXPAND ..................");		
		// expand
			var sigmaMaximumSelect = 2.0; // 1-2
			var sigmaMaximumKeep = 2.0; // 2-3
			world.probe2DCellsExpandR(sigmaMaximumSelect, sigmaMaximumKeep);


console.log("FILTER ..................");
		// filter
			world.filterPairwiseErrors(2.5);
			world.filterGlobalErrors(2.5);
//			world.filterNeighborConsistency2D3D();
//			world.filterNeighborConsistency2DViews();
			world.filterGlobalNegativeDepth();
			world.filterGlobalPatchVisibilityConsistency();
//			world.filterLocalError2D();
//			world.filterLocalError3D();


console.log("REFINE ..................");


var totalPointCount = world.toPointArray().length;
if(totalPointCount<16){
	console.log("FEW POINTS: "+totalPointCount);
	break;
}
// refine - camera position
				var iterationsUpdateViewSingle = 100;
				world.refineSelectCameraMultiViewTriangulation(viewB, iterationsUpdateViewSingle);
				world.copyRelativeTransformsFromAbsolute();
				world.reInitPoint3DLocationPatches();
				 // world.reInitPoint3DLocationPatches();
				
	world.checkVerifyPatches();
		
		if(iteration!==0 && iteration%iterations==0){
			++subdivision;
console.log("SUBDIVIDE ..................");
					console.log("SUBDIVIDING");
	// break;
					// subdivide
					var subdivisionMultiplier = 0.5;
					world.subdivideViewGridsR(subdivisionMultiplier);
					world.subDivideUpdateMatchLocation();
					// world.reInitPoint3DLocationPatches(); // done as part of subDivideUpdateMatchLocation
				}



// var str = world.toYAMLString();
// console.log(str);

// timeB = Code.getTimeMilliseconds();
// console.log("DELTA J: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();
	}

		// // smoothing?
		// // console.log("refinePoint3DAbsoluteLocation");
		// world.refinePoint3DAbsoluteLocation();
		// // SMOOTHING?
		// world.smoothP3DPatchesNeighborhood();

}



Stereopsis.World.prototype.solveDensePairNew = function(subdivisionScaleSize, subDivisionCounts){ // pairwise, start with R
	console.log("solveDensePair");
	var world = this;

	subdivisionScaleSize = Code.valueOrDefault(subdivisionScaleSize, 0.666666666); // 40 -> 60 -> 90
	subDivisionCounts = Code.valueOrDefault(subDivisionCounts, 2);
	// iterationCounts = 3;
	iterationCounts = 2;

	var timeStart = Code.getTimeMilliseconds();
	
	// var errorPercentage = 0.002; // 1% error + no wiggle room   --- 0.001 - 0.005  |  0.001=2.5px 0.005=12.5px
	// var cellFeatureScale = 1.0; // 1-2
	var views = world.toViewArray();
	var view0 = views[0];
	var transforms = world.toTransformArray();
	var transform0 = transforms[0];

	// prep
	world.relativeFFromSamples();
	// world.estimate3DErrors(false);
	world.estimate3DErrors(true);
	world.printPoint3DTrackCount();


	// throw "???? BEFORE LOOP"

	// var subdivisions = 0; // ~1k
	// var subdivisions = 1; // 5-10k
	// var subdivisions = 2; // ~40k
	var subdivisions = subDivisionCounts; // ~40k  --- select - about 


// subdivisions = 0; // show seeds
// subdivisions = 1; // 5k
subdivisions = 2; // 10k ............... testing
// subdivisions = 3; // 25k ................. current default
// subdivisions = 4; // 50k
// subdivisions = 5; // 100k
// subdivisions = 6; // too much
// console.log("subdivisions: "+subdivisions);
// throw "??"
	// var subdivisions = 3; // ~100k
	// var iterations = 3; // per grid size - 2-4
	var iterations = iterationCounts;
// iterations = 3;
	// var iterations = 5;
	// var iterations = 1;

// throw "before loop";
	var maxIterations = (subdivisions+1)*iterations;

world.shouldValidateMatchRange(false);
var sigmaGlobal3DR = 3.0;
	var subdivision = 0;
timeA = Code.getTimeMilliseconds();
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);


// timeB = Code.getTimeMilliseconds();
// console.log("DELTA A: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();

		world.estimate3DErrors(true);
		
		world.printPoint3DTrackCount();
		
		world.copyRelativeTransformsFromAbsolute();

// timeB = Code.getTimeMilliseconds();
// console.log("DELTA B: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();

		world.initNullP3DPatches();
/*
// 2 + 4 + 6
// TEST BORDERS
// if(iteration==3 || iteration==6){
if(iteration==3 || iteration==5){
// if(iteration==5){
// if(iteration==3){
	world.resolveBorderDisputes();
	// throw "testing borders"
}
*/
if(iteration!==1 && iteration%iterations==1){
	console.log("RICHIE SOLVE BORDER DISPUTE: "+iteration);
	world.resolveBorderDisputes();
}


		// subdivisions
		if(iteration!==0 && iteration%iterations==0){
			++subdivision;
			console.log("subdivision: "+subdivision);
			world.subdivideViewGridsR(subdivisionScaleSize);
			console.log("RICHIE R-dense - subDivideUpdateMatchLocation");
			world.subDivideUpdateMatchLocation();
			if(subdivision>1){ // -0, -1, +2
				world.shouldValidateMatchRange(false);
			}

			// sigmaGlobal3DR = 3.0 - subdivision*0.50; // 3.0 , 2.5 , 2.0 , 1.5
			sigmaGlobal3DR = 3.0 - subdivision*0.3333333; // 3.0 , 2.6 , 2.3 , 2.0
			sigmaGlobal3DR = Math.max(sigmaGlobal3DR,1.0);
		}

		// sigmaGlobal3DR = 2.0;
		// sigmaGlobal3DR = 2.5;
		sigmaGlobal3DR = 3.0;

// timeB = Code.getTimeMilliseconds();
// console.log("DELTA C: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();

// world.refinePoint3DAbsoluteLocation();

		// expand - speedup
		// var compareSize = 11;
		// var compareSize = 11;
		// if(subdivision==1){
		// 	compareSize = 9;
		// }else if(subdivision>=2){
		// 	compareSize = 7;
		// }
		// compareSize
		world.probe2DCellsR(2.0,2.0);
		// world.probe2DCellsR(5.0,5.0);
		// world.probe2DCellsR(99.0,99.0);

		// optimize ?
		// world.refinePoint3DAbsoluteLocation();
timeB = Code.getTimeMilliseconds();
console.log("DELTA D: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();
		// new
		world.filterCriteria2DNnot3DN();
		world.filterCriteria2DNnotDepth();
		world.filterCriteria2DN3DNregularization();

		world.filterNeighborhoodError();

timeB = Code.getTimeMilliseconds();
console.log("DELTA E: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();

		// retract
		world.filterGlobal3DR(sigmaGlobal3DR);
		// world.filterGlobal3DR(5.0);
		// ???????????????????????????????????????????
		// world.filterLocal2DR();
		// world.filterLocal3DR();

timeB = Code.getTimeMilliseconds();
console.log("DELTA F: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();

		world.filterLocal3DNeighborhoodSize();


// timeB = Code.getTimeMilliseconds();
// console.log("DELTA G: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();
		// world.filterGlobalPatchSphere3D(3.0);
		world.filterGlobalPatchSphere3D(2.0);
		// world.filterGlobalPatchSphere3D(1.0);

timeB = Code.getTimeMilliseconds();
console.log("DELTA H: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();

		// refine extrinsic matrixes
		world.recordViewAbsoluteOrientationStart();
		world.refineAllCameraMultiViewTriangulation(100);
		world.copyRelativeTransformsFromAbsolute();


timeB = Code.getTimeMilliseconds();
console.log("DELTA I: " + (timeB-timeA) );
timeA = Code.getTimeMilliseconds();

		world.updateP3DPatchesFromAbsoluteOrientationChange();


		// refine K
		world.refineAllCameraKMatrixes(100);
		console.log("update points using new camera matrixes");
		// throw "update points using new camera matrixes"

		// retract 2
		world.dropNegativeMatches3D();
		world.dropNegativePoints3D();



		// smoothing?
		// console.log("refinePoint3DAbsoluteLocation");
		world.refinePoint3DAbsoluteLocation();

		// SMOOTHING?
		world.smoothP3DPatchesNeighborhood();

		// 
		// 

// timeB = Code.getTimeMilliseconds();
// console.log("DELTA J: " + (timeB-timeA) );
// timeA = Code.getTimeMilliseconds();
	}




	world.filterGlobal3DR(2.0); // some lower threshold



	world.refinePoint3DAbsoluteLocation();

	// final output:
	world.estimate3DErrors(true);

	var timeStop = Code.getTimeMilliseconds();

console.log(timeStart,timeStop);
console.log((timeStop-timeStart)/1000);
console.log((timeStop-timeStart)/1000/60); // ~ 20 mins

	
	// check it out
	// var str = world.toYAMLString();
	// console.log(str);


	// world.showForwardBackwardPair();
	// ???
	
	// throw "solveDensePair2";
	// return null;
}


Stereopsis.World.prototype.smoothP3DPatchesNeighborhood = function(){
	var world = this;
	var points3D = world.toPointArray();
	var minimumNeighborhoodCount = 6; // 6 - 12
	
	// estimate best place
	var foundPoints = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D._temp = null;
		var p3D = point3D.point();
		var neighborhood = world.neighborhood2D3DForPoint3D(point3D, minimumNeighborhoodCount);
		if(!neighborhood || neighborhood.length<minimumNeighborhoodCount){
			continue;
		}
		// console.log(neighborhood);
		var pList = [];
		for(var j=0; j<neighborhood.length; ++j){
			var p = neighborhood[j];
			pList.push(p.point());
		}
		// console.log(pList);
		// average points
		// average normals
		// average sizes
		var plane = Code.planeFromPoints3D(pList);
		if(!plane){
			continue;
		}
		// console.log(plane);
		var projected = Code.projectPointToPlane3D(p3D, plane["point"],plane["normal"]);
		if(!projected){
			console.log("no projected point?");
			continue;
		}
		if(Code.isNaN(projected.x)){
			console.log(neighborhood);
			console.log(projected);
			console.log(p3D);
			console.log(plane);
			console.log(pList);
			console.log(projected);
			throw "NaN";
		}
		// console.log(projected);
		point3D._temp = projected;
		// throw "estimate curvature or normal ?";
		// estimate local plane from points
		// A: move point along normal toward plane
		// ...
		// B: move point along average view direction toward plane
		// ...
		// point3D._temp = newLocation;
	}

	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var newLocation = point3D._temp;
		if(newLocation){
			point3D._temp = null;
			world.updatePoint3DLocation(point3D,newLocation);
			++foundPoints;
		}
		
	}

	// // update to best place
	// for(var i=0; i<points3D.length; ++i){
	// 	var point3D = points3D[i];
	// 	var newLocation = point3D._temp;
	// 	if(!newLocation){
	// 		continue;
	// 	}
	// 	world.updatePoint3DLocation(point3D,newLocation);
	// 	point3D._temp = null;
	// }
	/*
SMOOTH:
	- for all P3D:
		- get 2D-3D-N & get 8 ~ 10 kNN 
		- get sigma distance
		- window / weights = exp^ - d^2/s^2
		- get local plane using weights
		- get new location = ray from Vavg to P3D => projected onto plane
	- set all P3D locations to new locations
*/
	console.log("smoothP3DPatchesNeighborhood: "+foundPoints+" / "+points3D.length);
// throw "smoothP3DPatchesNeighborhood";
}

Stereopsis.World.prototype.filterLocal3DNeighborhoodSize = function(){
	console.log("filterLocal3DNeighborhoodSize ...");
	var world = this;
	var views = world.toViewArray();
	// var sigmaDrop = 1.0;
	// var percentBad = 0.50;
	var sigmaDrop = 2.0;
	var percentBad = 0.50;
	var removedP2DCountTotal = 0;
	var neighborCountMax = 8 + 1;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pointSpace = view.pointSpace();
		var points2D = view.toPointArray();
		var neighborsLookup = {};
		// setup table:
		var removeListP2D = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			var i2D = point3D.id(); // different inside single view
			neighborsLookup[i2D+""] = {"yes":0, "no":0};
		}
		// do metric
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			var p2D = point2D.point2D();
			var i2D = point3D.id(); // different inside single view
			var p3D = point3D.point();
			var neighbors2D = pointSpace.kNN(p2D, neighborCountMax);
			// console.log(neighbors2D);
			var distances = [];
			// get average 3D distance & sigma
			for(var k=0; k<neighbors2D.length; ++k){
				var neighbor2D = neighbors2D[k];
				if(neighbor2D==point2D){
					distances.push(0); // empty
					continue;
				}
				var n3D = neighbor2D.point3D().point();
				var distance = V3D.distance(p3D,n3D);
				distances.push(distance);
			}
			// console.log(distances);
			var mean = Code.mean(distances);
			var sigma = Code.stdDev(distances,mean);
			var limit = mean + sigma*sigmaDrop;
			// console.log(mean+" +/- "+sigma+" = "+limit);
			// throw "here";
			// var entry = neighborsLookup[i2D+""];
			for(var k=0; k<neighbors2D.length; ++k){
				var neighbor2D = neighbors2D[k];
				if(neighbor2D==point2D){
					continue;
				}
				var neighbor3D = neighbor2D.point3D();
				var neighborID = neighbor3D.id();
				var distance = distances[k];
				var entry = neighborsLookup[neighborID+""];
				if(distance>limit){
					entry["no"] += 1;
				}else{
					entry["yes"] += 1;
				}
			}
			// neighborsLookup[i2D+""] = {"neighbors":neighbors2D, "mean":mean, "sigma":sigma, "limit":limit};
		}
		// console.log(neighborsLookup);
		// throw "?";
		var removeListP2D = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			var p2D = point2D.point2D();
			var i2D = point3D.id(); // different inside single view
			var entry = neighborsLookup[i2D+""];
			var countYes = entry["yes"];
			var countNo = entry["no"];
			var countTotal = countYes+countNo;
			if(countTotal>2){
				var percent = countNo/countTotal;
				if(percent>percentBad){
					removeListP2D.push(point2D);
				}
			}
			/*var neighbors2D = lookup["neighbors"];
			var percent;
			if(neighbors2D.length>0){
				var mean = lookup["mean"];
				// get average neighbor sigmas
				var overLimitCount = 0;
				for(var k=0; k<neighbors2D.length; ++k){
					var neighbor2D = neighbors2D[k];
					if(neighbor2D==point2D){
						continue;
					}
					var neighbor3D = neighbor2D.point3D();
					var neighborID = neighbor3D.id();
					var entry = neighborsLookup[neighborID+""];
					var limit = entry["limit"];
					if(limit<mean){
						overLimitCount++;
					}
				}
				percent = overLimitCount/neighbors2D.length;
				if(percent>0.666){
					removeListP2D.push(point2D);
				}
			}
			*/
			// console.log(neighbors2D.length+" @ "+percent);
			// if THIS POINT'S AVERAGE > 90% of all neighbors cutoff radius (average + sigma) -> outlier & delete
		}
		console.log("got: "+removeListP2D.length);
		for(var j=0; j<removeListP2D.length; ++j){
			var point2D = removeListP2D[j];
			world.removeP2DFromP3D(point2D);
			++removedP2DCountTotal;
		}
	}
	console.log("removedP2DCountTotal: "+removedP2DCountTotal);
}


Stereopsis.World.prototype.solveGroup = function(){ // multiwise BA full scene/group
	console.log("solveGroup");
	throw "where is this used?"
	var world = this;

	var transforms = world.toTransformArray();
	var views = world.toViewArray();

	world.copyRelativeTransformsFromAbsolute();
	// 
	var iterationsBAFilterViewSingle = 20; // 10-100
	var iterationsBAUpdateViewSingle = 10;

	// Stereopsis.COMPARE_MATCH_AFFINE_NEEDLE_SIZE = 11; 121
	Stereopsis.COMPARE_MATCH_AFFINE_NEEDLE_SIZE = 9; // 81 ~ 66%
	Stereopsis.COMPARE_HAYSTACK_NEEDLE_SIZE = 9;

	var points3D = world.toPointArray();

	// calculate each P3D patch && set each P3D's match affine
	world.calculatePoint3DPatches(points3D);

console.log("track count start");
	world.printPoint3DTrackCount();
	
	// calculate 2D SAD & NCC match scores
	world.calculatePoint3DMatchErrors(points3D);

	// get cummulative scores
console.log("scores");
	world.relativeFFromSamples();
console.log("errors");
	world.estimate3DErrors(true);



	// this for point averaging or DLT for multiple views ?
	// world.averagePoints3DFromMatches();
	

	// world.printErrorsDebugMatchCount();
	// world.printPoint3DTrackCount();

	// filter tracks
	// var filterIterations = 3;
	var filterIterations = 1;
	for(var i=0; i<filterIterations; ++i){
		console.log("track filter iteration: "+i);
		world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		// update 
		for(var v=0; v<views.length; ++v){
			var view = views[v];
			world.refineSelectCameraMultiViewTriangulation(view, iterationsBAFilterViewSingle);
			world.copyRelativeTransformsFromAbsolute();
		}
		world.estimate3DErrors(true);
		world.relativeFFromSamples();
console.log("track count filtered "+i);
		world.printPoint3DTrackCount();
	}





	// LOOP:
	var iterationsPerDivision = 0;
	// var iterationsPerDivision = 3;
	// var iterationsPerDivision = 5; // subdivision needs more iterations to A) cleanup prior & B) cleanup after
	var subDivisions = 0;
	// var subDivisions = 1;
	var maxIterations = iterationsPerDivision*(subDivisions+1);
	for(var i=0; i<maxIterations; ++i){
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ "+i+" ------------------------------------------------");
		// subdivide
		// if(i==maxIterations-1){
		if(i!==0 && i%iterationsPerDivision==0){
			for(var v=0; v<views.length; ++v){
				var view = views[v];
				var size = view.cellSize();
				size = size*0.75 | 0; // double
				// size = size*0.5 | 0; // quadruple
				if(size%2==0){
					size += 1;
				}
				console.log("CHANGE CELL SIZE: "+view.cellSize()+" -> "+size);
				view.cellSize(size);
			}
		}

		// optimize camera orientations
		for(var v=0; v<views.length; ++v){ // TODO: randomize
			var view = views[v];
			world.refineSelectCameraMultiViewTriangulation(view, iterationsBAUpdateViewSingle);
			world.copyRelativeTransformsFromAbsolute();
		}

		// update patches for new view positions
		points3D = world.toPointArray();
		world.calculatePoint3DPatches(points3D, true, true, false);

		// PROBE FOR NEW POINTS
			// expand - 3D project to other views
			world.probe3DGlobal(1.5, 1.5); // 1 - 2
			// expand - 2D probe
			world.probe2DCells(999, false);

		// update/add triangulation for only new P3D ?
		// points3D = world.toPointArray();
		// world.calculatePoint3DPatches(points3D);
		// world.calculatePoint3DPatches(points3D, true, false, false);
		// world.calculatePoint3DPatches(points3D, true, false, false, true);
		// world.calculatePoint3DPatches(points3D, true, true, true, true);

// TODO: NEW ONES ONLY -- need to mark somehow
		points3D = world.toPointArray();
		world.calculatePoint3DPatches(points3D);

		// FILTERING OUT NEW POINTS (and exising)
			// R / F / N scores - pairwise
			world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
			// global patch-sphere obstruction
			world.filterGlobalPatchSphere3D(1.0, false); // 1.0-2.0
			// 2D neighborhood R / F / N error
				// ?
			// 3D-2D distance-noise filter
//				world.filterLocal3Dto2DSize();
				world.filterLocal2Dto3DSize();
			// negative (behind) points:
				world.dropNegativeMatches3D();
				world.dropNegativePoints3D();
			// far / close
				// world.dropFurthest(5.0, 5.0);
// points that are very far away from most other points (halo points)
		
		// world.filterNeighborConsistency();
		// world.filterLocal3D(); // ...

		// update estimates after filtering
		// points3D = world.toPointArray();
		// world.calculatePoint3DPatches(points3D);

		// update point errors/location
		world.estimate3DErrors(true);
		world.relativeFFromSamples();

console.log("track count iteration");
world.printPoint3DTrackCount();
	}

console.log("track count done ");
		world.printPoint3DTrackCount();

	var str = world.toYAMLString();
	console.log(str);
	throw "?"
}

Stereopsis.World.prototype.solveFullDenseIterate = function(){ // multiwise BA full scene/group
	console.log("solveFullDenseIterate");

	var world = this;


	var maxIterations = 3;
	// var maxIterations = 5; //// ?
	// var maxIterations = 10;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		// inif?
		// if(iteration==0){ // subsequent approximations are always worse than the refined estimates
		// 	console.log("INIT");
		// 	world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		// 	world.estimate3DViews(); // find absolute view locations
		// 	world.averagePoints3DFromMatches(); // find absolute point locations
		// }else{
		// 	console.log("REFINE");
		// 	world.relativeFFromSamples(); // update F
		// 	world.estimate3DErrors(true, false); // update errors using absolute-relative transforms
		// }

console.log("sampleErrorsDebug");
world.sampleErrorsDebug();

		
		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();

		// do a single camera at a time

		// 

		// ALL CAMERAS:
		// world.refineCameraAbsoluteOrientation(null, 1000, true); // NOT BETTER
		world.refineCameraAbsoluteOrientation(null, 1000);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();

		// LONG ... 
		if(i==0){
			world.patchInitBasicSphere(true);
		}

		// add new points
//		world.probe3D()???
//		world.probe2DNNAffine(3.0);
//		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegativePoints3D();
		world.dropFurthest();
//		world.filterLocal3Dto2DSize();
		// world.filterLocal3D(); // ...
		world.filterPairwiseSphere3D(3.0); // 2-3
// ?: start more rigid, allow for more error, finish rigid
		// if(subdivision<1){
		// 	world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		// }else{
			world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		// }

		// world.filterLocal3Dto2DProjection(); // not implemented yet


		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	}

	// final output:
	world.averagePoints3DFromMatches();
	world.refinePoint3DAbsoluteLocation();
	world.patchInitBasicSphere(true);

	// check it out
	// var str = world.toYAMLString();
	// console.log(str);
	
}

Stereopsis.World.prototype.resolveBorderDisputes = function(){ //
	console.log("resolveBorderDisputes");
	var world = this;
	var transforms = world.toTransformArray();
	var space3D = world.pointSpace();

	var neighborhoodScale2D = 2.0; // 1.414 - 2.0
	var neighborhoodScale3D = 4.0; // more than 2D : 2-4

	var neighborhood2DK = 8 + 1;
	// var neighborhood3DK = 16 + 1; // more than 2D
	var neighborhood3DK = 20 + 1; // sphere growth = linear + error + padding

	var P3DtoIndex = function(p){
		return p.id();
	}
	var P2DtoIndex = function(p){
		return p.point3D().id();
	}

	var borderP3Ds = {};
	var borderPairs = {};

	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var views = [viewA,viewB];
		var opps = [viewB,viewA]
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var opp = opps[j];
			var space2D = view.pointSpace();
			var points2D = view.toPointArray();
			var cellSize2D = view.cellSize();
			// TODO: there needs to be a viewA & a viewB
			for(var k=0; k<points2D.length; ++k){
				var point2D = points2D[k];
				var point3D = point2D.point3D();
				var p2D = point2D.point2D();
				var p3D = point3D.point();
				// get 2D neighbors:
				// DISTANCE
					var searchRadius2D = cellSize2D*neighborhoodScale2D;
					var neighbors2D = space2D.objectsInsideCircle(p2D, searchRadius2D);
				// COUNT
					// var neighbors2D = space2D.kNN(p2D, neighborhood2DK);
				// ?
// console.log(neighbors2D.length);
				var hash2D = Code.toHash(neighbors2D,P2DtoIndex);
// console.log(hash2D);
				// get putative 3D neighbors
				// DISTANCE
					var cellSize3D = point2D.neighborhood3DSize();
					var searchRadius3D = cellSize3D*neighborhoodScale3D;
					var neighbors3D = space3D.objectsInsideSphere(p3D, searchRadius3D); // TODO: this needs to check for viewA & viewB
				// COUNT
					// var neighbors3D = space3D.kNN(p3D, neighborhood3DK);
// console.log(neighbors3D.length);
				// ?
				var hash3D = Code.toHash(neighbors3D,P3DtoIndex);


				// neighborhood size = remaining
				var trueNeighbors3D = [];
				var distances2D = [];
				var distances3D = [];
				for(var n=0; n<neighbors3D.length; ++n){
					var n3D = neighbors3D[n];
					if(n3D==point3D){
						continue;
					}

					// trueNeighbors3D.push(n3D);

					var n2D = n3D.pointForView(view);
if(!n2D){
	// throw "missing n2D";
	console.log("missing n2D");
}
					trueNeighbors3D.push(n3D);

					distances2D.push(V2D.distance(n2D.point2D(),p2D));
					distances3D.push(V3D.distance(n3D.point(),p3D));


					// var index = n3D.id();
					// var val2D = hash2D[index];
					// if(val2D){
						// trueNeighbors3D.push(n3D);
						// distances2D.push(V2D.distance(val2D.point2D(),p2D));
						// distances3D.push(V3D.distance(n3D.point(),p3D));
						// trueNeighbors.push(val2D);
					// }
				}
if(trueNeighbors3D.length<=1){
	// console.log("not enough real neighbors");
	continue;
}
				var mean2D = Code.mean(distances2D);
				var sigma2D = Code.stdDev(distances2D,mean2D);
				var mean3D = Code.mean(distances3D);
				var max3D = Code.max(distances3D);
				var sigma3D = Code.stdDev(distances3D,mean3D);
				// ...
				// var limit3D = mean3D + 3.0*sigma3D;

				// var limit3D = Math.max(mean3D + 4.0*sigma3D, max3D + 1.0*sigma3D);

				var limit3D = 2*max3D;

// console.log(mean2D+" +/- "+sigma2D);
// console.log(mean3D+" +/- "+sigma3D+" = "+limit3D);

				
				
				// mark if too far  
				for(var n=0; n<neighbors2D.length; ++n){
					var neighbor2D = neighbors2D[n];
					var neighbor3D = neighbor2D.point3D();
					var neighborP3D = neighbor3D.point();
					var d3D = V3D.distance(p3D,neighborP3D);
					if(d3D>limit3D){ // too far away in 3D [but close in 2D]
						borderP3Ds[neighbor3D.id()] = neighbor3D;
						borderP3Ds[point3D.id()] = point3D;
						var idA = point3D.id();
						var idB = neighbor3D.id();
						// var index = idA<idB ? (idA+"-"+idB) : (idB+"-"+idA);
						var index = idA+"-"+idB;
						borderPairs[index] = [point2D,neighbor2D, view,opp];
					}else{
						// ..
					}
				}
				
				/*
				// is 3D neighbor but not 2D neighbor
				for(var n=0; n<neighbors3D.length; ++n){
					var neighbor3D = neighbors3D[n];
					if(neighbor3D==point3D){
						continue; // ignore self
					}
					var index = neighbor3D.id();
					var neighbor2D = hash2D[index];
					if(!neighbor2D){ // not 2D neighbor
						borderP3Ds[neighbor3D.id()] = neighbor3D;
						borderP3Ds[point3D.id()] = point3D;
					}else{
						// ..
					}
				}
				*/

// throw "here";
			}
		}
	}

	var list3D = Code.objectToArray(borderP3Ds);

	// create new putative matches at each of these new points:


/*
	// delete ...
	for(var i=0; i<list3D.length; ++i){
		var point3D = list3D[i];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
	}
*/


	
	console.log(list3D.length);
	console.log(world.toPointArray().length+" = total");
/*
	// display these in the world
	var views = world.toViewArray();
	var viewA = views[0];
	var viewB = views[1];
	var imageA = viewA.imageScales();
	var imageB = viewB.imageScales();
	var cellSizeA = viewA.cellSize();
	var cellSizeB = viewB.cellSize();

	var widthA = imageA.width();

	var d = new DO();
		d.graphics().setLine(1.0,0x99CC0000);
		d.graphics().setFill(0x66FF00FF);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);
	for(var i=0; i<list3D.length; ++i){
		var point3D = list3D[i];
		var point2DA = point3D.pointForView(viewA);
		var point2DB = point3D.pointForView(viewB);

		var pointA = point2DA.point2D();
		var pointB = point2DB.point2D();
		d.graphics().beginPath();
		d.graphics().drawCircle(pointA.x+0,pointA.y+0, cellSizeA*0.5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();

		d.graphics().beginPath();
		d.graphics().drawCircle(pointB.x+widthA,pointB.y, cellSizeB*0.5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();
	}
*/

	var list = Code.objectToArray(borderPairs);
	var newMatches = [];
	for(var i=0; i<list.length; ++i){
		var pair = list[i];
// console.log(pair);
		var aPoint2DA = pair[0];
		var bPoint2DA = pair[1];
		var viewA = pair[2];
		var viewB = pair[3];
// console.log(aPoint2DA);
		var aPoint3D = aPoint2DA.point3D();
		var bPoint3D = bPoint2DA.point3D();
		var aPoint2DB = aPoint3D.pointForView(viewB);
		// reference points
		var aP2DA = aPoint2DA.point2D();
		var aP2DB = aPoint2DB.point2D();
		var matchA = aPoint3D.matchForViews(viewA,viewB);
		var affineAB = matchA.affineForViews(viewA,viewB);
		// objective point
		var bP2DA = bPoint2DA.point2D();

		var newMatch = world.bestNeedleHaystackMatchFromLocation(aP2DA,aP2DB, bP2DA, affineAB, viewA,viewB, true);
		if(newMatch){
			newMatches.push(newMatch);
		}
	}


	var count = 0;
	var averageErrorB = 0;
	for(var i=0; i<newMatches.length; ++i){
		var match = newMatches[i];

		// assume 3D : isR
		var point3D = match.point3D();
		var location3D = point3D.estimated3D();
		point3D.point(location3D); // not in world yet.
		world.initP3DPatchFromMode(point3D);

		// var point3D = match.point3D();
		point3D = world.embedPoint3D(point3D);
		if(point3D){
			var matches = point3D.toMatchArray();
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				Stereopsis.updateErrorForMatch(match);
			}
			point3D.calculateAbsoluteLocationDLT(world);
			// var p = point3D.point();
			averageErrorB += newMatch.errorR();
			++count;
		}
	}
	averageErrorB /= count;
	console.log("added "+count);
	console.log("averageErrorB: "+averageErrorB);


	// throw "resolveBorderDisputes"

}
Stereopsis.World.prototype.visualizePatches = function(){ //
	var world = this;

	var display = new DO();
	var displaySize = 800;
	// var displaySize = 2000;
	// var displaySize = 4000;
	// var zoomScale = 10.0;
	var zoomScale = 2.0;
	display.matrix().translate(400 + 10, 400 + 10);
	// display.matrix().translate(displaySize*0.5 + 10, displaySize*0.5 + 10);
	GLOBALSTAGE.addChild(display);

	var views = world.toViewArray();
	var ups = views.map(function(v){ return v.up(); });
	console.log(ups)
	var planeNormal = Code.averageAngleVector3D(ups);

	var points3D = world.toPointArray();
	var pts3D = points3D.map(function(p){ return p.point(); });
	var pointInfo = V3D.infoFromArray(pts3D);
	var planeCenter = pointInfo["mean"];
	var planeSize = pointInfo["size"];

	var displayScale = displaySize/Math.max(planeSize.x,planeSize.y);
		displayScale *= zoomScale;
	console.log(planeNormal,planeCenter,planeSize,displayScale);

	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
			p3D = V3D.sub(p3D,planeCenter);
		var p2D = Code.projectTo2DPlane(p3D, V3D.ZERO, planeNormal);
			p2D.scale(displayScale);
		var s = point3D.size();
			s *= displayScale;
		var d = new DO();
		d.graphics().setLine(1.0,0x99CC00CC);
		d.graphics().setFill(0x66FF00FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, s);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(p2D.x,p2D.y);
		display.addChild(d);
	}
	// views
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var p3D = view.center();
			p3D = V3D.sub(p3D,planeCenter);
		var p2D = Code.projectTo2DPlane(p3D, V3D.ZERO, planeNormal);
			p2D.scale(displayScale);
			s *= displayScale;
		var d = new DO();
		d.graphics().setLine(1.0,0xFF0000CC);
		d.graphics().setFill(0x990000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(p2D.x,p2D.y);
		display.addChild(d);
	}



// visualize patches:
/*
get average view 'up'
get size of space
scale for display = display size / space size
	origin = center of space
for each point & view
	project onto plane
	radius = same size

*/

}


Stereopsis.World.prototype.debugCheckPairPointMatchCounts = function(){
	var world = this;
	var transforms = world.toTransformArray();
	// console.log(transforms);
	var transform = transforms[0];
	// console.log(transform);
	var points3D = world.toPointArray();
	var existCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var index = match.id();
			// this._matches[index]
			var exists = transform._matches[index];
			if((exists!==undefined && exists!==null)){
				existCount += 1;
			}
		}
	}
	if(existCount!=points3D.length){
		console.log(points3D.length+" v "+existCount);
		throw "unmatched exist count";
	}
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveForTracks = function(completeFxn, completeContext){ // tracks (pairwise tested)
	console.log("solveForTracks");
	var world = this;

world.debugCheckPairPointMatchCounts();

	// do error estimation:
	world.copyRelativeTransformsFromAbsolute();
	world.relativeFFromSamples();
	world.createAllPoints3DPatches();

	world.estimateGlobalErrors();

	var transforms = world.toTransformArray();
	var limitsR = [];
	var limitsF = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(!transform.R()){
			console.log(transform);
			console.log("transform does not have R");
			return;
		}
	}

	var percentileKeepCorner = 0.75; // each point has a chance to fail -> n^2 [0.75 -> 0.56]
	var percentileKeepR = 0.50;
	var percentileKeepF = 0.50;
	// var percentileKeep = 0.90;

	// this.estimate3DErrors(true);
	var desiredSamples = 1000;
	var maxSampleSize = 1000;
	var randomSampleSize = 1000;
	var distanceMinimumRelative = 0.005; // 500x300 ~3
	var limitPointsKeepMax = 1000;
	var fxnSortSmallerFirst = function(a,b){
		return a<b ? -1 : 1
	};
	var fxnSortLargerFirst = function(a,b){
		return a>b ? -1 : 1
	};
	var fxnMatchToR = function(match){
		// return match.errorR();
		return match.point3D().globalErrorR();
	};
	var fxnMatchToF = function(match){
		return match.errorF();
	};
	// var fxnSortArray0Corner = function(a,b){
	// 	return a[0]>b[0] ? -1 : 1 ; // largest corner scores first
	// }

	// remove worst based on corner scores
	var views = world.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points = view.toPointArray();
		var corners = view.corners();
		var image = view.image();
		var imageWidth = image.width();
		var imageHeight = image.height();

		// entire image 
		// var cornerSample = Code.randomSampleRepeatsMaximum(corners,maxSampleSize,randomSampleSize);

		
		// actual population
		cornerSample = Code.randomSampleRepeatsMaximum(points,maxSampleSize,randomSampleSize);
		for(var j=0; j<cornerSample.length; ++j){
			var point = cornerSample[j];
			var p2D = point.point2D();
			var corner = corners[ Math.floor(p2D.y)*imageWidth + Math.floor(p2D.x) ];
			cornerSample[j] = corner;
		}
			cornerSample.sort(fxnSortLargerFirst);
// console.log(cornerSample);
// throw "???"
		var limitCornerValue = Code.percentile(cornerSample, percentileKeepCorner);
// console.log("limitCornerValue: "+limitCornerValue+" @ "+percentileKeepCorner);
		
		// drop on low corner score
		var dropPoints = [];
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var p2D = point.point2D();
			var corner = corners[ Math.floor(p2D.y)*imageWidth + Math.floor(p2D.x) ];
			if(corner<limitCornerValue){
				dropPoints.push(point.point3D());
			}
		}
		console.log("CORNER DROP COUNT: "+dropPoints.length+" / "+points.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
console.log("POINT COUNT CORNER: "+world.toPointArray().length);

	// drop worst based on R and F errors
	var transforms = world.toTransformArray();
	var limitsR = [];
	var limitsF = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		// sample R / F
		var samplesR = Code.randomSampleRepeatsMaximum(matches,maxSampleSize,randomSampleSize);
			samplesR = Code.transformArray(samplesR,fxnMatchToR);
			samplesR.sort(fxnSortSmallerFirst);
		var samplesF = Code.randomSampleRepeatsMaximum(matches,maxSampleSize,randomSampleSize);
			samplesF = Code.transformArray(samplesF,fxnMatchToF);
			samplesF.sort(fxnSortSmallerFirst);
		var limitR = Code.percentile(samplesR,percentileKeepR);
		var limitF = Code.percentile(samplesF,percentileKeepF);
		limitsF.push(limitF);
		limitsR.push(limitR);
	}

	// keep only best in remaining set based on corner
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var limitR = limitsR[i];
		var limitF = limitsF[i];
		var matches = transform.matches();
		var dropPoints = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.point3D().globalErrorR();
			var errorF = match.errorF();
			if(errorR>limitR || errorF>limitF){
				dropPoints.push(match.point3D());
			}
		}
		console.log("ERROR F/R DROP COUNT: "+dropPoints.length+" / "+matches.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	// drop all non-marked P3Ds
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
console.log("POINT COUNT F/R ERROR: "+world.toPointArray().length);
	// console.log("REMAINING POINTS: "+points3D.length);

	// TODO: FILTER ON N/S SCORE ?


/*
	// remove all points from each view & readd as long as far enough away from existing points
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var size = view.size();
		var imageWidth = size.x;
		var corners = view.corners();
		var points2D = view.toPointArray();
		var sortedPoints = [];
		// remove all points initially
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p2D = point2D.point2D();
			var index = Math.floor(p2D.y)*imageWidth + Math.floor(p2D.x);
			var corner = corners[index];
			view.removePoint2D(point2D);
			sortedPoints.push([corner, point2D]);
		}
		sortedPoints.sort(fxnSortArray0Corner);
		// add points back as long as not too close to existing points
		var image = view.image();
		var imageWidth = image.width();
		var imageHeight = image.height();
		var minDimension = Math.min(imageWidth,imageHeight);
		var avgDimension = (imageWidth+imageHeight)*0.5;
		var hyp = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight);
		var closestDistance = Math.max(hyp*distanceMinimumRelative,1.0);
			closestDistance = Math.max(closestDistance, 0.25*avgDimension/Math.sqrt(desiredSamples)); // 0.25 - Math.PI - 0.5
			console.log("closestDistance: "+closestDistance);
		var dropPoints = [];
		for(var j=0; j<sortedPoints.length; ++j){
			var sorted = sortedPoints[j];
			var point2D = sorted[1];
			var p2D = point2D.point2D();
			var closest = view.pointSpace().kNN(p2D,1); // point could be from ANY VIEW
			var shouldAdd = true;
			if(closest && closest.length==1){
				closest = closest[0];
				var distance = V2D.distance(p2D,closest.point2D());
				shouldAdd = distance>closestDistance;
			}
			if(shouldAdd){
				view.insertPoint2D(point2D);
			}else{
				dropPoints.push(point2D.point3D());
			}
		}
		console.log("DROP COUNT TOO CLOSE: "+dropPoints.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	console.log("POINT COUNT END: "+world.toPointArray().length);
*/

	// TODO: only need 3D locations, not patches
	world.createAllPoints3DPatches();
	world.estimateGlobalErrors();



	if(completeFxn){
		completeFxn.call(completeContext);
	}
	return null;
}











// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// refine view positions (therefore points)
// project good tracks to possible new views
// drop poor track matches
Stereopsis.World.prototype.solveSparseTracks = function(viewsToOptimize, completeFxn, completeContext){ // TODO: MAKE ASYNC
throw "old"
	viewsToOptimize = viewsToOptimize!==undefined ? viewsToOptimize : null;
	console.log("solveSparseTracks");
	var world = this;
	// var totalIter = 1;
	// var totalIter = 2;
	var totalIter = 3;
	// TODO: keep track of camera/view error progress & stop early if error gets low
	for(var iter=0; iter<totalIter; ++iter){
		console.log("ITERATION: "+iter+" ............ "+" / "+totalIter);
		world.averagePoints3DFromMatches();
		world.patchInitBasicSphere(true);
		world.relativeFFromSamples();

		// find new point3D spread
		console.log("probe3D");
		world.probe3D();
		// update patches
		// world.generateMatchAffineFromPatches();
		var ps3D = world.toPointArray();
		for(var p=0; p<ps3D.length; ++p){
			var p3D = ps3D[p];
			world.generateMatchAffineFromPatches(p3D);
		}
		world.printErrorsDebugMatchCount();
		world.estimate3DErrors(true);

		// update view locations
		// world.refineSelectCameraAbsoluteOrientation([world.viewFromID(5)], null, 100);
		// world.refineSelectCameraAbsoluteOrientation(pairWorldViews, null, 100);
		world.refineCameraAbsoluteOrientation(viewsToOptimize, 1000); // all at once ?
		world.copyRelativeTransformsFromAbsolute();
		
		// re-estimate matches & points3D &
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);
		world.relativeFFromSamples();

		// drop worst
		console.log("FILTER");
		world.filterLocal3D(4.0); // points far away from local sphere / plane

		world.filterPairwiseSphere3D(3.0); // patch intersections
		world.printPoint3DTrackCount();
		world.dropNegativePoints3D();
		//										R F N S
		// world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		// world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		world.filterGlobalMatches(false, 0, 2.0,4.0,2.5,2.5, false); // 95% - 99.7% - 99% - 99%
		
		world.printPoint3DTrackCount();
		// world.filterMatchGroups();
		// this.filterSphere3D(2.0);

		// point changes => new errors
		world.estimate3DErrors(true);
		}

		// TODO: PATCHES LIKELY NEED UPDATING: LOWER ERROR + DRIFT
		world.printPoint3DTrackCount();

		// 
}


















// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveTriple = function(completeFxn, completeContext, doTFT){ // only tested for single triple system
	console.log("solveTriple");
	var world = this;

	// assuming the relative transformations have already been set

	// IS THIS NEEDED ?
	// world.relativeFFromSamples();
	// world.estimate3DErrors(true);


	// need to reposition points based on view extrinsic matrix because camere intrinsic matrix may have changed

	// world.???()
	// console.log("updatePoint3DLocations...");
	// console.log(world.toViewArray());
	// world.updatePoint3DLocations();



	// throw "..."

	world.printPoint3DTrackCount();

	var transforms = world.toTransformArray();
	var views = world.toViewArray();

	// triple for relative scaling:
	console.log("relative scale using relative transforms - need 3 ");
	if(false){
		for(var i=0; i<views.length; ++i){
			var viewI = views[i];
			for(var j=i+1; j<views.length; ++j){
				var viewJ = views[j];
				for(var k=j+1; k<views.length; ++k){
					var viewK = views[k];
					var transformIJ = world.transformFromViews(viewI,viewJ);
					var transformIK = world.transformFromViews(viewI,viewK);
					var transformJK = world.transformFromViews(viewJ,viewK);
					var RIJ = transformIJ.R(viewI,viewJ);
					var RIK = transformIK.R(viewI,viewK);
					var RJK = transformJK.R(viewJ,viewK);
					console.log(RIJ,RIK,RJK);
					// 
					var RJI = RJI ? R3D.inverseCameraMatrix(RIJ) : null;
					var RKI = RKI ? R3D.inverseCameraMatrix(RIK) : null;
					var RKJ = RKJ ? R3D.inverseCameraMatrix(RJK) : null;
					// var RJI = Matrix.inverse(RIJ);
					// var RKI = Matrix.inverse(RIK);
					// var RKJ = Matrix.inverse(RJK);
					// var scaleIJtoIK = R3D.relativeScaleFromCameraMatrices(RIJ,RIK,RJK);
					// var scaleJKtoJI = R3D.relativeScaleFromCameraMatrices(RJK,RJI,RKI);
					// // var scaleJItoJK = R3D.relativeScaleFromCameraMatrices(RJI,RJK,RIK);
					// var scaleKItoKJ = R3D.relativeScaleFromCameraMatrices(RKI,RKJ,RIJ);
					// console.log(scaleIJtoIK);
					// console.log(scaleJKtoJI);
					// console.log(scaleKItoKJ);
					if(RJI && RKI && RKJ){
						var scaleIJtoIK = R3D.relativeScaleFromCameraMatrices(RIJ,RIK,RJK);
						var scaleJKtoJI = R3D.relativeScaleFromCameraMatrices(RJK,RJI,RKI);
						var scaleKItoKJ = R3D.relativeScaleFromCameraMatrices(RKI,RKJ,RIJ);
						console.log(scaleIJtoIK);
						console.log(scaleJKtoJI);
						console.log(scaleKItoKJ);
					}else{
						console.log("without 3 views, can't calculate");
					}
				}
			}
		}
	}

	// triple relative scaling based on point match overlaps
	var tripleScale = null;
	console.log("relative scale using random ratios");
	var result
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			for(var k=j+1; k<views.length; ++k){
				var viewC = views[k];
				var transformAB = world.transformFromViews(viewA,viewB);
				var transformAC = world.transformFromViews(viewA,viewC);
				var transformBC = world.transformFromViews(viewB,viewC);
				var errorAB = transformAB.rSigma();
				var errorAC = transformAC.rSigma();
				var errorBC = transformBC.rSigma();
				var errorA = viewA.rSigma();
				var errorB = viewB.rSigma();
				var errorC = viewC.rSigma();
				// calculate scale ratios
				var scaleABtoAC = 0;
				var scaleACtoBC = 0;
				var scaleBCtoAB = 0;
				var errorABtoAC = 0;
				var errorACtoBC = 0;
				var errorBCtoAB = 0;
				console.log(transformAB,transformAC,transformBC);

				if(transformAB.R() && transformAC.R()){
					result = world.relativeScaleFromSampleRatios(viewA,viewB,viewC); // AC/AB
					// console.log(" 1 = "+scaleABtoAC);
					if(result!==null){
						scaleABtoAC = result["scale"];
						errorABtoAC = result["error"];
					}else{}
				}
				if(transformAC.R() && transformBC.R()){
					result = world.relativeScaleFromSampleRatios(viewC,viewA,viewB); // CB/CA
					// console.log(" 2 = "+scaleACtoBC);
					if(result!==null){
						scaleACtoBC = result["scale"];
						errorACtoBC = result["error"];
					}
				}
				if(transformAB.R() && transformBC.R()){
					result = world.relativeScaleFromSampleRatios(viewB,viewC,viewA); // BA/BC
					// console.log(" 3 = "+scaleBCtoAB);
					if(result!==null){
						scaleBCtoAB = result["scale"];
						errorBCtoAB = result["error"];
					}
				}
				console.log(scaleABtoAC+" @ "+errorABtoAC+" = "+Math.exp(errorABtoAC)); // AC/AB
				console.log(scaleACtoBC+" @ "+errorACtoBC+" = "+Math.exp(errorACtoBC)); // BC/AC
				console.log(scaleBCtoAB+" @ "+errorBCtoAB+" = "+Math.exp(errorBCtoAB)); // AB/BC
				// create semi-consistent scaling:
				var edges = [];
				if(scaleABtoAC>0){
					edges.push([0,1, scaleABtoAC, (errorAB+errorAC)*errorABtoAC ]); // AB -> AC  : AC/AB
				}
				if(scaleACtoBC>0){
					edges.push([1,2, scaleACtoBC, (errorAC+errorBC)*errorACtoBC ]); // AC -> BC  : BC/AC
				}
				if(scaleBCtoAB>0){
					edges.push([2,0, scaleBCtoAB, (errorBC+errorAB)*errorBCtoAB ]); // BC -> AB  : AB/BC
				}
				console.log("edges");
				console.log(edges);
				if(edges.length==0){
					abs0 = 0;
					abs1 = 0;
					abs2 = 0;
				}else if(edges.length==1){
					console.log("only single ratio");
					if(scaleABtoAC>0){
						abs0 = 1.0; // AB
						abs1 = scaleABtoAC; // AC/AB
						abs2 = 0;
					}else if(scaleACtoBC>0){
						abs0 = 0;
						abs1 = 1.0; // AC
						abs2 = scaleACtoBC; // BC/AC
					}else if(scaleBCtoAB>0){
						abs0 = scaleBCtoAB; // AB/BC
						abs1 = 0;
						abs2 = 1.0; // BC
					}
				}else if(edges.length==2){ // no/few compareable points (or one pair was bad for some reason), infer missing transform
					console.log("two ratios");
					console.log(edges);
					if(scaleABtoAC>0 && scaleACtoBC>0){ // AB first
						abs0 = 1.0; // AB
						abs1 = scaleABtoAC; // AC
						abs2 = scaleABtoAC * scaleACtoBC; // BC first
						errorBCtoAB = (errorABtoAC+errorACtoBC); // interpreted error
					}else if(scaleACtoBC>0 && scaleBCtoAB>0){ // AC first
						abs0 = scaleACtoBC * scaleBCtoAB; // AB
						abs1 = 1.0; // AC
						abs2 = scaleACtoBC; // BC
						errorABtoAC = (errorACtoBC+errorBCtoAB); // interpreted error
					}else if(scaleABtoAC>0 && scaleBCtoAB>0){
						abs0 = scaleBCtoAB; // AB
						abs1 = scaleBCtoAB * scaleABtoAC; // AC
						abs2 = 1.0; // BC
						errorACtoBC = (errorABtoAC+errorBCtoAB); // interpreted error
					}
					console.log(abs0+" | "+abs1+" | "+abs2);
					// throw "???????? edge length 2 ???????"
				}else{ // 3
					var result = Code.graphAbsoluteFromRelativeScale1D(edges);
					var abs = result["values"];
					abs0 = abs[0];
					abs1 = abs[1];
					abs2 = abs[2];
					console.log(abs0,abs1,abs2);
				}// save scales somewhere
				tripleScale = {"AB":abs0,"AC":abs1,"BC":abs2,
								"A":viewA, "B":viewB, "C":viewC,
								"AB-AC":errorABtoAC, "AB-BC":errorBCtoAB, "AC-BC":errorACtoBC};
			}
		}
	}

	if(!doTFT){ // just want scale ratios of pairs
		var payload = {"metrics":tripleScale};
		if(completeFxn){
			completeFxn.call(completeContext, payload);
		}
		return;
	}

	// apply the scaling to get transforms in same coordinate system
	var viewA = tripleScale["A"];
	var viewB = tripleScale["B"];
	var viewC = tripleScale["C"];
	var scaleAB = tripleScale["AB"];
	var scaleAC = tripleScale["AC"];
	var scaleBC = tripleScale["BC"];
	var transformAB = world.transformFromViews(viewA,viewB);
	var transformAC = world.transformFromViews(viewA,viewC);
	var transformBC = world.transformFromViews(viewB,viewC);

	if(scaleAB==0 || scaleAC==0 || scaleBC==0){
		throw "can't scale these "+scaleAC+" | "+scaleAB+" | "+scaleCS
	}

	transformAB.scaleR(scaleAB);
	transformAC.scaleR(scaleAC);
	transformBC.scaleR(scaleBC);


	// need to rembed the points to combine collided
	var points3D = this.toPointArray();
	console.log("remove points");
	world.disconnectPoints3D(points3D);
	console.log("add points + colliding");
	world.embedPoints3D(points3D);

	world.printPoint3DTrackCount();


	// use only overlapping 3D points
	var points3D = this.toPointArray();
	var group2 = []; // keep for later matching
	var group3 = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var count = point3D.point2DCount();
		if(count==3){
			group3.push(point3D);
		}else{
			this.disconnectPoint3D(point3D);
			group2.push(point3D);
		}
	}
	console.log("3-pairs: "+group3.length);

	// construct T
	var matches = [];
	var pointsA = [];
	var pointsB = [];
	var pointsC = [];
	for(var i=0; i<group3.length; ++i){
		var point3D = group3[i];
		var point2DA = point3D.pointForView(viewA);
		var point2DB = point3D.pointForView(viewB);
		var point2DC = point3D.pointForView(viewC);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var p2DC = point2DC.point2D();
		pointsA.push(p2DA);
		pointsB.push(p2DB);
		pointsC.push(p2DC);
	}
	var errorPosition = ((transformAB.rSigma() + transformAC.rSigma() + transformBC.rSigma())/3.0) * 2.0 * 2.0; /// ... extra 2.0 ... reprojection & TFT error arent necessarily comparable metrics ...
	//var T = R3D.TFTRANSACFromPointsAuto(pointsA,pointsB,pointsC, errorPosition, null, 0.10);




	var T = R3D.TFTRANSACFromPoints(pointsA,pointsB,pointsC, errorPosition, null, 0.50, 0.99, 50); // 0.50 / 0.99
	var TFT = null;
	if(!T){
		console.log("did not get a T ...");
		console.log(pointsA,pointsB,pointsC);
		throw "? pointsA,pointsB,pointsC ?"
	}else{
		TFT = T["T"];
	}
	// drop outliers
	var errors = [];
	var errorPoints = [];
	for(var i=0; i<group3.length; ++i){
		var point3D = group3[i];
		var point2DA = point3D.pointForView(viewA);
		var point2DB = point3D.pointForView(viewB);
		var point2DC = point3D.pointForView(viewC);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var p2DC = point2DC.point2D();
		var error = R3D.tftError(TFT, p2DA, p2DB, p2DC);
			error = error["error"];
			// error = Math.log(error);
		errors.push(error);
		errorPoints.push([error, point3D]);
	}
	//var errorMean = Code.mean(errors);
	var errorMean = Code.min(errors);
	var errorSigma = Code.stdDev(errors,errorMean);
var TFTmean = errorMean;
var TFTsigma = errorSigma;
	console.log("T ERROR: "+errorMean+" +/- "+errorSigma);
	var maxErrorLimit = errorMean + 1.0*errorSigma; // 1.0 ~ 30% | 1.5 ~ % | 2.0 ~ 0%
	var dropPoints = [];
Code.printMatlabArray(errors,"tError");
	for(var i=0; i<errorPoints.length; ++i){
		var point = errorPoints[i];
		var error = point[0];
		if(error>maxErrorLimit){
			dropPoints.push(point[1]);
		}
	}
	console.log(" dropPoints: "+dropPoints.length+" / "+errorPoints.length);
	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	console.log(this.toPointArray());


	// get new P1 P2 P3 DIRECTLY FROM TFT ?



	// just optimize on current transforms
	console.log("optimize transforms using current relative(scaled) and TFT-valid points");
	// convert relative transforms to absolute transforms
	listPairs = [];
// relative transforms are initial source of orientations
	var extAB = transformAB.R(viewA,viewB);
	var extAC = transformAC.R(viewA,viewC);
	var extBC = transformBC.R(viewB,viewC);
		// relative
		if(extAB){
			var relAB = Matrix.inverse(extAB);
			listPairs.push([0,1,relAB,transformAB.rSigma()]);
		}
		if(extAC){
			var relAC = Matrix.inverse(extAC);
			listPairs.push([0,2,relAC,transformAC.rSigma()]);
		}
		if(extBC){
			var relBC = Matrix.inverse(extBC);
			listPairs.push([1,2,relBC,transformBC.rSigma()]);
		}
		var result = R3D.optimumTransform3DFromRelativePairTransforms(listPairs);
		console.log(result);
		var abs = result["absolute"];
		console.log(abs);
		var absA = abs[0];
		var absB = abs[1];
		var absC = abs[2];
		console.log(absA+"")
		console.log(absB+"")
		console.log(absC+"")
		var extA = Matrix.inverse(absA);
		var extB = Matrix.inverse(absB);
		var extC = Matrix.inverse(absC);
		// set absolute extrinsic transforms
		viewA.absoluteTransform(extA);
		viewB.absoluteTransform(extB);
		viewC.absoluteTransform(extC);
		this.copyRelativeTransformsFromAbsolute();

	// refine / BA

	// need initial point estimates with new properties
	// this.estimate3DErrors(true);
	// this.averagePoints3DFromMatches(true);


	var maxLoops = 5;
	for(var i=0; i<maxLoops; ++i){
		// add back all points for last round
		if(i==maxLoops-1){
break;
			console.log("RE-EMBEDDING ALL 2D PAIRS");
			for(var j=0; j<group2.length; ++j){
				// this.connectPoint3D(group2[j]);
				this.embedPoint3D(group2[j]);
			}

		}

		this.estimate3DErrors(true);

		this.patchInitBasicSphere(true);

		this.averagePoints3DFromMatches();
		// averagePoints3DFromMatches
		// this.averagePoints3DFromMatches(true); // DOES ONLY TRUE
		this.refineCameraAbsoluteOrientation();
		this.copyRelativeTransformsFromAbsolute();
		// this.relativeFFromSamples();
		// this.estimate3DErrors(true);
// relativeEstimatePoints3D
		// this.averagePoints3DFromMatches(true); // only need for abs error


		// // filtering ...
		// this.filterGlobalMatches();
		// this.dropNegative3D();
		// this.updatePoints3DNullLocations();
		// this.filterLocal2D(); //
		// this.filterLocal3D(); //

		// 2.0 - 3.0 ?
		this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);


			// // reassess
			// this.estimate3DErrors(true);

		// drop worst
		world.dropNegativePoints3D();
		this.dropFurthest();
		// intersection
		this.filterPairwiseSphere3D(3.0);
		// local 3d to 2d
//this.filterLocal3Dto2DSize();
	}
	this.estimate3DErrors(true);
	// TODO: BA ?

	//

	/*
	// this.copyRelativeTransformsFromAbsolute();(); // relative R from absolutes
	// this.relativeFfromR(); // relative F derived from relative R
	this.relativeFFromSamples();
	this.estimate3DErrors(true);
// this.refinePoint3DAbsoluteLocation(); // ?
	this.averagePoints3DFromMatches(true);
// should the 3D points be further optimized to minimize reprojection error to each view it's included in?
	// MOTION

	*/



	// get new points => use existing pairwise matches?

	// for all P3D with exactly 2 matches
		// find 3rd location in 3rd image
		// may need a search area
		// if NCC is good => set as triple


	// normalize TFT:
		TFT = R3D.normalizeTFTfromSizes(TFT, viewA.image().size(), viewB.image().size(), viewB.image().size());

	// this.averagePoints3DFromMatches(true);
	// this.estimate3DErrors(true);
	var payload = {"metrics":tripleScale, "T":TFT, "errorTMean":TFTmean, "errorTSigma":TFTsigma};


console.log(payload);

throw "payloar?"
	if(completeFxn){
		completeFxn.call(completeContext, payload);
	}
}

Stereopsis.World.prototype.relativeScaleFromSampleRatios = function(viewA,viewB,viewC){ // AC/AB
	console.log("relativeScaleFromSampleRatios");
	var world = this;
	console.log(viewA,viewB,viewC);
	var sizeA = viewA.size();
	var widthA = sizeA.x;
	var heightA = sizeA.y;

	var fxnB = function(p2D){
		return p2D.point3D().point2DForView(viewB) != null;
	}
	var fxnC = function(p2D){
		return p2D.point3D().point2DForView(viewC) != null;
	}
	// var maximumSampleTries = 1E4;
	var maximumSampleTries = 2000;
	var minimumSamples = 100; // 20 - 100
// TODO: minimumSamples should be some % of average view point count ?
	var enoughSamples = 1000; // - probably enough: 100 - 200
	var loc2D = new V2D();
	var maxDistance = 2.0; // might need to be error-size dependent  - reprojection error in AB / AC
		maxDistance = 0.0025*(widthA+heightA)*0.5; // ~2 px in 1000x750
// console.log(maxDistance+" OF "+widthA+"x"+heightA);
	var ratios = [];
	var pointSpaceA = viewA.pointSpace();


// deterministic center-to-center distance => much less accurate
/*
var toPoint = function(p2D){
	return p2D.point2D();
}
var points2DA = pointSpaceA.toArray();
var spaceB = new QuadTree(toPoint, V2D.ZERO, sizeA);
var spaceC = new QuadTree(toPoint, V2D.ZERO, sizeA);
console.log(points2DA);
for(var i=0; i<points2DA.length; ++i){
	var point2DA = points2DA[i];
	var point3D = point2DA.point3D();
	if(point3D.hasView(viewB)){
		spaceB.insertObject(point2DA);
	}
	if(point3D.hasView(viewC)){
		spaceC.insertObject(point2DA);
	}
}
// console.log(spaceB.toArray());
// console.log(spaceC.toArray());
pointsB = spaceB.toArray();
// var pairs = [];
var ratios = [];
var transformAB = world.transformFromViews(viewA,viewB);
var transformAC = world.transformFromViews(viewA,viewC);
// console.log(transformAB);

// AB
var viewMatrixAB = null;
if(transformAB.viewA()==viewA){
	viewMatrixAB = new Matrix(4,4).identity();
}else{
	viewMatrixAB = transformAB.R();
}
viewMatrixAB = Matrix.inverse(viewMatrixAB); // ABSOLUTE
var viewCenterAB = viewMatrixAB.multV3DtoV3D(new V3D(0,0,0));
console.log(viewCenterAB);

// AC
var viewMatrixAC = null;
if(transformAC.viewA()==viewA){
	viewMatrixAC = new Matrix(4,4).identity();
}else{
	viewMatrixAC = transformAC.R();
}
var viewCenterAC = viewMatrixAC.multV3DtoV3D(new V3D(0,0,0));
console.log(viewCenterAC);

// center to point distance ratios
for(var i=0; i<pointsB.length; ++i){
	var pointB = pointsB[i];
	var pointB2D = pointB.point2D();
	var pointC = spaceC.kNN(pointB2D,1);
	if(pointC){
		pointC = pointC[0];
		if(pointC){
			var pointC2D = pointC.point2D();
			var distance = V2D.distance(pointB2D,pointC2D);
			if(distance<maxDistance){
				// pairs.push([pointB,pointC]);
				var p3DB = pointB.point3D().point();
				var p3DC = pointC.point3D().point();
				var dB = V3D.distance(viewCenterAB,p3DB);
				var dC = V3D.distance(viewCenterAC,p3DC);
				if(dB>0 && dC>0){
					var ratio = dC/dB;
					ratios.push(ratio);
					// throw "?";
				}
			}
		}
	}
}
console.log(ratios);
Code.printMatlabArray(ratios,"ratios");

*/



	
	// distance between random points in each scene
	var pointCount = pointSpaceA.count(); // ~ 2x 
	var minPointCount = Math.sqrt(enoughSamples);
	if(pointCount<minPointCount){
		console.log("not enough point disparity to try: "+pointCount+" of "+minPointCount);
		return null;
	}
	console.log("TOTAL POINTS IN VIEW "+pointCount);
	for(var s=0; s<maximumSampleTries; ++s){
		var pairs = [];
		if(s%100==0){
			console.log(s+" / "+enoughSamples+" = "+ratios.length);
		}
		for(var j=0; j<10; ++j){ // max tries to get pair of points
			// pick random points
			loc2D.set( Math.random()*widthA, Math.random()*heightA );
			var closestB1 = pointSpaceA.kNN(loc2D,1, fxnB);
				closestB1 = closestB1[0];
				// SHOULD THIS KNN USE closestB1.point2D()?
			// var closestC1 = pointSpace.kNN(loc2D,1, fxnC);
			var closestC1 = pointSpaceA.kNN(closestB1.point2D(),1, fxnC);
				closestC1 = closestC1[0];
			var distance = V2D.distance(closestB1.point2D(),closestC1.point2D());
			if(distance<maxDistance){
				pairs.push([closestB1,closestC1]);
			}
			if(pairs.length==2){
				break;
			}
		}
		if(pairs.length==2){
			var p0 = pairs[0];
			var p1 = pairs[1];
			var pB1 = p0[0];
			var pC1 = p0[1];
			var pB2 = p1[0];
			var pC2 = p1[1];
				pB1 = pB1.point3D().point();
				pB2 = pB2.point3D().point();
				pC1 = pC1.point3D().point();
				pC2 = pC2.point3D().point();
				var dB = V3D.distance(pB1,pB2);
				var dC = V3D.distance(pC1,pC2);
				if(dB!=0 && dC!=0){
					var ratio = dC/dB;
					ratios.push(ratio);
				}
		}
		if(ratios.length>=enoughSamples){
			break;
		}
	}
Code.printMatlabArray(ratios,"ratios");
ratios = Code.arrayVectorLn(ratios);
	if(ratios.length<minimumSamples){
		return null;
	}


// TODO: SOOTHING OF RATIO SAMPLES?

// flat region check
//  @ 0.10=0.02  @ 0.25=0.05
// var maximumAllowedRange = 0.025; //  scale difference ... 0.1 - 0.01   ... good ~ 0.01 : TODO: LOWER THIS TO ~ 0.01-0.02


// var maximumAllowedRangeInitial = 0.25; // 0.50
// 2.0 => 0.693 | 1.5 => 0.405 | 1.33 => 0.287 | 1.25 => 0.225
var maximumAllowedRangeInitial = Math.log(1.3333); // 0.287

var percentCheck = 0.10; // 0.1 - 0.25
// sort sample
ratios.sort(function(a,b){
	return a < b ? -1 : 1;
});
// console.log(ratios);
//
var startIndex = 0;
var endIndex = Math.ceil(percentCheck*ratios.length);
	endIndex = Math.min(Math.max(endIndex,10),ratios.length-1);
var smallestRange = null;
// until endIndex reaches end:
// var ranges = [];
for(;endIndex<ratios.length; ++startIndex, ++endIndex){
	var range = ratios[endIndex] - ratios[startIndex];
	// ranges.push(range);
	// console.log(startIndex+" - "+endIndex+" = "+range+" / "+smallestRange);//+" ? "+ratios[endIndex]+" : "+ratios[startIndex]);
	if(smallestRange===null || range < smallestRange){
		// console.log("SET: "+smallestRange);
		smallestRange = range;
	}
}

// Code.printMatlabArray(ranges);
console.log("smallestRange: "+smallestRange+"    => scale: "+Math.exp(smallestRange));
// throw "?"
if(smallestRange>maximumAllowedRangeInitial){
	console.log("best range too large: "+smallestRange+" / "+maximumAllowedRangeInitial);
	// throw "..."
	return null;
}
		// discard everything outside ~ 2x range ? 

// throw "?";

	var sigmaDifferenceMinimum = 0.00001;
	var maxIterations = 25; // 10-50
	var lastSigma = null;
	for(var s=0; s<maxIterations; ++s){
		var lim = 1.0;
		var mean = Code.mean(ratios);
		var sigma = Code.stdDev(ratios,mean);
lastSigma = sigma;
console.log("SIGMA: "+s+" = "+sigma+" @ "+Math.exp(mean));
		var limitMin = mean - lim*sigma;
		var limitMax = mean + lim*sigma;
		// console.log(s+" MEAN START: "+mean+" +/- "+sigma+" / "+ratios.length);
		var next = [];
		for(var i=0; i<ratios.length; ++i){
			if(limitMin<=ratios[i] && ratios[i]<=limitMax){
				next.push(ratios[i]);
			}
		}
		if(next.length>3){
			ratios = next;
		}else{ // too small
			break;
		}
		if(sigma<sigmaDifferenceMinimum){
			break;
		}
		var nextMean = Code.mean(ratios);
		var absMean = Math.abs(mean);
		var absNext = Math.abs(nextMean);
		var rat = absNext>absMean ? absNext/absMean : absMean/absNext;
		if(rat<1.00001){
		// if(rat<1.000001){
			console.log("break early: "+nextMean+" & "+mean+" = "+rat);
			break;
		}
	}
	var lastRatio = (lastSigma/ratios.length);
	console.log("LAST SIGMA: "+lastSigma+" / "+ratios.length+" = "+lastRatio); // GOOD: 0.0000# - BAD: 0.00#
	console.log(ratios);
	// if(lastSigma==0){
	// 	throw "no sigma";
	// }
	if(lastRatio>0.001){ // 0.001 - 0.0001
		console.log("bad lastRatio: "+lastRatio);
		// Code.printMatlabArray(originalRatios);
		Code.printMatlabArray(ratios);
		// throw "bad -- unreliable scale";
		return null;
	}
	ratios = Code.arrayVectorExp(ratios);
	var scale = Code.mean(ratios);

	var result = {};
		result["scale"] = scale;
		result["error"] = smallestRange; // log scale error full window
	return result;
}

Stereopsis.World.prototype.showReprojectionError = function(){
	var transforms = this.toTransformArray();
	var dropList = [];
	var M1 = new Matrix(4,4).identity();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var Ka = viewA.K();
		var Kb = viewB.K();
		var M2 = transform.R(viewA,viewB);
		var points3D = [];
		var pointsA = [];
		var pointsB = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.estimated3D();
			if(point3D){
				var vA = match.viewA();
				var vB = match.viewB();
				var pointA = match.point2DA();
				var pointB = match.point2DB();
				pointA = pointA.point2D();
				pointB = pointB.point2D();
				points3D.push(point3D);
				if(vA==viewA){
					pointsA.push(pointA);
					pointsB.push(pointB);
				}else{
					pointsA.push(pointB);
					pointsB.push(pointA);
				}
			}
		}
		// console.log(points3D,pointsA,pointsB)
		var error = R3D.reprojectionErrorList(points3D, pointsA, pointsB, M1,M2, Ka,Kb);
		console.log(error);
	}
}

Stereopsis.World.prototype.printMatchStemPlots = function(){
	var points3D = this.toPointArray();
	var listStems = {};
	var sorting = function(a,b){
		return a < b ? -1 : 1;
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var viewCount = point3D.viewCount();
		// if(viewCount>1){
		if(viewCount>2){ // more than 1 match
			var index = viewCount+"";
			var list = listStems[index];
			if(!list){
				list = [];
				listStems[index] = list;
			}

			var ncc = [];
			var sad = [];

			// view based:
			// var points2D = point3D.toPointArray();
			// for(var j=0; j<points2D.length; ++j){
			// 	var point2D = points2D[j];
			// 	var matches = point2D.toMatchArray();
			// 	var n = 0;
			// 	var s = 0;
			// 	for(var m=0; m<matches.length; ++m){
			// 		var match = matches[m];
			// 		n += match.errorNCC();
			// 		s += match.errorSAD();
			// 	}
			// 	n /= matches.length;
			// 	s /= matches.length;
			// 	ncc.push(n);
			// 	sad.push(s);
			// }

			// matches:
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				ncc.push(match.errorNCC());
				sad.push(match.errorSAD());
			}

			// AVERAGE:
			ncc = [Code.averageNumbers(ncc)];
			sad = [Code.averageNumbers(sad)];

			ncc.sort(sorting);
			sad.sort(sorting);
			var entry = {"ncc":ncc, "sad":sad};
			list.push(entry);
		}
	}

	var str = "";
	var err = "";
	Code._forEachHash(listStems, function(v,k){
		console.log("VIEW COUNT: "+k);
		str = str+"% "+" views: "+k+" "+"\n";
		var count = 0;
		var list = v;
		var errn = "errorsN_"+k+" = {";
		var errs = "errorsS_"+k+" = {";
		var listCountM1 = list.length-1;
		for(var i=0; i<=listCountM1; ++i){
			var l = list[i];
			var ncc = l["ncc"];
			var sad = l["sad"];
			var n = "ncc"+k+"_"+count;
			var s = "sad"+k+"_"+count;
			errs += s;
			errn += n;
			if(i<listCountM1){
				errs += ",";
				errn += ",";
			}
				n = Code.printMatlabArray(ncc,n,true);
				s = Code.printMatlabArray(sad,s,true);
			str = str+""+s+"\n"+n+"\n";
			++count;
		}
		errn += "};";
		errs += "};";
		err = err+"\n"+errn+"\n"+errs+"\n";
	});
	console.log(str+"\n\n"+err);
	throw "?";
}
Stereopsis.World.prototype.printInfo = function(){
// console.log("printInfo");

return;
	// plot corner score vs reproj score

	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		console.log(transform);
		var matches = transform.matches();
var datas = [];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var imageA = viewA.image();
		var imageB = viewB.image();
		var cornersA = viewA.corners();
		var cornersB = viewB.corners();
// console.log(viewA);
// console.log(cornersA);
// throw "...";
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point = match.estimated3D();
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			pointA = pointA.point2D();
			pointB = pointB.point2D();
			// console.log(pointA,pointB);
			// console.log(imageA.width(),imageA.height());
			var cA = cornersA[Math.floor(pointA.y)*imageA.width() + Math.floor(pointA.x)];
			var cB = cornersB[Math.floor(pointB.y)*imageB.width() + Math.floor(pointB.x)];
			// var c = (cA+cB)*0.5;
			 var c = cB;
			var r = match.errorR();
			// console.log(cA,cB,c,r);
			// console.log(point);
			// console.log(match);
			datas.push([c,r,pointA,pointB]);
			// if(point){
			// 	if(point.z<0){
			// 		dropList.push(match);
			// 	}
			// }
			// throw "...";
		}
		datas.sort(function(a,b){
			return a[0] < b[0] ? -1 : 1;
		});
		var cS = [];
		var rE = [];
		for(var k=0; k<datas.length; ++k){
			var data = datas[k];
			var c = data[0];
			var r = data[1];
			cS.push(c);
			rE.push(r);
		}
		Code.printMatlabArray(cS,"c");
		Code.printMatlabArray(rE,"r");
	}
	throw "...";


return;
	var points3D = this.toPointArray();
	var listErrors = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		listErrors.push(error);
	}
	listErrors.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	console.log("3D ERRORS OF ALL ....");
	Code.printMatlabArray(listErrors,"E");
}


Stereopsis.World.prototype.dropCornersWorst = function(percentWorst){
	var world = this;
	var views = world._views;
	var viewCorners = {};
	var keys = Code.keys(views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var view = views[key];
		var corners = view.corners();
		var sorted = Code.copyArray(corners);
		sorted.sort(function(a,b){
			return a<b? -1 : 1;
		});
		var index = Math.round(sorted.length*percentWorst);
		var limit = sorted[index];
		viewCorners[key] = {"corners":corners, "limit":limit};
	}
	// prepare drop
	var dropPoints = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var view = views[key];
		var width = view.image().width();
		var height = view.image().height();
		var info = viewCorners[key];
		var corners = info["corners"];
		var limit = info["limit"];
		var points = view.toPointArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var point2D = point.point2D();
			var index = Math.floor(point2D.y)*width + Math.floor(point2D.x);
			var c = corners[index];
			if(c<limit){
				dropPoints.push(point.point3D());
			}
		}
	}
	// drop
	console.log(" CORNER dropPoints: "+dropPoints.length);

	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

}


Stereopsis.World.prototype.dropGlobalWorst = function(sigma){
	sigma = sigma!==undefined ? sigma : 2.0;
	var world = this;

	var limitMatchSigmaR = sigma;
	var points3D = world.toPointArray();
console.log("CURRENT P3D LENGTH: "+points3D.length);
	var errorsR = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		if(error!==null){
			errorsR.push(error);
		}
	}
	// sort linearly to find linear drop off
	var numerical = function(a,b){
		return a < b ? -1 : 1;
	}
	errorsR.sort(numerical);
	var mid = Code.median(errorsR);
	var limitRA = mid * 2;

	// statistical normal drop off
	var min = Code.min(errorsR);
	var sig = Code.stdDev(errorsR, min);
	var limitRB = min + sig*limitMatchSigmaR;
	var limitR = Math.min(limitRA,limitRB);

	console.log("dropGlobalWorst : R: "+min+" +/- "+sig+" | "+mid+" = "+limitRA+" & "+limitRB+" = "+limitR);

	var dropPoints = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		if(error!==null){
			if(error>limitR){
				dropPoints.push(point3D);
			}
		}
	}
	console.log(" dropPoints: "+dropPoints.length);
	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

	var points3D = world.toPointArray();
	console.log(" NEW P3D LENGTH: "+points3D.length);

}


Stereopsis.World.prototype.recordTransformErrorStart = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.errorStart();
	}
}

Stereopsis.World.prototype.recordTransformErrorEnd = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.errorEnd();
	}
}

Stereopsis.World.prototype.averageTransformDeltaError = function(){
	var errorR = 0;
	var errorF = 0;
	var transforms = this.toTransformArray();
	var count = transforms.length;
	if(count>0){
		for(var i=0; i<transforms.length; ++i){
			var transform = transforms[i];
			var r = transform.errorRDelta();
			var f = transform.errorFDelta();
			if(r){
				errorR += r;
			}
			if(f){
				errorF += f;
			}
		}
		errorR /= count;
		errorF /= count;
	}
	return {"F":errorF, "R":errorR};
}

Stereopsis.World.prototype.dropNegativePoints3D = function(){ // remove any points behind respective cameras
	var world = this;
	var points3D = world.toPointArray();
	var dir = new V3D();
	var droppedCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		if(point){
			var views = point3D.toViewArray();
			for(var j=0; j<views.length; ++j){
				var view = views[j];
				var normal = view.normal();
				var center = view.center();
				V3D.sub(dir, point,center);
				if(V3D.dot(dir,normal) <= 0){ // point is behind view
					world.disconnectPoint3D(point3D);
					world.killPoint3D(point3D);
					++droppedCount;
					break;
				}
			}
		}
	}
	console.log("dropNegativePoints3D: DROPPED: "+droppedCount);
}
Stereopsis.World.prototype.dropNegativeMatches3D = function(){ // remove all MATCHES with negative Z
	var world = this;
	var transforms = world.toTransformArray();
	var dropList = [];
var totalMatchListCount = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
++totalMatchListCount;
			var match = matches[j];
			var point = match.estimated3D();
			if(point){
				if(point.z<0){
					dropList.push(match);
				}
			}
		}
	}
	var ratio = totalMatchListCount>0 ? dropList.length/totalMatchListCount : 0;
	console.log(" - dropNegative3D: "+dropList.length+" / "+totalMatchListCount);
	if(ratio>0.5){
		var str = world.toYAMLString();
		console.log(str);
		// world.showForwardBackwardPair();
		// throw "remove too many negative";
		console.log("remove too many negative");
	}
	var matches = dropList;
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		world.removeMatchFromPoint3D(match);
	}
}

Stereopsis.World.prototype.dropFurthest = function(){ // remove all MATCHES with far z (and closest ?)
	var dropList = [];
	console.log(" - dropFurthest: "+dropList.length+" / ");
}


Stereopsis.World.prototype.filterGlobalMatches = function(relax, iterationIndex, R,F,N,S, linearly){ // drops matches from transform (pairwise discarding)
console.log("filterGlobalMatches");
	R = R!==undefined ? R : 3.0;
	F = F!==undefined ? F : 3.0;
	N = N!==undefined ? N : 3.0;
	S = S!==undefined ? S : 3.0;
	var M = 3.0; // or some average x percent
	linearly = linearly!==undefined ? linearly : false;
	var limitMatchSigmaR = R;
	var limitMatchSigmaF = F;
	var limitMatchSigmaNCC = N;
	var limitMatchSigmaSAD = S;


var limitMatchSigmaMulti = M;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var listMatchR = [];
		var listMatchF = [];
		var listMatchNCC = [];
		var listMatchSAD = [];
var listMatchMulti = [];
		// estimate
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorNCC = match.errorNCC()
			var errorSAD = match.errorSAD();
			/*
			// distance related error:
			var p3D = match.estimated3D();
			if(p3D){
				var dist = Math.abs(p3D.z);
				errorR = errorR/dist;
			}
			// TODO THIS SHOULD BE AVERAGE DISTANCE TO CAMERA A & B
			*/
			if(errorR!=null){
				listMatchR.push(errorR);
			}
			if(errorF!=null){
				listMatchF.push(errorF);
			}
			if(errorNCC!=null){
				listMatchNCC.push(errorNCC);
			}
			if(errorSAD!=null){
				listMatchSAD.push(errorSAD);
			}
var multi = errorR*errorF*errorSAD*errorNCC;
listMatchMulti.push(multi);
		}
		var minCount = 16;
		var limitF = null;
		var limitR = null;
		var limitN = null;
		var limitS = null;
		var limitM = null;
		if(listMatchNCC.length>minCount){
			var min = Code.min(listMatchNCC);
			var sig = Code.stdDev(listMatchNCC, min);
			console.log("N: "+min+" +/- "+sig);
			limitN = min + sig*limitMatchSigmaNCC;
			limitN = Math.min(limitN,0.50); // really bad
		}
		if(listMatchSAD.length>minCount){
			var min = Code.min(listMatchSAD);
			var sig = Code.stdDev(listMatchSAD, min);
			// console.log("S: "+min+" +/- "+sig);
			limitS = min + sig*limitMatchSigmaSAD;
		}
		if(listMatchF.length>minCount){
			var min = Code.min(listMatchF);
			var sig = Code.stdDev(listMatchF, min);
			console.log("F: "+min+" +/- "+sig);
			limitF = min + sig*limitMatchSigmaF;
		}
		if(listMatchR.length>minCount){
			var min = Code.min(listMatchR);
			var sig = Code.stdDev(listMatchR, min);
			console.log("R: "+min+" +/- "+sig);
			limitR = min + sig*limitMatchSigmaR;
		}
		if(listMatchMulti.length>minCount){
			var min = Code.min(listMatchMulti);
			var sig = Code.stdDev(listMatchMulti, min);
			console.log("M: "+min+" +/- "+sig);
			limitM = min + sig*limitMatchSigmaMulti;
		}
// console.log(" point count: "+this._pointSpace.count());



if(linearly){
// if(true){
// if(false){
// PRINT HERE
// TODO: ONLY NEED POPULATION SUBSET ~ 1000

var numerical = function(a,b){
	return a < b ? -1 : 1;
}
// listMatchSAD2 = Code.copyArray(listMatchSAD);
// listMatchNCC2 = Code.copyArray(listMatchNCC);
// listMatchSAD2.sort(numerical);
// listMatchNCC2.sort(numerical);

listMatchR2 = Code.copyArray(listMatchR);
listMatchF2 = Code.copyArray(listMatchF);
listMatchR2.sort(numerical);
listMatchF2.sort(numerical);

var percent = 0.5;
// var percent = 0.75;

// LINEAR DROPPING:
if(listMatchF2.length>minCount){
	var val = Code.percentile(listMatchF2,percent);
	var limitF2 = val / percent;
	limitF = Math.min(limitF,limitF2);
}
if(listMatchR2.length>minCount){
	var val = Code.percentile(listMatchR2,percent);
	var limitR2 = val / percent;
	limitR = Math.min(limitR,limitR2);
}
// if(listMatchNCC.length>minCount){
// 	var mid = Code.median(listMatchNCC);
// 	var limitN2 = mid * 2;
// 	limitNCC = Math.min(limitNCC,limitN2);
// }
// if(listMatchSAD.length>minCount){
// 	var mid = Code.median(listMatchSAD);
// 	var limitS2 = mid * 2;
// 	limitSAD = Math.min(limitSAD,limitS2);
// }
}
		var maxMatchCount = transforms.length;
		var maxViewCounts = this.viewCount();
		var matchCounts = Code.newArrayZeros(maxMatchCount+1);
		// var viewCounts = Code.newArrayZeros(maxViewCounts);

		var dropList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			// var errorR = match.errorR();
			// var errorF = match.errorF();
			// var errorN = match.errorNCC()
			// var errorS = match.errorSAD();
			// THIS WONT WORK IF THE ARRAYS ARE SORTED:
			var errorR = listMatchR[j];
			var errorF = listMatchF[j];
			var errorN = listMatchNCC[j];
			var errorS = listMatchSAD[j];
			var errorM = listMatchMulti[j];
			var dropR = R ? (limitR && errorR>limitR) : false;
			var dropF = F ? (limitF && errorF>limitF) : false;
			var dropN = N ? (limitN && errorN>limitN) : false;
			var dropS = S ? (limitS && errorS>limitS) : false;
			// var dropM = M ? (limitM && errorM>limitM) : false;
			var dropM = false;
			if(
				(dropR || dropF || dropN || dropM) // dropS
			){
				dropList.push(match);
				var point3D = match.point3D();
				var matchCount = point3D.matchCount();
			}
			matchCounts[matchCount] += 1;
		}
		console.log("MATCH CHECKS: matches: "+matchCounts+" DROPPED: "+dropList.length);
		// console.log("MATCH CHECKS: matches: "+viewCounts+" DROPPED: "+dropList.length);
		matches = dropList;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var p3D = match.point3D();
			this.removeMatchFromPoint3D(match);
			// this.removeCheckP3D(p3D);
		}
	}
}

Stereopsis.World.prototype.filterGlobalPoints = function(sigmaR){
	console.log("filterGlobalPoints");
	sigmaR = sigmaR!==null && sigmaR!==undefined ? sigmaR : 2.0;
	var maximumSamples = 1000;
	var points3D = this.toPointArray();
	var errors = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.totalReprojectionError();
			errors.push(error);
	}
	var minimalErrors = Code.randomSampleRepeatsMaximum(errors,maximumSamples,maximumSamples);
	var min = Code.min(minimalErrors);
	// var mean = Code.mean(minimalErrors);
	var sigma = Code.stdDev(minimalErrors,min);
	var dropList = [];
	var maxErrorLimit = min + sigmaR*sigma;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = errors[i];
		if(error>maxErrorLimit){
			dropList.push(point3D);
		}
	}
	console.log(" REMOVING GLOBAL POINTS: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		var point3D = dropList[i];
		this.disconnectPoint3D(point3D);
		this.killPoint3D(point3D);
	}
}
Stereopsis.World.prototype.checkNullP2D = function(){
	// console.log("checkNullP2D:");
	// CHECK REMOVED ?
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(!point2D.point2D()){
				console.log(point2D)
				console.log(point2D.point2D()+"");
				throw "NULL POINT IN VIEW";
			}
		}
	}
}
Stereopsis.affineCompare = function(matrixA, matrixB){ // error in affine transforms
	var vectorX = new V2D(1.0,0.0);
	var vectorY = new V2D(0.0,1.0);
	var vectorXA = matrixA.multV2DtoV2D(vectorX);
	var vectorYA = matrixA.multV2DtoV2D(vectorY);
	var vectorXB = matrixB.multV2DtoV2D(vectorX);
	var vectorYB = matrixB.multV2DtoV2D(vectorY);
	var diffX = V2D.sub(vectorXA,vectorXB);
	var diffY = V2D.sub(vectorYA,vectorYB);
	var error = V2D.distance(diffX,diffY);
	return {"error":error};
}
Stereopsis.translationCompare = function(pointA1,pointA2, affine, pointB1,pointB2){ // error in expected affine location & actual location
	var before = V2D.sub(pointB1,pointA1);
	var after = affine.multV2DtoV2D(before);
	var actual = V2D.sub(pointB2,pointA2);
	var diff = V2D.sub(after,actual);
	//var error = diff.length()/before.length(); // relative error
	var error = diff.length(); // absolute
	return {"error":error};
}
Stereopsis.World.prototype.accumulateVotePopulation = function(point1A,point1B,match1, point2A,point2B,match2, viewA,viewB){
	var votes = point1A.metricsForViews(viewA,viewB);
	var errorSAD = match2.errorSAD();
	var errorNCC = match2.errorNCC();
	var errorR = match2.errorF();
	var errorF = match2.errorR();
	votes["neighbors"].push(point2A);
	if(errorSAD){
		votes["SAD"].push(errorSAD);
	}
	if(errorNCC){
		votes["NCC"].push(errorNCC);
	}
	if(errorR){
		votes["R"].push(errorR);
	}
	if(errorSAD){
		votes["F"].push(errorF);
	}
	if(match1 && match2){
		// TODO: SYMMETRIC ERROR ?
		var affine = Stereopsis.affineCompare(match1.affineForViews(viewA,viewB),match2.affineForViews(viewA,viewB));
			affine = affine["error"];
		votes["affine"].push(affine);
		var trans = Stereopsis.translationCompare(point1A.point2D(),point1B.point2D(), match1.affineForViews(viewA,viewB),point2A.point2D(),point2B.point2D());
			trans = trans["error"];
		votes["translate"].push(trans);
	}
}
Stereopsis.World.prototype.filterLocal2D = function(){ // single view point dropping
	// filter each view on poorest points
	var views = this.toViewArray();
	// reset all voting
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			point2D.resetVotes();
		}
	}
	// accumulate voting info & vote
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var searchRadius = cellSize*1.5; // 1.414 for root 2
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var point3DA = point2DA.point3D();
			var matchesA = point3DA.toMatchArray();
			var viewsA = point3DA.toViewArray();
			var neighbors2D = view.pointsInCircle(point2DA.point2D(), searchRadius);
			for(var k=0; k<neighbors2D.length; ++k){
				var point2DB = neighbors2D[k];
				var point3DB = point2DB.point3D();
				for(v=0; v<viewsA.length; ++v){
					var other = viewsA[v];
					if(other!=view){
						var matchA = point3DA.matchForViews(view,other);
						var matchB = point3DB.matchForViews(view,other);
						if(matchA && matchB){
							var oppositeA = matchA.oppositePoint(point2DA);
							var oppositeB = matchB.oppositePoint(point2DB);
							this.accumulateVotePopulation(point2DA,oppositeA,matchA, point2DB,oppositeB,matchB, view,other);
						}
					}
				}
			}
			point2DA.voteForNeighbors();
		}
	}
	// delete based on votes
	var removeP2D = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(point2D.voteDrop()){
				removeP2D.push(point2D);
			}
		}
	}
	console.log("DROP COUNT 2D: "+removeP2D.length);
	for(var i=0; i<removeP2D.length; ++i){
		var point2D = removeP2D[i];
		this.removeP2DFromP3D(point2D);
	}
}
Stereopsis.World.prototype.removeP2DFromP3D = function(point2D){
	var point3D = point2D.point3D();
	if(point3D){
		// matches
		var matches = point2D.toMatchArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var trans = match.transform();
			var oppoP2D = match.oppositePoint(point2D);
			point2D.removeMatch(match);
			oppoP2D.removeMatch(match);
			point3D.removeMatch(match);
			trans.removeMatch(match);
			match.kill();
		}
		// point3D
		var view = point2D.view();
		point3D.point2DForView(view,null);
		point2D.point3D(null);
		// view
		// console.log(view);
		// console.log(point2D);
		// console.log(point2D.point2D()+"");
		// var result = null;
		// console.log();
		//var result = view.removePoint2D(point2D);
		// console.log("BEFORE: "+view._pointSpace.count())
		var result = view.removePoint2D(point2D);
		// console.log(" AFTER: "+view._pointSpace.count())
		// console.log("REMOVED POINT: "+point2D.point2D()+" = "+result);
		if(!result){
			console.log(point2D);
			console.log(view);
			// throw "POINT NOT REMOVED FROM VIEW";
			console.log("POINT NOT REMOVED FROM VIEW");
		}
		// console.log(point3D.toMatchArray().length+" ? ")
		point2D.view(null);
		point2D.point2D(null);
		this.removeCheckP3D(point3D);
		return true;
	}
	return false;
}
Stereopsis.World.prototype.removeCheckP3D = function(point3D){ // if no matches => drop
	var world = this;
	var matches = point3D.toMatchArray();
	if(matches.length==0){
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
		return true;
	}
	return false;
}
Stereopsis.World.prototype.reposition2D = function(){ // use existing R/match to try to find more optimal location for poor points
	console.log("reposition2D");
return;
	var world = this;
	var maxAttempts = 1E4; // 1k-10k
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var imageA = viewA.image();
		var imageB = viewB.image();

		var matches = transform.matches();
		var transformErrorRLimit = transform.rMean() + 0.50*transform.rSigma(); // don't bother with already well placed points -- OR VERY POOR POINTS ??
			transformErrorRLimit = 0;
		var searchWindow = Math.min( Math.max(Math.round(transform.rMean() + transform.rSigma()),1), 3);

		var needleSize = 11; // cell size ?
		// var zoom = 1.5;
		var zoom = 1.0; // 0.5 - 1.0
		var haystackSize = needleSize + 2*searchWindow;
		console.log("compare sizing: "+needleSize+" & "+haystackSize);

		matches = Code.copyArray(matches);
		var attempts = Math.min(maxAttempts, matches.length);
		var count = 0;
		var averageErrorA = 0;
		var averageErrorB = 0;
		var matchesAddList = [];
		var averageDistance = 0;
		for(count=0; count<attempts; ++count){
			if(matches.length==0){
				break;
			}
			var index = Code.randomInt(0,matches.length-1);
			var match = matches[index];
			matches.splice(index,1);
			// if(!p2DA){ // nulli
			// 	--count;
			// 	continue;
			// }
			var rError = match.errorR();
			if(rError<transformErrorRLimit){ // skip best
				--count;
				continue;
			}
			var affineAB = match.affineForViews(viewA,viewB);
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var p2DA = pointA.point2D();
			var p2DB = pointB.point2D();

			// search for optimum location:
			var info = R3D.subpixelHaystack(imageA,imageB, p2DA,p2DB, affineAB,  needleSize,haystackSize, zoom);
			var newB = info["B"];

			var delta = V2D.distance(p2DB,newB);
			averageDistance += delta;

			averageErrorA += rError;

throw "average error is going up ...."

			var newMatch = world.newMatchFromInfo(viewA,p2DA.copy(),viewB,newB,affineAB.copy());
				Stereopsis.updateErrorForMatch(newMatch); // estimated3D
			var m3D = newMatch.point3D();
				m3D.point( m3D.calculateAbsoluteLocationDLT(world,true) ); // point3D
				world.patchInitBasicSphere(false,[m3D]); // patch3D

			// remove old:
			world.removeMatchFromPoint3D(match);
			// add new
			matchesAddList.push(newMatch);


			//
			// var needle = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,zoom,null,needleSize,needleSize, affineAB);
			// var haystack = imageB.extractRectFromFloatImage(p2DB.x,p2DB.y,zoom,null,haystackSize,haystackSize, null);
			// // var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
			// // 	scoreNCC = scoreNCC["value"][0];
			// // var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
			// // 	scoreSAD = scoreSAD["value"][0];
			// // var range = needle.range()["y"];
			// var scores = R3D.searchNeedleHaystackSADColor(needle,haystack);
			// var values = scores["value"];
			// var width = scores["width"];
			// var height = scores["height"];
			// // by index only
			// var minIndex = Code.minIndex(values);
			// var minX = Math.floor(minIndex%width);
			// var minY = Math.floor(minIndex/width);
			// var peak = new V3D(minX,minY,values[minIndex]);
			// // TODO: SUB-PIXEL MINIMUM
			// var newCenter = center2D.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);


			//
			// update estimate / patch ?


			// remove THIS match  (redo collisions?)
			//
		}
		averageErrorA /= count;
		averageDistance /= count;
		console.log("averageDistance "+averageDistance);
		console.log("completed "+count+" of "+attempts);

		var count = 0;
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocationDLT(world);
				// var p = point3D.point();
				averageErrorB += newMatch.errorR();
				++count;
			}
		}
		averageErrorB /= count;
		console.log("added "+count);
		console.log("averageError: "+averageErrorA+" => "+averageErrorB);
	}
	/*
		only want to do this ~one time
			-- when cameras are in relatively stable spot
			-- after earlier error points are removed

		want to allow 2D points to move around to find better location spot match
			- use relative affine from patch/R
			-
		prioritize worse points => higher error reduction per calculation effort


		if search time is very slow => cap at maximum

		for each transform
			for each match
				if match error is in miggle range (middle 50%?)
					use initial point A as source & point B as dest
					use relative affine for search transform
					window of search should be ~ pixel reprojection error [max 3 pixels]
					search scale should be at least 1 - 2 to make location more accurate

	*/
}



Stereopsis.World.prototype.filterNeighborhoodError = function(){
	console.log("filterNeighborhoodError ENTER");
	var world = this;
	var transforms = world.toTransformArray();
	var space3D = world.pointSpace();

	var P3DtoIndex = function(p){
		return p.id();
	}
	var P2DtoIndex = function(p){
		return p.point3D().id();
	}

	var minIntersectionCount = 6; // 
	var neighborhoodScale2D = 1.0;
	var neighborhoodScale3D = 1.25;
	// neighborhoodScale2D = Math.sqrt(2);
	neighborhoodScale2D = 2.0;
	neighborhoodScale3D = neighborhoodScale2D * 2.0;

	var factorErrorLimitGlobal = 2.0;
	var factorErrorLimitLocal = 2.0;
	// var factorErrorLimitGlobal = 2.5;
	// var factorErrorLimitLocal = 2.5;
	// var factorErrorLimitGlobal = 3.0;
	// var factorErrorLimitLocal = 3.0;

	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var space2DA = viewA.pointSpace();
		var space2DB = viewB.pointSpace();
		var cellSize2DA = viewA.cellSize();
		var cellSize2DB = viewB.cellSize();
		var searchRadius2DA = cellSize2DA*neighborhoodScale2D;
		var searchRadius2DB = cellSize2DB*neighborhoodScale2D;

		var dropMatches = [];

		var errorTransformLimitN = transform.nccMean() + factorErrorLimitGlobal*transform.nccSigma();
		var errorTransformLimitS = transform.sadMean() + factorErrorLimitGlobal*transform.sadSigma();
		var errorTransformLimitF = transform.fMean() + factorErrorLimitGlobal*transform.fSigma();
		var errorTransformLimitR = transform.rMean() + factorErrorLimitGlobal*transform.rSigma();

		var centerA = viewA.center();
		var centerB = viewB.center();
		var matches = transform.matches();
		console.log("TRANSFORM: "+i+" - matches: "+matches.length);
		console.log("ERROR LIMITS: \n  N:"+errorTransformLimitN+"\n  S:"+errorTransformLimitS+"\n  F:"+errorTransformLimitF+"\n  R:"+errorTransformLimitR+"\n ");
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var p2DA = point2DA.point2D();
			var p2DB = point2DB.point2D();
			var p3D = point3D.point();
			// 2D & 3D neighbors
			var cellSize3D = Math.max( point2DA.neighborhood3DSize(), point2DB.neighborhood3DSize() );
			var searchRadius3D = cellSize3D*neighborhoodScale3D;
			var neighbors2DA = space2DA.objectsInsideCircle(p2DA, searchRadius2DA);
			var neighbors2DB = space2DB.objectsInsideCircle(p2DB, searchRadius2DB);
			var neighbors3D = space3D.objectsInsideSphere(p3D, searchRadius3D);

			// to lookup:
			// neighbors2DA = Code.toHash(neighbors2DA,P3DtoIndex);
			// neighbors2DB = Code.toHash(neighbors2DB,P3DtoIndex);
			// neighbors3D = Code.toHash(neighbors3D,P3DtoIndex);
			var hashA = Code.toHash(neighbors2DA,P2DtoIndex);
			var hashB = Code.toHash(neighbors2DB,P2DtoIndex);
			var hash3 = Code.toHash(neighbors3D,P3DtoIndex);

			var intersectionIndexes = Code.objectIntersectKeys([hashA,hashB,hash3]);

			// console.log("sizes: "+neighbors2DA.length+" | "+neighbors2DB.length+" | "+neighbors3D.length+"  ==  "+intersectionIndexes.length);
			if(intersectionIndexes.length<minIntersectionCount){
				continue;
			}
			// get errors
			var errorsS = [];
			var errorsN = [];
			var errorsF = [];
			var errorsR = [];
			for(var k=0; k<intersectionIndexes.length; ++k){
				var index = intersectionIndexes[k];
				// var n2DA = hashA[index];
				// var n2DB = hashB[index];
				var n3D = hash3[index];
				var mAB = n3D.matchForViews(viewA,viewB);
				if(mAB==match){
					continue;
				}
				var s = mAB.errorSAD();
				var n = mAB.errorNCC();
				var f = mAB.errorF();
				var r = mAB.errorR();
				errorsS.push(s);
				errorsN.push(n);
				errorsF.push(f);
				errorsR.push(r);
			}
			
			// var minN2 = Code.min(errorN2);
			// var meanN2 = Code.mean(errorN2);
			// var sigmaN2 = Code.stdDev(errorN2,minN2);
			// var minN2 = Code.min(errorN2);
			var minN = Code.min(errorsN);
			var minS = Code.min(errorsS);
			var minF = Code.min(errorsF);
			var minR = Code.min(errorsR);
			//
			var meanN = Code.mean(errorsN);
			var meanS = Code.mean(errorsS);
			var meanF = Code.mean(errorsF);
			var meanR = Code.mean(errorsR);
			// 
			var s = match.errorSAD();
			var n = match.errorNCC();
			var f = match.errorF();
			var r = match.errorR();

			// var sigmaN = Code.stdDev(errorsN,meanN);
			// var sigmaS = Code.stdDev(errorsS,meanS);
			// var sigmaF = Code.stdDev(errorsF,meanF);
			// var sigmaR = Code.stdDev(errorsR,meanR);

			var sigmaN = Code.stdDev(errorsN,minN);
			var sigmaS = Code.stdDev(errorsS,minS);
			var sigmaF = Code.stdDev(errorsF,minF);
			var sigmaR = Code.stdDev(errorsR,minR);

			var limitGroupN = meanN + factorErrorLimitLocal*sigmaN;
			var limitGroupS = meanS + factorErrorLimitLocal*sigmaS;
			var limitGroupF = meanF + factorErrorLimitLocal*sigmaF;
			var limitGroupR = meanR + factorErrorLimitLocal*sigmaR;

			// if(meanN>errorTransformLimitN || meanS>errorTransformLimitS || meanF>errorTransformLimitF || meanR>errorTransformLimitR || 
				// n>limitGroupN || s>limitGroupS || f>limitGroupF || r>limitGroupR){
			// if(meanN>errorTransformLimitN || meanS>errorTransformLimitS || meanF>errorTransformLimitF || meanR>errorTransformLimitR){
			if(n>limitGroupN || s>limitGroupS || f>limitGroupF || r>limitGroupR){
				dropMatches.push(match);
			}
			// global ~ ?200
			// local ~ 661
			// both ~ 881

		}

		console.log("DROP COUNT: "+dropMatches.length+" / "+matches.length);

		// DRP THEM NOW
		for(var k=0; k<dropMatches.length; ++k){
			var match = dropMatches[k];
			world.removeMatchFromPoint3D(match);
		}

	}
	console.log("filterNeighborhoodError EXIT");
	// throw "..."
}

// conventional filtering ------------------------------------------------------------


Stereopsis.World.prototype.filterCriteria2DNnot3DN = function(){ // p is removed if the average of inconsistent-neighbor NCC (or SAD) score is much better than
	console.log("filterCriteria2DNnot3DN");
	var world = this;	
	var neighborhoodScale2D = 1.0; // radius muliplier - smaller is more forgiving
	var neighborhoodScale3D = 1.25; // radius muliplier - larger more forgiving space
neighborhoodScale2D = Math.sqrt(2);
neighborhoodScale3D = neighborhoodScale2D * 3.0; // 1.5 - 2.0
// neighborhoodScale3D = 2.0;
	var scoreP2DMultiplier = 0.90; // smaller number is more forgiving - 0.75 - 0.99
	
	var points3D = world.toPointArray();
	var space3D = world.pointSpace();
	var removeListP2D = [];
	// console.log("start size: "+points3D.length);
	var timeStart = Code.getTimeMilliseconds();
	var P3DtoIndex = function(p){
		return p.id();
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
		var points2D = point3D.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];

			var neighbors3D = point2D.neighbors3DCone(world, neighborhoodScale3D);
			// console.log(neighbors3D.length);
			if(!neighbors3D){
				console.log("no neighbors");
				continue;
			}
				var p2D = point2D.point2D();
			var view = point2D.view();
			var cellSize2D = view.cellSize();
			var cellSize3D = point2D.neighborhood3DSize();
				var searchRadius2D = cellSize2D*neighborhoodScale2D;
				var searchRadius3D = cellSize3D*neighborhoodScale3D;
			var space2D = view.pointSpace();
			var neighbors2D = space2D.objectsInsideCircle(p2D, searchRadius2D);
			// var neighbors3D = space3D.objectsInsideSphere(p3D, searchRadius3D);
neighbors3D = Code.toHash(neighbors3D,P3DtoIndex);
			var inconsistent = [];
			for(var k=0; k<neighbors2D.length; ++k){ // TODO: this processes point2D (but correctly doesn't include it)
				var neighbor2D = neighbors2D[k];
				if(neighbor2D==point2D){
					continue;
				}
				var neighbor3D = neighbor2D.point3D();
				if(!neighbors3D[P3DtoIndex(neighbor3D)]){
					// if(neighbor3D.hasView(view)){ // should also be in view too  --- this is always true?
						inconsistent.push(neighbor2D);
					// }
				}
			}
			if(inconsistent.length>0){
				// get average inconsistent score: NCC / SAD
				var scoreInc = 0;
				for(var k=0; k<inconsistent.length; ++k){
					var neighbor2D = inconsistent[k];
					scoreInc += neighbor2D.averageNCCError(); // only matches
				}
				scoreInc /= inconsistent.length;
				// get average P2D NCC / SAD score
				var scoreP2D = point2D.averageNCCError();
				// console.log(scoreInc,scoreP2D);
					scoreP2D = scoreP2D*scoreP2DMultiplier;
				if(scoreInc < scoreP2D){ // this point is worse than the inconsistent (other) group(s) -> remove
					removeListP2D.push(point2D);
				}
			}
			// if(i%1000 === 0){
			// 	console.log(" sizes: "+neighbors2D.length+" | "+Code.keys(neighbors3D).length+" | "+inconsistent.length+" size: "+cellSize3D+" ... ");
			// }
		}
		// if(i>1000){
		// 	throw "???"
		// }
	}
// console.log("removeListP2D: "+removeListP2D.length+" ... / ... "+points3D.length);
// throw "out";
var startSize = points3D.length;
	var removed = 0;
	var kept = 0;
	for(var i=0; i<removeListP2D.length; ++i){
		var point2D = removeListP2D[i];
		var point3D = point2D.point3D();
		if(point3D && point3D.matchCount()>0){ // may be removed more than once
			world.removePoint2DAndMatchesFromPoint3D(point2D);
			++kept;
		}else{
			// console.log("removed already");
			++removed;
		}
	}
	// console.log("kept: "+kept);
	// console.log("removed: "+removed);
var timeEnd = Code.getTimeMilliseconds();
var timeDelta = timeEnd-timeStart;
	// console.log("new size: "+world.toPointArray().length);
console.log("filterCriteria2DNnot3DN "+startSize+" -> "+world.toPointArray().length+" time: "+timeDelta);

// throw "here";
	// TODO: CHECK IF POINT STILL EXISTS?

	/*

TODO:
	for each P3D:
		for each view of P
			get all 2D neighbors of P [minus a little extra]
		get all 3D neighbors of P [plus a little extra]
		save ratio |N3D|/|N2D| (should never be more than 1)

		-> NCC score should somehow also be in this

P3D is an outlier if:
	- inconsistent
	- p is in a few number of images
	- p is has a poor overall NCC score (large)


	perfect ratio = 1.0
	calculate sigma
	drop P3D with value > ~ 2sigma or some minimum (eg 0.25)



	=> opposite way too: if they ARE 3D neighbors but NOT 2D neighbors ?

	*/
}


Stereopsis.World.prototype.filterCriteria2DNnotDepth = function(){ // if visible (depth test) count of images with a good NCC score is low => remove
return;
	/*
	for each P3D:
		behind count = 0
		get all views of P
			get all 2D neighbors of P
			if P is behind neighbor:
				++behind
		score = average of match NCC score of remaining infront view matches
		if the score of the remaining visible views 


		if behind/views.total > 

	2nd filter:
	- for each P3D
		- for each P2D
			- for each 2D neighbor
				- if P3D is behind N3D for any view:
				mark view as not visible
		- if view count <=1
			=> mark P3D for delete

	could get a 

	*/

	var neighborhoodScale2D = 1.0; // radius cell size muliplier
	neighborhoodScale2D = Math.sqrt(2.0); // 1.414
	var error3DScale = 1.0; // % of 3D cell size
	var world = this;
	var points3D = world.toPointArray();
	var space3D = world.pointSpace();
	var removeListP2D = [];
	// console.log("start size: "+points3D.length);
	var timeStart = Code.getTimeMilliseconds();
	var checked = 0;
console.log("filterCriteria2DNnotDepth: "+points3D.length);
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
		var points2D = point3D.toPointArray();
		var visibleViews = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
				var p2D = point2D.point2D();
			var view = point2D.view();
			var viewCenter = view.center();
			var cellSize2D = view.cellSize();
			var cellSize3D = point2D.neighborhood3DSize();
				var searchRadius2D = cellSize2D*neighborhoodScale2D;
			var errorMargin3D = cellSize3D*error3DScale;
			var space2D = view.pointSpace();
			var neighbors2D = space2D.objectsInsideCircle(p2D, searchRadius2D);
			var isVisible = true;
			var distancePoint2D = V3D.distance(p3D,viewCenter);
			//
			++checked;
			//
			for(var k=0; k<neighbors2D.length; ++k){
				var neighbor2D = neighbors2D[k];
				if(neighbor2D==point2D){
					continue;
				}
				var neighbor3D = neighbor2D.point3D();
				var n3D = neighbor3D.point();
				var d2 = V3D.distance(n3D,viewCenter) + errorMargin3D;
				if(distancePoint2D>d2){
					isVisible = false;
					break;
				}
			}
			if(isVisible){
				visibleViews.push(view);
			}
		}
		if(visibleViews.length<=1){ // == 0 ?
			removeListP2D.push(point2D);
		}
		// console.log(removeListP2D);
		// throw "here";
	}
	console.log("checked: "+checked);
	console.log("removeListP2D: "+removeListP2D.length);

	var removed = 0;
	var kept = 0;
	for(var i=0; i<removeListP2D.length; ++i){
		var point2D = removeListP2D[i];
		var point3D = point2D.point3D();
		if(point3D && point3D.matchCount()>0){ // may be removed more than once
			world.removePoint2DAndMatchesFromPoint3D(point2D);
			++kept;
		}else{
			++removed;
		}
	}
	//
	console.log("kept: "+kept);
	console.log("removed: "+removed);
	//
	var timeEnd = Code.getTimeMilliseconds();
	var timeDelta = timeEnd-timeStart;
	console.log("new size: "+world.toPointArray().length);
	console.log("filterCriteria2DNnotDepth time: "+timeDelta);

	// throw "here";
}


Stereopsis.World.prototype.filterCriteria2DN3DNregularization = function(){ // get 2D & 3D neighbors of points & if ratio 3D/2D < 0.25 then P3D is likely in wrong location
	console.log("filterCriteria2DN3DNregularization");
	var minimumRatio2Dto3D = 0.25; // 0.1 - 0.5
	var neighborhoodScale2D = 1.00; // radius mulitplier - smaller is more forgiving
	var neighborhoodScale3D = 1.50; // radius multiplier - larger more forgiving space
	neighborhoodScale2D = Math.sqrt(2);
	neighborhoodScale3D = neighborhoodScale2D * 2.0; // 1.5 - 2.0
	// neighborhoodScale3D = neighborhoodScale2D * 1.5;
	var world = this;
	var points3D = world.toPointArray();
	var space3D = world.pointSpace();
	var removeListP2D = [];
	var P3DtoIndex = function(p){
		return p.id();
	}
	
// console.log("filterCriteria2DN3DNregularization - start size: "+points3D.length);
var timeStart = Code.getTimeMilliseconds();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
		// if(!p3D){
		// 	return;
		// }
		var points2D = point3D.toPointArray();
// TODO: this should get all neighbors in all images at same time?
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
				var p2D = point2D.point2D();
			var view = point2D.view();
			var cellSize2D = view.cellSize();
			var cellSize3D = point2D.neighborhood3DSize();
				var searchRadius2D = cellSize2D*neighborhoodScale2D;
				// var searchRadius3D = cellSize3D*neighborhoodScale3D;
			var space2D = view.pointSpace();
			var neighbors2D = space2D.objectsInsideCircle(p2D, searchRadius2D);
			var neighbors2DCount = neighbors2D.length;
			if(neighbors2DCount>1){
				// var neighbors3D = space3D.objectsInsideSphere(p3D, searchRadius3D);
				var padding3D = neighborhoodScale3D;
				var neighbors3D = point2D.neighbors3DCone(world, padding3D);
				if(neighbors3D){

					neighbors3D = Code.toHash(neighbors3D,P3DtoIndex);

					var foundCount = 0;
					for(var k=0; k<neighbors2DCount; ++k){
						var neighbor2D = neighbors2D[k];
						if(neighbor2D==point2D){
							continue;
						}
						var neighbor3D = neighbor2D.point3D();
						// if(Code.elementExists(neighbors3D,neighbor3D)){ // TODO: faster lookup
						if(neighbors3D[P3DtoIndex(neighbor3D)]){
							++foundCount;
						}
					}

					var percent = foundCount/(neighbors2DCount-1);
					// if(i%1000==0){
					// 	// console.log(neighbors3D);
					// 	console.log(percent+" : "+foundCount+" / "+neighbors2D.length+" - "+neighbors3D.length+" @ "+p3D+" ... ");
					// }
					if(percent<minimumRatio2Dto3D){
						removeListP2D.push(point2D);
					}
				}else{
					console.log("no neighbors");
				}

			}
		}
		// if(i>1000){
		// 	throw "???"
		// }
	}
	//  console.log("removeListP2D: "+removeListP2D.length+" ... / ... "+points3D.length);
	var removed = 0;
var startSize = points3D.length;
	var kept = 0;
	for(var i=0; i<removeListP2D.length; ++i){
		var point2D = removeListP2D[i];
		var point3D = point2D.point3D();
		if(point3D && point3D.matchCount()>0){ // may be removed more than once
			world.removePoint2DAndMatchesFromPoint3D(point2D);
			++kept;
		}else{
			// console.log("removed already");
			++removed;
		}
	}
	// console.log("kept: "+kept);
	// console.log("removed: "+removed);
	var timeEnd = Code.getTimeMilliseconds();
	var timeDelta = timeEnd-timeStart;
		// console.log("new size: "+world.toPointArray().length);
	console.log("filterCriteria2DN3DNregularization: "+startSize+" => "+world.toPointArray().length+" time: "+timeDelta);
}
Stereopsis.World.prototype.generateAllViewNeighborhoodSizes = function(){
	var world = this;
	var points3D = world.toPointArray();
var timeStart = Code.getTimeMilliseconds();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		if(i%10000==0){
			console.log(i+" / "+points3D.length);
		}
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var size3D = point2D.neighborhood3DSize();
			point2D._neighborhood3DSize = size3D;
		}
	}
	var timeEnd = Code.getTimeMilliseconds();
	var timeDelta = timeEnd-timeStart;
	console.log("generateAllViewNeighborhoodSizes: "+timeDelta);

}
Stereopsis.World.neighborhood3DSize = function(view,p2D,p3D, info){
	var Kinv = view.Kinv();
	var cellSize = view.cellSize();
	/*
	var identity = Stereopsis.World._neighborhood3DSize_M4D;
	if(!identity){
		identity = new Matrix(4,4).identity();
		Stereopsis.World._neighborhood3DSize_M4D = identity;
	}
	*/
	var viewCenter = view.center();
	// var absolute = view.absoluteTransform();
	var absolute = view.absoluteTransformInverse();
	// console.log("viewCenter: "+viewCenter);
	var ray3DA = R3D.projectPoint2DToCamera3DRay(p2D, absolute, Kinv, null);
	// console.log("ray3DA: "+ray3DA);
	// console.log(ray3DA);
	var q2D = new V2D(p2D.x-cellSize*0.5,p2D.y); // TODO: more samples
	// var q2D = new V2D(p2D.x+cellSize,p2D.y);
	// var q2D = new V2D(p2D.x,p2D.y+cellSize);
	// console.log("q2D: "+q2D);
	var ray3DB = R3D.projectPoint2DToCamera3DRay(q2D, absolute, Kinv, null);
	var dirA = ray3DA["d"];
	var dirB = ray3DB["d"];
	var angle3D = V3D.angle(dirA,dirB);
	var distanceCP = V3D.distance(p3D,viewCenter);
	var sizeA = 2 * distanceCP * Math.sin(angle3D*0.5);
	var sizeB =  distanceCP * Math.tan(angle3D);

// TODOL do averaging of 3-4 samples

	var size = Math.max(sizeA,sizeB);

	//var ray3D = R3D.projectPoint2DToCamera3DRay(p2D, absolute, Kinv, null);

	// throw "? neighborhood3DSize ";
	var cellSize3D = size*2.0; // size is just radius
	return cellSize3D; 
}

// experimental filtering ------------------------------------------------------------


Stereopsis.World.prototype.filterTransform2D3D = function(sigmaDrop2D,sigmaDrop3D){ // remove sporadically far points from each transform/pair
	// points whos 3D/2D ratio is abnormally large
	// points whos 3D/2D ratio range is abnormally large
	//
	sigmaDrop2D = Code.valueOrDefault(sigmaDrop2D, 3.0);
	sigmaDrop3D = Code.valueOrDefault(sigmaDrop3D, 3.0);

	// sigmaDrop2D = 1.5;
	var world = this;
	console.log("filterTransform2D3D @ "+sigmaDrop2D);
	// get rough approx
	var sampleCountMax = 2000;
	var neighborCountMax = 8+1;
	var transforms = this.toTransformArray();

	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// 	var centerA = new V3D(0,0,0);
		// 	var matrixR = transform.R();
		// 	var centerB = matrixR.multV3DtoV3D(new V3D(0,0,0));
		// console.log(centerA+"=>"+centerB);
		// var centers = [centerA,centerB];
		var views = [viewA,viewB];
		var hasMatchAB = function(a){
			if(a.point3D().matchForViews(viewA,viewB)){
				return true;
			}
			return false;
		}
		var matches = transform.matches(); // these are non-putative matches
		// var samples = Code.randomSampleRepeatsMaximum(matches, sampleCountMax, sampleCountMax);
		// var sampleCount = samples.length;
		var samples = matches;
		var sampleCount = samples.length;
		var datas = [];
		for(var j=0; j<sampleCount; ++j){
			var match = samples[j];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var points = [pointA,pointB];
			var averageViewDistance = 0;
			var averageRatio = 0;
			var averageCount = 0;
			for(var k=0; k<views.length; ++k){
				var view = views[k];
				// var center = centers[k];
				var view3D = view.center();
				var point = points[k];
				var p2D = point.point2D();
				// TODO: SHOULD THIS BE ESTIMATE 2D ?
				var p3D = point.point3D().point();
				// var p3D = match.estimated3D();
				var distanceV3D = V3D.distance(p3D,view3D);
					//averageViewDistance += Math.log(distanceV3D);
					averageViewDistance += distanceV3D;
				var space = view.pointSpace();
				var neighbors = space.kNN(p2D, neighborCountMax, hasMatchAB);
				for(l=0; l<neighbors.length; ++l){
					var neighbor = neighbors[l];
					if(neighbor!==point){
						var n2D = neighbor.point2D();
						var n3D = neighbor.point3D().point();
						// var n3D = neighbor.point3D().matchForViews(viewA,viewB).estimated3D();
						var distance2D = V2D.distance(p2D,n2D);
						var distance3D = V2D.distance(p3D,n3D);
						if(distance2D>0){
							var ratio = distance3D/distance2D;
							averageRatio += Math.log(ratio);
							++averageCount;
						}
					}
				}
			} // each view [2]
			if(averageCount>0){
				averageViewDistance /= 2;
				averageRatio = averageRatio/averageCount;
				var data = averageRatio/averageViewDistance;
				datas.push(data);
				match.temp(data);
			}else{
				match.temp(null);
			}
		} // each match
		datas = Code.randomSampleRepeatsMaximum(datas, sampleCountMax, sampleCountMax);
		// console.log(datas);
		// Code.printMatlabArray(datas);
		var mean = Code.mean(datas);
		var less = [];
		var more = [];
		// drop points less than mean
		for(var d=0; d<datas.length; ++d){
			var data = datas[d];
			if(data<=mean){
				less.push(data);
			}
			if(data>=mean){
				more.push(data);
			}
		}
		var sigmaLess = Code.stdDev(less, mean);
		var sigmaMore = Code.stdDev(more, mean);
		console.log("datas less: "+mean+" + "+sigmaLess);
		console.log("datas more: "+mean+" - "+sigmaMore);
		// datas.sort();
		// var limitMin = -1E99; // TODO ....
		var limitMin = mean - sigmaLess*sigmaDrop2D;
		var limitMax = mean + sigmaMore*sigmaDrop2D;
		console.log(limitMin,limitMax);
		// go thru and delete matches:
		var removeList = [];
		for(var j=0; j<sampleCount; ++j){
			var match = samples[j];
			var temp = match.temp();
			match.temp(null);
			if(temp!==null && (temp<limitMin || temp>limitMax)){
				removeList.push(match);
			}
		}
		console.log("REMOVE COUNT: "+removeList.length);
		for(var j=0; j<removeList.length; ++j){
			var match = removeList[j];
			world.removeMatchFromPoint3D(match);
		}
	} // each transform

	// 3D

	// TODO: FOR NON-PAIRWISE, INDIVIDUAL 3D SPACES NEED TO BE MADE FOR NEIGHBOR-KNN
	// var sigmaDrop3D = 2.0;
	// var sigmaDrop3D = 1.5;
	var neighbors3D = 8+1;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var centerA = viewA.center();
		var centerB = viewB.center();
		var matches = transform.matches();
		var datas = [];
		var space = world._pointSpace;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			var p2DA = match.pointForView(viewA);
			var p2DB = match.pointForView(viewB);
				p2DA = p2DA.point2D();
				p2DB = p2DB.point2D();
			var p3D = point3D.point();
			var depthA = V3D.distance(centerA,p3D);
			var depthB = V3D.distance(centerB,p3D);
			var depth = (depthA+depthB)*0.5;
			var neighbors = space.kNN(p3D, neighbors3D);
			var avgRatio = 0;
			var avgCount = 0;
			// console.log(neighbors.length);
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				if(neighbor==point3D){
					continue;
				}
				var n3D = neighbor.point();
				var d3D = V3D.distance(p3D,n3D);
				var nMatch = neighbor.matchForViews(viewA,viewB);
				var n2DA = nMatch.pointForView(viewA);
				var n2DB = nMatch.pointForView(viewB);
					n2DA = n2DA.point2D();
					n2DB = n2DB.point2D();
				var d2DA = V2D.distance(p2DA,n2DA);
				var d2DB = V2D.distance(p2DB,n2DB);
				var d2D = (d2DA+d2DB)*0.5;
				if(d2D>0){
					var ratio = d3D/d2D;
					avgRatio += ratio;
					++avgCount;
				}
			}
			if(avgCount>0){
				avgRatio /= avgCount;
				var data = avgRatio/depth;
					data = Math.log(data);
				datas.push(data);
				match.temp(data);
			}
		}
		// calculate limits
		var maxDatas = 2000;
		datas = Code.randomSampleRepeatsMaximum(datas, maxDatas, maxDatas);
		// console.log(datas);
		// Code.printMatlabArray(datas);
		var mean = Code.mean(datas);
		var less = [];
		var more = [];
		// drop points less than mean
		for(var d=0; d<datas.length; ++d){
			var data = datas[d];
			if(data<=mean){
				less.push(data);
			}
			if(data>=mean){
				more.push(data);
			}
		}
		var sigmaLess = Code.stdDev(less, mean);
		var sigmaMore = Code.stdDev(more, mean);
		console.log("3D datas less: "+mean+" - "+sigmaLess);
		console.log("3D datas more: "+mean+" + "+sigmaMore);
		var limitMin = mean - sigmaLess*sigmaDrop3D;
		var limitMax = mean + sigmaMore*sigmaDrop3D;
		console.log(limitMin,limitMax);
		// remove worst
		var removeList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var temp = match.temp();
			match.temp(null);
			//if(temp!==null && (temp<limitMin || temp>limitMax)){
			if(temp>limitMax){
				removeList.push(match);
			}
		}
		console.log("REMOVE COUNT: "+removeList.length);
		for(var j=0; j<removeList.length; ++j){
			var match = removeList[j];
			world.removeMatchFromPoint3D(match);
		}
	}
	// ...
}

Stereopsis.World.prototype.filterNeighborConsistency = function(){ // drop 3D outlier noise
	console.log("filterNeighborConsistency");
	var minCountNeighbors = 3;
	var searchCellMultiplier = 1.5; // hyp = 1.414 = 1.5->2.0
	var worstNeighborPercent = 0.3333; // progression: 0.10 => 0.50 : (forgiving) => (strict)
// WAS -.25;
	var world = this;
	var transforms = world.toTransformArray();
	var totalRemovedCount = 0;
	var totalCheckedCount = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var cellSizeA = viewA.cellSize();
		var cellSizeB = viewB.cellSize();
		var searchRadiusA = cellSizeA*searchCellMultiplier;
		var searchRadiusB = cellSizeB*searchCellMultiplier;
		var removeMatchList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var pA = point2DA.point2D();
			var pB = point2DB.point2D();
			var neighborsA = viewA.pointsInCircle(pA,searchRadiusA);
			var neighborsB = viewB.pointsInCircle(pB,searchRadiusB);
			if(neighborsA.length>=minCountNeighbors || neighborsB.length>=minCountNeighbors){
				var common = [];
				for(var iA=0; iA<neighborsA.length; ++iA){
					var p3DA = neighborsA[iA].point3D();
					for(var iB=0; iB<neighborsB.length; ++iB){
						var p3DB = neighborsB[iB].point3D();
						if(p3DA==p3DB){
							common.push(p3DA);
							break;
						}
					}
				}
				var ratioA = neighborsA.length>0 ? common.length/neighborsA.length : 0;
				var ratioB = neighborsB.length>0 ? common.length/neighborsB.length : 0;
				// console.log(" "+common.length+" : "+neighborsA.length+" & "+neighborsB.length+" = "+ratioA+" : "+ratioB);
				if(ratioA<worstNeighborPercent || ratioB<worstNeighborPercent){
					removeMatchList.push(match);
				}
			}
		}
		console.log("REMOVE: "+removeMatchList.length+" / "+matches.length);
		totalCheckedCount += matches.length;
		totalRemovedCount += removeMatchList.length;
		for(var j=0; j<removeMatchList.length; ++j){
			var match = removeMatchList[j];
			world.removeMatchFromPoint3D(match);
		}
	}
	console.log("filterNeighborConsistency total removed: "+totalRemovedCount+" / "+totalCheckedCount+" = "+(totalRemovedCount/totalCheckedCount));
}

Stereopsis.World.prototype.filterLocal2Dto3DSize = function(){ // get 2D neighborhood & compare distances in 3D neighborhood & vote outliers
	console.log("filterLocal2Dto3DSize");
	var neighborCount = 8; // 6-10
	var minimumVotes = 3;
	var minimumDropRatio = 0.50; // resolution = 1/count | 8 = 0.125
// @AS 0.50
	var world = this;
	var points3D = world.toPointArray();
console.log("EXPECTED: "+points3D.length+" & "+world._pointSpace.count()+" &  ? ");
	var views = world.toViewArray();
	// prepare votes
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp({"keep":0, "drop":0});
	}
	// vote for each neighborhood
	for(var i=0; i<views.length; ++i){
		console.log(" ... "+i+" / "+views.length);
		var view = views[i];
		var space = view.pointSpace();
		var points2D = space.toArray();
		for(var j=0; j<points2D.length; ++j){
			var point = points2D[j];
			var neighborhood = space.kNN(point.point2D(), neighborCount);
			// get 3D neighborhood
			var list3D = [];
			for(var k=0; k<neighborhood.length; ++k){
				if(neighborhood[k]==point){
					// DON'T CARE ABOUT SAME ???
				}
				list3D.push(neighborhood[k].point3D().point());
			}
			// get distances & stats
			var center = V3D.average(list3D);
			var distances = [];
			for(var k=0; k<neighborhood.length; ++k){
				distances.push( V3D.distance(center,list3D[k]) );
			}
			// min will be zero
			var min = Code.min(distances);
			var sigma = Code.stdDev(distances,min);
			var limit = min + sigma*2;
			// vote
			for(var k=0; k<neighborhood.length; ++k){
				var distance = distances[k];
				try{
				if(distance<limit){
					neighborhood[k].point3D().temp()["keep"] += 1;
				}else{
					neighborhood[k].point3D().temp()["drop"] += 1;
				}
			}catch{
				console.log(point);
				console.log(point.point3D());


				console.log(k);
				console.log(neighborhood);
				console.log(neighborhood[k]);
				console.log(neighborhood[k].point3D());
				console.log(neighborhood[k].point3D().temp());


				console.log(world.toPointArray().length);

				throw "?";
			}
			}
		}
	}
	// drop worst outliers
	var removedCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var temp = point3D.temp();
			point3D.temp(null);
		var keep = temp["keep"];
		var drop = temp["drop"];
		var total = keep+drop;
		// console.log(i+" : "+keep+" | "+drop+" / "+total);
		if(total>=minimumVotes){
			if(drop/total>=minimumDropRatio){
				world.disconnectPoint3D(point3D);
				world.killPoint3D(point3D);
				++removedCount;
			}
		}
	}
	console.log(" filterLocal2Dto3DSize REMOVED: "+removedCount+" / "+points3D.length);
}
Stereopsis.World.prototype.filterLocal3Dto2DSize_NEW = function(){ // get 3D neighborhood & compare distances in 2D neighborhood & vote outliers
	console.log("filterLocal3Dto2DSize");

// for all p3d
// get neighborhood
// for all neighbors in 3D
// look at any views in point3D & neighbor have in common:
//		get double-sized neighborhood
//		if neightbor is NOT in list mark as drop
//		else mark as keep
//

	return;
}
Stereopsis.World.prototype.filterLocal3Dto2DSize = function(){ // find 3D neighborhood size, in 2D vote one outlier, drop high outlier count
	console.log("filterLocal3Dto2DSize");
// return;

	var world = this;
	var neighborCount = 8; // 6-10
	// limit criteria
	var space3D = world.pointSpace();
	if(space3D.count()<neighborCount){
		return;
	}
	// for each P3D: get local area size
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
		var neighbors3D = space3D.kNN(p3D, neighborCount);
		for(var j=0; j<neighborCount; ++j){
			var neighbor3D = neighbors3D[j];
			var n3D = neighbor3D.point();
			neighbors3D[j] = V3D.distance(p3D,n3D);
		}
		// min == 0
		// var min = Code.min(neighbors3D);
		var min = 0;
		var sig = Code.stdDev(neighbors3D, min);
		point3D.temp({"min":min, "sig":sig, "votes":[]});
	}
	// for each P2D compare sizes -- ones much bigger are outliers
	var views = world.toViewArray();
	var maxSigmaRatio = 2.0;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space2D = view.pointSpace();
		if(space2D.count()<neighborCount){
			return;
		}
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			var p2D = point2D.point2D();
			var sigmaA = point3D.temp()["sig"];
			var neighbors2D = space2D.kNN(p2D, neighborCount);
			for(var n=0; n<neighborCount; ++n){
				var neighbor2D = neighbors2D[n];
				var neighbor3D = neighbor2D.point3D();
				var temp3D = neighbor3D.temp();
				var sigmaB = temp3D["sig"];
				if(sigmaB/sigmaA > maxSigmaRatio){ // drop
					temp3D["votes"].push(1);
				}else{ // keep
					temp3D["votes"].push(0);
				}
			}
		}
	}
	// drop P3D if very likely outlier
	var dropList = [];
	var minimumVotes = 4;
	var maximumPercent = 0.50;
var percents = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var temp = point3D.temp();
		var votes = temp["votes"];
		if(votes.length>=minimumVotes){
			var count = Code.sumArray(votes);
			var percent = count/votes.length;
			// console.log(percent);
percents.push(percent);
			if(percent>maximumPercent){
				dropList.push(point3D);
			}
		}
	}
// Code.printMatlabArray(percents,"percents");
	// clear
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
	// do drop
	console.log("NEIGHBOR SIZE DROPPING: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		point3D = dropList[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "? - filterLocal3Dto2DSize";
}
Stereopsis.World.prototype.filterLocal3Dto2DProjection = function(){ // drop 3D outlier noise - projected 3D points missing may be outliers
	console.log("filterLocal3Dto2DProjection");
// return;

/*
if this gets the outlier --- then most all points will be outside
*/

	var world = this;
	var neighborNN1 = 8;
	var neighborNN2 = 16;
	var transforms = this.toTransformArray();
	var space3D = world.pointSpace()
	// init
	if(space3D.count()<neighborNN2){
		return;
	}
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp({"votes":[]});
	}
	// project
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var viewList = [viewA,viewB];
		var evalFxn3D = function(point3D){
			return point3D.hasView(viewA) && point3D.hasView(viewB);
		}
		if(matches.length<neighborNN2){
			continue;
		}
		for(var k=0; k<matches.length; ++k){
			var match = matches[k];
			var point3D = match.point3D();
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var p3D = point3D.point();
			var neighbors3D = space3D.kNN(p3D, neighborNN2, evalFxn3D, null);
			for(v=0; v<viewList.length; ++v){
				var view = viewList[v];
				var projections2D = [];
				for(n=0; n<neighborNN1; ++n){
					var neighbor = neighbors3D[n];
					var proj2D = view.projectPoint3D(neighbor.point());
					projections2D.push(proj2D);
				}
				var hull = Code.convexHull(projections2D);
				var info = V2D.extremaFromArray(projections2D);
				var min = info["min"];
				var max = info["max"];
				var p2Ds = view.pointSpace().objectsInsideRect(min,max);
				var polyCount = 0;
				var insideCount = 0;
				var outsideCount = 0;
				for(var p=0; p<p2Ds.length; ++p){
					var p2D = p2Ds[p];
					if(Code.isPointInsidePolygon2D(p2D.point2D(),hull)){ // inside projection
						++polyCount;
						var p2D3D = p2D.point3D();
						var votes = p2D3D.temp()["votes"];
						if(Code.elementExists(neighbors3D,p2D3D)){ // inside list
							// insideCount++;
							votes.push(0);
						}else{ // console.log("OBJECT IN POLYGON BUT NOT IN 3D LIST ... OUTLIER");
							// outsideCount++;
							votes.push(1);
						}
					}
				}
				// console.log("poly count: "+polyCount+" ("+p2Ds.length+") "+" : "+insideCount+" / "+outsideCount);
			}
			// if(k>100){
			// 	break;
			// }
			// throw "...";
		}
		// throw "...";
	}
	// throw "..."
	// vote
	// drop P3D if very likely outlier
	var dropList = [];
	var minimumVotes = 4;
	var maximumPercent = 0.50;
var percents = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var temp = point3D.temp();
		var votes = temp["votes"];
		if(votes.length>=minimumVotes){
			var count = Code.sumArray(votes);
			var percent = count/votes.length;
			// console.log(percent);
percents.push(percent);
			if(percent>maximumPercent){
				dropList.push(point3D);
			}
		}
	}
	// clear
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
	// drop
	console.log("NEIGHBOR PROJECTION DROPPING: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		point3D = dropList[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

/*
	n = 8
	for each p3d shared by viewA & viewB
		get 2n NN
		sort on distance
		project all nearest n points3d to view A & view B
		for each p2d inside convex hull of inner:
			if p2d is not included in 2n NN
				add vote for p2d to be dropped
			else
				add vote for p2d to be kept

	get stddev of drop points
		- points with highest count should be dropped

*/
}


Stereopsis.World.prototype.filterLocal3D = function(sigmaDrop){ // this might prioritize points with more 2D neighbors rather than 3D association
// TODO: is there a way to do this per transform in segmented 3D frames?

	sigmaDrop = Code.valueOrDefault(sigmaDrop, 2.0);
	console.log("filterLocal3D @ "+sigmaDrop);
// checks to see if a point is very different than its neighbors:
// centroidal 3D distance
	var points3D = this.toPointArray();
	var views = this.toViewArray();
	var neighborCount = 12; // 8-16
	// var includeSelfPoint = true;
	// var includeSelfPoint = false;
	var invNeighborCount = 1.0/(neighborCount-1);
	var centroid = new V3D();
	var dropList = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var maxRadius = cellSize*2;
		var space = view._pointSpace;
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			// if(!point3D.hasPatch()){
			// 	continue;
			// }
			var p3D = point3D.point();
			var p2D = point2D.point2D();
			var neighbors = space.kNN(p2D, neighborCount, null, maxRadius);
			if(neighbors.length==neighborCount){
				// average distance between neighbors
				centroid.set(0,0,0);
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor!=point2D){
						centroid.add(neighbor.point3D().point());
					}
				}
				centroid.scale(invNeighborCount);
				// var averageNDistance = 0;
				var ds = [];
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor!=point2D){
						var dist = V3D.distance(centroid,neighbor.point3D().point());
						ds.push(dist);
						// averageNDistance += dist;
					}
				}
				averageNDistance *= invNeighborCount;
				var averageNDistance = Code.min(ds);
				var sigmaNDistance = Code.stdDev(ds,averageNDistance);
				var dist = V3D.distance(centroid,p3D);
				var limit = sigmaNDistance*sigmaDrop;
				if(dist>limit){
					// console.log("add drop: "+dist+" / "+limit+" @ "+sigmaNDistance);
					//Code.addUnique(dropList,point2D);
					dropList.push(point2D);
				}
				/*
				var minD = Code.min(d);
				var avgD = Code.mean(d);
				var sigD = Code.stdDev(d, minD); // minD vs avgD
				var point3D = point2D.point3D();
				var p3D = point3D.point();
				var maxPointDistance = avgD + sigD*sigmaDrop; // 3 gets nothing | 2 gets some
				var pointDistance = V3D.distance(p3D,centroid);
				if(pointDistance>maxPointDistance){
					// TODO: DROP POINT2D ONLY, NOT POINT3D ???
					Code.addUnique(dropList,point2D.point3D());
				}
				*/

				// COULD ALSO APPROXIMATE PLANE WITH POINTS & USE DISTANCE FROM PLANE AS CRITERIA
			}
		}
	}
	console.log("local2D dropping: "+dropList.length+" / "+points3D.length+" = "+(dropList.length/points3D.length));
	for(var i=0; i<dropList.length; ++i){
		var point2D = dropList[i];
		// this.removePoint2DFromPoint3D(point2D);
		this.removeP2DFromP3D(point2D);
		// console.log(point2D);
		// throw "?";
		// this.disconnectPoint3D(point3D); // calls removePoint3D
		// this.killPoint3D(point3D);
	}

}
Stereopsis.World.prototype.estimate3DViews = function(){ // get absolution of views/cameras starting at most certain as reference IDENTITY

	throw "this should be determined before this class is used"

	var views = this.toViewArray();
	var viewCount = views.length;
	var pairs = [];
	for(var i=0; i<viewCount; ++i){
		var viewA = views[i];
		for(var j=i+1; j<viewCount; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var vA = transform.viewA();
			var vB = transform.viewB();
			var cameraAtoB = transform.R();
			if(cameraAtoB){
				var errorRMean = transform.rMean();
				var errorRSigma = transform.rSigma();
				var errorAB = errorRMean + 1.0*errorRSigma; // TODO: r error | match count |
				errorAB = 1.0; // ....
				if(vA != viewA){ // reverse
					cameraAtoB = R3D.inverseCameraMatrix(cameraAtoB);
				}
				var absolute = Matrix.inverse(cameraAtoB);
				pairs.push([i,j,absolute,errorAB]);
			}
		}
	}
	// optimized absolute transforms
console.log(pairs);

	// var results = R3D.optimumTransform3DFromRelativePairTransforms(pairs);

	var results = Code.graphAbsoluteFromRelativePose3D(pairs);
	console.log(results);
	throw "??";


	if(!results){
		console.log("unable to find optimal relative pair transforms ...");
	}else{
		// set resulting absolute transforms
		// var absolutes = results["absolute"];

		var absolutes = results["values"];

		for(var i=0; i<views.length; ++i){
			var viewA = views[i];
			var absolute = absolutes[i];
			var extrinsic = Matrix.inverse(absolute);
			viewA.absoluteTransform(extrinsic);
		}
		// relative from new absolute transforms
		this.copyRelativeTransformsFromAbsolute();
	}
}
Stereopsis.World.prototype.estimate3DTransforms = function(){ // nonlinear camera optimization
	var world = this;
	var views = world.toViewArray();
	var P, K;
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		P = viewA.absoluteTransform();
		if(!P){
			throw "absolute transform not yet init";
		}
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			P = viewB.absoluteTransform();
			if(!P){
				throw "absolute transform not yet init";
			}
			var transform = world.transformFromViews(viewA,viewB);
			var matches = transform.matches(); // these are non-putative matches
			if(matches.length<10){
				console.log("MATCHES ONLY: "+matches.length);
				continue;
			}
			// console.log(transform);
			viewA = transform.viewA();
			viewB = transform.viewB();
			var absA = viewA.absoluteTransform();
			var points2DA = [];
			var points2DB = [];
			var points3D = [];
			for(var k=0; k<matches.length; ++k){
				var match = matches[k];
				var point2DA = match.pointForView(viewA);
				var point2DB = match.pointForView(viewB);
				// var point3D = match.point3D();
				// if(point3D){
				var point3D = match.estimated3D(); // relative
				points2DA.push(point2DA.point2D());
				points2DB.push(point2DB.point2D());
					point3D = absA.multV3DtoV3D(point3D);
				points3D.push(point3D);
				// points3D.push(point3D.point());
			}
			var Pa = viewA.absoluteTransform();
			var Pb = viewB.absoluteTransform();
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var Ps = [Pa,Pb];
			var Ks = [Ka,Kb];
			var Is = [KaInv,KbInv];
			var points2D = [points2DA,points2DB];
			var result = R3D.BundleAdjustCameraExtrinsic(Ks, Is, Ps, points2D, points3D, 25);
console.log(result);
throw "IS THIS WHAT YOU REALLY WANT?"

			var extrinsics = result["extrinsics"];
			var absA = extrinsics[0];
			var absB = extrinsics[1];
			var invA = Matrix.inverse(absA);
			// only want changed A to B
			//var relativeAB = R3D.relativeTransformMatrixInvAAbsB(invA,absB);
			// var absoluteB = Matrix.mult(Pa,relativeAtoB);

			throw "ext?"
			throw "abs?"
			viewB.absoluteTransform(absoluteB);

			// update all connected relative transforms
			for(var k=0; k<views.length; ++k){
				var viewX = views[k];
				if(viewX!=viewB){
					var t = world.transformFromViews(viewB,viewX);
					var vA = transform.viewA();
					var vB = transform.viewB();
					var absA = vA.absoluteTransform();
					var absB = vB.absoluteTransform();
					var invA = Matrix.inverse(absA);
					var relativeAtoB = Matrix.mult(invA,absB);
					transform.R(relativeAtoB, viewA,viewB);
				}
			}
			//
		}
	}
}
Stereopsis.World.prototype.sampleErrorsDebug = function(){
	console.log("sampleErrorsDebug");
	var transforms = this.toTransformArray();
	var srt = function(a,b){
		return a<b ? -1 : 1;
	}
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var errorMax = 0;
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var error = match.errorR();;
			errorMax = Math.max(errorMax,error);
		}
		// var samples = 1000;
		// var errors = [];
		// for(var s=0; s<samples; ++s){
		// 	var match = Code.randomSampleArray(matches);
		// 	var error = match.errorR();
		// 	errors.push(error);
		// }
		// errors.sort(srt);
		// Code.printMatlabArray(errors,"t"+i);
		console.log(i+"   errorMax: "+errorMax);
	}

}
Stereopsis.World.prototype.estimatePairwiseErrors = function(){
	// throw "should this all just be global ?"
	var maxCountErrorR = 500;
	var maxCountErrorF = 500;
	var maxCountErrorN = 500;
	var maxCountErrorS = 500;

	var minCountMatches = 16;
	var transforms = this.toTransformArray();
	// }
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var FFwd = transform.F(viewA,viewB);
		var FRev = transform.F(viewB,viewA);
		if(matches.length<minCountMatches || !FFwd || !FRev){
			transform.rMean(null);
			transform.rSigma(null);
			transform.fMean(null);
			transform.fSigma(null);
			transform.nccMean(null);
			transform.nccSigma(null);
			transform.sadMean(null);
			transform.sadSigma(null);
			continue;
		}
		

if(!FFwd || !FRev){
	console.log(viewA);
	console.log(viewB);
	console.log(transform);
	console.log(FFwd);
	console.log(FRev);
	throw "no ff";
}

		
		var errorsR = [];
		var errorsF = [];
		var errorsN = [];
		var errorsS = [];
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var pA = pointA.point2D();
			var pB = pointB.point2D();
			var errorF = R3D.fErrorReuse(FFwd, FRev, pA, pB);
			match.errorF(errorF);
			errorsF.push(errorF);


			var point3D = match.point3D();
			var errorR = point3D.globalErrorR();
			// match.errorR(errorR);
			errorsR.push(errorR);

			// image required:
			var affineAB = match.affineForViews(viewA,viewB);
			Stereopsis.setMatchInfoFromParamerers(match, viewA,pA, viewB,pB, affineAB);
			var scoreN = match.errorNCC();
			var scoreS = match.errorSAD();
			if(scoreN!==null && scoreS!==null){
				errorsN.push(scoreN);
				errorsS.push(scoreS);
			}
		}
		// summary statistics
		if(errorsR.length==0){
			transform.rMean(0);
			transform.rSigma(0);
		}else{
			if(errorsR.length>maxCountErrorR){
				Code.randomPopArray(errorsR, maxCountErrorR);
			}
			var rMean = Code.mean(errorsR);
			var rMin = Code.min(errorsR);
			var rSigma = Code.stdDev(errorsR, rMin);
			transform.rMean(rMean);
			transform.rSigma(rSigma);
			// console.log(rMean,rSigma);
		}
		// summary statistics
		if(errorsF.length==0){
			transform.fMean(0);
			transform.fSigma(0);
		}else{
			if(errorsF.length>maxCountErrorF){
				Code.randomPopArray(errorsF, maxCountErrorF);
			}
			var fMean = Code.mean(errorsF);
			var fMin = Code.min(errorsF);
			var fSigma = Code.stdDev(errorsF, fMin);
			transform.fMean(fMean);
			transform.fSigma(fSigma);
			// console.log(fMean,fSigma);
		}
		// summary statistics
		if(errorsS.length==0){
			transform.sadMean(0);
			transform.sadSigma(0);
		}else{
			if(errorsS.length>maxCountErrorS){
				Code.randomPopArray(errorsS, maxCountErrorS);
			}
			var sMean = Code.mean(errorsS);
			var sMin = Code.min(errorsS);
			var sSigma = Code.stdDev(errorsS, sMin);
			transform.sadMean(sMean);
			transform.sadSigma(sSigma);
			// console.log(sMean,sSigma);
		}
		// summary statistics
		if(errorsN.length==0){
			transform.nccMean(0);
			transform.nccSigma(0);
		}else{
			if(errorsN.length>maxCountErrorN){
				Code.randomPopArray(errorsN, maxCountErrorN);
			}
			var nMean = Code.mean(errorsN);
			var nMin = Code.min(errorsN);
			var nSigma = Code.stdDev(errorsN, nMin);
			transform.nccMean(nMean);
			transform.nccSigma(nSigma);
			// console.log(nMean,nSigma);
		}
	}
}
Stereopsis.World.prototype.initNewPointPatch3D = function(point3D,doInsert){ // totally new, calculate all from scratch
	doInsert = Code.valueOrDefault(doInsert, true);
	var world = this;
	var location3D = point3D.globalPoint3DLinear();
	if(doInsert){
		world.updatePoint3DLocation(point3D,location3D);
	}else{
		point3D.point(location3D);
	}
	var errorR = point3D.globalPoint3DReprojectionError();
	point3D.globalErrorR(errorR);
		// world.updatePoint3DLocation(point3D,location3D);
	world.initPoint3DPatchSphere(point3D);
	world.initPoint3DAffineFromPatch(point3D);
	world.updatePoint3DPatchNormalFromImages(point3D);
	world.initPoint3DAffineFromPatch(point3D);
}

Stereopsis.World.prototype.estimateGlobalErrors = function(){
	var world = this;
	// for F: 3D point transformed by inverse of transform view A absolute
	var points3D = world.toPointArray();
	var views = world.toViewArray();
	var maximumCountPoint3D = 500;

	// each P3D needs to estimate R
	for(var i=0; i<points3D.length; ++i){
		point3D = points3D[i];
		// var errorR = point3D.globalPoint3DReprojectionError();
		var errorR = point3D.globalErrorR(); // don't need to recalculate
		point3D.globalErrorR(errorR);
	}

	// each pair needs to estimate F & N & S [& R?]
	world.estimatePairwiseErrors();

	// random sample to estimate popuplation: .................................
	if(points3D.length>maximumCountPoint3D){
		Code.randomPopArray(points3D, maximumCountPoint3D);
	}
	errorsR = [];
	errorsF = [];
	errorsS = [];
	errorsN = [];
	for(var i=0; i<points3D.length; ++i){
		point3D = points3D[i];
		// var errorR = point3D.globalPoint3DReprojectionError();
		var errorR = point3D.globalErrorR();
		var errorF = point3D.averageFError();
		var errorN = point3D.averageNCCError();
		var errorS = point3D.averageSADError();
		if(!point3D.isValid()){
			console.log(points3D);
			console.log(i);
			console.log(point3D);
			throw "point not valid";
		}
		if(errorR!==undefined){
			errorsR.push(errorR);
		}
		errorsF.push(errorF);
		// TODO: if image is mssing: errors N & S wont exist (0) & skew results
		if(errorN){
			errorsN.push(errorN);
		}
		if(errorS){
			errorsS.push(errorS);
		}
	}
	// summary statistics
// console.log("errorsR length: "+errorsR.length);
// console.log(errorsR);
	var rMean = Code.mean(errorsR);
	var rMin = Code.min(errorsR);
	var rSigma = Code.stdDev(errorsR, rMin);
	// console.log(rMean,rSigma);

if(Code.isNaN(rSigma)){
	console.log(points3D);
	console.log(errorsR);
	console.log(rMin);
	console.log(rMean);
	console.log(rSigma);
	throw " why NaN";
}

	var fMean = Code.mean(errorsF);
	var fMin = Code.min(errorsF);
	var fSigma = Code.stdDev(errorsF, fMin);
	// console.log(rMean,rSigma);

	var nMean = Code.mean(errorsN);
	var nMin = Code.min(errorsN);
	var nSigma = Code.stdDev(errorsN, nMin);
	// console.log(nMean,nSigma);

	var sMean = Code.mean(errorsS);
	var sMin = Code.min(errorsS);
	var sSigma = Code.stdDev(errorsS, sMin);
	// console.log(sMean,sSigma);

	world._globalErrorRMean = rMean;
	world._globalErrorRSigma = rSigma;

	world._globalErrorFMean = fMean;
	world._globalErrorFSigma = fSigma;

	world._globalErrorSMean = sMean;
	world._globalErrorSSigma = sSigma;

	world._globalErrorNMean = nMean;
	world._globalErrorNSigma = nSigma;


	console.log("GLOBAL ERRORS: ");
	console.log("               R: "+world.globalErrorRMean()+" +/- "+world.globalErrorRSigma()+" ... ");
	console.log("               F: "+world.globalErrorFMean()+" +/- "+world.globalErrorFSigma()+" ... ");
	console.log("               N: "+world.globalErrorNMean()+" +/- "+world.globalErrorNSigma()+" ... ");
	console.log("               S: "+world.globalErrorSMean()+" +/- "+world.globalErrorSSigma()+" ... ");
}
Stereopsis.World.prototype.globalErrorRMean = function(){
	return this._globalErrorRMean;
}
Stereopsis.World.prototype.globalErrorRSigma = function(){
	return this._globalErrorRSigma;
}
Stereopsis.World.prototype.globalErrorFMean = function(){
	return this._globalErrorFMean;
}
Stereopsis.World.prototype.globalErrorFSigma = function(){
	return this._globalErrorFSigma;
}
Stereopsis.World.prototype.globalErrorNMean = function(){
	return this._globalErrorNMean;
}
Stereopsis.World.prototype.globalErrorNSigma = function(){
	return this._globalErrorNSigma;
}
Stereopsis.World.prototype.globalErrorSMean = function(){
	return this._globalErrorSMean;
}
Stereopsis.World.prototype.globalErrorSSigma = function(){
	return this._globalErrorSSigma;
}



Stereopsis.World.prototype.estimateRForTransform = function(transform){
	console.log(transform);
	var matches = transform.matches();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	// var info = Stereopsis.ransacTransformF(transform);
	// ???	// var info = Stereopsis.ransacTransformF(transform,null,true, true);
	var P = Stereopsis.ransacTransformR(transform);
	if(P){
		transform.R(viewA,viewB, P);
		return true;
	}else{
		//
	}
	// F = info["F"];
	// P = info["P"];
	return false;
}



GOLBAL_WORLD = null;
Stereopsis.World.prototype.estimate3DErrors = function(skipCalc, shouldLog){ // triangulate locations for matches (P3D) & get errors from this
	console.log("todo: phase out");
	throw "..."
	// TRANSFORMS
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches(); // these are non-putative matches
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// get best orientations
		var F = null;
		var P = null;
		if(skipCalc){
			F = transform.F(viewA,viewB);
			P = transform.R(viewA,viewB);
		}else{
			var info = Stereopsis.ransacTransformF(transform);
			F = info["F"];
			P = info["P"];
		}
		if(F){
			transform.F(viewA,viewB,F);
			transform.calculateErrorF();
		}
		if(P){
			transform.R(viewA,viewB,P);
			transform.relativeEstimatePoints3D();
			transform.calculateErrorR();
		}
		if(F){ // M
			console.log("do calculateErrorM");
			transform.calculateErrorM();
		}
		console.log("      matches: "+transform.matches().length+"           :  "+viewA.id()+" - "+viewB.id());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  N : "+transform.nccMean()+" +/- "+transform.nccSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  S : "+transform.sadMean()+" +/- "+transform.sadSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  F : "+transform.fMean()+" +/- "+transform.fSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  R : "+transform.rMean()+" +/- "+transform.rSigma());
	}

// ?


// this should already be done by above loop ^ 

	// MATCHES
	for(var j=0; j<transforms.length; ++j){
		var transform = transforms[j];
		var matches = transform.matches();
var errorN2 = [];
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			Stereopsis.updateErrorForMatch(match);
var errorN = match.errorNCC();
errorN2.push(errorN);
		}
var minN2 = Code.min(errorN2);
var meanN2 = Code.mean(errorN2);
var sigmaN2 = Code.stdDev(errorN2,minN2);
// console.log("N CNT: "+errorN2.length);
// console.log("N MIN: "+minN2);
// console.log("N MEA: "+meanN2);
// console.log("N S_A: "+sigmaN2);
	sigmaN2 = Code.stdDev(errorN2,meanN2);
// console.log("N S_B: "+sigmaN2);
	}
	// VIEWS
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		var errorN = [];
		var errorS = [];
		var errorF = [];
		var errorR = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			// point2D = point2D.point3D();
			var n = point2D.averageNCCError();
			var s = point2D.averageSADError();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			errorN.push(n);
			errorS.push(s);
			errorF.push(f);
			errorR.push(r);
		}
		// TODO: if large numbers, subsample ?
			var nMin = Code.min(errorN);
		var nMean = Code.mean(errorN);
		var nSigma = Code.stdDev(errorN, nMin);
			var sMin = Code.min(errorS);
		var sMean = Code.mean(errorS);
		var sSigma = Code.stdDev(errorS, sMin);
			var fMin = Code.min(errorF);
		var fMean = Code.mean(errorF);
		var fSigma = Code.stdDev(errorF, fMin);
			var rMin = Code.min(errorR);
		var rMean = Code.mean(errorR);
		var rSigma = Code.stdDev(errorR, rMin);
		view.nccMean(nMean);
		view.nccSigma(nSigma);
		view.sadMean(sMean);
		view.sadSigma(sSigma);
		view.fMin(fMin);
		view.fMean(fMean);
		view.fSigma(fSigma);
		view.rMin(rMin);
		view.rMean(rMean);
		view.rSigma(rSigma);
		console.log(".       points: "+points2D.length+"       "+view.id()+" "+view.data()+" ");
		console.log(" V S mean: "+view.sadMean()+" sig: "+view.sadSigma());
		console.log(" V N mean: "+view.nccMean()+" sig: "+view.nccSigma());
		console.log(" V F mean: "+view.fMean()+" sig: "+view.fSigma());
		console.log(" V R mean: "+view.rMean()+" sig: "+view.rSigma()); // view.rMin()+
	}


// shouldLog = true;
shouldLog = false;
if(shouldLog){
	var points3D = this.toPointArray();



	// 3D ERRORS
	var errors3D = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var reprojectionError = point3D.totalReprojectionError();
		errors3D.push(reprojectionError);
	}
	Code.printMatlabArray(errors3D,"errors3D");

	// PRINT OUT POINT ERRORS
	var info = [];

	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var location = point3D.point();
		if(!location){
			continue;
		}
		var views = point3D.toViewArray();
		var errorR = point3D.averageRError();
		var errorF = point3D.averageFError();
		var distance = 0;
		var vCount = 0;
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var center = view.center();
			if(center){
				var dist = V3D.distance(location,center);
				distance += dist;
				++vCount;
			}
		}
		if(vCount>0){
			distance /= vCount;
		}else{
			continue;
		}
		info.push([distance, errorR, errorF]);
	}
	info.sort(function(a,b){
		return a[0]<b[0] ? -1 : 1;
	});
	var distances = [];
	var errorsR = [];
	var errorsF = [];
	for(var i=0; i<info.length; ++i){
		distances.push(info[i][0]);
		errorsR.push(info[i][1]);
		errorsF.push(info[i][2]);
	}


// errorsR.sort();
// if(true){
// if(false){
// if(skipCalc){
// if(!skipCalc){
	// Code.printMatlabArray(distances,"distances");
	Code.printMatlabArray(errorsR,"errorsR");
	// Code.printMatlabArray(errorsF,"errorsF");
}
}

Stereopsis.updateErrorForNullMatches = function(points){
	if(!points){
		points = this.toPointArray();
	}
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var matches = point.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			if(!match.estimated3D()){
				Stereopsis.updateErrorForMatch(match);
			}
		}
	}
}
Stereopsis.setErrorForMatch = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var pointA = match.point2DA();
	var pointB = match.point2DB();
	var affineAB = match.affineForViews(viewA,viewB);
	var pA = pointA.point2D();
	var pB = pointB.point2D();
	// F + 
	var transform = match.transform();
	var FFwd = transform.F(viewA,viewB);
	var FRev = transform.F(viewB,viewA);
	var errorF = R3D.fErrorReuse(FFwd, FRev, pA, pB);
	match.errorF(errorF);
	// N + S
	Stereopsis.setMatchInfoFromParamerers(match, viewA,pA, viewB,pB, affineAB);
	// R
	// var point3D = match.point3D();
	// var errorR = point3D.globalPoint3DReprojectionError();
	// point3D.globalErrorR(errorR);

	/*
	var transform = match.transform();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var pointA = match.pointForView(viewA);
	var pointB = match.pointForView(viewB);
	var Ffwd = transform.F(viewA,viewB);
	var Frev = transform.F(viewB,viewA);
	var pA = pointA.point2D();
	var pB = pointB.point2D();


	if(Code.isNaN(pA.x) || Code.isNaN(pA.y) || Code.isNaN(pB.x) || Code.isNaN(pB.y)){
		console.log(match);
		console.log(pA);
		console.log(pB);
		throw "why point";
	}
	// F
	if(Ffwd && Frev){
		var info = R3D.fError(Ffwd, Frev, pA, pB);
		fError = info ? info["error"] : null;
		match.errorF(fError);
	}
	// R
	if(!Stereopsis._M4Identity){
		Stereopsis._M4Identity = new Matrix(4,4).identity();
	}
	var cameraA = Stereopsis._M4Identity;
	var cameraB = transform.R(viewA,viewB);
// EQUIVALENT ...
// console.log("CAMERA B: \n "+cameraB);
// var extA = viewA.absoluteTransform();
// var extB = viewB.absoluteTransform();
// var invA = Matrix.inverse(extA);
// var extAB = Matrix.mult(invA,extB);
// console.log("CAMERA AB: \n "+extAB);
// console.log("... \n");
	if(cameraA && cameraB){
		var Ka = viewA.K();
		var Kb = viewB.K();
		var KaInv = viewA.Kinv();
		var KbInv = viewB.Kinv();
		try{
			var location3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		}catch(e){
			console.log(pA);
			console.log(pB);
			console.log(cameraA);
			console.log(cameraB);
			console.log(KaInv);
			console.log(KbInv);
			throw "why";
		}
		if(location3D){ // estimated3D may need updating?
			match.estimated3D(location3D); // relative
			var info = R3D.reprojectionError(location3D, pA,pB, cameraA, cameraB, Ka, Kb);
			var rError = info ? info["error"] : null;
// console.log("reprojection error: "+rError)
			match.errorR(rError);
		}
	}
	*/
}

Stereopsis.bestPointsSet = function(transform, maximumSamples, skipP){ 

}
Stereopsis.checkPoints3D = function(extrinsicA,extrinsicB, KaInv,KbInv, pointsA,pointsB){
	var points3D = [];
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var point3D = R3D.triangulatePointDLT(pointA,pointB, extrinsicA,extrinsicB, KaInv, KbInv);
		if(point3D != null){
			points3D.push(point3D);
		}
	}
	return points3D;
}
Stereopsis.checkPointsLocation = function(extrinsicA, extrinsicB, KaInv,KbInv, pointsA,pointsB){
	// console.log("Stereopsis.checkPointsLocation");

	var absA = Matrix.inverse(extrinsicA);
	var absB = Matrix.inverse(extrinsicB);

	var points3D = Stereopsis.checkPoints3D(extrinsicA,extrinsicB, KaInv,KbInv, pointsA,pointsB);
	// console.log(points3D);
	if(points3D.length==0){
		return 0;
	}

	// var centerA = absA.multV3DtoV3D(new V3D(0,0,0));
	// var centerB = absB.multV3DtoV3D(new V3D(0,0,0));
	// var distanceAB = V3D.distance(centerA,centerB);

	var inFront = 0;
	var inBack = 0;
	// ???
	var locationA = absA.multV3DtoV3D(new V3D(0,0,0));
	var directionA = absA.multV3DtoV3D(new V3D(0,0,1)).sub(locationA);

	var locationB = absB.multV3DtoV3D(new V3D(0,0,0));
	var directionB = absB.multV3DtoV3D(new V3D(0,0,1)).sub(locationB);

	var distanceAB = V3D.distance(locationA,locationB);

	

	var averageDistance = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D || !locationA || !locationB){
			console.log(point3D);
			console.log(locationA);
			console.log(locationB);
			console.log(distanceAB);
			throw "no point?"
		}
		var relativeA = V3D.sub(point3D,locationA);
		var dotA = V3D.dot(relativeA,directionA);

		var relativeB = V3D.sub(point3D,locationB);
		var dotB = V3D.dot(relativeB,directionB);


		averageDistance += (relativeA.length() + relativeB.length())*0.5;

		if(dotB<=0 || dotA<=0){
			++inBack;
		}else{
			++inFront;
		}

	}
	averageDistance /= points3D.length;

	console.log("checkPointsLocation: FRONT: "+inFront+" | BACK: "+inBack+" / "+points3D.length+" = "+(inFront/points3D.length)+" & "+(inBack/points3D.length));
	console.log("CAM DISTANCE: "+distanceAB+" POINT DISTANCE: "+averageDistance+" = DISPARITY: "+(averageDistance/distanceAB));

	var percentInFront = 0;
	if(points3D.length>0){
		percentInFront = (inFront/points3D.length);
	}
	return percentInFront;
}

Stereopsis.ransacTransformR = function(transform){
	var maximumSamples = 500;
	var minimumSamples = 20;
	console.log(transform);
	var info = transform.toPointArray();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var F = transform.F(viewA,viewB);
	console.log(F);
	if(!F){
		throw "F was not available";
		return null;
	}
	var info = transform.toPointArray();
	var points3D = info["points3D"]
	var pointsA = info["pointsA"];
	var pointsB = info["pointsB"];
	if(points3D.length<minimumSamples){
		throw "not enough points";
		return null;
	}

	if(points3D.length>maximumSamples){
		// console.log("NEED TO DO SOME SUBSET OF SAMPLES: "+points3D.length+"/"+maximumSamples);
		var intervals = Code.randomIndexes(maximumSamples, points3D.length);
		// TODO: do random pop
		var p3D = [];
		var pA = [];
		var pB = [];
		for(var i=0; i<intervals.length;++i){
			var index = intervals[i];
			p3D[i] = points3D[index];
			pA[i] = pointsA[index];
			pB[i] = pointsB[index];
		}
		points3D = p3D;
		pointsA = pA;
		pointsB = pB;
	}
	var bestPointsA = pointsA;
	var bestPointsB = pointsB;

	var Ka = viewA.K();
	var Kb = viewB.K();
	if(!Ka || !Kb){
		console.log("no Ks");
		return null;
	}

	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	var force = true;
	console.log("transformFromFundamental");
	P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
	console.log(P);

	if(!P){
		console.log("no P = try again ?");
		// throw "..."
		return null;
	}

	var A = new Matrix(4,4).identity();
	var B = P;

	var centerB = B.multV3DtoV3D(new V3D(0,0,0));
	var normalB = B.multV3DtoV3D(new V3D(0,0,1));
		normalB.sub(centerB);
		var angle = V3D.angle(V3D.DIRZ, normalB);
	console.log("P ANGLE: "+Code.degrees(angle));
	console.log("LINEAR P: ");
	var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
	console.log("%1: "+percentInFront);
	var minPercentInFront = 0.5;
	// var minPercentInFront = 0.75;
	if(percentInFront<minPercentInFront){ // try F again
		console.log("not enough in front 1 "+percentInFront);
		return null;
	}

	// console.log("nonlinear P : "+bestPointsA.length);
	// var centerB = B.multV3DtoV3D(new V3D(0,0,0));
	// var normalB = B.multV3DtoV3D(new V3D(0,0,1));
	// 	normalB.sub(centerB);
	// 	var angle = V3D.angle(V3D.DIRZ, normalB);
	// console.log("P ANGLE: "+Code.degrees(angle));
	// var testPointsA = bestPointsA;
	// var testPointsB = bestPointsB;
	// if(testPointsA.length>maximumSamplesNonlinearP){
	// 	Code.randomPopParallelArrays([testPointsA,testPointsB],maximumSamplesNonlinearP);
	// }
	var maxIterationsSingleCameraNonlinearP = 500;
	var result = R3D.transformCameraExtrinsicNonlinear(P, bestPointsA, bestPointsB, Ka,KaInv, Kb,KbInv, maxIterationsSingleCameraNonlinearP, true);
	console.log(result);
	P = result["P"];
	console.log("NONLINEAR P: ");
	var A = new Matrix(4,4).identity();
	var B = P;
	var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
	console.log("%: "+percentInFront);
	if(percentInFront<minPercentInFront){ // try F again
		console.log("not enough in front 2 "+percentInFront);
		return null;
	}
	return P;
}








Stereopsis.ransacTransformF = function(transform, maximumSamples, skipP, onlyBest){ // F & P
	skipP = skipP!==undefined && skipP!==null ? skipP : false;
	maximumSamples = maximumSamples!==undefined && maximumSamples!==null ? maximumSamples : 500; // 200~1000
	var maximumSamplesNonlinearP = 500; // 200-500
	var maxIterationsSingleCameraNonlinearP = 500; // 1000?
	onlyBest = onlyBest!==undefined && onlyBest!==null ? onlyBest : false;
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var minimumRansacMatchPercent = 0.5;
	var minimumRansacMatchCount = 24;
	var minimumRansacCountF = 24;
	var minimum3PointCount = 50;
	var minimumErrorPointCount = 80;
		var minimumRansacCountF = 99924;
		var minimum3PointCount = 99950;
		var minimumErrorPointCount = 99980;

	// BEST POINT LIST WAS BIASING ERROR APPROXIMATION

	// var info = transform.toPointArray();
	// var info = null;
	// if(notBest){
	// 	info = transform.toPointArray();
	// }else{
	// 	info = transform.toBestPointArray(0.75,0.75,0.5,0.5, 0.5); // care more about N & S & C -- 14%
	// }

	var info = transform.toPointArray();


	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var points3D = info["points3D"]
	var pointsA = info["pointsA"];
	var pointsB = info["pointsB"];
	if(points3D.length>maximumSamples){
		// console.log("NEED TO DO SOME SUBSET OF SAMPLES: "+points3D.length+"/"+maximumSamples);
		var intervals = Code.randomIndexes(maximumSamples, points3D.length);
		// TODO: do random pop
		var p3D = [];
		var pA = [];
		var pB = [];
		for(var i=0; i<intervals.length;++i){
			var index = intervals[i];
			p3D[i] = points3D[index];
			pA[i] = pointsA[index];
			pB[i] = pointsB[index];
		}
		points3D = p3D;
		pointsA = pA;
		pointsB = pB;
	}
	var F = null;
	var P = null;
	console.log("CALCULATE F -> P : "+pointsA.length+" points");
	if(points3D.length>minimumTransformMatchCountF){
		// get initial F
		// console.log("   INITIAL F : "+F);
		var maxPointsF = 200;
		var info = R3D.fundamentalFromUnnormalizedMaxCheck(pointsA,pointsB, maxPointsF);
		var F = info["F"];
		// console.log("   RESULTING F : "+F);
		var bestPointsA = pointsA;
		var bestPointsB = pointsB;
		if(!skipP && bestPointsA.length>minimumTransformMatchCountR){
			throw "use ransacTransformR"
			var Ka = viewA.K();
			var Kb = viewB.K();
			if(Ka && Kb){
				var KaInv = viewA.Kinv();
				var KbInv = viewB.Kinv();
				var force = true;
				console.log("transformFromFundamental");
				P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
					
				var A = new Matrix(4,4).identity();
				var B = P;


				var centerB = B.multV3DtoV3D(new V3D(0,0,0));
				var normalB = B.multV3DtoV3D(new V3D(0,0,1));
					normalB.sub(centerB);
					var angle = V3D.angle(V3D.DIRZ, normalB);
				console.log("P ANGLE: "+Code.degrees(angle));


				console.log("LINEAR P: ");
				var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
				console.log("%1: "+percentInFront);
				// var minPercentInFront = 0.5;
				var minPercentInFront = 0.75;
				if(percentInFront<minPercentInFront){ // try F again
					console.log("try F again 0 ")
					// var errorPosition = 2.0;
					var errorPosition = 1.0;
					// var errorPosition = 0.50; // only top %
					var info = R3D.fundamentalRANSACFromPoints(bestPointsA,bestPointsB, errorPosition, null, 0.66, 0.999); // 0.99, 0.999
					// 0.50 ok, 0.75 slow, 0.90 slow, 0.99 too slow
					console.log("RANSAC RESULTS:");
					console.log(info);
					F = info["F"];
					var m = info["matches"]
					bestPointsA = m[0];
					bestPointsB = m[1];
					P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
					// var info = R3D.FRansac;
					// TODO: SHOULD TRY RANSAC ?
					A = new Matrix(4,4).identity();
					B = P;
					console.log("LINEAR P (2): ");
					var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
					console.log("%2: "+percentInFront);
				}



				if(!P){
					console.log("try again ?");
					throw "..."
					// P = R3D.transformFromFundamental(bestPointsB, bestPointsA, Matrix.inverse(F), Kb,KbInv, Ka,KaInv, null, force, true);
					// P = R3D.inverseCameraMatrix(P);
				}
				// incorrect points may distort this ?
				// if(false && P){





// R3D.showRelativeCameras(A,B, KaInv,KbInv, bestPointsA,bestPointsB, 0);


// if(GOLBAL_WORLD){
// var world = GOLBAL_WORLD;
// var str = world.toYAMLString();
// console.log(str);
// console.log("yo");
// }

				// if(false && P){
				if(P){
					console.log("nonlinear P : "+bestPointsA.length);
					// WAS:
					// var result = R3D.transformCameraExtrinsicNonlinear(P, bestPointsA, bestPointsB, Ka,KaInv, Kb,KbInv);x
					// UPDATE? :
					var centerB = B.multV3DtoV3D(new V3D(0,0,0));
					var normalB = B.multV3DtoV3D(new V3D(0,0,1));
						normalB.sub(centerB);
						var angle = V3D.angle(V3D.DIRZ, normalB);
					console.log("P ANGLE: "+Code.degrees(angle));

// R3D.showRelativeCameras(A,B, KaInv,KbInv, bestPointsA,bestPointsB, 1000);

/*
// var sphere = Tri3D.generateTetrahedraSphere(radius, subdivisions, offset, invertNormals);

var radius = 1.0;
var subdivisions = 2; // 32-100 : 2 = 32 |  3 = 64 |  4 = ? | 5 = 152 | 6 = ?
var offset = new V3D(0,0,0);
var sphere = Tri3D.generateTetrahedraSpherePoints(radius, subdivisions, offset);
var points = sphere["points"];
console.log(points);
var A = new Matrix(4,4).identity();
var B = new Matrix(4,4).identity();
var scores = [];
var Bs = [];
var counts = [];
var bestScore = null;
var bestIndex = null;
var bestPointListA = null;
for(var i=0; i<points.length; ++i){
	var point = points[i];
	// new
	B = new Matrix(4,4).identity();
	B = Matrix.transform3DTranslate(B, point);
	// console.log(B+"");
	// var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
	// scores.push(percentInFront);
	var points3D = [];
	// var point3D = R3D.triangulatePointDLTList(points2D, extrinsics, invKs);
	var totalError = 0;
	var pointListA = [];
	var pointListB = [];
	for(var j=0; j<bestPointsA.length; ++j){
		var pA = bestPointsA[j];
		var pB = bestPointsB[j];
		var p3D = R3D.triangulatePointDLT(pA,pB, A,B, KaInv, KbInv);
		//
		var v3DA = A.multV3DtoV3D(p3D);
		var p3DA = Ka.multV3DtoV3D(v3DA);
		var v3DB = B.multV3DtoV3D(p3D);
		var p3DB = Kb.multV3DtoV3D(v3DB);
		// 
		p3DA.homo();
		p3DB.homo();
		var distanceSquareA = V2D.distanceSquare(pA, p3DA);
		var distanceSquareB = V2D.distanceSquare(pB, p3DB);
		var error = distanceSquareA + distanceSquareB;
		// 
		if(v3DA.z<=0 || v3DB.z<=0){
			// console.log("behind");
			continue;
		}
		pointListA.push(pA);
		pointListB.push(pB);
		points3D.push(p3D);
		totalError += error;
	}
	if(points3D.length>8){
		var score = totalError/points3D.length;
		// var error = R3D.reprojectionErrorList(points3D, pointsA, pointsB, M1,M2, Ka,Kb);
		// var reprojectionError = R3D.reprojectionError(estimated3D, pA,pB, extrinsicA, extrinsicB, Ka, Kb);
		scores.push(percentInFront);
		Bs.push(B);
		counts.push(points3D.length);
		if(bestScore===null || score<bestScore){
			bestScore = score;
			bestIndex = Bs.length-1;
			bestPointListA = pointListA;
			bestPointListB = pointListB;
		}
	}
}
console.log(Bs);
console.log(scores);
console.log(counts);
console.log(bestScore);
console.log(bestIndex);
console.log(counts[bestIndex]);

P = Bs[bestIndex];
console.log(P+"");


// grab only NEW BEST POINTS
bestPointsA = bestPointListA;
bestPointsB = bestPointListB;
console.log(bestPointsA);
console.log(bestPointsB);

// F = R3D.fundamentalFromUnnormalized X X X (bestPointsA,bestPointsB);
// P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);

*/
					var testPointsA = bestPointsA;
					var testPointsB = bestPointsB;
					if(testPointsA.length>maximumSamplesNonlinearP){
						Code.randomPopParallelArrays([testPointsA,testPointsB],maximumSamplesNonlinearP);
					}
					var result = R3D.transformCameraExtrinsicNonlinear(P, bestPointsA, bestPointsB, Ka,KaInv, Kb,KbInv, maxIterationsSingleCameraNonlinearP, true);
					// R3D.transformCameraExtrinsicNonlinear = function(P, pointsA2D,pointsB2D, Ka,KaInv, Kb,KbInv, maxIterations, negativeIsBad){
					// console.log(result);
					P = result["P"];
					console.log("NONLINEAR P: ");
					var A = new Matrix(4,4).identity();
					var B = P;
					var percentInFront = Stereopsis.checkPointsLocation(A, B, KaInv,KbInv, bestPointsA,bestPointsB);
					console.log("%: "+percentInFront);
				}
			}
		}
	}
	/*
	// does this help w/ camera minimizing squared reprojection errors?
	// var ransacP = true;
	var ransacP = false; // should be true - false for speed up test
	if(ransacP){
		console.log("RANSAC P");
		if(P){ // P FROM RANSAC TO IGNORE OUTLIERS ....
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var result = R3D.cameraExtrinsicRANSACFromPointsAutomated(bestPointsA,bestPointsB,Ka,Kb,KaInv,KbInv, P);
			if(result && result["P"]){
				P = result["P"];
			}
		}
	}
	*/
	return {"F":F, "P": P};
}

Stereopsis.World.prototype.validatePoint3D = function(point3D){
// return;
// TODO: ONLY RUN THIS TO DEBUG


	var views = point3D.toViewArray();
	var points2D = point3D.toPointArray();
	var matches = point3D.toMatchArray();
	if(points2D.length!=views.length){
		console.log(points2D);
		console.log(views);
		throw "v-p mismatch";
	}

	var expectedMatches = points2D.length * (points2D.length-1) / 2;
	if(expectedMatches != matches.length){
		console.log(point3D);
		console.log(points2D);
		console.log(matches);
		throw "expected "+expectedMatches+" / "+matches.length+" matches";
	}

	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(!match.transform()){
			throw "NO TRANSFORM";
		}
		if(match.point3D()!==point3D){
			throw "error A: "+match.point3D();
		}
		if(match.point2DA().point3D()!==point3D){
			throw "error B";
		}
		if(match.point2DB().point3D()!==point3D){
			throw "error C";
		}
	}

	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		if(point2D.point3D()!==point3D){
			throw "error F";
		}
	}

	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var match = point3D.matchForViews(viewA,viewB);
			if(!match){
				console.log(point3D);
				console.log(points2D);
				console.log(matches);
				throw "error M - "+viewA.id()+" & "+viewB.id();
			}
		}
	}
}
Stereopsis.World.prototype.possiblyVisibleViews = function(pointCenter, pointNormal, visibleViews, possibleViews){ // views that might be visible to point 
	var world = this;
	if(!possibleViews){
		possibleViews = world.toViewArray();
	}
	var existingHash = {};
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		existingHash[view.id()] = view;
	}

	var list = [];
	var maxAngleInFront = Code.radians(60.0); // 60 + error - point in front of view - 70-90 too skewed
	var maxAngleDirection = Code.radians(60.0 + 30.0); // 60 + error - patch facing view
	var minDistanceRatio = 0.5; // can't be this much closer: 0.5^2 = 1/4 x area
	var maxDistanceRatio = 2.0; // can't be this much farther: 2^2 = 4 x area
	var distanceAverage = 0;
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		distanceAverage += V3D.distance(pointCenter, view.center());
	}
	distanceAverage /= visibleViews.length;
	var minDistance = distanceAverage*minDistanceRatio
	var maxDistance = distanceAverage*maxDistanceRatio;
	for(var i=0; i<possibleViews.length; ++i){
		var view = possibleViews[i];
		var viewCenter = view.center();
		var viewNormal = view.normal();
		var viewToPoint = V3D.sub(pointCenter,viewCenter);
		var angle = V3D.angle(viewNormal,viewToPoint);

		// location criteria - point in front of camera
		if(angle>maxAngleInFront){
			continue;
		}

		// angle criteria - patch facing camera
		var angle = V3D.angle(viewNormal,pointNormal);
		if(angle<Math.PI-maxAngleDirection){
			continue;
		}
		
		// distance criteria - not too near or too far
		var distance = viewToPoint.length();
		if(distance<minDistance || distance>maxDistance){
			continue;
		}

		// TODO: projected size > MININUM?

		// not already exist in list
		if(!existingHash[view.id()]){
			list.push(view);
		}
	}
	return list;
}
Stereopsis.World.prototype.probe3DGlobal = function(errorSigmaCheck, errorSigmaKeep){ // try to project P3D to every view
	var world = this;
	console.log("probe3DGlobal");
	errorSigmaCheck = errorSigmaCheck!==undefined ? errorSigmaCheck : 2.0;
	errorSigmaKeep = errorSigmaKeep!==undefined ? errorSigmaKeep : 2.0;
	var imageLoadedBoolFxn = function(a){
		return a.image()!==null;
	}
			
	var reuse = new Matrix2D();
	var v = new V3D();
	
	// get all good P3D a chance to propagate:
	var allViews = world.toViewArray();
		allViews = Code.filterArray(allViews, imageLoadedBoolFxn);

	var points3D = world.toPointArrayLocated();
	var newMatches = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			// if error is low enough on all matches
			var matches = point3D.toMatchArray();
			var pass = true;
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				var transform = match.transform();
				// N check
				var error = match.errorNCC();
				var sigma = transform.nccSigma();
				var limitMax = sigma*errorSigmaCheck;
				if(error>limitMax){
					pass = false;
					break;
				}
				// R check
				var error = match.errorR();
				var sigma = transform.rSigma();
				var limitMax = sigma*errorSigmaCheck;
				if(error>limitMax){
					pass = false;
					break;
				}
				// F check 
				var error = match.errorF();
				var sigma = transform.fSigma();
				var limitMax = sigma*errorSigmaCheck;
				if(error>limitMax){
					pass = false;
					break;
				}
			}
			if(!pass){
				continue;
			}
			var pointCenter = point3D.point();
			var pointNormal = point3D.normal();
			var pointUp = point3D.up();
			var pointSize = point3D.size();
			// views
			var currentViews = point3D.toViewArray();
				currentViews = Code.filterArray(currentViews, imageLoadedBoolFxn);
			if(currentViews.length==0){ // no loaded views to compare
				continue;
			}
			var putativeViews = world.possiblyVisibleViews(pointCenter,pointNormal,currentViews, allViews);
			if(putativeViews.length==0){ // no possible views to check
				continue;
			}

			// all potential affines:
			var totalEntries = currentViews.length + putativeViews.length;
			var pointCount = 4;
			var p2Ds = [];
			var centers2D = [];
			for(j=0; j<totalEntries; ++j){
				var view = null;
				if(j<currentViews.length){
					view = currentViews[j];
				}else{
					view = putativeViews[j-currentViews.length];
				}
				var center2D = view.projectPoint3D(pointCenter);
				var extrinsic = view.absoluteTransform();
				var K = view.K();
				centers2D.push(center2D);
				var list = [];
				p2Ds.push(list);
				for(var p=0; p<pointCount; ++p){
					v.set(pointUp.x,pointUp.y,pointUp.z);
					v.rotate(pointNormal, (p/pointCount) * Math.PI2);
					v.scale(pointSize);
					v.add(pointCenter);
					// var p2D = R3D.projectPoint3DToCamera2DForward(v, extrinsic, K, null, false);
					var p2D = R3D.projectPoint3DCamera2DDistortion(v, extrinsic, K, null, false);
						p2D.sub(center2D);
					list.push(p2D);
				}
			}
			
			// 
			for(var j=0; j<putativeViews.length; ++j){
				var viewB = putativeViews[j];
				var imageScalesB = viewB.imageScales();
				// TODO: collision with other patches:
				//		check for patch collisions along ray to projection
				// ---- maybe too time consuming  &  hard to know if collision is just due to error
				var indexPutative = currentViews.length+j;
				var centerB = centers2D[indexPutative];
				var p2DBs = p2Ds[indexPutative];
				
				var newPoints = [];
				var newScores = [];
				var affineAB = null;
				var viewA = null;
				var existingA = null;
				for(var k=0; k<currentViews.length; ++k){
					var centerA = centers2D[k];
					var p2DAs = p2Ds[k];
					viewA = currentViews[k];
					var imageScalesA = viewA.imageScales();
					existingA = point3D.pointForView(viewA).point2D();
					affineAB = R3D.affineCornerMatrixLinear(p2DAs,p2DBs, reuse);
					// var needleSize = Stereopsis.compareSizeForViews2D(viewB,centerB, viewA,centerA);
					// var haystackRelativeSize = needleSize * 2;
					// var result = R3D.optimumNeedleHaystackAtLocation(imageScalesCurrent,current2D, imageScalesNew,center2D, needleSize,haystackRelativeSize, affine2D, compareSize);

					var transform = world.transformFromViews(viewA,viewB);
					// if(transform.matches().length==0){
					// if(!transform.R()){
					if(!transform.rMean() || !transform.rSigma() ){
						continue;
					}
// ?

// throw "here ?"
var isR = true;

					var result = world.bestNeedleHaystackFromLocation(centerA,centerB, existingA, affineAB, viewA,viewB, isR);
					newScores.push(result["score"])
					newPoints.push(result["point"]);
				}
				if(newPoints.length==0){
					console.log("newPoints.length = 0");
					continue;
				}
				var newPoint = V2D.average(newPoints);
				// individual points should be close to center
				var cellSizeB = viewB.cellSize();
				var limitDistance = cellSizeB*0.25; // 0.1 - 0.25
				var distancePass = true;
				for(var k=0; k<newPoints.length; ++k){
					var p = newPoints[k]
					var distance = V2D.distance(p,newPoint);
					if(distance>limitDistance){
						distancePass = false;
						break;
					}
				}
				if(!distancePass){
					continue;
				}
				/*
				// new point shouldn't be too close to existing points - ?
				var nearest = viewA.pointSpace().kNN(newPoint, 1);
					nearest = nearest.point2D();
				var distance = V2D.distance(nearest,newPoint);
				var limitDistance = cellSizeB*0.25; // 0.1 - 0.25
				if(distance<limitDistance){
					continue;
				}
				*/

				// new error check
				var newError = Code.averageNumbers(newScores);
				var currentScore = point3D.averageNCCError();
				if(newError>currentScore*1.25){ // should not increase error much - 1.0 - 1.5
					continue;
				}

				// make a new match from arbitrary entry:
				var match = world.newMatchFromInfo(viewA,existingA, viewB,newPoint, affineAB.copy());
				throw "Set error ?"
				// setup match
					Stereopsis.updateErrorForMatch(match);
					// var fError = match.errorF();
					// var rError = match.errorR();
					// var nError = match.errorNCC();
					// if(fError<maxNewErrorF && rError<maxNewErrorR && nError<maxNewErrorN){
					var m3D = match.point3D();
					m3D.point( m3D.calculateAbsoluteLocationDLT(world,true) );
					world.patchInitBasicSphere(false,[m3D]);
				newMatches.push(match);
			}
		}
	}
	console.log("probe3DGlobal newMatches: "+newMatches.length);
	for(var i=0; i<newMatches.length; ++i){
		var match = newMatches[i];
		var point3D = match.point3D();
		world.embedPoint3D(point3D);
	}
/*
=> need hysteresis somehow to stop point from RETRYING every time
*/
}
var probe3D_COUNT = 0;
Stereopsis.World.prototype.probe3D = function(errorSigmaCheck, errorSigmaKeep){ // try to project every P3D to every view
// requires patches to orientate projections
	console.log("probe3D");
throw "OLD";
	// return;
	errorSigmaCheck = errorSigmaCheck!==undefined ? errorSigmaCheck : 2.0;
	errorSigmaKeep = errorSigmaKeep!==undefined ? errorSigmaKeep : 2.0;
	var world = this;
	var imageLoadedBoolFxn = function(a){
		return a.image()!==null;
	}
	var points3D = world.toPointArrayLocated();
	var allViews = this.toViewArray();
	var allImageViews = Code.filterArray(allViews, imageLoadedBoolFxn); // only compare to views with images present
	// common
	var minMatchScoreNCC = 0.10;
	var maxMatchScoreNCC = 0.35;
	var minMatchScoreSAD = 0.05;
	var maxMatchScoreSAD = 0.25;
	var compareSize = 9;
	// var viewCompareScale = 1.0;
	var viewCompareScale = 2.0; // zoom out == make sure area around is also acceptible
	// var viewCompareScale = 4.0;
	// var haystackSize = compareSize + 2; // pixel error ~ min(ceil(min + sig),~3) // 2-4
	var haystackSize = compareSize * 2;
	var needleMask = ImageMat.circleMask(compareSize);
	var org = V2D.ZERO;
	var xLoc = new V2D(compareSize*0.5,0);
	var yLoc = new V2D(0,compareSize*0.5);
	var xNeg = new V2D(-compareSize*0.5,0);
	var yNeg = new V2D(0,-compareSize*0.5);
	var standardizedPoints = [xLoc,yLoc,xNeg,yNeg];
	var checked = 0;
	var added = 0;
// var limited = [];
var matchAddList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			if(checked>0 && checked%1000==0){
				console.log(checked+" / "+i+" / "+points3D.length);
			}
			/*
			// only try propagation if error low enough
			var lowError = true;
			var points2D = point3D.toPointArray();
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j]; // TODO?: also MATCH.rSigma ?
				var errorR = match.transform().rSigma()*1.0;
					errorR *= 0.5;
				var cellA = match.viewA().cellSize();
				var cellB = match.viewB().cellSize();
				// cellA *= 2.0;
				// cellB *= 2.0;
				if(errorR>cellA || errorR>cellB){
					lowError = false;
					break;
				}
			}
			if(!lowError){
				continue;
			}
			*/
			// good enough:
			var pointNormal = point3D.normal();
			var pointCenter = point3D.point();
			var visibleViews = point3D.toViewArray();
			var visibleImageViews = Code.filterArray(visibleViews, imageLoadedBoolFxn);
			var possibleImageViews = Code.filterArray(allImageViews, imageLoadedBoolFxn);
				possibleImageViews = world.possiblyVisibleViews(pointCenter,pointNormal,visibleViews, possibleImageViews);
			Code.removeDuplicates(possibleImageViews,visibleViews);

			/*
			// need hysteresis to prevent researching repeatidly tested & failed P3Ds ...
			// remove attempted views:
			var hysteresis = point3D.propagateViewList();
			if(!hysteresis){
				hysteresis = {};
				point3D.propagateViewList(hysteresis);
			}

			var hystersisViews = [];
			for(var j=0; j<possibleImageViews.length; ++j){
				var view = possibleImageViews[j];
				var errorR = view.rSigma();
				var viewID = view.id();
				if(Code.hasKey(hysteresis,viewID)){
					var eR = hysteresis[viewID];
					if(eR<errorR){ // wait until under threshold
						Code.removeElementAt(possibleImageViews,j);
						--j;
						continue;
					}
				} // update & continue
				// hysteresis[viewID] = errorR*0.5;
				// hysteresis[viewID] = errorR*0.99;
				hysteresis[viewID] = errorR*1.0;
			}
			*/


// CHECK FOR PATCH OBSTRUCTIONS ?


			// exist more views to possibly check
			// console.log(possibleImageViews.length+" | "+visibleImageViews.length>1);
			if(possibleImageViews.length>0 && visibleImageViews.length>1){ // need potential view & at least 2 reference view2
checked++;
				var existingMatches = point3D.toMatchArray();
				var visibleCount = visibleImageViews.length;
				var possibleCount = possibleImageViews.length;
				var fullList = [];
				Code.arrayPushArray(fullList,visibleImageViews);
				Code.arrayPushArray(fullList,possibleImageViews);
				// get projections
				var pointSize = point3D.size();
				var pointUp = point3D.up();
				var pointRight = point3D.right();
					var dirRight = pointRight.copy().scale(pointSize*0.5);
					var dirUp = pointUp.copy().scale(pointSize*0.5);
					var dirLeft = dirRight.copy().scale(-1);
					var dirDown = dirRight.copy().scale(-1);
				var center3D = pointCenter;
				var right3D = pointCenter.copy().add(dirRight);
				var up3D = pointCenter.copy().add(dirUp);
				var left3D = pointCenter.copy().add(dirLeft);
				var down3D = pointCenter.copy().add(dirDown);
				// get needles
				var needles = [];
				var affines = [];
				var centers = [];
				var viewers = [];
				// get all needles
				for(var j=0; j<fullList.length; ++j){
					var view = fullList[j];
					var image = view.image();
					var viewCompareSize = view.compareSize();
					var viewCellSize = view.cellSize();
					var needleZoom = viewCompareScale*viewCompareSize/compareSize;
					// var area = viewCompareSize*viewCompareSize;
					var minArea = 0.5*viewCellSize * 0.25; // 0.25 something 2ce as far is half as big
					var maxArea = 0.5*viewCellSize * 4.0; // 4.0 something 2ce as close is twice as big
// minArea = 0.5*viewCellSize / 8.0;
// maxArea = 0.5*viewCellSize * 8.0;
					// abs
					var center2D = view.projectPoint3D(center3D);
					var right2D = view.projectPoint3D(right3D);
					var up2D = view.projectPoint3D(up3D);
					var left2D = view.projectPoint3D(left3D);
					var down2D = view.projectPoint3D(down3D);
					// rel
					var dirRight2D = V2D.sub(right2D,center2D);
					var dirUp2D = V2D.sub(up2D,center2D);
					var dirLeft2D = V2D.sub(left2D,center2D);
					var dirDown2D = V2D.sub(down2D,center2D);
					// area
					var area = 0.25*(dirRight2D.length() + dirUp2D.length() + dirLeft2D.length() + dirDown2D.length());

					var needle = null;
					var matrix = null;
					var isExisting = j<visibleCount;

					if(isExisting || (minArea<area && area<maxArea)){ // EXISTING VIEW NEED TO DO ANYWAY
						var pointsA = [dirRight2D,dirUp2D,dirLeft2D,dirDown];
						var pointsB = standardizedPoints;
						// try rotation + scale basic affine
						var matrix = R3D.affineCornerMatrixLinear(pointsA,pointsB);
						if(j>=visibleCount){ // search a small area around predicted point, compensate for reprojection error
							var haystack = image.extractRectFromFloatImage(center2D.x,center2D.y,needleZoom,null,haystackSize,haystackSize, matrix);
							var aNCC;
							var newCenters = [];
							for(var k=0; k<visibleCount; ++k){ // get most likely point location of new needle
								var needleK = needles[k];
								var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleK,haystack);
								var values = scoresNCC["value"];
								var width = scoresNCC["width"];
								var height = scoresNCC["height"];
								// by index only
								var minIndex = Code.minIndex(values);
								var minX = Math.floor(minIndex%width);
								var minY = Math.floor(minIndex/width);
								var peak = new V3D(minX,minY,values[minIndex]);
								var peaks = [peak];
								if(peaks.length>0){
									var peak = peaks[0];
									// TODO: SUB-PIXEL MINIMUM
									var newCenter = center2D.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);
									newCenters.push(newCenter);
								}
								aNCC = scoresNCC;
							}
							if(newCenters.length>0){
								center2D = V2D.average(newCenters);
							}
						}
						if(j>=visibleCount && !view.isPointInside(center2D)){ // ignore new points outside view frame
							center2D = null;
						}
						if(center2D){ // existing center or new predicted center
							needle = image.extractRectFromFloatImage(center2D.x,center2D.y,needleZoom,null,compareSize,compareSize, matrix);
						}

					} // else not exist or bad criteria
					needles.push(needle);
					affines.push(matrix);
					centers.push(center2D);
					viewers.push(view);
				}
				/*
				// get NCC for each
				var scoresCurrent = [];
				var scoresNew = Code.newArrayArrays(possibleCount);
				for(var j=0; j<visibleCount; ++j){
					var needleJ = needles[j];
					// record needle scores in current | next listings
					for(var k=j+1; k<needles.length; ++k){
						var needleK = needles[k];
						if(!needleK || !needleJ){
							continue;
						}
						var scoresNCC = R3D.normalizedCrossCorrelation(needleJ,needleMask,needleK, true);
						scoresNCC = scoresNCC["value"][0];
						if(k<visibleCount){
							scoresCurrent.push(scoresNCC);
						}else{
							scoresNew[k-visibleCount].push(scoresNCC);
						}
					}
				}
				// calculate current infos
				var minCurr = Code.min(scoresCurrent);
				var midCurr = Code.mean(scoresCurrent);
				// if(minCurr>0.5){ // really bad
				// 	continue;
				// }
				var sigCurr = minCurr*0.5; // assume a sigma
				if(scoresCurrent.length>1){ // guarantee a sigma
					sigCurr = Code.stdDev(scoresCurrent,minCurr);
				}
				// var limNext = minCurr + sigCurr*1.0;
				var limNext = midCurr;
				limNext = Math.min(limNext,0.50);
				// limNext = Math.min(limNext,0.3333); // 0.2-0.5
				// console.log(scoresCurrent,minCurr,sigCurr,limNext);
				*/
				for(var j=0; j<possibleCount; ++j){
					var indexNew = visibleCount+j;
					var needle = needles[indexNew];
					if(!needle){
						continue; // failed in some respect
					}
					// var list = scoresNew[j];
					// var minNext = Code.min(list);
					// var avgNext = Code.mean(list);
					// var sigNext = Code.stdDev(list,minNext);
// console.log(" => ?: "+avgNext+" <?< "+limNext+" ::: "+list.length);
					// if(avgNext<limNext){
					if(true){
// console.log(" => ?: "+avgNext+" <?< "+limNext+" ::: "+list.length);
						// create a new match @ best score view
						var minIndex = Code.minIndex(list);
						var affineA = affines[minIndex];
						var viewA = visibleImageViews[minIndex];
						var p2DA = point3D.point2DForView(viewA);
						var pointA = p2DA.point2D();
						var viewB = fullList[indexNew];
						var pointB = centers[indexNew];
						var affineB = affines[indexNew];
						// create new match
							var p3D = new Stereopsis.P3D();
							var p2DA = new Stereopsis.P2D(viewA,pointA.copy(),p3D);
							var p2DB = new Stereopsis.P2D(viewB,pointB.copy(),p3D);
							p3D.addPoint2D(p2DA);
							p3D.addPoint2D(p2DB);
						var match = new Stereopsis.Match2D(p2DA,p2DB,p3D, null);
							p2DA.addMatch(match);
							p2DB.addMatch(match);
							p3D.addMatch(match);
							match.transform(world.transformFromViews(viewA,viewB));

						// get match location => p3d location => match affine
						Stereopsis.updateErrorForMatch(match);
							p3D.point( p3D.calculateAbsoluteLocationDLT(world, true) );
							// p3D.point(point3D.point().copy());
						world.patchInitBasicSphere(false,[p3D]);
						world.updateMatchInfo(match);
						// SPHERE

						// world.patchInitBasicSphere(true,[p3D]);


						// ...

						// world.disconnectPoint3D(p3D);

// TODO: IF PAIR IS WORSE THAN EXISTING ERRORS -< DON'T ADD ...
// F & R ?

						var ncc = match.errorNCC();
						var sad = match.errorSAD();

						// match all existing:
						var ns = [];
						var ss = [];
						for(var m=0; m<existingMatches.length; ++m){
							var mat = existingMatches[m];
							ns.push(mat.errorNCC());
							ss.push(mat.errorSAD());
						}
						var minNCC = Code.min(ns);
						var meanNCC = Code.mean(ns);
						var sigmaNCC = Code.stdDev(ns,minNCC);
						var minSAD = Code.min(ss);
						var meanSAD = Code.mean(ss);
						var sigmaSAD = Code.stdDev(ss,minSAD);
						if(ns.length<=1){
							sigmaNCC = minNCC*0.25;
							sigmaSAD = minSAD*0.25;
						}
						var limitNCC = minNCC + 1.0*sigmaNCC;
						limitNCC = Math.min(Math.max(limitNCC,minMatchScoreNCC),maxMatchScoreNCC);
						var limitSAD = minSAD + 1.0*sigmaSAD;
						limitSAD = Math.min(Math.max(limitSAD,minMatchScoreSAD),maxMatchScoreSAD);
++added;
						if( ncc>limitNCC || sad>limitSAD ){ // too poor
							continue;
						}
						var imageA = viewA.image();
						var imageB = viewB.image();

// SHOW SOME
if(probe3D_COUNT<50){
// if(true){
// if(false){
// console.log(" "+probe3D_COUNT+" matching: "+minIndex+" & "+indexNew);
	for(var nI=0; nI<needles.length; ++nI){
		var OFFX = probe3D_COUNT * 50;
		var OFFY = nI * 50;
		var needle = needles[nI];
		var sss = 3.0;
		if((nI<visibleCount || nI==indexNew) && needle){ //needle){
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sss);
			d.matrix().translate(10 + OFFX, 10 + OFFY);
			GLOBALSTAGE.addChild(d);
		}
	}
}
// if(true){
if(false){
var OFFY = 300;
	var matrix = match.affine();
	var pointA = match.point2DA().point2D();
	var pointB = match.point2DB().point2D();
	// console.log(pointA,pointB);
	var sizeCompare = 31;
	// var scale = 0.50;
	var scale = 2.0; // larger number = zoom out
	// scale = viewCompareScale;
	var sss = 3.0;
	var imgA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, matrix);
	var imgB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);

	var OFFX = (sss*sizeCompare + 1)*probe3D_COUNT;

	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + OFFX, 10 + OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + OFFX, 10 + sss*sizeCompare + 1 + OFFY);
	GLOBALSTAGE.addChild(d);
}
++probe3D_COUNT;

						matchAddList.push(match);
					}
				}
			}
		} // else no patch
	}

	console.log(" => PROBE3D ADDING NEW MATCHES:");
	console.log("checked: "+checked+" ? "+matchAddList.length);

	world.printPoint3DTrackCount();

	for(var i=0; i<matchAddList.length; ++i){
		var match = matchAddList[i];
		var result = world.embedPoint3D(match.point3D(), false);
	}

	world.printPoint3DTrackCount();

	console.log("added: "+added+" / "+matchAddList.length);

	// console.log(limited);

	var world = this;
	var densePoints3D = this.toPointArray();
	Stereopsis.updateErrorForNullMatches(densePoints3D);
	for(var i=0; i<densePoints3D.length; ++i){
		if(i%1000==0){
			console.log("validating: "+i+" / "+densePoints3D.length);
		}
		var densePoint3D = densePoints3D[i];
		world.validatePoint3D(densePoint3D);
	}
	return added;
}

Stereopsis.World.prototype.trimSpatialCorners = function(view,minDistance){
	console.log(view)

	// get points

	// remove points

	// sort on corners



	throw "?"
}
Stereopsis.World.prototype.probeCorners = function(){
	/*
	use image corners as basis for search areas
		- start only after R / F errors are both low enough
		- explore corners only once
		- only explore corners that are not already in approximation (away from matched cell by 1-3 neighbor distances)
			- coarse search grid ; fill in based on
		- project using R ;
	*/
	// don't start corner searching until requirements are fullfilled
	var maxErrorR = 2.0;
	var maxErrorF = 2.0;
	var minMatches = 1000;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var searchCorners = transform.searchCorners();
		if(searchCorners){ // has started already ...
			//
		}else{ // should start
			var errorFMean = transform.fMean();
			var errorFSigma = transform.fSigma();
			var errorRMean = transform.rMean();
			var errorRSigma = transform.rSigma();
			var errorFTotal = errorFMean + 1.0*errorFSigma;
			var errorRTotal = errorRMean + 1.0*errorRSigma;
			var matches = transform.matches();
			var matchCount = matches.length;
			if(errorFTotal<maxErrorF && errorRTotal<maxErrorR && matchCount>=minMatches){
				// init corner search
			}
		}
	}
	// var views = this.toViewArray();
	// for(var i=0; i<views.length; ++i){
	// 	var viewA = views[i];
	// 	for(var j=i+1; j<views.length; ++j){
	// 		var viewB = views[j];
	// 		 // ..
	// 	}
	// }
}
Stereopsis.World.prototype.matchNeighborConsistentResolveAdd = function(match){ // check for neighbor consistency : decide to add/remove this/neighbors
	throw "this should do 1 thing"
	var world = this;
	var viewA = match.viewA();
	var viewB = match.viewB();
	var shouldAdd = true;
	var radiusSearch = 1.5; // 1.0-1.5 : 1==4-neighbor, 1.5==8-neighbor
	var radiusDifference = 2.0; // 1.5-3.0
	var views = [viewA,viewB];
	var vector = new V2D();
	var inconsistentNeighbors = [];
if(false){ // just add without criteria
// if(true){
	for(var i=0; i<views.length; ++i){
		var vA = views[i];
		var vB = views[(i+1)%2];
		var p2DA = match.pointForView(vA);
		var p2DB = match.pointForView(vB);
		var pA = p2DA.point2D();
		var pB = p2DB.point2D();
		var affineAB = match.affineForViews(vA,vB);
		var cA = vA.cellSize();
		var cB = vB.cellSize();
		var radiusA = cA*radiusSearch;
		var radiusB = cB*radiusDifference;
		var neighborsA = vA.pointSpace().objectsInsideCircle(pA, radiusA);
		if(neighborsA.length>1){ // save a wasted loop
			for(var n=0; n<neighborsA.length; ++n){
				var n2DA = neighborsA[n];
				if(n2DA==p2DA){
					continue;
				}
				var nAm = n2DA.matchForView(vB);
				if(!nAm){
					continue;
				}
				var n2DB = nAm.pointForView(vB);
				var nAp = n2DA.point2D();
				var nBp = n2DB.point2D();
				// predicted vs actual location
				V2D.sub(vector, nAp,pA);
				affineAB.multV2DtoV2D(vector,vector);
				vector.add(pB);
				var diff = V2D.distance(vector,nBp);
				// var diff = V2D.distance(pB,nBp);
// console.log("DISTANCE: "+diff+" / "+radiusB);
				if(diff>radiusB){
// console.log("DISTANCE: "+diff+" / "+radiusB);
					inconsistentNeighbors.push(nAm);
				}
			}
		}
	}

	if(inconsistentNeighbors.length>0){
		// per average or per individual?
// console.log(match);
// console.log(inconsistentNeighbors);
// throw "?";
		var errorR = match.errorR();
		var errorF = match.errorF();
		var errorN = match.errorNCC();
		var errorS = match.errorSAD();
		var avgR = 0;
		var avgF = 0;
		var avgN = 0;
		var avgS = 0;
		for(var n=0; n<inconsistentNeighbors.length; ++n){
			var neighbor = inconsistentNeighbors[n];
			avgR += neighbor.errorR();
			avgF += neighbor.errorF();
			avgN += neighbor.errorNCC();
			avgS += neighbor.errorSAD();
		}
		avgR /= inconsistentNeighbors.length;
		avgF /= inconsistentNeighbors.length;
		avgN /= inconsistentNeighbors.length;
		avgS /= inconsistentNeighbors.length;
		if(
			   avgR>errorR
			// && avgF>errorF
			// && avgS>errorS
			&& avgN>errorN
			){ // keep THIS, remove others
			for(var n=0; n<inconsistentNeighbors.length; ++n){
				var neighbor = inconsistentNeighbors[n];
				world.removeMatchFromPoint3D(neighbor);
			}
		}else if(
			   avgR<errorR
			// && avgF<errorF
			// && avgS<errorS
			&& avgN<errorN
		){ // drop THIS, keep others
			shouldAdd = false;
		} // else: no obvious winner, keep both
		// remove existing ... 

		// throw "inconsistentNeighbors"
	}

} // if true
	// console.log("shouldAdd: "+shouldAdd);


// shouldA = true;


	if(shouldAdd){
		var point3D = match.point3D();
		// console.log("before: "+point3D.point());
		// point3D.calculateAbsoluteLocationDLT(world, true);
		point3D = world.embedPoint3D(point3D);

		if(point3D){
			var matches = point3D.toMatchArray();
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				Stereopsis.updateErrorForMatch(match);
			}
			// TODO: this should already be done ?
			// point3D.calculateAbsoluteLocationDLT(world);
			point3D.calculateAbsoluteLocationDLT(world, true);
		}
	}
	return shouldAdd;
}
Stereopsis.World.prototype.expand2DTracks = function(maxSigmaView, maxSigmaMatch){ // use existing 2D matches to check neighbors in views that are not currently matched
	// probing, but for existing points to increase track coverage
throw "OLD";
	maxSigmaView = Code.valueOrDefault(maxSigmaView, 2.0);
	var sigmaFKeep = maxSigmaView;
	var sigmaRKeep = maxSigmaView;
	var sigmaNKeep = maxSigmaView;
	console.log("expand2DTracks");
	var world = this;
	var views = world.toViewArray();
	for(var i=0; i<views.length; ++i){
		// console.log("view : "+i+" / "+views.length);
		var viewA = views[i];
		var viewsOpposite = viewA.oppositeViews();
		var pointsA = viewA.toPointArray();
		var spaceA = viewA.pointSpace();
		var radiusA = viewA.cellSize();
		var neighborRadius = radiusA*1.5; // encompass other cell centroid
		var matchesAddList = [];
		for(var j=0; j<pointsA.length; ++j){
			var pointA = pointsA[j];
			var point3DA = pointA.point3D();
			var viewListA = point3DA.toViewArray();
			// mark the views as have already
			var haveList = {};
			for(var k=0; k<viewListA.length; ++k){
				var viewB = viewListA[k];
				var viewBID = viewB.id();
				haveList[viewBID] = true;
			}
			// get neighbors
			var point2DA = pointA.point2D();
			var neighborsA = spaceA.objectsInsideCircle(point2DA,neighborRadius);
			// console.log("   neighborsA: "+neighborsA.length);
			var bestList = {};
			var didFindOther = false;
			for(var k=0; k<neighborsA.length; ++k){
				var pointB = neighborsA[k];
				var point2DB = pointB.point2D();
				var distanceAB = V2D.distance(point2DA,point2DB);
				var point3DB = pointB.point3D();
				var pointListB = point3DB.toPointArray();
				for(var l=0; l<pointListB.length; ++l){
					var pB = pointListB[l];
					var viewB = pB.view();
					var viewBID = viewB.id();
					if(!haveList[viewBID]){ // don't already have it
						var best = bestList[viewBID];
						if(!best || best["distance"]<distanceAB){
							bestList[viewBID] = {"distance":distanceAB, "point":pB};
							didFindOther = true;
						}
					}
				}
			}
			if(didFindOther){
				bestList = Code.objectToArray(bestList);
				for(var k=0; k<bestList.length; ++k){
					var best = bestList[k];
					var pointB = best["point"];
					var viewB = pointB.view();
					// use existing match as reference for this match
					var point3DB = pointB.point3D();
					var match = point3DB.matchForViews(viewA,viewB);
					var affine = match.affineForViews(viewA,viewB);
					var centerA = point2DA;
					var centerB = pointB.point2D();
					throw "old?";
					var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, centerA, affine, viewA,viewB, old);
					if(newMatch){
						Stereopsis.updateErrorForMatch(newMatch);
						var fError = newMatch.errorF();
						var rError = newMatch.errorR();
						var nError = newMatch.errorNCC();
						var transform = newMatch.transform();
						var maxNewErrorF = transform.fMean() + transform.fSigma()*sigmaFKeep;
						var maxNewErrorR = transform.rMean() + transform.rSigma()*sigmaRKeep;
						var maxNewErrorN = transform.nccMean() + transform.nccSigma()*sigmaNKeep;
						if(fError<maxNewErrorF && rError<maxNewErrorR && nError<maxNewErrorN){
						// TODO: VALUES SHOULD ALSO BE AS GOOD AS CURRENT POINT3D MATCH AVERAGES
							var m3D = newMatch.point3D();
							var pointLocation = m3D.calculateAbsoluteLocationDLT(world,true);
							if(pointLocation){
								m3D.point(pointLocation);
								world.patchInitBasicSphere(false,[m3D]);
								matchesAddList.push(newMatch);
							}
						}
					}
				}
			}
		}
		console.log(" + ADDING TRACKS FOR VIEW: "+i+" : "+matchesAddList.length+" / "+pointsA.length);
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
				point3D = world.embedPoint3D(point3D);
			// validation ?
		}
	}
}

Stereopsis.World.prototype.checkValidateMatches = function(){ 
	var count = 0;
	var world = this;
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var affine = match.affine();
			++count;
			if(affine){
				if( Code.isNaN( affine.get(0,0) ) ){
					console.log(centerA);
					console.log(centerB);
					console.log(newPointA);
					console.log(newMatch);
					throw "found NaN in match affine";
				}
			}
			var affine = match.affineReverse();
			if(affine){
				if( Code.isNaN( affine.get(0,0) ) ){
					console.log(centerA);
					console.log(centerB);
					console.log(newPointA);
					console.log(newMatch);
					throw "found NaN in match affine";
				}
			}
		}
	}
	console.log("checkValidateMatches: "+count);
}


Stereopsis.World.prototype.probe3DTrackExpandR = function(sigmaMaximumSelect, sigmaMaximumNew){
	console.log("probe3DTrackExpandR");
}
Stereopsis.World.prototype.probe2DCellsExpandR = function(sigmaMaximumSelect, sigmaMaximumNew){ // propagate points using only 2D / 3D mapping attributes
	sigmaMaximumSelect = Code.valueOrDefault(sigmaMaximumSelect, 3.0); // 2-3 (95%-99%)
	sigmaMaximumNew = Code.valueOrDefault(sigmaMaximumNew, 2.0); // 1.0-2.0 (68%-95%)
	var world = this;
	var transforms = world.toTransformArray();
	// var compareSize = 9; // 5 - 11
	// compareSize = Code.valueOrDefault(compareSize, 9);
	var possibles = 0;
	var addeds  = 0;
	var maxCheckErrorR = 0;
	var maxCheckErrorF = 0;
	var maxCheckErrorN = 0;
	var maxCheckErrorS = 0;
	var maxNewErrorR = 0;
	var maxNewErrorF = 0;
	var maxNewErrorN = 0;
	var maxNewErrorS = 0;

	// WORLD - GLOBAL
	// var errorRmean = world.globalErrorRMean();
	// var errorRsigma = world.globalErrorRSigma();
	// 	maxCheckErrorR = errorRmean + sigmaMaximumSelect*errorRsigma;
	// 	maxNewErrorR = errorRmean + sigmaMaximumNew*errorRsigma;

	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matchCount = transform.matchCount();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorNmean = transform.nccMean();
		var errorNsigma = transform.nccSigma();
		var errorSmean = transform.sadMean();
		var errorSsigma = transform.sadSigma();

		var doR = true;
		if(!errorRmean || !errorRsigma){
			doR = false;
			errorRmean = 0;
			errorRsigma = 0;
		}

		maxCheckErrorR = errorRmean + sigmaMaximumSelect*errorRsigma;
		maxCheckErrorF = errorFmean + sigmaMaximumSelect*errorFsigma; // empties worth trying
		maxCheckErrorN = errorNmean + sigmaMaximumSelect*errorNsigma;
		maxCheckErrorS = errorSmean + sigmaMaximumSelect*errorSsigma;
		maxNewErrorR = errorRmean + sigmaMaximumNew*errorRsigma;
		maxNewErrorF = errorFmean + sigmaMaximumNew*errorFsigma; // new matches worth keeping
		maxNewErrorN = errorNmean + sigmaMaximumNew*errorNsigma;
		maxNewErrorS = errorSmean + sigmaMaximumNew*errorSsigma;
		
		console.log("allowed max errors: R: "+maxCheckErrorR+" F: "+maxCheckErrorF+" | N: "+maxCheckErrorN+" | S: "+maxCheckErrorS+" ("+matchCount+") ");
		console.log(" doR: "+doR);

		var viewsA = [viewA,viewB];
		var viewsB = [viewB,viewA];
		var matchesAddList = [];


		for(var v=0; v<viewsA.length; ++v){
			var viewA = viewsA[v];
			var viewB = viewsB[v];
			var imageA = viewA.imageScales();
			var imageB = viewB.imageScales();
			// images need to be present
			if(!imageA || !imageB){
				continue;
			}
			var empties = viewA.emptyNeighborCellsForView(viewB);
			console.log("  "+v+" empties: "+empties.length);
			// something here leads to an infinite wait
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				var neighbors = empty.neighbors();
					// neighbors = Code.copyArray(neighbors); // does this need copy ?
				var emptyCenter = empty.center();
				var bestPoint = null;
				var bestDistance = null;
				var bestMatch = null;
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();
						// objects = Code.copyArray(objects); // does this need copy ?
					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						if(!match){ // neighbor doesn't share
							continue;
						}
						var ferr = match.errorF();
						var nerr = match.errorNCC();
						var serr = match.errorSAD();
						var rerr = match.point3D().globalErrorR();
if(doR && rerr===undefined){
	console.log(match);
	console.log(viewA);
	console.log(viewB);

	throw "found a missing globalErrorR"
}
						// console.log("rerr: "+rerr);
						// USE BEST AS DISTANCE:
						var distance = nerr;
						if( (!doR || (rerr<maxCheckErrorR)) && ferr<maxCheckErrorF && nerr<maxCheckErrorN && serr<maxCheckErrorS){
							if(bestPoint===null || distance<bestDistance){
								bestPoint = object;
								bestDistance = distance;
								bestMatch = match;
							}
						}
					}
				}
				// local possible match to use as seed source
				if(bestMatch){
						var rerr = bestMatch.point3D().globalErrorR();
// console.log(" bestMatch rerr: "+rerr);
// console.log(" bestMatch patch: "+bestMatch.point3D().hasPatch());
					var affine = bestMatch.affineForViews(viewA,viewB);
					if(!affine || affine.a===undefined  || Code.isNaN(affine.a) ){
						console.log(bestMatch);
						console.log(bestMatch.point3D());
						console.log(affine);
						throw "affine not exist";
					}
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();
// console.log(" bestMatch patch: "+bestMatch.point3D().hasPatch());

					if( Code.isNaN( newPointA.x ) || Code.isNaN( newPointA.y )  ){
						console.log(empty);
						throw "newPointA NaN"
					}
					var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);
					if(newMatch){
// console.log(" bestMatch patch: "+bestMatch.point3D().hasPatch());
						var point3D = newMatch.point3D();
// console.log(" bestMatch patch: "+bestMatch.point3D().hasPatch());


						world.updatePoint3DFromProbe2D(point3D, bestMatch);
						// point does not go in yet




// console.log(" bestMatch patch: "+bestMatch.point3D().hasPatch());
// console.log("  >>>>>>>>>> newMatch patch: "+newMatch.point3D().hasPatch());
						// console
						// var rError = newMatch.point3D().globalErrorR();
						var rError = newMatch.point3D().globalErrorR();
// console.log("  >>>>>>>>>> newMatch patch: "+newMatch.point3D().hasPatch());
// console.log("  >>>>>>>>>> newMatch error: "+newMatch.point3D().globalErrorR());
						var fError = newMatch.errorF();
						var sError = newMatch.errorSAD();
						var nError = newMatch.errorNCC();
						var keep = fError<maxNewErrorF && sError<maxNewErrorS && nError<maxNewErrorN && (!doR || (rError<maxNewErrorR));
// if(doR){
// console.log(bestMatch);
// console.log(newMatch);
// console.log(newMatch.point3D());
// console.log(rError);
// console.log("keep?: "+keep+" : "+fError+"<?<"+maxNewErrorF+" "+nError+"<?<"+maxNewErrorN+" "+sError+"<?<"+maxNewErrorS+" "+rError+"<?<"+maxNewErrorR+" / "+doR);
// if(rError===undefined){
// 	throw "why no"; // probe2DCellsExpandR
// }
// }
// var keep = true;
// throw "before keep";
						// TODO: // var shouldAdd = world.matchNeighborConsistentResolveAdd(match); // 
						if(keep){
							matchesAddList.push(newMatch);
						}
					} // end new match
				} // end best match
			} //  end empties
		} // end view A-B
		// add mathes AFTER ALL VIEWS, so that each view has a chance to nominate suggestions (compete for best match, not just first come first serve)
		console.log(" ADD LIST : "+matchesAddList.length);
world.debugCheckPairPointMatchCounts();
			for(var j=0; j<matchesAddList.length; ++j){
				var match = matchesAddList[j];
				var point3D = match.point3D();
				var isValid = world.isValidPoint3DAndPatch3D(point3D);
// console.log("ADD "+j);
				if(isValid){
					world.recursiveEmbedPoint3D(point3D);
				}else{
					world.disconnectPoint3D(point3D);
					world.killPoint3D(point3D);
				}
			}
world.debugCheckPairPointMatchCounts();

			// throw "matchesAddList";
	} // end transforms
}



Stereopsis.World.prototype.probe2DCellsR = function(sigmaMaximumSelect, sigmaMaximumNew, compareSize){ 
	return this.probe2DCellsRF(sigmaMaximumSelect, sigmaMaximumNew, true, compareSize);
}
Stereopsis.World.prototype.probe2DCellsF = function(sigmaMaximumSelect, sigmaMaximumNew, compareSize){
	return this.probe2DCellsRF(sigmaMaximumSelect, sigmaMaximumNew, false, compareSize);
}
// compareSize is not used
Stereopsis.World.prototype.probe2DCellsRF = function(sigmaMaximumSelect, sigmaMaximumNew, isR){ // propagate points using only 2D / 3D mapping attributes
	console.log("probe2DCellsRF ....................................................................");
	sigmaMaximumSelect = Code.valueOrDefault(sigmaMaximumSelect, 3.0); // 2-3 (95%-99%)
	sigmaMaximumNew = Code.valueOrDefault(sigmaMaximumNew, 2.0); // 1.0-2.0 (68%-95%)

// sigmaMaximumSelect = 999;
// sigmaMaximumNew = 999;

// sigmaMaximumSelect = 3.0;
// sigmaMaximumSelect = 4.0;

	var world = this;
	var transforms = world.toTransformArray();
	// var compareSize = 9; // 5 - 11
	// compareSize = Code.valueOrDefault(compareSize, 9);
	var possibles = 0;
	var addeds  = 0;
	var maxCheckErrorR = 0;
	var maxCheckErrorF = 0;
	var maxCheckErrorN = 0;
	var maxCheckErrorS = 0;
	var maxNewErrorR = 0;
	var maxNewErrorF = 0;
	var maxNewErrorN = 0;
	var maxNewErrorS = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matchCount = transform.matchCount();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorNmean = transform.nccMean();
		var errorNsigma = transform.nccSigma();
		var errorSmean = transform.sadMean();
		var errorSsigma = transform.sadSigma();
		maxCheckErrorF = errorFmean + sigmaMaximumSelect*errorFsigma; // empties worth trying
		maxCheckErrorN = errorNmean + sigmaMaximumSelect*errorNsigma;
		maxCheckErrorS = errorSmean + sigmaMaximumSelect*errorSsigma;
		if(isR){
			var errorRmean = transform.rMean();
			var errorRsigma = transform.rSigma();
			var maxCheckErrorR = errorRmean + sigmaMaximumSelect*errorRsigma;
		}
		maxNewErrorF = errorFmean + sigmaMaximumNew*errorFsigma; // new matches worth keeping
		maxNewErrorN = errorNmean + sigmaMaximumNew*errorNsigma;
		maxNewErrorS = errorSmean + sigmaMaximumNew*errorSsigma;
		if(isR){
			maxNewErrorR = errorRmean + sigmaMaximumNew*errorRsigma;
		}
		console.log("allowed max errors: R: "+maxCheckErrorR+" F: "+maxCheckErrorF+" | N: "+maxCheckErrorN+" | S: "+maxCheckErrorS+" ("+matchCount+") ");

		// some room
		maxCheckErrorF = Math.max(maxCheckErrorF,1.0);
		maxCheckErrorN = Math.max(maxCheckErrorN,0.15);
		maxCheckErrorS = Math.max(maxCheckErrorS,0.10);
		// ???
		maxNewErrorF = Math.max(maxNewErrorF,1.0);
		maxNewErrorN = Math.max(maxNewErrorN,0.15);
		maxNewErrorS = Math.max(maxNewErrorS,0.10);
		if(isR){
			maxCheckErrorR = Math.max(maxCheckErrorR,1.0);
			maxNewErrorR = Math.max(maxNewErrorR,1.0);
		}

		var viewsA = [viewA,viewB];
		var viewsB = [viewB,viewA];
		var matchesAddList = [];
		for(var v=0; v<viewsA.length; ++v){
			var viewA = viewsA[v];
			var viewB = viewsB[v];
			var imageA = viewA.imageScales();
			var imageB = viewB.imageScales();
			var empties = viewA.emptyNeighborCellsForView(viewB);
			console.log("  "+v+" empties: "+empties.length);
			

			// something here leads to an infinite wait
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				var neighbors = empty.neighbors();


					neighbors = Code.copyArray(neighbors);


				var emptyCenter = empty.center();
				var bestPoint = null;
				var bestDistance = null;
				var bestMatch = null;
				// console.log("test START "+e);
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();


						objects = Code.copyArray(objects);


					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						if(!match){ // neighbor doesn't share
							continue;
						}
						var ferr = match.errorF();
						var nerr = match.errorNCC();
						var serr = match.errorSAD();

							// USE BEST CLOSEST
							// var distance = V2D.distance(object.point2D(), emptyCenter);

							// USE BEST ERROR LOCATION:
							// var distance = ferr;
							// if(isR){
							// 	distance = match.errorR();
							// }

							// USE BEST ERROR SCORE:
							var distance = nerr;

						if(ferr<maxCheckErrorF && nerr<maxCheckErrorN && serr<maxCheckErrorS){
							if(bestPoint===null || distance<bestDistance){
								bestPoint = object;
								bestDistance = distance;
								bestMatch = match;
							}
						}
					}
				}
				// console.log("  bestMatch: "+(bestMatch==null));
				// local possible match to use as seed source
				if(bestMatch){
					//console.log("got bestMatch IN "+e);
					var affine = bestMatch.affineForViews(viewA,viewB);
					if(!affine || affine.a===undefined  || Code.isNaN(affine.a) ){
						console.log(bestMatch);
						console.log(bestMatch.point3D());
						console.log(affine);
						throw "affine not exist";
					}
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();

					if( Code.isNaN( newPointA.x ) || Code.isNaN( newPointA.y )  ){
						console.log(empty);
						throw "newPointA NaN"
					}
					var transform = world.transformFromViews(viewA,viewB);
					if(!transform.rSigma() || !transform.rMean()){
						continue;
					}
					// 
					var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB, isR);
					if(newMatch){
						// console.log("got newMatch IN "+e);
						var affine = newMatch.affine();
						if( Code.isNaN( affine.get(0,0) ) || Code.isNaN( centerA.x ) || Code.isNaN( centerA.y ) || Code.isNaN( centerB.x ) || Code.isNaN( centerB.y ) || Code.isNaN( newPointA.x ) || Code.isNaN( newPointA.y ) ){
							console.log(newPointA);
							console.log(centerA);
							console.log(centerB);
							console.log(newPointA);
							console.log(newMatch);
							throw "found NaN in match affine";
						}
						Stereopsis.updateErrorForMatch(newMatch);
						// console
						// var fError = newMatch.errorF();
						// var sError = newMatch.errorSAD();
						// var nError = newMatch.errorNCC();
						// var keep = fError<maxNewErrorF && sError<maxNewErrorS && nError<maxNewErrorN;
						// if(isR){
						// 	keep = keep & newMatch.errorR()<maxNewErrorR;
						// }
var keep = true;
						// console.log("keep?: "+keep+" : "+fError+"<?<"+maxNewErrorF+" "+nError+"<?<"+maxNewErrorN+" "+sError+"<?<"+maxNewErrorS);
						if(keep){
							// console.log("got newMatch KEEP "+e);
							++possibles;
							var maximumUniquenessScore = 0.99; // 0.95-0.99
							// check to see if there are other score 'peaks' nearby
							// var uniquenessScore = world.matchUniqueness(newMatch);
							var uniquenessScore = 0;
							// console.log("uniquenessScore: "+uniquenessScore);
							if(uniquenessScore<maximumUniquenessScore){
								var point2DA = newMatch.point2DA();
								var point2DB = newMatch.point2DB();
								var pointA = point2DA.point2D();
								var pointB = point2DB.point2D();
								// update affine
								newMatch.affine(affine); // start with best match neighbor
								// console.log(affine);
								// console.log(newMatch);
								// console.log("got newMatch CREATE "+e);

// problem after here ?
								
								if( Code.isNaN( affine.get(0,0) ) ){
									console.log(centerA);
									console.log(centerB);
									console.log(newPointA);
									console.log(newMatch);
									throw "found NaN in match affine";
								}
								try{
									// console.log("  uniquenessScore A ");
									// console.log("  uniquenessScore C1 ");
									if(isR){
										// console.log("got newMatch INIT "+e);
										var point3D = newMatch.point3D();
										var location3D = point3D.estimated3D();
										point3D.point(location3D); // not in world yet.

										// console.log("  uniquenessScore IN ");
										world.initP3DPatchFromMode(point3D);
										// console.log("  uniquenessScore OUT ");
										// console.log("got newMatch OUT "+e);
									}
									// console.log("  uniquenessScore C2 ");
									// console.log("  uniquenessScore A ");
									// console.log("got affineP2DFromMode "+e);
									world.affineP2DFromMode(newMatch);
									// console.log("  uniquenessScore B ");
									// ???
									matchesAddList.push(newMatch);

									// ADD ANCESTOR:
									newMatch.point3D().ancestor(bestMatch.point3D());

									// console.log("got newMatch END "+e);
								}catch(e){
									console.log(e+" ... inside probe 2D");
								}
							} // uniqueness
							// else{
							// 	console.log("drop uniquenessScore: "+uniquenessScore);
							// }
						}
					} // end new match
				} // end best match
			} //  end empties
		} // end view A-B
		// add mathes AFTER ALL VIEWS, so that each view has a chance to nominate suggestions (compete for best match, not just first come first serve)
		console.log(" ADD LIST "+i+" : "+matchesAddList.length);
			for(var j=0; j<matchesAddList.length; ++j){
				++addeds;
				var match = matchesAddList[j];
				var shouldAdd = world.matchNeighborConsistentResolveAdd(match); // 
			}
			// throw "matchesAddList";
	} // end transforms
	console.log("possibles: "+possibles+" v added: "+addeds);
}

Stereopsis.World.prototype.probe3DR = function(sigmaMaximumSelect, sigmaMaximumNew){ //
	sigmaMaximumSelect = Code.valueOrDefault(sigmaMaximumSelect, 3.0);
	sigmaMaximumNew = Code.valueOrDefault(sigmaMaximumNew, 2.0);

	var world = this;
	console.log("probe3DR");
	
	var allPoints3D = world.toPointArray();
	var allViews = world.toViewArray();
	var allTransforms = world.toTransformArray();
	// mark views as loaded or not
	var loadedViewsFromID = {};
	var loadedViewsCount = 0;
	var potentialViewsFromID = {};
	var normalViewFromID = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var viewID = view.id();
		var extrinsic = view.absoluteTransform();
		var absolute = Matrix.inverse(extrinsic);
		var center = absolute.multV3DtoV3D(new V3D(0,0,0));
		var normal = absolute.multV3DtoV3D(new V3D(0,0,1));
			normal.sub(center);
		var isImageLoaded = view.imageScales() != null
		loadedViewsFromID[viewID] = isImageLoaded;
		loadedViewsCount += isImageLoaded ? 1 : 0;
		potentialViewsFromID[viewID] = {};
		normalViewFromID[viewID] = normal;
	}
// console.log("potentials");
	// potential other views
	var viewPairMaximumAngle = Code.radians(60); // 60-90
	var viewPairMinimumTransformPoints = 16;
	for(var i=0; i<allViews.length; ++i){
		var viewA = allViews[i];
		var viewIDA = viewA.id();
		var viewLoadedA = loadedViewsFromID[viewIDA];
		var normalA = normalViewFromID[viewIDA];
		var potentialA = potentialViewsFromID[viewIDA];
		for(var j=i+1; j<allViews.length; ++j){
			var viewB = allViews[j];
			var viewIDB = viewB.id();
			var viewLoadedB = loadedViewsFromID[viewIDB];
			var normalB = normalViewFromID[viewIDB];
			var potentialB = potentialViewsFromID[viewIDB];
			// image loaded
			if(viewLoadedA && viewLoadedB){
				// shares transform matches already
				var transform = world.transformFromViews(viewA,viewB);
				var matchCount = transform.matchCount();
				if(matchCount>viewPairMinimumTransformPoints){
					// angle coherent
					var angleNormals = V3D.angle(normalA,normalB);
					if(angleNormals<viewPairMaximumAngle){
						potentialA[viewIDB] = angleNormals;
						potentialB[viewIDA] = angleNormals;
						// TODO: distance to average targets OK  --  distance has to be within ~ 2 x (average point distahce + 2 x sigma size)
					}
				}
			}
		}
	}
// console.log(potentialViewsFromID);
	if(loadedViewsCount==0){
		console.log("no images loaded");
		throw "?";
	}
// console.log("transforms");
	// mark matches as passable or not
	var allMatches = [];
	var transformIDToLimitKeep = {};
	for(var i=0; i<allTransforms.length; ++i){
		var transform = allTransforms[i];
		var transformID = transform.id();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var errorNmean = transform.nccMean();
		var errorNsigma = transform.nccSigma();
		var maxSelectErrorR = errorRmean + sigmaMaximumSelect*errorRsigma;
		var maxSelectErrorF = errorFmean + sigmaMaximumSelect*errorFsigma; // matches worth trying
		var maxSelectErrorN = errorNmean + sigmaMaximumSelect*errorNsigma;
		var maxNewErrorR = errorRmean + sigmaMaximumNew*errorRsigma;
		var maxNewErrorF = errorFmean + sigmaMaximumNew*errorFsigma; // new points worth making
		var maxNewErrorN = errorNmean + sigmaMaximumNew*errorNsigma;
			// remember limits
			var transformEntry = [maxNewErrorN,maxNewErrorF,maxNewErrorR];
			transformIDToLimitKeep[transformID] = transformEntry;
		var matches = transform.matches();
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorN = match.errorNCC();
			if(errorR && errorF && errorN){
				var passN = errorN < maxSelectErrorN;
				var passF = errorF < maxSelectErrorF;
				var passR = errorR < maxSelectErrorR;
				var isPassing = passN && passF && passR;
				match.temp(isPassing);
			}
			allMatches.push(match);
		}
	}
	// console.log(allMatches);
	// project points passing metrics
	// console.log(loadedViewsFromID);
	var addMatches = [];
var checkedMatches = 0;
var cnt = 0;
	for(var i=0; i<allPoints3D.length; ++i){
		var point3D = allPoints3D[i];
++checkedMatches;
// console.log(point3D);
		// must have all passable matches
		var matchesP3D = point3D.toMatchArray();
		var matchesPass = true;
		for(var m=0; m<matchesP3D; ++m){
			var match = matchesP3D[m];
			if(!match.temp()){
				matchesPass = false;
				break;
			}
		}
		if(!matchesPass){
			continue;
		}
		// must have at least 1 view loaded to compare
		var points2D = point3D.toPointArray();
		var bestProjectionViews = {};
		var existingViewIDs = {};
		for(var p=0; p<points2D.length; ++p){
			var point2D = points2D[p];
			var view = point2D.view();
			var viewID = view.id();
			existingViewIDs[viewID] = true;
			var isLoaded = loadedViewsFromID[viewID];
			if(isLoaded){
				var hash = potentialViewsFromID[viewID];
				var potentialIDs = Code.keys(hash);
				for(var l=0; l<potentialIDs.length; ++l){
					var potentialID = potentialIDs[l];
					potentialID = parseInt(potentialID);
					var score = hash[potentialID];
					var entry = bestProjectionViews[potentialID];
					if(!entry){
						entry = {"fromPoint":point2D, "toViewID":potentialID, "score":score, "x":point2D.view().id()};
						bestProjectionViews[potentialID] = entry;
					}else{
						if(score<entry["score"]){ // better projection exists
							entry["fromPoint"] = point2D;
							entry["x"] = point2D.view().id();
							entry["toViewID"] = potentialID;
							entry["score"] = score;
						}
					}
				}
			}
		}
		// console.log(bestProjectionViews);
		// console.log(existingViewIDs);
		// do projection:
		var location3D = point3D.point();
		var size3D = point3D.size();
		var normal3D = point3D.normal();
		var up3D = point3D.up();
// console.log(location3D+" = location3D");
// console.log(size3D);
// console.log(normal3D);
// console.log(up3D);
		var keys = Code.keys(bestProjectionViews);
		for(var k=0; k<keys.length; ++k){
			var key = keys[k];
			var entry = bestProjectionViews[key];
// console.log("entry: "+key);
// console.log(entry);
			var point2D = entry["fromPoint"];
			var toViewID = entry["toViewID"];
			var fromView = point2D.view();
			var fromViewID = fromView.id();
			var toView = world.viewFromID(toViewID);
// console.log(" "+fromViewID+"  ->  "+toViewID);
// console.log(fromView);
// console.log(toView);
// console.log(" ??? "+fromView.id()+"  ->  "+toView.id());

			if(existingViewIDs[toViewID]){ // entry cannot project to existing view
				continue;
			}
			// new match
			var viewA = fromView;
			var centerA = point2D.point2D();
			var viewB = toView;
			var centerB = viewB.projectPoint3D(location3D);

			var extrinsics = [viewA.absoluteTransform(),viewB.absoluteTransform()];
			var Ks = [viewA.K(),viewB.K()];
// console.log(extrinsics);
// console.log(Ks);
			var result = R3D.projectivePatch3DToAffineList(location3D, size3D, normal3D, up3D, extrinsics, Ks);
			if(!result){
				continue;
			}
// console.log(result);
			var affineAB = result["affines"][0];
// console.log(centerA);
// console.log(centerB);
// console.log(viewA);
// console.log(viewB);
// console.log(affineAB);
			var needleSize = 5; // 5-9
			var haystackSize = 11; // twice: 9-17
			var featureSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
			var result = R3D.optimumSADLocationSearchFlatRGB(centerA,centerB, viewA.imageScales(),viewB.imageScales(), featureSize, needleSize,haystackSize, affineAB);
			centerB = result["point"];
			var noConnect = false; // DO connect
			// var noConnect = true;
// console.log(viewA,centerA,viewB,centerB, affineAB, noConnect);
			centerA = centerA.copy();
			centerB = centerB.copy();
			var newMatch = world.newMatchFromInfo(viewA,centerA,viewB,centerB, affineAB, noConnect);
// console.log(newMatch);
// console.log(newMatch.transform());
// newMatch.transform()
			Stereopsis.updateErrorForMatch(newMatch);
// var cameraA = viewA.absoluteTransform();
// var cameraB = viewB.absoluteTransform();
// var KaInv = viewA.Kinv();
// var KbInv = viewB.Kinv();
// var Ka = viewA.K();
// var Kb = viewB.K();
// var loc3D = R3D.triangulatePointDLT(centerA,centerB, cameraA,cameraB, KaInv, KbInv);
// console.log("  d: "+V3D.distance(loc3D,location3D));
// var error = R3D.reprojectionError(location3D, centerA,centerB, cameraA, cameraB, Ka, Kb);
// var distance = error["error"];
// console.log("  e: "+distance);
			var fError = newMatch.errorF();
			var rError = newMatch.errorR();
			var nError = newMatch.errorNCC();
			var transform = newMatch.transform();
			var entry = transformIDToLimitKeep[transform.id()];
			var passN = newMatch.errorNCC() <= entry[0];
			var passF = newMatch.errorF() <= entry[1];
			var passR = newMatch.errorR() <= entry[2];
// console.log(newMatch.errorNCC()+"/"+entry[0]+" = "+passN);
// console.log(newMatch.errorF()+"/"+entry[1]+" = "+passF);
// console.log(newMatch.errorR()+"/"+entry[2]+" = "+passR);
			if(passR && passF && passN){
				addMatches.push(newMatch);
			}
++cnt;
// throw "here";
// if(cnt>10){
// if(cnt>100){
// if(cnt>1000){
// 	throw "cnt";
// }
		}
	}
	// unmark all matches:
	for(var i=0; i<allMatches.length; ++i){
		var match = allMatches[i];
		match.temp(null);
	}

	// insert new matches:
	var insertCount = 0;
	console.log("probe3D added matches: "+addMatches.length+" / "+checkedMatches);
	// console.log(addMatches);
	var nullPoints = 0;
	for(var i=0; i<addMatches.length; ++i){
		var match = addMatches[i];
		var point3D = match.point3D();
		// console.log(point3D);
		if(!point3D){
			++nullPoints;
			continue;
		}
		var location3D = point3D.estimated3D(); // same as match estimated3D if only 2 views exist ?
		point3D.point(location3D); // not in world yet
		world.initP3DPatchFromMode(point3D);
		world.embedPoint3D(point3D);
		++insertCount;
	}
	console.log("probe3D addMatches: "+insertCount+" | "+nullPoints);

	world.printPoint3DTrackCount();
}

Stereopsis.World.prototype.setMatchAffineFromNeighborhood = function(){ // update matches using local neighborhood of points
	var world = this;

	var minimumTransformMatchCount = 16;
	var neighborCountMin = 5; // 3 - 6
	var neighborCountUse = 6;
	var neighborCountKNN = 10; // neighborCountMin*2;

	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var spaceA = viewA.pointSpace();
		var spaceB = viewB.pointSpace();
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minimumTransformMatchCount){
			continue;
		}
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var point3D = match.point3D();
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var pointA = point2DA.point2D();
			var pointB = point2DB.point2D();
			var hashA = {};
			var hashB = {};
			var neighborsA = spaceA.kNN(pointA,neighborCountKNN);
			var neighborsB = spaceB.kNN(pointB,neighborCountKNN);
			// A
			for(var n=0; n<neighborsA.length; ++n){
				var neighborA = neighborsA[n];
				var p3D = neighborA.point3D();
				if(p3D!=point3D){
					hashA[p3D.id()] = p3D;
				}
			}
			// B
			for(var n=0; n<neighborsB.length; ++n){
				var neighborB = neighborsB[n];
				var p3D = neighborB.point3D();
				if(p3D!=point3D){
					hashB[p3D.id()] = p3D;
				}
			}
			// both
			var keysA = Code.keys(hashA);
			var neighborsBoth = [];
			for(var k=0; k<keysA.length; ++k){
				var key = keysA[k];
				var p3D = hashB[key];
				if(p3D){
					neighborsBoth.push(p3D);
				}
			}
			// create affine if enough neighbors exist
			if(neighborsBoth.length>=neighborCountMin){
				var pointsA = [];
				var pointsB = [];
				var len = Math.min(neighborsBoth.length, neighborCountUse);
				for(n=0; n<len; ++n){
					var p3D = neighborsBoth[n];
					var p2DA = p3D.pointForView(viewA);
					var p2DB = p3D.pointForView(viewB);
					pointsA.push(V2D.sub(p2DA.point2D(),pointA));
					pointsB.push(V2D.sub(p2DB.point2D(),pointB));
				}
				var affine = R3D.affineCornerMatrixLinear(pointsA,pointsB, new Matrix2D());
				if(affine){
					match.affineForViews(viewA,viewB,affine);
				}
			}
		}

	}
	// throw "...."
}


Stereopsis.World.prototype.subDivideUpdateMatchLocation = function(){ // 2D update, matches+affine change in position | assume change in 3D location does not warrant patch update
	var world = this;
	// each P3D's matches (arbitrary starting match)
	// high def:
	// var needleSize = 21;
	// low def:
	var needleSize = 11; // 7-11
	var haystackSize = needleSize + 2; // maximum movement 1 px

	// var needleRefineSize = 21;
	// var doBlur = true;
	var doBlur = false;
	var needleRefineSize = 41;
	// var haystackRefineSize = needleRefineSize + 2; // 2-4 ?
	// if(doBlur){
	// 	haystackRefineSize = needleRefineSize + 4;
	// }
	haystackRefineSize = needleRefineSize + 4;


	// TODO: TRY +4 & blurring


	var needle = world._subDivideUpdateMatchLocation_TEMP_NEEDLE;
	var haystack = world._subDivideUpdateMatchLocation_TEMP_HAYSTACK;

	var needleRefine = world._subDivideUpdateMatchLocation_TEMP_NEEDLE_REFINE;
	var haystackRefine = world._subDivideUpdateMatchLocation_TEMP_HAYSTACK_REFINE;
	if(!needle){
		needle = new ImageMat(needleSize,needleSize);
		haystack = new ImageMat(haystackSize,haystackSize);
		world._subDivideUpdateMatchLocation_TEMP_NEEDLE = needle;
		world._subDivideUpdateMatchLocation_TEMP_HAYSTACK = haystack;

		needleRefine = new ImageMat(needleRefineSize,needleRefineSize);
		haystackRefine = new ImageMat(haystackRefineSize,haystackRefineSize);
		world._subDivideUpdateMatchLocation_TEMP_NEEDLE_REFINE = needleRefine;
		world._subDivideUpdateMatchLocation_TEMP_HAYSTACK_REFINE = haystackRefine;
	}


	var orderOnCornernessFxn = function(a,b){
		return a[1] > b[1] ? -1 : 1;
	}


	var points3D = world.toPointArray();
	console.log("HAVE POINTS: "+points3D.length);
	var averagePointDistance = 0;
	var averagePointCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// the point could have been destroyed in the merging process
		if(!point3D.isValid()){
			continue;
		}
		// if(!point3D.hasPatch()){
		// 	console.log(i);
		// 	console.log(point3D);
		// 	console.log(point3D.isValid());
		// 	throw "point doesn't have patch"
		// }
		var points2D = point3D.toPointArray();
		if(points2D.length<2){
			console.log(point3D);
			console.log("point3D has "+points2D.length+" points2D ?");
			throw "?"
		}
		// REMOVE
		world.disconnectPoint3D(point3D);
		// find all views with images loaded
		var loadedImagePoints = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var view = point2D.view();
			if(view.imageScales()){
				var p2D = point2D.point2D();
				var cornerness = view.cornerForPoint(p2D);
				loadedImagePoints.push([point2D,cornerness]);
			}
		}
		if(loadedImagePoints.length<2){ // no useful way to subdivide
			continue;
		} // reference index is best corner = index 0
		loadedImagePoints.sort(orderOnCornernessFxn);
		var point2DA = loadedImagePoints[0][0];
		var viewA = point2DA.view();
		var imageScalesA = viewA.imageScales();
		for(var j=1; j<loadedImagePoints.length; ++j){
			var point2DB = loadedImagePoints[j][0];
			var viewB = point2DB.view();
			var matchAB = point3D.matchForViews(viewA,viewB);
			// retry location 
			var affineAB = matchAB.affineForViews(viewA,viewB);
			var imageScalesB = viewB.imageScales();
			var pointA = point2DA.point2D();
			var pointB = point2DB.point2D();
			var featureSizeA = viewA.compareSizeForPoint(pointA);
			var result = R3D.optimumSADLocationSearchFlatRGB(pointA,pointB, imageScalesA,imageScalesB, featureSizeA, needleSize,haystackSize, affineAB, needle,haystack);
			var best = result["point"];
			// var dist = V2D.distance(best,pointB);

			// TODO: needle can be reused (same image & point A)

			// using this new location, use 2x needle size & half area to get sub-pixel accuracy
			var halfFeatureSizeA = featureSizeA * 0.5;
			var result = R3D.optimumSADLocationSearchFlatRGB(pointA,best, imageScalesA,imageScalesB, halfFeatureSizeA, needleRefineSize,haystackRefineSize, affineAB, needleRefine,haystackRefine, doBlur);
			var best = result["point"];
			var dist = V2D.distance(best,pointB);

			// console.log(" "+dist+" "+pointB+" -> "+best);
			averagePointDistance += dist;
			averagePointCount += 1;
			// disconnect & re-connect point to update location
			point2DB.point2D(best);
			// Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);
		}

		world.updatePoint3DFromSubdivision(point3D);

		var isValid = world.isValidPoint3DAndPatch3D(point3D);
		if(isValid){
			world.recursiveEmbedPoint3D(point3D);
		}else{
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	if(averagePointCount>0){
		averagePointDistance /= averagePointCount;
	}
	console.log("subDivideUpdateMatchLocation - averagePointDistance: "+averagePointDistance+" ("+averagePointCount+")")
}
Stereopsis.World.prototype.filterLocal3DR = function(patchSigma){
	patchSigma = Code.valueOrDefault(patchSigma, 2.0);
	console.log("filter locally 3D space");
	var world = this;

	// 2D->3D & 3D->2D neighbor common percentage 
	world.filterLocal2D3DNeighbors();
console.log("- after local 3D -2D filter");
world.printPoint3DTrackCount();
		// union of all 2D neighbors in all views
		// => unique 3D points 

	// normal angle differences - WORLD ?
	world.filterLocal3DNeighbors();
console.log("- after local 3D neighbor filter");
world.printPoint3DTrackCount();

	// patch filtering
	world.filterGlobalPatchSphere3D(patchSigma, false);
console.log("- after local 3D patch filter");
world.printPoint3DTrackCount();

}
Stereopsis.World.prototype.filterLocal2DR = function(){ 
	var world = this;
	
	// regularization error
	world.filterLocal2DAffineError(true);
console.log("- after local 2D affine filter");
world.printPoint3DTrackCount();
	// local 2D errors 
	world.filterLocal2DErrors();
console.log("- after local 2D error filter");
world.printPoint3DTrackCount();
	// difference in average angle & f error
	// world.filterLocal2DFAngle();
	world.filterLocal2D2DNeighbors();
console.log("- after local 2D neighbors filter");
world.printPoint3DTrackCount();

}
Stereopsis.World.prototype.filterLocal2DF = function(){ // locally drop points with high error:
	var world = this;

	// local 2D errors
	world.filterLocal2DErrors();


	world.filterLocal2DAffineError(); // maybe be updated?

	// world.filterLocal2DFAngle();

	// 2D->2D match neighborhood
	world.filterLocal2D2DNeighbors();

	// separate 2D neighborhoods in views ? (may be less common outside 2-view scenarios)
	
	//  affine:scale|rotation / predicted
	// throw "filterLocal2DF";
}

Stereopsis.World.prototype.filterLocal2D2DNeighbors = function(){ // get 2D neighbors & percent of overlap should be minimum 0.50-0.75
// console.log("filterLocal2D2DNeighbors");
	var world = this;
	var transforms = world.toTransformArray();
	var minCountTransform = 16;
	
	var minimumNeighborhoodCount = 4; // 2D OR 3D should be at least this dense [3x3 grid would have 9] : 4-8 + 1
	var minimumNeighborhoodRatioSingle = 0.25; // minimum neighborhood overlap in 2D EITHER 3D : 0.25-0.50
	var minimumNeighborhoodRatioBoth = 0.50; // BOTH : 0.333-0.666

// minimumNeighborhoodRatioSingle = 0.50;
// minimumNeighborhoodRatioBoth = 0.666;

	var totalDropCount = 0;
	var totalCheckCount = 0;
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length<minCountTransform){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var dropList = [];
		for(var i=0; i<matches.length; ++i){
			++totalCheckCount;
			var match = matches[i];
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var neighborsA = world.neighborhoodFor2DPoint(point2DA);
			var neighborsB = world.neighborhoodFor2DPoint(point2DB);
			var hashA = {};
			for(var j=0; j<neighborsA.length;++j){
				hashA[neighborsA[j].point3D().id()] = 1;
			}
			var hashB = {};
			for(var j=0; j<neighborsB.length;++j){
				hashB[neighborsB[j].point3D().id()] = 1;
			}
			// A->B
			var countAtoB = 0;
			for(var k=0; k<neighborsA.length; ++k){
				var neighborA = neighborsA[k];
				if(hashB[neighborA.point3D().id()]==1){
					++countAtoB;
				}
			}
			// B->A
			var countBtoA = 0;
			for(var k=0; k<neighborsB.length; ++k){
				var neighborB = neighborsB[k];
				if(hashA[neighborB.point3D().id()]==1){
					++countBtoA;
				}
			}
			// check drop
			var ratioA = countAtoB/(neighborsA.length); // guaranteed to have at least 1
			var ratioB = countBtoA/(neighborsB.length);
// console.log("ratios: "+ratioA+" : "+ratioB);
			if(ratioA<minimumNeighborhoodRatioSingle || ratioB<minimumNeighborhoodRatioSingle ||
				(ratioA<minimumNeighborhoodRatioBoth && ratioA<minimumNeighborhoodRatioBoth)){
				dropList.push(match);
				++totalDropCount;
			}
		}
		for(var i=0; i<dropList.length; ++i){
			var match = dropList[i];
			var p3D = match.point3D();
			world.removeMatchFromPoint3D(match);
			world.removeCheckP3D(p3D);
			// if(p3D.)
			/// ....
		}
	}
	var ratio = totalCheckCount == 0 ? 0 : (totalDropCount/totalCheckCount);
	console.log("filterLocal2D2DNeighbors : DROPPED: "+totalDropCount+" / "+totalCheckCount+" : "+ratio);
}

Stereopsis.World.prototype.filterLocal2D3DNeighbors = function(){ // get 2D & 3D neighbors & percent of overlap should be minimum 0.25-0.50
	console.log("filterLocal2D3DNeighbors");
	var world = this;
	var points3D = world.toPointArray();
	var minimumNeighborhoodCount = 4; // 2D OR 3D should be at least this dense [3x3 grid would have 9] : 4-8 + 1
	var minimumNeighborhoodRatioSingle = 0.25; // minimum neighborhood overlap in 2D EITHER 3D : 0.25-0.50
	var minimumNeighborhoodRatioBoth = 0.50; // BOTH : 0.333-0.666
// minimumNeighborhoodRatioSingle = 0.50;
// minimumNeighborhoodRatioBoth = 0.666;
	// 1/5 = 0.2
	// 2/8 = 0.25
	// 3/12 = 0.25

	// 2/5 = 0.4
	// 3/6 = 0.5
	// 4/8 = 0.5
	// 5/10 = 0.5

	var neighborhoodSizeScale = 1.0; // 1.0-2.0
	var totalDropCount = 0;
	var totalCheckCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var neighbors3D = world.neighborhoodFor3DPointPatch(point3D,neighborhoodSizeScale);
		if(neighbors3D.length<minimumNeighborhoodCount){
			continue;
		}
		++totalCheckCount;
		// TO HASH
		var hash3D = {}
		for(var j=0; j<neighbors3D.length; ++j){
			hash3D[neighbors3D[j].id()] = 1;
		}
		var listHash2D = [];
		var listNeighbor2D = [];
		// get 2D list
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var neighbors2D = world.neighborhoodFor2DPoint(point2D,neighborhoodSizeScale);
// console.log("2D count: "+neighbors3D.length);
			// TO HASH
			var hash2D = {};
			for(var k=0; k<neighbors2D.length; ++k){
				var p3D = neighbors2D[k].point3D();
				neighbors2D[k] = p3D;
				hash2D[p3D.id()] = 1;
			}
			listHash2D.push(hash2D);
			listNeighbor2D.push(neighbors2D);
		}
		// check neighborhoods for poor matching:
		var removeList = [];
		for(var j=0; j<listNeighbor2D.length; ++j){
			var neighborhood2D = listNeighbor2D[j];
			var hash2D = listHash2D[j];
			if(neighborhood2D.length<minimumNeighborhoodCount){
				continue;
			}
			// 3D -> 2D
			var count3Dto2D = 0;
			for(var k=0; k<neighbors3D.length; ++k){
				var neighbor3D = neighbors3D[k];
				if(hash2D[neighbor3D.id()]==1){
					++count3Dto2D;
				}
			}
			// 2D -> 3D
			var count2Dto3D = 0;
			for(var k=0; k<neighbors2D.length; ++k){
				var neighbor2D = neighbors2D[k];
				if(hash3D[neighbor2D.id()]==1){
					++count2Dto3D;
				}
			}
			// check drop
			var ratioA = count3Dto2D/(neighbors3D.length); // guaranteed to have at least 1
			var ratioB = count2Dto3D/(neighbors2D.length);
// console.log("ratios: "+ratioA+" : "+ratioB);
			if(ratioA<minimumNeighborhoodRatioSingle || ratioB<minimumNeighborhoodRatioSingle ||
				(ratioA<minimumNeighborhoodRatioBoth && ratioA<minimumNeighborhoodRatioBoth)){
				removeList.push(points2D[j]);
			}
		}
		// remove 
		totalDropCount += removeList.length;
		if(removeList.length>=points2D.length-1){ // remove P3D entirely
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}else{
			for(var j=0; j<removeList.length; ++j){
				var point2D = removeList[j];
				world.removePoint2DAndMatchesFromPoint3D(point2D);
			}
		}
	}
	console.log(" 2D-3D neighborhood totalDropCount: "+totalDropCount + " / "+totalCheckCount+" : "+(totalDropCount/totalCheckCount));
}

Stereopsis.World.prototype.neighborhoodFor3DPointPatch = function(point3D,sizeScale){
	var world = this;
	if(!point3D.hasPatch()){
		console.log(point3D);
		throw "no patch - neighborsFor3DPointPatch";
	}
	sizeScale = Code.valueOrDefault(sizeScale, 1.0);
	var space = world.pointSpace();
	var center = point3D.point();
	var radius = point3D.size();
		radius *= 3*Math.sqrt(2); // match 2D sense of neighbor
	var neighbors = space.objectsInsideSphere(center,radius);
	// TODO: points need to be facing same direction (within 90 degrees of normal direction)
	return neighbors;
}
Stereopsis.World.prototype.neighborhoodFor2DPoint = function(point2D,sizeScale){
	sizeScale = Code.valueOrDefault(sizeScale, 1.0);
	var view = point2D.view();
	var space = view.pointSpace();
	var center = point2D.point2D();
	var radius = view.cellSize()*0.5;
		radius *= 3*Math.sqrt(2); // 2D sense of neighbor = 3x3 grid
	var neighbors = space.objectsInsideCircle(center,radius);
	return neighbors;
}


Stereopsis.World.prototype.filterLocal3DNeighbors = function(){ 
	/*
	for each p3d
		get 3d neighbors

		get difference in normal angles

	for each p3d
		drop if normals are wild ?
		normals

		?
		*/
}


Stereopsis.World.prototype.filter3DRegularization = function(){
	/*
	predicted vs actual 3D location ?
	neighbor distances 2D / 3D ?
	*/
}

Stereopsis.World.prototype.filterLocal2DErrors = function(){ 
	console.log("filter local poor R / F / N / S");

	/*
			for each view pair A-B & B-A ...
				for each point
					get neighbors (cell?)
					get neighborhood min & sigma:
						- F
						- N
						- S
						- scale
						- rotation
					- if any are way off:
						++ outlier
					else 
						++ inlier

		for each P3D
			- if outlier / total > 25% - 50%
				- add to remove list
		

			// F
			// N
			// S
			// affine: scale / rotation ?
			// predicted neighbor location (affine + relative location) - actual location : regularization / consistency check
	*/
}

Stereopsis.World.prototype.filterLocal2DFAngle = function(){ // affine not agree with F
	var limitSigmaAngle = 3.0;
	var world = this;
	var transforms = world.toTransformArray();
	var minCountTransform = 16;
	var knn = 10; // 9 + 1
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length<minCountTransform){
			continue;
		}

		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var spaceA = viewA.pointSpace();
		var Fab = transform.F(viewA,viewB);
		var Fba = transform.F(viewB,viewA);

		var epipoles = R3D.getEpipolesFromF(Fab);
		var epipoleA = epipoles["A"];
		var epipoleB = epipoles["B"];
		
		var evalFxn = function(point2D){
			var match = point2D.matchForView(viewB);
			return match!=null;
		}
		var angles = [];
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			// console.log(match);
			var affine = match.affineForViews(viewA,viewB);
			var info = R3D.infoFromAffine2D(affine);
			// console.log(info);
			var angleA = info["angle"];

			var point2DA = match.pointForView(viewA);
			var centerA = point2DA.point2D();
			var neighborsA = spaceA.kNN(centerA,knn,evalFxn);
			// console.log(neighborsA);
			var matchesA = [];
			var matchesB = [];
			for(var n=0; n<neighborsA.length; ++n){
				var neighbor = neighborsA[n];
				var mat = neighbor.matchForView(viewB);
				if(mat==match){
					continue;
				}
				matchesA.push(mat.pointForView(viewA).point2D());
				matchesB.push(mat.pointForView(viewB).point2D());
			}
			var angleF = R3D.fundamentalRelativeAngleForPoint(centerA,Fab,Fba, epipoleA, epipoleB, matchesA,matchesB);
			// console.log(angleA, angleF);
			var diffAngle = Math.abs(angleF-angleA);
			angles.push(diffAngle);
		}
		// console.log(angles);
		var min = 0;
		var sig = Code.stdDev(angles,0);
		var lim = min + sig*limitSigmaAngle;
		// Code.printMatlabArray(data);
		console.log(" ANGLES: "+min+" +/- "+sig+" = "+lim+" ("+angles.length+") ");
		var dropList = [];
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var angle = angles[m];
			if(angle>lim){
				dropList.push(match);
			}
		}
		console.log("ANGLE-F DROP: "+dropList.length);
		for(var m=0; m<dropList.length; ++m){
			var match = dropList[m];
			var p3D = match.point3D();
			world.removeMatchFromPoint3D(match);
			world.removeCheckP3D(p3D);
		}
		// throw "done trans"
	}
	// throw "filterLocal2DFAngle"
}
Stereopsis.World.prototype.filterLocal2DAffineError = function(isR){ // locally drop points with high error:
	var world = this;
	var transforms = world.toTransformArray();
	var sigmaMaxError = 2.0; // 2 - 3
	var minCountTransform = 16;
	var knn = 9; // 8 + 1
	var vector2D1 = new V2D();
	var vector2D2 = new V2D();
	for(var t=0; t<transforms.length; ++t){
console.log("TRANSFORM: ++++++++++++++++"+t);
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length<minCountTransform){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var viewsA = [viewA,viewB];
		var viewsB = [viewB,viewA];
		for(var v=0; v<viewsA.length; ++v){
			// init accumulators to 0


			//  GET MATCHES EACH TIME
			matches = transform.matches();

			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				match.temp([]);
			}
			var viewA = viewsA[v];
			var viewB = viewsB[v];
			var cellSizeA = viewA.cellSize();
			var maxSearchRadiusA = cellSizeA * 2; //
			var spaceA = viewA.pointSpace();
			var spaceB = viewB.pointSpace();
			var pointsA = spaceA.toArray();
			var evalFxn = function(point2D){
				var match = point2D.matchForView(viewB);
				return match!=null;
			}
			for(var m=0; m<matches.length; ++m){
				var matchA = matches[m];
				var pointA = matchA.pointForView(viewA);
if(!pointA){ // possibly removed in process
	console.log("missing a point");
	continue;
	// console.log(matches);
	// console.log(viewA);
	// console.log(viewB);
	// console.log(transform);
	// console.log(matchA);
	// throw "why no match"
}
				var centerA = pointA.point2D();
				// get neighbors:
				var neighborsA = spaceA.kNN(centerA,knn,evalFxn,maxSearchRadiusA);
				if(neighborsA.length>0){ // only need 1			
// if(!matchA){
// 	console.log(pointA);
// 	console.log(neighborsA);
// 	console.log(viewA);
// 	console.log(viewB);
// 	console.log(transform);
// 	console.log(matches);
// 	throw "why no match"
// }
					var affineA = matchA.affineForViews(viewA,viewB);
					var pointB = matchA.pointForView(viewB);
					var centerB = pointB.point2D();
					// get predicted vs actual location
					for(var n=0; n<neighborsA.length; ++n){
						var neighborA = neighborsA[n];
						if(neighborA!=pointA){

							var cenA = neighborA.point2D();
							var matA = neighborA.matchForView(viewB);
							var neighborB = matA.pointForView(viewB);
							var cenB = neighborB.point2D();
							// A:
							V2D.sub(vector2D1, cenA,centerA);
							var distanceA = vector2D1.length();
							// console.log(" A: "+vector2D1);
							// predicted:
							affineA.multV2DtoV2D(vector2D1,vector2D1);
							vector2D1.add(centerB);
							var distanceP = V2D.distance(vector2D1, cenB);
							// console.log(" P: "+distanceP);
							// B:
							var distanceB = V2D.distance(cenB, centerB);
							// console.log(" B: "+distanceB);
							// relative error:
							// var error = distanceP/(distanceA + distanceB);
							// var error = distanceP/distanceB;
							var error = distanceP;

							if(Code.isNaN(error)){
								console.log(cenA);
								console.log(centerA);
								console.log(cenB);
								console.log(centerB);
								console.log(vector2D1);
								console.log(affineA+"");
								// console.log(error);
								console.log(error);
								throw "NaN error"
							}
							// console.log(error+"    "+distanceA+" -> "+distanceB+" : "+distanceP);
							// who gets the error? : A / B / BOTH?
							matchA.temp().push(error);
							matA.temp().push(error);
						}else{
							// console.log("self");
						}
					}
				}

			} // end base points A
			var data = [];

			// 1-way view error
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				var list = match.temp();
				var avg = Code.mean(list);
				match.temp(avg)
				data.push(avg);
			}
			var min = Code.min(data);
			var sig = Code.stdDev(data, min);
			var lim = min + sig*sigmaMaxError;
			if(cellSizeA<3){ // below some minimum size is on order of error
				lim = Math.min(lim, cellSizeA*1.0); // can't be too large: 0.5 - 1.0
				lim = Math.max(lim, cellSizeA*0.10); // can't be less than accuracy of cell: 0.1 - 0.25
			}
			// console.log("REGULARIZATION ERROR ...");
			// Code.printMatlabArray(data);
			console.log(" "+min+" +/- "+sig+" = "+lim+" ("+data.length+") ");
			var dropList = [];
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				var avg = match.temp();
				match.temp(null);
				// console.log(avg+" >?> "+lim);
				if(avg>lim){
					dropList.push(match);
				}
			}
			console.log("AFFINE DROP: "+dropList.length);
			for(var m=0; m<dropList.length; ++m){
				var match = dropList[m];
				var p3D = match.point3D();
				world.removeMatchFromPoint3D(match);
				world.removeCheckP3D(p3D);
				if(isR){ // patch may update
					var pointCount = p3D.point2DCount();
					if(pointCount>1){
						world.updateP3DPatchFromMode(p3D);
					}
				}
			}
		} // end view pairs
	} // end transforms
}

Stereopsis.World.prototype.filterPairwiseErrors = function(sigmaMaximumDrop){ // drop from transform population on: F | N | S 
	sigmaMaximumDrop = Code.valueOrDefault(sigmaMaximumDrop, 2.0);
	console.log("filterPairwiseErrors: F / N / S: "+sigmaMaximumDrop);
	var world = this;
	var limitMatchSigmaR = sigmaMaximumDrop;
	var limitMatchSigmaF = sigmaMaximumDrop;
	var limitMatchSigmaN = sigmaMaximumDrop;
	var limitMatchSigmaS = sigmaMaximumDrop;
	var transforms = world.toTransformArray();
	var minCountTransform = 16;
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length<minCountTransform){ // skip transforms with few matches
			continue;
		}

		var dropList = [];
		var limitF = transform.fMean() + transform.fSigma()*limitMatchSigmaF;
		var limitS = transform.sadMean()!==null ? (transform.sadMean() + transform.sadSigma()*limitMatchSigmaS) : 0;
		var limitN = transform.nccMean()!==null ? (transform.nccMean() + transform.nccSigma()*limitMatchSigmaN) : 0;

		var meanR = transform.rMean();
		var sigmaR = transform.rSigma();
		var limitR = meanR!==null ? (meanR + sigmaR*limitMatchSigmaR) : 0;
		var doR = meanR!==null;

// console.log("doR: "+doR);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorF = match.errorF();
			var errorN = match.errorNCC()
			var errorS = match.errorSAD();
			var errorR = match.point3D().globalErrorR();
			if( (errorF!=null && errorF>limitF) || (errorS!=null && errorS>limitS) || (errorN!=null && errorN>limitN) || (!doR || (errorR!=null && errorR>limitR)) ){
				dropList.push(match);
			}
		}
		console.log("filterPairwiseErrors: DROPPING: "+dropList.length+" ... ");
		for(var j=0; j<dropList.length; ++j){
			var match = dropList[j];
			var p3D = match.point3D();
			world.removeMatchFromPoint3D(match, true);
		}
	}
}

Stereopsis.World.prototype.filterGlobalErrors = function(sigmaMaximumDrop){ // drop from world population on: R
	sigmaMaximumDrop = Code.valueOrDefault(sigmaMaximumDrop, 2.0);
	var world = this;
	var limitMatchSigmaR = sigmaMaximumDrop;
	var transforms = world.toTransformArray();
	var minCountPoints = 16;
	var points3D = world.toPointArray();
	if(points3D.length<minCountPoints){
		return;
	}
	var limitR = world.globalErrorRMean() + world.globalErrorRSigma()*limitMatchSigmaR;
	// globalErrorFMean
	// globalErrorNMean
	// globalErrorSMean
	var dropList = [];
	for(var p=0; p<points3D.length; ++p){
		var point3D = points3D[p];
		var errorR = point3D.globalErrorR();
		if( (errorR!=null && errorR>limitR) ){
			dropList.push(point3D);
		}
	}
	console.log("filterGlobalErrors: DROPPING: "+dropList.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D, true);
		world.killPoint3D(point3D);
	}

	// throw "filterGlobalErrors";
}

Stereopsis.World.prototype.filterNeighborConsistency2D3D = function(){ // drop if 2D<->3D neighborhood cover is low [for each view & 3D point]
	var world = this;
	var points3D = world.toPointArray();
	var neighborhood3DScale = 8.0; // over-compensate [4-8]
	var neighborhood2DScale = 2.0;
	var minimumNeighborhoodRatio = 0.25; // 
	var minNeighborCount = 6;
	var dropList = [];
	var space3D = world.pointSpace();
// select 3D -> check 2D
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.isValid()){ // may have been removed in process ? ???????
			continue;
		}
		if(!point3D.hasPatch()){
			console.log("no patch exists - skip");
			break;
			// console.log(points3D);
			// console.log(i);
			// console.log(point3D);
			// throw "no patch exists";
		}
		var location3D = point3D.point();
		var size3D = point3D.size();
		var neighborhoodRadius3D = size3D*2*neighborhood3DScale; // 3D size is a RADIUS, 2D size is a diameter
		var neighbors3D = space3D.objectsInsideSphere(location3D,neighborhoodRadius3D);
		// console.log("n3D:"+neighbors3D.length);
		if(neighbors3D.length<minNeighborCount){
			continue;
		}
		var neighbors3DLookup = {};
		for(var j=0; j<neighbors3D.length; ++j){
			var neighbor3D = neighbors3D[j];
			var pointID = neighbor3D.id();
			neighbors3DLookup[pointID] = neighbor3D;
		}
		var points2D = point3D.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var location2D = point2D.point2D();
			var view = point2D.view();
			var space2D = view.pointSpace();
			var size2D = view.compareSizeForPoint(location2D);
			var neighborhoodRadius2D = size2D*neighborhood2DScale;
			var neighbors2D = space2D.objectsInsideCircle(location2D,neighborhoodRadius2D);
			if(neighbors2D.length<minNeighborCount){
				continue;
			}
			// console.log("n2D:"+neighbors2D.length);
			var overlapCount = 0;
			for(var k=0; k<neighbors2D.length; ++k){
				var neighbor2D = neighbors2D[k];
				var neighbor2DPoint3D = neighbor2D.point3D();
				var neighborID = neighbor2DPoint3D.id();
				if(neighbors3DLookup[neighborID]){
					overlapCount++;
				}
			}
			// var ratio2D = overlapCount/neighbors3D.length;
			var ratio2D = overlapCount/neighbors2D.length;
			// console.log(" => shared ratio: "+ratio2D+" : ("+neighbors3D.length+" v "+neighbors2D.length+") ");
			if(ratio2D<minimumNeighborhoodRatio){
				dropList.push(point3D);
				break;
			}
		}
	}
// select 2D -> check 3D ?
	console.log("filterNeighborConsistency2D3D: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
break; // skip drop
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}


	// throw "filterNeighborConsistency2D3D";
}

Stereopsis.World.prototype.filterNeighborConsistency2DViews = function(){ // drop if 2D<->2D neighborhood cover is low [for each view pair]
	var world = this;
	var points3D = world.toPointArray();
	var neighborhood2DScaleSource = 4.0; // over-compensate
	var neighborhood2DScaleDestination = 2.0;
	var minimumNeighborhoodRatio = 0.50; // 
	var minNeighborCount = 6;
	var dropList = [];
	var space3D = world.pointSpace();
// select 3D -> check 2D
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var shouldBreak = false;
		var points2D = point3D.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var location2DA = point2DA.point2D();
			var viewA = point2DA.view();
			var space2DA = viewA.pointSpace();
			var size2DA = viewA.compareSizeForPoint(location2DA);
			var neighborhoodRadiusA = size2DA*neighborhood2DScaleSource;
			var neighborsA = space2DA.objectsInsideCircle(location2DA,neighborhoodRadiusA);
			if(neighborsA.length<minNeighborCount){
				continue;
			}
			var neighborsALookup = {};
			for(var k=0; k<neighborsA.length; ++k){
				var neighborA = neighborsA[k];
				var pointID = neighborA.point3D().id();
				neighborsALookup[pointID] = neighborA;
			}
			// for(var k=j+1; k<points2D.length; ++k){
			for(var k=0; k<points2D.length; ++k){
				if(k==j){ // skip same one
					continue;
				}
				var point2DB = points2D[k];
				var location2DB = point2DB.point2D();
				var viewB = point2DB.view();
				var space2DB = viewB.pointSpace();
				var size2DB = viewB.compareSizeForPoint(location2DB);
				var neighborhoodRadiusB = size2DB*neighborhood2DScaleDestination;
				var neighborsB = space2DB.objectsInsideCircle(location2DB,neighborhoodRadiusB);
				if(neighborsB.length<minNeighborCount){
					continue;
				}
				// console.log("n2D:"+neighbors2D.length);
				var overlapCount = 0;
				for(var l=0; l<neighborsB.length; ++l){
					var neighborB = neighborsB[l];
					var pointID = neighborB.point3D().id();
					if(neighborsALookup[pointID]){
						overlapCount++;
					}
				}
				var ratio = overlapCount/neighborsB.length;
				// console.log(" => shared ratio: "+ratio);
				if(ratio<minimumNeighborhoodRatio){
					dropList.push(point3D);
					shouldContinue = true;
					break;
				}
			}
			if(shouldBreak){
				break;
			}
		}
	}
// select 2D -> check 3D ?
	console.log("filterNeighborConsistency2DViews: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

}

Stereopsis.World.prototype.filterGlobalPatchVisibilityConsistency = function(sigmaMaximumDrop){ // drop if behind or in front of a lot of other points
	// each point has a cone to source views
	// points in front / behind are conflicts

	// the patch with a better score wins & other patch gets an inconsistency counted against it
/*


OUTLIERS:
-> keep an average of infront & behind ncc scores
-> keep a count of front & behind 

if average is better (by some amount?) -> outlier
- only throw away the points with the most front/behind counts



*/
	var world = this;
	sigmaMaximumDrop = sigmaMaximumDrop!==undefined ? sigmaMaximumDrop : 2.0;
	var limitAngleNormalsMax = Code.radians(90.0); // if facing more than this away -> ignore [45-90 degrees]
	var points3D = world.toPointArray();
	// initialize counting
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			point3D.temp({"behind":[],"front":[]});
		}
	}
	//
	var space = world.pointSpace();
	var size = space.size();
	var distanceConeLengthInfinity = size.length()*2.0; // distance to infinity
	// TODO: should infinity be used? or just maximum of view distance ? [how to calc this?]
	var scaleConeSearchSize = 2.0;
	var distancePaddingScale = 2.0; // points too close to eachother should not be considered

	// reuse
	var coneDirection = new V3D();
	var coneCenter = new V3D();
	// loop all patches
	for(var i=0; i<points3D.length; ++i){
		var point3DA = points3D[i];
		if(i%1000==0){
			console.log(" "+i+" / "+points3D.length);
		}
		if(point3DA.hasPatch()){
			// world.findGlobalPatchConeOverlap3D(point3DA);
			var pointSizeA = point3DA.size();
			var pointCenterA = point3DA.point();
			var pointNormalA = point3DA.normal();
			var viewsA = point3DA.toViewArray();
			for(var j=0; j<viewsA.length; ++j){
				var view = viewsA[j];
				var viewCenter = view.center();
				// seach a cone @ radius = 2 x sizeA
				V3D.sub(coneDirection,  pointCenterA,viewCenter);
				var distanceA = coneDirection.length();
				coneCenter.copy(viewCenter);
				var coneRatio = scaleConeSearchSize*pointSizeA/distanceA;
				
				// TODO: expand cone ?
				// Code.expandConeCenterToBaseRadius(coneCenter,coneDirection,coneRatio, scaleConeSearchSize*pointSizeA/distanceA;);

				coneDirection.length(distanceConeLengthInfinity);

				// throw "Code.expandConeToBaseRadius";

// console.log(coneCenter,coneDirection,coneRatio);

				var searchPoints = space.objectsInsideCone(coneCenter,coneDirection,coneRatio);

// console.log(searchPoints);

				for(var k=0; k<searchPoints.length;++k){
					var point3DB = searchPoints[k];
					if(point3DA==point3DB){
						continue;
					}
					if(point3DB.hasPatch()){

						// TODO: should they have THIS view in common ?

						var pointNormalB = point3DB.normal();
						// only care about patches pointing toward eachother
						var angleAB = V3D.angle(pointNormalA,pointNormalB);
						if(angleAB<limitAngleNormalsMax){
							var pointCenterB = point3DB.point();
							var pointSizeB = point3DB.size();
							// ignore points that start off very close to eachother to begin with:
							var distAB = V3D.distance(pointCenterA,pointCenterB);
							var combinedRadius = (pointSizeA+pointSizeB)*distancePaddingScale; // should there be padding ?
							if(distAB<=combinedRadius){
								continue;
							}
							var closestB = Code.closestPointLine3D(coneCenter,coneDirection, pointCenterB);
							// find expected radius along cone
							var distanceB = V3D.distance(viewCenter,closestB);
							var localSizeB = (distanceB/distanceA)*pointSizeA; // similar triangles
							// if distance between center & line point < rad1 + rad2 == intersection
							var distance = V3D.distance(closestB, pointCenterB);
							combinedRadius = (localSizeB+pointSizeB);//*distancePaddingScale; // should there be padding ?
							// combinedRadius *= 0.5; // lenient - conservative
							if(distance < combinedRadius){ // A VISUAL OCCLUSION IS FOUND ..........................
								var nccA = point3DA.averageNCCError();
								var nccB = point3DB.averageNCCError();
								// var sadA = point3DA.averageNCCError();
								// var sadB = point3DB.averageNCCError();
								if(distanceB>distanceA){ // pointB is behind pointA
									point3DB.temp()["behind"].push(nccA);
									point3DA.temp()["front"].push(nccB);
								}else{ // pointB is in front of pointA
									point3DB.temp()["front"].push(nccA);
									point3DA.temp()["behind"].push(nccB);
								}
								// 
								// SHOULD POINTS WITH MORE TRACKS HAVE HIGHER PRIORITY?
								// var trackCountA = point3DA.point2DCount();
								// var trackCountB = point3DB.point2DCount();

								
								// if(nccA!==null & nccB!==null){
								// 	// RATIO, DIFFERENCE, COUNT
								// 	if(nccA<nccB){
								// 		// var diff = nccB-nccA;
								// 		var diff = 1;
								// 		point3DB.temp()["ncc"] += diff;
								// 	}else{
								// 		// var diff = nccA-nccB;
								// 		var diff = 1;
								// 		point3DA.temp()["ncc"] += diff;
								// 	}
								// } // else: do R / F ?
								
								// if(sadA!==null & sadB!==null){
								// 	// RATIO, DIFFERENCE, COUNT
								// 	if(sadA<sadB){
								// 		// var diff = sadB-sadA;
								// 		var diff = 1;
								// 		point3DB.temp()["sad"] += diff;
								// 	}else{
								// 		// var diff = sadA-sadB;
								// 		var diff = 1;
								// 		point3DA.temp()["sad"] += diff;
								// 	}
								// }

								// ++intersectionsFound;
							} // end intersection/occlusion
						} // end angle check
					} // end patch B
				} // end search possibles B
			} // end views

			// throw "..."
		} // end patch A
	} // end all points

	// accumulate into population statistics
	var countsFront = [];
	var countsBehind = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var temp = point3D.temp();
			var behind = temp["behind"];
			var front = temp["front"];
			countsFront.push(front.length);
			countsBehind.push(behind.length);
		}
	}
	var maxSampleSize = 1000;
	countsFront = Code.randomSampleRepeatsMaximum(countsFront,maxSampleSize,maxSampleSize);
	countsBehind = Code.randomSampleRepeatsMaximum(countsBehind,maxSampleSize,maxSampleSize);
	var frontMin = Code.min(countsFront);
	var frontSig = Code.stdDev(countsFront,frontMin);
	var behindMin = Code.min(countsBehind);
	var behindSig = Code.stdDev(countsBehind,behindMin);
	
	// console.log(countsFront);
	// console.log(countsBehind);
	var limitFrontCount = Math.max(1, frontMin + frontSig*sigmaMaximumDrop);
	var limitBehindCount = Math.max(1, behindMin + behindSig*sigmaMaximumDrop);
	console.log(" FRONT: "+frontMin+" +- "+frontSig+" ("+limitFrontCount+")");
	console.log("BEHIND: "+behindMin+" +- "+behindSig+" ("+limitFrontCount+")");

	// drop & cleanup initialiation
	var dropList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var temp = point3D.temp();
			var behind = temp["behind"];
			var front = temp["front"];
			point3D.temp(null);
			var selfNCC = point3D.averageNCCError();
			if(front.length>limitFrontCount){
				var frontNCC = Code.mean(front);
				if(selfNCC>frontNCC){
					dropList.push(point3D);
					continue;
				}
			}
			if(behind.length>limitBehindCount){
				var behindNCC = Code.mean(behind);
				if(selfNCC>frontNCC){
					dropList.push(point3D);
					continue;
				}
			}
		}
	}
	// 
	console.log("filterGlobalPatchVisibilityConsistency: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "filterGlobalPatchVisibilityConsistency";
}

// Stereopsis.World.prototype.findGlobalPatchConeOverlap3D = function(point3DA){
// 	throw ".."
// }

Stereopsis.World.prototype.filterGlobalNegativeDepth = function(sigmaMaximumDrop){ // drop if behind any of the views P3D appears in
	var world = this;
	var points3D = world.toPointArray();
	var vToP = new V3D();
	var dropList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.hasPatch()){
			console.log("no patch - skip filterGlobalNegativeDepth");
			break;
		}
		var location3D = point3D.point();
		var views = point3D.toViewArray();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var center = view.center();
			var normal = view.normal();
			V3D.sub(vToP, location3D, center);
			var dot = V3D.dot(normal,vToP);
			if(dot<=0){
				dropList.push(point3D);
				break;
			}
		}
	}
	console.log("filterGlobalNegativeDepth: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "filterGlobalNegativeDepth";
}

Stereopsis.World.prototype.filterLocalError2D = function(sigmaMaximumDrop){ // drop if: F | N | S : scores are much worse than neighborhood
	sigmaMaximumDrop = sigmaMaximumDrop!==undefined ? sigmaMaximumDrop : 2.0;
	var minNeighborCount = 6;
	var searchScale = 2.0;
	var world = this;
	var points3D = world.toPointArray();
	var dropList = [];
// TODO: cache these values rather than re-compute
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var dropList = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p2D = point2D.point2D();
			var view = point2D.view();
			var size = view.compareSizeForPoint(p2D);
			var searchSize = size*searchScale;
			var neighbors = view.pointSpace().objectsInsideCircle(p2D,searchSize);
			// console.log(neighbors.length);
			if(neighbors.length>=minNeighborCount){
				var listN = [];
				var listS = [];
				var listF = [];
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor==point2D){
						continue;
					}
					var errorN = neighbor.averageNCCError();
					var errorS = neighbor.averageSADError();
					var errorF = neighbor.averageFError();
					listN.push(errorN);
					listS.push(errorS);
					listF.push(errorF);
				}
				var minN = Code.min(listN);
				var sigN = Code.stdDev(listN,minN);
				var minS = Code.min(listS);
				var sigS = Code.stdDev(listS,minS);
				var minF = Code.min(listF);
				var sigF = Code.stdDev(listF,minF);

				var limN = minN + sigN*sigmaMaximumDrop;
				var limS = minS + sigS*sigmaMaximumDrop;
				var limF = minF + sigF*sigmaMaximumDrop;

				var selfN = point2D.averageNCCError();
				var selfS = point2D.averageSADError();
				var selfF = point2D.averageFError();

				// TODO: R filter

				// console.log(" limits: "+limN+"/"+selfN+" | "+limS+"/"+selfS+" | "+limF+"/"+selfF+" | ");

				if( selfN>limN || selfS>limS || selfF>limF ){
					dropList.push(point3D);
					break;
				}
			}
		}
	}
	console.log("filterLocalError2D: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

	// throw "filterLocalError2D";
}

Stereopsis.World.prototype.filterLocalError3D = function(sigmaMaximumDrop){ // drop if: R : scores are much worse than neighborhood
	sigmaMaximumDrop = sigmaMaximumDrop!==undefined ? sigmaMaximumDrop : 3.0;
	var minNeighborCount = 8;
	var searchScale3D = 4.0;
	var world = this;
	var points3D = world.toPointArray();
	var dropList = [];
	var pointSpace = world.pointSpace();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var location3D = point3D.point();
			var size3D = point3D.size();
			var searchSize = size3D*searchScale3D;
			var neighbors = pointSpace.objectsInsideSphere(location3D, searchSize);
			// console.log(neighbors.length);
			if(neighbors.length>=minNeighborCount){
				var listR = [];
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor==point3D){
						continue;
					}
					var errorR = neighbor.globalErrorR();
					listR.push(errorR);
				}
				var minR = Code.min(listR);
				var sigR = Code.stdDev(listR,minR);
				var limR = minR + sigR*sigmaMaximumDrop;
				var selfR = point3D.globalErrorR();
				// console.log(" limits: "+limR+"/"+selfR);
				if( selfR>limR ){
					dropList.push(point3D);
					// continue;
				}
			}
		}
	}
	console.log("filterLocalError3D: DROPPING: "+dropList.length+" / "+points3D.length);
	for(var p=0; p<dropList.length; ++p){
		var point3D = dropList[p];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "filterLocalError3D";
}


Stereopsis.World.prototype.filterGlobal3DR = function(sigmaMaximumDrop){
	this.filterGlobalMetrics(sigmaMaximumDrop, true);
}
Stereopsis.World.prototype.filterGlobal2DF = function(sigmaMaximumDrop){
	return this.filterGlobalMetrics(sigmaMaximumDrop);
}
Stereopsis.World.prototype.filterGlobalMetrics = function(sigmaMaximumDrop, isR){ // globally drop points with high error:
	throw "is this used? filterGlobalMetrics"
	var world = this;
	sigmaMaximumDrop = Code.valueOrDefault(sigmaMaximumDrop, 2.0); // 2.0-3.0 (95%-99%)
	console.log("filter global poor R / F / N / S: "+sigmaMaximumDrop);
	var limitMatchSigmaR = sigmaMaximumDrop;
	var limitMatchSigmaF = sigmaMaximumDrop;
	var limitMatchSigmaN = sigmaMaximumDrop;
	var limitMatchSigmaS = sigmaMaximumDrop;
	var transforms = world.toTransformArray();
	var minCountTransform = 16;
	var doLinearly = false;
	// var doLinearly = true;
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minCountTransform){
			continue;
		}
		var dropList = [];
		var listMatchF = [];
		var listMatchN = [];
		var listMatchS = [];
		var listMatchR = null;
		if(isR){
			listMatchR = [];
		}
		// estimate
var listMulti = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorF = match.errorF();
			var errorN = match.errorNCC()
			var errorS = match.errorSAD();
			if(errorF!=null){
				listMatchF.push(errorF);
			}
			if(errorN!=null){
				listMatchN.push(errorN);
			}
			if(errorS!=null){
				listMatchS.push(errorS);
			}
			if(isR){
				var errorR = match.errorR();
				if(errorR!=null){
					listMatchR.push(errorR);
				}
			}
			if(isR && errorR!=null && errorF!=null && errorN!=null && errorS!=null){
				var metric = errorR*errorF*errorN*errorS;
					metric = Math.log(1+metric); // linear-ish
				listMulti.push(metric);
				match._temp = metric;
			}
		}
listMulti.sort();
/*
console.log("RICHIE - listMulti:")
Code.printMatlabArray(listMulti);
*/
		var limitR = null;
		var limitF = null;
		var limitN = null;
		var limitS = null;
var limitM = null;
		if(isR){
			var min = Code.min(listMatchR);
			var sig = Code.stdDev(listMatchR, min);
			console.log("R: "+min+" +/- "+sig);
			limitR = min + sig*limitMatchSigmaR;

			var min = Code.min(listMulti);
			var sig = Code.stdDev(listMulti, min);
			console.log("M: "+min+" +/- "+sig);
			limitM = min + sig*limitMatchSigmaR;
		}

		var min = Code.min(listMatchF);
		var sig = Code.stdDev(listMatchF, min);
		console.log("F: "+min+" +/- "+sig);
		limitF = min + sig*limitMatchSigmaF;
		
		var min = Code.min(listMatchN);
		var sig = Code.stdDev(listMatchN, min);
		console.log("N: "+min+" +/- "+sig);
		limitN = min + sig*limitMatchSigmaN;

		var min = Code.min(listMatchS);
		var sig = Code.stdDev(listMatchS, min);
		console.log("S: "+min+" +/- "+sig);
		limitS = min + sig*limitMatchSigmaS;

// Code.printMatlabArray(listMatchF,"F");
		
		if(doLinearly){ // stop extreme outliers from biasing sigma
			console.log("do linearly")
			var numerical = function(a,b){
				return a < b ? -1 : 1;
			}
			listMatchF2 = Code.copyArray(listMatchF);
			listMatchN2 = Code.copyArray(listMatchN);
			listMatchS2 = Code.copyArray(listMatchS);
			listMatchF2.sort(numerical);
			listMatchN2.sort(numerical);
			listMatchS2.sort(numerical);

			var percent = 0.5;
			var allowMult = 3.0; // 2.0 should be good enough

			// var percent = 0.75; // very lenient
			// var allowMult = 3.0;

			// LINEAR DROPPING:
			var val = Code.percentile(listMatchF2,percent);
			var limitF2 = val * allowMult;
			limitF = Math.min(limitF,limitF2);

			// var mid = Code.median(listMatchN);
			// var limitN2 = mid * 2;
			var val = Code.percentile(listMatchN2,percent);
			var limitN2 = val * allowMult;
			limitN = Math.min(limitN,limitN2);

			// var mid = Code.median(listMatchS);
			// var limitS2 = mid * 2;
			var val = Code.percentile(listMatchS2,percent);
			var limitS2 = val * allowMult;
			limitS = Math.min(limitS,limitS2);

			if(isR){
				listMatchR2 = Code.copyArray(listMatchR);
				listMatchR2.sort(numerical);
				// var mid = Code.median(listMatchR);
				// var limitR2 = mid * 2;
				var val = Code.percentile(listMatchR2,percent);
				var limitR2 = val * allowMult;
				limitR = Math.min(limitR,limitR2);
			}
		}

		// var maxMatchCount = transforms.length;
		// var maxViewCounts = this.viewCount();
		var R = isR;
		var F = true;
		var N = true;
		var S = true;

console.log("LIMITS: "+limitF+" | "+" | "+limitN+" | "+limitS);
		// allow some minimal error
		if(isR){
			limitR = Math.max(limitR,1.0);
		}
		limitF = Math.max(limitF,1.0);
		// get list of failing matches
		var dropList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorN = match.errorNCC()
			var errorS = match.errorSAD();
var errorM = match._temp;
var dropM = R && errorM!==undefined && limitM && errorM>limitM;
			var dropR = R ? (limitR && errorR>limitR) : false;
			var dropF = F ? (limitF && errorF>limitF) : false;
			var dropN = N ? (limitN && errorN>limitN) : false;
			var dropS = S ? (limitS && errorS>limitS) : false;
			if(dropR || dropF || dropN || dropS
				|| dropM){
				dropList.push(match);
				var point3D = match.point3D();
				var matchCount = point3D.matchCount();
			}
		}
		console.log("MATCH CHECKS -  DROPPED: "+dropList.length);
		matches = dropList;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var p3D = match.point3D();
			this.removeMatchFromPoint3D(match);
			this.removeCheckP3D(p3D);
		}
	} // end transforms
}

Stereopsis.World.prototype.probe2DCells = function(sigmaExistingRFN, initPatches){ // use empty cells neighboring points to check for nearby matches
	var world = this;
	var minimumTransformMatchCount = 16; // min match counts to consider a transform
	var perimeterSearchMultiplier = 2.0; // max distance a permiter point can be
	var checkErrorRatio = 0.95; // only re-check the cell if error has gone below this percentage - hysterisis to save time retrying bad locations
	var maxCheckSigma = sigmaExistingRFN;
	var maxReferenceSigma = sigmaExistingRFN;
	var maxNewSigma = sigmaExistingRFN;
	var transforms = world.toTransformArray();
	// var propagations = [];
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minimumTransformMatchCount){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var errorNmean = transform.nccMean();
		var errorNsigma = transform.nccSigma();
		var maxCheckErrorF = errorFmean + maxCheckSigma*errorFsigma; // empties worth trying
		var maxCheckErrorR = errorRmean + maxCheckSigma*errorRsigma;
		var maxReferenceErrorF = errorFmean + maxReferenceSigma*errorFsigma; // matches worth trying
		var maxReferenceErrorR = errorRmean + maxReferenceSigma*errorRsigma;
		var maxReferenceErrorN = errorNmean + maxReferenceSigma*errorNsigma;
		var maxNewErrorF = errorFmean + maxNewSigma*errorFsigma; // new points worth making
		var maxNewErrorR = errorRmean + maxNewSigma*errorRsigma;
		var maxNewErrorN = errorNmean + maxNewSigma*errorNsigma;
		var viewListA = [viewA,viewB];
		var viewListB = [viewB,viewA];
console.log("ERROR INFO: F:"+errorFmean+"@"+errorFsigma+"="+maxReferenceErrorF);
console.log("ERROR INFO: R:"+errorRmean+"@"+errorRsigma+"="+maxReferenceErrorR);
console.log("ERROR INFO: N:"+errorNmean+"@"+errorNsigma+"="+maxReferenceErrorN);
var matchesAddList = [];
var checkedCount = 0;
var possibleCount = 0;
var addedCount = 0;
		for(var v=0; v<viewListA.length; ++v){
var printString = "";
			var viewA = viewListA[v];
			var viewB = viewListB[v];
console.log("views: "+viewA.id()+" - "+viewB.id());
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
			var maxSearchRadius = cellSizeA*perimeterSearchMultiplier;
			// image
			// var sizeA = viewA.size();
			// var sizeB = viewB.size();
			// var widthA = sizeA.x;
			// var heightA = sizeA.y;
			// var widthB = sizeB.x;
			// var heightB = sizeB.y;
			var empties = viewA.emptyNeighborCellsForView(viewB);
			// emptyNeighborCellsForView
			checkedCount += empties.length;
printString += ("TO CHECK: "+empties.length);
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				// only check empties below maximum error
				/*
				var cellErrorF = empty.markedF();
				var cellErrorR = empty.markedR();
				if(cellErrorF===null){ // not searched yet
					cellErrorF = maxCheckErrorF*checkErrorRatio;
					cellErrorR = maxCheckErrorR*checkErrorRatio;
				}else if(cellErrorF>maxCheckErrorF && cellErrorR>maxCheckErrorR){ /////////////////////////////////////// this is an extra limiting factor ?
					continue; // don't re-check this cell
				} // mark search criteria for next inclusion
				empty.markedF(cellErrorF);
				empty.markedR(cellErrorR);
				*/
				// find best reference match
				// TODO: can keep array with all best points & sort on closest last
				var bestPoint = null;
				var bestDistance = null;
				var bestMatch = null;
				var neighbors = empty.neighbors();
				var emptyCenter = empty.center();
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();
					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						if(!match){ // neighbor doesn't share
							continue;
						}
						var distance = V2D.distance(object.point2D(), emptyCenter);
						var nerr = match.errorNCC();
						var ferr = match.errorF();
						var rerr = match.errorR();
						// console.log("FOUND ONE: "+(ferr<maxReferenceErrorF)+" && "+(rerr<maxReferenceErrorR)+" && "+(nerr<maxReferenceErrorN));
						if(ferr<maxReferenceErrorF && rerr<maxReferenceErrorR && nerr<maxReferenceErrorN){
							if(bestPoint===null || distance<bestDistance){
								bestPoint = object;
								bestDistance = distance;
								bestMatch = match;
							}
						}
					}
				}
				// use best match
				if(bestMatch){
					possibleCount++;

// WHY WOULD affine EER BE NULL ?

					var affine = bestMatch.affineForViews(viewA,viewB);
if(!affine){
	// world.calculatePoint3DPatches([point3D]);
	console.log(bestMatch);
	console.log(bestMatch.point3D());
	throw "affine not exist";
}
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();
					var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);
					if(newMatch){


throw "from somewhere else"
						var point3D = newMatch.point3D();
						world.initNewPointPatch3D(point3D);
						Stereopsis.setErrorForMatch(newMatch);
						// Stereopsis.updateErrorForMatch(newMatch);


						var fError = newMatch.errorF();
						var rError = newMatch.errorR();
						var nError = newMatch.errorNCC();
						if(fError<maxNewErrorF && rError<maxNewErrorR && nError<maxNewErrorN){
							// var m3D = newMatch.point3D();
							// var pointLocation = m3D.calculateAbsoluteLocationDLT(world,true);
							// if(pointLocation){
								// console.log(pointLocation+" ... " );
								// m3D.point( pointLocation );
								// if(initPatches){
									// world.patchInitBasicSphere(false,[m3D]);
								// }else{
									// world.calculatePoint3DPatches([points3D]);
								// }
								matchesAddList.push(newMatch);
								++addedCount;
							// }else{
								// console.log("got null location");
							// }
						} // end new check & insert
					} // end new match
				} // end best match
			} // end empties check
		} // end each view pair
		// console.log("found "+matchesAddList.length);
		// console.log(matchesAddList);
printString += (" | addedCount:  "+addedCount+" / possibleCount: "+possibleCount);

		// add new matches sorted on best ?
		matchesAddList.sort(function(a,b){
			return a.errorNCC() < b.errorNCC() ? -1 : 1;
		});
printString += (" ADD PROBE2D MATCHES: "+matchesAddList.length);
console.log(printString);
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			// console.log(match);
			var shouldAdd = world.matchNeighborConsistentResolveAdd(match);
		}

	} // end each transform
// console.log("DONE OUT ..........");
// WHY IS THIS NECESSARY
var removedCount = 0;
var points3D = world.toPointArray();
for(var p=0; p<points3D.length; ++p){
	var point3D = points3D[p];
	var removed = world.removeCheckP3D(point3D);
	removedCount += removed ? 1 : 0;
}
console.log(" DID REMOVE CHECK: "+removedCount);



// throw ">>>>>>>>>>>>>>>>>>>>"

}

ADDED_MATCH = 0;
Stereopsis.World.prototype.probe2DNNAffine = function(sigma){ //
// sigma = 2.0;
	var maxNewSigma = sigma;
	var maxExistingSigma = sigma;
	var maxReferenceSigma = sigma;
	maxNewSigma = maxNewSigma!==undefined ? maxNewSigma : 3.0; // new points worth creating
	maxExistingSigma = maxExistingSigma!==undefined ? maxExistingSigma : 3.0;
	maxReferenceSigma = maxReferenceSigma!==undefined ? maxReferenceSigma : 3.0; // current points worth looking at
	var checkErrorRatio = 0.99; // when error goes below this : allow rechecking of empty perimeter cell
	var perimeterSearchMultiplier = 2.0; // max distance a permiter point can be
	var minimumTransformMatchCount = 8;
	var world = this;
	var transforms = world.toTransformArray();
	var min = new V2D();
	var max = new V2D();
var propagations = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minimumTransformMatchCount){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var maxCheckErrorF = errorFmean + maxExistingSigma*errorFsigma; // empties worth trying
		var maxCheckErrorR = errorRmean + maxExistingSigma*errorRsigma;
		var maxReferenceErrorF = errorFmean + maxReferenceSigma*errorFsigma;  // source points worth using
		var maxReferenceErrorR = errorRmean + maxReferenceSigma*errorRsigma;
		var maxNewErrorF = errorFmean + maxNewSigma*errorFsigma; // new points worth making
		var maxNewErrorR = errorRmean + maxNewSigma*errorRsigma;
		var viewList = [viewA,viewB];
		var oppositeList = [viewB,viewA];
		var matchesAddList = [];
		var checkedCount = 0;
		var addedCount = 0;
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
console.log("compareSizeA: "+compareSizeA);
			var viewB = oppositeList[v];
			var maxSearchRadius = cellSizeA*perimeterSearchMultiplier;
			// image
			var imageA = viewA.image();
			var imageB = viewB.image();
			var widthA = imageA.width();
			var heightA = imageA.height();
			var widthB = imageB.width();
			var heightB = imageB.height();
			var empties = viewA.emptyNeighborCellsForView(viewB);
			checkedCount += empties.length;
			console.log("TO CHECK: "+empties.length);
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				var cellErrorF = empty.markedF();
				var cellErrorR = empty.markedR();
				if(cellErrorF===null){ // not searched yet
					cellErrorF = maxCheckErrorF*checkErrorRatio;
					cellErrorR = maxCheckErrorR*checkErrorRatio;
				}else if(cellErrorF>maxCheckErrorF || cellErrorR>maxCheckErrorR){ // both errors should be below minimums
					continue; // don't re-check this cell
				}
				// mark search criteria for next inclusion
				empty.markedF(cellErrorF);
				empty.markedR(cellErrorR);
				// find best reference neighbor
				var bestPoint = null;
				var bestNCC = null;
				var bestMatch = null;
				var neighbors = empty.neighbors();
					var emptyCenter = empty.center();
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();
					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						var ncc = match.errorNCC();
							var d = V2D.distance(object.point2D(), emptyCenter);
							ncc = d;
						var f = match.errorF();
						var r = match.errorR();
						if(f<maxReferenceErrorF && r<maxReferenceErrorR){
							if(bestPoint===null || ncc<bestNCC){
								bestPoint = object;
								bestNCC = ncc;
								bestMatch = match;
							}
						}
					}
				}
				if(bestMatch){
					// find best new match for perimeter cell
					var affine = bestMatch.affineForViews(viewA,viewB);
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();
					var newMatch = world.bestMatch2DFromLocation(affine,centerA,centerB, newPointA, viewA,viewB);
					if(newMatch){
						Stereopsis.updateErrorForMatch(newMatch);
						var fError = newMatch.errorF();
						var rError = newMatch.errorR();
						// var newNCC = newMatch.errorNCC();

++ADDED_MATCH;
if(false && ADDED_MATCH==100){
// show current matches
var cnt = 0;
var sizeCell = compareSizeA;

// sizeCell = 101;
// var sizeNeedle = 51;
// sizeCell = 21;
// sizeCell = 12;
// sizeCell = 51;
// var sizeNeedle = 11;

// sizeCell = 51;
// var sizeNeedle = 51;
// sizeCell = 21;
sizeCell = 12.6;
var sizeNeedle = 11;

// var scale = sizeNeedle/sizeCell;
var scale = sizeCell/sizeNeedle;
console.log("scale: "+scale)


// var needle =  centerA;

var sss = 5.0;

var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,scale,null,sizeNeedle,sizeNeedle, null);

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*(sizeNeedle+10)*cnt, 10);
GLOBALSTAGE.addChild(d);

var affine = newMatch.affine();
var inverse = newMatch.affineReverse();

var needleB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,scale,null,sizeNeedle,sizeNeedle, inverse);
var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*(sizeNeedle+10)*(cnt+1), 10);
GLOBALSTAGE.addChild(d);



// show new match point

var compareSize = 11;
var infoA = Stereopsis.infoFromMatrix2D(imageA,centerA,imageB,centerB,affine,compareSize);

console.log(infoA);




console.log(newMatch);
console.log("fError: "+fError+" | rError: "+rError+" | ");
throw "new best match";
}


						
						if(fError<maxNewErrorF || rError<maxNewErrorR){ // TODO: NCC FILTER ?
							var m3D = newMatch.point3D();
							m3D.point( m3D.calculateAbsoluteLocationDLT(world,true) );
							world.patchInitBasicSphere(false,[m3D]);
							matchesAddList.push(newMatch);
							++addedCount;
						// notify all new neighbors as potentially extendable:
						// TODO: NECESSARY?
						// empty.markedF(null);
						// empty.markedR(null);
						// for(var n=0; n<neighbors.length; ++n){
						// 	var neighbor = neighbors[n];
						// 	neighbor.markedF(null);
						// 	neighbor.markedR(null);
						}
					} // new match errors too high
				} // no new match

				else{
// console.log(newMatch);
// throw "no best match"
				}
			} // why no best match
			var propagationCount = addedCount/checkedCount;
			propagations.push(propagationCount);
		}

		matchesAddList.sort(function(a,b){
			return a.errorNCC() < b.errorNCC() ? -1 : 1;
		});
		console.log("AFFINE-2D PROBE : ADD MATCHES: "+matchesAddList.length);
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocationDLT(world);
				var p = point3D.point();
			}
		}
	}
	console.log("propagations: "+propagations);
	return Code.averageNumbers(propagations);
}

Stereopsis.World.prototype.probe2D2 = function(){ //
	var world = this;
	var transforms = this.toTransformArray();
	var min = new V2D();
	var max = new V2D();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var Fab = transform.F(viewA,viewB);
		var Fba = transform.F(viewB,viewA);
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorFLimit = errorFmean + 2.0*errorFsigma;
		var viewList = [viewA,viewB];
		var oppositeList = [viewB,viewA];
		var fList = [[Fab,Fba],[Fab,Fba]];
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
			var viewB = oppositeList[v];
			var maxSearchRadius = cellSizeA*2;
			var emptyLocations = [];
			var Ffwd = fList[v][0];
			var Frev = fList[v][1];

			var imageA = viewA.image();
			var imageB = viewB.image();
			var widthA = imageA.width();
			var heightA = imageA.height();
			var widthB = imageB.width();
			var heightB = imageB.height();
			var totalCount = 0;
			var countX = Math.floor(widthA/cellSizeA);
			var countY = Math.floor(heightA/cellSizeA);
			var halfCellSizeA = cellSizeA*0.5;

			for(var y=0; y<heightA; y+=cellSizeA){
				min.y = y;
				max.y = y+cellSizeA;
				for(var x=0; x<widthA; x+=cellSizeA){
					min.x = x;
					max.x = x+cellSizeA;
					var points = spaceA.objectsInsideRect(min,max);
					if(points.length==0){
						emptyLocations.push(new V2D(x+halfCellSizeA,y+halfCellSizeA));
					}
					++totalCount;
				}
			}
			console.log("emptyLocations: "+emptyLocations.length+" / "+totalCount);
			var evalFxn = function(point2D){
				var match = point2D.matchForView(viewB);
				return match!=null;
			}
			var edgeLocations = [];
			var matchesAddList = [];
			for(var j=0; j<emptyLocations.length; ++j){
				var center = emptyLocations[j];
				var knn = 1; // no averaging
				var neighbors = spaceA.kNN(center,knn,evalFxn,maxSearchRadius);
				if(neighbors.length>0){
edgeLocations.push(center);
					var closestA = neighbors[0];
					/*
					var affines = [];
					var pointsA = [];
					var pointsB = [];
					var distances = [];
					for(var k=0; k<neighbors.length; ++k){
						var neighbor = neighbors[k];
						var point = neighbor.point2D();
						var match = neighbor.matchForView(viewB);
						if(!match){
							throw "got a neighbor without match"
						}
						var affine = match.affineForViews(viewA,viewB);
						if(!affine){
							throw "got a match without affine"
						}
						affines.push(affine);
						pointsA.push(match.pointForView(viewA).point2D());
						pointsB.push(match.pointForView(viewB).point2D());
						distances.push(V2D.distance(center,point));
					}
					var percents = Code.errorsToPercents(distances);
						percents = percents["percents"];
					var existingA = V2D.average(pointsA,percents);
					var existingB = V2D.average(pointsB,percents);
					var average = Code.averageAffineMatrices(affines,percents);
					*/

					// just use closest
					var existingM = closestA.matchForView(viewB);
					var existingA = closestA.point2D();
					var existingB = existingM.pointForView(viewB).point2D();
					var average = existingM.affineForViews(viewA,viewB);

					var pointA = center;
					// predicted next point center:
						var deltaA = V2D.sub(pointA,existingA);
						var deltaB = average.multV2DtoV2D(deltaA);
						var predictedB = V2D.add(existingB,deltaB);
					var pointB = predictedB;
					if(pointB.x<0 || pointB.x>widthB || pointB.y<0 || pointB.y>heightB){
						continue;
					}
					// var inverse = Matrix.inverse(average);
					var compareSize = compareSizeA;
					var sizeNeedle = 11;
					var sizeHaysack = sizeNeedle*2;
					var sizeOff = Math.floor(sizeNeedle*0.5);
					var scale = compareSize/sizeNeedle; // < 1.0
					var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, average);
					var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, null);

					var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
					// find location
					var values = scoresNCC["value"];
					var width = scoresNCC["width"];
					var height = scoresNCC["height"];
/*
var cnt = j;
var sss = 1.0;
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10);
GLOBALSTAGE.addChild(d);

var iii = haystackB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 100);
GLOBALSTAGE.addChild(d);


var heat = Code.grayscaleFloatToHeatMapFloat(values);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], width,height);
var d = new DOImage(img);
d.graphics().alpha(0.80);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 100 + sizeOff);
GLOBALSTAGE.addChild(d);
*/

					var peaks = Code.findMinima2DFloat(values, width, height, true);
					var score = null;
					var peak = null;
					if(peaks.length>0){
						peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
						peak = peaks[0];
					}else{ // use lowest value
						var minIndex = Code.minIndex(values);
						var minX = Math.floor(minIndex%width);
						var minY = Math.floor(minIndex/width);
						peak = new V3D(minX,minY,values[minIndex]);
					}
/*
var d = new DO();
d.graphics().setLine(1.0,0xFFFF0000);
d.graphics().moveTo(-10,0);
d.graphics().lineTo(10,0);
d.graphics().moveTo(0,-10);
d.graphics().lineTo(0,10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(peak.x,peak.y);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 100 + sizeOff);
GLOBALSTAGE.addChild(d);
*/
					score = peak.z;
					var newB = new V2D(peak.x,peak.y);
						newB.x -= sizeOff;
						newB.y -= sizeOff;
						newB.scale(scale);

// console.log("DIFF B: "+newB+" - PEAK: "+peak);

					// pointB.add(newB);
					// console.log("score: "+score);
					if(score>0.50){ // good ones under ~0.2 great under: ~0.1
						// bad score
					}

var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, average);
var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleA,needleB);
var score = scoresNCC["value"][0];

// console.log("FIRST score: "+score);
/*
					// get refined affine transform
					var optimum = Stereopsis.bestAffine2DFromLocation(average,viewA,pointA,viewB,pointB);
					// console.log(optimum+"");
					pointB.x += optimum.get(0,2);
					pointB.y += optimum.get(1,2);
					optimum.set(0,2, 0);
					optimum.set(1,2, 0);

var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, optimum);
var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
var scoresNCC = R3D.normalizedCrossCorrelation(needleA,null,needleB,true);
var score = scoresNCC["value"][0];
*/
// console.log("BEFORE score: "+score);

/*
					var inverse = Matrix.inverse(optimum);
					var result = R3D.subPixelMinimumNCC(imageA,imageB, pointA,pointB, optimum,inverse, compareSize);
					console.log(pointB+" => "+result);
					// pointB.x = result.x;
					// pointB.y = result.y;

var iii = haystackB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.graphics().alpha(0.5);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 300);
GLOBALSTAGE.addChild(d);

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 300 + sizeOff);
GLOBALSTAGE.addChild(d);



pointB.x = result.x;
pointB.y = result.y;
*/
					/*
					// check NCC is a good score
					var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, optimum);
					var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
					var scoresNCC = R3D.normalizedCrossCorrelation(needleA,null,needleB,true);
					var score = scoresNCC["value"][0];
					console.log("FINAL score: "+score);
					*/


/*
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 500);
GLOBALSTAGE.addChild(d);

var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 600);
GLOBALSTAGE.addChild(d);

*/

					// F-score has to be good
					var fError = R3D.fError(Ffwd, Frev, pointA, pointB);
					fError = fError["error"]
					if(fError>errorFLimit){
						// console.log("bad F error: "+fError+" / "+errorFLimit);
						continue;
					}

					// R-score ?

					// path has to be good too
					var pA = closestA.point2D();
					var pB = closestA.matchForView(viewB).pointForView(viewB).point2D();
					var match = world.newMatchFromInfo(viewA,pointA,viewB,pointB,optimum);
					matchesAddList.push(match);

				} // end neighbors
			}

			console.log("ADD MATCHES: "+matchesAddList.length);
			for(var j=0; j<matchesAddList.length; ++j){
				var match = matchesAddList[j];
				var point3D = match.point3D();
				point3D = world.embedPoint3D(point3D);
				if(point3D){
					var matches = point3D.toMatchArray();
					for(var m=0; m<matches.length; ++m){
						var match = matches[m];
						Stereopsis.updateErrorForMatch(match);
					}
					point3D.calculateAbsoluteLocationDLT(world);
					var p = point3D.point();
				}
			}

/*
			console.log("ACTIVE POINTS");
			var sss = 1.5;

			var mapR = Code.newArrayZeros(widthA*heightA);
			var mapG = Code.newArrayZeros(widthA*heightA);
			var mapB = Code.newArrayZeros(widthA*heightA);

			// ALL P2D
			var points = viewA.toPointArray();
			for(var j=0; j<points.length; ++j){
				var point = points[j];
					point = point.point2D();
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapB[index] = 0.50;
			}
			// EMPTY LOCATIONS
			for(var j=0; j<emptyLocations.length; ++j){
				var point = emptyLocations[j];
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapR[index] = 1.0;
			}
			// EMPTY EDGES
			for(var j=0; j<edgeLocations.length; ++j){
				var point = edgeLocations[j];
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapG[index] = 1.0;
			}

			// display IMAGE
			var iii = imageA;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sss);
			d.matrix().translate(10 + sss*v*widthA, 10);
			GLOBALSTAGE.addChild(d);

			// display POINTS
			var img = GLOBALSTAGE.getFloatRGBAsImage(mapR,mapG,mapB, widthA,widthB);
			var d = new DOImage(img);
			d.graphics().alpha(0.80);
			d.matrix().scale(sss);
			d.matrix().translate(10 + sss*v*widthA, 10);
			GLOBALSTAGE.addChild(d);
*/
		} // views
	} // transforms
	// throw "yo";
	/*
	for each transform
		for each viewA,viewB --- need to do A->B & B->A
			new matches = [];
			for each cell in view
				if cell is empty
					average neighbor non-empty cells
						[pick random point in cell?]
					predict adjacent view location
					get needle
					get haystack
					find most optimal location in haystack
					add new match to list of add
			add all new matches
	*/
}
Stereopsis.World.prototype.filter2D2 = function(){
	// console.log("VISUALIZE POINTS WITH HIGH 3D/2D");
	var world = this;
	var significanceSize = 2.0; // 2-4
	var significancePercent = (1.0-1.0/significanceSize);
	var significanceVotePercentDrop = 0.25; // 0.25-0.75
	var transforms = this.toTransformArray();
	var sortDistances = function(a,b){
		return a[0]<b[0] ? -1 : 1;
	};
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var viewList = [viewA,viewB];
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var points2DA = spaceA.toArray();
			var cellSizeA = viewA.cellSize();
			var searchSizeA = cellSizeA*3.0; // 2-4
			var countPeak = 0;
			for(var j=0; j<points2DA.length; ++j){
				var point2DA = points2DA[j];
				var pA2D = point2DA.point2D();
				var pA3D = point2DA.point3D().point();
				if(!pA3D){
					console.log(point2DA);
					console.log(point2DA.point3D());
					console.log(pA3D);
					console.log("?");
				}
				var neighbors = spaceA.objectsInsideCircle(pA2D,searchSizeA);
				var distances = [];
				for(k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor==point2DA){
						continue;
					}
					var pN2D = neighbor.point2D();
					var pN3D = neighbor.point3D().point();
					var d2D = V2D.distance(pA2D,pN2D);

					var d3D = V3D.distance(pA3D,pN3D);
					var ratio = d3D/d2D;
					// var ratio = d3D; --- very heavy dropping
					distances.push([ratio,neighbor]);
				}
				distances.sort(sortDistances);
				var distances2 = [];
				for(k=0; k<distances.length; ++k){
					distances2[k] = distances[k][0];
				}
				var deltas = Code.diff1D(distances2);
				// Code.printMatlabArray(distances2,"distances");
				// Code.printMatlabArray(deltas,"deltas");
				ImageMat.normalFloat01(deltas);
				var lm1 = deltas.length-1;
				var peakIndex = null;
				for(var k=1; k<lm1; ++k){
					var b = deltas[k];
					if(b!=1){ // normalized peak is always? 1.0
						continue;
					}
					var a = deltas[k-1];
					var c = deltas[k+1];
					b -= significancePercent;
					if(b>a && b>c){
						peakIndex = k;
						// Code.printMatlabArray(distances2,"distances");
						// Code.printMatlabArray(deltas,"deltas");
						// console.log(": "+);
						// throw "yeah";
						countPeak += 1;
						break;
					}
				}
				if(peakIndex===null){ // vote to keep all
					peakIndex = distances.length;
				}else{
					// found discontinuity
					// everything before index = vote keep
					// everything after index = vote remove
				}
				for(var k=0; k<distances.length; ++k){
					var item = distances[k];
					var neighbor = item[1];
					if(k<=peakIndex){ // keep
						neighbor.vote(0);
					}else{ // drop
						neighbor.vote(1);
					}
				}
			}
var imageA = viewA.image();
var widthA = imageA.width();
var heightA = imageA.height();
var collection = Code.newArrayZeros(widthA*heightA);
			var dropList = [];
			for(var j=0; j<points2DA.length; ++j){
				var point2DA = points2DA[j];
				var vote = point2DA.votePercent();
				point2DA.voteClear();
				var p = point2DA.point2D();
var x = Math.floor(p.x);
var y = Math.floor(p.y);
var ind = y*widthA + x;
collection[ind] = vote;
				if(vote>significanceVotePercentDrop){
					dropList.push(point2DA);
				}
			}
/*
ImageMat.normalFloat01(collection);
var sss = 2.0;

var iii = imageA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(sss*widthA*v,0);
GLOBALSTAGE.addChild(d);

// var img = GLOBALSTAGE.getFloatRGBAsImage(collection,collection,collection, widthA,heightA);
var heat = Code.grayscaleFloatToHeatMapFloat(collection);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], widthA,heightA);
var d = new DOImage(img);
d.graphics().alpha(0.80);
d.matrix().scale(sss);
d.matrix().translate(sss*widthA*v,0);
GLOBALSTAGE.addChild(d);
*/
			// console.log(countPeak);
			console.log("DROP COUNT: "+dropList.length);
			for(var j=0; j<dropList.length; ++j){
				var point = dropList[j];
				var matches = point.toMatchArray();
				for(var k=0; k<matches.length; ++k){
					var match = matches[k];
					world.removeMatchFromPoint3D(match);
				}
			}
		}
	}
// ...

// throw "out";

}
Stereopsis.World.prototype.probe2DPairwise = function(){
	throw "OLD";
	console.log("probe2DPairwise .....");
	var views = this.toViewArray();
	var minRect = new V2D();
	var maxRect = new V2D();
	var bestMatches = [];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var cellSizeA = viewA.cellSize();
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var listA = viewA.popAddQueue(viewB);
			var listB = viewB.popAddQueue(viewA);
			this._probeSearchList(viewA,viewB,listA);
			this._probeSearchList(viewB,viewA,listB);
		}
	}
}
Stereopsis.World.prototype._probeSearchList = function(viewA,viewB,listA){
	var cellLookup = {};

	/*
	for(var k=0; k<listA.length; ++k){
		// var cell = listA[k];

		var points2D = cell.objects();
		if(points2D.length>0){ // nothing to check
			// needs to contain a point with matching view:
			var found = false;
			for(var p=0; p<points2D.length; ++p){
				var p2D = points2D[p];
				var p3D = p2D.point3D();
				var o2D = p3D.point2DForView(viewB);
				if(o2D){ // has a match for viewA=>viewB already
					found = o2D;
					break;
				}
			}
			if(!found){
				continue;
			}
			var point2D = o2D; // pick a random point: TODO: pick point with best NCC w/ viewB in common
			var neighbors = cell.neighbors();
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				var add = false;
				var ps = neighbor.objects();
				if(ps.length==0){
					add = true;
				}else{ // only add if empty of points of same view
					var found = false;
					for(var p=0; p<ps.length; ++p){
						var p2D = ps[p];
						var p3D = p2D.point3D();
						var o2D = p3D.point2DForView(viewB);
						if(o2D){ // has a match for viewA=>viewB already
							found = true;
							break;
						}
					}
					add = (found==false);
				}
				if(add){
					// TODO: keep NCC as source with best NCC score
					// cellLookup[neighbor.id()+""] = {"cell":neighbor, "source":cell};
					cellLookup[neighbor.id()+""] = neighbor;
				}
			}
		}
	}
	var list = Code.arrayFromHash(cellLookup);
	*/


	// just get all
	var list = viewA.emptyNeighborCellsForView(viewB);


	var decayCheckRatio = 0.75; // 0.5 - 0.9


	var cellLookup = null; // clear
	var world = this;
	var bestMatches = [];
	// errors:
	var sigma = 3.0;
	var transform = world.transformFromViews(viewA,viewB);
	var errorFmean = transform.fMean();
	var errorFsigma = transform.fSigma();
	var errorRmean = transform.rMean();
	var errorRsigma = transform.rSigma();
	var checkErrorF = errorFmean + 1.0*errorFsigma; // source points
	var checkErrorR = errorRmean + 1.0*errorRsigma;
	var maxErrorF = errorFmean + sigma*errorFsigma; // new points
	var maxErrorR = errorRmean + sigma*errorRsigma;

	// var maxDist = viewA.cellSize()*2.0; // too obscure
	console.log("probe2d changed points to blank points: "+listA.length+" => "+list.length);
	var evaluationFxn = function(point){
		var match = point.matchForView(viewB);
		return match!=null;
	}
	for(var i=0; i<list.length; ++i){
		var empty = list[i];
		// check current error settings:
		var cellErrorF = empty.markedF();
		var cellErrorR = empty.markedR();
		if(cellErrorF==null){ // not searched yet
			cellErrorF = maxErrorF;
			cellErrorR = maxErrorR;
		}else if(cellErrorF>maxErrorF || cellErrorR>maxErrorR){
			continue; // don't re-check this cell
		}
		empty.markedF(maxErrorF*decayCheckRatio);
		empty.markedR(maxErrorR*decayCheckRatio);
		// continue
		var center = empty.center();
		var points = viewA.kNN(center,1, evaluationFxn);
		if(points.length>0){
			var point2DA = points[0];
			var point3D = point2DA.point3D();
			var bestMatch = point3D.matchForViews(viewA,viewB); // should always exist
			var bestNCC = bestMatch.errorNCC();
			var bestF = bestMatch.errorF();
			var bestR = bestMatch.errorR();
			if(!(bestF < checkErrorF && bestR < checkErrorR)){
				continue;
			}
			var affine = bestMatch.affineForViews(viewA,viewB);
			// var inverse = bestMatch.affineForViews(viewB,viewA);
			var point2DA = bestMatch.pointForView(viewA);
			var point2DB = bestMatch.pointForView(viewB);
			var centerA = point2DA.point2D();
			var centerB = point2DB.point2D();
			var newPointA = center;

			var newMatch = world.bestMatch2DFromExisting(affine,centerA,centerB, newPointA, viewA,viewB, null);

			if(newMatch){
				Stereopsis.updateErrorForMatch(newMatch);
				var fError = newMatch.errorF();
				var rError = newMatch.errorR();
				var newNCC = newMatch.errorNCC();
				var checkF = Math.min(cellErrorF,maxErrorF);
				var checkR = Math.min(cellErrorR,maxErrorR);
				if(fError<checkF || rError<checkR){
					if(newNCC < 0.30 && newNCC<=1.5*bestNCC){ // WHAT ARE TYPICAL VALUES ?
						var m3D = newMatch.point3D();
						m3D.point( m3D.calculateAbsoluteLocationDLT(world,true) );
						world.patchInitBasicSphere(false,[m3D]);
						bestMatches.push(newMatch);
					}
				}
			}
		}
	}
	console.log("probe2D: final bestMatches: "+bestMatches.length);
	// choose better candidates irst
	bestMatches.sort(function(a,b){
		a = a.errorNCC();
		b = b.errorNCC();
		return a < b ? -1 : 1;
	});
	for(var i=0; i<bestMatches.length; ++i){
		var match = bestMatches[i];
		var result = world.embedPoint3D(match.point3D());
	}
}
VALIDATED_COUNT = 0;
// Stereopsis.World.prototype.shouldValidateMatchRange = function(should){
// 	throw "don't use shouldValidateMatchRange"
// 	if(should!==undefined){
// 		this._shouldValidateMatchRange = should;
// 	}
// 	return this._shouldValidateMatchRange;
// }
Stereopsis.World.prototype.validateMatch = function(match, special){
	throw "validateMatch => use something else when match is created, not during insert/remove"
var showLog = false;
// var showLog = true;
	special = special!==undefined ? special : false;
// return true;
	// OUTSIDE:
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	if(!(viewA.isPointInside(pointA) && viewB.isPointInside(pointB))){
		if(showLog){
		console.log("DROP OUTSIDE "+pointA+" | "+pointB);
		}
		return false;
	}

/*
	// affine matrix has a limit:
// TODO: TEST THIS AGAIN
	var affine = match.affine();
if(affine){
	var a = affine.get(0,0);
	var b = affine.get(1,0);
	var c = affine.get(0,1);
	var d = affine.get(1,1);
	var eig = Code.eigenValuesAndVectors2D(a,b,c,d);
	var eigenValues = eig["values"];
	var eigenVectors = eig["vectors"];
	var valueSma = eigenValues[0];
	var valueBig = eigenValues[1];
	var vectorSma = eigenVectors[0];
	var vectorBig = eigenVectors[1];
	var valueRatio = valueBig/valueSma;
	// console.log("RATIO: "+valueRatio+" = "+valueBig+" | "+valueSma);
	var maxRatio = 2.0;
	if(valueRatio>maxRatio){
		if(showLog){
		console.log("DROP SCALE RATIO: "+valueRatio);
		}
		return false;
	}
}
*/
	
	var minRange = this._shouldValidateMatchRange;
	if(minRange){
		//var minRange = 0.04/(5*5);
		// var minRange = 0.10/(5*5)
		var minRange = 0.001; // based on size? ---- 1/255 ~ 0.004
		var range = match.range(); // range per pixel
		if(range<minRange){
			if(showLog){
			console.log("DROP RANGE: "+range);
			}
			return false;
		}
	}



/*
// if(!special){
	// ORIENTATION
	var orientation = Stereopsis.orientationTestMatch(match);
	if(!orientation){
		// console.log("DROP ORIENTATION");
		return false;
	}
// }
*/

	// HALF-ANGLE ORIETNATION CHECKING

	// MAX-DISTANCE RATIO CHECK

	// FLAT SCORES
	var scoreSAD = match.errorSAD();
	var scoreNCC = match.errorNCC();
	var scoreMult = scoreSAD * scoreNCC;

	// score constraints
	var maximumScoreSAD = 0.25; // [0.05 0.10]
	var maximumScoreNCC = 0.25; // [0.03 0.08]
	var maximumScoreMult = 0.2*0.2; // 0.04

	// LOOSE
	// var maximumScoreSAD = 0.5; // [0.05 0.10]
	// var maximumScoreNCC = 0.5; // [0.03 0.08]
	// var maximumScoreMult = 0.5*0.5; // 0.04

	// if(special){
	// 	maximumScoreSAD = 0.20;
	// 	maximumScoreNCC = 0.20;
	// 	maximumScoreMult = 0.2*0.2;
	// }


	// maximumScoreSAD = 0.50;
	// maximumScoreNCC = 0.50;


	//if(scoreSAD>0.525){

	// if(scoreSAD>maximumScoreSAD){
	// 	if(showLog){
	// 	console.log("DROP SCORE SAD: "+scoreSAD);
	// 	}
	// 	return false;
	// }
	// if(scoreNCC>maximumScoreNCC){
	// 	if(showLog){
	// 	console.log("DROP SCORE NCC: "+scoreNCC);
	// 	}
	// 	return false;
	// }

	// if(scoreMult>maximumScoreMult){ // 0.16
	// 	if(showLog){
	// 	console.log("DROP SCORE MULT: "+scoreMult);
	// 	}
	// 	return false;
	// }

	return true;
}
Stereopsis.orientationTestMatch = function(match){
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	var cellSizeA = viewA.cellSize();
	//var multi = 1.414; // 1.415; // 1.414 for root 2 = 1.41421356237
	var multi = 1.0;
	var searchRadiusA = cellSizeA*multi;
	var neighborsA = viewA.pointsInCircle(pointA, searchRadiusA);
	var cellSizeB = viewA.cellSize();
	var searchRadiusB = cellSizeB*multi;
	var neighborsB = viewB.pointsInCircle(pointB, searchRadiusB);
// console.log(searchRadiusA,searchRadiusB,neighborsA,neighborsB);
// console.log(neighborsA,neighborsB);
	var pairs = [];
	for(var i=0; i<neighborsA.length; ++i){
		var neighborA = neighborsA[i];
		var match = neighborA.matchForView(viewB);
		if(match){
			var oppositeA = match.oppositePoint(neighborA);
			if(!oppositeA){
				console.log(oppositeA,match);
			}
			pairs.push([neighborA,oppositeA]);
		}
	}
	for(var i=0; i<neighborsB.length; ++i){
		var neighborB = neighborsB[i];
		var match = neighborB.matchForView(viewA);
		if(match){
			var oppositeB = match.oppositePoint(neighborB);
			if(!oppositeB){
				console.log(oppositeB,match);
			}
			var found = false;
			for(var j=0; j<pairs.length; ++j){
				if(pairs[j][0]==oppositeB){
					found = true;
					break;
				}
			}
			if(!found){
				pairs.push([oppositeB,neighborB]);
			}
		}
	}
	if(pairs.length>1){
		var pointsA = [];
		var pointsB = [];
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var pA = pair[0].point2D();
			var pB = pair[1].point2D();
			pointsA.push(pA);
			pointsB.push(pB);
		}
		var result = Code.consistentOrientation(pointA,pointB, pointsA,pointsB);
		return result;
	}
	return true;
}
// Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.25; // too lenient
//Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.0001; // too strict
Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.1; // 10%-25% of a cell
Stereopsis.World.MIN_DISTANCE_EQUALITY_MIN = 0.50; // hard stop ~ 0.1-1.0 --- this should be in terms of TOTAL IMAGE SIZE -- NOT PIXELS?
Stereopsis.World.prototype.embedPoints3DNoValidation = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.embedPoint3DNoValidation(point3D);
	}
}
Stereopsis.World.prototype.embedPoint3DNoValidation = function(point3D){
	// throw "this is connect point"
	this.connectPoint3D(point3D);
}
/*
Stereopsis.World.prototype.connectPoint3DNoValidation = function(point3D){
	this.connectPoint3D(point3D);
}
Stereopsis.World.prototype.connectPoints3DNoValidation = function(points3D){
	if(!points3D){
		points3D = world.toPointArray();
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.connectPoint3DNoValidation(point3D);
	}
}
*/


Stereopsis.World.prototype.bestBasePointOfTwo = function(point3DA,point3DB){
	var maxErrorRatioStart = 4.0; // 2-4
	// return values
	var bestPoint = null;
	var worstPoint = null;
	var keepWorst = true;

	// pick best point -- TODO: is R or F or N better decider?
	var isErrorN = false;
	var isErrorR = false;
	var isErrorF = false;
	var isErrorNone = false;
	var errA = point3DA.averageNCCError();
	var errB = point3DB.averageNCCError();
	if(errA!==null && errB!==null){ // NCC - views (R or F)
		isErrorN = true;
	}else{ // R or F
		// errA = point3DA.averageRError();
		// errB = point3DB.averageRError();
		errA = point3DA.globalErrorR();
		errB = point3DB.globalErrorR();
		if(errA!==null && errB!==null){ // R
			isErrorR = true;
		}else{ // F
			errA = point3DA.averageFError();
			errB = point3DB.averageFError();
			if(errA!==null && errB!==null){ 
				isErrorF = true;
			}else{
				isErrorNone = true;
			}
		}
	}

	if(!isErrorNone){
		if(errA<errB){
			bestPoint = point3DA;
			worstPoint = point3DB;
		}else{
			bestPoint = point3DB;
			worstPoint = point3DA;
		}
		// drop worst point if error is too high:
		var errMax = Math.max(errA,errB);
		var errMin = Math.min(errA,errB);
		if(errMin>0 && errMax/errMin > maxErrorRatioStart){ // point B is much worse than point A
			// console.log("drop worst: "+errMin+" < "+errMax+" @ "+(errMax/errMin));
			keepWorst = false;
		}
	}else{ // no error to choose from .. just pick one ? --- tracks
		// console.log("no error to choose from?");
		var points2DA = point3DA.toPointArray();
		var points2DB = point3DB.toPointArray();
		var countLoadedImagesA = 0;
		var countLoadedImagesB = 0;
		for(var i=0; i<points2DA.length; ++i){
			var view = points2DA[i].view();
			var image = view.image();
			if(image){
				countLoadedImagesA += 1;
			}
		}
		for(var i=0; i<points2DB.length; ++i){
			var view = points2DB[i].view();
			var image = view.image();
			if(image){
				countLoadedImagesB += 1;
			}
		}
		var percentA = countLoadedImagesA/points2DA.length;
		var percentB = countLoadedImagesB/points2DB.length;
		// console.log(percentA+" v "+percentB);
		// use BASE as point with fewer images loaded
		if(percentA>percentB){
			bestPoint = point3DA;
			worstPoint = point3DB;
		}else if(percentA<percentB){
			bestPoint = point3DB;
			worstPoint = point3DA;
		}
		if(percentB==0 || percentA==0){
			console.log("no images loaded ... cant choose what to do ?");
			// bestPoint = point3DA;
			// worstPoint = point3DB;
		}
	}
	return {"best":bestPoint, "worst":worstPoint, "keep":keepWorst};
}
Stereopsis.World.prototype.combineIntersectionPoints3D = function(point3DA,point3DB){
// THIS SHOULD ALREADY BE DONE
this.disconnectPoint3D(point3DA);
this.disconnectPoint3D(point3DB);

	var world = this;
	var best = world.bestBasePointOfTwo(point3DA,point3DB);
	point3DA = best["best"];
	point3DB = best["worst"];
	var keep = best["keep"];

	if(!keep){
		world.killPoint3D(point3DB);
		// console.log("ret A");
		return point3DA;
	}
	// var doLocation = point3DA.point() && point3DB.point();
	// var doPatch = point3DA.hasPatch() && point3DB.hasPatch();

	// if(!doLocation){
	// 	console.log(point3DA);
	// 	console.log(point3DB);
	// 	throw "a point does not have a location";
	// }
	// if(!doPatch){
	// 	console.log(point3DA);
	// 	console.log(point3DB);
	// 	throw "a point does not have a patch";
	// }

	// remove from world
	// world.disconnectPoint3D(point3DA);
	// world.disconnectPoint3D(point3DB);


	// collect info
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	var viewsAllA = {};
	var viewsAllB = {};
	var viewsAll = {};
	var viewsIntersect = {};
	for(var i=0; i<points2DA.length; ++i){
		var view = points2DA[i].view();
		var viewID = view.id();
		viewsAllA[viewID] = view;
		viewsAll[viewID] = view;
	}
	for(var i=0; i<points2DB.length; ++i){
		var view = points2DB[i].view();
		var viewID = view.id();
		viewsAllB[viewID] = view;
		viewsAll[viewID] = view;
		if(viewsAllA[viewID]){
			viewsIntersect[viewID] = view;
		}
	}
	// to arrays:
	var viewsAllList = Code.objectToArray(viewsAll);
	var viewsAllAList = Code.objectToArray(viewsAllA);
	var viewsAllBList = Code.objectToArray(viewsAllB);
	var viewsIntersectList = Code.objectToArray(viewsIntersect);
	// check subsumed:
	if(viewsIntersectList.length==0){
		throw "no intersection"
	}
	// one point has all the same views, no new ones -> return best point only (even )
	if(viewsIntersectList.length==viewsAllAList.length || viewsIntersectList.length==viewsAllBList.length){
		world.killPoint3D(point3DB);
		// console.log("ret B");
		return point3DA;
	}

	// best overlapping view = closest point distance (should this be distance in cell units?)
	var relatePoint2DA = null;
	var relatePoint2DB = null;
	var relateView = null;
	var minDistance = null;
	for(var i=0; i<viewsIntersectList.length; ++i){
		var view = viewsIntersectList[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var distance = V2D.distance(p2DA,p2DB);
			distance /= view.cellSize(); // units of cell size
		if(relatePoint2DB==null || distance<minDistance){
			relatePoint2DA = point2DA;
			relatePoint2DB = point2DB;
			relateView = view;
		}
	}
	// predict new locations, thru relative point
	var newPoint2DAs = [];
	for(var i=0; i<viewsAllList.length; ++i){
		var view = viewsAllList[i];
		var viewID = view.id();
		if(viewsAllA[viewID]){ // exists in A already
			var point2DA = point3DA.pointForView(view);
			var p2DA = point2DA.point2D();
			newPoint2DAs.push(p2DA);
		}else{ // get relation thru related view
			var matchB = point3DB.matchForViews(relateView,view);
			var affineAB = matchB.affineForViews(relateView,view);
			var pointB = matchB.pointForView(view); // UNKNOWN VIEW
			var point = V2D.sub(relatePoint2DA.point2D(),relatePoint2DB.point2D()); // remove offset B(a)->A
			affineAB.multV2DtoV2D(point,point);
			point.add(pointB.point2D()); // add offset to B(b)
			newPoint2DAs.push(point);
		}
	}
	// get new affine matches
	var affines = [];
	for(var i=0; i<viewsAllList.length; ++i){
		var viewA = viewsAllList[i];
		var viewIDA = viewA.id();
		for(var j=i+1; j<viewsAllList.length; ++j){
			var viewB = viewsAllList[j];
			var viewIDB = viewB.id();
			var affine = null;
			// get match:
			if(viewsAllA[viewIDA] && viewsAllA[viewIDB]){ // exists in A
				var match = point3DA.matchForViews(viewA,viewB);
				affine = match.affineForViews(viewA,viewB);
			}else if(viewsAllB[viewIDA] && viewsAllB[viewIDB]){ // exists in B
				var match = point3DB.matchForViews(viewA,viewB);
				affine = match.affineForViews(viewA,viewB);
			}else{
				var affineA, affineB;
				if(viewsAllA[viewIDA]){ // a is in pointA
					var matchA = point3DA.matchForViews(viewA,relateView);
					affineA = matchA.affineForViews(viewA,relateView);
					var matchB = point3DB.matchForViews(relateView,viewB);
					affineB = matchB.affineForViews(relateView,viewB);
				}else{ // a is in pointB
					var matchA = point3DB.matchForViews(viewA,relateView);
					affineA = matchA.affineForViews(viewA,relateView);
					var matchB = point3DA.matchForViews(relateView,viewB);
					affineB = matchB.affineForViews(relateView,viewB);
				}
				// relate thru middle
				affine = Matrix2D.mult(affineB,affineA); // A then B
			}
			affines.push(affine);
		}
	}
	// create new point 3d from pieces:
	var point3DC = world.newPoint3DFromPieces(viewsAllList,newPoint2DAs,affines, false);
// TODO: THIS VALUE TO GET FROM SOMEWHERE ITERNAL - OR ALWAYS USE IT?
	var shouldUseNeedleHaystackIfImagesPresent = true;
	// var shouldUseNeedleHaystackIfImagesPresent = false;
	if(shouldUseNeedleHaystackIfImagesPresent){
		var needleSize = 11;
		// var needleSize = 7; // 5 - 11
		// var needleSize = 5;
		var haystackSize = needleSize + 4; // left or right 1 unit
		var needle = world._resolveIntersectionLayered_TEMP_NEEDLE;
		var haystack = world._resolveIntersectionLayered_TEMP_HAYSTACK;
		if(!needle){
			needle = new ImageMat(needleSize,needleSize);
			haystack = new ImageMat(haystackSize,haystackSize);
			world._resolveIntersectionLayered_TEMP_NEEDLE = needle;
			world._resolveIntersectionLayered_TEMP_HAYSTACK = haystack;
		}
		// var haystackSize = needleSize + 4;
		// var haystackSize = needleSize + 2;
		var ignoreNewPoint = false;
		for(var i=0; i<viewsAllBList.length; ++i){
			var viewB = viewsAllBList[i];
			var viewBID = viewB.id();
			if(!viewsAllA[viewBID]){ // not already known A location
				var imageB = viewB.imageScales();
				if(imageB){
					var locationsB2D = [];
					// var featureSizeAny = 0; // TODO .... will want percents rather than absolute sizes
					for(var j=0; j<viewsAllAList.length; ++j){
						var viewA = viewsAllAList[j];
						var imageA = viewA.imageScales();
						if(imageA){
							// console.log(" PREDICTING LOCATION FOR A: "+viewA.data()+" -> B: "+viewB.data()+"");
							var match = point3DC.matchForViews(viewA,viewB);
							var affineAB = match.affineForViews(viewA,viewB);
							var point2DA = match.pointForView(viewA);
							var point2DB = match.pointForView(viewB);
							var centerA = point2DA.point2D();
							var centerB = point2DB.point2D();
							// var featureSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
							// throw "dont use this ^ "
							// var featureSizeA = Stereopsis.compareSizeForPoint(viewA,centerA);

							var isR = true;
							var featureSizeA = viewA.compareSizeForPoint(centerA);

							// var result = R3D.optimumSADLocationSearchFlatRGB(centerA,centerB, imageA,imageB, featureSize, needleSize,haystackSize, affineAB, needle, haystack, isR);
							// var locationB2D = result["point"];
							// locationsB2D.push(locationB2D);

							// try again @ better resolution
							var locationB2D = centerB;
							var featureSetSize = featureSizeA;
							for(var r=0; r<3; ++r){ // increase resolution 
								var result = R3D.optimumSADLocationSearchFlatRGB(centerA,locationB2D, imageA,imageB, featureSetSize, needleSize,haystackSize, affineAB, needle, haystack, isR);
								var newPoint2D = result["point"];
								var locationB2D = newPoint2D;
								featureSetSize = featureSetSize*0.5;
								if(featureSetSize<needleSize){
									break;
								}
							}
							locationsB2D.push(locationB2D);
/*
// DEBUGGING DISPLAY
// throw "calc new spot"
var OFFX = 0;
// var OFFX = 40;
// if(HASCOUNT>40){
if((OFFX)<=HASCOUNT && HASCOUNT<(OFFX+40)){
// if(0<=HASCOUNT && HASCOUNT<80){
// if(40<HASCOUNT && HASCOUNT<80){

// show original poor spot
// locationB2D = centerB;

var sca = 4.0;
// var spa = 90;
var spa = 70;
// var spa = 60;


var iii = needle;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 300);
GLOBALSTAGE.addChild(d);

var iii = haystack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 400);
GLOBALSTAGE.addChild(d);


// console.log("featureSize: "+featureSize);

// var xSize  = 41;
var xSize  = 31;
var xStack = new ImageMat(xSize,xSize);
var halfCenter = (xSize-1)*0.5;

// var iScale = 0.25; // see less of image
// var iScale = 0.5;
var iScale = 1.0;
// var iScale = 2.0;
//var iScale = 4.0; // see more of image
var matrix = new Matrix2D();
var sca = 2.0;


// A
matrix.identity();
	matrix = Matrix2D.mult(matrix, affineAB);
matrix.scale(iScale);
var scale = matrix.averageScale();
ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, centerA.x,centerA.y);
imageA.extractRectFast(xStack, scale, matrix);

var iii = xStack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10);
GLOBALSTAGE.addChild(d);


// B
matrix.identity();
	// matrix = Matrix2D.mult(matrix, affineAB);
matrix.scale(iScale);
var scale = matrix.averageScale();
ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, locationB2D.x,locationB2D.y); // centerB
imageB.extractRectFast(xStack, scale, matrix);

var iii = xStack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 150);
GLOBALSTAGE.addChild(d);

}

++HASCOUNT;
*/
// if(HASCOUNT>10){
// if(HASCOUNT>25){
// if(HASCOUNT>40){
// 	throw "HASCOUNT limit";
// }

							}
						}
						if(locationsB2D.length>0){ // average predicted locations
							var locationB2D = V2D.average(locationsB2D);
							var distance = V2D.distance(point2DB.point2D(),locationB2D);
							// console.log("LOOK FOR OPTIMUM LOCATION DISTANCE: "+distance+"  ... "+viewB.data()+" "+HASCOUNT);

// throw "show these points & evaluate performance ..."

							// var maxDistance = 0.05 * imageB.size().length();
							// var maxDistance = featureSizeAny*0.5;


							var featureSizeB = viewB.compareSizeForPoint(locationB2D);
							var maxDistance = featureSizeB*0.5;


							if(distance<maxDistance){
								var point2DB = point3DC.pointForView(viewB);
								point2DB.point2D(locationB2D);
							}else{
								// console.log("erronious ... PRINT THIS OUT: "+distance+" > "+maxDistance);
								ignoreNewPoint = true;
							}
						}
					}
				}
			}
	}
	if(ignoreNewPoint){ // merge failed - keep original best point
		world.killPoint3D(point3DB);
		world.killPoint3D(point3DC);
		// console.log("ret C");
		return point3DA;
	}

	// // is this necessary ?
	// var matches = point3DC.toMatchArray();
	// for(var i=0; i<matches.length; ++i){
	// 	var match = matches[i];
	// 	world.updateMatchInfo(match);
	// 	// TODO: is this OK?
	// 	Stereopsis.updateErrorForMatch(match);
	// }
	// Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);


	world.updatePoint3DFromMerge(point3DC, point3DA,point3DB);
	

	// if(doLocation){
	// 	var location3D = point3D.globalPoint3DLinear();
	// 	point3DC.point(location3D);
	// }
	// if(doPatch){
	// 	// world.initPoint3DPatchSphere(point3D);
	// 	// world.initPoint3DAffineFromPatch(point3D);
	// 	world.initNewPointPatch3D(point3DC);
	// }else{
	// 	throw "set as doPatch = false";
	// }

	world.killPoint3D(point3DA);
	world.killPoint3D(point3DB);
	// console.log("ret D");
	return point3DC;
}
Stereopsis.World.prototype.debugVaidateP3D = function(point3D){
	// if(!point3D.hasPatch()){
	// 	console.log(point3D);
	// 	throw "combined doesn't have patch";
	// }
	var points2D = point3D.toPointArray();
	if(!points2D || points2D.length==0){
		console.log(point3D);
		throw "no points 2D";
	}
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		if(!point2D){
			console.log(point2D);
			console.log(points2D);
			console.log(i);
			console.log(point3D);
			throw "missing a point?";
		}
	}
}
Stereopsis.World.prototype.recursiveEmbedPoint3D = function(point3D){
// is this necessary?
this.disconnectPoint3D(point3D);
// this.disconnectPoint3D(point3DB);
	var overlap2D = point3D.checkOverlapPoints2D();
	if(overlap2D){
		var opposite3D = overlap2D.point3D();
		this.disconnectPoint3D(opposite3D);
		var combined3D = this.combineIntersectionPoints3D(point3D,opposite3D);
		if(combined3D){
			this.debugVaidateP3D(combined3D);
			return this.recursiveEmbedPoint3D(combined3D);
		}
		return null;
	}else{
		this.connectPoint3D(point3D);
		return point3D;
	}
}
Stereopsis.World.prototype.recursiveEmbedPoints3D = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		this.recursiveEmbedPoint3D(points3D[i]);
	}
}
/*
Stereopsis.World.prototype.embedPoint3D = function(point3D, validCheck){ // insert the P3D into the various views -> checks for intersection first (and calls resolve intersection)
	throw "phase out - use "
	// console.log("embedPoint3D: "+point3D.point());
	var checkIntersection = this.checkForIntersections();
	validCheck = validCheck!==undefined ? validCheck : true;
	if(validCheck){
		var matches = point3D.toMatchArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var valid = this.validateMatch(match);
			if(!valid){
// console.log("not valid ... "+point3D.point());
				this.disconnectPoint3D(point3D);
				return null;
			}
		}
	}
	// check collisions in 2D
	var views = point3D.toViewArray();
	var intersectionP3D = null;
	if(checkIntersection){
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var minDistance = view.mergeDistance();
			var point2D = point3D.point2DForView(view);
			var closest = view.closestPoint2D(point2D);
			if(closest){
				var dist = V2D.distance(point2D.point2D(), closest.point2D());
				if(dist<minDistance){
					// var scale = 1;
					// console.log((dist*scale)+" < "+(minDistance*scale));
					// console.log(point2D.point2D(), closest.point2D());
					// console.log(closest.point3D(), point3D);
					intersectionP3D = closest;
					break;
				}
			}
		}
	}
	if(intersectionP3D){
		intersectionP3D = intersectionP3D.point3D();
		// console.log(" ... resolve intersection");
		return this.resolveIntersection(point3D,intersectionP3D);
	}else{
		// console.log(" ... connect point");
		this.connectPoint3D(point3D);
		// this.validatePoint3DAll(point3D);
		return point3D;
	}
}
*/
Stereopsis.World.prototype.validatePoint3DAll = function(point3D){
	// points2d point to point3d

	//

	// has one point2d for every view
	// has one view for every point2d

	// every 2 points has a match
	// has a match for every 2 points
}
// merge / split conflicting points
Stereopsis.World.prototype._resolveIntersectionMatchScore = function(point3DA,point3DB){
	// var doSimple = this._intersectionResolve2D == Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE;
	// if(doSimple){
	return this._resolveIntersectionSimpleBestMatchScore(point3DA,point3DB);
}
Stereopsis.World.prototype._resolveIntersectionPatchGeometry = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		return this._resolveIntersectionPatchGeometryImplementation(point3DA,point3DB);
	}
	console.log(point3DA,point3DB);
	throw " no patches for P3Ds?  _resolveIntersectionPatchGeometry"
}
Stereopsis.World.prototype._resolveIntersectionPatchVisuals = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		this._resolveIntersectionPatchViewsLoaded(point3DA,point3DB);
	}
	throw " no patches for P3Ds?"
}
Stereopsis.World.prototype._resolveIntersectionDefault = function(point3DA,point3DB){
	return this._resolveIntersectionLayered(point3DA,point3DB);
}
Stereopsis.World.prototype._resolveIntersectionDefaultOLD = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		// console.log("has patch ...");
		return this._resolveIntersectionPatch(point3DA,point3DB);
	}
	// console.log("no patch ...");
	return this._resolveIntersectionFlat(point3DA,point3DB);
}


HASCOUNT = 0;


Stereopsis.World.prototype._resolveIntersectionLayered = function(point3DA,point3DB){
	throw "move to other: combineIntersectionPoints3D"
	var isR = true; // where to get this ?
	// console.log("_resolveIntersectionLayered");
	var world = this;
	var maxErrorRatioStart = 4.0; // 2-4
	var doPatch = point3DA.hasPatch() && point3DB.hasPatch(); // should init pointC with a patch
	var doLocation = point3DA.point() && point3DB.point();
	// remove from world
	world.disconnectPoint3D(point3DA);
	world.disconnectPoint3D(point3DB);

	// pick best point
	var isErrorN = false;
	var isErrorR = false;
	var isErrorF = false;
	var isErrorNone = false;
	var errA = point3DA.averageNCCError();
	var errB = point3DB.averageNCCError();
	if(errA!==null && errB!==null){ // NCC - views (R or F)
		isErrorN = true;
	}else{ // R or F
		errA = point3DA.averageRError();
		errB = point3DB.averageRError();
		if(errA!==null && errB!==null){ // R
			isErrorR = true;
		}else{ // F
			errA = point3DA.averageFError();
			errB = point3DB.averageFError();
			if(errA!==null && errB!==null){ 
				isErrorF = true;
			}else{
				isErrorNone = true;
			}
		}
	}
// console.log("this far 0: "+isErrorR+" | "+isErrorF+" | "+isErrorN+" | "+isErrorNone+" | ");
	// no metric to choose
	var useOnlyImageLocationPredictions = true;
	if(!isErrorNone){
		var best = errA<errB ? point3DA : point3DB;
		if(best!=point3DA){
			var temp = point3DB;
			point3DB = point3DA;
			point3DA = temp;
		}
		// drop worst point if error is too high:
		var errMax = Math.max(errA,errB);
		var errMin = Math.min(errA,errB);
		if(errMin>0 && errMax/errMin > maxErrorRatioStart){ // point B is much worse than point A
			// console.log("drop worst: "+errMin+" < "+errMax+" @ "+(errMax/errMin));
			world.disposePoint3DAncestor(point3DB);
			world.killPoint3D(point3DB);
			return world.embedPoint3D(point3DA);
		}
	}else{ // no error to choose from .. just pick one ? --- tracks
		// console.log("no error to choose from?");
		var points2DA = point3DA.toPointArray();
		var points2DB = point3DB.toPointArray();
		// var allViewsA = [];
		// var allViewsB = [];
		var countLoadedImagesA = 0;
		var countLoadedImagesB = 0;
		for(var i=0; i<points2DA.length; ++i){
			var view = points2DA[i].view();
				// allViewsA.push(view);
			var image = view.image();
			// console.log(image);
			if(image){
				countLoadedImagesA += 1;
			}
		}
		for(var i=0; i<points2DB.length; ++i){
			var view = points2DB[i].view();
			var image = view.image();
			// console.log(image);
			if(image){
				countLoadedImagesB += 1;
			}
		}
		var percentA = countLoadedImagesA/points2DA.length;
		var percentB = countLoadedImagesB/points2DB.length;
		// console.log(percentA+" v "+percentB);
		// use BASE as point with fewer images loaded
		if(percentB<percentA){
			var temp = point3DB;
			point3DB = point3DA;
			point3DA = temp;
		}
		useOnlyImageLocationPredictions = true;
		if(percentB==0 || percentA==0){
			// console.log(percentA);
			// console.log(percentB);
			// console.log(point3DA);
			// console.log(point3DB);
			// throw "no images loaded ... cant choose what to do ?";
			console.log("no images loaded ... cant choose what to do ?");
		}
		// choose A = point with fewer views loaded (or fewer % of images loaded) = BASE
		// => B = more images loaded (adjustable)
		// console.log(point3DA);
		// console.log(point3DB);
		// throw "?"
	}
// throw "solve intersectioning"
	// find view statuses
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	var viewsAllA = {};
	var viewsAllB = {};
	var viewsAll = {};
	var viewsIntersect = {};
	for(var i=0; i<points2DA.length; ++i){
		var view = points2DA[i].view();
		var viewID = view.id();
		viewsAllA[viewID] = view;
		viewsAll[viewID] = view;
	}
	for(var i=0; i<points2DB.length; ++i){
		var view = points2DB[i].view();
		var viewID = view.id();
		viewsAllB[viewID] = view;
		viewsAll[viewID] = view;
		if(viewsAllA[viewID]){
			viewsIntersect[viewID] = view;
		}
	}
// console.log("this far A");
	// to arrays:
	var viewsAllList = Code.objectToArray(viewsAll);
	var viewsAllAList = Code.objectToArray(viewsAllA);
	var viewsAllBList = Code.objectToArray(viewsAllB);
	var viewsIntersectList = Code.objectToArray(viewsIntersect);
	// check subsumed:
	if(viewsIntersectList.length==0){
		throw "no intersection"
	}
	if(viewsIntersectList.length==viewsAllAList.length || viewsIntersectList.length==viewsAllBList.length){
// console.log("same point count: "+errMin+" - "+errMax);
		// kill works always:
		world.disposePoint3DAncestor(point3DB);
		world.killPoint3D(point3DB);
		return world.embedPoint3D(point3DA);
		/*
		// kill item with fewer points:
		if(viewsAllAList.length>=viewsAllBList.length){
			world.killPoint3D(point3DB);
			return world.embedPoint3D(point3DA);
		}
		world.killPoint3D(point3DA);
		return world.embedPoint3D(point3DB);
		*/
	}
// console.log("this far B");
	// best overlapping view = closest point distance (should this be distance in cell units)
	var relatePoint2DA = null;
	var relatePoint2DB = null;
	var relateView = null;
	var minDistance = null;
	for(var i=0; i<viewsIntersectList.length; ++i){
		var view = viewsIntersectList[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var distance = V2D.distance(p2DA,p2DB);
			distance /= view.cellSize(); // units of cell size
		if(relatePoint2DB==null || distance<minDistance){
			relatePoint2DA = point2DA;
			relatePoint2DB = point2DB;
			relateView = view;
		}
	}
	// predict new locations, thru relative point
	var newPoint2DAs = [];
	for(var i=0; i<viewsAllList.length; ++i){
		var view = viewsAllList[i];
		var viewID = view.id();
		if(viewsAllA[viewID]){ // exists in A already
			var point2DA = point3DA.pointForView(view);
			var p2DA = point2DA.point2D();
			newPoint2DAs.push(p2DA);
		}else{ // get relation thru related view
			var matchB = point3DB.matchForViews(relateView,view);
			var affineAB = matchB.affineForViews(relateView,view);
			var pointB = matchB.pointForView(view); // UNKNOWN VIEW
			var point = V2D.sub(relatePoint2DA.point2D(),relatePoint2DB.point2D()); // remove offset B(a)->A
			affineAB.multV2DtoV2D(point,point);
			point.add(pointB.point2D()); // add offset to B(b)
			newPoint2DAs.push(point);
		}
	}
// TODO: is there a case affines wont exists?
	// get new affine matches
	var affines = [];
	for(var i=0; i<viewsAllList.length; ++i){
		var viewA = viewsAllList[i];
		var viewIDA = viewA.id();
		for(var j=i+1; j<viewsAllList.length; ++j){
			var viewB = viewsAllList[j];
			var viewIDB = viewB.id();
			var affine = null;
			// get match:
			if(viewsAllA[viewIDA] && viewsAllA[viewIDB]){ // exists in A
				var match = point3DA.matchForViews(viewA,viewB);
				affine = match.affineForViews(viewA,viewB);
			}else if(viewsAllB[viewIDA] && viewsAllB[viewIDB]){ // exists in B
				var match = point3DB.matchForViews(viewA,viewB);
				affine = match.affineForViews(viewA,viewB);
			}else{
				var affineA, affineB;
				if(viewsAllA[viewIDA]){ // a is in pointA
					var matchA = point3DA.matchForViews(viewA,relateView);
					affineA = matchA.affineForViews(viewA,relateView);
					var matchB = point3DB.matchForViews(relateView,viewB);
					affineB = matchB.affineForViews(relateView,viewB);
				}else{ // a is in pointB
					var matchA = point3DB.matchForViews(viewA,relateView);
					affineA = matchA.affineForViews(viewA,relateView);
					var matchB = point3DA.matchForViews(relateView,viewB);
					affineB = matchB.affineForViews(relateView,viewB);
				}
				// relate thru middle
				affine = Matrix2D.mult(affineB,affineA); // A then B
			}
			affines.push(affine);
		}
	}
	// create new point 3d from pieces:
	var point3DC = world.newPoint3DFromPieces(viewsAllList,newPoint2DAs,affines, false);
	// get needle-haystack for loaded views
		// each loaded view A gets a chance to predict location in B-only view
	// console.log("needle - haystack");

	// TODO: THIS VALUE TO GET FROM SOMEWHERE ITERNAL - OR ALWAYS USE IT?
	var shouldUseNeedleHaystackIfImagesPresent = true;
	// var shouldUseNeedleHaystackIfImagesPresent = false;

// console.log("this far C");
	if(shouldUseNeedleHaystackIfImagesPresent){
// throw "inside  shouldUseNeedleHaystackIfImagesPresent"
		// var needleSize = Stereopsis.COMPARE_HAYSTACK_NEEDLE_SIZE;
		var needleSize = 11;
		// var needleSize = 7; // 5 - 11
		// var needleSize = 5;
		// var needleSize = 5;
		var haystackSize = needleSize + 4; // left or right 1 unit
		var needle = world._resolveIntersectionLayered_TEMP_NEEDLE;
		var haystack = world._resolveIntersectionLayered_TEMP_HAYSTACK;
		if(!needle){
			needle = new ImageMat(needleSize,needleSize);
			haystack = new ImageMat(haystackSize,haystackSize);
			world._resolveIntersectionLayered_TEMP_NEEDLE = needle;
			world._resolveIntersectionLayered_TEMP_HAYSTACK = haystack;
		}


// throw "if images are loaded, only use image-estimated 2D location"
/*
		if(useOnlyImageLocationPredictions){
			// 

			// var viewsAllBList = Code.objectToArray(viewsAllB);
			// var viewsIntersectList = Code.objectToArray(viewsIntersect);
			console.log(point3DC);
			console.log(viewsIntersectList);
			console.log(viewsAllBList);

			// for each new point that B brings along [must have an image]
				// for each intersection point in A [with image]


			throw "... useOnlyImageLocationPredictions";



			throw "..."
		}else{
*/
			// var haystackSize = needleSize + 4;
			// var haystackSize = needleSize + 2;
			var ignoreNewPoint = false;
			for(var i=0; i<viewsAllBList.length; ++i){
				var viewB = viewsAllBList[i];
				var viewBID = viewB.id();
				if(!viewsAllA[viewBID]){ // not already known A location
					var imageB = viewB.imageScales();
					if(imageB){
						var locationsB2D = [];
						var featureSizeAny = 0; // TODO .... will want percents rather than absolute sizes
						for(var j=0; j<viewsAllAList.length; ++j){
							var viewA = viewsAllAList[j];
							var imageA = viewA.imageScales();
							if(imageA){
								// console.log(" PREDICTING LOCATION FOR A: "+viewA.data()+" -> B: "+viewB.data()+"");
								var match = point3DC.matchForViews(viewA,viewB);
								var affineAB = match.affineForViews(viewA,viewB);
								var point2DA = match.pointForView(viewA);
								var point2DB = match.pointForView(viewB);
								var centerA = point2DA.point2D();
								var centerB = point2DB.point2D();
								var featureSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
								featureSizeAny = featureSize;
								// TODO: needleSize,haystackSize - can be reused
								// bestNeedleHaystackFromLocation
								// throw "here?"

								// var result = R3D.optimumSADLocationSearchFlatRGB(centerA,centerB, imageA,imageB, featureSize, needleSize,haystackSize, affineAB, needle, haystack, isR);
								// var locationB2D = result["point"];
								// locationsB2D.push(locationB2D);

// try again @ better resolution
								var locationB2D = centerB;
								var featureSetSize = featureSize;
								for(var r=0; r<3; ++r){ // increase resolution 
									var result = R3D.optimumSADLocationSearchFlatRGB(centerA,locationB2D, imageA,imageB, featureSetSize, needleSize,haystackSize, affineAB, needle, haystack, isR);
									var newPoint2D = result["point"];
									var locationB2D = newPoint2D;
									featureSetSize = featureSetSize*0.5;
									if(featureSetSize<needleSize){
										break;
									}
								}

								locationsB2D.push(locationB2D);

// throw "calc new spot"
var OFFX = 0;
// var OFFX = 40;
// if(HASCOUNT>40){
if((OFFX)<=HASCOUNT && HASCOUNT<(OFFX+40)){
// if(0<=HASCOUNT && HASCOUNT<80){
// if(40<HASCOUNT && HASCOUNT<80){

// show original poor spot
// locationB2D = centerB;

var sca = 4.0;
// var spa = 90;
var spa = 70;
// var spa = 60;


var iii = needle;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 300);
GLOBALSTAGE.addChild(d);

var iii = haystack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 400);
GLOBALSTAGE.addChild(d);


// console.log("featureSize: "+featureSize);

// var xSize  = 41;
var xSize  = 31;
var xStack = new ImageMat(xSize,xSize);
var halfCenter = (xSize-1)*0.5;

// var iScale = 0.25; // see less of image
// var iScale = 0.5;
var iScale = 1.0;
// var iScale = 2.0;
//var iScale = 4.0; // see more of image
var matrix = new Matrix2D();
var sca = 2.0;


// A
matrix.identity();
	matrix = Matrix2D.mult(matrix, affineAB);
matrix.scale(iScale);
var scale = matrix.averageScale();
ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, centerA.x,centerA.y);
imageA.extractRectFast(xStack, scale, matrix);

var iii = xStack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10);
GLOBALSTAGE.addChild(d);


// B
matrix.identity();
	// matrix = Matrix2D.mult(matrix, affineAB);
matrix.scale(iScale);
var scale = matrix.averageScale();
ImageMatScaled.affineToLocationTransform(matrix,matrix, halfCenter,halfCenter, locationB2D.x,locationB2D.y); // centerB
imageB.extractRectFast(xStack, scale, matrix);

var iii = xStack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + spa*(HASCOUNT-OFFX), 0 + 10 + 150);
GLOBALSTAGE.addChild(d);

}

++HASCOUNT;

// if(HASCOUNT>10){
// if(HASCOUNT>25){
// if(HASCOUNT>40){
// 	throw "HASCOUNT limit";
// }

							}
						}
						if(locationsB2D.length>0){ // average predicted locations
							var locationB2D = V2D.average(locationsB2D);
							var distance = V2D.distance(point2DB.point2D(),locationB2D);
							// console.log("LOOK FOR OPTIMUM LOCATION DISTANCE: "+distance+"  ... "+viewB.data()+" "+HASCOUNT);



// throw "show these points & evaluate performance ..."




							// var maxDistance = 0.05 * imageB.size().length();
							var maxDistance = featureSizeAny*0.5;
							if(distance<maxDistance){
								var point2DB = point3DC.pointForView(viewB);
								point2DB.point2D(locationB2D);
							}else{
								// console.log("erronious ... PRINT THIS OUT: "+distance+" > "+maxDistance);
								ignoreNewPoint = true;
							}
						}
					}
				}
			}
/*
		}
*/
		// update scores:
		// point3DC.???
		// updateMatchInfo
	}

	if(ignoreNewPoint){
		// console.log("ignoreNewPoint ...");
		// point3DC.ancestor(point3DB.ancestor());
		world.killPoint3D(point3DB);
		world.killPoint3D(point3DC);
		// keep original point:
		return world.embedPoint3D(point3DA);
	}

// throw "before continue";

	// is this necessary ?
	var matches = point3DC.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		world.updateMatchInfo(match);
		// TODO: is this OK?
		Stereopsis.updateErrorForMatch(match);
	}
	// Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);

	if(doLocation){
		var location3D = point3DC.estimated3D();
		point3DC.point(location3D);
	}
	if(doPatch){
		// COULD AVERAGE PATCH, THEN UPDATE ONLY ?
		world.initP3DPatchFromMode(point3DC);
	}


	// ... should this always be done? -- error needs to be updated if possible for next intersection
	// world.updatePoints3DErrors([point3DC]);

	// USE WORSE ANCESTOR, PREVIOUSLY FOUND TO BE B ["contaminated"]
	point3DC.ancestor(point3DB.ancestor());

	world.killPoint3D(point3DA);
	world.killPoint3D(point3DB);
	return world.embedPoint3D(point3DC);
}
Stereopsis.World.prototype._resolveIntersectionGeometry = function(point3DA,point3DB){ // merge only knowing relative R error and affine transforms
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	// console.log(point3DA);
	// console.log(point3DB);
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	// console.log(viewsA);
	// console.log(viewsB);
	var allViews = {};
	var intersectViews = [];
	var singleAViews = [];
	var singleBViews = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA  = viewsA[i];
		allViews[viewA.id()] = viewA;
	}
	for(var i=0; i<viewsB.length; ++i){
		var viewB  = viewsB[i];
		allViews[viewB.id()] = viewB;
	}
	allViews = Code.objectToArray(allViews);
	// find intersections:
	var intersectLimit = 1; // 1 pixel -- TODO: image size dependent ... ~0.001 to 1px ?
	// var intersectLimit = 0.1;
	// intersect
	var distances = [];
	var overDistance = [];
	var anyOver = false;
	var closestIntersectingView = null;
	var closestIntersectingDistance = null;
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		if(point2DA && point2DB){
			intersectViews.push(view);
			var distance = V2D.distance(point2DA.point2D(), point2DB.point2D());
			distances.push(distance);
			if(closestIntersectingDistance===null || closestIntersectingDistance>distance){
				closestIntersectingDistance = distance;
				closestIntersectingView = view;
			}
			if(distance>intersectLimit){ //
				// throw "off?: "+distance;
			}
		}else if(point2DA){
			singleAViews.push(view);
		}else if(point2DB){
			singleBViews.push(view);
		}
	}
	if(closestIntersectingView==null){
		throw "should have at least 1 intersection";
	}
	var errorRA = point3DA.averageRError();
	var errorRB = point3DB.averageRError();
	// return more supersuming or better point
	if(singleAViews.length==0 && singleBViews.length==0){
		var countA = point3DA.point2DCount();
		var countB = point3DB.point2DCount();
		// TODO: CREATE NEW POINT, NOT OLD ONE:
		if(countA>countB){
			return point3DA;
		}else if(countB>countA){
			return point3DB;
		}
		// console.log(errorRA+" ? "+errorRB);
		if(errorRA<=errorRB){
			return point3DA;
		}
		return point3DB;
	}
	// pick dominant point & create new points
	var pointDom = null;
	var pointSub = null;
	if(viewsA.length>viewsB.length){
		pointDom = 0;
	}else if(viewsB.length>viewsA.length){
		pointDom = 1;
	}else if(errorRA<=errorRB){
		pointDom = 0;
	}else{
		pointDom = 1;
	}
	if(pointDom==0){
		pointDom = point3DA;
		pointSub = point3DB;
	}else{
		pointDom = point3DB;
		pointSub = point3DA;
	}
	// get list of all points of dom
	

	// on-demand patch making

	if(!pointDom.hasPatch()){
		this.patchInitBasicSphere(true, [pointDom], null, true);
	}
	if(!pointSub.hasPatch()){
		this.patchInitBasicSphere(true, [pointSub], null, true);
	}

	// console.log(viewsA);
	// console.log(viewsB);
	// console.log(singleAViews);
	// console.log(singleBViews);
	// console.log(intersectViews);
	// find base offset
	var pointB0 = pointDom.pointForView(closestIntersectingView);
	var pointS0 = pointSub.pointForView(closestIntersectingView);
	// console.log(pointB0,pointS0);
	var pointB0p = pointB0.point2D();
	var pointS0p = pointS0.point2D();
	// console.log(pointB0p,pointS0p);
	var localBS = V2D.sub(pointB0p,pointS0p);
	var distanceBS = localBS.length();
	// console.log("distanceBS: "+distanceBS);
	// 
	// var delta = new V2D();
	var point2Ds = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var pointA = pointDom.pointForView(view);
		if(pointA){ // A has already
			point2Ds.push(pointA.point2D());
		}else{ // only in B
			var pointB = pointSub.pointForView(view);
			var match = pointSub.matchForViews(closestIntersectingView,view);
			// console.log(match);
			var affine = match.affineForViews(closestIntersectingView,view);
			// console.log(affine);
			var p = affine.multV2DtoV2D(localBS);
			p.add(pointB.point2D());
			point2Ds.push(p);
		}
	}
	var p3D = V3D.avg(pointDom.point(),pointSub.point());
	var n3D = V3D.avg(pointDom.normal(),pointSub.normal());
	var s3D = Code.averageNumbers([pointDom.size(),pointSub.size()]);
	// console.log(s3D);
	
	var point3DC = this.newPoint3DFromPieces(allViews,point2Ds,null, false);
	point3DC.point(p3D);
	// point3DC.normal(n3D);
	// point3DC.size(s3D);
	// console.log(pointDom);
	// console.log(pointSub);
	// console.log(point3DC);
	// need patch for future collisions
	this.patchInitBasicSphere(true, [point3DC], null, true);
// console.log(point3DC);
// throw "done";
	// return point3DC;
	return this.embedPoint3D(point3DC);
}
Stereopsis.World.prototype._resolveIntersectionDumb = function(point3DA,point3DB){ // merge intersecting views & drop conflicting views
	/*
		 ... 
	*/
	throw "TODO";
}
Stereopsis.World.prototype._resolveIntersectionPatchViewsLoaded = function(point3DA,point3DB){
	var world = this;
	var best, temp;
	// remove
	world.disconnectPoint3D(point3DA);
	world.disconnectPoint3D(point3DB);
	
/*
	if A subsumes B or B subsumes A:
		pick point:
			- longer track?
			- lower error
	
	affine branch view = intersection view with closest overlap [V2D distance]

	get affine path from all views in A to all views in B

	double views: pick 2D point with lowest P3D error?

	for loaded views in B:
		- pick best matching point in extracted image area
	for unloaded views in B:
		- ???

	get NCC scores in:
		A-A
		B-B
		A-B

	only add new points if pass some threshold:
		- score < global(mean+sig) && score < local(mean+sig)	
*/

	// if there are not any views loaded in point a -> throw
	if(world._resolvePatchVisualsCallback){
		world._resolvePatchVisualsCallback(point3DA,point3DB);
	}
		// world.embedPoint3D(point3DA);
	throw "at least 1 view from each needs to be loaded & patches need to exist [other than intersection view]";


}

Stereopsis.World.prototype._resolveIntersectionPatchGeometryImplementation = function(point3DA,point3DB){ // ???
	var world = this;
	// console.log("_resolveIntersectionPatchGeometryImplementation");
	// remove
	world.disconnectPoint3D(point3DA);
	world.disconnectPoint3D(point3DB);
	// calculate reprojection error for A & B + get better of 2
	var info = world._P3DReprojectionBestPoint(point3DA,point3DB);
	// console.log(info);
	var infoA = info["A"];
	var infoB = info["B"];
	point3DA = infoA["point"];
	point3DB = infoB["point"];
	var viewsA = infoA["views"];
	var viewsB = infoB["views"];
	var lookupA = infoA["lookup"];
	var lookupB = infoB["lookup"];
	// find separate & overlapping views:
	var separateA = [];
	var separateB = [];
	var overlapAB = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		if(lookupB[viewA.id()]){
			overlapAB.push(viewA);
		}else{
			separateA.push(viewA);
		}
	}
	for(var i=0; i<viewsB.length; ++i){
		var viewB = viewsB[i];
		if(lookupA[viewB.id()]){
		}else{
			separateB.push(viewB);
		}
	}
	// console.log(separateA);
	// console.log(separateB);
	// console.log(overlapAB);
	if(overlapAB.length==0){
		throw "no intersection of views";
	}
	if(separateA==0){
		if(separateB==0){
			// console.log("keep A");
			world.killPoint3D(point3DB);
			return world.embedPoint3D(point3DA);

		}else{ // 
			// console.log("keep all of A & separate B points up?");
		}
		world.killPoint3D(point3DA);
		return world.embedPoint3D(point3DB);
		throw "subsumed by B";
	}
	if(separateB==0){
		// console.log("keep A");
			world.killPoint3D(point3DB);
		return world.embedPoint3D(point3DA);
		throw "subsumed by A";
	}
	if(false && overlapAB.length>1){ // TODO: FIND BEST VIEW TO USE
		console.log(".................")
		console.log(separateA);
		console.log(separateB);
		console.log(overlapAB);
		throw "find 'closest' intersection view";
		// get lowest-distance intersection view
	}
	var intView = overlapAB[0];
	var int2DA = point3DA.pointForView(intView);
	var int2DB = point3DB.pointForView(intView);
	var intA = int2DA.point2D();
	var intB = int2DB.point2D();
	var intBtoA = V2D.sub(intA,intB);
	// console.log("intBtoA: "+intBtoA+" @ "+intA+" & "+intB);
	// current views A
	var allViews = [];
	for(var i=0; i<separateA.length; ++i){
		var viewA = separateA[i];
		allViews.push(viewA);
	}
	for(var i=0; i<overlapAB.length; ++i){
		var viewA = overlapAB[i];
		allViews.push(viewA);
	}
	// current points A
	var allPoints2D = [];
	for(var i=0; i<allViews.length; ++i){
		var viewA = allViews[i];
		var pointA = point3DA.pointForView(viewA);
		var p = pointA.point2D();
		allPoints2D.push(p);
	}
	// new points / views
	// calc where pt A would-be in B based on relative transforms
	for(var i=0; i<separateB.length; ++i){
		var viewB = separateB[i];
		var pointB = point3DB.pointForView(viewB);
		var match = point3DB.matchForViews(intView, viewB);
		var affine = match.affineForViews(intView, viewB);
		var point = affine.multV2DtoV2D(intBtoA);
			point.add(pointB.point2D());
// console.log("pointb : "+point);
		allViews.push(viewB);
		allPoints2D.push(point.copy()); 
	}
	// calc 3D point for each individual match
// console.log("allPoints2D: "+allPoints2D);
	var point3DC = world.newPoint3DFromPieces(allViews,allPoints2D,null,false);
// console.log(" 2: "+point3DC.toPointArray().map(function(a){return a.point2D()}));
// throw "what?"
		// setup individual matches
		world.updatePoints3DNullLocations([point3DC]);
		// setup point location
		point3DC.calculateAbsoluteLocationDLT(world);
		// setup point patch
		world.patchInitBasicSphere(true,[point3DC]);
	// average matches into single point using relative error
	// calc reprojection error for each view using point C
	// var infoC = world._P3DReprojectionInfo(point3DC);
	// console.log(infoC);
	// if all errors <  2*sigma of previous points => keep C
		// init C patch [average old patch or do INIT]
	// else: remove intersecting points in B ; add back A ; add back B if viewCount > 0
/*
	var pts = [point3DA,point3DB,point3DC];
	for(var i=0; i<pts.length; ++i){
		var pt = pts[i].toPointArray();
		for(var j=0; j<pt.length; ++j){
			var p = pt[j];
			console.log(" "+i+":"+j+" = "+p.view().id()+" @ "+p.point2D());
		}
	}
	console.log(""+point3DC);
*/
	world.killPoint3D(point3DA);
	world.killPoint3D(point3DB);
// console.log("NEXT ....")
	return world.embedPoint3D(point3DC);
}
Stereopsis.World.prototype._P3DReprojectionBestPoint = function(point3DA,point3DB){
	var world = this;
	var infoA = world._P3DReprojectionInfo(point3DA);
	var infoB = world._P3DReprojectionInfo(point3DB);
	var errorA = infoA["error"];
	var errorB = infoB["error"];
	if(errorB<errorA){ // swap
		var temp = infoA;
		infoA = infoB;
		infoB = temp;
	}
	return {"A":infoA, "B":infoB};
}
Stereopsis.World.prototype._P3DReprojectionInfo = function(point3D){
	var p3D = point3D.point();
	var points2D = point3D.toPointArray();
	var views = [];
	var errors = [];
	var totalError = 0;
	var count = points2D.length;
	var lookup = {};
	if(count>0){
		for(var i=0; i<count; ++i){
			var point2D = points2D[i];
			var view = point2D.view();
			var cellSize = view.cellSize();
				views[i] = view;
				lookup[view.id()] = view;
			var p2D = point2D.point2D();
			var extrinsic = view.absoluteTransform();
			var K = view.K();
			var error = R3D.reprojectionErrorSingle(p3D, p2D, extrinsic, K);
				error /= cellSize; // image size -> cells
				totalError += error;
				errors[i] = error;
		}
		totalError /= count;
	}
	return {"point":point3D ,"views":views, "lookup":lookup, "points":points2D, "errors":errors, "error":totalError};
}
Stereopsis.World.prototype._resolveIntersectionPatch = function(point3DA,point3DB){
	var world = this;
	var temp;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	if(points2DA.length<points2DB.length){ // swap
		temp = point3DA;
		point3DA = point3DB;
		point3DB = temp;
		temp = points2DA;
		points2DA = points2DB;
		points2DB = temp;
	}
	// union
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	var allViews = Code.copyArray(viewsA);
	var intersectViews = [];
	var singleAViews = [];
	var singleBViews = [];
	for(var i=0; i<viewsB.length; ++i){
		Code.addUnique(allViews,viewsB[i]);
	}
	var intersectLimit = 1; // 1 pixel -- TODO: image size dependent ... ~0.001 to 1px ?
	// var intersectLimit = 0.1;
	// intersect
	var distances = [];
	var overDistance = [];
	var anyOver = false;
	// var allUnder;
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		if(point2DA && point2DB){
			intersectViews.push(view);
			var distance = V2D.distance(point2DA.point2D(), point2DB.point2D());
			distances.push(distance);
			if(distance>intersectLimit){ //
				anyOver = true;
				overDistance.push(true);
			}else{
				overDistance.push(false);
			}
		}else if(point2DA){
			singleAViews.push(view);
		}else if(point2DB){
			singleBViews.push(view);
		}
	}
	if(intersectViews.length==0){
		throw "no intersectViews";
	}
	// want at least: 2 views in group A & 2 views in group B : to get adequate overlapping populations
	if(singleAViews.length+intersectViews.length<2 || singleBViews.length+intersectViews.length<2){
		throw "TODO: resolve intersection geometrically in 3D";
	}
	// A) if all points in A or B overlap the other : keep more-encompasing point & remove the other
	if(anyOver){ // multiple points in same views: remove duplicates and re-insert if still have matches
		for(var i=0; i<intersectViews.length; ++i){
			var isOver = overDistance[i];
			if(isOver){
				var view = intersectViews[i];
				var point2DA = point3DA.pointForView(view);
				var point2DB = point3DB.pointForView(view);
				world.removePoint2DAndMatchesFromPoint3D(point2DA);
				world.removePoint2DAndMatchesFromPoint3D(point2DB);
			}
		}
		// add back P3Ds if they have any content left
		var result = null;
		if(point3DA.point2DCount()>1){
			result = this.embedPoint3D(point3DA);
		}else{
			world.killPoint3D(point3DA);
		}
		if(point3DB.point2DCount()>1){
			result = this.embedPoint3D(point3DB) || result;
		}else{
			world.killPoint3D(point3DB);
		}
		return result;
	}else if(intersectViews.length==viewsB.length){ // larger match subsumes the other
		return this.embedPoint3D(point3DA);
	}
	// loaded view overlap:
	var loadedFxn = function(a){
		return a.image()!==null;
	}
	var loadedViewsA = Code.filterArray(viewsA,loadedFxn);
	var loadedViewsB = Code.filterArray(viewsB,loadedFxn);
	var loadedViewsAll = Code.filterArray(allViews,loadedFxn);
	var loadedViewsIntersect = Code.filterArray(intersectViews,loadedFxn);
	// requirements for calculations:
	//if( !(loadedViewsA.length>0 && loadedViewsB.length>0 && loadedViewsAll.length>1) ){ // bare minimum to get a single ncc score to limit
	if(loadedViewsA.length<=1 || loadedViewsB.length<=1){
		// TODO: WHY ARE THERE 2? USING VIEWS?
		return world._addBackResolvingIntersections(point3DA,point3DB,intersectViews);
		// if(loadedViewsA.length==0 && loadedViewsB.length==0){ // combine without image assistance
		// 	return world._addBackResolvingIntersections(point3DA,point3DB,intersectViews);
		// } // else drop common points
		// return world._addBackDroppingIntersections(point3DA,point3DB,intersectViews);
	}
	// create new P3D to estimate next locations
	var countA = viewsA.length;
	var countB = viewsB.length;
	var totalCount = countA+countB;
	var percentA = countA/totalCount;
	var percentB = countB/totalCount;
	var percents = [percentA,percentB];
	try{
	var newPoint = V3D.average([point3DA.point(),point3DB.point()],percents);
}catch(e){
	console.log(point3DA,point3DB);
	console.log(point3DA.point(),point3DB.point());
	throw "CANT AVERAGE"
}
	var newNormal = null;
	var newSize = null;
	var point3DC = new Stereopsis.P3D(newPoint,newNormal,newSize);
	// patch
	// var newNormal = Code.averageAngleVector3D([point3DA.normal(),point3DB.normal()],percents);
	// var newSize = Code.averageNumbers([point3DA.size(),point3DB.size()],percents);
	// point3DC.up(V3D.orthogonal(newNormal));
	// create 2D points
	var points2DC = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var point2D = null;
		if(point2DA && point2DB){
			point2D = V2D.avg(point2DA.point2D(),point2DB.point2D());
		}else if(point2DA){
			point2D = point2DA.point2D().copy();
		}else{ // if(point2DB){
			point2D = point2DB.point2D().copy();
		}
		var point2DC = new Stereopsis.P2D(view,point2D,point3DC);
		point3DC.addPoint2D(point2DC);
		points2DC.push(point2DC);
	}
	// create matches
	for(var i=0; i<points2DC.length; ++i){
		var p2DI = points2DC[i];
		for(var j=i+1; j<points2DC.length; ++j){
			var p2DJ = points2DC[j];
			var match = new Stereopsis.Match2D(p2DI,p2DJ,point3DC);
			match.transform(this.transformFromViews(p2DI.view(),p2DJ.view()));
			p2DI.addMatch(match);
			p2DJ.addMatch(match);
			point3DC.addMatch(match);
		}
	}
	// TODO: UPDATE PATCH USING SPHERE
	world.patchInitBasicSphere(true,[point3DC]);
	if(point3DC.toMatchArray().length==0){
		throw "why no matches ?";
	}
	var validateUsingNCC = false;
	if(validateUsingNCC){
		// compare before / after results
		var scoresA = Stereopsis.World._nccMatchPopulation(point3DA,loadedViewsA);
		var scoresB = Stereopsis.World._nccMatchPopulation(point3DB,loadedViewsB);
		var scoresC = Stereopsis.World._nccMatchPopulation(point3DC,loadedViewsAll);
		var checkA = scoresA["min"];
		var checkB = scoresB["min"];
		var limitA = scoresA["mean"] + scoresA["sigma"] * 2.0;
		var limitB = scoresB["mean"] + scoresB["sigma"] * 2.0;
		var checkC = scoresC["mean"];
		var minimumCut = 0.15; // TODO: REALLY GOOD PAIRS CAN BE OVER-PROTECTIVE
		limitB = Math.max(limitB,minimumCut);
		limitA = Math.max(limitA,minimumCut);
		// keep separate if: result is worse than either original | OR | one set has much worse errors
		if(checkC>limitA || checkC>limitB || checkA>limitB || checkB>limitA){
	// console.log("not pass limits: "+" "+checkA+" "+checkB+" "+checkC+" OF "+limitA+" "+limitB+" ");
			world.disconnectPoint3D(point3DC);
			world.killPoint3D(point3DC);
			return world._addBackDroppingIntersections(point3DA,point3DB,intersectViews);
		} // success
	}else{
		// TODO: VALIDATE USING SPHERE3D PATCH SIZE, & DIRECTION
		// blind validation
	}
	// FINAL STEP: PICK BEST POINT AMONGST ALL 2D VIEWS
	if(loadedViewsAll.length>1){
		// choose reference image
		var bestCorner = null;
		var bestIndex = null;
		var points2D = [];
		for(var i=0; i<loadedViewsAll.length; ++i){
			var view = loadedViewsAll[i];
			if(view.image()){
				var p2d = point3DC.pointForView(view);
				var p = p2d.point2D();
				var corner = view.cornerForPoint(p);
				points2D.push(p2d);
				if(!bestCorner || bestCorner<corner){
					bestCorner = corner;
					bestIndex = points2D.length-1;
				}
			}
		}
		// extract needle & haystacks
		var needleSize = 9;
		var viewCompareScale = 1.0;
		var haystackSize = needleSize*2;
		var needleZoom = 1.0;
		// var viewCompareSize = view.compareSize();
		// var viewCellSize = view.cellSize();
		// var needleZoom = viewCompareScale*viewCompareSize/needleSize;
		var matrix = null;
		var p2D = points2D[bestIndex];
		var p = p2D.point2D();
		var view = p2D.view();
		var image = view.image();
		var needle = image.extractRectFromFloatImage(p.x,p.y,needleZoom,null,needleSize,needleSize, matrix);
		var needleView = view;
		// find optimum 2d & update location
		for(var i=0; i<points2D.length; ++i){
			if(i!==bestIndex){ // haystack
				var p2D = points2D[i];
				var view = p2D.view();
				var p = p2D.point2D();
				var image = view.image();
				var match = point3DC.matchForViews(needleView,view);
				var matrix = match.affineForViews(needleView,view);
				var haystack = image.extractRectFromFloatImage(p.x,p.y,needleZoom,null,haystackSize,haystackSize, matrix);
				// find NCC:
				var scoresNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
				var values = scoresNCC["value"];
				var width = scoresNCC["width"];
				var height = scoresNCC["height"];
				// find peak
				var minIndex = Code.minIndex(values);
				var minX = Math.floor(minIndex%width);
				var minY = Math.floor(minIndex/width);
				var peak = new V3D(minX,minY,values[minIndex]);
				// find subpixel peak
				var xMin = Math.max(0,minX-1);
				var xMax = Math.min(width-1,minX+1);
				var yMin = Math.max(0,minY-1);
				var yMax = Math.min(height-1,minY+1);
				// var peak = new V3D(minX,minY,values[minIndex]);
				var d0 = values[width*yMin + xMin];
				var d1 = values[width*yMin + minX];
				var d2 = values[width*yMin + xMax];
				var d3 = values[width*minY + xMin];
				var d4 = values[width*minY + minX];
				var d5 = values[width*minY + xMax];
				var d6 = values[width*yMax + xMin];
				var d7 = values[width*yMax + minX];
				var d8 = values[width*yMax + xMax];
				var result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
				if(result){ // rare ?
					peak.x += result.x;
					peak.y += result.y;
				}
				// set new point
				var q = p.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);
				p2D.point2D(q);
			}
		}
		// throw "?";
		// udpate matches from points
		world.patchInitBasicSphere(true,[point3DC]);
	}
// console.log("point3DC: "+point3DC.point());
	return this.embedPoint3D(point3DC);
}
Stereopsis.World._nccMatchPopulation = function(point3DA,loadedViewsA){
	var scoresA = [];
	for(var i=0; i<loadedViewsA.length; ++i){
		var viewA = loadedViewsA[i];
		for(var j=i+1; j<loadedViewsA.length; ++j){
			var viewB = loadedViewsA[j];
			var match = point3DA.matchForViews(viewA,viewB);
			scoresA.push(match.errorNCC());
		}
	}
	var min = null;
	var mean = null;
	var sigma = null;
	if(scoresA.length==1){
		min = scoresA[0];
		mean = min;
		sigma = 1.0*mean;
	}else if(scoresA.length>1){
		min = Code.min(scoresA);
		mean = Code.mean(scoresA);
		sigma = Code.stdDev(scoresA, min);
	}
	return {"min":min, "mean":mean, "sigma":sigma};
}
Stereopsis.World.prototype._addBackResolvingIntersections = function(point3DA,point3DB,intersectViews){ //
	var maxDistance = 1.0; // TODO: FROM SOMEWHERE
	var resolutions = [];
	var point3DC = new Stereopsis.P3D();
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	var points2DList = [points2DA,points2DB];
	// keep unique view points
	for(var j=0; j<points2DList.length; ++j){
		var points2D = points2DList[j];
		for(var i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var view = point2D.view();
			if(!Code.elementExists(intersectViews,view)){
				var location = point2D.point2D().copy();
				var point2DNew = new Stereopsis.P2D(view,location,point3DC);
				point3DC.addPoint2D(point2DNew);
			}
		}
	}
	// combine or drop duplicated view points
	for(var i=0; i<intersectViews.length; ++i){
		var view = intersectViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var distance = V2D.distance(p2DA,p2DB);
		if(distance<maxDistance){
			var location = V2D.avg(p2DA,p2DB);
			var point2D = new Stereopsis.P2D(view,location,point3DC);
			point3DC.addPoint2D(point2D);
		} // can't resolve -- don't add
	}
	var points2D = point3DC.toPointArray();
	if(points2D.length>1){ // 2+
		// average patch
		var location = V3D.average([point3DA.point(),point3DB.point()]);
		point3DC.point(location);
		// create matches for all
		for(var i=0; i<points2D.length; ++i){
			var p2DA = points2D[i];
			var viewA = p2DA.view();
			for(var j=i+1; j<points2D.length; ++j){
				var p2DB = points2D[j];
				var viewB = p2DB.view();
				var match = new Stereopsis.Match2D(p2DA,p2DB,point3DC);
				p2DA.addMatch(match);
				p2DB.addMatch(match);
				point3DC.addMatch(match);
				match.transform(this.transformFromViews(viewA,viewB));
			}
		}
		// sphere
		this.patchInitBasicSphere(true,[point3DC]);
		// patch
		// var normal = Code.averageAngleVector3D([point3DA.normal(),point3DB.normal()]);
		// var size = Code.averageNumbers([point3DA.size(),point3DB.size()]);
		// point3DC.normal(normal);
		// point3DC.up(V3D.orthogonal(normal));
		// this.generateMatchAffineFromPatches(point3DC);
		// TODO: REFINE PATCH W/O IMAGES ?
		// add
		this.killPoint3D(point3DA);
		this.killPoint3D(point3DB);
		return this.embedPoint3D(point3DC);
	} // else not enough points
	this.killPoint3D(point3DC);
	return null;
}
Stereopsis.World.prototype._addBackDroppingIntersections = function(point3DA,point3DB,intersectViews){ // remove intersecting points & try adding in other track
	var world = this;
	var result = this.embedPoint3D(point3DA); // add back larger track as-is
	for(var i=0; i<intersectViews.length; ++i){
		var view = intersectViews[i];
		var point2DB = point3DB.pointForView(view);
		world.removePoint2DAndMatchesFromPoint3D(point2DB);
	}
	if(point3DB.point2DCount()>1){
		result = this.embedPoint3D(point3DB) || result;
	}else{
		world.killPoint3D(point3DB);
	}
	return result;
}
Stereopsis.World.prototype._resolveIntersectionSimpleBestMatchScore = function(point3DA,point3DB){
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	// TODO: PICK BEST AVG MATCH ?
	var avgA = point3DA.averageNCCError();
	var avgB = point3DB.averageNCCError();
	var keep = point3DA;
	var drop = point3DB;
	if(avgA>avgB){
		keep = point3DB;
		drop = point3DA;
	}
	// temp soln:
	this.killPoint3D(drop);
	return this.embedPoint3D(keep);
}

Stereopsis.World.prototype._resolveIntersectionFlat = function(point3DA,point3DB){
	// console.log(point3DA);
	// console.log(point3DB);
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);






	// throw "TODO --- still need for initial case when F / P unknown --- WHEN IS THIS?"



	// new point
	var pA3D = point3DA.point();
	var pB3D = point3DB.point();
	var averagePoint3D = null;
	if(pA3D && pB3D){
		averagePoint3D = V3D.avg(pA3D,pB3D);
	}else if(pA3D){
		averagePoint3D = pA3D.copy();
	}else if(pB3D){
		averagePoint3D = pB3D.copy();
	}
	// get list of all point2D & views | create graph
	var graph = new Graph();
	var groupPoints = {};
	var groupViews = {};
	var points3D = [point3DA,point3DB];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var views = point3D.toViewArray();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var index = Stereopsis.indexFromObjectID(view);
			var point2D = point3D.point2DForView(view);
			var vertex = graph.addVertex();
			point2D.data(vertex);
			vertex.data(point2D);
			if(!groupViews[index]){
				groupViews[index] = view;
			}
			if(!groupPoints[index]){
				groupPoints[index] = [];
			}
			groupPoints[index].push(point2D);
			// console.log(" "+i+" : "+view.id()+" @ "+point2D.point2D()+"  ");
		}
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point2DA = match.point2DA();
			var point2DB = match.point2DB();
			var vertexA = point2DA.data();
			var vertexB = point2DB.data();
			var weight = match.errorNCC();
			var edge = graph.addEdge(vertexA,vertexB,weight,Graph.Edge.DIRECTION_DUPLEX);
			edge.data(match);
		}
	}
	// separater into: INT, DOU, SIN
	var pointsINT = [];
	var pointsSIN = [];
	var pointsDOU = [];
	Code.forEach(groupPoints, function(points2D,key){
		if(points2D.length==1){ // keep single point
			pointsSIN.push(points2D[0]);
		}else if(points2D.length==2){
			var point2DA = points2D[0];
			var point2DB = points2D[1];
			var view = point2DA.view();
			var cellSize = view.cellSize();
			var minDistance = cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY;
			var distance = V2D.distance(point2DA.point2D(),point2DB.point2D());
			if(distance<=minDistance){
				pointsINT.push(points2D); // INT
				var vertexA = point2DA.data();
				var vertexB = point2DB.data();
				var weight = 0;
				var edge = graph.addEdge(vertexA,vertexB,weight,Graph.Edge.DIRECTION_DUPLEX);
				edge.data(null);
			}else{ // DOU
				pointsDOU.push(points2D);
			}
		}
	});
	// determine optimal & reference points
	var pointsList = [];
	// SINGLE - take point as is
	for(var i=0; i<pointsSIN.length; ++i){
		var point2D = pointsSIN[i];
		pointsList.push([point2D, point2D.point2D().copy()]);
	}
	// INTERSECTION - take point average
	for(var i=0; i<pointsINT.length; ++i){
		var points2D = pointsINT[i];
		var point2DA = points2D[0];
		var point2DB = points2D[1];
		pointsList.push([point2DA, V2D.avg(point2DA.point2D(),point2DB.point2D())]);
	}
	// DOUBLE - pick best average match score
	for(var i=0; i<pointsDOU.length; ++i){
		var points2D = pointsDOU[i];
		var point2DA = points2D[0];
		var point2DB = points2D[1];
		var scores = [0,0];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			for(var k=0; k<pointsINT.length; ++k){
				var first = pointsINT[k][0];
				var match = point2D.point3D().matchForViews(point2D.view(),first.view());
				scores[j] += match.errorNCC();
			}
		}
		// console.log(scores);
		var keepP2D = point2DA;
		var dropP2D = point2DB;
		if(scores[0]>scores[1]){
			keepP2D = point2DB;
			dropP2D = point2DA;
		}
		pointsList.push([keepP2D, keepP2D.point2D().copy()]);
	}
	// create new P2Ds from point
	// console.log(pointsList);
	var point3DC = new Stereopsis.P3D();
	for(var i=0; i<pointsList.length; ++i){
		var group = pointsList[i];
		var reference = group[0];
		var location = group[1];
		var point2D = new Stereopsis.P2D(reference.view(),location,point3DC);
		point2D.data(reference);
		point3DC.addPoint2D(point2D);
		pointsList[i] = point2D;
	}
	// create new matches
	// combine affine transforms if necessary
// console.log(pointsList);
	for(var i=0; i<pointsList.length; ++i){
		var point2DA = pointsList[i];
		for(var j=i+1; j<pointsList.length; ++j){
			var point2DB = pointsList[j];
// console.log("WANT A PAIR FOR: "+point2DA.view().id()+" & "+point2DB.view().id()+" ------------- ");
			// find path:
			var path = graph.minPath(point2DA.data().data(), point2DB.data().data());
			var edges = path["edges"];
			// console.log(edges);
			// net = new Matrix(3,3).identity();
			net = new Matrix2D().identity();
			var currentPoint2D = point2DA.data();
// console.log(currentPoint2D);
			for(var k=0; k<edges.length; ++k){
				var edge = edges[k];
				var match = edge.data();
				// console.log(k+" ...............");
				// console.log(edge);
				// console.log(match);
				if(match){
					var opposite = match.oppositePoint(currentPoint2D);
					// console.log(currentPoint2D);
					// console.log(opposite);
					var affine = match.affineForViews(currentPoint2D.view(),opposite.view());
					// console.log(affine);
					// net = Matrix.mult(net, affine);
					net = Matrix2D.mult(net, affine);
				}else{
					// currentPoint2D = edge.opposite();
				}
				// currentPoint2D = opposite;
				currentPoint2D = edge.opposite(currentPoint2D.data()).data();
			}
			if(currentPoint2D != point2DB.data()){
				// console.log(currentPoint2D)
				// console.log(point2DA)
				// console.log(point2DB)
console.log("bad sequence");
// throw("bad sequence match path");
				this.disconnectPoint3D(point3DA);
				this.disconnectPoint3D(point3DB);
				this.disconnectPoint3D(point3DC);
				this.killPoint3D(point3DA);
				this.killPoint3D(point3DB);
				this.killPoint3D(point3DC);
				return null;
			}
			// console.log(net+"");
			// refine affine:
			var viewA = point2DA.view();
			var viewB = point2DB.view();
			var imageA = viewA.image();
			var imageB = viewB.image();
			var pointA = point2DA.point2D();
			var pointB = point2DB.point2D();
			var affine = net;
			var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
				// affine = Stereopsis.refineAffine(imageA,imageB, pointA,pointB, affine, compareSize);
			// create new match:
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB, affine, true);
			// var t = this.transformFromViews(viewA,viewB);
			// t.insertMatch(match);
			// match.x = "?"

			match.point2DA(point2DA);
			match.point2DB(point2DB);
			match.point3D(point3DC);
			point2DA.addMatch(match);
			point2DB.addMatch(match);
			point3DC.addMatch(match);
// console.log("NEW MATCH: "+viewA.id()+"-"+viewB.id()+" = "+match.errorNCC()+" "+match.errorSAD()+"");
		}
	}

	// this.validatePoints3DX();
	// cleanup - old
	// var points3D = [point3DA,point3DB];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		var points2D = point3D.toPointArray();
		this.killPoint3D(point3D);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			// match.kill()
		}

		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			point2D.kill();
		}
	}
	// cleanup - new
	for(var i=0; i<pointsList.length; ++i){
		var point2D = pointsList[i];
		point2D.data(null);
	}
	graph.kill();

	// remove later
	// this.validatePoint3D(point3DC);
	// add in
	point3DC.point(averagePoint3D); // simple average -- no relative error taken into account

// throw "....."

	return this.embedPoint3D(point3DC);
}
Stereopsis.World.prototype.removePoint2DAndMatchesFromPoint3D = function(point2D){
	var point3D = point2D.point3D();
	var matches = point2D.toMatchArray();

this.disconnectPoint3D(point3D);
	// this.removeP2DFromP3D(point2D);
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var p2DA = match.point2DA();
		var p2DB = match.point2DB();
		point3D.removeMatch(match);
		p2DA.removeMatch(match);
		p2DB.removeMatch(match);
		if(!match.transform()){
			var transform = this.transformFromViews(match.viewA(),match.viewB());
			console.log(point3D);
			console.log(match);
			console.log(transform);
			throw "?";
		}
		match.transform().removeMatch(match);
		match.kill();
	}
	var view = point2D.view();
	view.removePoint2D(point2D);
	point3D.removePoint2D(point2D);
	point2D.kill();

if(point3D.matchCount()>0){
	this.connectPoint3D(point3D);
}
}
Stereopsis.World.prototype.removePoint2DFromPoint3D = function(point2D){ // assume connected & reconnect
	var point3D = point2D.point3D();
	this.disconnectPoint3D(point3D);
	this.removeP2DFromP3D(point2D);
	if(point3D.matchCount()>0){
		this.connectPoint3D(point3D);
	}
}
Stereopsis.World.prototype.removeMatchFromPoint3D = function(match){
	var point3D = match.point3D();
	var trans = match.transform();
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();

	if(trans){
		trans.removeMatch(match);
	}

	if(!point3D){ // already removed?
		console.log(match);
		throw "match has no point?";
		return;
	}

	// trans.removeMatch(match);


	// TOOD: THESE WOULD ALL BE DONE ANYWAY WHEN REMOVING THE POINT
	// point2DA.removeMatch(match);
	// point2DB.removeMatch(match);
	// point3D.removeMatch(match);
	// trans.removeMatch(match);


	// // ????
	// if(point2DA.toMatchArray().length==0){
	// 	this.removeP2DFromP3D(point2DA);
	// }
	// if(point2DB.toMatchArray().length==0){
	// 	this.removeP2DFromP3D(point2DB);
	// }

	// if a match is removed, a point must also be removed:
	var scoreA = point2DA.averageNCCError();
	var scoreB = point2DB.averageNCCError();
	var removePoint2D = point2DA;
	var keepPoint2D = point2DB;
	if(scoreA<scoreB){
		removePoint2D = point2DB;
		keepPoint2D = point2DA;
	}
	// console.log(removePoint2D);
	this.removeP2DFromP3D(removePoint2D);

	if(point3D.toMatchArray().length!=0){
		if(point3D.isValid()){
			throw "invalid but connecting?"
		}
		this.connectPoint3D(point3D);
	}
	// this.validatePoint3D(point3D);
}
Stereopsis.World.prototype.connectPoint3D = function(point3D){
	// console.log("connectPoint3D IN: "+point3D.point());
	var world = this;
	// match2D
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = world.transformFromViews(viewA,viewB);
		if(!transform){
			console.log(match);
			console.log(viewA);
			console.log(viewB);
		}
		match.transform(transform); // ...
// console.log("A: "+transform._matchCount);
// console.log("1: "+Code.objectToArray(transform._matches));
		transform.insertMatch(match);
// console.log("B: "+transform._matchCount);
// console.log("2: "+Code.objectToArray(transform._matches));
	}
	// point2D
	var points2D = point3D.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		view.insertPoint2D(point2D);
	}
	// probe matching:
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
		for(var j=i+1; j<points2D.length; ++j){
			var point2DB = points2D[j];
			var viewB = point2D.view();
			viewA.addViewProbePoint(point2DA.point2D(), viewB);
			viewB.addViewProbePoint(point2DB.point2D(), viewA);
		}
	}
	// point3D
	// console.log("connectPoint3D OUT: "+point3D.point());
	world.insertPoint3D(point3D);
}
Stereopsis.World.prototype.disconnectPoints3D = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.disconnectPoint3D(point3D);
	}
}
Stereopsis.World.prototype.disconnectPoint3D = function(point3D){
	var world = this;
	var matches = point3D.toMatchArray();
	var points2D = point3D.toPointArray();
	// match2D
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = world.transformFromViews(viewA,viewB);
		transform.removeMatch(match);
	}
	// point2D
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var removed = view.removePoint2D(point2D);
	}
	// point3D
	world.removePoint3D(point3D);
}
Stereopsis.World.prototype.disposePoint3DAncestor = function(point3D){ // remove & kill point3D
	// return;
	var world = this;
	var ancestor = point3D.ancestor();
	if(ancestor && ancestor.id()!==null){ //ancestor may already be disposed
		// console.log("disposePoint3DAncestor "+ancestor);
		// console.log("disposePoint3DAncestor");
		world.disconnectPoint3D(ancestor);
		// world.removePoint3D(ancestor);
		world.killPoint3D(ancestor);
	}
}
Stereopsis.World.prototype.killPoint3D = function(point3D){ // free memory
	if(point3D._killed){
		// throw "point was already killed";
		console.log("point was already killed");
	}
	var matches = point3D.toMatchArray();
	var points2D = point3D.toPointArray();
	// match2D
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point2DA = match.point2DA();
		var point2DB = match.point2DB();
		point3D.removeMatch(match);
		point2DA.removeMatch(match);
		point2DB.removeMatch(match);
		match.point2DA(null);
		match.point2DB(null);
		match.point3D(null);
	}
	// point2D
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var result = view.removePoint2D(point2D);
		point3D.removePoint2D(point2D);
		point2D.point3D(null);
		point2D.view(null);
		point2D.point2D(null);
	}
	// point3D
	point3D._killed = true;
	point3D._size = null;
	point3D._data = null;
	point3D._point = null;
	point3D._normal = null;
	point3D._up = null;
	point3D._size = null;
	point3D._points2D = null;
	point3D._matches = {};
	point3D._temp = null;
	point3D._id = null;
	// world.removePoint3D(point3D); // assumed called before kill
}
// Stereopsis.World.prototype.updatePoint3DLocations = function(points3D){
// 	var world = this;
// 	if(!points3D){
// 		points3D = world.toPointArray();
// 	}
// 	// console.log(points3D.length)
// 	// console.log(points3D)
// 	for(var i=0; i<points3D.length; ++i){
// 		// if(i%100==0){
// 		// 	console.log("i: "+i);
// 		// }
// 		var point3D = points3D[i];
// throw "dont use estimated"
// 		var location3D = point3D.estimated3D();
// 		world.updatePoint3DLocation(point3D,location3D);
// 	}
// }
Stereopsis.World.prototype.updatePoint3DLocation = function(point3D,location){
	// console.log("updatePoint3DLocation: "+point3D.point()+" => "+location);
	if(location && Code.isNaN(location.x)){
		throw "NAN NUMBER: "+location;
	}
	this.removePoint3D(point3D);
	var current = point3D.point();
	point3D.point(location);
	this.insertPoint3D(point3D);
}
PATCH_COUNT = 0;
PATCH_SEARCH = -1300;
PATCH_ITERATION = 0;


Stereopsis.estimateP3DNormalFromViews = function(point3D){
	var isLocation = point3D.point();
	var visibleViews = point3D.toViewArray();
	// initial estimate of patch normal = AVG(p(c)->v_i(c))
	var normals = [];
	var rights = [];
	var percents = []; // based on orthogonality to camera
	// var patchSize = 0;
	var percentTotal = 0;
if(visibleViews.length==0){
	console.log("no visible views ?");
	console.log(point3D);
	console.log(visibleViews);
	console.log(isLocation);
	return null;
}
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		var x = view.right().copy().scale(-1);
		var c = view.center();
		var n = view.normal().copy().scale(-1);
		var pc = V3D.sub(c,isLocation);
		pc.norm();
		normals.push(pc);
		if( i>0 && V3D.dot(x,rights[0])<0 ){ // should use closest DOT PRODUCT: left or right
			x.scale(-1);
		}
		rights.push(x);
		var p = V3D.dot(n,pc);
		percents.push(p);
		percentTotal += p;
		// patchSize += view.cellSize(); // cell size / compare size / patch size ?
	}
	for(var i=0; i<percents.length; ++i){
		percents[i] /= percentTotal;
	}
	var normal = Code.averageAngleVector3D(normals,percents);
	var right = Code.averageAngleVector3D(rights,percents); // not necessarily orthogonal
	// patchSize /= visibleViews.length;
	// make sure 90 degrees
if(!normal || !right){
	console.log(normals);
	console.log(rights);
	console.log(percents);
	console.log(percentTotal);
	console.log(normal);
	console.log(right);
	throw "???"
}
	var up = V3D.cross(normal,right);
	up.norm();
	return {"normal":normal, "up":up};//, "size":patchSize};
}
Stereopsis.World.prototype.initialEstimatePatch = function(point3D){
throw "slow";
	var isLocation = point3D.point();
	var result = Stereopsis.estimateP3DNormalFromViews(point3D);
	var normal = result["normal"];
	var up = result["up"];
	var patchSize = result["size"];
	right = V3D.cross(up,normal);
	right.norm();
	// estimate optimal size of patch
	var optimalSize = patchSize;
	var currentSize = 0;
	var visiblePoints = point3D.toPointArray();
	var visibleViews = point3D.toViewArray();
	// project point in view to match plane to estimate initial start size -
	for(var i=0; i<visiblePoints.length; ++i){
		var point2D = visiblePoints[i];
		var p = point2D.point2D();
		var v = point2D.view();
		// var rig = p.copy().add(0.5*v.patchSize(),0);
		var rig = p.copy().add(0.5*v.cellSize(),0);
		// TODO: IF RIG IS POINTING MORE OPPOSITE TO EXISTING RIG -> FLIP
		throw "this absolute or extrinsic?"
		var ray = R3D.projectPoint2DToCamera3DRay(rig, v.absoluteTransform(), v.Kinv(), null);
		var o = ray["o"];
		var d = ray["d"];
		var intersection = Code.intersectRayPlane(o,d, isLocation,normal);
		var d = V3D.distance(intersection,isLocation);
		currentSize += d;
	}
	currentSize /= visiblePoints.length;
	// iterate to optimum
	var rangeMin = null;
	var rangeMax = null;
	// console.log("isLocation: "+isLocation);
	for(var k=0; k<10; ++k){
		// project onto each view
		var center3D = isLocation.copy();
		var u = up.copy().scale(currentSize);
		var r = right.copy().scale(currentSize);
		// left/right are reversed from view
		var TL3D = center3D.copy().add( u ).add( r );
		var TR3D = center3D.copy().add( u ).sub( r );
		var BR3D = center3D.copy().sub( u ).sub( r );
		var BL3D = center3D.copy().sub( u ).add( r );
		var averageSize = 0;
		for(var i=0; i<visibleViews.length; ++i){
			var view = visibleViews[i];
			var center2D = view.projectPoint3D(center3D);
			var TL2D = view.projectPoint3D(TL3D);
			var TR2D = view.projectPoint3D(TR3D);
			var BR2D = view.projectPoint3D(BR3D);
			var BL2D = view.projectPoint3D(BL3D);
			var list = [TL2D,TR2D,BL2D,BR2D];
			var distance = 0;
			for(var j=0; j<list.length; ++j){
				var p2D = list[j];
				var d = V2D.distance(p2D,center2D);
				distance += d;
			}
			distance /= list.length;
			averageSize += distance;
		}
		averageSize *= 0.70710678118; // hypotenuses
		averageSize /= visibleViews.length;
		if(averageSize>optimalSize){
			if(rangeMax){
				rangeMax = Math.min(rangeMax,currentSize);
			}else{
				rangeMax = currentSize;
			}
		}else{
			if(rangeMin){
				rangeMin = Math.max(rangeMin,currentSize);
			}else{
				rangeMin = currentSize;
			}
		}
		// next
		if(rangeMin && rangeMax){
			currentSize = rangeMin + (rangeMax-rangeMin)*0.5;
		}else if(averageSize>optimalSize){
			currentSize /= 2;
		}else{
			currentSize *= 2;
		}
		var percent = averageSize/optimalSize;
		if(percent<1.0){
			percent = 1.0/percent;
		}
		if(percent<1.0001){
			break;
		}
	}
	// console.log("final size (world): "+currentSize);
	point3D.normal(normal);
	point3D.up(up);
	point3D.size(currentSize);

// SHOW
var views = visibleViews;
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var image = view.image();
	var point2D = point3D.pointForView(view);

	if(!point2D){
		console.log(point3D);
		throw "what?"
	}

	var point = point2D.point2D();
	var compareSize = 49;
	var cellScale = 2;
	var needle = image.extractRectFromFloatImage(point.x,point.y,cellScale,null,compareSize,compareSize, null);
	/*
	var iii = needle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(10 + 100*HASCOUNT, 0 + 100*i);
	GLOBALSTAGE.addChild(d);
	*/
}

	this.updateP3DPatch(point3D);
}
Stereopsis.World.prototype.updateEstimatePatch = function(point3D,wasLocation,isLocation){
	console.log("updateEstimatePatch: "+wasLocation+" -> "+isLocation);
	this.updatePoint3DLocation(point3D,isLocation);
	this.updateP3DPatch(point3D);
}


Stereopsis.World.prototype.calculatePoint3DPatches = function(points3D, doLocation, doPatch, doAffines, doOnlyNew){
	var world = this;
	doLocation = Code.valueOrDefault(doLocation, true);
	doPatch = Code.valueOrDefault(doPatch, true);
	doAffines = Code.valueOrDefault(doAffines, true);
	doOnlyNew = Code.valueOrDefault(doAffines, false);

	var hashAverageRight = {};
	var hashAverageUp = {};
	var hashAverageNormal = {};

	var sizePointCount = 4;
	var affinePointCount = 4;
	var v = new V3D();
	var reuse = new Matrix2D();

console.log("COMPARE WORLD SIZE: "+world._pointSpace.size().length());

	for(var i=0; i<points3D.length; ++i){
// console.log(i+" ............ ");
		var point3D = points3D[i];
// if(doOnlyNew){
// 	if(point3D.hasPatch()){
// 		continue;
// 	}
// }
		// find 3D point:
		var points2D = point3D.toPointArray();
		var p2Ds = [];
		var extrinsics = [];
		var Ks = [];
		var Kinvs = [];
		var sizes = [];
		//
		var rights = [];
		var ups = [];
		var normals = [];
		var centers = [];
		var absolutes = [];
		for(var p=0; p<points2D.length; ++p){
			var point2D = points2D[p];
			var p2D = point2D.point2D();
			var view = point2D.view();
			var K = view.K();
			var Kinv = view.Kinv();
			var ext = view.absoluteTransform();
			var abs = view.absoluteTransformInverse();
			var normal = view.normal();
			var center = view.center();
			var right = view.right();
			var up = view.up();
			var size = view.cellSize();
			// push
			p2Ds.push(p2D);
			extrinsics.push(ext);
			sizes.push(size);
			Ks.push(K);
			Kinvs.push(Kinv);
			ups.push(up);
			rights.push(right);
			normals.push(normal);
			centers.push(center);
			absolutes.push(abs);
		}
// console.log(sizes);
// throw "?"
// console.log(Ks);
// console.log(Kinvs);
// console.log(centers);
		var p3D = R3D.triangulatePointDLTList(p2Ds, extrinsics, Kinvs);
// console.log(point3D.point()+"");
// console.log(p3D+"");

if(!doPatch){
	continue;
}
throw "probly use something else";
		console.log(" UPDATE LOCATION "+p3D);
		world.updatePoint3DLocation(point3D, p3D);

if(!doAffines){
	continue;
}
		// centers (affines & size)
		var centers2D = [];
		var pointToCenters = [];
		for(var j=0; j<points2D.length; ++j){
			var center2D = R3D.projectPoint3DToCamera2DForward(p3D, extrinsics[j], Ks[j], null, false);
			centers2D[j] = center2D;
			var pToC = V3D.sub(centers[j],p3D);
				pToC.norm();
			pointToCenters.push(pToC);
		}
// console.log(centers2D);
		// patch directions
		var normal = Code.averageAngleVector3D(pointToCenters);
		var right = Code.averageAngleVector3DSameDirection(rights);
		var up = V3D.cross(normal,right);
		point3D.normal(normal);
		point3D.up(up);

		// var averageNormal = Code.averageAngleVector3DSameDirection(normals);
		// var averageUp = Code.averageAngleVector3DSameDirection(ups);

		// size
		var averageSize = 0;
		var totalCount = 0;
		for(var j=0; j<sizes.length; ++j){
			var size = sizes[j];
			var center2D = centers2D[j];
			var Kinv = Kinvs[j];
			var center = centers[j];
			var absolute = absolutes[j];
			for(var p=0; p<sizePointCount; ++p){
				v.set(size,0,1);
				v.rotate(V3D.DIRZ, (p/sizePointCount) * Math.PI2);
				v.add(center2D.x,center2D.y,0);
				Kinv.multV3DtoV3D(v,v);
				v.norm();
// console.log(v+" ?")
				absolute.multV3DtoV3D(v,v);
				v.sub(center);
				var closest = Code.closestPointLine3D(center,v, p3D);
				var distance = V3D.distance(p3D,closest);
// console.log("distance: "+distance);
				averageSize += distance;
				++totalCount;
			}
		}
		averageSize = averageSize/totalCount;
		point3D.size(averageSize);

// LARGE?
// console.log("averageSize: "+averageSize);
// throw " ? ";
if(!doAffines){
	continue;
}
		// affine points
		var p2DAffines = [];
		for(var j=0; j<points2D.length; ++j){
			list = [];
			p2DAffines.push(list);
			for(var p=0; p<affinePointCount; ++p){
				v.set(right.x,right.y,right.z);
				v.rotate(normal, (p/affinePointCount) * Math.PI2);
				v.scale(averageSize);
				v.add(p3D);
				var p2D = R3D.projectPoint3DToCamera2DForward(v, extrinsics[j], Ks[j], null, false);
				p2D.sub(centers2D[j]);
				list.push(p2D);
			}
		}
		// console.log(p2DAffines);

		// set for each match:
		for(var j=0; j<p2DAffines.length; ++j){
			var listA = p2DAffines[j];
			var viewA = points2D[j].view();
			for(var k=j+1; k<p2DAffines.length; ++k){
				var listB = p2DAffines[k];
				var viewB = points2D[k].view();
				var affine2D = R3D.affineCornerMatrixLinear(listA,listB, reuse);
				var match = point3D.matchForViews(viewA,viewB);
				match.affineForViews(viewA,viewB,affine2D.copy());
			}
		}
		

// console.log(point3D);

// if(i>100){
// 	throw "?"
// }
		// throw "?"
		// world._calculatePoint3DPatch(point3D);
	}


	// throw "calculatePoint3DPatches"
}
Stereopsis.World.prototype._calculatePoint3DPatch = function(points3D, options){
	var world = this;
/*
	3D point from separate 


*/
	throw "?"
}
/*
Stereopsis.World.prototype.calculatePoint3DMatchErrors = function(points3D, options){
	var world = this;
	for(var i=0; i<points3D.length; ++i){
		if(i%100==0){
			console.log(" "+i+" / "+points3D.length);
		}
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point2DA = match.point2DA();
			var point2DB = match.point2DB();
			var viewA = point2DA.view();
			var viewB = point2DB.view();
			var affine = match.affine();
			// console.log(match, viewA,point2DA,viewB,point2DB,affine);
			thrpw "..."
			Stereopsis.setMatchInfoFromParamerers(match, viewA,point2DA.point2D(),viewB,point2DB.point2D(),affine);
		}
	}
	// throw "calculatePoint3DMatchErrors"
}
*/

Stereopsis.World.prototype.updateP3DPatch = function(point3D, doTranslate){
	doTranslate = doTranslate!==undefined ? doTranslate : false;

	if(point3D.toMatchArray().length==0){
		throw "no matches start";
	}


	var visibleViews = point3D.toViewArray();
	// filter on views that are loaded
	for(var i=0; i<visibleViews.length; ++i){
		if(!visibleViews[i].image()){
			Code.removeElementAt(visibleViews, i);
			--i;
		}
	}

	var center = point3D.point();
	var size = point3D.size();
	var normal = point3D.normal();
	var up = point3D.up();
	if(!center || !normal || !up){
		console.log(point3D);
		throw "missing ..."
	}
	var right = V3D.cross(normal,up);
	var moveDirection = normal;
	var result = Stereopsis.patchNonlinear(center,size,normal,right,up,moveDirection,visibleViews,point3D,doTranslate);
	if(point3D.toMatchArray().length==0){
		throw "no matches end";
	}
// if translation move point very far -- bad match .. like 50% of average camera distance or more
	point3D.normal(result["normal"]);
	point3D.up(result["up"]);
	point3D.size(result["size"]);
	if(doTranslate){ // point location is also LOOKUP
		console.log("do translate: "+result["center"]);
		this.updatePoint3DLocation(point3D,result["center"]);
	}
	this.generateMatchAffineFromPatches(point3D);
	if(point3D.toMatchArray().length==0){
		throw "lost matches because this sucks";
	}


	/*
	var views = visibleViews;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = view.image();
		var point2D = point3D.pointForView(view);
		if(!point2D){
			console.log(point3D);
			throw "what?"
		}
		var size2D = Stereopsis.projectPoint3DForPoint2DSize(point2D);
		point2D.size(size2D);
	}
	*/
}
Stereopsis.World.prototype.generateMatchAffineFromPatches = function(point3D){
	var world = this;
	var points2D = point3D.toPointArray();
	var sets2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var info = Stereopsis.projectPoint3DForPoint2DInfo(point2D);
		var list = info["points"];
		// remove translation from projection
		for(var j=0; j<list.length; ++j){
			var o = list[0];
			var p = list[j];
			p.sub(o);
		}
		list.shift(); // remove 0,0 point
		sets2D.push(list);
		point2D.size(info["size"]);
	}
	for(var i=0; i<points2D.length; ++i){
		var pA = points2D[i];
		var pointsA = sets2D[i];
		for(var j=i+1; j<points2D.length; ++j){
			var pB = points2D[j];
			var match = point3D.matchForViews(pA.view(),pB.view());
			var pointsB = sets2D[j];
			var affine = R3D.affineCornerMatrixLinear(pointsA,pointsB);
			match.affine(affine);
			world.updateMatchInfo(match);
		}
	}
}
Stereopsis.projectPoint3DForPoint2DInfo = function(point2D){
	var point3D = point2D.point3D();
	var view = point2D.view();
	var size3D = point3D.size();
	var center3D = point3D.point();
	var up3D = point3D.up();
	var ri3D = point3D.right();
	var u = up3D.copy().scale(size3D);
	var r = ri3D.copy().scale(size3D);
	// left/right are reversed from view
	var TL3D = center3D.copy().add( u ).add( r );
	var TR3D = center3D.copy().add( u ).sub( r );
	var BR3D = center3D.copy().sub( u ).sub( r );
	var BL3D = center3D.copy().sub( u ).add( r );
	var center2D = view.projectPoint3D(center3D);
	var TL2D = view.projectPoint3D(TL3D);
	var TR2D = view.projectPoint3D(TR3D);
	var BR2D = view.projectPoint3D(BR3D);
	var BL2D = view.projectPoint3D(BL3D);
	// find average size
	var list = [TL2D,TR2D,BL2D,BR2D];
	var distance = 0;
	for(var j=0; j<list.length; ++j){
		var p2D = list[j];
		var d = V2D.distance(p2D,center2D);
		distance += d;
	}
	distance /= list.length;
	list.unshift(center2D);
	return {"points":list, "size":distance};
}
Stereopsis.projectPoint3DForPoint2DSize = function(point2D){
	throw "?"
}

Stereopsis.patchNonlinear = function(center,size,directionNormal,directionRight,directionUp,moveDirection, views,p3D,doTranslate){
	// TODO: doTranslate = allow movement of P3D along original normal line [depth]
	var maxIterations = 10;
	var fxn = Stereopsis._gdPatch;
	var args = [center,directionNormal,directionRight,directionUp,moveDirection,size,views,p3D,doTranslate];
	var xVals = [0,0,0];
	result = Code.gradientDescent(fxn, args, xVals, null, maxIterations, 1E-6,  1E-10);
	x = result["x"];
	var startCenter = args[0];
	var startNormal = args[1];
	var startRight = args[2];
	var startUp = args[3];
	var moveNormal = args[4];
	var size = args[5];
	var views = args[6];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	var center = null;
	if(doTranslate){
		center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	}else{
		center = startCenter.copy();
	}
	// if(doTranslate){
	// 	console.log("doTranslate: "+(V3D.distance(center,startCenter))); // if this is VERY FAR ... probs have bad point
	// }
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var up = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	return {"center":center,"normal":normal,"up":up,"size":size};
}
// Stereopsis._gdPatch_SIZE = 11; // slow
Stereopsis._gdPatch_SIZE = 9;
// Stereopsis._gdPatch_SIZE = 7;
// Stereopsis._gdPatch_SIZE = 5; // too small
Stereopsis._gdPatch_MASK = ImageMat.circleMask(Stereopsis._gdPatch_SIZE);
Stereopsis._gdPatch = function(args, x, isUpdate, descriptive){
	if(isUpdate){
		return;
	}
	var startCenter = args[0];
	var startNormal = args[1];
	var startRight = args[2];
	var startUp = args[3];
	var moveNormal = args[4];
	var size = args[5];
// size *= 4; // forces to not change much
	var halfSize = size*0.5; //
	var views = args[6];
	var p3D = args[7];
	var doTranslate = args[8];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	var center = null;
	if(doTranslate){ // allow some movement along ray
		center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	}else{ // only stay at original predicted location
		center = startCenter;
	}
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var top = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var right = startRight.copy().rotate(startRight, angleX).rotate(startUp, angleY);
		top.scale(halfSize).add(center);
		right.scale(halfSize).add(center);
// don't reverse normal direction
var dot = V3D.dot(normal,startNormal);
if(dot<=0){ // is this a problem?
	return 1E12;
}
	// patches
	var patches = [];
	var compareSize = Stereopsis._gdPatch_SIZE;
	var needleMask = Stereopsis._gdPatch_MASK;
	var org = V2D.ZERO;
	var xLoc = new V2D(compareSize*0.5,0);
	var yLoc = new V2D(0,compareSize*0.5);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = view.image();
		// project: center, up, right
		var cen2D = view.projectPoint3D(center);
		var rig2D = view.projectPoint3D(right);
		var top2D = view.projectPoint3D(top);
		rig2D.sub(cen2D);
		top2D.sub(cen2D);
		// TODO: PROJECTED CENTER AND ACTUAL CENTER ARE DIFFERENT ...
		var p2D = p3D.point2DForView(view);
			cen2D = p2D.point2D();
		// create affine
		var pointsA = [org,rig2D,top2D];
		var pointsB = [org,xLoc,yLoc];
		var matrix = R3D.affineMatrixExact(pointsA,pointsB);
		// var matrix = R3D.affineMatrixLinear(pointsA,pointsB);
		// extract from affine
		var needle = image.extractRectFromFloatImage(cen2D.x,cen2D.y,1.0,null,compareSize,compareSize, matrix);
		patches.push(needle);
	}
	// cost
	var totalCost = 0;
	var compares = 0;
	for(var i=0; i<patches.length; ++i){
		var patchI = patches[i];
		for(var j=i+1; j<patches.length; ++j){
			var patchJ = patches[j];
			var scoresNCC = R3D.searchNeedleHaystackNCCColor(patchI,patchJ, needleMask);

	throw "HERE"
			scoresNCC = scoresNCC["value"][0];
			totalCost += scoresNCC;
			++compares;
		}
	}
	totalCost /= compares;
	return totalCost;
}

Stereopsis.World.prototype.bundleAdjustFull = function(){ // for each pair, pick points at random to optimize the 3D camera location | ???
console.log("bundleAdjustFull");
throw "used?"

// THIS DESTROYS F ERROR .......

// NOT CHECKED YET


	var matchSortFxn = function(a,b){
		return a.errorR() < b.errorR() ? -1 : 1;
	}
	var views = this.toViewArray();
	var listK = [];
	var listA = [];
	var listPoints2D = Code.newArrayArrays(views.length);
	var listPoints3D = [];
	var maxPoint2DCountPair = 300; // 3+
	// var maxPoint2DCountPair = 1000; // 2
	// var maxPoint2DCountPair = Math.ceil(1000/views.length); // 1000, 500, 333, 250 ...
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		// console.log("ABS :\n"+viewA.absoluteTransform());
		listK[i] = viewA.K();
		listA[i] = viewA.absoluteTransform();
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var matches = transform.matches();
			matches.sort(matchSortFxn); // best approximations first
			// var count = Math.min(matches.length,maxPoint2DCountPair);
			var indexes = Code.randomIndexes(maxPoint2DCountPair, matches.length);
			var count = indexes.length;
console.log(count+" OF "+matches.length);
console.log(indexes);
			for(var k=0; k<count; ++k){
				var index = indexes[k];
				var match = matches[index];
				var pointA = match.pointForView(viewA);
				var pointB = match.pointForView(viewB);
				var point3D = match.point3D();
				if(point3D.data()===null){
					point3D.data(listPoints3D.length);
					listPoints3D[listPoints3D.length] = point3D;
				}
				listPoints2D[i].push({"2D":pointA.point2D().copy(), "3D":point3D.data()});
				listPoints2D[j].push({"2D":pointB.point2D().copy(), "3D":point3D.data()});
			}
		}
	}
	var originals3D = [];
	for(var i=0; i<listPoints3D.length; ++i){
		var point3D = listPoints3D[i];
		originals3D[i] = point3D;
// TODO: SHOULD RANDOM POINTS BE UPDATED? OR JSUT THE VIEWS?
		// point3D.data(null);
		listPoints3D[i] = point3D.point().copy();
	}
	// console.log(listK, listA, listPoints2D, listPoints3D);
	var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 100); // "extrinsics" ""
	// console.log(result);


	// attach results to data sources
	var Ms = result["extrinsics"];
	var Ps = result["points"];
	for(var i=0; i<Ms.length; ++i){
		var M = Ms[i];
		var view = views[i];
		view.absoluteTransform(M);
	}
/*
	console.log("FORCE BACK: "+Ps.length);
	for(var i=0; i<Ps.length; ++i){
		var P3D = Ps[i];
		var point3D = originals3D[i];
this.updatePoint3DLocation(point3D,P3D);
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
throw "WHAT SHOULD THIS POINT LOCATION BE?"
			match.estimated3D(point3D.point().copy());
		}
	}
*/
	// ?
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransform();
		var absB = viewB.absoluteTransform();
		var invA = Matrix.inverse(absA);
		var relativeAtoB = Matrix.mult(invA,absB);
		var K = viewA.K();
		var Kinv = viewA.Kinv();
		var F = R3D.fundamentalFromCamera(relativeAtoB, K, Kinv);
		transform.R(viewA,viewB,relativeAtoB);
		transform.F(viewA,viewB,F);
	}
	/*
	// remove non-BA P3Ds:
	var world = this;
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!(point3D.data()==true)){
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	*/
	console.log("remaining points: "+this.point3DCount());
}

// Stereopsis.World.prototype.doubleCellResolutionGrid = function(){  // adding more points --- better be very last step -- break all
// 	var pointsPerView = this.doubleCellResolutionGrid();
// 		pointsPerView = pointsPerView["value"];
// 	for(var i=0; i<pointsPerView.length; ++i){
// 		var entry = pointsPerView[i];
// 		var view = entry["view"];
// 		var points = entry["points"];
// 		for(var j=0; j<points.length; ++j){
// 			var point = points[j];
// 			var n3D = point["normal"];
// 			var p3D = point["point3D"];
// 			var p2D = point["point2D"];
// 			var point3D = new Stereopsis.P3D();
// 			point3D.point(p3D);
// 			var point2D = new Stereopsis.P2D();
// 			point2D.point2D(p2D);
// 			point2D.view(view);
// 			var match = new Stereopsis.Match2D(point2D,point2D,point3D); // pointA,pointB, point3D, affine, ncc, sad, others
// 			point3D.addMatch(match);
// 			point3D.addPoint2D(point2D);
// 			this._points3DNull.push(point3D);
// 		}
// 	}
// }

Stereopsis.World.prototype.doubleCellResolutionGrid = function(){ // very last step to smooth out surface interpolation -- outliers should be gone
	console.log("doubleCellResolutionGrid");
	var views = this.toViewArray();
	var toPoint = function(o){
		return o.point2D();
	};
	var pointsPerView = [];
	var grid = new Grid2D(toPoint);
	var c = new V2D();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space = view._pointSpace;
		var allPoints2D = space.toArray();
		var viewSize = view.size();
		var cellSize = view.cellSize();
		grid.setFromCountAndCellSize( Math.ceil(viewSize.x/cellSize),Math.ceil(viewSize.y/cellSize), cellSize,cellSize, 0,0);
		for(var j=0; j<allPoints2D.length; ++j){
			var point2D = allPoints2D[j];
			grid.insertObject(point2D);
		}
		console.log(allPoints2D.length);
		console.log(grid+" ... ");
		// get neighbors for each cell
		var cellX = viewSize.x/cellSize | 0;
		var cellY = viewSize.y/cellSize | 0;
		var interpolatedPoints = [];
		for(var jj=0; jj<cellY; ++jj){
			for(var ii=0; ii<cellX; ++ii){
				// split into quadrants
				var points = grid.objectsFromColRow(ii,jj);
				if(points.length==0){
					continue;
				}
				// find quadrant contents:
				var emptyTL = true;
				var emptyTR = true;
				var emptyBL = true;
				var emptyBR = true;
				c.set( (ii+0.5)*cellSize, (jj+0.5)*cellSize );
				for(var p=0; p<points.length; ++p){
					if(p.x<c.x){
						if(p.y<c.y){
							emptyTL = false;
						}else if(p.y>c.y){
							emptyBL = false;
						}
					}else if(p.x>c.x){
						if(p.y<c.y){
							emptyTR = false;
						}else if(p.y>c.y){
							emptyBR = false;
						}
					}
				}
				// find neighbor quadrants
				var neighbors = grid.neighbor9ObjectsForColRow(ii,jj);
				var nTL = Code.arrayPushArrays([],neighbors[0],neighbors[1],neighbors[3]);
				var nTR = Code.arrayPushArrays([],neighbors[1],neighbors[2],neighbors[5]);
				var nBL = Code.arrayPushArrays([],neighbors[3],neighbors[6],neighbors[7]);
				var nBR = Code.arrayPushArrays([],neighbors[5],neighbors[7],neighbors[8]);
				var hasTL = nTL.length>0;
				var hasTR = nTR.length>0;
				var hasBL = nBL.length>0;
				var hasBR = nBR.length>0;
				var pointSources;
				var loc2D, p3D;
				if(emptyTL && hasTL){
					pointSources = nTL;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(-cellSize*0.25,-cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyTR && hasTR){
					pointSources = nTR;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(cellSize*0.25,-cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyBL && hasBL){
					pointSources = nBL;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(-cellSize*0.25,cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyBR && hasBR){
					pointSources = nBR;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(cellSize*0.25,cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
			}
		}
		pointsPerView.push({"view":view,"points":interpolatedPoints});
	}
	grid.kill();
	return {"value":pointsPerView};
}


Stereopsis.World.prototype.interpolateP3DFromP2D = function(destination2D, list2D){
	var weights = [];
	var totalWeights = 0;
	for(var i=0; i<list2D.length; ++i){
		var point2D = list2D[i];
		var p2D = point2D.point2D();
		var distance = V2D.distance(destination2D,p2D);
		var weight = distance;
		weights.push(weight);
		// totalWeights += weight;
	}
	var percents = Code.errorsToPercents(weights);
		percents = percents["percents"];
	// interpolate:
	var points3D = [];
	var normals = [];
	for(var i=0; i<list2D.length; ++i){
		var point2D = list2D[i];
		var point3D = point2D.point3D();
		var p3D = point3D.point();
		var n3D = point3D.normal();
		if(p3D){
			points3D.push(p3D);
		}
		if(n3D){
			normals.push(n3D);
		}
	}
	var normal = null;
	if(normals.length==list2D.length){
		normal = Code.averageAngleVector3D(normals,percents);
	}
	var point3D = null;
	if(points3D.length==list2D.length){
		point3D = Code.averageV3D(points3D,percents);
	}
	return {"point3D":point3D,"normal":normal, "point2D":destination2D};
}



Stereopsis.World.prototype._iterationPatch = function(point3D,wasLocation,isLocation){

}
Stereopsis.World.prototype.forEachTransform = function(fxn){
	Code.forEach(this._transforms, fxn);
}
Stereopsis.World.prototype.forEachView = function(fxn){
	Code.forEach(this._views, fxn);
}
Stereopsis.World.prototype.forEachPoints3D = function(fxn){
	var points3D = this._pointSpace.toArray();
	Code.forEach(points3D, fxn);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.COMPARE_SIZE = 11;
Stereopsis.optimumAffineMatchFromPoints = function(imageA,imageB, pointA,pointB, scaleAtoB,angleAtoB, compareSize, skip){ // move around ~ 1pixel
	var affine = new Matrix(3,3).identity();
	affine = Matrix.transform2DRotate(affine,angleAtoB);
	affine = Matrix.transform2DScale(affine,scaleAtoB);
	if(skip){
		return affine;
	}
	return affine;
	// return Stereopsis.refineAffine(imageA,imageB, pointA,pointB, affine, compareSize);
}
// Stereopsis.refineAffine = function(imageA,imageB, pointA,pointB, affine, compareSize){
// 	???
// }
// 	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
// 	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
// 	var limitPixel = 1.0;
// 	var limitVAB = 0.25;
// 	// var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
// 	// optimumAffineTransform
// 	// var bestAffine = R3D.affineTransformFromVectors(optimum);
// 	return bestAffine;
// }
Stereopsis._errorAffineMatrix = null;
Stereopsis._errorAffine = function(size){
	if(!Stereopsis._errorAffineMatrix){
		var arr = [];
		var center = size*0.5;
		for(var j=0; j<size; ++j){
			for(var i=0; i<size; ++i){
				var index = j*size + i;
				var distance = Math.sqrt( Math.pow(center-i,2) + Math.pow(center-j,2) );
				arr[index] = distance;
			}
		}
		Stereopsis._errorAffineMatrix = arr;
	}
	return Stereopsis._errorAffineMatrix;
}
Stereopsis.World.minimumUniqueness = 0.10; // 0.0 -> 0.59


Stereopsis.World.prototype.matchUniqueness = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var imageScalesA = viewA.imageScales();
	var imageScalesB = viewB.imageScales();
	var pointA = match.point2DA().point2D();
	var pointB = match.point2DB().point2D();
	var matrix = match.affine();
	var needleSize = Stereopsis.compareSizeForViews2D(viewA,pointA,viewB,pointB);
	var haystackSize = needleSize * 4; // 3-5 --- if F/R error is low, can limit this more towards ~ 2
	var compareSize = 9; // 5 - 11
	var cellScale = (compareSize/needleSize);



	// var needle = imageScalesA.extractRect(pointA,cellScale,compareSize,compareSize, matrix);
	// var haystack = imageScalesB.extractRect(pointB,cellScale,haystackSize,haystackSize, null);


throw "this is not done"
	var affine = new Matrix2D();
		affine.copy(matrix);

		var inScale = 1.0/cellScale;
	var halfNeedle = (needleSize-1)*0.5;
	var halfHaystack = (haystackSize-1)*0.5;

	var needle = new ImageMat(needleSize,needleSize);
	var haystack = new ImageMat(haystackSize,haystackSize);

	affine = Stereopsis._temp_matrix2D.copy(affine);
	affine.inverse();
	affine.scale(inScale);
	var averageScale = affine.averageScale();
		ImageMatScaled.affineToLocationTransform(affine,affine, halfNeedle,halfNeedle, pointA.x,pointA.y);
		imageScalesA.extractRectFast(needle, averageScale, affine);

	affine.identity();
	affine.scale(inScale);
	var averageScale = affine.averageScale();
		ImageMatScaled.affineToLocationTransform(affine,affine, halfHaystack,halfHaystack, pointB.x,pointB.y);
		imageScalesB.extractRectFast(haystack, averageScale, affine);







	var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);

	var value = scoreSAD["value"];
	var width = scoreSAD["width"];
	var height = scoreSAD["height"];

	var peaks = Code.findMinima2DFloat(value, width, height, true);
		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
	// console.log(peaks);
	var uniqueness = 0;
	if(peaks.length>1){
		var first = peaks[0].z;
		var second = peaks[1].z;
		uniqueness = first/second;
	}
	// console.log("uniqueness: "+uniqueness);
	return uniqueness;
}

Stereopsis.COMPARE_HAYSTACK_NEEDLE_SIZE = 11;
Stereopsis.World.prototype.bestNeedleHaystackMatchFromLocation = function(centerA,centerB, existingA, affineAB, viewA,viewB){
	var world = this;
	var result = world.bestNeedleHaystackFromLocation(centerA,centerB, existingA, affineAB, viewA,viewB);
	var pointB = result["point"];

// if(Code.isNaN(existingA.x) || Code.isNaN(existingA.y) || Code.isNaN(centerA.x) || Code.isNaN(centerA.y) || Code.isNaN(centerB.x) || Code.isNaN(centerB.y) || Code.isNaN(pointB.x) || Code.isNaN(pointB.y)){
// 	console.log(centerA);
// 	console.log(centerB);
// 	console.log(existingA);
// 	console.log(result);
// 	console.log(affineAB);
// 	throw "bad inside bestNeedleHaystackMatchFromLocation";
// }

	// 0.40,0.41,0.44, vs 0.38,0.38,0.38,0.41
	// 0.41/0.38 = 7%
	// TODO: MORE PRECISE LOCALIZATION?:
	var needleSize = 41;
	var haystackSize = needleSize + 4;
	
	var needleRefine = world._bestNeedleHaystackMatchFromLocation_TEMP_NEEDLE_REFINE;
	var haystackRefine = world._bestNeedleHaystackMatchFromLocation_TEMP_HAYSTACK_REFINE;
	if(!needleRefine){
		needleRefine = new ImageMat(needleSize,needleSize);
		haystackRefine = new ImageMat(haystackSize,haystackSize);
		world._subDivideUpdateMatchLocation_TEMP_NEEDLE_REFINE = needleRefine;
		world._subDivideUpdateMatchLocation_TEMP_HAYSTACK_REFINE = haystackRefine;
	}
	// var featureSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
	var featureSizeA = viewA.compareSizeForPoint(centerA);
	var result = R3D.optimumSADLocationSearchFlatRGB(existingA,pointB, viewA.imageScales(),viewB.imageScales(), featureSizeA, needleSize,haystackSize, affineAB, needleRefine,haystackRefine);
	var originalPointB = pointB;
	var pointB = result["point"];
	// check validitiy
	var sizeB = viewB.size();
	if(pointB.x<0 || pointB.x>=sizeB.x || pointB.y<0 || pointB.y>=sizeB.y){
		// console.log("     A: "+existingA);
		// console.log(" was B: "+originalPointB);
		// console.log(" new B: "+pointB);
		// console.log("new point B too far out: "+pointB+" v "+sizeB);
		return null;
	}

	var match = world.newMatchFromInfo(viewA,existingA,viewB,pointB,affineAB);
	return match;
}
Stereopsis.World.prototype.bestNeedleHaystackFromLocation = function(centerA,centerB, existingA, affineAB, viewA,viewB, isR){
	var world = this;
	var featureSizeA = viewA.compareSizeForPoint(centerA);
	var predictedB = affineAB.multV2D( V2D.sub(existingA,centerA) ).add(centerB);
	var needleSize = 11;//Stereopsis.COMPARE_HAYSTACK_NEEDLE_SIZE;

var actualSizePerPixel = featureSizeA/needleSize;
// console.log(actualSizePerPixel);

var transform = world.transformFromViews(viewA,viewB)
// console.log(transform);
var haystackSizeMax = needleSize * 2 + 1;
var haystackMargin = haystackSizeMax;
/*
if(isR){
	var rMean = transform.rMean();
	var rSigma = transform.rSigma();
	// var errorR = rMean + 1.0*rSigma; // no wiggle
	var errorR = rMean + 2.0*rSigma; // 2-3 sigma
	// var errorR = rMean + 3.0*rSigma; // much wiggle
	// console.log(errorR);
	haystackMargin = Math.ceil(errorR/actualSizePerPixel);
	if(Code.isNaN(haystackMargin)){
		console.log(rMean, rSigma, errorR, actualSizePerPixel, featureSizeA, needleSize);
		console.log(transform);
		throw "haystackMargin NaN";
	}
}
*/
// console.log(haystackMargin);
	var haystackSize = Math.min(needleSize + 2*haystackMargin, haystackSizeMax);
	if(Code.isNaN(haystackSize)){
		console.log(needleSize, haystackMargin, haystackSizeMax);
		throw "haystackSize NaN";
	}

// console.log(haystackSize);

	// var haystackSize = needleSize * 2; // 2-4 --- if F/R error is low, can limit this more towards ~ 2


	// var reuseNeedle = this._bestNH_needle;
	var reuseNeedleTable = this._bestNH_needle_table;
	if(!reuseNeedleTable){
		console.log("made new reuse needle table");
		reuseNeedleTable = []; // index on ints
		this._bestNH_needle_table = reuseNeedleTable;
	}
	var reuseNeedle = reuseNeedleTable[needleSize];
	if(!reuseNeedle){
		console.log("made new reuse needle: "+needleSize);
		reuseNeedle = new ImageMat(needleSize,needleSize);
		reuseNeedleTable[needleSize] = reuseNeedle;
	}

	// could have multiple haystacks of varying sizes
	// var reuseHaystack = this._bestNH_haystack;
	var reuseHaystackTable = this._bestNH_haystack_table;
	if(!reuseHaystackTable){
		console.log("made new reuse haystack table");
		reuseHaystackTable = []; // index on ints
		this._bestNH_haystack_table = reuseHaystackTable;
	}

	var reuseHaystack = reuseHaystackTable[haystackSize];
	if(!reuseHaystack){
		console.log("made new reuse haystack: "+haystackSize+" ( "+needleSize+" )");
		reuseHaystack = new ImageMat(haystackSize,haystackSize);
		reuseHaystackTable[haystackSize] = reuseHaystack;
	}

	var result = R3D.optimumSADLocationSearchFlatRGB(existingA,predictedB, viewA.imageScales(),viewB.imageScales(), featureSizeA, needleSize,haystackSize, affineAB, reuseNeedle,reuseHaystack);

	// TODO: maybe more sub-pixel accuracy increasing?



	return result;
}
Stereopsis.World.prototype.bestAffine2DFromLocation = function(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum){
		forwardBackwardCheck = false;
		skipOptimum = true;
	var imageA = viewA.image();
	var imageB = viewB.image();
	var compareSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
	var result = R3D.bestAffine2DFromExisting(affine,imageA,centerA,imageB,centerB, existingA, compareSize, forwardBackwardCheck, skipOptimum);
	return result;
}
Stereopsis.World.prototype.bestMatch2DFromLocation = function(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum){
	var world = this;
	var result = world.bestAffine2DFromLocation(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum);
	if(result){
		var pointA = result["A"];
		var pointB = result["B"];
		var optimum = result["affine"];
		if(optimum){
			var match = world.newMatchFromInfo(viewA,pointA,viewB,pointB,optimum);
			return match;
		}
	}
	return null;
}
// Stereopsis.World.Probe2DCompareSize = 11; // 7-11
Stereopsis.World.prototype.bestMatch2DFromExisting = function(affine,centerA,centerB, existingA, viewA,viewB){
	throw "is this used - bestMatch2DFromExisting"
	var imageA = viewA.image();
	var imageB = viewB.image();

	var needleSize = 11;
	var haystackSize = 2*needleSize;
	// var needleSize = viewB.compareSize(); // smaller size would be more accurate | larger size allows for more initial error
	// var haystackSize = 2*needleSize;

	var reuseNeedle = this.bestMatch2DFromExisting_needle;
	if(!reuseNeedle){
		reuseNeedle = new ImageMat(needleSize,needleSize);
		this.bestMatch2DFromExisting_needle = reuseNeedle;
	}

	var reuseHaystack = this.bestMatch2DFromExisting_haystack;
	if(!reuseHaystack){
		reuseHaystack = new ImageMat(haystackSize,haystackSize);
		this.bestMatch2DFromExisting_haystack = reuseHaystack;
	}

	var featureSize = viewB.compareSize();

	var deltaA = V2D.sub(existingA,centerA); // A to B
	var deltaB = affine.multV2DtoV2D(deltaA);
	var predictedB = deltaB.add(centerB);

	// var locationB = R3D.bestAffineLocationFromLocation(affine,centerA,centerB, existingA, imageA,imageB,needleSize, haystackSize);

	var result = R3D.optimumSADLocationSearchFlatRGB(existingA,predictedB, viewA.imageScales(),viewB.imageScales(), featureSize, needleSize,haystackSize, affine, reuseNeedle,reuseHaystack);
	var locationB = result["point"];
	console.log(locationB);
	throw "HERE";


	// var compareWindow = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,locationB);
	var compareWindow = viewB.compareSize();

	var compareSize = 11;
	var compareArea = 2 + 2*compareSize;
	var needleZoom = (compareWindow/compareSize);
	var matrixReuse = new Matrix2D();
	var info = R3D.subpixelHaystack(imageA,imageB, existingA,locationB, affine,  compareSize,compareArea, needleZoom);
	var result = info["B"];
	locationB.x = result.x;
	locationB.y = result.y;

	// more accurate location?:
	// compareSize = 7;
	// compareArea = 2*compareSize;
	// needleZoom = 0.5 * (compareWindow/compareSize);
	// var info = R3D.subpixelHaystack(imageA,imageB, existingA,locationB, affine,  compareSize,compareArea, needleZoom);
	// var result = info["B"];
	// locationB.x = result.x;
	// locationB.y = result.y;

	var match = this.newMatchFromInfo(viewA,existingA.copy(),viewB,locationB,affine);
	return match;
}
Stereopsis.averageCornerness = function(view,point){
	var corners = view.corners();
	var size = view.size();
	var blockSize = 11;
	var compareSize = view.compareSize();
	var needleSize = blockSize;
	var scale = blockSize/compareSize;
	var matrix = null;
	var needle = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null,blockSize,blockSize, corners,size.x,size.y, matrix);
	var mean = Code.mean(needle);
	return mean;
}
// Stereopsis.uniquenessPerUnitCell = function(imageA,pointA,matrixA, imageB,pointB,matrixB, scale){
// 	var sizeA = viewA.size();
// 	var sizeB = viewB.size();
// 	var blockSize = 11;
// 	var compareSize = view.compareSize();
// 	var needleSize = blockSize;
// 	var scale = blockSize/compareSize;
// 	var matrix = null;
// 	var needle = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null,blockSize,blockSize, corners,size.x,size.y, matrix);
// 	var mean = Code.mean(needle);
// 	return uniqueness;
// }
// Stereopsis.uniquenessFromImages = function(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale){
// 	// console.log(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale)
// 	scale = scale!==undefined ? scale : 1.0;
// 	// console.log("uniquenessFromImages");
// 	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, matrixA);
// 	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, matrixB);
// 	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
// ???
// throw "HERE"
// 	var values = scoreNCC["value"];
// 	var width = scoreNCC["width"];
// 	var height = scoreNCC["height"];
// 	var uniqueness = Stereopsis.uniquenessFromValueList(values, width, height);
// 	return uniqueness;
// 	// 	scoreNCC = scoreNCC["value"][0];
// 	// var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
// 	// 	scoreSAD = scoreSAD["value"][0];
//
// }
// Stereopsis.uniquenessFromValueList = function(values, width, height){
// 	// console.log(values, width, height);
// 	var peaks = Code.findMinima2DFloat(values, width, height, true);
// 		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
// 	var uniqueness = 1.0;
// 	var nextBest = 0;
// 	var thisBest = 0;
// 	if(peaks.length>1){
// 		thisBest = peaks[0].z;
// 		nextBest = peaks[1].z;
// 		// var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
// 		// uniqueness = 1-(peaks[1].z-peaks[0].z);
// 		// uniqueness = nextBest/thisBest;
// 		uniqueness = nextBest - thisBest;
// 		// uniqeness = Math.pow(uniqueness,0.5);
// 		// uniqueness = 1.0 + Math.pow(uniqueness,0.1);
// 		// uniqueness = 1.0;
// 	}
// 	return uniqueness;
// }


Stereopsis.World.prototype.toPointFile = function(withNormals){ // len | pnts | nrms
	withNormals = withNormals!==undefined ? withNormals : true;
	var points3D = this.toPointArray();
	var world = this;
	console.log("point count: "+points3D.length);
	if(withNormals){
		world.patchInitBasicSphere(false,points3D);
	}
	var points = [];
	var normals = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var normal = point3D.normal();
		points.push(point.x," ",point.y," ",point.z);
		points.push("\n");
		normals.push(normal.x," ",normal.y," ",normal.z);
		normals.push("\n");
	}
	var items = [];
	items.push(points3D.length);
	items.push("\n");
	Code.arrayPushArray(items,points);
	Code.arrayPushArray(items,normals);
	console.log(items);
	var str = items.join("");
	return str;
}
Stereopsis.World.prototype.toObject = function(){
	var object = {};
	var minimumMatchCountForTransform = 8;
	// OBJECTS
	var cameras = this._cameras;
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	var points3D = this.toPointArray();
	// CAMERAS
	if(cameras && cameras.length>0){
		// yaml.writeArrayStart("cameras");
		var objectCameras = [];
		object["cameras"] = objectCameras;
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			var objectCamera = {};
			objectCameras.push(objectCamera);
			var cameraID = camera.data();
			if(!cameraID){
				cameraID = camera.id();
			}
			objectCamera["id"] = cameraID;
			var K = camera.K();
			if(K){
				objectCamera["K"] = K;
			}
			var distortion = camera.distortion();
			if(distortion){
				objectCamera["distortion"] = distortion;
			}
console.log("SCALE THIS?")
		}
	}
	// VIEWS
	if(views && views.length>0){
		totalViewCount = views.length;
		
		var objectViews = [];
		object["views"] = objectViews;
		for(var i=0; i<views.length; ++i){
			var view = views[i];

			var objectView = {};
			objectViews.push(objectView);

			var viewID = view.data();
			if(!viewID){
				viewID = view.id();
			}
			var imageSize = view.size();
			if(!imageSize){
				imageSize = new V2D(0,0);
			}
			var cellSize = view.cellSize();
			objectView["id"] = viewID;
			objectView["camera"] = null;
			var camera = view.camera();
			if(camera){
				var cameraID = camera.data();
				if(!cameraID){
					cameraID = camera.id();
				}
				objectView["camera"] = cameraID;
			}
			objectView["imageSize"] = imageSize.copy();
			objectView["cellSize"] = cellSize/imageSize.x;
			var absoluteTransform = view.absoluteTransform();
			if(absoluteTransform){
				objectView["transform"] = absoluteTransform.copy();
			}
			// console.log("TODO: SAVE PAIR INFO : RELATIVE Fs");
		}

		// TRANSFORMS:
		var objectTransforms = [];
		for(var i=0; i<views.length; ++i){
			var viewA = views[i];
			for(var j=i+1; j<views.length; ++j){
				var viewB = views[i];
				var relativeTransform = this.transformFromViews(views[i],views[j]);
				if(relativeTransform){
					var avgWidth = (viewA.size().x + viewB.size().x) * 0.5;
					var objectTransform = {};
					var matchCount = 0;
					objectTransform["matches"] = null;
					if(relativeTransform.matches()){
						matchCount = relativeTransform.matches().length;
					}
					if(matchCount<minimumMatchCountForTransform){
						continue;
					}
					objectTransform["matches"] = matchCount
					objectTransform["errorRMean"] = relativeTransform.rMean()/avgWidth;
					objectTransform["errorRSigma"] = relativeTransform.rSigma()/avgWidth;
					objectTransform["errorFMean"] = relativeTransform.fMean()/avgWidth;
					objectTransform["errorFSigma"] = relativeTransform.fSigma()/avgWidth;
					objectTransform["errorNCCMean"] = relativeTransform.nccMean();
					objectTransform["errorNCCSigma"] = relativeTransform.nccSigma();
					objectTransform["errorSADMean"] = relativeTransform.sadMean();
					objectTransform["errorSADSigma"] = relativeTransform.sadSigma();
					var viewA = relativeTransform.viewA();
					var viewB = relativeTransform.viewB();
					objectTransform["A"] = viewA.data();
					objectTransform["B"] = viewB.data();
					var absA = viewA.absoluteTransform();
					var absB = viewB.absoluteTransform();
					trans = null;
					if(absA && absB){
						trans = Matrix.relativeWorld(absA,absB);
					}
					objectTransform["transform"] = trans;
					// objectTransform["transform"] = R3D.relativeTransformMatrix2(viewA.absoluteTransform(),viewB.absoluteTransform());
					objectTransforms.push(objectTransform);
				}
			}
		}
		if(objectTransforms.length>0){
			object["transforms"] = objectTransforms;
		}
	}
	object["points"] = null; // if not present
	if(points3D && points3D.length>0){
		console.log("PRINT OUT THE ERROR IN RELATIVE AND ABSOLUTE LOCATION, HOW FAR ARE THE INDIVIDUAL / AVERAGES OFF FOR EACH TRANSFORM PAIR ?");
		console.log("max match types "+R3D.maxiumMatchesFromViewCount(totalViewCount) );
		var objectPointList = [];
		object["points"] = objectPointList;
		// var countList = Code.newArrayZeros( R3D.BA.maxiumMatchesFromViewCount(totalViewCount) + 2);
		var countList = Code.newArrayZeros(totalViewCount+1);
		for(var i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = point3D.point();
			var pointCount = point3D.toPointArray().length;
			countList[pointCount]++;
			if(point){
				var points2D = point3D.toPointArray();
				// increasing resolution step messes this up
				if(points2D.length==0){
					console.log(point3D);
					this.removeCheckP3D(point3D);
					// throw "no points 2d ? ";
					continue;
				}
				var objectPoint = {};
				objectPointList.push(objectPoint);
				// position
				objectPoint["X"] = point.x;
				objectPoint["Y"] = point.y;
				objectPoint["Z"] = point.z;
				// normal
				var normal = point3D.normal();
				if(normal){
					objectPoint["x"] = normal.x;
					objectPoint["y"] = normal.y;
					objectPoint["z"] = normal.z;
					var size = point3D.size();
					objectPoint["s"] = size;
				}
				// 2D
				if(points2D.length>0){
					var objectViews = [];
					objectPoint["v"] = objectViews;
					for(var j=0; j<points2D.length; ++j){
						var point2D = points2D[j];
						var view = point2D.view();
						var size = view.size();
						var pnt = point2D.point2D();
						var objectView = {};
						objectViews.push(objectView);
							objectView["i"] = view.data(); // data holds the original project id
							objectView["x"] = pnt.x/size.x;
							objectView["y"] = pnt.y/size.y;
					}
				}
			}
		}
	}
	return object;
}
Stereopsis.World.prototype.toYAMLString = function(){
	console.log("toYAMLString");
	var world = this;
	var yaml = new YAML();
	var timestampNow = Code.getTimeStamp();
	yaml.writeComment("BA model");
	yaml.writeComment("created: "+timestampNow);
	yaml.writeBlank();
	yaml.writeObjectLiteral(world.toObject());

	// throw "here";
	yaml.writeDocument();
	var str = yaml.toString();
	return str;
}


Stereopsis.World.prototype.debug = function(){
	var display = GLOBALSTAGE;
display.removeAllChildren();
	// show views & matches:
	var views = this.toViewArray();
	// var viewA = views[0];
	// var viewB = views[1];
	// var viewC = views[2];
	var pairs = []; //[[viewA,viewB],[viewA,viewC],[viewB,viewC]];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			pairs.push([viewA,viewB]);
		}
	}
	console.log(pairs);

	for(var p=0; p<pairs.length; ++p){
		viewA = pairs[p][0];
		viewB = pairs[p][1];
		var imageA = viewA.image();
		var imageB = viewB.image();
		if(!(imageA && imageB)){
			continue;
		}
		var imageWidthA = imageA.width();
		//console.log(viewA,viewB)
		var alp = 0.10;
			var iii = imageA;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.graphics().alpha(alp);
			d.matrix().translate(imageWidthA*p*2,0);
			display.addChild(d);
			var iii = imageB;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.graphics().alpha(alp);
			d.matrix().translate(imageWidthA*(p*2+1),0);
			display.addChild(d);

	}
	for(var p=0; p<pairs.length; ++p){
		viewA = pairs[p][0];
		viewB = pairs[p][1];
		if(!imageA){
			continue;
		}
		var imageWidthA = imageA.width();
		var points = viewA.toPointArray();
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var opposite = point.oppositePointForView(viewB);
			if(opposite){
				var a = point.point2D();
				var b = opposite.point2D();
				// A
				var d = new DO();
				d.graphics().setLine(1.0,0xCCFF0000);
				d.graphics().beginPath();
				d.graphics().drawCircle(a.x*1,a.y*1, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(imageWidthA*p*2,0);
				display.addChild(d);
				// B
				var d = new DO();
				d.graphics().setLine(1.0,0xCC0000FF);
				d.graphics().beginPath();
				d.graphics().drawCircle(b.x*1,b.y*1, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(imageWidthA*(p*2+1),0);
				display.addChild(d);
				// line
				var d = new DO();
				d.graphics().setLine(1.0,0x66FF00FF);
				d.graphics().beginPath();
				d.graphics().moveTo(imageWidthA*(p*2+0) + a.x*1,a.y*1);
				d.graphics().lineTo(imageWidthA*(p*2+1) + b.x*1,b.y*1);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(0,0);
				display.addChild(d);
			}
	 	}
	 }

	/*
	// show matches:
	var transform = this.transformFromViews(viewA,viewB);
	var matches = transform.matches();
	var cellScale = 1.0;
	var cellSize = 30;
	var rowSize = 10;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var affine = match.affineForViews(viewA,viewB);
		// console.log(affine);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		// console.log(pA+" => "+pB);
		var subA = imageA.extractRectFromFloatImage(pA.x,pA.y,cellScale,null,cellSize,cellSize, affine);
		var subB = imageB.extractRectFromFloatImage(pB.x,pB.y,cellScale,null,cellSize,cellSize, null);

		var sca = 2.0;

		var x = Math.floor(i/rowSize)*sca*cellSize*2.0;
		var y = (i%rowSize)*sca*cellSize;

		var iii = subA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(imageWidthA*2.0 + x, 10 + y);
		GLOBALSTAGE.addChild(d);

		var iii = subB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(imageWidthA*2.0 + x + sca*cellSize, 10 + y);
		GLOBALSTAGE.addChild(d);
	}
	*/

/*
	// cells check
	var list = this.CHECKCELLS;
	if(list){
	var cellSize = viewA.cellSize();
	for(var i=0; i<list.length; ++i){
		var entry = list[i];
		var view = entry[0];
		var center = entry[1];
			var d = new DO();
			d.graphics().setLine(1.0,0xCCFFCC00);
			d.graphics().beginPath();
			d.graphics().drawRect(center.x-cellSize*0.5,center.y-cellSize*0.5, cellSize,cellSize);
			d.graphics().strokeLine();
			d.graphics().endPath();
			if(view==viewB){
				d.matrix().translate(imageWidthA,0);
			}
			display.addChild(d);
	}
	}
*/

	/*

	// AFFINE FROM HOMOGRAPHY TEST:
	var pointsA = [];
	pointsA.push(new V2D(0,0));
	pointsA.push(new V2D(1,0));
	pointsA.push(new V2D(0,1));
	// pointsA.push(new V2D(1,1));
	// pointsA.push(new V2D(-1,-1));
	pointsA.push(new V2D(1,1));

	var pointsB = [];
	pointsB.push(new V2D(0,0));
	pointsB.push(new V2D(1,0));
	pointsB.push(new V2D(0,1));
	// pointsB.push(new V2D(1.2,1.2));
	// pointsB.push(new V2D(-2,-2));
	pointsB.push(new V2D(2,1));

	var affine = R3D.affineMatrixLinear(pointsA,pointsB);
	console.log(affine+"");
	var tx = affine.get(0,2);
	var ty = affine.get(1,2);
	affine.set(0,2, 0);
	affine.set(1,2 ,0);

	var c = new V2D(1500,200);
	var s = 100;

	var pointsC = [];
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var pointC = affine.multV2DtoV2D(pointA);
		pointsC.push(pointC);

		var sca = 50.0;
		var d = new DO();
		d.graphics().setFill(0xCC0000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(pointA.x*sca,pointA.y*sca, 5);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(c.x,c.y);
		display.addChild(d);

		var d = new DO();
		d.graphics().setFill(0xCCFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(pointB.x*sca,pointB.y*sca, 5);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(c.x,c.y);
		display.addChild(d);
	}

	var square = [];
	square.push(new V2D(-s*0.5,-s*0.5));
	square.push(new V2D( s*0.5,-s*0.5));
	square.push(new V2D( s*0.5, s*0.5));
	square.push(new V2D(-s*0.5, s*0.5));
	var q = new DO();
	q.graphics().setLine(1.0,0xFF0000FF);
	q.graphics().beginPath();
	var d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	for(var i=0; i<square.length; ++i){
		var squ = square[i];
		var point = affine.multV2DtoV2D(squ);
		console.log(i+" : "+point);
		if(i==0){
			q.graphics().moveTo(squ.x,squ.y);
			d.graphics().moveTo(point.x,point.y);
		}else{
			q.graphics().lineTo(squ.x,squ.y);
			d.graphics().lineTo(point.x,point.y);
		}
	}
	q.graphics().endPath();
	q.graphics().strokeLine();
	q.matrix().translate(c.x,c.y);
	display.addChild(q);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(c.x,c.y);
	display.addChild(d);

	*/
}

Stereopsis.World.prototype.render3D = function(){
	console.log("render3D?")
	return;
	if(!this._camRotX){
		this._camRotX = 0;
	}
	if(!this._camRotY){
		this._camRotY = 0;
	}
	var display = GLOBALSTAGE;
	display.removeAllChildren();
	//
	var renderer = new Render3D(new V2D(600,400));
	var cam3D = renderer.addCamera();
	var renderDisplay = renderer.display();
	display.addChild(renderDisplay);
	//renderer.
	// /
	// var points = [];
	// var s = 1;
	// for(var i=0; i<100; ++i){
	// 	var p = new V3D(Math.random()*s,Math.random()*s,Math.random()*s);
	// 	points.push(p);
	// }
	// /
	var points = [];
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		if(point){
			point = point.copy();
			points.push(point);
		}
	}
	var info = V3D.infoFromArray(points);
	// console.log(info);
	var size = info["size"];
	var center = info["center"];
	// console.log(size);
	var minSize = Math.min(size.x,size.y,size.z);
	var maxSize = Math.max(size.x,size.y,size.z);
	var avgSize = (size.x+size.y+size.z)/3.0;
	var normSize = avgSize*0.05;
	var lines = [];
	var squares = [];
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var normal = point3D.normal();
		var size = point3D.size();
		// console.log(normal.length());
		if(point && normal){
			var a = point.copy();
			var b = normal.copy().scale(normSize).add(a);
			// console.log(a+" -> "+b);
			lines.push([a,b]);
			var up = point3D.up();
			var ri = V3D.cross(point3D.up(),point3D.normal());
			up = up.copy().scale(0.5*size);
			ri = ri.copy().scale(0.5*size);
			// var square = [];
			var tl = point.copy().add(up).sub(ri);
			var tr = point.copy().add(up).add(ri);
			var br = point.copy().sub(up).add(ri);
			var bl = point.copy().sub(up).sub(ri);
			// square.push(tl);
			// square.push(tr);
			// square.push(br);
			// square.push(bl);
			squares.push([tl,tr,br,bl]);
		}
	}
	// cam3D.position();
	cam3D.identity();
	cam3D.rotate(new V3D(0,1,0), this._camRotY);
	cam3D.rotate(new V3D(1,0,0), this._camRotX);
	cam3D.translate( new V3D(center.x,center.y,center.z) );
	cam3D.translate( new V3D(0,0,-maxSize*1.0) );
		// move ?
	renderer.clear();
	renderer.renderPoints(points);
	renderer.renderLines(lines);
	renderer.renderPolygons(squares);


	return;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

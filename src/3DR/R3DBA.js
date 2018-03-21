// R3DBA.js

R3D.BA = function(){
	// library to be merged into R3D
}

R3D.BA.wut = function(){
	//
}
R3D.BA._indexSort = function(a,b){
	return a < b ? -1 : 1;
}
R3D.BA._point2DToPoint = function(p2d){
	return p2d.point();
}
R3D.BA._point3DToPoint = function(p3d){
	return p3d.point();
}
R3D.BA.indexFromIDs = function(list){
	list.sort(R3D.BA._indexSort);
	var index = "";
	var div = "-";
	var len = list.length;
	var lm1 = len-1;
	for(var i=0; i<len; ++i){
		index = index + list[i];
		if(i<lm1){
			index = index + div;
		}
	}
	return index;
}
R3D.BA.indexFromViews = function(viewA,viewB){
	return R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
}
R3D.BA.fError = function(FFwd, FRev, pA, pB){
	var dir = new V2D();
	var org = new V2D();
	var a = new V3D();
	var b = new V3D();
	a.set(pA.x,pA.y,1.0);
	b.set(pB.x,pB.y,1.0);
	var lineB = FFwd.multV3DtoV3D(new V3D(), a);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	var distanceB = Code.distancePointRay2D(org,dir, b);
	var lineA = FRev.multV3DtoV3D(new V3D(), b);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	var distanceA = Code.distancePointRay2D(org,dir, a);
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
}
R3D.BA.rError = function(p3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb){
	//var predicted3D = point3D.point3DForViews(viewA,viewB);
	var projected2DA = R3D.projectPoint3DToCamera2D(p3D, cameraA, Ka, null);
	var projected2DB = R3D.projectPoint3DToCamera2D(p3D, cameraB, Kb, null);
	var distanceA = V2D.distance(pA,projected2DA);
	var distanceB = V2D.distance(pB,projected2DB);
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	this._points3D = [];
	this._pointSpace = new OctTree(R3D.BA._point3DToPoint); // use default spacing, and increase size on additions
}
R3D.BA.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.World.prototype.addCamera = function(){
	var camera = new R3D.BA.Camera();
	this._cameras.push(camera);
	return camera;
}
R3D.BA.World.prototype.addPoint3D = function(p){
	//Code.addElementUnique(this._points3D, p);
	if(p.toPointArray().length==0){
		throw "empty point3d";
	}
	this._points3D.push(p);
}
R3D.BA.World.prototype.points3D = function(){
	return this._points3D;
}
R3D.BA.World.prototype.removePoint3D = function(p){
	Code.removeElement(this._points3D, p);
}
R3D.BA.World.prototype.toViewArray = function(){
	return Code.arrayFromHash(this._views);
	// var arr = [];
	// var keys = Code.keys(this._views);
	// for(var i=0; i<keys.length; ++i){
	// 	var key = keys[i];
	// 	var view = this._views[key];
	// 	if(view){
	// 		arr.push(view);
	// 	}
	// }
	// return arr;
}
R3D.BA.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
R3D.BA.World.prototype.addView = function(){
	var viewA = new R3D.BA.View();
	// if(Code.elementExists(this._views,view)){
	// 	return false;
	// }
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var viewB = this._views[key];
		var index = R3D.BA.indexFromViews(viewA,viewB);
		this._transforms[index] = new R3D.BA.Transform(viewA,viewB);
	}
	this._views[viewA.id()+""] = viewA;
	return viewA;
}
R3D.BA.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, relativeScale,relativeAngle){
//	console.log(pointA+"->"+pointB);
	var transform = this.transformFromViews(viewA,viewB);
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	var viewsAll = this.toViewArray();
	
	var pointSpace3D = this.pointSpace();
	var sizeCompareA = viewA.pixelsCompareP2D();
	var sizeCompareB = viewB.pixelsCompareP2D();
	var sizeCompare = Math.min(sizeCompareA,sizeCompareB); // do forward then do backward ? A->B & B->A
	var imageA = viewA.image();
	var imageB = viewB.image();
	var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, relativeScale,relativeAngle, sizeCompare);
	var score = info["score"];
	var bestAngle = info["angle"];
	var bestScale = info["scale"];
		// var cornerA = null;
		// var cornerB = null;
		// var Ffwd = null;
		// var Frev = null;
		// var Ferror = null;
//	var uniqueness = R3D.BA.uniquenssForPoints(imageA,cornerA,pointA, imageB,cornerB,pointB, bestAngle,bestScale,score, sizeCompare, Ffwd, Frev, Ferror);
	//console.log("uniqueness: "+uniqueness);

	var items = this.createNewConnection(viewA,pointA, viewB,pointB, null, bestAngle,bestScale, score,null,null);
	var nextP3D = items["point3D"];
	this.insertNewPoint3D(nextP3D);
}


R3D.BA.World.prototype.consistencyCheck = function(){
	// should have no overlapping points
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
break; // this is only true with fail points
		var view = views[i];
		var space = view.pointSpace();
		var points2D = space.toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			var near = space.objectsInsideCircle(point2D.point(), 1.0);
			console.log(near);
			if(near.length>1){
				throw "intersecting points: "+near[0].point();
			}
		}
	}
	// all matches should have A & B points
	// a point with n points2d should have n matches
	var points3D = this._points3D;
	var matchCountP3D = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray(); 
		var matches = point3D.toMatchArray();
		var p = points2D.length;
		var shouldMatches = ((p+0)*(p-1)/2);
		if(matches.length!=shouldMatches){
			console.log(point3D);
			console.log(points2D);
			console.log(matches);
			console.log(shouldMatches);
			throw "match-point mismatch: "+matches.length+" / "+shouldMatches+" of "+p;
		}
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			++matchCountP3D;
			var pointA = match.pointA();
			var pointB = match.pointB();
			if(!pointA || !pointB){
				console.log(match);
				console.log(pointA);
				console.log(pointB);
				throw "a point is null";
			}
		}
	}
	var transforms = this.toTransformArray();
	var matchCountTransforms = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		matchCountTransforms += transform._matches.length;
	}
	// transform match count should equal all of points match count
	if(matchCountP3D!=matchCountTransforms){
		console.log(matchCountP3D,matchCountTransforms);
		throw "count mismatch"
	}
	
	// other?
}
R3D.BA.World.prototype.transformFromViews = function(viewA,viewB){
	if(viewA==viewB){
		return null;
	}
	var index = R3D.BA.indexFromViews(viewA,viewB);
	return this._transforms[index];
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Camera = function(K, distortion){
	this._id = R3D.BA.Camera.ID++;
	this._K = null;
	this._distortion = null;
	this.K(K);
	this.distortion(distortion);
}
R3D.BA.Camera.ID = 0;
R3D.BA.Camera.prototype.id = function(){
	return this._id;
}
R3D.BA.Camera.prototype.K = function(K){
	if(K){
		this._K = K;
	}
	return this._K;
}
R3D.BA.Camera.prototype.distortion = function(distortion){
	if(distortion){
		this._distortion = distortion;
	}
	return this._distortion;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.View = function(image, corners, camera){
	this._id = R3D.BA.View.ID++;
	this._camera = null;
	this._image = null;
	this._corners = null;
	this._pointSpace = null;
	this._absoluteTransform = null;
	// 
	// this._targetRadius = 7;
	// this._minRadius = 3;
	// this._maxRadius = 15;
	// this._minDiffNeighbor = 2;

	this._targetRadius = 5;
	this._minRadius = 2;
	this._maxRadius = 11;
	this._minDiffNeighbor = 1;
	//
	this._errorMMean = null;
	this._errorRMean = null;
	this._errorFMean = null;
	this._errorMSigma = null;
	this._errorRSigma = null;
	this._errorFSigma = null;
	// 
	this.image(image);
	this.corners(corners);
	this.camera(camera);
}
R3D.BA.View.prototype.toString = function(){
	return "[V: "+this._id+"]";
}
R3D.BA.View.ID = 0;
R3D.BA.View.prototype.id = function(){
	return this._id;
}
R3D.BA.View.prototype.mapping = function(map){
	if(map!==undefined){
		this._mapID = map;
	}
	return this._mapID;
}
R3D.BA.View.prototype.pixelsCompareP2D = function(){
	return 11;
}
R3D.BA.View.prototype.minRadius = function(){
	return 3;
}
R3D.BA.View.prototype.maxRadius = function(){
	return 13;
}
R3D.BA.View.prototype.maxAngle = function(){
	return Code.radians(60.0);
	//return Code.radians(90.0);
}

R3D.BA.View.prototype.minimumDifferenceNeighborP2D = function(){
	return this._minDiffNeighbor;
	//return 0.01;
}
R3D.BA.View.prototype.size = function(size){
	if(size){
		this._size = size;
		if(this._pointSpace){
			this._pointSpace.kill();
		}
		var min = new V2D(0,0);
		var max = size;
		this._pointSpace = new QuadTree(R3D.BA._point2DToPoint, min, max);
		this._updateInternalParams();
	}
	return this._size;
}
R3D.BA.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
	}
	return this._image;
}
R3D.BA.View.prototype.corners = function(corners){
	if(corners!==undefined){
		this._corners = corners;
	}
	return this._corners;
}
R3D.BA.View.prototype.camera = function(camera){
	if(camera){
		this._camera = camera;
		this._updateInternalParams();
	}
	return this._camera;
}
R3D.BA.View.prototype.absoluteTransform = function(matrix){
	if(matrix){
		this._absoluteTransform = matrix;
	}
	return this._absoluteTransform;
}
R3D.BA.View.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.View.prototype.K = function(){
	return this._K;
}
R3D.BA.View.prototype.Kinv = function(){
	return this._Kinv;
}
R3D.BA.View.prototype._updateInternalParams = function(){
	var size = this.size();
	var camera = this._camera;
	if(camera && size){
		var K = camera.K();
		var k = new Matrix(3,3);
		var wid = size.x;
		var hei = size.y;
		k.set(0,0, K.get(0,0)*wid ); // fx
		// TODO: WHICH IS RIGHT?
		k.set(0,1, K.get(0,1)*(hei/wid) ); // s
		//k.set(0,1, K.get(0,1)*(wid/hei) ); // s
		//k.set(0,1, 0 ); // s
		k.set(0,2, K.get(0,2)*wid ); // cx
		k.set(1,0, 0.0 ); // 0
		k.set(1,1, K.get(1,1)*hei ); // fy
		k.set(1,2, K.get(1,2)*hei ); // cy
		k.set(2,0, 0.0 );
		k.set(2,1, 0.0 );
		k.set(2,2, 1.0 );
		this._K = k;
		this._Kinv = Matrix.inverse(k);
	}else{
		this._K = null;
		this._Kinv = null;
	}
}


R3D.BA.View.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorMMean = mean;
	}
	return this._errorMMean
}
R3D.BA.View.prototype.mSigma = function(sigma){
	if(sigma!==undefined){
		this._errorMSigma = sigma;
	}
	return this._errorMSigma;
}
R3D.BA.View.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
R3D.BA.View.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
R3D.BA.View.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
R3D.BA.View.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Transform = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._Ffwd = null;
	this._Frev = null;
	this._Rfwd = null;
	this._Rrev = null;
	this._errorMMean = null;
	this._errorMSigma = null;
	this._errorFMean = null;
	this._errorFSigma = null;
	this._errorRMean = null;
	this._errorRSigma = null;
	this._matches = [];
	this.viewA(viewA);
	this.viewB(viewB);
}
R3D.BA.Transform.prototype.viewA = function(viewA){
	if(viewA){
		this._viewA = viewA;
	}
	return this._viewA;
}
R3D.BA.Transform.prototype.viewB = function(viewB){
	if(viewB){
		this._viewB = viewB;
	}
	return this._viewB;
}
R3D.BA.Transform.prototype.addMatch = function(match){
	if(match){
		//if(match.toPointArray().length==0){
			var p3D = match.point3D();
			var p2Ds = p3D.toPointArray();
		if(p2Ds.length==0){
			throw "empty match..."
		}
		this._matches.push(match);
		// Code.addUnique
		return match;
	}
	return null;
}
R3D.BA.Transform.prototype.removeMatch = function(match){
	if(match){
		return Code.removeElement(this._matches,match);
	}
	return null;
}
R3D.BA.Transform.prototype.matches = function(){
	return this._matches;
}
R3D.BA.Transform.prototype.toPointArray = function(){
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point());
		pointsB.push(pointB.point());
	}
	return {"pointsA":pointsA, "pointsB":pointsB};
}
R3D.BA.Transform.prototype.calculateErrorM = function(maximumScore){
	var clip = maximumScore!==undefined && maximumScore!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var orderedPoints = [];
	var mScores = [];
	var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var score = match.score();
		if(clip){
			include = score<maximumScore;
		}
		if(include){
			mScores.push(score);
			orderedPoints.push([score, pointA.point(), pointB.point()]);
		}
	}
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var mMean = Code.mean(mScores);
	var mSigma = Code.stdDev(mScores, mMean);
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
R3D.BA.Transform.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorMMean = mean;
	}
	return this._errorMMean
}
R3D.BA.Transform.prototype.mSigma = function(sigma){
	if(sigma!==undefined){
		this._errorMSigma = sigma;
	}
	return this._errorMSigma;
}
R3D.BA.Transform.prototype.calculateErrorF = function(F, maximumDistance){
	var recordMatch = false;
	if(F===true){
		recordMatch = true;
		F = this._Ffwd;
	}else if(F===undefined || F===null){
		F = this._Ffwd;
	}
	var FFwd = F;
	var FRev = R3D.fundamentalInverse(F);
	var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var fDistances = [];
	var orderedPoints = [];
	var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);		
		var pA = pointA.point();
		var pB = pointB.point();
		var error = R3D.BA.fError(FFwd, FRev, pA, pB);
		var distance = error["error"];
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		if(clip){
			//include = distance<maximumDistance;
			include = distanceA<maximumDistance && distanceB<maximumDistance;
		}
		if(include){
			fDistances.push(distance);
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorF(distance);
		}
	}
	orderedPoints.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var fMean = Code.mean(fDistances);
	var fSigma = Code.stdDev(fDistances, fMean);
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":fMean, "sigma":fSigma};
}
R3D.BA.Transform.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
R3D.BA.Transform.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
R3D.BA.Transform.prototype.initialEstimatePoints3D = function(){
	var viewA = this.viewA();
	var viewB = this.viewB();
	var P = this.R(viewA,viewB);
	var identity = new Matrix(4,4).identity();
	var cameraA = identity;
	var cameraB = P;
	var matches = this.matches();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);		
		var pA = pointA.point();
		var pB = pointB.point();
		var p3D = match.point3D();
		var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		p3D.point3DForViews(viewA,viewB, estimated3D);
//		console.log(p3D);
	}
}
R3D.BA.Transform.prototype.calculateErrorR = function(R, maximumDistance){
	var recordMatch = false;
	if(R===true){
		recordMatch = true;
		R = this._Rfwd;
	}else if(R===undefined||R===null){
		R = this._Rfwd;
	}
	// reproject all 3d points from OWN predicted location [relative]
	var viewA = this.viewA();
	var viewB = this.viewB();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var identity = new Matrix(4,4).identity();
	var cameraA = identity;
	var cameraB = R;

	var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	
	
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
	var orderedPoints = [];
	var rDistances = [];
	var include = true;
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point();
		var pB = pointB.point();

		var predicted3D = point3D.point3DForViews(viewA,viewB);

		var error = R3D.BA.rError(predicted3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];

		if(clip){
			include = distance<distanceA && distance<distanceB;
		}
		if(include){
			rDistances.push(distance);
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorR(distance);
		}
	}
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var rMean = Code.mean(rDistances);
	var rSigma = Code.stdDev(rDistances, rMean);
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":rMean, "sigma":rSigma};
}
R3D.BA.Transform.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
R3D.BA.Transform.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
R3D.BA.Transform.prototype.Fexists = function(viewA,viewB, F){
	return this._Ffwd != null;
}
R3D.BA.Transform.prototype.Rexists = function(viewA,viewB, F){
	return this._Rfwd != null;
}
R3D.BA.Transform.prototype.F = function(viewA,viewB, F){
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
R3D.BA.Transform.prototype.R = function(viewA,viewB, R){
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
R3D.BA.Transform.prototype.graphWeight = function(){
	return this._errorRMean;
}
R3D.BA.Transform.prototype.toString = function(){
	return "[T: "+(this._viewA?this._viewA.id():"x")+" <=> "+(this._viewB?this._viewB.id():"x")+"]";
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point2D = function(point, view, point3D){
	this._point = null;
	this._view = null;
	this._point3D = null;
	this._matches = {};
	this.point(point);
	this.view(view);
	this.point3D(point3D);
}
R3D.BA.Point2D.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point2D.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
R3D.BA.Point2D.prototype.point3D = function(point){
	if(point!==undefined){
		this._point3D = point;
	}
	return this._point3D;
}
R3D.BA.Point2D.prototype.matchForViews = function(viewA,viewB, match){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(match!==undefined){
		this._matches[index] = match;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point2D.prototype.removeMatch = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var index = R3D.BA.indexFromViews(viewA,viewB);
	var m = this._matches[index];
	if(m==match){
		delete this._matches[index];
		var keys = Code.keys(this._matches);
		if(keys.length==0){
			this.view().pointSpace().removeObject(this);
			this.point3D().removePoint2D(this);
//			this.markRemoved();
		}
		return true;
	}
	return false;
}
R3D.BA.Point2D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
R3D.BA.Point2D.prototype.averageScore = function(){
	var matches = this.toMatchArray();
	var score = 0;
	var count = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			score += match.score();
			++count;
		}
	}
	if(count==0){
		return null;
	}
	return score/count;
}
R3D.BA.Point2D.prototype.averageFError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorF();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point2D.prototype.averageRError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorR();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point2D.prototype.priority = function(){
	// TODO:
	// var scor = Math.pow(1.0+score,1.0);
	// var uniq = Math.pow(uniqueness,0.50);
	//return this.averageRError();
	return this.averageScore();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Match2D = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._transform = null;
	this._uniqueness = null;
	this.viewA(viewA);
	this.viewB(viewB);
}
R3D.BA.Match2D.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
R3D.BA.Match2D.prototype.viewB = function(viewB){
	if(viewB!==undefined){
		this._viewB = viewB;
	}
	return this._viewB;
}
R3D.BA.Match2D.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._point2DA = pointA;
	}
	return this._point2DA;
}
R3D.BA.Match2D.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._point2DB = pointB;
	}
	return this._point2DB;
}
R3D.BA.Match2D.prototype.oppositePoint = function(point2D){
	if(point2D==this._pointA){
		return this._pointB;
	}else if(point2D==this._pointB){
		return this._pointA;
	}
	return null;
}

R3D.BA.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
R3D.BA.Match2D.prototype.pointForView = function(view, point){
	if(view==this._viewA){
		if(point!==undefined){
			this._pointA = point;
		}
		return this._pointA;
	}else if(view==this._viewB){
		if(point!==undefined){
			this._pointB = point;
		}
		return this._pointB;
	}
	return null;
}
R3D.BA.Match2D.prototype.errorF = function(errorF){
	if(errorF!==undefined){
		this._errorFAB = errorF;
	}
	return this._errorFAB;
}
R3D.BA.Match2D.prototype.errorR = function(errorR){
	if(errorR!==undefined){
		this._errorRAB = errorR;
	}
	return this._errorRAB;
}
R3D.BA.Match2D.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
}
R3D.BA.Match2D.prototype.uniqueness = function(uniqueness){
	if(uniqueness!==undefined){
		this._uniqueness = uniqueness;
	}
	return this._uniqueness;
}
R3D.BA.Match2D.prototype.angleForPoint = function(point, angle){ // should this be point or view ?
	if(point==this._point2DA){
		if(angle!==undefined){
			this._angleAB = -angle;
		}
		return -this._angleAB;
	}else if(point==this._point2DB){
		if(angle!==undefined){
			this._angleAB = angle;
		}
		return this._angleAB;
	}
	return null;
}
R3D.BA.Match2D.prototype.scaleForPoint = function(point, scale){ // should this be point or view ?
	if(point==this._point2DA){
		if(scale!==undefined){
			this._scaleAB = 1.0/scale;
		}
		return 1.0/this._scaleAB;
	}else if(point==this._point2DB){
		if(scale!==undefined){
			this._scaleAB = scale;
		}
		return this._scaleAB;
	}
	return null;
}
R3D.BA.Match2D.prototype.angleForward = function(angle){
	if(angle!==undefined){
		this._angleAB = angle;
	}
	return this._angleAB;
}
R3D.BA.Match2D.prototype.scaleForward = function(scale){
	if(scale!==undefined){
		this._scaleAB = scale;
	}
	return this._scaleAB;
}
R3D.BA.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
R3D.BA.Match2D.prototype.transform = function(transform){
	if(transform!==undefined){
		this._transform = transform;
	}
	return this._transform;
}
R3D.BA.Match2D.prototype.pointForView = function(view, point){ // should this be point or view ?
	if(view==this._viewA){
		if(point!==undefined){
			this._point2DA = point;
		}
		return this._point2DA;
	}else if(view==this._viewB){
		if(point!==undefined){
			this._point2DB = point;
		}
		return this._point2DB;
	}
	return null;
}
R3D.BA.Match2D.prototype.toString = function(){
	return "[M: "+(this._viewA?this._viewA.id():"x")+" <=> "+(this._viewB?this._viewB.id():"x")+"]";
}
R3D.BA.Match2D.prototype.kill = function(){
	this._viewA = null;
	this._viewB = null;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._transform = null;
	this._uniqueness = null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point3D = function(point){
	this._point = null;
	this._points2D = {};
	this._matches = {};
	this._points3D = {}; // point in some A-B relative pair
	this.point(point);
}
R3D.BA.Point3D.prototype.markRemoved = function(world){
	// mark point as not usable again
	this.disconnect(world);
	this._point = null;
	this._points2D = null;
	this._matches = null;
	this._points3D = null;
}

R3D.BA.Point3D.prototype.point2DForView = function(view, point){
	var index = ""+view.id();
	if(point){
		this._points2D[index] = point;
	}
	var value = this._points2D[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.matchForViews = function(viewA,viewB, point){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(point){
		this._matches[index] = point;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.point3DForViews = function(viewA,viewB, point){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(point){
		this._points3D[index] = point;
	}
	var value = this._points3D[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.point = function(point){
	if(point){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point3D.prototype.toPointArray = function(){
	var arr = [];
	var keys = Code.keys(this._points2D);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var point = this._points2D[key];
		if(point){
			arr.push(point);
		}
	}
	return arr;
}
R3D.BA.Point3D.prototype.toPoint3DArray = function(){
	return Code.arrayFromHash(this._points3D);
}
R3D.BA.Point3D.prototype.toViewArray = function(){
	var points = this.toPointArray();
	var arr = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var view = point.view();
		arr.push(view);
	}
	return arr;
}
R3D.BA.Point3D.prototype.toMatchArray = function(){
	var arr = [];
	var keys = Code.keys(this._matches);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = this._matches[key];
		if(match){
			arr.push(match);
		}
	}
	return arr;
	// return Code.arrayFromHash(this._matches);
}
R3D.BA.Point3D.prototype.calculateAbsoluteLocation = function(){
	var keys = Code.keys(this._points3D);
	var components = [];
	var totalWeight = 0;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = this._matches[key];
		var point = this._points3D[key];
		if(match){
			var transform = match.transform();
// TODO: GET LOCATION BASED ON ERROR MEAN/SIGMA ADDITIONS:
// Code.combineErrorMeasurements = function(estimates,errors){
			var weight = 1.0/transform.graphWeight();
			// console.log(key+" @ "+transform.graphWeight()+" = "+point);
			components.push([weight, point, transform]);
			totalWeight += weight;
		}
	}
	if(components.length==0){
		return null;
	}
	var point = new V3D();
	for(var i=0; i<components.length; ++i){
		var component = components[i];
		var weight = component[0];
		var pnt = component[1];
		var trans = component[2];
		var percent = weight/totalWeight;
		var viewA = trans.viewA(); // TODO: is transform always calculated A[0]->B[T] ?
		var abs = viewA.absoluteTransform();
		var temp = abs.multV3DtoV3D(new V3D(), pnt);
		temp.scale(percent)
		point.add(temp);
	}
	this.point(point);
	return this.point();
}

R3D.BA.Point3D.prototype.averageScore = function(){
	var matches = this.toMatchArray();
	var score = 0;
	var count = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			score += match.score();
			++count;
		}
	}
	if(count==0){
		return null;
	}
	return score/count;
}
R3D.BA.Point3D.prototype.averageRError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorR();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point3D.prototype.averageFError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorF();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point3D.prototype.priority = function(){
	return this.averageRError();
}
R3D.BA.Point3D.prototype.removePoint2D = function(point2D, world){
	var index = point2D.view().id()+"";
	var p = this._points2D[index];
	if(p==point2D){
		delete this._points2D[index];
		return true;
	}
	return;
}
R3D.BA.Point3D.prototype.removeMatch = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var index = R3D.BA.indexFromViews(viewA,viewB);
	var m = this._matches[index];
	if(m==match){
		// console.log("REMOVING MATCHES: ",index);
		// console.log(this._matches);
		delete this._matches[index];
		delete this._points3D[index];
		// console.log(this._matches);
		// console.log(this._matches[index]);
		// console.log(this.toMatchArray());
		// throw "?";
		return true;
	}
	return false;
}
R3D.BA.Point3D.prototype.disconnect = function(world){
	if(world){
		// if(this.point()){ // only try to remove if not null
		// 	world.pointSpace().removeObject(this);
		// }
		world.removePoint3D(this);
	}
	var points2D = this.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		view.pointSpace().removeObject(point2D);
	}
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var transform = match.transform();
		transform.removeMatch(match);
	}
}
R3D.BA.Point3D.prototype.connect = function(world){
	if(world){
		world.addPoint3D(this);
	}
	if(world && this.point()){
		// world.pointSpace().insertObject(this);
	}
	var points = this.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var view = point2D.view();
		view.pointSpace().insertObject(point2D);
	}
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		transform = match.transform();
		transform.addMatch(match);
	}
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point3DFail = function(){ // projection fail
	this._point = null; // 2D
	this._errorR = null; // mean / sigma
	this._errorM = null; // mean / sigma
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// viewA,pA, viewB,pB, score,fError,rError
R3D.BA.Point2DFail = function(viewA,point,viewB,opposite, m,f,r){ // neighbor probe fail
	this._view = null; //
	this._viewOpposite = null; //
	this._point = null; // 2D
	this._pointOpposite = null;
	this._errorM = null; // mean / sigma
	this._errorF = null; // mean / sigma
	this._errorR = null; // mean / sigma
	this.view(viewA);
	this.oppositeView(viewB);
	this.point(point);
	this.oppositePoint(opposite);
	this.M(m);
	this.F(f);
	this.R(r);
}
R3D.BA.Point2DFail.prototype.kill = function(){
	this._view = null;
	this._viewOpposite = null;
	this._point = null;
	this._pointOpposite = null;
	this._errorM = null;
	this._errorF = null;
	this._errorR = null;
}
R3D.BA.Point2DFail.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
R3D.BA.Point2DFail.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point2DFail.prototype.oppositePoint = function(opposite){
	if(opposite!==undefined){
		this._pointOpposite = opposite;
	}
	return this._pointOpposite;
}
R3D.BA.Point2DFail.prototype.oppositeView = function(opposite){
	if(opposite!==undefined){
		this._viewOpposite = opposite;
	}
	return this._viewOpposite;
}
R3D.BA.Point2DFail.prototype.M = function(m){
	if(m!==undefined){
		this._errorM = m;
	}
	return this._errorM;
}
R3D.BA.Point2DFail.prototype.F = function(f){
	if(f!==undefined){
		this._errorF = f;
	}
	return this._errorF;
}
R3D.BA.Point2DFail.prototype.R = function(r){
	if(r!==undefined){
		this._errorR = r;
	}
	return this._errorR;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOGIC
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.optimumTransformForPoints = function(imageMatrixA,imageMatrixB, pointA,pointB, baseScale,baseAngle, compareSize, testScales,testAngles, searchSize){
	// testScales = (testScales!==undefined && testScales!==null) ? testScales : [-0.1,0.0,0.1]
	// testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [-10, 0, 10];
	testScales = (testScales!==undefined && testScales!==null) ? testScales : [0];
	testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [0];
	var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, compareSize,baseScale,baseAngle, testScales,testAngles, searchSize);
	return info;
}
R3D.BA.uniquenssForPoints = function(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror){
	var info = R3D.Dense.rankForTransform(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror, false);
	if(info){
		return info["uniqneness"];
	}
	return null;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World.prototype.solve = function(){
	console.log("SOLVE");

// DISPLAY SOURCE IMAGES:
var views = this.toViewArray();
for(var i=0; i<views.length; ++i){
//var viewA = views[0];
//var viewB = views[1];
	var view = views[i];
	var sca = 1.0;
	var alp = 0.1;
	//var alp = 1.0;
	var img, d;
	// var offX = view.image().width();
	image = view.image();
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(view.id() * view.size().x, 0);
	d.graphics().alpha(alp);
	GLOBALSTAGE.addChild(d);
}

// image = viewB.image();
// img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
// d = new DOImage(img);
// d.matrix().scale(sca);
// d.matrix().translate(offX, 0);
// d.graphics().alpha(alp);
// GLOBALSTAGE.addChild(d);

this._drawPatterns();
// show points

//throw "?";
	//var maxIterations = 0;
	//var maxIterations = 1;
	//var maxIterations = 2;
	//var maxIterations = 3;
	//var maxIterations = 4;
	var maxIterations = 5;
	for(var i=0; i<maxIterations; ++i){
		var isLastIteration = i == maxIterations-1;
		this._iteration(isLastIteration);
	}
}

R3D.BA.World.prototype._drawPatterns = function(){
	var views = this.toViewArray();
	var viewA = views[0];
	var viewB = views[1];
	var img, d;
	var offX = viewA.image().width();

	this._display = new DO();
	GLOBALSTAGE.addChild(this._display);
	var display = this._display;

	display.removeAllChildren();

	var x = 0;
	for(var i=0; i<views.length; ++i){
		view = views[i];
		var points = view.pointSpace().toArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var p = point.point();
			var color = 0xFF0000FF;
			if(Code.isa(point,R3D.BA.Point2DFail)){
				color = 0xFFFF0000;
//				continue;
			}else{
//				continue;
			}
			var c = new DO();
			c.graphics().setLine(1, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(p.x,p.y, 5);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(x,0);
			display.addChild(c);
		}
		x += offX;
	}
}

R3D.BA.World.prototype._iteration = function(isLastIteration){
var display = this._display;
display.removeAllChildren();
	// gerneate transforms where available & get stats
	this.generateStatsForExistingTransforms(isLastIteration);

	// cerate queues
	var priorityFxn = function(a,b){
		if(a==b){
			return 0;
		}
		return a.priority() < b.priority() ? -1 : 1;
	}
	//  TODO ------- MAY NEED TO STORE THE PRIORITY OF THE POINT WHEN IT WAS ENTERED IN CASE IT CHANGES
	var priorityQueueP3D = new PriorityQueue(priorityFxn);
	var priorityQueueP2D = new PriorityQueue(priorityFxn);
	var priorities3D = [];
	var priorities2D = [];

	// get absolute locations of cameras & 3D points
	this.absoluteCameras();
	this.absolutePoints();

	// prioritize P3Ds based on reprojection / match score
	var points3D = this.points3D();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		//console.log(point3D.priority());
		//console.log(point3D.averageScore()+" | "+point3D.averageFError()+" | "+point3D.averageRError()+"  ");
		//console.log(point3D.priority()+" ");
		priorityQueueP3D.push(point3D);
		priorities3D.push(point3D.priority());
	}
	// prioritize P2Ds based on reprojection / match score
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.pointSpace().toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}

			//console.log(point2D.averageScore()+" | "+point2D.averageFError()+" | "+point2D.averageRError()+"  ");
			//console.log(point2D.priority()+" ");
			priorityQueueP2D.push(point2D);
			priorities2D.push(point2D.priority());
		}
	}

 	// console.log(priorityQueueP3D.toArray());
 	// console.log(priorityQueueP2D.toArray());


 	var priority3DMean = Code.mean(priorities3D);
	var priority3DSigma = Code.stdDev(priorities3D, priority3DMean);
 	var priority3DMax = priority3DMean + 0.0*priority3DSigma;

// 	console.log(priority3DMean+" +/- "+priority3DSigma+" < "+priority3DMax);


	// project P3Ds into views w/o p3D
	var minimumProjectionRadius = 16*1;
	var maximumProjectionRadius = 16*4;
	console.log("P3D PRIORITY QUEUE: "+priorityQueueP3D.length());
// TESTING DISPLAY
// 19 = far out
// close: 8, 9, 13, 14, 17, 18, 25
// far: 5, 6, 7, 16, 26
// very far: 15, 22, 23, 24
// for(i=0; i<14; ++i){ // 17
// 	priorityQueueP3D.pop();
// }
var maxCountX = 100;
 	while(!priorityQueueP3D.isEmpty()){
break;
 		var point3D = priorityQueueP3D.pop();
if(maxCountX<=0){
	break;
}
--maxCountX;
 		// console.log(point3D.priority()+"/"+priority3DMax);
 		if(point3D.priority()>priority3DMax){
 			break;
 		}
 		// want to ... search each unknown view regardless of success / fail of previous
 		var triedViews = [];
		var finished = false;
		while(!finished){
			finished = true;

	 		var estimated3D = point3D.point();
	 		// console.log("estimated3D: "+estimated3D);
	 		var knownViews = point3D.toViewArray();
	 		var unprojectedViews = this.unprojectedViews(point3D);
	 		if(unprojectedViews.length==0 || knownViews.length<2){ // want at least a 2 view consensus on any final point
	 			continue;
	 		}
			// console.log("K: "+knownViews+"");
			// console.log("U: "+unprojectedViews+"");
			
	 		for(var i=0; i<unprojectedViews.length; ++i){
	 			var unknownView = unprojectedViews[i];
	 			var found = Code.elementExists(triedViews, unknownView);
	 			if(found){
	 				continue;
	 			}
	 			triedViews.push(unknownView);
	 			finished = false;

	 			var unknownFinalPoint2D = new R3D.BA.Point2D();
	 			var matches = []; // store predictions
	 			var estimated2D = [];
				var predictHasFailed = false;
	 			for(var j=0; j<knownViews.length; ++j){
	 				var knownView = knownViews[j];
	 				// a transform should exist, and have a R matrix
	 				var transform = this.transformFromViews(knownView,unknownView);
 						var transformMMean = transform.mMean();
						var transformMSigma = transform.mSigma();
						var transformFMean = transform.fMean();
						var transformFSigma = transform.fSigma();
						var transformRMean = transform.rMean();
						var transformRSigma = transform.rSigma();
					var pointR = point3D.averageRError();
	 				//console.log("project: "+knownView+"=>"+unknownView+" @ radius: "+transformRMean+" +/- "+transformRSigma+" --- point3D R: "+pointR);
	 				//console.log(transform);

	 				// get projection from assumed 3d point:
	 				var absoluteTransform = transform.R(knownView,unknownView);
	 				var distortions = null;
	 				var K = unknownView.K();
	 				var projected2D = R3D.projectPoint3DToCamera2D(estimated3D, absoluteTransform, K, distortions);
	 				// console.log("projected2D: "+projected2D);
	/*
					var p = point3D.point2DForView(knownView).point();
	console.log("FROM: "+p);
					var color = 0xFF00CC33;
					var c = new DO();
					c.graphics().setLine(2, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, 4);
					c.graphics().strokeLine();
					c.graphics().endPath();
					var color = 0xFF990033;
					c.graphics().setLine(2, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, 6);
					c.graphics().strokeLine();
					c.graphics().endPath();
					c.matrix().translate(knownView.size().x * knownView.id(), 0);
					display.addChild(c);
	// PROJECTED POINT:
					var p = projected2D;
	console.log("  TO: "+p);
					var c = new DO();
					var color = 0xFF3300CC;
					c.graphics().setLine(1, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, 5);
					c.graphics().strokeLine();
					c.graphics().endPath();
					// point
					var color = 0xFF3300CC;
					c.graphics().setLine(1, color);
					c.graphics().setLineDashes([5,10]);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, pointR);
					c.graphics().strokeLine();
					c.graphics().endPath();
					// dashed
					// c.graphics().setLineDashes(null);
					var color = 0xFF990066;
					c.graphics().setLine(1, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, transformRMean);
					c.graphics().strokeLine();
					c.graphics().endPath();
					// limit
					var color = 0xFFFF6699;
					c.graphics().setLine(1, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(p.x,p.y, maximumProjectionRadius);
					c.graphics().strokeLine();
					c.graphics().endPath();
					//
					c.matrix().translate(unknownView.size().x * unknownView.id(), 0);
					display.addChild(c);
*/

					var viewA = knownView;
					var viewB = unknownView;
					var imageA = viewA.image();
					var imageB = viewB.image();
					var cornerA = viewA.corners();
					var cornerB = viewB.corners();
					var viewSize = viewB.size(); // TODO: some border too?
					var sizeCompare = viewB.pixelsCompareP2D();
					//sizeCompare = 21;
					//sizeCompare = sizeCompare*2;
					//sizeCompare = sizeCompare*0.5;
					//sizeCompare = 5;
//					console.log("sizeCompare: "+sizeCompare);
					var pointA2D = point3D.point2DForView(viewA);
					var pointA = pointA2D.point();
					var pointB = projected2D;
					if(0<pointB.x && pointB.x<viewSize.x && 0<pointB.y && pointB.y<viewSize.y){
//						console.log("inside image");
						var sizeSearch = Math.min(maximumProjectionRadius, transformRMean)*2;
						sizeSearch = Math.round(sizeSearch);
						// sizeSearch = 150;
						// sizeSearch = null;
//						console.log("sizeSearch: "+sizeSearch);
						// get neighborhood to predict size
						var neighborsA = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB);
						if(!neighborsA){
							console.log("not enough neighbors .... exit");
							predictHasFailed = true;
							break;
						}
						var predicted = R3D.BA.interpolationData(pointA, neighborsA,  viewA,viewB);
						//console.log(predicted);
						var toPoint = predicted["point"];
						// show fav:
						var c = new DO();
						var p = toPoint;
						var color = 0x990000FF;
						c.graphics().setLine(2, color);
						c.graphics().beginPath();
						c.graphics().drawCircle(p.x,p.y, 3);
						c.graphics().strokeLine();
						c.graphics().endPath();
						c.matrix().translate(unknownView.size().x * unknownView.id(), 0);
						display.addChild(c);
						// 
						var scaAB = predicted["scale"]; // 1.0;
						var angAB = predicted["angle"]; // Code.radians(-10);
						var angles = [];
						// var seedTestAngles = Code.lineSpace(-45,45, 15);
						// var seedTestScales = Code.lineSpace(-.2,.2, .1);
						var seedTestAngles = Code.lineSpace(-15,15, 15);
						var seedTestScales = Code.lineSpace(-.1,.1, .1);
						// seedTestAngles = [0];
						// seedTestScales = [0];
						// seedTestAngles = Code.lineSpace(-45,45, 15);
						// seedTestScales = Code.lineSpace(-.1,.1, .1);
						// console.log("sizeSearch: "+sizeSearch);
						var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaAB,angAB, sizeCompare, seedTestScales,seedTestAngles, sizeSearch);
						var pA = info["from"];
						var pB = info["to"];
						var score = info["score"];
						var angle = info["angle"];
						var scale = info["scale"];

						if(!(0<pB.x && pB.x<viewSize.x && 0<pB.y && pB.y<viewSize.y)){
//							console.log("best prediction outside image window");
							predictHasFailed = true;
							break;
						}
	//					var uniqueness = R3D.BA.uniquenssForPoints(imageA,cornerA,pointA, imageB,cornerB,pointB, scale,angle,score, sizeCompare);//, Ffwd, Frev, Ferror);
						var uniqueness = -1;
	//console.log("COMPARE SCORE: "+j+" = "+score+" : UNIQUENESS: "+uniqueness);
	//var matchAB = point3D.matchForViews(viewA,viewB);
	//console.log("  existing - "+point3D.averageScore());
/*
						// show fav:
						var c = new DO();
						var p = pB.copy();
						var color = 0x99FF0000;
						c.graphics().setLine(2, color);
						c.graphics().beginPath();
						c.graphics().drawCircle(p.x,p.y, 3);
						c.graphics().strokeLine();
						c.graphics().endPath();
						c.matrix().translate(unknownView.size().x * unknownView.id(), 0);
						display.addChild(c);
*/

						estimated2D.push(pB);

						var match = new R3D.BA.Match2D();
						match.viewA(viewA);
						match.viewB(viewB);
						match.pointA(pointA2D);
						match.pointB(unknownFinalPoint2D);
						match.angleForward(angle);
						match.scaleForward(scale);
						match.score(score);
						matches.push(match);
					}
	 			} // knownViews
	 			// projection did not fail interpolation
	 			if(!predictHasFailed){
	 				//var maxScoreRatio = 2.0; // more than this gets risky
	 				var maxScoreRatio = 1.5;
	 				var currentAverageScore = point3D.averageScore();
					var maxDistanceNeighbor = unknownView.minimumDifferenceNeighborP2D();
					meanPoint = new V2D();
					for(var i=0; i<estimated2D.length; ++i){
						var p = estimated2D[i];
//						console.log("INCLUDE POINT: "+p);
						meanPoint.add(p);
					}
					meanPoint.scale(1.0/estimated2D.length);
//					console.log(meanPoint+" == meanPoint");
					// check location 
					var size = unknownView.size();
					if(!(0<meanPoint.x && meanPoint.x<size.x && 0<meanPoint.y && meanPoint.y<size.y)){ // this should be picked out beforehand
//						console.log("OUTSIDE WINDOW");
						predictHasFailed = true;
					}
					// check distances
					for(var i=0; i<estimated2D.length; ++i){
						var p = estimated2D[i];
//						console.log(p);
						var d = V2D.distance(p,meanPoint);
//						console.log(" distance: "+d);
						if(d>maxDistanceNeighbor){
//							console.log("too far: "+d+" / "+maxDistanceNeighbor);
							predictHasFailed = true;
							//break;
						}
					}
					// check scores
					for(var i=0; i<matches.length; ++i){
						var match = matches[i];
						var scoreRatio = match.score()/currentAverageScore;
//						console.log(match.score()+"/"+currentAverageScore+" = "+scoreRatio);
						if(scoreRatio>maxScoreRatio){
//							console.log("too big");
							predictHasFailed = true;
							//break;
						}
					}
					// prijection did not fail score || distance
					if(!predictHasFailed){
						console.log("passed projection => MERGE");
						
						unknownFinalPoint2D.point(meanPoint);
						unknownFinalPoint2D.view(unknownView);
						unknownFinalPoint2D.point3D(point3D);
						// combine 

						point3D.disconnect(this);
						this.connectMatchesToPoint3D(point3D,matches);
						this.insertNewPoint3D(point3D);
						 //var errorR = view.errorR
			 			// A:
			 			// project 3D absolute point into camera
			 			// need to search around error radius ... ?
			 			// interpolate from viewA-B 2d neighbors ?
			 			// 	or more exhaustive ?

			 			// ESTIMATE S,A,P? based on P3D's view points
			 			//  , OR BASED ON nearest neighbors in area
			 			//   , AND OR averaging these ^ 
			 			// get best point matches @ interpolated location
			 			// point should be inside image
			 			// if all best points are within ~2 pixels of median

					}else{
						//console.log("failed predict");
					}

				}else{
					//console.log("failed predict");
				}
				//break; // skip other unknown views
	 		} // potential unknown views
			// break; // don't try subsequent unknown projections
		} // while ! done
		// break; // don't try any other 3d point projections
 	} // priorityQueueP3D
// console.log("DONE PROJECTION .......");
// return;

 	//console.log(priorities2D);
 	var priority2DMean = Code.mean(priorities2D);
	var priority2DSigma = Code.stdDev(priorities2D, priority2DMean);
 	var priority2DMax = priority2DMean + 1.0*priority2DSigma;
	// 	console.log(priority2DMean+" +/- "+priority2DSigma+" < "+priority2DMax);
	
	// probe P2Ds around neighbors w/ space
	console.log("P2D PRIORITY QUEUE: "+priorityQueueP2D.length());
	while(!priorityQueueP2D.isEmpty()){
 		var p2D = priorityQueueP2D.pop();

		//console.log(p2D.priority()+"");
 		if(p2D.priority()>priority2DMax){
 			break;
 		}


 		// WHAT TO DO IF POINT IS COMBINED IN THIS PROCESS


 		var matches = p2D.toMatchArray();
// 		console.log(matches.length);
 		for(var i=0; i<matches.length; ++i){
//console.log("MATCH: "+i+" / "+matches.length);
 			var match = matches[i];
 			var transform = match.transform();
 			var viewA = match.viewA();
 			var viewB = match.viewB();
 			var pointA = match.pointA();
 			var pointB = match.pointB();
 			var found = true;
 			// A look for best point in B & reverse
 			var loopCount = 25;
 			var previousPoint = null;
 			while(found){
 				found = false;
 				var forceFail = false;
//console.log("found: "+loopCount);
 				--loopCount;
 				if(loopCount==0){
 					this._drawPatterns();
console.log("too much - break");
priorityQueueP2D.clear();
break;
 					throw "too much";
 				}
// TODO: POINT NEIGHBORS NEED TO CHECK FOR viewA-viewB matching --- scales / angles for different views wont make sense
	 			var bestMatchA = this.bestNextMatchForPoint(viewA,pointA, viewB);
	 			if(bestMatchA){
//console.log(loopCount+" A "+bestMatchA.from+" => "+bestMatchA.to+".    @ "+viewA.id()+" & "+viewB.id());
	 				found = true;
	 				var from = bestMatchA["from"];
	 				if(previousPoint && V2D.distance(previousPoint,from)<1E-8){
	 					forceFail = true;
	 				}
	 				previousPoint = from.copy();
	 				this.addPointForMatch(bestMatchA, viewA,viewB,transform, forceFail);
	 				continue;
	 			}
	 			var bestMatchB = this.bestNextMatchForPoint(viewB,pointB, viewA);
	 			if(bestMatchB){
//console.log(loopCount+" B "+bestMatchB.from+" => "+bestMatchB.to+".    @ "+viewA.id()+" & "+viewB.id());
	 				found = true;
	 				var from = bestMatchB["from"];
	 				if(previousPoint && V2D.distance(previousPoint,from)<1E-8){
	 					forceFail = true;
	 				}
	 				previousPoint = from.copy();
	 				this.addPointForMatch(bestMatchB, viewB,viewA,transform, forceFail);
	 				continue;
	 			}
	 		}
 		}
 	}

 	// blind search:
 	// ... TBD

	//this._drawPatterns();

	// generate stats again with new points
	this.generateStatsForExistingTransforms(isLastIteration);
	
	// remove points in negative direction ?
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// remove points with any projections behind camera
		var p3Ds = point3D.toPoint3DArray();
		for(var j=0; j<p3Ds.length; ++j){
			var p3D = p3Ds[j];
			if(p3D.z<=0){
				// console.log("drop bad P3d negative: "+p3D);
				point3D.disconnect(this);
				--i;
				break;
			}
		}
	}
	
	// remove poor matches --- similar to dropping P3D, but more complicated
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var transformMMean = transform.mMean();
		var transformMSigma = transform.mSigma();
		var transformFMean = transform.fMean();
		var transformFSigma = transform.fSigma();
		var transformRMean = transform.rMean();
		var transformRSigma = transform.rSigma();
		var matches = transform.matches();
		var maxM = transformMMean + 2.0 * transformMSigma;
		var maxF = transformFMean + 2.0 * transformFSigma;
		var maxR = transformRMean + 2.0 * transformRSigma;
		//console.log("MATCHES BEFORE: "+matches.length);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var matchM = match.score();
			var matchF = match.errorF();
			var matchR = match.errorR();
			if(matchM>maxM || matchF>maxF || matchR>maxR){ // remove match
				//TODO: REMOVE MATCH FROM P3D
				// ALL POINTS CONNECTED TO MATCH NEED TO BE REMOVED & THEIR MATCHES
				/*
				var point3D = match.point3D();
				if(point3D.toMatchArray().length<=2){
					point3D.disconnect(this);
				}else{
					transform.removeMatch(match);
					point3D.removeMatch(match);
					match.pointA().removeMatch(match);
					match.pointB().removeMatch(match);
					match.kill()
				}
				// TODO: REPLACE MATCH WITH 2 FAILs ?
				--j;
				*/
			}
		}
		//console.log("MATCHES AFTER: "+matches.length);
	}

//	this.consistencyCheck();

	// reset 2D fail points for each view
	var views = this.toViewArray();
	var dropCount = 0;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space = view.pointSpace();
		var points = space.toArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			if(Code.isa(point, R3D.BA.Point2DFail)){
				var m = point.M();
				var f = point.F();
				var r = point.R();
				var viewA = point.view();
				var viewB = point.oppositeView();
				var transform = this.transformFromViews(viewA,viewB);
				var transformMMean = transform.mMean();
				var transformMSigma = transform.mSigma();
				var transformFMean = transform.fMean();
				var transformFSigma = transform.fSigma();
				var transformRMean = transform.rMean();
				var transformRSigma = transform.rSigma();
				var matches = transform.matches();
				// var maxM = transformMMean + 0.0 * transformMSigma;
				// var maxF = transformFMean + 0.0 * transformFSigma;
				// var maxR = transformRMean + 0.0 * transformRSigma;
				var maxM = transformMMean - 0.5 * transformMSigma;
				var maxF = transformFMean - 0.5 * transformFSigma;
				var maxR = transformRMean - 0.5 * transformRSigma;
				if(m<maxM && f<maxF && r<maxR){
					space.removeObject(point);
					point.kill();
				}
			}
		}
	}

	// reset P3D fails
		// TODO

	// remove poor P2D from point3Ds
	this.removePoorP2D();

	// remove poor P3D
	this.removePoorP3D();

	// reset transforms with low points
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var pointCount = matches.length;
		if(pointCount<10){
			throw "reset transform: "+pointCount;
		}
	}
	/*
		- REFRESH FAILS
		- if a pair has fewer than ~10 points for F, then transform should be reset to 0 / nil / invalid
		- for each p3D
			- if any failed R or F error has changed [~ half of failed's recorded value] => reset to null to allow new reprojection attempt
		- for each view:
			- for each P2D-Fail
				- if any F error has changed [~ half of failed's recorded value] => remove from view point space [to allow new neighbor attempt]

	
	*/


	// if a transform doesn't have good enough points for P,




	// update stats again -- only necessary if this is last iteration
	if(isLastIteration){
		console.log("isLastIteration");
		this.generateStatsForExistingTransforms(isLastIteration);
		this.absolutePoints();
	}

}
R3D.BA.World.prototype.removePoorP3D = function(){
	var errorM = [];
	var errorF = [];
	var errorR = [];
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var m = point3D.averageScore();
		var f = point3D.averageFError();
		var r = point3D.averageRError();
		errorM.push(m);
		errorF.push(f);
		errorR.push(r);
	}
	var mMean = Code.mean(errorM);
	var mSigma = Code.stdDev(errorM, mMean);
	var fMean = Code.mean(errorF);
	var fSigma = Code.stdDev(errorF, fMean);
	var rMean = Code.mean(errorR);
	var rSigma = Code.stdDev(errorR, rMean);

	var errorMMean = mMean;
	var errorMSigma = mSigma;
	var errorFMean = fMean;
	var errorFSigma = fSigma;
	var errorRMean = rMean;
	var errorRSigma = rSigma;

	var maxM = errorMMean + 4.0 * errorMSigma;
	var maxF = errorFMean + 4.0 * errorFSigma;
	var maxR = errorRMean + 4.0 * errorRSigma;

	var dropCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var m = point3D.averageScore();
		var f = point3D.averageFError();
		var r = point3D.averageRError();
		if(m>maxM || f>maxF || r>maxR){
			++dropCount;
			point3D.disconnect(this);
		}
	}
	console.log( "     dropped 3D: "+dropCount);
}
R3D.BA.World.prototype.removePoorP2D = function(){
	var dropCount = 0;
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var errorMMean = view.mMean();
		var errorMSigma = view.mSigma();
		var errorFMean = view.fMean();
		var errorFSigma = view.fSigma();
		var errorRMean = view.rMean();
		var errorRSigma = view.rSigma();
		var maxM = errorMMean + 4.0 * errorMSigma;
		var maxF = errorFMean + 4.0 * errorFSigma;
		var maxR = errorRMean + 4.0 * errorRSigma;
		var space = view.pointSpace();
		var points2D = space.toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			if(!point2D.point()){ // may now be dead
				continue;
			}
			var m = point2D.averageScore();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			//console.log(m+" / "+maxM+" | "+f+" / "+maxF+" | "+r+" / "+maxR+" | ");
			if(m>maxM || f>maxF || r>maxR){
				//console.log( "     drop: " );
				++dropCount;
				this.removeP2D(point2D);
			}
		}
		console.log( "     dropped 2d: "+dropCount);
		
	}
}

R3D.BA.World.prototype.generateStatsForExistingTransforms = function(isLastIteration){ // CREATE F & P MATRIX WHERE POSSIBLE
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
//console.log(" in transform : "+transform.viewA().id()+"-"+transform.viewB().id()+" = ");
		var matches = transform.matches();
		var info, pointsA, pointsB;
		// have enough matches to warrant a test
		console.log("matches: "+matches.length);
		if(matches.length>=minimumTransformMatchCountF){
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var Ka = viewA.K();
			var Kb = viewB.K();
			var Pfinal = null;
			var Ffinal = null;
			var Fdefault = transform.F(viewA,viewB); // reuse if possible
//Fdefault = null;
			info = transform.toPointArray();
			pointsA = info["pointsA"];
			pointsB = info["pointsB"];
//			console.log("POINT COUNT: "+pointsA.length+" / "+pointsB.length);
			if(Fdefault){ // refine with new points:
				Fdefault = R3D.fundamentalMatrixNonlinear(Fdefault, pointsA, pointsB);
			}else{
				Fdefault = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
				
			}

			// get all best points that fall inside F error range -- reduce until a P can be found
			info = transform.calculateErrorF(Fdefault);
			pointsA = info["pointsA"];
			pointsB = info["pointsB"];
			var errorMean = info["mean"];
			var errorSigma = info["sigma"];
			var F = Fdefault;
			Ffinal = F;
			var retryCount = 0;
			for(var j=pointsA.length; j>minimumTransformMatchCountF; --j){
//console.log(j+" ... ");
				if(pointsA.length>minimumTransformMatchCountR){
					var force = retryCount>1;
					P = R3D.transformFromFundamental(pointsA, pointsB, F, Ka, Kb, null, force);
					if(P){
//							console.log("calculated P: "+P+"\n @ "+j);
// if(isLastIteration){
// 							P = R3D.cameraExtrinsicMatrixFromInitial(pointsA, pointsB, P, F, Ka, Kb); // this pushes the points very far away to minimize reproj error
// }

						Pfinal = P;
						break;
					}
				}
				pointsA.pop();
				pointsB.pop();
				if(pointsA.length>minimumTransformMatchCountF){
					F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
					Ffinal = F;
				}
				++retryCount;
			}
			// now to actually get errors
			var info;
			info = transform.calculateErrorM();
			transform.mMean(info["mean"]);
			transform.mSigma(info["sigma"]);
			if(Ffinal){
				transform.F(viewA,viewB,Ffinal);
				info = transform.calculateErrorF(true);
				transform.fMean(info["mean"]);
				transform.fSigma(info["sigma"]);
			}
			if(Pfinal){
//console.log("transform : "+viewA.id()+"-"+viewB.id()+" = \n"+Pfinal);
				transform.R(viewA,viewB,Pfinal);
				transform.initialEstimatePoints3D();
				info = transform.calculateErrorR(true);
				transform.rMean(info["mean"]);
				transform.rSigma(info["sigma"]);
			}
		}
		console.log(" T M : "+transform.mMean()+" +/- "+transform.mSigma());
		console.log(" T F : "+transform.fMean()+" +/- "+transform.fSigma());
		console.log(" T R : "+transform.rMean()+" +/- "+transform.rSigma());
	}
	// set error for each view
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pointSpace = view.pointSpace();
		var points2D = pointSpace.toArray();
		var errorM = [];
		var errorF = [];
		var errorR = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			var m = point2D.averageScore();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			errorM.push(m);
			errorF.push(f);
			errorR.push(r);
		}
		var mMean = Code.mean(errorM);
		var mSigma = Code.stdDev(errorM, mMean);
		var fMean = Code.mean(errorF);
		var fSigma = Code.stdDev(errorF, fMean);
		var rMean = Code.mean(errorR);
		var rSigma = Code.stdDev(errorR, rMean);
		view.mMean(mMean);
		view.mSigma(mSigma);
		view.fMean(fMean);
		view.fSigma(fSigma);
		view.rMean(rMean);
		view.rSigma(rSigma);
		// console.log(" V M : "+view.mMean()+" +/- "+view.mSigma());
		// console.log(" V F : "+view.fMean()+" +/- "+view.fSigma());
		// console.log(" V R : "+view.rMean()+" +/- "+view.rSigma());
	}
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+");
}

R3D.BA.World.prototype.insertNewPoint3D = function(point3D, count){ // adds point to lists, or merges/splits as necessary
	count = count!==undefined ? count : 0;
	++count;
	if(count>10){
		throw "recursion problem";
	}
	// point should not be connected yet
	// look for any intersections of 2d points
	var points2D = point3D.toPointArray();
	var intersection = null;
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var point = point2D.point();
		var view = point2D.view();
		var searchRadius = view.minimumDifferenceNeighborP2D();
		var pointSpace = view.pointSpace();
		var neighbors = pointSpace.objectsInsideCircle(point, searchRadius);
		// only care about neighbors who are connected points
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			if(!Code.isa(neighbor,R3D.BA.Point2DFail)){
				intersection = neighbor.point3D();
//				console.log("found collision: "+point+" -> "+neighbor.point()+".  view: "+view.id()+" min dist: "+searchRadius);//, neighbor);
				break;
			}
		}
		if(intersection){
			break;
		}
	}
	if(intersection){
//		console.log("FOUND INTERSECTION "+count+" "+intersection.toMatchArray());
		point3D.disconnect(this);
		intersection.disconnect(this);
		//console.log(intersection.point());
		var points = this.mergeOrSplitPoints(point3D,intersection);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			this.insertNewPoint3D(point, count+1);
		}
	}else{
		point3D.connect(this);
	}
}

R3D.BA.World.prototype.mergeOrSplitPoints = function(point3DA, point3DB){ // all extension points should already be attached
// TODO: MARK OLD POINTS AS DEFECT -> P2D & P3D
	//console.log("mergeOrSplitPoints: "+point3DA.point()+" & "+point3DB.point());
	// console.log(point3DA);
	// console.log(point3DB);
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
//	console.log("mergeOrSplitPoints: "+viewsA+" & "+viewsB);
	// console.log(viewsA+"");
	// console.log(viewsB+"");

	// check that points do have overlapping scenario
	var sharedViews = [];
	var separateViews = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		for(var j=0; j<viewsB.length; ++j){
			var viewB = viewsB[j];
			if(viewA==viewB){
				sharedViews.push(viewA);
				break;
			}
		}
	}
	if(sharedViews.length==viewsA.length && sharedViews.length==viewsB.length){
//		console.log("all views in common");
			//throw "what to do about overlapping match point views --- need a dead point eventually somehow ?"
		var scoreA = point3DA.averageScore();
		var scoreB = point3DB.averageScore();
		if(scoreA<scoreB){
			point3DB.markRemoved(this);
			return [point3DA];
		}
		point3DA.markRemoved(this);
		return [point3DB];
		
	}
	if(sharedViews.length==0){
		throw "no views in common";
		return null;
	}
	// check that views can be merged
	var mergeable = true;
	var mergeLocations = [];
	for(var i=0; i<sharedViews.length; ++i){
		var sharedView = sharedViews[i];
		var minDistance = sharedView.minimumDifferenceNeighborP2D();
		var point2DA = point3DA.point2DForView(sharedView);
		var point2DB = point3DA.point2DForView(sharedView);
		var pointA = point2DA.point();
		var pointB = point2DB.point();
		var distance = V2D.distance(pointA,pointB);
		if(distance>minDistance){
			mergeable = false;
			console.log(sharedView+": "+distance);
			break;
		}
	}

	// use better score as base to merge into:		
	var scoreA = point3DA.averageScore();
	var scoreB = point3DB.averageScore();
	var p3DA = null;
	var p3DB = null;

	// merging object
	var resultViews = [];
	var resultPoints = [];
	var resultMatches = [];

	if(scoreA<=scoreB){
		p3DA = point3DA;
		p3DB = point3DB;
	}else{
		p3DA = point3DB;
		p3DB = point3DA;
	}


	if(!mergeable){
		throw "cannot merge points";
		// TODO:
		// keep better score point = P3DA
		// remove shared view points from P3DB
		var list = [P3DA];
		// if P3DB still contains at least 2 P2D, include:
			list.push(P3DB);
		return list;
	}

	// attempt merging
	var allViews = this.unionViewsFromPoints3D(p3DA,p3DB);
//	console.log("union: "+viewsA+" | "+viewsB+" = "+allViews);

	var searchGroups = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var p2DA = p3DA.point2DForView(view);
		var p2DB = p3DB.point2DForView(view);
		var point = null;
		if(p2DA && p2DB){ // shared
			// set search for a's match around midpoint of a+b location
			// point = V2D.midpoint( p2DA.point(),p3D.point() );
		}else if(p2DB){ // B only
			point = p2DB.point();
		}else if(p2DA){ // A only
			// N/A
		}else{
			throw "?";
		}
		if(point){
			searchGroups.push([view,point]);
		}
	}
	// get best matchings at points:
	var viewsA = p3DA.toViewArray();
	var viewsB = p3DB.toViewArray();

//	console.log("searchGroups: "+searchGroups.length);
	if(searchGroups.length==0){
		for(var i=0; i<allViews.length; ++i){
			var view = allViews[i];
			var p2DA = p3DA.point2DForView(view);
			var p2DB = p3DB.point2DForView(view);
			p2DA = p2DA ? p2DA.point() : null;
			p2DB = p2DB ? p2DB.point() : null;
//			console.log(view+" : "+p2DA+" & "+p2DB);
		}
//		console.log("return fuller view");
		if(viewsA.length>viewsB.length){ // ALWAYS? opt for view with better count?
			p3DB.markRemoved(this);
			return [p3DA];
		}else if(viewsB.length>viewsA.length){
			p3DA.markRemoved(this);
			return [p3DB];
		}
		p3DB.markRemoved(this);
		return [p3DA]; // better score
	}
	

	var matches = [];
	// copy over previous matches for A
	var viewPointTable = {}; // single point for single view
	var matchesA = p3DA.toMatchArray();
	for(var i=0; i<matchesA.length; ++i){
		var matchA = matchesA[i];
		// console.log(p3DA);
		// console.log(matchA);
		var pA = matchA.pointA();
		var pB = matchA.pointB();
		var vA = matchA.viewA();
		var vB = matchA.viewB();
		var indexA = ""+vA.id();
		var indexB = ""+vB.id();
		if(!viewPointTable[indexA]){
			viewPointTable[indexA] = new R3D.BA.Point2D(pA.point().copy(), vA);
		}
		if(!viewPointTable[indexB]){
			viewPointTable[indexB] = new R3D.BA.Point2D(pB.point().copy(), vB);
		}
		match = new R3D.BA.Match2D();
		match.viewA(vA);
		match.viewB(vB);
		match.pointA(viewPointTable[indexA]);
		match.pointB(viewPointTable[indexB]);
		match.angleForward(matchA.angleForward());
		match.scaleForward(matchA.scaleForward());
		match.score(matchA.score());
		matches.push(match);
	}
	// console.log(viewPointTable)
	// console.log(matches+"")
	// point locations are determined after-the-fact 
	var replaceViewTable = {};
	for(var i=0; i<searchGroups.length; ++i){ // all viewB points that are not shared
		var group = searchGroups[i];
		var viewB = group[0];
		var pointB = group[1];
		for(var j=0; j<viewsA.length; ++j){
			var viewA = viewsA[j];
			if(viewB!=viewA){
				var imageA = viewA.image();
				var imageB = viewB.image();
				var pointA = p3DA.point2DForView(viewA).point();
				// find relative transform for shared views
				var relativeScales = [];
				var relativeAngles = [];
				for(var k=0; k<sharedViews.length; ++k){
					var sharedView = sharedViews[k];
					var angA = 0.0;
					var scaA = 1.0;
					if(viewA!=sharedView){ // A->SHARED
						var matchA = p3DA.matchForViews(viewA,sharedView);
						var pntA = p3DA.point2DForView(sharedView);
						angA = matchA.angleForPoint(pntA);
						scaA = matchA.scaleForPoint(pntA);
					} // SHARED->B
// console.log(p3DA);
// console.log(p3DB);
// console.log(viewA.id());
// console.log(viewB.id());
// console.log(sharedView.id());
// console.log("SEARCH: "+searchGroups);
// console.log("sharedView: "+sharedView);
// console.log("viewsA: "+viewsA);
// console.log(" WANT : "+viewB+" & "+sharedView);
// console.log(p3DA.matchForViews(viewB,sharedView))
					var matchB = p3DB.matchForViews(viewB,sharedView);
// console.log(matchB);
					var pntB = p3DB.point2DForView(viewB);
// console.log(pntB);
					var angB = matchB.angleForPoint(pntB);
					var scaB = matchB.scaleForPoint(pntB);
//console.log(scaA,scaB)
					var netAng = Code.angleZeroTwoPi(angA+angB);
					var netSca = scaA*scaB;
					relativeScales.push(netSca);
					relativeAngles.push(netAng);
				}
//console.log(relativeScales+" | "+relativeAngles);
				var scaAB = Code.averageNumbers(relativeScales);
				var angAB = Code.averageAngles(relativeAngles);
				var sizeCompare = viewB.pixelsCompareP2D();
//console.log(pointA,pointB,scaAB,angAB,sizeCompare);
				// TODO: CAN ALSO SEARCH NEIGHBORS IF ENOUGH EXIST pointSpaceA.kNN( --- also possibly average the findings
				var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaAB,angAB, sizeCompare);
				var pA = info["from"];
				var pB = info["to"];
				var score = info["score"];
				var angle = info["angle"];
				var scale = info["scale"];
// console.log(info);
// console.log("=> "+pB+" @ "+score);
				// points are stored in table
				var indexB = viewB.id()+"";
				if(!replaceViewTable[indexB]){
					replaceViewTable[indexB] = [];
				}
				replaceViewTable[indexB].push(pB);
				if(!viewPointTable[indexB]){
					//viewPointTable[indexB] = new R3D.BA.Point2D(null, vB);
					viewPointTable[indexB] = new R3D.BA.Point2D(null, viewB);
				}
				var viewPointB = viewPointTable[indexB];
				var indexA = viewA.id()+"";
				var viewPointA = viewPointTable[indexA];
// console.log(" NEW A: "+viewPointA);
// console.log(" NEW B: "+viewPointB);
				var match = new R3D.BA.Match2D();
					match.viewA(viewA);
					match.viewB(viewB);
					match.pointA(viewPointA);
					match.pointB(viewPointB);
					match.score(score);
					match.angleForPoint(viewPointB,angle);
					match.scaleForPoint(viewPointB,scale);
				matches.push(match);
			}
		}
	}

	// replace points with average center
	// console.log(replaceViewTable);
	var keys = Code.keys(replaceViewTable);
	var pointTooFar = false;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var val = replaceViewTable[key];
		// console.log(val);
		var point = new V2D();
		for(var j=0; j<val.length; ++j){
			var p = val[j];
			point.add(p);
		}
		point.scale(1.0/val.length);
		// set new point
		var point2D = viewPointTable[key];
//		console.log(point2D);
		point2D.point(point);
		// see what errors are
		var maxDistance = point2D.view().minimumDifferenceNeighborP2D();
		for(var j=0; j<val.length; ++j){
			var p = val[j];
			var distance = V2D.distance(point,p);
//			console.log("distance: "+j+" = "+distance+" / "+maxDistance);
			if(distance>maxDistance){
				pointTooFar = true;
			}
		}
	}
//	console.log(matches+" ... ");

	if(pointTooFar){
		// TODO:
		// make a copy of A
		// make a copy of B, without any of the shared A views
		// HACK:
//		console.log("split");
		p3DB.markRemoved(this);
		return [p3DA];
		throw "not matchable";
	}
	
	var info = this.createNewConnectionFromMatches(matches);
	var point3D = info["point3D"];
	//console.log(point3D);
//	console.log("merge");
	p3DA.markRemoved(this);
	p3DB.markRemoved(this);
	return [point3D];
}
R3D.BA.World.prototype.unionViewsFromPoints3D = function(point3DA, point3DB){ // get single array with all views, no dups
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	return Code.arrayUnion(viewsA,viewsB);
}

R3D.BA.World.prototype.addPointForMatch = function(bestMatchA, viewA, viewB, transform, forceFail){
	forceFail = forceFail!==undefined ? forceFail : false;
	var pA = bestMatchA["from"];
	var pB = bestMatchA["to"];
	// M
	var score = bestMatchA["score"];
	// F
	var Ffwd = transform.F(viewA,viewB);
	var Frev = transform.F(viewB,viewA);
	var info = R3D.BA.fError(Ffwd, Frev, pA, pB);
	var fError = info["error"];
	// R
	var cameraA = transform.R(viewA,viewB);
	var cameraB = transform.R(viewB,viewA);
	var Ka = viewA.K();
	var Kb = viewB.K();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
	var info = R3D.BA.rError(estimated3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb);
	var rError = info["error"];
	// find current normal metrics
	var meanS = transform.mMean();
	var meanF = transform.fMean();
	var meanR = transform.rMean();
	var sigmaS = transform.mSigma();
	var sigmaF = transform.fSigma();
	var sigmaR = transform.rSigma();
	// limits
	// var maxS = meanS + 1.0*sigmaS;
	// var maxF = meanF + 1.0*sigmaF;
	// var maxR = meanR + 1.0*sigmaR;
	var maxS = meanS + 0.0*sigmaS;
	var maxF = meanF + 0.0*sigmaF;
	var maxR = meanR + 0.0*sigmaR;
	// check that errors are all acceptable
	var pointSpaceA = viewA.pointSpace();
	var pointSpaceB = viewB.pointSpace();
	if(score < maxS && fError < maxF && rError < maxR && !forceFail){
	// if( (score < maxS || fError < maxF || rError < maxR) && !forceFail){

// TODO: RESULT POINT ALSO CAN'T BE TOO CLOSE TO A MATCHED (NON-FAIL) POINT of same view origin
		var bestAngle = bestMatchA["angle"];
		var bestScale = bestMatchA["scale"];

var items = this.createNewConnection(viewA,pA, viewB,pB, estimated3D, bestAngle,bestScale, score,fError,rError);
var nextP3D = items["point3D"];
this.insertNewPoint3D(nextP3D);
/*
throw "check TO-view around point";


// THIS CALLS: this.mergeOrSplitPoints();






	
//		console.log("keep");
		var bestAngle = bestMatchA["angle"];
		var bestScale = bestMatchA["scale"];
//console.log(viewA.pointSpace().count()+" / "+viewB.pointSpace().count()+" ... BEF");
		var items = this.createNewConnection(viewA,pA, viewB,pB, estimated3D, bestAngle,bestScale, score,fError,rError);
		var nextP3D = items["point3D"];
		nextP3D.connect();

//console.log(viewA.pointSpace().count()+" / "+viewB.pointSpace().count()+" ... AFT");
//		console.log(" == CONN "+" @ "+pA+" -> "+pB);
*/
	}else{ // fail point
//		console.log("DEAD POINT: "+forceFail);
		var dead = new R3D.BA.Point2DFail(viewA,pA, viewB,pB, score,fError,rError);
		// console.log(dead);
		// console.log(pA+"->"+pB);
//		console.log(" == DEAD "+" @ "+dead.view().id()+" "+dead.point()+"");
		//console.log("  WAS: "+pointSpaceA.count());
		pointSpaceA.insertObject(dead);
//		console.log("   IS: "+pointSpaceA.count());
	}
}

// TODO: different doughnut sizes
R3D.BA.World.prototype._doughnutSearch = function(sizeLarge,sizeSmall){
	if(!this._doughnutValue){
		var maskLarge = ImageMat.circleMask(sizeLarge,sizeLarge, 0);
		var maskSmall = ImageMat.circleMask(sizeLarge,sizeLarge, sizeLarge-sizeSmall);
		var maskDoughnut = Code.arrayVectorSub(maskLarge,maskSmall);
		this._doughnutValue = maskDoughnut;
	}
	return this._doughnutValue;
}

R3D.BA.World.neighborsForInterpolation = function(bestPointA, viewA,viewB){
	var pointSpaceA = viewA.pointSpace();
	var evaluationFxn = function(a){
		//console.log(a);
		if(Code.isa(a,R3D.BA.Point2DFail)){
			return false;
		}
		var match = a.matchForViews(viewA,viewB);
		if(match){
			return true;
		}
		return false;
	}
	var neighborsA = pointSpaceA.kNN(bestPointA, 6, evaluationFxn);
	if(neighborsA.length<3){
		console.log("not enough regular points:"+neighborsA.length);
		return null;
	}
	return neighborsA;
}
R3D.BA.World.prototype.bestNextMatchForPoint = function(viewA, pointA, viewB){
	var minRadius = viewA.minRadius();
	var maxRadius = viewA.maxRadius();
	var maxAngle = viewA.maxAngle();
	var minAngle = maxAngle * 0.5;
	var searchRadius = maxRadius + minRadius;
	var centerA = pointA.point();
	//var centerB = pointB.point();
	var pointSpaceA = viewA.pointSpace();
	var pointSpaceB = viewB.pointSpace();
	// find all existing points in cell radius
	var neighborsA = pointSpaceA.objectsInsideCircle(centerA,searchRadius);
	// filter points not corresponding to view pairs
//	console.log("center: "+centerA);
	for(var i=0; i<neighborsA.length; ++i){
		var n = neighborsA[i];
		if(Code.isa(n,R3D.BA.Point2DFail)){ // ignore fails
			if(n.oppositeView()!==viewB){
				neighborsA[i] = neighborsA[neighborsA.length-1];
				neighborsA.pop();
				--i;
			}
		}else{
//			console.log("neigh: "+n.point()+" v: "+V2D.sub(n.point(),centerA));
		}
	}
	var bestA = R3D.Dense.smallestAngleGreaterThan(maxAngle,centerA, neighborsA);
	var patchExists = (bestA===null) || bestA["angle"]!==null;
	if(!patchExists){
		return null;
	} // a blank patch exists
	var bestPointA = this.nextBestSearchPoint(viewA, centerA, bestA);
	if(!bestPointA){
		return null;
	}


	var neighborsA = R3D.BA.World.neighborsForInterpolation(bestPointA, viewA,viewB);






//bestNextMatchForPoint
	var predicted = R3D.BA.interpolationData(bestPointA, neighborsA,  viewA,viewB);
	var pA = bestPointA;
	var pB = predicted["point"];
//	console.log(pA+" + "+pB)
	var scaAB = predicted["scale"];
	var angAB = predicted["angle"];
	var imageA = viewA.image();
	var imageB = viewB.image();
	var sizeCompare = viewA.pixelsCompareP2D();
	var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pA,pB, scaAB,angAB, sizeCompare);

	var pA = info["from"];
	var pB = info["to"];

	if(pA.x<=0 || pA.x>=viewA.size().x-1  ||  pA.y<=0 || pA.y>=viewA.size().y-1){
		return null;
	}
	if(pB.x<=0 || pB.x>=viewB.size().x-1  ||  pB.y<=0 || pB.y>=viewB.size().y-1){
		return null;
	}
	return info;
}

COUNTESS = 0;
R3D.BA.World.prototype.nextBestSearchPoint = function(viewA, centerA, bestA){
// COUNTESS++;
// console.log("nextBestSearchPoint: "+COUNTESS);
// console.log(bestA)
// if(COUNTESS>=28){
// 	throw "yup"
// }
	var imageA = viewA.image();
	var cornerA = viewA.corners();
	var minRadius = viewA.minRadius();
	var maxRadius = viewA.maxRadius();
	var maxAngle = viewA.maxAngle();
	var minAngle = maxAngle * 0.5;
	var searchRadius = maxRadius + minRadius;
	// search mask
	var sizeLarge = maxRadius*2;
	var sizeSmall = minRadius*2;
	var maskDoughnut = this._doughnutSearch(sizeLarge,sizeSmall);
	// local area
	var imageSourceA = viewA.image();
	var imageWidth = imageSourceA.width();
	var imageHeight = imageSourceA.height();
	var imageCornersA = viewA.corners();
	var angleInterrior = bestA && bestA["angle"];
	var centralVector = null;
	var centralAngle = null;
	if(angleInterrior){ // has at least 1 neighbor => restricted angle
		var angA = bestA["angleA"];
		var angB = bestA["angleB"];
		var vecA = bestA["vectorA"];
		var vecB = bestA["vectorB"];
		var angDiff = angB-angA;
		if(angDiff<=0){
			angDiff += Math.PI2;
		}
		var median = angA + angDiff*0.5;
		median = Code.angleZeroTwoPi(median);
		centralVector = V2D.rotate(V2D.DIRX,median);
		centralAngle = (angDiff - minAngle)*0.5;
	} // no neighbors => use whole area
	var halfSpace = sizeLarge*0.5 | 0;
	var pointX = Math.floor(centerA.x);
	var pointY = Math.floor(centerA.y);
	var offsetI = pointX - halfSpace;
	var offsetJ = pointY - halfSpace;
	var maxX = null;
	var maxY = null;
	var maxValue = null;
	var passAngle = true;
	var vCP = new V2D();
var maxI = 0;
var maxJ = 0;
var maskDoughnut2 = Code.copyArray(maskDoughnut);
	for(var j=0; j<sizeLarge; ++j){
		for(var i=0; i<sizeLarge; ++i){
			var x = (i+offsetI);
			var y = (j+offsetJ);
			if(0<=x && x<imageWidth && 0<=y && y<imageHeight){ // inside image
				var indexMask = j*sizeLarge + i;
				var indexCorner = y*imageWidth + x;
				var m = maskDoughnut[indexMask];
				if(m>0){
					vCP.set(i - halfSpace,j - halfSpace);
					if(centralVector){ // restrict angle
						var ang = V2D.angle(centralVector,vCP);
						passAngle = ang < centralAngle;
					}
					if(passAngle){
maskDoughnut2[indexMask] = 2;
						var c = imageCornersA[indexCorner];
						if(maxValue===null || c>maxValue){
							maxX = vCP.x;
							maxY = vCP.y;
							maxValue = c;
maxI = i;
maxJ = j;
						}
					}else{
maskDoughnut2[indexMask] = 4;
					}
				}
			}
		}
	}
//throw "?"
	if(maxX===null || maxY===null){ // not reached (outside picture)
		return null;
	}
if(COUNTESS>=26){
	indexMask = maxJ*sizeLarge + maxI;
	maskDoughnut2[indexMask] = 8;
	console.log( Code.array1Das2DtoString(maskDoughnut2, sizeLarge, sizeLarge, 2,3) );
}
	// estimate location for new point
	var bestPointA = new V2D(centerA.x+maxX, centerA.y+maxY);
	return bestPointA;
}

R3D.BA.interpolationData = function(point, points2D, viewA,viewB){
	var data = [];
	// create percentage targets
	var totalFraction = 0;
	for(var i=0; i<points2D.length; ++i){
		var p = points2D[i];
		var m = p.matchForViews(viewA,viewB);
//console.log("A MATCH IS NOT GUARANTEED TO EXIST IF IT IS NOT FILTERED BEFOREHAND");
		var a = m.pointForView(viewA);
		var b = m.pointForView(viewB);
		var distance = V2D.distance(a.point(), point);
		var fraction = 1.0 / (1.0 + Math.pow(distance, 2) );
		totalFraction += fraction;
		data.push({"from":a, "to":b, "match":m, "fraction":fraction});
	}
	// convert to interpolated points
	var predictions = [];
	var scale = 0.0;
	var position = new V2D();
	var angles = [];
	var percents = [];
	for(var i=0; i<data.length; ++i){
		var d = data[i];
		var percent = d["fraction"]/totalFraction;
		var pointA = d["from"];
		var pointB = d["to"];
		var fr = pointA.point();
		var to = pointB.point();
		var match = d["match"];
		var ang = match.angleForPoint(pointB);
		var sca = match.scaleForPoint(pointB);
		//scale += percent*Math.log2(sca);
		scale += percent*sca;
		var relativeFrom = V2D.sub(point,fr);
		var pos = relativeFrom.copy().rotate(ang).scale(sca).add(to).scale(percent);
		position.add(pos);
		percents.push(percent);
		angles.push(ang);
	}
	var angle = Code.averageAngles(angles, percents);
	var prediction = {"point":position, "angle":angle, "scale":scale};
	return prediction;
}

R3D.BA.World.prototype.unprojectedViews = function(point3D){
	var p3DViews = point3D.toViewArray();
	var allViews = this.toViewArray();
	var notList = [];
	for(var i=0; i<allViews.length; ++i){
		var found = false;
		var viewA = allViews[i];
		for(var j=0; j<p3DViews.length; ++j){
			var viewB = p3DViews[j];
			if(viewA==viewB){
				found = true;
				break;
			}
		}
		if(!found){
			notList.push(viewA);
		}
	}
	return notList;
}

R3D.BA.World.prototype.absoluteCameras = function(){
	// find discrete groupings
	var views = this.toViewArray();
	var graph = new Graph();
	var vertexes = [];
	var edges = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var vertex = graph.addVertex();
		vertex.data(view);
		vertexes[i] = vertex;
	}
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var trans = this.transformFromViews(viewA,viewB);
			if(trans){
				var weight = trans.graphWeight();
//console.log("weight: "+i+"-"+j+"  = "+weight);
				var vA = vertexes[i];
				var vB = vertexes[j];
				var edge = graph.addEdgeDuplex(vA,vB,weight);
				edge.data(trans);
			}
		}
	}
	var groups = graph.disjointSets();
	// find minimum paths for each group
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var groupGraph = new Graph();
		var groupVertexes = [];
		for(var j=0; j<group.length; ++j){
			var vertex = group[j];
			var view = vertex.data();
			var groupVertex = groupGraph.addVertex();
				groupVertex.data(view);
			groupVertexes.push(groupVertex);
		}
		for(var j=0; j<groupVertexes.length; ++j){
			var groupVertexA = groupVertexes[j];
			for(k=j+1; k<groupVertexes.length; ++k){
				var groupVertexB = groupVertexes[k];
				var trans = this.transformFromViews(groupVertexA.data(),groupVertexB.data());
				if(trans){
					var weight = trans.graphWeight();
					var edge = groupGraph.addEdgeDuplex(groupVertexA,groupVertexB,weight);
					edge.data(trans);
				}
			}
		}
		var bestPaths = groupGraph.minRootPaths();
		var bestRoot = bestPaths["root"];
		var bestList = bestPaths["paths"];
		var rootView = bestRoot.data();
		// determine absolute camera positions based root & min path graph
		for(var j=0; j<bestList.length; ++j){
			var info = bestList[j];
			var vertex = info["vertex"];
			var cost = info["cost"];
			var path = info["path"];
			var view = vertex.data();
				path.push(vertex);
			var mat = new Matrix(4,4).identity();
			var prev = null;
			var next = null;
			for(k=0; k<path.length; ++k){
				var vert = path[k];
				var next = vert.data();
//console.log(k+" : "+(prev?prev.id():"x")+" -> "+(next?next.id():"x"));
				if(next && prev){
					var trans = this.transformFromViews(prev,next);
					var t = null;
//console.log("      trans: "+trans.viewA().id()+" & "+trans.viewB().id());
					//console.log(trans);
					if(trans.viewA()==prev){
						t = trans.R(prev,next);
						//t = trans.forward();
					}else{ // trans.viewB()==prev
						//t = trans.reverse();
						t = trans.R(next,prev);
					}
					mat = Matrix.mult(mat,t);
				}
				prev = next;
			}
//console.log("absoluteTransform: "+j+"\n "+mat);
			view.absoluteTransform(mat);
		}
		groupGraph.kill();

	}
	graph.kill();
	// now have absolute positions from least-error-propagated origin view
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	console.log(view.absoluteTransform()+"");
	// }
	// get absolute position for all 3d points
}
R3D.BA.World.prototype.absolutePoints = function(){
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.calculateAbsoluteLocation();
	}
}

R3D.BA.World.prototype.createNewConnection = function(viewA,pA, viewB,pB, p3D, bestAngle,bestScale, score,fError,rError){ // TODO: allow for lists of points2D
		var transform = this.transformFromViews(viewA,viewB);
		var point3D = new R3D.BA.Point3D(p3D);
		var pointA = new R3D.BA.Point2D(pA, viewA, point3D);
		var pointB = new R3D.BA.Point2D(pB, viewB, point3D);
		var match = new R3D.BA.Match2D(viewA, viewB);
		match.viewA(viewA);
		match.viewB(viewB);
		match.pointA(pointA);
		match.pointB(pointB);
		match.point3D(point3D);
		match.score(score);
		match.errorF(fError);
		match.errorR(rError);
		match.angleForPoint(pointB, bestAngle);
		match.scaleForPoint(pointB, bestScale);
		match.transform(transform);
		pointA.point3D(point3D);
		pointA.matchForViews(viewA,viewB, match);
		pointB.point3D(point3D);
		pointB.matchForViews(viewA,viewB, match);
		point3D.point2DForView(viewA,pointA);
		point3D.point2DForView(viewB,pointB);
		point3D.matchForViews(viewA,viewB,match);
//		point3D.connect(this); // TODO: move outside or make optional
		return {"point3D":point3D, "pointA":pointA, "pointB":pointB, "match":match};
}


R3D.BA.World.prototype.createNewConnectionFromMatches = function(matches){
	var point3D = new R3D.BA.Point3D();
	return this.connectMatchesToPoint3D(point3D,matches);
}
R3D.BA.World.prototype.connectMatchesToPoint3D = function(point3D,matches){
	// consistency check:
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var pointA = match.pointA();
		var pointB = match.pointB();
		if(pointA.view()!=viewA || pointB.view()!=viewB){
			console.log(" views: "+viewA+"&"+viewB);
			console.log(" points: "+pointA.view()+" 0 "+pointB.view());
			throw "incorrect matching: "+pointA+" & "+pointB;
		}
	}
	for(var i=0; i<matches.length; ++i){
		var match = matches[i]; // should already have: p2dA,p2dB,score,angle,scale,viewA,viewB
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = this.transformFromViews(viewA,viewB);
//		console.log(".    for views: "+viewA+"&"+viewB);
		var pointA = match.pointA();
		var pointB = match.pointB();
//		console.log(".    points: "+pointA.view()+" 0 "+pointB.view());
		match.point3D(point3D);
		pointA.point3D(point3D);
		pointA.matchForViews(viewA,viewB, match);
		pointB.point3D(point3D);
		pointB.matchForViews(viewA,viewB, match);
		match.transform(transform);
		point3D.point2DForView(viewA,pointA);
		point3D.point2DForView(viewB,pointB);
		point3D.matchForViews(viewA,viewB,match);
	}
	return {"point3D":point3D, "matches":matches};
}

R3D.BA.World.prototype.removeP2D = function(point2D){ // view, point3D, matches, 
	var point3D = point2D.point3D();
	var points2D = point3D.toPointArray();
	if(points2D<=2){ // will leave 1 item left => remove now
		point3D.disconnect(this);
		point3D.markRemoved();
	}
	// var matches = point3D.toMatchArray();
	// for(var i=0; i<matches.length; ++i){
	// 	var match = matches[i];
	// 	var transform = match.transform();
	// 	transform.removeMatch(match);
	// 	if(match.pointA()==point2D || match.pointB()==point2D){
	// 		var opposite = match.oppositePoint(point2D);
	// 		opposite
	// 		point3D.removeMatch(match);
	// 	}
	// }
	// point3D.removePoint2D(point2D);
	// var view = point2D.view();
	// view.pointSpace().removeObject(point2D);
	return point2D;
}

R3D.BA.World.prototype.toYAMLString = function(){
	console.log("toYAMLString");
	var yaml = new YAML();
	var timestampNow = Code.getTimeStamp();
	yaml.writeComment("BA model");
	yaml.writeComment("created: "+timestampNow);
	yaml.writeBlank();
	// OBJECTS
	var cameras = this._cameras;
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	//var points3D = this.pointSpace().toArray();
	var points3D = this._points3D;
	// CAMERAS
	if(cameras && cameras.length>0){
		yaml.writeArrayStart("cameras");
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			yaml.writeObjectStart();
			yaml.writeString("id",camera.id()+"");
			var K = camera.K();
			if(K){
				yaml.writeObjectStart("K");
				K.saveToYAML(yaml);
				yaml.writeObjectEnd();
			}
			var distortion = camera.distortion();
			if(distortion){
				var keys = Code.keys(distortion);
				yaml.writeObjectStart("distortion");
				for(var j=0; j<keys.length; ++j){
					var key = keys[j];
					var value = distortion[key];
					yaml.writeNumber(key,value);
				}
				yaml.writeObjectEnd();
			}
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	// VIEWS
	if(views && views.length>0){
		yaml.writeArrayStart("views");
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			yaml.writeObjectStart();
			var viewID = view.mapping();
			if(!viewID){
				viewID = view.id();
			}
			yaml.writeString("id",viewID+"");
			yaml.writeString("camera",view.camera().id()+"");
			var absoluteTransform = view.absoluteTransform();
			if(absoluteTransform){
				yaml.writeObjectStart("transform");
				absoluteTransform.saveToYAML(yaml);
				yaml.writeObjectEnd();
			}
			/*
			var pts = view["points"];
			if(pts && pts.length>0){
				yaml.writeArrayStart("points");
				for(j=0; j<pts.length; ++j){
					var point2D = pts[j];
					yaml.writeObjectStart();
						yaml.writeNumber("x",point2D["x"]);
						yaml.writeNumber("y",point2D["y"]);
					yaml.writeObjectEnd();
				}
				yaml.writeArrayEnd();
			}
			*/
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	// POINTS
	if(points3D && points3D.length>0){
console.log("PRINT OUT THE ERROR IN RELATIVE AND ABSOLUTE LOCATION, HOW FAR ARE THE INDIVIDUAL / AVERAGES OFF FOR EACH TRANSFORM PAIR ?");
		var pairsOf3 = 0;
		var pairsOf2 = 0;
		var countList = Code.newArrayZeros(5);
		yaml.writeArrayStart("points");
		for(i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = point3D.point();
			var pointCount = point3D.toPointArray().length;
			countList[pointCount]++;
			
			if(pointCount==3){
				pairsOf3++;
			}

			// if(pointCount<3){
			// 	continue;
			// }

			if(!point){
				throw "problem: "+point;
				console.log("problem: "+point);
				console.log(point3D);
			}else{
				yaml.writeObjectStart();
				yaml.writeNumber("x",point.x);
				yaml.writeNumber("y",point.y);
				yaml.writeNumber("z",point.z);
				yaml.writeObjectEnd();
			}
		}
		yaml.writeArrayEnd();
	}
	//console.log("pairsOf3: "+pairsOf3);
	console.log(countList);
	//

	yaml.writeDocument();
	var str = yaml.toString();
//	console.log(str);
	return str;
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
// var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);


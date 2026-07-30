// AreaMap.js

/*
x	make ~100 3D points (on a sphere)
x	make 3 cameras
x	make 3 image projections : 1 for each camera
		have some projection error 0.001, 0.01, 0.1 x image size : pixel error
	create point correspondences
	estimate relative extrinsic matrix for each (possible) pair
	align cameras using reprojection error minimizing
	align cameras using surface error minimizing
		- try different error metrics
			-> try running in sequence & comparing, rather than manually
	
	visualize generated 3D points in 3D
	visualize generated 2D projected points in 2D




	surface error metrics


	R3D._testMatchViewGeometry3D = function(){
		R3D._testOptimizeGeometryProjection3D = function(){
*/

function Alignment3D(){
	//console.log("Alignment3D");

	// GLOBAL STAGE:
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
//	this._root = new DO();
//	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	GLOBALSTAGE = this._stage;


	this.SyntheticWorld();

	//this.Synthetic2DTransform();
}

// try to align a set of 2D points - essentially optimizing a 2D trans [metric] (tx, ty, r, SCALE?)
Alignment3D.prototype.Synthetic2DTransform = function(){

	// define error
	// var errorTranslate = 1E-10;
	// var errorRotate = 1E-10;
	// var errorScale = 1E-10;

	
	var errorTranslate = 1E-1;
	var errorRotate = Code.radians(1);
	//var errorRotate = Code.radians(1E-5);
	var errorScale = 1E-10;


	var randomTranslate = 1.0;
	var randomRotate = Code.radians(30.0);

	// generate 100 random points in 2D
	var pointCount = 30;
	var points2D = [];
	for(var i=0; i<pointCount; ++i){
		var point2D = new V2D( (Math.random() - 0.5)*2.0, (Math.random() - 0.5)*2.0 );
		var point = {};
		point["world"] = point2D;
		point["points"] = {};
		points2D.push(point);
	}
	console.log(points2D);

	// generate 2 random transforms
	var viewCount = 2;
	var views = [];
	var temp = new Matrix(3,3);
	for(var i=0; i<viewCount; ++i){
		var viewID = ""+i;
		var angle = randomRotate * (Math.random()-0.5)*2.0;
		var offsetX = randomTranslate * (Math.random()-0.5)*2.0;
		var offsetY = randomTranslate * (Math.random()-0.5)*2.0;
		if(i==0){
			angle = 0;
			offsetX = 0;
			offsetY = 0;
		}
		
		var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DRotate(matrix, angle);
		matrix = Matrix.transform2DTranslate(matrix, offsetX,offsetY);
//console.log(matrix);
		var p2Ds = [];
		for(var j=0; j<pointCount; ++j){
			var point2D = points2D[j];
			var errorX = (Math.random() - 0.5)*2.0 * errorTranslate;
			var errorY = (Math.random() - 0.5)*2.0 * errorTranslate;
			var errorA = (Math.random() - 0.5)*2.0 * errorRotate;
			var world2D = point2D["world"];
			var p = world2D.copy();
			temp.copy(matrix);
			temp = Matrix.transform2DRotate(temp, errorA);
			temp = Matrix.transform2DTranslate(temp, errorX,errorY);
			p = temp.multV2DtoV2D(p);
			var p2D = {};
			p2D["view"] = viewID;
			p2D["point2D"] = point2D;
			p2D["point"] = p;
			p2Ds.push(p2D);
			//point2D["points"].push(p2D);
			point2D["points"][viewID] = p2D;
		}
		var view = {};
		view["id"] = viewID;
		view["real"] = matrix;
		view["points2D"] = p2Ds;
		views.push(view);
	}
	//console.log(views);

	// define point mappings between views (do as part of view definition)

	
	// get an initial transform offset estimate - trans & rot offset


	// iterate adjustment of transform offset to minimize error


	// display
	var root = this._stage.root();
	//root.matrix().translate(300,300);
	root.matrix().translate(300,210);
	var displayScale = 100;

	for(var i=0; i<viewCount; ++i){
		var view = views[i];
		var p2Ds = view["points2D"];


		var thickOutline = 1.0;
		var colorOutline = 0xFFFF0000;
		var colorFill = 0x0;


		if(i==0){
			colorFill = 0xFFFF0000;
		}else if(i==1){
			colorFill = 0xFF0000FF;
		}

		var d = new DO();
		root.addChild(d);

		d.graphics().clear();
		
		//d.graphics().setLine(thickOutline,colorOutline);



		for(var j=0; j<p2Ds.length; ++j){
			var p2D = p2Ds[j];
			var p = p2D["point"];
			// console.log(p);
			d.graphics().setFill(colorFill);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x*displayScale,p.y*displayScale, 5.0);
			d.graphics().endPath();
			//d.graphics().strokeLine();
			d.graphics().fill();
		}
	}


	//var result = Alignment3D.iterateSolve2D(views, points2D);

	var result = Alignment3D.iterateSolve2DSubsets(views, points2D);

	console.log(result);
	var matrix = result["matrix"];


	for(var i=1; i<viewCount; ++i){
		var view = views[i];
		var p2Ds = view["points2D"];


		var thickOutline = 1.0;
		var colorOutline = 0xFFFF0000;
		var colorFill = 0x0;


		if(i==0){
			colorFill = 0xFFFF0000;
		}else if(i==1){
			colorFill = 0xFF0000FF;
		}


		colorFill = 0x9900FF00;

		var d = new DO();
		root.addChild(d);

		d.graphics().clear();
		d.graphics().setLine(2.0, 0xCC0000FF);
		//d.graphics().setFill(colorFill);

		for(var j=0; j<p2Ds.length; ++j){
			var p2D = p2Ds[j];
			var p = p2D["point"];
			p = matrix.multV2DtoV2D(p);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x*displayScale,p.y*displayScale, 7.0);
			d.graphics().endPath();
			d.graphics().strokeLine();
			//d.graphics().fill();
		}
	}

	// ground truth points
	//var thickOutline = 1.0;
	//var colorOutline = 0xFFFF0000;
	//var colorFill = 0xFFFF00FF;
	var colorFill = 0xFF339933;
	var d = new DO();
	root.addChild(d);
	d.graphics().clear();
	d.graphics().setLine(2.0, 0xCCDDFFDD);
	d.graphics().setFill(colorFill);

	for(var j=0; j<points2D.length; ++j){
		var point = points2D[j];
		//console.log(point)
		var p = point["world"];
		//p = matrix.multV2DtoV2D(p);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x*displayScale,p.y*displayScale, 4.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
	}



throw "Synthetic2DTransform ...";
}


Alignment3D.errorSolve2D = function(args, x, isUpdate){
	var matrix = args[0];
	var views = args[1];
	var points2D = args[2];
	var indexes = args[3];

	var totalError = 0;
	var viewA = views[0];
	var viewB = views[1];

	var viewAID = viewA["id"];
	var viewBID = viewB["id"];

	var tx = x[0];
	var ty = x[1];
	var angle = x[2];
	matrix.identity();
	matrix = Matrix.transform2DRotate(matrix, angle);
	matrix = Matrix.transform2DTranslate(matrix, tx,ty);


// first time around, indexes may not exist
if(indexes == null || indexes.length==0){
	indexes = [];
	for(var i=0; i<points2D.length; ++i){

		var point2D = points2D[i];
		var list = point2D["points"];
		var point2DA = list[viewAID];
		var point2DB = list[viewBID];
		if(!point2DA || !point2DB){
			continue;
		}
		indexes.push(i);
	}
	args[3] = indexes;
}

	if(isUpdate){
		// define what the lowest error points are first & use only those
		
		// on an update, do a random discrete test of the local space to see if there is a better local minima

		var errors = [];
		indexes = [];

		var pairPoints = 0;
		for(var i=0; i<points2D.length; ++i){

			var point2D = points2D[i];
			var list = point2D["points"];
			var point2DA = list[viewAID];
			var point2DB = list[viewBID];
			if(!point2DA || !point2DB){
				continue;
			}
			var pA = point2DA["point"];
			var pB = point2DB["point"];
			// move pB to new location
			pB = matrix.multV2DtoV2D(pB);
			var distance = V2D.distance(pA,pB);
			indexes.push(i);
			errors.push(distance);


			totalError += distance;
			++pairPoints;
		}
		//console.log("old length "+indexes.length);

		// FILTER
		var min = Code.min(errors);
		var sigma = Code.stdDev(errors, min);
		//console.log("find sigma: "+min+" +/-"+sigma);

		var limit = sigma * 1.0; // 68%
		//var limit = sigma * 2.0; // 95%

		// want to make sure that there is always at least ~50% of the source population?
		var minimumPopulationPercent = 0.50;
		var sortedError = Code.copyArray(errors);
			sortedError.sort(function(a,b){return a<b ? -1 : 1});
		var sortedLimitIndex = Math.min(Math.ceil( minimumPopulationPercent * errors.length), errors.length-1);
		limit = Math.max(limit, sortedError[sortedLimitIndex] );


//limit = sigma * 999.0;


		
		for(var i=0; i<indexes.length; ++i){
			var index = indexes[i];
			var error = errors[i];
			//console.log(error+" ?>? "+limit);
			if(error>limit){
				Code.arrayRemoveIndex(indexes,i);
				Code.arrayRemoveIndex(errors,i);
				--i;
			}
		}
		console.log("new length "+indexes.length);
		args[3] = indexes;
	}
	

	// final error
	var pairPoints = 0;
	for(var i=0; i<indexes.length; ++i){
		var index = indexes[i];
		var point2D = points2D[index];
		var list = point2D["points"];
		var point2DA = list[viewAID];
		var point2DB = list[viewBID];
		var pA = point2DA["point"];
		var pB = point2DB["point"];
		// move pB to new location
		pB = matrix.multV2DtoV2D(pB);
		var distance = V2D.distance(pA,pB);
		totalError += distance;
		++pairPoints;
	}
	console.log(pairPoints);
	totalError /= pairPoints;
	//console.log(totalError);
	return totalError;
}

Alignment3D.iterateSolve2D = function(views, points){
	console.log(views);
	console.log(points);

	// tx, ty, r
	var x = [0,0,0];




	var maxIterations = 100;
	var temp = new Matrix(3,3);
	var args = [temp, views, points, []];
	var minError = [1E-12, 1E-12, 1E-9]; // ?
	var minErrorDifference = 1E-12;
	var useEpsilon = null;

	var result = Code.gradientDescent(Alignment3D.errorSolve2D, args, x, useEpsilon, maxIterations, minErrorDifference);
	// Code.gradientDescent = function(fxn, args, x, dx, iter, diff, epsilon, lambda){
	var x = result["x"];
	var cost = result["cost"];
	// replace as-was
	//listP[variablePIndex] = O;
	// to output
	//R3D.transform3DFromComponentArray(P, x);
	var matrix = new Matrix(3,3);
	matrix.identity();
	matrix = Matrix.transform2DRotate(matrix, x[2]);
	matrix = Matrix.transform2DTranslate(matrix, x[0],x[1]);

	return {"matrix":matrix, "error":cost};



	// translate
	// rotate
	// scale
}


Alignment3D.errorSolve2DSubset = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var matrix = args[0];
	var views = args[1];
	var pointPairs = args[2];
	var totalError = 0;
	var viewA = views[0];
	var viewB = views[1];
	var viewAID = viewA["id"];
	var viewBID = viewB["id"];

	var tx = x[0];
	var ty = x[1];
	var angle = x[2];
	matrix.identity();
	matrix = Matrix.transform2DRotate(matrix, angle);
	matrix = Matrix.transform2DTranslate(matrix, tx,ty);

	// final error
	for(var i=0; i<pointPairs.length; ++i){
		var pair = pointPairs[i];
		var pA = pair[0];
		var pB = pair[1];
		// move pB to new location
		pB = matrix.multV2DtoV2D(pB);
		var distance = V2D.distance(pA,pB);
		totalError += distance;
	}
	totalError /= pointPairs.length;
	return totalError;
}

Alignment3D.iterateSolve2DSubsets = function(views, points){
	console.log(views);
	console.log(points);


	var viewA = views[0];
	var viewB = views[1];
	var viewAID = viewA["id"];
	var viewBID = viewB["id"];

	// tx, ty, r
	var x = [0,0,0];


	var maxIterationsOfSets = 10;

	var maxIterationsPerSet = 100;
	var temp = new Matrix(3,3);
	
	var minError = [1E-12, 1E-12, 1E-9]; // ?
	var minErrorDifference = 1E-12;
	
	
	var matrix = new Matrix(3,3);
	matrix.identity();
	matrix = Matrix.transform2DRotate(matrix, x[2]);
	matrix = Matrix.transform2DTranslate(matrix, x[0],x[1]);

	var useEpsilon = null;
	var useLambda = null;

	
	for(var iter=0; iter<maxIterationsOfSets; ++iter){
		var pointPairs = [];
		var errors = [];
		for(var i=0; i<points.length; ++i){
			var point2D = points[i];
			var list = point2D["points"];
			var point2DA = list[viewAID];
			var point2DB = list[viewBID];
			if(!point2DA || !point2DB){
				continue;
			}
			var pA = point2DA["point"];
			var pB = point2DB["point"];
			// push the point before its altered
			pointPairs.push([pA,pB]);
			// move pB to new location
			pB = matrix.multV2DtoV2D(pB);
			var distance = V2D.distance(pA,pB);
			errors.push(distance);
			
		}
		// FILTER
		var min = Code.min(errors);
		var sigma = Code.stdDev(errors, min);
		//console.log("find sigma: "+min+" +/- "+sigma);
		var limit = sigma * 1.0; // 68%
		//var limit = sigma * 2.0; // 95%

		// want to make sure that there is always at least ~50% of the source population?
		var minimumPopulationPercent = 0.50;
		var sortedError = Code.copyArray(errors);
		//console.log(errors.length)
		//console.log(sortedError.length)
		sortedError.sort(function(a,b){return a<b ? -1 : 1});
		//console.log(sortedError)
		var sortedLimitIndex = Math.min(Math.ceil( minimumPopulationPercent * errors.length), errors.length-1);
		limit = Math.max(limit, sortedError[sortedLimitIndex] );
		if(iter>0){
			//console.log("sortedLimitIndex: "+sortedLimitIndex+" / "+limit)
			for(var i=0; i<pointPairs.length; ++i){
				var error = errors[i];
				if(error>limit){
					Code.arrayRemoveIndex(pointPairs,i);
					Code.arrayRemoveIndex(errors,i);
					--i;
				}
			}
		}
		console.log("LENGTH: "+pointPairs.length);
		// TODO: useEpsilon should be based on population relative size
		
		var args = [temp, views, pointPairs];
		// dx translation should be scaled by extent of population (eg get sigmoid volume)
		// theta (r) maybe needs to scale somewhat by distance of population
		var useDx = [1E-6,1E-6,Code.radians(1E-3)]; // tx,ty,r
		// Code.gradientDescent =                                  function(fxn, args, x, dx, iter, diff, epsilon, lambda){
		var result = Code.gradientDescent(Alignment3D.errorSolve2DSubset, args, x, useDx, maxIterationsPerSet, minErrorDifference);
		//console.log(result);
		//useLambda = result["lambda"];
		x = result["x"];
		var cost = result["cost"];
		// could get epsilon from previous iteration?

		matrix.identity();
		matrix = Matrix.transform2DRotate(matrix, x[2]);
		matrix = Matrix.transform2DTranslate(matrix, x[0],x[1]);
	}

	return {"matrix":matrix, "error":cost};
}



/*
R3D._transformCameraExtrinsicDLTNonlinearGD = function(args, x, isUpdate){
	// if(isUpdate){
	// 	return;
	// }
	var listP = args[0];
	var listK = args[1];
	var listKinv = args[2];
	var variableIndex = args[3];
	var listPoints2D = args[4];
	var negativeIsBad = args[5];
	var extrinsicP = listP[variableIndex];
	R3D.transform3DFromComponentArray(extrinsicP, x);
	var totalError = 0;
	var pointSetCount = listPoints2D.length;
	var tempP3D = new V3D();
	for(var k=0; k<pointSetCount; ++k){
		var track = listPoints2D[k];
		// get predicted 3D point
		var points2D = [];
		var extrinsics = [];
		var invKs = [];
		for(var t=0; t<track.length; ++t){
			var entry = track[t];
			var point2D = entry[0];
			var indexP = entry[1];
			points2D.push(point2D);
			extrinsics.push(listP[indexP]);
			invKs.push(listKinv[indexP]);
		}
		var point3D = R3D.triangulatePointDLTList(points2D, extrinsics, invKs);
		if(!point3D){
			console.log("null point3D");
			console.log(points2D,extrinsics,invKs);
			throw "?"
			continue;
		}
		// reprojection error:
		var error = 0;
		var isBehind = false;
		for(var t=0; t<track.length; ++t){
			var entry = track[t];
			var point2D = entry[0];
			var indexP = entry[1];

			var P = listP[indexP];
			var K = listK[indexP];

			P.multV3DtoV3D(tempP3D,point3D);
			K.multV3DtoV3D(tempP3D,tempP3D);
			isBehind |= (tempP3D.z<=0 || tempP3D.z<=0);
				tempP3D.homo();

			var distanceSquare = V2D.distanceSquare(point2D, tempP3D);
			error += distanceSquare;
		}
		if(negativeIsBad && isBehind){ // behind camera
			console.log("isBehind");
			error *= 2;
		}
		totalError += error;

	} // track list
	// if(isUpdate){
		// console.log(totalError);
	// }
	return totalError;
}
*/

/*
optimizing options:
	- only use top % of best matches to align space
		- prepeated drop outliers:
			- get the errors for each point (or for some subset of points)
			- 

*/


Alignment3D.prototype.SyntheticWorld = function(){



//console.log(this._stage);

d = this._stage.root();

	var e = new DO();
		e.graphics().setLine(1.0,0x66FFFFFF);
		e.graphics().setFill(0x66CC0000);
		e.graphics().beginPath();
		e.graphics().drawRect(100,100, 250,100);
		e.graphics().strokeLine();
		e.graphics().endPath();
		e.graphics().fill();
//		e.matrix().rotate(rot);
//		e.matrix().translate(i,j);
		d.addChild(e);






	// generate 3D points:
	var sphereRadius = 1.0;
		// var sphereRadius = 0.01;
	// var worldPointCount = 10;
	var worldPointCount = 100;
	// var worldPointCount = 1000;
	var worldPoints3D = [];

	var worldViews = [];
	var worldTransform;
	var worldView;

	var imageIndex = 0;
	var image = {
		"width": 300,
		"height": 200,
		"fx": 1000,
	};
	var fx = image["fx"];
	var fy = image["fx"];
	var cx = image["width"]*0.5 + 0;
	var cy = image["height"]*0.5 + 0;
	var s = 0;
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);

	/*
	worldTransform = new Matrix(4,4).identity();
		//worldTransform = Matrix.transform3DTranslate(worldTransform, 2,1,9);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 2,1,7);

	// worldTransform = Matrix.transform3DTranslate(worldTransform, 2,1,10);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 2,1,-1);


	// worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,0);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,1);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,10);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,100);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, -5,3,-10);
	// worldTransform = Matrix.transform3DTranslate(worldTransform, 1,1,9);
	//worldTransform = Matrix.transform3DTranslate(worldTransform, 2,1,11);

	worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,11);
	*/


	// A
	worldTransform = new Matrix(4,4).identity();
	worldTransform = Matrix.transform3DTranslate(worldTransform, 0,0,11);
	worldView = {
		"id": "A",
		"abs": worldTransform,
		"image": image,
		"K": K,
	};
	worldViews.push(worldView);

	// B
	worldTransform = new Matrix(4,4).identity();
	worldTransform = Matrix.transform3DTranslate(worldTransform, 1,0,14);
	worldView = {
		"id": "B",
		"abs": worldTransform,
		"image": image,
		"K": K,
	};
	worldViews.push(worldView);

	// C
	worldTransform = new Matrix(4,4).identity();
	worldTransform = Matrix.transform3DTranslate(worldTransform, -0.5,0.25,13);
	worldView = {
		"id": "C",
		"abs": worldTransform,
		"image": image,
		"K": K,
	};
	worldViews.push(worldView);


	// generate world points
	var worldView = worldViews[v];
	for(var i=0; i<worldPointCount; ++i){
		var point3D = Code.randomPointOnSphere(sphereRadius);
			point3D = worldTransform.multV3DtoV3D(point3D);
		var worldPoint = {};
			worldPoint["point3D"] = point3D;
		worldPoints3D.push(worldPoint);
	}

	// X & Y & Z
	for(var i=0; i<10; ++i){
		var point3D = new V3D(i*1, 0, 0);
		var worldPoint = {};
			worldPoint["point3D"] = point3D;
		worldPoints3D.push(worldPoint);
	}

	for(var i=0; i<10; ++i){
		var point3D = new V3D(0, i+1, 0);
		var worldPoint = {};
			worldPoint["point3D"] = point3D;
		worldPoints3D.push(worldPoint);
	}

	for(var i=0; i<10; ++i){
		var point3D = new V3D(0, 0, i*1);
		var worldPoint = {};
			worldPoint["point3D"] = point3D;
		worldPoints3D.push(worldPoint);
	}
	for(var i=0; i<worldPoints3D.length; ++i){
		worldPoints3D[i]["sourcePoints2D"] = {}; // real
		worldPoints3D[i]["points2D"] = {}; // with error
		worldPoints3D[i]["estimated2D"] = {};
	}


	console.log(worldPoints3D);

	// project points onto images
	// var viewExtrinsicMatrix = new Matrix(4,4).identity();
	for(var v=0; v<worldViews.length; ++v){
		var worldView = worldViews[v];
		var image = worldView["image"];
		var imageID = worldView["id"];
console.log("imageID: "+imageID);
		var abs = worldView["abs"];
		// var ext = Matrix.inverse(abs);
		var ext = (abs);
		var imagePoints2D = [];
		for(var i=0; i<worldPointCount; ++i){
			var worldPoint3D = worldPoints3D[i];
			var point3D = worldPoint3D["point3D"];
			var points2D = worldPoint3D["points2D"]
			// var point2D = R3D.projectPoint3DToCamera2DForward(point3D, viewWorldMatrix, K, null, true);
			var point2D = R3D.projectPoint3DCamera2DDistortion(point3D, ext, K, null, null, true);
			if(!point2D){
				continue;
			}
			if(!Code.isPointInsideRect2D(point2D, image["width"], image["height"])){
				continue;
			}
			worldPoint3D["points2D"][imageID] = point2D;
			imagePoints2D.push(point2D);
			points2D[imageID] = point2D;
//			console.log(point2D+"");
		}
		worldView["points2D"] = imagePoints2D;
	}

	// show 2D image point projections:
	for(var v=0; v<worldViews.length; ++v){
		var worldView = worldViews[v];
		var image = worldView["image"];
		var points2D = worldView["points2D"]

		var circleSize = 3.0;
		var colorFill = 0xFF99AABB;
		var thickOutline = 1.0;
		var colorOutline = 0xFF000000;
		var colorInside = 0xFFFFFFFF;
		var d = new DO();
		d.matrix().translate(v*300, 0);
		d.graphics().clear();
		d.graphics().setLine(thickOutline,colorOutline);
		d.graphics().setFill(colorInside);
		d.graphics().beginPath();
		d.graphics().drawRect(0,0, image["width"],image["height"]);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		this._stage.addChild(d);


		d.graphics().setFill(colorFill);
		//d.graphics().setLine(thickOutline,colorOutline);
		for(var i=0; i<points2D.length; ++i){
			var p2D = points2D[i];
			d.graphics().beginPath();
			d.graphics().drawCircle(p2D.x,p2D.y,circleSize);
			d.graphics().endPath();
			d.graphics().fill();
		}
	}


console.log(worldPoints3D);
// find all matches between pairs of images:
	var worldPairLookup = {};
	var worldViewLookup = {};
	var worldPairs = [];

	var pairIDFromIDs = function(a,b){
		var l = [a,b];
		l = l.sort();
		var id = l.join("-");
		return id;
	}
	var viewFromViewID = function(viewID){
		return worldViewLookup[viewID];
	}
	var pairFromPairID = function(pairID){
		return worldPairLookup[pairID];
	}

	for(var i=0; i<worldViews.length; ++i){
		var worldViewA = worldViews[i];
		var idA = worldViewA["id"];
		worldViewLookup[idA] = worldViewA;
		for(var j=i+1; j<worldViews.length; ++j){
			var worldViewB = worldViews[j];
			var idB = worldViewB["id"];
			var pairID = pairIDFromIDs(idA,idB);
			//var pairID = pairIDFromIDs(idB,idA);
			var pair = {"id":pairID, "points3D":[],"idA":idA,"idB":idB};
			worldPairLookup[pairID] = pair;
			worldPairs.push(pair);
		}
	}

var errorPoints2DPercentImage = 0.001; // of image size, 0.01 on 400x300=500 = 5 pixels [high]
//var errorPoints2DAbsolute = 0.01; // units in 'real world' [TODO: use size of entire sample population to get relative size]
//var errorRelativeMatrixesTranslation = 0.01; // units
//var errorRelativeMatrixesRotationRadians = Code.radians(1.0); // angle
	



	for(var i=0; i<worldPoints3D.length; ++i){
		var worldPoint = worldPoints3D[i];
		// console.log(worldPoint);
		// var point3D = worldPoint["point3D"];
		var points2D = worldPoint["points2D"];
		var viewIDs = Code.keys(points2D);
		// console.log(viewIDs);
		for(var v=0; v<viewIDs.length; ++v){
			var viewIDA = viewIDs[v];
			var viewA = viewFromViewID(viewIDA);
			for(var u=v+1; u<viewIDs.length; ++u){
				var viewIDB = viewIDs[u];
				var viewB = viewFromViewID(viewIDB);
				var pairID = pairIDFromIDs(viewIDA,viewIDB);
				// console.log(pairID);
				var pairAB = pairFromPairID(pairID);
				// console.log(pairAB);
				pairAB["points3D"].push(worldPoint);
			}
		}
		for(var v=0; v<viewIDs.length; ++v){
			var viewID = viewIDs[v];
			var view = viewFromViewID(viewID);
			var image = view["image"];
			var imageWidth = image["width"];
			var imageHeight = image["height"];
			var hyp = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight);
			var errorAbs = hyp*errorPoints2DPercentImage;
			//console.log(hyp,errorAbs);
			var point2D = points2D[viewID];
			//console.log(point2D);
			worldPoint["sourcePoints2D"][viewID] = new V2D(point2D.x,point2D.y);
			// ADD RANDOM ERROR
			var errorX = (Math.random() - 0.5)*errorAbs;
			var errorY = (Math.random() - 0.5)*errorAbs;
			point2D.x += errorX;
			point2D.y += errorY;
		}
	}

	console.log(worldPairs);
	var minPoint3DCountPairwise = 16;
	for(var i=0; i<worldPairs.length; ++i){
		var worldPair = worldPairs[i];
		var points3D = worldPair["points3D"];
		var viewIDA = worldPair["idA"];
		var viewIDB = worldPair["idB"];
		var pairID = pairIDFromIDs(viewIDA,viewIDB);
		console.log(worldPair);
		var viewA = viewFromViewID(viewIDA);
		var viewB = viewFromViewID(viewIDB);
		// var absA = viewA["abs"];
		// var absB = viewB["abs"];
		// var extA = Matrix.inverse(absA);
		// var extB = Matrix.inverse(absB);
		var extA = viewA["abs"];
		var extB = viewB["abs"];
		var absA = Matrix.inverse(extA);
		var absB = Matrix.inverse(extB);

		var Ka = viewA["K"];
		var Kb = viewB["K"];

		var KinvA = Matrix.inverse(Ka);
		var KinvB = Matrix.inverse(Kb);
		
		console.log(absA,absB);
		console.log(extA,extB);
		console.log(KinvA,KinvB);
		//console.log(worldViewLookup);

		// var relativeAB = Matrix.relativeReference(absA,absB);
		var relativeAB = Matrix.relativeReference(extA,extB);
		console.log('relativeAB:\n'+relativeAB);
		worldPair["relAB"] = relativeAB;

		var identityAbs = new Matrix(4,4).identity();

		var Kinvs = [KinvA, KinvB];
		//var exts = [extA,extB];
		//var exts = [absA,absB]; // ????????????????


		var exts = [identityAbs,relativeAB];

		var list2D = [];

		for(var p=0; p<points3D.length; ++p){
			var point3D = points3D[p];
			var p3D = point3D["point3D"]
// console.log(p3D);
			//var points2D = point3D["points2D"]
			var points2D = point3D["sourcePoints2D"];
//console.log(points2D);
			var point2DA = points2D[viewIDA];
			var point2DB = points2D[viewIDB];
			// console.log(point2DB);
			list2D[0] = point2DA;
			list2D[1] = point2DB;
			var estimated3D = R3D.triangulatePointDLTList(list2D, exts, Kinvs, null, null);
			// console.log(estimated3D);
			// console.log(p3D);

			// apply abs to point:
			var worldPoint3D = absA.multV3DtoV3D(estimated3D);
			// console.log(worldPoint3D);
			// worldPoint3D = estimated3D;

			// add 2D error to points
			var distance = V3D.distance(worldPoint3D,p3D);
			console.log("DISTANCE: "+distance);
			// console.log(point3D);
			point3D["estimated2D"][pairID] = worldPoint3D;

		}

		throw "??????????????"
		//var points3DEstimates = [];
		if(points3D.length>minPoint3DCountPairwise){
			// F from points ?
			// R from F ?
		}
	}

// list


// compare estimated relative matrixes (pos & rot) error from actual




//var result = R3D.optimumTransform3DFromRelativePairTransforms(listPairs, undefined,   originalTransforms);
//R3D.optimumTransform3D = function(edges, maxIterations,   originalTransforms){


// do alignment algorithms
	/*
use some initial absolute location & orientation estimate for views A, B, C -- using relative matrixes
-> have an algorithm for that

use gradient descent to update 1 view matrix at a time
	list of estimated 3D points for each relative pair
		move in direction/orientation that reduces this error
*/




// show estimated final point3D locations & ground truth w/ lines diff between the 2


// 


throw "..... what"



	// display world contents
	var stage3D = new Stage3D(this._stage);
	console.log(stage3D);
this._stage3D = stage3D;



	var camera = new Cam3D();
		// camera.position( new V3D(3.0, -1.0, -4.0) );


		// camera.matrix().translate( new V3D(3.0, -1.0, -4.0) );



		// camera.matrix().translate( new V3D(0.0, 0.0, -4.0) );
	// camera.matrix().translate( new V3D(0.0, 0.0, 0.0) );


// Matrix.transform3DRotateY
	// camera.matrix().rotate( new V3D(0.0, 0.0, 0.0) );
	// camera.matrix().rotateY( Code.radians(180.0) );
	camera.matrix().rotateY( Code.radians(160.0) );   /// -z flip
	// camera.matrix().rotateY( Code.radians(10.0) );
	// camera.matrix().rotateY( Code.radians(190.0) );

	stage3D.addCamera(camera);

	//var point = new DOPoint3D();
	//console.log(point);
	//point.position( new V3D(1.0, 2.0, 3.0) );
	//stage3D.addChild(point);


	// SHOW WORLD POINTS
	for(var i=0; i<worldPoints3D.length; ++i){
		var p = worldPoints3D[i];
		// console.log(p+"?")
		var point = new DOPoint3D( p["point3D"]);
		//point.position( p["point3D"].copy() );
		// console.log(p["point3D"]);
		// console.log("point.matrix(): "+point.matrix());
		
		//point.matrix().translate( );
		point.setStyle(0x9900CC00, 0xCC00CC00, 1.0, 10.0);
		stage3D.addChild(point);
	}

	// SHOW WORLD VIEWS - point & fristrum & normal
	for(var i=0; i<worldViews.length; ++i){
		var view = worldViews[i];
		var abs = view["abs"];
		var ext = Matrix.inverse(abs);
		var origin = ext.multV3DtoV3D(new V3D(0,0,0));
		var forward = ext.multV3DtoV3D(new V3D(0,0,1));

		// CENTER
		var point = new DOPoint3D(origin);
		//point.matrix().translate( origin );
		point.setStyle(0x99CC0000, 0xFFCC0000, 1.0, 10.0);
		stage3D.addChild(point);

		// NORMAL
		var line = new DOLine3D(origin, forward);
		line.setStyle(0x99CC0000, 0xCCCC0000, 1.0, 5.0);
		stage3D.addChild(line);

		// frustrum

	}







	stage3D._update();

	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.onKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.onKeyboardDown,this);
	this._keyboard.addListeners();
	this._keyboard.addListeners();


	throw "Alignment3D.SyntheticWorld";
}

Alignment3D.prototype.onKeyboardDown = function(e){
	// console.log("onKeyboardDown");
	var keyboard = this._keyboard;
	var isShiftDown = keyboard.isKeyDown(Keyboard.KEY_SHIFT);

	var keyCode = e.keyCode;

	var moveScale = 0.1;
	//var rotateScale = Code.radians(15.0); // larger than expected
	var rotateScale = Code.radians(1.0); // larger than expected
//console.log("rotateScale: "+rotateScale);
	var stage3D = this._stage3D;
	// console.log(stage3D);

	var cam = stage3D.currentCamera();
	var matrix = cam.matrix();
	var o = matrix.origin();
	var oNeg = o.copy().scale(-1);
	var x = matrix.dirX();
	var y = matrix.dirY();
	var z = matrix.dirZ();

	if(keyCode == Keyboard.KEY_RIGHT){
		if(isShiftDown){
			matrix.translate(oNeg);
			matrix.rotateVector(y,-rotateScale);
			matrix.translate(o);
		}else{
			x.scale(moveScale);
			matrix.translate(x);
		}
	}else if(keyCode == Keyboard.KEY_LEFT){
		if(isShiftDown){
			matrix.translate(oNeg);
			matrix.rotateVector(y,rotateScale);
			matrix.translate(o);
		}else{
			x.scale(-moveScale);
			matrix.translate(x);
		}
	}else if(keyCode == Keyboard.KEY_UP){
		
		if(isShiftDown){
			matrix.rotateVector(x,-rotateScale);
		}else{
			y.scale(moveScale);
			matrix.translate(y);
		}
	}else if(keyCode == Keyboard.KEY_DOWN){
		if(isShiftDown){
			matrix.rotateVector(x,rotateScale);
		}else{
			y.scale(-moveScale);
			matrix.translate(y);
		}
	}else if(keyCode == Keyboard.KEY_COMMA){
		
		if(isShiftDown){
			matrix.translate(oNeg);
			matrix.rotateVector(z,rotateScale);
			matrix.translate(o);
		}else{
			z.scale(moveScale);
			matrix.translate(z);
		}
	}else if(keyCode == Keyboard.KEY_PERIOD){
		var z = matrix.dirZ();
		if(isShiftDown){
			matrix.translate(oNeg);
			matrix.rotateVector(z,-rotateScale);
			matrix.translate(o);
		}else{
			z.scale(-moveScale);
			matrix.translate(z);
		}
	}else if(keyCode == Keyboard.KEY_ENTER){
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



//	console.log(matrix+"");
	stage3D._update();
}













DO3D.PROPERTY_Z_INDEX = "_z";

function DO3D(){ // display
	DO3D._.constructor.call(this);
	this._id = DO._ID++;
	this._stage = null;
	this._parent = null;
	this._children = [];
	this._display = new DO();
	//this._position = new V3D();
	//this._rotation = new V4D();
	this._scale = 1.0;
	this._matrix3D = new Matrix3D();

	this.setStyle();
}
Code.inheritClass(DO3D,Dispatchable);
/*
DO3D.prototype.position = function(p){
	if(p!=null && p!=undefined){
		this._position = p;
	}
	return this._position;
}
*/
DO3D.prototype.matrix = function(){
	var m = this._matrix3D;
	// m.identity();
	// m.scale(this._scale);
	// m.rotateQuaternion(this._rotation);
	// m.translate(this._position);
	return m;
}

DO3D.prototype.update = function(){
	// setup all graphics objects
	var cs = Code.copyArray(this._children);
	for(var i=0; i<cs.length; ++i){
		var c = cs[i];
		c.update();
	}
}

DO3D.prototype.addChild = function(child){
	this._children.push(child);
}
DO3D.prototype.removeChild = function(child){
	this._children.remove(child);
}




// TODO: this will go on points only:
DO3D.prototype.setStyle = function(fColor,lColor,lThick,size){
	this._fillColor = Code.valueOrDefault(fColor, 0xFFFF0000);
	this._lineColor = Code.valueOrDefault(lColor, 0xFF0000FF);
	this._lineThickness = Code.valueOrDefault(lThick, 1.0);
	this._displaySize = Code.valueOrDefault(size, 10.0);
}









// 
// render anything needed into one or many DOs
//
DO3D.prototype.render = function(parentMatrix, stage, cam3D, listDO){
	var d = this._display;
	// project the point onto the camera plane
	var thisMatrix = this.matrix();

// console.log("parentMatrix: \n"+parentMatrix);
if(parentMatrix==null){
	parentMatrix = new Matrix3D().identity();
}
	// var childMatrix = Matrix3D.mult(parentMatrix, thisMatrix);
	// var childMatrix = Matrix3D.mult(thisMatrix, parentMatrix);
	var childMatrix = thisMatrix.copy();
// var childMatrix = new Matrix3D().identity();

	// console.log(thisMatrix);
	var camMatrix = cam3D.matrix();

	// get relative matrix
	//var relativeCameraMatrix = Matrix3D.relativeReference(camMatrix,childMatrix);

	// var invCamMatrix = camMatrix.inverse();
	var invCamMatrix = camMatrix.copy().inverse(); // TODO: have this done once before render pass

// INVERSE was calling it ON the matrix

	// console.log(invCamMatrix+"")
	//var relativeCameraMatrix = Matrix3D.mult(invCamMatrix,childMatrix);

	// var relativeCameraMatrix = camMatrix;

	// get relative points:
//	console.log(this);
//	console.log(this._position+" ?");

	// var r3D = relativeCameraMatrix.multV3DtoV3D(this._position);
	// var r3D = relativeCameraMatrix.multV3DtoV3D(new V3D());

	// add / construct params as necessary:
	this._render(childMatrix, stage, cam3D, invCamMatrix, listDO);


// console.log("childMatrix: \n"+childMatrix);

	// render children:
	var children = this._children;
	for(var i=0; i<children.length; ++i){
		var c = children[i];
		c.render(childMatrix, stage, cam3D, listDO);
	}

}

DO3D.prototype._render = function(childMatrix, stage, cam3D, invCamMatrix, listDO){
	var d = this._display;
	var origin = new V3D(0,0,0);
	var pointInWorld = childMatrix.multV3DtoV3D(origin);
	var pointInCamera = invCamMatrix.multV3DtoV3D(pointInWorld);
	pointInCamera.z = -pointInCamera.z; // flip for +x+y+z orientation
	
	var K = cam3D.K();
	var z = pointInCamera.z;
	if(z>0){ // if behind camera -> skip
		// var absZ = Math.abs(pointInCamera.z);
		// var pUse = new V2D(pointInCamera.x/absZ, pointInCamera.y/absZ);
		var pUse = new V2D(pointInCamera.x/pointInCamera.z, pointInCamera.y/pointInCamera.z);
		// project to plane
		// var p2D = K.multV2DtoV2D(pointInCamera);
		var p2D = K.multV2DtoV2D(pUse);

		// do any clipping
		// console.log(pointInWorld+" -> "+pointInCamera+" -> "+p2D+"  ");

		// d[DO3D.PROPERTY_Z_INDEX] = 0.0;
		d[DO3D.PROPERTY_Z_INDEX] = z;

		var colorFill = this._fillColor;//0xFF990000;
		var colorOutline = this._lineColor;//0xFF000000;
		var thickOutline = this._lineThickness;//1.0;
		var circleSize = this._displaySize;//10.0;

		d.graphics().clear();
		d.graphics().setFill(colorFill);
		d.graphics().setLine(thickOutline,colorOutline);
		d.graphics().beginPath();
		d.graphics().drawCircle(p2D.x,p2D.y,circleSize);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		
		listDO.push(d);
	}else{
		// console.log("Z: "+z);
	}

}




function Cam3D(){
	Cam3D._.constructor.call(this);

	this._clipZ = 0.0;

	//this._screenOrigin = new V2D(0,0); // stage center
	//this._width = 100; // stage extent
	//this._height = 100; // stage extent
	this._K = null;
	// var f = 100;
	// var w = 300;
	// var h = 200;
	// fx,  sy,  w/2
	// sx,  fy,  h/2
	//  0,   0,    1
	// this.K( new Matrix([f,0,w*0.5, 0,f, h*0.5, 0,0,1 ]) );
}
Code.inheritClass(Cam3D,DO3D);

Cam3D.prototype.K = function(K){
	if(K!=null){
		this._K = K;
	}
	return this._K;
}

Cam3D.prototype.render = function(parentMatrix, stage, cam3D, listDO){
	// Cam3D._.render.call(this, parentMatrix, stage, cam3D, listDO);
	console.log("cam render");
}


function Stage3D(stage2D){
	this._stage2D = stage2D;
	this._root = new DO3D();
	this._cameras = [];
	this._currentCameraIndex = -1;

// Stage.prototype._canvasMouseDown = function(e){
// 	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,e);
// 	this.alertAll(Canvas.EVENT_MOUSE_DOWN,e);
// }
	this._addListeners();
}
Stage3D.prototype._addListeners = function(){
	this._stage2D.addFunction(Canvas.EVENT_MOUSE_DOWN,this._onCanvasMouseDown,this);
	this._stage2D.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._onEnterFrame,this);
	

}
Stage3D.prototype._onEnterFrame = function(frame){
	// console.log(e);
//	this._update();
}
Stage3D.prototype._onCanvasMouseDown = function(e){
	console.log(e);
}


Stage3D.prototype.addCamera = function(camera){
	this._cameras.push(camera);
	this._currentCameraIndex = 0; // TODO: if < 0 ?
//	this.addChild(camera);
}


Stage3D.prototype.addChild = function(child){
	return this._root.addChild(child);
}
Stage3D.prototype.removeChild = function(child){
	return this._root.removeChild(child);
}

Stage3D.prototype.currentCamera = function(){
	var cam = this._cameras[this._currentCameraIndex];
	return cam;
}


Stage3D.prototype._update = function(){
	// position everything
	this._root.update();

	

	var cam = this.currentCamera();
	// console.log

	// var f = 10000;
	var f = 1000;
	// var f = 100;
	var w = this._stage2D.canvasWidth();
	var h = this._stage2D.canvasHeight();
//	console.log(w+" x "+h)

	// w = 0;
	// h = 0;
	// fx,   s,  w/2
	//  0,  fy,  h/2
	//  0,   0,    1
	cam.K( new Matrix(3,3, [f,0,w*0.5, 0,f, h*0.5, 0,0,1 ]) );
//	console.log( cam.K() +" ");

	//cam.render(this);

// console.log(this._root);
	var list = [];
	this._root.render(null, this, cam, list);
	list.sort(function(a,b){
		return a[DO3D.PROPERTY_Z_INDEX] < b[DO3D.PROPERTY_Z_INDEX] ? a : b;
	});
//	console.log(list);
//	console.log(this._root);
	var root2D = this._stage2D.root();

	var w = this._stage2D.canvasWidth();
	var h = this._stage2D.canvasHeight();
	root2D.matrix().identity();
	// flip y as down at center of screen
	root2D.matrix().translate(-w/2,-h/2);
	root2D.matrix().scale(1,-1);
	root2D.matrix().translate(w/2, h/2);


	// console.log("root2D.matrix(): "+root2D.matrix());

	for(var i=0; i<list.length; ++i){
		var d = list[i];
		d.removeParent();
		root2D.addChild(d);
	}

}



function DOPoint3D(point){
	DOPoint3D._.constructor.call(this);
	this._point = point.copy();

}
Code.inheritClass(DOPoint3D,DO3D);




DOPoint3D.prototype._render = function(childMatrix, stage, cam3D, invCamMatrix, listDO){
	var d = this._display;
	var pointInWorld = childMatrix.multV3DtoV3D(this._point);
	var pointInCamera = invCamMatrix.multV3DtoV3D(pointInWorld);
	pointInCamera.z = -pointInCamera.z; // flip for +x+y+z orientation
	
	var K = cam3D.K();
	var z = pointInCamera.z;
	if(z>0){ // if behind camera -> skip
		// var absZ = Math.abs(pointInCamera.z);
		// var pUse = new V2D(pointInCamera.x/absZ, pointInCamera.y/absZ);
		var pUse = new V2D(pointInCamera.x/pointInCamera.z, pointInCamera.y/pointInCamera.z);
		// project to plane
		// var p2D = K.multV2DtoV2D(pointInCamera);
		var p2D = K.multV2DtoV2D(pUse);

		// do any clipping
		// console.log(pointInWorld+" -> "+pointInCamera+" -> "+p2D+"  ");

		// d[DO3D.PROPERTY_Z_INDEX] = 0.0;
		d[DO3D.PROPERTY_Z_INDEX] = z;

		var colorFill = this._fillColor;//0xFF990000;
		var colorOutline = this._lineColor;//0xFF000000;
		var thickOutline = this._lineThickness;//1.0;
		var circleSize = this._displaySize;//10.0;

		d.graphics().clear();
		d.graphics().setFill(colorFill);
		d.graphics().setLine(thickOutline,colorOutline);
		d.graphics().beginPath();
		d.graphics().drawCircle(p2D.x,p2D.y,circleSize);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		
		listDO.push(d);
	}else{
		// console.log("Z: "+z);
	}

}





function DOLine3D(pointA, pointB){
	DOLine3D._.constructor.call(this);
	this._pointA = pointA.copy();
	this._pointB = pointB.copy();
	// this matrix move to A or average or other
}
Code.inheritClass(DOLine3D,DO3D);



// 
// render anything needed into one or many DOs
//
DOLine3D.prototype._render = function(childMatrix, stage, cam3D, invCamMatrix, listDO){
	var d = this._display;
	//var origin = new V3D(0,0,0);
	var pointA = childMatrix.multV3DtoV3D(this._pointA);
		pointA = invCamMatrix.multV3DtoV3D(pointA);
		pointA.z = -pointA.z; // flip for +x+y+z orientation
	var pointB = childMatrix.multV3DtoV3D(this._pointB);
		pointB = invCamMatrix.multV3DtoV3D(pointB);
		pointB.z = -pointB.z; // flip for +x+y+z orientation
	//console.log(pointA);
	//console.log(pointB);
	var K = cam3D.K();
	if(pointA.z>0 && pointB.z>0){ // if behind camera -> skip
		// project to plane
		var p2DA = new V2D(pointA.x/pointA.z, pointA.y/pointA.z);
			p2DA = K.multV2DtoV2D(p2DA);
		var p2DB = new V2D(pointB.x/pointB.z, pointB.y/pointB.z);
			p2DB = K.multV2DtoV2D(p2DB);
		// do any clipping
		d[DO3D.PROPERTY_Z_INDEX] = (p2DA.z+p2DB.z)*0.5;

		var colorFill = this._fillColor;
		var colorOutline = this._lineColor;
		var thickOutline = this._lineThickness;
		var circleSize = this._displaySize;

		d.graphics().clear();
		// d.graphics().setFill(colorFill);
		d.graphics().setLine(thickOutline,colorOutline);
		d.graphics().beginPath();
		d.graphics().moveTo(p2DA.x,p2DA.y);
		d.graphics().lineTo(p2DB.x,p2DB.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		// d.graphics().fill();
		
		listDO.push(d);
	}else{
		// console.log("Z: "+z);
	}

}


function DOTri3D(){

}

function DOMesh3D(){

}


function DOTexTri3D(){

}

function DOTexMesh3D(){

}








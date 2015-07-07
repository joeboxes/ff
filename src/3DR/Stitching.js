// Stitching.js

function Stitching(){
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
	//
	var imageList, imageLoader;
	// import image to work with
	imageList = ["snow1.png","snow2.png"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}
Stitching.prototype.handleSceneImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
var featurePoints = [];
var features = [];
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		list[i] = img;
		d = new DOImage(img);
		this._root.addChild(d);
		d.moveToBack();
		d.enableDragging();
		d.matrix().identity();
		d.matrix().translate(x,y);
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		var imageMat = this._stage.getImageAsFloatGray(img);
		var points = R3D.pointsCornerDetector(imageMat.gray, imageMat.width,imageMat.height);
		var fxn = function(a,b){
			if(b.z>a.z){
				return 1;
			}else if(b.z<a.z){
				return -1;
			}
			return 0;
		}
		points = points.sort( fxn );

		Code.truncateArray(points,30);
			// var gray = this._stage.getFloatGrayAsImage(points, imageMat.width,imageMat.height, null);
			// d = new DOImage(gray);
			// d.matrix().identity().translate(x,gray.height);
			// this._root.addChild(d);
			for(j=0;j<points.length;++j){
				//console.log(points[j].z);
				var point = points[j];
				var r = 0xFF;
				var g = 0x00;
				var b = 0x00;
				var size = 1 + points[j].z*100000.0;
				var pnt = R3D.drawPointAt(point.x,point.y, r,g,b, size);
				d.addChild(pnt);
				var winSize = 25;
				var sigma = null;//1.6;
				var scale = 0.50;
				var px = point.x;
				var py = point.y;
				var matrix = new Matrix(3,3).identity();
				var win = ImageMat.extractRectFromFloatImage(px,py,scale,sigma, winSize,winSize, imageMat.gray,imageMat.width,imageMat.height, matrix);
					var obj = R3D.gradientDirection(win,winSize,winSize);
					var primaryAngle = obj.angle;
					matrix = Matrix.transform2DRotate( new Matrix(3,3).identity(), -primaryAngle);
					win = ImageMat.extractRectFromFloatImage(px,py,scale,sigma, winSize,winSize, imageMat.gray,imageMat.width,imageMat.height, matrix);
// ORIENTATE IMAGE ST PRIMARY GRADIENT DIRECTION IS HORIZONTAL IN +X
				var feature = {center:point,image:win,matches:[]};
					var iii = this._stage.getFloatGrayAsImage(win, winSize,winSize, null);
					var e = new DOImage(iii);
					//e.matrix().identity().translate(Math.random()*400,Math.random()*100);
					e.matrix().identity().translate(j*winSize,i*winSize);
					this._root.addChild(e);
				points[j] = feature;
			}
features.push(points);
		x += img.width;
		y += 0;
	}
	// find best matches in featuresA / B
	//for(j=0;j<features.length;++j){
		//var list = features[j];
		var featureA, featureB;
		var listA = features[0];
		var listB = features[1];
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			for(j=0;j<listB.length;++j){
				featureB = listB[j];
				var ssd = Code.SSDEqual(featureA.image, featureB.image);
				featureA.matches.push({feature:featureB, score:ssd});
				featureB.matches.push({feature:featureA, score:ssd});
			}
			//console.log("feat: "+feature.center);
		}
		// sort matches by lowest score
		var sortScore = function(a,b){
			if(b.score<a.score){
				return 1;
			}else if(b.score>a.score){
				return -1;
			}
			return 0;
		}
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			featureA.matches.sort(sortScore);
		}
		for(i=0;i<listB.length;++i){
			featureB = listB[i];
			featureB.matches.sort(sortScore);
		}
var matches = [];
		// matches are valid of they are both at top
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			featureB = featureA.matches[0].feature;
			featureC = featureB.matches[0].feature;
			if(featureA==featureC){
				var e = new DO();
				e.graphics().setLine(1.0,0xFF0000FF);
				e.graphics().beginPath();
				e.graphics().moveTo(featureA.center.x,featureA.center.y);
				e.graphics().lineTo(featureB.center.x+400,featureB.center.y);
				e.graphics().endPath();
				e.graphics().strokeLine();
				this._root.addChild(e);
				size = 15;
				r = 0x00;
				g = 0x00;
				b = 0xFF;
				pnt = R3D.drawPointAt(featureA.center.x,featureA.center.y, r,g,b, size);
				this._root.addChild(pnt);
				pnt = R3D.drawPointAt(featureB.center.x+400,featureB.center.y, r,g,b, size);
				this._root.addChild(pnt);
				matches.push({A:featureA.center.copy(), B:featureA.center.copy()});
			}
		}
		// 
console.log("matches: "+matches.length);
// sareching for best fit homography: H = [a b c; d e f; g h i]
	// RANSAC matches
	for(j=0;j<maxIterations;++j){
		//
	}
	/*
	var index, support, consensus, dist, org=new V2D(), dir=new V2D();
	len = points.length;
	var maxSupport = 0;
	var maxConsensus = null;
	var maxModel = null;
	A = new Matrix(minCount,3);
	for(j=0;j<maxIterations;++j){
		var pts = [];
		var indexList = [];
		for(i=0;i<len;++i){ indexList[i] = i; }
		for(i=0;i<minCount;++i){
			index = Math.floor(Math.random()*indexList.length);
			index = indexList.splice(index,1);
			pts.push( points[ index ] );
		}
		// line fitting
		for(i=0;i<minCount;++i){
			p = pts[i];
			A.set(i,0, p.x);
			A.set(i,1, 1.0);
			A.set(i,2, -p.y);
		}
		svd = Matrix.SVD(A);
		coeff = svd.V.colToArray(2);
		m = coeff[0];
		b = coeff[1];
		y = coeff[2]; // deviates from 1
		m /= y;
		b /= y;
		//L = new Matrix(1,2).setFromArray([m,b]);
		// find consensus set
		consensus = [];
// sum distances and rate based on inverse of average/total distance?
		org.set(0,b)
		dir.set(1,m); // 1-0,m+b-b
dir.scale(10.0);
d = new DO();
d.graphics().clear();
d.graphics().setLine(2.0,0xFF00FF00);
d.graphics().beginPath();
x = org.x; y = org.y;
d.graphics().moveTo(scale*x + offX, -scale*y + offY);
x = org.x + dir.x; y = org.y + dir.y;
d.graphics().lineTo(scale*x + offX, -scale*y + offY);
d.graphics().endPath();
d.graphics().strokeLine();
d.graphics().fill();
this._root.addChild(d);
		for(i=0;i<len;++i){
			p = points[i];
			dist = Code.distancePointLine2D(org,dir, p);
			if(dist <= maxLineDistance){
				consensus.push(p);
			}
		}
// SHOULD ALWAYS HAVE A MINIMUM OF 2
		console.log(consensus.length);
		// save consensus
		if(consensus.length>maxSupport){
			maxSupport = consensus.length;
			maxConsensus = consensus;
			maxModel = [m,b];
			// update max iterations based on known min inliers
			var pInlier = maxSupport*1.0/len;
var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log( 1 - Math.pow(pInlier,minCount) )); 
			console.log("NEW MAX: "+maxIterations);
		}

	}
	// get best model/consensus/support
	consensus = maxConsensus;
	support = maxSupport;
	m = maxModel[0];
	b = maxModel[1];
	console.log("CONSENSUS: "+support+" := "+m+" x + "+b);
	console.log(""+consensus);
	// further improve model by incorporating more inliers progressivley
		A = new Matrix(consensus.length,3);
		for(i=0;i<consensus.length;++i){
			p = consensus[i];
			A.set(i,0, p.x);
			A.set(i,1, 1.0);
			A.set(i,2, -p.y);
		}
		svd = Matrix.SVD(A);
		coeff = svd.V.colToArray(2);
		m = coeff[0];
		b = coeff[1];
		y = coeff[2]; // deviates from 1
		m /= y;
		b /= y;
		// go thru and see if there are any more inliers
		// iterate
		// use maximum set (for iteration)
	// show line
	d = new DO();
	d.graphics().clear();
	d.graphics().setFill(0xFF000000);
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().beginPath();
	x = 0.0; y = m*x + b;
	d.graphics().moveTo(scale*x + offX, -scale*y + offY);
	x = 10.0; y = m*x + b;
	d.graphics().lineTo(scale*x + offX, -scale*y + offY);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.graphics().fill();
	this._root.addChild(d);
	console.log(".........");
	*/


	//}
	// show matches in display
}
Stitching.prototype.combineTriangles = function(){
	var triList = this._tris;
	var imgList = this._imgs;
	console.log(triList);
	console.log(imgList);
}
Stitching.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}
Stitching.prototype.handleMouseClickFxn = function(e){
	console.log(e.x%400,e.y)
}




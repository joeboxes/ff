// Triangulate.js

function Triangulate(){
	this.handleLoaded();
}
Triangulate.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this.setupData();
	this.addListeners();
	// this.doTriangulation();
	// this._refreshDisplay();

	// this.doBeaconStuff();
	this.doUWBStuff();


}
Triangulate.prototype.addListeners = function(){
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrameFxn,this);
	this._stage.start();
}
Triangulate.prototype._refreshDisplay = function(){
	var i, beacon, beacons=this._beacons, phone=this._phone, calculated = this._phoneCalculated;
	this._displayScale = 100.0;
	this._root.graphics().clear();
this._displayScale = 30.0;
this._doX = 300;
this._doY = -300;
	for(i=0; i<beacons.length; ++i){
		beacon = beacons[i];
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x99FF0000,0xFFFF0000, 3.0);
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x11FF00FF,0x99FF00FF, V2D.distance(beacon.location,phone.location)*this._displayScale );
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x1199CC00,0x9966CC00, beacon.distance*this._displayScale );
		//this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x1199CC00,0x9966CC00, beacon.testDistance*this._displayScale );
	}
	this.drawDot( V2D.add(V2D.scale(phone.location,this._displayScale), new V2D(this._doX,this._doY)), 0xFF0000FF,0xFF000099, 5.0);
	this.drawDot( V2D.add(V2D.scale(calculated.location,this._displayScale), new V2D(this._doX,this._doY)), 0x9900FF00,0xCC009900, 3.0);

}


/*
want a position in 3D space = 3 unknowns
minimum 4 anchors
	- known position
	- distance estimate w/ static or dynamic error

*/
Triangulate.prototype.doUWBStuff = function(){
	console.log("doUWBStuff");
	//
	//var errorStatic = 0.1;
	//var errorPower = 0.0;
	// var errorDistance = 0.0; // percent error
	var errorDistanceRelative = 0.1; // percent error scaled with distance
	var errorDistanceStatic = 0.1; // error static
	var maximumRange = 1E9;
	var anchors = [];
		anchors.push( new Tri.AnchorUWB(new V3D(0,0,0), errorDistanceRelative, errorDistanceStatic) );
		anchors.push( new Tri.AnchorUWB(new V3D(1,0,0), errorDistanceRelative, errorDistanceStatic) );
		anchors.push( new Tri.AnchorUWB(new V3D(1,0,1), errorDistanceRelative, errorDistanceStatic) );
		anchors.push( new Tri.AnchorUWB(new V3D(0,1,1), errorDistanceRelative, errorDistanceStatic) );

	var tag = new Tri.TagUWB();
	//tag.knownLocation(new V3D(2.0,0.1,0.25));
	tag.knownLocation(new V3D(0.5, 0.1, 0.25));
	var tags = [tag];




	
	var display = new DO();
	this._root.addChild(display);
	display.matrix().scale(1,-1);
	display.matrix().translate(200,400);

	

this._uwbTags = tags;
this._uwbAnchors = anchors;
this._uwbDisplay = display;



	this.iterateUWBStuff();
	this.drawUWBStuff();

}
Triangulate.prototype.iterateUWBStuff = function(){
var tags = this._uwbTags;
var anchors = this._uwbAnchors;
var display = this._uwbDisplay;
var tag = tags[0];
	var timestamp = Code.getTimeMilliseconds();
	// console.log("iterateUWBStuff"+tag.knownLocation()+" "+timestamp+"")
	
	// console.log();
	
	this.singleTimeDataSample(tags, anchors, timestamp);
	// }
	this.solveSingleTagPosition(tags, anchors, timestamp);
}

Triangulate.prototype.drawUWBStuff = function(){
var tags = this._uwbTags;
var anchors = this._uwbAnchors;
var display = this._uwbDisplay;
var tag = tags[0];
// console.log(tag);

var displayScale = 200;


//display.matrix().scale(displayScale,displayScale);
display.graphics().clear();

	// show anchors
var lin = null;
var col = null;
var rad = null;
for(var i=0; i<anchors.length; ++i){
	var anchor = anchors[i];

	// TODO: visualize  distance errors

	/*
	var filter = tag._samples.filterForAnchor(anchor);
	if(filter){
		var samples = filter._samples;
		for(var i=0; i<samples.length; ++i){
			var sample = samples[i];
			var distance = sample._distance;
			var actualDistance = ;
		}
	}
	*/


	var a = anchor.location();
	a = a.copy();
	a.scale(displayScale);
	display.graphics().setLine(1.0,lin?lin:0xFFFF0000);
	display.graphics().setFill(col?col:0x99FF0000);
	display.graphics().beginPath();
	display.graphics().drawCircle(a.x,a.z, 5.0);
	display.graphics().endPath();
	display.graphics().fill();
	display.graphics().strokeLine();
}

	// show tag
//for(var i=0; i<tags.length; ++i){
//	var tag = tags[i];
	var a = tag.estimatedLocation();
if(a){
	a = a.copy();
	a.scale(displayScale);
	display.graphics().setLine(1.0,lin?lin:0xFF0000FF);
	display.graphics().setFill(col?col:0x990000FF);
	display.graphics().beginPath();
	display.graphics().drawCircle(a.x,a.z, 5.0);
	display.graphics().endPath();
	display.graphics().fill();
	display.graphics().strokeLine();
}
if(a){
	var a = tag.knownLocation();
	a = a.copy();
	a.scale(displayScale);
	display.graphics().setLine(1.0,lin?lin:0xCC00CCCC);
	display.graphics().setFill(col?col:0x66009999);
	display.graphics().beginPath();
	display.graphics().drawCircle(a.x,a.z, 10.0);
	display.graphics().endPath();
	display.graphics().fill();
	display.graphics().strokeLine();
}
	//var pos = tag.estimatedLocation();



}

Triangulate.prototype.singleTimeDataSample = function(tags, anchors, timestamp){
	for(var j=0; j<tags.length; ++j){
		var tag = tags[j];
		// simulate estimate location ping
		for (var i=0; i<anchors.length; ++i) {
			var anchor = anchors[i];
			var sample = anchor.sampleForTag(tag, timestamp);
			if(sample){
				anchor.addSample(sample);
				tag.addSample(sample);
			}
		}
	}

}

Triangulate.prototype.solveSingleTagPosition = function(tags){
	// console.log(tags);
	for(var j=0; j<tags.length; ++j){
		var tag = tags[j];
// console.log(tag);
		var dataLocations = [];
		var dataDistances = [];
		var dataTimestamps = [];
		//var anchors = tag.getActiveAnchors();
		var anchors = tag.activeAnchors();

// // console.log(anchors);
// 		for (var i=0; i<anchors.length; ++i) {
// 			var anchor = anchors[i];
// 			var anchorLocation = anchor.location();
// 			var distanceInfo = tag.anchorDistance(anchor);
// 			//console.log(distanceInfo);
// 			var distance = distanceInfo["distance"];

// 			var timestampInfo = tag.anchorTimestamp(anchor);
// 			var timestamp = timestampInfo["timestamp"];
// 			dataTimestamps.push(timestamp);
// 			/*
// 			var distance = V3D.distance(tagLocation,anchorLocation);
// 			var errorDistance = anchor.distanceError();
// 			var error = (Math.random()*2.0) - 1.0; // [0,1] to [-1,1];
// 			var estimatedDistance = Math.max(distance + distance*errorDistance, 0);
// 			console.log("distance: "+distance+" +/- "+errorDistance+" => "+estimatedDistance);
// 			*/
// 			dataLocations.push(anchorLocation);
// 			dataDistances.push(distance);
// 		}
		

		// check validity of anchor distance estimation:
		// keep a list of samples
		// throw out samples that are obviously too far away, eg: +100m (device or practical limits) [50-200m are some typical device limits]
		// keep an estimate of error = last N samples stddev
		// use an average of distance
		// if a LOT of values are continuously thrown away => reconsider a new location as the estimate
		// - may need to keep a list of throw away values to see if a 'new location' estimate is better?

		// TODO: the locations should be converted to a 0 mean, ~1.414 std-dev size arrangement


		tag.updateLocationEstimate();

		/*
		console.log(dataLocations)
		console.log(dataDistances)
		var position = Triangulate.solveUWBLinear(dataLocations, dataDistances);
		
		var pos = position["position"];
		console.log(pos);

		// TODO: filtering on bad pos, don't proceed to nonlinear step

		// tag.location(pos);

		var targetLocation = tag.location();
		var result = Triangulate.solveUWBNonLinear(targetLocation, dataLocations);
		// console.log(position);
		var pos = position["position"];
		console.log(pos);

		*/

		//tag.addPositionEstimate(pos, anchors, dataDistances, dataTimestamps);

		
		//tag.addPositionEstimate(pos, timestamp);


		// var pos = tag.estimatedLocation();
		// console.log(pos);
	}




	// check validity of a new position:
	// if way outside anchor range (eg anchor spherical volume + max(2 times the range, some limit like 100 meters))
	// if have a stable error value, can use this to further limit bad estimates

	// move position arount nonlinearly, starting movement = 



	// if sampling rate is much higher than object movement, can take some averages to find even better average location
	// 


	// can get an error estimate in location by some previous sample stddev
}

/*
equation for each anchor:
	d(pA, p)

	known: anchor locations
	known: distance
	unknown: tag location
*/
Triangulate.solveUWBLinear = function(locations, distances, errors){
	// rows = 
	// 		A) A-B, A-C, A-D,  B-C, B-D, C-D
	// 		B) A-
	var rows = locations.length-1;
	var cols = 3;

	var A = new Matrix(rows, cols);
	var B = new Matrix(rows, 1);

	var A2 = new Matrix(rows, 4);
	for(var i=0; i<rows; ++i){
		var a0 = locations[0];
		var d0 = distances[0];
		var ai = locations[i+1];
		var di = distances[i+1];

		k0 = a0.x*a0.x + a0.y*a0.y + a0.z*a0.z;
		ki = ai.x*ai.x + ai.y*ai.y + ai.z*ai.z;

		xValue = (ai.x-a0.x)*2;
		yValue = (ai.y-a0.y)*2;
		zValue = (ai.z-a0.z)*2;
		dValue = (d0*d0) - (di*di) - k0 + ki;

		A.set(i, 0, xValue ); // X
		A.set(i, 1, yValue ); // Y
		A.set(i, 2, zValue ); // Z
		B.set(i, 0, dValue ); // D


		A2.set(i, 0, xValue ); // X
		A2.set(i, 1, yValue ); // Y
		A2.set(i, 2, zValue ); // Z
		A2.set(i, 3, -dValue); // D
	}
//	console.log("A:\n"+A+"");
//	console.log("B:\n"+B+"");



	//var c = Matrix.solve(A,B);
	//console.log(c+"");



	//var pInv = Matrix.pseudoInverse(A);


	//var aInv = Matrix.inverse(A);



/*
	var pInv = Matrix.pseudoInverse(A);
	// console.log("pInv 1:\n"+pInv+"");
		//pInv = Matrix.transpose(pInv);
	// console.log("pInv 2:\n"+pInv+"");
	var c = Matrix.mult(pInv,B);
	console.log(c+"");
	var arr = [];
	c.toArray(arr);
*/

	/*
	var pInv = Matrix.pseudoInverseSimple(A);
	console.log("pInv:\n"+pInv+"");
	var c = Matrix.mult(pInv,B);
	console.log(c+"");
	var arr = [];
	c.toArray(arr);
	*/

	//var pInv = Matrix.pseudoInverse(A);


	/*
	var inv = Matrix.pseudoInverse(A);
	var x = Matrix.mult(inv,B);
	console.log("X: \n"+x+"");
	*/


	var At = Matrix.transpose(A);
	var AA = Matrix.mult(At,A);
	var AAinv = Matrix.inverse(AA);
	// console.log("AAinv:"+AAinv+"");
	var AB = Matrix.mult(At,B);
	// console.log("AB:"+AB+"");
	var c = Matrix.mult(AAinv,AB);
	//var c = Matrix.mult(pInv,AB);
	// console.log(c+"");
	var arr = [];
	c.toArray(arr);
	// console.log(arr+"");

	// var svd = Matrix.SVD(A);

	// console.log("A2:\n"+A2+"");
	var svd = Matrix.SVD(A2);
	// console.log("svd.V:\n"+svd.V+"");
	coeff = svd.V.colToArray(3);
	// console.log("coeff:\n"+coeff+"");
	for(i=0;i<coeff.length;++i){
		coeff[i] = coeff[i]/coeff[coeff.length-1];
	}
	// console.log("coeff:\n"+coeff+"");

	var position = new V3D(coeff[0],coeff[1],coeff[2]);
	return {"position":position};

}

Triangulate.solveUWBNonLinear = function(targetLocation, anchorLocations, anchorDistances, errors){
	var xVals = [targetLocation.x, targetLocation.y, targetLocation.z];
	// console.log(xVals+"");
	// console.log(anchorLocations+"");
	var args = [anchorLocations, anchorDistances];
	var maxIterations = 100;
	var maxError = 1E-9; // 1E-9 meters ~ 1 nano meter
	// TODO: this could be based on the anchor area
	var result = Code.gradientDescent(Triangulate._solveUWBNonLinear_gd, args, xVals, null, maxIterations, maxError);
	//console.log(result);
	// console.log(result);
	var x = result["x"];
	var pos = new V3D(x[0],x[1],x[2]);
/*
	var distances = [];
	for(var i=0; i<anchorLocations.length; ++i){
		var distance = V3D.distance(anchorLocations[i], pos);
		distances.push(distance);
	}
	var avg = ;
	var sigma = 
*/
	return {"position":pos};

}

Triangulate._solveUWBNonLinear_gd = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	// console.log(args, x, isUpdate);
	var source = new V3D(x[0],x[1],x[2]);
	var knownLocations = args[0];
	var anchorDistances = args[1];
	var totalError = 0;
	for(var i=0; i<knownLocations.length; ++i){
		var location = knownLocations[i];
		var distance = anchorDistances[i];
		var newDistance = V3D.distance(source, location);
		var error = Math.abs(distance - newDistance);
		totalError += error;
	}
	totalError /= knownLocations.length;
	return totalError;
}
// 	if(isUpdate){
// 		var Ffwd = new Matrix(3,3).fromArray(x);
// 		Ffwd = R3D.forceRank2F(Ffwd);
// 		Code.copyArray(x,Ffwd.toArray());
// 		return;
// 	}
// 	var pointsA = args[0];
// 	var pointsB = args[1];

// 	var i, len = pointsA.length;
// 	var pointA, pointB, lineA=new V3D(), lineB=new V3D();
// 	var Frev = R3D._gdFun_B, Ffwd = R3D._gdFun_A;
// 	var orgA = new V2D(), orgB = new V2D(), dirA = new V2D(), dirB = new V2D();
// 	Ffwd.fromArray(x);
// 	Ffwd = R3D.forceRank2F(Ffwd);
// 	Matrix.transpose(Frev, Ffwd);

// 	var errorA = 0;
// 	var errorB = 0;
// var pntA = new V3D();
// var pntB = new V3D();
// 	for(i=0;i<len;++i){
// 		pointA = pointsA[i];
// 		pointB = pointsB[i];
// pntA.set(pointA.x,pointA.y,1.0);
// pntB.set(pointB.x,pointB.y,1.0);
// pointA = pntA;
// pointB = pntB;
// 		Ffwd.multV3DtoV3D(lineA, pointA);
// 		Frev.multV3DtoV3D(lineB, pointB);
// 		Code.lineOriginAndDirection2DFromEquation(orgA,dirA, lineA.x,lineA.y,lineA.z);
// 		Code.lineOriginAndDirection2DFromEquation(orgB,dirB, lineB.x,lineB.y,lineB.z);
// 		onA = Code.closestPointLine2D(orgA,dirA, pointB);
// 		onB = Code.closestPointLine2D(orgB,dirB, pointA);
// 		// var distA = V2D.distance(onB,pointA);
// 		// var distB = V2D.distance(onA,pointB);
// 		// errorA += distA*distA;
// 		// errorB += distB*distB;
// 		var distA = V2D.distanceSquare(onB,pointA);
// 		var distB = V2D.distanceSquare(onA,pointB);
// 		errorA += distA;
// 		errorB += distB;
// 	}
// 	var error = errorA + errorB;
// 	if(descriptive===true){
// 		return {"error":error, "A":errorA, "B":errorB}
// 	}



Triangulate.prototype.doBeaconStuff = function(){
	console.log("doBeaconStuff");
	var errorStatic = 0.1;
	var errorPower = 0.0;
	var errorDistance = 0.0;
	var maximumRange = 1E9;
	var beacons = [];
		beacons.push( new Tri.Beacon(new V3D(0,0,0), 3, maximumRange, errorStatic, 0, 0) );
		beacons.push( new Tri.Beacon(new V3D(1,0,0), 4, maximumRange, errorStatic, 0, 0) );
		beacons.push( new Tri.Beacon(new V3D(0.75,0.75,0), 5, maximumRange, errorStatic, 0, 0) );

	var daq = new Tri.DAQ(beacons);
	var model = new Tri.Estimate();
	var phone = new Tri.Target(daq);

	console.log(beacons);
	var samples;

	// calibrate:
	phone.location().set(0.5,0.5,0);
	phone.recordAvailableSamples();

	phone.location().set(0.5,1.5,0);
	phone.recordAvailableSamples();

	phone.location().set(1.5,0.5,0);
	phone.recordAvailableSamples();

	phone.location().set(1.5,1.5,0);
	phone.recordAvailableSamples();

	phone.location().set(-1,-1,0);
	phone.recordAvailableSamples();

	phone.location().set(1.0,1.0,0);
	phone.recordAvailableSamples();


/*
	// journey
	phone.location().set(0.25,0.5,0);

	phone.recordAvailableSamples();

	phone.move(new V3D(0.25,0.0,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.05,0.10,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(-0.05,0.10,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.15,0.05,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.0,-0.25,0.0));
	phone.recordAvailableSamples();

	// ... down

	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();


	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();
*/

	console.log(phone);


	var what = phone.solveWorldCalibration();
	console.log(what);
	throw "A";

	var what = phone.solvePower();
	console.log(what);
	throw "B";

//	var samples = phone.getAvailableSamples();
//	model.addGroupedSamples(samples);




/*
	var samples = [];

		// var location = new V3D(0.25,0.25,0);
		var location = new V3D(0.25,0.25,0);
	// Tri.Beacon.prototype.sample = function(position){
	// 	var distance = V3D.distance(this._location,position);
	for(var i=0; i<sources.length; ++i){
		var source = sources[i];
		samples.push( source.sample(location) );
	}
	console.log(sources);
	console.log(samples);

	// find power somehow ???


		// ???
		var pA = 1;
		var pB = 1;

	//
	var sA = samples[0];
	var sB = samples[1];
	var dAS = Math.sqrt(pA/sA);
	var dBS = Math.sqrt(pA/sA);

	var xS = (dAS*dAS - sBS*dBS + 1)*0.5;
	var yS = Math.sqrt(dAS*dAS - xS*xS);
	console.log(yS);
	var yS = Math.sqrt(dBS*dBS - Math.pow(1-xS,2));
	console.log(yS);


		// sources.push( new Tri.Source2D( new V2D(0,0), 3 ) );
		// sources.push( new Tri.Source2D( new V2D(3,1), 4 ) );
*/
}


Triangulate.prototype.doTriangulation = function(){
	if(!this._phone){
		this._phone = { location:new V3D(6.5,1.5,0) };
		this._phoneCalculated = { location:new V3D() }
		this._beacons = 	[

					{"id":0, location:new V3D(1,1,0)},
					{"id":1, location:new V3D(2,1,0)},
					{"id":2, location:new V3D(1,3,0)},
					{"id":3, location:new V3D(6,2,0)},
					{"id":4, location:new V3D(8,2,0)},
					{"id":5, location:new V3D(7,1,0)},

					/*
					{"id":6, location:new V2D(6.5,1.5)},
					{"id":7, location:new V2D(7.5,1)},
					{"id":8, location:new V2D(6.5,2.5)},
					*/
					// {"id":0, location:new V3D(0,0,0),   testDistance:2.4},
					// {"id":1, location:new V3D(0,2.1336,0),   testDistance:3.00},
					// {"id":2, location:new V3D(-2.4384,2.1336,0),   testDistance:5.20},
				];
		this._errorDistance = 0.0;
	}
	beacons = this._beacons;
	phone = this._phone;
	// 2D triangulation from distances
	var i, j, temp, len, num, beacons, beacon, beaconA, beaconB, phone;
	var beaconCount = beacons.length;
	// determine sensor distances
	for(i=0;i<beaconCount;++i){
		beacon = beacons[i];
		num = V2D.distance(beacon.location, phone.location)
		beacon.distance = num + (this._errorDistance*Math.random()-this._errorDistance*0.5)*num; // distance + random*distance
		beacon.weight = beacon.distance>1E-6?(1/(Math.pow(beacon.distance,2))):1.0;
		console.log(beacon.weight)
	}
	// construct least squares matrix
	var A, B, X;
	var rows = beaconCount; // -1;
	var cols = 4; // 2
	A = new Matrix(rows,cols);
	B = new Matrix(rows,1);

	for(j=0; j<rows; ++j){
		beaconA = beacons[j];
		beaconB = beacons[(j+1)%beaconCount];
		var locA = beaconA.location;
		var locB = beaconB.location;
		var disA = beaconA.distance;
		var disB = beaconB.distance;
// disA = beaconA.testDistance;
// disB = beaconB.testDistance;
		var wei = beaconA.weight*beaconB.weight;
		wei = 1.0;
//console.log("BEACON: "+j+": "+locA.toString()+"  @ "+disA);
		A.set(j,0, wei*2.0*(locA.x-locB.x) );
		A.set(j,1, wei*2.0*(locA.y-locB.y) );
		A.set(j,2, wei*2.0*(locA.z-locB.z) );
		A.set(j,3, wei*(locB.x*locB.x + locB.y*locB.y + locB.z*locB.z - locA.x*locA.x - locA.y*locA.y - locA.z*locA.z - disB*disB + disA*disA) );
		// A.set(j,0, wei*2.0*(locB.x-locA.x) );
		// A.set(j,1, wei*2.0*(locB.y-locA.y) );
		// B.set(j,0, wei*(-locA.x*locA.x - locA.y*locA.y + locB.x*locB.x + locB.y*locB.y + disA*disA - disB*disB ) );
		// A.set(j,0, wei*2.0*(locA.x-locB.x) );
		// A.set(j,1, wei*2.0*(locA.y-locB.y) );
		// B.set(j,0, wei*(locA.x*locA.x + locA.y*locA.y - locB.x*locB.x - locB.y*locB.y - disA*disA + disB*disB ) );
	}
// AX = b :   A) solve Ax=0  B) x = V * diag(1/sigma_i...[0]) * (trans(U)*b)
	var svd = Matrix.SVD(A);
/*
2014-10-04 21:42:08.442 BeaconLocate[16018:1726584] BEACON: 0: 0.000000,0.000000,0.000000  @ 2.902069
2014-10-04 21:42:08.443 BeaconLocate[16018:1726584] BEACON: 1: 0.000000,2.133600,0.000000  @ 4.453875
2014-10-04 21:42:08.444 BeaconLocate[16018:1726584] BEACON: 2: -2.438400,2.133600,0.000000  @ 6.233386
2014-10-04 21:42:08.445 BeaconLocate[16018:1726584] matrixA:
2014-10-04 21:42:08.446 BeaconLocate[16018:1726584]  0.000000 4.267200 0.000000 6.862753
2014-10-04 21:42:08.447 BeaconLocate[16018:1726584]  -4.876800 0.000000 0.000000 13.072306
2014-10-04 21:42:08.447 BeaconLocate[16018:1726584]  4.876800 -4.267200 0.000000 -19.935059
2014-10-04 21:42:08.448 BeaconLocate[16018:1726584] matrixVt:
2014-10-04 21:42:08.448 BeaconLocate[16018:1726584]  0.248683 -0.177566 0.000000 -0.952170
2014-10-04 21:42:08.449 BeaconLocate[16018:1726584]  -0.520686 -0.853434 0.000000 0.023163
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584]  0.816727 -0.490021 0.000000 0.304691
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584]  0.000000 0.000000 1.000000 0.000000
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584] POS: 2.680509,-1.608257,0.000000
*/
	// var U = svd.U;
	// var S = svd.S;
	// var Vt = svd.V;
	// var Ut = Matrix.transpose(U);
	// var V = Matrix.transpose(Vt);
	// var Ss = S.copy();
	// len = Math.min( S.rows(), S.cols() );
	// for(i=0;i<len;++i){
	// 	num = Ss.get(i,i);
	// 	if(num!=0){ num = 1/num; }
	// 	Ss.set(i,i,num);
	// }
//X = new Matrix(cols,1).fromArray( svd.V.colToArray(2) );
// temp = Matrix.mult(Ut,B);
// temp = Matrix.mult(Ss,temp);
// temp = Matrix.mult(V,temp);
// temp = Matrix.mult(V,Ss);
// temp = Matrix.mult(temp,Ut);
// temp = Matrix.mult(temp,B);

// var X = temp;
// console.log( X.toString() );
// coeff = X.colToArray(0);
	// console.log( " * * * * * * * " );
	// console.log( U.toString() );
	// console.log( Ut.toString() );
	// console.log( "..." );
	// console.log( V.toString() );
	// console.log( Vt.toString() );
	// console.log( "..." );
	// console.log( S.toString() );
	// console.log( Ss.toString() );
	// console.log( " - - - " );
	coeff = svd.V.colToArray(2);
	for(i=0;i<coeff.length;++i){
		coeff[i] = coeff[i]/coeff[coeff.length-1];
	}
	this._phoneCalculated.location.set(coeff[0],coeff[1],coeff[2]);
	//
	var X = new Matrix(coeff.length,1).setFromArray(coeff);
	temp = Matrix.mult(A,X);
	temp = temp.colToArray(0);
	console.log("RESIDUAL ERROR: "+temp );
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Triangulate.prototype.handleCanvasResizeFxn = function(e){
	console.log(e);
	this._root.matrix().identity();
	//this._root.matrix().translate(e.x*0.5,e.y*0.5);
	this._root.matrix().translate(0.0,e.y);
}
Triangulate.prototype.handleStageEnterFrameFxn = function(e){
	//console.log(e);
	var tags = this._uwbTags;
	var anchors = this._uwbAnchors;
	var display = this._uwbDisplay;
	var tag = tags[0];

	// tag.knownLocation
	this.iterateUWBStuff();
	this.drawUWBStuff();

}
Triangulate.prototype.handleKeyUpFxn = function(e){
	//
}
Triangulate.prototype.handleKeyDownFxn = function(e){
	var tags = this._uwbTags;
	var anchors = this._uwbAnchors;
	var display = this._uwbDisplay;
	var tag = tags[0];
	var loc = tag.knownLocation();


var dist = 0.1;
	if(e.keyCode==Keyboard.KEY_LET_Z){

	}else if(e.keyCode==Keyboard.KEY_LEFT){
		loc.x -= dist;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		loc.x += dist;
	}else if(e.keyCode==Keyboard.KEY_UP){
		loc.z += dist;
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		loc.z -= dist;
	}
	// console.log(log+"")

	//this.drawUWBStuff();



	return;
	var dist = 0.5;
	var err = 0.1;
	if(e.keyCode==Keyboard.KEY_LET_Z){
		this._errorDistance -= err;
		this._errorDistance = Math.max(0,this._errorDistance);
	}else if(e.keyCode==Keyboard.KEY_LET_X){
		this._errorDistance += err;
	}else if(e.keyCode==Keyboard.KEY_LEFT){
		this._phone.location.x -= dist;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		this._phone.location.x += dist;
	}else if(e.keyCode==Keyboard.KEY_UP){
		this._phone.location.y += dist;
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		this._phone.location.y -= dist;
	}
	this.doTriangulation();
	this._refreshDisplay();
	console.log("ERROR: "+this._errorDistance);
	console.log("ACTUAL: "+this._phone.location);
	console.log("CALC: "+this._phoneCalculated.location);
}
Triangulate.prototype.handleKeyDown2Fxn = function(e){
	//
}
Triangulate.prototype.handle = function(e){
	console.log(e);
}

Triangulate.prototype.drawDot = function(global, col, lin, rad){ // flip y
	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
	this._root.graphics().setFill(col?col:0x9900FF00);
	this._root.graphics().beginPath();
	this._root.graphics().drawCircle(global.x,-global.y, rad?rad:5.0);
	this._root.graphics().endPath();
	this._root.graphics().fill();
	this._root.graphics().strokeLine();
}




Triangulate.prototype.setupData = function(){
	var beacons = [];
	var beacon;
	beacon = new Tri.Beacon(new V3D(1,1,0), 1.0, 10.0, 0.001, 0.001, 0.001, 0.0001);
	beacons.push(beacon);
	this._allBeacons = beacons;
	this._estimate = new Tri.Estimate();
}
Triangulate.prototype.handleEnterFrameFxn = function(e){
	// console.log("get sample list");
	// this.getBeaconSamples();

}
// Triangulate.prototype.getBeaconSamples = function(e){
// 	var phone = this._phone;
// 	if(!phone){
// 		return;
// 	}
// 	var location = phone.location;
// 	var beacons = this._allBeacons;
// 	var samples = [];
// 	var time = Code.getTimeMilliseconds();
// 	for(var i=0; i<beacons.length; ++i){
// 		var beacon = beacons[i];
// 		var id = beacon.id();
// 		var index = id+"";
//
// 		var power = beacon.sample(location);
// 		if(power>0){
// 			var sample = new Tri.BeaconSample(beacon, time, power);
// 			samples.push(sample);
// 		}
// 	}
// 	this._estimate.addSampleList(samples);
// }





// ---------------------------------------------------------------------------------------------------------------------------------------------------
Tri = Triangulate;
Tri.AnchorUWB = function(location, distanceError, distanceStaticError){
	this._id = Tri.AnchorUWB._ID++;
	this._distanceError = 0.0;
	this._distanceStaticError = 0.0;
	this._location = null;
	this._probabilityReturnSample = 0.90; // 90% of the time
	this._probabilityGoodData = 0.90; // 90% of the time
	this._maxDistanceRange = 5; // outside this range, anchor stops working
	this.location(location);
	this.distanceError(distanceError);
	this.distanceStaticError(distanceStaticError);
	this._samples = [];
}

Tri.AnchorUWB._ID = 0;
Tri.AnchorUWB.prototype.id = function(){
	return this._id;
}
Tri.AnchorUWB.prototype.location = function(location){
	if(location!==undefined){
		this._location = location;
	}
	return this._location;
}
Tri.AnchorUWB.prototype.distanceError = function(error){
	if(error!==undefined){
		this._distanceError = error;
	}
	return this._distanceError;
}
Tri.AnchorUWB.prototype.distanceStaticError = function(error){
	if(error!==undefined){
		this._distanceStaticError = error;
	}
	return this._distanceStaticError;
}
Tri.AnchorUWB.prototype.sampleForTag = function(tag, timestamp){
	var tagLocation = tag.knownLocation();
	// console.log(tagLocation+"");
	var anchorLocation = this.location();
	var distance = V3D.distance(tagLocation,anchorLocation);
	// no samples outside range
	if(distance>this._maximumDistance){
		return null;
	}
	// no samples sometimes hardware unavailable
	var returnProb = Math.random();
	if(returnProb>this._probabilityReturnSample){
		return null;
	}
	
	var errorDistance = this.distanceError();
	var errorStatic = this.distanceStaticError();
	var errorRandomDistance = (Math.random()*2.0) - 1.0; // [0,1] to [-1,1];
	var errorRandomStatic = (Math.random()*2.0) - 1.0;
	var estimatedDistance = Math.max(errorRandomStatic*errorStatic + distance + distance*(errorDistance*errorRandomDistance), 0);


//console.log(this._id+" estimatedDistance: "+estimatedDistance);

	// sometimes return garbage data
	var badProb = Math.random();
	if(badProb>this._probabilityGoodData){
		estimatedDistance = (estimatedDistance*Math.random()*1E9) + Math.random()*1E9;
	}


// console.log(this._id+" estimatedDistance: "+estimatedDistance);

	// compile
	var sample = new Tri.SampleUWB(this, tag, estimatedDistance, timestamp);
	return sample;
}
Tri.AnchorUWB.prototype.addSample = function(sample){
	//console.log(sample);
	//this._samples.push(sample);
	// use current estimated location to throw out 

	// can calculate the same values as the tags are doing ?

}




Tri.TagUWB = function(){
	this._id = Tri.TagUWB._ID++;
	// this._location = new V3D();
	// calculate location from samples
	// keep an estimate for the distance from the anchors
	this._samples = new Tri.SampleAccumulator();
	this._location = new Tri.PositionFilter();
	this._estimatedLocation = null;
	this._estimatedTimestamp = null;
}
Tri.TagUWB._ID = 0;
Tri.TagUWB.prototype.id = function(){
	return this._id;
}
Tri.TagUWB.prototype.knownLocation = function(v){
	if(v!==undefined){
		this._knownLocation = v;
	}
	return this._knownLocation;
}
Tri.TagUWB.prototype.estimatedLocation = function(v){
	return this._estimatedLocation;
}
Tri.TagUWB.prototype._estimatedTimestamp = function(v){
	return this._estimatedTimestamp;
}
// Tri.TagUWB.prototype.move = function(delta){
// 	this._location.add(delta);
// }

Tri.TagUWB.prototype.addSample = function(sample){
	// add the sample to the corresponding list of samples
	//var anchor = sample.anchor();
	//console.log(sample);
	// use current estimated location to throw out 
	this._samples.addSample(sample);
}

Tri.TagUWB.prototype.activeAnchors = function(){
	return this._samples.toAnchorList();
}
Tri.TagUWB.prototype.anchorDistance = function(anchor){
	var samples = this._samples;
	var filter = samples.filterForAnchor(anchor);
	if(filter==null){
		return null;
	}
	return filter.distance();
}
Tri.TagUWB.prototype.anchorTimestamp = function(anchor){
	var samples = this._samples;
	var filter = samples.filterForAnchor(anchor);
	if(filter==null){
		return null;
	}
	return filter.timestamp();
}
Tri.TagUWB.prototype.addPositionEstimate = function(position, timestamp, others){ // timestamp is the AVERAGE timestamp?
	var filter = this._location;
	var sample = new Tri.PositionSample(position, timestamp);
	filter.addSample(sample);
}
Tri.TagUWB.prototype.updateLocationEstimate = function(){
	var distances = this._samples.getDistanceEstimates();
	var anchors = distances["anchors"];
	var distanceInfo = distances["distances"];;
	var timestamps = distances["timestamps"];
	var dataDistances = [];
	var dataLocations = [];
	for(var i=0; i<anchors.length; ++i){
		var anchor = anchors[i];
		var distance = distanceInfo[i];
		var position = anchor.location();
		dataDistances.push(distance["distance"]);
		dataLocations.push(position.copy());
	}
	var timestamp = Math.max(timestamps);
	
	if(dataLocations.length<4){
		console.log("not enough samples: "+dataLocations.length);
		return;
	}

	var position = Triangulate.solveUWBLinear(dataLocations, dataDistances);
	var pos = position["position"];

// console.log("0) "+this._knownLocation+"")
// console.log("A) "+pos+"")
	var position = Triangulate.solveUWBNonLinear(pos, dataLocations, dataDistances);
	var pos = position["position"];
// console.log("B) "+pos+"")

	this.addPositionEstimate(pos, timestamp);

	var info = this._location.getLocationEstimate();
	if(info!=null){
		this._estimatedLocation =  info["location"];
		this._estimatedTimestamp  = info["timestamp"];
	}
}



Tri.SampleUWB = function(anchor, tag, distance, timestamp){
	this._id = Tri.SampleUWB._ID++;
	this._anchor = anchor
	this._tag = tag;
	this._distance = distance;
	this._timestamp = timestamp;
}
Tri.SampleUWB._ID = 0;
Tri.SampleUWB.prototype.id = function(){
	return this._id;
}
Tri.SampleUWB.prototype.anchor = function(v){
	return this._anchor;
}
Tri.SampleUWB.prototype.tag = function(v){
	return this._tag;
}
Tri.SampleUWB.prototype.distance = function(v){
	return this._distance;
}
Tri.SampleUWB.prototype.timestamp = function(v){
	return this._timestamp;
}



// keep track of different samples from different sources
// 
Tri.SampleAccumulator = function(){
	this._sampleLists = {};
}
Tri.SampleAccumulator.prototype.filterForAnchor = function(anchor){
	var index = anchor.id();
	var filter = this._sampleLists[index];
	if(filter){
		return filter;
	}
	return null;
}
Tri.SampleAccumulator.prototype.addSample = function(sample){
	// find corresponding list
	var anchor = sample.anchor();
	var index = anchor.id();
	var filter = this._sampleLists[index];
	if(!filter){
		filter = new Tri.SampleFilter(anchor)
		this._sampleLists[index] = filter;
	}
	filter.addSample(sample);

	// TODO: filter accumulators based on other accumulators
	// remove them if the timestamp is too far away

}
Tri.SampleAccumulator.prototype.toAnchorList = function(){
	var samples = this._sampleLists;
	var keys = Code.keys(samples);
	var anchors = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var filter = samples[key];
		var anchor = filter.anchor();
		anchors.push(anchor);
	}
	return anchors;
}
Tri.SampleAccumulator.prototype.getDistanceEstimates = function(){
	var anchors = this.toAnchorList();
	var distances = [];
	var timestamps = [];
	var outAnchors = [];
	for(var i=0; i<anchors.length; ++i){
		var anchor = anchors[i];
		// console.log(anchor);
		var anchorID = anchor.id();
		var filter = this._sampleLists[anchorID];
		// console.log(filter);
		var distance = filter.estimatedDistance();
		if(distance!=null){
			// console.log(distance);
			timestamps.push(filter.timestamp());
			distances.push(distance);
			outAnchors.push(anchor);
		}
	}
	var result = {"distances":distances, "anchors":outAnchors, "timestamps":timestamps};
	return result;
}



// keeps track of samples from a single source
Tri.SampleFilter = function(anchor){
	this._anchor = anchor;
	//this._distance = 0;
	this._samples = [];
}
Tri.SampleFilter.prototype.addSample = function(sampleIn){
	if(!sampleIn){
		console.log(sampleIn);
		console.log("bad sample");
		return;
	}

	// drop bad samples on the floor:
	var distance = sampleIn.distance();
	if(distance>100){
		console.log("ignoring large distance: "+distance);
		return;
	}


	var samples = this._samples;
	samples.push(sampleIn);
	var distances = [];
	var timestamps = [];
	var count = samples.length;
	if(count<=3){ // need at least 3+ samples to start filtering
		return;
	}
	for(var i=0; i<count; ++i){
		var sample = samples[i];
		var distance = sample.distance();
		var timestamp = sample.timestamp();
		distances.push(distance);
		timestamps.push(timestamp);
	}

	// filter out bad distance estimates
	var avgD = Code.avg(distances);
	var sigmaD = Code.stdDev(distances,avgD);
	var limitD = 2*sigmaD; // 2 = 95%

	// filter out old timestamp values
	var avgT = Code.avg(timestamps);
	var sigmaT = Code.stdDev(timestamps,avgT);
	var limitT = 2*sigmaT; // 2 = 95%

	// remove from list
	for(var i=0; i<count; ++i){
		var sample = samples[i];
		if(!sample){
			console.log(sample);
			console.log("sample was undefined ?");
			continue; // WHY IS THIS HAPPENING?
		}
		var distance = sample.distance();
		var timestamp = sample.timestamp();
		var deltaD = Math.abs(distance-avgD);
		var deltaT = Math.abs(timestamp-avgT);
		if(deltaD>limitD && deltaT>limitT){
			Code.removeElementAt(samples,i);
			--i; // retry index;
			console.log("removing: "+i+" for "+deltaD+">"+limitD+" || "+deltaT+">"+limitT+" ... ");
		}
	}

	// truncate array to max count
	Code.preTruncateArray(samples, 10);
	/*
	while(samples.length>10){
		samples.shift(); // remove from beginning = oldest
		// Code.truncateArray(samples, 10);
	}
	*/
}
Tri.SampleFilter.prototype.estimatedDistance = function(){
	var samples = this._samples;
	var count = samples.length;
	if(count==0){
		return null;
	}
	var distances = [];
	var timestamps = [];
	for(var i=0; i<count; ++i){
		var sample = samples[i];
		var distance = sample.distance();
		var timestamp = sample.timestamp();
		distances.push(distance);
		timestamps.push(timestamp);
	}
	var avgD = Code.avg(distances);
	var sigmaD = Code.stdDev(distances,avgD);


	// TODO: repeated drops
	// Code.repeatedDropOutliers = function(inList, toValueFxn, toLimitFxn, minCount, maxIterations, updateFxn){
	var timestamp = Math.max(timestamp);
	// console.log(timestamp);


	return {"distance":avgD, "sigma":sigmaD, "timestamp":timestamp};
}
Tri.SampleFilter.prototype.timestamp = function(){
	var samples = this._samples;
	var count = samples.length;
	var timestamps = [];
	for(var i=0; i<count; ++i){
		var sample = samples[i];
		var timestamp = sample.timestamp();
		timestamps.push(timestamp);
	}
	var avgT = Code.avg(timestamps);
	var sigmaT = Code.stdDev(timestamps,avgT);
	return {"timestamp":avgT, "sigma":sigmaT};
}
Tri.SampleFilter.prototype.anchor = function(){
	return this._anchor;
}


Tri.PositionSample = function(position, timestamp){
	this._position = position;
	this._timestamp = timestamp;
}
Tri.PositionSample.prototype.position = function(v){
	return this._position;
}
Tri.PositionSample.prototype.timestamp = function(v){
	return this._timestamp;
}

// keep track of position estimate
Tri.PositionFilter = function(){
	this._samples = [];
}
Tri.PositionFilter.prototype.addSample = function(sample){
	var samples = this._samples;
	samples.push(sample);
	Code.preTruncateArray(samples, 10);
}
Tri.PositionFilter.prototype.getLocationEstimate = function(sample){
	var samples = this._samples;
	if(samples.length==0){
		return null;
	}

	var positions = [];
	var timestamps = [];
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		// console.log(sample);
		positions.push(sample.position());
		timestamps.push(sample.timestamp());
	}
	var timestamp = Math.max(timestamps);
	var average = V3D.average(positions);
	// console.log(average);

	var sigma = Code.stdDevV3D(positions, average);
	// console.log(sigma);

	// TODO: repeat drop


	// list of positions measurements
	// drop old timestamps
	// drop far position error
	// tag.addPositionEstimate(pos, anchors, dataDistances, dataTimestamps);


	var result = {"location":average, "sigma":sigma, "timestamp":timestamp};
	return result;
}




Tri.Beacon = function(location, power, maxDistance, staticError, powerError, distanceError){
	this._id = Tri.Beacon._ID++;
	this._sourcePower = 1.0;
	this._powerError = 0.01; // proportional to power
	this._staticError = 0.01; // always present
	this._maximumDistance = 10.0;
	this._maximumDistanceError = 1.0; // error in actual distance
	this._distanceError = 0.001; // proportional to distance
	this._location = null;
	this.location(location);
	this.power(power);
	this.maxDistance(maxDistance);
	this.staticError(staticError);
	this.powerError(powerError);
	this.distanceError(distanceError);
}
Tri.Beacon._ID = 0;
Tri.Beacon.prototype.id = function(){
	return this._id;
}
Tri.Beacon.prototype.location = function(location){
	if(location!==undefined){
		this._location = location;
	}
	return this._location;
}
Tri.Beacon.prototype.power = function(power){
	if(power!==undefined){
		this._sourcePower = power;
	}
	return this._sourcePower;
}
Tri.Beacon.prototype.staticError = function(error){
	if(error!==undefined){
		this._staticError = error;
	}
	return this._staticError;
}
Tri.Beacon.prototype.powerError = function(error){
	if(error!==undefined){
		this._powerError = error;
	}
	return this._powerError;
}
Tri.Beacon.prototype.distanceError = function(error){
	if(error!==undefined){
		this._distanceError = error;
	}
	return this._distanceError;
}
Tri.Beacon.prototype.maxDistance = function(maxDistance){
	if(maxDistance!==undefined){
		this._maximumDistance = maxDistance;
	}
	return this._maximumDistance;
}
Tri.Beacon.prototype.sample = function(position){
	var distance = V3D.distance(this._location,position);

// distance error here ?

	var d2 = distance *distance;
	var inverse = d2>0 ? 1.0/d2 : 0.0;
	var exp = Math.exp(-inverse);
	var errorStatic = Code.randomFloat(-1.0,1.0) * this._staticError;
	var errorPower = Code.randomFloat(-1.0,1.0) * this._powerError * inverse;
	var errorDistance = Code.randomFloat(-1.0,1.0) * this._distanceError * distance;
	var error = errorPower + errorStatic + errorDistance;
console.log("errorStatic: "+errorStatic);
	var power = this._sourcePower * inverse + error;
	power = Math.max(0,power);
	// dropping in / out based on distance:
	var distanceCheck = this._maximumDistance + Code.randomFloat(-1.0,1.0) * this._maximumDistanceError;
	if(distance>distanceCheck){
		power = 0.0;
	}
	return power;
}

Tri.BeaconSample = function(beacon, time, power, distance, location){
	this._beacon = null;
	this._power = null;
	this._time = null;
	this._distance = null;
	this._location = null;
	this.beacon(beacon);
	this.time(time);
	this.power(power);
	this.distance(distance);
	this.location(location);
}
Tri.BeaconSample.prototype.beacon = function(beacon){
	if(beacon!==undefined){
		this._beacon = beacon;
	}
	return this._beacon;
}
Tri.BeaconSample.prototype.power = function(power){
	if(power!==undefined){
		this._power = power;
	}
	return this._power;
}
Tri.BeaconSample.prototype.distance = function(distance){
	if(distance!==undefined){
		this._distance = distance;
	}
	return this._distance;
}
Tri.BeaconSample.prototype.time = function(time){
	if(time!==undefined){
		this._time = time;
	}
	return this._time;
}
Tri.BeaconSample.prototype.location = function(location){
	if(location!==undefined){
		this._location = location;
	}
	return this._location;
}



Tri.DAQ = function(beacons){
	this._beacons = {};
	this.samples = [];
	if(beacons){
		for(var i=0; i<beacons.length; ++i){
			this.addBeacon(beacons[i]);
		}
	}
}
Tri.DAQ.prototype.addBeacon = function(beacon){
	var index = beacon.id()+"";
	this._beacons[index] = beacon;
}

Tri.DAQ.prototype.getSamplesForLocation = function(location){
	var beacons = Code.objectToArray(this._beacons);
	var samples = [];
	var time = Code.getTimeMilliseconds();
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		var id = beacon.id();
		// var index = id+"";
		var power = beacon.sample(location);
		// ?
		if(power>0){
			var distance = V3D.distance(location,beacon.location());
			// var loc = beacon.location();
			var loc = location.copy();
			var sample = new Tri.BeaconSample(beacon, time, power, distance, loc);
			samples.push(sample);
		}
	}
	return samples;
}


// target, remote, device, phone, listener
Tri.Target = function(daq){
	this._location = new V3D();
	this._daq = daq;
	this._estimate = new Tri.Estimate();
}
Tri.Target.prototype.location = function(){
	return this._location;
}
Tri.Target.prototype.move = function(delta){
	this._location.add(delta);
}
Tri.Target.prototype.getAvailableSamples = function(){
	var samples = this._daq.getSamplesForLocation(this._location);
	return samples;
}
Tri.Target.prototype.recordAvailableSamples = function(){
	var samples = this.getAvailableSamples();
	console.log("sample @: "+this._location);
	this._estimate.addGroupedSamples(samples);
}
Tri.Target.prototype.solvePower = function(){
	console.log(this);
	var estimate = this._estimate;
	console.log(this);

	estimate.solvePower();


	throw "..."
}

Tri.Target.prototype.solveWorldCalibration = function(){
	console.log(this);
	var estimate = this._estimate;
	console.log(this);

	estimate.solveCalibration();


	throw "..."

}

// single beacon modeled from data
Tri.BeaconModel = function(id){
	this._id = null;
	this._power = null;
	// this._maxPower = null;
	// this._minPower = null;
	this._location = null;
	// this._locationMean = null;
	this._samples = [];
	// this._valueMax = null;
	// this._valueDecay = null;
	this.id(id);
}
Tri.BeaconModel.prototype.addSample = function(sample){
	var list = this._samples;
	list.push(sample);
	// Code.preTruncateArray(list,10);
}
Tri.BeaconModel.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Tri.BeaconModel.prototype.power = function(p){
	if(p!==undefined){
		this._power = p;
	}
	return this._power;
}
Tri.BeaconModel.prototype.location = function(l){
	if(l!==undefined){
		this._location = l;
	}
	return this._location;
}
Tri.BeaconModel.prototype.x = function(){
	//
}



// world model based on beacon esimates
Tri.Estimate = function(){
	this._beacons = {};
	this._groupedSamples = [];
}
// Tri.Estimate.prototype.addSample = function(sample){
// 	var index = sample.beacon().id();
// 	var model = this._beaconModels[index];
// 	if(!model){
// 		model = new Tri.BeaconModel();
// 		this._beaconModels[index] = model;
// 	}
// 	model.addSample(sample);
// }
Tri.Estimate.prototype.addGroupedSamples = function(samples){
	// this._timeSamples.push(samples);
	// Code.preTruncateArray(this._timeSamples,10);
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		this._checkAddBeaconModel(sample.beacon().id(), sample);
	}
	this._groupedSamples.push(samples);
}
Tri.Estimate.prototype._checkAddBeaconModel = function(beaconID, sample){
	var beacon = this._beacons[beaconID];
	if(!beacon){
		beacon = new Tri.BeaconModel(beaconID);
		this._beacons[beaconID] = beacon;
	}
	beacon.addSample(sample);
}

// using known sample locations, solve for source locations
Tri.Estimate.prototype.solveCalibration = function(){
	console.log(this);

	var sampleLookup = {};
	var beacons = Code.objectToArray(this._beacons);
	console.log(beacons);
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		sampleLookup[beacon.id()] = [];
	}

	// pairs of samples:
	// sx, sy, sp

	// var samples = [];
	var groups = this._groupedSamples;
	for(var g=0; g<groups.length; ++g){
		var group = groups[g];
		// var list = [];
		// samples.push(list);
		for(var i=0; i<group.length; ++i){
			var sample = group[i];
			var beaconID = sample.beacon().id();
			var list = sampleLookup[beaconID];
			var power = sample.power();
			var location = sample.location();
				location = location.copy();
			list.push([location, power]);
			// console.log(sample);
			// var power = sample.power();
			// list.push(power);
		}
	}
	console.log(sampleLookup);

	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		var samples = sampleLookup[beacon.id()];
		// get closest / lowest error top N samples only
		var sampleCount = samples.length;
			var rows = sampleCount*(sampleCount-1);
			var cols = 4;
			A = new Matrix(rows,cols);
			B = new Matrix(rows,1);
		var row = 0;
		for(var si=0; si<samples.length; ++si){
			var sampleI = samples[si];
			var s1 = sampleI[0];
			var s1x = s1.x;
			var s1y = s1.y;
			var s1p = sampleI[1];
			for(var sj=si+1; sj<samples.length; ++sj){
				var sampleJ = samples[sj];
				var s2 = sampleJ[0];
				var s2x = s2.x;
				var s2y = s2.y;
				var s2p = sampleJ[1];
				A.set(row, 0, 2*(s2x-s1x));
				A.set(row, 1, 2*(s2y-s1y));
				A.set(row, 2, 1.0/s2p - 1.0/s1p);
				A.set(row, 3, s1x*s1x - s2x*s2x + s1y*s1y - s2y*s2y);
				++row;
			}
		}
		var svd = Matrix.SVD(A);

		coeff = svd.V.colToArray(3);
		for(c=0;c<coeff.length;++c){
			coeff[c] = coeff[c]/coeff[coeff.length-1];
		}
		// source values:
		var position = new V2D(coeff[0],coeff[1]);
		var power = coeff[2];
		console.log(" "+i+": "+position+"  @ "+power);
	}

	// nonlinear solve:
	// minimize distance error?
	// minimize sample error ?

	throw ".."
}

// ALL UNKNOWNS ...

Tri.Estimate.prototype.solvePower = function(){
	console.log(this);
	// initial guess of power for beacons
	var beacons = Code.objectToArray(this._beacons);
	console.log(beacons);
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		beacon.power(1.0);
	}
	// collect
	var powers = [];
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		powers[i] = beacon.power();
	}
	// var samples = [];
	// var sampleLookup = {};
	// for(var i=0; i<beacons.length; ++i){
	// 	var beacon = beacons[i];
	// 	powers[i] = beacon.power();
	// 	var arr = [];
	// 	samples[i] = arr;
	// 	sampleLookup[beacon.id()] = arr;
	// }
	// console.log(samples)
	// throw "?"
	// var groups = this._groupedSamples;
	// for(var g=0; g<groups.length; ++g){
	// 	var group = groups[g];
	// 	for(var i=0; i<group.length; ++i){
	// 		var sample = group[i];
	// 		var bID = sample.beacon().id();
	// 		var power = sample.power();
	// 		sampleLookup[bID].push(power);
	// 	}
	// }

	// nonlinear updates
	var samples = [];
	var groups = this._groupedSamples;
	for(var g=0; g<groups.length; ++g){
		var group = groups[g];
		var list = [];
		samples.push(list);
		for(var i=0; i<group.length; ++i){
			var sample = group[i];
			var power = sample.power();
			list.push(power);
		}
	}
	// Tri.iteritiveSourcePower(powers, samples);

	// ...does power need to be done a pair at at time?

	// Tri.nonlinearSourcePower(powers,samples);


	// after beacon sources are determined ...
	var beacons = Code.objectToArray(this._beacons);
	console.log(beacons)
	beacons[0].location(new V3D(0,0,0));
	beacons[1].location(new V3D(1,0,0));
	beacons[2].location(new V3D(0.75,0.75,0));
	var sources = [];
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		sources.push(beacon.location());
	}
	//
	// var samples = [];
	var groups = this._groupedSamples;
	var distances = [];
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var list = [];
		distances.push(list);
		for(var j=0; j<group.length; ++j){
			var sample = group[j];
			// console.log(sample);
			var distance = sample.distance();
			// sources.push(beacon.location());
			list.push(distance);
		}
	}
	console.log(sources);
	console.log(distances);

	Tri.locateSamplePoints(sources,distances);

	// source locations ???

	// save
	throw "?"
}
Tri.locateSamplePoints = function(sources,samples){
	var locations = [];
	var circles = [];
	for(var i=0; i<sources.length; ++i){
		var source = sources[i];
		var s = source;
		circles.push({"center":new V2D(s.x,s.y), "radius":0});
	}
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		for(var j=0; j<sample.length; ++j){
			var distance = sample[j];
			circles[j]["radius"] = distance;
		}
		var result = Code.pointFromCircles(circles);
		locations.push(result);
	}
	console.log(locations);
	throw "?";
	return locations;
}
Tri.iteritiveSourcePower = function(powers,samples){ // s = p/(d*d) ; p = s*d*d ; d = sq(p/s)
	var maxIterations = 5;
	for(var iter=0; iter<maxIterations; ++iter){
		var count = powers.length;

		var distances = [];
		var nextPowers = [];
		for(var i=0; i<count; ++i){
			var power = powers[i];
			var dists = [];
				distances[i] = dists;
			var list = samples[i];
			var nextPower = 0;
			for(var l=0; l<list.length; ++l){
				var sample = list[l];
				// var estimate = power/(distance*distance);
				var distance = Math.sqrt(power/sample);
				dists.push(distance);
				nextPower += sample*distance*distance;
			}
			nextPowers.push(nextPower);
		}
		console.log(distances);
		console.log(nextPowers);
		powers = nextPowers;
	}
	// distance_i = Math.sqrt(sample_i/power_N)
	// // ...
	// newPower_N = sample_i/Math.pow(distance_i,2);
	//
	// // move toward new estimate?
	// power_i = 0.5*power_i + 0.5*power_N;

	throw "?";
}
Tri.nonlinearSourcePower = function(powers, samples){
	// also need locations of A / B / C
	console.log(powers)
	console.log(samples)

	console.log("nonlinearSourcePower");
	// a = 0,0
	// b = 1,0

	var cx = 0.75; // 0.75
	var cy = 0.75; // 0.75
	var pA = 1; // 3
	var pB = 1; // 4
	var pC = 1; // 5


	// linear initial estimation of power ?

// NONLINEAR ERROR FXN:
	// > updating: pA, pB, pC, Cx, Cy
	// for each grouping (assuming 3+)
		// get calculated distances dI^2 = pI/SiI
		// get optimal circle center point: Six,Siy
		// get optimal distances: diI^2 = (Ix-Six)^2 + (Iy-Siy)^2
		// get each error: [SiI - (PI/diI^2)]^2
		// error += 3 sub errors


		// var circles = [];
		// 	circles.push({"center":new V2D(0,0), "radius":2});
		// 	circles.push({"center":new V2D(5.1,0), "radius":3});
		// 	circles.push({"center":new V2D(2,.2), "radius":1});
		// //var result = Code.pointFromCirclesAlgebraic(circles);
		// var result = Code.pointFromCircles(circles);
		// console.log(result);
		// var totalError = 0;



	// gradient descent
	// var maxIterations = 10;
	// var maxIterations = 25;
	var maxIterations = 100;
	// maxIterations = maxIterations!==undefined ? maxIterations : 10;
	var eps = 1E-8;
		eps = [eps,eps,eps,eps,eps];
	eps = null;
	// var unknowns = [cx,cy, pA,pB,pC];
	// var unknowns = [pC];
	var unknowns = [pA,pB,pC];
	var result = Code.gradientDescent(Tri._nonlinearSourcePowerError, [samples], unknowns, null, maxIterations, 1E-16, null, 1.0);
	var x = result["x"];
	console.log(x+"");

	// var x = result["x"];
	// center = new V3D(x[0],x[1],x[2]);
	// radius = x[3];
	// return {"center":center, "radius":radius, "weights":weights};

	// Code.pointFromCirclesAlgebraic(circles);
	// Code.pointFromCirclesGeometric(circles,location);
	// ...
	throw "here";
}
Tri._nonlinearSourcePowerError = function(args, vals, isUpdate){//initial: distances_i & powers_N, sample_i){
	// console.log(args);
	// console.log(vals);
	var groups = args[0];
	// console.log(groups);

	var ax = 0;
	var ay = 0;
	var bx = 1;
	var by = 0;
	// var cx = vals[0];
	// var cy = vals[1];
	// var pA = vals[2];
	// var pB = vals[3];
	// var pC = vals[4];

	var cx = 0.75;
	var cy = 0.75;
	// var pA = 3;
	// var pB = 4;
	// var pC = vals[0];
	var pA = vals[0];
	var pB = vals[1];
	var pC = vals[2];

	pA = Math.abs(pA);
	pB = Math.abs(pB);
	pC = Math.abs(pC);
	var powers = [pA,pB,pC];
	// if(pA<=0 || pB<=0 || pC<=0){
	// 	return 1E99;
	// }
	// console.log(powers+"")
	// var sources = [new V2D(ax,ay),new V2D(bx,by),new V2D(cx,cy)];
	// ...
	var circles = [];
		circles.push({"center":new V2D(ax,ay), "radius":0});
		circles.push({"center":new V2D(bx,by), "radius":0});
		circles.push({"center":new V2D(cx,cy), "radius":0});
	var totalError = 0;
	for(var g=0; g<groups.length; ++g){
		var samples = groups[g];
		// distances from power
		for(var s=0; s<samples.length; ++s){
			var sample = samples[s];
			var power = powers[s];
			var distanceSquare = power/sample;
			var distance = Math.sqrt(distanceSquare);
			circles[s]["radius"] = distance;
		}
		// optimum sample location
		var location = Code.pointFromCircles(circles);
		if(isUpdate){
			// console.log(location+" <<<");
		}
		// distances from location
		for(var s=0; s<samples.length; ++s){
			var power = powers[s];
			var sample = samples[s];
			var circle = circles[s];
			var distanceSquare = V2D.distanceSquare(circle["center"], location);
			// error
			var expected = power/distanceSquare;
			var error = Math.pow(expected - sample, 2);
			// var error = Math.abs(expected - sample);
			// console.log(sample,expected,error);
			totalError += error;
		}
	}

	if(isUpdate){
		console.log("powers: "+powers);
		console.log(totalError+" ...");
	}
	// console.log(" "+pC+" = "+totalError+" ...");

	// console.log(totalError);
	return totalError;

		// estimate distances:
		// 	diA^2 = pA/SiA
		// 	diB^2 = pB/SiB
		// 	diC^2 = pC/SiC
		//
		// calculate optimum locations: closest intersect of 3 radiuses
		// 	Six = ...
		// 	Siy = ...
		//
		// calculate distances:
		// 	diA^2 = (Ax-Six)^2 + (Ay-Siy)^2
		// 	diB^2 = (Bx-Six)^2 + (By-Siy)^2
		// 	diC^2 = (Cx-Six)^2 + (Cy-Siy)^2
		//
		//
		// calculate error:
		// 	error_i_I = SiA - (PA/diA^2)
		// 	error_i = error_i_A + error_i_B + error_i_C
		//

	// estimate_i = power_N/Math.pow(distance_i,2);
	// var error = (estimate_i - sample_i);
	// totalError += error*error;
	throw "..."
}
Tri.Estimate.prototype.updateEstimate = function(){
	/*
		estimate current position based on knowledge of beacon data

		time sample set has inter-beacon location dependencies

		use prior location estimates too ...

		absense of data is also data ?

		2D grid with accumulated probabilities


		confidence of an edge based on similar or agreeing measurements


		a sample ties n beacons together based on power readings
		the samples are a: peak * exp(-decay * d^2) for each of beacons models

		graph model with a geometrical distance as the weight between nodes



	*/
}

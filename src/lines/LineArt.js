// LineArt.js

function LineArt(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	// var imageList = ["image_1.jpg"];//,"image_2.jpg"];
	var imageList = ["image_1.jpg"]; // char
	// var imageList = ["image_2.png"]; // square
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
LineArt.prototype.handleImagesLoaded = function(imageInfo){
	console.log("handleImagesLoaded");
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.graphics().alpha(0.001);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);


	var scale = 4.0;
	ImageMat.filterContrast(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height(),     scale);

	var grayfloat = imageMatrixA.getGrayFloat();

	// increase contrast as needed
	// ImageMat.filterGrayContrast = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){
	// ImageMat.filterContrast = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> darks darker, lights lighter
	//grayfloat = ImageMat.filterContrast(grayfloat, grayfloat, grayfloat, imageMatrixA.width(), imageMatrixA.height(),     0.5);
	// console.log(grayfloat)



	//var grayscale = new ImageMat(grayfloat,grayfloat,grayfloat);
	this.ProcessLineArt(imageMatrixA);
	//this.ProcessLineArt(grayfloat,  imageMatrixA.width(), imageMatrixA.height());
}


// A = dark line template
// B = art lines
LineArt.ErrorFxn = function(grayscaleA, grayscaleB, width, height){
	var error = 0;
	var len = width*height;
	var totalError = 0;
	// console.log(len,grayscaleA.length, grayscaleB.length)
	for(var i=0; i<len; ++i){
		var a = grayscaleA[i];
		var b = grayscaleB[i];
		// var error = Math.abs(a-b);
		// var error = Math.pow( Math.abs(a-b), 2 );


		var abs = Math.abs(a-b);
		// var abs = Math.random();


		//var aScore = (1.0-a); // 1 is great
		//var bScore = (1.0-b); // 


		var error = abs;
		// aScore = Math.pow(aScore,2)

		// var error = abs*aScore

		// getting a line match is great
		// covering blank space is meh

		// var error = aScore*bScore;

		totalError += error;
	}
	return totalError;
}

// LineArt.prototype.ProcessLineArt = function(grayscale, width, height){
LineArt.prototype.ProcessLineArt = function(imageSource){
	console.log(imageSource);
	var width = imageSource.width();
	var height = imageSource.height();

	var maxIterations = 100; // attempts
	var maxLines = 100; // successes
	// var circularPoints = 32; // circular points of precision
	// var circularPoints = 64;
	var circularPoints = 100;
	// var circularPoints = 1000;
	// var lowResSizeGoal = 100; // 50x50 image
	var lowResSizeGoal = 150;
	var canvasColor = new V4D(1.0,1.0,1.0, 1.0); // white canvas color
	// var stringColor = new V4D(0.0,0.0,0.0, 0.5); // R G B A
	var stringColor = new V4D(0.00,0.00,0.00, 0.50); // black
	// var stringColor = new V4D(0.95,0.65,0.05, 0.50); // orange
	// var stringColor = new V4D(1.00,0.00,0.00, 0.50); // red
	// var stringColor = new V4D(0.00,0.10,0.00, 0.50); // grn
	// var stringColor = new V4D(0.00,0.00,1.00, 0.50); // blu
	// var stringColor = new V4D(1.00,1.00,1.00, 0.50); // wht
	// 



// testing:
	// maxLines = 10;
	// maxLines = 25;
	// maxLines = 100;
	// maxLines = 200;
	maxLines = 500;
	// maxLines = 1000;
	// maxIterations = 100;
	// maxIterations = 500;
	// maxIterations = 1000;
	maxIterations = 2000;
	// maxIterations = 5000;
	// maxIterations = 10000;

	var lowResSizeGoal = 400;
	// var lowResSizeGoal = 300;
	// var lowResSizeGoal = 200;
	// var lowResSizeGoal = 150;

	var scale = Math.max(lowResSizeGoal/width, lowResSizeGoal/height);
	console.log(scale);


	var lowResWidth = Math.round(width*scale);
	var lowResHeight = Math.round(height*scale);
	scale = (lowResWidth/width + lowResHeight/height)*0.5;
	console.log("=> "+lowResWidth+"x"+lowResHeight+" @ "+scale);



	var lowRes = imageSource.getScaledImage(scale, true);
	console.log(lowRes);


	var displayScale = 1.0/scale;


// find the 'grayscale' in terms of distance from string color


var stringColorV3D = new V3D(stringColor.x, stringColor.y, stringColor.z);

var grayscaleColorValue = lowRes.distanceFromColor(stringColorV3D);
var grayscale = grayscaleColorValue["value"];
	grayscale = ImageMat.normalFloat01(grayscale);
	grayscale = ImageMat.invertFloat01(grayscale);
var grayscaleImage = new ImageMat(lowRes.width(),lowRes.height(), grayscale,grayscale,grayscale);
console.log(grayscaleImage);


	var img = GLOBALSTAGE.getFloatRGBAsImage(lowRes.red(),lowRes.grn(),lowRes.blu(), lowRes.width(), lowRes.height());
	var d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(300,10);


	var img = GLOBALSTAGE.getFloatRGBAsImage(grayscaleImage.red(),grayscaleImage.grn(),grayscaleImage.blu(), grayscaleImage.width(), grayscaleImage.height());
	var d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(600,10);





// grayscale is now an array (width x height) of pixels that best match the input thread color
// 0 = the colors don't match at all
// 1 = the colors match identically

	lowResWidth = grayscaleImage.width();
	lowResHeight = grayscaleImage.height();
	lowResGray = grayscaleImage.getGrayFloat();



	// create circular points in the image:
	var points = [];
	var envelopeRadius = Math.min(lowResWidth,lowResHeight)/2;
		envelopeRadius = Math.floor(envelopeRadius);
	
	var center = new V2D(lowResWidth*0.5,lowResHeight*0.5);

	for(var i=0; i<circularPoints; ++i){
		var p = i/circularPoints;
		var point = new V2D(1,0);
		point.rotate(Math.PI2*p);
		point.scale(envelopeRadius);
		point.x += center.x;
		point.y += center.y;
		points.push(point);
	}
	console.log(points);

	// holds the lines
	var aggregate = new DO();


	// this._tick_votes = [];
	this._tick_points = points;
	this._tick_maxLines = maxLines;
	this._tick_maxIterations = maxIterations;
	this._tick_canvasColor = canvasColor;
	this._tick_stringColor = stringColor;
	this._tick_lineList = [];
	
	this._tick_aggregate = aggregate;
	this._tick_width = lowResWidth;
	this._tick_height = lowResHeight;
	this._tick_gray = lowResGray;

	this._tick_iterations = 0;

	// aux
	this._displayScale = displayScale;
	// this._tick_error = null;
	

	var ticker = new Ticker(1);
	this._ticker = ticker;
	var lineart = this;
	var tickerFxn = function(){
		ticker.stop();
		// lineart.tickIterateLines();
		lineart.tickIterateAggregate();
		// ticker.start();
	}
	ticker.addFunction(Ticker.EVENT_TICK, tickerFxn, this);
	ticker.start();


}


// NEXT-BEST LINE
LineArt.prototype.tickIterateAggregate = function(){
	var lineart = this;
	// console.log("tick");
	this._tick_iterations++;

	var aggregate = this._tick_aggregate;
	var points = this._tick_lines;
	var width = this._tick_width;
	var height = this._tick_height;
	var gray = this._tick_gray;
	var displayScale = this._displayScale;
	var maxLines = this._tick_maxLines;
	var maxIterations = this._tick_maxIterations;

	var points = this._tick_points;
	var canvasColor = this._tick_canvasColor;
	var stringColor = this._tick_stringColor;
	var lineList = this._tick_lineList;
	var ticker = this._ticker;

	if(this._tick_iterations>maxIterations){
		console.log("max iterations: "+maxIterations);
		console.log(lineList);
		return;
	}




	var callback = function(){
		// lineList.push(line);
		console.log("lineList: "+lineList.length+" v "+maxLines);
		// LineArt.removeDuplicates(lineList);// ... // ??????????????????????????????????????
		// lineList.sort( LineArt.sortLinelistScore );
		// Code.truncateArray(lineList, maxLines);
		// console.log()
		lineart.debugDisplayLines();
		
		// console.log("tick")
		ticker.start();
	}

	LineArt.pickBestNextLine(points,lineList, gray,width,height, stringColor, callback);
}


LineArt.pickBestNextLine = function(points,lineList, gray,width,height, color, callback){
	var tenPercent = Math.round(points.length * 0.2);
	var fiftyPercent = Math.round(points.length * 0.5);
	var randomTests = Math.min(Math.max(tenPercent,1),20); // somewhere in 1%-10% of possible lines
	if(lineList.length==0){
		var randomTests = Math.min(Math.max(fiftyPercent,1),40);
	}

	var bestScore = null;
	var randomLines = [];
	for(var i=0; i<randomTests; ++i){
		var a;
		if(lineList.length>0){
			var last = lineList[lineList.length-1];
			// console.log(lineList);
			// console.log(last);
			var a = last["b"]; // a->b
		}else{
			a = Code.arrayRandomItem(points);
		}
		var b = Code.arrayRandomItem(points);
		if(a==b){
			--i;
			continue;
		}
		randomLines.push({"a":a,"b":b,"s":null});
	}


	var randomIndex = 0;

	var iterateFxn = function() {
		// console.log(randomIndex);
		// console.log(randomLines);
		var entry = randomLines[randomIndex];
		var pointA = entry["a"];
		var pointB = entry["b"];
		// var lineLength = V2D.distance(pointA,pointB);

		var lines = Code.copyArray(lineList);
		var entry = {"a":pointA, "b":pointB, "s":null};
		lines.push(entry);
		// console.log("NEW LINES");
		// console.log(lines)

		//LineArt.renderLines(lines, width,height, color, internalCallback);

		LineArt.renderLines([entry], width,height, color, internalCallback);
	}

	var internalCallback = function(imageFloat){
		// console.log("internalCallback ....")
		var lineImageGray = ImageMat.grayFromRGBFloat(imageFloat["red"],imageFloat["grn"],imageFloat["blu"]);
		// var score = LineArt.LineScore(lineImageGray, gray,width,height, null);

		var score = LineArt.AggregateScore(lineImageGray, gray,width,height, null);
			// console.log(score);
		
		var entry = randomLines[randomIndex];
		entry["s"] = score;
		// console.log(entry);

		// var line = {
		// 	"a": pointA,
		// 	"b": pointB,
		// 	"s": score,
		// };
// console.log(line);
		// callback(line);

		// throw "HERE";
		++randomIndex;
		if(randomIndex>=randomLines.length){
			// console.log("DONE ...");
			randomLines.sort( LineArt.sortLinelistScore );
			// console.log(randomLines);
			var best = randomLines[0];
			// console.log(best);
			lineList.push(best);
			callback();
		}else{
			iterateFxn();
		}
	}

	iterateFxn();

}


// EACH LINE INDIVIDUALLY:
LineArt.prototype.tickIterateLines = function(){
	var lineart = this;
	// console.log("tick");
	this._tick_iterations++;

	var aggregate = this._tick_aggregate;
	var points = this._tick_lines;
	var width = this._tick_width;
	var height = this._tick_height;
	var gray = this._tick_gray;
	var displayScale = this._displayScale;
	var maxLines = this._tick_maxLines;
	var maxIterations = this._tick_maxIterations;

	var points = this._tick_points;
	var canvasColor = this._tick_canvasColor;
	var stringColor = this._tick_stringColor;
	var lineList = this._tick_lineList;
	var ticker = this._ticker;

	if(this._tick_iterations>maxIterations){
		console.log("max iterations: "+maxIterations);
		console.log(lineList);
		return;
	}




	var callback = function(line){

		// console.log("callback - tickIterateLines");
		// console.log(line);
		lineList.push(line);
		// console.log("lineList: "+lineList.length+" v "+maxLines);
		LineArt.removeDuplicates(lineList);
		lineList.sort( LineArt.sortLinelistScore );
		Code.truncateArray(lineList, maxLines);
		
		lineart.debugDisplayLines();


		ticker.start();
	}

	LineArt.pickRandomLine(points, gray,width,height, stringColor, callback);
}
LineArt.sortLinelistScore = function(lineA,lineB){
	var sA = lineA["s"];
	var sB = lineB["s"]
	// console.log("s: "+sA+" < "+sB)
	return sA < sB ? -1 : (sA>sB ? 1 : 0);
}
LineArt.removeDuplicates = function(lines){
	for(var i=0; i<lines.length; ++i){
		var lineA = lines[i];
		for(var j=i+1; j<lines.length; ++j){
			var lineB = lines[j];
			if( LineArt.areLinesTheSame(lineA,lineB) ){
				// console.log("DUP LINE");
				Code.removeElementAt(lines,j);
				--j;
			}
		}
	}
}
LineArt.pickRandomLine = function(points, gray,width,height, color, callback){
	var randomTests = 1;

	var bestScore = null;
	var randomLines = [];
	for(var i=0; i<randomTests; ++i){
		var a = Code.arrayRandomItem(points);
		var b = Code.arrayRandomItem(points);
		if(a==b){
			--i;
			continue;
		}
		randomLines.push([a,b]);
	}



	var pointA = randomLines[0][0];
	var pointB = randomLines[0][1];
	var lineLength = V2D.distance(pointA,pointB);
	var internalCallback = function(imageFloat){
		// console.log("internalCallback");
		// var lineImageGray = imageFloat.gry();
		var lineImageGray = ImageMat.grayFromRGBFloat(imageFloat["red"],imageFloat["grn"],imageFloat["blu"]);
		var score = LineArt.LineScore(lineImageGray, gray,width,height, lineLength);
		var line = {
			"a": pointA,
			"b": pointB,
			"s": score,
		};

		callback(line);
	}

	LineArt.renderLine(pointA,pointB, width,height, color, internalCallback);
/*
	
*/
}
LineArt.renderLine = function(pointA,pointB, width,height,color, callback){
	var lines = [{"a":pointA, "b":pointB}];
	LineArt.renderLines(lines, width,height,color, callback);
}
LineArt.renderLines = function(lines, width,height,color, callback){
	// console.log(pointA,pointB, width,height, callback);

	var sourceDO = new DO();
	sourceDO.graphics().clear();
	/*
	sourceDO.graphics().setFill(0x00000000); // clear
	sourceDO.graphics().beginPath();
	sourceDO.graphics().drawRect(0,0, width,height);
	sourceDO.graphics().endPath();
	sourceDO.graphics().fill();
	*/
	// draw line

	// TODO: get alpha from color?
	for(var i=0; i<lines.length; ++i){
		var line = lines[i];
		// console.log(line);
		var pointA = line["a"];
		var pointB = line["b"];
		sourceDO.graphics().setLine(1.0, 0x99FFFFFF);
		// sourceDO.graphics().setLine(1.0, 0xFFFFFFFF);
		// sourceDO.graphics().setLine(2.0, 0xFFFFFFFF);
		sourceDO.graphics().beginPath();
		sourceDO.graphics().moveTo(pointA.x,pointA.y);
		sourceDO.graphics().lineTo(pointB.x,pointB.y);
		sourceDO.graphics().endPath();
		sourceDO.graphics().strokeLine();
	}


	var newImage = GLOBALSTAGE.renderImage(width,height, sourceDO, null, null, function(e){
		// console.log("rendered");
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(newImage);
		// console.log(imageFloat);
		callback(imageFloat);
	});
}


LineArt.AggregateScore = function(grayLines, grayTemplate, width, height){
/*
	

*/


		var totalError = 0;
		// var totalTemplateWeight = 0;
		// var totalLinePixels = 0;
		for(var y=0; y<height; ++y){
			for(var x=0; x<width; ++x){
				var index = y*width + x;
				var linePixel = grayLines[index];
				var templatePixel = grayTemplate[index];
				var lineAlpha = linePixel;
				var templateAlpha = templatePixel;


				var middle = 0.5;
				var lighter = Math.max(templatePixel-middle,0);
				var darker = Math.max(middle-templatePixel,0);


				var diff = Math.abs(linePixel - templatePixel);

				var error = (diff)*templateAlpha;





				// lineAlpha -- don't care about blank template locations

/*

				// var diff = Math.abs(linePixel - templatePixel);
				var diff = Math.abs(linePixel - templatePixel);

				var diff2 = diff*diff;
				var diffS = Math.pow(diff, 0.5);
				
				
				var isLineBrighterThanTemplate = linePixel > templatePixel;
				var isLineDarkerThanTemplate = linePixel < templatePixel;

				// var score = diffS*alpha;
				// var score = diff*alpha;
				// var score = diff2*alpha;



				// var score = diff*Math.sqrt(alpha);
				var score = diff2*alpha;

				

				// var score = diff2*alpha;
				// var score = diff;

				// totalTemplateWeight += templatePixel; // ?
				totalTemplateWeight += templatePixel*alpha; // ?
				totalLinePixels += linePixel;
*/
				totalError += error;
			}
		}
	return totalError;
}

LineArt.LineScore = function(grayLines, grayTemplate, width, height, lineLength){

	// console.log(grayLines, grayTemplate, width, height)


// lineLength is null for list ....


	// console.log(Code.infoArray(grayLines));
	// console.log(Code.infoArray(grayTemplate));


		var totalScore = 0;
		var totalTemplateWeight = 0;
		var totalLinePixels = 0;
		for(var y=0; y<height; ++y){
			for(var x=0; x<width; ++x){
				var index = y*width + x;
				var linePixel = grayLines[index];
				var templatePixel = grayTemplate[index];

				// the line is BOTH the absolute color AND the transparency
				
				// var diff = Math.abs(linePixel - templatePixel);
				var diff = Math.abs(1 - templatePixel);

				var diff2 = diff*diff;
				var diffS = Math.pow(diff, 0.5);
				var alpha = linePixel;
				
				var isLineBrighterThanTemplate = linePixel > templatePixel;
				var isLineDarkerThanTemplate = linePixel < templatePixel;

				// var score = diffS*alpha;
				// var score = diff*alpha;
				// var score = diff2*alpha;



				// var score = diff*Math.sqrt(alpha);
				var score = diff2*alpha;

				

				// var score = diff2*alpha;
				// var score = diff;

				// totalTemplateWeight += templatePixel; // ?
				totalTemplateWeight += templatePixel*alpha; // ?
				totalLinePixels += linePixel;

				totalScore += score;
			}
		}
// var d = V2D.distance(p, center);
// if(d>=envelopeRadius){
		//totalScore = totalScore/lineLength;
		// totalScore = totalScore/totalWeight;
		// totalScore = totalScore/totalWeight/lineLength;
		// totalScore = totalScore/totalWeight/lineLength;

		totalScore = totalScore/totalLinePixels;

		// totalScore = totalScore/totalTemplateWeight;
		// totalScore = totalScore/totalLinePixels;
		// totalScore = totalScore/totalWeight;
/*
HEIRISTICTS:
longer lines should allow for somewhat more error: they add more definition to the result
	-> normalize the error by line length / pixels touched




individual line has error wrt image template
individual line has error wrt cumulative image


*/
	

	return totalScore;
}
LineArt.areLinesTheSame = function(lineA,lineB){
	if(lineA["a"]==lineB["a"]){
		if(lineA["b"]==lineB["b"]){
			return true;
		}
	}else if(lineA["b"]==lineB["a"]){
		if(lineA["a"]==lineB["b"]){
			return true;
		}
	}
	return false;
}



LineArt.prototype.debugDisplayLines = function(){
	// console.log("debugDisplayLines");

	var lineart = this;





	var points = this._tick_points;
	var canvasColor = this._tick_canvasColor;
	var stringColor = this._tick_stringColor;
	var lineList = this._tick_lineList;
	var width = this._tick_width;
	var height = this._tick_height;
	var grayscale = this._tick_gray;
	var lines = this._tick_lineList;
	

	var displayImage = this._displayImage;
	var displayScale = this._displayScale;
	
	var cummulative = new DO();
	cummulative.graphics().clear();
	
	cummulative.graphics().setFill(0xFF000000);
	cummulative.graphics().beginPath();
	cummulative.graphics().drawRect(0,0, width,height);
	cummulative.graphics().endPath();
	cummulative.graphics().fill();

	// cummulative.graphics().setLine(1.0, 0x33FFFFFF);
	
	for(var i=0; i<lines.length; ++i){
		// console.log("line: "+i);
		var line = lines[i];
		var a = line["a"];
		var b = line["b"];
		cummulative.graphics().setLine(1.0, 0x66FFFFFF);
		cummulative.graphics().beginPath();
		cummulative.graphics().moveTo(a.x,a.y);
		cummulative.graphics().lineTo(b.x,b.y);
		cummulative.graphics().endPath();
		cummulative.graphics().strokeLine();
	}
	


	var newImage = GLOBALSTAGE.renderImage(width,height,cummulative, null, null, function(e){
		// console.log("rendered full image");
		var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(newImage);
		var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);
		var putative = imageMatrixA.getGrayFloat();

		// console.log(putative);
		// console.log(Code.infoArray(putative));

		if(displayImage){
			displayImage.removeParent();
		}

		var d = new DOImage(newImage);
		GLOBALSTAGE.addChild(d);
		d.matrix().scale(displayScale);
		d.matrix().translate(800,20);
		lineart._displayImage = d;
		
	});
}
/*

STEPS:
	for ~1000 loops:
		- pick a random point A
		- pick a subset of random points {B} [10-100] (not the same as A )
		- for each point B in {B}
			- calculate the cost:
				line cost = sum[  abs( line_pixel_i - template_pixel_i) * transparency_line_pixel_i  ] / line_length
		- choose the line with the lowest cost
			- add line to list of lines
			- remove duplicate lines
	
	pick a random starting line
	until complete:
		- find line with closest point (end A or B)
		- remove closest line from search list
		- add closest line to sorted list


COST:
	- make sure costs only include the LINE cost and not rest of the image overlayed
		=> TRANSPARENT, not WHITE in all the other spots
		- multiplied by transparancy




COLOR:
	- convert source image to a grayscale based on 'distance' from desired color


ADD ON / ROUTES:
	- cumulatively add lines in order
	- pick lines at random and add

	- after many iterations:
		- use accumulated set of lines and start adding those in order, picking the 'next best one' at random
		- worse lines will slowly move towards the bottom
		- a random and non-exhaustive method has to be used

	- 


- make 1000 lines
	- then move them around until the total image area is optimized
		- each line try ~10 other random locations

Hierholzer's algorithm


*/
LineArt.prototype.SKIPPED = function(){


// throw "?";
	// ImageMatScaled
	// var grayscaleImage = new ImageMat(width,height, grayscale,grayscale,grayscale);
	

	// var blur = ImageMat.getBlurredImage(grayscale, width,height, 1.5);
/*
	var blur = grayscale;
	var dx = ImageMat.derivativeX(blur, width,height);
		dx = dx["value"];
	var dy = ImageMat.derivativeY(blur, width,height);
		dy = dy["value"];

	var absdx = ImageMat.absFloat(dx);
	var absdy = ImageMat.absFloat(dy);
*/

/*
	// console.log(dx);
	// console.log(dy);


	//TODO: maybe adding should be (dx,dy) length, not dx+dy

	// var combined = ImageMat.normalFloat01(grayscale);
	// throw "?"
	// var combined = ImageMat.addFloat(absdx, absdy);
	// console.log(combined);
	// combined = ImageMat.normalFloat01(combined);

	// combined = ImageMat.pow(combined, 1.5);


	// inverted = ImageMat.invertFloat01(grayscale);
	// combined = ImageMat.addFloat(combined, inverted);
	// combined = ImageMat.normalFloat01(combined);

	// combined = ImageMat.invertFloat01(combined);
	// console.log(combined);




	
	// combined = ImageMat.normalFloat01(combined);

	var grayscaleImage = new ImageMat(width,height, combined,combined,combined);
	// var grayscaleImage = new ImageMat(width,height, grayscale,grayscale,grayscale);
// get an edge image:

*/



	// var blur = lowResGray;
	var blur = ImageMat.getBlurredImage(lowResGray, lowResWidth,lowResHeight, 2.0);
	var dx = ImageMat.derivativeX(blur, lowResWidth,lowResHeight);
		dx = dx["value"];
	var dy = ImageMat.derivativeY(blur, lowResWidth,lowResHeight);
		dy = dy["value"];



	lowResGray = blur;
	// lowResGray = ImageMat.normalFloat01(lowResGray);


	// masking:
	for(var y=0; y<lowResHeight; ++y){
		for(var x=0; x<lowResWidth; ++x){
			var index = y*lowResWidth + x;
			var p = new V2D(x,y);
			var d = V2D.distance(p, center);
			if(d>=envelopeRadius){
				lowResGray[index] = 0;
				dx[index] = 0;
				dy[index] = 0;
			}
		}
	}
	// rescale
	lowResGray = ImageMat.normalFloat01(lowResGray);



	var img = GLOBALSTAGE.getFloatRGBAsImage(lowResGray,lowResGray,lowResGray, lowResWidth, lowResHeight);
	var d = new DOImage(img);
	this._root.addChild(d);
	//d.graphics().alpha(0.001);
	d.matrix().scale(displayScale);
	d.matrix().translate(400,10);
	d.graphics().setLine(1.0, 0xFFFF0000);
	d.graphics().setFill(0xFF0000FF);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		d.graphics().drawCircle(point.x,point.y, 2.0);
	}
	d.graphics().strokeLine();



// throw "..."



		// FOR EACH PIXEL: can get a line dx,dy & point = line
		// ignore points outside of circle
/*
		find 2 closest points for each intersection (each direction)
		add to list
*/

var pairs = [];
	
		
		for(var y=0; y<lowResHeight; ++y){
			for(var x=0; x<lowResWidth; ++x){
				var index = y*lowResWidth + x;

				var g = lowResGray[index];
				// console.log(g);
				// only want darkest colors to matter
				// if(g>0.75){
				// if(g>0.25){

				// 0->1
				if(g<0.75){
				// if(g<0.6){
					continue;
				}

				var p = new V2D(x,y);

				var d = V2D.distance(p, center);
				if(d>=envelopeRadius){
					continue;
				}

				var d = new V2D(dx[index],dy[index]);

				if(d.length()==0){
					continue;
				}
// console.log(g);
// console.log(d+" ? ");
				d.norm();
				d.rotate(Math.PI*0.5);

// console.log(d+"");

				
				var bestPointA = LineArt.bestDotPoint(points, p,d);
				var bestPointB = LineArt.bestDotPoint(points, p,d.copy().flip());
				
				pairs.push(bestPointA,bestPointB);

				// pairs.push(bestPointA,p.copy());


				// pairs.push(p, p.copy().add(1,1));

				// var a = d.copy().scale(5);
// console.log(a+"");
				// var b = V2D.add(p,a);
				// pairs.push(p, b);


// pairs.push(p, p.copy().add(1,1));

				// throw "..."
			}
		}
console.log(pairs);




// clear
Code.emptyArray(pairs);

		// throw "..."




// throw "..."

	var cummulative = new DO();


/*
// make a list of lines
	- each line gets a convolution vote w/ score 
	OBJECT:
		{
			a: pointA
			b: pointB
			s: score
		}
	- sort the list each time,
	- only use top ~100-1000 lines
	-> drop repeated a-b points
*/
	this._tick_votes = [];

	this._tick_points = points;
	// this._tick_lines = [];
this._tick_lines = pairs;
	this._displayScale = displayScale;
	this._tick_cum = cummulative;
	this._tick_width = lowResWidth;
	this._tick_height = lowResHeight;
	this._tick_gray = lowResGray;

	this._tick_error = null;

	var lineart = this;

	var ticker = new Ticker(1);
	this._ticker = ticker;
	var tickerFxn = function(){
		ticker.stop();
		lineart.tickIterate();
		// ticker.start();
	}

	ticker.addFunction(Ticker.EVENT_TICK, tickerFxn, this);
	ticker.start();
/*
	show grayscale image

	define where points are wrt image

	show points in image
		[start with a circle]

	create lower-res image ()

	for each iteration:
		- choose 2 random points
		- create line in space
		- render to image
		- compare grayscale image w/ new potential image
		- if error is better -> keep, else -> drop


	show final result in low res

	show final result in hi res


	// order the lines

*/
}

LineArt.bestDotPoint = function(points, p,d){
	var bestDot = null;
	var bestPoint = null;
	// console.log("bestDotPoint",points)
	for(var i=0; i<points.length;++i){
		var point = points[i];
		// console.log(point);
		var toPoint = V2D.sub(point,p);
			toPoint.norm();
		var dot = V2D.dot(toPoint, d);
		if(bestPoint==null || dot>bestDot){
			bestDot = dot;
			bestPoint = point;
		}
	}
	// console.log(bestDot+" - "+bestPoint);
	return bestPoint;
}

LineArt.prototype.tickIterate = function(){
	// console.log("tick");

	var cummulative = this._tick_cum;
	var points = this._tick_lines;
	var width = this._tick_width;
	var height = this._tick_height;
	var gray = this._tick_gray;
	var displayScale = this._displayScale;

	cummulative.graphics().clear();
	// cummulative.graphics().setLine(1.0, 0xFFFFFFFF);
	// cummulative.graphics().setFill(0xFFFFFFFF);
	cummulative.graphics().setFill(0xFF000000);
	cummulative.graphics().beginPath();
	cummulative.graphics().drawRect(0,0, width,height);
	cummulative.graphics().endPath();
	cummulative.graphics().fill();
	// cummulative.graphics().strokeLine();


// console.log(this._tick_error);
	if( !(this._tick_error==null) ){
		// pick 2 random points
		var list = this._tick_points;

// console.log("pick 2 points");
		var a = Code.arrayRandomItem(list);
		var b = Code.arrayRandomItem(list);
		// console.log(a+"->"+b);
		//this._putativeLine = [a,b];
		points.push( a,b );
		// throw "...";
	}

	for(var i=0; i<points.length; i+=2){
		// break;?
		// cummulative.graphics().setLine(1.0, 0xFF000000); // alpha matters a bit, thickness depends on 
		//cummulative.graphics().setLine(1.0, 0xCC000000);
		// cummulative.graphics().setLine(1.0, 0x99000000);
		// cummulative.graphics().setLine(1.0, 0x33000000);
		// cummulative.graphics().setLine(1.0, 0x99FFFFFF);
		cummulative.graphics().setLine(1.0, 0x33FFFFFF);
		// cummulative.graphics().setLine(1.0, 0x11FFFFFF);


		// cummulative.graphics().setLine(1.0, 0x99FF0000);
		cummulative.graphics().beginPath();
		cummulative.graphics().moveTo(points[i+0].x,points[i+0].y);
		//cummulative.graphics().lineTo(width,height);
		cummulative.graphics().lineTo(points[i+1].x,points[i+1].y);
		cummulative.graphics().endPath();
		cummulative.graphics().strokeLine();
	}

	this.renderCummulative();

}




LineArt.prototype.renderCummulative = function(){
	var lineart = this;

	var cummulative = this._tick_cum;
	var width = this._tick_width;
	var height = this._tick_height;
	var grayscale = this._tick_gray;
	var ticker = this._ticker;
	var displayImage = this._displayImage;
	var displayScale = this._displayScale;
	//var list = this._tick_points;
	var points = this._tick_lines;
	

	var newImage = GLOBALSTAGE.renderImage(width,height,cummulative, null, null, function(e){
		// console.log("rendered");

		var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(newImage);
		// console.log(imageFloatA);
		var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);
		// console.log(imageMatrixA);
		var putative = imageMatrixA.getGrayFloat();

		// console.log(putative);
		// console.log(Code.infoArray(putative));

		if(displayImage){
			displayImage.removeParent();
		}

		var d = new DOImage(newImage);
		GLOBALSTAGE.addChild(d);
		d.matrix().scale(displayScale);
		d.matrix().translate(800,20);
		lineart._displayImage = d;
		
		

		var error = LineArt.ErrorFxn(grayscale,putative, width, height);
		// console.log(error);

		if(lineart._tick_error==null){
			lineart._tick_error = error;
			console.log("FIRST ERROR: "+this._tick_error);
		}else{
			if(error < lineart._tick_error){
			// if(error > lineart._tick_error){
				console.log("better "+points.length+" -> "+error+" < "+lineart._tick_error);
				lineart._tick_error = error;
			}else{
				// console.log("worse");
				console.log(error+" > "+lineart._tick_error);
				points.pop(); // A
				points.pop(); // B
			}
		}

//		ticker.start();
		
	});

}



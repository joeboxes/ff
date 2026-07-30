// SuperRes.js

function SuperRes(){
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

	var imageList = ["image_1.jpg"];//,"image_2.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}

SuperRes.prototype.handleImagesLoaded = function(imageInfo){
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
		d.graphics().alpha(0.001);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	//
	var learnInputSize = 8;
	var learnOutputSize = 16;
	//var NN = new NeuralNetwork({"layers":[8,10,12,14,16]});
	//var NN = new NeuralNetwork({"layers":[8,12,14,16]});
	// 8 x 8 = 32
	// 10x10 = 100
	// 12x12 = 144
	// 14x14 = 196
	// 16x16 = 256
	//var NN = new NeuralNetwork({"layers":[64,100,144,196,256]});
	var NN = new NeuralNetwork({"layers":[64,256,256,256,256]});
	NN.init();
	// generate outputs & inputs
	
	var divisionsX = Math.floor(imageMatrixA.width()/learnOutputSize);
	var divisionsY = Math.floor(imageMatrixA.height()/learnOutputSize);
	var inputVectors = [];
	var outputVectors = [];
	// learn
	for(j=0; j<divisionsY; ++j){
		for(i=0; i<divisionsX; ++i){
			var TL = new V2D(i*divisionsX, j*divisionsY);
			//var TL = new V2D(i*divisionsX, j*divisionsY);
			//var TL = new V2D(i*learnOutputSize, j*learnOutputSize);
			var center = new V2D( TL.x + learnOutputSize*0.5, TL.y + learnOutputSize*0.5);
			//var center = new V2D( i*learnOutputSize, j*learnOutputSize);
			var learnOutput = imageMatrixA.extractRectFromFloatImage(center.x,center.y, 1.0,null, learnOutputSize,learnOutputSize);
			//learnOutput = imageMatrixA.subImage(center.x,center.y,learnOutputSize,learnOutputSize);
			//var learnInput = learnOutput.extractRectFromFloatImage(learnOutputSize*0.5,learnOutputSize*0.5, learnOutputSize/learnInputSize,null, learnInputSize,learnInputSize);
			var learnInput = imageMatrixA.extractRectFromFloatImage(center.x,center.y, learnOutputSize/learnInputSize,null, learnInputSize,learnInputSize);

			var gryIn = learnInput.gry();
			var gryOut = learnOutput.gry();
					// 
					// sca = 2.0
					// //img = GLOBALSTAGE.getFloatRGBAsImage(learnOutput.red(), learnOutput.grn(), learnOutput.blu(), learnOutput.width(), learnOutput.height());
					// img = GLOBALSTAGE.getFloatRGBAsImage(gryOut,gryOut,gryOut, learnOutputSize,learnOutputSize);
					// d = new DOImage(img);
					// d.matrix().scale(sca);
					// d.matrix().translate(50 + i*(learnOutputSize+0)*sca, 50 + j*(learnOutputSize+0)*sca);
					// GLOBALSTAGE.addChild(d);
					// 
					// sca = 2.0
					// img = GLOBALSTAGE.getFloatRGBAsImage(learnInput.red(), learnInput.grn(), learnInput.blu(), learnInput.width(), learnInput.height());
					// d = new DOImage(img);
					// d.matrix().scale(sca);
					// d.matrix().translate(650 + i*(learnInputSize+1)*sca, 50 + j*(learnInputSize+1)*sca);
					// GLOBALSTAGE.addChild(d);

			

			//console.log(gryIn.length+" => "+gryOut.length);

			// gryIn = Code.copyArray(gryIn,0,learnInputSize-1);
			// gryOut = Code.copyArray(gryOut,0,learnOutputSize-1);

			inputVectors.push(gryIn);
			outputVectors.push(gryOut);
			//console.log(gryIn,gryOut);
			//return;
		}
	}

	var ticker = new Ticker(10);

	var display = this._root;
	//console.log(NN.toString());

	// var testVectorOutput = imageMatrixA.extractRectFromFloatImage(center.x,center.y, 1.0,null, learnOutputSize,learnOutputSize);
	// var testVectorInput = learnOutput.extractRectFromFloatImage(learnOutputSize*0.5,learnOutputSize*0.5, learnOutputSize/learnInputSize,null, learnInputSize,learnInputSize);

	var progressFxn = function(nn){
		display.removeAllChildren();
		// TEST:
		var smallSize = 8;
		var largeSize = 16;
		var i = 0;
		var input = inputVectors[i];
		var output = outputVectors[i];
		var predict = nn.predict(input);
		var sca;
		/*
		sca = 4.0;
		// sma
		img = GLOBALSTAGE.getFloatRGBAsImage(input,input,input, smallSize,smallSize);
		d = new DOImage(img);
		d.matrix().scale(sca*2);
		d.matrix().translate(100,100);
		display.addChild(d);
		// big
		img = GLOBALSTAGE.getFloatRGBAsImage(output,output,output, largeSize,largeSize);
		d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(200,100);
		display.addChild(d);

		// big 2
		img = GLOBALSTAGE.getFloatRGBAsImage(predict,predict,predict, largeSize,largeSize);
		d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(300,100);
		display.addChild(d);
		*/

		sca = 1.0;

		var index = 0;
		var i, j;
		for(j=0; j<divisionsY; ++j){
			for(i=0; i<divisionsX; ++i){
				index = j*divisionsX + i;
				var input = inputVectors[index];
				var output = outputVectors[index];
				var predict = nn.predict(input);

					// img = GLOBALSTAGE.getFloatRGBAsImage(gryOut,gryOut,gryOut, learnOutputSize,learnOutputSize);
					// d = new DOImage(img);
					// d.matrix().scale(sca);
					// d.matrix().translate(50 + i*(learnOutputSize+0)*sca, 50 + j*(learnOutputSize+0)*sca);
					// GLOBALSTAGE.addChild(d);

				// sma
				img = GLOBALSTAGE.getFloatRGBAsImage(input,input,input, smallSize,smallSize);
				d = new DOImage(img);
				d.matrix().scale(sca*2);
				d.matrix().translate(100 + i*smallSize*sca*2,100 + j*smallSize*sca*2);
				display.addChild(d);
				// big
				img = GLOBALSTAGE.getFloatRGBAsImage(output,output,output, largeSize,largeSize);
				d = new DOImage(img);
				d.matrix().scale(sca);
				d.matrix().translate(400 + i*largeSize*sca,100 + j*largeSize*sca);
				display.addChild(d);
				// pre
				img = GLOBALSTAGE.getFloatRGBAsImage(predict,predict,predict, largeSize,largeSize);
				d = new DOImage(img);
				d.matrix().scale(sca);
				d.matrix().translate(700 + i*largeSize*sca,100 + j*largeSize*sca);
				display.addChild(d);

				++index;
			}
		}
	};

	var tickerFxn = function(){
		ticker.stop();
		var error = NN.learn(inputVectors, outputVectors, 1, null);
		progressFxn(NN);
		
		ticker.start();
	}

	
	ticker.addFunction(Ticker.EVENT_TICK, tickerFxn, this);
	ticker.start();

	//var error = NN.learn(inputVectors, outputVectors, 1, null);
	//console.log(NN.toString());



	
	//var NN = new NeuralNetwork({"layers":[8,8,8]});


	// apply to an example image

	// combine segments

}


/*

  64    =>   256
[8 x 8] => [16 x 16]

  256     =>  1024  
[16 x 16] => [32x32]




*/

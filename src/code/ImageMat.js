// ImageMat.js
ImageMat.tempA = new V3D();
ImageMat.tempB = new V3D();
ImageMat.tempC = new V3D();
ImageMat.tempD = new V3D();
ImageMat.tempE = new V3D();
ImageMat.tempF = new V3D();
ImageMat.tempG = new V3D();
ImageMat.tempH = new V3D();
ImageMat.tempI = new V3D();
ImageMat.tempJ = new V3D();
ImageMat.tempK = new V3D();
ImageMat.tempL = new V3D();
ImageMat.tempM = new V3D();
ImageMat.tempN = new V3D();
ImageMat.tempO = new V3D();
ImageMat.tempP = new V3D();
function ImageMat(wid, hei, r,g,b){
	this.init(wid,hei,r,g,b);
}
ImageMat.prototype.init = function(wid,hei,r,g,b){
	this._width = wid;
	this._height = hei;
	this._size = new V2D(wid,hei);
	this._y = null; // hold for reuse
	if(wid>0 && hei>0){
		var len = wid*hei;
		this._r = new Array(len);
		this._g = new Array(len);
		this._b = new Array(len);
		if(r!=undefined){
			if(g!==undefined && b!==undefined){
				this.fromFloats(r,g,b);
			}else{
				this.fromFloats(r,r,r);
			}
		}else{
			this.zeroAll();
		}
	}
}

ImageMat.prototype.zeroAll = function(){
	var i, len = this._width*this._height;
	this._y = null;
	for(i=0;i<len;++i){
		this._r[i] = 0;
		this._g[i] = 0;
		this._b[i] = 0;
	}
}
ImageMat.prototype.to3Array = function(){
	return [this._r,this._g,this._b, this._width,this._height];
}
ImageMat.prototype.unset = function(){
	this._width = undefined;
	this._height = undefined;
	this._size = null;
	this._y = null;
	this._r = null;
	this._g = null;
	this._b = null;
}
ImageMat.prototype.toString = function(){
	return "[ImageMat: "+this.width()+"x"+this.height()+"]";
}
ImageMat.prototype.kill = function(){
	if(this._y){
		Code.emptyArray(this._y);
	}
	Code.emptyArray(this._r);
	Code.emptyArray(this._g);
	Code.emptyArray(this._b);
	this.unset();
}
ImageMat.relativeScale = function(imageA,imageB){
	return (imageA.width()/imageB.width() + imageA.height()/imageB.height())*0.5;
}
// ------------------------------------------------------------------------------------------------------------------------ static
ImageMat.debugImage = function(width,height){
	var image = new ImageMat(width,height);
	var wm1 = width - 1;
	var hm1 = height - 1;
	// base gradient
	var colorUL = new V3D(1,0,0);
	var colorUR = new V3D(0,1,0);
	var colorLL = new V3D(0,0,1);
	var colorLR = new V3D(0.5,0.5,0.5);
	var p = [];
	var v = new V3D();
	for(var j=0; j<height; ++j){
		var pY = j/hm1;
		for(var i=0; i<width; ++i){
			var pX = i/wm1;
			Code.linear2DPercentages(pX,pY,p);
			v.x = p[0]*colorUL.x + p[1]*colorUR.x + p[2]*colorLL.x + p[3]*colorLR.x;
			v.y = p[0]*colorUL.y + p[1]*colorUR.y + p[2]*colorLL.y + p[3]*colorLR.y;
			v.z = p[0]*colorUL.z + p[1]*colorUR.z + p[2]*colorLL.z + p[3]*colorLR.z;
			// Code.linear2D = function(pX,pY, colorUL,B,C,D);
			image.setPoint(i,j, v);
		}
	}
	// horizontal & vertical lines
	var spacingX = 50;
	var spacingY = 100;
	v.set(0,0,0);
	var countX = Math.floor(width/spacingX);
	var offsetX = Math.floor((width - countX*spacingX)*0.5);
	var countY = Math.floor(height/spacingY);
	var offsetY = Math.floor((height - countY*spacingY)*0.5);
	for(var i=offsetX; i<width; i+=spacingX){
		for(var j=0; j<height; ++j){
			image.setPoint(i,j, v);
		}
	}
	for(var j=offsetY; j<height; j+=spacingY){
		for(var i=0; i<width; ++i){
			image.setPoint(i,j, v);
		}
	}
	// border
	v.set(1,1,1);
	var i = 0;
	for(var j=0; j<height; ++j){
		image.setPoint(i,j, v);
	}
	var i = wm1;
	for(var j=0; j<height; ++j){
		image.setPoint(i,j, v);
	}
	var j = 0;
	for(var i=0; i<width; ++i){
		image.setPoint(i,j, v);
	}
	var j = hm1;
	for(var i=0; i<width; ++i){
		image.setPoint(i,j, v);
	}
	// done
	return image;
}
// ------------------------------------------------------------------------------------------------------------------------ funziez
ImageMat.prototype.setPoint = function(x,y, val){
	var index = y*this.width() + x;
	this._r[index] = val.x;
	this._g[index] = val.y;
	this._b[index] = val.z;
	return val;
}
ImageMat.prototype.get = function(x,y, val){
	var index = y*this.width() + x;
	val.x = this._r[index];
	val.y = this._g[index];
	val.z = this._b[index];
	return val;
}
ImageMat.prototype.getPoint = function(val, x,y){
	this.getPointInterpolateCubic(val,x,y);
	
}
ImageMat.prototype.getPointNearest = function(val, x,y){
	throw "todo";
	// return getPointInterpolateNearest(val,x,y);
}
ImageMat.prototype.getPointLinear = function(val, x,y){
	throw "todo";
	// return getPointInterpolateLinear(val,x,y);
}
ImageMat.prototype.getPointCubic = function(val, x,y){
	throw "todo";
	// this.getPointInterpolateCubic(val,x,y);
}
ImageMat.prototype.fill = function(color){
	var r = this._r;
	var g = this._g;
	var b = this._b;
	var len = r.length;
	for(var i=len-1; i>=0; i--){
		r[i] = color.x;
		g[i] = color.y;
		b[i] = color.z;
	}
	return this;
}
ImageMat.prototype.clear = function(){
	this.fill(new V3D(0,0,0));
	return this;
}

ImageMat.prototype.drawRect = function(x,y,w,h,color){
	// throw ("drawRect");
	var endX = x+w;
	var endY = y+h;
	for(var j=y; j<endY; ++j){
		for(var i=x; i<endX; ++i){
			this.setPoint(i,j, color);
		}
	}
	return this;
}

ImageMat.prototype.getPointInterpolateCubic = function(val, x,y){ // 4^2 = 16 points
	var wid = this._width, hei = this._height, r = this._r, g = this._g, b = this._b;
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var miiX = Math.max(minX-1, 0);
	var miiY = Math.max(minY-1, 0);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var maaX = Math.min(maxX+1, wm1);
	var maaY = Math.min(maxY+1, hm1);
	var indexA = miiY*wid + miiX; var colA = ImageMat.tempA.set(r[indexA],g[indexA],b[indexA]);
	var indexB = miiY*wid + minX; var colB = ImageMat.tempB.set(r[indexB],g[indexB],b[indexB]);
	var indexC = miiY*wid + maxX; var colC = ImageMat.tempC.set(r[indexC],g[indexC],b[indexC]);
	var indexD = miiY*wid + maaX; var colD = ImageMat.tempD.set(r[indexD],g[indexD],b[indexD]);
	var indexE = minY*wid + miiX; var colE = ImageMat.tempE.set(r[indexE],g[indexE],b[indexE]);
	var indexF = minY*wid + minX; var colF = ImageMat.tempF.set(r[indexF],g[indexF],b[indexF]);
	var indexG = minY*wid + maxX; var colG = ImageMat.tempG.set(r[indexG],g[indexG],b[indexG]);
	var indexH = minY*wid + maaX; var colH = ImageMat.tempH.set(r[indexH],g[indexH],b[indexH]);
	var indexI = maxY*wid + miiX; var colI = ImageMat.tempI.set(r[indexI],g[indexI],b[indexI]);
	var indexJ = maxY*wid + minX; var colJ = ImageMat.tempJ.set(r[indexJ],g[indexJ],b[indexJ]);
	var indexK = maxY*wid + maxX; var colK = ImageMat.tempK.set(r[indexK],g[indexK],b[indexK]);
	var indexL = maxY*wid + maaX; var colL = ImageMat.tempL.set(r[indexL],g[indexL],b[indexL]);
	var indexM = maaY*wid + miiX; var colM = ImageMat.tempM.set(r[indexM],g[indexM],b[indexM]);
	var indexN = maaY*wid + minX; var colN = ImageMat.tempN.set(r[indexN],g[indexN],b[indexN]);
	var indexO = maaY*wid + maxX; var colO = ImageMat.tempO.set(r[indexO],g[indexO],b[indexO]);
	var indexP = maaY*wid + maaX; var colP = ImageMat.tempP.set(r[indexP],g[indexP],b[indexP]);
	if(miiX<0||minX<0||maxX>wm1||maaX>wm1 || miiY<0||minY<0||maxY>hm1||maaY>hm1){
		throw("undefined");
	}
	minX = x - minX;
	minY = y - minY;
	ImageMat.cubicColor(val, minX,minY, colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP);
}
ImageMat.prototype.getPointInterpolateQuadric = function(val, x,y){ // 3^2 = 9 points
	// this maaaaaaaay not be useful
}
ImageMat.prototype.getPointInterpolateLinear = function(val, x,y){ // 2^2 = 4 points [BiLinear]
	var wid = this._width, hei = this._height, r = this._r, g = this._g, b = this._b;
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var indexA = minY*wid + minX; var colA = ImageMat.tempA.set(r[indexA],g[indexA],b[indexA]);
	var indexB = minY*wid + maxX; var colB = ImageMat.tempB.set(r[indexB],g[indexB],b[indexB]);
	var indexC = maxY*wid + minX; var colC = ImageMat.tempC.set(r[indexC],g[indexC],b[indexC]);
	var indexD = maxY*wid + maxX; var colD = ImageMat.tempD.set(r[indexD],g[indexD],b[indexD]);
	minX = x - minX;
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	ImageMat.linearColor(val, minX,minY, colA,colB,colC,colD);
}
ImageMat.prototype.getPointInterpolateNearest = function(val, x,y){ // 1 point
	x = Math.min(Math.max(Math.round(x),0),this._width-1);
	y = Math.min(Math.max(Math.round(y),0),this._height-1);
	index = y*this._width + x;
	val.x = this._r[index];
	val.y = this._g[index];
	val.z = this._b[index];
}
ImageMat.cubicColor = function(colR, x,y, colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP){
	var r = Code.cubic2D(x,y, colA.x,colB.x,colC.x,colD.x,colE.x,colF.x,colG.x,colH.x,colI.x,colJ.x,colK.x,colL.x,colM.x,colN.x,colO.x,colP.x);
	var g = Code.cubic2D(x,y, colA.y,colB.y,colC.y,colD.y,colE.y,colF.y,colG.y,colH.y,colI.y,colJ.y,colK.y,colL.y,colM.y,colN.y,colO.y,colP.y);
	var b = Code.cubic2D(x,y, colA.z,colB.z,colC.z,colD.z,colE.z,colF.z,colG.z,colH.z,colI.z,colJ.z,colK.z,colL.z,colM.z,colN.z,colO.z,colP.z);
	colR.x = Math.min(Math.max(r,0.0),1.0);
	colR.y = Math.min(Math.max(g,0.0),1.0);
	colR.z = Math.min(Math.max(b,0.0),1.0);
}
// ImageMat.cubic2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
// 	var xx = x*x; var xxx = xx*x;
// 	var yy = y*y; var yyy = yy*y;
// 	var a = ImageMat.cubic1D(x,xx,xxx, A,B,C,D);
// 	var b = ImageMat.cubic1D(x,xx,xxx, E,F,G,H);
// 	var c = ImageMat.cubic1D(x,xx,xxx, I,J,K,L);
// 	var d = ImageMat.cubic1D(x,xx,xxx, M,N,O,P);
// 	return ImageMat.cubic1D(y,yy,yyy, a,b,c,d);
// }
// ImageMat.cubic1D = function(t,tt,ttt,A,B,C,D){
// 	var a = B;
// 	var b = 0.5*(C-A);
// 	var c = A - 2.5*B + 2.0*C - 0.5*D;
// 	var d = 1.5*(B-C) + 0.5*(D-A);
// 	return (a + b*t + c*tt + d*ttt);
// }
// ImageMat.linear2D = function(x,y, colA,colB,colC,colD){
// 	return Code.linear2D(x,y, colA,colB,colC,colD);
// }
ImageMat.linearColor = function(colR, x,y, colA,colB,colC,colD){
	var r = Code.linear2D(x,y, colA.x,colB.x,colC.x,colD.x);
	var g = Code.linear2D(x,y, colA.y,colB.y,colC.y,colD.y);
	var b = Code.linear2D(x,y, colA.z,colB.z,colC.z,colD.z);
	colR.x = Math.min(Math.max(r,0.0),1.0);
	colR.y = Math.min(Math.max(g,0.0),1.0);
	colR.z = Math.min(Math.max(b,0.0),1.0);
}

// ------------------------------------------------------------------------------------------------------------------------ get
ImageMat.prototype.copy = function(){
	var mat = new ImageMat(this.width(), this.height(), this.red(), this.grn(), this.blu());
	return mat;
}
ImageMat.prototype.getHex = function(i,j){
	var index = j*this._width + i;
	var r = this._r[index];
	var g = this._g[index];
	var b = this._b[index];
	var a = 1.0;//this._r[index];
	return Code.getColARGBFromFloat(a,r,g,b);
}
ImageMat.prototype.red = function(r){
	if(r!==undefined){
		this._y = null;
		Code.copyArray(this._r, r);
	}
	return this._r;
}
ImageMat.prototype.grn = function(g){
	if(g!==undefined){
		this._y = null;
		Code.copyArray(this._g, g);
	}
	return this._g;
}
ImageMat.prototype.blu = function(b){
	if(b!==undefined){
		this._y = null;
		Code.copyArray(this._b, b);
	}
	return this._b;
}
ImageMat.prototype.gry = function(v){
	if(v!==undefined){
		this._y = v;
		return this._y;
	}
	if(!this._y){
		this._y = ImageMat.grayFromRGBFloat(this._r,this._g,this._b);
	}
	return this._y;
}
ImageMat.prototype.size = function(){
	return this._size; // new V2D(this._width,this._height);
}
ImageMat.prototype.width = function(w){
	return this._width;
}
ImageMat.prototype.height = function(h){
	return this._height;
}
ImageMat.prototype.getRedFloat = function(){
	return Code.copyArray(new Array(), this._r);
}
ImageMat.prototype.getGrnFloat = function(){
	return Code.copyArray(new Array(), this._g);
}
ImageMat.prototype.getBluFloat = function(){
	return Code.copyArray(new Array(), this._b);
}
ImageMat.prototype.getGrayFloat = function(){
	return ImageMat.grayFromRGBFloat(this._r, this._g, this._b);
}
ImageMat.prototype.getArrayARGB = function(){
	var i, len = this._r.length;
	var data = new Array(len);
	for(i=0;i<len;++i){
		data[i] = Code.getColARGB( 0xFF, Math.round(this._r[i]*255.0), Math.round(this._g[i]*255.0), Math.round(this._b[i]*255.0) );
	}
	return data;
}
ImageMat.prototype.getSubImageIndex = function(colSta,colEnd, rowSta,rowEnd){
	var i, j, index, ind;
	var wid = colEnd-colSta+1;
	var hei = colEnd-colSta+1;
	var len = wid*hei;
	var r = new Array(len), g = new Array(len), b = new Array(len);
	for(index=0, j=rowSta;j<=rowEnd;++j){
		for(i=colSta;i<=colEnd;++i,++index){
			ind = j*this._width + i;
			r[index] = this._r[ind];
			g[index] = this._g[ind];
			b[index] = this._b[ind];
		}
	}
	var image = new ImageMat(wid,hei);
	image.fromFloats(r,g,b);
	return image;
}
ImageMat.prototype.getSubImage = function(px,py, wid,hei){
	return ImageMat.extractRect(this, px-wid/2.0,py-hei/2.0, px+wid/2.0,py-hei/2.0, px+wid/2.0,py+hei/2.0, px-wid/2.0,py+hei/2.0, wid,hei);
}
ImageMat.subImage = function(image,width,height, offX,offY,wid,hei){ // include
	var sub = [wid*hei];
	var i, j;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			sub[j*wid+i] = image[(offY+j)*width + (offX+i)];
		}
	}
	return sub;
}
ImageMat.setSubImage = function(image,width,height, offX,offY, sub,wid,hei){ // include
	var i, j;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			image[(offY+j)*width + (offX+i)] = sub[j*wid+i];
		}
	}
	return image;
}

ImageMat.prototype.subImage = function(offX,offY,wid,hei){ // exact-pixel imaging
	var image = new ImageMat(wid,hei);
	var width = this.width();
	var height = this.height();
	var red = ImageMat.subImage(this.red(),width,height, offX,offY,wid,hei);
	var grn = ImageMat.subImage(this.grn(),width,height, offX,offY,wid,hei);
	var blu = ImageMat.subImage(this.blu(),width,height, offX,offY,wid,hei);
	image.red(red);
	image.grn(grn);
	image.blu(blu);
	return image;
}


ImageMat.prototype.setSubImage = function(offX,offY, block){ // exact-pixel imaging
	var width = this.width();
	var height = this.height();
	var bw = block.width();
	var bh = block.height();
	var red = ImageMat.setSubImage(this.red(),width,height, offX,offY, block.red(),bw,bh);
	var grn = ImageMat.setSubImage(this.grn(),width,height, offX,offY, block.grn(),bw,bh);
	var blu = ImageMat.setSubImage(this.blu(),width,height, offX,offY, block.blu(),bw,bh);
	return this;
}


ImageMat.prototype.insetPerimeter = function(){
	throw "todo";
}
ImageMat.insetPerimeter = function(array,width,height, pixels, value){
	var maxPerWid = Math.min(pixels,width-pixels);
	var minPerWid = Math.max(0,width-pixels-1);
	var maxPerHei = Math.min(pixels,height-pixels);
	var minPerHei = Math.max(0,height-pixels-1);
	var index;
	// top
	for(var j=0; j<maxPerHei; ++j){
		for(var i=0; i<width; ++i){
			array[j*width + i] = value;
		}
	}
	// bot
	for(var j=minPerHei; j<height; ++j){
		for(var i=0; i<width; ++i){
			array[j*width + i] = value;
		}
	}
	// lef
	for(var j=0; j<height; ++j){
		for(var i=0; i<maxPerWid; ++i){
			array[j*width + i] = value;
		}
	}
	// rig
	for(var j=0; j<height; ++j){
		for(var i=minPerWid; i<width; ++i){
			array[j*width + i] = value;
		}
	}
	return array;
}

ImageMat.prototype.insert = function(imageB, offX,offY){
	return this._insertAdd(imageB, offX,offY, true);
}
ImageMat.prototype.insertAdd = function(imageB, offX,offY){
	return this._insertAdd(imageB, offX,offY, true);
}
ImageMat.prototype._insertAdd = function(imageB, offX,offY, add){
	add = add!==undefined ? add : false;
	var iA, iB, jA, jB;
	var imageA = this;
	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var startX = Math.max(offX,0);
	var startY = Math.max(offY,0);
	var endX = Math.min(offX+widthB,widthA);
	var endY = Math.min(offY+heightB,heightA);
	var indexA, indexB;
	var redA = imageA.red();
	var grnA = imageA.grn();
	var bluA = imageA.blu();
	var redB = imageB.red();
	var grnB = imageB.grn();
	var bluB = imageB.blu();
	//console.log(startX,startY,endX,endY,widthA," ... ",heightA,widthB,heightB);
	for(jB=0, jA=startY; jB<heightB && jA<endY; ++jB, ++jA){
		for(iB=0, iA=startX; iB<widthB && iA<endX; ++iB, ++iA){
			indexA = jA*widthA + iA;
			indexB = jB*widthB + iB;
			if(add){
				redA[indexA] += redB[indexB];
				grnA[indexA] += grnB[indexB];
				bluA[indexA] += bluB[indexB];
			}else{
				redA[indexA] = redB[indexB];
				grnA[indexA] = grnB[indexB];
				bluA[indexA] = bluB[indexB];
			}
		}
	}
	return this;
}
ImageMat.prototype.to01 = function(){ // each channel separate 0 to 1
	ImageMat.normalFloat01(this._r);
	ImageMat.normalFloat01(this._g);
	ImageMat.normalFloat01(this._b);
	return this;
}
ImageMat.prototype.addRandom = function(magR, magG, magB){  // each channel separate error add
	magG = magG!==undefined ? magG : magR;
	magB = magB!==undefined ? magB : magR;
	ImageMat.random(this._r,magR,0.5*magR);
	ImageMat.random(this._g,magG,0.5*magG);
	ImageMat.random(this._b,magB,0.5*magB);
	return this;
}
// ImageMat.prototype.normalize = function(){ // convert existing scale to 0-1
// 	var maxR = Code.maxArray(this.red());
// 	var maxG = Code.maxArray(this.grn());
// 	var maxB = Code.maxArray(this.blu());
// 	var max = Code.maxArray([maxR,maxG,maxB]);
// 	var scale = 1.0/max;
// 	ImageMat.scaleFloatSame(this.red(), scale);
// 	ImageMat.scaleFloatSame(this.grn(), scale);
// 	ImageMat.scaleFloatSame(this.blu(), scale);
// }
// ------------------------------------------------------------------------------------------------------------------------ set
ImageMat.prototype.fromArrayARGB = function(data){
	var i, len = this._r.length;
	for(i=0;i<len;++i){
		this._r[i] = Code.getRedARGB(data[i])/255.0;
		this._g[i] = Code.getGrnARGB(data[i])/255.0;
		this._b[i] = Code.getBluARGB(data[i])/255.0;
	}
}
ImageMat.prototype.setRedFromFloat = function(a){
	var i, len1=Math.min(this._r.length,a.length), len2=this._r.length;
	for(i=0;i<len1;++i){ this._r[i] = a[i]; }
	for(;i<len2;++i){ this._r[i] = 0.0; }
}
ImageMat.prototype.setGrnFromFloat = function(a){
	var i, len1=Math.min(this._g.length,a.length), len2=this._g.length;
	for(i=0;i<len1;++i){ this._g[i] = a[i]; }
	for(;i<len2;++i){ this._g[i] = 0.0; }
}
ImageMat.prototype.setBluFromFloat = function(a){
	var i, len1=Math.min(this._b.length,a.length), len2=this._b.length;
	for(i=0;i<len1;++i){ this._b[i] = a[i]; }
	for(;i<len2;++i){ this._b[i] = 0.0; }
}
ImageMat.prototype.fromFloats = function(r,g,b){
	this.setRedFromFloat(r);
	this.setGrnFromFloat(g);
	this.setBluFromFloat(b);
	return this;
}

ImageMat.prototype.roughness = function(){ // local max of dx, -dx, dy, -dy
	return 0;
	var i, j, index;
	var wid = this.width();
	var hei = this.height();
	var x,a,b,c,d;
	var result = Code.newArrayZeros(wid*hei);
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			x = this._r[index];
			a = this._r[index];
			b = this._r[index];
			c = this._r[index];
			d = this._r[index];
		}
	}
	return roughness;
/*

find mean, find max difference from mean
	- MAX
	- AVERAGE (RMS)

*/
}
// ------------------------------------------------------------------------------------------------------------------------ utilities
ImageMat.newZeroFloat = function(wid,hei){
	var i, len = wid*hei;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = 0.0;
	}
	return a;
}
ImageMat.zero255FromFloat = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Math.round(data[i]*255.0);
	}
	return a;
}
ImageMat.FloatFromZero255 = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = data[i]/255.0;
	}
	return a;
}
ImageMat.ARGBFromFloat = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		col = Math.round(data[i]*255.0);
		a[i] = Code.getColARGB( 0xFF, col, col, col);
	}
	return a;
}
ImageMat.HSVFromRGBFloat = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	var hsv = new V3D();
	var rgb = new V3D();
	for(i=0;i<len;++i){
		rgb.set(r[i],g[i],b[i]);
		Code.HSVFromRGB(hsv,rgb);
		a[i] = new V3D(hsv.x,hsv.y,hsv.z);
	}
	return a;
}

ImageMat.grayFromRGBFloat = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = (r[i]+g[i]+b[i])/3.0;
	}
	return a;
}

// ImageMat.grayFromFloats = function(r,g,b){
// 	var i, len = r.length;
// 	var a = new Array(len);
// 	for(i=0;i<len;++i){
// 		a[i] = (r[i]+g[i]+b[i])/3.0;
// 	}
// 	return a;
// }

ImageMat.ARGBFromFloats = function(rF,gF,bF){
	var i, len = rF.length;
	var col, r,g,b,a = new Array(len);
	for(i=0;i<len;++i){
		// r = Math.round(rF[i]*255.0);
		// g = Math.round(gF[i]*255.0);
		// b = Math.round(bF[i]*255.0);
		r = Math.min(Math.floor(rF[i]*256.0),255);
		g = Math.min(Math.floor(gF[i]*256.0),255);
		b = Math.min(Math.floor(bF[i]*256.0),255);
		// r = Math.min(Math.floor(rF[i]*256.0),200);
		// g = Math.min(Math.floor(gF[i]*256.0),200);
		// b = Math.min(Math.floor(bF[i]*256.0),200);
		// if(r>255){
		// 	r = 255;
		// }
		// if(g>255){
		// 	g = 255;
		// }
		// if(b>255){
		// 	b = 255;
		// }
		a[i] = Code.getColARGB( 0xFF, r,g,b);
	}
	return a;
}
ImageMat.ARGBFromARGBFloats = function(aF,rF,gF,bF){
	var i, len = rF.length;
	var col, r,g,b,a, aa = new Array(len);
	for(i=0;i<len;++i){
		r = Math.round(rF[i]*255.0);
		g = Math.round(gF[i]*255.0);
		b = Math.round(bF[i]*255.0);
		a = Math.round(aF[i]*255.0);
		aa[i] = Code.getColARGB(a,r,g,b);
	}
	return aa;
}
ImageMat.ARGBFromRGBArrays = function(r,g,b){
	var i, len = r.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Code.getColARGB( 0xFF, r[i], g[i], b[i]);
	}
	return a;
}
ImageMat.getFloats01FromARGB255 = function(argb){
	var i, len = argb.length;
	var a = new Array();
	var r = new Array();
	var g = new Array();
	var b = new Array();
	for(i=0;i<len;++i){
		a[i] = Code.getAlpARGB(argb[i])/255.0;
		r[i] = Code.getRedARGB(argb[i])/255.0;
		g[i] = Code.getGrnARGB(argb[i])/255.0;
		b[i] = Code.getBluARGB(argb[i])/255.0;
	}
	return [a,r,g,b];
}
// ------------------------------------------------------------------------------------------------------------------------ utilities
ImageMat.colorArrayFxnRGB_ARGB = function(data, fxn){
	var i, len=data.length, col, r,g,b,a;
	for(i=0;i<data.length;++i){
		col = data[i];
		r = Code.getRedARGB(col); g = Code.getGrnARGB(col); b = Code.getBluARGB(col); a = Code.getAlpARGB(col);
		r = fxn(r);
		g = fxn(g);
		b = fxn(b);
		data[i] = Code.getColARGB(a,r,g,b);
	}
}
ImageMat.colorArrayFxnARGB_ARGB = function(data, fxnA, fxnR, fxnG, fxnB){
	var i, len=data.length, col, r,g,b,a;
	for(i=0;i<data.length;++i){
		col = data[i];
		r = Code.getRedARGB(col); g = Code.getGrnARGB(col); b = Code.getBluARGB(col); a = Code.getAlpARGB(col);
		data[i] = Code.getColARGB(fxnA(a),fxnR(r),fxnG(g),fxnB(b));
	}
}
ImageMat.fromComponents = function(object){
	var wid = object["width"];
	var hei = object["height"];
	var red = object["red"];
	var grn = object["grn"];
	var blu = object["blu"];
	var image = new ImageMat(wid,hei,red,grn,blu);
	return image;
}
// ------------------------------------------------------------------------------------------------------------------------ interpolations
ImageMat.rotateImage = function(){
	// ?
}
ImageMat.prototype.rotate90 = function(){
	var wid = this.width();
	var hei = this.height();
	var rS = this._r;
	var gS = this._g;
	var bS = this._b;
	var image = new ImageMat(hei,wid);
	var rD = image._r;
	var gD = image._g;
	var bD = image._b;
	for(var j=0; j<hei; ++j){
		for(var i=0; i<wid; ++i){
			var indexS = j*wid + i;
			var indexD = (wid-i-1)*hei + j;
			rD[indexD] = rS[indexS];
			gD[indexD] = gS[indexS];
			bD[indexD] = bS[indexS];
		}
	}
	return image;
}
ImageMat.prototype.rotate180 = function(){
	var wid = this.width();
	var hei = this.height();
	var rS = this._r;
	var gS = this._g;
	var bS = this._b;
	var image = new ImageMat(wid,hei);
	var rD = image._r;
	var gD = image._g;
	var bD = image._b;
	for(var j=0; j<hei; ++j){
		for(var i=0; i<wid; ++i){
			var indexS = j*wid + i;
			var indexD = (hei-j-1)*wid + (wid-i-1);
			rD[indexD] = rS[indexS];
			gD[indexD] = gS[indexS];
			bD[indexD] = bS[indexS];
		}
	}
	return image;
}
ImageMat.prototype.rotate270 = function(){
	var wid = this.width();
	var hei = this.height();
	var rS = this._r;
	var gS = this._g;
	var bS = this._b;
	var image = new ImageMat(hei,wid);
	var rD = image._r;
	var gD = image._g;
	var bD = image._b;
	for(var j=0; j<hei; ++j){
		for(var i=0; i<wid; ++i){
			var indexS = j*wid + i;
			var indexD = i*hei + (hei-j-1);
			rD[indexD] = rS[indexS];
			gD[indexD] = gS[indexS];
			bD[indexD] = bS[indexS];
		}
	}
	return image;
}
// ------------------------------------------------------------------------------------------------------------------------ image operations
ImageMat.gaussianWindow1DFromSigma = function(sigma, bas, inc, does){
	bas = bas!==undefined?bas:2;
	inc = inc!==undefined?inc:2;
	var size = Math.round(bas + sigma*inc)*2+1;
	if(does){
		return ImageMat.getGaussianWindow(size,1, sigma,sigma, true);
	}
	return ImageMat.getGaussianWindow(size,1, sigma);
	// SHOULD USE A 1D GENERATOR HERE
}
ImageMat.getGaussianWindow = function(width,height, sigmaX, sigmaY, normCenter, norm2){ // sigma is in absolute pixels sizes
	if(sigmaY===undefined || sigmaY===null){ sigmaY = sigmaX; }
	var len = width*height;
	var matrix = new Array(len);
	var sigSquareX = sigmaX*sigmaX;
	var sigSquareY = sigmaY*sigmaY;
	var cX = 1/(2*sigSquareX);
	var cY = 1/(2*sigSquareY);
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y;
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			val = Math.exp(-(xx*cX+yy*cY));
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	if(normCenter){ // maximum == 1.0
		var sigma2 = sigmaX*sigmaY;
		val = 1/(2.0*Math.PI*sigma2);
		for(i=0;i<len;++i){ // total == 1.0
			matrix[i] *= val;
		}
	}else if(!norm2){
		for(i=0;i<len;++i){ // total == 1.0
			matrix[i] /= sum;
		}
	}
	return matrix;
}
ImageMat.getGaussianWindowSimple = function(width,height, sigma){ // === ImageMat.getGaussianWindow(width,height, sigma,sigma,true). --- to simplify: mirror 2ce
	var len = width*height;
	var matrix = new Array(len);
	var c = 1/(2*sigma*sigma);
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y;
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			val = Math.exp(-(xx+yy)*c);
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	return matrix;
}
ImageMat.getLaplaceOfGaussianWindow = function(width,height, sigma){
	var len = width*height;
	var matrix = new Array(len);
	var sigSquare = sigma*sigma;
	var c = 1/(2*sigSquare);
	var d = -1/(Math.PI*sigSquare*sigSquare)
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, e, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y;
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			e = (xx+yy)*c;
			val = d*(1-e)*Math.exp(-e);
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	for(i=0;i<len;++i){
		matrix[i] /= sum;
	}
	return matrix;
}
ImageMat.gaussian2DFrom1DFloat = function(source, wid,hei, gauss1D){
	return ImageMat.convolve( ImageMat.convolve(source,wid,hei, gauss1D,1,gauss1D.length).value, wid,hei, gauss1D,gauss1D.length,1).value;
}


ImageMat.getCircularWindow = function(width,height, sigmaX, sigmaY){ // circular normal distribution
	return "f(r) = (1/(2*pi*s^2)) * exp(-0.5*(r/s)^2)";
}
ImageMat.toFrequencyDomain = function(image, wid,hei){ // http://homepages.inf.ed.ac.uk/rbf/HIPR2/fourier.htm
	var frequencies = new Array(wid*hei);
	var i, j, k, l, index, val;
	var cmp = new Complex(), a = new Complex(), b = new Complex();
var timeA = Code.getTimeMilliseconds();
	for(l=0;l<=0;++l){ // hei
		for(k=0;k<=0;++k){ // wid
			cmp.set(0,0);
			for(j=0;j<hei;++j){
				for(i=0;i<wid;++i){
					a.set(0, -2*Math.PI*( (i*k/wid) + (j*l/hei)) );
					Complex.mul(a,a,b);
					Complex.exp(a,a);
					b.set( image[j*wid + i] ,0);
					Complex.mul(a,a,b);
			 		Complex.add(cmp, cmp,a);
				}
			}
			console.log( " | " + cmp.toString() );
			frequencies[l*wid + j] = cmp.real(); // magnitude == all real
		}
	}
var timeB = Code.getTimeMilliseconds();
console.log("toFrequencyDomain" + " end "+ ((timeB-timeA)/1000)); // 44 seconds to 4-loop | (0.4s per loop)*300*400 = 48000s = 800min = 13.3hr
	return frequencies;
}
ImageMat.toImageDomain = function(frequencies, wid,hei){
	var image = new Array(wid*hei);
	var i, j, k, l;
	var cmp = new Complex(), a = new Complex(), b = new Complex();
	var wh = wid*hei;
	for(j=0;j<=0;++j){
		for(i=0;i<=0;++i){
			cmp.set(0,0);
			for(l=0;l<hei;++l){
				for(k=0;k<wid;++k){
			 		a.set(0, 2*Math.PI*( (i*k/wid) + (j*l/hei)) );
					Complex.exp(a,a);
					b.set( frequencies[l*wid + k] ,0);
					Complex.mul(a,a,b);
			 		Complex.add(cmp, cmp,a);
				}
			}
			image[j*wid + i] = val/wh;
		}
	}
	return image;
}
ImageMat.colorize = function(c, rnd){ // var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}

ImageMat.expandBlob = function(a,wid,hei){
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = 0;
	}
	for(i=1;i<wid-1;++i){
		for(j=1;j<hei-1;++j){
			index = j*wid + i;
			tl = a[(j-1)*wid + (i-1)];
			to = a[(j-1)*wid + i];
			tr = a[(j-1)*wid + (i+1)];
			lf = a[j*wid + (i-1)];
			se = a[j*wid + i];
			ri = a[j*wid + (i+1)];
			bl = a[(j+1)*wid + (i-1)];
			bo = a[(j+1)*wid + i];
			br = a[(j+1)*wid + (i+1)];
			if( tl||to||tr|| lf||se||ri|| bl||bo||br ){
				result[index] = 1;
			}else{
				result[index] = 0;
			}
		}
	}
	return {"value":result};
}
ImageMat.retractBlob = function(a,wid,hei){
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = new Array(len);
	var removed = [];
	for(i=0;i<wid;++i){
		for(j=0;j<hei;++j){
			index = j*wid + i;
			se = a[index];
			tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					tl = a[(j-1)*wid + (i-1)];
				}
				if(j<wm1){
					bl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j<hm1){
					br = a[(j+1)*wid + (i+1)];
				}
				if(j>0){
					tr = a[(j-1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				to = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				bo = a[(j+1)*wid + i];
			}
			if( tl&&to&&tr&& lf&&se&&ri&& bl&&bo&&br ){
				result[index] = 1;
			}else{
				result[index] = 0;
				if(se){
					if(!tl && !to && !tr && !lf && !ri && !bl && !bo && !br){
						//console.log("disappeared: "+i+","+j);
						removed.push(new V2D(i,j));
					}
				}
			}
		}
	}
	//return result;
	return {"value":result, "removed":removed};
}
ImageMat.findBlobs = function(a,wid,hei){ // px,py,area
	var i, j, im1, ip1, jm1, jp1, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = a;
	var loops = 0;
	var reached = 0;
	var count = 0;
	var found = true;
	var sumResult = Code.copyArray(new Array(), a);
	do{
		count = 0;
		reached = 0;
		a = result;
		result = new Array(len);
		found = false;
		for(i=0;i<wid;++i){
			for(j=0;j<hei;++j){
				index = j*wid + i;
				se = a[index];
				tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
				if(i>0){ // lefts
					lf = a[j*wid + (i-1)];
					if(j>0){
						tl = a[(j-1)*wid + (i-1)];
					}
					if(j<hm1){
						bl = a[(j+1)*wid + (i-1)];
					}
				}
				if(i<wm1){ // rights
					ri = a[j*wid + (i+1)];
					if(j<hm1){
						br = a[(j+1)*wid + (i+1)];
					}
					if(j>0){
						tr = a[(j-1)*wid + (i+1)];
					}
				}
				if(j>0){ // tops
					to = a[(j-1)*wid + i];
				}
				if(j<hm1){ // bots
					bo = a[(j+1)*wid + i];
				}
				if( tl&&to&&tr&& lf&&se&&ri&& bl&&bo&&br ){
					++reached;
					result[index] = 1;
				}else{
					result[index] = 0;
				}
			}
		}
		//Code.log(loops+": "+reached);
		++loops;
		if(reached>0){
			sumResult = ImageMat.addFloat(sumResult, result);
		}
	}while(reached>0 && loops<5);
	//console.log(((count/len)*100) + "%");
	// A:
	// count all blobs (init to -1, then go thru using max(tl,to,tr,le,se,ri,bl,bo,br) ), record center of mass
	// shrink until the number of blobs is inside the desired range => remaining blobs will be the biggest
	// B:
	// until there is nothing left:
	// OR when a blob goes to nothing, record point => largest blobs will die off last
	// shrink
	//return new Array();
	return ImageMat.getPeaks(sumResult, wid,hei);
}
ImageMat.findBlobsCOM = function(a,wid,hei){
	a = Code.copyArray(new Array(), a);
	var blobs = new Array();
	var i, j, k, im1, ip1, jm1, jp1, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var len = wid*hei, blob, max;
	var wm1 = wid-1, hm1 = hei-1;
	for(i=0;i<len;++i){ // all non-zero => -1, 0 => -2
		a[i] = (a[i]==0) ? -2 : -1;
	}
	var joinMap = [];
	blob = 0;
	for(j=0;j<hei;++j){ // assign all blobs to index
		for(i=0;i<wid;++i){
			index = j*wid + i;
			se = a[index];
			tl=-1; to=-1; tr=-1; lf=-1; ri=-1; bl=-1; bo=-1; br=-1;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					bl = a[(j-1)*wid + (i-1)];
				}
				if(j<hm1){
					tl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j>0){
					br = a[(j-1)*wid + (i+1)];
				}
				if(j<hm1){
					tr = a[(j+1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				bo = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				to = a[(j+1)*wid + i];
			}
			if(se==-1){ // object
				max = Math.max(tl,to,tr, lf,se,ri, bl,bo,br);
				if(max==-1){ // new blob
					//console.log("NEW: "+i+","+j+" = "+[tl,to,tr, lf,se,ri, bl,bo,br])
					a[index] = blob;
					joinMap[blob] = [blob];
					++blob;
				}else{
					se = max;
					a[index] = se;
					var list = [tl,to,tr, lf,se,ri, bl,bo,br];
					for(k=0; k<list.length;++k){
						if(list[k]<0){
							list.splice(k,1);
							--k;
						}
					}
					if(list.length>1){
						var min = Code.minArray(list);
						for(k=0; k<list.length; ++k){
							var item = list[k];
							if(item>min){ // merge arrays
								joinMap[item] = joinMap[min];
							}
						}
					}
				}
			} // else -2
		}
	}
	// join adjacent blobmasses
	for(i=0; i<joinMap.length; ++i){
		var map = joinMap[i];
		var merge = map[0];
		if(merge==i){ continue; }
		for(k=0; k<len; ++k){
			if(a[k]==i){
				a[k] = merge;
			}
		}
	}
	// record blobs
	var blobs = [];
	var idMin = 0;
	for(j=0;j<hei;++j){ // assign all blobs to index
		for(i=0;i<wid;++i){
			var index = j*wid + i;
			var item = a[index];
			if(item>=0){
				var blob = blobs[item];
				if(!blob){
					blob = {x:0, y:0, count:0, id:idMin};
					blobs[item] = blob;
					++idMin;
				}
				blob.x += i;
				blob.y += j;
				blob.count++;
				a[index] = blob.id;
			}
		}
	}
	// // rename all labels from 0 to N-1
	// for(j=0;j<hei;++j){ // assign all blobs to index
	// 	for(i=0;i<wid;++i){
	// 		var index = j*wid + i;
	// 		var item = a[index];
	// 	}
	// }
	var output = [];
	for(i=0;i<blobs.length;++i){
		if(blobs[i]){
			var blob = blobs[i];
			blob.x /= blobs[i].count;
			blob.y /= blobs[i].count;
			//blob["id"] = i;
			//blob["id"] = output.length;
			output.push(blob);
		}
	}
	return {"blobs":output, "value":a, "width":wid, "height":hei};
}
ImageMat.describeBlobs = function(info){
	var image = info["value"];
	var blobs = info["blobs"];
	var width = info["width"];
	var height = info["height"];
	// ...
	var i, j, k, index, value, blob, min, max, dist;
	var loc = new V2D();
	var com = new V2D();
	var wm1 = width-1;
	var hm1 = height-1;
	// reset to unknown:
	// TODO: recalc com.set(blob["x"],blob["y"]); ????
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		blob["radiusMin"] = undefined;
		blob["radiusMax"] = undefined;
		blob["xMin"] = undefined;
		blob["xMax"] = undefined;
		blob["yMin"] = undefined;
		blob["yMax"] = undefined;
	}
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			index = j*width + i;
			value = image[index];
			//console.log(value);
			if(value!==undefined && value>=0){
				blob = blobs[value];
				var nUL = -1;
				var nUM = -1;
				var nUR = -1;
				var nML = -1;
				var nMM = -1;
				var nMR = -1;
				var nDL = -1;
				var nDM = -1;
				var nDR = -1;
				if(0<j && 0<i){
					nUL = image[(j-1)*width + (i-1)];
				}
				if(0<j && 0<=i){
					nUM = image[(j-1)*width + (i-0)];
				}
				if(0<j && i<wm1){
					nUR = image[(j-1)*width + (i+1)];
				}

				if(0<=j && 0<i){
					nML = image[(j-0)*width + (i-1)];
				}
				if(0<=j && 0<=i){
					nMM = image[(j-0)*width + (i-0)];
				}
				if(0<=j && i<wm1){
					nMR = image[(j-0)*width + (i+1)];
				}

				if(j<hm1 && 0<i){
					nDL = image[(j+1)*width + (i-1)];
				}
				if(j<hm1 && 0<=i){
					nDM = image[(j+1)*width + (i-0)];
				}
				if(j<hm1 && i<wm1){
					nDR = image[(j+1)*width + (i+1)];
				}

				var isBorder = nUL!=value || nUM!=value || nUR!=value || nML!=value || nMM!=value || nMR!=value || nDL!=value || nDM!=value || nDR!=value;

				if(!blob){
					continue;
				}
				com.set(blob["x"],blob["y"]);
				//console.log(" "+com);
				// r
				loc.set(i,j);
				dist = V2D.distance(com,loc);
				max = blob["radiusMax"];
				max = max!==undefined ? max : dist;
				max = Math.max(max,dist);
				blob["radiusMax"] = max;
				if(isBorder){
					min = blob["radiusMin"]; // this needs to check if any neighbors are NOT the same id as self
					min = min!==undefined ? min : dist;
					min = Math.min(min,dist);
					blob["radiusMin"] = min;
				}
				// x
				min = blob["xMin"];
				max = blob["xMax"];
				min = min!==undefined ? min : i;
				max = max!==undefined ? max : i;
				min = Math.min(min,i);
				max = Math.max(max,i);
				blob["xMin"] = min;
				blob["xMax"] = max;
				// y
				min = blob["yMin"];
				max = blob["yMax"];
				min = min!==undefined ? min : j;
				max = max!==undefined ? max : j;
				min = Math.min(min,j);
				max = Math.max(max,j);
				blob["yMin"] = min;
				blob["yMax"] = max;
			}
		}
	}
}
ImageMat.expandBlobs = function(info){
	var image = info["value"];
	var blobs = info["blobs"];
	var width = info["width"];
	var height = info["height"];
	var wm1 = width-1;
	var hm1 = height-1;
	// go thru each pixel
	//var emptyColor = -2;
	var i, j, k, v, index;
	var result = [];
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			index = j*width + i;
			v = image[index];
			result[index] = v;
			if(v<=0){ // empty
				var nUL = -1;
				var nUM = -1;
				var nUR = -1;
				var nML = -1;
				var nMM = -1;
				var nMR = -1;
				var nDL = -1;
				var nDM = -1;
				var nDR = -1;
				if(0<j && 0<i){
					nUL = image[(j-1)*width + (i-1)];
				}
				if(0<j && 0<=i){
					nUM = image[(j-1)*width + (i-0)];
				}
				if(0<j && i<wm1){
					nUR = image[(j-1)*width + (i+1)];
				}

				if(0<=j && 0<i){
					nML = image[(j-0)*width + (i-1)];
				}
				if(0<=j && 0<=i){
					nMM = image[(j-0)*width + (i-0)];
				}
				if(0<=j && i<wm1){
					nMR = image[(j-0)*width + (i+1)];
				}

				if(j<hm1 && 0<i){
					nDL = image[(j+1)*width + (i-1)];
				}
				if(j<hm1 && 0<=i){
					nDM = image[(j+1)*width + (i-0)];
				}
				if(j<hm1 && i<wm1){
					nDR = image[(j+1)*width + (i+1)];
				}
				var list = [nUL,nUM,nUR,nML,nMR,nDL,nDM,nDR];
				// find most common color & set
				list = Code.sortFrequency(list);
				var anyColor = -3;
				for(k=0; k<list.length;++k){
					if(list[k]["value"]>=0){
						anyColor = list[k]["value"];
						break;
					}
				}
				if(anyColor>=0){ // set to ANY (or most common)
					result[index] = anyColor;
				}
			}
		}
	}
	Code.copyArray(image,result);
	return {"value":image, "width":width, "height":height};
	//return {"value":result, "width":width, "height":height};
}
ImageMat.fillBlobs = function(info){
	var image = info["value"];
	var blobs = info["blobs"];
	var width = info["width"];
	var height = info["height"];

	var fillColor = -2;
	var maxWidth = -1;
	var maxHeight = -1;
	var wid, hei, blob, value, h2, w2;
	var i, j, k;
	for(i=0; i<blobs.length; ++i){
		blob = blobs[i];
		wid = blob["xMax"] - blob["xMin"] + 1;
		hei = blob["yMax"] - blob["yMin"] + 1;
		maxWidth = Math.max(maxWidth,wid);
		maxHeight = Math.max(maxHeight,hei);
	}
	// create rect + 1 border pixel all around
	maxWidth += 2;
	maxHeight += 2;
	var size = maxWidth*maxHeight;
	var bitmap = Code.newArrayZeros(size);
	// fill bitmap
	wid = 0;
	hei = 0;
	for(k=0; k<blobs.length; ++k){
		// zero previous
		wid = Math.min(wid+2,maxWidth);
		hei = Math.min(hei+2,maxHeight);
		for(j=0; j<hei; ++j){
			for(i=0; i<wid; ++i){
				bitmap[j*maxWidth + i] = 0;
			}
		}
		bitmap = Code.newArrayZeros(size);
		// grab blob
		blob = blobs[k];
		var value = blob["id"];
		var offX = blob["xMin"];
		var offY = blob["yMin"];
		// copy source with value into rect
		wid = blob["xMax"] - blob["xMin"] + 1;
		hei = blob["yMax"] - blob["yMin"] + 1;
		for(j=0; j<hei; ++j){
			for(i=0; i<wid; ++i){
				val = image[(j+offY)*width + (i+offX)];
				if(val==value){
					bitmap[(j+1)*maxWidth + (i+1)] = value;
				}
			}
		}
		// flood fill outside w/ -1
		ImageMat._binaryFill(bitmap,maxWidth,maxHeight, 0,0,wid+2,hei+2, 0,0, 0,fillColor);
		// copy-copy : select all points !=-1 & fill in original
		for(j=0; j<hei; ++j){
			for(i=0; i<wid; ++i){
				val = bitmap[(j+1)*maxWidth + (i+1)];
				if(val!=fillColor){// && val!=value){ // replace only what is different
					image[(j+offY)*width + (i+offX)] = value;
				}
			}
		}
	}
	return {"value":image, "width":width, "height":height};
}
ImageMat._binaryFill = function(src,wid,hei, offX,offY,sizeX,sizeY, i,j, target, replace){ // TODO: faster implementation
	var queue = [];
	queue.push([i,j]);
	while(queue.length>0){
		var item = queue.shift();
			i = item[0];
			j = item[1];
		if(i<offX || j<offY || i>=offX+sizeX || j>=offY+sizeY){ // outsize relevant zone
			continue;
		}
		var y = (j+offY);
		var x = (i+offX);
		var index = y*wid + x;
		var value = src[index];
		if(value==replace || value!=target){ // filled or wrong target
			continue;
		}
		src[index] = replace;
		queue.push([i-1,j]);
		queue.push([i+1,j]);
		queue.push([i,j-1]);
		queue.push([i,j+1]);
	}
}
ImageMat.closestBlobFromPoint = function(info, point){
	var image = info["value"];
	var blobs = info["blobs"];
	var width = info["width"];
	var height = info["height"];
	var i, index, value;
	var x = Math.floor(point.x);
	var y = Math.floor(point.y);
	index = y*width + x;
	value = image[index];
	if(value>=0){
		return value;
	}else{
		// need to search outward
	}
	// for(i=0; i<blobs.length; ++i){
	// 	var blob = blobs[i];
	// }
	return null;
}

ImageMat.dropBelow = function(img,value){
	var i, len = img.length;
	var a = new Array(len);
	for(i=0;i<a.length;++i){
		if(img[i]<value){
			a[i] = 0;
		}else{
			a[i] = img[i];
		}
	}
	return a;
}

// visualize peaks
ImageMat.showPeaks = function(har, wid,hei, peaks){
	var result = ImageMat.newZeroFloat(wid,hei);
	var obj, i, len = peaks.length;
	for(i=0;i<len;++i){
		obj = peaks[i];
		result[wid*Math.round(obj.y) + Math.round(obj.x)] += 1.0;//Math.abs(obj.z?obj.z:0.0);
	}
	return result;//ImageMat.normalFloat01(result);
}

ImageMat.getPeaks = function(peaks, wid,hei){ // the problem with this is it misses maxima that are erased by the retracting process - poor resolution (2-3 pixels?)
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var vals = new Array();
	var max;
	var a = Code.copyArray(new Array(), peaks);
	for(i=0;i<wid;++i){
		for(j=0;j<hei;++j){
			index = j*wid + i;
			se = a[index];
			tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					tl = a[(j-1)*wid + (i-1)];
				}
				if(j<wm1){
					bl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j<hm1){
					br = a[(j+1)*wid + (i+1)];
				}
				if(j>0){
					tr = a[(j-1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				to = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				bo = a[(j+1)*wid + i];
			}
			max = Math.max(tl,to,tr, lf,ri, bl,bo,br);
			min = Math.min(tl,to,tr, lf,ri, bl,bo,br);
			if( se>max ){//Code.isUniqueValue(se, tl,to,tr, lf,se,ri, bl,bo,br) ){
				vals.push( {x:i, y:j, value:se } );
			}else if(se==max){// if(se>min){
				//a[index] = Math.min(tl,to,tr, lf,se,ri, bl,bo,br);//Code.secondMax(tl,to,tr, lf,se,rg, bl,bo,br);
				//a[index] = Code.secondMax(tl,to,tr, lf,se,ri, bl,bo,br);
				//a[index] = min;
				a[index] = min;
			}
		}
	}
	return vals;
}

ImageMat.findBlobs2 = function(a,wid,hei){ // px,py,area
	var blobs = new Array();
	var i, j, tl,to,tr, lf,se,rg, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = a;
	var loops = 0;
	var reached = 0;
	var count = 0;
	var found = true;
// the problem is that I want the behavior of the , but I'm deleting my object as I go
	do{
		count = 0;
		reached = 0;
		a = result;
		result = new Array(len);
		found = false;
		for(i=0;i<wid-0;++i){
			for(j=0;j<hei-0;++j){
				index = j*wid + i;
				result[index] = a[index];
				se = a[index];
				tl=0; to=0; tr=0; le=0; ri=0; bl=0; bo=0; br=0;
				if(i>0){ // lefts
					le = a[j*wid + (i-1)];
					if(j>0){
						tl = a[(j-1)*wid + (i-1)];
					}
					if(j<wm1){
						bl = a[(j+1)*wid + (i-1)];
					}
				}
				if(i<wm1){ // rights
					ri = a[j*wid + (i+1)];
					if(j<hm1){
						br = a[(j+1)*wid + (i+1)];
					}
					if(j>0){
						tr = a[(j-1)*wid + (i+1)];
					}
				}
				if(j>0){ // tops
					to = a[(j-1)*wid + i];
				}
				if(j<hm1){ // bots
					bo = a[(j+1)*wid + i];
				}
				if( tl&&to&&tr&& le&&se&&ri&& bl&&bo&&br ){ // all
					// stays
				}else if(se){
					result[index] = 0;
					++reached;
					if( !(tl||to||tr|| le||ri|| bl||bo||br) ){ // last one
					//if( !(to||le||ri||bo) ){ // last one
						++count;
						found = true;
						blobs.push( {x:i, y:j, radius:(loops+1)} );
					}
				}
			}
		}
		//console.log(loops+": "+count+" / "+reached);
		++loops;
	}while(found && loops<1);
	//console.log(((count/len)*100) + "%");
	// A:
	// count all blobs (init to -1, then go thru using max(tl,to,tr,le,se,ri,bl,bo,br) ), record center of mass
	// shrink until the number of blobs is inside the desired range => remaining blobs will be the biggest
	// B:
	// until there is nothing left:
	// OR when a blob goes to nothing, record point => largest blobs will die off last
	// shrink
	//return new Array();
	return blobs;
}
ImageMat.printBadData = function(data, wid,hei){
	var i, j, val;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			val = data[ j*wid+ i ];
			if(isNaN(val)){
				console.log("FOUND BAD DATA: "+i+","+j);
			}
		}
	}
}

// ------------------------------------------------------------------------------------------------------------------------ fxns
ImageMat.cdf = function(data, mask){ // cumulative distribution function | range assumed [0,1]
	var i, len = data.length;
	if(mask){
		var newData = [];
		for(i=0; i<len; ++i){
			if(mask[i] != 0){
				newData.push(data[i]);
			}
		}
		data = newData;
		len = data.length;
	}
	var lm1 = len - 1;
	var sorted = data.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	var division;
	var currentCDF = 0;
	var cdf = [];
	var xValues = [];
	for(i=0; i<=lm1;++i){
		value = sorted[i];
		division = 1;
		while(i<lm1 && sorted[i+1]==value){
			division += 1;
			++i;
		}
		currentCDF += division / len;
		cdf.push(currentCDF);
		xValues.push(value);
	}
	return {"x":xValues, "y":cdf};
}
ImageMat.probabilityFromCDF = function(cdf,value){
	var x = cdf["x"];
	var y = cdf["y"];
	var len = x.length;
	var lm1 = len - 1;
	if(len==0){
		return 0;
	}
	var value0 = x[0];
	var valueN = x[lm1];
	if(value < value0){
		return 0;
	}
	if(value > valueN){
		return 1;
	}
	// TODO: faster search to find i
	var i, a, b;
	for(i=0; i<lm1; ++i){
		a = x[i];
		b = x[i+1];
		if(a<=value && value<=b){
			if(i>0){
				return y[i] - y[i-1];
			}else{
				return y[i];
			}
		}
	}
	return 0;
}


ImageMat.valueFromCDF = function(cdf,value){
	var x = cdf["x"];
	var y = cdf["y"];
	var len = x.length;
	var lm1 = len - 1;
	if(len==0){
		return 0;
	}
	if(value < x[0]){
		return 0;
	}
	var i, a, b;
	for(i=0; i<lm1; ++i){
		a = x[i];
		b = x[i+1];
		if(a<=value && value<=b){
			return y[i];
		}
	}
	return 1;
}

ImageMat.entropy = function(data, wid, hei, maskOutCenter, bins, bucketOffset){
	return ImageMat.entropySimple(data, wid, hei, bins, maskOutCenter, bucketOffset);
	// var bins = Math.round(3 + Math.log2(data.length) * Math.log(data.length));
	// return ImageMat.entropySimple(data, wid, hei, bins, maskOutCenter);
	// var i, len = wid*hei;
	// var cdf = ImageMat.cdf(data);
	// var entropy = 0;
	// return entropy;
}
ImageMat.histogram = function(data, wid, hei, buckets, maskOutCenter, bucketOffset){// range assumed [0,1]  |  16 => 4  |  100 => 10
	var value, i, bin, len = data.length;
	bucketOffset = bucketOffset!==undefined ? bucketOffset : 0.0;
	buckets = (buckets!==undefined && buckets!==null) ? buckets : Math.round(Math.sqrt(len));
	// var info = Code.infoArray(data);
	// var infoMax = info["max"];
	// var infoMin = info["min"];
	// var infoRange = info["range"];
	// 	infoMin = 0;
	// 	infoMax = 1;
	// 	infoRange = infoMax - infoMin;
	// console.log(infoRange)
	var bm1 = buckets - 1;
	var histogram = Code.newArrayZeros(buckets);
	var mask = 1.0;
	for(i=0; i<len; ++i){
		if(maskOutCenter){ mask = maskOutCenter[i]; }
		if(mask!=0.0){
			value = data[i];
			// if(bucketOffset){
			// 	value = (value + bucketOffset) % 1.0;
			// }
			// value = (value - infoMin)/infoRange;
			bin = Math.min(Math.floor( value*buckets ),bm1);
			console.log(i+" = "+value+" => "+bin)
			histogram[bin] += 1;
		}
	}
	return histogram;
}
ImageMat.entropySimple = function(data, wid, hei, buckets, maskOutCenter){ // e = - SUM p_i * log(p_i)
//buckets = 10;
	var i, count, value, p, bin;
	var histogram = ImageMat.histogram(data, wid,hei, buckets, maskOutCenter);
	buckets = histogram.length;
	var bm1 = buckets - 1;
	var entropy = 0;
	var entropyCount = 0;
	var totalCount = Code.sumArray(histogram);
var totalP = 0;
	for(i=0; i<buckets; ++i){
		//value = data[i];
		//bin = Math.min(Math.floor( value*buckets ),bm1);
		//count = histogram[bin];
		// get probability from histogram
		count = histogram[i];
		p = count / totalCount;
		//console.log(i+": "+p);
		totalP += p;
		if(p > 0){
			entropy += p * Math.log2(p); // * dx;
			//entropy += p * Math.log2(1/p); // * dx;
			entropyCount++;
		}
	}
//console.log(totalP);
	var maxE = -Math.log2(1.0/buckets);
//	console.log("MAX:",entropyCount,totalCount,data.length,maxE,histogram);


	// var min = 0; // Math.pow(2,-buckets); // all same color
	// var max = Math.log2(1.0/buckets);////buckets; // uniform buckets
// /entropyCount
	return -entropy/maxE;
	//return -entropy;
	//return -entropy/Math.pow(entropyCount,1/3);
	//return -entropy/Math.pow(wid,1/2);
	// MAX ENTROPY @ ?
	// MIN ENTROPY @ ?

	// return -entropy/maxE;
	//return -entropy/wid; // NO
	//return -entropy/entropyCount; // NO
}
ImageMat.entropyResidual = function(data, wid, hei, maskOutCenter){
	var i, count, value, p, bin, len = data.length;
	var histogram = ImageMat.histogram(data, wid,hei, null, maskOutCenter);
	buckets = histogram.length;
	var bm1 = buckets - 1;
	var entropy = 0;
	var currentCount = 0;
	var totalCount = Code.sumArray(histogram);
	var cdf = [];
	count = 0;
	for(i=0; i<buckets; ++i){
		count += histogram[i];
		cdf.push(count);
	}
	var mask = 1;
	for(i=0; i<data.length; ++i){
		value = data[i];
		if(maskOutCenter){
			mask = maskOutCenter[i];
		}
		if(mask!==0){
			bin = Math.min(Math.floor( value*buckets ),bm1);
			p = cdf[i] / totalCount;
			if(p > 0){
				entropy += p * Math.log2(p); // * dx;
			}
		}
	}
	return -entropy;
}
ImageMat.entropyResidualX = function(data, wid, hei, maskOutCenter){
	var i, p, count;
	//var histogram = ImageMat.histogram(data, wid,hei, null, maskOutCenter);
	var cdf = ImageMat.cdf(data, maskOutCenter);
		var cdfX = cdf["x"];
		var cdfY = cdf["y"];
	var len = cdfX.length;
	var lm1 = len-1;
	var entropy = 0;
	var totalCount = cdf[lm1];
	var count = 0;
	var mask = 1;
	for(i=0; i<data.length; ++i){
		if(maskOutCenter){
			mask = maskOutCenter[i];
		}
		if(mask!=0){
			var value = data[i];
			var p = ImageMat.valueFromCDF(cdf,value);
			entropy += p * Math.log2(p);
		}
		//console.log(i+": "+count+" / "+totalCount);
	}
	console.log(-entropy);
	return -entropy;
}

ImageMat.entropyInWindow = function(data, wid,hei, winX,winY, useWin){
	if(winX==undefined || winY==undefined){
		return
	}
	var testSizeX = winX*2 + 1;
	var testSizeY = winY*2 + 1;
	if(useWin){
		testSizeX = winX;
		testSizeY = winY;
	}

	var mask = ImageMat.circleMask(testSizeX,testSizeY)
	var totalEntropy = Code.newArrayZeros(wid*hei);
	var i, j, nJ, nI, index, range;
	var wm1 = wid-1, hm1 = hei-1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			var d = [];
			var iStart = i - winX;
			var iEnd = i + winX;
			var jStart = j - winY;
			var jEnd = j + winY;
			for(nJ=jStart; nJ<=jEnd; ++nJ){
				for(nI=iStart; nI<=iEnd; ++nI){
					var ii = Math.min(Math.max(nI,0),wm1);
					var jj = Math.min(Math.max(nJ,0),hm1);
					var iIndex = jj*wid + ii;
					var value = data[iIndex];
					d.push(value);
				}
			}
			entropy = ImageMat.entropy(d, testSizeX, testSizeY, mask);
			//entropy = ImageMat.entropyResidual(d, testSizeX, testSizeY, mask);
			totalEntropy[index] = entropy;
		}
	}
	return {"value":totalEntropy, "width":wid, "height":hei};
}


ImageMat.entropyInPixelArea = function(data, wid,hei, pointX,pointY, winX,winY, mask, bins){
	if(winX==undefined || winY==undefined){
		return
	}
	var winXLeft = Math.floor(winX/2.0);
	var winXRight = winX - winXLeft;
	var winYTop = Math.floor(winY/2.0);
	var winYBot = winY - winYTop;
	var wm1 = wid-1, hm1 = hei-1;
	var i, j;
	var entropy = 0;
	var d = [];
	var iStart = pointX - winXLeft;
	var iEnd = pointX + winXRight;
	var jStart = pointY - winY;
	var jEnd = pointY + winY;
	for(j=jStart; j<=jEnd; ++j){
		for(i=iStart; i<=iEnd; ++i){
			var ii = Math.min(Math.max(i,0),wm1);
			var jj = Math.min(Math.max(j,0),hm1);
			var index = jj*wid + ii;
			var value = data[index];
			d.push(value);
		}
	}
	if(winX==5){
		console.log("\nimg=["+d+"]; plot(img);\n\n");
	}
	// TRY NORMALIZING
	// var minValue = Code.minArray(d);
	// var maxValue = Code.maxArray(d);
	// var range = maxValue - minValue;
	// range = 1.0/(range!=0 ? range : 1.0);
	// for(i=0; i<d.length; ++i){
	// 	d[i] = d[i] / range;
	// }
	//console.log(d);
	entropy = ImageMat.entropy(d, winX, winY, mask, bins);
	return entropy;
}

ImageMat.rangeInPixelArea = function(data, wid,hei, pointX,pointY, winX,winY, mask){
	if(winX==undefined || winY==undefined){
		return
	}
	var winXLeft = Math.floor(winX/2.0);
	var winXRight = winX - winXLeft;
	var winYTop = Math.floor(winY/2.0);
	var winYBot = winY - winYTop;
	var wm1 = wid-1, hm1 = hei-1;
	var i, j;
	var entropy = 0;
	var d = [];
	var iStart = pointX - winXLeft;
	var iEnd = pointX + winXRight;
	var jStart = pointY - winY;
	var jEnd = pointY + winY;
	for(j=jStart; j<=jEnd; ++j){
		for(i=iStart; i<=iEnd; ++i){
			var ii = Math.min(Math.max(i,0),wm1);
			var jj = Math.min(Math.max(j,0),hm1);
			var index = jj*wid + ii;
			var value = data[index];
			d.push(value);
		}
	}
	var maxValue = Code.maxArray(d);
	var minValue = Code.minArray(d);
	return maxValue - minValue;
}

ImageMat.prototype.mean = function(){
	var r = Code.infoArray(this.red())["mean"];
	var g = Code.infoArray(this.grn())["mean"];
	var b = Code.infoArray(this.blu())["mean"];
	var y = (r+g+b)/3.0;
	return {"r":r,"g":g,"b":b,"y":y};
}

ImageMat.prototype.range = function(){
	var r = ImageMat.range(this.red());
	var g = ImageMat.range(this.grn());
	var b = ImageMat.range(this.blu());
	var y = (r+g+b)/3.0;
	return {"r":r,"g":g,"b":b,"y":y};
}

ImageMat.prototype.colorRangeMagnitude = function(){
	
	throw "find biggest difference in 3D color";
	return maxD;
}
ImageMat.prototype.colorRangeSigma = function(subsample){ // find the sigma-average distance from average color
	if(subsample){
		throw "try getting some sqrt(n) / subsample"
	}
	var cen = new V3D();
	var val = new V3D();
	var red = this.red();
	var grn = this.grn();
	var blu = this.blu();
	var count = red.length;
	if(count<=1){
		return 0;
	}
	var invCount = 1.0/count;
	for(var i=0; i<count; ++i){
		cen.add(red[i],grn[i],blu[i]);
	}
	cen.scale(invCount);
	var sigma = 0;
	for(var i=0; i<count; ++i){
		val.set(red[i],grn[i],blu[i]);
		var d2 = V3D.distanceSquare(cen,val);
		sigma += d2;
	}
	sigma = Math.sqrt(sigma*invCount);
	return sigma;
}

ImageMat.range = function(data, wid,hei){
	// if(wid==0||hei==0){
	// 	return 0;
	// }
	// var len = wid*hei;
	var len = data.length;
	var minValue = null;
	var maxValue = null;
	for(var i=len-1; i>=0; i--){
		var value = data[i];
		if(minValue==null || value<minValue){
			minValue = value;
		}
		if(maxValue==null || value>maxValue){
			maxValue = value;
		}
	}
	var range = maxValue - minValue;
	return range;
}
ImageMat.rangeInWindow = function(data, wid,hei, winX,winY){ // win = 1/2 actual window
	if(winX==undefined || winY==undefined){
		return
	}
	var variation = Code.newArrayZeros(wid*hei);
	var i, j, nJ, nI, index, range;
	var wm1 = wid-1, hm1 = hei-1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			var iStart = Math.max(0,i-winX);
			var iEnd = Math.min(wm1,i+winX);
			var jStart = Math.max(0,j-winY);
			var jEnd = Math.min(hm1,j+winY);
			var minValue = null;
			var maxValue = null;
			for(nJ=jStart; nJ<jEnd; ++nJ){
				for(nI=iStart; nI<iEnd; ++nI){
					var iIndex = nJ*wid + nI;
					var value = data[iIndex];
					if(minValue==null || value<minValue){
						minValue = value;
					}
					if(maxValue==null || value>maxValue){
						maxValue = value;
					}
				}
			}
			range = maxValue - minValue;
			variation[index] = range;
		}
	}
	return {"value":variation, "width":wid, "height":hei};
}
ImageMat.totalRangeInWindow = function(r,g,b, wid,hei, winX,winY){
	var len = wid*hei;
	var total = Code.newArrayZeros(len);
	var i;
	r = ImageMat.rangeInWindow(r,wid,hei,winX,winY).value;
	g = ImageMat.rangeInWindow(g,wid,hei,winX,winY).value;
	b = ImageMat.rangeInWindow(b,wid,hei,winX,winY).value;
	for(i=0; i<len; ++i){
		total[i] = r[i] + g[i] + b[i];
	}
	return {"value":total, "width":wid, "height":hei};
}

ImageMat.totalCostToMoveAny = function(image, g,b,wid,hei){
	var result, red, grn, blu;
	if(wid!==undefined && hei!==undefined){
		red = image;
		grn = g;
		blu = b;
	}else{
		red = image.red();
		grn = image.grn();
		blu = image.blu();
		wid = image.width();
		hei = image.height();
	}
	var red = ImageMat.costToMoveAny(red, wid,hei).value;
	var grn = ImageMat.costToMoveAny(grn, wid,hei).value;
	var blu = ImageMat.costToMoveAny(blu, wid,hei).value;
	var len = wid * hei;
	var sum = Code.newArrayZeros(len);
	var i, den, num;
	for(i=0; i<len; ++i){ // square?
		//sum[i] = red[i] + grn[i] + blu[i];
		//sum[i] = red[i] * grn[i] * blu[i];
		num = (red[i] * grn[i] * blu[i]);
		den = (red[i] + grn[i] + blu[i]);

		sum[i] = den;
		//sum[i] = num;

		// if(den==0){
		// 	den = 1.0;
		// }
		// sum[i] = num / den;

		// if(num==0){
		// 	num = 1.0;
		// }
		// sum[i] = den/num;

	}
	//return sum;
	return {"value":sum, "width":wid, "height":hei};
}
ImageMat.costToMoveAny = function(image,wid,hei){ // 4 main directions | +4 diagonal directions
	var result = null;
	if(wid!==undefined && hei!==undefined){
		var r = image;
		result = ImageMat.costToMove(image,wid,hei, 1,0);
		ImageMat.costToMove(image,wid,hei, 0,1, result);
		ImageMat.costToMove(image,wid,hei, -1,0, result);
		ImageMat.costToMove(image,wid,hei, 0,-1, result);
		// ImageMat.costToMove(image,wid,hei,-1,-1, result);
		// ImageMat.costToMove(image,wid,hei,1,-1, result);
		// ImageMat.costToMove(image,wid,hei,-1,1, result);
		// ImageMat.costToMove(image,wid,hei,1,1, result);
	}else{
		result = ImageMat.costToMoveImage(image,1,0);
		ImageMat.costToMoveImage(image,0,1, result);
		ImageMat.costToMoveImage(image,-1,0, result);
		ImageMat.costToMoveImage(image,0,-1, result);
		// ImageMat.costToMove(image,-1,-1, result);
		// ImageMat.costToMove(image,1,-1, result);
		// ImageMat.costToMove(image,-1,1, result);
		// ImageMat.costToMove(image,1,1, result);
	}
	return result;
}
ImageMat.costToMoveImageX = function(image, dx,dy, sum){
	return ImageMat.costToMove(image.red(),image.grn(),image.blu(),image.width(),image.height(), dx,dy, sum);
}
ImageMat.costToMoveImage = function(red,grn,blu, wid,hei, dx,dy, sum){ // assume image stretches in all directions
	var resultLen = wid * hei;
	var r = sum!==undefined ? sum.red() : Code.newArrayZeros(resultLen);
	var g = sum!==undefined ? sum.grn() : Code.newArrayZeros(resultLen);
	var b = sum!==undefined ? sum.blu() : Code.newArrayZeros(resultLen);
		// var r = sum!==undefined ? sum.red() : Code.newArrayOnes(resultLen);
		// var g = sum!==undefined ? sum.grn() : Code.newArrayOnes(resultLen);
		// var b = sum!==undefined ? sum.blu() : Code.newArrayOnes(resultLen);
	var i, j, x, y;
	var indexA, indexB;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexA = j*wid + i;
			x = i + dx;
			y = j + dy;
			x = Math.min(Math.max(0,x),wid-1);
			y = Math.min(Math.max(0,y),hei-1);
			indexB = y*wid + x;
				r[indexA] += Math.abs(red[indexA] - red[indexB]);
				g[indexA] += Math.abs(grn[indexA] - grn[indexB]);
				b[indexA] += Math.abs(blu[indexA] - blu[indexB]);
					// r[indexA] *= Math.abs(red[indexA] - red[indexB]);
					// g[indexA] *= Math.abs(grn[indexA] - grn[indexB]);
					// b[indexA] *= Math.abs(blu[indexA] - blu[indexB]);
				// r[indexA] += Math.pow(red[indexA] - red[indexB],2);
				// g[indexA] += Math.pow(grn[indexA] - grn[indexB],2);
				// b[indexA] += Math.pow(blu[indexA] - blu[indexB],2);
		// (A * B) / (A + B)
		}
	}
	if(sum){
		return sum;
	}
	var result = new ImageMat(wid,hei,r,g,b);
	return result;
}


ImageMat.costToMove = function(channel, wid,hei, dx,dy, sum){ // assume image stretches in all directions
	var resultLen = wid * hei;
	sum = sum!==undefined ? sum : Code.newArrayZeros(resultLen);
	//sum = sum!==undefined ? sum : Code.newArrayOnes(resultLen);
	var i, j, x, y;
	var indexA, indexB;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexA = j*wid + i;
			x = i + dx;
			y = j + dy;
			x = Math.min(Math.max(0,x),wid-1);
			y = Math.min(Math.max(0,y),hei-1);
			indexB = y*wid + x;
			sum[indexA] += Math.abs(channel[indexA] - channel[indexB]);
			//sum[indexA] *= Math.abs(channel[indexA] - channel[indexB]);
		// (A * B) / (A + B)
		}
	}
	return {"value":sum, "width":wid, "height":hei};
}



// var cost = ImageMat.costToMoveMaskImage(block.red(), block.width(), block.height(), 1,1, blockMaskInside);
ImageMat.costToMoveMask = function(channel, wid,hei, dx,dy, mask, sum){ // assume image stretches in all directions
	throw " ... "
	var resultLen = wid * hei;
	var sum = 0;
	var i, j, x, y;
	var indexA, indexB;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexA = j*wid + i;
			x = i + dx;
			y = j + dy;
			x = Math.min(Math.max(0,x),wid-1);
			y = Math.min(Math.max(0,y),hei-1);
			indexB = y*wid + x;
			//sum[indexA] += Math.abs(channel[indexA] - channel[indexB]);
			//sum[indexA] *= Math.abs(channel[indexA] - channel[indexB]);
		// (A * B) / (A + B)
		}
	}
	return {"value":sum, "width":wid, "height":hei};
}


ImageMat.applyGaussianMask = function(image, imageWidth,imageHeight){
	var cX = (imageWidth-1)/2.0;
	var cY = (imageHeight-1)/2.0;
	var sigmaX = cX/2; sigmaX = 2.0*sigmaX*sigmaX; // TODO: THIS LOOKS WRONG
	var sigmaY = cY/2; sigmaY = 2.0*sigmaY*sigmaY;
	var i, j, x, y, index, value;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			value = image[index];
			value = value * Math.exp( -( Math.pow(i-cX,2)/sigmaX  +  Math.pow(j-cY,2)/sigmaY ) );
			image[index] = value;
		}
	}
	return {"value":image, "width":imageWidth, "height":imageHeight};
}

ImageMat.gaussianMask = function(width,height, sigmaX, sigmaY, clearCircle, areRatios){ // area ~ 1
	if(sigmaX===undefined){ // 3sigma = 99.7%
		sigmaX = Math.min(width,height)*0.5/3.0;
		sigmaX = sigmaX;
	}
	sigmaY = sigmaY!==undefined ? sigmaY : sigmaX;
	var cX = (width-1)*0.5;
	var cY = (height-1)*0.5;
	if(areRatios){
		sigmaX = cX/sigmaX;
		sigmaY = cY/sigmaY;
	}
	var prefix = 1.0/(2.0*Math.PI*sigmaX*sigmaY);
	var divX = 2.0*sigmaX*sigmaX;
	var divY = 2.0*sigmaY*sigmaY;
	var i, j, x, y, index, value;
	var rx = (width/2);
	var ry = (height/2);
	var image = [];
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			index = j*width + i;
			var keep = true;
			var x = i - cX;
			var y = j - cY;
			if(clearCircle){
				var d = Math.pow(x/rx,2) + Math.pow(y/ry,2);
				keep = d<=1;
			}
			if(keep){
				image[index] = prefix * Math.exp( -( Math.pow(x,2)/divX  +  Math.pow(y,2)/divY ) );
			}else{
				image[index] = 0;
			}
		}
	}
	return image;
}

ImageMat.circleMask = function(imageWidth, imageHeight, padding){ // force circle ? [currently oval]
	padding = padding!==undefined ? padding : 0;
	// SHOULD BE SYMMETRIC
	imageHeight = imageHeight!==undefined ? imageHeight : imageWidth;
	var i, j;
	var len = imageWidth * imageHeight;
	var mask = Code.newArrayZeros(len);
	var cx = (imageWidth-1.0)*0.5;
	var cy = (imageHeight-1.0)*0.5;
	var rx = (imageWidth-padding)*0.5;
	var ry = (imageHeight-padding)*0.5;
	for(i=0; i<imageWidth; ++i){
		for(j=0; j<imageHeight; ++j){
			var d = Math.pow((i-cx)/rx,2) + Math.pow((j-cy)/ry,2);
			if( d <= 1){
				mask[j*imageWidth + i] = 1.0;
			}
		}
	}
	return mask;
}

ImageMat.prototype.applyCircleMask = function(image, imageWidth, imageHeight){ // TODO: FXN = APPLY MASK, choose circle === ImageMat.mul
	var i;
	var mask = ImageMat.circleMask(imageWidth, imageHeight);
	var len = imageWidth*imageHeight;
	for(i=0; i<len; ++i){
		image[i] *= mask[i];
	}
	return image;
}
ImageMat.prototype.applyGaussianMask = function(){
	ImageMat.applyGaussianMask(this.red(), this.width(), this.height());
	ImageMat.applyGaussianMask(this.grn(), this.width(), this.height());
	ImageMat.applyGaussianMask(this.blu(), this.width(), this.height());
}
ImageMat.calculateCentroid = function(image, imageWidth,imageHeight,inMask){
	var mask = 1.0;
	var cen = new V2D();
	var length = imageWidth * imageHeight;
	var totalWeight = 0;
	var i, j, index, value;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(inMask){
				mask = inMask[index];
			}
			if(mask==0){
				continue;
			}
			value = image[index];
			totalWeight += value;
			cen.x += i*value;
			cen.y += j*value;
		}
	}
	cen.scale(1.0/totalWeight);
	return cen;
}
ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){ // mean == center
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(image, imageWidth,imageHeight);
	var i, j, x, y, index, value;
	var covXX = 0 ,covYY = 0, covXY = 0;
		// var covXZ = 0, covYZ = 0, covZZ = 0;
	var totalWeight = 0;
	var mask = 1;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(maskOutCenter){
				mask = maskOutCenter[index];
			}
			if(mask==0){
				continue;
			}
			value = mask*image[index];
			totalWeight += value;
			x = i - mean.x;
			y = j - mean.y;
			covXX += value*x*x;
			covYY += value*y*y;
			covXY += value*x*y;
			// covXZ = value*x; covYZ = value*y; covZZ = value;
		}
	}
	if(totalWeight==0){
		totalWeight = 1.0;
	}
	totalWeight = 1.0/totalWeight;
	covXX *= totalWeight;
	covYY *= totalWeight;
	covXY *= totalWeight;
		// covXZ *= size; covYZ *= size; covZZ *= size;
	var cov = Code.inverse2x2([], covXX, covXY, covXY, covYY);
		//var cov = Code.inverse3x3([], covXX, covXY, covXZ,  covXY, covYY, covYZ,  covXZ, covYZ, covZZ);
	return cov;
}

ImageMat.prototype.calculateCentroid = function(){
	var red = ImageMat.calculateCentroid(this.red(), this.width(), this.height());
	var grn = ImageMat.calculateCentroid(this.grn(), this.width(), this.height());
	var blu = ImageMat.calculateCentroid(this.blu(), this.width(), this.height());
	var gry = ImageMat.calculateCentroid(this.gry(), this.width(), this.height());
	return {"red":red, "grn":grn, "blu":blu, "gry":gry, "width":this.width(), "height":this.height()};
}
// THIS IS MORE LIKE THE CENTRAL MOMENT
ImageMat.prototype.calculateCovariance = function(mean, mask){
	return ImageMat.calculateCovarianceMatrix(this.gry(), this.width(), this.height(), mean, mask);
}
ImageMat.calculateCovariance = function(gry, width, height, mean, mask){
	var matrix = ImageMat.calculateCovarianceMatrix(gry, width, height, mean, mask);
	matrix = new Matrix(2,2,matrix);
		//matrix = new Matrix(3,3,matrix);
	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
		//eigenVectors[2] = eigenVectors[2].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
		//var ev3 = new V3D(eigenVectors[2][0],eigenVectors[2][1],eigenValues[2]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
	//return [ev1,ev2,ev3];
}
ImageMat.calculateRawMoment = function(image, imageWidth,imageHeight, expX, expY, mean, inMask){
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(image, imageWidth,imageHeight);
	var i, j, x, y, index, value;
	var moment = 0;
	var totalWeight = 0;
	var mask = 1.0;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(inMask){
				mask = inMask[index];
			}
			if(mask!=1){
				continue;
			}
			value = image[index];
			totalWeight += value;
			x = i - mean.x;
			y = j - mean.y;
			// x = i;
			// y = j;
			moment += value * Math.pow(x,expX) * Math.pow(y,expY);
		}
	}
	return moment/totalWeight;
}
ImageMat.prototype.calculateMoment = function(mean,mask){
	var gry = this.gry();
	var wid = this.width();
	var hei = this.height();
	return ImageMat.calculateMoment(gry,wid,hei,mean,mask);
}
ImageMat.calculateMoment = function(gry,wid,hei,mean,mask){
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(gry, wid,hei);

	//var totalWeight = ImageMat.sumFloat(gry);
	// var m01 = ImageMat.calculateRawMoment(gry,wid,hei,0,1,mean);
	// var m10 = ImageMat.calculateRawMoment(gry,wid,hei,1,0,mean);

	var m11 = ImageMat.calculateRawMoment(gry,wid,hei,1,1,mean,mask);
	var m20 = ImageMat.calculateRawMoment(gry,wid,hei,2,0,mean,mask);
	var m02 = ImageMat.calculateRawMoment(gry,wid,hei,0,2,mean,mask);
	var matrix = new Matrix(2,2,[m20,m11,m11,m02]);

	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
}
ImageMat.prototype.calculateX = function(){

}
ImageMat.cooccurrenceMatrix = function(image, wid, hei, imageMask, levels, offX, offY, dontNormalize){
	if(offX===undefined || offY===undefined){
		offX = 1; offY = 0; // right
	}
	var lm1 = levels - 1;
	var size = levels*levels;
	var com = Code.newArrayZeros(size);
	var i, j, k, indexU, indexV, u, v;
	var count = 0;
	var mask = 1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexU = j*wid + i;
			if(imageMask){
				mask = imageMask[indexU];
			}
			if(mask==0){
				continue;
			}
			var ii = (i+offX);
			var jj = (j+offY);
			if(ii>=wid || jj>=hei){
				continue;
			}
			indexV = jj*wid + ii;
			u = image[indexU];
			v = image[indexV];
			u = Math.min(Math.floor(u*levels),lm1);
			v = Math.min(Math.floor(v*levels),lm1);
			com[u*levels + v] += 1;
			++count;
		}
	}
	if(!dontNormalize && count>0){
		for(i=0; i<size; ++i){
			com[i] = com[i]/count;
		}
	}
	return com;
}
/*
energy
entropy
contrast
homogeneity
correlation
*/
ImageMat.cooccurrenceMatrixEnergy = function(com, levels){
	var i, value;
	var size = com.length;//levels*levels;
	var result = 0;
	var min = null;
	var max = null;
	for(i=0; i<size; ++i){
		value = com[i];
	}
	var range = max - min;
	var avg = (max+min)*0.5;
	for(i=0; i<size; ++i){
		value = com[i];
		value = value - avg;
		value = Math.abs(value);
		value = value * value;
		result += value;
	}
	return result;
}

ImageMat.cooccurrenceMatrixEntropy = function(com, levels){
	var i, value;
	var size = com.length;//levels*levels;
	var result = 0;
	for(i=0; i<size; ++i){
		value = com[i];
		if(value>0){
			value = value * Math.log2(value);
			result += value;
		}
	}
	//var maxEntropy = -Math.log2(1.0/levels);
	//result = result / maxEntropy;
	result = result / (levels-1);
	return -result;
}

ImageMat.cooccurrenceMatrixHomogeneity = function(com, levels){
	var i, value;
	var size = com.length;
	var result = 0;
	for(j=0; j<levels; ++j){
		for(i=0; i<levels; ++i){
			var index = j*levels + i;
			value = com[index];
			value = value / (1 + Math.abs(i - j));
			result += value;
		}
	}
	return result;
}

ImageMat.cooccurrenceMatrixCorrelation = function(com, levels){
	var i, value;
	var size = com.length;
	var result = 0;
	/*
	var muI = ?;
	var muJ = ?;
	var sigI = ?;
	var sigJ = ?;
	for(j=0; j<levels; ++j){
		for(i=0; i<levels; ++i){
			var index = j*levels + i;
			value = com[index];
			// value = value / (1 + Math.abs(i - j));
			// result += value;
		}
	}
	result = result / ( ? );
	*/
	return result;
}

ImageMat.scaleByInteger = function(image,imageWidth,imageHeight, skipCount){ // grabs every nth pixel into new
	var scaledWidth = imageWidth/skipCount | 0;
	var scaledHeight = imageHeight/skipCount | 0;
	var scaledImage = [];
	for(var j=0; j<scaledHeight; ++j){
		for(var i=0; i<scaledWidth; ++i){
			var index = (j*skipCount)*imageWidth + (i*skipCount);
			var ind = j*scaledWidth + i;
			scaledImage[ind] = image[index];
		}
	}
	return {"value":scaledImage, "width":scaledWidth, "height":scaledHeight};
}

ImageMat.convolve = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var total = imageWidth*imageHeight;
	var i, j, n, m, sum, staN, endN, staM, endM;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	// var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var result = new Array(total);
	var jIW = 0;
	for(j=0;j<imageHeight;++j){
		// jIW = j*imageWidth;
		for(i=0;i<imageWidth;++i){
			staN = Math.max( oW2F-i, 0);
			endN = Math.min(operatorWidth,oW2F+imageWidth-i);
			staM = Math.max( oH2F-j, 0);
			endM = Math.min(operatorHeight,oH2F+imageHeight-j);
			sum = 0.0;
			var mW = staM*operatorWidth;
			var jW = (j+staM-oH2F)*imageWidth;
			for(m=staM;m<endM;++m){
				// var mW = m*operatorWidth;
				// var jW = (j+m-oH2F)*imageWidth;
				for(n=staN;n<endN;++n){
					sum += image[jW+(i+n-oW2F)] * operator[mW+n];
				}
				mW += operatorWidth;
				jW += imageWidth;
			}
			result[jIW+i] = sum;
		}
		jIW += imageWidth;
	}
	return {"value":result,"width":imageWidth,"height":imageHeight};
}
// INNER CONVOLUTION?

ImageMat.convolveConvScores = function(haystack,needle) {
	var gry = ImageMat.convolve(haystack.gry(),haystack.width(),haystack.height(), needle.gry(),needle.width(),needle.height());
	var red = ImageMat.convolve(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolve(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolve(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	var wid = red.width;
	var hei = red.height;
	var count = wid*hei;
		gry = gry.value;
		red = red.value;
		grn = grn.value;
		blu = blu.value;
	var scores = [];
	for(i=0; i<count; ++i){
		//scores[i] = (red[i]+grn[i]+blu[i]);
		//scores[i] = red[i] + grn[i] + blu[i] + gry[i];
		scores[i] = (red[i]+grn[i]+blu[i])/3.0 + gry[i];
		//scores[i] = gry[i];
		//scores[i] = red[i]*grn[i]*blu[i];
		//scores[i] = red[i]*grn[i]*blu[i] + gry[i];
		//scores[i] = Math.abs(red[i]*grn[i]*blu[i]*gry[i]);
		//scores[i] = grn[i]*blu[i]*gry[i];
	}
	//scores = red[i];
	//scores = haystack.gry();
	return {"value":scores, "width":wid, "height":hei};
}

ImageMat.convolveSSDScores = function(haystack,needle) {
	var gry = ImageMat.convolveSSDFloat(haystack.gry(),haystack.width(),haystack.height(), needle.gry(),needle.width(),needle.height());
	var red = ImageMat.convolveSSDFloat(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolveSSDFloat(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolveSSDFloat(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
		gry = gry.value;
		red = red.value;
		grn = grn.value;
		blu = blu.value;
	var wid = haystack.width()-needle.width()+1;
	var hei = haystack.height()-needle.height()+1;
	var count = wid*hei;
	var scores = [];
	for(i=0; i<count; ++i){
		//scores[i] = red[i]+grn[i]+blu[i];
		//scores[i] = red[i] + grn[i] + blu[i] + gry[i];
		//scores[i] = (red[i]+grn[i]+blu[i])/3.0 + gry[i];
		//scores[i] = gry[i];
		//scores[i] = red[i]*grn[i]*blu[i];
		//scores[i] = red[i]*grn[i]*blu[i] + gry[i];
		//scores[i] = red[i]*grn[i]*blu[i]*gry[i];
		scores[i] = red[i]*grn[i]*blu[i]*gry[i];
	}
	return {"value":scores, "width":wid, "height":hei};

}
ImageMat.convolveSSD = function(haystack,needle) {
	var red = ImageMat.convolveSSDFloat(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolveSSDFloat(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolveSSDFloat(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	return new ImageMat(red.width,red.height, red.value,grn.value,blu.value);
}
ImageMat.convolveConv = function(haystack,needle) {
	var red = ImageMat.convolve(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolve(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolve(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	return new ImageMat(red.width,red.height, red.value,grn.value,blu.value);
}
ImageMat.convolveSSDFloat = function(haystack,haystackWidth,haystackHeight, needle,needleWidth,needleHeight) { // normalized ssd single channel
	if(needleWidth>haystackWidth || needleHeight>haystackHeight){ // flipped
		console.log("FLIPPED");
		return null;
	}
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return [];
	}

	var minN = Math.min.apply(this,needle);
	var maxN = Math.max.apply(this,needle);
	var rangeN = maxN-minN;
	var midN = minN + rangeN*0.5;
	var invRangeN = rangeN != 0 ? rangeN : 1.0;

	//
	var result = new Array();
	for(var j=0; j<resultHeight; ++j){
		for(var i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var ssd = 0;
			var maxH = null;
			var minH = null;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
					maxN = maxN==null || maxN<n ? n : maxN;
					minN = minN==null || minN>n ? n : minN;
				}
			}
			var rangeH = maxH-minH;
			var midH = minH + rangeH*0.5;
			var invRangeH = rangeH != 0 ? rangeH : 1.0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
						// n = (n - midN)*invRangeN;
						// h = (h - midH)*invRangeH;
					//ssd += Math.pow( rangeN*(n-minN) - rangeH*(h-minH),2);
					//ssd += Math.abs( rangeN*(n-minN) - rangeH*(h-minH));
					//ssd += Math.abs( (n-minN) - (h-minH));
					//ssd += Math.abs(n - h);
					ssd += Math.pow(n - h,2);
				}
			}
			result[resultIndex] = ssd;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
ImageMat.SADFloatAsIsChannels = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu){
	var scoreR = ImageMat.SADFloatAsIs(aRed,bRed);
	var scoreG = ImageMat.SADFloatAsIs(aGrn,bGrn);
	var scoreB = ImageMat.SADFloatAsIs(aBlu,bBlu);
	return (scoreR + scoreG + scoreB) / 3.0;
}
ImageMat.SADFloatAsIs = function(a,b){
	var score = 0;
	var i, len = Math.min(a.length, b.length);
	for(i=0; i<len; ++i){
		score += Math.abs(a[i]-b[i]);
	}
	return score;
}
ImageMat.SADFloatSimpleChannelsRGB = function(aRed,aGrn,aBlu, wid,hei, bRed,bGrn,bBlu){
	var scoreR = ImageMat.SADFloatSimple(aRed,wid,hei,bRed);
	var scoreG = ImageMat.SADFloatSimple(aGrn,wid,hei,bGrn);
	var scoreB = ImageMat.SADFloatSimple(aBlu,wid,hei,bBlu);
	/// WHICH IS EMPIRICALLLY BETTER?
	return scoreR * scoreG * scoreB;
	//return scoreR + scoreG + scoreB;
}
ImageMat.SADFloatSimple = function(imageA,wid,hei, imageB, maskArea){
	var i, a, b, len = wid*hei;
	var sad = 0;
	var medianA = 0;
	var medianB = 0;
	var rangeA = 0;
	var rangeB = 0;
	var minA = imageA[0];
	var minB = imageB[0];
	var maxA = minA;
	var maxB = minB;
	for(i=0; i<len; ++i){
		a = imageA[i];
		b = imageB[i];
		medianA += a;
		medianB += b;
		minA = Math.min(minA,a);
		minB = Math.min(minB,b);
		maxA = Math.max(maxA,a);
		maxB = Math.max(maxB,b);
	}
	rangeA = maxA - minA;
	rangeB = maxB - minB;
	medianA = medianA / len;
	medianB = medianB / len;
	var mask = 1.0;
	for(i=0; i<len; ++i){
		if(maskArea){
			mask = maskArea[i];
		}
		a = imageA[i];
		b = imageB[i];
		a -= medianA;
		b -= medianB;
		// a = a / (rangeA!==0.0 ? rangeA : 1.0);
		// b = b / (rangeB!==0.0 ? rangeB : 1.0);
		sad += mask * Math.abs(a - b);
		//sad += Math.pow(a - b,2);
		// more what looking for: 0=>0, 1=>3
		//sad += (Math.pow( 1 + Math.abs(a-b),2) - 1); == x*x + 2x; -- mostly just linear anyway
	}
//	console.log("RANGES: "+rangeA+" | "+rangeB);
	//var range = (rangeA+rangeB)*0.5;
	//var range = Math.min(rangeA,rangeB);
//		range = Math.pow(range,2); // too m
//		range = range!=0 ? range : 1.0;
//		range = range * range;
//		range = Math.sqrt(range);
//console.log("RANGE: "+range);
//	console.log("RANGE: "+sad+" / "+range+" = "+(sad/range));
// higher range is better score 0----
//sad = sad / range; // worse results
	return sad;
}
/*
ImageMat.ssds = function(windowA, windowB){ // TODO: make tihs SSD not conv
	var ssdRed = ImageMat.convolve(windowA.red(),windowA.width(),windowA.height(), windowB.red(),windowB.width(),windowB.height());
	var ssdGrn = ImageMat.convolve(windowA.grn(),windowA.width(),windowA.height(), windowB.grn(),windowB.width(),windowB.height());
	var ssdeBlu = ImageMat.convolve(windowA.blu(),windowA.width(),windowA.height(), windowB.blu(),windowB.width(),windowB.height());
	var wid = windowA.width();
	var hei = windowA.height();
	var scores = [];
	for(var i=0; i<convolveRed.length; ++i){
		scores[i] = convolveRed[i]*convolveGrn[i]*convolveBlu[i];
	}
	var scores  = Code.findExtrema2DFloat(scores,wid,hei);
	scores = scores.sort(function(a,b){
		return Math.abs(a.z)<Math.abs(b.z) ? -1 : 1;
	});
	return scores;
}

ImageMat.convsss = function(windowA, windowB){ // TODO: make tihs SSD not conv
	var convolveRed = ImageMat.convolve(windowA.red(),windowA.width(),windowA.height(), windowB.red(),windowB.width(),windowB.height());
	var convolveGrn = ImageMat.convolve(windowA.grn(),windowA.width(),windowA.height(), windowB.grn(),windowB.width(),windowB.height());
	var convolveBlu = ImageMat.convolve(windowA.blu(),windowA.width(),windowA.height(), windowB.blu(),windowB.width(),windowB.height());
	var wid = windowA.width();
	var hei = windowA.height();
	var scores = [];
	for(var i=0; i<convolveRed.length; ++i){
		//scores[i] = convolveRed[i] + convolveGrn[i] + convolveBlu[i];
		scores[i] = convolveRed[i]*convolveGrn[i] + convolveBlu[i];
	}
	var scores  = Code.findExtrema2DFloat(scores,wid,hei);
	scores = scores.sort(function(a,b){
		return Math.abs(a.z)<Math.abs(b.z) ? -1 : 1;
	});
	return scores;
}
*/
ImageMat.ssdEqual = function(windowA, windowB){
	//var score = ImageMat.ssd(windowA.image,windowA.width,windowA.height, windowB.image,windowB.width,windowB.height);
	var scoreRed = Code.SSDEqual(windowA.red(),windowB.red());
	var scoreGrn = Code.SSDEqual(windowA.grn(),windowB.grn());
	var scoreBlu = Code.SSDEqual(windowA.blu(),windowB.blu());
	var scoreGry = Code.SSDEqual(windowA.gry(),windowB.gry());
	var score = (scoreRed+scoreGrn+scoreBlu)/3.0 + scoreGry;
	return score;
}


ImageMat.ssd = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var total = imageWidth*imageHeight;
	var i, j, n, m, sum, staN, endN, staM, endM, num;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var result = new Array(total);
	for(j=0;j<imageHeight;++j){
		jIW = j*imageWidth;
		for(i=0;i<imageWidth;++i){
			staN = Math.max( oW2F-i, 0);
			endN = Math.min(operatorWidth,oW2F+imageWidth-i);
			staM = Math.max( oH2F-j, 0);
			endM = Math.min(operatorHeight,oH2F+imageHeight-j);
			sum = 0.0;
			for(m=staM;m<endM;++m){
				for(n=staN;n<endN;++n){
					num = image[(j+m-oH2F)*imageWidth+(i+n-oW2F)]-operator[m*operatorWidth+n];
					sum += num*num;
				}
			}
			result[jIW+i] = sum;
		}
	}
	return result;
}
ImageMat.ssdInner = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var i, j, n, m, sum, staN, endN, staM, endM, num;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var resultWidth = imageWidth - operatorWidth;
	var resultHeight = imageHeight - operatorHeight;
	var total = resultWidth*resultHeight;
	var result = new Array(total);
	var iWm1 = imageWidth - oH2F;
	var iHm1 = imageHeight - oH2F;
	var index = 0;
	for(j=oH2F;j<iHm1;++j){
		jIW = j*imageWidth;
		for(i=oW2F;i<iWm1;++i){
			sum = 0.0;
			for(m=0;m<operatorHeight;++m){
				for(n=0;n<operatorWidth;++n){
					num = image[(j+m-oH2F)*imageWidth+(i+n-oW2F)]-operator[m*operatorWidth+n];
					sum += num*num;
				}
			}
			result[index] = sum;
			++index;
		}
	}
	return result;
}
ImageMat.historizeLocalFloat01 = function(data,wid,hei, winWid,winHei){ // weird square-effect
	winWid = winWid!==undefined?winWid:25;
	winHei = winHei!==undefined?winHei:25;
	var result = new Array(wid*hei);
	var wo2 = Math.floor(winWid*0.5);
	var ho2 = Math.floor(winHei*0.5);
	var i,j,ii,jj,index,ind, max,min,range, mI,mJ;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			index = wid*j+i;
			max = min = data[index];
			mI = Math.min(Math.max(i-wo2,0),wid-winWid);
			mJ = Math.min(Math.max(j-ho2,0),hei-winHei);
			for(jj=0;jj<winHei;++jj){
				for(ii=0;ii<winWid;++ii){
					ind = (mJ+jj)*wid+(mI+ii);
					if(data[ind]>max){ max = data[ind]; }
					if(data[ind]<min){ min = data[ind]; }
				}
			}
			range = max-min;
			if(range!=0){
				result[index] = (data[index]-min)/range;
			}else{
				result[index] = 0.0;
			}
		}
	}
	return result;
}
ImageMat.getRangeEnds = function(data){
	var i, len = data.length;
	var min = data[0], max = data[0];
	// for(i=1;i<len;++i){
	// 	min = Math.min(min,data[i]);
	// 	max = Math.max(max,data[i]);
	// }
	min = Math.min.apply(this,data);
	max = Math.max.apply(this,data);
	return {min:min, max:max};
}
ImageMat.getRange = function(data){
	var range = ImageMat.getRangeEnds(data);
	return range.max - range.min;
}

ImageMat.historize0255 = function(data){
	var i, len = data.length;
	var bins = new Array(256);
	var result = new Array(len);
	for(i=0;i<256;++i){ bins[i]=0; }
	for(i=0;i<len;++i){ bins[data[i]]++; } // pdf
	for(i=1;i<256;++i){ bins[i] += bins[i-1]; } // cdf
	var min = bins[0], max = bins[255];
	var range = max - min;
	for(i=0;i<256;++i){
		bins[i] = Math.round(255.0*(bins[i]-min)/range);
	}
	for(i=0;i<len;++i){
		result[i] = bins[ data[i] ];
	}
	return result;
}
ImageMat.rangeStretch0255 = function(data){
	var i, len = data.length;
	var result = new Array(len);
	var min = data[0], max = data[0];
	for(i=1;i<len;++i){
		min = Math.min(min,data[i]);
		max = Math.max(max,data[i]);
	}
	var range = max-min;
	for(i=0;i<len;++i){
		result[i] = Math.round(255.0*(data[i]-min)/range);
	}
	return result;
}
ImageMat.gtFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]>val)?1.0:0.0;
	}
	return result;
}
ImageMat.gteFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]>=val)?1.0:0.0;
	}
	return result;
}
ImageMat.ltFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]<val)?1.0:0.0;
	}
	return result;
}

ImageMat.leFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]<=val)?1.0:0.0;
	}
	return result;
}
// ------------------------------------------------------------------------------------------------------------------------ maths
ImageMat.squareFloat = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = data[i]*data[i];
	}
	return data;
}
ImageMat.invertFloat = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		if(data[i]==0){
			data[i]=0;
		}else{
			data[i] = 1.0/data[i];
		}
	}
	return data;
}
ImageMat.vectorSumFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.sqrt(a[i]*a[i],b[i]*b[i]);
	}
	return result;
}
ImageMat.sqrtFloat = function(a){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.sqrt(a[i]);
	}
	return result;
}
ImageMat.vectorSquaredSumFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]*a[i],b[i]*b[i];
	}
	return result;
}
ImageMat.absFloat = function(a){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.abs(a[i]);
	}
	return result;
}
ImageMat.sumFloat = function(a){
	var i, len = a.length;
	var result = 0.0;
	for(i=0;i<len;++i){
		result += a[i];
	}
	return result;
}
ImageMat.addFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]+b[i];
	}
	return result;
}
ImageMat.maxFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.max(a[i],b[i]);
	}
	return result;
}
ImageMat.addConst = function(a,b){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] += b;
	}
	return a;
}
ImageMat.subFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i] - b[i];
	}
	return result;
}
ImageMat.mulFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]*b[i];
	}
	return result;
}
ImageMat.mulConst = function(a,b){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] *= b;
	}
	return a;
}
ImageMat.scaleFloat = function(a,b){
	var i, len = b.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a*b[i];
	}
	return result;
}
ImageMat.scaleFloatSame = function(a,b){ // = blockFlatGaussian
	throw "use mulConst"
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] = a[i]*b;
	}
	return a;
}
ImageMat.phaseFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.atan2(b[i],a[i]);
	}
	return result;
}
ImageMat.normFloats3D = function(x,y,z){
	var i, len = x.length, length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		length = Math.sqrt(x[i]*x[i]+y[i]*y[i]+z[i]*z[i]);
		if(length!=0){
			x[i] /= length;
			y[i] /= length;
			z[i] /= length;
		}
	}
}
ImageMat.getSubImageFxn = function(src,width,height, colSta,colEnd, rowSta,rowEnd, fxn){
	var i, j, index, ind, val;
	// var wid = colEnd-colSta+1;
	// var hei = colEnd-colSta+1;
	// var len = wid*hei;
	for(index=0, j=rowSta;j<=rowEnd;++j){
		for(i=colSta; i<=colEnd;++i,++index){
			ind = j*width + i;
			val = src[ind];
			fxn(val, i,j, ind);
		}
	}
}
ImageMat.prototype.addConst = function(a){
	// this._op(ImageMat.addConst);
	ImageMat.addConst(this._r, a);
	ImageMat.addConst(this._g, a);
	ImageMat.addConst(this._b, a);
	return this;
}

ImageMat.prototype._op = function(fxn,args){
	args = args!==undefined ? args : [];
	fxn.apply(this, Code.copyArray(args).unshift(this._r) );
	fxn.apply(this, Code.copyArray(args).unshift(this._g) );
	fxn.apply(this, Code.copyArray(args).unshift(this._b) );
}
ImageMat.prototype.clipFloat01 = function(){
	this._op(ImageMat.clipFloat01);
	return this;
}
ImageMat.prototype.normalFloat01 = function(){
	this._op(ImageMat.normalFloat01);
	return this;
}
ImageMat.prototype.invertFloat01 = function(){
	this._op(ImageMat.invertFloat01);
	return this;
}
ImageMat.prototype.tint = function(color, percent){ // new color = old color * (1-p) + tint * p -- alpha ignored
	var red = Code.getFloatRedARGB(color);
	var grn = Code.getFloatGrnARGB(color);
	var blu = Code.getFloatBluARGB(color);
	ImageMat.tint(this._r,red,percent);
	ImageMat.tint(this._g,grn,percent);
	ImageMat.tint(this._b,blu,percent);
	return this;
}
ImageMat.tint = function(a,v,p){
	var i, len = a.length;
	var result = new Array(len);
	var q = 1.0-p;
	for(i=0;i<len;++i){
		a[i] = a[i]*q + v*p;
	}
	return result;
}
ImageMat.clipFloat01 = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.min(Math.max(data[i],0.0),1.0);
	}
	return data;
}
ImageMat.normalFloat01 = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range = max - min;
	if(range==0){range = 1.0;}
	for(i=0;i<len;++i){
		data[i] = (data[i]-min)/range;
	}
	return data;
}
ImageMat.normalFloatAboutZero = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range = max - min;
	for(i=0;i<len;++i){
		data[i] = (data[i]-min)/range - 0.5;
	}
	return data;
}
ImageMat.normalFloatNegToOne = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range;
	if(min<0){
		range = Math.max(max,-min);
	}else{
		range = max;
	}
	if(range==0){
		return;
	}
	for(i=0;i<len;++i){
		data[i] = data[i]/range;
	}
	return data;
}

ImageMat.getNormalFloat01 = function(data){
	return ImageMat.normalFloat01( Code.copyArray(new Array(),data) );
}
ImageMat.applyFxnFloat = function(data,fxn){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = fxn(data[i]);
	}
}
ImageMat.invertFloat01 = function(data){ // flip 0 1
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = 1.0-data[i];
	}
	return data;
}
ImageMat.randomFloat01 = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.random();
	}
	return data;
}
ImageMat.random = function(data,mag,off){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = data[i] + Math.random()*mag - off;
	}
	return data;
}
ImageMat.randomAdd = function(data,mag,off){
	var i, len = data.length;
	var result = new Array();
	for(i=0;i<len;++i){
		result[i] = data[i] + Math.random()*mag - off;
	}
	return result;
}
ImageMat.flipAbsFxn = function(f){
	return Math.abs(f-0.5);
}
ImageMat.log = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.log(data[i]);
	}
	return data;
}
ImageMat.add = function(data, c){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = data[i] + c;
	}
	return data;
}
ImageMat.pow = function(data,power){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.pow(data[i],power);
	}
	return data;
}
ImageMat.abs = function(a){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] = Math.abs(a[i]);
	}
	return a;
}
ImageMat.clipRange = function(a, min,max){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] = Math.min(Math.max(a[i],min),max);
	}
	return a;
}
ImageMat.nonZero = function(data){
	var i, len = data.length;
	var result = [];
	for(i=0;i<len;++i){
		result[i] = data[i]!=0 ? 1.0 : 0.0;
	}
	return result;
}

ImageMat.getPointInterpolateNearest = function(array, wid,hei, x,y){
	var hm1 = hei-1, wm1 = wid-1;
	x = Math.min(Math.max(Math.round(x),0),wm1);
	y = Math.min(Math.max(Math.round(y),0),hm1);
	index = y*wid + x;
	return array[index];
}

ImageMat.getPointInterpolateLinear = function(array, wid,hei, x,y){
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var indexA = minY*wid + minX; var colA = array[indexA];
	var indexB = minY*wid + maxX; var colB = array[indexB];
	var indexC = maxY*wid + minX; var colC = array[indexC];
	var indexD = maxY*wid + maxX; var colD = array[indexD];
	minX = x - minX;
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	var val = Code.linear2D(minX,minY, colA,colB,colC,colD);
	if(isNaN(val)){
		console.log("PT",wid,hei,x,y);
	}
	return val;
}

ImageMat.getPointInterpolateCubic = function(array, wid,hei, x,y){
	x = Math.max(Math.min(x,wid-1),0);
	y = Math.max(Math.min(y,hei-1),0);
	var minX = Math.max(Math.floor(x), 0);
	var miiX = Math.max(minX-1, 0);
	var maxX = Math.min(Math.ceil(x), wid-1);
	var maaX = Math.min(maxX+1, wid-1);
	var minY = Math.max(Math.floor(y),0);
	var miiY = Math.max(minY-1,0);
	var maxY = Math.min(Math.ceil(y), hei-1);
	var maaY = Math.min(maxY+1, hei-1);
	var colA = array[miiY*wid + miiX];
	var colB = array[miiY*wid + minX];
	var colC = array[miiY*wid + maxX];
	var colD = array[miiY*wid + maaX];
	var colE = array[minY*wid + miiX];
	var colF = array[minY*wid + minX];
	var colG = array[minY*wid + maxX];
	var colH = array[minY*wid + maaX];
	var colI = array[maxY*wid + miiX];
	var colJ = array[maxY*wid + minX];
	var colK = array[maxY*wid + maxX];
	var colL = array[maxY*wid + maaX];
	var colM = array[maaY*wid + miiX];
	var colN = array[maaY*wid + minX];
	var colO = array[maaY*wid + maxX];
	var colP = array[maaY*wid + maaX];
	var pX = x - minX;
	var pY = y - minY;
	var val = Code.cubic2D(pX,pY, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colN,colO,colP);
	if(isNaN(val)){
		console.log(array);

		console.log(maaY*wid + maaX);
		console.log(array[maaY*wid + maaX]);

		console.log(" x "+miiX);
		console.log(" x "+minX);
		console.log(" x "+maxX);
		console.log(" x "+maaX);
		console.log(" y "+miiY);
		console.log(" y "+minY);
		console.log(" y "+maxY);
		console.log(" y "+maaY);
		console.log(" - "+pX);
		console.log(" - "+pY);
		// O & P & K & L
		console.log("PT",wid,hei,x,y);
		console.log("IN                ",colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colN,colO,colP );
		//console.log("colN "+colN+" => "+wasA+","+wasB+"    "+x+","+y);

		throw("Image Mat NaN "+wid+" "+hei+" "+x+" "+y+" = "+val);
		return 0;
	}
	val = Math.min(Math.max(val,0.0),1.0);
	return val;
}

// projective transform
ImageMat.extractRectWithProjection = function(source,sW,sH, wid,hei, projection, interpolationType){ // projection is 3x3 Matrix
	// interpolationType : 1=linear, 3=cubic
	var i, j, fr = new V3D(), val = new V3D();
	if( !(source instanceof Array) ){
		// Code.isa(source,Array)
		var destination = new ImageMat(wid,hei);
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				fr.x = i; fr.y = j;
				projection.multV2DtoV3D(fr,fr);
				fr.x /= fr.z; fr.y /= fr.z;
				source.getPoint(val, fr.x,fr.y);
				destination.setPoint(i,j, val);
			}
		}
	}else{
		destination = new Array(wid*hei);
		var index = 0;
		for(j=0;j<hei;++j){
			// var wJ = wid*j;
			for(i=0;i<wid;++i){
				fr.x = i; fr.y = j;
				projection.multV2DtoV3D(fr,fr);
				fr.x /= fr.z; fr.y /= fr.z;
				// destination[index] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
				// destination[wJ+i] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
				 // destination[wid*j+i] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
				 destination[index] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
				//destination[index] = ImageMat.getPointInterpolateNearest(source, sW,sH, fr.x,fr.y);
				++index;
			}
		}
	}
	return destination;
}
ImageMat.extractRectWithProjectionIsInside = function(sW,sH, wid,hei, projection){
	destination = new Array(wid*hei);
	var i, j, index=0, fr = new V3D();
	var wm1 = sW-1;
	var hm1 = sH-1;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			fr.x = i; fr.y = j;
			projection.multV2DtoV3D(fr,fr);
			fr.x /= fr.z; fr.y /= fr.z;
			if(0<=fr.x && fr.x<=wm1 && 0<=fr.y && fr.y<=hm1){
				destination[index] = 1.0;
			}else{
				destination[index] = 0.0;
			}
			++index;
		}
	}
	return destination;
}

ImageMat.extractRect = function(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH, isInside){ // generates homography beforehand
	if(!ImageMat.extractRect_temp3x3){
		ImageMat.extractRect_temp3x3 = new Matrix(3,3);
	}
	if(!ImageMat.extractRect_temp8x8){
		ImageMat.extractRect_temp8x8 = new Matrix(8,8);
	}
	if(!ImageMat.extractRect_temp8x1){
		ImageMat.extractRect_temp8x1 = new Matrix(8,1);
	}
	if(!ImageMat.extractRect_listA){
		ImageMat.extractRect_listA = [new V2D(),new V2D(),new V2D(),new V2D()];
	}
	if(!ImageMat.extractRect_listB){
		ImageMat.extractRect_listB = [new V2D(),new V2D(),new V2D(),new V2D()];
	}
	// now that its all set, use this going forward:
	ImageMat.extractRect = ImageMat._extractRectInit;
	return ImageMat.extractRect(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH, isInside);
}
ImageMat._extractRectInit = function(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH, isInside){
	var fr = ImageMat.extractRect_listA;
	fr[0].set(0,0); fr[1].set(wid-1,0); fr[2].set(wid-1,hei-1); fr[3].set(0,hei-1);
	var to = ImageMat.extractRect_listB;
	to[0].set(aX,aY); to[1].set(bX,bY), to[2].set(cX,cY), to[3].set(dX,dY);
	var projection = Matrix.get2DProjectiveMatrix(fr,to, ImageMat.extractRect_temp3x3, ImageMat.extractRect_temp8x8, ImageMat.extractRect_temp8x1);
	if(isInside){
		return ImageMat.extractRectWithProjectionIsInside(sW,sH, wid,hei, projection);
	}
	return ImageMat.extractRectWithProjection(source,sW,sH, wid,hei, projection);
}

ImageMat.prototype.extractRect = function(aX,aY,bX,bY,cX,cY,dX,dY, wid,hei){
	var width = this.width();
	var height = this.height();
	var r = ImageMat.extractRect(this.red(), aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, width,height);
	var g = ImageMat.extractRect(this.grn(), aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, width,height);
	var b = ImageMat.extractRect(this.blu(), aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, width,height);
	return new ImageMat(wid,hei, r,g,b);
}

ImageMat.extractRectSimple = function(source, width,height, x,y,w,h, wid,hei){
	var size = wid*hei;
	var destination = Code.newArrayZeros(size);
	var i, j, index, fromX, fromY, value;
	var wm1 = wid - 1;
	var hm1 = hei - 1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = wid*j + i;
			fromX = x + w*(i/wm1);
			fromY = y + h*(j/hm1);
			value = ImageMat.getPointInterpolateCubic(source, width,height, fromX, fromY);
			destination[index] = value;
		}
	}
	return destination;
}
ImageMat.extractRectFromPointSimple = function(source, width,height, x,y,scale, wid,hei){
	var w = wid/scale;
	var h = hei/scale;
	var sX = x - w*0.5;
	var sY = y - h*0.5;
	return ImageMat.extractRectSimple(source, width,height, sX,sY,w,h, wid,hei);
}

ImageMat.extractRectFromMatrix = function(source, width,height, newWidth,newHeight, matrix){
	// TODO: VERIFY ?
	// source,sW,sH, wid,hei, projection, interpolationType
	return ImageMat.extractRectWithProjection(source, width,height, newWidth,newHeight, matrix);
}

ImageMat.prototype.imageAtPoint = function(x,y,scale,w,h,matrix, insideCheck){
	if(insideCheck){
		return ImageMat.imageAtPoint(x,y,scale,w,h, null,null,null,this._width,this._height, matrix);
	}
	var list = ImageMat.imageAtPoint(x,y,scale,w,h, this._r,this._g,this._b,this._width,this._height, matrix);
	return new ImageMat(w,h, list[0],list[1],list[2]);
}
ImageMat.imageAtPoint = function(x,y,scale, w,h, red,grn,blu,imgWid,imgHei, matrix){
	var wm1 = w-1;
	var hm1 = h-1;
	var left = x - (wm1*0.5)*scale;
	var right = x + (wm1*0.5)*scale;
	var top = y - (hm1*0.5)*scale;
	var bot = y + (hm1*0.5)*scale;
	var O = ImageMat._O; O.set(0,0);
	var TL = ImageMat._TL; TL.set(left,top);
	var TR = ImageMat._TR; TR.set(right,top);
	var BR = ImageMat._BR; BR.set(right,bot);
	var BL = ImageMat._BL; BL.set(left,bot);
	if(matrix){ // to origin & to updated center
		var center1 = ImageMat._center1; center1.set(x,y);
		var center2 = ImageMat._center2;
		matrix.multV2DtoV2D(center2,center1);
		matrix = ImageMat.extract_M2D_A.copy(matrix); // change locally
		matrix.inverse();
		var m = ImageMat.extract_M2D_B;
			m.set(1,0,0,1, center2.x-center1.x,center2.y-center1.y);
		matrix.premult(m);
 		// apply to all points
		matrix.multV2DtoV2D(TL,TL);
		matrix.multV2DtoV2D(TR,TR);
		matrix.multV2DtoV2D(BR,BR);
		matrix.multV2DtoV2D(BL,BL);
	}
	// EXTRACT AROUND SOURCE POINT
	if(!red){ // return is inside
		return ImageMat.extractRect(null, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, w,h, imgWid,imgHei, true);
		// ImageMat.extractRectWithProjectionIsInside(sW,sH, wid,hei, projection);
	}
	red = ImageMat.extractRect(red, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, w,h, imgWid,imgHei);
	if(grn){
		grn = ImageMat.extractRect(grn, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, w,h, imgWid,imgHei);
		blu = ImageMat.extractRect(blu, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, w,h, imgWid,imgHei);
		return [red,grn,blu];
	}
	return red;
}


ImageMat.padFloat = function(src,wid,hei, left,right,top,bot){
	return Code.padArray2DLinear(src,wid,hei, left,right,top,bot);
}

ImageMat.unpadFloat = function(src,wid,hei, left,right,top,bot){
	return Code.unpadArray2DLinear(src,wid,hei, left,right,top,bot);
	// var newWid = wid-left-right, newHei = hei-top-bot;
	// var newLen = newWid*newHei;
	// var result = new Array(newLen);
	// var i, j, nJ, nJJ;
	// for(j=0;j<newHei;++j){
	// 	nJ = (j+top)*wid;
	// 	nJJ = j*newWid;
	// 	for(i=0;i<newWid;++i){
	// 		result[nJJ+i] = src[nJ + i+left];
	// 	}
	// }
	// return result;
}
ImageMat.applyGaussianFloat = function(src,wid,hei, sigma){
	var gaussSizeBase = 5;
	var gaussSize = gaussSizeBase*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	var tmp = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	var newWid = wid+2.0*padding;
	var newHei = hei+2.0*padding;
	var tmp = ImageMat.gaussian2DFrom1DFloat(tmp, newWid,newHei, gauss1D);
	return ImageMat.unpadFloat(tmp, newWid,newHei, padding,padding,padding,padding);
}
ImageMat.prototype.derivativeX = function(){
	var dr = ImageMat.derivativeX(this._r,this._width,this._height).value;
	var dg = ImageMat.derivativeX(this._g,this._width,this._height).value;
	var db = ImageMat.derivativeX(this._b,this._width,this._height).value;
	return new ImageMat(this._width,this._height, dr,dg,db);
}
ImageMat.prototype.derivativeY = function(){
	var dr = ImageMat.derivativeY(this._r,this._width,this._height).value;
	var dg = ImageMat.derivativeY(this._g,this._width,this._height).value;
	var db = ImageMat.derivativeY(this._b,this._width,this._height).value;
	return new ImageMat(this._width,this._height, dr,dg,db);
}
/*
ImageMat.prototype.colorGradientVector = function(){ // insetted by 1 on each side .. not really an actual working thing yet
	var wid = this.width();
	var hei = this.height();
	var red = this.red();
	var grn = this.grn();
	var blu = this.blu();
	var wm1 = wid-1;
	var hm1 = hei-1;
	var newWid = Math.max(wid-2,0);
	var newHei = Math.max(hei-2,0);
	var vectors = [];
	var dx = new V3D();
	var dy = new V3D();
	if(newWid>0 && newHei>0){
		for(var j=1; j<hm1; ++j){
			for(var i=1; i<wm1; ++i){
				var cn = (j+0)*wid + (i+0);
				var lf = (j+0)*wid + (i-1);
				var ri = (j+0)*wid + (i+1);
				var to = (j-1)*wid + (i+0);
				var bo = (j+1)*wid + (i+0);
				var dxR = red[ri] - red[lf];
				var dxG = grn[ri] - grn[lf];
				var dxB = blu[ri] - blu[lf];
				var dyR = red[bo] - red[to];
				var dyG = grn[bo] - grn[to];
				var dyB = blu[bo] - blu[to];
				dx.x = dxR*0.5;
				dx.y = dxG*0.5;
				dx.z = dxB*0.5;
				dy.x = dyR*0.5;
				dy.y = dyG*0.5;
				dy.z = dyB*0.5;
				var v = V3D.add(dx,dy);
				var index = (j-1)*newWid + (i-1);
				vectors[index] = v;
			}
		}
	}
	return {"value":vectors, "width":newWid, "height":newHei};
}
*/
ImageMat.prototype.colorGradient = function(){
	var image = this;
	var wid = image.width();
	var hei = image.height();
	var vR = image.red();
	var vG = image.grn();
	var vB = image.blu();
	var vectors = [];
	var wm1 = wid-1;
	var hm1 = hei-1;
	var averageColor = new V3D();
	for(var j=0; j<=hm1; ++j){
		for(var i=0; i<=wm1; ++i){
			var minI = Math.max(i-1,0);
			var maxI = Math.min(i+1,wm1);
			var minJ = Math.max(j-1,0);
			var maxJ = Math.min(j+1,hm1);
			averageColor.set(0,0,0);
			for(var jj=minJ;jj<=maxJ;++jj){
				for(var ii=minI;ii<=maxI;++ii){
					var ind = jj*wid + ii;
					var r = vR[ind];
					var g = vG[ind];
					var b = vB[ind];
					averageColor.add(r,g,b);
				}
			}
			averageColor.scale(1.0/( (maxI-minI+1) * (maxJ-minJ+1) ));
			var index = j*wid + i;
			var r = vR[index];
			var g = vG[index];
			var b = vB[index];
			var v = new V3D(r,g,b);
			v.sub(averageColor);
			vectors.push(v);
		}
	}
	return {"value":vectors, "width":wid, "height":hei};
}

ImageMat.derivativeX = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		var xm1 = Math.max(x-1,0);
		var xp1 = Math.min(x+1,wid-1);
		return -0.5*src[wid*y+xm1] + 0.5*src[wid*y+xp1];
	}
	return ImageMat.convolve(src,wid,hei, [-0.5,0,0.5], 3,1);
}
ImageMat.derivativeY = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		var ym1 = Math.max(y-1,0);
		var yp1 = Math.min(y+1,hei-1);
		return -0.5*src[wid*ym1+x] + 0.5*src[wid*yp1+x];
	}
	return ImageMat.convolve(src,wid,hei, [-0.5,0,0.5], 1,3);
}

ImageMat.derX2 = function(src,wid,hei){
	return ImageMat.convolve(src,wid,hei, [1,0,-1, 2,0,-2, 1,0,-1], 3,3);
}
ImageMat.derY2 = function(src,wid,hei){
	return ImageMat.convolve(src,wid,hei, [1,2,1, 0,0,0, -1,-2,-1], 3,3);
}

ImageMat.mean3x3 = function(src,wid,hei){
	return ImageMat.convolve(src,wid,hei, [1,1,1, 1,1,1, 1,1,1], 3,3);
}
ImageMat.mean5x5 = function(src,wid,hei){
	return ImageMat.convolve(src,wid,hei, [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1,], 5,5);
}
ImageMat.gradientVectorNonIntegerIndex = function(src,wid,hei, x,y, isGrad){
	//console.log(isGrad)
	var xMin = Math.floor(x);
	var xMax = Math.ceil(x);
	var yMin = Math.floor(y);
	var yMax = Math.ceil(y);
	var pX0 = x - xMin;
	var pY0 = y - yMin;
	var pX1 = 1.0 - pX0;
	var pY1 = 1.0 - pY0;
	var gA, gB, gC, gD;
	if(isGrad){
		gA = src[yMin*wid + xMin];
		gB = src[yMin*wid + xMax];
		gC = src[yMax*wid + xMin];
		gD = src[yMax*wid + xMax];
	}else{
		gA = ImageMat.gradientVector(src,wid,hei, xMin,yMin);
		gB = ImageMat.gradientVector(src,wid,hei, xMax,yMin);
		gC = ImageMat.gradientVector(src,wid,hei, xMin,yMax);
		gD = ImageMat.gradientVector(src,wid,hei, xMax,yMax);
	}
	var gX1 = new V2D(gA.x*pX1 + gB.x*pX0, gA.y*pX1 + gB.y*pX0);
	var gX2 = new V2D(gC.x*pX1 + gD.x*pX0, gC.y*pX1 + gD.y*pX0);
	var grad = new V2D(gX1.x*pY1 + gX2.x*pY0, gX1.y*pY1 + gX2.y*pY0);
	return grad;
}
ImageMat.prototype.gradientVector = function(){
	var width = this.width();
	var height = this.height();
	var gradientR = ImageMat.gradientVector(this.red(),width,height);
	var gradientG = ImageMat.gradientVector(this.grn(),width,height);
	var gradientB = ImageMat.gradientVector(this.blu(),width,height);
	gradientR = gradientR["value"];
	gradientG = gradientG["value"];
	gradientB = gradientB["value"];
	return {"r":gradientR,"g":gradientG,"b":gradientB,"width":width,"height":height};
}
ImageMat.gradientVector = function(src,wid,hei, x,y){ // not consistent with other value/width/height
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return new V2D(gradX,gradY);
	}
	var vectors = [];
	gradX = gradX.value;
	gradY = gradY.value;
	// for(var i=0; i<gradX.length; ++i){
	for(var i=gradX.length-1; i>=0; --i){
		vectors[i] = new V2D(gradX[i],gradY[i]);
	}
	return {"value":vectors, "width":wid, "height":hei};
}
ImageMat.gradientMagnitude = function(src,wid,hei, x,y){
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return gradX+gradY;
	}
	gradX = gradX.value;
	gradY = gradY.value;
	for(var i=gradX.length; i-- > 0;){
		gradX[i] = Math.sqrt(gradX[i]*gradX[i] + gradY[i]*gradY[i]);
	}
	return {"value":gradX, "width":wid, "height":hei};
}
ImageMat.gradientAngle = function(src,wid,hei, x,y){
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return gradX+gradY;
	}
	gradX = gradX.value;
	gradY = gradY.value;
	for(var i=gradX.length; i-- > 0;){
		gradX[i] = Math.atan2(gradY[i],gradX[i]);
	}
	return {"value":gradX, "width":wid, "height":hei};
}
ImageMat.secondDerivativeX = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		var xm1 = Math.max(x-1,0);
		var xp1 = Math.min(x+1,wid-1);
		return src[wid*y+xm1] - 2.0*src[wid*y+x] + src[wid*y+xp1];
	}
	return ImageMat.convolve(src,wid,hei, [1.0,-2,1.0], 3,1);
}
ImageMat.secondDerivativeY = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		var ym1 = Math.max(y-1,0);
		var yp1 = Math.min(y+1,hei-1);
		return src[wid*(ym1)] - 2.0*src[wid*y+x] + src[wid*yp1+x];
	}
	return ImageMat.convolve(src,wid,hei, [1.0,-2,1.0], 1,3);
}
ImageMat.secondDerivativeXY = function(src,wid,hei, x,y){ // ?
	//return ImageMat.laplacian(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return 0.25*src[wid*(y-1)+(x-1)] - 0.25*src[wid*(y-1)+(x+1)] - 0.25*src[wid*(y+1)+(x-1)] + 0.25*src[wid*(y+1)+(x+1)];
	}
	return ImageMat.convolve(src,wid,hei, [0.25,0,-0.25, 0,0,0, -0.25,0,0.25], 3,3);
}
ImageMat.laplacian = function(src,wid,hei, x,y){ // 2nd derivative (spatial)
	if(x!==undefined && y!==undefined){
		return -1.0*src[wid*(y-1)+(x+0)] - 1.0*src[wid*(y+0)+(x-1)] + 4.0*src[wid*(y+0)+(x+0)] - 1.0*src[wid*(y+0)+(x+1)] - 1*src[wid*(y+1)+(x+0)];
	}
	return ImageMat.convolve(src,wid,hei, [0,-1,0, -1,4,-1, 0,-1,0], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-1,-1,-1, -1,8,-1, -1,-1,-1], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-0.5,-1,-0.5, -1,6,-1, -0.5,-1,-0.5], 3,3);
}
ImageMat.prototype.laplacian = function(){
	var width = this.width();
	var height = this.height();
	this.red( ImageMat.laplacian(this.red(), width, height).value );
	this.grn( ImageMat.laplacian(this.grn(), width, height).value );
	this.blu( ImageMat.laplacian(this.blu(), width, height).value );
}
ImageMat.sharpen = function(src,wid,hei){
	var val = ImageMat.convolve(src,wid,hei, [0,-0.25,0, -0.25,2.0,-0.25, 0,-0.25,0], 3,3);
	var arr = val.value;
	ImageMat.clipFloat01(arr);
	return val;
	//return ImageMat.convolve(src,wid,hei, [0,-1,0, -1,5,-1, 0,-1,0], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-1,-1,-1, -1,9,-1, -1,-1,-1], 3,3);
	// create gaussian,
	// sharp = gaussian - image
	// normalize to [+1,-1]
	// add sharp to image
	// [0,0,0, 0,2,0, 0,0,0] - 1/9*[1,1,1, 1,1,1, 1,1,1] (OR GAUSSIAN)
	// TODO
}
ImageMat.sobel = function(src,wid,hei, w,h){
	var valX = ImageMat.sobelX(src,wid,hei, w,h);
	var valY = ImageMat.sobelY(src,wid,hei, w,h);
	var result = [];
	var valueX = valX["value"];
	var valueY = valY["value"];
	for(var i=0; i<valueX.length; ++i){
		result.push(new V2D(valueX[i],valueY[i]));
	}
	return {"value":result, "width":wid, "height":hei};
}
ImageMat.sobelX = function(src,wid,hei, w,h){
	// var val = ImageMat.convolve(src,wid,hei, [1,0,-1, 2,0,-2, 1,0,-1], 3,3);
	// var val = ImageMat.convolve(src,wid,hei, [-1,0,1, -2,0,2, -1,0,1], 3,3);
	var val = ImageMat.convolve(src,wid,hei, [-0.25,0,0.25, -0.5,0,0.5, -0.25,0,0.25], 3,3);
	return val;
}
ImageMat.sobelY = function(src,wid,hei, w,h){
	// var val = ImageMat.convolve(src,wid,hei, [1,2,1, 0,0,0, -1,-2,-1], 3,3);
	// var val = ImageMat.convolve(src,wid,hei, [-1,-2,-1, 0,0,0, 1,2,1], 3,3);
	var val = ImageMat.convolve(src,wid,hei, [-0.25,-0.5,-0.25, 0,0,0, 0.25,0.5,0.25], 3,3);
	return val;
}
ImageMat.sobelYFast = function(src,wid,hei, w,h){ // TESTED?
	var val = ImageMat.convolve(src,wid,hei, [-1, 0, 1], 1,3);
	return val;
}
ImageMat.scharrX = function(src,wid,hei, w,h){
	//var val = ImageMat.convolve(src,wid,hei, [-3,0,3, -10,0,10, -3,0,3], 3,3);
	var filter = [-3/32,0,3/32, -10/32,0,10/32, -3/32,0,3/32];
	var val = ImageMat.convolve(src,wid,hei, filter, 3,3);
	return val;
}
ImageMat.scharrY = function(src,wid,hei, w,h){
	//var val = ImageMat.convolve(src,wid,hei, [-3,-10,-3, 0,0,0, 3,10,3], 3,3);
	var filter = [-3/32,-10/32,-3/32, 0,0,0, 3/32,10/32,3/32];
	var val = ImageMat.convolve(src,wid,hei, filter, 3,3);
	return val;
}
ImageMat.scharrGradient = function(src,wid,hei, x,y){
	var sX = ImageMat.scharrX(src,wid,hei, x,y);
	var sY = ImageMat.scharrY(src,wid,hei, x,y);
	sX = sX["value"];
	sY = sY["value"];
	if(x!==undefined && y!==undefined){
		var i = y*wid + x;
		return new V2D(sX[i],sY[i]);
	}
	var val = [];
	var len = sX.length;
	for(var i=0; i<len; ++i){
		val[i] = new V2D(sX[i],sY[i]);
	}
	return val;
}
ImageMat.meanFilter = function(src,wid,hei, w,h){
	if(w!==undefined && w!==undefined){
		var i, len = w*h;
		var num = 1.0/len;
		var filter = new Array(len);
		for(i=0;i<len;++i){ filter[i] = num; }
		ImageMat.convolve(src,wid,hei, filter, w,h);
	}
	var n = 1.0/9.0;
	return ImageMat.convolve(src,wid,hei, [n,n,n, n,n,n, n,n,n], 3,3);
}
ImageMat.prototype.meanFilter = function(reuseImage){
	var image = this;
	var red = image._r;
	var grn = image._g;
	var blu = image._b;
	var wid = image._width;
	var hei = image._height;
	var wm1 = wid-1;
	var hm1 = hei-1;
	var newWid = wid - 2;
	var newHei = hei - 2;
	if(newWid<=0 || newHei<=0){
		return null;
	}
	var result = null;
	if(reuseImage){
		result = reuseImage;
	}else{
		result = new ImageMat(newWid,newHei);
	}
	var r = result._r;
	var g = result._g;
	var b = result._b;
	var jWTot = 0;
	var jNew = 0;
	for(var j=1; j<hm1; ++j){
		for(var i=1; i<wm1; ++i){
			var x = 0;
			var y = 0;
			var z = 0;
			var jW = jWTot; // (j-1)*wid
			for(var jj=-1; jj<=1; ++jj){
				for(var ii=-1; ii<=1; ++ii){
					// var index = (j + jj)*wid + (i + ii);
					var index = jW + i + ii;
					x += red[index];
					y += grn[index];
					z += blu[index];
				}
				jW += wid;
			}
			// var ind = (j-1)*newWid + (i-1);
			var ind = jNew + (i-1);
			r[ind] = x/9.0;
			g[ind] = y/9.0;
			b[ind] = z/9.0;
		}
		jWTot += wid;
		jNew += newWid;
	}
	return result;
}
ImageMat.medianFilter = function(src,wid,hei, w,h){
	// .. nonlinear
	throw "todo";
	return ImageMat.convolve(src,wid,hei, [0], 1,1);
}

ImageMat.chromaticAberation = function(image, direction, percent, radial){ // nonlinear/polygonal ?
	// direction = new V2D(3,3);
	// percent = 0.5;
	// radial = 10.0;
	var pm1 = 1.0-percent;
	var red = image._r;
	var grn = image._g;
	var blu = image._b;
	var wid = image._width;
	var hei = image._height;
	var hyp = Math.sqrt(wid*wid + hei*hei);
	var cenX = wid*0.5 | 0;
	var cenY = hei*0.5 | 0;

	radial /= hyp; // percent of image size

	var r = [];
	var g = [];
	var b = [];
	var colP = new V3D();
	var colN = new V3D();
	for(var j=0; j<hei; ++j){
		for(var i=0; i<wid; ++i){
			var index = j*wid + i;
			var dx = i-cenX;
			var dy = j-cenY;
			var rad = Math.sqrt(dx*dx + dy*dy);
			rad = 1.0 + rad*radial;
			image.getPointInterpolateLinear(colN, i-direction.x*rad,j-direction.y*rad);
			image.getPointInterpolateLinear(colP, i+direction.x*rad,j+direction.y*rad);
			var r1 = red[index];
			var g1 = grn[index];
			var b1 = blu[index];
			r[index] = r1*pm1 + colN.x*percent;
			//g[index] = g1*pm1;
			g[index] = g1;
			b[index] = b1*pm1 + colP.z*percent
		}
	}
	next = new ImageMat(wid,hei,r,g,b);
	return next;
}

ImageMat.laplaceOfGaussian = function(src,wid,hei, sigma, w,h){
	sigma = sigma!==undefined?sigma:1.6;
	w = w!==undefined?(Math.ceil(1+sigma*3)*2+1):3;
	h = h!==undefined?h:w;
	var log = ImageMat.getLaplaceOfGaussianWindow(w,h,sigma);
	//console.log( ImageMat.floatToOctave(log,w,h) );
	return ImageMat.convolve(src,wid,hei, log, w,h);
	return log;
}
ImageMat.laplaceOfGaussianX = function(src,wid,hei, sigma, w,h){
	sigma = sigma!==undefined?sigma:1.6;
	w = w!==undefined?w:3;
	h = h!==undefined?h:3;
	var log = ImageMat.getLaplaceOfGaussianWindow(w,h,sigma);
	return ImageMat.convolve(src,wid,hei, log, w,h);
}
ImageMat.floatToString = function(src,wid,hei){
	var str = "";
	var i, j, wj;
	for(j=0;j<hei;++j){
		wj = wid*j;
		str += "[ ";
		for(i=0;i<wid;++i){
			str += (src[wj+i])+" ";
		}
		str += "]\n";
	}
	return str;
}
ImageMat.floatToOctave = function(src,wid,hei){
	var str = "";
	str += "tx = linspace(1,"+wid+","+wid+");\n";
	str += "ty = linspace(1,"+hei+","+hei+");\n";
	str += "[xx,yy] = meshgrid(tx,ty);\n";
	str += "tz = [";
	var i, j, wj;
	for(j=0;j<hei;++j){
		wj = wid*j;
		str += " ";
		for(i=0;i<wid;++i){
			str += (src[wj+i])+" ";
		}
		if(j<hei-1){
			str += ";\n";
		}
	}
	str += "]\n";
	str += "mesh(tx,ty,tz);";
	return str;
}
ImageMat.prototype.refineCornerPoints = function(points, distance){ // assuming only a few pixels off ?
	distance = distance!==undefined ? distance : 10;
	var width = this.width();
	var height = this.height();
	var winSize = 2*distance + 1;
	var pointOffset = Math.floor(winSize*0.5);
	var nextPoints = [];
	var i, len = points.length;
	var point, win, next, local;
	for(var i=0; i<len; ++i){
		point = points[i];
		win = this.extractRectFromFloatImage(point.x,point.y, 1.0, null, winSize, winSize, null); // TODO: not efficient if only getting gry
		win = win.gry();
		local = new V2D( pointOffset, pointOffset );
		next = R3D.harrisCornerRefine(win, winSize,winSize, local);
		if(next){
			next = new V2D(point.x + next.x - pointOffset, point.y + next.y - pointOffset);
			nextPoints.push(next);
		}else{
			nextPoints.push(next);
		}
	}
	return nextPoints;
}

ImageMat.corners = function(image, width, height){
	var cornerScores = R3D.harrisCornerDetection(image, width, height);//, konstant, sigma);
	var corners = Code.findExtrema2DFloat(cornerScores,width,height);
	corners = corners.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? -1 : 1;
	});
	// TODO add padding and trim edge corners

	return corners;
}

ImageMat.prototype.corners = function(){
	var width = this.width();
	var height = this.height();
	return ImageMat.corners(this.gry(), width, height);
	// // corners
	// var cornerThreshold = 0.55;
	// var cornerMat = [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25];
	// var cornerRed = ImageMat.convolve(red,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerRed); ImageMat.applyFxnFloat(cornerRed, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerRed);
	// var cornerGrn = ImageMat.convolve(grn,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGrn); ImageMat.applyFxnFloat(cornerGrn, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGrn);
	// var cornerBlu = ImageMat.convolve(blu,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerBlu); ImageMat.applyFxnFloat(cornerBlu, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerBlu);
	// var cornerGry = ImageMat.convolve(gry,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGry); ImageMat.applyFxnFloat(cornerGry, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGry);
	// imageCornerRGB.setFromFloats(cornerRed, cornerGrn, cornerBlu);
	// imageCornerGry.setFromFloats(cornerGry, cornerGry, cornerGry);
}
ImageMat.harrisDetector = function(src,wid,hei, SMM, threshold, sigma, kMult){
	console.log("USE R3D");
	return null;
	// A(x) = autocorrelation = [gaussian window]*[Ixx(x) Ixy(x) ; Ixy(x) Iyy(x)]
	// H(x) = harris measure = det(A) - alpha*trace^2(A)
	var temp, padding, gaussSource, Ix, Iy, IxIx, IxIy, IyIy, Sxx, Sxy, Syy;
	var determinant, trace, result;
	sigma = sigma!==undefined?sigma:1.6;//1.6;
	threshold = threshold!==undefined?threshold:0.1;
	kMult = kMult!==undefined?kMult:0.05; // [0.04,0.06]
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	// padded gaussian source
	padding = Math.floor(gaussSize/2.0);
	gaussSource = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	// image derivatives
	Ix = ImageMat.derivativeX(gaussSource, wid+2*padding,hei+2*padding).value;
	Iy = ImageMat.derivativeY(gaussSource, wid+2*padding,hei+2*padding).value;
	// IxIx = ImageMat.mulFloat(Ix,Ix);
	// IxIy = ImageMat.mulFloat(Ix,Iy);
	// IyIy = ImageMat.mulFloat(Iy,Iy);
	IxIx = ImageMat.derivativeX(Ix,width,height).value;
	IyIy = ImageMat.derivativeY(Iy,width,height).value;
	IxIy = ImageMat.derivativeY(Ix,width,height).value;
	// sum of products - whatever that means
	Sxx = IxIx;
	Sxy = IxIy;
	Syy = IyIy;
	Sxx = ImageMat.gaussian2DFrom1DFloat(Sxx, wid+2*padding,hei+2*padding, gauss1D);
	Sxy = ImageMat.gaussian2DFrom1DFloat(Sxy, wid+2*padding,hei+2*padding, gauss1D);
	Syy = ImageMat.gaussian2DFrom1DFloat(Syy, wid+2*padding,hei+2*padding, gauss1D);
	// unpad results for usage
	//gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	gaussSource = ImageMat.unpadFloat(gaussSource, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxx = ImageMat.unpadFloat(Sxx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxy = ImageMat.unpadFloat(Sxy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Syy = ImageMat.unpadFloat(Syy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIx = ImageMat.unpadFloat(IxIx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIy = ImageMat.unpadFloat(IxIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IyIy = ImageMat.unpadFloat(IyIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	// calculate H(x,y) - to get eigenvalues
	var arr, l1,l2, i, len = wid*hei;
response = ImageMat.newZeroFloat(wid,hei);
var A = new Array();
var alpha = 0.01;
var sum = 0;
var minL = 1E-15;
	for(i=0;i<len;++i){
SMM[i] = [ Sxx[i], Sxy[i], Sxy[i], Syy[i] ];
		// arr = Matrix.eigenValues2D(Sxx[i],Sxy[i],Sxy[i],Syy[i]);
		// l1 = arr[0]; l2 = arr[1];
		// //console.log(arr[0],arr[1], " - ", Sxx[i],Sxy[i],Sxy[i],Syy[i] );
		// response[i] = l1*l2 - kMult*Math.pow(l1+l2,2);
		// if(i%10000==0){
		// 	console.log(l1,l2);
		// }
A[i] = [gaussSource[i]*IxIx[i], gaussSource[i]*IxIy[i], gaussSource[i]*IxIy[i], gaussSource[i]*IyIy[i]];
//A[i] = [IxIx[i], IxIy[i], IxIy[i], IyIy[i]];
arr = Matrix.eigenValues2D(A[i][0],A[i][1],A[i][2],A[i][3])
response[i] = (A[i][0]*A[i][3] - A[i][1]*A[i][2]) - alpha*(Math.pow((A[i][0]+A[i][3]),2));//*(IxIx[i]*IyIy[i] - IxIy[i]*IxIy[i]) - kMult*Math.pow(IxIx[i],2);
//response[i] = arr[0]*arr[1] - alpha*Math.pow(arr[0]+arr[1],2);
	if( Math.round(Math.random()*10000)%5000==0 ){
		//console.log(response[i]);
		//console.log( (A[0],A[1],A[2],A[3]) );
		//console.log( Matrix.eigenValues2D(A[i][0],A[i][1],A[i][2],A[i][3]) );
		//console.log(arr);
	}
	if(Math.abs(arr[0])>minL && Math.abs(arr[1])>minL){
		++sum;
	}
//SMM[i] = A[i];
	//response[i] = arr[0]*arr[1];

//		response[i] = (Sxx[i]*Syy[i] - Sxy[i]*Sxy[i]) - kMult*Math.pow(Sxx[i],2);
	}
//console.log(sum);
response = ImageMat.absFloat(response);
//console.log(Math.max.apply(this,response));
response = ImageMat.getNormalFloat01(response);
//response = ImageMat.mulConst(response,5.0);
//response = ImageMat.gtFloat(response,0.143);
//response = ImageMat.gtFloat(response,threshold);
//response = ImageMat.normalFloat01(response);
//return response;
return {response:response,Lx:Ix,Ly:Iy};
	// calculate response at each pixel
	trace = ImageMat.addFloat(Sxx,Syy); // l1 + l2
	determinant = ImageMat.subFloat(ImageMat.mulFloat(Sxx,Syy), ImageMat.mulFloat(Sxy,Sxy)); // l1*l2
// console.log( Math.max.apply(this,determinant) );
// console.log( Math.min.apply(this,determinant) );
// return determinant;
	traceSquareK = ImageMat.scaleFloat(kMult, ImageMat.mulFloat(trace,trace));
	response = ImageMat.subFloat(determinant,traceSquareK);
	// threshold output
console.log( Math.max.apply(this,response) );
console.log( Math.min.apply(this,response) );
	return response;
}


ImageMat.harrisDetectorSMM = function(src,wid,hei, sigma){
	var temp, padding, gaussSource, Ix, Iy, IxIx, IxIy, IyIy, Sxx, Sxy, Syy;
	var determinant, trace, result;
	sigma = sigma!==undefined?sigma:1.6;//1.6;
	kMult = 0.05; // [0.04,0.06]
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	// padded gaussian source
	padding = Math.floor(gaussSize/2.0);
	gaussSource = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	var w2pad = wid+2*padding, h2pad = hei+2*padding;
	gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	// image derivatives
	Ix = ImageMat.derivativeX(gaussSource, wid+2*padding,hei+2*padding);
	Iy = ImageMat.derivativeY(gaussSource, wid+2*padding,hei+2*padding);
	// IxIx = ImageMat.mulFloat(Ix,Ix);
	// IxIy = ImageMat.mulFloat(Ix,Iy);
	// IyIy = ImageMat.mulFloat(Iy,Iy);
	IxIx = ImageMat.derivativeX(Ix,width,height).value;
	IyIy = ImageMat.derivativeY(Iy,width,height).value;
	IxIy = ImageMat.derivativeY(Ix,width,height).value;
	// sum of products - whatever that means
	Sxx = IxIx;
	Sxy = IxIy;
	Syy = IyIy;
	Sxx = ImageMat.gaussian2DFrom1DFloat(Sxx, wid+2*padding,hei+2*padding, gauss1D);
	Sxy = ImageMat.gaussian2DFrom1DFloat(Sxy, wid+2*padding,hei+2*padding, gauss1D);
	Syy = ImageMat.gaussian2DFrom1DFloat(Syy, wid+2*padding,hei+2*padding, gauss1D);
	// unpad results for usage
	//gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	gaussSource = ImageMat.unpadFloat(gaussSource, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxx = ImageMat.unpadFloat(Sxx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxy = ImageMat.unpadFloat(Sxy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Syy = ImageMat.unpadFloat(Syy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIx = ImageMat.unpadFloat(IxIx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIy = ImageMat.unpadFloat(IxIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IyIy = ImageMat.unpadFloat(IyIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	var len = wid*hei;
	var SMM = new Array();
	for(i=0;i<len;++i){
		SMM[i] = [ Sxx[i], Sxy[i], Sxy[i], Syy[i] ];
	}
	var cen = w2pad*Math.floor(h2pad*0.5) + w2pad;
	var ret = {gradientX:Ix[cen] ,gradientY:Iy[cen], SMM:SMM}
	return ret;
}



ImageMat._center1 = new V2D();
ImageMat._center2 = new V2D();
ImageMat._O = new V2D();
ImageMat._TL = new V2D();
ImageMat._TR = new V2D();
ImageMat._BR = new V2D();
ImageMat._BL = new V2D();

ImageMat.extractRectFromFloatImageBasic = function(x,y, outWidth,outHeight, source,sourceWidth,sourceHeight){
	return ImageMat.extractRectFromFloatImage(x,y,1.0,null, outWidth,outHeight, source,sourceWidth,sourceHeight,null);
}
ImageMat.prototype.toImage = function(stage){
	return stage.getFloatRGBAsImage(this.red(),this.grn(),this.blu(), this.width(),this.height());
}
// (point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(-this._angle.t, 1.0, 0.25));
ImageMat.prototype.extractRectFromFloatImage = function(x,y,scale,sigma,w,h,matrix){
	var red = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._r,this._width,this._height, matrix);
	var grn = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._g,this._width,this._height, matrix);
	var blu = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._b,this._width,this._height, matrix);
	return new ImageMat(w,h, red,grn,blu);
}

ImageMat.prototype.calculateGradient = function(x,y, blur){
	x = (x!==undefined && x!==null) ? x : Math.floor((this._width-1)*.5);
	y = (y!==undefined && x!==null) ? y : Math.floor((this._height-1)*.5);
	var w = this.width();
	var h = this.height();
	var size = 3;
	var index = Math.floor(size/2);

	var rB, gB, bB;
	if(blur){
		var gaussSize = Math.round(Math.sqrt((w+h)*0.5));
		var sigma = 1.6;
		var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		var rB = ImageMat.gaussian2DFrom1DFloat(this._r, w,h, gauss1D);
		var gB = ImageMat.gaussian2DFrom1DFloat(this._g, w,h, gauss1D);
		var bB = ImageMat.gaussian2DFrom1DFloat(this._b, w,h, gauss1D);
	}else{
		rB = this._r;
		gB = this._g;
		bB = this._b;
	}
	var r = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, rB,w,h);
	var g = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, gB,w,h);
	var b = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, bB,w,h);
	var y = ImageMat.grayFromRGBFloat(r,g,b);
	var Ix = ImageMat.derivativeX(y, size,size);
	var Iy = ImageMat.derivativeY(y, size,size);
	Ix = Ix.value;
	Iy = Iy.value;
	var dir = new V2D(Ix[index],Iy[index]);
	//dir.norm();
	return dir;
}
ImageMat.prototype.getScaledImage = function(scale, sigmaIn, doCeil){
	var sigma = null;
	var newWidth;
	var newHeight;
	if(doCeil){
		newWidth = Math.ceil(scale*this.width());
		newHeight = Math.ceil(scale*this.height());
	}else{
		newWidth = Math.round(scale*this.width());
		newHeight = Math.round(scale*this.height());
	}
	if(scale<1.0){
		if(sigmaIn!==undefined){
			sigma = sigmaIn;
		}else{
			sigma = 0.5/Math.sqrt(scale);
		}
		var red = ImageMat.getScaledImage(this.red(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
		var grn = ImageMat.getScaledImage(this.grn(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
		var blu = ImageMat.getScaledImage(this.blu(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
			red = red["value"];
			grn = grn["value"];
			blu = blu["value"];
		var image = new ImageMat(newWidth,newHeight, red,grn,blu);
		return image;
	}else if(scale==1.0){
		return this.copy();
	} // else scale > 1
	var sigma = null;
	var red = ImageMat.getScaledImage(this.red(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
	var grn = ImageMat.getScaledImage(this.grn(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
	var blu = ImageMat.getScaledImage(this.blu(), this.width(), this.height(), scale, sigma, newWidth, newHeight);
		red = red["value"];
		grn = grn["value"];
		blu = blu["value"];
	var image = new ImageMat(newWidth,newHeight, red,grn,blu);
	return image;
}
ImageMat.prototype.getProgressiveScaledImage = function(scaleMult, maxScales){
	return ImageMat.getProgressiveScaledImage(this, scaleMult, maxScales);
}
ImageMat.getProgressiveScaledImage = function(imageA, scaleMult, maxScales){
	// scaleMult = Code.valueOrDefault(scaleMult, 0.75);
	scaleMult = Code.valueOrDefault(scaleMult, 0.5);
	maxScales = Code.valueOrDefault(maxScales, 10);

// scaleMult = 0.75;
// maxScales = 20;

	var widthA = imageA.width();
	var heightA = imageA.height();
	var scalesA = [1.0];
	var imagesA = [imageA];
	// var maxScales = 10; // 2^10 = 1024 x 0.5 ...
	
	
	// var sigma = 0.5;
	// var sigma = 1.0;
	// var sigma = -Math.log(scaleMult); // 0.69
	// var sigma = Math.sqrt(-Math.log(scaleMult)); // 0.83
	//
	// var sigma = (0.5 * 1.0/scaleMult) * 0.68269; // pixel radius * window at 1 sigma -- current best guess

	var sigma = (0.5 * 1.0/scaleMult) * 0.68269;

	// var sigma = 2.0; // too blurry
	var sigma = 1.0; // more blended
	// var sigma = 0.68269;
	// var sigma = 0.50; // crisper

	// 0.25 | 0.50 | 0.75 | 1.0
	// 2.00 | 1.00 | 0.50 | 0.0

	// console.log("sigma: "+sigma);
	

	// var sigma = (1.0 * 1.0/scaleMult) * 1.0;


	// console.log("getProgressiveScaledImage: "+sigma);

	// 0.5 - 1.0 ------ 0.66-0.75 ?
	var minSize = 4;
	var scale = 1.0;
var dxxx = 0;
// console.log(maxScales);
	for(var i=0; i<maxScales; ++i){
		// console.log(i+" / "+maxScales);
		scale = scale * scaleMult;
		var nextWidth = Math.round(scale*widthA);
		var nextHeight = Math.round(scale*heightA);
		if(nextWidth<=minSize || nextHeight<=minSize){
			break;
		}
		var imgA = imagesA[i];
		var halfA = imgA.getScaledImage(scaleMult,sigma, true); // #2 - blurrier




/*
img = GLOBALSTAGE.getImageMatAsImage(imgA);
var d = new DOImage(img);
d.matrix().translate(10 + dxxx, 10 + 0);
GLOBALSTAGE.addChild(d);
dxxx += imgA.width();// widthA*scale;
*/


		// var halfA = imgA.getScaledImage(scaleMult, null, false); // #1 - crisper - aliasing
		var avgScale = (halfA.width()/widthA + halfA.height()/heightA)*0.5; // actual efective scale
		// var avgScale = halfA.width()/widthA;
		imagesA.push(halfA);
		scalesA.push(avgScale);
	}
	// console.log(imagesA)
	return {"scales":scalesA,"images":imagesA};
}
ImageMat.effectiveIndexFromImageScales = function(images,scale){
	throw "don't use"
	var scales = images["scales"];
	var binaryF = function(haystack,needle){
		if(needle==haystack){
			return 0;
		}
		return needle>haystack ? -1 : 1;
	};
	var effectiveIndex = Code.binarySearch(scales, binaryF, false, scale);
	if(Code.isArray(effectiveIndex)){
		effectiveIndex = effectiveIndex[0]; // return higher resolution possibility
	}
	return effectiveIndex;
}

ImageMat.prototype.getRotatedImage = function(angle){
	var red = this.red();
	var grn = this.grn();
	var blu = this.blu();
	var wid = this.width();
	var hei = this.height();
	red = ImageMat.getRotatedImage(red,wid,hei, angle);
	grn = ImageMat.getRotatedImage(grn,wid,hei, angle);
	blu = ImageMat.getRotatedImage(blu,wid,hei, angle);
	var newWidth = red["width"];
	var newHeight = red["height"];
	red = red["value"];
	grn = grn["value"];
	blu = blu["value"];
	var image = new ImageMat(newWidth,newHeight, red,grn,blu);
	return image;
}
ImageMat.getRotatedImage = function(channel,width,height, angle){
	var newChannel = [];
	var pixels = width*height;
	var wid = null;
	var hei = null;
	if(angle==0){
		wid = width;
		hei = height;
		for(var i=0; i<pixels; ++i){
			newChannel[i] = channel[i];
		}
	}else if(angle==90 || angle==-270){
		wid = height;
		hei = width;
		for(var j=0; j<hei; ++j){
			for(var i=0; i<wid; ++i){
				var ind = j*wid + i;
				var index = i*width + (hei-j-1);
				newChannel[ind] = channel[index];
			}
		}
	}else if(angle==180 || angle==-180){
		wid = width;
		hei = height;
		for(var j=0; j<hei; ++j){
			for(var i=0; i<wid; ++i){
				var ind = j*wid + i;
				var index = (hei-j-1)*width + (wid-i-1);
				newChannel[ind] = channel[index];
			}
		}
	}else if(angle==270 || angle==-90){
		wid = height;
		hei = width;
		for(var j=0; j<hei; ++j){
			for(var i=0; i<wid; ++i){
				var ind = j*wid + i;
				var index = (wid-i)*width + j;
				newChannel[ind] = channel[index];
			}
		}
	}else{ // radians
		throw "TODO";
	} //
	return {"width":wid, "height":hei, "value":newChannel};
}
ImageMat.getScaledImage = function(source,wid,hei, scale, sigma, forceWidth,forceHeight){
	var newWid = Math.round(scale*wid);
	var newHei = Math.round(scale*hei);
	if(forceWidth && forceHeight){
		newWid = forceWidth;
		newHei = forceHeight;
	}
	if(sigma){
		source = ImageMat.getBlurredImage(source, wid,hei, sigma);
	}
// console.log(wid+" x "+hei+" -> "+newWid+" x "+newHei);
	var newImg = ImageMat.extractRectSimple(source,wid,hei, 0,0,wid-1,hei-1, newWid,newHei);
	return {"width":newWid, "height":newHei, "value":newImg};
}
ImageMat.prototype.getScaledImageInteger = function(scale){
	var newWidth = Math.round(scale*this.width());
	var newHeight = Math.round(scale*this.height());
	var red = ImageMat.getScaledImageInteger(this.red(), this.width(), this.height(), scale, newWidth, newHeight);
	var grn = ImageMat.getScaledImageInteger(this.grn(), this.width(), this.height(), scale, newWidth, newHeight);
	var blu = ImageMat.getScaledImageInteger(this.blu(), this.width(), this.height(), scale, newWidth, newHeight);
		red = red["value"];
		grn = grn["value"];
		blu = blu["value"];
	var image = new ImageMat(newWidth,newHeight, red,grn,blu);
	return image;
}
ImageMat.getScaledImageInteger = function(src,wid,hei, scale, forceWidth,forceHeight){
	if(scale<1.0){
		var size = Math.round(1.0/scale);
		var sizeSquare = size*size;
		var newWid = forceWidth ? forceWidth : Math.round(width*scale);
		var newHei = forceHeight ? forceHeight : Math.round(height*scale);
		var newSrc = new Array(newWid*newHei);
		var index, ind;
		for(var j=0; j<newHei; ++j){
			for(var i=0; i<newWid; ++i){
				ind = j*newWid + i;
				value = 0;
				for(var k=0; k<size; ++k){ // blocks
					for(var l=0; l<size; ++l){
						index = (j*size+k)*wid + (i*size+l); // TODO: FORCE END TRUNCATION
						value += src[index];
					}
				}
				value /= sizeSquare;
				newSrc[ind] = value;
			}
		}
		return {"value":newSrc};
	} // else bigger
	return ImageMat.getScaledImage(src,wid,hei, scale, null, forceWidth,forceHeight);
}
ImageMat.getBlurredImage = function(source,wid,hei, sigma){ // does auto padding and unpadding to avoid shadow on image edges
	// var x = (wid-1)*0.5;
	// var y = (hei-1)*0.5;
	gaussSize = Math.round(4.0 + sigma*2.0)*2+1;
	// gaussSize = Math.round(5.0 + sigma*3.0)*2+1; // maybe too much? (5E-1/1E-12)
	//gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma,null,   false, false);
	// console.log(gauss1D);
	padding = Math.ceil(gaussSize/2.0);
	var totWid = wid+2*padding;
	var totHei = hei+2*padding;
	//source = ImageMat.extractRectFromFloatImage(x,y,1.0,null, totWid,totHei, source,wid,hei, null);
	source = ImageMat.padFloat(source,wid,hei, padding,padding,padding,padding);
	source = ImageMat.gaussian2DFrom1DFloat(source, totWid,totHei, gauss1D);
	source = ImageMat.unpadFloat(source, totWid,totHei, padding,padding,padding,padding);
	return source;
}
ImageMat.prototype.getBlurredImage = function(sigma){
	var red = ImageMat.getBlurredImage(this.red(),this.width(),this.height(), sigma);
	var grn = ImageMat.getBlurredImage(this.grn(),this.width(),this.height(), sigma);
	var blu = ImageMat.getBlurredImage(this.blu(),this.width(),this.height(), sigma);
	return new ImageMat(this.width(),this.height(), red,grn,blu);
}
ImageMat.extract_M2D_A = new Matrix2D();
ImageMat.extract_M2D_B = new Matrix2D();
ImageMat.extractRectFromFloatImage = function(x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix){ // scale=opposite behavior, w/h=destination width/height,
	var blurr = (sigma!==undefined) && (sigma!==null);
	var gaussSize, gauss1D, padding=0;
	var img;
	var fullX = x;
	var fullY = y;
	if(blurr){
		gaussSize = Math.round(5.0 + sigma*2.0)*2+1;
		gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		padding = Math.ceil(gaussSize/2.0);
	}
	var wm1 = w-1;
	var hm1 = h-1;
	var left = fullX - (wm1*0.5)*scale - padding*scale;
	var right = fullX + (wm1*0.5)*scale + padding*scale;
	var top = fullY - (hm1*0.5)*scale - padding*scale;
	var bot = fullY + (hm1*0.5)*scale + padding*scale;
	var O = ImageMat._O; O.set(0,0);
	var TL = ImageMat._TL; TL.set(left,top);
	var TR = ImageMat._TR; TR.set(right,top);
	var BR = ImageMat._BR; BR.set(right,bot);
	var BL = ImageMat._BL; BL.set(left,bot);
	if(matrix){ // to origin & to updated center
		var center1 = ImageMat._center1; center1.set(fullX,fullY);
		var center2 = ImageMat._center2; // center2.set(0,0);
		if(Code.isa(matrix,Matrix2D)){
			matrix.multV2DtoV2D(center2,center1);
			matrix = ImageMat.extract_M2D_A.copy(matrix); // change locally
			matrix.inverse();
			var m = ImageMat.extract_M2D_B;
				m.set(1,0,0,1, center2.x-center1.x,center2.y-center1.y);
			matrix.premult(m);
		}else{
			matrix.multV2DtoV2D(center2,center1);
			matrix = Matrix.inverse(matrix);
			var m = new Matrix(3,3);
			m.fromArray([1,0, center2.x-center1.x, 0,1, center2.y-center1.y, 0,0,1]);
			matrix = Matrix.mult(matrix,m);
		} // apply to all points
		matrix.multV2DtoV2D(TL,TL);
		matrix.multV2DtoV2D(TR,TR);
		matrix.multV2DtoV2D(BR,BR);
		matrix.multV2DtoV2D(BL,BL);
	}
	// EXTRACT AROUND SOURCE POINT
	var wid = w+2*padding;
	var hei = h+2*padding;
	var img = ImageMat.extractRect(imgSource, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, wid,hei, imgWid,imgHei);
	// BLUR IMAGE
	if(blurr){
		img = ImageMat.gaussian2DFrom1DFloat(img, wid,hei, gauss1D);
		img = ImageMat.unpadFloat(img, wid,hei, padding,padding,padding,padding);
	}
	return img;
}

ImageMat.prototype.gradientMagnitude = function(){
	var red = ImageMat.gradientMagnitude(this.red(),this.width(),this.height()).value;
	var grn = ImageMat.gradientMagnitude(this.grn(),this.width(),this.height()).value;
	var blu = ImageMat.gradientMagnitude(this.blu(),this.width(),this.height()).value;
	return new ImageMat(this.width(),this.height(), red,grn,blu);
}
ImageMat.prototype.normalize = function(){ // convert existing scale to 0-1
	var maxR = Code.maxArray(this.red());
	var maxG = Code.maxArray(this.grn());
	var maxB = Code.maxArray(this.blu());
	var max = Code.maxArray([maxR,maxG,maxB]);
	var scale = 1.0/max;
	ImageMat.scaleFloatSame(this.red(), scale);
	ImageMat.scaleFloatSame(this.grn(), scale);
	ImageMat.scaleFloatSame(this.blu(), scale);
}

ImageMat.prototype.distanceFromColor = function(color){
	var width = this.width();
	var height = this.height();
	var red = this.red();
	var grn = this.grn();
	var blu = this.blu();
	var count = width*height;
	var grayscale = Code.newArrayZeros();
	var pixel = new V3D();
	for(var i=0; i<count; ++i){
		pixel.x = red[i];
		pixel.y = grn[i];
		pixel.z = blu[i];
		var distance = V3D.distance(color,pixel);
		grayscale[i] = distance;
	}
	// console.log(color);
	// console.log(grayscale);
	// throw "..."
	return {"value":grayscale, "width":width, "height":height};
}

ImageMat.prototype.getSubRect = function(x,y,w,h){
	var wid = this.width();
	var hei = this.height();
	var red = this.red();
	var grn = this.grn();
	var blu = this.blu();
	var r = [];
	var g = [];
	var b = [];
	var eI = x+w;
	var eJ = y+h;
	var wm1 = wid-1;
	var hm1 = hei-1;
		// x = Math.max(x,0);
		// y = Math.max(y,0);
		// eI = Math.min(eI,wid-1);
		// eJ = Math.min(eJ,hei-1);
	var ii, jj;
	for(var j=y; j<eJ; ++j){
		for(var i=x; i<eI; ++i){
			ii = Math.max(i,0);
			ii = Math.min(ii,wm1);
			jj = Math.max(j,0);
			jj = Math.min(jj,hm1);
			var index = jj*wid + ii;
			r.push(red[index]);
			g.push(grn[index]);
			b.push(blu[index]);
		}
	}
	return new ImageMat(w,h, r,g,b);
}

ImageMat._watershedPointSort = function(a,b){
	if(a==b){
		return 0;
	}
	if(a.z<b.z){
		return -1;
	}
	if(a.z>b.z){
		return 1;
	}
	if(a.x<b.x){
		return -1;
	}
	if(a.x>b.x){
		return 1;
	}
	if(a.y<b.y){
		return -1;
	}
	if(a.y>b.y){
		return 1;
	}
}

ImageMat._watershed_internal = function(heightMap,width,height, inverseMask){
	// TODO: OPTION TO LET GROUPS THAT ARE ENTIRELY CONTAINED TO BE SUBSUMED BY CONTAINER?
	var i, j, index, h, v;
	var pixelCount = width*height;
	var groupMap = new Array(pixelCount);
	var groupHeights = [];
	var groupLists = [];
	var groupRects = [];
	var group = 0;
	// order all pixels by height
	var pointQueue = new PriorityQueue();
	pointQueue.sorting( ImageMat._watershedPointSort );
	// label all pixels as unknown group
	for(index=0; index<pixelCount; ++index){
		groupMap[index] = -1; // unknown group
		if(inverseMask && inverseMask[index]!=0.0){ // true || !=0
			continue; // only consider if 0
		}
		i = index % width;
		j = Math.floor(index/width);
		h = heightMap[index];
		v = new V3D(i,j,h);
		pointQueue.push(v);
	}
	// assign groups iteratively
	pointQueue = pointQueue.toArray();
	var queueLength = pointQueue.length;
	// for each pixel in height queue
	for(index=0; index<queueLength; ++index){
		v = pointQueue[index];
		i = v.x;
		j = v.y;
		h = v.z;
		var neighbors = ImageMat._watershed_neighbors(groupMap, width, height, i, j, inverseMask);
		var highestGroup = ImageMat._watershed_highest_group(neighbors, groupHeights);
		if(highestGroup==null){ // pixel is only bordered by unknown neighbors
			groupMap[j*width + i] = group; // assign it to new group
			groupLists[group] = [];
			groupHeights[group] = h;
			groupRects[group] = new Rect(i,j,1,1);
			highestGroup = group;
			++group;
		}else{ // pixel borders labeled neighbor(s)
			groupMap[j*width + i] = highestGroup; // => assign it to group with largest _peak_ height
			groupRects[highestGroup].union(new Rect(i,j,1,1));
		}
		//groupRects[highestGroup] = Rect.union(groupRects[highestGroup], new Rect(i,j,1,1));
		groupLists[highestGroup].push(v);
	}
	return {"pixels":groupMap, // 2d array of pixels with value = groupID
			"groups":groupLists, // array of group arrays of V3Ds
			"heights":groupHeights, // array of group maxHeights
			"rects":groupRects //  array of group rects
			};
}
ImageMat._watershed_highest_group = function(neighbors, groupList){
	var highestGroup = null;
	var highestHeight = null;
	for(var i=neighbors.length; i>0; --i){
		var group = neighbors[i];
		if(group>=0){
			var height = groupList[group];
			if(highestGroup==null || height>highestHeight){
				highestGroup = group;
				highestHeight = height;
			}
		}
	}
	return highestGroup;
}
ImageMat._watershed_neighbors = function(gridList, width, height, i, j, inverseMask){
	var wm1 = width-1;
	var hm1 = height-1;
	var list = [];
	var index;
	if(j>0 && i>0){ // up & left
		index = (j-1)*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j>0){ // up
		index = (j-1)*width + i;
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j>0 && i<wm1){ // up & right
		index = (j-1)*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(i>0){ // left
		index = j*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(i<wm1){ // left & right
		index = j*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1 && i>0){ // down & left
		index = (j+1)*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1){ // down
		index = j*width + i;
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1 && i<wm1){ // down & right
		index = (j+1)*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	return list;
}

//ImageMat.watershed = ImageMat.watershed_2;
ImageMat.watershed = ImageMat._watershed_internal;

ImageMat.heatImage = function(image, width, height, inverse, inColors){ // expecting normalized greyscale image
	// white, orange, red, green, light-blue, blue, purple, black
	var colors = [0xFFFFFFFF, 0xFFFF9900, 0xFFFF0000, 0xFF00FF00, 0xFF3399FF, 0xFF0000FF, 0xFF330066, 0xFF000000];
	if(inColors){
		colors = inColors;
	}
	if(inverse===true){
		colors = Code.reverseArray(colors);
	}
	var r = [], g = [], b = [];
	var i, len = image.length;
	for(i=0; i<len; ++i){
		var percent = image[i];
		var color = Code.interpolateColorGradientARGB(percent, colors);
		r[i] = Code.getFloatRedARGB(color);
		g[i] = Code.getFloatGrnARGB(color);
		b[i] = Code.getFloatBluARGB(color);
	}
	return new ImageMat(width, height, r,g,b);
}

/*
this.colorQuadrantCubic = function(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y){
	var r = this.quadric2D(x,y, Code.getRedRGBA(colA), Code.getRedRGBA(colB), Code.getRedRGBA(colC), Code.getRedRGBA(colD),
						Code.getRedRGBA(colE), Code.getRedRGBA(colF), Code.getRedRGBA(colG), Code.getRedRGBA(colH),
						Code.getRedRGBA(colI), Code.getRedRGBA(colJ), Code.getRedRGBA(colK), Code.getRedRGBA(colL),
						Code.getRedRGBA(colM), Code.getRedRGBA(colN), Code.getRedRGBA(colO), Code.getRedRGBA(colP) );
	var g = this.quadric2D(x,y, Code.getGrnRGBA(colA), Code.getGrnRGBA(colB), Code.getGrnRGBA(colC), Code.getGrnRGBA(colD),
						Code.getGrnRGBA(colE), Code.getGrnRGBA(colF), Code.getGrnRGBA(colG), Code.getGrnRGBA(colH),
						Code.getGrnRGBA(colI), Code.getGrnRGBA(colJ), Code.getGrnRGBA(colK), Code.getGrnRGBA(colL),
						Code.getGrnRGBA(colM), Code.getGrnRGBA(colN), Code.getGrnRGBA(colO), Code.getGrnRGBA(colP) );
	var b = this.quadric2D(x,y, Code.getBluRGBA(colA), Code.getBluRGBA(colB), Code.getBluRGBA(colC), Code.getBluRGBA(colD),
						Code.getBluRGBA(colE), Code.getBluRGBA(colF), Code.getBluRGBA(colG), Code.getBluRGBA(colH),
						Code.getBluRGBA(colI), Code.getBluRGBA(colJ), Code.getBluRGBA(colK), Code.getBluRGBA(colL),
						Code.getBluRGBA(colM), Code.getBluRGBA(colN), Code.getBluRGBA(colO), Code.getBluRGBA(colP) );
	var a = this.quadric2D(x,y, Code.getAlpRGBA(colA), Code.getAlpRGBA(colB), Code.getAlpRGBA(colC), Code.getAlpRGBA(colD),
						Code.getAlpRGBA(colE), Code.getAlpRGBA(colF), Code.getAlpRGBA(colG), Code.getAlpRGBA(colH),
						Code.getAlpRGBA(colI), Code.getAlpRGBA(colJ), Code.getAlpRGBA(colK), Code.getAlpRGBA(colL),
						Code.getAlpRGBA(colM), Code.getAlpRGBA(colN), Code.getAlpRGBA(colO), Code.getAlpRGBA(colP) );
	r = Code.color255(r); g = Code.color255(g); b = Code.color255(b); a = Code.color255(a);
	return Code.getColRGBA(r,g,b,a);
}
this.quadric2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
	var xx = x*x; var xxx = xx*x;
	var yy = y*y; var yyy = yy*y;
	var a = this.quadric1D(x,xx,xxx, A,B,C,D);
	var b = this.quadric1D(x,xx,xxx, E,F,G,H);
	var c = this.quadric1D(x,xx,xxx, I,J,K,L);
	var d = this.quadric1D(x,xx,xxx, M,N,O,P);
	return this.quadric1D(y,yy,yyy, a,b,c,d);
}
this.quadric1D = function(t,tt,ttt,A,B,C,D){
	var a = 3*B - 3*C + D - A;
	var b = 2*A - 5*B + 4*C - D;
	var c = B - A;
	var d = B;
	return ( a*ttt + b*tt + c*t + d );
}
this.quadric1DBAD = function(t,tt,ttt,A,B,C,D){ // less clear
	var mB = (C-A)/2;
	var mC = (D-B)/2;
	var a = mC + mB - 2*C + 2*B;
	var b = 3*C - mC - 2*mB - 3*B;
	var c = mB;
	var d = B;
	return ( a*ttt + b*tt + c*t + d );
}
*/



ImageMat.filterOperation = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, fxn, args){ // RGB -> HSV, increase S
	var v = new V3D();
	var i, length = width*height;
	for(i=0;i<length;++i){
		var r = imageSourceRed[i];
		var g = imageSourceGrn[i];
		var b = imageSourceBlu[i];
		v.set(r, g, b);
		v = fxn(v, args);
		imageSourceRed[i] = v.x;//Code.rangeForceMinMax(v.x, 0.0,1.0);
		imageSourceGrn[i] = v.y;//Code.rangeForceMinMax(v.y, 0.0,1.0);
		imageSourceBlu[i] = v.z;//Code.rangeForceMinMax(v.z, 0.0,1.0);
	}
}
ImageMat.filterContrast = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> darks darker, lights lighter
	ImageMat.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, ImageMat._filterContrastFxn, scale);
}
ImageMat._filterContrastFxn = function(v, args){
	var scale = args!==undefined ? args : 0.5;
	var avg = 0.5;
	v.x = scale * (v.x - avg) + avg;
	v.y = scale * (v.y - avg) + avg;
	v.z = scale * (v.z - avg) + avg;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}



ImageMat.filterGrayContrast = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> darks darker, lights lighter
	ImageMat.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, ImageMat._filterGrayContrastFxn, scale);
}
ImageMat._filterGrayContrastFxn = function(v, scale){
	var mid = 0.5;
	var gry = (v.x+v.y+v.z)/3.0;
	var diff = gry-mid;
	var sca = Math.pow(Math.abs(diff), scale);
	if(diff<0){
		sca *= -1;
	}
	// v.x = (v.x)/sca;
	// v.y = (v.y)/sca;
	// v.z = (v.z)/sca;
	// v.x = (v.x)*sca;
	// v.y = (v.y)*sca;
	// v.z = (v.z)*sca;
	v.x = (v.x) + sca;
	v.y = (v.y) + sca;
	v.z = (v.z) + sca;
	// var avg = 0.5;
	// v.x = (v.x - mid)*sca + avg;
	// v.y = (v.y - avg)*sca + avg;
	// v.z = (v.z - avg)*sca + avg;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);

	// var scale = args!==undefined ? args : 0.5;
	// var avg = 0.5;
	// v.x = scale * (v.x - avg) + avg;
	// v.y = scale * (v.y - avg) + avg;
	// v.z = scale * (v.z - avg) + avg;
	// v.x = Math.min(Math.max(v.x, 0.0),1.0);
	// v.y = Math.min(Math.max(v.y, 0.0),1.0);
	// v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}





ImageMat.filterSaturation = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // RGB -> HSV, increase S
	ImageMat.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, ImageMat._filterSaturationFxn, percent);
}
ImageMat._filterSaturationFxn = function(v, args){
	var percent = args;
	v = Code.HSVFromRGB(v,v);
	v.y = v.y * percent;
	v = Code.RGBFromHSV(v,v);
	return v;
}

ImageMat.filterSaturationRGB = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // made up scaling about 0.5 (average)
	ImageMat.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, ImageMat._filterSaturationRGBFxn, percent);
}
ImageMat._filterSaturationRGBFxn = function(v, args){
	var percent = args;
	v = v.copy();
	var avg = (v.x+v.y+v.z)/3.0;
	v.x = percent * (v.x - avg) + avg;
	v.y = percent * (v.y - avg) + avg;
	v.z = percent * (v.z - avg) + avg;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}



ImageMat.filterGamma = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, gamma){ // brightness with nonlinear scaling
	if(gamma>0.0){
		gamma = 1.0/gamma;
	}else{
		gamma = 0.0;
	}
	ImageMat.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, ImageMat._filterGammaFxn, gamma);
}
// Filter._filterGammaFxn = function(v, args){
// 	var inc = args;
// 	v.x = Math.pow(v.x,args);
// 	v.y = Math.pow(v.y,args);
// 	v.z = Math.pow(v.z,args);
// 	v.x = Math.min(Math.max(v.x, 0.0),1.0);
// 	v.y = Math.min(Math.max(v.y, 0.0),1.0);
// 	v.z = Math.min(Math.max(v.z, 0.0),1.0);
// 	return v;
// }

ImageMat._filterGammaFxn = function(v, args){
	var inc = args;
	v.x = Math.pow(v.x,args);
	v.y = Math.pow(v.y,args);
	v.z = Math.pow(v.z,args);
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}







ImageMat.adaptiveThreshold = function(src, wid, hei, size, threshold, rangeMin){ // TODO:  faster via: chow kaneko adaptive threshold
	size = size!==undefined ? size : 11;
	threshold = threshold!==undefined ? threshold : 0.5;
	rangeMin = rangeMin!==undefined ? rangeMin : 0.10; // minimum difference to force a change
	var half = Math.floor(size/2.0);
	var i, j, k, ii, jj;
	var wm1 = wid-1;
	var hm1 = hei-1;
	var len = wid*hei;
	var minI, minJ, maxI, maxJ;
	var index, mean, count, ind, color, value, val, range;
	var minValue, maxValue;
	var result = Code.newArrayZeros(len);
//	var prevColor = 0;
	var uknownColor = 0.5;
	var knownColorIndex = null;
	for(i=0; i<wid; ++i){
		for(j=0; j<hei; ++j){
			index = j*wid + i;
			value = src[index];
			minI = Math.max(0,i-half);
			maxI = Math.min(wm1,minI+size);
			minJ = Math.max(0,j-half);
			maxJ = Math.min(hm1,minJ+size);
			mean = 0;
			count = 0;
			minValue = null;
			maxValue = null;
			for(ii=minI; ii<=maxI; ++ii){
				for(jj=minJ; jj<=maxJ; ++jj){
					ind = jj*wid + ii;
					val = src[ind];
					mean += val;
					count += 1;
					if(minValue==null || val<minValue){
						minValue = val;
					}
					if(maxValue==null || val>maxValue){
						maxValue = val;
					}
				}
			}
			range = maxValue - minValue;
			if(range>rangeMin){
				color = (value - minValue)/range;
				color = (color>threshold) ? 1 : 0;
				if(!knownColorIndex){ // TODO: pick a known color nearest to center
					knownColorIndex = new V2D(i,j);
				}
			}else{
				color = uknownColor;
			}
			result[index] = color;
//			prevColor = color;
		}
	}
	// go thru unknown colors & replace with neighbor
	// start at known location, expand square to full size of image
	var cx = knownColorIndex.x;
	var cy = knownColorIndex.y;
	var s = 1;
	var iteration = Math.max(wid,hei);
	var nearestNeighborValue = function(s,i,j, x){
		var v;
		// left side
		if(i>0){
			// top side
			if(j>0){
				v = s[(j-1)*wid+(i-1)];
				if(v!=x){ return v; }
			}
			// mid side
			v = s[(j-0)*wid+(i-1)];
			if(v!=x){ return v; }
			// bot side
			if(j<hm1){
				v = s[(j+1)*wid+(i-1)];
				if(v!=x){ return v; }
			}
		}
		// top
		if(j>0){
			v = s[(j-1)*wid+(i-0)];
			if(v!=x){ return v; }
		} // bot
		if(j<hm1){
			v = s[(j+1)*wid+(i-0)];
			if(v!=x){ return v; }
		}
		// right side
		if(i<wm1){
			// top side
			if(j>0){
				v = s[(j-1)*wid+(i+1)];
				if(v!=x){ return v; }
			}
			// mid side
			v = s[(j-0)*wid+(i+1)];
			if(v!=x){ return v; }
			// bot side
			if(j<hm1){
				v = s[(j+1)*wid+(i+1)];
				if(v!=x){ return v; }
			}
		}
		throw "none ?";
	}
	while(iteration>0){
	//while(false){
		minI = cx-s;
		maxI = cx+s;
		minJ = cy-s;
		maxJ = cy+s;
		// left & right side:
		var is = [minI,maxI];
		for(k=0; k<is.length; ++k){
			i = is[k];
			for(j=minJ; j<=maxJ; ++j){
				if(0<=i && i<=wm1 && 0<=j && j<=hm1){
					index = j*wid + i;
					value = result[index];
					if(value==uknownColor){
						result[index] = nearestNeighborValue(result, i,j, uknownColor);
					}
				}
			}
		}
		// top + bottom side:
		var js = [minJ,maxJ];
		for(k=0; k<js.length; ++k){
			j = js[k];
			for(i=minI; i<=maxI; ++i){
				if(0<=i && i<=wm1 && 0<=j && j<=hm1){
					index = j*wid + i;
					value = result[index];
					if(value==uknownColor){
						result[index] = nearestNeighborValue(result, i,j, uknownColor);
					}
				}
			}
		}
		++s;
		if( (cx-s<0) && (cx+s>wm1) && (cy-s<0) && (cy+s>hm1) ){
			break;
		}
		--iteration;
	}
	/*
	left side,
	right side,
	bottom side,
	top side,

	if color is unknown:
		look at neighbors, pick first color
	else
		-

	increment size
	if all:
		center-size <0
		center+size >wm1
		center-size <0
		center+size >wm1
		=> done
	*/
	return {"value":result, "width":wid, "height":hei};
}




ImageMat.colorFilter = function(srcR,srcG,srcB, wid, hei, colorTarget, colorDistance, inside){
	inside = inside!==undefined ? inside : true;
	// RGB -> HSV
	// distance in H
	//   hue = [color base]
	//   sat = [white,color]
	// value = [black,white]
	//
	// RGB sphere Euclidean Color
	// radius ?
	var mask;
	return {"value":mask, "width":wid, "height":hei};
}



function ImageMatScaled(image, scaler){
	scaler = scaler!==undefined ? scaler : 0.5;
	// scaler = scaler!==undefined ? scaler : 0.75;
	this._exponent = scaler;
	var images = ImageMat.getProgressiveScaledImage(image, this._exponent);
	this._images = images["images"];
	this._scales = images["scales"];
}
ImageMatScaled.prototype.kill = function(){
	if(this._images){
		for(var i=0; i<this._images.length; ++i){
			this._images[i].kill();
		}
	}
	this._images = null;
	this._scales = null;
	this._exponent = null;
}
ImageMatScaled.prototype.width = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.width();
	}
	return null;
}
ImageMatScaled.prototype.height = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.height();
	}
	return null;
}
ImageMatScaled.prototype.size = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.size();
	}
	return null;
}
ImageMatScaled.prototype.red = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.red();
	}
	return null;
}
ImageMatScaled.prototype.grn = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.grn();
	}
	return null;
}
ImageMatScaled.prototype.blu = function(){
	var image = this._images;
	if(image){
		image = image[0];
		return image.blu();
	}
	return null;
}
ImageMatScaled.prototype.infoForScale = function(scale){
	var images = this._images;
	var scales = this._scales;
	// var scaleIndex =  Math.min(Math.max( Math.floor(-Math.log2(scale)) ,0),images.length-1); // inline
	var exp = this._exponent;
	var scaleIndex =  Math.min(Math.max( Math.floor( -Math.log(scale)/Math.log(exp) ) ,0),images.length-1); // inline
	// console.log("scale: "+scale+" -> "+scaleIndex)
	var actualScale = scales[scaleIndex];
	var effectiveImage = images[scaleIndex];
	var effectiveScale = scale/actualScale;
	return {"image":effectiveImage, "actualScale":actualScale, "effectiveScale":effectiveScale};
}

ImageMatScaled.prototype.infoForScaleCombined = function(scale){
	var images = this._images;
	var scales = this._scales;
	var lm1 = images.length-1;
	var scale = -Math.log2(scale);
	var floor = Math.floor(scale,0);
	var ceil = Math.ceil(scale,0);
	var scaleIndexA = Math.min(Math.max(floor,0),lm1);
	var scaleIndexB = Math.min(Math.max(ceil,0),lm1);
	var percentA = ceil-scale;
	var percentB = 1.0 - percentA;
	var actualScaleA = scales[scaleIndexA];
	var actualScaleB = scales[scaleIndexB];
	var effectiveScaleA = scale/actualScaleA;
	var effectiveScaleB = scale/actualScaleB;
	return {"imageA":images[scaleIndexA], "actualScaleA":actualScaleA, "effectiveScaleA":effectiveScaleA, "percentA":percentA,
			"imageB":images[scaleIndexB], "actualScaleB":actualScaleB, "effectiveScaleB":effectiveScaleB, "percentB":percentB};
}

ImageMatScaled.prototype.images = function(){
	return this._images;
}
ImageMatScaled.prototype.scales = function(){
	return this._scales;
}
ImageMatScaled.prototype.image = function(){
	var images = this._images;
	if(images && images.length>0){
		return images[0];
	}
	return null;
}
ImageMatScaled.prototype.effectiveIndexFromScale = function(scale){
	var effectiveIndex = Math.floor(-Math.log2(scale)); // opt for higher resolution image
		effectiveIndex = Math.min(Math.max(effectiveIndex,0),this._images.length-1); // keep inside available range
	return effectiveIndex;
}
ImageMatScaled.prototype.getScaledImage = function(scale, doCeil){
	var wid = this.width();
	var hei = this.height();
	var wm1 = wid-1;
	var hm1 = hei-1;
		// var center = new V2D(wm1*0.5,hm1*0.5);
		// var center = new V2D(wid*0.5,hei*0.5);
	var resultWidth = Math.round(scale*wid);
	var resultHeight = Math.round(scale*hei);
	if(doCeil){
		resultWidth = Math.ceil(scale*wid);
		resultHeight = Math.ceil(scale*hei);
	}
	var resultScale = (resultWidth/wid + resultHeight/hei)*0.5;
// console.log("RESULT: "+resultScale+" @ "+resultWidth+"x"+resultHeight);
	// inverse scale from new to old
	resultScale = 1.0/resultScale;
	var affine = new Matrix2D();
	affine.identity();
	affine.scale(resultScale);
	ImageMatScaled.affineToLocationTransform(affine, affine, (resultWidth-1)*0.5,(resultHeight-1)*0.5,wm1*0.5,hm1*0.5);
		// ImageMatScaled.affineToLocationTransform(affine, affine, (resultWidth)*0.5,(resultHeight)*0.5,wid*0.5,hei*0.5);
	var image = new ImageMat(resultWidth,resultHeight);
	this.extractRectFast(image, resultScale, affine);
	// var image = this.extractRect(center, resultScale, resultWidth,resultHeight);
	return image;
}


ImageMatScaled.prototype.getImageSize = function(idealSize, maxScale, minScale){ // V2D
	var image = this;
	var originalWidth = image.width();
	var originalHeight = image.height();
	// resize to usable dimension
	var idealPixelCount = idealSize.x*idealSize.y;
	var actualPixelCount = image.width()*image.height();
	var idealScale = Math.sqrt(idealPixelCount/actualPixelCount);
	if(maxScale!==undefined){
		idealScale = Math.min(idealScale,maxScale);
	}
	if(minScale!==undefined){
		idealScale = Math.max(idealScale,minScale);
	}
	var outputImage = image.getScaledImage(idealScale);
	var imageScale = (image.width()/outputImage.width() + image.height()/outputImage.height())*0.5;
	return {"image":outputImage, "scale":imageScale};
}




ImageMatScaled.prototype.extractRect = function(resultCenter, resultScale, resultWidth,resultHeight, matrix){ // extract appropriate image at scale
throw "NO";
// remove scale
// var info = R3D.infoFromAffine2D(matrix);
if(matrix){
var info = R3D.infoFromAffineMatrix2D(matrix);
var applyScale = info["scale"];
matrix.scale(1.0/applyScale);
resultScale = applyScale*resultScale; // additional scale for including entirety of cell-compare size
}
	var imageScales = this;
	var info = imageScales.infoForScale(resultScale);
	var imageMatrix = info["image"];
	var effScale = info["effectiveScale"];
	var actScale = info["actualScale"];
	var needle = imageMatrix.extractRectFromFloatImage(resultCenter.x*actScale,resultCenter.y*actScale,1.0/effScale,null, resultWidth,resultHeight, matrix);
// add back scale
if(matrix){
matrix.scale(applyScale);
}
	return needle;
}
ImageMatScaled.extractRect = function(imageScales, resultCenter, resultScale, resultWidth,resultHeight, matrix){
throw "NO";
	var info = imageScales.infoForScale(resultScale);
	var imageMatrix = info["image"];
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var effScale = info["effectiveScale"];
	var actScale = info["actualScale"];
	var needle = ImageMat.extractRectFromFloatImage(resultCenter.x*actScale,resultCenter.y*actScale,1.0/effScale,null,resultWidth,resultWidth, matrix);
	return needle;
}



ImageMatScaled.prototype.extractRectFast = function(reuseImage, scale, matrix, isLinear){ // linear or cubic
	// scale < 1.0 = zoom in (smaller section of image) [] => [   ]
	// scale > 1.0 = zoom out (larger section of image) [   ] => []
	// scale should already incorporate output-size differences
	// matrix has same scale on it as scale passed thru
	// matrix is INVERSE transform: image source TO image destination
// scale = 1.0;
	var imageScales = this;
	var info = imageScales.infoForScale(1.0/scale);
	// var info = imageScales.infoForScale(1.0);
	var imageMatrix = info["image"];
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var effScale = info["effectiveScale"];
	var actScale = info["actualScale"];
// console.log("scale: "+scale+" => "+imageMatrix.size());
// console.log("effScale: "+effScale);
// console.log("actScale: "+actScale);

// console.log(" :ERF: "+scale+" => "+imageMatrix.size()+" -eff: "+effScale+" @act: "+actScale);
	var red = imageMatrix.red();
	var grn = imageMatrix.grn();
	var blu = imageMatrix.blu();
	var wm1 = imageWidth-1;
	var hm1 = imageHeight-1;
	// use matrix
	var wid = reuseImage.width();
	var hei = reuseImage.height();
	var r = reuseImage.red();
	var g = reuseImage.grn();
	var b = reuseImage.blu();
	var p = new V2D();
	// var wJ = 0;
	// console.log(wid,hei);
	var listTo = [r,g,b];
	var listFr = [red,grn,blu];


// local linear constants:
var hm1 = imageHeight-1, wm1 = imageWidth-1;
var i;

// local cubic constants:


	for(var y=0; y<hei; ++y){
		for(var x=0; x<wid; ++x){
			p.set(x,y);
			matrix.multV2DtoV2D(p,p);
			p.scale(actScale); // for selected image size
			// p.scale(1.0/actScale);
			// p.scale(effScale);
			// p.scale(1.0/effScale);
			var index = y*wid + x;

			// closest: 110
			// p.x = Math.max(0, Math.min( wm1, Math.round(p.x,1) ));
			// p.y = Math.max(0, Math.min( hm1, Math.round(p.y,1) ));
			// var indexImage = p.y*imageWidth + p.x;
			// r[index] = red[indexImage];
			// g[index] = grn[indexImage];
			// b[index] = blu[indexImage];

			// linear: 190
			// Code.parallelArrayInterpolateLinear(listTo,listFr, index, p.x,p.y, imageWidth,imageHeight);
			// 


			// linear-local: 160
			
			var x2 = p.x;
			var y2 = p.y;
			var minX = Math.min( Math.max(Math.floor(x2), 0), wm1);
			var minY = Math.min( Math.max(Math.floor(y2), 0), hm1);
			var maxX = Math.max( Math.min(Math.ceil(x2), wm1), 0);
			var maxY = Math.max( Math.min(Math.ceil(y2), hm1), 0);
			var iyW = minY*imageWidth;
			var ayW = maxY*imageWidth;
			var indexA = iyW + minX;
			var indexB = iyW + maxX;
			var indexC = ayW + minX;
			var indexD = ayW + maxX;
			minX = x2 - minX;
			if(x2<0||x2>imageWidth){ minX=0.0; }
			minY = y2 - minY;
			if(y2<0||y2>imageHeight){ minY=0.0; }
			var omx = (1.0-minX);
			var omy = (1.0-minY);
			var array, A, B;
			for(i=listTo.length-1; i>=0; --i){
				array = listFr[i];
				A = minX*array[indexB] + omx*array[indexA];
				B = minX*array[indexD] + omx*array[indexC];
				listTo[i][index] = minY*B + omy*A;
			}
			
			
			// cubic: 520
			// Code.parallelArrayInterpolateCubic(listTo,listFr, index, p.x,p.y, imageWidth,imageHeight);
			// TODO - parallelArrayInterpolateCubic - odd behavior outside image

		/*
			// cubic-local: 430
			var x2 = p.x;
			var y2 = p.y;
			// .
			var hm1 = imageHeight-1, wm1 = imageWidth-1;
			var minX = Math.min( Math.max(Math.floor(x2), 0), wm1);
			var minY = Math.min( Math.max(Math.floor(y2), 0), hm1);
			var miiX = Math.max(minX-1, 0);
			var miiY = Math.max(minY-1, 0);
			var maxX = Math.max( Math.min(Math.ceil(x2), wm1), 0);
			var maxY = Math.max( Math.min(Math.ceil(y2), hm1), 0);
			var maaX = Math.min(maxX+1, wm1);
			var maaY = Math.min(maxY+1, hm1);
			var miiYwid = miiY*imageWidth;
			var minYwid = minY*imageWidth;
			var maxYwid = maxY*imageWidth;
			var maaYwid = maaY*imageWidth;
			var indexA = miiYwid + miiX;
			var indexB = miiYwid + minX;
			var indexC = miiYwid + maxX;
			var indexD = miiYwid + maaX;
			var indexE = minYwid + miiX;
			var indexF = minYwid + minX;
			var indexG = minYwid + maxX;
			var indexH = minYwid + maaX;
			var indexI = maxYwid + miiX;
			var indexJ = maxYwid + minX;
			var indexK = maxYwid + maxX;
			var indexL = maxYwid + maaX;
			var indexM = maaYwid + miiX;
			var indexN = maaYwid + minX;
			var indexO = maaYwid + maxX;
			var indexP = maaYwid + maaX;
			x2 = Math.min(Math.max(x2 - minX,0.0),1.0);
			y2 = Math.min(Math.max(y2 - minY,0.0),1.0);
			var xx = x2*x2; var xxx = xx*x2;
			var yy = y2*y2; var yyy = yy*y2;
			// .
			var a,b,c,d;
			var A,B,C,D;
			for(var i=listTo.length-1; i>=0; --i){
				array = listFr[i];
				//
				A = array[indexA];
				B = array[indexB];
				C = array[indexC];
				D = array[indexD];
				a = B;
				b = 0.5*(C-A);
				c = A - 2.5*B + 2.0*C - 0.5*D;
				d = 1.5*(B-C) + 0.5*(D-A);
				var alpha = a + b*x2 + c*xx + d*xxx;
				//
				A = array[indexE];
				B = array[indexF];
				C = array[indexG];
				D = array[indexH];
				a = B;
				b = 0.5*(C-A);
				c = A - 2.5*B + 2.0*C - 0.5*D;
				d = 1.5*(B-C) + 0.5*(D-A);
				var beta = a + b*x2 + c*xx + d*xxx;
				//
				A = array[indexI];
				B = array[indexJ];
				C = array[indexK];
				D = array[indexL];
				a = B;
				b = 0.5*(C-A);
				c = A - 2.5*B + 2.0*C - 0.5*D;
				d = 1.5*(B-C) + 0.5*(D-A);
				var gamma = a + b*x2 + c*xx + d*xxx;
				//
				A = array[indexM];
				B = array[indexN];
				C = array[indexO];
				D = array[indexP];
				a = B;
				b = 0.5*(C-A);
				c = A - 2.5*B + 2.0*C - 0.5*D;
				d = 1.5*(B-C) + 0.5*(D-A);
				var delta = a + b*x2 + c*xx + d*xxx;
				// 
				A = alpha;
				B = beta;
				C = gamma;
				D = delta;
				a = B;
				b = 0.5*(C-A);
				c = A - 2.5*B + 2.0*C - 0.5*D;
				d = 1.5*(B-C) + 0.5*(D-A);
				var value = a + b*y2 + c*yy + d*yyy;
				// out
				value = Math.max(0.0, Math.min(1.0, value));
				listTo[i][index] = value;
			}
			*/
		}
	}
	
	


	/*
destination = new Array(wid*hei);
var index = 0;
for(j=0;j<hei;++j){
	// var wJ = wid*j;
	for(i=0;i<wid;++i){
		fr.x = i; fr.y = j;
		projection.multV2DtoV3D(fr,fr);
		fr.x /= fr.z; fr.y /= fr.z;
		destination[index] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
		// destination[wJ+i] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
		 // destination[wid*j+i] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
		 // destination[index] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
		//destination[index] = ImageMat.getPointInterpolateNearest(source, sW,sH, fr.x,fr.y);
		++index;
	}
}
	*/


	// throw "todo";
	return reuseImage;
}






ImageMatScaled.prototype.extractRectCombineFast = function(reuseImage, scale, matrix){ // ceil / floor combine
	var imageScales = this;
	var info = imageScales.infoForScaleCombined(1.0/scale);
	// var info = imageScales.infoForScale(1.0/scale);
// console.log(info);
	var wid = reuseImage.width();
	var hei = reuseImage.height();
	var r = reuseImage.red();
	var g = reuseImage.grn();
	var b = reuseImage.blu();
	var p = new V2D();
	var listTo = [r,g,b];
	var pixelsReuse = r.length;
	for(var i=pixelsReuse-1; i>=0; --i){
		r[i] = 0;
		g[i] = 0;
		b[i] = 0;
	}
	var listImages = [info["imageA"],info["imageB"]];
	var listConstants = [info["percentA"],info["percentB"]];
	var listScalesEff = [info["effectiveScaleA"],info["effectiveScaleB"]];
	var listScalesAct = [info["actualScaleA"],info["actualScaleB"]];
	for(var list=0; list<2; ++list){
// console.log(list);
var multiplier = listConstants[list];
// console.log(multiplier);
		var imageMatrix = listImages[list];
		var effScale = listScalesEff[list];
		var actScale = listScalesAct[list];
		// /
		var imageGray = imageMatrix.gry();
		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();
		// /
		var red = imageMatrix.red();
		var grn = imageMatrix.grn();
		var blu = imageMatrix.blu();
		var wm1 = imageWidth-1;
		var hm1 = imageHeight-1;
		// use matrix
		var listFr = [red,grn,blu];
		// local linear constants:
		var hm1 = imageHeight-1, wm1 = imageWidth-1;
		var i;

		// local cubic constants:
		for(var y=0; y<hei; ++y){
			for(var x=0; x<wid; ++x){
				p.set(x,y);
				matrix.multV2DtoV2D(p,p);
				p.scale(actScale); // for selected image size
				// p.scale(1.0/actScale);
				// p.scale(effScale);
				// p.scale(1.0/effScale);
				var index = y*wid + x;

				// closest: 110
				// p.x = Math.max(0, Math.min( wm1, Math.round(p.x,1) ));
				// p.y = Math.max(0, Math.min( hm1, Math.round(p.y,1) ));
				// var indexImage = p.y*imageWidth + p.x;
				// r[index] = red[indexImage];
				// g[index] = grn[indexImage];
				// b[index] = blu[indexImage];

				// linear: 190
				// Code.parallelArrayInterpolateLinear(listTo,listFr, index, p.x,p.y, imageWidth,imageHeight);
				// 

				// linear-local: 160
				var x2 = p.x;
				var y2 = p.y;
				var minX = Math.min( Math.max(Math.floor(x2), 0), wm1);
				var minY = Math.min( Math.max(Math.floor(y2), 0), hm1);
				var maxX = Math.max( Math.min(Math.ceil(x2), wm1), 0);
				var maxY = Math.max( Math.min(Math.ceil(y2), hm1), 0);
				var iyW = minY*imageWidth;
				var ayW = maxY*imageWidth;
				var indexA = iyW + minX;
				var indexB = iyW + maxX;
				var indexC = ayW + minX;
				var indexD = ayW + maxX;
				minX = x2 - minX;
				if(x2<0||x2>imageWidth){ minX=0.0; }
				minY = y2 - minY;
				if(y2<0||y2>imageHeight){ minY=0.0; }
				var omx = (1.0-minX);
				var omy = (1.0-minY);
				var array, A, B;
				for(i=listTo.length-1; i>=0; --i){
					array = listFr[i];
					A = minX*array[indexB] + omx*array[indexA];
					B = minX*array[indexD] + omx*array[indexC];
					var next = multiplier * (minY*B + omy*A);
					var original = listTo[i][index];
					listTo[i][index] = original + next;
				}
				
				
				// cubic: 520
				// Code.parallelArrayInterpolateCubic(listTo,listFr, index, p.x,p.y, imageWidth,imageHeight);

				/*
				// cubic-local: 430
				var x2 = p.x;
				var y2 = p.y;
				// .
				var hm1 = imageHeight-1, wm1 = imageWidth-1;
				var minX = Math.min( Math.max(Math.floor(x2), 0), wm1);
				var minY = Math.min( Math.max(Math.floor(y2), 0), hm1);
				var miiX = Math.max(minX-1, 0);
				var miiY = Math.max(minY-1, 0);
				var maxX = Math.max( Math.min(Math.ceil(x2), wm1), 0);
				var maxY = Math.max( Math.min(Math.ceil(y2), hm1), 0);
				var maaX = Math.min(maxX+1, wm1);
				var maaY = Math.min(maxY+1, hm1);
				var miiYwid = miiY*imageWidth;
				var minYwid = minY*imageWidth;
				var maxYwid = maxY*imageWidth;
				var maaYwid = maaY*imageWidth;
				var indexA = miiYwid + miiX;
				var indexB = miiYwid + minX;
				var indexC = miiYwid + maxX;
				var indexD = miiYwid + maaX;
				var indexE = minYwid + miiX;
				var indexF = minYwid + minX;
				var indexG = minYwid + maxX;
				var indexH = minYwid + maaX;
				var indexI = maxYwid + miiX;
				var indexJ = maxYwid + minX;
				var indexK = maxYwid + maxX;
				var indexL = maxYwid + maaX;
				var indexM = maaYwid + miiX;
				var indexN = maaYwid + minX;
				var indexO = maaYwid + maxX;
				var indexP = maaYwid + maaX;
				minX = x2 - minX;
				minY = y2 - minY;
				// .
				x2 = minX;
				y2 = minY;
				var xx = x2*x2; var xxx = xx*x2;
				var yy = y2*y2; var yyy = yy*y2;
				// .
				var a,b,c,d;
				var A,B,C,D;
				for(var i=listTo.length-1; i>=0; --i){
					array = listFr[i];
					//
					A = array[indexA];
					B = array[indexB];
					C = array[indexC];
					D = array[indexD];
					a = B;
					b = 0.5*(C-A);
					c = A - 2.5*B + 2.0*C - 0.5*D;
					d = 1.5*(B-C) + 0.5*(D-A);
					var alpha = a + b*x2 + c*xx + d*xxx;
					//
					A = array[indexE];
					B = array[indexF];
					C = array[indexG];
					D = array[indexH];
					a = B;
					b = 0.5*(C-A);
					c = A - 2.5*B + 2.0*C - 0.5*D;
					d = 1.5*(B-C) + 0.5*(D-A);
					var beta = a + b*x2 + c*xx + d*xxx;
					//
					A = array[indexI];
					B = array[indexJ];
					C = array[indexK];
					D = array[indexL];
					a = B;
					b = 0.5*(C-A);
					c = A - 2.5*B + 2.0*C - 0.5*D;
					d = 1.5*(B-C) + 0.5*(D-A);
					var gamma = a + b*x2 + c*xx + d*xxx;
					//
					A = array[indexM];
					B = array[indexN];
					C = array[indexO];
					D = array[indexP];
					a = B;
					b = 0.5*(C-A);
					c = A - 2.5*B + 2.0*C - 0.5*D;
					d = 1.5*(B-C) + 0.5*(D-A);
					var delta = a + b*x2 + c*xx + d*xxx;
					// 
					A = alpha;
					B = beta;
					C = gamma;
					D = delta;
					a = B;
					b = 0.5*(C-A);
					c = A - 2.5*B + 2.0*C - 0.5*D;
					d = 1.5*(B-C) + 0.5*(D-A);
					var value = a + b*y2 + c*yy + d*yyy;
					// out
					value = Math.max(0, Math.min(1, value));
					listTo[i][index] = value;
				}
				*/
			}
		}
	}
	
	return reuseImage;
}












ImageMatScaled.affineToLocationTransform = function(outMatrix, inMatrix, destX,destY,sourceX,sourceY){ // helper: destination image to source image mapping
	if(outMatrix==inMatrix){
		outMatrix.preTranslate(-destX,-destY);
		outMatrix.translate(sourceX,sourceY);
	}else{
		outMatrix.identity();
		outMatrix.translate(-destX,-destY);
		outMatrix.postmult(inMatrix);
		outMatrix.translate(sourceX,sourceY);
	}
	return outMatrix;
}


// ...

// Matrix3D.js
Matrix3D.YAML = {
	A:"a",
	B:"b",
	C:"c",
	D:"d",
	E:"e",
	F:"f",
	G:"g",
	H:"h",
	I:"i",
	J:"j",
	K:"k",
	L:"l"
}
function Matrix3D(m){
	this.a=1; this.b=0; this.c=0; this.d=0; this.e=0; this.f=1; this.g=0; this.h=0; this.i=0; this.j=0; this.k=1; this.l=0;
	if(m){
		this.copy(m);
	}
}
Matrix3D.prototype.fromArray = function(a){
	if(!a){ return; }
	if(a.length==9){ // rotation only
		this.a = a[0];
		this.b = a[1];
		this.c = a[2];
		this.e = a[3];
		this.f = a[4];
		this.g = a[5];
		this.i = a[6];
		this.j = a[7];
		this.k = a[8];
	}else{
		var i, len=a.length;
		if(len>0){ this.a = a[0]; }
		if(len>1){ this.b = a[1]; }
		if(len>2){ this.c = a[2]; }
		if(len>3){ this.d = a[3]; }
		if(len>4){ this.e = a[4]; }
		if(len>5){ this.f = a[5]; }
		if(len>6){ this.g = a[6]; }
		if(len>7){ this.h = a[7]; }
		if(len>8){ this.i = a[8]; }
		if(len>9){ this.j = a[9]; }
		if(len>10){ this.k = a[10]; }
		if(len>11){ this.l = a[11]; }
	}
	return this;
}
Matrix3D.prototype.fromArrayRotation = function(a){ // 3x3 rotation values
	if(!a){ return; }
	var i, len=a.length;
	if(len>0){ this.a = a[0]; }
	if(len>1){ this.b = a[1]; }
	if(len>2){ this.c = a[2]; }
	if(len>3){ this.e = a[3]; }
	if(len>4){ this.f = a[4]; }
	if(len>5){ this.g = a[5]; }
	if(len>6){ this.i = a[6]; }
	if(len>7){ this.j = a[7]; }
	if(len>8){ this.k = a[8]; }
	return this;
}
Matrix3D.prototype.fromArrayTranslation = function(a){
	if(!a){ return; }
	var i, len=a.length;
	if(len>0){ this.d = a[0]; }
	if(len>1){ this.h = a[1]; }
	if(len>2){ this.l = a[2]; }
	return this;
}
Matrix3D.prototype.toMatrix = function(){
	return Matrix3D.matrixFromMatrix3D(this);
}
//if(mat4){
	// mat4 == col major
mat4.preMultM3D = function(a,b,m){
	if(!m){
		m = b;
		return mat4.multiply(a,a,[m.a,m.e,m.i,0, m.b,m.f,m.j,0, m.c,m.g,m.k,0, m.d,m.h,m.l,1]);
		//return mat4.multiply(a,a,[m.a,m.b,m.c,m.d, m.e,m.f,m.g,m.h, m.i,m.j,m.k,m.l, 0,0,0,1]); // OLD
	}
	return mat4.multiply(a,b,[m.a,m.e,m.i,0, m.b,m.f,m.j,0, m.c,m.g,m.k,0, m.d,m.h,m.l,1]);
	//return mat4.multiply(a,b,[m.a,m.b,m.c,m.d, m.e,m.f,m.g,m.h, m.i,m.j,m.k,m.l, 0,0,0,1]); // OLD
}
// mat4.postMultM3D(this._modelViewMatrixStack.matrix(),m);
mat4.postMultM3D = function(a,b,m){
	if(!m){
		m = b;
		return mat4.multiply(a,[m.a,m.e,m.i,0, m.b,m.f,m.j,0, m.c,m.g,m.k,0, m.d,m.h,m.l,1],a);
		//return mat4.multiply(a,[m.a,m.b,m.c,m.d, m.e,m.f,m.g,m.h, m.i,m.j,m.k,m.l, 0,0,0,1],a); // OLD
	}
	//return mat4.multiply(a,[m.a,m.b,m.c,m.d, m.e,m.f,m.g,m.h, m.i,m.j,m.k,m.l, 0,0,0,1],b); // OLD
	return mat4.multiply(a,[m.a,m.e,m.i,0, m.b,m.f,m.j,0, m.c,m.g,m.k,0, m.d,m.h,m.l,1],b);
}
mat4.toArray = function(mat4){
	var arr = [ mat4[0],mat4[4],mat4[8],mat4[12],  mat4[1],mat4[5],mat4[9],mat4[13],  mat4[2],mat4[6],mat4[10],mat4[14],  mat4[3],mat4[7],mat4[11],mat4[15] ]; // 3==0, 7==0, 11==0, 15==1
	return arr;
}
mat4.fromArray = function(m, a){
	if(a===undefined){
		a = m;
		m = mat4.create();
	}
	m[0] = a[0];
	m[1] = a[4];
	m[2] = a[8];
	m[3] = a[12] ? a[12] : 0;
	m[4] = a[1];
	m[5] = a[5];
	m[6] = a[9];
	m[7] = a[13] ? a[13] : 0;
	m[8] = a[2];
	m[9] = a[6];
	m[10] = a[10];
	m[11] = a[14] ? a[14] : 0;
	m[12] = a[3];
	m[13] = a[7];
	m[14] = a[11];
	m[15] = a[15] ? a[15] : 1;
}
/*
ROW MAJOR:
[a b c d]
[e f g h]
[i j k l]
[0 0 0 1]
COL MAJOR:
[a b c 0]
[e f g 0]
[i j k 0]
[d h l ?]
*/
//}
Matrix3D.prototype.toYAML = function(yaml){
	var obj = this.toObject();
	yaml.writeObjectLiteral(obj);
	return this;
}
Matrix3D.prototype.toObject = function(){
	var DATA = Matrix3D.YAML;
	var object = {};
	object[DATA.A] = this.a;
	object[DATA.B] = this.b;
	object[DATA.C] = this.c;
	object[DATA.D] = this.d;
	object[DATA.E] = this.e;
	object[DATA.F] = this.f;
	object[DATA.G] = this.g;
	object[DATA.H] = this.h;
	object[DATA.I] = this.i;
	object[DATA.J] = this.j;
	object[DATA.K] = this.k;
	object[DATA.L] = this.l;
	return object;
}
Matrix3D.prototype.loadFromObject = function(obj){
	var DATA = Matrix3D.YAML;
	this.set(obj[DATA.A],obj[DATA.B],obj[DATA.C],obj[DATA.D], obj[DATA.E],obj[DATA.F],obj[DATA.G],obj[DATA.H], obj[DATA.I],obj[DATA.J],obj[DATA.K],obj[DATA.L]);
}
Matrix3D.prototype.identity = function(){
	this.a=1; this.b=0; this.c=0; this.d=0; this.e=0; this.f=1; this.g=0; this.h=0; this.i=0; this.j=0; this.k=1; this.l=0;
	return this;
}
Matrix3D.prototype.set = function(tA,tB,tC,tD,tE,tF,tG,tH,tI,tJ,tK,tL){
	this.a=tA; this.b=tB; this.c=tC; this.d=tD; this.e=tE; this.f=tF; this.g=tG; this.h=tH; this.i=tI; this.j=tJ; this.k=tK; this.l=tL;
	return this;
}
Matrix3D.prototype.translate = function(tx,ty,tz){
	var mat = Matrix3D.temp;
	if(Code.isa(tx,V3D)){
		mat.set(1,0,0,tx.x, 0,1,0,tx.y, 0,0,1,tx.z);
	}else{
		mat.set(1,0,0,tx, 0,1,0,ty, 0,0,1,tz);
	}
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.setTranslation = function(tx,ty,tz){
	this.d = tx;
	this.h = ty;
	this.l = tz;
}
// skewing by x, y, z

Matrix3D.prototype.toTranslation = function(v){
	if(!v){ v = new V3D(); }
	v.set(this.d,this.h,this.l);
	return v;
}

Matrix3D.prototype.toQuaternion = function(){
	return Code.rotationMatrixToQuaternion(this.a,this.b,this.c,this.e,this.f,this.g,this.i,this.j,this.k);
}
Matrix3D.prototype.fromQuaternion = function(v){
	V4D.qMatrix(this,v);
	return this;
}
Matrix3D.prototype.rotateQuaternion = function(v){
	var mat = Matrix3D.temp.fromQuaternion(v);
// postMult
	// console.log(this);
	this.postmult(mat); // pre?
	return this;
}
Matrix3D.prototype.rotateVector = function(v,t){ // vector, theta
	var mat = Matrix3D.temp;
	var c = Math.cos(t), s = Math.sin(t);
	var x = v.x, y = v.y, z = v.z;
	var xx = x*x, yy = y*y, zz = z*z;
	var xy = x*y, xz = x*z, yz = y*z;
	var o = 1-c;
	mat.set(xx*o +   c, xy*o - z*s, xz*o + y*s, 0,
			xy*o + z*s, yy*o +   c, yz*o - x*s, 0,
			xz*o - y*s, yz*o + x*s, zz*o +   c, 0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.translationToVector = function(v){
	if(v){
		v.x = this.d; v.y = this.h; v.z = this.l;
		return v;
	}
	return new V3D(this.d,this.h,this.l);
}
Matrix3D.prototype.rotationToAxis = function(){ // direction + rotation required to ?
	var angle = Math.acos( (this.a+this.f+this.k-1.0)*0.5 );
//console.log(angle)
	var xNum = this.j - this.g;
	var yNum = this.c - this.i;
	var zNum = this.e - this.b;
	var den = Math.sqrt(xNum*xNum + yNum*yNum + zNum*zNum);
	if(den==0){
		return new V4D(1,0,0, 0);
	}
	var x = xNum/den;
	var y = yNum/den;
	var z = zNum/den;
	return new V4D(x,y,z, angle);
}
Matrix3D.prototype.origin = function(){
	var o = new V3D(0,0,0);
	this.multV3DtoV3D(o,o);
	return o;
}
Matrix3D.prototype.dirX = function(){
	var o = new V3D(0,0,0);
	var x = new V3D(1,0,0);
	this.multV3DtoV3D(o,o);
	this.multV3DtoV3D(x,x);
	return V3D.sub(x,o).norm();
}
Matrix3D.prototype.dirY = function(){
	var o = new V3D(0,0,0);
	var x = new V3D(0,1,0);
	this.multV3DtoV3D(o,o);
	this.multV3DtoV3D(x,x);
	return V3D.sub(x,o).norm();
}
Matrix3D.prototype.dirZ = function(){
	var o = new V3D(0,0,0);
	var x = new V3D(0,0,1);
	this.multV3DtoV3D(o,o);
	this.multV3DtoV3D(x,x);
	return V3D.sub(x,o).norm();
}

Matrix3D.prototype.rotateX = function(tX){
	var mat = Matrix3D.temp;
	var c = Math.cos(tX), s = Math.sin(tX);
	mat.set(1,0,0,0, 0,c,-s,0, 0,s,c,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateY = function(tY){
	var mat = Matrix3D.temp;
	var c = Math.cos(tY), s = Math.sin(tY);
	mat.set(c,0,s,0, 0,1,0,0, -s,0,c,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateZ = function(tZ){
	var mat = Matrix3D.temp;
	var c = Math.cos(tZ), s = Math.sin(tZ);
	mat.set(c,-s,0,0, s,c,0,0, 0,0,1,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateXYZ = function(rX,rY,rZ){
	console.log(rX,rY,rZ)
	this.rotateX(rX);
	this.rotateY(rY);
	this.rotateZ(rZ);
	return this;
}
Matrix3D.prototype.rotateZYX = function(rX,rY,rZ){
	this.rotateZ(rZ);
	this.rotateY(rY);
	this.rotateX(rX);
	return this;
}
Matrix3D.prototype.scale = function(sX,sY,sZ){
	var mat = Matrix3D.temp;
	if(sY===undefined){ sY = sX; }
	if(sZ===undefined){ sZ = sX; }
	mat.set(sX,0,0,0, 0,sY,0,0, 0,0,sZ,0);
// console.log(mat+"")
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.scaleTranslation = function(sX,sY,sZ){
	if(sY===undefined){ sY = sX; }
	if(sZ===undefined){ sZ = sX; }
	this.d = this.d*sX;
	this.h = this.h*sY;
	this.l = this.l*sZ;
	return this;
}
Matrix3D.prototype.premult = function(mat){
	this.mult(this,mat);
	return this;
}
Matrix3D.prototype.postmult = function(mat){
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.mult = function(mA,mB){
	if(!mB){
		mB = mA;
		mA = this;
	}
	var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aE=mA.e,aF=mA.f,aG=mA.g,aH=mA.h,aI=mA.i,aJ=mA.j,aK=mA.k,aL=mA.l;
	var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bE=mB.e,bF=mB.f,bG=mB.g,bH=mB.h,bI=mB.i,bJ=mB.j,bK=mB.k,bL=mB.l;
	this.a = aA*bA + aB*bE + aC*bI;
	this.b = aA*bB + aB*bF + aC*bJ;
	this.c = aA*bC + aB*bG + aC*bK;
	this.d = aA*bD + aB*bH + aC*bL + aD;
	this.e = aE*bA + aF*bE + aG*bI;
	this.f = aE*bB + aF*bF + aG*bJ;
	this.g = aE*bC + aF*bG + aG*bK;
	this.h = aE*bD + aF*bH + aG*bL + aH;
	this.i = aI*bA + aJ*bE + aK*bI;
	this.j = aI*bB + aJ*bF + aK*bJ;
	this.k = aI*bC + aJ*bG + aK*bK;
	this.l = aI*bD + aJ*bH + aK*bL + aL;
	return this;
}
Matrix3D.mult = function(mC, mA,mB){
	if(!mB){
		mB = mA;
		mA = mC;
		mC = new Matrix3D();
	}
	return mC.mult(mA,mB);
}
Matrix3D.prototype.multV3D = function(aV,bV){ // a = trans(b)
	if(bV===undefined){ bV = aV; aV = new V3D(); }
	var ax = this.a*bV.x + this.b*bV.y + this.c*bV.z + this.d;
	var ay = this.e*bV.x + this.f*bV.y + this.g*bV.z + this.h;
	aV.z =   this.i*bV.x + this.j*bV.y + this.k*bV.z + this.l;
	aV.y = ay;
	aV.x = ax;
	return aV;
}
Matrix3D.prototype.multV3DtoV3D = function(aV,bV){
	return this.multV3D(aV,bV);
}
Matrix3D.prototype.multV4D = function(aV,bV){ // a = trans(b)
	if(bV===undefined){ bV = aV; aV = new V4D(); }
	var ax = this.a*bV.x + this.b*bV.y + this.c*bV.z + this.d*bV.t;
	var ay = this.e*bV.x + this.f*bV.y + this.g*bV.z + this.h*bV.t;
	aV.z =   this.i*bV.x + this.j*bV.y + this.k*bV.z + this.l*bV.t;
	aV.y = ay;
	aV.x = ax;
	return aV;
}
Matrix3D.prototype.copy = function(m){
	if(m===undefined){
		return new Matrix3D().copy(this);
	}
	this.set(m.a,m.b,m.c,m.d,m.e,m.f,m.g,m.h,m.i,m.j,m.k,m.l);
	return this;
}
Matrix3D.inverse = function(n,m){
	if(!m){
		m = n;
		n = new Matrix3D();
	}
	n.inverse(m);
	return n;
}
Matrix3D.prototype.inverse = function(m){ // http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html
	if(!m){
		m = this;
	}
	// http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche53.html ----- R|t specific
	var det = 1/(m.a*m.f*m.k + m.b*m.g*m.i + m.c*m.e*m.j - m.a*m.g*m.j - m.b*m.e*m.k - m.c*m.f*m.i);
	var a = (m.f*m.k - m.g*m.j)*det;
	var b = (m.c*m.j - m.b*m.k)*det;
	var c = (m.b*m.g - m.c*m.f)*det;
	var d = (m.b*m.h*m.k + m.c*m.f*m.l + m.d*m.g*m.j - m.b*m.g*m.l - m.c*m.h*m.j - m.d*m.f*m.k)*det;
	var e = (m.g*m.i - m.e*m.k)*det;
	var f = (m.a*m.k - m.c*m.i)*det;
	var g = (m.c*m.e - m.a*m.g)*det;
	var h = (m.a*m.g*m.l + m.c*m.h*m.i + m.d*m.e*m.k - m.a*m.h*m.k - m.c*m.e*m.l - m.d*m.g*m.i)*det;
	var i = (m.e*m.j - m.f*m.i)*det;
	var j = (m.b*m.i - m.a*m.j)*det;
	var k = (m.a*m.f - m.b*m.e)*det;
	var l = (m.a*m.h*m.j + m.b*m.e*m.l + m.d*m.f*m.i - m.a*m.f*m.l - m.b*m.h*m.i - m.d*m.e*m.j)*det;
	this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f; this.g = g; this.h = h; this.i = i; this.j = j; this.k = k; this.l = l;
	return this;
}
Matrix3D.prototype.get = function(r,c){ // TODO: faster implementation
	var a = new Array(this.a,this.b,this.c,this.d,this.e,this.f,this.g,this.h,this.i,this.j,this.k,this.l);
	if(r!==undefined){
		return a[r*4+c];
	}
	return a;
}
Matrix3D.prototype.toString = function(){
	return "[ "+this.a+" "+this.b+" "+this.c+" "+this.d+" ]\n"
		  +"[ "+this.e+" "+this.f+" "+this.g+" "+this.h+" ]\n"
		  +"[ "+this.i+" "+this.j+" "+this.k+" "+this.l+" ]\n"
		  +"[ 0 0 0 1 ]";
}
Matrix3D.prototype.toArray = function(){
	return [this.a,this.b,this.c,this.d, this.e,this.f,this.g,this.h, this.i,this.j,this.k,this.l, 0,0,0,1];
}
Matrix3D.prototype.toArrayRotation = function(){
	return [this.a,this.b,this.c, this.e,this.f,this.g, this.i,this.j,this.k];
}
Matrix3D.prototype.toArrayTranslation = function(){
	return [this.d,this.h,this.l];
}
Matrix3D.prototype.kill = function(){
	this.a = undefined; this.b = undefined; this.c = undefined; this.d = undefined;
	this.e = undefined; this.f = undefined; this.g = undefined; this.h = undefined;
	this.i = undefined; this.j = undefined; this.k = undefined; this.l = undefined;
}
// -----------------------------------------------------------------------------------------------
Matrix3D.temp = new Matrix3D(); // internal
Matrix3D.TEMP = new Matrix3D(); // external

Matrix3D.relativeWorld = function(relAB,absA,absB){
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix3D();
	}
	var invA = Matrix3D.inverse(Matrix3D.temp, absA);
	Matrix3D.mult(relAB, absB, invA);
	return relAB;
}

Matrix3D.relativeReference = function(relAB,absA,absB){
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix3D();
	}
	var invA = Matrix3D.inverse(Matrix3D.temp, absA);
	Matrix3D.mult(relAB, invA, absB);
	return relAB;
}

Matrix3D.matrix3DFromMatrix = function(mat){
	var m3D = new Matrix3D();
	m3D.set(mat.get(0,0),mat.get(0,1),mat.get(0,2),mat.get(0,3),
			mat.get(1,0),mat.get(1,1),mat.get(1,2),mat.get(1,3),
			mat.get(2,0),mat.get(2,1),mat.get(2,2),mat.get(2,3));
	return m3D;
}
Matrix3D.fromMatrix = function(mat){
	return Matrix3D.matrix3DFromMatrix(mat);
}
Matrix3D.matrixFromMatrix3D = function(mat){
	return new Matrix(4,4).fromArray([mat.a,mat.b,mat.c,mat.d, mat.e,mat.f,mat.g,mat.h, mat.i,mat.j,mat.k,mat.l, 0,0,0,1]);
}

Matrix3D.prototype.orientation = function(){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	var o = new V3D(0,0,0);
	// var matrix = ;
	x = this.multV3D(x); // rotation offset
	y = this.multV3D(y);
	z = this.multV3D(z);
	o = this.multV3D(o);
	x.sub(o); // translation offset
	y.sub(o);
	z.sub(o);
	x.norm(); // scale offset
	y.norm();
	z.norm();
	return {"x":x,"y":y,"z":z,"o":o};
}

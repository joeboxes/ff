// Link3DR.js
function Link3DR(){
	this._A = null; // view A
	this._B = null; // view B
	this._F_AtoB = null; // points from A to lines in B
	this._F_BtoA = null; // points from B to lines in A
	this._extrinsic_AtoB = null; // camera pose B relative to A
	this._extrinsic_BtoA = null; // camera pose A relative to B
	this._rectificationA = null; // 
	this._rectificationB = null; // 
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
Link3DR.prototype.A = function(a){
	if(a!==undefined){
		this._A = a;
	}
	return this._A;
}
Link3DR.prototype.B = function(b){
	if(b!==undefined){
		this._B = b;
	}
	return this._B;
}
Link3DR.prototype.FA = function(){
	return this._F_AtoB;
}
Link3DR.prototype.FB = function(){
	return this._F_BtoA;
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.bundleAdjust = function(b){
	// actual bundle adjust goes here
	var ret;
	// normalize input points
	inputPoints = [this._A.putativePoints(), this._B.putativePoints()];
	ret = R3D.calculateNormalizedPoints(inputPoints);
	var normalizedInputPoints = ret.normalized;
	var forwardTransforms = ret.forward;
	var reverseTransforms = ret.reverse;
	// RANSAC
		// ...
	// fundamental matrix
	var F = R3D.fundamentalMatrix(normalizedInputPoints[0],normalizedInputPoints[1]);
	F = Matrix.mult(F,forwardTransforms[0]); // a normalized
	F = Matrix.mult(Matrix.transpose(forwardTransforms[1]),F); // b denormalized
	var Finv = Matrix.transpose(F);
	// copy
	this._F_AtoB = F;
	this._F_BtoA = Finv;
	this._A.resolvedPoints(this._A.putativePoints());
	this._B.resolvedPoints(this._B.putativePoints());
}
Link3DR.prototype.searchLineInBFromPointInA = function(point){
	return this.searchLineFromPoint(this._F_AtoB,point);
}
Link3DR.prototype.searchLineInAFromPointInB = function(point){
	return this.searchLineFromPoint(this._F_BtoA,point);
}
Link3DR.prototype.searchLineFromPoint = function(F, point){
// should handle epipole-in-image half lines ...
	var line, l1, l2, intA, intB, list = [];
	line = F.multV3DtoV3D(new V3D(), point);
	if(line.x==0.0 && line.y==0.0){
		return null;
	}
	var TL = new V2D(0,0);
	var TR = new V2D(1.0,0);
	var BR = new V2D(1.0,1.0);
	var BL = new V2D(0,1.0);
	if( Math.abs(line.x) > Math.abs(line.y) ){ // more vertical
		l1 = new V2D( -line.z/line.x, 0.0);
		l2 = new V2D( (-1.0*line.y-line.z)/line.x, 1.0);
		intA = Code.lineSegIntersect2D(l1,l2, TL,BL);
		intB = Code.lineSegIntersect2D(l1,l2, TR,BR);
		if(intA){ intA = new V2D(intA.x,intA.y); }
		if(intB){ intB = new V2D(intB.x,intB.y); }
		if(intA && intB){
			if(intA.y < intB.y){
				list.push( intA ); list.push( intB );
			}else{
				list.push( intB ); list.push( intA );
			}
		}else{
			if(0<l1.x && l1.x<1.0){ list.push(l1); }
			if(intA){ list.push( intA ); }
			if(intB){ list.push( intB ); }
			if(0<l2.x && l2.x<1.0){ list.push(l2); }
		}
	}else{ // more horizontal
		l1 = new V2D( 0.0,-line.z/line.y);
		l2 = new V2D( 1.0,(-1.0*line.x-line.z)/line.y);
		intA = Code.lineSegIntersect2D(l1,l2, TL,TR);
		intB = Code.lineSegIntersect2D(l1,l2, BL,BR);
		if(intA){ intA = new V2D(intA.x,intA.y); }
		if(intB){ intB = new V2D(intB.x,intB.y); }
		if(intA && intB){
			if(intA.x < intB.x){
				list.push( intA ); list.push( intB );
			}else{
				list.push( intB ); list.push( intA );
			}
		}else{
			if(0<l1.y && l1.y<1.0){ list.push(l1); }
			if(intA){ list.push( intA ); }
			if(intB){ list.push( intB ); }
			if(0<l2.y && l2.y<1.0){ list.push(l2); }
		}
	}
	return list;
}
Link3DR.prototype.searchThetaInBFromPointInA = function(point){
	// get line in B
	// get a point on the line
	// get angle with XDIR
	// return
}
Link3DR.prototype.rectify = function(){
	var epipoleA = null;
	this._rectificationA = this._A.getRectification(epipoleA);
	this._rectificationB = this._B.getRectification(epipoleB);
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.x = function(){
	//
}
Link3DR.prototype.kill = function(){
	//
}

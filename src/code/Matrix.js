// Matrix.js
Matrix.YAML = {
	ROWS:"row",
	COLS:"col",
	DATA:"data"
};
function Matrix(r,c, vals){
	if(vals){
		this.fromArray(vals,r,c);
	}else{
		this._init(r,c);
	}
}
Matrix.prototype._init = function(r,c){
	r = r!==undefined ? r : 0;
	c = c!==undefined ? c : 0;
	this._rowCount = r;
	this._colCount = c;
	this._rows = new Array();
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		this._rows[j] = new Array(col);
		for(i=0;i<col;++i){
			this._rows[j][i] = 0.0;
		}
	}
}
Matrix.prototype.toYAML = function(yaml){
	var obj = this.toObject();
	yaml.writeObjectLiteral(obj);
	return this;
}
Matrix.prototype.toObject = function(){
	var obj = {};
	var i, j, r, row=this._rowCount, col=this._colCount;
	var DATA = Matrix.YAML;
	obj[DATA.ROWS] = this._rowCount;
	obj[DATA.COLS] = this._colCount;
	var arr = [];
	for(j=0;j<row;++j){
		r = this._rows[j];
		for(i=0;i<col;++i){
			arr.push(r[i]);
		}
	}
	obj[DATA.DATA] = arr;
	return obj;
}
Matrix.prototype.fromObject = function(obj){
	return this.loadFromObject(obj);
}

Matrix.prototype.colCount = function(obj){
	return this._colCount;
}

Matrix.prototype.rowCount = function(obj){
	return this._rowCount;
}
Matrix.prototype.loadFromObject = function(obj){
	var DATA = Matrix.YAML;
	var rows = obj[DATA.ROWS];
	var cols = obj[DATA.COLS];
	var data = obj[DATA.DATA];
	this.fromArray(data, rows,cols);
	return this;
}
Matrix.loadFromObject = function(obj){
	return new Matrix().loadFromObject(obj);
}
Matrix.fromObject = function(obj){
	return new Matrix().fromObject(obj);
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE
Matrix.prototype.fromArray = function(list, newRow,newCol){
	if(newRow!==undefined){
		this.setSize(newRow,newCol);
	}
	Code.setArray2DFromArray(this._rows,this._rowCount,this._colCount, list);
	return this;
}
Matrix.prototype.fromArrayMatrix = function(list, newRow,newCol){
	if(newRow!==undefined){
		this.setSize(newRow,newCol);
	}
	Code.copyArray2DFromArray2D(this._rows,this._rowCount,this._colCount, list);
	return this;
}
Matrix.prototype.setDiagonalsFromArray = function(list){
	var i, len = Math.min(this.rows(), this.cols(), list.length);
	for(i=0;i<len;++i){
		this._rows[i][i] = list[i];
	}
	return this;
}
Matrix.prototype.setSize = function(rows,cols){
	if(this._rows!=rows || this._cols!=cols){ // don't do anything if already sized correctly
		this._init(rows,cols);
	}
	return this;
}
Matrix.prototype.rows = function(){
	return this._rowCount;
}
Matrix.prototype.cols = function(){
	return this._colCount;
}
Matrix.prototype.set = function(row,col,val){
	this._rows[row][col] = val;
}
Matrix.prototype.get = function(row,col){
	return this._rows[row][col];
}
// Matrix.prototype.scale = function(s){
// 	var i, j, row = this._rowCount, col = this._colCount;
// 	var index = 0;
// 	for(j=0;j<row;++j){
// 		for(i=0;i<col;++i){
// 			this._rows[j][i] = this._rows[j][i]*s;
// 		}
// 	}
// 	return this;
// }
Matrix.prototype.scale = function(c){
	var row, rows = this._rowCount, cols = this._colCount;
	var _rows = this._rows;
	var i, j;
	for(j=0;j<rows;++j){
		row = _rows[j];
		for(i=0;i<cols;++i){
			row[i] = row[i]*c;
		}
	}
	return this;
}
Matrix.prototype.add = function(m){ // assume valid sizes ...
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = this._rows[j][i] + m._rows[j][i];
		}
	}
	return this;
}
Matrix.prototype.toV3D = function(){
	var i, j, v = new V3D();
	if(this._rows.length==1){ // row vector
		v.set(this._rows[0][0],this._rows[0][1],this._rows[0][2]);
	}else{ // column vector
		v.set(this._rows[0][0],this._rows[1][0],this._rows[2][0]);
	}
	return v;
}
Matrix.prototype.toV2D = function(){
	var i, j, v = new V2D();
	if(this._rows.length==1){ // row vector
		v.set(this._rows[0][0],this._rows[0][1]);
	}else{ // column vector
		v.set(this._rows[0][0],this._rows[1][0]);
	}
	return v;
}
Matrix.prototype.toArray = function(a){
	var i, j, row = this._rowCount, col = this._colCount, index = 0;
	if(!a){
		a = new Array(row*col);
	}
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			a[index] = this._rows[j][i];
			++index;
		}
	}
	return a;
}
Matrix.prototype.colToArray = function(i){
	var j, row = this._rowCount;
	var a = new Array(row);
	for(j=0;j<row;++j){
		a[j] = this._rows[j][i];
	}
	return a;
}
Matrix.prototype.rowToArray = function(i){
	return Code.copyArray(this._rows[i]);
}
// ------------------------------------------------------------------------------------------------------------------------ BASIC SETTING
Matrix.prototype.zero = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = 0.0;
		}
	}
	return this;
}
Matrix.prototype.identity = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			if(i==j){
				this._rows[j][i] = 1.0;
			}else{
				this._rows[j][i] = 0.0;
			}
		}
	}
	return this;
}
Matrix.prototype.dropOutIdentity= function(thresh){
	thresh = thresh===undefined?(1E-6):thresh;
	var i, j, row = this._rowCount, col = this._colCount;
	var found = false;
	for(i=0;i<col;++i){
		for(j=0;j<row;++j){
			if(found){
				this._rows[j][i] = 0.0;
			}else{
				if(i==j){
					if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
						console.log(j,i,"==");
						this._rows[j][i] = 0.0;
						found = true;
					}
				}else if( Math.abs(this._rows[j][i])>thresh ){
					console.log(j,i,"!=");
					this._rows[j][i] = 0.0;
					found = true;
				}
			}
		}
	}
	return true;
}
Matrix.prototype.dropNonIdentity = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	var found = false;
	for(i=0;i<col;++i){
		for(j=0;j<row;++j){
			if(i==j){
				// if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
				// 	//this._rows[j][i] = 0.0;
				// }
			}else{// if( Math.abs(this._rows[j][i])>thresh ){
				this._rows[j][i] = 0.0;
			}
		}
	}
	return true;
}
Matrix.prototype.closeToIdentity = function(thresh){
	thresh = thresh===undefined?(1E-6):thresh;
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			if(i==j){
				if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
					//console.log(j,i,"==");
					return false;
				}
			}else if( Math.abs(this._rows[j][i])>thresh ){
				//console.log(j,i,"!=");
				return false;
			}
		}
	}
	return true;
}
Matrix.prototype.getSubMatrix = function(offRow,offCol, rows,cols, reuseMatrix){
	var i,j, m = reuseMatrix;
	if(!reuseMatrix){
		m = new Matrix(rows,cols);
	}
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			m._rows[j][i] = this._rows[j+offRow][i+offCol];
		}
	}
	return m;
}
Matrix.prototype.setSubMatrix = function(submatrix, matOffRow,matOffCol,matRows,matCols, subOffRow,subOffCol,subRows,subCols){
	matOffRow = matOffRow!==undefined ? matOffRow : 0;
	matOffCol = matOffCol!==undefined ? matOffCol : 0;
	matRows = matRows!==undefined ? matRows : this.rows();
	matCols = matCols!==undefined ? matCols : this.cols();
	subOffRow = subOffRow!==undefined ? subOffRow : 0;
	subOffCol = subOffCol!==undefined ? subOffCol : 0;
	subRows = subRows!==undefined ? subRows : submatrix.rows();
	subCols = subCols!==undefined ? subCols : submatrix.cols();
	var i,j;
	// these should match ?
	var rowCount = Math.min(matRows,subRows);
	var colCount = Math.min(matCols,subCols);
	console.log("setSubMatrix: "+rowCount+"x"+colCount+" : "+matOffRow+","+matOffCol+" | "+subOffRow+","+subOffCol+" ... "+matRows+"x"+matCols+" & "+subRows+"x"+subCols+"");
	for(j=0;j<rowCount;++j){
		for(i=0;i<colCount;++i){
			//m._rows[j][i] = this._rows[j+offRow][i+offCol];
			this._rows[j+matOffRow][i+matOffCol] = submatrix._rows[j+subOffRow][i+subOffCol];
		}
	}
	return this;
}
Matrix.prototype.randomize = function(mul,rnd){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = Math.random()*mul;
			if(rnd){
				this._rows[j][i] = Math.round(this._rows[j][i]);
			}
		}
	}
	return this;
}
// ------------------------------------------------------------------------------------------------------------------------ ...
Matrix.prototype.appendColFromArray = function(col){
	var cols = this.cols();
	var rows = this.rows();
	var i, len = Math.min(rows,col.length);
	for(i=0;i<len;++i){ // match first up to row count
		this._rows[i][cols] = col[i];
	}
	for(;i<rows;++i){ // remaining = 0
		// console.log(i,cols,len)
		this._rows[i][cols] = 0.0;
	}
	this._colCount += 1;
	return this;
}
Matrix.prototype.appendRowFromArray = function(row){
	var cols = this.cols();
	var rows = this.rows();
	var i, len = Math.min(cols,row.length);
	this._rows.push([]);
	for(i=0;i<len;++i){ // match first up to col count
		this._rows[rows][i] = row[i];
	}
	for(;i<cols;++i){ // remaining = 0
		this._rows[rows][i] = 0.0;
	}
	this._rowCount += 1;
	return this;
}
Matrix.prototype.appendMatrixRight = function(mat){ // stretch down to fit
	//
	return this;
}
Matrix.prototype.appendMatrixBottom = function(mat){ // stretch right to fit
	var colsA = this.cols();
	var rowsA = this.rows();
	var colsB = mat.cols();
	var rowsB = mat.rows();
	var totalCols = Math.max(colsA,colsB);
	var totalRows = rowsA+rowsB;
	var i, j, k;
	// extend top if necessary
	for(j=0;j<rowsA;++j){
		for(i=colsA;i<totalCols;++i){
			this._rows[j][i] = 0.0;
		}
	}
	// add in content
	for(k=0,j=rowsA;j<totalRows;++k,++j){
		this._rows[j] = new Array();
		for(i=0;i<colsB;++i){
			this._rows[j][i] = mat._rows[k][i];
		}
	}
	// extend bottom if necessary
	for(j=rowsA;j<totalRows;++j){
		for(i=colsB;i<totalCols;++i){
			this._rows[j][i] = 0.0;
		}
	}
	this._rowCount = totalRows;
	this._colCount = totalCols;
	return this;
}
// ------------------------------------------------------------------------------------------------------------------------ ...
Matrix.prototype.getColAsArray = function(col){
	var rows = this.rows(), i, a = [];
	for(i=0;i<rows;++i){
		a[i] = this._rows[i][col];
	}
	return a;
}
Matrix.prototype.getCol = function(col){
	return new Matrix(this.rows(),1).fromArray(this.getColAsArray(col));
}
Matrix.prototype.getRowAsArray = function(row){
	return Code.copyArray( this._rows[row] );
}
Matrix.prototype.getRow = function(row){
	return new Matrix(1,this.rows()).fromArray(this._rows[row]);
}
Matrix.prototype.setColFromCol = function(i, mat,j){
	var r, rows = Math.min(this.rows(),mat.rows());
	for(r=0;r<rows;++r){
		this._rows[r][i] = mat._rows[r][j];
	}
	return this;
}
Matrix.prototype.setColFromArray = function(i, arr){
	var r, rows = Math.min(this.rows(),arr.length);
	for(r=0;r<rows;++r){
		this._rows[r][i] = arr[r];
	}
	return this;
}
Matrix.prototype.setRowFromArray = function(i, arr){
	while(this._rows.length<=i){
		this._rows.push([]); // needs to be filled in
		this._rowCount++;
	}
	var c, cols = Math.min(arr.length,this.cols()), row = this._rows[i];
	for(c=0; c<cols; ++c){
		row[c] = arr[c];
	}
	return this;
}
Matrix.prototype.dropLastRow = function(){
	this._rows.pop();
	this._rowCount--;
	return this;
}
Matrix.prototype.dropLastCol = function(){
	var r, rows;
	for(r=0; r<rows; ++c){
		this._rows[r].pop();
	}
	this._colCount--;
	return this;
}
// ------------------------------------------------------------------------------------------------------------------------ FXN
Matrix.prototype.swapRows = function(rowA,rowB){
	var temp = this._rows[rowB];
	this._rows[rowB] = this._rows[rowA];
	this._rows[rowA] = temp;
	return this;
}
Matrix.prototype.copySizeXXX = function(m){
	if(m!==undefined){
		this._init(m.rows(),m.cols());
	}else{
		var j,i, row=this._rowCount, col=this._colCount;
		m = new Matrix(row,col);
		m.copySize(this);
		return m;
	}
}
Matrix.prototype.copy = function(m){ // this = m || return copy
	if(m!==undefined){
		this._init(m.rows(),m.cols());
		var i, j, row = this._rowCount, col = this._colCount;
		for(j=0;j<row;++j){
			for(i=0;i<col;++i){
				this._rows[j][i] = m._rows[j][i];
			}
		}
		return this;
	}else{
		var j,i, row=this._rowCount, col=this._colCount;
		m = new Matrix(row,col);
		m.copy(this);
		return m;
	}
}
Matrix.prototype.kill = function(){
	//
}
Matrix.prototype.cleanCheck = function(exp){
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	for(j=0;j<=rowm1;++j){
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			if(isNaN(num)||num===undefined){
				//throw "found: "+num;
				this._rows[j][i] = 0.0;
			}
		}
	}
}
Matrix.prototype.cleanAlert = function(exp){
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	for(j=0;j<=rowm1;++j){
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			if(isNaN(num)||num===undefined){
				throw "found: "+num;
			}
		}
	}
}

Matrix.prototype.toString = function(exp){
	return Code.array2DtoString(this._rows, exp);
}

Matrix._transformTemp2D = new Matrix(3,3);
Matrix.transform2DIdentity = function(){
	return new Matrix(3,3).identity();
}
/*
Matrix.transform2DTranslate = function(a,tX,tY){
	var b = Matrix._transformTemp2D.fromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
*/
// Matrix.transform2DScale = function(a,sX,sY){
// 	throw "this should only scale the translational components?"
// 	sY = sY!==undefined?sY:sX;
// 	var b = Matrix._transformTemp2D.fromArray([sX,0.0,0.0, 0.0,sY,0.0, 0.0,0.0,1.0]);
// 	return Matrix.mult(b,a);
// }
Matrix.transform2DScalePoints = function(a,sX,sY){
	sY = sY!==undefined?sY:sX;
	var b = Matrix._transformTemp2D.fromArray([sX,0.0,0.0, 0.0,sY,0.0, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
/*
Matrix.transform2DRotate = function(a,ang){
	var b = Matrix._transformTemp2D.fromArray([Math.cos(ang),-Math.sin(ang),0.0, Math.sin(ang),Math.cos(ang),0.0, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
*/
Matrix.transform2DSkewX = function(a,ang, isAngle){ // give an angle
	if(isAngle){
		ang = Math.tan(ang);
	}
	var b = Matrix._transformTemp2D.fromArray([1.0,ang,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform2DSkewY = function(a,ang, isAngle){ // give an angle
	if(isAngle){
		ang = Math.tan(ang);
	}
	var b = Matrix._transformTemp2D.fromArray([1.0,0.0,0.0, ang,1.0,0.0, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.angle2D = function(a){
	var x = new V2D(1,0);
	var v = a.multV2DtoV2D(new V2D(), x);
	if(v.length()>0){
		return V2D.angleDirection(x,v);
	}
	return 0.0;
}
Matrix.scale2D = function(a){
	var x = new V2D(1,0);
	var v = a.multV2DtoV2D(new V2D(), x);
	var len = v.length();
	if(len>0){
		return len/x.length();
	}
	return 0.0;
}




Matrix.prototype.transform3DTranslate = function(){
	throw "..."
}

//
Matrix._transformTemp3D = new Matrix(4,4);
Matrix.transform3DTranslate = function(a,tX,tY,tZ){
	if(tZ===undefined){
		tZ = tX.z;
		tY = tX.y;
		tX = tX.x;
	}
	var b = Matrix._transformTemp3D.fromArray([1.0,0.0,0.0,tX, 0.0,1.0,0.0,tY, 0.0,0.0,1.0,tZ, 0.0,0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform3DScaleMatrix = function(a,scale){ // scale a metric matrix === scale translation
	var b = a.copy();
	var tX = b.get(0,3);
	var tY = b.get(1,3);
	var tZ = b.get(2,3);
	b.setColFromArray(3,[tX,tY,tZ,1]);
	return b;
	// sY = sY!==undefined?sY:sX;
	// sZ = sZ!==undefined?sZ:sY;
	// var b = Matrix._transformTemp3D.fromArray([sX,0.0,0.0,0.0, 0.0,sY,0.0,0.0, 0.0,0.0,sZ,0.0, 0.0,0.0,0.0,1.0]);
	// return Matrix.mult(b,a);
}
Matrix.transform3DRotateX = function(a,angle){
	var c = Math.cos(angle), s = Math.sin(angle);
	var b = Matrix._transformTemp3D.fromArray([1.0,0.0,0.0,0.0, 0.0,c,-s,0.0, 0.0,s,c,0.0, 0.0,0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform3DRotateY = function(a,angle){
	var c = Math.cos(angle), s = Math.sin(angle);
	var b = Matrix._transformTemp3D.fromArray([c,0.0,s,0.0, 0.0,1.0,0.0,0.0, -s,0.0,c,0.0, 0.0,0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform3DRotateZ = function(a,angle){
	var c = Math.cos(angle), s = Math.sin(angle);
	var b = Matrix._transformTemp3D.fromArray([c,-s,0.0,0.0, s,c,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform3DScalePoints = function(a,x,y,z){ // this moves the origin - tx,ty,yz
	if(y===undefined){
		y = x;
	}
	if(z===undefined){
		z = x;
	}
	var b = Matrix._transformTemp3D.fromArray([x,0,0.0,0.0, 0,y,0.0,0.0, 0.0,0.0,z,0, 0.0,0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix._transformTemp2D = new Matrix(3,3);
Matrix.transform2DRotate = function(a,angle){
	var c = Math.cos(angle), s = Math.sin(angle);
	var b = Matrix._transformTemp2D.fromArray([c,-s,0.0, s,c,0.0, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}
Matrix.transform2DTranslate = function(a,tX,tY){
	if(tY===undefined){
		tY = tX.y;
		tX = tX.x;
	}
	// console.log(tX+","+tY)
	var b = Matrix._transformTemp2D.fromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	return Matrix.mult(b,a);
}

Matrix.transform3DRotate = function(a,v,t){ // vector, theta
	var c = Math.cos(t), s = Math.sin(t);

	var x = v.x, y = v.y, z = v.z;
	var xx = x*x, yy = y*y, zz = z*z;
	var xy = x*y, xz = x*z, yz = y*z;
	var o = 1-c;

	var b = Matrix._transformTemp3D.fromArray(
		[   xx*o +   c, xy*o - z*s, xz*o + y*s, 0,
			xy*o + z*s, yy*o +   c, yz*o - x*s, 0,
			xz*o - y*s, yz*o + x*s, zz*o +   c, 0,
			0, 0, 0, 1]);

	return Matrix.mult(b,a);
}


Matrix.prototype.orientation3D = function(){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	var o = new V3D(0,0,0);
	// var matrix = ;
	x = this.multV3DtoV3D(x); // rotation offset
	y = this.multV3DtoV3D(y);
	z = this.multV3DtoV3D(z);
	o = this.multV3DtoV3D(o);
	x.sub(o); // translation offset
	y.sub(o);
	z.sub(o);
	x.norm(); // scale offset
	y.norm();
	z.norm();
	return {"x":x,"y":y,"z":z,"o":o};
}
/*
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
*/

//
Matrix.crossMatrixFromV3D = function(min,vin){ // v*M(u) = v x u      (skew symmetric)
	var v = vin, m = min;
	if(vin===undefined){
		v = min;
		m = new Matrix(3,3);
	}
	m.fromArray([0,-v.z,v.y, v.z,0,-v.x, -v.y,v.x,0]);
	return m;
}
// ------------------------------------------------------------------------------------------------------------------------ STATS
Matrix.matrixFromVectors = function(array){ //
	var i, j;
	var cols = array.length;
	var rows = array[0].cols();
	var m = new Matrix();
	for(i=0;i<N;++i){
		//
	}
	return m;
}
Matrix.zeroMeanMatrix = function(matrix){
	var N = matrix.cols();
	var center = new Array(N);
	// center[i] += [j][i]
	center = center/N;
	// ... subtract center
}
Matrix.square = function(c,a){ // dot
	// multiplication assuming a * a^T
	// ...
	return c;
}
Matrix.dot = function(a,b){ // c = SUM(a.*b)
	var i, j, sum = 0;
	var cols = Math.min(a.cols(),b.cols());
	var rows = Math.min(a.rows(),b.rows());
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			sum += a._rows[j][i] * b._rows[j][i];
		}
	}
	return sum;
}
Matrix.covarianceMatrix = function(matrix){
	matrix = Matrix.zeroMeanMatrix(matrix);
	var n = matrix.rows();
	var cov = Matrix.square(matrix); // dot
	var N = n-1;
	cov = cov / N;
	//var cov = new Matrix(n);
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE MATHS
Matrix.prototype.multV2DtoV2D = function(out, inn){
	if(!inn){ inn = out; out = new V2D(); }
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	out.y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.x = x;
	return out;
}
Matrix.prototype.multV2DtoV3D = function(out, inn){
	if(!inn){ inn = out; out = new V3D(); }
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	var y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.z = this._rows[2][0]*inn.x + this._rows[2][1]*inn.y + this._rows[2][2];
	out.x = x; out.y = y;
	return out;
}
Matrix.prototype.multV3DtoV3D = function(out, inn){
	if(!inn){ inn = out; out = new V3D(); }
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2]*inn.z + (this._rows[0].length<4?0:this._rows[0][3]);
	var y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2]*inn.z + (this._rows[1].length<4?0:this._rows[1][3]);
	out.z = this._rows[2][0]*inn.x + this._rows[2][1]*inn.y + this._rows[2][2]*inn.z + (this._rows[2].length<4?0:this._rows[2][3]);
	out.x = x; out.y = y;
	return out;
}
Matrix.prototype.offset = function(c){
	var row, rows = this._rowCount, cols = this._colCount;
	var i, j;
	for(j=0;j<rows;++j){
		row = this._rows[j];
		for(i=0;i<cols;++i){
			row[i] = row[i] + c;
		}
	}
	return this;
}
Matrix.prototype.getNorm = function(){
	return Matrix.norm2D(this);
}
Matrix.prototype.normalize = function(){
	var len = Matrix.norm2D(this);
	if(len!=0){
		len = 1.0/len;
	}
	this.scale(len);
	return this;
}
Matrix.prototype.transform3DLocation = function(location){
	var rows = this._rows;
	if(!location){
		location = new V3D();
	}
	location.set(rows[0][3], rows[1][3], rows[2][3]);
	return location;
}
Matrix.prototype.transform3DSetLocation = function(v,u,w){
	var rows = this._rows;
	if(u===undefined){
		rows[0][3] = v.x;
		rows[1][3] = v.y;
		rows[2][3] = v.z;
	}else{
		rows[0][3] = v;
		rows[1][3] = u;
		rows[2][3] = w;
	}
}
Matrix.prototype.transform2DLocation = function(){
	var location = this.multV2DtoV2D(new V2D(0,0));
	// var rows = this._rows;
	// var location = new V2D(rows[0][2], rows[1][2]);
	return location;
}
Matrix.prototype.transform2DRotation = function(){
	var rows = this._rows;
	var a = rows[0][0];
	var b = rows[0][1];
	var c = rows[1][0];
	var d = rows[1][1];
		var v = new V2D();
		v.set(a, c);
		var angleX = V2D.angleDirection(V2D.DIRX,v);
// return angleX;
		v.set(b, d);
		var angleY = V2D.angleDirection(V2D.DIRY,v);
	var angle = Code.averageAngles([angleX,angleY]);
	return angle;
}
Matrix.prototype.transform3DRotation = function(){
	return this.getSubMatrix(0,0, 3,3);
}

Matrix.relativeWorld = function(relAB,absA,absB){ // where B is relative to A in world reference frame
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix();
	}
	var invA = Matrix.inverse(absA);
	Matrix.mult(relAB, absB, invA);
	return relAB;
}
Matrix.relativeReference = function(relAB,absA,absB){ // where B is in A's reference frame
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix();
	}
	var invA = Matrix.inverse(absA);
	Matrix.mult(relAB, invA, absB);
	return relAB;
}
// ------------------------------------------------------------------------------------------------------------------------ CLASS
/*
RREF:

for each col
	for each row below pivot row
		c = first-cell / pivot-cell
		for each col at and left of pivot col
			cell = cell - c * pivot[pivotRow,col]





*/
// ------------------------------------------------------------------------------------------------------------------------ MATHS
Matrix.epsilon = 1.0E-15;
Matrix.isZero = function(num){
	return Math.abs(num)<Matrix.epsilon;
}
// assumes all sizes have been set beforehand
Matrix.transpose = function(B, Ain){ // B = A^T
	var A = Ain, C = Matrix._temp;
	if(Ain===undefined){ A = B; }
	var i, j, temp, row = A._rowCount, col = A._colCount;
	C.setSize(col,row);
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			C._rows[i][j] = A._rows[j][i];
		}
	}
	if(Ain==undefined){ return C.copy(); }
	B.copy(C);
	return B;
}
Matrix.prototype.transposeSquare = function(){ // transpose self .. only valid if square
	var i, j, temp, row = this._rowCount, col = this._colCount;
	var rows = this._rows;
	var cols = this._rows;
	for(j=0;j<row;++j){
		for(i=j+1;i<col;++i){
			rows[i][j] = rows[j][i];
		}
	}
	return this;
}
Matrix.augment = function(A,B){
	var rowsA = A._rowCount, rowsB = B._rowCount, colsA = A._colCount, colsB = B._colCount;
	var i, j, temp, row = Math.max(rowsA,rowsB), col = colsA+colsB;
	var C = new Matrix(row,col);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsA;++i){
			C._rows[j][i] = A._rows[j][i];
		}
	}
	for(j=0;j<rowsB;++j){
		for(i=0;i<colsB;++i){
			C._rows[j][i+colsA] = B._rows[j][i];
		}
	}
	return C;
}
Matrix.RREF = function(B, A){ // B = rowReducedEchelonForm(A)
	if(A!==undefined){
		if(B!=A){ B.copy(A); }
	}else{
		B = B.copy();
	}
	var i, j, jm1, row = B._rowCount, col = B._colCount;
	var thi, pre, nex, c;
	var pivotRow, pivotCol, pivotCell;
var det = 1.0;
	for(pivotCol=0,pivotRow=0;pivotCol<col&&pivotRow<row;++pivotCol){ // ,++pivotRow
		for(j=pivotRow;j<row;++j){ // swap rows so first pivot-row entry is not zero
			if( Math.abs(B._rows[j][pivotCol]) > Matrix.epsilon ){ //
				if(j>pivotRow){
					B.swapRows(j,pivotRow);
det *= -1; // row swapping
				}
				pivotCell = B._rows[pivotRow][pivotCol];
				for(j=pivotRow+1;j<row;++j){ //
					c = B._rows[j][pivotCol]/pivotCell;
					//if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							B._rows[j][i] -= c*B._rows[pivotRow][i];
						}
					//}
				}
				for(j=0;j<row;++j){ // zero all entries in pivot column
					c = B._rows[j][pivotCol]/pivotCell;
					//if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							if(j!=pivotRow){
								B._rows[j][i] -= c*B._rows[pivotRow][i];
							}
						}
					//}
				}
if(pivotCol<col){
	det *= pivotCell; // multiplying row
}
				for(i=pivotCol;i<col;++i){ // scale pivot-row to first-entry = 1 => /pivotCell
					B._rows[pivotRow][i] /= pivotCell;
				}
				++pivotRow;
				break;
			}
		}
		// console.log("B:"+pivotCol);
		// console.log(B.toString());
		// console.log("");
	}
//console.log("DETERMINANT: "+det)
	return B;
}
Matrix.RREF2 = function(B, A){ // B = rowReducedEchelonForm(A)
	if(A!==undefined){
		if(B!=A){ B.copy(A); }
	}else{
		B = B.copy();
	}
	var i, j, jm1, row = B._rowCount, col = B._colCount;
	var thi, pre, nex, c;
	var pivotRow, pivotCol, pivotCell;

var det = 1.0;
	for(pivotCol=0,pivotRow=0;pivotCol<col&&pivotRow<row;++pivotCol){ // ,++pivotRow
		for(j=pivotRow;j<row;++j){ // swap rows so first pivot-row entry is not zero
			if( Math.abs(B._rows[j][pivotCol]) > Matrix.epsilon ){ //
				if(j>pivotRow){
					B.swapRows(j,pivotRow);
det *= -1; // row swapping
				}
				pivotCell = B._rows[pivotRow][pivotCol];
				for(j=pivotRow+1;j<row;++j){ //
					c = B._rows[j][pivotCol]/pivotCell;
					if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							B._rows[j][i] -= c*B._rows[pivotRow][i];
						}
					}
				}
				for(j=0;j<row;++j){ // zero all entries in pivot column
					c = B._rows[j][pivotCol]/pivotCell;
					if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							if(j!=pivotRow){
								B._rows[j][i] -= c*B._rows[pivotRow][i];
							}
						}
					}
				}
if(false){ // do this for RREF, don't do for REF=lambda
if(pivotCol<col){
	det *= pivotCell; // multiplying row
}
				for(i=pivotCol;i<col;++i){ // scale pivot-row to first-entry = 1 => /pivotCell
					B._rows[pivotRow][i] /= pivotCell;
				}
}
				++pivotRow;
				break;
			}
		}
	}
//console.log("DETERMINANT: "+det)
	return B;
}
Matrix.backPropagate = function(A,b){ // A*b = b0 => start with bottom-most variables, and solve upward
	// assumes A is nxn upper triangular
	var i, j, val, rows = A.rows(), cols = A.cols();
	for(i=cols-1;i>=0;--i){
		val = b._rows[i][0];
		for(j=rows-1;j>i;--j){
			//console.log("["+i+"]["+j+"] = "+ A._rows[i][j]);
			val -= A._rows[i][j] * b._rows[j][0];
		}
		if( Math.abs(A._rows[i][j]) > Matrix.epsilon ){
			val /= A._rows[i][j]; // pivot if not 1.0 ...
		}
		b._rows[i][0] = val;
	}
	return b;
}
Matrix.norm0D = function(A){ // max
	var rows = A.rows(), cols = A.cols(), u, t;
	var i, n = 0;
	for(j=0;j<rows;++j){
		row = A._rows[j];
		for(i=0;i<cols;++i){
			x = row[i];
			throw "MAX VALUE";
		}
	}
	return n;
}
Matrix.norm1D = function(A){ // L1
	var rows = A.rows(), cols = A.cols(), u, t;
	var i, n = 0;
	for(j=0;j<rows;++j){
		row = A._rows[j];
		for(i=0;i<cols;++i){
			x = row[i];
			n += Math.abs(x);
		}
	}
	return n;
}

Matrix.norm2D = function(A){ // L2 = frobenius
	var rows = A.rows(), cols = A.cols(), u, t;
	var i, n = 0;
	for(j=0;j<rows;++j){
		row = A._rows[j];
		for(i=0;i<cols;++i){
			x = row[i];
			n += x*x;
		}
	}
	//console.log("N: "+n+" "+Math.sqrt(n))
	return Math.sqrt(n);
}
Matrix.normInfinite = function(x){ // x is a vector
	var rows = x.rows(), cols = x.cols(), u, t;
	var max = x.get(0,0);
	var maxAbs = Math.abs(max);
	var i, len = Math.max(rows,cols);
	if(rows>cols){ // vertical
		for(i=0;i<len;++i){
			u = x.get(i,0); t = Math.abs(u);
			if(t>maxAbs){
				max = u; maxAbs = t;
			}
		}
	}else{ // horizontal
		for(i=0;i<len;++i){
			u = x.get(0,i); t = Math.abs(u);
			if(t>maxAbs){
				max = u; maxAbs = t;
			}
		}
	}
	return maxAbs; // return max;
}
// Matrix.inverse = function(reuseMatrix,inputMatrix){ // assumed square
Matrix.inverse = function(A){ 
	// var A = inputMatrix;
	// if(!A){
	// 	// throw "not sure how to reuse?"
	// 	A = reuseMatrix;
	// 	reuseMatrix = new Matrix(A._rowCount,A._colCount);
	// }
	//return new Matrix(A.rows(),A.cols()).fromArrayMatrix( numeric.inv(A._rows) );
	C = Matrix.augment(A,(new Matrix(A._rowCount,A._colCount)).identity());
	Matrix.RREF(C,C);
	B = C.getSubMatrix(0,0, A._rowCount,A._colCount);
	C = C.getSubMatrix(0,A._colCount, A._rowCount,A._colCount);
	if( !B.closeToIdentity() ){
//		console.log("not close")
//		console.log(B.toString())
		//B.dropOutIdentity();
		//return null;
		//console.log(B.toString())
		// console.log(B.toString())
		// console.log(C.toString())
		// C.dropNonIdentity();
		// console.log(C.toString())
	}
	return C;
	// return new Matrix(A.rows(),A.cols()).fromArrayMatrix( numeric.inv(A._rows) );
}
// RIGHT INVERSE n<=m: A^T[(A*A^T)^-1]
// LEFT INVERSE m<=n: [(A^T*A)^-1]A^T
Matrix.pseudoInverse = function(cin, ain){
	return Matrix.pseudoInverseSVD(cin,ain);
}
Matrix.pseudoInverseSimple = function(cin, ain){ // c = aa^at non-square
	var a = ain;
	if(ain===undefined){
		a = cin;
	}
	var at = Matrix.transpose(a);
	var c = Matrix.mult(at,a);
	c = Matrix.inverse(c);
	c = Matrix.mult(c,at);
	return cin.copy(c);
}
Matrix.pseudoInverseSVD = function(cin, ain){ // c = aa^at non-square
	var a = ain;
	if(ain===undefined){
		a = cin;
	}
	var SVD = Matrix.SVD(a);
	var U = SVD.U;
	var S = SVD.S;
	var V = SVD.V;
	var i, num, len = Math.min(U.rows(),V.cols());
	for(i=0;i<len;++i){
		num = S.get(i,i);
		if(num>Matrix.epsilon){
			S.set(i,i, 1/num);
		}
	}
	V = Matrix.transpose(V)
	c = Matrix.mult(U,S);
	c = Matrix.mult(c,V);
	if(ain===undefined){
		return c;
	}
	return cin.copy(c);
}
Matrix.solve = function(A,b){ // Ax = b => solve for x
	return Matrix.mult(Matrix.pseudoInverse(A), b);
}
Matrix.nullSpace = function(A){ // nul(A)

}
// Matrix.eigenValuesAndVectors = function(A){
// 	var values = new Array(), vectors = new Array();
// 	var arr = new Array(values,vectors);
// 	var rows = A.rows(), cols = A.cols();
// 	//
// 	var x = new Matrix(cols,1), y = new Matrix(cols,1);
// 	var i, len=15, temp, lambda, p, convergence;
// 	x.set(0,0, 1);
// 	p = Matrix.normInfinite(x);
// 	lambda = x.get(0,0);
// 	convergence = lambda;
// 	for(i=0;i<len;++i){
// convergence = lambda;
// 		console.log( i+"  "+Matrix.transpose(x).toString() + " | " + lambda );//+ " | " + p );
// 		Matrix.mult(y, A,x);
// 		p = Matrix.normInfinite(x); // this is suppossed to be an index, not a value
// 		lambda = -p;
// 		temp = x; x = y; y = temp;
// 		x.scale(1.0/p);
// convergence -= lambda;
// 		if( Math.abs(convergence/lambda) < 1E-6 ){
// 			break;
// 		}
// 	}
// 	values.push(lambda);
// 	vectors.push( x.scale(1.0/p) );
// 	return arr;
// }
Matrix.upperHessenberg = function(A){
var me = A;
    var s = numeric.dim(A);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
    for(j=0;j<m-2;j++) {
        x = Array(m-j-1);
        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
        if(numeric.norm2(x)>0) {
            v = numeric.house(x);
            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
            B = Array(m-j-1);
            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    return {H:A, Q:Q};
}
Matrix.eigenValues = function(A){ // eigenValues[]
	return Matrix.eigenValuesAndVectors(A).values;
	/*var arr = new Array();
	// upper hessian
	// QR
	return arr;*/
}
Matrix.eigenVectorsFromValues = function(A,values){ // eigenVectors[ [] ]
	/*
	// solve equation given lambdas
	var i, j, k, len = values.length;
	var lambda, vector, repeated, rows = A.rows(), cols = A.cols();
	var vectors = new Array();
	var AI = new Matrix(rows,cols);
	for(k=0;k<len;++k){ // for each eigenvalue
		lambda = values[k]; // ignore repeated value, because the vector should have been discovered in the previous iteration(s) ?????
		repeated = 0;
		for(i=0;i<k;++i){
			if(values[i]==lambda){
				++repeated;
				console.log("REPEATED");
			}
		}
		for(j=0;j<rows;++j){ // A - lambda*I
			for(i=0;i<cols;++i){
				AI._rows[j][i] = A._rows[j][i];
				if(i==j){
					 AI._rows[j][i] -= lambda;
				}
			}
		}
		console.log("--------------------------------------------------------------------------------------------------");
		//console.log( AI.toString() );
		AI = Matrix.RREF(AI);
		vector = new Matrix(rows,1);
		// do this once for every zero row
		vector.set(rows-1-repeated,0, 1.0); //  this assumes only one value to set - wont work for repeated eigenvalues`
		// http://tutorial.math.lamar.edu/Classes/DE/RepeatedEigenvalues.aspx
		Matrix.backPropagate(AI,vector);
		vector.normalize();
		console.log( AI.toString() );
		console.log( vector.toString() );
		// vectors.push();
	}
	return vectors;
	*/
	return null;
}
Matrix.eigenVectors = function(A){
	return Matrix.eigenValuesAndVectors(A).vectors;
	/*
	return Matrix.eigenVectorsFromValues(A, Matrix.eigenValues(A));
	*/
}
Matrix.toQuaternion = function(){
	return Code.rotationMatrixToQuaternion(this.get(0,0),this.get(0,1),this.get(0,2), this.get(1,0),this.get(1,1),this.get(1,2), this.get(2,0),this.get(2,1),this.get(2,2));
}
Matrix.eigenValuesAndVectors = function(A){
	var maxIterations = 10000;
	//  maxiter = 10000;
	var x = null;
	try{
		// maxIterations *= 10;
		maxIterations = 1000;
		x = numeric.eig(A._rows, maxIterations); // these aren't necessarily ordered
	}catch(e){
		console.log("eig error -- is this because there are repeated values?");
		return null;
		throw "e";
	}
	var values = x.lambda.x;
	var vectors = x.E.x;
	var vects = new Array();
	//console.log(vectors);
	//console.log( numeric.prettyPrint(vectors) );
	var i, j;
	var rows = vectors.length;
	var cols = vectors[0].length;
	for(i=0; i<cols; ++i){
		vects[i] = new Matrix(rows,1);
		for(j=0; j<rows; ++j){
			vects[i].set(j,0, vectors[j][i]);
		}
	}
	// for(var i = vectors.length; i--;){
	// 	//vectors[i] = new Matrix(1,vectors.length).fromArray(vectors[i]);
	// }
	return {values:values, vectors:vects};
	/*
	var values = Matrix.eigenValues(A);
	var vectors = Matrix.eigenVectorsFromValues(A,values);
	return [values, vectors];
	*/
}
Matrix.trace = function(){ //
	// = sum of main diagonals
}
Matrix.SVD = function(A){ // A = UEV^t  //  Amxn = Umxm * Smxn * Vnxn
	if(!A){return null;}
if(A.rows()<A.cols()){
return Matrix.nonShittySVD(A);
}
	var val = numeric.svd(A._rows);
	var U = new Matrix(A.rows(),A.rows()).fromArrayMatrix(val.U);
	var S = new Matrix(A.rows(),A.cols()).zero().setDiagonalsFromArray(val.S);
	var V = new Matrix(A.cols(),A.cols()).fromArrayMatrix(val.V);
	U.cleanCheck();
	S.cleanCheck();
	V.cleanCheck();
	return {U:U, S:S, V:V};
	// REQUIRES FINDING EIGEN VECTORS
	// ui of U = kth singular value =
	// s1 >= s2 >= s3 >= .. sn/m
	//
	//
}
Matrix.QR2 = function(){ // A = Q * R : Q=orhtogonal, R-upper-right
	/*
	for each min(row,col):
		for each next row:

	*/
}



// numeric.QRFrancis
Matrix.QRCore = function(){ //
// Q = normal basis for col(A)
// Q^t * A = R
	// gram-schmidt process (less precise - and time)
	// OR householder (more precise - and time)

}
Matrix.QR_X = function(A){ // rows >= cols
	var rowsA = A.rows(), colsA = A.cols();
	var i, j, k, t;
	var maxT = Math.min(rowsA-1,colsA);
	var Q = new Matrix(rowsA,rowsA); // orthogonal - basis for A cols
	var R = new Matrix(rowsA,colsA); // upper triangular
	for(t=0;t<maxT;++t){
		//
	}
	// Q = Q1' * Q2' * ... * Qt'
	// R = Qt * ... * Q2 * Q1 = Q' * A
}
Matrix.QRP = function(A){ // (nearly) rank defecit
	return null;
}
Matrix.houseHolder = function(A){
	// reflect = x - 2*dot(x,v)*v
	//
}
Matrix.eig = function(A){
	// upper hessenberg(tri-diagonal)
	// QR factorize
		// householder
	// eigenvalues
	// nulspace
		// eigenvectors = nul(A - l*I)  && multiplicity=orthogonality
}


Matrix.QR = function(A){ // rows >= cols
	// console.log("A:\n"+A);
	// var H = A._rows;
	// var maxiter = 100*Math.max(A.rows(),A.cols());
	// var result = numeric.QRFrancis(H,maxiter); // Q & B ?
	// console.log(result);
if(rows!=cols){
	throw "only tested on square";
}
	// col vectors of A
	var cols = A.cols();
	var rows = A.rows();
	var vA = [];
	for(var i=0; i<cols; ++i){
		var vi = [];
		for(var j=0; j<rows; ++j){
			var val = A.get(j,i);
			vi.push(val);
		}
		vA.push(vi);
	}
	// console.log("vA");
	// console.log(vA);
	// generate e & u
	var vE = [];
	var temp = Code.newArrayZeros(cols);
	for(var i=0; i<cols; ++i){
		var a = vA[i];
		var u = Code.copyArray(a);
		for(var j=i-1; j>=0; --j){
			var e = vE[j];
			Code.copyArray(temp,e);
			var dot = Code.arrayVectorDot(a,e);
			Code.arrayVectorScale(temp, temp, -dot);
			Code.arrayVectorAdd(u, u, temp);
		}
		var e = Code.arrayVectorNorm(u);
		vE[i] = e;
	}
	// console.log("vE");
	// console.log(vE);
	//
	var Q = new Matrix(rows,cols);
	var R = new Matrix(cols,cols);
	// fill in Q & R
	for(var i=0; i<cols; ++i){
		Q.setColFromArray(i, vE[i]);
		for(var j=0; j<=i; ++j){
			var dot = Code.arrayVectorDot(vA[i],vE[j]);
			R.set(j,i, dot);
		}
	}

	return {"Q":Q, "R":R};
}
Matrix.testQR = function(A){
	var array = [0.2024762331246806,0.06186589737573585,0.19244678642487287,0.10872647124413526,0.02654663754415456,0.15445787514938691,0.0001633288623069729,0.00005235182094319139,0.000146795657198133];
	var H = new Matrix(3,3).fromArray(array);
	console.log("A:\n"+H);

	var QR = Matrix.QR(H);
	console.log(QR);
	var Q = QR["Q"];
	var R = QR["R"];
	console.log(Q);
	console.log(R);


	console.log("Q:\n"+Q);
	console.log("R:\n"+R);

	var B = Matrix.mult(Q,R);
	console.log("B:\n"+B);

	var Qinv = Matrix.transpose(Q);
	var QQ = Matrix.mult(Qinv,Q);
	console.log("QQ:\n"+QQ);


	console.log("NOW CAMERA ....... ...");


	var H = new Matrix(3,3).fromArray(array);
	var Hinv = Matrix.inverse(H);
	var QR = Matrix.QR(Hinv);
	var Rinv = QR["Q"]; // orthonormal
	var Kinv = QR["R"]; // upper-right triangular

	var K = Matrix.inverse(Kinv);
	var R = Matrix.inverse(Rinv);
console.log(K.get(2,2));
	K.scale(K.get(2,2)); // normalize
	console.log("K:\n"+K);
	console.log("R:\n"+R);
	Kinv = Matrix.inverse(K);
	
	var Rpi = new Matrix(3,3).fromArray([-1,0,0, 0,-1,0, 0,0,1]);
	// get 'negative' elements
	K = Matrix.mult(K,Rpi);
	console.log("K:\n"+K);
	R = Matrix.mult(Rpi, R);
	console.log("R:\n"+R);


	console.log("Kinv:\n"+Kinv);

	var t = 0;
	console.log("t:\n"+t);


	console.log("NOW K ...");



	throw "?";

}







Matrix.nonShittySVD = function(A){
	var rows = A.rows(), cols = A.cols();
/*
V = eigenvectors of A^t * A (right singular vectors)
S = eigenvalues  of A^t * A
U = V*vi
*/
/*
	var At = Matrix.transpose(A);
	var AA = Matrix.mult(At,A);
console.log(A.toString());
console.log(At.toString());
console.log(AA.toString());
	var U = new Matrix(rows,rows);
	var S = new Matrix(rows,cols);
	var V = new Matrix(cols,cols);
	return {U:U, S:S, V:V};
*/
// current lazy solution:
	if(rows<cols){
		var r = rows, c = cols;
		var A_ = A.copy();
		while(rows<cols){
			A.setRowFromArray(rows, Code.newArrayZeros(cols));
			++rows;
		}
		var svd = Matrix.SVD(A);
// console.log("\n");
// console.log(svd.U.toString());
// console.log("\n");
// console.log(svd.S.toString());
// console.log("\n");
// console.log(svd.V.toString());

		while(r<rows){
			A.dropLastRow();
			svd.U.dropLastRow();
			svd.U.dropLastCol();
			svd.S.dropLastRow();
			++r;
		}
		return svd;
	}else{
		return Matrix.SVD(A);
	}
}
Matrix.fromSVD = function(U,S,V){ // USV
	return Matrix.mult(U, Matrix.mult(S,Matrix.transpose(V)) );
}
Matrix.LU = function(P,L,U, A, pivot){ // [P,L,U] = A : LU Decomposition (Factorization)
	/*
	P = pivot matrix (if necessary) - [0,1,2,..,n]
	L = lower left [nxm]
	U = upper right, 1 diagonals [mxn]

	li1 = ai1
		lij = aij/li1

	if a pivot is ~0, then row interchange must be done
	*/
}
Matrix.outerV3D = function(u,v){
	var u = [u.x,u.y,u.z];
	var v = [v.x,v.y,v.z];
	return Matrix.outerArrays(u,v);
}
Matrix.outerArrays = function(M,u,v){
	if(v==undefined){ // reuse M
		v = u;
		u = M;
		M = new Matrix(rows,cols);
	}
	var rows = u.length;
	var cols = v.length;
	for(var j=0; j<rows; ++j){
		for(var i=0; i<cols; ++i){
			var value = u[j]*v[i];
			M.set(j,i, value);
		}
	}
	return M;
}
Matrix.mult = function(r, ain,bin){ // c = a*b
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
	var i,j,k, v, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			v = 0;
			for(k=0;k<colsA;++k){ // rowsB
				v += a._rows[j][k]*b._rows[k][i];
			}
			c._rows[j][i] = v;
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
	return r;
}
Matrix.add = function(r, ain,bin){ // c = a + b
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
	var i,j, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			c._rows[j][i] = a._rows[j][i] + b._rows[j][i];
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
	return r;
}
Matrix.sub = function(r, ain,bin){ // c = a - b
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
	var i,j, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			c._rows[j][i] = a._rows[j][i] - b._rows[j][i];
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
	return r;
}
Matrix.abs = function(a,b){ // a = abs(b)
	if(b===undefined){
		b = a;
		a = a.copy();
	}
	var i,j, rows=a._rowCount, cols=a._colCount;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			a._rows[j][i] = Math.abs(b._rows[j][i]);
		}
	}
	return a;
}

Matrix.cp2tform = function(c, a){ // control points to transform - projective 3D transform
	//
}
Matrix._temp = new Matrix(1,1);


Matrix.getFundamentalMatrix = function(normPointsA, normPointsB){ // x^T * F * x = 0 | [a b c; d e f; g h i]
	var len = fromPoints.length;
	var matA = new Matrix(2*len,8);
	var matB = new Matrix(2*len,1);
	var mat = new Matrix(3,3);
	// force rank 2
	return mat;
}

Matrix.get2DProjectiveMatrix = function(fromPoints, toPoints, output, matA, matB){
	var i, fr, to;
	var len = fromPoints.length;
	if(matA===undefined || matA===null){
		matA = new Matrix(2*len,8);
	}
	if(matB===undefined || matB===null){
		matB = new Matrix(2*len,1);
	}
	for(i=len-1;i>=0;--i){
		fr = fromPoints[i];
		to = toPoints[i];
		var i2 = i*2;
		var i21 = i2 + 1;
		matA.set(i2, 0,  fr.x);
		matA.set(i2, 1,  fr.y);
		matA.set(i2, 2,  1);
		matA.set(i2, 3,  0);
		matA.set(i2, 4,  0);
		matA.set(i2, 5,  0);
		matA.set(i2, 6,  -fr.x*to.x);
		matA.set(i2, 7,  -fr.y*to.x);
		matA.set(i21,0, 0);
		matA.set(i21,1, 0);
		matA.set(i21,2, 0);
		matA.set(i21,3, fr.x);
		matA.set(i21,4, fr.y);
		matA.set(i21,5, 1);
		matA.set(i21,6, -fr.x*to.y);
		matA.set(i21,7, -fr.y*to.y);
		matB.set(i2 ,0, to.x);
		matB.set(i21,0, to.y);
	}
	//var x = Matrix.solve(matA,matB);
	var x = Matrix.mult(Matrix.pseudoInverseSimple(matA), matB); //
	if(output===undefined){
		output = new Matrix(3,3);
	}
	var projection = output.fromArray([x.get(0,0),x.get(1,0),x.get(2,0), x.get(3,0),x.get(4,0),x.get(5,0), x.get(6,0),x.get(7,0),1.0]); // could also normalize?
	return projection;
}


Matrix.choleskyDecomposition = function(A){ // A = L*L^t
	var i, j, k, sum, piv, rows = A.rows();
	var L = new Matrix(rows,rows);
	for(i=0;i<rows;++i){
		for(j=i;j<rows;++j){
			sum = 0.0;
			for(k=0;k<i;++k){
				sum += L.get(i,k)*L.get(j,k);
			}
			if(i==j){
				piv = Math.sqrt(A.get(i,j) - sum);
				L.set(j,i, piv);
			}else{
				L.set(j,i, (A.get(i,j) - sum)/piv);
			}
		}
	}
	return L;
} // inv(A) = trans(inv(L)) * inv(L)

Matrix.LU = function(A){ // A = L*U
	var rows = A.rows();
	var cols = A.cols();
	var L = new Matrix(rows,rows);
	var U = new Matrix(rows,cols);
	// somebody DO something!
	return {L:L, U:U};
}


Matrix.eigenValuesAndVectors2D = function(a,b,c,d){
	return Code.eigenValuesAndVectors2D(a,b,c,d);
}
Matrix.eigenValues2D = function(a,b,c,d){
	return  Code.eigenValues2D(a,b,c,d);
}
Matrix.eigenVectors2D = function(a,b,c,d){
	return Matrix.eigenValuesAndVectors2D(a,b,c,d).vectors;
}
Matrix.eigen = function(A){ // eigenValues[], eigenVectors[[]]
	var ret = numeric.eig(A._rows);
	var lambda = ret.lambda.x;
	var v = ret.E.x;
	var eigVec = new Array();
	wid = A.rows(); hei = A.cols();
	for(i=0;i<wid;++i){ // col
		eigVec.push(new Array(hei));
		for(j=0;j<hei;++j){ // row
			eigVec[i][j] = v[j][i];
		}
	}
	return [lambda, eigVec];
}

Matrix.power = function(A,power){
	var ret = Matrix.eigen(A);
	var lambda = ret[0];
	var eigVec = ret[1];
	var i, j, k, l, q, r, wid, hei, len;
	wid = A.cols();
	hei = A.rows();
	len = wid*hei;
	var B = new Array(len);
	var b = new Array(len);
	var col;
	for(k=0;k<hei;++k){ // eig
		l = Math.pow(lambda[k],power);
		if(isNaN(l)){ l = Math.pow(-lambda[k],power); } // negative root-powers ... damn
		v = eigVec[k];
		for(i=0;i<hei;++i){ // row
			col = k*wid+i;
			b[col] = new Array();
			b[col][0] = l*v[i];
			B[col] = new Array();
			for(j=0;j<hei;++j){ // row
				for(q=0;q<wid;++q){ // col
					r = j*wid+q;
					B[col][r] = 0.0;
					if(i==j){
						B[col][r] = v[q];
					}
				}
			}
		}
	}
	// convert to matrix problem
	var matB = (new Matrix(len,len)).fromArrayMatrix(B);
	var matb = (new Matrix(len,1)).fromArrayMatrix(b);
	// res = Matrix.mult(Matrix.pseudoInverse(matB), matb);
	res = Matrix.solve(matB,matb);
	var Apow = new Array(hei);
	var index = 0;
	for(i=0;i<hei;++i){
		Apow[i] = new Array(wid);
		for(j=0;j<wid;++j){
			Apow[i][j] = res.get([index],0);
			++index;
		}
	}
	return (new Matrix(A.rows(),A.cols())).fromArrayMatrix(Apow);
}

/*
array -only calculations
*/
Matrix.matrixArrayMultiply = function(A,m,n, B,nn,p){ //
	if(n!=nn){
		return null;
	}
	var i, j, k, v;
	C = Code.newArrayZeros(m*p);
	for(j=0;j<m;++j){ // rowsA
		for(i=0;i<p;++i){ // colsB
			v = 0.0;
			for(k=0;k<n;++k){ // colsA,rowsB
				v += A[j*m+k]*B[k*n+i];
			}
			C[j*m+i] = v;
		}
	}
	return C;
}

Matrix.matrixArrayTranspose = function(A,m,n){ //
	var i, j, C = new Array(m*n);
	for(j=0;j<n;++j){ // rowsC
		for(i=0;i<m;++i){ // colsC
			C[j*n+i] = A[i*m+j];
		}
	}
	return C;
}
Matrix.matrixArrayCholeskyLL = function(A, n){ // A is symmetric positive definite
	var m=n, sum, i, j, k;
	var len = m*n;
	var B = Code.copyArray(A);
	var p = Code.newArrayZeros(m);
	// fill in lower triangle
	for(j=0;j<m;++j){ // row
		for(i=j;i<n;++i){ // col
			sum = B[j*m + i];
			for(k=j-1;k>=0;--k){
				sum -= B[j*m+k]*B[i*m+k];
			}
			if(i==j){
				if(sum<=0.0){ console.log("choleskyLL fail"); return null; }
				p[j] = Math.sqrt(sum);
			}else{
				B[i*m+j] = sum/p[j];
			}
		}
	}
	// fill in pivots and zero upper
	for(j=0;j<m;++j){ // row
		B[j*m + j] = p[j]; // pivot
		for(i=j+1;i<n;++i){ // col
			B[j*m + i] = 0.0; // upper
		}
	}
	delete p; // temp var
	return B;
}

/*Matrix.choleskyBackSub = function(A, n){ // A is symmetric positive definite
	var sum, i, j, k, len = m*n;
	B = new Array(len);
	for(i=1;i<n;++i){
		for(j=1;j<n;++j){
		}
	}
}*/

Matrix.matrixArrayToString = function(A, m,n){
	var i, j, index, num, val, str = "";
	var exp = 4;
	var minLen = exp+7;
	var rowm1 = m-1;
	for(j=0;j<m;++j){ // rows
		for(i=0;i<n;++i){ // cols
			index = j*n + i;
			num = A[index];
			if(num>=0){
				val = " "+num.toExponential(exp);
			}else{
				val = num.toExponential(exp);
			}
			str += Code.padStringLeft(val,minLen," ");
		}
		str += "; ";
		if(j<rowm1){
			str += "\n";
		}
	}
	return str;
}

//.       Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10, false);
Matrix.lmMinimize = function(fxn,args, m, n, xInitial, yFinal, maxIterations, fTolerance, xTolerance, lambdaScaleFlip, epsilon){ // levenberg marquardt nonlinear minimization - reference: lmdif
	// fxn = function to evaluate y && error from a given x
	// m = number of functions
	// n = number of (unknowns) variables (n<=m)
	// x = initial estimate of n variables
	// fvec = fxn(x) at return (length=m)
	// fTolerance = halt if sum-of-squared-errors is less than this
	// xTolerance = halt if relative difference in consecutive solutions is less than this
	// gTol = ...
	// maxIterations = halt if loop is greater or equal to this
	// diag is scaling array length = m
	//
try{
	maxIterations = maxIterations!==undefined?maxIterations:50;
	fTolerance = fTolerance!==undefined?fTolerance:1E-10;
	xTolerance = xTolerance!==undefined?xTolerance:1E-10;
	epsilon = epsilon!=null ? epsilon : 1E-6; // should be on scale of ~min(x)/1E-6
	lambdaScaleFlip = lambdaScaleFlip!==undefined?lambdaScaleFlip:false;

	var i, j;
	var x = new Matrix(n,1).fromArray(xInitial);
	var xTemp = new Matrix(n,1);
	var dx = new Matrix(n,1);
	var y = new Matrix(m,1);
	var yTemp = new Matrix(m,1);
	var dy = new Matrix(m,1);
	var error = new Matrix(m,1);
	var jacobian = new Matrix(m,n);
	var L = new Matrix(n,n);
	var errorPrev = -1, errorNext, errorCurr;
	var lambda = 1E-3;
	var lambdaScale = 10.0;
	if(lambdaScaleFlip){
		lambdaScale = 1.0/lambdaScale;
	}

	// initial
	fxn(args, x,y,error);
	errorCurr = error.getNorm();
	for(i=0;i<maxIterations; ++i){
		// check function error
		if(errorCurr<fTolerance){
			console.log("converge f");
			break;
		}
		errorPrev = errorCurr;
		// f(x+dx) - y = dy => jacobian
		for(j=0;j<n;++j){
			xTemp.copy(x); xTemp.set(j,0, xTemp.get(j,0)+epsilon );
			fxn(args, xTemp,yTemp,null);
			Matrix.sub(dy,yTemp,y); // negative dy
			jacobian.setColFromCol(j, dy,0);
		}
		jacobian.scale(1.0/epsilon);
		// dx
		var jt = Matrix.transpose(jacobian);
		var jj = Matrix.mult(jt,jacobian);
		L.identity(); L.scale(lambda);
		var ji = Matrix.add(jj,L);
		ji = Matrix.inverse(ji);
		var Jinv = Matrix.mult(ji,jt);
		dx = Matrix.mult(Jinv, error);
		// x tolerance
		if(dx.getNorm()<xTolerance){
			// console.log("converge x: "+dx.getNorm());
			break;
		}
		// x += dx  (putative)
		Matrix.add(xTemp, x,dx);
		// possible new y
		fxn(args, xTemp,yTemp,error);
		errorNext = error.getNorm();
//		console.log("=> "+errorPrev+" | "+errorCurr+" => "+errorNext+" == "+(errorNext/errorCurr))
		if(errorNext<=errorPrev){
			//console.log(".  >> better")
			x.copy(xTemp);
			y.copy(yTemp);
			fxn(args, xTemp,yTemp,error, true);
			errorCurr = errorNext;
			lambda *= lambdaScale;
		}else{
			//console.log(".  >> worse")
			lambda /= lambdaScale;
		}
		//console.log(" lambda"+lambda)
	}
//	console.log(" iterations: "+i+"/"+maxIterations);
}catch(e){
	console.log("error avoided: "+e);
}
	x.toArray(xInitial);
	y.toArray(yFinal);
}

       /*
       SUBROUTINE LMDIF(FCN,M,N,X,FVEC,FTOL,XTOL,GTOL,MAXFEV,EPSFCN, DIAG,MODE,FACTOR,NPRINT,INFO,NFEV,FJAC,LDFJAC, IPVT,QTF,WA1,WA2,WA3,WA4)
       INTEGER M,N,MAXFEV,MODE,NPRINT,INFO,NFEV,LDFJAC
       INTEGER IPVT(N)
       DOUBLE PRECISION FTOL,XTOL,GTOL,EPSFCN,FACTOR
       DOUBLE PRECISION X(N),FVEC(M),DIAG(N),FJAC(LDFJAC,N),QTF(N),
      *                 WA1(N),WA2(N),WA3(N),WA4(M)
       EXTERNAL FCN

       SUBROUTINE FCN(M,N,X,FVEC,IFLAG)
         INTEGER M,N,IFLAG
         DOUBLE PRECISION X(N),FVEC(M)
         ----------
         CALCULATE THE FUNCTIONS AT X AND
         RETURN THIS VECTOR IN FVEC.
         ----------
         RETURN
         END
*/



/*
exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	var str = "";
	for(j=0;j<=rowm1;++j){
		//str += "[ ";
		str += " ";
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			val = num.toExponential(exp);
			if(num>=0){ // +/1 prefix
				val = " " + val;
			}
			str += Code.padStringLeft(val,minLen," ");
*/


/*
Matrix.prototype.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
	var det = 1/(m.a*m.d - m.b*m.c);
	var a = m.d*det;
	var b = -m.b*det;
	var x = (m.b*m.y-m.d*m.x)*det;
	var c = -m.c*det;
	var d = m.a*det;
	var y = (m.c*m.x-m.a*m.y)*det;
	self.a = a; self.b = b; self.c = c; self.d = d; self.x = x; self.y = y;
}
*/

/*
RANK: actual dimension the matrix can produce
NULL SPACE: KERNEL SPACE: all x : Ax = 0
COL SPACE: volume that can be produced
ROW SPACE:
IMAGE:
PREIMAGE:

SPAN === LINEAR COMBINATION

http://www.youtube.com/watch?v=abYAUqs_n6I

*/

Matrix.prototype.determinant = function(){
	return this.det();
}
Matrix.prototype.det = function(){
	return numeric.det(this._rows);
}


/* ---------------------------------------------------------------------------- COOKED RECIPES ---------------------------------------------------------------------------- */
Matrix._inverseMatrixNew = function(matrix){
	if(!matrix){ return null; }
	var rows = matrix.rows();
	var cols = matrix.cols();
	if(rows!=cols){ return null; }
	var inverse = matrix.copy();
	var result = Matrix._inverseSquareGaussJordan(inverse._rows,rows, null,0);
	if(result){
		return inverse;
	}
	return null;
}
Matrix._luDecomposeNew = function(matrixA){
	if(!matrixA){ return null; }
	var rows = matrixA.rows();
	var cols = matrixA.cols();
	if(rows!=cols){ return null; }
	var matrixL = matrixA.copy();
	var result = Matrix._LUDecompositionCrout(matrixL._rows,rows);
	if(!result){
		return null;
	}
	var matrixU = new Matrix(rows,cols);
	for(j=0;j<rows;++j){
		for(i=j;i<cols;++i){
			matrixU._rows[j][i] = matrixL._rows[j][i];
			if(i==j){
				matrixL._rows[j][i] = 1.0;
				//matrixU._rows[j][i] = 1.0;
			}else{
				matrixL._rows[j][i] = 0.0;
			}
		}
	}
// THERES A PERMUTATION MATRIX THAT NEEDS TO BE INCLUDED HERE ....
	return {"L":matrixL, "U":matrixU, "P":null};
}
Matrix._solveAXB = function(matrixA, matrixX){ // LU + backsub is better for finding inv(A)*B = X
	//
}

Matrix._ = function(){
	//
}

Matrix._ = function(){
	//
}

Matrix._ = function(){
	//
}

/* -------------------------------------------------------------------------- NUMERICAL RECIPES -------------------------------------------------------------------------- */

// 2: Linear Algebra Solutions
// gaussj
Matrix._inverseSquareGaussJordan = function(matrixA,rows, matrixB,cols){ // set matrixA to inverse  and  matrixB=inv(matrixA)*matrixB solution  via gauss-jordan
	var i, j, k, l, ll, val, inv, maxRow, maxCol, maxValue;
	var iPivots = new Array(rows);
	var indexRow = new Array(rows);
	var indexCol = new Array(rows);
	// zero pivots
	for(i=rows;i--;){
		iPivots[i] = 0;
	}
	// main row loop
	for(i=0;i<rows;++i){
		// find maximum index/value in remaining positions
		maxValue = 0.0;
		for(j=0;j<rows;++j){
			if(iPivots[j]!=1){
				for(k=0;k<rows;++k){
					if(iPivots[k]==0){
						val = Math.abs(matrixA[j][k]);
						if(val >= maxValue){
							maxValue = val;
							maxRow = j;
							maxCol = k;
						}
					}
				}
			}
		}
		// pivot element
		++iPivots[maxCol];
		if(maxRow!=maxCol){ // not along diagonal, row swap
			for(l=0;l<rows;++l){
				val = matrixA[maxRow][l];
				matrixA[maxRow][l] = matrixA[maxCol][l];
				matrixA[maxCol][l] = val;
			}
			for(l=0;l<cols;++l){
				val = matrixB[maxRow][l];
				matrixB[maxRow][l] = matrixB[maxCol][l];
				matrixB[maxCol][l] = val;
			}
		}
		// remember pivot positions
		indexRow[i] = maxRow;
		indexCol[i] = maxCol;
		val = matrixA[maxCol][maxCol];
		if(val==0.0){ // singular matrix not invertable
			console.log("gaussj: singular matrix");
			return null;
		}
		// scale row to pivot = 1.0
		inv = 1.0/val;
		matrixA[maxCol][maxCol] = 1.0;
		for(l=0;l<rows;++l){
			matrixA[maxCol][l] *= inv;
		}
		for(l=0;l<cols;++l){
			matrixB[maxCol][l] *= inv;
		}
		// reduce non-pivot rows
		for(ll=0;ll<rows;++ll){
			if(ll!=maxCol){
				val = matrixA[ll][maxCol];
				matrixA[ll][maxCol] = 0.0;
				for(l=0;l<rows;++l){
					matrixA[ll][l] -= matrixA[maxCol][l]*val;
				}
				for(l=0;l<cols;++l){
					matrixB[ll][l] -= matrixB[maxCol][l]*val;
				}
			}
		}
	}
	// un-permute swapped changes
	for(l=rows;l--;){
		if(indexRow[l]!=indexCol[l]){
			for(k=0;k<rows;++k){
				val = matrixA[k][indexRow[l]];
				matrixA[k][indexRow[l]] = matrixA[k][indexCol[l]];
				matrixA[k][indexCol[l]] = val;
			}
		}
	}
	return matrixA;
}

// ludcmp
Matrix._LUDecompositionCrout = function(matrixA,rows){ // LU = A via Crouts method + back substitution
	var tiny = 1E-16; // prevent division by zero
	var i, j, k, sum, value, maxValue, maxIndex;
	var vector = new Array(rows);
	var index = new Array(rows);
	var d = 1.0; // d = +1 even row changes, -1 odd row changes
	// get (inverse) largest element per row
	for(i=0;i<rows;++i){
		maxValue = 0.0;
		for(j=0;j<rows;++j){
			value = Math.abs(matrixA[i][j]);
			if(value>maxValue){
				maxValue = value;
			}
		}
		if(maxValue==0.0){
			console.log("singular matrix ludcmp");
			return null;
		}
		vector[i] = 1.0/maxValue;
	}
	// main crout loop
	for(j=0;j<rows;++j){
		for(i=0;i<j;++i){
			sum = matrixA[i][j];
			for(k=0;k<i;++k){
				sum -= matrixA[i][k] * matrixA[k][j];
			}
			matrixA[i][j] = sum;
		}
		maxValue = 0.0;
		for(i=j;i<rows;++i){
			sum = matrixA[i][j];
			for(k=0;k<j;++k){
				sum -= matrixA[i][k] * matrixA[k][j];
			}
			matrixA[i][j] = sum;
			value = vector[i]*Math.abs(sum);
			if(value >= maxValue){
				maxValue = value;
				maxIndex = i;
			}
		}
		// interchange rows
		if(j!=maxIndex){
			for(k=0;k<rows;++k){
				value = matrixA[maxIndex][k];
				matrixA[maxIndex][k] = matrixA[j][k];
				matrixA[j][k] = value;
			}
			d = -d;
			vector[maxIndex] = vector[j];
		}
		index[j] = maxIndex;
		if(matrixA[j][j] == 0.0){ // singular fibbing
			matrixA[j][j] == tiny;
		}
		if(j!=rows-1){ // last element
			value = 1.0/matrixA[j][j];
			for(i=j+1;i<rows;++i){
				matrixA[i][j] *= value;
			}
		}
	}
	return matrixA;
}
// lubksb
Matrix._LUBackSubstitution = function(matrixLU, index, vectorB){ // solves A*X = B
	var i, j, ii, ip, sum, rows;
	rows = matrixLU.rows();
	ii=0;
	for(i=0;i<rows;++i){
		ip = index[i];
		sum = vectorB[ip];
		vectorB[ip] = vectorB[i];
		if(ii>0){
			for(j=ii;j<i;++j){
				sum -= matrixLU._rows[i][j]*vectorB[i];
			}
		}else if(sum!=0){
			ii=i;
		}
		b[i] = sum;
	}
	for(i=rows;i--;){
		sum = vectorB[i];
		for(j=i+1;j<rows;++j){
			sum -= matrixLU._rows[i][j]*vectorB[i];
		}
		vectorB[i] = sum / matrixLU._rows[i][i];
	}
}
// _
Matrix._solveAXBbyLU = function(matrixA,rows, vectorB,cols){
	// float **a, *b, d;
	// int n, *index;
	ludcmp(a,n,index,d);
	lubksb(a,n,index,b);
}
// _
Matrix._LUInverse = function(matrixA,rows){ // solves inv(A) from LU decomposed matrix
	var i, j, index, col;
	var inverse = new Array();
	col = new Array(rows);
	Matrix._LUDecompositionCrout(matrixA,rows);
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			col[i] = 0.0;
		}
		col[j] = 0.0;
		Matrix._LUBackSubstitution(matrixA,rows, index,col);
		for(i=0;i<cols;++i){
			col[i] = 0.0;
		}
	}
	return inverse;
}
// _
Matrix._LUDeterminant = function(matrixA,rows){
}

// 2.4: Tridiagonal / Band Diagonal
// tridiag(a,b,c,r,u,n)
// banmul(a,n,m1,m2,x,b)
// bandec(a,n,m1,m2,a1,indx,d)
// banbks(a,n,m1,m2,a1,indx,b)

// 2.5
// mprov(a,alud,n,indx,b,x)


// 2.6 SVD

// svbksb
Matrix._singularValueBackSubstitution = function(matrixU, vectorW, matrixV, rows, cols, vectorB, vectorX){ // solves AX=B fom svcmp
	// m rows
	// n cols
}

// svdcmp
Matrix._singularValueDecomposition = function(matrixA, rows,cols, vectorW, matrixV){ // A = U*W*Vt
	// m = rows
	// n = cols
}
//


// 2.7 Sparse
// cyclic(a,b,c,alpha,beta,r,x,n)
// sprsin(a,nm,thresh,nmax,sa,ija)
// sprsax(sa,ija,x,b,n)
// sprstx(sa,ija,x,b,n)
// sprstp(sa,ija,sb,ijb)
// svbksb(u,w,v,m,n,b,x)

// 3:

// 11: Eigensystems

// n = rows, m = cols

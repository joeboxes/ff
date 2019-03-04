// Tensor.js

Tensor.YAML = {
	// ROWS:"row",
	// COLS:"col",
	// DATA:"data"
}


function Tensor(dimensions, values){
	this._values = null;
	this._init(dimensions);
	if(values){
		this.fromArray(values);
	}
}
Tensor.prototype._init = function(dims){
	this._dimensions = Code.copyArray(dims);
	this._values = Tensor._subArray([], this._dimensions, 0);
	return this;
}
Tensor._subArray = function(array, dims, offset){
	if(offset>=dims.length){
		return array;
	}
	var dm1 = dims.length-1;
	var size = dims[offset];
	for(var i=0; i<size; ++i){
		if(offset==dm1){ // at end, make array of zero values
			array.push(0);
		}else{ // need to fill out sub array
			array.push( Tensor._subArray([], dims, offset+1) );
		}
	}
	return array;
}
Tensor._iterate = function(fxn, array, dims, dimOffset, index){ // go thru each element index by index & perform fxn on it
	index = index!==undefined ? index : [0];
	var i;
	var size = dims[dimOffset];
	var isLast = dimOffset == dims.length-1;
	for(i=0; i<size; ++i){
		if(isLast){
			var value = array[i];
			fxn(index[0], value, array, i);
			index[0] = index[0]+1;
		}else{
			Tensor._iterate(fxn, array[i], dims, dimOffset+1, index);
		}
	}
}
Tensor.prototype.fromArray = function(vals){
	var fxn = function(index, value, array, ind){
		array[ind] = vals[index];
	}
	Tensor._iterate(fxn, this._values, this._dimensions, 0);
	return this;
}
Tensor.prototype.toArray = function(){
	var a = [];
	var fxn = function(index, value, array, ind){
		a.push(value);
	}
	Tensor._iterate(fxn, this._values, this._dimensions, 0);
	return a;
}

Tensor.prototype.subArray = function(dimension){
	var value = this._values;
	for(var i=0; i<dimension.length; ++i){
		value = value[dimension[i]];
	}
	var a = [];
	var fxn = function(index, value, array, ind){
		a.push(value);
	}
	Tensor._iterate(fxn, value, this._dimensions, dimension.length);
	return a;
}
Tensor.prototype.get = function(location){
	var value = this._values;
	var len = location.length;
	for(var i=0; i<len; ++i){
		value = value[location[i]];
	}
	return value;
}
Tensor.prototype.set = function(location, val){
	var value = this._values;
	var len = location.length;
	var lm1 = len-1;
	for(var i=0; i<len; ++i){
		if(i==lm1){
			value[location[i]] = val;
		}else{
			value = value[location[i]];
		}
	}
	return this;
}
Tensor.prototype.count = function(){
	var count = null;
	var dims = this._dimensions;
	var len = dims.length;
	for(var i=0; i<len; ++i){
		if(count===null){
			count = dims[i];
		}else{
			count = count*dims[i];
		}
	}
	return count;
}
Tensor.prototype.toString = function(){
	var str = "[Tensor: ";
	var dims = this._dimensions;
	var len = dims.length;
	var lm1 = len-1;
	for(var i=0; i<len; ++i){
		str += dims[i];
		if(0<=i && i<lm1){
			str += "x";
		}
	}
	str += " : "+this.count()+"]";
	return str;
}

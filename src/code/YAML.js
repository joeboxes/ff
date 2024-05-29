// YAML.js
// NODEJS INCLUSION
isBrowser = false;
isNode = false;
if (typeof module !== 'undefined' && module.exports) { isNode = true; }
if (typeof window !== 'undefined' && window.navigator) { isBrowser = true; }
if(isNode){
	var Code = require("./Code.js");
}



// documental
YAML.DECLARATION="%";
YAML.COMMENT="#";
YAML.SEPARATOR=":";
YAML.INDENT="\t";
YAML.SPACE=" ";
YAML.STRING_MULTILINE=">";
YAML.REFERENCE_DEFINE="&";
YAML.REFERENCE_VALUE="*";
YAML.ARRAY_SEPARATOR="-";
YAML.DOCUMENT_SEPARATOR="---";
YAML.IGNORE="...";
YAML.NEWLINE="\n";
YAML.STRING_QUOTE="\"";
YAML.NULL="null";
YAML.TRUE="true";
YAML.FALSE="false";
YAML.NULL_CHARACTER=String.fromCharCode(0);
YAML.REFERENCE_SUFFIX="ref";
// functional
YAML.STACK_UNKNOWN=0;
YAML.STACK_OBJECT=1;
YAML.STACK_ARRAY=2;

function YAML(inputString){
	this._lines = new Array();
	this._lineNumber = 0;
	this._indent = 0;
	this._stack = new Array();
	this._documents = new Array();
	this._references = new Object(); // [name] = {ref:object , key:key, table:[[obj,key],..]} -- object is either "object[key]"" or "object" if key is null
	this._refCount = 0; // writing
}
YAML.parse = function(input){
	var yaml = new YAML();
	var output = null;
	if(Code.isString(input)){
		output = yaml.parse(input);
	}else{
		yaml.startWrite();
		yaml.writeObjectLiteral(input);
		output = yaml.toString();
	}
	yaml.kill();
	return output;
}
YAML.prototype.kill = function(){
	this._documents = null;
	this._references = null;
	this._lines = null;
	this._lineNumber = null;
	this._indent = null;
	this._stack = null;
	this._refCount = null;
}
// -------------------------------------------------------------------------------------------------- REFERENCE TABLE
YAML.prototype._addRefenceTableReference = function(referenceName,object,key){
	if(this._references[referenceName]===undefined){
		this._references[referenceName] = {"ref":null, "key":null, "list":[]};
	}
	this._references[referenceName].list.push([object,key]);
}
YAML.prototype._addRefenceTableDefinition = function(referenceName,object,key){
	key = Code.valueOrDefault(key, null);
	if(this._references[referenceName]===undefined){
		this._references[referenceName] = {ref:object, key:key, list:[]};
	}else{
		this._references[referenceName]["ref"] = object;
		this._references[referenceName]["key"] = key;
	}
}
YAML.prototype._fillInReferences = function(){
	var s, obj, arr, key, ref, ind, table, referenceTable = this._references;
	var unfound = [];
    for(s in referenceTable){
        table = referenceTable[s]; ref = table.ref; ind = table.key; list = table.list;
        if(ref==null){
        	unfound.push(s);
        }else{
        	if(ind!==null){
        		ref = ref[ind];
        	}
	        while(list.length>0){
	            arr = list.pop(); obj = arr[0]; key = arr[1];
	            obj[key] = ref;
	            // console.log("SET: "+key+" = ", obj, ref,obj==ref);
	            delete arr[0];
	            delete arr[1];
	        }
	    }
        table.ref = null; table.list = null;
        referenceTable[s] = null;
        delete referenceTable[s];
    }
    if(unfound.length>0){
    	console.log("found "+unfound.length+" undefined references");
    }
}
// writing oriented
YAML.prototype.newRefenceObject = function(referenceName,object,key){
	this._addRefenceTableDefinition(referenceName,object,key);
}
YAML.prototype._newReferenceHash = function(){
	return YAML.REFERENCE_SUFFIX+""+(this._refCount++);
}
YAML.prototype._lookupReferenceFromObject = function(object){
	var s, referenceTable = this._references;
    for(s in referenceTable){
    	var table = referenceTable[s];
    	var ref = table["ref"];
    	var key = table["key"];
    	if(key!==null){
    		ref = ref[key];
    	}
    	if(ref==object){
    		return s
    	}
    } // doesn't exist, create it
    s = this._newReferenceHash();
    this._addRefenceTableDefinition(s,object,null);
	return s;
}

// -------------------------------------------------------------------------------------------------------------------------- READING
YAML.prototype.parse = function(inputString){
	this._documents = new Array();
	this._references = new Object();
	var lines = inputString.split(YAML.NEWLINE);
	// cleanup nulls - seems to be a result of binary type conversion between strings
	for(var i=0; i<lines.length; ++i){
		lines[i] = lines[i].replace(/\0/g, ''); // remove null
	}
	this._lines = lines;
	this._lineNumber = 0;
	this._indent = 0;
	// go to first non-empty line
	this._gotoNextLine(false);
	this._createNextDoc();
	var keep = true;
	while(keep){ // iterate thru lines / objects
		keep = this._parseNext();
	}
	this._fillInReferences();
	return this._documents;
}
YAML.prototype._createNextDoc = function(auto){
	var doc = new Object();
	this._documents.push(doc);
	this._stack = [[doc,-1]];
	return doc;
}
YAML.prototype._nextLineIndex = function(index){
	var keep = true;
	var lines = this._lines;
	var maxIndex = lines.length;
	while(index<maxIndex){
		var line = lines[index];
		var clean = line;
			clean = YAML._removeComment(clean);
			clean = YAML._removeLeadingAndTrailingWhitespace(clean);
		if(clean===""){
			++index;
			continue;
		}
		break;
	}
	if(index>=maxIndex){
		return null;
	}
	return index;
}
YAML.prototype._gotoNextLine = function(auto){
	auto = Code.valueOrDefault(auto, true);
	if(auto){
		++this._lineNumber;
	}
	var nextLine = this._nextLineIndex(this._lineNumber);
	this._lineNumber = nextLine;
}
YAML.prototype._getNextLine = function(){ // look-ahead
	var nextLine = this._nextLineIndex(this._lineNumber+1);
	if(!nextLine){
		return "";
	}
	nextLine = this._lines[nextLine];
	nextLine = YAML._removeComment(nextLine);
	return nextLine;
}
YAML.prototype._checkAddNextValue = function(container,key,val, lineIndentCount){
	var hasReference = this._checkAddReferenceValue(container,key,val);
	var subContainer = this._getNextLineObject(lineIndentCount);
	if(subContainer){
		container[key] = subContainer;
	}else if(!hasReference){
		val = this._checkSubstituteValue(val);
		container[key] = val;
	}
}
YAML.prototype._getNextLineObject = function(lineIndentCount){ // look at next line to see if: empty, object, array
	var nextLine = this._getNextLine();
	var nextIndentCount = YAML._countLineIndents(nextLine);
	var subContainer = null;
	if(nextIndentCount>lineIndentCount){ // else null item
		var isArray = YAML._isLineArrayItem(nextLine);
		if(isArray){
			subContainer = [];
		}else{
			subContainer = {};
		}
		this._stack.push( [subContainer, lineIndentCount] );
	}
	return subContainer;
}
YAML.prototype._parseNext = function(){
	// reached end of content
	if(this._lineNumber===null){
		return false;
	}
	// get status from stack
	var top = this._stack[this._stack.length-1];
	var superContainer = this._stack[this._stack.length-2];
	var container = top[0];
	var containerIndents = top[1];
	// get next line data
	var line = this._line(0);
	var clean = YAML._removeLeadingAndTrailingWhitespace(line);
	// explicit end
	if(clean==YAML.DOCUMENT_SEPARATOR){ // of document
		this._createNextDoc();
		this._gotoNextLine();
		return true;
	}else if(clean==YAML.IGNORE){ // of content
		return false;
	}
	var lineIndentCount = YAML._countLineIndents(line);
	// done with item if without indentation
	if(lineIndentCount<=containerIndents){
		this._stack.pop();
		return true;
	}
	// check for content
	var isArrayItem = YAML._isLineArrayItem(clean);
	if(isArrayItem){
		if(!Code.isArray(container)){
			console.log(container);
			console.log("? '"+clean+"'");
			throw "found array item on non array object?";
		}
		var val = clean;
		val = val.substring(1,val.length);
		val = YAML._removeLeadingAndTrailingWhitespace(val);
		if(val===YAML.STRING_MULTILINE){
			throw "multiline handle B";
		}
		this._checkAddNextValue(container,container.length,val, lineIndentCount);
		this._gotoNextLine();
		return true;
	}
	var separatorIndex = clean.indexOf(YAML.SEPARATOR);
	var key = null;
	var val = null;
	if(separatorIndex>0){ // object
		if(!Code.isObject(container)){
			console.log(container);
			console.log(clean);
			console.log(key,val);
			throw "found object on non object"
		}
		key = clean.substring(0,separatorIndex);
		val = clean.substring(separatorIndex+1,clean.length);
		key = YAML._removeLeadingAndTrailingWhitespace(key);
		val = YAML._removeLeadingAndTrailingWhitespace(val);
		if(key===""){
			console.log(container);
			console.log(clean);
			throw "no key?";
		}
		if(val===YAML.STRING_MULTILINE){
			throw "multiline handle A";
		}
		this._checkAddNextValue(container,key,val, lineIndentCount);
		this._gotoNextLine();
		return true;
	}
	console.log(line);
	throw "unhandled line";
}
YAML.prototype._line = function(offset){
	offset = offset!==undefined ? offset : 0;
	var index = this._lineNumber + offset;
	if(index>this._lines.length){
		return null;
	}
	return YAML._removeComment(this._lines[index]);
}
YAML.prototype._checkAddReferenceValue = function(object,key,value){
	if(value!==null || value!==""){
		if(value.charAt(0)==YAML.REFERENCE_DEFINE){
			referenceName = value.substring(1,value.length);
			this._addRefenceTableDefinition(referenceName,object,key);
			return true;
		}else if(value.charAt(0)==YAML.REFERENCE_VALUE){
			referenceName = value.substring(1,value.length);
			this._addRefenceTableReference(referenceName,object,key);
			return true;
		}
	}
	return false;
}

YAML.prototype._checkSubstituteValue = function(value){
	if(value===YAML.TRUE){
		value = true;
	}else if(value===YAML.FALSE){
		value = false;
	}else if(value===YAML.NULL){
		value = null;
	}else if(value.length>1 && value.charAt(0)==YAML.STRING_QUOTE && value.charAt(value.length-1)==YAML.STRING_QUOTE){
		value = value.substring(1,value.length-1);
		value = YAML._cleanUpString(value);
	}else if( !Code.isNaN(value) ){ // number
        if( value.indexOf(".")>=0 ){ // floating point
            value = parseFloat(value);
        }else{ // integer
            value = parseInt(value);
        }
	}else{
		value = YAML._cleanUpString(value);
	}
	return value;
}
// -------------------------------------------------------------------------------------------------- HELPERS READ
YAML._cleanUpString = function(str){
    return str.replace(/\\n/g,"\n");
}
YAML._removeLeadingAndTrailingWhitespace = function(str){
    return YAML._removeTrailingWhitespace( YAML._removeLeadingWhitespace(str) );
}
YAML._removeLeadingWhitespace = function(str){
    return str.replace(/^[ \t]+/,"");
}
YAML._removeTrailingWhitespace = function(str){
    return str.replace(/[ \t]+$/,"");
}
YAML._removeComment = function(str){
	return str.replace(/(%|#).*/g,"");
}
YAML._countLineIndents = function(str){
	if(str==null){return -1;}
	var i, ch, count=0, len=str.length;
	for(i=0;i<len;++i){
		ch = str.charAt(i);
		if(ch==YAML.INDENT){ // white space
			++count;
		}
	}
	return count;
}
YAML._isLineArrayItem = function(str){
	var i, ch, len=str.length;
	for(i=0;i<len;++i){
		ch = str.charAt(i);
		if(ch==YAML.INDENT){ // white space
			//
		}else if(ch==YAML.ARRAY_SEPARATOR){ // array item
			return true;
		}else{ // other
			return false;
		}
	}
	return false;
}
// -------------------------------------------------------------------------------------------------- HELPERS WRITE
YAML.prototype._stackIsObject = function(){
	return this._stack[this._stack.length-1] == YAML.STACK_OBJECT;
}
YAML.prototype._stackIsArray = function(){
	return this._stack[this._stack.length-1] == YAML.STACK_ARRAY;
}
YAML.prototype._prefixIndent = function(count){ // could also just store indent value
	var i = (count!==undefined)?count:this._indent;
	var str = "";
	for(;i--;){
		str += YAML.INDENT;
	}
	return str;
}
// -------------------------------------------------------------------------------------------------- ------------------------ WRITING
YAML.prototype.startWrite = function(){
	this._lines = new Array();
	this._stack = new Array();
	this._references = new Array();
	this._refCount = 0;
	this._stack.push(YAML.STACK_OBJECT);
	this._indent = 0;
}
// -------------------------------------------------------------------------------------------------- DOCUMENTORIAL
YAML.prototype.separateDocument = function(){
	this._lines[this._lineNumber++] = YAML.DOCUMENT_SEPARATOR;
}
YAML.prototype.writeDocument = function(){
	this.separateDocument();
}
YAML.prototype.writeYAML = function(str){
	this._lines[this._lineNumber++] = YAML.DECLARATION+YAML.SPACE+str;
}
YAML.prototype.writeBlank = function(){
	this._lines[this._lineNumber++] = "";
}
YAML.prototype.writeIgnore = function(){
	this._lines[this._lineNumber++] = YAML.IGNORE;
}
YAML.prototype.writeComment = function(comment){ // own added line
	this._lines[this._lineNumber++] = this._prefixIndent()+YAML.COMMENT+YAML.SPACE+comment;
}
YAML.prototype.writeCommentAppend = function(comment){ // on previous line
	this._writeAppend(YAML.SPACE+YAML.COMMENT+YAML.SPACE+comment);
}
YAML.prototype.writeReferenceDefinition = function(name){ // definition
	this._writeAppend(YAML.SPACE+YAML.REFERENCE_DEFINE+name);
}
YAML.prototype.writeReferencePointer = function(name){ // de-reference / pointer / value
	this._writeAppend(YAML.SPACE+YAML.REFERENCE_VALUE+name);
}
YAML.prototype._writeAppend = function(addition){
	var prev = this._lineNumber-1;
	this._lines[prev] = this._lines[prev]+addition
}
YAML.prototype.writeCommentAppend = function(comment){ // on previous line
	var prev = this._lineNumber-1;
	this._lines[prev] = this._lines[prev]+YAML.SPACE+YAML.COMMENT+YAML.SPACE+comment;
}
// -------------------------------------------------------------------------------------------------- PRIMITIVES
YAML.prototype.writeNull = function(name){
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+YAML.NULL;
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+YAML.NULL;
	}
}
YAML.prototype.writeBoolean = function(name,value){
	if(value===undefined){ value = name; name = null; }
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+(value===true);
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+(value===true);
	}
}
YAML.prototype.writeNumber = function(name,value){
	if(value===undefined){ value = name; name = null; }
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+value;
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+value;
	}
}
YAML.prototype.writeString = function(name,value){ // if intending to write null string, this messes up
	// console.log("IN: "+name+" = "+value+" @ "+arguments.length);
	// passing in an undefined -> this should never happen, only allow null
	if(arguments.length==2 && value===undefined){
		console.log("warning: calling writeString with an undefined value => casting to null")
		value = null;
	}
	if(value===undefined){ value = name; name = null; }
	// if it starts or ends with a space, quote, doublequote ... needs to be enclosed in double quotes
	//value = value.replace(/\\n/g,"\\\\n")
	if(value){
		value = value+""; // force to a string in case
		value = value.replace(/\n/g,"\\n");
		value = '"'+value+'"';
	}else{
		value = null;
	}
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+value;
	}else{
		if(name==null){ // this is do to some bug / bad usage
			name = value;
			value = null;
			throw "YAML - name is null but is object ?"
		}
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+value;
	}
}
YAML.prototype.writeArrayLiteral = function(name,value){
	if(value===undefined){
		value = name;
		name = null;
	}
	this.writeArrayStart(name);
	for(var i=0; i<value.length; ++i){
		this._writeUnknownLiteral(value[i],undefined, true);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeObjectLiteral = function(name,value){
	if(value!==undefined && value!==null){ // has name
		this.writeObjectStart(name);
			this.writeObjectLiteral(value);
		this.writeObjectEnd();
	}else{ // already at write location
		value = name;
		var keys = Code.keys(value);
//console.log(keys);
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var val = value[key];
			if(val===undefined){
				// could CONTINUE or REPLACE WITH NULL
				val = null;
				console.log("replacing an undefined value with null: '"+key+"'");
			}
			this._writeUnknownLiteral(key,val);
		}
	}
}
YAML.prototype._writeUnknownLiteral = function(key,val, startObject){
	if(val===undefined){
		val = key;
		key = null;
	}
	if(Code.isObject(val)){
		if(key){
			this.writeObjectLiteral(key,val);
		}else{
			if(startObject){ // from array needs indent
				this.writeObjectStart();
					this.writeObjectLiteral(val);
				this.writeObjectEnd();
			}else{
				this.writeObjectLiteral(val);
			}
		}
	}else if(Code.isArray(val)){
		this.writeArrayLiteral(key,val);
	}else if(Code.isString(val)){
		if(key){
			this.writeString(key,val);
		}else{
			this.writeString(val);
		}
	}else if(Code.isNumber(val)){
		if(key){
			this.writeNumber(key,val);
		}else{
			this.writeNumber(val);
		}
	}else if(Code.isBoolean(val)){
		if(key){
			this.writeBoolean(key,val);
		}else{
			this.writeBoolean(val);
		}
	}else if(Code.isNull(val) || Code.isUndefined(val)){
		if(key){
			this.writeNull(key);
		}else{
			this.writeNull();
		}
	}else if(Code.isInstance(val) && Code.isFunction(val.toObject)){
		var obj = val.toObject();
		if(key){
			this.writeObjectLiteral(key,obj);
		}else{
			if(startObject){ // from array needs indent
				this.writeObjectStart();
					this.writeObjectLiteral(obj);
				this.writeObjectEnd();
			}else{
				this.writeObjectLiteral(obj);
			}
		}
	}else{
		console.log("ignoring: "+key);
		console.log(val);
		throw "?";
	}
}

// -------------------------------------------------------------------------------------------------- OBJECT
YAML.prototype.writeObjectStart = function(name, refHash){
	if(refHash!==undefined && !Code.isString(refHash) ){
		refHash = this._lookupReferenceFromObject(refHash);
	}
	if(this._stackIsArray()){
		if(refHash!==undefined){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"")
		}else{
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR;
		}
		//this._lines[this._lineNumber++] = this._prefixIndent()+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"");
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"");
	}
	this._stack.push(YAML.STACK_OBJECT);
	this._indent++;
}
YAML.prototype.writeObjectEnd = function(name){
	this._indent--;
	this._stack.pop();
}
// -------------------------------------------------------------------------------------------------- ARRAY
YAML.prototype.writeArrayNumbers = function(name, array){
	this.writeArrayStart(name);
	for(var i=0; i<array.length; ++i){
		this.writeNumber(array[i]);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeArrayStrings = function(name, array){
	this.writeArrayStart(name);
	for(var i=0; i<array.length; ++i){
		this.writeString(array[i]);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeArrayStart = function(name){
	if(name!==undefined && name!==null){
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR;
	}else{ // no name, start of something
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR;
	}
	this._stack.push(YAML.STACK_ARRAY);
	this._indent++;
}
YAML.prototype.writeArrayEnd = function(name){
	this._indent--;
	this._stack.pop();
}
// -------------------------------------------------------------------------------------------------- >>>
YAML.prototype.toString = function(){
	var str = "";
	for(var i=0;i<this._lines.length;++i){
		str = str+this._lines[i]+"\n";
	}
	return str;
}






// NODE JS INCLUSION:
if(isNode){
	module.exports = YAML;
}





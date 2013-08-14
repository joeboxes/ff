// Code.js 
Code.IS_IE = ( (navigator.appName).toLowerCase().indexOf("explorer") >=0 );

// ------------------------------------------------------------------------------------------
function Code(){
	this.www = 234;
}

// ------------------------------------------------------------------------------------------ CLASS SUB/SUPER EXTEND
Code.extendClass = function extendClass(target, source) {
    Object.getOwnPropertyNames(source).forEach(function(propName) {
        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
    });
    return target;
}

Code.inheritClass = function inheritClass(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    Code.extendClass(subProto, SubC.prototype);
    SubC.prototype = subProto;
    SubC._ = SuperC.prototype;
}

// ------------------------------------------------------------------------------------------ PRINT
Code.log = function log(o){
	if(typeof o == Code.TYPE_STRING){
		console.log( o );
	}else if(typeof o == Code.TYPE_FUNCTION){
		console.log( o );
	}else{
		console.log( o.toString() );
	}
}
// ------------------------------------------------------------------------------------------ ARRAY
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
}
Code.elementExists = function(a,o){ // O(n)
	for(var i=0; i<a.length; ++i){
		if(a[i]==o){ return true; }
	}
	return false;
}
Code.addUnique = function(a,o){ // O(n)
	if( !Code.elementExists(a,o) ){ a.push(o); return true; }
	return false;
}
Code.removeElement = function(a,o){ // preserves order O(n)
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]==o){
			len-=1;
			while(i<len){
				a[i] = a[i+1];
				++i;
			}
			a.pop();
			return;
		}
	}
}
Code.removeElementSimple = function(a,o){ // not preserve order O(n/2)
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]==o){
			a[i] = a[len-1];
			a.pop();
			return;
		}
	}
}
// ------------------------------------------------------------------------------------------ TIME
Code.getTimeMilliseconds = function(){
    var d = new Date();
    return d.getTime();
};

// ------------------------------------------------------------------------------------------ BINARY REPRESENTATIONS
Code.intToBinaryString = function(num,cnt){
	var i, len = (cnt!=null)?cnt:32, ander = 1;
	var str = "";
	for(i=0;i<len;++i){
		str = "" +((ander&num)!=0?1:0) + str;
		ander <<= 1;
	}
	return str;
}
// formatting functions ----------------------------------------------
Code.prependFixed = function(start,pad,count){
	var str = start;
	while(str.length<count){
		str = pad+str;
	}
	return str;
}


// -------------------------------------------------------- HTML
Code.getBody = function(){
	return document.body;
};
Code.getID = function(argA,argB){
	if(arguments.length>1){
		return argA.getElementById(argB);
	}
	return document.getElementById(argA);
};
Code.getName = function(argA,argB){
	var eles = document.getElementsByName(argA);
	if(eles.length==0){
		return null;
	}else if(eles.length==1){
		return eles[0];
	}
	return eles;
};
Code.newElement = function(type){
	return document.createElement(type);
};
Code.newDiv = function(){
	return Code.newElement("div");
};
Code.newTable = function(){
	return Code.newElement("table");
};
Code.newTableHeader = function(){
	return Code.newElement("th");
};
Code.newTableRow = function(){
	return Code.newElement("tr");
};
Code.newTableCol = function(){
	return Code.newElement("td");
};
Code.addChild = function(a,b){
	a.appendChild(b);
};
Code.removeChild = function(a,b){
	a.removeChild(b);
};
Code.removeFromParent = function(a){
	a.parentNode.removeChild(a);
};
Code.setProperty = function(ele,pro,val){
	ele.setAttribute(pro,val);
};
Code.setStyleWidth = function(ele,val){
	ele.style.width = val;
};
Code.setStyleBackground = function(ele,val){
	ele.style.background = val;
};
// - CLASS
Code.getClass = function(ele){
	var c = ele.getAttribute("class");
	if(c==undefined || c==null){
		c = ele.className;
		if(c==undefined || c==null){
			return "";
		}
	}
	return c;
}
Code.setClass = function(ele,cla){
	ele.setAttribute("class",cla);
};
Code.addClass = function(ele,cla){
	var c = Code.getClass(ele)+" "+cla;
	ele.setAttribute("class",c);
	ele.className = c;
};
Code.removeClass = function(ele,cla){
	ele.setAttribute("class",Code.getClass(ele).replace(cla,""));
};
// - 
Code.getContent = function(ele){
	return ele.innerHTML;
}
Code.setContent = function(ele,val){
	ele.innerHTML = val;
}
Code.copyHTML = function(ele){
	// crate new element yeppers
	return null;
}

// hiding 
// ele.setAttribute("display","none");
Code.hide = function(ele){
	ele.style.display = "none";
}
Code.unhide = function(ele){
	ele.style.display = Code.IS_IE?"block":"inherit";
}

// -------------------------------------------------------- LISTENERS
Code.addListenerClick = function(ele,fxn){
	if(ele.addEventListener!=null){
		ele.addEventListener("click",fxn);
	}else{ // IE
		ele.onclick = fxn;
	}
}
Code.addListenerChange = function(ele,fxn){
	if(ele.addEventListener!=null){
		ele.addEventListener("change",fxn);
	}else{ // IE
		ele.onchange = fxn;
	}
}

// -------------------------------------------------------- COOKIES
Code.setCookie = function(c_name, value, seconds){
	seconds = seconds*1000;
	var exdate = new Date();
	exdate.setTime( exdate.getTime() + seconds);
	var c_value = escape(value) + ((seconds==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}
Code.deleteCookie = function(name){
	Code.setCookie(name,"x",-1);
}
Code.getCookie = function(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "="); // not first
	if(c_start == -1){
		c_start = c_value.indexOf(c_name + "="); // first
	}
	if(c_start == -1){
		c_value = null;
	}else{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}
// -------------------------------------------------------- DATE FUNCTIONS
Code.getDaysInMonth = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()+1, 0, 0,0,0,0);
	return d.getDate();
}
Code.getFirstMondayInWeek = function(milliseconds){
	var m, d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0);
	var remainder = d.getTime() - milliseconds;
	dow = d.getDay();
	while(dow!=1){
		d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1, 0,0,0,0);
		milliseconds = d.getTime();
		d = new Date(milliseconds);
		dow = d.getDay();
	}
	return milliseconds + remainder;
}
Code.getNextDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
}

/*
function.call(this, a, b, c);
function.apply(this,arg);
*/



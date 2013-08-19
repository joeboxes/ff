// PageShifts.js < PageWeb
PageShifts.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageShifts(container,interface){
	PageShifts._.constructor.call(this,container);
	//PageShifts._.constructor.apply(this,arguments);
	Code.addClass(this._root,"shiftsEditContainer");
	this._interface = interface;
	this._tableContainer = Code.newTable();
		Code.addClass(this._tableContainer,"shiftsEditTable");
	this._positionContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._positionContainer,"shiftsEditRow");
		this._positionSelection = Code.newSelect();
	this._startContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._startContainer,"shiftsEditRow");
		this._startSelection = this.generateSelectionDate();
	this._endContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._endContainer,"shiftsEditRow");
		this._endSelection = this.generateSelectionDate();
	this._dowSelections = new Array();
	this._submitButton = Code.newInputSubmit("Submit Shift");
	Code.addListenerClick(this._submitButton, this._onClickSubmitSchedule, this);

	Code.addChild( this._root, this._tableContainer );
	Code.addChild( this._root, this._submitButton );

	this._init();
}
Code.inheritClass(PageShifts, PageWeb);
// ------------------------------------------------------------------------------ 
PageShifts.prototype._init = function(){
	var i, len, rowContainer, a, b, c;
	// positions
	this.generateLeftColumn("Position:",this._positionContainer);
	this.generateRightColumn(this._positionSelection,this._positionContainer);
	// start
	this.generateLeftColumn("Start Date:",this._startContainer);
	this.generateRightColumn(this._startSelection,this._startContainer);
	// end
	this.generateLeftColumn("End Date:",this._endContainer);
	this.generateRightColumn(this._endSelection,this._endContainer);
	// days
	var dow = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	len = dow.length;
	for(i=0;i<len;++i){
		rowContainer = Code.addRow( this._tableContainer );
			Code.addClass(rowContainer,"shiftsEditRow");
			this.generateLeftColumn(dow[i]+":",rowContainer);
		selA = this.generateSelectionTime();
		selB = this.generateSelectionTime();
		this._dowSelections[i] = new Array(selA,selB);
		//this._dowSelections[i].push([]);
			a = Code.newDiv("Start:&nbsp;");
			b = Code.newDiv("&nbsp;Length:&nbsp;");
			Code.addClass(a,"shiftsInline");
			Code.addClass(b,"shiftsInline");
			Code.addClass(a,"shiftsTiny");
			Code.addClass(b,"shiftsTiny");
		sel = Code.newDiv();
			Code.addChild(sel,a);
			Code.addChild(sel,selA);
			Code.addChild(sel,b);
			Code.addChild(sel,selB);
			Code.addClass(sel,"shiftsInline");
		this.generateRightColumn(sel,rowContainer);
	}
	this.setPositions([], "id","name");
	this._interface.getShiftPositions(this,this.serverPositionsCallback);
}
PageShifts.prototype.serverPositionsCallback = function(o){
	this.setPositions(o.list, "id","name");
}
PageShifts.prototype.setPositions = function(list,id,name){
	Code.emptyDom(this._positionSelection);
	var d, i, len = list.length;
	for(i=-1;i<len;++i){
		if(i<0){
			d = Code.newOption(true);
		}else{
			d = Code.newOption(list[i][name], list[i][id]);
		}
		Code.addClass(d,"shiftsInline");
		Code.addChild(this._positionSelection,d);
	}
}
PageShifts.prototype.setFromAlgorithmAndPosition = function(code,pid){
	//
}
PageShifts.prototype.getAlgorithm = function(){
	var code = "";
	return code;
}
PageShifts.prototype.getPosition = function(){
	var pid = -1;
	return pid;
}
PageShifts.prototype.reset = function(){
	// 
}
PageShifts.prototype.clear = function(){
	//
}
PageShifts.prototype.generateShiftString = function(){
	var i, len, lm1, a, d, e, h0,m0, h1,m1, found, str="";
	var dow = ["M","T","W","R","F","S","U"];
	var selStartDay = Code.getChild(this._startSelection,0);
	var selStartMonth = Code.getChild(this._startSelection,1);
	var selStartYear = Code.getChild(this._startSelection,2);
	var selEndDay = Code.getChild(this._endSelection,0);
	var selEndMonth = Code.getChild(this._endSelection,1);
	var selEndYear = Code.getChild(this._endSelection,2);
	// POSITION
	var position_id = this._positionSelection.value;
	// START DATE
	var start_day = selStartDay.value;
	var start_month = selStartMonth.value;
	var start_year = selStartYear.value;
	var startDate = Code.prependFixed(start_year+"","0",4)+"-"+Code.prependFixed(start_month+"","0",2)+"-"+Code.prependFixed(start_day+"","0",2) + " 00:00:00.0000";
	// END DATE
	var end_day = selEndDay.value;
	var end_month = selEndMonth.value;
	var end_year = selEndYear.value;
	var endDate = Code.prependFixed(end_year+"","0",4)+"-"+Code.prependFixed(end_month+"","0",2)+"-"+Code.prependFixed(end_day+"","0",2) + " 24:00:00.0000";
	// WEEKDAYS
	// self.computePermutations("2013-07-01 14:02:01.1234","2013-07-31 24:00:00.0000","M:06:00:00.0000+08:30:00.0000,T,W:08:00:00.0000+10:00:00.0000|12:00:00.0000+14:00:00.0000,T,F,S,U");
	found = false; len = this._dowSelections.length; lm1 = len-1;
	for(i=0;i<len;++i){
		str += dow[i]+"";
		a = this._dowSelections[i];
		d = a[0]; e = a[1];
		h0 = Code.getChild(d,0).value; m0 = Code.getChild(d,1).value;
		h1 = Code.getChild(e,0).value; m1 = Code.getChild(e,1).value;
		if(h0!=""&&m0!=""&&h1!=""&&m1!=""){
			found = true;
			str += Code.prependFixed(h0,"0",2)+":"+Code.prependFixed(m0,"0",2)+":00.0000";
			str += "+";
			str += Code.prependFixed(h1,"0",2)+":"+Code.prependFixed(m1,"0",2)+":00.0000";
		}
		if(i<lm1){
			str += ",";
		}
	}
	// ERROR CHECKING
	//console.log(position_id===undefined,position_id===null,position_id=="");
	if(position_id==""){ console.log("empty pid"); }
	if(start_day==""||start_month==""||start_year==""){ console.log("invalid start"); }
	if(end_day==""||end_month==""||end_year==""){ console.log("invalid end"); }
	if(!found){ console.log("no dates"); }
	// RETURN LIST
	return [startDate, endDate, str, position_id];
}

// ------------------------------------------------------------------------------ events
/*PageShifts.prototype._onClickSubmitSchedulePassthrough = function(e){
	this.element._onClickSubmitSchedule.call(this.element,e);
}*/
PageShifts.prototype._onClickSubmitSchedule = function(e){
	var a = this.generateShiftString();
	if(a==null){ console.log("ERROR"); return; }
	var startDate = a[0], endDate = a[1], algorithm = a[2], position_id = a[3];
	// fake
	startDate = "2013-07-01 00:00:00.0000";
	endDate = "2013-07-01 24:00:00.0000";
	algorithm = "M06:00:00.0000-01:00:00.0000,T,W,R,F,S,U";
	position_id = "1";
	this._interface.submitShiftCreate(startDate,endDate,algorithm,position_id, this,this._submitScheduleCallback);
}
PageShifts.prototype._submitScheduleCallback = function(o){
	console.log(o);
}
// ------------------------------------------------------------------------------ utilities
PageShifts.prototype.generateLeftColumn = function(str,cont){
	left = Code.addCell(cont);
	Code.addClass(left,"shiftsEditColLeft");
	Code.setContent(left,str);
	return left;
}
PageShifts.prototype.generateRightColumn = function(ele,cont){
	right = Code.addCell(cont);
	Code.addClass(right,"shiftsEditColRight");
	Code.addChild(right,ele);
	return right;
}
PageShifts.prototype.generateSelectionDate = function(ele, sta,sto,iunno){
	var i, j, sel, row, opt;
	var monthsOfYear = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	row = Code.newDiv();
	// DAYS
	sel = Code.newElement("select"); sel.setAttribute("name","days");Code.addChild(row,sel);
	for(j=0;j<31;++j){
		if(j==0){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(Code.prependFixed(""+j, "0", 2),""+j); }
		Code.addChild(sel,opt);
	}
	// MONTHS
	sel = Code.newElement("select"); sel.setAttribute("name","months"); Code.addChild(row,sel);
	for(j=-1;j<12;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(monthsOfYear[j],""+j); }
		Code.addChild(sel,opt);
	}
	// YEARS
	sel = Code.newElement("select"); sel.setAttribute("name","years"); Code.addChild(row,sel);
	var yearStart = 2013-1, yearEnd = 2020+1;
	for(j=yearStart;j<yearEnd;++j){
		if(j==yearStart){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(""+j,""+j); }
		Code.addChild(sel,opt);
	}
	Code.addClass(row,"shiftsInline");
	return row;
}
PageShifts.prototype.generateSelectionTime = function(){
	var sel, j, opt, row = Code.newDiv();
	// HOURS
	sel = Code.newSelect(); sel.setAttribute("name","hours"); Code.addChild(row,sel);
	for(j=-1;j<24;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption( Code.prependFixed(""+j,"0",2), ""+j ); }
		Code.addChild(sel,opt);
	}
	// MINUTES
	sel = Code.newSelect(); sel.setAttribute("name","minutes"); Code.addChild(row,sel);
	for(j=-1;j<60;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption( Code.prependFixed(""+j,"0",2), ""+j ); }
		Code.addChild(sel,opt);
	}
	Code.addClass(row,"shiftsInline");
	return row;
}
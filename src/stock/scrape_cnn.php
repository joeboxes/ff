<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');


// header("Access-Control-Allow-Origin: https://money.cnn.com");

// header("Access-Control-Allow-Origin: *");
// header('Access-Control-Allow-Origin: *');
// Access-Control-Allow-Origin
/*
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    echo "You have CORS!";
    */

?>

<html>
<head>
<title>Scrape CNN</title>
<script src="../code/FF.js"></script>
</head>
<script type="text/javascript">
function pageLoadedFxn(){
	var ff = new FF("../code/",ffLoadedFxn);
}
function ffLoadedFxn(){
	(new ScriptLoader("./",[],this,classesLoadedFxn)).load();
}
global_symbols = null;
global_data = [];
function classesLoadedFxn(){
//	console.log("ready");

	var symbols = [
// "CMG",
// "SYY",

		"AAL",
		"AAPL",
		"ABNB",
		"AI",
		"AIR",
		"ALK",
		"AMD",
		"AMZN",
		"APLE",
		"AZN",
		"BA",
		"BABA",
		"BBWI",
		"BBBY",
		"BLMN",
		"BJ",
		"BNTX",

		"CAKE",
		"CBRE",
		"CBRL",
		"COST",
		"CLDT",
		"CMG",
		"CR",
		"CSCO",
		"CVS",
		"CWK",

		"DAL",
		"DASH",
		"DENN",
		"DIN",
		"DIS",

		"EPR",
		"ETSY",


		"F",
		"FL",

		"GD",
		"GE",
		"GME",
		"GOLF",
		"GOOG",
		"GS",

		"HA",
		"HD",

		"ICE",
		"IMBI",
		"INTC",
		"INTU",

		"JAKK",
		"JBLU",
		"JD",
		"JNJ",
		"JPM",
		"JWN",

		"K",
		"KO",
		"KR",

		"LOW",
		"LOVE",
		"LMT",
		"LUV",
		"LYFT",

		"M",
//		"MAIN",
		"MBUU",
		"MDB",
		"META",
		"MRK",
		"MRNA",
		"MSFT",

		"NCLH",
		"NFLX",
		"NKE",
		"NNN",
		"NVDA",

		"O",
		"ORCL",
		"OSTK",

		"PATH",
		"PEP",
		"PFE",
		"PLAY",
		"PLYA",
		"PLBY",
		"PG",

		"RBLX",
		"RIVN",
		"RMCF",
		"RMR",
		"ROKU",
		"RRGB",
		"RTX",

		"SAVE",
		"SBUX",
		"SKYW",
		"SNAP",
		"SQ",
		"STKH",
//		"STOR",
		"SYY",


		"TEAM",
		"TGT",
		"TJX",
		"TMUS",
		"TSLA",
		"TSN",
		"TTWO",
		"TXT",
		
		"UAL",
		"UBER",
		"UPST",

		"VAC",
		"VSTO",

		"WBA",
		"WFG",
		"WH",
		"WOOF",
		"WMT",
		"WYNN",

		"Z",
		"ZG"

		];

/*
	symbols.sort(function(a,b){
		return a < b ? -1 : 1;
	});



*/



	global_symbols = symbols;
	checkMakeRequest();
}
function checkMakeRequest(){

//console.log(global_symbols+"");
if(global_symbols==null || global_symbols.length==0){
//	console.log("done");
	printResults();
	return;
}
var ticker = global_symbols.shift();
// console.log("ticker: "+ticker);
global_ticker = ticker;
	var ajax = new Ajax();
	//console.log(ajax);
	var cnnUrl = "https://money.cnn.com/quote/forecast/forecast.html?symb="+ticker;
	//console.log("cnnUrl: '"+cnnUrl+"'");
	var url = "http://localhost/repos/ff/src/stock/request_forward.php"

	//console.log("  > "+url);
	ajax.binary(false);
	ajax.method(Ajax.METHOD_TYPE_GET);
	ajax.url(url);
	ajax.params({
		"url":cnnUrl
	});
/*
	ajax.headers({
		"apiKey":this._apiKey,
		"adjusted":true,
	});
*/
/*
header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");
*/

	ajax.callback(requestComplete);
//	ajax.callback(null);
	ajax.go();
}

function requestComplete(contents){
	// console.log(contents);
	var ticker = global_ticker;
console.log(ticker);

	// 
	var valueMedian = contents.match(/median target of ([0-9]*,?[0-9]*.?[0-9]*),/g);
	// console.log(valueMedian);
	if(!valueMedian){
		console.log("no median value");
		checkMakeRequest();
		return;
	}else{
		valueMedian = valueMedian[0];
		valueMedian = valueMedian.replace("median target of ","");
	//	console.log(valueMedian);
		valueMedian = valueMedian.replaceAll(",","");
	//	console.log(valueMedian);
		valueMedian = Number(valueMedian);
	}

	// 
	var valueLow = contents.match(/a low estimate of ([0-9]*,?[0-9]*.?[0-9]*)/g);
//	console.log(valueLow);
	valueLow = valueLow[0];
	valueLow = valueLow.replace("a low estimate of ","");
//	console.log(valueLow);
	valueLow = valueLow.replaceAll(",","");
//	console.log(valueLow);
	valueLow = Number(valueLow);
//	console.log(valueLow);

	// 
	var valueHigh = contents.match(/high estimate of ([0-9]*,?[0-9]*.?[0-9]*) /g);
//	console.log(valueHigh);
	valueHigh = valueHigh[0];
	valueHigh = valueHigh.replace("high estimate of ","");
//	console.log(valueHigh);
	valueHigh = valueHigh.replaceAll(",","");
	valueHigh = valueHigh.replace(" ","");
//	console.log(valueHigh);
	valueHigh = Number(valueHigh);
//	console.log(valueHigh);

	var valueNow = contents.match(/last price of ([0-9]*,?[0-9]*.?[0-9]*)/g);
//	console.log(valueNow);
	valueNow = valueNow[0];
	valueNow = valueNow.replace("last price of ","");
//	console.log(valueNow);
	valueNow = valueNow.replaceAll(",","");
//	valueNow = valueNow.replace(",","");
//	console.log(valueNow);
	valueNow = Number(valueNow);
//	console.log(valueNow);



	var analysts = contents.match(/The ([0-9]*) analysts offering/g);
// console.log(analysts);
	analysts = analysts[0];
	analysts = analysts.replace("The","");
	analysts = analysts.replace("analysts offering","");
	analysts = Number(analysts);


	// var action = contents.match(/is to (hold|Buy|sell) stock/g);
	var action = contents.match(/class="wsod_rating">(Hold|Buy|Sell)</g);
// console.log(action);
	action = action[0];
	action = action.replace("class=\"wsod_rating\">","");
	action = action.replace("<","");
	action = action.replace(" ","");
	action = action.toLowerCase();




	var valueIncrease = (valueMedian-valueNow);

	var data = {};
	data["analysts"] = analysts;
	data["action"] = action;
	data["ticker"] = ticker;
	data["low"] = valueLow;
	data["high"] = valueHigh;
	data["median"] = valueMedian;
	data["value"] = valueNow;
	data["increase"] = valueIncrease;
	data["percentIncrease"] = valueIncrease/valueNow;
	data["insideRange"] = valueNow > valueLow ? true : false;

console.log(data);


// throw "...";

global_data.push(data);

	/*
	curl "https://money.cnn.com/quote/forecast/forecast.html?symb=TXT"
x 	median target of (NUMBER), 
    with a high estimate of 93.00 and
	a low estimate of (NUMBER).
	increase from the last price of (NUMBER).


	*/

	checkMakeRequest();
}



function printResults(){
	//console.log(global_data);
	global_data.sort(function(a,b){
		if(a["insideRange"] && !b["insideRange"]){
			return 1;
		}
		if(!a["insideRange"] && b["insideRange"]){
			return -1;
		}
		if(a["percentIncrease"] > b["percentIncrease"]){
			return -1;
		}
		return 1;
	});
	console.log(global_data);
	var output = "";
	var scale = 10000;
	for(var i=0; i<global_data.length; ++i){
		var data = global_data[i];
		var increase = data["percentIncrease"];
		var analysts = data["analysts"];
		var action = data["action"];
		var percent = increase;
			percent = Math.round(percent*scale)/scale;
		var line = Code.padStringRight(data["ticker"]+"",6," ")+" : "+
			(data["insideRange"] ? "[+]" : "[-]" )+" "+Code.padStringRight(percent+"",7," ")+"  "+
			Code.padStringLeft(data["value"]+"",8," ")+" -> "+Code.padStringRight(data["median"]+"",8," ")+
			"  ["+Code.padStringRight(data["low"]+"",8," ")+", "+Code.padStringLeft(data["high"]+"",8," ")+
			"]   #"+Code.padStringRight(analysts+"",4," ")+" = "+action;
		if(increase<=0.10 || analysts<10){
			line = "x " +line+"";
		}else{
			line = "  " +line+"";
		}
		output = output + line+" \n";
	}
	console.log(output);
}


</script>
<body onload="pageLoadedFxn();">
</body>
</html>

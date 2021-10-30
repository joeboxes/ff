// index.js

function CameraApp(){
	this.setupDisplay();
	this._client = new CameraClient();
}
CameraApp.prototype.setupDisplay = function(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false, true);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	GLOBALSTAGE = this._stage;
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
}
CameraApp.prototype.testServerDLUP = function(){
	this._client.getCameraImage(this.uploadImage);
	// this.uploadImage("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz+Pjy+MjCqiojmVlRmRkRj///8z/xahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4+fiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg==");

}

CameraApp.prototype.uploadImage = function(base64){
	console.log("now upload image: ");
	// console.log(base64);
	var requestURL = "http://192.168.0.140/web/ff/cam/web/distributionServer/index.php";

	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.timeout(30000);
	ajax.context(this);

	ajax.url(requestURL);
	ajax.callback(function(response2){
		console.log("ajax callback - upload");
		console.log(response2);
		// var object = Code.parseJSON(response);
		// console.log(object);
	});
	var data = {};
		data["camera"] = "0";
		// data["data"] = base64;
		data["base64"] = base64;
	var jsonString = Code.stringFromJSON(data);

// console.log("jsonString: "+jsonString);

	var params = {};
		// params["path"] = Code.escapeURI("/camera/0/upload");
		params["path"] = "/camera/0/upload";
		params["data"] = jsonString;
//		params["data"] = base64;
	ajax.params(params);
	ajax.send();
	// 
}

function CameraClient(){
	this._serverDomain = "192.168.0.188";
	this._serverPort = "8000";
	var base = "http://"+this._serverDomain+":"+this._serverPort+"/";
	this._serverBase = base;
	this._ajax = null;
}
CameraClient.prototype._setupAjax = function(){
	if(this._ajax){
		this._ajax.kill();
	}
	this._ajax = new Ajax();
	this._ajax.method(Ajax.METHOD_TYPE_GET);
	this._ajax.timeout(30000);
	this._ajax.context(this);
	return this._ajax;
}
CameraClient.prototype.getCameraImage = function(callbackBase64){
	console.log("getCameraImage");
	
	var base = this._serverBase;
	var requestURL = base+"camera/0/image";

	var ajax = this._setupAjax();
	ajax.url(requestURL);
	ajax.callback(function(response,a){
		console.log("ajax callback");
		console.log(response);
		var object = Code.parseJSON(response);
		console.log(object);
		var imageSourceBase64 = object["data"]["base64"];
		if(imageSourceBase64){
			// console.log(imageBase64);
			if(callbackBase64){
				callbackBase64(imageSourceBase64);
			}

			var imageBase64 = Code.appendHeaderBase64(imageSourceBase64, "jpg");
			var imageSource = Code.generateImageFromBit64encode(imageBase64, function(info){
				// console.log(info);
				// console.log(imageSource);
					// var img = GLOBALSTAGE.getImageMatAsImage(scales);
					

					var d = new DOImage(imageSource);
					d.matrix().translate(10, 10);
					GLOBALSTAGE.addChild(d);
			});
			// var imageBinary = Code.base64StringToBinary(imageBase64);
			// console.log(imageBinary);
			// var image
		}
	});
	var params = {};
		params["clientID"] = "A";
		params["clientKey"] = "ABC";
		params["requestID"] = "123";
	// ajax.method(Ajax.METHOD_TYPE_GET);
	ajax.params(params);
	ajax.send();
}



/*

curl http://192.168.0.188:8000/
{"status":"success","requestID":"123","data":{"modified":"2021-08-03:14:15:16.1234","base64":"..."}}

*/


// ..
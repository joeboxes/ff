// ImageLoader.js

function ImageLoader(base,arr,obj){
	var self = this;
	var files = new Array();
	var images = new Array();
	var index = 0;
	var fxnComplete = null;
	setLoadList(base,arr,obj);
	this.setLoadList = setLoadList;
	function setLoadList(base,arr){
		Code.emptyArray(files);
		Code.emptyArray(images);
		var i;
		for(i=0;i<arr.length;++i){
			files.push(base+""+arr[i]);
		}
	}
	
	this.load = load;
	function load(){
		index = -1;
		next(null);
	}
	function next(e){
		if(e!=null){
			images[index] = e.target;
		}
		++index;
		if(index>=files.length){
			if(fxnComplete!=null){
				fxnComplete(images);
			}
			Code.emptyArray(images);
			return;
		}
		var img = new Image(); //images[index] = img;
		img.addEventListener("load",next,false);
		img.src = files[index];
		if(self.verbose){
            console.log("loading image: "+files[index]);
        }
	}
	this.setFxnComplete = setFxnComplete;
	function setFxnComplete(fxn){
		fxnComplete = fxn;
	}
	this.kill = kill;
	function kill(){
		
	}
}




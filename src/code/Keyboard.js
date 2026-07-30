// Keyboard.js
Keyboard.KEY_TAB = 9;
Keyboard.KEY_ENTER = 13;
Keyboard.KEY_SHIFT = 16;
Keyboard.KEY_CTRL = Keyboard.KEY_CONTROL = 17;
Keyboard.KEY_ALT = Keyboard.KEY_ALTERNATE = 18; // mac: option
Keyboard.KEY_CAP = Keyboard.KEY_CAPS = Keyboard.KEY_SPACE = CAPSLOCK = 20;
Keyboard.KEY_ESC = 27;
Keyboard.KEY_SPACE = 32;
Keyboard.KEY_UP = 38;
Keyboard.KEY_LF = Keyboard.KEY_LEFT = 37;
Keyboard.KEY_RT = Keyboard.KEY_RIGHT = 39;
Keyboard.KEY_DN = Keyboard.KEY_DOWN = 40;
Keyboard.KEY_LET_A = 65;
Keyboard.KEY_LET_B = 66;
Keyboard.KEY_LET_C = 67;
Keyboard.KEY_LET_D = 68;
Keyboard.KEY_LET_E = 69;
Keyboard.KEY_LET_F = 70;
Keyboard.KEY_LET_G = 71;
Keyboard.KEY_LET_H = 72;
Keyboard.KEY_LET_I = 73;
Keyboard.KEY_LET_J = 74;
Keyboard.KEY_LET_K = 75;
Keyboard.KEY_LET_L = 76;
Keyboard.KEY_LET_M = 77;
Keyboard.KEY_LET_N = 78;
Keyboard.KEY_LET_O = 79;
Keyboard.KEY_LET_P = 80;
Keyboard.KEY_LET_Q = 81;
Keyboard.KEY_LET_R = 82;
Keyboard.KEY_LET_S = 83;
Keyboard.KEY_LET_T = 84;
Keyboard.KEY_LET_U = 85;
Keyboard.KEY_LET_V = 86;
Keyboard.KEY_LET_W = 87;
Keyboard.KEY_LET_X = 88;
Keyboard.KEY_LET_Y = 89;
Keyboard.KEY_LET_Z = 90;
Keyboard.KEY_NUM_0 = 48;
Keyboard.KEY_NUM_1 = 49;
Keyboard.KEY_NUM_2 = 50;
Keyboard.KEY_NUM_3 = 51;
Keyboard.KEY_NUM_4 = 52;
Keyboard.KEY_NUM_5 = 53;
Keyboard.KEY_NUM_6 = 54;
Keyboard.KEY_NUM_7 = 55;
Keyboard.KEY_NUM_8 = 56;
Keyboard.KEY_NUM_9 = 57;
Keyboard.KEY_COMMA = 188;
Keyboard.KEY_PERIOD = 190;

Keyboard.KEY_COMMAND = 91; // mac
Keyboard.EVENT_KEY_UP = "kbdevtkup";
Keyboard.EVENT_KEY_DOWN = "kbdevtkdn";
Keyboard.EVENT_KEY_STILL_DOWN = "kbdevtksd";
// ----------------------------------------------------------------------------
function Keyboard(){
	Keyboard._.constructor.call(this);
	this._key = new Array(255);
	this._falseKeys();
	this._jsDispatch = new JSDispatch();
}
Code.inheritClass(Keyboard, Dispatchable);
// ----------------------------------------------------------------------------
Keyboard.prototype._falseKeys = function(){
	for(var i=0;i<=255;++i){
		this._key[i] = false;
	}
}
Keyboard.prototype.addListeners = function(){
	this._jsDispatch.addJSEventListener(window, Code.JS_EVENT_KEY_UP, this._keyUpFxn, this);
	this._jsDispatch.addJSEventListener(window, Code.JS_EVENT_KEY_DOWN, this._keyDownFxn, this);
}
Keyboard.prototype.removeListeners = function(){
	this._jsDispatch.removeJSEventListener(window, Code.JS_EVENT_KEY_UP, this._keyUpFxn, this);
	this._jsDispatch.removeJSEventListener(window, Code.JS_EVENT_KEY_DOWN, this._keyDownFxn, this);
}
Keyboard.prototype._keyDownFxn = function(e){
	var num = Code.getKeyCodeFromKeyboardEvent(e);
	if( this._key[num]==false ){ // on first down
		this._key[num] = true;
		this.alertAll(Keyboard.EVENT_KEY_DOWN,e);
	}else{
		this.alertAll(Keyboard.EVENT_KEY_STILL_DOWN,e);
	}
}
Keyboard.prototype._keyUpFxn = function(e){
	var num = Code.getKeyCodeFromKeyboardEvent(e);
	this._key[num] = false;
	this.alertAll(Keyboard.EVENT_KEY_UP,e);
}
Keyboard.prototype._keyIsDown = function(num){
	return this._key[num];
}
Keyboard.prototype.isKeyDown = function(num){
	return this._keyIsDown(num);
}
Keyboard.prototype.kill = function(){
	Code.emptyArray(this._keys);
	this._jsDispatch.kill();
	this._jsDispatch = null;
	Keyboard._.kill.call(this);
}

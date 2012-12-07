// Keyboard.js
Keyboard.EVENT_KEY_DOWN = "kbdevtkdn";
Keyboard.EVENT_KEY_UP = "kbdevtkup";

function Keyboard(){
	var key = new Array();
	var dispatch = new Dispatch();
	function fillKeys(){
		var i;
		for(i=0;i<=255;++i){
			key[i] = false;
		}
	}
	// dispatch -----------------------------------------------------------
	this.addFunction = addFunction;
	function addFunction(str,fxn){
		dispatch.addFunction(str,fxn);
	}
	this.removeFunction = removeFunction;
	function removeFunction(str,fxn){
		dispatch.removeFunction(str,fxn);
	}
	this.alertAll = alertAll;
	function alertAll(str,o){
		dispatch.alertAll(str,o);
	}
	// LISTENERS ----------------------------------------------------------
	this.addListeners = addListeners;
	function addListeners(){
		addEventListener('keydown', keyDownFxn);
		addEventListener('keyup', keyUpFxn);
	}
	this.removeListeners = removeListeners;
	function removeListeners(){
		removeEventListener('keydown', keyDownFxn);
		removeEventListener('keyup', keyUpFxn);
	}
	function keyDownFxn(e){
		var num = e.keyCode;
		if( key[num]==false ){ // on first down
			key[num] = true;
			dispatch.alertAll(Keyboard.EVENT_KEY_DOWN,num);
		}
	}
	function keyUpFxn(e){
		var num = e.keyCode;
		key[num] = false;
		dispatch.alertAll(Keyboard.EVENT_KEY_UP,num);
	}
	this.keyIsDown = keyIsDown;
	function keyIsDown(num){
		return key[num];
	}
// --------------------------------------------------------- constructor
	fillKeys();
}
// constants:
Keyboard.KEY_TAB = 9;
Keyboard.KEY_SHIFT = 16;
Keyboard.KEY_CTRL = Keyboard.KEY_CONTROL = 17;
Keyboard.KEY_ALT = Keyboard.KEY_ALTERNATE = 18;
Keyboard.KEY_CAP = Keyboard.KEY_CAPS = Keyboard.KEY_SPACE = CAPSLOCK = 20;
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
// ..







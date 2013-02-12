// ResourceSpice.js
// TEXTURES -----------------------------------
ResourceSpice.TEX_DEBUG_1 = 0;
ResourceSpice.TEX_BACKGROUND_GRID_1 = 1;
	// WINDOW IMAGES ---------------------------------------
	ResourceSpice.TEX_WIN_BAR_LEFT_ACTIVE_RED = 2;
	ResourceSpice.TEX_WIN_BAR_LEFT_INACTIVE_RED = 3;
	ResourceSpice.TEX_WIN_BAR_CEN_ACTIVE_RED = 4;
	ResourceSpice.TEX_WIN_BAR_CEN_INACTIVE_RED = 5;
	ResourceSpice.TEX_WIN_BAR_RIGHT_ACTIVE_RED = 6;
	ResourceSpice.TEX_WIN_BAR_RIGHT_INACTIVE_RED = 7;
	ResourceSpice.TEX_WIN_BODY_TOP_LEFT_RED = 8;
	ResourceSpice.TEX_WIN_BODY_TOP_CEN_RED = 9;
	ResourceSpice.TEX_WIN_BODY_TOP_RIGHT_RED = 10;
	ResourceSpice.TEX_WIN_BODY_MID_LEFT_RED = 11;
	ResourceSpice.TEX_WIN_BODY_MID_CEN_RED = 12;
	ResourceSpice.TEX_WIN_BODY_MID_RIGHT_RED = 13;
	ResourceSpice.TEX_WIN_BODY_BOT_LEFT_RED = 14;
	ResourceSpice.TEX_WIN_BODY_BOT_CEN_RED = 15;
	ResourceSpice.TEX_WIN_BODY_BOT_RIGHT_RED = 16;
	ResourceSpice.TEX_WIN_ICON_CLOSE_ACTIVE_RED = 17;
	ResourceSpice.TEX_WIN_ICON_CLOSE_UP_RED = 18;
	ResourceSpice.TEX_WIN_ICON_CLOSE_DOWN_RED = 19;
	ResourceSpice.TEX_WIN_ICON_CLOSE_INACTIVE_RED = 20;
	ResourceSpice.TEX_WIN_ICON_MIN_ACTIVE_RED = 21;
	ResourceSpice.TEX_WIN_ICON_MIN_UP_RED = 22;
	ResourceSpice.TEX_WIN_ICON_MIN_DOWN_RED = 23;
	ResourceSpice.TEX_WIN_ICON_MIN_INACTIVE_RED = 24;
	ResourceSpice.TEX_WIN_ICON_MAX_ACTIVE_RED = 25;
	ResourceSpice.TEX_WIN_ICON_MAX_UP_RED = 26;
	ResourceSpice.TEX_WIN_ICON_MAX_DOWN_RED = 27;
	ResourceSpice.TEX_WIN_ICON_MAX_INACTIVE_RED = 28;
	// CIRCUIT IMAGES ---------------------------------------
	ResourceSpice.TEX_CIRCUIT_RESISTOR_RED = 29;
	ResourceSpice.TEX_CIRCUIT_CAPACITOR_RED = 30;
	ResourceSpice.TEX_CIRCUIT_INDUCTOR_RED = 31;
	ResourceSpice.TEX_CIRCUIT_DIODE_RED = 32;
	ResourceSpice.TEX_CIRCUIT_SOURCE_VOLTAGE_RED = 33;
	ResourceSpice.TEX_CIRCUIT_SOURCE_CURRENT_RED = 34;
	ResourceSpice.TEX_CIRCUIT_CURRENT_DEPENDENT_CURRENT_RED = 35;
	ResourceSpice.TEX_CIRCUIT_CURRENT_DEPENDENT_VOLTAGE_RED = 36;
	ResourceSpice.TEX_CIRCUIT_VOLTAGE_DEPENDENT_CURRENT_RED = 37;
	ResourceSpice.TEX_CIRCUIT_VOLTAGE_DEPENDENT_VOLTAGE_RED = 38;
	ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED = 39;
	ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED = 40;
	// CHIP IMAGES ---------------------------------------------
	ResourceSpice.TEX_CIRCUIT_CHIP_CENTER = 41;
	ResourceSpice.TEX_CIRCUIT_CHIP_CORNER = 42;
	ResourceSpice.TEX_CIRCUIT_CHIP_KEY = 43;
	ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_CLEAR = 44;
	ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_PIN = 45;
	ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_KEY = 46;
	ResourceSpice.TEX_CIRCUIT_CHIP_PIN_OPEN = 47;
	ResourceSpice.TEX_CIRCUIT_CHIP_PIN_CLOSED = 48;
	//ResourceSpice.TEX_CIRCUIT__RED = ;
	//  ---------------------------------------
ResourceSpice.TEX_X = 0;
// MAPS ---------------------------------------
ResourceSpice.MAP_X = 0;
// SOUNDS -------------------------------------
ResourceSpice.SND_X = 0;
// SYMBOLS -------------------------------------
ResourceSpice.SYM_X = 0;

function ResourceSpice(){
	var self = this;
	Code.extendClass(self,Resource);
	// 
	self.loadMore = function(){
		// .. load something else
	};
	// CONSTRUCTOR
	var texdir = "../spice/images/";
	var tex = new Array();
	tex[ResourceSpice.TEX_DEBUG_1] = "debug_texture.png";
	tex[ResourceSpice.TEX_BACKGROUND_GRID_1] = "circuit/background_grid.png";
	tex[ResourceSpice.TEX_WIN_BAR_LEFT_ACTIVE_RED] = "window/win_bar_left_active.png";
	tex[ResourceSpice.TEX_WIN_BAR_LEFT_INACTIVE_RED] = "window/win_bar_left_inactive.png";
	tex[ResourceSpice.TEX_WIN_BAR_CEN_ACTIVE_RED] = "window/win_bar_cen_active.png";
	tex[ResourceSpice.TEX_WIN_BAR_CEN_INACTIVE_RED] = "window/win_bar_cen_inactive.png";
	tex[ResourceSpice.TEX_WIN_BAR_RIGHT_ACTIVE_RED] = "window/win_bar_right_active.png";
	tex[ResourceSpice.TEX_WIN_BAR_RIGHT_INACTIVE_RED] = "window/win_bar_right_inactive.png";
	tex[ResourceSpice.TEX_WIN_BODY_TOP_LEFT_RED] = "window/win_body_top_left.png";
	tex[ResourceSpice.TEX_WIN_BODY_TOP_CEN_RED] = "window/win_body_top_cen.png";
	tex[ResourceSpice.TEX_WIN_BODY_TOP_RIGHT_RED] = "window/win_body_top_right.png";
	tex[ResourceSpice.TEX_WIN_BODY_MID_LEFT_RED] = "window/win_body_mid_left.png";
	tex[ResourceSpice.TEX_WIN_BODY_MID_CEN_RED] = "window/win_body_mid_cen.png";
	tex[ResourceSpice.TEX_WIN_BODY_MID_RIGHT_RED] = "window/win_body_mid_right.png";
	tex[ResourceSpice.TEX_WIN_BODY_BOT_LEFT_RED] = "window/win_body_bot_left.png";
	tex[ResourceSpice.TEX_WIN_BODY_BOT_CEN_RED] = "window/win_body_bot_cen.png";
	tex[ResourceSpice.TEX_WIN_BODY_BOT_RIGHT_RED] = "window/win_body_bot_right.png";
	tex[ResourceSpice.TEX_WIN_ICON_CLOSE_ACTIVE_RED] = "window/win_button_close_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_CLOSE_UP_RED] = "window/win_button_close_up.png";
	tex[ResourceSpice.TEX_WIN_ICON_CLOSE_DOWN_RED] = "window/win_button_close_down.png";
	tex[ResourceSpice.TEX_WIN_ICON_CLOSE_INACTIVE_RED] = "window/win_button_close_inactive.png";
	tex[ResourceSpice.TEX_WIN_ICON_MIN_ACTIVE_RED] = "window/win_button_min_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MIN_UP_RED] = "window/win_button_min_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MIN_DOWN_RED] = "window/win_button_min_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MIN_INACTIVE_RED] = "window/win_button_min_inactive.png";
	tex[ResourceSpice.TEX_WIN_ICON_MAX_ACTIVE_RED] = "window/win_button_max_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MAX_UP_RED] = "window/win_button_max_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MAX_DOWN_RED] = "window/win_button_max_active.png";
	tex[ResourceSpice.TEX_WIN_ICON_MAX_INACTIVE_RED] = "window/win_button_max_inactive.png";
	// 
	tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_CAPACITOR_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_INDUCTOR_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_DIODE_RED] = "circuit/diode_hollow.png";
	tex[ResourceSpice.TEX_CIRCUIT_SOURCE_VOLTAGE_RED] = "circuit/dc_voltage.png";
	tex[ResourceSpice.TEX_CIRCUIT_SOURCE_CURRENT_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_CURRENT_DEPENDENT_CURRENT_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_CURRENT_DEPENDENT_VOLTAGE_RED ] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_VOLTAGE_DEPENDENT_CURRENT_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_VOLTAGE_DEPENDENT_VOLTAGE_RED] = "circuit/resistor.png";
	tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED] = "circuit/pin_connect.png";
	tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED] = "circuit/pin_disconnect.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_CENTER] = "circuit/chip_center.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_CORNER] = "circuit/chip_corner.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_KEY] = "circuit/chip_key.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_CLEAR] = "circuit/chip_side_clear.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_PIN] = "circuit/chip_side_pin.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_KEY] = "circuit/chip_side_key.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_PIN_OPEN] = "circuit/chip_pin_open.png";
	tex[ResourceSpice.TEX_CIRCUIT_CHIP_PIN_CLOSED] = "circuit/chip_pin_closed.png";
	//
	self.imgLoader.setLoadList( texdir, tex, self );
	self.fxnLoader.setLoadList( new Array(self.loadMore), self );
}


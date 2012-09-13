// ResourceIsometic.js

// TEXTURES -----------------------------------
ResourceCFT.TEX_BOX_BLANK_1 = 0;
ResourceCFT.TEX_BOX_GRASS_1 = 1;
ResourceCFT.TEX_CHAR_BLANK_1 = 2;
ResourceCFT.TEX_CHAR_GIRL_1 = 3;
ResourceCFT.TEX_LADDER_BLANK_1 = 4;
ResourceCFT.TEX_LADDER_GOLD_1 = 5;
ResourceCFT.TEX_PORTAL_BLANK_1 = 6;
ResourceCFT.TEX_PORTAL_GOLD_1 = 7;
ResourceCFT.TEX_DIAMOND_YELLOW_1 = 8;
ResourceCFT.TEX_IPHONE_1 = 9;
ResourceCFT.TEX_PIXY_REGULAR_1 = 10;
ResourceCFT.TEX_PIXY_TALL_1 = 11;
ResourceCFT.TEX_PIXY_WIDE_1 = 12;
ResourceCFT.TEX_BACKGROUND_CLOUDS_1 = 13;
ResourceCFT.TEX_DRAW_BACKGROUND_1 = 14;
ResourceCFT.TEX_DRAW_TOOLBAR_1 = 15;
ResourceCFT.TEX_DRAW_BLOCK_BLANK_1 = 16;
ResourceCFT.TEX_DRAW_BLOCK_COLOR_1 = 17;
ResourceCFT.TEX_DRAW_CHAR_BLANK_1 = 18;
ResourceCFT.TEX_DRAW_CHAR_COLOR_1 = 19;
ResourceCFT.TEX_DRAW_LADDER_BLANK_1 = 20;
ResourceCFT.TEX_DRAW_LADDER_COLOR_1 = 21;
ResourceCFT.TEX_DRAW_PORTAL_BLANK_1 = 22;
ResourceCFT.TEX_DRAW_PORTAL_COLOR_1 = 23;
ResourceCFT.TEX_INVENTORY_1 = 24;
ResourceCFT.TEX_BUBBLE_1 = 25;
ResourceCFT.TEX_DRAW_BG_BLANK_1 = 26;
ResourceCFT.TEX_DRAW_BG_COLOR_1 = 27;

ResourceCFT.TEX_1 = 0;
// MAPS ---------------------------------------
ResourceCFT.MAP_1 = 0;
// SOUNDS -------------------------------------
ResourceCFT.SND_1 = 0;
// SYMBOLS -------------------------------------

function ResourceCFT(){
	Code.extendClass(this,Resource);
	this.load1 = function(){
		// do custom stuff
	}
// ------------------------------------------------------- constructor
	var imgList = ["box_blank.png","box_filled.png","character_blank.png","character_filled.png","ladder_blank.png",
					"ladder_filled.png","portal_blank.png","portal_filled.png","sparkle_yellow.png", "iphone.png",
					"pixy_regular.png","pixy_tall.png", "pixy_wide.png","clouds_1.png","draw_bg.png",
					"draw_toolbar.png","draw_block_blank.png","draw_block_color.png","draw_character_blank.png","draw_character_color.png",
					"draw_ladder_blank.png","draw_ladder_color.png","draw_portal_blank.png","draw_portal_color.png","inventory.png",
					"bubble.png","draw_bg_blank.png","draw_bg_color.png"];
    var audList = ["Pop_02","powerup2"];
	this.imgLoader.setLoadList( "images/", imgList );
	this.audLoader.setLoadList( "audio/", audList );
    this.fxnLoader.setLoadList( new Array(this.load1) );
    this.imgLoader.verbose = true;
    this.audLoader.verbose = true;
}


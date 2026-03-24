/*global game, Phaser, localStorage, gs, console, util, document, navigator*/
/*global ClassSelectMenu, RaceSelectMenu, UIRecordMenu, MainMenu*/
/*global LARGE_WHITE_FONT, TILE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT, SCALE_FACTOR*/
/*global PLAYER_FRAMES, HUGE_WHITE_FONT, ITEM_SLOT_FRAME, NUM_SCREEN_TILES_X, SMALL_WHITE_FONT, ZONE_FADE_TIME, LARGE_RED_FONT*/
/*global MUSIC_ON_BUTTON_FRAME, MUSIC_OFF_BUTTON_FRAME*/
/*jshint esversion: 6*/

'use strict';

var menuState = {};


// MAIN_MENU_BASE:
// ************************************************************************************************
function MainMenuBase () {
	let tileIndex;
	
	// Group:
	this.group = game.add.group();
	this.group.fixedToCamera = true;
	
	// Create animated background
	this.createEnhancedBackground();
	
	// Game Title with glow effect
	this.titleSprite = gs.createSprite(120, 10, 'Title', this.group);
	this.addTitleGlowEffect();
	
	// Version Text with shadow
	this.versionText = gs.createText(4, 0, '版本: ' + gs.versionStr, SMALL_WHITE_FONT, this.group);
	this.addTextShadow(this.versionText);
	
	// Credits Text with enhanced styling
	this.creditsText = gs.createText(4, SCREEN_HEIGHT, '汉化: Jeason1997\n程序及美术: Justin Wang\n音效: www.kenney.nl 和 ArtisticDude\n音乐: Nooskewl Games', SMALL_WHITE_FONT, this.group);
	this.creditsText.anchor.setTo(0, 1);
	this.addTextShadow(this.creditsText);
	
	// Decorative elements
	this.createDecorativeElements();
	
	// User Name Text:
	//this.userNameText = gs.createText(400, SCREEN_HEIGHT - 24, 'UserName: ', LARGE_WHITE_FONT, menuGroup);
	
	this.group.visible = false;
}

// CREATE_ENHANCED_BACKGROUND:
// ************************************************************************************************
MainMenuBase.prototype.createEnhancedBackground = function () {
	// Create gradient background
	var bmp = game.add.bitmapData(SCREEN_WIDTH, SCREEN_HEIGHT);
	var ctx = bmp.context;
	
	// Create rich gradient background
	var grd = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
	grd.addColorStop(0, '#0f0f1e');
	grd.addColorStop(0.3, '#1a1a3e');
	grd.addColorStop(0.6, '#16213e');
	grd.addColorStop(1, '#0a0a1a');
	
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// Add subtle pattern overlay
	ctx.globalCompositeOperation = 'overlay';
	for (let i = 0; i < SCREEN_HEIGHT; i += 4) {
		ctx.fillStyle = 'rgba(255,255,255,0.02)';
		ctx.fillRect(0, i, SCREEN_WIDTH, 2);
	}
	
	// Create sprite from bitmap data
	var bg = game.add.sprite(0, 0, bmp);
	bg.fixedToCamera = true;
	this.group.add(bg);
	
	// Add floating particles
	this.createMenuParticles();
	
	// Add vignette effect
	this.createVignetteEffect();
};

// CREATE_MENU_PARTICLES:
// ************************************************************************************************
MainMenuBase.prototype.createMenuParticles = function () {
	this.menuParticles = [];
	
	for (let i = 0; i < 40; i++) {
		var particle = game.add.graphics(
			Math.random() * SCREEN_WIDTH,
			Math.random() * SCREEN_HEIGHT
		);
		particle.fixedToCamera = true;
		
		var size = 2 + Math.random() * 5;
		var alpha = 0.1 + Math.random() * 0.3;
		
		// Random colors in blue/purple range
		var colors = [0x4444ff, 0x8844ff, 0x4488ff, 0xffffff];
		var color = colors[Math.floor(Math.random() * colors.length)];
		
		particle.beginFill(color, alpha);
		particle.drawCircle(0, 0, size);
		particle.endFill();
		
		particle.vx = (Math.random() - 0.5) * 0.3;
		particle.vy = -0.2 - Math.random() * 0.3;
		particle.originalY = particle.y;
		particle.phase = Math.random() * Math.PI * 2;
		particle.pulseSpeed = 0.5 + Math.random() * 1.5;
		
		this.group.add(particle);
		this.menuParticles.push(particle);
	}
};

// CREATE_VIGNETTE_EFFECT:
// ************************************************************************************************
MainMenuBase.prototype.createVignetteEffect = function () {
	var bmp = game.add.bitmapData(SCREEN_WIDTH, SCREEN_HEIGHT);
	var ctx = bmp.context;
	
	var grd = ctx.createRadialGradient(
		SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT * 0.4,
		SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT * 0.9
	);
	grd.addColorStop(0, 'rgba(0,0,0,0)');
	grd.addColorStop(0.7, 'rgba(0,0,0,0.3)');
	grd.addColorStop(1, 'rgba(0,0,0,0.6)');
	
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// Create sprite from bitmap data
	var vignette = game.add.sprite(0, 0, bmp);
	vignette.fixedToCamera = true;
	this.group.add(vignette);
};

// ADD_TITLE_GLOW_EFFECT:
// ************************************************************************************************
MainMenuBase.prototype.addTitleGlowEffect = function () {
	// Create glow behind title
	var bmp = game.add.bitmapData(400, 100);
	var ctx = bmp.context;
	
	var grd = ctx.createRadialGradient(200, 50, 0, 200, 50, 150);
	grd.addColorStop(0, 'rgba(100, 150, 255, 0.4)');
	grd.addColorStop(0.5, 'rgba(80, 100, 200, 0.2)');
	grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
	
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 400, 100);
	
	// Create sprite from bitmap data
	var glow = game.add.sprite(120 + this.titleSprite.width / 2, 10 + this.titleSprite.height / 2, bmp);
	glow.fixedToCamera = true;
	this.group.add(glow);
	
	// Pulse animation
	var tween = game.add.tween(glow.scale);
	tween.to({ x: 1.1, y: 1.1 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
	
	this.titleGlow = glow;
};

// ADD_TEXT_SHADOW:
// ************************************************************************************************
MainMenuBase.prototype.addTextShadow = function (text) {
	text.setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);
};

// CREATE_DECORATIVE_ELEMENTS:
// ************************************************************************************************
MainMenuBase.prototype.createDecorativeElements = function () {
	// Add decorative corners
	var cornerSize = 30;
	
	// Top-left corner
	var tl = game.add.graphics(0, 0);
	tl.fixedToCamera = true;
	tl.lineStyle(2, 0x4444aa, 0.6);
	tl.moveTo(0, cornerSize);
	tl.lineTo(0, 0);
	tl.lineTo(cornerSize, 0);
	this.group.add(tl);
	
	// Top-right corner
	var tr = game.add.graphics(SCREEN_WIDTH - cornerSize, 0);
	tr.fixedToCamera = true;
	tr.lineStyle(2, 0x4444aa, 0.6);
	tr.moveTo(cornerSize, 0);
	tr.lineTo(0, 0);
	tr.lineTo(0, cornerSize);
	this.group.add(tr);
	
	// Bottom-left corner
	var bl = game.add.graphics(0, SCREEN_HEIGHT - cornerSize);
	bl.fixedToCamera = true;
	bl.lineStyle(2, 0x4444aa, 0.6);
	bl.moveTo(0, 0);
	bl.lineTo(0, cornerSize);
	bl.lineTo(cornerSize, cornerSize);
	this.group.add(bl);
	
	// Bottom-right corner
	var br = game.add.graphics(SCREEN_WIDTH - cornerSize, SCREEN_HEIGHT - cornerSize);
	br.fixedToCamera = true;
	br.lineStyle(2, 0x4444aa, 0.6);
	br.moveTo(cornerSize, cornerSize);
	br.lineTo(cornerSize, 0);
	br.lineTo(0, cornerSize);
	this.group.add(br);
};

// UPDATE:
// ************************************************************************************************
MainMenuBase.prototype.update = function () {
	var time = game.time.now / 1000;
	
	/*
	if (gs.globalData.userName && gs.globalData.userName.length >= 1) {
		this.userNameText.setText('User Name: ' + gs.globalData.userName);
		this.userNameText.setStyle(LARGE_WHITE_FONT);
	}
	else {
		this.userNameText.setText('Not logged in (see discord FAQ)');
		this.userNameText.setStyle(LARGE_RED_FONT);
	}
	*/
	
	// Update menu particles
	if (this.menuParticles) {
		for (let i = 0; i < this.menuParticles.length; i++) {
			let p = this.menuParticles[i];
			
			// Update position
			p.x += p.vx;
			p.y += p.vy;
			
			// Add sine wave motion
			p.x += Math.sin(time * p.pulseSpeed + p.phase) * 0.5;
			
			// Wrap around screen
			if (p.x < -10) p.x = SCREEN_WIDTH + 10;
			if (p.x > SCREEN_WIDTH + 10) p.x = -10;
			if (p.y < -10) p.y = SCREEN_HEIGHT + 10;
			if (p.y > SCREEN_HEIGHT + 10) p.y = -10;
			
			// Pulse alpha
			p.alpha = 0.1 + 0.2 * Math.sin(time * 2 + p.phase);
		}
	}
	
	// Pulse title glow
	if (this.titleGlow) {
		this.titleGlow.alpha = 0.6 + 0.2 * Math.sin(time * 3);
	}
	
	gs.mainMenu.update();
	
	if (gs.classSelectMenu.isOpen()) {
		gs.classSelectMenu.update();
	}
	else if (gs.recordMenu.isOpen()) {
		gs.recordMenu.update();
	}
	else if (gs.raceSelectMenu.isOpen()) {	
		gs.raceSelectMenu.update();
	}
	
	if (gs.debugProperties.menuMap) {
		// Changing background levels:
		this.count += 1;
		if (gs.vectorEqual(gs.toTileIndex(this.camPos), this.camDestIndex)) {
			// Only change level if enough time has passed:
			if (this.count >= 300) {
				this.count = 0;
				gs.destroyLevel();
				gs.loadRandomMapAsBackground();
			}

			// Get new destIndex:
			this.camDestIndex = gs.getOpenIndexInLevel();
			while( gs.vectorEqual(this.camDestIndex, gs.toTileIndex(this.camPos))) {
				this.camDestIndex = gs.getOpenIndexInLevel();
			}
			this.camVelocity = util.normal(gs.toTileIndex(this.camPos), this.camDestIndex);

		}

		// Panning Camera:
		this.camPos.x += this.camVelocity.x * 2;
		this.camPos.y += this.camVelocity.y * 2;
		game.camera.focusOnXY(this.camPos.x + 124, this.camPos.y);
		gs.updateTileMapSprites();

		gs.objectSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
	}
	
	
};

// START_GAME:
// ************************************************************************************************
MainMenuBase.prototype.startGame = function () {
	var func;
	
	func = function () {
		this.close();
		gs.startGame();
		game.camera.flash('#ffffff', ZONE_FADE_TIME * 4);
		game.camera.onFadeComplete.removeAll();
	}.bind(this);
	
	// Starting a fade:
	game.camera.fade('#000000', ZONE_FADE_TIME * 2);
    game.camera.onFadeComplete.add(func, this);
};

// START_GAME:
// ************************************************************************************************
MainMenuBase.prototype.close = function () {
	gs.mainMenu.close();
	gs.raceSelectMenu.close();
	gs.recordMenu.close();
	gs.classSelectMenu.close();
	
	this.close();
};

// OPEN:
// ************************************************************************************************
MainMenuBase.prototype.open = function () {
	var tileIndex;
	
	// Random Map Background:
	if (gs.debugProperties.menuMap) {
		gs.loadRandomMapAsBackground();
		gs.shadowMaskSprite.visible = false;
	}
	
	
	// Music:
	gs.stopAllMusic();
	
	// Music On:
	if (gs.musicOn) {
		gs.music.MainMenu.loopFull();
	}
	// Music Off:
	else {
		gs.stopAllMusic();
	}
	
	if (gs.debugProperties.menuMap) {
		tileIndex = gs.getOpenIndexInLevel();
		this.camPos = {x: tileIndex.x * TILE_SIZE - TILE_SIZE / 2, y: tileIndex.y * TILE_SIZE - TILE_SIZE / 2};

		// Get dest (not same as pos):
		this.camDestIndex = gs.getOpenIndexInLevel();
		while (gs.vectorEqual(this.camDestIndex, gs.toTileIndex(this.camPos))) {
			this.camDestIndex = gs.getOpenIndexInLevel();
		}

		this.camVelocity = util.normal(gs.toTileIndex(this.camPos), this.camDestIndex);
		this.count = 0;
	}
	
	

	
	this.group.visible = true;
};

// CLOSE:
// ************************************************************************************************
MainMenuBase.prototype.close = function () {
	gs.mainMenu.close();
	gs.raceSelectMenu.close();
	gs.classSelectMenu.close();
	gs.recordMenu.close();
	gs.optionsMenu.close();
	this.group.visible = false;
};





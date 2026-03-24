/*global game, gs, console, Phaser, util, PIXI*/
/*global TILE_SIZE, SCALE_FACTOR, SCREEN_WIDTH, SCREEN_HEIGHT, SHADOW_COLOR*/
/*global NUM_SCREEN_TILES_X, NUM_SCREEN_TILES_Y, HUD_START_X*/
/*jshint esversion: 6, laxbreak: true*/
'use strict';

// VISUAL EFFECTS MODULE
// This module provides enhanced visual effects for the game
// ************************************************************************************************

gs.visualEffects = {};

// Initialize visual effects system
// ************************************************************************************************
gs.initVisualEffects = function() {
    this.visualEffects.enabled = true;
    this.visualEffects.particleIntensity = 1.0;
    this.visualEffects.lightingEnabled = true;
    this.visualEffects.animationsEnabled = true;
    
    // Create effect containers
    this.createEffectLayers();
    
    // Initialize enhanced lighting
    this.initEnhancedLighting();
    
    // Initialize particle systems
    this.initParticleSystems();
    
    // Initialize screen effects
    this.initScreenEffects();
};

// Create layered effect containers for better organization
// ************************************************************************************************
gs.createEffectLayers = function() {
    // Background effects layer (behind everything)
    this.bgEffectsGroup = game.add.group();
    this.bgEffectsGroup.fixedToCamera = true;
    
    // Ambient effects layer
    this.ambientEffectsGroup = game.add.group();
    this.ambientEffectsGroup.fixedToCamera = false;
    
    // Foreground effects layer (in front of game objects)
    this.fgEffectsGroup = game.add.group();
    this.fgEffectsGroup.fixedToCamera = false;
    
    // UI effects layer
    this.uiEffectsGroup = game.add.group();
    this.uiEffectsGroup.fixedToCamera = true;
};

// ENHANCED LIGHTING SYSTEM
// ************************************************************************************************
gs.initEnhancedLighting = function() {
    this.enhancedLights = [];
    this.lightTexture = game.add.renderTexture(SCREEN_WIDTH, SCREEN_HEIGHT, 'lightTexture');
    this.lightSprite = game.add.sprite(0, 0, this.lightTexture);
    this.lightSprite.blendMode = PIXI.blendModes.MULTIPLY;
    this.lightSprite.fixedToCamera = true;
};

// Create dynamic light with enhanced effects
// ************************************************************************************************
gs.createDynamicLight = function(x, y, color, radius, intensity, flicker) {
    var light = {
        x: x,
        y: y,
        color: color,
        radius: radius,
        intensity: intensity || 1.0,
        flicker: flicker || false,
        flickerOffset: Math.random() * 100,
        pulsePhase: Math.random() * Math.PI * 2,
        graphics: game.add.graphics(0, 0)
    };
    
    this.enhancedLights.push(light);
    return light;
};

// Update all dynamic lights
// ************************************************************************************************
gs.updateDynamicLights = function() {
    var time = game.time.now / 1000;
    
    // Clear light texture
    this.lightTexture.clear();
    
    // Fill with darkness
    var darkness = game.add.graphics(0, 0);
    darkness.beginFill(0x000000, 0.7);
    darkness.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    darkness.endFill();
    
    // Render lights
    for (let i = 0; i < this.enhancedLights.length; i++) {
        let light = this.enhancedLights[i];
        let intensity = light.intensity;
        
        // Apply flicker effect
        if (light.flicker) {
            intensity *= (0.8 + 0.2 * Math.sin(time * 10 + light.flickerOffset));
        }
        
        // Apply pulse effect
        intensity *= (0.9 + 0.1 * Math.sin(time * 2 + light.pulsePhase));
        
        // Draw light
        light.graphics.clear();
        light.graphics.beginFill(parseInt(light.color.replace('#', ''), 16), intensity);
        light.graphics.drawCircle(light.x, light.y, light.radius);
        light.graphics.endFill();
        
        // Add to render texture
        this.lightTexture.render(light.graphics);
    }
};

// PARTICLE SYSTEMS
// ************************************************************************************************
gs.initParticleSystems = function() {
    this.particleSystems = {};
    
    // Ambient dust particles
    this.particleSystems.dust = this.createParticleSystem({
        maxParticles: 50,
        spawnRate: 0.1,
        lifespan: 300,
        colors: ['#ffffff', '#cccccc', '#999999'],
        alpha: [0.3, 0.1],
        scale: [0.5, 0.2],
        velocity: { x: [-0.5, 0.5], y: [-0.3, -0.8] },
        gravity: -0.01
    });
    
    // Magic particles
    this.particleSystems.magic = this.createParticleSystem({
        maxParticles: 100,
        spawnRate: 0.05,
        lifespan: 200,
        colors: ['#ff00ff', '#00ffff', '#ffff00'],
        alpha: [0.8, 0.2],
        scale: [1.0, 0.3],
        velocity: { x: [-1, 1], y: [-1, -2] },
        gravity: 0.02,
        rotation: true
    });
    
    // Fire particles
    this.particleSystems.fire = this.createParticleSystem({
        maxParticles: 80,
        spawnRate: 0.08,
        lifespan: 150,
        colors: ['#ff4400', '#ff8800', '#ffcc00'],
        alpha: [0.9, 0.3],
        scale: [1.2, 0.4],
        velocity: { x: [-0.3, 0.3], y: [-1.5, -2.5] },
        gravity: -0.02
    });
};

// Create a particle system
// ************************************************************************************************
gs.createParticleSystem = function(config) {
    return {
        config: config,
        particles: [],
        emitters: [],
        graphics: game.add.graphics(0, 0)
    };
};

// Emit particles from a position
// ************************************************************************************************
gs.emitParticles = function(systemName, x, y, count) {
    var system = this.particleSystems[systemName];
    if (!system) return;
    
    for (let i = 0; i < count; i++) {
        var particle = {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: system.config.velocity.x[0] + Math.random() * (system.config.velocity.x[1] - system.config.velocity.x[0]),
            vy: system.config.velocity.y[0] + Math.random() * (system.config.velocity.y[1] - system.config.velocity.y[0]),
            life: system.config.lifespan,
            maxLife: system.config.lifespan,
            color: system.config.colors[Math.floor(Math.random() * system.config.colors.length)],
            scale: system.config.scale[0],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        };
        
        system.particles.push(particle);
    }
};

// Update all particle systems
// ************************************************************************************************
gs.updateParticleSystems = function() {
    for (let name in this.particleSystems) {
        let system = this.particleSystems[name];
        system.graphics.clear();
        
        for (let i = system.particles.length - 1; i >= 0; i--) {
            let p = system.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.vy += system.config.gravity || 0;
            
            // Update life
            p.life--;
            
            // Calculate alpha based on life
            let lifeRatio = p.life / p.maxLife;
            let alpha = system.config.alpha[0] * lifeRatio + system.config.alpha[1] * (1 - lifeRatio);
            
            // Calculate scale
            let scale = system.config.scale[0] * lifeRatio + system.config.scale[1] * (1 - lifeRatio);
            
            // Update rotation
            if (system.config.rotation) {
                p.rotation += p.rotationSpeed;
            }
            
            // Draw particle
            if (p.life > 0) {
                system.graphics.beginFill(parseInt(p.color.replace('#', ''), 16), alpha);
                system.graphics.drawCircle(p.x, p.y, scale * 3);
                system.graphics.endFill();
            } else {
                system.particles.splice(i, 1);
            }
        }
    }
};

// SCREEN EFFECTS
// ************************************************************************************************
gs.initScreenEffects = function() {
    // Vignette effect
    this.vignette = game.add.graphics(0, 0);
    this.vignette.fixedToCamera = true;
    this.drawVignette();
    
    // Scanlines effect
    this.scanlines = game.add.graphics(0, 0);
    this.scanlines.fixedToCamera = true;
    this.drawScanlines();
    
    // Chromatic aberration effect
    this.chromaticAberration = { enabled: false, intensity: 0 };
};

// Draw vignette effect
// ************************************************************************************************
gs.drawVignette = function() {
    var gradient = this.vignette;
    gradient.clear();
    
    // Create radial gradient for vignette
    var bmp = game.add.bitmapData(SCREEN_WIDTH, SCREEN_HEIGHT);
    var ctx = bmp.context;
    var grd = ctx.createRadialGradient(
        SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT * 0.3,
        SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT * 0.8
    );
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.4)');
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    gradient.loadTexture(bmp);
};

// Draw scanlines effect
// ************************************************************************************************
gs.drawScanlines = function() {
    var bmp = game.add.bitmapData(SCREEN_WIDTH, SCREEN_HEIGHT);
    var ctx = bmp.context;
    
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let y = 0; y < SCREEN_HEIGHT; y += 4) {
        ctx.fillRect(0, y, SCREEN_WIDTH, 2);
    }
    
    this.scanlines.loadTexture(bmp);
};

// ENHANCED TILE EFFECTS
// ************************************************************************************************

// Add glow effect to tiles
// ************************************************************************************************
gs.addTileGlow = function(tileIndex, color, duration) {
    var pos = util.toPosition(tileIndex);
    var glow = game.add.graphics(pos.x, pos.y);
    glow.beginFill(parseInt(color.replace('#', ''), 16), 0.3);
    glow.drawCircle(0, 0, TILE_SIZE * 1.5);
    glow.endFill();
    
    // Animate glow
    var tween = game.add.tween(glow.scale);
    tween.to({ x: 1.5, y: 1.5 }, duration, Phaser.Easing.Quadratic.Out, true);
    
    var alphaTween = game.add.tween(glow);
    alphaTween.to({ alpha: 0 }, duration, Phaser.Easing.Quadratic.Out, true);
    
    alphaTween.onComplete.add(function() {
        glow.destroy();
    });
};

// Add ripple effect to tiles
// ************************************************************************************************
gs.addTileRipple = function(tileIndex, color) {
    var pos = util.toPosition(tileIndex);
    
    for (let i = 0; i < 3; i++) {
        setTimeout(function() {
            var ripple = game.add.graphics(pos.x, pos.y);
            ripple.lineStyle(2, parseInt(color.replace('#', ''), 16), 0.8);
            ripple.drawCircle(0, 0, 10);
            
            var tween = game.add.tween(ripple.scale);
            tween.to({ x: 4, y: 4 }, 600, Phaser.Easing.Quadratic.Out, true);
            
            var alphaTween = game.add.tween(ripple);
            alphaTween.to({ alpha: 0 }, 600, Phaser.Easing.Quadratic.Out, true);
            
            alphaTween.onComplete.add(function() {
                ripple.destroy();
            });
        }, i * 200);
    }
};

// ENHANCED UI EFFECTS
// ************************************************************************************************

// Add hover glow effect to UI elements
// ************************************************************************************************
gs.addUIHoverEffect = function(sprite, glowColor) {
    var originalScale = { x: sprite.scale.x, y: sprite.scale.y };
    
    sprite.inputEnabled = true;
    
    sprite.events.onInputOver.add(function() {
        // Scale up
        game.add.tween(sprite.scale).to({ 
            x: originalScale.x * 1.1, 
            y: originalScale.y * 1.1 
        }, 100, Phaser.Easing.Quadratic.Out, true);
        
        // Add glow
        if (!sprite.glow) {
            sprite.glow = game.add.graphics(0, 0);
            sprite.glow.beginFill(parseInt((glowColor || '#ffffff').replace('#', ''), 16), 0.3);
            sprite.glow.drawRect(-sprite.width/2, -sprite.height/2, sprite.width, sprite.height);
            sprite.glow.endFill();
            sprite.addChild(sprite.glow);
        }
        sprite.glow.visible = true;
    });
    
    sprite.events.onInputOut.add(function() {
        // Scale down
        game.add.tween(sprite.scale).to({ 
            x: originalScale.x, 
            y: originalScale.y 
        }, 100, Phaser.Easing.Quadratic.Out, true);
        
        // Remove glow
        if (sprite.glow) {
            sprite.glow.visible = false;
        }
    });
};

// Add pulse animation to UI elements
// ************************************************************************************************
gs.addUIPulseEffect = function(sprite, scaleAmount, duration) {
    var originalScale = { x: sprite.scale.x, y: sprite.scale.y };
    
    var tween = game.add.tween(sprite.scale);
    tween.to({ 
        x: originalScale.x * (scaleAmount || 1.1), 
        y: originalScale.y * (scaleAmount || 1.1) 
    }, duration || 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    
    return tween;
};

// Shake effect for screen or sprite
// ************************************************************************************************
gs.shakeEffect = function(target, intensity, duration) {
    var originalX = target.x || 0;
    var originalY = target.y || 0;
    var startTime = game.time.now;
    
    var shake = function() {
        var elapsed = game.time.now - startTime;
        if (elapsed < duration) {
            var currentIntensity = intensity * (1 - elapsed / duration);
            target.x = originalX + (Math.random() - 0.5) * currentIntensity;
            target.y = originalY + (Math.random() - 0.5) * currentIntensity;
            requestAnimationFrame(shake);
        } else {
            target.x = originalX;
            target.y = originalY;
        }
    };
    
    shake();
};

// Flash effect
// ************************************************************************************************
gs.flashEffect = function(color, duration, alpha) {
    var flash = game.add.graphics(0, 0);
    flash.fixedToCamera = true;
    flash.beginFill(parseInt((color || '#ffffff').replace('#', ''), 16), alpha || 0.5);
    flash.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    flash.endFill();
    
    var tween = game.add.tween(flash);
    tween.to({ alpha: 0 }, duration || 200, Phaser.Easing.Quadratic.Out, true);
    
    tween.onComplete.add(function() {
        flash.destroy();
    });
};

// ENHANCED BACKGROUND EFFECTS
// ************************************************************************************************

// Create animated background for menus
// ************************************************************************************************
gs.createAnimatedBackground = function(group) {
    var bg = game.add.graphics(0, 0);
    bg.fixedToCamera = true;
    
    // Create gradient background
    var bmp = game.add.bitmapData(SCREEN_WIDTH, SCREEN_HEIGHT);
    var ctx = bmp.context;
    var grd = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    grd.addColorStop(0, '#1a1a2e');
    grd.addColorStop(0.5, '#16213e');
    grd.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    bg.loadTexture(bmp);
    group.add(bg);
    
    // Add floating particles
    this.createFloatingParticles(group);
    
    return bg;
};

// Create floating particles for background
// ************************************************************************************************
gs.createFloatingParticles = function(group) {
    var particles = [];
    
    for (let i = 0; i < 30; i++) {
        var particle = game.add.graphics(
            Math.random() * SCREEN_WIDTH,
            Math.random() * SCREEN_HEIGHT
        );
        particle.fixedToCamera = true;
        
        var size = 2 + Math.random() * 4;
        particle.beginFill(0xffffff, 0.1 + Math.random() * 0.2);
        particle.drawCircle(0, 0, size);
        particle.endFill();
        
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        particle.originalY = particle.y;
        particle.phase = Math.random() * Math.PI * 2;
        
        group.add(particle);
        particles.push(particle);
    }
    
    // Animate particles
    var updateParticles = function() {
        var time = game.time.now / 1000;
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y = p.originalY + Math.sin(time + p.phase) * 20;
            
            // Wrap around screen
            if (p.x < 0) p.x = SCREEN_WIDTH;
            if (p.x > SCREEN_WIDTH) p.x = 0;
        }
    };
    
    // Store update function
    this.updateFloatingParticles = updateParticles;
};

// Update all visual effects (call this in game loop)
// ************************************************************************************************
gs.updateVisualEffects = function() {
    if (!this.visualEffects.enabled) return;
    
    // Update dynamic lights
    if (this.visualEffects.lightingEnabled) {
        this.updateDynamicLights();
    }
    
    // Update particle systems
    this.updateParticleSystems();
    
    // Update floating particles
    if (this.updateFloatingParticles) {
        this.updateFloatingParticles();
    }
};

// Toggle visual effects
// ************************************************************************************************
gs.toggleVisualEffects = function(enabled) {
    this.visualEffects.enabled = enabled;
    
    if (!enabled) {
        // Hide all effects
        if (this.lightSprite) this.lightSprite.visible = false;
        if (this.vignette) this.vignette.visible = false;
        if (this.scanlines) this.scanlines.visible = false;
    } else {
        // Show all effects
        if (this.lightSprite) this.lightSprite.visible = true;
        if (this.vignette) this.vignette.visible = true;
        if (this.scanlines) this.scanlines.visible = true;
    }
};

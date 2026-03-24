/*global game, gs, console, util, Phaser*/
/*global TILE_SIZE, SCALE_FACTOR*/
/*jshint esversion: 6, laxbreak: true*/
'use strict';

// ENHANCED PARTICLE SYSTEM
// Provides advanced particle effects for the game
// ************************************************************************************************

gs.enhancedParticles = {};

// Initialize enhanced particle system
// ************************************************************************************************
gs.initEnhancedParticles = function() {
    this.enhancedParticles.emitters = {};
    this.enhancedParticles.activeEffects = [];
    
    // Create ambient particle emitters
    this.createAmbientEmitters();
};

// Create ambient particle emitters for different environments
// ************************************************************************************************
gs.createAmbientEmitters = function() {
    // Dust particles for dungeon
    this.enhancedParticles.emitters.dust = {
        particles: [],
        maxParticles: 30,
        spawnRate: 0.1,
        color: '#888888',
        alpha: [0.3, 0.1],
        scale: [1, 0.5],
        lifespan: 180,
        velocity: { x: [-0.3, 0.3], y: [-0.2, -0.5] }
    };
    
    // Magic sparkles for magical areas
    this.enhancedParticles.emitters.magic = {
        particles: [],
        maxParticles: 50,
        spawnRate: 0.05,
        colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff8800'],
        alpha: [0.8, 0.2],
        scale: [1.5, 0.5],
        lifespan: 120,
        velocity: { x: [-0.5, 0.5], y: [-0.5, -1.5] },
        rotation: true,
        glow: true
    };
    
    // Fire embers for hot areas
    this.enhancedParticles.emitters.fire = {
        particles: [],
        maxParticles: 40,
        spawnRate: 0.08,
        colors: ['#ff4400', '#ff8800', '#ffcc00', '#ff6600'],
        alpha: [0.9, 0.3],
        scale: [2, 0.8],
        lifespan: 100,
        velocity: { x: [-0.2, 0.2], y: [-1, -2.5] },
        flicker: true
    };
    
    // Ice crystals for cold areas
    this.enhancedParticles.emitters.ice = {
        particles: [],
        maxParticles: 35,
        spawnRate: 0.1,
        colors: ['#aaddff', '#88ccff', '#66bbff'],
        alpha: [0.7, 0.2],
        scale: [1.2, 0.6],
        lifespan: 150,
        velocity: { x: [-0.4, 0.4], y: [0.2, 0.8] },
        rotation: true
    };
    
    // Spores for swamp/jungle
    this.enhancedParticles.emitters.spores = {
        particles: [],
        maxParticles: 45,
        spawnRate: 0.06,
        colors: ['#88ff88', '#66dd66', '#44bb44'],
        alpha: [0.6, 0.15],
        scale: [1, 0.4],
        lifespan: 200,
        velocity: { x: [-0.3, 0.3], y: [-0.1, -0.4] },
        wobble: true
    };
};

// Spawn ambient particles from an emitter
// ************************************************************************************************
gs.spawnAmbientParticles = function(emitterName, x, y, count) {
    var emitter = this.enhancedParticles.emitters[emitterName];
    if (!emitter) return;
    
    var spawnCount = count || 1;
    
    for (let i = 0; i < spawnCount; i++) {
        if (emitter.particles.length >= emitter.maxParticles) break;
        
        var color = emitter.colors ? 
            emitter.colors[Math.floor(Math.random() * emitter.colors.length)] : 
            emitter.color;
        
        var particle = {
            x: x + (Math.random() - 0.5) * TILE_SIZE,
            y: y + (Math.random() - 0.5) * TILE_SIZE * 0.5,
            vx: emitter.velocity.x[0] + Math.random() * (emitter.velocity.x[1] - emitter.velocity.x[0]),
            vy: emitter.velocity.y[0] + Math.random() * (emitter.velocity.y[1] - emitter.velocity.y[0]),
            life: emitter.lifespan,
            maxLife: emitter.lifespan,
            color: color,
            scale: emitter.scale[0],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            phase: Math.random() * Math.PI * 2
        };
        
        // Create sprite for particle
        particle.sprite = game.add.graphics(particle.x, particle.y);
        particle.sprite.beginFill(parseInt(color.replace('#', ''), 16), 1);
        
        if (emitter.rotation) {
            // Draw diamond shape for rotating particles
            particle.sprite.moveTo(0, -3);
            particle.sprite.lineTo(3, 0);
            particle.sprite.lineTo(0, 3);
            particle.sprite.lineTo(-3, 0);
            particle.sprite.endFill();
        } else {
            // Draw circle
            particle.sprite.drawCircle(0, 0, 4);
            particle.sprite.endFill();
        }
        
        // Add glow effect
        if (emitter.glow) {
            particle.sprite.beginFill(parseInt(color.replace('#', ''), 16), 0.3);
            particle.sprite.drawCircle(0, 0, 8);
            particle.sprite.endFill();
        }
        
        gs.projectileSpritesGroup.add(particle.sprite);
        emitter.particles.push(particle);
    }
};

// Update all ambient particles
// ************************************************************************************************
gs.updateAmbientParticles = function() {
    for (let name in this.enhancedParticles.emitters) {
        let emitter = this.enhancedParticles.emitters[name];
        let time = game.time.now / 1000;
        
        for (let i = emitter.particles.length - 1; i >= 0; i--) {
            let p = emitter.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply wobble effect
            if (emitter.wobble) {
                p.x += Math.sin(time * 3 + p.phase) * 0.3;
            }
            
            // Apply flicker effect
            if (emitter.flicker) {
                p.vx += (Math.random() - 0.5) * 0.1;
            }
            
            // Update rotation
            if (emitter.rotation) {
                p.rotation += p.rotationSpeed;
                p.sprite.rotation = p.rotation;
            }
            
            // Update life
            p.life--;
            
            // Calculate visual properties based on life
            let lifeRatio = p.life / p.maxLife;
            let alpha = emitter.alpha[0] * lifeRatio + emitter.alpha[1] * (1 - lifeRatio);
            let scale = emitter.scale[0] * lifeRatio + emitter.scale[1] * (1 - lifeRatio);
            
            // Update sprite
            p.sprite.x = p.x;
            p.sprite.y = p.y;
            p.sprite.alpha = alpha;
            p.sprite.scale.setTo(scale * SCALE_FACTOR * 0.5);
            
            // Remove dead particles
            if (p.life <= 0) {
                p.sprite.destroy();
                emitter.particles.splice(i, 1);
            }
        }
    }
};

// Create burst effect
// ************************************************************************************************
gs.createBurstEffect = function(x, y, color, count, speed) {
    count = count || 10;
    speed = speed || 3;
    
    for (let i = 0; i < count; i++) {
        var angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        var velocity = speed * (0.5 + Math.random() * 0.5);
        
        var particle = {
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 30 + Math.random() * 20,
            maxLife: 30,
            color: color,
            scale: 1,
            sprite: game.add.graphics(x, y)
        };
        
        particle.sprite.beginFill(parseInt(color.replace('#', ''), 16), 0.8);
        particle.sprite.drawCircle(0, 0, 6);
        particle.sprite.endFill();
        
        gs.projectileSpritesGroup.add(particle.sprite);
        
        // Animate particle
        var updateParticle = function() {
            if (particle.life <= 0) {
                particle.sprite.destroy();
                return;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.life--;
            
            var lifeRatio = particle.life / particle.maxLife;
            particle.sprite.x = particle.x;
            particle.sprite.y = particle.y;
            particle.sprite.alpha = lifeRatio;
            particle.sprite.scale.setTo(lifeRatio * SCALE_FACTOR * 0.5);
            
            requestAnimationFrame(updateParticle);
        };
        
        updateParticle();
    }
};

// Create trail effect
// ************************************************************************************************
gs.createTrailEffect = function(sprite, color, density) {
    density = density || 0.3;
    
    if (Math.random() > density) return;
    
    var particle = {
        x: sprite.x + (Math.random() - 0.5) * 10,
        y: sprite.y + (Math.random() - 0.5) * 10,
        life: 20,
        maxLife: 20,
        sprite: game.add.graphics(0, 0)
    };
    
    particle.sprite.beginFill(parseInt(color.replace('#', ''), 16), 0.5);
    particle.sprite.drawCircle(0, 0, 4);
    particle.sprite.endFill();
    particle.sprite.x = particle.x;
    particle.sprite.y = particle.y;
    
    gs.projectileSpritesGroup.add(particle.sprite);
    
    // Fade out animation
    var fadeOut = function() {
        particle.life--;
        if (particle.life <= 0) {
            particle.sprite.destroy();
            return;
        }
        
        var ratio = particle.life / particle.maxLife;
        particle.sprite.alpha = ratio * 0.5;
        particle.sprite.scale.setTo(ratio * SCALE_FACTOR * 0.3);
        
        requestAnimationFrame(fadeOut);
    };
    
    fadeOut();
};

// Create shockwave effect
// ************************************************************************************************
gs.createShockwaveEffect = function(x, y, color, maxRadius) {
    maxRadius = maxRadius || 100;
    
    var rings = 3;
    
    for (let i = 0; i < rings; i++) {
        setTimeout(function() {
            var ring = game.add.graphics(x, y);
            ring.lineStyle(3, parseInt(color.replace('#', ''), 16), 0.8);
            ring.drawCircle(0, 0, 10);
            
            gs.projectileSpritesGroup.add(ring);
            
            var expandTween = game.add.tween(ring.scale);
            expandTween.to({ x: maxRadius / 10, y: maxRadius / 10 }, 400, Phaser.Easing.Quadratic.Out, true);
            
            var fadeTween = game.add.tween(ring);
            fadeTween.to({ alpha: 0 }, 400, Phaser.Easing.Quadratic.Out, true);
            
            fadeTween.onComplete.add(function() {
                ring.destroy();
            });
        }, i * 100);
    }
};

// Create floating text with enhanced effects
// ************************************************************************************************
gs.createEnhancedFloatingText = function(x, y, text, color, size) {
    size = size || '16px';
    
    var style = {
        font: size + ' Arial',
        fill: color,
        stroke: '#000000',
        strokeThickness: 3,
        fontWeight: 'bold'
    };
    
    var textObj = game.add.text(x, y, text, style);
    textObj.anchor.setTo(0.5, 0.5);
    gs.projectileSpritesGroup.add(textObj);
    
    // Animate floating up
    var floatTween = game.add.tween(textObj);
    floatTween.to({ y: y - 40 }, 800, Phaser.Easing.Quadratic.Out, true);
    
    // Fade out
    var fadeTween = game.add.tween(textObj);
    fadeTween.to({ alpha: 0 }, 800, Phaser.Easing.Quadratic.Out, true);
    
    // Scale up then down
    var scaleUp = game.add.tween(textObj.scale);
    scaleUp.to({ x: 1.3, y: 1.3 }, 200, Phaser.Easing.Quadratic.Out, true);
    
    scaleUp.onComplete.add(function() {
        game.add.tween(textObj.scale).to({ x: 0.8, y: 0.8 }, 600, Phaser.Easing.Quadratic.In, true);
    });
    
    fadeTween.onComplete.add(function() {
        textObj.destroy();
    });
};

// Clear all ambient particles
// ************************************************************************************************
gs.clearAmbientParticles = function() {
    for (let name in this.enhancedParticles.emitters) {
        let emitter = this.enhancedParticles.emitters[name];
        for (let i = 0; i < emitter.particles.length; i++) {
            emitter.particles[i].sprite.destroy();
        }
        emitter.particles = [];
    }
};

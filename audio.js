export class AudioManager {
    constructor() {
        this.sounds = {
            hit: this.createSound('asset/audio/sfx/hit.wav'),
            step_grass: this.createSound('asset/audio/sfx/step_grass.wav'),
            step_rock: this.createSound('asset/audio/sfx/step_rock.wav'),
            landing: this.createSound('asset/audio/sfx/landing.wav'),
            jump: this.createSound('asset/audio/sfx/jump.wav'),

            coin: this.createSound('asset/audio/sfx/coin.wav'),
            quest_collect: this.createSound('asset/audio/sfx/quest_collect.wav'),

            potion: this.createSound('asset/audio/sfx/potion.wav'),
            shield: this.createSound('asset/audio/sfx/shield.mp3'),
            shield_block: this.createSound('asset/audio/sfx/shield-block.mp3'),
            bomb: this.createSound('asset/audio/sfx/bomb.wav'),

            warning: this.createSound('asset/audio/enemies/warning.mp3'),

            branch_snap: this.createSound('asset/audio/enemies/branch_snap.mp3'),
            wolf_growl: this.createSound('asset/audio/enemies/wolf_growl.mp3'),
            slime_splat: this.createSound('asset/audio/enemies/slime_splat.mp3'),

            crumble_stalactite: this.createSound('asset/audio/enemies/falling_stalactite.mp3'),
            boulder: this.createSound('asset/audio/enemies/boulder.mp3'),
            spider_crawl: this.createSound('asset/audio/enemies/spider_crawl.mp3'),

            lava_damage: this.createSound('asset/audio/enemies/lava_damage.mp3'),
            fireball: this.createSound('asset/audio/enemies/fireball.mp3'),

            windy: this.createSound('asset/audio/enemies/windy.mp3'),
            meteor: this.createSound('asset/audio/enemies/meteor.mp3'),
        };
    }

    getSfxVolume() {
        return Number(localStorage.getItem("sfxVolume") ?? 0.5);
    }

    isSfxMuted() {
        return localStorage.getItem("sfxMuted") === "true";
    }

    createSound(src) {
        const audio = new Audio(src);
        audio.volume = this.getSfxVolume();
        return audio;
    }

    play(name) {
        if (this.isSfxMuted()) return;

        const sound = this.sounds[name];
        if (sound) {
            const clone = sound.cloneNode();
            clone.volume = this.getSfxVolume();
            clone.play().catch(() => {});
        }
    }
}
export class StoryIntro {
    constructor(game){
        this.game = game;

        this.overlay = document.getElementById("storyOverlay");
        this.textEl = document.getElementById("storyText");
        this.worldLabelEl = document.getElementById("storyWorldLabel");
        this.skipBtn = document.getElementById("storySkipBtn");

        this.active = false;
        this.finished = false;
        this.timers = [];

        this.storyData = {
            forest: [
                "The wind was calm… until it wasn’t.",
                "A sudden strike sent you crashing through the forest. Your broom shattered on impact.",
                "You need something sturdy…",
                "A replacement stick might do."
            ],
            cave: [
                "The stick holds… but barely.",
                "Deep within the cave, webs stronger than steel await.",
                "If you can collect them…",
                "Your broom might survive the journey ahead."
            ],
            volcano: [
                "Your broom is stronger now…",
                "But strength alone won’t lift you higher.",
                "The volcano holds fire rubies, burning with untamed energy.",
                "Harness them… and take flight."
            ],
            sky: [
                "At last… the open sky.",
                "But the winds here are relentless.",
                "Only dragon scales can withstand this storm.",
                "Gather them…",
                "And prove your broom is complete."
            ]
        };

        this.endingData = {
            sky_complete: [
                "Your broom is whole once more…",
                "You can finally fly freely.",
                "But the sky never ends.",
                "How long can you survive?"
            ],
            sky_incomplete: [
                "Your broom is restored…",
                "But something feels off.",
                "It flies… yet not at its full potential.",
                "Perhaps more dragon scales are needed."
            ]
        };

        this.skipBtn.addEventListener("click", () => this.finish());
    }

    playWorldIntro(){
        if (this.game.isEndless) {
            this.finished = true;
            return;
        }

        const lines = this.storyData[this.game.world];
        const worldName = this.game.world.charAt(0).toUpperCase() + this.game.world.slice(1);

        this.start(worldName, lines);
    }

    playSkyEnding(){
        const goodDifficulty = this.game.difficulty === "normal" || this.game.difficulty === "hard";
        const lines = goodDifficulty
            ? this.endingData.sky_complete
            : this.endingData.sky_incomplete;

        this.start("Sky", lines, true);
    }

    start(title, lines, isEnding = false){
        this.clearTimers();

        this.active = true;
        this.finished = false;
        this.game.storyActive = true;
        this.game.storyEndingActive = isEnding;

        this.worldLabelEl.textContent = isEnding ? `${title} Complete` : title;
        this.textEl.innerHTML = "";
        this.overlay.classList.remove("hidden");

        lines.forEach((line, index) => {
            const p = document.createElement("div");
            p.className = "story-line";
            p.textContent = line;
            this.textEl.appendChild(p);

            const delay = 1000 + index * 1400;
            const timer = setTimeout(() => {
                p.classList.add("visible");
            }, delay);

            this.timers.push(timer);
        });

        const totalDuration = 1000 + lines.length * 2000 + 2000;
        const finishTimer = setTimeout(() => this.finish(), totalDuration);
        this.timers.push(finishTimer);
    }

    finish(){
        if (!this.active) return;

        this.clearTimers();
        this.active = false;
        this.finished = true;

        this.overlay.classList.add("hidden");

        setTimeout(() => {
            this.game.storyActive = false;
            this.game.storyEndingActive = false;
        }, 350);
    }

    clearTimers(){
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
}